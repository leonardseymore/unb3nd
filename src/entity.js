/**
 * @fileOverview Entity management
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */
 
 /**
 * @class Boundary action base class
 * @constructor

 */
function BoundaryAction() {

	/**
	 * Apply this boundary action to the supplied entity
	 * @function
	 * @param {Entity} entity The entity to apply this behaviour to
	 * @returns {void}

	 */
	this.update = function(entity) {
	}
}

/**
 * @class Boundary bounce action
 * @constructor
 * @extends BoundaryAction

 */
function BoundaryBounce() {

	/**
	 * Apply this boundary action to the supplied entity
	 * @function
	 * @override
	 * @param {Entity} entity The entity to apply this behaviour to
	 * @returns {void}

	 */
	this.update = function(entity) {
		var rect = entity.boundingBox;
		if (entity.pos[0] < rect.pos[0]) {
			entity.pos[0] = rect.pos[0];
			entity.vel[0] = -entity.vel[0];
		} // if
		
		if (entity.pos[0] + entity.width > rect.pos[0] + rect.width) {
			entity.pos[0] = rect.pos[0] + rect.width - entity.width;
			entity.vel[0] = -entity.vel[0];
		} // if
		
		if (entity.pos[1] < rect.pos[1]) {
			entity.pos[1] = rect.pos[1];
			entity.vel[1] = -entity.vel[1];
		} // if
		
		if (entity.pos[1] + entity.height > rect.pos[1] + rect.height) {
			entity.pos[1] = rect.pos[1] + rect.height - entity.height;
			entity.vel[1] = -entity.vel[1];
		} // if
	}

}
BoundaryBounce.prototype = new BoundaryAction();
/**
 * Singleton instance used to share this action between entities
 * @field
 * @static
 * @type BoundaryBounce

 */
BoundaryBounce.instance = new BoundaryBounce();

/**
 * @class Boundary wrap action
 * @constructor
 * @extends BoundaryAction

 */
function BoundaryWrap() {

	/**
	 * Apply this boundary action to the supplied entity
	 * @function
	 * @override
	 * @param {Entity} entity The entity to apply this behaviour to
	 * @returns {void}

	 */
	this.update = function(entity) {
		var rect = entity.boundingBox;
		if (entity.pos[0] + entity.width < rect.pos[0]) {
			entity.pos[0] = rect.pos[0] + rect.width;
		} // if
		
		if (entity.pos[0] > rect.pos[0] + rect.width) {
			entity.pos[0] = rect.pos[0] - entity.width;
		} // if
		
		if (entity.pos[1] + entity.height < rect.pos[1]) {
			entity.pos[1] = rect.pos[1] + rect.height;
		} // if
		
		if (entity.pos[1] > rect.pos[1] + rect.height) {
			entity.pos[1] = rect.pos[1] - entity.height;
		} // if
	}

}
BoundaryWrap.prototype = new BoundaryAction();
/**
 * Singleton instance used to share this action between entities
 * @field
 * @static
 * @type BoundaryBounce

 */
BoundaryWrap.instance = new BoundaryWrap();

/**
 * @class Boundary die action
 * @constructor
 * @extends BoundaryAction

 */
function BoundaryDie() {

	/**
	 * Apply this boundary action to the supplied entity
	 * @function
	 * @override
	 * @param {Entity} entity The entity to apply this behaviour to
	 * @returns {void}

	 */
	this.update = function(entity) {
		var rect = entity.boundingBox;
		if (entity.pos[0] < rect.pos[0] ||
			entity.pos[0] + entity.width > rect.pos[0] + rect.width ||
			entity.pos[1] < rect.pos[1] ||
			entity.pos[1] + entity.height > rect.pos[1] + rect.height) {
			entity.alive = false;
		} // if
	}

}
BoundaryDie.prototype = new BoundaryAction();
/**
 * Singleton instance used to share this action between entities
 * @field
 * @static
 * @type BoundaryBounce

 */
BoundaryDie.instance = new BoundaryDie();
 
/**
 * @class Sprite is responsible for drawing a sprite sheet
 * @constructor
 * @param {imgNam} The image name

 */
function Sprite(imgNam) {

	/**
	 * Special 'this' reference for inner function callbacks
	 * @field
	 * @type Sprite
	 * @default this

	 */
	var self = this;
	
	/**
	 * Image of this sprite 
	 * @field 
	 * @type Image
	 * @default Resources loader {@link Resources#loadImage}

	 */
	this.image = Resources.loadImage(name);
	
	/**
	 * Width of this sprite
	 * @field 
	 * @type int
	 * @default 0

	 */
	this.width = 0;
	
	/**
	 * Height of this sprite
	 * @field 
	 * @type int
	 * @default 0

	 */
	this.height = 0;
	
	/**
	 * Draw this sprite. No transforms applied in draw method
	 * @function
	 * @returns {void}

	 */
	this.draw = function() {
		ctx.drawImage(this.image, 0, 0);
	}
}

 /**
 * @class Game entity having spacial and physical properties
 * @constructor
 * @param {Sprite} sprite The renderable presentation of this entity

 */
