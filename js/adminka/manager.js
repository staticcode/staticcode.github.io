var Manage = function(){
	this.tab,
	this.manager_id,
	this.date,
	this.status,
	this.attach = false,
	this.saveComment = true,
	this.is_seller = false,
	this.my_data = true,
	this.view_type = 1,
	this.row_id;
	this.out_id,
	this.sorter,
	this.typeTask,
	this.catType;
	this.is_task = 0;
	this.is_boss = 0;
	this.user_id;

	this.delete = function(e,uid){
		if( !confirm('Вы действительно хотите удалить менеджера?') )
			return false;

		$.post( '/panel/managers/delete', {'uid':uid}, function (data) {
			var result = $.parseJSON(data);
			if( typeof result.success != 'undefined' && result.success ){
				$(e).closest('tr').remove();
			}else{
				alert('Не удалось удалить менеджера');
			}
	    });
	};

	this.checkUncheckAll = function (e) {
		var status = $(e).prop('checked');
		$(e).closest('table').find('tbody input[type=checkbox]').prop('checked', status);
	};

	this.selected = function(e, type){
		if( type == 1 ){
			var status = $(e).prop('checked');
			console.log($(e).closest('li').find('li input'));
			$(e).closest('li').find('li input').prop('checked', status);
			if(status)
				$(e).closest('li').find('li span').addClass('checked');
			else
				$(e).closest('li').find('li span').removeClass('checked');
		}else{
			if( $(e).prop('checked') ){
				$(e).closest('.js-mainBlock').find('.js-mainItem').prop('checked', true);
				$(e).closest('.js-mainBlock').find('.js-mainItem').closest('span').addClass('checked');
			}
		}
	};

	this.initTaskList = function(){
		var self = this;
		this.setFilter(true);
		this.tab = $( '#manTasks' ).dataTable({

	        "oLanguage": {
	            "sLengthMenu": "_MENU_ записей на странице",
	            "oPaginate": {
	                "sPrevious": "Prev",
	                "sNext": "Next"
	            },
	            "sSearch":"Поиск: ",
	        },
	        "aoColumns": [
	            {'mDataProp':'check'},
              	{'mDataProp':'priority'},
              	{'mDataProp':'created'},
	            {'mDataProp':'enddate'},
	            {'mDataProp':'category'},
	            {'mDataProp':'type'},
	            {'mDataProp':'task'},
	            {'mDataProp':'out'},
	            {'mDataProp':'comment'},
	            {'mDataProp':'status'},
	            {'mDataProp':'manager'},
	            {'mDataProp':'cstatus'},
	            {'mDataProp':'viewed'},
	            {"mDataProp":"id"}
	        ],
	        "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
	        "bServerSide": true,
	        "bProcessing": true,
	        "aaSorting": [],
	        "aoColumnDefs": [{
	            "bSortable": false,
	            "aTargets": [0, 7, 8]
	        },{
            	"bVisible" : false,
            	"aTargets": (self.is_seller ? [10,11,12,13] : [11,12,13])
        	}],
	        "sAjaxSource": "/panel/managers/showtask",
	        "fnServerParams": function (aoData) {
	            aoData.push(
	                {"name":"date","value":self.date},
	                {"name":"status","value":self.status},
	                {"name":"manager_id","value":self.manager_id},
	                {"name":"out_id","value":self.out_id},
	                {"name":"sorter","value":self.sorter},
	                {"name":"typeTask","value":self.typeTask},
	                {"name":"catType","value":self.catType},
	                {"name":"user_id","value":self.user_id}
	            );
	        },
	        "fnRowCallback":function( nRow, aData, status){
	        	/*if (aData.dedline == 1) {
	                $(nRow).find('td').css('background', '#FFA3A3').css('color', '#fff');
	        	}*/
	        	$(nRow).find('td').eq(9).css('background', aData.cstatus);
	        	if (aData.viewed == 0) {
	        		$(nRow).css('font-weight', 'bold');
	        		$(nRow).addClass('js-view_'+aData.id);
	        	}
	        },
	        "deferRender": true,
	        "bDestroy": true
	    });
	};

	this.setFilter = function(nonreload){
		if ($('.js-dateFrom').length > 0) {
			this.date = {
				'from': $('.js-dateFrom').val(),
				'to': $('.js-dateTo').val()
			};
		} else {
			this.date = {
				'from': $('#js-dedlineFrom').val(),
    			'to': $('#js-dedlineTo').val()
			};
		}

		this.my_data = $('input.js-whoData:checked').val();
		this.view_type = $('.js-viewSelect').val();
		this.status = $('.js-statusSelect').val();
		this.manager_id = $('.js-sellerSelect').val();
		this.out_id = $('.js-outSelect').val();
		this.sorter = $('.js-sorter:checked').val();
		this.catType = parseFloat($('.js-catType:checked').val());
		/*if (this.catType == 0) {
			this.typeTask = $('.js-typeTask').val();
		} else {*/
			this.typeTask = $('#triggerCatList_'+this.catType).val();
		//}

		if (!nonreload) {
			this.tab.fnReloadAjax();
			//this.loadConversion();
		}
	};

	/*this.getFilter = function () {

	};*/

	this.openCloseModal = function(e, status, attach){
		this.attach = attach;
		if( false !== e ) this.row_id = $(e).data('id');

		$('#myModal .js-saveBtn').show();

		if(status){
			$('#myModal').modal('show');
		}else{
			$('#myModal').modal('hide');
		}
	};

	this.saveModal = function(){
		var ids = this.getSelRow();
		if (ids.length == 0 && typeof this.row_id != 'undefined') {
			ids.push(this.row_id);
		}
		if (ids.length == 0) {
    		alert('Выберите задачи.');
    		return false;
    	}
    	if (confirm('Вы выполнили задачу?')) {
			var params = {
				'attach': ( this.attach ? 1 : 0 ),
				'body': $('#js-comment').val(),
				'task_id': ids
			};
			var self = this;
			$.post( '/panel/managers/savedialog', params, function (data) {
				var result = $.parseJSON(data);
				if( typeof result.success != 'undefined' && result.success ){
					$('#js-comment').val('');
					self.openCloseModal(false,false,self.attach);
					self.tab.fnReloadAjax();
				}else{
					alert('Не удалось сохранить');
				}
		    });
    	}
	};

	this.showComment = function(id){
		console.log('asdasda');
		var self = this;
		$.post( '/panel/managers/getcomment', {'id':id}, function (data) {
			var result = $.parseJSON(data);
			if( typeof result.success != 'undefined' && result.success ){
				$('#js-comment').val(result.body);
				$('#myModal .js-saveBtn').hide();
				$('#myModal').modal('show');
			}else{
				alert('Не удалось найти комментарий');
			}
	    });
	};

	this.saveGoals = function(){
		var data = {};
		var error = false;
		$('.js-goalSaver').each(function(){
			var id = $(this).data('id');
			data[id] = {};
			$(this).find('.js-editable-field').each(function() {
	            var name = $(this).data('name');
	            var val = $(this).find('input').val();
	            if(val == '' || val == 0){
	            	$(this).addClass('js-error');
	            	error = true;
	            }else{
	            	$(this).removeClass('js-error');
	            }
	            data[id][name] = val;
	        })
		});

		if(error) return false;

		$.post( '/panel/managers/savegoal', {'data':data}, function (data) {
			var result = $.parseJSON(data);
			if( typeof result.success != 'undefined' && result.success ){
				for(i in result.goal){
					$('.js-'+i).html(result.goal[i]);
				}
			}else{
				alert('Не удалось найти комментарий');
			}
	    });

	    return true;
	};

	this.showDetailPlan = function(id){
		$.post( '/panel/managers/loaddplan', {'id':id}, function (data) {
			var result = $.parseJSON(data);
			if( typeof result.success != 'undefined' && result.success ){
				$('#myModal .modal-body').html(result.tpl);
				$('#myModal #myModalLabel').html(result.title);
				$('#myModal').modal('show');
			}else{
				alert('Не удалось загрузить данные');
			}
	    });
	};

	this.initManResTab = function(){
		var self = this;
		this.setFilter(true);
		this.tab = $('#manSaleResults').dataTable({
            "scrollX": true,
	        "oLanguage": {
	            "sLengthMenu": "_MENU_ записей на странице",
	            "oPaginate": {
	                "sPrevious": "Prev",
	                "sNext": "Next"
	            },
	            "sSearch":"Поиск: ",
	        },
	        "aoColumns": [
	        	{'mDataProp':'date'},
				{'mDataProp':'manager'},
				{'mDataProp':'register_cnt'},
				{'mDataProp':'register_contact'},
				{'mDataProp':'register_perc'},
				{'mDataProp':'contact_plan'},
				{'mDataProp':'contact_fact'},
				{'mDataProp':'contact_perc'},
				{'mDataProp':'pay_cnt_plan'},
				{'mDataProp':'pay_cnt_fact'},
				{'mDataProp':'pay_cnt_perc'},
				{'mDataProp':'pay_sum_plan'},
				{'mDataProp':'pay_sum_fact'},
				{'mDataProp':'pay_sum_perc'},
				{'mDataProp':'cool'},
				{'mDataProp':'warm'},
				{'mDataProp':'hot'},
				{'mDataProp':'bonus'},
				{'mDataProp':'avg_check'},
				{'mDataProp':'af_trial'},
				{'mDataProp':'dis_sum'}
	        ],
	        "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
	        "bFilter": false,
	        "bServerSide": true,
	        "bProcessing": true,
	        "aaSorting": [[ 0, "desc" ]],
	        "aoColumnDefs": [{
	            "bSortable": false,
	            "aTargets": [1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
	        },{
	            /*"sWidth": "15%",
	            "aTargets": [ 2, 3, 4, 5 ]*/
	        },{
            	"bVisible" : false,
            	"aTargets": [2,3,4,20]
        	}],
	        "sAjaxSource": "/panel/managers/showsaleresult",
	        "fnServerParams": function (aoData) {
	            aoData.push(
	                {"name":"date","value":self.date},
	                {"name":"manager_id","value":self.manager_id},
	                {"name":"my_data","value":self.my_data},
	                {"name":"view_type","value":self.view_type}
	            );
	        },
	        "fnRowCallback":function( nRow, aData, status){
	        },
	        "deferRender": true,
	        "bDestroy": true
	    });
	};

	this.reset = function () {
		$('#view_by option:first').prop('selected', true);
		$('#sellerlist option:first').prop('selected', true);
		$('#from').val($('#from').data('defaultfrom'));
		$('#to').val($('#to').data('defaultto'));

		var self = this;
		$('input[name=colName]').each(function(){
			var $this = $(this);
			var status = $this.prop('checked');
			var dcheck = $this.data('dcheck');

			if ((status && dcheck == 0) ||
				!status && dcheck == 1) {
				$this.prop('checked', dcheck);
				self.changeView($this);
			}
		});
		$.uniform.update();

		this.setFilter();
	};

	this.aply = function () {
		this.setFilter();
	};

	this.changeView = function (e) {
		var status = $(e).prop('checked');
		var indexes = $(e).val();
		indexes = indexes.split(',');
		for (i in indexes) {
			console.log(indexes[i]);
			this.tab.fnSetColumnVis(indexes[i], status);
		}
	};

	this.toExcel = function(){
        if (!confirm('Скачать архив?')) {
            return false;
        }

        var params = new Array();
        if (typeof this.date['from'] != 'undefined') {
        	params.push('date[from]='+this.date['from']);
        }
        if (typeof this.date['to'] != 'undefined') {
        	params.push('date[to]='+this.date['to']);
        }
        if (typeof this.manager_id != 'undefined') {
        	params.push('manager_id='+this.manager_id);
        }
        if (typeof this.view_type != 'undefined') {
        	params.push('view_type='+this.view_type);
        }
        var colIds = new Array();
        $('input[name=colName]:not(:checked)').each(function(){
        	colIds.push($(this).val());
        });
        if (colIds.length > 0) {
        	params.push('noncol='+colIds.join(','));
        }
        //console.log(params);
        window.location.href = "/panel/managers/report?"+params.join('&');
	};

	this.reportToExcel = function () {
		var params = new Array();
        if (typeof this.date['from'] != 'undefined') {
        	params.push('date[from]='+this.date['from']);
        }
        if (typeof this.date['to'] != 'undefined') {
        	params.push('date[to]='+this.date['to']);
        }
        if (typeof this.manager_id != 'undefined') {
        	params.push('manager_id='+this.manager_id);
        }
        window.location.href = "/panel/managers/salesreport?"+params.join('&');
	}

	/*this.showHideColumn = function(){
		var self = this;
		$("#js-showHideColumn option").each(function(){
			self.tab.fnSetColumnVis( $(this).val(), $(this).prop('selected') );
		});
    };*/

    this.loadProgres = function(){
    	var cat_id = $('#js-selCat').find('input[name=category]:checked').val();
    	var type_id = $('#triggerCatList_'+cat_id).val();
    	if ($('.js-dateFrom').length == 0) {
    		this.date = {
    			'from': $('#js-dedlineFrom').val(),
    			'to': $('#js-dedlineTo').val()
    		};
    	}
    	var params = {
    		'date': this.date,
    		'manager_id': (this.manager_id ? this.manager_id : $('#js-managerId').val()),
    		'cat_id': cat_id,
    		'type_id': type_id,
    		'is_task':this.is_task
    	};
    	$.post('/panel/managers/progres', params, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				var barArr = ['taskBar','pay_cnt','pay_sum','pay_sum_com','bonus','bonus_com','convers_new','convers_old','convers_total','potentialSales'];
				for (i in barArr) {
					var f = barArr[i];
					var $b = $('.js-'+f);
					if ($b.length > 0 && typeof result[f] != 'undefined') {
						if (typeof result[f].fact != 'undefined') {
							var cur_bef = (typeof result[f].cur_bef != 'undefined' ? result[f].cur_bef : '');
							var cur_af = (typeof result[f].cur_af != 'undefined' ? result[f].cur_af : '');
							var plan = (false !== result[f].plan ? '/'+cur_bef+result[f].plan+cur_af : '');
							var title = cur_bef+result[f].fact+cur_af+plan;
							$b.find('input').val(result[f].perc+'%');
							$b.find('.number').html(title);
						} else {
							console.log(result[f]);
							$b.find('.number').html('$'+result[f]);
						}
					}
				}
			}
	    });
    };






















    this.changeCat = function () {
    	var catId = $('#js-selCat').find('input[name=category]:checked').val();
        $('.js-triggerHide').hide();
        $('#triggerCatList_'+catId).show();
    };


    this.setCanceled = function () {
    	if (confirm('Вы хотите отменить задачу?')) {
    		this.changeStatus(3);
    	}
    };

    this.setAside = function () {
    	if (confirm('Вы хотите отложить задачи?')) {
    		this.changeStatus(6, $('#perform-later').val());
    	}
    };

    this.setAsideOne = function (id) {
    	this.changeStatus(6, $('.js-asideOneTask').val(), id);
    };

    this.enterTask = function () {
    	if (confirm('Вы хотите приступить к выполнению задачи?')) {
    		this.changeStatus(5);
    	}
    };

    this.enterOneTask = function (id) {
    	if (confirm('Вы хотите приступить к выполнению задачи?')) {
    		$('#manTasks tbody input[type=checkbox]').each(function(){
	    		if (id == $(this).data('id')) {
	    			$(this).prop('checked', true).trigger('refresh');
	    		}
	    	});
    		this.changeStatus(5);
    	}
    };

    this.changeStatus = function (status, date, id) {
    	if (typeof id != 'undefined') {
    		var ids = new Array();
    		ids.push(id);
    	} else {
	    	var ids = this.getSelRow(true);
    	}
	    if (false === ids) {
	    	return false;
	    }
	    var comment = (status == 5) ? $('#comment').val() : '';
    	var self = this;
    	$.post( '/panel/managers/status', {'ids':ids,'status':status,'date':date,'comment':comment}, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				self.tab.fnReloadAjax();
				$('#addTask').modal('hide');
			}
    	});
    };

    this.getSelRow = function (check) {
    	var ids = new Array();
    	$('#manTasks tbody input[type=checkbox]:checked').each(function(){
    		ids.push($(this).data('id'));
    	});
    	if (check && ids.length == 0) {
	    	alert('Выберите задачи.');
	    	return false;
    	}
    	return ids;
    };

    this.loadTaskAll = function () {
    	this.setFilter();
    	this.loadProgres();
    };

    this.setComplete = function () {
    	var trgIds = new Array();
    	$('#manTasks tbody input[type=checkbox]:checked').each(function(){
    		var trgrId = $(this).data('trgr');
    		if (trgIds.indexOf(trgrId) == -1) {
    			trgIds.push(trgrId);
    		}
    	});
    	if (trgIds.length == 0) {
    		alert('Выберите задачи.');
    		return false;
    	}
    	if (trgIds.length > 1) {
    		alert('Для массового действия, выберите задачи одного типа');
    		return false;
    	}
    	var ids = this.getSelRow(true);
    	var self = this;
	    $.post( '/panel/managers/getTriggerOut', {'trgIds':trgIds,'ids':ids}, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined') {
				if (typeof result.body != 'undefined' && result.success) {
					$('#myModal .modal-body .js-checkOuter').html(result.body);
					$('.js-saveBtn').attr('onclick', 'manage.saveComplete();');
					$('#js-comment').css('display', (result.reqDia ? 'block' : 'none'));
					$('#js-comment').val('');
					if (result.reqDia) {
						$('#js-comment').attr('required', 'required');
					} else {
						$('#js-comment').removeAttr('required');
					}
					//console.log($('#js-comment').attr('required'));
					$('#myModal').modal('show');
				} else {
					self.tab.fnReloadAjax();
				}
			}
    	});
    };

    this.saveComplete = function (id) {
	    var outIds = new Array();
    	if (typeof id != 'undefined') {
    		var ids = new Array();
    		ids.push(id);
    		$('input.js-outItems:checked').each(function(){
	    		outIds.push($(this).val());
	    	});
    		var $comBlock = $('#comment');
    	} else {
    		var ids = this.getSelRow(true);
	    	$('input[name=out_task_complete]:checked').each(function(){
	    		outIds.push($(this).val());
	    	});
	    	var $comBlock = $('#js-comment');
    	}
    	var comment = $comBlock.val();
    	if ($comBlock.attr('required') == 'required' &&
    		comment == '') {
    		$('#js-saveTaskForm .dropdown-menu input[type=checkbox]').prop('checked', false);
    		$.uniform.update();
    		alert('Добавьте диалог');
    		return false;
    	}
    	//console.log(comment);
    	var self = this;
    	$.post('/panel/managers/saveComplete', {'ids':ids,'outIds':outIds,'comment':comment}, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				self.tab.fnReloadAjax();
			} else {
				alert('Не удалось сохранить данные.');
			}
			$('#myModal').modal('hide');
			$('#addTask').modal('hide');
    	});
    };

    this.changeManager = function (e) {
    	var mId = $(e).val();
    	if (mId == 0) {
    		return false;
    	}
    	var ids = this.getSelRow(true);
    	if (false === ids) return false;
    	var self = this;
    	$.post('/panel/managers/changeManager', {'mId':mId,'ids':ids}, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				self.tab.fnReloadAjax();
			} else {
				alert('Не удалось сохранить данные.');
			}
			$('#js-manager_id option:first').prop('selected', true);
    	});
    };

    this.editRow = function (id) {
    	$.post('/panel/managers/taskEdit/id/'+id, {}, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				$('.js-taskSetts').html(result.block);
				$('#addTask').modal('show').find('[type=checkbox]').uniform();
				if (result.viewed) {
    				$('.js-view_'+id).css('font-weight', 'inherit');
				}
			} else {
				alert('Не удалось загрузить карточку задачи.');
			}
    	});
    	//console.log(id);
    };

    this.editFields = function () {
    	var $editBtn = $('.js-editBtn');
    	if ($editBtn.is(':visible')) {
	    	$('#js-editDedline').removeAttr('disabled');
	    	$('#js-editManager').removeAttr('disabled');
	    	$('#js-editPriority').removeAttr('disabled');
	    	$('#target_audit').removeAttr('disabled');
	    	$('.js-saveFormBtn').show();
	    	$('.js-cancelFormBtn').show();
	    	$('.js-editBtn').hide();
	    	if (this.is_boss) {
	    		$('#js-editStatus').removeAttr('disabled');
	    	}
    	}
    };

    this.saveTask = function () {
    	var self = this;
    	var params = $('#js-saveTaskForm').serialize();
    	$.post('/panel/managers/saveTask', params, function (data) {
			var result = $.parseJSON(data);
    		//console.log(result);
			if (typeof result.success != 'undefined' && result.success) {
				$('#addTask').modal('hide');
				self.tab.fnReloadAjax();
			} else {
				alert('Не удалось сохранить.');
			}
    	});
    };

    this.canselEditable = function () {
    	$('#js-editDedline').attr('disabled', 'disabled');
    	$('#js-editManager').attr('disabled', 'disabled');
    	$('#js-editPriority').attr('disabled', 'disabled');
    	$('#target_audit').attr('disabled', 'disabled');
    	$('.js-saveFormBtn').hide();
    	$('.js-cancelFormBtn').hide();
    	$('.js-editBtn').show();
    	if (this.is_boss) {
    		$('#js-editStatus').attr('disabled', 'disabled');
    	}
    };

    this.openModalEdit = function(e, id, isset) {
    	if (isset) {
    		$('#inputComment').val($(e).html());
    	} else {
    		$('#inputComment').val('');
    	}
    	$('#editComment .modal-footer button').attr('onclick', 'manage.saveComment('+id+');');
    	$('#editComment').modal('show');
	};

	this.saveComment = function (id) {
		var params = {
			'comment': $('#inputComment').val(),
			'id': id,
		};
		var self = this;
		$.post('/panel/managers/comsave', params, function (data) {
			var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				$('#editComment').modal('hide');
				self.tab.fnReloadAjax();
			} else {
				alert('Не удается сохранить комментарии');
			}
	    });
	};

	this.delete = function () {
		if (confirm('Удалить выделенные задачи?')) {
	    	var ids = this.getSelRow(true);
	    	if (false === ids) {
	    		return false;
	    	}
	    	var self = this;
	    	$.post('/panel/managers/deleteTask', {'ids':ids}, function (data) {
				var result = $.parseJSON(data);
				if (typeof result.success != 'undefined' && result.success) {
					self.tab.fnReloadAjax();
				} else {
					alert('Не удалось удалить записи');
				}
	    	});
    	}
	};

	this.setDatePay = function(a){
        var c = new Date;
        var e = $.datepicker.formatDate("yyyy-mm-dd", c);

        if ("today" == a) {
            var b = $.datepicker.formatDate("yyyy-mm-dd", new Date);
            var f = c;
        }else if ("week" == a) {
            var f = new Date(c.getFullYear(), c.getMonth(), c.getDate() - c.getDay() + 1);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else if ("month" == a){
            var f = new Date(c.getFullYear(), c.getMonth(), 1);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else if ("kvartal" == a){
        	var f = new Date();
			f.setMonth(f.getMonth() - 3);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else if ("year" == a){
            var f = new Date(c.getFullYear(), 0, 1);
            var b = $.datepicker.formatDate("yyyy-mm-dd", f);
        }else
            return false;

        $(".js-dateFrom").datepicker("setDate", f), $(".js-dateTo").datepicker("setDate", c);
        $('.datepicker').datepicker("refresh");

        this.setFilter();
        this.loadProgres();
    };

    this.refreshResult = function () {
    	$.post('/panel/managers/refreshResult', {}, function (data) {
    		var result = $.parseJSON(data);
			if (typeof result.success != 'undefined' && result.success) {
				alert(result.msg);
			} else {
				alert(result.msg);
			}
    	});
    };
};