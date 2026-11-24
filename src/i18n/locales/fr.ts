import type { TranslationDict } from '../types';

export const fr: TranslationDict = {
  langName: 'Français',
  nav: {
    home: 'Accueil',
    howToUse: 'Mode d’emploi',
    hireMe: 'M’engager',
    languageSelectorLabel: 'Choisir la langue',
    themeToggleLabel: 'Basculer entre thème clair et sombre',
    switchToDark: 'Passer en mode sombre',
    switchToLight: 'Passer en mode clair',
    addToHomeScreen: 'Ajouter à l’écran',
    supportDeveloper: 'Soutenir le développeur',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: 'Aller au contenu principal',
    mainNavLabel: 'Navigation principale',
    breadcrumbLabel: 'Fil d’Ariane',
  },
  pwa: {
    modalTitle: 'Installer MP3Cutter hors ligne',
    modalDescription:
      'Ajoutez MP3Cutter à votre écran d’accueil pour découper vos chansons et créer des sonneries hors ligne à tout moment.',
    installNow: 'Installer l’application',
    alreadyInstalled: 'MP3Cutter est déjà installé sur cet appareil.',
    iosTitle: 'Sur iPhone ou iPad (Safari) :',
    iosStep1: 'Touchez le bouton Partager en bas de Safari.',
    iosStep2: 'Faites défiler et touchez « Sur l’écran d’accueil ».',
    iosStep3: 'Touchez « Ajouter » en haut à droite pour l’ouvrir hors ligne.',
    desktopHint:
      'Vous pouvez aussi installer MP3Cutter via l’icône de la barre d’adresse ou le menu du navigateur (« Installer l’application »).',
    close: 'Fermer',
  },
  footer: {
    tagline: 'Découpeur MP3 privé sans envoi de fichier et créateur de sonneries dans votre navigateur.',
    privacyNote: 'Vos fichiers audio ne quittent jamais votre appareil.',
    builtBy: 'Développé par Kishara Dilshan',
    copyright: '© 2026 MP3Cutter. Open source sous licence MIT.',
  },
  home: {
    title: 'Couper un MP3 en Ligne Gratuit - Audio et Sonneries',
    description:
      'Coupez vos fichiers MP3, WAV, FLAC et AAC en ligne avec fondus fluides en entrée et sortie. Outil audio 100 % gratuit, sans envoi de fichier.',
    ogImageAlt: 'Interface de MP3Cutter pour couper un fichier audio et créer une sonnerie en ligne',
    h1: 'Couper un MP3 — Découpez Audio, Chansons et Sonneries en Ligne',
    heroSubtitle:
      'Découpez vos fichiers MP3, WAV, FLAC, OGG et AAC directement dans votre navigateur avec fondus fluides. 100 % gratuit, sans téléversement ni inscription.',
    faqHeading: 'Questions fréquentes',
    faqSubheading: 'Tout savoir pour découper vos fichiers audio en toute confidentialité dans le navigateur.',
    faqs: [
      {
        question: 'Comment couper une chanson MP3 ou créer une sonnerie de 30 secondes en ligne ?',
        answer:
          'Déposez votre piste dans l’espace ci-dessus ou cliquez sur Choisir un fichier audio. Déplacez les poignées de début et de fin sur la forme d’onde — ou utilisez le préréglage Sonnerie 30s — pour encadrer votre refrain, écoutez l’aperçu, choisissez MP3 pour Android ou M4R pour iPhone, puis téléchargez.',
      },
      {
        question: 'Mes fichiers audio sont-ils envoyés sur un serveur lors du découpage ?',
        answer:
          'Jamais. MP3Cutter décode, édite et réencode chaque piste à 100 % en local dans votre navigateur via l’API Web Audio. Vos enregistrements restent sur votre appareil et l’application fonctionne même hors connexion.',
      },
      {
        question: 'Quels formats audio sont pris en charge (MP3, WAV, FLAC, AAC, OGG, M4A) ?',
        answer:
          'Vous pouvez ouvrir des fichiers MP3, WAV, FLAC, AAC, OGG et M4A, ou extraire directement l’audio d’une vidéo locale MP4, WebM ou MOV. À l’export, enregistrez en MP3, en WAV 16 bits sans perte ou en sonnerie M4R pour iPhone.',
      },
      {
        question: 'Puis-je ajouter des fondus d’entrée et de sortie fluides sans perdre en qualité ?',
        answer:
          'Oui. Activez Fondu d’entrée et Fondu de sortie entre 0 et 5 secondes en visualisant la courbe en direct sur l’onde. Les fondus sont calculés en audio flottant 32 bits avant exportation en MP3 320 kbps ou WAV sans perte.',
      },
    ],
  },
  howToUse: {
    title: 'Comment Couper un MP3 et Créer une Sonnerie - MP3Cutter',
    description:
      'Guide étape par étape pour découper des pistes MP3, WAV, FLAC et AAC, ajouter des fondus doux et exporter des sonneries de 30 secondes.',
    ogImageAlt: 'Guide pour couper des chansons MP3 et créer des sonneries avec MP3Cutter',
    breadcrumbCurrent: 'Mode d’emploi',
    h1: 'Comment couper des chansons MP3 et créer des sonneries en privé',
    intro:
      'MP3Cutter fonctionne intégralement dans votre navigateur : découpez une chanson, retirez un passage au milieu d’un enregistrement ou créez une sonnerie personnalisée en quelques secondes, sans envoi ni compte.',
    stepsHeading: 'Quatre étapes simples pour découper n’importe quel audio',
    steps: [
      {
        title: '1. Chargez un fichier audio ou vidéo localement',
        description:
          'Glissez-déposez un fichier MP3, WAV, FLAC, AAC, OGG ou M4A dans le studio sur la page d’accueil, ou déposez une vidéo MP4, MOV ou WebM pour en extraire automatiquement la piste audio en mémoire.',
        tip: 'Envie de tester d’abord ? Cliquez sur « Essayer un audio d’exemple » pour générer instantanément une piste de démonstration hors ligne.',
      },
      {
        title: '2. Placez votre coupe sur la forme d’onde interactive',
        description:
          'Déplacez les poignées Début et Fin sur la forme d’onde ou saisissez un temps exact mm:ss.ms. Zoomez pour des coupes précises ou cliquez sur « Couper les silences » pour ajuster automatiquement le début et la fin.',
        tip: 'Utilisez les flèches gauche/droite sur une poignée sélectionnée pour décaler par pas de 0,1 s (Maj pour 1 seconde).',
      },
      {
        title: '3. Choisissez Conserver ou Supprimer et appliquez des fondus',
        description:
          'Choisissez « Conserver la sélection » pour garder uniquement l’extrait choisi, ou « Supprimer la sélection » pour retirer un passage central et recoller le reste sans clic. Activez les fondus (0–5 s).',
        tip: 'Lancez l’aperçu pour écouter vos fondus et le raccord exact avant le téléchargement.',
      },
      {
        title: '4. Exportez en MP3, WAV sans perte ou sonnerie iPhone M4R',
        description:
          'Sélectionnez MP3 (128, 192 ou 320 kbps) pour le quotidien et Android, WAV pour une qualité studio sans perte ou M4R pour iPhone. Cliquez sur « Télécharger l’audio découpé ».',
      },
    ],
    workflowsHeading: 'Usages courants du découpeur audio',
    workflows: [
      {
        title: 'Créer une sonnerie de 30 secondes M4R (iPhone) ou MP3 (Android)',
        description:
          'Cliquez sur « Sonnerie 30s » après avoir chargé votre titre, positionnez la fenêtre sur le refrain souhaité, activez un fondu d’entrée de 0,5 s et de sortie de 1,5 s, puis exportez en M4R ou MP3.',
      },
      {
        title: 'Supprimer un passage au milieu d’un podcast ou mémo vocal',
        description:
          'Surlignez la pause ou l’erreur à retirer, activez « Supprimer la sélection », vérifiez la fluidité du raccord en lecture et téléchargez votre piste nettoyée.',
      },
      {
        title: 'Extraire et couper le son d’une vidéo locale',
        description:
          'Déposez une vidéo MP4, WebM ou MOV directement dans la zone audio. MP3Cutter décode la piste sonore localement afin de la couper et l’exporter en MP3 ou WAV.',
      },
    ],
    ctaTitle: 'Prêt à découper votre audio ?',
    ctaDescription: 'Accédez au studio dans le navigateur : 100 % gratuit, privé et utilisable hors ligne.',
    ctaButton: 'Ouvrir le studio MP3Cutter',
  },
  hireMe: {
    title: 'Engager Kishara Dilshan - Dev Astro & WASM | MP3Cutter',
    description:
      'Besoin d’une application web rapide en Astro, React ou Next.js ou d’un outil WebAssembly local ? Engagez Kishara Dilshan pour vos projets.',
    ogImageAlt: 'Engager Kishara Dilshan pour le développement Astro, React et WebAssembly',
    breadcrumbCurrent: 'M’engager',
    h1: 'Disponible pour des projets freelance',
    heading: 'Besoin d’une solution informatique sur mesure ?',
    intro: 'Bonjour, je suis Kishara Dilshan, le développeur derrière MP3Cutter.',
    subcopy:
      'Si vous appréciez cet outil rapide côté client et recherchez une solution IT de haut niveau pour votre entreprise, je suis disponible en freelance. Mes spécialités :',
    specialties: [
      {
        title: 'Applications web ultra-rapides optimisées pour le SEO',
        description:
          'Astro, React, Next.js — conçues pour des chargements sous la seconde, un SEO technique rigoureux et une évolutivité propre.',
      },
      {
        title: 'Traitement côté client & outils WebAssembly (WASM)',
        description:
          'Utilitaires média, PDF et données sans serveur qui s’exécutent en toute confidentialité dans le navigateur.',
      },
      {
        title: 'Design UI/UX & pages d’atterrissage à forte conversion',
        description:
          'Interfaces minimalistes et accessibles pensées pour convertir vos visiteurs sur ordinateur comme sur mobile.',
      },
    ],
    ctaHeading: 'Construisons ensemble quelque chose de remarquable.',
    emailLabel: 'Écrivez-moi directement : kisharadilshan007@gmail.com',
    copyButtonLabel: 'Copier l’e-mail',
    copiedLabel: 'Copié !',
    emailButtonLabel: 'Envoyer un e-mail',
  },
  cutter: {
    dropzoneTitle: 'Déposez votre fichier audio ou vidéo ici',
    dropzoneSubtitle: 'Compatible MP3, WAV, FLAC, AAC, OGG, M4A et vidéos locales',
    selectAudioFile: 'Choisir un fichier audio',
    trySampleAudio: 'Essayer un audio d’exemple',
    openAnotherFile: 'Ouvrir un autre fichier',
    privacyBadge: 'Traitement 100 % local dans le navigateur • Zéro envoi',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: 'Décodage audio en cours dans votre navigateur...',
    loadedStatus: 'Audio prêt à être découpé.',
    sampleTrackName: 'mp3cutter-piste-demo.wav',
    playPreview: 'Lire',
    previewCut: 'Tester la coupe',
    pausePreview: 'Pause',
    stopPreview: 'Arrêter',
    cursorLabel: 'Curseur',
    setStartHere: 'Fixer début',
    setEndHere: 'Fixer fin',
    setStartTooltip: 'Définir le début au curseur actuel (I)',
    setEndTooltip: 'Définir la fin au curseur actuel (O)',
    startSetStatus: 'Point de début fixé à',
    endSetStatus: 'Point de fin fixé à',
    skipBackLabel: 'Reculer de 2 secondes',
    skipForwardLabel: 'Avancer de 2 secondes',
    loopLabel: 'Lire en boucle',
    modeKeepLabel: 'Conserver la sélection (Rogner)',
    modeKeepShort: 'Conserver',
    modeRemoveLabel: 'Supprimer la sélection (Couper)',
    modeRemoveShort: 'Supprimer',
    modeGroupLabel: 'Mode de découpe',
    startLabel: 'Début',
    endLabel: 'Fin',
    outputDurationLabel: 'Durée finale',
    originalDurationLabel: 'Original',
    fadeInLabel: 'Fondu entrée',
    fadeOutLabel: 'Fondu sortie',
    secondsShort: 's',
    ringtonePresetLabel: 'Sonnerie 30s',
    ringtonePresetApplied: 'Préréglage de sonnerie de 30 secondes appliqué.',
    trimSilenceLabel: 'Couper les silences',
    trimSilenceApplied: 'Silences de début et de fin supprimés.',
    trimSilenceNone: 'Aucun silence détecté au début ou à la fin.',
    zoomInLabel: 'Zoomer sur la forme d’onde',
    zoomOutLabel: 'Dézoomer la forme d’onde',
    zoomResetLabel: 'Réinitialiser le zoom',
    outputFormatLabel: 'Format de sortie',
    bitrateLabel: 'Qualité MP3',
    downloadButton: 'Télécharger l’audio découpé',
    exportingStatus: 'Encodage local dans votre navigateur...',
    exportReadyStatus: 'Export terminé ! Le téléchargement a démarré.',
    startHandleAria: 'Position de début de découpe',
    endHandleAria: 'Position de fin de découpe',
    waveformHint: 'Cliquez sur l’onde pour écouter n’importe où • I / O pour Début / Fin • Espace pour lire/pause',
    errorDecodeFailed:
      'Impossible de décoder ce fichier dans votre navigateur. Essayez un fichier MP3, WAV, FLAC, AAC, OGG, M4A ou MP4 standard.',
    errorInvalidSelection:
      'Veuillez conserver au moins 0,2 seconde d’audio dans la sortie avant d’exporter.',
    errorM4rUnsupported:
      'Votre navigateur ne prend pas en charge l’encodage natif AAC M4R. Exportez en MP3 ou WAV.',
    m4rRingtoneNote: 'Les sonneries iPhone doivent durer 40 secondes ou moins.',
    videoExtractedNote: 'Piste audio extraite localement de la vidéo.',
    fileSizeUnitKb: 'Ko',
    fileSizeUnitMb: 'Mo',
  },
};
