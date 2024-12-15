class BaseGridData {
    /** The most recent data for the current electricity grid */
    gridDataNow = {
        /** Date */
        timestamp: null,
        /** Share of renewable electricity in the grid in percentage as number between 0 and 1 */
        share: null,
        /**
         * Traffic light at the time. Possible Values are
         * 
         *   - "GREEN"
         *   - "YELLOW"
         *   - "RED"
         *
         * Any other value will be treted as an error state and show the disconnect icon
         */
        trafficLight: null,
    }

    /** The data for today as an array of `gridDataNow` measurements */
    gridDataToday = [{
        timestamp: null,
        share: null,
        trafficLight: null,
    }];
}

module.exports = { BaseGridData };