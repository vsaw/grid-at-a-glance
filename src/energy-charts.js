const { net } = require('electron');
const { logger } = require('./logger');

async function fetchChartData() {
    const response = await net.fetch('https://api.energy-charts.info/signal?country=de');
    if (response.ok) {
        const body = await response.json();
        return body;
    }
}

module.exports = { fetchChartData }