/**
 * @fileOverview Event handling routines
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */
 
/**
 * @class An observable object that can raise events to interrested listeners
 * @constructor
 * @abstract
 * @since 0.0.0
 */
function Observable() {

	/**
	 * All registered event listeners
	 * @private
	 * @field 
	 * @type EventListener []
	 * @default new Object
	 * @since 0.0.0
	 */
	this.listeners = new Object();
	
	/**
	 * Add an event listener of the specified type
	 * @function
	 * @param {string} type The type of event to listen for
	 * @param {function} listener The listener to invoke
	 * @return {int} The total number of event listeners of the specified type
	 * @since 0.0.0
	 */
	this.addEventListener = function(type, listener) {
		if (typeof this.listeners[type] == "undefined") {
			this.listeners[type] = [];
		} // if
		return this.listeners[type].push(listener);
	}
	
	/**
	 * Dispatch an event of specified type to all interrested listeners
	 * @function
	 * @param {string} type The type of event to listen for
	 * @param {Object} e The optional event object
	 * @return {void}
	 * @since 0.0.0
	 */
	this.dispatchEvent = function(type, e) {
		for (i in this.listeners[type]) {
			var listener = this.listeners[type][i];
			listener.call(this, e);
		} // for
	}
	
	/**
	 * Removes the specified event listener
	 * @function
	 * @param {string} type The type of event to listen for
	 * @param {function} listener The listener to remove
	 * @return {function []} The removed event listeners, undefined if not found
	 * @since 0.0.0
	 */
	this.removeEventListener = function(type, listener) {
		if (this.listeners[type] instanceof Array){
            var listeners = this.listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    return listeners.splice(i, 1);
                    break;
                } // if
            } // for
        } // if
		return undefined;
	}
}