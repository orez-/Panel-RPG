"use strict";
window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const DAMAGE_SPELL_COST = 20;
    const HEAL_SPELL_COST = 20;

    const Panel = function (game, x, y, playerId) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;
        this.playerId = playerId;
        this.worldCharacter = null;  // set in world-map.js

        // XXX: this blocks button clicks so it needs to be below them,
        // but that also means the buttons swallow these events
        this.area = this.add(game.add.sprite(0, 0, null));
        this.area.width = 200;
        this.area.height = 133;

        this.add(game.add.sprite(0, 0, 'panelHud'));
        var icon = game.add.sprite(3, 3, 'charIcon');
        icon.frame = playerId + 6;
        this.add(icon);

        this.buttonGroup = this.add(new myGame.ButtonGroup(game, 122, 0));

        this.background = this.add(new myGame.Background(game));
        this.adventurer = this.add(new myGame.Adventurer(game, 16, 95));

        this.enemy = null;

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

        this.setState(myGame.GameState.WALKING);
        this.scheduleRandomBattle();
    };
    Panel.prototype = Object.create(Phaser.Group.prototype);
    Panel.prototype.constructor = Panel;

    Panel.prototype.castSpell = function(magicCost) {
        this.adventurer.magic.value -= magicCost;
        this.buttonGroup.setEnableStatus('damageMagic', this.adventurer.magic.value >= DAMAGE_SPELL_COST);
        this.buttonGroup.setEnableStatus('healMagic', this.adventurer.magic.value >= HEAL_SPELL_COST);
    };

    Panel.prototype.onButtonChange = function(buttonKey) {
        if (this.state === myGame.GameState.WALKING && buttonKey) {
            this.setState('RESPITE');
            this.performAction();
        }
    };

    Panel.prototype.performAction = function () {
        var action = this.buttonGroup.deselect();
        this.buttonGroup.setSelected('attack');
        if (action === 'attack') {
            this.adventurer.attackAnimation(() => {
                var remainingHealth = this.enemy.physicalDamage(this.adventurer.attack);
                if (!remainingHealth) {
                    this.setState('VICTORY');
                }
            });
        }
        else if (action === 'damageMagic') {
            this.castSpell(DAMAGE_SPELL_COST);
            this.adventurer.damageMagicAnimation(() => {
                var remainingHealth = this.enemy.magicDamage(30);
                if (!remainingHealth) {
                    this.setState('VICTORY');
                }
            });
        }
        else if (action === 'healMagic') {
            this.castSpell(HEAL_SPELL_COST);
            this.adventurer.healAnimation(() => {
                this.adventurer.heal(50);
            });
        }
        else if (action === 'potion') {
            this.adventurer.quaffAnimation(() => {
                this.adventurer.heal(50);
            });
        }
    };

    Panel.prototype.scheduleRandomBattle = function() {
        this.game.time.events.add(
            this.game.rnd.integerInRange(10, 30) * Phaser.Timer.SECOND,
            function () {
                this.setState('BATTLE');
            },
            this
        );
    };

    Panel.prototype.enemyAttack = function () {
        this.enemy.attackAnimation(() => {
            var remainingHealth = this.adventurer.physicalDamage(this.enemy.attack);
            if (!remainingHealth) {
                this.setState('DEFEAT');
            }
        });
    };

    Panel.prototype.over = function () {
        this.worldCharacter.highlight();
    };

    Panel.prototype.out = function () {
        this.worldCharacter.dehighlight();
    };

    Panel.prototype.setState = function (state) {
        var stateLookup = myGame.GameState[state];
        if (stateLookup) {
            state = stateLookup;
        }
        this.state = state;
        if (this.state === myGame.GameState.WALKING) {
            if (this.worldCharacter) {
                this.worldCharacter.resume();
            }
            this.buttonGroup.deselect();
            this.background.beginScroll();
            this.adventurer.resetBattleReady();
            this.adventurer.walk();

            this.buttonGroup.setEnableStatus('attack', false);
            this.buttonGroup.setEnableStatus('damageMagic', false);
        }
        else if (this.state === myGame.GameState.BATTLE) {
            // TODO: this should probably be set before calling setState
            this.enemy = this.add(new myGame.Enemy(this.game));
            this.adventurer.beginBattleAnimation();
            this.background.pauseScroll();
            this.worldCharacter.pause();
            this.enemy.enterAnimation(() => {
                this.adventurer.beginBattleReady();
                this.enemy.beginBattleReady();
            });

            this.buttonGroup.setEnableStatus('attack', true);
            this.buttonGroup.setEnableStatus('damageMagic', this.adventurer.magic.value >= DAMAGE_SPELL_COST);
            this.buttonGroup.setSelected('attack');
        }
        else if (this.state === myGame.GameState.VICTORY) {
            this.adventurer.resetBattleReady();
        }
        else if (this.state === myGame.GameState.DEFEAT) {
            this.enemy.resetBattleReady();
        }
        else if (this.state === myGame.GameState.RESPITE) {
            this.background.pauseScroll();
            this.worldCharacter.pause();
        }
    };

    // no render fn?
    Panel.prototype.update = function () {
        this.graphics.clear();
        if (this.enemy) {
            this.enemy.update();
        }
        this.bars.forEach(function (bar) {
            bar.render();
        });
    };
    myGame.Panel = Panel;
    myGame.GameState = {
        WALKING: 1,
        BATTLE: 2,
        VICTORY: 3,
        DEFEAT: 4,
        RESPITE: 5,
    };
})(window.Phaser, window.myGame);
