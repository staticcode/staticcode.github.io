var tableTasks, utasks, category, tstatus, deadtime, calendarPos = 0;
var period;

function openbox(id){
    display = document.getElementById(id).style.display;
       document.getElementById(id).style.display='block';
}

function hideBlock( block )
{
    block.animate({opacity: 1.0}, 5000).fadeOut("slow");
}

function closedbox(id){
    display = document.getElementById(id).style.display;
       document.getElementById(id).style.display='none';
}

function showDay( datetime ){
    var mon = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября','ноября','декабря'];
    var date = new Date( (datetime+'000')*1 );
    date.setDate(date.getDate());
    var msg = date.getDate() + " "+ mon[date.getMonth()]+" "+date.getFullYear();
    return msg;
}

function showDatetime( datetime ){
    var mon = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября','ноября','декабря'];
    var date = new Date( (datetime+'000')*1 );
    date.setDate(date.getDate());
    minutes = date.getMinutes();
    hours = date.getHours();
    hour  = hours > 9 ? hours : '0' + hours;
    min = minutes > 9 ? minutes : '0' + minutes;
    var msg = date.getDate() + " "+ mon[date.getMonth()]+" "+date.getFullYear()+" "+hour+":"+min;
    return msg;
}

String.prototype.translit = (function(){
    var L = {
'А':'A','а':'a','Б':'B','б':'b','В':'V','в':'v','Г':'G','г':'g',
'Д':'D','д':'d','Е':'E','е':'e','Ё':'Yo','ё':'yo','Ж':'Zh','ж':'zh',
'З':'Z','з':'z','И':'I','и':'i','Й':'Y','й':'y','К':'K','к':'k',
'Л':'L','л':'l','М':'M','м':'m','Н':'N','н':'n','О':'O','о':'o',
'П':'P','п':'p','Р':'R','р':'r','С':'S','с':'s','Т':'T','т':'t',
'У':'U','у':'u','Ф':'F','ф':'f','Х':'Kh','х':'kh','Ц':'Ts','ц':'ts',
'Ч':'Ch','ч':'ch','Ш':'Sh','ш':'sh','Щ':'Sch','щ':'sch','Ъ':'"','ъ':'"',
'Ы':'Y','ы':'y','Ь':"'",'ь':"'",'Э':'E','э':'e','Ю':'Yu','ю':'yu',
'Я':'Ya','я':'ya',' ':'-' 
        },
        r = '',
        k;
    for (k in L) r += k;
    r = new RegExp('[' + r + ']', 'g');
    k = function(a){
        return a in L ? L[a] : '';
    };
    return function(){
        return this.replace(r, k);
    };
})();

function selectInteraction()
{
    $("#Users_tarif_id").on( "change", function(){
        
        var res = $("#Users_tarif_id option:selected").val();
        getRole( res );
    });
    eq = $("#Users_tarif_id").val();
    getRole( eq );
} 


function getRole( eq )
{
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

function baseName( url )
{
    
    ( $.isArray( url ) ) ? parts = url[0].split('/') : parts = url.split('/');;
    return parts[ parts.length-1 ];
}

function openUser( user ){
    document.location.href = "/panel/users/view/id/" + user;
}

function getUserId(){
    var params = window.location.pathname.split('/');
    return params[params.length-1]; 
}

function searchStrTeasernet(){
    var search = $("#search-string").val();
    $.post('/panel/teaserStats/',{'search':search},function(result){
        statsTeaserPager();
    });
}

function addUser(){
    $(".add-string").css("display","block");
}

function statsTeaserPager(){
    $(".widget-body").html('<img src="/images/admin/Sun.gif" class="preloader">');
    $.post('/panel/teaserStats/show',function(result){
        $(".widget-body").html(result);
    });

}

function comebackData( id, url )
{
    $.ajax({
        'url': url,
        type: 'POST',
        data: { "id": id },
        dataType: 'json',
        cache: false,
        'success':function( data )
        {
            var plus = data.aaData[0].plus;
            var minus = data.aaData[0].minus;
            $('.plus').val( plus );
            $('.minus').val( minus );
        }
    });
}

function showPassForm(){
    $(".personalChangePassForm").toggleClass('show');
}
$(document).click(function(e) {
    if ($('.personalChangePass').has(e.target).length === 0) {
        $(".personalChangePassForm").removeClass('show');
    }
});

function illegalChar(value){
    var arr = ["script", "<", ">", ";", "(", ")", "alert", "console"];
    var error = [];
    /*console.log(value.indexOf(arr[1]));*/
    $.each( arr, function(v, k){
        if(value.indexOf(k) != -1)
            error[v] = k;
    });
    /*console.log(error);*/
    if(error.length > 0)
        return true;
    
    return false;
}

function showPass(obj, newpas){

    var newpas = (!newpas) ? '' : 'new';
    var cl = (!newpas) ? 'Old' : 'New';
    var $tag = obj.siblings(".change-field-pass"+newpas).children('input');
    
    var type = $tag.attr('type');
    var value = $tag.val();
        
    if(illegalChar(value) == true)
    {
        var block = $(".changeNo");
        block.text("Введены запрещенные символы").css({"display":"block"});
        hideBlock( block );
        return false;
    } 
        
    
    if( type=='password' && value!='' )
        $(".change-field-pass"+newpas).html('<input id="password'+cl+'" type="text" value="' + value + '">');
        
    if( type=='text' && value!='' )
        $(".change-field-pass"+newpas).html('<input id="password'+cl+'" type="password" value="' + value + '">');
    
    return false;
    
}

function showNewPass(){
    var pass = $("#passwordNew").val();
    if( pass != '' )
    {
        if( $("#passwordNew").attr('type') == 'password' ){
            $(".change-field-pass-new").html('<input id="passwordNew" type="text" value="' + pass + '" name="password">');
        }else{
            $(".change-field-pass-new").html('<input id="passwordNew" type="password" value="' + pass + '" name="password">');
        }
}   }


function statsSocialPager(){
    $("#social-list-stat").html('<img src="/images/admin/Sun.gif" class="preloader">');
    $.post('/panel/socialStats/show',function(result){
        $("#social-list-stat").html(result);
    });
}

function showTeaserByGeo( geo ){
    //$(".widget-body").html('<img src="/images/admin/Sun.gif" class="preloader">');
    $.post('/panel/teaserStats/show', {'geo':geo}, function(result){
        $(".widget-body").html(result);
    });
}

function showSocialByGeo( geo ){
    $("#social-list-stat").html(' Загрузка ... ');
    $.post('/panel/socialStats/show', {'geo':geo}, function(result){
        $("#social-list-stat").html(result);
    });
}

function changeDate( date ){
    $('#span6 option:first').attr('selected', 'selected');
    var geo;
    showTeaserStatsTable( date, geo);
    
}

function changeSocialDate( date ){
    
    $('#listname_soc option:first').attr('selected', 'selected');
    var geo;
    showSocialStatsTable( date, geo);
}


function addNewUser(){
    
    var photo = $('#avatar').attr('src');
    ( photo!='/images/admin/profile-pic.jpg' ) ? photo : photo="";
    var email = $("#email").val();
    var name = $("#us_name").val();
    var sname = $("#us_surname").val();
    var pass = $("#pass").val();
    var role = $("#sel-role").val();
    var tarif = $("#sel-tarif").val();
    var end_date = $("#datepicker").val();
    var skype = $("#skype").val();
    var icq = $("#icq").val();
    var reports = Number($("#reports").prop("checked"));
    var spam = Number($("#spam").prop("checked"));
    
    if( email == '' || pass == '' || role == '' || tarif == '' || end_date == '' ){
        alert("не все данные заполненны!");
        return false;
    }

    $.ajax({
        url: '/panel/allusers/add',
        type: 'POST',
        data: {"email":email,"pass":pass,"role":role,"tarif":tarif,"end_date":end_date,'name':name, 'sname':sname, 'skype':skype, 'icq':icq, 'spam':spam, 'reports':reports, 'photo':photo},
        dataType: 'json',
        cache: false
    });
}


function changeTarifend( id ){
    var end = $("#datepicker").val();

    if( end == '' ){
        alert("Введите конечную дату!");
        return false;
    }

    function onSuccess(result){
    }

    $.ajax({
        url: '/panel/users/tarifend',
        type: 'POST',
        data: {"end":end,"id":id},
        dataType: 'json',
        success: onSuccess,
        cache: false
    }); 
}

function showTeaserStatsTable( date, geo ){

    var table = $('#sample_1').dataTable({
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
          { "mDataProp": "teasernet" },
          { "mDataProp": "new" },
          { "mDataProp": "old" },
          { "mDataProp": "company" },              
        ],
        "sAjaxSource": "/panel/teaserStats/show",
        "fnServerData" : function(sSource, aoData, fnCallback) {
            aoData.push({
                "geo" : geo,
                "date" : date,
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
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
 
            data = api.column( 1 ).data();
            total = data.length ?
                data.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            data = api.column( 1, { page: 'current'} ).data();
            pageTotal = data.length ?
                data.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;

            data1 = api.column( 2 ).data();
            total1 = data1.length ?
                data1.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            data1 = api.column( 2, { page: 'current'} ).data();
            pageTotal1 = data1.length ?
                data1.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;

            data2 = api.column( 3 ).data();
            total2 = data1.length ?
                data2.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            data2 = api.column( 3, { page: 'current'} ).data();
            pageTotal2 = data2.length ?
                data2.reduce( function (a, b) {
                        return intVal(a) + intVal(b);
                } ) :
                0;
 
            $( api.column( 1 ).footer() ).html(
                Number( pageTotal ).toFixed(0) +' ( '+ Number( total ).toFixed(0) +' total)'
            );

            $( api.column( 2 ).footer() ).html(
                Number( pageTotal1 ).toFixed(0) +' ( '+ Number( total1 ).toFixed(0) +' total)'
            );
            
            $( api.column( 3 ).footer() ).html(
                Number( pageTotal2 ).toFixed(0) +' ( '+ Number( total2 ).toFixed(0) +' total)'
            );
        },
        "bDestroy": true
       
    });
}

function showSocialStatsTable( date, geo ){

    var table = $('#sample_2').dataTable({
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
          { "mDataProp": "sn_name" },
          { "mDataProp": "new" },
          { "mDataProp": "old" },
          { "mDataProp": "acc" },
        ],
        "sAjaxSource": "/panel/socialStats/show",
        "fnServerData" : function(sSource, aoData, fnCallback) {
            aoData.push({
                "geo" : geo,
                "date" : date,
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "bDestroy": true
       
    });
}

function showLogsTable(srch){
    var table = $( '#logsActions' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id" },
          { "mDataProp": "time" },
          { "mDataProp": "email" },
          { "mDataProp": "user" },
          { "mDataProp": "ip" },
          { "mDataProp": "geo" },
          { "mDataProp": "country_code" },
          { "mDataProp": "city" },
          { "mDataProp": "browser" },
          { "mDataProp": "os" },
          { "mDataProp": "action" },    
        ],
        "oSearch": {
            "sSearch": ( typeof srch != 'undefined' ? srch : '' )
        },
        "aaSorting": [[ 1, "desc" ]],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 2, 3, 5, 6 ]
        },
        {   "bVisible" : false,
            "aTargets": [ 0, 5 ]
        }
        ],
        "sAjaxSource": "/panel/logAction/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"date","value": $('#datepicker').val()
                },
                {"name":"action","value": $("#user_action").val()
                },
                {"name":"geo","value": $("#user_geo").val()
                }
            );
        },
        "fnDrawCallback":function(){
            if ( $('#logsActions_paginate ul li').size() - 2) {
                $('#logsActions_paginate').parent().css('display', 'block');
            }else{
                $('#logsActions_paginate').parent().css('display', 'none');
            }
        },
        "fnRowCallback":function( nRow, aData, status)
        {
            //$('td:eq(0)', nRow).html( showDatetime( aData.time ) );
            /*$('td:eq(1)', nRow).html( aData.email );
            $('td:eq(2)', nRow).html( aData.user );
            $('td:eq(3)', nRow).html( aData.ip );
            $('td:eq(8)', nRow).html( aData.action );*/

            //if( aData.geo != "" )
                //$('td:eq(4)', nRow).html( aData.geo+"<span><img style='float:right' src='"+getImgByGeo( aData.country_code )+"'><span>" );

            if( aData.browser != "" )
                $('td:eq(6)', nRow).html( aData.browser+"<span><img class='browsers_ico' src='"+getImageByBrowser( aData.browser )+"'><span>" );

            if( aData.os != "" )
                $('td:eq(7)', nRow).html( aData.os+"<span><img class='browsers_ico' src='"+getImageByOs( aData.os )+"'><span>" );



            /*$('td:eq(0)', nRow).html( showDatetime( aData[1] ) );
            if( aData[6] != "" )
            {
                $('td:eq(3)', nRow).html( aData[4]+"<span><img class='browsers_ico' src='"+getImgByGeo( aData[6] )+"'><span>" );
            }
            else
            {
                $('td:eq(3)', nRow).html( aData[4] );
            }

            if( aData[7] != "" )
            {
                $('td:eq(5)', nRow).html( aData[7]+"<span><img class='browsers_ico' src='"+getImageByBrowser( aData[7] )+"'><span>" );
            }
            else
            {
                $('td:eq(5)', nRow).html( aData[7] );
            }

            if( aData[8]!= "" )
            {
                $('td:eq(6)', nRow).html( aData[8]+"<span><img class='browsers_ico' src='"+getImageByOs( aData[8] )+"'><span>" );
            }
            else
            {
                $('td:eq(6)', nRow).html( aData[8] );
            }*/
        },
        "deferRender": true,
        "bDestroy": true
    });
    //table.fnReloadAjax();
}

