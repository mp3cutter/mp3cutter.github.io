import type { TranslationDict } from '../types';

export const es: TranslationDict = {
  langName: 'Español',
  nav: {
    home: 'Inicio',
    howToUse: 'Cómo usar',
    hireMe: 'Contrátame',
    languageSelectorLabel: 'Seleccionar idioma',
    themeToggleLabel: 'Cambiar entre modo claro y oscuro',
    switchToDark: 'Cambiar a modo oscuro',
    switchToLight: 'Cambiar a modo claro',
    addToHomeScreen: 'Añadir a inicio',
    supportDeveloper: 'Apoyar al desarrollador',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: 'Saltar al contenido principal',
    mainNavLabel: 'Navegación principal',
    breadcrumbLabel: 'Ruta de navegación',
  },
  pwa: {
    modalTitle: 'Instalar MP3Cutter sin conexión',
    modalDescription:
      'Añade MP3Cutter a tu pantalla de inicio para recortar canciones y crear tonos sin conexión a internet en cualquier momento.',
    installNow: 'Instalar aplicación ahora',
    alreadyInstalled: 'MP3Cutter ya está instalado en este dispositivo.',
    iosTitle: 'En iPhone o iPad (Safari):',
    iosStep1: 'Pulsa el botón Compartir en la parte inferior de Safari.',
    iosStep2: 'Desplázate y pulsa «Añadir a pantalla de inicio».',
    iosStep3: 'Pulsa «Añadir» arriba a la derecha para abrirlo sin conexión.',
    desktopHint:
      'También puedes instalar MP3Cutter desde el icono de la barra de direcciones o el menú del navegador («Instalar aplicación»).',
    close: 'Cerrar',
  },
  footer: {
    tagline: 'Cortador de MP3 privado sin subidas y creador de tonos directo en tu navegador.',
    privacyNote: 'Tus archivos de audio nunca salen de tu dispositivo.',
    builtBy: 'Desarrollado por Kishara Dilshan',
    copyright: '© 2026 MP3Cutter. Código abierto bajo licencia MIT.',
  },
  home: {
    title: 'Cortar MP3 Online Gratis - Recortar Audio y Tonos MP3',
    description:
      'Corta y recorta archivos MP3, WAV, FLAC y AAC online con fundidos suaves de entrada y salida. Editor de audio 100 % gratis en tu navegador.',
    ogImageAlt: 'Interfaz de MP3Cutter para recortar audio y crear tonos online',
    h1: 'Cortador de MP3 — Recorta Audio, Canciones y Tonos Online',
    heroSubtitle:
      'Recorta archivos MP3, WAV, FLAC, OGG y AAC directamente en tu navegador con fundidos suaves de entrada y salida. 100 % gratis, sin subidas y sin registro.',
    faqHeading: 'Preguntas frecuentes',
    faqSubheading: 'Todo lo que necesitas saber para recortar audio de forma privada en tu navegador.',
    faqs: [
      {
        question: '¿Cómo corto una canción MP3 o creo un tono de 30 segundos online?',
        answer:
          'Arrastra tu pista al espacio superior o pulsa Seleccionar archivo de audio. Mueve los tiradores de inicio y fin sobre la onda —o pulsa el ajuste rápido de Tono de 30s— para elegir el estribillo exacto. Escucha la vista previa, elige MP3 para Android o M4R para iPhone y descarga el resultado.',
      },
      {
        question: '¿Se suben mis archivos de audio a un servidor al recortarlos?',
        answer:
          'Nunca. MP3Cutter decodifica, edita y codifica cada archivo 100 % de forma local dentro de tu navegador mediante Web Audio API y codificadores en el cliente. Tus grabaciones nunca salen de tu dispositivo y la app funciona incluso sin conexión.',
      },
      {
        question: '¿Qué formatos de audio son compatibles (MP3, WAV, FLAC, AAC, OGG, M4A)?',
        answer:
          'Puedes abrir archivos MP3, WAV, FLAC, AAC, OGG y M4A, además de extraer y recortar el audio directamente desde vídeos locales MP4, WebM o MOV. Al exportar, puedes guardar en MP3, WAV de 16 bits sin pérdida o formato M4R para iPhone.',
      },
      {
        question: '¿Puedo aplicar fundidos suaves de entrada y salida sin perder calidad?',
        answer:
          'Sí. Activa Entrada gradual (Fade In) y Salida gradual (Fade Out) entre 0 y 5 segundos mientras ves la curva en vivo sobre la forma de onda. Los fundidos se calculan en audio flotante de 32 bits antes de exportar a MP3 de 320 kbps o WAV sin pérdida.',
      },
    ],
  },
  howToUse: {
    title: 'Cómo Cortar Canciones MP3 y Crear Tonos Online - MP3Cutter',
    description:
      'Guía paso a paso para recortar pistas MP3, WAV, FLAC y AAC, aplicar efectos de fundido suaves y exportar tonos de 30 segundos en privado.',
    ogImageAlt: 'Guía paso a paso para cortar MP3 y crear tonos con MP3Cutter',
    breadcrumbCurrent: 'Cómo usar',
    h1: 'Cómo cortar canciones MP3 y crear tonos personalizados en privado',
    intro:
      'MP3Cutter se ejecuta por completo dentro de tu navegador para que puedas recortar canciones, eliminar partes intermedias o crear tonos de teléfono en segundos, sin subir archivos ni crear cuentas.',
    stepsHeading: 'Cuatro pasos sencillos para recortar cualquier audio',
    steps: [
      {
        title: '1. Carga un archivo de audio o vídeo localmente',
        description:
          'Arrastra y suelta un archivo MP3, WAV, FLAC, AAC, OGG o M4A en el editor de la página principal, o suelta un vídeo MP4, MOV o WebM para extraer su pista de audio automáticamente en memoria.',
        tip: '¿Quieres probar los controles primero? Pulsa «Probar audio de ejemplo» para generar una pista demostrativa al instante sin conexión.',
      },
      {
        title: '2. Ajusta tu corte en la forma de onda interactiva',
        description:
          'Arrastra los tiradores de Inicio y Fin sobre la onda o escribe tiempos exactos mm:ss.ms. Usa el zoom para ver detalles precisos o pulsa «Quitar silencio» para recortar automáticamente el silencio inicial y final.',
        tip: 'Usa las flechas izquierda y derecha con un tirador enfocado para mover el corte 0,1 s (mantén Shift para saltos de 1 segundo).',
      },
      {
        title: '3. Elige mantener o eliminar la selección y añade fundidos',
        description:
          'Selecciona «Mantener selección» para conservar el tramo marcado o «Eliminar selección» para quitar una parte intermedia y unir el resto sin saltos. Activa Fade In y Fade Out (0s–5s) para transiciones limpias.',
        tip: 'Pulsa Reproducir vista previa para escuchar tus fundidos y el punto de unión antes de exportar.',
      },
      {
        title: '4. Exporta como MP3, WAV sin pérdida o tono M4R para iPhone',
        description:
          'Elige MP3 (128, 192 o 320 kbps) para uso diario y tonos de Android, WAV para máxima fidelidad sin pérdida o M4R para iPhone. Pulsa «Descargar audio recortado» para guardarlo directamente en tu equipo.',
      },
    ],
    workflowsHeading: 'Flujos de trabajo populares',
    workflows: [
      {
        title: 'Crear un tono de 30 segundos en M4R para iPhone o MP3 para Android',
        description:
          'Pulsa «Ajuste tono 30s» tras cargar tu canción, coloca la ventana sobre tu estribillo favorito, activa un Fade In de 0,5 s y Fade Out de 1,5 s y exporta en M4R para iOS o MP3 para Android.',
      },
      {
        title: 'Quitar una parte intermedia de un pódcast o nota de voz',
        description:
          'Marca la pausa o error que quieras eliminar, cambia al modo «Eliminar selección», comprueba la unión con la vista previa y descarga el archivo limpio.',
      },
      {
        title: 'Extraer y recortar el audio de un vídeo local',
        description:
          'Suelta cualquier vídeo MP4, WebM o MOV en el área de carga. MP3Cutter decodifica su pista de audio en tu navegador para recortarla y guardarla como MP3 o WAV.',
      },
    ],
    ctaTitle: '¿Listo para recortar tu audio?',
    ctaDescription: 'Abre el estudio en tu navegador: 100 % gratis, privado y funciona sin conexión.',
    ctaButton: 'Abrir estudio MP3Cutter',
  },
  hireMe: {
    title: 'Contratar a Kishara Dilshan - Desarrollador Astro y WASM',
    description:
      '¿Necesitas una web ultrarrápida en Astro, React o Next.js o una herramienta WebAssembly? Contrata a Kishara Dilshan para soluciones a medida.',
    ogImageAlt: 'Contratar a Kishara Dilshan para desarrollo Astro, React y WebAssembly',
    breadcrumbCurrent: 'Contrátame',
    h1: 'Disponible para proyectos freelance',
    heading: '¿Necesitas una solución IT a medida?',
    intro: 'Hola, soy Kishara Dilshan, el desarrollador detrás de MP3Cutter.',
    subcopy:
      'Si te gusta esta herramienta rápida del lado del cliente y necesitas una solución IT de primer nivel para tu negocio, estoy disponible para proyectos freelance. Me especializo en:',
    specialties: [
      {
        title: 'Aplicaciones web ultrarrápidas y optimizadas para SEO',
        description:
          'Astro, React, Next.js — diseñadas para cargas en menos de un segundo, SEO técnico impecable y escalabilidad limpia.',
      },
      {
        title: 'Procesamiento en el cliente y herramientas WebAssembly (WASM)',
        description:
          'Utilidades multimedia, PDF y de datos sin servidor que se ejecutan de forma privada dentro del navegador.',
      },
      {
        title: 'Diseño UI/UX y páginas de aterrizaje de alta conversión',
        description:
          'Interfaces minimalistas y accesibles creadas para convertir visitantes con naturalidad en escritorio y móvil.',
      },
    ],
    ctaHeading: 'Construyamos algo increíble juntos.',
    emailLabel: 'Escríbeme directamente: kisharadilshan007@gmail.com',
    copyButtonLabel: 'Copiar correo',
    copiedLabel: '¡Copiado!',
    emailButtonLabel: 'Enviar correo',
  },
  cutter: {
    dropzoneTitle: 'Arrastra aquí tu archivo de audio o vídeo',
    dropzoneSubtitle: 'Compatible con MP3, WAV, FLAC, AAC, OGG, M4A y vídeos locales',
    selectAudioFile: 'Seleccionar archivo de audio',
    trySampleAudio: 'Probar audio de ejemplo',
    openAnotherFile: 'Abrir otro archivo',
    privacyBadge: 'Procesamiento 100 % local en tu navegador • Cero subidas',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: 'Decodificando el audio localmente en tu navegador...',
    loadedStatus: 'Audio listo para recortar.',
    sampleTrackName: 'mp3cutter-pista-demo.wav',
    playPreview: 'Reproducir',
    previewCut: 'Probar corte',
    pausePreview: 'Pausar',
    stopPreview: 'Detener',
    cursorLabel: 'Cursor',
    setStartHere: 'Fijar inicio',
    setEndHere: 'Fijar fin',
    setStartTooltip: 'Fijar inicio en el cursor actual (I)',
    setEndTooltip: 'Fijar fin en el cursor actual (O)',
    startSetStatus: 'Punto de inicio fijado en',
    endSetStatus: 'Punto final fijado en',
    skipBackLabel: 'Retroceder 2 segundos',
    skipForwardLabel: 'Avanzar 2 segundos',
    loopLabel: 'Repetir vista previa',
    modeKeepLabel: 'Mantener selección (Recortar)',
    modeKeepShort: 'Mantener selección',
    modeRemoveLabel: 'Eliminar selección (Cortar)',
    modeRemoveShort: 'Eliminar selección',
    modeGroupLabel: 'Modo de corte',
    startLabel: 'Inicio',
    endLabel: 'Fin',
    outputDurationLabel: 'Duración final',
    originalDurationLabel: 'Original',
    fadeInLabel: 'Fade In',
    fadeOutLabel: 'Fade Out',
    secondsShort: 's',
    ringtonePresetLabel: 'Ajuste tono 30s',
    ringtonePresetApplied: 'Ajuste de tono de 30 segundos aplicado.',
    trimSilenceLabel: 'Quitar silencio',
    trimSilenceApplied: 'Silencio inicial y final recortado.',
    trimSilenceNone: 'No se detectó silencio al principio ni al final.',
    zoomInLabel: 'Acercar forma de onda',
    zoomOutLabel: 'Alejar forma de onda',
    zoomResetLabel: 'Restablecer zoom',
    outputFormatLabel: 'Formato de salida',
    bitrateLabel: 'Calidad MP3',
    downloadButton: 'Descargar audio recortado',
    exportingStatus: 'Codificando localmente en tu navegador...',
    exportReadyStatus: '¡Exportación completa! La descarga de tu audio ha comenzado.',
    startHandleAria: 'Posición de inicio del corte',
    endHandleAria: 'Posición de fin del corte',
    waveformHint: 'Haz clic en la onda para escuchar cualquier punto • I / O para fijar Inicio / Fin • Espacio para pausar',
    errorDecodeFailed:
      'No se pudo decodificar este archivo en tu navegador. Prueba un archivo estándar MP3, WAV, FLAC, AAC, OGG, M4A o MP4.',
    errorInvalidSelection:
      'Deja al menos 0,2 segundos de audio en el resultado antes de exportar.',
    errorM4rUnsupported:
      'Tu navegador no admite la codificación nativa AAC M4R. Exporta como MP3 o WAV.',
    m4rRingtoneNote: 'Los tonos de iPhone deben durar 40 segundos o menos.',
    videoExtractedNote: 'Pista de audio extraída localmente del vídeo.',
    fileSizeUnitKb: 'KB',
    fileSizeUnitMb: 'MB',
  },
};
