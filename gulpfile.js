import gulp from 'gulp';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import pug from 'gulp-pug';
import del from 'del';
import autoprefixer  from 'gulp-autoprefixer';

const sass = gulpSass(dartSass) ,
      srcSass = ['src/**/*.sass', 'src/**/*.scss'],
      srcImages = ['src/**/*.svg', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.png'],
      srcJs = 'src/**/*.js',
      srcPug = 'src/**/*.pug',
      srcLib = [
        'node_modules/magnific-popup/libs/jquery/jquery.js',
        'node_modules/slick-carousel/slick/slick.js', 
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js'],
      outputDir = 'dist/',
      baseDir = 'app/';

// Static server
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: baseDir
    }
  });
  gulp.watch(baseDir.concat('*.html')).on('change', browserSync.reload);
});

gulp.task('css', () => gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/magnific-popup/dist/magnific-popup.css',
    'node_modules/slick-carousel/slick/slick.css',
  ])
  .pipe(concat('_libs.scss'))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.stream()));

gulp.task('images', () => gulp.src(srcImages)
  .pipe(imagemin())
  .pipe(gulp.dest(baseDir))
  .pipe(browserSync.stream()));
  
gulp.task('sass', () => gulp.src(srcSass)
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 6 version']
  }))
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
  .pipe(pug({
    doctype: 'html',
    pretty: true
  }))
  .pipe(gulp.dest(baseDir))
  .pipe(browserSync.stream()));

gulp.task('watch', () => {
  gulp.watch(srcSass, gulp.parallel('sass'));
  gulp.watch(srcJs, gulp.parallel(['lib', 'js']));
  gulp.watch(srcPug, gulp.parallel('pug'));
  gulp.watch(srcImages, gulp.parallel('images'));
});

gulp.task('export', async () => {
  gulp.src(baseDir.concat('*.html')).pipe(gulp.dest(outputDir));
  gulp.src(baseDir.concat('css/**/*.css')).pipe(gulp.dest(outputDir.concat('css')));
  gulp.src(baseDir.concat('js/**/*.js')).pipe(gulp.dest(outputDir.concat('js')));
  gulp.src(baseDir.concat('img/**/*.*')).pipe(gulp.dest(outputDir.concat('img')));
  gulp.src(baseDir.concat('fonts/**/*.*')).pipe(gulp.dest(outputDir.concat('fonts')));
});

gulp.task('clean', async () => await del('dist/**'));
gulp.task('build', gulp.series('clean', 'export'));
gulp.task('default', gulp.parallel('watch', gulp.series('css', 'sass', 'lib', 'js', 'pug', 'images', 'browser-sync')));
