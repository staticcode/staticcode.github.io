var access, status_contact,active_access, tarif, regtime, tarifend, audit, bday, paystatus, trial, loginstatus, fields, use_trial, extra, manager, constant, name, first_name, surname_name, ref, last_activity, direction, expirience, traffics, email_confirm, communication = new Array();;
var defaultFilter;

function showAllUserTable(){
    table = $( '#user_all' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aoColumns": [
            {'mDataProp':'check'},
            {'mDataProp':'regtime'},
            {'mDataProp':'name'},
            {'mDataProp':'email'},
            {'mDataProp':'communication'},
            {'mDataProp':'contact'},
            {'mDataProp':'social'},
            // {'mDataProp':'newr'}, // ЦА
            {'mDataProp':'direction'},
            {'mDataProp':'expirience'},
            {'mDataProp':'traffics'},
            {'mDataProp':'ref'},
            {'mDataProp':'tarif'},
            {'mDataProp':'tarifend'},
            {'mDataProp':'bday'},
            {'mDataProp':'last_contact'},
            {'mDataProp':'comment'},
            {'mDataProp':'last_activity'},
            {'mDataProp':'manager'},
            {'mDataProp':'status_contact'},
            {'mDataProp':'active_access'}

        ],
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 1, "desc" ]],
        "aoColumnDefs": [{
            "bSortable": false,
            "aTargets": [0, 4, 6, 7, 8, 9, 14]
        },{
            "sWidth": "1%",
            "aTargets": [0]
        },{
            "sWidth": "6%",
            "aTargets": [4, 6]
        },{
            "sWidth": "7%",
            "aTargets": [1, 7, 12, 13, 14, 16]
        },{
            "sWidth": "8%",
            "aTargets": [11, 15]
        },{
            "bVisible" : false,
            "aTargets": [2, 7, 8, 9, 10, 13, 16, 18, 19]
            //6, 7, 10, 13,  15, 16
        }],
        "sAjaxSource": "/panel/allUsers/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"tarif","value":tarif},
                {"name":"access","value":access},
                {"name":"status_contact","value":status_contact},
                {"name":"regtime","value":regtime},
                {"name":"tarifend","value":tarifend},
                // {"name":"audit","value":audit},
                {"name":"bday","value":bday},
                {"name":"paystatus","value":paystatus},
                {"name":"loginstatus","value":loginstatus},
                {"name":"trial","value":trial},
                {"name":"fields","value":fields},
                {"name":"use_trial","value":use_trial},
                {"name":"extra","value":extra},
                {"name":"manager","value":manager},
                {"name":"constant","value":constant},
                {"name":"ref","value":ref},
                //{"name":"name","value":name},
                {"name":"first_name","value":first_name},
                {"name":"surname_name","value":surname_name},
                {"name":"last_activity","value":last_activity},
                {"name":"active_access","value":active_access},

                {"name":"direction","value":direction},
                {"name":"traffics","value":traffics},
                {"name":"expirience","value":expirience},
                {"name":"email_confirm","value":email_confirm},
                {"name":"communication","value":communication}
            );
        },
        "fnRowCallback":function( nRow, aData, status){
            if( aData.paystatus == 1 )
                $(nRow).find('td').css('background', '#F2FFDD').css('color', '#868686');
            if( aData.status_contact == 1 )
                $(nRow).find('td').css('background', '#D2F6FC').css('color', '#868686');

            if( aData.active_access == 0 )
                $(nRow).find('td').css('background', '#C8A2C8').css('color', '#fff');
            if( aData.active_access == -1 )
                $(nRow).find('td').css('background', '#f2dede').css('color', '#868686');
        },
        "fnDrawCallback": function (oSettings) {
            var totalCount = oSettings.fnRecordsDisplay();
            showButtonExcel(totalCount);
            $('[type=checkbox][data-toggle]').bootstrapToggle();
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function loadFilter() {
    var filter = {};
    tarif = [];
    $('#usersFilter input[name=filter_tarif]:checked').each(function (i, elem) {
        tarif.push($(elem).val());
    });
    filter.tarif = tarif;

    access = [];
    $('#usersFilter input[name=filter_access]:checked').each(function (i, elem) {
        access.push($(elem).val());
    });
    filter.access = access;

    active_access = [];
    $('#usersFilter input[name=filter_active_access]:checked').each(function (i, elem) {
        active_access.push($(elem).val());
    });
    filter.active_access = active_access;

    paystatus = [];
    $('#usersFilter input[name=filter_status_pay]:checked').each(function (i, elem) {
        paystatus.push($(elem).val());
    });
    filter.paystatus = paystatus;

    use_trial = [];
    $('#usersFilter input[name=filter_use_trial]:checked').each(function (i, elem) {
        use_trial.push($(elem).val());
    });
    filter.use_trial = use_trial;

    extra = [];
    $('#usersFilter input[name=filter_extra]:checked').each(function (i, elem) {
        extra.push($(elem).val());
    });
    filter.extra = extra;

    audit = [];
    $('#usersFilter input[name=filter_target_audience]:checked').each(function (i, elem) {
        audit.push($(elem).val());
    });
    filter.audit = audit;

    fields = [];
    $("input[name=filter_show_field]:checked").each(function () {
        fields.push($(this).val());
    });
    filter.fields = fields;

    tarifend = {
        'from': $('#usersFilter input[name=end_from]').val(),
        'to': $('#usersFilter input[name=end_to]').val(),
    };
    filter.tarifend = tarifend;

    regtime = {
        'from': $('#usersFilter input[name=reg_from]').val(),
        'to': $('#usersFilter input[name=reg_to]').val(),
    };
    filter.regtime = regtime;

    trial = {
        'from': $('#usersFilter input[name=trial_from]').val(),
        'to': $('#usersFilter input[name=trial_to]').val(),
    };
    filter.trial = trial;

    manager = $('#usersFilter select[name=filter_manager]').val();
    filter.manager = manager;

    constant = {
        'from': $('#usersFilter input[name=filter_constant_from]').val(),
        'to': $('#usersFilter input[name=filter_constant_to]').val(),
    };
    filter.constant = constant;

    //name = $('#usersFilter input[name=filter_name]').val();
    //filter.name = name;
    first_name = $('#usersFilter input[name=filter_first_name]').val();
    filter.first_name = first_name;
    surname_name = $('#usersFilter input[name=filter_surname_name]').val();
    filter.surname_name = surname_name;

    ref = $('#usersFilter input[name=filter_ref]').val();
    filter.ref = ref;

    bday = {
        'from': $('#usersFilter input[name=bday_from]').val(),
        'to': $('#usersFilter input[name=bday_to]').val(),
    };
    filter.bday = bday;

    last_activity = {
        'from': $('#usersFilter input[name=filter_last_activity_from]').val(),
        'to': $('#usersFilter input[name=filter_last_activity_to]').val(),
    };
    filter.last_activity = last_activity;

    status_contact = [];
    $('#usersFilter input[name=filter_status_contact]:checked').each(function (i, elem) {
        status_contact.push($(elem).val());
    });
    filter.status_contact = status_contact;

    direction = [];
    $('#usersFilter input[name=filter_direction]:checked').each(function (i, elem) {
        direction.push($(elem).val());
    });
    filter.direction = direction;

    expirience = [];
    $('#usersFilter input[name=filter_expirience]:checked').each(function (i, elem) {
        expirience.push($(elem).val());
    });
    filter.expirience = expirience;

    traffics = [];
    $('#usersFilter input[name=filter_traffics]:checked').each(function (i, elem) {
        traffics.push($(elem).val());
    });
    filter.traffics = traffics;

    email_confirm = [];
    $('#usersFilter input[name=filter_email_confirm]:checked').each(function (i, elem) {
        email_confirm.push($(elem).val());
    });
    filter.email_confirm = email_confirm;

    communication = [];
    $('#usersFilter input[name=filter_communication]:checked').each(function (i, elem) {
        communication.push($(elem).val());
    });
    filter.communication = communication;

    // filter.status_contact = '';
    filter.loginstatus = '';

    return filter;
}

function loadDefaultFilter() {
    defaultFilter = loadFilter();
    return defaultFilter;
}

function usersFilterApply() {
    loadFilter();
    table.fnReloadAjax();
}

function showButtonExcel(totalCount) {
    return true;

    var button = $('#buttonExcel');
    button.show();

    if (totalCount > limitExcel) {
        button.prop("disabled", true);

    } else {
        button.prop("disabled", false);
    }

    button.attr('data-toggle', 'tooltip');
    button.attr('title', 'Лимит на выгрузку ' + limitExcel + '. Сейчас ' + totalCount);
}

function usersFilterReset() {
    access = defaultFilter.access;
    setDefaultCheck('filter_access', defaultFilter.access);
    status_contact = defaultFilter.status_contact;
    //нет его
    active_access = defaultFilter.active_access;
    setDefaultCheck('filter_active_access', defaultFilter.active_access);
    tarif = defaultFilter.tarif;
    setDefaultCheck('filter_tarif', defaultFilter.tarif);
    regtime = defaultFilter.regtime;
    setDefaultInput('reg');
    tarifend = defaultFilter.tarifend;
    setDefaultInput('end');
    audit = defaultFilter.audit;
    setDefaultCheck('filter_target_audience', defaultFilter.audit);
    bday = defaultFilter.bday;
    setDefaultInput('bday');
    paystatus = defaultFilter.paystatus;
    setDefaultCheck('filter_status_pay', defaultFilter.paystatus);
    trial = defaultFilter.trial;
    setDefaultInput('trial');
    loginstatus = defaultFilter.loginstatus;
    //нет его
    fields = defaultFilter.fields;
    setDefaultCheck('filter_show_field', defaultFilter.fields);
    use_trial = defaultFilter.use_trial;
    setDefaultCheck('filter_use_trial', defaultFilter.use_trial);
    extra = defaultFilter.extra;
    setDefaultCheck('filter_extra', defaultFilter.extra);
    manager = defaultFilter.manager;
    $('#usersFilter select').prop('selectedIndex', manager);
    constant = defaultFilter.constant;
    setDefaultInput('filter_constant');
    //name = defaultFilter.name;
    //setDefaultInput('filter_name', 1);
    first_name = defaultFilter.first_name;
    setDefaultInput('filter_first_name', 1);
    surname_name = defaultFilter.surname_name;
    setDefaultInput('filter_surname_name', 1);
    ref = defaultFilter.ref;
    setDefaultInput('filter_ref', 1);
    last_activity = defaultFilter.last_activity;
    setDefaultInput('filter_last_activity');

    direction = defaultFilter.direction;
    setDefaultCheck('filter_direction', defaultFilter.direction);
    expirience = defaultFilter.expirience;
    setDefaultCheck('filter_expirience', defaultFilter.expirience);
    traffics = defaultFilter.traffics;
    setDefaultCheck('filter_traffics', defaultFilter.traffics);

    email_confirm = defaultFilter.email_confirm;
    setDefaultCheck('filter_email_confirm', defaultFilter.email_confirm);
    communication = defaultFilter.communication;
    setDefaultCheck('filter_communication', defaultFilter.communication);

    var oSettings = table.fnSettings();
    oSettings.oPreviousSearch.sSearch = "";

    hideMutableBlock();
    setView();
    table.fnReloadAjax();
}

function setDefaultCheck($nameFilter, $defaultValues) {
    $('input[name=' + $nameFilter + ']').each(function (i, elem) {
        if ($defaultValues.indexOf($(elem).val()) == -1) {
            $(elem).closest('span').removeClass('checked');
            $(elem).prop('checked', false);
        } else {
            $(elem).closest('span').addClass('checked');
            $(elem).prop('checked', true);
        }
    });
}

function setDefaultInput($nameFilter, count) {
    if (!count) {
        $('input[name=' + $nameFilter + '_from]').val('');
        $('input[name=' + $nameFilter + '_to]').val('');
    } else {
        $('input[name=' + $nameFilter + ']').val('');
    }

}

function toExcel() {
    var filter = new loadFilter();
    filter.sSearch = $('#user_all_filter input[type=search]').val();

    var excelColumns = [];
    $('#modalToExcel input[name=excel_show_field]:checked').each(function (i, elem) {
        excelColumns.push($(elem).val());
    });

    if (!excelColumns.length) {
        alert('Отметьте поля для выгрузки!');
        return false
    }
    filter.excelColumns = excelColumns;
    filter.excelAll = $('#modalToExcel input[name=excelAll]:checked').val();
    window.location.href = "/panel/allUsers/report?" + jQuery.param(filter);
}

function changeView(e){
    fields = new Array();
    $("input[name=filter_show_field]:checked").each(function(){
        fields.push($(this).val());
    });

    var status = $(e).prop('checked');
    var id = $(e).val();
    table.fnSetColumnVis(id, status);
}

function changeVisibleBlock(e) {
    var controlClass = $(e).data('control');
    if (controlClass) {
        var status = $(e).prop('checked');
        if (status) {
            $("." + controlClass).show();
        } else {
            $("." + controlClass).hide();
        }
    }
}

function hideMutableBlock() {
    $('input[data-control]:not(:checked)').each(function (i, elem) {
        var controlClass = $(elem).data('control');
        if (controlClass) {
            $("." + controlClass).hide();
        }
    });

    $('input[data-control]:checked').each(function (i, elem) {
        var controlClass = $(elem).data('control');
        if (controlClass) {
            $("." + controlClass).show();
        }
    });
}

function setView() {
    $("input[name=filter_show_field]").each(function () {
        table.fnSetColumnVis($(this).val(), $(this).is(':checked'));
    });
}

function deleteSelected(){
    if( !confirm("Вы действительно хотите удалить выбранных пользователей") ) return false;

    var users = getUserIds();

    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    $.post('/panel/allUsers/mdelete', {'users_id':users}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            table.fnReloadAjax();
        else
            alert("Удалить пользователей не удалось");
    });
}

