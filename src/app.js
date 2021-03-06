// # Dependencies:
// - window.$        [https://code.jquery.com/jquery-1.11.3.min.js]
// - window.Cookies  [https://github.com/js-cookie/js-cookie]

$.extend($, {
  getUrlParams: function(key, url) {
    var params = {}
    url = (url || window.location.search).split('?')[1] || ''
    url.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) { params[decodeURIComponent(key)] = decodeURIComponent(value) })
    return key ? params[key] : params
  },
  buildUrl: function(url, params) {
    url += url.indexOf("?") === -1 ? "?" : "&"
    return url + $.param(params)
  },
  buildLinks: function(pattern, params) {
    var links = $('a[href*="'+pattern+'"]')
    links.each(function(i, a) { a.href = $.buildUrl(a.href, params) })
  }
})

window.App = {
  query: $.getUrlParams(),
  tracking: {},
  mkts: {}
}

App.init = function() {
  App.setTracking(App.query)
  App.setMkts()
  $.buildLinks('/welcome', $.extend({}, App.tracking, App.mkts))
}

App.setTracking = function(data) {
  var tracking = $.extend({}, JSON.parse(Cookies.get('im_mkt_tracking') || '{}'), data)
  if (!tracking.subreferer && document.referrer && document.referrer.match(/([a-z]{2}\.inmemori\.com)/gm) == null) tracking.subreferer = document.referrer
  Cookies.set('im_mkt_tracking', JSON.stringify(tracking), { expires: 1, path: '/', domain: 'inmemori.com' })
  App.tracking = tracking
}

App.setMkts = function(data) {
  if(data) App.mkts = data
  else {
    data = {}
    var subdir = location.pathname.split('/')[1]

    if(subdir) data.mkt_source = subdir

    // will contain the page title if available (content title / testimonials title)
    if($('.post-title').text()) data.mkt_content = $('.post-title').text()

    if(subdir == 'content') {
      var tagHashs = $('body').attr("class").split(/\s+/).filter(function(c) { return c.startsWith('tag-hash-') })
      if(tagHashs.length >= 2) data.mkt_campaign = tagHashs[1].replace('tag-hash-', '')
    }

    App.mkts = data
  }
}

$(function() {
  App.init()
})
