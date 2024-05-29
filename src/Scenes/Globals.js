class Globals extends Phaser.Scene {
    constructor() {
        super("Globals");
    }
    create() {
        this.score = 0;
        this.scene.start("Load")
    }
}