/*global dessert, troop, sntls, shoeshine, candystore, app */
troop.postpone(app.widgets, 'Pattern', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTrait(candystore.EntityWidget);

    /**
     * @name app.widgets.Pattern.create
     * @function
     * @param {bookworm.DocumentKey} patternKey
     * @returns {app.widgets.Pattern}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends candystore.EntityWidget
     */
    app.widgets.Pattern = self
        .addConstants(/** @lends app.widgets.Pattern */{
            /** @constant */
            PATTERN_TOP_OFFSET: -20,

            /** @constant */
            PATTERN_LEFT_OFFSET: 0
        })
        .addMethods(/** @lends app.widgets.Pattern# */{
            /**
             * @param {bookworm.DocumentKey} patternKey
             * @ignore
             */
            init: function (patternKey) {
                base.init.call(this);
                candystore.EntityWidget.init.call(this, patternKey);

                this.setShift(0);
            },

            /**
             * @param {number} shift 0, 1, 2, or 3
             * @returns {app.widgets.Pattern}
             */
            setShift: function (shift) {
                var patternDocument = this.entityKey.toDocument();

                this.setInlineStyle('background-position', [
                    this.PATTERN_LEFT_OFFSET + patternDocument.getBackgroundLeft() + patternDocument.getHorizontalOffset(shift) + 'px',
                    this.PATTERN_TOP_OFFSET + patternDocument.getBackgroundTop() + 'px'
                ].join(' '));

                return this;
            }
        });
});
