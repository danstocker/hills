/*global dessert, troop, sntls, LZString, app */
(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {string} */
            toCompressed: function () {
                return LZString.compressToBase64(this);
            },

            /** @returns {string} */
            toDecompressed: function () {
                return LZString.decompressFromBase64(this);
            },

            /** @returns {string} */
            toUriComponentEncoded: function () {
                return encodeURIComponent(this);
            },

            /** @returns {string} */
            toUriComponentDecoded: function () {
                return decodeURIComponent(this);
            }
        },
        false, false, false
    );
}());
