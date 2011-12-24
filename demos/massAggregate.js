/****************************
 * Game implementation
 * Mass Aggregate Engine Demo
 ****************************/

"use strict";

/**
 * All icons
 * @field
 * @constant
 * @type Object
 * @since 0.0.0
 */
var ICONS = {
  SELECT:"pickup.png",
  REMOVE:"remove.png",
  PARTICLES:"particles.png",
  PARTICLE_BOMB:"particleBomb.png",
  ANCHOR:"anchor.png",
  ROPE:"rope.png",
  GRAVITY:"gravity.png",
  WIND:"wind.png",
  DRAG:"drag.png",
  INTER_COLLISION:"interCollision.png",
  COLLISION:"collision.png",
  SPRING:"spring.png",
  SPRING_ANCHORED:"springAnchored.png",
  BUNGEE:"rubber.png",
  BUNGEE_ANCHORED:"rubberAnchored.png",
  CABLE:"cable.png",
  CABLE_ANCHORED:"cableAnchored.png",
  ROD:"rod.png",
  ROD_ANCHORED:"rodAnchored.png"
};

/**
 * @class Mass aggreagte game implementation
 * @extends Engine
 * @since 0.0.0.4
 */
function MassAggregateGame() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * @field
   * @type FancyMouse
   * @since 0.0.0.4
   */
  this.mouse = undefined;

  /**
   * @field Particle world renderer
   * @type ParticleWorldRenderVisitor
   * @since 0.0.0.4
   */
  this.particleWorldRenderer = undefined;

  /**
   * @function
   * @override
   */
  this.initGame = function () {
    this.particleWorldRenderer = new ParticleWorldRenderVisitor(this.ctx);
    this.mouse = new FancyMouse();
    this.ppm = 1;
    this.targetFps = 64;

    this.addEventListener("mousemove", function (e) {
      var x = e.offsetX;
      var y = e.offsetY;

      lastMouseMoveScreen[0] = x;
      lastMouseMoveScreen[1] = y;

      lastMouseMoveWorld[0] = x;
      lastMouseMoveWorld[1] = Y(y);

      this.renderGame();
    });

    this.addEventListener("mousedown", function (e) {
      var x = e.offsetX;
      var y = e.offsetY;

      tool.use(math.v2.create([x, y]));
    });

    this.addEventListener("mouseover", function () {
      mouseInScreen = true;
      this.renderGame();
    });

    this.addEventListener("mouseout", function () {
      mouseInScreen = false;
      this.renderGame();
    });

    this.addEventListener("mousewheel", function (e) {
      if (e.wheelDelta > 0) {
        this.ppm *= 2;
      } else {
        this.ppm /= 2;
      } // if
      this.renderGame();
    });

    particleWorld = new ParticleWorld();
    tool = SelectTool.instance;
    this.renderGame();
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
    this.mouse.update(delta);
    particleWorld.startFrame();
    particleWorld.runPhysics(delta);
  };

  /**
   * @function
   * @override
   */
  this.renderGame = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    particleWorld.accept(this.particleWorldRenderer);

    var i = anchors.length;
    while (i--) {
      var anchor = anchors[i];
      var anchorScreenPos = window(anchor);
      ctx.drawImage(anchorImage, anchorScreenPos[0] - anchorImage.width / 2, anchorScreenPos[1] - anchorImage.height / 2);
    } // for

    if (this.debug) {
      ctx.fillText("Global Forces: " + particleWorld.globalForceGenerators, 10, Y(90));
      ctx.fillText("Num Particles: " + particleWorld.particles.length, 10, Y(80));
      ctx.fillText("Num Force Generators: " + particleWorld.forceRegistry.entries.length, 10, Y(70));
      ctx.fillText("Num Contact Generators: " + particleWorld.contactGenerators.length, 10, Y(60));
      ctx.fillText("Mouse Screen: (" + lastMouseMoveScreen[0] + "," + lastMouseMoveScreen[1] + ")", 10, Y(50));
      ctx.fillText("Mouse World: (" + lastMouseMoveWorld[0] + "," + lastMouseMoveWorld[1] + ")", 10, Y(40));
      ctx.fillText("Pixels Per Meter: " + this.ppm, 10, Y(30));
      ctx.fillText("FPS: " + this.avgFps, 10, Y(20));
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.translate(10, Y(10));

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -3);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.ppm, 0);
      ctx.lineTo(this.ppm, -3);
      ctx.stroke();
      ctx.restore();

      ctx.moveTo(0, 0);
      ctx.lineTo(this.ppm, 0);
      ctx.stroke();
      ctx.restore();
    } // if

    if (mouseInScreen) {
      tool.drawHandles(lastMouseMoveScreen, lastMouseMoveWorld);
    } // if

    //this.mouse.draw(ctx);
  };
}
MassAggregateGame.prototype = new Engine();
EngineInstance = new MassAggregateGame();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};

