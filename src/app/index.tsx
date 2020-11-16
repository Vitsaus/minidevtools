import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter
} from 'react-router-dom';
import { App } from './components/App';

declare var APP_MODE: string;

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
  document.getElementById('app')
);