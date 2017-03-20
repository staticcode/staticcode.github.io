function recoveryPass(e){

  var evt = e || window.event
  evt.preventDefault();
  var $form = $('.recovery-password__form');
  var email = $("#recovery_email").val();
  if( email == '' ){
    var text = "Введите E-mail";
    openNotification(text);
    return false;
  }

  if( !validateEmail(email) ){
    var text = "E-mail не валилдный";
    openNotification(text);
    return false;
  }

  $form.addClass('__data-fetching')



  function onSuccess(result){
    if( typeof result.status != 'undefined' && result.status == 'success' ){

      $('.mail-recovery').text(result.mail);
      $(".recovery-password__success-message").removeClass('__hide');
      $form.addClass('__hide')
      // $(".login-block").hide();
    }else if( typeof result.status != 'undefined' && result.status == 'fail' ){
      openNotification(result.msg);
    }
  }

  $.ajax({
    url: '/site/recovery',
    type: 'POST',
    data: {'email': email},
    dataType: 'json',
    success: onSuccess,
    cache: false
  });
}

function validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkEmailValid(email){
  console.log(email);
  if(validateEmail(email)){
    $("#recovery_email").removeClass("error_box");
    return true;
  }else{
    $("#recovery_email").addClass("error_box");
    return false;
  }
}

function checkvalid(id){
  var email = $("#Users_email").val();

  if( email == '' || !validateEmail( email ) ){
    $("#Users_email").addClass('error_input');
  }else{
    $("#Users_email").removeClass('error_input');
  }

  if( !$("#Users_email").hasClass('error_input') ){
        document.getElementById(id).submit();
  }
}

function checkv_cap(id){
  var email = $("#Users_email").val();

  if( email == '' || !validateEmail( email ) )
    $("#Users_email").addClass('error_input');
  else
  {
    $("#Users_email").removeClass('error_input');

    function onSuccess(result){
      if( typeof result.log !== undefined && result.log !== '' ){
        $('.cap-err').css('display', 'none');
        if( result.log == 'true' )
          $('.cap-err').css('display', 'block');
        else{
          document.getElementById(id).submit();
        }
      }
    }

    $.ajax({
      url: '/site/checkuser',
      type: 'POST',
      data: {'email':email},
      dataType: 'json',
      success: onSuccess,
      cache: false
    });
  }
}

function checkSkypeIcq(e){
    if( e.value.indexOf('@') != -1 ){
        $(e).val('');
    }
}