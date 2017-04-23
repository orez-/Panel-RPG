window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    var game = new Phaser.Game(800, 399, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    let worldMap;

    function preload() {
        game.load.image('player', 'assets/sprites/player.png');
        game.load.image('map', 'assets/sprites/map.png');
        game.load.image('panelHud', 'assets/sprites/panel_hud.png');
        game.load.spritesheet('city', 'assets/sprites/city.png', 17, 17);
        game.load.spritesheet('charIcon', 'assets/sprites/charIcon.png', 15, 15);
        game.load.spritesheet('button', 'assets/sprites/buttons.png', 21, 21);
        game.load.spritesheet('background', 'assets/sprites/background.png', 200, 112);
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        new myGame.Panel(this, 0, 0, 0xFF0000, 0);
        new myGame.Panel(this, 0, 133, 0xFF8000, 1);
        new myGame.Panel(this, 0, 266, 0xFFFF00, 2);
        new myGame.Panel(this, 600, 0, 0x00BB00, 3);
        new myGame.Panel(this, 600, 133, 0x0033BB, 4);
        new myGame.Panel(this, 600, 266, 0x8000FF, 5);
        worldMap = new myGame.WorldMap(this, myGame.citiesData);

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
