/*function commentpage(page){
    $.post("/blog/info/updateAjax", {'page':page, 'post':"<?php echo $post->id;?>"}, function (result){
        $(".my-comment").html(result);
    });
}*/

function getFilterData( cat ){
    $(".category input[type=hidden]").val( cat );
    $(".category").submit();
}

function subscribe(obj){
    var lngz = $('#subscribe_service').children('input').val().length;
    var error = $('#subscribe_service .err_msg');
    if(error.css('display'))
        error.css('display', 'none');

    if(lngz === 0){
        error.css('display', 'block');    
        /*openNotification('Поле email не можеn быть пустым');*/
        return false;
    }

    if(lngz > 50){
        openNotification('Большое количество введенных символов');
        return false;
    } 
        

    var msg   = $('#subscribe_service').serialize();
    $.ajax({
        type: 'POST',
        url: '/blog/info/subscribe',
        data: msg,
        success: function(data) {
            var res = $.parseJSON(data);
            if(!res.loger) openNotification(res.msg);
            if(res.loger){
                obj.text('Отписаться').attr('onclick', 'unsubscribe($(this))');    
                openNotification("Вы успешно подписаны на рассылку новостей");
            } 
                
        }
    });
}

function unsubscribe(obj){
    var lngz = $('#subscribe_service').children('input').val().length;
    var error = $('#subscribe_service .err_msg');
    if(error.css('display'))
        error.css('display', 'none');

    if(lngz === 0){
        error.css('display', 'block');    
        return false;
    }

    if(lngz > 50){
        openNotification('Большое количество введенных символов');
        return false;
    } 
        

    var msg   = $('#subscribe_service').serialize();
    $.ajax({
        type: 'POST',
        url: '/blog/info/unsubscribe',
        data: msg,
        success: function(data) {
            var res = $.parseJSON(data);
            if(!res.loger) openNotification(res.msg);
            if(res.loger){
                obj.text('Подписаться').attr('onclick', 'subscribe($(this))');
                $('#subscribe_service input[name=email]').val(''); 
                openNotification("Вы успешно отписаны от рассылки новостей");
            } 
                
        }
    });
}

function onSearchFaq(){
    var text = $("#search_text").val();

    if( text != '' ){
        document.getElementById("search_faq").submit();
    }else{
        alert("Поле поиска не может быть пустым");
    }
}

function getFilterData( cat )
{
    $(".category input[type=hidden]").val( cat );
    $(".category").submit();
}

function showLimitTitles(count)
{
    $('.onpage').removeClass('selected');
    $('.onpage .pcheck_' + count).addClass('selected');
    $.post("/blog/default/setCountArticles", {'count':count}, function (result){
        blogpage(1);
    });
}

/*function commentpage(page, postId){
    $.post("/blogm/default/comments", {'page':page, 'post':postId}, function (result){
        $(".my-comment").html(result);
    });
}*/

function getFilterData( cat ){
    $(".category input[type=hidden]").val( cat );
    $(".category").submit();
}

function showAnswer(obj){
    res = obj.closest("div.one-comment").next().css('display');
    if(res=='none') obj.closest("div.one-comment").next().css('display','block');
    else obj.closest("div.one-comment").next().css('display','none');
}

function closeAnswer(obj){
    obj.closest("div.answer-form").css('display','none');
    obj.siblings('textarea').val('');
}

function answMsgComment(obj){
    $.ajax({
        type: "POST",
        url: "/blog/info/sendMsg",
        data: obj.parent().serialize(),
        success: function(data){
            closeAnswer(obj);
            commentpage(1,obj.siblings('input[name=post_id]').val());
        }
    });
}

function showBlocks(isPost){
    var isPost = isPost || false;
    var bl = $('.subscription-form');
    if(isPost === true)
        bl.css('display', 'none');
    else
    if(!bl.is(':visible')) bl.css('display', 'block');
}