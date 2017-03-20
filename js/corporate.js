function unbindAcc(id){
	if( !confirm( 'Вы действительно хотите отвязать аккаунт?' ) ) return false;

	$.post('/cabinet/info/unbindcorp', {'id':id}, function (result) {
		var answer = $.parseJSON(result);
		if( answer.success === true )
			$('#acc_'+id).remove();
		else
			openNotification('Отвязать аккаунт не удалось');
    });
}

function changePassForm(id){
	$.post('/cabinet/info/changepassform', {'id':id}, function (result) {
		if( result != '' ){
			$("#changePass").html(result);
		}
    });
}

function changePass(id){
	var pass = $("#newpass").val();
	var repeat = $("#passrepeat").val();

	if( pass == '' ){
		openNotification('Ввеюдите новый пароль');
		return false;
	}

	if( pass != repeat ){
		openNotification('Введенные пароли не совпадают');
		return false;
	}

	if( !validatePasswd(pass, repeat) )
		return false;

	$.post('/cabinet/info/changepass', {'id':id,'pass':pass}, function (result) {
		var answer = $.parseJSON(result);

		if( typeof answer.success != 'undefined' && answer.success === true ){
			openNotification('Пароль успешно изменен');
		}else{
			openNotification('Пароль изменить не удалось');
		}

		hidePop();
	});
}

function validatePasswd(old, newp){
    var errSymbol = ["script", "<", ">", ";", "(", ")", "alert", "console", " "];
    var pNum = new RegExp('[0-9]+', 'g'); //числа
    var pUpW = new RegExp('[A-Z]+', 'g'); //верх регистр
    var pDnW = new RegExp('[a-z]+', 'g'); //нижний регистр
    var errorSym = false;

    $.each( errSymbol, function(v, k){
        if(old.indexOf(k) != -1 || newp.indexOf(k) != -1 ){
            errorSym = true;
            return false;
        }
    });
    
    if(errorSym)
        var errMsg = "Введены запрещенные символы";
    else if( newp.length < 6 )
        var errMsg = "Минимальная длина пароля 6 символов";
    else if( null === newp.match(pNum) )
        var errMsg = "Пароль должен содержать цифры";
    else if( null === newp.match(pUpW) )
        var errMsg = "Пароль должен содержать буквы латинского алфавита верхнего регистра";
    else if( null === newp.match(pDnW) )
        var errMsg = "Пароль должен содержать буквы латинского алфавита нижнего регистра";
    
    if( typeof errMsg != 'undefined' ){
        openNotification(errMsg);
        return false;
    }

    //return false;

    return true;
}