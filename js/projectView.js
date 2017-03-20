var pages = 1;
var limit = 20;
var select = 'all';
var sord = 'DESC';
var ads_id = new Array();
var checkCountUp = false;

$(document).ready(function(){
    $(".selectAll").on("change",function(){
        var chekcboxState = $(this).is(":checked");

        if( chekcboxState )
            ad_all_check();
        else
            ad_all_uncheck();

        /*$("#teasers input:checkbox").prop("checked", chekcboxState).trigger("refresh");
        $("#teasers .project_list_one").toggleClass("checked", chekcboxState);*/
    });
});

function addNewTnList(gid){
    autoSaveTeasers(false);
    var tn_id = $(".t_l_active").data('tnid');
	$.post('/projects/show/addnet',{'gid':gid,'tn_id':tn_id},function(result){
		if( result != '' ){
			$("#project-tabs-block").html(result);
            /*$(".inner-pages-top").html(result);*/
            /*element = ' <li class="t_l_active" id="list-id-new" data-list_id="new" data-tnid="new"><a class="tn_name" href="javascript:void(0);">Новая тизеная сеть</a><span class="icon_del" onclick="deleteTnList("new");"></span></li>';
            $( ".teaz_link" ).append(element);*/
		}else{
			 openNotification("Добавление тизерной сети не возможно");
		}
	});
}

function deleteTnList(id){
    if( !confirm("Вы действительно хотите удалить данный проект?") )
        return false;

    var curr_listid = $("#p_id").val();

    $.ajax({
        url: '/projects/actions/delproject',
        data: {'id':id,'list_id':curr_listid},
        type: 'post',
        datatype:'json',
        success: function(result){
            var data = $.parseJSON(result);
            if( typeof data.status != 'undefined' && data.status == 'success' ){

                if( curr_listid == id && typeof data.redirect != 'undefined' )
                    document.location.href = data.redirect;

                $("#list-id-" + id).remove();
                openNotification("Проект удален.");
            }
        }
    });
}

function goUpload(id){
    if (tnId == 39 && !checkCountUp) {
        $('#dcpopup_restrictions').hide();
        checkUpload(id);
    } else {
        $('#dcpopup_restrictions').hide();
        var ids = getCheckedTeaser();     //только чекнутые тизеры
        // var ids = ads_id;
        var pid = $("#p_id").val();

        autoSaveTeasers(false);
        openNotification('Ожидайте, производится проверка.');

        $.ajax({
            url: '/projects/actions/checkteasers',
            data: {
                'ids': ids,
                'pid': pid,
            },
            type: 'post',
            datatype:'json',
            success: function(response){
                var data = $.parseJSON(response);
                closeNotification();

                if( typeof data.status != 'undefined' && data.status == 'success' ){        // undefined  а было undefihed
                    if( parseFloat(data.all_count) > parseFloat(data.up_count) && parseFloat(data.up_count) != 0 ){
                        if( confirm(data.no_count + ' из ' + data.all_count + ' выбранных объявлений не будут выгружены, т.к. не подходят под требования рекламной сети. Продолжить выгрузку остальных тизеров?') ){
                            document.location.href = '/projects/actions/upload/list_id/' + id;
                        }else{
                            //validAllTeasers();
                        }
                    }else if( parseFloat(data.all_count) == 0 ){
                        openNotification('Добавьте тизеры.');
                    }else if( parseFloat(data.up_count) == 0 ){
                        //validAllTeasers();
                        openNotification('Тизеры которые вы пытаетесь выгрузить не соответствуют требованиям тизерной сети.');
                    }else{
                        document.location.href = '/projects/actions/upload/list_id/' + id;
                    }

                    if( data.mwl !== false ){
                        if( typeof data.mwl.caption != 'undefined' ){
                            for( i in data.mwl.caption ){
                                $("#"+i+"_caption").addClass('error_teazer');
                                $(".errmsg_"+i).html("Длина слов не должна превышать " + data.wl + " символов").css('color', 'red');
                            }
                        }

                        if( typeof data.mwl.description != 'undefined' ){
                            for( i in data.mwl.description ){
                                $("#"+i+"_description").addClass('error_teazer');
                                $(".errmsg_"+i).html("Длина слов не должна превышать " + data.wl + " символов").css('color', 'red');
                            }
                        }
                    }
                } else if ( typeof data.status != 'undefined' && data.status == 'trial_limit' ) {
                    openNotification(data.msg);
                }else{
                    openNotification('Тизеры отсутствуют. Добавьте тизеры в проект.');
                }
            }
        });
        checkCountUp = false;
    }
}

