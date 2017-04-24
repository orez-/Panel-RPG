window.myGame = window.myGame || {};

const IDLE_X = 70;
(function(Phaser, myGame) {
    const Enemy = function (game) {
        var x = 200;
        var y = 95;
        myGame.Combatant.call(this, game, x, y, 'knife_goblin');

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
        console.log(this.game);
        myGame.Combatant.prototype.lungeTo.call(this, x, y, duration, newCb);
    }

    Enemy.prototype.enterAnimation = function (cb) {
        // Allow the enemy to make their entrance, after which the
        // callback is run.
        this.lungeTo(IDLE_X, 30, 750, () => {
            this.game.time.events.loop(40, this.advanceActiveBar, this);
            cb();
        });
    };

    Enemy.prototype.beginBattleReady = function () {
        this.healthBar = new myGame.Bar(
            this.game, this.graphics, this, 'health', 0xCC0000, 0x111111,
            // this.x, this.y, 32);
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

    // Again, no render fn?
    Enemy.prototype.update = function () {
        if (this.healthBar) {
            this.graphics.clear();
            this.healthBar.render();
        }
    }

    myGame.Enemy = Enemy;
})(window.Phaser, window.myGame);
