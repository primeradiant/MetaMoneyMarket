import React from 'react';
import {Route, Switch} from 'react-router-dom';
import * as Web3 from 'web3';
import Web3Provider from 'web3-react';
import {ContractsProvider} from '../context/contracts';
import {Infura, MetaMask, WalletConnect} from '../web3/connectors';
import Help from './help';
import Landing from './landing';
import MyAccount from './my-account';
import Terms from './terms';

const App: React.FC = () => {
  return (
    <Web3Provider connectors={{MetaMask, Infura, WalletConnect}} libraryName={'web3.js'} web3Api={Web3}>
      <ContractsProvider>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path="/my-account">
            <MyAccount />
          </Route>
          <Route exact path="/help">
            <Help />
          </Route>
          <Route exact path="/terms">
            <Terms />
          </Route>
        </Switch>
      </ContractsProvider>
    </Web3Provider>
  );
};

export default App;
