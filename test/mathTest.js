"use strict";

module("Math");

test("Test Rectangle", function () {
  var r1 = new Rectangle();
  equal(r1.x, 0, "Default x is zero");
  equal(r1.y, 0, "Default y is zero");
  equal(r1.width, 0, "Default width is zero");
  equal(r1.height, 0, "Default height is zero");

  var r2 = new Rectangle(1, 2, 3, 4);
  equal(r2.x, 1, "x is initialized correctly");
  equal(r2.y, 2, "y is initialized correctly");
  equal(r2.width, 3, "width is initialized correctly");
  equal(r2.height, 4, "height is initialized correctly");

  var pointInside = new Vector2();
  pointInside.x = 1;
  pointInside.y = 3;

  ok(r2.isPointInside(pointInside), "Point " + pointInside.toString() + " is inside rectangle " + r2.toString());
  ok(!r2.isPointInsideStrict(pointInside), "Point " + pointInside.toString() + " is not strictly inside rectangle " + r2.toString());

  var pointOutside = new Vector2();
  pointOutside.x = 0.5;
  pointOutside.y = 3;

  ok(!r2.isPointInside(pointOutside), "Point " + pointOutside.toString() + " is outside rectangle " + r2.toString());

  var shrinkAmount = 0.1;
  var r3 = r2.shrink(shrinkAmount);
  ok(r3 !== r2, "Shrink returns new object reference");
  equal(r3.x, r2.x + shrinkAmount, "Shrink in x correct");
  equal(r3.y, r2.y + shrinkAmount, "Shrink in y correct");
  equal(r3.width, r2.width - shrinkAmount * 2, "Shrink in width correct");
  equal(r3.height, r2.height - shrinkAmount * 2, "Shrink in height correct");

  var r4 = r2.clone();
  ok(r4 !== r2, "Clone returns new object reference");
  deepEqual(r2, r4, "Cloned object is deeply equal to original object");
});

test("Test Vector2", function () {
  var v1 = new Vector2();
  equal(v1.x, 0, "Initial x is zero");
  equal(v1.y, 0, "Initial y is zero");

  var v2 = new Vector2(1, 2);
  equal(v2.x, 1, "Initialized x correctly");
  equal(v2.y, 2, "Initialized y correctly");

  equal(Vector2.getAngle(new Vector2(1, 0), new Vector2(0, 1)), Math.PI / 2, "Angle determined correctly");
  deepEqual(v2, v2.clone(), "Clone returns deeply equal copy");

  var v3 = new Vector2(4, 5);
  var v4 = v3.add(v2);
  ok(v4 !== v3, "Add returns new object reference");
  equal(v4.x, v3.x + v2.x, "Add on x correct");
  equal(v4.y, v3.y + v2.y, "Add on y correct");

  var v5 = v3.clone();
  v5.addMutate(v2);
  deepEqual(v5, v4, "Add mutate deeply equal");

  var v6 = v3.sub(v2);
  ok(v6 !== v3, "Sub returns new object reference");
  equal(v6.x, v3.x - v2.x, "Sub on x correct");
  equal(v6.y, v3.y - v2.y, "Sub on y correct");

  var v7 = v3.clone();
  v7.subMutate(v2);
  deepEqual(v7, v6, "Sub mutate deeply equal");

  var v8 = v7.inverse();
  ok(v8 !== v7, "Inverse returns new object reference");
  equal(v8.x, -v7.x, "Inverse on x correct");
  equal(v8.y, -v7.y, "Inverse on y correct");

  var scalar = 5;
  var v9 = v3.multScalar(scalar);
  ok(v9 !== v3, "Mult scalar returns new object reference");
  equal(v9.x, v3.x * scalar, "Mult scalar on x correct");
  equal(v9.y, v3.y * scalar, "Mult scalar on y correct");

  var v10 = v3.clone();
  v10.multScalarMutate(scalar);
  deepEqual(v10, v9, "Mult scalar mutate deeply equal");

  var dp = v3.dotProduct(v2);
  equal(dp, v3.x * v2.x + v3.y * v2.y, "Dot product correct");

  var sm = v3.getMagnitudeSquare();
  equal(sm, v3.x * v3.x + v3.y * v3.y, "Magnitude square correct");
  equal(Math.sqrt(sm), v3.getMagnitude(), "Magnitude correct");

  var nv3 = v3.normalize();
  ok(nv3 !== v3, "Normalize returns new object reference");
  equal(nv3.getMagnitude(), 1, "Normalized length is one");

  var nv4 = v3.clone();
  nv4.normalizeMutate();
  deepEqual(nv4, nv3, "Normalize mutate is deeply equal");

  var v11 = v3.clone();
  v11.zeroMutate();
  equal(v11.x, 0, "Zero mutate on x correct");
  equal(v11.y, 0, "Zero mutate on y correct");
});

test("Test Matrix2", function () {
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