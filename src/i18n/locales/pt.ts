import type { TranslationDict } from '../types';

export const pt: TranslationDict = {
  langName: 'Português',
  nav: {
    home: 'Início',
    howToUse: 'Como usar',
    hireMe: 'Contrate-me',
    languageSelectorLabel: 'Selecionar idioma',
    themeToggleLabel: 'Alternar tema claro e escuro',
    switchToDark: 'Mudar para modo escuro',
    switchToLight: 'Mudar para modo claro',
    addToHomeScreen: 'Adicionar à tela inicial',
    supportDeveloper: 'Apoiar o desenvolvedor',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: 'Ir para o conteúdo principal',
    mainNavLabel: 'Navegação principal',
    breadcrumbLabel: 'Trilha de navegação',
  },
  pwa: {
    modalTitle: 'Instalar o MP3Cutter offline',
    modalDescription:
      'Adicione o MP3Cutter à tela inicial do seu dispositivo para cortar músicas e criar toques mesmo sem conexão com a internet.',
    installNow: 'Instalar aplicativo agora',
    alreadyInstalled: 'O MP3Cutter já está instalado neste dispositivo.',
    iosTitle: 'No iPhone ou iPad (Safari):',
    iosStep1: 'Toque no botão Compartilhar na barra inferior do Safari.',
    iosStep2: 'Role para baixo e toque em "Adicionar à Tela de Início".',
    iosStep3: 'Toque em "Adicionar" no canto superior direito para usar offline.',
    desktopHint:
      'Você também pode instalar o MP3Cutter pelo ícone na barra de endereço ou menu do navegador ("Instalar aplicativo").',
    close: 'Fechar',
  },
  footer: {
    tagline: 'Cortador de MP3 privado sem uploads e criador de toques direto no navegador.',
    privacyNote: 'Seus arquivos de áudio nunca saem do seu dispositivo.',
    builtBy: 'Desenvolvido por Kishara Dilshan',
    copyright: '© 2026 MP3Cutter. Código aberto sob licença MIT.',
  },
  home: {
    title: 'Cortar MP3 Online Grátis - Recortar Áudio e Criar Toques',
    description:
      'Corte e recorte arquivos MP3, WAV, FLAC e AAC online com fade-in e fade-out suaves. Cortador de MP3 100% grátis no navegador, sem uploads.',
    ogImageAlt: 'Interface do MP3Cutter para cortar áudio e criar toques online',
    h1: 'Cortador de MP3 — Corte Áudio, Músicas e Toques Online',
    heroSubtitle:
      'Corte e recorte faixas MP3, WAV, FLAC, OGG e AAC diretamente no navegador com controles suaves de fade-in e fade-out. 100% grátis, sem uploads e sem cadastro.',
    faqHeading: 'Perguntas frequentes',
    faqSubheading: 'Tudo o que você precisa saber para cortar áudios com privacidade no navegador.',
    faqs: [
      {
        question: 'Como cortar uma música MP3 ou fazer um toque de 30 segundos online?',
        answer:
          'Solte sua faixa na área acima ou clique em Selecionar arquivo de áudio. Arraste as alças de início e fim na forma de onda — ou clique em Toque 30s — para marcar o refrão ideal. Ouça a prévia, escolha MP3 para Android ou M4R para iPhone e clique em Baixar áudio cortado.',
      },
      {
        question: 'Meus arquivos de áudio são enviados para algum servidor?',
        answer:
          'Nunca. O MP3Cutter decodifica, edita e exporta tudo 100% localmente no seu navegador usando Web Audio API e codificadores no cliente. Seus áudios jamais deixam o dispositivo e o aplicativo funciona até offline.',
      },
      {
        question: 'Quais formatos de áudio são suportados (MP3, WAV, FLAC, AAC, OGG, M4A)?',
        answer:
          'Você pode abrir faixas MP3, WAV, FLAC, AAC, OGG e M4A, além de extrair e recortar o áudio diretamente de vídeos locais MP4, WebM ou MOV. Na exportação, salve em MP3, WAV 16 bits sem perdas ou M4R pronto para iPhone.',
      },
      {
        question: 'Posso adicionar fade-in e fade-out suaves sem perder qualidade sonora?',
        answer:
          'Sim. Ative Fade In e Fade Out e ajuste cada duração de 0 a 5 segundos observando a curva ao vivo sobre a onda. Todos os fades são processados em ponto flutuante de 32 bits antes de salvar em MP3 320 kbps ou WAV sem perdas.',
      },
    ],
  },
  howToUse: {
    title: 'Como Cortar Músicas MP3 e Criar Toques Online - MP3Cutter',
    description:
      'Guia passo a passo para recortar faixas MP3, WAV, FLAC e AAC, aplicar fade-in e fade-out suaves e exportar toques de 30 segundos com sigilo.',
    ogImageAlt: 'Guia passo a passo para cortar músicas MP3 e criar toques no MP3Cutter',
    breadcrumbCurrent: 'Como usar',
    h1: 'Como cortar músicas MP3 e criar toques personalizados com privacidade',
    intro:
      'O MP3Cutter roda totalmente dentro do seu navegador para que você corte músicas, remova trechos indesejados do meio da faixa ou crie toques em segundos — sem enviar arquivos e sem cadastro.',
    stepsHeading: 'Quatro passos simples para cortar qualquer áudio',
    steps: [
      {
        title: '1. Carregue um arquivo de áudio ou vídeo localmente',
        description:
          'Arraste e solte um arquivo MP3, WAV, FLAC, AAC, OGG ou M4A na caixa do editor na página inicial — ou solte um vídeo MP4, MOV ou WebM para extrair o áudio automaticamente na memória local.',
        tip: 'Quer testar antes? Clique em "Testar áudio de exemplo" para gerar uma faixa demonstrativa instantânea offline.',
      },
      {
        title: '2. Marque o corte na forma de onda interativa',
        description:
          'Arraste as alças de Início e Fim sobre a onda ou digite tempos exatos mm:ss.ms. Use o zoom para cortes precisos ou clique em "Remover silêncio" para eliminar silêncios iniciais e finais automaticamente.',
        tip: 'Use as setas esquerda e direita com uma alça selecionada para ajustar em passos de 0,1s (segure Shift para 1s).',
      },
      {
        title: '3. Escolha manter ou remover a seleção e aplique fades',
        description:
          'Use "Manter seleção" para salvar apenas o trecho destacado, ou "Remover seleção" para cortar uma parte do meio e unir o restante suavemente. Ative Fade In e Fade Out (0s–5s) para transições limpas.',
        tip: 'Use Reproduzir prévia para ouvir os fades e a emenda exata antes de baixar.',
      },
      {
        title: '4. Exporte em MP3, WAV sem perdas ou toque M4R para iPhone',
        description:
          'Escolha MP3 (128, 192 ou 320 kbps) para uso diário e Android, WAV para qualidade de estúdio sem compressão ou M4R para iPhone. Clique em "Baixar áudio cortado" para salvar direto no dispositivo.',
      },
    ],
    workflowsHeading: 'Usos mais comuns do cortador de áudio',
    workflows: [
      {
        title: 'Criar um toque de 30 segundos M4R para iPhone ou MP3 para Android',
        description:
          'Clique em "Toque 30s" após carregar sua música, arraste a janela de 30 segundos sobre o refrão favorito, ative um Fade In de 0,5s e Fade Out de 1,5s e exporte em M4R ou MP3.',
      },
      {
        title: 'Remover uma parte do meio de podcasts ou gravações de voz',
        description:
          'Selecione a pausa ou trecho indesejado, ative o modo "Remover seleção", confira a emenda na prévia e baixe o áudio limpo.',
      },
      {
        title: 'Extrair e cortar o áudio de um vídeo local',
        description:
          'Solte qualquer vídeo MP4, WebM ou MOV na área de upload local. O MP3Cutter decodifica a trilha sonora no navegador para você recortar e salvar em MP3 ou WAV.',
      },
    ],
    ctaTitle: 'Pronto para cortar seu áudio?',
    ctaDescription: 'Entre direto no estúdio do navegador — 100% grátis, privado e funciona offline.',
    ctaButton: 'Abrir estúdio MP3Cutter',
  },
  hireMe: {
    title: 'Contratar Kishara Dilshan - Dev Astro e WASM | MP3Cutter',
    description:
      'Precisa de um site ultrarrápido em Astro, React ou Next.js ou ferramenta WebAssembly? Contrate Kishara Dilshan para soluções sob medida.',
    ogImageAlt: 'Contratar Kishara Dilshan para desenvolvimento Astro, React e WebAssembly',
    breadcrumbCurrent: 'Contrate-me',
    h1: 'Disponível para projetos freelance',
    heading: 'Precisa de uma solução de TI sob medida?',
    intro: 'Olá, sou Kishara Dilshan, o desenvolvedor por trás do MP3Cutter.',
    subcopy:
      'Se você gosta desta ferramenta rápida no lado do cliente e precisa de uma solução de TI de alto nível para o seu negócio, estou disponível para projetos freelance. Sou especialista em:',
    specialties: [
      {
        title: 'Aplicações web ultrarrápidas e otimizadas para SEO',
        description:
          'Astro, React, Next.js — projetadas para carregamento abaixo de um segundo, SEO técnico sólido e escalabilidade limpa.',
      },
      {
        title: 'Processamento no cliente e ferramentas WebAssembly (WASM)',
        description:
          'Utilitários de mídia, PDF e dados sem servidor que funcionam com privacidade direto no navegador.',
      },
      {
        title: 'Design UI/UX e landing pages de alta conversão',
        description:
          'Interfaces minimalistas e acessíveis feitas para converter visitantes com naturalidade em desktop e mobile.',
      },
    ],
    ctaHeading: 'Vamos construir algo incrível juntos.',
    emailLabel: 'Envie um e-mail direto: kisharadilshan007@gmail.com',
    copyButtonLabel: 'Copiar e-mail',
    copiedLabel: 'Copiado!',
    emailButtonLabel: 'Enviar e-mail',
  },
  cutter: {
    dropzoneTitle: 'Solte seu arquivo de áudio ou vídeo aqui',
    dropzoneSubtitle: 'Suporta MP3, WAV, FLAC, AAC, OGG, M4A e clipes de vídeo locais',
    selectAudioFile: 'Selecionar arquivo de áudio',
    trySampleAudio: 'Testar áudio de exemplo',
    openAnotherFile: 'Abrir outro arquivo',
    privacyBadge: 'Processamento 100% local no navegador • Zero uploads',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: 'Decodificando o áudio localmente no navegador...',
    loadedStatus: 'Áudio pronto para cortar.',
    sampleTrackName: 'mp3cutter-faixa-demo.wav',
    playPreview: 'Reproduzir',
    previewCut: 'Ouvir corte',
    pausePreview: 'Pausar',
    stopPreview: 'Parar',
    cursorLabel: 'Cursor',
    setStartHere: 'Definir início',
    setEndHere: 'Definir fim',
    setStartTooltip: 'Definir início na posição atual (I)',
    setEndTooltip: 'Definir fim na posição atual (O)',
    startSetStatus: 'Início definido em',
    endSetStatus: 'Fim definido em',
    skipBackLabel: 'Voltar 2 segundos',
    skipForwardLabel: 'Avançar 2 segundos',
    loopLabel: 'Repetir prévia',
    modeKeepLabel: 'Manter seleção (Recortar)',
    modeKeepShort: 'Manter seleção',
    modeRemoveLabel: 'Remover seleção (Cortar)',
    modeRemoveShort: 'Remover seleção',
    modeGroupLabel: 'Modo de corte',
    startLabel: 'Início',
    endLabel: 'Fim',
    outputDurationLabel: 'Duração final',
    originalDurationLabel: 'Original',
    fadeInLabel: 'Fade In',
    fadeOutLabel: 'Fade Out',
    secondsShort: 's',
    ringtonePresetLabel: 'Toque 30s',
    ringtonePresetApplied: 'Predefinição de toque de 30 segundos aplicada.',
    trimSilenceLabel: 'Remover silêncio',
    trimSilenceApplied: 'Silêncio inicial e final removido.',
    trimSilenceNone: 'Nenhum silêncio detectado no início ou fim.',
    zoomInLabel: 'Aumentar zoom da onda',
    zoomOutLabel: 'Diminuir zoom da onda',
    zoomResetLabel: 'Redefinir zoom',
    outputFormatLabel: 'Formato de saída',
    bitrateLabel: 'Qualidade MP3',
    downloadButton: 'Baixar áudio cortado',
    exportingStatus: 'Codificando localmente no seu navegador...',
    exportReadyStatus: 'Exportação concluída! O download do seu áudio começou.',
    startHandleAria: 'Posição inicial do corte',
    endHandleAria: 'Posição final do corte',
    waveformHint: 'Clique na onda para ouvir qualquer trecho • Teclas I / O marcam Início / Fim • Espaço pausa',
    errorDecodeFailed:
      'Não foi possível decodificar este arquivo no navegador. Tente um arquivo MP3, WAV, FLAC, AAC, OGG, M4A ou MP4 padrão.',
    errorInvalidSelection:
      'Deixe pelo menos 0,2 segundos de áudio na saída antes de exportar.',
    errorM4rUnsupported:
      'Seu navegador não suporta codificação nativa AAC M4R. Exporte como MP3 ou WAV.',
    m4rRingtoneNote: 'Toques de iPhone devem ter 40 segundos ou menos.',
    videoExtractedNote: 'Faixa de áudio extraída localmente do vídeo.',
    fileSizeUnitKb: 'KB',
    fileSizeUnitMb: 'MB',
  },
};
