var trig_view = "";
var linkpage = 0;

var page = 1;
var lim = 50;
var sort= 1;
var ads_id = new Array();
var __app = new Array();

var defaultFilter = true;
var reload = true;
var freeBase = false;

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

function tizpage(param){
	page = ( typeof param == 'undefined' ? page : param );
	//page = param;
	openPreloader();
	$("#teazers-block").html(' Загрузка ... ');
	$.post('/social/show/list',{'param':trig_view,'page':page,'sort':sort,'lim':lim,'free':freeBase,'filterHash':filterHash},function(result){
		__app.loadinfo = new Array();
		closePreloader();
		$("#teazers-block").html(result);
		setPanelBoxHeight();
		scrollToTop();

		if (typeof $.browser != 'undefined' && $.browser.msie) {
            $('.teaz-center').css('width', ( $('.teaz-center').width() - 40 ) );
        }

        $("#ui-id-1").hide();
	});
}

function aply_filter(mod, name){
	$("#submit-filter").hide();
    var idtnid = new Array();
    var geonm = new Array();
    var typeid = new Array();
    var sex = new Array();
    var statusaccid = new Array();
    var typelandingid = new Array();
    var age = new Array();
    var target = new Array();
    var advType = new Array();
    if (typeof name !== 'undefined') {
   		var fname = name;
    } else {
   		var fname = 0;
    }

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
    $("#target .target_chbox").filter(":checkbox:checked").each(function(){
		target.push($(this).attr("name"));
    });

    $("#adv_type .adv_type_chbox").filter(":checkbox:checked").each(function(){
		advType.push($(this).attr("name"));
    });

    day_on_count = $("#day_on_count").val();
	day_off_count = $("#day_off_count").val();
	datepicker = $("#date_from_text").html();
	datepicker2 = $("#date_to_text").html();

	var newAds = ( $('input[name=new_ads]:checked').length > 0 ? 1 : 0 );
	var slinks = ( $('input[name=links]:checked').length > 0 ? 1 : 0 );

	var search = $("#serch_string").val();
	if( search == 'Введите ключевое слово или адрес сайта' ) search = '';

	var ads_and = ( $("input[name=ads_and]:checked").length > 0 ? 1 : 0 );

  	function onSuccess( _data ){
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

	function onError( request, textStatus, errorThrown ){
		openNotification("Ошибка фильтрации!!!");
	}

	$.ajax({
		url: '/social/default/filteradd',
		type: 'POST',
		data: {
			'new_ads': newAds,
			idtnid : idtnid,			
			geonm : geonm,
			typeid : typeid,
			sex : sex,
			statusaccid : statusaccid,
			typelandingid : typelandingid,
			age : age,
			day_on_count : day_on_count,
			day_off_count : day_off_count,
			datepicker : datepicker,
			datepicker2 : datepicker2,
			search: search,
			links: slinks,
			target: target,
			ads_and:ads_and,
			adv_type:advType,
			filterHash: filterHash,
			fname: fname,
		},
		dataType: 'json',
		success: onSuccess,
		error: onError,		
		cache: false
	}); 
}

function reset_filter(){
	$("#resultList").html('Выбрать настройки фильтра');
	$("#submit-filter").hide();
	var chbx = $(".filter input[type=checkbox]");
	chbx.each(function(){
		$(this).removeAttr("checked");
	});
	var chbx = $(".filter div.jq-checkbox.checked");
	$("#geotarg .geo_chbox ").removeAttr("checked");
	$("#geotarg .geo_chbox ").trigger('refresh');
	
	chbx.each(function(){
        if(!$(this).hasClass('geo_chbox'))
			$(this).removeClass("checked");
	});

	$(".filter-acc-one").removeClass("leftFilterActiveBg");
	
	$(".reset-filters").hide();

	unselectPeriod();
	unselectLife();
	unsetHeaderFilter();

	function onSuccess( _data ){
		defaultFilter = true;
		if( controller_id == 'favorites' ) favtizpage(1);
		else tizpage(1);
    }
	function onError( request, textStatus, errorThrown ){
		openNotification("Неудалось сбросить фильтр");
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

function save_filter(filtername) {
	if( defaultFilter ){
        popunderShow('<p>Вы пытаетесь сохранить настройки фильтров по умолчанию.<br> Для успешного сохранения выберите необходимые значения фильтров и нажмите сохранить настройки.</p>');
        return false;
    }
	
    /*var filtername = prompt('Введите название фильтра', "");

    if( filtername === false ) return false;*/

    filtername = filtername.replace(/^\s*/,'').replace(/\s*$/,'');

    if( filtername == '' ){
        openNotification('Вы не ввели название фильтра');
        return false;
    }

    /*if( filterName.indexOf( filtername ) != -1 ){
    	openNotification("Такое имя фильтра уже существует!");
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
        }
    }

    function onError(request, textStatus, errorThrown){
    	openNotification("Фильтр сохранить неудалось!");
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

function aply_filter_label(){
    $("#submit-filter").hide();
    aply_filter();
}

function serch_string(name){
	$("#ui-id-1").hide();
	aply_filter(false, name);
	// aply_filter(mod, fname);
}

function sort_ch(param){
	sort = param;
    aply_filter();
}

function pg_ch(param){
	$(".onpage").removeClass("selected");
	$(".pcheck_" + param).addClass("selected");

	var start = ( page - 1 ) * lim;
    var newPage = (Math.floor(start/param)+1);

    page = newPage;
    lim = param;

	if( controller_id == 'favorites' )
		favtizpage(page);
	else
		tizpage(page);
}

function goToDetailInfo( id ){
	document.location.href = "/social/show/" + id;
}

function load_desc_info(block){
    // console.log(block);
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

        //set new height = popupInnerHeight
        setTimeout(function() {
            var popup = block.find('.tzbl_popup_block');
            var popupInner = block.find('.tzbl_popup_right');
            var popupHeight = popup.height();
            var blockHeight = block.height();
            var popupInnerHeight = popupInner.height();

            if (popupHeight < popupInnerHeight + 20) {
                popup.height(popupInnerHeight + 20);
            }

        }, 100);
	}

	$.ajax({
		url: '/social/show/detailinfo',
		type: 'POST',
		data: {'id':id},
		dataType: 'text',
		success: onSuccess,
		cache: false
	});
}

function exports(method){
	if( ads_id.length == 0 ){
		openNotification("Не выбрано ни одно объявление!");
		return false;
	}

	/*if( access == 0 ){
        openNotification( "Для тарифа Бесплатный выгрузка в " + method + " недоступна" );
        return false;
    }*/

	window.location = '/zip/socialm/?method=' + method + "&ads=" + ads_id.join(',');
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

        if( _data.day_on_count )
    	{
    		$("#day_on_count").val( _data.day_on_count );
    		lifeSlider.update({from: _data.day_on_count});
    	}
		if( _data.day_off_count )
		{
			$("#day_off_count").val( _data.day_off_count );
			lifeSlider.update({to: _data.day_off_count});
		}
		if( _data.datepicker ) $("#datepicker").val( _data.datepicker );
		if( _data.datepicker2 ) $("#datepicker2").val( _data.datepicker2 );

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
				var inputs = $("input." + key + "_chbox");

				inputs.each(function(){
					for( it in _data[key] ){
						if( this.name == _data[key][it] )
							$(this).attr("checked","checked");
					};
				});
			}
		}
 
		$('input').trigger('refresh');

		serch_string(name);
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
    $("#resultList").html('<span class="filterN">' + name + '</span><span class="clearFilter" onclick="clearFilterSelect();">Очистить</span>');
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
        function onError(){
        	openNotification("Удалить фильтр не удалось.");
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

function revDelFilter(id){
	closeNotification();
    $.post('/social/default/revfilter/id/' + id, {}, function (result) {
        if( result != '' ){
            $("#filtersList").append(result);
            $("#resultList").removeClass("noActForm");
            $("#blockMsg").html('Фильтр восстановлен').show();
            //openNotification("Фильтр восстановлен");
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

function favtizpage(param){
	page = param;
	openPreloader();
	$("#teazers-block").html(' Загрузка ... ');
	$.post('/social/favorites/list',{'param':trig_view,'page':page,'sort':sort,'lim':lim},function(result){
		closePreloader();
		$("#teazers-block").html(result);
	});
}

function del_mark( oid, mark ){
	if( !confirm( "Вы действительно хотите удалить метку?" ) ){
        return false;
    }

	function onSuccess(result){
		if( result.success === true ){
			favtizpage(1);
			$( '.msb_one.order_' + oid ).remove();
		}
	}

	function onError(){
		openNotification("Удалить метку неудалось!");
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

function add_mark(){
	if( ads_id.length == 0 ){
		openNotification("Выберите объявления!");
		return false;
	}

	$( ".hide" ).css("display","inline-block");
	$( ".mark_soc_link" ).css("display","none");
}

function save_mark()
{
	var markname = $("#new_mark").val();
	if(markname === '')	{
		openNotification("Название метки не может быть пустым!");
		return false;
	}

	function onSuccess(result){
		if( result.success === true ){
			var mcount = $( ".num_" + result.mark ).html();
			if( typeof mcount != 'undefined' ){
				mcount = parseInt(mcount) + parseInt(result.mcnt);
				$(".num_" + result.mark ).html( mcount );
			}
			else{
				var k = randomByLength(2,3);
				var row = '<div class="msb_one order_' + k + '">'+
				'<a class="msb_l" href="javascript: void(0);" onclick="show_mark('+"'"+result.mark+"', this"+');">'+
				'<span class="msb_l_name">'+ result.mark +'</span>'+
				'<span class="msb_l_num num_'+ result.mark +'">' + result.mcnt + '</span></a>'+
				'<a class="msb_del" onclick="del_mark( ' + k + ", '"+ result.mark +"'" + ' );"></a></div>';
				$(".mark_soc_box .msb_list").append(row);
			}
			$("#new_mark").val('');
		}
	}
	function onError(){
		openNotification("Добавить метку неудалось!");
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
		openNotification("Не удалось выбрать метку!");
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

function preloadTsrCnt(){
    $(".preloadTsrCnt").show();
    $("small.right.colvo").html('');

    $.post('/social/default/tsrcnt', {'filterHash':filterHash}, function (data) {
        var result = $.parseJSON(data);
        if( typeof result.success != 'undefined' && result.success === true ){
            for( jq in result.data ){
                var inputs = $("input." + jq + "_inp");
                inputs.each(function(){
                	var mbl = $(this).closest('.filter-acc-cont');
                	if( typeof mbl[0] != 'undefined' ){
                		var parent = mbl[0];
                		if( $(parent).find("input:checked").length == 0 || $(this).prop('checked') ){
		                    var id = $(this).data('item');
		                    if( typeof result.data[jq][id] != 'undefined' ){
		                        $("small." + jq + "_" + id).html(result.data[jq][id]);
		                    }else{
		                        $("small." + jq + "_" + id).html('');
		                    }
                		}
                	}
                });
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

    $.post('/social/show/adscount/mod/all', {}, function (result) {
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

function getImageNotExist(){
	$.post('/social/imager/save', {'ads_id':ads_id}, function (result) {
        openNotification('Картинки обновлены');
    });
}

function getLndLink(id, e){
	$.post('/social/show/lndurl', { 'id':id }, function (data) {
        var result = $.parseJSON(data);
        if( typeof result.success != 'undefined' && result.success === true ){
        	$(e).attr('href', result.href ).removeAttr('onclick');
        	document.getElementById('goTolnd_' + id).click();
        	//.attr('target', '_blank' )
        	//$(e).click();
        }else{
            openNotification('Для данного тизера карточка посадочной страницы отсутствует');
            $(e).addClass('noActForm noclc');
        }
    });
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