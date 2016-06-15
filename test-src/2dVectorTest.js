/**
 * @fileOverview 2-Dimensional Vector Tests
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

var TOL = 1e-4;

Vector2Test = new TestCase("2-Dimensional Vector Tests");
Vector2Test.prototype.testInitialValues = function () {
  var v = math.v2.create();
  assertEquals("Initial x is zero", 0, v[0]);
  assertEquals("Initial y is zero", 0, v[1]);
};

Vector2Test.prototype.testInitializedValues = function () {
  var v = math.v2.create([1, 2]);
  assertEquals("Initialized x correctly", 1, v[0]);
  assertEquals("Initialized y correctly", 2, v[1]);
};

Vector2Test.prototype.testGetAngle = function () {
  var v1 = math.v2.create([1, 0]);
  var v2 = math.v2.create([0, 1]);
  var theta = math.v2.getAngle(v1, v2);
  assertEquals("Angle determined correctly", Math.PI / 2, theta);
};

Vector2Test.prototype.testAdd = function () {
  var v1 = math.v2.create([1, 2]);
  var v2 = math.v2.create([3, 4]);
  var vAdd = math.v2.add(v1, v2);
  assertNotSame("Returned new object reference", vAdd, v1);
  assertEquals("Add on x correct", v1[0] + v2[0], vAdd[0]);
  assertEquals("Add on y correct", v1[1] + v2[1], vAdd[1]);
};

Vector2Test.prototype.testAddMutate = function () {
  var v1 = math.v2.create([1, 2]);
  var v2 = math.v2.create([3, 4]);
  var vAdd = math.v2.create(v1);
  math.v2.addMutate(vAdd, v2);
  assertNotSame("Cloned v1", vAdd, v1);
  assertEquals("Add mutate on x correct", v1[0] + v2[0], vAdd[0]);
  assertEquals("Add mutate on y correct", v1[1] + v2[1], vAdd[1]);
};

Vector2Test.prototype.testSub = function () {
  var v1 = math.v2.create([1, 2]);
  var v2 = math.v2.create([3, 4]);
  var vSub = math.v2.sub(v1, v2);
  assertNotSame("Returned new object reference", vSub, v1);
  assertEquals("Sub on x correct", v1[0] - v2[0], vSub[0]);
  assertEquals("Sub on y correct", v1[1] - v2[1], vSub[1]);
};

Vector2Test.prototype.testSubMutate = function () {
  var v1 = math.v2.create([1, 2]);
  var v2 = math.v2.create([3, 4]);
  var vSub = math.v2.create(v1);
  math.v2.subMutate(vSub, v2);
  assertNotSame("Cloned v1", vSub, v1);
  assertEquals("Sub mutate on x correct", v1[0] - v2[0], vSub[0]);
  assertEquals("Sub mutate on y correct", v1[1] - v2[1], vSub[1]);
};

Vector2Test.prototype.testInverse = function () {
  var v = math.v2.create([1, 2]);
  var vInv = math.v2.inverse(v);
  assertNotSame("Returned new object reference", vInv, v);
  assertEquals("Inverse on x is correct", -v[0], vInv[0]);
  assertEquals("Inverse on y is correct", -v[1], vInv[1]);
};

Vector2Test.prototype.testInverseMutate = function () {
  var v = math.v2.create([1, 2]);
  var vInv = math.v2.create(v);
  math.v2.inverseMutate(vInv);
  assertNotSame("Cloned v", vInv, v);
  assertEquals("Inverse mutate on x is correct", -v[0], vInv[0]);
  assertEquals("Inverse mutate on y is correct", -v[1], vInv[1]);
};

Vector2Test.prototype.testMultScalar = function () {
  var v = math.v2.create([1, 2]);
  var s = 5;
  var vMult = math.v2.multScalar(v, s);
  assertNotSame("Returned new object reference", vMult, v);
  assertEquals("Multiply scalar on x is correct", v[0] * s, vMult[0]);
  assertEquals("Multiply scalar on y is correct", v[1] * s, vMult[1])
};

Vector2Test.prototype.testMultScalarMutate = function () {
  var v = math.v2.create([1, 2]);
  var s = 5;
  var vMult = math.v2.create(v);
  math.v2.multScalarMutate(vMult, s);
  assertNotSame("Cloned v", vMult, v);
  assertEquals("Multiply scalar mutate on x is correct", v[0] * s, vMult[0]);
  assertEquals("Multiply scalar mutate on y is correct", v[1] * s, vMult[1]);
};

Vector2Test.prototype.testDotProduct = function () {
  var v1 = math.v2.create([1, 2]);
  var v2 = math.v2.create([3, 4]);
  var dotProduct = math.v2.dotProduct(v1, v2);
  assertEquals("Dot product is correct", v1[0] * v2[0] + v1[1] * v2[1], dotProduct);
};

Vector2Test.prototype.testGetMagnitude = function () {
  var v = math.v2.create([1, 2]);
  var magnitude = math.v2.getMagnitude(v);
  assertEquals("Magnitude is correct", Math.sqrt(v[0] * v[0] + v[1] * v[1]), magnitude);
};

Vector2Test.prototype.testGetMagnitudeSquare = function () {
  var v = math.v2.create([1, 2]);
  var magnitudeSquare = math.v2.getMagnitudeSquare(v);
  assertEquals("Magnitude square is correct", v[0] * v[0] + v[1] * v[1], magnitudeSquare);
};

Vector2Test.prototype.testNormalize = function () {
  var v = math.v2.create([1, 2]);
  var vNorm = math.v2.normalize(v);
  var magnitude = math.v2.getMagnitude(vNorm);
  assertNotSame("Returned new object reference", vNorm, v);
  assertTrue("Magnitude of normalized vector is 1", math.within(magnitude, 1, TOL));
};

Vector2Test.prototype.testNormalizeMutate = function () {
  var v = math.v2.create([1, 2]);
  var vNorm = math.v2.create(v);
  math.v2.normalizeMutate(vNorm);
  var magnitude = math.v2.getMagnitude(vNorm);
  assertNotSame("Cloned v", vNorm, v);
  assertTrue("Magnitude of normalized mutated vector is 1", math.within(magnitude, 1, TOL));
};

Vector2Test.prototype.testZeroMutate = function () {
  var v = math.v2.create([1, 2]);
  math.v2.zeroMutate(v);
  assertEquals("Zero mutate on x is correct", 0, v[0]);
  assertEquals("Zero mutate on y is correct", 0, v[1]);
};