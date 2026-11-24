export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  description: string;
  tip?: string;
}

export interface SpecialtyItem {
  title: string;
  description: string;
}

export interface CutterUiTranslations {
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  selectAudioFile: string;
  trySampleAudio: string;
  openAnotherFile: string;
  privacyBadge: string;
  supportedFormatsLabel: string;
  decodingStatus: string;
  loadedStatus: string;
  sampleTrackName: string;
  playPreview: string;
  previewCut: string;
  pausePreview: string;
  stopPreview: string;
  cursorLabel: string;
  setStartHere: string;
  setEndHere: string;
  setStartTooltip: string;
  setEndTooltip: string;
  startSetStatus: string;
  endSetStatus: string;
  skipBackLabel: string;
  skipForwardLabel: string;
  loopLabel: string;
  modeKeepLabel: string;
  modeKeepShort: string;
  modeRemoveLabel: string;
  modeRemoveShort: string;
  modeGroupLabel: string;
  startLabel: string;
  endLabel: string;
  outputDurationLabel: string;
  originalDurationLabel: string;
  fadeInLabel: string;
  fadeOutLabel: string;
  secondsShort: string;
  ringtonePresetLabel: string;
  ringtonePresetApplied: string;
  trimSilenceLabel: string;
  trimSilenceApplied: string;
  trimSilenceNone: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  zoomResetLabel: string;
  outputFormatLabel: string;
  bitrateLabel: string;
  downloadButton: string;
  exportingStatus: string;
  exportReadyStatus: string;
  startHandleAria: string;
  endHandleAria: string;
  waveformHint: string;
  errorDecodeFailed: string;
  errorInvalidSelection: string;
  errorM4rUnsupported: string;
  m4rRingtoneNote: string;
  videoExtractedNote: string;
  fileSizeUnitKb: string;
  fileSizeUnitMb: string;
}

export interface TranslationDict {
  langName: string;
  nav: {
    home: string;
    howToUse: string;
    hireMe: string;
    languageSelectorLabel: string;
    themeToggleLabel: string;
    switchToDark: string;
    switchToLight: string;
    addToHomeScreen: string;
    supportDeveloper: string;
    githubAriaLabel: string;
    skipToContent: string;
    mainNavLabel: string;
    breadcrumbLabel: string;
  };
  pwa: {
    modalTitle: string;
    modalDescription: string;
    installNow: string;
    alreadyInstalled: string;
    iosTitle: string;
    iosStep1: string;
    iosStep2: string;
    iosStep3: string;
    desktopHint: string;
    close: string;
  };
  footer: {
    tagline: string;
    privacyNote: string;
    builtBy: string;
    copyright: string;
  };
  home: {
    title: string;
    description: string;
    ogImageAlt: string;
    h1: string;
    heroSubtitle: string;
    faqHeading: string;
    faqSubheading: string;
    faqs: FaqItem[];
  };
  howToUse: {
    title: string;
    description: string;
    ogImageAlt: string;
    breadcrumbCurrent: string;
    h1: string;
    intro: string;
    stepsHeading: string;
    steps: HowToStep[];
    workflowsHeading: string;
    workflows: {
      title: string;
      description: string;
    }[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  hireMe: {
    title: string;
    description: string;
    ogImageAlt: string;
    breadcrumbCurrent: string;
    h1: string;
    heading: string;
    intro: string;
    subcopy: string;
    specialties: SpecialtyItem[];
    ctaHeading: string;
    emailLabel: string;
    copyButtonLabel: string;
    copiedLabel: string;
    emailButtonLabel: string;
  };
  cutter: CutterUiTranslations;
}