function showSecureLog( date, action, geo ){
    var date = ( date == 'undefined--undefined' ) ? "" : date;
    var action;
    var geo;
    var table = $( '#secure_tab' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id" },
          { "mDataProp": "date" },
          { "mDataProp": "email" },
          { "mDataProp": "user" },
          { "mDataProp": "ip" },
          { "mDataProp": "resolution" },
          { "mDataProp": "java" },
          { "mDataProp": "login_time" },
          { "mDataProp": "status" },
        ],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 2, 3 ]
        },
        {   "bVisible" : false,
            "aTargets": [ 0 ]
        }
        ],
        "sAjaxSource": "/panel/security/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "date", "value": date },
                { "name": "action", "value": action },
                { "name": "geo", "value": geo }
            );
        },
        "fnRowCallback":function( nRow, aData, status)
        {
            if( aData.email != "" && aData.email != null )
                $('td:eq(1)', nRow).html( '<a target="_blank" href="/panel/security/view/id/'+aData.id+'">'+aData.email+'<span>' );

            if( aData.ip > 0 )
                $('td:eq(3)', nRow).html( '<a target="_blank" href="/panel/security/viewparam/id/'+aData.id+'/param/ip">'+aData.ip+'<span>' );

            if( aData.resolution > 0 )
                $('td:eq(4)', nRow).html( '<a target="_blank" href="/panel/security/viewparam/id/'+aData.id+'/param/resolution">'+aData.resolution+'<span>' );

            if( aData.java > 0 )
                $('td:eq(5)', nRow).html( '<a target="_blank" href="/panel/security/viewparam/id/'+aData.id+'/param/java">'+aData.java+'<span>' );

            /*if( aData.login_time > 0 )
                $('td:eq(6)', nRow).html( '<a target="_blank" href="/panel/security/viewparam/id/'+aData.id+'/param/login_time">'+aData.login_time+'<span>' );*/
        },
        "deferRender": true,
        "bDestroy": true
    });
    //table.fnReloadAjax();
}

function showSecureLogView( id ){
    var date = ( date == 'undefined--undefined' ) ? "" : date;
    var action;
    var geo;
    var table = $( '#sample_3' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 1, "desc" ]],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 2, 3, 5, 6 ]
        },
        {   "bVisible" : false,
            "aTargets": [ 0 ]
        }
        ],
        "sAjaxSource": "/panel/security/vshow/id/" + id,
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "date", "value": date },
                { "name": "action", "value": action },
                { "name": "geo", "value": geo }
            );
        },
         "fnRowCallback":function( nRow, aData, status)
        {
            //$('td:eq(0)', nRow).html( showDatetime( aData[1] ) );
            if( aData[6] != "" )
            {
                $('td:eq(3)', nRow).html( aData[4]+"<span><img class='browsers_ico' src='"+getImgByGeo( aData[6] )+"'><span>" );
            }
            else
            {
                $('td:eq(3)', nRow).html( aData[4] );
            }

            if( aData[7] != "" )
            {
                $('td:eq(6)', nRow).html( aData[7]+"<span><img class='browsers_ico' src='"+getImageByBrowser( aData[7] )+"'><span>" );
            }
            else
            {
                $('td:eq(6)', nRow).html( aData[7] );
            }

            if( aData[8]!= "" )
            {
                $('td:eq(7)', nRow).html( aData[8]+"<span><img class='browsers_ico' src='"+getImageByOs( aData[8] )+"'><span>" );
            }
            else
            {
                $('td:eq(7)', nRow).html( aData[8] );
            }
        },
        "deferRender": true,
        "bDestroy": true
    });
    //table.fnReloadAjax();
}

