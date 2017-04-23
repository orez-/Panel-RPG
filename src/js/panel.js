window.myGame = window.myGame || {};

const BAR_WIDTH = 48;
(function(Phaser, myGame) {
    const Bar = function (panel, context, key, color, y) {
        this.graphics = panel.graphics;
        this.color = color;
        this.y = y;
        this.context = context;
        this.key = key;
    };

    Bar.prototype.render = function () {
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(21, this.y, this.context[this.key] / 100 * BAR_WIDTH, 3);
    };

    const Panel = function (game, x, y, color, playerId) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;

        var hud = game.add.sprite(0, 0, 'panelHud');
        this.add(hud);

        var icon = game.add.sprite(3, 3, 'charIcon');
        icon.frame = playerId + 6;
        this.add(icon);

        this.buttonGroup = this.add(new myGame.ButtonGroup(game, 122, 0));

        this.graphics = game.add.graphics(0, 0, this);

        this.background = this.add(new myGame.Background(game));
        this.adventurer = this.add(new myGame.Adventurer(game, 16, 95));

        this.bars = [
            new Bar(this, this.adventurer, 'health', 0xCC0000, 4),
            new Bar(this, this.adventurer, 'magic', 0x0066CC, 9),
            new Bar(this, this.adventurer, 'active', 0x009900, 14),
        ];
    };
    Panel.prototype = Object.create(Phaser.Group.prototype);
    Panel.prototype.constructor = Panel;

    Panel.prototype.performAction = function () {
        this.buttonGroup.setSelected('attack');
    }

    // no render fn?
    Panel.prototype.update = function () {
        this.graphics.clear();
        this.bars.forEach(function (bar) {
            bar.render();
        });
    };
    myGame.Panel = Panel;
})(window.Phaser, window.myGame);
