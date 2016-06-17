"use strict";

module("Mass Aggregate Physics");

test("Test Particle", function () {
  var uid = Particle.nextUid;
  var p1 = new Particle();
  equal(uid, p1.uid);

  var TOL = 0.1;
  var pos = math.v2.create([1, 2]);
  p1.pos = math.v2.create(pos);
  var point = math.v2.create([2, 3]);
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

  var f1 = math.v2.create([1, 1]);
  var oldAccum = math.v2.create(p1.forceAccum);
  p1.applyForce(f1);
  equal(p1.forceAccum[0], oldAccum[0] + f1[0]);
  equal(p1.forceAccum[1], oldAccum[1] + f1[1]);

  p1.clearForceAccum();
  equal(p1.forceAccum[0], 0);
  equal(p1.forceAccum[1], 0);

  p1.applyForce(f1);
  p1.integrate(1000);
  equal(p1.vel[0], f1[0] * p1.inverseMass);
  equal(p1.vel[1], f1[1] * p1.inverseMass);
});

test("Test ParticleForceRegistry", function () {
  var reg = new ParticleForceRegistry();
  equal(reg.entries.length, 0, "Initial registry size");

  var p1 = new Particle();
  p1.setMass(5);
  var fg1 = new ParticleGravityForceGenerator();
  reg.add(p1, fg1);
  equal(reg.entries.length, 1, "New registry size");
  equal(reg.getForceGenerators(p1)[0], fg1, "Test force insertion point");

  reg.removeForceGenerators(p1);
  equal(reg.getForceGenerators(p1), undefined, "Removed force");

  reg.add(p1, fg1);
  equal(reg.getForceGenerators(p1)[0], fg1, "Added force");
  reg.removeForceGenerator(fg1);
  equal(reg.getForceGenerators(p1).length, 0, "Removed force");

  reg.add(p1, fg1);
  equal(reg.getForceGenerators(p1)[0], fg1, "Test added force");
  equal(p1.forceAccum[0], 0, "Test force accum x");
  equal(p1.forceAccum[1], 0, "Test force accum y");

  var oldForceAccum = math.v2.create(p1.forceAccum);
  ok(math.v2.equals(p1.forceAccum, oldForceAccum), "Force accum before 1 second");
  reg.applyForces(1000);
  ok(!math.v2.equals(p1.forceAccum, oldForceAccum), "Force accum after 1 second");
});

test("Test ParticleForceGenerators - Gravity", function () {
  var p1 = new Particle();
  p1.setMass(1);
  var gf1 = new ParticleGravityForceGenerator();
  var oldForceAccum = math.v2.create(p1.forceAccum);
  ok(math.v2.equals(p1.forceAccum, oldForceAccum), "Cloned accum same");
  gf1.applyForce(p1, 1000);
  notDeepEqual(p1.forceAccum, oldForceAccum);
  var fd = math.v2.sub(p1.forceAccum, oldForceAccum); // fd ~ forceDelta
  deepEqual(fd, gf1.gravitation);
});

test("Test ParticleForceGenerators - Drag", function () {
  var p1 = new Particle();
  p1.setMass(1);
  var k1 = 1;
  var k2 = 2;
  var fg = new ParticleDragForceGenerator(k1, k2);
  var oldForceAccum = math.v2.create(p1.forceAccum);
  deepEqual(p1.forceAccum, oldForceAccum);
  p1.vel.x = 10;
  fg.applyForce(p1, 1000);

  var dragCoeff = math.v2.getMagnitude(p1.vel);
  dragCoeff = k1 * dragCoeff + k2 * dragCoeff * dragCoeff;
  var fd = math.v2.normalize(p1.vel); // fd ~ forceDelta
  math.v2.multScalarMutate(fd, -dragCoeff);

  deepEqual(fd, p1.forceAccum);
});

test("Test ParticleForceGenerators - Spring", function () {
  var p1 = new Particle();
  p1.setMass(1);
  p1.pos[0] = 9;
  p1.pos[1] = 12;

  var p2 = new Particle();
  p2.setMass(5);

  var springConstant = 1;
  var restLength = 10;
  var fg = new ParticleSpringForceGenerator(p2, springConstant, restLength);

  var oldForceAccum = math.v2.create(p1.forceAccum);
  deepEqual(p1.forceAccum, oldForceAccum);
  fg.applyForce(p1, 1000);

  var fd = math.v2.create(p1.pos); // fd ~ forceDelta
  math.v2.subMutate(fd, p2.pos);

  var magnitude = math.v2.getMagnitude(fd);
  magnitude = Math.abs(magnitude - restLength);
  magnitude *= springConstant;

  math.v2.normalizeMutate(fd);
  math.v2.multScalarMutate(fd, -magnitude);

  deepEqual(fd, p1.forceAccum);
});

