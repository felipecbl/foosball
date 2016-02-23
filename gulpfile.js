var gulp            = require('gulp');
var jade            = require('gulp-jade');
var sass            = require('gulp-ruby-sass');
var compass         = require('gulp-compass');
var livereload      = require('gulp-livereload');
var autoprefixer    = require('gulp-autoprefixer');
var minifycss       = require('gulp-minify-css');
var rename          = require('gulp-rename');
var plumber         = require('gulp-plumber');
var notify          = require('gulp-notify');
var path            = require('path');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var sourcemaps      = require('gulp-sourcemaps');



var env = process.env.NODE_ENV || 'development';
var devDir = 'builds/development';


//the title and icon that will be used for the Grunt notifications
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

//error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};

// tasks

gulp.task('jade', function(){
	return gulp.src('src/template/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest(devDir));
});

gulp.task('sass', function(){
	var config = {};

	if( env == 'development'){
		config.sourceMap = 'map';
	}

	if( env == 'production'){
		config.outputStyle = 'compressed';
	}
	return gulp.src(['src/sass/main.scss'])
		.pipe(sass(config))
		.pipe(gulp.dest(devDir + '/css'));
});



gulp.task('css', function() {

	var cssDest = devDir + '/css';

	return gulp.src(['src/sass/main.scss'])
		.pipe(plumber(plumberErrorHandler))
		.pipe(compass({
			css: 'html/css',
			sass: 'src/scss',
			image: 'html/images'
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(cssDest))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest(cssDest));
});


gulp.task('js', function() {
	// Order the files
  return gulp.src(['src/js/vendor/*.js'/*, 'src/js/*.js'*/])
    .pipe(sourcemaps.init())
    // Name the final file
    .pipe(concat('foos.js'))
    // Uglify with mangle: change variable names
	// .pipe(uglify({mangle: true}))
	// Set the destination of the sourcemap file
    .pipe(sourcemaps.write('../js', {addComment: true}))
    // Set the final file destination
    .pipe(gulp.dest(devDir + '/js'));
});
