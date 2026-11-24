import {
  DEVELOPER_EMAIL,
  GITHUB_REPO_URL,
  SITE_NAME,
  SITE_URL,
  SUPPORT_URL,
  getCanonicalUrl,
  type LocaleCode,
  type PageKey,
} from '../i18n/config';
import type { TranslationDict } from '../i18n/types';

export function buildWebApplicationSchema(lang: LocaleCode, t: TranslationDict) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    alternateName: 'MP3Cutter — Online Audio & MP3 Cutter',
    url: getCanonicalUrl(lang, 'home'),
    inLanguage: lang,
    description: t.home.description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires HTML5, Web Audio API, and JavaScript',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      '100% client-side Web Audio API and browser encoding with zero file uploads',
      'Trim MP3, WAV, FLAC, AAC, OGG, M4A, and local video audio tracks',
      'Keep Selection (Trim) and Remove Selection (Cut) waveform editing',
      'Smooth Fade In and Fade Out (0s-5s) with live waveform envelope',
      'One-click 30-second ringtone preset and automatic silence trimming',
      'Export to MP3, lossless 16-bit WAV, or iPhone M4R ringtone offline',
    ],
    screenshot: `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: 'Kishara Dilshan',
      url: getCanonicalUrl(lang, 'hire-me'),
    },
  };
}

export function buildFaqSchema(t: TranslationDict) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.home.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  lang: LocaleCode,
  page: Exclude<PageKey, 'home'>,
  t: TranslationDict
) {
  const currentName =
    page === 'how-to-use' ? t.howToUse.breadcrumbCurrent : t.hireMe.breadcrumbCurrent;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.nav.home,
        item: getCanonicalUrl(lang, 'home'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentName,
        item: getCanonicalUrl(lang, page),
      },
    ],
  };
}

export function buildHowToSchema(lang: LocaleCode, t: TranslationDict) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t.howToUse.h1,
    description: t.howToUse.description,
    inLanguage: lang,
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: SITE_NAME,
      },
    ],
    step: t.howToUse.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      url: `${getCanonicalUrl(lang, 'how-to-use')}#step-${index + 1}`,
    })),
  };
}

export function buildPersonSchema(lang: LocaleCode, t: TranslationDict) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kishara Dilshan',
    jobTitle: 'Full-Stack Web, Astro & WebAssembly Developer',
    description: t.hireMe.description,
    url: getCanonicalUrl(lang, 'hire-me'),
    email: `mailto:${DEVELOPER_EMAIL}`,
    sameAs: [GITHUB_REPO_URL, SUPPORT_URL],
    knowsAbout: [
      'Astro',
      'React',
      'Next.js',
      'TypeScript',
      'WebAssembly',
      'Web Audio API',
      'Technical SEO',
      'UI/UX Design',
    ],
  };
}
