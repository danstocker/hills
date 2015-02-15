/*global dessert, troop, sntls, shoeshine, candystore, app */
troop.postpone(app.widgets, 'PatternList', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = candystore.DataList,
        self = base.extend(className)
            .addTraitAndExtend(candystore.OptionList, 'OptionList');

    /**
     * @name app.widgets.PatternList.create
     * @function
     * @param {bookworm.DocumentKey} patternsKey
     * @returns {app.widgets.PatternList}
     */

    /**
     * @class
     * @extends candystore.DataList
     */
    app.widgets.PatternList = self
        .addMethods(/** @lends app.widgets.PatternList# */{
            /**
             * @param {bookworm.FieldKey} patternsKey
             * @ignore
             */
            init: function (patternsKey) {
                base.init.call(this, patternsKey);
                candystore.OptionList.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.OptionList.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                candystore.OptionList.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
            },

            /**
             * @param {bookworm.ReferenceItemKey} itemKey
             * @returns {app.widgets.PatternOption}
             */
            spawnItemWidget: function (itemKey) {
                var patternKey = itemKey.referenceKey;
                return widgets.PatternOption.create(patternKey)
                    .setOptionValue(patternKey.toString());
            }
        });
});

troop.amendPostponed(candystore, 'DataList', function (ns, className, /**app.widgets*/widgets) {
    "use strict";

    candystore.DataList
        .addSurrogate(widgets, 'PatternList', function (patternsKey) {
            return patternsKey.fieldName === 'patterns' &&
                   patternsKey.documentKey.documentType === 'patterns';
        });
}, app.widgets);
