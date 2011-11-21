/**
 * @fileOverview 2D Vector Explorer
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * Vectors
 * @field
 * @type Vector2 []
 * @default []
 * @since 0.0.0
 */
var vectors = [];

/**
 * Currently selected vector
 * @field
 * @type Vector2
 * @default undefined
 * @since 0.0.0
 */
var selectedVector = undefined;
 
/**
 * Gets the first anchor within the specified radius
 * @function
 * @param {Vector2} point The point at which to look
 * @param {float} radius The search radius
 * @returns {Vector2} The vector, undefined if none were found
 * @since 0.0.0
 */
function getFirstVectorWithin(point, radius) {
	for (i in vectors) {
		var vector = vectors[i];
		if (vector.sub(point).getMagnitude() <= radius) {
			return vector;
		} // if
	} // for
	return undefined;
}

/** 
 * Highlights a single point
 * @function
 * @param {Vector2} point The point
 * @param {float} radius The radius around the point
 * @returns {void}
 * @since 0.0.0
 */
function highlightPoint(point, radius) {
	ctx.save();
	ctx.translate(windowRect.width / 2, windowRect.height / 2);
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();
}
 
/**
 * Mouse move handler
 * @event
 * @since 0.0.0
 */
engine.addEventListener("mousemove", function(e) {
	var x = e.offsetX - windowRect.width / 2;
	var y = Y(e.offsetY) - windowRect.height / 2;
	var point = new Vector2(x, y);
	
	renderGame();
	if (selectedVector) {
		selectedVector.x = x;
		selectedVector.y = y;
		return;
	} // if
	
	var vector = getFirstVectorWithin(point, 5);
	if (vector) {
		highlightPoint(vector, 5);
	} // if
});

/**
 * Mouse down handler
 * @event
 * @since 0.0.0
 */
engine.addEventListener("mousedown", function(e) {
	var x = e.offsetX - windowRect.width / 2;
	var y = Y(e.offsetY) - windowRect.height / 2;

	var point = new Vector2(x, y);
	var vector = getFirstVectorWithin(point, 5);
	if (vector) {
		selectedVector = vector;
	} // if
});

/**
 * Mouse up handler
 * @event
 * @since 0.0.0
 */
engine.addEventListener("mouseup", function(e) {
	if (selectedVector) {
		selectedVector = undefined;
	} // if
});

/**
 * Mouse over handler
 * @event
 * @since 0.0.0
 */
engine.addEventListener("mouseover", function(e) {
	renderGame();
});

/**
 * Mouse out handler
 * @event
 * @since 0.0.0
 */
engine.addEventListener("mouseout", function(e) {
	renderGame();
});
 
 /**
  * Initialize game elements here
  * @function
  * @returns {void}
  * @since 0.0.0
  */
 function initGame() {
	vectors.push(new Vector2(100, 10));
	vectors.push(new Vector2(10, 100));
	renderGame();
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
	ctx.save();
	
	ctx.strokeStyle = "grey";
	ctx.beginPath();
	ctx.moveTo(0, windowRect.height / 2);
	ctx.lineTo(windowRect.width, windowRect.height / 2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(windowRect.width / 2, 0);
	ctx.lineTo(windowRect.width / 2, windowRect.height);
	ctx.stroke();
	
	ctx.translate(windowRect.width / 2, windowRect.height / 2);

	ctx.strokeStyle = "grey";
	ctx.fillStyle = "grey";
	drawVector(vectors[0], "v1");
	
	ctx.strokeStyle = "darkgrey";
	ctx.fillStyle = "darkgrey";
	drawVector(vectors[1], "v2");
	
	ctx.beginPath();
	var angle = Vector2.getAngle(vectors[0], vectors[1]);
	ctx.fillText("Angle: " + angle * 180 / Math.PI, 10, 10);

	var vSub = vectors[0].sub(vectors[1]);
	ctx.beginPath();
	ctx.strokeStyle = "green";
	ctx.fillStyle = "green";
	ctx.moveTo(vectors[0].x, vectors[0].y);
	ctx.lineTo(vSub.x, vSub.y);
	ctx.stroke();
	ctx.fillText("v1 - v2", vSub.x, vSub.y);
	
	var vSubO = vectors[1].sub(vectors[0]);
	ctx.beginPath();
	ctx.strokeStyle = "lightgreen";
	ctx.fillStyle = "lightgreen";
	ctx.moveTo(vectors[1].x, vectors[1].y);
	ctx.lineTo(vSubO.x, vSubO.y);
	ctx.stroke();
	ctx.fillText("v2 - v1", vSubO.x, vSubO.y);
	
	var vAdd = vectors[0].add(vectors[1]);
	ctx.beginPath();
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "blue";
	ctx.moveTo(vectors[0].x, vectors[0].y);
	ctx.lineTo(vAdd.x, vAdd.y);
	ctx.stroke();
	ctx.fillText("v1 + v2", vAdd.x, vAdd.y);
	
	var vAddO = vectors[1].add(vectors[0]);
	ctx.beginPath();
	ctx.strokeStyle = "lightblue";
	ctx.fillStyle = "lightblue";
	ctx.moveTo(vectors[1].x, vectors[1].y);
	ctx.lineTo(vAddO.x, vAddO.y);
	ctx.stroke();
	ctx.fillText("v2 + v1", vSubO.x, vSubO.y);
	
	ctx.restore();
}

function drawVector(vector, name) {
	var width = SETTINGS.PARTICLE_WIDTH;
	ctx.save();
	
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(vector.x, vector.y);
	ctx.stroke();
	
	ctx.translate(vector.x, vector.y);
	ctx.fillRect(
		-width, -width, width * 2, width * 2
	);
	ctx.fillText(name, 10, 0);
	ctx.fillText(name, 10, 0);
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