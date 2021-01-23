import CeramicClient from '@ceramicnetwork/http-client';

import type { CeramicApi } from '@ceramicnetwork/common';

export function createCeramic(
  ceramicApiHost: string = 'https://ceramic.kontext.app'
): CeramicApi {
  const ceramic = new CeramicClient(ceramicApiHost, {
    docSyncEnabled: false,
  });
  return (ceramic as any) as CeramicApi;
}
