import { call, put, takeLatest } from 'redux-saga/effects'
import Axios from 'axios'

function* _exchange(action) {
  yield put({
    type:    'LOADING',
    payload: true,
    meta: 'exchange',
  })

  console.log(transformCurrName(action.payload.coin.name));
  try {

    const response = yield call(Axios.get, `https://api.coinmarketcap.com/v1/ticker/${transformCurrName(action.payload.coin.name)}/?convert=${action.payload.currency.code}&limit=1`)
  
    if (response.status === 200) {
      const { data } = yield response;
      console.log(data[0][`price_${action.payload.currency.code.toLowerCase()}`]);
      yield put({
        type:    'EXCHANGE_SUCCESS',
        payload: { ...data, price: data[0][`price_${action.payload.currency.code.toLowerCase()}`] }
      })
    } 
  } catch(err) {
    put({ type: 'EXCHANGE_FAILURE' })
  }

  
  yield put({
    type:    'LOADING',
    payload: false,
    meta: 'exchange',
  })
  yield put({
    type:    'LOADING',
    payload: false,
    meta: 'coins'
  })
}

const transformCurrName = (name) => name.replace(' ', '-').toLowerCase()

export const exchange = () => takeLatest('EXCHANGE_REQUEST', _exchange)