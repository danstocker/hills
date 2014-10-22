/*global dessert, troop, sntls, bookworm, app */
troop.postpone(app.model, 'PatternDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.PatternDocument.create
     * @function
     * @returns {app.model.PatternDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.PatternDocument = self
        .addConstants(/** @lends app.model.PatternDocument# */{
            /** @constant */
            SPRITE_HORIZONTAL_SPACING: 150,

            /** @constant */
            SPRITE_VERTICAL_SPACING: 100
        })
        .addMethods(/** @lends app.model.PatternDocument# */{
            /** @returns {string} */
            getSymbol: function () {
                return this.getField('symbol').getValue();
            },

            /** @returns {number} */
            getBackgroundTop: function () {
                return -this.getField('top').getValue() * this.SPRITE_VERTICAL_SPACING;
            },

            /** @returns {number} */
            getBackgroundLeft: function () {
                return -this.getField('left').getValue() * this.SPRITE_HORIZONTAL_SPACING * 4;
            },

            /**
             * @param {number} shift
             * @returns {number}
             */
            getHorizontalOffset: function (shift) {
                return -shift * this.SPRITE_HORIZONTAL_SPACING;
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Document
        .addSurrogate(model, 'PatternDocument', function (documentKey) {
            return documentKey.documentType === 'pattern';
        });
}, app.model);
