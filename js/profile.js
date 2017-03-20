function sendForm(){
	var period_id = $("#period_id").val();
	$("#extPay").attr('action', '/payment/default/view/period_id/' + period_id);
	document.getElementById("extPay").submit();
}

function unbindSocAcc(soc){

    function onSuccess(result){
    	if( result.status ){
    		document.location.href = '/cabinet/info';
    	}
    }

    $.ajax({
        url: '/ulogin/unbind',
        type: 'POST',
        data: {'soc':soc},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}
function changeImage( src, id )
{
    if( id != '' ){
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/cabinet/info/saveImage',
            data: { 'id': id, 'image': src },
            dataType: 'json',
            success:function( data ){
                if( data.log == 'success')
                {
                    return 'success';
                }else
                {
                    return 'error';
                }
            }
        });
    }

}

function sendMainImage()
{
    var fd = new FormData();
    fd.append('img', $('#imgFile')[0].files[0]);
    
    if( $('#imgFile')[0].files[0] != '' )
    {
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/cabinet/info/upload',
            data: fd,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                if( data.status == 'success' )
                {
                    changeImage( data.data, data.u_id );
                    $( "#res_msg" ).html( 'Файл загружен' ).css( "color", "green" );
                    $( ".plo_img a img" ).attr( "src", data.data ).css({'display':'block'});
                    $( ".attach_image" ).text("Изменить фото")
                    $( "#img_name" ).val( data.data );
                    //document.location.href = "http://newadvancets2/cabinet/info";
                }
                else if( data.status == 'fail' )
                    $("#res_msg").html( data.err ).css( "color", "red" );
            },
            error: function(data) {
                if( typeof data.status !== "undefined" && data.status == 'fail' )
                    $("#res_msg").html( data.err ).css( "color", "red" );
            }
        });
    }
}

function showRulesTn(tn) {

    $(function() {
        if ($("#pBlock").is(":visible")) {
            $('body').css("overflow", "hidden");
        } else {
            $('body').css("overflow", "auto");
        }
    });

    if (tn) {
        $.ajax({
            cache: false,
            type: 'POST',
            url: '/cabinet/info/showrules/id/' + tn,
            dataType: 'html',
            success: function(data) {
                $('#info-container').html(data);
                $('#pBlock').show();
            }
        });
    }
}
