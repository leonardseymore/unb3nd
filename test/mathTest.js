module("Math");

test("Test Rectangle", function() {
	var r1 = new Rectangle();
	equals(r1.x, 0);
	equals(r1.y, 0);
	equals(r1.width, 0);
	equals(r1.height, 0);
	
	var r2 = new Rectangle(1, 2, 3, 4);
	equals(r2.x, 1);
	equals(r2.y, 2);
	equals(r2.width, 3);
	equals(r2.height, 4);
	
	var pointInside = new Vector2();
	pointInside.x = 1;
	pointInside.y = 3;
	
	ok(r2.isPointInside(pointInside));
	ok(!r2.isPointInsideStrict(pointInside));
	
	var pointOutside = new Vector2();
	pointOutside.x = 0.5;
	pointOutside.y = 3;
	
	ok(!r2.isPointInside(pointOutside));
	
	var shrinkAmount = 0.1;
	var r3 = r2.shrink(shrinkAmount);
	ok (r3 !== r2);
	equals(r3.x, r2.x + shrinkAmount);
	equals(r3.y, r2.y + shrinkAmount);
	equals(r3.width, r2.width - shrinkAmount * 2);
	equals(r3.height, r2.height - shrinkAmount * 2);
	
	var r4 = r2.clone();
	ok(r4 !== r2);
	deepEqual(r2, r4);
});

test("Test Vector2", function() {
	var v1 = new Vector2();
	equals(v1.x, 0);
	equals(v1.y, 0);
	
	var v2 = new Vector2(1, 2);
	equals(v2.x, 1);
	equals(v2.y, 2);
	
	equal(Vector2.getAngle(new Vector2(1, 0), new Vector2(0, 1)), Math.PI / 2);
	deepEqual(v2, v2.clone());
	
	var v3 = new Vector2(4, 5);
	var v4 = v3.add(v2);
	ok(v4 !== v3);
	equals(v4.x, v3.x + v2.x);
	equals(v4.y, v3.y + v2.y);
	
	var v5 = v3.clone();
	v5.addMutate(v2);
	deepEqual(v5, v4);
	
	var v6 = v3.sub(v2);
	ok(v6 !== v3);
	equals(v6.x, v3.x - v2.x);
	equals(v6.y, v3.y - v2.y);
	
	var v7 = v3.clone();
	v7.subMutate(v2);
	deepEqual(v7, v6);
	
	var v8 = v7.reverse();
	ok(v8 !== v7);
	equals(v8.x, -v7.x);
	equals(v8.y, -v7.y);
	
	var scalar = 5;
	var v9 = v3.multScalar(scalar);
	ok(v9 !== v3);
	equals(v9.x, v3.x * scalar);
	equals(v9.y, v3.y * scalar);
	
	var v10 = v3.clone();
	v10.multScalarMutate(scalar);
	deepEqual(v10, v9);
	
	var dp = v3.dotProduct(v2);
	equal(dp, v3.x * v2.x + v3.y * v2.y);
	
	var sm = v3.getMagnitudeSquare();
	equal(sm, v3.x * v3.x + v3.y * v3.y);
	equal(Math.sqrt(sm), v3.getMagnitude());
	
	var nv3 = v3.normalize();
	ok(nv3 !== v3);
	equals(nv3.getMagnitude(), 1);
	
	var nv4 = v3.clone();
	nv4.normalizeMutate();
	deepEqual(nv4, nv3);
	
	var v11 = v3.clone();
	v11.zeroMutate();
	equals(v11.x, 0);
	equals(v11.y, 0);
});

