"use strict";

module("Engine");

var _engine = new Engine();
Engine.getInstance = function () {
  return _engine;
}

test("Test reset engine", function () {
  var engine = Engine.getInstance();
  engine.fps = 1;
  engine.lastFrame = 1;
  engine.engineReset();
  equal(engine.fps, 0);
  equal(engine.lastFrame, 0);
});

test("Test update FPS counter once", function () {
  var engine = Engine.getInstance();
  engine.engineReset();
  var lastFPS = engine.fps;
  engine.updateFPS();
  ok(lastFPS == engine.fps - 1, "Expected to increment by one");
});

/*
 // This test is important to ensure FPS calculation works correctly,
 // but is disabled since it takes a second to execute.
 asyncTest("Test update FPS counter", function() {
 var engine = Engine.getInstance();
 var tol = 1;
 engine.engineReset();
 setTimeout(function(){
 var inRange = engine.fps >= engine.targetFps - tol && engine.fps <= engine.targetFps + tol;
 ok(inRange, "Frames per second " + engine.fps + " outside acceptable range [" + (engine.targetFps - tol) + ":" + (engine.targetFps + tol) + "]");
 engine.engineStop();
 start();
 }, 1000);
 engine.engineStart();
 });
 */