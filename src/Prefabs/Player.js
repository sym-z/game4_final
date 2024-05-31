class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
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
    }
    update() {
        this.isMoving = false;
       // console.log(this.body.velocity)
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
        if (this.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.body.setVelocityY(this.parent.JUMP_VELOCITY);
        }
    }
    
}
function coin(tile)
    {
        console.log(tile.properties)
        if(!tile) return
        if(0)
        {
            this.money += tile.properties.value;
            //this.parent.coinLayer.removeTileAt(tile.x, tile.y);
            console.log("Coin Pickup")
        }
    }