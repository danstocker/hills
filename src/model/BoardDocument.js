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
             * @param {string} mapString
             * @returns {object}
             * @memberOf app.model.BoardDocument
             */
            createBoardNodeFromString: function (mapString) {
                var width = Math.sqrt(mapString.length / 4);

                dessert.assert(width === Math.floor(width), "Invalid map dimensions");

                return {
                    width : width,
                    height: width * 2,
                    tiles : mapString.split('')
                        .toCollection()
                        .mapValues(function (tileType, tileIndex) {
                            return {
                                order: tileIndex,
                                value: ['tile', tileIndex].toDocumentKey().toString()
                            };
                        })
                        .mapKeys(function (itemNode) {
                            return itemNode.value;
                        })
                        .items
                };
            },

            /** @returns {number} */
            getWidth: function () {
                return this.getField('width').getValue();
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

            /** @returns {string} */
            toString: function () {
                return this.getField('tiles')
                    .getItemsAsCollection()
                    .collectProperty('value')
                    .callOnEachItem('toDocumentKey')
                    .collectProperty('documentId')
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

(function (/**app.model*/model) {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {bookworm.EntityKey} */
            toBoardNode: function () {
                return model.BoardDocument.createBoardNodeFromString(this.valueOf());
            },

            /**
             * @param {string} [boardId]
             */
            toBoardDocument: function (boardId) {
                model.TileDocument.createTileDocumentsFromString(this);

                return ['board', boardId || 'main'].toDocument()
                    .setNode(this.toBoardNode());
            }
        },
        false, false, false
    );
}(app.model));
