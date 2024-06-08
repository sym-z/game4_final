class Load extends Phaser.Scene {
    constructor() {
        super("Load");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('pi', 'fonts/pi_0.png', 'fonts/pi.fnt');

        // Load tilemap information
        this.load.image("tilemap_tiles", "kenney_1-bit-platformer-pack/Tilemap/monochrome_tilemap_packed.png");                         // Packed tilemap
        this.load.image("tilemap_tiles_alpha", "kenney_1-bit-platformer-pack/Tilemap/monochrome_tilemap_transparent_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("hub", "/tilesets/hub.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("level1", "/tilesets/level1.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("level2", "/tilesets/level2.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("level3", "/tilesets/level3.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("shop", "/tilesets/shop.tmj");   // Tilemap in JSON

        // Load menu sprites
        this.load.image("splash", "menus/title.png");
        this.load.image("controls", "menus/controls.png");
        this.load.image('hud', 'menus/hud.png')
        this.load.image('credits', 'menus/credits.png')
        this.load.image('keyIcon', 'menus/keyIcon.png')
        this.load.image('howTo', 'menus/howto.png')
        this.load.image('win', 'menus/win.png')
        

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

        // Load enemy sprites

        this.load.image("wing", "enemy-anims/wing.png");
        this.load.image("turt", "enemy-anims/turt.png");
        this.load.image("round", "enemy-anims/round.png");
        this.load.image("horn", "enemy-anims/horn_guy.png");
        this.load.image("heli", "enemy-anims/heli.png");

        this.load.audio("jump", "audio/pop.mp3") // Done
        this.load.audio("ui", "audio/choice.mp3") // Done 
        this.load.audio("death", "audio/death.mp3") // Done, but needs new source
        this.load.audio("footfall", "audio/footfall.mp3") // Done
        this.load.audio("coin", "audio/jump.mp3") // Done
        this.load.audio("key", "audio/key.mp3") // Done
        this.load.audio("shopMusic", "audio/shop.mp3") // Done
        this.load.audio("hubMusic", "audio/hub.mp3") // Done
        this.load.audio("level1Music", "audio/level1.mp3") // Done
        this.load.audio("level2Music", "audio/level2.mp3") // Done
        this.load.audio("level3Music", "audio/level3.mp3") // Done
        
        this.load.audio("bounce", "audio/bounce.mp3") // Done
        this.load.audio("buy", "audio/buy.mp3") // Done
        this.load.audio("check", "audio/check.mp3") // Done
        this.load.audio("noBuy", "audio/noBuy.mp3") // Done

        //TODO: Game Win Audio
        //TODO: Game Over Audio

        // Load frames to be used by the particle systems
        this.load.image("coinSys", "particles/coin.png");
        this.load.image("jumpSys", "particles/jump.png");
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
            this.tileData = this.cache.xml.get('num_xml');
            
        this.scene.start("Start")

    }

}