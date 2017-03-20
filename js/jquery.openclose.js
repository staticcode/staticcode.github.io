function flagPopap(e){
	if (!$(e).parent().hasClass('expanded')) {
		$('div.slide').hide();
		$('.expanded').removeClass('expanded');
	}
		
	if( $(e).parent().hasClass('expanded') ){
		$(e).next('div.slide').hide();
		$(e).parent().removeClass('expanded');
	}else{
		$(e).next('div.slide').show();
		$(e).parent().addClass('expanded');
	}
}
$(document).click(function(e) {
    if ($('.expanded').has(e.target).length === 0) {
       
		$('div.slide').hide();
		$('.expanded').removeClass('expanded');
	
    }
});