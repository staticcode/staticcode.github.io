var __app = new Array();

Editor = function(){
	this.params = {};

	this.CoordsSel;
	this.selImg = new Array();
	this.coordinates;
	this.editAllImg = false;
	this.cropParams = {};
	this.resizeParams = 100;
	this.setSize = false;
	this.setSizeRange = {};
	this.aRatio = 0;
	this.setSizeResult;
	this.cropSize = {
		'w':200,
		'h':200,
	};
	this.lastSelect = {};
	
	this.grp_id = false;
	this.prj_id = false;
	this.ads_id = {};

	/* INIT EVENTS */
	this.init = function(){
		var self = this;
		$('.item-tx, [data-toggle=dropdown]').click(function() {
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});

		$('.search-in-google__step__cnt').click(function (e) {
		  	if ($('.filter-item').has(e.target).length === 0){			    			
				$('.item-tx').parent().removeClass('open');			
				$('.search-in-google__filter__params .btn-group.open').removeClass('open');
		  	}
		});

		$(document).click(function (e) {
		  if ($('.filter-item').has(e.target).length === 0){			    			
			$('.item-tx, [data-toggle=dropdown]').parent().removeClass('open');
			$('.search-in-google__filter__params .btn-group.open').removeClass('open');
		  }
		});

	    /*$('.sig-tabs1 li:not(.__na)').click(function () {
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
        });*/
	};

	/* START PROGRESS SEARCH */
	this.progressStart = function(){
		openPreloader();
	};

	/* STOP PROGRESS SEARCH */
	this.progressStop = function(){
		closePreloader();
	};

	this.setCurrentEdit = function(hash){
		var self = this;
		$('#resultStep .sig-img-item .preview').each(function(){
			var id = $(this).data('id');

			if( id == hash ){
				self.editImg(this, true);
				return false;
			}
		});
	};

	/* INIT SELECT PLACE */
	this.initSelectPlace = function(){
        this.CoordsSel = function(){};
        this.CoordsSel.prototype = new $.Jcrop.component.Selection;
        var self = this;

        $.extend(this.CoordsSel.prototype,{
          	attach: function(){
	            this.coords = $('<div> x </div>').addClass('jcrop-coords');

          		/*if( self.setSize ){
          			this.element.prepend('');
          		}else{*/
	            	this.element.prepend(this.coords);
          		//}
          	},
          	redraw: function(b){
	            $.Jcrop.component.Selection.prototype.redraw.call(this,b);

          		if( self.setSize ){
          			this.coords.html(self.setSizeRange.w+' &times '+self.setSizeRange.h);
          			return false;
          			//this.coords.html('');
          		}else{
          			var w = Math.round(this.last.w * 100 / self.resizeParams);
          			var h = Math.round(this.last.h * 100 / self.resizeParams);
	            	this.coords.html(w+' &times '+h);
          		}

		        return this;
          	}
        });
	};

	/* EDIT IMG INIT */
	this.editImgInit = function(){
		this.initSelectPlace();
		var self = this;
		var imgCrop = $('#editImg img');
		var url = imgCrop.attr('src');

		this.cropSize = {
			'w':imgCrop.data('w'),
			'h':imgCrop.data('h')
		};

		imgCrop.Jcrop({
          	selectionComponent: self.CoordsSel,
          	bgColor: '#fff',
          	onSelect: function(coords){self.setCoordinat(imgCrop, coords, url);},
            onChange: function(coords){self.setCoordinat(imgCrop, coords, url);},
        },function(){
        	self.imageCrop = this;

        	self.imageCrop.setOptions({ aspectRatio: self.aRatio });

          	this.container.addClass('jcrop-hl-active');
          	self.interfaceLoad(this, url);
        });
	};

	/* INTERFACE LOAD */
	this.interfaceLoad = function(obj, url){
		cb = obj;
		var lastSel = false;
		if( typeof this.lastSelect[url] != 'undefined' ){
			lastSel = true;
		}

		var mw = $('#editImg .jcrop-active.jcrop-hl-active').width();
		var mh = $('#editImg .jcrop-active.jcrop-hl-active').height();
		
		if( this.aRatio != 0 && !lastSel ){
			var nwc = mw / this.cropSize['w'];
			var nhc = mh / this.cropSize['h'];
			var ncoef = ( nwc > nhc ? nhc : nwc );

			var setW = ncoef * this.cropSize['w'];
			var setH = ncoef * this.cropSize['h'];

		}else if( !lastSel ){
			var setW = this.cropSize['w'];
			var setH = this.cropSize['h'];
		}

		if( !lastSel ){
			var offsetW = ( ( mw / 2 ) - ( setW / 2 ) );
			var offsetH = ( ( mh / 2 ) - ( setH / 2 ) );
		}else{
			var offsetW = this.lastSelect[url].x;
			var offsetH = this.lastSelect[url].y;
			var setW = this.lastSelect[url].w;
        	var setH = this.lastSelect[url].h;
		}

		var self = this;
        cb.newSelection().update($.Jcrop.wrapFromXywh([
        	offsetW,
        	offsetH,
        	setW,
        	setH
        ])).refresh();
        cb.ui.selection.refresh();
	};

	/* SER RESIZE COEFFICIENT */
	this.setResizeCoef = function(e){
		var jw = $('#editImg .jcrop-active.jcrop-hl-active').width();
		var w = $(e).data('w');
		var url = $($('.sig-img-item.__ac img')[0]).attr('src');

		this.resizeParams = ( ( jw * 100 ) / w );
	};

	/* SET COORDINATES */
	this.setCoordinat = function(icrop, coords, url){
		this.setResizeCoef(icrop);
		//this.lastSelect[url] = coords;

		this.coordinates = coords;
		var self = this;

		if( this.setSize ){
			setTimeout(function(){
				self.cropSize = {
					'w': Math.round(coords.w * 100 / self.resizeParams),
					'h': Math.round(coords.h * 100 / self.resizeParams)
				};
			}, 400);
		}

		if( this.editAllImg ){
			$('#resultStep img').each(function(){
				self.previewImg(this, coords, url);
			});
		}else{
			var img = $('.sig-img-item.__ac img')[0];

			/*var activeCheck = $(img).closest('.sig-img-item').find('input').prop('checked');

			if( activeCheck && typeof this.selImg != 'undefined' && this.selImg.length > 0 ){
				$('#resultStep img').each(function(){
					var did = $(this).data('id');
					if( self.selImg.indexOf(did) != -1 )
						self.previewImg(this, coords, url);
				});
			}else{*/
				this.previewImg(img, coords, url);
			//}
		}
	};

	/* PREVIEW IMG */
	this.previewImg = function(e, c, url){
		var original = $(e);
		var ihash = original.data('id');

		if( typeof this.cropParams[ihash] == 'undefined' )
			this.cropParams[ihash] = {};

		this.lastSelect[url] = {
			'x':c.x,
			'y':c.y,
			'w':c.w,
			'h':c.h,
		};

		/* Преобразование к полному размеру если у нас было сжатие */
		this.cropParams[ihash]['coords'] = {
			'x': (c.x * 100 / this.resizeParams),
			'y': (c.y * 100 / this.resizeParams),
			'x2': (c.x2 * 100 / this.resizeParams),
			'y2': (c.y * 100 / this.resizeParams),
			'w': (c.w * 100 / this.resizeParams),
			'h': (c.h * 100 / this.resizeParams)
		};

		this.coordinates = this.cropParams[ihash]['coords'];

		if( this.setSize )
			$('#size_' + ihash).html(Math.round(this.setSizeRange.w) + ' x ' + Math.round(this.setSizeRange.h));
		else
			$('#size_' + ihash).html(Math.round(this.coordinates.w) + ' x ' + Math.round(this.coordinates.h));

		/* selector preview */
		var preview = $(original.parent().find(".preview"));

		/* Если не открыт блок preview то открываем */
        if( preview.css('display') == 'none' ){
        	original.hide();
        	preview.show();
        }

        /* размеры оригинального изображения */
        var orW = original.data('w');
        var orH = original.data('h');

        /* коеффициент для определения ширины и высоты preview для сохранения пропорций */
		var pwc = ( this.cropParams[ihash]['coords']['w'] / 180 );
		var phc = ( this.cropParams[ihash]['coords']['h'] / 143 );
		var pvcf = ( pwc > phc ? pwc : phc );

		/* определение высоты и ширины preview в зависимости от коэффиц. */
		var pW = this.cropParams[ihash]['coords']['w'] / pvcf;
		var pH = this.cropParams[ihash]['coords']['h'] / pvcf;

		/* установка новых значений ширины и высоты */
		preview.height(pH);
        preview.width(pW);

        /* определение превышает или нет выбранная ширина/высота ширину/высоту оригинального изображения */
        if( orW < this.cropParams[ihash]['coords']['w'] || orH < this.cropParams[ihash]['coords']['h'] ){
	        var cCoefW = ( this.cropParams[ihash]['coords']['w'] / orW );
	        var cCoefH = ( this.cropParams[ihash]['coords']['h'] / orH );
	        var cCoef = ( cCoefW > cCoefH ? cCoefW : cCoefH );

	        var coordW = ( this.cropParams[ihash]['coords']['w'] / cCoef );
	        var coordH = ( this.cropParams[ihash]['coords']['h'] / cCoef );
        }else{
        	var coordW = this.cropParams[ihash]['coords']['w'];
	        var coordH = this.cropParams[ihash]['coords']['h'];
        }

        /* получаем коэффициент сжатия */
		var rW = pW / coordW;
        var rH = pH / coordH;

        /* установка выбранного размера preview */
		preview.css("background-size", (orW*rW) + "px" + " " + (orH*rH) + "px");

		/* определение превышает или нет конечная точка x координат и максимальная w изображения */
		if( this.cropParams[ihash]['coords']['x'] + coordW  > orW ){
			if( orW - this.cropParams[ihash]['coords']['w'] > 0 )
				var posX = orW - this.cropParams[ihash]['coords']['w'];	
			else
				var posX = 0;	
		}else
			var posX = this.cropParams[ihash]['coords']['x'];

		/* определение превышает или нет конечная точка y координат и максимальная h изображения */
		if( this.cropParams[ihash]['coords']['y'] + coordH > orH ){
			if( orH - this.cropParams[ihash]['coords']['h'] > 0 )
				var posY = orH - this.cropParams[ihash]['coords']['h'];
			else
				var posY = 0;
		}else
			var posY = this.cropParams[ihash]['coords']['y'];

		/* установка выбранной позиции preview */
		preview.css("background-position", rW * Math.round(posX) * -1 + "px" + " " + rH * Math.round(posY) * -1 + "px");

		return true;
	};

	/* EDIT IMG */
	this.editImg = function(e,div, event){
		if( typeof event != 'undefined' &&
			(event.target.className == 'jq-checkbox' ||
				event.target.className == 'sig-img-remove right' ||
				event.target.className == 'ion-close-round')
		)
			return false;

		/*if( typeof event != 'undefined' )
			console.log(event.target);*/

		if(div)
			var $el = $(e).parent().find('img');
		else
			var $el = $(e);
		
		var curUrl = $el.attr('src');
		/*var lastUrl = $('#resultStep .__ac img').attr('src');

		if( typeof lastUrl == 'undefined' ){
			this.lastUrl = curUrl;
		}else if( this.lastUrl != curUrl ){
			this.lastUrl = lastUrl;
		}*/

		$('#resultStep .sig-img-item').removeClass('__ac');

		$el.closest('.sig-img-item').addClass('__ac');

		var imgUrl = curUrl
		var imgW = $el.data('w');
		var imgH = $el.data('h');

		var newImg = document.createElement('img');
		newImg.src = $el.attr('src');

		$(newImg).attr('data-w', imgW);
		$(newImg).attr('data-h', imgH);
		$(newImg).css('width', '100%');
		$('#editImg').html(newImg);
		this.editImgInit();
	};

	/* CHECK EDIT ALL IMG */
	this.checkEditAllImg = function(e){
		//$('#resultStep .sig-img-item .preview').hide();
		/*original.hide();
        preview.show();*/
		this.editAllImg = $(e).prop('checked');
	};

	/* SET CROP SIZE */
	this.setSizeCrop = function(e){
		if( event.target.className == 'ion-android-close' )
			return false;

		this.setSize = true;

		var $li = $(e);

		var list_id = $li.data('list');
		var $sublicheck = $li.find('li.checked');

		$li.closest('.filter-item').find('li').removeClass('checked');

		if(typeof list_id != 'undefined' && list_id != 1 ){
			if( list_id == 3 && $sublicheck.length == 0 )
				return false;

			if( list_id == 2 )
				$li.closest('li').addClass('checked');
			else
				$sublicheck.addClass('checked');
		}

		$li.addClass('checked');

		var $mnli = $li.closest('.filter-item');
		$mnli.removeClass('open');

		var w = $(e).data('w');
		var h = $(e).data('h');

		if( typeof w != 'undefined' && typeof h != 'undefined' ){
			if( typeof w == 'undefined' || w == -1 ){
				this.setSize = false;
			}else{
				this.setSizeRange = {
					'w':w,
					'h':h
				};
			}
			$mnli.find('div.item-tx').html($li.find('span').html());
			this.aRatio = ( w == -1 ? 0 : w / h );

			this.cropSize = {
				'w':( w == -1 || w == '' ? 200 : w ),
				'h':( h == -1 || h == '' ? 200 : h )
			};

			if( w > -1 )
				this.setSizeResult = this.cropSize;
			else
				this.setSizeResult = {};

			this.stopJcrop();
			this.editImgInit();
		}
	};

	/* STOP JCROP */
	this.stopJcrop = function(){
		if( this.imageCrop != 'undefined' )
	  		this.imageCrop.destroy();
	  	return (false);
	};

	/* CHECK SELECTED BY STEP */
	this.selected = function(m, e){
		var self = this;
		if( typeof m != 'undefined' ){
			if( m == 'add' ){
				$('#resultStep input:checked').each(function(){
					var url = $(this).data('id');
					if( self.selImg.indexOf( url ) == -1 )
						self.selImg.push(url);
				});
			}else if( m == 'del' ){
				this.selImg = new Array();
			}else if( m == 'been' && this.selImg.length > 0 ){
				$('#resultStep input').each(function(){
					var url = $(this).data('id');
					if( self.selImg.indexOf( url ) != -1 )
						$(this).prop('checked', true);
				});

				$('#resultStep input').trigger('refresh');
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

		$(".stepSelected").html(this.selImg.length);
	};

	/* SELECT */
	this.select = function(){
		$('#resultStep input').prop('checked', true).trigger('refresh');
		this.selected('add', undefined);
	};

	/* UNSELECT */
	this.unselect = function(){
		$('#resultStep input').prop('checked', false).trigger('refresh');
		this.selected('del', undefined);
	};

	/* REMOVE IMG */
	this.removeImg = function(e, b){
		var $parent = $(e).closest('.sig-img-item');
		var $inp = $parent.find('input');
		$inp.prop('checked', false);
		this.selected('one', $inp);
		$parent.remove();
		$('.stepAllRes').html( $('#resultStep input').length );
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

	/* SELECT CROP SIZE */
	this.selectSize = function(e,save){
		$(e).closest('.btn-group').removeClass('open');
		$('.size-filter li').removeClass('checked');

		var $from = $('#grsize_from');
		var $to = $(' #grsize_to');

		var w = $from.val();
		var h = $to.val();

		this.setSizeRange($from, 'from');
		this.setSizeRange($to, 'to');

		if(!save){
			var slct = w + ' x ' + h;

			$('.size-filter').siblings('.item-tx').html(slct);
			$(e).closest('.filter-item').removeClass('open');

			this.aRatio = ( w == -1 ? 0 : w / h );
			this.cropSize = {
				'w':w,
				'h':h
			};

			if( w > -1 )
				this.setSizeResult = this.cropSize;
			else
				this.setSizeResult = {};

			this.stopJcrop();
			this.editImgInit();
		}else{
			var self = this;
			this.params['editor'] = 1;
			$.post('/projects/imgsearch/search', {'method':'addsize','params':this.params}, function (result) {
				var answer = $.parseJSON(result);
				if( typeof answer.success != 'undefined' ){
					if( answer.success ){
						if( typeof answer.block != 'undefined' )
							$(".size-img-params").before(answer.block);
						$('.size-filter li>span').each(function(){
							if( $(this).data('id') == answer.check ){
								self.setSizeCrop($(this).parent())
								//self.setListFilter($(this).parent(), 'gsize');
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

	this.exportZip = function(){
		if( this.selImg.length == 0 ){
			openNotification('Выберите изображения');
			return false;
		}

		var postData = {
			'method':'exportEditor',
			'params':{
				'imgs':this.selImg,
				'coordinates':this.coordinates,
				'editAll':this.editAllImg,
				'cropParams':this.cropParams,
				'cropSize':this.cropSize,
				'setSizeResult':this.setSizeResult,
			}
		};

		this.progressStart();

		var self = this;
		$.post('/projects/imgsearch/search', postData, function (result) {
			self.progressStop();
			var data = $.parseJSON(result);

			//console.log(data);

			if( typeof data.success != 'undefined' ){
				if( data.success ){
					document.location.href = data.path + '?' + data.zip;
				}else{
					openNotification(data.msg);
				}
			}
		});
	};

	this.uploadImage = function(more){
		var formData = new FormData($("#upSearchImg")[0]);

		this.params['multiple'] = 1;
		if(more)
			this.params['more'] = 1;
		formData.append("params", JSON.stringify(this.params));
		formData.append("method", 'upimg');

		//console.log(formData.get('method'));

		this.progressStart();

		var self = this;
		$.ajax({
			url: '/projects/imgsearch/search',
			type: 'POST',
			data: formData,
			datatype: 'json',
			success: function(result) {
				self.progressStop();				
				if (more) {
					$('#resultStep').append(result);
				} else {
					var data = $.parseJSON(result);
					if (typeof data.success != 'undefined') {
						if (data.success) {
							document.location.href = "/projects/editor/image/type/2";
						} else {
							openNotification(data.msg);
						}
					}
				}
			},
			cache: false,
			contentType: false,
			processData: false
		}).done(function() {
			$('[type=checkbox]').styler();
		});

	    return false;
	};

	this.validateSize = function(size){
		size = parseFloat(size);

		// console.log( size );

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
				'type': 'edit',
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