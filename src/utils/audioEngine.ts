export type CutMode = 'trim' | 'cut';
export type ExportFormat = 'mp3' | 'wav' | 'm4r';

export interface EditOptions {
  mode: CutMode;
  startSec: number;
  endSec: number;
  fadeInSec: number;
  fadeOutSec: number;
}

export class M4rUnsupportedError extends Error {
  constructor() {
    super('M4R_UNSUPPORTED');
    this.name = 'M4rUnsupportedError';
  }
}

export class DecodeMediaError extends Error {
  detail?: string;
  constructor(detail?: string) {
    super(detail || 'DECODE_FAILED');
    this.name = 'DecodeMediaError';
    this.detail = detail;
  }
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|mkv|m4v|ogv)$/i;
const MP3_EXTENSIONS = /\.(mp3|mp2|mp1|mpeg|mpg)$/i;
const VALID_MP3_RATES = new Set([8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000]);

function createAudioContext(): AudioContext {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new Ctx();
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/') || VIDEO_EXTENSIONS.test(file.name);
}

async function decodeWithWebAudio(buffer: ArrayBuffer): Promise<AudioBuffer> {
  if (typeof OfflineAudioContext !== 'undefined') {
    try {
      const offline = new OfflineAudioContext(2, 1, 44100);
      return await offline.decodeAudioData(buffer);
    } catch {
      // Fallback to standard AudioContext below
    }
  }
  const ctx = createAudioContext();
  try {
    return await ctx.decodeAudioData(buffer);
  } finally {
    ctx.close().catch(() => {});
  }
}

function findMpegSyncOffset(bytes: Uint8Array): number {
  let start = 0;
  // Skip ID3v2 header if present ("ID3" + version + flags + 4 syncsafe size bytes)
  if (
    bytes.length > 10 &&
    bytes[0] === 0x49 &&
    bytes[1] === 0x44 &&
    bytes[2] === 0x33
  ) {
    const tagSize =
      ((bytes[6] & 0x7f) << 21) |
      ((bytes[7] & 0x7f) << 14) |
      ((bytes[8] & 0x7f) << 7) |
      (bytes[9] & 0x7f);
    start = Math.min(bytes.length, 10 + tagSize);
  }

  const searchLimit = Math.min(bytes.length - 4, start + 256 * 1024);
  for (let i = start; i < searchLimit; i++) {
    // MPEG frame sync: 11 set bits (0xFF followed by 0xE0 mask), valid version (!= 01), valid layer (!= 00)
    if (
      bytes[i] === 0xff &&
      (bytes[i + 1] & 0xe0) === 0xe0 &&
      (bytes[i + 1] & 0x18) !== 0x08 &&
      (bytes[i + 1] & 0x06) !== 0x00 &&
      (bytes[i + 2] & 0xf0) !== 0xf0 &&
      (bytes[i + 2] & 0x0c) !== 0x0c
    ) {
      return i;
    }
  }
  return -1;
}

