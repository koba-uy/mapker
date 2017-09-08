import React, { Component } from 'react'

import polyline from '@mapbox/polyline'
import randomColor from 'randomcolor'
import { Col, Grid, Row } from 'react-bootstrap'
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps'

import MapkerInput from './MapkerInput.jsx'

import MapkerService from '../services/MapkerService.js'

const Map = withGoogleMap(props => (
    <GoogleMap
        defaultCenter={{lat: -34.901112, lng: -56.164532}}
        defaultZoom={14}>
            {
                props.busPathLines.map((path, i) => (
                    <Polyline
                        key={i}
                        path={path}
                        options={{
                            geodesic: true,
                            strokeColor: '#ff0000',
                            strokeWeight: 2
                        }}
                    />
                ))
            }
            {
                props.peopleMarkers.map(marker => (
                    <Marker
                        {...marker}
                    />
                ))
            }
    </GoogleMap>
))

class Mapker extends Component {

    constructor(props) {
        super(props)

        this.state = {
            busMapkerInputValue: '',
            busPathLines: [],
            peopleMarkers: []
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
                            onChange={ this.handleBusMapkerInputChange.bind(this) }
                        />
                        <MapkerInput
                            onChange={ this.handlePeopleMapkerInputChange.bind(this) }
                        />
                    </Col>
                    <Col xs={12} md={9} style={{height: `512px`}}>
                        <Map
                            containerElement={<div style={{ height: `100%` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            busPathLines={this.state.busPathLines}
                            peopleMarkers={this.state.peopleMarkers}
                        />
                    </Col>
                </Row>
            </Grid>
        )
    }

    handleBusMapkerInputChange(value) {
        this.setState({ busMapkerInputValue: value })

        MapkerService
            .parseBusTour(value)
            .then(res => {
                this.setState({
                    busPathLines: res.data.split('\n').map(i => 
                        polyline.decode(i).map(coord => {
                            return {
                                lat: coord[0],
                                lng: coord[1]
                            }
                        })
                    )
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handlePeopleMapkerInputChange(value) {
        MapkerService
            .parseDevicesTours(this.state.busMapkerInputValue, value)
            .then(res => {
                let markers = []
                
                res.data.forEach(deviceTour => {
                    let color = randomColor().replace('#', '')

                    markers.push({
                        key: deviceTour.macAddr + '-a',
                        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|' + color,
                        position: {
                            lat: parseFloat(deviceTour.fst.lat),
                            lng: parseFloat(deviceTour.fst.lng)
                        },
                    })

                    markers.push({
                        key: deviceTour.macAddr + '-b',
                        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=B|' + color,
                        position: {
                            lat: parseFloat(deviceTour.lst.lat),
                            lng: parseFloat(deviceTour.lst.lat)
                        },
                    })
                })

                this.setState({ peopleMarkers: markers })
            })
            .catch(err => {
                console.log(err)
            })
    }

}
  
export default Mapker