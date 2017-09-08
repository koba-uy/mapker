import React, { Component } from 'react'

import { Col, Grid, Row } from 'react-bootstrap'

import MapkerInput from './MapkerInput.jsx'
import MapkerMap from './MapkerMap.jsx'

import MapkerService from '../services/MapkerService.js'

class Mapker extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // inputs
            busTourMapkerInputValue: '',
            // tours
            busTour: [],
            devicesTours: []
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12}>
                        <h1>Mapker</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={3}>
                        <MapkerInput
                            onChange={ this.handleBusTourMapkerInputChange.bind(this) }
                        />
                        <MapkerInput
                            onChange={ this.handleDevicesToursMapkerInputChange.bind(this) }
                        />
                    </Col>
                    <Col xs={12} md={9} style={{ height: `512px` }}>
                        <MapkerMap 
                            busTour={this.state.busTour}
                            devicesTours={this.state.devicesTours}
                        />
                    </Col>
                </Row>
            </Grid>
        )
    }

    handleBusTourMapkerInputChange(value) {
        this.setState({ busTourMapkerInputValue: value })

        MapkerService
            .parseBusTour(value)
            .then(res => {
                this.setState({ busTour: res.data.split('\n') })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleDevicesToursMapkerInputChange(value) {
        MapkerService
            .parseDevicesTours(this.state.busTourMapkerInputValue, value)
            .then(res => {
                this.setState({ devicesTours: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

}
  
export default Mapker