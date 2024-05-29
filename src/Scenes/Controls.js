class Controls extends Phaser.Scene {
    constructor() {
        super("Controls");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('pi', 'fonts/pi_0.png', 'fonts/pi.fnt');
    }
    create() {
        this.title = this.add.bitmapText(400, 50, 'pi', 'Move Left / Right:', 64).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 125, 'pi', 'Left and Right Arrow Keys', 64).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 200, 'pi', 'Jump: Up Arrow Key', 64).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 300, 'pi', 'Collect the key at', 48).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 350, 'pi', 'the end of the level', 48).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 400, 'pi', 'to win!', 48).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 500, 'pi', 'Collect all coins for a hidden surprise!', 48).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 600, 'pi', 'Press ENTER to return to start screen!', 48).setOrigin(0.5);
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    update(delta) {
        if (this.enter.isDown) {
            this.scene.start("Start")
        }

    }
}