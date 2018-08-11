require('es6-promise').polyfill();

var validateUpload = function(element, callback, context){
    if(element.val().length === 0){
        return false;
    }
    var file = element.prop("files")[0];
    if(!file.type.match(/excel|csv/)){
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
    attributeNames.forEach(function(attrName,index){
       attributeNames[index] = attrName.trim();
    });
    var attributeHash = [];
    attributeRows.forEach(function(row, rowIndex){
        var rowValueArray = row.split(",");
        attributeHash[rowIndex] = {};
        rowValueArray.forEach(function(value, columnIndex){
          if(attributeNames[columnIndex].toLowerCase() === 'email') {
            value = (value || '').trim()
          }
          attributeHash[rowIndex][attributeNames[columnIndex]] = value;
        });
    });
    return attributeHash;
};


const getAttachment = () => {
  return new Promise((resolve, reject) => {
    const attachmentElement = $("#attachment");
    const fileName = attachmentElement.val();

    if(!fileName.length){
      return resolve({});
    }

    const reader = new FileReader();
    const file = attachmentElement.prop('files')[0];
    const {name} = file;
    reader.readAsArrayBuffer(file);
    reader.onloadend = function(){
      const self = this;
      const base64 = btoa(
        new Uint8Array(self.result)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      resolve({name, data: base64})
    };
  })
}

module.exports = {
  getAttachment,
  validateUpload : validateUpload
};