import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ESP32Provider } from './hooks/useESP32';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ESP32Provider>
      <App />
    </ESP32Provider>
  </React.StrictMode>
);
