/**
 * @fileOverview Utilities
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * Current time in milliseconds
 * @function
 * @returns {Number} Current time in milliseconds

 */
function getTime() {
  return Date.now();
}

/**
 * Calculate window Y-coordinate based on world Y-coordinate
 * @function
 * @param {Number} y World Y-coordinate
 * @returns {Number} Window Y-coordinate

 */
function Y(y) {
  return EngineInstance.windowRect.height - y + EngineInstance.windowOffset[1];
}

/**
 * Calculate window X-coordinate based on world X-coordinate
 * @function
 * @param {Number} x World X-coordinate
 * @returns {Number} Window X-coordinate

 */
function X(x) {
  return - x + EngineInstance.windowOffset[0];
}

/**
 * From window position to world position
 * @function
 * @param {Array} point Window position
 * @returns {Array} Window position

 */
function windowToWorld(point) {
  var worldPos = math.v2.create(point);
  worldPos[0] = X(worldPos[0]);
  worldPos[1] = Y(worldPos[1]);
  math.v2.multScalarMutate(worldPos, EngineInstance.ppm);
  return worldPos;
}

/**
 * From world position to window position
 * @function
 * @param {Array} point World position
 * @returns {Array} Window position

 */
function worldToWindow(point) {
  var windowPos = math.v2.create(point);
  math.v2.multScalarMutate(windowPos, 1 / EngineInstance.ppm);
  windowPos[0] = X(windowPos[0]);
  windowPos[1] = Y(windowPos[1]);
  return windowPos;
}

/**
 * From world vector to window vector
 * @function
 * @param {Array} vector World vector
 * @returns {Array} Window vector

 */
function windowVector(vector) {
  var windowVec = math.v2.create(vector);
  windowVec[1] = -vector[1];
  math.v2.multScalarMutate(windowVec, EngineInstance.ppm);
  return windowVec;
}

/**
 * unb3nd constants namespace

 */
var constants = {

  /**
   * Colors
   */
  PARTICLE_COLOR:"lightblue",
  PARTICLE_STRING_COLOR:"black",
  PARTICLE_WIDTH:3,
  PARTICLE_HALF_WIDTH:1.5,
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

   */
  EARTH_GRAVITATIONAL_CONSTANT:-9.81,

  /**
   * Default gravitational constant used throughout
   * @public
   * @constant
   * @field
   * @type Number

   */
  DEFAULT_GRAVITATIONAL_CONSTANT:-9.81,

  /**
   * Default drag velocity coefficient
   * @public
   * @constant
   * @field
   * @type Number

   */
  DEFAULT_DRAG_VELOCITY_COEFF:0.5,

  /**
   * Default drag velocity squared coefficient
   * @public
   * @constant
   * @field
   * @type Number

   */
  DEFAULT_DRAG_VELOCITY_SQUARED_COEFF:0.05,

  /**
   * Default collision restitution
   * @public
   * @constant
   * @field
   * @type Number

   */
  DEFAULT_COLLISION_RESTITUTION:0.5,

  /**
   * Useful for drawing full circles
   * @public
   * @constant
   * @field
   * @type Number

   */
  TWO_PI:Math.PI * 2
};

