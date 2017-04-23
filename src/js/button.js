window.myGame = window.myGame || {};

const NUM_ICONS = 5;
(function(Phaser, myGame) {

    const Button = function (game, x, buttonId) {
        Phaser.Sprite.call(this, game, x * 19, 0, 'button');

        this.frameColumn = buttonId;
        this.frame = this.frameColumn;
        this.inputEnabled = true;
        this.events.onInputDown.add(this.down, this);
        this.events.onInputUp.add(this.up, this);
    };
    Button.prototype = Object.create(Phaser.Sprite.prototype);
    Button.prototype.constructor = Button;

    Button.prototype.up = function () {
        this.parent.setSelected(this);
        this.frame = this.frameColumn + NUM_ICONS * 2;
    };

    Button.prototype.down = function () {
        this.frame = this.frameColumn + NUM_ICONS;
    };

    Button.prototype.deselect = function () {
        this.frame = this.frameColumn;
    };

    const ButtonGroup = function (game, x, y) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;

        this.add(new myGame.Button(game, 0, 1));
        this.add(new myGame.Button(game, 1, 4));
        this.add(new myGame.Button(game, 2, 3));
        this.add(new myGame.Button(game, 3, 2));
        this.selected = null;
    };
    ButtonGroup.prototype = Object.create(Phaser.Group.prototype);
    ButtonGroup.prototype.constructor = ButtonGroup;

    ButtonGroup.prototype.setSelected = function (button) {
        if (this.selected) {
            this.selected.deselect();
        }
        this.selected = button;
    };

    myGame.Button = Button;
    myGame.ButtonGroup = ButtonGroup;
})(window.Phaser, window.myGame);
