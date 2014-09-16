module.exports = {

    getAttributes : function(emailString){
        var attrs = [];
        var patternString = /(?:\$\{)?([a-zA-Z0-9]+)(?:\})/g;
        var letter = 'hi my name is ${name}. I am ${age} years old';
        var patternMatch;
        while((patternMatch = patternString.exec(letter)) !== null){
            console.log(patternMatch[1]);
            attrs.push(patternMatch[1]);
        }
        console.log(attrs);
        return attrs;
    }

};