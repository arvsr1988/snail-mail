var init = function(){
    $(".toggle-element").click(function(){
       var target = $(this).data("toggle");
        $(this).toggle();
        $(target).toggle();
    });
};

exports.init = init;