function showLogUserTable( action, geo ){

    ( action == 'undefined' ) ? action="" : action;
    ( geo == 'undefined' ) ? geo="" : geo;
    
    var table = $('#log_user').dataTable({
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
          { "mDataProp": "time" },
          { "mDataProp": "user" },
          { "mDataProp": "ip" },
          { "mDataProp": "geo" },
          { "mDataProp": "browser" },
          { "mDataProp": "os" },
          { "mDataProp": "action" },    
        ],
        "aaSorting": [[ 0, "desc" ]],
        "sAjaxSource": "/panel/logAction/show/",
        "fnServerData" : function(sSource, aoData, fnCallback) {
            aoData.push({
                "id" : getUserId(),
                "action" : action,
                "geo" : geo
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "fnRowCallback":function( nRow, aData, status)
        {
            /*console.log(aData);*/

            $('td:eq(0)', nRow).html( showDatetime( aData.time ) );
            if( aData.geo != "" )
            {
                $('td:eq(2)', nRow).html( aData.ip+"<span><img style='float:right' src='"+getImgByGeo( aData.country_code )+"'><span>" );
            }
            else
            {
                $('td:eq(2)', nRow).html( aData.ip );
            }

            if( aData.browser != "" )
            {
                $('td:eq(4)', nRow).html( aData.browser+"<span><img class='browsers_ico' src='"+getImageByBrowser( aData.browser )+"'><span>" );
            }
            else
            {
                $('td:eq(4)', nRow).html( aData.browser );
            }

            if( aData.os!= "" )
            {
                $('td:eq(5)', nRow).html( aData.os+"<span><img class='browsers_ico' src='"+getImageByOs( aData.os )+"'><span>" );
            }
            else
            {
                $('td:eq(5)', nRow).html( aData.os );
            }
            
        },
        "bDestroy": true
       
    });
    
}





function changeLogsDate( date ){
    var geo;
    $('#user_geo option:first, #user_action option:first').attr('selected', 'selected');
    showLogsTable( date );
}

function convertDate( dateText )
{
    if( typeof(dateText) !== 'undefined'){
        var q = dateText.split('/');
        date = q[2]+"-"+q[0]+"-"+q[1];
        return date;
    }else{
        return;
    }
}

/*function getFullDate( time )
{
    time1 = parseInt( time+"000" );
    date = new Date( time1 );
    year = date.getFullYear();
    month = date.getMonth();
    day = date.getDay();
    hour = date.getHours();
    min = date.getMinutes();
    sec = date.getSeconds();
    fullDate = day+"-"+month+"-"+year+" "+hour+":"+min;
    return fullDate;
}   */



function allPaymentUser( access, id )
{
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
          { "mDataProp": "id", "bVisible":false },
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
        'iDisplayLength': 50,
        "aaSorting": [[ 0, "desc" ]],
        "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "sAjaxSource": "/panel/allPayment/show",
        "fnServerData" : function(sSource, aoData, fnCallback) 
        {
            aoData.push({
                "uid" : id,
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
         "fnRowCallback":function( nRow, aData, status)
        {
            //$('td:eq(0)', nRow).html( showDatetime( aData.create ) );
            var del = '';
            if(access==1) del = '<span class="right tools hiden"><i class="icon-trash"></i></span>';
                $('td:eq(9)', nRow).html(aData.status+del);

            $('td:eq(0), td:eq(1), td:eq(2), td:eq(3), td:eq(4), td:eq(5), td:eq(6), td:eq(7),td:eq(8), td:eq(9), td:eq(10)', nRow).addClass("event")    
        },
        "bDestroy": true
    });

    $('#all_payments tbody').on('click', '.event', function(){
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
    });
   
}

function showFaqTable( status, cat_id )
{
    var status;
    var cat_id;
    
    var table = $(' #faq_table ').dataTable({
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
        "aaSorting": [[ 1, "desc" ]],
        "aoColumns": [
            { "mDataProp": "id", "bVisible":false, "sClass":"event"},
            { "mDataProp": "date" , sWidth: '10%'},
            { "mDataProp": "priority"},
            { "mDataProp": "question" , sWidth: '50%'},
            { "mDataProp": "category" , sWidth: '25%'},
            { "mDataProp": "active"},
        ],
        "sAjaxSource": "/panel/faq/show",

        "fnServerParams": function (aoData) {
            aoData.push(
                {"name":"status","value":status},
                {"name":"cat_id","value":cat_id}
            );
        },
        /*"fnServerData" : function( sSource, aoData, fnCallback ) 
        {
            aoData.push({
                "status" : status,
                "cat_id" : cat_id
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },*/
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            
            if( aData.active == "0" ){
                $('td:eq(4)', nRow).html( 'Черновик<span onclick="deFaqRow('+aData.id+')" class="right tools hiden" id='+aData.id+'><i class="icon-trash"></i></span>' );
            }else if( aData.active ){
                $('td:eq(4)', nRow).html( 'Открыта<span onclick="deFaqRow('+aData.id+')" class="right tools hiden" id='+aData.id+'><i class="icon-trash"></i></span>' );
            }
            $('td:eq(0)', nRow).html( showDay( aData.date ) );
            $('td:eq(0), td:eq(1), td:eq(2), td:eq(3)', nRow).removeClass( "event" );
            $('td:eq(0), td:eq(1), td:eq(2), td:eq(3)', nRow).addClass( "event" );
        },
        "bDestroy": true
    });

    /*$('#faq_table tbody').on('click', 'span',function () {
        if( confirm("Вы действительно хотите удалить эту запись?") ){
            $.ajax({
              type: "POST",
              url: "/panel/faq/delete",
              data: {'id':$(this).context.id},
              success: function(){
                  $(' #faq_table ').dataTable().fnReloadAjax();
              }
            });
        }
    });

    $('#faq_table tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        //alert(1);
        window.open('/panel/faq/updateFaq/id/'+res.id, '_blank');
        // location.replace( '/panel/faq/updateFaq/id/'+res.id );
    });*/


}

function delFaqRow(id) {
    if( confirm("Вы действительно хотите удалить эту запись?") ){
        $.ajax({
          type: "POST",
          url: "/panel/faq/delete",
          data: {'id':id},
          success: function(){
              $(' #faq_table ').dataTable().fnReloadAjax();
          }
        });
    }
}

function showFaqCatTable( status )
{
    var status;
    
    var table = $(' #faq_cat ').dataTable({
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
        "aaSorting": [[ 1, "asc" ]],
        "aoColumns": [
            { "mDataProp": "id", "bVisible":false},
            { "mDataProp": "priority"},
            { "mDataProp": "name" , sWidth: '40%'},
            { "mDataProp": "url" , sWidth: '50%'},
            { "mDataProp": "active"},
        ],
        
        "sAjaxSource": "/panel/faq/category",
        "fnServerData" : function( sSource, aoData, fnCallback ) 
        {
            aoData.push({
                "status" : status,
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            if( aData.active == "0" ){
                $('td:eq(3)', nRow).html( 'Черновик<span onclick="deFaqCatRow('+aData.id+')" class="right tools hiden" id='+aData.id+'><i class="icon-trash"></i></span>' );
            }else if( aData.active ){
                $('td:eq(3)', nRow).html( 'Открыта<span  onclick="deFaqCatRow('+aData.id+')" class="right tools hiden" id='+aData.id+'><i class="icon-trash"></i></span>' );
            }
            $('td:eq(0), td:eq(1), td:eq(2)', nRow).addClass( "event" );
        },
        "bDestroy": true
    });

    /*$('#faq_cat tbody').on('click', 'span',function () {
        if( confirm("Вы действительно хотите удалить эту запись?") ){
            $.ajax({
              type: "POST",
              url: "/panel/faq/deleteCat",
              data: {'id':$(this).context.id},
              success: function(){
                  $(' #faq_cat ').dataTable().fnReloadAjax();
              }
            });
        }
    });

    $('#faq_cat tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        // alert(1);
        window.open('/panel/faq/updateCat/id/'+res.id);
        // location.replace( '/panel/faq/updateFaq/id/'+res.id );
    });*/
}

function deFaqCatRow(id) {
    if( confirm("Вы действительно хотите удалить эту запись?") ){
        $.ajax({
          type: "POST",
          url: "/panel/faq/deleteCat",
          data: {'id':id},
          success: function(){
              $(' #faq_cat ').dataTable().fnReloadAjax();
          }
        });
    }
}

function showPromoCodes( tarif )
{
    var tarif;
    
    table = $('#promo_codes').dataTable({
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
        "aaSorting": [[ 1, "desc" ]],
        "aoColumns": [
            { "mDataProp" : "id", 'bVisible': false },
            { "mDataProp" : "check" },
            { "mDataProp" : "range", sWidth: '18%', "sClass":"event"},
            { "mDataProp" : "tarifs", "sClass":"event"},
            { "mDataProp" : "discount","sClass":"event"},
            { "mDataProp" : "day_add","sClass":"event"},
            { "mDataProp" : "promo","sClass":"event"},
            { "mDataProp" : "comment","sClass":"event"},
            { "mDataProp" : "limit", "sClass":"event"},
            { "mDataProp" : "status",
            "mRender": function (data, type, full)
            {
                if (data == "1") {
                    checked = '<input type="checkbox" class="check_promo" checked="checked" />  Активен <i class="icon-trash right promo-trash"></i>';
                    return checked;
                } else {
                    unchecked = '<input type="checkbox" class="check_promo" />  Не активен <i class="icon-trash right promo-trash"></i>';
                    return unchecked;
                }
            }
            },
        ],
        "sAjaxSource": "/panel/promoCodes/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) 
        {
            aoData.push({
                "filter" : tarif,
                'period': period
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            if (aData.status == "1") {
                res = '<input type="checkbox" class="check_promo" checked="checked" />  Активен <span class="right tools hiden"></span>';
            } else {
                res = '<input type="checkbox" class="check_promo" />  Не активен <span class="right tools hiden"></span>';
            }
            $('td:eq(8)', nRow).html( res );
        },
        "fnDrawCallback": function( oSettings ) {
            $('.check_promo').uniform();
        },
        "bDestroy": true
    });



    $('#promo_codes tbody').on('click', 'input.check_promo', function () {
        
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        ( res.status == 1) ? status = 0 : status = 1;
        
        $.ajax({
            type: "POST",
            url: "/panel/promoCodes/checkedpromo",
            data: {'id':res.id, 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });
                
    });

    $('#promo_codes tbody').on('click', '.event', function () {
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        /*console.log( res );*/
        if(res){document.location.href='/panel/promoCodes/update/id/'+res.id;}
    });
 
}

function setPromoFilter(){
    period = {
        'first': $('input[name=period_from]').val(),
        'last': $('input[name=period_to]').val(),
    };
    table.fnReloadAjax();
}

function showTicketBlock( res )
{
    $.ajax({
        type: "POST",
        data: { 'ticket':res },
        url: "/panel/tickets/showdialog",
        success: function( data ){
            data = $.parseJSON( data );
            
            $('.timeline-messages').html(''); 
            $.each( data.ticket_msg , function( i, val )
            {
                var rait = "";
                var msg_class;
                var file;
                ( val.user_role == 'manager' || val.user_role == 'admin' ||  val.user_role == 'superadmin' ) ? msg_class = 'admin-message' : msg_class = 'user-message';
                if( val.file == '' ){
                    file = "";                    
                }else{
                    if( val.file.length <= 1 )
                    {
                        file='<p class="filename">Прикрепленный файл: <a href="'+val.file+'" target="_blank">'+baseName(val.file)+'</a></p>';
                    }else{
                        var application = [];
                        application.push( '<p class="filename">Прикрепленные файлы: ' ); 
                        for(var i=0; i<val.file.length; i++)
                        {
                            application.push( '<a href="'+val.file[i]+'" target="_blank">'+baseName(val.file[i])+'</a>' );
                        }
                        application.push( '</p>' );
                        file = application.join(" ");
                        
                    }
                }
                $('.timeline-messages').append( '<div class="msg-time-chat '+msg_class+'"><div class="message-body msg-out"><div class="text"><p>'+val.message+'</p>'+file+'<p class="ch-date"><span class="rait" style="display:none;">Рейтинг: '+val.rating+' | </span>'+val.date_add+'</p></div></div></div>' );
                ( data.admin_role == 'superadmin' ) ? $('.rait').css({'display':'inline'}) : "";
            });
            
            /*height=$("#h_scroll").offset().top;
            $(".ch-scroll").animate({"scrollTop":20000},1000);*/
        }
    });
}

function showUserData( res )
{
    var user_id = ( res.user_id == undefined ) ? "" : res.user_id;
    $.ajax({
        type: "POST",
        data: {'id':user_id},
        url: "/panel/tickets/viewuser",
        success: function( data ){
            data = $.parseJSON( data );
            var titleName = ( data.name != '' ||  data.surname != '') ? data.name+' '+data.surname : data.email;
            $( '.usr-inf>.name' ).text( data.name );
            $( '.usr-inf>.surname' ).text( data.surname );
            $( '.title_name' ).html( "<a href='/panel/profile/"+user_id+"'>"+titleName+"</a>" );
            $( '.usr-inf>.country' ).text( data.country );
            $( '.usr-inf>.tarif' ).text( data.tarif+' ('+data.duration+')' );
            $( '.usr-inf>.tarifend' ).text( data.end );
            $( '.avatar' ).attr( 'src', data.avatar ).parent().attr({
                'href': "/panel/profile/"+user_id,
            });
        }
    });
}

function showTicketTable( st, search )
{
    var st = st || '';
    var search = search || '';

    var table = $('#tickets_table').dataTable({
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
        'bFilter':false,
        "aaSorting": [[6 , "desc" ]],
        "aoColumns": [
          { "mDataProp": "st_class", "bVisible":false},
          { "mDataProp": "user_id", "bVisible":false },
          { "mDataProp": "id"},
          { "mDataProp": "user" },
          { "mDataProp": "thems" },
          { "mDataProp": "created" },
          { "mDataProp": "updated" },
          { "mDataProp": "cnt" },
          { "mDataProp": "active" },
        ],
        "sAjaxSource": "/panel/tickets/show",
        "fnServerData" : function(sSource, aoData, fnCallback) {
            aoData.push({
                "status" : st,
                "search" : search,
            });
            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {   
            $('td:eq(3)', nRow).html( '<span>'+showDatetime(aData.created)+'</span>' );
            $('td:eq(4)', nRow).html( '<span>'+showDatetime(aData.updated)+'</span>' );
            $('td:eq(6)', nRow).html( '<span class="label '+aData.st_class+'">'+aData.active+'</span>' );
            $('td:eq(1)', nRow).html( "<a href='javascript:void(0)'>"+( ( aData.user ) ? aData.user : "" )+"</a>" );
            var arr = ['Ожидаем ответа', 'Новый', 'Решена'];
            var cl_sel = ['label-warning', 'label-success', 'label'];
            var cl_ticketStatus = aData.active == arr[0] ? cl_sel[0] : aData.active == arr[1] ? cl_sel[1] : aData.active == arr[2] ? cl_sel[2] : '';
            var select = "<select class='input-medium " + cl_ticketStatus + "'>";
            $.each( arr, function( index, val ){
                var res = ( val == aData.active ) ? 'selected' : '';
                select += "<option "+res+" value='"+index+"' class='"+cl_sel[index]+"'>"+val+"</option>";
            });
            select += "</select>";
            $('td:eq(6)', nRow).html(select);
        },
        "fnInitComplete" : function()
        {
            showUserTickets();
        },
        "bDestroy": true
       
    });

    $('#tickets_table tbody').on('click', 'tr', function(){
        
        var val = $( '#tickets_table' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#tickets_table' ).DataTable().row( val ).data();
        
        if( res.id != "" &&  res.user_id != "" )
        {
            $('.t_id').val( res.id );
            $('#user-card').css({'display':'block'});
            showUserData( res );
            showTicketBlock( res.id );
        }else{
            $('#user-card').css({'display':'none'});
        }
       
    });

    $('#tickets_table tbody').on('change', 'select', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        /*console.log(res);*/
        $.ajax({
            "dataType":"json",
            "type" : "POST",
            "url" : '/panel/tickets/changeStatus',
            "data" : {'ticket_id':res.id,'status':$(this).context.value},
            "success" : function(data){
                if(typeof data.log != "undefined" && data.log == "success")
                    table.fnReloadAjax();
            }
        });
    });
}

function ticketCreate( ticket_id, msg, img )
{
    $.ajax({
        type: "POST",
        url: "/panel/tickets/create",
        data: { 't_id':ticket_id, 'msg':msg, 'img':img },
        success: function( data, status ){
            showTicketBlock( ticket_id );
            $("textarea").val("");
            $(".img_field").remove();
        }
    });
}

function deletePost( id , table)
{
       $.ajax({
            type: "POST",
            url: "/panel/posts/delete",
            data: { 'id': id},
            success: function( res, status ){
                var obj = $.parseJSON( res );
                ( obj.log == 'success' ) ? table.dataTable().fnReloadAjax() : false;
            }
        });
     
}

function showPostsTable( status )
{
    var status;
    
    var table = $( '#posts_table' ).dataTable({
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
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id" },
          { "mDataProp": "date", "sClass": "event" },
          { "mDataProp": "title", "sClass": "event" },
          { "mDataProp": "cat", "sClass": "event" },
          { "mDataProp": "subcat", "sClass": "event" },
          { "mDataProp": "hits", "sClass": "event" },
          { "mDataProp": "comment", "sClass": "event" },
          { "mDataProp": "status", "sWidth":"10%"},
        ],
        "sAjaxSource": "/panel/posts/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) {
            aoData.push({
                "status" : status,
            });
            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(6)', nRow).html( aData.status+'<span class="right tools hiden" id='+aData.id+'><i class="icon-trash"></i></span>' );
        },
        "bDestroy": true
       
    });

    $('#posts_table tbody').on('click', 'i', function(){
        
        var val = $( '#posts_table' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#posts_table' ).DataTable().row( val ).data();
        url = "/panel/posts/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?") )
            deleteById( res.id, url, table )
        else
            return false;
        //confirm( "Вы действительно хотите удалить эту запись" ) ? deletePost( res.id, table ) : false;
    });

     $('#posts_table tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        location.replace( '/panel/posts/update/id/'+res.id );
        
    });


}

function sendImage(module)
{
    var fd = new FormData();
    fd.append('img', $('#imgFile')[0].files[0]);
    module = module || 'posts';
    if( $('#imgFile')[0].files[0] != '' )
    {
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/panel/'+module+'/upload',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                if( data.status == 'success' )
                {
                    $( "#res_msg" ).html( 'Файл загружен' ).css( {"color":"green",'display':'block'} );
                    $( ".controls img" ).attr( "src", data.data ).css({'display':'block'});
                    $( ".attach_image" ).text("Изменить файл (.jpg .png .gif)")
                    $( ".delete_img" ).css('display','block');
                    $( "#img_name" ).val( data.data );
                }
                else if( data.status == 'fail' )
                    $("#res_msg").html( data.err ).css( "color", "red" );
            },
            error: function(data) {
                if( typeof data.status !== "undefined" && data.status == 'fail' )
                    $("#res_msg").html( data.err ).css( "color", "red" );
            }
        });
    }
}

function deleteImg(type)
{
    type = type || false;
    
    if(type) 
        $(".controls img").attr("src", "/images/admin/profile-pic.jpg");
    else
        $(".controls img").attr("src", "").css({'display':'none'});

    $( "#res_msg" ).css( "display", "none" );
    $(".delete_img").css('display','none');
    $( "#img_name" ).val("");
    $( ".attach_image" ).text("Прикрепить файл (.jpg .png .gif)");
}

function openUpload()
{
    $("#imgFile").click();
}

function resetPostFields()
{
    $('input[type="text"]').each(function( key, val ){
        val.value = "";
    });
    $('input[type="checkbox"]').each(function( key, val ){
        val.value = 0;
    });
    CKEDITOR.instances['editor1'].setData('');
    if( CKEDITOR.instances['editor2'] )
        CKEDITOR.instances['editor2'].setData('');
    $('textarea').each(function( key, val ){
        val.value = "";
    });
    $( "#img_name" ).val('');
    $('.controls img').attr('src','').css({'display':'none'});
    $( "#res_msg" ).html('');
    $( ".attach_image" ).text("Прикрепить файл (.jpg .png .gif)");
}

function postPreview()
{
    var date = new Date();
    time = date.getTime()
    var title = $('#BlogPosts_title').val();
    var url = $('#BlogPosts_url').val();
    var category = $('#cat option:selected').val();
    var descr = CKEDITOR.instances['editor1'].getData();
    var text = CKEDITOR.instances['editor2'].getData();
    var seo_titles = $( '#BlogPosts_seo_title' ).val();
    var seo_descr = $( '#desc_field' ).val();
    var keywords = $( '#key_field' ).val();
    var active = ( $('.checker span').hasClass('checked') ? 1 : 0 );
    var image = $( "#img_name" ).val();
    var time = time.toString().substring(0,10);

    var res = { 'preview' : true,
                'title' : title,
                'url' : url,
                'category' : category,
                'descr' : descr,
                'text' : text,
                'seo_titles' : seo_titles,
                'seo_descr' : seo_descr,
                'keywords' : keywords,
                'active' : active,
                'time' : time,
                'image' : image
              };
    $.ajax({
        type: 'POST',
        url: '/panel/posts/preview',
        data: res
    });

}

function faqPreview()
{
    var date = new Date();
    time = date.getTime()
    var time = time.toString().substring(0,10);
    var chosens = $('.span12 option:selected').val();
    var question = CKEDITOR.instances['editor1'].getData();
    var answer = CKEDITOR.instances['editor2'].getData();
    
    var res = { 'preview' : true,
                'time' : time,
                'chosens' : chosens,
                'question' : question,
                'answer' : answer
               }
    $.ajax({
        type: 'POST',
        url: '/panel/faq/preview',
        data: res
    });

}

function faqCatPreview()
{
    var title = CKEDITOR.instances['editor1'].getData();
    var description = CKEDITOR.instances['editor2'].getData();
    var url = $('#FaqCategories_url').val();
    
    var res = { 'preview' : true,
                'title' : title,
                'description' : description,
                'url' : url,
                
               }
    
    $.ajax({
        type: 'POST',
        url: '/panel/faq/catPreview',
        data: res
    });
}

function deleteById( id, url, table ){
    $.ajax({
            'type': "POST",
            'url': url,
            'data': { 'id': id },
            success: function( res, status ){
                var obj = $.parseJSON( res );
                ( obj.log == 'success' ) ? table.fnReloadAjax() : false;
            }
        });
}

function showPostsCatTable( status )
{
    var status;
    
    var table = $( '#blog_cat' ).dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: "
        },
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id", "bVisible" : false },
          { "mDataProp": "name" },
          { "mDataProp": "subcat" },
          { "mDataProp": "url" },
          { "mDataProp": "status"},
          { "mDataProp": "empty", "sWidth":"15%" },
        ],
        "aoColumnDefs": [
            { 'bSortable': false, 'aTargets': [ 2, 5 ] }
        ],
        "sAjaxSource": "/panel/blogCat/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) {
            aoData.push({
                "status" : status,
            });
            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            /*console.log(aData);*/
            var subcat = '';
            if(aData.subcat !== '')
            {
                var res = new Array();
                $.each(aData.subcat, function(k, v){
                    res[k] = '<span id="sub_'+k+'" class="badge badge-success"><span class="show_sub">'+v+'</span><img src="/images/feature_no.png" class="delete_subcat"/></span>';
                });
                subcat = res.join(' ');
            }

            $('td:eq(1)', nRow).html(subcat);
            $('td:eq(4)', nRow).html('<button class="btn btn-primary create_sub">+ Подкатегория</button>  <button class="btn btn-danger delete_tbl">Удалить</button>' );
            $('td:eq(0)', nRow).addClass("event");
        },
        "bDestroy": true
       
    });

    $('#blog_cat tbody').on('click', 'img.delete_subcat', function(){
        var parBlId = $(this).parent('span').attr('id');

        if(confirm("Вы действительно хотите удалить подкатегорию?"))
        {
            $.ajax({
                cache: false,
                type: 'POST',
                url: '/panel/blogCat/delete',
                dataType: 'json',
                data: {'id':parBlId.split('_')[1], 'sub':true },
                'success':function( data )
                {
                    if(data.log == 'success')
                        table.fnReloadAjax();
                    else
                        alert("Ошибка удаления");
                }
            });
        }
    });

    $('#blog_cat tbody').on('click', 'span.show_sub', function(){
        var parBlId = $(this).parent('span').attr('id').split('_');
        location.replace( '/panel/blogCat/updsubcat/id/'+parBlId[1] );
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/panel/blogCat/delete',
            dataType: 'json',
            data: {'id':parBlId.split('_')[1], 'sub':true },
            'success':function( data )
            {
                if(data.log == 'success')
                    table.fnReloadAjax();
                else
                    alert("Ошибка удаления");
            }
        });
    });

    $('#blog_cat tbody').on('click', 'button.create_sub', function(){
        var val = $( '#blog_cat' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#blog_cat' ).DataTable().row( val ).data();
        location.replace( '/panel/blogCat/crtsubcat/cat/'+res.id );
    });

    $('#blog_cat tbody').on('click', '.event', function(){
        var val = $( '#blog_cat' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#blog_cat' ).DataTable().row( val ).data();
        location.replace( '/panel/blogCat/update/id/'+res.id );
    });

    $('#blog_cat tbody').on('click', '.delete_tbl', function(){
        var val = $( '#blog_cat' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#blog_cat' ).DataTable().row( val ).data();
        url = "/panel/blogCat/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
            deleteById( res.id, url, table )
        else
            return false;
    });
}

function showPostsCommentsTable( status, date )
{
    var status;
    var date;

    var table = $( '#blog_comments' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: "
        },
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        /*{
            "bSortable": false,
            "aTargets": [ 4 ]
        },*/
        {   
            "bVisible" : false,
            "aTargets": [ 0 ]
        }
        ],
        "sAjaxSource": "/panel/blogComments/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "date", "value": date },
                { "name": "status", "value": status }
            );
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            if( aData[4] == "Добавлен")
            {
                $('td:eq(3)', nRow).html( aData[4]+' <div class="right" style="width:30px; height:30px; text-align:right;"><span class="tools"><a href=""><i class="icon-trash"></i></a></span></div><span class="right"></span>' );
            }
            else if( aData[4] == "На модерации" )
            {
                $('td:eq(3)', nRow).html( aData[4]+' <div class="right" style="width:30px; height:30px; text-align:right;"><span class="tools"><a href="javascript:void(0)"><i class="icon-trash"></i></a></span></div><span class="right"><a href="javascript:void(0)" class="add">Добавить</a><strong></span>');
            }
            $('td:eq(0), td:eq(1), td:eq(2)', nRow).addClass("event");
        },
        "deferRender": true,
        "bDestroy": true
    });
    

    $('#blog_comments tbody').on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        url = "/panel/blogComments/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?") )
            deleteById( res[0], url, table )
        else
            return false;
    });

    $('#blog_comments tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        window.open( "/panel/blogComments/view/id/" + res[0] , "_blank" );
    });

    $('#blog_comments tbody').on('click', 'a', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        type = $(this).context.className;
        
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/panel/blogComments/checkComment/id/'+res[0],
            data: {'id':res[0] },
            'success':function( data )
            {
                table.fnReloadAjax();
            }
        });
    });
}


