import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';

function compile(watch) {
  var bundler = watchify(
    browserify('./js/index.js', { debug: true }).transform(babel)
  );

  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));

  function rebundle() {
    bundler.bundle()
      .on('error', err => { 
        console.error(err); this.emit('end'); 
      })
      .pipe(source('./js/index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build'));

    console.log('-> bundling completed');
    console.log('-> watching');
  }

  if (watch) {
    bundler.on('update', ()=> {
      console.log('-> rebundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
}

gulp.task('build', ()=> { return compile(); });
gulp.task('watch', ()=> { return watch(); });

gulp.task('default', ['watch']);
