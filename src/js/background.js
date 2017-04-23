window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Background = function (game) {
        Phaser.Sprite.call(this, game, 0, 21, 'background');
    };
    Background.prototype = Object.create(Phaser.Sprite.prototype);
    Background.prototype.constructor = Background;
    myGame.Background = Background;
})(window.Phaser, window.myGame);
