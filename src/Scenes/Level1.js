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
        // UNIQUE TO LEVEL
        this.startX = 56
        this.startY = 584
        this.checkX = 216;
        this.checkY = 344;
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
        this.hud = this.add.sprite(0, 0, 'hud')
        this.checkpointCleared = false;
        // Location to spawn the player if they perish after capturing checkpoint
        this.playerDeath = false;
        this.money_text = this.add.bitmapText(0,0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.money_text.visible = false;
        this.life_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.life_text.visible = false;
    }

    update(delta) {
        if (this.showHUD.isDown) {
            console.log("down")
            this.HUDPopUp();
        }
        else {
            this.hud.visible = false
            this.money_text.visible = false;
            this.life_text.visible = false;

        }
        this.player.update();
        console.log(this.playerDeath)
        //console.log(this.player.x, this.player.y)
    }
    HUDPopUp() {
        this.hud.visible = true
        // Every 2 pixels you add or remove to the hud, you need to add or remove 1 pixel to the offset
        this.hud.x = this.cameras.main.scrollX + this.cameras.main.displayWidth / 2 + this.globals.HUDX;
        this.hud.y = this.cameras.main.scrollY + this.cameras.main.displayHeight + this.globals.HUDY;
        this.money_text.x = this.hud.x + this.globals.MONEY_OFFSET_X; 
        this.money_text.y = this.hud.y + this.globals.MONEY_OFFSET_Y;
        this.money_text.text =  this.globals.money
        this.money_text.visible = true;
        this.life_text.x = this.hud.x + this.globals.LIFE_OFFSET_X; 
        this.life_text.y = this.hud.y + this.globals.LIFE_OFFSET_Y;
        this.life_text.text =  this.globals.lives
        this.life_text.visible = true;
        // Align fonts from here using this.hud's coords
        console.log(this.hud.x, this.hud.y)
    }
    init_map(scene) {
        // UNIQUE TO LEVEL
        scene.map = scene.make.tilemap({ key: 'level1' });
        this.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);

        scene.black_tileset = scene.map.addTilesetImage("base_black", "tilemap_tiles");

        scene.backdropLayer = scene.map.createLayer("Backdrop", scene.black_tileset, 0, 0);
        scene.backgroundLayer = scene.map.createLayer("Background", scene.black_tileset, 0, 0);
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
        scene.player = new Player(this, this.startX, this.startY, 'idle1');
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
                    this.globals.money += tile.properties.value;
                    console.log('Picked up coin at:', tile.x, tile.y, " now holding ", this.globals.money);
                    this.coinLayer.removeTileAt(tile.x, tile.y);
                    break;
                case "Doors":
                    console.log("Door Touch")
                    break;
                case "Checkpoint":
                    console.log("Checkpoint Touch")
                    this.checkpointCleared = true;
                    break;
                case "Kill":
                    if (!this.playerDeath) {
                        this.playerDeath = true;
                        console.log("Kill Touch")
                        //this.scene.restart()
                        console.log('lives left: ', this.globals.lives)
                        if (this.globals.lives <= 0) {
                            this.globals.lives = this.globals.STARTING_LIVES;
                            this.scene.start("Hub");
                        }
                        else if (this.checkpointCleared) {
                            this.globals.lives -= 1;
                            this.player.x = this.checkX;
                            this.player.y = this.checkY;
                            this.time.delayedCall(1000, () => {
                                this.playerDeath = false;
                            }, [], this);

                        }
                        else {
                            this.globals.lives -= 1;

                            this.scene.restart();
                        }
                    }
                    break;
                case "Key":
                    console.log("Key Touch")
                    this.keyLayer.removeTileAt(tile.x, tile.y);
                    // UNIQUE TO LEVEL
                    this.globals.level2Key = true;
                    console.log("Key obtained: ", this.globals.level2Key)
                    break;
                case "In":
                    console.log("In Touch")
                    break;
                case "Out":
                    console.log("Out Touch")
                    // UNIQUE TO LEVEL
                    if (this.globals.level2Key && this.interact.isDown) {
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
