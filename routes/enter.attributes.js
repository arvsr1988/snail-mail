//var emailFunctions = require('email.functions');
exports.show = function(req, res){
    res.render('add_attributes',{attributes : emailAttributes});
};