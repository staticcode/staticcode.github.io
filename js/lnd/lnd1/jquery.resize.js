$(document).ready(function() {
    parallax();
    $(window).bind('scroll', function(e) {
        parallax();
    });

    function parallax() {
        var scrollPosition = $(window).scrollTop();
        var $b = $('.ingredients-success');
        var ClientRect = $('.ingredients-success').length != 0 ? $('.ingredients-success')[0].getBoundingClientRect() : '';
        var offsetTop = ClientRect.top;
        var win_h = $(window).height();
        var ratio = Math.round((offsetTop / win_h) * 100);
        if (ratio <= 30) {
            $('.ingredients-success .box img').css('width', '160');
            $('.ingredients-success .box').css('opacity', '1');
        } else if (ratio > 31 && ratio <= 50) {
            $('.ingredients-success .box img:eq(0)').css('width', '160');
            $('.ingredients-success .box img:eq(1)').css('width', '140');
            $('.ingredients-success .box img:eq(2)').css('width', '120');
            $('.ingredients-success .box img:eq(3)').css('width', '100');
            $('.ingredients-success .box img:eq(4)').css('width', '80');
            $('.ingredients-success .box:eq(0)').css('opacity', '1');
            $('.ingredients-success .box:eq(1)').css('opacity', '1');
            $('.ingredients-success .box:eq(2)').css('opacity', '1');
            $('.ingredients-success .box:eq(3)').css('opacity', '1');
            $('.ingredients-success .box:eq(4)').css('opacity', '1');
        } else if (ratio > 51 && ratio <= 70) {
            $('.ingredients-success .box img:eq(0)').css('width', '140');
            $('.ingredients-success .box img:eq(1)').css('width', '120');
            $('.ingredients-success .box img:eq(2)').css('width', '100');
            $('.ingredients-success .box img:eq(3)').css('width', '80');
            $('.ingredients-success .box img:eq(4)').css('width', '60');
            $('.ingredients-success .box:eq(0)').css('opacity', '1');
            $('.ingredients-success .box:eq(1)').css('opacity', '1');
            $('.ingredients-success .box:eq(2)').css('opacity', '1');
            $('.ingredients-success .box:eq(3)').css('opacity', '1');
            $('.ingredients-success .box:eq(4)').css('opacity', '1');
        } else if (ratio <= 90 && ratio >= 71) {
            $('.ingredients-success .box img:eq(0)').css('width', '110');
            $('.ingredients-success .box img:eq(1)').css('width', '90');
            $('.ingredients-success .box img:eq(2)').css('width', '70');
            $('.ingredients-success .box img:eq(3)').css('width', '50');
            $('.ingredients-success .box img:eq(4)').css('width', '30');
            $('.ingredients-success .box:eq(0)').css('opacity', '1');
            $('.ingredients-success .box:eq(1)').css('opacity', '1');
            $('.ingredients-success .box:eq(2)').css('opacity', '1');
            $('.ingredients-success .box:eq(3)').css('opacity', '1');
            $('.ingredients-success .box:eq(4)').css('opacity', '1');
        } else if (ratio <= 100 && ratio >= 91) {
            $('.ingredients-success .box img:eq(0)').css('width', '90');
            $('.ingredients-success .box img:eq(1)').css('width', '70');
            $('.ingredients-success .box img:eq(2)').css('width', '50');
            $('.ingredients-success .box img:eq(3)').css('width', '0');
            $('.ingredients-success .box img:eq(4)').css('width', '0');
            $('.ingredients-success .box:eq(0)').css('opacity', '1');
            $('.ingredients-success .box:eq(1)').css('opacity', '1');
            $('.ingredients-success .box:eq(2)').css('opacity', '1');
            $('.ingredients-success .box:eq(3)').css('opacity', '0');
            $('.ingredients-success .box:eq(4)').css('opacity', '0');
        }
    }
});
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
$(document).ready(function() {
    parallax();
    $(window).bind('scroll', function(e) {
        parallax();
    });

    function parallax() {
        var scrollPosition = $(window).scrollTop();
        var $b = $('.step-box');
        var ClientRect = $('.step-box').length != 0 ? $('.step-box')[0].getBoundingClientRect() : '';
        var offsetTop = ClientRect.top;
        var win_h = $(window).height();
        var ratio = Math.round((offsetTop / win_h) * 100);
        if (ratio <= 40) {
            $('.step-line').attr('data-step','4');
            $('.step ul li').css('opacity', '1');
        } else if (ratio > 41 && ratio <= 55) {
            $('.step-line').attr('data-step','3');
            $('.step ul li:eq(0)').css('opacity', '1');
            $('.step ul li:eq(1)').css('opacity', '1');
            $('.step ul li:eq(2)').css('opacity', '1');
            $('.step ul li:eq(3)').css('opacity', '0');
        } else if (ratio > 56 && ratio <= 70) {
            $('.step-line').attr('data-step','2');
            $('.step ul li:eq(0)').css('opacity', '1');
            $('.step ul li:eq(1)').css('opacity', '1');
            $('.step ul li:eq(2)').css('opacity', '0');
            $('.step ul li:eq(3)').css('opacity', '0');
        } else if (ratio > 71 && ratio <= 85) {
            $('.step-line').attr('data-step','1');
            $('.step ul li:eq(0)').css('opacity', '1');
            $('.step ul li:eq(1)').css('opacity', '0');
            $('.step ul li:eq(2)').css('opacity', '0');
            $('.step ul li:eq(3)').css('opacity', '0');
        } else if (ratio > 86 && ratio <= 110) {
            $('.step-line').attr('data-step','0');
            $('.step ul li:eq(0)').css('opacity', '0');
            $('.step ul li:eq(1)').css('opacity', '0');
            $('.step ul li:eq(2)').css('opacity', '0');
            $('.step ul li:eq(3)').css('opacity', '0');
        }
    }
});
$(document).ready(function() {
    parallax();
    $(window).bind('scroll', function(e) {
        parallax();
    });

    function parallax() {
        var scrollPosition = $(window).scrollTop();
        var $b = $('.arbitrazhnik');
        var ClientRect = $('.arbitrazhnik').length != 0 ? $('.arbitrazhnik')[0].getBoundingClientRect() : '';
        var offsetTop = ClientRect.top;
        var win_h = $(window).height();
        var ratio = Math.round((offsetTop / win_h) * 100);
        if (ratio <= 80) {
            $('.arbitrazhnik').css('width', '42%');
        } else if (ratio >= 81) {
            $('.arbitrazhnik').css('width', '0');
        }
    }
});
$(document).ready(function() {
    parallax();
    $(window).bind('scroll', function(e) {
        parallax();
    });

    function parallax() {
        var scrollPosition = $(window).scrollTop();
        var $b = $('.marketer');
        var ClientRect = $('.marketer').length != 0 ? $('.marketer')[0].getBoundingClientRect() : '';
        var offsetTop = ClientRect.top;
        var win_h = $(window).height();
        var ratio = Math.round((offsetTop / win_h) * 100);
        if (ratio <= 100) {
            $('.marketer').css('width', '42%');
        } else if (ratio >= 101) {
            $('.marketer').css('width', '0');
        }
    }
});
$(document).ready(function() {
    parallax();
    $(window).bind('scroll', function(e) {
        parallax();
    });

    function parallax() {
        var scrollPosition = $(window).scrollTop();
        var $b = $('.sellers');
        var ClientRect = $('.sellers').length != 0 ? $('.sellers')[0].getBoundingClientRect() : '';
        var offsetTop = ClientRect.top;
        var win_h = $(window).height();
        var ratio = Math.round((offsetTop / win_h) * 100);
        if (ratio <= 100) {
            $('.sellers').css('width', '42%');
        } else if (ratio >= 101) {
            $('.sellers').css('width', '0');
        }
    }
});