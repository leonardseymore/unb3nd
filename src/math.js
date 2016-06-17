/**
 * @fileOverview High performance mathematics module
 *   This module is less "pretty" and focussed strictly on performance
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * @class Rectangle helper object
 * @constructor
 * @param {Array} pos Position of the rectangle
 * @param {Number} width Width of the rectangle
 * @param {Number} height Height of the rectangle

 */
function Rectangle(pos, width, height) {

  /**
   * Position of this rectangle
   * @field
   * @type Number
   * @default Zero vector

   */
  this.pos = pos || math.v2.create();

  /**
   * Width of this rectangle
   * @field
   * @type Number
   * @default 0

   */
  this.width = width || 0;

  /**
   * Height of this rectangle
   * @field
   * @type Number
   * @default 0

   */
  this.height = height || 0;

  /**
   * Tests if a point is inside this rect
   * @function
   * @param {Array} point The point to test
   * @returns {boolean} true if this point is inside the rect

   */
  this.isPointInside = function (point) {
    if (point[0] >= this.pos[0] &&
      point[0] <= this.pos[0] + this.width &&
      point[1] >= this.pos[1] &&
      point[1] <= this.pos[1] + this.height
      ) {
      return true;
    } // if

    return false;
  };

  /**
   * Tests if a point is strictly inside this rect
   * @function
   * @param {Array} point The point to test
   * @returns {boolean} true if this point is inside the rect

   */
  this.isPointInsideStrict = function (point) {
    if (point[0] > this.pos[0] &&
      point[0] < this.pos[0] + this.width &&
      point[1] > this.pos[1] &&
      point[1] < this.pos[1] + this.height
      ) {
      return true;
    } // if

    return false;
  };

  /**
   * Shrinks the rectangle by the given amount
   * @function
   * @param {Number} amount The amount by which to shrink this rectangle
   * @return {Rectangle} The shrunked version of this rectangle

   */
  this.shrink = function (amount) {
    var clone = this.clone();
    clone.shrinkMutate(amount);
    return clone;
  };

  /**
   * Shrinks the rectangle by the given amount
   * @function
   * @param {Number} amount The amount by which to shrink this rectangle
   * @return {void}

   */
  this.shrinkMutate = function (amount) {
    this.pos[0] += amount;
    this.pos[1] += amount;
    this.width -= amount * 2;
    this.height -= amount * 2;
  };

  /**
   * Clones this rectangle
   * @function
   * @return {Rectangle} The cloned version of this rectangle

   */
  this.clone = function () {
    return new Rectangle(math.v2.create(this.pos), this.width, this.height);
  };

  /**
   * Converts the class to a string representation
   * @function
   * @returns {string} The string representation of this class

   */
  this.toString = function () {
    return "(pos=" + this.pos.toString() + ", w=" + this.width + ", h=" + this.height + ")";
  };
}

/**
 * unb3nd maths namespace

 */
var math = {

  /**
   * Determines if the number is within the given tolerance to the target number
   * @param {Number} n The number to test
   * @param {Number} nTarget The target number
   * @param {Number} tol The tolerance
   * @returns {Boolean} True if the number is within the given tolerance

   */
  within : function (n, nTarget, tol) {
    return n >= nTarget - tol && n <= nTarget + tol;
  },

  /**
   * Determines if the number is strictly within the given tolerance to the target number
   * @param {Number} n The number to test
   * @param {Number} nTarget The target number
   * @param {Number} tol The tolerance
   * @returns {Boolean} True if the number is strictly within the given tolerance

   */
  withinStrict : function (n, nTarget, tol) {
    return n > nTarget - tol && n < nTarget + tol;
  }
};

/**
 * unb3nd 2D vector namespace

 */
