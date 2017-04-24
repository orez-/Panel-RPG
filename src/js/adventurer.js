window.myGame = window.myGame || {};


(function(Phaser, myGame) {
    const FRAMES_WIDTH = 5;

    function animationColumn(column, y0, y1) {
        var frames = [];
        for(var i=y0; i<=y1; i++) {
            frames.push(column + i * FRAMES_WIDTH);
        }
        return frames;
    };

    const Adventurer = function (game, x, y) {
        this.idleX = x;
        myGame.Combatant.call(this, game, x, y, 'player');

        this.sprite.animations.add('walk', animationColumn(1, 0, 5));
        this.sprite.animations.add('battleReady', animationColumn(2, 0, 2));
        this.sprite.animations.add('battleIdle', animationColumn(2, 2, 3));
        this.sprite.animations.add('attack', animationColumn(3, 0, 0));
        this.sprite.animations.add('die', animationColumn(4, 0, 2));
        this.sprite.animations.add('die2', animationColumn(4, 2, 4));  // variable fps
        this.sprite.animations.play('walk', 10, true);

        this.health = {value: 66, max: 100};
        this.magic = {value: 33, max: 100};
        this.active = {value: 50, max: 100};

        this.attack = 10;
        this.defense = 1;
    };
    Adventurer.prototype = Object.create(myGame.Combatant.prototype);
    Adventurer.prototype.constructor = Adventurer;

    Adventurer.prototype.beginBattleAnimation = function () {
        this.sprite.animations.play('battleReady', 10).onComplete.add(function () {
            this.sprite.animations.play('battleIdle', 1, true);
        }, this);
    };
    Adventurer.prototype.beginBattleReady = function () {
        this.activeTimer = this.game.time.events.loop(40, this.advanceActiveBar, this);
    };

    Adventurer.prototype.resetBattleReady = function (argument) {
        this.game.time.events.remove(this.activeTimer);
    }

    Adventurer.prototype.advanceActiveBar = function () {
        this.active.value++;
        if (this.active.value >= this.active.max) {
            this.active.value = 0;
            this.parent.performAction();
            // Do the selected action
            // Reset the action to the default: attack
        }
    };

    Adventurer.prototype.die = function () {
        this.game.time.events.remove(this.activeTimer);
        this.active.value = 0;
        this.deathAnimation();
    }

    Adventurer.prototype.deathAnimation = function () {
        this.sprite.animations.play('die', 10).onComplete.add(function () {
            this.sprite.animations.play('die2', 2);
        }, this);
    }

    Adventurer.prototype.attackAnimation = function (cb) {
        this.sprite.animations.play('attack', 10);
        var moveX = this.game.add.tween(this);
        moveX.onComplete.add(function () {
            cb();
            this.sprite.animations.play('battleIdle', 1, true);
            var moveBack = this.game.add.tween(this);
            moveBack.to({x: this.idleX}, 100).start();
        }, this);
        moveX.to({x: 65}, 100).start();
    }

    myGame.Adventurer = Adventurer;
})(window.Phaser, window.myGame);
