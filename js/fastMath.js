/**
 * @fileOverview High performance mathematics module
 *   This module is less "pretty" and focussed strictly on performance
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.4
 */

"use strict";

/**
 * unb3nd maths namespace
 * @since 0.0.0.4
 */
var math = {};

/**
 * unb3nd 2D vector namespace
 * @since 0.0.0.4
 */
math.v2 = {

  /**
   * Creates a new 2D vector
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New vector
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  inverse : function(v) {
    return [-v[0], -v[1]];
  },

  /**
   * Inverts and mutates the vector
   * @function
   * @param {Array} v The vector to invert
   * @returns {void}
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  vectorProduct : function(v, v2) {
    return v[0] * v2[1] - v[1] * v2[0];
  },

  /**
   * Calculate the magnitude of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude
   * @since 0.0.0.4
   */
  getMagnitude : function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  },

  /**
   * Calculate the magnitude square of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude square
   * @since 0.0.0.4
   */
  getMagnitudeSquare : function(v) {
    return v[0] * v[0] + v[1] * v[1];
  },

  /**
   * Normalizes the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {Array} The normalized version of the supplied vector
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  isWithinStrict : function(v1, v2, distance) {
    return math.v2.getDistanceSquare(v1, v2) < distance * distance;
  }
};

/**
 * unb3nd 3D vector namespace
 * @since 0.0.0.4
 */
math.v3 = {

  /**
   * Creates a new 3D vector
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New vector
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  inverse : function(v) {
    return [-v[0], -v[1], -v[2]];
  },

  /**
   * Inverts and mutates the vector
   * @function
   * @param {Array} v The vector to invert
   * @returns {void}
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  vectorProduct : function(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
  },

  /**
   * Calculate the magnitude of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude
   * @since 0.0.0.4
   */
  getMagnitude : function(v) {
    return Math.sqrt(math.v2.getMagnitudeSquare(v));
  },

  /**
   * Calculate the magnitude square of the supplied vector
   * @function
   * @param {Array} v The vector to calculate the magnitude for
   * @returns {Number} The magnitude square
   * @since 0.0.0.4
   */
  getMagnitudeSquare : function(v) {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  },

  /**
   * Normalizes the supplied vector
   * @function
   * @param {Array} v The vector to normalize
   * @returns {Array} The normalized version of the supplied vector
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  isWithinStrict : function(v1, v2, distance) {
    return math.v3.getDistanceSquare(v1, v2) < distance * distance;
  }
};

/**
 * unb3nd 2x2 matrix namespace
 * @since 0.0.0.4
 */
math.m2 = {

  /**
   * Creates a new 2x2 matrix
   * @function
   * @param {Array} src Optional to copy values from
   * @returns {Array} New matrix
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  getDeterminant : function(m) {
    return m[0] * m[3] - m[1] * m[2];
  },

  /**
   * Determines if the supplied matrix is invertable
   * @function
   * @param {Array} m The matrix to use
   * @returns {Boolean} True if the matrix is invertable
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
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
   * @since 0.0.0.4
   */
  equals : function(m1, m2) {
    return m1[0] == m2[0]
      && m1[1] == m2[1]
      && m1[2] == m2[2]
      && m1[3] == m2[3];
  }
};