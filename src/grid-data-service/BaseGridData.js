class BaseGridData {
    /**
     * Current share of renuwables as indicated by a traffic light.
     * 
     * Possible Values are
     * 
     * - "GREEN"
     * - "YELLOW"
     * - "RED"
     *
     * Any other value will be treted as an error state and show the disconnect icon
     * 
     * @type string
     */
    trafficLight;

    /**
     * The raw data for today as an array of measurements whereas
     * 
     * - timestamp: Unix Timestamp
     * - share: Share of renewable electricity in the grid in percentage as number between 0 and 1
     * - trafficLight: Traffic light at the time
     */
    rawDataToday = [{ 
        timestamp: null,
        share: null,
        trafficLight: null,
    }];
}

module.exports = { BaseGridData };