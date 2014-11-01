module.exports = {
    bind: function () {
        $("#breadcrumb > li").click(function () {
            var buttonClicked = $(this);
            if (!buttonClicked.data("enabled")) {
                return false;
            }

            $("#breadcrumb > li").removeClass("selected");
            buttonClicked.addClass("clickable");
            buttonClicked.addClass("selected");
            $(".flow").hide();
            var buttonId = buttonClicked.attr("id");
            var sectionToShow = buttonId.substring(0, buttonId.indexOf('-crumb'));
            $('#' + sectionToShow).show();
        });
    },
    moveTo: function (section) {
        $("#" + section + "-crumb").data("enabled", true);
        $("#" + section + "-crumb").click();
    }
};