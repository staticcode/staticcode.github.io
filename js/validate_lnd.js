function checkName(name){
    var name = name || '';
    return (name !== '') ? true : false;
}

function checkEmail(email){
    var email = email || '';
    var re = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,6}$/i;
    return (email !== '' && re.test(email)) ? true : false;
}

function checkSkype(skype){
   var skype = skype || '';
    return (skype !== '') ? true : false;
}

function clearError(){
    $('.general_msg').text('').css('display', 'none');
    var form  = $('form');
    if(form !== ''){
      var fields = form.find('input');
      $.each(fields, function(k, v){
          var nm = v.name;
          var field = form.find("input[name="+ nm +"]");
          field.css('border-color', 'black');
          $('.error_msg').remove();
      });
    }
}

function setErrorMsg(form, status, msg, field){
    var status = status || '';
    var msg    = msg || '';
    var field  = field || '';
    var form   = form || '';

    if(status != '' && form != '' && status == 'failed' && field != ''){
        var field = (field == 'email') ? '_replyto' : field;
        form.find("input[name="+ field +"]").css('border-color', 'red').parent().before('<span class="error_msg">'+msg+'</span>');
    } else if ( msg != '' && form !== '' && status == 'failed' && field == ''){
        form.find('span.general_msg').text(msg).css('display','inline');
    } else {
        form.find('span.general_msg').text('Невозможно зарегестрироваться! Обратитесь в службу поддержки!').css('display','inline');
    }
}

function clearFields(){
  var fields = $('input[type=text], input[type=email]');
  $.each(fields, function(k, v){
      v.value = '';
  });
}