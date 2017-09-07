var gulp = require('gulp');
var clean = require('gulp-clean');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');

var DEV_PATH = './html';
var BUILD_PATH = '../site/src/main/webapp/html';
var BUILD_LIB_PATH = '../site/src/main/webapp/lib';
var LIB_PATH = './lib/**/*';
var MOVE_DEV_PATH = './html/**/*';
var CLEAN_PATH = [];

CLEAN_PATH.push(DEV_PATH);
CLEAN_PATH.push(BUILD_PATH);

gulp.task('clean', function () {
    return gulp.src(CLEAN_PATH)
        .pipe(clean({ force: true }));
});

gulp.task('build-js', ['clean'], function () {
    return gulp.src('./src/app.jsx')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest('html/dist/'));
});

gulp.task('move-dev', ['build-js'], function () {
    return gulp.src(MOVE_DEV_PATH)
        .pipe(gulp.dest(BUILD_PATH))
});

gulp.task('build', ['clean', 'build-js', 'move-dev'], function () {
    console.log('=======================================');
    console.log('front-end build done !');
    console.log('=======================================');
});



