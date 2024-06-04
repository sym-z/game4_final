class Globals extends Phaser.Scene {
    constructor() {
        super("Globals");
    }
    create() {
        this.score = 0;
        this.ACCELERATION = 3000;
        this.MAX_SPEED = 200;
        this.DRAG = 5000;
        this.JUMP_VELOCITY = -450;
        this.GRAVITY = 1350;
        this.TILE_BIAS = 24;
        this.level2Key = false;
        this.level3Key = false;
        this.gameWinKey = false;
        this.money = 0;
        this.ZOOM = 2.75
        this.HUDX = 250
        this.HUDY = 190
        this.MONEY_OFFSET_X = -66 
        this.MONEY_OFFSET_Y = -1
        this.LIFE_OFFSET_X = 92
        this.LIFE_OFFSET_Y = -1
        this.STARTING_LIVES = 3;
        this.HUD_FONT_SIZE = 15
        this.lives = this.STARTING_LIVES 
        this.scene.start("Load")
        this.SHAKE_DURATION = 250

    }
    

}