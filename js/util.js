/**
 * @fileOverview Utilities
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

"use strict";

/**
 * Current time in milliseconds
 * @function
 * @returns {Number} Current time in milliseconds
 * @since 0.0.0
 */
function getTime() {
  return Date.now();
}
/**
 * Calculate window Y-coordinate based on world Y-coordinate
 * @function
 * @param {Number} y World Y-coordinate
 * @returns {Number} Window Y-coordinate
 * @since 0.0.0
 */
function Y(y) {
  return Engine.getInstance().windowRect.height - y;
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
  worldPos.multScalarMutate(1 / ppm);
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
  windowPos.multScalarMutate(ppm);
  windowPos.y = Y(windowPos.y);
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
  windowVec.multScalarMutate(ppm);
  return windowVec;
}

/**
 * unb3nd constants namespace
 * @since 0.0.0.4
 */
var constants = {

  /**
   * Colors
   */
  PARTICLE_COLOR:"lightblue",
  PARTICLE_STRING_COLOR:"black",
  PARTICLE_WIDTH:3,
  RIGID_BODY_COLOR:"lightblue",
  RIGID_BODY_STRING_COLOR:"black",
  RIGID_BODY_WIDTH:3,
  GRAVITY_COLOR:"orange",
  WIND_COLOR:"orange",
  DRAG_COLOR:"lightblue",
  SPRING_COLOR:"lightgreen",
  ANCHORED_SPRING_COLOR:"darkgreen",
  BUNGEE_COLOR:"pink",
  ANCHORED_BUNGEE_COLOR:"magenta",
  AERO_COLOR:"purple",
  CABLE_COLOR:"grey",
  ANCHORED_CABLE_COLOR:"#333333",
  ROD_COLOR:"black",
  ANCHORED_ROD_COLOR:"#333333",
  COLLISION_DETECTION_COLOR:"purple",
  COLLISION_BOX_COLOR:"purple",
  COLLISION_BOX_TOL_COLOR:"pink",

  /**
   * Earth's gravitational constant
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  EARTH_GRAVITATIONAL_CONSTANT:-9.81,

  /**
   * Default gravitational constant used throughout
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  DEFAULT_GRAVITATIONAL_CONSTANT:-9.81,

  /**
   * Default drag velocity coefficient
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  DEFAULT_DRAG_VELOCITY_COEFF:0.5,

  /**
   * Default drag velocity squared coefficient
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  DEFAULT_DRAG_VELOCITY_SQUARED_COEFF:0.05,

  /**
   * Default collision restitution
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  DEFAULT_COLLISION_RESTITUTION:0.5,

  /**
   * Useful for drawing full circles
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  TWO_PI:Math.PI * 2
};

