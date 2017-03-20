var timeOutFilter;
var timerMsg;
var setOldAdsCnt = 0;

__General = function() {
    this.ads_id = [];
    this.module;
    this.controller;

    this.addDelToFav = function(e, all) {
        var action = '';
        var ids = [];
        var $elem = $(e);
        var $elemChildren = $elem.children();

        if (all) {
            ids = this.ads_id;
            action = (e ? 'add' : 'del');
        } else {
            var id = $elem.data('id');
            action = ($elemChildren.hasClass('ion-star') ? 'nadd' : 'ndel');
            ids.push(id);
        }

        if (ids.length === 0) {
            openNotification("Не выбрано ни одно объявление!");
            return false;
        }
        var allcnt = (all ? 1 : 0);
        var self = this;
        $.post('/' + this.module + '/favorites/' + action, {
            'ads_id': ids,
            'controller': this.controller,
            'all': allcnt
        }, function(result) {
            var answer = $.parseJSON(result);
            if (answer.success != 'undefined') {
                if (answer.success && self.controller == 'favorites') {
                    /* Добавить метод удаления тизеров со странички когда переделаем структуру */
                }

                if (all) {

                } else if (answer.success) {
                    if ($elemChildren.hasClass('js-add')) {
                        $elemChildren.removeClass('ion-star js-add').addClass('ion-trash-a');
                        $elem.contents().last()[0].textContent = $elem.data('del');
                    } else {
                        $elemChildren.removeClass('ion-trash-a').addClass('ion-star js-add');
                        $elem.contents().last()[0].textContent = $elem.data('add');
                    }
                }

                setFavouritesCount(false);

                if (this.controller == 'index')
                    showActionMsg(answer.msg);
                else
                    openNotification(answer.msg);

                if (answer.success && typeof answer.mark_block != 'undefined' && $("#markBlock").length !== 0)
                    $("#markBlock").html(answer.mark_block);

                /* Дописать метод перезагрузки страницы */
            }
        });
    };

    this.clearText = function(str) {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    };
};

var unchecked_ads_id = [];
var general = new __General();

function favorites_del_one(module,nonrefresh){
    if( ads_id.length === 0 ){
        openNotification( "Не выбрано ни одно объявление!" );
        return false;
    }

    function onSuccess(result){
        if( result !== '' ){
            if( typeof nonrefresh == 'undefined' || nonrefresh === false ){
                if( typeof controller_id != 'undefined' && controller_id != 'show' ){
                    for(var id in ads_id){
                        if( module == 'social')
                            $( '#ad_' + ads_id[id] ).remove();
                        else
                            $( '#adb_' + ads_id[id] ).remove();
                    }
                }
            }

            if( typeof controller_id != 'undefined' && controller_id == 'default' ){
                showActionMsg('1 объявление удалено из избранного');
            }else if( typeof controller_id != 'undefined' && controller_id == 'favorites' ){
                var msg = "1 объявление удалено из избранного. <a href=\"javascript:void(0);\" onclick=\"abolition('" + module + "','" + ads_id.join(',') + "');\">Отменить</a>";
                showActionMsg(msg);
                $("#markBlock").html(result);
                favtizpage(1);
            } else if ($("#blockMsg").length == 0) {
                showActionMsg('1 объявление удалено из избранного');
            }
            setFavouritesCount( false );

            if( typeof nonrefresh == 'undefined' || nonrefresh === false )
                favtizpage(1);
        }else{
            showActionMsg('1 объявление удалено из избранного');
        }
        /*if( result.success === true )
            setFavouritesCount( false );*/
    }

    function onError(){
        openNotification( "Неудалось удалить объявления!" );
    }

    $.ajax({
        url: '/' + module + '/favorites/del',
        type: 'POST',
        data: {'ads_id':ads_id},
        dataType: 'text',
        success: onSuccess,
        error: onError,
        cache: false
    });
    return true;
}

