/* share421.com | 28.05.2014 | (c) Dimox */
(function($) {
	
    $(function() {
        $('div.share421init').each(function(idx) {
            var el = $(this),
                u = el.attr('data-url'),
                t = el.attr('data-title'),
                i = el.attr('data-image'),
                d = el.attr('data-description'),
                f = el.attr('data-path'),
                fn = el.attr('data-icons-file'),
                z = el.attr("data-zero-counter"),
                m1 = el.attr('data-top1'),
                m2 = el.attr('data-top2') * 1,
                m3 = el.attr('data-margin');
            
            if (!u) u = location.href;
            if (!fn) fn = 'icons.png';
            if (!z) z = 0;


            function fb_count(url) {
                var shares;
                $.getJSON('http://graph.facebook.com/?callback=?&ids=' + url, function(data) {
                    shares = data[url].shares || 0;
                    if (shares > 0 || z == 1) el.find('a[data-count="fb"]').after('<span class="share421-counter">' + shares + '</span>')
                })
            }
            fb_count(u);

            function gplus_count(url) {
                if (!window.services) {
                    window.services = {};
                    window.services.gplus = {}
                }
                window.services.gplus.cb = function(number) {
                    window.gplusShares = number
                };
                $.getScript('http://share.yandex.ru/gpp.xml?url=' + url, function() {
                    var shares = window.gplusShares;
                    if (shares > 0 || z == 1) el.find('a[data-count="gplus"]').after('<span class="share421-counter">' + shares + '</span>')
                    /*all += shares;*/
                })
            }
            gplus_count(u);

            function twi_count(url) {
                var shares;
                $.getJSON('http://urls.api.twitter.com/1/urls/count.json?callback=?&url=' + url, function(data) {
                    shares = data.count;
                    if (shares > 0 || z == 1) el.find('a[data-count="twi"]').after('<span class="share421-counter">' + shares + '</span>')
                    /*all = all+shares;*/
                })
            }
            twi_count(u);

            function vk_count(url) {
                $.getScript('http://vk.com/share.php?act=count&index=' + idx + '&url=' + url);
                if (!window.VK) window.VK = {};
                window.VK.Share = {
                    count: function(idx, shares) {
                        if (shares > 0 || z == 1) $('div.share421init').eq(idx).find('a[data-count="vk"]').after('<span class="share421-counter">' + shares + '</span>')
                        /*all += shares;*/
                    }
                }
            }
            vk_count(u);

            function all_count(cnt) {$('.flare-total strong').text(cnt);}
            

            if (!f) {
                function path(name) {
                    var sc = document.getElementsByTagName('script'),
                        sr = new RegExp('^(.*/|)(' + name + ')([#?]|$)');
                    for (var p = 0, scL = sc.length; p < scL; p++) {
                        var m = String(sc[p].src).match(sr);
                        if (m) {
                            if (m[1].match(/^((https?|file)\:\/{2,}|\w:[\/\\])/)) return m[1];
                            if (m[1].indexOf("/") == 0) return m[1];
                            b = document.getElementsByTagName('base');
                            if (b[0] && b[0].href) return b[0].href + m[1];
                            else return document.location.pathname.match(/(.*[\/\\])/)[0] + m[1];
                        }
                    }
                    return null;
                }
                f = path('share421.js');
            }
            if (!t) t = document.title;
            if (!d) {
                var meta = $('meta[name="description"]').attr('content');
                if (meta !== undefined) d = meta;
                else d = '';
            }
            if (!m1) m1 = 150;
            if (!m2) m2 = 20;
            if (!m3) m3 = 0;
            u = encodeURIComponent(u);
            t = encodeURIComponent(t);
            t = t.replace(/\'/g, '%27');
            i = encodeURIComponent(i);
            d = encodeURIComponent(d);
            d = d.replace(/\'/g, '%27');
            var fbQuery = 'u=' + u;
            if (i != 'null' && i != '') fbQuery = 's=100&p[url]=' + u + '&p[title]=' + t + '&p[summary]=' + d + '&p[images][0]=' + i;
            var vkImage = '';
            if (i != 'null' && i != '') vkImage = '&image=' + i;
            var s = new Array('"#" data-count="fb" onclick="window.open(\'http://www.facebook.com/sharer.php?m2w&' + fbQuery + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Facebook"', '"#" data-count="gplus" onclick="window.open(\'https://plus.google.com/share?url=' + u + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться в Google+"', '"#" data-count="twi" onclick="window.open(\'https://twitter.com/intent/tweet?text=' + t + '&url=' + u + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Добавить в Twitter"', '"#" data-count="vk" onclick="window.open(\'http://vk.com/share.php?url=' + u + '&title=' + t + vkImage + '&description=' + d + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Поделиться В Контакте"');
            var l = '';
            for (j = 0; j < s.length; j++) {
                var s421s = '';
                l += '<span class="share421-item" style="display:block;white-space:no-wrap;height:32px;"><a rel="nofollow" style="display:inline-block;vertical-align:top;width:32px;height:32px;margin:0;padding:0;outline:none;background:url(' + f + fn + ') -' + 32 * j + 'px 0 no-repeat" href=' + s[j] + ' target="_blank"></a></span>' + s421s;
            };
            el.html('<span id="share421" style="position:fixed;z-index:9999;margin-left:' + m3 + 'px; top: 100px;"><span class="flare-total first"><strong>21</strong> Flares</span>' + l + '<span class="closeIco"></span></span>' + '<style>.share421-counter{display:inline-block;vertical-align:top;margin-left:9px;position:relative;background:#FFF;color:#666;} .share421-counter{padding:0 8px 0 4px;font:14px/32px Arial,sans-serif; .share421-counter:before{}</style>');
            var p = $('#share421');
            
            var counts = $('#share421 span.share421-item').children('.share421-counter');
            // console.log(counts);
            all_count(0);
            
            function m() {
                var top = $(window).scrollTop();
                if (top + m2 < m1) {
                    p.css({
                        top: m1 - top
                    });
                } else {
                    p.css({
                        top: 100
                    });
                }
            }
            m();
            $(window).scroll(function() {
                m();
            })
        });

        var all = 0;
        setTimeout(function(){
            $.each( $('.share421-counter'), function(){
                all = parseFloat(all) + parseFloat($(this).html());
            });

            $(".flare-total.first").html('<strong>'+all+'</strong> Flares');
        },1000);
    })
})(jQuery);