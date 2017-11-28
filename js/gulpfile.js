var gulp=require('gulp')
var inline=require('gulp-inline')

gulp.task('inline', function(){
	return gulp.src('../index.html')
	  .pipe(inline({
	    base: '../',
	  }))
	  .pipe(gulp.dest('dist/'));
})
gulp.task('default',['inline'])