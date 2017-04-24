window.myGame = window.myGame || {};

const State = {
    WALKING: 1,
    BATTLE: 2,
};
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
        var rawValue = this.context[this.key];
        var value = Phaser.Math.clamp(rawValue.value, 0, rawValue.max);
        this.graphics.drawRect(21, this.y, value / rawValue.max * BAR_WIDTH, 3);
    };

    const Panel = function (game, x, y, playerId) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.worldCharacter = null;  // set in world-map.js

        this.area = this.add(game.add.sprite(0, 0, null));
        this.area.width = 200;
        this.area.height = 133;

        this.state = State.WALKING;

        this.add(game.add.sprite(0, 0, 'panelHud'));
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

        this.area.inputEnabled = true;
        this.area.events.onInputOver.add(this.over, this);
        this.area.events.onInputOut.add(this.out, this);
    };
    Panel.prototype = Object.create(Phaser.Group.prototype);
    Panel.prototype.constructor = Panel;

    Panel.prototype.performAction = function () {
        this.buttonGroup.setSelected('attack');
    }

    Panel.prototype.over = function () {
        this.worldCharacter.highlight();
    }

    Panel.prototype.out = function () {
        this.worldCharacter.dehighlight();
    }

    Panel.prototype.setState = function (state) {
        var stateLookup = State[state];
        if (stateLookup) {
            state = stateLookup;
        }
        this.state = state;
        console.log(this.background.moveLoop);
        if (this.state === State.WALKING) {
            this.background.beginScroll();
            this.adventurer.resetBattleReady();
        }
        else if (this.state === State.BATTLE) {
            this.background.pauseScroll();
            this.adventurer.beginBattleReady();
        }
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
