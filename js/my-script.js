var footerAndHeaderHeight = 266;
var scrollbarWidth_result = null;
var lifeSlider;
var sizeSlider;

/*--------------------------------------------------form*/
(function ($) {
    $(function () {
        $('input:not([type=file], .no-styler), select#sortch').styler();
    })
})(jQuery)
/*----------------------------------------------form-and*/
/*----------------------------------------------diapozon*/
$(document).ready(function () {
    if( $("#slider").length != 0 )
    {
        maxLiveSize = (typeof maxLive != 'undefined') ? maxLive : 1000;

        $("#slider").ionRangeSlider({
            type: 'double',
            hide_min_max: true,
            hide_from_to: true,
            grid: true,
            min: 0,
            max: maxLiveSize,
            step: 1,
            min_interval: 1,

            onChange: function (event) {
                var from = ( isNaN( event.from ) ? 0 : event.from );
                var to = ( isNaN( event.to ) ? 0 : event.to );
                $("input[name=num_days_st]").val(from);
                $("input[name=num_days_fin]").val(to);

                setFilterLifePeriod('day_on_count');

                if( $("input[name=num_days_st]").val() != 0 || $("input[name=num_days_fin]").val() != maxLiveSize )
                    setUnselectRange('life');
                else if( $("input[name=num_days_st]").val() == 0 && $("input[name=num_days_fin]").val() == maxLiveSize )
                    unselectLife();
            },
            onFinish: function (obj) {
                if( isNaN( obj.from ) ){
                    lifeSlider.update({
                        from: 0
                    });
                }
                if( isNaN( obj.to ) ){
                    sizeSlider.update({
                        to: maxNumSize
                    });
                }
            }
        });

        lifeSlider = $("#slider").data("ionRangeSlider");

        $('input[name=num_days_st]').change(function () {
            var val = $(this).val();

            if( val != 0 ) setUnselectRange('life');

            lifeSlider.update({from: val});

            setFilterLifePeriod('day_on_count');
        });

        $('input[name=num_days_fin]').change(function () {
            var val = $(this).val();

            if( val != maxLiveSize ) setUnselectRange('life');

            lifeSlider.update({to: val});

            setFilterLifePeriod('day_on_count');
        });
    }

    if( $("#slider3").length != 0 )
    {
        maxNumSize = (typeof maxSize != 'undefined') ? maxSize : 2048;

        $("#slider3").ionRangeSlider({
            type: 'double',
            hide_min_max: true,
            hide_from_to: true,
            grid: true,
            min: 0, // минимальное значение
            max: maxNumSize, // максимальное значение
            step: 1, // шаг слайдера
            min_interval: 1,
            onChange: function (event) {
                var from = ( isNaN( event.from ) ? 0 : event.from );
                var to = ( isNaN( event.to ) ? 0 : event.to );
                $("input[name=size_st]").val(from);
                $("input[name=size_fin]").val(to);

                setFilterLifePeriod('size_on_count');

                if( $("input[name=size_st]").val() != 0 || $("input[name=size_fin]").val() != maxNumSize )
                    setUnselectRange('size');
                else if( $("input[name=size_st]").val() == 0 && $("input[name=size_fin]").val() == maxNumSize )
                    unselectSize();
            },
            onFinish: function (obj) {
                if( isNaN( obj.from ) ){
                    sizeSlider.update({
                        from: 0
                    });
                }
                if( isNaN( obj.to ) ){
                    sizeSlider.update({
                        to: maxNumSize
                    });
                }
            }
        });

        sizeSlider = $("#slider3").data("ionRangeSlider");

        $('input[name=size_st]').change(function () {
            var val = $(this).val();

            if( val != 0 ) setUnselectRange('size');

            sizeSlider.update({from: val});

            setFilterLifePeriod('size_on_count');
        });

        $('input[name=size_fin]').change(function () {
            var val = $(this).val();

            if( val != maxNumSize ) setUnselectRange('size');

            sizeSlider.update({to: val});

            setFilterLifePeriod('size_on_count');
        });
    }
});

/*------------------------------------------diapozon-and*/
/*---------------------------------------------kalendar*/
$(function () {
    $("#datepicker").datepicker({
        defaultDate: "+1w",
        showOn: "button",
        buttonImage: "/images/calendar.png",
        buttonImageOnly: true,
        onClose: function (selectedDate) {
            $("#datepicker2").datepicker("option", "minDate", selectedDate);
        }
    });

    /*$("#datepicker2").datepicker({
        defaultDate: "+1w",
        showOn: "button",
        buttonImage: "/images/calendar.png",
        buttonImageOnly: true,
        onClose: function (selectedDate) {
            $("#datepicker").datepicker("option", "maxDate", selectedDate);
        }
    });*/

	$("#datepicker_run").datepicker({
        defaultDate: "+1w",
        showOn: "button",
        buttonImage: "/images/calendar_run.png",
        buttonImageOnly: true,
        onClose: function (selectedDate) {
            $("#datepicker_run2").datepicker("option", "minDate", selectedDate);
        }

    });
    $("#datepicker_run2").datepicker({
        defaultDate: "+1w",
        showOn: "button",
        buttonImage: "/images/calendar_run.png",
        buttonImageOnly: true,
        onClose: function (selectedDate) {
            $("#datepicker_run").datepicker("option", "maxDate", selectedDate);
        }
    });
});

