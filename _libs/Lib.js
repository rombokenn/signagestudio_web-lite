/**
 Lib is a general library of additional utilities and helper commands used in StudioLite
 @class Lib
 @constructor
 @return {Object} instantiated Lib
 **/
define(['jquery', 'backbone'], function ($, Backbone) {
    var Lib = function (type) {
        this.type = type;
    };

    _.extend(Lib.prototype, {

        /**
         Output formatted string to console and omit error on old browsers
         @method log
         @param {String} msg
         **/
        log: function (msg) {
            if (!$.browser == undefined && $.browser.msie && $.browser.version <= 8) {
                if (globs['debug']) {
                    console = {};
                    console.log = function (m) {
                        alert('msg:' + m)
                    };
                } else {
                    console = {};
                    console.log = function () {
                    };
                }
            }
            console.log(new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ': ' + msg);

        },

        /**
         Add the now deprecated Backbone > View > Options so we can pass as args to new views
         @method addBackboneViewOptions
         **/
        addBackboneViewOptions: function () {
            Backbone.View = (function (View) {
                return View.extend({
                    constructor: function (options) {
                        this.options = options || {};
                        View.apply(this, arguments);
                    }
                });
            })(Backbone.View);
        },

        /**
         Prompt on application exit
         @method promptOnExit
         **/
        promptOnExit: function () {
            if (window.location.href.indexOf('dist') > -1) {
                $(window).on('beforeunload', function () {
                    return 'Did you save your work?'
                });
            }

        },

        /**
         Load non primary CSS
         @method loadCss
         @param {String} i_url
         **/
        loadCss: function (i_url) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = i_url;
            document.getElementsByTagName("head")[0].appendChild(link);
        },

        /**
         Force browser compatability
         @method foreceBrowserCompatability
         **/
        forceBrowserCompatability: function () {



            $.getJSON('https://galaxy.signage.me/WebService/getBrowserInfo.ashx?a=2&callback=?',
                function (data) {

                    //alert(data.version + ' ' + data.platform + ' ' + data.type + ' ' + data.name);

                    // animated loader
                    if (data.name.toLowerCase() == 'ie') {
                        $(Elements.WAITS_SCREEN_ENTRY_APP).find('img').eq(1).remove();
                    } else {
                        $(Elements.WAITS_SCREEN_ENTRY_APP).find('img').eq(0).remove();
                    }

                    var failLevel = 0;
                    require(['bootbox'], function (bootbox) {
                        if (data.name.toLowerCase() == 'safari' && data.platform.toLowerCase() == 'winnt')
                            failLevel = 2;
                        if (data.name.toLowerCase() == 'ie' && parseInt(data.version) < 10)
                            failLevel = 1;

                        switch (failLevel) {
                            case 0:
                            {
                                break
                            }
                            case 1:
                            {
                                bootbox.dialog({
                                    message: $(Elements.MSG_BOOTBOX_OLD_BROWSER).text(),
                                    buttons: {
                                        danger: {
                                            label: $(Elements.MSG_BOOTBOX_OK).text(),
                                            className: "btn-danger",
                                            callback: function () {
                                            }
                                        }
                                    }
                                });
                                break
                            }
                            case 2:
                            {
                                bootbox.dialog({
                                    message: $(Elements.MSG_BOOTBOX_OLD_BROWSER).text(),
                                    buttons: {
                                        danger: {
                                            label: $(Elements.MSG_BOOTBOX_OK).text(),
                                            className: "btn-danger",
                                            callback: function () {
                                                $('body').empty();
                                                // window.location.replace("http://www.digitalsignage.com");
                                            }
                                        }
                                    }
                                });
                                break
                            }
                        }
                    });
                }
            );
        },

        /**
         Validate email address format using regexp
         @method validateEmail
         @param {String} emailAddress
         @return {Boolean}
         **/
        validateEmail: function (emailAddress) {
            var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
            var valid = emailRegex.test(emailAddress);
            if (!valid) {
                return false;
            } else {
                return true;
            }
        },

        /**
         Set user agent / browser version
         @method initUserAgent
         **/
        initUserAgent: function () {

            var ua = navigator.userAgent.toLowerCase(),
                match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                    /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                    /(msie) ([\w.]+)/.exec(ua) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [],
                browser = match[1] || "",
                version = match[2] || "0";

            $.browser = {};
            $.browser.type = '';

            if (browser) {
                $.browser[browser] = true;
                $.browser.version = version;
            }

            // Chrome is Webkit, but Webkit is also Safari.
            if (jQuery.browser.chrome) {
                jQuery.browser.webkit = true;
            } else if (jQuery.browser.webkit) {
                jQuery.browser.safari = true;
            }

            if (!(window.mozInnerScreenX == null)) {
                $.browser.type = 'FF';
                return;
            }

            if ($.browser.msie) {
                $.browser.type = 'IE';
            }

            if (/Android/i.test(navigator.userAgent)) {
                $.browser.type = 'ANDROID';
            }

            if (/webOS/i.test(navigator.userAgent)) {
                $.browser.type = 'WEBOS';
            }

            if (/iPhone/i.test(navigator.userAgent)) {
                $.browser.type = 'IPHONE';
            }

            if (/iPad/i.test(navigator.userAgent)) {
                $.browser.type = 'IPAD';
            }

            if (/iPod/i.test(navigator.userAgent)) {
                $.browser.type = 'IPOD';
            }

            if (/BlackBerry/i.test(navigator.userAgent)) {
                $.browser.type = 'BLACKBARRY';
            }

            if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                $.browser.type = 'SAFARI';
                return;
            }
        },

        /**
         Simplify a string to basic character set
         @method cleanChar
         @param {String} value
         @return {String} cleaned string
         **/
        cleanChar: function (value) {
            if (value == null)
                value = '';
            if ($.isNumeric(value))
                return value;
            value = value.replace(/,/g, ' ');
            value = value.replace(/\\}/g, ' ');
            value = value.replace(/{/g, ' ');
            value = value.replace(/"/g, ' ');
            value = value.replace(/'/g, ' ');
            value = value.replace(/&/g, 'and');
            value = value.replace(/>/g, ' ');
            value = value.replace(/</g, ' ');
            value = value.replace(/\[/g, ' ');
            value = value.replace(/]/g, ' ');
            return value;
        },

        unclass: function (value) {
            return value.replace(/\./g, '');
        },

        unhash: function (value) {
            return value.replace(/\#/g, '');
        },


        /**
         Get DOM comment string
         @method getComment
         @param {String} str
         @return {String} string of comment if retrieved
         **/
        getComment: function (str) {
            var content = jQuery('body').html();
            var search = '<!-- ' + str + '.*?-->';
            var re = new RegExp(search, 'g');
            var data = content.match(re);
            var myRegexp = /<!-- (.*?) -->/g;
            var match = myRegexp.exec(data);
            if (match == null) {
                return undefined
            } else {
                return match[1];
            }
        },

        /**
         Convert an XML data format to a DOM enabled data structure
         @method parseXml
         @param {XML} xml data to parse
         @return {Object} xml data structure
         **/
        parseXml: function (xml) {
            var dom = null;
            if (window.DOMParser) {
                try {
                    dom = (new DOMParser()).parseFromString(xml, "text/xml");
                }
                catch (e) {
                    dom = null;
                }
            }
            else if (window.ActiveXObject) {
                try {
                    dom = new ActiveXObject('Microsoft.XMLDOM');
                    dom.async = false;
                    if (!dom.loadXML(xml)) // parse error ..

                        window.alert('alt ' + dom.parseError.reason + dom.parseError.srcText);
                }
                catch (e) {
                    dom = null;
                }
            }
            else
                alert("cannot parse xml string!");
            return dom;
        },

        /**
         Convert an XML data format to json
         @method xml2json
         @param {XML} xml
         @param {Object} internal
         @return {Object} json data structure
         **/
        xml2json: function (xml, tab) {
            // http://goessner.net/download/prj/jsonxml/
            var X = {
                toObj: function (xml) {
                    var o = {};
                    if (xml.nodeType == 1) {   // element node ..
                        if (xml.attributes.length)   // element with attributes  ..
                            for (var i = 0; i < xml.attributes.length; i++)
                                o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                        if (xml.firstChild) { // element has child nodes ..
                            var textChild = 0, cdataChild = 0, hasElementChild = false;
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 1) hasElementChild = true;
                                else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                                else if (n.nodeType == 4) cdataChild++; // cdata section node
                            }
                            if (hasElementChild) {
                                if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                                    X.removeWhite(xml);
                                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                                        if (n.nodeType == 3)  // text node
                                            o["#text"] = X.escape(n.nodeValue);
                                        else if (n.nodeType == 4)  // cdata node
                                            o["#cdata"] = X.escape(n.nodeValue);
                                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                                            if (o[n.nodeName] instanceof Array)
                                                o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                            else
                                                o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                        }
                                        else  // first occurence of element..
                                            o[n.nodeName] = X.toObj(n);
                                    }
                                }
                                else { // mixed content
                                    if (!xml.attributes.length)
                                        o = X.escape(X.innerXml(xml));
                                    else
                                        o["#text"] = X.escape(X.innerXml(xml));
                                }
                            }
                            else if (textChild) { // pure text
                                if (!xml.attributes.length)
                                    o = X.escape(X.innerXml(xml));
                                else
                                    o["#text"] = X.escape(X.innerXml(xml));
                            }
                            else if (cdataChild) { // cdata
                                if (cdataChild > 1)
                                    o = X.escape(X.innerXml(xml));
                                else
                                    for (var n = xml.firstChild; n; n = n.nextSibling)
                                        o["#cdata"] = X.escape(n.nodeValue);
                            }
                        }
                        if (!xml.attributes.length && !xml.firstChild) o = null;
                    }
                    else if (xml.nodeType == 9) { // document.node
                        o = X.toObj(xml.documentElement);
                    }
                    else
                        alert("unhandled node type: " + xml.nodeType);
                    return o;
                },
                toJson: function (o, name, ind) {
                    var json = name ? ("\"" + name + "\"") : "";
                    if (o instanceof Array) {
                        for (var i = 0, n = o.length; i < n; i++)
                            o[i] = X.toJson(o[i], "", ind + "\t");
                        json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
                    }
                    else if (o == null)
                        json += (name && ":") + "null";
                    else if (typeof(o) == "object") {
                        var arr = [];
                        for (var m in o)
                            arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                        json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
                    }
                    else if (typeof(o) == "string")
                        json += (name && ":") + "\"" + o.toString() + "\"";
                    else
                        json += (name && ":") + o.toString();
                    return json;
                },
                innerXml: function (node) {
                    var s = ""
                    if ("innerHTML" in node)
                        s = node.innerHTML;
                    else {
                        var asXml = function (n) {
                            var s = "";
                            if (n.nodeType == 1) {
                                s += "<" + n.nodeName;
                                for (var i = 0; i < n.attributes.length; i++)
                                    s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                                if (n.firstChild) {
                                    s += ">";
                                    for (var c = n.firstChild; c; c = c.nextSibling)
                                        s += asXml(c);
                                    s += "</" + n.nodeName + ">";
                                }
                                else
                                    s += "/>";
                            }
                            else if (n.nodeType == 3)
                                s += n.nodeValue;
                            else if (n.nodeType == 4)
                                s += "<![CDATA[" + n.nodeValue + "]]>";
                            return s;
                        };
                        for (var c = node.firstChild; c; c = c.nextSibling)
                            s += asXml(c);
                    }
                    return s;
                },
                escape: function (txt) {
                    return txt.replace(/[\\]/g, "\\\\")
                        .replace(/[\"]/g, '\\"')
                        .replace(/[\n]/g, '\\n')
                        .replace(/[\r]/g, '\\r');
                },
                removeWhite: function (e) {
                    e.normalize();
                    for (var n = e.firstChild; n;) {
                        if (n.nodeType == 3) {  // text node
                            if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                                var nxt = n.nextSibling;
                                e.removeChild(n);
                                n = nxt;
                            }
                            else
                                n = n.nextSibling;
                        }
                        else if (n.nodeType == 1) {  // element node
                            X.removeWhite(n);
                            n = n.nextSibling;
                        }
                        else                      // any other node
                            n = n.nextSibling;
                    }
                    return e;
                }
            };
            if (xml.nodeType == 9) // document node
                xml = xml.documentElement;
            var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
            return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
        },

        /**
         Convert a json data format to xml
         @method xml2json
         @param {JSON} o
         @param {Object} internal
         @return {Object} xml data structure
         **/
        json2xml: function (o, tab) {
            var toXml = function (v, name, ind) {
                var xml = "";
                if (v instanceof Array) {
                    for (var i = 0, n = v.length; i < n; i++)
                        xml += ind + toXml(v[i], name, ind + "\t") + "\n";
                }
                else if (typeof(v) == "object") {
                    var hasChild = false;
                    xml += ind + "<" + name;
                    for (var m in v) {
                        if (m.charAt(0) == "@")
                            xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                        else
                            hasChild = true;
                    }
                    xml += hasChild ? ">" : "/>";
                    if (hasChild) {
                        for (var m in v) {
                            if (m == "#text")
                                xml += v[m];
                            else if (m == "#cdata")
                                xml += "<![CDATA[" + v[m] + "]]>";
                            else if (m.charAt(0) != "@")
                                xml += toXml(v[m], m, ind + "\t");
                        }
                        xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
                    }
                }
                else {
                    xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
                }
                return xml;
            }, xml = "";
            for (var m in o)
                xml += toXml(o[m], m, "");
            return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
        },

        /**
         Convert number or string to float with double precision
         @method parseToFloatDouble
         @param {Object} i_value
         @return {Number}
         **/
        parseToFloatDouble: function (i_value) {
            return parseFloat(parseFloat(i_value).toFixed(2));
        },

        /**
         Returns the total unique members of an array
         @method uniqueArray
         @param {Array} i_array
         @return {Number} total unique members
         **/
        uniqueArraySize: function (i_array) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            var a = i_array.filter(onlyUnique);
            return a.length;
        },

        /**
         Check if a remote file exists
         @method remoteFileExits
         @param {String} url
         @return {Boolean}
         **/
        remoteFileExits: function (url) {
            if (url) {
                var req = new XMLHttpRequest();
                req.open('GET', url, false);
                req.send();
                return req.status == 200;
            } else {
                return false;
            }
        },

        /**
         Get specific param name from URL
         @method function
         @param {String} i_name
         @return {String}
         **/
        getURLParameter: function (i_name) {
            return decodeURIComponent(
                (location.search.match(RegExp("[?|&]" + i_name + '=(.+?)(&|$)')) || [, null])[1]
            );
        },

        /**
         Returns Epoch base time
         @method getEpochTime
         @return {Number}
         **/
        getEpochTime: function () {
            var d = new Date();
            var n = d.getTime();
            return n;
        },

        /**
         Decimal to hex converter
         @method decimalToHex
         @param {Number} d
         @return {String} hex
         **/
        decimalToHex: function (d) {
            var hex = Number(d).toString(16);
            hex = "000000".substr(0, 6 - hex.length) + hex;
            return hex;
        },

        /**
         Hex to decimal converter
         @method hexToDecimal
         @param {String} h
         @return {Number} decimal
         **/
        hexToDecimal: function (h) {
            var h = h.replace(/#/gi, '');
            return parseInt(h, 16);
        },

        /**
         RGB color to hex converter
         @method rgbToHex
         @param {Number} rgb
         @return {String} hex
         **/
        rgbToHex: function (rgb) {
            function componentFromStr(numStr, percent) {
                var num = Math.max(0, parseInt(numStr, 10));
                return percent ?
                    Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
            }

            var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
            var result, r, g, b, hex = "";
            if ((result = rgbRegex.exec(rgb))) {
                r = componentFromStr(result[1], result[2]);
                g = componentFromStr(result[3], result[4]);
                b = componentFromStr(result[5], result[6]);
                hex = (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }
            return hex;
        },

        /**
         Smart convert color (many) to decinal
         @method colorToDecimal
         @param {String} color
         @return {Number} decimal
         **/
        colorToDecimal: function (color) {
            if (color.match('rgb')) {
                color = this.rgbToHex(color);
                return this.hexToDecimal(color)
            }
            return this.hexToDecimal(color);
        },

        /**
         Smart convert color (many) to hex
         @method colorToHex
         @param {String} color
         @return {String} hex
         **/
        colorToHex: function (color) {
            if (color.match('#')) {
                return color;
            }
            if (color.match('rgb')) {
                return '#' + this.rgbToHex(color);
            }
            return '#' + color;
        },

        /**
         Capitilize first letter
         @method capitaliseFirst
         @param {String} string
         @return {String} string
         **/
        capitaliseFirst: function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        },

        /**
         Run a function n number of times with sleep in between
         @method setIntervalTimes
         @param {Function} i_func
         @param {Number} i_sleep
         @param {Number} i_timesRun
         **/
        setIntervalTimes: function (i_func, i_sleep, i_timesRun) {
            var timesRun = 0;
            var interval = setInterval(function () {
                timesRun += 1;
                if (timesRun === i_timesRun) {
                    clearInterval(interval);
                }
                i_func();
            }, i_sleep);
        },


        /**
         Returns this model's attributes as...
         @method padZeros
         @param {Number} n value
         @param {Number} width pre-pad width
         @param {Number} z negative as in '-'
         @return {Number} zero padded string
         **/
        padZeros: function (n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        },

        /**
         Remove characters that a problemtaic to app / js
         @method cleanProbCharacters
         @param {String} string
         @return {String} string
         **/
        cleanProbCharacters: function (i_string) {
            i_string = i_string.replace(/'/ig, "`");
            i_string = i_string.replace(/&/ig, "and");
            i_string = i_string.replace(/</ig, "(");
            i_string = i_string.replace(/>/ig, ")");
            return i_string;
        }
    });

    return Lib;
});

