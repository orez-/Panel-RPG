window.myGame = window.myGame || {};


(function(Phaser, myGame) {
    const FRAMES_WIDTH = 6;

    function animationColumn(column, y0, y1, framesWidth) {
        var frames = [];
        for(var i=y0; i<=y1; i++) {
            frames.push(column + i * framesWidth);
        }
        return frames;
    };

    const Adventurer = function (game, x, y) {
        this.idleX = x;
        myGame.Combatant.call(this, game, x, y, 'player');

        this.sprite.animations.add('walk', animationColumn(1, 0, 5, FRAMES_WIDTH));
        this.sprite.animations.add('battleReady', animationColumn(2, 0, 2, FRAMES_WIDTH));
        this.sprite.animations.add('battleIdle', animationColumn(2, 2, 3, FRAMES_WIDTH));
        this.sprite.animations.add('attack', animationColumn(3, 0, 0, FRAMES_WIDTH));
        this.sprite.animations.add('cast', animationColumn(5, 0, 2, FRAMES_WIDTH));
        this.sprite.animations.add('die', animationColumn(4, 0, 2, FRAMES_WIDTH));
        this.sprite.animations.add('die2', animationColumn(4, 2, 4, FRAMES_WIDTH));  // variable fps
        this.sprite.animations.play('walk', 10, true);

        this.health = {value: 66, max: 100};
        this.magic = {value: 33, max: 100};
        this.active = {value: 50, max: 100};

        this.attack = 10;
        this.defense = 1;

        this.healEmitter = this.setupHealEmitter();
    };
    Adventurer.prototype = Object.create(myGame.Combatant.prototype);
    Adventurer.prototype.constructor = Adventurer;

    Adventurer.prototype.setupHealEmitter = function () {
        var emitter = this.add(this.game.add.emitter(10, 0, 100));

        emitter.makeParticles('healMagic');

        emitter.minParticleSpeed.setTo(-20, 10);
        emitter.maxParticleSpeed.setTo(20, 10);
        emitter.minParticleScale = 1;
        emitter.maxParticleScale = 1;
        return emitter
    }

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

    Adventurer.prototype.damageMagicAnimation = function (cb) {
        const WIDTH = 3;
        this.sprite.animations.play('cast', 10).onComplete.addOnce(function () {
            var sprite = this.add(this.game.add.sprite(32, 0, 'damageMagic'));
            sprite.animations.add('circle', animationColumn(0, 0, 6, WIDTH));
            sprite.animations.add('open', animationColumn(1, 0, 3, WIDTH));
            sprite.animations.add('close', animationColumn(2, 0, 3, WIDTH));
            sprite.play('circle', 20).onComplete.add(function () {
                sprite.play('open', 30).onComplete.add(function () {
                    sprite.play('close', 20).onComplete.add(function () {
                        if (cb) {
                            cb();
                        }
                        sprite.destroy()
                        this.sprite.animations.play('battleIdle', 1, true);
                    }, this);
                }, this);
            }, this);
        }, this);
    }

    Adventurer.prototype.healAnimation = function (cb) {
        this.sprite.animations.play('cast', 10).onComplete.addOnce(function () {
            //  This will emit a quantity of 2 particles every 200ms, 10 times.
            // Each particle will live for 600ms.
            var timeToLive = 1500;
            this.healEmitter.flow(600, 200, 2, 10);
            this.game.time.events.add(timeToLive, function () {
                if (cb) {
                    cb();
                }
                this.sprite.animations.play('battleIdle', 1, true);
            }, this);
        }, this);
    }

    myGame.Adventurer = Adventurer;
})(window.Phaser, window.myGame);
