/****************************
 * Game implementation
 * Demonstrates the EntityManager
 ****************************/

/**
 * @class Mouse game implementation
 * @extends Engine
 * @since 0.0.0.4
 */
function EntityManagerGame() {

  /**
   * Super constructor
   */
  Engine.call(this);

  /**
   * @field Application icon 16x16
   * @type Image
   * @since 0.0.0.4
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
  this.initGame = function () {
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
  };

  /**
   * @function
   * Initialize game start here
   * @return void
   */
  this.startGame = function () {
    entityManager = new EntityManager();
  };

  /**
   * @function
   * Update all game elements
   * @param {Number} delta Delta time since last update
   * @return void
   */
  this.updateGame = function (delta) {
    entityManager.update(delta);
  };

  /**
   * @function
   * Render a single frame
   * @return void
   */
  this.renderGame = function () {
    var ctx = this.ctx;
    var canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(20, 0);
    ctx.rotate(Math.PI / 4);
    ctx.drawImage(appIcon16, 5, 5);
    ctx.fillText("fps: " + fps, 5 + 16 + 2, 15);
    ctx.restore();

    entityManager.draw();
  };
}
EntityManagerGame.prototype = new Engine();
EngineInstance = new EntityManagerGame();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    EngineInstance.engineInit();
  } // if
};
