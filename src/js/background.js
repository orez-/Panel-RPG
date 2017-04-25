window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const Background = function (game) {
        Phaser.Group.call(this, game);
        this.x = 0;
        this.y = 21;
        this.leftPanel = this.add(new BackgroundSegment(game, 0));
        this.rightPanel = this.add(new BackgroundSegment(game, 1));
    };
    Background.prototype = Object.create(Phaser.Group.prototype);
    Background.prototype.constructor = Background;

    Background.prototype.beginScroll = function () {
        this.scrollLoop = this.game.time.events.loop(40, this.advanceScene, this);
    };

    Background.prototype.pauseScroll = function (argument) {
        this.game.time.events.remove(this.scrollLoop);
    }

    Background.prototype.advanceScene = function () {
        this.leftPanel.x -= 1;
        this.rightPanel.x -= 1;
        if (this.rightPanel.x <= 0) {
            this.leftPanel.x += 200;
            [this.leftPanel, this.rightPanel] = [this.rightPanel, this.leftPanel];
        }
    };

    // ---

    const BackgroundSegment = function (game, x) {
        Phaser.Sprite.call(this, game, x * 200, 0, 'background');
    };
    BackgroundSegment.prototype = Object.create(Phaser.Sprite.prototype);
    BackgroundSegment.prototype.constructor = BackgroundSegment;
    myGame.Background = Background;
})(window.Phaser, window.myGame);
