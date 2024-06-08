class Hub extends Phaser.Scene {
    constructor() {
        super("Hub");
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
        this.hub_scene = this.scene.get("Hub");
        cursors = this.input.keyboard.createCursorKeys();
        // UNIQUE TO LEVEL
        this.startX = 714;
        this.startY = 504

        this.uiSound = this.sound.add('ui')
        this.deathSound = this.sound.add('death')
        this.coinSound = this.sound.add('coin')
        this.keySound = this.sound.add('key')

        this.init_map(this.hub_scene)
        this.animatedTiles.init(this.map);
        this.init_cam(this.hub_scene)
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
        this.money_text = this.add.bitmapText(0,0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.money_text.visible = false;
        this.life_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.life_text.visible = false;
        this.message_text = this.add.bitmapText(0, 0, 'pi', '', this.globals.HUD_FONT_SIZE).setOrigin(0.5);
        this.message_text.visible = false;
        this.message_text.setDepth(14)
        // NEW
        this.keyIcon1 = this.add.sprite(0,0,'keyIcon')
        this.keyIcon1.visible = false;
        this.keyIcon2 = this.add.sprite(0,0,'keyIcon')
        this.keyIcon2.visible = false;
        this.keyIcon3 = this.add.sprite(0,0,'keyIcon')
        this.keyIcon3.visible = false;
        
        this.music = this.sound.add('hubMusic');
        this.music.play({loop: true, volume: 0.35});

        this.walkingSystem = this.add.particles(0, 0, 'runSys',
            {
                scale: { start: 0.1, end: 0 },
                rotate: { start: 0, end: 360 },
                lifespan: 350,
                duration: 200
            }
        );
        this.walkingSystem.setDepth(15);
        this.walkingSystem.stop();
        this.jumpSystem = this.add.particles(0, 0, 'jumpSys',
            {
                scale: { start: 0.1, end: 0 },
                rotate: { start: 0, end: 360 },
                lifespan: 350,
                duration: 200
            }
        );
        this.jumpSystem.stop();
        this.jumpSystem.setDepth(16);
        this.coinSystem = this.add.particles(0, 0, 'coinSys',
            {
                scale: { start: 0.1, end: 0 },
                rotate: { start: 0, end: 360 },
                lifespan: 350,
                duration: 200
            }
        );
        this.coinSystem.stop();
        this.coinSystem.setDepth(17);
    }
    update(delta)
    {
        if (this.showHUD.isDown) {
            console.log("down")
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
        //console.log(this.player.x, this.player.y)
        this.player.update()

        //this.midgroundLayer.setScrollFactor(0.5)
        //this.foregroundLayer.setScrollFactor(1.0)
    }
    HUDPopUp() {
        this.hud.visible = true
        console.log("heelllooo")
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
        
        // NEW
        this.keyIcon1.x = this.hud.x + this.globals.KEY1_OFFSET; 
        this.keyIcon1.y = this.hud.y 
        if(this.globals.level2Key)this.keyIcon1.visible = true;
        this.keyIcon2.x = this.hud.x  + this.globals.KEY2_OFFSET; 
        this.keyIcon2.y = this.hud.y
        if(this.globals.level3Key)this.keyIcon2.visible = true;
        this.keyIcon3.x = this.hud.x  + this.globals.KEY3_OFFSET; 
        this.keyIcon3.y = this.hud.y
        if(this.globals.gameWinKey)this.keyIcon3.visible = true;
        
        // Align fonts from here using this.hud's coords
        // Align fonts from here using this.hud's coords
        console.log(this.player.x, this.player.y)

        // NEW HUD CODE
        this.hud.setDepth(50);
        this.money_text.setDepth(51);
        this.life_text.setDepth(52);
        this.message_text.setDepth(53);
        this.keyIcon1.setDepth(54);
        this.keyIcon2.setDepth(55);
        this.keyIcon3.setDepth(56);
    }
    init_map(scene)
    {
        scene.map = scene.make.tilemap({ key: 'hub' });

        scene.black_tileset = scene.map.addTilesetImage("base_black", "tilemap_tiles")

        scene.backdropLayer = scene.map.createLayer("Backdrop", scene.black_tileset, 0, 0);
        scene.backgroundLayer = scene.map.createLayer("Background", scene.black_tileset, 0, 0);
        scene.midgroundLayer = scene.map.createLayer("Midground", scene.black_tileset, 0, 0);
        scene.treeBorderLayer = scene.map.createLayer("TreeBorder", scene.black_tileset, 0, 0);
        scene.walkableLayer = scene.map.createLayer("Walkable", scene.black_tileset, 0, 0);
        scene.shopLayer = scene.map.createLayer("Shop", scene.black_tileset, 0, 0);
        scene.oneLayer = scene.map.createLayer("Level1", scene.black_tileset, 0, 0);
        scene.twoLayer = scene.map.createLayer("Level2", scene.black_tileset, 0, 0);
        scene.threeLayer = scene.map.createLayer("Level3", scene.black_tileset, 0, 0);
        scene.door1Layer = scene.map.createLayer("Door1", scene.black_tileset, 0, 0);
        scene.door2Layer = scene.map.createLayer("Door2", scene.black_tileset, 0, 0);
        scene.door3Layer = scene.map.createLayer("Door3", scene.black_tileset, 0, 0);
        scene.doorShopLayer = scene.map.createLayer("DoorShop", scene.black_tileset, 0, 0);

        scene.backdropLayer.setDepth(0)
        scene.backgroundLayer.setDepth(1)
        scene.midgroundLayer.setDepth(2)
        scene.treeBorderLayer.setDepth(3)
        scene.walkableLayer.setDepth(4)
        scene.shopLayer.setDepth(5)
        scene.oneLayer.setDepth(6)
        scene.twoLayer.setDepth(7)
        scene.threeLayer.setDepth(8)
        scene.door1Layer.setDepth(9)
        scene.door2Layer.setDepth(10)
        scene.door3Layer.setDepth(11)
        scene.doorShopLayer.setDepth(12)
        scene.walkableLayer.setCollisionByProperty({ collides: true });

        scene.player = new Player(this, this.startX, this.startY, 'idle1', this.globals);
        scene.player.setDepth(13)
        scene.player.setCollideWorldBounds(true);
        scene.walkableLayer.forEachTile((tile) => {
            if (tile.properties.platform) {
                tile.setCollision(false, false, true, false);
            }
        });
        scene.oneLayer.forEachTile((tile) => {
            if (tile.properties.platform) {
                tile.setCollision(false, false, true, false);
            }
        });
        scene.physics.add.overlap(scene.player, scene.door1Layer, handleItemOverlap, checkIsDoor, this);
        scene.physics.add.overlap(scene.player, scene.door2Layer, handleItemOverlap, checkIsDoor, this);
        scene.physics.add.overlap(scene.player, scene.door3Layer, handleItemOverlap, checkIsDoor, this);
        scene.physics.add.overlap(scene.player, scene.doorShopLayer, handleItemOverlap, checkIsDoor, this);
        scene.physics.add.collider(scene.player, scene.walkableLayer);
        scene.physics.add.collider(scene.player, scene.oneLayer);


        this.backgroundLayer.setScrollFactor(0.2)
    }
    init_cam(scene)
    {
        this.cameras.main.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
        scene.cameras.main.useBounds = true;
        scene.cameras.main.setDeadzone(50, 20);
        scene.cameras.main.startFollow(scene.player)
        scene.cameras.main.setZoom(this.globals.ZOOM)

    }
}
function checkIsDoor(player, tile) {
    return tile.properties.isDoor;
}
function checkIsKill(player, tile) {
    return tile.properties.isKill;
}
function checkIsCheckpoint(player, tile) {
    return tile.properties.isCheckpoint;
}

function handleItemOverlap(player, tile) {

    switch(tile.layer.name)
    {
        case "Door1":
            console.log('Door1', tile.x, tile.y);
            this.message_text.text = "Level 1"
            this.message_text.x = this.player.x;
            this.message_text.y = this.player.y + this.globals.SHOP_OFFSET; 
            this.message_text.visible = true;
            if(this.interact.isDown)
                {
                    this.scene.start("Level1")
                }
            break;
        case "Door2":
            console.log('Door2', tile.x, tile.y);
            this.message_text.text = "Level 2"
            this.message_text.x = this.player.x;
            this.message_text.y = this.player.y + this.globals.SHOP_OFFSET; 
            if(!this.globals.level2Key) this.message_text.text = "Complete Level 1 to Unlock!"
            this.message_text.visible = true;
            if(this.interact.isDown && this.globals.level2Key)
                {
                    this.scene.start("Level2")
                }
            break;
        case "Door3":
            console.log('Door3', tile.x, tile.y);
            this.message_text.text = "Level 3"
            this.message_text.x = this.player.x;
            this.message_text.y = this.player.y + this.globals.SHOP_OFFSET; 
            if(!this.globals.level3Key) this.message_text.text = "Complete Level 2 to Unlock!"
            this.message_text.visible = true;
            if(this.interact.isDown && this.globals.level3Key)
                {
                    this.scene.start("Level3")
                }
            break;
        case "DoorShop":
            console.log('DoorShop', tile.x, tile.y);
            this.message_text.text = "Shop"
            this.message_text.x = this.player.x;
            this.message_text.y = this.player.y + this.globals.SHOP_OFFSET; 
            this.message_text.visible = true;
            if(this.interact.isDown)
                {
                    this.scene.start("Shop")
                }
            break;

    }
}

