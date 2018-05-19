import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/app';
// import './css/index.css';

// import { MemoryRouter } from 'react-router';
// import Watchlist from './views/Watchlist';
// import Login from './views/login';

// import './css/bootstrap.min.css'
// import './js/bootstrap.bundle.min'

// FIXME: find way to store user session with chrome.cookies or chrome.storage
// ReactDOM.render(
//  <MemoryRouter 
//     intialEntries={['/', '/watchlist']}
//     initialIndex={0}
// >
//     <App />
// </MemoryRouter>, document.getElementById('root'));
// ReactDOM.render(<Watchlist /> , document.getElementById('root'));
// ReactDOM.render(<Login /> , document.getElementById('root'));
ReactDOM.render(<App /> , document.getElementById('root'));