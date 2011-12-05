/**
 * @fileOverview Global variables
 * TODO: maybe not such a good idea to have globals
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * Global settings
 * @public
 * @constant
 * @field
 * @type {}
 * @since 0.0.0
 */
var SETTINGS = {
	PARTICLE_COLOR : "lightblue",
	PARTICLE_STRING_COLOR : "black",
	PARTICLE_WIDTH : 3,
	RIGID_BODY_COLOR : "lightblue",
	RIGID_BODY_STRING_COLOR : "black",
	RIGID_BODY_WIDTH : 3,
	GRAVITY_COLOR : "orange",
	WIND_COLOR : "orange",
	DRAG_COLOR : "lightblue",
	SPRING_COLOR : "lightgreen",
	ANCHORED_SPRING_COLOR : "darkgreen",
	BUNGEE_COLOR : "pink",
	ANCHORED_BUNGEE_COLOR : "magenta",
  AERO_COLOR : "purple",
	CABLE_COLOR : "grey",
	ANCHORED_CABLE_COLOR : "#333333",
	ROD_COLOR : "black",
  ANCHORED_ROD_COLOR : "#333333",
	COLLISION_DETECTION_COLOR : "purple",
	COLLISION_BOX_COLOR : "purple",
	COLLISION_BOX_TOL_COLOR : "pink"
}

/**
 * Earth's gravitational constant
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var EARTH_GRAVITATIONAL_CONSTANT = -9.81;

/**
 * Default gravitational constant used throughout
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var DEFAULT_GRAVITATIONAL_CONSTANT = EARTH_GRAVITATIONAL_CONSTANT;

/**
 * Default drag velocity coefficient
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var DEFAULT_DRAG_VELOCITY_COEFF = 0.5;

/**
 * Default drag velocity squared coefficient
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var DEFAULT_DRAG_VELOCITY_SQUARED_COEFF = 0.05;

/**
 * Default collision restitution
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var DEFAULT_COLLISION_RESTITUTION = 0.5;

/**
 * Useful for drawing full circles
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var TWO_PI = Math.PI * 2;

/**
 * Target frame rate
 * @public
 * @constant
 * @field
 * @type float
 * @since 0.0.0
 */
var FPS = 30;

/**
 * Log debug flag
 * @public
 * @field
 * @type boolean
 * @since 0.0.0
 */
var debug = true;

/**
 * Verbose log debug flag
 * @public
 * @field
 * @type boolean
 * @since 0.0.0
 */
var verbose = false;

/**
 * Drawing surface
 * @public
 * @field
 * @type Canvas
 * @since 0.0.0
 */
var canvas = null;

/**
 * Canvas rectangle
 * @public
 * @field
 * @type Rectangle
 * @since 0.0.0
 */
var windowRect = null;

/**
 * Drawing context
 * @public
 * @field
 * @type Canvas2DRenderingContext
 * @since 0.0.0
 */
var ctx = null;

/**
 * Last calculated frame rate
 * @public
 * @field
 * @type int
 * @since 0.0.0
 */
var fps = 0;

/**
 * Last frame update time
 * @public
 * @field
 * @type long
 * @since 0.0.0
 */
var lastFrame = 0;

/**
 * Average frame rate
 * @public
 * @field
 * @type int
 * @since 0.0.0.3
 */
var avgFps = 0;

/**
 * Last frame rate update time
 * @public
 * @field
 * @type long
 * @since 0.0.0
 */
var lastFPS = getTime();

/**
 * Last sync time
 * @public
 * @field
 * @type long
 * @since 0.0.0
 */
var lastSync = getTime();

/**
 * Global running flag
 * @public
 * @field
 * @type boolean
 * @since 0.0.0
 */
var running = false;

/**
 * Global paused flag
 * TODO: ensure this is used
 * @public
 * @field
 * @type boolean
 * @since 0.0.0
 */
var paused = false;

/**
 * Global scale (Pixels Per Meter) flag
 * @public
 * @field
 * @type boolean
 * @since 0.0.0.3
 */
var ppm = 1;