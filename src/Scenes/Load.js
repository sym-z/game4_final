class Load extends Phaser.Scene {
    constructor() {
        super("Load");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load tilemap information
        this.load.image("tilemap_tiles", "kenney_1-bit-platformer-pack/Tilemap/monochrome_tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("rough-draft", "rough-draft.tmj");   // Tilemap in JSON

        // Load in font
        this.load.bitmapFont('pi', 'fonts/pi_0.png', 'fonts/pi.fnt');

        //Load in animation frames
        this.load.image("death", "player-anims/death.png");
        this.load.image("idle1", "player-anims/idle1.png");
        this.load.image("idle2", "player-anims/idle2.png");
        this.load.image("jump1", "player-anims/jump1.png");
        this.load.image("jump2", "player-anims/jump2.png");
        this.load.image("walk1", "player-anims/walk1.png");
        this.load.image("walk2", "player-anims/walk2.png");
        this.load.image("step", "player-anims/step.png");
        this.load.image("hop", "player-anims/hop.png");

        this.load.audio("jump", "audio/pop.mp3")
        this.load.audio("ui", "audio/choice.mp3")
        this.load.audio("death", "audio/death.mp3")
        this.load.audio("footfall", "audio/footfall.mp3")
        this.load.audio("coin", "audio/jump.mp3")
        this.load.audio("key", "audio/key.mp3")

        // Load frames to be used by the particle systems
        this.load.image("coinSys", "particles/coin_pickup.png");
        this.load.image("jumpSys", "particles/jump_spark.png");
        this.load.image("runSys", "particles/run_smoke.png");
    }
    create() {
        var idle_frames = ['idle1', 'idle2'];
        var walk_frames = ['walk1', 'walk2'];
        var jump_frames = ['jump2', 'jump1'];

        this.anims.create(
            {
                key: 'idle',
                frames: idle_frames.map(name => ({ key: name })),
                frameRate: 1,
                repeat: -1
            });
        this.anims.create(
            {
                key: 'walk',
                frames: walk_frames.map(name => ({ key: name })),
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: 'jump',
                frames: jump_frames.map(name => ({ key: name })),
                frameRate: 10,
                repeat: -1
            });
        this.scene.start("Start")
    }
}