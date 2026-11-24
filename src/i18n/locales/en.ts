import type { TranslationDict } from '../types';

export const en: TranslationDict = {
  langName: 'English',
  nav: {
    home: 'Home',
    howToUse: 'How to Use',
    hireMe: 'Hire Me',
    languageSelectorLabel: 'Select language',
    themeToggleLabel: 'Toggle light and dark theme',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    addToHomeScreen: 'Add to Home Screen',
    supportDeveloper: 'Support the Developer',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: 'Skip to main content',
    mainNavLabel: 'Primary navigation',
    breadcrumbLabel: 'Breadcrumb',
  },
  pwa: {
    modalTitle: 'Install MP3Cutter Offline',
    modalDescription:
      'Add MP3Cutter to your device home screen so you can trim songs and create ringtones offline anytime with zero internet connection.',
    installNow: 'Install App Now',
    alreadyInstalled: 'MP3Cutter is already installed on this device.',
    iosTitle: 'On iPhone or iPad (Safari):',
    iosStep1: 'Tap the Share button at the bottom of Safari.',
    iosStep2: 'Scroll down and tap "Add to Home Screen".',
    iosStep3: 'Tap "Add" in the top-right corner to launch offline anytime.',
    desktopHint:
      'You can also install MP3Cutter from your browser address bar icon or browser menu ("Install App" / "Add to Home Screen").',
    close: 'Close',
  },
  footer: {
    tagline: 'Private, zero-upload MP3 cutter and ringtone maker running locally in your browser.',
    privacyNote: 'Your audio files never leave your device.',
    builtBy: 'Built by Kishara Dilshan',
    copyright: '© 2026 MP3Cutter. Open-source under MIT License.',
  },
  home: {
    title: 'MP3 Cutter Online - Cut Songs & Make Ringtones Free',
    description:
      'Cut and trim MP3, WAV, FLAC, and AAC audio files online with smooth fade-in and fade-out. 100% free browser MP3 cutter with zero uploads.',
    ogImageAlt: 'MP3Cutter online browser audio trimmer and ringtone maker interface',
    h1: 'MP3 Cutter — Trim Audio, Cut Songs & Make Ringtones Online',
    heroSubtitle:
      'Cut and trim MP3, WAV, FLAC, OGG, and AAC audio right in your browser with smooth fade-in and fade-out controls. 100% free, zero uploads, and no sign-ups.',
    faqHeading: 'Frequently Asked Questions',
    faqSubheading: 'Everything you need to know about trimming audio privately in your browser.',
    faqs: [
      {
        question: 'How do I cut an MP3 song or make a custom 30-second ringtone online?',
        answer:
          'Drop your audio track into the workspace above or click Select Audio File. Drag the start and end handles along the waveform—or press the 30s Ringtone Preset button—to frame the exact chorus you want. Preview it live, choose MP3 for Android or M4R for iPhone, and click Download Trimmed Audio.',
      },
      {
        question: 'Are my audio files uploaded to a server when I trim them?',
        answer:
          'Never. MP3Cutter decodes, edits, and re-encodes every file 100% locally inside your web browser using the Web Audio API and client-side encoders. Your recordings, voice memos, and songs never touch an external server, and the app even works offline once added to your home screen.',
      },
      {
        question: 'Which audio formats are supported (MP3, WAV, FLAC, AAC, OGG, M4A)?',
        answer:
          'You can open MP3, WAV, FLAC, AAC, OGG, and M4A tracks, as well as extract and trim the audio track directly from local MP4, WebM, or MOV video files. When exporting, you can save your edited clip as MP3, lossless 16-bit WAV, or iPhone-ready M4R ringtone format.',
      },
      {
        question: 'Can I add smooth fade-in and fade-out effects without losing sound quality?',
        answer:
          'Yes. Toggle Fade In and Fade Out and set each duration between 0 and 5 seconds while watching the live envelope curve on the waveform. All fades are computed in 32-bit floating-point audio before export, and you can choose high-bitrate 320 kbps MP3 or completely lossless WAV.',
      },
    ],
  },
  howToUse: {
    title: 'How to Cut MP3 Songs & Make Ringtones Online - MP3Cutter',
    description:
      'Step-by-step guide to trim MP3, WAV, FLAC, and AAC tracks, apply smooth fade-in and fade-out effects, and export 30-second ringtones privately.',
    ogImageAlt: 'Step-by-step guide for cutting MP3 songs and making ringtones in MP3Cutter',
    breadcrumbCurrent: 'How to Use',
    h1: 'How to Cut MP3 Songs and Create Custom Ringtones Privately',
    intro:
      'MP3Cutter runs completely inside your browser, so trimming songs, removing unwanted middle sections, or creating custom phone ringtones takes only seconds—with zero uploads and no sign-up.',
    stepsHeading: 'Four Simple Steps to Trim Any Audio File',
    steps: [
      {
        title: '1. Load an Audio or Video File Locally',
        description:
          'Drag and drop an MP3, WAV, FLAC, AAC, OGG, or M4A file into the cutter box on the Home page—or drop an MP4, MOV, or WebM video to extract its soundtrack automatically. Your browser decodes the file locally in memory.',
        tip: 'Want to test the controls first? Click "Try Sample Audio" to generate an instant built-in demo track offline.',
      },
      {
        title: '2. Frame Your Cut on the Interactive Waveform',
        description:
          'Drag the Start and End handles along the waveform or type exact mm:ss.ms timestamps. Use the Zoom controls to inspect fine transients, or click "Trim Silence" to snap past quiet intros and outros automatically.',
        tip: 'Use the left and right arrow keys while a handle is focused to nudge your cut by 0.1 seconds (hold Shift for 1-second jumps).',
      },
      {
        title: '3. Choose Keep or Remove Selection & Apply Smooth Fades',
        description:
          'Select "Keep Selection (Trim)" to save only the highlighted segment, or switch to "Remove Selection (Cut)" to delete an unwanted middle section and join the rest seamlessly. Toggle Fade In and Fade Out (0s–5s) for smooth, click-free transitions.',
        tip: 'Press Play Preview to hear your exact fades and splice point live before exporting.',
      },
      {
        title: '4. Export as MP3, Lossless WAV, or iPhone M4R Ringtone',
        description:
          'Pick MP3 (128, 192, or 320 kbps) for everyday listening and Android ringtones, WAV for lossless studio quality, or M4R for iPhone ringtones. Click "Download Trimmed Audio" to encode and save directly to your device.',
      },
    ],
    workflowsHeading: 'Popular Audio Trimming Workflows',
    workflows: [
      {
        title: 'Make a 30-Second iPhone M4R or Android MP3 Ringtone',
        description:
          'Click the "30s Ringtone Preset" button after loading your song, slide the 30-second window over your favorite chorus, enable a subtle 0.5s Fade In and 1.5s Fade Out, and export as M4R for iOS or MP3 for Android.',
      },
      {
        title: 'Cut Out a Middle Section from a Podcast or Recording',
        description:
          'Highlight the mistake, pause, or ad read you want to remove, toggle "Remove Selection (Cut)", preview the clean splice, and download your tightened audio without losing sync.',
      },
      {
        title: 'Extract and Trim Audio from a Local Video Clip',
        description:
          'Drop any local MP4, WebM, or MOV file straight into the audio dropzone. MP3Cutter decodes the embedded audio track locally so you can trim the exact quote or music cue and export it as MP3 or WAV.',
      },
    ],
    ctaTitle: 'Ready to Trim Your Audio?',
    ctaDescription: 'Jump straight into the browser studio—100% free, private, and works offline.',
    ctaButton: 'Open MP3 Cutter Studio',
  },
  hireMe: {
    title: 'Hire Kishara Dilshan - Astro & WASM Developer | MP3Cutter',
    description:
      'Need an ultra-fast Astro, React, or Next.js web app or client-side WebAssembly tool? Hire Kishara Dilshan for custom SEO-ready IT solutions.',
    ogImageAlt: 'Hire Kishara Dilshan for Astro, React, Next.js, and WebAssembly development',
    breadcrumbCurrent: 'Hire Me',
    h1: 'Available for Freelance Projects',
    heading: 'Need a Custom IT Solution?',
    intro: "Hi, I'm Kishara Dilshan, the developer behind MP3Cutter.",
    subcopy:
      'If you love this fast, client-side tool and need a world-class IT solution for your own business, I am available for freelance projects. I specialize in:',
    specialties: [
      {
        title: 'Ultra-fast, SEO-optimized web applications',
        description:
          'Astro, React, Next.js — engineered for sub-second loads, technical SEO, and clean scalability.',
      },
      {
        title: 'Client-side processing & WebAssembly (WASM) tools',
        description:
          'Zero-server media, PDF, and data utilities that run privately inside the browser.',
      },
      {
        title: 'UI/UX design & High-converting landing pages',
        description:
          'Minimal, accessible interfaces crafted to convert visitors effortlessly across desktop and mobile.',
      },
    ],
    ctaHeading: "Let's build something amazing together.",
    emailLabel: 'Email me directly: kisharadilshan007@gmail.com',
    copyButtonLabel: 'Copy Email',
    copiedLabel: 'Copied!',
    emailButtonLabel: 'Send Email',
  },
  cutter: {
    dropzoneTitle: 'Drop your audio or video file here',
    dropzoneSubtitle: 'Supports MP3, WAV, FLAC, AAC, OGG, M4A, and local video clips',
    selectAudioFile: 'Select Audio File',
    trySampleAudio: 'Try Sample Audio',
    openAnotherFile: 'Open Another File',
    privacyBadge: '100% Private Browser Processing • Zero Uploads',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: 'Decoding audio locally in your browser...',
    loadedStatus: 'Audio ready to trim.',
    sampleTrackName: 'mp3cutter-demo-track.wav',
    playPreview: 'Play',
    previewCut: 'Preview Cut',
    pausePreview: 'Pause',
    stopPreview: 'Stop',
    cursorLabel: 'Playhead',
    setStartHere: 'Set Start',
    setEndHere: 'Set End',
    setStartTooltip: 'Set start point to current playhead (I)',
    setEndTooltip: 'Set end point to current playhead (O)',
    startSetStatus: 'Start point set to',
    endSetStatus: 'End point set to',
    skipBackLabel: 'Skip back 2 seconds',
    skipForwardLabel: 'Skip forward 2 seconds',
    loopLabel: 'Loop preview',
    modeKeepLabel: 'Keep Selection (Trim)',
    modeKeepShort: 'Keep Selection',
    modeRemoveLabel: 'Remove Selection (Cut)',
    modeRemoveShort: 'Remove Selection',
    modeGroupLabel: 'Cutting mode',
    startLabel: 'Start',
    endLabel: 'End',
    outputDurationLabel: 'Output Length',
    originalDurationLabel: 'Original',
    fadeInLabel: 'Fade In',
    fadeOutLabel: 'Fade Out',
    secondsShort: 's',
    ringtonePresetLabel: '30s Ringtone Preset',
    ringtonePresetApplied: 'Applied 30-second ringtone preset.',
    trimSilenceLabel: 'Trim Silence',
    trimSilenceApplied: 'Trimmed leading and trailing silence.',
    trimSilenceNone: 'No leading or trailing silence detected.',
    zoomInLabel: 'Zoom in waveform',
    zoomOutLabel: 'Zoom out waveform',
    zoomResetLabel: 'Reset zoom',
    outputFormatLabel: 'Output Format',
    bitrateLabel: 'MP3 Quality',
    downloadButton: 'Download Trimmed Audio',
    exportingStatus: 'Encoding locally in your browser...',
    exportReadyStatus: 'Export complete! Your trimmed audio download has started.',
    startHandleAria: 'Trim start position',
    endHandleAria: 'Trim end position',
    waveformHint: 'Click waveform to listen anywhere • Press I / O to mark Start / End • Space to play/pause',
    errorDecodeFailed:
      'Could not decode this file in your browser. Please try a standard MP3, WAV, FLAC, AAC, OGG, M4A, or MP4 file.',
    errorInvalidSelection:
      'Please leave at least 0.2 seconds of audio in the output before exporting.',
    errorM4rUnsupported:
      'Your browser does not support native AAC M4R encoding. Please export as MP3 or WAV instead.',
    m4rRingtoneNote: 'iPhone ringtones should be 40 seconds or shorter.',
    videoExtractedNote: 'Audio track extracted locally from video.',
    fileSizeUnitKb: 'KB',
    fileSizeUnitMb: 'MB',
  },
};
