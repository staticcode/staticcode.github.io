var table,dateRange = {},netList = {};

function showNetLog(){
	table = $('#netLogAction').dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        'iDisplayLength': 50,
        "bFilter": false,
        "aLengthMenu": [[5, 10, 50, -1], [5,10, 50, 'All']],
        "bServerSide": true,
        "bProcessing": false,
        "aaSorting": [[ 2, "desc" ]],
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [ 3 ]
        }],
        "aoColumns": [
            {"mDataProp":"date"},
            {"mDataProp":"email"},
            {"mDataProp":"type"},
            {"mDataProp":"list"}
        ],
        "sAjaxSource": "/panel/logAction/shownetlog",
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"rDate","value":dateRange},
                {"name":"netList","value":netList}
            );
        },
        "fnRowCallback":function( nRow, aData, status){

        },
        "deferRender": true,
        "bDestroy": true
    });
}

function aplyNetFilter(){
    netList = {};

    dateRange = {
        'start':$('#netInfoFrom').val(),
        'end':$('#netInfoTo').val(),
    };

    $('#netFilterList option:selected').each(function(){
        var nettype = $(this).data('type');
        var tid = $(this).val();
        if( typeof netList[nettype] == 'undefined' )
            netList[nettype] = new Array();

        netList[nettype].push(tid);
    });

    table.fnReloadAjax();
}