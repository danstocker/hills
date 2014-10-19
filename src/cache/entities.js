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
                1 : {
                    ref   : 'pattern/1',
                    symbol: '#',
                    desc  : "Crossing"
                },
                2 : {
                    ref   : 'pattern/2',
                    symbol: '|',
                    desc  : "Straight road"
                },
                3 : {
                    ref   : 'pattern/3',
                    symbol: '-',
                    desc  : "Elevated grass"
                },
                4 : {
                    ref   : 'pattern/4',
                    symbol: '_',
                    desc  : "Low grass"
                },
                5 : {
                    ref   : 'pattern/5',
                    symbol: '=',
                    desc  : "Asphalt"
                },
                6 : {
                    ref   : 'pattern/6',
                    symbol: '~',
                    desc  : "Water"
                },
                7 : {
                    ref   : 'pattern/7',
                    symbol: ',',
                    desc  : "Low dirt"
                },
                8 : {
                    ref   : 'pattern/8',
                    symbol: '\'',
                    desc  : "High dirt"
                },
                9 : {
                    ref   : 'pattern/9',
                    symbol: '.',
                    desc  : "Sand"
                },
                10: {
                    ref   : 'pattern/10',
                    symbol: '/',
                    desc  : "Diagonal ramp"
                },
                11: {
                    ref   : 'pattern/11',
                    symbol: '\\',
                    desc  : "Flat ramp"
                },
                12: {
                    ref   : 'pattern/12',
                    symbol: '1',
                    desc  : "Straight road in water"
                },
                13: {
                    ref   : 'pattern/13',
                    symbol: 'i',
                    desc  : "Narrow road on ramp"
                },
                14: {
                    ref   : 'pattern/14',
                    symbol: 'I',
                    desc  : "Wide road on ramp"
                },
                15: {
                    ref   : 'pattern/15',
                    symbol: 't',
                    desc  : "Narrow t-section"
                },
                16: {
                    ref   : 'pattern/16',
                    symbol: 'c',
                    desc  : "Turn"
                },
                17: {
                    ref   : 'pattern/17',
                    symbol: 'U',
                    desc  : "Dead end"
                },
                18: {
                    ref   : 'pattern/18',
                    symbol: 'E',
                    desc  : "Sidewalk"
                },
                19: {
                    ref   : 'pattern/19',
                    symbol: 'T',
                    desc  : "Thick t-section"
                },
                20: {
                    ref   : 'pattern/20',
                    symbol: 'L',
                    desc  : "Corner"
                },
                21: {
                    ref   : 'pattern/21',
                    symbol: '[',
                    desc  : "Water with side grass"
                },
                22: {
                    ref   : 'pattern/22',
                    symbol: '\"',
                    desc  : "Water with grass in corner"
                },
                23: {
                    ref   : 'pattern/23',
                    symbol: '(',
                    desc  : "Water with grass on adjacent sides"
                },
                24: {
                    ref   : 'pattern/24',
                    symbol: '$',
                    desc  : "Waterway with grass"
                },
                25: {
                    ref   : 'pattern/25',
                    symbol: '{',
                    desc  : "Waterway turn in grass"
                },
                26: {
                    ref   : 'pattern/26',
                    symbol: ']',
                    desc  : "Water with side sand"
                },
                27: {
                    ref   : 'pattern/27',
                    symbol: '`',
                    desc  : "Water with sand in corner"
                },
                28: {
                    ref   : 'pattern/28',
                    symbol: ')',
                    desc  : "Water with sand on adjacent sides"
                },
                29: {
                    ref   : 'pattern/29',
                    symbol: '%',
                    desc  : "Waterway with sand"
                },
                30: {
                    ref   : 'pattern/30',
                    symbol: '}',
                    desc  : "Waterway turn in sand"
                }
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