$.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: '',
    nextText: '',
    currentText: 'Сегодня',
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false
};
$.datepicker.setDefaults($.datepicker.regional['ru']);

$('input.datepicker').datepicker({
    showOn: 'both',
    buttonImageOnly: true,
    buttonImage: '/images/026.png'
});
/*----------------------------------kalendar-and*/
/*-------------------------------------accordion*/
/*$(document).ready(function() {
$('.left-panel-tiz .filter-acc-title').click(function() {
$('.left-panel-tiz .filter-acc-cont').slideUp(500);
$('.left-panel-tiz .filter-acc-title').removeClass('active');
$(this).next('div').filter(function(){return $(this).css('display')=='block'}).slideUp(500);
$(this).next('div').filter(function(){
return $(this).css('display')=='none'
}).slideDown(500).prev('div').addClass('active');
});
}); */
/*------------------------------------accordion-and*/

/*-------------------------------------accordion-soc*/


$(document).ready(function () {
    $('.left-panel-soc .filter-acc-title').click(function () {
        $('.left-panel-soc .filter-acc-cont');
        $(this).toggleClass('active').prev('div').slideToggle(300);
	});

	$('.left-panel-tiz .filter-acc-title').click(function () {
        $('.left-panel-tiz .filter-acc-cont');
        $(this).toggleClass('active').prev('div').slideToggle(300);
    });
});

$(function () {
	var $leftPanelSoc = $(".left-panel-soc"); // блок, который должен зафиксироваться при скролле
	var $leftPanelTiz = $(".left-panel-tiz"); // блок, который должен зафиксироваться при скролле
    var scrollTreshold = 102; // позиция скролла, при которой блок должен остановиться
    var fixedClass = "fixed"; // класс css, который должен фиксирует блок

    $(window).scroll(function () {
		if ($(window).scrollTop() > scrollTreshold) {
			$leftPanelSoc.addClass(fixedClass);
			$leftPanelTiz.addClass(fixedClass);
		}
		else {
			$leftPanelSoc.removeClass(fixedClass);
			$leftPanelTiz.removeClass(fixedClass);
		}
		setPanelBoxHeight();
	});
	setTimeout(function(){
		setPanelBoxHeight();
		setColumnWidth();
	}, 0);
});
function scrollToTop(){
    $("html, body").animate({
        scrollTop: 0
    }, 10);
}
function setPanelBoxHeight() {
    var scrollTopPos = $(window).scrollTop(),
        windowHeight = $(window).height(),
        documentHeight = $(document).height(),
        headerHeight = 102,
        distanceToBottom = documentHeight - (scrollTopPos + windowHeight),
        aBitBottomIndent = 5,
        footerHeight = 213;

    if (documentHeight == windowHeight) {
        $('#left-panel-box')
            .removeClass("processed")
            // .height(windowHeight - footerHeight - headerHeight)
            .mCustomScrollbar("update");
    } else {

        if (scrollTopPos > headerHeight) {

            if (distanceToBottom < footerHeight) {

                $('#left-panel-box')
                    .removeClass("processed")
                    // .height(windowHeight - (footerHeight - distanceToBottom))
                    .mCustomScrollbar("update");

            } else {

                if (!$('#left-panel-box').hasClass("processed")) {

                    $('#left-panel-box')
                    .addClass("processed")
                    // .height(windowHeight - aBitBottomIndent)
                    .mCustomScrollbar("update");

                }
            }
        } else {

            $('#left-panel-box').removeClass("processed")
            // .height(windowHeight - headerHeight)
            .mCustomScrollbar("update");
        }
    }

    // if (distanceToBottom < footerHeight) {
    //     $(".bottom-toolbar").css('bottom', 0);
    // } else {
    //     $(".bottom-toolbar").css('bottom', (distanceToBottom - footerHeight) + 'px');
    // }


    if (distanceToBottom < footerHeight) {
        $(".bottom-toolbar").removeClass("__fixed");
    } else {
        $(".bottom-toolbar").addClass("__fixed");
    }


}


$(window).resize(function () {
    setColumnWidth();
    setPanelBoxHeight();
});





