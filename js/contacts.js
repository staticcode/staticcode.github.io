function upldImages(obj) {
    alert(1);
    var obj = obj || {};

    if(!$.isEmptyObject(obj)){
        var form = document.getElementById("contact-form");
        var imgBlock = $('.img_list');
        xhr = new XMLHttpRequest();
        xhr.open("POST", "/support/show/upload");
        var fd = new FormData(form)
        fd.append("contacts", 1);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    var data = $.parseJSON(xhr.responseText);
                    $.each(data, function(k, v){
                        if(typeof v.status !== 'undefined' && v.status == 'success'){
                            var strLen = v.data.length;
                            var res = v.data;

                            if(res[strLen-1] == '/')
                                res = res.substring(-1);

                            imgBlock.append('<input type="hidden" name="imgs[]" value='+res+'/>');
                        }
                    });
                }
            }
        };
        xhr.send(fd);
        $('input:file').MultiFile('reset');
        setTimeout(function() { form.submit() }, 500);
    }

    $('#sendForm').submit();
}