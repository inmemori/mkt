$.extend($,{getUrlParams:function(a,b){var c={};return b=(b||window.location.search).split("?")[1]||"",b.replace(/([^=&]+)=([^&]*)/g,function(a,b,d){c[decodeURIComponent(b)]=decodeURIComponent(d)}),a?c[a]:c},buildUrl:function(a,b){return a+=-1===a.indexOf("?")?"?":"&",a+$.param(b)},buildLinks:function(a,b){var c=$("a[href*=\""+a+"\"]");c.each(function(c,d){d.href=$.buildUrl(d.href,b)})}}),window.App={query:$.getUrlParams(),tracking:{},mkts:{}},App.init=function(){App.setTracking(App.query),App.setMkts(),$.buildLinks("/welcome",$.extend({},App.tracking,App.mkts))},App.setTracking=function(a){var b=$.extend({},JSON.parse(Cookies.get("im_mkt_tracking")||"{}"),a);!b.subreferer&&document.referrer&&null==document.referrer.match(/([a-z]{2}\.inmemori\.com)/gm)&&(b.subreferer=document.referrer),Cookies.set("im_mkt_tracking",JSON.stringify(b),{expires:1,path:"/",domain:"inmemori.com"}),App.tracking=b},App.setMkts=function(a){if(a)App.mkts=a;else{a={};var b=location.pathname.split("/")[1];if(b&&(a.mkt_source=b),$(".post-title").text()&&(a.mkt_content=$(".post-title").text()),"content"==b){var c=$("body").attr("class").split(/\s+/).filter(function(a){return a.startsWith("tag-hash-")});2<=c.length&&(a.mkt_campaign=c[1].replace("tag-hash-",""))}App.mkts=a}},$(function(){App.init()});