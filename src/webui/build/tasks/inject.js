'use strict';
var gulp = require("gulp"),
    inject = require('gulp-inject'),
    connect = require('gulp-connect'),
    config = require("../config/inject");

//inject dev
gulp.task('inject:dev_index', ['sass:front_app', 'templateCache'], function () {
    var filters = {
        "css": [
            {"pattern": "/dist/app.css", "replaceStr": "/app.css"}
        ],
        "js": [
            {"pattern": "/src/", "replaceStr": "/"},
            {"pattern": "/dist/app/app.tpl.js", "replaceStr": "/app/app.tpl.js"}
        ]
    };
    executeTasks("./src/index.html", "./dist", config.dev_index, filters);
});

gulp.task('inject:dev_admin_index', ['sass:admin_app', 'templateCache'], function () {
    var filters = {
        "css": [
            {"pattern": "/src/plugins/", "replaceStr": "/plugins/"},
            {"pattern": "/dist/admin/", "replaceStr": "/admin/"}
        ],
        "js": [
            {"pattern": "/src/common/", "replaceStr": "../common/"},
            {"pattern": "/src/admin/", "replaceStr": "/admin/"},
            {"pattern": "/dist/admin/app/app.tpl.js", "replaceStr": "/admin/app/app.tpl.js"}
        ]
    };
    executeTasks("./src/admin/index.html", "./dist/admin", config.dev_admin_index, filters);
});

gulp.task('inject:dev_login', ['sass:admin_app', 'templateCache'], function () {
    var filters = {
        "css": [
            {"pattern": "/src/plugins/", "replaceStr": "/plugins/"},
            {"pattern": "/dist/admin/", "replaceStr": "/admin/"}
        ],
        "js": [
            {"pattern": "/src/common/", "replaceStr": "../common/"},
            {"pattern": "/src/admin/", "replaceStr": "/admin/"},
            {"pattern": "/dist/admin/app/app.tpl.js", "replaceStr": "/admin/app/app.tpl.js"}
        ]
    };
    executeTasks("./src/admin/login.html", "./dist/admin", config.dev_login, filters);
});

//inject prod
gulp.task('inject:prod_index', ['sass:front_app', 'templateCache'], function () {
    var filters = {
        "css": [
            {"pattern": "/dist/app-*.css", "replaceStr": "/"}
        ],
        "js": [
            {"pattern": "/src/app-*.js", "replaceStr": "/"}
        ]
    };
    executeTasks("./src/index.html", "./dist", config.prod_index, filters);
});

gulp.task('inject:prod_admin_index', ['sass:admin_app', 'templateCache'], function () {
    var filters = {
        "css": [
            {"pattern": "/src/plugins/", "replaceStr": "/plugins/"},
            {"pattern": "/dist/admin/", "replaceStr": "/admin/"}
        ],
        "js": [
            {"pattern": "/src/common/", "replaceStr": "../common/"},
            {"pattern": "/src/admin/", "replaceStr": "/admin/"}
        ]
    };
    executeTasks("./src/admin/index.html", "./dist/admin", config.prod_admin_index, filters);
});

gulp.task('inject:prod_login', ['sass:admin_app', 'templateCache'], function () {
    var filters = {
        "css": [
            {"pattern": "/src/plugins/", "replaceStr": "/plugins/"},
            {"pattern": "/dist/admin/", "replaceStr": "/admin/"}
        ],
        "js": [
            {"pattern": "/src/common/", "replaceStr": "../common/"},
            {"pattern": "/src/admin/", "replaceStr": "/admin/"}
        ]
    };
    executeTasks("./src/admin/login.html", "./dist/admin", config.prod_login, filters);
});

//common
function executeTasks(sourceTpl, destFolder, configIndex, filters) {
    var target = gulp.src(sourceTpl);
    var cssSources = gulp.src(configIndex.src.css, {read: false});
    var jsSources = gulp.src(configIndex.src.js, {read: false});

    return target.pipe(inject(cssSources, {
        transform: function (filePath) {
            return '<link rel="stylesheet" type="text/css" href="' + getPath(filePath, filters.css) + '" />';
        }
    }))
        .pipe(inject(jsSources, {
            transform: function (filePath) {
                // console.log(filePath);
                return '<script type="text/javascript" src="' + getPath(filePath, filters.js) + '"></script>';
            }
        }))
        .pipe(gulp.dest(destFolder))
        .pipe(connect.reload());
}

function getPath(filePath, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (filePath.match(filter.pattern)) {
            return filePath.replace(filter.pattern, filter.replaceStr);
        }
    }
    return filePath;
}