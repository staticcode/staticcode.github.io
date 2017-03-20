function addRelStr(obj){
    var obj = obj || {};
    curId = curId + 1;
    var sgCnt = $('.segmentation-string').length;

    if(sgCnt <= catCnt)
    {
        $.post('/panel/posts/addrow', {'rid':curId}, function (result){
            if( result != '' )
                $(".segmentBlock").append(result);
        });
    }
    else
        obj.addClass('disabled');
}

function deleteSegmentRow(id){
    var sgCnt = $('.segmentation-string').length-1;
    var plus  = $('.add_btn').children();
    $("#sRow_"+id).remove();

    if(catCnt >= sgCnt && plus.hasClass('disabled'))
        plus.removeClass('disabled');
}

function setParameters(obj) {
    var obj = obj || {};
    var segments = $('.segmentOpt');
    var overlap = new Array();
    var isCategory = ( obj.hasClass('segmentOpt') ? true : false );

    if ($.isEmptyObject(obj) !== true) {
        var selId = obj.val();

        if (segments.length > 1) {
            $.each(segments, function (k, v) {
                if (v.value == selId && obj.attr('id') != v.id && selId != '' && obj.hasClass('segmentOpt'))
                    overlap.push(obj.attr('id'));
            });
        }

        if (overlap.length == 0) {
            loadSubcat(obj);
        } else {
            for (a in overlap) {
                $('#' + overlap[a]).prop('selectedIndex', '');
            }
            alert("Нельзя выбирать одну категорию дважды");
        }
    }
    else
        obj.next().find('option.sel-vals').remove();
}

function loadSubcat(obj){
    $.post('/panel/posts/loadSubcat', {'cat':obj.val()}, function (result){
        if( result != '' )
            obj.next().html(result);
    });
}