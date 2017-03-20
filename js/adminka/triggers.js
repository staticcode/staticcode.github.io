function changeTriggerStatus(e, id){

    if (!confirm("Вы действительно хотите изменить статус триггера?")) {

        $(e)
            .prop('checked', (!$(e).prop('checked')))
            .closest('.toggle')
            .toggleClass('btn-default')
            .toggleClass('btn-primary')
            .toggleClass('off');
    } else {
        var status = ($(e).prop('checked') ? 1 : 0);
        $.post('/panel/triggers/cstatus', {'id':id,'status':status}, function (result){
            var answer = $.parseJSON(result);
            if( typeof answer.success != 'undefined' && answer.success === true )
                return true;
            else
                alert("ошибка при изменении статуса");
        });
    }
}

function deleteTrigger(id){
    if( !confirm("Вы действительно хотите удалить триггер?") ) return false;

    $.post('/panel/triggers/delete', {'id':id}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            $('#trow_' + id).remove();
        else
            alert("ошибка при удалении триггера");
    });
}

function copyTrigger(id){
    if( !confirm("Вы действительно хотите скопировать триггер?") ) return false;

    $.post('/panel/triggers/copy', {'id':id}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            document.location.href = "/panel/triggers/index";
        else
            alert("ошибка при копировании триггера");
    });
}



function setParameters(e){
    var id = e.id.substring(7);

    var seltype = $(e).find('option:selected').data('seltype');
    var vals = $(e).find('option:selected').data('vals');

    $('.not-view-' + id).hide();

    if( seltype != 0 )
        $('#' + seltype + '_' + id ).show();

    if( vals != 0 )
        $('#' + vals + '_' + id ).show();
}

function addRelStr(){
    curId = curId + 1;

    $.post('/panel/triggers/addrow', {'rid':curId}, function (result){
        if( result != '' )
            $(".segmentBlock").append(result);
    });
}

function deleteSegmentRow(id){
    $("#sRow_"+id).remove();
}

function selectedMCategory(e) {
    var num = $(e).find('option:selected').data('num');

    if (num == 1) {
        $('.cntDays').show();
    } else {
        $('.cntDays').hide();
    }
}

function selectedAction(e){
    var actId = $(e).val();
    if(actId == 1){
        $('.addActionsBlock').show();
        $("#deliveryTemplates").hide();
    }else{
        $('.addActionsBlock').hide();
        if( typeof templateList[actId] != 'undefined' ){
            var opt = '<option value="">Выберите шаблон</option>';
            var selOpt = $("#templateSelect").val();
            for( i in templateList[actId] ){
                opt = opt + '<option '+( selOpt == templateList[actId][i].id ? 'selected="selected"' : '' )+' value="'+templateList[actId][i].id+'">'+templateList[actId][i].title+'</option>';
            }
            $("#deliveryTemplates").html(opt);
            $("#deliveryTemplates").show();
        }else{
            $("#deliveryTemplates").hide();
        }
    }
}

function changeCatParam(v){
    var $this = $("#catParam");
    var currItem = $this.val();

    var newItem = (v) ? (parseFloat(currItem) + 1) : (parseFloat(currItem) - 1);

    if( newItem < 0 || newItem === NaN || newItem === null )
        $this.val('00');
    else if( newItem >= 100 )
        $this.val(99);
    else{
        if( newItem < 10 ) $this.val( '0' + newItem);
        else $this.val(newItem);
    }
}