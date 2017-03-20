AdvSearch = function(){
	this.module;
	this.goSearch = function(){
		var data = $('form#advSearch').serialize();
		$.post('/'+this.module+'/default/setearch', data, function (result) {
			var answer = $.parseJSON(result);
			if( typeof answer.success != 'undefined' ){
				if( answer.success ){
					document.location.href = answer.link;
				}else{
					openNotification(answer.msg);
				}
			}
      	});

      	return false;
	}
}