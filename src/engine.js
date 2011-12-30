/**
 * @fileOverview Main application driver
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

"use strict";

/**
 * @class An object to register engine events to
 * @constructor
 * @extends Observable
 * @since 0.0.0
 */
function Engine() {

  /*
   * Call parent constructor
   */
  Observable.call(this);

  /**
   * Determines if mouse is currently down
   * @field
   * @type Boolean
   * @default false
   * @since 0.0.0.4
   */
  this.isMouseDown = false;

  /**
   * Last drag event position
   * @field
   * @type MouseEvent
   * @default undefined
   * @since 0.0.0.4
   */
  this.lastDrag = undefined;

  /**
   * On reset event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onreset = undefined;

  /**
   * Reset callback invoker
   * @function
   * @returns {void}
   * @since 0.0.0
   */
  this.reset = function () {
    if (this.onreset) {
      this.onreset();
    } // if
    this.dispatchEvent("reset", undefined);
  };

  /**
   * On init event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.oninit = undefined;

  /**
   * Init callback invoker
   * @function
   * @returns {void}
   * @since 0.0.0
   */
  this.init = function () {
    if (this.oninit) {
      this.oninit();
    } // if
    this.dispatchEvent("init", undefined);
  };

  /**
   * On mouse move event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onmousemove = undefined;

  /**
   * @method
   * Mouse move callback invoker
   * @return void
   */
  this.mousemove = function (e) {
    if (this.onmousemove) {
      this.onmousemove(e);
    } // if
    this.dispatchEvent("mousemove", e);
  };

  /**
   * On mouse down event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onmousedown = undefined;

  /**
   * On mouse down callback invoker
   * @function
   * @param {MouseEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.mousedown = function (e) {
    if (this.onmousedown) {
      this.onmousedown(e);
    } // if
    this.dispatchEvent("mousedown", e);
  };

  /**
   * On mouse drag event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0.4
   */
  this.onmousedrag = undefined;

  /**
   * On mouse down callback invoker
   * @function
   * @param {MouseEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.mousedrag = function (e) {
    if (this.lastDrag) {
      e.deltaX = e.offsetX - this.lastDrag.offsetX;
      e.deltaY = e.offsetY - this.lastDrag.offsetY;
    } else {
      e.deltaX = 0;
      e.deltaY = 0;
    } // if
    this.lastDrag = e;

    if (this.onmousedrag) {
      this.onmousedrag(e);
    } // if
    this.dispatchEvent("mousedrag", e);
  };

  /**
   * On mouse up event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onmouseup = undefined;

  /**
   * On mouse up callback invoker
   * @function
   * @param {MouseEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.mouseup = function (e) {
    if (this.onmouseup) {
      this.onmouseup(e);
    } // if
    this.dispatchEvent("mouseup", e);
  };

  /**
   * On mouse over event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onmouseover = undefined;

  /**
   * On mouse over callback invoker
   * @function
   * @param {MouseEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.mouseover = function (e) {
    if (this.onmouseover) {
      this.onmouseover(e);
    } // if
    this.dispatchEvent("mouseover", e);
  };

  /**
   * On mouse out event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onmouseout = undefined;

  /**
   * On mouse out callback invoker
   * @function
   * @param {MouseEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.mouseout = function (e) {
    if (this.onmouseout) {
      this.onmouseout(e);
    } // if
    this.dispatchEvent("mouseout", e);
  };

  /**
   * On mouse wheel event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0.3
   */
  this.onmousewheel = undefined;

  /**
   * On mouse wheel callback invoker
   * @function
   * @param {MouseEvent} e The event object
   * @returns {void}
   * @since 0.0.0.3
   */
  this.mousewheel = function (e) {
    if (this.onmousewheel) {
      this.onmousewheel(e);
    } // if
    this.dispatchEvent("mousewheel", e);
  };

  /**
   * On key down event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onkeydown = undefined;

  /**
   * On key down callback invoker
   * @function
   * @param {KeyboardEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.keydown = function (e) {
    if (this.onkeydown) {
      this.onkeydown(e);
    } // if
    this.dispatchEvent("keydown", e);
  };

  /**
   * On key up event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onkeyup = undefined;

  /**
   * On key up callback invoker
   * @function
   * @param {KeyboardEvent} e The event object
   * @returns {void}
   * @since 0.0.0
   */
  this.keyup = function (e) {
    if (this.onkeyup) {
      this.onkeyup(e);
    } // if
    this.dispatchEvent("keyup", e);
  };

  /**
   * On pause event callback
   * @field
   * @type function
   * @default undefined
   * @since 0.0.0
   */
  this.onpause = undefined;

  /**
   * On pause callback invoker
   * @function
   * @returns {void}
   * @since 0.0.0
   */
  this.pause = function () {
    if (this.onpause) {
      this.onpause();
    } // if
    this.dispatchEvent("pause", undefined);
  };

  /**
   * Target frame rate
   * @public
   * @constant
   * @field
   * @type Number
   * @since 0.0.0
   */
  this.targetFps = 30;

  /**
   * Log debug flag
   * @public
   * @field
   * @type boolean
   * @since 0.0.0
   */
  this.debug = true;

  /**
   * Verbose log debug flag
   * @public
   * @field
   * @type boolean
   * @since 0.0.0
   */
  this.verbose = false;

  /**
   * Drawing surface
   * @public
   * @field
   * @type CanvasContext
   * @since 0.0.0
   */
  this.canvas = null;

  /**
   * Canvas rectangle
   * @public
   * @field
   * @type Rectangle
   * @since 0.0.0
   */
  this.windowRect = null;

  /**
   * Drawing context
   * @public
   * @field
   * @type CanvasContext
   * @since 0.0.0
   */
  this.ctx = null;

  /**
   * Last calculated frame rate
   * @public
   * @field
   * @type int
   * @since 0.0.0
   */
  this.fps = 0;

  /**
   * Last frame update time
   * @public
   * @field
   * @type Number
   * @since 0.0.0
   */
  this.lastFrame = 0;

  /**
   * Average frame rate
   * @public
   * @field
   * @type Number
   * @since 0.0.0.3
   */
  this.avgFps = 0;

  /**
   * Last frame rate update time
   * @public
   * @field
   * @type Number
   * @since 0.0.0
   */
  this.lastFPS = getTime();

  /**
   * Last sync time
   * @public
   * @field
   * @type Number
   * @since 0.0.0
   */
  this.lastSync = getTime();

  /**
   * Global running flag
   * @public
   * @field
   * @type boolean
   * @since 0.0.0
   */
  this.running = false;

  /**
   * Global paused flag
   * @public
   * @field
   * @type boolean
   * @since 0.0.0
   */
  this.paused = false;

  /**
   * Global scale (Pixels Per Meter) flag
   * @public
   * @field
   * @type Number
   * @since 0.0.0.3
   */
  this.ppm = 1;

  /**
   * Window offset
   * @public
   * @field
   * @type Array
   * @since 0.0.0.4
   */
  this.windowOffset = math.v2.create();

  /**
   * @function
   * Initialize values on page load
   *
   * @return void
   * @throws Error If required HTML5 support is unavailable
   */
  this.engineInit = function () {
    if (this.debug) {
      console.debug("Start. Initializing");
    } // if

    this.canvas = document.getElementById("canvas");
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext("2d");

      if (this.debug) {
        console.debug("Found 2d context");
      } // if
      this.windowRect = new Rectangle(math.v2.create(), this.canvas.width, this.canvas.height);

      /**
       * @eventHandler
       * This handler links up the canvas mousemove event handler
       * @param Event e mousemove event
       */
      this.canvas.onmousemove = function (e) {
        if (this.isMouseDown) {
          EngineInstance.mousedrag(e);
        } // if
        EngineInstance.mousemove(e);
      };

      /**
       * @eventHandler
       * This handler links up the canvas mousedown event handler
       * @param {MouseEvent} e mousedown event
       */
      this.canvas.onmousedown = function (e) {
        this.isMouseDown = true;
        EngineInstance.mousedown(e);
      };

      /**
       * @eventHandler
       * This handler links up the canvas mouseup event handler
       * @param {Event} e mouseup event
       */
      this.canvas.onmouseup = function (e) {
        EngineInstance.mouseup(e);
      };

      window.onmouseup = function (e) {
        this.isMouseDown = false;
        this.lastDrag = undefined;
      };

      /**
       * @eventHandler
       * This handler links up the canvas mouseover event handler
       * @param Event e mouseover event
       */
      this.canvas.onmouseover = function (e) {
        EngineInstance.mouseover(e);
      };

      /**
       * @eventHandler
       * This handler links up the canvas mouseout event handler
       * @param Event e mouseout event
       */
      this.canvas.onmouseout = function (e) {
        EngineInstance.mouseout(e);
      };

      /**
       * @eventHandler
       * This handler links up the canvas mouseout event handler
       * @param Event e mousewheel event
       */
      this.canvas.onmousewheel = function (e) {
        EngineInstance.mousewheel(e);
      };

      var STYLE_DARK_EVENING = this.ctx.createLinearGradient(0, -75, 0, 75);
      STYLE_DARK_EVENING.addColorStop(0, '#232256');
      STYLE_DARK_EVENING.addColorStop(1, '#143778');

      this.initGame();
      this.init();
    } else {
      throw new Error("Canvas not supported");
    } // if
    if (this.debug) {
      console.debug("Done. Initializing");
    } // if

    document.onkeydown = function (e) {
      // toggle debug 'D'
      if (e.keyCode == 68) {
        EngineInstance.debug = !EngineInstance.debug;
        console.debug("Debug enabled: " + EngineInstance.debug);
      } // if

      EngineInstance.keydown(e);
    }

    document.onkeyup = function (e) {
      EngineInstance.keyup(e);
    }
  };

  /**
   * @function
   * Reset all counters
   * @return void
   */
  this.engineReset = function () {
    this.fps = 0;
    this.lastFrame = 0;
    this.lastFPS = getTime();
    this.lastSync = getTime();
    this.reset();
  };

  /**
   * @function
   * Time delta
   * @return int Time delta between time and last update time
   */
  this.getDelta = function () {
    var time = getTime();
    var delta = time - this.lastFrame;
    this.lastFrame = time;

    return delta;
  };

  /**
   * @function
   * Recalculate frame rate
   * @return void
   */
  this.updateFPS = function () {
    if (getTime() - this.lastFPS > 1000) {
      this.avgFps = this.fps;
      this.fps = 0;
      this.lastFPS += 1000;
    } // if
    this.fps++;
  };

  /**
   * @function
   * Start the engine
   * @return void
   */
  this.engineStart = function () {
    this.engineReset();
    this.getDelta(); // clear out delta
    if (!this.running) {
      this.running = true;
      this.startGame();
      this.engineMain();
    } else {
      console.warn("Start called, but already running");
    } // if
  };

  /**
   * @function
   * Pause the engine
   * @return void
   */
  this.enginePause = function () {
    this.paused = true;
    this.pause();
  };

  /**
   * @function
   * Continue the engine
   * @return void
   */
  this.engineContinue = function () {
    this.paused = false;
    this.pause();
    this.engineReset();
    setTimeout(EngineInstance.engineMain, 0);
  };

  /**
   * @function
   * Stop the engine
   * @return void
   */
  this.engineStop = function () {
    if (this.running) {
      this.running = false;
      this.stopGame();
    } else {
      console.warn("Stop called, but not running");
    } // if
  };

  /**
   * @function
   * Sync the framerate
   * @return void
   */
  this.engineSync = function () {
    var sleepTime = this.lastSync + (1000 / this.targetFps) - getTime();
    setTimeout(EngineInstance.engineMain, sleepTime);
    this.lastSync += (1000 / this.targetFps);
  };

  /**
   * @function
   * Main loop
   * @return void
   */
  this.engineMain = function () {
    var instance = EngineInstance;
    if (instance.running && !instance.paused) {
      var delta = instance.getDelta();
      instance.updateGame(delta);
      instance.ctx.save();
      instance.renderGame(this.ctx);
      instance.ctx.restore();
      instance.updateFPS();
      instance.engineSync();
    } // while
  };

  /**
   * @function
   * @abstract
   * Initialize game elements here
   * @returns {void}
   * @since 0.0.0.4
   */
  this.initGame = function () {
  }

  /**
   * @function
   * @abstract
   * Initialize game start here
   * @returns {void}
   * @since 0.0.0.4
   */
  this.startGame = function () {
  }

  /**
   * @function
   * @abstract
   * Update all game elements
   * @param int delta Delta time since last update
   * @returns {void}
   * @since 0.0.0.4
   */
  this.updateGame = function (delta) {
  }

  /**
   * @function
   * @abstract
   * Render a single frame
   * @returns {void}
   * @since 0.0.0.4
   */
  this.renderGame = function () {
  }

  /**
   * @function
   * @abstract
   * Stop the game
   * @returns {void}
   * @since 0.0.0.4
   */
  this.stopGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;
    var windowRect = this.windowRect;

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
}
Engine.prototype = new Observable();

/**
 * @global
 * Singleton reference to the game engine.
 * @type {Engine} Instance of the engine
 * @since 0.0.0.4
 */
var EngineInstance = undefined;