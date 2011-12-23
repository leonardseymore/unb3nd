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
      new Vector3(0, 0, 1),
      new Vector3(-25, 50, 1),
      new Vector3(25, 50, 1)
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
    var pos = new Vector2(Number(document.getElementById("txtP1").value), Number(document.getElementById("txtP2").value));
    ctx.save();
    ctx.strokeStyle = "lightblue";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.restore();


    var offset = new Vector3(Number(document.getElementById("txtO1").value), Number(document.getElementById("txtO2").value));
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.restore();

    var theta = Number(document.getElementById("txtA1").value) * Math.PI;
    var transformationMatrix = new TransformationMatrix3(theta, pos.x, pos.y);
    var t1 = transformationMatrix.multVector(triangle[0].add(offset));
    var t2 = transformationMatrix.multVector(triangle[1].add(offset));
    var t3 = transformationMatrix.multVector(triangle[2].add(offset));

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
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
