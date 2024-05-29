class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('pi', 'fonts/pi_0.png', 'fonts/pi.fnt');
    }
    create() {
        this.title = this.add.bitmapText(400, 50, 'pi', 'Credits', 64).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 150, 'pi', 'Programming and Audio:', 64).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 200, 'pi', 'Jack Sims', 64).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 300, 'pi', 'Art and Font: Made by Kenney', 48).setOrigin(0.5);
        this.title = this.add.bitmapText(400, 550, 'pi', 'Press ENTER to return to start screen!', 48).setOrigin(0.5);
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    update(delta) {
        if (this.enter.isDown) {
            this.scene.start("Start")
        }

    }
}