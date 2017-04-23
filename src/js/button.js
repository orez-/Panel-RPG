window.myGame = window.myGame || {};


const NUM_ICONS = 5;
(function(Phaser, myGame) {

    const Button = function (game, x, y, buttonId) {
        Phaser.Sprite.call(this, game, x, y, 'button');

        this.frameColumn = buttonId;
        this.frame = this.frameColumn;
        this.inputEnabled = true;
        this.events.onInputDown.add(this.down, this);
        this.events.onInputUp.add(this.up, this);
    };
    Button.prototype = Object.create(Phaser.Sprite.prototype);
    Button.prototype.constructor = Button;

    Button.prototype.up = function () {
        this.frame = this.frameColumn + NUM_ICONS * 2;
    };

    Button.prototype.down = function () {
        this.frame = this.frameColumn + NUM_ICONS;
    }
    myGame.Button = Button;
})(window.Phaser, window.myGame);