math.v2 = {

  /**
   * Creates a new 2D vector
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New vector

   */
  create : function(src) {
    if (src) {
      return [src[0], src[1]];
    } else {
      return [0, 0];
    } // if
  },

  /**
   * Adds two vectors together
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Array} New vector

   */
  add : function(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
  },

  /**
   * Adds two vectors together and mutates the first operand
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {void}

   */
  addMutate : function(v1, v2) {
    v1[0] += v2[0];
    v1[1] += v2[1];
  },

  /**
   * Subtracts two vectors
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Array} New vector

   */
  sub : function(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
  },

  /**
   * Subtracts two vectors and mutates the first operand
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {void}

   */
  subMutate : function(v1, v2) {
    v1[0] -= v2[0];
    v1[1] -= v2[1];
  },

  /**
   * Inverts the vector
   * @function
   * @param {Array} v The vector to invert
   * @returns {Array} The inverted version of the supplied vector

   */
  inverse : function(v) {
    return [-v[0], -v[1]];
  },

  /**
   * Inverts and mutates the vector
   * @function
   * @param {Array} v The vector to invert
   * @returns {void}

   */
  inverseMutate : function(v) {
    v[0] = -v[0];
    v[1] = -v[1];
  },

  /**
   * Multiply vector by a scalar value
   * @function
   * @param {Array} v The vector to multiply
   * @param {Number} s Scalar to multiply by
   * @returns {Array} New vector

   */
  multScalar : function(v, s) {
    return [v[0] * s, v[1] * s];
  },

  /**
   * Multiply vector by a scalar value and mutates the vector
   * @function
   * @param {Array} v The vector to multiply
   * @param {Number} s Scalar to multiply by
   * @returns {void}

   */
  multScalarMutate : function(v, s) {
    v[0] *= s;
    v[1] *= s;
  },

  /**
   * Calculate the dot product between two vectors
   * @function
   * @param {Array} v The first operand
   * @param {Array} v2 The second operand
   * @returns {Number} The dot product

   */
  dotProduct : function(v, v2) {
    return v[0] * v2[0] + v[1] * v2[1];
  },

  /**
   * Calculate the vector product between two vectors
   * @function
   * @param {Array} v The first operand
   * @param {Array} v2 The second operand
   * @returns {Number} The vector product

   */
  vectorProduct : function(v, v2) {
    return v[0] * v2[1] - v[1] * v2[0];
  },

  /**
   * Calculate the magnitude of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude

   */
  getMagnitude : function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  },

  /**
   * Calculate the magnitude square of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude square

   */
  getMagnitudeSquare : function(v) {
    return v[0] * v[0] + v[1] * v[1];
  },

  /**
   * Normalizes the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {Array} The normalized version of the supplied vector

   */
  normalize : function(v) {
    var dest = math.v2.create(v);
    math.v2.normalizeMutate(dest);
    return dest;
  },

  /**
   * Normalizes and mutates the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {void}

   */
  normalizeMutate : function(v) {
    var magnitude = math.v2.getMagnitude(v);
    if (magnitude > 0) {
      math.v2.multScalarMutate(v, 1 / magnitude);
    } // if
  },

  /**
   * Zeroes out the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {void}

   */
  zeroMutate : function(v) {
    v[0] = 0;
    v[1] = 0;
  },

  /**
   * Calculates the angle between two vectors in radians
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @returns {Number} The angle between the two vectors

   */
  getAngle : function(v1, v2) {
    return Math.acos(
      math.v2.dotProduct(
        math.v2.normalize(v1),
        math.v2.normalize(v2)
      )
    );
  },

  /**
   * Calculates the distance between two vectors
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @returns {Number} The distance between the two vectors

   */
  getDistance : function(v1, v2) {
    return math.v2.getMagnitude(math.v2.sub(v1, v2));
  },

  /**
   * Calculates the squared distance between two vectors
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @returns {Number} The distance between the two vectors

   */
  getDistanceSquare : function(v1, v2) {
    return math.v2.getMagnitudeSquare(math.v2.sub(v1, v2));
  },

  /**
   * Determines if the two vectors are within a specified distance from each other.
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @param {Number} distance The distance to test for
   * @returns {boolean} True if the vectors are within specified distance

   */
  isWithin : function(v1, v2, distance) {
    return math.v2.getDistanceSquare(v1, v2) <= distance * distance;
  },

  /**
   * Determines if the two vectors are strictly a specified distance from each other.
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @param {Number} distance The distance to test for
   * @returns {boolean} True if the vectors are strictly within specified distance

   */
  isWithinStrict : function(v1, v2, distance) {
    return math.v2.getDistanceSquare(v1, v2) < distance * distance;
  },

  /**
   * Determines if the two vertices are equal
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Boolean} True if every entry in v1 is equal to the corresponding entry in v2

   */
  equals : function(v1, v2) {
    return v1[0] == v2[0]
        && v1[1] == v2[1];
  }
};

/**
 * unb3nd 3D vector namespace

 */
