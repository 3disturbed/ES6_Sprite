/**
 * Sprite Class - By Ben Darlington
 * 
 * A robust and slightly opinionated class for managing sprites on an HTML5 canvas.
 * Perfect for those who appreciate meticulous control over their animated graphics,
 * with just a hint of sardonic commentary to keep things interesting.
 * 
 * No dependencies. Just pure, unadulterated JavaScript.
 * 
 * Usage Example:
 * 
 * 
 * import Sprite from './Sprite.js';
 * 
 * const canvas = document.getElementById('gameCanvas');
 * const ctx = canvas.getContext('2d');
 * 
 * const sprite = new Sprite({
 *     imageSrc: 'path/to/sprite.png',
 *     frameWidth: 64,
 *     frameHeight: 64,
 *     frames: 10,
 *     frameDelay: 100, // milliseconds
 *     x: 100,
 *     y: 150,
 *     scaleFactor: 1.5,
 *     opacity: 0.8,
 *     rotation: 45, // degrees
 *     yFrame: 0
 * });
 * 
 * // Wait for the image to load before starting the game loop
 * sprite.image.onload = () => {
 *     function gameLoop(timestamp) {
 *         const deltaTime = timestamp - (sprite.lastTimestamp || timestamp);
 *         sprite.lastTimestamp = timestamp;
 * 
 *         ctx.clearRect(0, 0, canvas.width, canvas.height);
 *         sprite.update(deltaTime);
 *         sprite.draw(ctx);
 * 
 *         requestAnimationFrame(gameLoop);
 *     }
 * 
 *     requestAnimationFrame(gameLoop);
 * };
 *
 */

export default class Sprite {
    /**
     * Constructs a new Sprite instance.
     * 
     * @param {Object} options - Configuration options for the sprite.
     * @param {string} options.imageSrc - The source path of the sprite image.
     * @param {number} [options.frameWidth=64] - Width of a single frame in pixels.
     * @param {number} [options.frameHeight=64] - Height of a single frame in pixels.
     * @param {number} [options.frames=1] - Total number of frames in the animation.
     * @param {number} [options.frameDelay=200] - Delay between frames in milliseconds.
     * @param {number} [options.x=0] - Initial x-coordinate on the canvas.
     * @param {number} [options.y=0] - Initial y-coordinate on the canvas.
     * @param {number} [options.scaleFactor=1] - Scaling factor for the sprite size.
     * @param {number} [options.opacity=1] - Opacity level (0 to 1).
     * @param {number} [options.rotation=0] - Rotation angle in degrees.
     * @param {number} [options.yFrame=0] - Y-axis frame index (useful for multiple animation rows).
     */
    constructor({
        imageSrc,
        frameWidth = 64,
        frameHeight = 64,
        frames = 1,
        frameDelay = 200, // in milliseconds
        x = 0,
        y = 0,
        scaleFactor = 1,
        opacity = 1,
        rotation = 0,
        yFrame = 0
    }) {
        // Initialize the image object
        this.image = new Image();
        this.image.src = imageSrc;

        // Frame dimensions
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        // Animation settings
        this.frames = frames;
        this.frameDelay = frameDelay;
        this.currentFrame = 0;
        this.lastFrameTime = 0;

        // Positioning
        this.x = x;
        this.y = y;

        // Visual transformations
        this.scaleFactor = scaleFactor;
        this.opacity = opacity;
        this.rotation = rotation;

        // Frame row (for sprite sheets with multiple animation rows)
        this.yFrame = yFrame;

        // Image loading state
        this.isReady = false;

        // Event handlers for image loading
        this.image.onload = () => {
            this.isReady = true;
            // Because nothing can go wrong when things actually work, right?
        };

        this.image.onerror = () => {
            console.error(`Failed to load image: ${imageSrc}`);
            this.isReady = false;
            // Because what’s the point of an image if it doesn’t load? Shocking.
        };

        // Immediate readiness check in case the image was cached and loaded instantly
        if (this.image.complete && this.image.naturalWidth !== 0) {
            this.isReady = true;
            // Ah, the joys of browser caching. Who needs predictable behavior?
        }
    }

