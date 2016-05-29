var shell = require('shelljs');
var configs = require('./configs.js');

var artifactDir = configs.artifactDir;
shell.mkdir('-p', artifactDir);

['public','views','app','routes','js'].forEach(function(directory){
   shell.cp('-rf', directory, artifactDir + directory);
});

shell.cp('app.js', artifactDir);
