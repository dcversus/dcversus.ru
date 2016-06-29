const del         = require('del');
const glob        = require('glob');
const gulp        = require('gulp');
const source      = require('vinyl-source-stream');
const webserver   = require('gulp-webserver');
const util        = require('gulp-util');
const plumber     = require('gulp-plumber');
const frontMatter = require('gulp-front-matter');
const through     = require('through2');
const jade        = require('gulp-jade');
const marked      = require('gulp-marked');
const ghPages     = require('gulp-gh-pages');
const postcss     = require('gulp-postcss');
const eslint      = require('gulp-eslint');
const babelify    = require('babelify');
const browserify  = require('browserify');

function onError(err) {
  util.beep();
  util.log(util.colors.red('Compilation Error\n'), err.toString());
  this.emit('end');
}


gulp.task('default', ['serve']);

gulp.task('serve', ['watch'], () =>
  gulp
    .src('dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }))
);

gulp.task('deploy', ['build'], () =>
  gulp
    .src('dist/**/*')
    .pipe(ghPages({
      branch: 'master'
    }))
);

gulp.task('build', ['template', 'js', 'css', 'movestatic']);

gulp.task('watch', ['build'], () => {
  gulp.watch('src/javascripts/**/*', ['js']);
  gulp.watch('src/stylesheets/**/*', ['css']);
  gulp.watch('src/templates/**/*', ['template']);
  gulp.watch('src/posts/**/*.md', ['template']);

  gulp.watch('src/static/**/*', ['movestatic', 'template'])
      .on('error', onError);
});

gulp.task('movestatic', () =>
  gulp
    .src('src/static/**')
    .pipe(plumber())
    .pipe(gulp.dest('dist'))
);


gulp.task('cleanjs', del.bind(null, ['dist/**/*.js']));
gulp.task('js', ['cleanjs'], () => {
  gulp
    .src('src/javascripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())

  browserify('src/javascripts/application.js', {
    debug: false
  })
    .transform(babelify)
    .bundle()
    .on('error', onError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('cleancss', del.bind(null, ['dist/**/*.css']));
gulp.task('css', ['cleancss'], () =>
  gulp
    .src('src/stylesheets/application.css')
    .pipe(postcss([
      require('stylelint')(),
      require('autoprefixer')('last 2 version'),
      require('postcss-import'),
      require('postcss-css-variables'),
      require('postcss-calc'),
      require('cssnano')()
    ]))
    .on('error', onError)
    .pipe(gulp.dest('dist'))
);


gulp.task('cleanhtml', del.bind(null, ['dist/**/*.html']));
gulp.task('template', ['cleanhtml'], () => {
  var site = {
    posts: [],
    tags: []
  };

  return gulp
    .src('src/posts/**/*.md')
    .pipe(frontMatter({
      property: 'data',
      remove: true
    }))
    .pipe(marked({
      highlight: code => require('highlight.js').highlightAuto(code).value
    }))
    .pipe(through.obj((post, enc, callback) => {
      let summary = post.contents.toString().split('<!--more-->')[0];
      post.data.summary = summary;

      post.data.path = post.path.replace(/(index)?.html/g, '\\index.html');
      post.data.base = post.base;

      post.data.site = site;
      post.data.content = post.contents.toString();

      let url = post.relative.replace(/(index)?.html/g, '\\');
      post.data.url = url;

      post.data.files = [];
      let codeName = url.split('\\').reverse()[1];
      glob.sync(`src/static/files/${codeName}/*`).forEach(file =>  {
        post.data.files.push(file.replace('src/static', ''));
      });

      if (post.data.tags) {
        post.data.tags.forEach(tag => {
          if (site.tags.indexOf(tag) == -1) {
            site.tags.push(tag);
          }
        });
      }

      site.posts.push(post.data);
      callback();
    }))
    .on('end', () => {
      site.posts.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );

      site.posts.forEach(post => {
        gulp
          .src(`src/templates/${post.template}.jade`)
          .pipe(jade({
            pretty: false,
            locals: post
          }))
          .on('error', onError)
          .pipe(through.obj((file, enc, callback) => {
            file.path = post.path;
            file.base = post.base;

            callback(null, file)
          }))
          .pipe(gulp.dest('dist'))
      });
    })
});