function stopSelected(e = false){
    if( !confirm("Вы действительно хотите приостановить выбранных пользователей") ) return false;

    var users = getUserIds();

    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    $.post('/panel/allUsers/stoped', {'users_id':users, 'lock':e}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            table.fnReloadAjax();
            alert("Результат:\n" + answer.msg);
        }
        else{
            alert("Приостановить пользователей не удалось:\n" + answer.msg);
        }
    });
}

function startSelected(e = false){
    if( !confirm("Вы действительно хотите активировать выбранных пользователей") ) return false;

    var users = getUserIds();

    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    $.post('/panel/allUsers/started', {'users_id':users, 'lock':e}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            table.fnReloadAjax();
            alert("Результат:\n" + answer.msg);
        }
        else {
            alert("Приостановить пользователей не удалось:\n" + answer.msg);
        }
    });
}

function openPopup(id){
    var users = getUserIds();
    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    if( id == 'AddCountDays' )
        $(".popup-win a.btn-success").attr('onclick', 'addCountDays();');
    else if( id == 'SetCategories' )
        $(".popup-win a.btn-success").attr('onclick', 'setUserCategory();');

    $(".popup-win #" + id).show();
    $(".popup-win").show();
}

function addCountDays(){
    var users = getUserIds();
    var dCount = $("#dcount").val();

    $.post('/panel/allUsers/dayadd', {'users_id':users,'count':dCount}, function (result){
        closePopap();
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            table.fnReloadAjax();
            alert("Дни успешно добавлены");
        }
        else
            alert("Неудачная попытка");
    });
}

