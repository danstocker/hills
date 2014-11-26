/*global dessert, troop, sntls, evan, bookworm, app */
troop.postpone(app.model, 'CharacterDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.CharacterDocument.create
     * @function
     * @param {bookworm.DocumentKey} characterKey
     * @returns {app.model.CharacterDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.CharacterDocument = self
        .addMethods(/** @lends app.model.CharacterDocument# */{
            /**
             * @param {bookworm.DocumentKey} characterKey
             * @ignore
             */
            init: function (characterKey) {
                base.init.call(this, characterKey);
                this.getField('id')
                    .setValue(characterKey.documentId);
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Document
        .addSurrogate(model, 'CharacterDocument', function (documentKey) {
            return documentKey.documentType === 'character';
        });
}, app.model);
