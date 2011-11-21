module("Collections");

test("Test Queue", function() {
	var item1 = 1;
	var item2 = 2;
	var item3 = 3;
	
	var queue = new Queue();
	
	ok(queue.isEmpty());
	equals(queue.getSize(), 0);

	queue.enqueue(item1);
	queue.enqueue(item2);
	queue.enqueue(item3);
	
	equals(queue.getSize(), 3);
	
	var element = queue.dequeue();
	equals(queue.getSize(), 2);
	ok(element === item1);
});

test("Test RingBuffer", function() {
	var size = 2;
	
	var item1 = 1;
	var item2 = 2;
	var item3 = 3;
	
	var buffer = new RingBuffer(size);
	
	ok(buffer.isEmpty());
	equals(buffer.getSize(), 0);

	buffer.enqueue(item1);
	buffer.enqueue(item2);
	buffer.enqueue(item3);
	
	equals(buffer.getSize(), 2);
	
	var element = buffer.dequeue();
	equals(buffer.getSize(), 1);
	ok(element === item2);
});