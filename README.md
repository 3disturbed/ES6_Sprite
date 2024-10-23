# ES6_Sprite

A robust and slightly opinionated ES6 class for managing sprites in HTML5 Canvas. Perfect for developers who enjoy meticulous control over their animated graphics, with just a hint of dry humor to keep things interesting.

## Features

- **No dependencies:** Because who needs external baggage?
- **Frame Control:** Manage animation frames with ease, or at least as easily as it’s possible.
- **Transformations:** Scale, rotate, and adjust opacity effortlessly. Or, you know, struggle if you don’t.
- **Method Chaining:** For those who like to chain methods like a well-behaved printer.

## Installation

### Or, Just Download
Simply download the Sprite.js file and include it in your project. Because sometimes, simplicity is overrated.

## Usage
### Basic Example

```
import Sprite from './Sprite.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const sprite = new Sprite({
    imageSrc: 'path/to/sprite.png',
    frameWidth: 64,
    frameHeight: 64,
    frames: 10,
    frameDelay: 100, // milliseconds
    x: 100,
    y: 150,
    scaleFactor: 1.5,
    opacity: 0.8,
    rotation: 45, // degrees
    yFrame: 0
});

// Wait for the image to load before starting the game loop
sprite.image.onload = () => {
    function gameLoop(timestamp) {
        const deltaTime = timestamp - (sprite.lastTimestamp || timestamp);
        sprite.lastTimestamp = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sprite.update(deltaTime);
        sprite.draw(ctx);

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
};
```

```
import Sprite from './Sprite.js';

// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create multiple sprites with varying configurations
const sprite1 = new Sprite({
    imageSrc: 'assets/sprite1.png',
    frameWidth: 64,
    frameHeight: 64,
    frames: 8,
    frameDelay: 120,
    x: 50,
    y: 50,
    scaleFactor: 1,
    opacity: 1,
    rotation: 0,
    yFrame: 0
});

const sprite2 = new Sprite({
    imageSrc: 'assets/sprite2.png',
    frameWidth: 128,
    frameHeight: 128,
    frames: 6,
    frameDelay: 200,
    x: 200,
    y: 150,
    scaleFactor: 0.75,
    opacity: 0.85,
    rotation: 45,
    yFrame: 1
});

// Array to manage multiple sprites
const sprites = [sprite1, sprite2];

// Speeds for movement (pixels per second)
const speeds = [
    { x: 80, y: 60 },
    { x: -60, y: 90 }
];

// Handle image loading for all sprites
let loadedSprites = 0;
sprites.forEach((sprite, index) => {
    sprite.image.onload = () => {
        sprite.isReady = true;
        loadedSprites++;
        if (loadedSprites === sprites.length) {
            // All sprites loaded, start the game loop
            requestAnimationFrame(gameLoop);
        }
    };

    sprite.image.onerror = () => {
        console.error(`Sprite ${index + 1} failed to load.`);
        // Handle individual sprite load failure if necessary
    };
});

/**
 * The main animation loop handling multiple sprites.
 * 
 * @param {DOMHighResTimeStamp} timestamp - The current time.
 */
function gameLoop(timestamp) {
    // Calculate deltaTime
    const deltaTime = timestamp - (gameLoop.lastTimestamp || timestamp);
    gameLoop.lastTimestamp = timestamp;

    // Clear the canvas for fresh rendering
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate over each sprite to update and draw
    sprites.forEach((sprite, index) => {
        sprite.update(deltaTime);

        // Update position based on speed
        sprite.setPosition(
            sprite.x + (speeds[index].x * deltaTime) / 1000,
            sprite.y + (speeds[index].y * deltaTime) / 1000
        );

        // Boundary collision detection for bouncing effect
        if (sprite.x + sprite.frameWidth * sprite.scaleFactor > canvas.width || sprite.x < 0) {
            speeds[index].x = -speeds[index].x; // Reverse horizontal direction
            sprite.setRotation(sprite.rotation + 180); // Spin for dramatic effect
        }
        if (sprite.y + sprite.frameHeight * sprite.scaleFactor > canvas.height || sprite.y < 0) {
            speeds[index].y = -speeds[index].y; // Reverse vertical direction
            sprite.setRotation(sprite.rotation + 180); // Another spin, because why not
        }

        // Render the sprite
        sprite.draw(ctx);
    });

    // Continue the loop
    requestAnimationFrame(gameLoop);
}
```
#API Documentation
## Constructor
new Sprite(options)

###Options:

imageSrc (string): Path to the sprite image. Make sure it's correct unless you enjoy debugging.
frameWidth (number, default: 64): Width of a single frame in pixels. Precision matters.
frameHeight (number, default: 64): Height of a single frame in pixels. Consistency is key.
frames (number, default: 1): Total number of frames in the animation. Because more frames, more fun? Maybe.
frameDelay (number, default: 200): Delay between frames in milliseconds. Adjust to your heart's content.
x (number, default: 0): Initial x-coordinate on the canvas. Starting positions can make or break your layout.
y (number, default: 0): Initial y-coordinate on the canvas. Because we all love origin points.
scaleFactor (number, default: 1): Scaling factor for the sprite size. Grow or shrink away.
opacity (number, default: 1): Opacity level (0 to 1). For those who like their sprites see-through.
rotation (number, default: 0): Rotation angle in degrees. Because facing the right direction is important.
yFrame (number, default: 0): Y-axis frame index (useful for multiple animation rows). Organize your sprite sheet wisely.
Methods


## update(deltaTime)

Updates the sprite's animation frame based on the elapsed time.

deltaTime (number): Time elapsed since the last update in milliseconds.

## draw(ctx)

Draws the sprite onto the provided canvas context.

ctx (CanvasRenderingContext2D): The canvas rendering context.

## setPosition(x, y)

Sets the sprite's position on the canvas.

x (number): The new x-coordinate.
y (number): The new y-coordinate.

## setScaleFactor(scaleFactor)

Sets the scaling factor for the sprite.

scaleFactor (number): The new scaling factor.

## setOpacity(opacity)

Sets the sprite's opacity.

opacity (number): Opacity level between 0 (transparent) and 1 (opaque).


## setRotation(rotation)

Sets the sprite's rotation.

rotation (number): Rotation angle in degrees.

## setYFrame(yFrame)

Sets the Y-axis frame index for sprite sheets with multiple animation rows.

yFrame (number): The Y-axis frame index.

## setImage(imageSrc)

Changes the sprite's image source.

imageSrc (string): The new image source path.

## reset()

Resets the sprite's animation to the first frame.

## clone()

returns a new Sprite with identical Properties incase you want another one!

Contributing
Contributions are welcome! Whether it's reporting bugs, suggesting features, or sending pull requests, feel free to make ES6_Sprite even better. Just remember to follow standard conventions and ensure that your contributions don't break the entire system. Happy contributing!

License
MIT

Author
Ben Darlington


