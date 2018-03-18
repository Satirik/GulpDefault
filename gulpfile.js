var gulp = require('gulp'),
	sass = require('gulp-sass'),
	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync'),
	gulpif = require('gulp-if'),
	cleancss = require('gulp-clean-css'),
  uncss = require('gulp-uncss'),
  nano = require('gulp-cssnano'),
  concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	del = require('del'),
	runSequence = require('run-sequence');




 







// SCSS to CSS
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

//BrowserSync
gulp.task('browserSync', function() {
  browserSync({ server: { baseDir: 'app' },  })
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// соединяем и минимизируем CSS и JS
gulp.task('useref', function(){

  return gulp.src('app/*.html')
  		.pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleancss()))
        .pipe(gulp.dest('dist'));
});

//Минимизируем изображение
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // кэширование изображений, прошедших через imagemin
  .pipe(cache(imagemin({
 interlaced: true
 })))
  .pipe(gulp.dest('dist/img'))
});

//Копируем шрифты
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

//Clean
gulp.task('clean:dist', function(callback){
 return del(['dist/**/*', '!dist/img', '!dist/img/**/*'], callback)
});

gulp.task('clean', function(callback) {
  return del('dist');
  return cache.clearAll(callback);
});

//Команды
gulp.task('build', function (callback) {
  runSequence(	'clean:dist', 'sass',
 				['useref', 'images', 'fonts'],
 callback )
});

gulp.task('default', function (callback) {
  runSequence(
  	['sass','browserSync'],
  	'watch',
 callback )
});



gulp.task('default2', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(nano())
        .pipe(gulp.dest('dist/css2'));
});
