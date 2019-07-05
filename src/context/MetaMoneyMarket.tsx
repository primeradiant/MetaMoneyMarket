import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import * as contract from 'truffle-contract';
import { useWeb3Context } from 'web3-react';

import MetaMoneyContractArtifact from '../artifacts/MetaMoneyMarket.json';

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

const MetaMoneyMarket = contract(MetaMoneyContractArtifact);

export const MMMContext = React.createContext<null | MetaMoneyMarketContract>(null);

export const MMMProvider: React.FC<Props> = ({children}) => {
  const context = useWeb3Context();

  const [metaMoneyMarket, setMetaMoneyMarket] = useState<null | MetaMoneyMarketContract>(null);

  useEffect(() => {
    const getMMMInstance = async () => {
      if (context.active) {
        MetaMoneyMarket.setProvider(context.library.givenProvider);
        const mmm = await MetaMoneyMarket.deployed();

        setMetaMoneyMarket(mmm);
      }
      if (context.error) {
        console.error('There was an error connecting to web3:', context.error.message);
      }
    };

    getMMMInstance();
  }, [context]);

  return (
    <MMMContext.Provider value={metaMoneyMarket}>
      {children}
    </MMMContext.Provider>
  );
};
