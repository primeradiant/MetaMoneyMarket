import BN from 'bn.js';
import React, {useCallback, useEffect, useState} from 'react';
import * as contract from 'truffle-contract';
import {useWeb3Context} from 'web3-react';

import IERC20Artifact from '../artifacts/ERC20Detailed.json';
import MetaMoneyContractArtifact from '../artifacts/MetaMoneyMarket.json';
import {getPrice} from '../services/nomics';
import TokenAmount from '../util/token-amount';

interface Contracts {
  metaMoneyMarket: MetaMoneyMarketContract;
  IERC20: any;
}

interface ContextValue {
  contracts: Contracts | null;
  marketsData: Markets;
  fetchMetaMoneyMarketData: (contracts: Contracts, account?: string) => Promise<void>;
}

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
  getBestInterestRate: (address: string) => Promise<BN>;
  getExchangeRate: (address: string) => Promise<[BN, BN]>;
  getMarketSymbol: (address: string) => Promise<string>;
  getTokenShare: (address: string) => Promise<string>;
}

const IERC20 = contract(IERC20Artifact);
const MetaMoneyMarket = contract(MetaMoneyContractArtifact);

const defaultValue: ContextValue = {} as ContextValue; // tslint:disable-line no-object-literal-type-assertion
export const ContractsContext = React.createContext(defaultValue);

const blocksPerYear = new BN('2102666');
const e14 = new BN('100000000000000');

export const ContractsProvider: React.FC<Props> = ({children}) => {
  const context = useWeb3Context();

  const [contracts, setContracts] = useState<ContextValue['contracts']>(null);
  const [marketsData, setMarketsData] = useState<Markets>([]);

  const fetchMetaMoneyMarketData = useCallback(
    async (contracts: Contracts, account?: string) => {
      const {IERC20, metaMoneyMarket} = contracts;

      if (!context.active || !metaMoneyMarket) {
        throw new Error('metaMoneyMarket is not instanced');
      }

      const count = (await metaMoneyMarket.supportedMarketsCount()).toNumber();
      const fetchedMarkets: Markets = [];

      for (let i = 0; i < count; i++) {
        const address = await metaMoneyMarket.supportedMarketsList(i);
        let symbol = 'UNKNOWN';
        try {
          symbol = await metaMoneyMarket.getMarketSymbol(address);
        } catch (e) {
          console.error(`Could not get symbol for token at address ${address}`);
        }

        const token = await IERC20.at(address);
        const balance = account ? (await token.balanceOf(account)) : undefined;
        const deposited = account ? (await metaMoneyMarket.getDepositedAmount(address, account)) : undefined;
        const interestRatePerBlock = await metaMoneyMarket.getBestInterestRate(address);
        const interestRate =
          interestRatePerBlock
            .mul(blocksPerYear)
            .div(e14)
            .toNumber() / 100;

        let price = 0;
        try {
          price = await getPrice(symbol);
        } catch (e) {
          console.error(`Could not get price for token at address ${address}`);
        }

        let decimals = 18;
        try {
          decimals = (await token.decimals()).toNumber();
        } catch (e) {
          console.error(`Could not get decimals for token at address ${address}`);
        }

        fetchedMarkets.push({
          address,
          interestRate,
          price,
          savingsBalance: deposited ? new TokenAmount(deposited, decimals) : deposited,
          symbol,
          walletBalance: balance ? new TokenAmount(balance, decimals) : balance,
        });
      }

      setMarketsData(fetchedMarkets);
    },
    [context],
  );

  useEffect(() => {
    const getContracts = async () => {
      if (context.active) {
        IERC20.setProvider(context.library.givenProvider);
        MetaMoneyMarket.setProvider(context.library.givenProvider);
        const metaMoneyMarket = await MetaMoneyMarket.deployed();

        const contracts = {IERC20, metaMoneyMarket};
        setContracts(contracts);

        fetchMetaMoneyMarketData(contracts);
      }
      if (context.error) {
        console.error('There was an error connecting to web3:', context.error.message);
      }
    };

    getContracts();
  }, [context, fetchMetaMoneyMarketData]);

  useEffect(() => {
    if (context.active && context.account && contracts) {
      fetchMetaMoneyMarketData(contracts, context.account);
    }
  }, [context, contracts, fetchMetaMoneyMarketData]);

  useEffect(() => {
    if (!context.active) {
      context.setFirstValidConnector(['Infura']);
    }
  }, [context]);

  const contractsContext = {
    contracts,
    fetchMetaMoneyMarketData,
    marketsData,
  };

  return <ContractsContext.Provider value={contractsContext}>{children}</ContractsContext.Provider>;
};
