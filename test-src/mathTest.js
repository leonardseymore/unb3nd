"use strict";

module("Math");

test("Test 2-Dimensional Matrix Operations", function () {
  // test equal
  ok(math.m2.equals(math.m2.create([5, 6, 7, 8]), math.m2.create([5, 6, 7, 8])), "equal implementation positive check");
  ok(!math.m2.equals(math.m2.create([5, 6, 7, 8]), math.m2.create([5, 6, 7, 9])), "equal implementation negative check");

  // test get entry
  var m1 = math.m2.create([1, 2, 3, 4]);
  equal(math.m2.getEntry(m1, 0, 0), 1, "Entry 1:1 correct");
  equal(math.m2.getEntry(m1, 0, 1), 2, "Entry 1:2 correct");
  equal(math.m2.getEntry(m1, 1, 0), 3, "Entry 2:1 correct");
  equal(math.m2.getEntry(m1, 1, 1), 4, "Entry 2:2 correct");

  // vector
  var v1 = math.v2.create([9, 12]);
  var m1v1 = math.m2.multVector(m1, v1);
  equal(m1v1[0], m1[0] * v1[0] + m1[1] * v1[1], "Vector x mutation correct");
  equal(m1v1[1], m1[2] * v1[0] + m1[3] * v1[1], "Vector y mutation correct");

  // general matrix multiplication
  var m2 = math.m2.create([5, 6, 7, 8]);
  var m1m2 = math.m2.mult(m1, m2);
  equal(math.m2.getEntry(m1m2, 0, 0),
      math.m2.getEntry(m1, 0, 0) * math.m2.getEntry(m2, 0, 0) + math.m2.getEntry(m1, 0, 1) * math.m2.getEntry(m2, 1, 0),
    "Entry 1:1 mult correct"
  );
  equal(math.m2.getEntry(m1m2, 0, 1),
    math.m2.getEntry(m1, 0, 0) * math.m2.getEntry(m2, 0, 1) + math.m2.getEntry(m1, 0, 1) * math.m2.getEntry(m2, 1, 1),
    "Entry 1:2 mult correct"
  );
  equal(math.m2.getEntry(m1m2, 1, 0),
    math.m2.getEntry(m1, 1, 0) * math.m2.getEntry(m2, 0, 0) + math.m2.getEntry(m1, 1, 1) * math.m2.getEntry(m2, 1, 0),
    "Entry 2:1 mult correct"
  );
  equal(math.m2.getEntry(m1m2, 1, 1),
    math.m2.getEntry(m1, 1, 0) * math.m2.getEntry(m2, 0, 1) + math.m2.getEntry(m1, 1, 1) * math.m2.getEntry(m2, 1, 1),
    "Entry 2:2 mult correct"
  );

  // specific matrix multiplication
  var m3 = math.m2.create([1, 2, 3, 4]);
  var m4 = math.m2.create([5, 6, 7, 8]);
  var m3m4 = math.m2.mult(m3, m4);
  equal(math.m2.getEntry(m3m4, 0, 0), 19, "Entry 1:1 mult correct");
  equal(math.m2.getEntry(m3m4, 0, 1), 22, "Entry 1:2 mult correct");
  equal(math.m2.getEntry(m3m4, 1, 0), 43, "Entry 2:1 mult correct");
  equal(math.m2.getEntry(m3m4, 1, 1), 50, "Entry 2:2 mult correct");

  var m3addm4 = math.m2.add(m3, m4);
  equal(math.m2.getEntry(m3addm4, 0, 0), 6, "Entry 1:1 add correct");
  equal(math.m2.getEntry(m3addm4, 0, 1), 8, "Entry 1:2 add correct");
  equal(math.m2.getEntry(m3addm4, 1, 0), 10, "Entry 2:1 add correct");
  equal(math.m2.getEntry(m3addm4, 1, 1), 12, "Entry 2:2 add correct");

  var m3addMm4 = math.m2.create(m3);
  math.m2.addMutate(m3addMm4, m4);
  ok(math.m2.equals(m3addm4, m3addMm4), "Add mutate correct");

  // determinant
  equal(math.m2.getDeterminant(m3), 4 - 2 * 3, "Determinant correct");

  // identity matrix
  var i2 = math.m2.createIdentity();
  equal(math.m2.getEntry(i2, 0, 0), 1, "Identity 1:1 correct");
  equal(math.m2.getEntry(i2, 0, 1), 0, "Identity 1:2 correct");
  equal(math.m2.getEntry(i2, 1, 0), 0, "Identity 2:1 correct");
  equal(math.m2.getEntry(i2, 1, 1), 1, "Identity 2:2 correct");

  // inverse matrix
  ok(math.m2.isInvertable(m3), "Expected invertable correct");
  notEqual(math.m2.getInverse(m3), undefined, "Expected defined correct");
  ok(math.m2.equals(math.m2.mult(math.m2.getInverse(m3), m3), i2), "Inverse commutative correct");
  ok(math.m2.equals(math.m2.mult(m3, math.m2.getInverse(m3)), i2), "Inverse commutative correct");

  // rotation matrix
  var TOL = 0.01;
  var mr = math.m2.createRotation(3 * Math.PI / 8);
  ok(mr[0] > 0.38 - TOL && mr[0] < 0.38 + TOL, "Rotation 1:1 in bounds");
  ok(mr[1] > -0.92 - TOL && mr[1] < -0.92 + TOL, "Rotation 1:2 in bounds");
  ok(mr[2] > 0.92 - TOL && mr[2] < 0.92 + TOL, "Rotation 2:1 in bounds");
  ok(mr[3] > 0.38 - TOL && mr[3] < 0.38 + TOL, "Rotation 2:2 in bounds");

  var v2 = math.v2.create([1.5, -0.75]);
  var v2r = math.m2.multVector(mr, v2);

  ok(v2r[0] > 1.27 - TOL && v2r[0] < 1.27 + TOL, "Rotation on vector x in bounds");
  ok(v2r[1] > 1.10 - TOL && v2r[1] < 1.10 + TOL, "Rotation on vector y in bounds");
});