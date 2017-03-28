import './res/style/normalize.css'
import './res/style/common.css'

import React from 'react'
import { render } from 'react-dom'
import { polyfill } from 'es6-promise'
//polyfill Promise API
polyfill()

import { Provider } from 'react-redux'
import configureStore from './store'
import { Router, Route, browserHistory } from 'react-router'
import {
  TO_HOME,
  TO_ALBUMS,
} from './routerConfig'
import HomePage from './routes/home/home'
import AlbumListPage from './routes/albumlist/albumList'


const store = configureStore()

function lazyLoadComponent(lazyModule) {  
  return (location, cb) => {
    lazyModule(module => cb(null, module.default))
  }
}

render (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={TO_HOME.path} getComponent={lazyLoadComponent(HomePage)} />
      <Route path={TO_ALBUMS.path} getComponent={lazyLoadComponent(AlbumListPage)} />
      <Route path={'/*'} getComponent={lazyLoadComponent(HomePage)} />
    </Router>
  </Provider>,
  document.getElementById('album-root-container')
)

