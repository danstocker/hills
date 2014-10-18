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
        .addMethods(/** @lends app.model.PatternDocument# */{
            /** @returns {string} */
            getSymbol: function () {
                return this.getField('symbol').getValue();
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
