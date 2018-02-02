const coins = (state = [], action) => {
  switch (action.type) {
  case 'COINS_SUCCESS':
    return action.payload
  default:
    return state
  }
}
  
export { coins }