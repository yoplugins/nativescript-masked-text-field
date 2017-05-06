﻿module.exports = function (grunt) {
    var localConfig = {
        typeScriptDeclarations:[
            "**/*.d.ts",
            "!references.d.ts",
            "!demo/**/*.*",
            "!node_modules/**/*.*",
            "!bin/**/*.*"
        ],
        outDir: "bin/dist/"
    }

    grunt.initConfig({
        clean:{
            build:{
                src:[localConfig.outDir]
            }
        },
        copy: {
            declarations: {
                src: localConfig.typeScriptDeclarations,
                dest: localConfig.outDir
            },
            platforms: {
                files: [{ expand: true, src: ["platforms/**"], dest: localConfig.outDir }]
            },            
            packageConfig: {
                src: "package.json",
                dest: localConfig.outDir,
                options: {
                    process: function (content, srcPath) {
                        var contentAsObject = JSON.parse(content);
                        contentAsObject.devDependencies = undefined;
                        return JSON.stringify(contentAsObject, null, "\t");
                    }
                }
            },
            readme: {
                src: "README.md",
                dest: localConfig.outDir,
                options: {
                    process: function (content, srcPath) {
                        return content.substring(content.indexOf("\n") + 1)
                    }
                }
            }
        },
        exec: {
            tsCompile: {
                cmd: "./node_modules/.bin/tsc --project tsconfig.json --outDir " + localConfig.outDir
            },
            tslint: {
                cmd: "./node_modules/.bin/tslint --project tsconfig.json --type-check"
            },
            npm_publish: {
                cmd: "npm publish", 
                cwd: localConfig.outDir
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-exec");

    grunt.registerTask("build", [
        "exec:tslint",
        "clean:build",
        "exec:tsCompile",
        "copy"
    ]);
    grunt.registerTask("publish", [
        "build",
        "exec:npm_publish"
    ]);
};