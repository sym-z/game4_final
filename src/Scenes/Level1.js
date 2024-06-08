class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    init() {
        this.globals = this.scene.get("Globals");
        this.ACCELERATION = this.globals.ACCELERATION;
        this.MAX_SPEED = this.globals.MAX_SPEED;
        this.DRAG = this.globals.DRAG;
        this.JUMP_VELOCITY = this.globals.JUMP_VELOCITY;
        this.physics.world.gravity.y = this.globals.GRAVITY;
        this.physics.world.TILE_BIAS = this.globals.TILE_BIAS;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        game.sound.stopAll();
        // UNIQUE TO LEVEL
        this.startX = 56
        this.startY = 584
        this.checkX = 216;
        this.checkY = 344;

        this.uiSound = this.sound.add('ui')
        this.deathSound = this.sound.add('death')
        this.coinSound = this.sound.add('coin')
        this.keySound = this.sound.add('key')

        this.globals = this.scene.get("Globals");
        // UNIQUE TO LEVEL
        this.level_scene = this.scene.get("Level1");
        cursors = this.input.keyboard.createCursorKeys();

        this.init_map(this.level_scene);
        this.animatedTiles.init(this.map);
        this.init_cam(this.level_scene);

        game.sound.stopAll();
        this.interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.showHUD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        
        // TODO: NEW LISTENER SOUND CODE
        this.showHUD.on('down', (key,event) => {

            this.uiSound.play({volume:0.35})
        })
        this.showHUD.on('up', (key,event) => {
            this.uiSound.play({volume:0.35})

        }) 

        this.hud = this.add.sprite(0, 0, 'hud')
        this.checkpointCleared = false;
        // Location to spawn the player if they perish after capturing checkpoint
        this.playerDeath = false;
        this.money_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.money_text.visible = false;
        this.life_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.life_text.visible = false;
        this.message_text = this.add.bitmapText(0, 0, 'pi', 'You Win!', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.message_text.visible = false;

        this.keyIcon1 = this.add.sprite(0, 0, 'keyIcon')
        this.keyIcon1.visible = false;
        this.keyIcon2 = this.add.sprite(0, 0, 'keyIcon')
        this.keyIcon2.visible = false;
        this.keyIcon3 = this.add.sprite(0, 0, 'keyIcon')
        this.keyIcon3.visible = false;

        // NEW HUD CODE
        this.hud.setDepth(50);
        this.money_text.setDepth(51);
        this.life_text.setDepth(52);
        this.message_text.setDepth(53);
        this.keyIcon1.setDepth(54);
        this.keyIcon2.setDepth(55);
        this.keyIcon3.setDepth(56);

        // NEW ENEMY CODE
        this.enemyList = [];
        this.refreshEnemies = false;

        this.place_enemies(this.map);
        this.coolDown = false;

        
        this.music = this.sound.add('level1Music');
        this.music.play({loop: true, volume: 0.35});
        this.checkSound = this.sound.add('check');
        this.bounceSound = this.sound.add('bounce');
        this.walkingSystem = this.add.particles(0, 0, 'runSys',
            {
                scale: { start: this.globals.ps_size, end: 0 },
                rotate: { start: 0, end: 360 },
                lifespan: 350,
                duration: 200
            }
        );
        this.walkingSystem.stop();
        this.walkingSystem.setDepth(15);
        this.jumpSystem = this.add.particles(0, 0, 'jumpSys',
            {
                scale: { start: this.globals.ps_size, end: 0 },
                rotate: { start: 0, end: 360 },
                lifespan: 350,
                duration: 200
            }
        );
        this.jumpSystem.stop();
        this.jumpSystem.setDepth(16);

    }

    update(time,delta) {
        if (this.showHUD.isDown) {
            this.HUDPopUp();
        }
        else {
            this.hud.visible = false
            this.money_text.visible = false;
            this.life_text.visible = false;
            this.keyIcon1.visible = false;
            this.keyIcon2.visible = false;
            this.keyIcon3.visible = false;

        }
        this.player.update();

        // NEW ENEMY CODE
        for (let e of this.enemyList) e.update(time,delta)

    }
    // NEW
    place_enemies(map) {
        this.enemyLayer.forEachTile((tile) => {
            if (tile.properties.isSpawn) {
                this.tileLoc = map.tileToWorldXY(tile.x, tile.y)
                // Random enemies
                this.index = Math.floor(Math.random() * this.globals.enemy_names.length)
                
                // NEW ENEMY CODE                
                this.range = tile.properties.range;
                this.direction = tile.properties.direction;


                // TODO: Pass in type for unique behavior


                // NEW ENEMY CODE
                this.enemy = new Enemy(this, this.tileLoc.x, this.tileLoc.y, this.globals.enemy_names[this.index], this.range, this.direction)
                
                
                this.physics.add.collider(this.enemy, this.walkableLayer);
                this.physics.add.collider(this.enemy, this.platformLayer);
                this.physics.add.collider(this.player, this.enemy, this.battle_touch, null, this);
                this.enemy.setCollideWorldBounds(true);
                tile.visible = false;

                // NEW ENEMY CODE
                this.enemyList.push(this.enemy)
            }
        });
    }
    // NEW
    battle_touch(player, enemy) {
        if (!this.coolDown) {
            if (player.body.bottom <= enemy.body.top + 10) {
                player.body.velocity.y = this.globals.ENEMY_BOUNCE;
                this.bounceSound.play({volume:0.35}) 
                
                // NEW ENEMY CODE
                enemy.alive = false;


                enemy.destroy();
                this.coolDown = true;
                this.time.delayedCall(1000, () => {
                    this.coolDown = false;
                }, [], this);
            } else {

                if (!this.playerDeath) {
                    this.deathSound.play({volume: 0.35})
                    this.cameras.main.shake(this.globals.SHAKE_DURATION, 0.01);
                    this.playerDeath = true;
                    if (this.globals.lives <= 0) {
                        this.globals.lives = this.globals.STARTING_LIVES;
                        this.time.delayedCall(this.globals.SHAKE_DURATION, () => {
                            // UNIQUE TO LEVEL
                            this.globals.level2Key = false;
                            this.scene.start("Hub");
                        }, [], this);
                    }
                    else if (this.checkpointCleared) {
                        this.globals.lives -= 1;
                        this.time.delayedCall(this.globals.SHAKE_DURATION, () => {
                            this.player.x = this.checkX;
                            this.player.y = this.checkY;
                        }, [], this);
                        this.time.delayedCall(1000, () => {
                            this.playerDeath = false;
                        }, [], this);

                    }
                    else {
                        this.globals.lives -= 1;
                        this.time.delayedCall(this.globals.SHAKE_DURATION, () => {
                            this.scene.restart();
                        }, [], this);
                    }
                }
            }
        }
    }
    HUDPopUp() {
        this.hud.visible = true
        // Every 2 pixels you add or remove to the hud, you need to add or remove 1 pixel to the offset
        this.hud.x = this.cameras.main.scrollX + this.cameras.main.displayWidth / 2 + this.globals.HUDX;
        this.hud.y = this.cameras.main.scrollY + this.cameras.main.displayHeight + this.globals.HUDY;
        this.money_text.x = this.hud.x + this.globals.MONEY_OFFSET_X;
        this.money_text.y = this.hud.y + this.globals.MONEY_OFFSET_Y;
        this.money_text.text = this.globals.money
        this.money_text.visible = true;
        this.life_text.x = this.hud.x + this.globals.LIFE_OFFSET_X;
        this.life_text.y = this.hud.y + this.globals.LIFE_OFFSET_Y;
        this.life_text.text = this.globals.lives
        this.life_text.visible = true;
        // Align fonts from here using this.hud's coords
         this.keyIcon1.x = this.hud.x + this.globals.KEY1_OFFSET; 
         this.keyIcon1.y = this.hud.y 
         if(this.globals.level2Key)this.keyIcon1.visible = true;
         this.keyIcon2.x = this.hud.x  + this.globals.KEY2_OFFSET; 
         this.keyIcon2.y = this.hud.y
         if(this.globals.level3Key)this.keyIcon2.visible = true;
         this.keyIcon3.x = this.hud.x  + this.globals.KEY3_OFFSET; 
         this.keyIcon3.y = this.hud.y
         if(this.globals.gameWinKey)this.keyIcon3.visible = true;
         
    }
    init_map(scene) {
        // UNIQUE TO LEVEL
        scene.map = scene.make.tilemap({ key: 'level1' });



        this.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);

        scene.black_tileset = scene.map.addTilesetImage("base_black", "tilemap_tiles");

        scene.backdropLayer = scene.map.createLayer("Backdrop", scene.black_tileset, 0, 0);
        scene.backgroundLayer = scene.map.createLayer("Background", scene.black_tileset, 0, 0);
        scene.enemyLayer = scene.map.createLayer("Enemy", scene.black_tileset, 0, 0);

        scene.midgroundLayer = scene.map.createLayer("Midground", scene.black_tileset, 0, 0);
        scene.killLayer = scene.map.createLayer("Kill", scene.black_tileset, 0, 0);
        scene.walkableLayer = scene.map.createLayer("Walkable", scene.black_tileset, 0, 0);
        scene.platformLayer = scene.map.createLayer("Platform", scene.black_tileset, 0, 0);
        scene.coinLayer = scene.map.createLayer("Coins", scene.black_tileset, 0, 0);
        scene.foregroundLayer = scene.map.createLayer("Foreground", scene.black_tileset, 0, 0);
        scene.keyLayer = scene.map.createLayer("Key", scene.black_tileset, 0, 0);
        scene.checkpointLayer = scene.map.createLayer("Checkpoint", scene.black_tileset, 0, 0);
        scene.doorsLayer = scene.map.createLayer("Doors", scene.black_tileset, 0, 0);
        scene.inLayer = scene.map.createLayer("In", scene.black_tileset, 0, 0);
        scene.outLayer = scene.map.createLayer("Out", scene.black_tileset, 0, 0);

        scene.walkableLayer.setCollisionByProperty({ collides: true });
        scene.platformLayer.setCollisionByProperty({ collides: true });

        // UNIQUE TO LEVEL
        scene.player = new Player(this, this.startX, this.startY, 'idle1', this.globals);
        scene.player.setCollideWorldBounds(true);

        // Setup overlap detection for coin tiles
        scene.physics.add.overlap(scene.player, scene.coinLayer, this.handleItemOverlap, checkIsCoin, this);
        scene.physics.add.overlap(scene.player, scene.doorsLayer, this.handleItemOverlap, checkIsDoor, this);
        scene.physics.add.overlap(scene.player, scene.killLayer, this.handleItemOverlap, checkIsKill, this);
        scene.physics.add.overlap(scene.player, scene.checkpointLayer, this.handleItemOverlap, checkIsCheckpoint, this);
        scene.physics.add.overlap(scene.player, scene.keyLayer, this.handleItemOverlap, checkIsKey, this);
        scene.physics.add.overlap(scene.player, scene.inLayer, this.handleItemOverlap, checkIsDoor, this);
        scene.physics.add.overlap(scene.player, scene.outLayer, this.handleItemOverlap, checkIsDoor, this);

        // Set up unique collision properties of platform tiles
        scene.platformLayer.forEachTile((tile) => {
            if (tile.properties.collides) {
                tile.setCollision(false, false, true, false);
            }
        });

        scene.physics.add.collider(scene.player, scene.walkableLayer);
        scene.physics.add.collider(scene.player, scene.platformLayer);
        this.backgroundLayer.setScrollFactor(0.2)
    }

    init_cam(scene) {
        this.cameras.main.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
        scene.cameras.main.useBounds = true;
        scene.cameras.main.setDeadzone(50, 20);
        scene.cameras.main.startFollow(scene.player);
        scene.cameras.main.setZoom(this.globals.ZOOM);
    }
    handleItemOverlap(player, tile) {
        if (tile.index != -1) {
            switch (tile.layer.name) {
                case "Coins":
                    let coinLoc = this.map.tileToWorldXY(tile.x,tile.y)
                    let xLoc = coinLoc.x + 16
                    let yLoc = coinLoc.y + 16
                    this.coinSystem = this.add.particles(0, 0, 'coinSys',
                        {
                            x: xLoc ,
                            y: yLoc, 
                            scale: { start: this.globals.ps_size, end: 0 },
                            rotate: { start: 0, end: 360 },
                            lifespan: 350,
                            duration: 200
                        }
                    );
                    this.coinSystem.setDepth(17);
                    this.coinSystem.start();
                    this.globals.money += tile.properties.value;
                    if (this.globals.money > this.globals.WALLET_LIMIT) this.globals.money = this.globals.WALLET_LIMIT;
                    let value = tile.properties.value;
                    this.coinLayer.removeTileAt(tile.x, tile.y);
                    this.coinSound.play({volume:this.globals.coinVolume})
                    this.message_text.visible = true;
                    this.message_text.text = "+ " + value
                    this.message_text.x = this.player.x;
                    this.message_text.y = this.player.y;
                    this.time.delayedCall(1000, () => {
                        this.message_text.visible = false;
                    }, [], this);
                    break;
                case "Doors":
                    //console.log("Door Touch")
                    break;
                case "Checkpoint":
                    //console.log("Checkpoint Touch")
                    if (!this.checkpointCleared) {

                        this.checkpointCleared = true;
                        this.message_text.visible = true;
                        this.message_text.text = "Checkpoint!"
                        this.checkSound.play({volume:0.35})
                        this.message_text.x = this.player.x;
                        this.message_text.y = this.player.y;
                        this.time.delayedCall(1000, () => {
                            this.message_text.visible = false;
                        }, [], this);
                    }
                    break;
                case "Kill":

                    if (!this.playerDeath) {
                        this.cameras.main.shake(this.globals.SHAKE_DURATION, 0.01);
                        this.deathSound.play({volume:0.35})
                        this.playerDeath = true;
                        //console.log("Kill Touch")
                        //this.scene.restart()
                        //console.log('lives left: ', this.globals.lives)
                        if (this.globals.lives <= 0) {
                            this.globals.lives = this.globals.STARTING_LIVES;
                            this.time.delayedCall(this.globals.SHAKE_DURATION, () => {
                                this.globals.level2Key = false;
                                this.scene.start("Hub");
                            }, [], this);
                        }
                        else if (this.checkpointCleared) {
                            this.globals.lives -= 1;
                            this.time.delayedCall(this.globals.SHAKE_DURATION, () => {
                                this.player.x = this.checkX;
                                this.player.y = this.checkY;
                            }, [], this);
                            this.time.delayedCall(1000, () => {
                                this.playerDeath = false;
                            }, [], this);

                        }
                        else {
                            this.globals.lives -= 1;
                            this.time.delayedCall(this.globals.SHAKE_DURATION, () => {
                                this.scene.restart();
                            }, [], this);
                        }
                    }
                    break;
                case "Key":
                    //console.log("Key Touch")
                    this.keyLayer.removeTileAt(tile.x, tile.y);
                    // UNIQUE TO LEVEL
                    this.globals.level2Key = true;
                    //console.log("Key obtained: ", this.globals.level2Key)
                    this.keySound.play({volume:0.35})
                    this.message_text.visible = true;
                    this.message_text.text = "Key Get!"
                    this.message_text.x = this.player.x;
                    this.message_text.y = this.player.y;
                    this.time.delayedCall(1500, () => {
                        this.message_text.visible = false;
                    }, [], this);
                    break;
                case "In":
                    //console.log("In Touch")
                    break;
                case "Out":
                    //console.log("Out Touch")
                    // UNIQUE TO LEVEL
                    if (this.globals.level2Key && this.interact.isDown) {
                        this.globals.lvl_1_cmp = true;
                        this.globals.save_game();
                        this.scene.start("Hub");
                    }
                    break;
            }
        }
    }
}
function checkIsCoin(player, tile) {
    return tile.properties.value !== undefined;
}

function checkIsKill(player, tile) {
    return tile.properties.isKill !== undefined;
}
function checkIsCheckpoint(player, tile) {
    return tile.properties.isCheckpoint !== undefined;
}
function checkIsDoor(player, tile) {
    return tile.properties.isDoor !== undefined;
}
function checkIsKey(player, tile) {
    return tile.properties.isKey !== undefined;
}
