var netSort = 'tsr_cnt';
var netSord = 'DESC';
var geoSort = 'tsr_cnt';
var geoSord = 'DESC';
var landingSort = 'tsr_cnt';
var landingSord = 'DESC';
var __app = new Array();
var ads_id = new Array();

function searchRequest(){
	var search = $("#serch_string").val();

	if( search == '' || search == 'Введите адрес сайта' ){
		openNotification("Введите домен");
		return false;
	}

	search = toLink( search );
	$("#serch_string").val( search );

	if( access ) $("#serch_string").autocomplete("close");

	var post = {
		'search':search,
		'date':{
			'start':$('#date_from_text').html(),
			'end':$('#date_to_text').html(),
		}
	};

	openPreloader();
	$.post('/analysis/search/main', post, function (result) {
		$("#mTitle").hide();
		$("#Cview").html(result);
		$("#Cview").show();
		$(".similar-search").hide();
		if( access ) $("#serch_string").autocomplete("close");
		closePreloader();
    });
}

function sortNetTab(sort, sord){
	netSort = sort;
	netSord = sord;
	loadNetTab();
}

function loadNetTab(){
	openPreloader();
	$.post('/analysis/search/sorttabs', {'method':'getDomainStatsByNetwork','params':{'id':domainId,'sort':netSort,'sord':netSord}}, function (result) {
		$("#netInfoBlock").html(result);
		closePreloader();
    });
}

function sortGeoTab(sort, sord){
	geoSort = sort;
	geoSord = sord;
	loadGeoTab();
}

function loadGeoTab(){
	openPreloader();
	$.post('/analysis/search/sorttabs', {'method':'getDomainStatsByGeo','params':{'id':domainId,'sort':geoSort,'sord':geoSord}}, function (result) {
		$("#geoInfoBlock").html(result);
		closePreloader();
    });
}

function sortLandingsTab(sort, sord){
	landingSort = sort;
	landingSord = sord;
	loadLandingTab();
}

function loadLandingTab(page){
	openPreloader();
	$.post('/analysis/search/sorttabs', {'method':'getDomainStatsByLanding','params':{'id':domainId,'sort':landingSort,'sord':landingSord,'page':page}}, function (result) {
		$("#landingInfoBlock").html(result);
		closePreloader();
    });
}

function showTeasersDomain(type){
	$.post('/analysis/search/showTeaser', {'id':domainId,'type':type}, function (result) {});
}

function load_desc_sn_info(block) {

    var id = block[0].id.substring(3);

	if( typeof __app.loadinfo != 'undefined' && __app.loadinfo.indexOf(id) == -1 ){
		__app.loadinfo.push(id);
	}else if( typeof __app.loadinfo == 'undefined' ){
		__app.loadinfo = [];
		__app.loadinfo.push(id);
	} else {
    return true;
  }

	function onSuccess(result){
		if( result != '' ){
			$("#popap_"+id).html(result);

			var mb = parseFloat($("#ad_" + id).css('height'));
			var pb = parseFloat($("#popap_" + id + " .tzbl_popup_right").css('height'));

			if( mb < pb )
				$("#popap_" + id + " .tzbl_popup_right").addClass('horP');
		}

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

function load_desc_info(teaser){
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

    $.post('/teazer/show/detailinfo', {'ad_id':id,'mode':'full'}, function (result) {
        if( result != '' )
            $("#popap_" + id).html(result);


        setTimeout(function() {
            var popup = teaser.find('.tzbl_popup_block');
            var popupInner = teaser.find('.tzbl_popup_right');
            var popupHeight = popup.height();
            var blockHeight = teaser.height();
            var popupInnerHeight = popupInner.height();

            if (popupHeight < popupInnerHeight + 20) {
                popup.height(popupInnerHeight + 20);
            }

        }, 100);

    });
}

function resetField(m){
    $('#serch_string').val(m);
	$('.resetSearch').hide();
	$("#Cview").hide();
	$("#mTitle").show();

	$.post('/analysis/search/reset', {}, function (result) {});
}

function searchDomainDel(e){
    var $sb = $(e);
    var $sbVal = $sb.val();
    var $sbNext = $sb.next().next();
// console.log($sb, $sbVal, $sbNext);
	if( $sbVal !== '' && $sbVal != 'Введите адрес сайта' ){
		$sbNext.show();
    }else{
    	$sbNext.hide();
    }
}



function toLink (str){
	var space = '-';
	str = str.toLowerCase();
	var transl = {
		'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
		'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
		'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
		'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya'
	};
	var link = '';
	for (var i = 0; i < str.length; i++) {
		if(/[а-яё]/.test(str.charAt(i))) {
			link += transl[str.charAt(i)];
		} else if (/[a-z0-9]/.test(str.charAt(i))) {
			link += str.charAt(i);
		} else {
			if (link.slice(-1) !== space) link += str.charAt(i);
		}
	}
	return link;
}

function similarShow(domain){
	$("#serch_string").val( domain );
	searchRequest();
}

function viewNoAccess(){
	$("#ofpopup").show();
}

function showLndNoAcces(href, land){
	if( land === true ) $("#typeMsg").html('информация по посадочным страницам доступна' );
	else if( land == 2 ) $("#typeMsg").html('анализ по домену доступен');
	else $("#typeMsg").html('информация по прелендингам доступна');

	$("#demoCard").attr('href', href);
	$("#ofpopup").show();
}

function selectDate() {
	searchRequest();
}