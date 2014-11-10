module.exports = {
    getHost : function(){
        var location = window.location.origin;
        if (!location) {
            location = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
        return location;
    }
};