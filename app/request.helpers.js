var getHostName = function(req){
    return req.protocol + '://' + req.get("host");
};

exports.getHostName = getHostName;