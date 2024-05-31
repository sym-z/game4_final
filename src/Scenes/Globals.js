class Globals extends Phaser.Scene {
    constructor() {
        super("Globals");
    }
    create() {
        this.score = 0;
        this.ACCELERATION = 3000;
        this.MAX_SPEED = 200;
        this.DRAG = 5000;
        this.JUMP_VELOCITY = -550;
        this.GRAVITY = 1500;
        this.TILE_BIAS = 64;
        this.scene.start("Load")
    }
}