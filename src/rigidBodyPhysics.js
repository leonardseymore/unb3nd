/**
 * @fileOverview Rigid Body System
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

/**
 * @class A rigid body consists of a number of points in space. In this engine
 *        calculations on rigid bodies are done on the centre of mass. This
 *        greatly simplifies the mathematics involved in calculating the
 *        relative velocities of each point in space occupied by the rigid body.
 * @constructor
 * @extends Observable
 * @param {Number} mass Optional mass, 0.0 being infinite
 * @param {Number} inertia Optional inertia, 0.0 being infinite

 */
function RigidBody(mass, inertia) {

  /*
   * Super constructor
   */
  Observable.call(this);

  /**
   * The orientation, should only be set using the
   * {@link RigidBody#setOrientation} method
   * @field
   * @private
   * @type Array
   * @default X-unit vector

   */
  this.orientation = new math.v2.create([1, 0]);

  /**
   * The angular velocity (anti-clockwise) of the rigid body around the
   * center of gravity
   * @field
   * @type Number
   * @default 0.0

   */
  this.angVel = 0.0;

  /**
   * The position of this rigid body's center of mass
   * @field
   * @type Array
   * @default Zero vector

   */
  this.pos = math.v2.create();

  /**
   * The velocity of this rigid body's center of mass
   * @field
   * @type Array
   * @default Zero vector

   */
  this.vel = math.v2.create();

  /**
   * The acceleration of this rigid body's center of mass
   * @field
   * @type Array
   * @default Zero vector

   */
  this.acc = math.v2.create();

  /**
   * Damping is a simple yet special property involved in slowing down moving
   * objects 0 - 1, where 0 is full damping and 1 is no damping
   * @field
   * @type Number
   * @default 1.0

   */
  this.damping = 1.0;

  /**
   * Angular damping does for rotations what damping does for linear
   * motion
   * @field
   * @type Number
   * @default 1.0

   */
  this.angularDamping = 1.0;

  /**
   * Holds the inverse mass
   * @private
   * @field
   * @type Number
   * @default 0.0, indicating infinite mass

   */
  this.inverseMass = 0.0;
  if (mass) {
    this.inverseMass = 1 / mass;
  } // if

  /**
   * Holds the inverse inertia over the center of gravity along the Z-axis
   * @private
   * @field
   * @type Number
   * @default 0.0, indicating infinite inertia

   */
  this.inverseInertia = 0.0;
  if (inertia) {
    this.inverseInertia = 1 / inertia;
  }

  /**
   * The overall force accumulator
   * @private
   * @field
   * @type Array
   * @default Zero vector

   */
  this.forceAccum = math.v2.create();

  /**
   * The overall torque accumulator
   * @private
   * @field
   * @type Number
   * @default 0.0

   */
  this.torqueAccum = 0.0;

  /**
   * Holds a transform matrix for converting body space into world
   * space and vice versa. This can be achieved by calling the
   * getPointIn*Space functions.
   *
   * Data cache of position and orientation calculated once per
   * frame.
   *
   * @field
   * @type Array
   * @default undefined

   */
  this.transformMatrix = undefined;

  /**
   * Holds a transform matrix inverse.
   *
   * Data cache of position and orientation calculated once per
   * frame.
   *
   * @field
   * @type Array
   * @default undefined

   */
  this.transformMatrixInverse = undefined;

  /**
   * Calculates internal data from state data. This should be called
   * after the body's state is altered directly (it is called
   * automatically during integration). If you change the body's
   * state and then intend to integrate before querying any data
   * (such as the transform matrix), then you can omit this step.
   * @function
   * @returns {void}

   */
  this.calculateDerivedData = function () {
    this.calculateTransformMatrix();
  }

  /**
   * Calculates the transformMatrix from this position and orientation
   * @function
   * @returns {void}

   */
  this.calculateTransformMatrix = function () {
    this.transformMatrix = math.m3.createTransform2(
      this.getOrientationAngle(), this.pos[0], this.pos[1]
    );
    this.transformMatrixInverse = math.m3.getInverse(this.transformMatrix);
  }

  /**
   * Sets the orientation angle of this object (-PI;PI]
   * @function
   * @param {Number} theta The orientation to use
   * @returns {void}

   */
  this.setOrientationAngle = function (theta) {
    this.orientation[0] = Math.cos(theta);
    this.orientation[1] = Math.sin(theta);
    math.v2.normalizeMutate(this.orientation);
  }

  /**
   * Sets the orientation of this object
   * @function
   * @param {Array} orientation The orientation of this body
   * @returns {void}

   */
  this.setOrientation = function (orientation) {
    this.orientation = orientation;
  }

  /**
   * Sets the orientation angle of this object
   * @function
   * @returns {Number} The orientation of this object in radians

   */
  this.getOrientationAngle = function () {
    var x = this.orientation[0];
    var y = this.orientation[1];

    return Math.atan2(y, x);
  }

  /**
   * Gets the orientation of this object
   * @function
   * @returns {Array} The orientation of this object

   */
  this.getOrientation = function () {
    return this.orientation;
  }

  /**
   * Converts a point relative to this center of gravity to world coordinates
   * @function
   * @param {Array} point Point to transform
   * @returns {Array} The transformed point

   */
  this.getPointInWorldSpace = function (point) {
    return math.m3.multVector2(this.transformMatrix, point);
  }

  /**
   * Converts a point in world coordinates to a point relative to this body's local
   * coordinates
   * @function
   * @param {Array} point Point to transform
   * @returns {Array} The transformed point

   */
  this.getPointInLocalSpace = function (point) {
    return math.m3.multVector2(this.transformMatrixInverse, point);
  }

  /**
   * Ensures this body has a finite mass
   * @function
   * @returns {boolean} true if this body has a finite mass

   */
  this.hasFiniteMass = function () {
    return this.inverseMass > 0;
  }

  /**
   * Adds an external force to the center of mass of this rigid body
   * @function
   * @param {Array} force The force to add to this rigid body
   * @returns {void}

   */
  this.applyForce = function (force) {
    math.v2.addMutate(this.forceAccum, force);
  }

  /**
   * Adds the given force to the given point on the rigid body.
   * The direction of the force is given in world coordinates,
   * but the application point is given in body space. This is
   * useful for spring forces, or other forces fixed to the
   * body.
   *
   * @function
   * @param {Array} force The force to add to this rigid body
   * @param {Array} point The location at which to apply the force in world coordinates
   * @returns {void}

   */
  this.applyForceAtBodyPoint = function (force, point) {
    var pt = this.getPointInWorldSpace(point);
    this.addForceAtPoint(force, pt);
  }

  /**
   * Adds the given force to this body at the relative point
   * @function
   * @param {Array} force The force to add to this rigid body
   * @param {Array} point The location at which to apply the force in local coordinates
   * @returns {void}

   */
  this.addForceAtPoint = function (force, point) {
    this.applyForce(force);

    var pt = math.v2.create(point);
    math.v2.subMutate(pt, this.pos);
    this.applyTorque(
      math.v2.vectorProduct(pt, force)
    );
  }

  /**
   * Reset the force accumulator on this rigid body
   * @function
   * @returns {void}

   */
  this.clearForceAccum = function () {
    math.v2.zeroMutate(this.forceAccum);
  }

  /**
   * Adds an external torque to the rigid body
   * @function
   * @param {Number} torque The torque to add to this rigid body
   * @returns {void}

   */
  this.applyTorque = function (torque) {
    this.torqueAccum += torque;
  }

  /**
   * Reset the torque accumulator on this rigid body
   * @function
   * @returns {void}

   */
  this.clearTorqueAccum = function () {
    this.torqueAccum = 0.0;
  }

  /**
   * Clears all frame accumulators
   * @function
   * @returns {void}

   */
  this.clearAccums = function () {
    this.clearForceAccum();
    this.clearTorqueAccum();
  }

  /**
   * Sets the inverse mass of the rigid body
   * @function
   * @param {Number} inverseMass The inverse mass of the rigid body
   * @returns {void}

   */
  this.setInverseMass = function (inverseMass) {
    this.inverseMass = inverseMass;
  }

  /**
   * Sets the mass of the rigid body
   * @function
   * @param {Number} mass The mass of the rigid body
   * @returns {void}

   */
  this.setMass = function (mass) {
    if (mass == 0) {
      this.inverseMass = 0;
    } else {
      this.inverseMass = 1 / mass;
    } // if
  }

  /**
   * Gets the mass of the rigid body
   * @function
   * @returns {Number} The mass of the rigid body

   */
  this.getMass = function () {
    if (this.inverseMass == 0) {
      return 0;
    } else {
      return 1 / this.inverseMass;
    } // if
  }

  /**
   * Sets the inverse inertia of the rigid body
   * @function
   * @param {Number} inverseInertia The inverse inertia of the rigid body
   * @returns {void}

   */
  this.setInverseInertia = function (inverseInertia) {
    this.inverseInertia = inverseInertia;
  }

  /**
   * Sets the inertia of the rigid body
   * @function
   * @param {Number} inertia The inertia of the rigid body
   * @returns {void}

   */
  this.setInertia = function (inertia) {
    if (inertia == 0) {
      this.inverseInertia = 0;
    } else {
      this.inverseInertia = 1 / inertia;
    } // if
  }

  /**
   * Gets the inertia of the rigid body
   * @function
   * @returns {Number} The inertia of the rigid body

   */
  this.getInertia = function () {
    if (this.inverseInertia == 0) {
      return 0;
    } else {
      return 1 / this.inverseInertia;
    } // if
  }

  /**
   * Integrates the rigid body forward in time by the given amount.
   * Uses Newton-Euler integration function
   * @function
   * @param {int} delta The time delta in milliseconds
   * @returns {void}

   */
  this.integrate = function (delta) {
    var dt = delta / 1000;

    // linear motion
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

    // angular motion
    var angle = this.getOrientationAngle();
    this.setOrientationAngle(
      angle + this.angVel * dt
    );

    var angularAcc = this.torqueAccum * this.inverseInertia * dt;
    this.angVel += angularAcc;
    this.angVel *= Math.pow(this.angularDamping, dt);

    this.calculateDerivedData();
    this.clearAccums();
  }

  /**
   * Accepts a world visitor
   * @function
   * @param {WorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitRigidBody(this);
  }

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
  }

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this class

   */
  this.toString = function () {
    return "uid=" + this.uid;
  }
}
RigidBody.prototype = new Observable();

