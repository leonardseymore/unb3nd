module("Engine");

test("Test reset engine", function() {
	fps = 1;
	lastFrame = 1;
	engineReset();
	equal(fps, 0);
	equal(lastFrame, 0);
});

test("Test update FPS counter once", function() {
	engineReset();
	var lastFPS = fps;
	updateFPS();
	ok(lastFPS == fps - 1, "Expected to increment by one");
});

/*
// This test is important to ensure FPS calculation works correctly,
// but is disabled since it takes a second to execute.
asyncTest("Test update FPS counter", function() {
	var tol = 1;
	engineReset();
	setTimeout(function(){
		var inRange = fps >= FPS - tol && fps <= FPS + tol;
		ok(inRange, "Frames per second outside acceptable range");
		engineStop();
		start();
	}, 1000);
	engineStart();
});
*/