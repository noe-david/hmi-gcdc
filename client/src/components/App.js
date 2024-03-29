import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/App'

import Top from './Top'
import Bottom from './Bottom'

const socket = require('socket.io-client')('http://localhost:3000');

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ego: 0,
      egoFlags: 0,
      speed: 0,
      acceleration: 0,
      speed: 0
    }
  }

  componentDidMount() {
    socket.on('vehicleData', (data) => {
      console.log(data);
      this.setState({
        ego: data.ego,
        egoFlags: data.ego.flags,
        speed: data.ego.speed * 3.6,
        acceleration: data.ego.acceleration,
        vehicles: data.vehicles
      })
    })
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="top">
          <Top ego={this.state.ego} vehicles={this.state.vehicles} />
        </div>
        <div styleName="bottom">
          <Bottom speed={this.state.speed} acceleration={this.state.acceleration} flags={this.state.egoFlags} />
        </div>
      </div>
    )
  }
}

export default CSSModules(App, styles)
