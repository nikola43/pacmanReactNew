import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Web3 from 'web3'
import { Web3ReactProvider } from "@web3-react/core";

// https://github.com/mobxjs/mobx-react-lite/tree/v2.0.5#observer-batching
import 'mobx-react-lite/batchingForReactDom';

import App from './App';
function getLibrary(provider: any) {
    return new Web3(provider)
}

ReactDOM.render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <App />
    </Web3ReactProvider>
    , document.getElementById('root'));
