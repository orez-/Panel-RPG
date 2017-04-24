window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    var game = new Phaser.Game(800, 399, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    let worldMap;

    function preload() {
        game.load.spritesheet('player', 'assets/sprites/player.png', 32, 32);
        game.load.image('map', 'assets/sprites/map.png');
        game.load.image('panelHud', 'assets/sprites/panel_hud.png');
        game.load.spritesheet('knife_goblin', 'assets/sprites/knife_goblin.png', 32, 32);
        game.load.spritesheet('city', 'assets/sprites/city.png', 17, 17);
        game.load.spritesheet('charIcon', 'assets/sprites/charIcon.png', 15, 15);
        game.load.spritesheet('button', 'assets/sprites/buttons.png', 21, 21);
        game.load.spritesheet('background', 'assets/sprites/background.png', 200, 112);
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var panels = [
            new myGame.Panel(this, 0, 0, 0),
            new myGame.Panel(this, 0, 133, 1),
            new myGame.Panel(this, 0, 266, 2),
            new myGame.Panel(this, 600, 0, 3),
            new myGame.Panel(this, 600, 133, 4),
            new myGame.Panel(this, 600, 266, 5),
        ];
        myGame.panels = panels;  // for debug
        new myGame.WorldMap(this, myGame.citiesData, panels);

        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.renderer.renderSession.roundPixels = true;
    }

    function update() {
    }

    function highlightCity(_, city) {
        city.frame = 1;
    }

})(window.Phaser, window.myGame);
