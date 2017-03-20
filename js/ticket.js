function send_ticket(){
	openPreloader();
	var title = $("#ticket_title").val();
	var body = $("#ticket_body").val();

	if( title == '' || body == '' ){
		closePreloader();
		openNotification('Не все поля заполнены');
		return;
	}
	$(".__success").attr("disabled", "disabled");

    setTimeout(function() {
        $(".__success").removeAttr('disabled');
    }, 15000);

	$.ajax({
        type: 'POST',
        url: '/support/show/create',
        data: {'Ticket[title]':title, 'Ticket[body]':body},
        dataType: 'json',
        success: function(result){
            closePreloader();
            openNotification(result.msg);
            $("#ticket_tab").html( result.table );
            $("#ticket_title").val('');
            $("#ticket_body").val('');
            $("#img_name").val('');

            if(typeof result.id != 'undefined' && result.id != ''){
                var form = document.getElementById("sendForm");
                xhr = new XMLHttpRequest();
                xhr.open("POST", "upload");
                var fd = new FormData(form)
                fd.append("ticket", result.id);
                xhr.send(fd);
                $('input:file').MultiFile('reset');
            }
        },
        error: function(){closePreloader();$('input:file').MultiFile('reset');}
    });
}

function notifycation(msg,status){

	$(".notifycation").html( msg );
	
	if(status)
		$(".notifycation").css("color", "green");
	else
		$(".notifycation").css("color", "red");

	$(".notifycation.tickm").css("display", "inline-block");
	$(".notifycation.maind").css("display", "block");

	setTimeout(function(){ $(".notifycation").css("display", "none") }, 4000);
}

function sort_ticket( sort )
{
	var sord = $("#sord").val();

	$.post('/support/show/index',{'sord':sord,'sort':sort},function(result){
		if( result != '' )
			$("#ticket_tab").html( result );
	});
}

function correspond_ticket( id )
{
	window.location.href = "/support/show/view/?id=" + id;
}

function send_t_msg( ticket_id )
{
	var body = $("#replyText").val();
	var img = $("#img_name").val();
	$(".notifycation").css("float", "none");

	if( body == '' )
	{
		notifycation( "Поле не заполнено", false );
		return;
	}
	openPreloader();
	$.post('/support/show/cmsg',{'tid':ticket_id,'body':body,'img':img},function(result){
		closePreloader();
		if( result != '' )
		{
			$( result ).insertAfter( $("#tr_head") );
			$("#replyText").val('');
			notifycation( "Ответ добавлен", true );
		}
		else
			notifycation( "Ответ не добавлен", false );

	});
}

function closeTicket(ticket_id)
{
	openPreloader();
	$.post('/support/show/close',{'tid':ticket_id},function(result){
		closePreloader();
		if( result != '' )
			$("#tr_head").html( result );
	});
}

function msg_rating( level, msg_id )
{
	openPreloader();
	$.post('/support/show/rating',{'level':level, 'msg_id':msg_id},function(result){
		closePreloader();
		$(".ticket_reply_rating_block").html(result);
	});
}

function sendImage()
{
	var fd = new FormData();
	fd.append('image', $('#imgFile')[0].files[0]);

	if( $('#imgFile')[0].files[0] != '' )
	{
		$.ajax({
			cache: false,
			type: 'POST',
			url: '/support/show/upload',
			data: fd,
			processData: false,
			contentType: false,
			dataType: 'json',
			success: function(data) {
                if( data.status == 'success' ){
					$("#res_msg").html( 'Файл загружен' ).css( "color", "green" );
					$("#img_name").val( data.data );

                    var url = data.data;
                    var spl = url.split('/');
                    var img = spl[spl.length-1];
                    $("#res_msg").prev('span.file').remove();
                }
				else if( data.status == 'fail' )
                {
                    $("#res_msg").prev('span.file').remove();
                    $("#res_msg").html( data.err ).css( "color", "red" );
                }
			},
			error: function(data) {
				if( typeof data.status !== "undefined" && data.status == 'fail' )
					$("#res_msg").html( data.err ).css( "color", "red" );
			}
		});
	}
}

function openUpload()
{
	$("#imgFile").click();
}

function aticketspage(page){
	openPreloader();
	$.post('/panel/support/tickets',{'page':page,'mod':mod_ticket},function(result){
        closePreloader();
        $("#show_tickets").html(result);
    });
}

function aticketpage(page){
	openPreloader();
	$.post('/panel/support/getmsg',{'page':page,'id':ticket_id},function(result){
        closePreloader();
        $("#tr_head").after(result);
    });
}

function openTicket(id){
	window.location = "/panel/support/open/?id=" + id;
}

