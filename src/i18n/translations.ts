import type { LocaleCode } from './config';
import type { TranslationDict } from './types';
import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { ja } from './locales/ja';
import { zh } from './locales/zh';
import { ru } from './locales/ru';

export type { TranslationDict, CutterUiTranslations, FaqItem, HowToStep, SpecialtyItem } from './types';

export const translations: Record<LocaleCode, TranslationDict> = {
  en,
  es,
  pt,
  de,
  fr,
  ja,
  zh,
  ru,
};

export function getTranslations(lang: LocaleCode): TranslationDict {
  return translations[lang] ?? translations.en;
}
