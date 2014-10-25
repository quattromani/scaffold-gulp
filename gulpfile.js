// Gulp tasks for Scaffold

// Load plugins
var gulp = require('gulp'),
gutil = require('gulp-util'),
watch = require('gulp-watch'),
prefix = require('gulp-autoprefixer'),
size = require('gulp-size'),
rename = require('gulp-rename'),
imagemin = require('gulp-imagemin'),
minifyCSS = require('gulp-minify-css'),
sass = require('gulp-ruby-sass'),
concat = require('gulp-concat'),
jsmin = require('gulp-jsmin'),
csslint = require('gulp-csslint'),
browserSync = require('browser-sync'),
browserReload = browserSync.reload,
cp = require('child_process');

// Minify all css
gulp.task('minify-css', function(){
  gulp.src('./css/main.css')
  .pipe(minifyCSS())
  .pipe(rename('main.min.css'))
  .pipe(size({gzip:true, showFiles: true}))
  .pipe(gulp.dest('./css/'));
});

// Minify all images
gulp.task('minify-img', function(){
  gulp.src('./media/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
  }))
  .pipe(gulp.dest('./media/images/'));
});

// Lint CSS
gulp.task('csslint', function(){
  gulp.src('./css/main.css')
  .pipe(csslint({
    'compatible-vendor-prefixes': false,
    'box-sizing': false,
    'important': false,
    'known-properties': false
  }))
  .pipe(csslint.reporter());
});

// Sass to CSS
gulp.task('pre-process', function(){
  gulp.src('./scss/main.scss')
  .pipe(watch(function(files) {
    return files.pipe(sass())
    .pipe(prefix())
    .pipe(size({gzip: false, showFiles: true}))
    .pipe(size({gzip: true, showFiles: true}))
    .pipe(gulp.dest('css'))
    .pipe(minifyCSS())
    .pipe(rename('main.min.css'))
    .pipe(size({gzip: false, showFiles: true}))
    .pipe(size({gzip: true, showFiles: true}))
    .pipe(gulp.dest('./css/'))
    .pipe(browserSync.reload({stream:true}));
  }));
});

// Concat all the component js
gulp.task('scripts', function() {
  gulp.src('./js/*.js')
  .pipe(concat('production.js'))
  .pipe(gulp.dest('./js/build/'))
});

// Minify the output js
gulp.task('js-min', function () {
  gulp.src('./js/build/production.js')
  .pipe(jsmin())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./js/build/'));
});

// Build Jekyll
gulp.task('jekyll-build', function (done) {
  browserSync.notify('Building Jekyll');
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

// Rebuild Jekyll & dreload the page
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Build Jekyll then launch server
gulp.task('browser-sync', ['jekyll-build'], function() {
  browserSync.init(null, {
    server: {
      baseDir: '_site'
    },
    host: "localhost",
    port: 4000
  });
});

// Reload browser
gulp.task('bs-reload', ['jekyll-build'], function () {
  browserSync.reload();
});

// Default Task
gulp.task('default', ['pre-process', 'bs-reload', 'browser-sync'], function(){
  gulp.start('pre-process', 'csslint', 'scripts', 'js-min', 'minify-img');
  gulp.watch('scss/partials/*.scss', ['pre-process']);
  gulp.watch('css/main.css', ['minify-css']);
  gulp.watch('css/main.min.css', ['bs-reload']);
  gulp.watch('js/*.js', ['scripts']);
  gulp.watch('js/build/production.js', ['js-min']);
  gulp.watch('js/build/production.min.js', ['bs-reload']);
  gulp.watch('*.html', ['bs-reload']);
  gulp.watch(['index.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});