/**
 * @class A rigid body force generator
 * @constructor
 * @abstract

 */
function ForceGenerator() {

  /**
   * Apply force to the given rigid body over the delta time
   * @function
   * @abstract
   * @param {RigidBody} rigidBody The rigid body to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (rigidBody, delta) {
  }

  /**
   * Accepts a world visitor
   * @method
   * @abstract
   * @param {WorldVisitor} visitor Visitor to visit
   * @param {RigidBody} rigidBody RigidBody that is currently affected by this generator
   * @returns {void}

   */
  this.accept = function (visitor, rigidBody) {
  }

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return this;
  }
}

/**
 * @class A gravitational force generator
 * @constructor
 * @extends ForceGenerator
 * @param {Array} gravition Gravitational force, defaults {@link constants.DEFAULT_GRAVITATIONAL_CONSTANT}

 */
function GravityForceGenerator(gravitation) {

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
   * @param {RigidBody} rigidBody The rigid body to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (rigidBody, delta) {
    if (!rigidBody.hasFiniteMass()) {
      if (debug && verbose) {
        console.debug("RigidBody %o has zero mass", rigidBody);
      } // if
      return;
    } // if

    rigidBody.applyForce(
      // scale force, since gravity is constant regardless of mass
      math.v2.multScalar(
        this.gravitation,
        rigidBody.getMass()
      )
    );
  }

  /**
   * Accepts the supplied rigid boy visitor
   * @function
   * @override
   */
  this.accept = function (visitor, rigidBody) {
    visitor.visitGravityForceGenerator(this, rigidBody);
  }

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return "Gravity: " + this.gravitation.toString();
  }
}
GravityForceGenerator.prototype = new ForceGenerator();

/**
 * @class A spring force generator
 * @constructor
 * @extends ForceGenerator
 * @param {Array} connectionPoint The connection point of the spring, in
 *        local coordinates of this rigid body
 * @param {RigidBody} rigidBodyOther Rigid body at the other end of the spring
 * @param {Array} connectionPointOther The connection point of the spring,
 *        in that object's local coordinates of the {@link #rigidBodyOther}
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length

 */
