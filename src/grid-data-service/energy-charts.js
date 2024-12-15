const { net } = require('electron');

const { BaseService } = require('./BaseService');
const { logger } = require('../logger');
const { BaseGridData } = require('./BaseGridData');

class EnergyChartsService extends BaseService {

    constructor(timeoutMillis) {
        super();

        let timeoutMillisSafe = 1000 * 60 * 60;
        if (timeoutMillis) {
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

    #trafficLightNumberToName(trafficLight) {
        switch (trafficLight) {
            case -1:
            case 0:
                return 'RED';
            case 1:
                return 'YELLOW';
            case 2:
                return 'GREEN';
            default:
                return null;
        }
    }

    #toBaseGridData(timestamp, share, signal) {
        const d = new Date(timestamp * 1000);
        return {
            timestamp: d,
            share: share / 100,
            trafficLight: this.#trafficLightNumberToName(signal),
        }
    }

    #emitGridData(responseData) {
        const now = Date.now() / 1000;
        let i;
        for (i = 0; i < responseData.unix_seconds.length; i++) {
            if (responseData.unix_seconds[i] > now) {
                if(i > 0) {
                    i--;
                }
                break;
            }
        }

        const data = new BaseGridData();
        data.gridDataNow = this.#toBaseGridData(responseData.unix_seconds[i],
            responseData.share[i],
            responseData.signal[i]
        );
        data.gridDataToday = responseData.unix_seconds.map((timestamp, index) => {
            return this.#toBaseGridData(timestamp,
                responseData.share[index],
                responseData.signal[index]);
        });
        this.emit('gridData', data);
    }
}

module.exports = { EnergyChartsService }