var pages = 1;
var limit = 20;
var select = 'all';
var proj_click_range = new Array();
var projLink = new Array();

$(document).ready(function(){
    $('ul#tabs-link-slider li:not(.non-select)').on('click', function(){
        $('ul#tabs-link-slider li').removeClass('t_l_active');
        $(this).addClass('t_l_active');
        $('div.hide-on-newnet').show();
    });

    $('#prj-container').on('click', '.pagination ul li a', function(){
        $('#prj-container').load(this.href+' #prj-table');
        return false;
    });

    $('a.append_teaz').on('click',function(){
        if($('li.empty-teaz-net').length == 0) //can add only one new teaser net
        {
            /*if(window.changed == true){
                if(confirm('Вы внесли изменения в проект, которые могут быть потеряны. Сохранить изменения?'))
                    autoSaveTeasers();
            }*/
            $('div.hide-on-newnet').hide();
            var grpid = $(this).data('prjid');
            var tn_id = $('li.t_l_active').data('tnid');

            $.ajax({
                //url: '/projects/show/addnet/id/'+$(this).data('prjid')+'/selected/'+$('li.t_l_active').data('tnid'),
                url: '/projects/show/addnet/id/' + grpid + '/selected/' + tn_id,
                success: function(data){
                    $('div#teaser-box').html(data);
                }
            });
			if($(this).parent("li").length > 0){
				$(this).parent("li").before('<li class="empty-teaz-net"><a href="javascript:void(0);">Новая тизерная сеть</a></li>');
			}
			else{
				$('ul#tabs-link-slider').append('<li class="empty-teaz-net"><a href="javascript:void(0);">Новая тизерная сеть</a></li>');
			}
            $('ul#tabs-link-slider li').removeClass('t_l_active');
            $('li.empty-teaz-net').addClass('t_l_active');

			$('#tabs-link-slider').carouFredSel({
				auto: false,
				prev: '#tabs-prev',
				next: '#tabs-next',
				mousewheel: true,
				width: "100%",
				height: 35,
				align: "left",
				scroll: {
					items: 1,
					duration: 1000
				}
			});
            //$('#tabs-link-slider').trigger('refresh');
			
			$("li.non-select").toggle(!$("#tabs-next").is(":visible"));
			
			
			$('li.empty-teaz-net').on('click',function(){
                $('ul#tabs-link-slider li').removeClass('t_l_active');
                $(this).addClass('t_l_active');
                if($(this).data('list_id') == null)
                {
                    $('div.hide-on-newnet').hide();
                    $.ajax({
                        url: '/projects/show/addnet/id/'+$('a.append_teaz').data('prjid') + '/selected/' + tn_id,
                        success: function(data)
                        {
                            $('div#teaser-box').html(data);
                        }
                    });
                }else{
                    $('#teaser-box').load('/projects/ads/index/id/'+$('.t_l_active').data('list_id'));
                }
            });

        }
    });

    $(".jq-selectbox li.option").on("click", function(){
        console.log("OK");
    });
	
	$(".selectAll").on("change",function(){
		var chekcboxState = $(this).is(":checked");
		$("#teasers input:checkbox").prop("checked", chekcboxState).trigger("refresh");
		$("#teasers .project_list_one").toggleClass("checked", chekcboxState);
	});
	$("#teasers input:checkbox").live("change", function(){
		$(this).closest(".project_list_one").toggleClass("checked", $(this).is(":checked"));
	});
	setTimeout(function(){
		$("li.non-select").toggle(!$("#tabs-next").is(":visible"));
	},0);

    $("#category").on("change",function(){
        setCategoryMinPrice();
    });
});
/**
 * Adding new teasernet to project (new project_list for project_groups item)
 **/

/* show project tab */
/* Project list start */
function showProjects(page, s){
    var id = ( typeof s != 'undefined' && s.value != '' ? s.value : false );
    action = ( typeof action == 'undefined' ? undefined : action );
    openPreloader();
    $.post('/projects/default/show',{'page':page,'sort':sort,'sord':sord,'type':action,'us':us,'uid':id},function(result){
        closePreloader();
        $("#prj-container").html(result);

        ads_id = new Array();
        //$("input.checkProjItem").prop('checked', false).trigger('refresh');
        //$("input.selectAll").prop('checked', false).trigger('refresh');

        current_page = page;
    });
}

function totalProjLink(chb){
    if( chb ){
        $("#proj-link-hidden").css("display", "block");
    }else{
        $("#proj-link-hidden").css("display", "none");
    }
}

