/****************************
 * Game implementation
 * Buoyancy
 ****************************/
 
/**
 * @global float
 * Water level
 */
var waterLevel;

/**
 * @global float
 * Start level
 */
var startLevel;

/**
 * @global float
 * Going down
 */
var down;
 
/**
 * @global Vector2
 * Floating anchor
 */
var anchor;

/**
 * @global Particle
 * Particle
 */
var particle;

/**
 * @global ParticleForceRegistry
 * Force registry
 */
var forceRegistry;

/**
 * @global
 * Apply spring
 */
var applyBuoyancy = false;

/**
 * @global
 * Apply gravity
 */
var applyGravity = false;

/**
 * @global ParticleForceGenerator
 * Gravity force generator
 */
var gravityForceGenerator = new ParticleGravityForceGenerator();

/**
 * @global
 * Apply drag
 */
var applyDrag = false;

/**
 * @global ParticleForceGenerator
 * Drag force generator
 */
var dragForceGenerator = new ParticleDragForceGenerator(0.1, 0.05);


/**
 * @function
 * Check force controls
 * @return void
 */
function checkForces() {
	applyBuoyancy = document.getElementById("chkBuoyancy").checked;
	applyGravity = document.getElementById("chkGravity").checked;
	applyDrag = document.getElementById("chkDrag").checked;
}

/**
 * @function
 * Initialize game elements here
 * @return void
 */
function initGame() {
	
}
 
  /**
  * @function
  * Initialize game start here
  * @return void
  */
 function startGame() {
	checkForces();
	forceRegistry = new ParticleForceRegistry();
	
	startLevel = windowRect.height / 2;
	waterLevel = startLevel;
	anchor = new Vector2(Math.random() * windowRect.width, waterLevel);
	
	particle = new Particle();
	particle.setMass(1 + Math.random() * 3);
	particle.damping = 0.995;
	particle.pos = new Vector2(anchor.x , anchor.y - 50);
	particle.vel = new Vector2(0, 0);

	ParticleForceGeneratorFactory.createBuoyancy(
		forceRegistry, particle, anchor, 5, 0.05
	);
 }
 
/**
 * @function
 * Update all game elements
 * @param int delta Delta time since last update
 * @return void
 */
function updateGame(delta) {
	var dt = delta / 1000;
	
	if (down) {
		waterLevel -= 5 * dt;
	} else {
		waterLevel += 5 * dt;
	} // if
	
	if (Math.abs(waterLevel - startLevel) > 10) {
		down = !down;
	} // if

	anchor.y = waterLevel;
		
	if (applyBuoyancy) {
		var forceGenerators = forceRegistry.getForceGenerators(particle);
		for (j in forceGenerators) {
			var forceGenerator = forceGenerators[j];
			forceGenerator.applyForce(particle);
		} // for
	} // if
	
	if (applyGravity) {
		gravityForceGenerator.applyForce(particle, delta);
	} // if
	
	if (applyDrag) {
		dragForceGenerator.applyForce(particle, delta);
	} // if
	
	particle.integrate(delta);
}

/**
 * @function
 * Render a single frame
 * @return void
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	ctx.strokeStyle = "lightGrey";
	ctx.beginPath();
	ctx.moveTo(0, waterLevel);
	ctx.lineTo(windowRect.width, waterLevel);
	ctx.stroke();
	
	var style = ctx.createLinearGradient(0,-75,0,75);
	style.addColorStop(0, '#232256');
	style.addColorStop(1, '#143778');
	ctx.fillStyle = style;
	ctx.fillRect(0, 0, windowRect.width, waterLevel);

	anchor.drawPoint();
	
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.moveTo(anchor.x, anchor.y);
	ctx.lineTo(particle.pos.x, particle.pos.y);
	ctx.stroke();
	
	particle.draw();
	
	ctx.fillStyle = "white";
	ctx.fillText("Buoyancy: " + applyBuoyancy, 10, 10);
	ctx.fillText("Gravity: " + applyGravity, 10, 20);
	ctx.fillText("Drag: " + applyDrag, 10, 30);
	ctx.restore();
}

/**
 * @function
 * Stop the game
 * @return void
 */
function stopGame() {
	ctx.save();
	ctx.globalAlpha = 0.3;
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.globalAlpha = 1;
	
	ctx.fillStyle = "white";
	var stoppedText = "Stopped";
	ctx.fillText(stoppedText, 
		(windowRect.width - ctx.measureText(stoppedText).width) / 2, windowRect.height / 2
	);
	ctx.restore();
}