function checkUpload(id){
    var ids = ads_id;
    var pid = $("#p_id").val();
    $.ajax({
        url: '/projects/actions/checkUpAbility',
        data: {
            'ids': ids,
            'pid': pid,
        },
        type: 'post',
        datatype:'json',
        success: function(response){
            var data = $.parseJSON(response);
            if (typeof data.success != 'undefined') {
                if (data.success) {
                    checkCountUp = true;
                    goUpload(id);
                } else {
                    openNotification(data.msg);
                }
            }
        }
    });
}

function checkBadTeasers(data){
    for(i in data){
        checkNoValidTeaser(i);
    }
}

function getCheckedTeaser(){
    var inputs = $(".plo_chek input:checked");
    var res = new Array();
    inputs.each(function(){
        var id = this.id.substring(7);
        res.push( id );
    });
    return res;
}

/*Количество тизеров для вывода*/
function changeTeaserCount(val){
    ad_all_uncheck();
    var pid = $("#p_id").val();

    $(".sort-limit-link-box a.selected").removeClass('selected');
    $(".onpage_" + val).addClass('selected');
    openPreloader();

    $.post('/projects/actions/countads',{'id':pid,'cnt':val}, function(result){
        limit = val;
        projectList(1);
    });
}

function projectList(page, callback){
    pages = page;
    var pid = $("#p_id").val();
    openPreloader();
    $.post('/projects/ads/index/id/'+pid,{'sord':sord, 'page':page,'lim':limit,'select':select,'int_f':int_f,'int_e':int_e}, function(result){
        $("#teaser-box").html(result);
        validAllTeasers();
        $(".choiseSelectBlock").hide();
        closePreloader();

        if (callback && typeof(callback) === "function") {
            callback(result);
        }
    });
}

//function applyLink(){
    /*if( $(this).hasClass('active_button') && $("#check-own-url-styler").hasClass("checked") ){
        var link = $("#proj-link-hidden").val();
    }*/
//}

function uploadImage(id) {
    $("#file-"+id).click();
    return false;
}

function send(id, grp_id, list_id){
    var formData = new FormData($("#post-form-"+id)[0]);
    $.ajax({
        url: '/projects/show/uploadteaser/list_id/'+list_id+'/img_id/'+id,
        type: 'POST',
        data: formData,
        datatype:'json',
        // async: false,
        beforeSend: function() {
            // do some loading options
        },
        success: function (data) {
            var answer = $.parseJSON(data);
            if(answer.error){
                openNotification(answer.msg);
                //console.log(answer.error);
            }else{
                $('div#teaser-'+answer.image_id).html('<img src="'+answer.image+'" />');
                $('input#img-'+answer.image_id).val(answer.image_name);
                $('div#teaser-'+answer.image_id).closest('div.project_list_one').removeClass('clear-teaser');
                $('span.resol_'+answer.image_id).html( answer.resolution.w + 'x' + answer.resolution.h + ',' );
                $('span.size_'+answer.image_id).html(  Math.round( answer.size / 1024 ) + ' Кб,' );
                $('span.ext_'+answer.image_id).html( answer.ext );
                checkLoadImg( answer.image_id, answer );
                $("#tblock_" + answer.image_id + " .plo_img_info > a").html("Сменить");

                $("#tblock_" + answer.image_id + " span.icon").html("Черновик");
                $("#tblock_" + answer.image_id + " span.icon").attr('class', 'icon draft');
            }
        },

        complete: function() {
            // success alerts
        },

        error: function (data) {
            openNotification("There may a error on uploading. Try again later");
        },
        cache: false,
        contentType: false,
        processData: false
    });

    return false;
}