math.v3 = {

  /**
   * Creates a new 3D vector
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New vector

   */
  create : function(src) {
    if (src) {
      return [src[0], src[1], src[2]];
    } else {
      return [0, 0, 0];
    } // if
  },

  /**
   * Adds vectors together
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Array} New vector

   */
  add : function(v1, v2) {
    return [v1[0] + v2[0],
      v1[1] + v2[1],
      v1[2] + v2[2]];
  },

  /**
   * Adds vectors together and mutates the first operand
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {void}

   */
  addMutate : function(v1, v2) {
    v1[0] = v1[0] + v2[0];
    v1[1] = v1[1] + v2[1];
    v1[2] = v1[2] + v2[2];
  },

  /**
   * Subtracts vectors
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Array} New vector

   */
  sub : function(v1, v2) {
    return [v1[0] - v2[0],
      v1[1] - v2[1],
      v1[2] - v2[2]];
  },

  /**
   * Subtracts vectors and mutates the first operand
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {void}

   */
  subMutate : function(v1, v2) {
    v1[0] = v1[0] - v2[0];
    v1[1] = v1[1] - v2[1];
    v1[2] = v1[2] - v2[2];
  },

  /**
   * Inverts the vector
   * @function
   * @param {Array} v The vector to invert
   * @returns {Array} The inverted version of the supplied vector

   */
  inverse : function(v) {
    return [-v[0], -v[1], -v[2]];
  },

  /**
   * Inverts and mutates the vector
   * @function
   * @param {Array} v The vector to invert
   * @returns {void}

   */
  inverseMutate : function(v) {
    v[0] = -v[0];
    v[1] = -v[1];
    v[2] = -v[2];
  },

  /**
   * Multiply vector by a scalar value
   * @function
   * @param {Array} v The vector to multiply
   * @param {Number} s Scalar to multiply by
   * @returns {Array} New vector

   */
  multScalar : function(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
  },

  /**
   * Multiply vector by a scalar value and mutates the vector
   * @function
   * @param {Array} v The vector to multiply
   * @param {Number} s Scalar to multiply by
   * @returns {void}

   */
  multScalarMutate : function(v, s) {
    v[0] *= s;
    v[1] *= s;
    v[2] *= s;
  },

  /**
   * Calculate the dot product between two vectors
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Number} The dot product

   */
  dotProduct : function(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  },

  /**
   * TODO: Calculate the vector product between two vectors
   * @function
   * @param {Array} v1 The first operand
   * @param {Array} v2 The second operand
   * @returns {Number} The vector product

   */
  vectorProduct : function(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
  },

  /**
   * Calculate the magnitude of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude

   */
  getMagnitude : function(v) {
    return Math.sqrt(math.v2.getMagnitudeSquare(v));
  },

  /**
   * Calculate the magnitude square of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude square

   */
  getMagnitudeSquare : function(v) {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  },

  /**
   * Normalizes the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {Array} The normalized version of the supplied vector

   */
  normalize : function(v) {
    var dest = math.v3.create(v);
    math.v3.normalizeMutate(dest);
    return dest;
  },

  /**
   * Normalizes and mutates the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {void}

   */
  normalizeMutate : function(v) {
    var magnitude = math.v3.getMagnitude(v);
    if (magnitude > 0) {
      math.v3.multScalarMutate(v, 1 / magnitude);
    } // if
  },

  /**
   * Zeroes out the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {void}

   */
  zeroMutate : function(v) {
    v[0] = 0;
    v[1] = 0;
    v[2] = 0;
  },

  /**
   * Calculates the angle between two vectors in radians
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @returns {Number} The angle between the two vectors

   */
  getAngle : function(v1, v2) {
    return Math.acos(
      math.v3.dotProduct(
        math.v3.normalize(v1),
        math.v3.normalize(v2)
      )
    );
  },

  /**
   * Calculates the distance between two vectors
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @returns {Number} The distance between the two vectors

   */
  getDistance : function(v1, v2) {
    return math.v3.getMagnitude(math.v3.sub(v1, v2));
  },

  /**
   * Calculates the squared distance between two vectors
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @returns {Number} The distance between the two vectors

   */
  getDistanceSquare : function(v1, v2) {
    return math.v3.getMagnitudeSquare(math.v3.sub(v1, v2));
  },

  /**
   * Determines if the two vectors are within a specified distance from each other.
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @param {Number} distance The distance to test for
   * @returns {boolean} True if the vectors are within specified distance

   */
  isWithin : function(v1, v2, distance) {
    return math.v3.getDistanceSquare(v1, v2) <= distance * distance;
  },

  /**
   * Determines if the two vectors are strictly a specified distance from each other.
   * @function
   * @static
   * @param {Array} v1 The first vector
   * @param {Array} v2 The second vector
   * @param {Number} distance The distance to test for
   * @returns {boolean} True if the vectors are strictly within specified distance

   */
  isWithinStrict : function(v1, v2, distance) {
    return math.v3.getDistanceSquare(v1, v2) < distance * distance;
  }
};

