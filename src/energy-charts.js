const { net } = require('electron');

async function fetchChartData() {
    const response = await net.fetch('https://api.energy-charts.info/signal?country=de');
    if (response.ok) {
        const body = await response.json();
        return body;
    }
}

async function updateTray() {
    if (process.parentPort) {
        try {
            const ret = await fetchChartData();
            process.parentPort.postMessage(ret);
        } catch {
            // Do noting
        }
    }
}

// Child process
if (process.parentPort) {
    setImmediate(updateTray)
    setInterval(updateTray, 1000 * 60 * 60);
}

module.exports = { fetchChartData }