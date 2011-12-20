/**
 * @fileOverview Mathematics module
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * @class Rectangle helper object
 * @constructor
 * @param {Number} x X-Coordinate of the rectangle
 * @param {Number} y Y-Coordinate of the rectangle
 * @param {Number} width Width of the rectangle 
 * @param {Number} height Height of the rectangle
 * @since 0.0.0
 */
Rectangle = function(x, y, width, height) {

	/**
	 * X position of this rectangle
	 * @field 
	 * @type Number
	 * @default 0
	 * @since 0.0.0
	 */
	this.x = x || 0;
	
	/**
	 * Y position of this rectangle
	 * @field 
	 * @type Number
	 * @default 0
	 * @since 0.0.0
	 */
	this.y = y || 0;
	
	/**
	 * Width of this rectangle
	 * @field 
	 * @type Number
	 * @default 0
	 * @since 0.0.0
	 */
	this.width = width || 0;
	
	/**
	 * Height of this rectangle
	 * @field 
	 * @type Number
	 * @default 0
	 * @since 0.0.0
	 */
	this.height = height || 0;

	/**
	 * Draws this rectangle
	 * @function 
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function() {
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
	
	/**
	 * Tests if a point is inside this rect
	 * @function
	 * @param {Vector2} point The point to test
	 * @returns {boolean} true if this point is inside the rect
	 * @since 0.0.0
	 */
	this.isPointInside = function(point) {
		if (point.x >= this.x &&
			point.x <= this.x + this.width &&
			point.y >= this.y &&
			point.y <= this.y + this.height
			) {
			return true;
		} // if
		
		return false;
	}
	
	/**
	 * Tests if a point is strictly inside this rect
	 * @function
	 * @param {Vector2} point The point to test
	 * @returns {boolean} true if this point is inside the rect
	 * @since 0.0.0
	 */
	this.isPointInsideStrict = function(point) {
		if (point.x > this.x &&
			point.x < this.x + this.width &&
			point.y > this.y &&
			point.y < this.y + this.height
			) {
			return true;
		} // if
		
		return false;
	}
	
	/**
	 * Shrinks the rectangle by the given amount
	 * @function
	 * @param {Number} amount The amount by which to shrink this rectangle
	 * @return {Rectangle} The shrunked version of this rectangle
	 * @since 0.0.0
	 */
	this.shrink = function(amount) {
		var clone = this.clone();
		clone.shrinkMutate(amount);
		return clone;
	}
	
	/**
	 * Shrinks the rectangle by the given amount
	 * @function
	 * @param {Number} amount The amount by which to shrink this rectangle
	 * @return {void}
	 * @since 0.0.0
	 */
	this.shrinkMutate = function(amount) {
		this.x += amount;
		this.y += amount;
		this.width -= amount * 2;
		this.height -= amount * 2;
	}
	
	/**
	 * Clones this rectangle
	 * @function
	 * @return {Rectangle} The cloned version of this rectangle
	 * @since 0.0.0
	 */
	this.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

  /**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this class
	 * @since 0.0.0.3
	 */
	this.toString = function() {
		return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
	}
}

/**
 * @class 2-Dimensional vector
 *
 * Since we want to use clones in some arithmetic and simply modify a vector
 * in other situations. Some of the operations come in two flavors. e.g. @link{#add} and
 * @link{#addMutate}.  In this example add creates a new vector and leaves the current
 * unchanged, whereas @link{#addMutate} modifies this vector and returns nothing.
 * @constructor
 * @param {Number} x X-coordinate
 * @param {Number} y Y-coordinate
 * @since 0.0.0
 */
