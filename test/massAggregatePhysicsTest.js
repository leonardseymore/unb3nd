"use strict";

module("Mass Aggregate Physics");

test("Test Particle", function() {
	var uid = Particle.nextUid;
	var p1 = new Particle();
	equal(uid, p1.uid);
	
	var TOL = 0.1;
	var pos = new unb3nd.Vector2(1, 2);
	p1.pos = pos.clone();
	var point = new unb3nd.Vector2(2, 3);
	// distance from pos to point is sqrt(2)
	// we want to make sure we can find the vector within
	// a radius of sqrt(2) + TOL
	ok(p1.isCloseToPoint(point, Math.sqrt(2) + TOL));
	
	p1.setMass(0);
	equal(p1.inverseMass, 0);
	ok(!p1.hasFiniteMass());
	var mass = 5;
	p1.setMass(mass);
	equal(p1.inverseMass, 1 / mass);
	ok(p1.hasFiniteMass());
	
	var f1 = new unb3nd.Vector2(1, 1);
	var oldAccum = p1.forceAccum.clone();
	p1.applyForce(f1);
	equal(p1.forceAccum.x, oldAccum.x + f1.x);
	equal(p1.forceAccum.y, oldAccum.y + f1.y);
	
	p1.clearForceAccum();
	equal(p1.forceAccum.x, 0);
	equal(p1.forceAccum.y, 0);
	
	p1.applyForce(f1);
	p1.integrate(1000);
	equal(p1.vel.x, f1.x * p1.inverseMass);
	equal(p1.vel.y, f1.y * p1.inverseMass);
});

test("Test ParticleForceRegistry", function() {
	var reg = new ParticleForceRegistry();
	equal(reg.entries.length, 0);
	
	var p1 = new Particle();
	p1.setMass(5);
	var fg1 = new ParticleGravityForceGenerator();
	reg.add(p1, fg1);
	equal(reg.entries.length, 1);
	equal(reg.getForceGenerators(p1)[0], fg1);
	
	reg.removeForceGenerators(p1);
	equal(reg.getForceGenerators(p1), undefined);
	
	reg.add(p1, fg1);
	equal(reg.getForceGenerators(p1)[0], fg1);
	reg.removeForceGenerator(fg1);
	equal(reg.getForceGenerators(p1).length, 0);
	
	reg.add(p1, fg1);
	equal(reg.getForceGenerators(p1)[0], fg1);
	equal(p1.forceAccum.x, 0);
	equal(p1.forceAccum.y, 0);
	
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	reg.applyForces(1000);
	notDeepEqual(p1.forceAccum, oldForceAccum);
});

test("Test ParticleForceGenerators - Gravity", function() {
	var p1 = new Particle();
	p1.setMass(1);
	var gf1 = new ParticleGravityForceGenerator();
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	gf1.applyForce(p1, 1000);
	notDeepEqual(p1.forceAccum, oldForceAccum);
	var fd = p1.forceAccum.sub(oldForceAccum); // fd ~ forceDelta
	deepEqual(fd, gf1.gravitation);
});

test("Test ParticleForceGenerators - Drag", function() {
	var p1 = new Particle();
	p1.setMass(1);
	var k1 = 1;
	var k2 = 2;
	var fg = new ParticleDragForceGenerator(k1, k2);
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	p1.vel.x = 10;
	fg.applyForce(p1, 1000);
	
	var dragCoeff = p1.vel.getMagnitude();
	dragCoeff = k1 * dragCoeff + k2 * dragCoeff * dragCoeff;
	var fd = p1.vel.normalize(); // fd ~ forceDelta
	fd.multScalarMutate(-dragCoeff);
	
	deepEqual(fd, p1.forceAccum);
});

