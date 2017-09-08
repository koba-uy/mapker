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
                props.busPathLines.map(path => (
                    <Polyline
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
        MapkerService
            .parseBusTour(value)
            .then(res => {
                this.props.onChange(res.data.busTour)
            })
            .catch(err => {
                console.log(err)
            })
            /*
        this.setState({
            busPathLines: value.map(i => 
                polyline.decode(i).map(coord => {
                    return {
                        lat: coord[0],
                        lng: coord[1]
                    }
                })
            )
        })*/
    }

    handlePeopleMapkerInputChange(value) {
        return;
        let markers = []
        
        value.map(i => {
            let aux = i.split(' ')
            
            if (aux[1] && aux[1] != aux[2]) {
                let fst = aux[1].split(',')
                let snd = aux[2].split(',')
                let color = randomColor().replace('#', '')

                markers.push({
                    key: aux[0] + '-a',
                    icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|' + color,
                    position: {
                        lat: parseFloat(fst[0]),
                        lng: parseFloat(fst[1])
                    },
                    onClick: () => { console.log(aux[0], new Date(parseInt(aux[3]) * 1000), new Date(parseInt(aux[4]) * 1000)) }
                })

                markers.push({
                    key: aux[0] + '-b',
                    icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=B|' + color,
                    position: {
                        lat: parseFloat(snd[0]),
                        lng: parseFloat(snd[1])
                    },
                    onClick: () => { console.log(aux[0], new Date(parseInt(aux[3]) * 1000), new Date(parseInt(aux[4]) * 1000)) }
                })
            }
        })
        
        this.setState({ 
            peopleMarkers: markers
        })
    }

}
  
export default Mapker