export const SITE_URL = 'https://mp3cutter.github.io';
export const SITE_NAME = 'MP3Cutter';
export const GITHUB_REPO_URL = 'https://github.com/mp3cutter/mp3cutter.github.io';
export const SUPPORT_URL = 'https://kisharadilshan.gumroad.com/coffee';
export const DEVELOPER_EMAIL = 'kisharadilshan007@gmail.com';
export const GTM_ID = 'GTM-WB4P8LV7';
export const GA4_ID = 'G-DJ7CXZNERH';

export type LocaleCode = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'ja' | 'zh' | 'ru';
export type PageKey = 'home' | 'how-to-use' | 'hire-me';

export interface LanguageOption {
  code: LocaleCode;
  label: string;
  shortLabel: string;
  pathPrefix: string;
  ogLocale: string;
  hreflang: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', label: 'English', shortLabel: 'EN', pathPrefix: '/', ogLocale: 'en_US', hreflang: 'en' },
  { code: 'es', label: 'Español', shortLabel: 'ES', pathPrefix: '/es/', ogLocale: 'es_ES', hreflang: 'es' },
  { code: 'pt', label: 'Português', shortLabel: 'PT', pathPrefix: '/pt/', ogLocale: 'pt_BR', hreflang: 'pt' },
  { code: 'de', label: 'Deutsch', shortLabel: 'DE', pathPrefix: '/de/', ogLocale: 'de_DE', hreflang: 'de' },
  { code: 'fr', label: 'Français', shortLabel: 'FR', pathPrefix: '/fr/', ogLocale: 'fr_FR', hreflang: 'fr' },
  { code: 'ja', label: '日本語', shortLabel: 'JA', pathPrefix: '/ja/', ogLocale: 'ja_JP', hreflang: 'ja' },
  { code: 'zh', label: '简体中文', shortLabel: 'ZH', pathPrefix: '/zh/', ogLocale: 'zh_CN', hreflang: 'zh' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU', pathPrefix: '/ru/', ogLocale: 'ru_RU', hreflang: 'ru' },
] as const;

export const NON_DEFAULT_LOCALES: readonly Exclude<LocaleCode, 'en'>[] = [
  'es',
  'pt',
  'de',
  'fr',
  'ja',
  'zh',
  'ru',
] as const;

export const PAGE_KEYS: readonly PageKey[] = ['home', 'how-to-use', 'hire-me'] as const;

export function getLanguageOption(code: LocaleCode): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

export function getLocalizedPath(lang: LocaleCode, page: PageKey): string {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  if (page === 'home') {
    return `${prefix}/`;
  }
  return `${prefix}/${page}/`;
}

export function getCanonicalUrl(lang: LocaleCode, page: PageKey): string {
  return `${SITE_URL}${getLocalizedPath(lang, page)}`;
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export function getHreflangLinks(page: PageKey): HreflangLink[] {
  const links: HreflangLink[] = SUPPORTED_LANGUAGES.map((lang) => ({
    hreflang: lang.hreflang,
    href: getCanonicalUrl(lang.code, page),
  }));
  links.push({
    hreflang: 'x-default',
    href: getCanonicalUrl('en', page),
  });
  return links;
}
