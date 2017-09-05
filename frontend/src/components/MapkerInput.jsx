import React, { Component } from 'react'

class MapkerInput extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        return (
            <textarea 
                style={{height: '256px', width: '100%'}}
                onChange={ this.handleTextAreaChange.bind(this) }
                >
            </textarea>
        )
    }

    handleTextAreaChange(event) {
        let locations = []
        
        event.target.value.split('\n').forEach(line => {
            /*
            let aux = line.trim().split(' ')
            let lat = parseFloat(aux[1])
            let lng = parseFloat(aux[2])
            
            if (!isNaN(lat) && !isNaN(lng)) {
                locations.push({
                    time: aux[0],
                    lat: lat,
                    lng: lng
                })
            }
            */
            locations.push(line)
        })

        this.props.onChange(locations)
    }

}
  
export default MapkerInput