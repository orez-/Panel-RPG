window.myGame = window.myGame || {};

const DISTANCE_EPSILON = 25;
const MOVE_SPEED = 30;
const NUM_CHARS = 6;
(function(Phaser, myGame) {

    const OverworldCharacter = function (game, playerId, startingCity) {
        Phaser.Sprite.call(this, game, startingCity.x, startingCity.y, 'charIcon');
        game.physics.arcade.enable(this);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.frame = playerId;
        this.playerId = playerId;

        this.mapLocation = startingCity;
        this.currentGoal = null;
        this.pathIndex = 0;
    };
    OverworldCharacter.prototype = Object.create(Phaser.Sprite.prototype);
    OverworldCharacter.prototype.constructor = OverworldCharacter;

    OverworldCharacter.prototype.highlight = function () {
        this.frame = this.playerId + NUM_CHARS;
    };

    OverworldCharacter.prototype.dehighlight = function () {
        this.frame = this.playerId;
    };

    OverworldCharacter.prototype.update = function () {
        if (!this.currentGoal) {
            var possiblePaths = myGame.citiesData.pathsFrom(this.mapLocation.name);
            var key = Phaser.ArrayUtils.getRandomItem(Object.keys(possiblePaths));
            if (!key) {return;}
            // console.log(this.frame + " next stop: ", key);
            this.mapLocation = possiblePaths[key];
            this.pathIndex = 0;
            this.currentGoal = this.mapLocation.waypoints[0];
            this.game.physics.arcade.moveToXY(this, this.currentGoal.x, this.currentGoal.y, MOVE_SPEED);
        }

        if (Phaser.Math.distanceSq(this.currentGoal.x, this.currentGoal.y, this.x, this.y) < DISTANCE_EPSILON) {
            // You made it!
            // XXX: http://www.html5gamedevs.com/topic/7332-how-to-stop-moveto/
            // ehhh this really oughtta be a tween
            this.x = this.currentGoal.x;
            this.y = this.currentGoal.y;
            this.pathIndex++;
            if (this.pathIndex < this.mapLocation.waypoints.length) {
                // Next in path
                this.currentGoal = this.mapLocation.waypoints[this.pathIndex];
                if (this.currentGoal == 'dateline') {  // special case teleport across the dateline
                    var teleport = this.mapLocation.waypoints[this.pathIndex + 1];
                    this.x = teleport.x;
                    this.y = teleport.y;
                    this.pathIndex += 2;
                    this.currentGoal = this.mapLocation.waypoints[this.pathIndex];
                }
                this.game.physics.arcade.moveToXY(this, this.currentGoal.x, this.currentGoal.y, MOVE_SPEED);
            }
            else {
                // In city
                this.mapLocation = myGame.citiesData.citiesByName[this.mapLocation.arriving];
                // console.log(this.frame + " arriving in", this.mapLocation);
                this.currentGoal = null;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        }
    };

    myGame.OverworldCharacter = OverworldCharacter;
})(window.Phaser, window.myGame);