function showStats( date )
{
    var date;

    $.ajax({
        cache: false,
        type: 'POST',
        url: '/panel/default/stats',
        data: {'date':date},
        'success':function( data ){
            var obj = $.parseJSON( data );
            changeKnobStats( obj );
            $( '.count_users' ).text( ( obj.data.users == 0 ) ? obj.data.users : '+'+obj.data.users );
            $( '.count_payments' ).text( obj.data.payments+"$"  );
            $( '.count_tickets' ).text( ( obj.data.tickets == 0 ) ? obj.data.tickets : '+'+obj.data.tickets );
            $( '.count_posts' ).text( obj.data.posts );
            $( '.count_nonpay' ).text( obj.data.nonpay );
            $( '.count_tasks' ).text( obj.data.tasks );
        }
    });
}

function changeKnobStats( obj )
{
    $('.stats_users').val( calculateStats( obj.data.users , 'users' ) ).trigger('change');
    $('.stats_payments').val( calculateStats( obj.data.payments , 'payments' ) ).trigger('change');
    $('.stats_tickets').val( calculateStats( obj.data.tickets , 'tickets' ) ).trigger('change');
    $('.stats_posts').val( calculateStats( obj.data.posts , 'posts' ) ).trigger('change');
    $('.stats_nonpay').val( calculateStats( obj.data.nonpay , 'nonpay' ) ).trigger('change');
    $('.stats_tasks').val( calculateStats( obj.data.tasks , 'tasks' ) ).trigger('change');
}

