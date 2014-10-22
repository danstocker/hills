/*global dessert, troop, sntls, bookworm, app */
troop.amendPostponed(bookworm, 'config', function () {
    "use strict";

    bookworm.entities.items = {
        document: {
            preferences: {
                main: {
                    pattern: 'pattern/2'
                }
            },

            pattern: {
                1 : {ref: 'pattern/1', symbol: "O", top: 0, left: 0, desc: "Asphalt"},
                2 : {ref: 'pattern/2', symbol: "I", top: 1, left: 0, desc: "Straight road"},
                3 : {ref: 'pattern/3', symbol: "T", top: 2, left: 0, desc: "T junction"},
                4 : {ref: 'pattern/4', symbol: "^", top: 3, left: 0, desc: "Lot entrance"},
                5 : {ref: 'pattern/5', symbol: "#", top: 4, left: 0, desc: "Crossing"},
                6 : {ref: 'pattern/6', symbol: "_", top: 5, left: 0, desc: "Lot edge"},
                7 : {ref: 'pattern/7', symbol: "L", top: 6, left: 0, desc: "Lot corner"},
                8 : {ref: 'pattern/8', symbol: "U", top: 7, left: 0, desc: "Dead end"},
                9 : {ref: 'pattern/9', symbol: "C", top: 8, left: 0, desc: "Turn"},
                10: {ref: 'pattern/10', symbol: "V", top: 9, left: 0, desc: "Ramp"},
                11: {ref: 'pattern/11', symbol: "A", top: 10, left: 0, desc: "Bridge ramp"},
                12: {ref: 'pattern/12', symbol: "-", top: 11, left: 0, desc: "Grass"},
                13: {ref: 'pattern/13', symbol: "=", top: 12, left: 0, desc: "High grass"},
                14: {ref: 'pattern/14', symbol: "/", top: 13, left: 0, desc: "Hill side"},
                15: {ref: 'pattern/15', symbol: "Y", top: 14, left: 0, desc: "Hill corner"},
                16: {ref: 'pattern/16', symbol: "~", top: 0, left: 1, desc: "Water"},
                17: {ref: 'pattern/17', symbol: "i", top: 1, left: 1, desc: "Bridge"},
                18: {ref: 'pattern/18', symbol: "`", top: 2, left: 1, desc: "Sand tip"},
                19: {ref: 'pattern/19', symbol: "]", top: 3, left: 1, desc: "Sand edge"},
                20: {ref: 'pattern/20', symbol: "j", top: 4, left: 1, desc: "Sand corner"},
                21: {ref: 'pattern/21', symbol: ")", top: 5, left: 1, desc: "Sand turn"},
                22: {ref: 'pattern/22', symbol: "|", top: 6, left: 1, desc: "Sand waterway"},
                23: {ref: 'pattern/23', symbol: "'", top: 7, left: 1, desc: "Grass tip"},
                24: {ref: 'pattern/24', symbol: "[", top: 8, left: 1, desc: "Grass edge"},
                25: {ref: 'pattern/25', symbol: "l", top: 9, left: 1, desc: "Grass corner"},
                26: {ref: 'pattern/26', symbol: "(", top: 10, left: 1, desc: "Grass turn"},
                27: {ref: 'pattern/27', symbol: "1", top: 11, left: 1, desc: "Grass waterway"},
                28: {ref: 'pattern/28', symbol: ".", top: 12, left: 1, desc: "Dirt"},
                29: {ref: 'pattern/29', symbol: ":", top: 13, left: 1, desc: "High dirt"},
                30: {ref: 'pattern/30', symbol: ",", top: 14, left: 1, desc: "Sand"}
            },

            patterns: {
                all: {
                    ref: 'patterns/all',

                    patterns: {
                        'pattern/1' : 0,
                        'pattern/2' : 1,
                        'pattern/3' : 2,
                        'pattern/4' : 3,
                        'pattern/5' : 4,
                        'pattern/6' : 5,
                        'pattern/7' : 6,
                        'pattern/8' : 7,
                        'pattern/9' : 8,
                        'pattern/10': 9,
                        'pattern/11': 10,
                        'pattern/12': 11,
                        'pattern/13': 12,
                        'pattern/14': 13,
                        'pattern/15': 14,
                        'pattern/16': 15,
                        'pattern/17': 16,
                        'pattern/18': 17,
                        'pattern/19': 18,
                        'pattern/20': 19,
                        'pattern/21': 20,
                        'pattern/22': 21,
                        'pattern/23': 22,
                        'pattern/24': 23,
                        'pattern/25': 24,
                        'pattern/26': 25,
                        'pattern/27': 26,
                        'pattern/28': 27,
                        'pattern/29': 28,
                        'pattern/30': 29
                    }
                }
            }
        }
    };
});