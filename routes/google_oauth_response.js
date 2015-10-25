var handle = function(req,res,next){
    res.render('sending_via_gmail', {code : req.query.code});
};

exports.handle = handle;