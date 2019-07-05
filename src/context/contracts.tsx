import BN from 'bn.js';
import React, {useEffect, useReducer} from 'react';
import * as contract from 'truffle-contract';
import {useWeb3Context} from 'web3-react';

import IERC20Artifact from '../artifacts/IERC20.json';
import MetaMoneyContractArtifact from '../artifacts/MetaMoneyMarket.json';

interface State {
  metaMoneyMarket?: MetaMoneyMarketContract;
  IERC20?: any;
}

interface Props {
  children: React.ReactNode;
}

interface MetaMoneyMarketContract {
  address: string;
  deposit: (address: string, amount: string, options: any) => Promise<void>;
  withdraw: (address: string, amount: string, options: any) => Promise<void>;
  supportedMarketsCount: () => Promise<BN>;
  supportedMarketsList: (index: number) => Promise<string>;
  getMarketSymbol: (address: string) => Promise<string>;
  getTokenShare: (address: string) => Promise<string>;
}

const IERC20 = contract(IERC20Artifact);
const MetaMoneyMarket = contract(MetaMoneyContractArtifact);

export const ContractsContext = React.createContext<State>({});

function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'SET_CONTRACTS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error('Unrecognized action ' + action.type);
  }
}

export const ContractsProvider: React.FC<Props> = ({children}) => {
  const context = useWeb3Context();

  const [state, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    const getContracts = async () => {
      if (context.active) {
        IERC20.setProvider(context.library.givenProvider);
        MetaMoneyMarket.setProvider(context.library.givenProvider);
        const metaMoneyMarket = await MetaMoneyMarket.deployed();

        dispatch({type: 'SET_CONTRACTS', payload: { IERC20, metaMoneyMarket }});
      }
      if (context.error) {
        console.error('There was an error connecting to web3:', context.error.message);
      }
    };

    getContracts();
  }, [context]);

  return <ContractsContext.Provider value={state}>{children}</ContractsContext.Provider>;
};