test("Test Matrix2", function() {
	// test equals
	ok(new Matrix2(5, 6, 7, 8).equals(new Matrix2(5, 6, 7, 8)));
	ok(!new Matrix2(5, 6, 7, 8).equals(new Matrix2(5, 6, 7, 9)));
	
	// test get entry
	var m1 = new Matrix2(1, 2, 3, 4);
	equals(m1.getEntry(0, 0), 1);
	equals(m1.getEntry(0, 1), 2);
	equals(m1.getEntry(1, 0), 3);
	equals(m1.getEntry(1, 1), 4);
	
	// vector
	var v1 = new Vector2(9, 12);
	var m1v1 = m1.multVector(v1);
	equals(m1v1.x, m1.e[0] * v1.x + m1.e[1] * v1.y);
	equals(m1v1.y, m1.e[2] * v1.x + m1.e[3] * v1.y);
	
	// general matrix multiplication
	var m2 = new Matrix2(5, 6, 7, 8);
	var m1m2 = m1.mult(m2);
	equals(m1m2.getEntry(0, 0), 
		m1.getEntry(0, 0) * m2.getEntry(0, 0) + m1.getEntry(0, 1) * m2.getEntry(1, 0)
	);
	equals(m1m2.getEntry(0, 1), 
		m1.getEntry(0, 0) * m2.getEntry(0, 1) + m1.getEntry(0, 1) * m2.getEntry(1, 1)
	);
	equals(m1m2.getEntry(1, 0), 
		m1.getEntry(1, 0) * m2.getEntry(0, 0) + m1.getEntry(1, 1) * m2.getEntry(1, 0)
	);
	equals(m1m2.getEntry(1, 1), 
		m1.getEntry(1, 0) * m2.getEntry(0, 1) + m1.getEntry(1, 1) * m2.getEntry(1, 1)
	);
	
	// specific matrix multiplication
	var m3 = new Matrix2(1, 2, 3, 4);
	var m4 = new Matrix2(5, 6, 7, 8);
	var m3m4 = m3.mult(m4);
	equals(m3m4.getEntry(0, 0), 19);
	equals(m3m4.getEntry(0, 1), 22);
	equals(m3m4.getEntry(1, 0), 43);
	equals(m3m4.getEntry(1, 1), 50);
	
	var m3addm4 = m3.add(m4);
	equals(m3addm4.getEntry(0, 0), 6);
	equals(m3addm4.getEntry(0, 1), 8);
	equals(m3addm4.getEntry(1, 0), 10);
	equals(m3addm4.getEntry(1, 1), 12);
	
	var m3addMm4 = m3.clone();
	m3addMm4.addMutate(m4);
	ok(m3addm4.equals(m3addMm4));
	
	// determinant
	equals(m3.getDeterminant(), 1 * 4 - 2 * 3);
	
	// identity matrix
	var i2 = Identity2.instance;
	equals(i2.getEntry(0, 0), 1);
	equals(i2.getEntry(0, 1), 0);
	equals(i2.getEntry(1, 0), 0);
	equals(i2.getEntry(1, 1), 1);
	
	// inverse matrix
	ok(m3.isInvertable());
	notEqual(m3.getInverse(), undefined);
	ok(m3.getInverse().mult(m3).equals(Identity2.instance));
	ok(m3.mult(m3.getInverse()).equals(Identity2.instance));
	
	// rotation matrix
	var TOL = 0.01;
	var mr = RotationMatrix2.instance.getRotationMatrix(3 * Math.PI / 8);
	ok(mr.e[0] > 0.38 - TOL && mr.e[0] < 0.38 + TOL);
	ok(mr.e[1] > -0.92 - TOL && mr.e[1] < -0.92 + TOL);
	ok(mr.e[2] > 0.92 - TOL && mr.e[2] < 0.92 + TOL);
	ok(mr.e[3] > 0.38 - TOL && mr.e[3] < 0.38 + TOL);
	
	var v2 = new Vector2(1.5, -0.75);
	var v2r = RotationMatrix2.instance.rotate(v2, 3 * Math.PI / 8);

	ok(v2r.x > 1.27 - TOL && v2r.x < 1.27 + TOL);
	ok(v2r.y > 1.10 - TOL && v2r.y < 1.10 + TOL);
});