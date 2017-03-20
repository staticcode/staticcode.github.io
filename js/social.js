var trig_view = "";
var linkpage = 0;

var page = 1;
var lim = 50;
var sort= 1;
var ads_id = new Array();
var __app = new Array();
var freeBase = false;

$(document).ready(function(){
	$("#new_mark").change(function(){
		$( "div.hide" ).css("display","none");
		$( "div.mark_soc_link" ).css("display","inline-block");
		save_mark();
	});

	$("#datepicker").on("click",function(){
		$(this).next().click();
	});
	$("#datepicker2").on("click",function(){
		$(this).next().click();
	});
	$(".mask").on("click",function(){
        $("#bubble_date").css("display","none");
        $(".mask").css("display","none");
    });
    /*$(".stfilters").on("click",function(){
        $(".mask").css("display","block");
    });*/
});

function t_view_ch(param){
	trig_view = param;
	$("#teazers-block").html(' Загрузка ... ');
	$("#block_b").removeClass('active');
	$("#list_b").removeClass('active');

 	if( trig_view=="list" )
 	{
		$("#teazers-block").removeClass('teazers-block');
		//$("#teazers-block").addClass('teazers-block-list');
		$("#list_b").addClass('active');
	}else{
		//$("#teazers-block").removeClass('teazers-block-list');
		$("#teazers-block").addClass('teazers-block');
		$("#block_b").addClass('active');
		trig_view="block";
	}

	if( controller_id == 'favorites' )
        favtizpage(page);
    else
        tizpage(page);
}

function tizpage(param)
{
	page = param;
	$("#teazers-block").html(' Загрузка ... ');
	openPreloader();
	$.post('/social/show/list',{'param':trig_view,'page':page,'sort':sort,'lim':lim,'free':freeBase},function(result){
		closePreloader();
		$("#teazers-block").html(result);
		setPanelBoxHeight();
		scrollToTop();

		if ($.browser.msie) {
            $('.teaz-center').css('width', ( $('.teaz-center').width() - 40 ) );
        }
	});
}

