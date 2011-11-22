/****************************
 * Game implementation
 * Mass Aggregate Engine Demo
 ****************************/

/**
 * All icons
 * @field
 * @constant
 * @type Object
 * @since 0.0.0
 */
var ICONS = {
	SELECT : "pickup.png",
	REMOVE : "remove.png",
	PARTICLES : "particles.png",
	ANCHOR : "anchor.png",
	ROPE : "rope.png",
	GRAVITY : "gravity.png",
	WIND : "wind.png",
	DRAG : "drag.png",
	INTER_COLLISION : "interCollision.png",
	COLLISION : "collision.png",
	SPRING : "spring.png",
	SPRING_ANCHORED : "springAnchored.png",
	BUNGEE : "rubber.png",
	BUNGEE_ANCHORED : "rubberAnchored.png",
	CABLE : "cable.png",
	ROD : "rod.png"
} 
 
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
 * @global Vector2
 * Last mouse move position
 */
var lastMouseMove = new Vector2();

/**
 * @global boolean
 * Is mouse cursor in screen
 */
var mouseInScreen = false;

/**
 * @global Vector2
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
function playButton_click() {
	if (running) {
		engineStop();
		btnPlay.src = "img/playButton.png";
	} else {
		engineStart();
		btnPlay.src = "img/pauseButton.png";
	} // if
}

/**
 * @eventHandler
 * Mouse move handler
 */
engine.addEventListener("mousemove", function(e) {
	var x = e.offsetX;
	var y = Y(e.offsetY);
	lastMouseMove.x = x;
	lastMouseMove.y = y;
	renderGame();
});

/**
 * @eventHandler
 * Mouse down handler
 */
engine.addEventListener("mousedown", function(e) {
	var x = e.offsetX;
	var y = Y(e.offsetY);

	tool.use(new Vector2(x, y));
});

/**
 * @eventHandler
 * Mouse over handler
 */
engine.addEventListener("mouseover", function(e) {
	mouseInScreen = true;
	renderGame();
});

/**
 * @eventHandler
 * Mouse out handler
 */
engine.addEventListener("mouseout", function(e) {
	mouseInScreen = false;
	renderGame();
});

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
 * @param Vector2 anchor The anchor to remove
 * @return Vector2 The removed anchor
 */
function removeAnchor(anchor) {
	for (i in anchors) {
		var a = anchors[i];
		if (a === anchor) {
			return anchors.splice(i, 1);
		} // if
	} // for
}

/**
 * @method
 * Gets the first anchor within the specified radius
 * @param Vector2 point The point at which to look
 * @param float radius The search radius
 * @return Vector2 The anchor, undefined if none were found
 */
function getFirstAnchorWithin(point, radius) {
	for (i in anchors) {
		var anchor = anchors[i];
		if (anchor.sub(point).getMagnitude() <= radius) {
			return anchor;
		} // if
	} // for
	return undefined;
}
 
/**
 * @function
 * Initialize game elements here
 * @return void
 */
function initGame() {
	particleWorld = new ParticleWorld();
	tool = SelectTool.instance;
	renderGame();
}
 
  /**
  * @function
  * Initialize game start here
  * @return void
  */
 function startGame() {

 }
 
/**
 * @function
 * Update all game elements
 * @param int delta Delta time since last update
 * @return void
 */
function updateGame(delta) {
	particleWorld.startFrame();
	particleWorld.runPhysics(delta);
}

/**
 * @function
 * Render a single frame
 * @return void
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	particleWorld.draw();
	
	for (i in anchors) {
		var anchor = anchors[i];
		ctx.drawImage(anchorImage, anchor.x - anchorImage.width / 2, anchor.y + anchorImage.height / 2);
	} // for
	
	/*
	ctx.fillText("Global Forces: " + particleWorld.globalForceGenerators, 10, 10);
	ctx.fillText("Num Particles: " + particleWorld.particles.length, 10, 20);
	ctx.fillText("Num Force Generators: " + particleWorld.forceRegistry.entries.length, 10, 30);
	ctx.fillText("Num Contact Generators: " + particleWorld.contactGenerators.length, 10, 40);
	*/
	
	if (mouseInScreen) {
		tool.drawHandles(lastMouseMove);
	} // if
}

/** 
 * @function
 * Highlights all particles around a point
 * @param Vector2 point The point
 * @param float radius The radius around the point
 */
function highlightParticles(point, radius) {
	for (i in particleWorld.particles) {
		var particle = particleWorld.particles[i];
		if (particle.isCloseToPoint(point, radius)) {
			highlightPoint(particle.pos, radius);
		} // if
	} // for
}

/** 
 * @function
 * Highlights all anchors around a point
 * @param Vector2 point The point
 * @param float radius The radius around the point
 */
function highlightAnchors(point, radius) {
	for (i in anchors) {
		var anchor = anchors[i];
		if (anchor.sub(point).getMagnitude() <= radius) {
			highlightPoint(anchor, radius);
		} // if
	} // for
}

/** 
 * @function
 * Highlights a single particle
 * @param Vector2 point The point
 * @param float radius The radius around the point
 */
