var tracking = require('./tracking');

$(document).ready(function(){
    if(!$("#emailsSent")){
        return false;
    }
    tracking.track('gmailEmailsSent');
});