function setUserCategory(){
    var users = getUserIds();
    var cat = $("#category").val();

    $.post('/panel/allUsers/setcategory', {'users_id':users,'category':cat}, function (result){
        closePopap();
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            table.fnReloadAjax();
        else
            alert("Установить категорию не удалось");
    });
}

function getUserIds(){
    var users = new Array();
    $("#user_all .userSelector:checked").each(function(){
        var id = this.id.substring(5);
        users.push(id);
    });

    return users;
}

function selectAll(checked){
    var chb = $(".userSelector");
    chb.each(function(){
        $(this).prop('checked', checked);
    });
}

function trialAccess(){
    if( !confirm("Вы действительно хотите предоставить пробный доступ для выбранных пользователей") ) return false;

    var users = getUserIds();

    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    $.post('/panel/allUsers/trialaccess', {'users_id':users}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            if( answer.secureTrial !== false ){
                $('#disorderModal .modal-body').html(answer.secureTrial);
                $('#disorderModal').removeClass('hide').addClass('in').attr('aria-hidden', 'false').show();
            }else{
                table.fnReloadAjax();
                alert("Действие выполнено успешно");
            }
        }
        else
            alert("Предоставить пробный доступ не удалось");
    });
}

function settrialAccess(){
    if( !confirm("Вы действительно хотите предоставить пробный доступ правонарушителям?") ) return false;

    var users = getUserIds();

    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    $.post('/panel/allUsers/trialaccess', {'users_id':users,'setall':1}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            closeReloadUserTabs(true);
            table.fnReloadAjax();
            alert("Действие выполнено успешно");
        }
        else
            alert("Предоставить пробный доступ не удалось");
    });
}