function checkLoadImg( id, value ){
    $( ".resol_" + id ).html( value.resolution.w + "x" + value.resolution.h + ", " );
    $( ".size_" + id ).html( Math.round( value.size / 1024 ) + " Кб, " );
    $( ".ext_" + id ).html( value.ext );
    var teas_error = false;

    if(  value.size / 1024 > tn_sets.image_file_size ){
        teas_error = true;
        $( ".size_" + id ).addClass("error_text");
    }else{
        $( ".size_" + id ).removeClass("error_text");
    }

        if( parseFloat(value.resolution.h) < parseFloat(tn_sets.min_image_height) || parseFloat(value.resolution.h) > parseFloat(tn_sets.max_image_height) || parseFloat(value.resolution.w) > parseFloat(tn_sets.max_image_width) || parseFloat(value.resolution.w)  < parseFloat(tn_sets.min_image_width) ){
            teas_error = true;
            $( ".resol_" + id ).addClass("error_text");
        }else{
            $( ".resol_" + id ).removeClass("error_text");
        }
        if (typeof exlude[value.ext] != 'undefined' &&
        typeof exlude[value.ext][tn_sets.id] != 'undefined' ) {

        if (parseFloat(value.resolution.w) >= parseFloat(exlude[value.ext][tn_sets.id].w) &&
            parseFloat(value.resolution.h) >= parseFloat(exlude[value.ext][tn_sets.id].h)) {
            $( ".resol_" + id ).removeClass("error_text");
            if (value.size / 1024 <= exlude[value.ext][tn_sets.id].size) {
                teas_error = false;
                $( ".size_" + id ).removeClass("error_text");
            } else {
                teas_error = true;
                $( ".size_" + id ).addClass("error_text");
                }
            }
            if (value.size / 1024 > exlude[value.ext][tn_sets.id].size) {
                $( ".size_" + id ).addClass("error_text");
            }
        }

        /*проверка на соотношение сторон*/
        if (tn_sets.id == 8 || tn_sets.id == 14 &&
            (parseFloat(value.resolution.h) > parseFloat(value.resolution.w) || parseFloat(value.resolution.h) < parseFloat(value.resolution.w))) {
            teas_error = true;
            $( ".resol_" + id ).addClass("error_text");
        }

    if( teas_error ){
        $( "#teaser-" + id + " img" ).addClass("error_image");
        $(".errmsg_" + id).html("Изображение не соответствует требованиям сети. Замените изображение.").css("color", "red");
    }else{
        $( "#teaser-" + id + " img" ).removeClass("error_image");
        $(".errmsg_" + id).html('');
    }

    $( "#teaser-" + id ).removeClass("error_image");
}

function uploadImages(){
    var list_id = $('li.t_l_active').data('list_id');
    var formData = new FormData($("#up-files")[0]);
    formData.append("tn_id", tnId);
    var ids = getCheckedTeaser();
    ids = ids.join(',');

    $.ajax({
        url: '/projects/show/multiupload/list_id/' + list_id + '?ids=' + ids,
        type: 'POST',
        data: formData,
        datatype:'json',
        // async: false,
        beforeSend: function() {
            openPreloader();
            // do some loading options
        },
        success: function (data) {
            closePreloader();

            var answer = $.parseJSON(data);

            if(answer.error == 'error')
                openNotification("Загруженые файлы не соответствует формату изображения");

            if( typeof answer.t != 'undefined' ){
                for( id in answer.t ){
                    $("#teaser-" + id).html( '<img src="' + answer.t[id].image + '">' );

                    checkLoadImg( id, answer.t[id] );
                }
            }

            if( typeof answer.n != 'undefined' ){
                for( id in answer.n ){
                    $("#teasers").prepend( answer.n[id] );
                    checkLoadImg( id, answer.t_n[id] );
                }
            }

            setClickAction();
            //ad_all_uncheck();
        },

        complete: function() {
            // success alerts
        },

        error: function (data) {
            closePreloader();
            openNotification("There may a error on uploading. Try again later");
        },
        cache: false,
        contentType: false,
        processData: false
    });

    return false;
}

