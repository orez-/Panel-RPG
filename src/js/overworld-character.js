window.myGame = window.myGame || {};

const DISTANCE_EPSILON = 25;
const MOVE_SPEED = 30;
const NUM_CHARS = 6;
(function(Phaser, myGame) {

    const OverworldCharacter = function (game, playerId, startingCity) {
        Phaser.Sprite.call(this, game, startingCity.x, startingCity.y, 'charIcon');
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.frame = playerId;
        this.playerId = playerId;

        this.mapLocation = startingCity;
        this.embark();
    };
    OverworldCharacter.prototype = Object.create(Phaser.Sprite.prototype);
    OverworldCharacter.prototype.constructor = OverworldCharacter;

    OverworldCharacter.prototype.highlight = function () {
        this.frame = this.playerId + NUM_CHARS;
    };

    OverworldCharacter.prototype.dehighlight = function () {
        this.frame = this.playerId;
    };

    OverworldCharacter.prototype.embark = function() {
        var possiblePaths = myGame.citiesData.pathsFrom(this.mapLocation.name);
        var key = Phaser.ArrayUtils.getRandomItem(Object.keys(possiblePaths));
        if (!key) {return;}
        var path = possiblePaths[key];
        this.mapLocation = myGame.citiesData.citiesByName[path.arriving];

        // Phaser prepends the current location to the waypoint list,
        // so we have to clone it.
        // wtf phaser
        var tweenData = {
            x: path.tweenData.x.slice(),
            y: path.tweenData.y.slice(),
        };

        this.game.add.tween(this).to(tweenData, 1000, path.tweenData.easingFunction, true)
            .interpolation(Phaser.Math.catmullRomInterpolation)
            .onComplete.addOnce(this.embark, this);
    };

    myGame.OverworldCharacter = OverworldCharacter;
})(window.Phaser, window.myGame);
