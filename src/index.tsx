import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import App from './components/app';
import * as serviceWorker from './serviceWorker';

import 'sanitize.css';
import './assets/styles/index.css';

ReactModal.setAppElement('#root');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
