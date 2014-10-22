/*global dessert, troop, sntls, evan, bookworm, shoeshine, app */
troop.postpone(app.model, 'TileDocument', function (/**app.model*/model) {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.TileDocument.create
     * @function
     * @returns {app.model.TileDocument}
     */

    var orientationToSymbol = sntls.StringDictionary.create({
            0  : '>',
            90 : '^',
            180: '<',
            270: '~'
        }),
        elevationToSymbol = sntls.StringDictionary.create({
            0: '_',
            1: '-',
            2: '^'
        });

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.TileDocument = self
        .addConstants(/** @lends app.model.TileDocument */{
            /**
             * @type {sntls.StringDictionary}
             * @constant
             */
            orientationToSymbol: orientationToSymbol,

            /**
             * @type {sntls.StringDictionary}
             * @constant
             */
            symbolToOrientation: orientationToSymbol.reverse(),

            /**
             * @type {object}
             * @constant
             */
            elevationToSymbol: elevationToSymbol,

            /**
             * @type {object}
             * @constant
             */
            symbolToElevation: elevationToSymbol.reverse()
        })
        .addMethods(/** @lends app.model.TileDocument# */{
            /**
             * @param {bookworm.DocumentKey} patternKey
             * @returns {app.model.TileDocument}
             */
            setPattern: function (patternKey) {
                this.getField('pattern')
                    .setValue(patternKey.toString());
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

            /** @returns {bookworm.DocumentKey} */
            getPattern: function () {
                var patternRef = this.getField('pattern').getValue();
                return patternRef ?
                    patternRef.toDocumentKey() :
                    undefined;
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

            /** @returns {number} Either 0, 90, 180, or 270. Default is 0. */
            getOrientation: function () {
                return this.getField('orientation').getValue() || 0;
            },

            /** @returns {number} */
            getOrientationShift: function () {
                return this.getOrientation() / 90;
            },

            /**
             * @param {string} mapString
             * @returns {app.model.TileDocument}
             * @memberOf app.model.TileDocument
             */
            createTileDocumentsFromString: function (mapString) {
                var patternsDocument = 'patterns/all'.toDocument();

                mapString.split('')
                    .toCollection()
                    .forEachItem(function (patternSymbol, tileIndex) {
                        var patternKey = patternsDocument.getPatternBySymbol(patternSymbol);

                        ['tile', tileIndex].toDocument()
                            .setPattern(patternKey);
                    });

                return this;
            },

            /**
             * @param {string} serializedTile Tile in string format.
             * @returns {app.model.TileDocument}
             */
            fromString: function (serializedTile) {
                var patternSymbol = serializedTile[0],
                    orientationSymbol = serializedTile[1],
                    elevationSymbol = serializedTile[2],
                    patternKey = 'patterns/all'.toDocument().getPatternBySymbol(patternSymbol),
                    orientation = this.symbolToOrientation.getItem(orientationSymbol),
                    elevation = this.symbolToElevation.getItem(elevationSymbol);

                this
                    .setPattern(patternKey)
                    .setOrientation(parseInt(orientation, 10))
                    .setElevation(parseInt(elevation, 10));

                return this;
            },

            /** @returns {string} */
            toString: function () {
                return [
                    this.getPattern().toDocument().getSymbol(),
                    this.orientationToSymbol.getItem(this.getOrientation()),
                    this.elevationToSymbol.getItem(this.getElevation())
                ].join('');
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

