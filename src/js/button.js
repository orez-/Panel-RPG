window.myGame = window.myGame || {};

const NUM_ICONS = 5;
(function(Phaser, myGame) {

    const Button = function (game, x, buttonId, key) {
        Phaser.Sprite.call(this, game, x * 19, 0, 'button');

        this.key = key;
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
    };

    Button.prototype.down = function () {
        this.frame = this.frameColumn + NUM_ICONS;
    };

    Button.prototype.select = function () {
        this.frame = this.frameColumn + NUM_ICONS * 2;
    }

    Button.prototype.deselect = function () {
        this.frame = this.frameColumn;
    };

    // --

    const ButtonGroup = function (game, x, y) {
        Phaser.Group.call(this, game);
        this.x = x;
        this.y = y;

        this.buttons = {
            attack: this.add(new myGame.Button(game, 0, 1, 'attack')),
            damageMagic: this.add(new myGame.Button(game, 1, 4, 'damageMagic')),
            healMagic: this.add(new myGame.Button(game, 2, 3, 'healMagic')),
            potion: this.add(new myGame.Button(game, 3, 2, 'potion')),
        };
        this.setSelected('attack');
    };
    ButtonGroup.prototype = Object.create(Phaser.Group.prototype);
    ButtonGroup.prototype.constructor = ButtonGroup;

    ButtonGroup.prototype.setSelected = function (button) {
        // Can either pass a button object or the name of a button
        var lastSelection = null;
        if (this.selected) {
            lastSelection = this.selected.key;
            this.selected.deselect();
        }
        var buttonLookup = this.buttons[button];
        if (!buttonLookup) {
            this.selected = button;
        }
        else {
            this.selected = buttonLookup;
        }
        this.selected.select();
        return lastSelection;
    };

    myGame.Button = Button;
    myGame.ButtonGroup = ButtonGroup;
})(window.Phaser, window.myGame);
