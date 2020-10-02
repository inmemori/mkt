
var Utils = {
    getUrlParams: function(search) {
        if (!search)
            return {};

        var hashes = search.slice(search.indexOf('?') + 1).split('&');
        var params = {};
        hashes.map(function(hash) {
            var split = hash.split('=');
            var key = split[0];
            var val = split[1];
            params[key] = decodeURIComponent(val);
        });
        return params;
    },
    spreadObject: function(source, target) {
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) target[keys[i]] = source[keys[i]];
        return target;
    },
    generateParamsString: function(params) {
        var str = "";

        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) str = str + '&' + keys[i] + '=' + encodeURI(params[keys[i]]);
        return str;
    }
};

var CookieManager = {
    trackingCookie: 'tracking',
    setCookie: function(cname, cvalue) {
        var chours = 1; //number of hours before expires
        var d = new Date();
        d.setTime(d.getTime() + (chours*60*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
    },
    getCookie: function (cname) {
        var v = document.cookie.match('(^|;) ?' + cname + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    },
    deleteCookie: function(cname) { CookieManager.setCookie(cname, ""); }
};

var TrackingApp = {
    handlePageLinks: function() {
        var tracking = JSON.parse(App.cookie.getCookie(App.cookie.trackingCookie));
    
        var marketingUrl = location.href.match(/(\.inmemori\.com\/.*\/)/g);
        var isMarketing = !! marketingUrl;
        var isContent = location.href.match(/(\.inmemori\.com\/content\/)./g) ? true : false;

        if (isMarketing) {
            var marketingSubDirectory = marketingUrl[0].split('/')[1];

            // all marketing website page beside the home page
            if (marketingSubDirectory) tracking.mkt_source = encodeURI(marketingSubDirectory);

            // will contain the page title if available (content title / testimonials title)
            if ($('.post-title').text()) tracking.mkt_content = encodeURI($('.post-title').text());
            
            // only inside a content, will be the second tag-hash parameter
            if (isContent) {
                var tagHashs = $('body').attr("class").split(/\s+/).filter(function(c) { return c.startsWith('tag-hash-'); });
                tracking.mkt_campaign = tagHashs.length >= 2 ? tagHashs[1].replace('tag-hash-', '') : undefined;
            }
        }
    
        var params = Utils.generateParamsString(tracking);
        $('a[href*="/welcome"]').each(function(i, a) { a.href = a.href + params; });     
    },
    setTracking: function(params) {
        if (!params) {
            params = {};
        }

        var cookieData = CookieManager.getCookie(this.cookieName);
        var pastValues =  cookieData ? JSON.parse(cookieData) : {};
        
        var tracking = Utils.spreadObject(pastValues, {});

        if (!pastValues || !pastValues.subrefferrer) {
            tracking.subrefferrer = document.referrer;
        }

        tracking = Utils.spreadObject(params, tracking);
    
        App.cookie.setCookie(App.cookie.trackingCookie, JSON.stringify(tracking));
    }
};

var App = { 
    init: function() {
        App.query = Utils.getUrlParams();
        App.tracking.setTracking(App.query);
        App.tracking.handlePageLinks();
    },
    cookie: CookieManager,
    query: Utils.getUrlParams(window.location.search),
    tracking: TrackingApp
};

App.init();