Vector2 = function(x, y) {

	/**
	 * X coordinate of this rectangle
	 * @field
	 * @type Number
	 * @default 0
	 * @since 0.0.0
	 */
	this.x = x || 0;

	/**
	 * Y coordinate of this rectangle
	 * @field
	 * @type Number
	 * @default 0
	 * @since 0.0.0
	 */
	this.y = y || 0;

	/**
	 * Add another vector to this vector
	 * @function
	 * @param {Vector2} o The vector to add to this vector
	 * @return {Vector2} The newly created vector
	 * @since 0.0.0
	 */
	this.add = function(o) {
		var newVector = this.clone();
		newVector.x += o.x;
		newVector.y += o.y;
		return newVector;
	}

	/**
	 * Add another vector to this vector
	 * @function
	 * @param {Vector2} o The vector to add to this vector
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addMutate = function(o) {
		this.x += o.x;
		this.y += o.y;
	}

	/**
	 * Remove another vector from this vector
	 * @function
	 * @param {Vector2} o The vector to remove to this vector
	 * @return {Vector2} The newly created vector
	 * @since 0.0.0
	 */
	this.sub = function(o) {
		var newVector = this.clone();
		newVector.x -= o.x;
		newVector.y -= o.y;
		return newVector;
	}

	/**
	 * Substract another vector from this vector
	 * @function
	 * @param {Vector2} o The vector to subtract from this vector
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.subMutate = function(o) {
		this.x -= o.x;
		this.y -= o.y;
	}

  /**
	 * Flip vector around
	 * @function
	 * @returns {Vector2} The flipped vector
	 * @since 0.0.0.3
	 */
	this.inverse = function() {
		return new Vector2(-this.x, -this.y);
	}

  /**
	 * Inverts this vector
	 * @function
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.inverseMutate = function() {
    this.x = -this.x;
    this.y = -this.y;
	}

	/**
	 * Multiply by a scalar value
	 * @function
	 * @param {Number} s Scalar to multiply by
	 * @returns {Vector2} The newly created vector
	 * @since 0.0.0
	 */
	this.multScalar = function(s) {
		var newVector = this.clone();
		newVector.x *= s;
		newVector.y *= s;
		return newVector;
	}

	/**
	 * Multiply by a scalar value
	 * @function
	 * @param {Number} s Scalar to multiply by
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.multScalarMutate = function(s) {
		this.x *= s;
		this.y *= s;
	}

	/**
	 * Calculate the dot product with another vector
	 * @function
	 * @param {Vector2} other The vector to perform the calculation with
	 * @returns {Number} The dot product
	 * @since 0.0.0
	 */
	this.dotProduct = function(other) {
		return this.x * other.x + this.y * other.y;
	}

  /**
	 * Calculate the vector product with another vector
	 * @function
	 * @param {Vector2} other The vector to perform the calculation with
	 * @returns {Vector2} The vector product
	 * @since 0.0.0.3
	 */
	this.vectorProduct = function(other) {
		return this.x * other.y - this.y * other.x;
	}

	/**
	 * Calculate the magnitude of this vector
	 * @function
	 * @returns {Number} The magnitude
	 * @since 0.0.0
	 */
	this.getMagnitude = function() {
		return Math.sqrt(this.getMagnitudeSquare());
	}

	/**
	 * Calculate the squared magnitude of this vector
	 * @function
	 * @returns {Number} The square magnitude
	 * @since 0.0.0
	 */
	this.getMagnitudeSquare = function() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * Normalizes this vector
	 * @function
	 * @returns {Vector2} The normalized form of this vector
	 * @since 0.0.0
	 */
	this.normalize = function() {
		var newVector = this.clone();
		newVector.normalizeMutate();
		return newVector;
	}

	/**
	 * Normalizes this vector
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.normalizeMutate = function() {
		var magnitude = this.getMagnitude();
		if (magnitude > 0) {
			this.multScalarMutate(1 / magnitude);
		} // if
	}

	/**
	 * Zero out this vector
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.zeroMutate = function() {
		this.x = 0;
		this.y = 0;
	}

	/**
	 * Clones this vector
	 * @function
	 * @returns {Vector2} The clone of this vector
	 * @since 0.0.0
	 */
	this.clone = function() {
		return new Vector2(this.x, this.y);
	}

	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this class
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "(" + this.x + ", " + this.y + ")";
	}

	/**
	 * Draw visual helpers for this vector
	 *
	 * This method assumes that translations have already been made to the starting
	 * position of the vector
	 * @function
	 * @param {StrokeStyle} strokestyle Optional overriding stroke style
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.draw = function(strokestyle) {
		ctx.save();

		ctx.strokeStyle = (strokestyle == undefined ? "lightblue" : strokestyle);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();

		ctx.restore();
	}

	/**
	 * Draw visual helpers for this vector
	 *
	 * This method assumes that translations have already been made to the starting
	 * position of the vector
	 * @function
	 * @param {FillStyle} fillStyle Optional overriding fill style
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.drawPoint = function(fillStyle) {
		ctx.save();
		ctx.fillStyle = (fillStyle == undefined ? "magenta" : fillStyle);
		ctx.translate(this.x, this.y);
		ctx.fillRect(
			-1, -1, 2, 2
		);
		ctx.restore();
	}
}

/**
 * Calculates the angle between two vectors in radians
 * @function
 * @static
 * @param {Vector2} v1 The first vector
 * @param {Vector2} v2 The second vector
 * @returns {Number} The angle between the two vectors
 * @since 0.0.0
 */
