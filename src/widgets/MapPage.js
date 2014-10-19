/*global dessert, troop, sntls, evan, shoeshine, candystore, app */
troop.postpone(app.widgets, 'MapPage', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = candystore.Page,
        self = base.extend(className);

    /**
     * @name app.widgets.MapPage.create
     * @function
     * @returns {app.widgets.MapPage}
     */

    /**
     * @class
     * @extends candystore.Page
     */
    app.widgets.MapPage = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends app.widgets.MapPage# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                widgets.Board.create('board/main'.toDocumentKey())
                    .setChildName('board')
                    .addToParent(this);

                widgets.PatternDropdownButton.create(
                        'preferences/main/pattern'.toFieldKey(),
                        'patterns/all/patterns'.toFieldKey())
                    .setChildName('palette-button')
                    .addToParent(this);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            }
        });
});
