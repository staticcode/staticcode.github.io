!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.createNumberMask=t():e.createNumberMask=t()}(this,function(){return function(e){function t(n){if(o[n])return o[n].exports;var r=o[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}([function(e,t){"use strict";function o(){function e(e){var t=e.length;if(e===u||e[0]===y[0]&&1===t)return y.split(u).concat([v]).concat(h.split(u));var o=e.lastIndexOf(D),c=o!==-1,a=e[0]===f&&I,l=void 0,b=void 0,x=void 0;if(c&&(N||q)?(l=e.slice(0,o),b=e.slice(o+1,t),b=n(b.replace(s,u))):l=e,l=l.replace(s,u),l=g?r(l,j):l,x=n(l),c&&N||q===!0)if(e[o-1]!==D&&x.push(m),x.push(D,m),b)("undefined"==typeof w?"undefined":i(w))===p&&(b=b.slice(0,w)),x=x.concat(b);else if(q===!0)for(var S=0;S<w;S++)x.push(v);return L>0&&(x=y.split(u).concat(x)),a&&(x.length===L&&x.push(v),x=[d].concat(x)),h.length>0&&(x=x.concat(h.split(u))),x}var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],o=t.prefix,y=void 0===o?c:o,b=t.suffix,h=void 0===b?u:b,x=t.includeThousandsSeparator,g=void 0===x||x,S=t.thousandsSeparatorSymbol,j=void 0===S?a:S,M=t.allowDecimal,N=void 0!==M&&M,k=t.decimalSymbol,D=void 0===k?l:k,O=t.decimalLimit,w=void 0===O?2:O,_=t.requireDecimal,q=void 0!==_&&_,B=t.allowNegative,I=void 0!==B&&B,L=y.length;return e.instanceOf="createNumberMask",e}function n(e){return e.split(u).map(function(e){return v.test(e)?v:e})}function r(e,t){return e.replace(/\B(?=(\d{3})+(?!\d))/g,t)}Object.defineProperty(t,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};t["default"]=o;var c="$",u="",a=",",l=".",f="-",d=/-/,s=/\D+/g,p="number",v=/\d/,m="[]"}])});