function uploadDescriptions(){
    var grp_id = $("#grp_id").val();
    var list_id = $("#p_id").val();
    var ids = getCheckedTeaser();
    ids = ids.join(',');
    $("#desc_ids").val(ids);
    var formData = new FormData($("#up-descs")[0]);

    $.ajax({
        url: '/projects/show/descup/grp_id/' + grp_id + '/list_id/' + list_id,
        type: 'POST',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,

        beforeSend: function(){
            openPreloader();
        },
        success: function(data){
            closePreloader();
            if(data.error == 'error')
                openNotification("Загруженые файлы не соответствует формату текстового файла");

            if( typeof data.t != 'undefined' ){
                for( id in data.t ){
                    $("#" + id + "_caption").val( data.t[id].caption );
                    $("#" + id + "_description").val( data.t[id].description );
                    $("#title-" + id).html( data.t[id].caption.length );
                    $("#desc-" + id).html( data.t[id].description.length );
                    checkNoValidTeaser(id);
                }
            }

            if( typeof data.n != 'undefined' ){
                for( id in data.n ){
                    $("#teasers").prepend( data.n[id] );
                    checkNoValidTeaser(id);
                }
            }
            ad_all_uncheck();
            setClickAction();
        },
        error: function (data) {
            closePreloader();
        },
    });
}

function setClickAction(dlockId) {
    $('#innerProjectTeazerList '+(typeof dlockId != 'undefined' ? '#tblock_'+dlockId : '')+' input[type=checkbox]').on('change', function(){
        var $this = $(this);
        var id = $this.closest('form').data('id');
        if ($this.prop('checked')) {
            ads_id.push(id);
        } else {
            delSelect(id);
        }
    });

    /*$(".project_list_one div.plo_chek").on("click", function(){
        var id = $(this).parent().data('id');
        console.log(id);
        if( $("#delete_" + id + "-styler" ).hasClass("checked") ){
            $("#delete_" + id ).removeAttr("checked");
            $("#tblock_" + id).removeClass("checked");
            delSelect(id);
        }else{
            $("#tblock_" + id).addClass("checked");
            $("#delete_" + id ).attr("checked","checked");
            ads_id.push(id);
        }
        $("input").trigger('refresh');
    });

    $(".project_list_one div.jq-checkbox").on("click",function(){
        var id = this.id.replace('-styler', '').replace('delete_', '');

        if( $(this).hasClass("checked") ){
            $("#tblock_" + id).addClass("checked");
            ads_id.push(id);
        }else{
            delSelect(id);
            $("#tblock_" + id).removeClass("checked");
        }
    });*/
}

function autoSaveTeasers(notification){
    $.ajax({
        async: "false",
        url: '/projects/ads/saveteasers' + ( notification !== false ? "/sync/1" : '' ),
        data: $('form').serialize(),
        type: 'post',
        datatype:'json',
        success: function(response){
            var data = $.parseJSON(response);
            if( typeof data != 'undefined' ){
                for(i in data){
                    $( "#" + i + "_caption" ).attr("name", data[i] + "[caption]");
                    $( "#" + i + "_description" ).attr("name", data[i] + "[description]");
                    $( "#img-" + i ).attr("name", data[i] + "[image]");
                    $( "#" + i + "_is_new" ).attr("name", data[i] + "[is_new]").val('0');
                    $( "#" + i + "_list_id" ).attr("name", data[i] + "[list_id]");
                }
            }
            if( notification !== false )
                openNotification("Настройки сохранены.");
        }
    });

    return true;
}

function changeLinkStatus(check){
    //var check = $("#check-own-url-styler").hasClass("checked");
    var id = $("#p_id").val();

    linkDisabEnab(!check);

    if( !check ){
        $(".item_list").show();
        $(".main_list").hide();
        $.post('/projects/actions/linkstatus',{'id':id,'own':check},function(result){});
    }else{
        $(".item_list").hide();
        $(".main_list").show();
        var url = $("#proj-link-hidden").val();
        $.post('/projects/actions/linkstatus',{'id':id,'own':check,'url':url},function(result){});
    }
}

function linkDisabEnab(status){
    var links = $(".plo_link input[type=text]");
    var link = $("#proj-link-hidden").val();

    links.each(function(){
        if( status ){
            $(this).parent().show();
            $(this).val(link);
        }else{
            $(this).parent().hide();
            $(this).val(link);
        }
    });
}

function applyLink(block){
    if( $(block).hasClass('active_button') ){
        changeLinkStatus($("#check-own-url-styler").hasClass("checked"));
    }
}

