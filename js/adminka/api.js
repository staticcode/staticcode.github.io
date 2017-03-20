var type, period;
function showApiHistory(){
	table = $( '#api_history' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        'iDisplayLength': 50,
        "aLengthMenu": [[5, 10, 50, -1], [5,10, 50, 'All']],
        "bServerSide": true,
        "bProcessing": false,
        "aaSorting": [[ 2, "desc" ]],
        "aoColumns": [
            {"mDataProp":"email"},
            {"mDataProp":"ip"},
            {"mDataProp":"time"},
            {"mDataProp":"action"},
            {"mDataProp":"desc"},
        ],
        "sAjaxSource": "/panel/api/showhistory",
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"period","value":period}
            );
        },
        /*"fnServerParams": function (aoData) {
             aoData.push(
                {"name":"utasks","value":utasks},
                {"name":"category","value":category},
                {"name":"status","value":tstatus},
                {"name":"deadtime","value":deadtime}
            );
        },*/
        "fnRowCallback":function( nRow, aData, status){
            $('td:eq(4)', nRow).html( '<span class="word-break">'+aData.desc+'</span>' );
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function showApiUsers(){
	$( '#api_users' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        'iDisplayLength': 50,
        "aLengthMenu": [[5, 10, 50, -1], [5,10, 50, 'All']],
        "bServerSide": true,
        "bProcessing": false,
        "aaSorting": [[ 2, "asc" ]],
        "aoColumns": [
            {"mDataProp":"email"},
            {"mDataProp":"key"},
            {"mDataProp":"time"},
            {"mDataProp":"status"},
        ],
        "sAjaxSource": "/panel/api/showusers",
        "deferRender": true,
        "bDestroy": true
    });
}

function generateHash(){
	$.post('/panel/api/generate', {}, function (result){
        if( result != '' )
        	$("#ApiUsers_api_key").val(result);
    });
}

function changeTriggerStatus(e){
    if( !confirm("Вы действительно хотите изменить статус пользователя?") ) return false;
    
    var $this = $(e).find('input');

    var id = $this[0].id.substring(3);
    var status = $this.prop('checked');
    status = ( status ? 0 : 1 );

    $.post('/panel/api/cstatus', {'id':id,'status':status}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            return true;
        else
            alert("ошибка при изменении статуса");
    });
}

function showApiStats(){
    table = $( '#api_stats' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        'bFilter':false,
        'iDisplayLength': 50,
        "aLengthMenu": [[5, 10, 50, -1], [5,10, 50, 'All']],
        "bServerSide": true,
        "bProcessing": false,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
            {"mDataProp":"date"},
            {"mDataProp":"cnt_req"},
            {"mDataProp":"cnt_hits"},
            {"mDataProp":"cost"},
        ],
        "sAjaxSource": "/panel/api/showstats/id/" + user_id,
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"type","value":type},
                {"name":"period","value":period}
            );
        },
        "footerCallback": function ( row, data, start, end, display )
        {
            var api = this.api(), data;
 
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
            data = api.column( 3, { page: 'current'} ).data();
            pageTotal = data.length ?
                data.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            $( api.column( 3 ).footer() ).html(
                    '$'+ Number( pageTotal ).toFixed(0)
                );


            data = api.column( 2, { page: 'current'} ).data();
            pageTotal = data.length ?
                data.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            $( api.column( 2 ).footer() ).html(
                    Number( pageTotal ).toFixed(0)
                );


            data = api.column( 1, { page: 'current'} ).data();
            pageTotal = data.length ?
                data.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            $( api.column( 1 ).footer() ).html(
                    Number( pageTotal ).toFixed(0)
                );
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function setFilter(){
    type = $('#access').val();
    period = {
        'first': $('input[name=period_from]').val(),
        'last': $('input[name=period_to]').val(),
    };
    table.fnReloadAjax();
}

function setHistoryFilter(){
    period = {
        'first': $('input[name=period_from]').val(),
        'last': $('input[name=period_to]').val(),
    };
    table.fnReloadAjax();
}

function sendUsersMsg(id){
    if( typeof id != 'undefined' ){
        var users = new Array();
        users.push(id);
    }else
        var users = getUserIds();
    
    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    if( !confirm("Вы действительно хотите отправить сообщения выбранным пользователям?") ) return false;

    $.post('/panel/massdelivery/addusers', {'users':users}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            document.location.href = "/panel/massdelivery/adddelivery";
        else
            alert("ошибка при переходе к рассылки");
    });
}