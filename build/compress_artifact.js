var shell = require('shelljs');
var artifactDir = require('./configs.js').artifactDir;

shell.exec('tar -cvf dist.tar ' +  artifactDir,{silent : true});
shell.exec('gzip -f dist.tar > dist.tar.gz', {silent : true});