function closeReloadUserTabs(none){
    $('#disorderModal').hide();
    if(!none){
        table.fnReloadAjax();
        alert("Действие выполнено успешно");
    }
    return true;
}




/* User card block */
function sendMainImage(id)
{
    var fd = new FormData();
    fd.append('img', $('#imgFile')[0].files[0]);

    if( $('#imgFile')[0].files[0] != '' )
    {
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/panel/profile/upload/id/' + id,
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                if( data.status == 'success' )
                {
                    $( "#userImg" ).attr( "src", data.data );
                }
                else if( data.status == 'fail' )
                    alert( data.err );
            }
        });
    }
}

function selectInteraction(){
    $("#Users_tarif_id").on( "change", function(){

        var res = $("#Users_tarif_id option:selected").val();
        getRole( res );
    });
    eq = $("#Users_tarif_id").val();
    getRole( eq );
}

function getRole( eq ){
    if( eq == "1" )
    {
        $("#Users_role").val("free");
    }
    else if( eq == "2" )
    {
        $("#Users_role").val("arbitrazhnik");
    }
    else if( eq == "3" )
    {
        $("#Users_role").val("arbitrazhnik_pro");
    }
    else
    {
        return false;
    }
}

function showUserReferal(id){
    var table = $( '#user-referal' ).dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        'iDisplayLength': 10,
        "aLengthMenu": [[5, 10], [5,10]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
            {
                "bVisible" : false,
                "aTargets": [ 0 ]
            }],
        "sAjaxSource": "/panel/referals/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "id", "value": id }
            );
        },
        "fnDrawCallback":function(){
            if ( $('#user-referal_paginate ul li').size() - 2) {
                $('#user-referal_paginate').parent().css('display', 'block');
            }else{
                $('#user-referal_paginate').parent().css('display', 'none');
            }
        },
        /*'fnInitComplete': function() {
         if ($(this).find('tbody tr').length<1) {
         $(".referalProgram").hide();
         }
         },*/
        "fnRowCallback":function( nRow, aData, status){
            $(".referalProgram").show();
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#ref_all tbody').on('click', 'tr', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();

        if(res.status != 'error')
        {
            window.open( '/panel/referals/view/id/'+res[0], "_blank" );
        } else {
            alert('Невозможно посмотреть проекты пользователя');
        }
    });

    //table.fnReloadAjax();
}

