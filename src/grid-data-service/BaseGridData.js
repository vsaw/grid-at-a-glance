class BaseGridData {
    /**
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

}

module.exports = { BaseGridData };