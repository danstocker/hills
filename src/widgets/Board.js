/*global dessert, troop, sntls, evan, bookworm, shoeshine, candystore, app */
troop.postpone(app.widgets, 'Board', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget);

    /**
     * @name app.widgets.Board.create
     * @function
     * @param {bookworm.DocumentKey} boardKey
     * @returns {app.widgets.Board}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends candystore.EntityWidget
     */
    app.widgets.Board = self
        .setInstanceMapper(function (boardKey) {
            return boardKey.toString();
        })
        .addPrivateMethods(/** @lends app.widgets.Board# */{
            /** @private */
            _updateTiles: function () {
                var boardDocument = this.entityKey.toDocument(),
                    boardWidth = boardDocument.getWidth(),
                    tileWidth = widgets.Tile.TILE_WIDTH,
                    tileHeight = widgets.Tile.TILE_HEIGHT;

                boardDocument
                    .getTileKeysAsCollection()
                    .createWithEachItem(widgets.Tile)
                    .forEachItem(function (/**app.widgets.Tile*/tile, tileIndex) {
                        tileIndex = parseInt(tileIndex, 10);

                        var columnIndex = tileIndex % boardWidth,
                            rowIndex = Math.floor(tileIndex / boardWidth),
                            isOdd = rowIndex % 2,
                            horizontalShift = tileWidth / 4 * (isOdd ? 1 : -1);

                        tile
                            .setChildName('tile-' + tileIndex)
                            .setInlineStyle('z-index', Math.floor(tileIndex / boardWidth))
                            .setInlineStyle('left', columnIndex * tileWidth + horizontalShift + 'px')
                            .setInlineStyle('top', rowIndex * tileHeight / 2 + 'px');
                    })
                    .toWidgetCollection()
                    .addToParent(this);
            }
        })
        .addMethods(/** @lends app.widgets.Board# */{
            /**
             * @param {bookworm.DocumentKey} boardKey
             * @ignore
             */
            init: function (boardKey) {
                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, boardKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateTiles();
                this
                    .bindToEntityNodeChange(this.entityKey, 'onDocumentReplace')
                    .bindToEntityNodeChange(this.entityKey.getFieldKey('tiles'), 'onTilesReplace');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /** @ignore */
            onDocumentReplace: function () {
                this._updateTiles();
            },

            /** @ignore */
            onTilesReplace: function () {
                this._updateTiles();
            }
        });
});