function tryDecodeWavFallback(bytes: Uint8Array): AudioBuffer | null {
  if (bytes.length < 44) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (off: number) =>
    String.fromCharCode(bytes[off], bytes[off + 1], bytes[off + 2], bytes[off + 3]);

  if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return null;

  let offset = 12;
  let audioFormat = 0;
  let channels = 0;
  let sampleRate = 0;
  let bitsPerSample = 0;
  let dataOffset = -1;
  let dataSize = 0;

  while (offset + 8 <= bytes.length) {
    const chunkId = tag(offset);
    const chunkSize = view.getUint32(offset + 4, true);
    const chunkBody = offset + 8;

    if (chunkId === 'fmt ' && chunkBody + 16 <= bytes.length) {
      audioFormat = view.getUint16(chunkBody, true);
      channels = view.getUint16(chunkBody + 2, true);
      sampleRate = view.getUint32(chunkBody + 4, true);
      bitsPerSample = view.getUint16(chunkBody + 14, true);
      // WAVE_FORMAT_EXTENSIBLE (0xFFFE): real subformat code lives at byte 24 of fmt body
      if (audioFormat === 0xfffe && chunkBody + 26 <= bytes.length) {
        audioFormat = view.getUint16(chunkBody + 24, true);
      }
    } else if (chunkId === 'data') {
      dataOffset = chunkBody;
      dataSize = Math.min(chunkSize || bytes.length - chunkBody, bytes.length - chunkBody);
      break;
    }

    offset = chunkBody + chunkSize + (chunkSize % 2);
  }

  if (
    dataOffset < 0 ||
    dataSize <= 0 ||
    channels < 1 ||
    channels > 8 ||
    sampleRate < 4000 ||
    (audioFormat !== 1 && audioFormat !== 3)
  ) {
    return null;
  }

  const bytesPerSample = bitsPerSample / 8;
  if (![1, 2, 3, 4].includes(bytesPerSample)) return null;

  const frameBytes = bytesPerSample * channels;
  const numFrames = Math.floor(dataSize / frameBytes);
  if (numFrames <= 0) return null;

  const audioBuffer = new AudioBuffer({
    length: numFrames,
    numberOfChannels: channels,
    sampleRate,
  });

  const outChannels: Float32Array[] = [];
  for (let c = 0; c < channels; c++) {
    outChannels.push(audioBuffer.getChannelData(c));
  }

  let pos = dataOffset;
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < channels; c++) {
      let sample = 0;
      if (audioFormat === 3 && bytesPerSample === 4) {
        sample = view.getFloat32(pos, true);
      } else if (bytesPerSample === 1) {
        sample = (bytes[pos] - 128) / 128;
      } else if (bytesPerSample === 2) {
        sample = view.getInt16(pos, true) / 32768;
      } else if (bytesPerSample === 3) {
        const val = bytes[pos] | (bytes[pos + 1] << 8) | (bytes[pos + 2] << 16);
        sample = (val & 0x800000 ? val | ~0xffffff : val) / 8388608;
      } else if (bytesPerSample === 4) {
        sample = view.getInt32(pos, true) / 2147483648;
      }
      outChannels[c][i] = Math.max(-1, Math.min(1, sample));
      pos += bytesPerSample;
    }
  }

  return audioBuffer;
}

async function tryDecodeMp3Wasm(bytes: Uint8Array): Promise<AudioBuffer | null> {
  const { MPEGDecoder } = await import('mpg123-decoder');
  const decoder = new MPEGDecoder();
  try {
    await decoder.ready;
    const { channelData, samplesDecoded, sampleRate } = decoder.decode(bytes);
    if (!samplesDecoded || !channelData.length || !sampleRate) {
      return null;
    }
    const audioBuffer = new AudioBuffer({
      length: samplesDecoded,
      numberOfChannels: channelData.length,
      sampleRate,
    });
    for (let c = 0; c < channelData.length; c++) {
      audioBuffer.getChannelData(c).set(channelData[c].subarray(0, samplesDecoded));
    }
    return audioBuffer;
  } finally {
    decoder.free();
  }
}

function detectContainerHint(bytes: Uint8Array): string {
  if (bytes.length === 0) return 'Empty file (0 bytes).';
  const headText = new TextDecoder('ascii', { fatal: false })
    .decode(bytes.subarray(0, Math.min(64, bytes.length)))
    .trimStart();
  if (headText.startsWith('<!DOCTYPE') || headText.startsWith('<html') || headText.startsWith('<HTML')) {
    return 'This file contains an HTML webpage rather than audio data.';
  }
  if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return 'This MP4/M4A/MOV container uses an audio codec (such as ALAC, AC-3, or DRM) not supported by this browser.';
  }
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return 'This MKV/WebM file uses an unsupported audio codec (such as AC-3 or DTS).';
  }
  if (bytes[0] === 0x30 && bytes[1] === 0x26 && bytes[2] === 0xb2 && bytes[3] === 0x75) {
    return 'WMA (Windows Media Audio) is not natively supported by web browsers.';
  }
  return '';
}

