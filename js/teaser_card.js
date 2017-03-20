var _tinfo = {};
var imgpage = 0;
var linkpage = 0;
var sort = 'views';
var sord = 'DESC';
var month=new Array(12);
month[0]="Январь";
month[1]="Февраль";
month[2]="Март";
month[3]="Апрель";
month[4]="Май";
month[5]="Июнь";
month[6]="Июль";
month[7]="Август";
month[8]="Сентябрь";
month[9]="Октябрь";
month[10]="Ноябрь";
month[11]="Декабрь";

$(document).ready(function(){
    $(".mask").on("click",function(){
        $("#bubble_date").css("display","none");
        $(".mask").css("display","none");
    });
    $(".stfilters").on("click",function(){
        /*$(".mask").css("display","block");*/
        $("#bubble_date").show();
    });

    getLanding();

    /*setTimeout(function(){
        simimgpage(1);
    },1000);

    setTimeout(function(){
        simlinkpage(1);
    },1000);

    setTimeout(function(){
        count_geo_view();
    },1000);*/
});

function count_geo_view(){
    if( typeof _tinfo.dc != 'undefined' ) return true;

    var id = $("#teaser_id").val();

    $('#container').html( getPreloader() );
    $('#container2').html( getPreloader() );

    function onSuccess(result){
        if( typeof result.status != 'undefined' && result.status == 'noaccess'){
            $('#container').html( $("#noaccess").html() );
            return false;
        }

        if( typeof result != "undefined" && typeof result.dc != "undefined" && typeof result.dc.cl != "undefined" && result.dc.cl.length > 1 ){
            _tinfo = result;
            preparedData();
        }else{
            $('#container').html( $("#notizerblockview").html() );
            //$('#container2').html( $("#notizerblock").html() );
        }
    }

    $.ajax({
        url: '/teazer/show/cview',
        type: 'POST',
        data: {'id':id,'action':'countview'},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function preparedData(){
    var date_start = $("#date_from_text").html();
    var date_end = $("#date_to_text").html();

    var ds = date_start.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1');
    var de = date_end.replace(/(\d+).(\d+).(\d+)/, '$3-$2-$1');

    if( ds > de ){
        alert("Не корректная дата");
        return false;
    }

    var c = new Array();
    var date = new Date(ds);
    var d = new Date(ds);
    var ymd = d.getFullYear() + '-' + ( ( d.getMonth() + 1 ) < 10 ? '0' + ( d.getMonth() + 1 ) : ( d.getMonth() + 1 ) ) + '-' + ( d.getDate() > 10 ? d.getDate() : '0' + d.getDate() );

    if( typeof _tinfo.dc == 'undefined' ) return false;

    do{
        var pos = _tinfo.dc.dl.indexOf(ymd);
        if( pos != -1 ){
            c.push( _tinfo.dc.cl[pos] );
        }else{
            c.push( 0 );
        }
        d.setDate( d.getDate() + 1 );
        var ymd = d.getFullYear() + '-' + ( ( d.getMonth() + 1 ) < 10 ? '0' + ( d.getMonth() + 1 ) : ( d.getMonth() + 1 ) ) + '-' + ( d.getDate() > 10 ? d.getDate() : '0' + d.getDate() );
    }while( ymd >= ds && ymd <= de )

    var geo = new Array();

    var st = new Array();
    for( i in _tinfo.gc ){
        if( i >= ds && i <= de ){
            for( g in _tinfo.gc[i] ){
                if( typeof st[g] == "undefined" ) st[g] = 0;

                st[g]++;
            }
        }
    }

    for( ex in st ){
        var sw = '<img src="/images/geo/' + geo_label[ex] + '">';
        geo.push( [ sw, st[ex]] );
    }

    createGraphCount(date, c);
    // createGraphGeo(geo);
}

function createGraphCount(date, count){

    $('#container').highcharts({
        chart: {
            zoomType: 'x',
            spacingRight: 20
        },
        title: {
            text:null
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Нажмите и выделите область построения для увеличения!!!' :
                'Зажмите диаграмму для увеличения'
        },
        xAxis: {
            type: 'datetime',
            //categories: dates,
            title: {
                text: 'Дата'
            }
        },
        yAxis: {
            title: {
                text: 'Количество показов'
            },
            min: 0
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {

                lineWidth: 2,
                fillColor: '#dbedc5',
                lineColor:'#aaca7e',
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 2
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'Количество показов',
            pointInterval: 24 * 3600 * 1000,
            pointStart: Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            data: count
        }]
    });
}

/*function createGraphGeo(data){ //http://redmine.pmm.in.ua/issues/4351
    $('#container2').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title:false,
        tooltip: {
            //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            pointFormat: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#5f6265',
                    useHTML: true,
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b> {point.percentage:.1f} %'
                },
                size:'50%'
            }
        },

        series: [{
            type: 'pie',
            name: 'Browser share',
            data: data
        }]
    });
}*/

function simimgpage(page, acs){
    if( page == imgpage && typeof acs != 'undefined' && !acs ) return false;

    imgpage = page;

    var hash = $("#teaser_hash").val();

    if( hash == '' ) return true;

    $("#similar_img").html( getPreloader() );
    $.post('/teazer/show/cview',{'action':'simimg','hash':hash,'page':page},function(result){
        if( result != '' )
            $("#similar_img").html( result );
            //$("#similar_img").html('<div class="teazers-block-list">' + result + '</div>');
        else
            $("#similar_img").html( $("#notizerblock").html() );
    });
}

function simlinkpage(page, acs){
    //if( !access ) return false;

    if( page == linkpage && !acs ) return false;

    linkpage = page;

    var link = $("#searchByLink").html();

    if( typeof link == "undefined" ){
        $("#similar_teasers").html( $("#notizerblock").html() );
        return false;
    }

    if( link == '' ) return true;

    $("#similar_teasers").html( getPreloader() );
    $.post('/teazer/show/cview',{'page':page,'action':'simlink','link':link},function(result){
        if( result != '' )
            $("#similar_teasers").html( result );
        else
            $("#similar_teasers").html( $("#notizerblock").html() );
    });
}

function domainspage(page){
    var id = $("#teaser_id").val();
    $("#similar_domains").html(getPreloader());
    if (id == '') {
        return false;
    }
    var params = {
        'sort':sort,
        'sord':sord,
        'page':page,
        'action':'domains_list',
        'id':id
    };
    $.post('/teazer/show/cview', params, function(result){
        if (result != '') {
            $("#similar_domains").html(result);
        } else {
            $("#similar_domains").html($("#notizerblockview").html());
        }
    });
}

function sortPlidInfo(field, fsord) {
    sort = field;
    sord = fsord;
    domainspage(1);
}

function orderTeazInfo(mod, field, sdix, page, callback){
  $.post('/teazer/default/cviewfilter',{'mod':mod,'sort':field,'sidx':sdix},function(result){
      callback(page, true);
  });
}

function ad_one_check(id, check){}
function ad_been_checked(){}

function getPreloader(){
    return '<div class="p4 center"><img src="/images/loading.gif" style="width:50px;"></div>';
}

function getLanding(){
    //if( !access ) return false;

    $(".teaz-info-redir").html( getPreloader() );
    var id = $("#teaser_id").val();

    $("#similar_landing").html( getPreloader() );

    $.post('/teazer/show/cview',{'action':'landing','id':id},function(result){
        var $sl = $("#similar_landing");

        if (result != '') {
            $sl.html(result);
        } else {
            $sl.html($("#notizerlndblock").html());
        }
        var $rdrs = '';
        if ($('#offer-lnk').length != 0) {
            $rdrs = $('#offer-lnk').html();
        }
        if ($('#tranz-lnk').length != 0) {
            $rdrs = $('#tranz-lnk').html();
        }
        $(".teaz-info-redir").html($rdrs);
        if ($rdrs == '') {
            $(".single-title h2").hide();
        }
        /*var $tl = $("#offer-lnk");
        if ($tl.length != 0) {
            $(".teaz-info-redir").html($tl.html());
        } else {
            $(".teaz-info-redir").html('');
            $(".single-title h2").hide();
        }*/
    });
}

function paginationSelectAll(mod){
    /*$.post('/teazer/default/paginationselectall',{'mod':mod});*/

    if(mod=='yes')
    {
        if( !($( "div.selectAll" ).hasClass("checked")) )
            $("div.jq-checkbox.selectAll").click();
        else {
            ad_all_uncheck($("div.jq-checkbox.selectAll").attr('id'));
            ad_all_check($("div.jq-checkbox.selectAll").attr('id'));
        }

        unchecked_ads_id = [];
    }

    if(mod == 'no')
    {
        if( ($( "div.selectAll" ).hasClass("checked")) )
            $("div.jq-checkbox.selectAll").click();

        ad_all_uncheck($("div.jq-checkbox.selectAll").attr('id'));

        unchecked_ads_id = [];

        ads_id = [];
    }
}

/*function showNoAccessLndMsg(type, id, ident){
    //if( typeof tfname == 'undefined' ) tfname = 'Бесплатный'
    if( type === true ){
        $('#'+ident+' a.linkGo').attr('href', '/landing/lnd/view/id/' + id);
        //var msg = 'Для тарифа <b>'+tfname+'</b> посадочные страницы доступны<br>в демо-режиме.';
        //$("#demoCard").attr('href', '/landing/lnd/view/id/' + id);
    }else{
        $('#'+ident+' a.linkGo').attr('href', '/landing/plnd/view/id/' + id);
        //$("#demoCard").attr('href', '/landing/plnd/view/id/' + id);
        //var msg = 'Для тарифа <b>'+tfname+'</b> прелендинги доступны<br>в демо-режиме.';
    }

    //$("#dcpopup h3").html(msg);
    $("#"+ident).show();
}*/

function checkAdultTsr(){
    if( ads_id.length < 1 ){
        openNotification("Выберите тизеры");
        return false;
    }

    if( confirm( "Вы действительно хотите определить тизеры в адалт категорию?" ) ){
        $.post('/teazer/adult/teaser', {"ads_id":ads_id}, function (result) {
            var data = $.parseJSON(result);
            if( typeof data.success != 'undefined' && data.success === true )
                openNotification("Тизеры добавлены в адалт категорию (" + ads_id.length + ")");
        });
    }
}

function checkAdultLnd(){
    if( ads_id.length < 1 ){
        openNotification("Выберите тизеры");
        return false;
    }

    if( confirm( "Вы действительно хотите определить данные лендинги как адалт?" ) ){
        $.post('/teazer/adult/landing', {"ads_id":ads_id}, function (result) {
            var data = $.parseJSON(result);
            if( typeof data.success != 'undefined' && data.success === true )
                openNotification("Тизеры добавлены в адалт категорию (" + data.cnt + ")");
        });
    }
}

function adsUncheck(){
    var id = $("#teaz-sin-tabs .ui-tabs-active")[0].id;

    if( id == 'li_similar_teasers' ){
        ad_all_uncheck('simlink-styler');
        $('#similar_teasers .selectAll').prop('checked', false).trigger('refresh');
    }
    else if( id == 'li_similar_img' ){
        ad_all_uncheck('simimg-styler');
        $('#similar_img .selectAll').prop('checked', false).trigger('refresh');
    }
}

function adsCheck(){
    var id = $("#teaz-sin-tabs .ui-tabs-active")[0].id;

    if( id == 'li_similar_teasers' ){
        ad_all_check('simlink-styler');
        $('#similar_teasers .selectAll').prop('checked', true).trigger('refresh');
    }
    else if( id == 'li_similar_img' ){
        ad_all_check('simimg-styler');
        $('#similar_img .selectAll').prop('checked', true).trigger('refresh');
    }
}