Vector2.getAngle = function(v1, v2) {
	return Math.acos(v1.normalize().dotProduct(v2.normalize()));
}

/**
 * Calculates the distance between two vectors
 * @function
 * @static
 * @param {Vector2} v1 The first vector
 * @param {Vector2} v2 The second vector
 * @returns {Number} The distance between the two vectors
 * @since 0.0.0.3
 */
Vector2.getDistance = function(v1, v2) {
	return v1.sub(v2).getMagnitude();
}

/**
 * Calculates the squared distance between two vectors
 * This method is less expensive than {@link Vector2#getDistance} method
 * because it does not perform a square root operation.
 * @function
 * @static
 * @param {Vector2} v1 The first vector
 * @param {Vector2} v2 The second vector
 * @returns {Number} The distance squared between the two vectors
 * @since 0.0.0.3
 */
Vector2.getDistanceSquare = function(v1, v2) {
	return v1.sub(v2).getMagnitudeSquare();
}

/**
 * Determines if the two vectors are within a specified distance from each other.
 * @function
 * @static
 * @param {Vector2} v1 The first vector
 * @param {Vector2} v2 The second vector
 * @param {Number} distance The distance to test for
 * @returns {boolean} True if the vectors are within specified distance
 * @since 0.0.0.3
 */
Vector2.isWithin = function(v1, v2, distance) {
	return Vector2.getDistanceSquare(v1, v2) <= distance * distance;
}

/**
 * Determines if the two vectors are strictly a specified distance from each other.
 * @function
 * @static
 * @param {Vector2} v1 The first vector
 * @param {Vector2} v2 The second vector
 * @param {Number} distance The distance to test for
 * @returns {boolean} True if the vectors are strictly within specified distance
 * @since 0.0.0.3
 */
Vector2.isWithinStrict = function(v1, v2, distance) {
	return Vector2.getDistanceSquare(v1, v2) < distance * distance;
}

/**
 * @class 3-Dimensional vector
 *
 * Since we want to use clones in some arithmetic and simply modify a vector
 * in other situations. Some of the operations come in two flavors. e.g. @link{#add} and
 * @link{#addMutate}.  In this example add creates a new vector and leaves the current
 * unchanged, whereas @link{#addMutate} modifies this vector and returns nothing.
 * @constructor
 * @param {Number} x X-coordinate
 * @param {Number} y Y-coordinate
 * @param {Number} z Z-coordinate
 * @since 0.0.0.3
 */