function favorites_add( module, id){
   /* if( !access ){
        showNoAccessBlock();
        return false;
    }*/

    if(id)
        ads_id.push(id);

    if( ads_id.length === 0 ){
        openNotification( "Не выбрано ни одно объявление!" );
        return false;
    }

    function onSuccess(result) {
        var msg;

        if (result.success === true) {

            if (ads_id.length == result.add_cnt) {
                msg = result.add_cnt + ' добавлено в избранное <a href="/' + module + '/favorites/index">перейти в избранное</a>';
            } else if (result.add_cnt === 0) {
                msg = 'Все выбранные объявления уже присутствуют в разделе "Избранное"!';
            } else if (typeof result.msg != 'undefined' && typeof result.status != 'undefined' && result.status == 'free') {
                msg = result.msg;
            } else if (typeof result.msg != 'undefined') {
                msg = result.add_cnt + ' добавлено в избранное. ' + result.msg + ' <a href="/' + module + '/favorites/index">перейти в избранное</a>';
            } else {
                msg = result.add_cnt + ' добавлено в избранное. Остальные повторяются. <a href="/' + module + '/favorites/index">перейти в избранное</a>';
            }

            showActionMsg(msg);

            setFavouritesCount(true, result.add_cnt);
        } else if (result.success === false && typeof result.msg != 'undefined') {
            openNotification(result.msg);
        }
    }

	function onError(){
		openNotification( "Неудалось добавить объявления!" );
	}

	$.ajax({
		url: '/' + module + '/favorites/add',
		type: 'POST',
		data: {'ads_id':ads_id},
		dataType: 'json',
		success: onSuccess,
		error: onError,
		cache: false
	});
}

