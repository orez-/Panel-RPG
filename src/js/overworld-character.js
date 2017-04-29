"use strict";
window.myGame = window.myGame || {};

const MOVE_SPEED = 5;
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

    OverworldCharacter.prototype.pause = function() {
        this.currentTween.pause();
    };

    OverworldCharacter.prototype.resume = function() {
        this.currentTween.resume();
    };

    OverworldCharacter.prototype.embark = function() {
        var possiblePaths = myGame.citiesData.pathsFrom(this.mapLocation.name);
        var key = Phaser.ArrayUtils.getRandomItem(Object.keys(possiblePaths));
        if (!key) {return;}
        var path = possiblePaths[key];
        this.mapLocation = myGame.citiesData.citiesByName[path.arriving];

        path.getTween(this, MOVE_SPEED).onComplete.addOnce(this.embark, this);
    };

    myGame.OverworldCharacter = OverworldCharacter;
})(window.Phaser, window.myGame);
