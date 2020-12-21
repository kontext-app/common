import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import ThreeIdDidProvider from '3id-did-provider';
import { EthereumAuthProvider, ThreeIdConnect } from '3id-connect';
import { DID } from 'dids';

import type { CeramicApi } from '@ceramicnetwork/common';

export async function createThreeIdFromSeed({
  ceramic,
  seed,
}: {
  ceramic: CeramicApi;
  seed: Uint8Array;
}) {
  const threeIdProvider = await ThreeIdDidProvider.create({
    ceramic,
    getPermission: async () => [],
    seed,
  });

  const didProvider = threeIdProvider.getDidProvider();
  await ceramic.setDIDProvider(didProvider);
  return didProvider;
}

export async function createThreeIdFromEthereumProvider({
  threeIdConnectHost = 'https://app.3idconnect.org',
  ceramic,
  ethereumProvider,
  address,
}: {
  threeIdConnectHost?: string;
  ceramic: CeramicApi;
  ethereumProvider: any;
  address: string;
}) {
  const ethereumAuthProvider = new EthereumAuthProvider(
    ethereumProvider,
    address
  );
  const threeIdConnect = new ThreeIdConnect(threeIdConnectHost);
  await threeIdConnect.connect(ethereumAuthProvider);

  const didProvider = threeIdConnect.getDidProvider();
  // @ts-ignore
  await ceramic.setDIDProvider(didProvider);
  return didProvider;
}

export async function authenticate({
  ceramic,
  didProvider,
}: {
  ceramic: CeramicApi;
  didProvider: any;
}) {
  const did = new DID({
    provider: didProvider,
    resolver: ThreeIdResolver.getResolver(ceramic),
  });
  await did.authenticate();
}
