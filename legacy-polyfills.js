(function () {
  if (!Object.assign) {
    Object.assign = function (target) {
      if (target == null) throw new TypeError('Cannot convert undefined or null to object');
      var out = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        if (src == null) continue;
        for (var key in src) {
          if (Object.prototype.hasOwnProperty.call(src, key)) out[key] = src[key];
        }
      }
      return out;
    };
  }

  if (!Array.from) {
    Array.from = function (value) {
      return Array.prototype.slice.call(value);
    };
  }
  if (!Array.prototype.find) {
    Array.prototype.find = function (fn, thisArg) {
      for (var i = 0; i < this.length; i++) {
        if (fn.call(thisArg, this[i], i, this)) return this[i];
      }
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (item) {
      return this.indexOf(item) !== -1;
    };
  }
  if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function (fn, thisArg) {
      var out = [];
      for (var i = 0; i < this.length; i++) {
        var value = fn.call(thisArg, this[i], i, this);
        if (Array.isArray(value)) out.push.apply(out, value);
        else out.push(value);
      }
      return out;
    };
  }

  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      return this.indexOf(search, start || 0) !== -1;
    };
  }
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
      pos = pos || 0;
      return this.substr(pos, search.length) === search;
    };
  }
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, len) {
      var str = String(this);
      if (len == null || len > str.length) len = str.length;
      return str.substring(len - search.length, len) === search;
    };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (len, fill) {
      var str = String(this);
      fill = fill == null ? ' ' : String(fill);
      while (str.length < len) str = fill + str;
      return str.length > len ? str.slice(str.length - len) : str;
    };
  }

  if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var el = this;
      while (el && el.nodeType === 1) {
        if (el.matches && el.matches(selector)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    };
  }
  if (window.Element && !Element.prototype.remove) {
    Element.prototype.remove = function () {
      if (this.parentNode) this.parentNode.removeChild(this);
    };
  }

  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    window.CustomEvent.prototype = window.Event && window.Event.prototype;
  }

  if (!window.URLSearchParams) {
    window.URLSearchParams = function () {
      this._pairs = [];
    };
    window.URLSearchParams.prototype.append = function (key, value) {
      this._pairs.push([key, value]);
    };
    window.URLSearchParams.prototype.toString = function () {
      return this._pairs.map(function (pair) {
        return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]);
      }).join('&');
    };
  }

  if (!window.fetch) {
    window.fetch = function (url, options) {
      options = options || {};
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url, true);
        var headers = options.headers || {};
        for (var key in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, key)) xhr.setRequestHeader(key, headers[key]);
        }
        xhr.onload = function () {
          var body = xhr.responseText;
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            text: function () { return Promise.resolve(body); },
            json: function () {
              try { return Promise.resolve(JSON.parse(body)); }
              catch (e) { return Promise.reject(e); }
            }
          });
        };
        xhr.onerror = function () { reject(new TypeError('Network request failed')); };
        xhr.send(options.body || null);
      });
    };
  }
})();