function SpringForceGenerator(connectionPoint, rigidBodyOther, connectionPointOther, springConstant, restLength) {

  /**
   * The connection point of the spring, in local coordinates of this rigid
   * body
   * @field
   * @type Array
   * @default connectionPoint

   */
  this.connectionPoint = connectionPoint;

  /**
   * The other connection point of the spring, in local coordinates of the
   * {@link #rigidBodyOther}
   * @field
   * @type Array
   * @default connectionPointOther

   */
  this.connectionPointOther = connectionPointOther;

  /**
   * Rigid body at the other end of the spring
   * @field
   * @type RigidBody
   * @default rigidBodyOther

   */
  this.rigidBodyOther = rigidBodyOther;

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
   * Apply spring force to the given rigid body over the delta time
   * @function
   * @override
   * @param {RigidBody} rigidBody The rigid body to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (rigidBody, delta) {
    var lws = rigidBody.getPointInWorldSpace(this.connectionPoint);
    var ows = this.rigidBodyOther.getPointInWorldSpace(this.connectionPointOther);
    var force = math.v2.sub(lws, ows);

    var magnitude = math.v2.getMagnitude(force);
    magnitude = Math.abs(magnitude - this.restLength);
    magnitude *= this.springConstant;

    math.v2.normalizeMutate(force);
    math.v2.multScalarMutate(force, -magnitude);
    rigidBody.addForceAtPoint(force, lws);
  }

  /**
   * Accepts the supplied rigid boy visitor
   * @function
   * @override
   */
  this.accept = function (visitor, rigidBody) {
    visitor.visitSpringForceGenerator(this, rigidBody);
  }
}
SpringForceGenerator.prototype = new ForceGenerator();

/**
 * @class A constant torque force generator
 * @constructor
 * @extends ForceGenerator
 * @param {Number} torque The amount of torque to apply

 */
function ConstantTorqueForceGenerator(torque) {

  /**
   * The torque to apply
   * @field
   * @type Number
   * @default 0.0

   */
  this.torque = torque || 0.0;

  /**
   * Apply torque to the given mass over the delta time
   * @function
   * @override
   * @param {RigidBody} rigidBody The rigid body to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (rigidBody, delta) {
    if (!rigidBody.hasFiniteMass()) {
      if (debug && verbose) {
        console.debug("RigidBody %o has zero mass", rigidBody);
      } // if
      return;
    } // if

    rigidBody.applyTorque(
      this.torque
    );
  }

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return "Constant Torque: " + this.torque;
  }
}
ConstantTorqueForceGenerator.prototype = new ForceGenerator();

/**
 * @class An aero dynamic tensor fake force generator
 * @constructor
 * @extends ForceGenerator
 * @param {Matrix2} tensor The aerodynamic tensor for the surface in body space
 * @param {Array} position The relative position of the aerodynamic surface in body coordinates
 * @param {Array} windspeed The wind speed

 */
function AeroForceGenerator(tensor, position, windspeed) {

  /**
   * The aerodynamic tensor for the surface in body space
   * @field
   * @type Matrix2
   * @default undefined

   */
  this.tensor = tensor;

  /**
   * The relative position of the aerodynamic surface in body coordinates
   * @field
   * @type Array
   * @default undefined

   */
  this.position = position;

  /**
   * The wind speed
   * @field
   * @type Array
   * @default 0.0

   */
  this.windspeed = windspeed || math.v2.create();

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return "Aero: windspeed=" + this.windspeed.toString() +
      ", tensor=" + tensor.toString() +
      ", pos=" + pos.toString();
  }
}
AeroForceGenerator.prototype = new ForceGenerator();

/**
 * @class An aero dynamic tensor control force generator
 * @constructor
 * @extends AeroForceGenerator
 * @param {Matrix2} baseTensor The aerodynamic tensor for the surface in body space
 * @param {Matrix2} minTensor The aerodynamic tensor for the surface in body space (at min)
 * @param {Matrix2} maxTensor The aerodynamic tensor for the surface in body space (at max)
 * @param {Array} position The relative position of the aerodynamic surface in body coordinates
 * @param {Array} windspeed The wind speed

 */
function AeroControlForceGenerator(baseTensor, minTensor, maxTensor, position, windspeed) {

  /**
   * Super
   */
  AeroForceGenerator.call(this, baseTensor, position, windspeed);

  /**
   * The aerodynamic tensor for the surface in body space (at minimum value)
   * @field
   * @type Matrix2
   * @default undefined

   */
  this.minTensor = minTensor;

  /**
   * The aerodynamic tensor for the surface in body space (at maximum value)
   * @field
   * @type Array
   * @default undefined

   */
  this.maxTensor = maxTensor;


  /**
   * Range of -1 to 1, where if -1 then minTensor is used, at 1 maxTensor is used, and in
   * between base tensor is used
   * @field
   * @type Number
   * @default 0.0

   */
  this.controlSetting = 0.0;

  /**
   * The relative position of the aerodynamic surface in body coordinates
   * @method
   * @type Array
   * @returns {Array} Aero dynamic tensor to use for current control setting

   */
  this.getTensor = function () {
    if (this.controlSetting == -1) {
      return this.minTensor;
    } else if (this.controlSetting == 1) {
      return this.maxTensor;
    } else {
      return this.tensor;
    } // if
  }

  /**
   * Apply force to the given mass over the delta time
   * @function
   * @override
   * @param {RigidBody} rigidBody The rigid body to apply the force to
   * @param {int} delta The delta time in milliseconds
   * @returns {void}

   */
  this.applyForce = function (rigidBody, delta) {
    if (!rigidBody.hasFiniteMass()) {
      if (debug && verbose) {
        console.debug("RigidBody %o has zero mass", rigidBody);
      } // if
      return;
    } // if

    var force = math.m2.multVector(
      this.getTensor(),
      this.windspeed
    );
    rigidBody.applyForceAtBodyPoint(force, this.position);
  }

  /**
   * Accepts the supplied rigid boy visitor
   * @function
   * @override
   */
  this.accept = function (visitor, rigidBody) {
    visitor.visitAeroControlForceGenerator(this, rigidBody);
  }

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this object

   */
  this.toString = function () {
    return "Aero: windspeed=" + this.windspeed.toString() +
      ", tensor=" + tensor.toString() +
      ", pos=" + pos.toString();
  }
}
AeroControlForceGenerator.prototype = new AeroForceGenerator();

/**
 * @class Force generator factory
 * @constructor

 */
function ForceGeneratorFactory() {
}

/**
 * Creates a gravity force generator for a single rigid body only
 * @function
 * @static
 * @param {ForceRegistry} forceRegistry The force registry to add the generator to
 * @param {RigidBody} rigidBody The rigidBody to add the generator to
 * @param {Array} gravitation Optional gravitional pull
 * @returns {void}

 */
