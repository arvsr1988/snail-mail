var init = function(){
  $(".add-tag-control").unbind("click");
  $(".add-tag-control").click(function(){
    var targetElementString = $(this).data('element');
    var targetElement = $(targetElementString);
    targetElement.focus();
    var positionToAddString = document.querySelector(targetElementString).selectionStart;
    var presentValue = targetElement.val();
    var stringToAdd = "${enter tag here}";
    targetElement.val(presentValue.substring(0,positionToAddString) + stringToAdd + presentValue.substring(positionToAddString));
    var selectPositionStart = positionToAddString + 2;
    document.querySelector(targetElementString).setSelectionRange(selectPositionStart, selectPositionStart + stringToAdd.length - 3);
  });
};

exports.init = init;
