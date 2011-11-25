/**
 * @fileOverview Collision detection sub system
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0
 */
 
/**
 * @class Bounding volume base class
 * @constructor
 * @since 0.0.0
 */
function BoundingVolume() {
}

/**
 * @class A bounding sphere 
 * @constructor
 * @extends BoundingVolume
 * @param {Vector2} center Center of the sphere
 * @param {float} radius Radius of the sphere
 * @since 0.0.0
 */
function BoundingSphere(center, radius) {
	
	/** 
	 * Center of the sphere
	 * @field 
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.center = center || undefined;
	
	/** 
	 * Radius of the sphere
	 * @field 
	 * @type float
	 * @default 0.0
	 * @since 0.0.0
	 */
	this.radius = radius || 0.0;
	
	/**
	 * Determines if the bounding sphere overlaps with the supplied bounding
	 * sphere
	 * @function
	 * @param {BoundingSphere} o The other sphere to test
	 * @returns {boolean} True if this overlaps with the supplied bounding 
	 *  sphere
	 * @since 0.0.0
	 */
	this.overlaps = function(o) {
		var distanceSquared = this.center.sub(
			o.center
		).getMagnitudeSquare();
		return distanceSquared < 
			(this.radius + o.radius) * (this.radius + o.radius);
	}
}
BoundingSphere.prototype = new BoundingVolume();

/**
 * Factory method to create a bounding sphere to enclose the two given bounding
 * spheres.
 * @static
 * @function
 * @param {BoundingSphere} bs1 First bounding sphere
 * @param {BoundingSphere} bs2 Second bounding sphere
 * @returns {BoundingSphere} A new bounding sphere enclosing the supplied 
 *  bounding spheres.
 * @since 0.0.0
 */
BoundingSphere.enclose = function(bs1, bs2) {
}

/**
 * @class A bounding box 
 * @constructor
 * @extends BoundingVolume
 * @param {Vector2} center Center of the sphere
 * @param {Vector2} halfSize Half size used for collision detection
 * @since 0.0.0
 */