export async function decodeMediaFile(file: File): Promise<AudioBuffer> {
  if (file.size === 0) {
    throw new DecodeMediaError('This file is empty (0 bytes).');
  }

  // Stage 1: Native Web Audio API fast path (zero RAM duplication)
  try {
    const primaryBuf = await file.arrayBuffer();
    return await decodeWithWebAudio(primaryBuf);
  } catch (primaryErr) {
    console.warn('[MP3Cutter] Native Web Audio decode failed, trying resilient fallbacks:', primaryErr);
  }

  // Read fresh non-detached bytes for fallback decoders
  const rawBytes = new Uint8Array(await file.arrayBuffer());

  // Stage 2: Resilient RIFF/WAVE fallback (24-bit/32-bit/extensible/imperfect WAV headers)
  if (rawBytes.length >= 44 && rawBytes[0] === 0x52 && rawBytes[1] === 0x49 && rawBytes[2] === 0x46 && rawBytes[3] === 0x46) {
    try {
      const wavBuffer = tryDecodeWavFallback(rawBytes);
      if (wavBuffer) return wavBuffer;
    } catch (wavErr) {
      console.warn('[MP3Cutter] WAV fallback failed:', wavErr);
    }
  }

  // Stage 3: Strip malformed/oversized ID3v2 tags or junk bytes & retry Web Audio API
  const syncOffset = findMpegSyncOffset(rawBytes);
  if (syncOffset > 0) {
    try {
      const cleanSlice = rawBytes.slice(syncOffset).buffer;
      return await decodeWithWebAudio(cleanSlice);
    } catch {
      // Continue to pure WASM MP3 decoder below
    }
  }

  // Stage 4: Pure WebAssembly mpg123-decoder fallback for MP3/MPEG (works even without native browser MP3 codec)
  const looksLikeMp3 =
    MP3_EXTENSIONS.test(file.name) ||
    file.type === 'audio/mpeg' ||
    file.type === 'audio/mp3' ||
    syncOffset >= 0 ||
    (rawBytes.length > 3 && rawBytes[0] === 0x49 && rawBytes[1] === 0x44 && rawBytes[2] === 0x33);

  if (looksLikeMp3) {
    try {
      const mp3Input = syncOffset > 0 ? rawBytes.subarray(syncOffset) : rawBytes;
      const wasmDecoded = await tryDecodeMp3Wasm(mp3Input);
      if (wasmDecoded) return wasmDecoded;
    } catch (wasmErr) {
      console.warn('[MP3Cutter] WASM MP3 fallback failed:', wasmErr);
    }
  }

  const hint = detectContainerHint(rawBytes);
  throw new DecodeMediaError(hint);
}

/**
 * Generates an 18-second warm melodic stereo sample track 100% locally using OfflineAudioContext,
 * including subtle 0.7s leading/trailing silence so users can test Trim Silence & Fade controls immediately.
 */
