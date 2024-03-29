"use strict";
window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    var game = new Phaser.Game(800, 399, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    let worldMap;

    function preload() {
        game.load.spritesheet('player', 'assets/sprites/player.png', 32, 32);
        game.load.image('map', 'assets/sprites/map.png');
        game.load.image('panelHud', 'assets/sprites/panel_hud.png');
        game.load.spritesheet('healMagic', 'assets/sprites/healMagic.png', 9, 9);
        game.load.spritesheet('damageMagic', 'assets/sprites/damageMagic.png', 32, 32);
        game.load.spritesheet('fireball', 'assets/sprites/fireball.png', 32, 32);
        game.load.spritesheet('knife_goblin', 'assets/sprites/knife_goblin.png', 32, 32);
        game.load.spritesheet('city', 'assets/sprites/city.png', 17, 17);
        game.load.spritesheet('charIcon', 'assets/sprites/charIcon.png', 15, 15);
        game.load.spritesheet('button', 'assets/sprites/buttons.png', 21, 21);
        game.load.spritesheet('background', 'assets/sprites/background.png', 200, 112);
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var panels = [
            new myGame.Panel(game, 0, 0, 0),
            new myGame.Panel(game, 0, 133, 1),
            new myGame.Panel(game, 0, 266, 2),
            new myGame.Panel(game, 600, 0, 3),
            new myGame.Panel(game, 600, 133, 4),
            new myGame.Panel(game, 600, 266, 5),
        ];
        myGame.panels = panels;  // for debug
        worldMap = new myGame.WorldMap(game, myGame.citiesData, panels);

        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        Phaser.Canvas.setImageRenderingCrisp(game.canvas);
        game.renderer.renderSession.roundPixels = true;
    }

    function update() {
    }

})(window.Phaser, window.myGame);
