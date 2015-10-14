var track = function(eventAction, eventValue){
    ga('send', {
        hitType: 'event',
        eventCategory: 'Email',
        eventAction: eventAction,
        eventLabel: 'Email Flow Tracking',
        eventValue : ''
    });
};

exports.track = track;