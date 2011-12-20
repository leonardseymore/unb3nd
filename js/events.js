/**
 * @fileOverview Event handling routines
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

"use strict";

/**
 * @class An observable object that can raise events to interrested listeners
 * @constructor
 * @abstract
 * @since 0.0.0
 */
unb3nd.Observable = function() {

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
	};
	
	/**
	 * Dispatch an event of specified type to all interrested listeners
	 * @function
	 * @param {string} type The type of event to listen for
	 * @param {Object} e The optional event object
	 * @return {void}
	 * @since 0.0.0
	 */
	this.dispatchEvent = function(type, e) {
    var i = this.listeners.length;
		while (i--) {
			var listener = this.listeners[type][i];
			listener.call(this, e);
		} // for
	};
	
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
                } // if
            } // for
        } // if
		return undefined;
	};
};

/**
 * Bind a property on one Observable property to a property on another object
 * @param {string} eventType The event to bind on
 * @param {Object} target The object to set the property on
 * @param {string} targetProperty The property to use on the target object
 * @param {Object} source The object hosting the property
 * @param {string} sourceProperty The property on the source to use
 * @param {boolean} twoWay True for bi-directional binding
 * @param {Function} conversionFunction Used to convert from source format to target format
 * @return {void}
 * @since 0.0.0.3
 */
unb3nd.bind = function(eventType, target, targetProperty, source, sourceProperty, twoWay, conversionFunction) {
  var value = source[sourceProperty];
  if (conversionFunction != undefined) {
    value = conversionFunction(value);
  } // if
  target[targetProperty] = value;

  source.addEventListener(eventType, function(e) {
    if (engine.debug && engine.verbose) {
      console.debug("%s event type, %o event, setting target %o.%s to source %o.%s", eventType, e, target, targetProperty, source, sourceProperty);
    } // if

    var value = source[sourceProperty];
    if (conversionFunction != undefined) {
      value = conversionFunction(value);
    } // if
    target[targetProperty] = value;
  });

  if (twoWay) {
    unb3nd.bind(eventType, source, sourceProperty, target, targetProperty, false);
  } // if
};