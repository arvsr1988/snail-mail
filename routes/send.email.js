exports.send = function(req,res) {
    console.log(req.params);
    console.log(req.param('subject'));
    console.log(req.body);
    res.send(200);
};