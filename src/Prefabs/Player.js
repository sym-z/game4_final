class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // 1 for +x -1 for -x
        this.facing = 1;
        this.isMoving = false;
        this.alive = true;
    }
    update() {
    }
}