/**
 * @global ParticleWorld
 * Physically simulated particle world
 */
var particleWorld;

/**
 * @global Tool
 * Currently selected tool
 */
var tool;

/**
 * @global Array
 * Last mouse move screen position
 */
var lastMouseMoveScreen = math.v2.create();

/**
 * @global Array
 * Last mouse move world position
 */
var lastMouseMoveWorld = math.v2.create();

/**
 * @global boolean
 * Is mouse cursor in screen
 */
var mouseInScreen = false;

/**
 * @global Array []
 * All anchors
 */
var anchors = [];

/**
 * @global Image
 * Anchor image
 */
var anchorImage = Resources.loadImage("anchor16.png");

/**
 * Play button click event handler
 */
function btnPlay_click(btnPlay) {
  if (EngineInstance.running) {
    EngineInstance.engineStop();
    btnPlay.src = Resources.configuration.IMG_PATH + "playButton.png";
  } else {
    EngineInstance.engineStart();
    btnPlay.src = Resources.configuration.IMG_PATH + "pauseButton.png";
  } // if
}

/**
 * @function
 * Enables the supplied tool
 * @return void
 */
function enableTool(t) {
  if (tool) {
    tool.deactivate();
  } // if

  tool = t;
  tool.activate();
}

/**
 * @function
 * Removes the specified anchor
 * @param {Array} anchor The anchor to remove
 * @returns {void}
 */
function removeAnchor(anchor) {
  var i = anchors.length;
  while (i--) {
    var a = anchors[i];
    if (a === anchor) {
      anchors.splice(i, 1);
      break;
    } // if
  } // for
}

/**
 * @method
 * Gets the first anchor within the specified radius
 * @param {Array} point The point at which to look
 * @param {Number} radius The search radius
 * @return {Array} The anchor, undefined if none were found
 */
function getFirstAnchorWithin(point, radius) {
  var i = anchors.length;
  while (i--) {
    var anchor = anchors[i];
    var anchorScreenPos = window(anchor);
    if (math.v2.isWithin(anchorScreenPos, point, radius)) {
      return anchor;
    } // if
  } // for
  return undefined;
}

/**
 * @function
 * Highlights all particles around a point
 * @param {Array} point The point
 * @param {Number} radius The radius around the point
 * @returns {void}
 */
function highlightParticles(point, radius) {
  var i = particleWorld.particles.length;
  while (i--) {
    var particle = particleWorld.particles[i];
    var particleScreenPos = window(particle.pos);
    if (math.v2.isWithin(point, particleScreenPos, radius)) {
      highlightPoint(particleScreenPos, radius);
    } // if
  } // for
}

/**
 * @function
 * Highlights all anchors around a point
 * @param {Array} point The point
 * @param {Number} radius The radius around the point
 * @returns {void}
 */
function highlightAnchors(point, radius) {
  var i = anchors.length;
  while (i--) {
    var anchor = anchors[i];
    var anchorScreenPos = window(anchor);
    if (math.v2.isWithin(point, anchorScreenPos, radius)) {
      highlightPoint(anchorScreenPos, radius);
    } // if
  } // for
}

/**
 * @function
 * Highlights a single particle
 * @param {Array} point The point
 * @param {Number} radius The radius around the point
 * @returns {void}
 */
function highlightPoint(point, radius) {
  var ctx = EngineInstance.ctx;
  ctx.beginPath();
  ctx.arc(point[0], point[1], radius, 0, constants.TWO_PI);
  ctx.stroke();
}