ForceGeneratorFactory.createGravity = function (forceRegistry, rigidBody, gravitation) {
  forceRegistry.add(rigidBody, new GravityForceGenerator(gravitation));
}

/**
 * Creates a constant torque force generator for a single rigid body only
 * @function
 * @static
 * @param {ForceRegistry} forceRegistry The force registry to add the generator to
 * @param {RigidBody} rigidBody The rigidBody to add the generator to
 * @param {Number} torque The torque force to apply
 * @returns {void}

 */
ForceGeneratorFactory.createConstantTorque = function (forceRegistry, rigidBody, torque) {
  forceRegistry.add(rigidBody, new ConstantTorqueForceGenerator(torque));
}

/**
 * Creates a spring force generator for a single rigid body only
 * @function
 * @static
 * @param {ForceRegistry} forceRegistry The force registry to add the generator to
 * @param {RigidBody} rigidBody The rigidBody to add the generator to
 * @param {Array} connectionPoint The connection point of the spring, in
 *        local coordinates of this rigid body
 * @param {RigidBody} rigidBodyOther Rigid body at the other end of the spring
 * @param {Array} connectionPointOther The connection point of the spring,
 *        in that object's local coordinates of the {@link #rigidBodyOther}
 * @param {Number} springConstant Holds the spring constant
 * @param {Number} restLength Holds the spring's rest length
 * @returns {void}

 */
ForceGeneratorFactory.createSpring = function (forceRegistry, rigidBody, connectionPoint, rigidBodyOther, connectionPointOther, springConstant, restLength) {
  var p1F = new SpringForceGenerator(connectionPoint, rigidBodyOther, connectionPointOther, springConstant, restLength);
  forceRegistry.add(rigidBody, p1F);
  rigidBody.addEventListener("die", function () {
    if (debug) {
      console.debug("Removing force generator for dead rigid body %s", this.toString());
    } // if

    forceRegistry.removeForceGenerator(p1F);
  });

  var p2F = new SpringForceGenerator(connectionPointOther, rigidBody, connectionPoint, springConstant, restLength)
  forceRegistry.add(rigidBodyOther, p2F);
  rigidBodyOther.addEventListener("die", function () {
    if (debug) {
      console.debug("Removing force generator for dead rigid body %s", this.toString());
    } // if

    forceRegistry.removeForceGenerator(p2F);
  });
}

/**
 * @class A force registry for matching up force generators to rigid bodies
 * @constructor

 */
function ForceRegistry() {

  /**
   * Registry entries
   * @field
   * @type {"rigidBody":RigidBody, "forceGenerators":ForceGenerator []}
   * @default []

   */
  this.entries = [];

  /**
   * Adds the force generator to the supplied rigid body
   * TODO: This is a very brute force function, we need a HashMap or similar datastructure
   * @function
   * @param {RigidBody} rigidBody The rigid body to add a force generator to
   * @param {ForceGenerator} forceGenerator The force generator to add to the rigid body
   * @returns {void}

   */
  this.add = function (rigidBody, forceGenerator) {
    var entry;
    var found = false;
    var i = this.entries.length;
    while (i--) {
      entry = this.entries[i];
      if (entry.rigidBody === rigidBody) {
        found = true;
        break;
      } // if
    } // while

    if (!found) {
      entry = {"rigidBody":rigidBody, "forceGenerators":new Array(forceGenerator)};
      this.entries.push(entry);
    } else {
      entry.forceGenerators.push(forceGenerator);
    } // if
  }

  /**
   * Gets all force generators for the supplied rigid body
   * @function
   * @param {RigidBody} rigidBody The rigid body to get the force generators for
   * @returns {ForceGenerator []} All the force generators for the supplied rigid body, undefined if not found

   */
  this.getForceGenerators = function (rigidBody) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      if (entry.rigidBody === rigidBody) {
        return entry.forceGenerators;
      } // if
    } // while

    return undefined;
  }

  /**
   * Removes all force generators for the supplied rigid body
   * @function
   * @param {RigidBody} rigidBody The rigid body to remove the force generators from
   * @returns {void}

   */
  this.removeForceGenerators = function (rigidBody) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      if (entry.rigidBody === rigidBody) {
        this.rigidBodies.splice(i, 1);
      } // if
    } // while
  }

  /**
   * Removes a specific force generator
   * @function
   * @param {ForceGenerator} forceGenerator The specific force generator to remove
   * @return {void}

   */
  this.removeForceGenerator = function (forceGenerator) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      var j = this.forceGenerators.length;
      while (j--) {
        var fg = entry.forceGenerators[j];
        if (fg === forceGenerator) {
          entry.forceGenerators.splice(j, 1);
        } // if
      } // if
    } // while
  }

  /**
   * Adds each force generator's force to every rigid body in the registry over the delta time
   * @function
   * @param {int} delta Delta time in milliseconds
   * @returns {void}

   */
  this.applyForces = function (delta) {
    var i = this.entries.length;
    while (i--) {
      var entry = this.entries[i];
      var rigidBody = entry.rigidBody;
      var forceGenerators = entry.forceGenerators;
      var j = entry.forceGenerators.length;
      while (j--) {
        var forceGenerator = forceGenerators[j];
        forceGenerator.applyForce(rigidBody, delta);
      } // while
    } // while
  }

  /**
   * Accepts a world visitor
   * @method
   * @abstract
   * @param {WorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    var i = this.entries.length;
    while(i--) {
      var entry = this.entries[i];
      var rigidBody = entry.rigidBody;
      var forceGenerators = entry.forceGenerators;
      var j = forceGenerators.length;
      while(j--) {
        var forceGenerator = forceGenerators[j];
        forceGenerator.accept(visitor, rigidBody);
      } // while
    } // while
  }
}

/**
 * COLLISION DETECTION
 */

/**
 * @class A contact represents two bodies in contact. Resolving a
 * contact removes their interpenetration, and applies sufficient
 * impulse to keep them apart. Colliding bodies may also rebound.
 *
 * Colliding bodies may also rebound. Contacts can be used to represent
 * positional joints, by making the contact constraint keep the bodies
 * in their correct orientation.
 *
 * @constructor

 */
