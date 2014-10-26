/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var outPath = './out/',
        grocer = require('grocer'),
        manifestNode = grunt.file.readJSON('./build/manifest.json'),
        manifest = grocer.Manifest.create(manifestNode),
        multiTasks = [].toMultiTaskCollection();

    grocer.GruntProxy.create()
        .setGruntObject(grunt);

    // copying static assets
    'copy'
        .toMultiTask({
            production: {
                files: [
                    {
                        src : [ 'images/**' ],
                        dest: outPath
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
                                manifest.getAssets('js'),
                                manifest.getAssets('css')
                            ].join('\n')
                        }
                    ]
                },

                files: [
                    {
                        expand : true,
                        flatten: true,
                        src    : ['./build/index.html'],
                        dest   : './'
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
                        dest   : outPath
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
                files: manifest.modules
                    .filterBySelector(function (/**grocer.Module*/module) {
                        return !!module.getAssets('js');
                    })
                    .mapKeys(function (/**grocer.Module*/module) {
                        return outPath + module.toAsset('js').assetName;
                    })
                    .mapValues(function (/**grocer.Module*/module) {
                        return module.getAssets('js').getAssetNames();
                    })
                    .items
            }
        })
        .setPackageName('grunt-contrib-uglify')
        .addToCollection(multiTasks);

    // minifying CSS
    'cssmin'
        .toMultiTask({
            production: {
                files: manifest.modules
                    .filterBySelector(function (/**grocer.Module*/module) {
                        return !!module.getAssets('css');
                    })
                    .mapKeys(function (/**grocer.Module*/module) {
                        return outPath + module.toAsset('css').assetName;
                    })
                    .mapValues(function (/**grocer.Module*/module) {
                        return module.getAssets('css').getAssetNames();
                    })
                    .items
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
