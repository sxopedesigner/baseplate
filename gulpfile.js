'use strict';

var gulp            = require('gulp');
var scss            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var shorthand       = require('gulp-shorthand');
var cleancss        = require('gulp-clean-css');
var mediaQ          = require('gulp-group-css-media-queries');
var webp            = require('gulp-webp');
var zip             = require('gulp-zip');
var rename          = require('gulp-rename');
var browserSync     = require('browser-sync').create();

var src = {
    app     : 'app/**/*.*',
    public  : 'public/**/*.*',
    html    : 'app/**/*.html',
    scss    : 'app/scss/**/*.scss',
    css     : 'app/scss/**/*.css',
    images  : 'app/images/**/*.{jpg,jpeg,png,svg}',
    js      : 'app/js/**/*.js'
};

// Run gulp serve
gulp.task('serve', function () {
    browserSync.init({
        server: "./app"
    });
    gulp.watch(src.html).on('change', browserSync.reload);
    gulp.watch(src.scss, gulp.parallel('style'));
    gulp.watch(src.images, gulp.parallel('webp'))
})

// Run gulp style
gulp.task('style', function () {
    return gulp.src(src.scss)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(shorthand())
        .pipe(mediaQ())
        .pipe(cleancss())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('app/css'))

        .pipe(browserSync.stream());
});

// Run gulp webp
gulp.task('webp', function () {
    return gulp.src(src.images)
        .pipe(webp())
        .pipe(gulp.dest('app/images'));
});

// Run gulp app-zip
gulp.task('app-zip', function () {
    return gulp.src(src.app)
        .pipe(zip('app.zip'))
        .pipe(gulp.dest('./'));
});
// Run gulp zip
gulp.task('public-zip', function () {
    return gulp.src(src.public)
        .pipe(zip('public.zip'))
        .pipe(gulp.dest('./'));
});
gulp.task('project-zip', function () {
    return gulp.src([src.app, src.public,'./*.js','./*.json'])
        .pipe(zip('project.zip'))
        .pipe(gulp.dest('./'));
});
gulp.task('zip', gulp.series(['app-zip', 'public-zip', 'project-zip']));

// Run gulp copy
gulp.task('copy-Bootstrap-CSS', function () {
    return gulp.src('node_modules/bootstrap/scss/**/*.scss')
        .pipe(gulp.dest('./app/scss/bootstrap'));
});
gulp.task('copy-Bootstrap-JS', function () {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest('./app/js/'));
})
gulp.task('copy-jquery', function () {
    return gulp.src('node_modules/jquery/dist/jquery.js')
        .pipe(gulp.dest('./app/js'));
})
gulp.task('copy-popper-JS', function () {
    return gulp.src('node_modules/popper.js/dist/popper.js')
        .pipe(gulp.dest('./app/js'));
})
gulp.task('copy', gulp.series(['copy-Bootstrap-CSS', 'copy-Bootstrap-JS','copy-jquery','copy-popper-JS']));

// Run gulp
gulp.task('default', gulp.parallel('serve'));