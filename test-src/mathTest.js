"use strict";

module("Math");

test("Test 2-Dimensional Matrix Operations", function () {
  // test equal
  ok(math.m2.equals(math.m2.create(5, 6, 7, 8), math.m2.create(5, 6, 7, 8)), "equal implementation positive check");
  ok(!math.m2.equals(math.m2.create(5, 6, 7, 8), math.m2.create(5, 6, 7, 9)), "equal implementation negative check");

  // test get entry
  var m1 = new math.m2.create(1, 2, 3, 4);
  equal(math.m2.getEntry(m1, 0, 0), 1, "Entry 1:1 correct");
  equal(math.m2.getEntry(m1, 0, 1), 2, "Entry 1:2 correct");
  equal(math.m2.getEntry(m1, 1, 0), 3, "Entry 2:1 correct");
  equal(math.m2.getEntry(m1, 1, 1), 4, "Entry 2:2 correct");

  // vector
  var v1 = new Vector2(9, 12);
  var m1v1 = m1.multVector(v1);
  equal(m1v1.x, m1.e[0] * v1.x + m1.e[1] * v1.y, "Vector x mutation correct");
  equal(m1v1.y, m1.e[2] * v1.x + m1.e[3] * v1.y, "Vector y mutation correct");

  // general matrix multiplication
  var m2 = new Matrix2(5, 6, 7, 8);
  var m1m2 = m1.mult(m2);
  equal(m1m2.getEntry(0, 0),
    m1.getEntry(0, 0) * m2.getEntry(0, 0) + m1.getEntry(0, 1) * m2.getEntry(1, 0),
    "Entry 1:1 mult correct"
  );
  equal(m1m2.getEntry(0, 1),
    m1.getEntry(0, 0) * m2.getEntry(0, 1) + m1.getEntry(0, 1) * m2.getEntry(1, 1),
    "Entry 1:2 mult correct"
  );
  equal(m1m2.getEntry(1, 0),
    m1.getEntry(1, 0) * m2.getEntry(0, 0) + m1.getEntry(1, 1) * m2.getEntry(1, 0),
    "Entry 2:1 mult correct"
  );
  equal(m1m2.getEntry(1, 1),
    m1.getEntry(1, 0) * m2.getEntry(0, 1) + m1.getEntry(1, 1) * m2.getEntry(1, 1),
    "Entry 2:2 mult correct"
  );

  // specific matrix multiplication
  var m3 = new Matrix2(1, 2, 3, 4);
  var m4 = new Matrix2(5, 6, 7, 8);
  var m3m4 = m3.mult(m4);
  equal(m3m4.getEntry(0, 0), 19, "Entry 1:1 mult correct");
  equal(m3m4.getEntry(0, 1), 22, "Entry 1:2 mult correct");
  equal(m3m4.getEntry(1, 0), 43, "Entry 2:1 mult correct");
  equal(m3m4.getEntry(1, 1), 50, "Entry 2:2 mult correct");

  var m3addm4 = m3.add(m4);
  equal(m3addm4.getEntry(0, 0), 6, "Entry 1:1 add correct");
  equal(m3addm4.getEntry(0, 1), 8, "Entry 1:2 add correct");
  equal(m3addm4.getEntry(1, 0), 10, "Entry 2:1 add correct");
  equal(m3addm4.getEntry(1, 1), 12, "Entry 2:2 add correct");

  var m3addMm4 = m3.clone();
  m3addMm4.addMutate(m4);
  ok(m3addm4.equals(m3addMm4), "Add mutate correct");

  // determinant
  equal(m3.getDeterminant(), 4 - 2 * 3, "Determinant correct");

  // identity matrix
  var i2 = Identity2.instance;
  equal(i2.getEntry(0, 0), 1, "Identity 1:1 correct");
  equal(i2.getEntry(0, 1), 0, "Identity 1:2 correct");
  equal(i2.getEntry(1, 0), 0, "Identity 2:1 correct");
  equal(i2.getEntry(1, 1), 1, "Identity 2:2 correct");

  // inverse matrix
  ok(m3.isInvertable(), "Expected invertable correct");
  notEqual(m3.getInverse(), undefined, "Expected defined correct");
  ok(m3.getInverse().mult(m3).equals(Identity2.instance), "Inverse commutative correct");
  ok(m3.mult(m3.getInverse()).equals(Identity2.instance), "Inverse commutative correct");

  // rotation matrix
  var TOL = 0.01;
  var mr = new RotationMatrix2(3 * Math.PI / 8);
  ok(mr.e[0] > 0.38 - TOL && mr.e[0] < 0.38 + TOL, "Rotation 1:1 in bounds");
  ok(mr.e[1] > -0.92 - TOL && mr.e[1] < -0.92 + TOL, "Rotation 1:2 in bounds");
  ok(mr.e[2] > 0.92 - TOL && mr.e[2] < 0.92 + TOL, "Rotation 2:1 in bounds");
  ok(mr.e[3] > 0.38 - TOL && mr.e[3] < 0.38 + TOL, "Rotation 2:2 in bounds");

  var v2 = new Vector2(1.5, -0.75);
  var v2r = mr.multVector(v2);

  ok(v2r.x > 1.27 - TOL && v2r.x < 1.27 + TOL, "Rotation on vector x in bounds");
  ok(v2r.y > 1.10 - TOL && v2r.y < 1.10 + TOL, "Rotation on vector y in bounds");
});