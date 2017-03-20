__FreeBaseAdminer = function(){
	this.addDelToFreeBase = function(){
		$.post('/social/default/addfreebase', {'ads_id':ads_id, 'del':freeBase}, function (data) {
			var result = $.parseJSON(data);
			if( typeof result.msg != 'undefined' ){
				openNotification(result.msg);
				if( result.success === true ){
					$("#freeBaseAddDell strong").html(result.cnt);

					if( freeBase === true )
						tizpage(1);
				}
			}
		});
	}

	this.showFreeBase = function(){
		var cnt = $('#freeBaseAddDell strong').html();

		if( freeBase ){
			freeBase = false;
			$('#freeBaseShowHide').html('Показать free базу');
			$('#freeBaseAddDell').html('Добавить в free базу (<strong>'+cnt+'</strong>)');
			ads_id = new Array();
			tizpage(1);
		}else{
			freeBase = true;
			$('#freeBaseShowHide').html('Показать full базу');
			$('#freeBaseAddDell').html('Удалить из free базы (<strong>'+cnt+'</strong>)');
			ads_id = new Array();
			tizpage(1);
		}
	}
}