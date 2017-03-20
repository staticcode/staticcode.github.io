function showOffersList(page){
	openPreloader();
	$.post('/offers/default/show', {'page':page}, function (result) {
		closePreloader();
		$("#offers_tab").html(result);
	});
}

function addSearch(){
	var search = $("#serch_string").val();

	if( search == "Поиск по названию оффера" )
		search = '';

	$.post('/offers/default/searchadd', {'search':search}, function (result) {
		showOffersList(1);
	});
}

function sortByH(val, field){
	$.post('/offers/default/sortadd', {'field':field,'val':val}, function (result) {
		showOffersList(1);
	});
}

function showOfferTraf(page){
	var id = $("#off_id").val();
	openPreloader();
	$.post('/offers/default/offinfo', {'method':'sourceTraf','params':{'page':page,'id':id}}, function (result) {
		closePreloader();
		$("#source_tab").html(result);
	});
	//console.log(page);
}

function showLikeOffer(page){
	var id = $("#off_id").val();
	openPreloader();
	$.post('/offers/default/offinfo', {'method':'likeOffers','params':{'page':page,'id':id}}, function (result) {
		closePreloader();
		$("#offers_tab").html(result);
	});
}

function showLandingOffer(page){
	var id = $("#off_id").val();
	openPreloader();
	$.post('/offers/default/offinfo', {'method':'landingOffers','params':{'page':page,'id':id}}, function (result) {
		closePreloader();
		$("#s-landings_tab").html(result);
	});
}

function showPrelandingOffer(page){
	var id = $("#off_id").val();
	openPreloader();
	$.post('/offers/default/offinfo', {'method':'prelandingOffers','params':{'page':page,'id':id}}, function (result) {
		closePreloader();
		$("#s-preland_tab").html(result);
	});
}

function showTopTeasers(page){
	var id = $("#off_id").val();
	openPreloader();
	$.post('/offers/default/offinfo', {'method':'topTeasers','params':{'page':page,'id':id}}, function (result) {
		closePreloader();
		$("#topTesers_tab").html(result);
	});
}

function sortFilters(val, field, mod, callback){
	$.post('/offers/default/sortviewfilter', {'mod':mod,'field':field,'val':val}, function (result) {
		callback(1);
	});
}

function dateSTrafApply(){
	var f = $("#traffrom_text").html();
	var l = $("#trafto_text").html();

	sortFilters({'f':f,'l':l}, 'date', 'traf', showOfferTraf);
}

function sortFiltersApply(val, sort, field, mod, callback){
	sortFilters({'sord':val,'sort':sort}, field, mod, callback);
}

function showTeaserBySource(tn){
	var id = $("#off_id").val();
	$.post('/offers/default/teaserview', {'mod':'source','tn':tn,'offer_id':id}, function (result) {
		var answer = $.parseJSON(result);
		if( typeof answer.status != 'undefined' && answer.status === true ){
			//document.location.href = "/teazer/default/index/land/teaser/";
		}
		else
			return false;
	});
}

function showTeaserByLand(lnd_id, mod){
	var id = $("#off_id").val();
	$.post('/offers/default/teaserview', {'mod':mod,'lnd_id':lnd_id,'offer_id':id}, function (result) {
		var answer = $.parseJSON(result);
		if( typeof answer.status != 'undefined' && answer.status === true ){
			//document.location.href = "/teazer/default/index/land/teaser/";
		}
		else
			return false;
	});
}