test("Test ParticleForceGenerators - Anchored Spring", function () {
  var p1 = new Particle();
  p1.setMass(1);
  p1.pos.x = 9;
  p1.pos.y = 12;

  var anchor = math.v2.create();

  var springConstant = 1;
  var restLength = 10;
  var fg = new ParticleAnchoredSpringForceGenerator(anchor, springConstant, restLength);

  var oldForceAccum = math.v2.create(p1.forceAccum);
  deepEqual(p1.forceAccum, oldForceAccum);
  fg.applyForce(p1, 1000);

  var fd = math.v2.create(p1.pos); // fd ~ forceDelta
  math.v2.subMutate(fd, anchor);

  var magnitude = math.v2.getMagnitude(fd);
  magnitude = Math.abs(magnitude - restLength);
  magnitude *= springConstant;

  math.v2.normalizeMutate(fd);
  math.v2.multScalarMutate(fd, -magnitude);

  deepEqual(fd, p1.forceAccum);
});

test("Test ParticleForceGenerators - Bungee", function () {
  var p1 = new Particle();
  p1.setMass(1);
  p1.pos[0] = 9;
  p1.pos[1] = 12;

  var p2 = new Particle();
  p2.setMass(5);

  var springConstant = 1;
  var restLength = 20;
  var fg = new ParticleBungeeForceGenerator(p2, springConstant, restLength);

  var oldForceAccum = math.v2.create(p1.forceAccum);
  deepEqual(p1.forceAccum, oldForceAccum);
  fg.applyForce(p1, 1000);

  var fd = math.v2.create(p1.pos); // fd ~ forceDelta
  math.v2.subMutate(fd, p2.pos);

  // make sure force is not applied if restLength <= magnitude
  var magnitude = math.v2.getMagnitude(fd);
  ok(magnitude <= restLength);
  deepEqual(p1.forceAccum, oldForceAccum);

  // make sure force is applied if magnitude > restLength
  restLength = 5;
  fg.restLength = restLength;
  fg.applyForce(p1, 1000);
  var magnitude = math.v2.getMagnitude(fd);
  ok(magnitude > restLength);
  magnitude = springConstant * (magnitude - restLength);

  math.v2.normalizeMutate(fd);
  math.v2.multScalarMutate(fd, -magnitude);
  deepEqual(fd, p1.forceAccum);
  notDeepEqual(p1.forceAccum, oldForceAccum);
});

test("Test ParticleForceGenerators - Anchored Bungee", function () {
  var p1 = new Particle();
  p1.setMass(1);
  p1.pos[0] = 9;
  p1.pos[1] = 12;

  var anchor = math.v2.create();

  var springConstant = 1;
  var restLength = 20;
  var fg = new ParticleAnchoredBungeeForceGenerator(anchor, springConstant, restLength);

  var oldForceAccum = math.v2.create(p1.forceAccum);
  deepEqual(p1.forceAccum, oldForceAccum);
  fg.applyForce(p1, 1000);

  var fd = math.v2.create(p1.pos); // fd ~ forceDelta
  math.v2.subMutate(fd, anchor);

  // make sure force is not applied if restLength <= magnitude
  var magnitude = math.v2.getMagnitude(fd);
  ok(magnitude <= restLength);
  deepEqual(p1.forceAccum, oldForceAccum);

  // make sure force is applied if magnitude > restLength
  restLength = 5;
  fg.restLength = restLength;
  fg.applyForce(p1, 1000);
  var magnitude = math.v2.getMagnitude(fd);
  ok(magnitude > restLength);
  magnitude = springConstant * (magnitude - restLength);

  math.v2.normalizeMutate(fd);
  math.v2.multScalarMutate(fd, -magnitude);
  deepEqual(fd, p1.forceAccum);
  notDeepEqual(p1.forceAccum, oldForceAccum);
});