function showUserFreeze(id){
    var table = $( '#log_freeze' ).dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        'iDisplayLength': -1,
        "aLengthMenu": [[5,10], [5,10]],
        "bServerSide": true,
        // "bProcessing": true,
        // "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
            {"mDataProp": "id", "bVisible":false },
            {"mDataProp":"locked"},
            {"mDataProp":"unlocked"},
            {"mDataProp":"action_id"},
            {"mDataProp":"manager"},
        ],
        // "aoColumnDefs": [
        //     {
        //         "bVisible" : false,
        //         "aTargets": [ 0 ]
        //     }],
        "sAjaxSource": "/panel/profile/freezelog",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "id", "value": id }
            );
        },
        "fnDrawCallback":function(){
            if ( $('#log_freeze_paginate ul li').size() - 2) {
                $('#log_freeze_paginate').parent().css('display', 'block');
            }else{
                $('#log_freeze_paginate').parent().css('display', 'none');
            }
        },
        /*'fnInitComplete': function() {
         if ($(this).find('tbody tr').length<1) {
         $(".referalProgram").hide();
         }
         },*/
        "fnRowCallback":function( nRow, aData, status){
            $(".logFreeze").show();
        },
        "deferRender": true,
        "bDestroy": true
    });

    // $('#ref_all tbody').on('click', 'tr', function(){
    //     var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
    //     var res = table.DataTable().row( val ).data();

    //     if(res.status != 'error')
    //     {
    //         window.open( '/panel/referals/view/id/'+res[0], "_blank" );
    //     } else {
    //         alert('Невозможно посмотреть проекты пользователя');
    //     }
    // });

    //table.fnReloadAjax();
}

