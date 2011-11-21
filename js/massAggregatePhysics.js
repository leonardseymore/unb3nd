/**
 * @fileOverview Mass Aggregate Particle System
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * @class A particle is an object which has a position but no orientation
 * @constructor
 * @extends Observable
 * @param {float} mass Optional mass
 * @since 0.0.0
 */
function Particle(mass) {

	/*
	 * Super constructor
	 */
	Observable.call(this);
	
	/**
	 * Unique identifier to help track a single particle
	 * @field 
	 * @type long
	 * @default Auto number
	 * @since 0.0.0
	 * @see Particle#getNextUid 
	 */
	this.uid = Particle.getNextUid();

	/**
	 * The position of this particle
	 * @field 
	 * @type Vector2
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.pos = new Vector2();
	
	/**
	 * The velocity of this particle
	 * @field
	 * @type Vector2 
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.vel = new Vector2();
	
	/**
	 * The acceleration of this particle
	 * @field
	 * @type Vector2 
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.acc = new Vector2();
	
	/**
	 * Damping is a simple yet special property involved in slowing down moving objects 0 - 1, where 0 is full damping and 1 is no damping
	 * @field
	 * @type float 
	 * @default 1.0
	 * @since 0.0.0
	 */
	this.damping = 1.0;
	
	/**
	 * Holds the inverse mass of the particle.
	 * @private
	 * @field
	 * @type float 
	 * @default 0, indicating infinite mass
	 * @since 0.0.0
	 */
	this.inverseMass = 0;
	if (mass) {
		this.inverseMass = 1 / mass;
	} // if
	
	/**
	 * The overall force accumulator
	 * @private
	 * @field
	 * @type Vector2 
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.forceAccum = new Vector2();
	
	/**
	 * Determines if point is near this particle
	 * @function 
	 * @param {Vector2} point Point to test
	 * @param {float} distance Distance to test
	 * @returns {boolean} true if supplied point is near this particle
	 * @since 0.0.0
	 */
	 this.isCloseToPoint = function(point, distance) {
		return this.pos.sub(point).getMagnitude() <= distance;
	 }
	
	/**
	 * Ensures this body has a finite mass
	 * @function 
	 * @returns {boolean} true if this body has a finite mass
	 * @since 0.0.0
	 */
	 this.hasFiniteMass = function() {
		return this.inverseMass > 0;
	 }
	
	/**
	 * Adds an external force to this particle
	 * @function 
	 * @param {Vector2} force The force to add to this particle
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(force) {
		this.forceAccum.addMutate(force);
	}
	
	/**
	 * Reset the force accumulator on this particle
	 * @function 
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.clearForceAccum = function() {
		this.forceAccum.zeroMutate();
	}
	
	/**
	 * Sets the inverse mass of the particle
	 * @function 
	 * @param {float} inverseMass The inverse mass of the particle
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setInverseMass = function(inverseMass) {
		this.inverseMass = inverseMass;
	}
	
	/**
	 * Sets the mass of the particle
	 * @function
	 * @param {float} mass The mass of the particle
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setMass = function(mass) {
		if (mass == 0) {
			this.inverseMass = 0;
		} else {
			this.inverseMass = 1 / mass;
		} // if
	}
	
	/**
	 * Gets the mass of the particle
	 * @function
	 * @returns {float} mass The mass of the particle
	 * @since 0.0.0
	 */
	this.getMass = function() {
		if (this.inverseMass == 0) {
			return 0;
		} else {
			return 1 / this.inverseMass;
		} // if
	}
	
	/**
	 * Integrates the particle forward in time by the given amount.
	 * Uses Newton-Euler integration function
	 * @function
	 * @param {int} delta The time delta in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.integrate = function(delta) {		
		var dt = delta / 1000;
		
		this.pos.addMutate(
			this.vel.multScalar(dt)
		);

		var resultingAcc = this.acc.add(
			this.forceAccum.multScalar(this.inverseMass)
		);
		
		this.vel.addMutate(
			resultingAcc.multScalar(dt)
		);
		
		this.vel.multScalarMutate(
			Math.pow(this.damping, dt)
		);
		
		this.clearForceAccum();
	}
	
	/**
	 * Draw visual helpers for this vector
	 * <p>
	 * This function assumes that translations have already been made to the starting
	 * position of the vector
	 * </p>
	 * @function
	 * @param {string} fillStyle Optional overriding fill style
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(fillStyle) {
		ctx.save();	
		ctx.fillStyle = (fillStyle == undefined ? SETTINGS.PARTICLE_COLOR : fillStyle);
		ctx.translate(this.pos.x, this.pos.y);
		var width = SETTINGS.PARTICLE_WIDTH;
		ctx.fillRect(
			-width, -width, width * 2, width * 2
		);
		ctx.restore();
	}
	
	/**
	 * Draws a string representation of this particle
	 * @function
	 * @param {string} fillStyle Optional overriding fill style
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.drawToString = function(fillStyle) {
		ctx.save();	
		ctx.fillStyle = (fillStyle == undefined ? SETTINGS.PARTICLE_STRING_COLOR : fillStyle);
		ctx.translate(this.pos.x, this.pos.y);
		var width = SETTINGS.PARTICLE_WIDTH;
		ctx.fillText(
			this.toString(),width, width
		);
		ctx.restore();
	}
	
	/**
	 * On die callback
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.ondie = undefined;

	/**
	 * Die callback invoker
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.die = function() {		
		if (this.ondie) {
			this.ondie();
		} // if
		this.dispatchEvent("die");
	}
	
	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this class
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "uid=" + this.uid;
	}
}
Particle.prototype = new Observable();

/**
 * Next uid counter
 * @private
 * @static
 * @field
 * @type long
 * @default Zero vector
 * @since 0.0.0
 */
Particle.nextUid = 0;

/**
 * Generates a unique uid for a particle
 * @private
 * @static
 * @function
 * @returns {long} Unique uid
 * @since 0.0.0
 */
Particle.getNextUid = function() {
	return Particle.nextUid++;
}

/** 
 * @class A force registry for matching up force generators to particles
 * @constructor
 * @since 0.0.0
 */
function ParticleForceRegistry() {
	
	/**
	 * Registry entries
	 * @field
	 * @type {"particle":Particle, "forceGenerators":ParticleForceGenerator []}
	 * @default []
	 * @since 0.0.0
	 */
	this.entries = [];
	
	/**
	 * Adds the force generator to the supplied particle
	 * TODO: This is a very brute force function, we need a HashMap or similar datastructure
	 * @function
	 * @param {Particle} particle The particle to add a force generator to
	 * @param {ParticleForceGenerator} forceGenerator The force generator to add to the particle
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.add = function(particle, forceGenerator) {
		var entry;
		var found = false;
		for (i in this.entries) {
			entry = this.entries[i];
			if (entry.particle === particle) {
				found = true;
				break;
			} // if
		} // for
		
		if (!found) {
			entry = {"particle":particle, "forceGenerators":new Array(forceGenerator)};
			this.entries.push(entry);
		} else {
			entry.forceGenerators.push(forceGenerator);
		} // if
	}
	
	/**
	 * Gets all force generators for the supplied particle
	 * @function
	 * @param {Particle} particle The particle to get the force generators for
	 * @returns {ParticleForceGenerator []} All the force generators for the supplied particle, undefined if not found
	 * @since 0.0.0
	 */
	this.getForceGenerators = function(particle) {
		for (i in this.entries) {
			var entry = this.entries[i];
			if (entry.particle === particle) {
				return entry.forceGenerators;
			} // if
		} // for
		
		return undefined;
	}
	
	/**
	 * Removes all force generators for the supplied particle
	 * @function
	 * @param {Particle} particle The particle to remove the force generators from
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.removeForceGenerators = function(particle) {
		for (i in this.entries) {
			var entry = this.entries[i];
			if (entry.particle === particle) {
				this.entries.splice(i, 1);
			} // if
		} // for
	}
	
	/**
	 * Removes a specific force generator
	 * @function
	 * @param {ParticleForceGenerator} forceGenerator The specific force generator to remove
	 * @return {void}
	 * @since 0.0.0
	 */
	this.removeForceGenerator = function(forceGenerator) {
		for (i in this.entries) {
			var entry = this.entries[i];
			for (j in entry.forceGenerators) {
				var fg = entry.forceGenerators[j];
				if (fg === forceGenerator) {
					entry.forceGenerators.splice(j, 1);
				} // if
			} // if
		} // for
	}
	
	/**
	 * Adds each force generator's force to every particle in the registry over the delta time
	 * @function
	 * @param {int} delta Delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForces = function(delta) {
		for (i in this.entries) {
			var entry = this.entries[i];
			var particle = entry.particle;
			var forceGenerators = entry.forceGenerators;
			for (j in forceGenerators) {
				var forceGenerator = forceGenerators[j];
				forceGenerator.applyForce(particle, delta);
			} // for
		} // for
	}
	
	/**
	 * Draws visual helpers of all force generators
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.drawForceGenerators = function() {
		for (i in this.entries) {
			var entry = this.entries[i];
			var particle = entry.particle;
			var forceGenerators = entry.forceGenerators;
			for (j in forceGenerators) {
				var forceGenerator = forceGenerators[j];
				forceGenerator.draw(particle);
			} // for
		} // for
	}
}

/**
 * @class A particle force generator
 * @constructor
 * @abstract
 * @since 0.0.0
 */
function ParticleForceGenerator() {

	/**
	 * Apply force to the given mass over the delta time
	 * @function
	 * @abstract
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @abstract
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
	}
	
	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this object
	 * @since 0.0.0
	 */
	this.toString = function() {
		return this;
	}
}

/**
 * @class A gravitational force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Vector2} gravition Gravitational force, defaults {@link DEFAULT_GRAVITATIONAL_CONSTANT}
 * @since 0.0.0
 */
function ParticleGravityForceGenerator(gravitation) {

	/**
	 * The gravitational pull
	 * @field 
	 * @type Vector2
	 * @default Vector with {@link DEFAULT_GRAVITATIONAL_CONSTANT} as Y-axis
	 * @since 0.0.0
	 */
	this.gravitation = gravitation || new Vector2(0, DEFAULT_GRAVITATIONAL_CONSTANT);
	
	/**
	 * Apply gravity to the given mass over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		if (!particle.hasFiniteMass()) {
			if (debug && verbose) {
				console.debug("Particle %o has zero mass", particle);
			} // if
			return;
		} // if
		
		particle.applyForce(
			// scale force, since gravity is constant regardless of mass 
			this.gravitation.multScalar(particle.getMass())
		);
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		ctx.strokeStyle = SETTINGS.GRAVITY_COLOR;
		ctx.beginPath();
		ctx.translate(particle.pos.x, particle.pos.y);
		ctx.moveTo(0, 0);
		var gravityVector = this.gravitation.multScalar(particle.getMass())
		ctx.lineTo(gravityVector.x, gravityVector.y);
		ctx.stroke();
		ctx.restore();
	}
	
	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this object
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "Gravity: " + this.gravitation.toString();
	}
}
ParticleGravityForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A wind force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Vector2} direction Wind direction and strength
 * @since 0.0.0
 */
function ParticleWindForceGenerator(direction) {

	/**
	 * The wind direction and strength
	 * @field 
	 * @type Vector2
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.direction = direction || new Vector2();
	
	/**
	 * Apply force to the given mass over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		if (!particle.hasFiniteMass()) {
			if (debug && verbose) {
				console.debug("Particle %o has zero mass, will not apply wind", particle);
			} // if
			return;
		} // if
		
		particle.applyForce(
			// scale force, since gravity is constant regardless of mass 
			this.direction.multScalar(particle.getMass())
		);
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		ctx.strokeStyle = SETTINGS.WIND_COLOR;
		ctx.beginPath();
		ctx.translate(particle.pos.x, particle.pos.y);
		ctx.moveTo(0, 0);
		var windVector = this.direction.multScalar(particle.getMass())
		ctx.lineTo(windVector.x, windVector.y);
		ctx.stroke();
		ctx.restore();
	}
	
	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this object
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "Wind: " + this.direction.toString();
	}
}
ParticleWindForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A drag force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {float} k1 Velocity drag coefficient
 * @param {float} k2 Velocity squared drag coefficient
 * @since 0.0.0
 */
function ParticleDragForceGenerator(k1, k2) {

	/**
	 * Velocity drag coefficient
	 * @field
	 * @type float
	 * @default Defaults to {@link DEFAULT_DRAG_VELOCITY_COEFF}
	 * @since 0.0.0
	 */
	this.k1 = k1 || DEFAULT_DRAG_VELOCITY_COEFF;
	
	/**
	 * Velocity squared drag coefficient
	 * @field 
	 * @type float
	 * @default Defaults to {@link DEFAULT_DRAG_VELOCITY_SQUARED_COEFF}
	 * @since 0.0.0
	 */
	this.k2 = k2 || DEFAULT_DRAG_VELOCITY_SQUARED_COEFF;
	
	/**
	 * Apply gravity to the given mass over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		var force = this.calculateForce(particle, delta);
		particle.applyForce(force);
	}
	
	/**
	 * Calculate the force for the supplied particle over the time delta
	 * @private
	 * @function
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {Vector2} The force to apply to this particle
	 * @since 0.0.0
	 */
	this.calculateForce = function(particle, delta) {
		var dragCoeff = particle.vel.getMagnitude();
		dragCoeff = this.k1 * dragCoeff + this.k2 * dragCoeff * dragCoeff;
		
		var force = particle.vel.normalize();
		force.multScalarMutate(-dragCoeff);
		return force;
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		ctx.strokeStyle = SETTINGS.DRAG_COLOR;
		ctx.beginPath();
		ctx.translate(particle.pos.x, particle.pos.y);
		ctx.moveTo(0, 0);
		var dragVector = this.calculateForce(particle);
		ctx.lineTo(dragVector.x, dragVector.y);
		ctx.stroke();
		ctx.restore();
	}
	
	/**
	 * Converts the class to a string representation
	 * @function
	 * @return {string} The string representation of this class
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "Drag: k1=" + this.k1 + " ,k2=" + this.k2;
	}
}
ParticleDragForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A spring force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Particle} particleOther Particle at the other end of the spring
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @since 0.0.0
 */
function ParticleSpringForceGenerator(particleOther, springConstant, restLength) {

	/**
	 * Particle at the other end of the spring
	 * @field 
	 * @type Particle
	 * @default particleOther
	 * @since 0.0.0
	 */
	this.particleOther = particleOther;
	
	/**
	 * Holds the spring constant
	 * @field
	 * @type float
	 * @default springConstant
	 * @since 0.0.0
	 */
	this.springConstant = springConstant;
	
	/**
	 * Holds the spring's rest length
	 * @field
	 * @type float
	 * @default restLength
	 * @since 0.0.0
	 */
	this.restLength = restLength;
	
	/**
	 * Apply spring force to the given particle over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		var force = particle.pos.clone();
		force.subMutate(this.particleOther.pos);
		
		var magnitude = force.getMagnitude();
		magnitude = Math.abs(magnitude - this.restLength);
		magnitude *= this.springConstant;
		
		force.normalizeMutate();
		force.multScalarMutate(-magnitude);
		particle.applyForce(force);
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(particle.pos.x, particle.pos.y);
		ctx.lineTo(this.particleOther.pos.x, this.particleOther.pos.y);
		ctx.stroke();
		
		ctx.restore();
	}
}
ParticleSpringForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A spring force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Vector2} anchor Fixed point
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @since 0.0.0
 */
function ParticleAnchoredSpringForceGenerator(anchor, springConstant, restLength) {

	/**
	 * Anchor to which particle must be connected
	 * @field
	 * @type Vector2
	 * @default anchor
	 * @since 0.0.0
	 */
	this.anchor = anchor;
	
	/**
	 * Holds the spring constant
	 * @field 
	 * @type float
	 * @default springConstant
	 * @since 0.0.0
	 */
	this.springConstant = springConstant;
	
	/**
	 * Holds the spring's rest length
	 * @field
	 * @type float
	 * @default restLength
	 * @since 0.0.0
	 */
	this.restLength = restLength;
	
	/**
	 * Apply spring force to the given particle over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		var force = particle.pos.clone();
		force.subMutate(this.anchor);
		
		var magnitude = force.getMagnitude();
		magnitude = Math.abs(magnitude - this.restLength);
		magnitude *= this.springConstant;
		
		force.normalizeMutate();
		force.multScalarMutate(-magnitude);
		particle.applyForce(force);
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.ANCHORED_SPRING_COLOR;
		ctx.beginPath();
		ctx.moveTo(particle.pos.x, particle.pos.y);
		ctx.lineTo(this.anchor.x, this.anchor.y);
		ctx.stroke();
		
		ctx.restore();
	}
}
ParticleAnchoredSpringForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A bungee force generator applies a spring force only when extended
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Particle} at the other end of the spring
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @since 0.0.0
 */
function ParticleBungeeForceGenerator(particleOther, springConstant, restLength) {

	/**
	 * Particle at the other end of the spring
	 * @field 
	 * @type Particle
	 * @default particleOther
	 * @since 0.0.0
	 */
	this.particleOther = particleOther;
	
	/**
	 * Holds the spring constant
	 * @field 
	 * @type float
	 * @default springConstant
	 * @since 0.0.0
	 */
	this.springConstant = springConstant;
	
	/**
	 * Holds the spring's rest length
	 * @field 
	 * @type float
	 * @default restLength
	 * @since 0.0.0
	 */
	this.restLength = restLength;
	
	/**
	 * Apply spring force to the given particle over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		var force = particle.pos.clone();
		force.subMutate(this.particleOther.pos);
		
		var magnitude = force.getMagnitude();
		if (magnitude <= this.restLength) {
			return;
		} // if
	
		magnitude = this.springConstant * (magnitude - this.restLength);
		
		force.normalizeMutate();
		force.multScalarMutate(-magnitude);
		particle.applyForce(force);
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.BUNGEE_COLOR;
		ctx.beginPath();
		ctx.moveTo(particle.pos.x, particle.pos.y);
		ctx.lineTo(particleOther.pos.x, particleOther.pos.y);
		ctx.stroke();
		
		ctx.restore();
	}
}
ParticleBungeeForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class An anchored bungee force generator applies a spring force only when extended
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Vector2} anchor Fixed point
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @since 0.0.0
 */
function ParticleAnchoredBungeeForceGenerator(anchor, springConstant, restLength) {

	/**
	 * Anchor to which particle must be connected
	 * @field
	 * @type Vector2
	 * @default anchor
	 * @since 0.0.0
	 */
	this.anchor = anchor;
	
	/**
	 * Holds the spring constant
	 * @field 
	 * @type float
	 * @default springConstant
	 * @since 0.0.0
	 */
	this.springConstant = springConstant;
	
	/**
	 * Holds the spring's rest length
	 * @field
	 * @type float
	 * @default restLength
	 * @since 0.0.0
	 */
	this.restLength = restLength;
	
	/**
	 * Apply spring force to the given particle over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		var force = particle.pos.clone();
		force.subMutate(this.anchor);
		
		var magnitude = force.getMagnitude();
		if (magnitude <= this.restLength) {
			return;
		} // if
		magnitude = this.springConstant * (magnitude - this.restLength);
		
		force.normalizeMutate();
		force.multScalarMutate(-magnitude);
		particle.applyForce(force);
	}
	
	/**
	 * Draw a visual representation of this force generator
	 * @function
	 * @override
	 * @param {Particle} particle The particle the generator is working on
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(particle) {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.ANCHORED_BUNGEE_COLOR;
		ctx.beginPath();
		ctx.moveTo(particle.pos.x, particle.pos.y);
		ctx.lineTo(this.anchor.x, this.anchor.y);
		ctx.stroke();
		
		ctx.restore();
	}
}
ParticleAnchoredBungeeForceGenerator.prototype = new ParticleForceGenerator();

/**
 * A buoyancy force generator applies a spring force. Since particles don't have volume
 * this generator uses additional parameters to simulate buoyancy force on the particle.
 * TODO: Buoyancy force generator needs work
 * @class 
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Vector2} anchor Fixed point on the water surface
 * @param {float} maxDepth The maximum submersion depth before object is completely submerged
 * @param {float} volume The volume of the object
 * @param {float} liquidDensity The density of the liquid. Pure water has 1000 kg per cubic meter.
 * @since 0.0.0
 */
function ParticleBuoyancyForceGenerator(anchor, maxDepth, volume, liquidDensity) {

	/**
	 * Fixed point
	 * @field 
	 * @type Vector2
	 * @default anchor
	 * @since 0.0.0
	 */
	this.anchor = anchor;
	
	/**
	 * The maximum submersion depth before object is completely submerged
	 * @field 
	 * @type float
	 * @default maxDepth
	 * @since 0.0.0
	 */
	this.maxDepth = maxDepth;
	
	/**
	 * The volume of the object
	 * @field 
	 * @type float
	 * @default volume
	 * @since 0.0.0
	 */
	this.volume = volume;
	
	/**
	 * The density of the liquid
	 * @field 
	 * @type float
	 * @default 1000.0
	 * @since 0.0.0
	 */
	this.liquidDensity = liquidDensity || 1000.0;
	
	/**
	 * Apply spring force to the given particle over the delta time
	 * @function
	 * @override
	 * @param {Particle} particle The particle to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(particle, delta) {
		var depth = this.anchor.y - particle.pos.y;
		if (depth <= -this.maxDepth) {
			return;
		} // if
		
		var force = new Vector2();
		if (depth > this.maxDepth) {
			force.y = this.liquidDensity * this.volume;
			particle.applyForce(force);
			
			return;
		} // if
		
		// TODO: determine partially emerged force
		//force.y = this.liquidDensity * this.volume; //* (depth - this.maxDepth) / 2 * this.maxDepth;
		//particle.applyForce(force);
	}
}
ParticleBuoyancyForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class Particle force generator factory
 * @constructor
 * @since 0.0.0
 */
function ParticleForceGeneratorFactory() {
}

/**
 * Creates a gravity force generator for a single particle only
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The particle to add the generator to
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createGravity = function(forceRegistry, particle) {
	forceRegistry.add(particle, new ParticleGravityForceGenerator());
}

/**
 * Creates a wind force generator for a single particle only
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The particle to add the generator to
 * @param {Vector2} direction The direction and strength of the force
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createWind = function(forceRegistry, particle, direction) {
	forceRegistry.add(particle, new ParticleWindForceGenerator(direction));
}

/**
 * Creates a drag force generator for a single particle only
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The particle to add the generator to
 * @param {float} k1 Velocity coefficient
 * @param {float} k2 Velocity squared coefficient
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createDrag = function(forceRegistry, particle, k1, k2) {
	forceRegistry.add(particle, new ParticleDragForceGenerator(k1, k2));
}

/**
 * Generates 2 spring force generators between the particles and adds it to the supplied registry
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} p1 The first particle
 * @param {Particle} p2 The second particle
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createSpring = function(forceRegistry, p1, p2, springConstant, restLength) {
	var p1F = new ParticleSpringForceGenerator(p2, springConstant, restLength);
	forceRegistry.add(p1, p1F);
	p2.addEventListener("die", function() {
		if (debug) {
			console.debug("Removing force generator for dead particle %s", this.toString());
		} // if
		
		forceRegistry.removeForceGenerator(p1F);
	});
	
	var p2F = new ParticleSpringForceGenerator(p1, springConstant, restLength);
	forceRegistry.add(p2, p2F);
	p1.addEventListener("die", function() {
		if (debug) {
			console.debug("Removing force generator for dead particle %s", this.toString());
		} // if
		
		forceRegistry.removeForceGenerator(p2F);
	});
}

/**
 * Generates a spring force generator between a particle and a fixed point
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The first particle
 * @param {Vector2} anchor The anchor point
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createAnchoredSpring = function(forceRegistry, particle, anchor, springConstant, restLength) {
	forceRegistry.add(particle, new ParticleAnchoredSpringForceGenerator(anchor, springConstant, restLength));
}

/**
 * Generates 2 bungee force generators between the particles and adds it to the supplied registry
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} p1 The first particle
 * @param {Particle} p2 The second particle
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createBungee = function(forceRegistry, p1, p2, springConstant, restLength) {
	var p1F = new ParticleBungeeForceGenerator(p2, springConstant, restLength);
	forceRegistry.add(p1, p1F);
	p2.addEventListener("die", function() {
		if (debug) {
			console.debug("Removing bungee force generator for dead particle %s", this.toString());
		} // if
		
		forceRegistry.removeForceGenerator(p1F);
	});
	
	var p2F = new ParticleBungeeForceGenerator(p1, springConstant, restLength);
	forceRegistry.add(p2, p2F);
	p1.addEventListener("die", function() {
		if (debug) {
			console.debug("Removing bungee force generator for dead particle %s", this.toString());
		} // if
		
		forceRegistry.removeForceGenerator(p2F);
	});
}

/**
 * Generates an anchored bungee force generator between a particle and a fixed point
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The first particle
 * @param {Vector2} anchor The anchor point
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createAnchoredBungee = function(forceRegistry, particle, anchor, springConstant, restLength) {
	forceRegistry.add(particle, new ParticleAnchoredBungeeForceGenerator(anchor, springConstant, restLength));
}

/**
 * Generates a buoyancy force generator between a particle and a fixed point
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The first particle
 * @param {Vector2} anchor The anchor point
 * @param {float} maxDepth
 * @param {float} volume 
 * @param {float} liquidDensity 
 * @returns {void}
 * @since 0.0.0
 */
ParticleForceGeneratorFactory.createBuoyancy = function(forceRegistry, particle, anchor, maxDepth, volume, liquidDensity) {
	forceRegistry.add(particle, new ParticleBuoyancyForceGenerator(anchor, maxDepth, volume, liquidDensity));
}

/**
 * COLLISION DETECTION
 */
 
/**
 * Enumeration of all contact types
 * @enum {number}
 */
var CONTACT_TYPE = {
	BOX : 1, // bounding box
	INTER : 2, // inter particle collision
	CABLE : 4, // cable constraint
	ROD : 8// rod constraint
};

/**
 * @class A contact represents two objects in contact (in this case
 * ParticleContact representing two particles). Resolving a
 * contact removes their interpenetration, and applies sufficient
 * impulse to keep them apart. Colliding bodies may also rebound.
 *
 * The contact has no callable functions, it just holds the
 * contact details. To resolve a set of contacts, use the particle
 * contact resolver class.
 * @constructor
 * @since 0.0.0
 */
function ParticleContact() {

	/**
	 * Holds the particles that are involved in the contact. The second may be
	 * omitted in the case of a contact with the environment.
	 * @field
	 * @type Particle []
	 * @default []
	 * @since 0.0.0
	 */
	this.particles = [];
	
	/**
	 * Holds the normal restitution coefficient at the contact
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.restitution = 0.0;
	
	/**
	 * Holds the contact normal
	 * @field 
	 * @type Vector2
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.contactNormal = new Vector2();
	
	/**
	 * Penetration depth in the direction of the contact normal
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.penetration = 0.0;
	
	/**
	 * Resolves this contact for both veolcity and interpenetration
	 * @function
	 * @protected
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.resolve = function(delta) {
		this.resolveVelocity(delta);
		this.resolveInterpenetration(delta);
	}
	
	/**
	 * Calculate separating velocity at this contact
	 * @function
	 * @protected
	 * @returns {float} Separating velocity at this contact
	 * @since 0.0.0
	 */
	this.calculateSeparatingVelocity = function() {
		var relativeVelocity = this.particles[0].vel.clone();
		if (this.particles[1]) {
			relativeVelocity.subMutate(
				this.particles[1].vel
			);
		} // if
		return relativeVelocity.dotProduct(this.contactNormal);
	}
	
	/**
	 * Handles impulse calculations for this collision
	 * @function
	 * @private
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.resolveVelocity = function(delta) {
		var dt = delta / 1000;
		var separatingVelocity = this.calculateSeparatingVelocity();
		if (separatingVelocity > 0) {
			// contact is either separating or stationary
			return;
		} // if
		var newSepVelocity = -separatingVelocity * this.restitution;
		
		// ~PHYLIMIT keep to objects in resting contact
		// micro-collision approach
		// check velocity build up due to acceleration only
		var accCausedVelocity = this.particles[0].acc.clone();
		if (this.particles[1]) {
			accCausedVelocity.subMutate(this.particles[1].acc);
		} // if
		var accCausedSepVelocity = accCausedVelocity.dotProduct(this.contactNormal) * dt;
		
		// If we’ve got a closing velocity due to acceleration build-up,
		// remove it from the new separating velocity.
		if (accCausedSepVelocity < 0) {
			newSepVelocity += resitution * accCausedSepVelocity;
			
			// Make sure we haven’t removed more than was there to remove.
			if (newSepVelocity < 0) {
				newSepVelocity = 0;
			} // if
		} // if
		// ~END-PHYLIMIT
		
		var deltaVelocity = newSepVelocity - separatingVelocity;
		
		var totalInverseMass = this.particles[0].inverseMass;
		if (this.particles[1]) {
			totalInverseMass += this.particles[1].inverseMass;
		} // if
		
		if (totalInverseMass <= 0) {
			// all particles have infinite mass
			return;
		} // if
		
		var impulse = deltaVelocity / totalInverseMass;
		var impulsePerIMass = this.contactNormal.multScalar(impulse);
		
		// apply impulses proportional to inverse mass
		// in the direction of the contact
		this.particles[0].vel.addMutate(
			impulsePerIMass.multScalar(this.particles[0].inverseMass)
		);
		
		if (this.particles[1]) {
			this.particles[1].vel.addMutate(
				impulsePerIMass.multScalar(-this.particles[1].inverseMass)
			);
		} // if
	}
	
	/**
	 * Handles interpenetration resolution for this contact
	 * @function
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.resolveInterpenetration = function(delta) {
		if (this.penetration <= 0) {
			return;
		} // if
		
		var totalInverseMass = this.particles[0].inverseMass;
		if (this.particles[1]) {
			totalInverseMass += this.particles[1].inverseMass;
		} // if
		
		if (totalInverseMass <= 0) {
			// infinite mass
			return;
		} // if
		
		// find penetration resolution relative to inverse mass
		var movePerIMass = this.contactNormal.multScalar(
			-this.penetration / totalInverseMass
		);
		
		this.particles[0].pos.addMutate(
			movePerIMass.multScalar(this.particles[0].inverseMass)
		);
		
		if (this.particles[1]) {
			this.particles[1].pos.addMutate(
				movePerIMass.multScalar(this.particles[1].inverseMass)
			);
		} // if
	}
}

/**
 * @class The contact resolution routine for particle contacts. One resolver
 * instance can be shared for the whole simulation.
 * @constructor
 * @since 0.0.0
 */
function ParticleContactResolver() {
	/**
	 * Number of allowable iterations
	 * Recommend: Minimally number of contacts, as a single contact is resolved
	 *            per iteration.
	 * @field 
	 * @type int
	 * @default 0
	 * @since 0.0.0
	 */
	this.maxIt = 0;

	/**
	 * Resolves the set of particle contacts for both penetration and velocity
	 * @function
	 * @param {ParticleContact []} contacts All contacts to resolve
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.resolveContacts = function(contacts, delta) {
		var it = 0;
		while (it < this.maxIt) {
			// find the contact with the largest closing velocity
			var max = 0;
			var maxContact = contacts[0];
			for (i in contacts) {
				var contact = contacts[i];
				var sepVel = contact.calculateSeparatingVelocity();
				if (sepVel < max) {
					max = sepVel;
					maxContact = contact;
				} // if
			} // for
			maxContact.resolve(delta);
			it++;
		} // while
	}
}
 
/**
 * @class Responsible for generating contacts
 * @constructor
 * @since 0.0.0
 */
function ParticleContactGenerator() {

	/**
	 * Contact type
	 * @field
	 * @type CONTACT_TYPE
	 * @default undefined
	 * @since 0.0.0
	 */
	this.contactType = undefined;

	/**
	 * Sets the contact type
	 * @functino
	 * @param {int} contactType The type of contact generated by this generator
	 * @returns {void}
	 * @throws Error If an invalid contact type was specified
	 * @since 0.0.0
	 */
	this.setContactType = function(contactType) {
		this.contactType = contactType;
	}
	
	/**
	 * Adds contacts
	 * @function
	 * @abstract
	 * @param {ParticleContacts []} contacts Contacts to append to
	 * @param {int} limit Maximum number of contacts that may be added
	 * @return {int} The number of contacts added
	 * @since 0.0.0
	 */
	this.addContact = function(contacts, limit) {
	}
}

/**
 * @class Links connect two particles together, generating a contact if
 * they violate the constraints of their link. It is used as a
 * base class for cables and rods, and could be used as a base
 * class for springs with a limit to their extension.
 * @constructor
 * @extends ParticleContactGenerator
 * @since 0.0.0
 */
function ParticleLinkContactGenerator() {
	
	/*
	 * Super constructor
	 */
	ParticleContactGenerator.call(this);
	
	/**
	 * Pair of particles connected by this link
	 * @field 
	 * @type Particles []
	 * @default []
	 * @since 0.0.0
	 */
	this.particles = [];
	
	/**
	 * Determines the current length of the link, in other words
	 * the distance between the two particles
	 * @function
	 * @protected
	 * @return {float} The distance between the two particles
	 * @since 0.0.0
	 */
	this.getCurrentLength = function() {
		var relativePos = this.particles[0].pos.sub(
			this.particles[1].pos
		);
		return relativePos.getMagnitude();
	}
	
	/**
	 * Fills the given contact structure with the contact needed
	 * to keep the link from violating its constraint. The contact
	 * pointer should point to the first available contact in a
	 * contact array, where limit is the maximum number of
	 * contacts in the array that can be written to. The function
	 * returns the number of contacts that have been written. This
	 * format is common to contact-generating functions, but this
	 * class can only generate a single contact, so the
	 * pointer can be a pointer to a single element. The limit
	 * parameter is assumed to be at least one (zero isn’t valid),
	 * and the return value is either 0, if the cable wasn’t
	 * overextended, or one if a contact was needed.
	 * @function
	 * @abstract
	 * @param {ParticleContact []} contacts Contacts array to be written to. Append
	 *        contacts to end of array using contacts.push
	 * @param {int} limit The maximum number of contacts that may be appended to the array
	 * @return {int} The number of contacts that have been written to
	 * @since 0.0.0
	 */
	this.addContact = function(contacts, limit) {
	}
}
ParticleLinkContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Cables link a pair of particles, generating a contact if they stray too far 
 * apart.
 * @constructor
 * @extends ParticleLinkContactGenerator
 * @param {float} maxLength Maximum length of the cable
 * @param {float} restitution Restitution (bounciness) of the cable
 * @since 0.0.0
 */
function ParticleCableContactGenerator(maxLength, restitution) {
	
	/*
	 * Super constructor
	 */
	ParticleLinkContactGenerator.call(this);
	this.setContactType(CONTACT_TYPE.CABLE);
	
	/**
	 * Maximum length of the cable
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.maxLength = maxLength || 0.0;
	
	/**
	 * Restitution (bounciness) of the cable
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.restitution = restitution || 0.0;
	
	/**
	 * Creates a contact needed to keep the cable from overextending
	 * @function
	 * @override
	 * @return {int} The number of contacts that have been written to
	 * @since 0.0.0
	 */
	this.addContact = function(contacts, limit) {
		var length = this.getCurrentLength();

		if (length <= this.maxLength) {
			return 0;
		} // if

		var contact = new ParticleContact();

		contact.particles[0] = this.particles[0];
		contact.particles[1] = this.particles[1];
		
		var normal = this.particles[1].pos.sub(
			this.particles[0].pos
		);
		normal.normalizeMutate();
		contact.contactNormal = normal;
		
		contact.penetration = this.maxLength - length;
		contact.restitution = this.restitution;
	
		contacts.push(contact);
		
		return 1;
	}
	
	/**
	 * Draw a visual representation of this contact generator
	 * @function
	 * @override
	 * @return {void}
	 * @since 0.0.0
	 */
	this.draw = function() {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.CABLE_COLOR;
		ctx.beginPath();
		ctx.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
		ctx.lineTo(this.particles[1].pos.x, this.particles[1].pos.y);
		ctx.stroke();
		
		ctx.restore();
	}
}
ParticleCableContactGenerator.prototype = new ParticleLinkContactGenerator();

/**
 * @class Cables link a pair of particles, generating a contact if they stray too far 
 * apart or too close
 * @constructor
 * @extends ParticleLinkContactGenerator
 * @param {float} length Length of the rod
 * @since 0.0.0
 */
function ParticleRodContactGenerator(length) {

	/*
	 * Super constructor
	 */
	 ParticleLinkContactGenerator.call(this);
	 this.setContactType(CONTACT_TYPE.ROD);
	
	/**
	 * Hold the length of the rod
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.length = length || 0.0;
	
	/**
	 * Creates a contact needed to keep the cable from overextending
	 * @function
	 * @override
	 * @return {int} The number of contacts that have been written to
	 * @since 0.0.0
	 */
	this.addContact = function(contacts, limit) {
		var currentLength = this.getCurrentLength();
		if (currentLength == this.length) {
			return 0;
		} // if
		
		var contact = new ParticleContact();
		contact.particles[0] = this.particles[0];
		contact.particles[1] = this.particles[1];
		
		var normal = this.particles[1].pos.sub(
			this.particles[0].pos
		);
		normal.normalizeMutate();
		
		if (currentLength > this.length) {
			contact.contactNormal = normal;
			contact.penetration = this.length - currentLength;
		} else {
			contact.contactNormal = normal.multScalar(-1);
			contact.penetration = currentLength - this.length;
		} // if
		
		// always use zero resitution (no bounciness)
		contact.restitution = 0;
		
		contacts.push(contact);
		
		return 1;
	}
	
	/**
	 * Draw a visual representation of this contact generator
	 * @function
	 * @override
	 * @return {void}
	 * @since 0.0.0
	 */
	this.draw = function() {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.ROD_COLOR;
		ctx.beginPath();
		ctx.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
		ctx.lineTo(this.particles[1].pos.x, this.particles[1].pos.y);
		ctx.stroke();
		
		ctx.restore();
	}
}
ParticleRodContactGenerator.prototype = new ParticleLinkContactGenerator();

/**
 * @class Responsible for generating collision contacts between particles
 * @constructor
 * @extend ParticleContactGenerator
 * @since 0.0.0
 */
function ParticleCollisionContactGenerator(collisionRadius) {

	/**
	 * Minimum distance allowed between particles
	 * @field 
	 * @type float
	 * @default 5.0
	 * @since 0.0.0
	 */
	this.collisionRadius = collisionRadius || 5.0;
	this.setContactType(CONTACT_TYPE.INTER);

	/**
	 * All particles to detect collisions between
	 * @field
	 * @type Particle []
	 * @default []
	 * @since 0.0.0
	 */
	this.particles = [];

	/**
	 * Adds contacts
	 * @function
	 * @override
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addContact = function(contacts, limit) {
		var usedContacts = 0;
		for (i in this.particles) {
			if (usedContacts >= limit) {
				break;
			} // if
			
			var particle = this.particles[i];
			for (j in this.particles) {
				if (i == j) {
					continue;
				} // if
				
				var particleOther = this.particles[j];
				var normal = particle.pos.sub(particleOther.pos);
				var distance = normal.getMagnitude();
				if (distance < this.collisionRadius) {
					normal.normalizeMutate();
					var particleContact = new ParticleContact();
					particleContact.particles[0] = particle;
					particleContact.particles[1] = particleOther;
					particleContact.contactNormal = normal;
					particleContact.penetration = distance - this.collisionRadius;
					contacts.push(particleContact);
					usedContacts++;
				} // if
			} // for
		} // for
		return usedContacts;
	}
	
	/**
	 * Draw a visual representation of this contact generator
	 * @function
	 * @override
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function() {
		ctx.save();
		
		ctx.strokeStyle = SETTINGS.COLLISION_DETECTION_COLOR;
		for (i in this.particles) {		
			var particle = this.particles[i];
			ctx.beginPath();
			ctx.arc(particle.pos.x, particle.pos.y, this.collisionRadius, 0, Math.PI * 2);
			ctx.stroke();
		} // for		
		ctx.restore();
	}
}
ParticleCollisionContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Responsible for generating collision contacts between particles
 * @constructor
 * @extends ParticleContactGenerator
 * @param {Rectangle} box The boundaries in which a contact may live
 * @param {float} collisionRadius Minimum allowable distance between a particle and the boundaries
 * @since 0.0.0
 */
function ParticleBoxContactGenerator(box, collisionRadius) {
	
	/*
	 * Super construction
	 */
	this.setContactType(CONTACT_TYPE.BOX);
	
	/**
	 * Collision rectangle
	 * @field 
	 * @type Rectangle
	 * @default box
	 * @since 0.0.0
	 */
	this.box = box;
	
	/**
	 * Collision rectangle
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.collisionRadius = collisionRadius || 0.0;

	/**
	 * All particles to detect collisions between
	 * @field
	 * @type Particle []
	 * @default []
	 * @since 0.0.0
	 */
	this.particles = [];

	/**
	 * Adds contacts
	 * @function
	 * @override
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addContact = function(contacts, limit) {
		var usedContacts = 0;
		for (i in this.particles) {
			if (usedContacts >= limit) {
				break;
			} // if
			
			var particle = this.particles[i];
			if (!box.shrink(this.collisionRadius).isPointInside(particle.pos)) {
				var normal = new Vector2();
				var depth = 0;
				if (particle.pos.x < this.box.x + this.collisionRadius) {
					normal.x = 1;
					normal.y = 0;
					depth = particle.pos.x - this.box.x - this.collisionRadius;
				} // if
				
				if (particle.pos.x > this.box.x + this.box.width + this.collisionRadius) {
					normal.x = -1;
					normal.y = 0;
					depth = this.box.x + this.box.width + this.collisionRadius - particle.pos.x;
				} // if
				
				if (particle.pos.y < this.box.y + this.collisionRadius) {
					normal.x = 0;
					normal.y = 1;
					depth = particle.pos.y - this.box.y - this.collisionRadius;
				} // if
				
				if (particle.pos.y > this.box.y + this.box.height + this.collisionRadius) {
					normal.x = 0;
					normal.y = -1;
					depth = this.box.y + this.box.height + this.collisionRadius - particle.pos.y;
				} // if
			
				var particleContact = new ParticleContact();
				particleContact.particles[0] = particle;
				particleContact.contactNormal = normal;
				particleContact.penetration = depth;
				particleContact.restitution = DEFAULT_COLLISION_RESTITUTION;
				contacts.push(particleContact);
				usedContacts++;
			} // if
		} // for
		return usedContacts;
	}
	
	/**
	 * Draw a visual representation of this contact generator
	 * @function
	 * @override
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function() {
		ctx.save();
		ctx.strokeStyle = SETTINGS.COLLISION_BOX_COLOR;
		ctx.strokeRect(this.box.x, this.box.y, this.box.width, this.box.height);
		
		ctx.strokeStyle = SETTINGS.COLLISION_BOX_TOL_COLOR;
		ctx.strokeRect(this.box.x + this.collisionRadius, this.box.y + this.collisionRadius, this.box.width - this.collisionRadius * 2, this.box.height - this.collisionRadius * 2);
		ctx.restore();
	}
}
ParticleBoxContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Factory to create particle contact generators
 * @constructor
 * @since 0.0.0
 */
function ParticleContactGeneratorFactory() {
}

/**
 * Creates a collision detection particle generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particles []} particles The particle to test collisions on
 * @param {Rectangle} collisionBox The collision rectangle
 * @param {float} collisionRadius Optional minimum allowable distance between bounding box and particle
 * @returns {void}
 * @since 0.0.0
 */
ParticleContactGeneratorFactory.createCollisionBox = function(particleWorld, particles, collisionBox, collisionRadius) {
	var generator = new ParticleBoxContactGenerator(collisionBox, collisionRadius);
	generator.particles = particles;
	particleWorld.addContactGenerator(generator);
}

/**
 * Creates a box detection particle generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particles []} particles The particle to test collisions on
 * @param {float} collisionRadius The minimum allowable distance between the particles
 * @returns {void}
 * @since 0.0.0
 */
ParticleContactGeneratorFactory.createCollisionDetection = function(particleWorld, particles, collisionRadius) {
	var generator = new ParticleCollisionContactGenerator(collisionRadius);
	generator.particles = particles;
	particleWorld.addContactGenerator(generator);
}

/**
 * Creates a cable contact generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particle} particle The first particle
 * @param {Particle} particleOther The second particle
 * @param {float} maxLength The maximum length of the cable
 * @param {float} restitution The cable's restitution
 * @returns {void}
 * @since 0.0.0
 */
ParticleContactGeneratorFactory.createCable = function(particleWorld, particle, particleOther, maxLength, restitution) {
	var generator = new ParticleCableContactGenerator(maxLength, restitution);
	generator.particles[0] = particle;
	generator.particles[1] = particleOther;
	particleWorld.addContactGenerator(generator);
}

/**
 * Creates a rod contact generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particle} particle The first particle
 * @param {Particle} particleOther The second particle
 * @param {float} length The length of the rod
 * @returns {void}
 * @since 0.0.0
 */
ParticleContactGeneratorFactory.createRod = function(particleWorld, particle, particleOther, length) {
	var generator = new ParticleRodContactGenerator(length);
	generator.particles[0] = particle;
	generator.particles[1] = particleOther;
	particleWorld.addContactGenerator(generator);
}

/**
 * Gravity on flag
 * @field
 * @constant
 * @type int
 * @default 1
 * @since 0.0.0
 */
var PARTICLE_WORLD_GRAVITY = 1;

/**
 * Drag on flag
 * @field
 * @constant
 * @type int
 * @default 2
 * @since 0.0.0
 */
var PARTICLE_WORLD_DRAG = 2;

/**
 * Particles should collide with window rect
 * @field
 * @constant
 * @type int
 * @default 4
 * @since 0.0.0
 */
var PARTICLE_WORLD_WINDOW_COLLISION = 4;

/**
 * Are contact events enabled
 * @field
 * @constant
 * @type int
 * @default 8
 * @since 0.0.0
 */
var PARTICLE_WORLD_CONTACT_EVENTS = 8;

/**
 * All on flag
 * @field
 * @constant
 * @type int
 * @default 2
 * @since 0.0.0
 */
var PARTICLE_WORLD_ALL = PARTICLE_WORLD_GRAVITY | 
	PARTICLE_WORLD_DRAG |
	PARTICLE_WORLD_WINDOW_COLLISION |
	PARTICLE_WORLD_CONTACT_EVENTS;

/**
 * @class Contact event when a contact is generated
 * @constructor
 * @param {ParticleContact} contact The contact that was generated
 * @param {CONTACT_TYPE} contactType The contact type
 * @since 0.0.0
 */
function ContactEvent(contact, contactType) {

	/**
	 * The contact that was generated
	 * @field
	 * @type ParticleContact
	 * @default contact
	 * @since 0.0.0
	 */
	this.contact = contact;
	
	/**
	 * The type of contact that was generated
	 * @field
	 * @type CONTACT_TYPE
	 * @default contact
	 * @since 0.0.0
	 */
	this.contactType = contactType;
}	
	
/**
 * @class Keeps track of all particles
 * @constructor
 * @extends Observable
 * @param {int} flags Initial value flags
 * @since 0.0.0
 */
function ParticleWorld(flags) {

	/*
	 * Super constructor
	 */
	Observable.call(this);
	
	/**
	 * Flag to indicate if contact events are enabled
	 * @field
	 * @type boolean
	 * @default false
	 * @since 0.0.0
	 */
	this.contactEventsEnabled = false;
	
	/**
	 * On contact event callback
	 * @field
	 * @type function
	 * @default undefined
	 * @since 0.0.0
	 */
	this.oncontact = undefined;

	/**
	 * On contact callback invoker
	 * @function
	 * @param {ContactEvent} e The event object
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.contact = function(e) {		
		if (this.oncontact) {
			this.oncontact(e);
		} // if
		this.dispatchEvent("contact", e);
	}
	
	/**
	 * All particles in simulation
	 * @field 
	 * @type Particle []
	 * @default []
	 * @since 0.0.0
	 */
	this.particles = [];
	
	/**
	 * Holds all the force generators
	 * @field 
	 * @type ParticleForceRegistry
	 * @default new ParticleForceRegistry()
	 * @since 0.0.0
	 */
	this.forceRegistry = new ParticleForceRegistry();
	
	/**
	 * Resolver for contacts
	 * @field 
	 * @type ParticleContactResolver
	 * @default new ParticleContactResolver()
	 * @since 0.0.0
	 */
	this.resolver = new ParticleContactResolver();
	
	/**
	 * Particle contact generators
	 * @field 
	 * @type ParticleContactGenerator []
	 * @default []
	 * @since 0.0.0
	 */
	this.contactGenerators = [];
	
	/**
	 * All particle contacts
	 * @field 
	 * @type ParticleContact []
	 * @default []
	 * @since 0.0.0
	 */
	this.contacts = [];
	
	/**
	 * The maximum allowable number of contacts
	 * @field 
	 * @type int
	 * @default 100
	 * @since 0.0.0
	 */
	this.maxContacts = 100;
	
	/**
	 * Force generators applied to all particles
	 * @field 
	 * @type ParticleForceGenerator []
	 * @default []
	 * @since 0.0.0
	 */
	this.globalForceGenerators = [];
	
	/**
	 * Particle world state flags
	 * @field 
	 * @type int
	 * @default 0
	 * @since 0.0.0
	 */
	this.flags = flags || 0;

	/**
	 * Adds a contact generator
	 * @function
	 * @param {ParticleContactGenerator} contactGenerator The contact generator to add
	 * @return {int} The total number of contact generators
	 * @since 0.0.0
	 */
	this.addContactGenerator = function(contactGenerator) {
		this.contactGenerators.push(contactGenerator);
		
		if (contactGenerator.particles[0]) {
			contactGenerator.particles[0].addEventListener("die", function() {
				particleWorld.removeContactGenerator(contactGenerator);
			});
		} // if
		
		if (contactGenerator.particles[1]) {
			contactGenerator.particles[1].addEventListener("die", function() {
				particleWorld.removeContactGenerator(contactGenerator);
			});
		} // if
	}
	
	/**
	 * Removes a contact generator
	 * @function
	 * @param {ParticleContactGenerator} contactGenerator The contact generator to remove
	 * @return {void}
	 * @since 0.0.0
	 */
	this.removeContactGenerator = function(contactGenerator) {
		for (i in this.contactGenerators) {
			var cg = this.contactGenerators[i];
			if (cg === contactGenerator) {
				this.contactGenerators.splice(i, 1);
			} // if
		} // for
	}
	
	/**
	 * Adds a new particle to the simulation
	 * @function
	 * @param {Particle} particle The new particle to add
	 * @returns {int} The total number of particles in the simulation
	 * @since 0.0.0
	 */
	this.addParticle = function(particle) {
		return this.particles.push(particle);
	}
	
	/**
	 * Removes a particle from the simulation
	 * @function
	 * @param {Particle} particle The particle to remove
	 * @returns {Particle} The removed particle, undefied if not removed
	 * @since 0.0.0
	 */
	this.removeParticle = function(particle) {
		var removedParticle = undefined;
		for (i in this.particles) {
			var el = this.particles[i];
			if (el === particle) {
				if (debug) {
					console.debug("Removing particle %s", particle.toString());
				} // if
				
				var removedParticle = this.particles.splice(i, 1);
				particle.die();
				this.forceRegistry.removeForceGenerators(particle);
				
				if (debug) {
					console.debug("Removing particle %d", i);	
				} // if
				
				return removedParticle;
			} // if
		} // for
		return removedParticle;
	}
	
	/**
	 * Gets the first particle within the specified radius
	 * @function
	 * @param {Vector2} point The point at which to look
	 * @param {float} radius The search radius
	 * @returns {Particle} The particle, undefined if none were found
	 * @since 0.0.0
	 */
	this.getFirstParticleWithin = function(point, radius) {
		for (i in this.particles) {
			var particle = this.particles[i];
			if (particle.isCloseToPoint(point, radius)) {
				return particle;
			} // if
		} // for
		return undefined;
	}
	
	/**
	 * Runs a complete cycle
	 * @function
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.update = function(delta) {
		this.startFrame();
		this.runPhysics(delta);
	}
	
	/**
	 * Clears all force accumulators on particles
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.startFrame = function() {
		for (i in this.particles) {
			var particle = this.particles[i];
			particle.clearForceAccum();
		} // for
	}
	
	/**
	 * Calls all the contact generators
	 * @function
	 * @returns {int} The number of generated contacts
	 * @since 0.0.0
	 */
	this.generateContacts = function() {
		var limit = this.maxContacts;
		
		for (i in this.contactGenerators) {
			var contactGenerator = this.contactGenerators[i];
			var used = contactGenerator.addContact(this.contacts, limit);
			if (this.contactEventsEnabled) {
				if (used > 0) {
					for (i = 0; i < used; i++) {
						var contact = this.contacts[this.contacts.length - i];
						this.contact(new ContactEvent(contact, contactGenerator.contactType));
					} // for
				} // for
			} // if
			limit -= used;
			
			if (limit <= 0) {
				break;
			} // if
		} // for
		
		return this.maxContacts - limit;
	}
	
	/**
	 * Integrates all the particles in this world forward in time
	 * by the given duration
	 * @function
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.integrate = function(delta) {
		for (i in this.particles) {
			var particle = this.particles[i];
			particle.integrate(delta);
		} // for
	}
	
	/**
	 * Process all physics for the particle world
	 * @function
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.runPhysics = function(delta) {
		this.applyGlobalForces(delta);
		this.forceRegistry.applyForces(delta);
		this.integrate(delta);
		var usedContacts = this.generateContacts();
		this.resolver.maxIt = usedContacts * 2;		
		this.resolver.resolveContacts(this.contacts, delta);
		this.contacts = [];
	}
	
	/**
	 * Draw all global force generators
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.drawGlobalForces = function() {
		for (j in this.globalForceGenerators) {
			var forceGenerator = this.globalForceGenerators[j];
			for (i in this.particles) {
				var particle = this.particles[i];
				forceGenerator.draw(particle);
			} // for
		} // for
	}
	
	/**
	 * Draw all contact generators
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.drawContactGenerators = function() {
		for (j in this.contactGenerators) {
			var contactGenerator = this.contactGenerators[j];
			contactGenerator.draw();
		} // for
	}
	
	/**
	 * Draw all particles
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.drawParticles = function() {
		for (i in this.particles) {
			var particle = this.particles[i];
			particle.draw();
		} // for
	}
	
	/**
	 * Adds a global force generator
	 * @function
	 * @param {ParticleForceGenerator} forceGenerator The global force generator to be added
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addGlobalForce = function(forceGenerator) {
		this.globalForceGenerators.push(forceGenerator);
	}
	
	/**
	 * Applies all global forces to all particles over time delta
	 * @function
	 * @param {int} delta Delta Time delta in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyGlobalForces = function(delta) {
		for (j in this.globalForceGenerators) {
			var forceGenerator = this.globalForceGenerators[j];
			for (i in this.particles) {
				var particle = this.particles[i];
				forceGenerator.applyForce(particle, delta);
			} // for
		} // for
	}
	
	/**
	 * Adds a global gravity force
	 * @function
	 * @param {Vector2} gravitation Optional gravitational pull
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addGlobalGravityForce = function(gravitation) {
		this.addGlobalForce(
			new ParticleGravityForceGenerator(gravitation)
		);
	}
			
	/**
	 * Adds a global drag force
	 * @function
	 * @param {float} k1 Velocity drag coefficient
	 * @param {float} k2 Velocity squared drag coefficient
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addGlobalDragForce = function(k1, k2) {
		this.addGlobalForce(
			new ParticleDragForceGenerator(k1, k2)
		);
	}
	
	/**
	 * Adds a window collision rectangle
	 * @function
	 * @param {float} collisionRadius Minimum distance between particle and window border
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addWindowCollisionBox = function(collisionRadius) {
		ParticleContactGeneratorFactory.createCollisionBox(
			this, this.particles, windowRect
		);
	}
	
	/**
	 * Draws visualization of the physical simulation
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function() {
		this.drawGlobalForces();
		this.forceRegistry.drawForceGenerators();
		this.drawContactGenerators();
		this.drawParticles();
	}
	
	/*
	 * Check flags
	 */
	if (this.flags & PARTICLE_WORLD_GRAVITY) {
		this.addGlobalGravityForce();
		
		if (debug) {
			console.debug("Added global gravity force");
		} // if
	} // if
	if (this.flags & PARTICLE_WORLD_DRAG) {
		this.addGlobalDragForce();
		
		if (debug) {
			console.debug("Added global drag force");
		} // if
	} // if
	if (this.flags & PARTICLE_WORLD_WINDOW_COLLISION) {
		this.addWindowCollisionBox();
		
		if (debug) {
			console.debug("Added window collision box");
		} // if
	} // if
	if (this.flags & PARTICLE_WORLD_CONTACT_EVENTS) {
		this.contactEventsEnabled = true;
		
		if (debug) {
			console.debug("Contact events enabled");
		} // if
	} // if
}
ParticleWorld.prototype = new Observable();