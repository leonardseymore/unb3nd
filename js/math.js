/**
 * @fileOverview Mathematics module
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * @class Rectangle helper object
 * @constructor
 * @param {float} x X-Coordinate of the rectangle
 * @param {float} y Y-Coordinate of the rectangle
 * @param {float} width Width of the rectangle 
 * @param {float} height Height of the rectangle
 * @since 0.0.0
 */
function Rectangle(x, y, width, height) {

	/**
	 * X position of this rectangle
	 * @field 
	 * @type float
	 * @default 0
	 * @since 0.0.0
	 */
	this.x = x || 0;
	
	/**
	 * Y position of this rectangle
	 * @field 
	 * @type float
	 * @default 0
	 * @since 0.0.0
	 */
	this.y = y || 0;
	
	/**
	 * Width of this rectangle
	 * @field 
	 * @type float
	 * @default 0
	 * @since 0.0.0
	 */
	this.width = width || 0;
	
	/**
	 * Height of this rectangle
	 * @field 
	 * @type float
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
	 * @param {float} amount The amount by which to shrink this rectangle
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
	 * @param {float} amount The amount by which to shrink this rectangle
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
}

/**
 * @class 2-Dimensional vector
 *
 * Since we want to use clones in some arithmetic and simply modify a vector
 * in other situations. Some of the operations come in two flavors. e.g. @link{#add} and
 * @link{#addMutate}.  In this example add creates a new vector and leaves the current 
 * unchanged, whereas @link{#addMutate} modifies this vector and returns nothing.
 * @constructor
 * @param {float} x X-coordinate
 * @param {float} y Y-coordinate
 * @since 0.0.0
 */
function Vector2(x, y) {

	/**
	 * X coordinate of this rectangle
	 * @field 
	 * @type float
	 * @default 0
	 * @since 0.0.0
	 */
	this.x = x || 0;
	
	/**
	 * Y coordinate of this rectangle
	 * @field 
	 * @type float
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
	 * TODO: invert is maybe a better name for this method
	 * @function
	 * @returns {Vector2} The flipped vector
	 * @since 0.0.0
	 */
	this.reverse = function() {
		return new Vector2(-this.x, -this.y);
	}
	
	/**
	 * Multiply by a scalar value
	 * @function
	 * @param {float} s Scalar to multiply by
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
	 * @param {float} s Scalar to multiply by
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
	 * @returns {float} The dot product
	 * @since 0.0.0
	 */
	this.dotProduct = function(other) {
		return this.x * other.x + this.y * other.y;
	}
	
	/**
	 * Calculate the magnitude of this vector
	 * @function
	 * @returns {float} The magnitude
	 * @since 0.0.0
	 */
	this.getMagnitude = function() {
		return Math.sqrt(this.getMagnitudeSquare());
	}
	
	/**
	 * Calculate the squared magnitude of this vector
	 * @function
	 * @returns {float} The square magnitude
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
 * @returns {float} The angle between the two vectors
 * @since 0.0.0
 */
Vector2.getAngle = function(v1, v2) {
	return Math.acos(v1.normalize().dotProduct(v2.normalize()));
}

/**
 * @class 2x2 matrix
 * @constructor
 * @param {float} data1 Matrix data entry
 * @param {float} data2 Matrix data entry
 * @param {float} data3 Matrix data entry
 * @param {float} data4 Matrix data entry
 * @since 0.0.0
 */
function Matrix2(data1, data2, data3, data4, inverse) {

	/**
	 * Matrix entries
	 * @field
	 * @type float []
	 * @default [0.0, 0.0, 0.0, 0.0]
	 * @since 0.0.0
	 */
	this.e = [
		data1 || 0.0, data2 || 0.0, data3 || 0.0, data4 || 0.0
	];
	
	/**
	 * Matrix determinant
	 * @field
	 * @type float
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
	 * @returns {float} The entry at row i and column j
	 * @since 0.0.0
	 */
	this.getEntry = function(i, j) {
		return this.e[i * 2 + j];
	}
	
	/**
	 * Gets the determinant of this matrix
	 * @function
	 * @returns {float} The determinant of this matrix
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
function Identity2() {
	
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
 * @since 0.0.0
 */
function RotationMatrix2() {

	/**
	 * Creates the rotation matrix for the supplied angle
	 * @function
	 * @private
	 * @param {float} theta The angle to get the matrix for
	 * @returns {Matrix} The rotation matrix for the supplied angle
	 * @since 0.0.0
	 */
	this.getRotationMatrix = function(theta) {
		return new Matrix2(
			Math.cos(theta),
			-Math.sin(theta),
			Math.sin(theta),
			Math.cos(theta)
		);
	}
	
	/**
	 * Apply matrix to the supplied vector
	 * @function
	 * @param {Vector2} vector The vector to rotate
	 * @param {float} theta The amount to rotate the vector by
	 * @returns {Vector2} The rotated vector
	 * @since 0.0.0
	 */
	this.rotate = function(vector, theta) {
		return this.getRotationMatrix(theta).multVector(vector);
	}
	
	/**
	 * Apply matrix to the supplied vector
	 * @function
	 * @param {Vector2} vector The vector to rotate
	 * @param {float} theta The amount to rotate the vector by
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.rotateMutate = function(vector, theta) {
		this.getRotationMatrix(theta).multVectorMutate(vector);
	}
}

/**
 * Rotation matrix singleton instance
 * @static
 * @field
 * @type RotationMatrix2
 * @default new RotationMatrix2()
 * @since 0.0.0
 */
RotationMatrix2.instance = new RotationMatrix2();