// TODO: Buoyancy force generator needs work
test("Test ParticleForceGenerators - Buoyancy", function () {
  var p1 = new Particle();
  p1.setMass(1);
  p1.pos[0] = 9;
  p1.pos[1] = 12;

  var anchor = math.v2.create();

  var maxDepth = 10;
  var volume = 5;
  var liquidDensity = 1000;
  var fg = new ParticleBuoyancyForceGenerator(anchor, maxDepth, volume, liquidDensity);

  var oldForceAccum = math.v2.create(p1.forceAccum);
  deepEqual(p1.forceAccum, oldForceAccum);
  fg.applyForce(p1, 1000);

  var depth = anchor[1] - p1.pos[1];
  ok(depth <= -maxDepth);
  deepEqual(p1.forceAccum, oldForceAccum);

  maxDepth = -20;
  fg.maxDepth = maxDepth;
  fg.applyForce(p1, 1000);
  ok(depth > maxDepth);
  fg.applyForce(p1, 1000);
  //equal(p1.forceAccum.y, liquidDensity * volume);
});

test("Test ParticleForceGeneratorFactory", function () {
  var forceRegistry = new ParticleForceRegistry();
  equal(forceRegistry.entries.length, 0, "Initial registry size");

  var p1 = new Particle();
  ParticleForceGeneratorFactory.createGravity(forceRegistry, p1);
  equal(forceRegistry.getForceGenerators(p1).length, 1, "Size of registry after insert");
  ok(forceRegistry.getForceGenerators(p1)[0] instanceof ParticleGravityForceGenerator, "Type of newly insterted entry");

  ParticleForceGeneratorFactory.createWind(forceRegistry, p1);
  equal(forceRegistry.getForceGenerators(p1).length, 2, "Size of registry after 2nd insert");
  ok(forceRegistry.getForceGenerators(p1)[1] instanceof ParticleWindForceGenerator, "Type of 2nd insert");

  ParticleForceGeneratorFactory.createDrag(forceRegistry, p1);
  equal(forceRegistry.getForceGenerators(p1).length, 3, "Size of registry after 3rd insert");
  ok(forceRegistry.getForceGenerators(p1)[2] instanceof ParticleDragForceGenerator, "Type of 3rd insert");

  var p2 = new Particle();
  ParticleForceGeneratorFactory.createSpring(forceRegistry, p1, p2);
  equal(forceRegistry.getForceGenerators(p1).length, 4, "Size of registry after 4th insert");
  ok(forceRegistry.getForceGenerators(p1)[3] instanceof ParticleSpringForceGenerator, "Type of 4th insert");
  equal(forceRegistry.getForceGenerators(p2).length, 1, "Size of forces on particle");
  ok(forceRegistry.getForceGenerators(p2)[0] instanceof ParticleSpringForceGenerator, "Type of particle force");

  var anchor = math.v2.create();
  ParticleForceGeneratorFactory.createAnchoredSpring(forceRegistry, p1, anchor);
  equal(forceRegistry.getForceGenerators(p1).length, 5, "Size of registry after 5th insert");
  ok(forceRegistry.getForceGenerators(p1)[4] instanceof ParticleAnchoredSpringForceGenerator, "Type of particle force");

  ParticleForceGeneratorFactory.createBungee(forceRegistry, p1, p2);
  equal(forceRegistry.getForceGenerators(p1).length, 6, "Size of registry after 6th insert");
  ok(forceRegistry.getForceGenerators(p1)[5] instanceof ParticleBungeeForceGenerator, "Type of particle force");
  equal(forceRegistry.getForceGenerators(p2).length, 2, "Size of particle force list");
  ok(forceRegistry.getForceGenerators(p2)[1] instanceof ParticleBungeeForceGenerator, "Type of particle force");

  ParticleForceGeneratorFactory.createAnchoredBungee(forceRegistry, p1, anchor);
  equal(forceRegistry.getForceGenerators(p1).length, 7, "Size of registry after 7th insert");
  ok(forceRegistry.getForceGenerators(p1)[6] instanceof ParticleAnchoredBungeeForceGenerator, "Type of particle force");

  ParticleForceGeneratorFactory.createBuoyancy(forceRegistry, p1, anchor);
  equal(forceRegistry.getForceGenerators(p1).length, 8, "Size of registry after 8th insert");
  ok(forceRegistry.getForceGenerators(p1)[7] instanceof ParticleBuoyancyForceGenerator, "Type of particle force");
});