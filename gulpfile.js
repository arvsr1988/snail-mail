var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var rimraf = require('gulp-rimraf');
var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");

var appDependencies = require('./package.json').dependencies;
var buildDir = 'dist';
var publicDir = buildDir + '/public';

gulp.task('sass', function(){
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(publicDir))
});

gulp.task('browserify', function(){
     return gulp.src('js/*.js')
        .pipe(browserify({
            "transform": ["hbsfy"]
            }
        ))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(publicDir))
});

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

gulp.task("revision", function(){
    return gulp.src([publicDir + "/**/*.css", publicDir +  "/**/*.js"])
        .pipe(rev())
        .pipe(gulp.dest(publicDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(publicDir))
});

gulp.task("revreplace", ['revision'], function(){
    var manifest = gulp.src(publicDir + "/rev-manifest.json");
    return gulp.src(buildDir + "/views/**/*")
        .pipe(revReplace({ manifest : manifest}))
        .pipe(gulp.dest(buildDir + "/views/"));
});

gulp.task('build',  function(callback) {
    runSequence('clean', ['copy', 'browserify', 'sass'], 'revreplace', callback);
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