function Contact() {

  /**
   * Holds the bodies that are involved in the contact. The second may be
   * omitted in the case of a contact with the environment.
   * @field
   * @type RigidBody []
   * @default []

   */
  this.ridigBodies = [];

  /**
   * Holds the position of the contact in world coordinates
   * @field
   * @type Array
   * @default undefined

   */
  this.contactPoint = undefined;

  /**
   * Holds the direction of the contact in world coordinates
   * @field
   * @type Array
   * @default undefined

   */
  this.contactNormal = undefined;

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
  }

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
  }

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
      math.v2.subMutate(accCausedVelocity, this.particles[1].acc);
    } // if
    var accCausedSepVelocity = math.v2.dotProduct(accCausedVelocity, this.contactNormal) * dt;

    // If we've got a closing velocity due to acceleration build-up,
    // remove it from the new separating velocity.
    if (accCausedSepVelocity < 0) {
      newSepVelocity += resitution * accCausedSepVelocity;

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
      impulsePerIMass.multScalar(this.particles[0].inverseMass)
    );

    if (this.particles[1]) {
      math.v2.addMutate(
        this.particles[1].vel,
        impulsePerIMass.multScalar(-this.particles[1].inverseMass)
      );
    } // if
  }

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
      math.v2.multScalar(movePerIMass, this.particles[0].inverseMass)
    );

    if (this.particles[1]) {
      math.v2.addMutate(
        this.particles[1].pos,
        math.v2.multScalar(movePerIMass, this.particles[1].inverseMass)
      );
    } // if
  }
}

/**
 * @class Bounding volume base class
 * @constructor

 */
function BoundingVolume() {
}

/**
 * @class A bounding sphere
 * @constructor
 * @extends BoundingVolume
 * @param {Array} center Center of the sphere
 * @param {Number} radius Radius of the sphere

 */
function BoundingSphere(center, radius) {

  /**
   * Super constructor
   */
  BoundingVolume.call(this);

  /**
   * Center of the sphere
   * @field
   * @type Array
   * @default undefined

   */
  this.center = center || undefined;

  /**
   * Radius of the sphere
   * @field
   * @type Number
   * @default 0.0

   */
  this.radius = radius || 0.0;

  /**
   * Determines if the bounding sphere overlaps with the supplied bounding
   * sphere
   * @function
   * @param {BoundingSphere} o The other sphere to test
   * @returns {boolean} True if this overlaps with the supplied bounding
   *  sphere

   */
  this.overlaps = function (o) {
    return math.v2.isWithin(this.center, o.center, this.radius + o.radius);
  }
}
BoundingSphere.prototype = new BoundingVolume();

/**
 * Factory method to create a bounding sphere to enclose the two given bounding
 * spheres.
 * @static
 * @function
 * @param {BoundingSphere} bs1 First bounding sphere
 * @param {BoundingSphere} bs2 Second bounding sphere
 * @returns {BoundingSphere} A new bounding sphere enclosing the supplied
 *  bounding spheres.

 */
BoundingSphere.enclose = function (bs1, bs2) {
  var boundingSphere = new BoundingSphere();
  var center = math.v2.add(
    bs1.center,
    bs2.center
  );
  math.v2.multScalarMutate(center, 0.5);
  boundingSphere.center = center;
  boundingSphere.radius = bs1.radius + bs2.radius;
  return boundingSphere;
}

/**
 * @class A bounding box
 * @constructor
 * @extends BoundingVolume
 * @param {Array} center Center of the box
 * @param {Array} halfSize Half size used for collision detection

 */
function BoundingBox(center, halfSize) {

  /**
   * Super constructor
   */
  BoundingVolume.call(this);

  /**
   * Center of the box
   * @field
   * @type Array
   * @default undefined

   */
  this.center = center || undefined;

  /**
   * Half size used for collision detection
   * @field
   * @type Array
   * @default undefined

   */
  this.halfSize = halfSize || undefined;
}
BoundingBox.prototype = new BoundingVolume();

/**
 * @class Stores a potential contact to check later
 * @constructor
 * @param {RigidBody []} rigidBodies The rigid bodies that might be in contact

 */
function PotentialContact(rigidBodies) {

  /**
   * The rigid bodies that might be in contact
   * @field
   * @type RigidBody []
   * @default undefined

   */
  this.center = rigidBodies || undefined;
}

/**
 * @class A base class for nodes in a bounding volume hierarchy.  This class
 *  uses a binary tree to store the bounding volumes.
 * @constructor
 * @param {BVHNode []} children The child nodes
 * @param {BoundingVolume} volume Holds a single volume encompassing all the
 *  descendents of this node.
 * @param {RigidBody} rigidBody Holds the rigid body at this node of the
 *  hierarchy. Only leaf nodes can have rigid body defined {@link BVHNode#isLeaf}.
 *  Note that it is possible to rewrite the algorithms in this class to handle
 *  objects at all levels of the hierarchy, but the code provided ignores this
 *  vector unless firstChild is undefined.

 */
