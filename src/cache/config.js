/*global dessert, troop, sntls, bookworm, app */
troop.amendPostponed(bookworm, 'config', function () {
    "use strict";

    bookworm.config.items = {
        document: {
            document: {
                /** @class app.model.BoardNode */
                board: /** @lends app.model.BoardNode# */{
                    /** @type {number} */
                    width : 'number',
                    /** @type {number} */
                    height: 'number',
                    /** @type {object} */
                    tiles : 'ordered-collection'
                },

                /** @class app.model.TileNode */
                tile: /** @lends app.model.TileNode# */{
                    /** @type {number} */
                    type       : 'number',
                    /** @type {number} */
                    elevation  : 'number',
                    /** @type {number} */
                    orientation: 'number'
                }
            }
        }
    };
});