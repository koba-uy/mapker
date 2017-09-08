import axios from 'axios'

class MapkerService {

    constructor() {
        this.apiUrl = 'http://localhost:5000/api'
    }

    parseBusTour(data) {
        return axios
            .post(this.apiUrl + '/parseBusTour', { busTourRawData: data } )
            .then(res => {
                return res
            })
    }

    parseDevicesTours(busTourRawData, devicesToursRawData) {
        return axios
            .post(this.apiUrl + '/parseDevicesTours', { busTourRawData: busTourRawData, devicesToursRawData: devicesToursRawData } )
    }

}

let singleton = new MapkerService()
export default singleton