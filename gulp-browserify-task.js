/* browserify task
 ---------------
 Bundle javascripty things with browserify!
 This task is set up to generate multiple separate bundles, from
 different sources, and to use Watchify when run from the default task.
 See browserify.bundleConfigs in gulp/config.js
 //borrowed from https://github.com/vigetlabs/gulp-starter
 */

var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var mergeStream  = require('merge-stream');
var gulp         = require('gulp');
var source       = require('vinyl-source-stream');
var _            = require('lodash');
var config       =
{
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
        entries: './js/home.js',
        dest: global._publicDir,
        outputName: 'bundle.js',
        // Additional file extentions to make optional
        extensions: ['.hbs']
        },
        {
            entries: './js/sending_via_gmail.js',
            dest: global._publicDir,
            outputName: 'sending_via_gmail.js'
        }
    ]
};

var browserifyTask = function(devMode) {

    var browserifyThis = function(bundleConfig) {
        if(devMode) {
            // Add watchify args and debug (sourcemaps) option
            _.extend(bundleConfig, watchify.args, { debug: true });
            // A watchify require/external bug that prevents proper recompiling,
            // so (for now) we'll ignore these options during development. Running
            // `gulp browserify` directly will properly require and externalize.
            bundleConfig = _.omit(bundleConfig, ['external', 'require']);
        }

        var b = browserify(bundleConfig);

        var bundle = function() {
            // Log when bundling starts
            //bundleLogger.start(bundleConfig.outputName);

            return b
                .bundle()
                // Report compile errors
                .on('error', function(err){console.log(err)})
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specify the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .pipe(browserSync.reload({
                    stream: true
                }));
        };

        if(devMode) {
            // Wrap with watchify and rebundle on changes
            b = watchify(b);
            // Rebundle on update
            b.on('update', bundle);
            bundleLogger.watch(bundleConfig.outputName);
        } else {
            // Sort out shared dependencies.
            // b.require exposes modules externally
            if(bundleConfig.require) b.require(bundleConfig.require);
            // b.external excludes modules from the bundle, and expects
            // they'll be available externally
            if(bundleConfig.external) b.external(bundleConfig.external);
        }

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));

};

gulp.task('browserify', function() {
    return browserifyTask();
});

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;