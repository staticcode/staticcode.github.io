var tarifUrl = '/payment/default/index';
function selTypeAcc(type, user, action){
  var uid = $('#extcorp').val();

  var urlParams = ( typeof action != 'undefined' && action !== false ? '/action/' + action : '' ) + ( typeof uid != 'undefined' && uid !== false ? '/user/' + uid : '' );

    /*console.log(type);*/
  if( type == 'free' && typeof user != 'undefined' && user == 0 )
    document.location.href = '/site/register?type=free';
  else if( type != 'free' ){
    var period = $("." + type + " option:selected").val();
    /*console.log('/payment/default/view/period_id/' + period + urlParams);*/
    document.location.href = '/payment/default/view/period_id/' + period + urlParams;
  }
}

function promo_validator(action){
  var email = $("#email").val();
  var promo = $("#promo").val();
  var period_id = $('input[name=period_id]').val();

  if( email == '' || !checkEmailValid( email ) ){
    alert("Введите email!");
    //$("#promo").val('');
    return false;
  }

  if( typeof action != 'undefined' && action !== false && action != 'payblock' )
    checkEmailExists(email, action);

  if( typeof promo == 'undefined' || promo == '' ){
    $('.promo-result').html( '<span class="promo-fail">Введите промо-код</span>' );
    return false;
  }

  function onSuccess(result){
    if (typeof result.status != "undefined" &&
      result.status == 'fail' &&
      typeof result.msg != "undefined") {
      openNotification(result.msg);
      $('.promo-result').html('');
      return false;
    }
    var pay_curr = $(".pay-currency.checked").length > 0 ?  $(".pay-currency.checked")[0].id : false;
    var pay_bank = $(".bankingItem.checked").length > 0 ? $(".bankingItem.checked")[0].id : false;

    if( typeof result.status != "undefined" && result.status == 'success' && result.promo === true ){
      pay_amount = result.payment;

      var discountStr = '';

      if( typeof result.pdesc != 'undefined' && result.pdesc != '' ){
        if( result.descount > 0 )
          discountStr = "Скидка - " + result.descount + '% (' + result.pdesc + ')';
        else
          discountStr = result.pdesc;
      }else if( typeof result.day_add != 'undefined' && result.day_add > 0 ){
        if( result.descount > 0 )
          discountStr = "Скидка - " + result.descount + '% (+ ' + result.day_add + ' дней бесплатно)';
        else
          discountStr = '+ ' + result.day_add + ' дней бесплатно';
      }else{
        discountStr = "Скидка - " + result.descount + '%';
      }

      $('.promo-result').html( '<span class="promo-success">' + discountStr + '</span>' );

      $.each( $(".sys-pay label"), function(i, elm){
                if(Boolean(  $(elm).find('div').eq(0).hasClass('checked') )){
                    $(elm).trigger( "click" );
                }
            });
    }else{
      pay_amount = result.payment;
            $('.promo-result').html( '<span class="promo-fail">Введите действительный промо-код</span>' );

            $.each( $(".sys-pay label"), function(i, elm){
                if(Boolean(  $(elm).find('div').eq(0).hasClass('checked') )){
                    $(elm).trigger( "click" );
                }
            });
    }

    if( pay_curr !== false )
      $("#" + pay_curr).trigger( "click" );

    if( pay_bank !== false )
          $("#" + pay_bank).trigger( "click" );
  }

  var postData = {
    'promo':promo,
    'email':email,
    'period':period_id,
    'action':action
  };

  $.ajax({
    url: '/payment/default/promoval',
    type: 'POST',
    data: postData,
    beforeSend: function(){
      $('.promo-result').html( '<img src="/images/loading.gif" style="width:30px;">' );
    },
    dataType: 'json',
    success: onSuccess,
    cache: false
  });
}

