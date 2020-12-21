import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export async function createWeb3Modal({
  network = 'mainnet',
  infuraId,
}: {
  network: string;
  infuraId: string;
}) {
  const web3Modal = new Web3Modal({
    network,
    cacheProvider: true,
    disableInjectedProvider: false,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId,
        },
      },
    },
  });

  return web3Modal;
}

export async function connectWithWeb3Modal(web3Modal: Web3Modal) {
  const provider = await web3Modal.connect();
  const addresses = await provider.enable();

  return {
    provider,
    addresses,
  };
}
