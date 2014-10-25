/*global dessert, troop, sntls, evan, bookworm, shoeshine, app */
troop.postpone(app.model, 'TileItem', function () {
    "use strict";

    var base = bookworm.Item,
        self = base.extend();

    /**
     * @name app.model.TileItem.create
     * @function
     * @param {bookworm.ItemKey} tileKey
     * @returns {app.model.TileItem}
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
     * @extends bookworm.Item
     */
    app.model.TileItem = self
        .addConstants(/** @lends app.model.TileItem */{
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
        .addMethods(/** @lends app.model.TileItem# */{
            /**
             * @param {string} serializedTile Tile in string format.
             * @returns {object}
             * @memberOf app.model.TileItem
             */
            createTileItemNode: function (serializedTile) {
                var patternKey = 'patterns/all'.toDocument().getPatternKeyBySymbol(serializedTile[0]),
                    orientation = parseInt(this.symbolToOrientation.getItem(serializedTile[1]), 10),
                    elevation = parseInt(this.symbolToElevation.getItem(serializedTile[2]), 10);

                return {
                    pattern    : patternKey.toString(),
                    orientation: orientation,
                    elevation  : elevation
                };
            },

            /**
             * @param {bookworm.DocumentKey} patternKey
             * @returns {app.model.TileItem}
             */
            setPatternKey: function (patternKey) {
                this.setAttribute('pattern', patternKey.toString());
                return this;
            },

            /** @returns {bookworm.DocumentKey} */
            getPatternKey: function () {
                var patternRef = this.getAttribute('pattern');
                return patternRef ?
                    patternRef.toDocumentKey() :
                    undefined;
            },

            /**
             * @param {number} elevation 0, 1, 2
             * @returns {app.model.TileItem}
             */
            setElevation: function (elevation) {
                this.setAttribute('elevation', elevation);
                return this;
            },

            /** @returns {app.model.TileItem} */
            raiseElevation: function () {
                var currentElevation = this.getElevation();

                if (currentElevation < 2) {
                    this.setElevation(currentElevation + 1);
                }

                return this;
            },

            /** @returns {app.model.TileItem} */
            lowerElevation: function () {
                var currentElevation = this.getElevation();

                if (currentElevation > 0) {
                    this.setElevation(currentElevation - 1);
                }

                return this;
            },

            /** @returns {number} */
            getElevation: function () {
                return this.getAttribute('elevation') || 0;
            },

            /**
             * @param {number} orientation Either 0, 90, 180, or 270.
             * @returns {app.model.TileItem}
             */
            setOrientation: function (orientation) {
                this.setAttribute('orientation', orientation);
                return this;
            },

            /** @returns {number} Either 0, 90, 180, or 270. Default is 0. */
            getOrientation: function () {
                return this.getAttribute('orientation') || 0;
            },

            /** @returns {number} */
            getOrientationShift: function () {
                return this.getOrientation() / 90;
            },

            /** @returns {app.model.TileItem} */
            rotateClockwise: function () {
                var currentOrientation = this.getOrientation();
                this.setOrientation((currentOrientation + 90) % 360);
                return this;
            },

            /** @returns {app.model.TileItem} */
            rotateCounterClockwise: function () {
                var currentOrientation = this.getOrientation();
                this.setOrientation((currentOrientation + 270) % 360);
                return this;
            },

            /** @returns {string} */
            toString: function () {
                return [
                    this.getPatternKey().toDocument().getSymbol(),
                    this.orientationToSymbol.getItem(this.getOrientation()),
                    this.elevationToSymbol.getItem(this.getElevation())
                ].join('');
            }
        });
});

troop.amendPostponed(bookworm, 'Item', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Item
        .addSurrogate(model, 'TileItem', function (itemKey) {
            return  itemKey.fieldName === 'tiles' &&
                    itemKey.documentKey.documentType === 'board';
        });
}, app.model);

