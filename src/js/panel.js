window.myGame = window.myGame || {};

const State = {
    WALKING: 1,
    BATTLE: 2,
};
(function(Phaser, myGame) {
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

        this.background = this.add(new myGame.Background(game));
        this.adventurer = this.add(new myGame.Adventurer(game, 16, 95));

        this.enemy = this.add(new myGame.Enemy(game));

        this.graphics = game.add.graphics(0, 0, this);
        this.bars = [
            new myGame.Bar(
                game, this.graphics, this.adventurer, 'health', 0xCC0000, 0x545454, 21, 4, 48),
            new myGame.Bar(
                game, this.graphics, this.adventurer, 'magic', 0x0066CC, 0x545454, 21, 9, 48),
            new myGame.Bar(
                game, this.graphics, this.adventurer, 'active', 0x009900, 0x545454, 21, 14, 48),
        ];

        this.area.inputEnabled = true;
        this.area.events.onInputOver.add(this.over, this);
        this.area.events.onInputOut.add(this.out, this);
    };
    Panel.prototype = Object.create(Phaser.Group.prototype);
    Panel.prototype.constructor = Panel;

    Panel.prototype.performAction = function () {
        var action = this.buttonGroup.setSelected('attack');
        if (action === 'attack') {
            this.enemy.physicalDamage(this.adventurer.attack);
        }
    }

    Panel.prototype.enemyAttack = function () {
        this.enemy.attackAnimation(() => {
            this.adventurer.physicalDamage(this.enemy.attack);
        });
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
        if (this.state === State.WALKING) {
            this.background.beginScroll();
            this.adventurer.resetBattleReady();
        }
        else if (this.state === State.BATTLE) {
            this.enemy.enterAnimation(() => {
                this.background.pauseScroll();
                this.adventurer.beginBattleReady();
                this.enemy.beginBattleReady();
            });
        }
    }

    // no render fn?
    Panel.prototype.update = function () {
        this.graphics.clear();
        this.enemy.update();
        this.bars.forEach(function (bar) {
            bar.render();
        });
    };
    myGame.Panel = Panel;
})(window.Phaser, window.myGame);