function calculateStats( cnt, type )
{
    switch ( type ) {
        case "users":
            return ( cnt*100 )/30;
            break;
        case "payments":
            return ( cnt*100 )/1000;
            break;
        case "tickets":
            return ( cnt*100 )/10;
            break;
        case "posts":
            return ( cnt*100 )/1;
            break;
        case "nonpay":
            return cnt * 5;
            break;
        case "tasks":
            return cnt * 2;
            break;
        default:
            return false;
    }

}

function showLimitUserTable()
{
    var table = $( '#user_all_limit' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        
        "bServerSide": true,
        "bProcessing": false,
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [1, 2, 3, 4 ],
        },
        { "bVisible":false, "aTargets" : [0] },
        ],
        "sAjaxSource": "/panel/allUsers/showLimit",
        /*"fnRowCallback":function( nRow, aData, status)
        {
        },*/
        "deferRender": true,
        "bDestroy": true
    });

    $('#user_all_limit tbody').on('click', 'tr', function(){
        var val = $( '#user_all_limit' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#user_all_limit' ).DataTable().row( val ).data();
        window.open( "/panel/profile/" + res[0] , "_blank" );
    });
}

function showLimitPaymentTable(){
    var limit = true;

    var table = $('#payment_all_limit').dataTable({
            "oLanguage": {
                "oPaginate": {
                    "sPrevious": "Prev",
                    "sNext": "Next"
                },
                "sSearch":"Поиск: ",
            },
            "bFilter": false,
            "bPaginate": false,
            'iDisplayLength': 10,
            "aLengthMenu": [[5, 10], [5,10]],
            "bServerSide": true,
            "bProcessing": true,
            "aaSorting": [[ 0, "desc" ]],
            "aoColumns": [
              { "mDataProp": "create"},
              { "mDataProp": "name" },
              { "mDataProp": "tarif" },
              { "mDataProp": "cost" },
              { "mDataProp": "period" }
            ],
            /*"aoColumnDefs": [
            {
                "bVisible" : false,
                "aTargets": [ 0 ]
            }],*/
            "sAjaxSource": "/panel/allPayment/show",
            "fnServerParams": function (aoData) {
                aoData.push({
                    "name" : 'limit',
                    "value": limit
                });
                /*aoData.push(
                    { "name": "id", "value": id }
                );*/
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
        
    /*$('#payment_all_limit tbody').on('click', 'tr', function(){
        var val = $( '#payment_all_limit' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#payment_all_limit' ).DataTable().row( val ).data();
        window.open( "/panel/allPayment/card/id/" + res.id , "_blank" );
    });*/
}

/*function showLimitPaymentTable()
{
    var limit = true;
    
    var table = $('#payment_all_limit').dataTable({
        
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: ",
        },
        "aaSorting": [[ 0, "desc" ]],
        "bFilter":false,
        "bPaginate": false,
        "aoColumns": [
          { "mDataProp": "create"},
          { "mDataProp": "name" },
          { "mDataProp": "tarif" },
          { "mDataProp": "cost" },
          { "mDataProp": "period" }
        ],
        "sAjaxSource": "/panel/allPayment/show",
        "fnServerData" : function(sSource, aoData, fnCallback) 
        {
            aoData.push({
                "limit" : limit,
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
         "fnRowCallback":function( nRow, aData, status)
        {
            //$('td:eq(0)', nRow).html( showDatetime( aData.create ) );
        },
        "bDestroy": true
    });
    
    $('#payment_all_limit tbody').on('click', 'tr', function(){
        var val = $( '#payment_all_limit' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#payment_all_limit' ).DataTable().row( val ).data();
        window.open( "/panel/allPayment/card/id/" + res.id , "_blank" );
    });
}*/

function showLimitTicketTable()
{
    var limit = true;
    
    var table = $('#tickets_all_limit').dataTable({
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
        'bFilter':false,
        "aaSorting": [[ 6, "desc" ]],
        "aoColumns": [
          { "mDataProp": "st_class", "bVisible":false},
          { "mDataProp": "user_id", "bVisible":false },
          { "mDataProp": "id", "bVisible":false},
          { "mDataProp": "created" },
          { "mDataProp": "user" },
          { "mDataProp": "thems" },
          { "mDataProp": "updated" },
          { "mDataProp": "cnt" },
          { "mDataProp": "active" },
        ],
        "sAjaxSource": "/panel/tickets/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) {
            aoData.push({
                "limit" : limit,
            });
            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "bPaginate": false,
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {   
            $('td:eq(0)', nRow).html( '<span>'+showDatetime(aData.created)+'</span>' );
            $('td:eq(3)', nRow).html( '<span>'+showDatetime(aData.updated)+'</span>' );
            $('td:eq(5)', nRow).html( '<span class="label '+aData.st_class+'">'+aData.active+'</span>' );
            $('td:eq(1)', nRow).html( "<a href='javascript:void(0)'>"+( ( aData.user ) ? aData.user : "" )+"</a>" );
            $('td:eq(1),td:eq(2)', nRow).addClass('event');            
            var cl_sel = ['label-warning', 'label-success', 'label'];
            var arr = ['Ожидаем ответа', 'Новый', 'Решена'];
            var cl_ticketStatus = aData.active == arr[0] ? cl_sel[0] : aData.active == arr[1] ? cl_sel[1] : aData.active == arr[2] ? cl_sel[2] : '';
            var select = "<select class='input-medium " + cl_ticketStatus + "'>";
            $.each( arr, function( index, val ){
                var res = ( val == aData.active ) ? 'selected' : '';
                select += "<option "+res+" value='"+index+"' class='"+ cl_sel[index] + " ' >"+val+"</option>"
            });
            select += "</select>";
            $('td:eq(5)', nRow).html(select);
        },
        "bDestroy": true
    });

    $('#tickets_all_limit tbody').on('click', '.event', function(){
        var val = $( '#tickets_all_limit' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#tickets_all_limit' ).DataTable().row( val ).data();
        
        $.cookie( "tickets", val, { path: '/panel' } );

        if( res.id != "" &&  res.user_id != "" )
        {
            document.location.href = "/panel/tickets/"
            
        }else{
            return false;
        }
       
    });

    $('#tickets_all_limit tbody').on('change', 'select', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        /*console.log(res);*/
        $.ajax({
            "dataType":"json",
            "type" : "POST",
            "url" : '/panel/tickets/changeStatus',
            "data" : {'ticket_id':res.id,'status':$(this).context.value},
            "success" : function(data){
                if(typeof data.log != "undefined" && data.log == "success")
                    table.fnReloadAjax();
            }
        });
    });

}

function showUserTickets()
{
    var cookies = $.cookie( "tickets" )*1;
    if( cookies != "none" )
    {
        $('#tickets_table tbody tr')[ cookies ].click();
        $.cookie( "tickets", "none", { path: '/panel' } );
    }
}


function showBestTeaserTable( date, geo ){

    var table = $('#teaser_all_limit').dataTable({
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
          { "mDataProp": "teasernet" },
          { "mDataProp": "new" },
          { "mDataProp": "old" },
          { "mDataProp": "company" },              
        ],
        "bFilter":false,
        "bPaginate": false,
        /*"aaSorting": [[ 1, "desc" ]],*/
        "sAjaxSource": "/panel/teaserStats/show",
        "fnServerData" : function( sSource, aoData, fnCallback) {
            aoData.push({
                "geo" : geo,
                "date" : date,
                "limit" : 1
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "bDestroy": true
    });

}

function showLimitSocialStatsTable( date, geo )
{
    var date;
    var geo;

    var table = $('#social_all_limit').dataTable({
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter":false,
        "bPaginate": false,
        "aaSorting": [[ 1, "desc" ]],
        "aoColumns": [
          { "mDataProp": "sn_name" },
          { "mDataProp": "new" },
          { "mDataProp": "old" },
          { "mDataProp": "acc" },
        ],
        "sAjaxSource": "/panel/socialStats/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) {
            aoData.push({
                "geo" : geo,
                "date" : date,
            });

            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
            
        },
        "fnRowCallback":function( nRow, aData, iDisplayIndex )
        {
            ( aData.name == "vk.com" ) ? $('td:eq(0)', nRow ).addClass('ico_vk_m') : false;
            ( aData.name == "odnoklassniki.ru" ) ? $('td:eq(0)', nRow ).addClass('ico_ok_m') : false;
            ( aData.name == "my.mail.ru" ) ? $('td:eq(0)', nRow ).addClass('ico_ml_m') : false;
            ( aData.name == "fb.com" ) ? $('td:eq(0)', nRow ).addClass('ico_fb_m') : false;

        },
        "bDestroy": true
       
    });
}

function hideSpacesTable()
{
    $('#payment_all_limit_wrapper div.row-fluid').css({'display':'none'});
    $('#user_all_limit_wrapper div.row-fluid').css({'display':'none'});
    $('#tickets_all_limit_wrapper div.row-fluid').css({'display':'none'});
    $('#teaser_all_limit_wrapper div.row-fluid').css({'display':'none'});
    $('#social_all_limit_wrapper div.row-fluid').css({'display':'none'});
}


function showAdultwordTable( status )
{
    var status;
    
    var table = $( '#adultword' ).dataTable({
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
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id" },
          { "mDataProp": "plus" },
          { "mDataProp": "minus" },
        ],
        "sAjaxSource": "/panel/adultword/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) {
            aoData.push({
                "status" : status,
            });
            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(2)', nRow).html( aData.minus+'<span class="right tools hiden" id='+aData.id+'><i class="icon-trash"></i></span>' );
            $('td:eq(1)', nRow).addClass('event')
            $('td:eq(0)', nRow).addClass('event')
        },
        "bDestroy": true
       
    });

    $('#adultword').on('click', 'i', function(){
        var val = $( '#adultword' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#adultword' ).DataTable().row( val ).data();
        url = "/panel/adultword/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
            deleteById( res.id, url, table )
        else
            return false;
    });

    $('#adultword tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        location.replace( '/panel/adultword/update/id/'+res.id );
        
    });
}

function showTestAdultTable()
{
    var table = $('#testAdult').dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"

            },
            "sSearch":"Поиск: "
        },
        "aaSorting": [[ 0, "desc" ]],
        "bDestroy": true
    });

    table.on('click', 'i', function(){
        var val = $( '#adultword' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#adultword' ).DataTable().row( val ).data();
    });
}

