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
        this.hub_scene = this.scene.get("Hub");
        cursors = this.input.keyboard.createCursorKeys();
        this.init_map(this.hub_scene)
        this.animatedTiles.init(this.map);
        this.init_cam(this.hub_scene)
        game.sound.stopAll();
        this.interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }
    update(delta)
    {
        this.player.update()
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

        scene.walkableLayer.setCollisionByProperty({ collides: true });

        scene.player = new Player(this, 100, 500, 'idle1');
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
    }
    init_cam(scene)
    {
        this.cameras.main.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
        scene.cameras.main.useBounds = true;
        scene.cameras.main.setDeadzone(50, 20);
        scene.cameras.main.startFollow(scene.player)
        scene.cameras.main.setZoom(3.5)

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
            if(this.interact.isDown)
                {
                    this.scene.start("Level1")
                }
            break;
        case "Door2":
            console.log('Door2', tile.x, tile.y);
            break;
        case "Door3":
            console.log('Door3', tile.x, tile.y);
            break;
        case "DoorShop":
            console.log('DoorShop', tile.x, tile.y);
            break;

    }
}