/*----------------------------------width-column-and*/
/*------------------------------------------masonry*/
$(document).ready(function () {
    /* $('#teazers-block').masonry({
         columnWidth: 212,
         "gutter": 50,
         "isFitWidth": true,
 // указываем элемент-контейнер в котором расположены блоки для динамической верстки
       itemSelector: '.teazers-one',
 // указываем класс элемента являющегося блоком в нашей сетке
           singleMode: true,
 // true - если у вас все блоки одинаковой ширины
       isResizable: true,
 // перестраивает блоки при изменении размеров окна
       isAnimated: true,
 // анимируем перестроение блоков
           animationOptions: {
           queue: false,
           duration: 500
       }
 // опции анимации - очередь и продолжительность анимации
     });
     */
    $('#teazers-block-2').masonry({
        columnWidth: 212,
        "gutter": 50,
        "isFitWidth": true,
        // указываем элемент-контейнер в котором расположены блоки для динамической верстки
        itemSelector: '.teazers-one',
        // указываем класс элемента являющегося блоком в нашей сетке
        singleMode: true,
        // true - если у вас все блоки одинаковой ширины
        isResizable: true,
        // перестраивает блоки при изменении размеров окна
        isAnimated: true,
        // анимируем перестроение блоков
        animationOptions: {
            queue: false,
            duration: 500
        }
        // опции анимации - очередь и продолжительность анимации
    });
});
/*--------------------------------------masonry-and*/
/*--------------------------------------teaz-one-popup*/

/*$(document).ready(function() {
  $(".tzbl_bot_rev_link").click( function(){
  $(this).closest('.teazers-one').find('.tzbl_popup_block').toggle("fast")
});
$(".cancelComment").click( function(){
  $(this).parents(".tzbl_popup_block:first").hide("fast")
});

});*/
/*----------------------------------teaz-one-popup-and*/
/*------------------------------------------------tabs*/


$(function () {
    $("#teaz-sin-tabs").tabs();
    //$("#profile_tabs").tabs();
});

/*--------------------------------------------tabs-and*/

$(function () {
    //	Scrolled by user interaction

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
            duration: ( typeof maxLive != 'undefined' ) ? maxLive : 1000
		}
    });
});

function checkRequired() {
    var errors = false;

    $('input').removeClass('error_input');
    if (!checkPrice()) {
        return false;
    }

    $.each($('div.required select'), function (item, field) {
        if( this.id == 'store' && ( this.value == 'Выберите проект' || this.value == '' ) ){
            errors = true;
            openNotification('Выберите проект');
            return false;
        }else if( this.id == 'category' && ( this.value == 'Выберите категорию' || this.value == '' ) ){
            errors = true;
            openNotification('Выберите категорию');
            return false;
        }

    });

    $.each($('div.required input'), function (item, field) {
        if ($(field).val() == '') {
            errors = true;
            $(field).addClass('error_input');
        }
    });

    console.log(errors);

    if( errors ){
        $(".reg-block-row-but .blue_button").attr("disabled", "disabled");
    }else{
        $(".reg-block-row-but .blue_button").removeAttr("disabled");
    }

    return !errors;
}

function checkPrice() {
    $('#priceclick').removeClass('error_input');
    var price = parseFloat($("#priceclick").val());

    if ((price < $('#priceclick').data('minprice')) || ($('#priceclick').data('maxprice') > 0 && price > $('#priceclick').data('maxprice'))) {
        openNotification("Цена должна быть больше " + $('#priceclick').data('minprice') + ( $('#priceclick').data('maxprice') > 0 ? " и меньше " + $('#priceclick').data('maxprice') : '' ) );
        $('#priceclick').addClass('error_input');
        return false;
    }
    return true;
}

function setColumnWidth(selector){
	var clearWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (clearWidth < 1240) {
        clearWidth = 1240;
    }
    var leftPanel = $("div.left-panel").width(),
		newWidth = clearWidth - leftPanel - getScrollbarWidth() - 5,
		maxHeight = $(window).height() - footerAndHeaderHeight;

    if ( typeof $.browser != 'undefined' && $.browser.msie ) { // fix for IE
        newWidth -= 17;
    }


    $(".teaz-column").css({"min-height": maxHeight });
    $(".js-container-min-height").css({"min-height": maxHeight - 85 });
}

function getScrollbarWidth() {
	var windowHeight = $(window).height(),
		documentHeight = $(document).height();

    if ( ( typeof $.browser != 'undefined' && $.browser.msie ) || windowHeight == documentHeight) {
        return 0;
    }
    if (scrollbarWidth_result != null) {
        scrollbarWidth_result;
    }

    var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
        $outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
        inner = $inner[0],
        outer = $outer[0];

    jQuery('body').append(outer);
    var width1 = inner.offsetWidth;
    $outer.css('overflow', 'scroll');
    var width2 = outer.clientWidth;
    $outer.remove();

    scrollbarWidth_result = (width1 - width2);
    return scrollbarWidth_result;
}