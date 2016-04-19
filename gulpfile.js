var gulp = require('gulp');
var runSequence = require('run-sequence');
var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");

var appDependencies = require('./package.json').dependencies;
var buildDir = 'dist';
var publicDir = buildDir + '/public';
global._publicDir = publicDir;

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