function showTarifsTable( status )
{
    var status;
    
    var table = $( '#tarifs' ).dataTable({
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
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id" },
          { "mDataProp": "name" },
          { "mDataProp": "price" },
          { "mDataProp": "discount" },
          { "mDataProp": "show" }
        ],
        "sAjaxSource": "/panel/tarifs/show",
        "fnServerData" : function( sSource, aoData, fnCallback ) {
            aoData.push({
                "status" : status,
            });
            $.ajax({
                "dataType":"json",
                "type" : "POST",
                "url" : sSource,
                "data" : aoData[0],
                "success" : fnCallback
            });
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            var st;
            if( aData.show == 1 )
            {
                st = "Открыт";
            }else if( aData.show == 0 ){
                st = "Черновик";
            }else{
                st = aData.show;
            }
            $('td:eq(4)', nRow).html(st+'<span class="right tools hiden" ><i class="icon-trash"></i></span>' );
            $('td:eq(3), td:eq(2), td:eq(1), td:eq(0)', nRow).addClass("event");
        },
        "bDestroy": true
       
    });

    $('#tarifs').on('click', 'i', function(){
        var val = $( '#tarifs' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#tarifs' ).DataTable().row( val ).data();
        url = "/panel/tarifs/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
            deleteById( res.id, url, table )
        else
            return false;
    });
}

function getImgByGeo( geo )
{
    var geo_ip = geo.toLowerCase();
    var o = {};
    o['ua'] = "/images/geo/ua.jpg";
    o['ru'] = "/images/geo/ru.jpg";
    o['kz'] = "/images/geo/kz.jpg";
    o['by'] = "/images/geo/by.jpg";
    if( !o[geo_ip] )
    {
        return "";
    }
    return o[geo_ip];
}