/**
 * @class
 * @constructor
 * @abstract
 * Base class for all tools
 */
function Tool() {

  /**
   * @field Image
   * Tool icon
   */
  this.icon = undefined;

  /**
   * CSS cursor to be used with this tool
   * @field
   * @type string
   * @default "default"
   * @since 0.0.0
   */
  this.cursor = "default";

  /**
   * @method
   * Sets the icon filename
   * @param {String} icon The icon filename
   * @returns {void}
   */
  this.setIcon = function (icon) {
    this.icon = Resources.loadImage(icon);
  };

  /**
   * Sets the cursor
   * @function
   * @param {String} cursor The name of the cursor
   * @returns {void}
   * @since 0.0.0
   */
  this.setCursor = function (cursor) {
    this.cursor = cursor;
  };

  /**
   * Call this on tool activation
   * @function
   * @returns {void}
   * @since 0.0.0
   */
  this.activate = function () {
    EngineInstance.canvas.style.setProperty("cursor", this.cursor);
  };

  /**
   * Call this on tool deactivation
   * @function
   * @returns {void}
   * @since 0.0.0
   */
  this.deactivate = function () {
    EngineInstance.canvas.style.removeProperty("cursor");
  };

  /**
   * @method
   * @abstract
   * Use this tool at position x, y
   * @param {Array} point Point in screen coordinates
   * @returns {void}
   */
  this.use = function (point) {
  };

  /**
   * @method
   * Draws the tool icon at the specified point
   * @param {Array} point The point to draw the icon at
   * @returns {void}
   */
  this.drawIcon = function (point) {
    var ctx = EngineInstance.ctx;
    var icon = this.icon;

    var x = 5;
    var y = 5;
    if (point[0] > x + icon.width) {
      ctx.drawImage(icon, x, y);
    } else {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.drawImage(icon, x, y);
      ctx.restore();
    } // if
  };

  /**
   * @method
   * @abstract
   * Draw tool visual helpers
   * @param {Array} point Point in screen coordinates
   * @returns {void}
   */
  this.drawHandles = function (point) {
  };

  /**
   * @method
   * @abstract
   * Cancel this tool
   * TODO: link into keyboard ESC to cancel tool
   * @returns {void}
   */
  this.cancel = function () {
  };
}

/**
 * @class
 * @constructor
 * @extends Tool
 * Selection tool
 */
function SelectTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.SELECT);

  /**
   * Set the tool's cursor
   */
  this.setCursor("pointer");

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @method
   * @override
   * Makes a selection
   */
  this.use = function (point) {
    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      if (EngineInstance.debug) {
        console.debug("Selected particle %o", particle);
      } // if

      var mouseMoveListener = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var newWindowPos = math.v2.create([x, y]);
        particle.pos = world(newWindowPos);
      };

      EngineInstance.addEventListener("mousemove", mouseMoveListener);
      EngineInstance.addEventListener("mouseup", function () {
        EngineInstance.removeEventListener("mouseup", this);
        EngineInstance.removeEventListener("mousemove", mouseMoveListener);
      });
    } // if
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    highlightParticles(point, this.selectRadius);
    this.drawIcon(point);
  };
}
SelectTool.prototype = new Tool();
SelectTool.instance = new SelectTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Remove tool
 */
function RemoveTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.REMOVE);

  /**
   * Set the tool's cursor
   */
  this.setCursor("pointer");

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      particleWorld.removeParticle(particle);
    } // if

    var anchor = getFirstAnchorWithin(
      point, this.selectRadius
    );

    if (anchor) {
      removeAnchor(anchor);
    } // if
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    highlightAnchors(point, this.selectRadius);
    highlightParticles(point, this.selectRadius);
    this.drawIcon(point);
  };
}
RemoveTool.prototype = new Tool();
RemoveTool.instance = new RemoveTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Creates a new particle
 */
function CreateParticleTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.PARTICLES);

  /**
   * Set the tool's cursor
   */
  this.setCursor("crosshair");

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var particle = new Particle();
    particle.setMass(1);
    particle.pos = world(point);
    particleWorld.addParticle(particle);
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    this.drawIcon(point);
  };
}
CreateParticleTool.prototype = new Tool();
CreateParticleTool.instance = new CreateParticleTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Creates a new particle bomb
 */
function CreateParticleBombTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.PARTICLE_BOMB);

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var i = Math.random() * 100;
    while (i-- > 0) {
      var particle = new Particle();
      particle.setMass(1);
      var windowPos = math.v2.create([
        Math.random() * EngineInstance.windowRect.width,
        Math.random() * EngineInstance.windowRect.height
      ]);
      particle.pos = world(windowPos);
      particleWorld.addParticle(particle);
    } // while
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    this.drawIcon(point);
  };
}
CreateParticleBombTool.prototype = new Tool();
CreateParticleBombTool.instance = new CreateParticleBombTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Creates a new anchor
 */
function CreateAnchorTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.ANCHOR);

  /**
   * Set the tool's cursor
   */
  this.setCursor("crosshair");

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var anchor = math.v2.create(point);
    anchors.push(world(anchor));
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    this.drawIcon(point);
  };
}
CreateAnchorTool.prototype = new Tool();
CreateAnchorTool.instance = new CreateAnchorTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create gravity tool
 */
function CreateGravityTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.GRAVITY);

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      ParticleForceGeneratorFactory.createGravity(
        particleWorld.forceRegistry, particle
      );
    } else {
      particleWorld.addGlobalForce(
        new ParticleGravityForceGenerator()
      );
    } // if
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    highlightParticles(point, this.selectRadius);

    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    this.drawIcon(point);
    if (!particle) {
      EngineInstance.ctx.fillText("Add global gravity", point[0] + 20, point[1]);
    } // if
  };
}
CreateGravityTool.prototype = new Tool();
CreateGravityTool.instance = new CreateGravityTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create drag tool
 */
function CreateDragTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.DRAG);

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      ParticleForceGeneratorFactory.createDrag(
        particleWorld.forceRegistry, particle, 0.5, 0.05
      );
    } else {
      particleWorld.addGlobalForce(
        new ParticleDragForceGenerator(0.5, 0.05)
      );
    } // if
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    highlightParticles(point, this.selectRadius);

    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    this.drawIcon(point);
    if (!particle) {
      EngineInstance.ctx.fillText("Add global drag", point[0] + 20, point[1]);
    } // if
  };
}
CreateDragTool.prototype = new Tool();
CreateDragTool.instance = new CreateDragTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create drag tool
 */
function CreateWindTool() {

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.WIND);

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @method
   * @override
   * Creates a new wind force generator
   */
  this.use = function (point) {
    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      ParticleForceGeneratorFactory.createWind(
        particleWorld.forceRegistry, particle, math.v2.create([4, 0])
      );
    } else {
      particleWorld.addGlobalForce(
        new ParticleWindForceGenerator(math.v2.create([4, 0]))
      );
    } // if
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    highlightParticles(point, this.selectRadius);

    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    this.drawIcon(point);
    if (!particle) {
      EngineInstance.ctx.fillText("Add global wind", point[0] + 20, point[1]);
    } // if
  };
}
CreateWindTool.prototype = new Tool();
CreateWindTool.instance = new CreateWindTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Tool to connect two particles
 */
function Particle2ParticleTool() {

  /**
   * @super
   * Super constructor
   */
  Tool.call(this);

  /**
   * Set the tool's cursor
   */
  this.setCursor("pointer");

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @field Particle
   * First particle
   */
  this.p1 = undefined;

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      var p1 = this.p1;
      if (p1) {
        if (p1 === particle) {
          p1 = undefined;
          return;
        } // if

        this.createForce(p1, particle);
        this.p1 = undefined;
      } else {
        this.p1 = particle;
      }
    } // if
  };

  /**
   * @method
   * @abstract
   * Creates the actual force
   * @return void
   */
  this.createForce = function (p1, particle) {
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    if (this.p1) {
      var ctx = EngineInstance.ctx;

      ctx.save();
      ctx.strokeStyle = "green";
      var p1WindowPos = window(this.p1.pos);
      highlightPoint(p1WindowPos, this.selectRadius);

      ctx.strokeStyle = "lightgrey";
      ctx.beginPath();
      ctx.moveTo(p1WindowPos[0], p1WindowPos[1]);

      var p2 = particleWorld.getFirstParticleWithinWindow(
        point, this.selectRadius
      );
      if (p2) {
        var p2WindowPos = window(p2.pos);
        ctx.lineTo(p2WindowPos[0], p2WindowPos[1]);
      } else {
        ctx.lineTo(point[0], point[1]);
      } // if
      ctx.stroke();
      ctx.restore();
    } // if
    highlightParticles(point, this.selectRadius);
    this.drawIcon(point);
  };
}
Particle2ParticleTool.prototype = new Tool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create anchored spring tool
 */
