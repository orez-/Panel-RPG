window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Enemy = function (game) {
        var x = 200;
        var y = 95;
        Phaser.Sprite.call(this, game, x, y, 'knife_goblin');
        this.frame = 1;

        this.health = {value: 66, max: 100};
        this.active = {value: 50, max: 100};

        this.attack = 5;
        this.defense = 0;

    };
    Enemy.prototype = Object.create(Phaser.Sprite.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.enter = function (cb) {
        // Allow the enemy to make their entrance, after which the
        // callback is run.
        var moveX = this.game.add.tween(this);
        var moveY = this.game.add.tween(this);
        moveX.to({x: 70}, 1000);
        moveY.to({y: 30}, 1000, function (v) {
            return -v * (v - 1) * 4
        });

        moveY.onComplete.add(function () {
            this.frame = 0;
            this.game.time.events.loop(40, this.advanceActiveBar, this);
            cb();
        }, this);
        moveX.start();
        moveY.start();
    }

    Enemy.prototype.advanceActiveBar = function () {
        this.active.value++;
        if (this.active.value >= this.active.max) {
            this.active.value = 0;
            console.log("Knife goblin attack!");
            // this.parent.performAction();
        }
    };

    myGame.Enemy = Enemy;
})(window.Phaser, window.myGame);
