var table, delivery_date;
function showTemplatesTab(){
    var table = $( '#templates_tab' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aoColumns": [
            {'mDataProp':'id'},
            {'mDataProp':'check'},
            {'mDataProp':'title'},
            {'mDataProp':'type'},
            {'mDataProp':'created'},
            {'mDataProp':'changed'},
            {'mDataProp':'panel'},
        ],
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 2, "desc" ]],
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [ 0, 1, 6 ]
        },{
            "bVisible" : false,
            "aTargets": [ 0 ]
        }],
        "sAjaxSource": "/panel/massdelivery/show",
        "fnRowCallback":function( nRow, aData, status)
        {
            $('td:eq(0)', nRow).html( '<input type="checkbox" class="tmplSelector" id="tmpl_' + aData.id + '">' );
            $('td:eq(3)', nRow).html( showDatetime( aData.created ) );
            $('td:eq(4)', nRow).html( showDatetime( aData.changed ) );

            $('td:eq(5)', nRow).html(   '<a target="_blank" href="/panel/massdelivery/addtemplate/id/'+aData.id+'" class="circle-button btn-primary">'+
                                            '<i class="icon-edit"></i></a>'+
                                        '<a href="javascript:void(0);" class="circle-button btn-success" onclick="copyTemplates('+aData.id+');">'+
                                            '<i class="icon-copy"></i></a>'+
                                        '<a href="javascript:void(0);" class="circle-button btn-danger" onclick="deleteTemplates('+aData.id+');">'+
                                            '<i class="icon-trash"></i></a>');
        },
        "fnDrawCallback":function(){
            if ( $('#templates_tab_paginate ul li').size() - 3) {
                $('#templates_tab_paginate').parent().css('display', 'block');
            }else{
                $('#templates_tab_paginate').parent().css('display', 'none');
            }
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function selectAll(checked){
    var chb = $(".tmplSelector");
    chb.each(function(){
        $(this).prop('checked', checked);
    });
}

function showPreview(){
    $("#MassDeliveryTemplate_preview").val(1);
    $('form#templates-form').submit();
}

function copyTemplates(id){
    if( !confirm("Вы действительно хотите скопировать шаблон") ) return false;
    
    if( typeof id == 'undefined' )
        var tmpls = getTemplIds();
    else
    {
        var tmpls = new Array();
        tmpls.push(id);
    }

    if( tmpls.length == 0 ){
        alert("Выберите шаблон");
        return false;
    }

    $.post('/panel/massdelivery/copy', {'tmpls_id':tmpls}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            showTemplatesTab();
        else
            alert("Скопировать шаблон не удалось");
    });
}

function getTemplIds(){
    var tmpl = new Array();
    $("#templates_tab .tmplSelector:checked").each(function(){
        var id = this.id.substring(5);
        tmpl.push(id);
    });

    return tmpl;
}

function deleteTemplates(id){
    if( !confirm("Вы действительно хотите удалить шаблон") ) return false;
    
    if( typeof id == 'undefined' )
        var tmpls = getTemplIds();
    else
    {
        var tmpls = new Array();
        tmpls.push(id);
    }

    if( tmpls.length == 0 ){
        alert("Выберите шаблон");
        return false;
    }

    $.post('/panel/massdelivery/delete', {'tmpls_id':tmpls}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            showTemplatesTab();
        else
            alert("Удалить шаблон не удалось");
    });
}

function showSpreview(){
    var preview = CKEDITOR.instances['MassDelivery_template'].getData();
    $.post('/panel/massdelivery/setpreview', {'preview':preview}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            window.open( "/panel/massdelivery/spreview", "_blank" );
    });
}

function changeTemplateList(){
    var ctype = $('#MassDelivery_type').val();
    var res = '<option value="-1">Выберите шаблон</option>';

    if( typeof templateList[ctype] != 'undefined' ){
        for( i in templateList[ctype] ){
            res = res + '<option value="'+templateList[ctype][i].id+'">'+templateList[ctype][i].title+'</option>';
        }
    }

    $("#tempList").html(res);

    setTemplate();
}

function setTemplate(){
    var ctype = $('#MassDelivery_type').val();
    var tmpl_id = $('#tempList').val();

    if( typeof templateList[ctype] != 'undefined' && typeof templateList[ctype][tmpl_id] != 'undefined' ){
        CKEDITOR.instances['MassDelivery_template'].setData( templateList[ctype][tmpl_id].template );
        $("#MassDelivery_title").val( templateList[ctype][tmpl_id].title );
    }
}

function checkHour(e){
    if( $(e).val() > 23 )
        $(e).val(23);
}

function checkMinute(e){
    if( $(e).val() > 59 )
        $(e).val(59);
}

function showDeliveryHistory(){
    table = $( '#delivery_history' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aoColumns": [
            {'mDataProp':'id'},
            {'mDataProp':'title'},
            {'mDataProp':'type'},
            {'mDataProp':'users'},
            {'mDataProp':'date'},
            {'mDataProp':'status'},
            {'mDataProp':'author'},
        ],
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 4, "desc" ]],
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [ 0, 3 ]
        },{
            "bVisible" : false,
            "aTargets": [ 0 ]
        }],
        "sAjaxSource": "/panel/massdelivery/historyshow",
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"ddate","value":delivery_date}
            );
        },
        "fnDrawCallback":function(){
            if ( $('#delivery_history_paginate ul li').size() - 3) {
                $('#delivery_history_paginate').parent().css('display', 'block');
            }else{
                $('#delivery_history_paginate').parent().css('display', 'none');
            }
        },
        "fnInitComplete": function ( oSettings, json ) {
            $("td").wrapInner( "<span class='word-break'></span>");
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function deliveryChange(e){
    delivery_date = $(e).val();
    table.fnReloadAjax();
}