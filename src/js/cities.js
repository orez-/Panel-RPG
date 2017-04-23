window.myGame = window.myGame || {};

(function(Phaser, myGame) {
    myGame.citiesData = {
        cities: [
            {x: 28, y: 112, name: "One"},
            {x: 105, y: 82, name: "Two"},
            {x: 247, y: 61, name: "Three"},
            {x: 335, y: 80, name: "Foo"},
            {x: 192, y: 111, name: "Baz"},
            {x: 93, y: 131, name: "Bar"},
            {x: 271, y: 137, name: "Bang"},
            {x: 139, y: 163, name: "Bazinga"},
            {x: 242, y: 169, name: "Zamboni"},
            {x: 198, y: 185, name: "Zimbabwe"},
            {x: 78, y: 205, name: "Zambia"},
            {x: 319, y: 198, name: "Zaire"},
            {x: 254, y: 223, name: "Zoombini"},
            {x: 197, y: 243, name: "Bob Saget"},
            {x: 140, y: 284, name: "Salamander"},
            {x: 246, y: 297, name: "Sim City"},
            {x: 327, y: 313, name: "Summarily"},
            {x: 198, y: 352, name: "Soonish"},
        ],
        citiesByName: {},  // populated below
        _paths: {  // {departing: {arriving: path}}
            One: {
                Bar: {waypoints: []},
                Foo: {waypoints: [{x: 0, y: 95}, 'dateline', {x: 400, y: 90}]},
                Two: {},
                Zambia: {},
            },
            Two: {
                One: null,
                Bar: {},
                Baz: {},
            },
            Three: {
                Baz: {},
                Bang: {},
                Foo: {},
            },
            Foo: {
                Three: {},
                Bang: {},
                One: null,
            },
            Baz: {
                Bar: {},
                Two: null,
                Zimbabwe: {},
                Three: null,
                Bang: {},
            },
            Bar: {
                Baz: null,
                One: null,
                Two: null,
                Bazinga: {},
            },
            Bang: {
                Zamboni: {},
                Zaire: {},
                Baz: null,
                Three: null,
                Foo: null,
            },
            Bazinga: {
                Bar: null,
                Zambia: {},
                Zimbabwe: {},
            },
            Zamboni: {
                Zimbabwe: {},
                Bang: null,
                Zoombini: {},
            },
            Zimbabwe: {
                Baz: null,
                Zamboni: null,
                Bazinga: null,
                "Bob Saget": {},
                Zoombini: {},
            },
            Zambia: {
                One: null,
                Bazinga: null,
                "Bob Saget": {},
                Salamander: {},
                Zaire: {waypoints: [{x: 0, y: 205}, 'dateline', {x: 400, y: 203}]},
                Summarily: {waypoints: [{x: 0, y: 263}, 'dateline', {x: 400, y: 260}]},
            },
            Zaire: {
                Bang: null,
                Zoombini: {},
                Zambia: null,
            },
            Zoombini: {
                Zimbabwe: null,
                Zamboni: null,
                Zaire: null,
                Summarily: {},
                "Sim City": {},
            },
            "Bob Saget": {
                Salamander: {},
                Zambia: null,
                Zimbabwe: null,
                "Sim City": {},
            },
            Salamander: {
                Summarily: {waypoints: [{x: 0, y: 312}, 'dateline', {x: 400, y: 312}]},
                Zambia: null,
                "Bob Saget": null,
                Soonish: {},
            },
            "Sim City": {
                Soonish: {},
                "Bob Saget": null,
                Zoombini: null,
                Summarily: {},
            },
            Summarily: {
                "Sim City": null,
                Zoombini: null,
                Soonish: {},
                Zambia: null,
                Salamander: null,
            },
            Soonish: {
                Salamander: null,
                "Sim City": null,
                Summarily: null,
            },
        },
        pathsFrom: function (cityName) {
            var paths = this._paths[cityName];
            if (!paths) {
                if (!this.citiesByName[cityName]) {
                    throw Error("no city with name " + cityName);
                }
                return [];
            }
            return paths;
        }
    };

    // Populate citiesByName
    myGame.citiesData.cities.forEach(function (city) {
        myGame.citiesData.citiesByName[city.name] = city;
    });

    // Fill out paths
    Object.keys(myGame.citiesData._paths).forEach(function (departing) {
        var departingCity = myGame.citiesData.citiesByName[departing];
        var paths = myGame.citiesData._paths[departing];
        Object.keys(paths).forEach(function (arriving) {
            var arrivingCity = myGame.citiesData.citiesByName[arriving];
            var path = paths[arriving];
            if (!path) {  // we'll backfill you later
                return;
            }
            path.waypoints = path.waypoints || [];

            // Add start and end coordinates to waypoints
            path.waypoints.unshift({x: departingCity.x, y: departingCity.y});
            path.waypoints.push({x: arrivingCity.x, y: arrivingCity.y});

            // Add arriving + departing attrs
            path.departing = departing;
            path.arriving = arriving;

            // Calculate distance on paths for bfs
        });
    });
    // Backfill reverse paths
    Object.keys(myGame.citiesData._paths).forEach(function (departing) {
        var departingCity = myGame.citiesData.citiesByName[departing];
        var paths = myGame.citiesData._paths[departing];
        Object.keys(paths).forEach(function (arriving) {
            var arrivingCity = myGame.citiesData.citiesByName[arriving];
            var path = paths[arriving];
            var reversePath = myGame.citiesData._paths[arriving][departing];
            if (!path && !reversePath) {
                throw Error("no definition for path or its reverse " + arriving + " " + departing);
            }
            if (!path) {
                paths[arriving] = {
                    waypoints: reversePath.waypoints.slice().reverse(),
                    arriving: reversePath.departing,
                    departing: reversePath.arriving,
                };
            }
            else if (!reversePath) {
                myGame.citiesData._paths[arriving][departing] = {
                    waypoints: path.waypoints.slice().reverse(),
                    arriving: path.departing,
                    departing: path.arriving,
                };
            }
        });
    });
})(window.Phaser, window.myGame);
