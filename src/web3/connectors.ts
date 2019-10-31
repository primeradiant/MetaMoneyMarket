import {Connectors} from 'web3-react';
import WalletConnectSubprovider from '@walletconnect/web3-subprovider';

const INFURA_API_KEY =
  process.env.NODE_ENV === 'production' ? process.env.REACT_APP_INFURA_API_KEY : 'dd1817d5225849d18bce57c75d4c23d1';

const supportedNetworkURLs = {
  1: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
  42: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
};

const defaultNetwork = 1;

export const MetaMask = new Connectors.InjectedConnector({supportedNetworks: [1, 4, 42, 5]});

export const Infura = new Connectors.NetworkOnlyConnector({
  providerURL: supportedNetworkURLs[1],
});

export const WalletConnect = new Connectors.WalletConnectConnector({
  api: WalletConnectSubprovider,
  bridge: 'https://bridge.walletconnect.org',
  supportedNetworkURLs,
  defaultNetwork,
});
