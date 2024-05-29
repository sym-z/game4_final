class Hub extends Phaser.Scene {
    constructor() {
        super("Hub");
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
        this.hub_scene = this.scene.get("Hub");
        this.init_map(this.hub_scene)
        this.animatedTiles.init(this.map);
        this.init_cam(this.hub_scene)
        game.sound.stopAll();
    }
    update(delta)
    {

    }
    init_map(scene)
    {
        scene.map = scene.make.tilemap({ key: 'hub' });
        
        scene.clear_tileset = scene.map.addTilesetImage("base_transparent", "tilemap_tiles_alpha")
        scene.black_tileset = scene.map.addTilesetImage("base_black", "tilemap_tiles")

        scene.backdropLayer = scene.map.createLayer("Backdrop", scene.black_tileset, 0, 0);
        scene.backgroundLayer = scene.map.createLayer("Background", scene.black_tileset, 0, 0);
        scene.midgroundLayer = scene.map.createLayer("Midground", scene.black_tileset, 0, 0);
        scene.treeBorderLayer = scene.map.createLayer("TreeBorder", scene.black_tileset, 0, 0);
        scene.walkableLayer = scene.map.createLayer("Walkable", scene.black_tileset, 0, 0);
        scene.shopLayer = scene.map.createLayer("Shop", scene.black_tileset, 0, 0);
        scene.oneLayer = scene.map.createLayer("Level1", scene.black_tileset, 0, 0);
        scene.twoLayer = scene.map.createLayer("Level2", scene.black_tileset, 0, 0);
        scene.twoLayer = scene.map.createLayer("Level3", scene.black_tileset, 0, 0);
        scene.doorsLayer = scene.map.createLayer("Doors", scene.black_tileset, 0, 0);

    }
    init_cam(scene)
    {
        scene.cameras.main.setBounds(0, 0, 5120, 1280);
        scene.cameras.main.useBounds = true;
        scene.cameras.main.setDeadzone(50, 50);
    }
}