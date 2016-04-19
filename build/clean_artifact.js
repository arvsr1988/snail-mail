var shell = require('shelljs');
var artifactDir = require('./configs.js').artifactDir;

shell.rm('-rf', artifactDir);