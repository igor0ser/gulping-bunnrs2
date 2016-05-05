'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var pathExists = require('path-exists');

var sass = require('gulp-sass');
var rigger = require('gulp-rigger');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var watch= require('gulp-watch');
var open = require('gulp-open');
var zip = require('gulp-zip');
var  rimraf = require('rimraf-promise');

var path = {
	src: () => 'src/' + argv.size + '/',
	build: () => 'build/' + argv.size + '/'
};

gulp.task('css', () => 
		gulp.src([path.src() + 'variables.scss', 'src/main.scss'])
		.pipe(concat('temp.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('_temp.html'))
		.pipe(gulp.dest('src'))
);


gulp.task('copyFiles', () => 
	gulp.src([
			path.src() + '*.png',
			path.src() + '*.gif',
			path.src() + '*.jpg',
			'src/jquery.slimscroll.min.js'
		])
		.pipe(gulp.dest(path.build()))
);

gulp.task('html', ['css'], () => 
	gulp.src('src/index.html')
		.pipe(rigger())
		.pipe(gulp.dest(path.build())
));

gulp.task('watch', () => 
	watch(['src/' + argv.size + '/**/*.*', 'src/*.*'],(event, cb) => 
		gulp.start('zip'))
);

gulp.task('open', ['zip'], () => {
	var options = {
		app: 'chrome',
		uri: path.build() + 'index.html'
	};
	return gulp.src('').pipe(open(options));
});

gulp.task('zip', ['html', 'copyFiles'], () => 
	gulp.src(path.build() + '*.*')
		.pipe(zip(argv.size + '.zip'))
		.pipe(gulp.dest('build/'))
);

gulp.task('default', () => {
	console.log(path.src());
	pathExists(path.src()).then(exists => {
		console.log(exists);
		if(!exists) {
			console.err('Wrong size!!!');
			return;
		}
		rimraf(path.build())
			.then(() => {
				gulp.start('open');
				gulp.start('watch');
			});
	});
});
