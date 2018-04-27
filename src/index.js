import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import registerServiceWorker from './registerServiceWorker';
import { MemoryRouter } from 'react-router';
import Watchlist from './views/Watchlist';
// import { config as dotenvConfig } from 'dotenv';

// const result = dotenvConfig();
// if (result.error){
//     throw result.error
// }
// console.log(result.parsed)

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
ReactDOM.render(<Watchlist /> , document.getElementById('root'));
registerServiceWorker();