var validateUpload = function(element, callback, context){
    if(element.val().length === 0){
        return false;
    }
    var file = element.prop("files")[0];
    if(file.type.indexOf("csv") === -1){
        return false;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        var rowHash = parseAttributes(this.result);
        callback.apply(context, [rowHash]);
    };
    return true;
};

var parseAttributes = function(stringifiedCSV){
    var attributeRows = stringifiedCSV.split('\n');
    if(attributeRows.length <= 1){
        return [];
    }

    var attributeNames = attributeRows.splice(0,1)[0].split(",");
    var attributeHash = [];
    attributeRows.forEach(function(row, rowIndex){
        var rowValueArray = row.split(",");
        attributeHash[rowIndex] = {};
        rowValueArray.forEach(function(value, columnIndex){
           attributeHash[rowIndex][attributeNames[columnIndex]] = value;
        });
    });
    return attributeHash;
};

module.exports = {
    validateUpload : validateUpload
};