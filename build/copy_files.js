var shell = require('shelljs');
var configs = require('./configs.js');

var artifactDir = configs.artifactDir;
shell.mkdir('-p', artifactDir + "node_modules");
var dependenciesStr = require('../package.json').dependencies;
for(var dependency in dependenciesStr){
   var dependencyDirectory = 'node_modules/' + dependency;
   shell.mkdir(artifactDir + dependencyDirectory);
   shell.cp('-rf',dependencyDirectory, artifactDir + 'node_modules/');
}

['public','views','app','routes','js'].forEach(function(directory){
   shell.cp('-rf', directory, artifactDir + directory);
});

shell.cp('app.js', artifactDir);
