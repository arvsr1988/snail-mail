var shell = require('shelljs');
var watch = require('node-watch');
var jsWatcher = watch('../js');
var cssWatcher = watch('../sass');

console.log("running watcher");

jsWatcher.on('change', function(file){
  console.log("js file changed");
  shell.exec('npm run browserify')
})

cssWatcher.on('change', function(file){
  console.log("css file changed");
  shell.exec('npm run sass')
})