test("Test ParticleForceGenerators - Spring", function() {
	var p1 = new Particle();
	p1.setMass(1);
	p1.pos.x = 9;
	p1.pos.y = 12;
	
	var p2 = new Particle();
	p2.setMass(5);
	
	var springConstant = 1;
	var restLength = 10;
	var fg = new ParticleSpringForceGenerator(p2, springConstant, restLength);
	
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	fg.applyForce(p1, 1000);
	
	var fd = p1.pos.clone(); // fd ~ forceDelta
	fd.subMutate(p2.pos);
	
	var magnitude = fd.getMagnitude();
	magnitude = Math.abs(magnitude - restLength);
	magnitude *= springConstant;
	
	fd.normalizeMutate();
	fd.multScalarMutate(-magnitude);
	
	deepEqual(fd, p1.forceAccum);
});

test("Test ParticleForceGenerators - Anchored Spring", function() {
	var p1 = new Particle();
	p1.setMass(1);
	p1.pos.x = 9;
	p1.pos.y = 12;
	
	var anchor = new unb3nd.Vector2();
	
	var springConstant = 1;
	var restLength = 10;
	var fg = new ParticleAnchoredSpringForceGenerator(anchor, springConstant, restLength);
	
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	fg.applyForce(p1, 1000);
	
	var fd = p1.pos.clone(); // fd ~ forceDelta
	fd.subMutate(anchor);
	
	var magnitude = fd.getMagnitude();
	magnitude = Math.abs(magnitude - restLength);
	magnitude *= springConstant;
	
	fd.normalizeMutate();
	fd.multScalarMutate(-magnitude);
	
	deepEqual(fd, p1.forceAccum);
});

test("Test ParticleForceGenerators - Bungee", function() {
	var p1 = new Particle();
	p1.setMass(1);
	p1.pos.x = 9;
	p1.pos.y = 12;
	
	var p2 = new Particle();
	p2.setMass(5);
	
	var springConstant = 1;
	var restLength = 20;
	var fg = new ParticleBungeeForceGenerator(p2, springConstant, restLength);
	
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	fg.applyForce(p1, 1000);
	
	var fd = p1.pos.clone(); // fd ~ forceDelta
	fd.subMutate(p2.pos);
	
	// make sure force is not applied if restLength <= magnitude
	var magnitude = fd.getMagnitude();
	ok(magnitude <= restLength);
	deepEqual(p1.forceAccum, oldForceAccum);
	
	// make sure force is applied if magnitude > restLength
	restLength = 5;
	fg.restLength = restLength;
	fg.applyForce(p1, 1000);
	var magnitude = fd.getMagnitude();
	ok(magnitude > restLength);
	magnitude = springConstant * (magnitude - restLength);
	
	fd.normalizeMutate();
	fd.multScalarMutate(-magnitude);
	deepEqual(fd, p1.forceAccum);
	notDeepEqual(p1.forceAccum, oldForceAccum);
});

test("Test ParticleForceGenerators - Anchored Bungee", function() {
	var p1 = new Particle();
	p1.setMass(1);
	p1.pos.x = 9;
	p1.pos.y = 12;
	
	var anchor = new unb3nd.Vector2();
	
	var springConstant = 1;
	var restLength = 20;
	var fg = new ParticleAnchoredBungeeForceGenerator(anchor, springConstant, restLength);
	
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	fg.applyForce(p1, 1000);
	
	var fd = p1.pos.clone(); // fd ~ forceDelta
	fd.subMutate(anchor);
	
	// make sure force is not applied if restLength <= magnitude
	var magnitude = fd.getMagnitude();
	ok(magnitude <= restLength);
	deepEqual(p1.forceAccum, oldForceAccum);
	
	// make sure force is applied if magnitude > restLength
	restLength = 5;
	fg.restLength = restLength;
	fg.applyForce(p1, 1000);
	var magnitude = fd.getMagnitude();
	ok(magnitude > restLength);
	magnitude = springConstant * (magnitude - restLength);
	
	fd.normalizeMutate();
	fd.multScalarMutate(-magnitude);
	deepEqual(fd, p1.forceAccum);
	notDeepEqual(p1.forceAccum, oldForceAccum);
});

