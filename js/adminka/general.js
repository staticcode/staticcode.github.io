function showDatetime( datetime ){
    var mon = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября','ноября','декабря'];
    var date = new Date( (datetime+'000')*1 );
    date.setDate(date.getDate());
    minutes = date.getMinutes();
    hours = date.getHours();
    hour  = hours > 9 ? hours : '0' + hours;
    min = minutes > 9 ? minutes : '0' + minutes;
    var msg = date.getDate() + " "+ mon[date.getMonth()]+" "+date.getFullYear()+" "+hour+":"+min;
    return msg;
}

function closePopap(){
	$(".popup-win").hide();
	$(".popup-win .popupItem").hide();
}

function getImageByOs( os )
{
    os = os.toLowerCase();
    if( os.indexOf( "windows" ) != -1 )
    {
        return "/images/os/windows.jpg";
    }
    else if( os.indexOf( "linux" ) != -1 )
    {
        return "/images/os/linux.jpg";
    }
    else if( os.indexOf( "safari" ) != -1 || os.indexOf( "macintosh" ) != -1 )
    {
        return "/images/os/mac.jpg";
    }
    else if( os.indexOf( "ios" ) != -1 )
    {
        return "/images/os/ios.png";
    }
    else if( os.indexOf( "android" ) != -1 )
    {
        return "/images/os/android.png";
    }
    else
    {
        return "";
    }
}

function getImageByBrowser( browser )
{
    reg1=/([a-zA-Z]*)/g;
    txt=browser.toLowerCase();
    browser = txt.match( reg1 )[0];
    var o = {};
    o['ie'] = "/images/browsers/ie.jpg";
    o['firefox'] = "/images/browsers/FirefoxLogo.gif";
    o['chrome'] = "/images/browsers/chrome.jpg";
    o['safari'] = "/images/browsers/safarilogo.gif";
    o['opera'] = "/images/browsers/operalogo.gif";
    o['amigo'] = "/images/browsers/amigo.jpg";
    o['yandex'] = "/images/browsers/yandex.jpg";
    if( !o[browser] )
    {
        return "";
    }
    return o[browser];
}