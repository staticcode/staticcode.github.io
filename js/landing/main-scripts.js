/* eslint-disable */

$('.logo-slider').slick({
  autoplay: true,
  autoplaySpeed: 5000,
  dots: false,
  arrows: false,
  infinite: true,
  lazyLoad: 'progressive',
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  mobileFirst: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        arrows: true,
        slidesToShow: 5,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 767,
      settings: {
        arrows: true,
        slidesToShow: 4,
        slidesToScroll: 1
      }
    }
  ]
});


//=====


var $featuresSlider = $('.features-slider')
var $featuresItem = $('.feature_item')

$featuresSlider.slick({
  autoplay: true,
  autoplaySpeed: 5500,
  dots: false,
  infinite: true,
  lazyLoad: 'progressive',
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
});
$($featuresItem[0]).addClass('__active');
$featuresSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
  $featuresItem.each(function(index, element){
    if (index === nextSlide) {
      $(element).addClass('__active');
    } else {
      $(element).removeClass('__active');
    }
  })
});

$(document).on('click', '.feature_item', function(){
  $('.feature_item.__active').removeClass('__active');
  $(this).addClass('__active');
  $featuresSlider.slick('slickGoTo', $featuresItem.index(this));
})



$('.clients-list').slick({
    vertical: true,
    slidesToShow: 5,
    arrows: false,
    dots: false,
    mobileFirst: true,
    focusOnSelect: true,
    asNavFor: '.client-features',
    responsive: [{
      breakpoint: 767,
      settings: {
        vertical: false,
        slidesPerRow: 5,
        rows: 1,
        slidesToShow: 5,
      }
    }]
});

$('.client-features').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: false,
  arrows: false,
  fade: true,
  asNavFor: '.clients-list'
});


$('.review-slider').slick({
    autoplay: true,
    autoplaySpeed: 5500,
    speed: 1000,
    lazyLoad: 'progressive',
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    mobileFirst: true,
    responsive: [{
      dots: true,
      breakpoint: 767,
      settings: {
        adaptiveHeight: false,
        dots: true,
        slidesToShow: 1,
      }
    },
    {
      breakpoint: 1199,
      settings: {
        adaptiveHeight: false,
        dots: true,
        slidesToShow: 2,
      }
    }]
});

$('.team-slider').slick({
    // autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: 'progressive',
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    mobileFirst: true,
    responsive: [{
      breakpoint: 767,
      settings: {
        dots: true,
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 1199,
      settings: {
        dots: true,
        slidesToShow: 5,
      }
    }]
});


(function(){
  $(document).on('click', '.js-modal-toggle', function(e){

    e.preventDefault()
    $('.modal, .modal-overlay').toggleClass('__closed');

  })
})();

(function(){
  $(document).on('click', '.__video', function(e){
    e.preventDefault()
    $('.video-container').html('<iframe id="video" src="'+$(this).data('video')+'" allowfullscreen ></iframe>')
    $('.video-modal, .video-modal-overlay').toggleClass('__closed');
  })

  $(document).on('click', '.js-close-video', function(e){
    e.preventDefault()
    $('.video-container').empty()
    $('.video-modal, .video-modal-overlay').toggleClass('__closed');
  })

})();



(function(){
// Hide Header on on scroll down http://jsfiddle.net/mariusc23/s6mLJ/31/
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var $siteHeader = $('.site-header');
var navbarHeight = $siteHeader.outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $siteHeader.addClass('__nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $siteHeader.removeClass('__nav-up');
        }
    }

    lastScrollTop = st;
}

})();

// complete_registration form

(function(){
  var nameField = $('#namefield');
  var skypeField = $('#skypefield');
  var phoneField = $('#phonefield');
  var socialRegister = window.socialRegister || false;
  $(document).on('input', '#namefield, #skypefield, #phonefield', function(event) {

    $(this).closest('.__error').removeClass('__error');
  });

  $('#complete_registration').on('submit', function(e){
    if (socialRegister) {
      return true;
    }
    if (nameField.val() === '') {
      e.preventDefault();
      nameField.parent().addClass('__error');
    }

    if (skypeField.val() === '' && phoneField.val().length < 5) {
      e.preventDefault();
      skypeField.closest('.p-registration_form-item').addClass('__error');
    }

    if (skypeField.val() === '' && !$('#phonefield').intlTelInput("isValidNumber")) {
      e.preventDefault();
      $('#phonefield').parent().addClass("__error");
    }

  })
})();

(function(){
  var telInput = $("#phonefield");

  telInput.intlTelInput({
    initialCountry: "auto",
    autoHideDialCode: false,

    geoIpLookup: function(callback) {
      $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "";
        callback(countryCode);
      });
    },
    utilsScript: "js/landing/jquery/plugins/intl-tel-input/build/js/utils.js" // just for formatting/placeholders etc
  });

  var reset = function() {
    telInput.parent().removeClass("__error");
    // errorMsg.addClass("hide");
    // validMsg.addClass("hide");
  };

  // on blur: validate
  telInput.blur(function() {
    reset();
    if ($.trim(telInput.val())) {
      if (telInput.intlTelInput("isValidNumber")) {
        // validMsg.removeClass("hide");
      } else {
        telInput.parent().addClass("__error");
        // errorMsg.removeClass("hide");
      }
    }
  });

  // on keyup / change flag: reset
  telInput.on("keyup change", reset);
  telInput.on("countrychange", function(e, countryData) {
    var countyCode = countryData.dialCode;
    if (countyCode && !telInput.val()) {
      $("#phonefield").intlTelInput("setNumber", "+" + countyCode);
    }
  });

})();




(function(){
  $('select').on('change', function(event) {
    var $this = $(this);
    if ($this.find('option').filter(':selected').data().other) {
      return $this.parent().next().slideDown();
    }
    $this.parent().next().slideUp();
  });
})()
