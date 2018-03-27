import React, { PureComponent } from 'react';
import { MemoryRouter as Router, Route } from 'react-router'
import Login from './views/Login'
import Watchlist from './views/Watchlist';
import Switch from 'react-router/Switch';

export default class App extends PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/watchlist" component={Watchlist} />
        <Route exact path="/" component={Login} />
      </Switch>
    );
  }
}