function validAllTeasers(){
    var teasers = $(".project_list_one");
    teasers.each(function(){
        var tid = this.id.replace('tblock_','');
        checkNoValidTeaser(tid);
    });
}

function checkNoValidTeaser(id){
    var tblock = $(".project_list_one");

    if( typeof id != "undefined" && id != '' ){
        checkTextValid(id, 'caption');
        checkTextValid(id, 'description');
        checkValidLink(id);
        checkImageValid(id);
    }else{
        tblock.each(function(){
            var id = this.id.substring(7);

            checkTextValid(id, 'caption');
            checkTextValid(id, 'description');
            checkImageValid(id);
        });
    }
}

function checkTextValid(id, block){
    var input = $("#" + id + "_" + block);

    if( input.length == 0 ) return true;

    var limit = input.data("maxleng");

    var leng = input.val().length;

    if( leng > limit ){
        input.addClass("error_teazer");
    }else if( input.hasClass("error_teazer") ){
        input.removeClass("error_teazer");
    }
    checkLength(input, block);
    if (block == 'caption' && (tn_sets.title_need > leng || tn_sets.title_length < leng)) {
        input.addClass("error_teazer");
    } else if (block == 'caption') {
        input.removeClass("error_teazer");
    }
    if (block == 'description' && (tn_sets.description_need > leng || tn_sets.description_length < leng)) {
        input.addClass("error_teazer");
    } else if (block == 'description') {
        input.removeClass("error_teazer");
    }
    if (input.hasClass("error_teazer")) {
        return false;
    } else {
        return true;
    }
}

function checkValidLink(id){
    var b = $("#" + id + "_url");

    if( typeof ( b.attr('disabled') ) == 'undefined' ){
        if( b.val() == '' )
            b.addClass("error_teazer");
        else
            b.removeClass("error_teazer");
    }
    else
        b.removeClass("error_teazer");
}

function checkLength(el, block){
    var max = $(el).data('maxleng');
    var text = $(el).val();
    var curr = $(el).val().length;
    var name = $(el).data('name');
    var tid = $('#tabs-link-slider li.t_l_active').data('tnid');

    if( tid == 14 ){
        text = text.replace(/\.$/,'').replace(/\.$/,'').replace(/\.$/,'').replace(/\.$/,'');
        curr = text.length;
    }

    $(el).toggleClass("error_teazer", max - curr < 0);
    $('#'+name).html(curr);

    if (block == "description" &&
        max >= curr &&
        curr >= tn_sets.description_need) {
        $('#'+name).parent().css('color', '#8ABB00');
    } else if (block == "caption" &&
        max >= curr &&
        curr >= tn_sets.title_need) {
        /*curr > 0 &&
        (tn_sets.id != 19 || curr >= tn_sets.title_need)*/
        $('#'+name).parent().css('color', '#8ABB00');
    } else if (block != "description" && block != "caption" && max >= curr && curr > 0) {
        $('#'+name).parent().css('color', '#8ABB00');
    } else {
        $(el).addClass("error_teazer");
        $('#'+name).parent().css('color', 'red');
    }
}

