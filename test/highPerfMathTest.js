"use strict";

module("High Performance Math");

test("Test Rectangle", function() {
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
	
	var pointInside = new unb3nd.Vector2();
	pointInside.x = 1;
	pointInside.y = 3;
	
	ok(r2.isPointInside(pointInside), "Point " + pointInside.toString() + " is inside rectangle " + r2.toString());
	ok(!r2.isPointInsideStrict(pointInside), "Point " + pointInside.toString() + " is not strictly inside rectangle " + r2.toString());
	
	var pointOutside = new unb3nd.Vector2();
	pointOutside.x = 0.5;
	pointOutside.y = 3;
	
	ok(!r2.isPointInside(pointOutside), "Point " + pointOutside.toString() + " is outside rectangle " + r2.toString());
	
	var shrinkAmount = 0.1;
	var r3 = r2.shrink(shrinkAmount);
	ok (r3 !== r2, "Shrink returns new object reference");
	equal(r3.x, r2.x + shrinkAmount, "Shrink in x correct");
	equal(r3.y, r2.y + shrinkAmount, "Shrink in y correct");
	equal(r3.width, r2.width - shrinkAmount * 2, "Shrink in width correct");
	equal(r3.height, r2.height - shrinkAmount * 2, "Shrink in height correct");
	
	var r4 = r2.clone();
	ok(r4 !== r2, "Clone returns new object reference");
	deepEqual(r2, r4, "Cloned object is deeply equal to original object");
});

test("Test unb3nd.Vector2", function() {
	var v1 = unb3nd.v2.create();
	equal(v1[0], 0, "Initial x is zero");
	equal(v1[1], 0, "Initial y is zero");
	
	var v2 = unb3nd.v2.create([1, 2]);
	equal(v2[0], 1, "Initialized x correctly");
	equal(v2[1], 2, "Initialized y correctly");
	
	equal(unb3nd.v2.getAngle(unb3nd.v2.create([1, 0]), unb3nd.v2.create([0, 1])), Math.PI / 2, "Angle determined correctly");
	deepEqual(v2, unb3nd.v2.create(v2), "Clone returns deeply equal copy");
	
	var v3 = unb3nd.v2.create([4, 5]);
	var v4 = unb3nd.v2.add(v3, v2);
	ok(v4 !== v3, "Add returns new object reference");
	equal(v4[0], v3[0] + v2[0], "Add on x correct");
	equal(v4[1], v3[1] + v2[1], "Add on y correct");
	
	var v5 = unb3nd.v2.create(v3);
  unb3nd.v2.addMutate(v5, v2);
	deepEqual(v5, v4, "Add mutate deeply equal");
	
	var v6 = unb3nd.v2.sub(v3, v2);
	ok(v6 !== v3, "Sub returns new object reference");
	equal(v6[0], v3[0] - v2[0], "Sub on x correct");
	equal(v6[1], v3[1] - v2[1], "Sub on y correct");
	
	var v7 = unb3nd.v2.create(v3);
  unb3nd.v2.subMutate(v7, v2);
	deepEqual(v7, v6, "Sub mutate deeply equal");
	
	var v8 = unb3nd.v2.inverse(v7);
	ok(v8 !== v7, "Inverse returns new object reference");
	equal(v8[0], -v7[0], "Inverse on x correct");
	equal(v8[1], -v7[1], "Inverse on y correct");
	
	var scalar = 5;
	var v9 = unb3nd.v2.multScalar(v3, scalar);
	ok(v9 !== v3, "Mult scalar returns new object reference");
	equal(v9[0], v3[0] * scalar, "Mult scalar on x correct");
	equal(v9[1], v3[1] * scalar, "Mult scalar on y correct");
	
	var v10 = unb3nd.v2.create(v3);
	unb3nd.v2.multScalarMutate(v10, scalar);
	deepEqual(v10, v9, "Mult scalar mutate deeply equal");
	
	var dp = unb3nd.v2.dotProduct(v3, v2);
	equal(dp, v3[0] * v2[0] + v3[1] * v2[1], "Dot product correct");
	
	var sm = unb3nd.v2.getMagnitudeSquare(v3);
	equal(sm, v3[0] * v3[0] + v3[1] * v3[1], "Magnitude square correct");
	equal(Math.sqrt(sm), unb3nd.v2.getMagnitude(v3), "Magnitude correct");
	
	var nv3 = unb3nd.v2.normalize(v3);
	ok(nv3 !== v3, "Normalize returns new object reference");
	equal(unb3nd.v2.getMagnitude(nv3), 1, "Normalized length is one");
	
	var nv4 = unb3nd.v2.create(v3);
	unb3nd.v2.normalizeMutate(nv4);
	deepEqual(nv4, nv3, "Normalize mutate is deeply equal");
	
	var v11 = unb3nd.v2.create(v3);
	unb3nd.v2.zeroMutate(v11);
	equal(v11[0], 0, "Zero mutate on x correct");
	equal(v11[1], 0, "Zero mutate on y correct");
});

