var gulp = require('gulp');
var sass = require('gulp-sass');
//var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var svgo = require('gulp-svgo');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in src/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('src/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})
gulp.task('less', function () {
  return gulp.src('src/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('src/css'));
});

gulp.task('templates', function buildHTML() {
  return gulp.src('src/pages/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('dist'))
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass', 'optimize-css']);
  //gulp.watch('src/less/**/*.less', ['less', 'optimize-css']);
  gulp.watch('src/pages/**/*.pug', ['templates']);
  gulp.watch('src/js/**/*.js', ['copy-js']);
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/js/**/*.js', browserSync.reload);
})

// Optimization Tasks
// ------------------


// Optimizing CSS and JavaScript
gulp.task('optimize-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(cssnano())
    .pipe(rename({
            suffix: '.min'
        }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('optimize-js', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

/*gulp.task('useref', function() {

  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});*/

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/css/fonts'))
})

// Copying js
gulp.task('copy-js', function() {
  return gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'))
})

//copy and min svg
gulp.task('svg', () => {
     return gulp.src('src/svg/*')
         .pipe(svgo())
         .pipe(gulp.dest('dist/images'));
 });

// Cleaning
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  //runSequence(['sass', 'optimize-css', 'svg', 'templates', 'browserSync'], 'watch',
  runSequence(['sass', 'optimize-css', 'templates', 'copy-js','images'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    //'svg',
    'templates',
    ['optimize-css', 'copy-js', 'images', 'fonts'],
    callback
  )
})
