'use strict';

var gulp = require('gulp');

var sass = require('gulp-sass');
var rigger = require('gulp-rigger');
var rename = require("gulp-rename");
var argv = require('yargs').argv;
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var watch= require('gulp-watch');
var open = require('gulp-open');
var zip = require('gulp-zip');

gulp.task('css', () => 
		gulp.src('src/' + argv.size + '/variables.scss')
		.pipe(addsrc('src/main.scss'))
		.pipe(concat('temp.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(rename('_temp/temp.html'))
		.pipe(gulp.dest('src'))
);


gulp.task('image', () => 
	gulp.src('src/' + argv.size + '/*.png')
		.pipe(addsrc('src/' + argv.size + '/*.gif'))
		.pipe(addsrc('src/' + argv.size + '/' + argv.type + '/*.png'))
		.pipe(addsrc('src/nanoScroller.js'))
		.pipe(gulp.dest(dest(argv)))
);

gulp.task('html', ['css', 'image'], () => 
	gulp.src('src/index.html')
		.pipe(rigger())
		.pipe(gulp.dest(dest(argv)))
);

gulp.task('watch', () => 
	watch(['src/' + argv.size + '/**/*.*', 'src/*.*'],(event, cb) => 
		gulp.start('zip'))
);

gulp.task('open', () => {
	var options = {
		app: 'chrome',
		uri: dest(argv) + 'index.html'
	};
	return gulp.src('').pipe(open(options));
});

gulp.task('zip', ['html', 'image'], () => 
	gulp.src(dest(argv) + '*.*')
		.pipe(zip(argv.type + '_' + argv.size + '.zip'))
		.pipe(gulp.dest('build/'))
);

/*gulp.task('default', ['zip', 'watch', 'open'], () => {
	gulp.start('zip');
});*/

gulp.task('default', () => {
	console.log(argv);
});

function dest(argv){
	return 'build/' + argv.type + '_' + argv.size + '/';
}