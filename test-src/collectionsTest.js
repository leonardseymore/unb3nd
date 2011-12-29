"use strict";

module("Collections");

test("Test Queue", function() {
	var item1 = 1;
	var item2 = 2;
	var item3 = 3;
	
	var queue = new Queue();
	
	ok(queue.isEmpty());
	equal(queue.getSize(), 0);

	queue.enqueue(item1);
	queue.enqueue(item2);
	queue.enqueue(item3);
	
	equal(queue.getSize(), 3);
	
	var element = queue.dequeue();
	equal(queue.getSize(), 2);
	ok(element === item1);
});

test("Test RingBuffer", function() {
	var size = 2;
	
	var item1 = 1;
	var item2 = 2;
	var item3 = 3;
	
	var buffer = new RingBuffer(size);
	
	ok(buffer.isEmpty());
	equal(buffer.getSize(), 0);

	buffer.enqueue(item1);
	buffer.enqueue(item2);
	buffer.enqueue(item3);
	
	equal(buffer.getSize(), 2);
	
	var element = buffer.dequeue();
	equal(buffer.getSize(), 1);
	ok(element === item2);
});