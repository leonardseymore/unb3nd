/**
 * @fileOverview 2D Matrix Explorer
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.3
 */

"use strict";

/**
 * @class Matrix2 game implementation
 * @extends Engine
 * @since 0.0.0.4
 */
function Matrix2Game() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * @field Triangular structure
   * @type Array
   * @since 0.0.0.4
   */
  var triangle = undefined;

  /**
   * @function
   * @override
   */
  this.initGame = function() {
    triangle = [
      math.v3.create(0, 0, 1),
      math.v3.create(-25, 50, 1),
      math.v3.create(25, 50, 1)
    ];

    var elements = document.getElementsByTagName("input");
    var i = elements.length;
    while(i--) {
      var input = elements.item(i);
      // scope correction function
      input.onchange = function() {
        EngineInstance.renderGame();
      };
    } // for
    this.renderGame();
  };

  /**
   * @function
   * @override
   */
  this.renderGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pos = math.v2.create([Number(document.getElementById("txtP1").value),
      Number(document.getElementById("txtP2").value)]);
    ctx.save();
    ctx.strokeStyle = "lightblue";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(pos[0], pos[1]);
    ctx.stroke();
    ctx.restore();


    var offset = math.v2.create([Number(document.getElementById("txtO1").value),
      Number(document.getElementById("txtO2").value)]);
    ctx.save();
    ctx.translate(offset[0], offset[1]);
    ctx.restore();

    var theta = Number(document.getElementById("txtA1").value) * Math.PI;
    var transformationMatrix = math.m3.createTransform2(theta, pos[0], pos[1]);
    var t1 = math.m3.multVector2(
      transformationMatrix,
      math.v2.add(triangle[0], offset)
    );
    var t2 = math.m3.multVector2(
      transformationMatrix,
      math.v2.add(triangle[1], offset)
    );
    var t3 = math.m3.multVector2(
      transformationMatrix,
      math.v2.add(triangle[2], offset)
    );

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(t1[0], t1[1]);
    ctx.lineTo(t2[0], t2[1]);
    ctx.lineTo(t3[0], t3[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };
}
Matrix2Game.prototype = new Engine();
EngineInstance = new Matrix2Game();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};
