import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import * as Web3 from 'web3';
import Web3Provider from 'web3-react';

import {ContractsProvider} from '../context/contracts';
import {Infura, MetaMask} from '../web3/connectors';

import Help from './help';
import Landing from './landing';
import {MainWrapper} from './layout/MainWrapper';
import MyAccount from './my-account';
import Terms from './terms';

const App: React.FC = () => {
  return (
    <Web3Provider connectors={{MetaMask, Infura}} libraryName={'web3.js'} web3Api={Web3}>
      <ContractsProvider>
        <BrowserRouter>
          <MainWrapper>
            <Switch>
              <Route exact={true} path={`/`} component={Landing} />
              <Route exact={true} path={`/my-account`} component={MyAccount} />
              <Route exact={true} path={`/help`} component={Help} />
              <Route exact={true} path={`/terms`} component={Terms} />
            </Switch>
          </MainWrapper>
        </BrowserRouter>
      </ContractsProvider>
    </Web3Provider>
  );
};

export default App;
