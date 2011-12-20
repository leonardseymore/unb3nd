"use strict";

module("Rigid Physics");

test("Test RigidBody", function() {
	var uid = RigidBody.nextUid;
	var b1 = new RigidBody();
	equal(uid, b1.uid);
	equal(b1.getOrientation().x, 1);
	equal(b1.getOrientation().y, 0);
	
	var TOL = 0.01;

  var inBounds = true;
  for (var angle = -Math.PI; angle < Math.PI; angle += 0.25) {
    b1.setOrientationAngle(angle);
    var angleResult = b1.getOrientationAngle();
    inBounds = angle > angleResult - TOL &&
       angle < angleResult + TOL;

    if (!inBounds) {
      console.warn("Angle %d angleResult %d", angle, angleResult);
    } else {
      console.log("Angle %d angleResult %d", angle, angleResult);
    }
  } // for
	ok(inBounds);
});