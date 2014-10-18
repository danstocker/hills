/*global dessert, troop, sntls, evan, bookworm, shoeshine, app */
troop.postpone(app.model, 'TileDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.TileDocument.create
     * @function
     * @returns {app.model.TileDocument}
     */

    var tileTypesToTiles = sntls.StringDictionary.create({
        1 : '#', // crossing
        2 : '|', // straight road
        3 : '-', // elevated grass
        4 : '_', // low grass
        5 : '=', // asphalt
        6 : '~', // water
        7 : ',', // low dirt
        8 : '\'', // high dirt
        9 : '.', // sand
        10: '/', // diagonal ramp
        11: '\\', // flat ramp
        12: '1', // straight road in water
        13: 'i', // narrow road on ramp
        14: 'I', // wide road on ramp
        15: 't', // narrow t-section
        16: 'c', // turn
        17: 'U', // dead end
        18: 'E', // sidewalk
        19: 'T', // thick t-section
        20: 'L', // corner
        21: '[', // water with side grass
        22: '\"', // water with grass in corner
        23: '(', // water with grass on adjacent sides
        24: '$', // waterway with grass
        25: '{', // waterway turn in grass
        26: ']', // water with side sand
        27: '`', // water with sand in corner
        28: ')', // water with sand on adjacent sides
        29: '%', // waterway with sand
        30: '}' // waterway turn in sand
    });

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.TileDocument = self
        .addConstants(/** @lends app.model.TileDocument */{
            /** @constant */
            TILE_TYPE_LOW: 97,

            /** @constant */
            TILE_TYPE_HIGH: 100,

            /**
             * @type {sntls.StringDictionary}
             * @constant
             */
            tileTypesToTiles: tileTypesToTiles,

            /**
             * @type {sntls.StringDictionary}
             * @constant
             */
            tilesToTileTypes: tileTypesToTiles.reverse()
        })
        .addMethods(/** @lends app.model.TileDocument# */{
            /**
             * @param {string} tileType
             * @returns {app.model.TileDocument}
             */
            setTileType: function (tileType) {
                this.getField('type')
                    .setValue(tileType);
                return this;
            },

            /** @returns {app.model.TileDocument} */
            rotateClockwise: function () {
                var currentOrientation = this.getOrientation();
                this.setOrientation((currentOrientation + 90) % 360);
                return this;
            },

            /** @returns {app.model.TileDocument} */
            rotateCounterClockwise: function () {
                var currentOrientation = this.getOrientation();
                this.setOrientation((currentOrientation - 90) % 360);
                return this;
            },

            /** @returns {string} */
            getTileType: function () {
                return this.getField('type').getValue();
            },

            /**
             * @param {number} elevation 0, 1, 2
             * @returns {app.model.TileDocument}
             */
            setElevation: function (elevation) {
                this.getField('elevation')
                    .setValue(elevation);
                return this;
            },

            /** @returns {app.model.TileDocument} */
            raiseElevation: function () {
                var currentElevation = this.getElevation();

                if (currentElevation < 2) {
                    this.setElevation(currentElevation + 1);
                }

                return this;
            },

            /** @returns {app.model.TileDocument} */
            lowerElevation: function () {
                var tileDocument = this.entityKey.toDocument(),
                    currentElevation = tileDocument.getElevation();

                if (currentElevation > 0) {
                    this.setElevation(currentElevation - 1);
                }

                return this;
            },

            /** @returns {number} */
            getElevation: function () {
                return this.getField('elevation').getValue() || 0;
            },

            /**
             * @param {number} orientation Either 0, 90, 180, or 270.
             * @returns {app.model.TileDocument}
             */
            setOrientation: function (orientation) {
                this.getField('orientation')
                    .setValue(orientation);
                return this;
            },

            /**
             * @returns {number} Either 0, 90, 180, or 270. Default is 0.
             */
            getOrientation: function () {
                return this.getField('orientation').getValue() || 0;
            },

            /**
             * @param {string} mapString
             * @returns {app.model.TileDocument}
             * @memberOf app.model.TileDocument
             */
            createTileDocumentsFromString: function (mapString) {
                var that = this;

                mapString.split('')
                    .toCollection()
                    .forEachItem(function (tileType, tileIndex) {
                        ['tile', tileIndex].toDocument()
                            .setTileType(that.tilesToTileTypes.getItem(tileType));
                    });

                return this;
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Document
        .addSurrogate(model, 'TileDocument', function (documentKey) {
            return documentKey.documentType === 'tile';
        });
}, app.model);