function Entity(sprite) {

	/**
	 * Flag to indicate if entity is alive
	 * @field 
	 * @type boolean
	 * @default true

	 */
	this.alive = true;
	
	/**
	 * Entity width
	 * @field 
	 * @type int
	 * @default 16

	 */
	this.width = 16;
	
	/**
	 * Entity height
	 * @field 
	 * @type int
	 * @default 16

	 */
	this.height = 16;
	
	/**
	 * Entity position
	 * @field 
	 * @type Vector2
	 * @default Zero vector

	 */
	this.pos = math.v2.create();
	
	/**
	 * Entity velocity
	 * @field 
	 * @type Vector2
	 * @default Zero vector

	 */
	this.vel = math.v2.create();

	/**
	 * Bounding box 
	 * @field 
	 * @type Rectangle
	 * @default {@link windowRect}

	 */
	this.boundingBox = windowRect;
	
	/**
	 * Action to perform when boundary is breached
	 * @field 
	 * @type BoundaryAction
	 * @default {@link BoundaryBounce#instance}

	 */
	this.boundingCollisionAction = BoundaryBounce.instance;

	/**
	 * Angle in radians
	 * @field
	 * @type float
	 * @default 0.0

	 */
	this.angle = 0.0;
	
	/**
	 * Angular velocity in radians
	 * @field
	 * @type float
	 * @default Math.PI

	 */
	this.anglev = Math.PI / 1; // angular velocity
	
	/**
	 * Renderable sprite
	 * @field
	 * @type Sprite
	 * @default undefined

	 */
	this.sprite = undefined;
	if (sprite) {
		this.sprite = sprite;
		
		this.width = sprite.width;
		this.height = sprite.height;
	} // if
	
	/**
	 * Gets the X-position
	 * @function
	 * @returns {float} The X position

	 */
	 this.getX = function() {
		return this.pos[0];
	 }
	 
	 /**
	 * Gets the Y-position
	 * @function
	 * @returns {float} The Y position

	 */
	 this.getY = function() {
		return this.pos[1];
	 }
		
	/**
	 * Update this entity
	 * @function
	 * @param {delta} Time delta in milliseconds
	 * @returns {void}

	 */
	this.update = function(delta) {
		var dt = delta / 1000;
		
		this.angle += this.anglev * dt;
		this.pos[0] += this.vel[0] * dt;
		this.pos[1] += this.vel[1] * dt;
		
		this.boundingCollisionAction.update(this);
	}
	
	/**
	 * Draws a placeholder for this entity
	 * @function
	 * @returns {void}

	 */
	this.drawPlaceholder = function() {
		ctx.strokeRect(0, 0, this.width, this.height);

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.width, this.height);
		ctx.moveTo(this.width, 0);
		ctx.lineTo(0, this.height);
		ctx.stroke();
	}
	
	/**
	 * Draw this entity
	 * @function
	 * @returns {void}

	 */
	this.draw = function() {
		ctx.save();	
		ctx.translate(this.pos[0], this.pos[1]);
		ctx.rotate(this.angle);
		if (this.sprite) {
			this.sprite.draw();
		} else {
			this.drawPlaceholder();
		} // if

		ctx.restore();
	}
}

/**
 * @class Game entity manager responsible for handling multiple entities
 * @constructor

 */
function EntityManager() {

	/**
	 * All managed entities
	 * @field
	 * @type Entity []
	 * @default []

	 */
	this.entities = [];
	
	/**
	 * Add a new entity to be managed
	 * @function
	 * @param {Entity} entity The entity to add
	 * @returns {int} Number of managed entities

	 */
	this.addEntity = function(entity) {
		if (debug) {
			console.debug("Adding new managed entity");
		} // if
		
		return this.entities.push(entity);
	}
	
	/**
	 * Remove a managed entity at the specified index
	 * @function
	 * @param {index} The index of the entity
	 * @returns {Entity} The removed entity

	 */
	this.removeEntityAtIndex = function(index) {
		if (debug) {
			console.debug("Removing managed entity");
		} // if
		return this.entities.splice(index, 1);
	}
	
	/**
	 * Updates all game entities
	 * @function
	 * @param {int} delta Delta time in milliseconds
	 * @returns {void}

	 */
	this.update = function(delta) {
		for (i in this.entities) {
			var entity = this.entities[i];
			entity.update(delta);
			if (!entity.alive) {
				this.removeEntityAtIndex(i);
			} // if
		} // for
	}
	
	/**
	 * Draw all game entities
	 * @function
	 * @returns {void}

	 */
	this.draw = function() {
		for (i in this.entities) {
			var entity = this.entities[i];
			entity.draw();
		} // for
	}
}