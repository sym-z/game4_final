class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, range, direction) {
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.parent = scene
        this.alive = true;
        this.direction = direction;
        this.range = range;
        this.tex = texture
        this.duration = 0;
    }
    update(time, delta) {
        if (this.alive) {
            this.duration += delta
            let seconds = Math.floor(this.duration / 1000)
            if (seconds > this.range) {
                this.direction *= -1;
                this.duration = 0;
                seconds = 0;
            }
            this.body.setVelocityX(10 * this.direction);
        }
    }

}
