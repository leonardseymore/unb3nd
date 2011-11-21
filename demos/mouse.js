/****************************
 * Game implementation
 * Mouse
 ****************************/
 /**
  * @global
  * Number of masses
  */
var mouse;
 
 /**
  * @function
  * Initialize game elements here
  * @return void
  */
 function initGame() {
	
 }
 
  /**
  * @function
  * Initialize game start here
  * @return void
  */
 function startGame() {
	mouse = new FancyMouse();
 }
 
/**
 * @function
 * Update all game elements
 * @param int delta Delta time since last update
 * @return void
 */
function updateGame(delta) {
	mouse.update(delta);
}

/**
 * @function
 * Render a single frame
 * @return void
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	mouse.draw();
}

/**
 * @function
 * Stop the game
 * @return void
 */
function stopGame() {
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
}