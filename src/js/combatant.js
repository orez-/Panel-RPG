window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Combatant = function (game, x, y, sprite) {
        Phaser.Group.call(this, game);
        this.sprite = this.add(game.add.sprite(0, 0, sprite));
        this.x = x;
        this.y = y;

        // this.health = 66;
        // this.active = 50;

        // this.attack = 10;
        // this.defense = 1;
    };
    Combatant.prototype = Object.create(Phaser.Group.prototype);
    Combatant.prototype.constructor = Combatant;
    Combatant.prototype.physicalDamage = function (amount) {
        this.damage(amount - this.defense);
    };

    Combatant.prototype.magicDamage = function (amount) {
        this.damage(amount)
    };

    Combatant.prototype.damage = function (amount) {
        this.health.value -= amount;
        if (this.health.value <= 0) {
            this.health.value = 0;
            this.active.value = 0;
            this.die();
        }
    };

    Combatant.prototype.die = function () {}

    Combatant.prototype.lungeTo = function (x, y, duration, cb) {
        // y is the height of the jump
        var moveX = this.game.add.tween(this);
        var moveY = this.game.add.tween(this);
        moveX.to({x: x}, duration);
        moveY.to({y: y}, duration, function (v) {
            return -v * (v - 1) * 4
        });

        moveY.onComplete.add(cb, this);
        moveX.start();
        moveY.start();
    }

    myGame.Combatant = Combatant;
})(window.Phaser, window.myGame);
