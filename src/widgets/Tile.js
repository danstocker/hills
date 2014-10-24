/*global dessert, troop, sntls, evan, bookworm, shoeshine, candystore, app */
troop.postpone(app.widgets, 'Tile', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTrait(shoeshine.JqueryWidget)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTrait(candystore.Highlightable, 'Highlightable');

    /**
     * @name app.widgets.Tile.create
     * @function
     * @param {bookworm.ItemKey} tileKey
     * @returns {app.widgets.Tile}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     * @extends candystore.Highlightable
     */
    app.widgets.Tile = self
        .setInstanceMapper(function (tileKey) {
            return tileKey.toString();
        })
        .addConstants(/** @lends app.widgets.Tile */{
            /** @constant */
            EVENT_TILE_CLICK: 'tile-click',

            /** @constant */
            TILE_WIDTH: 100,

            /** @constant */
            TILE_HEIGHT: 50,

            /** @constant */
            TILE_VISIBLE_HEIGHT: 150
        })
        .addPrivateMethods(/** @lends app.widgets.Tile# */{
            /** @private */
            _updateElevation: function () {
                var tileItem = this.entityKey.toItem();

                this.htmlAttributes.cssClasses
                    .filterByPrefix('elevation-')
                    .passEachItemTo(this.removeCssClass, this);

                this.addCssClass('elevation-' + tileItem.getElevation());
            },

            /** @private */
            _updatePattern: function () {
                var tileItem = this.entityKey.toItem();

                widgets.Pattern.create(tileItem.getPatternKey())
                    .setChildName('pattern')
                    .setShift(tileItem.getOrientationShift())
                    .addToParent(this);
            }
        })
        .addMethods(/** @lends app.widgets.Tile# */{
            /**
             * @param {bookworm.ItemKey} tileKey
             * @ignore
             */
            init: function (tileKey) {
                dessert.isItemKey(tileKey, "Invalid tile key");

                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, tileKey);
                candystore.Highlightable.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateElevation();
                this._updatePattern();

                this.bindToEntityChange(this.entityKey, 'onTileChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterAdd.call(this);
                this.unbindAll();
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return [
                    this.getChild('pattern'),
                    '<div class="mouse-area"></div>'
                ].join('');
            },

            /** @returns {string} */
            getTopPosition: function () {
                return this.htmlAttributes.inlineStyles.getItem('top');
            },

            /**
             * @returns {string}
             */
            getLeftPosition: function () {
                return this.htmlAttributes.inlineStyles.getItem('left');
            },

            /** @ignore */
            onTileChange: function () {
                this._updatePattern();
                this._updateElevation();
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onClick: function (event) {
                var tileItem = this.entityKey.toItem();

                if (event && event.ctrlKey || event.metaKey) {
                    if (event.shiftKey) {
                        tileItem.rotateCounterClockwise();
                    } else {
                        tileItem.rotateClockwise();
                    }
                } else if (event && event.altKey) {
                    if (event.shiftKey) {
                        tileItem.lowerElevation();
                    } else {
                        tileItem.raiseElevation();
                    }
                } else {
                    tileItem.setPatternKey('preferences/main'.toDocument().getPatternKey());
                }
            },

            /** @ignore */
            onMouseEnter: function () {
                this.highlightOn('hover');
            },

            /** @ignore */
            onMouseLeave: function () {
                this.highlightOff('hover');
            }
        });

    self
        .on('click', '', 'onClick')
        .on('mouseenter', '.mouse-area', 'onMouseEnter')
        .on('mouseleave', '.mouse-area', 'onMouseLeave');
});
