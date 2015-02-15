/*global dessert, troop, sntls, shoeshine, candystore, app */
troop.postpone(app.widgets, 'PatternOption', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTraitAndExtend(candystore.BinaryStateful)
            .addTrait(candystore.Highlightable, 'Highlightable')
            .addTraitAndExtend(candystore.Option, 'Option')
            .addTraitAndExtend(candystore.DataListItem);

    /**
     * @name app.widgets.PatternOption.create
     * @function
     * @returns {app.widgets.PatternOption}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends candystore.BinaryStateful
     * @extends candystore.Highlightable
     * @extends candystore.Option
     */
    app.widgets.PatternOption = self
        .addMethods(/** @lends app.widgets.PatternOption# */{
            /** @ignore */
            init: function (patternKey) {
                base.init.call(this, patternKey);
                candystore.BinaryStateful.init.call(this);
                candystore.Highlightable.init.call(this);
                candystore.Option.init.call(this);
                candystore.DataListItem.init.call(this);

                widgets.Pattern.create(patternKey)
                    .setChildName('pattern')
                    .addToParent(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                candystore.Option.afterRender.call(this);
            }
        });
});