function checkEmailExists(email, action){
  $.post('/payment/default/checkemail',{'email':email,'action':action},function(result){
    var answer = $.parseJSON(result);

    if( typeof answer.success != 'undefined' ){
      if( answer.success ){
        $('.reg-block-row-but input').removeAttr('disabled');
        $("#email").parent().removeClass("error_box");
      }else{
        $("#email").parent().addClass("error_box");
        $("#email").val('');
        $('.reg-block-row-but input').attr('disabled', 'disabled');
        openNotification(answer.msg);
        console.log(answer.msg);
      }
    }
  });
}

function selectPaySystem(sysm){
  var cur_sys = pay_amount[sysm];
  var incb = new Array();

  $(".currency-block").html('');

  for( i in cur_sys ){
    if( typeof currency != 'undefined' ){
      incb.push('<label><input id="' + i + '_cur" class="pay-currency" onclick="selectCurrency('+"'" + i +"','"+ sysm + "'" + ');" type="radio" name="currency" value="' + i + '"/>' + currency[i]['val'] + '</label>');
    }
  }

  $(".currency-block").html(incb.join(''));

  $('.pay-currency').styler();

  $(".currency-block .jq-radio").on('click', function(){
        if( $(this).hasClass( 'checked' ) )
        {
          var curr = this.id.replace('_cur-styler', '');
            selectCurrency( curr, sysm );
        }
    });

  if( incb.length > 1 )
    $(".currency-m-b").css("display","block");
  else
    $(".currency-m-b").css("display","none");


  if( typeof show_phone[sysm] != 'undefined' && show_phone[sysm] == true )
    $('.reg-block-row.phone').css("display", "block");
  else
    $('.reg-block-row.phone').css("display", "none");

  $(".currency-block label:first input").trigger( "click" );
}

function selectCurrency( cur_val, cur_sys ){

  if( cur_sys == 'cm' && typeof card_bank[cur_val] != 'undefined' ){
    var incb = new Array();
    for( i in card_bank[cur_val] ){
      if( typeof card_bank[cur_val][i] != 'undefined' ){
        incb.push('<label><input id="' + i + '_bank" class="bankingItem" '+ ( incb.length == 0 ? 'checked="checked"' : '' ) +' type="radio" name="bank" value="' + i + '"/>' + card_bank[cur_val][i] + '</label>');
      }
    }
    $("#banking").html(incb.join(''));

    $('.bankingItem').styler();

    $(".banking-block").show();
  }
  else
    $(".banking-block").hide();

  /*console.log(cur_sys);
  console.log(cur_val);*/

  $(".itogo_pay").html( pay_amount[cur_sys][cur_val] + ' ' + currency[cur_val]['val'] );
}

function refreshCost(select, tarif) {
  var month = $(select).find('option:selected').data('month');

  $("#discount_" + tarif).removeClass().text('').hide();
  if (typeof period_discount[tarif] != 'undefined' && typeof period_discount[tarif][month] != 'undefined' && typeof period_price[tarif] != "undefined" && typeof period_price[tarif][month] != "undefined") {
    //var price_discount = getOldPriceByDiscount(period_discount[tarif][month], period_price[tarif][month]);
    var price_discount = getOldPriceByDiscount(period_price[tarif], month);

    if (false === price_discount || month == 1) {
      $("#old_price_" + tarif).html('').hide();
    } else {
      $("#discount_" + tarif).addClass('discount').text('-' + period_discount[tarif][month] + '%').show();
      $("#old_price_" + tarif).html('$<span>' + price_discount + '</span>').show();
    }
  } else {
    $("#discount_" + tarif).removeClass();
    $("#old_price_" + tarif).html('').hide();
  }

  if (typeof limTarif[tarif] != 'undefined') {
    if (limTarif[tarif] === false || limTarif[tarif] < month) {
      $('.tarifButton.tarif_' + tarif).removeAttr('onclick').addClass('notActive');
    } else {
      $('.tarifButton.tarif_' + tarif).removeClass('notActive');
    }
  }

  if (typeof period_price[tarif][month] != "undefined") {
    $(".price_" + tarif).html("<span>$</span>" + period_price[tarif][month]);
  }
}

