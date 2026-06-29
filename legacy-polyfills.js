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
  if (!Object.values) {
    Object.values = function (obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    };
  }
  if (!Object.entries) {
    Object.entries = function (obj) {
      return Object.keys(obj).map(function (key) { return [key, obj[key]]; });
    };
  }

  if (!Number.isFinite) {
    Number.isFinite = function (value) {
      return typeof value === 'number' && isFinite(value);
    };
  }
  if (!Number.isInteger) {
    Number.isInteger = function (value) {
      return Number.isFinite(value) && Math.floor(value) === value;
    };
  }

  if (!Math.sign) {
    Math.sign = function (value) {
      value = Number(value);
      if (value === 0 || isNaN(value)) return value;
      return value > 0 ? 1 : -1;
    };
  }
  if (!Math.hypot) {
    Math.hypot = function () {
      var sum = 0;
      for (var i = 0; i < arguments.length; i++) sum += arguments[i] * arguments[i];
      return Math.sqrt(sum);
    };
  }
  if (!Math.log10) {
    Math.log10 = function (value) {
      return Math.log(value) / Math.LN10;
    };
  }
  if (!Math.imul) {
    Math.imul = function (a, b) {
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      return (al * bl + (((ah * bl + al * bh) << 16) >>> 0) | 0);
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

  if (window.Promise && !Promise.prototype.finally) {
    Promise.prototype.finally = function (onFinally) {
      var P = this.constructor;
      var handler = typeof onFinally === 'function' ? onFinally : function () {};
      return this.then(
        function (value) { return P.resolve(handler()).then(function () { return value; }); },
        function (reason) {
          return P.resolve(handler()).then(function () { throw reason; });
        }
      );
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
  if (window.URLSearchParams && !URLSearchParams.prototype.set) {
    URLSearchParams.prototype.set = function (key, value) {
      if (!this._pairs) {
        this.append(key, value);
        return;
      }
      var found = false;
      for (var i = 0; i < this._pairs.length; i++) {
        if (this._pairs[i][0] === key) {
          if (!found) {
            this._pairs[i][1] = value;
            found = true;
          } else {
            this._pairs.splice(i--, 1);
          }
        }
      }
      if (!found) this.append(key, value);
    };
  }

  if (window.CanvasRenderingContext2D) {
    var proto = CanvasRenderingContext2D.prototype;
    if (!proto.ellipse) {
      proto.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        this.save();
        this.translate(x, y);
        this.rotate(rotation || 0);
        this.scale(radiusX, radiusY);
        this.arc(0, 0, 1, startAngle, endAngle, !!anticlockwise);
        this.restore();
      };
    }
    if (!proto.roundRect) {
      proto.roundRect = function (x, y, w, h, r) {
        r = Math.max(0, Math.min(Number(r) || 0, Math.min(Math.abs(w), Math.abs(h)) / 2));
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
      };
    }
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
            },
            arrayBuffer: function () {
              try {
                var binary = xhr.response || body || '';
                var len = binary.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i) & 255;
                return Promise.resolve(bytes.buffer);
              } catch (e) {
                return Promise.reject(e);
              }
            }
          });
        };
        xhr.onerror = function () { reject(new TypeError('Network request failed')); };
        if (options.responseType) {
          try { xhr.responseType = options.responseType; } catch (e) {}
        }
        xhr.send(options.body == null ? null : options.body);
      });
    };
  }
})();
