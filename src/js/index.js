window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    var game = new Phaser.Game(800, 399, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    let worldMap;

    function preload() {
        game.load.image('player', 'assets/sprites/player.png');
        game.load.image('map', 'assets/sprites/map.png');
        game.load.spritesheet('city', 'assets/sprites/city.png', 17, 17);
    }

    function create() {
        new myGame.Panel(this, 0, 0, 0xFF0000);
        new myGame.Panel(this, 0, 133, 0xFF8000);
        new myGame.Panel(this, 0, 266, 0xFFFF00);
        new myGame.Panel(this, 600, 0, 0x00BB00);
        new myGame.Panel(this, 600, 133, 0x0033BB);
        new myGame.Panel(this, 600, 266, 0x8000FF);
        worldMap = new myGame.WorldMap(this, myGame.cities);

        game.renderer.renderSession.roundPixels = true;
    }

    function update() {
    }

    function highlightCity(_, city) {
        console.log(city);
        city.frame = 1;
    }

})(window.Phaser, window.myGame);
