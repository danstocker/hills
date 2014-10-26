/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var grocer = require('grocer'),
        manifestNode = grunt.file.readJSON('./build/manifest.json'),
        manifest = grocer.Manifest.create(manifestNode),
        multiTasks = [].toMultiTaskCollection();

    grocer.GruntProxy.create()
        .setGruntObject(grunt);

    // building config
    'replace'
        .toMultiTask({
            build: {
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
            }
        })
        .setPackageName('grunt-replace')
        .addToCollection(multiTasks);

    // registering tasks
    multiTasks.toGruntConfig()
        .applyConfig()
        .getAliasTasksGroupedByTarget()
        .mergeWith(multiTasks.toGruntTaskCollection())
        .applyTask();
};
