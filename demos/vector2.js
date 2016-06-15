/**
 * @fileOverview 2D Vector Explorer
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class Vector2 game implementation
 * @extends Engine

 */
function Vector2Game() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * Vectors
   * @field
   * @type Array []
   * @default []

   */
  var vectors = [];

  /**
   * Currently selected vector
   * @field
   * @type Array
   * @default undefined

   */
  var selectedVector = undefined;

  /**
   * @function
   * @override
   */
  this.initGame = function () {
    vectors.push(math.v2.create([100, 10]));
    vectors.push(math.v2.create([10, 100]));
    this.renderGame();

    this.addEventListener("mousemove", function (e) {
      var x = e.offsetX - this.windowRect.width / 2;
      var y = e.offsetY - this.windowRect.height / 2;
      var point = math.v2.create([x, y]);

      this.renderGame();
      if (selectedVector) {
        selectedVector[0] = x;
        selectedVector[1] = y;
        return;
      } // if

      var vector = this.getFirstVectorWithin(point, 5);
      if (vector) {
        this.highlightPoint(vector, 5);
      } // if
    });

    this.addEventListener("mousedown", function (e) {
      var x = e.offsetX - this.windowRect.width / 2;
      var y = e.offsetY - this.windowRect.height / 2;

      var point = math.v2.create([x, y]);
      var vector = this.getFirstVectorWithin(point, 5);
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
    var angle = math.v2.getAngle(vectors[0], vectors[1]);
    this.ctx.fillText("Angle: " + angle * 180 / Math.PI, 10, 10);

    var vSub = math.v2.sub(vectors[0], vectors[1]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "green";
    this.ctx.fillStyle = "green";
    this.ctx.moveTo(vectors[0][0], vectors[0][1]);
    this.ctx.lineTo(vSub[0], vSub[1]);
    this.ctx.stroke();
    this.ctx.fillText("v1 - v2", vSub[0], vSub[1]);

    var vSubO = math.v2.sub(vectors[1], vectors[0]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "lightgreen";
    this.ctx.fillStyle = "lightgreen";
    this.ctx.moveTo(vectors[1][0], vectors[1][1]);
    this.ctx.lineTo(vSubO[0], vSubO[1]);
    this.ctx.stroke();
    this.ctx.fillText("v2 - v1", vSubO[0], vSubO[1]);

    var vAdd = math.v2.add(vectors[0], vectors[1]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.fillStyle = "blue";
    this.ctx.moveTo(vectors[0][0], vectors[0][1]);
    this.ctx.lineTo(vAdd[0], vAdd[1]);
    this.ctx.stroke();
    this.ctx.fillText("v1 + v2", vAdd[0], vAdd[1]);

    var vAddO = math.v2.add(vectors[1], vectors[0]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "lightblue";
    this.ctx.fillStyle = "lightblue";
    this.ctx.moveTo(vectors[1][0], vectors[1][1]);
    this.ctx.lineTo(vAddO[0], vAddO[1]);
    this.ctx.stroke();
    this.ctx.fillText("v2 + v1", vSubO[0], vSubO[1]);

    this.ctx.restore();
  };

  /**
   * Gets the first anchor within the specified radius
   * @function
   * @param {Array} point The point at which to look
   * @param {Number} radius The search radius
   * @returns {Array} The vector, undefined if none were found

   */
  this.getFirstVectorWithin = function(point, radius) {
    var i = vectors.length;
    while (i--) {
      var vector = vectors[i];
      if (this.debug && this.verbose) {
        console.debug("Testing if %s is close to %s", vector.toString(), point.toString());
      } // if
      if (math.v2.isWithin(vector, point, radius)) {
        return vector;
      } // if
    } // for
    return undefined;
  };

  /**
   * Highlights a single point
   * @function
   * @param {Array} point The point
   * @param {Number} radius The radius around the point
   * @returns {void}

   */
  this.highlightPoint = function(point, radius) {
    this.ctx.save();
    this.ctx.translate(this.windowRect.width / 2, this.windowRect.height / 2);
    this.ctx.beginPath();
    this.ctx.arc(point[0], point[1], radius, 0, constants.TWO_PI);
    this.ctx.stroke();
    this.ctx.restore();
  };

  /**
   * @private
   * @function
   * Draws a single vector
   * @param {Array} vector The vector to draw
   * @param {String} name The name of the vector
   * @returns {void}
   */
  this.drawVector = function (vector, name) {
    var width = constants.PARTICLE_WIDTH;
    this.ctx.save();

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(vector[0], vector[1]);
    this.ctx.stroke();

    this.ctx.translate(vector[0], vector[1]);
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
Vector2Game.prototype = new Engine();
EngineInstance = new Vector2Game();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};
