/****************************
 * Game implementation
 * Simulation - Constant Velocity
 ****************************/
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
  numParticles = document.getElementById("spnNumParticles").value;
  particles = new Array();
  for (i = 0; i < numParticles; i++) {
    var particle = new Particle();
    particle.setMass(1);
    particle.damping = 0.995;
    particle.pos = new Vector2(Math.random() * windowRect.width, Math.random() * windowRect.height);
    particle.vel = new Vector2(Math.random() * 25, Math.random() * 25);
    particles.push(particle);
  } // for
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
  ctx.save();
  for (i in particles) {
    var particle = particles[i];

    ctx.save();
    particle.pos.draw();
    ctx.fillStyle = "magenta";
    ctx.translate(particle.pos.x, particle.pos.y);
    particle.vel.draw("darkblue");
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  } // for

  ctx.restore();
  ctx.fillText("Gravity: " + applyGravity, 10, 10);
  ctx.fillText("Drag: " + applyDrag, 10, 20);
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