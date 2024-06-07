class Globals extends Phaser.Scene {
    constructor() {
        super("Globals");
    }
    create() {
        this.debugMode = false;
        this.score = 0;
        this.ACCELERATION = 3000;
        this.MAX_SPEED = 200;
        this.DRAG = 5000;
        this.JUMP_VELOCITY = -450;
        this.GRAVITY = 1350;
        this.TILE_BIAS = 24;
        this.level2Key = false;
        this.level3Key = false;
        this.gameWinKey = false;
        this.money = 0;
        this.ZOOM = 2.75
        this.HUDX = 250
        this.HUDY = 190
        this.MONEY_OFFSET_X = -66 
        this.MONEY_OFFSET_Y = -1
        this.LIFE_OFFSET_X = 92
        this.LIFE_OFFSET_Y = -1
        this.STARTING_LIVES = 3;
        this.HUD_FONT_SIZE = 15
        this.lives = this.STARTING_LIVES 
        this.scene.start("Load")
        this.SHAKE_DURATION = 250
        this.ENEMY_BOUNCE = -500;
        this.MAX_JUMPS = 1;
        this.BUY_CD = 1000;
        this.SHOP_OFFSET = -30;
        this.enemy_names = ['horn', 'heli', 'turt', 'wing', 'round']
        this.WALLET_LIMIT = 400;
        this.KEY1_OFFSET = -20;
        this.KEY2_OFFSET = 0;
        this.KEY3_OFFSET = 20;
        if(this.debugMode)
            {
                this.level2Key = true
                this.level3Key = true;
                this.gameWinKey = true;
                this.money = 1000;
                this.lives = 100;
                this.MAX_JUMPS = 3;
            }
        this.load_game()
    }
    save_game()
    {
        let data = 
        {
            money: this.money,
            lives: this.lives,
            lvl2k: this.level2Key,
            lvl3k: this.level3Key,
            gwk:   this.gameWinKey,
            jumps: this.MAX_JUMPS,
            wallet:this.WALLET_LIMIT
        }
        localStorage.setItem('data', JSON.stringify(data))
    }
    load_game()
    {
        let save = localStorage.getItem('data')
        if(save)
            {
                let gameData = JSON.parse(save)
                this.money = gameData.money;
                this.lives = gameData.lives;
                this.level2Key = gameData.lvl2k;
                this.level3Key = gameData.lvl3k;
                this.gameWinKey = gameData.gwk;
                this.MAX_JUMPS = gameData.jumps;
                this.WALLET_LIMIT = gameData.wallet;
            }
    }
    

}