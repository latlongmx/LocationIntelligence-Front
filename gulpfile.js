var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var args = require('yargs').argv;
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');

/*** To Dev ***/

gulp.task('inject', function(){
	return gulp.src('./client/index.html')
		.pipe(wiredep({
			bowerJson: require('./bower.json'),
			directory: 'bower_components',
			ignorePath: '../../'
		}))
		.pipe($.inject(gulp.src([
			'bower_components/angular-ui-bootstrap/*.js',
			'bower_components/md5/md5.js'
			], {read: false}),{ignorePath: '../../', relative: true, starttag: '<!-- inject:own:js -->'}))
		.pipe($.inject(gulp.src([
			'./client/styles/styles.css'
		]), {ignorePath: '../../', relative: true}))
		.pipe($.inject(gulp.src([
			'./client/components/**/*.module.js',
			'./client/components/**/*.js'
		]), {ignorePath: '../../', relative: true}))
		.pipe(gulp.dest('./client/'));
});


gulp.task('js', function(){
	log('Analizyng components...');
	gulp.src(['./client/components/**/*.js'])
	.pipe($.jshint())
	.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
});

gulp.task('sass', ['cleaning-styles'], function () {
	log('Compiling sass to css');
	return gulp.src('./client/sass/config.scss')
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.concat('styles.css'))
		.pipe(gulp.dest('./client/css/'));
});


gulp.task('template', ['clean-templatecache'], function(){
	log('Angularjs template files!');
	var options = {
		module: 'walmex',
		root: './components/'
	}
	return gulp.src('./client/components/**/*.html')
		.pipe($.minifyHtml({empty: true}))
		.pipe($.angularTemplatecache(
			'templates.js',
			options
		))
		.pipe(gulp.dest('./tmp'));
});

gulp.task('html', ['cleaning-components'], function() {
	log('Copying html files');
	return gulp.src('./client/components/**/*.html')
		.pipe(gulp.dest('public/components/'));
});

gulp.task('images', ['cleaning-images'], function() {
	log('Copying images');
	return gulp.src('./client/images/**/*.{jpg,png}')
		.pipe($.imagemin({optimizationLevel: 4}))
		.pipe(gulp.dest('public/images/'));
});

gulp.task('fonts', function() {
	log('Copying iconfonts');
	return gulp.src('./client/fonts/*.*')
		.pipe(gulp.dest('public/fonts/'));
});

/* Cleaners */
gulp.task('cleaning-components', function(){
	clean('public/components/**/**/*.html');
});
gulp.task('clean-templatecache', function(){
	clean('./tmp');
});
gulp.task('cleaning-styles', function(){
	var files = './client/css/*.css';
	clean(files);
});

gulp.task('cleaning-images', function(){
	clean('public/images/**/*.*');
});

/* To Production */

gulp.task('join', ['template', 'html', 'images', 'fonts'], function(){
	log('Joining all js/css files');
	var cssFilter = $.filter('**/*.css', {restore: true});
	var jsLibFilter = $.filter('**/lib.js', {restore: true});
	var jsAppFilter = $.filter('**/app.js', {restore: true});

	return gulp.src('./client/index.html')
		.pipe($.inject(gulp.src(
			'../tmp/templates.js',{read: false}
		),{starttag: '<!-- inject:templates:js -->'}))
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore)
		.pipe(jsLibFilter)
		.pipe(jsLibFilter.restore)
		.pipe(jsAppFilter)
		.pipe(jsAppFilter.restore)
		.pipe($.useref())
		.pipe(gulp.dest('public'));
});

gulp.task('con', ['app', 'lib', 'css']);

gulp.task('app', function () {
  return gulp.src('public/js/app.js')
    .pipe(ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('lib', function () {
  return gulp.src('public/js/lib.js')
    .pipe($.uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('css', function () {
	log('Compiling css to public');
	return gulp.src('./client/css/*.css')
		.pipe(gulp.dest('./public/css/'));
});

/* Dev Server */
gulp.task('dev-server', function(){
	log('Developer server running...');

	browserSync.init({
		files: [
			"./client/index.html",
			"./client/components/**/*.*",
			"./client/components/**/**/*.scss",
			"./client/sass/**/*.scss",
			"./client/sass/config.scss"
		],
		ghostMode: {
			clicks: false,
			forms: true,
			scroll: false
		},
		logFileChanges: true,
		logPrefix: "Walmex Project",
		notify: true,
		port: 2016,
		reloadDelay: 1500,
		server: {
			baseDir: './client',
			routes: {
				"/bower_components": "bower_components",
				"./client": "client"
			}
		}
	});
});

/* Dev Server */
gulp.task('prod', function(){
	log('Production server running...');

	browserSync.init({
		ghostMode: {
			clicks: false,
			forms: true,
			scroll: false
		},
		logFileChanges: true,
		logPrefix: "Walmex Project",
		notify: true,
		port: 2016,
		reloadDelay: 1500,
		server: {
			baseDir: './public',
			routes: {
				"./public": "public"
			}
		}
	});
});

/* Watch files */
gulp.task('watch', ['sass'], function(){
	log('Watching files!');
	gulp.watch('client/components/**/*.js', ['js']);
	gulp.watch('client/components/**/**/*.scss', ['sass']);
	gulp.watch('client/sass/**/*.scss', ['sass']);
	gulp.watch('client/sass/config.scss', ['sass']);
});


gulp.task('dev',['dev-server', 'watch']);
gulp.task('prod', ['prod-server']);


function clean(path){
	log('Cleaning: '+ $.util.colors.blue(path));
	del(path)
}

function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.green(msg[item]));
			}
		}
	}
	else {
		$.util.log($.util.colors.green(msg));
	}
}
