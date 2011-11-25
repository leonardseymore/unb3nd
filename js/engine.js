/**
 * @fileOverview Main application driver
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * @class An object to register engine events to
 * @constructor
 * @since 0.0.0
 */
var Engine = function() {

	/*
	 * Call parent constructor
	 */
	Observable.call(this);
	
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
	this.reset = function() {
		if (this.onreset) {
			this.onreset();
		} // if
		this.dispatchEvent("reset");
	}
	
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
	this.init = function() {
		if (this.oninit) {
			this.oninit();
		} // if
		this.dispatchEvent("init");
	}
	
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
	this.mousemove = function(e) {		
		if (this.onmousemove) {
			this.onmousemove(e);
		} // if
		this.dispatchEvent("mousemove", e);
	}
	
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
	this.mousedown = function(e) {		
		if (this.onmousedown) {
			this.onmousedown(e);
		} // if
		this.dispatchEvent("mousedown", e);
	}
	
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
	this.mouseup = function(e) {		
		if (this.onmouseup) {
			this.onmouseup(e);
		} // if
		this.dispatchEvent("mouseup", e);
	}
	
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
	this.mouseover = function(e) {		
		if (this.onmouseover) {
			this.onmouseover(e);
		} // if
		this.dispatchEvent("mouseover", e);
	}
	
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
	this.mouseout = function(e) {		
		if (this.onmouseout) {
			this.onmouseout(e);
		} // if
		this.dispatchEvent("mouseout", e);
	}

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
	this.mousewheel = function(e) {
		if (this.onmousewheel) {
			this.onmousewheel(e);
		} // if
		this.dispatchEvent("mousewheel", e);
	}
	
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
	 * @param {KeyEvent} e The event object
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.keydown = function(e) {		
		if (this.onkeydown) {
			this.onkeydown(e);
		} // if
		this.dispatchEvent("keydown", e);
	}
	
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
	 * @param {KeyEvent} e The event object
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.keyup = function(e) {		
		if (this.onkeyup) {
			this.onkeyup(e);
		} // if
		this.dispatchEvent("keyup", e);
	}
	
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
	this.pause = function() {		
		if (this.onpause) {
			this.onpause();
		} // if
		this.dispatchEvent("pause");
	}
}
Engine.prototype = new Observable();
var engine = new Engine();

/**
 * @function
 * Reset all counters
 * @return void
 */
function engineReset() {
	fps = 0;
	lastFrame = 0;
	lastFPS = getTime();
	lastSync = getTime();
	engine.reset();
}

/**
 * @function
 * Time delta
 * @return int Time delta between time and last update time
 */
function getDelta() {
	var time = getTime();
	var delta = time - lastFrame;
	lastFrame = time;

	return delta;	
}

/**
 * @function
 * Recalculate frame rate
 * @return void
 */
function updateFPS() {
	if (getTime() - lastFPS > 1000) {
		//document.title = "unb3nd: " + canvas.width + "x" + canvas.height + " FPS " + fps;
		//document.title = "FPS " + fps;
		fps = 0;
		lastFPS += 1000;
	} // if
	fps++;
}

/*
 * @eventHandler
 * This handler links up the document ready state to the
 * @link{#init} method
 */
document.onreadystatechange = function() {
	if (document.readyState == "complete") {
		if (debug) {
			console.debug("Document ready state changed to 'complete'");
		} // if
		
		engineInit();
	} // if
}

/*
 * @eventHandler
 * This handler links up the document keydown event handler
 * @param Event e keydown event
 */
document.onkeydown = function(e) {
	// toggle debug 'D'
	if (e.keyCode == 68) {
		debug = !debug;
		console.debug("Debug enabled: " + debug);
	} // if
	
	engine.keydown(e);
}

/*
 * @eventHandler
 * This handler links up the document keyup event handler
 * @param Event e keyup event
 */
document.onkeyup = function(e) {
	engine.keyup(e);
}

/**
 * @function
 * Initialize values on page load
 *
 * @return void
 * @throws Error If required HTML5 support is unavailable
 */
function engineInit() {
	if (debug) {
		console.debug("Start. Initializing");
	} // if
	
	canvas = document.getElementById("canvas");
	if (canvas.getContext) {
    ctx = canvas.getContext("2d");
		
		if (debug) {
			console.debug("Found 2d context");
		} // if
		windowRect = new Rectangle(0, 0, canvas.width, canvas.height);
		
		/**
		 * @eventHandler
		 * This handler links up the canvas mousemove event handler
		 * @param Event e mousemove event
		 */
		canvas.onmousemove = function(e) {
			engine.mousemove(e);
		}
		
		/**
		 * @eventHandler
		 * This handler links up the canvas mousedown event handler
		 * @param Event e mousedown event
		 */
		canvas.onmousedown = function(e) {
			engine.mousedown(e);
		}
		
		/**
		 * @eventHandler
		 * This handler links up the canvas mouseup event handler
		 * @param Event e mouseup event
		 */
		canvas.onmouseup = function(e) {
			engine.mouseup(e);
		}
		
		/**
		 * @eventHandler
		 * This handler links up the canvas mouseover event handler
		 * @param Event e mouseover event
		 */
		canvas.onmouseover = function(e) {
			engine.mouseover(e);
		}
		
		/**
		 * @eventHandler
		 * This handler links up the canvas mouseout event handler
		 * @param Event e mouseout event
		 */
		canvas.onmouseout = function(e) {
			engine.mouseout(e);
		}

    /**
		 * @eventHandler
		 * This handler links up the canvas mouseout event handler
		 * @param Event e mousewheel event
		 */
		canvas.onmousewheel = function(e) {
			engine.mousewheel(e);
		}

		
		STYLE_DARK_EVENING = ctx.createLinearGradient(0,-75,0,75);
		STYLE_DARK_EVENING.addColorStop(0, '#232256');
		STYLE_DARK_EVENING.addColorStop(1, '#143778');
		
		initGame();
		engine.init();
	} else {
		throw new Error("Canvas not supported");
	} // if
	if (debug) {
		console.debug("Done. Initializing");
	} // if
}

/**
 * @function
 * Start the engine
 * @return void
 */
function engineStart() {
	engineReset();
	getDelta(); // clear out delta
	if (!running) {
		running = true;
		startGame();
		engineMain();
	} else {
		console.warn("Start called, but already running");
	} // if
}

/**
 * @function
 * Pause the engine
 * @return void
 */
function enginePause() {
	paused = true;
	engine.pause();
}

/**
 * @function
 * Continue the engine
 * @return void
 */
function engineContinue() {
	paused = false;
	engine.pause();
	engineReset();
	setTimeout(engineMain, 0);
}

/**
 * @function
 * Stop the engine
 * @return void
 */
function engineStop() {
	if (running) {
		running = false;
		stopGame();
	} else {
		console.warn("Stop called, but not running");
	} // if
}

/**
 * @function
 * Sync the framerate
 * @return void
 */
function engineSync() {
	var sleepTime = lastSync + (1000 / FPS) - getTime();
	setTimeout(engineMain, sleepTime);
	lastSync += (1000 / FPS);
}

/**
 * @function
 * Main loop
 * @return void
 */
function engineMain() {
	if (running && !paused) {
		var delta = getDelta();
		updateGame(delta);
		ctx.save();
		renderGame();
		ctx.restore();
		updateFPS();
		engineSync();
	} // while
}