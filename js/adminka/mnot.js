function showMsgSett(id, date)
{
    var date = date || '';
    var table = $('#msg_'+id).dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: "
        },
        "aoColumns": [
            {'mDataProp':'check'},
            {'mDataProp':'msg'},
            {'mDataProp':'tarif'},
            {'mDataProp':'trial'},
            {'mDataProp':'email'},
            {'mDataProp':'start'},
            {'mDataProp':'end'},
            {'mDataProp':'active'}
        ],
        "aaSorting": [[ 5, "desc" ]],
        "bFilter": false,
        "aLengthMenu": [[5, 10, 50], [5,10,50]],
        "bServerSide": true,
        "aoColumnDefs": [
        {
            "bSortable" : false,
            "aTargets": [ 0,3 ]
        },
        ],
        "sAjaxSource": "/panel/mnot/showSett/type/"+id,
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "date", "value": date }
            );
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        },
        "fnDrawCallback": function() {
            $("td").wrapInner( "<span class='word-break'></span>");            
        },
        "fnInitComplete": function ( oSettings, json ) {
            $("td").wrapInner( "<span class='word-break'></span>");
        },
        "deferRender": true,
        "bDestroy": true
    });

    /*table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        var url = "/panel/mnot/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });

    $('#msg_'+id).on('click', 'input', function () {
        
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        status = (res[7]==1) ? 0 : 1;
        
        $.ajax({
            type: "POST",
            url: "/panel/mnot/setstatus",
            data: {'id':res[0], 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });
                
    });*/
}

function clearForm()
{
    $('input[name=href], input[name=link]').parent().addClass('shw_lnk');
    //$('.ok_img').css('display', 'none');
    //$('.error_img').css('display', 'none');
    //$('#user_id').val(0);
    var fields  = $('input');
    $('.chosen').val('').trigger('liszt:updated');
    document.getElementById('msg_text').value='';
    fields.each( function(k,v){
        type = v.type;
        
        if( ( type == 'text' || type == 'hidden' ) && v.name !== 'user' ){
            v.value = '';
        }
    });
}

/*function checkUserEmail(email)
{
    $.ajax({
        type: 'POST',
        url: '/panel/mnot/checkEmail',
        'data':{'email':email},
        success:function(data){
            
            if(data.log == 'error')
            {
                $('.error_img').css('display', 'inline');
                $('.ok_img').css('display', 'none');
                $('input[name=user_id]').val(0);
            }
            else
            {
                $('input[name=user_id]').val(data.msg);
                $('.error_img').css('display', 'none');
                $('.ok_img').css('display', 'inline');
            }
        },
        dataType:'json'
    });
}*/

function showFormShadow( id ){
    $('.hideField').val(id);
    openForm();
}

function closeForm(){
    clearForm();
    $('.popup-win').css('display','none');
}

function openForm(){
    $('.popup-win').css('display','block');
}

function subFrm( frm_id ){
    var hide_id = $('#hide_id').val();
    var data = $("#"+frm_id).serialize();
    $.ajax({
        type: 'POST',
        url: '/panel/mnot/create',
        dataType: 'json',
        data: data,
        success: function(data) {
            var res = $.parseJSON(data);
            if(data.log == 'error')
                alert(data.msg);
            else{
                $('#msg_'+hide_id).dataTable().fnReloadAjax();
                closeForm();
            }
        },
    });
}

function deleteChecked(type_id){
    if( !confirm("Вы действительно хотите удалить уведомления?") ) return false;
    
    var Ids = getIdsByType(type_id);

    if( Ids.length == 0 ){
        alert("Выберите уведомления");
        return false;
    }

    $.post('/panel/mnot/mdelete', {'ids':Ids}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            showMsgSett(type_id);
        else
            alert("Удалить уведомления не удалось");
    });
}

function getIdsByType(type_id){
    var Ids = new Array();
    $("#msg_"+type_id+" .iCheck:checked").each(function(){
        Ids.push( $(this).data('id') );
    });

    return Ids;
}

function activDeactiv(type_id){
    if( !confirm("Вы действительно хотите изменить статус уведомлений?") ) return false;

    var Ids = getIdsByType(type_id);

    if( Ids.length == 0 ){
        alert("Выберите уведомления");
        return false;
    }

    $.post('/panel/mnot/mactivator', {'ids':Ids}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            showMsgSett(type_id);
        else
            alert("Удалить уведомления не удалось");
    });
}

function checkAllByType(e){
    var type_id = $(e).data('type_id');
    var is_check = $(e).prop('checked');
    $("#msg_"+type_id+" .iCheck").each(function(){
        $(this).prop('checked', is_check);
    });
}

function createNotification(type_id){
    clearForm();
    showFormShadow(type_id);
}

function showNotHistory()
{
    var table = $('#mnot_history').dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aoColumns": [
            {'mDataProp':'id'},
            {'mDataProp':'time'},
            {'mDataProp':'msg'},
            {'mDataProp':'user'},
            {'mDataProp':'tarif'},
            {'mDataProp':'type'}
        ],
        "aSorting": [[ 10, "desc" ]],
        "aLengthMenu": [[10, 50], [10,50]],
        "bServerSide": true,
        "aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        ],
        "sAjaxSource": "/panel/mnot/showHistory",
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
            $('td:eq(4)', nRow).html(aData.type+'<span class="right tools" ><i class="icon-trash"></i></span>');
        },
        "fnInitComplete": function ( oSettings, json ) {
            $("td").wrapInner( "<span class='word-break'></span>");
        },
        "deferRender": true,
        "bDestroy": true
    });

    table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        var url = "/panel/mnot/delete/type/history";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res.id, url, table )
        }else{
            return false;
        }
    });
}