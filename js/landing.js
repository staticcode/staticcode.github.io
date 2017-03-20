var sim_page = 1;
var similar_sort = 'teaser_cnt';
var similar_sidx = 'DESC';
var preland_sort = 'teaser_cnt';
var preland_sidx = 'DESC';
var land_sort = 'teaser_cnt';
var land_sidx =	'DESC';
var tn_sidx =	'DESC';
var tn_sort =	'teasers';
var tn_ts = new Array();

function landpage(ppage){
	page = ppage;
	var b_id = '#landing_tab';
	openPreloader();
 	$.post('/landing/default/show',{'page':page,'sort':sort,'lim':limit,'sidx':sidx},function(result){
		closePreloader();
		$("#landing_tab").html(result);
		preloaderEnd( b_id );
	});
}

function serch_string( controller ){
	var text = $("#serch_string").val();

	function onSuccess(response){
		if( response.status == 'success' && controller == 'default' ) landpage(1);
		if( response.status == 'success' && controller == 'preland' ) prelandpage(1);
    }

	$.ajax({
		url: '/landing/' + controller + '/searchadd',
		type: 'GET',
		data: {'search':text},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function sort_ch( id, controller ){

	if( id == 'Выберите тизерную сеть' ){
		id = '';
	}

	function onSuccess(response){
		if( response.status == 'success' && controller == 'default' ) landpage(1);
		if( response.status == 'success' && controller == 'preland' ) prelandpage(1);
    }

	$.ajax({
		url: '/landing/' + controller + '/tnadd',
		type: 'GET',
		data: {'tn_id':id},
		dataType: 'json',
		success: onSuccess,
		cache: false
	}); 
}

function sortGeo(geo_id){
	function onSuccess(response){
		if( response.status == 'success' )
			prelandpage(1);
    }

	$.ajax({
		url: '/landing/preland/geoadd',
		type: 'GET',
		data: {'geo_id':geo_id},
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

function selectDate( controller ){
	var df = $("#date_from_text").html();
	var dl = $("#date_to_text").html();

	function onSuccess(response){
		closePreloader();
		if( response.status == 'success' && controller == 'default' ) landpage(1);
		if( response.status == 'success' && controller == 'preland' ) prelandpage(1);
    }
    openPreloader();
	$.ajax({
		url: '/landing/' + controller + '/fdateadd',
		type: 'GET',
		data: {'df':df,'dl':dl},
		dataType: 'json',
		success: onSuccess,
		cache: false
	}); 
}

function tninfo(){
	//$("#tninfo").html(getPreloader());
	openPreloader();
 	$.post('/landing/' + curr_controller + '/tninfo',{'sort':tn_sort,'sidx':tn_sidx,'id':curr_id},function(result){
		closePreloader();
		$("#tninfo").html(result);
	});
}

function similaDomain(){
	var b_id = '#similar_domain';
	//preloaderStart( b_id );
	openPreloader();
 	$.post('/landing/' + curr_controller + '/similarurl',{'sort':similar_sort,'sidx':similar_sidx,'page':sim_page,'url':curr_url,'id':curr_id},function(result){
		closePreloader();
		$("#similar_domain").html(result);
		//preloaderEnd( b_id );
	});
}

function prelanInfo(page){
	var b_id = '#preland_list';
	//preloaderStart( b_id );
	openPreloader();
 	$.post('/landing/default/preland',{'id':curr_id,'page':page,'sort':preland_sort,'sidx':preland_sidx},function(result){
		closePreloader();
		$("#preland_list").html(result);
		//preloaderEnd( b_id );
	});
}

function prelandpage(ppage){
	page = ppage;
	var b_id = '#landing_tab';
	//preloaderStart( b_id );
 	openPreloader();
 	$.post('/landing/preland/show',{'page':page,'sort':sort,'lim':limit,'sidx':sidx},function(result){
		closePreloader();
		$("#landing_tab").html(result);
		//preloaderEnd( b_id );
	});
}

function sordpreland( field ){
	if( sidx == 'ASC' ) sidx = 'DESC';
	else sidx = 'ASC';
	
	sort = field;
	prelandpage(1);
}

function similarPager(page){
	sim_page = page;
	similaDomain();
}

function sordSimilarLand( sort ){
	similar_sort = sort;
	if( similar_sidx == 'DESC' )
		similar_sidx = 'ASC';
	else
		similar_sidx = 'DESC';
	similaDomain();
}

function sordPreLand( sort ){
	if( preland_sidx == 'DESC' ) preland_sidx = 'ASC';
	else preland_sidx = 'DESC';
	
	preland_sort = sort;
	prelanInfo(1);
}

function showLandingTeaser( k ){
	var ids = tn_ts[k];

	function onSuccess(response){
		if( response.status == 'success' )
			return true;
		else 
			return false;
    }

	$.ajax({
		url: '/teazer/default/landteaser',
		type: 'POST',
		data: {'ids':ids},
		dataType: 'json',
		success: onSuccess,
		cache: false
	});
}

function showSimLandTeaser( type, id ){
	$.post('/landing/' + curr_controller + '/' + type + 'teaser',{'id':id},function(result){
		return true;
	});
}

function preloaderStart( id ){
	var block = $(id);
	if( block.html() == '' ) block.html( getPreloader() );
	else{
		$( id + ' .tiz_soc_list_table' ).prepend( "<div class='main-blocker'><div class='blocker'>&nbsp;</div><div class='loader-img'>&nbsp;</div></div>" );
	    $(id + " .blocker").height( block.height() );
	    $(id + " .blocker").width( block.width() );
	}
}

function preloaderEnd( id ){
	$( id + ' .main-blocker' ).remove();
}

/*function onKeys(e, controller){
    e = e || window.event;
    if (e.keyCode === 13) {
    	serch_string(controller);
    }
    return false;
}*/

function showLndNoAcces(href, land){
	if( land ) $("#typeMsg").html('посадочным страницам');
	else $("#typeMsg").html('прелендингам');

	$("#demoCard").attr('href', href);
	$("#ofpopup").show();
}

function showNoTsAcces(){
	$("#offtspopup").show();
}

/* load lending from prelanding card */
function landInfo(page){
	var b_id = '#land_list';
	//preloaderStart( b_id );
	openPreloader();
 	$.post('/landing/preland/land',{'id':curr_id,'page':page,'sort':land_sort,'sidx':land_sidx},function(result){
		closePreloader();
		$("#land_list").html(result);
		//preloaderEnd( b_id );
	});
}

/*function prelandpage(ppage){
	page = ppage;
	var b_id = '#landing_tab';
	//preloaderStart( b_id );
 	openPreloader();
 	$.post('/landing/preland/show',{'page':page,'sort':sort,'lim':limit,'sidx':sidx},function(result){
		closePreloader();
		$("#landing_tab").html(result);
		//preloaderEnd( b_id );
	});
}*/

function sordLandFromPlndCard( field ){
	if( land_sidx == 'ASC' ) land_sidx = 'DESC';
	else land_sidx = 'ASC';
	
	land_sort = field;
	landInfo(1);
}

function sordTnLand(sort){
	tn_sort = sort;
	if( tn_sidx == 'DESC' )
		tn_sidx = 'ASC';
	else
		tn_sidx = 'DESC';
	tninfo();
}