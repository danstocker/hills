/*global dessert, troop, sntls, bookworm, app */
troop.postpone(app.model, 'PatternsDocument', function () {
    "use strict";

    var base = bookworm.Document,
        self = base.extend();

    /**
     * @name app.model.PatternsDocument.create
     * @function
     * @param {bookworm.DocumentKey} patternsKey
     * @returns {app.model.PatternsDocument}
     */

    /**
     * @class
     * @extends bookworm.Document
     */
    app.model.PatternsDocument = self
        .setInstanceMapper(function (patternsKey) {
            return patternsKey.toString();
        })
        .addPrivateMethods(/** @lends app.model.PatternsDocument# */{
            /** @private */
            _addBySymbolLookup: function () {
                var symbolToPatternRef = this.getField('patterns')
                    .getItemsAsCollection()
                    .mapValues(function (patternOrder, patternRef) {
                        return patternRef.toDocument().getSymbol();
                    })
                    .toStringDictionary()
                    .reverse()
                    .items;

                bookworm.index
                    .setNode('pattern>by-symbol'.toPath(), symbolToPatternRef);
            },

            /** @private */
            _addByReferenceLookup: function () {
                var patternRefToSymbol = this.getField('patterns')
                    .getItemsAsCollection()
                    .mapValues(function (patternOrder, patternRef) {
                        return patternRef.toDocument().getSymbol();
                    })
                    .items;

                bookworm.index
                    .setNode('pattern>by-reference'.toPath(), patternRefToSymbol);
            }
        })
        .addMethods(/** @lends app.model.PatternsDocument# */{
            /**
             * @param {bookworm.DocumentKey} patternsKey
             * @ignore
             */
            init: function (patternsKey) {
                base.init.call(this, patternsKey);
                this._addBySymbolLookup();
                this._addByReferenceLookup();
            },

            /** @returns {sntls.Hash} */
            getPatternsAsCollection: function () {
                return this.getField('patterns')
                    .getItemsAsCollection()
                    .getKeysAsHash()
                    .toCollection()
                    .callOnEachItem('toDocumentKey');
            },

            /**
             * @param {string} symbol
             * @returns {bookworm.DocumentKey}
             */
            getPatternKeyBySymbol: function (symbol) {
                var patternRef = bookworm.index
                    .getNode(['pattern', 'by-symbol', symbol].toPath());

                return patternRef ?
                    patternRef.toDocumentKey() :
                    undefined;
            }
        });
});

troop.amendPostponed(bookworm, 'Document', function (ns, className, /**app.model*/model) {
    "use strict";

    bookworm.Document
        .addSurrogate(model, 'PatternsDocument', function (documentKey) {
            return documentKey.documentType === 'patterns';
        });
}, app.model);
