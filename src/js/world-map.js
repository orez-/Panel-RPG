window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const WorldMap = function (game, cities) {
        Phaser.Group.call(this, game);
        this.x = 200;
        this.y = 0;
        this.add(game.add.sprite(0, 0, 'map'));

        cities.forEach((city) => {
            this.add(new myGame.City(game, city));
        });
    };
    WorldMap.prototype = Object.create(Phaser.Group.prototype);
    WorldMap.prototype.constructor = WorldMap;
    myGame.WorldMap = WorldMap;
})(window.Phaser, window.myGame);