function Anchor2ParticleTool() {

  /**
   * @super
   * Super constructor
   */
  Tool.call(this);

  /**
   * Set the tool's cursor
   */
  this.setCursor("pointer");

  /**
   * @field float
   * Selection radius
   */
  this.selectRadius = 5;

  /**
   * @field Array
   * Anchor the anchor
   */
  this.anchor = undefined;

  /**
   * @method
   * @override
   * Creates a new particle
   */
  this.use = function (point) {
    var a = getFirstAnchorWithin(
      point, this.selectRadius
    );

    if (!this.anchor) {
      this.anchor = a;
      return;
    } // if

    if (this.anchor === a) {
      this.anchor = undefined;
      return;
    } // if

    var particle = particleWorld.getFirstParticleWithinWindow(
      point, this.selectRadius
    );

    if (particle) {
      this.createForce(this.anchor, particle);
      this.anchor = undefined;
    } // if
  };

  /**
   * @method
   * Creates the actual force
   * @param {Array} anchor The anchor to connect
   * @param {Particle} particle The particle to connect
   * @returns {void}
   */
  this.createForce = function (anchor, particle) {
  };

  /**
   * @method
   * @override
   * Draws tool handles
   */
  this.drawHandles = function (point) {
    if (this.anchor) {
      var ctx = EngineInstance.ctx;

      ctx.save();
      ctx.strokeStyle = "green";
      var anchorScreenPos = window(this.anchor);
      highlightPoint(anchorScreenPos, this.selectRadius);

      ctx.strokeStyle = "darkgrey";
      ctx.beginPath();
      ctx.moveTo(anchorScreenPos[0], anchorScreenPos[1]);

      var particle = particleWorld.getFirstParticleWithinWindow(
        point, this.selectRadius
      );
      if (particle) {
        var particleScreenPos = window(particle.pos);
        ctx.lineTo(particleScreenPos[0], particleScreenPos[1]);
        ctx.stroke();
        highlightPoint(particleScreenPos, this.selectRadius);
      } else {
        ctx.lineTo(point[0], point[1]);
        ctx.stroke();
      } // if
      ctx.restore();
    } else {
      highlightAnchors(point, this.selectRadius);
    } // if
    this.drawIcon(point);
  };
}
Anchor2ParticleTool.prototype = new Tool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create spring tool
 */
function CreateSpringTool() {

  /**
   * @super
   * Super constructor
   */
  Particle2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.SPRING);

  /**
   * @method
   * Creates the actual force
   * @return void
   */
  this.createForce = function (p1, particle) {
    ParticleForceGeneratorFactory.createSpring(
      particleWorld.forceRegistry, p1, particle, 1, 1
    );
  }
}
CreateSpringTool.prototype = new Particle2ParticleTool();
CreateSpringTool.instance = new CreateSpringTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Creates a new particle
 */