function getImageByOs( os )
{
    os = os.toLowerCase();
    if( os.indexOf( "windows" ) != -1 )
    {
        return "/images/os/windows.jpg";
    }
    else if( os.indexOf( "linux" ) != -1 )
    {
        return "/images/os/linux.jpg";
    }
    else if( os.indexOf( "safari" ) != -1 || os.indexOf( "macintosh" ) != -1 )
    {
        return "/images/os/mac.jpg";
    }
    else if( os.indexOf( "ios" ) != -1 )
    {
        return "/images/os/ios.png";
    }
    else if( os.indexOf( "android" ) != -1 )
    {
        return "/images/os/android.png";
    }
    else
    {
        return "";
    }
}

function getImageByBrowser( browser )
{
    reg1=/([a-zA-Z]*)/g;
    txt=browser.toLowerCase();
    browser = txt.match( reg1 )[0];
    var o = {};
    o['ie'] = "/images/browsers/ie.jpg";
    o['firefox'] = "/images/browsers/FirefoxLogo.gif";
    o['chrome'] = "/images/browsers/chrome.jpg";
    o['safari'] = "/images/browsers/safarilogo.gif";
    o['opera'] = "/images/browsers/operalogo.gif";
    o['amigo'] = "/images/browsers/amigo.jpg";
    o['yandex'] = "/images/browsers/yandex.jpg";
    if( !o[browser] )
    {
        return "";
    }
    return o[browser];
}

function showAllProjectsTable( date, tn )
{
    var date;
    var tn;
    var table = $( '#projects_all' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000], [25, 50, 100, 500 ,1000]],
        "bServerSide": true,
        "bProcessing": true,
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 4 ]
        },
        {   
            "bVisible" : false,
            "aTargets": [ 0 ]
        }
        ],
        "sAjaxSource": "/panel/projectList/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "date", "value": date },
                { "name": "tnet", "value": tn }
            );
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#projects_all tbody').on('click', 'tr', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        if(res.status != 'error')
        {
            window.open( '/projects/show/'+res[0], "_blank" );
        } else {
            alert('Невозможно посмотреть проекты пользователя');
        }
    });
}

function showLoginUserTable()
{
    var status;
    
    var table = $( '#users_login' ).dataTable({
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
        "aLengthMenu": [[25, 50, 100, 500, -1], [25, 50, 100, 500, "All"]],
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
          { "mDataProp": "id", "bVisible":false },
          { "mDataProp": "user" },
          { "mDataProp": "tn" },
          { "mDataProp": "login" },
          { "mDataProp": "password" },
          { "mDataProp": "update" }
        ],
        "sAjaxSource": "/panel/loginUsers/show",
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(4)', nRow).html( showDatetime(aData.update) );
        },
        "bDestroy": true
       
    });
   
}
  
function showAccreqestTable( tn, access, search )
{
    var tn = tn || '';
    var search = search || '';
    var access = access || '';
    
    var table = $( '#accreqest' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        "bInfo"  : false,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 2 ]
        },
        {
            "sWidth" : access?'15%':'10%',
            "aTargets": [ 10 ]
        },
        {
            "sWidth" : '10%',
            "aTargets": [ 8, 6 ]
        },
        {   
            "bVisible" : false,
            "aTargets": [ 1 ]
        }
        ],
        "sAjaxSource": "/panel/accrequest/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "tn", "value": tn },
                { "name": "search", "value": search }
            );
        },
        "fnRowCallback":function( nRow, aData, status)
        {
            var arr = ['Новая', 'В ожидании', 'Принята', 'Отклонен'];
            var select = "<select class='input-medium'>";
            $.each( arr, function( index, val ){
                var res = ( index == aData[10] ) ? 'selected' : '';
                select += "<option "+res+" value='"+index+"'>"+val+"</option>"
            });
            select += "</select>";
            var del="";
            if(access) del = '<span class="right tools hiden" ><i class="icon-trash"></i></span>';
            $('td:eq(9)', nRow).html(select+del);
            $('td:eq(2)', nRow).addClass('updt');
            $('td:eq(7)', nRow).html('<span class="word-break">'+aData[8]+'</span>');
        },
        "deferRender": true,
        "bDestroy": true
    });
    

    $('#accreqest tbody').on('change', 'select', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        
        $.ajax({
            "dataType":"json",
            "type" : "POST",
            "url" : '/panel/accrequest/change',
            "data" : {'val':$(this).context.value,'id_str':res[0]}
        });
        if( $(this).context.value == 2 )
        {
            $('.errorMessage').css({'display':'none'});
            $('input[name=hidden_tn]').val(res[4]);
            $('.form_popup tbody tr').eq(1).children().eq(1).children().val(res[1]);
            $('.form_popup tbody tr').eq(1).css('display','none');
            $('.form_popup tbody tr').eq(2).css('display','none');
            $('.form_popup tbody tr').eq(1).val(res[1]);
            $('.form_popup tbody tr').eq(2).val(res[4]);
            $('.popup, .overlay').css('opacity','1');
            $('.popup, .overlay').css('visibility','visible');
            $('#PasswordManager_login').val(res[3]);
            $('#PasswordManager_uid').val(res[1]);
        }  
    });
    
    $('#accreqest').on('click', 'i', function(){
        var val = $( '#accreqest' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#accreqest' ).DataTable().row( val ).data();
        url = "/panel/accrequest/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });

    $('#accreqest').on('click', '.updt', function(){
        var val = $( '#accreqest' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#accreqest' ).DataTable().row( val ).data();
        
        if(res[0] !== 'undefined')
            window.open( "/panel/accrequest/update/id/"+res[0], "_blank" );
        
    });

    /*table.fnReloadAjax();*/
}

function showTnUserAccsTable( date, tn, access )
{  
    var date;
    var tn;
    var table = $( '#all_tn_accs' ).dataTable({
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bSortable": false,
            "aTargets": [ 4 ]
        },
        {   
            "bVisible" : false,
            "aTargets": [ 0 ]
        }
        ],
        "sAjaxSource": "/panel/tnaccounts/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "date", "value": date },
                { "name": "tnet", "value": tn }
            );
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            var del="";
            if(access) del = '<span class="right tools hiden" ><i class="icon-trash"></i></span>';
            $('td:eq(3)', nRow).html(aData[4]+del);
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#all_tn_accs').on('click', 'i', function(){
        var val = $( '#all_tn_accs' ).dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = $( '#all_tn_accs' ).DataTable().row( val ).data();
        url = "/panel/tnaccounts/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });
}

function showRefUserTable( tarif, date )
{
    var tarif;
    var date;

    var table = $( '#ref_all' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 1, "desc" ]],
        "aoColumnDefs": [{
            "bVisible" : false,
            "aTargets": [ 0 ]
        },{ 
            'bSortable': false,
            'aTargets': [ 0, 3 ]
        }],
        "sAjaxSource": "/panel/referals/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "tarif", "value": tarif },
                { "name": "date", "value": date }
            );
        },
        "deferRender": true,
        "bDestroy": true
    });
    
    $('#ref_all tbody').on('click', 'tr', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        
        if(res.status != 'error' && res[0] != 0)
        {
            window.open( '/panel/referals/view/id/'+res[0], "_blank" );
        } else {
            alert('Невозможно посмотреть проекты пользователя');
        }
    });

    //table.fnReloadAjax();
}

function showParserTable(access,tn)
{
    var tn;
    var table = $( '#parser_all' ).dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aLengthMenu": [[25, 50, 100, 500, 1000, -1], [25, 50, 100, 500 ,1000, "All"]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        { 
            'bSortable': false,
            'aTargets': [ 4 ] }
        ],
        "sAjaxSource": "/panel/parser/show",
        "fnServerParams": function (aoData) {
            aoData.push(
                { "name": "tn", "value": tn }
            );
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            var del="";
            if(access) del = '<span class="right tools hiden" ><i class="icon-trash"></i></span>';
            $('td:eq(4)', nRow).html(aData[5]+del);
            $(' td:eq(0), td:eq(1), td:eq(2), td:eq(3)', nRow).addClass('event');
        },
        "deferRender": true,
        "bDestroy": true
    });
    
    $('#parser_all tbody').on('click', '.event', function(){
        if( !access ) return false;
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        
        if(res.status != 'error')
        {
            window.open( '/panel/parser/update/id/'+res[0], "_blank" );
        } else {
            alert('Невозможно посмотреть проекты пользователя');
        }
    });

    table.on('click', 'i', function(){
        if( !access ) return false;
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        url = "/panel/parser/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });

    table.fnReloadAjax();
}

function showUserReferal(id)
{
    var table = $( '#user-referal' ).dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
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

    table.fnReloadAjax();
}


function showEvents()
{
    var table = $('#bl_events').dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        "aLengthMenu": [[5, 10, 50], [5,10,50]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        { 'bSortable': false, 'aTargets': [ 1, 2, 3, 4] }
        ],
        "sAjaxSource": "/panel/blogEvents/show",
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(2)', nRow).html("<a href='"+aData[3]+"' target='_blank'>событие</a>");
            $('td:eq(0), td:eq(1)', nRow).addClass('event');
            if (aData[4] == "1")
                res = '<input type="checkbox" class="check_status" checked="checked" />  Активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            else
                res = '<input type="checkbox" class="check_status" />  Не активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            
            $('td:eq(3)', nRow).html(res);
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#bl_events tbody').on('click', 'input', function () {
        
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        status = (res[4]==1) ? 0 : 1;
        
        $.ajax({
            type: "POST",
            url: "/panel/blogEvents/setstatus",
            data: {'id':res[0], 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });
                
    });
    
    table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        url = "/panel/blogEvents/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });
    
    $('#bl_events tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        window.open( '/panel/blogEvents/update/id/'+res[0] );
    });
    /*table.fnReloadAjax();*/
}