function BVHNode(children, volume, rigidBody) {

  /**
   * The child nodes
   * @field
   * @type BVHNode []
   * @default undefined

   */
  this.children = children || undefined;

  /**
   * Holds a single volume encompassing all the descendents of this node.
   * @field
   * @type BoundingVolume
   * @default undefined

   */
  this.volume = volume || undefined;

  /**
   * Holds the rigid body at this node of the
   * hierarchy. Only leaf nodes can have rigid body defined {@link BVHNode#isLeaf}.
   * Note that it is possible to rewrite the algorithms in this class to handle
   * objects at all levels of the hierarchy, but the code provided ignores this
   * vector unless firstChild is undefined.
   * @field
   * @type RigidBody
   * @default undefined

   */
  this.rigidBody = rigidBody || undefined;

  /**
   * Determines if this node is at the bottom of the hierarchy
   * @function
   * @returns {boolean} True if this node is at the bottom of the hierarchy

   */
  this.isLeaf = function () {
    return (this.rigidBody != undefined);
  }

  /**
   * Inserts the given rigid body, with the given bounding volume,
   * into the hierarchy. This may involve the creation of
   * further bounding volume nodes.
   * @function
   * @param {RigidBody} rigidBody The rigid body to add
   * @param {BoundingVolume} volume The type of volume to add
   * @returns {void}

   */
  this.insert = function (rigidBody, volume) {
    // If we are a leaf, then the only option is to spawn two
    // new children and place the new body in one.
    if (this.isLeaf()) {
      this.children[0] = new BVHNode(
        this, this.volume, this.rigidBody
      );

      this.children[1] = new BVHNode(
        this, volume, rigidBody
      );

      this.rigidBody = undefined;
      this.recalculateBoundingVolume();
    } else {
      // Otherwise we need to work out which child gets to keep
      // the inserted body. We give it to whoever would grow the
      // least to incorporate it.
      if (this.children[0].volume.getGrowth(volume) <
        this.children[1].volume.getGrowth(volume)) {
        this.children[0].insert(rigidBody, volume);
      } else {
        this.children[1].insert(rigidBody, volume);
      } // if
    } // if
  }

  /**
   * Deletes this node, removing it first from the hierarchy, along
   * with its associated rigid body and child nodes. This method
   * deletes the node and all its children (but obviously not the
   * rigid bodies). This also has the effect of deleting the sibling
   * of this node, and changing the parent node so that it contains
   * the data currently in that sibling. Finally it forces the
   * hierarchy above the current node to reconsider its bounding
   * volume.
   * @function
   * @returns {void}

   */
  this.remove = function () {
    // If we don't have a parent, then we ignore the sibling processing.
    if (this.parent) {
      var sibling = undefined;
      if (this.parent.children[0] === this) {
        sibling = this.parent.children[1];
      } else {
        sibling = this.parent.children[0];
      } // if

      this.parent.volume = sibling.volume;
      this.parent.rigidBody = sibling.rigidBody;
      this.parent.children[0] = sibling.children[0];
      this.parent.children[1] = sibling.children[1];

      sibling.parent = undefined;
      sibling.rigidBody = undefined;
      sibling.children[0] = undefined;
      sibling.children[1] = undefined;
      sibling.remove();

      this.parent.recalculateBoundingVolume();
    } // if

    if (this.children[0]) {
      this.children[0].parent = undefined;
      this.children[0].remove();
    } // if

    if (this.children[1]) {
      this.children[1].parent = undefined;
      this.children[1].remove();
    } // if
  }

  /**
   * Checks the potential contacts from this node downward in
   * the hierarchy, writing them to the given array (up to the
   * given limit). Returns the number of potential contacts it
   * found.
   * @function
   * @param {PotentialContact []} potentialContacts The array to append to
   * @param {int} limit The maximum number of contacts that may be generated
   * @returns {int} Number of potential contacts found

   */
  this.getPotentialContacts = function (potentialContacts, limit) {
    if (this.isLeaf() || limit == 0) {
      return 0;
    } // if

    return this.children[0].getPotentialContactsWith(
      this.children[1], potentialContacts, limit
    );
  }

  /**
   * Gets potential contacts between this node and the supplied node.
   * @function
   * @param {BVHNode} o The other node to use
   * @param {PotentialContact []} potentialContacts The array to append to
   * @param {int} limit The maximum number of contacts that may be generated
   * @returns {int} Number of potential contacts found

   */
  this.getPotentialContactsWith = function (o, potentialContacts, limit) {
    if (!this.overlaps(o) || limit == 0) {
      return 0;
    } // if

    if (this.isLeaf() && o.isLeaf()) {
      var potentialContact = new PotentialContact([
        this.rigidBody, o.rigidBody
      ]);
      potentialContacts.push(potentialContact);
      return 1;
    } // if

    // Determine which node to descend into. If either is
    // a leaf, then we descend the other. If both are branches,
    // then we use the one with the largest size.
    if (o.isLeaf() ||
      (!this.isLeaf() && this.volume.getSize() >= o.volume.getSize())) {
      // recurse onto self
      var count = this.children[0].getPotentialContactsWith(
        o, potentialContacts, limit
      );

      if (limit > count) {
        return count + this.children[1].getPotentialContactsWith(
          o, potentialContacts, limit
        );
      } else {
        return count;
      } // if
    } else {
      // recurse onto other
      var count = o.children[0].getPotentialContactsWith(
        o, potentialContacts, limit
      );

      if (limit > count) {
        return count + o.children[1].getPotentialContactsWith(
          o, potentialContacts, limit
        );
      } else {
        return count;
      } // if
    } // if
  }

  /**
   * Checks if this node overlaps with the supplied node
   * @function
   * @param {BVHNode} o The other node to use
   * @returns {boolean} True if this node overlaps with the supplied node

   */
  this.overlaps = function (o) {
    return this.volume.overlaps(o.volume);
  }
}

/**
 * @class BSP collision plane
 * @constructor
 * @param {Array} position Any position on the plane
 * @param {Array} direction The direction perpendicular to the plane

 */
function Plane2(position, direction) {

  /**
   * Any position on the plane
   * @field
   * @type Array
   * @default undefined

   */
  this.position = position || undefined;

  /**
   * The direction perpendicular to the plane, this should be a normalized
   * vector
   * @field
   * @type Array
   * @default undefined

   */
  this.direction = direction || undefined;
}

/**
 * BSP child can be of types NODE or OBJECTS
 * @enum

 */
BSP_CHILD_TYPE = {
  BSP_CHILD_NODE:1,
  BSP_CHILD_OBJECTS:2
};

/**
 * @class BSP collision child
 * @constructor
 * @param {int} type {@link BSP_CHILD_TYPE} Type of the child

 */
function BSPChild2(type) {

  /**
   * {@link BSP_CHILD_TYPE} type of the child
   * @field
   * @type int
   * @default undefined

   */
  this.type = type || undefined;

  /**
   * Node in case if type is {@link BSP_CHILD_TYPE.BSP_CHILD_NODE}
   * @field
   * @type BSPNode2
   * @default undefined

   */
  this.node = undefined;

  /**
   * Array of objects if type is {@link BSP_CHILD_TYPE.BSP_CHILD_OBJECTS}
   * @field
   * @type Array
   * @default undefined

   */
  this.objects = undefined;
}

/**
 * @class BSP collision node
 * @constructor
 * @param {Plane2} plane Collision plane
 * @param {BSPNode2} front Node in front of the plane
 * @param {BSPNode2} black Node behind the plane

 */
function BSPNode2(plane, front, back) {

  /**
   * Collision plane
   * @field
   * @type Plane2
   * @default undefined

   */
  this.plane = plane || undefined;

  /**
   * Child in front of the plane
   * @field
   * @type BSPChild
   * @default undefined

   */
  this.front = front || undefined;

  /**
   * Child behind the plane
   * @field
   * @type BSPChild2
   * @default undefined

   */
  this.back = back || undefined;
}

/**
 * @class 2D Quad node tree
 * @constructor
 * @param {Array} position Position of the quad tree node

 */
function QuadNodeTree2(position) {

  /**
   * Position of the quad tree node
   * @field
   * @type Array
   * @default undefined

   */
  this.position = position || undefined;

  /**
   * Quadrants of the tree node
   * @field
   * @type QuadNodeTree2 []
   * @default undefined

   */
  this.children = [];

  /**
   * Gets the child index at the specified location
   * @function
   * @param {Array} o The object's position
   * @returns {int} The index of the object

   */
  this.getChildIndex = function (o) {
    var index = 0;
    if (o[0] > this.position[0]) {
      index += 1;
    } // if

    if (o[1] > this.position[1]) {
      index += 2;
    } // if
    return index;
  }
}

