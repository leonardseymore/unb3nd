/**
 * @fileOverview Reusable collection classes
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * @class A queue (FIFO) collection implementation
 * @constructor
 * @since 0.0.0
 */
function Queue() {

	/** 
	 * Array place holder for queue items
	 * @field 
	 * @type Object []
	 * @default []
	 * @since 0.0.0
	 */
	var queue = [];
	
	/**
	 * Gets the size of the queue
	 * @function
	 * @returns {int} The size of the queue
	 * @since 0.0.0
	 */
	this.getSize = function() {
		return queue.length;
	}
	
	/**
	 * Determines if the queue is empty
	 * @function
	 * @returns {boolean} True if the queue is empty
	 * @since 0.0.0
	 */
	this.isEmpty = function() {
		return (queue.length == 0);
	}
	
	/**
	 * Enqueues the specified element in this queue
	 * @function
	 * @param {Object} element The element to push into the queue
	 * @returns {int} The new length of the queue
	 * @since 0.0.0
	 */
	this.enqueue = function(element) {
		return queue.push(element);
	}
	
	/**
	 * Dequeues the oldest element in the queue
	 * @function
	 * @returns {Object} The oldest element in the queue, null if queue is empty
	 * @since 0.0.0
	 */
	this.dequeue = function() {
		return queue.shift();
	}
	
	/**
	 * Gets all elements in this queue
	 * @function
	 * @returns {Object []} All elements in the queue
	 * @since 0.0.0
	 */
	this.getElements = function() {
		return queue;
	}
}

/**
 * @class A ringbuffer(FIFO) collection implementation.  The ringbuffer
 * will automatically push out old items when maximum size is reached.
 * @constructor
 * @param {int} size The size of the buffer
 * @throws Error if size is not a valid integer
 * @since 0.0.0
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
	 * @since 0.0.0
	 */
	var queue = new Queue();
	
	/**
	 * Gets the size of the queue
	 * @function
	 * @returns {int} The size of the queue
	 * @since 0.0.0
	 */
	this.getSize = function() {
		return queue.getSize();
	}
	
	/**
	 * Determines if the queue is empty
	 * @function
	 * @returns {boolean} True if the queue is empty
	 * @since 0.0.0
	 */
	this.isEmpty = function() {
		return queue.isEmpty();
	}
	
	/**
	 * Enqueues the specified element in this queue
	 * @function
	 * @param {Object} element The element to push into the queue
	 * @returns {int} The new length of the queue
	 * @since 0.0.0
	 */
	this.enqueue = function(element) {
		if (this.getSize() >= size) {
			queue.dequeue();
		} // if
		
		return queue.enqueue(element);
	}
	
	/**
	 * Dequeues the oldest element in the queue
	 * @function
	 * @returns {Object} The oldest element in the queue, null if queue is empty
	 * @since 0.0.0
	 */
	this.dequeue = function() {
		return queue.dequeue();
	}
	
	/**
	 * Gets all elements in this buffer
	 * @function
	 * @returns {Object []} All elements in the buffer
	 * @since 0.0.0
	 */
	this.getElements = function() {
		return queue.getElements();
	}
}

/**
 * @class A set of unique elements
 * @constructor
 * @since 0.0.0
 */
function Set() {

	/**
	 * All elements in the set
	 * @field
	 * @type Object []
	 * @default []
	 * @since 0.0.0
	 */
	this.elements = [];
	
	/**
	 * Add a new element to the set
	 * @function
	 * @param {Object} element The element to add
	 * @returns {int} Number of elements
	 * @since 0.0.0
	 */
	this.add = function(element) {
		return this.elements.push(element);
	}
	
	/**
	 * Remove an element at the specified index
	 * @function
	 * @param {int} index The index of the element
	 * @returns {Object} The removed element
	 * @since 0.0.0
	 */
	this.removeEntityAtIndex = function(index) {
		return this.elements.splice(index, 1);
	}
	
	/**
	 * Remove the specified element from the set
	 * @function
	 * @param {Object} element The element to remove
	 * @returns {boolean} True if the element was removed
	 * @since 0.0.0
	 */
	this.remove = function(element) {
		for (i in this.elements) {
			var el = this.elements[i];
			if (el === element) {
				this.removeElementAtIndex(i);
				return true;
			} // if
		} // for
		return false;
	}
}