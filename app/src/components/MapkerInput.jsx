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
                style={{ height: '256px', width: '100%' }}
                onChange={ this.handleTextAreaChange.bind(this) }
                >
            </textarea>
        )
    }

    handleTextAreaChange(event) {
        this.props.onChange(event.target.value)
    }

}
  
export default MapkerInput