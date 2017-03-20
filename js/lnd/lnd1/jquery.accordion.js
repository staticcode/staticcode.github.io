jQuery(function() {
	initAccordion();
});

function initAccordion() {
	jQuery('ul.advantagew320').slideAccordion({
		opener: '>a.opener',
		slider: '>div.slide',
		collapsible: true,
		animSpeed: 300
	});
	jQuery('.capability-accordion').slideAccordion({
		opener: '.opener',
		slider: 'div.slide',
		collapsible: true,
		animSpeed: 300
	});
};
(function($) {
	$.fn.slideAccordion = function(opt) {
		var options = $.extend({
			addClassBeforeAnimation: false,
			activeClass: 'active',
			opener: '.opener',
			slider: '.slide',
			animSpeed: 300,
			collapsible: true,
			event: 'click'
		}, opt);
		return this.each(function() {
			var accordion = $(this);
			var items = accordion.find(':has(' + options.slider + ')');
			items.each(function() {
				var item = $(this);
				var opener = item.find(options.opener);
				var slider = item.find(options.slider);
				opener.bind(options.event, function(e) {
					if (!slider.is(':animated')) {
						if (item.hasClass(options.activeClass)) {
							if (options.collapsible) {
								slider.slideUp(options.animSpeed, function() {
									hideSlide(slider);
									item.removeClass(options.activeClass);
								});
							}
						} else {
							var levelItems = item.siblings('.' + options.activeClass);
							var sliderElements = levelItems.find(options.slider);
							item.addClass(options.activeClass);
							showSlide(slider).hide().slideDown(options.animSpeed);
							sliderElements.slideUp(options.animSpeed, function() {
								levelItems.removeClass(options.activeClass);
								hideSlide(sliderElements);
							});
						}
					}
					e.preventDefault();
				});
				if (item.hasClass(options.activeClass)) showSlide(slider);
				else hideSlide(slider);
			});
		});
	};
	var showSlide = function(slide) {
		return slide.css({
			position: '',
			top: '',
			left: '',
			width: ''
		});
	};
	var hideSlide = function(slide) {
		return slide.show().css({
			position: 'absolute',
			top: -9999,
			left: -9999,
			width: slide.width()
		});
	};
}(jQuery));