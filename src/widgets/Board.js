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
                    boardHeight = boardDocument.getHeight(),
                    tileWidth = widgets.Tile.TILE_WIDTH,
                    tileHeight = widgets.Tile.TILE_HEIGHT;

                this
                    .setInlineStyle('left', -tileWidth / 2 + 'px')
                    .setInlineStyle('top', -tileHeight / 2 + 'px')
                    .setInlineStyle('width', tileWidth * boardWidth + 'px')
                    .setInlineStyle('height', tileHeight / 2 * (boardHeight - 0.5) + 'px');

                boardDocument
                    .getTileKeysAsCollection()
                    .createWithEachItem(widgets.Tile)
                    .forEachItem(function (/**app.widgets.Tile*/tile, tileIndex) {
                        tileIndex = parseInt(tileIndex, 10);

                        var columnIndex = tileIndex % boardWidth,
                            rowIndex = Math.floor(tileIndex / boardWidth),
                            isOdd = rowIndex % 2,
                            horizontalShift = tileWidth / 2 * (isOdd ? 1 : 0);

                        tile
                            .setChildName('tile-' + candystore.StringUtils.padLeft(tileIndex, 5))
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
