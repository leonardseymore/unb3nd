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
  this.mouse = undefined;

  /**
   * @function
   * Initialize game elements here
   * @return void
   */
  this.initGame = function () {

  };

  /**
   * @function
   * Initialize game start here
   * @return void
   */
  this.startGame = function () {
    this.mouse = new FancyMouse();
  };

  /**
   * @function
   * Update all game elements
   * @param {Number} delta Delta time since last update
   * @return void
   */
  this.updateGame = function (delta) {
    this.mouse.update(delta);
  };

  /**
   * @function
   * Render a single frame
   * @return void
   */
  this.renderGame = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.draw(this.ctx);
  };

  /**
   * @function
   * Stop the game
   * @return void
   */
  this.stopGame = function () {
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "white";

    var stoppedText = "Stopped";
    this.ctx.fillText(stoppedText,
      (this.windowRect.width - this.ctx.measureText(stoppedText).width) / 2, this.windowRect.height / 2
    );
    this.ctx.restore();
  };
}
MouseGame.prototype = new Engine();

/**
 * Engine instance
 */
var mouseGame = new MouseGame();
Engine.getInstance = function () {
  return mouseGame;
};


