var shell = require('shelljs');
var artifactDir = require('./configs.js').artifactDir;

var scriptsToUglify = [artifactDir + 'public/bundle.js', artifactDir + 'public/sending_via_gmail.js'];
scriptsToUglify.forEach(function(scriptFileName){
    if(!shell.exec('uglifyjs ' + scriptFileName + ' -o ' + scriptFileName)){
        exit(0);
    }
});
