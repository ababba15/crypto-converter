import React, { Component, Fragment } from 'react'
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux'
import * as R from 'ramda'
import swap from '../../assets/swap.svg'

// Currency codes were taken from https://coinmarketcap.com/api/ documentation
import currencies from './currencies.json'

const duration = 150;

const defaultStyle = {
  transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
  transform: 'scale(1.1)',
  opacity: 0,
}

const transitionStyles = {
  entering: { transform: 'scale(1.1)', opacity: 0 },
  entered:  { transform: 'scale(1)', opacity: 1 },
};

const Fade = (props) => (
  <Transition in={props.inProp} timeout={duration}>
    {(state) => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {props.children}
      </div>
    )}
  </Transition>
);


class Main extends Component {
  state = {
    coin: '',
    currency: '',
    amount: 100,
    swapped: false
  }

  componentDidMount() {
    this._getCoins()
    setTimeout(() => {
      this._handleAnimation('remove', true);
      this.setState({
        coin: this.props.coins[0],
        currency: currencies[0]
      }, () => this._getExchangeRate())
    }, 600)
  }

  _handleAnimation(method, initial) {
    Array.from(document.getElementsByClassName('card')).forEach(it => it.classList[method]('collapsed'))
    initial &&
    this.setState({
      coin: this.props.coins[0],
      currency: currencies[0]
    }, () => this._getExchangeRate())
  }

  _getCoins() {
    this.props.dispatch({
      type: 'COINS_REQUEST'
    })
  }

  _handleCurrencyChange = (item) => {
    console.log(item);
    const currency = currencies.filter(it => it.code === item.code)[0]
    this.setState({ currency }, () => this._getExchangeRate())
  }

  _handleCoinChange = (input) => {
    const coin = this.props.coins.filter(it => it.id === input.id)[0]
    console.log(coin);
    this.setState({ coin }, () => this._getExchangeRate())
  }

  _getExchangeRate() {
    this.props.dispatch({
      type: 'EXCHANGE_REQUEST',
      payload: {
        coin: this.state.coin,
        currency: this.state.currency,
      }
    })
  }

  _handleAmountChange = (amount, target) => {
    this.setState({ amount })
  }

  _handleSwap = () => {
    this._handleAnimation('add');
    this.props.dispatch({
      type:    'LOADING',
      payload: true,
      meta: 'exchange',
    })
    setTimeout(() => {
      this.setState(prev => ({ swapped: !prev.swapped }))
      this._handleAnimation('remove');
      this.props.dispatch({
        type:    'LOADING',
        payload: false,
        meta: 'exchange',
      })
    }, 600)
  }

  render = () => {
    const currentRate = this.state.amount ? (this.props.exchange.price * this.state.amount).toFixed(6) + '' : 0;
    const currentRateSwapped = this.state.amount ? (this.state.amount / this.props.exchange.price).toFixed(6) + '' : 0;
    let rate = currentRate && currentRate.replace(/0+$/g, '');
    if (rate[rate.length - 1] === '.') rate = rate.replace(/\.+$/g, '');
    
    const swappedRate = currentRateSwapped && currentRateSwapped.replace(/(0+$|\.$)/g, '');
    return (
      <div className='wrapper'>
        <div className='popular_container'>
          {R.take(6, this.props.coins).map(it => (
            <div className='popular'>
              <p>{it.name}</p>
              <p>${it.price_usd}</p>
            </div>
          ))}
        </div>
        <div className='card_container'>
          <div className='card card_left collapsed'>
            {this.state.swapped ?
              <Currencies data={currencies} onClick={(it) => this._handleCurrencyChange(it)} />
              :
              <Coins data={this.props.coins}  onClick={(it) => this._handleCoinChange(it)} />
            }
          </div>
          <div className='card card_center' id=''>
          
            <div className='top-block'>
              <h1>Crypto Converter</h1>
            </div>
            {this.props.loading.coins ?
              <h1>Loading...</h1>
              :
              <div className='bottom-block'>
                {this.state.swapped ?
                  <div className='bottom-block_left'>
                    <h4>{this.state.currency.name}</h4>
                    <input
                      value={this.state.amount}
                      className='amount-input'
                      type='number'
                      onChange={e => this._handleAmountChange(e.target.value, 'coin')}/> 
                  </div>
                  :
                  <div className='bottom-block_left'>
                    <h4>{this.state.coin.name}</h4>
                    <input
                      value={this.state.amount}
                      className='amount-input'
                      type='number'
                      onChange={e => this._handleAmountChange(e.target.value, 'currency')}/> 
                  </div>
                }
                <div className='swap-button' onClick={this._handleSwap}>
                  <img src={swap} alt=''/>
                </div>
                {this.state.swapped ?
                  <div className='bottom-block_right'>
                    <h4>{this.state.coin.name}</h4>
                    <Fade inProp={!this.props.loading.exchange}>
                      {/* {this.props.loading.exchange ?
                        <h2>Loading...</h2>
                        :
                        <h2>{swappedRate}</h2>
                      } */}
                      <h2>{swappedRate}</h2>
                    </Fade>
                  </div> 
                  :
                  <div className='bottom-block_right'>
                    <h4>{this.state.currency.name}</h4>
                    <Fade inProp={!this.props.loading.exchange}>
                      {/* {this.props.loading.exchange ?
                        <h2>Loading...</h2>
                        :
                        <h2>{rate}</h2>
                      } */}
                      <h2>{rate}</h2>
                    </Fade>
                  </div> 
                }
              </div>
            }
          </div>
          <div className='card card_right collapsed'>
            {this.state.swapped ?
              <Coins data={this.props.coins} onClick={it => this._handleCoinChange(it)} />
              :
              <Currencies data={currencies} onClick={it => this._handleCurrencyChange(it)} />
            }
          </div>
        </div>
      </div>
    )
  }
}

const Currencies = props => {
  return (
    props.data.map((it, ind) => {
      const odd = ind % 2 ? ' odd' : ''
      return (
        <div key={it.code} onClick={() => props.onClick(it)} className={`curr_item${odd}`}>
          <p>{it.name}</p>
        </div>
      )}
    )
  )
}
const Coins = props => (
  props.data.map((it, ind) => {
    const odd = ind % 2 ? ' odd' : ''
    return (
      <div key={it.id} onClick={() => props.onClick(it)} className={`curr_item${odd}`}>
        <p>{it.name}</p>
      </div>
    )}
  )
)

const select = ({ coins, exchange, loading }) => ({ coins, exchange, loading })
const Connected = connect(select)(Main)

export { Connected as Main }