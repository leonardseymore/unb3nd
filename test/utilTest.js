"use strict";

module("Utilities");

test("Test getTime()", function() {
	var currentTime = unb3nd.getTime();
	ok(currentTime, "Current time must be valid");
});