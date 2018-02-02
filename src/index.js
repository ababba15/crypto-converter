import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import store, { history } from 'store'
import { Main, NotFound } from './containers'
import 'styles/main.scss'


const Root = () => (
  <Provider store={ store }>
    <Router history={ history }>
      <Switch>
        <Route exact path='/' component={ Main }/>
        <Route path='*' component={ NotFound }/>
      </Switch>
    </Router>
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
