var gulp = require('gulp'),
    scss = require('gulp-ruby-sass'),
    htmlmin = require('gulp-html-minifier'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    uglify = require("gulp-uglify");

// Minfies SCSS files

gulp.task('styles', function () {
  return scss('src/scss/main.scss', {
      noCache: true,
      loadPath: [ 'node_modules' ]
    })
    .on('error', scss.logError)
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'SCSS Compiled & Minified' }));

});

// Compress Image Assets
gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 1
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({message:"Compressed Images."}));
});

// Minfies and Concatenates Module Files
gulp.task('modules', function() {
    return gulp.src("src/javascripts/modules/*.js")
        .pipe(concat('modules.js'))
        .pipe(gulp.dest("dist/javascripts/modules"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/javascripts/modules'))
        .pipe(livereload())
        .pipe(notify({message:"Minified & Bundled Modules."}));
});

// Minfies and Concatenates Service Files
gulp.task('services', function() {
    return gulp.src("src/javascripts/services/*.js")
        .pipe(concat('services.js'))
        .pipe(gulp.dest("dist/javascripts/services"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/javascripts/services'))
        .pipe(livereload())
        .pipe(notify({message:"Minified & Bundled Services."}));
});

// Minfies and Concatenates Controller Files
gulp.task('controllers', function() {
    return gulp.src("src/javascripts/controllers/*.js")
        .pipe(concat('controllers.js'))
        .pipe(gulp.dest("dist/javascripts/controllers"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/javascripts/controllers'))
        .pipe(livereload())
        .pipe(notify({message:"Minified & Bundled Controllers."}));
});

gulp.task('lib', function() {
    gulp.src("src/lib/*.js")
        .pipe(concat('prism.js'))
        .pipe(gulp.dest("dist/javascripts/lib"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/javascripts/lib'))

    return gulp.src("src/lib/*.css")
        .pipe(gulp.dest('dist/css/lib'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css/lib'))
        .pipe(notify({ message: 'Lib Compiled & Minified' }));
});

// Minfies and Concatenates Controller Files
gulp.task('filters', function() {
    return gulp.src("src/javascripts/filters/*.js")
        .pipe(concat('filters.js'))
        .pipe(gulp.dest("dist/javascripts/filters"))
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('dist/javascripts/filters'))
        .pipe(livereload())
        .pipe(notify({message:"Minified & Bundled Filters."}));
});

// Minfies - Removes Comments - Template Files
gulp.task('templates', function() {
  return gulp.src('src/templates/*.html')
    .pipe(htmlmin({ collapseWhitespace: false,
        preserveLineBreaks: true,
        removeComments : true
    }))
    .pipe(gulp.dest('dist/templates'))
    .pipe(notify({message:"HTML Minified."}));
});

// Livereload, and build sytem on file change.
gulp.task('default', function() {
    livereload.listen();
    gulp.watch(['dist/**', 'index.html']).on('change', livereload.changed);
    gulp.watch(['src/javascripts/modules/*.js'], ['modules']);
    gulp.watch(['src/javascripts/services/*.js'], ['services']);
    gulp.watch(['src/javascripts/controllers/*.js'], ['controllers']);
    gulp.watch(['src/javascripts/filters/*.js'], ['filters']);
    gulp.watch(['src/templates/*.html'], ['templates']);
    gulp.watch(['src/scss/*.scss'], ['styles']);
});

gulp.task('build', ['modules', 'services', 'controllers', 'filters', 'templates', 'styles', 'lib', 'images'])
