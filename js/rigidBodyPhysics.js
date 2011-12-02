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
 * @param {Vector2} gravition Gravitational force, defaults {@link DEFAULT_GRAVITATIONAL_CONSTANT}
 * @since 0.0.0
 */
function GravityForceGenerator(gravitation) {

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