/*global dessert, troop, sntls, bookworm, app */
troop.postpone(app.model, 'PreferencesDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.PreferencesDocument.create
     * @function
     * @returns {app.model.PreferencesDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.PreferencesDocument = self
        .addMethods(/** @lends app.model.PreferencesDocument# */{
            /** @returns {bookworm.DocumentKey} */
            getPattern: function () {
                var patternRef = this.getField('pattern').getValue();
                return patternRef ?
                    patternRef.toDocumentKey():
                    undefined;
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Document
        .addSurrogate(model, 'PreferencesDocument', function (documentKey) {
            return documentKey.documentType === 'preferences';
        });
}, app.model);
