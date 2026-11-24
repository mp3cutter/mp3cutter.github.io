import type { TranslationDict } from '../types';

export const de: TranslationDict = {
  langName: 'Deutsch',
  nav: {
    home: 'Startseite',
    howToUse: 'Anleitung',
    hireMe: 'Beauftragen',
    languageSelectorLabel: 'Sprache wählen',
    themeToggleLabel: 'Helles und dunkles Design umschalten',
    switchToDark: 'Zum Dunkelmodus wechseln',
    switchToLight: 'Zum Hellmodus wechseln',
    addToHomeScreen: 'Zum Startbildschirm',
    supportDeveloper: 'Entwickler unterstützen',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: 'Zum Hauptinhalt springen',
    mainNavLabel: 'Hauptnavigation',
    breadcrumbLabel: 'Brotkrumen-Navigation',
  },
  pwa: {
    modalTitle: 'MP3Cutter offline installieren',
    modalDescription:
      'Füge MP3Cutter zu deinem Startbildschirm hinzu, um Songs jederzeit komplett offline zu schneiden und Klingeltöne zu erstellen.',
    installNow: 'App jetzt installieren',
    alreadyInstalled: 'MP3Cutter ist bereits auf diesem Gerät installiert.',
    iosTitle: 'Auf iPhone oder iPad (Safari):',
    iosStep1: 'Tippe unten in Safari auf das Teilen-Symbol.',
    iosStep2: 'Scrolle nach unten und tippe auf „Zum Home-Bildschirm“.',
    iosStep3: 'Tippe oben rechts auf „Hinzufügen“, um die App offline zu starten.',
    desktopHint:
      'Du kannst MP3Cutter auch über das Symbol in der Adressleiste oder das Browsermenü („App installieren“) hinzufügen.',
    close: 'Schließen',
  },
  footer: {
    tagline: 'Privater MP3-Cutter ohne Upload und Klingelton-Maker direkt im Browser.',
    privacyNote: 'Deine Audiodateien verlassen niemals dein Gerät.',
    builtBy: 'Entwickelt von Kishara Dilshan',
    copyright: '© 2026 MP3Cutter. Open Source unter MIT-Lizenz.',
  },
  home: {
    title: 'MP3 Schneiden Online Kostenlos - Audio & Klingeltöne',
    description:
      'Schneide MP3-, WAV-, FLAC- und AAC-Dateien online mit sanftem Fade-in und Fade-out. 100 % kostenloser Browser-Audio-Cutter ganz ohne Upload.',
    ogImageAlt: 'MP3Cutter Browser-Oberfläche zum Schneiden von Audio und Klingeltönen',
    h1: 'MP3 Cutter — Audio Schneiden & Klingeltöne Online Erstellen',
    heroSubtitle:
      'Schneide MP3, WAV, FLAC, OGG und AAC direkt im Browser mit sanftem Fade-in und Fade-out. 100 % kostenlos, ohne Upload und ohne Anmeldung.',
    faqHeading: 'Häufig gestellte Fragen',
    faqSubheading: 'Alles Wichtige rund um privates Audioschneiden direkt in deinem Browser.',
    faqs: [
      {
        question: 'Wie schneide ich einen MP3-Song oder erstelle einen 30-Sekunden-Klingelton?',
        answer:
          'Ziehe deine Audiodatei oben in den Arbeitsbereich oder klicke auf Audiodatei wählen. Verschiebe Start- und End-Regler auf der Wellenform – oder nutze die 30s-Klingelton-Vorlage –, höre die Vorschau an, wähle MP3 für Android oder M4R für iPhone und lade den Schnitt herunter.',
      },
      {
        question: 'Werden meine Audiodateien beim Schneiden auf einen Server hochgeladen?',
        answer:
          'Niemals. MP3Cutter dekodiert, schneidet und kodiert jede Datei zu 100 % lokal in deinem Browser über die Web Audio API. Deine Aufnahmen verlassen niemals dein Gerät und die Web-App funktioniert nach der Installation sogar offline.',
      },
      {
        question: 'Welche Audioformate werden unterstützt (MP3, WAV, FLAC, AAC, OGG, M4A)?',
        answer:
          'Du kannst MP3, WAV, FLAC, AAC, OGG und M4A öffnen sowie die Tonspur lokaler MP4-, WebM- oder MOV-Videos direkt extrahieren und schneiden. Exportiert wird als MP3, verlustfreies 16-Bit-WAV oder iPhone-M4R-Klingelton.',
      },
      {
        question: 'Kann ich sanftes Fade-in und Fade-out ohne Qualitätsverlust anwenden?',
        answer:
          'Ja. Aktiviere Fade-in und Fade-out mit je 0 bis 5 Sekunden Dauer und beobachte die Live-Hüllkurve auf der Wellenform. Alle Blenden werden präzise in 32-Bit-Fließkomma berechnet und lassen sich als 320-kbps-MP3 oder verlustfreies WAV speichern.',
      },
    ],
  },
  howToUse: {
    title: 'MP3 Songs Schneiden & Klingeltöne Erstellen - MP3Cutter',
    description:
      'Schritt-für-Schritt-Anleitung zum Schneiden von MP3, WAV, FLAC und AAC mit sanften Fade-Effekten und privaten 30-Sekunden-Klingeltönen.',
    ogImageAlt: 'Anleitung zum Schneiden von MP3-Dateien und Erstellen von Klingeltönen',
    breadcrumbCurrent: 'Anleitung',
    h1: 'So schneidest du MP3-Songs und erstellst eigene Klingeltöne privat',
    intro:
      'MP3Cutter läuft vollständig in deinem Browser, sodass du Songs kürzen, Mittelteile herausschneiden oder Klingeltöne in wenigen Sekunden erstellen kannst – ganz ohne Upload und Konto.',
    stepsHeading: 'In vier einfachen Schritten zur geschnittenen Audiodatei',
    steps: [
      {
        title: '1. Audio- oder Videodatei lokal laden',
        description:
          'Ziehe eine MP3-, WAV-, FLAC-, AAC-, OGG- oder M4A-Datei auf der Startseite ins Studio – oder wähle ein MP4-, MOV- oder WebM-Video, um dessen Tonspur automatisch im Browser zu extrahieren.',
        tip: 'Möchtest du zuerst testen? Klicke auf „Beispiel-Audio testen“, um sofort offline eine Demo-Spur zu erzeugen.',
      },
      {
        title: '2. Schnittbereich auf der Wellenform festlegen',
        description:
          'Ziehe Start- und End-Regler über die interaktive Wellenform oder gib genaue mm:ss.ms-Zeiten ein. Mit dem Zoom erkennst du feine Anschläge, und „Stille kürzen“ entfernt automatisch leise Anfänge und Enden.',
        tip: 'Mit den Pfeiltasten links/rechts verschiebst du fokussierte Regler um 0,1 Sekunden (mit Shift um 1 Sekunde).',
      },
      {
        title: '3. Auswahl behalten oder entfernen & sanfte Fades wählen',
        description:
          'Wähle „Auswahl behalten (Trim)“ für den markierten Teil oder „Auswahl entfernen (Cut)“, um einen Mittelteil sauber herauszuschneiden. Aktiviere Fade-in und Fade-out (0–5 s) für weiche Übergänge.',
        tip: 'Starte die Vorschau, um Fades und Schnittstelle live vor dem Download zu prüfen.',
      },
      {
        title: '4. Als MP3, verlustfreies WAV oder iPhone-M4R exportieren',
        description:
          'Wähle MP3 (128, 192 oder 320 kbps) für Alltag und Android, WAV für verlustfreie Studioqualität oder M4R für iPhone-Klingeltöne. Klicke auf „Geschnittenes Audio herunterladen“.',
      },
    ],
    workflowsHeading: 'Beliebte Audio-Workflows',
    workflows: [
      {
        title: '30-Sekunden-Klingelton für iPhone (M4R) oder Android (MP3) erstellen',
        description:
          'Klicke nach dem Laden auf „30s Klingelton“, schiebe das 30-Sekunden-Fenster auf deinen Lieblingsrefrain, aktiviere 0,5 s Fade-in sowie 1,5 s Fade-out und exportiere als M4R oder MP3.',
      },
      {
        title: 'Mittelteil aus Podcasts oder Sprachmemos herausschneiden',
        description:
          'Markiere Pausen oder Versprecher, wechsle auf „Auswahl entfernen“, prüfe den sauberen Übergang in der Vorschau und lade die gekürzte Aufnahme herunter.',
      },
      {
        title: 'Tonspur aus einem lokalen Video extrahieren und schneiden',
        description:
          'Ziehe ein lokales MP4-, WebM- oder MOV-Video direkt in die Ablagefläche. MP3Cutter dekodiert den Ton lokal, sodass du Zitate oder Musikstellen direkt als MP3 oder WAV speicherst.',
      },
    ],
    ctaTitle: 'Bereit für deinen Audioschnitt?',
    ctaDescription: 'Starte direkt im Browser-Studio – 100 % kostenlos, privat und offline nutzbar.',
    ctaButton: 'MP3Cutter Studio öffnen',
  },
  hireMe: {
    title: 'Kishara Dilshan Beauftragen - Astro & WASM | MP3Cutter',
    description:
      'Suchst du eine ultraschnelle Astro-, React- oder Next.js-Web-App oder ein lokales WebAssembly-Tool? Beauftrage Kishara Dilshan für dein Projekt.',
    ogImageAlt: 'Kishara Dilshan für Astro-, React-, Next.js- und WebAssembly-Entwicklung',
    breadcrumbCurrent: 'Beauftragen',
    h1: 'Verfügbar für Freelance-Projekte',
    heading: 'Brauchst du eine maßgeschneiderte IT-Lösung?',
    intro: 'Hi, ich bin Kishara Dilshan, der Entwickler hinter MP3Cutter.',
    subcopy:
      'Wenn dir dieses schnelle Client-Side-Tool gefällt und du eine erstklassige IT-Lösung für dein Unternehmen suchst, stehe ich für Freelance-Projekte zur Verfügung. Meine Schwerpunkte:',
    specialties: [
      {
        title: 'Ultraschnelle, SEO-optimierte Webanwendungen',
        description:
          'Astro, React, Next.js — entwickelt für Ladezeiten unter einer Sekunde, sauberes technisches SEO und hohe Skalierbarkeit.',
      },
      {
        title: 'Client-seitige Verarbeitung & WebAssembly-Tools (WASM)',
        description:
          'Serverlose Medien-, PDF- und Daten-Tools, die komplett privat im Browser laufen.',
      },
      {
        title: 'UI/UX-Design & konversionsstarke Landingpages',
        description:
          'Minimalistische, barrierefreie Oberflächen, die Besucher auf Desktop und Mobilgeräten überzeugen.',
      },
    ],
    ctaHeading: 'Lass uns gemeinsam etwas Großartiges bauen.',
    emailLabel: 'Direkt per E-Mail: kisharadilshan007@gmail.com',
    copyButtonLabel: 'E-Mail kopieren',
    copiedLabel: 'Kopiert!',
    emailButtonLabel: 'E-Mail senden',
  },
  cutter: {
    dropzoneTitle: 'Audio- oder Videodatei hier ablegen',
    dropzoneSubtitle: 'Unterstützt MP3, WAV, FLAC, AAC, OGG, M4A und lokale Videos',
    selectAudioFile: 'Audiodatei wählen',
    trySampleAudio: 'Beispiel-Audio testen',
    openAnotherFile: 'Andere Datei öffnen',
    privacyBadge: '100 % lokale Browser-Verarbeitung • Keine Uploads',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: 'Audio wird lokal im Browser dekodiert...',
    loadedStatus: 'Audio bereit zum Schneiden.',
    sampleTrackName: 'mp3cutter-demo-spur.wav',
    playPreview: 'Abspielen',
    previewCut: 'Schnitt prüfen',
    pausePreview: 'Pause',
    stopPreview: 'Stopp',
    cursorLabel: 'Cursor',
    setStartHere: 'Start setzen',
    setEndHere: 'Ende setzen',
    setStartTooltip: 'Startpunkt an aktueller Position setzen (I)',
    setEndTooltip: 'Endpunkt an aktueller Position setzen (O)',
    startSetStatus: 'Startpunkt gesetzt auf',
    endSetStatus: 'Endpunkt gesetzt auf',
    skipBackLabel: '2 Sekunden zurück',
    skipForwardLabel: '2 Sekunden vor',
    loopLabel: 'Vorschau wiederholen',
    modeKeepLabel: 'Auswahl behalten (Trim)',
    modeKeepShort: 'Auswahl behalten',
    modeRemoveLabel: 'Auswahl entfernen (Cut)',
    modeRemoveShort: 'Auswahl entfernen',
    modeGroupLabel: 'Schnittmodus',
    startLabel: 'Start',
    endLabel: 'Ende',
    outputDurationLabel: 'Ausgabelänge',
    originalDurationLabel: 'Original',
    fadeInLabel: 'Fade-in',
    fadeOutLabel: 'Fade-out',
    secondsShort: 's',
    ringtonePresetLabel: '30s Klingelton',
    ringtonePresetApplied: '30-Sekunden-Klingelton-Vorlage angewendet.',
    trimSilenceLabel: 'Stille kürzen',
    trimSilenceApplied: 'Stille am Anfang und Ende wurde gekürzt.',
    trimSilenceNone: 'Keine Stille am Anfang oder Ende erkannt.',
    zoomInLabel: 'Wellenform vergrößern',
    zoomOutLabel: 'Wellenform verkleinern',
    zoomResetLabel: 'Zoom zurücksetzen',
    outputFormatLabel: 'Ausgabeformat',
    bitrateLabel: 'MP3-Qualität',
    downloadButton: 'Geschnittenes Audio herunterladen',
    exportingStatus: 'Wird lokal im Browser kodiert...',
    exportReadyStatus: 'Export abgeschlossen! Der Download hat begonnen.',
    startHandleAria: 'Startposition des Schnitts',
    endHandleAria: 'Endposition des Schnitts',
    waveformHint: 'Wellenform anklicken zum Vorhören • I / O setzt Start / Ende • Leertaste für Wiedergabe/Pause',
    errorDecodeFailed:
      'Diese Datei konnte im Browser nicht dekodiert werden. Bitte versuche eine Standard-MP3-, WAV-, FLAC-, AAC-, OGG-, M4A- oder MP4-Datei.',
    errorInvalidSelection:
      'Bitte belasse mindestens 0,2 Sekunden Audio im Ergebnis vor dem Export.',
    errorM4rUnsupported:
      'Dein Browser unterstützt keine native AAC-M4R-Kodierung. Bitte exportiere als MP3 oder WAV.',
    m4rRingtoneNote: 'iPhone-Klingeltöne sollten höchstens 40 Sekunden lang sein.',
    videoExtractedNote: 'Tonspur lokal aus dem Video extrahiert.',
    fileSizeUnitKb: 'KB',
    fileSizeUnitMb: 'MB',
  },
};
