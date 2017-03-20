var __app = new Array();

PG = function(){
	this.selImg = new Array();

	this.searchType = 1;
	this.params = {};
	this.grp_id = false;
	this.prj_id = false;
	this.ads_id = {};
	this.change = false;

	/* SET SEARCH */
	this.setSearch = function(e){
		this.params['search'] = $(e).val();
	};

	/* SET SAFE MODE */
	this.setSafeMode = function(mode){
		this.params['safe'] = mode;
	};

	/* SET SEARCH TYPE */
	this.setSearchType = function(type){
		this.searchType = type;
		this.params['type'] = type;
	};

	/* START PROGRESS SEARCH */
	this.progressStart = function(){
		openPreloader();
	};

	/* STOP PROGRESS SEARCH */
	this.progressStop = function(){
		closePreloader();
	};

	/* SET SELECTED FILTER */
	this.selectedFilters = function(){
		var fSize = $(".filter-item__params.size-filter li.checked");
		if( fSize.length != 0 ){
			this.setListFilter(fSize[0],'gsize');
		}

		var fTone = $(".filter-item__params.color-filter li.checked");
		if( fTone.length == 1 ){
			this.setListFilter(fTone[0],'gcolor');
		}

		var fColor = $(".filter-item__params.color-filter div.checked");
		if( fColor.length == 1 ){
			this.setListFilter(fColor[0],'gcolor', true);
		}

		var fType = $(".filter-item__params.type-filter li.checked");
		if( fType.length == 1 ){
			this.setListFilter(fType[0],'gtype');
		}

		var fFormat = $(".filter-item__params.format-filter li.checked");
		if( fFormat.length == 1 ){
			this.setListFilter(fFormat[0],'gformat');
		}
	};

	/* INIT EVENTS */
	this.init = function(){
		var self = this;
		$('.search-in-google select').styler();

		$('.open__search-in-google').click(function(){
			$('.search-in-google').fadeIn('fast');
			//self.setHtmlHeight();
		});
		
		$('.search-in-google__ovr, .close-btn').click(function() {        
			$('.search-in-google').fadeOut('fast');
			$('html').removeAttr('style');
		});

		$('.item-tx, [data-toggle=dropdown]').click(function() {
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});

		$(document).click(function (e) {
		  if ($('.filter-item').has(e.target).length === 0){			    			
			$('.item-tx, .dropdown-toggle').parent().removeClass('open');			
		  }
		});

	    $('.sig-tabs1 li:not(.__na)').click(function () {
            $this = $(this);
            var tabItem = $(this).data('sigtab');
            $('.sig-tabs-cnt1 > [id]').hide();
            $('#'+tabItem).show();
            $this.siblings().removeClass('__ac');
            $this.addClass('__ac');
        });
	    $('.sig-tabs2 li:not(.__na)').click(function () {
            $this = $(this);
            var tabItem = $(this).data('sigtab');
            $('.sig-tabs-cnt2 > [id]').hide();
            $('#'+tabItem).show();
            $this.siblings().removeClass('__ac');
            $this.addClass('__ac');
        });
	};

	/* ENTER EVENT */
	this.enter = function(event, type){
		if(event.keyCode == 13){
			if( type == 1 )
				this.setSearchGo();
			else if( type == 2 )
				this.setSearchByUtl();
		}
	};

	this.setSearchGo = function(){
		if( this.searchType == 1 ){
			this.setSearchType(1);
			this.setSearch($('#gsearch'));
			this.params['page'] = 0;
			
			var $upImg = $('#js-upImg');
			$upImg.addClass('__na');

			this.goSeacrh();
		}else{
			this.params['page'] = 0;
			this.goSeacrh();
		}
	};

	this.setSearchByUtl = function(){
		$('#gsearch').val('');
		this.setSearchType(2);
		this.setSearch($('#ghsearch'));
		this.params['page'] = 0;

		this.closeUpImg();
		var $upImg = $('#js-upImg');
		$upImg.find('img').attr('src', this.checkSchema(this.params['search']));
		$upImg.removeClass('__na');
		this.setImgName(this.params['search']);
		
		this.goSeacrh();
	};

	this.checkSchema = function(url){
		if( url.indexOf('http') == -1 ){
			return 'http://'+url;
		}else
			return url;
	};

	/* SEARCH IMG BY WORDS */
	this.goSeacrh = function(more){
		if( typeof this.params['search'] == 'undefined' || this.params['search'] == '' ){
			if( this.searchType == 1 )
				openNotification('Введите ключевое слово');
			else
				openNotification('Введите источник картинки');
			return false;
		}

		this.progressStart();

		var self = this;
		$.post('/projects/imgsearch/search', {'method': 'find','params': this.params},function(result){
			self.progressStop();
			self.setResult(result, more);
			setPanelBoxHeight();
		});
	};

	/* SET SEARCH RESULT */
	this.setResult = function(result, append){
		if( result != '' ){
			if( typeof append != 'undefined' && append === true )
				$('#searchResult').append(result);
			else{
				if( $('#js-resultBlock').css('display') == 'none' ){
					$('#js-resultBlock').show();
					$('#js-searchInfo').hide();
				}

				$('#searchResult').html(result);
			}
		}

		this.selected('been');
	};

	/* GET MORE RESULT BY REQUEST */
	this.moreResult = function(){
		this.params['page'] = ( typeof this.params['page'] != 'undefined' ? ( this.params['page'] + 1 ) : 1 );
		this.goSeacrh(true);
		/*this.progressStart();
		var self = this;
		$.post('/projects/imgsearch/search', {'method':'find','params':this.params}, function (result) {
			self.setResult(result, true);
			self.progressStop();
			//self.setHtmlHeight();
		});*/
	};

	/* SET SELECTED FILTER */
	this.setListFilter = function(e, bid, clr, event){
		if( typeof event != 'undefined' && event.target.className == 'ion-android-close' )
			return false;

		var $li = $(e);
		var list_id = $li.data('list');
		var $sublicheck = $li.find('li.checked');

		$li.closest('.filter-item').find('li').removeClass('checked');
		$li.closest('.filter-item').find('div').removeClass('checked');
		
		if(typeof list_id != 'undefined' && list_id != 1 ){
			if( list_id == 2 )
				$li.closest('li').addClass('checked');
			else
				$sublicheck.addClass('checked');
		}

		$li.addClass('checked');

		if( list_id != 3 )
			this.params[bid] = $li.find('span').data('id');

		var $mnli = $li.closest('.filter-item');
		$mnli.removeClass('open');

		if( ( typeof clr == 'undefined' || !clr ) && list_id != 3 )
			$mnli.find('div.item-tx').html($li.find('span').html()).addClass('__ac');
		else if( list_id != 3 )
			$mnli.find('div.item-tx').html($li.html());

		if( bid == 'gsize' && $('.format-filter li.checked').length > 0 ){
			this.setListFilter( $('.format-filter li:first-child'), 'gformat' );
		}
	};

	/* SET SIZE RANGE */
	this.setSizeRange = function(e, bid){
		if( typeof this.params['grsize'] == 'undefined' ){
			this.params['grsize'] = {};
		}
		var size = this.validateSize($(e).val());

		$('.size-filter').siblings('.item-tx').addClass('__ac');

		this.params['grsize'][bid] = size;
		$(e).val(size);
		this.params['gsize'] = -1;
		$('.size-filter li').removeClass('checked');
	};

	/* SET LIMIT */
	this.setLimit = function(e){
		var $elem = $(e);
		this.params['lim'] = $elem.html();
		$elem.closest('.result-on-page').find('span').removeClass('active');
		$elem.addClass('active');

		this.goSeacrh(true);
		//this.setSearchGo();
	};

	/* RESET ALL FILTER STEP 1 */
	this.resetAll = function(){
		this.params = {};

		$(".search-in-google__filter__params div.item-tx").each(function(){
			$(this).html($(this).data('default')).removeClass('__ac');
		});

		$("#gsearch").val('');
		$("#ghsearch").val('');

		$('.result-on-page span').removeClass('active');
		$('.result-on-page span:first-child').addClass('active');

		$('#radios-1').prop('checked', true);

		$(".search-in-google__filter__params li").removeClass('checked');
		$(".search-in-google__filter__params #sc-block div").removeClass('checked');

		$('#js-resultBlock .center.mb2 button').hide();

		$('#grsize_from').val('');
		$('#grsize_to').val('');

		this.unselect();
		this.searchType = 1;

		if( typeof e == 'undefined' ) $('#js-upImg').addClass('__na');
		else $(e).parent().addClass('__na');
		this.clearResult();
		setPanelBoxHeight();
		$.post('/projects/imgsearch/search', {'method':'reset','params':{'all': 1}}, function (result) {});
	};

	/* DELETE SIZE */
	this.delSize = function(e){
		var size_id = $(e).parent().find('span').data('id');
		$.post('/projects/imgsearch/search', {'method':'delsize','params':{'size_id':size_id}}, function (result) {
			var data = $.parseJSON(result);
			if( typeof data.success != 'undefined' && data.success ){
				$(e).parent().remove();
			}
		});
	};

	/* CHECK SELECTED BY STEP */
	this.selected = function(m, e){
		var self = this;
		if( typeof m != 'undefined' ){
			if( m == 'add' ){
				$('#searchResult input:checked').each(function(){
					var url = $(this).data('id');
					if( self.selImg.indexOf( url ) == -1 )
						self.selImg.push(url);
				});
			}else if( m == 'del' ){
				this.selImg = new Array();
			}else if( m == 'been' && this.selImg.length > 0 ){
				$('#searchResult input').each(function(){
					var url = $(this).data('id');
					if( self.selImg.indexOf( url ) != -1 )
						$(this).prop('checked', true);
				});

				$('#searchResult input').trigger('refresh');
			}else if( m == 'one' ){
				var url = $(e).data('id');
				var pos = this.selImg.indexOf( url );
				if($(e).prop('checked')){
					if( pos == -1 )
						this.selImg.push(url);
				}else{
					if( pos != -1 )
						this.selImg.splice(pos, 1);
				}
			}
		}

		$("#ad_cnt_check").html(this.selImg.length);
	};

	/* SELECT */
	this.select = function(){
		$('#searchResult input').prop('checked', true).trigger('refresh');
		this.selected('add', undefined);
	};

	/* UNSELECT */
	this.unselect = function(){
		$('#searchResult input').prop('checked', false).trigger('refresh');
		this.selected('del', undefined);
	};

	/* SELECT BY IMG */
	this.selectByImg = function(e, b){
		var $inpt = $(e).siblings('.sig-img-b-p').find('input');
		$inpt.prop('checked', !$inpt.prop('checked')).trigger('refresh');

		this.selected('one', $inpt);
	};

	/* REMOVE IMG */
	this.removeImg = function(e, b){
		var $parent = $(e).closest('.sig-img-item');
		var $inp = $parent.find('input');
		$inp.prop('checked', false);
		this.selected('one', $inp, b);
		$parent.remove();
		$('.stepAllRes').html( $('#searchResult input').length );
	};

	/* SELECT CROP SIZE */
	this.selectSize = function(e,save){
		$('.size-filter li').removeClass('checked');
		$(e).closest('.btn-group').removeClass('open');

		var $from = $('#grsize_from');
		var $to = $(' #grsize_to');

		this.setSizeRange($from, 'from');
		this.setSizeRange($to, 'to');

		if(!save){
			var slct = $from.val() + ' x ' + $to.val();

			$('.size-filter').siblings('.item-tx').html(slct);
			$(e).closest('.filter-item').removeClass('open');

		}else{
			var self = this;
			$.post('/projects/imgsearch/search', {'method':'addsize','params':this.params}, function (result) {
				var answer = $.parseJSON(result);
				if( typeof answer.success != 'undefined' ){
					if( answer.success ){
						if( typeof answer.block != 'undefined' )
							$(".size-img-params").before(answer.block);
						$('.size-filter li>span').each(function(){
							if( $(this).data('id') == answer.check ){
								self.setListFilter($(this).parent(), 'gsize');
							}
								//$(this).parent().addClass('checked');
						});
						$(e).closest('.filter-item').removeClass('open');

					}else{
						openNotification(answer.msg);
					}
				}
			});
		}
	};

	/* DOWNLOAD SELECTED BY STEP 2 */
	this.downloadSelected = function(){
		if( typeof this.selImg['step2'] == 'undefined' || this.selImg['step2'].length == 0 ){
			openNotification('Выберите изображения');
			return false;
		}
		openPreloader();
		var self = this;
		$.post('/projects/imgsearch/search', {'method':'loadimg','params':{'images':this.selImg['step2']}}, function (result) {
			closePreloader();
			if( result != '' ){
				self.checkInitStep(3,2);
				$('#resultStep3').append(result);
				setTimeout(function () {
					//self.setHtmlHeight();
				}, 500);
				self.editImg($('#resultStep3 img')[0], false);
			}else{
				openNotification('Не удалось получить изображения');
			}
		});
	};

	/*this.searchByImg = function(type){
		this.searchType = ( typeof type != 'undefined' ? type : 2 );
		this.params['searchType'] = this.searchType;
		if( typeof this.params['search'] == 'undefined' || this.params['search'] == '' ){
			openNotification('Введите ссылку на картинку');
			return false;
		}

		this.progressStart();
		this.params['page'] = 0;
		var self = this;
		this.selImg['step2'] = new Array();

		$('#moreRes').attr('onclick', 'pgoogle.moreResultImg();');
		this.closeUpImg();
		var $upImg = $('#js-upImg');
		$upImg.find('img').attr('src', this.params['search']);
		$upImg.show();

		$.post('/projects/imgsearch/search', {'method': 'findbyurl','params': this.params},function(result){
			self.progressStop();
			self.setResult(result);
			setTimeout(function () {
				//self.setHtmlHeight();
			},500);
		});
	};*/

	/* GET MORE RESULT BY IMG URL REQUEST */
	/*this.moreResultImg = function(){
		this.params['searchType'] = this.searchType;
		this.params['page'] = ( typeof this.params['page'] != 'undefined' ? ( this.params['page'] + 1 ) : 1 );
		this.progressStart(true);
		var self = this;
		$.post('/projects/imgsearch/search', {'method':'findbyurlmore','params':this.params}, function (result) {
			self.setResult(result, true);
			self.progressStop(true);
			//self.setHtmlHeight();
		});
	};*/

	this.openSearchByImg = function(){
		var search = $('#ghsearch').val();
		if( search != '' )
			this.params['search'] = search;

		$('.sig_sip').show();
	};

	this.closeUpImg = function(){
		$('.sig_sip').hide();
	};

	this.uploadImage = function(){
		var formData = new FormData($("#upSearchImg")[0]);
		formData.append("params", JSON.stringify(this.params));
		formData.append("method", 'upimg');

		this.progressStart();
		this.closeUpImg();
		this.searchType = 2;

		var self = this;
	    $.ajax({
	        url: '/projects/imgsearch/search',
	        type: 'POST',
	        data: formData,
	        datatype:'json',
	        success: function (result) {
	        	self.progressStop();
	        	var data = $.parseJSON(result);
	        	if( typeof data.success != 'undefined' ){
	        		if( data.success ){
	        			$('#js-upImg img').attr('src', self.checkSchema( data.imgSource ) );
	        			$('#js-upImg').removeClass('__na');
	        			$('#ghsearch').val( data.imgSource );

	        			self.setImgName(data.imgSource);

	        			self.params['search'] = data.imgSource;
	        			self.params['type'] = 3;
	        			self.params['page'] = 0;
	        			self.goSeacrh();
	        		}else{
	        			openNotification(data.msg);
	        		}
	        	}
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	    return false;
	};

	this.setImgName = function(url){
		$('#js-upImg .sig-iub_img-name').html(url.replace(/^.*\/|\.[^.]*$/g, ''));
	};

	this.exportZip = function(){
		if( this.selImg.length == 0 ){
			openNotification('Выберите изображения');
			return false;
		}

		this.progressStart();

		var self = this;
		$.post('/projects/imgsearch/search', {'method':'export','params':{'imgs':this.selImg}}, function (result) {
			self.progressStop();
			var data = $.parseJSON(result);
			if( typeof data.success != 'undefined' ){
				if( data.success ){
					openNotification(data.msg);
					document.location.href = data.path + '?' + data.zip;
				}else{
					openNotification(data.msg);
				}
			}
		});
	};

	this.editor = function(){
		if( this.selImg.length == 0 ){
			openNotification('Выберите изображения');
			return false;
		}

		//console.log(this.grp_id);
		//console.log(this.prj_id);

		this.progressStart();
		var self = this;
		$.post('/projects/imgsearch/search', {'method':'setedit','params':{'imgs':this.selImg,'grp_id':this.grp_id,'prj_id':this.prj_id}}, function (result) {
			self.progressStop();
			var data = $.parseJSON(result);
			if( typeof data.success != 'undefined' ){
				if( data.success ){
					openNotification(data.msg);
					setTimeout(function(){
						document.location.href = data.redirect + (self.change ? '/t/1' : '' );
					}, 3000);
				}else{
					openNotification(data.msg);
				}
			}
		});
	};

	this.clearSearch = function(e){
		if( typeof e == 'undefined' ){
			$('#js-upImg').addClass('__na');
		}else{
			$(e).parent().addClass('__na');
		}
		this.params['search'] = '';
		this.params['type'] = 1;
		this.searchType = 1;
		$("#ghsearch").val('');
		this.clearResult();

		$.post('/projects/imgsearch/search', {'method': 'reset','params':{'elem':'img'}},function(result){});
	};

	this.clearResult = function(){
		$('#js-resultBlock').hide();
		$('#js-searchInfo').show();
	};

	this.validateSize = function(size){
		size = parseFloat(size);

		console.log( size );

		if( size > 5 )
			return size;
		else
			return 5;
	};

	/* ADD SELECTED TO PROJECT */
	this.addToProject = function(){
		if( this.selImg.length == 0 ){
			openNotification('Выберите изображения');
			return false;
		}

		if( this.grp_id === false ){
			openNotification('Выберите проект');
			return false;
		}

		openPreloader();
		var postData = {
			'method':'imgsave',
			'params':{
				'proj_id':this.grp_id,
				'images':this.selImg,
				'coordinates':this.coordinates,
				'editAll':this.editAllImg,
				'cropParams':this.cropParams,
				'cropSize':this.cropSize,
				'setSizeResult':this.setSizeResult,
				'ads_id': this.ads_id,
				'type': 'search',
			}
		};

		var self = this;
		$.post('/projects/imgsearch/search', postData, function (result) {
			closePreloader();
			var answer = $.parseJSON(result);
			if( typeof answer !== null && typeof answer.success != 'undefined' ){
				if( answer.success ){
					openNotification(answer.msg);
					$('.search-in-google .close-btn').click();
					setTimeout(function(){
						var link = "/projects/show/"+self.grp_id+(self.prj_id !== false ? "?list_id="+self.prj_id : '');
						document.location.href = link;
					}, 2000);
				}else{
					openNotification(answer.msg);
				}
			}
		});
	};

	this.getProjectUser = function(e) {

		var $lay = $('#lay');

	    if( $lay.hasClass('show') ){	        
	        $lay.removeClass('show');
	        return false;
	    }else{
	        $lay.removeClass('show');
	    }
		var yourClick = true;

		$(document).bind('click.myEvent', function(e) {
			if (!yourClick && $(e.target).closest('#lay').length == 0) {
				
				$lay.hide();
				$lay.removeClass('show');
				$(document).unbind('click.myEvent');
			}
			yourClick = false;
		});

		$.post('/projects/show/projectlist', {'get':'project_list'}, function (result) {
			$lay.html(result);
			$lay.toggleClass('show');
	        $('.scroll-pane').jScrollPane();
		});


	};

	this.searchProj = function(){
	    //var search = $(".im_search").val();

	    if (search == '') return false;

	    $.post('/projects/show/searchproj', {"search":"proj","name":search}, function (result) {
			$("#lay").html(result);
	        $("#lay").css("display", "block");
		});
	};

	this.selectProject = function(id, name){
		this.grp_id = id;
		this.change = true;
		var projName = ( typeof name == 'undefined' ? $('#proj_'+id).data('name') : name );		
		$('#js-addProj').html('Проект: ').append('<a href="/projects/show/'+id+'">'+ projName + '</a>');
		$('#lay').removeClass('show');
	};
};

function checkTnAccExist(name){
    var tn_id = $('#ProjectGroups_tnet_id').val();
    
    $.ajax({
        url: '/projects/show/checkacc',
        data: {'tn_id':tn_id},
        type: 'post',
        dataType: 'json',
        success: function(result){
            if( typeof result.status != 'undefined' && result.status === true ){
                function onSuccess(result) {
                    openNotification("Проект успешно создан.");
                    if (result.status == 'success') {
                        $('#sel_proj').val(result.gid);
                        __app.projects[result.gid] = name;
                        $("#lay").removeClass('show');
                        $(".add-proj-name").html(name);
                        $(".add-proj-name").attr("href", "/projects/show/" + result.gid);
                    }
                }

                $.ajax({
                    url: '/projects/actions/createpp',
                    type: 'POST',
                    //data: { "pg_name": pg_name, "pg_tnet": pg_tnet },
                    data: $("form#createProj").serialize(),
                    dataType: 'json',
                    success: onSuccess,
                    cache: false
                });
            }else{
                $("#prpopup #tnName").html( $("#ProjectGroups_tnet_id option:selected").html() );
                $("#prpopup").show();
            }
        }
    });
}