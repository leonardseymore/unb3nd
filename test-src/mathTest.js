"use strict";

module("Math");

test("Test 2-Dimensional Rectangle", function () {
  var r1 = new Rectangle();
  equal(r1.pos[0], 0, "Default x is zero");
  equal(r1.pos[1], 0, "Default y is zero");
  equal(r1.width, 0, "Default width is zero");
  equal(r1.height, 0, "Default height is zero");

  var r2 = new Rectangle([1, 2], 3, 4);
  equal(r2.pos[0], 1, "x is initialized correctly");
  equal(r2.pos[1], 2, "y is initialized correctly");
  equal(r2.width, 3, "width is initialized correctly");
  equal(r2.height, 4, "height is initialized correctly");

  var pointInside = math.v2.create([1, 3]);

  ok(r2.isPointInside(pointInside), "Point " + pointInside.toString() + " is inside rectangle " + r2.toString());
  ok(!r2.isPointInsideStrict(pointInside), "Point " + pointInside.toString() + " is not strictly inside rectangle " + r2.toString());

  var pointOutside = math.v2.create([0.5, 3]);

  ok(!r2.isPointInside(pointOutside), "Point " + pointOutside.toString() + " is outside rectangle " + r2.toString());

  var shrinkAmount = 0.1;
  var r3 = r2.shrink(shrinkAmount);
  ok(r3 !== r2, "Shrink returns new object reference");
  equal(r3.pos[0], r2.pos[0] + shrinkAmount, "Shrink in x correct");
  equal(r3.pos[1], r2.pos[1] + shrinkAmount, "Shrink in y correct");
  equal(r3.width, r2.width - shrinkAmount * 2, "Shrink in width correct");
  equal(r3.height, r2.height - shrinkAmount * 2, "Shrink in height correct");

  var r4 = r2.clone();
  ok(r4 !== r2, "Clone returns new object reference");
  deepEqual(r2, r4, "Cloned object is deeply equal to original object");
});

test("Test 2-Dimensional Vector Operations", function () {
  var v1 = math.v2.create();
  equal(v1[0], 0, "Initial x is zero");
  equal(v1[1], 0, "Initial y is zero");

  var v2 = math.v2.create([1, 2]);
  equal(v2[0], 1, "Initialized x correctly");
  equal(v2[1], 2, "Initialized y correctly");

  equal(math.v2.getAngle(math.v2.create([1, 0]), math.v2.create([0, 1])), Math.PI / 2, "Angle determined correctly");
  deepEqual(v2, math.v2.create(v2), "Clone returns deeply equal copy");

  var v3 = math.v2.create([4, 5]);
  var v4 = math.v2.add(v3, v2);
  ok(v4 !== v3, "Add returns new object reference");
  equal(v4[0], v3[0] + v2[0], "Add on x correct");
  equal(v4[1], v3[1] + v2[1], "Add on y correct");

  var v5 = math.v2.create(v3);
  math.v2.addMutate(v5, v2);
  deepEqual(v5, v4, "Add mutate deeply equal");

  var v6 = math.v2.sub(v3, v2);
  ok(v6 !== v3, "Sub returns new object reference");
  equal(v6[0], v3[0] - v2[0], "Sub on x correct");
  equal(v6[1], v3[1] - v2[1], "Sub on y correct");

  var v7 = math.v2.create(v3);
  math.v2.subMutate(v7, v2);
  deepEqual(v7, v6, "Sub mutate deeply equal");

  var v8 = math.v2.inverse(v7);
  ok(v8 !== v7, "Inverse returns new object reference");
  equal(v8[0], -v7[0], "Inverse on x correct");
  equal(v8[1], -v7[1], "Inverse on y correct");

  var scalar = 5;
  var v9 = math.v2.multScalar(v3, scalar);
  ok(v9 !== v3, "Mult scalar returns new object reference");
  equal(v9[0], v3[0] * scalar, "Mult scalar on x correct");
  equal(v9[1], v3[1] * scalar, "Mult scalar on y correct");

  var v10 = math.v2.create(v3);
  math.v2.multScalarMutate(v10, scalar);
  deepEqual(v10, v9, "Mult scalar mutate deeply equal");

  var dp = math.v2.dotProduct(v3, v2);
  equal(dp, v3[0] * v2[0] + v3[1] * v2[1], "Dot product correct");

  var sm = math.v2.getMagnitudeSquare(v3);
  equal(sm, v3[0] * v3[0] + v3[1] * v3[1], "Magnitude square correct");
  equal(Math.sqrt(sm), math.v2.getMagnitude(v3), "Magnitude correct");

  var nv3 = math.v2.normalize(v3);
  ok(nv3 !== v3, "Normalize returns new object reference");
  equal(math.v2.getMagnitude(nv3), 1, "Normalized length is one");

  var nv4 = math.v2.create(v3);
  math.v2.normalizeMutate(nv4);
  deepEqual(nv4, nv3, "Normalize mutate is deeply equal");

  var v11 = math.v2.create(v3);
  math.v2.zeroMutate(v11);
  equal(v11[0], 0, "Zero mutate on x correct");
  equal(v11[1], 0, "Zero mutate on y correct");
});

test("Test 2-Dimensional Matrix Operations", function () {
  // test equal
  ok(new Matrix2(5, 6, 7, 8).equals(new Matrix2(5, 6, 7, 8)), "equal implementation positive check");
  ok(!new Matrix2(5, 6, 7, 8).equals(new Matrix2(5, 6, 7, 9)), "equal implementation negative check");

  // test get entry
  var m1 = new Matrix2(1, 2, 3, 4);
  equal(m1.getEntry(0, 0), 1, "Entry 1:1 correct");
  equal(m1.getEntry(0, 1), 2, "Entry 1:2 correct");
  equal(m1.getEntry(1, 0), 3, "Entry 2:1 correct");
  equal(m1.getEntry(1, 1), 4, "Entry 2:2 correct");

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