var gulp = require('gulp');
var connect = require('gulp-connect');
var PATHS = {
  src: 'src/**/*.ts',
  html: 'src/**/*.html',
  css: 'src/**/*.css'
};

gulp.task('clean', function(done) {
  var del = require('del');
  del(['dist'], done);
});

gulp.task('ts2js', function() {
  var typescript = require('gulp-typescript');
  var sourcemaps = require('gulp-sourcemaps');

  var tsResult = gulp.src(PATHS.src) // look at PATHS.src
    .pipe(sourcemaps.init()) // use sourcemaps
    .pipe(typescript({ // transpile ts to js
      noImplicitAny: true,
      module: 'system', // the target module definition format. this new module format designed to support the exact semantics of ES2015 modules within ES5.
      target: 'ES5',
      moduleResolution: 'node',
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    }));

  return tsResult.js // look for js transpiled
    .pipe(sourcemaps.write()) // write sourcemaps
    .pipe(gulp.dest('dist')) // copy js to dist folder
    .pipe(connect.reload()); // reload server
});

gulp.task('play', ['ts2js'], function() {
  var http = require('http');
  var open = require('open');
  var watch = require('gulp-watch');



  var port = 9000,
    app;

  connect.server({
    root: __dirname,
    port: port,
    livereload: true,
    fallback: 'index.html' // implies requests to any non-existent URLs load 'index.html'
  });
  open('http://localhost:' + port + '/index.html');

  gulp.watch(PATHS.src, ['ts2js']); // whatch for changes in src folder and do ts2js task
  watch(PATHS.html).pipe(connect.reload());
  watch(PATHS.css).pipe(connect.reload());
});
