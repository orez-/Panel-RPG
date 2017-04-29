"use strict";
window.myGame = window.myGame || {};

(function(Phaser, myGame) {

    myGame.Util = {
        getUnitVector: function (pt1, pt2) {  // XXX: bad name
            var distance = Phaser.Math.distance(pt1.x, pt1.y, pt2.x, pt2.y);
            return {
                distance: distance,
                unitVector: new Phaser.Point((pt2.x - pt1.x) / distance, (pt2.y - pt1.x) / distance),
            };
        }
    };

})(window.Phaser, window.myGame);
