var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


// inheritance 
function Spaceman(game, spritesheet) {
    //spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animation = new Animation(spritesheet, 196, 196, 5, 0.1, 25, true, 0.5);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 600);
}

Spaceman.prototype = new Entity();
Spaceman.prototype.constructor = Spaceman;

Spaceman.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 10 / 25)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -100;
    Entity.prototype.update.call(this);
}

Spaceman.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function UFO(game, spritesheet) {
    //spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animation = new Animation(spritesheet, 58, 40, 12, 0.1, 12, true, 3);
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 200);
}

UFO.prototype = new Entity();
UFO.prototype.constructor = Spaceman;

UFO.prototype.update = function () {
    if (this.animation.elapsedTime < this.animation.totalTime * 1)
        this.x += this.game.clockTick * this.speed;
    if (this.x > 640 || this.x < 0) this.speed = -1 * this.speed; //reverse direction
    Entity.prototype.update.call(this);
}

UFO.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/Spaceman.png");
AM.queueDownload("./img/moon-surface.jpg");
AM.queueDownload("./img/ufo.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/moon-surface.jpg")));
    gameEngine.addEntity(new Spaceman(gameEngine, AM.getAsset("./img/Spaceman.png")));
    gameEngine.addEntity(new UFO(gameEngine, AM.getAsset("./img/ufo.png")));

    console.log("All Done!");
});