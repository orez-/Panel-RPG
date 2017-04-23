window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Adventurer = function (game, x, y) {
        Phaser.Sprite.call(this, game, x, y, 'player');

        this.health = 66;
        this.magic = 33;
        this.active = 50;

        game.time.events.loop(40, this.advanceActiveBar, this);
    };
    Adventurer.prototype = Object.create(Phaser.Sprite.prototype);
    Adventurer.prototype.constructor = Adventurer;

    Adventurer.prototype.advanceActiveBar = function () {
        this.active++;
        if (this.active >= 100) {
            this.active = 0;
            this.parent.performAction();
            // Do the selected action
            // Reset the action to the default: attack
        }
    };

    myGame.Adventurer = Adventurer;
})(window.Phaser, window.myGame);
