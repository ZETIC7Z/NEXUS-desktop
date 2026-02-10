/**
 * VidSrc Provider (VidSrcVip) 🚀
 * Base: https://api2.vidsrc.vip
 */

const VIDSRC_BASE = 'https://api2.vidsrc.vip';

export interface VidSrcResponse {
  success: boolean;
  embeds: {
    embedId: string;
    url: string;
  }[];
}

function digitToLetterMap(digit: string): string {
  const map = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  return map[parseInt(digit, 10)];
}

function encodeTmdbId(tmdbId: string, type: 'movie' | 'show', season?: number, episode?: number): string {
  let raw: string;
  if (type === 'show' && season && episode) {
    raw = `${tmdbId}-${season}-${episode}`;
  } else {
    raw = tmdbId.split('').map(digitToLetterMap).join('');
  }
  const reversed = raw.split('').reverse().join('');
  // Simple btoa for browser-safe environments, using Buffer for Node if needed
  const b64 = (str: string) => btoa(str);
  return b64(b64(reversed));
}

async function proxiedFetchJson(url: string, options: any = {}): Promise<any> {
  const { getLoadbalancedProxyUrl } = await import('@/backend/providers/fetchers');
  const proxyUrl = getLoadbalancedProxyUrl();
  const fullUrl = `${proxyUrl}?destination=${encodeURIComponent(url)}`;

  const response = await fetch(fullUrl, {
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers,
  });

  if (!response.ok) return null;
  return await response.json();
}

export async function scrapeVidSrcMovie(tmdbId: string): Promise<VidSrcResponse | null> {
  try {
    const encodedId = encodeTmdbId(tmdbId, 'movie');
    const url = `${VIDSRC_BASE}/movie/${encodedId}`;
    const data = await proxiedFetchJson(url);

    if (!data || !data.source1) return null;

    const embeds: { embedId: string; url: string }[] = [];
    const embedIds = ['vidsrc-comet', 'vidsrc-pulsar', 'vidsrc-nova'];

    for (let i = 1; data[`source${i}`]; i++) {
      const source = data[`source${i}`];
      if (source?.url) {
        embeds.push({
          embedId: embedIds[(i - 1) % embedIds.length],
          url: source.url,
        });
      }
    }

    return { success: embeds.length > 0, embeds };
  } catch (e) {
    console.error('VidSrc movie scrape error:', e);
    return null;
  }
}

export async function scrapeVidSrcTV(tmdbId: string, season: number, episode: number): Promise<VidSrcResponse | null> {
  try {
    const encodedId = encodeTmdbId(tmdbId, 'show', season, episode);
    const url = `${VIDSRC_BASE}/tv/${encodedId}`;
    const data = await proxiedFetchJson(url);

    if (!data || !data.source1) return null;

    const embeds: { embedId: string; url: string }[] = [];
    const embedIds = ['vidsrc-comet', 'vidsrc-pulsar', 'vidsrc-nova'];

    for (let i = 1; data[`source${i}`]; i++) {
      const source = data[`source${i}`];
      if (source?.url) {
        embeds.push({
          embedId: embedIds[(i - 1) % embedIds.length],
          url: source.url,
        });
      }
    }

    return { success: embeds.length > 0, embeds };
  } catch (e) {
    console.error('VidSrc TV scrape error:', e);
    return null;
  }
}

export function convertVidSrcToStream(data: VidSrcResponse) {
  if (!data.success || data.embeds.length === 0) return null;

  const primaryEmbed = data.embeds[0];

  // VidSrcVip headers for HLS
  const headers = {
    Referer: 'https://vidsrc.vip/',
    Origin: 'https://vidsrc.vip',
  };

  return {
    type: 'file' as const,
    id: 'vidsrc',
    flags: [],
    qualities: {
      auto: {
        type: 'hls',
        url: primaryEmbed.url,
      },
    },
    headers,
    captions: [],
  };
}