/**
 * @class 2D Grid
 * @constructor
 * @param {int} xExtent Number of cells in the X-direction of the grid
 * @param {int} yExtent Number of cells in the Y-direction of the grid
 * @param {Array} origin The origin of the grid

 */
function Grid2(xExtent, yExtent, origin) {

  /**
   * Number of cells in the X-direction of the grid
   * @field
   * @type int
   * @default 0

   */
  this.xExtent = xExtent || 0;

  /**
   * Number of cells in the Y-direction of the grid
   * @field
   * @type int
   * @default 0

   */
  this.yExtent = yExtent || 0;

  /**
   * Cells of the grid
   * @field
   * @type Object []
   * @default []

   */
  this.locations = [];

  /**
   * Origin of the grid
   * @field
   * @type Array
   * @default undefined

   */
  this.origin = origin || undefined;

  /**
   * 1 over the size of each cell
   * @field
   * @type Array
   * @default undefined

   */
  this.oneOverCellSize = undefined;

  /**
   * Gets the location index at the specified location
   * @function
   * @param {Array} o The object's location
   * @returns {int} The index of the location

   */
  this.getLocationIndex = function (o) {
    var square = o.multScalar(
      this.oneOverCellSize
    );
    return square[0] + this.xExtent * square[1];
  }
}

/**
 * @class Collision 2D primitive base class
 * @constructor
 * @param {RigidBody} rigidBody The body encapsulated by this primitive
 * @param {TransformationMatrix3} offset Translation and rotation from the rigid body

 */
function CollisionPrimitive2(rigidBody, offset) {

  /**
   * The body encapsulated by this primitive
   * @field
   * @type RigidBody
   * @default undefined

   */
  this.rigidBody = rigidBody || undefined;

  /**
   * Translation and rotation from the rigid body for this primitive
   * @field
   * @type Matrix3
   * @default undefined

   */
  this.offset = offset || undefined;
}

/**
 * @class Collision circle
 * @constructor
 * @extends CollisionPrimitive2
 * @param {RigidBody} rigidBody The body encapsulated by this primitive
 * @param {Matrix3} offset Translation and rotation from the rigid body

 */
function CollisionCircle(rigidBody, offset, radius) {

  /**
   * Super constructor
   */
  CollisionPrimitive2.call(this, rigidBody, offset, radius);

  /**
   * Radius of this circle
   * @field
   * @type Number
   * @default 0.0

   */
  this.radius = radius || 0.0;
}
CollisionCircle.prototype = new CollisionPrimitive2();

/**
 * @class 2D Collision plane
 * @constructor
 * @extends CollisionPrimitive2
 * @param {RigidBody} rigidBody The body encapsulated by this primitive
 * @param {Matrix3} offset Translation and rotation from the rigid body
 * @param {Vector2} normal Direction of plane face
 * @param {Number} normalOffset Distance in normal direction

 */
function CollisionPlane2(rigidBody, offset, normal, normalOffset) {

  /**
   * Super constructor
   */
  CollisionPrimitive2.call(this, rigidBody, offset, radius);

  /**
   * Normal of the plane
   * @field
   * @type Vector2
   * @default 0.0

   */
  this.normal = normal || 0.0;

  /**
   * Normal offset of the plane
   * @field
   * @type Number
   * @default 0.0

   */
  this.normalOffset = normalOffset || 0.0;
}
CollisionPlane2.prototype = new CollisionPrimitive2();

/**
 * @class Collision rectangle
 * @constructor
 * @extends CollisionRect
 * @param {RigidBody} rigidBody The body encapsulated by this primitive
 * @param {Matrix3} offset Translation and rotation from the rigid body
 * @param {Vector2} halfSize The halfsize of the rectangle (half width, half height)

 */
function CollisionRect(rigidBody, offset, normal, normalOffset) {

  /**
   * Super constructor
   */
  CollisionPrimitive2.call(this, rigidBody, offset, radius);

  /**
   * Half size of the rectangle
   * @field
   * @type Vector2
   * @default Zero vector

   */
  this.halfSize = halfSize || math.v2.create();
}
CollisionRect.prototype = new CollisionPrimitive2();

/**
 * @class 2D collision detector
 * @constructor

 */
var CollisionDetector2 = {

  /**
   * Generates contacts between two collision circles
   * @function
   * @param {CollisionCircle} one The first circle to use
   * @param {CollisionCircle} two The second circle to use
   * @param {Contact []} contacts Contacts to append to
   * @param {int} limit Maximum number of contacts that may be added
   * @returns {int} The number of contacts generated

   */
  circleAndCircle : function(one, two, contacts, limit) {
    var positionOne = one.rigidBody.pos; // TODO: see getAxis(3)
    var positionTwo = two.rigidBody.pos;

    var midline = math.v2.sub(positionOne, positionTwo);
    var size = math.v2.getMagnitude(midline);

    if (size <= 0 || size >= one.radius + two.radius) {
      return 0;
    } // if

    var normal = math.v2.multScalar(midline, 1 / size);
    var contact = new Contact();
    contact.contactNormal = normal;
    contact.contactPoint = math.v2.add(
      positionOne,
      math.v2.multScalar(midline, 0.5)
    );
    contact.penetration = one.radius + two.radius - size;

    contact.ridigBodies[0] = one.rigidBody;
    contact.ridigBodies[1] = two.rigidBody;

    //contact.restitution = data.restitution; // TODO: add restitution
    //contact.friction = data.friction; // TODO: add friction

    contacts.push(contact);

    return 1;
  },

  /**
   * Generates contacts between a collision circle and half space
   * @function
   * @param {CollisionCircle} circle The circle to use
   * @param {CollisionPlane2} plane The plane / half space to use
   * @param {Contact []} contacts Contacts to append to
   * @param {int} limit Maximum number of contacts that may be added
   * @returns {int} The number of contacts generated

   */
  circleAndHalfSpace : function(circle, rect, contacts, limit) {

  },

  /**
   * Generates contacts between a collision rectangle and half space
   * @function
   * @param {CollisionRect} rect The rectangle to use
   * @param {CollisionPlane2} plane The plane / half space to use
   * @param {Contact []} contacts Contacts to append to
   * @param {int} limit Maximum number of contacts that may be added
   * @returns {int} The number of contacts generated

   */
  rectAndHalfSpace : function(rect, plane, contacts, limit) {
    // clockwise vertex generation
    var vertices = [
      math.v2.create([-rect.halfSize[0], -rect.halfSize[1]]),
      math.v2.create([rect.halfSize[0], -rect.halfSize[1]]),
        math.v2.create([rect.halfSize[0], rect.halfSize[1]]),
          math.v2.create([-rect.halfSize[0], rect.halfSize[1]])
    ];

    var i = 4;
    while(i--) {
      var vertex = vertices[i];
      var vertexPos = math.m3.multVector2(
        plane.offset,
        vertex
      );

      var vertexDistance = math.v2.dotProduct(vertexPos, plane.direction);
    } // while
  }
}

