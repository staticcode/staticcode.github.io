// ------------------------------------------------------nav-box---------------------------------------------------------------------
function openNavBox() {
	$('.nav-box .slide').slideToggle();
};

jQuery(document).ready(function($) {

	closeNavBox();

	$(window).resize(function(){
        closeNavBox();
    });

    function closeNavBox() {
    	var width = $(window).width(); // ширина

    	if ( width >= 983 ) {
    		$('.nav-box .slide').removeAttr('style');
    	};
    };

});
// ------------------------------------------------------nav-box---------------------------------------------------------------------
// --------------------------------------------------modal---------------------------------------------
function openModal() {
	$('.modal').show();
	$('body').css({
        "overflow": "hidden",
        "padding-right" : "17px"
    });
};

$(document).on('click', '.modal', function (e) {
    if ($('.modal_content').has(e.target).length === 0) {
        $('.modal').hide();  
        $('.js-removed').removeAttr('style').empty();
        $('body').removeAttr('style');
    }
});

$(document).on('click', '.js-modal-close', function () {
    $('.modal').hide();
    $('.js-removed').removeAttr('style').empty();
    $('body').removeAttr('style');
});
// --------------------------------------------------modal---------------------------------------------
// --------------------------------------------------back-to-top---------------------------------------------
$(document).ready(function() {
    parallax();
    $(window).bind('scroll', function(e) {
        parallax();
    });

    function parallax() {
        var scrollPosition = $(window).scrollTop();
        var $b = $('.page');
        var ClientRect = $('.page').length != 0 ? $('.page')[0].getBoundingClientRect() : '';
        var offsetTop = ClientRect.top;
        var win_h = $(window).height();
        var ratio = Math.round((offsetTop / win_h) * 100);
        if (ratio <= -40) {
            $('.back-to-top').css('opacity', '1');
        } else if (ratio >= -39) {
            $('.back-to-top').css('opacity', '0');
        }
    }
});
// --------------------------------------------------back-to-top---------------------------------------------