Vector3 = function(x, y, z) {

	/**
	 * X coordinate of this rectangle
	 * @field
	 * @type Number
	 * @default 0
	 * @since 0.0.0.3
	 */
	this.x = x || 0;

	/**
	 * Y coordinate of this rectangle
	 * @field
	 * @type Number
	 * @default 0
	 * @since 0.0.0.3
	 */
	this.y = y || 0;

  /**
	 * Z coordinate of this rectangle
	 * @field
	 * @type Number
	 * @default 0
	 * @since 0.0.0.3
	 */
	this.z = z || 0;

	/**
	 * Add another vector to this vector
	 * @function
	 * @param {Vector3} o The vector to add to this vector
	 * @return {Vector3} The newly created vector
	 * @since 0.0.0.3
	 */
	this.add = function(o) {
		var newVector = this.clone();
		newVector.x += o.x;
		newVector.y += o.y;
    newVector.z += o.z;
		return newVector;
	}

	/**
	 * Add another vector to this vector
	 * @function
	 * @param {Vector3} o The vector to add to this vector
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.addMutate = function(o) {
		this.x += o.x;
		this.y += o.y;
    this.z += o.z;
	}

	/**
	 * Remove another vector from this vector
	 * @function
	 * @param {Vector3} o The vector to remove to this vector
	 * @return {Vector3} The newly created vector
	 * @since 0.0.0.3
	 */
	this.sub = function(o) {
		var newVector = this.clone();
		newVector.x -= o.x;
		newVector.y -= o.y;
    newVector.z -= o.z;
		return newVector;
	}

	/**
	 * Substract another vector from this vector
	 * @function
	 * @param {Vector3} o The vector to subtract from this vector
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.subMutate = function(o) {
		this.x -= o.x;
		this.y -= o.y;
    this.z -= o.z;
	}

	/**
	 * Flip vector around
	 * TODO: invert is maybe a better name for this method
	 * @function
	 * @returns {Vector3} The flipped vector
	 * @since 0.0.0.3
	 */
	this.reverse = function() {
		return new Vector3(-this.x, -this.y, -this.z);
	}

	/**
	 * Multiply by a scalar value
	 * @function
	 * @param {Number} s Scalar to multiply by
	 * @returns {Vector3} The newly created vector
	 * @since 0.0.0.3
	 */
	this.multScalar = function(s) {
		var newVector = this.clone();
		newVector.x *= s;
		newVector.y *= s;
    newVector.z *= s;
		return newVector;
	}

	/**
	 * Multiply by a scalar value
	 * @function
	 * @param {Number} s Scalar to multiply by
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.multScalarMutate = function(s) {
		this.x *= s;
		this.y *= s;
    this.z *= s;
	}

	/**
	 * Calculate the dot product with another vector
	 * @function
	 * @param {Vector3} o The vector to perform the calculation with
	 * @returns {Number} The dot product
	 * @since 0.0.0.3
	 */
	this.dotProduct = function(o) {
		return this.x * o.x + this.y * o.y + this.z * o.z;
	}

	/**
	 * Calculate the magnitude of this vector
	 * @function
	 * @returns {Number} The magnitude
	 * @since 0.0.0.3
	 */
	this.getMagnitude = function() {
		return Math.sqrt(this.getMagnitudeSquare());
	}

	/**
	 * Calculate the squared magnitude of this vector
	 * @function
	 * @returns {Number} The square magnitude
	 * @since 0.0.0.3
	 */
	this.getMagnitudeSquare = function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	/**
	 * Normalizes this vector
	 * @function
	 * @returns {Vector3} The normalized form of this vector
	 * @since 0.0.0.3
	 */
	this.normalize = function() {
		var newVector = this.clone();
		newVector.normalizeMutate();
		return newVector;
	}

	/**
	 * Normalizes this vector
	 * @function
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.normalizeMutate = function() {
		var magnitude = this.getMagnitude();
		if (magnitude > 0) {
			this.multScalarMutate(1 / magnitude);
		} // if
	}

	/**
	 * Zero out this vector
	 * @function
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.zeroMutate = function() {
		this.x = 0;
		this.y = 0;
    this.z = 0;
	}

	/**
	 * Clones this vector
	 * @function
	 * @returns {Vector3} The clone of this vector
	 * @since 0.0.0.3
	 */
	this.clone = function() {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
	 * Converts the class to a string representation
	 * @function
	 * @returns {string} The string representation of this class
	 * @since 0.0.0
	 */
	this.toString = function() {
		return "(" + this.x + ", " + this.y + "," + this.z + ")";
	}
}

/**
 * @class 2x2 matrix
 * @constructor
 * @param {Number} data1 Matrix data entry
 * @param {Number} data2 Matrix data entry
 * @param {Number} data3 Matrix data entry
 * @param {Number} data4 Matrix data entry
 * @since 0.0.0
 */
Matrix2 = function(data1, data2, data3, data4, inverse) {

	/**
	 * Matrix entries
	 * @field
	 * @type Number []
	 * @default [0.0, 0.0, 0.0, 0.0]
	 * @since 0.0.0
	 */
	this.e = [
		data1 || 0.0, data2 || 0.0, data3 || 0.0, data4 || 0.0
	];
	
	/**
	 * Matrix determinant
	 * @field
	 * @type Number
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.det = 0.0;
	
	/**
	 * Matrix inverse
	 * @field
	 * @type Matrix2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.inverse = undefined;
	
	/**
	 * Calculates this determinant {@link Matrix2#det} from matrix entries {@link Matrix2#e}
	 * @function
	 * @private
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.recaclulateDeterminant = function() {
		this.det = this.e[0] * this.e[3] - this.e[1] * this.e[2];
	}
	this.recaclulateDeterminant();
	
	/**
	 * Calculates this inverse {@link Matrix2#inverse} from matrix entries {@link Matrix2#e}
	 * @function
	 * @private
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.recaclulateInverse = function() {
		
		if (this.det == 0) {
			return;
		} // if
		
		var inverseDet = 1 / this.det;
		var i = new Matrix2(
			inverseDet * this.e[3],
			-inverseDet * this.e[1],
			-inverseDet * this.e[2],
			inverseDet * this.e[0]
		);
		i.inverse = this.clone();
		this.inverse = i;
	}
	
	/**
	 * Multiply this matrix by the supplied 2D vector
	 * @function
	 * @param {Vector2} v The vector to multiply
	 * @returns {Vector2} The resulting vector
	 * @since 0.0.0
	 */
	this.multVector = function(v) {
		return new Vector2(
			v.x * this.e[0] + v.y * this.e[1],
			v.x * this.e[2] + v.y * this.e[3]
		);
	}
	
	/**
	 * Multiply this matrix by the supplied 2D vector
	 * @function
	 * @param {Vector2} v The vector to multiply
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.multVectorMutate = function(v) {
		v.x = v.x * this.e[0] + v.y * this.e[1];
		v.y = v.x * this.e[2] + v.y * this.e[3];
	}
	
	/**
	 * Multiply this matrix by the supplied 2x2 matrix
	 * @function
	 * @param {Matrix2} o The matrix to multiply
	 * @returns {Matrix2} The resulting matrix
	 * @since 0.0.0
	 */
	this.mult = function(o) {
		return new Matrix2(
			this.e[0] * o.e[0] + this.e[1] * o.e[2],
			this.e[0] * o.e[1] + this.e[1] * o.e[3],
			this.e[2] * o.e[0] + this.e[3] * o.e[2],
			this.e[2] * o.e[1] + this.e[3] * o.e[3]
		);
	}
	
	/**
	 * Adds this matrix by the supplied 2x2 matrix
	 * @function
	 * @param {Matrix2} o The matrix to add
	 * @returns {Matrix2} The resulting matrix
	 * @since 0.0.0
	 */
	this.add = function(o) {
		return new Matrix2(
			this.e[0] + o.e[0],
			this.e[1] + o.e[1],
			this.e[2] + o.e[2],
			this.e[3] + o.e[3]
		);
	}
	
	/**
	 * Adds this matrix by the supplied 2x2 matrix
	 * @function
	 * @param {Matrix2} o The matrix to add
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.addMutate = function(o) {
		this.e[0] += o.e[0];
		this.e[1] += o.e[1];
		this.e[2] += o.e[2];
		this.e[3] += o.e[3];
	}
	
	/**
	 * Gets the entry at row i and column j
	 * @function
	 * @param {int} i The row number, 0 being row 1
	 * @param {int} j The column number, 0 being column 1
	 * @returns {Number} The entry at row i and column j
	 * @since 0.0.0
	 */
	this.getEntry = function(i, j) {
		return this.e[i * 2 + j];
	}
	
	/**
	 * Gets the determinant of this matrix
	 * @function
	 * @returns {Number} The determinant of this matrix
	 * @since 0.0.0
	 */
	this.getDeterminant = function() {
		return this.det;
	}
	
	/**
	 * Determines if this matrix is singular (non-invertable, has a zero determinant)
	 * @function
	 * @returns {boolean} The singular flag of this matrix
	 * @since 0.0.0
	 * @see Matrix2#isInvertable
	 */
	this.isSingular = function() {
		return this.det == 0;
	}
	
	/**
	 * Determines if this matrix is invertable (non-singular, has a non-zero determinant)
	 * @function
	 * @returns {boolean} The invertable flag of this matrix
	 * @since 0.0.0
	 * @see Matrix2#isSingular
	 */
	this.isInvertable = function() {
		return this.det != 0;
	}
	
	/**
	 * Gets the inverse of this matrix
	 * @function
	 * @returns {Matrix} The inverse of this matrix, undefined if singular
	 * @since 0.0.0
	 * @see Matrix2#isSingular
	 */
	this.getInverse = function() {
		if (!this.inverse && this.isInvertable()) {
			this.recaclulateInverse();
		} // if
		
		return this.inverse;
	}
	
	/**
	 * Determines if this matrix is equal to another matrix
	 * For matrices this is true if every element in this
	 * matrix has a corresponding and equal entry in the other
	 * matrix
	 * @function
	 * @param {Matrix2} o The matrix to compare
	 * @returns {boolean} true if this matrix is equal to the supplied matrix
	 * @since 0.0.0
	 */
	this.equals = function(o) {
		if (this === o) {
			return true;
		} // if
		
		if (this.e.length != o.e.length) {
			return false;
		} // if
		
		for (i in this.e) {
			if (this.e[i] != o.e[i]) {
				return false;
			} // if
		} // for
		
		return true;
	}
	
	/**
	 * Clones this matrix
	 * @function
	 * @return {Matrix2} The cloned version of this matrix
	 * @since 0.0.0
	 */
	this.clone = function() {
		return new Matrix2(this.e[0], this.e[1], this.e[2], this.e[3]);
	}
}

/**
 * @class 2x2 identity
 * @constructor
 * @since 0.0.0
 */
Identity2 = function() {
	
	/*
	 * Super constructor
	 */
	Matrix2.call(this, 1, 0, 0, 1);
}
Identity2.prototype = new Matrix2();

/**
 * 2x2 Identity matrix reusable singleton
 * @static
 * @field
 * @type Identity2
 * @default new Identity2()
 * @since 0.0.0
 */
Identity2.instance = new Identity2();

/**
 * @class 2-Dimensional rotation matrix
 * <p>
 * The 2D rotation matrix looks as follows:
 * | cos(theta), -sin(theta) |
 * | sin(theta), cos(theta)  |
 * </p>
 * @constructor
 * @param {Number} theta The angle of this rotation matrix
 * @since 0.0.0
 */
RotationMatrix2 = function(theta) {

  /*
	 * Super constructor
	 */
  Matrix2.call(this, Math.cos(theta), -Math.sin(theta),
    Math.sin(theta), Math.cos(theta));
}
RotationMatrix2.prototype = new Matrix2();

/**
 * @class 3x3 matrix
 * @constructor
 * @param {Number} data1 Matrix data entry
 * @param {Number} data2 Matrix data entry
 * @param {Number} data3 Matrix data entry
 * @param {Number} data4 Matrix data entry
 * @param {Number} data5 Matrix data entry
 * @param {Number} data6 Matrix data entry
 * @param {Number} data7 Matrix data entry
 * @param {Number} data8 Matrix data entry
 * @param {Number} data9 Matrix data entry
 * @since 0.0.0.3
 */
Matrix3 = function(data1, data2, data3, data4, data5, data6, data7, data8, data9) {

	/**
	 * Matrix entries
	 * @field
	 * @type Number []
	 * @default [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
	 * @since 0.0.0.3
	 */
	this.e = [
		data1 || 0.0, data2 || 0.0, data3 || 0.0,
    data4 || 0.0, data5 || 0.0, data6 || 0.0,
    data7 || 0.0, data8 || 0.0, data9 || 0.0
	];

	/**
	 * Matrix determinant
	 * @field
	 * @type Number
	 * @default 0.0
	 * @since 0.0.0.3
	 */
	this.det = 0.0;

	/**
	 * Matrix inverse
	 * @field
	 * @type Matrix3
	 * @default undefined
	 * @since 0.0.0.3
	 */
	this.inverse = undefined;

	/**
	 * Calculates this determinant {@link Matrix3#det} from matrix entries {@link Matrix3#e}
	 * @function
	 * @private
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.recaclulateDeterminant = function() {
		this.det = this.e[0] * this.e[4] * this.e[8]
      + this.e[1] * this.e[5] * this.e[6]
      + this.e[2] * this.e[3] * this.e[7]
      - this.e[0] * this.e[5] * this.e[7]
      - this.e[1] * this.e[3] * this.e[8]
      - this.e[2] * this.e[4] * this.e[6];
	}
	this.recaclulateDeterminant();

	/**
	 * Calculates this inverse {@link Matrix2#inverse} from matrix entries {@link Matrix2#e}
	 * @function
	 * @private
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.recaclulateInverse = function() {

		if (this.det == 0) {
			return;
		} // if

		var inverseDet = 1 / this.det;
		var i = new Matrix3(
			inverseDet * (this.e[4] * this.e[8] - this.e[7] * this.e[5]),
			inverseDet * (this.e[6] * this.e[5] - this.e[3] * this.e[8]),
			inverseDet * (this.e[3] * this.e[7] - this.e[6] * this.e[4]),
			inverseDet * (this.e[7] * this.e[2] - this.e[1] * this.e[8]),
      inverseDet * (this.e[0] * this.e[8] - this.e[6] * this.e[2]),
      inverseDet * (this.e[6] * this.e[1] - this.e[0] * this.e[7]),
      inverseDet * (this.e[1] * this.e[5] - this.e[4] * this.e[2]),
      inverseDet * (this.e[3] * this.e[2] - this.e[0] * this.e[5]),
      inverseDet * (this.e[0] * this.e[4] - this.e[3] * this.e[1])
		);
		i.inverse = this.clone();
		this.inverse = i;
	}

	/**
	 * Multiply this matrix by the supplied 3D vector
	 * @function
	 * @param {Vector3} v The vector to multiply
	 * @returns {Vector3} The resulting vector
	 * @since 0.0.0.3
	 */
	this.multVector = function(v) {
		return new Vector3(
			v.x * this.e[0] + v.y * this.e[1] + v.z * this.e[2],
			v.x * this.e[3] + v.y * this.e[4] + v.z * this.e[5],
      v.x * this.e[6] + v.y * this.e[7] + v.z * this.e[8]
		);
	}

	/**
	 * Multiply this matrix by the supplied 3D vector
	 * @function
	 * @param {Vector3} v The vector to multiply
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.multVectorMutate = function(v) {
		v.x = v.x * this.e[0] + v.y * this.e[1] + v.z * this.e[2];
		v.y = v.x * this.e[3] + v.y * this.e[4] + v.z * this.e[5];
    v.z = v.x * this.e[6] + v.y * this.e[7] + v.z * this.e[8];
	}

	/**
	 * Multiply this matrix by the supplied 3x3 matrix
	 * @function
	 * @param {Matrix3} o The matrix to multiply
	 * @returns {Matrix3} The resulting matrix
	 * @since 0.0.0.3
	 */
	this.mult = function(o) {
		return new Matrix3(
			this.e[0] * o.e[0] + this.e[1] * o.e[3] + this.e[2] * o.e[6],
			this.e[0] * o.e[1] + this.e[1] * o.e[4] + this.e[2] * o.e[7],
      this.e[0] * o.e[2] + this.e[1] * o.e[5] + this.e[2] * o.e[8],
      this.e[3] * o.e[0] + this.e[4] * o.e[3] + this.e[5] * o.e[6],
			this.e[3] * o.e[1] + this.e[4] * o.e[4] + this.e[5] * o.e[7],
      this.e[3] * o.e[2] + this.e[4] * o.e[5] + this.e[5] * o.e[8],
      this.e[6] * o.e[0] + this.e[7] * o.e[3] + this.e[8] * o.e[6],
			this.e[6] * o.e[1] + this.e[7] * o.e[4] + this.e[8] * o.e[7],
      this.e[6] * o.e[2] + this.e[7] * o.e[5] + this.e[8] * o.e[8]
		);
	}

	/**
	 * Adds this matrix by the supplied 2x2 matrix
	 * @function
	 * @param {Matrix3} o The matrix to add
	 * @returns {Matrix3} The resulting matrix
	 * @since 0.0.0.3
	 */
	this.add = function(o) {
		return new Matrix2(
			this.e[0] + o.e[0],
			this.e[1] + o.e[1],
			this.e[2] + o.e[2],
			this.e[3] + o.e[3],
      this.e[4] + o.e[4],
      this.e[5] + o.e[5],
      this.e[6] + o.e[6],
      this.e[7] + o.e[7],
      this.e[8] + o.e[8]
		);
	}

	/**
	 * Adds this matrix by the supplied 2x2 matrix
	 * @function
	 * @param {Matrix3} o The matrix to add
	 * @returns {void}
	 * @since 0.0.0.3
	 */
	this.addMutate = function(o) {
		this.e[0] += o.e[0];
		this.e[1] += o.e[1];
		this.e[2] += o.e[2];
		this.e[3] += o.e[3];
    this.e[4] += o.e[4];
    this.e[5] += o.e[5];
    this.e[6] += o.e[6];
    this.e[7] += o.e[7];
    this.e[8] += o.e[8];
	}

	/**
	 * Gets the entry at row i and column j
	 * @function
	 * @param {int} i The row number, 0 being row 1
	 * @param {int} j The column number, 0 being column 1
	 * @returns {Number} The entry at row i and column j
	 * @since 0.0.0.3
	 */
	this.getEntry = function(i, j) {
		return this.e[i * 2 + j];
	}

	/**
	 * Gets the determinant of this matrix
	 * @function
	 * @returns {Number} The determinant of this matrix
	 * @since 0.0.0.3
	 */
	this.getDeterminant = function() {
		return this.det;
	}

	/**
	 * Determines if this matrix is singular (non-invertable, has a zero determinant)
	 * @function
	 * @returns {boolean} The singular flag of this matrix
	 * @since 0.0.0
	 * @see Matrix3#isInvertable
	 */
	this.isSingular = function() {
		return this.det == 0;
	}

	/**
	 * Determines if this matrix is invertable (non-singular, has a non-zero determinant)
	 * @function
	 * @returns {boolean} The invertable flag of this matrix
	 * @since 0.0.0.3
	 * @see Matrix3#isSingular
	 */
	this.isInvertable = function() {
		return this.det != 0;
	}

	/**
	 * Gets the inverse of this matrix
	 * @function
	 * @returns {Matrix} The inverse of this matrix, undefined if singular
	 * @since 0.0.0.3
	 * @see Matrix3#isSingular
	 */
	this.getInverse = function() {
		if (!this.inverse && this.isInvertable()) {
			this.recaclulateInverse();
		} // if

		return this.inverse;
	}

	/**
	 * Determines if this matrix is equal to another matrix
	 * For matrices this is true if every element in this
	 * matrix has a corresponding and equal entry in the other
	 * matrix
	 * @function
	 * @param {Matrix3} o The matrix to compare
	 * @returns {boolean} true if this matrix is equal to the supplied matrix
	 * @since 0.0.0.3
	 */
	this.equals = function(o) {
		if (this === o) {
			return true;
		} // if

		if (this.e.length != o.e.length) {
			return false;
		} // if

		for (i in this.e) {
			if (this.e[i] != o.e[i]) {
				return false;
			} // if
		} // for

		return true;
	}

	/**
	 * Clones this matrix
	 * @function
	 * @return {Matrix3} The cloned version of this matrix
	 * @since 0.0.0.3
	 */
	this.clone = function() {
		return new Matrix3(this.e[0], this.e[1], this.e[2],
      this.e[3], this.e[4], this.e[5],
      this.e[6], this.e[7], this.e[8]);
	}
}

/**
 * @class 2-Dimensional transformation matrix
 * <p>
 * The 2D rotation matrix looks as follows:
 * | cos(theta), -sin(theta), x|
 * | sin(theta), cos(theta), y |
 * | 0         , 0         , 1 |
 * </p>
 * @constructor
 * @param {Number} theta The angle of this rotation matrix
 * @param {Number} x The translation in the X-direction
 * @param {Number} y The translation in the Y-direction
 * @since 0.0.0.3
 */
TransformationMatrix3 = function(theta, x, y) {

  /*
	 * Super constructor
	 */
  Matrix3.call(this, Math.cos(theta), -Math.sin(theta), x,
    Math.sin(theta), Math.cos(theta), y,
    0, 0, 1);
}
TransformationMatrix3.prototype = new Matrix3();