export async function createSampleAudioBuffer(): Promise<AudioBuffer> {
  const sampleRate = 44100;
  const duration = 18;
  const offline = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

  const master = offline.createGain();
  master.gain.setValueAtTime(0.68, 0);
  master.connect(offline.destination);

  // Subtle stereo delay / ambience
  const delayL = offline.createDelay(0.5);
  const delayR = offline.createDelay(0.5);
  delayL.delayTime.value = 0.22;
  delayR.delayTime.value = 0.28;
  const wetGain = offline.createGain();
  wetGain.gain.value = 0.22;
  const merger = offline.createChannelMerger(2);
  delayL.connect(merger, 0, 0);
  delayR.connect(merger, 0, 1);
  merger.connect(wetGain);
  wetGain.connect(master);

  // Warm progression: Cmaj9 -> Am9 -> Fmaj7 -> G6 (16 seconds of music from 0.8s to 17.0s)
  const chords: { start: number; len: number; notes: number[]; bass: number }[] = [
    { start: 0.8, len: 4.0, notes: [261.63, 329.63, 392.0, 493.88, 587.33], bass: 130.81 },
    { start: 4.8, len: 4.0, notes: [220.0, 261.63, 329.63, 392.0, 493.88], bass: 110.0 },
    { start: 8.8, len: 4.0, notes: [174.61, 220.0, 261.63, 329.63, 392.0], bass: 87.31 },
    { start: 12.8, len: 4.2, notes: [196.0, 246.94, 293.66, 329.63, 392.0], bass: 98.0 },
  ];

  for (const chord of chords) {
    // Warm pad voice
    chord.notes.forEach((freq, idx) => {
      const osc = offline.createOscillator();
      const gain = offline.createGain();
      const filter = offline.createBiquadFilter();
      const panner = offline.createStereoPanner();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, chord.start);
      osc.detune.setValueAtTime((idx - 2) * 3.5, chord.start);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, chord.start);
      filter.frequency.exponentialRampToValueAtTime(650, chord.start + chord.len);

      panner.pan.setValueAtTime((idx - 2) * 0.25, chord.start);

      gain.gain.setValueAtTime(0.0001, chord.start);
      gain.gain.linearRampToValueAtTime(0.095, chord.start + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.035, chord.start + chord.len - 0.2);
      gain.gain.linearRampToValueAtTime(0.0001, chord.start + chord.len);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(panner);
      panner.connect(master);
      panner.connect(delayL);
      panner.connect(delayR);

      osc.start(chord.start);
      osc.stop(chord.start + chord.len + 0.05);
    });

    // Warm sub/bass pulse
    const bassOsc = offline.createOscillator();
    const bassGain = offline.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord.bass, chord.start);
    bassGain.gain.setValueAtTime(0.0001, chord.start);
    bassGain.gain.linearRampToValueAtTime(0.24, chord.start + 0.06);
    bassGain.gain.exponentialRampToValueAtTime(0.09, chord.start + chord.len - 0.15);
    bassGain.gain.linearRampToValueAtTime(0.0001, chord.start + chord.len);
    bassOsc.connect(bassGain);
    bassGain.connect(master);
    bassOsc.start(chord.start);
    bassOsc.stop(chord.start + chord.len + 0.05);

    // Rhythmic bell/pluck arpeggio notes for dynamic waveform peaks
    const step = 0.5;
    for (let stepIdx = 0; stepIdx < Math.floor(chord.len / step); stepIdx++) {
      const t = chord.start + stepIdx * step;
      const noteFreq = chord.notes[stepIdx % chord.notes.length] * 2;
      const pluck = offline.createOscillator();
      const pGain = offline.createGain();
      const pan = offline.createStereoPanner();

      pluck.type = 'sine';
      pluck.frequency.setValueAtTime(noteFreq, t);
      pan.pan.setValueAtTime(stepIdx % 2 === 0 ? -0.35 : 0.35, t);

      const amp = stepIdx % 4 === 0 ? 0.16 : 0.1;
      pGain.gain.setValueAtTime(0.0001, t);
      pGain.gain.linearRampToValueAtTime(amp, t + 0.015);
      pGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.45);

      pluck.connect(pGain);
      pGain.connect(pan);
      pan.connect(master);
      pan.connect(delayL);
      pan.connect(delayR);

      pluck.start(t);
      pluck.stop(t + 0.48);
    }
  }

  return offline.startRendering();
}

