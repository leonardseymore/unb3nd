/****************************
 * Game implementation
 * Mouse
 ****************************/

"use strict";

/**
 * @class Mouse game implementation
 * @extends Engine
 * @since 0.0.0.4
 */
function MouseGame() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * @field
   * @type FancyMouse
   * @since 0.0.0.4
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

  /**
   * @function
   * Stop the game
   * @return void
   */
  this.stopGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;
    var windowRect = this.windowRect;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";

    var stoppedText = "Stopped";
    ctx.fillText(stoppedText,
      (windowRect.width - ctx.measureText(stoppedText).width) / 2, windowRect.height / 2
    );
    ctx.restore();
  };
}
MouseGame.prototype = new Engine();
EngineInstance = new MouseGame();
