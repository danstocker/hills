/*global console, dessert, troop, sntls, evan, flock, bookworm, app */
troop.postpone(app.model, 'Fighter', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name app.model.Fighter.create
     * @function
     * @returns {app.model.Fighter}
     */

    /**
     * Adds fighting skills to a CharacterModel.
     * @class
     * @extends troop.Base
     * @extends app.model.CharacterModel
     */
    app.model.Fighter = self
        .addConstants(/** @lends app.model.Fighter# */{
            /** @constant */
            EVENT_ATTACK_FAIL: 'attack-fail'
        })
        .addPrivateMethods(/** @lends app.model.Fighter# */{
            /**
             * @param {number} defense
             * @private
             */
            _setDefense: function (defense) {
                this.characterDocument.getField('defense').setValue(defense);
            },

            /**
             * @param {number} maxDamage
             * @private
             */
            _setMaxDamage: function (maxDamage) {
                this.characterDocument.getField('maxDamage').setValue(maxDamage);
            }
        })
        .addMethods(/** @lends app.model.Fighter# */{
            /** @ignore */
            init: function () {
                this._setDefense(0);
                this._setMaxDamage(20);
            },

            /** @returns {number} */
            getDefense: function () {
                return this.characterDocument.getField('defense').getValue();
            },

            /** @returns {number} */
            getMaxDamage: function () {
                return this.characterDocument.getField('maxDamage').getValue();
            },

            /**
             * @param {app.model.Vulnerable|app.model.Fighter} opponent
             * @returns {app.model.Fighter}
             */
            attack: function (opponent) {
                var characterDocument = this.characterDocument,
                    maxDamage = characterDocument.getField('maxDamage').getValue(),
                    opponentDefense = opponent.getDefense ? opponent.getDefense() : 0,
                    damage = maxDamage - opponentDefense;

                characterDocument.getField('defending').setValue(false);

                if (opponent.damage) {
                    opponent.damage(damage, this);
                } else {
                    this.triggerSync(this.EVENT_ATTACK_FAIL, {
                        /** @type {app.model.CharacterModel} */
                        opponent: opponent
                    });
                }

                return this;
            },

            /** @returns {app.model.Fighter} */
            defend: function () {
                this.characterDocument.getField('defending').setValue(true);
                return this;
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onDefendingChange: function (event) {
                this.setNextOriginalEvent(event);
                if (event.afterValue && !event.beforeValue) {
                    this._setDefense(15);
                } else if (!event.afterValue && event.beforeValue) {
                    this._setDefense(0);
                }
                this.clearNextOriginalEvent();
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.entities
        .delegateSubscriptionTo(
            flock.ChangeEvent.EVENT_CACHE_CHANGE,
            'document>character'.toPath(),
            'document>character>|>defending'.toQuery(),
            (function (event) {
                var characterId = event.originalPath.asArray[2];
                characterId.toCharacterModel().onDefendingChange(event);
            }));

    bookworm.entities
        .subscribeTo(model.Fighter.EVENT_ATTACK_FAIL, 'document>character'.toPath(), function (event) {
            var characterId = event.originalPath.asArray[2];
            console.info("attack failed", characterId.toCharacterModel().getName(), event.payload.opponent.getName());
        });
}, app.model);
