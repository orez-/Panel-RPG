window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Adventurer = function (game, x, y) {
        myGame.Combatant.call(this, game, x, y, 'player');

        this.health = {value: 66, max: 100};
        this.magic = {value: 33, max: 100};
        this.active = {value: 50, max: 100};

        this.attack = 10;
        this.defense = 1;
    };
    Adventurer.prototype = Object.create(myGame.Combatant.prototype);
    Adventurer.prototype.constructor = Adventurer;

    Adventurer.prototype.beginBattleReady = function () {
        this.scrollLoop = this.game.time.events.loop(40, this.advanceActiveBar, this);
    };

    Adventurer.prototype.resetBattleReady = function (argument) {
        this.game.time.events.remove(this.scrollLoop);
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

    myGame.Adventurer = Adventurer;
})(window.Phaser, window.myGame);
