/**
 * @fileOverview Mouse cursor effects
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class A fancy mouse using the mouse move deltas to draw a cool mouse
 * @constructor

 */
function FancyMouse() {

	/**
	 * Max mouse moves
	 * @field
	 * @constant
	 * @type int
	 * @default 10

	 */
	var MAX_MOUSE_MOVES = 10;

	/**
	 * Last mouse moves
	 * @field
	 * @type RingBuffer
	 * @default new RingBuffer(MAX_MOUSE_MOVES)

	 */
	var mouseMoves = new RingBuffer(MAX_MOUSE_MOVES);

	/**
	 * Mouse move handler
	 * @event
	 * 
	 */
  EngineInstance.addEventListener("mousemove", function(e) {
		mouseMoves.enqueue([e.offsetX, e.offsetY]);
	});
	
	/**
	 * Help to animate cursor at constant rate
	 * @field
	 * @type int
	 * @default 0

	 */
	this.lastDelta = 0;

	/**
	 * Update the mouse
	 * @function
	 * @param {int} delta Delta time in milliseconds
	 * @returns {void}

	 */
	this.update = function(delta) {
		this.lastDelta += delta;
		
		if (this.lastDelta > 100 / mouseMoves.getElements().length) {
			mouseMoves.dequeue();
			this.lastDelta = 0;
		} // if
	};

	/**
	 * Draw
	 * @function
   * @param {CanvasContext} ctx Rendering context
	 * @returns {void}

	 */
	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		var moves = mouseMoves.getElements();
    var i = moves.length;
		while (i-- > 1) {
		  ctx.moveTo(moves[i - 1][0], moves[i - 1][1]);
			ctx.lineTo(moves[i][0], moves[i][1]);
			ctx.fillRect(moves[i][0] - i, moves[i][1] - i, i * 2,i * 2);
		} // for
		ctx.stroke();
		ctx.restore();
	}
}