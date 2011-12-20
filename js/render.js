/**
 * @fileOverview Rendering routines
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.3
 */

/**
 * @class
 * @constructor
 * Renderer is responsible for drawing various elements
 * @since 0.0.0.3
 */
function Renderer() {

  /**
	 * Renders the given particle world
	 * @function
	 * @param {ParticleWorld} particleWorld The particle world to render
	 * @returns {void}
	 * @since 0.0.0.3
	 */
  this.renderParticleWorld = function(particleWorld) {
    particleWorld.accept(ParticleWorldRenderVisitor.instance);
  }

  /**
	 * Renders the given rigid body world
	 * @function
	 * @param {World} rigidBodyWorld The world to render
	 * @returns {void}
	 * @since 0.0.0.3
	 */
  this.renderWorld = function(rigidBodyWorld) {
    rigidBodyWorld.accept(WorldRenderVisitor.instance);
  }
}
Renderer.instance = new Renderer();

/**
 * @class
 * @constructor
 * @extends ParticleWorldVisitor
 * Particle world renderer vistor implementation
 * @since 0.0.0.3
 */
function ParticleWorldRenderVisitor() {

  /**
	 * @super
	 * Super constructor
	 */
	ParticleWorldVisitor.call(this);

  /**
   * @field ParticleWorld
   * Currently visited particle world
   */
  this.particleWorld = undefined;

  /**
   * Determines if the given point is within the screen bounds
   *
   * @param {Vector2} point The point to test
   * @returns {boolean} True if the point is inside the screen
   * @since 0.0.0.4
   */
  this.isPointInScreen = function(point) {
    return point.x >= 0
           && point.x < windowRect.width
           && point.y >= 0
           && point.y < windowRect.height;
  }

	/**
	 * @method
	 * @override
	 * Visits the particle world
	 */
	this.visitWorld = function(world) {
    this.particleWorld = particleWorld;
	}

  /**
	 * @method
	 * @override
	 * Visits the particle
	 */
	this.visitParticle = function(particle) {
    var particleScreenPos = window(particle.pos);
    if (!this.isPointInScreen(particleScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.fillStyle = unb3nd.constants.PARTICLE_COLOR;
    ctx.translate(particleScreenPos.x, particleScreenPos.y);
    var width = unb3nd.constants.PARTICLE_WIDTH;
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
	this.visitGravityForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var gravityVector = forceGenerator.gravitation.multScalar(particle.getMass())
    var gravityVectorScreenPos = windowVector(gravityVector);
    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(gravityVectorScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.GRAVITY_COLOR;
		ctx.beginPath();
		ctx.translate(particleScreenPos.x, particleScreenPos.y);
		ctx.moveTo(0, 0);
		ctx.lineTo(gravityVectorScreenPos.x, gravityVectorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the wind force generator
	 */
	this.visitWindForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var windVector = forceGenerator.direction.multScalar(particle.getMass())
    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(windVector)) {
      return;
    } // if

    ctx.save();
		ctx.strokeStyle = unb3nd.constants.WIND_COLOR;
		ctx.beginPath();
		ctx.translate(particleScreenPos.x, particleScreenPos.y);
		ctx.moveTo(0, 0);
		ctx.lineTo(windVector.x, windVector.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the drag force generator
	 */
	this.visitDragForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var dragVector = forceGenerator.calculateForce(particle);
    var dragVectorScreenPos = windowVector(dragVector);

    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(dragVectorScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.DRAG_COLOR;
		ctx.beginPath();
		ctx.translate(particleScreenPos.x, particleScreenPos.y);
		ctx.moveTo(0, 0);
		ctx.lineTo(dragVectorScreenPos.x, dragVectorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the spring force generator
	 */
	this.visitSpringForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var particleOtherScreenPos = window(forceGenerator.particleOther.pos);

    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(particleOtherScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos.x, particleScreenPos.y);
		ctx.lineTo(particleOtherScreenPos.x, particleOtherScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the anchored spring force generator
	 */
	this.visitAnchoredSpringForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var anchorScreenPos = window(forceGenerator.anchor);

    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(anchorScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.ANCHORED_SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos.x, particleScreenPos.y);
		ctx.lineTo(anchorScreenPos.x, anchorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the bungee force generator
	 */
	this.visitBungeeForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var particleOtherScreenPos = window(forceGenerator.particleOther.pos);

    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(particleOtherScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.BUNGEE_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos.x, particleScreenPos.y);
		ctx.lineTo(particleOtherScreenPos.x, particleOtherScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the anchored bungee force generator
	 */
	this.visitAnchoredBungeeForceGenerator = function(forceGenerator, particle) {
    var particleScreenPos = window(particle.pos);
    var anchorScreenPos = window(forceGenerator.anchor);

    if (!this.isPointInScreen(particleScreenPos)
        && !this.isPointInScreen(anchorScreenPos)) {
      return;
    } // if

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.ANCHORED_BUNGEE_COLOR;
		ctx.beginPath();
		ctx.moveTo(particleScreenPos.x, particleScreenPos.y);
		ctx.lineTo(anchorScreenPos.x, anchorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the particle cable contact generator
	 */
	this.visitCableContactGenerator = function(contactGenerator) {
    var p1ScreenPos = window(contactGenerator.particles[0].pos);
    var p2ScreenPos = window(contactGenerator.particles[1].pos);

    if (!this.isPointInScreen(p1ScreenPos)
        && !this.isPointInScreen(p2ScreenPos)) {
      return;
    } // if

    ctx.save();
		ctx.strokeStyle = unb3nd.constants.CABLE_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos.x, p1ScreenPos.y);
		ctx.lineTo(p2ScreenPos.x, p2ScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the anchored particle cable contact generator
	 */
	this.visitAnchoredCableContactGenerator = function(contactGenerator) {
    var p1ScreenPos = window(contactGenerator.particle.pos);
    var anchorScreenPos = window(contactGenerator.anchor);

    if (!this.isPointInScreen(p1ScreenPos)
        && !this.isPointInScreen(anchorScreenPos)) {
      return;
    } // if

    ctx.save();
		ctx.strokeStyle = unb3nd.constants.ANCHORED_CABLE_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos.x, p1ScreenPos.y);
		ctx.lineTo(anchorScreenPos.x, anchorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the particle rod contact generator
	 */
	this.visitRodContactGenerator = function(contactGenerator) {
    var p1ScreenPos = window(contactGenerator.particles[0].pos);
    var p2ScreenPos = window(contactGenerator.particles[1].pos);

    if (!this.isPointInScreen(p1ScreenPos)
        && !this.isPointInScreen(p2ScreenPos)) {
      return;
    } // if

    ctx.save();
		ctx.strokeStyle = unb3nd.constants.ROD_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos.x, p1ScreenPos.y);
		ctx.lineTo(p2ScreenPos.x, p2ScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the anchored particle rod contact generator
	 */
	this.visitAnchoredRodContactGenerator = function(contactGenerator) {
    var p1ScreenPos = window(contactGenerator.particle.pos);
    var anchorScreenPos = window(contactGenerator.anchor);

    if (!this.isPointInScreen(p1ScreenPos)
        && !this.isPointInScreen(anchorScreenPos)) {
      return;
    } // if

    ctx.save();
		ctx.strokeStyle = unb3nd.constants.ANCHORED_ROD_COLOR;
		ctx.beginPath();
		ctx.moveTo(p1ScreenPos.x, p1ScreenPos.y);
		ctx.lineTo(anchorScreenPos.x, anchorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the particle collision contact generator
	 */
	this.visitCollisionContactGenerator = function(contactGenerator) {
    ctx.save();
		ctx.strokeStyle = unb3nd.constants.COLLISION_DETECTION_COLOR;
		for (i in contactGenerator.particles) {
			var particle = contactGenerator.particles[i];
      var particleScreenPos = window(particle.pos);

      if (this.isPointInScreen(particleScreenPos)) {
        ctx.beginPath();
        ctx.arc(particleScreenPos.x, particleScreenPos.y, contactGenerator.collisionRadius, 0, unb3nd.constants.TWO_PI);
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
	this.visitBoxCollisionContactGenerator = function(contactGenerator) {
    ctx.save();
		ctx.strokeStyle = unb3nd.constants.COLLISION_BOX_COLOR;
		ctx.strokeRect(contactGenerator.box.x, contactGenerator.box.y, contactGenerator.box.width, contactGenerator.box.height);
		ctx.strokeStyle = unb3nd.constants.COLLISION_BOX_TOL_COLOR;
		ctx.strokeRect(contactGenerator.box.x + contactGenerator.collisionRadius,
      contactGenerator.box.y + contactGenerator.collisionRadius,
      contactGenerator.box.width - contactGenerator.collisionRadius * 2,
      contactGenerator.box.height - contactGenerator.collisionRadius * 2);
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
 * @since 0.0.0.3
 */
function WorldRenderVisitor() {

  /**
	 * @super
	 * Super constructor
	 */
	WorldVisitor.call(this);

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
	this.visitWorld = function(rigidBodyWorld) {
    this.rigidBodyWorld = rigidBodyWorld;
	}

  /**
	 * @method
	 * @override
	 * Visits the rigidBody
	 */
	this.visitRigidBody = function(rigidBody) {
    var screenPos = window(rigidBody.pos);
		ctx.save();
		ctx.fillStyle = unb3nd.constants.PARTICLE_COLOR;
    ctx.translate(screenPos.x, screenPos.y);
    var width = unb3nd.constants.PARTICLE_WIDTH;
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
	this.visitGravityForceGenerator = function(forceGenerator, rigidBody) {
    var screenPos = window(rigidBody.pos);
		ctx.save();
		ctx.strokeStyle = unb3nd.constants.GRAVITY_COLOR;
		ctx.beginPath();
		ctx.translate(screenPos.x, screenPos.y);
		ctx.moveTo(0, 0);
		var gravityVector = forceGenerator.gravitation.multScalar(rigidBody.getMass())
    var gravityVectorScreenPos = windowVector(gravityVector);
		ctx.lineTo(gravityVectorScreenPos.x, gravityVectorScreenPos.y);
		ctx.stroke();
		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the spring force generator
	 */
	this.visitSpringForceGenerator = function(forceGenerator, rigidBody) {
    var screenPos = window(rigidBody.getPointInWorldSpace(forceGenerator.connectionPoint));
    var screenPosOther = window(forceGenerator.rigidBodyOther.getPointInWorldSpace(forceGenerator.connectionPointOther));

		ctx.save();

		ctx.strokeStyle = unb3nd.constants.SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(screenPos.x, screenPos.y);
		ctx.lineTo(screenPosOther.x, screenPosOther.y);
		ctx.stroke();

		ctx.restore();
	}

  /**
	 * @method
	 * @override
	 * Visits the spring force generator
	 */
	this.visitAeroControlForceGenerator = function(forceGenerator, rigidBody) {
    var screenPos = window(rigidBody.getPointInWorldSpace(forceGenerator.position));

    var force = forceGenerator.getTensor().multVector(forceGenerator.windspeed);

		ctx.save();
		ctx.strokeStyle = unb3nd.constants.AERO_COLOR;
		ctx.beginPath();
		ctx.translate(screenPos.x, screenPos.y);
		ctx.moveTo(0, 0);
        var forceScreenPos = windowVector(force);
		ctx.lineTo(forceScreenPos.x, forceScreenPos.y);
		ctx.stroke();
		ctx.restore()
	}
}
WorldRenderVisitor.prototype = new WorldVisitor();
WorldRenderVisitor.instance = new WorldRenderVisitor();