"use strict";

//require dependencies
var gulp = require('gulp'),
	concat = require('gulp-concat'),
	minify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	csso = require('gulp-csso'),
	resizer = require('gulp-images-resizer'),
	maps = require('gulp-sourcemaps'),
	del = require('del'),
	webserver = require('gulp-webserver'),
	useref = require('gulp-useref'),
	runSequence = require('run-sequence');

//concatenate, minify and create sourcemaps for all javascript files and place files to dist/scripts folder
gulp.task('scripts', function() {
	return gulp.src(['js/global.js', 'js/circle/autogrow.js', 'js/circle/circle.js'])
		.pipe(maps.init())
		.pipe(concat('all.min.js'))
		.pipe(minify())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/scripts'))
});

//concatenate, minify and create sourcemaps for all css files and place to dist/styles folder
gulp.task('styles', function() {
	return gulp.src('sass/*.*')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(concat('all.min.css'))
		.pipe(csso())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/styles'))
});

//optimize the size of image files and place to dist/content folder
gulp.task('images', function () {
	return gulp.src('images/*.*')
		.pipe(resizer({
			width: '50%',
			height: '50%'
		}))
		.pipe(gulp.dest('dist/content'))
});

//clean all files and folders in the dist folder
gulp.task('clean', function() {
	return del(['dist'])
});

//parse the build blocks in the HTML, replace them, place new index.html in dist folder
gulp.task('html', function() {
	return gulp.src('index.html')
		.pipe(useref())
		.pipe(gulp.dest('dist/'))
});

//build task to handle cleaning of dist folder and building styles, scripts, images and html
gulp.task('build', function(done) {
   runSequence('clean', ['scripts', 'styles', 'images'], 'html',
   done);
});

//start local webserver and serve the project
gulp.task('serve', function() {
	return gulp.src('dist/')
		.pipe(webserver({
			port : 3000,
			open : true
		}))
});

//default task to run build command and serve the project on a local web server
gulp.task('default', ['build'], function() {
	gulp.start('serve')
});
