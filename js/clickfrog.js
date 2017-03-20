$( document ).ready(function() {
	/*$(".clickfrog").on("click", function(){
	    
	    $.ajax({
	        url: "http://" + window.location.host + "/clickfrog/?check_auth_clickfrog=yes",
	        type: 'GET',
	        dataType : 'JSON',                     
	        success: function (data, textStatus) {

	        	if( data.status == 'success' )
	        	{
	        		$("#clickfrog").attr('href', "http://" + window.location.host + "/clickfrog/auth/?" + data.login + "=" + data.login );
	        		
	        		notification("Через 3 секунды будет открыто окно clickfrog");

					setTimeout( function(){
						$("#dialog").dialog("close");
						document.getElementById("clickfrog").click();
					}, 5000 );
	        	}
	        	else
	        	{
        			notification( data.err );
        			setTimeout( function(){
        				$("#dialog").dialog("close");
        			}, 5000 );
	        	}
	        }
	    });
	});*/

	$("#clickfrog_msg").dialog({
		autoOpen: false,
        /*width: 950,
        height: 300,*/
        show: "fade",
        hide: "fade",
        position: ['right','top']
    });
});

function registration_to_clickfrog()
{
	$.ajax({
        url: location,
        type: 'POST',
        dataType : 'JSON',
        data: {'clickfrog_registration':true},
        success: function (data, textStatus){
        	if( data.status == 'success' )
        	{
        		//$(".clickfrog_integration").html( data.data );
        	}
        	else
        	{
        		/*$("#clickfrog_msg").html('Не удалось создать аккаунт в ClickFrog, обратитесь в службу поддержки');
    			$("#clickfrog_msg").dialog("open");
    			setTimeout( function(){
    				$("#clickfrog_msg").dialog("close");
    			}, 5000 );*/
        	}
        }
    });
}

function clickfrog_acc_bind()
{
	var login = $(".clickfrog_login").val();
	var	password = $(".clickfrog_password").val();

	if( login == '' || password == '' )
	{
		alert( "Не все данные заполненны!" );
		return false;
	}

	var param = {
			'frog_acc_bind': true,
			'login': login,
			'password': password
	};

	$.ajax({
        url: location,
        type: 'POST',
        dataType : 'JSON',
        data: param,
        success: function (data, textStatus){
        	if( data.status == 'success' )
        	{
        		$(".clickfrog_integration").html( data.data );
        	}
        	else
        	{
        		$("#clickfrog_msg").html('Не удалось добавить аккаунт, обратитесь в службу поддержки');
    			$("#clickfrog_msg").dialog("open");
    			setTimeout( function(){
    				$("#clickfrog_msg").dialog("close");
    			}, 5000 );
        	}
        }
    });

    return false;
}