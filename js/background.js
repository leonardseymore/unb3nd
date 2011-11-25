/**
 * @fileOverview Background effects
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */
 
/**
 * @class Background base class
 * @constructor
 * @since 0.0.0
 */
function Background() {

	/**
	 * Update the background
	 * @function
	 * @param {int} delta Delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.update = function(delta) {}
	
	/**
	 * Draw the background
	 * @function
	 * @param {Rectangle} area The area to draw the background on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(area) {}
}

/**
 * @class A simple background that takes a fill style for the background
 * @constructor
 * @extends Background
 * @param {FillStyle} fillStyle The style to use to fill the background
 * @since 0.0.0
 */
function FillBackground(fillStyle) {

	/**
	 * Fill style to flood the background
	 * @field 
	 * @type FillStyle
	 * @default fillStyle
	 * @since 0.0.0
	 */
	this.fillStyle = fillStyle;
	
	/**
	 * Draw the background
	 * @function
	 * @override
	 * @param {Rectangle} area The area to draw the background on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(area) {
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(area.x, area.y, area.width, area.height);
	}
}
FillBackground.prototype = new Background();

/**
 * @class An animated starry sky background
 * @constructor
 * @extends Background
 * @param {int} numStars Number of stars
 * @param {FillStyle} fillStyle Basic fill style
 * @since 0.0.0
 */
function StarryBackground(numStars, fillStyle) {

	/**
	 * @class A star
	 * @constructor
	 * @param {float} x X-coordinate
	 * @param {float} y Y-coordinate
	 * @param {float} i Intensity 0 to 1
	 * @since 0.0.0
	 */
	function Star(x, y, i) {
	
		/**
		 * X-coordinate
		 * @field 
		 * @type float
		 * @default x
		 * @since 0.0.0
		 */
		this.x = x;
		
		/**
		 * Y-coordinate
		 * @field 
		 * @type float
		 * @default y
		 * @since 0.0.0
		 */
		this.y = y;
		
		/**
		 * Intensity 0.0 to 1.0
		 * @field 
		 * @type float
		 * @default i
		 * @since 0.0.0
		 */
		this.i = i;
		
		/**
		 * Star radius
		 * @field 
		 * @type float
		 * @default Random[2,6]
		 * @since 0.0.0
		 */
		this.r = Math.floor(Math.random() * 4) + 2;
		
		/**
		 * Animate this star over the give time delta
		 * @function
		 * @param {int} delta Delta time in milliseconds
		 * @returns {void}
		 * @since 0.0.0
		 */
		this.animate = function(delta) {
			if (Math.random() < 0.005) {
				this.i = Math.random();
			} // if
		}
		
		/**
		 * Draw the star as a pixel
		 * @function
		 * @returns {void}
		 * @since 0.0.0
		 */
		this.draw = function() {
			ctx.fillStyle = "rgba(255, 255, 255, " + this.i + ")";
			ctx.fillRect(this.x, this.y, 1, 1);
		}
		
		/**
		 * Draw the star as a cartoon styled star
		 * @function
		 * @returns {void}
		 * @since 0.0.0
		 */
		this.drawCartoon = function() {
			ctx.save();
			ctx.fillStyle = "rgba(255, 255, 255, " + this.i + ")";
			ctx.translate(this.x, this.y);
			ctx.beginPath()
			ctx.moveTo(this.r, 0);
			for (var i = 0; i < 9; i++){
				ctx.rotate(Math.PI / 5);
				if(i % 2 == 0) {
					ctx.lineTo((this.r / 0.525731) * 0.200811,0);
				} else {
					ctx.lineTo(this.r, 0);
				} // if
			} // for
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	}

	/**
	 * Cartoonify stars
	 * @field 
	 * @type boolean
	 * @default true
	 * @since 0.0.0
	 */ 
	this.cartoonify = true;
	
	/**
	 * Fill style to flood the background
	 * @field 
	 * @type FillStyle
	 * @default {@link STYLE_DARK_EVENING}
	 * @since 0.0.0
	 */ 
	this.fillStyle = fillStyle || STYLE_DARK_EVENING;
	
	/**
	 * Number of stars
	 * @field 
	 * @type int
	 * @default 50
	 * @since 0.0.0
	 */ 
	this.numStars = numStars || 50;
	
	/**
	 * Very lucky if you see one of these
	 * @field 
	 * @type Star
	 * @default undefined
	 * @since 0.0.0
	 */ 
	this.shootingStar = undefined;
	
	/**
	 * Star intensities
	 * @field 
	 * @type float []
	 * @default []
	 * @since 0.0.0
	 */ 
	this.stars = [];
	for (i = 0; i < numStars; i++) {
		var star = new Star(windowRect.width * Math.random(), 
			windowRect.height * Math.random(), 
			Math.random());
		this.stars.push(star);
	}
	
	/**
	 * Update the background
	 * @function
	 * @override
	 * @param {int} delta Delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.update = function(delta) {
		var dt = delta / 1000;
		if (!this.shootingStar) {
			if (Math.random() < 0.002) {
				this.shootingStar = new Star(0, Math.random() * windowRect.height, Math.random());
			} // if
		} else {
			this.shootingStar.x += 500 * dt;
			this.shootingStar.y += 300 * dt;
			if (this.shootingStar.x > windowRect.width) {
				this.shootingStar = undefined;
			} // if
		} // if
		
		for (i = 0; i < numStars; i++) {
			var star = this.stars[i];
			star.animate(delta);
		} // for
	}
	
	/**
	 * Draw the background
	 * @function
	 * @override
	 * @param {Rectangle} area The area to draw the background on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(area) {
		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(area.x, area.y, area.width, area.height);
		for (i = 0; i < numStars; i++) {
			var star = this.stars[i];
			if (this.cartoonify) {
				star.drawCartoon();
			} else {
				star.draw();
			} // if
		} // for
		
		if (this.shootingStar) {
			if (this.cartoonify) {
				this.shootingStar.drawCartoon();
			} else {
				this.shootingStar.draw();
			} // if
		} // if		
		ctx.restore();
	}
}
StarryBackground.prototype = new Background();