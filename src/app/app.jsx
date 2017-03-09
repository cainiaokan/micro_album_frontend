import './common/style/normalize.css'
import './common/style/common.css'

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
} from './routerConfig'
import Home from './home/home'

const store = configureStore()

render (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path={TO_HOME.path} component={Home} />
      <Route path={'/*'} component={Home} />
    </Router>
  </Provider>,
  document.getElementById('album-root-container')
)
