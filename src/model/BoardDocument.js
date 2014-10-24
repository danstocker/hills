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
             * @returns {app.model.BoardDocument}
             */
            importMap: function (mapString) {
                var tilesKey = this.entityKey.getFieldKey('tiles'),
                    serializedTiles = mapString.match(/.{1,3}/g)
                        .toCollection(),
                    width = Math.sqrt(serializedTiles.getKeyCount() / 4);

                // writing tile items
                serializedTiles
                    .mapValues(function (serializedTile) {
                        return model.TileItem.createTileItemNode(serializedTile);
                    })
                    .passItemsTo(this._setTiles, this);

                // writing dimensions
                this
                    .setWidth(width)
                    .setHeight(width * 2);

                return this;
            },

            /** @returns {string} */
            exportMap: function () {
                return '\"' + this.toString()
                    .match(new RegExp('.{1,' + this.getWidth() * 3 + '}', 'g'))
                    .join('"+\n"') + '\"';
            },

            /** @returns {string} */
            toString: function () {
                return this.getField('tiles')
                    .getItemsAsCollection()
                    .getKeysAsHash()
                    .toCollection()
                    .callOnEachItem('toDocument')
                    .callOnEachItem('toString')
                    .getValues()
                    .join('');
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
                    .importMap(this);
            }
        },
        false, false, false
    );
}());
