/*global dessert, troop, sntls, shoeshine, candystore, app */
troop.postpone(app.widgets, 'Pattern', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * @name app.widgets.Pattern.create
     * @function
     * @returns {app.widgets.Pattern}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.Pattern = self
        .addMethods(/** @lends app.widgets.Pattern# */{
            /**
             * @param {bookworm.DocumentKey} patternKey
             * @ignore
             */
            init: function (patternKey) {
                base.init.call(this);
                this.addCssClass([patternKey.documentType, patternKey.documentId].join('-'));
            }
        });
});
