/*global dessert, troop, sntls, bookworm, app */
troop.amendPostponed(bookworm, 'config', function () {
    "use strict";

    bookworm.config.items = {
        document: {
            document: {
                /** @class app.model.BoardNode */
                board: /** @lends app.model.BoardNode# */{
                    /** @type {string} */
                    ref   : 'reference',
                    /** @type {number} */
                    width : 'number',
                    /** @type {number} */
                    height: 'number',
                    /** @type {object} */
                    tiles : 'ordered-collection'
                },

                /** @class app.model.PatternNode */
                pattern: /** @lends app.model.PatternNode# */{
                    /** @type {string} */
                    ref   : 'reference',
                    /** @type {string} */
                    symbol: 'text'
                },

                /** @class app.model.PatternsNode */
                patterns: /** @lends app.model.PatternsNode# */{
                    /** @type {string} */
                    ref     : 'reference',
                    /** @type {object} */
                    patterns: 'ordered-collection'
                },

                /** @class app.model.TileNode */
                tile: /** @lends app.model.TileNode# */{
                    /** @type {string} */
                    ref        : 'reference',
                    /** @type {string} */
                    pattern    : 'reference',
                    /** @type {number} */
                    elevation  : 'number',
                    /** @type {number} */
                    orientation: 'number'
                }
            }
        }
    };
});