import React, { Component } from 'react'

import polyline from '@mapbox/polyline'
import randomColor from 'randomcolor'
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps'

const busTourToPolylines = function (busTour) {
    return busTour
        .map(encodedPolyline => ({
            encoded: encodedPolyline,
            path: polyline.decode(encodedPolyline).map(decodedPolyline => ({
                lat: decodedPolyline[0], 
                lng: decodedPolyline[1]
            }))
        }))
}

const devicesToursToMarkers = function (devicesTours) {
    let markers = []
    
    devicesTours.forEach(deviceTour => {
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

    return markers
}

const MapComponent = withGoogleMap(props => {
    return (
        <GoogleMap
            defaultCenter={{ lat: -34.901112, lng: -56.164532 }}
            defaultZoom={14}>
                {
                    busTourToPolylines(props.busTour).map((polyline, i) => (
                        <Polyline
                            key={i}
                            path={polyline.path}
                            options={{
                                geodesic: true,
                                strokeColor: '#ff0000',
                                strokeWeight: 2
                            }}
                        />
                    ))
                }
                {
                    devicesToursToMarkers(props.devicesTours).map(marker => (
                        <Marker
                            {...marker}
                        />
                    ))
                }
        </GoogleMap>
    )
})

class MapkerMap extends Component {

    render() {
        return (
            <MapComponent
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                busTour={this.props.busTour}
                devicesTours={this.props.devicesTours}
            />
        )
    }

}
  
export default MapkerMap