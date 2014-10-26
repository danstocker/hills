/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var prodPath = './out-prod/',
        devPath = './out-dev/',
        grocer = require('grocer'),
        manifestNode = grunt.file.readJSON('./build/manifest.json'),
        manifest = grocer.Manifest.create(manifestNode),
        multiTasks = [].toMultiTaskCollection();

    grocer.GruntProxy.create()
        .setGruntObject(grunt);

    /**
     * @param {string} assetType
     * @returns {Array}
     */
    function getCopySrcDestPairs(assetType) {
        return manifest.getAssets(assetType)
            .getFlatAssetFileNameLookup()
            .toCollection()
            .mapValues(function (flatFileName, assetPath) {
                return {
                    src : assetPath,
                    dest: devPath + flatFileName
                };
            })
            .getValues();
    }

    /**
     * @param {string} assetType
     * @returns {Array}
     */
    function getMinificationSrcDestPairs(assetType) {
        return manifest.modules
            .filterBySelector(function (/**grocer.Module*/module) {
                return !!module.getAssets(assetType);
            })
            .mapKeys(function (/**grocer.Module*/module) {
                return prodPath + module.toAsset(assetType).assetName;
            })
            .mapValues(function (/**grocer.Module*/module) {
                return module.getAssets(assetType).getAssetNames();
            })
            .items;
    }

    // copying static assets
    'copy'
        .toMultiTask({
            development: {
                files: getCopySrcDestPairs('js')
                    .concat(getCopySrcDestPairs('css'))
                    .concat([
                        {
                            src : [ 'images/**' ],
                            dest: devPath
                        }
                    ])
            },

            production: {
                files: [
                    {
                        src : [ 'images/**' ],
                        dest: prodPath
                    }
                ]
            }
        })
        .setPackageName('grunt-contrib-copy')
        .addToCollection(multiTasks);

    // adding assets to index.html
    'replace'
        .toMultiTask({
            development: {
                options: {
                    patterns: [
                        {
                            match      : /<!--ASSETS-->/,
                            replacement: [
                                manifest.getFlatAssets('js'),
                                manifest.getFlatAssets('css')
                            ].join('\n')
                        }
                    ]
                },

                files: [
                    {
                        expand : true,
                        flatten: true,
                        src    : ['./build/index.html'],
                        dest   : devPath
                    }
                ]
            },

            production: {
                options: {
                    patterns: [
                        {
                            match      : /<!--ASSETS-->/,
                            replacement: [
                                manifest.getModulesAsAssets('js'),
                                manifest.getModulesAsAssets('css')
                            ].join('\n')
                        }
                    ]
                },

                files: [
                    {
                        expand : true,
                        flatten: true,
                        src    : ['./build/index.html'],
                        dest   : prodPath
                    }
                ]
            }
        })
        .setPackageName('grunt-replace')
        .addToCollection(multiTasks);

    // minifying JS
    'uglify'
        .toMultiTask({
            production: {
                files: getMinificationSrcDestPairs('js')
            }
        })
        .setPackageName('grunt-contrib-uglify')
        .addToCollection(multiTasks);

    // minifying CSS
    'cssmin'
        .toMultiTask({
            production: {
                files: getMinificationSrcDestPairs('css')
            }
        })
        .setPackageName('grunt-contrib-cssmin')
        .addToCollection(multiTasks);

    // registering tasks
    multiTasks.toGruntConfig()
        .applyConfig()
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())
        .applyTask();
};
