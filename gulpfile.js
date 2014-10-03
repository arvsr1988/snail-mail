var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;
var handlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var server = express();
var expressHbs = require('express-handlebars');
server.use(favicon());
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());

server.engine('hbs', expressHbs({extname:'hbs', defaultLayout : 'main.hbs'}));
server.set('view engine', 'hbs');

//Add livereload middleware before static-middleware
server.use(livereload({
    port: livereloadport
}));
server.use(express.static('./build'));

//routes
var writeEmail = require('./routes/write.email.js');
var sendEmail =  require('./routes/send.email.js');
//TODO : move this to a new file
server.get("/", function(req, res){
    var data = {name : "arvind", layout : false};
    res.render('home', data);
});

server.get('/write-email', writeEmail.show);
server.post('/send-email', sendEmail.send);

gulp.task('templates', function(){
    gulp.src(['templates/*.hbs'])
        .pipe(handlebars({handlebars: require('handlebars')}))
        .pipe(defineModule('node'))
        .pipe(gulp.dest('build/templates/'));
});

gulp.task('sass', function(){
    gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build'))
        .pipe(refresh(lrserver));
});

gulp.task('browserify', function(){
    gulp.src('js/*.js')
        .pipe(browserify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('build'))
        .pipe(refresh(lrserver));
});

var rimraf = require('gulp-rimraf');


gulp.task('copy', function(){
   gulp.src('js/plugins/**/*.js')
       .pipe(gulp.dest('build/plugins/'));
});

gulp.task('clean', function() {
    return gulp.src('./build', { read: false })
        .pipe(rimraf());
});

//Convenience task for running a one-off build
gulp.task('build', ['clean'],  function() {
    gulp.run('copy', 'templates','browserify', 'sass');
});

gulp.task('serve', function() {
    server.listen(serverport);
    lrserver.listen(livereloadport);
});

gulp.task('watch', function() {
    gulp.watch('sass/*.scss', function() {
        gulp.run('sass');
    });

    gulp.watch('js/**/*.js', function() {
        gulp.run('browserify');
    });

    gulp.watch('views/*.html', function () {
        gulp.run('html');
    });

    gulp.watch('templates/**/*.hbs', function(){
       gulp.run('templates', 'browserify');
    });
});

gulp.task('default', function () {
    gulp.run('build', 'serve', 'watch');
});