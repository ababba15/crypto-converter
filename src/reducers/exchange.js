const exchange = (state = [], action) => {
  switch (action.type) {
  case 'EXCHANGE_SUCCESS':
    return action.payload
  default:
    return state
  }
}
  
export { exchange }