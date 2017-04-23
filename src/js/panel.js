window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Panel = function (game, x, y, color, playerId) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;
        graphics = game.add.graphics(0, 0, this);
        graphics.beginFill(color);
        graphics.drawRect(0, 0, 200, 133);

        this.adventurer = new myGame.Adventurer(game, 16, 95);
        this.add(this.adventurer);

        var hud = game.add.sprite(0, 0, 'panelHud');
        this.add(hud);

        var icon = game.add.sprite(3, 3, 'charIcon');
        icon.frame = playerId + 6;
        this.add(icon);

        var button = new myGame.Button(game, 178, 0, 2);
        this.add(button);
        button = new myGame.Button(game, 178 - 19, 0, 4);
        this.add(button);
        button = new myGame.Button(game, 178 - 38, 0, 3);
        this.add(button);
        button = new myGame.Button(game, 178 - 57, 0, 1);
        this.add(button);
    };
    Panel.prototype = Object.create(Phaser.Group.prototype);
    Panel.prototype.constructor = Panel;
    myGame.Panel = Panel;
})(window.Phaser, window.myGame);
