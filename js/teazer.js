var trig_view = "";
var page = 1;
var lim = 50;
var sort = 1;
var sord = 'asc';
var ads_id = [];
var unchecked_ads_id = [];
var __app = [];
var maxWebLength = 11;
var defaultFilter = true;
var reload = true;
var freeBase = false;
//var xhr;

$.ajaxSetup({async:true});

$(document).ready(function () {
    $("#new_mark").change(function () {
        $("div.hide").css("display", "none");
        $("div.mark_soc_link").css("display", "inline-block");
        save_mark();
    });

    $("#datepicker").on("click", function () {
        $(this).next().click();
    });
    $("#datepicker2").on("click", function () {
        $(this).next().click();
    });
	
	$(".sort-limit-list a").on("click", function(){
		$(this).closest("ul").find(".active").removeClass("active");
		$(this).addClass("active");
		pg_ch($(this).data("val"));
	});
});

function t_view_ch(param) {

    // $(event.target).addClass('active');
    // $(event.target).siblings('a').removeClass('active')
    
    trig_view = param;
    

    $("#block_b").removeClass('active');
    $("#list_b").removeClass('active');
    var teazerBlock = $("#teazers-block");

    if (param == 'list') {
        $("#list_b").addClass('active');
    } else {
        
        $("#block_b").addClass('active');
    };

    $(window).trigger("resize");

    if (controller_id == 'favorites') {
        favtizpage(page);
    } else {
        tizpage(page);
    }

}

function tizpage(param) {
    page = ( typeof param == 'undefined' ? page : param );
	var teazerBlock = $("#teazers-block");
    if (teazerBlock.hasClass("masonryJs")) {
        teazerBlock.removeClass("masonryJs").masonry('destroy');
    }
    teazerBlock.html(' Загрузка ... ');
    openPreloader();
	$(window).trigger("resize");
    $.post('/teazer/show/list', { 'param': trig_view, 'page': page, 'sort': sort, 'lim': lim,'sord':sord,'free':freeBase,'filterHash':filterHash}, function (result) {
        __app.loadinfo = [];

        closePreloader();
        var $container = $('#teazers-block');
		
		$container.html(result);
        scrollToTop();

        if (typeof $.browser != 'undefined' && $.browser.msie ) {
            $('.teaz-center').css('width', ( $('.teaz-center').width() - 30 ) );
        }

        $("#ui-id-1").hide();

		
    });
}

