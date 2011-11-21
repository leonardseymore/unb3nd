module("Rigid Physics");

test("Test RigidBody", function() {
	var uid = RigidBody.nextUid;
	var b1 = new RigidBody();
	equals(uid, b1.uid);
	equals(b1.getOrientation().x, 1);
	equals(b1.getOrientation().y, 0);
	
	var TOL = 0.01;
	var angle = 3 * Math.PI / 2;
	b1.setOrientationAngle(angle);
	var x = b1.getOrientation().x;
	var y = b1.getOrientation().y;
	ok(x > Math.cos(angle) - TOL && 
	   x < Math.cos(angle) + TOL);
	ok(y > Math.sin(angle) - TOL && 
	   y < Math.sin(angle) + TOL);
	   
	equals(b1.getOrientationAngle(), angle);
});