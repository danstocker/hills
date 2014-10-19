/*global dessert, troop, sntls, shoeshine, candystore, app */
troop.postpone(app.widgets, 'PatternDropdownButton', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = candystore.DataDropdownButton,
        self = base.extend(className);

    /**
     * @name app.widgets.PatternDropdownButton.create
     * @function
     * @param {bookworm.FieldKey} labelKey
     * @param {bookworm.FieldKey} optionsKey
     * @returns {app.widgets.PatternDropdownButton}
     */

    /**
     * @class
     * @extends candystore.DataDropdownButton
     */
    app.widgets.PatternDropdownButton = self
        .addMethods(/** @lends app.widgets.PatternDropdownButton# */{
            /** @returns {app.widgets.PatternList} */
            createLabelWidget: function () {
                var patternRef = this.entityKey.toField().getValue();
                return patternRef ?
                    widgets.Pattern.create(patternRef.toDocumentKey()) :
                    base.createLabelWidget.apply(this, arguments);
            },

            /** @returns {candystore.DataDropdown} */
            createDropdownWidget: function () {
                return base.createDropdownWidget.apply(this, arguments)
                    .setPositionOption('my', 'left top')
                    .setPositionOption('at', 'right top');
            },

            /** @ignore */
            onSelectedChange: function () {
                base.onSelectedChange.apply(this, arguments);
                console.log("selected value changed");

                this.createLabelWidget()
                    .setChildName('button-label')
                    .addToParent(this);
            }
        });
});
