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
            DEFAULT_ROUTE: 'LQPg+qHpPXUNo+TUvczase33BOR+xhJ5Zlp1FNVtD9TdLjrzbnH37vXfPfkMEiBY4eNETpU2ZPkyFcxSuVqlG1ZvVbdO/dsN6jB42dMWTV89cs37dx7ecOXT1x/de3Pz7+9+gQHB/qFBYSHhUYRAAA=='
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
