import {Connectors} from 'web3-react';

export const MetaMask = new Connectors.InjectedConnector({supportedNetworks: [1, 4, 50]});

export const Infura = new Connectors.NetworkOnlyConnector({
  providerURL: process.env.RPC_URL || 'https://rinkeby.infura.io/v3/79ba5dc630e6406a8caadd28704a0ae2'
});
