/*global dessert, troop, sntls, evan, shoeshine, candystore, app */
troop.postpone(app.widgets, 'Board', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
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
        .addMethods(/** @lends app.widgets.Board# */{
            /**
             * @param {bookworm.DocumentKey} boardKey
             * @ignore
             */
            init: function (boardKey) {
                base.init.call(this);
                candystore.EntityWidget.init.call(this, boardKey);

                var boardDocument = boardKey.toDocument(),
                    boardWidth = boardDocument.getWidth(),
                    tileWidth = widgets.Tile.TILE_WIDTH,
                    tileHeight = widgets.Tile.TILE_HEIGHT;

                boardDocument
                    .getTilesAsCollection()
                    .createWithEachItem(widgets.Tile)
                    .forEachItem(function (/**app.widgets.Tile*/tile, tileRef) {
                        var tileIndex = tileRef.toDocumentKey().documentId,
                            columnIndex = tileIndex % boardWidth,
                            rowIndex = Math.floor(tileIndex / boardWidth),
                            isOdd = rowIndex % 2,
                            horizontalShift = tileWidth / 4 * (isOdd ? 1 : -1);

                        tile
                            .setInlineStyle('z-index', Math.floor(tileIndex / boardWidth))
                            .setInlineStyle('left', columnIndex * tileWidth + horizontalShift + 'px')
                            .setInlineStyle('top', rowIndex * tileHeight / 2 + 'px');
                    })
                    .toWidgetCollection()
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