// TODO: Buoyancy force generator needs work
test("Test ParticleForceGenerators - Buoyancy", function() {
	var p1 = new Particle();
	p1.setMass(1);
	p1.pos.x = 9;
	p1.pos.y = 12;
	
	var anchor = new unb3nd.Vector2();
	
	var maxDepth = 10;
	var volume = 5;
	var liquidDensity = 1000;
	var fg = new ParticleBuoyancyForceGenerator(anchor, maxDepth, volume, liquidDensity);
	
	var oldForceAccum = p1.forceAccum.clone();
	deepEqual(p1.forceAccum, oldForceAccum);
	fg.applyForce(p1, 1000);
	
	var depth = anchor.y - p1.pos.y;
	ok(depth <= -maxDepth);
	deepEqual(p1.forceAccum, oldForceAccum);
	
	maxDepth = -20;
	fg.maxDepth = maxDepth;
	fg.applyForce(p1, 1000);
	ok(depth > maxDepth);
	fg.applyForce(p1, 1000);
	//equal(p1.forceAccum.y, liquidDensity * volume);
});

test("Test ParticleForceGeneratorFactory", function() {
	var forceRegistry = new ParticleForceRegistry();
	equal(forceRegistry.entries.length, 0);
	
	var p1 = new Particle();
	ParticleForceGeneratorFactory.createGravity(forceRegistry, p1);
	equal(forceRegistry.getForceGenerators(p1).length, 1); 
	ok(forceRegistry.getForceGenerators(p1)[0] instanceof ParticleGravityForceGenerator); 
	
	ParticleForceGeneratorFactory.createWind(forceRegistry, p1);
	equal(forceRegistry.getForceGenerators(p1).length, 2); 
	ok(forceRegistry.getForceGenerators(p1)[1] instanceof ParticleWindForceGenerator); 
	
	ParticleForceGeneratorFactory.createDrag(forceRegistry, p1);
	equal(forceRegistry.getForceGenerators(p1).length, 3); 
	ok(forceRegistry.getForceGenerators(p1)[2] instanceof ParticleDragForceGenerator); 
	
	var p2 = new Particle();
	ParticleForceGeneratorFactory.createSpring(forceRegistry, p1, p2);
	equal(forceRegistry.getForceGenerators(p1).length, 4); 
	ok(forceRegistry.getForceGenerators(p1)[3] instanceof ParticleSpringForceGenerator); 
	equal(forceRegistry.getForceGenerators(p2).length, 1); 
	ok(forceRegistry.getForceGenerators(p2)[0] instanceof ParticleSpringForceGenerator); 
	
	var anchor = new unb3nd.Vector2();
	ParticleForceGeneratorFactory.createAnchoredSpring(forceRegistry, p1, anchor);
	equal(forceRegistry.getForceGenerators(p1).length, 5); 
	ok(forceRegistry.getForceGenerators(p1)[4] instanceof ParticleAnchoredSpringForceGenerator); 
	
	ParticleForceGeneratorFactory.createBungee(forceRegistry, p1, p2);
	equal(forceRegistry.getForceGenerators(p1).length, 6); 
	ok(forceRegistry.getForceGenerators(p1)[5] instanceof ParticleBungeeForceGenerator); 
	equal(forceRegistry.getForceGenerators(p2).length, 2); 
	ok(forceRegistry.getForceGenerators(p2)[1] instanceof ParticleBungeeForceGenerator);

	ParticleForceGeneratorFactory.createAnchoredBungee(forceRegistry, p1, anchor);
	equal(forceRegistry.getForceGenerators(p1).length, 7); 
	ok(forceRegistry.getForceGenerators(p1)[6] instanceof ParticleAnchoredBungeeForceGenerator);
	
	ParticleForceGeneratorFactory.createBuoyancy(forceRegistry, p1, anchor);
	equal(forceRegistry.getForceGenerators(p1).length, 8); 
	ok(forceRegistry.getForceGenerators(p1)[7] instanceof ParticleBuoyancyForceGenerator);
});