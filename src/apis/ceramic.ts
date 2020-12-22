import CeramicClient from '@ceramicnetwork/http-client';

export function createCeramic(
  ceramicApiHost: string = 'https://ceramic-dev.3boxlabs.com'
) {
  const ceramic = new CeramicClient(ceramicApiHost, {
    docSyncEnabled: false,
  });
  return ceramic;
}
