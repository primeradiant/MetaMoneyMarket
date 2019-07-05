import BN from 'bn.js';
import React, {useCallback, useEffect, useState} from 'react';
import * as contract from 'truffle-contract';
import {useWeb3Context} from 'web3-react';

import IERC20Artifact from '../artifacts/IERC20.json';
import MetaMoneyContractArtifact from '../artifacts/MetaMoneyMarket.json';

interface Contracts {
  metaMoneyMarket: MetaMoneyMarketContract;
  IERC20: any;
}

interface ContextValue {
  contracts: Contracts | null;
  metaMoneyMarketData: Markets;
  fetchMetaMoneyMarketData: (contracts: Contracts) => Promise<void>;
}

export interface Market {
  address: string;
  savingsBalance: string;
  symbol: string;
  walletBalance: string;
}

type Markets = Market[];

interface Props {
  children: React.ReactNode;
}

interface MetaMoneyMarketContract {
  address: string;
  deposit: (address: string, amount: string, options: any) => Promise<void>;
  getDepositedAmount: (tokenAddress: string, account: string) => Promise<BN>;
  withdraw: (address: string, amount: string, options: any) => Promise<void>;
  supportedMarketsCount: () => Promise<BN>;
  supportedMarketsList: (index: number) => Promise<string>;
  getMarketSymbol: (address: string) => Promise<string>;
  getTokenShare: (address: string) => Promise<string>;
}

const IERC20 = contract(IERC20Artifact);
const MetaMoneyMarket = contract(MetaMoneyContractArtifact);

const defaultValue: ContextValue = {} as ContextValue; // tslint:disable-line no-object-literal-type-assertion
export const ContractsContext = React.createContext(defaultValue);

export const ContractsProvider: React.FC<Props> = ({children}) => {
  const context = useWeb3Context();

  const [contracts, setContracts] = useState<ContextValue['contracts']>(null);
  const [metaMoneyMarketData, setMetaMoneyMarketData] = useState<Markets>([]);

  const fetchMetaMoneyMarketData = useCallback(async (contracts: Contracts) => {
    const { IERC20, metaMoneyMarket } = contracts;

    if (!context.active || !metaMoneyMarket || !context.account) {
      throw new Error('metaMoneyMarket is not instanced');
    }

    const count = (await metaMoneyMarket.supportedMarketsCount()).toNumber();
    const fetchedMarkets: Markets = [];

    for (let i = 0; i < count; i++) {
      const address = await metaMoneyMarket.supportedMarketsList(i);
      const symbol = await metaMoneyMarket.getMarketSymbol(address);

      const token = await IERC20.at(address);
      const balance = (await token.balanceOf(context.account)).toString();
      const deposited = (await metaMoneyMarket.getDepositedAmount(address, context.account)).toString();

      fetchedMarkets.push({
        address,
        savingsBalance: deposited,
        symbol,
        walletBalance: balance,
      });
    }

    setMetaMoneyMarketData(fetchedMarkets);
  }, [context]);

  useEffect(() => {
    const getContracts = async () => {
      if (context.active) {
        IERC20.setProvider(context.library.givenProvider);
        MetaMoneyMarket.setProvider(context.library.givenProvider);
        const metaMoneyMarket = await MetaMoneyMarket.deployed();

        const contracts = { IERC20, metaMoneyMarket };
        setContracts(contracts);
        fetchMetaMoneyMarketData(contracts);
      }
      if (context.error) {
        console.error('There was an error connecting to web3:', context.error.message);
      }
    };

    getContracts();
  }, [context, fetchMetaMoneyMarketData]);

  const contractsContext = {
    contracts,
    fetchMetaMoneyMarketData,
    metaMoneyMarketData
  };


  return <ContractsContext.Provider value={contractsContext}>{children}</ContractsContext.Provider>;
};
