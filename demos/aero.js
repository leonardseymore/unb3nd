/**
 * @fileOverview Aero rigid body sample
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.3
 */

/**
 * Globals
 */
ppm = 5;
FPS = 64;

/**
 * @global Vector2
 * Last mouse move screen planePosition
 */
var lastMouseMoveScreen = new Vector2();

/**
 * @global Vector2
 * Last mouse move world planePosition
 */
var lastMouseMoveWorld = new Vector2();

/**
 * @eventHandler
  * Mouse move handler
 */
engine.addEventListener("mousemove", function(e) {
	var x = e.offsetX;
	var y = e.offsetY;

	lastMouseMoveScreen.x = x;
	lastMouseMoveScreen.y = y;

  lastMouseMoveWorld.x = x;
  lastMouseMoveWorld.y = Y(y);

	renderGame();
});

/**
 * @eventHandler
 * Mouse wheel handler
 */
engine.addEventListener("mousewheel", function(e) {
  if (e.wheelDelta > 0) {
    ppm *= 2;
  } else {
    ppm /= 2;
  } // if
  renderGame();
});

/**
 * Plane
 * @field
 * @type RigidBody
 * @default undefined
 * @since 0.0.0.3
 */
var plane = undefined;
var wind = new Vector2();
var baseTensor = new Matrix2();
var minTensor = new Matrix2();
var maxTensor = new Matrix2();
var controlPos = new Vector2();
var planePos = new Vector2();
var planeStructure = [
  new Vector3(0, 0),
  new Vector3(20, 0),
  new Vector3(0, 5)
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

   bind("change", planePos, "x", document.getElementById("txtPlanePosX"), "value", false, Number);
   bind("change", planePos, "y", document.getElementById("txtPlanePosY"), "value", false, Number);
   bind("change", controlPos, "x", document.getElementById("txtControlPosX"), "value", false, Number);
   bind("change", controlPos, "y", document.getElementById("txtControlPosY"), "value", false, Number);
   bind("change", wind, "x", document.getElementById("txtWindX"), "value", false, Number);
   bind("change", wind, "y", document.getElementById("txtWindY"), "value", false, Number);
   bind("change", baseTensor.e, "0", document.getElementById("txtTensor1"), "value", false, Number);
   bind("change", baseTensor.e, "1", document.getElementById("txtTensor2"), "value", false, Number);
   bind("change", baseTensor.e, "2", document.getElementById("txtTensor3"), "value", false, Number);
   bind("change", baseTensor.e, "3", document.getElementById("txtTensor4"), "value", false, Number);

   plane = new RigidBody(1, 1);
   plane.pos = planePos;
   plane.angularDamping = 0.5;
   plane.calculateDerivedData();

   rigidBodyWorld.addRigidBody(plane);
   var aeroForceGenerator = new AeroControlForceGenerator(baseTensor, minTensor, maxTensor, controlPos, wind);
   rigidBodyWorld.forceRegistry.add(plane, aeroForceGenerator);

   ForceGeneratorFactory.createGravity(
     rigidBodyWorld.forceRegistry, plane
   );

   renderGame();
   for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
     var input = document.getElementsByTagName("input").item(i);
     input.onchange = function() {
       plane.calculateDerivedData();
       renderGame();
     };
   }
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

  var t1 = window(plane.getPointInWorldSpace(planeStructure[0]));
  var t2 = window(plane.getPointInWorldSpace(planeStructure[1]));
  var t3 = window(plane.getPointInWorldSpace(planeStructure[2]));

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.lineTo(t3.x, t3.y);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  Renderer.instance.renderWorld(rigidBodyWorld);

  if (debug) {
    ctx.fillText("Global Forces: " + rigidBodyWorld.globalForceGenerators, 10, Y(80));
    ctx.fillText("Num Rigid Bodies: " + rigidBodyWorld.rigidBodies.length, 10, Y(70));
    ctx.fillText("Num Force Generators: " + rigidBodyWorld.forceRegistry.entries.length, 10, Y(60));
    ctx.fillText("Mouse Screen: (" + lastMouseMoveScreen.x + "," + lastMouseMoveScreen.y + ")", 10, Y(50));
    ctx.fillText("Mouse World: (" + lastMouseMoveWorld.x + "," + lastMouseMoveWorld.y + ")", 10, Y(40));
    ctx.fillText("Pixels Per Meter: " + ppm, 10, Y(30));
    ctx.fillText("FPS: " + avgFps, 10, Y(20));
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.translate(10, Y(10));

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -3);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ppm, 0);
    ctx.lineTo(ppm, -3);
    ctx.stroke();
    ctx.restore();

    ctx.moveTo(0, 0);
    ctx.lineTo(ppm, 0);
    ctx.stroke();
    ctx.restore();
  } // if

}

/**
 * Stop the game
 * @function
 * @returns {void}
 * @since 0.0.0.3
 */
function stopGame() {

}