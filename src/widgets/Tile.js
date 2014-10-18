/*global dessert, troop, sntls, evan, bookworm, shoeshine, candystore, app */
troop.postpone(app.widgets, 'Tile', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = candystore.Button,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget);

    /**
     * @name app.widgets.Tile.create
     * @function
     * @returns {app.widgets.Tile}
     */

    /**
     * @class
     * @extends candystore.Button
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
            TILE_WIDTH: 64,

            /** @constant */
            TILE_HEIGHT: 32,

            /** @constant */
            TILE_VISIBLE_HEIGHT: 64
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

                this.elevateMethod('onButtonClick');

                var tileDocument = tileKey.toDocument();

                this
                    .addCssClass('type-' + tileDocument.getTileType())
                    .addCssClass('elevation-' + tileDocument.getElevation());
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateType();
                this._updateElevation();

                this
                    .subscribeTo(candystore.Button.EVENT_BUTTON_CLICK, this.onButtonClick)
                    .bindToEntityNodeChange(this.entityKey.getFieldKey('type'), 'onTypeChange')
                    .bindToEntityNodeChange(this.entityKey.getFieldKey('elevation'), 'onElevationChange')
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
                return '<div class="background-image"></div>';
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

                if (mouseEvent && mouseEvent.shiftKey) {
                    if (mouseEvent.altKey) {
                        tileDocument.lowerElevation();
                    } else {
                        tileDocument.raiseElevation();
                    }
                } else if (mouseEvent && mouseEvent.ctrlKey || mouseEvent.metaKey) {
                    tileDocument.rotateTileType();
                } else {
                    this
                        .setNextOriginalEvent(event)
                        .triggerSync(this.EVENT_TILE_CLICK, this.entityKey)
                        .clearNextOriginalEvent();
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
            onDocumentReplace: function () {
                this._updateType();
                this._updateElevation();
            }
        });
});