function CreateRopeTool(numParts) {

  /**
   * @super
   * Super constructor
   */
  Particle2ParticleTool.call(this);

  /**
   * Number of parts, including the ends
   */
  this.numParts = numParts || 10;

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.ROPE);

  /**
   * @method
   * Creates the actual force
   * @return void
   */
  this.createForce = function (p1, particle) {
    var pointMass = 1;

    var dir = math.v2.sub(particle.pos, p1.pos);
    var distance = math.v2.getMagnitude(dir);
    math.v2.normalizeMutate(dir);

    var prevParticle = p1;
    var partLength = distance / this.numParts;
    for (var i = 0; i < this.numParts - 1; i++) {
      var nextParticle = new Particle();
      nextParticle.setMass(pointMass);
      nextParticle.pos = math.v2.multScalar(
        dir,
        partLength * (i + 1)
      );
      math.v2.addMutate(
        nextParticle.pos,
        p1.pos
      );
      particleWorld.addParticle(nextParticle);

      ParticleContactGeneratorFactory.createCable(
        particleWorld, prevParticle, nextParticle, partLength, 0.4
      );
      prevParticle = nextParticle;
    } // for

    ParticleContactGeneratorFactory.createCable(
      particleWorld, prevParticle, particle, partLength, 0.4
    );
  }
}
CreateRopeTool.prototype = new Particle2ParticleTool();
CreateRopeTool.instance = new CreateRopeTool();

/**
 * @class
 * @constructor
 * @extends Particle2ParticleTool
 * Create bungee tool
 */
function CreateBungeeTool() {

  /**
   * @super
   * Super constructor
   */
  Particle2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.BUNGEE);

  /**
   * @method
   * @override CreateSpringTool#createForce(Particle, Particle)
   * Creates the actual force
   * @return void
   */
  this.createForce = function (p1, particle) {
    ParticleForceGeneratorFactory.createBungee(
      particleWorld.forceRegistry, p1, particle, 1, 1
    );
  }
}
CreateBungeeTool.prototype = new Particle2ParticleTool();
CreateBungeeTool.instance = new CreateBungeeTool();

/**
 * @class
 * @constructor
 * @extends Anchor2ParticleTool
 * Create anchored spring tool
 */
function CreateAnchoredSpringTool() {

  /**
   * @super
   * Super constructor
   */
  Anchor2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.SPRING_ANCHORED);

  /**
   * @method
   * @override
   * Creates the actual force
   * @param {Array} anchor The anchor to connect
   * @param {Particle} particle The particle to connect
   * @returns {void}
   */
  this.createForce = function (anchor, particle) {
    ParticleForceGeneratorFactory.createAnchoredSpring(
      particleWorld.forceRegistry, particle, anchor, 1, 1
    );
  }
}
CreateAnchoredSpringTool.prototype = new Anchor2ParticleTool();
CreateAnchoredSpringTool.instance = new CreateAnchoredSpringTool();

/**
 * @class
 * @constructor
 * @extends Anchor2ParticleTool
 * Create anchored bungee tool
 */
function CreateAnchoredBungeeTool() {

  /**
   * @super
   * Super constructor
   */
  Anchor2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.BUNGEE_ANCHORED);

  /**
   * @method
   * @override CreateSpringTool#createForce(Particle, Particle)
   * Creates the actual force
   * @param {Array} anchor The anchor to connect
   * @param {Particle} particle The particle to connect
   * @returns {void}
   */
  this.createForce = function (anchor, particle) {
    ParticleForceGeneratorFactory.createAnchoredBungee(
      particleWorld.forceRegistry, particle, anchor, 1, 1
    );
  }
}
CreateAnchoredBungeeTool.prototype = new Anchor2ParticleTool();
CreateAnchoredBungeeTool.instance = new CreateAnchoredBungeeTool();

/**
 * @class
 * @constructor
 * @extends Particle2ParticleTool
 * Create cable tool
 */
function CreateCableTool() {

  /**
   * @super
   * Super constructor
   */
  Particle2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.CABLE);

  /**
   * @method
   * Creates the actual force
   * @return void
   */
  this.createForce = function (p1, particle) {
    var distance = math.v2.getDistance(p1.pos, particle.pos);
    var resitution = 0.1;
    ParticleContactGeneratorFactory.createCable(
      particleWorld, p1, particle, distance, resitution
    );
  }
}
CreateCableTool.prototype = new Particle2ParticleTool();
CreateCableTool.instance = new CreateCableTool();

/**
 * @class
 * @constructor
 * @extends Anchor2ParticleTool
 * Create anchored cable tool
 * @since 0.0.0.3
 */
