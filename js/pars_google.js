PG = function(){
	this.selImg = {};
	this.params = {};
	// this.curProgres;
	// this.timeout;
	this.project;
	this.stepStatus = {};
	// this.CoordsSel;
	this.coordinates;
	this.editAllImg = false;
	this.cropParams = {};
	// this.imageCrop;
	this.resizeParams = 100;
	this.setSize = false;
	this.aRatio = 0;
	this.searchType = 1;
	this.setSizeResult;
	this.cropSize = {
		'w':200,
		'h':200,
	};

	/* SET PROJECT ID */
	this.setProjectId = function(id){
		this.project = id;
	};

	/* SET SEARCH */
	this.setSearch = function(e){
		this.params['search'] = $(e).val();
	};

	/* SET SAFE MODE */
	this.setSafeMode = function(mode){
		this.params['safe'] = mode;
	};

	/* START PROGRESS SEARCH */
	this.progressStart = function(pld){
		if( typeof pld == 'undefined' || !pld ){
			this.curProgres = 10;
			$('.search-in-google .progress-bar').css('width', this.curProgres + '%');
			$('.search-in-google .progress').show();

			var self = this;
			this.timeout = setInterval(function(){
				self.curProgres = self.curProgres + 10;

				$('.search-in-google .progress-bar').css('width', self.curProgres + '%');

				if( self.curProgres == 100 ){
					clearInterval(self.timeout);
				}
			}, 500);
		}else
			openPreloader();
	};

	/* STOP PROGRESS SEARCH */
	this.progressStop = function(pld){
		if( typeof pld == 'undefined' || !pld ){
			clearInterval(this.timeout);
			$('.search-in-google .progress-bar').css('width', '100%');

			setTimeout(function(){
				$('.search-in-google .progress').hide();
			},1000);
		}else
			closePreloader();
	};

	/* SET HEIGHT BLOCK */
	this.setHtmlHeight = function(){
		var windowHeight = $(window).height();
		var sigHeight = $('.search-in-google__w').height()+500;

		if(windowHeight < sigHeight){
			$('html').css({
			'height': sigHeight});
		}else{
			$('html').removeAttr('style');
		}
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
	};

	/* INIT EVENTS */
	this.init = function(){
		var self = this;
		$('.search-in-google select').styler();

		$('.open__search-in-google').click(function(){
			$('.search-in-google').fadeIn('fast');
			self.setHtmlHeight();
		});
		
		$('.search-in-google__ovr, .close-btn').click(function() {        
			$('.search-in-google').fadeOut('fast');
			$('html').removeAttr('style');
		});

		$('.item-tx, [data-toggle=dropdown]').click(function() {
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});

		$('.search-in-google').click(function (e) {
		  if ($('.filter-item').has(e.target).length === 0){			    			
			$('.item-tx').parent().removeClass('open');			
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

		this.initSteps(1);
	};

	/* INIT STEPS */
	this.initSteps = function(id){
		var self = this;

		$('#step'+id+' > div.search-in-google__step__h').click(function() {
			self.openCloseStep(id);
		});
	};

	/* OPEN/CLOSE STEP */
	this.openCloseStep = function(sid){
		var e = $("#step"+sid+" .search-in-google__step__h");
		e.toggleClass('active');
		e.next().slideToggle();
		var self = this;
		setTimeout(function(){
			self.setHtmlHeight();
		},400);
	};

	/* CHECK INIT STEP */
	this.checkInitStep = function(sid, prev){
		if( typeof this.stepStatus[sid] == 'undefined' || !this.stepStatus[sid] ){
			this.stepStatus[sid] = true;
			this.initSteps(sid);
			this.openCloseStep(prev);
			this.openCloseStep(sid);
			return false;
		}else{
			return true;
		}
	};

	/* ENTER EVENT */
	this.enter = function(event, callback){
		if(event.keyCode == 13){
			if( typeof callback != 'undefined' ){
				this.setSearch($('#ghsearch'));
				callback();
			}else{
				this.setSearch($('#gsearch'));
		    	this.goSeacrh();
			}
		}
	};

	/* SEARCH IMG BY WORDS */
	this.goSeacrh = function(op){
		this.searchType = 1;
		this.setSearch($('#gsearch'));
		if( typeof this.params['search'] == 'undefined' || this.params['search'] == '' ){
			openNotification('Введите ключевое слово');
			return false;
		}

		this.progressStart(op);
		this.params['page'] = 0;
		var self = this;
		this.selImg['step2'] = new Array();

		$('#moreRes').attr('onclick', 'pgoogle.moreResult();');

		$.post('/projects/show/gapi', {'method': 'find','params': this.params},function(result){
			self.progressStop(op);
			self.setResult(result);
			setTimeout(function () {
				self.setHtmlHeight();
			},500);
		});
	};

	/* SET SEARCH RESULT */
	this.setResult = function(result, append){
		if( result != '' ){
			if( this.checkInitStep(2,1) && $('#step2 .search-in-google__step__cnt').css('display') == 'none' ){
				this.openCloseStep(1);
				this.openCloseStep(2);
			}

			if( typeof append != 'undefined' && append === true )
				$('#searchResult').append(result);
			else
				$('#searchResult').html(result);
		}

		this.selected('been');
	};

	/* GET MORE RESULT BY REQUEST */
	this.moreResult = function(){
		this.params['page'] = ( typeof this.params['page'] != 'undefined' ? ( this.params['page'] + 1 ) : 1 );
		this.progressStart(true);
		var self = this;
		$.post('/projects/show/gapi', {'method':'moreres','params':this.params}, function (result) {
			self.setResult(result, true);
			self.progressStop(true);
			self.setHtmlHeight();
		});
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

		this.params['grsize'][bid] = size;
		$(e).val(size);
		this.params['gsize'] = -1;
		$('.size-filter li').removeClass('checked');
	};

	/* SET LIMIT */
	this.setLimit = function(e){
		var $elem = $(e);
		this.params['lim'] = $elem.html();
		this.params['page'] = 1;
		$elem.closest('.result-on-page').find('span').removeClass('active');
		$elem.addClass('active');

		if( this.searchType == 1 )
			this.goSeacrh(true);
		else
			this.searchByImg(this.searchType);
			
	};

	/* RESET ALL FILTER STEP 1 */
	this.resetAll = function(){
		this.params = {};

		$(".search-in-google div.item-tx").each(function(){
			$(this).html($(this).data('default')).removeClass('__ac');
		});

		$("#gsearch").val('');
		$('.result-on-page span').removeClass('active');
		$('.result-on-page span.glim_12').addClass('active');
		$('#radios-1').prop('checked', true);
		$(".search-in-google__filter__params li").removeClass('checked');
		$('#searchResult .r.sig-s-bottom').remove();
		$('#grsize_from').val('');
		$('#grsize_to').val('');
		this.clearSearch();
		$.post('/projects/show/gapi', {'method':'resetall','params':{'proj_id': this.project}}, function (result) {});
	};

	/* DELETE SIZE */
	this.delSize = function(e){
		var size_id = $(e).parent().find('span').data('id');
		$.post('/projects/show/gapi', {'method':'delsize','params':{'size_id':size_id}}, function (result) {
			var data = $.parseJSON(result);
			if( typeof data.success != 'undefined' && data.success ){
				$(e).parent().remove();
			}
		});
	};

	/* CHECK SELECTED BY STEP */
	this.selected = function(m, e, b){
		if( typeof this.selImg[b] == 'undefined' )
			this.selImg[b] = new Array();

		var self = this;
		if( typeof m != 'undefined' ){
			if( m == 'add' ){
				$('#'+b+' .iStepResult input:checked').each(function(){
					var url = $(this).data('id');
					if( self.selImg[b].indexOf( url ) == -1 )
						self.selImg[b].push(url);
				});
			}else if( m == 'del' ){
				this.selImg[b] = new Array();
			}else if( m == 'been' && this.selImg[b].length > 0 ){
				$('#'+b+' .iStepResult input').each(function(){
					var url = $(this).data('id');
					if( self.selImg[b].indexOf( url ) != -1 )
						$(this).prop('checked', true);
				});

				$('#'+b+' .iStepResult input').trigger('refresh');
			}else if( m == 'one' ){
				var url = $(e).data('id');
				var pos = this.selImg[b].indexOf( url );
				if($(e).prop('checked')){
					if( pos == -1 )
						this.selImg[b].push(url);
				}else{
					if( pos != -1 )
						this.selImg[b].splice(pos, 1);
				}
			}
		}

		$("#"+b+" .stepSelected").html(this.selImg[b].length);
	};

	/* SELECT */
	this.select = function(b){
		$('#'+b+' .iStepResult input').prop('checked', true).trigger('refresh');
		this.selected('add', undefined, b);
	};

	/* UNSELECT */
	this.unselect = function(b){
		$('#'+b+' .iStepResult input').prop('checked', false).trigger('refresh');
		this.selected('del', undefined, b);
	};

	/* SELECT BY IMG */
	this.selectByImg = function(e, b){
		var $inpt = $(e).siblings('.sig-img-b-p').find('input');
		$inpt.prop('checked', !$inpt.prop('checked')).trigger('refresh')

		this.selected('one', $inpt, b);
	};

	/* REMOVE IMG */
	this.removeImg = function(e, b){
		var $parent = $(e).closest('.sig-img-item');
		var $inp = $parent.find('input');
		$inp.prop('checked', false);
		this.selected('one', $inp, b);
		$parent.remove();
		$('#step3 .stepAllRes').html( $('#'+b+' .iStepResult input').length );
	};

	/* SELECT CROP SIZE */
	this.selectSize = function(e,save, step){
		$('#'+step+' .size-filter li').removeClass('checked');

		var $from = $('#'+step+' #grsize_from');
		var $to = $('#'+step+' #grsize_to');

		this.setSizeRange($from, 'from');
		this.setSizeRange($to, 'to');

		if( step == 'step3' ){
			this.setSize = true;
			this.cropSize = {
				'w':parseFloat($from.val()),
				'h':parseFloat($to.val())
			};
			this.stopJcrop();
			this.editImgInit();
		}

		if(!save){
			var slct = $from.val() + ' x ' + $to.val();

			$('#'+step+' .size-filter').siblings('.item-tx').html(slct);
			$(e).closest('.filter-item').removeClass('open');

		}else{
			var self = this;
			$.post('/projects/show/gapi', {'method':'addsize','params':this.params}, function (result) {
				var answer = $.parseJSON(result);
				if( typeof answer.success != 'undefined' ){
					if( answer.success ){
						if( typeof answer.block != 'undefined' )
							$('#'+step+" .size-img-params").before(answer.block);
						$('#'+step+' .size-filter li>span').each(function(){
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
		$.post('/projects/show/gapi', {'method':'loadimg','params':{'images':this.selImg['step2']}}, function (result) {
			closePreloader();
			if( result != '' ){
				self.checkInitStep(3,2);
				$('#resultStep3').append(result);
				setTimeout(function () {
					self.setHtmlHeight();
				}, 500);
				self.editImg($('#resultStep3 img')[0], false);
			}else{
				openNotification('Не удалось получить изображения');
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

          		if( self.setSize ){
          			this.element.prepend('');
          		}else{
	            	this.element.prepend(this.coords);
          		}
          	},
          	redraw: function(b){
	            $.Jcrop.component.Selection.prototype.redraw.call(this,b);

          		if( self.setSize ){
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

		imgCrop.Jcrop({
          	selectionComponent: self.CoordsSel,
          	bgColor: '#fff',
          	onSelect: function(coords){self.setCoordinat(imgCrop, coords);},
            onChange: function(coords){self.setCoordinat(imgCrop, coords);},
        },function(){
        	self.imageCrop = this;

        	self.imageCrop.setOptions({ aspectRatio: self.aRatio });

          	this.container.addClass('jcrop-hl-active');
          	self.interfaceLoad(this);
        });
	};

	/* INTERFACE LOAD */
	this.interfaceLoad = function(obj){
		cb = obj;

		var mw = $('#editImg .jcrop-active.jcrop-hl-active').width();
		var mh = $('#editImg .jcrop-active.jcrop-hl-active').height();
		
		if( this.aRatio != 0 ){
			var nwc = mw / this.cropSize['w'];
			var nhc = mh / this.cropSize['h'];
			var ncoef = ( nwc > nhc ? nhc : nwc );

			var setW = ncoef * this.cropSize['w'];
			var setH = ncoef * this.cropSize['h'];

		}else{
			var setW = this.cropSize['w'];
			var setH = this.cropSize['h'];
		}

		var offsetW = ( ( mw / 2 ) - ( setW / 2 ) );
		var offsetH = ( ( mh / 2 ) - ( setH / 2 ) );

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
	this.setCoordinat = function(icrop, coords){
		this.setResizeCoef(icrop);

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
			$('#resultStep3 img').each(function(){
				self.previewImg(this, coords);
			});
		}else{
			var img = $('.sig-img-item.__ac img')[0];
			var activeCheck = $(img).closest('.sig-img-item').find('input').prop('checked');

			if( activeCheck && typeof this.selImg['step3'] != 'undefined' && this.selImg['step3'].length > 0 ){
				$('#resultStep3 img').each(function(){
					var url = $(this).attr('src');
					if( self.selImg['step3'].indexOf(url) != -1 )
						self.previewImg(this, coords);
				});
			}else{
				this.previewImg(img, coords);
			}
		}
	};

	/* PREVIEW IMG */
	this.previewImg = function(e, c){
		var original = $(e);
		var url = original.attr('src');

		if( typeof this.cropParams[url] == 'undefined' )
			this.cropParams[url] = {};

		/* Преобразование к полному размеру если у нас было сжатие */
		this.cropParams[url]['coords'] = {
			'x': (c.x * 100 / this.resizeParams),
			'y': (c.y * 100 / this.resizeParams),
			'x2': (c.x2 * 100 / this.resizeParams),
			'y2': (c.y * 100 / this.resizeParams),
			'w': (c.w * 100 / this.resizeParams),
			'h': (c.h * 100 / this.resizeParams)
		};

		this.coordinates = this.cropParams[url]['coords'];

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
		var pwc = ( this.cropParams[url]['coords']['w'] / 140 );
		var phc = ( this.cropParams[url]['coords']['h'] / 140 );
		var pvcf = ( pwc > phc ? pwc : phc );

		/* определение высоты и ширины preview в зависимости от коэффиц. */
		var pW = this.cropParams[url]['coords']['w'] / pvcf;
		var pH = this.cropParams[url]['coords']['h'] / pvcf;

		/* установка новых значений ширины и высоты */
		preview.height(pH);
        preview.width(pW);

        /* определение превышает или нет выбранная ширина/высота ширину/высоту оригинального изображения */
        if( orW < this.cropParams[url]['coords']['w'] || orH < this.cropParams[url]['coords']['h'] ){
	        var cCoefW = ( this.cropParams[url]['coords']['w'] / orW );
	        var cCoefH = ( this.cropParams[url]['coords']['h'] / orH );
	        var cCoef = ( cCoefW > cCoefH ? cCoefW : cCoefH );

	        var coordW = ( this.cropParams[url]['coords']['w'] / cCoef );
	        var coordH = ( this.cropParams[url]['coords']['h'] / cCoef );
        }else{
        	var coordW = this.cropParams[url]['coords']['w'];
	        var coordH = this.cropParams[url]['coords']['h'];
        }

        /* получаем коэффициент сжатия */
		var rW = pW / coordW;
        var rH = pH / coordH;

        /* установка выбранного размера preview */
		preview.css("background-size", (orW*rW) + "px" + " " + (orH*rH) + "px");

		/* определение превышает или нет конечная точка x координат и максимальная w изображения */
		if( this.cropParams[url]['coords']['x'] + coordW  > orW ){
			if( orW - this.cropParams[url]['coords']['w'] > 0 )
				var posX = orW - this.cropParams[url]['coords']['w'];	
			else
				var posX = 0;	
		}else
			var posX = this.cropParams[url]['coords']['x'];

		/* определение превышает или нет конечная точка y координат и максимальная h изображения */
		if( this.cropParams[url]['coords']['y'] + coordH > orH ){
			if( orH - this.cropParams[url]['coords']['h'] > 0 )
				var posY = orH - this.cropParams[url]['coords']['h'];
			else
				var posY = 0;
		}else
			var posY = this.cropParams[url]['coords']['y'];

		/* установка выбранной позиции preview */
		preview.css("background-position", rW * Math.round(posX) * -1 + "px" + " " + rH * Math.round(posY) * -1 + "px");

		return true;
	};

	/* EDIT IMG */
	this.editImg = function(e,div){
		$('#resultStep3 .sig-img-item').removeClass('__ac');

		if(div)
			var $el = $(e).parent().find('img');
		else
			var $el = $(e);

		$el.closest('.sig-img-item').addClass('__ac');

		var imgUrl = $el.attr('src');
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
		//$('#resultStep3 .sig-img-item .preview').hide();
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

		if( typeof w == 'undefined' || w == -1 ){
			this.setSize = false;
		}

		if( typeof w != 'undefined' && typeof h != 'undefined' ){
			$mnli.find('div.item-tx').html($li.html());
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
	  	this.imageCrop.destroy();
	  	return (false);
	};

	/* ADD SELECTED TO PROJECT */
	this.addToProject = function(){
		if( typeof this.selImg['step3'] == 'undefined' || this.selImg['step3'].length == 0 ){
			openNotification('Выберите изображения');
			return false;
		}

		openPreloader();
		var postData = {
			'method':'imgsave',
			'params':{
				'proj_id':this.project,
				'images':this.selImg['step3'],
				'coordinates':this.coordinates,
				'editAll':this.editAllImg,
				'cropParams':this.cropParams,
				'cropSize':this.cropSize,
				'setSizeResult':this.setSizeResult,
				'ads_id': ads_id
			}
		};

		$.post('/projects/show/gapi', postData, function (result) {
			closePreloader();
			var answer = $.parseJSON(result);
			if( typeof answer !== null && typeof answer.success != 'undefined' ){
				if( answer.success ){
					openNotification(answer.msg);
					$('.search-in-google .close-btn').click();
					setTimeout(function(){
						window.location.href = document.location.href;
					}, 2000);
				}else{
					openNotification(answer.msg);
				}
			}
		});
	};

	this.searchByImg = function(type){
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
		$upImg.find('img').attr('src', this.clearText(this.params['search']));
		$upImg.show();

		$.post('/projects/show/gapi', {'method': 'findbyurl','params': this.params},function(result){
			self.progressStop();
			self.setResult(result);
			setTimeout(function () {
				self.setHtmlHeight();
			},500);
		});
	};

	this.clearText = function(str){
		return str.replace(/<\/?[^>]+(>|$)/g, "");
	};

	/* GET MORE RESULT BY IMG URL REQUEST */
	this.moreResultImg = function(){
		this.params['searchType'] = this.searchType;
		this.params['page'] = ( typeof this.params['page'] != 'undefined' ? ( this.params['page'] + 1 ) : 1 );
		this.progressStart(true);
		var self = this;
		$.post('/projects/show/gapi', {'method':'findbyurlmore','params':this.params}, function (result) {
			self.setResult(result, true);
			self.progressStop(true);
			self.setHtmlHeight();
		});
	};

	this.openSearchByImg = function(){
		var search = $('#ghsearch').val();
		if( search != '' )
			this.params['search'] = search;
		$('.sig_sip').show();
	};

	this.closeUpImg = function(){
		$('#step1 .sig_sip').hide();
	};

	this.uploadImage = function(){
		this.searchType = 3;
		var self = this;
		var formData = new FormData($("#upSearchImg")[0]);
		formData.append("params", JSON.stringify(this.params));
		this.params['searchType'] = this.searchType;
		formData.append("method", 'upimg');

		this.progressStart();
		this.params['page'] = 0;
		this.selImg['step2'] = new Array();
		this.closeUpImg();

	    $.ajax({
	        url: '/projects/show/gapi',
	        type: 'POST',
	        data: formData,
	        datatype:'json',
	        success: function (data) {
	        	self.progressStop();
				self.setResult(data);

				var url = $('#upImgUrl').val();

				var $upImg = $('#js-upImg');
				$upImg.find('img').attr('src', url);
				$upImg.show();
				self.params['search'] = url;

				$('#moreRes').attr('onclick', 'pgoogle.moreResultImg();');

				setTimeout(function () {
					self.setHtmlHeight();
				},500);
	        },
	        cache: false,
	        contentType: false,
	        processData: false
	    });

	    return false;
	};

	this.clearSearch = function(e){
		if( typeof e == 'undefined' ){
			$('#js-upImg').hide();
		}else{
			$(e).parent().hide();
		}
		this.params['search'] = '';
		$("#ghsearch").val('');

		$.post('/projects/show/gapi', {'method': 'clearsimg'},function(result){});
	};

	this.validateSize = function(size){
		size = parseFloat(size);

		console.log( size );

		if( size > 5 )
			return size;
		else
			return 5;
	};
};