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
     * @returns {app.widgets.Tile}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
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
            _updateType: function () {
                this.htmlAttributes.cssClasses
                    .filterByPrefix('type-')
                    .passEachItemTo(this.removeCssClass, this);

                this.addCssClass('type-' + this.entityKey.toDocument().getTileType());
            },

            /** @private */
            _updateElevation: function () {
                this.htmlAttributes.cssClasses
                    .filterByPrefix('elevation-')
                    .passEachItemTo(this.removeCssClass, this);

                this.addCssClass('elevation-' + this.entityKey.toDocument().getElevation());
            },

            /** @private */
            _updateOrientation: function () {
                this.htmlAttributes.cssClasses
                    .filterByPrefix('orientation-')
                    .passEachItemTo(this.removeCssClass, this);

                this.addCssClass('orientation-' + this.entityKey.toDocument().getOrientation());
            }
        })
        .addMethods(/** @lends app.widgets.Tile# */{
            /**
             * @param {bookworm.DocumentKey} tileKey
             * @ignore
             */
            init: function (tileKey) {
                dessert.isDocumentKey(tileKey, "Invalid tile key");

                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, tileKey);
                candystore.Highlightable.init.call(this);

                this.elevateMethod('onButtonClick');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateType();
                this._updateElevation();
                this._updateOrientation();

                this
                    .subscribeTo(candystore.Button.EVENT_BUTTON_CLICK, this.onButtonClick)
                    .bindToEntityNodeChange(this.entityKey.getFieldKey('type'), 'onTypeChange')
                    .bindToEntityNodeChange(this.entityKey.getFieldKey('elevation'), 'onElevationChange')
                    .bindToEntityNodeChange(this.entityKey.getFieldKey('orientation'), 'onOrientationChange')
                    .bindToEntityNodeChange(this.entityKey, 'onDocumentReplace');
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
                    '<div class="background-image"></div>',
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

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onButtonClick: function (event) {
                var mouseEvent = event.getOriginalEventByType(MouseEvent),
                    tileDocument = this.entityKey.toDocument();

                if (mouseEvent && mouseEvent.ctrlKey || mouseEvent.metaKey) {
                    if (mouseEvent.shiftKey) {
                        tileDocument.rotateCounterClockwise();
                    } else {
                        tileDocument.rotateClockwise();
                    }
                }
            },

            /** @ignore */
            onTypeChange: function () {
                this._updateType();
            },

            /** @ignore */
            onElevationChange: function () {
                this._updateElevation();
            },

            /** @ignore */
            onOrientationChange: function () {
                this._updateOrientation();
            },

            /** @ignore */
            onDocumentReplace: function () {
                this._updateType();
                this._updateElevation();
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
        .on('mouseenter', '.mouse-area', 'onMouseEnter')
        .on('mouseleave', '.mouse-area', 'onMouseLeave');
});
