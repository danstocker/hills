/*global dessert, troop, sntls, flock, bookworm, milkman, app */
troop.postpone(app.state, 'BoardRouter', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     */
    app.state.BoardRouter = self
        .addConstants(/** @lends app.state.BoardRouter */{
            /** @constant */
            DEFAULT_ROUTE: 'LQPg%2BqHpPXUNo%2BTUvczase33BOR%2BxhJ5Zlp1FNVtD9TdLjrzbnH37vXfPfkMEiBY4eNETpU2ZPkyFcxSuVqlG1ZvVbdO%2FdsN6jB42dMWTV89cs37dx7ecOXT1x%2Fde3Pz7%2B9%2BgQHB%2FqFBYSHhUYRAAA%3D%3D'
        })
        .addMethods(/** @lends app.state.BoardRouter */{
            /** @param {flock.ChangeEvent} event */
            onTileItemChange: function (event) {
                event.originalPath.clone().trimLeft()
                    // obtaining board document
                    .toDocumentKey()
                    .toDocument()

                    // serializing & compressing board
                    .toString()
                    .toCompressed()
                    .toUriComponentEncoded()

                    // creating route based on board
                    .toRoute()
                    .setNextOriginalEvent(event)
                    .navigateTo()
                    .clearNextOriginalEvent();
            },

            /** @param {milkman.RoutingEvent} event */
            onRouteChange: function (event) {
                var beforeRoute = event.beforeRoute,
                    afterRoute = event.afterRoute,
                    emptyRoute = [].toRoute();

                if (afterRoute) {
                    if (afterRoute.equals(emptyRoute)) {
                        // after route is empty
                        this.DEFAULT_ROUTE.toRoute()
                            .navigateTo();
                    } else if (!beforeRoute || beforeRoute.equals(emptyRoute)) {
                        // after route is not empty, but before route is
                        afterRoute.toString()
                            .toUriComponentDecoded()
                            .toBoardDocumentFromCompressed();
                    }
                }
            }
        });
});

troop.amendPostponed(bookworm, 'entities', function (ns, className, /**app.state*/state) {
    "use strict";

    bookworm.entities
        .delegateSubscriptionTo(
            flock.ChangeEvent.EVENT_CACHE_CHANGE,
            'document>board'.toPath(),
            'document>board>|>tiles>|>|'.toQuery(),
            (function (event) {
                state.BoardRouter.onTileItemChange(event);
            }));
}, app.state);

troop.amendPostponed(milkman, 'Route', function (ns, className, /**app.state*/state) {
    "use strict";

    [].toRoute()
        .subscribeTo(milkman.Router.EVENT_ROUTE_CHANGE, function (event) {
            state.BoardRouter.onRouteChange(event);
        });
}, app.state);
