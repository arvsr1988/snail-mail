var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');
var buildDir = 'dist';
var publicDir = buildDir + '/public';
gulp.task('sass', function(){
    gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(publicDir))
});

gulp.task('browserify', function(){
    gulp.src('js/*.js')
        .pipe(browserify({
            "transform": ["hbsfy"]
            }
        ))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(publicDir))
});

var rimraf = require('gulp-rimraf');

var appDependencies = require('./package.json').dependencies;
gulp.task('copy', function(){
   gulp.src('js/plugins/**/*.js')
       .pipe(gulp.dest(publicDir + '/plugins/'));
    gulp.src('js/**/*.js')
        .pipe(gulp.dest(buildDir + '/js/'));
    gulp.src(['app/**/*','images/**/*','app.js','views/**/*', 'routes/**/*'], {base : '.'})
        .pipe(gulp.dest(buildDir));
    for(var dependency in appDependencies){
        gulp.src('node_modules/'+dependency + '/**/*')
            .pipe(gulp.dest(buildDir+'/node_modules/' + dependency));
    }
});

gulp.task('clean', function() {
    return gulp.src('./' + buildDir, { read: false })
        .pipe(rimraf());
});

//Convenience task for running a one-off build
gulp.task('build', ['clean'],  function() {
    gulp.run('copy', 'browserify', 'sass');
});

gulp.task('watch', function() {
    gulp.watch('sass/*.scss', function() {
        gulp.run('sass');
    });

    gulp.watch('js/**/*.js', function() {
        gulp.run('browserify');
    });

    gulp.watch('views/**/*.hbs', function(){
       //this should run the browserify
    });
});

gulp.task('default', function () {
    gulp.run('build', 'watch');
});