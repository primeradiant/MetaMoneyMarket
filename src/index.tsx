import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import {BrowserRouter} from 'react-router-dom';
import './assets/styles/fonts.css';
import './assets/styles/index.css';
import App from './components/app';

ReactModal.setAppElement('#root');

// @ts-ignore
const render = Component => {
  return ReactDOM.render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    document.getElementById('root'),
  );
};

render(App);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./components/app', () => {
    const NextApp = require('./components/app').default;
    render(NextApp);
  });
}
