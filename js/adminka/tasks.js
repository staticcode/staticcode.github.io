var utasks, category, tstatus, deadtime, calendarPos = 0;

function showTasksTab(){
    var table = $( '#tasks_tab' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        'iDisplayLength': 10,
        "aLengthMenu": [[5, 10, 50, -1], [5,10, 50, 'All']],
        "bServerSide": true,
        "bProcessing": false,
        "aaSorting": [[ 2, "asc" ]],
        "aoColumns": [
            {"mDataProp":"id"},
            {"mDataProp":"check"},
            {"mDataProp":"ddate"},
            {"mDataProp":"category"},
            {"mDataProp":"status"},
            {"mDataProp":"title"},
            {"mDataProp":"worker"},
            {"mDataProp":"panel"},
        ],
        "aoColumnDefs": [{
                "bVisible" : false,
                "aTargets": [ 0 ]
            },{
                'bSortable': false, 'aTargets': [ 0, 1, 7 ]
        }],
        "sAjaxSource": "/panel/tasks/show",
        "fnServerParams": function (aoData) {
             aoData.push(
                {"name":"utasks","value":utasks},
                {"name":"category","value":category},
                {"name":"status","value":tstatus},
                {"name":"deadtime","value":deadtime}
            );
        },
        "fnDrawCallback":function(){
            if ( $('#tasks_tab_paginate ul li').size() - 3) {
                $('#tasks_tab_paginate').parent().css('display', 'block');
            }else{
                $('#tasks_tab_paginate').parent().css('display', 'none');
            }
        },
        "fnRowCallback":function( nRow, aData, status){
            $('td:eq(0)', nRow).html( '<input type="checkbox" class="taskSelector" id="task_' + aData.id + '">' );
            $('td:eq(1)', nRow).html( showDatetime( aData.ddate ) );

            if( aData.status == 0 )
                $('td:eq(3)', nRow).html( '<span class="label label-success">Новая</span>' );
            else if( aData.status == 1 )
                $('td:eq(3)', nRow).html( '<span class="label label-warning">В работе</span>' );
            else if( aData.status == 2 )
                $('td:eq(3)', nRow).html( '<span class="label label-inverse">Отложена</span>' );
            else if( aData.status == 3 )
                $('td:eq(3)', nRow).html( '<span class="label label-danger">Выполнена</span>' );

            $('td:eq(6)', nRow).html( '<a target="_blank" href="/panel/tasks/view/id/'+aData.id+'" class="circle-button btn-primary"><i class="icon-eye-open"></i></a>'+
                                        '<a href="javascript:void(0);" onclick="startSelected('+aData.id+');" class="circle-button btn-success"><i class="icon-play"></i></a>'+
                                        '<a href="javascript:void(0);" onclick="stopSelected('+aData.id+');" class="circle-button btn-danger"><i class="icon-pause"></i></a>'+
                                        '<a href="/panel/tasks/addchange/id/'+aData.id+'" class="circle-button btn-inverse"><i class="icon-edit"></i></a>');
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function getTaskIds(){
    var task = new Array();
    $("#tasks_tab .taskSelector:checked").each(function(){
        var id = this.id.substring(5);
        task.push(id);
    });

    return task;
}

function selectAll(checked){
    var chb = $(".taskSelector");
    chb.each(function(){
        $(this).prop('checked', checked);
    });
}

function taskFilterApply(callback){
    utasks = new Array();
    tstatus = new Array();

    $('#taskFilter input[name=utasks]').each(function(){
        if( $(this).prop('checked') )
            utasks.push(this.value);
    });

    $('#taskFilter input[name=status]').each(function(){
        if( $(this).prop('checked') )
            tstatus.push(this.value);
    });

    category = $('#taskFilter select[name=category]').val();

    deadtime = {
        'from': $('#taskFilter input[name=dead_from]').val(),
        'to': $('#taskFilter input[name=dead_to]').val(),
    };

    callback();
}

function taskFilterReset(callback){
    utasks = new Array();
    tstatus = new Array();
    category = '';
    deadtime = '';
    calendarPos = 0;
    $('#taskFilter input.datepicker').val('');
    $('#taskFilter select[name=category] option:first').attr('selected', 'selected');
    $('#taskFilter input[type=checkbox]').prop('checked', false);
    $('#taskFilter span.checked').removeClass('checked');

    callback();
}

function deleteSelected(){
    if( !confirm("Вы действительно хотите удалить выбранные задачи?") ) return false;

    var tasks = getTaskIds();

    if( tasks.length == 0 ){
        alert("Выберите задачи");
        return false;
    }

    $.post('/panel/tasks/mdelete', {'tasks_id':tasks}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            showTasksTab();
        else
            alert("Удалить задачи не удалось");

        $(".selectAll").prop('checked', false);
        $(".selectAll").parent().removeClass('checked');
    });
}

function stopSelected(id, reload){
    if( !confirm("Вы действительно хотите приостановить выбранные задачи") ) return false;

    var tasks = ( typeof id == 'undefined' ) ? getTaskIds() : [ id ];
    var date = $("#setAsideDate").val();

    if( tasks.length == 0 ){
        alert("Выберите задачи");
        return false;
    }

    $.post('/panel/tasks/stoped', {'tasks_id':tasks,'date':date}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            if( typeof reload != 'undefined' && reload === true )
                window.location.href = document.location.href;
            else
                showTasksTab();
        }
        else
            alert("Приостановить задачи не удалось");

        $(".selectAll").prop('checked', false);
        $(".selectAll").parent().removeClass('checked');
    });
}

