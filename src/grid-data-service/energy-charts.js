const { net } = require('electron');

const { BaseService } = require('./BaseService');
const { logger } = require('../logger');
const { BaseGridData } = require('./BaseGridData');

class EnergyChartsService extends BaseService {

    constructor(timeoutMillis) {
        super();

        let timeoutMillisSafe = 1000 * 60 * 60;
        if(timeoutMillis) {
            timeoutMillisSafe = timeoutMillis;            
        }
        
        function updateSync(self) {
            self.update();
        }
        setInterval(updateSync, timeoutMillisSafe, this);
        setImmediate(updateSync, this);
    }

    async update() {
        const response = await net.fetch('https://api.energy-charts.info/signal?country=de');
        if (response.ok) {
            const body = await response.json();
            this.#emitGridData(body);
            return body;
        }
    }

    #emitGridData(responseData) {
        const now = Date.now() / 1000;
        let i;
        for (i = 0; i < responseData.unix_seconds.length; i++) {
            if (responseData.unix_seconds[i] > now) {
                break;
            }
        }

        let trafficLight = null;
        switch (responseData.signal[i]) {
            case -1:
            case 0:
                trafficLight = 'RED';
                break;
            case 1:
                trafficLight = 'YELLOW';
                break;
            case 2:
                trafficLight = 'GREEN';
                break;
            default:
                break;
        }

        const data = new BaseGridData();
        data.trafficLight = trafficLight;
        data.rawDataToday = responseData.unix_seconds.map((timestamp, index) => {
            return {
                timestamp,
                share: responseData.share[index],
                trafficLight: responseData.signal[index],
            }
        });
        this.emit('gridData', data);
    }
}

module.exports = { EnergyChartsService }