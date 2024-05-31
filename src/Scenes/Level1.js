class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }
    init() {
        this.ACCELERATION = 4000;
        this.MAX_SPEED = 350;
        this.DRAG = 3000;
        this.JUMP_VELOCITY = -700;
        this.physics.world.gravity.y = 2000;
        this.physics.world.TILE_BIAS = 36;
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


     
        console.log("hey")

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
        scene.doorsLayer.setCollisionByProperty({ collides: true });
        scene.killLayer.setCollisionByProperty({ collides: true });
        scene.checkpointLayer.setCollisionByProperty({ collides: true });
        scene.keyLayer.setCollisionByProperty({ collides: true });

        scene.player = new Player(this, 16, 0, 'idle1');
        scene.player.setCollideWorldBounds(true);

        // Setup overlap detection for coin tiles
        scene.physics.add.overlap(scene.player, scene.coinLayer, handleItemOverlap, checkIsCoin, this);

        scene.platformLayer.forEachTile((tile) => {
            tile.setCollision(false, false, true, false);
        });

        scene.physics.add.collider(scene.player, scene.walkableLayer);
        scene.physics.add.collider(scene.player, scene.platformLayer);
        scene.physics.add.collider(scene.player, scene.doorsLayer);
        scene.physics.add.collider(scene.player, scene.killLayer);
        scene.physics.add.collider(scene.player, scene.keyLayer);
        scene.physics.add.collider(scene.player, scene.checkpointLayer);
    }
        
    init_cam(scene)
    {
        this.cameras.main.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
        scene.cameras.main.useBounds = true;
        scene.cameras.main.setDeadzone(50, 20);
        scene.cameras.main.startFollow(scene.player)
        scene.cameras.main.setZoom(4.0)

    }
}
function checkIsCoin(player, tile) {
    // Check if the tile has the 'isCoin' property
    return tile.properties.value;
}

function handleItemOverlap(player, tile) {
    console.log('Picked up coin at:', tile.x, tile.y);
    // Remove the coin tile
    //itemLayer.removeTileAt(tile.x, tile.y);
    // Additional logic for coin pickup, e.g., updating the score
}

