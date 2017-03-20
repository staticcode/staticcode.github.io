var sim_page = 1;
var similar_sort = 'tsrs_cnt';
var similar_sidx = 'DESC';
var preland_sort = 'tsrs_cnt';
var preland_sidx = 'DESC';
var land_sort = 'tsrs_cnt';
var land_sidx =	'DESC';
var tn_sidx =	'DESC';
var tn_sort =	'tsr_cnt';
var tn_ts = new Array();

function landpage(ppage){
	page = ppage;
	var b_id = '#landing_tab';
	var params = {
		'page':page,
		'sort':sort,
		'lim':limit,
		'sidx':sidx,
		'newLnd': ($('input.js-newLnd').prop('checked')) ? 1 : 0,
	};
	openPreloader();
 	$.post('/landing/lnd/show', params, function(result){
		closePreloader();
		$("#landing_tab").html(result);
		preloaderEnd( b_id );
	});
}

function preloaderEnd( id ){
	$( id + ' .main-blocker' ).remove();
}

function serch_string( act ){
	var text = $("#serch_string").val();

	if( text == 'Поиск по посадочным страницам' )
		text = '';

	function onSuccess(response){
		if( response.status == 'success' && act == 'lnd' ) landpage(1);
		if( response.status == 'success' && act == 'plnd' ) prelandpage(1);
    }

	$.ajax({
		url: '/landing/lnd/searchadd',
		type: 'GET',
		data: {'search':text,'act':act},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function sort_ch( e, act ){
	var id = e.value;
	var type = $(e).find('option:selected').data('type') || act == 'lnd' ? 2 : 1;

	if( id == 'Выберите тизерную сеть' ){
		id = '';
	}

	function onSuccess(response){
		if( response.status == 'success' && act == 'lnd' ) landpage(1);
		if( response.status == 'success' && act == 'plnd' ) prelandpage(1);
    }

	$.ajax({
		url: '/landing/lnd/tnadd',
		type: 'GET',
		data: {'tn_id':id,'act':act,'type':type},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function selectDate( act ){
	var df = $("#date_from_text").html();
	var dl = $("#date_to_text").html();

	function onSuccess(response){
		closePreloader();
		if( response.status == 'success' && act == 'lnd' ) landpage(1);
		if( response.status == 'success' && act == 'plnd' ) prelandpage(1);
    }
    openPreloader();
	$.ajax({
		url: '/landing/lnd/fdateadd',
		type: 'GET',
		data: {'df':df,'dl':dl,'act':act},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function selectShow( act ){
	var show = $("select#landing_select_show option:selected").val();

	function onSuccess(response){
		closePreloader();
		if( response.status == 'success' && act == 'lnd' ) landpage(1);
		if( response.status == 'success' && act == 'plnd' ) prelandpage(1);
    }
    openPreloader();
	$.ajax({
		url: '/landing/lnd/fshowadd',
		type: 'GET',
		data: {'show':show, 'act':act},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function sordland( field ){
	if( sidx == 'ASC' ) sidx = 'DESC';
	else sidx = 'ASC';

	sort = field;
	landpage(1);
}

function tninfo(){
	openPreloader();
 	$.post('/landing/' + curr_controller + '/info',{'method':'TnInfo','params':{'sort':tn_sort,'sidx':tn_sidx,'id':curr_id}},function(result){
		closePreloader();
		$("#tninfo").html(result);
	});
}

function sordTnLand(sort){
	tn_sort = sort;
	if( tn_sidx == 'DESC' )
		tn_sidx = 'ASC';
	else
		tn_sidx = 'DESC';
	tninfo();
}

function similaDomain(){
	openPreloader();
 	$.post('/landing/' + curr_controller + '/info',{'method':'SimilarUrl','params':{'sort':similar_sort,'sidx':similar_sidx,'page':sim_page,'url':curr_url,'id':curr_id}},function(result){
		closePreloader();
		$("#similar_domain").html(result);
	});
}

function sordSimilarLand( sort ){
	similar_sort = sort;
	if( similar_sidx == 'DESC' )
		similar_sidx = 'ASC';
	else
		similar_sidx = 'DESC';
	similaDomain();
}

function prelanInfo(page){
	var b_id = '#preland_list';
	openPreloader();
 	$.post('/landing/lnd/info',{'method':'preland','params':{'id':curr_id,'page':page,'sort':preland_sort,'sidx':preland_sidx}},function(result){
		closePreloader();
		$("#preland_list").html(result);
	});
}

function sordPreLand( sort ){
	if( preland_sidx == 'DESC' ) preland_sidx = 'ASC';
	else preland_sidx = 'DESC';

	preland_sort = sort;
	prelanInfo(1);
}

function prelandpage(ppage){
	page = ppage;
 	openPreloader();
 	$.post('/landing/plnd/show',{'page':page,'sort':sort,'lim':limit,'sidx':sidx},function(result){
		closePreloader();
		$("#landing_tab").html(result);
	});
}



function sordPlndList( field ){
	if( sidx == 'ASC' ) sidx = 'DESC';
	else sidx = 'ASC';

	sort = field;
	prelandpage(1);
}

function sortGeo(geo_id){
	function onSuccess(response){
		if( response.status == 'success' )
			prelandpage(1);
    }

	$.ajax({
		url: '/landing/plnd/geoadd',
		type: 'GET',
		data: {'geo_id':geo_id},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

/* get landings list by prelanding */
function landInfo(page){
	openPreloader();
 	$.post('/landing/plnd/info',{'method':'Landing','params':{'id':curr_id,'page':page,'sort':land_sort,'sidx':land_sidx}},function(result){
		closePreloader();
		$("#land_list").html(result);
	});
}

function sordLandFromPlndCard( field ){
	if( land_sidx == 'ASC' ) land_sidx = 'DESC';
	else land_sidx = 'ASC';

	land_sort = field;
	landInfo(1);
}

function showTeasers(e, type, param){
	$(e).removeAttr('onmouseover');
	function onSuccess(response) {
		if (typeof response.success != 'undefined' && response.success) {
			$(e).children().wrap('<a href="'+response.link+'" target="_blank"></a>');
			// createLink (e, response.link);
		}
	}
	$.ajax({
		url: '/landing/' + curr_controller + '/teasershow',
		type: 'POST',
		data: {'type':type,'param':param,'id':curr_id},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function showLndNoAcces(href, land){
	if( land ) $("#typeMsg").html('информация по посадочным страницам доступна');
	else $("#typeMsg").html('информация по прелендингам доступна');

	$("#demoCard").attr('href', href);
	$("#ofpopup").show();
}

function showNoTsAcces(){
	$("#offtspopup").show();
}

function unsetSearch(act){
	function onSuccess(response){
		if( typeof response.status != 'undefined' && response.status == 'success' ){
			if( act == 'plnd' ) prelandpage(1);
			else landpage(1);
		}
	}
	$.ajax({
		url: '/landing/lnd/searchadd',
		type: 'GET',
		data: {'search':'','act':act},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function similarPager(page){
	sim_page = page;
	similaDomain();
}

function handlerButtonsShow(model) {
	$('table.table-landing-list .link').on('click', function () {
		var self = $(this),
			id = self.data('id'),
			action = self.data('action');

		openPreloader();
		$.ajax({
			type: 'POST',
			url: '/landing/lnd/changeStatusShow',
			data: {id: id, model: model, action: action},
			success: function (response) {
				closePreloader();

				var data = JSON.parse(response);

				if (data.status == 'ok') {
					if (data.action == 'hide') {
						self.closest('tr').addClass('landing-hide');
					} else if (data.action == 'hideAll') {
						self.closest('tr').addClass('landing-hide');
						alert(data.message);
					} else if (data.action == 'show') {
						self.closest('tr').removeClass('landing-hide');
					} else if (data.action == 'showAll') {
						self.closest('tr').removeClass('landing-hide');
						alert(data.message);
					} else {
						alert('Что-то не так!');
					}
				} else {
					alert(data.message);
				}
			},
			error: function (data) {
				alert('Ошибка ' + data.status);
			}
		});
	});
}

function getCheckedIds() {
	var ids = [];
	$('input.landing-checkbox:checked').each(function () {
		ids.push($(this).data('id'));
		//if ($(this).is(':checked')) {
		//}
	});

	return ids;
}

function changeTypeLink(model) {
	var ids = getCheckedIds();
	if (ids.length) {
		if (confirm('Перевести отмеченые ссылки в другой тип?')) {

			openPreloader();
			$.ajax({
				type: 'POST',
				url: '/landing/lnd/changeTypeLink',
				data: {ids: ids, model: model},
				success: function (response) {
					closePreloader();

					var data = JSON.parse(response);

					if (data.status == 'ok') {
						data.jobIds.forEach(function (value) {
							$('.table-landing-list tr[data-id="' + value + '"]').remove();
						});
						alert(data.message);
					} else {
						alert(data.message);
					}
				},
				error: function (data) {
					alert('Ошибка ' + data.status);
				}
			});
		}
	} else {
		alert('Выберите лендинги');
	}
	return false;
}

function toRedirect(model) {
	alert('Еще не сделано ' + model);
}

function makeScreen(model) {
	var ids = getCheckedIds();
	if (ids.length) {
		if (confirm('Получить повторно скрины для выбранных ссылок?')) {

			openPreloader();
			$.ajax({
				type: 'POST',
				url: '/landing/lnd/makeScreen',
				data: {ids: ids, model: model},
				success: function (response) {
					closePreloader();

					var data = JSON.parse(response);

					if (data.status == 'ok') {
						data.items.forEach(function (item) {
							$('.table-landing-list tr[data-id="' + item.id + '"] div.land-window img').attr('src', item.screen);
						});
						$('input.landing-checkbox:checked').prop('checked', false).trigger('refresh');
						//$('.landing-checkbox').removeClass('checked');

						alert(data.message);
					} else {
						alert(data.message);
					}
				},
				error: function (data) {
					alert('Ошибка ' + data.status);
				}
			});
		}
	} else {
		alert('Выберите лендинги');
	}
	return false;
}

function createLink (e, link) {
	var a = document.createElement('a');
	a.href = link;
	a.target = '_blank';
	a.setAttribute('onclick', $(e).data('click'));
	a.innerHTML = $(e).html();
	$(e).replaceWith(a);
};