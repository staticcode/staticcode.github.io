var firstView;
$(document).on('click', '.pages-top-sel:not(.__na)>:first-child', function() {    
    $(this).next().toggle();
});

$(document).on('mouseup', function(e) {
    if ($('.pages-top-sel').has(e.target).length === 0) {
        $(this).find('.info-bubble').hide();    
    }
});

function open_date_dubble(pref){
  var b = $("#"+pref+"bubble_date");
  b.animate({
        opacity: 0
    }, 0, function () {
        b.show(), b.animate({
            opacity: 1
        }, 200)
    })
  $('.mask').show();
}

function close_bubble(){
    $(".info-bubble").hide(), oldtype = !1
}

function set_stat_date(a, pref, type) {

    if (a) {
        var c = new Date;
        var e = $.datepicker.formatDate("dd.mm.yy", c);
        if ("today" == a) {
            var b = $.datepicker.formatDate("dd.mm.yy", new Date);
            var f = c;
        } else if ("yesterday" == a) {
            c.setDate(c.getDate() - 1);
            var b = e = $.datepicker.formatDate("dd.mm.yy", c);
            var f = c;
        } else if ("week" == a) { 
            var f = new Date(c.getFullYear(), c.getMonth(), c.getDate()-7);
            var b = $.datepicker.formatDate("dd.mm.yy", f);
        } else if ("month" == a){
            var f = new Date(c.getFullYear(), c.getMonth()-1, c.getDate());
            var b = $.datepicker.formatDate("dd.mm.yy", f);
        } else if ("quarter" == a){
            var f = new Date(c.getFullYear(), c.getMonth()-3, c.getDate());
            var b = $.datepicker.formatDate("dd.mm.yy", f);
        } else if ("year" == a){
            var f = new Date(c.getFullYear()-1, c.getMonth(), c.getDate());
            var b = $.datepicker.formatDate("dd.mm.yy", f);
        }else if ("all" == a){
            var f = new Date(firstView.y,firstView.m,firstView.d);
            var b = $.datepicker.formatDate("dd.mm.yy", f);
        }

        $("#" + pref + "from_div").datepicker("setDate", f), $("#" + pref + "to_div").datepicker("setDate", c);
        
        $("#" + pref + "from_text").text(b), $("#" + pref + "to_text").text(e), $("#" + pref + "from").val(b), $("#" + pref + "to").val(e), $("#apply_filters").removeClass("disabled").prop("onclick", null);
        $("#" + pref + "sd_start").val(b), $("#" + pref + "sd_end").val(e);

        selectDateInterval(false, pref);
        
        $('.hasDatepicker').datepicker("refresh");
        selectDateInterval(false, pref);
    }
    else
    {
        a = $('#'+ pref +'sd_start').val().toString();
        b = $('#'+ pref +'sd_end').val().toString();

        f = a.split('.');
        c = b.split('.');
        date1 = new Date( f[2], f[1]-1, f[0] );
        date2 = new Date( c[2], c[1]-1, c[0] );
        if( date1 >= date2 )
        {
            a = b;
        }
           
        $("#" + pref + "from_text").text(a), $("#" + pref + "to_text").text(b), $("#" + pref + "from").val(b), $("#" + pref + "to").val(e), $("#apply_filters").removeClass("disabled").prop("onclick", null);
        $("#" + pref + "from_div").datepicker("setDate", date1), $("#" + pref + "to_div").datepicker("setDate", date2);
        selectDateInterval(false, pref);
        close_bubble();
        execFunc(pref);
        $('.hasDatepicker').datepicker("refresh");
        selectDateInterval(false, pref);
    }
        
}

function date2timestamp(day, month, year, hour, min, sec) { 
    return (Date.UTC(year, month-1, day, hour, min, sec) / 1000); 
}

function pad(a, b) {
    for (var c = "" + a; c.length < b;) c = "0" + c;
    return c
}

