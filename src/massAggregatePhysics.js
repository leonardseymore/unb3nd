/**
 * @fileOverview Mass Aggregate Particle System
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class A particle is an object which has a position but no orientation
 * @constructor
 * @extends Observable
 * @param {Number} mass Optional mass

 */
function Particle(mass) {

  /*
   * Super constructor
   */
  Observable.call(this);

  /**
   * The position of this particle
   * @field
   * @type Array
   * @default Zero vector

   */
  this.pos = math.v2.create();

  /**
   * The velocity of this particle
   * @field
   * @type Array
   * @default Zero vector

   */
  this.vel = math.v2.create();

  /**
   * The acceleration of this particle
   * @field
   * @type Array
   * @default Zero vector

   */
  this.acc = math.v2.create();

  /**
   * Damping is a simple yet special property involved in slowing down moving objects 0 - 1, where 0 is full damping and 1 is no damping
   * @field
   * @type Number
   * @default 1.0

   */
  this.damping = 1.0;

  /**
   * Holds the inverse mass of the particle.
   * @private
   * @field
   * @type Number
   * @default 0, indicating infinite mass

   */
  this.inverseMass = 0;
  if (mass) {
    this.inverseMass = 1 / mass;
  } // if

  /**
   * The overall force accumulator
   * @private
   * @field
   * @type Array
   * @default Zero vector

   */
  this.forceAccum = math.v2.create();

  /**
   * Determines if point is near this particle
   * @function
   * @param {Array} point Point to test
   * @param {Number} distance Distance to test
   * @returns {boolean} true if supplied point is near this particle

   */
  this.isCloseToPoint = function (point, distance) {
    return math.v2.isWithin(this.pos, point, distance);
  };

  /**
   * Ensures this body has a finite mass
   * @function
   * @returns {boolean} true if this body has a finite mass

   */
  this.hasFiniteMass = function () {
    return this.inverseMass > 0;
  };

  /**
   * Adds an external force to this particle
   * @function
   * @param {Array} force The force to add to this particle
   * @returns {void}

   */
  this.applyForce = function (force) {
    math.v2.addMutate(this.forceAccum, force);
  };

  /**
   * Reset the force accumulator on this particle
   * @function
   * @returns {void}

   */
  this.clearForceAccum = function () {
    math.v2.zeroMutate(this.forceAccum);
  };

  /**
   * Sets the inverse mass of the particle
   * @function
   * @param {Number} inverseMass The inverse mass of the particle
   * @returns {void}

   */
  this.setInverseMass = function (inverseMass) {
    this.inverseMass = inverseMass;
  };

  /**
   * Sets the mass of the particle
   * @function
   * @param {Number} mass The mass of the particle
   * @returns {void}

   */
  this.setMass = function (mass) {
    if (mass == 0) {
      this.inverseMass = 0;
    } else {
      this.inverseMass = 1 / mass;
    } // if
  };

  /**
   * Gets the mass of the particle
   * @function
   * @returns {Number} mass The mass of the particle

   */
  this.getMass = function () {
    if (this.inverseMass == 0) {
      return 0;
    } else {
      return 1 / this.inverseMass;
    } // if
  };

  /**
   * Integrates the particle forward in time by the given amount.
   * Uses Newton-Euler integration function
   * @function
   * @param {int} delta The time delta in milliseconds
   * @returns {void}

   */
  this.integrate = function (delta) {
    var dt = delta / 1000;

    math.v2.addMutate(
      this.pos,
      math.v2.multScalar(this.vel, dt)
    );

    var resultingAcc = math.v2.add(
      this.acc,
      math.v2.multScalar(this.forceAccum, this.inverseMass)
    );

    math.v2.addMutate(
      this.vel,
      math.v2.multScalar(resultingAcc, dt)
    );

    math.v2.multScalarMutate(
      this.vel,
      Math.pow(this.damping, dt)
    );

    this.clearForceAccum();
  };

  /**
   * On die callback
   * @function
   * @returns {void}

   */
  this.ondie = undefined;

  /**
   * Die callback invoker
   * @function
   * @returns {void}

   */
  this.die = function () {
    if (this.ondie) {
      this.ondie();
    } // if
    this.dispatchEvent("die");
  };

  /**
   * Accepts a particle world visitor
   * @function
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitParticle(this);
  };

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this class

   */
  this.toString = function () {
    return "uid=" + this.uid;
  };
}
;
Particle.prototype = new Observable();

/**
 * @class A force registry for matching up force generators to particles
 * @constructor

 */
function ParticleForceRegistry() {

  /**
   * Registry entries
   * @field
   * @type {"particle":Particle, "forceGenerators":ParticleForceGenerator []}
   * @default []

   */
  this.entries = [];

  /**
   * Adds the force generator to the supplied particle
   * TODO: This is a very brute force function, we need a HashMap or similar datastructure
   * @function
   * @param {Particle} particle The particle to add a force generator to
   * @param {ParticleForceGenerator} forceGenerator The force generator to add to the particle
   * @returns {void}

   */
  this.add = function (particle, forceGenerator) {
    var entry;
    var found = false;
    var i = this.entries.length;
    while (i--) {
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
  };

  /**
   * Gets all force generators for the supplied particle
   * @function
   * @param {Particle} particle The particle to get the force generators for
   * @returns {ParticleForceGenerator []} All the force generators for the supplied particle, undefined if not found

   */
  this.getForceGenerators = function (particle) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      if (entry.particle === particle) {
        return entry.forceGenerators;
      } // if
    } // for

    return undefined;
  };

  /**
   * Removes all force generators for the supplied particle
   * @function
   * @param {Particle} particle The particle to remove the force generators from
   * @returns {void}

   */
  this.removeForceGenerators = function (particle) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      if (entry.particle === particle) {
        this.entries.splice(i, 1);
      } // if
    } // for
  };

  /**
   * Removes a specific force generator
   * @function
   * @param {ParticleForceGenerator} forceGenerator The specific force generator to remove
   * @return {void}

   */
  this.removeForceGenerator = function (forceGenerator) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      var j = entry.forceGenerators.length;
      while (j--) {
        var fg = entry.forceGenerators[j];
        if (fg === forceGenerator) {
          entry.forceGenerators.splice(j, 1);
        } // if
      } // if
    } // for
  };

  /**
   * Adds each force generator's force to every particle in the registry over the delta time
   * @function
   * @param {int} delta Delta time in milliseconds
   * @returns {void}

   */
  this.applyForces = function (delta) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      var particle = entry.particle;
      var forceGenerators = entry.forceGenerators;
      var j = forceGenerators.length;
      while (j--) {
        var forceGenerator = forceGenerators[j];
        forceGenerator.applyForce(particle, delta);
      } // for
    } // for
  };

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      var particle = entry.particle;
      var forceGenerators = entry.forceGenerators;
      var j = forceGenerators.length;
      while (j--) {
        var forceGenerator = forceGenerators[j];
        forceGenerator.accept(visitor, particle);
      } // for
    } // for
  };
}
;

