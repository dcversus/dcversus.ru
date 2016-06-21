const gulp        = require('gulp');
const source      = require('vinyl-source-stream');
const browserSync = require('browser-sync');
const del         = require('del');
const glob        = require('glob');
const util        = require('gulp-util');
const plumber     = require('gulp-plumber');
const frontMatter = require('gulp-front-matter');
const through     = require('through2');
const jade        = require('gulp-jade');
const marked      = require('gulp-marked');
const rename      = require('gulp-rename');
var site = {
  posts: [],
  tags: []
};

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
gulp.task('preparehtml', ['cleanhtml'], () =>
  gulp
    .src('./src/posts/**/*.md')
    .pipe(frontMatter({
      property: 'data',
      remove: true
    }))
    .pipe(marked())
    .pipe(through.obj((file, enc, callback) => {
      var summary = file.contents.toString().split('<!--more-->')[0]
      file.data.summary = summary;

      if (file.data.tags) {
        file.data.tags.forEach(tag => {
          if (site.tags.indexOf(tag) == -1) {
            site.tags.push(tag);
          }
        });
      }

      site.posts.push(file.data);
      callback();
    }))
)

gulp.task('template', ['preparehtml'], () =>
  gulp
    .src('./src/posts/**/*.md')
    .pipe(frontMatter({
      property: 'data',
      remove: true
    }))
    .pipe(marked())
    .pipe(through.obj((file, enc, callback) => {
      let newPath = file.path.replace(/(index)?.html/g, '\\index.html');
      let newBase = file.base;

      file.data.site = site;
      file.data.content = file.contents.toString();

      gulp.src(`./src/templates/${file.data.template}.jade`)
        .pipe(jade({
          pretty: false,
          locals: file.data
        }))
        .pipe(through.obj(file => {
          file.path = newPath;
          file.base = newBase;

          callback(null, file)
        }))
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream({
      once: true
    }))
);

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