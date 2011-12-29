/**
 * @fileOverview 2-Dimensional Vector Tests
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.4
 */

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