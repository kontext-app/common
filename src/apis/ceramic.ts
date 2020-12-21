import CeramicClient from '@ceramicnetwork/http-client';

export function createCeramic(ceramicApiHost: string) {
  const ceramic = new CeramicClient(ceramicApiHost, {
    docSyncEnabled: false,
  });
  return ceramic;
}

export default {
  createCeramic,
};
