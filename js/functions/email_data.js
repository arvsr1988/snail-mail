module.exports = {
    save : function(serializedForm, callback){
        $.ajax({
            url : '/saveEmailData',
            type : 'POST',
            data : serializedForm,
            success : function(){
                callback(true);
            },
            error : function(){
                callback(false);
            }
        });
    }
};