import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { AppContextProvider } from './context';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppContextProvider>
      <HelmetProvider>
        <PayPalScriptProvider
          options={{ 'client-id': 'sb' }}
          deferLoading={true}
        >
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </AppContextProvider>
  </React.StrictMode>
);

