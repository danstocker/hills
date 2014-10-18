/*global dessert, troop, sntls, evan, shoeshine, app */
troop.postpone(app.widgets, 'Game', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * @name app.widgets.Game.create
     * @function
     * @returns {app.widgets.Game}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.Game = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addMethods(/** @lends app.widgets.Game# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                widgets.Board.create('board/main'.toDocumentKey())
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
