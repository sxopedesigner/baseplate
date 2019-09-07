'use strict';

var gulp = require('gulp');
var scss = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var shorthand = require('gulp-shorthand');
var cleancss = require('gulp-clean-css');
var mediaQ = require('gulp-group-css-media-queries');
var webp = require('gulp-webp');
var zip = require('gulp-zip');

gulp.task('style', function () {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(shorthand())
        .pipe(mediaQ())
        .pipe(cleancss())
        .pipe(gulp.dest('./public/css'));
});
gulp.task('webp', function () {
    return gulp.src('./app/images/**/*.{jpg,jpeg,png,svg}')
        .pipe(webp())
        .pipe(gulp.dest('./public/images'));
});
gulp.task('app-zip', function () {
    return gulp.src('./app/**/*.*')
        .pipe(zip('app.zip'))
        .pipe(gulp.dest('./'));
});
gulp.task('public-zip', function () {
    return gulp.src('./public/**/*.*')
        .pipe(zip('public.zip'))
        .pipe(gulp.dest('./'));
});
gulp.task('zip', gulp.series(['app-zip', 'public-zip']));

gulp.task('default', function () {
    gulp.watch('./app/scss/**/*.scss', gulp.parallel('style'));
    gulp.watch('./app/images/**/*.{jpg,jpeg,png,svg}', gulp.parallel('webp'))
});