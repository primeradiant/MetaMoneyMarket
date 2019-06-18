import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainWrapper from './layout/MainWrapper';
import Landing from './landing';
import Help from './help';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Switch>
          <Route exact={true} path={`/`} component={Landing} />
          <Route exact={true} path={`/help`} component={Help} />
        </Switch>
      </MainWrapper>
    </BrowserRouter>
  );
};

export default App;