function selectDateInterval(mode, pref){
    if( mode ){
        var i_start = getDateArr(pref + "from_text").toString();
        a = i_start.split('.');
        var i_end = getDateArr(pref + "to_text").toString();
        b = i_end.split('.');
        var sd = returnDate(a[2],a[1],a[0]);
        var ed = returnDate(b[2],b[1],b[0]);
    }else{
        var i_start = $("#" + pref + "from_div").data("datepicker");
        var i_end = $("#" + pref + "to_div").data("datepicker");
        var sd = returnDate(i_start.currentYear,i_start.currentMonth,i_start.currentDay);
        var ed = returnDate(i_end.currentYear,i_end.currentMonth,i_end.currentDay);
    }
    
    $("#date_to_div .ui-datepicker-current-day").removeClass("ui-datepicker-current-day");
    /*if( ed < sd )
    {
        ed = sd;
        //selectDateInterval(false, pref);
    }*/
    /*btstamp = date2timestamp(sd.getDate(), sd.getMonth(), sd.getFullYear(), 0, 0, 0);
    etstamp = date2timestamp(ed.getDate(), ed.getMonth(), ed.getFullYear(), 0, 0, 0);*/
    $("#hideDate").val(sd.valueOf()/1000);

    $(".ui-datepicker-next").on('click',function(){
        selectDateInterval(false, pref);
    });

    $(".ui-datepicker-prev").on('click',function(){
        selectDateInterval(false, pref);
    });

    $("table.ui-datepicker-calendar tbody td").on('click',function(){
        setTimeout(function(){
            selectDateInterval(false, pref);
        },100);
        //$('.hasDatepicker').datepicker("refresh");
    });
    
    var $tr = $("table.ui-datepicker-calendar tbody td");
    /*$('.hasDatepicker').datepicker("refresh");*/
    $tr.each(function(i){
        var $this = $(this);
        var y = $this.attr('data-year');
        var m = $this.attr('data-month');
        var d = $this.find('a').html();
        
        if( typeof y != 'undefined' && y >= sd.getFullYear() && y <= ed.getFullYear() ){
            //if( typeof m != 'undefined' && m >= sd.getMonth() && m <= ed.getMonth() ){
                var curr_time = new Date( y, m, d );
                //console.log( sd.getTime()+'<'+curr_time.getTime()+'<'+ed.getTime() )
                if( curr_time.getTime() >= sd.getTime() && curr_time.getTime() <= ed.getTime() ){
                    $this.css('background','#8ABB00');
                }
            //} 
        }
    });
}

function getDateArr(id){
    var date = $( "#" + id ).html();
    var date_arr = date.split('.');
    return returnDate(date_arr[2],date_arr[1]-1,date_arr[0])
}

function returnDate(y,m,d){
    return new Date(y,m,d);
}

function checkDate( pref ){
    var ndate = new Date();

    var s = $('#'+pref+'sd_start').val().split('.');
    var sdate = new Date( s[2], s[1]-1, s[0] );

    var l = $('#'+pref+'sd_end').val().split('.');
    var edate = new Date( l[2], l[1]-1, l[0] );

    if( sdate == 'Invalid Date' ){
        sdate = new Date();   
        $("#" + pref + "sd_start").val($.datepicker.formatDate("dd.mm.yy", sdate));
    }

    if( edate == 'Invalid Date' ){
        edate = new Date();
        $("#" + pref + "sd_end").val($.datepicker.formatDate("dd.mm.yy", edate));
    }

    if( edate > ndate ){
        $("#" + pref + "sd_end").val($.datepicker.formatDate("dd.mm.yy", ndate));
        if( sdate > ndate ) $("#" + pref + "sd_start").val($.datepicker.formatDate("dd.mm.yy", ndate));
    }else if( sdate > edate ){
        $("#" + pref + "sd_start").val($.datepicker.formatDate("dd.mm.yy", edate));
    }
}