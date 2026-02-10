import { load } from 'cheerio';

/**
 * Tugaflix Provider 🇵🇹
 * Base: https://tugaflix.love/
 */

const TUGAFLIX_BASE = 'https://tugaflix.love';

export interface TugaflixResponse {
  success: boolean;
  embeds: {
    embedId: string;
    url: string;
  }[];
}

async function proxiedFetchText(url: string, options: any = {}): Promise<string> {
  const { getLoadbalancedProxyUrl } = await import('@/backend/providers/fetchers');
  const proxyUrl = getLoadbalancedProxyUrl();
  const fullUrl = `${proxyUrl}?destination=${encodeURIComponent(url)}`;

  const response = await fetch(fullUrl, {
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers,
  });

  if (!response.ok) return '';
  return await response.text();
}

export function parseSearch(html: string): { title: string; year?: number; url: string }[] {
  const results: { title: string; year?: number; url: string }[] = [];
  const $ = load(html);

  $('.items .poster').each((_, element) => {
    const $link = $(element).find('a');
    const url = $link.attr('href');
    const titleAttr = $link.attr('title') || '';
    const match = titleAttr.match(/^(.*?)\s*(?:\((\d{4})\))?\s*$/);

    if (match && url) {
      results.push({
        title: match[1].trim(),
        year: match[2] ? parseInt(match[2], 10) : undefined,
        url: url.startsWith('http') ? url : `${TUGAFLIX_BASE}${url}`,
      });
    }
  });

  return results;
}

export async function scrapeTugaflixMovie(title: string, year?: number): Promise<TugaflixResponse | null> {
  try {
    const searchUrl = `${TUGAFLIX_BASE}/filmes/?s=${encodeURIComponent(title)}`;
    const html = await proxiedFetchText(searchUrl);
    const searchResults = parseSearch(html);

    // Find best match
    const match = searchResults.find(
      (r) => r.title.toLowerCase() === title.toLowerCase() && (!year || r.year === year),
    );

    if (!match) return null;

    // Get video page (must POST with play: '')
    const videoPageHtml = await proxiedFetchText(match.url, {
      method: 'POST',
      body: new URLSearchParams({ play: '' }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const $ = load(videoPageHtml);
    const embeds: { embedId: string; url: string }[] = [];

    $('.play a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        if (href.includes('streamtape')) {
          embeds.push({ embedId: 'streamtape', url: href.startsWith('http') ? href : `https://${href}` });
        } else if (href.includes('dood')) {
          embeds.push({ embedId: 'dood', url: href.startsWith('http') ? href : `https://${href}` });
        }
      }
    });

    return { success: embeds.length > 0, embeds };
  } catch (e) {
    console.error('Tugaflix movie scrape error:', e);
    return null;
  }
}

export async function scrapeTugaflixTV(
  title: string,
  season: number,
  episode: number,
  year?: number,
): Promise<TugaflixResponse | null> {
  try {
    const searchUrl = `${TUGAFLIX_BASE}/series/?s=${encodeURIComponent(title)}`;
    const html = await proxiedFetchText(searchUrl);
    const searchResults = parseSearch(html);

    const match = searchResults.find((r) => r.title.toLowerCase() === title.toLowerCase());

    if (!match) return null;

    const sStr = season < 10 ? `0${season}` : season.toString();
    const eStr = episode < 10 ? `0${episode}` : episode.toString();
    const epKey = `S${sStr}E${eStr}`;

    const videoPageHtml = await proxiedFetchText(match.url, {
      method: 'POST',
      body: new URLSearchParams({ [epKey]: '' }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const $ = load(videoPageHtml);
    const embedIframeSrc = $('iframe[name="player"]').attr('src');
    if (!embedIframeSrc) return null;

    const embedUrl = embedIframeSrc.startsWith('http') ? embedIframeSrc : `https:${embedIframeSrc}`;

    // Sometimes need to POST to get final link
    const playerHtml = await proxiedFetchText(embedUrl, {
      method: 'POST',
      body: new URLSearchParams({ submit: '' }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const $player = load(playerHtml);
    const finalUrl = $player('a:contains("Download Episodio")').attr('href');

    if (finalUrl) {
      const embeds = [];
      if (finalUrl.includes('streamtape')) {
        embeds.push({ embedId: 'streamtape', url: finalUrl });
      } else if (finalUrl.includes('dood')) {
        embeds.push({ embedId: 'dood', url: finalUrl });
      }
      return { success: embeds.length > 0, embeds };
    }

    return null;
  } catch (e) {
    console.error('Tugaflix TV scrape error:', e);
    return null;
  }
}

export function convertTugaflixToStream(data: TugaflixResponse) {
  if (!data.success || data.embeds.length === 0) return null;

  // For now, Tugaflix provides embeds like Streamtape/Doodstream.
  // We'll return them as HLS/Video sources if the player can handle them,
  // or simple embeds if they need resolvers.
  // In NEXUS, we usually prefer direct file if possible.

  // Actually, Streamtape and Doodstream need their own resolvers usually.
  // But our internal player might handle them if we wrap them properly.

  // Let's return the first one as a 'file' type if it's a direct link,
  // but these are usually embed page URLs.

  const primaryEmbed = data.embeds[0];

  return {
    type: 'file' as const,
    id: 'tugaflix',
    flags: [],
    qualities: {
      auto: {
        type: 'mp4', // placeholder, will be resolved by the source selector if it's a known embed
        url: primaryEmbed.url,
      },
    },
    captions: [],
  };
}
