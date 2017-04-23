window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Adventurer = function (game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'player');
    };
    Adventurer.prototype = Object.create(Phaser.Sprite.prototype);
    Adventurer.prototype.constructor = Adventurer;
    myGame.Adventurer = Adventurer;
})(window.Phaser, window.myGame);
