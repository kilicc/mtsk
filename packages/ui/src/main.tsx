import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SubeProvider } from './contexts/SubeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SubeProvider>
      <App />
    </SubeProvider>
  </React.StrictMode>
);

