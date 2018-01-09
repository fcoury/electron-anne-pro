import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';

import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(<App />, document.getElementById('root'));
  });
}
