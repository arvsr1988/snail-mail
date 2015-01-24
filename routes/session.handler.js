var destroy = function(req){
    req.session = null;
};

module.exports = {
    destroy : destroy
};