/**
 * Created by zhengjunling on 2016/11/24.
 */

var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync').create(),
    rename = require('gulp-rename'),
    concat = require("gulp-concat");

gulp.task('lessToCss', function () {
    gulp.src('public/plugins/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('public/plugins/bootstrap/dist/css'));
});

gulp.task('concatCss', function () {
    gulp.src(['public/plugins/bootstrap/dist/css/bootstrap.css',
            'public/src/css/admin.css',
            'public/src/css/admin-extend.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "http://10.20.134.30:8080/",
        files: ["index.html", "login.html", "public/css/**/*", "public/html/**/*"],
        port: 8001
    });
});

gulp.watch('public/plugins/bootstrap/less/**/*', ['lessToCss']);
gulp.watch('public/plugins/bootstrap/dist/css/**/*', ['concatCss']);
gulp.watch('public/src/css/**/*', ['concatCss']);

gulp.task('dev', ['browser-sync', 'lessToCss', 'concatCss']);