import type { APIRoute } from 'astro';
import {
  PAGE_KEYS,
  SUPPORTED_LANGUAGES,
  getCanonicalUrl,
  getHreflangLinks,
  type PageKey,
} from '../i18n/config';

const PRIORITY_MAP: Record<PageKey, string> = {
  home: '1.0',
  'how-to-use': '0.8',
  'hire-me': '0.7',
};

const CHANGEFREQ_MAP: Record<PageKey, string> = {
  home: 'weekly',
  'how-to-use': 'monthly',
  'hire-me': 'monthly',
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  const urlEntries: string[] = [];

  for (const page of PAGE_KEYS) {
    const alternates = getHreflangLinks(page);
    const alternateXml = alternates
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`
      )
      .join('\n');

    for (const lang of SUPPORTED_LANGUAGES) {
      const loc = getCanonicalUrl(lang.code, page);
      urlEntries.push(
        [
          '  <url>',
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${lastmod}</lastmod>`,
          `    <changefreq>${CHANGEFREQ_MAP[page]}</changefreq>`,
          `    <priority>${PRIORITY_MAP[page]}</priority>`,
          alternateXml,
          '  </url>',
        ].join('\n')
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urlEntries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
