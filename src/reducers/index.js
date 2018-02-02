import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { loading } from './loading'

import { coins } from './coins'
import { exchange } from './exchange'

export default combineReducers({
  loading,
  routing: routerReducer,

  coins,
  exchange,
})