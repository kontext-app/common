import CeramicClient from '@ceramicnetwork/http-client';

import type { CeramicApi } from '@ceramicnetwork/common';
import type { CeramicClientConfig } from '@ceramicnetwork/http-client';

export function createCeramic(
  ceramicApiHost: string = 'https://ceramic.kontext.app',
  ceramicConfig: CeramicClientConfig = {}
): CeramicApi {
  const ceramic = new CeramicClient(ceramicApiHost, {
    docSyncEnabled: false,
    ...ceramicConfig,
  });
  return (ceramic as any) as CeramicApi;
}
