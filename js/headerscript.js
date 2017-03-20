function mess_close()
{
$("#header_message").hide('scale');
$("#header_message").html('');
}
$(document).ready(function() {setTimeout("loadheadmess()", 10000);});

function loadheadmess()
{
    

	function onSuccess( _data )
	{
	
	  $("#header_message").html(_data);
      $("#header_message").show('explode');

    
    }

	function onError( request, textStatus, errorThrown )
	{
				 
	}
if ($("#header_message").html() == ""){
$.ajax({
		url: '/site/headmessage/',		
		dataType: 'html',
		success: onSuccess,
		error: onError,
		cache: false
	});
	
    }
	setTimeout("loadheadmess()", 10000);
}