function checkImageValid(i){
    var teas_error = false;
    if( typeof __ads[i] != 'undefined' && __ads[i].resolution !== null ){
        if( parseFloat( tn_sets.image_file_size ) < parseFloat( __ads[i].size ) ){
            teas_error = true;
            $( ".size_" + i ).addClass("error_text");
        }else{
            $( ".size_" + i ).removeClass("error_text");
        }

        if( parseFloat( tn_sets.min_image_width ) > parseFloat( __ads[i].resolution.w ) || parseFloat( tn_sets.max_image_width ) < parseFloat( __ads[i].resolution.w ) || parseFloat( tn_sets.min_image_height ) > parseFloat( __ads[i].resolution.h ) || parseFloat( tn_sets.max_image_height ) < parseFloat(  __ads[i].resolution.h ) ){
            teas_error = true;
            $( ".resol_" + i ).addClass("error_text");
        }else{
            $( ".resol_" + i ).removeClass("error_text");
        }

        if (typeof exlude[__ads[i].ext] != 'undefined' && typeof exlude[__ads[i].ext][tn_sets.id] != 'undefined') {
            if (parseFloat(__ads[i].resolution.w) >= parseFloat(exlude[__ads[i].ext][tn_sets.id].w) &&
                parseFloat(__ads[i].resolution.h) >= parseFloat(exlude[__ads[i].ext][tn_sets.id].h)) {
                $( ".resol_" + i ).removeClass("error_text");
                if (__ads[i].size <= exlude[__ads[i].ext][tn_sets.id].size) {
                    teas_error = false;
                    $( ".size_" + i ).removeClass("error_text");
                } else {
                    teas_error = true;
                    $( ".size_" + i ).addClass("error_text");
                }
            }
            if (__ads[i].size > exlude[__ads[i].ext][tn_sets.id].size) {
                $( ".size_" + i ).addClass("error_text");
            }
        }
        /*проверка на соотношение сторон*/
        if (tn_sets.id == 8 || tn_sets.id == 14) {
            if ((parseFloat(__ads[i].resolution.w) > parseFloat(__ads[i].resolution.h) || parseFloat(__ads[i].resolution.w) < parseFloat(__ads[i].resolution.h))) {
                teas_error = true;
                $( ".resol_" + i ).addClass("error_text");
            }
        }
    }

    if( teas_error ){
        $( "#teaser-" + i + " img" ).addClass("error_image");
        $(".errmsg_" + i).html("Изображение не соответствует требованиям сети. Замените изображение.").css("color", "red");
    }else{
        $( "#teaser-" + i + " img" ).removeClass("error_image");
        $(".errmsg_" + i).html('');
    }

    if( $( "#teaser-" + i + " img" ).length == 0 )
        $( "#teaser-" + i ).addClass("error_image");
}

function selectTeaserProj(ct, b){
    var content = $(b).html();
    $("#viewType").html(content);
    $('.hideChoise').hide();

    select = ct;
    int_f = $("#teaz_on_count").val(1);
    int_f = false;
    int_e = false;

    autoSaveTeasers(false);
    projectList(1, checkResult);
}

function checkResult(result){
    if($("#teasers").html() == ''){
        $("#teaser-box").html($('#notFoundTeaser').html());
    }
}

function exportTo(method){
    var ids = getCheckedTeaser();
    var proj = $("#p_id").val();
    var grp = $("#grp_id").val();

    /*if( typeof access != 'undefined' && access == 0 ){
        openNotification( "Для тарифа Бесплатный выгрузка в " + method + " недоступна" );
        return false;
    }*/
    document.location.href = '/zip/projects/?grp=' + grp + '&proj=' + proj + '&method=' + method + "&ads=" + ids.join(',');
}

function showNumAds(){
    int_f = $("#teaz_on_count").val();
    int_e = $("#teaz_off_count").val();

    $("#viewType").html( 'c ' + int_f + ' по ' + int_e + ' объявление' );
    $('.hideChoise').hide();

    autoSaveTeasers(false);
    projectList(1, checkResult);
}

/*function uncheckAll(){
    var block = $(".tbl_check");

    block.each(function(){
        var id = this.id.substring(3);
        var del = __app.indexOf( id );
        if( del != -1 )
            __app.splice(del,1);

        $("#" + this.id + " div.jq-checkbox").removeClass("checked");
    });
}*/

/*function uncheckAllTeaser(){
    $('input:checkbox').removeAttr('checked').trigger('refresh');
}*/

