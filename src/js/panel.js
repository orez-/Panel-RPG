window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Panel = function (game, x, y, color) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;
        graphics = game.add.graphics(0, 0, this);
        graphics.beginFill(color);
        graphics.drawRect(0, 0, 200, 133);

        this.adventurer = new myGame.Adventurer(game, 16, 95);
        this.add(this.adventurer);
    };
    Panel.prototype = Object.create(Phaser.Group.prototype);
    Panel.prototype.constructor = Panel;
    myGame.Panel = Panel;
})(window.Phaser, window.myGame);
