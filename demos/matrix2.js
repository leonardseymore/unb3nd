/**
 * @fileOverview 2D Matrix Explorer
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.3
 */

var triangle = undefined;

 /**
  * Initialize game elements here
  * @function
  * @returns {void}
  * @since 0.0.0
  */
 function initGame() {
   triangle = [
      new Vector3(0, 0, 1),
      new Vector3(-25, 50, 1),
      new Vector3(25, 50, 1)
    ];
	 renderGame();
   for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
     var input = document.getElementsByTagName("input").item(i);
     input.onchange = renderGame;
   }
 }
 
 /**
  * Start game
  * @function
  * @returns {void}
  * @since 0.0.0
  */
 function startGame() {

 }
 
/**
 * Update all game elements
 * @function
 * @param {int} delta Delta time since last update
 * @returns {void}
 * @since 0.0.0
 */
function updateGame(delta) {
	
}

/**
 * Render a single frame
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  var pos = new Vector2(Number(document.getElementById("txtP1").value), Number(document.getElementById("txtP2").value));
  pos.draw();

  var offset = new Vector3(Number(document.getElementById("txtO1").value), Number(document.getElementById("txtO2").value));
  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.restore();

  var theta = Number(document.getElementById("txtA1").value) * Math.PI;
  var transformationMatrix = new TransformationMatrix3(theta, pos.x, pos.y);
  var t1 = transformationMatrix.multVector(triangle[0].add(offset));
  var t2 = transformationMatrix.multVector(triangle[1].add(offset));
  var t3 = transformationMatrix.multVector(triangle[2].add(offset));

  ctx.save();
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(t3.x, t3.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

/**
 * Stop the game
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function stopGame() {

}