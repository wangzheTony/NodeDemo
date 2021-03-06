var gulp = require('gulp');
var stylus = require('gulp-stylus');
var connect = require('gulp-connect');

gulp.task('connectDev', function(){
	connect.server({
		root: ['app', 'tmp'],
		port: 8000,
		livereload: true
	});
});
gulp.task('connectDist', function(){
	connect.server({
		root: 'dist',
		port: 8001,
		livereload: true
	});
});

gulp.task('html', function(){
	gulp.src('app/*.html')
	.pipe(connect.reload());
});


gulp.task('stylus', function () {
  gulp.src('app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(connect.reload());
});

gulp.task('watch', function(){
	// app/**/*.*的意思是app文件夹下的任何文件夹的任何文件
	gulp.watch(['app/*.html'], ['html']);
	// gulp.watch(['app/stylus/*.styl'], ['stylus']);
});


gulp.task('default', ['connectDist', 'connectDev', 'watch']);