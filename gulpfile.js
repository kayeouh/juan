/* Require Plugins */
var gulp = require('gulp'),
    svgSprite = require('gulp-svg-sprite'),
    svg2png = require('gulp-svg2png'),
    compass = require('gulp-compass'),
    prefix = require('gulp-autoprefixer'),
    lr = require('tiny-lr')(),
    express = require('express'),
    app = express();
 
 
/* Setup Configs */
var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;
var watching = false;

var compassConfig = {
    config_file: 'config.rb',
    css: 'css',
    sass: 'sass'
}

var spriteConfig = {
 mode: {
   css: {        
     sprite: "images/sprites/sprite.svg",
     dest: "",
     bust: false,
     render: {
       scss: true,
       scss: {
         dest: "sass/base/_sprites.scss",
         template: "images-source/sprites/sprite.scss"
       }
     }
   }
 }
}

 
function notifyLivereload(event) {
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);
 
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}
 
/* Handle Compass Errors breaking the watch task */ 
function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}
 
gulp.task('startExpress', function () {
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
});
 
gulp.task('startLivereload', function() {
  lr.listen(LIVERELOAD_PORT);
});
 
gulp.task('compass', function() {
    gulp.src('sass/**/*.scss')
      .pipe(compass(compassConfig).on("error", onError))
      .pipe(prefix(["last 2 versions", "ie 8"], {cascade: true}))
      .pipe(gulp.dest('./css/'));
});
 
gulp.task('sprites', function() {
 gulp.src('images-source/sprites/*.svg')
   .pipe(svgSprite(spriteConfig))
   .pipe(gulp.dest(''));
});

gulp.task('svg2png', function() {
  gulp.src('images/sprites/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('images/sprites'));
});

 
// Watch Files For Changes
gulp.task('watch', function() {
    watching = true;
    // Uncomment these lines if you want to use the Express Server + livereload
    gulp.watch('*.html', notifyLivereload);
    gulp.watch('css/*.css', notifyLivereload);
    gulp.watch('js/*.js', notifyLivereload);
    gulp.watch('images-source/sprites/*.svg', ['sprites', 'svg2png']);
    gulp.watch('sass/**/*.scss', ['compass']);
});
 

// Default Task with Server
gulp.task('default', ['startExpress','startLivereload','watch']);
