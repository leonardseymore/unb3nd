/**
 * @fileOverview 2-Dimensional Rectangle Tests
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

RectangleTest = new TestCase("2-Dimensional Rectangle Tests");
RectangleTest.prototype.testInitialValues = function () {
  var r = new Rectangle();
  assertEquals("Default x is zero", 0, r.pos[0]);
  assertEquals("Default y is zero", 0, r.pos[1]);
  assertEquals("Default width is zero", 0, r.width);
  assertEquals("Default height is zero", 0, r.height);
};

RectangleTest.prototype.testInitializedValues = function () {
  var r = new Rectangle([1, 2], 3, 4);
  assertEquals("Initialized x correctly", 1, r.pos[0]);
  assertEquals("Initialized y correctly", 2, r.pos[1]);
  assertEquals("Initialized width correctly", 3, r.width);
  assertEquals("Initialized height correctly", 4, r.height);
};

RectangleTest.prototype.testPointInside = function () {
  var r = new Rectangle([1, 2], 3, 4);
  var pointInside = math.v2.create([1, 3]);

  assertTrue("Point should be inside rectangle", r.isPointInside(pointInside));
  assertFalse("Point should not be strictly inside rectangle", r.isPointInsideStrict(pointInside));
};

RectangleTest.prototype.testPointOutside = function () {
  var r = new Rectangle([1, 2], 3, 4);
  var pointOutside = math.v2.create([0.5, 3]);

  assertFalse("Point should be outside rectangle", r.isPointInside(pointOutside));
  assertFalse("Point should be outside rectangle", r.isPointInsideStrict(pointOutside));
};

RectangleTest.prototype.testShrink = function () {
  var shrinkAmount = 0.1;
  var r = new Rectangle([1, 2], 3, 4);
  var shrunkR = r.shrink(shrinkAmount);

  assertNotSame("Shrink returns new object reference", shrunkR, r);

  assertEquals("Shrink in x correct", r.pos[0] + shrinkAmount, shrunkR.pos[0]);
  assertEquals("Shrink in y correct", r.pos[1] + shrinkAmount, shrunkR.pos[1]);
  assertEquals("Shrink in width correct", r.width - shrinkAmount * 2, shrunkR.width);
  assertEquals("Shrink in height correct", r.height - shrinkAmount * 2, shrunkR.height);
};

RectangleTest.prototype.testClone = function () {
  var r = new Rectangle([1, 2], 3, 4);
  var clonedR = r.clone();

  assertNotSame("Clone returns new object reference", r, clonedR);
  //assertEquals("Cloned objects is deeply equal to original object", r, clonedR);
};