export function extractWaveformPeaks(buffer: AudioBuffer, bucketCount: number): Float32Array {
  const safeBuckets = Math.max(32, Math.floor(bucketCount));
  const peaks = new Float32Array(safeBuckets);
  const channels = buffer.numberOfChannels;
  const totalSamples = buffer.length;
  const samplesPerBucket = totalSamples / safeBuckets;

  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < channels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  let globalMax = 0.001;
  for (let i = 0; i < safeBuckets; i++) {
    const start = Math.floor(i * samplesPerBucket);
    const end = Math.min(totalSamples, Math.floor((i + 1) * samplesPerBucket));
    const stride = Math.max(1, Math.floor((end - start) / 128));
    let bucketPeak = 0;
    for (let s = start; s < end; s += stride) {
      let val = 0;
      for (let ch = 0; ch < channels; ch++) {
        val += Math.abs(channelData[ch][s]);
      }
      val /= channels;
      if (val > bucketPeak) bucketPeak = val;
    }
    peaks[i] = bucketPeak;
    if (bucketPeak > globalMax) globalMax = bucketPeak;
  }

  // Soft normalization so quiet voice recordings remain clearly visible
  const scale = globalMax < 0.85 ? 0.9 / globalMax : 1 / globalMax;
  for (let i = 0; i < safeBuckets; i++) {
    peaks[i] = Math.min(1, peaks[i] * scale);
  }
  return peaks;
}

export function detectSilenceBounds(
  buffer: AudioBuffer,
  thresholdDb = -40
): { start: number; end: number } {
  const threshold = Math.pow(10, thresholdDb / 20);
  const sampleRate = buffer.sampleRate;
  const windowSize = Math.max(1, Math.floor(sampleRate * 0.02)); // 20ms windows
  const totalSamples = buffer.length;
  const channels = buffer.numberOfChannels;
  const data: Float32Array[] = [];
  for (let c = 0; c < channels; c++) {
    data.push(buffer.getChannelData(c));
  }

  const windowCount = Math.floor(totalSamples / windowSize);
  let firstActive = -1;
  let lastActive = -1;

  for (let w = 0; w < windowCount; w++) {
    const offset = w * windowSize;
    let sumSq = 0;
    const stride = Math.max(1, Math.floor(windowSize / 64));
    let count = 0;
    for (let s = offset; s < offset + windowSize && s < totalSamples; s += stride) {
      let sample = 0;
      for (let c = 0; c < channels; c++) {
        sample += data[c][s];
      }
      sample /= channels;
      sumSq += sample * sample;
      count++;
    }
    const rms = Math.sqrt(sumSq / Math.max(1, count));
    if (rms >= threshold) {
      if (firstActive === -1) firstActive = w;
      lastActive = w;
    }
  }

  if (firstActive === -1 || lastActive === -1 || lastActive <= firstActive) {
    return { start: 0, end: buffer.duration };
  }

  const marginSec = 0.05;
  const start = Math.max(0, (firstActive * windowSize) / sampleRate - marginSec);
  const end = Math.min(buffer.duration, ((lastActive + 1) * windowSize) / sampleRate + marginSec);
  return { start, end };
}

export function computeOutputDuration(
  duration: number,
  mode: CutMode,
  startSec: number,
  endSec: number
): number {
  const s = Math.max(0, Math.min(startSec, duration));
  const e = Math.max(s, Math.min(endSec, duration));
  if (mode === 'trim') {
    return Math.max(0, e - s);
  }
  return Math.max(0, s + (duration - e));
}

