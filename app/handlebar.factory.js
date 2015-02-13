var expressHbs = require('express-handlebars');
var hbsInstance = null;

var init = function(){
    hbsInstance = expressHbs.create({extname:'hbs', defaultLayout : 'main.hbs'});
    return hbsInstance;
};

var getInstance = function(){
    return hbsInstance;
};

exports.init = init;
exports.getInstance = getInstance;