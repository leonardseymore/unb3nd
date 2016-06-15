/**
 * @fileOverview Background effects
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class Background base class
 * @constructor

 */
function Background() {

  /**
   * Update the background
   * @function
   * @abstract
   * @param {Number} delta Delta time in milliseconds
   * @returns {void}

   */
  this.update = function (delta) {
  };

  /**
   * Draw the background
   * @function
   * @abstract
   * @param {CanvasContext} ctx Rendering context
   * @param {Rectangle} area The area to draw the background on
   * @returns {void}

   */
  this.draw = function (ctx, area) {
  };
}

/**
 * @class A simple background that takes a fill style for the background
 * @constructor
 * @extends Background
 * @param {String} fillStyle The style to use to fill the background

 */
function FillBackground(fillStyle) {

  /**
   * Fill style to flood the background
   * @field
   * @type String
   * @default fillStyle

   */
  this.fillStyle = fillStyle;

  /**
   * Draw the background
   * @function
   * @override
   * @param {CanvasContext} ctx Rendering context
   * @param {Rectangle} area The area to draw the background on
   * @returns {void}

   */
  this.draw = function (ctx, area) {
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(area.pos[0], area.pos[1], area.width, area.height);
  }
}
FillBackground.prototype = new Background();

/**
 * @class An animated starry sky background
 * @constructor
 * @extends Background
 * @param {Number} numStars Number of stars
 * @param {String} fillStyle Basic fill style

 */
function StarryBackground(numStars, fillStyle) {

  /**
   * Cartoonify stars
   * @field
   * @type boolean
   * @default true

   */
  this.cartoonify = true;

  /**
   * Fill style to flood the background
   * @field
   * @type String
   * @default black

   */
  this.fillStyle = fillStyle || "darkblue";

  /**
   * Number of stars
   * @field
   * @type Number
   * @default 50

   */
  this.numStars = numStars || 50;

  /**
   * Very lucky if you see one of these
   * @field
   * @type Star
   * @default undefined

   */
  this.shootingStar = undefined;

  /**
   * Star Numberensities
   * @field
   * @type Number []
   * @default []

   */
  this.stars = [];
  var i = numStars;
  while (i--) {
    var star = new Star(EngineInstance.windowRect.width * Math.random(),
      EngineInstance.windowRect.height * Math.random(),
      Math.random());
    this.stars.push(star);
  }

  /**
   * Update the background
   * @function
   * @override
   * @param {Number} delta Delta time in milliseconds
   * @returns {void}

   */
  this.update = function (delta) {
    var dt = delta / 1000;
    if (!this.shootingStar) {
      if (Math.random() < 0.002) {
        this.shootingStar = new Star(0, Math.random() * EngineInstance.windowRect.height, Math.random());
      } // if
    } else {
      this.shootingStar[0] += 500 * dt;
      this.shootingStar[1] += 300 * dt;
      if (this.shootingStar[0] > EngineInstance.windowRect.width) {
        this.shootingStar = undefined;
      } // if
    } // if

    for (i = 0; i < numStars; i++) {
      var star = this.stars[i];
      star.animate(delta);
    } // for
  };

  /**
   * Draw the background
   * @function
   * @override
   * @param {CanvasContext} ctx Rendering context
   * @param {Rectangle} area The area to draw the background on
   * @returns {void}

   */
  this.draw = function (ctx, area) {
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(area.pos[0], area.pos[1], area.width, area.height);
    for (i = 0; i < numStars; i++) {
      var star = this.stars[i];
      if (this.cartoonify) {
        star.drawCartoon(ctx);
      } else {
        star.draw(ctx);
      } // if
    } // for

    if (this.shootingStar) {
      if (this.cartoonify) {
        this.shootingStar.drawCartoon(ctx);
      } else {
        this.shootingStar.draw(ctx);
      } // if
    } // if
    ctx.restore();
  }
}
StarryBackground.prototype = new Background();

/**
 * @class A star
 * @constructor
 * @param {Number} x X-coordinate
 * @param {Number} y Y-coordinate
 * @param {Number} i Intensity 0 to 1

 */
function Star(x, y, i) {

  /**
   * Star position
   * @field
   * @type Number
   * @default x

   */
  this.pos = math.v2.create([x, y]);

  /**
   * Numberensity 0.0 to 1.0
   * @field
   * @type Number
   * @default i

   */
  this.i = i;

  /**
   * Star radius
   * @field
   * @type Number
   * @default Random[2,6]

   */
  this.r = Math.floor(Math.random() * 4) + 2;

  /**
   * Animate this star over the give time delta
   * @function
   * @param {Number} delta Delta time in milliseconds
   * @returns {void}

   */
  this.animate = function (delta) {
    if (Math.random() < 0.005) {
      this.i = Math.random();
    } // if
  };

  /**
   * Draw the star as a pixel
   * @function
   * @param {CanvasContext} ctx Rendering context\
   * @returns {void}

   */
  this.draw = function (ctx) {
    ctx.fillStyle = "rgba(255, 255, 255, " + this.i + ")";
    ctx.fillRect(this.pos[0], this.pos[1], 1, 1);
  };

  /**
   * Draw the star as a cartoon styled star
   * @function
   * @param {CanvasContext} ctx Rendering context
   * @returns {void}

   */
  this.drawCartoon = function (ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, " + this.i + ")";
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.beginPath();
    ctx.moveTo(this.r, 0);
    for (var i = 0; i < 9; i++) {
      ctx.rotate(Math.PI / 5);
      if (i % 2 == 0) {
        ctx.lineTo((this.r / 0.525731) * 0.200811, 0);
      } else {
        ctx.lineTo(this.r, 0);
      } // if
    } // for
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
}
