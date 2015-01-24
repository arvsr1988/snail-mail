module.exports = {
    save : function(req, res){
        req.session.emailData = req.body;
        res.send(200);
    }
};