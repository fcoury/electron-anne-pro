import React from 'react';
import { Router, Route, hashHistory } from 'react-router';

import Main from './pages/Main';

export default class App extends React.Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={Main} />
      </Router>
    );
  }
}
