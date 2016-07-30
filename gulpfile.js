var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep').stream;
var del = require('del');
var $ = require('gulp-load-plugins')({lazy: true});
var args = require('yargs').argv;
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');

/*** To Dev ***/

gulp.task('lib1', function() {
	log('Copying external resources');
	return gulp.src('./angular-ui-bootstrap/*.js')
		.pipe(gulp.dest('./bower_components/angular-ui-bootstrap/'));
});
gulp.task('lib2', function() {
	log('Copying external resources');
	return gulp.src('./md5/*.js')
		.pipe(gulp.dest('./bower_components/md5/'));
});
gulp.task('lib3', function() {
	log('Copying external resources');
	return gulp.src('./jslibs/**/*.js')
		.pipe(gulp.dest('./bower_components/jslibs/'));
});

gulp.task('inject', ['lib1', 'lib2', 'lib3'], function(){
	return gulp.src('./client/index.html')
		.pipe(wiredep({
			bowerJson: require('./bower.json'),
			directory: 'bower_components',
			ignorePath: '../../',
			exclude: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/jslibs/leaflet/leaflet.js',
			'bower_components/jslibs/leaflet-draw/leaflet.draw.js'
			]
		}))
		.pipe($.inject(gulp.src([
			'bower_components/jquery/dist/jquery.js',
			], {read: false}),{ignorePath: '../../', relative: true, starttag: '<!-- inject:own:jq -->'}))
		.pipe($.inject(gulp.src([
			'bower_components/angular-ui-bootstrap/ui-bootstrap-custom-1.3.2.js',
			'bower_components/angular-ui-bootstrap/ui-bootstrap-custom-tpls-1.3.2.js',
			'bower_components/md5/md5.js',
			'bower_components/jslibs/leaflet-heat/Leaflet.heat.js',
			'bower_components/jslibs/NonTiledLayer.js',
			'bower_components/jslibs/NonTiledLayer.WMS.js',
			'bower_components/jslibs/leaflet.singletilewmslayer.js',
			'bower_components/jslibs/leaflet.dynamicWMS.js',
			'bower_components/jslibs/geostats.js'
			], {read: false}),{ignorePath: '../../', relative: true, starttag: '<!-- inject:own:js -->'}))
		.pipe($.inject(gulp.src([
			'bower_components/jslibs/leaflet/leaflet.js',
			'bower_components/jslibs/leaflet-draw/leaflet.draw.js',
			], {read: false}),{ignorePath: '../../', relative: true, starttag: '<!-- inject:own:leaflet -->'}))
		.pipe($.inject(gulp.src([
			'bower_components/jslibs/leaflet/leaflet.css',
			'bower_components/jslibs/leaflet-draw/leaflet.draw.css',
			], {read: false}),{ignorePath: '../../', relative: true, starttag: '<!-- inject:own:css -->'}))
		.pipe($.inject(gulp.src([
			'client/catalogs/df.geojson.js',
			], {read: false}),{ignorePath: '../../', relative: true, starttag: '<!-- inject:own:geojson -->'}))
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
	.pipe($.jshint.reporter('jshint-stylish', {verbose: true}));
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
	};
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

/* Watch files */
gulp.task('watch', ['sass'], function(){
	log('Watching files!');
	gulp.watch('client/components/**/*.js', ['js']);
	gulp.watch('jslibs/**/*.js', ['js']);
	gulp.watch('client/components/**/**/*.scss', ['sass']);
	gulp.watch('client/sass/**/*.scss', ['sass']);
	gulp.watch('client/sass/config.scss', ['sass']);
});


gulp.task('dev',['dev-server', 'watch']);
gulp.task('prod', ['prod-server']);

/* To Production */

/* Prod Server */
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