function setAsideBlock(){
    var $b = $("#setAsideBlock");

    if( $b.css('display') == 'none' )
        $("#setAsideBlock").show();
    else
        $("#setAsideBlock").hide();
}

function startSelected(id, reload){
    if( !confirm("Вы действительно хотите запустить выбранные задачи") ) return false;

    var tasks = ( typeof id == 'undefined' ) ? getTaskIds() : [ id ];

    if( tasks.length == 0 ){
        alert("Выберите задачи");
        return false;
    }

    $.post('/panel/tasks/start', {'tasks_id':tasks}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            if( typeof reload != 'undefined' && reload === true )
                window.location.href = document.location.href;
            else
                showTasksTab();
        }
        else
            alert("Запустить задачи не удалось");

        $(".selectAll").prop('checked', false);
        $(".selectAll").parent().removeClass('checked');
    });
}

function taskComplete(id, reload){
    if( !confirm("Завершить задачу?") ) return false;

    var tasks = ( typeof id == 'undefined' ) ? getTaskIds() : [ id ];

    if( tasks.length == 0 ){
        alert("Выберите задачи");
        return false;
    }

    $.post('/panel/tasks/complete', {'tasks_id':tasks}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            if( typeof reload != 'undefined' && reload === true )
                window.location.href = document.location.href;
            else
                showTasksTab();
        }

        //$(".selectAll").prop('checked', false);
        //$(".selectAll").parent().removeClass('checked');
    });
}

function getNewContactsForm(){
    var client_id = $("#TriggerTask_clientId").val();

    if( client_id == '' || client_id == 0 ){
        alert("Сначала выберите клиента");
        return false;
    }

    $.post('/panel/profile/newcontact', {'user_id':client_id}, function (result){
        if( result != '' ){
            $(".popup-win .add-template").html(result);
            $(".popup-win").show();
        }
    });
}

function setEndComplateTime(e){
    if( e.value == 3 ){
        var c = new Date;
        v = ( ( c.getMonth() + 1 ) > 9 ? ( c.getMonth() + 1 ) : '0' + ( c.getMonth() + 1 ) ) + '/' + ( c.getDate() > 9 ? c.getDate() : '0' + c.getDate() ) + '/' + c.getFullYear() + ' ' + c.getHours() + ':' + c.getMinutes() + ':' + c.getSeconds();
        $("#TriggerTask_co_timev").val(v);
        $("#TriggerTask_co_time").val(v);
    }else{
        $("#TriggerTask_co_timev").val('');
        $("#TriggerTask_co_time").val('');
    }

}

function addContactsHistory(id){
    var $rq = $("#newContactsForm .required");
    var status = true;

    $rq.each(function(){
        if( this.value == '' ){
            status = false;
            return false;
        }
    });

    if( !status ){
        alert( 'Не все поля заполнены' );
        return false;
    }

    var data = $("#newContactsForm").serialize();
    var cid = ( typeof id != 'undefined' ) ? '/cid/' + id : '';

    $.post('/panel/profile/addcontact' + cid, data, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            $(".popup-win").hide();
            $("#TriggerTask_chistory_id").val( answer.id );
            $("#contactItemBlock").html('<a href="/panel/profile/viewcontact/id/'+answer.id+'">'+answer.cname+'</a><span onclick="deleteCheckContact();"><i class="icon-trash"></i></span>');
            alert("Контакт создан и прикреплен");
        }
        else
            alert("Ошибка при добавлении контакта");
    });
}

function attachHistory(e){
    $(".btn-success.attach").show();
    $("#cBlock").hide();
    $("#TriggerTask_chistory_id").val(e.value);
    var cname = $(e).find('option:selected').html()
    $("#contactItemBlock").html('<a href="/panel/profile/viewcontact/id/'+e.value+'">'+cname+'</a><span onclick="deleteCheckContact();"><i class="icon-trash"></i></span>');
    alert("Контакт прикреплен");
}

function deleteCheckContact(){
    $("#TriggerTask_chistory_id").val('');
    $("#contactItemBlock").html('');
}

function loadHistory(){
    var client_id = $("#TriggerTask_clientId").val();

    if( client_id == '' || client_id == 0 ){
        alert("Сначала выберите клиента");
        return false;
    }

    $.post('/panel/tasks/gethistory', {'id':client_id}, function (result){
        if( result != '' ){
            $("#cBlock").html(result).css("display","inline-block");
            $(".btn-success.attach").hide();
        }else
            alert("У данного пользователя история отсутствует.");
    });
}

function paginateTask(m){
    if(m) calendarPos = calendarPos + 1;
    else calendarPos = calendarPos - 1;
    getCalendarTab();
}

function getCalendarTab(){
    var data = {
        "utasks":utasks,
        "category":category,
        "status":tstatus,
        "deadtime":deadtime
    };

    $.post('/panel/tasks/getcalendar', {'cp':calendarPos, 'option':data}, function (result){
        if( result != '' ){
            $("#calendaruse").html(result);
        }
    });
}

function checkSelectedChanel(){
    if( $("select[name=chanel]").val() == 'ticket' ){
        $(".ticketBlock").show();
        $(".logsBlock").hide();
    }else{
        $(".ticketBlock").hide();
        $(".logsBlock").show();
    }
}