function aply_filter(mod) {
    $("#submit-filter").hide();
    
    var idtnid = [];
    var geonm = [];
    var contid = [];
    var devid = [];
    var imgtypeid = [];
    var cats = [];

    $("#tn .teaz_chbox ").filter(":checkbox:checked").each(function () {
        idtnid.push($(this).attr("name"));
        //$('<label>'+teaz_name+' </label>').appendTo('#options');				
    });
    $("#geotarg .geo_chbox ").filter(":checkbox:checked").each(function () {
        geonm.push($(this).attr("name"));
    });
    $("#cont_filter .cont_chbox ").filter(":checkbox:checked").each(function () {
        contid.push($(this).attr("name"));
    });
    $("#devid .device_chbox ").filter(":checkbox:checked").each(function () {
        devid.push($(this).attr("name"));
    });
    $("#imgtype .img_chbox ").filter(":checkbox:checked").each(function () {
        imgtypeid.push($(this).attr("name"));
    });

    $("#adult .adult_chbox ").filter(":checkbox:checked").each(function () {
        cats.push($(this).attr("name"));
    });

    //console.log( cats );

    day_on_count = $("#day_on_count").val();
    day_off_count = $("#day_off_count").val();
    size_on_count = ($("#size_on_count").val());
    size_off_count = ($("#size_off_count").val());
    datepicker = $("#date_from_text").html();
    datepicker2 = $("#date_to_text").html();
    adult = $("#adult input[name=adult]:checked").val();

    var uniq = $("#uniq input[name=uniq]:checked").val();

    resolution='';
    if($( ".img_radio:checked" ).attr('id')){
        res=$(".img_radio:checked").attr('id').split('_')[1];
        if(res!=='all'){resolution=res;}
    }

    var newAds = ( $('input[name=new_ads]:checked').length > 0 ? 1 : 0 );
    var slinks = ( $('input[name=links]:checked').length > 0 ? 1 : 0 );

    var search = $("#serch_string").val();
    if( search == 'Введите ключевое слово или адрес сайта' ) search = '';

    var ads_and = ( $("input[name=ads_and]:checked").length > 0 ? 1 : 0 );

    function onSuccess(_data){
        if( typeof _data.dfilter != 'undefined' )
            defaultFilter = _data.dfilter;

        if( typeof mod == 'undefined' || !mod ){
            if( controller_id == 'favorites' )
                favtizpage(1);
            else
                tizpage(1);
        }else{
            reload = false;
        }
    }

    function onError(request, textStatus, errorThrown){
        //openNotification( "Доступ запрещен." );
    }
	$.ajax({
        url: '/teazer/default/filteradd',
        type: 'POST',
        data: {
            'new_ads': newAds,
            'idtnid': idtnid,
            'geonm': geonm,
            'contid': contid,
            'devid': devid,
            'imgtypeid': imgtypeid,
            'day_on_count': day_on_count,
            'day_off_count': day_off_count,
            'size_on_count': size_on_count,
            'size_off_count': size_off_count,
            'datepicker': datepicker,
            'datepicker2': datepicker2,
            'resolution': resolution,
            'adult': adult,
            'search': search,
            'uniq': uniq,
            'links': slinks,
            'cats': cats,
            'ads_and':ads_and,
            'filterHash': filterHash,
        },
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function aply_filter_label(){
    $("#submit-filter").hide();
    aply_filter();
}

function reset_filter() {
    $("#resultList").html('Выбрать настройки фильтра');
    $("#submit-filter").hide();
    $("#tn .teaz_chbox ").removeAttr("checked");
    if( $(".geotarg-filter-block .titleLock").length == 0 )
        $("#geotarg .geo_chbox ").removeAttr("checked");
    $("#cont_filter .cont_chbox ").removeAttr("checked");
    $("#devid .device_chbox ").removeAttr("checked");
    $("#imgtype .img_chbox ").removeAttr("checked");
    $('.filter-acc-one input').trigger('refresh');
    $("#serch_string").val("");
    //$("#adult input.img_chbox").attr('checked', false);
    //$("#adult div.img_chbox").removeClass('checked');
    $('.resolution').val('');
    $('.img_radio').attr('checked', false).removeClass('checked');
    $('#resolution_all').attr('checked', true);
    $('#resolution_all-styler').addClass('checked');

    $(".filter-acc-one").removeClass("leftFilterActiveBg");
    $('input[name=uniq]').prop('checked', false).trigger('refresh');

    $('#adult input:checked').prop('checked', false).trigger('refresh');
    $('#exact input:checked').prop('checked', false).trigger('refresh');

    $('#teazers-block').removeClass('teazers-block-list');
    $('#teazers-block').addClass('teazers-block');

    unselectPeriod();
    unselectLife(false);
    unselectSize(false);
    unsetHeaderFilter();

    function onSuccess(_data) {
        defaultFilter = true;
        if( controller_id == 'favorites' )
            favtizpage(1);
        else
            tizpage(1);
    }
    function onError(request, textStatus, errorThrown) {
        openNotification("Ошибка запроса, обратитесь в тех-поддержку!");
    }
    $.ajax({
        url: '/teazer/default/filterreset',
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false,
    });
}

function unsetHeaderFilter(){
    page = 1;
    sort = 1;
    lim = 50;
    trig_view = 'block';
    
    $("#list_b").removeClass("active");
    $("#block_b").addClass("active");
    $(".onpage").removeClass("selected");
    $(".pcheck_50").addClass("selected");
    $("#sortch option:first").attr('selected', 'selected');
    $("#sortch").trigger("refresh");

    $("small.reset-filters").hide();
}

function pg_ch(param){
    console.log('param= '+param,'page= '+page,'lim= '+lim)
    $('.onpage').removeClass('selected');
    $('.onpage.pcheck_' + param).addClass('selected');
	//lim = param;
    
    var start = ( page - 1 ) * lim;
    var newPage = (Math.floor(start/param)+1);

    page = newPage;
    lim = param;

	if( controller_id == 'favorites' )
        favtizpage(page);
    else
        tizpage(page);
}

function sort_ch(param, sord_ch){
    sort = param;
    if( typeof sord_ch != 'undefined' )
        sord = sord_ch;
    aply_filter();
    //tizpage(1);
}
function search(param) { //sort = param; tizpage(1); 
}
var f_show = 1;
function filterhide() { if (f_show == 1) { $("#left-panel-box").hide('scale'); f_show = 0; } else { $("#left-panel-box").show('explode'); f_show = 1; } }


////////////////////////////////////////////////////////////////////
function serch_string() {
    $("#ui-id-1").hide();
    aply_filter();
}

function save_filter(filtername){
    if( defaultFilter ){
        popunderShow('<p>Вы пытаетесь сохранить настройки фильтров по умолчанию.<br> Для успешного сохранения выберите необходимые значения фильтров и нажмите сохранить настройки.</p>');
        return false;
    }

    filtername = filtername.replace(/^\s*/,'').replace(/\s*$/,'');

    if( filtername == '' ){
        openNotification('Вы не ввели название фильтра');
        return false;
    }

    /*if( filterName.indexOf( filtername ) != -1 ){
        openNotification('Такое имя фильтра уже существует!');
        return;
    }*/

    var search = $("#serch_string").val();
    if( search == 'Введите ключевое слово или адрес сайта' ) search = '';

    function onSuccess(response){
        /*if( response == 'exist' ){
            openNotification('Такое имя фильтра уже существует!');
            return false;
        }*/

        if( response != '' ){
            var rlf = $("#resultList");

            if( rlf.hasClass("noActForm") )
                rlf.removeClass("noActForm");

            if( response != 'Ok' )
                $("#filtersList").append(response);

            if( reload )
                showActionMsg('Настройки фильтра успешно сохранены!');
            else
                showActionMsg('Настройки фильтра успешно сохранены! <a href="javascript:void(0);" onclick="tizpage(1);">Применить фильтр</a>');
            //openNotification('Настройки фильтра успешно сохранены');
        }
    }

    function onError(request, textStatus, errorThrown){
        openNotification("Фильтр сохранить неудалось!");
    }

    var filter = getFilterSettings();

    $.ajax({
        url: '/teazer/default/filtersave',
        type: 'POST',
        data: {
            filtername: filtername,
            sort: sort,
            search: search,
            'filter': filter
        },
        dataType: 'text',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function getFilterSettings(){
    var idtnid = [];
    var geonm = [];
    var contid = [];
    var devid = [];
    var imgtypeid = [];
    var cats = [];

    $("#tn .teaz_chbox ").filter(":checkbox:checked").each(function () {
        idtnid.push($(this).attr("name"));
    });
    $("#geotarg .geo_chbox ").filter(":checkbox:checked").each(function () {
        geonm.push($(this).attr("name"));
    });
    $("#cont_filter .cont_chbox ").filter(":checkbox:checked").each(function () {
        contid.push($(this).attr("name"));
    });
    $("#devid .device_chbox ").filter(":checkbox:checked").each(function () {
        devid.push($(this).attr("name"));
    });
    $("#imgtype .img_chbox ").filter(":checkbox:checked").each(function () {
        imgtypeid.push($(this).attr("name"));
    });

    $("#adult .adult_chbox ").filter(":checkbox:checked").each(function () {
        cats.push($(this).attr("name"));
    });

    var uniq = $("#uniq input[name=uniq]:checked").val();

    day_on_count = $("#day_on_count").val();
    day_off_count = $("#day_off_count").val();
    size_on_count = ($("#size_on_count").val())*1024;
    size_off_count = ($("#size_off_count").val())*1024;
    datepicker = $("#date_from_text").html();
    datepicker2 = $("#date_to_text").html();
    adult = $("#adult input[name=adult]:checked").val();

    resolution='';
    if($( ".img_radio:checked" ).attr('id')){
        res=$(".img_radio:checked").attr('id').split('_')[1];
        if(res!=='all'){resolution=res;}
    }

    var search = $("#serch_string").val();
    if( search == 'Введите ключевое слово или адрес сайта' ) search = '';

    var ads_and = ( $("input[name=ads_and]:checked").length > 0 ? 1 : 0 );
    
    return {
        'idtnid': idtnid,
        'geonm': geonm,
        'contid': contid,
        'devid': devid,
        'imgtypeid': imgtypeid,
        'day_on_count': day_on_count,
        'day_off_count': day_off_count,
        'size_on_count': size_on_count,
        'size_off_count': size_off_count,
        'datepicker': datepicker,
        'datepicker2': datepicker2,
        'resolution': resolution,
        'adult': adult,
        'search': search,
        'cats': cats,
        'uniq': uniq,
        'ads_and':ads_and,
        'filterHash':filterHash,
    };
}

function favtizpage(param) {
    page = ( typeof param == 'undefined' ? page : param );
    $("#teazers-block").html(' Загрузка ... ');
    openPreloader();
    $.post('/teazer/favorites/list', { 'param': trig_view, 'page': page, 'sort': sort, 'lim': lim }, function (result) {
        closePreloader();
        $("#teazers-block").html(result);
    });
}

function t_view_fav(param) {
    trig_view = param;
    $("#teazers-block").html(' Загрузка ... ');
    $("#block_b").removeClass('active');
    $("#list_b").removeClass('active');

    if (trig_view == "list") {
        $("#teazers-block").removeClass('teazers-block');
        $("#teazers-block").addClass('teazers-block-list');
        $("#list_b").addClass('active');
    } else {
        $("#teazers-block").removeClass('teazers-block-list');
        $("#teazers-block").addClass('teazers-block');
        $("#block_b").addClass('active');
        trig_view = "block";
    }
    openPreloader();
    $.post('/teazer/favorites/list', { 'param': trig_view, 'page': page, 'sort': sort, 'lim': lim }, function (result) {
        closePreloader();
        $("#teazers-block").html(result);
    });
}

function add_mark() {
    if (ads_id.length == 0) {
        openNotification("Выберите объявления!");
        return false;
    }

    $(".hide").css("display", "inline-block");
    $(".mark_soc_link").css("display", "none");
}

function save_mark() {
    var markname = $("#new_mark").val();

    if(markname === '') {
        openNotification("Название метки не может быть пустым!");
        return false;
    }

    function onSuccess(result) {
        if (result.success === true) {
            var mcount = $(".num_" + result.mark).html();
            if (typeof mcount != 'undefined') {
                mcount = parseInt(mcount) + parseInt(result.mcnt);
                $(".num_" + result.mark).html(mcount);
            }
            else {
                var k = randomByLength(2, 3);
                var row = '<div class="msb_one order_' + k + '">'+
                    '<a class="msb_l" href="javascript: void(0);" onclick="show_mark(' + "'" + result.mark + "', this" + ');">'+
                    '<span class="msb_l_name">' + result.mark + '</span>'+
                    '<span class="msb_l_num num_' + result.mark + '">' + result.mcnt + '</span></a>'+
                    '<a class="msb_del" onclick="del_mark( ' + k + ", '" + result.mark + "'" + ' );"></a></div>';
                $(".mark_soc_box .msb_list").append(row);
            }
            $("#new_mark").val('');
        }
    }
    function onError() {
        openNotification("Добавить метку неудалось!");
    }

    $.ajax({
        url: '/teazer/favorites/addmark',
        type: 'POST',
        data: { 'mark': markname, 'ads': ads_id },
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function randomByLength(min, max) {
    var a = 0; while (!a || a.toString().length < min)
        a = parseInt(Math.random().toString().substr(2, max));
    return a;
}

function resetLandingFilter() {
     $.ajax({
        url: '/teazer/show/restLndFilter',
        type: 'POST',
        dataType: 'json',
        error: onError,
        cache: false
    });
}

function del_mark(oid, mark) {
    if( !confirm( "Вы действительно хотите удалить метку?" ) ){
        return false;
    }

    function onSuccess(result) {
        if (result.success === true){
            favtizpage(1);
            $('.msb_one.order_' + oid).remove();
        }
    }
    function onError() {
        openNotification("Удалить метку неудалось!");
    }

    $.ajax({
        url: '/teazer/favorites/delmark',
        type: 'POST',
        data: { 'mark': mark },
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function show_mark(mark, a) {

    if ($(a).hasClass('mark-active'))
        var active = false;
    else
        var active = true;

    function onSuccess(result) {
        if (result.success === true) {
            if (active === true)
                $(a).addClass('mark-active');
            else
                $(a).removeClass('mark-active');

            ad_all_uncheck();
            favtizpage(1);
        }
    }

    function onError() {
        openNotification("Не удалось выбрать метку!");
    }

    $.ajax({
        url: '/teazer/default/filtermark',
        type: 'POST',
        data: { 'mark': mark, 'state': active },
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function load_desc_info(teaser) {
    var id = teaser.attr("id");
    id = id.substring(4);

    if (typeof __app.loadinfo != 'undefined' && __app.loadinfo.indexOf(id) == -1) {
        __app.loadinfo.push(id);
    } else if (typeof __app.loadinfo == 'undefined') {
        __app.loadinfo = [];
        __app.loadinfo.push(id);
    } else {
        return true;
    }



    $.post('/teazer/show/detailinfo', {'ad_id':id}, function (result) {        

        if( result != '' ) {
            $("#popap_" + id).html(result);
       }


 
    });


}



function getProjectUser() {

    if( $("#lay").hasClass('show') ){
        $("#lay").hide();
        $("#lay").removeClass('show');
        return false;
    }else{
        $('#lay').hide();
    }
    var yourClick = true;
          $(document).bind('click.myEvent', function (e) {
            if (!yourClick && $(e.target).closest('#lay').length == 0) {
              
              $("#lay").hide();
              $("#lay").removeClass('show');
              $(document).unbind('click.myEvent');
            }
            yourClick = false;
          });
    $('#bubble_date').hide();
    $('.mask').hide();
    
    function onSuccess(result) {
        if (result != '') {
            $("#lay").html(result);
            //$("#lay").toggle();
            $("#lay").addClass('show');
            $("#lay").show();   
            $('.scroll-pane').jScrollPane();
        }
    }
    
    $.ajax({
        url: '/projects/show/projectlist',
        type: 'POST',
        data: { 'get': 'project_list' },
        dataType: 'text',
        success: onSuccess,
        cache: false
    });
}

function selectProject(id){
    $("#sel_proj").val(id);
    $("#lay")
        .css("display", "none")
        .hide()
        .removeClass('show');
        
    var name = $("#proj_" + id).html();

    $(".add-proj-name")
        .html(name)
        .attr("href", "/projects/show/" + id)
        .removeAttr("onclick");
}

function addSelectTeaserToProj(){
    var project_id = $("#sel_proj").val();

    if (ads_id.length == 0) {
        openNotification("Выберите тизеры!");
        return false;
    } else if (project_id == '') {
        openNotification("Выберите проект!");
        return false;
    }

    function onSuccess(result) {
        if (typeof result.status != undefined && result.status == 'success') {
            openNotification('Тизеры успешно добавлены! <a href="/projects/show/' + project_id + '?list_id=' + result.list + '">Перейти в проект</a>');
            ad_all_uncheck();
        }

        if( typeof result.name != undefined && typeof result.status != undefined && result.status == 'fail' && result.error == 'repeated teazers' ){
            openNotification('Выбранные объявления уже добавлены в <a href="/projects/show/' + project_id + '?list_id=' + result.list + '">' + result.name + '</a>');
            ad_all_uncheck();
        }
    }

    $.ajax({
        url: '/projects/ads/addtoproject',
        type: 'POST',
        data: { "project_id": project_id, "ads_id": ads_id, "fav": 1, 'dstart': $("#date_from_text").html() },
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function formNewProject() {
    $.post('/projects/actions/createpp', { 'get': 'list' }, function (result) {
        if (result != '')
            $("#lay").html(result);
    });
}

function createNewProject() {
    var name = $("#ProjectGroups_name").val();
    /*var pg_tnet = $("#ProjectGroups_tnet_id").val();*/

    if( name == '' ){
        openNotification("Название проекта отсутствует");
        return false;
    }

    for (var i in __app.projects) {
        if (__app.projects[i] == name) {
            openNotification("Такой проект уже существует!");
            return false;
        }
    }

    if( !access ){
        checkTnAccExist(name);
        return false;
    }

    function onSuccess(result) {
        if (result.status == 'success') {
            openNotification("Проект успешно создан.");
            $('#sel_proj').val(result.gid);
            __app.projects[result.gid] = name;
            $("#lay").removeClass('show');
            $(".add-proj-name").html(name);
            $(".add-proj-name").attr("href", "/projects/show/" + result.gid);
        }
    }

    $.ajax({
        url: '/projects/actions/createpp',
        type: 'POST',
        //data: { "pg_name": pg_name, "pg_tnet": pg_tnet },
        data: $("form#createProj").serialize(),
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function checkTnAccExist(name){
    var tn_id = $('#ProjectGroups_tnet_id').val();
    
    $.ajax({
        url: '/projects/show/checkacc',
        data: {'tn_id':tn_id},
        type: 'post',
        dataType: 'json',
        success: function(result){
            if( typeof result.status != 'undefined' && result.status === true ){
                function onSuccess(result) {
                    openNotification("Проект успешно создан.");
                    if (result.status == 'success') {
                        $('#sel_proj').val(result.gid);
                        __app.projects[result.gid] = name;
                        $("#lay").removeClass('show');
                        $(".add-proj-name").html(name);
                        $(".add-proj-name").attr("href", "/projects/show/" + result.gid);
                    }
                }

                $.ajax({
                    url: '/projects/actions/createpp',
                    type: 'POST',
                    //data: { "pg_name": pg_name, "pg_tnet": pg_tnet },
                    data: $("form#createProj").serialize(),
                    dataType: 'json',
                    success: onSuccess,
                    cache: false
                });
            }else{
                $("#prpopup #tnName").html( $("#ProjectGroups_tnet_id option:selected").html() );
                $("#prpopup").show();
            }
        }
    });
}

function searchProj() {
    var search = $(".im_search").val();

    if (search == '') return false;

    function onSuccess(result) {
        if (result != '') {
            $("#lay").html(result);
            $("#lay").css("display", "block");
        }
    }

    $.ajax({
        url: '/projects/show/searchproj',
        type: 'POST',
        data: { "search": "proj", "name": search },
        dataType: 'text',
        success: onSuccess,
        cache: false
    });
}

function exports(method) {
    var data_ids = [];

    if( ads_id.length == 0 ){
        openNotification("Не выбрано ни одно объявление!");
        return false;
    }else if( ads_id.length > 300 ){
        for(i in ads_id){
            if( i < 300 )
                data_ids.push(ads_id[i]);
        }

        openNotification( "При выгрузке в " + method + " за раз не более 300 объявлений" );
    }
    else
        data_ids = ads_id;

    /*if( access == 0 ){
        openNotification( "Для тарифа Бесплатный выгрузка в " + method + " недоступна" );
        return false;
    }*/
    
    window.location = '/zip/teasernet?method=' + method + "&fav=1"+"&ads=" + data_ids.join(',');
}

function exportsPublishers(method) {
    var data_ids = [];
    var teaser_id = $('#teaser_id').val();
    if (ads_id.length == 0) {
        data_ids = ads_id;
    } else if (ads_id.length > 300) {
        for (i in ads_id) {
            data_ids.push(ads_id[i]);
        }
    } else {
        data_ids = ads_id;
    }
    data_uids = unchecked_ads_id;
    window.location = '/zip/publishers?method=' + method + "&teaser_id="+teaser_id+"&plids=" + data_ids.join(',')+"&uplids=" + data_uids.join(',');
}

function exportsOne(method, id) {
    
    if(method && id)
    {
        /*if( access == 0 ){
            openNotification( "Для тарифа Бесплатный выгрузка в " + method + " недоступна" );
            return false;
        }*/
        window.location = '/zip/teasernet?method=' + method + "&ads=" + id;
    }
}

function showTnList(b){
    $(b).hide();
    $(b).siblings('small').css('display', 'block');
}

function deleteFilter(id, name){
     if(confirm("Вы хотите удалить фильтр: " + name + " ?")){
        function onSuccess(result){
            if(result.status == 'ok')
                $(".fsi_" + id).remove();

            $("#blockMsg").html('Настройки фильтра ' + name + ' удалены! <a onclick="revDelFilter(' + id + ');" href="javascript:void(0);">Отменить</a>').show();
            //openNotification('Настройки фильтра ' + name + ' удалены! <b onclick="revDelFilter(' + id + ');">Отменить</b>');

            var fList = $("#filtersList").html();
            fList = fList.replace(/\s*/g,'');

            if( fList == '' )
                $("#resultList").addClass("noActForm");

            if( name == $("#resultList").html() ){
                $("#resultList").html('Выбрать настройки фильтра');
                $("#resultList").click();
                reset_filter();
            }
        }
        function onError() {
            openNotification("Удалить фильтр не удалось.");
        }

        $.ajax({
            url: '/teazer/default/filterdel',
            type: 'POST',
            data: { 'id': id },
            dataType: 'json',
            success: onSuccess,
            error: onError,
            cache: false
        });
    }
}

function revDelFilter(id){
    closeNotification();
    $.post('/teazer/default/revfilter/id/' + id, {}, function (result) {
        if( result != '' ){
            $("#filtersList").append(result);
            $("#resultList").removeClass("noActForm");
            $("#blockMsg").html('Фильтр восстановлен').show();
            //openNotification("Фильтр восстановлен");
        }
    });
}

function useFilter(id, name){

    setSelectSearch(id,name);

    function onSuccess(_data){
        console.log(_data);
        $("#tn .teaz_chbox ").removeAttr("checked");
        $("#geotarg .geo_chbox ").removeAttr("checked");
        $("#cont_filter .cont_chbox ").removeAttr("checked");
        $("#devid .device_chbox ").removeAttr("checked");
        $("#imgtype .img_chbox ").removeAttr("checked");
        $('.filter-acc-one input').trigger('refresh');
        $("#serch_string").val("");
        /*$("#adult input.img_chbox").attr('checked', false);
        $("#adult div.img_chbox").removeClass('checked');*/

        $('#adult input:checked').prop('checked', false).trigger('refresh');
        
        $(".filter-acc-one").removeClass("leftFilterActiveBg");
        $('.resolution_200').attr('checked', false).removeClass('checked');
        $('.resolution').val("");
        $("#uniq input[name=uniq]").prop('checked', false).trigger('refresh');

        unselectPeriod();
        unselectLife(false);
        unselectSize(false);

        if( typeof _data.day_on_count != 'undefined' )
            lifeSlider.update({from: _data.day_on_count});

        if( typeof _data.day_off_count != 'undefined' )
            lifeSlider.update({to: _data.day_off_count});

        if( typeof _data.size_on_count != 'undefined' )
            sizeSlider.update({from: (_data.size_on_count / 1024)});

        if( typeof _data.size_off_count != 'undefined' )
            sizeSlider.update({to: (_data.size_off_count / 1024)});

        if (_data.day_on_count) $("#day_on_count").val(_data.day_on_count);
        if (_data.day_off_count) $("#day_off_count").val(_data.day_off_count);
        if (_data.size_on_count) $("#size_on_count").val(_data.size_on_count/1024);
        if (_data.size_off_count) $("#size_off_count").val(_data.size_off_count/1024);
        if (_data.datepicker) $("#date_from_text").html(_data.datepicker);
        if (_data.datepicker2) $("#date_to_text").html(_data.datepicker2);

        if(_data.resol_h && _data.resol_w)
        {
            $('.img_radio').attr('checked', false).removeClass('checked');
            $('#resolution_'+_data.resol_w).attr('checked', true);
            $('#resolution_'+_data.resol_w+'-styler').addClass('checked');
        }

        for (var key in _data) {
            
            if ((key != "day_on_count") && (key != "day_off_count") && (key != "size_on_count") && (key != "size_off_count") && (key != "datepicker") && (key != "datepicker2")) {
                
                /*if( key == 'devid' || key == 'imgtypeid'){
                    var val = _data[key];
                    $("input[name='" + val + "']").attr("checked", "checked");
                }else */
                if( key == 'title' || key == 'descr' || key == 'img' || key == 'link' || key == 'uniq' ){
                    $("input[name='" + key + "']").attr("checked", "checked");
                }else if( key == 'sort' ){
                    $("#sortch :nth-child("+_data[key]+")").attr("selected", "selected");
                    $("#sortch-styler .jq-selectbox__select-text").html( $("#sortch option:selected" ).html() );
                    sort = _data[key];
                }else if( key == 'search' ){
                    $("#serch_string").val( _data[key] );
                }else{
                    var inputs = $("input." + key + "_chbox");

                    inputs.each(function(){
                        for( var it in _data[key] ){
                            if( this.name == _data[key][it] ){
                                $(this).attr("checked","checked");
                            }
                        }
                    });
                }
            }
        }

        $('input').trigger('refresh');

        serch_string();
    }
    function onError(request, textStatus, errorThrown){
        openNotification( "Доступ запрещен." );
    }
    $.ajax({
        url: '/teazer/default/filterload',
        type: 'GET',
        data: {
            id: id,
        },
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function setSelectSearch(id,name){
    $("#resultList").click();
    $("#resultList").html('<span class="filterN">' + name + '</span><span class="clearFilter" onclick="clearFilterSelect();">Очистить</span>');
}

function goToLending(id){
    function onSuccess(result){
        console.log(result);
        if( typeof result.status != 'undefined' && result.status == 'success' )
            document.location.href = '/landing/lnd/view/id/' + result.id;
        else if( typeof result.status != 'undefined' && result.status == 'fail' )
            openNotification(result.msg);
    }

    $.ajax({
        url: '/teazer/show/landlink',
        type: 'POST',
        data: { 'id': id },
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function goToTeaserCard(id){
    document.location.href = '/teazer/show/' + id;
}

function closeLayPopup(){
    $('#lay').removeClass('show');
    $('#lay').hide();
}

function preloadTsrCnt(){
    $(".preloadTsrCnt").show();
    $("small.right.colvo").html('');

    $.post('/teazer/default/tsrcnt', {'filterHash':filterHash}, function (data) {
        var result = $.parseJSON(data);
        if( typeof result.success != 'undefined' && result.success === true ){
            for( var jq in result.data ){
                var inputs = $("input." + jq + "_inp");
                if( inputs.length > 0 ){
                    inputs.each(function(){
                        var id = $(this).data('item');

                        if( typeof result.data[jq][id] != 'undefined' ){
                            $("small." + jq + "_" + id).html(result.data[jq][id]);
                        }else{
                            $("small." + jq + "_" + id).html('');
                        }
                    });
                }
            }
            $(".preloadTsrCnt").hide();
        }else if( typeof result.success != 'undefined' && result.success === false ){
            setTimeout(function(){
                preloadTsrCnt();
            },2000);
        }else if( typeof result.data != 'undefined' && result.data == '-1' ){
            openNotification('Для подгрузки количества, установите редис и добавьте в исключение домен');
        }
    });
}

function loadFreeCountAll(){
    
    $("#tiz_count_all").html('<img src="/images/loading.gif" class="l-min-pr">');

    $.post('/teazer/show/tizcount/mod/all', {}, function (result) {
        if( result != '' ){
            $("#tiz_count_all").html(result);
            $('#tiz_count').html(result);
        }
        else{
            $("#tiz_count_all").html(0);
            $('#tiz_count').html(0);
            $("#freeAccessTeaser").hide();
        }
    });
}


function validateResolution(obj)
{
    if(obj.val()!='' || obj.val()!=0)
    {
        var n = parseInt(obj.val(), 10); 
        if(isNaN(n)){obj.val(0);}
        if(/[^[0-9]/.test(obj.val())){obj.val(0);}
        if(n>600){obj.val(600);}
    }
}

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

function checkCats(cat_id){
    if( ads_id.length < 1 ){
        openNotification("Выберите тизеры");
        return false;
    }

    if( confirm( "Вы действительно хотите определить категорию тизеров?" ) ){
        $.post('/teazer/cats/teaser', {"ads_id":ads_id,'cat_id':cat_id}, function (result) {
            var data = $.parseJSON(result);
            if( typeof data.success != 'undefined' && data.success === true )
                openNotification("Категория тизеров определена (" + ads_id.length + ")");
        });
    }
}

function checkCatsLnd(cat_id){
    if( ads_id.length < 1 ){
        openNotification("Выберите тизеры");
        return false;
    }

    if( confirm( "Вы действительно хотите определить данные лендинги в данную категорию?" ) ){
        $.post('/teazer/cats/landing', {"ads_id":ads_id,'cat_id':cat_id}, function (result) {
            var data = $.parseJSON(result);
            if( typeof data.success != 'undefined' && data.success === true )
                openNotification("Категория тизеров определена (" + data.cnt + ")");
        });
    }
}

function getImages(){
    if( ads_id.length < 1 ){
        openNotification("Выберите тизеры");
        return false;
    }

    if( confirm( "Вы действительно хотите получить картинки для выделенных тизеров?" ) ){
        $.post('/teazer/imager/save', {"ads_id":ads_id}, function (result) {
            var data = $.parseJSON(result);
            if( typeof data.success != 'undefined' && data.success === true )
                openNotification(data.msg);
            else
                openNotification("Обновить изображения не удалось, возможно источник еще не был добавлен");
        });
    }
}


function resize(){
    var mw = $('.tbl').width();

    if( mw > 1500 )
        $('.show1').show();
    else
        $('.show1').hide();

    if( mw > 1800 ){
        $('.tbl .hideViewSn').hide();
        $('.tbl .tabSnColumn').show();
        $('.show2').show();
    }
    else{
        $('.tbl .hideViewSn').show();
        $('.tbl .tabSnColumn').hide();
        $('.show2').hide();    
    }
}

/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});