// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { AzureAD } from 'react-aad-msal';
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import App from './App';
import { authProvider } from './authProvider';

ReactDOM.render(
  <BrowserRouter forceRefresh={true}>
  <AzureAD provider={authProvider} forceLogin={true}>
    <App />
  </AzureAD>
  </BrowserRouter>,
  document.getElementById('root'),
);

