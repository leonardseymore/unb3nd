/**
 * @fileOverview Utilities
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
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