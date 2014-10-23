/*global dessert, troop, sntls, LZString, app */
(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {string} */
            toCompressed: function () {
                return LZString.compressToBase64(this.valueOf());
            },

            /** @returns {string} */
            toDecompressed: function () {
                return LZString.decompressFromBase64(this.valueOf());
            }
        },
        false, false, false
    );
}());