function saveNet(grp_id){
    var error = [];
    var tn;
    if( $("#check-own-url-styler").hasClass('checked') && $("#proj-link-hidden").val() == '' ){
        $("#proj-link-hidden").addClass('error_teazer');
        error[1] = 1;
    }else{
        $("#proj-link-hidden").removeClass('error_teazer');
    }

    if($('#ProjectList_tnid').val() == ''){
        $('#ProjectList_tnid-styler').addClass('error_teazer');
        error[2] = 1;
    }else{
        $('#ProjectList_tnid-styler').removeClass('error_teazer');
        tn = $('#ProjectList_tnid').val();
    }


    if($('#shab').val() == ''){
        $('#shab-styler').addClass('error_teazer');
        error[3] = 1;
    }else{
        $('#shab-styler').removeClass('error_teazer');
    }

    if( error.length > 0 )
        return false;

    /*if( !access ){
        checkTnAccExist(grp_id);
    }else{*/
        /*$.ajax({
            url: '/projects/show/savenet/grp_id/'+grp_id,
            data: $('form#newnet-form').serialize(),
            type: 'post',
            success: function(data){
                var answer = $.parseJSON(data);
                if(answer.error == false){
                    document.location.href = "/projects/show/" + answer.grp_id + "?list_id=" + answer.list_id;
                }else{
                    console.log('error');
                }
            }
        });*/
        $.ajax({
            url: '/projects/show/check',
            data: {'uid':uid, 'tn':tn },
            type: 'post',
            success: function(dt){
                var answer = $.parseJSON(dt);
                if(answer.log == 'success'){
                    $.ajax({
                        url: '/projects/show/savenet/grp_id/'+grp_id,
                        data: $('form#newnet-form').serialize(),
                        type: 'post',
                        success: function(data){
                            var answer = $.parseJSON(data);
                            if(answer.error == false){
                                document.location.href = "/projects/show/" + answer.grp_id + "?list_id=" + answer.list_id;
                            }else{
                                console.log('error');
                            }
                        }
                    });
                }else{
                    if((answer.log == 'error' || answer.log == 'faild'))
                    {
                        if(answer.tn != '')
                            $('#tnName').text(answer.tn);

                        if(answer.role == 'arbitraznik' || answer.role == 'arbitraznik_pro')
                            $('.tnName_pro').css('display','block');
                        else
                            $('.tnName_free').css('display','block');

                        $('#prpopup').css('display', 'block');
                    }
                }

            }
        });

    /*}*/
}

function checkTnAccExist(grp_id){
    var tn_id = $('#ProjectList_tnid').val();

    $.ajax({
        url: '/projects/show/checkacc',
        data: {'tn_id':tn_id},
        type: 'post',
        dataType: 'json',
        success: function(result){
            if( typeof result.status != 'undefined' && result.status === true ){
                $.ajax({
                    url: '/projects/show/savenet/grp_id/'+grp_id,
                    data: $('form#newnet-form').serialize(),
                    type: 'post',
                    success: function(data){
                        var answer = $.parseJSON(data);
                        if(answer.error == false){
                            document.location.href = "/projects/show/" + answer.grp_id + "?list_id=" + answer.list_id;
                        }else{
                            console.log('error');
                        }
                    }
                });
            }else{
                $("#prpopup #tnName").html( $("#ProjectList_tnid option:selected").html() );
                $("#prpopup").show();
            }
        }
    });
}

function delSelect(id){
    var del = ads_id.indexOf(id);
    if (del != -1) ads_id.splice(del, 1);
}

function setCurrentMacros(tn_id){
    if( typeof tn_macros[tn_id] != 'undefined' ){
        $(".macrosList .hideMacros").html(tn_macros[tn_id]);
    }
}

function changeSort(block){
    if($(block).hasClass('arrowDropIcoAct')){
        sord = "ASC";
        $(block).removeClass('arrowDropIcoAct')
        $(block).addClass('arrowTopIcoAct')
    }else{
        sord = "DESC";
        $(block).removeClass('arrowTopIcoAct')
        $(block).addClass('arrowDropIcoAct')
    }

    projectList(1);
}

function showViewType(){
    /*$(document).bind('click.myEvent', function (e) {
        if (!yourClick && $(e.target).closest('.hideChoise').length == 0) {
            $('.choiseSelectBlock').removeClass('show');
            $(document).unbind('click.myEvent');
        }

        yourClick = false;
    });*/

    /*if( $('.choiseSelectBlock').hasClass('show') ){
        $('.choiseSelectBlock').removeClass('show');
    }else{
        $('.choiseSelectBlock').addClass('show');

    }*/
}

function setGSearchParams(grp_id, prj_id){
    $.post('/projects/imgsearch/setparams',{'grp_id':grp_id,'prj_id':prj_id,'ads_id':ads_id},function(result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != 'undefined' ){
            if(answer.success)
                document.location.href = "/projects/imgsearch/index/t/1";
            else
                openNotification(answer.msg);
        }
    });
}