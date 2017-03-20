var ads_id = new Array();
var sort = false;

function exportsAd(method, id){
	if( access == false ){
        openNotification( "Для тарифа Бесплатный выгрузка в " + method + " недоступна" );
        return false;
    }

	window.location = '/zip/socialm/?method=' + method + "&ads=" + id;
}

function favoriteAdd(module, id){
	function onSuccess(result){
		if( result.success == true ){
			openNotification( "Объявление добавлено в избранное" );
		}
	}

	function onError(){
		alert( "Неудалось добавить объявления!" );
	}

	$.ajax({
		url: '/' + module + '/favorites/add',
		type: 'POST',
		data: {'ads_id':[id]},
		dataType: 'json',
		success: onSuccess,
		error: onError,
		cache: false
	});
}

function set_date(module, act){
	/*var date_s = $("#" + act + "from_text").html();
	var date_e = $("#" + act + "to_text").html();

	$.ajax({
		url: '/' + module + '/default/filterdate',
		type: 'GET',
		dataType: 'json',
		data: {'act':act,'date_start':date_s,'date_end':date_e},
	}); */
}

function simImgPage(page){
	var hash = $("#ad_hash").val();
	if( hash == '' ) return true;
  	var id = $("#ad_id").val();
  	var params = {
  		'method':'similarImg',
  		'params':{
  			'id':id,
  			'hash':hash,
  			'page':page,
  			'sort':(false !== sort) ? sort : 2,
  		}
  	};
  	openPreloader();
  	$.post('/' + module + '/show/adinfo', params, function(result){
			closePreloader();
  		if( result != '' ) $("#teazers_block_img").html(result);
			else $("#similar_img").html( $("#notizerblock").html() );
			setPanelBoxHeight();
  	});
}

function setSortMode(e, sm, callback) {
	sort = sm;
	callback(1);
}

function simLinkPage(page){
	//if( !access ) return false;

  	var link = $("#ad_url").val();
  	if( link != '' ){
  		var id = $("#ad_id").val();
  		var params = {
	  		'method':'similarLink',
	  		'params':{
	  			'id':id,
	  			'link':link,
	  			'page':page,
	  			'sort':(false !== sort) ? sort : 2,
	  		}
	  	};
  		openPreloader();
	    $.post('/' + module + '/show/adinfo', params, function(result){
	    	closePreloader();
	    	if( result != '' ) $("#teazers_block").html(result);
				else $("#teazers_block").html( $("#notizerblock").html() );
				setPanelBoxHeight();
  		});
  	}else{
  		$("#teazers_block").html( $("#notizerblock").html() );
  	}
}

function firstOpen(callback, del){
	$("#"+del).removeAttr('onclick');
	if (callback && typeof(callback) === "function") {
        callback(1);
    }
}

function audience_info(){
	if (!access) {
		$("#similar_audience").html($("#noaccess_auditore").html());
		return false;
	}
	var params = {
		'method': 'audience',
		'params': {
			'id': $("#ad_id").val(),
			'date_start': $("#audfrom_text").html(),
			'date_end': $("#audto_text").html()
		}
	};
	openPreloader();
	$.post('/' + module + '/show/adinfo', params, function(result){
		closePreloader();
		if (result != '') {
			$("#similar_audience").html(result);
		} else {
			$("#similar_audience").html($("#notizerblock").html());
		}
	});
}

function count_view(){
	if( !access ){
		$("#similar_quantity").html($("#noaccess").html() );
		return false;
	}
	var params = {
		'method': 'countView',
		'params': {
			'id': $("#ad_id").val(),
			'date_start': $("#cvfrom_text").html(),
			'date_end': $("#cvto_text").html()
		}
	};
	openPreloader();
	$.post('/' + module + '/show/adinfo', params, function(result){
		closePreloader();
		if (result != '') {
			$("#similar_quantity").html(result);
		} else {
			$("#similar_quantity").html($("#notizerblockcount").html());
		}
	});
}

/*function updateCardInfo(){
    set_date(module, 'aud');
    audience_info();
}*/

function getCviewInfo(pref){
	set_date(module, pref);
	if( pref == 'cv' )
		count_view();
	else
		audience_info();
}

function sort_acc( sidx, sords ){
	var id = $("#ad_id").val();
	openPreloader();
	setFilterAcc(sidx, sords);
	$.post('/' + module + '/show/accfilter',{'sort':sidx,'sord':sords,'id':id},function(result){
		closePreloader();
		if( result != '' )
			$("#acc-ad-info").html( result );
		else
			$("#acc-ad-info").html( $("#notizerblock").html() );
	});
}

function setFilterAcc(sort, sord){
	//$.post('/' + module + '/default/accfilter',{'sord':sord,'sort':sort},function(result){});
}

function accpage(param)
{
	var sort_p = $("#sort_p").val();
	var sidx_p = $("#sidx_p").val();
	var ad_id = $("#ad_id").val();
	var page = param;
	openPreloader();
	$(".view-preload").css("display","block");
	$.post('/' + module + '/show/accfilter',{'page':page,'sort':sort_p,'sord':sidx_p,'id':ad_id},function(result){
		closePreloader();
		if( result != '' )
		{
			$(".view-preload").css("display","none");
			$("#acc-ad-info").html(result);
		}
	});
}

function adsUncheck(){
	var id = $("#teaz-sin-tabs .ui-tabs-active")[0].id;

	if( id == 'li_similar_ads_link' ){
		tableUncheckAll('similar_ads_link');
	}
	else if( id == 'li_similar_img' ){
		tableUncheckAll('similar_img');
	}
}

function adsCheck(){
	var id = $("#teaz-sin-tabs .ui-tabs-active")[0].id;

	if( id == 'li_similar_ads_link' ){
		tableCheckAll('similar_ads_link');
	}
	else if( id == 'li_similar_img' ){
		tableCheckAll('similar_img');
	}
}

function tableCheckAll(mainId) {
	$('#' + mainId).find('.tbl_check').each(function () {
		var id = this.id;
		var uid = id.substring(3);
		if (ads_id.indexOf(uid) == -1) {
			ads_id.push(uid);
		}
	});

	$('#' + mainId).find('.tbl_check input').prop("checked", true);
	$('#' + mainId).find('.tbl_check input').trigger('refresh');

	$('#' + mainId).find('input.selectAll').prop("checked", true);
	$('#' + mainId).find('input.selectAll').trigger('refresh');

	$("#ad_cnt_check").html(ads_id.length);
}

function tableUncheckAll(mainId) {
	$('#' + mainId).find('.tbl_check').each(function () {
		var id = this.id;
		var uid = id.substring(3);
		var del = ads_id.indexOf(uid);
		if (del != -1) {
			$("#" + id + " input").prop("checked",false);
			ads_id.splice(del, 1);
		}
	});

	$('.tbl_check input').trigger('refresh');

	$('#' + mainId).find('input.selectAll').prop("checked", false);
	$('#' + mainId).find('input.selectAll').trigger('refresh');

	$("#ad_cnt_check").html(ads_id.length);
}