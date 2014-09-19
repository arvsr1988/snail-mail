module.exports = {

    getAttributes : function(emailString){
        var attrs = [];
        var patternString = /(?:\$\{)?([a-zA-Z0-9]+)(?:\})/g;
        var letter = emailString;
        var patternMatch;
        while((patternMatch = patternString.exec(letter)) !== null){
            attrs.push(patternMatch[1]);
        }
        console.log(attrs);
        return attrs;
    }

};