class Win extends Phaser.Scene {
    constructor() {
        super("Win");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('pi', 'fonts/pi_0.png', 'fonts/pi.fnt');
    }
    create() {

        game.sound.stopAll();
        this.title = this.add.bitmapText(400, 150, 'pi', 'You Win!', 64).setOrigin(0.5);

        this.sound.play("key");
        // this.title = this.add.bitmapText(400,300,'pi','You finished with a score of ' + this.globals.score + "!", 48).setOrigin(0.5);
        //this.title = this.add.bitmapText(400,400,'pi','Your high score is: ' + this.globals.high_score + "!", 48).setOrigin(0.5);
        this.icon = this.add.sprite(400, 300, 'hop')      //this.title = this.add.bitmapText(400,300,'pi','You finished with a score of ' + this.globals.score + "!", 48).setOrigin(0.5);
        this.icon.setScale(15.0).setOrigin(0.5)
        this.title = this.add.bitmapText(400, 550, 'pi', 'Press [Enter] to replay!', 48).setOrigin(0.5);
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    update(delta) {
        if (this.enter.isDown) {
            //this.globals.score = 0;
            this.scene.start("Start")
        }

    }
}