/**
 * unb3nd 2x2 matrix namespace

 */
math.m2 = {

  /**
   * Creates a new 2x2 matrix
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New matrix

   */
  create : function(src) {
    if (src) {
      return [src[0], src[1], src[2], src[3]];
    } else {
      return [0, 0, 0, 0];
    } // if
  },

  /**
   * Creates a new 2x2 identity matrix
   * @function
   * @returns {Array} New identity matrix

   */
  createIdentity : function() {
    return [1, 0, 0, 1];
  },

  /**
   * Creates a new 2x2 rotation matrix
   * <p>
   * The 2D rotation matrix looks as follows:
   * | cos(theta), -sin(theta) |
   * | sin(theta), cos(theta)  |
   * </p>
   * @function
   * @param {Number} theta The angle of this rotation matrix
   * @returns {Array} New rotation matrix

   */
  createRotation : function(theta) {
    return [Math.cos(theta), -Math.sin(theta),
      Math.sin(theta), Math.cos(theta)];
  },

  /**
   * Calculates the determinant
   * @function
   * @param {Array} m The matrix to get the determinant for
   * @returns {Number} The determinant of the supplied matrix

   */
  getDeterminant : function(m) {
    return m[0] * m[3] - m[1] * m[2];
  },

  /**
   * Determines if the supplied matrix is invertable
   * @function
   * @param {Array} m The matrix to use
   * @returns {Boolean} True if the matrix is invertable

   */
  isInvertable : function(m) {
    var determinant = math.m2.getDeterminant(m);
    return determinant != 0;
  },

  /**
   * Determines if the supplied matrix is singular
   * @function
   * @param {Array} m The matrix to use
   * @returns {Boolean} True if the matrix is singular

   */
  isSingular : function(m) {
    var determinant = math.m2.getDeterminant(m);
    return determinant == 0;
  },

  /**
   * Calculates the inverse of the supplied matrix
   * @function
   * @param {Array} m The matrix to get the determinant for
   * @returns {Array} The inverse of the matrix, or undefined if inverse does not exist

   */
  getInverse : function(m) {
    var determinant = math.m2.getDeterminant(m);
    if (determinant == 0) {
      return undefined;
    } // if

    var inverseDet = 1 / determinant;
    return [inverseDet * m[3],
      -inverseDet * m[1],
      -inverseDet * m[2],
      inverseDet * m[0]];
  },

  /**
   * Multiply the matrix by the supplied vector
   * @function
   * @param {Array} m The matrix to use
   * @param {Array} v The vector to multiply
   * @returns {Array} The resulting vector

   */
  multVector : function(m, v) {
    return [v[0] * m[0] + v[1] * m[1],
      v[0] * m[2] + v[1] * m[3]];
  },

  /**
   * Multiply the matrix by the supplied vector and mutate the vector
   * @function
   * @param {Array} m The matrix to use
   * @param {Array} v The vector to multiply
   * @returns {void}

   */
  multVectorMutate : function(m, v) {
    v[0] = v[0] * m[0] + v[1] * m[1];
    v[1] = v[0] * m[2] + v[1] * m[3];
  },

  /**
   * Multiply two matrices together
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {Array} The resulting matrix

   */
  mult : function(m1, m2) {
    return [
      m1[0] * m2[0] + m1[1] * m2[2],
      m1[0] * m2[1] + m1[1] * m2[3],
      m1[2] * m2[0] + m1[3] * m2[2],
      m1[2] * m2[1] + m1[3] * m2[3]
    ];
  },

  /**
   * Adds two matrices together
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {Array} The resulting matrix

   */
  add : function(m1, m2) {
    return [
      m1[0] + m2[0],
      m1[1] + m2[1],
      m1[2] + m2[2],
      m1[3] + m2[3]
    ];
  },

  /**
   * Adds two matrices together and mutates the first
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {void}

   */
  addMutate : function(m1, m2) {
    m1[0] = m1[0] + m2[0];
    m1[1] = m1[1] + m2[1];
    m1[2] = m1[2] + m2[2];
    m1[3] = m1[3] + m2[3];
  },

  /**
   * Gets the entry at row i and column j
   * @function
   * @param {Array} m The matrix to get the entry from
   * @param {int} i The row number, 0 being row 1
   * @param {int} j The column number, 0 being column 1
   * @returns {Number} The entry at row i and column j

   */
  getEntry : function(m, i, j) {
    return m[i * 2 + j];
  },

  /**
   * Determines if the two matrices are equal
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {Boolean} True if every entry in m1 is equal to the corresponding entry in m2

   */
  equals : function(m1, m2) {
    return m1[0] == m2[0]
      && m1[1] == m2[1]
      && m1[2] == m2[2]
      && m1[3] == m2[3];
  }
};

