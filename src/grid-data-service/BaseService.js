const EventEmitter = require('node:events');

/**
 * Base class to be implemented by all Grid Data Services
 * 
 * @emits 'gridData' Current status of the grid. Will be sent either by calling update or if the
 *        service thinks its time to update the grid data. Data is of type BaseGridData.
 */
class BaseService extends EventEmitter {
    
    showPreviewWindow() {
    }

    hidePreviewWindow() {
    }

    /**
     * Force update a Grid-Data-Service
     * 
     * @returns Promise that resolves into the raw chart data.
     */
    async update() {
        return Promise.reject("Not implemented");
    }
}

module.exports = { BaseService };