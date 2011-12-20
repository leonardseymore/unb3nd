/****************************
 * Game implementation
 * Mouse
 ****************************/

/**
 * @class Mouse game implementation
 * @extends unb3nd.Engine
 * @since 0.0.0.4
 */
unb3nd.MouseGame = function() {

  /**
   * Super constructor
   */
  unb3nd.Engine.call(this);

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
  this.initGame = function() {

  };

  /**
   * @function
   * Initialize game start here
   * @return void
   */
  this.startGame = function() {
    this.mouse = new FancyMouse();
  };

  /**
   * @function
   * Update all game elements
   * @param {Number} delta Delta time since last update
   * @return void
   */
  this.updateGame = function(delta) {
    this.mouse.update(delta);
  };

  /**
   * @function
   * Render a single frame
   * @return void
   */
  this.renderGame = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.mouse.draw();
  };

  /**
   * @function
   * Stop the game
   * @return void
   */
  this.stopGame = function() {
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
};
unb3nd.MouseGame.prototype = new unb3nd.Engine();
mouseGame = new unb3nd.MouseGame();

