/**
 * @fileOverview Reusable collection classes
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class A queue (FIFO) collection implementation
 * @constructor

 */
function Queue() {

	/** 
	 * Array place holder for queue items
	 * @field 
	 * @type Object []
	 * @default []

	 */
	var queue = [];
	
	/**
	 * Gets the size of the queue
	 * @function
	 * @returns {int} The size of the queue

	 */
	this.getSize = function() {
		return queue.length;
	};
	
	/**
	 * Determines if the queue is empty
	 * @function
	 * @returns {boolean} True if the queue is empty

	 */
	this.isEmpty = function() {
		return (queue.length == 0);
	};
	
	/**
	 * Enqueues the specified element in this queue
	 * @function
	 * @param {Object} element The element to push into the queue
	 * @returns {int} The new length of the queue

	 */
	this.enqueue = function(element) {
		return queue.push(element);
	};
	
	/**
	 * Dequeues the oldest element in the queue
	 * @function
	 * @returns {Object} The oldest element in the queue, null if queue is empty

	 */
	this.dequeue = function() {
		return queue.shift();
	};
	
	/**
	 * Gets all elements in this queue
	 * @function
	 * @returns {Object []} All elements in the queue

	 */
	this.getElements = function() {
		return queue;
	};
}

/**
 * @class A ringbuffer(FIFO) collection implementation.  The ringbuffer
 * will automatically push out old items when maximum size is reached.
 * @constructor
 * @param {int} size The size of the buffer
 * @throws Error if size is not a valid integer

 */
function RingBuffer(size) {
	
	/*
	 * Size must be passed in
	 */
	if (typeof(size) == "undefined") {
		throw new Error("Valid integer size expected");
	} // if

	/** 
	 * Array place holder for queue items
	 * @field 
	 * @type Queue
	 * @default new Queue()

	 */
	var queue = new Queue();
	
	/**
	 * Gets the size of the queue
	 * @function
	 * @returns {int} The size of the queue

	 */
	this.getSize = function() {
		return queue.getSize();
	};
	
	/**
	 * Determines if the queue is empty
	 * @function
	 * @returns {boolean} True if the queue is empty

	 */
	this.isEmpty = function() {
		return queue.isEmpty();
	};
	
	/**
	 * Enqueues the specified element in this queue
	 * @function
	 * @param {Object} element The element to push into the queue
	 * @returns {int} The new length of the queue

	 */
	this.enqueue = function(element) {
		if (this.getSize() >= size) {
			queue.dequeue();
		} // if
		
		return queue.enqueue(element);
	};
	
	/**
	 * Dequeues the oldest element in the queue
	 * @function
	 * @returns {Object} The oldest element in the queue, null if queue is empty

	 */
	this.dequeue = function() {
		return queue.dequeue();
	};
	
	/**
	 * Gets all elements in this buffer
	 * @function
	 * @returns {Object []} All elements in the buffer

	 */
	this.getElements = function() {
		return queue.getElements();
	};
}