/**
 * unb3nd 3x3 matrix namespace

 */
math.m3 = {

  /**
   * Creates a new 3x3 matrix
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New matrix

   */
  create : function(src) {
    if (src) {
      return [src[0], src[1], src[2],
        src[3], src[4], src[5],
        src[6], src[7], src[8]];
    } else {
      return [0, 0, 0,
        0, 0, 0,
        0, 0, 0];
    } // if
  },

  /**
   * Creates a new 3x3 identity matrix
   * @function
   * @returns {Array} New identity matrix

   */
  createIdentity : function() {
    return [1, 0, 0,
      0, 1, 0,
      0, 0, 1];
  },

  /**
   * Creates a new 3x3 rotation matrix about the z axis
   * <p>
   * The 3D rotation matrix looks as follows:
   * | cos(theta), -sin(theta) 0|
   * | sin(theta), cos(theta)  0|
   * |0          , 0           1|
   * </p>
   * @function
   * @param {Number} theta The angle of this rotation matrix
   * @returns {Array} New rotation matrix

   * @see http://www.euclideanspace.com/maths/algebra/matrix/orthogonal/rotation/index.htm
   */
  createRotationZ : function(theta) {
    return [Math.cos(theta), -Math.sin(theta), 0,
      Math.sin(theta), Math.cos(theta), 0,
      0, 0, 1];
  },

  /**
   * Creates a new 3x3 transformation matrix
   * <p>
   * The 2D transformation matrix looks as follows:
   * | cos(theta), -sin(theta) x|
   * | sin(theta), cos(theta)  y|
   * |0          , 0           1|
   * </p>
   * @function
   * @param {Number} theta The angle of this rotation matrix
   * @param {Number} x The x position
   * @param {Number} y The y position
   * @returns {Array} New transformation matrix

   */
  createTransform2 : function(theta, x, y) {
    return [Math.cos(theta), -Math.sin(theta), x,
      Math.sin(theta), Math.cos(theta), y,
      0, 0, 1];
  },

  /**
   * Calculates the determinant
   * @function
   * @param {Array} m The matrix to get the determinant for
   * @returns {Number} The determinant of the supplied matrix

   */
  getDeterminant : function(m) {
    return m[0] * m[4] * m[8] -
      m[0] * m[5] * m[7] -
      m[1] * m[3] * m[8] +
      m[2] * m[3] * m[7] +
      m[1] * m[6] * m[5] -
      m[2] * m[6] * m[4];
  },

  /**
   * Determines if the supplied matrix is invertable
   * @function
   * @param {Array} m The matrix to use
   * @returns {Boolean} True if the matrix is invertable

   */
  isInvertable : function(m) {
    var determinant = math.m3.getDeterminant(m);
    return determinant != 0;
  },

  /**
   * Determines if the supplied matrix is singular
   * @function
   * @param {Array} m The matrix to use
   * @returns {Boolean} True if the matrix is singular

   */
  isSingular : function(m) {
    var determinant = math.m3.getDeterminant(m);
    return determinant == 0;
  },

  /**
   * Calculates the inverse of the supplied matrix
   * @function
   * @param {Array} m The matrix to get the determinant for
   * @returns {Array} The inverse of the matrix, or undefined if inverse does not exist

   */
  getInverse : function(m) {
    var det = math.m3.getDeterminant(m);
    if (det == 0) {
      return undefined;
    } // if

    var detI = 1 / det;
    return [
      (m[4] * m[8] * -m[5] * m[7]) * detI, // 0
      (m[1] * m[8] * -m[2] * m[7]) * detI, // 1
      (m[1] * m[5] * -m[2] * m[4]) * detI, // 2
      (m[3] * m[8] * -m[5] * m[6]) * detI,  // 3
      (m[0] * m[8] * -m[2] * m[6]) * detI,  // 4
      (m[0] * m[5] * m[2] * m[3]) * detI,  // 5
      (m[3] * m[7] * -m[4] * m[6]) * detI,  // 6
      (m[0] * m[7] * -m[1] * m[6]) * detI,  // 7
      (m[0] * m[4] * -m[1] * m[3]) * detI  // 8
    ];
  },

  /**
   * Multiply the matrix by the supplied vector 3x1
   * @function
   * @param {Array} m The matrix to use
   * @param {Array} v The 3x1 vector to multiply
   * @returns {Array} The resulting 3x1 vector

   */
  multVector : function(m, v) {
    return [
      v[0] * m[0] + v[1] * m[1] + v[2] * m[2],
      v[0] * m[3] + v[1] * m[4] + v[2] * m[5],
      v[0] * m[6] + v[1] * m[7] + v[2] * m[8]
    ];
  },

  /**
   * Multiply the matrix by the supplied vector 2x1
   * This is useful for 2D transformations
   * |a b c||x| |ax + by + c|
   * |d e f||y|=|dx + ey + f|
   * |0 0 1||1| |1|
   * @function
   * @param {Array} m The matrix to use
   * @param {Array} v The 2x1 vector to multiply
   * @returns {Array} The resulting 2x1 vector

   */
  multVector2 : function(m, v) {
    return [
      v[0] * m[0] + v[1] * m[1] + m[2],
      v[0] * m[3] + v[1] * m[4] + m[5]
    ];
  },

  /**
   * Multiply the matrix by the supplied 3x1 vector and mutate the vector
   * @function
   * @param {Array} m The matrix to use
   * @param {Array} v The 3x1 vector to multiply
   * @returns {void}

   */
  multVectorMutate : function(m, v) {
    v[0] = v[0] * m[0] + v[1] * m[1] + v[2] * m[2];
    v[1] = v[0] * m[3] + v[1] * m[4] + v[2] * m[5];
    v[2] = v[0] * m[6] + v[1] * m[7] + v[2] * m[8];
  },

  /**
   * Multiply the matrix by the supplied 2x1 vector and mutate the vector
   * @function
   * @param {Array} m The matrix to use
   * @param {Array} v The 2x1 vector to multiply
   * @returns {void}

   */
  multVector2Mutate : function(m, v) {
    v[0] = v[0] * m[0] + v[1] * m[1] + m[2];
    v[1] = v[0] * m[3] + v[1] * m[4] + m[5];
  },

  /**
   * Multiply two matrices together
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {Array} The resulting matrix

   */
  mult : function(m1, m2) {
    return [
      m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
      m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
      m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],
      m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
      m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
      m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],
      m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
      m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
      m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8]
    ];
  },

  /**
   * Adds two matrices together
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {Array} The resulting matrix

   */
  add : function(m1, m2) {
    return [
      m1[0] + m2[0],
      m1[1] + m2[1],
      m1[2] + m2[2],
      m1[3] + m2[3],
      m1[4] + m2[4],
      m1[5] + m2[5],
      m1[6] + m2[6],
      m1[7] + m2[7],
      m1[8] + m2[8]
    ];
  },

  /**
   * Adds two matrices together and mutates the first
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {void}

   */
  addMutate : function(m1, m2) {
    m1[0] += m2[0];
    m1[1] += m2[1];
    m1[2] += m2[2];
    m1[3] += m2[3];
    m1[4] += m2[4];
    m1[5] += m2[5];
    m1[6] += m2[6];
    m1[7] += m2[7];
    m1[8] += m2[8];
  },

  /**
   * Gets the entry at row i and column j
   * @function
   * @param {Array} m The matrix to get the entry from
   * @param {int} i The row number, 0 being row 1
   * @param {int} j The column number, 0 being column 1
   * @returns {Number} The entry at row i and column j

   */
  getEntry : function(m, i, j) {
    return m[i * 3 + j];
  },

  /**
   * Determines if the two matrices are equal
   * @function
   * @param {Array} m1 The first operand
   * @param {Array} m2 The second operand
   * @returns {Boolean} True if every entry in m1 is equal to the corresponding entry in m2

   */
  equals : function(m1, m2) {
    return m1[0] == m2[0]
      && m1[1] == m2[1]
      && m1[2] == m2[2]
      && m1[3] == m2[3]
      && m1[4] == m2[4]
      && m1[5] == m2[5]
      && m1[6] == m2[6]
      && m1[7] == m2[7]
      && m1[8] == m2[8];
  }
};