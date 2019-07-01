import {Connectors} from 'web3-react';
const {InjectedConnector} = Connectors;

export const MetaMask = new InjectedConnector({supportedNetworks: [1, 4, 50]});
