import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CutterUiTranslations } from '../i18n/types';
import {
  DecodeMediaError,
  M4rUnsupportedError,
  buildOutputFilename,
  computeOutputDuration,
  createSampleAudioBuffer,
  decodeMediaFile,
  detectSilenceBounds,
  encodeM4r,
  encodeMp3,
  encodeWav,
  extractWaveformPeaks,
  formatTime,
  isVideoFile,
  parseTime,
  renderEditedAudioBuffer,
  type CutMode,
  type ExportFormat,
} from '../utils/audioEngine';

interface Props {
  t: CutterUiTranslations;
}

type PlaybackKind = 'none' | 'audition' | 'preview';

const MIN_OUTPUT_SEC = 0.2;
const RULER_HEIGHT = 24;

function formatRulerTick(sec: number): string {
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function chooseTickStep(duration: number, widthPx: number): number {
  const targetTicks = Math.max(4, Math.floor(widthPx / 95));
  const raw = duration / targetTicks;
  const niceSteps = [0.5, 1, 2, 3, 5, 10, 15, 30, 60, 120, 300];
  for (const s of niceSteps) {
    if (s >= raw) return s;
  }
  return 600;
}

export default function Mp3CutterIsland({ t }: Props) {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [extractedFromVideo, setExtractedFromVideo] = useState<boolean>(false);

  const [mode, setMode] = useState<CutMode>('trim');
  const [startSec, setStartSec] = useState<number>(0);
  const [endSec, setEndSec] = useState<number>(0);
  const [startInput, setStartInput] = useState<string>('00:00.00');
  const [endInput, setEndInput] = useState<string>('00:00.00');

  const [fadeInEnabled, setFadeInEnabled] = useState<boolean>(false);
  const [fadeInSec, setFadeInSec] = useState<number>(1.5);
  const [fadeOutEnabled, setFadeOutEnabled] = useState<boolean>(false);
  const [fadeOutSec, setFadeOutSec] = useState<number>(1.5);

  const [zoom, setZoom] = useState<number>(1);
  const [format, setFormat] = useState<ExportFormat>('mp3');
  const [mp3Bitrate, setMp3Bitrate] = useState<number>(192);

  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  // Persistent playhead cursor (never resets on Pause so user can mark Start/End right where they paused!)
  const [cursorSec, setCursorSec] = useState<number>(0);
  const [hoverSec, setHoverSec] = useState<number | null>(null);
  const [playbackKind, setPlaybackKind] = useState<PlaybackKind>('none');
  const [loopPreview, setLoopPreview] = useState<boolean>(false);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | null>(null);

  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [themeRevision, setThemeRevision] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const playbackSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef<number>(0);
  const wasAuditioningRef = useRef<boolean>(false);

  const duration = audioBuffer?.duration ?? 0;
  const activeFadeIn = fadeInEnabled ? fadeInSec : 0;
  const activeFadeOut = fadeOutEnabled ? fadeOutSec : 0;
  const isPlaying = playbackKind !== 'none';

  useEffect(() => {
    cursorRef.current = cursorSec;
  }, [cursorSec]);

  const outputDuration = useMemo(
    () => computeOutputDuration(duration, mode, startSec, endSec),
    [duration, mode, startSec, endSec]
  );

  const peaks = useMemo(() => {
    if (!audioBuffer) return null;
    const buckets = Math.min(2400, Math.max(300, Math.round(360 * zoom)));
    return extractWaveformPeaks(audioBuffer, buckets);
  }, [audioBuffer, zoom]);

  useEffect(() => {
    const onThemeChange = () => setThemeRevision((r) => r + 1);
    window.addEventListener('mp3cutter:themechange', onThemeChange);
    return () => window.removeEventListener('mp3cutter:themechange', onThemeChange);
  }, []);

  useEffect(() => {
    setStartInput(formatTime(startSec));
  }, [startSec]);

  useEffect(() => {
    setEndInput(formatTime(endSec));
  }, [endSec]);

  // Pauses playback cleanly while KEEPING cursorSec frozen in place!
  const pausePlayback = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (playbackSourceRef.current) {
      try {
        playbackSourceRef.current.onended = null;
        playbackSourceRef.current.stop();
        playbackSourceRef.current.disconnect();
      } catch {
        // Ignore already-stopped source
      }
      playbackSourceRef.current = null;
    }
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => {});
      playbackCtxRef.current = null;
    }
    setPlaybackKind('none');
  }, []);

  useEffect(() => {
    return () => pausePlayback();
  }, [pausePlayback]);

  // Only halt preview-cut playback when edit params change; keep full-track audition flowing live!
  useEffect(() => {
    if (playbackKind === 'preview') {
      pausePlayback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, startSec, endSec, fadeInEnabled, fadeInSec, fadeOutEnabled, fadeOutSec, loopPreview]);

  const loadDecodedBuffer = useCallback(
    (buffer: AudioBuffer, name: string, sizeBytes: number, fromVideo: boolean) => {
      pausePlayback();
      setAudioBuffer(buffer);
      setFileName(name);
      setFileSize(sizeBytes);
      setExtractedFromVideo(fromVideo);
      setMode('trim');
      setStartSec(0);
      setEndSec(buffer.duration);
      setCursorSec(0);
      setHoverSec(null);
      setZoom(1);
      setFadeInEnabled(false);
      setFadeOutEnabled(false);
      setErrorMessage('');
      setStatusMessage(
        fromVideo ? `${t.videoExtractedNote} ${t.loadedStatus}` : t.loadedStatus
      );
    },
    [pausePlayback, t.loadedStatus, t.videoExtractedNote]
  );

  const handleFileSelected = useCallback(
    async (file: File) => {
      pausePlayback();
      setErrorMessage('');
      setIsDecoding(true);
      setStatusMessage(t.decodingStatus);
      try {
        const fromVideo = isVideoFile(file);
        const decoded = await decodeMediaFile(file);
        loadDecodedBuffer(decoded, file.name, file.size, fromVideo);
      } catch (err) {
        const msg =
          err instanceof DecodeMediaError && err.detail
            ? `${t.errorDecodeFailed} (${err.detail})`
            : t.errorDecodeFailed;
        setErrorMessage(msg);
        setStatusMessage(msg);
      } finally {
        setIsDecoding(false);
      }
    },
    [loadDecodedBuffer, pausePlayback, t.decodingStatus, t.errorDecodeFailed]
  );

  const handleTrySample = useCallback(async () => {
    pausePlayback();
    setErrorMessage('');
    setIsDecoding(true);
    setStatusMessage(t.decodingStatus);
    try {
      const sample = await createSampleAudioBuffer();
      const approxBytes = sample.length * sample.numberOfChannels * 2;
      loadDecodedBuffer(sample, t.sampleTrackName, approxBytes, false);
    } catch {
      setErrorMessage(t.errorDecodeFailed);
      setStatusMessage(t.errorDecodeFailed);
    } finally {
      setIsDecoding(false);
    }
  }, [loadDecodedBuffer, pausePlayback, t.decodingStatus, t.errorDecodeFailed, t.sampleTrackName]);

  // Audition full original track from ANY position so user can listen & mark Start / End anywhere
  const startAuditionAt = useCallback(
    (fromSec?: number) => {
      if (!audioBuffer) return;
      pausePlayback();
      setErrorMessage('');

      let startOffset = typeof fromSec === 'number' ? fromSec : cursorRef.current;
      if (startOffset >= duration - 0.05) {
        startOffset = 0;
      }
      startOffset = Math.max(0, Math.min(duration - 0.02, startOffset));
      setCursorSec(Number(startOffset.toFixed(3)));

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      playbackCtxRef.current = ctx;
      playbackSourceRef.current = source;

      const startedAtCtx = ctx.currentTime;
      source.onended = () => {
        if (playbackSourceRef.current === source) {
          pausePlayback();
        }
      };
      source.start(0, startOffset);
      setPlaybackKind('audition');

      const tick = () => {
        if (!playbackCtxRef.current) return;
        const pos = startOffset + (playbackCtxRef.current.currentTime - startedAtCtx);
        if (pos >= duration) {
          setCursorSec(Number(duration.toFixed(3)));
          pausePlayback();
          return;
        }
        setCursorSec(Number(pos.toFixed(3)));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [audioBuffer, duration, pausePlayback]
  );

  // Preview exact trimmed / cut result WITH live Fade In & Fade Out (supports Loop!)
  const startCutPreview = useCallback(() => {
    if (!audioBuffer) return;
    pausePlayback();
    setErrorMessage('');

    if (outputDuration < MIN_OUTPUT_SEC) {
      setErrorMessage(t.errorInvalidSelection);
      setStatusMessage(t.errorInvalidSelection);
      return;
    }

    try {
      const rendered = renderEditedAudioBuffer(audioBuffer, {
        mode,
        startSec,
        endSec,
        fadeInSec: activeFadeIn,
        fadeOutSec: activeFadeOut,
      });

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createBufferSource();
      source.buffer = rendered;
      source.loop = loopPreview;
      source.connect(ctx.destination);

      playbackCtxRef.current = ctx;
      playbackSourceRef.current = source;

      const startedAtCtx = ctx.currentTime;
      source.onended = () => {
        if (playbackSourceRef.current === source && !loopPreview) {
          pausePlayback();
        }
      };
      source.start(0, 0);
      setPlaybackKind('preview');

      const tick = () => {
        if (!playbackCtxRef.current) return;
        const rawElapsed = playbackCtxRef.current.currentTime - startedAtCtx;
        if (!loopPreview && rawElapsed >= rendered.duration) {
          pausePlayback();
          return;
        }
        const elapsed = loopPreview
          ? rawElapsed % Math.max(0.01, rendered.duration)
          : Math.min(rendered.duration, rawElapsed);
        const timelinePos =
          mode === 'trim'
            ? startSec + elapsed
            : elapsed < startSec
              ? elapsed
              : endSec + (elapsed - startSec);
        setCursorSec(Number(Math.min(duration, Math.max(0, timelinePos)).toFixed(3)));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setErrorMessage(t.errorInvalidSelection);
    }
  }, [
    activeFadeIn,
    activeFadeOut,
    audioBuffer,
    duration,
    endSec,
    loopPreview,
    mode,
    outputDuration,
    pausePlayback,
    startSec,
    t.errorInvalidSelection,
  ]);

  const updateStart = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, Math.max(0, endSec - 0.1)));
      setStartSec(Number(clamped.toFixed(3)));
    },
    [endSec]
  );

  const updateEnd = useCallback(
    (next: number) => {
      const clamped = Math.min(duration, Math.max(next, Math.min(duration, startSec + 0.1)));
      setEndSec(Number(clamped.toFixed(3)));
    },
    [duration, startSec]
  );

  // One-click Mark-In ("Set Start" at current playhead cursor, shortcut I)
  const handleMarkStartAtCursor = useCallback(() => {
    if (!audioBuffer) return;
    const pos = Math.max(0, Math.min(duration - 0.2, cursorRef.current));
    const rounded = Number(pos.toFixed(3));
    if (rounded >= endSec - 0.1) {
      // User moved playhead past previous End — smartly expand End to track end so Mark Start works seamlessly!
      setStartSec(rounded);
      setEndSec(Number(duration.toFixed(3)));
    } else {
      setStartSec(rounded);
    }
    setErrorMessage('');
    setStatusMessage(`${t.startSetStatus} ${formatTime(rounded)}`);
  }, [audioBuffer, duration, endSec, t.startSetStatus]);

  // One-click Mark-Out ("Set End" at current playhead cursor, shortcut O)
  const handleMarkEndAtCursor = useCallback(() => {
    if (!audioBuffer) return;
    const pos = Math.max(0.2, Math.min(duration, cursorRef.current));
    const rounded = Number(pos.toFixed(3));
    if (rounded <= startSec + 0.1) {
      // User moved playhead before previous Start — smartly reset Start to 0 so Mark End works seamlessly!
      setStartSec(0);
      setEndSec(rounded);
    } else {
      setEndSec(rounded);
    }
    setErrorMessage('');
    setStatusMessage(`${t.endSetStatus} ${formatTime(rounded)}`);
  }, [audioBuffer, duration, startSec, t.endSetStatus]);

  const handleSkipBy = useCallback(
    (deltaSec: number) => {
      if (!audioBuffer) return;
      const next = Math.max(0, Math.min(duration, Number((cursorRef.current + deltaSec).toFixed(3))));
      setCursorSec(next);
      if (playbackKind === 'audition') {
        startAuditionAt(next);
      }
    },
    [audioBuffer, duration, playbackKind, startAuditionAt]
  );

  // Keyboard shortcuts: Space (Play/Pause in place), I (Set Start), O (Set End), P (Preview Cut)
  useEffect(() => {
    if (!audioBuffer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.code === 'Space') {
        if (tag === 'BUTTON') return;
        e.preventDefault();
        if (isPlaying) {
          pausePlayback();
        } else {
          startAuditionAt();
        }
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        handleMarkStartAtCursor();
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        handleMarkEndAtCursor();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (playbackKind === 'preview') {
          pausePlayback();
        } else {
          startCutPreview();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    audioBuffer,
    handleMarkEndAtCursor,
    handleMarkStartAtCursor,
    isPlaying,
    pausePlayback,
    playbackKind,
    startAuditionAt,
    startCutPreview,
  ]);

  // Draw Pro DAW Time Ruler + Grid + Gradient Waveform + Fade Curves + Hover Crosshair + Persistent Playhead
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks || duration <= 0) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const waveTop = RULER_HEIGHT;
    const waveH = h - waveTop;
    const midY = waveTop + waveH / 2;

    const styles = getComputedStyle(document.documentElement);
    const isDark = document.documentElement.classList.contains('dark');
    const waveUnselected = styles.getPropertyValue('--wave-unselected').trim() || '#CFC5B0';
    const waveSelTop = styles.getPropertyValue('--wave-selected-top').trim() || '#4B6987';
    const waveSelBot = styles.getPropertyValue('--wave-selected-bot').trim() || '#7895B2';
    const waveCut = styles.getPropertyValue('--wave-cut').trim() || '#B86B6B';
    const playheadColor = styles.getPropertyValue('--playhead').trim() || '#1C2630';

    ctx.clearRect(0, 0, w, h);

    // 1. DAW Time Ruler Strip
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(28, 38, 48, 0.028)';
    ctx.fillRect(0, 0, w, waveTop);

    ctx.strokeStyle = isDark ? 'rgba(197, 208, 218, 0.14)' : 'rgba(73, 88, 103, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, waveTop - 0.5);
    ctx.lineTo(w, waveTop - 0.5);
    ctx.stroke();

    const tickStep = chooseTickStep(duration, w);
    ctx.font = '500 10px "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';
    ctx.fillStyle = isDark ? 'rgba(197, 208, 218, 0.65)' : 'rgba(73, 88, 103, 0.72)';
    ctx.textBaseline = 'middle';

    for (let sec = 0; sec <= duration + 0.001; sec += tickStep) {
      const x = Math.round((sec / duration) * w) + 0.5;
      ctx.strokeStyle = isDark ? 'rgba(197, 208, 218, 0.22)' : 'rgba(73, 88, 103, 0.24)';
      ctx.beginPath();
      ctx.moveTo(x, waveTop - 7);
      ctx.lineTo(x, waveTop);
      ctx.stroke();

      if (sec > 0 && sec < duration) {
        ctx.strokeStyle = isDark ? 'rgba(197, 208, 218, 0.06)' : 'rgba(73, 88, 103, 0.06)';
        ctx.beginPath();
        ctx.moveTo(x, waveTop);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      if (x < w - 34) {
        ctx.fillText(formatRulerTick(sec), x + 4, waveTop / 2);
      }

      const midSec = sec + tickStep / 2;
      if (midSec < duration) {
        const mx = Math.round((midSec / duration) * w) + 0.5;
        ctx.strokeStyle = isDark ? 'rgba(197, 208, 218, 0.14)' : 'rgba(73, 88, 103, 0.14)';
        ctx.beginPath();
        ctx.moveTo(mx, waveTop - 4);
        ctx.lineTo(mx, waveTop);
        ctx.stroke();
      }
    }

    const startX = (startSec / duration) * w;
    const endX = (endSec / duration) * w;

    // 2. Selection Region Shading
    if (mode === 'trim') {
      ctx.fillStyle = isDark ? 'rgba(120, 149, 178, 0.18)' : 'rgba(174, 189, 202, 0.28)';
      ctx.fillRect(startX, waveTop, Math.max(0, endX - startX), waveH);
    } else {
      ctx.fillStyle = isDark ? 'rgba(120, 149, 178, 0.14)' : 'rgba(174, 189, 202, 0.2)';
      ctx.fillRect(0, waveTop, startX, waveH);
      ctx.fillRect(endX, waveTop, Math.max(0, w - endX), waveH);

      ctx.fillStyle = isDark ? 'rgba(212, 132, 132, 0.16)' : 'rgba(184, 107, 107, 0.12)';
      ctx.fillRect(startX, waveTop, Math.max(0, endX - startX), waveH);

      ctx.save();
      ctx.beginPath();
      ctx.rect(startX, waveTop, Math.max(0, endX - startX), waveH);
      ctx.clip();
      ctx.strokeStyle = isDark ? 'rgba(212, 132, 132, 0.24)' : 'rgba(184, 107, 107, 0.18)';
      ctx.lineWidth = 1;
      for (let x = startX - waveH; x < endX + waveH; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x + waveH, waveTop);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Center axis
    ctx.strokeStyle = isDark ? 'rgba(197, 208, 218, 0.12)' : 'rgba(73, 88, 103, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // 3. Vertical-Gradient Waveform Bars
    const selectedGrad = ctx.createLinearGradient(0, waveTop + 10, 0, h - 10);
    selectedGrad.addColorStop(0, waveSelTop);
    selectedGrad.addColorStop(0.5, waveSelBot);
    selectedGrad.addColorStop(1, waveSelTop);

    const count = peaks.length;
    const step = w / count;
    const barWidth = Math.max(1.4, Math.min(3.2, step * 0.65));
    const maxBarHeight = waveH * 0.41;

    for (let i = 0; i < count; i++) {
      const x = i * step + (step - barWidth) / 2;
      const barTime = ((i + 0.5) / count) * duration;
      const inRange = barTime >= startSec && barTime <= endSec;

      if (mode === 'trim') {
        ctx.fillStyle = inRange ? selectedGrad : waveUnselected;
      } else {
        ctx.fillStyle = inRange ? waveCut : selectedGrad;
      }

      const barH = Math.max(2, peaks[i] * maxBarHeight);
      const y = midY - barH;
      const totalH = barH * 2;

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, totalH, Math.min(1.6, barWidth / 2));
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, totalH);
      }
    }

    // 4. Smooth Live Fade In & Fade Out Envelope Curves
    const fadeStartEdgeX = mode === 'trim' ? startX : 0;
    const fadeEndEdgeX = mode === 'trim' ? endX : w;
    const availableSpanPx = Math.max(0, fadeEndEdgeX - fadeStartEdgeX);

    if (activeFadeIn > 0 && availableSpanPx > 4) {
      const fadePx = Math.min(availableSpanPx * 0.5, (activeFadeIn / duration) * w);
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(245, 239, 230, 0.12)' : 'rgba(67, 96, 126, 0.1)';
      ctx.beginPath();
      ctx.moveTo(fadeStartEdgeX, waveTop);
      ctx.lineTo(fadeStartEdgeX + fadePx, waveTop);
      ctx.bezierCurveTo(
        fadeStartEdgeX + fadePx * 0.45,
        waveTop,
        fadeStartEdgeX + fadePx * 0.45,
        h,
        fadeStartEdgeX,
        h
      );
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isDark ? '#F5EFE6' : '#43607E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fadeStartEdgeX, h - 6);
      ctx.bezierCurveTo(
        fadeStartEdgeX + fadePx * 0.45,
        h - 6,
        fadeStartEdgeX + fadePx * 0.55,
        waveTop + 8,
        fadeStartEdgeX + fadePx,
        waveTop + 8
      );
      ctx.stroke();
      ctx.restore();
    }

    if (activeFadeOut > 0 && availableSpanPx > 4) {
      const fadePx = Math.min(availableSpanPx * 0.5, (activeFadeOut / duration) * w);
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(245, 239, 230, 0.12)' : 'rgba(67, 96, 126, 0.1)';
      ctx.beginPath();
      ctx.moveTo(fadeEndEdgeX, waveTop);
      ctx.lineTo(fadeEndEdgeX - fadePx, waveTop);
      ctx.bezierCurveTo(
        fadeEndEdgeX - fadePx * 0.45,
        waveTop,
        fadeEndEdgeX - fadePx * 0.45,
        h,
        fadeEndEdgeX,
        h
      );
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isDark ? '#F5EFE6' : '#43607E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fadeEndEdgeX - fadePx, waveTop + 8);
      ctx.bezierCurveTo(
        fadeEndEdgeX - fadePx * 0.55,
        waveTop + 8,
        fadeEndEdgeX - fadePx * 0.45,
        h - 6,
        fadeEndEdgeX,
        h - 6
      );
      ctx.stroke();
      ctx.restore();
    }

    // 5. Subtle Hover Crosshair + Timestamp Tooltip
    if (hoverSec !== null && !draggingHandle) {
      const hx = (hoverSec / duration) * w;
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(245, 239, 230, 0.35)' : 'rgba(28, 38, 48, 0.3)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hx, waveTop);
      ctx.lineTo(hx, h);
      ctx.stroke();
      ctx.setLineDash([]);

      const label = formatTime(hoverSec);
      ctx.font = '600 10px "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';
      const tw = ctx.measureText(label).width + 10;
      const boxX = Math.max(4, Math.min(w - tw - 4, hx - tw / 2));
      ctx.fillStyle = isDark ? 'rgba(26, 34, 43, 0.92)' : 'rgba(28, 38, 48, 0.82)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(boxX, h - 22, tw, 17, 4);
        ctx.fill();
      } else {
        ctx.fillRect(boxX, h - 22, tw, 17);
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, boxX + 5, h - 13);
      ctx.restore();
    }

    // 6. Persistent Playhead Cursor Line & Needle Head
    if (cursorSec >= 0 && cursorSec <= duration) {
      const px = (cursorSec / duration) * w;
      ctx.save();
      ctx.strokeStyle = playheadColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(px, waveTop);
      ctx.lineTo(px, h);
      ctx.stroke();

      ctx.fillStyle = playheadColor;
      ctx.beginPath();
      ctx.moveTo(px - 5.5, waveTop - 7);
      ctx.lineTo(px + 5.5, waveTop - 7);
      ctx.lineTo(px, waveTop + 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }, [
    activeFadeIn,
    activeFadeOut,
    cursorSec,
    draggingHandle,
    duration,
    endSec,
    hoverSec,
    mode,
    peaks,
    startSec,
    themeRevision,
  ]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => drawWaveform());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawWaveform]);

  const clientXToSeconds = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || duration <= 0) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  // Trim Handle Pointer Dragging
  const handlePointerDownHandle = (which: 'start' | 'end') => (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingHandle(which);
  };

  const handlePointerMoveHandle = (which: 'start' | 'end') => (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingHandle !== which) return;
    const sec = clientXToSeconds(e.clientX);
    if (which === 'start') {
      updateStart(sec);
    } else {
      updateEnd(sec);
    }
  };

  const handlePointerUpHandle = () => {
    setDraggingHandle(null);
  };

  const handleHandleKeyDown = (which: 'start' | 'end') => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 1 : 0.1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (which === 'start') updateStart(startSec - step);
      else updateEnd(endSec - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (which === 'start') updateStart(startSec + step);
      else updateEnd(endSec + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (which === 'start') updateStart(0);
      else updateEnd(startSec + 0.1);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (which === 'start') updateStart(endSec - 0.1);
      else updateEnd(duration);
    }
  };

  // Smooth Waveform Scrubbing (never auto-plays when paused; seeks seamlessly if already playing)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!audioBuffer || draggingHandle) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const sec = Number(clientXToSeconds(e.clientX).toFixed(3));
    wasAuditioningRef.current = playbackKind === 'audition';
    if (playbackKind !== 'none') {
      pausePlayback();
    }
    setIsScrubbing(true);
    setCursorSec(sec);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!audioBuffer) return;
    const sec = Number(clientXToSeconds(e.clientX).toFixed(3));
    setHoverSec(sec);
    if (isScrubbing) {
      setCursorSec(sec);
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScrubbing) return;
    setIsScrubbing(false);
    const sec = Number(clientXToSeconds(e.clientX).toFixed(3));
    setCursorSec(sec);
    if (wasAuditioningRef.current) {
      wasAuditioningRef.current = false;
      startAuditionAt(sec);
    }
  };

  const handleApplyRingtonePreset = () => {
    if (!audioBuffer) return;
    setMode('trim');
    const targetLen = Math.min(30, duration);
    let nextStart = startSec;
    if (nextStart + targetLen > duration) {
      nextStart = Math.max(0, duration - targetLen);
    }
    const nextEnd = Math.min(duration, nextStart + targetLen);
    setStartSec(Number(nextStart.toFixed(3)));
    setEndSec(Number(nextEnd.toFixed(3)));
    setErrorMessage('');
    setStatusMessage(t.ringtonePresetApplied);
  };

  const handleTrimSilence = () => {
    if (!audioBuffer) return;
    const bounds = detectSilenceBounds(audioBuffer, -40);
    const trimmed = bounds.start > 0.08 || duration - bounds.end > 0.08;
    setMode('trim');
    setStartSec(Number(bounds.start.toFixed(3)));
    setEndSec(Number(bounds.end.toFixed(3)));
    setErrorMessage('');
    setStatusMessage(trimmed ? t.trimSilenceApplied : t.trimSilenceNone);
  };

  const handleStartInputCommit = () => {
    const parsed = parseTime(startInput);
    if (parsed === null) {
      setStartInput(formatTime(startSec));
      return;
    }
    updateStart(parsed);
  };

  const handleEndInputCommit = () => {
    const parsed = parseTime(endInput);
    if (parsed === null) {
      setEndInput(formatTime(endSec));
      return;
    }
    updateEnd(parsed);
  };

  const handleDownload = async () => {
    if (!audioBuffer || isExporting) return;
    pausePlayback();
    setErrorMessage('');

    if (outputDuration < MIN_OUTPUT_SEC) {
      setErrorMessage(t.errorInvalidSelection);
      setStatusMessage(t.errorInvalidSelection);
      return;
    }

    setIsExporting(true);
    setExportProgress(5);
    setStatusMessage(t.exportingStatus);

    try {
      const rendered = renderEditedAudioBuffer(audioBuffer, {
        mode,
        startSec,
        endSec,
        fadeInSec: activeFadeIn,
        fadeOutSec: activeFadeOut,
      });

      let blob: Blob;
      if (format === 'wav') {
        setExportProgress(60);
        await new Promise((r) => setTimeout(r, 15));
        blob = encodeWav(rendered);
        setExportProgress(100);
      } else if (format === 'mp3') {
        blob = await encodeMp3(rendered, mp3Bitrate, (pct) => setExportProgress(pct));
      } else {
        blob = await encodeM4r(rendered, (pct) => setExportProgress(pct));
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = buildOutputFilename(fileName, format);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);

      setStatusMessage(t.exportReadyStatus);
    } catch (err) {
      if (err instanceof M4rUnsupportedError) {
        setErrorMessage(t.errorM4rUnsupported);
        setStatusMessage(t.errorM4rUnsupported);
      } else {
        console.error('[MP3Cutter] Export error:', err);
        const detail = err instanceof Error && err.message ? ` (${err.message})` : '';
        const msg = `${t.errorDecodeFailed}${detail}`;
        setErrorMessage(msg);
        setStatusMessage(msg);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} ${t.fileSizeUnitMb}`;
    }
    return `${Math.max(1, Math.round(bytes / 1024))} ${t.fileSizeUnitKb}`;
  };

  const startPercent = duration > 0 ? (startSec / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endSec / duration) * 100 : 100;
  const handlesClose = endPercent - startPercent < 14;

  return (
    <section
      aria-label="Audio cutter workspace"
      className="rounded-2xl border border-line/90 bg-card shadow-studio overflow-hidden transition-studio"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*,.mp3,.wav,.flac,.ogg,.aac,.m4a,.mp4,.webm,.mov,.mkv"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleFileSelected(file);
            e.target.value = '';
          }
        }}
      />

      {!audioBuffer ? (
        /* Refined Editorial Dropzone */
        <div
          role="region"
          aria-label={t.dropzoneTitle}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFileSelected(file);
          }}
          className={[
            'transition-studio',
            isDraggingFile
              ? 'bg-accent-secondary/25 dark:bg-accent/15 ring-2 ring-inset ring-accent'
              : 'bg-card',
          ].join(' ')}
        >
          <div className="px-6 py-12 sm:px-10 sm:py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-page/90 dark:bg-subtle/60 text-accent-strong shadow-sm">
              {isDecoding ? (
                <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12h2" />
                  <path d="M6 8v8" />
                  <path d="M10 4v16" />
                  <path d="M14 7v10" />
                  <path d="M18 9v6" />
                  <path d="M22 12h-2" />
                </svg>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-[-0.015em] text-ink-primary">
              {isDecoding ? t.decodingStatus : t.dropzoneTitle}
            </h2>
            <p className="mt-1.5 text-sm text-ink-secondary">
              {t.dropzoneSubtitle}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                type="button"
                disabled={isDecoding}
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-[15px] font-semibold"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                <span>{t.selectAudioFile}</span>
              </button>

              <button
                type="button"
                disabled={isDecoding}
                onClick={() => void handleTrySample()}
                className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-line bg-page/70 dark:bg-subtle/45 px-5 py-3 text-[15px] font-semibold text-ink-primary hover:bg-subtle transition-studio"
              >
                <svg
                  className="h-4 w-4 text-accent-strong shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <polygon points="7 4 20 12 7 20 7 4" />
                </svg>
                <span>{t.trySampleAudio}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-line/75 bg-page/55 dark:bg-subtle/25 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-secondary">
            <span className="font-mono tracking-tight">{t.supportedFormatsLabel}</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-primary">
              <svg className="h-3.5 w-3.5 text-accent-strong shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{t.privacyBadge}</span>
            </span>
          </div>
        </div>
      ) : (
        /* Unified Pro DAW Audio Studio Chassis */
        <div className="divide-y divide-line/80 animate-fade-slide">
          {/* ZONE 1: Studio Track Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 bg-card">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-secondary/40 dark:bg-accent/25 text-ink-primary">
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
                    <span className="w-[3px] h-4 rounded-full bg-ink-primary eq-bar-1" />
                    <span className="w-[3px] h-4 rounded-full bg-ink-primary eq-bar-2" />
                    <span className="w-[3px] h-4 rounded-full bg-ink-primary eq-bar-3" />
                  </div>
                ) : (
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-ink-primary">{fileName}</p>
                  {extractedFromVideo && (
                    <span className="hidden sm:inline-flex items-center rounded-md bg-accent-secondary/40 dark:bg-accent/25 px-1.5 py-0.5 text-[11px] font-semibold text-ink-primary">
                      Video → Audio
                    </span>
                  )}
                </div>
                <p className="font-mono tabular-nums text-[11px] text-ink-secondary">
                  {formatTime(duration)} · {(audioBuffer.sampleRate / 1000).toFixed(1)} kHz ·{' '}
                  {audioBuffer.numberOfChannels === 1 ? 'Mono' : 'Stereo'} · {formatFileSize(fileSize)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-line/80 bg-page/70 dark:bg-subtle/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Number((z / 1.5).toFixed(2))))}
                  disabled={zoom <= 1}
                  aria-label={t.zoomOutLabel}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-primary hover:bg-subtle disabled:opacity-35 transition-studio"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  aria-label={t.zoomResetLabel}
                  className="px-2 font-mono tabular-nums text-[11px] font-semibold text-ink-secondary hover:text-ink-primary"
                >
                  {zoom.toFixed(1)}×
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(8, Number((z * 1.5).toFixed(2))))}
                  disabled={zoom >= 8}
                  aria-label={t.zoomInLabel}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-primary hover:bg-subtle disabled:opacity-35 transition-studio"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line/80 bg-page/70 dark:bg-subtle/40 px-3 text-xs font-semibold text-ink-primary hover:bg-subtle transition-studio"
              >
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                <span className="hidden sm:inline">{t.openAnotherFile}</span>
              </button>
            </div>
          </div>

          {/* ZONE 2: DAW Waveform Deck + Interactive Playhead & Mark Start/End Strip */}
          <div className="bg-[var(--bg-deck)] px-4 sm:px-5 pt-3 pb-3">
            <div className="overflow-x-auto rounded-xl border border-line/80 bg-card/70 dark:bg-[#0F141A]">
              <div
                ref={trackRef}
                className="relative h-40 sm:h-44 select-none touch-none"
                style={{ width: `${zoom * 100}%`, minWidth: '100%' }}
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerUp}
                  onPointerCancel={() => setIsScrubbing(false)}
                  onPointerLeave={() => setHoverSec(null)}
                  className="block h-full w-full cursor-crosshair"
                />

                {/* Start Trim Handle */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label={t.startHandleAria}
                  aria-valuemin={0}
                  aria-valuemax={Number(duration.toFixed(2))}
                  aria-valuenow={Number(startSec.toFixed(2))}
                  aria-valuetext={formatTime(startSec)}
                  onPointerDown={handlePointerDownHandle('start')}
                  onPointerMove={handlePointerMoveHandle('start')}
                  onPointerUp={handlePointerUpHandle}
                  onPointerCancel={handlePointerUpHandle}
                  onKeyDown={handleHandleKeyDown('start')}
                  style={{ left: `${startPercent}%`, top: `${RULER_HEIGHT}px` }}
                  className="group absolute bottom-0 -translate-x-1/2 flex w-10 cursor-ew-resize flex-col items-center justify-center focus-visible:outline-none z-20"
                >
                  <span className="h-full w-[2px] bg-[#43607E] dark:bg-[#AEBDCA] transition-studio group-hover:w-[3px]" />
                  <span
                    className={[
                      'absolute top-1/2 -translate-y-1/2 flex h-9 w-[18px] items-center justify-center rounded-md border border-white/80 bg-[#43607E] dark:bg-[#7895B2] text-white shadow-md transition-studio group-focus-visible:ring-4 group-focus-visible:ring-accent/50',
                      draggingHandle === 'start' ? 'scale-110' : 'group-hover:scale-105',
                    ].join(' ')}
                  >
                    <svg className="h-3.5 w-3" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
                      <rect x="2.2" y="3" width="1.4" height="10" rx="0.7" />
                      <rect x="6.2" y="3" width="1.4" height="10" rx="0.7" />
                    </svg>
                  </span>
                  <span
                    className={[
                      'pointer-events-none absolute -top-[21px] rounded bg-[#43607E] dark:bg-[#7895B2] px-1.5 py-[1px] font-mono tabular-nums text-[10px] font-semibold text-white shadow-sm whitespace-nowrap',
                      startPercent < 8 ? 'left-1/2 translate-x-0' : handlesClose ? 'right-1/2 mr-0.5' : '',
                    ].join(' ')}
                  >
                    {formatTime(startSec)}
                  </span>
                </div>

                {/* End Trim Handle */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label={t.endHandleAria}
                  aria-valuemin={0}
                  aria-valuemax={Number(duration.toFixed(2))}
                  aria-valuenow={Number(endSec.toFixed(2))}
                  aria-valuetext={formatTime(endSec)}
                  onPointerDown={handlePointerDownHandle('end')}
                  onPointerMove={handlePointerMoveHandle('end')}
                  onPointerUp={handlePointerUpHandle}
                  onPointerCancel={handlePointerUpHandle}
                  onKeyDown={handleHandleKeyDown('end')}
                  style={{ left: `${endPercent}%`, top: `${RULER_HEIGHT}px` }}
                  className="group absolute bottom-0 -translate-x-1/2 flex w-10 cursor-ew-resize flex-col items-center justify-center focus-visible:outline-none z-20"
                >
                  <span className="h-full w-[2px] bg-[#43607E] dark:bg-[#AEBDCA] transition-studio group-hover:w-[3px]" />
                  <span
                    className={[
                      'absolute top-1/2 -translate-y-1/2 flex h-9 w-[18px] items-center justify-center rounded-md border border-white/80 bg-[#43607E] dark:bg-[#7895B2] text-white shadow-md transition-studio group-focus-visible:ring-4 group-focus-visible:ring-accent/50',
                      draggingHandle === 'end' ? 'scale-110' : 'group-hover:scale-105',
                    ].join(' ')}
                  >
                    <svg className="h-3.5 w-3" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
                      <rect x="2.2" y="3" width="1.4" height="10" rx="0.7" />
                      <rect x="6.2" y="3" width="1.4" height="10" rx="0.7" />
                    </svg>
                  </span>
                  <span
                    className={[
                      'pointer-events-none absolute -top-[21px] rounded bg-[#43607E] dark:bg-[#7895B2] px-1.5 py-[1px] font-mono tabular-nums text-[10px] font-semibold text-white shadow-sm whitespace-nowrap',
                      endPercent > 92 ? 'right-1/2 translate-x-0' : handlesClose ? 'left-1/2 ml-0.5' : '',
                    ].join(' ')}
                  >
                    {formatTime(endSec)}
                  </span>
                </div>
              </div>
            </div>

            {/* Playhead Mark-In/Out (left) + Quick Smart Presets (right) */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line/80 bg-card px-2.5 font-mono tabular-nums text-xs font-semibold text-ink-primary">
                  <span
                    className={[
                      'h-2 w-2 rounded-full transition-studio',
                      isPlaying ? 'bg-[#547290] animate-pulse-soft' : 'bg-ink-secondary/40',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                  <span className="text-ink-secondary font-sans text-[11px] font-medium">{t.cursorLabel}</span>
                  <span>{formatTime(cursorSec)}</span>
                </span>

                <button
                  type="button"
                  onClick={handleMarkStartAtCursor}
                  title={t.setStartTooltip}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-xs font-semibold text-ink-primary hover:bg-subtle hover:border-accent transition-studio"
                >
                  <svg className="h-3.5 w-3.5 text-accent-strong shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 4H5v16h4" />
                    <path d="M13 12h7" />
                    <path d="m16 9-3 3 3 3" />
                  </svg>
                  <span>{t.setStartHere}</span>
                  <kbd className="hidden sm:inline-block rounded bg-subtle/90 px-1 py-[1px] font-mono text-[10px] font-semibold text-ink-secondary">
                    I
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={handleMarkEndAtCursor}
                  title={t.setEndTooltip}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-xs font-semibold text-ink-primary hover:bg-subtle hover:border-accent transition-studio"
                >
                  <svg className="h-3.5 w-3.5 text-accent-strong shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 4h4v16h-4" />
                    <path d="M11 12H4" />
                    <path d="m8 9 3 3-3 3" />
                  </svg>
                  <span>{t.setEndHere}</span>
                  <kbd className="hidden sm:inline-block rounded bg-subtle/90 px-1 py-[1px] font-mono text-[10px] font-semibold text-ink-secondary">
                    O
                  </kbd>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleApplyRingtonePreset}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line/85 bg-card px-2.5 text-xs font-semibold text-ink-primary hover:bg-subtle transition-studio"
                >
                  <svg className="h-3.5 w-3.5 text-accent-strong shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>{t.ringtonePresetLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTrimSilence}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line/85 bg-card px-2.5 text-xs font-semibold text-ink-primary hover:bg-subtle transition-studio"
                >
                  <svg className="h-3.5 w-3.5 text-accent-strong shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                    <path d="M2 12h3" />
                    <path d="M19 12h3" />
                    <path d="M8 6v12" />
                    <path d="M12 3v18" />
                    <path d="M16 6v12" />
                  </svg>
                  <span>{t.trimSilenceLabel}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ZONE 3: Single-Row Aligned Transport (Play + ±2s + Preview Cut + Loop) & Cut Mode Switch */}
          <div className="px-4 sm:px-5 py-2.5 bg-card flex flex-wrap items-center justify-between gap-2.5">
            {/* Transport & Audition Controls */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Play / Pause Full Track from Playhead Cursor */}
              <button
                type="button"
                onClick={() => (playbackKind === 'audition' ? pausePlayback() : startAuditionAt())}
                className="btn-primary inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs sm:text-[13px] font-semibold"
              >
                {playbackKind === 'audition' ? (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span>{t.pausePreview}</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                    <span>{t.playPreview}</span>
                  </>
                )}
              </button>

              {/* ±2s Cursor Skip */}
              <div className="inline-flex items-center rounded-xl border border-line/80 bg-page/65 dark:bg-subtle/35 p-0.5">
                <button
                  type="button"
                  onClick={() => handleSkipBy(-2)}
                  aria-label={t.skipBackLabel}
                  title={t.skipBackLabel}
                  className="inline-flex h-8 px-2 items-center justify-center rounded-lg font-mono text-[11px] font-semibold text-ink-secondary hover:bg-subtle hover:text-ink-primary transition-studio"
                >
                  −2s
                </button>
                <button
                  type="button"
                  onClick={() => handleSkipBy(2)}
                  aria-label={t.skipForwardLabel}
                  title={t.skipForwardLabel}
                  className="inline-flex h-8 px-2 items-center justify-center rounded-lg font-mono text-[11px] font-semibold text-ink-secondary hover:bg-subtle hover:text-ink-primary transition-studio"
                >
                  +2s
                </button>
              </div>

              {/* Preview Cut (Audition exact edited output + fades) + Loop */}
              <div className="inline-flex items-center rounded-xl border border-line/80 bg-page/65 dark:bg-subtle/35 p-0.5 gap-0.5">
                <button
                  type="button"
                  aria-pressed={playbackKind === 'preview'}
                  onClick={() => (playbackKind === 'preview' ? pausePlayback() : startCutPreview())}
                  className={[
                    'inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-xs font-semibold transition-studio',
                    playbackKind === 'preview'
                      ? 'bg-[#547290] text-white shadow-sm'
                      : 'text-ink-primary hover:bg-subtle',
                  ].join(' ')}
                >
                  {playbackKind === 'preview' ? (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 text-accent-strong" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                  <span>{t.previewCut}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={loopPreview}
                  aria-label={t.loopLabel}
                  title={t.loopLabel}
                  onClick={() => setLoopPreview((v) => !v)}
                  className={[
                    'inline-flex h-8 w-8 items-center justify-center rounded-[9px] transition-studio',
                    loopPreview
                      ? 'bg-[#547290] text-white'
                      : 'text-ink-secondary hover:bg-subtle hover:text-ink-primary',
                  ].join(' ')}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m17 2 4 4-4 4" />
                    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                    <path d="m7 22-4-4 4-4" />
                    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Segmented Trim / Cut Switch */}
            <div
              role="group"
              aria-label={t.modeGroupLabel}
              className="inline-flex rounded-xl border border-line/80 bg-page/75 dark:bg-subtle/40 p-0.5 gap-0.5"
            >
              <button
                type="button"
                aria-pressed={mode === 'trim'}
                onClick={() => setMode('trim')}
                className={[
                  'inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-xs font-semibold transition-studio',
                  mode === 'trim'
                    ? 'bg-[#547290] text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary',
                ].join(' ')}
              >
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M6 4v16" />
                  <path d="M18 4v16" />
                  <path d="M6 12h12" />
                </svg>
                <span>{t.modeKeepLabel}</span>
              </button>

              <button
                type="button"
                aria-pressed={mode === 'cut'}
                onClick={() => setMode('cut')}
                className={[
                  'inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-xs font-semibold transition-studio',
                  mode === 'cut'
                    ? 'bg-[#547290] text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary',
                ].join(' ')}
              >
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" x2="8.12" y1="4" y2="15.88" />
                  <line x1="14.47" x2="20" y1="14.48" y2="20" />
                  <line x1="8.12" x2="12" y1="8.12" y2="12" />
                </svg>
                <span>{t.modeRemoveLabel}</span>
              </button>
            </div>
          </div>

          {/* ZONE 4: Unified 4-Column Precision Strip (Start · End · Fade In · Fade Out) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/70 bg-page/40 dark:bg-subtle/20">
            {/* Start Time */}
            <div className="px-4 py-3">
              <label htmlFor="cut-start-input" className="block text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                {t.startLabel}
              </label>
              <div className="mt-1.5 flex items-center rounded-lg border border-line/85 bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateStart(startSec - 0.1)}
                  aria-label={`${t.startLabel} -0.1s`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-base font-semibold text-ink-secondary hover:bg-subtle hover:text-ink-primary transition-studio"
                >
                  −
                </button>
                <input
                  id="cut-start-input"
                  type="text"
                  inputMode="decimal"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  onBlur={handleStartInputCommit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStartInputCommit();
                  }}
                  className="h-9 w-full min-w-0 bg-transparent px-1 text-center font-mono tabular-nums text-sm font-semibold text-ink-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateStart(startSec + 0.1)}
                  aria-label={`${t.startLabel} +0.1s`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-base font-semibold text-ink-secondary hover:bg-subtle hover:text-ink-primary transition-studio"
                >
                  +
                </button>
              </div>
            </div>

            {/* End Time */}
            <div className="px-4 py-3">
              <label htmlFor="cut-end-input" className="block text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                {t.endLabel}
              </label>
              <div className="mt-1.5 flex items-center rounded-lg border border-line/85 bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateEnd(endSec - 0.1)}
                  aria-label={`${t.endLabel} -0.1s`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-base font-semibold text-ink-secondary hover:bg-subtle hover:text-ink-primary transition-studio"
                >
                  −
                </button>
                <input
                  id="cut-end-input"
                  type="text"
                  inputMode="decimal"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  onBlur={handleEndInputCommit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEndInputCommit();
                  }}
                  className="h-9 w-full min-w-0 bg-transparent px-1 text-center font-mono tabular-nums text-sm font-semibold text-ink-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateEnd(endSec + 0.1)}
                  aria-label={`${t.endLabel} +0.1s`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-base font-semibold text-ink-secondary hover:bg-subtle hover:text-ink-primary transition-studio"
                >
                  +
                </button>
              </div>
            </div>

            {/* Fade In */}
            <div className="px-4 py-3 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-pressed={fadeInEnabled}
                  onClick={() => setFadeInEnabled((v) => !v)}
                  className={[
                    'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-studio border',
                    fadeInEnabled
                      ? 'bg-[#547290] border-[#547290] text-white'
                      : 'bg-card border-line text-ink-primary hover:bg-subtle',
                  ].join(' ')}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M3 19C9 19 13 5 21 5" />
                  </svg>
                  <span>{t.fadeInLabel}</span>
                </button>
                <span className="font-mono tabular-nums text-xs font-semibold text-ink-primary">
                  {(fadeInEnabled ? fadeInSec : 0).toFixed(1)}{t.secondsShort}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={fadeInEnabled ? fadeInSec : 0}
                aria-label={`${t.fadeInLabel} (${t.secondsShort})`}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFadeInSec(val);
                  setFadeInEnabled(val > 0);
                }}
                className="studio-range mt-3 w-full"
              />
            </div>

            {/* Fade Out */}
            <div className="px-4 py-3 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-pressed={fadeOutEnabled}
                  onClick={() => setFadeOutEnabled((v) => !v)}
                  className={[
                    'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-studio border',
                    fadeOutEnabled
                      ? 'bg-[#547290] border-[#547290] text-white'
                      : 'bg-card border-line text-ink-primary hover:bg-subtle',
                  ].join(' ')}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M3 5c8 0 12 14 18 14" />
                  </svg>
                  <span>{t.fadeOutLabel}</span>
                </button>
                <span className="font-mono tabular-nums text-xs font-semibold text-ink-primary">
                  {(fadeOutEnabled ? fadeOutSec : 0).toFixed(1)}{t.secondsShort}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={fadeOutEnabled ? fadeOutSec : 0}
                aria-label={`${t.fadeOutLabel} (${t.secondsShort})`}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFadeOutSec(val);
                  setFadeOutEnabled(val > 0);
                }}
                className="studio-range mt-3 w-full"
              />
            </div>
          </div>

          {/* ZONE 5: Integrated Export Dock */}
          <div className="bg-subtle/40 px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center rounded-xl border border-line/85 bg-card p-0.5 gap-0.5" role="group" aria-label={t.outputFormatLabel}>
                {(['mp3', 'wav', 'm4r'] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    aria-pressed={format === fmt}
                    onClick={() => setFormat(fmt)}
                    className={[
                      'h-9 rounded-[9px] px-3.5 text-xs font-bold uppercase tracking-wider transition-studio',
                      format === fmt
                        ? 'bg-[#547290] text-white shadow-sm'
                        : 'text-ink-secondary hover:text-ink-primary',
                    ].join(' ')}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {format === 'mp3' && (
                <div
                  className="inline-flex items-center rounded-xl border border-line/85 bg-card p-0.5 gap-0.5"
                  role="group"
                  aria-label={t.bitrateLabel}
                >
                  {[128, 192, 320].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      aria-pressed={mp3Bitrate === rate}
                      onClick={() => setMp3Bitrate(rate)}
                      className={[
                        'h-9 rounded-[9px] px-2.5 font-mono text-xs font-semibold transition-studio',
                        mp3Bitrate === rate
                          ? 'bg-subtle text-ink-primary'
                          : 'text-ink-secondary hover:text-ink-primary',
                      ].join(' ')}
                    >
                      {rate}k
                    </button>
                  ))}
                </div>
              )}

              {format === 'm4r' && outputDuration > 40 && (
                <span className="text-xs font-medium text-ink-secondary">
                  {t.m4rRingtoneNote}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-card/80 border border-line/70 px-2.5 py-1.5 font-mono tabular-nums text-xs font-semibold text-ink-primary">
                <span className="font-sans text-[11px] font-medium text-ink-secondary">{t.outputDurationLabel}:</span>
                <span>{formatTime(outputDuration)}</span>
              </span>
            </div>

            <button
              type="button"
              disabled={isExporting || outputDuration < MIN_OUTPUT_SEC}
              onClick={() => void handleDownload()}
              className="btn-primary relative overflow-hidden inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm sm:text-[15px] font-semibold"
            >
              {isExporting && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 bg-white/15 transition-all duration-150"
                  style={{ width: `${exportProgress}%` }}
                />
              )}
              {isExporting ? (
                <>
                  <svg className="h-4 w-4 animate-spin shrink-0 relative z-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-95" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
                  </svg>
                  <span className="relative z-10 font-mono tabular-nums">
                    {t.exportingStatus} ({exportProgress}%)
                  </span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  <span>
                    {t.downloadButton} (.{format.toUpperCase()})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Accessible Live Status Region */}
      <div
        role="status"
        aria-live="polite"
        className={[
          'px-5 py-2.5 text-xs font-medium border-t border-line/75 transition-studio',
          errorMessage
            ? 'bg-red-500/10 text-red-800 dark:text-red-200'
            : statusMessage
              ? 'bg-page/60 dark:bg-subtle/30 text-ink-secondary'
              : 'sr-only',
        ].join(' ')}
      >
        {errorMessage || statusMessage}
      </div>
    </section>
  );
}