    /**
     * Updates the sprite's animation frame based on the elapsed time.
     * 
     * @param {number} deltaTime - Time elapsed since the last update in milliseconds.
     */
    update(deltaTime) {
        if (!this.isReady) return; // Can't animate a non-existent image

        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= this.frameDelay) {
            this.lastFrameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frames;
            // Looping back to the first frame when exceeding total frames
        }
    }

    /**
     * Draws the sprite onto the provided canvas context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (!this.isReady) return; // Don't bother drawing what you can't see

        ctx.save(); // Save the current state before applying transformations

        // Apply opacity
        ctx.globalAlpha = this.opacity;

        // Translate to the center of the sprite for rotation
        ctx.translate(this.x + (this.frameWidth * this.scaleFactor) / 2, this.y + (this.frameHeight * this.scaleFactor) / 2);

        // Apply rotation
        ctx.rotate(this.rotation * Math.PI / 180);

        // Draw the image, offsetting by half width and height to center it
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth, // Source x
            this.yFrame * this.frameHeight,      // Source y
            this.frameWidth,                     // Source width
            this.frameHeight,                    // Source height
            - (this.frameWidth * this.scaleFactor) / 2, // Destination x
            - (this.frameHeight * this.scaleFactor) / 2, // Destination y
            this.frameWidth * this.scaleFactor, // Destination width
            this.frameHeight * this.scaleFactor // Destination height
        );

        ctx.restore(); // Restore the state to prevent unwanted side effects
        // No need to reset globalAlpha here; ctx.restore() handles it
    }

    /**
     * Sets the sprite's position on the canvas.
     * 
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this; // Because why not allow chaining?
    }

    /**
     * Sets the scaling factor for the sprite.
     * 
     * @param {number} scaleFactor - The new scaling factor.
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    setScaleFactor(scaleFactor) {
        this.scaleFactor = scaleFactor;
        return this;
    }

    /**
     * Sets the sprite's opacity.
     * 
     * @param {number} opacity - Opacity level between 0 (transparent) and 1 (opaque).
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    setOpacity(opacity) {
        if (opacity < 0 || opacity > 1) {
            console.warn('Opacity must be between 0 and 1');
            return this; // Because silently failing is better than throwing an error
        }
        this.opacity = opacity;
        return this;
    }

    /**
     * Sets the sprite's rotation.
     * 
     * @param {number} rotation - Rotation angle in degrees.
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    setRotation(rotation) {
        this.rotation = rotation;
        return this;
    }

    /**
     * Sets the Y-axis frame index for sprite sheets with multiple animation rows.
     * 
     * @param {number} yFrame - The Y-axis frame index.
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    setYFrame(yFrame) {
        this.yFrame = yFrame;
        return this;
    }

    /**
     * Changes the sprite's image source.
     * 
     * @param {string} imageSrc - The new image source path.
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    setImage(imageSrc) {
        this.isReady = false;
        this.image.src = imageSrc;
        return this;
    }

    /**
     * Resets the sprite's animation to the first frame.
     * 
     * @returns {Sprite} - Returns the instance for method chaining.
     */
    reset() {
        this.currentFrame = 0;
        this.lastFrameTime = 0;
        return this;

    }

    clone() {   
        return new Sprite({
            imageSrc: this.image.src,
            frameWidth: this.frameWidth,
            frameHeight: this.frameHeight,
            frames: this.frames,
            frameDelay: this.frameDelay,
            x: this.x,
            y: this.y,
            scaleFactor: this.scaleFactor,
            opacity: this.opacity,
            rotation: this.rotation,
            yFrame: this.yFrame
        });
    }


    // Additional methods can be added here, because why limit yourself?
}
