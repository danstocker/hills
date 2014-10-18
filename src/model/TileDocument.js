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

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.TileDocument = self
        .addConstants(/** @lends app.model.TileDocument */{
            /** @constant */
            TILE_TYPE_LOW: 97,

            /** @constant */
            TILE_TYPE_HIGH: 100
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
            rotateTileType: function () {
                var currentType = this.getTileType();
                if (currentType >= this.TILE_TYPE_HIGH) {
                    this.setTileType(this.TILE_TYPE_LOW);
                } else {
                    this.setTileType(currentType + 1);
                }
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
                return this.getField('elevation').getValue();
            },

            /**
             * @param {string} mapString
             * @returns {app.model.BoardDocument}
             * @memberOf app.model.TileDocument
             */
            createTileDocumentsFromString: function (mapString) {
                mapString.split('')
                    .toCollection()
                    .forEachItem(function (tileType, tileIndex) {
                        var isElevated = tileType !== tileType.toLowerCase();

                        ['tile', tileIndex].toDocument()
                            .setTileType(tileType.toLowerCase().charCodeAt(0))
                            .setElevation(isElevated ? 1 : 0);
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
