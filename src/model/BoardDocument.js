/*global dessert, troop, sntls, evan, bookworm, shoeshine, app */
troop.postpone(app.model, 'BoardDocument', function (/**app.model*/model) {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.BoardDocument.create
     * @function
     * @param {bookworm.DocumentKey} boardKey
     * @returns {app.model.BoardDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.BoardDocument = self
        .setInstanceMapper(function (boardKey) {
            return boardKey.toString();
        })
        .addPrivateMethods(/** @lends app.model.BoardDocument# */{
            /**
             * @param {object} tilesNode
             * @private
             */
            _setTiles: function (tilesNode) {
                this.getField('tiles').setValue(tilesNode);
            }
        })
        .addMethods(/** @lends app.model.BoardDocument# */{
            /**
             * @param {number} width
             * @returns {app.model.BoardDocument}
             */
            setWidth: function (width) {
                this.getField('width').setValue(width);
                return this;
            },

            /** @returns {number} */
            getWidth: function () {
                return this.getField('width').getValue();
            },

            /**
             * @param {number} height
             * @returns {app.model.BoardDocument}
             */
            setHeight: function (height) {
                this.getField('height').setValue(height);
                return this;
            },

            /** @returns {number} */
            getHeight: function () {
                return this.getField('height').getValue();
            },

            /** @returns {sntls.Collection} */
            getTileKeysAsCollection: function () {
                var tilesKey = this.entityKey.getFieldKey('tiles');

                return this.getField('tiles')
                    .getItemsAsCollection()
                    .mapValues(function (itemNode, tileIndex) {
                        return tilesKey.getItemKey(tileIndex);
                    });
            },

            /**
             * @param {string} mapString
             * @returns {Array}
             */
            getTilesNodeFromString: function (mapString) {
                var serializedTiles = mapString.match(/.{1,3}/g),
                    i, serializedTile,
                    TileItem = model.TileItem,
                    result = [];

                for (i = 0; i < serializedTiles.length; i++) {
                    serializedTile = serializedTiles[i];
                    result.push(TileItem.getTileNodeFromString(serializedTile));
                }

                return result;
            },

            /**
             * @param {string} mapString
             * @returns {app.model.BoardDocument}
             */
            fromString: function (mapString) {
                // touching patterns document so indexes will initialize on demand
                'patterns/all'.toDocument();

                var width = Math.sqrt(mapString.length / 12);

                // writing dimensions
                this
                    .setWidth(width)
                    .setHeight(width * 4);

                // writing tiles collection
                this._setTiles(this.getTilesNodeFromString(mapString));

                return this;
            },

            /**
             * @param {string} compressedMapString
             * @returns {app.model.BoardDocument}
             */
            fromCompressedString: function (compressedMapString) {
                return this.fromString(compressedMapString.toDecompressed());
            },

            /** @returns {string} */
            exportMap: function () {
                return '\"' + this.toString()
                    .match(new RegExp('.{1,' + this.getWidth() * 3 + '}', 'g'))
                    .join('"+\n"') + '\"';
            },

            /**
             * Uses loop and direct access to index to boost up conversion.
             * Functional equivalent commented out.
             * @returns {string}
             */
            toString: function () {
                var tilesField = this.getField('tiles'),
                    tilesNode = tilesField.getValue(),
                    tileIndices = Object.keys(tilesNode),
                    TileItem = model.TileItem,
                    byReferenceLookup = bookworm.index.items.pattern['by-reference'],
                    i, tileIndex, tileNode,
                    result = [];

                for (i = 0; i < tileIndices.length; i++) {
                    tileIndex = tileIndices[i];
                    tileNode = tilesNode[tileIndex];
                    result.push(TileItem.getStringFromTileNode(
                        byReferenceLookup[tileNode.pattern],
                        tileNode.orientation,
                        tileNode.elevation));
                }

                return result.join('');

                //                return this.getField('tiles')
                //                    .getItemsAsCollection()
                //                    .mapValues(function (tileNode, tileIndex) {
                //                        return tilesField.getItem(tileIndex).toString();
                //                    })
                //                    .callOnEachItem('toString')
                //                    .getValues()
                //                    .join('');
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Document
        .addSurrogate(model, 'BoardDocument', function (documentKey) {
            return documentKey.documentType === 'board';
        });
}, app.model);

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @param {string} [boardId]
             * @returns {app.model.BoardDocument}
             */
            toBoardDocument: function (boardId) {
                return ['board', boardId || 'main'].toDocument()
                    .fromString(this.valueOf());
            },

            /**
             * @param {string} [boardId]
             * @returns {app.model.BoardDocument}
             */
            toBoardDocumentFromCompressed: function (boardId) {
                return ['board', boardId || 'main'].toDocument()
                    .fromCompressedString(this.valueOf());
            }
        },
        false, false, false
    );
}());
