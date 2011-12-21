"use strict";

module("Utilities");

test("Test getTime()", function () {
  var currentTime = getTime();
  ok(currentTime, "Current time must be valid");
});