import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/app';
import './css/style.scss';
import Loader from './shared/loader';

// import { MemoryRouter } from 'react-router';


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

// ReactDOM.render(<Loader />, document.getElementById('root'));