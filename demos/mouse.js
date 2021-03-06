/****************************
 * Game implementation
 * Mouse
 ****************************/

"use strict";

/**
 * @class Mouse game implementation
 * @extends Engine

 */
function MouseGame() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * @field
   * @type FancyMouse

   */
  var mouse = undefined;

  /**
   * @function
   * Initialize game elements here
   * @return void
   */
  this.initGame = function () {
    this.engineStart();
  };

  /**
   * @function
   * Initialize game start here
   * @return void
   */
  this.startGame = function () {
    mouse = new FancyMouse();
  };

  /**
   * @function
   * Update all game elements
   * @param {Number} delta Delta time since last update
   * @return void
   */
  this.updateGame = function (delta) {
    mouse.update(delta);
  };

  /**
   * @function
   * Render a single frame
   * @return void
   */
  this.renderGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mouse.draw(ctx);
  };
}
MouseGame.prototype = new Engine();
EngineInstance = new MouseGame();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};