function favorites_add_one( module, id, obj) {

    if (id)
        ads_id.push(id);

    if (ads_id.length === 0) {
        openNotification("Не выбрано ни одно объявление!");
        return false;
    }

    function onSuccess(result) {
        if (result.success === true) {
            showActionMsg('1 добавлено в избранное <a href="/' + module + '/favorites/index">перейти в избранное</a>');
            /*if (ads_id.length == result.add_cnt) {
            }*/
            setFavouritesCount(true, result.add_cnt);
        } else if (result.success === false && typeof result.msg != 'undefined') {
            openNotification(result.msg);
        }
    }

    function onError() {
        openNotification("Неудалось добавить объявления!");
    }

    $.ajax({
        url: '/' + module + '/favorites/add',
        type: 'POST',
        data: {'ads_id': ads_id},
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function favorites_add_main( module, id ){
    var id;
    if( ads_id.length === 0 ){
        openNotification( "Не выбрано ни одно объявление!" );
        return false;
    }

    function onSuccess(result){
        if( result.success === true ){

            if( result.add_cnt === 0 )
                openNotification('Все выбранные объявления уже присутствуют в разделе "Избранное"! ');

            setFavouritesCount( true, result.add_cnt );
        }
    }

    function onError(){
        openNotification( "Неудалось добавить объявления!" );
    }

    $.ajax({
        url: '/' + module + '/favorites/add',
        type: 'POST',
        data: {'ads_id':ads_id},
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });
}

function favorites_del(module){
	if( ads_id.length === 0 ){
		openNotification( "Не выбрано ни одно объявление!" );
		return false;
	}

	if( confirm( 'Вы хотите удалить отмеченные объявления?' ) ){

        $.post('/' + module + '/favorites/del', {'ads_id':ads_id}, function (result) {
            if( result !== '' ){
				/*for(id in ads_id){
					if( module == 'social')
                        $( '#ad_' + ads_id[id] ).remove();
                    else
                        $( '#adb_' + ads_id[id] ).remove();
				}*/

                $("#markBlock").html(result);
                setOldAdsCnt = ads_id.length;
                var msg = ads_id.length + ' объявлени' + countSuff(ads_id.length) + " удалено из избранного. <a href=\"javascript:void(0);\" onclick=\"abolition('" + module + "','" + ads_id.join(',') + "');\">Отменить</a>";

                showActionMsg(msg);

				setFavouritesCount( false );
                favtizpage(1);
            }else{

            }
        });

        return true;
	}
}

function countSuff(cnt){
    if( cnt == 1 )
        return 'е';
    else if( cnt >= 2 && cnt <= 4 )
        return 'я';
    else if( cnt > 4 )
        return 'й';
}

function showActionMsg(msg){
    clearTimeout(timerMsg);
    if ($("#blockMsg").length == 0) {
        openNotification(msg);
    } else {
        $("#blockMsg").html(msg).show();
        timerMsg = setTimeout(function(){
            $("#blockMsg").html(msg).hide();
        }, 5000);
    }
}

function abolition(module, ad_id){
    $.post('/' + module + '/favorites/abolitionads', {'ads_id':ad_id}, function (result){
        if( result !== '' ){
            $("#markBlock").html(result);
            showActionMsg('Удаление отменено');
            favtizpage(1);
            console.log( setOldAdsCnt );
            setFavouritesCount( true, parseFloat(setOldAdsCnt) );
        }
    });
}

function favorites_del_one(module,nonrefresh){
    if( ads_id.length === 0 ){
        openNotification( "Не выбрано ни одно объявление!" );
        return false;
    }

    function onSuccess(result){
        if( result != '' ){
            if( typeof nonrefresh == 'undefined' || nonrefresh === false ){
                if( typeof controller_id != 'undefined' && controller_id != 'show' ){
                    for(var id in ads_id){
                        if( module == 'social')
                            $( '#ad_' + ads_id[id] ).remove();
                        else
                            $( '#adb_' + ads_id[id] ).remove();
                    }
                }
            }

            if( typeof controller_id != 'undefined' && controller_id == 'default' ){
                showActionMsg('1 объявление удалено из избранного');
            }else if( typeof controller_id != 'undefined' && controller_id == 'favorites' ){
                var msg = "1 объявление удалено из избранного. <a href=\"javascript:void(0);\" onclick=\"abolition('" + module + "','" + ads_id.join(',') + "');\">Отменить</a>";
                showActionMsg(msg);
                $("#markBlock").html(result);
                favtizpage(1);
            } else if ($("#blockMsg").length == 0) {
                showActionMsg('1 объявление удалено из избранного');
            }
            setFavouritesCount( false );

            if( typeof nonrefresh == 'undefined' || nonrefresh === false )
                favtizpage(1);
        }else{
            showActionMsg('1 объявление удалено из избранного');
        }
        /*if( result.success === true )
            setFavouritesCount( false );*/
    }

    function onError(){
        openNotification( "Неудалось удалить объявления!" );
    }

    $.ajax({
        url: '/' + module + '/favorites/del',
        type: 'POST',
        data: {'ads_id':ads_id},
        dataType: 'text',
        success: onSuccess,
        error: onError,
        cache: false
    });
    return true;
}


function favorites_del_main(module){
    if( ads_id.length === 0 ){
        openNotification( "Не выбрано ни одно объявление!" );
        return false;
    }

    function onSuccess(result){
        if( result.success === true ) {
            setFavouritesCount( false );
        }
    }

    function onError(){
        openNotification( "Неудалось удалить объявления!" );
    }

    $.ajax({
        url: '/' + module + '/favorites/del',
        type: 'POST',
        data: {'ads_id':ads_id},
        dataType: 'json',
        success: onSuccess,
        error: onError,
        cache: false
    });

}

function setFavouritesCount(plus, count) {
    var all_cnt;
    var cnt = $(".fav-count-teaser").html();
    if (plus) {
        all_cnt = parseInt(cnt) + parseInt(count);
    } else {
        all_cnt = parseInt(cnt) - ads_id.length;
    }


    $("#favorites_ad_cnt").html(all_cnt);
    $(".fav-count-teaser").html(all_cnt);
    ad_all_uncheck();
    ads_id = [];
    $("#ad_cnt_check").html(ads_id.length);
    $("#favCnt").html(all_cnt);
}

function getPreloader(){
    return '<div class="p4 center"><img src="/images/loading.gif" style="width:50px;"></div>';
}

function unselectLife(m, callback){
	//if(m) showFilterLabel( $(".life-reset").offset().top );

    $('#day_on_count').val(0);
    $('#day_off_count').val(maxLive);
    $(".life-reset").hide();
    $(".life-filter-block").removeClass("leftFilterActiveBg");

    lifeSlider.update({from: 0, to: maxLiveSize});
    //setDefaultSliderPosition('slider',0,100);

    if (callback && typeof(callback) === "function") {
        callback(1);
    }
}

function unselectSize(m, callback){
    //if(m) showFilterLabel( $(".size-reset").offset().top );

    $('#size_on_count').val(0);
    $('#size_off_count').val(maxSize);
    $(".size-reset").hide();
    $(".size-filter-block").removeClass("leftFilterActiveBg");

    if( $('#slider3').length > 0 )
        sizeSlider.update({from: 0, to: maxNumSize});
    //setDefaultSliderPosition('slider3',0,100);

    if (callback && typeof(callback) === "function") {
        callback(1);
    }
}

function setUnselectRange(type){
    $("."+type+"-reset").show();
    $("."+type+"-filter-block").addClass("leftFilterActiveBg");
}

function setDefaultSliderPosition(id,f,l){
    $("#"+id+" a:first").css('left',f+'%');
    $("#"+id+" a:last").css('left',l+'%');
    $("#"+id+" div").css('left',f+'%').css('width',l+'%');
}

function setChangePeriodBg(){
    $(".period-filter-block").addClass('leftFilterActiveBg');
    $(".period-reset").show();
}

function unselectPeriod(callback){
	//showFilterLabel( $(".period-reset").offset().top );
    $(".period-reset").hide();
    $(".period-filter-block").removeClass('leftFilterActiveBg');
    $("#date_from_text").html($("#time_first").val());
    $("#date_to_text").html($("#time_last").val());
    $("input[name=new_ads]").removeAttr('checked').trigger('refresh');

    if (callback && typeof(callback) === "function") {
        callback(1);
    }
}

function checkChangePeriod(){
    if( $("#date_from_text").html() != $("#time_first").val() || $("#date_to_text").html() != $("#time_last").val() )
        setChangePeriodBg();
    else{
        $(".period-reset").hide();
        $(".period-filter-block").removeClass('leftFilterActiveBg');
    }
}

function showFilterLabel( top ){
    clearTimeout(timeOutFilter);
    $("#submit-filter").show();
    $("#submit-filter").offset({ top: top, left: 306 });

    timeOutFilter = setTimeout(function(){
        $("#submit-filter").hide();
    }, 5000);
}

function unselectAll(block, callback){
    showFilterLabel( $("." + block + "-reset").offset().top );

    $("." + block + "-filter-block div.jq-checkbox").removeClass("checked");
    $("." + block + "-filter-block input").prop('checked', false);
    $("." + block + "-filter-block").removeClass("leftFilterActiveBg");
    $("." + block + "-filter-block .viev-all-ts.reset-filters").hide();
    $("." + block + "-filter-block div.jq-radio").removeClass("checked");
    $("." + block + "-filter-block div.jq-radio:first").addClass("checked");

    if (callback && typeof(callback) === "function") {
        callback(1);
    }
}

function setFilterLifePeriod(id, callback){
    showFilterLabel( $("#"+id).offset().top );
    checkChangePeriod();
}

function setPositionSlider(){
    if( typeof lifeSlider == 'undefined' )
        return false;

    var dn = $('#day_on_count').val();
    var df = $('#day_off_count').val();

    lifeSlider.update({from: dn, to: df});

    /*var f = $dn * 100 / maxLive;
    var e = $df * 100 / maxLive;

    var l = Math.round(parseFloat(f));
    var r = Math.round(parseFloat(e));

	if( $dn != 0 || $df != maxLive )
		setUnselectLife();*/
	//setDefaultSliderPosition('slider',l,r);
}

/* check, uncheck teasers тизерных и социальных сетей */
function ad_all_check(bk) {

    if( typeof trig_view != 'undefined' && ( trig_view === '' || trig_view == 'block' ) ){
        var $check = $(".tzbl_chek" + ( typeof bk != 'undefined' ? '.' + bk : '' ) );
    }else{
        var $check = $(".tbl_check" + ( typeof bk != 'undefined' ? '.' + bk : '' ) );
        $( "div.selectAll" ).addClass('checked');
        $("input.selectAll").prop("checked",true);
    }

    $check.each(function () {
        var id = this.id.substring(3);
        if ( unchecked_ads_id.indexOf(id) == -1 && ads_id.indexOf(id) == -1) {
            $("#" + this.id + " input").prop("checked",true);
            $("#" + this.id + " div.jq-checkbox").addClass("checked");
            $(this).closest(".tzbl_all").addClass("isCheked");
            ads_id.push(id);
        }
    });

    $("#ad_cnt_check").html(ads_id.length);
}

function ad_all_uncheck(bk) {

    unchecked_ads_id = [];

    if( typeof trig_view != 'undefined' && ( trig_view == '' || trig_view == 'block' ) ){
        var $check = $(".tzbl_chek" + ( typeof bk != 'undefined' ? '.' + bk : '' ) );
    }else{
        var $check = $(".tbl_check"  + ( typeof bk != 'undefined' ? '.' + bk : '' ) );
        $( "div.selectAll" ).removeClass('checked');
        $("input.selectAll").prop("checked",false);
    }

    $check.each(function () {
        var id = this.id.substring(3);
        var del = ads_id.indexOf(id);
        if (del != -1) {
            $("#" + this.id + " input").prop("checked",false);
            $("#" + this.id + " div.jq-checkbox").removeClass("checked");
            $(this).closest(".tzbl_all").removeClass("isCheked");
            ads_id.splice(del, 1);
        }
    });

    if( typeof bk == 'undefined' ) {
        ads_id = [];
    }

    $("#ad_cnt_check").html(ads_id.length);

    //$("#ad_cnt_check").html(ads_id.length);
}

function ad_one_check(id, check){
	var del = ads_id.indexOf( id );

	if( check === true && del == -1 )
		ads_id.push( id );
	else if( check === false && del != -1 )
		ads_id.splice(del,1);

	$("#ad_cnt_check").html( ads_id.length );


    var delU = unchecked_ads_id.indexOf( id );
    if( check === true && delU != -1 )
        unchecked_ads_id.splice(delU,1);
    else if( check === false && delU == -1 )
    {
        unchecked_ads_id.push( id );
    }
}

function ad_been_checked() {
    if( typeof trig_view != 'undefined' && ( trig_view == '' || trig_view == 'block' ) ){
        var $check = $(".tzbl_chek");
    }else{
        var $check = $(".tbl_check");
    }

    $check.each(function () {
        var id = this.id.substring(3);
        if (ads_id.indexOf(id) != -1){
            $("#" + this.id + " div.jq-checkbox").addClass("checked");
            $(this).closest(".tzbl_all").addClass("isCheked");
        }
    });
}

/* end check, uncheck */

function PressEnter(value, event, callback, params){
    if(event.keyCode == 13){
        if (callback && typeof(callback) === "function") {
            callback(params);
        }
    }
}

function validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
}

function openPreloader(){
    $("#preloaderBlock").show();
}

function openPreloaderUn(msg){
    if(!msg) return false;
    $('#preloaderBlock div#popup-land-screen div p').text(msg);
    $("#preloaderBlock").show();
}

function closePreloaderUn(){
    $('#preloaderBlock div#popup-land-screen div p').text("Подождите, идёт загрузка результатов...");
    $("#preloaderBlock").hide();
}

function closePreloader(){
  $("#preloaderBlock").hide();
}

function showNoAccessBlock(id){
    $("#" + id).show();
}

function hideNoAccessBlock(id){
    if( id == 'undefined' ){
        $("#" + id).fadeOut();
    }else{
        $(".restriction-popup").fadeOut();
    }
    $('body').css("overflow","auto");
}

function validateDayLive(e){
    var on = parseInt($('#day_on_count').val());
    var off = parseInt($('#day_off_count').val());

    if(isNaN(on) || on < 0 ) on = 0;
    if(isNaN(off) || off > maxLive || off < 0) off = maxLive;

    if( on > off ) on = off;

    $('#day_on_count').val(on);
    $('#day_off_count').val(off);
}

function validateSize(e, pm){
    var on = parseInt($('#size_on_count').val());
    var off = parseInt($('#size_off_count').val());

    if(isNaN(on) || on < 0 ) on = 0;
    if(isNaN(off) || off > maxSize || off < 0) off = maxSize;

    if( on >= off ) on = ( off - pm );

    $('#size_on_count').val(on);
    $('#size_off_count').val(off);
}

function checkShema(b){
    if( b.value.indexOf( 'https://' ) > -1 )
        $(b).val(b.value.replace('http://',''));
    else if(b.value.replace('http://','').indexOf( 'http://' ) > -1){
        $(b).val(b.value.replace('http://',''));
    }
}


function blockFavorite(e, type, id, nonrefresh) {

    var action = e.children().attr('class').indexOf('star') != -1;
    var $icon = e.children();
    var $textNode = e.contents().last()[0];

    if (action) {
        favorites_add_one(type, id, e);
        $textNode.textContent = 'Из избранного';
        $icon.removeClass('ion-star').addClass('ion-trash-a');

    } else {
        ads_id.push(parseInt(id));
        favorites_del_one(type, nonrefresh);
        $textNode.textContent = 'В избранное';
        $icon.removeClass('ion-trash-a').addClass('ion-star');
    }
}

function closeFreeNotifMsg(){
    $("#top-message-red").hide();
    setCookie('free', 1);
}

function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }

  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;

  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
        updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function popunderShow(msg){
    $("#popupMsg").html(msg);
    $("#popunder").fadeIn();
}

function resetSearchField(m, callback, param){
    $('.resetSearch, .similar-search, .search-form_reset-search').hide();
    $('.similar-search').hide();
    $('#serch_string').val('');



    if( typeof aply_filter == 'function' )
        aply_filter();
    else if( typeof callback == 'function' )
        callback(param);
}

function showSearchDel(e){
    if( $(e).val() == '' ){
        $(e).next().hide();
        $('.search-form_reset-search').hide();
        $('.similar-search').hide();
        return false;
    } else {
        $(e).next().show();
        $('.search-form_reset-search').show();
        $('.similar-search').show();
    }
}

function showCPrompt(module, msg) {
    $.post('/' + module + '/default/filterlist', {}, function(result) {
        if (defaultFilter) {
            aply_filter(true);
        }
        $("#filterSearchList").html(result);
        $("#popupSaveFilter").show();
    });
}


function hideCPrompt(){
    $("#newFilterName").val('');
    $("#popupSaveFilter").hide();
    $("#select2-drop").hide();
    $("#select2-drop-mask").hide();

}

function acceptName(callback, id) {
    if (typeof id == 'undefined') {
        var name = $("#newFilterName").val();
    } else {
        var name = filterName[id];
    }

    hideCPrompt();

    if (callback && typeof(callback) === "function") {
        callback(name);
    }
}

function searchWFilter(b) {

    var res = [];
    if (typeof filterName != 'undefined') {
        for (var i in filterName) {
            if (filterName[i].toLowerCase().indexOf(b.value.toLowerCase()) != -1) {
                res.push("<li onclick=\"selectSaveFilter('" + filterName[i] + "');\">" + filterName[i] + '</li>');
            }
        }

        var ul = res.join('');
        $("#filterSearchList").html(ul);
    }
}

function selectSaveFilter(name) {

    if (typeof name == 'undefined') {
        name = $("#newFilterName").val();
        name = general.clearText(name);
    } else {
        name = general.clearText(name);
        $("#newFilterName").val(name);
    }

    acceptName(save_filter);
}

function clearFilterSelect(){
    $("#resultList").html('Выбрать настройки фильтра');
    reset_filter();
}

function showNoAccessLndMsg(type, id, ident){
    if( type === true ){
        $('#'+ident+' a.linkGo').attr('href', '/landing/lnd/view/id/' + id);
    }else{
        $('#'+ident+' a.linkGo').attr('href', '/landing/plnd/view/id/' + id);
    }
    $("#"+ident).show();
}

function showNoAccessExport(ident){
    $("#dcpopup_"+ident).show();
}

/**
 * pseudo-select
 */

/*$(document).on('click', '.pseudo-select_title', function() {
    var $this = $(this).parent();
        if (!$this.hasClass('__open')) {
            $('.pseudo-select.__open').removeClass('__open');
            $this.addClass('__open');
        } else {
            $this.toggleClass('__open');
        }
});

$(document).on('click', function(e) {// click anywere - close .select-box
    if ($('.pseudo-select').has(e.target).length === 0) {
        $('.pseudo-select').removeClass('__open');
    }
});*/

