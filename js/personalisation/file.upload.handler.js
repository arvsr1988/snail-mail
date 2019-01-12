require('es6-promise').polyfill();
const neatCsv = require('neat-csv');

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
      neatCsv(this.result).then(data => {
        callback.apply(context, [data]);
      }).catch(err => {
        alert("something is wrong with your file upload");
      });
    };
    return true;
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
  validateUpload
};