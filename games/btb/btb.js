/**
 * @fileOverview Bub the Blub Game
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/*
 * Configure globals
 */
DEFAULT_GRAVITATIONAL_CONSTANT = -100;
DEFAULT_DRAG_VELOCITY_COEFF = 0.5;
DEFAULT_DRAG_VELOCITY_SQUARED_COEFF = 0.05;
DEFAULT_COLLISION_RESTITUTION = 0.4;
 
/**
 * Particle world
 * @public
 * @field
 * @type ParticleWorld
 * @default undefined
 * @since 0.0.0
 */
var particleWorld;
 
/**
 * Bub
 * @public
 * @field
 * @type Particle
 * @default undefined
 * @since 0.0.0
 */
var bub;

/**
 * Initialize game elements here
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function initGame() {
	particleWorld = new ParticleWorld(
		PARTICLE_WORLD_ALL
	);
	
	bub = new Particle(5);
	bub.pos.x = 100;
	bub.pos.y = 100;
	particleWorld.addEventListener("contact", function(e) {
		bub.pos.y = 100;
	});
	particleWorld.addParticle(bub);
}
 
/**
 * Start game
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function startGame() {
	
}
 
/**
 * Update all game elements
 * @function
 * @param {int} delta Delta time since last update
 * @returns {void}
 * @since 0.0.0
 */
function updateGame(delta) {
	particleWorld.update(delta);
}

/**
 * Render a single frame
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function renderGame() {
	ctx.clearRect(0, 0, windowRect.width, windowRect.height);
	particleWorld.draw();
}

/**
 * Stop the game
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function stopGame() {

}