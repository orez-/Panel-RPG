"use strict";
window.myGame = window.myGame || {};

const NUM_ICONS = 5;
(function(Phaser, myGame) {

    const Button = function (game, x, buttonId, key) {
        Phaser.Sprite.call(this, game, x * 19, 0, 'button');

        this.key = key;
        this.frameColumn = buttonId;
        this.frame = this.frameColumn;
        this.disabled = false;
        this.inputEnabled = true;
        this.events.onInputDown.add(this.down, this);
        this.events.onInputUp.add(this.up, this);
    };
    Button.prototype = Object.create(Phaser.Sprite.prototype);
    Button.prototype.constructor = Button;

    Button.prototype.up = function () {
        if (!this.disabled) {
            this.parent.setSelected(this);
        }
    };

    Button.prototype.down = function () {
        if (!this.disabled) {
            this.frame = this.frameColumn + NUM_ICONS;
        }
    };

    Button.prototype.select = function () {
        if (!this.disabled) {
            this.frame = this.frameColumn + NUM_ICONS * 2;
            return true;
        }
        return false;
    };

    Button.prototype.deselect = function () {
        this.frame = this.frameColumn;
    };

    Button.prototype.enable = function() {
        this.disabled = false;
        this.frame = this.frameColumn;
    };

    Button.prototype.disable = function() {
        this.disabled = true;
        this.frame = this.frameColumn + NUM_ICONS * 3;
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

    ButtonGroup.prototype.getButton = function(button) {
        var buttonLookup = this.buttons[button];
        if (!buttonLookup) {
            return button;
        }
        return buttonLookup;
    };

    ButtonGroup.prototype.deselect = function() {
        var lastSelection = null;
        if (this.selected) {
            lastSelection = this.selected.key;
            this.selected.deselect();
            this.selected = null;
        }
        return lastSelection;
    };

    ButtonGroup.prototype.setSelected = function (button) {
        // Can either pass a button object or the name of a button
        var newSelected = this.getButton(button);
        var success = newSelected.select();
        if (!success) {
            return false;
        }
        if (this.selected && this.selected.key === newSelected.key) {
            return newSelected.key;
        }
        var lastSelection = this.deselect();
        this.selected = newSelected;
        if (this.parent.onButtonChange) {
            this.parent.onButtonChange(this.selected.key);
        }
        return lastSelection;
    };

    ButtonGroup.prototype.setEnableStatus = function(button, enabled) {
        button = this.getButton(button);
        if (enabled) {
            button.enable();
        }
        else {
            button.disable();
            if (this.selected && this.selected.key === button.key) {
                this.selected = null;
            }
        }
    };

    myGame.Button = Button;
    myGame.ButtonGroup = ButtonGroup;
})(window.Phaser, window.myGame);
