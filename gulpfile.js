var gulp = require('gulp')
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
 
gulp.task('scripts', function() {
    var tsResult = gulp.src('lib/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
        .pipe(ts({
            noImplicitAny: true
        }));
 
    return tsResult.js
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest(''));
});

gulp.task('default', function () {
	gulp.watch('./**/*.ts', ['scripts']);
});