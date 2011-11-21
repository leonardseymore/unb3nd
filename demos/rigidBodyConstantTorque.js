/**
 * @fileOverview Simple rigid bodies under gravity demo
 * @author <a href="mailto:leonard.seymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */

/**
 * Number of rigid bodies
 * @field
 * @type int
 * @default 10
 * @since 0.0.0
 */
var NUM_RIGID_BODIES = 10;

/**
 * Simulated world
 * @field
 * @type World
 * @default undefined
 * @since 0.0.0
 */
var world = undefined;
 
 /**
  * Initialize game elements here
  * @function
  * @returns {void}
  * @since 0.0.0
  */
 function initGame() {
	world = new World();
	
	var mass = 1;
	var inertia = 5;
	
	for (var i = 0; i < NUM_RIGID_BODIES; i++) {
		var rigidBody = new RigidBody(mass, inertia);
		rigidBody.angularDamping = 0.9;
		rigidBody.pos.x = Math.random() * canvas.width;
		rigidBody.pos.y = Math.random() * canvas.height;
		ForceGeneratorFactory.createConstantTorque(world.forceRegistry, rigidBody, Math.random() * 5);
		world.addRigidBody(rigidBody);
	} // for
	
	renderGame();
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
	world.update(delta);
}

/**
 * Render a single frame
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	world.draw();
}

/**
 * Stop the game
 * @function
 * @returns {void}
 * @since 0.0.0
 */
function stopGame() {

}