function allPaymentUser( access, id ){
    var table = $('#all_payments').dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        "aoColumns": [
            /*{ "mDataProp": "id", "bVisible":false },*/
            { "mDataProp": "create" },
            { "mDataProp": "tarif" },
            { "mDataProp": "promo" },
            { "mDataProp": "discount" },
            { "mDataProp": "currency" },
            { "mDataProp": "cost" },
            { "mDataProp": "period" },
            { "mDataProp": "purse" },
            { "mDataProp": "pay_system" },
            { "mDataProp": "status" },
        ],
        "bFilter": false,
        'iDisplayLength': 10,
        "aaSorting": [[ 1, "desc" ]],
        "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "sAjaxSource": "/panel/allPayment/show",
        "fnServerData" : function(sSource, aoData, fnCallback) {
            aoData.push({
                "uid" : id,
                "userstat":1
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });

        },
        "fnRowCallback":function( nRow, aData, status){
            /*var del = '';
             if(access==1) del = '<span class="right tools hiden"><i class="icon-trash"></i></span>';
             $('td:eq(9)', nRow).html(aData.status+del);

             $('td:eq(0), td:eq(1), td:eq(2), td:eq(3), td:eq(4), td:eq(5), td:eq(6), td:eq(7),td:eq(8), td:eq(9), td:eq(10)', nRow).addClass("event")    */
        },
        "footerCallback": function ( row, data, start, end, display ) {
            $(".paymentStats").show();

            var api = this.api(), data;

            var intVal = function ( i ) {
                return typeof i === 'string' ?
                i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            data = api.column( 5, { page: 'current'} ).data();
            pageTotal = data.length ?
                data.reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                } ) :
                0;

            $( api.column( 5 ).footer() ).html(
                '$'+ Number( pageTotal ).toFixed(0)
            );

            data = api.column( 5, { page: 'current'} ).data();
            pageTotal = data.length ?
                data.reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                } ) :
                0;

            /*$( api.column( 7 ).footer() ).html(
             Number( pageTotal ).toFixed(0)
             );*/
        },
        "fnDrawCallback":function(){
            if ( $('#all_payments_paginate ul li').size() - 2) {
                $('#all_payments_paginate').parent().css('display', 'block');
            }else{
                $('#all_payments_paginate').parent().css('display', 'none');
            }
        },
        "bDestroy": true
    });

    /*$('#all_payments tbody').on('click', '.event', function(){
     var val = $( '#all_payments' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
     var res = $( '#all_payments' ).DataTable().row( val ).data();
     window.open( "/panel/allPayment/card/id/" + res.id , "_blank" );
     });

     $('#all_payments').on('click', 'i', function(){
     var val = $( '#all_payments' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
     var res = $( '#all_payments' ).DataTable().row( val ).data();

     url = "/panel/allPayment/delete";
     if( confirm( "Вы действительно хотите удалить эту запись?" ) )
     {
     deleteById( res.id, url, table );
     }
     else
     {
     return false;
     }
     });*/
}

function showUserLogAction(){
    var table = $( '#log_actions' ).dataTable({
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
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
            { "mDataProp": "date" },
            { "mDataProp": "ip" },
            { "mDataProp": "geo" },
            { "mDataProp": "browser" },
            { "mDataProp": "os" },
            { "mDataProp": "action" },
        ],
        "sAjaxSource": "/panel/profile/logaction",
        "fnServerParams": function (aoData) {
            var from = $(".logActions input[name=log_from]").val();
            var to = $(".logActions input[name=log_to]").val();
            aoData.push(
                { "name":"id","value":cid},
                { "name":"from","value":from},
                { "name":"to","value":to}
            );
        },
        "fnDrawCallback":function(){
            if ( $('#log_actions_paginate ul li').size() - 2) {
                $('#log_actions_paginate').parent().css('display', 'block');
            }else{
                $('#log_actions_paginate').parent().css('display', 'none');
            }
        },
        /*'fnInitComplete': function() {
         if ($(this).find('tbody tr').length<=1) {
         $(".logActions").hide();
         }
         },*/
        "fnRowCallback":function( nRow, aData, status){
            $('td:eq(0)', nRow).html( showDatetime( aData.date ) );

            if( aData.browser != "" )
                $('td:eq(3)', nRow).html( aData.browser+"<span><img class='browsers_ico' src='"+getImageByBrowser( aData.browser )+"'><span>" );
            else
                $('td:eq(3)', nRow).html( aData.browser );

            if( aData.os!= "" )
                $('td:eq(4)', nRow).html( aData.os+"<span><img class='browsers_ico' src='"+getImageByOs( aData.os )+"'><span>" );
            else
                $('td:eq(5)', nRow).html( aData.os );

        },
        "deferRender": true,
        "bDestroy": true
    });
}

