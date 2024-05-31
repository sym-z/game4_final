class Start extends Phaser.Scene {
    constructor() {
        super("Start");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('pi', 'fonts/pi_0.png', 'fonts/pi.fnt');
    }
    create() {
        game.sound.stopAll();

        this.globals = this.scene.get("Globals");
        this.globals.score = 0;

        this.splash = this.add.sprite(400,320, 'splash')

        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.credits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.controls = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    }
    update(delta) {

        if (this.enter.isDown) {
            this.scene.start("Level1")
        }

        if (this.credits.isDown) {
            this.scene.start("Credits")
        }

        if (this.controls.isDown) {
            this.scene.start("Controls")
        }

    }
}