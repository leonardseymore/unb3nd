/**
 * @fileOverview Resource managers / helpers
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

/** 
 * @class Resources loader
 * @constructor

 */
function Resources() {
}

/** 
 * Resources configuration must be configured per application to be able 
 * to locate resources.
 * @field
 * @static
 * @type Object
 * @default Fully initialized static

 */
Resources.configuration = {
	ROOT_PATH : "../",
	IMG_PATH : "../img/"
};

/**
 * Loads an image resource from name
 * TODO: An idea is to later combine all images into a sprite sheet and this method
 *       could possibly retrieve it from the spritesheet rather than file.
 * @function
 * @static
 * @param {string} name The name of the image to load
 * @return {Image} The loaded image

 * @see Resources#configuration
 */
Resources.loadImage = function(name) {
	var image = new Image();
	image.src = Resources.configuration.IMG_PATH + name;
	return image;
}