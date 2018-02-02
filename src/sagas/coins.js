import { call, put, takeLatest } from 'redux-saga/effects'
import Axios from 'axios'

function* _coins(action) {
  yield put({
    type:    'LOADING',
    payload: true,
    meta: 'coins'
  })

  const response = yield call(Axios.get, 'https://api.coinmarketcap.com/v1/ticker/?convert=GBP')

  if (response.status === 200) {
    const { data } = response
    yield put({
      type:    'COINS_SUCCESS',
      payload: data
    })
  } else {
    put({ type: 'COINS_FAILURE' })
  }
}

export const coins = () => takeLatest('COINS_REQUEST', _coins)