function saveNewProject(redirect){
    var tn_id = $("#teasernetId").val();
    var proj_name = $("#projName").val();
    
    if( proj_name == '' ){
        openNotification("Название проекта отсутствует");
        $("#projName").addClass('noValid');
        return false;
    }else{
        $("#projName").removeClass('noValid');
    }
    
    if( tn_id == 'Выбрать сеть' ){
        openNotification("Выберите тизерную сеть.");
        $("#teasernetId-styler .jq-selectbox__select").addClass('noValid');
        return false;
    }else{
        $("#teasernetId-styler .jq-selectbox__select").removeClass('noValid');
    }


    var name = $("#projName").val();
    var link = $("#proj-link-hidden").val();
    var teasernet = $("#teasernetId option:selected").html();
    var own_url = ( $("#check-own-url:checked").length == 0 ? 0 : 1 );

    $.ajax({
        url: '/projects/show/check',
        data: {'uid':uid, 'tn':tn_id },
        type: 'post',
        success: function(dt){
            var answer = $.parseJSON(dt);
            if(answer.log == 'success'){
                $.post('/projects/actions/createnew',{'tn_id':tn_id,'name':name,'link':link,'teasernet':teasernet,'own_url':own_url},function(result){
                    var answer = $.parseJSON(result);
                    if( typeof answer.status != 'undefined' && answer.status == 'success' ){
                        document.location.href = "/projects/show/" + answer.id + "?list_id=" + answer.list_id;
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

                    $(".tnName").text( $("#teasernetId option:selected").html() );
                    $('#prpopup').css('display', 'block');
                }
            }
                
        }
    });

    /*$.post('/projects/actions/createnew',{'tn_id':tn_id,'name':name,'link':link,'teasernet':teasernet,'own_url':own_url},function(result){
        var answer = $.parseJSON(result);
        if( typeof answer.status != 'undefined' && answer.status == 'success' ){
            document.location.href = "/projects/show/" + answer.id + "?list_id=" + answer.list_id;
        }
        if(redirect){
            document.location.href = "/projects";
        }else{
            if( result != '' ){
                $("#tab-proj-group tbody").prepend( result );
                $("#tab-proj-group tbody tr.edit").remove();
            }else{
                openNotification( 'Проект с таким названием уже существует!' );
            }
        }
    });*/
}

function sortProjList( vsort, vsord ){
    sort = vsort;
    sord = vsord;

    showProjects(1);
}

function archivated(id){
    var ids = new Array();

    if( typeof id != 'undefined' ){
        ids.push(id);
    }else{
        ids = getCheckedTeaser();
    }
console.log(ids.length);
    if( ids.length == 0 ){
        openNotification('Выберите проекты');
    } else {
        if( confirm( "Вы действительно хотите отправить проект в архив?" ) ){
            $.ajax({
                url: '/projects/actions/archive',
                data: {'ids':ids},
                type: 'post',
                datatype:'json',
                success: function(response){
                    var data = $.parseJSON(response);
                    if( typeof data.success != 'undefined' ){
                        if( data.success === true )
                            showProjects(current_page);
                        else
                            openNotification(data.msg);
                    }else{
                        openNotification("Отправить проект в архив не удалось");
                    }
                }
            });
        }
    }
}

function deleted(id){
    var ids = new Array();

    if( typeof id != 'undefined' ){
        ids.push(id);
    }else{
        ids = getCheckedTeaser();
    }

    if( ids.length == 0 ){
        openNotification('Выберите проекты');
    }

    if( confirm( "Вы действительно хотите удалить проект?" ) ){
        $.ajax({
            url: '/projects/actions/delete',
            data: {'ids':ids},
            type: 'post',
            datatype:'json',
            success: function(response){
                var data = $.parseJSON(response);
                if( typeof data.success != 'undefined' ){
                    if( data.success === true )
                        showProjects(current_page);
                    else
                        openNotification(data.msg);
                }else{
                    openNotification("Удалить проект не удалось");
                }
            }
        });
    }
}

function sendToProject(id){
    $.ajax({
        url: '/projects/actions/toproject',
        data: {'id':id},
        type: 'post',
        datatype:'json',
        success: function(data){
            var answer = $.parseJSON(data);
            if( answer.status == 'success' )
                $("tr.row_" + id).remove();
        }
    });
}

function editProject(id){
    if( $("tr.edit_row").length > 0 ){
        openNotification( "У вас несохраненный проект." );
        return false;
    }

    $("tr.row_" + id).addClass("edits");
    $.ajax({
        url: '/projects/actions/edit',
        data: {'id':id},
        type: 'post',
        datatype:'text',
        success: function(data){
            if( data != '' ){
                $(data).insertBefore( "tr.edits.row_" + id );
                $("tr.edits.row_" + id).remove();
            }
        }
    });
}

function saveChangeProject(id){
    var name = $("#change_name").val();
    var own_url = ( $("#check-own-url:checked").length == 0 ? 0 : 1 );
    var link = $("#proj-link-hidden").val();
    var tn_id = $('#sortch option:selected').val();

    $.post('/projects/actions/save',{'id':id, 'tn_id':tn_id,'name':name,'link':link,'own_url':own_url,'action':action},function(result){
        if( result != '' ){
            $("#tab-proj-group tbody").prepend( result );
            $("#tab-proj-group tbody tr.edit_row").remove();
        }
    });
}

function copyProj(id){
    var ids = new Array();

    if( typeof id != 'undefined' ){
        ids.push(id);
    }else{
        ids = getCheckedTeaser();
    }

    if( ids.length == 0 ){
        openNotification('Выберите проекты');
    } else {
        $.post('/projects/actions/copy',{'ids':ids},function(result){
            var data = $.parseJSON(result);
            if( typeof data.success != 'undefined' && data.success == true ){
                showProjects(current_page);
            }else{
                openNotification("Скопировать проект не удалось");
            }
        });
    }

}

function searchProjects(){
    var search = $(".serch_string").val();
    
    if( search == 'Поиск по проектам' ) search = '';

    $.post('/projects/default/search',{'search':search},function(result){
        showProjects(1);
    });
}

function changeUpName(block){
    saveTeasers();
    $(".but_up").html( 'Выгрузить в ' + block.innerHTML );
    var bid = $(block).parent().attr('data-list_id');
    $(".but_up").attr( 'onclick', 'goUpload(' + bid + ')' );
    $("#p_id").val( bid );
}

function projectList(page){
    pages = page;
    //var id = $("#proj-list-id").val();
    var id = $(".tab-change.t_l_active").attr("data-list_id");
    saveTeasers();
    $.post('/projects/ads/index/id/' + id,{'page':page,'lim':limit,'select':select},function(result){
        $("#teaser-box").html(result);
    });
}


function goUpload(id){
    if( autoSaveTeasers() === true ){
        openNotification('Ожидайте, совершается проверка объявлений.');
        setTimeout(function(){
            setUpTeasers(id);
        },1000);
        /*var badTeaser = checkAllValidData();

        console.log( badTeaser );

        if( badTeaser.length != 0 ){
            if( !confirm( "Ваш проект содержит тизеры, которые не выгрузятся в тизерную сеть по причине несоответствия требованиям! Желаете продолжить?" ) )
                return false;
        }*/

        //document.location.href = '/projects/actions/upload/list_id/' + id;
    }
}

function setUpTeasers(id){
    var ids = getCheckedTeaser();
    //var pid = $("#p_id").val();
    $.ajax({
        url: '/projects/actions/saveup',
        data: {
            'ids': ids,
            //'pid': pid,
        },
        type: 'post',
        datatype:'json',
        success: function(response){
            /*var data = $.parseJSON(response);
            closeNotification();
            if( typeof data.status != 'undefihed' && data.status == 'success' ){
                if( parseFloat(data.all_count) > parseFloat(data.up_count) && parseFloat(data.up_count) != 0 ){
                    if( confirm(data.no_count + ' из ' + data.all_count + ' выбранных объявлений не будут выгружены, т.к. не подходят под требования рекламной сети. Продолжить выгрузку остальных тизеров?') ){
                        document.location.href = '/projects/actions/upload/list_id/' + id;
                    }else{
                        validAllTeasers();
                    }
                }else if( parseFloat(data.all_count) == 0 ){
                    openNotification('Добавьте тизеры.');
                }else if( parseFloat(data.up_count) == 0 ){
                    validAllTeasers();
                    openNotification('Тизеры которые вы пытаетесь выгрузить не соответствуют требованиям тизерной сети.');
                }else{
                    document.location.href = '/projects/actions/upload/list_id/' + id;
                }
            }else{
                openNotification('Тизеры отсутствуют. Добавьте тизеры в проект.');
            }*/
        }
    });
}

function reUpload(task_id){
    var ids = getCheckedTeaser();

    $.ajax({
        url: '/projects/actions/reupload',
        data: {
            'ids': ids,
            'task_id': task_id,
        },
        type: 'post',
        datatype:'json',
        success: function(data){
            var response = $.parseJSON(data);
            if( typeof response.status != 'undefined' ){
                if( response.status == 'success' ){
                    console.log('ok');
                    document.location.href = response.redirect;
                }else{
                    console.log('err');
                    openNotification(response.msg);
                }
                console.log('exist');
            }
            console.log('notexist');
        }
    });
}

function reUploadSetTeasers(id){
    var ids = getCheckedTeaser();

    if( ids.length == 0 ){
        openNotification("Выберите тизеры");
        return false;
    }

    $.ajax({
        url: '/projects/actions/saveup',
        data: {'ids':ids},
        type: 'post',
        datatype:'json',
        success: function(data){
            var response = $.parseJSON(data);
            if( response !== null && typeof response.success != "undefined" && response.success === true ){
                document.location.href = "/projects/actions/upload/list_id/" + id;
            }else{
                openNotification("Выгрузка невозможна");
            }
        }
    });
}

function autoSaveTeasers(){

    $.ajax({
        async: "false",
        url: '/projects/ads/saveteasers',
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
        }
    });

    return true;
}

function checkCreateAccount( tn, uid )
{
    $.ajax({
        url: '/projects/show/checkCreateAcc',
        data: {'tn':tn},
        type: 'post',
        success: function(data)
        {
            var answer = $.parseJSON(data);
        }
    });   
}

function saveNet(grp_id, uid)
{
    $.ajax({
        url: '/projects/show/savenet/grp_id/'+grp_id,
        data: $('form#newnet-form').serialize(),
        type: 'post',
        success: function(data)
        {
            var answer = $.parseJSON(data);
            if(answer.error == false)
            {
                $('li.empty-teaz-net a').html(answer.teasernet);
                $('li.empty-teaz-net').attr('id','list-id-'+answer.list_id);
                $('li.empty-teaz-net').attr('data-list_id',answer.list_id);
                $('li.empty-teaz-net').attr('data-tnid',answer.tn_id);
                $('li.empty-teaz-net').removeClass('empty-teaz-net');
                //$('div#teaser-box').load('/projects/ads/addteaser',{grp_id: answer.grp_id, list_id: answer.list_id});
                $('div#teaser-box').load('/projects/ads/index/id/'+answer.list_id);
                $('div.hide-on-newnet').show();

                $(".but_up").html( 'Выгрузить в ' + answer.teasernet );
                $(".but_up").attr( 'onclick', 'goUpload(' + answer.list_id + ')' );
                $("#p_id").val( answer.list_id );

                //$('li').trigger('refresh');
            }else{
                console.log('error');
            }
        }
    });
}

/**
 *
 * **/
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
            if(answer.error)
            {
                console.log(answer.error);
            }else{
                $('div#teaser-'+answer.image_id).html('<img src="'+answer.image+'" />');
                $('input#img-'+answer.image_id).val(answer.image_name);
                $('div#teaser-'+answer.image_id).closest('div.project_list_one').removeClass('clear-teaser');
                /*$('span.resol_'+answer.image_id).html( answer.resolution.w + 'x' + answer.resolution.h + ',' );
                $('span.size_'+answer.image_id).html( answer.size + ' Кб,' );
                $('span.ext_'+answer.image_id).html( answer.extension );*/
                
                checkLoadImg( answer.image_id, answer );
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

/**
 * Multi-images uploading
 * */
function uploadImages()
{
    var list_id = $('li.t_l_active').data('list_id');
    var formData = new FormData($("#up-files")[0]);
    var ids = getCheckedTeaser();    
    ids = ids.join(',');

    $.ajax({
        url: '/projects/show/multiupload/list_id/' + list_id + '/ids/' + ids,
        type: 'POST',
        data: formData,
        datatype:'json',
        // async: false,
        beforeSend: function() {
            // do some loading options
        },
        success: function (data) {
            var answer = $.parseJSON(data);

            if( typeof answer.t != 'undefined' ){
                for( id in answer.t ){
                    $("#teaser-" + id).html( '<img src="' + answer.t[id].image + '">' );
                    
                    checkLoadImg( id, answer.t[id] );
                }
            }

            if( typeof answer.n != 'undefined' ){
                for( id in answer.n ){
                    $("#teasers").append( answer.n[id] );
                }
            }

            uncheckAll();
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

function getCheckedTeaser(){
    var inputs = $(".plo_chek input:checked");
    var res = new Array();
    inputs.each(function(){
        var id = this.id.substring(7);
        res.push( id );
    });
    return res;
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
    if( value.resolution.h < tn_sets.min_image_height || value.resolution.h  > tn_sets.max_image_height ){
        teas_error = true;
        $( ".resol_" + id ).addClass("error_text");
    }else{
        $( ".resol_" + id ).removeClass("error_text");
    }

    if( value.resolution.w  > tn_sets.max_image_width || value.resolution.w  < tn_sets.min_image_width ){
        teas_error = true;
        $( ".resol_" + id ).addClass("error_text");
    }else{
        $( ".resol_" + id ).removeClass("error_text");
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

function uploadDescriptions()
{
    var grp_id = $('#grp_id').val();
    var list_id = $('li.t_l_active').data('list_id');
    var formData = new FormData($("#up-descs")[0]);
    var ids = getCheckedTeaser();    
    ids = ids.join(',');

    $.ajax({
        url: '/projects/show/descup/grp_id/' + grp_id + '/list_id/' + list_id + '/ids/' + ids,
        type: 'POST',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,

        beforeSend: function(){},
        success: function(data){

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
                    $("#teasers").append( data.n[id] );
                    checkNoValidTeaser(id);
                }
            }
            uncheckAll();
        }
    });

}

function changeNum(el,id) //изменение отображения кол-ва тизеров в проекте
{
    $('#teaser-box').load('/projects/ads/index/id/'+$('.t_l_active').data('list_id')+'/perpage/'+$(el).val());
}

function changePrNum(el) //изменение отображения кол-ва проектов на странице
{
    $('#prj-container').load('/projects/default/index/perpage/'+$(el).val()+' #prj-table');
}

function checkAllTeaser(){
    $('input:checkbox').attr('checked','checked').trigger('refresh');
}

function uncheckAllTeaser(){
    $('input:checkbox').removeAttr('checked').trigger('refresh');
}

function saveTeasers(id, redirect){
    //console.log(id);
    if( typeof id != 'undefined' ){
        $.ajax({
            url: '/projects/ads/saveads/grp_id/'+id,
            type: 'post',
            data: $("div#teaser-box form").serialize(),
            dataType: 'json',
            success: function(data){
                if(redirect !=='undefined' && redirect == true){
                    window.onbeforeunload = false;
                    document.location.href = data.url;
                }
            }
        });
    }
}

function checkLength(el){
    var max = $(el).attr('maxlength');
    var curr = $(el).val().length;
    var name = $(el).data('name');
	
	$(el).toggleClass("error_teazer", max - curr < 0);
	$('#'+name).html(curr);
}

function preloaderShow(block){
    var b = $("#store-styler .jq-selectbox__select");

    if( b.length == 0 )
        var b = $("#category-styler .jq-selectbox__select");

    calcPos(b);
}

function preloaderClose(){
    $("#loading").css('display','none');
}

function calcPos(block){
    if( block.length == 0 ) return false;

    var loader = $("#loading");
    var tpos = block.offset().top + ( block.outerHeight() / 2 ) - ( loader.outerHeight() / 2 );
    var lpos = block.offset().left + block.outerWidth() + 3;
    loader.css('position','absolute').css('display','block').css("top",tpos).css("left",lpos);
}

function checkNoValidTeaser(id){
    var tblock = $(".project_list_one");

    if( typeof id != "undefined" && id != '' ){
        checkTextValid(id, 'caption');
        checkTextValid(id, 'description');
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

function validAllTeasers(){
    var teasers = $(".project_list_one");
    teasers.each(function(){
        var tid = this.id.replace('tblock_','');
        checkNoValidTeaser(tid);
    });
}

function checkTextValid(id, block){
    var input = $("#" + id + "_" + block);
    var limit = input.attr("maxlength");

    var leng = input.val().length;

    if( leng > limit ){
        input.addClass("error_teazer");
    }else if( input.hasClass("error_teazer") ){
        input.removeClass("error_teazer");
    }

    checkLength(input);

    if( block == 'caption' && leng == 0 )
        input.addClass("error_teazer");
    if( block == 'description' && tn_sets.description_need > 0 && leng == 0 )
        input.addClass("error_teazer");

    if( input.hasClass("error_teazer") ) return false;
    else return true;
}

function checkImageValid(i){
    var teas_error = false;

    if( typeof __ads[i] != 'undefined' && __ads[i].resolution !== null ){
        if( parseFloat( tn_sets.image_file_size ) < __ads[i].size ){
            teas_error = true;
            $( ".size_" + i ).addClass("error_text");
        }else{
            $( ".size_" + i ).removeClass("error_text");
        }
        if( parseFloat( tn_sets.min_image_width ) > __ads[i].resolution.w && tn_sets.max_image_width < __ads[i].resolution.w ){
            teas_error = true;
            $( ".resol_" + i ).addClass("error_text");
        }else{
            $( ".resol_" + i ).removeClass("error_text");
        }
        if( parseFloat( tn_sets.min_image_height ) > __ads[i].resolution.h && tn_sets.max_image_height < __ads[i].resolution.h ){
            teas_error = true;
            $( ".resol_" + i ).addClass("error_text");
        }else{
            $( ".resol_" + i ).removeClass("error_text");
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

function checkImageValidAll(){
    var img = $(".project_list_one img").parent();

    img.each(function(){
        var id = this.id.substring(7);
        checkImageValid(id);
    });
}

function checkAllValidData(){
    var bad_ads = new Array();

    for( i in __ads ){

        var $caption = $("#" + i + "_caption");
        var $description = $("#" + i + "_caption");
        var $url = $("#" + i + "_url");
        var $size = $.trim( $(".size_" + i).html().replace('Кб,', '') );

        if( $caption.length > 0 && ( parseFloat($caption.val().length) > parseFloat(tn_sets.title_length) || parseFloat($caption.val().length) == 0 ) ){
            bad_ads.push(i);
        }else if( $description.length > 0 && ( parseFloat($description.val().length) > parseFloat(tn_sets.title_length) || tn_sets.description_need > parseFloat($description.val()).length ) ){
            bad_ads.push(i);
        }else if( parseFloat($size) > parseFloat(tn_sets.image_file_size) ){
            bad_ads.push(i);
        }else if( $url.length > 0 && $url.val().length == 0 ){
            bad_ads.push(i);
        }
        /*else if(){

        }*/


        /*if( typeof __ads[i] != 'undefined' && __ads[i].resolution !== null ){
            if( parseFloat(__ads[i].caption.length) > parseFloat(tn_sets.title_length) )
                bad_ads.push(i);
            else if( tn_sets.description_need == 1 && parseFloat(__ads[i].description.length) > parseFloat(tn_sets.description_length) )
                bad_ads.push(i);
            else if( tn_sets.image_file_size < __ads[i].size )
                bad_ads.push(i);
            else if( tn_sets.min_image_width > __ads[i].resolution.w && tn_sets.max_image_width < __ads[i].resolution.w )
                bad_ads.push(i);
            else if( tn_sets.min_image_height > __ads[i].resolution.h && tn_sets.max_image_height < __ads[i].resolution.h )
                bad_ads.push(i);
        }*/
    }

    return bad_ads;
}

function showDetailHistory(pid){
    document.location.href = '/projects/history/view/id/' + pid;
}

function checkAll(){
    var block = $(".tbl_check");

    block.each(function(){
        var id = this.id.substring(3);

        if( __app.indexOf( id ) == -1 )
            __app.push(id);

        $("#" + this.id + " .jq-checkbox").addClass('checked');
    });
}

function uncheckAll(){
    var block = $(".tbl_check");

    block.each(function(){
        var id = this.id.substring(3);
        var del = __app.indexOf( id );
        if( del != -1 )
            __app.splice(del,1);

        $("#" + this.id + " div.jq-checkbox").removeClass("checked");
    });
}

function adOneCheck(aid, check){
    var id = aid.substring(3);
    var del = __app.indexOf( id );

    if( check === true && del == -1 )
        __app.push( id );
    else if( check === false && del != -1 )
        __app.splice(del,1);
}

function repeatUpload(task_id){
    if( __app.length == 0 ){
        openNotification("Выберите тизеры, которые хотите повторно выгрузить.");
    }

    function onSuccess(result){
        openNotification(result.msg);
    }

    $.ajax({
        url: '/projects/actions/repeatupload',
        type: 'POST',
        data: {"task_id":task_id,"ads":__app},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

function changeUploadList(list_id){
    document.location.href = "/projects/actions/upload/list_id/" + list_id;
}

function checkViewUpDate(id){
    if( $('#' + id).is(':checked') )
        $("#datepicker_block").show();
    else
        $("#datepicker_block").hide();
}

/*function setPassByLogin(login){
    var tid = $("#tid").val();

    function onSuccess(result){
        if( typeof result.status != "undefined" && result.status == 'success' )
            $("#password_form").val(result.pass);
        else
            $("#password_form").val('');
    }

    $.ajax({
        url: '/projects/actions/getpass',
        type: 'POST',
        data: {"login":login,"tid":tid},
        dataType: 'json',
        success: onSuccess,
    });
}*/

/* History start */
function uphistory(page){
    openPreloader();
    $.post('/projects/history/show',{'page':page,'search':search_proj,'sort':sort,'sord':sord,'grp':grp,'us':us},function(result){
        closePreloader();$(".tab_view").html(result);
    });
}

function historySearch(){
    search_proj = $("#serch_string").val();
    
    if( search_proj == 'Поиск по проектам' ) search_proj = '';

    uphistory(1);
}

function sortHistori(st, sd){
    sort = st;
    sord = ( sd == "DESC" ) ? "ASC" : "DESC";
    uphistory(1);
}

function detailhistory(){
    $.post('/projects/history/detail',{'search':search_proj,'task':task_id},function(result){
        $("#prj-table").html(result);
    });
}

function detailhistorySearch(){
    search_proj = $("#search-teasers").val();
    detailhistory();
}
/* History end */

function logInStatus(){
    $("#login_pass_block").hide();
    $("#enter").hide();
    $("#loginbox").show();
    $("#loginset").html($("#login_form").val());

    $("#upload-form input").removeAttr('disabled');
    $("#upload-form input").trigger('refresh');
    $("#upload-form select").removeAttr('disabled');
    $("#upload-form select").trigger('refresh');
}

function logoutAccount(){
    $("#login_pass_block").show();
    $("#enter").show();
    $("#loginbox").hide();

    $("#upload-form select, #upload-form input").each(function(){
        $(this).attr("disabled", "disabled");
        $(this).trigger('refresh');
    });

    $(".form-cont-right").addClass("noActForm");
}

function illegalChar(value){
    var arr = ["script", "<", ">", ";", "(", ")", "alert", "console"];
    var error = [];
    
    $.each( arr, function(v, k){
        if(value.indexOf(k) == 0)
            error[v] = k;
    });

    if(error.length > 0)
        return true;
    
    return false;
}

function showPass(){
    
    var pass = $("#password_form").val();


    if( $("#password_form").attr('type') == 'password' ){
        $(".change-field-pass").html('<input id="password_form" type="text" value="' + pass + '" name="password_form">');
    }else{
        $(".change-field-pass").html('<input id="password_form" type="password" value="' + pass + '" name="password_form">');
    }
}

function createNewProj(){
    $.post('/projects/default/newcreate',{},function(result){
        $("#prj-container").html(result);
    });
}

function unloadPage(){
    if(confirm('Вы внесли изменения в проект, которые могут быть потеряны. Сохранить изменения?'))
        autoSaveTeasers();
}

function toEnter(rotate){
    var data = $('#login-form').serialize(); 
    $.ajax({
        url: '/projects/actions/enter',
        data: data,
        type: 'post',
        datatype:'json',
        success: function(response){
            onLogin(response);
        },
        beforeSend: function(){
            if( !checkLoginPass() ) return false;
        },
        dataType: 'json',
        error: function(data){
            preloaderClose();
            openNotification( "Ошибка запроса. Попробуйте позже, или обратитесь в техподдержку." );
        }
    });
}

function onLogin(data){
    if (typeof data.subRequest != 'undefined' && data.subRequest == 'then') {
        var rotate = true;
        setTimeout(function(){
            toEnter(rotate);
        }, 5000);
    }
    preloaderClose();

    if( data != '' && typeof data.err != 'undefined' ){
        openNotification( data.err );
        return false;
    }else if( data != '' && typeof data.project != 'undefined' ){
        logInStatus();
        if( typeof data.setts != 'undefined' && data.setts !== false ){
            setting = data.setts;

            if( typeof setting.priceclick != 'undefined' )
                $('#priceclick').val( setting.priceclick );

            if (typeof setting.projlink != 'undefined' &&
                setting.projlink != '' && $('#projlink').val() == '') {
                $('#projlink').val( setting.projlink );                
            }
        }

        $("#store").html( data.project );

        $("#store").trigger("refresh");

        $("#store").on("change", function(){
            $("#hide_campain").val($("#store option:selected").text());
        });

        $("#UploadTask_account").val($("#login-form input[name=login_form]").val());
        $("#UploadTask_password").val($("#login-form input[name=password_form]").val());
        $("#UploadTask_ac_id").val($("#login-form #ac_id").val());

        if( setSettings('project_id', 'store') ){
            $("#store").trigger("refresh");
            storeChange();
        }
    }
    $(".form-cont-right").removeClass("noActForm");

    if( typeof data.minprice != 'undefied' ){
        setMinPrice(data);
    }

    if( typeof data.projlink != 'undefied' ){
        projLink = data.projlink;
    }
    $("#store").on("change", function(){
        storeChange();
    });

    if( $("#store").length == 0 ){
        loadCategory('?proj=0');
    }
}

function setSettings(index, field, multi){
    if( typeof setting != 'undefined' && typeof setting[index] != 'undefined' ){
        var i = setting[index];
        if( field == 'subcategory' && multi === false )
            var i = setting[index][0];

        if( i == 'Выберите проект' || i == 'Выберите категорию' )
            return false;

        if( 'store' == field ){
            $("#store option").each(function(){
                var $this = $(this);
                if( $this.val() == i ){
                    $this.attr('selected', 'selected');
                    return false;
                }
            });
        }else {
            if (i != 'Выберите подкатегорию') {
                $("#" + field + " option[value=" + i + "]").attr('selected', 'selected');
            }
        }

        return true;
    }else
        return false;
}

function setMinPrice(data){
    if( typeof data.minprice != "undefined" && data.minprice.min != "undefined" )
        $("#priceclick").data('minprice', data.minprice.min).attr('data-minprice', data.minprice.min);
    else
        $("#priceclick").data('minprice', data.minprice).attr('data-minprice', data.minprice);
} 

function setCategoryMinPrice(){
    var cat_id = $("#category").val();
    if( typeof proj_click_range != 'undefined' && typeof proj_click_range[cat_id] != 'undefined' ){
        $("#priceclick").data('minprice', proj_click_range[cat_id].min).attr('data-minprice', proj_click_range[cat_id].min);
    }
} 

function loadCategory(proj){
    var param = ( typeof proj != 'undefined' || proj != '' ) ? proj : '';

    calcPos($("#category-styler .jq-selectbox__select"));
    var data = $("#login-form, #upload-form").serializeArray();

    $.ajax({
        url: '/projects/actions/enter' + param,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(response){
            preloaderClose();
            /*$('#category').on('click', function(){
                console.log($("#category option:selected").html());
                console.log($('#category-styler .jq-selectbox__dropdown ul li.selected').text());
            })*/

            if( typeof response != 'undefined' && typeof response.minprice != 'undefied' ){
                setMinPrice(response);
            }

            if( typeof response.proj_range != 'undefied' ){
                proj_click_range = response.proj_range;
                setCategoryMinPrice();
            }
            
            if( response != '' && typeof response.err != 'undefined' ){
                openNotification( response.err );
                return false;
            }else if( response != '' && typeof response.category != 'undefined' ){
                $("#category").html(response.category);
                $("#category").trigger("refresh");

                if( setSettings('category_id', 'category') ){
                    $("#category").trigger("refresh");

                    if( $("#subcategory").length > 0 ){
                        loadSubategory('');
                    }
                }
                
                $("#category").on("change", function(){
                    $('#hidden_category').val($("#category option:selected").html());

                    if( $("#subcategory").length > 0 ){
                        loadSubategory('');
                    }
                });
            }
        },
    });
}

function storeChange(){
    var project_id = $("#store").val();
    if( typeof projLink != 'undefined' && typeof projLink[project_id] != 'undefined' ){
        $("#projlink").val(projLink[project_id]);
    }

    var tid = $('#tid').val();
    if(tid == 7){
        var type = $('#store option:checked').data('type');
        $('#teaser_type_div input[type=radio][value='+type+']').prop('checked', true).trigger('refresh');
        $('#teaser_type_check').val(type);
        $('#teaser_type_div input[type=radio]').attr('disabled', 'disabled');
        checkType(type, 0, true);
    }

    var cat_ext = $("#category_exist").val();

    if( cat_ext > 0 && $("#category").length > 0 && project_id != '' ){
        loadCategory('');
    }else if( $("#subcategory").length > 0 ){
        loadSubategory( "?cat_ext=" + cat_ext );
    }
}

function loadSubategory(proj){
    var param = ( typeof proj != 'undefined' || proj != '' ) ? proj : '';

    if( $("#subcategory-styler .jq-selectbox__select").length == 0 )
        calcPos($("#subcategory-styler ul"));
    else
        calcPos($("#subcategory-styler .jq-selectbox__select"));

    var data = $("#login-form, #upload-form").serializeArray();

    $.ajax({
        url: '/projects/actions/enter' + param,
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(response){
            preloaderClose();

            if( response != '' && typeof response.err != 'undefined' ){
                openNotification( response.err );
                return false;
            }else if( response != '' && typeof response.subcategory != 'undefined' ){
                if( typeof response.minprice != 'undefied' ){
                    setMinPrice(response);
                }

                if( $("#subcaregory_multiple").val() == 1 ){
                    var $sc = $("#subcategory");
                    $sc.attr("multiple", "multiple");
                    $sc.html( response.subcategory );
                    $("#subcategory-styler").remove();
                    $sc.multiselect();
                }else{
                    if( response.subcategory === false ){
                        openNotification("У Вас нет подкатегорий, продолжайте");
                        $("#subcategory").html('');
                    }else{
                        $("#subcategory").html(response.subcategory);

                        if( setSettings('subcategory_id', 'subcategory', false) ){
                            $("#subcategory").trigger("refresh");
                        }
                    }

                    $("#subcategory").trigger("refresh");
                }


                //if( typeof response.subcategory_status != 'undefined' && response.subcategory_status == 'multiple' ){
                    /*$("#subcategory").html(response.subcategory);

                    $("#subcategory_div").show();
                    $("#subcategory").attr("multiple", "multiple");
                    $("#subcategory").trigger("refresh");
                    $("#subcategory-styler ul").height("120px");
                    $("li").removeClass("selected");
                    $("li").removeClass("sel");
                    $("#subcategory-styler ul li").removeAttr("unselectable");*/
                /*}else{
                    $("#subcategory").html(response.subcategory);
                    $("#subcategory").trigger("refresh");
                }*/

                var $us = $("#usage_site");
                if( $us.length != 0 ){
                    //$us.trigger("refresh");
                    $us.attr("multiple", "multiple");
                    $us.html( response.subcategory );
                    $("#usage_site-styler").remove();
                    $us.multiselect();
                    $("#usage_div").show();

                    /*
                    us.attr("multiple", "multiple");
                    us.trigger("refresh");
                    $("#usage_site-styler ul").height("120px");
                    $("li").removeClass("selected");
                    $("li").removeClass("sel");
                    $("#usage_site-styler ul li").removeAttr("unselectable");*/
                    $("#subcategory").on("change", function(){
                        $('#hidden_subcategory').val($("#subcategory option:selected").html());
                    });
                }
                $("#subcategory").on("change", function(){
                    $('#hide_cat_name').val($('#subcategory option:selected').html());
                });
            }
        },
    });
}

function checkLoginPass(){
    if( $("#login_form").val() == '' || $("#password_form").val() == '' ){
        openNotification( "Введите логин и пароль." );
        return false;
    }else{
        preloaderShow();
        return true;
    } 
}

function createAccResult(data){
    if( typeof data.refresh != 'undefined' && data.refresh === true ){
        openNotification(data.msg);
        setTimeout(function(){
            location.reload();
        }, 5000);
    }else{
        openNotification(data.msg);
    }
}

function loadAfterDelete(){
    
    projectList(pages);

    /*var id = $(".tab-change.t_l_active").attr("data-list_id");
    saveTeasers();
    $.post('/projects/ads/index/id/' + id,{'page':page},function(result){
        $("#teaser-box").html(result);
    });
    $("#teaser-box").load("/projects/ads/index/id/"+$("li.t_l_active").data("list_id"));*/
}

function changeTeaserCount(val){
    limit = val;
    projectList(1);
}

function selectTeaserProj(ct){
    select = ct;
    $(".choiseSelectBlock").hide();
    projectList(1);
}

function changeLinkStatus(){
    var check = $("#check-own-url-styler").hasClass("checked");
    var id = $(".tab-change.t_l_active").attr("data-list_id");

    linkDisabEnab(!check);

    if( !check ){
        $.post('/projects/actions/linkstatus',{'id':id,'own':check},function(result){});
    }else{
        var url = $("#proj-link-hidden").val();
        $.post('/projects/actions/linkstatus',{'id':id,'own':check,'url':url},function(result){});
    }
}

function linkDisabEnab(status){
    var links = $(".plo_link input[type=text]");
    links.each(function(){
        if( status )
            $(this).removeAttr("disabled").removeClass("txt-block");
        else
            $(this).attr("disabled", "disabled").addClass("txt-block");
    });
}

function applyLink(){
    if( $(this).hasClass('active_button') && $("#check-own-url-styler").hasClass("checked") ){
        var link = $("#proj-link-hidden").val();
    }
}

function uploadStop(id){
    $.post('/projects/actions/upstop',{'id':id},function(result){
        var answer = $.parseJSON(result);
        if( typeof answer.success != "undefined" ){
            uphistory(1);
        }else{
            openNotification('Выгрузку остановить не удалось');
        }
    });
}

function copyTask(id){
    document.location.href = "/projects/actions/upload/task_id/" + id + "/act/copy";
}

function changeTask(id){
    document.location.href = "/projects/actions/upload/task_id/" + id + "/act/change";
}
function deleteTask(id){
    $.ajax({
        url: '/projects/history/deleteuploadtask',
        data: {'task_id': id,},
        type: 'post',
        success: function() {
            uphistory(1)
        }
    });
}

/*function checkDataNonAccount(data){
    if( data == 'noaccount' ){
        
        return false;   
    }
    else return true;
}*/
