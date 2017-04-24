window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Bar = function (game, graphics, context, key, color, barColor, x, y, width) {
        this.game = game;
        this.graphics = graphics;
        this.color = color;
        this.barColor = barColor;
        this.mainColor = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.context = context;
        this.key = key;
    };

    Bar.prototype.render = function () {
        var rawValue = this.context[this.key];
        var value = Phaser.Math.clamp(rawValue.value, 0, rawValue.max);
        var width = value / rawValue.max * this.width;
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(this.x, this.y, width, 3);
        this.graphics.beginFill(this.barColor);
        this.graphics.drawRect(this.x + width, this.y, this.width - width, 3);
    };

    Bar.prototype.flash = function () {
        // Flash the bar quickly to call attention to it.
        var colorBlend = {step: 0};
        var duration = 1000;
        var endColor = 0xffffff;
        var timesToFlash = 2;
        this.game.add.tween(colorBlend).to({step: 100}, duration, function (v) {
            return (Math.sin((timesToFlash * 2 * v - 0.5) * Math.PI) + 1 ) / 2;
        }, false)
        .onUpdateCallback(() => {
            this.color = Phaser.Color.interpolateColor(this.mainColor, endColor, 100, colorBlend.step, 1);
        })
        .start()
    }

    myGame.Bar = Bar;
})(window.Phaser, window.myGame);
