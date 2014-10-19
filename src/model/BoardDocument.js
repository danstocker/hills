/*global dessert, troop, sntls, evan, bookworm, shoeshine, app */
troop.postpone(app.model, 'BoardDocument', function () {
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
            getTilesAsCollection: function () {
                return this.getField('tiles')
                    .getItemsAsCollection()
                    .mapValues(function (itemNode, tileRef) {
                        return tileRef;
                    })
                    .callOnEachItem('toDocumentKey');
            },

            /**
             * @param {string} mapString
             * @returns {app.model.BoardDocument}
             */
            importMap: function (mapString) {
                var that = this,
                    serializedTiles = mapString.match(/.{1,3}/g)
                        .toCollection(),
                    width = Math.sqrt(serializedTiles.getKeyCount() / 4),
                    tilesNode = serializedTiles
                        .mapKeys(function (serializedTile, tileIndex) {
                            return 'tile/' + tileIndex;
                        })
                        .forEachItem(function (serializedTile, tileRef) {
                            tileRef.toDocument()
                                .fromString(serializedTile);
                        })
                        .mapValues(function (serializedTile, tileRef) {
                            return parseInt(tileRef.toDocumentKey().documentId, 10);
                        })
                        .items;

                this
                    .setWidth(width)
                    .setHeight(width * 2)
                    .getField('tiles').setValue(tilesNode);

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
