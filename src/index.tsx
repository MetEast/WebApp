import React from 'react';
import ReactDOM from 'react-dom';
import './styles/globals.css';
import App from './App';
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import {Web3Provider} from "@ethersproject/providers";
import reportWebVitals from './reportWebVitals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <MetaMaskProvider> */}
        <App />
      {/* </MetaMaskProvider> */}
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
