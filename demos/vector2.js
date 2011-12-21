/**
 * @fileOverview 2D Vector Explorer
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

"use strict";

/**
 * @class Vector2 game implementation
 * @extends Engine
 * @since 0.0.0.4
 */
function Vector2Game() {

  /**
   * Super constructor
   */
  Engine.call(this);

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
   * @function
   * @override
   */
  this.initGame = function () {
    vectors.push(new Vector2(100, 10));
    vectors.push(new Vector2(10, 100));
    this.renderGame();

    this.addEventListener("mousemove", function (e) {
      var x = e.offsetX - this.windowRect.width / 2;
      var y = Y(e.offsetY) - this.windowRect.height / 2;
      var point = new Vector2(x, y);

      this.renderGame();
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

    this.addEventListener("mousedown", function (e) {
      var x = e.offsetX - this.windowRect.width / 2;
      var y = Y(e.offsetY) - this.windowRect.height / 2;

      var point = new Vector2(x, y);
      var vector = getFirstVectorWithin(point, 5);
      if (vector) {
        selectedVector = vector;
      } // if
    });

    this.addEventListener("mouseup", function (e) {
      if (selectedVector) {
        selectedVector = undefined;
      } // if
    });

    this.addEventListener("mouseover", function (e) {
      this.renderGame();
    });

    this.addEventListener("mouseout", function (e) {
      this.renderGame();
    });
  };

  /**
   * @function
   * @override
   */
  this.startGame = function () {
  };

  /**
   * @function
   * @override
   */
  this.updateGame = function (delta) {

  };

  /**
   * @function
   * @override
   */
  this.renderGame = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();

    this.ctx.strokeStyle = "grey";
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.windowRect.height / 2);
    this.ctx.lineTo(this.windowRect.width, this.windowRect.height / 2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.windowRect.width / 2, 0);
    this.ctx.lineTo(this.windowRect.width / 2, this.windowRect.height);
    this.ctx.stroke();

    this.ctx.translate(this.windowRect.width / 2, this.windowRect.height / 2);

    this.ctx.strokeStyle = "grey";
    this.ctx.fillStyle = "grey";
    this.drawVector(vectors[0], "v1");

    this.ctx.strokeStyle = "darkgrey";
    this.ctx.fillStyle = "darkgrey";
    this.drawVector(vectors[1], "v2");

    this.ctx.beginPath();
    var angle = Vector2.getAngle(vectors[0], vectors[1]);
    this.ctx.fillText("Angle: " + angle * 180 / Math.PI, 10, 10);

    var vSub = vectors[0].sub(vectors[1]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.fillStyle = "green";
    this.ctx.moveTo(vectors[0].x, vectors[0].y);
    this.ctx.lineTo(vSub.x, vSub.y);
    this.ctx.stroke();
    this.ctx.fillText("v1 - v2", vSub.x, vSub.y);

    var vSubO = vectors[1].sub(vectors[0]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "lightgreen";
    this.ctx.fillStyle = "lightgreen";
    this.ctx.moveTo(vectors[1].x, vectors[1].y);
    this.ctx.lineTo(vSubO.x, vSubO.y);
    this.ctx.stroke();
    this.ctx.fillText("v2 - v1", vSubO.x, vSubO.y);

    var vAdd = vectors[0].add(vectors[1]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.fillStyle = "blue";
    this.ctx.moveTo(vectors[0].x, vectors[0].y);
    this.ctx.lineTo(vAdd.x, vAdd.y);
    this.ctx.stroke();
    this.ctx.fillText("v1 + v2", vAdd.x, vAdd.y);

    var vAddO = vectors[1].add(vectors[0]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "lightblue";
    this.ctx.fillStyle = "lightblue";
    this.ctx.moveTo(vectors[1].x, vectors[1].y);
    this.ctx.lineTo(vAddO.x, vAddO.y);
    this.ctx.stroke();
    this.ctx.fillText("v2 + v1", vSubO.x, vSubO.y);

    this.ctx.restore();
  };

  /**
   * Gets the first anchor within the specified radius
   * @function
   * @param {Vector2} point The point at which to look
   * @param {float} radius The search radius
   * @returns {Vector2} The vector, undefined if none were found
   * @since 0.0.0
   */
  function getFirstVectorWithin(point, radius) {
    var i = vectors.length;
    while (i--) {
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
    this.ctx.save();
    this.ctx.translate(this.windowRect.width / 2, this.windowRect.height / 2);
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius, 0, constants.TWO_PI);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * @private
   * @function
   * Draws a single vector
   * @param {CanvasContext} ctx Rendering context
   * @param {Vector2} vector The vector to draw
   * @param {String} name The name of the vector
   * @returns {void}
   */
  this.drawVector = function (vector, name) {
    var width = constants.PARTICLE_WIDTH;
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(vector.x, vector.y);
    this.ctx.stroke();

    this.ctx.translate(vector.x, vector.y);
    this.ctx.fillRect(
      -width, -width, width * 2, width * 2
    );
    this.ctx.fillText(name, 10, 0);
    this.ctx.fillText(name, 10, 0);
    this.ctx.restore();
  };

  /**
   * @function
   * @override
   */
  this.stopGame = function () {

  };
}
;
Vector2Game.prototype = new Engine();

/**
 * Engine instance
 */
var vector2Game = new Vector2Game();
Engine.getInstance = function () {
  return vector2Game;
};