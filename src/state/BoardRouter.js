/*global dessert, troop, sntls, flock, bookworm, app */
troop.postpone(app.state, 'BoardRouter', function (ns, className) {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name app.state.BoardRouter.create
     * @function
     * @returns {app.state.BoardRouter}
     */

    /**
     * @class
     * @extends troop.Base
     */
    app.state.BoardRouter = self
        .addMethods(/** @lends app.state.BoardRouter# */{
            /** @param {flock.ChangeEvent} event */
            onBoardChange: function (event) {
                event.originalPath.clone().trimLeft()
                    .toDocumentKey()
                    .toDocument()
                    .toString()
                    .toCompressed()
                    .toRoute()
                    .navigateTo();
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function (ns, className, /**app.state*/state) {
    "use strict";

    bookworm.entities
        .subscribeTo(flock.ChangeEvent.EVENT_CACHE_CHANGE, 'document>board'.toPath(), function (event) {
            state.BoardRouter.onBoardChange(event);
        });
}, app.state);