function showEvents()
{
    var table = $('#bl_events').dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        "aLengthMenu": [[5, 10, 50], [5,10,50]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        { 'bSortable': false, 'aTargets': [ 1, 2, 3, 4] }
        ],
        "sAjaxSource": "/panel/blogEvents/show",
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(2)', nRow).html("<a href='"+aData[3]+"' target='_blank'>событие</a>");
            $('td:eq(0), td:eq(1)', nRow).addClass('event');
            if (aData[4] == "1")
                res = '<input type="checkbox" class="check_status" checked="checked" />  Активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            else
                res = '<input type="checkbox" class="check_status" />  Не активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            
            $('td:eq(3)', nRow).html(res);
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#bl_events tbody').on('click', 'input', function () {
        
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        status = (res[4]==1) ? 0 : 1;
        
        $.ajax({
            type: "POST",
            url: "/panel/blogEvents/setstatus",
            data: {'id':res[0], 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });
                
    });
    
    table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        url = "/panel/blogEvents/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });
    
    $('#bl_events tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        window.open( '/panel/blogEvents/update/id/'+res[0] );
    });
    /*table.fnReloadAjax();*/
}

function showMsgSett(id)
{
    var table = $('#msg_'+id).dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        /*"aLengthMenu": [[5, 10, 50], [5,10,50]],*/
        "bServerSide": true,
        /*"aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        }],*/
        "sAjaxSource": "/panel/mnot/showSett/type/"+id,
        "deferRender": true,
        "bDestroy": true
    });

    /*var table = $('#ad_settings').dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        "aLengthMenu": [[5, 10, 50], [5,10,50]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        { 'bSortable': false, 'aTargets': [ 1, 2, 3, 4, 5, 6, 7] }
        ],
        "sAjaxSource": "/panel/adUnitSettings/show",
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(2)', nRow).html(aData[3]);
            $('td:eq(0), td:eq(1), td:eq(2), td:eq(3)', nRow).addClass('event');
            if (aData[7] == "1")
                res = '<input type="checkbox" class="check_status" checked="checked" />  Активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            else
                res = '<input type="checkbox" class="check_status" />  Не активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            
            $('td:eq(6)', nRow).html(res);
        },
        "deferRender": true,
        "bDestroy": true
    });*/
}

function showAdSettings()
{
    var table = $('#ad_settings').dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "bFilter": false,
        "aLengthMenu": [[5, 10, 50], [5,10,50]],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        { 'bSortable': false, 'aTargets': [ 1, 2, 3, 4, 5, 6, 7] }
        ],
        "sAjaxSource": "/panel/adUnitSettings/show",
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            $('td:eq(2)', nRow).html(aData[3]);
            $('td:eq(0), td:eq(1), td:eq(2), td:eq(3)', nRow).addClass('event');
            if (aData[7] == "1")
                res = '<input type="checkbox" class="check_status" checked="checked" />  Активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            else
                res = '<input type="checkbox" class="check_status" />  Не активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            
            $('td:eq(6)', nRow).html(res);
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#ad_settings tbody').on('click', 'input', function () {
        
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        status = (res[7]==1) ? 0 : 1;
        
        $.ajax({
            type: "POST",
            url: "/panel/adUnitSettings/setstatus",
            data: {'id':res[0], 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });
    });
    
    table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        url = "/panel/adUnitSettings/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });
    
    $('#ad_settings tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        window.open( '/panel/adUnitSettings/update/id/'+res[0] );
    });
}

function showAdsList()
{
    var table = $('#ads_list').dataTable({
        "oLanguage": {
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: ",
        },
        "aLengthMenu": [[10, 25, 50, -1], [5,10,50, 'All']],
        "bServerSide": true,
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumnDefs": [
        { 
            "sWidth": "7%",
            "aTargets": [3, 7]
        },
        {
            "bVisible" : false,
            "aTargets": [ 0 ]
        },
        { 'bSortable': false, 'aTargets': [ 1, 2, 3, 4, 5, 6, 7] }
        ],
        "sAjaxSource": "/panel/adsSettings/show",
        "fnRowCallback": function( nRow, aData, iDisplayIndex )
        {
            /*console.log( aData );*/
            $('td:eq(0), td:eq(1), td:eq(2), td:eq(3)', nRow).addClass('event');
            if (aData[7] == "1")
                res = '<input type="checkbox" class="check_status" checked="checked" />  Активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            else
                res = '<input type="checkbox" class="check_status" />  Не активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            
            if(aData[3]){
                var img = "<img src='"+aData[3]+"' width='50px' height='50px' style='margin-left: 18px;'/>";
            }

            $('td:eq(2)', nRow).html(img);
            $('td:eq(6)', nRow).html(res);
        },
        "deferRender": true,
        "bDestroy": true
    });

    $('#ads_list tbody').on('click', 'input', function () {
        
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        status = (res[7]==1) ? 0 : 1;
        
        $.ajax({
            type: "POST",
            url: "/panel/adsSettings/setstatus",
            data: {'id':res[0], 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });
                
    });
    
    table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        url = "/panel/adsSettings/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
        {
            deleteById( res[0], url, table )
        }else{
            return false;
        }
    });
    
    $('#ads_list tbody').on('click', '.event', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        window.open( '/panel/adsSettings/update/id/'+res[0] );
    });
}

function delPromoCode(){
    if( !confirm("Вы действительно хотите удалить выбранные промокоды?") ) return false;

    var ids = getCheckedIds( $("#promo_codes .promoSelector:checked") );

    if( ids.length == 0 ){
        alert("Выберите промокоды");
        return false;
    }

    $.post('/panel/promoCodes/delete', {'ids':ids}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            table.fnReloadAjax();
        else
            alert("Удалить промокоды не удалось");
    });
}

function getCheckedIds(block){
    var ids = new Array();
    block.each(function(){
        var id = this.id.substring(6);
        ids.push(id);
    });

    return ids;
}

function generateUrl(obj){
    var obj   = obj || {};
    var prev  = obj.prev('input');
    var title = obj.closest('.control-group').prev().find('.title').val();
    var title_tr;
    
    if(title !== 'undefined'){
        var title_tr = title.translit().toLowerCase();
        prev.val(title_tr);
    }
}

function showTasksTab(){
    tableTasks = $( '#taskListMain' ).dataTable({
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
            $('td:eq(0)', nRow).html( '<input type="checkbox" data-id="'+aData.id+'" class="taskSelector" id="task_' + aData.id + '">' );
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

function showLndAdultTable(){
    table = $('#lndAdult').dataTable({
        "oLanguage": {
            "sLengthMenu": "_MENU_ записей на странице",
            "oPaginate": {
                "sPrevious": "Prev",
                "sNext": "Next"
            },
            "sSearch":"Поиск: "
        },
        "bFilter": false,
        'iDisplayLength': 10,
        "aLengthMenu": [[5, 10, 50, -1], [5,10, 50, 'All']],
        "bServerSide": true,
        "bProcessing": false,
        "aaSorting": [[ 0, "desc" ]],
        "aoColumns": [
            {"mDataProp":"id"},
            {"mDataProp":"url"},
            {"mDataProp":"status", "sWidth":"10%"}
        ],
        "sAjaxSource": "/panel/lndAdult/show",
        "fnServerParams": function (aoData){},
        "fnDrawCallback": function(){},
        "fnRowCallback" : function( nRow, aData, status){

            if (aData.status == "1")
                res = '<input type="checkbox" class="check_status" checked="checked" />  Активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';
            else
                res = '<input type="checkbox" class="check_status" />  Не активен <span class="right tools hiden"></span><span class="right tools hiden" ><i class="icon-trash"></i></span>';

            $('td:eq(2)', nRow).html(res);
            $('td:eq(1)', nRow).addClass('event');
        },
        "deferRender": true,
        "bDestroy": true
    });

    table.on('click', 'i', function(){
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        var url = "/panel/lndAdult/delete";
        if( confirm( "Вы действительно хотите удалить эту запись?" ) )
            deleteById( res.id, url, table )
        else
            return false;
    });

    $('#lndAdult tbody').on('click', 'input', function () {

        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        var status = (res.status == 1) ? 0 : 1;

        $.ajax({
            type: "POST",
            url: "/panel/lndAdult/setstatus",
            data: {'id':res.id, 'status':status},
            success: function(){
                table.dataTable().fnReloadAjax();
            }
        });

    });

    $('#lndAdult tbody').on('click', '.event', function () {
        var val = table.dataTable().fnGetPosition( $(this).closest('tr')[0] );
        var res = table.DataTable().row( val ).data();
        document.location = '/panel/lndAdult/update/id/'+res.id;
    });
}

function changeStatus(status){
    if( !confirm("Вы действительно хотите изменить статус?") ) return false;

    var tasks = getCheckedElem( $('#taskListMain .taskSelector:checked') );

    if( tasks.length == 0 ){
        alert("Выберите задачу");
        return false;
    }

    if( status )
        var status = 3;
    else
        var status = $('select[name=status] option:selected').val();

    $.post('/panel/tasks/changestatus', {'ids':tasks, 'status':status}, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true )
            tableTasks.fnReloadAjax();
        else
            alert("Изменить статус не удалось");
    });
}

function getCheckedElem(ident){
    var ids = new Array();
    ident.each(function(){
        var id = $(this).data('id');
        ids.push(id);
    });

    return ids;
}

function taskFormSave(){
    var tasks = getCheckedElem( $('#taskListMain .taskSelector:checked') );

    if( tasks.length == 0 ){
        alert('Выберите таск');
        $('#myModal .close').click();
        return false;
    }

    $('#workerId').val( $('select#managerList option:selected').val() );

    var taskForm = $('#taskForm').serialize();

    $.post('/panel/tasks/settask/ids/' + tasks, taskForm, function (result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' && answer.success === true ){
            $('#myModal .close').click();
            tableTasks.fnReloadAjax();
        }
        else
            alert("Поставить задачу не удалось");
    });
}