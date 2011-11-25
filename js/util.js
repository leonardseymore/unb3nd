/**
 * @fileOverview Utilities
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */
 
/**
 * Current time in milliseconds
 * @function
 * @returns {long} Current time in milliseconds
 * @since 0.0.0
 */
function getTime() {
	return Date.now();
}

/**
 * Calculate window Y-coordinate based on world Y-coordinate
 * @function
 * @param {float} y World Y-coordinate
 * @returns {float} Window Y-coordinate
 * @since 0.0.0
 */
function Y(y) {
	return windowRect.height - y;
}

/**
 * From window position to world position
 * @function
 * @param {Vector2} point Window position
 * @returns {Vector2} Window position
 * @since 0.0.0.3
 */
function world(point) {
  var worldPos = point.clone();
  worldPos.y = Y(point.y);
  return worldPos;
}

/**
 * From world position to window position
 * @function
 * @param {Vector2} point World position
 * @returns {Vector2} Window position
 * @since 0.0.0.3
 */
function window(point) {
  var windowPos = point.clone();
  windowPos.y = Y(point.y);
  return windowPos;
}

/**
 * From world vector to window vector
 * @function
 * @param {Vector2} vector World vector
 * @returns {Vector2} Window vector
 * @since 0.0.0.3
 */
function windowVector(vector) {
  var windowVec = vector.clone();
  windowVec.y = -vector.y;
  return windowVec;
}