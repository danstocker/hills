/*global dessert, troop, sntls, evan, bookworm, app */
troop.amendPostponed(bookworm, 'Document', function () {
    "use strict";

    bookworm.Document
        .setInstanceMapper(function (documentKey) {
            return documentKey.toString();
        });
});
