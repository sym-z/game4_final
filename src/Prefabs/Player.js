class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, globals) {
        super(scene, x, y, texture);
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.parent = scene
        // 1 for +x -1 for -x
        this.facing = 1;
        this.isMoving = false;
        this.alive = true;
        this.anims.play('idle');
        this.money = 0;
        this.jumps = 2;
        this.globals = globals
        this.step = this.parent.sound.add('footfall');
        this.hop = this.parent.sound.add('jump');
    }
    update() {
        this.isMoving = false;
        // Lookahead Camera, with lerping.
        // Clamp the player's movement speed.
        if (Math.abs(this.body.velocity.x) > this.parent.MAX_SPEED) {
            if (this.body.velocity.x > 0) {
                this.body.velocity.x = this.parent.MAX_SPEED;
            }
            else {
                this.body.velocity.x = -this.parent.MAX_SPEED;
            }
        }
        // Move the player.
        if (cursors.left.isDown) {
            this.body.setAccelerationX(-this.parent.ACCELERATION);
            this.setFlip(true, false);
            this.anims.play('walk', true);
            this.isMoving = true;
            this.facing = -1;

        } else if (cursors.right.isDown) {

            this.body.setAccelerationX(this.parent.ACCELERATION);
            this.resetFlip();
            this.anims.play('walk', true);
            this.isMoving = true;
            this.facing = 1;

        } else {
            this.body.setAccelerationX(0);
            this.body.setDragX(this.parent.DRAG);
            this.anims.play('idle', true);
            this.isMoving = false;
        }

        if (!this.body.blocked.down) {
            this.anims.play('jump', true);
        }
        else
        {
            this.jumps = this.globals.MAX_JUMPS;
        }
        if(Phaser.Input.Keyboard.JustDown(cursors.up))
        {
            if (this.body.blocked.down || this.jumps > 0) {
                this.hop.play({volume:0.05})
                this.jumps -= 1;
                this.body.setVelocityY(this.parent.JUMP_VELOCITY);
            }
        }

        if (this.isMoving && !this.step.isPlaying && this.body.velocity.y == 0) {
            this.step.play({ loop: true , volume: 0.05});
        }
        else if (!this.isMoving && this.step.isPlaying || this.body.velocity.y) {
            this.step.stop();
        }


    }

}