export function renderEditedAudioBuffer(
  source: AudioBuffer,
  options: EditOptions
): AudioBuffer {
  const sampleRate = source.sampleRate;
  const channels = source.numberOfChannels;
  const startSample = Math.max(0, Math.min(source.length, Math.round(options.startSec * sampleRate)));
  const endSample = Math.max(startSample, Math.min(source.length, Math.round(options.endSec * sampleRate)));

  let outLength = 0;
  if (options.mode === 'trim') {
    outLength = endSample - startSample;
  } else {
    outLength = startSample + (source.length - endSample);
  }

  if (outLength <= 0) {
    throw new Error('INVALID_SELECTION');
  }

  const output = new AudioBuffer({
    length: outLength,
    numberOfChannels: channels,
    sampleRate,
  });

  const crossfadeSamples = Math.min(Math.floor(sampleRate * 0.01), startSample, source.length - endSample);

  for (let ch = 0; ch < channels; ch++) {
    const src = source.getChannelData(ch);
    const dst = output.getChannelData(ch);

    if (options.mode === 'trim') {
      dst.set(src.subarray(startSample, endSample), 0);
    } else {
      if (startSample > 0) {
        dst.set(src.subarray(0, startSample), 0);
      }
      if (endSample < source.length) {
        dst.set(src.subarray(endSample), startSample);
      }
      // Subtle 10ms click-free smoothing right at the cut splice point
      if (crossfadeSamples > 4) {
        const half = Math.floor(crossfadeSamples / 2);
        for (let i = 0; i < half; i++) {
          const factor = 0.5 * (1 + Math.cos((Math.PI * i) / half));
          const leftIdx = startSample - half + i;
          const rightIdx = startSample + i;
          if (leftIdx >= 0 && leftIdx < dst.length) {
            dst[leftIdx] *= 0.25 + 0.75 * factor;
          }
          if (rightIdx >= 0 && rightIdx < dst.length) {
            dst[rightIdx] *= 0.25 + 0.75 * (1 - factor);
          }
        }
      }
    }

    // Apply smooth raised-cosine Fade In and Fade Out envelopes in 32-bit float
    const outDuration = outLength / sampleRate;
    let fadeIn = Math.max(0, options.fadeInSec);
    let fadeOut = Math.max(0, options.fadeOutSec);
    if (fadeIn + fadeOut > outDuration && fadeIn + fadeOut > 0) {
      const ratio = outDuration / (fadeIn + fadeOut);
      fadeIn *= ratio;
      fadeOut *= ratio;
    }

    const fadeInSamples = Math.min(outLength, Math.round(fadeIn * sampleRate));
    for (let i = 0; i < fadeInSamples; i++) {
      const t = i / fadeInSamples;
      const gain = 0.5 - 0.5 * Math.cos(Math.PI * t);
      dst[i] *= gain;
    }

    const fadeOutSamples = Math.min(outLength, Math.round(fadeOut * sampleRate));
    for (let i = 0; i < fadeOutSamples; i++) {
      const t = i / fadeOutSamples;
      const gain = 0.5 + 0.5 * Math.cos(Math.PI * t);
      dst[outLength - fadeOutSamples + i] *= gain;
    }
  }

  return output;
}

async function resampleBuffer(
  buffer: AudioBuffer,
  targetSampleRate: number,
  targetChannels: number
): Promise<AudioBuffer> {
  if (buffer.sampleRate === targetSampleRate && buffer.numberOfChannels === targetChannels) {
    return buffer;
  }
  const newLength = Math.max(1, Math.ceil(buffer.duration * targetSampleRate));
  const offline = new OfflineAudioContext(targetChannels, newLength, targetSampleRate);
  const src = offline.createBufferSource();
  src.buffer = buffer;
  src.connect(offline.destination);
  src.start(0);
  return offline.startRendering();
}

export function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(2, buffer.numberOfChannels);
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function floatToInt16(floatData: Float32Array): Int16Array {
  const int16 = new Int16Array(floatData.length);
  for (let i = 0; i < floatData.length; i++) {
    const s = Math.max(-1, Math.min(1, floatData[i]));
    int16[i] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
  }
  return int16;
}

export async function encodeMp3(
  buffer: AudioBuffer,
  kbps = 192,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const targetChannels = Math.min(2, buffer.numberOfChannels);
  const targetRate = VALID_MP3_RATES.has(buffer.sampleRate) ? buffer.sampleRate : 44100;
  const readyBuffer = await resampleBuffer(buffer, targetRate, targetChannels);

  const { Mp3Encoder } = await import('@breezystack/lamejs');
  const encoder = new Mp3Encoder(targetChannels, readyBuffer.sampleRate, kbps);

  const left = floatToInt16(readyBuffer.getChannelData(0));
  const right = targetChannels === 2 ? floatToInt16(readyBuffer.getChannelData(1)) : undefined;

  const chunks: Uint8Array<ArrayBuffer>[] = [];
  const blockSize = 1152;
  const totalSamples = left.length;
  let blockCounter = 0;

  for (let i = 0; i < totalSamples; i += blockSize) {
    const leftChunk = left.subarray(i, i + blockSize);
    const encoded = right
      ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + blockSize))
      : encoder.encodeBuffer(leftChunk);

    if (encoded.length > 0) {
      chunks.push(new Uint8Array(encoded));
    }

    blockCounter++;
    if (blockCounter % 64 === 0) {
      onProgress?.(Math.min(95, Math.round((i / totalSamples) * 100)));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const tail = encoder.flush();
  if (tail.length > 0) {
    chunks.push(new Uint8Array(tail));
  }

  onProgress?.(100);
  return new Blob(chunks, { type: 'audio/mpeg' });
}

