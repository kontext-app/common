import CeramicClient from '@ceramicnetwork/http-client';

import type { CeramicClientConfig } from '@ceramicnetwork/http-client';

export function createCeramic(
  ceramicApiHost: string = 'https://ceramic.kontext.app',
  ceramicConfig: CeramicClientConfig = {}
): CeramicClient {
  const ceramic = new CeramicClient(ceramicApiHost, {
    docSyncEnabled: false,
    ...ceramicConfig,
  });
  return ceramic;
}