function showUserContacts(){
    var table = $( '#contacts_history' ).dataTable({
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
        "bProcessing": true,
        "aaSorting": [[ 1, "desc" ]],
        "aoColumns": [
            {"mDataProp":"id"},
            {"mDataProp":"date"},
            {"mDataProp":"title"},
            {"mDataProp":"category"},
            {"mDataProp":"chanel"},
            {"mDataProp":"status"},
            {"mDataProp":"cnext"},
            {"mDataProp":"panel"},
            {"mDataProp":"manager"},
            {"mDataProp":"comment"},
        ],
        "aoColumnDefs": [{
            "bVisible" : false,
            "aTargets": [ 0 ]
        },{
            'bSortable': false, 'aTargets': [ 6 ]
        }],
        "sAjaxSource": "/panel/profile/contacts",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name":"id","value":cid}
            );
        },
        "fnDrawCallback":function(){
            if ( $('#contacts_history_paginate ul li').size() - 3) {
                $('#contacts_history_paginate').parent().css('display', 'block');
            }else{
                $('#contacts_history_paginate').parent().css('display', 'none');
            }
        },
        /*'fnInitComplete': function() {
         if ($(this).find('tbody tr').length<=1) {
         $(".logActions").hide();
         }
         },*/
        "fnRowCallback":function( nRow, aData, status){
            $('td:eq(0)', nRow).html( showDatetime( aData.date ) );
            $('td:eq(5)', nRow).html( showDatetime( aData.cnext ) );

            if( aData.status == 0 )
                $('td:eq(4)', nRow).html( '<span class="label label-success">Новая</span>' );
            else if( aData.status == 1 )
                $('td:eq(4)', nRow).html( '<span class="label label-warning">Ожидаем ответа</span>' );
            else if( aData.status == 2 )
                $('td:eq(4)', nRow).html( '<span class="label label-inverse">Решена</span>' );

            $('td:eq(6)', nRow).html( '<a href="/panel/profile/viewcontact/id/'+aData.id+'" target="_blank" class="circle-button btn-primary"><i class="icon-ok"></i></a>'+
                '<a href="javascript:void(0);" onclick="deleteContact('+aData.id+');" class="circle-button btn-success"><i class="icon-minus"></i></a>'+
                '<a href="javascript:void(0);" onclick="changeContact('+aData.id+');" class="circle-button btn-inverse"><i class="icon-edit"></i></a>' );
        },
        "deferRender": true,
        "bDestroy": true
    });
}

function getNewContactsForm(id){
    $.post('/panel/profile/newcontact', {'user_id':cid,'id':id}, function (result){
        if( result != '' ){
            $(".popup-win .add-template").html(result);
            $(".popup-win").show();
        }
    });
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
            showUserContacts();
        }
        else
            alert("Ошибка при добавлении контакта");
    });
}

function deleteContact(id){
    if( !confirm("Вы действительно хотите удалить контакт") ) return false;

    $.post('/panel/profile/delcontact', {'cid':id}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            showUserContacts();
        else
            alert("Удалить контакт не удалось");
    });
}

function changeContact(id){
    getNewContactsForm(id);
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
            alert("ошибка при переходе к рассылке");
    });
}