export async function encodeM4r(
  buffer: AudioBuffer,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  if (typeof AudioEncoder === 'undefined' || typeof AudioData === 'undefined') {
    throw new M4rUnsupportedError();
  }

  const targetChannels = Math.min(2, buffer.numberOfChannels);
  const targetRate = buffer.sampleRate === 48000 ? 48000 : 44100;
  const aacConfig: AudioEncoderConfig = {
    codec: 'mp4a.40.2',
    sampleRate: targetRate,
    numberOfChannels: targetChannels,
    bitrate: 192_000,
  };

  let support: AudioEncoderSupport;
  try {
    support = await AudioEncoder.isConfigSupported(aacConfig);
  } catch {
    throw new M4rUnsupportedError();
  }

  if (!support.supported) {
    throw new M4rUnsupportedError();
  }

  const readyBuffer = await resampleBuffer(buffer, targetRate, targetChannels);
  const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    audio: {
      codec: 'aac',
      numberOfChannels: targetChannels,
      sampleRate: targetRate,
    },
    fastStart: 'in-memory',
  });

  let encoderError: unknown = null;
  const encoder = new AudioEncoder({
    output: (chunk, meta) => {
      muxer.addAudioChunk(chunk, meta);
    },
    error: (err) => {
      encoderError = err;
    },
  });

  encoder.configure(aacConfig);

  const frameSize = 1024;
  const totalFrames = readyBuffer.length;
  const chData: Float32Array[] = [];
  for (let c = 0; c < targetChannels; c++) {
    chData.push(readyBuffer.getChannelData(c));
  }

  let chunkIdx = 0;
  for (let offset = 0; offset < totalFrames; offset += frameSize) {
    if (encoderError) throw encoderError;
    const count = Math.min(frameSize, totalFrames - offset);
    const planar = new Float32Array(count * targetChannels);
    for (let c = 0; c < targetChannels; c++) {
      planar.set(chData[c].subarray(offset, offset + count), c * count);
    }

    const audioData = new AudioData({
      format: 'f32-planar',
      sampleRate: targetRate,
      numberOfFrames: count,
      numberOfChannels: targetChannels,
      timestamp: Math.round((offset / targetRate) * 1_000_000),
      data: planar,
    });

    encoder.encode(audioData);
    audioData.close();

    chunkIdx++;
    if (chunkIdx % 48 === 0) {
      onProgress?.(Math.min(92, Math.round((offset / totalFrames) * 100)));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  await encoder.flush();
  encoder.close();
  if (encoderError) throw encoderError;

  muxer.finalize();
  onProgress?.(100);
  return new Blob([target.buffer], { type: 'audio/x-m4r' });
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  const hundredths = Math.floor((safe - Math.floor(safe)) * 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

export function parseTime(input: string): number | null {
  const cleaned = input.trim();
  if (!cleaned) return null;
  const parts = cleaned.split(':');
  if (parts.length === 1) {
    const secs = Number(parts[0]);
    return Number.isFinite(secs) && secs >= 0 ? secs : null;
  }
  if (parts.length === 2) {
    const mins = Number(parts[0]);
    const secs = Number(parts[1]);
    if (!Number.isFinite(mins) || !Number.isFinite(secs) || mins < 0 || secs < 0) return null;
    return mins * 60 + secs;
  }
  return null;
}

export function buildOutputFilename(originalName: string, format: ExportFormat): string {
  const base = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 64) || 'audio';
  return `${base}-trimmed.${format}`;
}
