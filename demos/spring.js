/****************************
 * Game implementation
 * Springs
 ****************************/

/**
 * @global
 * Anchor icon
 */
var iconAnchor = new Image();
iconAnchor.src = "../img/icon_anchor_16.png";
 
/**
 * @global
 * Number of particles
 */
var numParticles;
 
/**
 * @global
 * Reference to a particles under simulation
 */
var particles;

/**
 * @global Vector2
 * Fixed point / anchor
 */
var fixedPoint;

/**
 * @global
 * Apply spring
 */
var applySpring = false;

/**
 * @global ParticleForceRegistry
 * Force registry
 */
var forceRegistry;

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
 * @global
 * Spring type spring / bungee
 */
var springType;

/**
 * @global
 * Mouse anchor to anchor the last particle to the mouse
 */
var mouseAnchor = new Vector2();

/**
 * @eventHandler
 * Mouse move handler
 */
engine.addEventListener("mousemove", function(e) {
	mouseAnchor.x = e.offsetX;
	mouseAnchor.y = Y(e.offsetY);
});

/**
 * @function
 * Check force controls
 * @return void
 */
function checkForces() {
	springType = document.getElementById("selType").value;
	applySpring = document.getElementById("chkSpring").checked;
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
	document.getElementById("selType").disabled = true;
	checkForces();
	forceRegistry = new ParticleForceRegistry();
	fixedPoint = new Vector2(windowRect.width / 2, windowRect.height / 2);
	numParticles = document.getElementById("spnNumParticles").value;
	particles = new Array();
	for (i = 0; i < numParticles; i++) {
		var particle = new Particle();
		particle.setMass(1 + Math.random() * 3);
		particle.damping = 0.995;
		particle.pos = new Vector2(Math.random() * windowRect.width , Math.random() * windowRect.height);
		particle.vel = new Vector2(Math.random() * 25, Math.random() * 25);
		particles.push(particle);
	} // for
	
	for (i in particles) {
		if (i > 0) {
			switch (springType) {
				case "spring" :
					ParticleForceGeneratorFactory.createSpring(
						forceRegistry, particles[i], particles[i - 1], 10, 2
					);
				break;
				case "bungee" :
					ParticleForceGeneratorFactory.createBungee(
						forceRegistry, particles[i], particles[i - 1], 10, 2
					);
				break;
			} // switch
		} // if
	} // for
	
	ParticleForceGeneratorFactory.createAnchoredBungee(
		forceRegistry, particles[particles.length - 1], mouseAnchor, 10, 1
	);

	switch (springType) {
		case "spring" :
			ParticleForceGeneratorFactory.createAnchoredSpring(
				forceRegistry, particles[0], fixedPoint, 5, 4
			);
		break;
		case "bungee" :
			ParticleForceGeneratorFactory.createAnchoredBungee(
				forceRegistry, particles[0], fixedPoint, 5, 4
			);
		break;
	} // switch
	
 }
 
/**
 * @function
 * Update all game elements
 * @param int delta Delta time since last update
 * @return void
 */
function updateGame(delta) {
	for (i in particles) {
		var particle = particles[i];
		
		if (applySpring) {
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
	} // for
}

/**
 * @function
 * Render a single frame
 * @return void
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (i in particles) {
		var particle = particles[i];
		
		if (i > 0) {
			ctx.beginPath();
			ctx.moveTo(particles[i - 1].pos.x, particles[i - 1].pos.y);
			ctx.lineTo(particles[i].pos.x, particles[i].pos.y);
			ctx.stroke();
		} // if
		
		ctx.save();	
		ctx.fillStyle = "lightblue";
		ctx.translate(particle.pos.x, particle.pos.y);
		ctx.fillRect(
			-particle.getMass(), -particle.getMass(), particle.getMass() * 2, particle.getMass() * 2
		);
		ctx.restore();
	} // for
	
	ctx.save();	
	ctx.fillStyle = "green";
	ctx.translate(fixedPoint.x, fixedPoint.y);
	ctx.fillRect(-1, -1, 2, 2);
	ctx.restore();
	
	ctx.save();	
		ctx.strokeStyle = "pink";
		ctx.beginPath();
		ctx.moveTo(particles[0].pos.x, particles[0].pos.y);
		ctx.lineTo(fixedPoint.x, fixedPoint.y);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(particles[particles.length - 1].pos.x, particles[particles.length - 1].pos.y);
		ctx.lineTo(mouseAnchor.x, mouseAnchor.y);
		ctx.stroke();
		
		ctx.save();
			ctx.translate(mouseAnchor.x - iconAnchor.width / 2, mouseAnchor.y - iconAnchor.height / 2);
			ctx.drawImage(iconAnchor, 0, 0);	
		ctx.restore();
	ctx.restore();
	
	ctx.fillText("Spring Force: " + applySpring, 10, 10);
	ctx.fillText("Gravity: " + applyGravity, 10, 20);
	ctx.fillText("Drag: " + applyDrag, 10, 30);
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
	document.getElementById("selType").disabled = false;
}