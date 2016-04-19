var shell = require('shelljs');
var configs = require('./configs.js');

['images','js/plugins'].forEach(function(directory){
   shell.cp('-rf', directory, 'public/');
});
