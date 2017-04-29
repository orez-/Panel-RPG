"use strict";
window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    const fontStyle = { font: "12px Arial", fill: "#eeeeee", align: "center" };

    const WorldMap = function (game, citiesData, panels) {
        Phaser.Group.call(this, game);
        this.x = 200;
        this.y = 0;
        this.add(game.add.sprite(0, 0, 'map'));

        citiesData.cities.forEach((cityData) => {
            var text = game.add.text(cityData.x, cityData.y, cityData.name, fontStyle, this);
            text.visible = false;
            var city = new myGame.City(game, cityData, text);
            this.add(city);
            text.anchor.x = 0.5;
            text.anchor.y = 1.125;
        });

        this.characters = [];
        for (var i=0; i<6; i++) {
            var city = citiesData.cities[i];
            var character = this.add(new myGame.OverworldCharacter(game, i, city));
            this.characters.push(character);
            panels[i].worldCharacter = character;
        }
    };
    WorldMap.prototype = Object.create(Phaser.Group.prototype);
    WorldMap.prototype.constructor = WorldMap;
    myGame.WorldMap = WorldMap;
})(window.Phaser, window.myGame);
