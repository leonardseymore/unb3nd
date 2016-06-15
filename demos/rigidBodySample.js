/**
 * @fileOverview Simple rigid body sample
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class Rigid body sample
 * @extends Engine

 */
function RidigBodyGame() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * Simulated world
   * @field
   * @type World
   * @default undefined

   */
  var rigidBodyWorld = undefined;

  /**
   * @field Particle world renderer
   * @type ParticleWorldRenderVisitor

   */
  var worldRenderer = undefined;

  /**
   * Rigid bodies
   * @field
   * @type Array
   * @default 10

   */
  var rigidBodies = [];
  var rigidBodyStructure = [
    math.v2.create([0, 0]),
    math.v2.create([-25, 50]),
    math.v2.create([25, 50])
  ];


  /**
   * @function
   * Initialize game elements here
   * @return void
   */
  this.initGame = function () {
    this.addEventListener("mousedrag", function (e) {
      if (e.button == 1) {
        EngineInstance.windowOffset[0] += e.deltaX;
        EngineInstance.windowOffset[1] += e.deltaY;
        this.renderGame();
      } // if
    });

    this.addEventListener("mousewheel", function (e) {
      if (e.wheelDelta > 0) {
        this.ppm *= 2;
      } else {
        this.ppm /= 2;
      } // if
      this.renderGame();
    });

    this.addEventListener("keydown", function (e) {
      switch (e.keyIdentifier) {
        case "Up" :
          this.windowOffset[1] -= 5;
          break;
        case "Right" :
          this.windowOffset[0] += 5;
          break;
        case "Down" :
          this.windowOffset[1] += 5;
          break;
        case "Left" :
          this.windowOffset[0] -= 5;
          break;
      }
      this.renderGame();
    });

    this.ppm = 1;
    this.targetFps = 1000;

    worldRenderer = new WorldRenderVisitor(this.ctx);
    rigidBodyWorld = new World();

    initRigidBody(0, 1, 5, 50, 25);
    initRigidBody(1, 1, 500, 150, 150);
    initRigidBody(2, 0, 1000, 200, 300);

    var i = rigidBodies.length;
    while(i--) {
      var rigidBody = rigidBodies[i];
      rigidBodyWorld.addRigidBody(rigidBody);
    } // for

    ForceGeneratorFactory.createGravity(
      rigidBodyWorld.forceRegistry, rigidBodies[1]
    );
    ForceGeneratorFactory.createGravity(
      rigidBodyWorld.forceRegistry, rigidBodies[0]
    );

    ForceGeneratorFactory.createSpring(
      rigidBodyWorld.forceRegistry, rigidBodies[0], math.v2.create([0, 10]),
      rigidBodies[1], math.v2.create(),
      0.05, 1);

    ForceGeneratorFactory.createSpring(
      rigidBodyWorld.forceRegistry, rigidBodies[1], math.v2.create([0, 40]),
      rigidBodies[2], math.v2.create([0, 50]),
      0.5, 0.1);

    this.renderGame();
  };

  /**
   * Initializes the rigid body
   * @function
   * @param {int} index The index of the rigid body to initialize
   * @param {Number} mass The mass to use
   * @param {Number} inertia The inertia to use
   * @param {Number} x The x position of the body
   * @param {Number} y The y position of the body
   * @returns {void}

   */
  function initRigidBody(index, mass, inertia, x, y) {
    rigidBodies[index] = new RigidBody(mass, inertia);
    rigidBodies[index].pos[0] = X(x);
    rigidBodies[index].pos[1] = Y(y);
    rigidBodies[index].angularDamping = 0.5;
    rigidBodies[index].calculateDerivedData();
  }

  /**
   * @function
   * Initialize game start here
   * @return void
   */
  this.startGame = function () {
  };

  /**
   * @function
   * Update all game elements
   * @param {Number} delta Delta time since last update
   * @return void
   */
  this.updateGame = function (delta) {
    rigidBodyWorld.update(delta);
  };

  /**
   * @function
   * Render a single frame
   * @return void
   */
  this.renderGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rigidBodyWorld.accept(worldRenderer);

    this.drawRigidBody(rigidBodies[0], "green");
    this.drawRigidBody(rigidBodies[1], "red");
    this.drawRigidBody(rigidBodies[2], "blue");

    ctx.fillText("FPS: " + this.avgFps, 10, EngineInstance.windowRect.height - 10);
  };

  /**
   * Draws the rigid body
   * @function
   * @param {RigidBody} rigidBody The rigid body to draw
   * @param {String} strokeStyle The style to use
   * @returns {void}

   */
  this.drawRigidBody = function(rigidBody, strokeStyle) {
    var ctx = this.ctx;

    var t1 = worldToWindow(rigidBody.getPointInWorldSpace(rigidBodyStructure[0]));
    var t2 = worldToWindow(rigidBody.getPointInWorldSpace(rigidBodyStructure[1]));
    var t3 = worldToWindow(rigidBody.getPointInWorldSpace(rigidBodyStructure[2]));

    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(t1[0], t1[1]);
    ctx.lineTo(t2[0], t2[1]);
    ctx.lineTo(t3[0], t3[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };
}
RidigBodyGame.prototype = new Engine();
EngineInstance = new RidigBodyGame();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};