function highlightPoint(point, radius) {
	ctx.beginPath();
	ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
	ctx.stroke();
}

/**
 * @function
 * Stop the game
 * @return void
 */
function stopGame() {
	//fadeOut("Stopped");
}

/**
 * @function
 * Fade out screen
 * @param string message The message to display
 * @return void
 */
function fadeOut(message) {
	ctx.save();
	ctx.globalAlpha = 0.3;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.globalAlpha = 1;
	ctx.fillStyle = "white";
	
	var stoppedText = message;
	ctx.fillText(stoppedText, 
		(windowRect.width - ctx.measureText(stoppedText).width) / 2, windowRect.height / 2
	);
	ctx.restore();
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
	 * @param string icon The icon filename
	 * @return void
	 */
	this.setIcon = function(icon) {
		this.icon = Resources.loadImage(icon);
	}
	
	/**
	 * Sets the cursor
	 * @function
	 * @param {string} cursor The name of the cursor
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setCursor = function(cursor) {
		this.cursor = cursor;
	}
	
	/**
	 * Call this on tool activation
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.activate = function() {
		canvas.style.setProperty("cursor", this.cursor);
	}
	
	/**
	 * Call this on tool deactivation
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.deactivate = function() {
		canvas.style.removeProperty("cursor");
	}
	
	/** 
	 * @method
	 * @abstract
	 * Use this tool at position x, y
	 * @param Vector2 point Point in world coordinates
	 * @return void
	 */
	this.use = function(point) {
	}
	
	/**
	 * @method
	 * Draws the tool icon at the specified point
	 * @param Vector2 point The point to draw the icon at
	 * @return void
	 */
	this.drawIcon = function(point) {
		var x = 5;
		var y = windowRect.height - 5;
		if (point.x > x + this.icon.width) {
			ctx.drawImage(this.icon, x, y);
		} else {
			ctx.save();
			ctx.globalAlpha = 0.5;
			ctx.drawImage(this.icon, x, y);
			ctx.restore();
		} // if
	}
	
	/** 
	 * @method
	 * @abstract
	 * Draw tool visual helpers
	 * @param Vector2 point Point in world coordinates
	 * @return void
	 */
	this.drawHandles = function(point) {
	}
	
	/** 
	 * @method
	 * @abstract
	 * Cancel this tool
	 * TODO: link into keyboard ESC to cancel tool
	 * @return void
	 */
	this.cancel = function() {
	}
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
	this.use = function(point) {
		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		if (particle) {
			console.log("Selected particle %o", particle);
			function mouseMoveListener(e) {
				var x = e.offsetX;
				var y = Y(e.offsetY);
				particle.pos.x = x;
				particle.pos.y = y;
			}
			
			engine.addEventListener("mousemove", mouseMoveListener);
			engine.addEventListener("mouseup", function() {
				engine.removeEventListener("mouseup", this);
				engine.removeEventListener("mousemove", mouseMoveListener);
			});
		} // if
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		highlightParticles(point, this.selectRadius);
		this.drawIcon(point);
	}
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
	this.use = function(point) {
		var particle = particleWorld.getFirstParticleWithin(
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
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		highlightAnchors(point, this.selectRadius);
		highlightParticles(point, this.selectRadius);
		this.drawIcon(point);
	}
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
	this.use = function(point) {
		var particle = new Particle();
		//particle.setMass(1 + Math.random() * 10);
		particle.setMass(1);
		particle.pos = point.clone();
		particleWorld.addParticle(particle);
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		this.drawIcon(point);
	}
}
CreateParticleTool.prototype = new Tool();
CreateParticleTool.instance = new CreateParticleTool();

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
	this.use = function(point) {
		var anchor = point.clone();
		anchors.push(anchor);
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		this.drawIcon(point);
	}
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
	this.use = function(point) {
		var particle = particleWorld.getFirstParticleWithin(
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
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		highlightParticles(point, this.selectRadius);
		
		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		this.drawIcon(point);
		if (!particle) {
			ctx.fillText("Add global gravity", point.x + 20, point.y);
		} // if
	}
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
	this.use = function(point) {
		var particle = particleWorld.getFirstParticleWithin(
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
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		highlightParticles(point, this.selectRadius);
		
		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		this.drawIcon(point);
		if (!particle) {
			ctx.fillText("Add global drag", point.x + 20, point.y);
		} // if
	}
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
	this.use = function(point) {
		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		if (particle) {
			ParticleForceGeneratorFactory.createWind(
				particleWorld.forceRegistry, particle, new Vector2(4, 0)
			);
		} else {
			particleWorld.addGlobalForce(
				new ParticleWindForceGenerator(new Vector2(4, 0))
			);
		} // if
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		highlightParticles(point, this.selectRadius);
		
		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		this.drawIcon(point);
		if (!particle) {
			ctx.fillText("Add global wind", point.x + 20, point.y);
		} // if
	}
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
	this.use = function(point) {
		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		if (particle) {
			if (this.p1) {
				if (this.p1 === particle) {
					this.p1 = undefined;
					return;
				} // if
				
				this.createForce(this.p1, particle);
				this.p1 = undefined;
			} else {
				this.p1 = particle;
			};
		} // if
	}
	
	/**
	 * @method
	 * @abstract
	 * Creates the actual force
	 * @return void
	 */
	this.createForce = function(p1, particle) {
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		if (this.p1) {
			ctx.save();
			ctx.strokeStyle = "green";
			highlightPoint(this.p1.pos, this.selectRadius);
			
			ctx.strokeStyle = "lightgrey";
			ctx.beginPath();
			ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
			
			var p2 = particleWorld.getFirstParticleWithin(
				point, this.selectRadius
			);
			if (p2) {
				ctx.lineTo(p2.pos.x, p2.pos.y);
			} else {
				ctx.lineTo(point.x, point.y);
			} // if
			ctx.stroke();
			ctx.restore();
		} // if
		highlightParticles(point, this.selectRadius);
		this.drawIcon(point);
	}
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
	 * @field Vector2 
	 * Anchor the anchor
	 */
	this.anchor = undefined;
	
	/** 
	 * @method
	 * @override
	 * Creates a new particle
	 */
	this.use = function(point) {
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

		var particle = particleWorld.getFirstParticleWithin(
			point, this.selectRadius
		);
		
		if (particle) {
			this.createForce(this.anchor, particle);
			this.anchor = undefined;
		} // if
	}
	
	/**
	 * @method
	 * Creates the actual force
	 * @param Anchor anchor The anchor to connect
	 * @param Particle particle The particle to connect
	 * @return void
	 */
	this.createForce = function(anchor, particle) {
	}
	
	/** 
	 * @method
	 * @override
	 * Draws tool handles
	 */
	this.drawHandles = function(point) {
		if (this.anchor) {
			ctx.save();
			ctx.strokeStyle = "green";
			highlightPoint(this.anchor, this.selectRadius);
			
			ctx.strokeStyle = "darkgrey";
			ctx.beginPath();
			ctx.moveTo(this.anchor.x, this.anchor.y);
			
			var particle = particleWorld.getFirstParticleWithin(
				point, this.selectRadius
			);
			if (particle) {
				ctx.lineTo(particle.pos.x, particle.pos.y);
				ctx.stroke();
				highlightPoint(particle.pos, this.selectRadius);
			} else {
				ctx.lineTo(point.x, point.y);
				ctx.stroke();
			} // if
			ctx.restore();
		} else {
			highlightAnchors(point, this.selectRadius);
		} // if
		this.drawIcon(point);
	}
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
	this.createForce = function(p1, particle) {
		ParticleForceGeneratorFactory.createSpring(
			particleWorld.forceRegistry, p1, particle,  1, 1
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
	this.createForce = function(p1, particle) {
		var pointMass = 1;
		
		var dir = particle.pos.sub(p1.pos);
		var distance = dir.getMagnitude();
		dir.normalizeMutate();
		
		var prevParticle = p1;
		var partLength = distance / this.numParts;
		for (var i = 0; i < this.numParts - 1; i++) {
			var nextParticle = new Particle();
			nextParticle.setMass(pointMass);
			nextParticle.pos = dir.multScalar(
				partLength * (i + 1)
			);
			nextParticle.pos.addMutate(
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
	this.createForce = function(p1, particle) {
		ParticleForceGeneratorFactory.createBungee(
			particleWorld.forceRegistry, p1, particle,  1, 1
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
	 * @param Anchor anchor The anchor to connect
	 * @param Particle particle The particle to connect
	 * @return void
	 */
	this.createForce = function(anchor, particle) {
		ParticleForceGeneratorFactory.createAnchoredSpring(
			particleWorld.forceRegistry, particle, anchor,  1, 1
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
	 * @param Anchor anchor The anchor to connect
	 * @param Particle particle The particle to connect
	 * @return void
	 */
	this.createForce = function(anchor, particle) {
		ParticleForceGeneratorFactory.createAnchoredBungee(
			particleWorld.forceRegistry, particle, anchor,  1, 1
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
	this.createForce = function(p1, particle) {
		var distance = p1.pos.sub(particle.pos).getMagnitude();
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
	this.createForce = function(p1, particle) {
		var distance = p1.pos.sub(particle.pos).getMagnitude();
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
	this.use = function(point) {
		ParticleContactGeneratorFactory.createCollisionDetection(
			particleWorld, particleWorld.particles, 10
		);
	}
	
	/** 
	 * @method
	 * @override
	 * Draw tool visual helpers
	 */
	this.drawHandles = function(point) {
		this.drawIcon(point);
		ctx.fillText("Add global collsion detection", point.x + 20, point.y);
	}
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
	this.use = function(point) {
		var collisionBox = windowRect.shrink(0);
		ParticleContactGeneratorFactory.createCollisionBox(
			particleWorld, particleWorld.particles, collisionBox
		);
	}
	
	/** 
	 * @method
	 * @override
	 * Draw tool visual helpers
	 */
	this.drawHandles = function(point) {
		this.drawIcon(point);
		ctx.fillText("Add global collsion box", point.x + 20, point.y);
	}
}
CreateCollisionBoxTool.prototype = new Tool();
CreateCollisionBoxTool.instance = new CreateCollisionBoxTool();