import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Phone layouts are drawn on Figma's 430px mobile frame; --mk scales them to the screen.
const setMobileScale = () => document.documentElement.style.setProperty('--mk', String(Math.min(window.innerWidth, 600) / 430));
setMobileScale();
window.addEventListener('resize', setMobileScale);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
