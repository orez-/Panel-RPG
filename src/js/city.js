window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const City = function (game, cityData) {
        Phaser.Sprite.call(this, game, cityData.x, cityData.y, 'city');
        game.physics.arcade.enable(this);  // gross, what? need this for mouse detection 🤦
        this.body.immovable = true;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };
    City.prototype = Object.create(Phaser.Sprite.prototype);
    City.prototype.constructor = City;
    myGame.City = City;
})(window.Phaser, window.myGame);
