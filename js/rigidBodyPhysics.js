/**
 * @fileOverview Rigid Body System
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * @class A rigid body consists of a number of points in space. In this engine
 *        calculations on rigid bodies are done on the centre of mass. This 
 *        greatly simplifies the mathematics involved in calculating the 
 *        relative velocities of each point in space occupied by the rigid body.
 * @constructor
 * @extends Observable
 * @param {float} mass Optional mass, 0.0 being infinite
 * @param {float} inertia Optional inertia, 0.0 being infinite
 * @since 0.0.0
 */
function RigidBody(mass, inertia) {

	/*
	 * Super constructor
	 */
  Observable.call(this);
	
	/**
	 * Unique identifier to help track a single rigid body
	 * @field 
	 * @type long
	 * @default Auto number
	 * @since 0.0.0
	 * @see RigidBody#getNextUid 
	 */
	this.uid = RigidBody.getNextUid();
	
	/**
	 * The orientation, should only be set using the 
	 * {@link RigidBody#setOrientation} method
	 * @field 
	 * @private
	 * @type Vector2
	 * @default X-unit vector
	 * @since 0.0.0
	 */
	this.orientation = new Vector2(1, 0);

	/**
	 * The angular velocity (anti-clockwise) of the rigid body around the 
	 * center of gravity
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.angVel = 0.0;
	
	/**
	 * The position of this rigid body's center of mass
	 * @field 
	 * @type Vector2
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.pos = new Vector2();
	
	/**
	 * The velocity of this rigid body's center of mass
	 * @field
	 * @type Vector2
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.vel = new Vector2();
	
	/**
	 * The acceleration of this rigid body's center of mass
	 * @field
	 * @type Vector2
	 * @default Zero vector
	 * @since 0.0.0
	 */
	this.acc = new Vector2();
	
	/**
	 * Damping is a simple yet special property involved in slowing down moving
	 * objects 0 - 1, where 0 is full damping and 1 is no damping
	 * @field
	 * @type float 
	 * @default 1.0
	 * @since 0.0.0
	 */
	this.damping = 1.0;
	
	/**
	 * Angular damping does for rotations what {@link #damping} does for linear
	 * motion
	 * @field
	 * @type float 
	 * @default 1.0
	 * @since 0.0.0
	 */
	this.angularDamping = 1.0;
	
	/**
	 * Holds the inverse mass
	 * @private
	 * @field
	 * @type float 
	 * @default 0.0, indicating infinite mass
	 * @since 0.0.0
	 */
	this.inverseMass = 0.0;
	if (mass) {
		this.inverseMass = 1 / mass;
	} // if
	
	/**
	 * Holds the inverse inertia over the center of gravity along the Z-axis
	 * @private
	 * @field
	 * @type float 
	 * @default 0.0, indicating infinite inertia
	 * @since 0.0.0
	 */
	this.inverseInertia = 0.0;
	if (inertia) {
		this.inverseInertia = 1 / inertia;
	}
	
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
	 * The overall torque accumulator
	 * @private
	 * @field
	 * @type float 
	 * @default 0.0
	 * @since 0.0.0
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
	 * @type Matrix2
	 * @default Zero matrix
	 * @since 0.0.0
	 */
	this.transformMatrix = undefined;
	
	/**
	 * Calculates internal data from state data. This should be called
	 * after the body's state is altered directly (it is called
	 * automatically during integration). If you change the body's
	 * state and then intend to integrate before querying any data
	 * (such as the transform matrix), then you can omit this step.
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.calculateDerivedData = function() {
		this.calculateTransformMatrix();
	}
	
	/**
	 * Calculates the {@link #transformMatrix} from this position and orientation
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.calculateTransformMatrix = function() {
		this.transformMatrix = new TransformationMatrix3(
      this.getOrientationAngle(), this.pos.x, this.pos.y
    );
	}
	
	/**
	 * Sets the orientation angle of this object (-PI;PI]
	 * TODO: this method normalizes the vector after every call
	 *       we need a less expensive way to periodically normalize
	 *       the orientation vector
	 * @function
	 * @param {float} theta The orientation to use
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setOrientationAngle = function(theta) {
		this.orientation.x = Math.cos(theta);
		this.orientation.y = Math.sin(theta);
		this.orientation.normalizeMutate();
	}
	
	/**
	 * Sets the orientation of this object
	 * @function
	 * @param {Vector2d} orientation The orientation of this body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setOrientation = function(orientation) {
		this.orientation = orientation;
	}
	
	/**
	 * Sets the orientation angle of this object
	 * @function
	 * @returns {float} The orientation of this object in radians
	 * @since 0.0.0
	 */
	this.getOrientationAngle = function() {
    var x = this.orientation.x;
    var y = this.orientation.y;

    return Math.atan2(y, x);
	}
	
	/**
	 * Gets the orientation of this object
	 * @function
	 * @returns {Vector2} The orientation of this object
	 * @since 0.0.0
	 */
	this.getOrientation = function() {
		return this.orientation;
	}
	
	/**
	 * Converts a point relative to this center of gravity to world coordinates
	 * @function 
	 * @param {Vector2} point Point to transform
	 * @returns {Vector2} The transformed point
	 * @since 0.0.0
	 */
	 this.getPointInWorldSpace = function(point) {
     var v3 = new Vector3(point.x, point.y, 1);
		 v3 = this.transformMatrix.multVector(v3);
     return new Vector2(v3.x, v3.y);
	 }
	 
	/**
	 * Converts a point in world coordinates to a point relative to this body's local 
	 * coordinates
	 * @function 
	 * @param {Vector2} point Point to transform
	 * @returns {Vector2} The transformed point
	 * @since 0.0.0
	 */
	 this.getPointInLocalSpace = function(point) {
     var v3 = new Vector3(point.x, point.y, 1);
		 v3 = this.transformMatrix.getInverse().multVector(v3);
     return new Vector2(v3.x, v3.y);
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
	 * Adds an external force to the center of mass of this rigid body
	 * @function 
	 * @param {Vector2} force The force to add to this rigid body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(force) {
		this.forceAccum.addMutate(force);
	}
	
	/**
	 * Adds the given force to the given point on the rigid body.
	 * The direction of the force is given in world coordinates,
	 * but the application point is given in body space. This is
	 * useful for spring forces, or other forces fixed to the
	 * body.
	 *
	 * @function 
	 * @param {Vector2} force The force to add to this rigid body
	 * @param {Vector2} point The location at which to apply the force in world coordinates
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForceAtBodyPoint = function(force, point) {
		var pt = this.getPointInWorldSpace(point);
		this.addForceAtPoint(force, pt);
	}
	
	/**
	 * Adds the given force to this body at the relative point
	 * @function 
	 * @param {Vector2} force The force to add to this rigid body
	 * @param {Vector2} point The location at which to apply the force in local coordinates
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addForceAtPoint = function(force, point) {
		this.applyForce(force);

    var pt = point.clone();
    pt.subMutate(this.pos);
		this.applyTorque(
      pt.vectorProduct(force)
		);
	}
	
	/**
	 * Reset the force accumulator on this rigid body
	 * @function 
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.clearForceAccum = function() {
		this.forceAccum.zeroMutate();
	}
	
	/**
	 * Adds an external torque to the rigid body
	 * @function 
	 * @param {float} torque The torque to add to this rigid body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyTorque = function(torque) {
		this.torqueAccum += torque;
	}
	
	/**
	 * Reset the torque accumulator on this rigid body
	 * @function 
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.clearTorqueAccum = function() {
		this.torqueAccum = 0.0;
	}
	
	/**
	 * Clears all frame accumulators
	 * @function 
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.clearAccums = function() {
		this.clearForceAccum();
		this.clearTorqueAccum();
	}
	
	/**
	 * Sets the inverse mass of the rigid body
	 * @function 
	 * @param {float} inverseMass The inverse mass of the rigid body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setInverseMass = function(inverseMass) {
		this.inverseMass = inverseMass;
	}
	
	/**
	 * Sets the mass of the rigid body
	 * @function
	 * @param {float} mass The mass of the rigid body
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
	 * Gets the mass of the rigid body
	 * @function
	 * @returns {float} The mass of the rigid body
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
	 * Sets the inverse inertia of the rigid body
	 * @function 
	 * @param {float} inverseInertia The inverse inertia of the rigid body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setInverseInertia = function(inverseInertia) {
		this.inverseInertia = inverseInertia;
	}
	
	/**
	 * Sets the inertia of the rigid body
	 * @function
	 * @param {float} inertia The inertia of the rigid body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.setInertia = function(inertia) {
		if (inertia == 0) {
			this.inverseInertia = 0;
		} else {
			this.inverseInertia = 1 / inertia;
		} // if
	}
	
	/**
	 * Gets the inertia of the rigid body
	 * @function
	 * @returns {float} The inertia of the rigid body
	 * @since 0.0.0
	 */
	this.getInertia = function() {
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
	 * @since 0.0.0
	 */
	this.integrate = function(delta) {		
		var dt = delta / 1000;
		
		// linear motion
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
	 * @since 0.0.0.3
   */
  this.accept = function(visitor) {
    visitor.visitRigidBody(this);
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
RigidBody.prototype = new Observable();

/**
 * Next uid counter
 * @private
 * @static
 * @field
 * @type long
 * @default Zero vector
 * @since 0.0.0
 */
RigidBody.nextUid = 0;

/**
 * Generates a unique uid for a rigid body
 * @private
 * @static
 * @function
 * @returns {long} Unique uid
 * @since 0.0.0
 */
RigidBody.getNextUid = function() {
	return RigidBody.nextUid++;
}

/**
 * @class A rigid body force generator
 * @constructor
 * @abstract
 * @since 0.0.0
 */
function ForceGenerator() {

	/**
	 * Apply force to the given rigid body over the delta time
	 * @function
	 * @abstract
	 * @param {RigidBody} rigidBody The rigid body to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(rigidBody, delta) {}

  /**
   * Accepts a world visitor
	 * @method
   * @abstract
   * @param {WorldVisitor} visitor Visitor to visit
   * @param {RigidBody} rigidBody RigidBody that is currently affected by this generator
	 * @returns {void}
	 * @since 0.0.0.3
   */
	this.accept = function(visitor, rigidBody) {
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
 * @extends ForceGenerator
 * @param {Vector2} gravition Gravitational force, defaults {@link constants.DEFAULT_GRAVITATIONAL_CONSTANT}
 * @since 0.0.0
 */
function GravityForceGenerator(gravitation) {

	/**
	 * The gravitational pull
	 * @field 
	 * @type Vector2
	 * @default Vector with {@link constants.DEFAULT_GRAVITATIONAL_CONSTANT} as Y-axis
	 * @since 0.0.0
	 */
	this.gravitation = gravitation || new Vector2(0, constants.DEFAULT_GRAVITATIONAL_CONSTANT);
	
	/**
	 * Apply gravity to the given mass over the delta time
	 * @function
	 * @override
	 * @param {RigidBody} rigidBody The rigid body to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(rigidBody, delta) {
		if (!rigidBody.hasFiniteMass()) {
			if (debug && verbose) {
				console.debug("RigidBody %o has zero mass", rigidBody);
			} // if
			return;
		} // if
		
		rigidBody.applyForce(
			// scale force, since gravity is constant regardless of mass 
			this.gravitation.multScalar(rigidBody.getMass())
		);
	}

  /**
	 * Accepts the supplied rigid boy visitor
	 * @function
	 * @override
	 */
	this.accept = function(visitor, rigidBody) {
    visitor.visitGravityForceGenerator(this, rigidBody);
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
GravityForceGenerator.prototype = new ForceGenerator();

/**
 * @class A spring force generator
 * @constructor
 * @extends ForceGenerator
 * @param {Vector2} connectionPoint The connection point of the spring, in
 *        local coordinates of this rigid body
 * @param {RigidBody} rigidBodyOther Rigid body at the other end of the spring
 * @param {Vector2} connectionPointOther The connection point of the spring,
 *        in that object's local coordinates of the {@link #rigidBodyOther}
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @since 0.0.0
 */
function SpringForceGenerator(connectionPoint, rigidBodyOther, connectionPointOther,
	springConstant, restLength) {
	
	/**
	 * The connection point of the spring, in local coordinates of this rigid 
	 * body
	 * @field 
	 * @type Vector2d
	 * @default connectionPoint
	 * @since 0.0.0
	 */
	this.connectionPoint = connectionPoint;
	
	/**
	 * The other connection point of the spring, in local coordinates of the
	 * {@link #rigidBodyOther}
	 * @field 
	 * @type Vector2d
	 * @default connectionPointOther
	 * @since 0.0.0
	 */
	this.connectionPointOther = connectionPointOther;

	/**
	 * Rigid body at the other end of the spring
	 * @field
	 * @type RigidBody
	 * @default rigidBodyOther
	 * @since 0.0.0
	 */
	this.rigidBodyOther = rigidBodyOther;

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
	 * Apply spring force to the given rigid body over the delta time
	 * @function
	 * @override
	 * @param {RigidBody} rigidBody The rigid body to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(rigidBody, delta) {
		var lws = rigidBody.getPointInWorldSpace(this.connectionPoint);
		var ows = this.rigidBodyOther.getPointInWorldSpace(this.connectionPointOther);
		var force = lws.sub(ows);
		
		var magnitude = force.getMagnitude();
		magnitude = Math.abs(magnitude - this.restLength);
		magnitude *= this.springConstant;
		
		force.normalizeMutate();
		force.multScalarMutate(-magnitude);
		rigidBody.addForceAtPoint(force, lws);
	}

  /**
	 * Accepts the supplied rigid boy visitor
	 * @function
	 * @override
	 */
	this.accept = function(visitor, rigidBody) {
    visitor.visitSpringForceGenerator(this, rigidBody);
  }
}
SpringForceGenerator.prototype = new ForceGenerator();

/**
 * @class A constant torque force generator
 * @constructor
 * @extends ForceGenerator
 * @param {float} torque The amount of torque to apply
 * @since 0.0.0
 */
function ConstantTorqueForceGenerator(torque) {

	/**
	 * The torque to apply
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.torque = torque || 0.0;
	
	/**
	 * Apply torque to the given mass over the delta time
	 * @function
	 * @override
	 * @param {RigidBody} rigidBody The rigid body to apply the force to
	 * @param {int} delta The delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForce = function(rigidBody, delta) {
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
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "Constant Torque: " + this.torque;
	}
}
ConstantTorqueForceGenerator.prototype = new ForceGenerator();

/**
 * @class An aero dynamic tensor fake force generator
 * @constructor
 * @extends ForceGenerator
 * @param {Matrix2} tensor The aerodynamic tensor for the surface in body space
 * @param {Vector2} position The relative position of the aerodynamic surface in body coordinates
 * @param {Vector2} windspeed The wind speed
 * @since 0.0.0.3
 */
function AeroForceGenerator(tensor, position, windspeed) {

  /**
	 * The aerodynamic tensor for the surface in body space
	 * @field
	 * @type Matrix2
	 * @default undefined
	 * @since 0.0.0.3
	 */
  this.tensor = tensor;

  /**
	 * The relative position of the aerodynamic surface in body coordinates
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0.3
	 */
  this.position = position;

	/**
	 * The wind speed
	 * @field
	 * @type float
	 * @default 0.0
	 * @since 0.0.0.3
	 */
	this.windspeed = windspeed || new Vector2(0, 0);

	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this object
	 * @since 0.0.0
	 */
	this.toString = function() {
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
 * @param {Vector2} position The relative position of the aerodynamic surface in body coordinates
 * @param {Vector2} windspeed The wind speed
 * @since 0.0.0.3
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
	 * @since 0.0.0.3
	 */
  this.minTensor = minTensor;

  /**
	 * The aerodynamic tensor for the surface in body space (at maximum value)
	 * @field
	 * @type Matrix2
	 * @default undefined
	 * @since 0.0.0.3
	 */
  this.maxTensor = maxTensor;


  /**
	 * Range of -1 to 1, where if -1 then minTensor is used, at 1 maxTensor is used, and in
   * between base tensor is used
	 * @field
	 * @type float
	 * @default 0.0
	 * @since 0.0.0.3
	 */
  this.controlSetting = 0.0;

  /**
	 * The relative position of the aerodynamic surface in body coordinates
	 * @method
	 * @type Vector2
	 * @returns {Matrix2} Aero dynamic tensor to use for current control setting
	 * @since 0.0.0.3
	 */
  this.getTensor = function() {
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
	 * @since 0.0.0
	 */
	this.applyForce = function(rigidBody, delta) {
    if (!rigidBody.hasFiniteMass()) {
			if (debug && verbose) {
				console.debug("RigidBody %o has zero mass", rigidBody);
			} // if
			return;
		} // if

    var force = this.getTensor().multVector(this.windspeed);
		rigidBody.applyForceAtBodyPoint(force, this.position);
	}

  /**
	 * Accepts the supplied rigid boy visitor
	 * @function
	 * @override
	 */
	this.accept = function(visitor, rigidBody) {
    visitor.visitAeroControlForceGenerator(this, rigidBody);
  }

	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this object
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "Aero: windspeed=" + this.windspeed.toString() +
      ", tensor=" + tensor.toString() +
      ", pos=" + pos.toString();
	}
}
AeroControlForceGenerator.prototype = new AeroForceGenerator();

/**
 * @class Force generator factory
 * @constructor
 * @since 0.0.0
 */
function ForceGeneratorFactory() {
}

/**
 * Creates a gravity force generator for a single rigid body only
 * @function
 * @static
 * @param {ForceRegistry} forceRegistry The force registry to add the generator to
 * @param {RigidBody} rigidBody The rigidBody to add the generator to
 * @param {Vector2d} gravitation Optional gravitional pull
 * @returns {void}
 * @since 0.0.0
 */
ForceGeneratorFactory.createGravity = function(forceRegistry, rigidBody, gravitation) {
	forceRegistry.add(rigidBody, new GravityForceGenerator(gravitation));
}

/**
 * Creates a constant torque force generator for a single rigid body only
 * @function
 * @static
 * @param {ForceRegistry} forceRegistry The force registry to add the generator to
 * @param {RigidBody} rigidBody The rigidBody to add the generator to
 * @param {float} torque The torque force to apply
 * @returns {void}
 * @since 0.0.0
 */
ForceGeneratorFactory.createConstantTorque = function(forceRegistry, rigidBody, torque) {
	forceRegistry.add(rigidBody, new ConstantTorqueForceGenerator(torque));
}

/**
 * Creates a spring force generator for a single rigid body only
 * @function
 * @static
 * @param {ForceRegistry} forceRegistry The force registry to add the generator to
 * @param {RigidBody} rigidBody The rigidBody to add the generator to
 * @param {Vector2} connectionPoint The connection point of the spring, in
 *        local coordinates of this rigid body
 * @param {RigidBody} rigidBodyOther Rigid body at the other end of the spring
 * @param {Vector2} connectionPointOther The connection point of the spring,
 *        in that object's local coordinates of the {@link #rigidBodyOther}
 * @param {float} springConstant Holds the spring constant
 * @param {float} restLength Holds the spring's rest length
 * @returns {void}
 * @since 0.0.0
 */
ForceGeneratorFactory.createSpring = function(forceRegistry, rigidBody, connectionPoint, rigidBodyOther, connectionPointOther, springConstant, restLength) {
  var p1F = new SpringForceGenerator(connectionPoint, rigidBodyOther, connectionPointOther, springConstant, restLength);
	forceRegistry.add(rigidBody, p1F);
	rigidBody.addEventListener("die", function() {
		if (debug) {
			console.debug("Removing force generator for dead rigid body %s", this.toString());
		} // if

		forceRegistry.removeForceGenerator(p1F);
	});

	var p2F = new SpringForceGenerator(connectionPointOther, rigidBody, connectionPoint, springConstant, restLength)
	forceRegistry.add(rigidBodyOther, p2F);
	rigidBodyOther.addEventListener("die", function() {
		if (debug) {
			console.debug("Removing force generator for dead rigid body %s", this.toString());
		} // if

		forceRegistry.removeForceGenerator(p2F);
	});
}

/** 
 * @class A force registry for matching up force generators to rigid bodies
 * @constructor
 * @since 0.0.0
 */
function ForceRegistry() {
	
	/**
	 * Registry entries
	 * @field
	 * @type {"rigidBody":RigidBody, "forceGenerators":ForceGenerator []}
	 * @default []
	 * @since 0.0.0
	 */
	this.entries = [];
	
	/**
	 * Adds the force generator to the supplied rigid body
	 * TODO: This is a very brute force function, we need a HashMap or similar datastructure
	 * @function
	 * @param {RigidBody} rigidBody The rigid body to add a force generator to
	 * @param {ForceGenerator} forceGenerator The force generator to add to the rigid body
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.add = function(rigidBody, forceGenerator) {
		var entry;
		var found = false;
		for (i in this.entries) {
			entry = this.entries[i];
			if (entry.rigidBody === rigidBody) {
				found = true;
				break;
			} // if
		} // for
		
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
	 * @since 0.0.0
	 */
	this.getForceGenerators = function(rigidBody) {
		for (i in this.entries) {
			var entry = this.entries[i];
			if (entry.rigidBody === rigidBody) {
				return entry.forceGenerators;
			} // if
		} // for
		
		return undefined;
	}
	
	/**
	 * Removes all force generators for the supplied rigid body
	 * @function
	 * @param {RigidBody} rigidBody The rigid body to remove the force generators from
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.removeForceGenerators = function(rigidBody) {
		for (i in this.entries) {
			var entry = this.entries[i];
			if (entry.rigidBody === rigidBody) {
				this.rigidBodies.splice(i, 1);
			} // if
		} // for
	}
	
	/**
	 * Removes a specific force generator
	 * @function
	 * @param {ForceGenerator} forceGenerator The specific force generator to remove
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
	 * Adds each force generator's force to every rigid body in the registry over the delta time
	 * @function
	 * @param {int} delta Delta time in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyForces = function(delta) {
		for (i in this.entries) {
			var entry = this.entries[i];
			var rigidBody = entry.rigidBody;
			var forceGenerators = entry.forceGenerators;
			for (j in forceGenerators) {
				var forceGenerator = forceGenerators[j];
				forceGenerator.applyForce(rigidBody, delta);
			} // for
		} // for
	}

  /**
   * Accepts a world visitor
   * @method
   * @abstract
   * @param {WorldVisitor} visitor Visitor to visit
   * @returns {void}
   * @since 0.0.0.3
   */
  this.accept = function(visitor) {
    for (i in this.entries) {
      var entry = this.entries[i];
      var rigidBody = entry.rigidBody;
      var forceGenerators = entry.forceGenerators;
      for (j in forceGenerators) {
        var forceGenerator = forceGenerators[j];
        forceGenerator.accept(visitor, rigidBody);
      } // for
    } // for
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
 * @since 0.0.0.4
 */
function Contact() {

  /**
	 * Holds the bodies that are involved in the contact. The second may be
	 * omitted in the case of a contact with the environment.
	 * @field
	 * @type RigidBody []
	 * @default []
	 * @since 0.0.0.4
	 */
	this.ridigBodies = [];

	/**
	 * Holds the position of the contact in world coordinates
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.contactPoint = undefined;

	/**
	 * Holds the direction of the contact in world coordinates
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.contactNormal = undefined;

	/**
	 * Penetration depth in the direction of the contact normal
	 * @field
	 * @type float
	 * @default 0.0
	 * @since 0.0.0.4
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
 * @class Bounding volume base class
 * @constructor
 * @since 0.0.0
 */
function BoundingVolume() {
}

/**
 * @class A bounding sphere
 * @constructor
 * @extends BoundingVolume
 * @param {Vector2} center Center of the sphere
 * @param {float} radius Radius of the sphere
 * @since 0.0.0
 */
function BoundingSphere(center, radius) {

  /**
   * Super constructor
   */
  BoundingVolume.call(this);

	/**
	 * Center of the sphere
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.center = center || undefined;

	/**
	 * Radius of the sphere
	 * @field
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.radius = radius || 0.0;

	/**
	 * Determines if the bounding sphere overlaps with the supplied bounding
	 * sphere
	 * @function
	 * @param {BoundingSphere} o The other sphere to test
	 * @returns {boolean} True if this overlaps with the supplied bounding
	 *  sphere
	 * @since 0.0.0
	 */
	this.overlaps = function(o) {
    return Vector2.isWithin(this.center, o.center, this.radius + o.radius);
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
 * @since 0.0.0
 */
BoundingSphere.enclose = function(bs1, bs2) {
  var boundingSphere = new BoundingSphere();
  var center = bs1.center.add(
    bs2.center
  );
  center.multScalar(0.5);
  boundingSphere.center = center;
  boundingSphere.radius = bs1.radius + bs2.radius;
  return boundingSphere;
}

/**
 * @class A bounding box
 * @constructor
 * @extends BoundingVolume
 * @param {Vector2} center Center of the sphere
 * @param {Vector2} halfSize Half size used for collision detection
 * @since 0.0.0
 */
function BoundingBox(center, halfSize) {

  /**
   * Super constructor
   */
  BoundingVolume.call(this);

	/**
	 * Center of the sphere
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.center = center || undefined;

	/**
	 * Half size used for collision detection
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.halfSize = halfSize || undefined;
}
BoundingBox.prototype = new BoundingVolume();

/**
 * @class Stores a potential contact to check later
 * @constructor
 * @param {RigidBody []} rigidBodies The rigid bodies that might be in contact
 * @since 0.0.0
 */
function PotentialContact(rigidBodies) {

	/**
	 * The rigid bodies that might be in contact
	 * @field
	 * @type RigidBody []
	 * @default undefined
	 * @since 0.0.0
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
 * @since 0.0.0
 */
function BVHNode(children, volume, rigidBody) {

	/**
	 * The child nodes
	 * @field
	 * @type BVHNode []
	 * @default undefined
	 * @since 0.0.0
	 */
	this.children = children || undefined;

	/**
	 * Holds a single volume encompassing all the descendents of this node.
	 * @field
	 * @type BoundingVolume
	 * @default undefined
	 * @since 0.0.0
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
	 * @since 0.0.0
	 */
	this.rigidBody = rigidBody || undefined;

	/**
	 * Determines if this node is at the bottom of the hierarchy
	 * @function
	 * @returns {boolean} True if this node is at the bottom of the hierarchy
	 * @since 0.0.0
	 */
	this.isLeaf = function() {
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
	 * @since 0.0.0
	 */
	this.insert = function(rigidBody, volume) {
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
	 * @since 0.0.0
	 */
	this.remove = function() {
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
	 * @since 0.0.0
	 */
	this.getPotentialContacts = function(potentialContacts, limit) {
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
	 * @since 0.0.0
	 */
	this.getPotentialContactsWith = function(o, potentialContacts, limit) {
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
	 * @since 0.0.0
	 */
	this.overlaps = function(o) {
		return this.volume.overlaps(o.volume);
	}
}

/**
 * @class BSP collision plane
 * @constructor
 * @param {Vector2} position Any position on the plane
 * @param {Vector2} direction The direction perpendicular to the plane
 * @since 0.0.0
 */
function Plane2(position, direction) {

	/**
	 * Any position on the plane
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.position = position || undefined;

	/**
	 * The direction perpendicular to the plane, this should be a normalized
	 * vector
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.direction = direction || undefined;
}

/**
 * BSP child can be of types NODE or OBJECTS
 * @enum
 * @since 0.0.0.4
 */
BSP_CHILD_TYPE = {
  BSP_CHILD_NODE : 1,
  BSP_CHILD_OBJECTS : 2
};

/**
 * @class BSP collision child
 * @constructor
 * @param {int} type {@link BSP_CHILD_TYPE} Type of the child
 * @since 0.0.0.4
 */
function BSPChild2(type) {

	/**
	 * {@link BSP_CHILD_TYPE} type of the child
	 * @field
	 * @type int
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.type = type || undefined;

	/**
	 * Node in case if type is {@link BSP_CHILD_TYPE.BSP_CHILD_NODE}
	 * @field
	 * @type BSPNode2
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.node = undefined;

	/**
	 * Array of objects if type is {@link BSP_CHILD_TYPE.BSP_CHILD_OBJECTS}
	 * @field
	 * @type Array
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.objects = undefined;
}

/**
 * @class BSP collision node
 * @constructor
 * @param {Plane2} plane Collision plane
 * @param {BSPNode2} front Node in front of the plane
 * @param {BSPNode2} black Node behind the plane
 * @since 0.0.0
 */
function BSPNode2(plane, front, back) {

	/**
	 * Collision plane
	 * @field
	 * @type Plane2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.plane = plane || undefined;

	/**
	 * Child in front of the plane
	 * @field
	 * @type BSPChild
	 * @default undefined
	 * @since 0.0.0
	 */
	this.front = front || undefined;

	/**
	 * Child behind the plane
	 * @field
	 * @type BSPChild2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.back = back || undefined;
}

/**
 * @class 2D Quad node tree
 * @constructor
 * @param {Vector2} position Position of the quad tree node
 * @since 0.0.0.4
 */
function QuadNodeTree2(position) {

  /**
	 * Position of the quad tree node
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.position = position || undefined;

  /**
	 * Quadrants of the tree node
	 * @field
	 * @type QuadNodeTree2 []
	 * @default undefined
	 * @since 0.0.0.4
	 */
	this.children = [];

  /**
	 * Gets the child index at the specified location
	 * @function
	 * @param {Vector2} o The object's position
	 * @returns {int} The index of the object
	 * @since 0.0.0.4
	 */
	this.getChildIndex = function(o) {
    var index = 0;
    if (o.x > this.position.x) {
      index += 1;
    } // if

    if (o.y > this.position.y) {
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
 * @param {Vector2} origin The origin of the grid
 * @since 0.0.0.4
 */
function Grid2(xExtent, yExtent, origin) {

  /**
	 * Number of cells in the X-direction of the grid
	 * @field
	 * @type int
	 * @default 0
	 * @since 0.0.0.4
	 */
	this.xExtent = xExtent || 0;

  /**
	 * Number of cells in the Y-direction of the grid
	 * @field
	 * @type int
	 * @default 0
	 * @since 0.0.0.4
	 */
	this.yExtent = yExtent || 0;

  /**
	 * Cells of the grid
	 * @field
	 * @type Object []
	 * @default []
	 * @since 0.0.0.4
	 */
	this.locations = [];

  /**
	 * Origin of the grid
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0.4
	 */
  this.origin = origin || undefined;

  /**
	 * 1 over the size of each cell
	 * @field
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0.4
	 */
  this.oneOverCellSize = undefined;

  /**
	 * Gets the location index at the specified location
	 * @function
	 * @param {Vector2} o The object's location
	 * @returns {int} The index of the location
	 * @since 0.0.0.4
	 */
	this.getLocationIndex = function(o) {
    var square = o.multScalar(
      this.oneOverCellSize
    );
		return square.x + this.xExtent * square.y;
	}
}

/**
 * @class Collision 2D primitive base class
 * @constructor
 * @param {RigidBody} rigidBody The body encapsulated by this primitive
 * @param {TransformationMatrix3} offset Translation and rotation from the rigid body
 * @since 0.0.0.4
 */
function CollisionPrimitive2(rigidBody, offset) {

  /**
	 * The body encapsulated by this primitive
	 * @field
	 * @type RigidBody
	 * @default undefined
	 * @since 0.0.0.4
	 */
  this.rigidBody = rigidBody || undefined;

  /**
	 * Translation and rotation from the rigid body for this primitive
	 * @field
	 * @type TransformationMatrix3
	 * @default undefined
	 * @since 0.0.0.4
	 */
  this.offset = offset || undefined;
}

/**
 * @class Collision circle
 * @constructor
 * @extends CollisionPrimitive2
 * @param {RigidBody} rigidBody The body encapsulated by this primitive
 * @param {TransformationMatrix3} offset Translation and rotation from the rigid body
 * @since 0.0.0.4
 */
function CollisionCircle(rigidBody, offset, radius) {

  /**
   * Super constructor
   */
  CollisionPrimitive2.call(this, rigidBody, offset, radius);

  /**
	 * Radius of this circle
	 * @field
	 * @type float
	 * @default 0.0
	 * @since 0.0.0.4
	 */
  this.radius = radius || 0.0;
}
CollisionCircle.prototype = new CollisionPrimitive2();

/**
 * @class 2D collision detector
 * @constructor
 * @since 0.0.0.4
 */
function CollisionDetector2() {

   /**
    * Gets the child index at the specified location
    * @function
    * @param {CollisionCircle} one The first circle to use
    * @param {CollisionCircle} two The second circle to use
    * @param {Contact []} contacts Contacts to append to
    * @param {int} limit Maximum number of contacts that may be added
    * @returns {int} The number of contacts generated
    * @since 0.0.0.4
    */
	this.circleAndCircle = function(one, two, contacts, limit) {
    var positionOne = one.rigidBody.pos;
    var positionTwo = two.rigidBody.pos;

    var midline = positionOne.sub(positionTwo);
    var size = midline.getMagnitude();

    if (size <= 0 || size >= one.radius + two.radius) {
      return 0;
    } // if

    var normal = midline.multScalar(1/size);
    var contact = new Contact();
    contact.contactNormal = normal;
    contact.contactPoint = positionOne.add(
      midline.multScalar(0.5)
    );
    contact.penetration = one.radius + two.radius - size;

    contact.ridigBodies[0] = one.rigidBody;
    contact.ridigBodies[1] = two.rigidBody;
    //contact.restitution = data.restitution; // TODO: add restitution
    //contact.friction = data.friction;

    contacts.push(contact);

    return 1;
  }
}

/**
 * @class Visitor interface to visit the rigid body world
 * @constructor
 * @since 0.0.0.3
 */
function WorldVisitor() {

  /**
	 * @method
	 * @abstract
	 * Visits the world
   * @param {World} world The visited world
	 * @return void
	 */
	this.visitWorld = function(world) {
	}

  /**
	 * @method
	 * @abstract
	 * Visits the rigid body
   * @param {RigidBody} rigidBody The visited ridig body
	 * @return void
	 */
	this.visitRigidBody = function(rigidBody) {
	}

  /**
	 * @method
	 * @abstract
	 * Visits a gravity force generator
   * @param {GravityForceGenerator} forceGenerator The visited force generator
   * @param {RigidBody} rigidBody The rigidBody currently affected by this force generator
	 * @return void
	 */
	this.visitGravityForceGenerator = function(forceGenerator, rigidBody) {
	}

  /**
	 * @method
	 * @abstract
	 * Visits a spring force generator
   * @param {SpringForceGenerator} forceGenerator The visited force generator
   * @param {RigidBody} rigidBody The rigidBody currently affected by this force generator
	 * @return void
	 */
	this.visitSpringForceGenerator = function(forceGenerator, rigidBody) {
	}

  /**
	 * @method
	 * @abstract
	 * Visits a aero control force generator
   * @param {AeroControlForceGenerator} forceGenerator The visited force generator
   * @param {RigidBody} rigidBody The rigidBody currently affected by this force generator
	 * @return void
	 */
	this.visitAeroControlForceGenerator = function(forceGenerator, rigidBody) {
	}
}

/**
 * @class Keeps track of all rigid bodies
 * @constructor
 * @since 0.0.0
 */
function World() {
	
	/**
	 * All rigid bodies in simulation
	 * @field 
	 * @type RigidBody []
	 * @default []
	 * @since 0.0.0
	 */
	this.rigidBodies = [];
	
	/**
	 * Holds all the force generators
	 * @field 
	 * @type ForceRegistry
	 * @default new ForceRegistry()
	 * @since 0.0.0
	 */
	this.forceRegistry = new ForceRegistry();
	
	/**
	 * Force generators applied to all rigid bodies
	 * @field 
	 * @type ForceGenerator []
	 * @default []
	 * @since 0.0.0
	 */
	this.globalForceGenerators = [];
	
	/**
	 * Adds a new rigid body to the simulation
	 * @function
	 * @param {RigidBody} rigidBody The new rigidBody to add
	 * @returns {int} The total number of rigid bodies in the simulation
	 * @since 0.0.0
	 */
	this.addRigidBody = function(rigidBody) {
		return this.rigidBodies.push(rigidBody);
	}
	
	/**
	 * Removes a rigid body from the simulation
	 * @function
	 * @param {RigidBody} rigidBody The rigid body to remove
	 * @returns {RigidBody} The removed rigid body, undefied if not removed
	 * @since 0.0.0
	 */
	this.removeParticle = function(rigidBody) {
		var removedRigidBody = undefined;
		for (i in this.rigidBodies) {
			var el = this.rigidBodies[i];
			if (el === rigidBody) {
				if (debug) {
					console.debug("Removing rigid body %s", rigidBody.toString());
				} // if
				
				var removedRigidBody = this.rigidBodies.splice(i, 1);
				removedRigidBody.die();				
				return removedRigidBody;
			} // if
		} // for
		return removedRigidBody;
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
	 * Clears all force accumulators on rigid bodies
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.startFrame = function() {
		for (i in this.rigidBodies) {
			var rigidBody = this.rigidBodies[i];
			rigidBody.clearForceAccum();
			rigidBody.calculateDerivedData();
		} // for
	}
	
	/**
	 * Integrates all the rigid bodies in this world forward in time
	 * by the given duration
	 * @function
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.integrate = function(delta) {
		for (i in this.rigidBodies) {
			var rigidBody = this.rigidBodies[i];
			rigidBody.integrate(delta);
		} // for
	}
	
	/**
	 * Process all physics for the world
	 * @function
	 * @param {int} delta Delta time in milliseconds since last update
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.runPhysics = function(delta) {
		this.applyGlobalForces(delta);
		this.forceRegistry.applyForces(delta);
		this.integrate(delta);
	}

	/**
	 * Adds a global force generator
	 * @function
	 * @param {ForceGenerator} forceGenerator The global force generator to be added
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addGlobalForce = function(forceGenerator) {
		this.globalForceGenerators.push(forceGenerator);
	}
	
	/**
	 * Applies all global forces to all rigid bodies over time delta
	 * @function
	 * @param {int} delta Delta Time delta in milliseconds
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.applyGlobalForces = function(delta) {
		for (j in this.globalForceGenerators) {
			var forceGenerator = this.globalForceGenerators[j];
			for (i in this.rigidBodies) {
				var rigidBody = this.rigidBodies[i];
				forceGenerator.applyForce(rigidBody, delta);
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
			new GravityForceGenerator(gravitation)
		);
	}

  /**
   * Accepts a world visitor
	 * @function
   * @param {WorldVisitor} visitor Visitor to visit
	 * @returns {void}
	 * @since 0.0.0.3
   */
  this.accept = function(visitor) {
    visitor.visitWorld(this);

    for (i in this.rigidBodies) {
			var rigidBody = this.rigidBodies[i];
      rigidBody.accept(visitor);
      for (j in this.globalForceGenerators) {
			  var forceGenerator = this.globalForceGenerators[j];
        forceGenerator.accept(visitor, rigidBody);
		  } // for
		} // for

    this.forceRegistry.accept(visitor);
  }
}