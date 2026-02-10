// Type stubs
export type ScrapeMedia = any;
export type RunOutput = any;
export type Stream = any;
export type Qualities = any;
export type ProviderControls = any;
export type FullScraperEvents = any;
export type MetaOutput = any;
export type Fetcher = any;
export class NotFoundError extends Error {}

// Value stubs
export const targets = {
  BROWSER: 'BROWSER',
  BROWSER_EXTENSION: 'BROWSER_EXTENSION',
  NATIVE: 'NATIVE',
};

export const labelToLanguageCode = (label: string) => 'en';

export function makeStandardFetcher(f: any) {
  return f;
}

export function makeSimpleProxyFetcher() {
  return () => Promise.resolve();
}

export function setM3U8ProxyUrl(url: string) {
  console.warn('setM3U8ProxyUrl called but mocked');
}

export function makeProviders(config: any) {
  const sources = [
    { id: 'zeticuz', name: 'Zeticuz', rank: 200, type: 'source' },
    { id: 'vidsrc', name: 'VidSrc', rank: 150, type: 'source' },
    { id: 'tugaflix', name: 'Tugaflix', rank: 140, type: 'source' },
    { id: 'febbox', name: 'Febbox', rank: 100, type: 'source' },
  ];

  return {
    listSources: () => sources,
    getMetadata: (id: string) => sources.find((s) => s.id === id),
    scrapeAll: () => Promise.resolve(null),
    runSourceScraper: async () => ({ embeds: [] }),
    runEmbedScraper: async () => ({ stream: [] }),
  } as any;
}