function BoundingBox(center, halfSize) {
	
	/** 
	 * Center of the sphere
	 * @field 
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.center = center || undefined;
	
	/** 
	 * Half size used for collision detection
	 * @field 
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.halfSize = hlafSize || undefined;
}
BoundingBox.prototype = new BoundingVolume();

/**
 * @class Stores a potential contact to check later
 * @constructor
 * @param {RigidBody []} rigidBodies The rigid bodies that might be in contact
 * @since 0.0.0
 */
function PotentialContact(rigidBodies) {
	
	/** 
	 * The rigid bodies that might be in contact
	 * @field 
	 * @type RigidBody []
	 * @default undefined
	 * @since 0.0.0
	 */
	this.center = rigidBodies || undefined;
}

/**
 * @class A base class for nodes in a bounding volume hierarchy.  This class
 *  uses a binary tree to store the bounding volumes.
 * @constructor
 * @param {BVHNode []} children The child nodes
 * @param {BoundingVolume} volume Holds a single volume encompassing all the
 *  descendents of this node.
 * @param {RigidBody} rigidBody Holds the rigid body at this node of the 
 *  hierarchy. Only leaf nodes can have rigid body defined {@link BVHNode#isLeaf}.
 *  Note that it is possible to rewrite the algorithms in this class to handle 
 *  objects at all levels of the hierarchy, but the code provided ignores this 
 *  vector unless firstChild is undefined.
 * @since 0.0.0
 */
function BVHNode(children, volume, rigidBody) {
	
	/** 
	 * The child nodes
	 * @field 
	 * @type BVHNode []
	 * @default undefined
	 * @since 0.0.0
	 */
	this.children = children || undefined;
	
	/** 
	 * Holds a single volume encompassing all the descendents of this node.
	 * @field 
	 * @type BoundingVolume
	 * @default undefined
	 * @since 0.0.0
	 */
	this.volume = volume || undefined;
	
	/** 
	 * Holds the rigid body at this node of the 
	 * hierarchy. Only leaf nodes can have rigid body defined {@link BVHNode#isLeaf}.
	 * Note that it is possible to rewrite the algorithms in this class to handle 
	 * objects at all levels of the hierarchy, but the code provided ignores this 
	 * vector unless firstChild is undefined.
	 * @field 
	 * @type RigidBody
	 * @default undefined
	 * @since 0.0.0
	 */
	this.rigidBody = rigidBody || undefined;
	
	/**
	 * Determines if this node is at the bottom of the hierarchy
	 * @function
	 * @returns {boolean} True if this node is at the bottom of the hierarchy
	 * @since 0.0.0
	 */
	this.isLeaf = function() {
		return (body != undefined);
	}
	
	/**
	 * Inserts the given rigid body, with the given bounding volume,
	 * into the hierarchy. This may involve the creation of
	 * further bounding volume nodes.
	 * @function
	 * @param {RigidBody} rigidBody The rigid body to add
	 * @param {BoundingVolume} volume The type of volume to add
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.insert = function(rigidBody, volume) {
		// If we are a leaf, then the only option is to spawn two
		// new children and place the new body in one.
		if (this.isLeaf()) {
			this.children[0] = new BVHNode(
				this, this.volume, rigidBody
			);
			
			this.children[1] = new BVHNode(
				this, volume, rigidBody
			);
			
			this.rigidBody = undefined;
			this.recalculateBoundingVolume();
		} else {
			// Otherwise we need to work out which child gets to keep
			// the inserted body. We give it to whoever would grow the
			// least to incorporate it.
			if (this.children[0].volume.getGrowth(volume) <
				this.children[1].volume.getGrowth(volume)) {
				this.children[0].insert(rigidBody, volume);
			} else {
				this.children[1].insert(rigidBody, volume);
			} // if
		} // if
	}
	
	/**
 	 * Deletes this node, removing it first from the hierarchy, along
	 * with its associated rigid body and child nodes. This method
	 * deletes the node and all its children (but obviously not the
	 * rigid bodies). This also has the effect of deleting the sibling
	 * of this node, and changing the parent node so that it contains
	 * the data currently in that sibling. Finally it forces the
	 * hierarchy above the current node to reconsider its bounding
	 * volume.
	 * @function
	 * @returns {void}
	 * @since 0.0.0
	 */
	this.remove = function() {
		// If we don't have a parent, then we ignore the sibling processing.
		if (this.parent) {
			var sibling = undefined;
			if (this.parent.children[0] === this) {
				sibling = this.parent.children[1];
			} else {
				sibling = this.parent.children[0];
			} // if
			
			this.parent.volume = sibling.volume;
			this.parent.rigidBody = sibling.rigidBody;
			this.parent.children[0] = sibling.children[0];
			this.parent.children[1] = sibling.children[1];
			
			sibling.parent = undefined;
			sibling.rigidBody = undefined;
			sibling.children[0] = undefined;
			sibling.children[1] = undefined;
			sibling.remove();
			
			this.parent.recalculateBoundingVolume();
		} // if
		
		if (this.children[0]) {
			this.children[0].parent = undefined;
			this.children[0].remove();
		} // if
		
		if (this.children[1]) {
			this.children[1].parent = undefined;
			this.children[1].remove();
		} // if
	}
	
	/**
	 * Checks the potential contacts from this node downward in
	 * the hierarchy, writing them to the given array (up to the
	 * given limit). Returns the number of potential contacts it
	 * found.
	 * @function
	 * @param {PotentialContact []} potentialContacts The array to append to
	 * @param {int} limit The maximum number of contacts that may be generated
	 * @returns {int} Number of potential contacts found
	 * @since 0.0.0
	 */
	this.getPotentialContacts = function(potentialContacts, limit) {
		if (this.isLeaf() || limit == 0) {
			return 0;
		} // if
		
		return this.children[0].getPotentialContactsWith(
			this.children[1], potentialContacts, limit
		);
	}
	
	/**
	 * Gets potential contacts between this node and the supplied node.
	 * @function
	 * @param {BVHNode} o The other node to use
	 * @param {PotentialContact []} potentialContacts The array to append to
	 * @param {int} limit The maximum number of contacts that may be generated
	 * @returns {int} Number of potential contacts found
	 * @since 0.0.0
	 */
	this.getPotentialContactsWith = function(o, potentialContacts, limit) {
		if (!this.overlaps(o) || limit == 0) {
			return 0;
		} // if
		
		if (this.isLeaf() && o.isLeaf()) {
			var potentialContact = new PotentialContact([
				this.rigidBody, o.rigidBody
			]);
			this.potentialContacts.push(potentialContact);
			return 1;
		} // if
		
		// Determine which node to descend into. If either is
		// a leaf, then we descend the other. If both are branches,
		// then we use the one with the largest size.
		if (o.isLeaf() || 
		  (!this.isLeaf() && this.volume.getSize() >= o.volume.getSize())) {
			// recurse onto self
			var count = this.children[0].getPotentialContactsWith(
				o, potentialContacts, limit
			);
			
			if (limit > count) {
				return count + this.children[1].getPotentialContactsWith(
					o, potentialContacts, limit
				);
			} else {
				return count;
			} // if
		} else {
			// recurse onto other
			var count = o.children[0].getPotentialContactsWith(
				o, potentialContacts, limit
			);
			
			if (limit > count) {
				return count + o.children[1].getPotentialContactsWith(
					o, potentialContacts, limit
				);
			} else {
				return count;
			} // if
		} // if
	}
	
	/**
	 * Checks if this node overlaps with the supplied node
	 * @function
	 * @param {BVHNode} o The other node to use
	 * @returns {boolean} True if this node overlaps with the supplied node
	 * @since 0.0.0
	 */
	this.overlaps = function(o) {
		return this.volume.overlaps(o.volume);
	}
}

/**
 * @class BSP collision plane
 * @constructor
 * @param {Vector2} position Any position on the plane
 * @param {Vector2} direction The direction perpendicular to the plane
 * @since 0.0.0
 */
function Plane2(position, direction) {
	
	/** 
	 * Any position on the plane
	 * @field 
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.position = position || undefined;
	
	/** 
	 * The direction perpendicular to the plane, this should be a normalized
	 * vector
	 * @field 
	 * @type Vector2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.direction = direction || undefined;
}

/**
 * @class BSP collision node
 * @constructor
 * @param {Plane2} plane Collision plane
 * @param {BSPNode2} front Node in front of the plane
 * @param {BSPNode2} black Node behind the plane
 * @since 0.0.0
 */
function BSPNode2(plane, front, back) {
	
	/** 
	 * Collision plane
	 * @field 
	 * @type Plane2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.plane = plane || undefined;
	
	/** 
	 * Node in front of the plane
	 * @field 
	 * @type BSPNode2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.front = front || undefined;
	
	/** 
	 * Node behind the plane
	 * @field 
	 * @type BSPNode2
	 * @default undefined
	 * @since 0.0.0
	 */
	this.back = back || undefined;
}