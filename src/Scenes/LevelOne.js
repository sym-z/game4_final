class LevelOne extends Phaser.Scene {
    constructor() {
        super("LevelOne");
    }
    init() {
        this.ACCELERATION = 4000;
        this.MAX_SPEED = 350;
        this.DRAG = 3000;
        this.JUMP_VELOCITY = -700;
        this.physics.world.gravity.y = 2000;
        this.HIDDEN_AREA_UNLOCK = 25;
        this.HIDDEN_AREA_X = 4512;
        this.HIDDEN_AREA_Y = 64;
    }
    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');

    }
    create() {
        this.cameras.main.setBounds(0, 0, 5120, 1280);
        this.cameras.main.useBounds = true;
        this.cameras.main.setDeadzone(50, 50);
        this.physics.world.TILE_BIAS = 36;
        game.sound.stopAll();
        this.globals = this.scene.get("Globals");
        this.map = this.make.tilemap({ key: 'rough-draft' });
        this.tileset = this.map.addTilesetImage("1bit-tileset", "tilemap_tiles")

        this.background = this.map.createLayer("Background", this.tileset, 0, 0);
        this.hidden = this.map.createLayer("Hidden Room", this.tileset, 0, 0);
        this.ground = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.items = this.map.createLayer("Items", this.tileset, 0, 0);


        this.background.depth = 0;
        this.ground.depth = 1;
        this.hidden.depth = 2;
        this.items.depth = 3;

        this.animatedTiles.init(this.map);
        this.background.setScale(2.0);
        this.hidden.setScale(2.0);
        this.ground.setScale(2.0);
        this.items.setScale(2.0);

        this.ground.setCollisionByProperty(
            {
                collides: true
            }
        );
        this.hidden.setCollisionByProperty(
            {
                collides: true
            }
        );


        this.ground.setCollisionByProperty(
            {
                platform: true
            }
        );
        this.background.setCollisionByProperty(
            {
                hurts: true
            }
        );
        this.items.setCollisionByProperty(
            {
                pickup: true
            }
        );
        this.player = new Player(this, 120, 850, 'idle1');
        this.player.setScale(2.0);
        this.ground.forEachTile((tile) => {
            if (tile.properties.platform) {
                tile.setCollision(false, false, true, false);
            }
        });
        this.ground.forEachTile((tile) => {
            if (tile.properties.teleportA) {
                tile.collisionCallback = () => {
                    console.log(this.bLocX, this.bLocY)
                    this.player.x = this.HIDDEN_AREA_X;
                    this.player.y = this.HIDDEN_AREA_Y;
                }
            }
        });
        // Pickup Coin and Key callbacks
        this.items.forEachTile((tile) => {
            tile.collisionCallback = () => {
                if (tile.properties.key) {
                    this.key_pickup(tile)
                }
                else {
                    this.coin_pickup(tile)

                }
            }
        })
        // Hurt callback
        this.background.forEachTile((tile) => {
            tile.collisionCallback = () => {
                if (tile.properties.hurts) {
                    this.hurt();
                }
            }
        })


        // Can't do this bc scaling, unless a TA can help out.
        //this.player.setCollideWorldBounds(true);



        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.items);
        this.physics.add.collider(this.player, this.background);
        this.physics.add.collider(this.player, this.hidden);


        this.player.anims.play('idle');

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.scrollX = this.player.x - 400;

        this.step = this.sound.add('footfall');

        this.walkingSystem = this.add.particles(0, 0, 'runSys',
            {
                scale: { start: 0.1, end: 0 },
                rotate: { start: 0, end: 360 },
                lifespan: 350,
                duration: 200
            }
        );
        this.walkingSystem.stop();
    }
    update() {
        if (this.globals.score == this.HIDDEN_AREA_UNLOCK) {
            this.unveil();
            //TODO: Play Sound
        }
        this.player.isMoving = false;
        // Lookahead Camera, with lerping.
        this.cameras.main.scrollY = this.player.y - 350;
        this.target = this.player.x - 400 + this.player.facing * 100;
        this.dx = this.target - this.cameras.main.scrollX;
        this.cameras.main.scrollX += this.dx * 0.065;

        // Clamp the player's movement speed.
        if (Math.abs(this.player.body.velocity.x) > this.MAX_SPEED) {
            if (this.player.body.velocity.x > 0) {
                this.player.body.velocity.x = this.MAX_SPEED;
            }
            else {
                this.player.body.velocity.x = -this.MAX_SPEED;
            }
        }
        // Move the player.
        if (cursors.left.isDown) {
            this.walkingSystem.startFollow(this.player, this.player.displayWidth / 2, this.player.displayHeight / 2 - 10, false);
            if (this.player.body.blocked.down) {
                this.walkingSystem.start();
            }
            this.player.body.setAccelerationX(-this.ACCELERATION);
            this.player.setFlip(true, false);
            this.player.anims.play('walk', true);
            this.player.isMoving = true;
            this.player.facing = -1;

        } else if (cursors.right.isDown) {
            // TODO: have the player accelerate to the right

            this.walkingSystem.startFollow(this.player, this.player.displayWidth / 2 - 32, this.player.displayHeight / 2 - 10, false);
            if (this.player.body.blocked.down) {
                this.walkingSystem.start();
            }
            this.player.body.setAccelerationX(this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('walk', true);
            this.player.isMoving = true;
            this.player.facing = 1;

        } else {
            this.walkingSystem.stop();
            // TODO: set acceleration to 0 and have DRAG take over
            this.player.body.setAccelerationX(0);
            this.player.body.setDragX(this.DRAG);
            this.player.anims.play('idle', true);
            this.player.isMoving = false;
        }

        if (this.player.isMoving && !this.step.isPlaying && this.player.body.velocity.y == 0) {
            this.step.play({ loop: true });
        }
        else if (!this.player.isMoving && this.step.isPlaying || this.player.body.velocity.y) {
            this.step.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if (!this.player.body.blocked.down) {
            this.player.anims.play('jump', true);
        }
        if (this.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jump");
            this.jump_spark();

        }

    }
    // Picking something up makes it invisible and turns its collision off.
    coin_pickup(tile) {
        tile.setCollision(false, false, false, false, true);
        tile.setVisible(false)
        this.globals.score += 1;
        this.sound.play("coin");
        console.log("coin pickup, score is: ", this.globals.score);
        this.coin_sparkle(tile);

    }
    key_pickup(tile) {
        tile.setCollision(false, false, false, false, true);
        tile.setVisible(false)
        this.sound.play("key");
        console.log("key pickup")
        this.scene.start("Win")
    }
    // Instantly restarts level, I want to do a death anim but idk how yet.
    hurt() {
        this.globals.score = 0;
        this.sound.play("death");
        this.scene.start("GameOver")
    }
    // Plays the particle system for the coin at the player's location
    coin_sparkle(tile) {
        let coinLoc = this.map.tileToWorldXY(tile.x, tile.y)
        let xLoc = coinLoc.x + 16;
        let yLoc = coinLoc.y + 16;
        this.coinSystem = this.add.particles(0, 0, 'coinSys', {
            scale: { start: 0.1, end: 0 },
            x: { min: xLoc - 5, max: xLoc + 5 },
            y: { min: yLoc - 5, max: yLoc + 5 },
            lifespan: 200,
            duration: 500
        });
        this.coinSystem.start();

    }
    jump_spark() {
        this.jumpSystem = this.add.particles(0, 0, 'jumpSys',
            {
                scale: { start: 0.15, end: 0 },
                lifespan: 200,
                rotate: { start: 0, end: 360 },
                duration: 300
            }
        );
        this.jumpSystem.startFollow(this.player, this.player.displayWidth / 2 - 15, this.player.displayHeight / 2 - 5, false);
        this.jumpSystem.start();
    }
    unveil() {
        console.log('player touch')
        this.hidden.setVisible(false)
        this.hidden.y = -1000
        // this.hidden.active= false
    }
}
