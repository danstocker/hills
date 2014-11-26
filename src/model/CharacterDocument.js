/*global dessert, troop, sntls, evan, bookworm, app */
troop.postpone(app.model, 'CharacterDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend()
            .addTrait(evan.Evented),
        slice = Array.prototype.slice;

    /**
     * @name app.model.CharacterDocument.create
     * @function
     * @param {bookworm.DocumentKey} characterKey
     * @returns {app.model.CharacterDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     * @extends evan.Evented
     */
    app.model.CharacterDocument = self
        .setEventSpace(bookworm.entities.eventSpace)
        .addMethods(/** @lends app.model.CharacterDocument# */{
            /**
             * @param {bookworm.DocumentKey} characterKey
             * @ignore
             */
            init: function (characterKey) {
                base.init.call(this, characterKey);
                this.setEventPath(characterKey.getEntityPath());
                this.getField('id')
                    .setValue(characterKey.documentId);
            },

            /**
             * @param {troop.Base} trait
             * @returns {app.model.CharacterDocument}
             */
            addTrait: function (trait) {
                base.addTrait.call(this, trait);
                trait.init.apply(this, slice.call(arguments, 1));
                return this;
            },

            /**
             * @param {string} characterName
             * @returns {app.model.CharacterDocument}
             */
            setCharacterName: function (characterName) {
                this.getField('name').setValue(characterName);
                return this;
            },

            /** @returns {string} */
            getCharacterName: function () {
                return this.getField('name').getValue() || "Unnamed Character";
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
