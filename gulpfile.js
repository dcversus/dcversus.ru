const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync');
const del = require('del');
const glob = require('glob');
const util = require('gulp-util');
const plumber = require('gulp-plumber');


function onError(err) {
  util.beep();
  util.log(util.colors.red('Compilation Error\n'), err.toString());
  this.emit('end');
}

gulp.task('movestatic', () =>
  gulp
    .src(['./src/static/**'])
    .pipe(plumber())
    .pipe(gulp.dest('./dist'))
);

gulp.task('cleanhtml', del.bind(null, ['./dist/**/*.html']));
gulp.task('template', ['cleanhtml'],() => {
  const jade = require('gulp-jade');
  var posts = [];

  glob.sync('./src/posts/**/*.md').forEach(post =>  {
    posts.push(post);
  })

  gulp.src('./src/templates/index.jade')
    .pipe(jade({
      pretty: false,
      locals: {
        posts: posts
      }
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream({ once: true }))

    console.log(posts);

  // gulp
  //   .src('./src/templates/**/*.html')
  //   .pipe(gulp.dest('./dist'))
  //   .pipe(browserSync.stream({ once: true }))
});

gulp.task('cleanjs', del.bind(null, ['./dist/**/*.js']));
gulp.task('js', () => {
  const jshint     = require('gulp-jshint');
  const babelify   = require('babelify');
  const browserify = require('browserify');

  gulp.src('./src/javascripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))

  browserify({
    entries: ['./src/javascripts/application.js'],
    extensions: ['.js'],
    debug: true
  })
    .transform(babelify)
    .bundle()
    .on('error', onError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
});

gulp.task('cleancss', del.bind(null, ['./dist/**/*.css']));
gulp.task('css', ['cleancss'], () => {
  const postcss      = require('gulp-postcss');
  const pVars        = require('postcss-css-variables');
  const pImport      = require("postcss-import");
  const pCalc        = require("postcss-calc");
  const autoprefixer = require('autoprefixer');

  return gulp.src('./src/stylesheets/application.css')
    .pipe(postcss([ autoprefixer('last 2 version'), pImport, pVars, pCalc ]))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
});

gulp.task('build', ['template', 'js', 'css', 'movestatic']);
gulp.task('watch', ['build'], () => {
  gulp.watch('src/javascripts/**/*', ['js']);
  gulp.watch('src/stylesheets/**/*', ['css']);
  gulp.watch('src/templates/**/*', ['template']);
  gulp.watch('src/static/**/*').on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], () =>
  browserSync({
    server: {
      baseDir: ['./dist']
    }
  })
);

gulp.task('default', ['serve']);