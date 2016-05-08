import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from '../styles/Dashboard'

import Speed from './Speed'
import InfoActions from './InfoActions'
import Acceleration from './Acceleration'

class Dashboard extends Component {
    render() {
        var { speed, acceleration, loading } = this.props;

        return (
            <div styleName="container">
                <Speed speed={speed} loading = {loading}/>
                <InfoActions loading={loading}/>
                <Acceleration acceleration={acceleration} />
            </div>
        )
    }
}

export default CSSModules(Dashboard, styles)
