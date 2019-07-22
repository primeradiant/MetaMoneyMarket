import {Connectors} from 'web3-react';

export const MetaMask = new Connectors.InjectedConnector({supportedNetworks: [1, 4, 42, 50]});

export const Infura = new Connectors.NetworkOnlyConnector({
  providerURL: process.env.REACT_APP_RPC_URL || '',
});
