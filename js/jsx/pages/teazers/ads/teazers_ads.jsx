import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import App from './components/app';
import MenuFavoritesCounter from './components/menuFavoritesCounter';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers, window.devToolsExtension ? window.devToolsExtension() : undefined);

ReactDOM.render(
  <Provider store={store}>
    <MenuFavoritesCounter />
  </Provider>
  , document.querySelector('.fav-count-teaser'));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.querySelector('#teasers'));

