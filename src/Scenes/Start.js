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

        this.splash = this.add.sprite(400,320, 'splash')

        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.credits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.controls = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.how = this.add.sprite(400,320,'howTo');
        this.how.visible = false;
    }
    update(delta) {

        if (this.enter.isDown) {
            this.how.visible = true;
            this.time.delayedCall(3000, () => {
                this.how.visible = false;
                this.scene.start("Hub")
            }, [], this);
        }

        if (this.credits.isDown) {
            this.scene.start("Cred")
            console.log("hello")
        }

        if (this.controls.isDown) {
            this.scene.start("Controls")
        }

    }
}