function getOldPriceByDiscount(price_list, month){
  return Math.round(price_list[1] * month);
}

/*function getOldPriceByDiscount(discount, price){
  if( discount == 0 ) return false;
  var dscp = 100 - discount;
  //return Math.round( 100 * price / dscp );
  return Math.ceil( 100 * price / dscp );
}*/

function go_to_pay(action){

  setTimeout(function(){
    var email = $("#email").val();
    var currency = $(".pay-currency:checked").val();
    var pay_sys = $( "input[name='paymethod']:checked" ).val();
    var bank = $("input[name=bank]:checked").val();
    var phone = '';
    var promo = $('#promo').val();
    var period_id = $('input[name=period_id]').val();
    var tarif_id = $('input[name=tarif_id]').val();
    var price = $('input[name=price]').val();


    if( email == '' ){
      openNotification( "Введите email!" );
      return false;
    }

    if( !checkEmailValid( email ) ) return false;


    if( typeof show_phone[pay_sys] != 'undefined' && show_phone[pay_sys] == true ){
      //var code = $("input[name=__phone_prefix]").val();
      var code = phoneCode;
      phone = $("#phone").val();
      phone = '+' + code + '' + phone;

      if( phone == '' ){
        alert( "Введите номер телефона!" );
        return false;
      }
    }

    if( $("input[type=button].green_button").hasClass('grey_btn') ){
      if( action !== false && action == 'payblock' )
        openNotification('Оплатить тариф Вы можете только через корпоративный аккаунт.');
      else
        openNotification( "Ожидайте, происходит подготовка запроса" );
      return false;
    }
    else
      openNotification( "Ожидайте, происходит подготовка запроса" );

    $("input[type=button].green_button").addClass('grey_btn');

      if( pay_sys == 'ym' )
      {
        if( action !== false && action == 'payblock' )
          openNotification('Оплатить тариф Вы можете только через корпоративный аккаунт.');
        else
          document.location.href = '/payment/default/prepsend/?email='+email+'&currency='+currency+'&pay_sys='+pay_sys+'&phone='+phone + '&period_id='+period_id+'&tarif_id='+tarif_id+'&price='+price+( action != false ? '&action=' + action : '' )+'&corporate='+corporate;
      }
      else
      {
                if( action !== false && action == 'payblock' )
          openNotification('Оплатить тариф Вы можете только через корпоративный аккаунт.');
        else
        {
          var postData = {
            'email':email,
            'currency':currency,
            'pay_sys':pay_sys,
            'phone':phone,
            'bank':bank,
            'period_id':period_id,
            'tarif_id':tarif_id,
            'price':price,
            'action':action,
            'corporate':corporate,
          };

          $.post('/payment/default/prepsend', postData, function(result){
            if( result != '' )
              $( "#go_content" ).html( result );
          });
        }
      }
  }, 500);
}

function get_tarif(data){
  $.post(tarifUrl, {'partial':true, 'data':data},function(result){
    if( result != '' ) $( "#tarif_block" ).html( result );
  });
}

function showMe(mode){
   var vis = (mode) ? "block" : "none";
   document.getElementById('div1').style.display = vis;
}

function checkEmailValid( email ){
  if( validateEmail( email ) ){
    $("#email").parent().removeClass("error_box");
    return true;
  }else{
    $("#email").parent().addClass("error_box");
    return false;
  }
}

function validateEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
}


function unbindSocAccAdmin(soc){

    function onSuccess(result){
      if( result.status ){

        document.location.href = '/panel/profile/'+getUserId();
      }
    }

    $.ajax({
        url: '/ulogin/unbind',
        type: 'POST',
        data: {'soc':soc, 'uid':getUserId()},
        dataType: 'json',
        success: onSuccess,
        cache: false
    });
}

