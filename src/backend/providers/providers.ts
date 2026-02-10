import { isExtensionActiveCached } from '@/backend/extension/messaging';
import { makeExtensionFetcher, makeLoadBalancedSimpleProxyFetcher, setupM3U8Proxy } from '@/backend/providers/fetchers';

// Initialize M3U8 proxy on module load
setupM3U8Proxy();

// Stub for @p-stream/providers
const targets = {
  BROWSER: 'BROWSER',
  BROWSER_EXTENSION: 'BROWSER_EXTENSION',
};

function makeStandardFetcher(f: any) {
  return f;
}

function makeProviders(config: any) {
  const sources = [
    { id: 'zeticuz', name: 'Zeticuz', rank: 200, type: 'source' },
    { id: 'vidsrc', name: 'VidSrc', rank: 150, type: 'source' },
    { id: 'tugaflix', name: 'Tugaflix', rank: 140, type: 'source' },
    { id: 'febbox', name: 'Febbox', rank: 100, type: 'source' },
  ];

  return {
    listSources: () => sources,
    getMetadata: (id: string) => sources.find((s) => s.id === id),
    runSourceScraper: async () => ({ embeds: [] }),
    runEmbedScraper: async () => ({ stream: [] }),
  } as any;
}

export function getProviders() {
  if (isExtensionActiveCached()) {
    return makeProviders({
      fetcher: makeStandardFetcher(fetch),
      proxiedFetcher: makeExtensionFetcher(),
      target: targets.BROWSER_EXTENSION,
      consistentIpForRequests: true,
    });
  }

  setupM3U8Proxy();

  return makeProviders({
    fetcher: makeStandardFetcher(fetch),
    proxiedFetcher: makeLoadBalancedSimpleProxyFetcher(),
    target: targets.BROWSER,
  });
}

export function getAllProviders() {
  return makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.BROWSER_EXTENSION,
    consistentIpForRequests: true,
  });
}
