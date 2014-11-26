/*global dessert, troop, sntls, evan, bookworm, app */
troop.postpone(app.model, 'CharacterModel', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTrait(evan.Evented),
        slice = Array.prototype.slice;

    /**
     * @name app.model.CharacterModel.create
     * @function
     * @param {bookworm.DocumentKey} characterKey
     * @returns {app.model.CharacterModel}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    app.model.CharacterModel = self
        .setInstanceMapper(function (documentKey) {
            return documentKey.toString();
        })
        .setEventSpace(bookworm.entities.eventSpace)
        .addMethods(/** @lends app.model.CharacterModel# */{
            /**
             * @param {bookworm.DocumentKey} characterKey
             * @ignore
             */
            init: function (characterKey) {
                this.setEventPath(characterKey.getEntityPath());

                /** @type {bookworm.Document} */
                this.characterDocument = characterKey.toDocument();
            },

            /**
             * @param {troop.Base} trait
             * @returns {app.model.CharacterModel}
             */
            addTrait: function (trait) {
                base.addTrait.call(this, trait);
                trait.init.apply(this, slice.call(arguments, 1));
                return this;
            },

            /**
             * @param {string} characterName
             * @returns {app.model.CharacterModel}
             */
            setName: function (characterName) {
                this.characterDocument.getField('name').setValue(characterName);
                return this;
            },

            /** @returns {string} */
            getName: function () {
                var characterDocument = this.characterDocument;
                return characterDocument.getField('name').getValue() ||
                       characterDocument.getField('id').getValue();
            }
        });
});

(function (/**app.model*/model) {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {app.model.CharacterModel} */
            toCharacterModel: function () {
                return model.CharacterModel.create(['character', this.valueOf()].toDocumentKey());
            }
        },
        false, false, false
    );
}(app.model));
