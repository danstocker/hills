/*global console, dessert, troop, sntls, evan, flock, bookworm, app */
troop.postpone(app.model, 'Vulnerable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Adds health to a CharacterModel.
     * @class
     * @extends troop.Base
     * @extends app.model.CharacterModel
     */
    app.model.Vulnerable = self
        .addConstants(/** @lends app.model.Vulnerable */{
            /** @constant */
            EVENT_CHARACTER_HEALTH_CHANGE: 'character-health-change',

            /** @constant */
            EVENT_CHARACTER_DEATH: 'character-death',

            /** @constant */
            EVENT_CHARACTER_RESURRECTION_ATTEMPT: 'character-resurrect-attempt',

            /** @constant */
            HEALTH_MIN: 0,

            /** @constant */
            HEALTH_MAX: 100,

            /** @constant */
            HEALTH_MAX_POS_DELTA: 10,

            /** @constant */
            HEALTH_MAX_NEG_DELTA: 100
        })
        .addPrivateMethods(/** @lends app.model.Vulnerable# */{
            /** @param {number} health */
            _setHealth: function (health) {
                this.characterDocument.getField('health').setValue(health);
            }
        })
        .addMethods(/** @lends app.model.Vulnerable# */{
            /** @ignore */
            init: function () {
                this._setHealth(this.HEALTH_MAX);
            },

            /** @returns {number} */
            getHealth: function () {
                return this.characterDocument.getField('health').getValue();
            },

            /**
             * @param {number} points
             * @returns {app.model.Vulnerable}
             */
            heal: function (points) {
                var currentHealth = this.getHealth(),
                    newHealth;

                if (currentHealth > 0) {
                    newHealth = currentHealth + Math.min(points, this.HEALTH_MAX_POS_DELTA);
                    this._setHealth(Math.min(this.HEALTH_MAX, newHealth));
                } else {
                    this.triggerSync(this.EVENT_CHARACTER_RESURRECTION_ATTEMPT);
                }

                return this;
            },

            /**
             * @param {number} points
             * @returns {app.model.Vulnerable}
             */
            damage: function (points) {
                var currentHealth = this.getHealth(),
                    newHealth = currentHealth - Math.min(points, this.HEALTH_MAX_NEG_DELTA);
                this._setHealth(Math.max(this.HEALTH_MIN, newHealth));
                return this;
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onHealthFieldChange: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_CHARACTER_HEALTH_CHANGE, {
                        healthBefore: event.beforeValue,
                        healthAfter : event.afterValue
                    })
                    .clearNextOriginalEvent();
            },

            /**
             * @param {evan.Event} event
             * @ignore
             */
            onHealthChange: function (event) {
                var healthInfo = event.payload,
                    healthBefore = healthInfo.healthBefore,
                    healthAfter = healthInfo.healthAfter;

                this.setNextOriginalEvent(event);

                if (healthBefore > 0 && healthAfter === 0) {
                    this.triggerSync(this.EVENT_CHARACTER_DEATH);
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
            'document>character>|>health'.toQuery(),
            (function (event) {
                var characterId = event.originalPath.asArray[2];
                characterId.toCharacterModel().onHealthFieldChange(event);
            }));

    bookworm.entities
        .delegateSubscriptionTo(
            model.Vulnerable.EVENT_CHARACTER_HEALTH_CHANGE,
            'document>character'.toPath(),
            'document>character>|'.toQuery(),
            (function (event) {
                var characterId = event.originalPath.asArray[2];
                characterId.toCharacterModel().onHealthChange(event);
            }));

    bookworm.entities
        .subscribeTo(model.Vulnerable.EVENT_CHARACTER_HEALTH_CHANGE, 'document>character'.toPath(), function (event) {
            var characterId = event.originalPath.asArray[2],
                characterModel = characterId.toCharacterModel();
            console.info("character health changed", characterModel.getName(), characterModel.getHealth());
        })
        .subscribeTo(model.Vulnerable.EVENT_CHARACTER_DEATH, 'document>character'.toPath(), function (event) {
            var characterId = event.originalPath.asArray[2];
            console.info("character died", characterId.toCharacterModel().getName());
        })
        .subscribeTo(model.Vulnerable.EVENT_CHARACTER_RESURRECTION_ATTEMPT, 'document>character'.toPath(), function (event) {
            var characterId = event.originalPath.asArray[2];
            console.info("attempted to heal dead character", characterId.toCharacterModel().getName());
        });
}, app.model);