/**
 * @class Visitor interface to visit the rigid body world
 * @constructor

 */
function WorldVisitor() {

  /**
   * @method
   * @abstract
   * Visits the world
   * @param {World} world The visited world
   * @return void
   */
  this.visitWorld = function (world) {
  }

  /**
   * @method
   * @abstract
   * Visits the rigid body
   * @param {RigidBody} rigidBody The visited ridig body
   * @return void
   */
  this.visitRigidBody = function (rigidBody) {
  }

  /**
   * @method
   * @abstract
   * Visits a gravity force generator
   * @param {GravityForceGenerator} forceGenerator The visited force generator
   * @param {RigidBody} rigidBody The rigidBody currently affected by this force generator
   * @return void
   */
  this.visitGravityForceGenerator = function (forceGenerator, rigidBody) {
  }

  /**
   * @method
   * @abstract
   * Visits a spring force generator
   * @param {SpringForceGenerator} forceGenerator The visited force generator
   * @param {RigidBody} rigidBody The rigidBody currently affected by this force generator
   * @return void
   */
  this.visitSpringForceGenerator = function (forceGenerator, rigidBody) {
  }

  /**
   * @method
   * @abstract
   * Visits a aero control force generator
   * @param {AeroControlForceGenerator} forceGenerator The visited force generator
   * @param {RigidBody} rigidBody The rigidBody currently affected by this force generator
   * @return void
   */
  this.visitAeroControlForceGenerator = function (forceGenerator, rigidBody) {
  }
}

/**
 * @class Keeps track of all rigid bodies
 * @constructor

 */
function World() {

  /**
   * All rigid bodies in simulation
   * @field
   * @type RigidBody []
   * @default []

   */
  this.rigidBodies = [];

  /**
   * Holds all the force generators
   * @field
   * @type ForceRegistry
   * @default new ForceRegistry()

   */
  this.forceRegistry = new ForceRegistry();

  /**
   * Force generators applied to all rigid bodies
   * @field
   * @type ForceGenerator []
   * @default []

   */
  this.globalForceGenerators = [];

  /**
   * Adds a new rigid body to the simulation
   * @function
   * @param {RigidBody} rigidBody The new rigidBody to add
   * @returns {int} The total number of rigid bodies in the simulation

   */
  this.addRigidBody = function (rigidBody) {
    return this.rigidBodies.push(rigidBody);
  }

  /**
   * Removes a rigid body from the simulation
   * @function
   * @param {RigidBody} rigidBody The rigid body to remove
   * @returns {RigidBody} The removed rigid body, undefied if not removed

   */
  this.removeParticle = function (rigidBody) {
    var removedRigidBody = undefined;
    var i = this.rigidBodies.length;
    while(i--) {
      var el = this.rigidBodies[i];
      if (el === rigidBody) {
        if (debug) {
          console.debug("Removing rigid body %s", rigidBody.toString());
        } // if

        var removedRigidBody = this.rigidBodies.splice(i, 1);
        removedRigidBody.die();
        return removedRigidBody;
      } // if
    } // while
    return removedRigidBody;
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
   * Clears all force accumulators on rigid bodies
   * @function
   * @returns {void}

   */
  this.startFrame = function () {
    var i = this.rigidBodies.length;
    while(i--) {
      var rigidBody = this.rigidBodies[i];
      rigidBody.clearForceAccum();
      rigidBody.calculateDerivedData();
    } // while
  }

  /**
   * Integrates all the rigid bodies in this world forward in time
   * by the given duration
   * @function
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.integrate = function (delta) {
    var i = this.rigidBodies.length;
    while(i--) {
      var rigidBody = this.rigidBodies[i];
      rigidBody.integrate(delta);
    } // while
  }

  /**
   * Process all physics for the world
   * @function
   * @param {int} delta Delta time in milliseconds since last update
   * @returns {void}

   */
  this.runPhysics = function (delta) {
    this.applyGlobalForces(delta);
    this.forceRegistry.applyForces(delta);
    this.integrate(delta);
  }

  /**
   * Adds a global force generator
   * @function
   * @param {ForceGenerator} forceGenerator The global force generator to be added
   * @returns {void}

   */
  this.addGlobalForce = function (forceGenerator) {
    this.globalForceGenerators.push(forceGenerator);
  }

  /**
   * Applies all global forces to all rigid bodies over time delta
   * @function
   * @param {int} delta Delta Time delta in milliseconds
   * @returns {void}

   */
  this.applyGlobalForces = function (delta) {
    var j = this.globalForceGenerators.length;
    while(j--) {
      var forceGenerator = this.globalForceGenerators[j];
      var i = this.rigidBodies.length;
      while(i--) {
        var rigidBody = this.rigidBodies[i];
        forceGenerator.applyForce(rigidBody, delta);
      } // while
    } // while
  }

  /**
   * Adds a global gravity force
   * @function
   * @param {Array} gravitation Optional gravitational pull
   * @returns {void}

   */
  this.addGlobalGravityForce = function (gravitation) {
    this.addGlobalForce(
      new GravityForceGenerator(gravitation)
    );
  }

  /**
   * Accepts a world visitor
   * @function
   * @param {WorldVisitor} visitor Visitor to visit
   * @returns {void}

   */
  this.accept = function (visitor) {
    visitor.visitWorld(this);

    var i = this.rigidBodies.length;
    while(i--) {
      var rigidBody = this.rigidBodies[i];
      rigidBody.accept(visitor);
      var j = this.globalForceGenerators.length;
      while(j--) {
        var forceGenerator = this.globalForceGenerators[j];
        forceGenerator.accept(visitor, rigidBody);
      } // while
    } // while

    this.forceRegistry.accept(visitor);
  }
}