test("Test Vector3", function() {
  var v1 = unb3nd.v3.create();
  equal(v1[0], 0, "Initial x is zero");
  equal(v1[1], 0, "Initial y is zero");
  equal(v1[2], 0, "Initial z is zero");

  var v2 = unb3nd.v3.create([1, 2, 3]);
  equal(v2[0], 1, "Initialized x correctly");
  equal(v2[1], 2, "Initialized y correctly");
  equal(v2[2], 3, "Initialized z correctly");

  equal(unb3nd.v3.getAngle(unb3nd.v3.create([1, 0, 0]), unb3nd.v3.create([0, 1, 0])), Math.PI / 2, "Angle determined correctly");
  deepEqual(v2, unb3nd.v3.create(v2), "Clone returns deeply equal copy");

  var v3 = unb3nd.v3.create([4, 5, 6]);
  var v4 = unb3nd.v3.add(v3, v2);
  ok(v4 !== v3, "Add returns new object reference");
  equal(v4[0], v3[0] + v2[0], "Add on x correct");
  equal(v4[1], v3[1] + v2[1], "Add on y correct");
  equal(v4[2], v3[2] + v2[2], "Add on z correct");

  var v5 = unb3nd.v3.create(v3);
  unb3nd.v3.addMutate(v5, v2);
  deepEqual(v5, v4, "Add mutate deeply equal");

  var v6 = unb3nd.v3.sub(v3, v2);
  ok(v6 !== v3, "Sub returns new object reference");
  equal(v6[0], v3[0] - v2[0], "Sub on x correct");
  equal(v6[1], v3[1] - v2[1], "Sub on y correct");

  var v7 = unb3nd.v3.create(v3);
  unb3nd.v3.subMutate(v7, v2);
  deepEqual(v7, v6, "Sub mutate deeply equal");

  var v8 = unb3nd.v3.inverse(v7);
  ok(v8 !== v7, "Inverse returns new object reference");
  equal(v8[0], -v7[0], "Inverse on x correct");
  equal(v8[1], -v7[1], "Inverse on y correct");
  equal(v8[2], -v7[2], "Inverse on z correct");

  var scalar = 5;
  var v9 = unb3nd.v3.multScalar(v3, scalar);
  ok(v9 !== v3, "Mult scalar returns new object reference");
  equal(v9[0], v3[0] * scalar, "Mult scalar on x correct");
  equal(v9[1], v3[1] * scalar, "Mult scalar on y correct");
  equal(v9[2], v3[2] * scalar, "Mult scalar on z correct");

  var v10 = unb3nd.v3.create(v3);
  unb3nd.v3.multScalarMutate(v10, scalar);
  deepEqual(v10, v9, "Mult scalar mutate deeply equal");

  var dp = unb3nd.v3.dotProduct(v3, v2);
  equal(dp, v3[0] * v2[0] + v3[1] * v2[1] + v3[2] * v2[2], "Dot product correct");

  var sm = unb3nd.v3.getMagnitudeSquare(v3);
  equal(sm, v3[0] * v3[0] + v3[1] * v3[1] + v3[2] * v3[2], "Magnitude square correct");
  equal(Math.sqrt(sm), unb3nd.v3.getMagnitude(v3), "Magnitude correct");

  var nv3 = unb3nd.v3.normalize(v3);
  ok(nv3 !== v3, "Normalize returns new object reference");
  var TOL = 0.01;
  ok(unb3nd.v3.getMagnitude(nv3) >= 1 - TOL, "Normalized length is within lower tolerance limit");
  ok(unb3nd.v3.getMagnitude(nv3) <= 1 + TOL, "Normalized length is within upper tolerance limit");

  var nv4 = unb3nd.v3.create(v3);
  unb3nd.v3.normalizeMutate(nv4);
  deepEqual(nv4, nv3, "Normalize mutate is deeply equal");

  var v11 = unb3nd.v3.create(v3);
  unb3nd.v3.zeroMutate(v11);
  equal(v11[0], 0, "Zero mutate on x correct");
  equal(v11[1], 0, "Zero mutate on y correct");
  equal(v11[2], 0, "Zero mutate on z correct");
});

