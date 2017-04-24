window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Combatant = function (game, x, y, sprite) {
        Phaser.Sprite.call(this, game, x, y, sprite);

        // this.health = 66;
        // this.active = 50;

        // this.attack = 10;
        // this.defense = 1;
    };
    Combatant.prototype = Object.create(Phaser.Sprite.prototype);
    Combatant.prototype.constructor = Combatant;
    Combatant.prototype.physicalDamage = function (amount) {
        this.health.value = Math.max(0, this.health.value - amount - this.defense);
    };

    myGame.Combatant = Combatant;
})(window.Phaser, window.myGame);
