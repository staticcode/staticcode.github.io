function regAccList( list_id, tn_id ){
	$.post('/projects/actions/registeracc/list_id/' + list_id + '/tn_id/' + tn_id, {}, function (result) {
		if( result != '' ){
			if( $('#reg-acc-block').length > 0 )
				$('#reg-acc-block').remove();

	        $("#rangeFormBlock").prepend(result);
	        $("#login-form-block").hide();
		}
    });
}

function showtnacc()
{
    $.ajax({
        cache: false,
        type: 'POST',
        url: '/cabinet/info/accounts',
        dataType: 'html',
        success:function(data){
            $("#teazacc").html(data);
        }
    });
}

function registrationAcc(type){
	
	var status = true;
	var email = $("#email").val();
	var tn_id = $('#tmp_tid option:selected').val();
    var link = '/projects/register/account';

	$(".ritem.required").each(function(){
		if( this.value == '' ){
			$(this).addClass('error_teazer');
			status = false;
		}
		else
			$(this).removeClass('error_teazer');

	});

	if( !status ){
		openNotification( "Не все поля заполнены" );
		return false;
	}

	if( !validateEmail(email) ){
		openNotification( "Email не валидный" );
		$("#email").addClass('error_teazer');
		return false;
	}

	if( tn_id == 14 ){
		if( !$('#skype').val() && !$('#icq').val() )
		{	
			$('#skype').addClass('error_teazer');
			$('#icq').addClass('error_teazer');
			openNotification( "Одно из полей Skype или Icq должно быть заполнено" );
			return false;
		}
	}

	function onSuccess(result){
        closePreloaderUn();
		if( typeof result.status != 'undefined' && result.status === false ){
			if( type == 'service' )
				openNotification( result.err );
			else if( typeof result.err != 'undefined' )
				openNotification( result.err );
			else
				openNotification( "Неудалось зарегестрировать аккаунт! Попоробуйте зарегестрироваться еще раз или обратитесь в тех.поддержку" );
		}else if( typeof result.status != 'undefined' && result.status === true ){
			if($('input[name=list_id]').val()!=0)
				document.location.href = "/projects/register/success";
            else
			    document.location.href = "/cabinet/info/succesacc";
		}
	}

    /*if( type == 'service' )
        link = "/projects/register/regclickfrog";*/

    $.ajax({
		url: link,
		type: 'POST',
		data: $("form#regAcc-form").serialize(),
		dataType: 'json',
		success: onSuccess,
		beforeSend: function(){
			//openNotification( "Ожидайте. Происходит попытка создания аккаунта." );
            openPreloaderUn("Ожидайте. Происходит попытка создания аккаунта.");
        },
		cache: false
	});
}



function createAccClickFrog()
{
    function onSuccess(result)
    {
        if(result.status == true) {
            showtnacc();
        }else {
            openNotification("Такой email уже есть в системе Clickfrog");
        }
    }

    $.ajax({
        url: "/projects/register/regclickfrog",
        type: 'POST',
        data: {'uid':1},
        dataType: 'json',
        success: onSuccess,
        beforeSend: function(){
            openNotification( "Ожидайте. Происходит попытка создания аккаунта" );
        },
        cache: false
    });
}

function showLoginBlock(){
	$("#login-form-block").show();
	$('#reg-acc-block').remove();
}

function validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
}

function changeCreateAcc(val){
	var list_id = $("#list_id").val();
	if( list_id != 0 )
		document.location.href = "/projects/register/create/list_id/" + list_id + "/tn/" + val;
	else
		document.location.href = "/projects/register/create/tn/" + val;
}