function CreateAnchoredCableTool() {

  /**
   * @super
   * Super constructor
   */
  Anchor2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.CABLE_ANCHORED);

  /**
   * @method
   * @override CreateSpringTool#createForce(Particle, Particle)
   * Creates the actual force
   * @param {Array} anchor The anchor to connect
   * @param {Particle} particle The particle to connect
   * @returns {void}
   */
  this.createForce = function (anchor, particle) {
    var distance = math.v2.getDistance(this.anchor, particle.pos);
    var resitution = 0.1;
    ParticleContactGeneratorFactory.createAnchoredCable(
      particleWorld, particle, anchor, distance, resitution
    );
  }
}
CreateAnchoredCableTool.prototype = new Anchor2ParticleTool();
CreateAnchoredCableTool.instance = new CreateAnchoredCableTool();

/**
 * @class
 * @constructor
 * @extends Particle2ParticleTool
 * Create rod tool
 */
function CreateRodTool() {

  /**
   * @super
   * Super constructor
   */
  Particle2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.ROD);

  /**
   * @method
   * Creates the actual force
   * @return void
   */
  this.createForce = function (p1, particle) {
    var distance = math.v2.getDistance(p1.pos, particle.pos);
    ParticleContactGeneratorFactory.createRod(
      particleWorld, p1, particle, distance
    );
  }
}
CreateRodTool.prototype = new Particle2ParticleTool();
CreateRodTool.instance = new CreateRodTool();

/**
 * @class
 * @constructor
 * @extends Anchor2ParticleTool
 * Create anchored cable tool
 * @since 0.0.0.3
 */
function CreateAnchoredRodTool() {

  /**
   * @super
   * Super constructor
   */
  Anchor2ParticleTool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.ROD_ANCHORED);

  /**
   * @method
   * @override CreateSpringTool#createForce(Particle, Particle)
   * Creates the actual force
   * @param {Array} anchor The anchor to connect
   * @param {Particle} particle The particle to connect
   * @returns {void}
   */
  this.createForce = function (anchor, particle) {
    var distance = math.v2.getDistance(this.anchor, particle.pos);
    var resitution = 0.1;
    ParticleContactGeneratorFactory.createAnchoredRod(
      particleWorld, particle, anchor, distance
    );
  }
}
CreateAnchoredRodTool.prototype = new CreateAnchoredRodTool();
CreateAnchoredRodTool.instance = new CreateAnchoredRodTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create collision detection tool
 */
function CreateCollisionDetectionTool() {

  /**
   * @super
   * Super constructor
   */
  Tool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.INTER_COLLISION);

  /**
   * @method
   * @override
   * Use this tool at position x, y
   */
  this.use = function (point) {
    ParticleContactGeneratorFactory.createCollisionDetection(
      particleWorld, particleWorld.particles, 10
    );
  };

  /**
   * @method
   * @override
   * Draw tool visual helpers
   */
  this.drawHandles = function (point) {
    this.drawIcon(point);
    EngineInstance.ctx.fillText("Add global collsion detection", point[0] + 20, point[1]);
  };
}
CreateCollisionDetectionTool.prototype = new Tool();
CreateCollisionDetectionTool.instance = new CreateCollisionDetectionTool();

/**
 * @class
 * @constructor
 * @extends Tool
 * Create collision box tool
 */
function CreateCollisionBoxTool() {

  /**
   * @super
   * Super constructor
   */
  Tool.call(this);

  /**
   * Set the tool's icon
   */
  this.setIcon(ICONS.COLLISION);

  /**
   * @method
   * @override
   * Use this tool at position x, y
   */
  this.use = function (point) {
    var collisionBox = EngineInstance.windowRect.shrink(0);
    ParticleContactGeneratorFactory.createCollisionBox(
      particleWorld, particleWorld.particles, collisionBox
    );
  };

  /**
   * @method
   * @override
   * Draw tool visual helpers
   */
  this.drawHandles = function (point) {
    this.drawIcon(point);
    EngineInstance.ctx.fillText("Add global collsion box", point[0] + 20, point[1]);
  };
}
CreateCollisionBoxTool.prototype = new Tool();
CreateCollisionBoxTool.instance = new CreateCollisionBoxTool();