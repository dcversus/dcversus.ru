const del         = require('del');
const glob        = require('glob');
const gulp        = require('gulp');
const source      = require('vinyl-source-stream');
const browserSync = require('browser-sync');
const util        = require('gulp-util');
const plumber     = require('gulp-plumber');
const frontMatter = require('gulp-front-matter');
const through     = require('through2');
const jade        = require('gulp-jade');
const marked      = require('gulp-marked');
const ghPages     = require('gulp-gh-pages');
const postcss     = require('gulp-postcss');
var site;

function onError(err) {
  util.beep();
  util.log(util.colors.red('Compilation Error\n'), err.toString());
  this.emit('end');
}

gulp.task('movestatic', () =>
  gulp
    .src('./src/static/**')
    .pipe(plumber())
    .pipe(gulp.dest('./dist'))
);

gulp.task('cleanhtml', del.bind(null, ['./dist/**/*.html']));
gulp.task('preparehtml', ['cleanhtml'], () => {
  site = {
    posts: [],
    tags: []
  };

  return gulp
    .src('./src/posts/**/*.md')
    .on('error', onError)
    .pipe(frontMatter({
      property: 'data',
      remove: true
    }))
    .pipe(marked())
    .pipe(through.obj((file, enc, callback) => {
      let summary = file.contents.toString().split('<!--more-->')[0];
      file.data.summary = summary;

      let url = file.relative.replace(/(index)?.html/g, '\\');
      file.data.url = url

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
})

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

      gulp
        .src(`./src/templates/${file.data.template}.jade`)
        .pipe(jade({
          pretty: false,
          locals: file.data
        }))
        .on('error', onError)
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

  gulp
    .src('./src/javascripts/**/*.js')
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
  return gulp
    .src('./src/stylesheets/application.css')
    .pipe(postcss([
      require('stylelint')(),
      require('autoprefixer')('last 2 version'),
      require('postcss-import'),
      require('postcss-css-variables'),
      require('postcss-calc'),
      require('cssnano')()
    ]))
    .on('error', onError)
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream())
});

gulp.task('build', ['template', 'js', 'css', 'movestatic']);
gulp.task('watch', ['build'], () => {
  gulp.watch('src/javascripts/**/*', ['js']);
  gulp.watch('src/stylesheets/**/*', ['css']);
  gulp.watch('src/templates/**/*', ['template']);
  gulp.watch('src/posts/**/*.md', ['template']);
  gulp.watch('src/static/**/*', ['movestatic']).on('change', browserSync.reload);
});

gulp.task('serve', ['watch'], () =>
  browserSync({
    server: {
      baseDir: ['./dist']
    }
  })
);

gulp.task('deploy', ['build'], () =>
  gulp
    .src('./dist/**/*')
    .pipe(ghPages({
      branch: 'master'
    }))
);

gulp.task('default', ['serve']);