function sendUsersNotify(id){
    if( typeof id != 'undefined' ){
        var users = new Array();
        users.push(id);
    }else
        var users = getUserIds();

    if( users.length == 0 ){
        alert("Выберите пользователей");
        return false;
    }

    if( !confirm("Вы действительно хотите отправить уведомления выбранным пользователям?") ) return false;

    $.post('/panel/mnot/addusers', {'users':users}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            document.location.href = "/panel/mnot";
        else
            alert("ошибка при переходе к рассылке");
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

function changeActive( type, uid ){
    var skype = ( type == 'skype' ) ? 'skp' : '';
    var icq = ( type == 'icq' ) ? 'icq' : '';
    var status = $('img.contacts').attr('src');
    var arr = status.split("/");
    var cnt = status.split("/").length;
    var last = arr[cnt-1];
    var active = (last.indexOf("on") != -1) ? "off" : "on";
    var res = ( skype != "" ) ? skype+active+".jpg" : icq+active+".gif";
    $.ajax({
        type: "POST",
        url: "/panel/profile/changeActive",
        data: "id="+uid+"&status="+active,
        success: function( data ){
            var result = $.parseJSON( data );
            if( result.log == 'success' )
                $('img.contacts').attr('src', "/images/admin/contacts/"+res);
        }
    });
}

function unbindSocAccAdmin(soc, uid){
    function onSuccess(result){
        if( result.status ){
            document.location.href = '/panel/profile/'+uid;
        }
    }

    $.ajax({
        url: '/ulogin/unbind',
        type: 'POST',
        data: {'soc':soc, 'uid':uid},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function editSocAccAdmin(soc, uid, identity){
    function onSuccess(result){
        if( result.status ){
            document.location.href = '/panel/profile/'+uid;
        }
    }

    $.ajax({
        url: '/ulogin/editadmin',
        type: 'POST',
        data: {'soc':soc, 'uid':uid, 'identity':identity},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function addSocAccAdmin(soc, uid, identity){
    console.log(soc, uid, identity);
    function onSuccess(result){
        if( result.status ){
            document.location.href = '/panel/profile/'+uid;
        }
    }

    $.ajax({
        url: '/ulogin/addadmin',
        type: 'POST',
        data: {'soc':soc, 'uid':uid, 'identity':identity},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function showManagers(mode){
    if (mode) {
        $('.js-moveUserBtn').hide();
        $('#managerList').show();
    } else {
        if (!confirm('Вы уверены что хотитие перенести пользователей?')) {
            $('#managerList option:first-child').prop('selected', true);
            return false;
        }
        var users = getUserIds();
        if (users.length == 0) {
            alert('Выберите пользователей.');
            return false;
        }
        var params = {
            'ids': users,
            'manager_id': $('#managerList').val()
        };
        $.post('/panel/allUsers/moveUsers', params, function (result){
            var answer = $.parseJSON(result);
            if (typeof answer.success != 'undefined' && answer.success === true) {
                $('.js-moveUserBtn').show();
                $('#managerList').hide();
                table.fnReloadAjax();
            } else {
                alert("Не удалось изменить менеджера");
            }
            $('#managerList option:first-child').prop('selected', true);
        });
    }
}

function openModalEditComment(id) {
    $.post('/panel/allUsers/getComment', {id: id}, function (html) {
        var inputComment = $('#editComment .modal-body #inputComment');
        inputComment.val(html);
        inputComment.data('id', id);
        $('#editComment').modal('show');
    });
}

function editComment() {
    var inputComment = $('#editComment .modal-body #inputComment');
    var id = inputComment.data('id');
    var comment = inputComment.val();

    $.post('/panel/allUsers/editComment', {id: id, comment: comment}, function (result) {
        if (result === 'ok') {
            $('#editComment').modal('hide');
            table.fnReloadAjax();
        } else {
            alert("Не удалось изменить коммент");
        }
    });
}

function openModalExcel() {
    $('#modalToExcel').modal('show');
}

function controlUseTrialNo(e) {
    var status;
    if (!e) {
        status = $('input#filter_access_2').prop('checked');
    } else {
        status = $(e).prop('checked');
    }

    var input = $('input#filter_use_trial_0');
    var div = $('#uniform-filter_use_trial_0');

    input.prop("disabled", status);
    if (status) {
        div.addClass('disabled');
    } else {
        div.removeClass('disabled');
    }
}

function uncheckedAccess() {
    var elem = $('#filter_access_2');
    elem.closest('span').removeClass('checked');
    elem.prop('checked', false);
}





function changeCatId () {
    var catId = $('#cat_id').val();
    $('.js-eTriggerHide').hide();
    $('#eTriggerList_'+catId).show();
};

function addTasks () {
    var params = $('#addTask form').serialize();
    $.post('/panel/managers/saveTask', params, function (result) {
        console.log(result);

        /*if (result === 'ok') {
            $('#editComment').modal('hide');
            table.fnReloadAjax();
        } else {
            alert("Не удалось изменить коммент");
        }*/
    });
};

function openAddTaskModal () {
    var users = getUserIds();
    if (users.length == 0) {
        alert('Выберите пользователей');
        return false;
    }
    $('#user_ids').val(users.join(','));
    $.post('/panel/managers/getEmailLink', {'users':users}, function (data) {
        var result = $.parseJSON(data);
        if (typeof result.success != 'undefined' && result.success) {
            $('.js-emilTaskBlock').html(result.block);
            $('#addTask').modal('show');
        }
    });
};

function changeCommunicationStatus(e, id){
    var status = ($(e).prop('checked') ? 1 : 0);
    $.post('/panel/allUsers/community', {'id':id,'status':status}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            return true;
        else
            alert("ошибка при изменении статуса");
    });
}