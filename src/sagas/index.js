import { all } from 'redux-saga/effects'
import { coins } from './coins'
import { exchange } from './exchange'

export default function* rootSaga() {
  yield all([
    coins(),
    exchange(),
  ])
}