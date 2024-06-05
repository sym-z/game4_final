class Shop extends Phaser.Scene {
    constructor() {
        super("Shop");
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
        this.startX = 107
        this.startY = 152
        this.checkX = 216;
        this.checkY = 344;
        this.globals = this.scene.get("Globals");
        // UNIQUE TO LEVEL
        this.level_scene = this.scene.get("Shop");
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
        this.money_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.money_text.visible = false;
        this.life_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.life_text.visible = false;
        this.message_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.message_text.visible = false;
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
        //console.log(this.player.x, this.player.y)
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
        console.log(this.player.x, this.player.y)
    }
    init_map(scene) {
        // UNIQUE TO LEVEL
        scene.map = scene.make.tilemap({ key: 'shop' });
        this.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);

        scene.black_tileset = scene.map.addTilesetImage("base_black", "tilemap_tiles");

        scene.backdropLayer = scene.map.createLayer("Backdrop", scene.black_tileset, 0, 0);
        scene.backgroundLayer = scene.map.createLayer("Background", scene.black_tileset, 0, 0);
        scene.midgroundLayer = scene.map.createLayer("Midground", scene.black_tileset, 0, 0);
        scene.item1Layer = scene.map.createLayer("Item1", scene.black_tileset, 0, 0);
        scene.item2Layer = scene.map.createLayer("Item2", scene.black_tileset, 0, 0);
        scene.item3Layer = scene.map.createLayer("Item3", scene.black_tileset, 0, 0);
        scene.walkableLayer = scene.map.createLayer("Walkable", scene.black_tileset, 0, 0);
        scene.foregroundLayer = scene.map.createLayer("Foreground", scene.black_tileset, 0, 0);
        scene.doorsLayer = scene.map.createLayer("Door", scene.black_tileset, 0, 0);

        scene.walkableLayer.setCollisionByProperty({ collides: true });

        scene.player = new Player(this, this.startX, this.startY, 'idle1');
        scene.player.setCollideWorldBounds(true);

        // Setup overlap detection for coin tiles
        scene.physics.add.overlap(scene.player, scene.item1Layer, this.handleItemOverlap, checkIsItem, this);
        scene.physics.add.overlap(scene.player, scene.item2Layer, this.handleItemOverlap, checkIsItem, this);
        scene.physics.add.overlap(scene.player, scene.item3Layer, this.handleItemOverlap, checkIsItem, this);
        scene.physics.add.overlap(scene.player, scene.doorsLayer, this.handleItemOverlap, checkIsDoor, this);

        scene.physics.add.collider(scene.player, scene.walkableLayer);
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
                case "Item1":
                    console.log("Item1 Touch")
                    if(this.globals.money >= 100 && this.interact.isDown)
                        {
                            this.globals.lives += 1;
                            this.globals.money -= 100;
                        }
                    break;
                case "Item2":
                    console.log("Item2 Touch")
                    break;
                case "Item3":
                    console.log("Item3 Touch")
                    break;
                case "Door":
                    console.log("Door Touch")
                    // UNIQUE TO LEVEL
                    if (this.interact.isDown) {
                        this.scene.start("Hub");
                    }
                    break;
            }
        }
    }
}

function checkIsDoor(player, tile) {
    return tile.properties.isDoor !== undefined;
}
function checkIsItem(player, tile) {
    return tile.properties.isItem !== undefined;
}