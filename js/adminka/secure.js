function showSecureLogByParam(){
    $( '#secure_tab_view' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "date" },
          { "mDataProp": "ip" },
          { "mDataProp": "country" },
          { "mDataProp": "city" },
          { "mDataProp": "browser" },
          { "mDataProp": "os" },
          { "mDataProp": "resolution" },
          { "mDataProp": "java" },
          { "mDataProp": "action" },
        ],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 6 ]
        }],
        "sAjaxSource": "/panel/security/showparam",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "id", "value": $("#hId").val() },
                { "name": "param", "value": $("#hParam").val() }
            );
        },
        "fnRowCallback":function( nRow, aData, status){
            if( aData.browser != "" )
                $('td:eq(4)', nRow).html( aData.browser+"<span><img class='browsers_ico' src='"+getImageByBrowser( aData.browser )+"'><span>" );

            if( aData.os!= "" )
                $('td:eq(5)', nRow).html( aData.os+"<span><img class='browsers_ico' src='"+getImageByOs( aData.os )+"'><span>" );
        },
        "deferRender": true,
        "bDestroy": true
    });
}