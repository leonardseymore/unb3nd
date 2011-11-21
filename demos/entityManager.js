/****************************
 * Game implementation
 * Demonstrates the EntityManager
 ****************************/
 
 /**
 * @global
 * Application icon 16x16
 */
var appIcon16 = Resources.loadImage("icon_16.png");
 
 /**
  * @global
  * Example entity
  */
 var entityManager;
 
 /**
  * @function
  * Initialize game elements here
  * @return void
  */
 function initGame() {
	var entity1 = new Entity();
	entity1.vel.x = 70;
	entity1.vel.y = 80;
	
	var entity2 = new Entity(new Sprite("../img/bomb.gif"));
	entity2.boundingCollisionAction = BoundaryWrap.instance;
	entity2.vel.x = 35;
	entity2.vel.y = 35;
	
	var entity3 = new Entity();
	entity3.boundingCollisionAction = BoundaryDie.instance;
	entity3.vel.x = 60;
	entity3.vel.y = 60;
	entityManager = new EntityManager();
	entityManager.addEntity(entity1);
	entityManager.addEntity(entity2);
	entityManager.addEntity(entity3);
 }
 
  /**
  * @function
  * Initialize game start here
  * @return void
  */
 function startGame() {
	
 }
 
/**
 * @function
 * Update all game elements
 * @param int delta Delta time since last update
 * @return void
 */
function updateGame(delta) {
	entityManager.update(delta);	
}

/**
 * @function
 * Render a single frame
 * @return void
 */
function renderGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(20, 0);
	ctx.rotate(Math.PI / 4);
	ctx.drawImage(appIcon16, 5, 5);
	ctx.fillText("fps: " + fps, 5 + 16 + 2, 15);
	ctx.restore();
	
	entityManager.draw();
}

/**
 * @function
 * Stop the game
 * @return void
 */
function stopGame() {
	document.title = "unb3nd";
	
	ctx.save();
	ctx.globalAlpha = 0.7;
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1.0;
	ctx.fillStyle = "#000";
	ctx.drawImage(appIcon16, 5, 5);
	ctx.fillText("stopped", 5 + 16 + 2, 15);
	ctx.restore();
}