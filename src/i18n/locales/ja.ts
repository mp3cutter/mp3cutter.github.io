import type { TranslationDict } from '../types';

export const ja: TranslationDict = {
  langName: '日本語',
  nav: {
    home: 'ホーム',
    howToUse: '使い方',
    hireMe: '制作依頼',
    languageSelectorLabel: '言語を選択',
    themeToggleLabel: 'ライト・ダークモードを切り替え',
    switchToDark: 'ダークモードに切り替え',
    switchToLight: 'ライトモードに切り替え',
    addToHomeScreen: 'ホーム画面に追加',
    supportDeveloper: '開発者を応援',
    githubAriaLabel: 'View source code on GitHub',
    skipToContent: 'メインコンテンツへ移動',
    mainNavLabel: 'メインナビゲーション',
    breadcrumbLabel: 'パンくずリスト',
  },
  pwa: {
    modalTitle: 'MP3Cutterをオフライン用にインストール',
    modalDescription:
      'ホーム画面に追加すると、インターネット接続なしでもいつでも曲のトリミングや着信音の作成ができます。',
    installNow: '今すぐアプリをインストール',
    alreadyInstalled: 'MP3Cutterはすでにこの端末にインストールされています。',
    iosTitle: 'iPhone・iPad（Safari）の場合：',
    iosStep1: 'Safari画面下部の共有ボタンをタップします。',
    iosStep2: '下にスクロールして「ホーム画面に追加」をタップします。',
    iosStep3: '右上の「追加」をタップするとオフラインでもすぐに起動できます。',
    desktopHint:
      'ブラウザのアドレスバーのインストールアイコンやメニュー（「アプリをインストール」）からも追加できます。',
    close: '閉じる',
  },
  footer: {
    tagline: 'サーバー送信ゼロで安全に使えるブラウザ完結型MP3カッター＆着信音メーカー。',
    privacyNote: '音声ファイルが端末の外へ送信されることは一切ありません。',
    builtBy: '開発：Kishara Dilshan',
    copyright: '© 2026 MP3Cutter. MITライセンスのオープンソース。',
  },
  home: {
    title: 'MP3カット無料オンライン｜音楽トリミング・着信音作成 - MP3Cutter',
    description:
      'MP3・WAV・FLAC・AAC音声をブラウザ上で直接カット＆トリミング。フェードイン・フェードアウト対応、サーバー送信なしの完全無料オーディオ編集ツール。',
    ogImageAlt: 'MP3Cutter ブラウザ音声トリミング＆着信音作成ツールの画面',
    h1: 'MP3カッター — 音楽の切り取り・着信音作成をブラウザで完結',
    heroSubtitle:
      'MP3・WAV・FLAC・OGG・AAC音声をブラウザ内で直接カット＆トリミング。滑らかなフェードイン・フェードアウト対応。完全無料・アップロード不要・登録不要。',
    faqHeading: 'よくある質問',
    faqSubheading: 'ブラウザ上で安全に音声をトリミングするためのポイントをご紹介します。',
    faqs: [
      {
        question: 'MP3の曲を切り取ったり、30秒のオリジナル着信音を作るには？',
        answer:
          '上のエリアに音声ファイルをドロップするか「音声ファイルを選択」をクリックします。波形上の開始・終了ハンドルを動かすか「30秒着信音」ボタンを押してサビを選び、プレビュー再生で確認後、Android用のMP3またはiPhone用のM4R形式でダウンロードしてください。',
      },
      {
        question: '編集時に音声ファイルがサーバーへアップロードされますか？',
        answer:
          'いいえ、一切アップロードされません。MP3CutterはWeb Audio APIとブラウザ内エンコーダーを使用し、デコードから書き出しまで100%お使いの端末内で処理します。ホーム画面に追加すればオフラインでも利用できます。',
      },
      {
        question: 'どの音声・動画形式に対応していますか（MP3、WAV、FLAC、AAC、OGG、M4A）？',
        answer:
          'MP3、WAV、FLAC、AAC、OGG、M4Aの音声ファイルに加え、MP4・WebM・MOVなどの動画ファイルから音声トラックを直接取り出してカットできます。書き出しはMP3、無劣化16bit WAV、iPhone用M4R形式に対応しています。',
      },
      {
        question: '音質を落とさずにフェードイン・フェードアウトを付けられますか？',
        answer:
          'はい。フェードインとフェードアウトをそれぞれ0〜5秒の間で設定でき、波形上で音量カーブを確認できます。すべて32bit浮動小数点精度で処理され、高音質320kbps MP3または完全無劣化WAVで保存できます。',
      },
    ],
  },
  howToUse: {
    title: 'MP3の切り取り・着信音作成ガイド｜無料オーディオカット - MP3Cutter',
    description:
      'MP3・WAV・FLAC・AAC曲のトリミング方法、フェード効果の適用、30秒着信音（MP3/M4R）をブラウザ内で安全に書き出す手順を解説します。',
    ogImageAlt: 'MP3Cutterでの音声トリミング・着信音作成ステップガイド',
    breadcrumbCurrent: '使い方',
    h1: 'MP3の曲を切り取り、プライベートに着信音を作る手順',
    intro:
      'MP3Cutterはすべてブラウザ内で動作するため、曲のトリミング、途中部分のカット、スマホ着信音の作成がアップロードや会員登録なしで数秒で完了します。',
    stepsHeading: '4つのシンプルなステップで音声をカット',
    steps: [
      {
        title: '1. 音声または動画ファイルをローカルで読み込む',
        description:
          'トップページの枠にMP3・WAV・FLAC・AAC・OGG・M4Aファイルをドロップします。MP4・MOV・WebM動画を入れると、音声トラックだけをブラウザメモリ上に自動抽出します。',
        tip: 'まずは試してみたい場合、「サンプル音声を試す」を押すとオフラインでデモ曲が即座に生成されます。',
      },
      {
        title: '2. インタラクティブ波形でカット位置を指定',
        description:
          '波形の開始・終了ハンドルをドラッグするか、mm:ss.ms形式で正確な時間を入力します。ズームで細かい波形を確認でき、「無音をカット」で先頭と末尾の静音を自動調整できます。',
        tip: 'ハンドルにフォーカスした状態で左右矢印キーを押すと0.1秒単位で微調整できます（Shift併用で1秒単位）。',
      },
      {
        title: '3. 選択範囲の保持／削除を選び、フェードを設定',
        description:
          '選んだ区間だけ残す「選択範囲を保持（トリム）」か、途中を切り抜いて前後をつなぐ「選択範囲を削除（カット）」を選択します。必要に応じて0〜5秒のフェードイン・フェードアウトを有効にしてください。',
        tip: 'プレビュー再生を押すと、書き出し前にフェードや継ぎ目の仕上がりをそのまま試聴できます。',
      },
      {
        title: '4. MP3・無劣化WAV・iPhone用M4R着信音として保存',
        description:
          '普段使いやAndroid着信音にはMP3（128/192/320kbps）、無劣化保存にはWAV、iPhone着信音にはM4Rを選び、「編集した音声をダウンロード」をクリックします。',
      },
    ],
    workflowsHeading: 'よく使われる編集ワークフロー',
    workflows: [
      {
        title: '30秒のiPhone用M4R・Android用MP3着信音を作る',
        description:
          '曲を読み込んだあと「30秒着信音」をクリックし、好きなサビに30秒枠を合わせます。0.5秒のフェードインと1.5秒のフェードアウトを付けてM4RまたはMP3で書き出せば完成です。',
      },
      {
        title: 'ポッドキャストや録音から不要な途中部分をカットする',
        description:
          '言い間違いや長い間を範囲選択して「選択範囲を削除（カット）」に切り替え、プレビューで自然なつながりを確認してからダウンロードします。',
      },
      {
        title: 'ローカル動画から音声だけを抽出してトリミングする',
        description:
          'MP4・WebM・MOV動画をそのままドロップするだけ。音声トラックをローカルでデコードし、必要なフレーズやBGMだけをMP3やWAVで保存できます。',
      },
    ],
    ctaTitle: '今すぐ音声をカットしてみませんか？',
    ctaDescription: '完全無料・アップロードなし・オフライン対応のブラウザスタジオを開きましょう。',
    ctaButton: 'MP3Cutterスタジオを開く',
  },
  hireMe: {
    title: 'Kishara Dilshanへの制作依頼｜Astro・WASM開発 | MP3Cutter',
    description:
      '超高速なAstro・React・Next.jsアプリやブラウザ完結WebAssemblyツールの開発をご希望ですか？SEO対応のカスタムIT開発を承ります。',
    ogImageAlt: 'Kishara Dilshan へのAstro・React・Next.js・WebAssembly開発依頼',
    breadcrumbCurrent: '制作依頼',
    h1: 'フリーランス案件のご相談を受け付けています',
    heading: 'カスタムITソリューションが必要ですか？',
    intro: 'こんにちは。MP3Cutterの開発者、Kishara Dilshanです。',
    subcopy:
      'この高速なクライアントサイドツールを気に入っていただき、貴社ビジネス向けの高品質なITソリューションをお探しでしたら、ぜひご相談ください。主な専門分野：',
    specialties: [
      {
        title: '超高速・SEO最適化されたWebアプリケーション',
        description:
          'Astro、React、Next.jsを用い、1秒未満の高速表示・的確なテクニカルSEO・クリーンな拡張性を実現します。',
      },
      {
        title: 'クライアントサイド処理 & WebAssembly (WASM) ツール',
        description:
          'サーバー不要でブラウザ内にてプライベートに完結するメディア・PDF・データ処理ツールを開発します。',
      },
      {
        title: 'UI/UXデザイン & 高コンバージョンLP制作',
        description:
          'デスクトップでもモバイルでも自然に成果へつなげる、ミニマルでアクセシブルなUIを設計します。',
      },
    ],
    ctaHeading: '素晴らしいプロダクトを一緒につくりましょう。',
    emailLabel: '直接メールでお問い合わせ：kisharadilshan007@gmail.com',
    copyButtonLabel: 'メールをコピー',
    copiedLabel: 'コピーしました！',
    emailButtonLabel: 'メールを送る',
  },
  cutter: {
    dropzoneTitle: '音声または動画ファイルをここにドロップ',
    dropzoneSubtitle: 'MP3、WAV、FLAC、AAC、OGG、M4A、ローカル動画に対応',
    selectAudioFile: '音声ファイルを選択',
    trySampleAudio: 'サンプル音声を試す',
    openAnotherFile: '別のファイルを開く',
    privacyBadge: '100%ブラウザ内で処理 • サーバー送信ゼロ',
    supportedFormatsLabel: 'MP3 • WAV • FLAC • AAC • OGG • M4A • MP4/MOV',
    decodingStatus: 'ブラウザ内で音声をデコード中...',
    loadedStatus: 'トリミングの準備ができました。',
    sampleTrackName: 'mp3cutter-demo-track.wav',
    playPreview: '再生',
    previewCut: 'カット試聴',
    pausePreview: '一時停止',
    stopPreview: '停止',
    cursorLabel: '再生位置',
    setStartHere: '開始に設定',
    setEndHere: '終了に設定',
    setStartTooltip: '現在の再生位置を開始点に設定 (I)',
    setEndTooltip: '現在の再生位置を終了点に設定 (O)',
    startSetStatus: '開始位置を設定しました：',
    endSetStatus: '終了位置を設定しました：',
    skipBackLabel: '2秒戻る',
    skipForwardLabel: '2秒進む',
    loopLabel: 'ループ試聴',
    modeKeepLabel: '選択範囲を保持（トリム）',
    modeKeepShort: '選択範囲を保持',
    modeRemoveLabel: '選択範囲を削除（カット）',
    modeRemoveShort: '選択範囲を削除',
    modeGroupLabel: 'カットモード',
    startLabel: '開始',
    endLabel: '終了',
    outputDurationLabel: '出力時間',
    originalDurationLabel: '元の長さ',
    fadeInLabel: 'フェードイン',
    fadeOutLabel: 'フェードアウト',
    secondsShort: '秒',
    ringtonePresetLabel: '30秒着信音',
    ringtonePresetApplied: '30秒着信音プリセットを適用しました。',
    trimSilenceLabel: '無音をカット',
    trimSilenceApplied: '先頭と末尾の無音を自動カットしました。',
    trimSilenceNone: '先頭・末尾にカット可能な無音は見つかりませんでした。',
    zoomInLabel: '波形を拡大',
    zoomOutLabel: '波形を縮小',
    zoomResetLabel: 'ズームをリセット',
    outputFormatLabel: '出力形式',
    bitrateLabel: 'MP3音質',
    downloadButton: '編集した音声をダウンロード',
    exportingStatus: 'ブラウザ内でエンコード中...',
    exportReadyStatus: '書き出しが完了しました！ダウンロードを開始しています。',
    startHandleAria: 'カット開始位置',
    endHandleAria: 'カット終了位置',
    waveformHint: '波形をクリックして好きな位置を再生 • I / Oキーで開始・終了を設定 • Spaceで再生/一時停止',
    errorDecodeFailed:
      'このファイルをブラウザでデコードできませんでした。標準的なMP3・WAV・FLAC・AAC・OGG・M4A・MP4ファイルをお試しください。',
    errorInvalidSelection:
      '書き出す前に出力音声が0.2秒以上残るように選択してください。',
    errorM4rUnsupported:
      'お使いのブラウザはネイティブAAC M4Rエンコードに非対応です。MP3またはWAVで書き出してください。',
    m4rRingtoneNote: 'iPhoneの着信音は40秒以内にしてください。',
    videoExtractedNote: '動画から音声トラックをローカル抽出しました。',
    fileSizeUnitKb: 'KB',
    fileSizeUnitMb: 'MB',
  },
};
