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
        this.globals = this.scene.get("Globals");
        this.level_scene = this.scene.get("Level1");
        cursors = this.input.keyboard.createCursorKeys();
        
        this.init_map(this.level_scene)
        
        this.animatedTiles.init(this.map);
        
        this.init_cam(this.level_scene)
        
        game.sound.stopAll();


     

    }
    update(delta)
    {
        this.player.update()
    }
    init_map(scene)
    {
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

        scene.walkableLayer.setCollisionByProperty({ collides: true });
        scene.platformLayer.setCollisionByProperty({ collides: true });

        scene.player = new Player(this, 16, 0, 'idle1');
        scene.player.setCollideWorldBounds(true);

        // Setup overlap detection for coin tiles
        scene.physics.add.overlap(scene.player, scene.coinLayer, handleItemOverlap, checkIsCoin, this);
        scene.physics.add.overlap(scene.player, scene.doorsLayer, handleItemOverlap, checkIsDoor, this);
        scene.physics.add.overlap(scene.player, scene.killLayer, handleItemOverlap, checkIsKill, this);
        scene.physics.add.overlap(scene.player, scene.checkpointLayer, handleItemOverlap, checkIsCheckpoint, this);
        scene.physics.add.overlap(scene.player, scene.keyLayer, handleItemOverlap, checkIsKey, this);

        // Set up unique collision properties of platform tiles

        scene.platformLayer.forEachTile((tile) => {
            if (tile.properties.collides) {
                tile.setCollision(false, false, true, false);
            }
        });

        scene.physics.add.collider(scene.player, scene.walkableLayer);
        scene.physics.add.collider(scene.player, scene.platformLayer);
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
function checkIsCoin(player, tile) {
    return tile.properties.value;
}
function checkIsKill(player, tile) {
    return tile.properties.isKill;
}
function checkIsCheckpoint(player, tile) {
    return tile.properties.isCheckpoint;
}
function checkIsDoor(player, tile) {
    return tile.properties.isDoor;
}
function checkIsKey(player, tile) {
    return tile.properties.isKey;
}

function handleItemOverlap(player, tile) {

    switch(tile.layer.name)
    {
        case "Coins":
            console.log('Picked up coin at:', tile.x, tile.y);
            this.coinLayer.removeTileAt(tile.x, tile.y);
            break;
        case "Doors":
            console.log("Door Touch")
            break;
        case "Checkpoint":
            console.log("Checkpoint Touch")
            break;
        case "Kill":
            console.log("Kill Touch")
            break;
        case "Key":
            console.log("Key Touch")
            break;
    }
}

