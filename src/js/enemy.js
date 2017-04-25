window.myGame = window.myGame || {};

const IDLE_X = 70;
(function(Phaser, myGame) {
    const Enemy = function (game) {
        var x = 200;
        var y = 95;
        myGame.Combatant.call(this, game, x, y, 'knife_goblin');
        this.sprite.animations.add('die', [2, 5]);

        this.graphics = game.add.graphics(0, 0, this);

        this.health = {value: 35, max: 100};
        this.active = {value: 50, max: 100};

        this.attack = 5;
        this.defense = 0;

    };
    Enemy.prototype = Object.create(myGame.Combatant.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.lungeTo = function (x, y, duration, cb) {
        // Normal lunge but with animations
        this.sprite.frame = 1;
        var newCb = function() {
            this.sprite.frame = 0;
            cb();
        }
        myGame.Combatant.prototype.lungeTo.call(this, x, y, duration, newCb);
    }

    Enemy.prototype.enterAnimation = function (cb) {
        // Allow the enemy to make their entrance, after which the
        // callback is run.
        this.lungeTo(IDLE_X, 30, 750, () => {
            this.activeTimer = this.game.time.events.loop(40, this.advanceActiveBar, this);
            cb();
        });
    };

    Enemy.prototype.beginBattleReady = function () {
        this.healthBar = new myGame.Bar(
            this.game, this.graphics, this, 'health', 0xCC0000, 0x111111,
            0, 0, 32);
    }

    Enemy.prototype.attackAnimation = function (cb) {
        this.lungeTo(15, 70, 250, () => {
            var moveX = this.game.add.tween(this);
            moveX.to({x: IDLE_X}, 100).start();
            cb();
        });
    };

    Enemy.prototype.advanceActiveBar = function () {
        this.active.value++;
        if (this.active.value >= this.active.max) {
            this.active.value = 0;
            this.parent.enemyAttack();
        }
    };

    Enemy.prototype.die = function () {
        this.game.time.events.remove(this.activeTimer);
        this.active.value = 0;
        this.healthBar = null;
        this.sprite.animations.play('die', 5).onComplete.addOnce(function () {
            this.game.add.tween(this.sprite).to({alpha: 0}, 500, "Linear", true).onComplete.add(
                function () {
                    this.destroy();
                }, this
            );
        }, this);
    }

    // Again, no render fn?
    Enemy.prototype.update = function () {
        this.graphics.clear();
        if (this.healthBar) {
            this.healthBar.render();
        }
    }

    myGame.Enemy = Enemy;
})(window.Phaser, window.myGame);
