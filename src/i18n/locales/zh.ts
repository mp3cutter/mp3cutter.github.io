import type { TranslationDict } from '../types';

export const zh: TranslationDict = {
  langName: '简体中文',
  nav: {
    home: '首页',
    howToUse: '使用指南',
    hireMe: '雇佣我',
    languageSelectorLabel: '选择语言',
    themeToggleLabel: '切换浅色和深色主题',
    switchToDark: '切换到深色模式',
    switchToLight: '切换到浅色模式',
    addToHomeScreen: '添加到主屏幕',
    supportDeveloper: '支持开发者',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: '跳转到主要内容',
    mainNavLabel: '主导航',
    breadcrumbLabel: '面包屑导航',
  },
  pwa: {
    modalTitle: '离线安装 MP3Cutter',
    modalDescription:
      '将 MP3Cutter 添加到您的主屏幕，无需联网也能随时剪辑音乐和制作手机铃声。',
    installNow: '立即安装应用',
    alreadyInstalled: 'MP3Cutter 已安装在此设备上。',
    iosTitle: '在 iPhone 或 iPad (Safari) 上：',
    iosStep1: '轻点 Safari 底部的“分享”按钮。',
    iosStep2: '向下滚动并轻点“添加到主屏幕”。',
    iosStep3: '轻点右上角“添加”，之后即可随时离线启动。',
    desktopHint:
      '您也可以点击浏览器地址栏中的安装图标，或在浏览器菜单中选择“安装应用”。',
    close: '关闭',
  },
  footer: {
    tagline: '零上传、纯浏览器本地运行的免费 MP3 剪切器与手机铃声制作工具。',
    privacyNote: '您的音频文件绝不会离开本地设备。',
    builtBy: '由 Kishara Dilshan 开发',
    copyright: '© 2026 MP3Cutter. 基于 MIT 协议开源。',
  },
  home: {
    title: '免费在线MP3剪切器 — 音频剪辑与手机铃声制作 | MP3Cutter',
    description:
      '在浏览器本地免费剪切与裁剪MP3、WAV、FLAC和AAC音频文件，支持平滑淡入淡出效果与iPhone/安卓铃声导出。全程零上传、免注册、支持离线使用。',
    ogImageAlt: 'MP3Cutter 浏览器在线音频剪切与铃声制作界面',
    h1: 'MP3 剪切器 — 在线裁剪音频、剪切歌曲与制作铃声',
    heroSubtitle:
      '直接在浏览器中剪切和裁剪 MP3、WAV、FLAC、OGG 和 AAC 音频，支持平滑淡入淡出。100% 免费、零上传、无需注册。',
    faqHeading: '常见问题',
    faqSubheading: '了解如何在浏览器中私密、无损地裁剪音频和制作手机铃声。',
    faqs: [
      {
        question: '如何在线剪切 MP3 歌曲或制作 30 秒手机铃声？',
        answer:
          '将音频拖入上方工作区或点击“选择音频文件”。在波形上拖动起止滑块——或点击“30秒铃声预设”按钮——精准框选副歌片段，试听满意后选择安卓 MP3 或 iPhone M4R 格式下载即可。',
      },
      {
        question: '裁剪音频时，我的文件会被上传到服务器吗？',
        answer:
          '绝不会。MP3Cutter 利用 Web Audio API 与浏览器端编码器在您的设备本地完成 100% 的解码、剪辑和导出。您的音频与录音从不离开设备，添加到主屏幕后还可完全离线运行。',
      },
      {
        question: '支持哪些音频格式（MP3、WAV、FLAC、AAC、OGG、M4A）？',
        answer:
          '支持直接打开 MP3、WAV、FLAC、AAC、OGG 和 M4A 音频，也支持从本地 MP4、WebM 或 MOV 视频中直接提取并裁剪音轨。导出支持 MP3、无损 16 位 WAV 以及 iPhone 专用的 M4R 铃声格式。',
      },
      {
        question: '可以在不降低音质的前提下添加平滑淡入淡出效果吗？',
        answer:
          '可以。开启淡入和淡出并自由设置 0 到 5 秒时长，同时可在波形图上实时查看包络曲线。所有淡变均采用 32 位浮点运算处理，并支持导出 320 kbps 高码率 MP3 或完全无损的 WAV。',
      },
    ],
  },
  howToUse: {
    title: '如何在线剪辑MP3音乐并制作手机铃声 — 使用指南 | MP3Cutter',
    description:
      '分步了解如何在浏览器中本地裁剪MP3、WAV、FLAC和AAC音轨，删除中间片段、添加淡入淡出并导出30秒MP3或M4R铃声，全程零上传。',
    ogImageAlt: 'MP3Cutter 在线剪辑歌曲与制作铃声分步指南',
    breadcrumbCurrent: '使用指南',
    h1: '如何私密裁剪 MP3 歌曲并制作自定义手机铃声',
    intro:
      'MP3Cutter 完全在您的浏览器本地运行，无需上传文件或注册账号，只需几秒即可完成歌曲裁剪、去除中间多余片段或导出自定义手机铃声。',
    stepsHeading: '简单四步裁剪任意音频文件',
    steps: [
      {
        title: '1. 在本地加载音频或视频文件',
        description:
          '将 MP3、WAV、FLAC、AAC、OGG 或 M4A 文件拖放至首页编辑器中，或直接拖入 MP4、MOV、WebM 视频文件以在浏览器内存中自动提取音轨。',
        tip: '想先体验功能？点击“试用示例音频”即可离线瞬间生成演示音轨。',
      },
      {
        title: '2. 在交互式波形图上精准定位起止点',
        description:
          '在波形图上拖动开始和结束滑块，或手动输入精确的 mm:ss.ms 时间点。利用缩放功能查看细节波形，或一键点击“去除静音”自动截去开头与结尾的空白声音。',
        tip: '选中滑块后按左右方向键可微调 0.1 秒（按住 Shift 键每次调整 1 秒）。',
      },
      {
        title: '3. 选择保留或删除选区并添加淡入淡出',
        description:
          '选择“保留选区（裁剪）”仅导出高亮片段，或切换到“删除选区（剪除）”去掉中间多余部分并平滑拼接剩余音频。可开启 0–5 秒淡入淡出让衔接更自然。',
        tip: '导出前点击“播放预览”，实时试听淡入淡出与拼接效果。',
      },
      {
        title: '4. 导出为 MP3、无损 WAV 或 iPhone M4R 铃声',
        description:
          '日常播放和安卓铃声推荐 MP3（128/192/320 kbps），无损母带推荐 WAV，iPhone 铃声请选择 M4R。点击“下载裁剪后的音频”直接保存至本地。',
      },
    ],
    workflowsHeading: '常用音频剪辑场景',
    workflows: [
      {
        title: '制作 30 秒 iPhone M4R 或安卓 MP3 手机铃声',
        description:
          '加载歌曲后点击“30秒铃声预设”，将 30 秒窗口移至高潮副歌，开启 0.5 秒淡入和 1.5 秒淡出，最后导出为 M4R（iOS）或 MP3（安卓）。',
      },
      {
        title: '剪除播客或语音录音中间的多余停顿',
        description:
          '框选需要去掉的口误或停顿区间，切换至“删除选区（剪除）”模式，预览确认拼接平滑无卡顿后直接下载。',
      },
      {
        title: '从本地视频片段中提取并裁剪音频',
        description:
          '直接将本地 MP4、WebM 或 MOV 视频拖入上传区，MP3Cutter 会在浏览器本地解码音轨，方便您截取台词或背景音乐并导出为 MP3 或 WAV。',
      },
    ],
    ctaTitle: '准备好裁剪您的音频了吗？',
    ctaDescription: '立即进入浏览器音频工作室——100% 免费、私密，且支持离线使用。',
    ctaButton: '打开 MP3Cutter 工作室',
  },
  hireMe: {
    title: '雇佣 Kishara Dilshan — Astro 与 WASM 开发者 | MP3Cutter',
    description:
      '需要极速 Astro、React、Next.js 网站或浏览器端 WebAssembly 本地工具？联系 Kishara Dilshan 定制高转化且符合技术 SEO 标准的解决方案。',
    ogImageAlt: '雇佣 Kishara Dilshan 定制 Astro、React、Next.js 与 WebAssembly 项目',
    breadcrumbCurrent: '雇佣我',
    h1: '承接自由职业与定制开发项目',
    heading: '需要定制化 IT 解决方案？',
    intro: '你好，我是 Kishara Dilshan，MP3Cutter 的开发者。',
    subcopy:
      '如果您喜欢这款高速、纯浏览器端的工具，并希望为您的业务打造一流的 IT 解决方案，欢迎与我合作。我的核心专长包括：',
    specialties: [
      {
        title: '极速加载、深度 SEO 优化的 Web 应用',
        description:
          '精通 Astro、React、Next.js —— 专注亚秒级首屏加载、规范的技术 SEO 与高可扩展架构。',
      },
      {
        title: '浏览器端本地处理与 WebAssembly (WASM) 工具',
        description:
          '打造零服务器成本、保护用户隐私的音视频、PDF 及数据处理浏览器工具。',
      },
      {
        title: 'UI/UX 设计与高转化率落地页',
        description:
          '极简且符合无障碍标准的界面设计，助力桌面与移动端访客顺畅转化。',
      },
    ],
    ctaHeading: '让我们一起打造令人惊艳的作品。',
    emailLabel: '直接发邮件给我：kisharadilshan007@gmail.com',
    copyButtonLabel: '复制邮箱',
    copiedLabel: '已复制！',
    emailButtonLabel: '发送邮件',
  },
  cutter: {
    dropzoneTitle: '将音频或视频文件拖放到此处',
    dropzoneSubtitle: '支持 MP3、WAV、FLAC、AAC、OGG、M4A 及本地视频文件',
    selectAudioFile: '选择音频文件',
    trySampleAudio: '试用示例音频',
    openAnotherFile: '打开其他文件',
    privacyBadge: '100% 浏览器本地处理 • 零文件上传',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: '正在浏览器本地解码音频...',
    loadedStatus: '音频已就绪，可以开始裁剪。',
    sampleTrackName: 'mp3cutter-demo-track.wav',
    playPreview: '播放',
    previewCut: '试听剪辑',
    pausePreview: '暂停',
    stopPreview: '停止',
    cursorLabel: '播放位置',
    setStartHere: '设为起点',
    setEndHere: '设为终点',
    setStartTooltip: '将当前播放位置设为起点 (I)',
    setEndTooltip: '将当前播放位置设为终点 (O)',
    startSetStatus: '已将起点设为',
    endSetStatus: '已将终点设为',
    skipBackLabel: '后退 2 秒',
    skipForwardLabel: '前进 2 秒',
    loopLabel: '循环试听',
    modeKeepLabel: '保留选区（裁剪）',
    modeKeepShort: '保留选区',
    modeRemoveLabel: '删除选区（剪除）',
    modeRemoveShort: '删除选区',
    modeGroupLabel: '剪辑模式',
    startLabel: '开始',
    endLabel: '结束',
    outputDurationLabel: '输出时长',
    originalDurationLabel: '原始时长',
    fadeInLabel: '淡入',
    fadeOutLabel: '淡出',
    secondsShort: '秒',
    ringtonePresetLabel: '30秒铃声预设',
    ringtonePresetApplied: '已应用 30 秒铃声预设。',
    trimSilenceLabel: '去除静音',
    trimSilenceApplied: '已自动裁剪开头和结尾静音。',
    trimSilenceNone: '未在开头或结尾检测到静音片段。',
    zoomInLabel: '放大波形',
    zoomOutLabel: '缩小波形',
    zoomResetLabel: '重置缩放',
    outputFormatLabel: '输出格式',
    bitrateLabel: 'MP3 音质',
    downloadButton: '下载裁剪后的音频',
    exportingStatus: '正在浏览器本地编码...',
    exportReadyStatus: '导出完成！裁剪后的音频已开始下载。',
    startHandleAria: '裁剪开始位置',
    endHandleAria: '裁剪结束位置',
    waveformHint: '点击波形任意位置试听 • 按 I / O 键标记起点 / 终点 • 空格键播放/暂停',
    errorDecodeFailed:
      '浏览器无法解码此文件。请尝试标准的 MP3、WAV、FLAC、AAC、OGG、M4A 或 MP4 文件。',
    errorInvalidSelection:
      '导出前请确保输出音频长度至少为 0.2 秒。',
    errorM4rUnsupported:
      '当前浏览器不支持原生 AAC M4R 编码，请改选 MP3 或 WAV 格式导出。',
    m4rRingtoneNote: 'iPhone 铃声时长建议不超过 40 秒。',
    videoExtractedNote: '已从视频中本地提取音轨。',
    fileSizeUnitKb: 'KB',
    fileSizeUnitMb: 'MB',
  },
};
