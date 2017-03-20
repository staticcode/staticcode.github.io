function synopticalPayTab(method, sort, sord){
	var ds = $("#"+method+"from_text").html();
	var de = $("#"+method+"to_text").html();

	$.post('/cabinet/info/referalinfo', {'method':method,'params':{'date_start':ds,'date_end':de,'sort':sort,'sord':sord}}, function (result) {
		//if( result != '' ){
        	$("tbody."+method).html(result);
			$('.' + method + 'TabBlock').show();
		//}
    });
}

function sortTab(method, sort){
	var sord = 'asc';

	if( $(".tab_"+method+" .th_"+sort).hasClass('active') ){
		if( $(".tab_"+method+" .th_"+sort).hasClass('asc') ){
			sord = 'desc';
		}else{
			sord = 'asc';
		}
	}else{
		sord = 'asc';
	}

	$(".tab_"+method+" th").removeClass('active');
	$(".tab_"+method+" .th_"+sort).addClass('active');
	$(".tab_"+method+" th").removeClass('asc');
	$(".tab_"+method+" th").removeClass('desc');
	$(".tab_"+method+" .th_"+sort).addClass(sord);
	
	synopticalPayTab(method, sort, sord);
}

function changeTarif(){
	var t = $("#sort-tarif").val();
	var html = '';

	if( typeof pcost[t] != "undefined" ){
		for(i in pcost[t]){
			html = html + '<option value="' + i + '">' + pcost[t][i]['month'] + '</option>';
		}
		$("#sort-period").html(html);
		$("#sort-period").trigger('refresh');

		sumWriteOff();
	}
}

function sumWriteOff(){
	var b = $("#balans").val();
	var t = $("#sort-tarif").val();
	var m = $("#sort-period").val();

	if( typeof pcost[t][m]['cost'] != "undefined" ){
		$("#sw-off b").html( pcost[t][m]['cost'] + " (WMZ)" );

		if( parseFloat( pcost[t][m]['cost'] ) > parseFloat( b ) ){
			$("js_pi-paiment").html("Пополнить c доплатой");
		}else{
			$("js_pi-paiment").html("Оплатить бонусами");
		}
	}
}

function payToBalans(){
	function onSuccess(result) {
		if( typeof result.status != 'undefined' ){
			if( result.status == 'redirect' ){
				document.location.href = result.link;
			}else
				openNotification( result.msg );
		}
    }

    $.ajax({
        url: '/cabinet/info/reftpay',
        type: 'POST',
        data: $("#form-ref-t").serialize(),
        dataType: 'json',
        success: onSuccess,
    });
}

function sendInviteFriends(){
	var emails = $("#f-email").val();
	var pd = new Array();

	if( emails == '' ){
		openNotification( "Введите хотя бы один email" );
		return false;
	}

	var e = emails.split(',');

	for(i in e){
		if( validateEmail(e[i]) ){
			pd.push( e[i] );
		}
	}

	if( pd.length == 0 ){
		openNotification( "Введенные вами данные не валидны" );
		return false;
	}

	function onSuccess(result) {
		if( typeof result.status != 'undefined' && result.status == 'success' ){
			openNotification( "Вы успешно пригласили в Advancets " + result.scount + " пользователей" );
			//setNotValidMail();
			delValidMail();
		}else{
			openNotification( "Введенные вами данные не валидны" );
		}
    }

    $.ajax({
        url: '/cabinet/info/refsend',
        type: 'POST',
        data: {
        	"emails": pd
        },
        dataType: 'json',
        success: onSuccess,
    });
}

/*function setNotValidMail(){
	var d = $("li.select2-search-choice div");

	$("li.select2-search-choice").removeClass('notValid');
	$("li.select2-search-choice").removeClass('Valid');

	d.each(function(){
		var $this = $(this);

		if( !validateEmail($this.html()) ){
			$this.parent().addClass('notValid');
		}else{
			$this.parent().addClass('Valid');
		}
	});
}*/

function delValidMail(){
	$("li.select2-search-choice.Valid").remove();
}

function paidToWm(){
	if( !checkPaidAmount() ) return false;

    $.ajax({
        url: '/cabinet/info/refwpay',
        type: 'POST',
        data: $("#form-ref-w").serialize(),
        dataType: 'json',
        success: function(result){
        	if( typeof result.status != 'undefined' && result.status == 'success' ){
        		document.location.href = "/cabinet/info/successpay";
        	}else{
        		openNotification( "Отправить заявку не удалось, обратитесь в службу поддержки" );
        	}
        }
    });
}

function checkPaidAmount(){
	var pA = $("#amount").val();
	var pAmax = $("#amount").data('maxprice');

	if( pA > pAmax ){
		$("#amount").addClass('error_input');
		openNotification( "Максимальная сумма выплаты " + pAmax + " WMZ" );
		return false;
	}else{
		$("#amount").removeClass('error_input');
		return true;
	}
}