function openDropDown(e) {
    if (!($(e).parent().hasClass('__open'))) {
        $('.pseudo-select').removeClass('__open');
        $(e).parent().addClass('__open');
    } else {
        $(e).parent().removeClass('__open');
    }
}

function openPablikAdvancedFilters(e) {
    $('.pablic_advanced-filters').toggleClass('__open');
}

function openPablicPostText(e) {
    //$('.pablic-post_text p').toggle();
    $(e).parent().prev().find('p').toggle();
}


$(document).click(function (e) {
    if ($('.pseudo-select').has(e.target).length === 0) {

        $('.pseudo-select').removeClass('__open');
    }
});


var pablik = {
    //init: function () {
    //},
    searchPablic: function () {
        $(".applyFilter").click(function () {
            form = $(this).closest('form')
            $(form).submit();
            //$.ajax({
            //    url: "/vk/group/list",
            //    type: 'POST',
            //    data: $(this).closest('form').serialize()
            //}).done(function () {
            //    $(this).addClass("done");
            //});
        });
    }

}


$(document).ready(function () {
    pablik.searchPablic();
});