test("Test Matrix2", function() {
	// test equal
	ok(unb3nd.m2.equal(
      unb3nd.m2.create([5, 6, 7, 8]),
      unb3nd.m2.create([5, 6, 7, 8])
    ),
    "equal implementation positive check");
	ok(!unb3nd.m2.equal(
    unb3nd.m2.create([5, 6, 7, 8]),
    unb3nd.m2.create([6, 6, 7, 8])
  ), "equal implementation negative check");
	
	// test get entry
	var m1 = unb3nd.m2.create([1, 2, 3, 4]);
	equal(unb3nd.m2.getEntry(m1, 0, 0), 1, "Entry 1:1 correct");
	equal(unb3nd.m2.getEntry(m1, 0, 1), 2, "Entry 1:2 correct");
	equal(unb3nd.m2.getEntry(m1, 1, 0), 3, "Entry 2:1 correct");
	equal(unb3nd.m2.getEntry(m1, 1, 1), 4, "Entry 2:2 correct");
	
	// vector
	var v1 = unb3nd.v2.create([9, 12]);
	var m1v1 = unb3nd.m2.multVector(m1, v1);
	equal(m1v1[0], m1[0] * v1[0] + m1[1] * v1[1], "Vector x mutation correct");
	equal(m1v1[1], m1[2] * v1[0] + m1[3] * v1[1], "Vector y mutation correct");
	
	// general matrix multiplication
	var m2 = unb3nd.m2.create([5, 6, 7, 8]);
	var m1m2 = unb3nd.m2.mult(m1, m2);
	equal(unb3nd.m2.getEntry(m1m2, 0, 0),
    unb3nd.m2.getEntry(m1, 0, 0) * unb3nd.m2.getEntry(m2, 0, 0) + unb3nd.m2.getEntry(m1, 0, 1) * unb3nd.m2.getEntry(m2, 1, 0),
    "Entry 1:1 mult correct"
	);
	equal(unb3nd.m2.getEntry(m1m2, 0, 1),
    unb3nd.m2.getEntry(m1, 0, 0) * unb3nd.m2.getEntry(m2, 0, 1) + unb3nd.m2.getEntry(m1, 0, 1) * unb3nd.m2.getEntry(m2, 1, 1),
    "Entry 1:2 mult correct"
	);
	equal(unb3nd.m2.getEntry(m1m2, 1, 0),
    unb3nd.m2.getEntry(m1, 1, 0) * unb3nd.m2.getEntry(m2, 0, 0) + unb3nd.m2.getEntry(m1, 1, 1) * unb3nd.m2.getEntry(m2, 1, 0),
    "Entry 2:1 mult correct"
	);
	equal(unb3nd.m2.getEntry(m1m2, 1, 1),
    unb3nd.m2.getEntry(m1, 1, 0) * unb3nd.m2.getEntry(m2, 0, 1) + unb3nd.m2.getEntry(m1, 1, 1) * unb3nd.m2.getEntry(m2, 1, 1),
    "Entry 2:2 mult correct"
	);
	
	// specific matrix multiplication
	var m3 = unb3nd.m2.create([1, 2, 3, 4]);
	var m4 = unb3nd.m2.create([5, 6, 7, 8]);
	var m3m4 = unb3nd.m2.mult(m3, m4);
	equal(unb3nd.m2.getEntry(m3m4, 0, 0), 19, "Entry 1:1 mult correct");
	equal(unb3nd.m2.getEntry(m3m4, 0, 1), 22, "Entry 1:2 mult correct");
	equal(unb3nd.m2.getEntry(m3m4, 1, 0), 43, "Entry 2:1 mult correct");
	equal(unb3nd.m2.getEntry(m3m4, 1, 1), 50, "Entry 2:2 mult correct");
	
	var m3addm4 = unb3nd.m2.add(m3, m4);
	equal(unb3nd.m2.getEntry(m3addm4, 0, 0), 6, "Entry 1:1 add correct");
	equal(unb3nd.m2.getEntry(m3addm4, 0, 1), 8, "Entry 1:2 add correct");
	equal(unb3nd.m2.getEntry(m3addm4, 1, 0), 10, "Entry 2:1 add correct");
	equal(unb3nd.m2.getEntry(m3addm4, 1, 1), 12, "Entry 2:2 add correct");
	
	var m3addMm4 = unb3nd.m2.create(m3);
  unb3nd.m2.addMutate(m3addMm4, m4);
	ok(unb3nd.m2.equal(m3addm4, m3addMm4), "Add mutate correct");
	
	// determinant
	equal(unb3nd.m2.getDeterminant(m3), 4 - 2 * 3, "Determinant correct");
	
	// identity matrix
	var i2 = unb3nd.m2.createIdentity();
	equal(unb3nd.m2.getEntry(i2, 0, 0), 1, "Identity 1:1 correct");
	equal(unb3nd.m2.getEntry(i2, 0, 1), 0, "Identity 1:2 correct");
	equal(unb3nd.m2.getEntry(i2, 1, 0), 0, "Identity 2:1 correct");
	equal(unb3nd.m2.getEntry(i2, 1, 1), 1, "Identity 2:2 correct");
	
	// inverse matrix
	ok(unb3nd.m2.isInvertable(i2), "Expected invertable correct");
	notEqual(unb3nd.m2.getInverse(m3), undefined, "Expected defined correct");
	ok(unb3nd.m2.equal(unb3nd.m2.createIdentity(), unb3nd.m2.mult(m3, unb3nd.m2.getInverse(m3))), "Inverse commutative correct");

	// rotation matrix
	var TOL = 0.01;
  var mr = unb3nd.m2.createRotation(3 * Math.PI / 8);
	ok(mr[0] > 0.38 - TOL && mr[0] < 0.38 + TOL, "Rotation 1:1 in bounds");
	ok(mr[1] > -0.92 - TOL && mr[1] < -0.92 + TOL, "Rotation 1:2 in bounds");
	ok(mr[2] > 0.92 - TOL && mr[2] < 0.92 + TOL, "Rotation 2:1 in bounds");
	ok(mr[3] > 0.38 - TOL && mr[3] < 0.38 + TOL, "Rotation 2:2 in bounds");
	
	var v2 = unb3nd.v2.create([1.5, -0.75]);
	var v2r = unb3nd.m2.multVector(mr, v2);

	ok(v2r[0] > 1.27 - TOL && v2r[0] < 1.27 + TOL, "Rotation on vector x in bounds");
	ok(v2r[1] > 1.10 - TOL && v2r[1] < 1.10 + TOL, "Rotation on vector y in bounds");
});