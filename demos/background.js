/****************************
 * Game implementation
 * Backgrounds
 ****************************/

"use strict";

/**
 * @class Background game implementation
 * @extends Engine

 */
function BackgroundGame() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * @field
   * @type Background

   */
  var background = undefined;

  /**
   * @function
   * @override
   */
  this.startGame = function () {
    var type = document.getElementById("selBackground").value;
    switch (type) {
      case "fill":
        background = new FillBackground("green");
        break;
      case "starry":
        background = new StarryBackground(50);
        break;
    } // switch
  };

  /**
   * @function
   * @override
   */
  this.updateGame = function (delta) {
    background.update(delta);
  };

  /**
   * @function
   * @override
   */
  this.renderGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx, this.windowRect);
  };
}
BackgroundGame.prototype = new Engine();
EngineInstance = new BackgroundGame();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};