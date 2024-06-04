// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 800,
    height: 640,
    scene: [Globals, Load, Cred, Start, Controls, Hub,Level1,Level2,Level3,  Win]
}

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {} };

const game = new Phaser.Game(config);