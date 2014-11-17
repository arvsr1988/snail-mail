var homePage = require('./page-inits/home');

$(document).ready(function(){
    var pageInitHash =
    {
        "home" : {"context" : homePage}
    };

    var pageName = $("#page-name");
    if(!pageName.length) {
        return false;
    }
    var pageContext = pageInitHash[pageName.val()]["context"];
    var init = pageContext.init;
    init.apply(pageContext);
});