function aply_filter(){
    var idtnid = new Array();
    var geonm = new Array();
    var typeid = new Array();
    var sex = new Array();
    var statusaccid = new Array();
    var typelandingid = new Array();
    var age = new Array();

  	$("#tn .teaz_chbox ").filter(":checkbox:checked").each(function(){
		idtnid.push($(this).attr("name"));
    });
    $("#geotarg .geo_chbox ").filter(":checkbox:checked").each(function(){
		geonm.push($(this).attr("name"));
    });
	$("#imgtype .type_chbox ").filter(":checkbox:checked").each(function(){
		typeid.push($(this).attr("name"));
    });
	$("#gender .sex_chbox ").filter(":checkbox:checked").each(function(){
		sex.push($(this).attr("name"));
    });
	$("#familyStatus .status_chbox ").filter(":checkbox:checked").each(function(){
		statusaccid.push($(this).attr("name"));
    });
	$("#pageType .landing_chbox ").filter(":checkbox:checked").each(function(){
		typelandingid.push($(this).attr("name"));
    });
    $("#age .age_chbox").filter(":checkbox:checked").each(function(){
		age.push($(this).attr("name"));
    });

    day_on_count = $("#day_on_count").val();
	day_off_count = $("#day_off_count").val();
	datepicker = $("#date_from_text").html();
	datepicker2 = $("#date_to_text").html();

	var newAds = ( $('input[name=new_ads]:checked').length > 0 ? 1 : 0 );

	var search = $("#serch_string").val();
	if( search == 'Введите ключевое слово или адрес сайта' ) search = '';

  	function onSuccess( _data ){
	  	if( controller_id == 'favorites' )
			favtizpage(1);
		else
			tizpage(1);
    }

	function onError( request, textStatus, errorThrown ){
		alert("Ошибка фильтрации!!!");
	}

	$.ajax({
		url: '/social/default/filteradd',
		type: 'GET',
		data: {
			'new_ads': newAds,
			'idtnid': idtnid,
			'geonm': geonm,
			'typeid': typeid,
			'sex': sex,
			'statusaccid': statusaccid,
			'typelandingid': typelandingid,
			'age': age,
			'day_on_count': day_on_count,
			'day_off_count': day_off_count,
			'datepicker': datepicker,
			'datepicker2': datepicker2,
			'search': search
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

function reset_filter(){
	var chbx = $(".filter input[type=checkbox]");
	chbx.each(function(){
		$(this).removeAttr("checked");
	});
	var chbx = $(".filter div.jq-checkbox.checked");
	chbx.each(function(){
        if(!$(this).hasClass('geo_chbox'))
			$(this).removeClass("checked");
	});

	$(".filter-acc-one").removeClass("leftFilterActiveBg");

	unselectPeriod();
	unselectLife();
	unsetHeaderFilter();

	function onSuccess( _data ){
		if( controller_id == 'favorites' ) favtizpage(1);
		else tizpage(1);
    }
	function onError( request, textStatus, errorThrown ){
		alert("Неудалось сбросить фильтр");
	}

	$.ajax({
		url: '/social/default/filterreset',
		dataType: 'json',
		success: onSuccess,
		error: onError,
		cache: false
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
}

function serch_string(){
	aply_filter();
}

function save_filter() {
    var filtername = prompt('Введите название фильтра', "");

    if( filtername === false ) return false;

    filtername = filtername.replace(/^\s*/,'').replace(/\s*$/,'');

    if( filtername == '' ){
        openNotification('Вы не ввели название фильтра');
        return false;
    }

    if( filterName.indexOf( filtername ) != -1 ){
        alert("Такое имя фильтра уже существует!");
        return;
    }

    var search = $("#serch_string").val();
    if( search == 'Введите ключевое слово или адрес сайта' ) search = '';

    function onSuccess(response){
    	if( response == 'exist' ){
            openNotification('Такое имя фильтра уже существует!');
            return false;
        }

        if( response != '' )
            $("#filtersList").append(response);
    }

    function onError(request, textStatus, errorThrown){
        alert("Фильтр сохранить неудалось!");
    }

    $.ajax({
        url: '/social/default/filtersave',
        type: 'POST',
        data: {
            filtername: filtername,
            sort: sort,
            search: search
        },
        dataType: 'text',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function pg_ch(param){
	$(".onpage").removeClass("selected");
	$(".pcheck_" + param).addClass("selected");
	lim = param;
	if( controller_id == 'favorites' )
		favtizpage(1);
	else
		tizpage(1);
}

function sort_ch(param){
	if( !access ){
		showNoAccessBlock();
		return false;
	}

	sort = param;
    aply_filter();
}

function search(param)
{ //sort = param; tizpage(1);
}

var f_show = 1;
function filterhide(){if (f_show == 1) { $("#left-panel-box").hide('scale'); f_show = 0; } else { $("#left-panel-box").show('explode'); f_show = 1; }}

function getSimilarAdByLink( link )
{
	var similar_ads = $("#teazers-block_link").html();

	if( similar_ads != '' || link == '' ) return true;

	$.post('/social/show/adinfo',{link:link,action:'simillink'},function(result){
		if( result != '' )
			$("#teazers-block_link").html( result );
		else
			$("#teazers-block_link").html( "Похожих тизеров не найдено!" );
	});
}

function sort_acc( sidx, sords )
{
	var ad_id = $("#ad_id").val();

	$(".view-preload").css("display","block");

	$.post('/social/show/accfilter',{'sidx':sidx,'sort':sords,'ad_id':ad_id},function(result){
		if( result != '' )
		{
			$(".view-preload").css("display","none");
			$("#acc-ad-info").html( result );
		}
	});
}

function audience_info(){
	if( !access ) return false;

	if( $("#similar_audience").html() != '' ) return true;

	var ad_id = $("#ad_id").val();

	$("#similar_audience").html(getPreloader());

	$.post('/social/show/adinfo',{'action':'audience','ad_id':ad_id},function(result){
		if( result != '' )
			$("#similar_audience").html( result );
		else
			$("#similar_audience").html( $("#notizerblock").html() );
	});
}

function count_view(){
	if( $("#similar_quantity").html() != '' ) return true;

	var ad_id = $("#ad_id").val();

	$("#similar_quantity").html(getPreloader());

	$.post('/social/show/adinfo',{'action':'countview','ad_id':ad_id},function(result){
		if( result != '' )
			$("#similar_quantity").html( result );
		else
			$("#similar_quantity").html( $("#notizerblock").html() );
	});
}

function updateCardInfo(){
    set_date();
    audience_info();
    count_view();
}


function set_date()
{
	var date_s = $("#date_from_text").html();
	var date_e = $("#date_to_text").html();

	$.ajax({
		url: '/social/default/filterdate',
		type: 'GET',
		dataType: 'json',
		data: {
			'date_start':date_s,
			'date_end':date_e
		},
	});
}

function accpage(param)
{
	var sort_p = $("#sort_p").val();
	var sidx_p = $("#sidx_p").val();
	var ad_id = $("#ad_id").val();
	var page = param;

	$(".view-preload").css("display","block");
	$.post('/social/show/accfilter',{'page':page,'sort':sort_p,'sidx':sidx_p,'ad_id':ad_id},function(result){
		if( result != '' )
		{
			$(".view-preload").css("display","none");
			$("#acc-ad-info").html(result);
		}
	});
}

function t_view_fav(param)
{
	trig_view = param;
	$("#teazers-block").html(' Загрузка ... ');
	$("#block_b").removeClass('active');
	$("#list_b").removeClass('active');

 	if( trig_view=="list" )
 	{
		$("#teazers-block").removeClass('teazers-block');
		//$("#teazers-block").addClass('teazers-block-list');
		$("#list_b").addClass('active');
	}else{
		//$("#teazers-block").removeClass('teazers-block-list');
		$("#teazers-block").addClass('teazers-block');
		$("#block_b").addClass('active');
		trig_view="block";
	}

	$.post('/social/favorites/list',{'param':trig_view,'page':page,'sort':sort,'lim':lim},function(result){
		$("#teazers-block").html(result);
	});
}

function favtizpage(param)
{
	page = param;
	$("#teazers-block").html(' Загрузка ... ');
	$.post('/social/favorites/list',{'param':trig_view,'page':page,'sort':sort,'lim':lim},function(result){
		$("#teazers-block").html(result);
	});
}

function simimgpage(param)
{
	page = param;
	var hash = $("#ad_hash").val();

	if( hash == '' ) return true;

	$("#teazers_block_img").html(getPreloader());
	$.post('/social/show/adinfo',{'param':trig_view,'page':page,'sort':sort,'lim':lim,'action':'similar','hash':hash},function(result){
		if( result != '' )
			$("#teazers_block_img").html(result);
		else
			$("#similar_img").html( $("#notizerblock").html() );
	});
}

function simlinkpage(param){
	if( !access ) return false;

	if( linkpage == param ) return false;
	linkpage = param;
	page = param;
	var link = $(".tst_about_right .link-hidden").html();

	if( typeof link == "undefined" ){
		$("#teazers_block").html( $("#notizerblock").html() );
		return false;
	}

	if( link == '' ) return true;

	$("#teazers_block").html(getPreloader());

	$.post('/social/show/adinfo',{'param':trig_view,'page':page,'sort':sort,'lim':lim,'action':'simillink','link':link},function(result){
		if( result != '' )
			$("#teazers_block").html(result);
		else
			$("#teazers_block").html( $("#notizerblock").html() );
	});
}

function del_mark( oid, mark )
{
	function onSuccess(result){
		if( result.success === true )
			$( '.msb_one.order_' + oid ).remove();
	}
	function onError(){
		alert( "Удалить метку неудалось!" );
	}

	$.ajax({
		url: '/social/favorites/delmark',
		type: 'POST',
		data: {'mark':mark},
		dataType: 'json',
		success: onSuccess,
		error: onError,
		cache: false
	});
}

function add_mark()
{
	if( ads_id.length == 0 )
	{
		alert( "Выберите объявления!" );
		return false;
	}

	$( ".hide" ).css("display","inline-block");
	$( ".mark_soc_link" ).css("display","none");
}

function save_mark()
{
	var markname = $("#new_mark").val();

	if(markname == ''){
		alert( "Выберите объявления!" );
		return false;
	}

	function onSuccess(result){
		if( result.success === true ){
			var mcount = $( ".num_" + markname ).html();
			if( typeof mcount != 'undefined' ){
				mcount = parseInt(mcount) + parseInt(result.mcnt);
				$(".num_" + markname ).html( mcount );
			}
			else{
				var k = randomByLength(2,3);
				var row = '<div class="msb_one order_' + k + '"><a class="msb_l" href="javascript: void(0);" onclick="show_mark('+"'"+markname+"', this"+');"><span class="msb_l_name">'+ markname +'</span><span class="msb_l_num num_'+ markname +'">' + result.mcnt + '</span></a><a class="msb_del" onclick="del_mark( ' + k + ", '"+ markname +"'" + ' );"></a></div>';
				$(".mark_soc_box .msb_list").append(row);
			}
			$("#new_mark").val('');
		}
	}
	function onError(){
		alert( "Добавить метку неудалось!" );
	}

	$.ajax({
		url: '/social/favorites/addmark',
		type: 'POST',
		data: {'mark':markname,'ads':ads_id},
		dataType: 'json',
		success: onSuccess,
		error: onError,
		cache: false
	});
}

function randomByLength(min,max){
	var a=0;while(!a||a.toString().length<min)
	a=parseInt(Math.random().toString().substr(2,max));
	return a;
}

function show_mark(mark, a){

	if( $(a).hasClass('mark-active') )
		var active = false;
	else
		var active = true;

	function onSuccess(result){
		if( result.success === true ){
			if( active === true )
				$(a).addClass('mark-active');
			else
				$(a).removeClass('mark-active');

			favtizpage(1);
		}
	}

	function onError(){
		alert( "Не удалось выбрать метку!" );
	}

	$.ajax({
		url: '/social/default/filtermark',
		type: 'POST',
		data: {'mark':mark,'state':active},
		dataType: 'json',
		success: onSuccess,
		error: onError,
		cache: false
	});
}

function show_more_info(div)
{
	console.log(div);
}

function load_desc_info(block){
	var id = block[0].id.substring(3);

	if( typeof __app.loadinfo != 'undefined' && __app.loadinfo.indexOf(id) == -1 ){
		__app.loadinfo.push(id);
	}else if( typeof __app.loadinfo == 'undefined' ){
		__app.loadinfo = [];
		__app.loadinfo.push(id);
	}
	else return true;

	function onSuccess(result){
		if( result != '' ){
			$("#popap_"+id).html(result);
		}



	}

	$.ajax({
		url: '/social/show/detailinfo',
		type: 'POST',
		data: {'ad_id':id},
		dataType: 'text',
		success: onSuccess,
		cache: false
	});
}

function exports(method){
	if( ads_id.length == 0 ){
		alert( "Не выбрано ни одно объявление!" );
		return false;
	}

	/*if( access == 0 ){
        openNotification( "Для тарифа Бесплатный выгрузка в " + method + " недоступна" );
        return false;
    }*/

	window.location = '/zip/socialnet/?method=' + method + "&ads=" + ads_id.join(',');
}

function goToDetailInfo( id ){
	document.location.href = "/social/show/" + id;
}

function getPreloader(){
    return '<div class="p4 center"><img src="/images/loading.gif" style="width:50px;"></div>';
}

function deleteFilter(id, name){
     if(confirm("Вы хотите удалить фильтр: " + name + " ?")){
        function onSuccess(result){
            if(result.status == 'ok')
                $(".fsi_" + id).remove();
        }
        function onError(){
            alert("Удалить фильтр не удалось.");
        }

		$.ajax({
			url: '/social/default/filterdel',
			type: 'POST',
			data: {'id':id},
			dataType: 'json',
			success: onSuccess,
			error: onError,
			cache: false
		});
    }
}

function useFilter(id,name){

	setSelectSearch(id,name);

    function onSuccess(_data){
		var chbx = $(".filter input[type=checkbox]");
		chbx.each(function(){
			$(this).removeAttr("checked");
		});
		var chbx = $(".filter div.jq-checkbox.checked");
		chbx.each(function(){
			$(this).removeClass("checked");
		});
		$(".filter-acc-one").removeClass("leftFilterActiveBg");
		unselectPeriod();
		unselectLife();

        if( _data.day_on_count ) $("#day_on_count").val( _data.day_on_count );
		if( _data.day_off_count ) $("#day_off_count").val( _data.day_off_count );
		if( _data.datepicker ) $("#datepicker").val( _data.datepicker );
		if( _data.datepicker2 ) $("#datepicker2").val( _data.datepicker2 );
		if( _data.age_from) $("#age_from").val(_data.age_from );
		if( _data.age_to) $("#age_to").val(_data.age_to );

		if( typeof _data.sort != "undefined" && _data.sort != '' ){
            $("#sortch :nth-child("+_data.sort+")").attr("selected", "selected");
            $("#sortch-styler .jq-selectbox__select-text").html( $("#sortch option:selected" ).html() );
            sort = _data.sort;
        }

        if( typeof _data.search != "undefined" && _data.search != '' )
            $("#serch_string").val( _data.search );

		for( var key in _data )
		{
			if( (key!="day_on_count") && (key!="day_off_count") && (key!="datepicker") && (key!="datepicker2") && (key!="age_from") && (key!="age_to") && (key!="search") && (key!="sort"))
			{
				var inputs = $("input[class='" + key + "_chbox']");

				inputs.each(function(){
					for( it in _data[key] ){
						if( this.name == _data[key][it] )
							$(this).attr("checked","checked");
					};
				});
			}
		}

		$('input').trigger('refresh');

		serch_string();
    }
    function onError(request, textStatus, errorThrown){
        openNotification( "Доступ запрещен." );
    }
    $.ajax({
        url: '/social/default/filterload',
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
    $("#resultList").html(name);
}