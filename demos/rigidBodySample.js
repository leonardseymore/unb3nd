/**
 * @fileOverview Simple rigid body sample
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.3
 */

/**
 * Globals
 */
FPS = 64;

/**
 * Rigid bodies
 * @field
 * @type RigidBody []
 * @default 10
 * @since 0.0.0.3
 */
var rigidBodies = [];
var rigidBodyStructure = [
  new Vector3(0, 0, 1),
  new Vector3(-25, 50, 1),
  new Vector3(25, 50, 1)
];

/**
 * Simulated world
 * @field
 * @type World
 * @default undefined
 * @since 0.0.0.3
 */
var rigidBodyWorld = undefined;
 
 /**
  * Initialize game elements here
  * @function
  * @returns {void}
  * @since 0.0.0.3
  */
 function initGame() {
	 rigidBodyWorld = new World();

   initRigidBody(0, 1, 5, 50, 25);
   initRigidBody(1, 1, 500, 150, 150);
   initRigidBody(2, 0, 1000, 200, 300);

   for (var i in rigidBodies) {
     var rigidBody = rigidBodies[i];
     rigidBodyWorld.addRigidBody(rigidBody);
   } // for

   ForceGeneratorFactory.createGravity(
     rigidBodyWorld.forceRegistry, rigidBodies[1]
   );
   ForceGeneratorFactory.createGravity(
     rigidBodyWorld.forceRegistry, rigidBodies[0]
   );

   ForceGeneratorFactory.createSpring(
     rigidBodyWorld.forceRegistry, rigidBodies[0], new unb3nd.Vector2(0, 10),
     rigidBodies[1], new unb3nd.Vector2(0, 0),
     0.05, 1);

   ForceGeneratorFactory.createSpring(
     rigidBodyWorld.forceRegistry, rigidBodies[1], new unb3nd.Vector2(0, 40),
     rigidBodies[2], new unb3nd.Vector2(0, 50),
     0.5, 0.1);

   renderGame();
 }

/**
 * Initializes the rigid body
 * @function
 * @param {int} index The index of the rigid body to initialize
 * @param {float} mass The mass to use
 * @param {float} inertia The inertia to use
 * @param {float} x The x position of the body
 * @param {float} y The y position of the body
 * @returns {void}
 * @since 0.0.0.3
 */
function initRigidBody(index, mass, inertia, x, y) {
  rigidBodies[index] = new RigidBody(mass, inertia);
  rigidBodies[index].pos.x = x;
  rigidBodies[index].pos.y = y;
  rigidBodies[index].angularDamping = 0.5;
  rigidBodies[index].calculateDerivedData();
}
 
 /**
  * Start game
  * @function
  * @returns {void}
  * @since 0.0.0.3
  */
 function startGame() {
	
 }
 
/**
 * Update all game elements
 * @function
 * @param {int} delta Delta time since last update
 * @returns {void}
 * @since 0.0.0.3
 */
function updateGame(delta) {
	rigidBodyWorld.update(delta);
}

/**
 * Render a single frame
 * @function
 * @returns {void}
 * @since 0.0.0.3
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRigidBody(rigidBodies[0], "green");
  drawRigidBody(rigidBodies[1], "red");
  drawRigidBody(rigidBodies[2], "blue");

  Renderer.instance.renderWorld(rigidBodyWorld);

  ctx.fillText("FPS: " + avgFps, 10, Y(10));
}

/**
 * Draws the rigid body
 * @function
 * @param {RigidBody} rigidBody The rigid body to draw
 * @param {String} strokeStyle The style to use
 * @returns {void}
 * @since 0.0.0.3
 */
function drawRigidBody(rigidBody, strokeStyle) {
  var t1 = window(rigidBody.getPointInWorldSpace(rigidBodyStructure[0]));
  var t2 = window(rigidBody.getPointInWorldSpace(rigidBodyStructure[1]));
  var t3 = window(rigidBody.getPointInWorldSpace(rigidBodyStructure[2]));

  ctx.save();
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(t3.x, t3.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

/**
 * Stop the game
 * @function
 * @returns {void}
 * @since 0.0.0.3
 */
function stopGame() {

}