/**
 * @class A particle force generator
 * @constructor
 * @abstract

 */
function ParticleForceGenerator() {

  /**
   * Apply force to the given mass over the delta time
   * @function
   * @abstract
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
  };

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @param {Particle} particle Particle that is currently affected by this generator
   * @returns {void}

   */
  this.accept = function (visitor, particle) {
  };

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return this;
  };
}
;

/**
 * @class A gravitational force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Array} gravition Gravitational force, defaults {@link constants.DEFAULT_GRAVITATIONAL_CONSTANT}

 */
function ParticleGravityForceGenerator(gravitation) {

  /**
   * The gravitational pull
   * @field
   * @type Array
   * @default Vector with {@link constants.DEFAULT_GRAVITATIONAL_CONSTANT} as Y-axis

   */
  this.gravitation = gravitation || math.v2.create([0, constants.DEFAULT_GRAVITATIONAL_CONSTANT]);

  /**
   * Apply gravity to the given mass over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    if (!particle.hasFiniteMass()) {
      if (EngineInstance.debug && EngineInstance.verbose) {
        console.debug("Particle %o has zero mass", particle);
      } // if
      return;
    } // if

    particle.applyForce(
      math.v2.multScalar(
        this.gravitation,
        particle.getMass()
      )
    );
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitGravityForceGenerator(this, particle);
  };

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return "Gravity: " + this.gravitation.toString();
  };
}
;
ParticleGravityForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A wind force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Array} direction Wind direction and strength

 */
function ParticleWindForceGenerator(direction) {

  /**
   * The wind direction and strength
   * @field
   * @type Array
   * @default Zero vector

   */
  this.direction = direction || math.v2.create();

  /**
   * Apply force to the given mass over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    if (!particle.hasFiniteMass()) {
      if (EngineInstance.debug && EngineInstance.verbose) {
        console.debug("Particle %o has zero mass, will not apply wind", particle);
      } // if
      return;
    } // if

    particle.applyForce(
      // scale force, since gravity is constant regardless of mass
      math.v2.multScalar(
        this.direction,
        particle.getMass()
      )
    );
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitWindForceGenerator(this, particle);
  };

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return "Wind: " + this.direction.toString();
  };
}
;
ParticleWindForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A drag force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Number} k1 Velocity drag coefficient
 * @param {Number} k2 Velocity squared drag coefficient

 */
function ParticleDragForceGenerator(k1, k2) {

  /**
   * Velocity drag coefficient
   * @field
   * @type Number
   * @default Defaults to {@link constants.DEFAULT_DRAG_VELOCITY_COEFF}

   */
  this.k1 = k1 || constants.DEFAULT_DRAG_VELOCITY_COEFF;

  /**
   * Velocity squared drag coefficient
   * @field
   * @type Number
   * @default Defaults to {@link constants.DEFAULT_DRAG_VELOCITY_SQUARED_COEFF}

   */
  this.k2 = k2 || constants.DEFAULT_DRAG_VELOCITY_SQUARED_COEFF;

  /**
   * Apply gravity to the given mass over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    var force = this.calculateForce(particle, delta);
    particle.applyForce(force);
  };

  /**
   * Calculate the force for the supplied particle over the time delta
   * @private
   * @function
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {Array} The force to apply to this particle

   */
  this.calculateForce = function (particle, delta) {

    var dragCoeff = math.v2.getMagnitude(particle.vel);
    dragCoeff = this.k1 * dragCoeff + this.k2 * dragCoeff * dragCoeff;


    var force = math.v2.normalize(particle.vel);
    math.v2.multScalarMutate(force, -dragCoeff);
    return force;
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitDragForceGenerator(this, particle);
  };

  /**
   * Converts the class to a string representation
   * @function
   * @return {string} The string representation of this class

   */
  this.toString = function () {
    return "Drag: k1=" + this.k1 + " ,k2=" + this.k2;
  };
}
;
ParticleDragForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A spring force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Particle} particleOther Particle at the other end of the spring
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length

 */
function ParticleSpringForceGenerator(particleOther, springConstant, restLength) {

  /**
   * Particle at the other end of the spring
   * @field
   * @type Particle
   * @default particleOther

   */
  this.particleOther = particleOther;

  /**
   * Holds the spring constant
   * @field
   * @type Number
   * @default springConstant

   */
  this.springConstant = springConstant;

  /**
   * Holds the spring's rest length
   * @field
   * @type Number
   * @default restLength

   */
  this.restLength = restLength;

  /**
   * Apply spring force to the given particle over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    var force = math.v2.create(particle.pos);
    math.v2.subMutate(force, this.particleOther.pos);

    var magnitude = math.v2.getMagnitude(force);
    magnitude = Math.abs(magnitude - this.restLength);
    magnitude *= this.springConstant;

    math.v2.normalizeMutate(force);
    math.v2.multScalarMutate(force, -magnitude);
    particle.applyForce(force);
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitSpringForceGenerator(this, particle);
  };
}
;
ParticleSpringForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A spring force generator
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Array} anchor Fixed point
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length

 */
function ParticleAnchoredSpringForceGenerator(anchor, springConstant, restLength) {

  /**
   * Anchor to which particle must be connected
   * @field
   * @type Array
   * @default anchor

   */
  this.anchor = anchor;

  /**
   * Holds the spring constant
   * @field
   * @type Number
   * @default springConstant

   */
  this.springConstant = springConstant;

  /**
   * Holds the spring's rest length
   * @field
   * @type Number
   * @default restLength

   */
  this.restLength = restLength;

  /**
   * Apply spring force to the given particle over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    var force = math.v2.create(particle.pos);
    math.v2.subMutate(force, this.anchor);

    var magnitude = math.v2.getMagnitude(force);
    magnitude = Math.abs(magnitude - this.restLength);
    magnitude *= this.springConstant;

    math.v2.normalizeMutate(force);
    math.v2.multScalarMutate(force, -magnitude);
    particle.applyForce(force);
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitAnchoredSpringForceGenerator(this, particle);
  };
}
;
ParticleAnchoredSpringForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class A bungee force generator applies a spring force only when extended
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Particle} at the other end of the spring
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length

 */
function ParticleBungeeForceGenerator(particleOther, springConstant, restLength) {

  /**
   * Particle at the other end of the spring
   * @field
   * @type Particle
   * @default particleOther

   */
  this.particleOther = particleOther;

  /**
   * Holds the spring constant
   * @field
   * @type Number
   * @default springConstant

   */
  this.springConstant = springConstant;

  /**
   * Holds the spring's rest length
   * @field
   * @type Number
   * @default restLength

   */
  this.restLength = restLength;

  /**
   * Apply spring force to the given particle over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    var force = math.v2.create(particle.pos);
    math.v2.subMutate(force, this.particleOther.pos);

    var magnitude = math.v2.getMagnitude(force);
    if (magnitude <= this.restLength) {
      return;
    } // if

    magnitude = this.springConstant * (magnitude - this.restLength);

    math.v2.normalizeMutate(force);
    math.v2.multScalarMutate(force, -magnitude);
    particle.applyForce(force);
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitBungeeForceGenerator(this, particle);
  };
}
;
ParticleBungeeForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class An anchored bungee force generator applies a spring force only when extended
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Array} anchor Fixed point
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length

 */
function ParticleAnchoredBungeeForceGenerator(anchor, springConstant, restLength) {

  /**
   * Anchor to which particle must be connected
   * @field
   * @type Array
   * @default anchor

   */
  this.anchor = anchor;

  /**
   * Holds the spring constant
   * @field
   * @type Number
   * @default springConstant

   */
  this.springConstant = springConstant;

  /**
   * Holds the spring's rest length
   * @field
   * @type Number
   * @default restLength

   */
  this.restLength = restLength;

  /**
   * Apply spring force to the given particle over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    var force = math.v2.create(particle.pos);
    math.v2.subMutate(force, this.anchor);

    var magnitude = math.v2.getMagnitude(force);
    if (magnitude <= this.restLength) {
      return;
    } // if
    magnitude = this.springConstant * (magnitude - this.restLength);

    math.v2.normalizeMutate(force);
    math.v2.multScalarMutate(force, -magnitude);
    particle.applyForce(force);
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitAnchoredBungeeForceGenerator(this, particle);
  };
}
;
ParticleAnchoredBungeeForceGenerator.prototype = new ParticleForceGenerator();

/**
 * A buoyancy force generator applies a spring force. Since particles don't have volume
 * this generator uses additional parameters to simulate buoyancy force on the particle.
 * TODO: Buoyancy force generator needs work
 * @class
 * @constructor
 * @extends ParticleForceGenerator
 * @param {Array} anchor Fixed point on the water surface
 * @param {Number} maxDepth The maximum submersion depth before object is completely submerged
 * @param {Number} volume The volume of the object
 * @param {Number} liquidDensity The density of the liquid. Pure water has 1000 kg per cubic meter.

 */
function ParticleBuoyancyForceGenerator(anchor, maxDepth, volume, liquidDensity) {

  /**
   * Fixed point
   * @field
   * @type Array
   * @default anchor

   */
  this.anchor = anchor;

  /**
   * The maximum submersion depth before object is completely submerged
   * @field
   * @type Number
   * @default maxDepth

   */
  this.maxDepth = maxDepth;

  /**
   * The volume of the object
   * @field
   * @type Number
   * @default volume

   */
  this.volume = volume;

  /**
   * The density of the liquid
   * @field
   * @type Number
   * @default 1000.0

   */
  this.liquidDensity = liquidDensity || 1000.0;

  /**
   * Apply spring force to the given particle over the delta time
   * @function
   * @override
   * @param {Particle} particle The particle to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (particle, delta) {
    var depth = this.anchor[1] - particle.pos[1];
    if (depth <= -this.maxDepth) {
      return;
    } // if

    var force = math.v2.create();
    if (depth > this.maxDepth) {
      force[1] = this.liquidDensity * this.volume;
      particle.applyForce(force);

      return;
    } // if

    // TODO: determine partially emerged force
    //force.y = this.liquidDensity * this.volume; //* (depth - this.maxDepth) / 2 * this.maxDepth;
    //particle.applyForce(force);
  };

  /**
   * Accepts the supplied particle visitor
   * @function
   * @override
   */
  this.accept = function (visitor, particle) {
    visitor.visitBuoyancyForceGenerator(this, particle);
  };
}
;
ParticleBuoyancyForceGenerator.prototype = new ParticleForceGenerator();

/**
 * @class Particle force generator factory
 * @constructor

 */
function ParticleForceGeneratorFactory() {
}
;

/**
 * Creates a gravity force generator for a single particle only
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The particle to add the generator to
 * @returns {void}

 */
ParticleForceGeneratorFactory.createGravity = function (forceRegistry, particle) {
  forceRegistry.add(particle, new ParticleGravityForceGenerator());
};

/**
 * Creates a wind force generator for a single particle only
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The particle to add the generator to
 * @param {Array} direction The direction and strength of the force
 * @returns {void}

 */
ParticleForceGeneratorFactory.createWind = function (forceRegistry, particle, direction) {
  forceRegistry.add(particle, new ParticleWindForceGenerator(direction));
};

/**
 * Creates a drag force generator for a single particle only
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The particle to add the generator to
 * @param {Number} k1 Velocity coefficient
 * @param {Number} k2 Velocity squared coefficient
 * @returns {void}

 */
ParticleForceGeneratorFactory.createDrag = function (forceRegistry, particle, k1, k2) {
  forceRegistry.add(particle, new ParticleDragForceGenerator(k1, k2));
};

/**
 * Generates 2 spring force generators between the particles and adds it to the supplied registry
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} p1 The first particle
 * @param {Particle} p2 The second particle
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length
 * @returns {void}

 */
ParticleForceGeneratorFactory.createSpring = function (forceRegistry, p1, p2, springConstant, restLength) {
  var p1F = new ParticleSpringForceGenerator(p2, springConstant, restLength);
  forceRegistry.add(p1, p1F);
  p2.addEventListener("die", function () {
    if (EngineInstance.debug) {
      console.debug("Removing force generator for dead particle %s", this.toString());
    } // if

    forceRegistry.removeForceGenerator(p1F);
  });

  var p2F = new ParticleSpringForceGenerator(p1, springConstant, restLength);
  forceRegistry.add(p2, p2F);
  p1.addEventListener("die", function () {
    if (EngineInstance.debug) {
      console.debug("Removing force generator for dead particle %s", this.toString());
    } // if

    forceRegistry.removeForceGenerator(p2F);
  });
};

/**
 * Generates a spring force generator between a particle and a fixed point
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The first particle
 * @param {Array} anchor The anchor point
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length
 * @returns {void}

 */
ParticleForceGeneratorFactory.createAnchoredSpring = function (forceRegistry, particle, anchor, springConstant, restLength) {
  forceRegistry.add(particle, new ParticleAnchoredSpringForceGenerator(anchor, springConstant, restLength));
}

/**
 * Generates 2 bungee force generators between the particles and adds it to the supplied registry
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} p1 The first particle
 * @param {Particle} p2 The second particle
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length
 * @returns {void}

 */
ParticleForceGeneratorFactory.createBungee = function (forceRegistry, p1, p2, springConstant, restLength) {
  var p1F = new ParticleBungeeForceGenerator(p2, springConstant, restLength);
  forceRegistry.add(p1, p1F);
  p2.addEventListener("die", function () {
    if (EngineInstance.debug) {
      console.debug("Removing bungee force generator for dead particle %s", this.toString());
    } // if

    forceRegistry.removeForceGenerator(p1F);
  });

  var p2F = new ParticleBungeeForceGenerator(p1, springConstant, restLength);
  forceRegistry.add(p2, p2F);
  p1.addEventListener("die", function () {
    if (EngineInstance.getInstance().debug) {
      console.debug("Removing bungee force generator for dead particle %s", this.toString());
    } // if

    forceRegistry.removeForceGenerator(p2F);
  });
};

/**
 * Generates an anchored bungee force generator between a particle and a fixed point
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The first particle
 * @param {Array} anchor The anchor point
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length
 * @returns {void}

 */
ParticleForceGeneratorFactory.createAnchoredBungee = function (forceRegistry, particle, anchor, springConstant, restLength) {
  forceRegistry.add(particle, new ParticleAnchoredBungeeForceGenerator(anchor, springConstant, restLength));
};

/**
 * Generates a buoyancy force generator between a particle and a fixed point
 * @function
 * @static
 * @param {ParticleForceRegistry} forceRegistry The force registry to add the generator to
 * @param {Particle} particle The first particle
 * @param {Array} anchor The anchor point
 * @param {Number} maxDepth
 * @param {Number} volume
 * @param {Number} liquidDensity
 * @returns {void}

 */
ParticleForceGeneratorFactory.createBuoyancy = function (forceRegistry, particle, anchor, maxDepth, volume, liquidDensity) {
  forceRegistry.add(particle, new ParticleBuoyancyForceGenerator(anchor, maxDepth, volume, liquidDensity));
};

/**
 * COLLISION DETECTION
 */

/**
 * Enumeration of all contact types
 * @enum {number}
 */
var CONTACT_TYPE = {
  BOX:1, // bounding box
  INTER:2, // inter particle collision
  CABLE:4, // cable constraint
  CABLE_ANCHORED:8, // cable constraint
  ROD:16, // rod constraint
  ROD_ANCHORED:32 // rod anchored constraint
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

 */
function ParticleContact() {

  /**
   * Holds the particles that are involved in the contact. The second may be
   * omitted in the case of a contact with the environment.
   * @field
   * @type Particle []
   * @default []

   */
  this.particles = [];

  /**
   * Holds the normal restitution coefficient at the contact
   * @field
   * @type Number
   * @default 0.0

   */
  this.restitution = 0.0;

  /**
   * Holds the contact normal
   * @field
   * @type Array
   * @default Zero vector

   */
  this.contactNormal = math.v2.create();

  /**
   * Penetration depth in the direction of the contact normal
   * @field
   * @type Number
   * @default 0.0

   */
  this.penetration = 0.0;

  /**
   * Resolves this contact for both veolcity and interpenetration
   * @function
   * @protected
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.resolve = function (delta) {
    this.resolveVelocity(delta);
    this.resolveInterpenetration(delta);
  };

  /**
   * Calculate separating velocity at this contact
   * @function
   * @protected
   * @returns {Number} Separating velocity at this contact

   */
  this.calculateSeparatingVelocity = function () {
    var relativeVelocity = math.v2.create(this.particles[0].vel);
    if (this.particles[1]) {
      math.v2.subMutate(
        relativeVelocity,
        this.particles[1].vel
      );
    } // if
    return math.v2.dotProduct(relativeVelocity, this.contactNormal);
  };

  /**
   * Handles impulse calculations for this collision
   * @function
   * @private
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.resolveVelocity = function (delta) {
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
    var accCausedVelocity = math.v2.create(this.particles[0].acc);
    if (this.particles[1]) {
      math.v2.subMutate(
        accCausedVelocity,
        this.particles[1].acc
      );
    } // if
    var accCausedSepVelocity = math.v2.dotProduct(accCausedVelocity, this.contactNormal) * dt;

    // If we've got a closing velocity due to acceleration build-up,
    // remove it from the new separating velocity.
    if (accCausedSepVelocity < 0) {
      newSepVelocity += this.restitution * accCausedSepVelocity;

      // Make sure we haven't removed more than was there to remove.
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
    var impulsePerIMass = math.v2.multScalar(this.contactNormal, impulse);

    // apply impulses proportional to inverse mass
    // in the direction of the contact
    math.v2.addMutate(
      this.particles[0].vel,
      math.v2.multScalar(impulsePerIMass, this.particles[0].inverseMass)
    );

    if (this.particles[1]) {
      math.v2.addMutate(
        this.particles[1].vel,
        math.v2.multScalar(impulsePerIMass, -this.particles[1].inverseMass)
      );
    } // if
  };

  /**
   * Handles interpenetration resolution for this contact
   * @function
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.resolveInterpenetration = function (delta) {
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
    var movePerIMass = math.v2.multScalar(
      this.contactNormal,
      -this.penetration / totalInverseMass
    );

    math.v2.addMutate(
      this.particles[0].pos,
      movePerIMass.multScalar(this.particles[0].inverseMass)
    );

    if (this.particles[1]) {
      math.v2.addMutate(
        this.particles[1].pos,
        movePerIMass.multScalar(this.particles[1].inverseMass)
      );
    } // if
  };
}
;

/**
 * @class The contact resolution routine for particle contacts. One resolver
 * instance can be shared for the whole simulation.
 * @constructor

 */
function ParticleContactResolver() {
  /**
   * Number of allowable iterations
   * Recommend: Minimally number of contacts, as a single contact is resolved
   *            per iteration.
   * @field
   * @type int
   * @default 0

   */
  this.maxIt = 0;

  /**
   * Resolves the set of particle contacts for both penetration and velocity
   * @function
   * @param {ParticleContact []} contacts All contacts to resolve
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.resolveContacts = function (contacts, delta) {
    var it = 0;
    while (it < this.maxIt) {
      // find the contact with the largest closing velocity
      var max = 0;
      var maxContact = contacts[0];
      var i = contacts.length;
      while (i--) {
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
  };
}
;

/**
 * @class Responsible for generating contacts
 * @constructor

 */
function ParticleContactGenerator() {

  /**
   * Contact type
   * @field
   * @type CONTACT_TYPE
   * @default undefined

   */
  this.contactType = undefined;

  /**
   * Sets the contact type
   * @functino
   * @param {int} contactType The type of contact generated by this generator
   * @returns {void}
   * @throws Error If an invalid contact type was specified

   */
  this.setContactType = function (contactType) {
    this.contactType = contactType;
  };

  /**
   * Adds contacts
   * @function
   * @abstract
   * @param {ParticleContact []} contacts Contacts to append to
   * @param {int} limit Maximum number of contacts that may be added
   * @return {int} The number of contacts added

   */
  this.addContact = function (contacts, limit) {
  };

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
  };
}
;

/**
 * @class Links connect two particles together, generating a contact if
 * they violate the constraints of their link. It is used as a
 * base class for cables and rods, and could be used as a base
 * class for springs with a limit to their extension.
 * @constructor
 * @extends ParticleContactGenerator

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

   */
  this.particles = [];

  /**
   * Determines the current length of the link, in other words
   * the distance between the two particles
   * @function
   * @protected
   * @return {Number} The distance between the two particles

   */
  this.getCurrentLength = function () {
    return math.v2.getDistance(this.particles[0].pos, this.particles[1].pos);
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
   * parameter is assumed to be at least one (zero isn�t valid),
   * and the return value is either 0, if the cable wasn�t
   * overextended, or one if a contact was needed.
   * @function
   * @abstract
   * @param {ParticleContact []} contacts Contacts array to be written to. Append
   *        contacts to end of array using contacts.push
   * @param {int} limit The maximum number of contacts that may be appended to the array
   * @return {int} The number of contacts that have been written to

   */
  this.addContact = function (contacts, limit) {
  }
}
ParticleLinkContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Cables link a pair of particles, generating a contact if they stray too far
 * apart.
 * @constructor
 * @extends ParticleLinkContactGenerator
 * @param {Number} maxLength Maximum length of the cable
 * @param {Number} restitution Restitution (bounciness) of the cable

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
   * @type Number
   * @default 0.0

   */
  this.maxLength = maxLength || 0.0;

  /**
   * Restitution (bounciness) of the cable
   * @field
   * @type Number
   * @default 0.0

   */
  this.restitution = restitution || 0.0;

  /**
   * Creates a contact needed to keep the cable from overextending
   * @function
   * @override
   * @return {int} The number of contacts that have been written to

   */
  this.addContact = function (contacts, limit) {
    var length = this.getCurrentLength();

    if (length <= this.maxLength) {
      return 0;
    } // if

    var contact = new ParticleContact();

    contact.particles[0] = this.particles[0];
    contact.particles[1] = this.particles[1];

    var normal = math.v2.sub(
      this.particles[1].pos,
      this.particles[0].pos
    );
    math.v2.normalizeMutate(normal);
    contact.contactNormal = normal;

    contact.penetration = this.maxLength - length;
    contact.restitution = this.restitution;

    contacts.push(contact);

    return 1;
  }

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitCableContactGenerator(this);
  }
}
ParticleCableContactGenerator.prototype = new ParticleLinkContactGenerator();

/**
 * @class An anchored cable contact generator
 * @constructor
 * @extends ParticleContactGenerator
 * @param {Particle} particle Particle fixed to this anchor
 * @param {Array} anchor Fixed point
 * @param {Number} maxLength Maximum length of the cable
 * @param {Number} restitution Restitution (bounciness) of the cable

 */
function ParticleAnchoredCableContactGenerator(particle, anchor, maxLength, restitution) {

  /*
   * Super constructor
   */
  ParticleContactGenerator.call(this);
  this.setContactType(CONTACT_TYPE.CABLE_ANCHORED);

  /**
   * The particle attached to the anchor
   * @field
   * @type Particle
   * @default 0.0

   */
  this.particle = particle;

  /**
   * Anchor to which particle must be connected
   * @field
   * @type Array
   * @default anchor

   */
  this.anchor = anchor;

  /**
   * Maximum length of the cable
   * @field
   * @type Number
   * @default 0.0

   */
  this.maxLength = maxLength || 0.0;

  /**
   * Restitution (bounciness) of the cable
   * @field
   * @type Number
   * @default 0.0

   */
  this.restitution = restitution || 0.0;

  /**
   * Determines the current length of the cable, in other words
   * the distance between the anchor and the particle
   * @function
   * @protected
   * @return {Number} The distance between the two particles

   */
  this.getCurrentLength = function () {
    var relativePos = math.v2.sub(
      this.particle.pos,
      this.anchor
    );
    return math.v2.getMagnitude(relativePos);
  }

  /**
   * Creates a contact needed to keep the cable from overextending
   * @function
   * @override
   * @return {int} The number of contacts that have been written to

   */
  this.addContact = function (contacts, limit) {
    var length = this.getCurrentLength();

    if (length <= this.maxLength) {
      return 0;
    } // if

    var contact = new ParticleContact();
    contact.particles[0] = this.particle;
    var normal = math.v2.sub(
      this.particle.pos,
      this.anchor
    );
    math.v2.inverseMutate(normal);
    math.v2.normalizeMutate(normal);

    contact.contactNormal = normal;
    contact.penetration = this.maxLength - length;
    contact.restitution = this.restitution;

    contacts.push(contact);

    return 1;
  }

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitAnchoredCableContactGenerator(this);
  }
}
ParticleAnchoredCableContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Cables link a pair of particles, generating a contact if they stray too far
 * apart or too close
 * @constructor
 * @extends ParticleLinkContactGenerator
 * @param {Number} length Length of the rod

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
   * @type Number
   * @default 0.0

   */
  this.length = length || 0.0;

  /**
   * Creates a contact needed to keep the cable from overextending
   * @function
   * @override
   * @return {int} The number of contacts that have been written to

   */
  this.addContact = function (contacts, limit) {
    var currentLength = this.getCurrentLength();
    if (currentLength == this.length) {
      return 0;
    } // if

    var contact = new ParticleContact();
    contact.particles[0] = this.particles[0];
    contact.particles[1] = this.particles[1];

    var normal = math.v2.sub(
      this.particles[1].pos,
      this.particles[0].pos
    );
    math.v2.normalizeMutate(normal);

    if (currentLength > this.length) {
      contact.contactNormal = normal;
      contact.penetration = this.length - currentLength;
    } else {
      contact.contactNormal = math.v2.multScalar(normal, -1);
      contact.penetration = currentLength - this.length;
    } // if

    // always use zero resitution (no bounciness)
    contact.restitution = 0;

    contacts.push(contact);

    return 1;
  }

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitRodContactGenerator(this);
  }
}
ParticleRodContactGenerator.prototype = new ParticleLinkContactGenerator();

/**
 * @class An anchored rod contact generator
 * @constructor
 * @extends ParticleContactGenerator
 * @param {Particle} particle Particle fixed to this anchor
 * @param {Array} anchor Fixed point
 * @param {Number} length Length of this rod

 */
function ParticleAnchoredRodContactGenerator(particle, anchor, length) {

  /*
   * Super constructor
   */
  ParticleContactGenerator.call(this);
  this.setContactType(CONTACT_TYPE.ROD_ANCHORED);

  /**
   * The particle attached to the anchor
   * @field
   * @type Particle
   * @default 0.0

   */
  this.particle = particle;

  /**
   * Anchor to which particle must be connected
   * @field
   * @type Array
   * @default anchor

   */
  this.anchor = anchor;

  /**
   * Maximum length of the cable
   * @field
   * @type Number
   * @default 0.0

   */
  this.length = length || 0.0;

  /**
   * Determines the current length of the cable, in other words
   * the distance between the anchor and the particle
   * @function
   * @protected
   * @return {Number} The distance between the two particles

   */
  this.getCurrentLength = function () {
    return math.v2.getDistance(this.particle.pos, this.anchor);
  }

  /**
   * Creates a contact needed to keep the cable from overextending
   * @function
   * @override
   * @return {int} The number of contacts that have been written to

   */
  this.addContact = function (contacts, limit) {
    var currentLength = this.getCurrentLength();

    var contact = new ParticleContact();
    contact.particles[0] = this.particle;
    var normal = math.v2.sub(
      this.particle.pos,
      this.anchor
    );
    math.v2.normalizeMutate(normal);

    if (currentLength > this.length) {
      contact.contactNormal = math.v2.inverse(normal);
      contact.penetration = this.length - currentLength;
    } else {
      contact.contactNormal = normal;
      contact.penetration = currentLength - this.length;
    } // if
    contact.restitution = 0;

    contacts.push(contact);

    return 1;
  }

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitAnchoredRodContactGenerator(this);
  }
}
ParticleAnchoredRodContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Responsible for generating collision contacts between particles
 * @constructor
 * @extend ParticleContactGenerator

 */
function ParticleCollisionContactGenerator(collisionRadius) {

  /**
   * Minimum distance allowed between particles
   * @field
   * @type Number
   * @default 5.0

   */
  this.collisionRadius = collisionRadius || 5.0;
  this.setContactType(CONTACT_TYPE.INTER);

  /**
   * All particles to detect collisions between
   * @field
   * @type Particle []
   * @default []

   */
  this.particles = [];

  /**
   * Adds contacts
   * @function
   * @override
   * @returns {void}

   */
  this.addContact = function (contacts, limit) {
    var usedContacts = 0;
    var i = this.particles.length;
    while (i--) {
      if (usedContacts >= limit) {
        break;
      } // if

      var particle = this.particles[i];
      var j = this.particles.length;
      while (j--) {
        if (i == j) {
          continue;
        } // if

        var particleOther = this.particles[j];
        var normal = math.v2.sub(particle.pos, particleOther.pos);
        var distance = math.v2.getMagnitude(normal);
        if (distance < this.collisionRadius) {
          math.v2.normalizeMutate(normal);
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
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitCollisionContactGenerator(this);
  }
}
ParticleCollisionContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Responsible for generating collision contacts between particles
 * @constructor
 * @extends ParticleContactGenerator
 * @param {Rectangle} box The boundaries in which a contact may live
 * @param {Number} collisionRadius Minimum allowable distance between a particle and the boundaries

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

   */
  this.box = box;

  /**
   * Collision rectangle
   * @field
   * @type Number
   * @default 0.0

   */
  this.collisionRadius = collisionRadius || 0.0;

  /**
   * All particles to detect collisions between
   * @field
   * @type Particle []
   * @default []

   */
  this.particles = [];

  /**
   * Adds contacts
   * @function
   * @override
   * @returns {void}

   */
  this.addContact = function (contacts, limit) {
    var usedContacts = 0;
    var i = this.particles.length;
    while (i--) {
      if (usedContacts >= limit) {
        break;
      } // if

      var particle = this.particles[i];
      if (!box.shrink(this.collisionRadius).isPointInside(particle.pos)) {
        var normal = math.v2.create();
        var depth = 0;
        if (particle.pos[0] < this.box.pos[0] + this.collisionRadius) {
          normal[0] = 1;
          normal[1] = 0;
          depth = particle.pos[0] - this.box.pos[0] - this.collisionRadius;
        } // if

        if (particle.pos[0] > this.box.pos[0] + this.box.width + this.collisionRadius) {
          normal[0] = -1;
          normal[1] = 0;
          depth = this.box.pos[0] + this.box.width + this.collisionRadius - particle.pos[0];
        } // if

        if (particle.pos[1] < this.box.pos[1] + this.collisionRadius) {
          normal[0] = 0;
          normal[1] = 1;
          depth = particle.pos[1] - this.box.pos[1] - this.collisionRadius;
        } // if

        if (particle.pos[1] > this.box.pos[1] + this.box.height + this.collisionRadius) {
          normal[0] = 0;
          normal[1] = -1;
          depth = this.box.pos[1] + this.box.height + this.collisionRadius - particle.pos[1];
        } // if

        var particleContact = new ParticleContact();
        particleContact.particles[0] = particle;
        particleContact.contactNormal = normal;
        particleContact.penetration = depth;
        particleContact.restitution = constants.DEFAULT_COLLISION_RESTITUTION;
        contacts.push(particleContact);
        usedContacts++;
      } // if
    } // for
    return usedContacts;
  }

  /**
   * Accepts a particle world visitor
   * @method
   * @abstract
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitBoxCollisionContactGenerator(this);
  }
}
ParticleBoxContactGenerator.prototype = new ParticleContactGenerator();

/**
 * @class Factory to create particle contact generators
 * @constructor

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
 * @param {Number} collisionRadius Optional minimum allowable distance between bounding box and particle
 * @returns {void}

 */
ParticleContactGeneratorFactory.createCollisionBox = function (particleWorld, particles, collisionBox, collisionRadius) {
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
 * @param {Number} collisionRadius The minimum allowable distance between the particles
 * @returns {void}

 */
ParticleContactGeneratorFactory.createCollisionDetection = function (particleWorld, particles, collisionRadius) {
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
 * @param {Number} maxLength The maximum length of the cable
 * @param {Number} restitution The cable's restitution
 * @returns {void}

 */
ParticleContactGeneratorFactory.createCable = function (particleWorld, particle, particleOther, maxLength, restitution) {
  var generator = new ParticleCableContactGenerator(maxLength, restitution);
  generator.particles[0] = particle;
  generator.particles[1] = particleOther;
  particleWorld.addContactGenerator(generator);
}

/**
 * Creates an anchored cable contact generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particle} particle The first particle
 * @param {Array} anchor The anchor to attach the particle to
 * @param {Number} maxLength The maximum length of the cable
 * @param {Number} restitution The cable's restitution
 * @returns {void}

 */
ParticleContactGeneratorFactory.createAnchoredCable = function (particleWorld, particle, anchor, maxLength, restitution) {
  var generator = new ParticleAnchoredCableContactGenerator(particle, anchor, maxLength, restitution);
  generator.particle = particle;
  particleWorld.addContactGenerator(generator);
}

/**
 * Creates a rod contact generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particle} particle The first particle
 * @param {Particle} particleOther The second particle
 * @param {Number} length The length of the rod
 * @returns {void}

 */
ParticleContactGeneratorFactory.createRod = function (particleWorld, particle, particleOther, length) {
  var generator = new ParticleRodContactGenerator(length);
  generator.particles[0] = particle;
  generator.particles[1] = particleOther;
  particleWorld.addContactGenerator(generator);
}

/**
 * Creates an anchored rod contact generator
 * @function
 * @static
 * @param {ParticleWorld} particleWorld The particle world to add the generator to
 * @param {Particle} particle The first particle
 * @param {Array} anchor The anchor to attach the particle to
 * @param {Number} length The length of the rod
 * @returns {void}

 */
ParticleContactGeneratorFactory.createAnchoredRod = function (particleWorld, particle, anchor, length) {
  var generator = new ParticleAnchoredRodContactGenerator(particle, anchor, length);
  generator.particle = particle;
  particleWorld.addContactGenerator(generator);
}

/**
 * Gravity on flag
 * @field
 * @constant
 * @type int
 * @default 1

 */
var PARTICLE_WORLD_GRAVITY = 1;

/**
 * Drag on flag
 * @field
 * @constant
 * @type int
 * @default 2

 */
var PARTICLE_WORLD_DRAG = 2;

/**
 * Particles should collide with worldToWindow rect
 * @field
 * @constant
 * @type int
 * @default 4

 */
var PARTICLE_WORLD_WINDOW_COLLISION = 4;

/**
 * Are contact events enabled
 * @field
 * @constant
 * @type int
 * @default 8

 */
var PARTICLE_WORLD_CONTACT_EVENTS = 8;

/**
 * All on flag
 * @field
 * @constant
 * @type int
 * @default 2

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

 */
function ContactEvent(contact, contactType) {

  /**
   * The contact that was generated
   * @field
   * @type ParticleContact
   * @default contact

   */
  this.contact = contact;

  /**
   * The type of contact that was generated
   * @field
   * @type CONTACT_TYPE
   * @default contact

   */
  this.contactType = contactType;
}

/**
 * @class Visitor interface to visit the particle world
 * @constructor

 */
function ParticleWorldVisitor() {

  /**
   * @method
   * @abstract
   * Visits the particle world
   * @param {ParticleWorld} world The visited particle world
   * @return void
   */
  this.visitWorld = function (world) {
  }

  /**
   * @method
   * @abstract
   * Visits the particle
   * @param {Particle} particle The visited particle
   * @return void
   */
  this.visitParticle = function (particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a gravity force generator
   * @param {ParticleGravityForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitGravityForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a gravity force generator
   * @param {ParticleGravityForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitWindForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a drag generator
   * @param {ParticleDragForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitDragForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a spring generator
   * @param {ParticleSpringForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitSpringForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a spring generator
   * @param {ParticleAnchoredSpringForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitAnchoredSpringForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a bungee generator
   * @param {ParticleBungeeForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitBungeeForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a drag generator
   * @param {ParticleAnchoredBungeeForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitAnchoredBungeeForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits a drag generator
   * @param {ParticleBuoyancyForceGenerator} forceGenerator The visited force generator
   * @param {Particle} particle The particle currently affected by this force generator
   * @return void
   */
  this.visitBuoyancyForceGenerator = function (forceGenerator, particle) {
  }

  /**
   * @method
   * @abstract
   * Visits the particle cable contact generator
   * @param {ParticleCableContactGenerator} contactGenerator The visited particle contact generator
   * @return void
   */
  this.visitCableContactGenerator = function (contactGenerator) {
  }

  /**
   * @method
   * @abstract
   * Visits the anchored particle cable contact generator
   * @param {ParticleAnchoredCableContactGenerator} contactGenerator The visited particle contact generator
   * @return void

   */
  this.visitAnchoredCableContactGenerator = function (contactGenerator) {
  }

  /**
   * @method
   * @abstract
   * Visits the particle rod contact generator
   * @param {ParticleRodContactGenerator} contactGenerator The visited particle contact generator
   * @return void
   */
  this.visitRodContactGenerator = function (contactGenerator) {
  }

  /**
   * @method
   * @abstract
   * Visits the anchored particle rod contact generator
   * @param {ParticleAnchoredRodContactGenerator} contactGenerator The visited particle contact generator
   * @return void

   */
  this.visitAnchoredRodContactGenerator = function (contactGenerator) {
  }

  /**
   * @method
   * @abstract
   * Visits the particle colllision contact generator
   * @param {ParticleCollisionContactGenerator} contactGenerator The visited particle contact generator
   * @return void
   */
  this.visitCollisionContactGenerator = function (contactGenerator) {
  }

  /**
   * @method
   * @abstract
   * Visits the particle box collision contact generator
   * @param {ParticleBoxContactGenerator} contactGenerator The visited particle contact generator
   * @return void
   */
  this.visitBoxCollisionContactGenerator = function (contactGenerator) {
  }
}

/**
 * @class Keeps track of all particles
 * @constructor
 * @extends Observable
 * @param {int} flags Initial value flags

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

   */
  this.contactEventsEnabled = false;

  /**
   * On contact event callback
   * @field
   * @type function
   * @default undefined

   */
  this.oncontact = undefined;

  /**
   * On contact callback invoker
   * @function
   * @param {ContactEvent} e The event object
   * @returns {void}

   */
  this.contact = function (e) {
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

   */
  this.particles = [];

  /**
   * Holds all the force generators
   * @field
   * @type ParticleForceRegistry
   * @default new ParticleForceRegistry()

   */
  this.forceRegistry = new ParticleForceRegistry();

  /**
   * Resolver for contacts
   * @field
   * @type ParticleContactResolver
   * @default new ParticleContactResolver()

   */
  this.resolver = new ParticleContactResolver();

  /**
   * Particle contact generators
   * @field
   * @type ParticleContactGenerator []
   * @default []

   */
  this.contactGenerators = [];

  /**
   * All particle contacts
   * @field
   * @type ParticleContact []
   * @default []

   */
  this.contacts = [];

  /**
   * The maximum allowable number of contacts
   * @field
   * @type int
   * @default 100

   */
  this.maxContacts = 100;

  /**
   * Force generators applied to all particles
   * @field
   * @type ParticleForceGenerator []
   * @default []

   */
  this.globalForceGenerators = [];

  /**
   * Particle world state flags
   * @field
   * @type int
   * @default 0

   */
  this.flags = flags || 0;

  /**
   * Adds a contact generator
   * @function
   * @param {ParticleContactGenerator} contactGenerator The contact generator to add
   * @return {int} The total number of contact generators

   */
  this.addContactGenerator = function (contactGenerator) {
    this.contactGenerators.push(contactGenerator);

    // TODO: every contact generator should clean up after itself rather
    if (contactGenerator.particles) {
      if (contactGenerator.particles[0]) {
        contactGenerator.particles[0].addEventListener("die", function () {
          particleWorld.removeContactGenerator(contactGenerator);
        });
      } // if

      if (contactGenerator.particles[1]) {
        contactGenerator.particles[1].addEventListener("die", function () {
          particleWorld.removeContactGenerator(contactGenerator);
        });
      } // if
    } // if
  };

  /**
   * Removes a contact generator
   * @function
   * @param {ParticleContactGenerator} contactGenerator The contact generator to remove
   * @return {void}

   */
  this.removeContactGenerator = function (contactGenerator) {
    var i = this.contactGenerators.length;
    while (i--) {
      var cg = this.contactGenerators[i];
      if (cg === contactGenerator) {
        this.contactGenerators.splice(i, 1);
      } // if
    } // for
  };

  /**
   * Adds a new particle to the simulation
   * @function
   * @param {Particle} particle The new particle to add
   * @returns {int} The total number of particles in the simulation

   */
  this.addParticle = function (particle) {
    return this.particles.push(particle);
  }

  /**
   * Removes a particle from the simulation
   * @function
   * @param {Particle} particle The particle to remove
   * @returns {Particle} The removed particle, undefied if not removed

   */
  this.removeParticle = function (particle) {
    var removedParticle = undefined;
    var i = this.particles.length;
    while (i--) {
      var el = this.particles[i];
      if (el === particle) {
        if (EngineInstance.debug) {
          console.debug("Removing particle %s", particle.toString());
        } // if

        var removedParticle = this.particles.splice(i, 1);
        particle.die();
        this.forceRegistry.removeForceGenerators(particle);

        if (EngineInstance.debug) {
          console.debug("Removing particle %d", i);
        } // if

        return removedParticle;
      } // if
    } // for
    return removedParticle;
  }

  /**
   * Gets the first particle within the specified radius in world space
   * @function
   * @param {Array} point The world point at which to look
   * @param {Number} radius The search radius
   * @returns {Particle} The particle, undefined if none were found

   */
  this.getFirstParticleWithinWorld = function (point, radius) {
    var i = this.particles.length;
    while (i--) {
      var particle = this.particles[i];
      if (particle.isCloseToPoint(point, radius)) {
        return particle;
      } // if
    } // for
    return undefined;
  }

  /**
   * Gets the first particle within the specified radius in window space
   * @function
   * @param {Array} point The window point at which to look
   * @param {Number} radius The search radius
   * @returns {Particle} The particle, undefined if none were found

   */
  this.getFirstParticleWithinWindow = function (point, radius) {
    var i = this.particles.length;
    while (i--) {
      var particle = this.particles[i];
      if (math.v2.isWithin(worldToWindow(particle.pos), point, radius)) {
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

   */
  this.update = function (delta) {
    this.startFrame();
    this.runPhysics(delta);
  }

  /**
   * Clears all force accumulators on particles
   * @function
   * @returns {void}

   */
  this.startFrame = function () {
    var i = this.particles.length;
    while (i--) {
      var particle = this.particles[i];
      particle.clearForceAccum();
    } // for
  }

  /**
   * Calls all the contact generators
   * @function
   * @returns {int} The number of generated contacts

   */
  this.generateContacts = function () {
    var limit = this.maxContacts;

    var i = this.contactGenerators.length;
    while (i--) {
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

   */
  this.integrate = function (delta) {
    var i = this.particles.length;
    while (i--) {
      var particle = this.particles[i];
      particle.integrate(delta);
    } // for
  }

  /**
   * Process all physics for the particle world
   * @function
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.runPhysics = function (delta) {
    this.applyGlobalForces(delta);
    this.forceRegistry.applyForces(delta);
    this.integrate(delta);
    var usedContacts = this.generateContacts();
    this.resolver.maxIt = usedContacts * 2;
    this.resolver.resolveContacts(this.contacts, delta);
    this.contacts = [];
  }

  /**
   * Adds a global force generator
   * @function
   * @param {ParticleForceGenerator} forceGenerator The global force generator to be added
   * @returns {void}

   */
  this.addGlobalForce = function (forceGenerator) {
    this.globalForceGenerators.push(forceGenerator);
  }

  /**
   * Applies all global forces to all particles over time delta
   * @function
   * @param {int} delta Delta Time delta in milliseconds
   * @returns {void}

   */
  this.applyGlobalForces = function (delta) {

    var j = this.globalForceGenerators.length;
    while (j--) {
      var forceGenerator = this.globalForceGenerators[j];
      var i = this.particles.length;
      while (i--) {
        var particle = this.particles[i];
        forceGenerator.applyForce(particle, delta);
      } // for
    } // for
  }

  /**
   * Adds a global gravity force
   * @function
   * @param {Array} gravitation Optional gravitational pull
   * @returns {void}

   */
  this.addGlobalGravityForce = function (gravitation) {
    this.addGlobalForce(
      new ParticleGravityForceGenerator(gravitation)
    );
  }

  /**
   * Adds a global drag force
   * @function
   * @param {Number} k1 Velocity drag coefficient
   * @param {Number} k2 Velocity squared drag coefficient
   * @returns {void}

   */
  this.addGlobalDragForce = function (k1, k2) {
    this.addGlobalForce(
      new ParticleDragForceGenerator(k1, k2)
    );
  }

  /**
   * Adds a window collision rectangle
   * @function
   * @param {Number} collisionRadius Minimum distance between particle and window border
   * @returns {void}

   */
  this.addWindowCollisionBox = function (collisionRadius) {
    ParticleContactGeneratorFactory.createCollisionBox(
      this, this.particles, EngineInstance.windowRect
    );
  }

  /*
   * Check flags
   */
  if (this.flags & PARTICLE_WORLD_GRAVITY) {
    this.addGlobalGravityForce();

    if (EngineInstance.debug) {
      console.debug("Added global gravity force");
    } // if
  } // if
  if (this.flags & PARTICLE_WORLD_DRAG) {
    this.addGlobalDragForce();

    if (EngineInstance.debug) {
      console.debug("Added global drag force");
    } // if
  } // if
  if (this.flags & PARTICLE_WORLD_WINDOW_COLLISION) {
    this.addWindowCollisionBox();

    if (EngineInstance.debug) {
      console.debug("Added window collision box");
    } // if
  } // if
  if (this.flags & PARTICLE_WORLD_CONTACT_EVENTS) {
    this.contactEventsEnabled = true;

    if (EngineInstance.debug) {
      console.debug("Contact events enabled");
    } // if
  } // if

  /**
   * Accepts a particle world visitor
   * @function
   * @param {ParticleWorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitWorld(this);

    var j = this.globalForceGenerators.length;
    while (j--) {
      var forceGenerator = this.globalForceGenerators[j];
      var i = this.particles.length;
      while (i--) {
        var particle = this.particles[i];
        forceGenerator.accept(visitor, particle);
      } // for
    } // for

    var k = this.contactGenerators.length;
    while (k--) {
      var contactGenerator = this.contactGenerators[k];
      contactGenerator.accept(visitor);
    } // for

    this.forceRegistry.accept(visitor);

    var i = this.particles.length;
    while (i--) {
      var particle = this.particles[i];
      particle.accept(visitor);
    } // for
  }
}
ParticleWorld.prototype = new Observable();