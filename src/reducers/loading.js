const loading = (state = {}, action) => {
  switch (action.type) {
  case 'LOADING':
    return { [action.meta]: action.payload }
  default:
    return state
  }
}

export { loading }