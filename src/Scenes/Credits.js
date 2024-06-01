class Cred extends Phaser.Scene {
    constructor() {
        super("Cred");
    }
    preload() {
    }
    create() {
        this.credits = this.add.sprite(400,320, 'credits')
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    update(delta) {
        if (this.enter.isDown) {
            this.scene.start("Start")
        }

    }
}