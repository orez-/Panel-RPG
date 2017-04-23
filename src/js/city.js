window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const City = function (game, cityData) {
        Phaser.Sprite.call(this, game, cityData.x, cityData.y, 'city');
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.inputEnabled = true;
        this.events.onInputOver.add(this.over, this);
        this.events.onInputOut.add(this.out, this);
    };
    City.prototype = Object.create(Phaser.Sprite.prototype);
    City.prototype.constructor = City;

    City.prototype.over = function () {
        this.frame = 1;
    };

    City.prototype.out = function () {
        this.frame = 0;
    };
    myGame.City = City;
})(window.Phaser, window.myGame);
