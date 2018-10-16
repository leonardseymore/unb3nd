/**
 * @fileOverview Rendering routines
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

/**
 * @class
 * @constructor
 * @extends ParticleWorldVisitor
 * @param {CanvasContext} ctx Rendering context
 * Particle world renderer vistor implementation

 */
function ParticleWorldRenderVisitor(ctx) {

	/**
	 * @super
	 * Super constructor
	 */
	ParticleWorldVisitor.call(this);

	/**
	 * Rendering context
	 * @field
	 * @type CanvasContext
	 */
	var ctx = ctx;

	/**
	 * @field ParticleWorld
	 * Currently visited particle world
	 */
	this.particleWorld = undefined;

	/**
	 * Determines if the given point is within the screen bounds
	 *
	 * @param {Array} point The point to test
	 * @returns {boolean} True if the point is inside the screen

	 */
	this.isPointInScreen = function (point) {
		return point[0] >= -constants.PARTICLE_HALF_WIDTH
			&& point[0] < EngineInstance.windowRect.width + constants.PARTICLE_HALF_WIDTH
			&& point[1] >= -constants.PARTICLE_HALF_WIDTH
			&& point[1] < EngineInstance.windowRect.height + constants.PARTICLE_HALF_WIDTH;
	}

	/**
	 * @method
	 * @override
	 * Visits the particle world
	 */
	this.visitWorld = function (world) {
		this.particleWorld = particleWorld;
	}

	/**
	 * @method
	 * @override
	 * Visits the particle
	 */
	this.visitParticle = function (particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		if (!this.isPointInScreen(particleScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.fillStyle = constants.PARTICLE_COLOR;
		ctx.translate(particleScreenPos[0], particleScreenPos[1]);
		var width = constants.PARTICLE_WIDTH;
		ctx.fillRect(
			-width, -width, width * 2, width * 2
		);
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the gravity force generator
	 */
	this.visitGravityForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var gravityVector = math.v2.multScalar(
			forceGenerator.gravitation,
			particle.getMass()
		);
		var gravityVectorScreenPos = windowVector(gravityVector);
		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(gravityVectorScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.GRAVITY_COLOR;
		ctx.beginPath();
		ctx.translate(particleScreenPos[0], particleScreenPos[1]);
		ctx.moveTo(0, 0);
		ctx.lineTo(gravityVectorScreenPos[0], gravityVectorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the wind force generator
	 */
	this.visitWindForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var windVector = math.v2.multScalar(
			forceGenerator.direction,
			particle.getMass()
		);
		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(windVector)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.WIND_COLOR;
		ctx.beginPath();
		ctx.translate(particleScreenPos[0], particleScreenPos[1]);
		ctx.moveTo(0, 0);
		ctx.lineTo(windVector[0], windVector[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the drag force generator
	 */
	this.visitDragForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var dragVector = forceGenerator.calculateForce(particle);
		var dragVectorScreenPos = windowVector(dragVector);

		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(dragVectorScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.DRAG_COLOR;
		ctx.beginPath();
		ctx.translate(particleScreenPos[0], particleScreenPos[1]);
		ctx.moveTo(0, 0);
		ctx.lineTo(dragVectorScreenPos[0], dragVectorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the spring force generator
	 */
	this.visitSpringForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var particleOtherScreenPos = worldToWindow(forceGenerator.particleOther.pos);

		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(particleOtherScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos[0], particleScreenPos[1]);
		ctx.lineTo(particleOtherScreenPos[0], particleOtherScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the anchored spring force generator
	 */
	this.visitAnchoredSpringForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var anchorScreenPos = worldToWindow(forceGenerator.anchor);

		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(anchorScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.ANCHORED_SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos[0], particleScreenPos[1]);
		ctx.lineTo(anchorScreenPos[0], anchorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the bungee force generator
	 */
	this.visitBungeeForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var particleOtherScreenPos = worldToWindow(forceGenerator.particleOther.pos);

		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(particleOtherScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.BUNGEE_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos[0], particleScreenPos[1]);
		ctx.lineTo(particleOtherScreenPos[0], particleOtherScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the anchored bungee force generator
	 */
	this.visitAnchoredBungeeForceGenerator = function (forceGenerator, particle) {
		var particleScreenPos = worldToWindow(particle.pos);
		var anchorScreenPos = worldToWindow(forceGenerator.anchor);

		if (!this.isPointInScreen(particleScreenPos)
			&& !this.isPointInScreen(anchorScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.ANCHORED_BUNGEE_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos[0], particleScreenPos[1]);
		ctx.lineTo(anchorScreenPos[0], anchorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the particle cable contact generator
	 */
	this.visitCableContactGenerator = function (contactGenerator) {
		var p1ScreenPos = worldToWindow(contactGenerator.particles[0].pos);
		var p2ScreenPos = worldToWindow(contactGenerator.particles[1].pos);

		if (!this.isPointInScreen(p1ScreenPos)
			&& !this.isPointInScreen(p2ScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.CABLE_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos[0], p1ScreenPos[1]);
		ctx.lineTo(p2ScreenPos[0], p2ScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the anchored particle cable contact generator
	 */
	this.visitAnchoredCableContactGenerator = function (contactGenerator) {
		var p1ScreenPos = worldToWindow(contactGenerator.particle.pos);
		var anchorScreenPos = worldToWindow(contactGenerator.anchor);

		if (!this.isPointInScreen(p1ScreenPos)
			&& !this.isPointInScreen(anchorScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.ANCHORED_CABLE_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos[0], p1ScreenPos[1]);
		ctx.lineTo(anchorScreenPos[0], anchorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the particle rod contact generator
	 */
	this.visitRodContactGenerator = function (contactGenerator) {
		var p1ScreenPos = worldToWindow(contactGenerator.particles[0].pos);
		var p2ScreenPos = worldToWindow(contactGenerator.particles[1].pos);

		if (!this.isPointInScreen(p1ScreenPos)
			&& !this.isPointInScreen(p2ScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.ROD_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos[0], p1ScreenPos[1]);
		ctx.lineTo(p2ScreenPos[0], p2ScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the anchored particle rod contact generator
	 */
	this.visitAnchoredRodContactGenerator = function (contactGenerator) {
		var p1ScreenPos = worldToWindow(contactGenerator.particle.pos);
		var anchorScreenPos = worldToWindow(contactGenerator.anchor);

		if (!this.isPointInScreen(p1ScreenPos)
			&& !this.isPointInScreen(anchorScreenPos)) {
			return;
		} // if

		ctx.save();
		ctx.strokeStyle = constants.ANCHORED_ROD_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos[0], p1ScreenPos[1]);
		ctx.lineTo(anchorScreenPos[0], anchorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the particle collision contact generator
	 */
	this.visitCollisionContactGenerator = function (contactGenerator) {
		ctx.save();
		ctx.strokeStyle = constants.COLLISION_DETECTION_COLOR;
		for (var i in contactGenerator.particles) {
			var particle = contactGenerator.particles[i];
			var particleScreenPos = worldToWindow(particle.pos);

			if (this.isPointInScreen(particleScreenPos)) {
				ctx.beginPath();
				ctx.arc(particleScreenPos[0], particleScreenPos[1], contactGenerator.collisionRadius * EngineInstance.ppm / 2, 0, constants.TWO_PI);
				ctx.stroke();
			} // if
		} // for
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the particle box collision contact generator
	 * TODO: ensure the transformation is made from world to screen space
	 */
	this.visitBoxCollisionContactGenerator = function (contactGenerator) {
		ctx.save();
		ctx.strokeStyle = constants.COLLISION_BOX_COLOR;
		var boxWorld = math.v2.create(contactGenerator.box.pos);
		var boxWindow = worldToWindow(boxWorld);
		ctx.strokeRect(boxWindow[0],
			boxWindow[1],
			contactGenerator.box.width * EngineInstance.ppm,
			contactGenerator.box.height * EngineInstance.ppm);
		ctx.strokeStyle = constants.COLLISION_BOX_TOL_COLOR;
		ctx.strokeRect(boxWindow[0] + contactGenerator.collisionRadius,
			boxWindow[1] + contactGenerator.collisionRadius,
			(contactGenerator.box.width - contactGenerator.collisionRadius * 2) * EngineInstance.ppm,
			(contactGenerator.box.height - contactGenerator.collisionRadius * 2) * EngineInstance.ppm);
		ctx.restore();
	}
}
ParticleWorldRenderVisitor.prototype = new ParticleWorldVisitor();
ParticleWorldRenderVisitor.instance = new ParticleWorldRenderVisitor();

/**
 * @class
 * @constructor
 * @extends WorldVisitor
 * World renderer vistor implementation
 * @param {CanvasContext} ctx Rendering context

 */
function WorldRenderVisitor(ctx) {

	/**
	 * @super
	 * Super constructor
	 */
	WorldVisitor.call(this);

	/**
	 * Rendering context
	 * @field
	 * @type CanvasContext
	 */
	var ctx = ctx;

	/**
	 * @field World
	 * Currently visited particle world
	 */
	this.rigidBodyWorld = undefined;

	/**
	 * @method
	 * @override
	 * Visits the world
	 */
	this.visitWorld = function (rigidBodyWorld) {
		this.rigidBodyWorld = rigidBodyWorld;
	}

	/**
	 * @method
	 * @override
	 * Visits the rigidBody
	 */
	this.visitRigidBody = function (rigidBody) {
		var screenPos = worldToWindow(rigidBody.pos);
		ctx.save();
		ctx.fillStyle = constants.PARTICLE_COLOR;
		ctx.translate(screenPos[0], screenPos[1]);
		var width = constants.PARTICLE_WIDTH;
		ctx.fillRect(
			-width, -width, width * 2, width * 2
		);
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the gravity force generator
	 */
	this.visitGravityForceGenerator = function (forceGenerator, rigidBody) {
		var screenPos = worldToWindow(rigidBody.pos);
		ctx.save();
		ctx.strokeStyle = constants.GRAVITY_COLOR;
		ctx.beginPath();
		ctx.translate(screenPos[0], screenPos[1]);
		ctx.moveTo(0, 0);
		var gravityVector = math.v2.multScalar(
			forceGenerator.gravitation,
			rigidBody.getMass()
		);
		var gravityVectorScreenPos = windowVector(gravityVector);
		ctx.lineTo(gravityVectorScreenPos[0], gravityVectorScreenPos[1]);
		ctx.stroke();
		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the spring force generator
	 */
	this.visitSpringForceGenerator = function (forceGenerator, rigidBody) {
		var screenPos = worldToWindow(rigidBody.getPointInWorldSpace(forceGenerator.connectionPoint));
		var screenPosOther = worldToWindow(forceGenerator.rigidBodyOther.getPointInWorldSpace(forceGenerator.connectionPointOther));

		ctx.save();

		ctx.strokeStyle = constants.SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(screenPos[0], screenPos[1]);
		ctx.lineTo(screenPosOther[0], screenPosOther[1]);
		ctx.stroke();

		ctx.restore();
	}

	/**
	 * @method
	 * @override
	 * Visits the spring force generator
	 */
	this.visitAeroControlForceGenerator = function (forceGenerator, rigidBody) {
		var screenPos = worldToWindow(rigidBody.getPointInWorldSpace(forceGenerator.position));

		var force = math.m2.multVector(forceGenerator.getTensor(), forceGenerator.windspeed);

		ctx.save();
		ctx.strokeStyle = constants.AERO_COLOR;
		ctx.beginPath();
		ctx.translate(screenPos[0], screenPos[1]);
		ctx.moveTo(0, 0);
		var forceScreenPos = windowVector(force);
		ctx.lineTo(forceScreenPos[0], forceScreenPos[1]);
		ctx.stroke();
		ctx.restore()
	}
}
WorldRenderVisitor.prototype = new WorldVisitor();
WorldRenderVisitor.instance = new WorldRenderVisitor();