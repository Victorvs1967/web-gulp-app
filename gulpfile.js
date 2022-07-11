import gulp from 'gulp';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import pug from 'gulp-pug';

const sass = gulpSass(dartSass) ,
      srcSass = ['src/**/*.sass', 'src/**/*.scss'],
      srcImages = ['src/**/*.svg', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.png'],
      srcJs = 'src/**/*.js',
      srcPug = 'src/**/*.pug',
      srcLib = [
        'node_modules/magnific-popup/libs/jquery/jquery.js',
        'node_modules/slick-carousel/slick/slick.js', 
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js'],
      srcDir = 'app/src/',
      outputDir = 'app/dist';
      baseDir = 'app';

// Static server
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: baseDir.concat('/')
    }
  });
});

gulp.task('images', () => gulp.src(srcImages)
  .pipe(imagemin())
  .pipe(gulp.dest(baseDir))
  .pipe(browserSync.stream()));

gulp.task('css', () => gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/magnific-popup/dist/magnific-popup.css',
    'node_modules/slick-carousel/slick/slick.css',
  ])
  .pipe(concat('_libs.scss'))
  .pipe(gulp.dest(srcDir.concat('css')))
  .pipe(browserSync.stream()));

gulp.task('sass', () => gulp.src(srcSass)
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(baseDir))
  .pipe(browserSync.stream()));

gulp.task('lib', () => gulp.src(srcLib)
  .pipe(concat('lib.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(baseDir.concat('/js')))
  .pipe(browserSync.stream()));

gulp.task('js', () => gulp.src(srcJs)
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(baseDir))
  .pipe(browserSync.stream()));

gulp.task('pug', () => gulp.src(srcPug)
  .pipe(pug())
  .pipe(gulp.dest(baseDir))
  .pipe(browserSync.stream()));

gulp.task('watch', () => {
  gulp.watch(srcSass, gulp.parallel('sass'));
  gulp.watch(srcJs, gulp.parallel(['lib', 'js']));
  gulp.watch(srcPug, gulp.parallel('pug'));
  gulp.watch(srcImages, gulp.parallel('images'));
  gulp.watch(baseDir.concat('/*.html')).on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch', gulp.series('css', 'sass', 'lib', 'js', 'pug', 'images', 'browser-sync')));
