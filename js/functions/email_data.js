const emailDataKey = "emailData";

const save = function(serializedForm){
    localStorage.setItem(emailDataKey, JSON.stringify(serializedForm));
};

const getEmailData = function(){
  let emailData = localStorage.getItem(emailDataKey);
  try {
    return JSON.parse(emailData) || {}
  } catch (ex){
    console.log("exception parsing email data");
    return {}
  }
};

const removeEmailData = function(){
  localStorage.removeItem(emailDataKey);
};

const saveAttachment = (data) => {
  const emailData = getEmailData();
  emailData.attachment = data;
  save(data);
}

module.exports = {
  getEmailData,
  save,
  removeEmailData
}
