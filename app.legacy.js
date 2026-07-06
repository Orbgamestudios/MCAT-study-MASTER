var _excluded = ["source_chapter"];
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(typeof e + " is not iterable"); }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useLayoutEffect = _React.useLayoutEffect,
  useCallback = _React.useCallback,
  useMemo = _React.useMemo,
  useRef = _React.useRef,
  createContext = _React.createContext,
  useContext = _React.useContext;
var MODEL = 'gemini-2.5-flash';
var GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
var UPLOAD_BASE = 'https://generativelanguage.googleapis.com/upload/v1beta';
var API_DIRECT_BASE = 'https://mcat-api.solitary-sky-76c1.workers.dev';
var API_BASE = window.__MCAT_LEGACY_BOOT__ ? '/api' : API_DIRECT_BASE;
var DEFAULT_MC_COUNT = 15;
var DEFAULT_SHORT_COUNT = 8;
var KEYS = {
  apiKey: 'mcat:apiKey',
  files: 'mcat:files',
  questions: 'mcat:questions',
  attempts: 'mcat:attempts',
  extractions: 'mcat:extractions',
  theme: 'mcat:theme',
  github: 'mcat:github',
  session: 'mcat:session',
  pendingSync: 'mcat:pendingSync',
  flagQueue: 'mcat:flagQueue',
  reaudit: 'mcat:reaudit',
  volume: 'mcat:volume',
  autoDownload: 'mcat:autoDownload',
  autoDownloadAll: 'mcat:autoDownloadAll',
  contributorMode: 'mcat:contributorMode',
  tropicalBg: 'mcat:tropicalBg',
  bgBlur: 'mcat:bgBlur',
  experimentalUI: 'mcat:experimentalUI',
  glass: 'mcat:glass',
  bankSeen: 'mcat:bankSeen',
  cars: 'mcat:cars',
  connectionsResults: 'mcat:connectionsResults',
  lessonsCache: 'mcat:lessonsCache',
  lessonProgress: 'mcat:lessonProgress',
  lessonGates: 'mcat:lessonGates',
  stateUpdatedAt: 'mcat:stateUpdatedAt'
};
var SYNC_STATE_KEYS = ['mcat:cars', 'mcat:connectionsResults', 'mcat:lessonProgress', 'mcat:lessonGates', 'mcat:theme', 'mcat:volume', 'mcat:tropicalBg', 'mcat:bgBlur', 'mcat:experimentalUI', 'mcat:glass', 'mcat:autoDownload', 'mcat:autoDownloadAll', 'mcat:contributorMode', 'mcat:reaudit', 'mcat:bankSeen'];
var MAP_STATE_KEYS = new Set(['mcat:cars', 'mcat:connectionsResults', 'mcat:lessonProgress', 'mcat:lessonGates']);
function syncEntryRecency(entry) {
  if (!entry || typeof entry !== 'object') return 0;
  return Math.max(0, entry.completed_at || 0, entry.mastered_at || 0, entry.unlocked_at || 0, entry.ts || 0);
}
function mergeSyncState(local, cloud, cloudNewer) {
  local = local || {};
  cloud = cloud || {};
  var merged = {};
  var keys = new Set([].concat(Object.keys(local), Object.keys(cloud)));
  for (var _iterator = _createForOfIteratorHelperLoose(keys), _step; !(_step = _iterator()).done;) {
    var k = _step.value;
    var lv = local[k];
    var cv = cloud[k];
    if (MAP_STATE_KEYS.has(k)) {
      var lm = lv && typeof lv === 'object' ? lv : {};
      var cm = cv && typeof cv === 'object' ? cv : {};
      var out = {};
      for (var _iterator2 = _createForOfIteratorHelperLoose(new Set([].concat(Object.keys(lm), Object.keys(cm)))), _step2; !(_step2 = _iterator2()).done;) {
        var id = _step2.value;
        if (!(id in lm)) out[id] = cm[id];else if (!(id in cm)) out[id] = lm[id];else out[id] = syncEntryRecency(cm[id]) > syncEntryRecency(lm[id]) ? cm[id] : lm[id];
      }
      merged[k] = out;
    } else {
      if (cv === undefined) merged[k] = lv;else if (lv === undefined) merged[k] = cv;else merged[k] = cloudNewer ? cv : lv;
    }
  }
  return merged;
}
function readSyncState() {
  var out = {};
  for (var _iterator3 = _createForOfIteratorHelperLoose(SYNC_STATE_KEYS), _step3; !(_step3 = _iterator3()).done;) {
    var k = _step3.value;
    var v = storage.get(k, undefined);
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out;
}
function serializeSyncState(obj) {
  var out = {};
  for (var _iterator4 = _createForOfIteratorHelperLoose(SYNC_STATE_KEYS), _step4; !(_step4 = _iterator4()).done;) {
    var k = _step4.value;
    if (obj && obj[k] !== undefined) out[k] = obj[k];
  }
  return JSON.stringify(out);
}
function markStateDirty() {
  try {
    window.dispatchEvent(new Event('mcat:stateDirty'));
  } catch (_unused) {}
}
var LESSON_GROUP_SIZE = 3;
var LESSON_CHECKPOINT_Q = 15;
var LESSON_FINAL_Q = 30;
var PALETTES = ['cold', 'warm', 'duo', 'tropical', 'madison', 'gambit'];
var MODES = ['light', 'dark', 'system'];
function systemPrefersDark() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (_unused2) {
    return true;
  }
}
function dataThemeFor(palette, mode) {
  var dark = mode === 'dark' || mode === 'system' && systemPrefersDark();
  if (palette === 'warm') return dark ? 'darkwarm' : 'warm';
  if (palette === 'duo') return dark ? 'darkgreen' : 'green';
  if (palette === 'tropical') return dark ? 'darktropical' : 'tropical';
  if (palette === 'madison') return dark ? 'darkmadison' : 'madison';
  if (palette === 'gambit') return dark ? 'darkgambit' : 'gambit';
  return dark ? 'dark' : 'light';
}
var _dynBgCleanup = null;
function stopDynamicBg() {
  if (_dynBgCleanup) {
    _dynBgCleanup();
    _dynBgCleanup = null;
  }
}
function _rnd(a, b) {
  return a + Math.random() * (b - a);
}
function _pi2() {
  return Math.random() * Math.PI * 2;
}
function _stepWind(state, minStrength, maxStrength, flipSecsRange) {
  if (!state.wind) state.wind = {
    current: 0,
    target: _rnd(minStrength, maxStrength) * 0.4,
    flip: Math.floor(30 * _rnd(flipSecsRange[0], flipSecsRange[1]))
  };
  var w = state.wind;
  w.flip -= 1;
  if (w.flip <= 0) {
    w.target = _rnd(minStrength, maxStrength);
    w.flip = Math.floor(30 * _rnd(flipSecsRange[0], flipSecsRange[1]));
  }
  w.current += (w.target - w.current) * 0.0045;
}
function _initCold(w, h, isDark) {
  var count = isDark ? 180 : 130;
  return {
    flakes: Array.from({
      length: count
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(0, h),
        r: _rnd(0.7, isDark ? 2.4 : 3.2),
        vy: _rnd(0.35, 1.5),
        drift: _rnd(0.2, 0.55),
        dp: _pi2(),
        op: _rnd(0.35, 0.88)
      };
    }),
    stars: isDark ? Array.from({
      length: 80
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(0, h * 0.55),
        r: _rnd(0.4, 1.3),
        op: _rnd(0.3, 0.9),
        tp: _pi2()
      };
    }) : [],
    mountains: {
      back: {
        seed: _rnd(0, 1000),
        baseRel: 0.74,
        maxH: 210
      },
      front: {
        seed: _rnd(0, 1000),
        baseRel: 0.80,
        maxH: 150
      }
    }
  };
}
function _initWarm(w, h) {
  var palette = ['#d4380a', '#e8720c', '#f0a818', '#c83608', '#8b2802', '#f06010', '#e04808', '#b83206'];
  var trees = Array.from({
    length: 14
  }, function () {
    var scale = _rnd(0.9, 2.2);
    return {
      x: _rnd(-w * 0.05, w * 1.05),
      scale,
      cr: 56 * scale,
      th: 110 * scale,
      hue: Math.floor(_rnd(0, palette.length)),
      sway: _pi2()
    };
  }).sort(function (a, b) {
    return a.scale - b.scale;
  });
  return {
    trees,
    leaves: Array.from({
      length: 58
    }, function () {
      return {
        x: _rnd(-30, w + 30),
        y: _rnd(-h * 0.3, h),
        sz: _rnd(5, 13),
        rot: _pi2(),
        rs: _rnd(-0.045, 0.045),
        vy: _rnd(0.45, 1.8),
        drift: _rnd(0.5, 1.3),
        dp: _pi2(),
        col: palette[Math.floor(Math.random() * palette.length)],
        type: Math.random() < 0.5 ? 0 : 1
      };
    }),
    mountains: {
      back: {
        seed: _rnd(0, 1000),
        baseRel: 0.78,
        maxH: 230
      },
      front: {
        seed: _rnd(0, 1000),
        baseRel: 0.84,
        maxH: 160
      }
    }
  };
}
function _initDuo(w, h) {
  var horizonY = h * 0.62;
  var waterTop = h * 0.78;
  var domes = [{
    cx: w * 0.18,
    baseY: waterTop,
    halfW: w * 0.13,
    peakY: h * 0.50
  }, {
    cx: w * 0.52,
    baseY: waterTop,
    halfW: w * 0.18,
    peakY: h * 0.32,
    isCorcovado: true
  }, {
    cx: w * 0.82,
    baseY: waterTop,
    halfW: w * 0.09,
    peakY: h * 0.46
  }];
  var foliage = [];
  var FOLIAGE_COUNT = 28;
  for (var i = 0; i < FOLIAGE_COUNT; i++) {
    var fx = _rnd(0, w);
    var onCorco = Math.abs(fx - w * 0.52) < w * 0.10;
    if (onCorco && Math.random() < 0.75) continue;
    foliage.push({
      x: fx,
      y: waterTop - _rnd(0, 14),
      scale: _rnd(0.7, 1.6),
      kind: Math.random() < 0.4 ? 'palm' : 'bush',
      sway: _pi2(),
      hueTilt: _rnd(-12, 12)
    });
  }
  return {
    horizonY,
    waterTop,
    domes,
    foliage,
    farHills: {
      seed: _rnd(0, 1000),
      baseRel: 0.66,
      maxH: h * 0.08
    },
    birds: Array.from({
      length: 5
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(h * 0.15, h * 0.50),
        sp: _rnd(0.2, 0.55),
        sz: _rnd(4, 9),
        ph: _pi2(),
        fp: _rnd(0.13, 0.22)
      };
    }),
    rays: Array.from({
      length: 5
    }, function () {
      return {
        x: _rnd(w * 0.08, w * 0.92),
        wid: _rnd(20, 70),
        alp: _rnd(0.04, 0.10),
        sp: _rnd(0.003, 0.008),
        ph: _pi2()
      };
    }),
    shimmer: Array.from({
      length: 10
    }, function () {
      return {
        yRel: _rnd(0, 1),
        sp: _rnd(0.004, 0.011),
        ph: _pi2(),
        len: _rnd(0.3, 0.7),
        alp: _rnd(0.06, 0.18)
      };
    }),
    stars: Array.from({
      length: 110
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(0, h * 0.58),
        r: _rnd(0.5, 1.6),
        op: _rnd(0.3, 0.95),
        tp: _pi2()
      };
    }),
    shooter: {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      max: 0,
      nextSpawn: _rnd(120, 320)
    },
    rain: function () {
      var startRaining = Math.random() < 0.20;
      return {
        drops: Array.from({
          length: 220
        }, function () {
          return {
            x: _rnd(-40, w + 40),
            y: _rnd(-h, h),
            len: _rnd(8, 18),
            vy: _rnd(8, 14),
            vx: _rnd(-2.4, -1.2),
            alp: _rnd(0.35, 0.7)
          };
        }),
        intensity: startRaining ? 1 : 0,
        target: startRaining ? 1 : 0,
        nextFlip: startRaining ? Math.floor(30 * _rnd(240, 600)) : Math.floor(30 * _rnd(360, 840)),
        stormPower: 0,
        stormTarget: startRaining ? Math.random() < 0.4 ? _rnd(0.65, 1.0) : _rnd(0.15, 0.4) : 0,
        flash: 0,
        flashCooldown: 0,
        bolt: null
      };
    }()
  };
}
function _initTropical(w, h, isDark) {
  var horizon = h * 0.50;
  var shoreline = h * 0.80;
  var sandH = h - shoreline;
  var waves = Array.from({
    length: 6
  }, function (_, i) {
    var t = i / 5;
    var y0 = horizon + (shoreline - horizon) * (0.1 + 0.85 * t);
    return {
      ph: _pi2(),
      amp: 3 + i * 2.6,
      freq: 0.012 - i * 0.0010,
      sp: 0.014 + i * 0.005,
      y0,
      col: isDark ? ["rgba(10,52,92,0.55)", "rgba(7,40,76,0.58)", "rgba(5,28,58,0.62)", "rgba(3,20,46,0.66)", "rgba(2,14,36,0.70)", "rgba(2,10,28,0.76)"][i] : ["rgba(40,140,160,0.55)", "rgba(60,150,170,0.60)", "rgba(90,170,185,0.62)", "rgba(150,195,200,0.62)", "rgba(210,200,165,0.55)", "rgba(245,225,180,0.55)"][i]
    };
  });
  return {
    horizon,
    shoreline,
    sandH,
    waves,
    birds: isDark ? [] : Array.from({
      length: 5
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(h * 0.10, horizon * 0.65),
        sp: _rnd(0.25, 0.55),
        sz: _rnd(5, 9),
        ph: _pi2(),
        fp: _rnd(0.12, 0.20)
      };
    }),
    sparkles: Array.from({
      length: isDark ? 26 : 32
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(horizon, shoreline - 6),
        ph: _pi2(),
        sp: _rnd(0.04, 0.12),
        sz: _rnd(0.8, 2.4)
      };
    }),
    shells: Array.from({
      length: 28
    }, function () {
      var types = ['scallop', 'cone', 'spiral', 'oval'];
      return {
        x: _rnd(4, w - 4),
        y: _rnd(shoreline + 6, h - 8),
        size: _rnd(2.2, 4.2),
        rot: _rnd(-0.6, 0.6),
        type: types[Math.floor(Math.random() * types.length)],
        col: ['#f7e6cc', '#f0c9a5', '#e8b791', '#d99277', '#f4d6c2', '#fff1de'][Math.floor(Math.random() * 6)]
      };
    }),
    crab: {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      legPhase: 0,
      nextSpawn: Math.floor(30 * _rnd(20, 60))
    },
    stars: isDark ? Array.from({
      length: 140
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(0, horizon),
        r: _rnd(0.4, 1.4),
        op: _rnd(0.4, 0.95),
        tp: _pi2()
      };
    }) : [],
    shooter: isDark ? {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      max: 0,
      nextSpawn: _rnd(120, 320)
    } : null,
    plane: isDark ? {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      nextSpawn: Math.floor(30 * _rnd(40, 150))
    } : null,
    sailboat: !isDark ? {
      active: false,
      x: 0,
      dir: 1,
      vx: 0,
      scale: 1,
      nextSpawn: Math.floor(30 * _rnd(20, 90))
    } : null
  };
}
function _initMadison(w, h, isDark) {
  var cx = w * 0.5;
  var groundY = h * 0.78;
  var capitol = {
    x: cx,
    width: Math.max(78, w * 0.14),
    height: h * 0.20,
    domeRadius: Math.max(32, w * 0.072),
    isCapitol: true
  };
  var buildings = [];
  var slotCount = 20;
  for (var i = 0; i < slotCount; i++) {
    var side = i < slotCount / 2 ? -1 : 1;
    var idxInSide = side === -1 ? i : i - slotCount / 2;
    var slot = idxInSide + 1;
    var distFrac = slot / (slotCount / 2);
    var distFromCap = capitol.width * 0.7 + slot * (w * 0.048);
    var x = cx + side * distFromCap + _rnd(-6, 6);
    var tallness = (1 - distFrac * 0.55) * (0.75 + Math.random() * 0.15);
    var height = capitol.height * tallness;
    var width = _rnd(34, 64);
    var cols = Math.max(3, Math.floor(width / 7));
    var rows = Math.max(5, Math.floor(height / 10));
    var windows = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        windows.push({
          on: Math.random() < 0.22,
          flipAt: Math.floor(30 * _rnd(45, 240))
        });
      }
    }
    buildings.push({
      x,
      width,
      height,
      cols,
      rows,
      windows,
      isCapitol: false
    });
  }
  {
    var _cols = Math.max(4, Math.floor(capitol.width / 8));
    var _rows = Math.max(7, Math.floor(capitol.height / 11));
    var _windows = [];
    for (var _r = 0; _r < _rows; _r++) {
      for (var _c = 0; _c < _cols; _c++) {
        _windows.push({
          on: Math.random() < 0.28,
          flipAt: Math.floor(30 * _rnd(60, 300))
        });
      }
    }
    capitol.cols = _cols;
    capitol.rows = _rows;
    capitol.windows = _windows;
  }
  buildings.sort(function (a, b) {
    return Math.abs(b.x - cx) - Math.abs(a.x - cx);
  });
  return {
    cx,
    groundY,
    capitol,
    buildings,
    stars: isDark ? Array.from({
      length: 130
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(0, h * 0.55),
        r: _rnd(0.4, 1.4),
        op: _rnd(0.4, 0.95),
        tp: _pi2()
      };
    }) : [],
    shooter: isDark ? {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      max: 0,
      nextSpawn: _rnd(120, 320)
    } : null,
    rain: function () {
      var startRaining = !isDark && Math.random() < 0.20;
      return {
        drops: Array.from({
          length: 240
        }, function () {
          return {
            x: _rnd(-40, w + 40),
            y: _rnd(-h, h),
            len: _rnd(8, 18),
            vy: _rnd(8, 14),
            vx: _rnd(-2.4, -1.2),
            alp: _rnd(0.35, 0.7)
          };
        }),
        intensity: startRaining ? 1 : 0,
        target: startRaining ? 1 : 0,
        nextFlip: startRaining ? Math.floor(30 * _rnd(240, 600)) : Math.floor(30 * _rnd(360, 840)),
        stormPower: 0,
        stormTarget: startRaining ? Math.random() < 0.4 ? _rnd(0.65, 1.0) : _rnd(0.15, 0.4) : 0,
        flash: 0,
        flashCooldown: 0,
        bolt: null
      };
    }(),
    clouds: Array.from({
      length: 4
    }, function () {
      return {
        x: _rnd(-w * 0.3, w * 1.2),
        y: _rnd(h * 0.05, h * 0.30),
        scale: _rnd(0.85, 1.6),
        baseDrift: _rnd(0.05, 0.18),
        alpha: _rnd(0.55, 0.85)
      };
    }),
    plane: {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      nextSpawn: Math.floor(30 * _rnd(45, 180))
    },
    spotlights: [{
      ox: cx - capitol.width * 1.4,
      oy: groundY * 0.99,
      a0: -Math.PI * 0.40,
      a1: -Math.PI * 0.58,
      sp: 0.0045,
      ph: _pi2()
    }, {
      ox: cx + capitol.width * 1.3,
      oy: groundY * 0.99,
      a0: -Math.PI * 0.40,
      a1: -Math.PI * 0.58,
      sp: 0.0036,
      ph: _pi2()
    }, {
      ox: cx,
      oy: groundY * 1.01,
      a0: -Math.PI * 0.38,
      a1: -Math.PI * 0.62,
      sp: 0.0028,
      ph: _pi2()
    }],
    terrace: {
      cx,
      width: Math.max(280, w * 0.62),
      height: Math.max(36, h * 0.08),
      numArches: 11
    },
    cars: Array.from({
      length: 5
    }, function () {
      var dir = Math.random() < 0.5 ? 1 : -1;
      return {
        x: dir === 1 ? -40 : w + 40,
        dir,
        sp: _rnd(0.4, 0.85),
        col: ['#1f2733', '#3b3b3b', '#6b5e3a', '#5a2c2c', '#2c4a5a'][Math.floor(Math.random() * 5)],
        len: _rnd(5, 8),
        delay: Math.floor(30 * _rnd(20, 240))
      };
    })
  };
}
function _initGambit(w, h, isDark) {
  return {
    cards: Array.from({
      length: 9
    }, function (_, i) {
      return {
        x: _rnd(-w * 0.15, w * 1.15),
        y: _rnd(h * 0.08, h * 0.86),
        w: _rnd(28, 46),
        rot: _rnd(-0.9, 0.9),
        spin: _rnd(-0.012, 0.012),
        drift: _rnd(0.18, 0.48),
        bob: _rnd(5, 18),
        ph: _pi2(),
        suit: ['♦', '♣', '♥', '♠'][i % 4],
        hot: Math.random() < 0.58
      };
    }),
    sparks: Array.from({
      length: isDark ? 150 : 115
    }, function () {
      return {
        x: _rnd(0, w),
        y: _rnd(0, h),
        r: _rnd(0.7, 2.5),
        vx: _rnd(-0.25, 0.9),
        vy: _rnd(-0.75, -0.08),
        ph: _pi2(),
        hue: _rnd(272, 322),
        op: _rnd(0.26, 0.86)
      };
    }),
    bands: Array.from({
      length: 7
    }, function (_, i) {
      return {
        y: h * _rnd(0.08, 0.92),
        amp: _rnd(16, 48),
        width: _rnd(20, 64),
        sp: _rnd(0.004, 0.012),
        ph: _pi2(),
        hue: i % 3 === 0 ? 292 : i % 3 === 1 ? 266 : 186,
        alpha: _rnd(0.10, 0.26)
      };
    })
  };
}
function _ridgeHeight(x, seed) {
  return 0.50 * (0.5 + 0.5 * Math.sin(x * 0.0042 + seed)) + 0.30 * (0.5 + 0.5 * Math.sin(x * 0.0119 + seed * 2.3)) + 0.20 * (0.5 + 0.5 * Math.sin(x * 0.0271 + seed * 4.7));
}
function _ridgeHeightAngular(x, seed) {
  var tri = function tri(p) {
    var f = p - Math.floor(p);
    return 1 - Math.abs(2 * f - 1);
  };
  return 0.62 * tri(x * 0.0024 + seed * 0.11) + 0.26 * tri(x * 0.0078 + seed * 0.31) + 0.12 * tri(x * 0.0203 + seed * 0.71);
}
function _drawStormFX(ctx, rain, w, h) {
  if (!rain) return;
  if (rain.intensity > 0.01 && rain.stormPower > 0.01) {
    ctx.fillStyle = "rgba(0,0,0," + rain.stormPower * rain.intensity * 0.5 + ")";
    ctx.fillRect(0, 0, w, h);
  }
  if (rain.bolt && rain.bolt.points && rain.bolt.points.length > 1) {
    var a = Math.min(1, rain.bolt.life / 6);
    ctx.save();
    ctx.strokeStyle = "rgba(245,255,255," + 0.9 * a + ")";
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(220,235,255,0.9)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(rain.bolt.points[0].x, rain.bolt.points[0].y);
    for (var i = 1; i < rain.bolt.points.length; i++) {
      ctx.lineTo(rain.bolt.points[i].x, rain.bolt.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
  if (rain.flash > 0.001) {
    ctx.fillStyle = "rgba(240,250,255," + rain.flash * 0.5 + ")";
    ctx.fillRect(0, 0, w, h);
  }
}
function _stepStorm(rain, w, h) {
  rain.nextFlip -= 1;
  if (rain.nextFlip <= 0) {
    rain.target = rain.target === 0 ? 1 : 0;
    if (rain.target === 1) {
      rain.stormTarget = Math.random() < 0.4 ? _rnd(0.65, 1.0) : _rnd(0.15, 0.4);
      rain.nextFlip = Math.floor(30 * _rnd(240, 600));
    } else {
      rain.stormTarget = 0;
      rain.nextFlip = Math.floor(30 * _rnd(360, 840));
    }
  }
  if (rain.intensity !== rain.target) {
    var step = rain.target > rain.intensity ? 1 / 90 : -1 / 120;
    rain.intensity = Math.max(0, Math.min(1, rain.intensity + step));
  }
  if (rain.stormPower == null) rain.stormPower = 0;
  if (rain.stormTarget == null) rain.stormTarget = 0;
  if (rain.stormPower !== rain.stormTarget) {
    var stepSP = rain.stormTarget > rain.stormPower ? 1 / 150 : -1 / 240;
    rain.stormPower = Math.max(0, Math.min(1, rain.stormPower + stepSP));
  }
  if (rain.flash > 0) rain.flash = Math.max(0, rain.flash - 0.08);
  if (rain.bolt) {
    rain.bolt.life -= 1;
    if (rain.bolt.life <= 0) rain.bolt = null;
  }
  if (rain.flashCooldown > 0) rain.flashCooldown -= 1;
  if (rain.intensity > 0.55 && rain.stormPower > 0.35 && rain.flashCooldown <= 0 && Math.random() < 1 / 180) {
    rain.flash = 1;
    rain.flashCooldown = Math.floor(30 * _rnd(5, 18));
    if (Math.random() < 0.6) {
      var x0 = _rnd(w * 0.12, w * 0.88);
      var pts = [{
        x: x0,
        y: 0
      }];
      var segs = 8 + Math.floor(Math.random() * 4);
      var groundY = h * 0.7;
      var xCur = x0;
      for (var i = 1; i <= segs; i++) {
        xCur += (Math.random() - 0.5) * 36;
        pts.push({
          x: xCur,
          y: groundY * i / segs
        });
      }
      rain.bolt = {
        points: pts,
        life: 6
      };
    }
  }
}
function _drawRidge(ctx, w, baseY, maxH, seed, fillStyle, opts) {
  if (opts === void 0) {
    opts = {};
  }
  var step = opts.step || (opts.style === 'angular' ? 3 : 6);
  var py = opts.py || 0;
  var heightFn = opts.style === 'angular' ? _ridgeHeightAngular : _ridgeHeight;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(-4, baseY + py + 40);
  for (var x = -4; x <= w + 4; x += step) {
    var y = baseY + py - maxH * heightFn(x, seed);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w + 4, baseY + py + 40);
  ctx.closePath();
  ctx.fill();
  if (opts.snowAlpha && opts.snowAlpha > 0) {
    ctx.strokeStyle = "rgba(255,255,255," + opts.snowAlpha + ")";
    ctx.lineWidth = opts.snowWidth || 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    var drawing = false;
    for (var _x = -4; _x <= w + 4; _x += step) {
      var f = heightFn(_x, seed);
      var _y = baseY + py - maxH * f;
      if (f > (opts.snowThreshold || 0.55)) {
        if (!drawing) {
          ctx.moveTo(_x, _y);
          drawing = true;
        } else ctx.lineTo(_x, _y);
      } else if (drawing) {
        ctx.stroke();
        ctx.beginPath();
        drawing = false;
      }
    }
    if (drawing) ctx.stroke();
  }
}
function _drawCold(ctx, isDark, state, t, py, w, h) {
  var sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0, '#010818');
    sky.addColorStop(0.18, '#020d1e');
    sky.addColorStop(0.38, '#031430');
    sky.addColorStop(0.58, '#04182e');
    sky.addColorStop(0.78, '#030c1e');
    sky.addColorStop(1, '#010610');
  } else {
    sky.addColorStop(0, '#4890c8');
    sky.addColorStop(0.11, '#72b8e8');
    sky.addColorStop(0.25, '#a4d4f5');
    sky.addColorStop(0.42, '#ceeafc');
    sky.addColorStop(0.58, '#eaf5fe');
    sky.addColorStop(0.70, '#f8fcff');
    sky.addColorStop(0.82, '#ffffff');
    sky.addColorStop(1, '#edf4fc');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  if (isDark) {
    for (var _iterator5 = _createForOfIteratorHelperLoose(state.stars), _step5; !(_step5 = _iterator5()).done;) {
      var s = _step5.value;
      var tw = 0.55 + 0.45 * Math.sin(t * 0.04 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.3, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + s.op * tw + ")";
      ctx.fill();
    }
    var bands = [{
      r: 0,
      g: 255,
      b: 110,
      yf: 0.20,
      ht: 52,
      sp: 0.009
    }, {
      r: 88,
      g: 42,
      b: 255,
      yf: 0.30,
      ht: 38,
      sp: 0.007
    }, {
      r: 0,
      g: 228,
      b: 198,
      yf: 0.42,
      ht: 30,
      sp: 0.006
    }];
    for (var _i = 0, _bands = bands; _i < _bands.length; _i++) {
      var a = _bands[_i];
      var phase = t * a.sp + a.yf * 8;
      var yBase = h * a.yf + py * 0.5;
      for (var pass = 0; pass < 2; pass++) {
        var ht = a.ht * (pass === 0 ? 1 : 1.7);
        var ag = ctx.createLinearGradient(0, yBase - ht, 0, yBase + ht);
        var alpTop = pass === 0 ? 0.58 : 0.18;
        ag.addColorStop(0, "rgba(" + a.r + "," + a.g + "," + a.b + ",0)");
        ag.addColorStop(0.38, "rgba(" + a.r + "," + a.g + "," + a.b + "," + alpTop + ")");
        ag.addColorStop(0.62, "rgba(" + a.r + "," + a.g + "," + a.b + "," + alpTop + ")");
        ag.addColorStop(1, "rgba(" + a.r + "," + a.g + "," + a.b + ",0)");
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.moveTo(-20, yBase + ht + 10);
        for (var x = -20; x <= w + 20; x += 4) {
          var y = yBase + Math.sin(x * 0.007 + phase) * a.ht * 0.62 + Math.sin(x * 0.019 + phase * 1.4) * a.ht * 0.22 + Math.sin(x * 0.003 + phase * 0.6) * a.ht * 0.35;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + 20, yBase + ht + 10);
        ctx.lineTo(-20, yBase + ht + 10);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else {
    var clouds = [{
      cx: w * 0.15 + Math.sin(t * 0.004) * 14,
      cy: h * 0.11 + py * 0.4,
      r: 44
    }, {
      cx: w * 0.53 + Math.sin(t * 0.003 + 1) * 18,
      cy: h * 0.07 + py * 0.4,
      r: 58
    }, {
      cx: w * 0.83 + Math.sin(t * 0.005 + 2) * 11,
      cy: h * 0.15 + py * 0.4,
      r: 36
    }];
    ctx.save();
    ctx.globalAlpha = 0.48;
    for (var _i2 = 0, _clouds = clouds; _i2 < _clouds.length; _i2++) {
      var c = _clouds[_i2];
      for (var _i3 = 0, _arr = [[0, 0, 1.5], [c.r * 0.55, c.r * 0.08, 0.92], [-(c.r * 0.48), c.r * 0.12, 0.82]]; _i3 < _arr.length; _i3++) {
        var _arr$_i = _arr[_i3],
          ox = _arr$_i[0],
          oy = _arr$_i[1],
          rf = _arr$_i[2];
        var cg = ctx.createRadialGradient(c.cx + ox, c.cy + oy, 0, c.cx + ox, c.cy + oy, c.r * rf);
        cg.addColorStop(0, 'rgba(255,255,255,0.95)');
        cg.addColorStop(0.45, 'rgba(248,252,255,0.6)');
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(c.cx + ox, c.cy + oy, c.r * rf, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  if (state.mountains) {
    var py4 = py * 0.4;
    if (isDark) {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed, 'rgba(18,28,52,0.85)', {
        py: py4,
        style: 'angular',
        snowAlpha: 0.32,
        snowThreshold: 0.55,
        snowWidth: 1.6
      });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed, 'rgba(8,16,32,0.95)', {
        py: py4 * 1.4,
        style: 'angular',
        snowAlpha: 0.45,
        snowThreshold: 0.5,
        snowWidth: 2
      });
    } else {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed, 'rgba(120,150,190,0.62)', {
        py: py4,
        style: 'angular',
        snowAlpha: 0.7,
        snowThreshold: 0.55,
        snowWidth: 2
      });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed, 'rgba(72,104,156,0.92)', {
        py: py4 * 1.4,
        style: 'angular',
        snowAlpha: 0.85,
        snowThreshold: 0.45,
        snowWidth: 2.4
      });
    }
  }
  if (!isDark) {
    var gnd = ctx.createLinearGradient(0, h * 0.84, 0, h);
    gnd.addColorStop(0, 'rgba(255,255,255,0)');
    gnd.addColorStop(0.22, 'rgba(248,252,255,0.82)');
    gnd.addColorStop(1, '#ffffff');
    ctx.fillStyle = gnd;
    ctx.fillRect(0, 0, w, h);
  }
  _stepWind(state, -3.2, 3.2, [20, 60]);
  for (var _iterator6 = _createForOfIteratorHelperLoose(state.flakes), _step6; !(_step6 = _iterator6()).done;) {
    var f = _step6.value;
    f.y += f.vy;
    f.x += Math.sin(t * 0.013 + f.dp) * f.drift * 0.55 + state.wind.current;
    if (f.y > h + 8) {
      f.y = -8;
      f.x = Math.random() * w;
    }
    if (f.x < -8) f.x = w + 4;
    if (f.x > w + 8) f.x = -4;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + f.op + ")";
    ctx.fill();
  }
}
function _drawWarm(ctx, isDark, state, t, py, w, h) {
  var sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0, '#1e0e04');
    sky.addColorStop(0.18, '#280f04');
    sky.addColorStop(0.40, '#1e0a02');
    sky.addColorStop(0.58, '#140800');
    sky.addColorStop(0.78, '#0a0500');
    sky.addColorStop(1, '#060300');
  } else {
    sky.addColorStop(0, '#f0bc52');
    sky.addColorStop(0.11, '#e88832');
    sky.addColorStop(0.28, '#d04a12');
    sky.addColorStop(0.46, '#a02606');
    sky.addColorStop(0.64, '#681400');
    sky.addColorStop(0.82, '#340900');
    sky.addColorStop(1, '#1a0500');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  var glowX = isDark ? w * 0.38 : w * 0.67;
  var glowY = (isDark ? h * 0.18 : h * 0.05) + py * 0.3;
  var glowR = isDark ? w * 0.48 : w * 0.46;
  var gcol = isDark ? [208, 78, 12, 0.32] : [255, 218, 85, 0.58];
  var glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
  glow.addColorStop(0, "rgba(" + gcol[0] + "," + gcol[1] + "," + gcol[2] + "," + gcol[3] + ")");
  glow.addColorStop(0.42, "rgba(" + gcol[0] + "," + gcol[1] + "," + gcol[2] + "," + gcol[3] * 0.3 + ")");
  glow.addColorStop(1, "rgba(" + gcol[0] + "," + gcol[1] + "," + gcol[2] + ",0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  if (state.mountains) {
    var py4 = py * 0.4;
    if (isDark) {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed, 'rgba(46,18,8,0.78)', {
        py: py4,
        style: 'angular'
      });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed, 'rgba(22,8,2,0.92)', {
        py: py4 * 1.4,
        style: 'angular'
      });
    } else {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed, 'rgba(132,62,32,0.62)', {
        py: py4,
        style: 'angular'
      });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed, 'rgba(84,32,12,0.92)', {
        py: py4 * 1.4,
        style: 'angular'
      });
    }
  }
  var groundY = h * 0.93;
  for (var _iterator7 = _createForOfIteratorHelperLoose(state.trees), _step7; !(_step7 = _iterator7()).done;) {
    var tr = _step7.value;
    var sway = Math.sin(t * 0.012 + tr.sway) * 1.6;
    var baseX = tr.x + sway * 0.4;
    var baseY = groundY + py * 0.45;
    var topY = baseY - tr.th;
    ctx.fillStyle = isDark ? '#180a02' : '#3a1d08';
    ctx.beginPath();
    ctx.moveTo(baseX - 3 * tr.scale, baseY);
    ctx.lineTo(baseX - 2.2 * tr.scale, topY + tr.cr * 0.4);
    ctx.lineTo(baseX + 2.2 * tr.scale, topY + tr.cr * 0.4);
    ctx.lineTo(baseX + 3 * tr.scale, baseY);
    ctx.closePath();
    ctx.fill();
    var crownColors = isDark ? ['rgba(82,30,8,0.78)', 'rgba(64,20,4,0.72)', 'rgba(54,16,2,0.68)'] : ['rgba(232,114,12,0.88)', 'rgba(212,56,10,0.82)', 'rgba(240,168,24,0.78)'];
    for (var i = 0; i < 5; i++) {
      var ang = i / 5 * Math.PI * 2 + tr.sway;
      var ox = Math.cos(ang) * tr.cr * 0.45;
      var oy = Math.sin(ang) * tr.cr * 0.35 - tr.cr * 0.1;
      ctx.fillStyle = crownColors[i % crownColors.length];
      ctx.beginPath();
      ctx.arc(baseX + ox + sway * 0.6, topY + oy, tr.cr * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = crownColors[0];
    ctx.beginPath();
    ctx.arc(baseX + sway * 0.6, topY, tr.cr * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  _stepWind(state, -4, 4, [20, 55]);
  for (var _iterator8 = _createForOfIteratorHelperLoose(state.leaves), _step8; !(_step8 = _iterator8()).done;) {
    var lf = _step8.value;
    lf.y += lf.vy;
    lf.x += Math.sin(t * 0.011 + lf.dp) * lf.drift * 0.5 + state.wind.current;
    lf.rot += lf.rs + state.wind.current * 0.004;
    if (lf.y > h + 20) {
      lf.y = -20;
      lf.x = Math.random() * w;
    }
    if (lf.x < -20) lf.x = w + 10;
    if (lf.x > w + 20) lf.x = -10;
    ctx.save();
    ctx.translate(lf.x, lf.y);
    ctx.rotate(lf.rot);
    ctx.globalAlpha = 0.72 + Math.sin(t * 0.02 + lf.dp) * 0.16;
    ctx.fillStyle = lf.col;
    if (lf.type === 0) {
      ctx.beginPath();
      ctx.ellipse(0, 0, lf.sz * 0.48, lf.sz, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = lf.col;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -lf.sz * 0.85);
      ctx.lineTo(0, lf.sz * 0.85);
      ctx.stroke();
    } else {
      ctx.beginPath();
      for (var _i4 = 0; _i4 < 5; _i4++) {
        var a1 = _i4 / 5 * Math.PI * 2 - Math.PI / 2;
        var a2 = a1 + Math.PI / 5;
        ctx.lineTo(Math.cos(a1) * lf.sz, Math.sin(a1) * lf.sz);
        ctx.lineTo(Math.cos(a2) * lf.sz * 0.42, Math.sin(a2) * lf.sz * 0.42);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}
function _drawDome(ctx, dome, isDark, py) {
  var cx = dome.cx,
    baseY = dome.baseY,
    halfW = dome.halfW,
    peakY = dome.peakY;
  var baseShift = py * 0.45;
  var peakShift = py * 0.3;
  var yBase = baseY + baseShift;
  var yPeak = peakY + peakShift;
  var height = yBase - yPeak;
  var segs = 28;
  var pts = [];
  for (var i = 0; i <= segs; i++) {
    var t = i / segs;
    var ang = t * Math.PI;
    var sx = cx + Math.cos(Math.PI - ang) * halfW;
    var prof = Math.pow(Math.sin(ang), 0.65);
    var sy = yBase - prof * height;
    pts.push([sx, sy]);
  }
  var g = ctx.createLinearGradient(cx, yPeak, cx, yBase);
  if (isDark) {
    g.addColorStop(0, '#1c2530');
    g.addColorStop(0.55, '#10161e');
    g.addColorStop(1, '#070a0e');
  } else {
    g.addColorStop(0, '#7c8898');
    g.addColorStop(0.45, '#525e6e');
    g.addColorStop(1, '#2e3744');
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (var _i5 = 1; _i5 < pts.length; _i5++) ctx.lineTo(pts[_i5][0], pts[_i5][1]);
  ctx.closePath();
  ctx.fill();
  if (!isDark) {
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var _i6 = Math.floor(segs / 2); _i6 < pts.length - 1; _i6++) {
      if (_i6 === Math.floor(segs / 2)) ctx.moveTo(pts[_i6][0], pts[_i6][1]);else ctx.lineTo(pts[_i6][0], pts[_i6][1]);
    }
    ctx.stroke();
  }
  return {
    yPeak,
    yBase
  };
}
function _drawRedeemer(ctx, cx, peakY, s, isDark) {
  var w = s * 0.95;
  var bodyW = s * 0.18;
  var bodyH = s * 0.62;
  var pedW = s * 0.34;
  var pedH = s * 0.14;
  var armH = s * 0.10;
  var headR = s * 0.075;
  var color = isDark ? 'rgba(232,228,218,0.78)' : '#efeae0';
  var shade = isDark ? 'rgba(180,176,168,0.55)' : 'rgba(168,158,140,0.7)';
  var pedTop = peakY - pedH;
  var bodyTop = pedTop - bodyH;
  var armCenterY = bodyTop + bodyH * 0.18;
  var headCenterY = bodyTop - headR * 1.05;
  ctx.fillStyle = shade;
  ctx.fillRect(cx - pedW / 2, peakY - pedH, pedW, pedH);
  ctx.fillStyle = color;
  ctx.fillRect(cx - pedW * 0.4, peakY - pedH - pedH * 0.35, pedW * 0.8, pedH * 0.35);
  ctx.fillStyle = color;
  ctx.fillRect(cx - bodyW / 2, bodyTop, bodyW, bodyH);
  ctx.fillRect(cx - w / 2, armCenterY - armH / 2, w, armH);
  ctx.beginPath();
  ctx.arc(cx, headCenterY, headR, 0, Math.PI * 2);
  ctx.fill();
  if (!isDark) {
    var gg = ctx.createRadialGradient(cx, headCenterY, 0, cx, headCenterY, s * 0.9);
    gg.addColorStop(0, 'rgba(255,255,255,0.18)');
    gg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(cx, headCenterY, s * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}
function _drawFoliage(ctx, f, isDark, py, t) {
  var sway = Math.sin(t * 0.012 + f.sway) * 1.4;
  var cx = f.x + sway * 0.35;
  var cy = f.y + py * 0.42;
  var s = f.scale;
  var tilt = f.hueTilt;
  var baseR = isDark ? 6 : Math.max(0, 28 + tilt * 0.4);
  var baseG = isDark ? 18 : Math.max(0, 88 + tilt * 0.8);
  var baseB = isDark ? 12 : Math.max(0, 36 + tilt * 0.3);
  var fill = "rgba(" + (baseR | 0) + "," + (baseG | 0) + "," + (baseB | 0) + ",0.92)";
  var trunk = isDark ? 'rgba(8,16,8,0.9)' : 'rgba(36,22,8,0.9)';
  if (f.kind === 'palm') {
    var trunkH = 26 * s;
    var topX = cx + sway * 0.6;
    var topY = cy - trunkH;
    ctx.strokeStyle = trunk;
    ctx.lineWidth = Math.max(1.2, 2 * s);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + sway * 0.6, cy - trunkH * 0.5, topX, topY);
    ctx.stroke();
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(1.4, 2.4 * s);
    var frondLen = 16 * s;
    for (var i = 0; i < 6; i++) {
      var ang = -Math.PI / 2 + (i - 2.5) * (Math.PI / 6) + sway * 0.05;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(topX + Math.cos(ang) * frondLen * 0.55, topY + Math.sin(ang) * frondLen * 0.35, topX + Math.cos(ang) * frondLen, topY + Math.sin(ang) * frondLen * 0.85);
      ctx.stroke();
    }
  } else {
    var blobs = [{
      dx: 0,
      dy: -8 * s,
      r: 12 * s
    }, {
      dx: -8 * s,
      dy: -4 * s,
      r: 10 * s
    }, {
      dx: 8 * s,
      dy: -4 * s,
      r: 10 * s
    }, {
      dx: -3 * s,
      dy: -14 * s,
      r: 8 * s
    }, {
      dx: 5 * s,
      dy: -12 * s,
      r: 8 * s
    }];
    ctx.fillStyle = fill;
    for (var _i7 = 0, _blobs = blobs; _i7 < _blobs.length; _i7++) {
      var b = _blobs[_i7];
      ctx.beginPath();
      ctx.arc(cx + b.dx, cy + b.dy, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
function _drawDuo(ctx, isDark, state, t, py, w, h) {
  var sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0, '#04102a');
    sky.addColorStop(0.25, '#06183a');
    sky.addColorStop(0.55, '#0a2050');
    sky.addColorStop(0.80, '#08184a');
    sky.addColorStop(1, '#020a1c');
  } else {
    sky.addColorStop(0, '#5fb8e8');
    sky.addColorStop(0.18, '#7ec8f0');
    sky.addColorStop(0.45, '#c8e8f8');
    sky.addColorStop(0.62, '#f4eed2');
    sky.addColorStop(0.78, '#88c2d4');
    sky.addColorStop(1, '#3b6c7e');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  if (isDark && state.stars) {
    for (var _iterator9 = _createForOfIteratorHelperLoose(state.stars), _step9; !(_step9 = _iterator9()).done;) {
      var s = _step9.value;
      var tw = 0.55 + 0.45 * Math.sin(t * 0.045 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.18, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235,242,255," + s.op * tw + ")";
      ctx.fill();
    }
    var ss = state.shooter;
    if (ss) {
      if (!ss.active) {
        ss.nextSpawn -= 1;
        if (ss.nextSpawn <= 0) {
          ss.active = true;
          ss.x = _rnd(w * 0.08, w * 0.75);
          ss.y = _rnd(h * 0.04, h * 0.45);
          var ang = _rnd(Math.PI * 0.16, Math.PI * 0.34);
          var spd = _rnd(7, 11);
          ss.vx = Math.cos(ang) * spd;
          ss.vy = Math.sin(ang) * spd;
          ss.max = _rnd(28, 48);
          ss.life = 0;
        }
      } else {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life += 1;
        var fade = ss.life < 6 ? ss.life / 6 : Math.max(0, 1 - (ss.life - 6) / (ss.max - 6));
        var tg = ctx.createLinearGradient(ss.x - ss.vx * 8, ss.y - ss.vy * 8, ss.x, ss.y);
        tg.addColorStop(0, 'rgba(255,255,255,0)');
        tg.addColorStop(1, "rgba(255,255,255," + 0.95 * fade + ")");
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + fade + ")";
        ctx.fill();
        if (ss.life >= ss.max || ss.x > w + 80 || ss.y > h * 0.7) {
          ss.active = false;
          ss.nextSpawn = _rnd(180, 420);
        }
      }
    }
  }
  var sx = w * 0.78,
    sy = h * 0.18 + py * 0.25;
  if (isDark) {
    ctx.fillStyle = 'rgba(248,244,232,0.92)';
    ctx.beginPath();
    ctx.arc(sx, sy, 22, 0, Math.PI * 2);
    ctx.fill();
    var mg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.18);
    mg.addColorStop(0, 'rgba(248,244,232,0.32)');
    mg.addColorStop(1, 'rgba(248,244,232,0)');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(sx, sy, w * 0.18, 0, Math.PI * 2);
    ctx.fill();
  } else {
    var sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.30);
    sg.addColorStop(0, 'rgba(255,245,210,0.95)');
    sg.addColorStop(0.18, 'rgba(255,228,150,0.55)');
    sg.addColorStop(0.55, 'rgba(255,205,110,0.18)');
    sg.addColorStop(1, 'rgba(255,180,80,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, w, h);
  }
  var fh = state.farHills;
  _drawRidge(ctx, w, h * fh.baseRel, fh.maxH, fh.seed, isDark ? 'rgba(12,22,42,0.85)' : 'rgba(96,134,164,0.72)', {
    py: py * 0.25
  });
  var domesSorted = state.domes.slice().sort(function (a, b) {
    return b.peakY - a.peakY;
  });
  var corcoMeta = null;
  for (var _iterator0 = _createForOfIteratorHelperLoose(domesSorted), _step0; !(_step0 = _iterator0()).done;) {
    var _d = _step0.value;
    var meta = _drawDome(ctx, _d, isDark, py);
    if (_d.isCorcovado) corcoMeta = _extends({
      d: _d
    }, meta);
  }
  if (corcoMeta) {
    var statueH = (corcoMeta.yBase - corcoMeta.yPeak) * 0.22;
    _drawRedeemer(ctx, corcoMeta.d.cx, corcoMeta.yPeak, statueH, isDark);
  }
  if (state.foliage) {
    for (var _iterator1 = _createForOfIteratorHelperLoose(state.foliage), _step1; !(_step1 = _iterator1()).done;) {
      var f = _step1.value;
      _drawFoliage(ctx, f, isDark, py, t);
    }
  }
  var wt = state.waterTop + py * 0.55;
  var wg = ctx.createLinearGradient(0, wt, 0, h);
  if (isDark) {
    wg.addColorStop(0, '#0a1a2e');
    wg.addColorStop(0.45, '#08182c');
    wg.addColorStop(1, '#020a18');
  } else {
    wg.addColorStop(0, '#3a7896');
    wg.addColorStop(0.45, '#2c5e7c');
    wg.addColorStop(1, '#0e3650');
  }
  ctx.fillStyle = wg;
  ctx.fillRect(0, wt, w, h - wt);
  ctx.lineWidth = 1.2;
  for (var _iterator10 = _createForOfIteratorHelperLoose(state.shimmer), _step10; !(_step10 = _iterator10()).done;) {
    var _s = _step10.value;
    var baseY = wt + (h - wt) * _s.yRel;
    var ph = t * _s.sp + _s.ph;
    var startX = w * (0.5 + 0.5 * Math.sin(ph));
    var length = w * _s.len;
    var _alp = _s.alp * (0.6 + 0.4 * Math.sin(ph * 1.6));
    ctx.strokeStyle = isDark ? "rgba(120,160,200," + _alp * 0.5 + ")" : "rgba(255,255,255," + _alp + ")";
    ctx.beginPath();
    ctx.moveTo(startX - length / 2, baseY);
    ctx.lineTo(startX + length / 2, baseY);
    ctx.stroke();
  }
  ctx.strokeStyle = isDark ? 'rgba(220,220,225,0.55)' : 'rgba(20,30,40,0.55)';
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  for (var _iterator11 = _createForOfIteratorHelperLoose(state.birds), _step11; !(_step11 = _iterator11()).done;) {
    var b = _step11.value;
    b.x += b.sp;
    if (b.x > w + 30) {
      b.x = -30;
      b.y = _rnd(h * 0.15, h * 0.50);
    }
    var flap = Math.sin(t * b.fp + b.ph);
    var wingDip = flap * b.sz * 0.42;
    var by = b.y + py * 0.18;
    ctx.beginPath();
    ctx.moveTo(b.x - b.sz, by + wingDip * 0.3);
    ctx.quadraticCurveTo(b.x - b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x, by);
    ctx.quadraticCurveTo(b.x + b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x + b.sz, by + wingDip * 0.3);
    ctx.stroke();
  }
  if (!isDark) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var _iterator12 = _createForOfIteratorHelperLoose(state.rays), _step12; !(_step12 = _iterator12()).done;) {
      var ray = _step12.value;
      var alp = ray.alp * (0.75 + 0.25 * Math.sin(t * ray.sp + ray.ph));
      var rg = ctx.createLinearGradient(ray.x, 0, ray.x + ray.wid * 0.28, h * 0.78);
      rg.addColorStop(0, "rgba(255,250,220," + alp + ")");
      rg.addColorStop(0.55, "rgba(255,232,170," + alp * 0.45 + ")");
      rg.addColorStop(1, 'rgba(255,210,140,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(ray.x - ray.wid * 0.28, 0);
      ctx.lineTo(ray.x + ray.wid * 0.28, 0);
      ctx.lineTo(ray.x + ray.wid * 1.55, h * 0.78);
      ctx.lineTo(ray.x - ray.wid * 0.75, h * 0.78);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  _stepWind(state, -2.4, 2.4, [25, 70]);
  var rain = state.rain;
  _stepStorm(rain, w, h);
  if (rain.intensity > 0.01) {
    var cloudAlp = rain.intensity * (isDark ? 0.35 : 0.5);
    var cg = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    cg.addColorStop(0, "rgba(20,28,32," + cloudAlp + ")");
    cg.addColorStop(0.6, "rgba(20,28,32," + cloudAlp * 0.55 + ")");
    cg.addColorStop(1, 'rgba(20,28,32,0)');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, w, h);
    var visible = Math.floor(rain.drops.length * rain.intensity);
    ctx.strokeStyle = isDark ? "rgba(170,200,235," + 0.55 * rain.intensity + ")" : "rgba(210,228,245," + 0.65 * rain.intensity + ")";
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    var windPush = state.wind.current * 1.8;
    for (var i = 0; i < visible; i++) {
      var d = rain.drops[i];
      d.x += d.vx + windPush;
      d.y += d.vy;
      if (d.y > h + 20) {
        d.y = -20;
        d.x = _rnd(-40, w + 40);
      }
      if (d.x < -40) {
        d.x = w + 20;
      }
      if (d.x > w + 60) {
        d.x = -20;
      }
      ctx.globalAlpha = d.alp;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + (d.vx + windPush) * 1.4, d.y + d.vy * 1.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  _drawStormFX(ctx, rain, w, h);
}
function _drawTropical(ctx, isDark, state, t, py, w, h) {
  var horizon = state.horizon;
  var washCycle = Math.sin(t * 0.018);
  var washWobble = Math.sin(t * 0.05) * 0.35;
  var washOffset = (washCycle + washWobble) * 14;
  var shoreline = state.shoreline + washOffset;
  var sky = ctx.createLinearGradient(0, 0, 0, horizon + 4);
  if (isDark) {
    sky.addColorStop(0, '#01060e');
    sky.addColorStop(0.30, '#020c1c');
    sky.addColorStop(0.65, '#040f2a');
    sky.addColorStop(1, '#08152e');
  } else {
    sky.addColorStop(0, '#1c2a5a');
    sky.addColorStop(0.20, '#3a3a78');
    sky.addColorStop(0.42, '#a8497c');
    sky.addColorStop(0.62, '#e87749');
    sky.addColorStop(0.85, '#f9b75a');
    sky.addColorStop(1, '#ffd58a');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon + 4);
  if (!isDark) {
    var sx = w * 0.5;
    var sy = horizon - 2;
    var sunR = Math.max(36, w * 0.075);
    var haze = ctx.createRadialGradient(sx, sy, sunR * 0.4, sx, sy, sunR * 4.5);
    haze.addColorStop(0, 'rgba(255,200,120,0.45)');
    haze.addColorStop(0.4, 'rgba(255,170,80,0.18)');
    haze.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, w, horizon + sunR);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, horizon);
    ctx.clip();
    var disc = ctx.createRadialGradient(sx, sy, 0, sx, sy, sunR);
    disc.addColorStop(0, 'rgba(255,238,180,1)');
    disc.addColorStop(0.55, 'rgba(255,200,110,0.95)');
    disc.addColorStop(1, 'rgba(255,150,80,0.85)');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(sx, sy, sunR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    var halo = ctx.createRadialGradient(sx, sy, sunR * 0.6, sx, sy, sunR * 2.6);
    halo.addColorStop(0, 'rgba(255,210,130,0.0)');
    halo.addColorStop(0.4, 'rgba(255,200,120,0.20)');
    halo.addColorStop(1, 'rgba(255,170,80,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, horizon + 4);
  }
  if (isDark) {
    for (var _iterator13 = _createForOfIteratorHelperLoose(state.stars), _step13; !(_step13 = _iterator13()).done;) {
      var s = _step13.value;
      var tw = 0.55 + 0.45 * Math.sin(t * 0.045 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.18, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235,242,255," + s.op * tw + ")";
      ctx.fill();
    }
    var mx = w * 0.74,
      my = h * 0.16 + py * 0.25;
    var mg = ctx.createRadialGradient(mx, my, 0, mx, my, 52);
    mg.addColorStop(0, 'rgba(220,234,255,0.88)');
    mg.addColorStop(0.20, 'rgba(190,212,250,0.38)');
    mg.addColorStop(0.6, 'rgba(150,180,230,0.08)');
    mg.addColorStop(1, 'rgba(120,150,210,0)');
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, w, horizon + 10);
    var ss = state.shooter;
    if (ss) {
      if (!ss.active) {
        ss.nextSpawn -= 1;
        if (ss.nextSpawn <= 0) {
          ss.active = true;
          ss.x = _rnd(w * 0.1, w * 0.7);
          ss.y = _rnd(h * 0.04, horizon * 0.6);
          var ang = _rnd(Math.PI * 0.18, Math.PI * 0.32);
          var spd = _rnd(7, 11);
          ss.vx = Math.cos(ang) * spd;
          ss.vy = Math.sin(ang) * spd;
          ss.max = _rnd(28, 48);
          ss.life = 0;
        }
      } else {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life += 1;
        var fade = ss.life < 6 ? ss.life / 6 : Math.max(0, 1 - (ss.life - 6) / (ss.max - 6));
        var tg = ctx.createLinearGradient(ss.x - ss.vx * 8, ss.y - ss.vy * 8, ss.x, ss.y);
        tg.addColorStop(0, 'rgba(255,255,255,0)');
        tg.addColorStop(1, "rgba(255,255,255," + 0.95 * fade + ")");
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + fade + ")";
        ctx.fill();
        if (ss.life >= ss.max || ss.x > w + 80 || ss.y > horizon) {
          ss.active = false;
          ss.nextSpawn = _rnd(180, 420);
        }
      }
    }
    var plane = state.plane;
    if (plane) {
      if (!plane.active) {
        plane.nextSpawn -= 1;
        if (plane.nextSpawn <= 0) {
          plane.active = true;
          plane.x = -30;
          plane.y = _rnd(h * 0.05, horizon * 0.6);
          plane.vx = _rnd(0.9, 1.6);
        }
      } else {
        plane.x += plane.vx;
        if (plane.x > w + 30) {
          plane.active = false;
          plane.nextSpawn = Math.floor(30 * _rnd(80, 320));
        } else {
          ctx.fillStyle = 'rgba(70,72,82,0.85)';
          ctx.fillRect(plane.x - 6, plane.y, 12, 1.6);
          ctx.fillRect(plane.x - 1, plane.y - 2, 2.4, 5);
          var blinkOn = Math.floor(t / 18) % 2 === 0;
          if (blinkOn) {
            var _halo = ctx.createRadialGradient(plane.x + 5, plane.y, 0, plane.x + 5, plane.y, 9);
            _halo.addColorStop(0, 'rgba(255,40,32,0.65)');
            _halo.addColorStop(0.55, 'rgba(255,40,32,0.18)');
            _halo.addColorStop(1, 'rgba(255,40,32,0)');
            ctx.fillStyle = _halo;
            ctx.fillRect(plane.x - 4, plane.y - 9, 18, 18);
            ctx.beginPath();
            ctx.arc(plane.x + 5, plane.y, 1.7, 0, Math.PI * 2);
            ctx.fillStyle = '#ff2820';
            ctx.fill();
          }
        }
      }
    }
  }
  if (!isDark) {
    ctx.strokeStyle = 'rgba(20,18,30,0.62)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (var _iterator14 = _createForOfIteratorHelperLoose(state.birds), _step14; !(_step14 = _iterator14()).done;) {
      var b = _step14.value;
      b.x += b.sp;
      if (b.x > w + 30) {
        b.x = -30;
        b.y = _rnd(h * 0.10, horizon * 0.65);
      }
      var flap = Math.sin(t * b.fp + b.ph);
      var wingDip = flap * b.sz * 0.42;
      var by = b.y + py * 0.18;
      ctx.beginPath();
      ctx.moveTo(b.x - b.sz, by + wingDip * 0.3);
      ctx.quadraticCurveTo(b.x - b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x, by);
      ctx.quadraticCurveTo(b.x + b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x + b.sz, by + wingDip * 0.3);
      ctx.stroke();
    }
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, horizon, w, shoreline - horizon);
  ctx.clip();
  var waterFill = ctx.createLinearGradient(0, horizon, 0, shoreline);
  if (isDark) {
    waterFill.addColorStop(0, '#040f1e');
    waterFill.addColorStop(1, '#02060e');
  } else {
    waterFill.addColorStop(0, '#88c4cf');
    waterFill.addColorStop(0.7, '#e0b18a');
    waterFill.addColorStop(1, '#f0c89a');
  }
  ctx.fillStyle = waterFill;
  ctx.fillRect(0, horizon, w, shoreline - horizon);
  for (var _iterator15 = _createForOfIteratorHelperLoose(state.waves), _step15; !(_step15 = _iterator15()).done;) {
    var wv = _step15.value;
    wv.ph += wv.sp;
    var baseY = wv.y0 + py * 0.15;
    ctx.beginPath();
    ctx.moveTo(-10, shoreline + 10);
    ctx.lineTo(-10, baseY);
    for (var _x3 = -10; _x3 <= w + 10; _x3 += 5) {
      var y = baseY + Math.sin(_x3 * wv.freq + wv.ph) * wv.amp + Math.sin(_x3 * wv.freq * 2.3 + wv.ph * 0.85) * wv.amp * 0.38;
      ctx.lineTo(_x3, y);
    }
    ctx.lineTo(w + 10, shoreline + 10);
    ctx.closePath();
    ctx.fillStyle = wv.col;
    ctx.fill();
  }
  for (var _iterator16 = _createForOfIteratorHelperLoose(state.sparkles), _step16; !(_step16 = _iterator16()).done;) {
    var sp = _step16.value;
    sp.ph += sp.sp;
    var alp = Math.pow(Math.max(0, Math.sin(sp.ph)), 2) * 0.88;
    if (alp < 0.02) continue;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y + py * 0.12, sp.sz * alp, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "rgba(175,215,255," + alp * 0.72 + ")" : "rgba(255,236,170," + alp * 0.85 + ")";
    ctx.fill();
  }
  if (!isDark) {
    var _sx = w * 0.5;
    var pillar = ctx.createLinearGradient(_sx, horizon, _sx, shoreline);
    pillar.addColorStop(0, 'rgba(255,220,150,0.55)');
    pillar.addColorStop(0.6, 'rgba(255,200,120,0.18)');
    pillar.addColorStop(1, 'rgba(255,180,80,0)');
    ctx.fillStyle = pillar;
    ctx.fillRect(_sx - 40, horizon, 80, shoreline - horizon);
  }
  ctx.restore();
  if (!isDark && state.sailboat) {
    var sb = state.sailboat;
    if (!sb.active) {
      sb.nextSpawn -= 1;
      if (sb.nextSpawn <= 0) {
        sb.active = true;
        sb.dir = Math.random() < 0.5 ? 1 : -1;
        sb.x = sb.dir === 1 ? -25 : w + 25;
        sb.vx = sb.dir * _rnd(0.10, 0.20);
        sb.scale = _rnd(0.85, 1.20);
      }
    } else {
      sb.x += sb.vx;
      if (sb.dir === 1 && sb.x > w + 25 || sb.dir === -1 && sb.x < -25) {
        sb.active = false;
        sb.nextSpawn = Math.floor(30 * _rnd(30, 180));
      } else {
        var _s2 = sb.scale;
        var bx = sb.x;
        var _by = horizon + 2;
        var lean = -sb.dir;
        var mastH = 14 * _s2;
        ctx.fillStyle = 'rgba(36,26,18,0.85)';
        ctx.fillRect(bx - 6 * _s2, _by, 12 * _s2, 1.8 * _s2);
        ctx.fillStyle = 'rgba(60,46,30,0.85)';
        ctx.fillRect(bx - 0.4, _by - mastH, 0.8, mastH);
        ctx.fillStyle = 'rgba(255,250,238,0.92)';
        ctx.beginPath();
        ctx.moveTo(bx, _by - mastH);
        ctx.lineTo(bx + lean * 7 * _s2, _by);
        ctx.lineTo(bx, _by);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(245,238,220,0.85)';
        ctx.beginPath();
        ctx.moveTo(bx, _by - mastH * 0.95);
        ctx.lineTo(bx - lean * 3.5 * _s2, _by);
        ctx.lineTo(bx, _by);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fillRect(bx - 7 * _s2, _by + 1.8 * _s2, 14 * _s2, 0.6);
      }
    }
  }
  var wetBand = 16;
  var wetGrad = ctx.createLinearGradient(0, shoreline, 0, shoreline + wetBand);
  if (isDark) {
    wetGrad.addColorStop(0, '#1b1a16');
    wetGrad.addColorStop(1, '#2a261f');
  } else {
    wetGrad.addColorStop(0, '#8d7250');
    wetGrad.addColorStop(1, '#b89473');
  }
  ctx.fillStyle = wetGrad;
  ctx.fillRect(0, shoreline, w, wetBand);
  var foamColor = isDark ? 'rgba(220,230,245,' : 'rgba(255,255,255,';
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, shoreline + 8);
  for (var x = 0; x <= w; x += 6) {
    var yWobble = Math.sin(x * 0.05 + t * 0.06) * 2.4 + Math.sin(x * 0.012 + t * 0.025) * 3.0;
    ctx.lineTo(x, shoreline - 1 + yWobble);
  }
  ctx.lineTo(w, shoreline + 8);
  ctx.closePath();
  ctx.fillStyle = foamColor + "0.45)";
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, shoreline + 2);
  for (var _x2 = 0; _x2 <= w; _x2 += 4) {
    var _yWobble = Math.sin(_x2 * 0.07 + t * 0.08) * 1.4 + Math.sin(_x2 * 0.018 + t * 0.04) * 1.8;
    ctx.lineTo(_x2, shoreline - 2 + _yWobble);
  }
  ctx.lineTo(w, shoreline + 2);
  ctx.closePath();
  ctx.fillStyle = foamColor + "0.85)";
  ctx.fill();
  ctx.restore();
  var sandGrad = ctx.createLinearGradient(0, shoreline + wetBand, 0, h);
  if (isDark) {
    sandGrad.addColorStop(0, '#2c2620');
    sandGrad.addColorStop(1, '#1a160f');
  } else {
    sandGrad.addColorStop(0, '#e7c9a0');
    sandGrad.addColorStop(1, '#cdab7e');
  }
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, shoreline + wetBand, w, h - shoreline - wetBand);
  ctx.fillStyle = isDark ? 'rgba(255,240,200,0.04)' : 'rgba(120,90,50,0.10)';
  for (var i = 0; i < 70; i++) {
    var gx = (i * 73 + (t & 0)) * 17 % w;
    var gy = shoreline + wetBand + i * 137 % (h - shoreline - wetBand);
    ctx.fillRect(gx, gy, 1, 1);
  }
  for (var _iterator17 = _createForOfIteratorHelperLoose(state.shells), _step17; !(_step17 = _iterator17()).done;) {
    var sh = _step17.value;
    ctx.save();
    ctx.translate(sh.x, sh.y);
    ctx.rotate(sh.rot);
    ctx.fillStyle = sh.col;
    if (isDark) ctx.globalAlpha = 0.55;
    if (sh.type === 'scallop') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, sh.size, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(140,90,50,0.4)';
      ctx.lineWidth = 0.5;
      for (var _i9 = 1; _i9 < 4; _i9++) {
        var a = Math.PI + Math.PI / 4 * _i9;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * sh.size, Math.sin(a) * sh.size);
        ctx.stroke();
      }
    } else if (sh.type === 'cone') {
      ctx.beginPath();
      ctx.moveTo(-sh.size * 0.5, 0);
      ctx.lineTo(sh.size * 0.5, 0);
      ctx.lineTo(0, -sh.size * 1.4);
      ctx.closePath();
      ctx.fill();
    } else if (sh.type === 'spiral') {
      ctx.beginPath();
      ctx.ellipse(0, 0, sh.size * 1.1, sh.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(140,90,50,0.5)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(sh.size * 0.15, 0, sh.size * 0.45, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, sh.size * 1.2, sh.size * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.ellipse(-sh.size * 0.3, -sh.size * 0.2, sh.size * 0.45, sh.size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  var crab = state.crab;
  if (!crab.active) {
    crab.nextSpawn -= 1;
    if (crab.nextSpawn <= 0) {
      crab.active = true;
      var dir = Math.random() < 0.5 ? 1 : -1;
      crab.vx = dir * _rnd(0.35, 0.6);
      crab.x = dir === 1 ? -16 : w + 16;
      crab.y = _rnd(shoreline + wetBand + 6, h - 12);
      crab.legPhase = 0;
    }
  } else {
    crab.x += crab.vx;
    crab.legPhase += 0.18;
    var cx = crab.x,
      cy = crab.y;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 8, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? '#8a3c2c' : '#c64a32';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 6.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(cx - 2, cy - 4.5, 1.2, 1.2);
    ctx.fillRect(cx + 1, cy - 4.5, 1.2, 1.2);
    ctx.fillStyle = isDark ? '#8a3c2c' : '#c64a32';
    var clawDir = Math.sign(crab.vx) || 1;
    ctx.beginPath();
    ctx.ellipse(cx + 6 * clawDir, cy - 1.5, 2.8, 2.0, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - 5 * clawDir, cy - 1, 2.4, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isDark ? '#742d22' : '#a13a26';
    ctx.lineWidth = 1.0;
    ctx.lineCap = 'round';
    for (var _i8 = 0; _i8 < 3; _i8++) {
      var off = (_i8 - 1) * 2.4;
      var lift = Math.sin(crab.legPhase + _i8 * 1.7) * 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - 3.5, cy + 0.6 + off * 0.2);
      ctx.lineTo(cx - 6.5, cy + 2.4 + off * 0.2 - lift);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 3.5, cy + 0.6 + off * 0.2);
      ctx.lineTo(cx + 6.5, cy + 2.4 + off * 0.2 - lift);
      ctx.stroke();
    }
    if (crab.vx > 0 && cx > w + 16 || crab.vx < 0 && cx < -16) {
      crab.active = false;
      crab.nextSpawn = Math.floor(30 * _rnd(45, 150));
    }
  }
}
function _drawMadison(ctx, isDark, state, t, py, w, h) {
  var sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0, '#02041a');
    sky.addColorStop(0.20, '#040a26');
    sky.addColorStop(0.45, '#06112e');
    sky.addColorStop(0.70, '#040a22');
    sky.addColorStop(0.90, '#020618');
    sky.addColorStop(1, '#01030d');
  } else {
    sky.addColorStop(0, '#79c2ea');
    sky.addColorStop(0.22, '#9ed3ee');
    sky.addColorStop(0.50, '#c6e5f4');
    sky.addColorStop(0.75, '#e5f1f7');
    sky.addColorStop(1, '#f4f8fa');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  _stepWind(state, -3.4, 3.4, [25, 65]);
  var rain = state.rain;
  if (!isDark) {
    _stepStorm(rain, w, h);
  } else {
    rain.intensity = 0;
    rain.stormPower = 0;
    rain.flash = 0;
    rain.bolt = null;
  }
  if (!isDark) {
    var sx = w * 0.82,
      sy = h * 0.13 + py * 0.25;
    var sunAlp = 1 - rain.intensity * 0.85;
    var sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.34);
    sg.addColorStop(0, "rgba(255,244,180," + 0.95 * sunAlp + ")");
    sg.addColorStop(0.18, "rgba(255,228,130," + 0.55 * sunAlp + ")");
    sg.addColorStop(0.55, "rgba(255,200,90," + 0.18 * sunAlp + ")");
    sg.addColorStop(1, 'rgba(255,180,60,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, w, h);
  } else {
    var mx = w * 0.18,
      my = h * 0.13 + py * 0.25;
    var mg = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
    mg.addColorStop(0, 'rgba(220,234,255,0.90)');
    mg.addColorStop(0.20, 'rgba(190,212,250,0.42)');
    mg.addColorStop(0.55, 'rgba(150,180,230,0.10)');
    mg.addColorStop(1, 'rgba(120,150,210,0)');
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, w, h);
  }
  if (isDark) {
    for (var _iterator18 = _createForOfIteratorHelperLoose(state.stars), _step18; !(_step18 = _iterator18()).done;) {
      var s = _step18.value;
      var tw = 0.55 + 0.45 * Math.sin(t * 0.045 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.18, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235,242,255," + s.op * tw + ")";
      ctx.fill();
    }
    var ss = state.shooter;
    if (ss) {
      if (!ss.active) {
        ss.nextSpawn -= 1;
        if (ss.nextSpawn <= 0) {
          ss.active = true;
          ss.x = _rnd(w * 0.1, w * 0.7);
          ss.y = _rnd(h * 0.04, h * 0.30);
          var ang = _rnd(Math.PI * 0.18, Math.PI * 0.32);
          var spd = _rnd(7, 11);
          ss.vx = Math.cos(ang) * spd;
          ss.vy = Math.sin(ang) * spd;
          ss.max = _rnd(28, 48);
          ss.life = 0;
        }
      } else {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life += 1;
        var fade = ss.life < 6 ? ss.life / 6 : Math.max(0, 1 - (ss.life - 6) / (ss.max - 6));
        var tg = ctx.createLinearGradient(ss.x - ss.vx * 8, ss.y - ss.vy * 8, ss.x, ss.y);
        tg.addColorStop(0, 'rgba(255,255,255,0)');
        tg.addColorStop(1, "rgba(255,255,255," + 0.95 * fade + ")");
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + fade + ")";
        ctx.fill();
        if (ss.life >= ss.max || ss.x > w + 80 || ss.y > h * 0.55) {
          ss.active = false;
          ss.nextSpawn = _rnd(180, 420);
        }
      }
    }
    var plane = state.plane;
    if (!plane.active) {
      plane.nextSpawn -= 1;
      if (plane.nextSpawn <= 0) {
        plane.active = true;
        plane.x = -30;
        plane.y = _rnd(h * 0.05, h * 0.30);
        plane.vx = _rnd(0.9, 1.6);
      }
    } else {
      plane.x += plane.vx;
      if (plane.x > w + 30) {
        plane.active = false;
        plane.nextSpawn = Math.floor(30 * _rnd(90, 360));
      } else {
        ctx.fillStyle = 'rgba(70,72,82,0.85)';
        ctx.fillRect(plane.x - 6, plane.y, 12, 1.6);
        ctx.fillRect(plane.x - 1, plane.y - 2, 2.4, 5);
        var blinkOn = Math.floor(t / 18) % 2 === 0;
        if (blinkOn) {
          var halo = ctx.createRadialGradient(plane.x + 5, plane.y, 0, plane.x + 5, plane.y, 9);
          halo.addColorStop(0, 'rgba(255,40,32,0.65)');
          halo.addColorStop(0.55, 'rgba(255,40,32,0.18)');
          halo.addColorStop(1, 'rgba(255,40,32,0)');
          ctx.fillStyle = halo;
          ctx.fillRect(plane.x - 4, plane.y - 9, 18, 18);
          ctx.beginPath();
          ctx.arc(plane.x + 5, plane.y, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = '#ff2820';
          ctx.fill();
        }
      }
    }
  }
  if (!isDark) {
    for (var _iterator19 = _createForOfIteratorHelperLoose(state.clouds), _step19; !(_step19 = _iterator19()).done;) {
      var c = _step19.value;
      c.x += state.wind.current * 0.35 + c.baseDrift;
      if (c.x > w + 120) c.x = -180;
      if (c.x < -180) c.x = w + 120;
      var baseR = 22 * c.scale;
      var cy = c.y + py * 0.3;
      var alp = c.alpha * (1 - Math.min(1, rain.intensity * 1.4));
      if (alp < 0.03) continue;
      ctx.save();
      ctx.globalAlpha = alp;
      var lobes = [[0, 0, 1.55], [baseR * 0.62, baseR * 0.10, 1.10], [-baseR * 0.55, baseR * 0.16, 1.00], [baseR * 0.30, -baseR * 0.30, 0.85], [-baseR * 0.22, -baseR * 0.22, 0.78], [baseR * 1.00, baseR * 0.25, 0.70]];
      for (var _i0 = 0, _lobes = lobes; _i0 < _lobes.length; _i0++) {
        var _lobes$_i = _lobes[_i0],
          ox = _lobes$_i[0],
          oy = _lobes$_i[1],
          rf = _lobes$_i[2];
        var cg = ctx.createRadialGradient(c.x + ox, cy + oy, 0, c.x + ox, cy + oy, baseR * rf);
        cg.addColorStop(0, 'rgba(255,255,255,0.95)');
        cg.addColorStop(0.5, 'rgba(248,252,255,0.55)');
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(c.x + ox, cy + oy, baseR * rf, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
  if (!isDark && rain.intensity > 0.01) {
    var cloudAlp = rain.intensity * 0.55;
    var _cg = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    _cg.addColorStop(0, "rgba(30,38,46," + cloudAlp + ")");
    _cg.addColorStop(0.6, "rgba(30,38,46," + cloudAlp * 0.55 + ")");
    _cg.addColorStop(1, 'rgba(30,38,46,0)');
    ctx.fillStyle = _cg;
    ctx.fillRect(0, 0, w, h);
  }
  var groundY = state.groundY + py * 0.55;
  var lakeBottom = h;
  var lakeHeight = lakeBottom - groundY;
  var lakeGrad = ctx.createLinearGradient(0, groundY, 0, lakeBottom);
  if (isDark) {
    lakeGrad.addColorStop(0, '#020414');
    lakeGrad.addColorStop(0.7, '#01030c');
    lakeGrad.addColorStop(1, '#000206');
  } else {
    lakeGrad.addColorStop(0, '#6a9bbf');
    lakeGrad.addColorStop(0.6, '#4f7c9c');
    lakeGrad.addColorStop(1, '#3a5e7a');
  }
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, groundY, w, lakeHeight);
  ctx.fillStyle = isDark ? 'rgba(255,220,150,0.12)' : 'rgba(255,255,255,0.45)';
  ctx.fillRect(0, groundY, w, 1.5);
  var reflections = [];
  var drawBuilding = function drawBuilding(b) {
    var baseY = groundY;
    var topY = baseY - b.height;
    var left = b.x - b.width / 2;
    ctx.fillStyle = isDark ? b.isCapitol ? '#1a1a26' : '#0c0d18' : b.isCapitol ? '#e6ddc2' : '#576f7e';
    ctx.fillRect(left, topY, b.width, b.height);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)';
    ctx.fillRect(left, topY, 1.5, b.height);
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)';
    ctx.fillRect(left + b.width - 1.5, topY, 1.5, b.height);
    var cols = b.cols,
      rows = b.rows;
    var padX = b.width * 0.10;
    var padY = b.height * 0.06;
    var cellW = (b.width - padX * 2) / cols;
    var cellH = (b.height - padY * 2) / rows;
    var wW = Math.min(cellW * 0.55, 10);
    var wH = Math.min(cellH * 0.55, 12);
    var idx = 0;
    for (var r = 0; r < rows; r++) {
      for (var _c2 = 0; _c2 < cols; _c2++) {
        var win = b.windows[idx++];
        if (!win) continue;
        var wx = left + padX + _c2 * cellW + (cellW - wW) / 2;
        var wy = topY + padY + r * cellH + (cellH - wH) / 2;
        if (isDark) {
          if (win.on) {
            var fl = 0.85 + 0.15 * Math.sin(t * 0.08 + idx % 7);
            var tint = idx % 31 === 0 ? 'rgba(255,80,60,' : idx % 23 === 0 ? 'rgba(200,220,255,' : 'rgba(255,220,120,';
            ctx.fillStyle = "" + tint + fl + ")";
            ctx.fillRect(wx, wy, wW, wH);
            if (idx % 6 === 0) {
              reflections.push({
                x: wx + wW / 2,
                color: tint,
                alpha: 0.30 * fl,
                width: wW * 2.4
              });
            }
          } else {
            ctx.fillStyle = 'rgba(10,12,22,0.85)';
            ctx.fillRect(wx, wy, wW, wH);
          }
        } else {
          ctx.fillStyle = b.isCapitol ? 'rgba(120,110,80,0.55)' : 'rgba(30,50,75,0.55)';
          ctx.fillRect(wx, wy, wW, wH);
        }
      }
    }
  };
  var drawCapitol = function drawCapitol() {
    var cap = state.capitol;
    var baseY = groundY;
    var mainTop = baseY - cap.height;
    var mainLeft = cap.x - cap.width / 2;
    var wingW = cap.width * 0.55;
    var wingH = cap.height * 0.62;
    var wingTop = baseY - wingH;
    ctx.fillStyle = isDark ? '#15151f' : '#dccfb0';
    ctx.fillRect(mainLeft - wingW + 4, wingTop, wingW, wingH);
    ctx.fillRect(mainLeft + cap.width - 4, wingTop, wingW, wingH);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)';
    ctx.fillRect(mainLeft - wingW + 4, wingTop, 1.2, wingH);
    ctx.fillRect(mainLeft + cap.width - 4, wingTop, 1.2, wingH);
    var drawWingWindows = function drawWingWindows(wLeft, wTop) {
      var colsW = Math.max(3, Math.floor(wingW / 12));
      var rowsW = Math.max(2, Math.floor(wingH / 16));
      var padX = wingW * 0.10,
        padY = wingH * 0.08;
      var cellW = (wingW - padX * 2) / colsW;
      var cellH = (wingH - padY * 2) / rowsW;
      var wW = Math.min(cellW * 0.55, 8);
      var wH = Math.min(cellH * 0.5, 9);
      var n = 0;
      for (var r = 0; r < rowsW; r++) {
        for (var _c3 = 0; _c3 < colsW; _c3++) {
          n++;
          var wx = wLeft + padX + _c3 * cellW + (cellW - wW) / 2;
          var wy = wTop + padY + r * cellH + (cellH - wH) / 2;
          if (isDark) {
            var on = (cap.windows[n % cap.windows.length] || {}).on;
            if (on) {
              var fl = 0.85 + 0.15 * Math.sin(t * 0.08 + n);
              ctx.fillStyle = "rgba(255,220,120," + fl + ")";
              ctx.fillRect(wx, wy, wW, wH);
              if (n % 5 === 0) {
                reflections.push({
                  x: wx + wW / 2,
                  color: 'rgba(255,220,120,',
                  alpha: 0.22 * fl,
                  width: wW * 2.2
                });
              }
            } else {
              ctx.fillStyle = 'rgba(10,12,22,0.85)';
              ctx.fillRect(wx, wy, wW, wH);
            }
          } else {
            ctx.fillStyle = 'rgba(110,100,70,0.55)';
            ctx.fillRect(wx, wy, wW, wH);
          }
        }
      }
    };
    drawWingWindows(mainLeft - wingW + 4, wingTop);
    drawWingWindows(mainLeft + cap.width - 4, wingTop);
    ctx.fillStyle = isDark ? '#1c1c2a' : '#ece1c5';
    ctx.fillRect(mainLeft, mainTop, cap.width, cap.height);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.14)';
    ctx.fillRect(mainLeft, mainTop, 1.5, cap.height);
    {
      var cols = cap.cols,
        rows = cap.rows;
      var padX = cap.width * 0.10;
      var padY = cap.height * 0.05;
      var cellW = (cap.width - padX * 2) / cols;
      var cellH = (cap.height - padY * 2) / rows;
      var wW = Math.min(cellW * 0.55, 10);
      var wH = Math.min(cellH * 0.55, 12);
      var idx = 0;
      for (var r = 0; r < rows; r++) {
        for (var _c4 = 0; _c4 < cols; _c4++) {
          var win = cap.windows[idx++];
          if (!win) continue;
          var wx = mainLeft + padX + _c4 * cellW + (cellW - wW) / 2;
          var wy = mainTop + padY + r * cellH + (cellH - wH) / 2;
          if (isDark) {
            if (win.on) {
              var fl = 0.85 + 0.15 * Math.sin(t * 0.08 + idx);
              ctx.fillStyle = "rgba(255,228,140," + fl + ")";
              ctx.fillRect(wx, wy, wW, wH);
              if (idx % 7 === 0) {
                reflections.push({
                  x: wx + wW / 2,
                  color: 'rgba(255,228,140,',
                  alpha: 0.28 * fl,
                  width: wW * 2.2
                });
              }
            } else {
              ctx.fillStyle = 'rgba(10,12,22,0.85)';
              ctx.fillRect(wx, wy, wW, wH);
            }
          } else {
            ctx.fillStyle = 'rgba(120,110,80,0.55)';
            ctx.fillRect(wx, wy, wW, wH);
          }
        }
      }
    }
    var domeR = cap.domeRadius;
    var drumW = domeR * 2.1;
    var drumH = domeR * 0.55;
    var drumTopY = mainTop - drumH;
    ctx.fillStyle = isDark ? '#22222e' : '#f1ead4';
    ctx.fillRect(cap.x - drumW / 2, drumTopY, drumW, drumH);
    ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(80,70,40,0.35)';
    ctx.lineWidth = 1;
    for (var i = 1; i < 8; i++) {
      var cx = cap.x - drumW / 2 + drumW / 8 * i;
      ctx.beginPath();
      ctx.moveTo(cx, drumTopY + 2);
      ctx.lineTo(cx, drumTopY + drumH - 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cap.x, drumTopY, domeR, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#2a2a3a' : '#f6efd7';
    ctx.fill();
    ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.30)' : 'rgba(120,100,50,0.35)';
    ctx.lineWidth = 0.8;
    for (var _i1 = 1; _i1 < 5; _i1++) {
      var _ang = Math.PI + Math.PI / 5 * _i1;
      ctx.beginPath();
      ctx.moveTo(cap.x, drumTopY);
      ctx.lineTo(cap.x + Math.cos(_ang) * domeR, drumTopY + Math.sin(_ang) * domeR);
      ctx.stroke();
    }
    var cupolaW = domeR * 0.55;
    var cupolaH = domeR * 0.45;
    var cupolaTopY = drumTopY - domeR - cupolaH;
    ctx.fillStyle = isDark ? '#2a2a3a' : '#f6efd7';
    ctx.fillRect(cap.x - cupolaW / 2, cupolaTopY, cupolaW, cupolaH);
    var spireH = domeR * 0.95;
    ctx.beginPath();
    ctx.moveTo(cap.x, cupolaTopY - spireH);
    ctx.lineTo(cap.x - cupolaW * 0.18, cupolaTopY);
    ctx.lineTo(cap.x + cupolaW * 0.18, cupolaTopY);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#2a2a3a' : '#c8b870';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cap.x, cupolaTopY - spireH - 3, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#f5b400' : '#c69214';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cap.x - 4, cupolaTopY - spireH - 1);
    ctx.lineTo(cap.x + 4, cupolaTopY - spireH - 1);
    ctx.strokeStyle = isDark ? '#f5b400' : '#a07b1c';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    if (isDark) {
      var haloR = domeR * 3.4;
      var _halo2 = ctx.createRadialGradient(cap.x, drumTopY - domeR * 0.3, 0, cap.x, drumTopY - domeR * 0.3, haloR);
      _halo2.addColorStop(0, 'rgba(255,228,148,0.42)');
      _halo2.addColorStop(0.45, 'rgba(255,205,100,0.16)');
      _halo2.addColorStop(1, 'rgba(255,205,100,0)');
      ctx.fillStyle = _halo2;
      ctx.fillRect(cap.x - haloR, drumTopY - haloR, haloR * 2, haloR * 2);
      var rim = ctx.createRadialGradient(cap.x, drumTopY + 4, domeR * 0.6, cap.x, drumTopY + 4, domeR * 1.05);
      rim.addColorStop(0, 'rgba(255,228,148,0)');
      rim.addColorStop(0.9, 'rgba(255,228,148,0.32)');
      rim.addColorStop(1, 'rgba(255,228,148,0)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cap.x, drumTopY, domeR * 1.05, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cap.x, drumTopY, domeR, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,238,180,0.20)';
      ctx.fill();
      reflections.push({
        x: cap.x,
        color: 'rgba(255,228,148,',
        alpha: 0.35,
        width: domeR * 2.0
      });
    }
  };
  for (var _iterator20 = _createForOfIteratorHelperLoose(state.buildings), _step20; !(_step20 = _iterator20()).done;) {
    var _b = _step20.value;
    drawBuilding(_b);
  }
  drawCapitol();
  if (isDark && state.spotlights) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, groundY);
    ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    var cap = state.capitol;
    var drumTopY = groundY - cap.height - cap.domeRadius * 0.55;
    for (var _iterator21 = _createForOfIteratorHelperLoose(state.spotlights), _step21; !(_step21 = _iterator21()).done;) {
      var sl = _step21.value;
      var u = 0.5 + 0.5 * Math.sin(t * sl.sp + sl.ph);
      var _ang2 = sl.a0 + (sl.a1 - sl.a0) * u;
      var beamLen = Math.hypot(cap.x - sl.ox, drumTopY - sl.oy) + cap.domeRadius * 1.5;
      var spread = 0.085;
      var ax = sl.ox + Math.cos(_ang2) * beamLen;
      var ay = sl.oy + Math.sin(_ang2) * beamLen;
      var px1 = ax + Math.cos(_ang2 + Math.PI / 2) * beamLen * spread;
      var py1 = ay + Math.sin(_ang2 + Math.PI / 2) * beamLen * spread;
      var px2 = ax + Math.cos(_ang2 - Math.PI / 2) * beamLen * spread;
      var py2 = ay + Math.sin(_ang2 - Math.PI / 2) * beamLen * spread;
      var grad = ctx.createLinearGradient(sl.ox, sl.oy, ax, ay);
      grad.addColorStop(0, 'rgba(255,236,180,0.55)');
      grad.addColorStop(0.5, 'rgba(255,228,148,0.20)');
      grad.addColorStop(1, 'rgba(255,228,148,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sl.ox, sl.oy);
      ctx.lineTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.closePath();
      ctx.fill();
      var lamp = ctx.createRadialGradient(sl.ox, sl.oy, 0, sl.ox, sl.oy, 7);
      lamp.addColorStop(0, 'rgba(255,236,180,0.85)');
      lamp.addColorStop(1, 'rgba(255,236,180,0)');
      ctx.fillStyle = lamp;
      ctx.fillRect(sl.ox - 7, sl.oy - 7, 14, 14);
    }
    ctx.restore();
  }
  {
    var tr = state.terrace;
    var baseY = groundY;
    var topY = baseY - tr.height;
    var left = tr.cx - tr.width / 2;
    var archCount = tr.numArches;
    var archW = tr.width / archCount;
    var archH = tr.height * 0.85;
    ctx.fillStyle = isDark ? '#0d0d14' : '#1a1d22';
    ctx.fillRect(left, topY, tr.width, tr.height * 0.16);
    ctx.fillStyle = isDark ? '#1c1c24' : '#3a3a40';
    ctx.fillRect(left, topY + tr.height * 0.16, tr.width, tr.height - tr.height * 0.16);
    var archInsetTop = tr.height * 0.20;
    var archInnerH = tr.height - archInsetTop - 2;
    var colW = Math.max(2, archW * 0.10);
    for (var i = 0; i < archCount; i++) {
      var _ax = left + i * archW + colW / 2;
      var openW = archW - colW;
      var cxArch = _ax + openW / 2;
      var arcTopY = topY + archInsetTop;
      var radius = openW / 2;
      var fillTop = isDark ? '#fff1bf' : '#a9c5d5';
      var fillMid = isDark ? '#ffd485' : '#c9d8e0';
      var _grad = ctx.createLinearGradient(0, arcTopY, 0, baseY);
      _grad.addColorStop(0, fillTop);
      _grad.addColorStop(0.6, fillMid);
      _grad.addColorStop(1, isDark ? '#a07a30' : '#8fa3ad');
      ctx.fillStyle = _grad;
      ctx.beginPath();
      ctx.moveTo(cxArch - radius, baseY);
      ctx.lineTo(cxArch - radius, arcTopY + radius);
      ctx.arc(cxArch, arcTopY + radius, radius, Math.PI, 0);
      ctx.lineTo(cxArch + radius, baseY);
      ctx.closePath();
      ctx.fill();
      if (isDark) {
        var glow = ctx.createRadialGradient(cxArch, arcTopY + radius * 1.4, 0, cxArch, arcTopY + radius * 1.4, radius * 1.6);
        glow.addColorStop(0, 'rgba(255,232,158,0.55)');
        glow.addColorStop(0.6, 'rgba(255,200,90,0.15)');
        glow.addColorStop(1, 'rgba(255,200,90,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(cxArch - radius * 1.8, arcTopY - radius * 0.4, radius * 3.6, archInnerH + radius * 1.2);
        reflections.push({
          x: cxArch,
          color: 'rgba(255,220,140,',
          alpha: 0.30,
          width: openW * 0.9
        });
      }
    }
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.35)';
    ctx.fillRect(left, topY + tr.height * 0.155, tr.width, 1);
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)';
    ctx.fillRect(left, baseY - 1, tr.width, 1.5);
  }
  var carY = groundY - 4;
  var visibleCars = [];
  for (var _iterator22 = _createForOfIteratorHelperLoose(state.cars), _step22; !(_step22 = _iterator22()).done;) {
    var _car = _step22.value;
    if (_car.delay > 0) {
      _car.delay -= 1;
      continue;
    }
    _car.x += _car.dir * _car.sp;
    if (_car.dir === 1 && _car.x > w + 12) {
      _car.x = -12;
      _car.delay = Math.floor(30 * _rnd(30, 240));
      continue;
    }
    if (_car.dir === -1 && _car.x < -12) {
      _car.x = w + 12;
      _car.delay = Math.floor(30 * _rnd(30, 240));
      continue;
    }
    visibleCars.push(_car);
    if (isDark) {
      reflections.push({
        x: _car.x,
        color: 'rgba(255,232,140,',
        alpha: 0.22,
        width: 9
      });
    }
  }
  ctx.save();
  if (typeof ctx.filter === 'string') ctx.filter = 'blur(3px)';
  for (var _i10 = 0, _reflections = reflections; _i10 < _reflections.length; _i10++) {
    var r = _reflections[_i10];
    var sway = Math.sin(t * 0.04 + r.x * 0.013) * 1.6;
    var rx = r.x + sway;
    var _grad2 = ctx.createLinearGradient(rx, groundY, rx, lakeBottom);
    _grad2.addColorStop(0, "" + r.color + r.alpha + ")");
    _grad2.addColorStop(0.55, "" + r.color + r.alpha * 0.45 + ")");
    _grad2.addColorStop(1, r.color + "0)");
    ctx.fillStyle = _grad2;
    ctx.fillRect(rx - r.width / 2, groundY, r.width, lakeHeight);
  }
  ctx.restore();
  if (isDark) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
  }
  for (var yy = groundY + 10; yy < lakeBottom; yy += 14) {
    var wob = Math.sin(t * 0.05 + yy * 0.07) * 2;
    ctx.fillRect(0, yy + wob, w, 1);
  }
  for (var _i11 = 0, _visibleCars = visibleCars; _i11 < _visibleCars.length; _i11++) {
    var car = _visibleCars[_i11];
    var _cy = carY;
    var headX = car.dir === 1 ? car.x + car.len / 2 : car.x - car.len / 2;
    var tailX = car.dir === 1 ? car.x - car.len / 2 : car.x + car.len / 2;
    if (isDark) {
      ctx.fillStyle = '#0d0e16';
      ctx.fillRect(car.x - car.len / 2, _cy, car.len, 2.2);
      var hl = ctx.createRadialGradient(headX, _cy + 1, 0, headX, _cy + 1, 9);
      hl.addColorStop(0, 'rgba(255,244,180,0.95)');
      hl.addColorStop(0.5, 'rgba(255,232,140,0.32)');
      hl.addColorStop(1, 'rgba(255,232,140,0)');
      ctx.fillStyle = hl;
      ctx.fillRect(headX - 9, _cy - 7, 18, 16);
      ctx.fillStyle = 'rgba(255,250,210,1)';
      ctx.fillRect(headX - 0.6, _cy + 0.3, 1.6, 1.6);
      ctx.fillStyle = 'rgba(255,60,40,0.95)';
      ctx.fillRect(tailX - 0.7, _cy + 0.4, 1.4, 1.4);
    } else {
      ctx.fillStyle = car.col;
      ctx.fillRect(car.x - car.len / 2, _cy, car.len, 2.2);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(car.x - 0.5, _cy - 0.4, car.len * 0.35, 0.8);
    }
  }
  if (isDark) {
    var tickAll = function tickAll(b) {
      for (var _iterator23 = _createForOfIteratorHelperLoose(b.windows), _step23; !(_step23 = _iterator23()).done;) {
        var win = _step23.value;
        win.flipAt -= 1;
        if (win.flipAt <= 0) {
          win.on = Math.random() < (win.on ? 0.62 : 0.18);
          win.flipAt = Math.floor(30 * _rnd(60, 300));
        }
      }
    };
    for (var _iterator24 = _createForOfIteratorHelperLoose(state.buildings), _step24; !(_step24 = _iterator24()).done;) {
      var b = _step24.value;
      tickAll(b);
    }
    tickAll(state.capitol);
  }
  if (rain.intensity > 0.01) {
    var visible = Math.floor(rain.drops.length * rain.intensity);
    ctx.strokeStyle = isDark ? "rgba(170,200,235," + 0.55 * rain.intensity + ")" : "rgba(210,228,245," + 0.65 * rain.intensity + ")";
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    var windPush = state.wind.current * 1.8;
    for (var _i12 = 0; _i12 < visible; _i12++) {
      var d = rain.drops[_i12];
      d.x += d.vx + windPush;
      d.y += d.vy;
      if (d.y > h + 20) {
        d.y = -20;
        d.x = _rnd(-40, w + 40);
      }
      if (d.x < -40) {
        d.x = w + 20;
      }
      if (d.x > w + 60) {
        d.x = -20;
      }
      ctx.globalAlpha = d.alp;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + (d.vx + windPush) * 1.4, d.y + d.vy * 1.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  if (!isDark) _drawStormFX(ctx, rain, w, h);
}
function _drawGambit(ctx, isDark, state, t, py, w, h) {
  var bg = ctx.createLinearGradient(0, 0, w, h);
  if (isDark) {
    bg.addColorStop(0, '#07030f');
    bg.addColorStop(0.28, '#17052d');
    bg.addColorStop(0.58, '#270943');
    bg.addColorStop(1, '#050814');
  } else {
    bg.addColorStop(0, '#fff5ff');
    bg.addColorStop(0.28, '#f4dcff');
    bg.addColorStop(0.62, '#ddc3ff');
    bg.addColorStop(1, '#e8f8ff');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  var core = ctx.createRadialGradient(w * 0.72, h * 0.18 + py * 0.25, 0, w * 0.72, h * 0.18 + py * 0.25, Math.max(w, h) * 0.62);
  core.addColorStop(0, isDark ? 'rgba(210,70,255,0.34)' : 'rgba(168,85,247,0.28)');
  core.addColorStop(0.45, isDark ? 'rgba(89,39,180,0.18)' : 'rgba(236,72,153,0.14)');
  core.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';
  for (var _iterator25 = _createForOfIteratorHelperLoose(state.bands), _step25; !(_step25 = _iterator25()).done;) {
    var b = _step25.value;
    var y = b.y + py * 0.35 + Math.sin(t * b.sp + b.ph) * b.amp;
    var grad = ctx.createLinearGradient(0, y - b.width, w, y + b.width);
    grad.addColorStop(0, "hsla(" + b.hue + ", 95%, " + (isDark ? 56 : 48) + "%, 0)");
    grad.addColorStop(0.45, "hsla(" + b.hue + ", 95%, " + (isDark ? 62 : 44) + "%, " + b.alpha + ")");
    grad.addColorStop(0.55, "hsla(" + (b.hue + 24) + ", 100%, " + (isDark ? 70 : 54) + "%, " + b.alpha * 1.35 + ")");
    grad.addColorStop(1, "hsla(" + b.hue + ", 95%, " + (isDark ? 56 : 48) + "%, 0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = b.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-80, y + h * 0.16);
    ctx.bezierCurveTo(w * 0.24, y - h * 0.10, w * 0.68, y + h * 0.24, w + 80, y - h * 0.12);
    ctx.stroke();
  }
  ctx.restore();
  for (var _iterator26 = _createForOfIteratorHelperLoose(state.sparks), _step26; !(_step26 = _iterator26()).done;) {
    var s = _step26.value;
    s.x += s.vx;
    s.y += s.vy;
    if (s.x > w + 10) s.x = -10;
    if (s.x < -10) s.x = w + 10;
    if (s.y < -12) {
      s.y = h + 12;
      s.x = _rnd(0, w);
    }
    var tw = 0.55 + 0.45 * Math.sin(t * 0.05 + s.ph);
    ctx.beginPath();
    ctx.arc(s.x, s.y + py * 0.18, s.r * tw, 0, Math.PI * 2);
    ctx.fillStyle = "hsla(" + s.hue + ", 100%, " + (isDark ? 68 : 44) + "%, " + s.op * tw + ")";
    ctx.fill();
  }
  for (var _iterator27 = _createForOfIteratorHelperLoose(state.cards), _step27; !(_step27 = _iterator27()).done;) {
    var c = _step27.value;
    c.x += c.drift;
    c.rot += c.spin;
    if (c.x > w + c.w * 2) {
      c.x = -c.w * 2;
      c.y = _rnd(h * 0.08, h * 0.86);
    }
    var cw = c.w;
    var ch = cw * 1.42;
    var cy = c.y + Math.sin(t * 0.025 + c.ph) * c.bob + py * 0.22;
    ctx.save();
    ctx.translate(c.x, cy);
    ctx.rotate(c.rot + Math.sin(t * 0.01 + c.ph) * 0.08);
    if (c.hot) {
      ctx.globalCompositeOperation = 'lighter';
      var halo = ctx.createRadialGradient(0, 0, 0, 0, 0, cw * 1.7);
      halo.addColorStop(0, isDark ? 'rgba(230,88,255,0.62)' : 'rgba(168,85,247,0.30)');
      halo.addColorStop(0.45, isDark ? 'rgba(236,72,153,0.22)' : 'rgba(236,72,153,0.13)');
      halo.addColorStop(1, 'rgba(236,72,153,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(-cw * 1.8, -cw * 1.8, cw * 3.6, cw * 3.6);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.fillStyle = isDark ? 'rgba(255,245,255,0.92)' : 'rgba(255,255,255,0.96)';
    ctx.strokeStyle = c.hot ? '#d946ef' : isDark ? '#7c3aed' : '#9333ea';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-cw / 2, -ch / 2, cw, ch, Math.max(4, cw * 0.12));
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = c.suit === '♥' || c.suit === '♦' ? '#be123c' : '#2e1065';
    ctx.font = Math.max(13, cw * 0.42) + "px Georgia, serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(c.suit, 0, 0);
    ctx.restore();
  }
  ctx.fillStyle = isDark ? 'rgba(3,0,10,0.20)' : 'rgba(255,255,255,0.16)';
  ctx.fillRect(0, h * 0.78, w, h * 0.22);
}
function applyDynamicBg(palette, isDark) {
  stopDynamicBg();
  var edgeColors = {
    cold: {
      day: '#4890c8',
      night: '#010818'
    },
    warm: {
      day: '#e07830',
      night: '#120800'
    },
    duo: {
      day: '#3e9e20',
      night: '#010d01'
    },
    tropical: {
      day: '#34a2cc',
      night: '#020810'
    },
    madison: {
      day: '#9ec9e8',
      night: '#020414'
    },
    gambit: {
      day: '#f4dcff',
      night: '#07030f'
    }
  };
  var edge = (edgeColors[palette] || edgeColors.tropical)[isDark ? 'night' : 'day'];
  document.documentElement.style.background = edge;
  document.body.style.background = 'transparent';
  var canvas = document.createElement('canvas');
  canvas.id = 'mc-dyn-bg';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block';
  var resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');
  var t = 0,
    animId = null,
    lastTs = 0,
    scrollY = 0;
  var w = function w() {
      return canvas.width;
    },
    h = function h() {
      return canvas.height;
    };
  var state;
  var buildState = function buildState() {
    if (palette === 'cold') return _initCold(w(), h(), isDark);
    if (palette === 'warm') return _initWarm(w(), h());
    if (palette === 'duo') return _initDuo(w(), h());
    if (palette === 'madison') return _initMadison(w(), h(), isDark);
    if (palette === 'gambit') return _initGambit(w(), h(), isDark);
    return _initTropical(w(), h(), isDark);
  };
  state = buildState();
  var _draw = function draw(now) {
    animId = requestAnimationFrame(_draw);
    if (now - lastTs < 33) return;
    lastTs = now;
    t++;
    var cw = w(),
      ch = h();
    ctx.clearRect(0, 0, cw, ch);
    var py = -scrollY * 0.07;
    if (palette === 'cold') _drawCold(ctx, isDark, state, t, py, cw, ch);else if (palette === 'warm') _drawWarm(ctx, isDark, state, t, py, cw, ch);else if (palette === 'duo') _drawDuo(ctx, isDark, state, t, py, cw, ch);else if (palette === 'madison') _drawMadison(ctx, isDark, state, t, py, cw, ch);else if (palette === 'gambit') _drawGambit(ctx, isDark, state, t, py, cw, ch);else _drawTropical(ctx, isDark, state, t, py, cw, ch);
  };
  animId = requestAnimationFrame(_draw);
  var onScroll = function onScroll() {
    scrollY = window.scrollY;
  };
  var onResize = function onResize() {
    resize();
    state = buildState();
  };
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  window.addEventListener('resize', onResize);
  _dynBgCleanup = function _dynBgCleanup() {
    if (animId) cancelAnimationFrame(animId);
    canvas.remove();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.documentElement.style.background = '';
    document.body.style.background = '';
  };
}
function parseStoredTheme() {
  var raw = storage.get(KEYS.theme, null);
  if (raw && typeof raw === 'object' && raw.palette && raw.mode) {
    return {
      palette: PALETTES.includes(raw.palette) ? raw.palette : 'cold',
      mode: MODES.includes(raw.mode) ? raw.mode : 'system'
    };
  }
  var legacy = {
    dark: {
      palette: 'cold',
      mode: 'dark'
    },
    light: {
      palette: 'cold',
      mode: 'light'
    },
    system: {
      palette: 'cold',
      mode: 'system'
    },
    warm: {
      palette: 'warm',
      mode: 'light'
    },
    darkwarm: {
      palette: 'warm',
      mode: 'dark'
    },
    green: {
      palette: 'duo',
      mode: 'light'
    },
    darkgreen: {
      palette: 'duo',
      mode: 'dark'
    },
    gambit: {
      palette: 'gambit',
      mode: 'light'
    },
    darkgambit: {
      palette: 'gambit',
      mode: 'dark'
    }
  };
  return legacy[raw] || {
    palette: 'cold',
    mode: 'system'
  };
}
var QUOTES = ["The MCAT doesn't reward perfection — it rewards persistence. Show up again today.", "Every wrong answer today is a right answer locked in for test day.", "You're not behind. You're exactly where the studying happens.", "Small reps, every day. That's how 528s are built.", "The best students aren't the smartest — they're the ones who came back tomorrow.", "Confused is the feeling of learning. Lean into it.", "Future-you, the one in the white coat, is grateful you opened this app.", "One chapter at a time. One question at a time. That's the whole game.", "Discomfort is the price of growth. Pay it gladly.", "Mastery is just confusion that didn't quit.", "Test day will reward the work nobody saw you do.", "If it were easy, everyone would have an MD.", "You don't need motivation — you need a streak. Start one today.", "The brain that learns biochem is the same brain that built it. Trust it.", "Slow is smooth. Smooth is fast. Smooth is a great MCAT score."];
var CARS_DISCIPLINES = ['Philosophy', 'History', 'Literature', 'Ethics', 'Political Science', 'Sociology', 'Art', 'Anthropology', 'Music', 'Economics', 'Religion', 'Psychology', 'Architecture', 'Linguistics', 'Popular Culture', 'Studies of Diverse Cultures', 'Theater', 'Geography', 'Archaeology', 'Education'];
function todayStr(d) {
  if (d === void 0) {
    d = new Date();
  }
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
}
var CARS_DAILY_COUNT = 2;
function carsDateKey(dateStr, slot) {
  if (slot === void 0) {
    slot = 1;
  }
  return slot === 1 ? dateStr : dateStr + "#" + slot;
}
function carsBaseDate(dateKey) {
  var m = /^(\d{4}-\d{2}-\d{2})(?:[#-](\d+))?$/.exec(String(dateKey || ''));
  return m ? m[1] : String(dateKey || '');
}
function carsSlotFor(dateKey) {
  var m = /^\d{4}-\d{2}-\d{2}[#-](\d+)$/.exec(String(dateKey || ''));
  return m ? Math.max(1, Number(m[1]) || 1) : 1;
}
function carsSlotLabel(slot) {
  return "Passage " + slot;
}
function carsDisciplineFor(dateStr, slot) {
  if (slot === void 0) {
    slot = 1;
  }
  var d = new Date(carsBaseDate(dateStr) + 'T00:00:00');
  var start = new Date(d.getFullYear(), 0, 0);
  var dayOfYear = Math.floor((d - start) / 86400000);
  return CARS_DISCIPLINES[(dayOfYear + slot - 1) % CARS_DISCIPLINES.length];
}
function getCarsResults() {
  try {
    return JSON.parse(localStorage.getItem('mcat:cars')) || {};
  } catch (_unused3) {
    return {};
  }
}
function setCarsResult(date, result) {
  var all = getCarsResults();
  all[date] = result;
  try {
    localStorage.setItem('mcat:cars', JSON.stringify(all));
  } catch (_unused4) {}
  markStateDirty();
}
function sanitizeText(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\\u2014/gi, '—').replace(/\\u2013/gi, '–').replace(/\\u2019/gi, '’').replace(/\\u2018/gi, '‘').replace(/\\u201c/gi, '“').replace(/\\u201d/gi, '”').replace(/\\u2026/gi, '…').replace(/\\u00a0/gi, ' ').replace(/&mdash;/gi, '—').replace(/&ndash;/gi, '–').replace(/&#8212;?/g, '—').replace(/&#8211;?/g, '–').replace(/&rsquo;/gi, '’').replace(/&lsquo;/gi, '‘').replace(/&[lr]dquo;/gi, '"').replace(/&hellip;/gi, '…').replace(/&amp;/gi, '&').replace(/\\n/g, ' ').replace(/\\t/g, ' ').replace(/[ \t]+/g, ' ').trim();
}
function stripChoiceLabel(s, index) {
  if (typeof s !== 'string') return s;
  var expected = 'ABCD'[index];
  var cleaned = sanitizeText(s);
  if (!expected) return cleaned;
  var m = cleaned.match(/^\(?([A-Da-d])\)?[.):\-]\s+([\s\S]+)$/);
  if (m && m[1].toUpperCase() === expected) {
    var rest = m[2].trim();
    if (/^[A-Z]\.\s/.test(rest)) return cleaned;
    return rest;
  }
  return cleaned;
}
var MC_LEAKED_KEYS = new Set(['correct_index', 'explanation', 'question', 'subject', 'chapter', 'content_category', 'sirs_skill', 'choices', 'answer', 'category', 'subtype']);
function validateMCQuestion(q) {
  if (!q || typeof q !== 'object') return null;
  var question = sanitizeText(q.question);
  if (!question) return null;
  var choices = Array.isArray(q.choices) ? q.choices : [];
  var kept = [];
  choices.forEach(function (c, i) {
    if (typeof c !== 'string') return;
    var t = sanitizeText(c);
    if (!t) return;
    if (MC_LEAKED_KEYS.has(t.toLowerCase())) return;
    kept.push({
      text: t,
      origIdx: i
    });
  });
  var seen = new Set();
  var deduped = kept.filter(function (k) {
    var key = k.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (deduped.length !== 4) return null;
  var ci = Number(q.correct_index);
  if (!Number.isInteger(ci)) return null;
  var newCi = deduped.findIndex(function (k) {
    return k.origIdx === ci;
  });
  if (newCi < 0) return null;
  return _extends({}, q, {
    question,
    choices: deduped.map(function (k) {
      return k.text;
    }),
    correct_index: newCi,
    explanation: sanitizeText(q.explanation) || ''
  });
}
function validateMCQuestions(arr) {
  var questions = [];
  var dropped = 0;
  for (var _iterator28 = _createForOfIteratorHelperLoose(Array.isArray(arr) ? arr : []), _step28; !(_step28 = _iterator28()).done;) {
    var q = _step28.value;
    var ok = validateMCQuestion(q);
    if (ok) questions.push(ok);else dropped++;
  }
  return {
    questions,
    dropped
  };
}
function getCarsCache() {
  try {
    return JSON.parse(localStorage.getItem('mcat:carsCache')) || {};
  } catch (_unused5) {
    return {};
  }
}
function getCarsCachePayload(date) {
  return getCarsCache()[date] || null;
}
function setCarsCachePayload(date, payload) {
  if (!payload) return;
  var all = getCarsCache();
  all[date] = payload;
  var keys = Object.keys(all).sort();
  while (keys.length > 60) delete all[keys.shift()];
  try {
    localStorage.setItem('mcat:carsCache', JSON.stringify(all));
  } catch (_unused6) {}
}
function getDailyExamCache() {
  try {
    return JSON.parse(localStorage.getItem('mcat:dailyExamCache')) || {};
  } catch (_unused7) {
    return {};
  }
}
function getDailyExamPayload(date) {
  return getDailyExamCache()[date] || null;
}
function setDailyExamPayload(date, payload) {
  if (!payload) return;
  var all = getDailyExamCache();
  all[date] = payload;
  var keys = Object.keys(all).sort();
  while (keys.length > 30) delete all[keys.shift()];
  try {
    localStorage.setItem('mcat:dailyExamCache', JSON.stringify(all));
  } catch (_unused8) {}
}
function getConnectionsCache() {
  try {
    return JSON.parse(localStorage.getItem('mcat:connectionsCache')) || {};
  } catch (_unused9) {
    return {};
  }
}
function getConnectionsCachePayload(date) {
  return getConnectionsCache()[date] || null;
}
function setConnectionsCachePayload(date, payload) {
  if (!payload) return;
  var all = getConnectionsCache();
  all[date] = payload;
  var keys = Object.keys(all).sort();
  while (keys.length > 60) delete all[keys.shift()];
  try {
    localStorage.setItem('mcat:connectionsCache', JSON.stringify(all));
  } catch (_unused0) {}
}
function getConnectionsResults() {
  try {
    return JSON.parse(localStorage.getItem('mcat:connectionsResults')) || {};
  } catch (_unused1) {
    return {};
  }
}
function setConnectionsResult(date, result) {
  var all = getConnectionsResults();
  all[date] = result;
  try {
    localStorage.setItem('mcat:connectionsResults', JSON.stringify(all));
  } catch (_unused10) {}
  markStateDirty();
}
function getStatsCache() {
  try {
    return JSON.parse(localStorage.getItem('mcat:statsCache')) || null;
  } catch (_unused11) {
    return null;
  }
}
function setStatsCache(data) {
  try {
    localStorage.setItem('mcat:statsCache', JSON.stringify(data));
  } catch (_unused12) {}
}
var DEFAULT_GITHUB = {
  token: '',
  repo: 'Orbgamestudios/MCAT-study-MASTER',
  branch: 'main',
  path: 'data.json',
  autoPush: false
};
function toBase64Utf8(str) {
  var bytes = new TextEncoder().encode(str);
  var bin = '';
  var CHUNK = 0x8000;
  for (var i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}
function ghHeaders(_x4) {
  return _ghHeaders.apply(this, arguments);
}
function _ghHeaders() {
  _ghHeaders = _asyncToGenerator(_regenerator().m(function _callee69(token) {
    return _regenerator().w(function (_context77) {
      while (1) switch (_context77.n) {
        case 0:
          return _context77.a(2, {
            'Authorization': "Bearer " + token,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          });
      }
    }, _callee69);
  }));
  return _ghHeaders.apply(this, arguments);
}
function ghGetSha(_x5) {
  return _ghGetSha.apply(this, arguments);
}
function _ghGetSha() {
  _ghGetSha = _asyncToGenerator(_regenerator().m(function _callee70(_ref) {
    var token, repo, branch, path, url, res, j, _t59, _t60, _t61, _t62, _t63, _t64, _t65;
    return _regenerator().w(function (_context78) {
      while (1) switch (_context78.n) {
        case 0:
          token = _ref.token, repo = _ref.repo, branch = _ref.branch, path = _ref.path;
          url = "https://api.github.com/repos/" + repo + "/contents/" + encodeURIComponent(path) + "?ref=" + encodeURIComponent(branch);
          _t59 = fetch;
          _t60 = url;
          _context78.n = 1;
          return ghHeaders(token);
        case 1:
          _t61 = _context78.v;
          _context78.n = 2;
          return _t59(_t60, {
            headers: _t61
          });
        case 2:
          res = _context78.v;
          if (!(res.status === 404)) {
            _context78.n = 3;
            break;
          }
          return _context78.a(2, null);
        case 3:
          if (res.ok) {
            _context78.n = 5;
            break;
          }
          _t62 = Error;
          _t63 = "GitHub GET " + res.status + ": ";
          _context78.n = 4;
          return res.text();
        case 4:
          _t64 = _context78.v.slice(0, 200);
          _t65 = _t63 + _t64;
          throw new _t62(_t65);
        case 5:
          _context78.n = 6;
          return res.json();
        case 6:
          j = _context78.v;
          return _context78.a(2, j.sha);
      }
    }, _callee70);
  }));
  return _ghGetSha.apply(this, arguments);
}
function ghPutFile(_x6, _x7, _x8, _x9) {
  return _ghPutFile.apply(this, arguments);
}
function _ghPutFile() {
  _ghPutFile = _asyncToGenerator(_regenerator().m(function _callee71(_ref2, content, sha, message) {
    var token, repo, branch, path, url, body, res, _t66, _t67, _t68, _t69, _t70, _t71, _t72, _t73, _t74, _t75;
    return _regenerator().w(function (_context79) {
      while (1) switch (_context79.n) {
        case 0:
          token = _ref2.token, repo = _ref2.repo, branch = _ref2.branch, path = _ref2.path;
          url = "https://api.github.com/repos/" + repo + "/contents/" + encodeURIComponent(path);
          body = {
            message,
            content: toBase64Utf8(content),
            branch
          };
          if (sha) body.sha = sha;
          _t66 = fetch;
          _t67 = url;
          _t68 = _extends;
          _t69 = {};
          _context79.n = 1;
          return ghHeaders(token);
        case 1:
          _t70 = _t68(_t69, _context79.v, {
            'Content-Type': 'application/json'
          });
          _t71 = JSON.stringify(body);
          _context79.n = 2;
          return _t66(_t67, {
            method: 'PUT',
            headers: _t70,
            body: _t71
          });
        case 2:
          res = _context79.v;
          if (res.ok) {
            _context79.n = 4;
            break;
          }
          _t72 = Error;
          _t73 = "GitHub PUT " + res.status + ": ";
          _context79.n = 3;
          return res.text();
        case 3:
          _t74 = _context79.v.slice(0, 200);
          _t75 = _t73 + _t74;
          throw new _t72(_t75);
        case 4:
          return _context79.a(2, res.json());
      }
    }, _callee71);
  }));
  return _ghPutFile.apply(this, arguments);
}
function pushBankToGithub(_x0, _x1) {
  return _pushBankToGithub.apply(this, arguments);
}
function _pushBankToGithub() {
  _pushBankToGithub = _asyncToGenerator(_regenerator().m(function _callee72(github, _ref3) {
    var files, extractions, questions, data, content, sha, msg;
    return _regenerator().w(function (_context80) {
      while (1) switch (_context80.n) {
        case 0:
          files = _ref3.files, extractions = _ref3.extractions, questions = _ref3.questions;
          if (!(!github.token || !github.repo || !github.path)) {
            _context80.n = 1;
            break;
          }
          throw new Error('GitHub sync not configured.');
        case 1:
          data = {
            version: 1,
            exported_at: new Date().toISOString(),
            model: MODEL,
            files,
            extractions,
            questions
          };
          content = JSON.stringify(data, null, 2);
          _context80.n = 2;
          return ghGetSha(github);
        case 2:
          sha = _context80.v;
          msg = "Update bank: " + files.length + " files (" + new Date().toISOString().slice(0, 10) + ")";
          return _context80.a(2, ghPutFile(github, content, sha, msg));
      }
    }, _callee72);
  }));
  return _pushBankToGithub.apply(this, arguments);
}
function _vol() {
  try {
    var raw = localStorage.getItem('mcat:volume');
    if (raw == null) return 1;
    var v = JSON.parse(raw);
    return typeof v === 'number' && v >= 0 && v <= 1 ? v : 1;
  } catch (_unused13) {
    return 1;
  }
}
var _audioCtx = null;
function _ctx() {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
  } catch (_unused14) {
    return null;
  }
}
function _withCtx(cb) {
  var ctx = _ctx();
  if (!ctx) return;
  if (ctx.state === 'running') {
    try {
      cb(ctx);
    } catch (_unused15) {}
    return;
  }
  ctx.resume().then(function () {
    try {
      cb(ctx);
    } catch (_unused16) {}
  }).catch(function () {});
}
var _sfxBufferCache = {};
var _sfxAudioCache = {};
function _kickBufferLoad(name) {
  var ctx = _ctx();
  if (!ctx || _sfxBufferCache[name + ':loading'] || _sfxBufferCache[name]) return;
  _sfxBufferCache[name + ':loading'] = true;
  fetch("assets/" + name + ".mp3").then(function (r) {
    return r.arrayBuffer();
  }).then(function (buf) {
    return ctx.decodeAudioData(buf);
  }).then(function (decoded) {
    _sfxBufferCache[name] = decoded;
  }).catch(function () {}).finally(function () {
    _sfxBufferCache[name + ':loading'] = false;
  });
}
function _playSfxFallback(name) {
  try {
    if (!_sfxAudioCache[name]) {
      _sfxAudioCache[name] = new Audio("assets/" + name + ".mp3");
      _sfxAudioCache[name].preload = 'auto';
    }
    var a = _sfxAudioCache[name];
    a.currentTime = 0;
    a.volume = Math.max(0, Math.min(1, 0.4 * _vol()));
    a.play().catch(function () {});
  } catch (_unused17) {}
}
function playSfx(name) {
  var buf = _sfxBufferCache[name];
  if (buf) {
    _withCtx(function (ctx) {
      var src = ctx.createBufferSource();
      src.buffer = buf;
      var gain = ctx.createGain();
      gain.gain.value = Math.max(0.0001, 0.4 * _vol());
      src.connect(gain).connect(ctx.destination);
      src.start();
    });
    return;
  }
  _kickBufferLoad(name);
  _playSfxFallback(name);
}
(function () {
  var done = false;
  var unlock = function unlock() {
    if (done) return;
    done = true;
    _withCtx(function (ctx) {
      try {
        var b = ctx.createBuffer(1, 1, ctx.sampleRate);
        var s = ctx.createBufferSource();
        s.buffer = b;
        s.connect(ctx.destination);
        s.start();
      } catch (_unused18) {}
    });
    _kickBufferLoad('correct');
    _kickBufferLoad('wrong');
  };
  ['pointerdown', 'touchstart', 'keydown', 'click'].forEach(function (ev) {
    return document.addEventListener(ev, unlock, {
      capture: true,
      passive: true
    });
  });
})();
function _beep(freq, durMs, _temp) {
  var _ref4 = _temp === void 0 ? {} : _temp,
    _ref4$vol = _ref4.vol,
    vol = _ref4$vol === void 0 ? 0.08 : _ref4$vol,
    _ref4$type = _ref4.type,
    type = _ref4$type === void 0 ? 'sine' : _ref4$type,
    _ref4$startAt = _ref4.startAt,
    startAt = _ref4$startAt === void 0 ? 0 : _ref4$startAt;
  _withCtx(function (ctx) {
    var peak = Math.max(0.0001, vol * _vol());
    var t0 = ctx.currentTime + startAt;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + durMs / 1000 + 0.02);
  });
}
function sfxTap() {
  _withCtx(function (ctx) {
    var t0 = ctx.currentTime;
    var dur = 0.035;
    var buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2800;
    filter.Q.value = 3;
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.max(0.0001, 0.18 * _vol()), t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.01);
  });
}
function _percHit(centerFreq, startAt, vol) {
  _withCtx(function (ctx) {
    var peak = Math.max(0.0001, vol * _vol());
    var t0 = ctx.currentTime + startAt;
    var nDur = 0.045;
    var buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * nDur)), ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = centerFreq;
    filt.Q.value = 1.5;
    var nGain = ctx.createGain();
    nGain.gain.setValueAtTime(peak * 1.0, t0);
    nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + nDur);
    src.connect(filt).connect(nGain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + nDur + 0.01);
    var osc = ctx.createOscillator();
    var oscGain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(centerFreq * 0.5, t0);
    oscGain.gain.setValueAtTime(0, t0);
    oscGain.gain.linearRampToValueAtTime(peak * 0.15, t0 + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
    osc.connect(oscGain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.06);
  });
}
function sfxQuizStart() {
  _percHit(1100, 0, 0.13);
  _percHit(1600, 0.07, 0.13);
  _percHit(2200, 0.14, 0.16);
}
function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (_unused19) {}
}
function vibrateTap() {
  vibrate(12);
}
function vibrateCorrect() {
  vibrate([30, 60, 30]);
}
function vibrateWrong() {
  vibrate(220);
}
function hudClick() {
  sfxTap();
  vibrateTap();
}
function updateFavicon() {
  try {
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(function (el) {
      return el.parentNode.removeChild(el);
    });
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'icon-512-v2.png';
    document.head.appendChild(link);
    var apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    apple.href = 'apple-touch-icon-v2.png';
    document.head.appendChild(apple);
  } catch (_unused20) {}
}
var lzString = function () {
  var f = String.fromCharCode;
  function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    var i, value, ii;
    var context_dictionary = {},
      context_dictionaryToCreate = {};
    var context_c = '',
      context_wc = '',
      context_w = '';
    var context_enlargeIn = 2,
      context_dictSize = 3,
      context_numBits = 2;
    var context_data = [];
    var context_data_val = 0,
      context_data_position = 0;
    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }
      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else context_data_position++;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else context_data_position++;
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else context_data_position++;
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else context_data_position++;
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else context_data_position++;
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }
    if (context_w !== '') {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else context_data_position++;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            context_data_val = context_data_val << 1 | value & 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else context_data_position++;
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else context_data_position++;
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            context_data_val = context_data_val << 1 | value & 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else context_data_position++;
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1 | value & 1;
          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else context_data_position++;
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }
    value = 2;
    for (i = 0; i < context_numBits; i++) {
      context_data_val = context_data_val << 1 | value & 1;
      if (context_data_position == bitsPerChar - 1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else context_data_position++;
      value = value >> 1;
    }
    while (true) {
      context_data_val = context_data_val << 1;
      if (context_data_position == bitsPerChar - 1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      } else context_data_position++;
    }
    return context_data.join('');
  }
  function _decompress(length, resetValue, getNextValue) {
    var dictionary = [];
    var enlargeIn = 4,
      dictSize = 4,
      numBits = 3,
      entry = '',
      result = [],
      i,
      w,
      bits,
      resb,
      maxpower,
      power,
      c;
    var data = {
      val: getNextValue(0),
      position: resetValue,
      index: 1
    };
    for (i = 0; i < 3; i += 1) dictionary[i] = i;
    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }
    switch (bits) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        c = f(bits);
        break;
      case 1:
        bits = 0;
        maxpower = Math.pow(2, 16);
        power = 1;
        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        c = f(bits);
        break;
      case 2:
        return '';
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) return '';
      bits = 0;
      maxpower = Math.pow(2, numBits);
      power = 1;
      while (power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize - 1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize - 1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      if (dictionary[c]) entry = dictionary[c];else {
        if (c === dictSize) entry = w + w.charAt(0);else return null;
      }
      result.push(entry);
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;
      w = entry;
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
    }
  }
  return {
    compressToUTF16: function compressToUTF16(input) {
      if (input == null) return '';
      return _compress(input, 15, function (a) {
        return f(a + 32);
      }) + ' ';
    },
    decompressFromUTF16: function decompressFromUTF16(compressed) {
      if (compressed == null) return '';
      if (compressed == '') return null;
      return _decompress(compressed.length, 16384, function (index) {
        return compressed.charCodeAt(index) - 32;
      });
    }
  };
}();
var STORAGE_LZ_MARKER = 'LZv1';
var STORAGE_LZ_MIN_BYTES = 1024;
var storage = {
  get(key, fallback) {
    if (fallback === void 0) {
      fallback = null;
    }
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      if (raw.startsWith(STORAGE_LZ_MARKER)) {
        var body = raw.slice(STORAGE_LZ_MARKER.length);
        var json = lzString.decompressFromUTF16(body);
        return json == null ? fallback : JSON.parse(json);
      }
      return JSON.parse(raw);
    } catch (_unused21) {
      return fallback;
    }
  },
  set(key, value) {
    var json;
    try {
      json = JSON.stringify(value);
    } catch (e) {
      try {
        window.dispatchEvent(new CustomEvent('mcat:storage-fail', {
          detail: {
            key,
            quota: false,
            message: 'JSON.stringify failed: ' + ((e == null ? void 0 : e.message) || e)
          }
        }));
      } catch (_unused22) {}
      return false;
    }
    var big = json.length >= STORAGE_LZ_MIN_BYTES;
    var payload = big ? STORAGE_LZ_MARKER + lzString.compressToUTF16(json) : json;
    try {
      localStorage.setItem(key, payload);
      return true;
    } catch (e) {
      if (!big) {
        try {
          localStorage.setItem(key, STORAGE_LZ_MARKER + lzString.compressToUTF16(json));
          return true;
        } catch (_unused23) {}
      }
      try {
        var isQuota = e && (e.name === 'QuotaExceededError' || e.code === 22 || /quota/i.test(String(e.message)));
        window.dispatchEvent(new CustomEvent('mcat:storage-fail', {
          detail: {
            key,
            quota: !!isQuota,
            message: (e == null ? void 0 : e.message) || String(e)
          }
        }));
      } catch (_unused24) {}
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  migrateCompressIfNeeded() {
    var FLAG = 'mcat:_compressed_v1';
    try {
      if (localStorage.getItem(FLAG) === '1') return;
    } catch (_unused25) {
      return;
    }
    var migrated = 0,
      freed = 0;
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.startsWith('mcat:')) keys.push(k);
      }
      for (var _i13 = 0, _keys = keys; _i13 < _keys.length; _i13++) {
        var _k = _keys[_i13];
        try {
          var raw = localStorage.getItem(_k);
          if (raw == null) continue;
          if (raw.startsWith(STORAGE_LZ_MARKER)) continue;
          if (raw.length < STORAGE_LZ_MIN_BYTES) continue;
          var parsed = JSON.parse(raw);
          var before = raw.length;
          if (this.set(_k, parsed)) {
            var after = (localStorage.getItem(_k) || '').length;
            if (after < before) {
              migrated++;
              freed += (before - after) * 2;
            }
          }
        } catch (_unused26) {}
      }
      localStorage.setItem(FLAG, '1');
    } catch (_unused27) {}
    if (migrated > 0) {
      try {
        console.info("[storage] compressed " + migrated + " keys, freed ~" + Math.round(freed / 1024) + " KB");
      } catch (_unused28) {}
    }
  },
  usageBytes() {
    var total = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k) continue;
        var v = localStorage.getItem(k) || '';
        total += (k.length + v.length) * 2;
      }
    } catch (_unused29) {}
    return total;
  }
};
var ErrorBoundary = function (_React$Component) {
  "use strict";

  function ErrorBoundary(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    _this.state = {
      caught: null
    };
    return _this;
  }
  _inheritsLoose(ErrorBoundary, _React$Component);
  ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError(err) {
    return {
      caught: err
    };
  };
  var _proto = ErrorBoundary.prototype;
  _proto.componentDidCatch = function componentDidCatch(err, info) {
    console.error('[ErrorBoundary]', err, info == null ? void 0 : info.componentStack);
  };
  _proto.reset = function reset() {
    this.setState({
      caught: null
    });
  };
  _proto.clearAndReload = function clearAndReload() {
    try {
      ['mcat:questions', 'mcat:extractions', 'mcat:files'].forEach(function (k) {
        return localStorage.removeItem(k);
      });
    } catch (_unused30) {}
    location.reload();
  };
  _proto.render = function render() {
    var _this2 = this;
    if (this.state.caught) {
      var _this$state$caught;
      var msg = ((_this$state$caught = this.state.caught) == null ? void 0 : _this$state$caught.message) || String(this.state.caught);
      return React.createElement("div", {
        style: {
          padding: '2rem',
          fontFamily: 'sans-serif',
          background: '#fff5f5',
          borderRadius: '12px',
          margin: '1rem',
          border: '1px solid #e74c3c'
        }
      }, React.createElement("div", {
        style: {
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#c0392b',
          marginBottom: '0.5rem'
        }
      }, "Something went wrong"), React.createElement("div", {
        style: {
          fontSize: '0.85rem',
          color: '#555',
          marginBottom: '1.25rem',
          wordBreak: 'break-all',
          fontFamily: 'monospace'
        }
      }, msg), React.createElement("div", {
        style: {
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }
      }, React.createElement("button", {
        onClick: function onClick() {
          return _this2.reset();
        },
        style: {
          background: '#555',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1.2rem',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }
      }, "Try again"), React.createElement("button", {
        onClick: function onClick() {
          return _this2.clearAndReload();
        },
        style: {
          background: '#c0392b',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1.2rem',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }
      }, "Clear downloaded data and restart")), React.createElement("div", {
        style: {
          marginTop: '1rem',
          fontSize: '0.75rem',
          color: '#888'
        }
      }, "If the app keeps crashing, click \"Clear downloaded data and restart\" \u2014 it removes cached chapter data and lets you re-download cleanly."));
    }
    return this.props.children;
  };
  return ErrorBoundary;
}(React.Component);
var GeminiError = function (_Error) {
  "use strict";

  function GeminiError(status, message) {
    var _this3;
    _this3 = _Error.call(this, message) || this;
    _this3.status = status;
    return _this3;
  }
  _inheritsLoose(GeminiError, _Error);
  return GeminiError;
}(_wrapNativeSuper(Error));
function makeClient(getKey) {
  var authHeader = function authHeader() {
    return {
      'x-goog-api-key': getKey()
    };
  };
  function parseError(_x10) {
    return _parseError.apply(this, arguments);
  }
  function _parseError() {
    _parseError = _asyncToGenerator(_regenerator().m(function _callee(res) {
      var _body;
      var body, msg, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            body = null;
            _context.p = 1;
            _context.n = 2;
            return res.json();
          case 2:
            body = _context.v;
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
          case 4:
            msg = ((_body = body) == null || (_body = _body.error) == null ? void 0 : _body.message) || res.statusText || "HTTP " + res.status;
            return _context.a(2, new GeminiError(res.status, msg));
        }
      }, _callee, null, [[1, 3]]);
    }));
    return _parseError.apply(this, arguments);
  }
  function uploadFile(_x11) {
    return _uploadFile.apply(this, arguments);
  }
  function _uploadFile() {
    _uploadFile = _asyncToGenerator(_regenerator().m(function _callee2(file) {
      var initRes, uploadUrl, uploadRes, json;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return fetch(UPLOAD_BASE + "/files", {
              method: 'POST',
              headers: _extends({}, authHeader(), {
                'x-goog-upload-protocol': 'resumable',
                'x-goog-upload-command': 'start',
                'x-goog-upload-header-content-length': String(file.size),
                'x-goog-upload-header-content-type': file.type || 'application/pdf',
                'content-type': 'application/json'
              }),
              body: JSON.stringify({
                file: {
                  display_name: file.name
                }
              })
            });
          case 1:
            initRes = _context2.v;
            if (initRes.ok) {
              _context2.n = 3;
              break;
            }
            _context2.n = 2;
            return parseError(initRes);
          case 2:
            throw _context2.v;
          case 3:
            uploadUrl = initRes.headers.get('x-goog-upload-url') || initRes.headers.get('X-Goog-Upload-URL');
            if (uploadUrl) {
              _context2.n = 4;
              break;
            }
            throw new GeminiError(0, 'Upload URL missing from initiate response.');
          case 4:
            _context2.n = 5;
            return fetch(uploadUrl, {
              method: 'POST',
              headers: {
                'content-length': String(file.size),
                'x-goog-upload-offset': '0',
                'x-goog-upload-command': 'upload, finalize'
              },
              body: file
            });
          case 5:
            uploadRes = _context2.v;
            if (uploadRes.ok) {
              _context2.n = 7;
              break;
            }
            _context2.n = 6;
            return parseError(uploadRes);
          case 6:
            throw _context2.v;
          case 7:
            _context2.n = 8;
            return uploadRes.json();
          case 8:
            json = _context2.v;
            return _context2.a(2, json.file);
        }
      }, _callee2);
    }));
    return _uploadFile.apply(this, arguments);
  }
  function deleteFile(_x12) {
    return _deleteFile.apply(this, arguments);
  }
  function _deleteFile() {
    _deleteFile = _asyncToGenerator(_regenerator().m(function _callee3(fileName) {
      var res;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return fetch(GEMINI_BASE + "/" + fileName, {
              method: 'DELETE',
              headers: authHeader()
            });
          case 1:
            res = _context3.v;
            if (!(!res.ok && res.status !== 404)) {
              _context3.n = 3;
              break;
            }
            _context3.n = 2;
            return parseError(res);
          case 2:
            throw _context3.v;
          case 3:
            return _context3.a(2, true);
        }
      }, _callee3);
    }));
    return _deleteFile.apply(this, arguments);
  }
  function generate(_x13) {
    return _generate.apply(this, arguments);
  }
  function _generate() {
    _generate = _asyncToGenerator(_regenerator().m(function _callee4(_ref5) {
      var contents, systemInstruction, responseSchema, _ref5$maxOutputTokens, maxOutputTokens, _ref5$disableThinking, disableThinking, generationConfig, body, res;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            contents = _ref5.contents, systemInstruction = _ref5.systemInstruction, responseSchema = _ref5.responseSchema, _ref5$maxOutputTokens = _ref5.maxOutputTokens, maxOutputTokens = _ref5$maxOutputTokens === void 0 ? 32768 : _ref5$maxOutputTokens, _ref5$disableThinking = _ref5.disableThinking, disableThinking = _ref5$disableThinking === void 0 ? false : _ref5$disableThinking;
            generationConfig = {
              maxOutputTokens
            };
            if (responseSchema) {
              generationConfig.responseMimeType = 'application/json';
              generationConfig.responseSchema = responseSchema;
            }
            if (disableThinking) {
              generationConfig.thinkingConfig = {
                thinkingBudget: 0
              };
            }
            body = {
              contents,
              generationConfig
            };
            if (systemInstruction) body.systemInstruction = {
              parts: [{
                text: systemInstruction
              }]
            };
            _context4.n = 1;
            return fetch(GEMINI_BASE + "/models/" + MODEL + ":generateContent", {
              method: 'POST',
              headers: _extends({}, authHeader(), {
                'content-type': 'application/json'
              }),
              body: JSON.stringify(body)
            });
          case 1:
            res = _context4.v;
            if (res.ok) {
              _context4.n = 3;
              break;
            }
            _context4.n = 2;
            return parseError(res);
          case 2:
            throw _context4.v;
          case 3:
            return _context4.a(2, res.json());
        }
      }, _callee4);
    }));
    return _generate.apply(this, arguments);
  }
  function extractText(resp) {
    var _resp$candidates;
    var parts = (resp == null || (_resp$candidates = resp.candidates) == null || (_resp$candidates = _resp$candidates[0]) == null || (_resp$candidates = _resp$candidates.content) == null ? void 0 : _resp$candidates.parts) || [];
    return parts.map(function (p) {
      return p.text || '';
    }).join('');
  }
  function extractJson(resp) {
    var _resp$candidates2;
    var finishReason = resp == null || (_resp$candidates2 = resp.candidates) == null || (_resp$candidates2 = _resp$candidates2[0]) == null ? void 0 : _resp$candidates2.finishReason;
    var text = extractText(resp);
    if (!text) {
      throw new GeminiError(0, "Empty model response (finishReason: " + (finishReason || 'unknown') + ").");
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      var hint = finishReason === 'MAX_TOKENS' ? ' — output was truncated (hit max tokens). Try a longer chapter limit or fewer items.' : '';
      throw new GeminiError(0, "JSON parse failed (finishReason: " + finishReason + ")." + hint + " Start: " + text.slice(0, 160));
    }
  }
  function ping() {
    return _ping.apply(this, arguments);
  }
  function _ping() {
    _ping = _asyncToGenerator(_regenerator().m(function _callee5() {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            return _context5.a(2, generate({
              contents: [{
                role: 'user',
                parts: [{
                  text: 'ping'
                }]
              }],
              maxOutputTokens: 8
            }));
        }
      }, _callee5);
    }));
    return _ping.apply(this, arguments);
  }
  var EXTRACTION_SCHEMA = {
    type: 'OBJECT',
    properties: {
      summary_sentences: {
        type: 'ARRAY',
        items: {
          type: 'STRING'
        }
      },
      context_examples: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            topic: {
              type: 'STRING'
            },
            example: {
              type: 'STRING'
            }
          },
          required: ['topic', 'example']
        }
      },
      key_terms: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            term: {
              type: 'STRING'
            },
            definition: {
              type: 'STRING'
            }
          },
          required: ['term', 'definition']
        }
      }
    },
    required: ['summary_sentences', 'context_examples', 'key_terms']
  };
  function extractFromPdf(_x14, _x15, _x16) {
    return _extractFromPdf.apply(this, arguments);
  }
  function _extractFromPdf() {
    _extractFromPdf = _asyncToGenerator(_regenerator().m(function _callee6(fileUri, mimeType, chapterLabel) {
      var resp;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return generate({
              maxOutputTokens: 32768,
              disableThinking: true,
              systemInstruction: 'You extract MCAT study material from a chapter PDF for a question-generation pipeline. ' + 'Be exhaustive in summary_sentences — these are the testable claims and become the basis of the quiz, ' + 'taken from the end-of-chapter recap, key-takeaway boxes, or "concept summary" sections. ' + 'context_examples are concrete illustrative scenarios, experiments, case studies, or worked examples from the body of the chapter (not summaries) — these inform question wording and distractor plausibility. ' + 'key_terms are named terms, theories, models, researchers, or syndromes with one-sentence definitions for matching-style questions. ' + 'Do not invent content not in the PDF.',
              contents: [{
                role: 'user',
                parts: [{
                  fileData: {
                    mimeType,
                    fileUri
                  }
                }, {
                  text: "Extract study material for: " + chapterLabel + ". Aim for 25-50 summary_sentences, 10-25 context_examples, 15-40 key_terms."
                }]
              }],
              responseSchema: EXTRACTION_SCHEMA
            });
          case 1:
            resp = _context6.v;
            return _context6.a(2, extractJson(resp));
        }
      }, _callee6);
    }));
    return _extractFromPdf.apply(this, arguments);
  }
  var MC_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING'
            },
            choices: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            },
            correct_index: {
              type: 'INTEGER'
            },
            explanation: {
              type: 'STRING'
            }
          },
          required: ['question', 'choices', 'correct_index', 'explanation']
        }
      }
    },
    required: ['questions']
  };
  function generateMCQuestions(_x17, _x18, _x19, _x20, _x21) {
    return _generateMCQuestions.apply(this, arguments);
  }
  function _generateMCQuestions() {
    _generateMCQuestions = _asyncToGenerator(_regenerator().m(function _callee7(fileUri, mimeType, extraction, chapterLabel, n) {
      var parts, resp, data, _validateMCQuestions, questions;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            if (n === void 0) {
              n = DEFAULT_MC_COUNT;
            }
            parts = [];
            if (fileUri && mimeType) parts.push({
              fileData: {
                mimeType,
                fileUri
              }
            });
            parts.push({
              text: "Chapter: " + chapterLabel + "\n\n" + ("Extracted summary sentences and key terms:\n" + JSON.stringify(extraction, null, 2).slice(0, 60000) + "\n\n") + ("Generate exactly " + n + " MCAT-style multiple-choice questions covering the chapter.")
            });
            _context7.n = 1;
            return generate({
              maxOutputTokens: 32768,
              disableThinking: true,
              systemInstruction: 'You write high-quality MCAT-style multiple-choice questions from a chapter PDF and structured extraction. ' + 'Every question must have exactly 4 choices, with `correct_index` (0-3) pointing to the correct one. ' + 'Distractors must be plausible — pull from common misconceptions, related-but-wrong concepts, or other key_terms in the same chapter. ' + 'Cover the chapter broadly across summary_sentences. ' + 'Explanations are 1-2 sentences and justify the correct answer (and ideally why the most tempting distractor is wrong). ' + 'Do not duplicate questions. Do not include questions whose answer is not directly supported by the chapter.\n\n' + 'CORRECTNESS CHECK: Before finalizing, verify that the choice at correct_index is genuinely and unambiguously ' + 'the best answer. If two choices could plausibly be correct, rewrite the stem to disambiguate or pick a different ' + 'topic. All four choices should look similar in length and style so the correct answer does not stand out.',
              contents: [{
                role: 'user',
                parts
              }],
              responseSchema: MC_SCHEMA
            });
          case 1:
            resp = _context7.v;
            data = extractJson(resp);
            _validateMCQuestions = validateMCQuestions(data.questions), questions = _validateMCQuestions.questions;
            return _context7.a(2, questions.map(function (q, i) {
              return _extends({
                id: "mc_" + Date.now() + "_" + i,
                mode: 'mc'
              }, q);
            }));
        }
      }, _callee7);
    }));
    return _generateMCQuestions.apply(this, arguments);
  }
  var DAILY_EXAM_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING'
            },
            choices: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            },
            correct_index: {
              type: 'INTEGER'
            },
            explanation: {
              type: 'STRING'
            },
            source_chapter: {
              type: 'INTEGER'
            },
            content_category: {
              type: 'STRING'
            },
            sirs_skill: {
              type: 'INTEGER'
            }
          },
          required: ['question', 'choices', 'correct_index', 'explanation', 'source_chapter']
        }
      }
    },
    required: ['questions']
  };
  function generateDailyExam(_x22, _x23) {
    return _generateDailyExam.apply(this, arguments);
  }
  function _generateDailyExam() {
    _generateDailyExam = _asyncToGenerator(_regenerator().m(function _callee8(materials, n) {
      var blocks, resp, data, _validateMCQuestions2, questions;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            if (n === void 0) {
              n = 15;
            }
            blocks = (materials || []).map(function (m, i) {
              return "### Chapter " + (i + 1) + ": " + m.chapter + (m.subject ? " (" + m.subject + ")" : '') + "\n" + ("" + JSON.stringify(m.extraction, null, 2).slice(0, 14000));
            }).join('\n\n');
            _context8.n = 1;
            return generate({
              maxOutputTokens: 32768,
              disableThinking: true,
              systemInstruction: 'You write a daily MCAT-style mini-exam from the chapters a student has ALREADY MASTERED. ' + ("Generate exactly " + n + " discrete (standalone) multiple-choice questions, spread as evenly as ") + 'possible across the supplied chapters so the set reviews the full breadth of what the student knows. ' + 'Every question has exactly 4 choices with `correct_index` (0-3) pointing to the single best answer. ' + 'These are genuine MCAT-style items: test application and reasoning, not bare recall — favour ' + '"why/how/predict/which-best-explains" stems over "what is the definition of" stems. ' + 'Distractors must be plausible and functional: common misconceptions, right-concept-wrong-scope, ' + 'reversed relationships, too-extreme statements, or correct-for-a-different-condition — never obviously ' + 'wrong. All four choices match in length and register so the answer never stands out. ' + 'TAGGING: set `source_chapter` to the NUMBER of the chapter block the question is drawn from — i.e. the ' + 'integer N in the "### Chapter N:" header above the material you used. This MUST be accurate: a question ' + 'must only test content found in that exact chapter block. Best-effort set `content_category` (the AAMC ' + 'content category, e.g. "1A", "5E") and `sirs_skill` (1-4) when confident. ' + 'Explanations are 1-2 sentences and justify the correct answer (and ideally why the most tempting ' + 'distractor is wrong). Do not duplicate questions. Never ask anything not directly supported by the ' + 'supplied chapter material.\n\n' + 'CORRECTNESS CHECK: before finalizing, verify the choice at correct_index is unambiguously the best ' + 'answer; if two choices could both be defended, rewrite the stem to disambiguate.',
              contents: [{
                role: 'user',
                parts: [{
                  text: "Mastered chapters (" + (materials || []).length + "):\n\n" + blocks + "\n\n" + ("Write today's " + n + "-question MCAT-style mini-exam, drawing proportionally across these chapters and ") + "setting each question's source_chapter to the \"### Chapter N:\" number it came from."
                }]
              }],
              responseSchema: DAILY_EXAM_SCHEMA
            });
          case 1:
            resp = _context8.v;
            data = extractJson(resp);
            _validateMCQuestions2 = validateMCQuestions(data.questions), questions = _validateMCQuestions2.questions;
            return _context8.a(2, questions.reduce(function (acc, q) {
              var idx = Number(q.source_chapter) - 1;
              var src = materials[idx];
              if (!src) return acc;
              var source_chapter = q.source_chapter,
                rest = _objectWithoutPropertiesLoose(q, _excluded);
              acc.push(_extends({
                id: "daily_" + Date.now() + "_" + acc.length,
                mode: 'mc'
              }, rest, {
                subject: src.subject || '',
                chapter: src.chapter || ''
              }));
              return acc;
            }, []));
        }
      }, _callee8);
    }));
    return _generateDailyExam.apply(this, arguments);
  }
  var SHORT_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            prompt: {
              type: 'STRING'
            },
            ideal_answer: {
              type: 'STRING'
            },
            key_points: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            }
          },
          required: ['prompt', 'ideal_answer', 'key_points']
        }
      }
    },
    required: ['questions']
  };
  function generateShortAnswers(_x24, _x25, _x26, _x27, _x28) {
    return _generateShortAnswers.apply(this, arguments);
  }
  function _generateShortAnswers() {
    _generateShortAnswers = _asyncToGenerator(_regenerator().m(function _callee9(fileUri, mimeType, extraction, chapterLabel, n) {
      var resp, data;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            if (n === void 0) {
              n = DEFAULT_SHORT_COUNT;
            }
            _context9.n = 1;
            return generate({
              maxOutputTokens: 16384,
              disableThinking: true,
              systemInstruction: 'You write open-ended short-answer study prompts from a chapter PDF and structured extraction. ' + 'Each prompt asks the student to explain or apply a concept in 2-4 sentences. ' + 'ideal_answer is a model answer (2-4 sentences) suitable for self-evaluation. ' + 'key_points is 3-6 short phrases that MUST appear (or be paraphrased) in a complete answer. ' + 'Cover a range of high-yield topics — do not duplicate.',
              contents: [{
                role: 'user',
                parts: function () {
                  var p = [];
                  if (fileUri && mimeType) p.push({
                    fileData: {
                      mimeType,
                      fileUri
                    }
                  });
                  p.push({
                    text: "Chapter: " + chapterLabel + "\n\n" + ("Extracted material:\n" + JSON.stringify(extraction, null, 2).slice(0, 60000) + "\n\n") + ("Generate exactly " + n + " short-answer study prompts.")
                  });
                  return p;
                }()
              }],
              responseSchema: SHORT_SCHEMA
            });
          case 1:
            resp = _context9.v;
            data = extractJson(resp);
            return _context9.a(2, (data.questions || []).map(function (q, i) {
              return _extends({
                id: "sa_" + Date.now() + "_" + i,
                mode: 'short'
              }, q);
            }));
        }
      }, _callee9);
    }));
    return _generateShortAnswers.apply(this, arguments);
  }
  function generateTermQuestions(_x29, _x30) {
    return _generateTermQuestions.apply(this, arguments);
  }
  function _generateTermQuestions() {
    _generateTermQuestions = _asyncToGenerator(_regenerator().m(function _callee0(extraction, chapterLabel) {
      var terms, BATCH, all, _loop, i;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            terms = (extraction == null ? void 0 : extraction.key_terms) || [];
            if (terms.length) {
              _context1.n = 1;
              break;
            }
            return _context1.a(2, []);
          case 1:
            BATCH = 12;
            all = [];
            _loop = _regenerator().m(function _loop(i) {
              var batch, resp, data, qs;
              return _regenerator().w(function (_context0) {
                while (1) switch (_context0.n) {
                  case 0:
                    batch = terms.slice(i, i + BATCH);
                    _context0.n = 1;
                    return generate({
                      maxOutputTokens: 16384,
                      disableThinking: true,
                      systemInstruction: 'You write tough MCAT-style multiple-choice questions, one per assigned term. ' + 'For each term, write a question testing understanding — definition, application, ' + 'mechanism, recognition in a clinical/behavioral scenario, or distinguishing the term from a sibling concept. ' + 'Vary phrasing across items; do NOT default to "What is the X?" — mix in scenarios, vignettes, "best example of", "most similar to", "which of the following would NOT". ' + 'Exactly 4 choices, correct_index 0-3.\n\n' + 'DISTRACTORS MUST BE GENUINELY HARD:\n' + '- Pull from commonly confused sibling concepts (e.g. for "generalization" use accommodation, assimilation, classical-vs-operant cousins).\n' + '- Pull from adjacent material in the broader MCAT corpus, not just this chapter — Piaget vs Vygotsky, Type I vs Type II errors, sympathetic vs parasympathetic, etc.\n' + '- Include at least one distractor that is technically true but does NOT answer the question.\n' + '- Avoid "obviously wrong" distractors (unrelated facts, gibberish, definitions of trivial items). Every distractor should make a half-prepared student hesitate.\n' + '- Don\'t pad with "all/none of the above" filler.\n\n' + 'Explanations are 1-2 sentences and should briefly call out why the most tempting distractor is wrong.\n\n' + 'CORRECTNESS CHECK: Before finalizing, verify that the choice at correct_index is genuinely and unambiguously ' + 'the best answer. All four choices should look similar in length and style.',
                      contents: [{
                        role: 'user',
                        parts: [{
                          text: "Chapter: " + chapterLabel + "\n\n" + "Assigned terms (write ONE question for each, in this order):\n" + batch.map(function (t, idx) {
                            return idx + 1 + ". " + t.term + " \u2014 " + t.definition;
                          }).join('\n') + "\n\nOther terms in the same chapter (fair game as distractor inspiration):\n" + terms.filter(function (_, idx) {
                            return idx < i || idx >= i + BATCH;
                          }).slice(0, 30).map(function (t) {
                            return "- " + t.term + ": " + t.definition;
                          }).join('\n') + ("\n\nReturn exactly " + batch.length + " questions, in the same order as the assigned terms above.")
                        }]
                      }],
                      responseSchema: MC_SCHEMA
                    });
                  case 1:
                    resp = _context0.v;
                    data = extractJson(resp);
                    qs = (data.questions || []).slice(0, batch.length);
                    qs.forEach(function (q, idx) {
                      all.push(_extends({
                        id: "term_" + Date.now() + "_" + (i + idx),
                        mode: 'mc',
                        from: 'term',
                        term: batch[idx].term
                      }, q));
                    });
                  case 2:
                    return _context0.a(2);
                }
              }, _loop);
            });
            i = 0;
          case 2:
            if (!(i < terms.length)) {
              _context1.n = 4;
              break;
            }
            return _context1.d(_regeneratorValues(_loop(i)), 3);
          case 3:
            i += BATCH;
            _context1.n = 2;
            break;
          case 4:
            return _context1.a(2, all);
        }
      }, _callee0);
    }));
    return _generateTermQuestions.apply(this, arguments);
  }
  var TWO_PART_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            theme: {
              type: 'STRING'
            },
            parts: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  question: {
                    type: 'STRING'
                  },
                  choices: {
                    type: 'ARRAY',
                    items: {
                      type: 'STRING'
                    }
                  },
                  correct_index: {
                    type: 'INTEGER'
                  },
                  explanation: {
                    type: 'STRING'
                  }
                },
                required: ['question', 'choices', 'correct_index', 'explanation']
              }
            }
          },
          required: ['theme', 'parts']
        }
      }
    },
    required: ['questions']
  };
  function generateTwoPartQuestions(_x31, _x32, _x33) {
    return _generateTwoPartQuestions.apply(this, arguments);
  }
  function _generateTwoPartQuestions() {
    _generateTwoPartQuestions = _asyncToGenerator(_regenerator().m(function _callee1(extraction, chapterLabel, n) {
      var _extraction$key_terms;
      var resp, data;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            if (n === void 0) {
              n = 6;
            }
            if (extraction != null && (_extraction$key_terms = extraction.key_terms) != null && _extraction$key_terms.length) {
              _context10.n = 1;
              break;
            }
            return _context10.a(2, []);
          case 1:
            _context10.n = 2;
            return generate({
              maxOutputTokens: 16384,
              disableThinking: true,
              systemInstruction: 'You design "two-part" MCAT-style multiple choice items. Each item has exactly TWO MC parts on RELATED-BUT-DIFFERENT concepts that students commonly confuse. ' + 'Example shape: Part 1 presents a brief scenario or stem and asks "this illustrates _____" (correct: generalization). ' + 'Part 2 then asks a definitional or application question on a sibling concept (correct: accommodation to a schema). ' + 'The two parts share a "theme" (the broader area the student must navigate) but probe DISTINCT concepts so a student who has them blurred together will miss one. ' + 'Each part has exactly 4 choices, correct_index 0-3, and a 1-2 sentence explanation. ' + 'Distractors should be tough — sibling concepts, near-misses, things the student would plausibly pick if they\'re half-prepared. ' + 'Avoid trivial filler distractors. All four choices should be roughly the same length and style.\n\n' + 'CORRECTNESS CHECK: verify correct_index points to the genuinely best answer before returning.',
              contents: [{
                role: 'user',
                parts: [{
                  text: "Chapter: " + chapterLabel + "\n\n" + "Key terms in this chapter (use as raw material for concept pairs that are commonly confused):\n" + (extraction.key_terms || []).slice(0, 40).map(function (t) {
                    return "- " + t.term + ": " + t.definition;
                  }).join('\n') + ("\n\nGenerate exactly " + n + " two-part items. Pick term pairs that students actually confuse (different theories explaining the same phenomenon, different stages of the same process, parallel mechanisms with subtle differences). ") + "Each \"parts\" array must have exactly 2 entries."
                }]
              }],
              responseSchema: TWO_PART_SCHEMA
            });
          case 2:
            resp = _context10.v;
            data = extractJson(resp);
            return _context10.a(2, (data.questions || []).map(function (q, i) {
              return _extends({
                id: "tp_" + Date.now() + "_" + i,
                mode: 'two_part'
              }, q);
            }));
        }
      }, _callee1);
    }));
    return _generateTwoPartQuestions.apply(this, arguments);
  }
  var FIX_FORMAT_RULES = 'FORMATTING RULES: Each answer choice must contain ONLY the answer text — never prefix a ' + 'choice with "A.", "B.", "C.", "D.", "(A)", or any letter label. Use proper typographic ' + 'characters (a real em-dash —, real quotes); NEVER output literal escape sequences such as ' + '\\u2014, \\u2019, \\n, or HTML entities. Fix any such artifacts you see in the original.';
  var FIX_SCHEMA = {
    type: 'OBJECT',
    properties: {
      action: {
        type: 'STRING'
      },
      question: {
        type: 'STRING'
      },
      choices: {
        type: 'ARRAY',
        items: {
          type: 'STRING'
        }
      },
      correct_index: {
        type: 'INTEGER'
      },
      explanation: {
        type: 'STRING'
      },
      rationale: {
        type: 'STRING'
      }
    },
    required: ['action', 'rationale']
  };
  var TWO_PART_FIX_SCHEMA = {
    type: 'OBJECT',
    properties: {
      action: {
        type: 'STRING'
      },
      theme: {
        type: 'STRING'
      },
      parts: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING'
            },
            choices: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            },
            correct_index: {
              type: 'INTEGER'
            },
            explanation: {
              type: 'STRING'
            }
          },
          required: ['question', 'choices', 'correct_index', 'explanation']
        }
      },
      rationale: {
        type: 'STRING'
      }
    },
    required: ['action', 'rationale']
  };
  function gradeShortAnswer(_x34) {
    return _gradeShortAnswer.apply(this, arguments);
  }
  function _gradeShortAnswer() {
    _gradeShortAnswer = _asyncToGenerator(_regenerator().m(function _callee10(_ref6) {
      var prompt, ideal_answer, key_points, user_answer, chapter, expected, expectedBlock, sys, userText, responseSchema, resp;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            prompt = _ref6.prompt, ideal_answer = _ref6.ideal_answer, key_points = _ref6.key_points, user_answer = _ref6.user_answer, chapter = _ref6.chapter;
            expected = (key_points || []).filter(Boolean);
            expectedBlock = expected.length ? "Key points the answer should cover:\n" + expected.map(function (p, i) {
              return i + 1 + ". " + p;
            }).join('\n') : '';
            sys = 'You grade short-answer MCAT-style responses. Decide whether the user\'s answer is good enough to earn FULL credit.\n' + 'Be moderately strict but charitable: accept paraphrased wording, partial reasoning that gets the key concepts right, and answers shorter than the ideal as long as the essential ideas are clearly present. Reject answers that miss a core concept, contradict the science, or are off-topic.\n' + 'Return strict JSON conforming to the provided schema. Do not include any prose outside the JSON.';
            userText = [chapter ? "Chapter context: " + chapter : '', "Question: " + (prompt || '(no prompt)'), "Ideal answer: " + (ideal_answer || '(none provided)'), expectedBlock, "User's answer:\n" + (user_answer || '(blank)'), '', 'Decide whether the user\'s answer should earn full credit.'].filter(Boolean).join('\n\n');
            responseSchema = {
              type: 'OBJECT',
              properties: {
                passes: {
                  type: 'BOOLEAN'
                },
                score: {
                  type: 'INTEGER'
                },
                feedback: {
                  type: 'STRING'
                },
                hit_points: {
                  type: 'ARRAY',
                  items: {
                    type: 'INTEGER'
                  }
                },
                missed_points: {
                  type: 'ARRAY',
                  items: {
                    type: 'INTEGER'
                  }
                }
              },
              required: ['passes', 'score', 'feedback']
            };
            _context11.n = 1;
            return generate({
              contents: [{
                role: 'user',
                parts: [{
                  text: userText
                }]
              }],
              systemInstruction: sys,
              responseSchema,
              maxOutputTokens: 2048,
              disableThinking: true
            });
          case 1:
            resp = _context11.v;
            return _context11.a(2, extractJson(resp));
        }
      }, _callee10);
    }));
    return _gradeShortAnswer.apply(this, arguments);
  }
  function fixFlaggedQuestion(_x35) {
    return _fixFlaggedQuestion.apply(this, arguments);
  }
  function _fixFlaggedQuestion() {
    _fixFlaggedQuestion = _asyncToGenerator(_regenerator().m(function _callee11(_ref7) {
      var question, flagDescription, chapterContext, letters, partsText, _resp, out, stem, choices, currentCorrect, resp;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            question = _ref7.question, flagDescription = _ref7.flagDescription, chapterContext = _ref7.chapterContext;
            letters = ['A', 'B', 'C', 'D'];
            if (!Array.isArray(question == null ? void 0 : question.parts)) {
              _context12.n = 2;
              break;
            }
            partsText = question.parts.map(function (p, pi) {
              return "Part " + (pi + 1) + ":\n" + ("  Stem: " + (p.question || '(no stem)') + "\n") + (p.choices || []).map(function (c, i) {
                return "  " + letters[i] + ". " + c;
              }).join('\n') + ("\n  Current correct: " + (letters[p.correct_index] || '?') + " (index " + p.correct_index + ")\n") + ("  Explanation: " + (p.explanation || '(none)'));
            }).join('\n\n');
            _context12.n = 1;
            return generate({
              maxOutputTokens: 4096,
              disableThinking: true,
              systemInstruction: 'You are a meticulous MCAT question editor. A user has flagged a TWO-PART multiple-choice ' + 'item (a theme plus exactly 2 sub-questions, each with 4 choices). Apply the smallest fix that ' + 'addresses their description. Set action to "edit" and return the theme plus both corrected ' + 'parts (each: stem, 4 choices, correct_index 0-3, 1-2 sentence explanation). NEVER delete the ' + 'item. If the flag describes no real problem, set action to "skip". Always give a short ' + 'rationale. ' + FIX_FORMAT_RULES,
              contents: [{
                role: 'user',
                parts: [{
                  text: "Chapter: " + (chapterContext || '(unknown)') + "\n\n" + ("--- Flagged two-part item ---\nTheme: " + (question.theme || '(none)') + "\n\n" + partsText + "\n\n") + ("--- User's flag ---\n" + flagDescription + "\n\n") + "Decide on action (\"edit\" or \"skip\" only) and return the corrected item if editing."
                }]
              }],
              responseSchema: TWO_PART_FIX_SCHEMA
            });
          case 1:
            _resp = _context12.v;
            out = extractJson(_resp);
            out.two_part = true;
            return _context12.a(2, out);
          case 2:
            stem = question.question || '(no stem)';
            choices = (question.choices || []).map(function (c, i) {
              return letters[i] + ". " + c;
            }).join('\n');
            currentCorrect = letters[question.correct_index] || '?';
            _context12.n = 3;
            return generate({
              maxOutputTokens: 4096,
              disableThinking: true,
              systemInstruction: 'You are a meticulous MCAT question editor. A user has flagged an MC question as having a problem. ' + 'Read their description carefully and apply the smallest fix that addresses it. ' + 'Set action to "edit" and return the full corrected question (stem, all four choices, the corrected ' + 'correct_index, and a 1-2 sentence explanation). ' + 'NEVER delete questions — every question must be preserved (especially term-coverage questions). ' + 'If the flag does not describe a real problem, set action to "skip". ' + 'If a question seems irredeemable, still edit it into something usable rather than deleting. ' + 'Always provide a short rationale. ' + FIX_FORMAT_RULES,
              contents: [{
                role: 'user',
                parts: [{
                  text: "Chapter: " + (chapterContext || '(unknown)') + "\n\n" + "--- Flagged question ---\n" + ("Stem: " + stem + "\n" + choices + "\n") + ("Current correct: " + currentCorrect + " (index " + question.correct_index + ")\n") + ("Current explanation: " + (question.explanation || '(none)') + "\n\n") + ("--- User's flag ---\n" + flagDescription + "\n\n") + "Decide on action (\"edit\" or \"skip\" only \u2014 never delete) and return the full corrected question if editing."
                }]
              }],
              responseSchema: FIX_SCHEMA
            });
          case 3:
            resp = _context12.v;
            return _context12.a(2, extractJson(resp));
        }
      }, _callee11);
    }));
    return _fixFlaggedQuestion.apply(this, arguments);
  }
  var AUDIT_SCHEMA = {
    type: 'OBJECT',
    properties: {
      results: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            index: {
              type: 'INTEGER'
            },
            correct: {
              type: 'BOOLEAN'
            },
            suggested_index: {
              type: 'INTEGER'
            },
            reason: {
              type: 'STRING'
            }
          },
          required: ['index', 'correct', 'suggested_index', 'reason']
        }
      }
    },
    required: ['results']
  };
  function auditQuestions(_x36) {
    return _auditQuestions.apply(this, arguments);
  }
  function _auditQuestions() {
    _auditQuestions = _asyncToGenerator(_regenerator().m(function _callee12(questions) {
      var BATCH, all, _loop2, i;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            BATCH = 8;
            all = [];
            _loop2 = _regenerator().m(function _loop2(i) {
              var batch, listing, resp, data;
              return _regenerator().w(function (_context13) {
                while (1) switch (_context13.n) {
                  case 0:
                    batch = questions.slice(i, i + BATCH);
                    listing = batch.map(function (q, idx) {
                      var letter = ['A', 'B', 'C', 'D'][q.correct_index] || '?';
                      return "--- Question " + (i + idx + 1) + " ---\n" + ("Stem: " + q.question + "\n") + ("A. " + q.choices[0] + "\nB. " + q.choices[1] + "\nC. " + q.choices[2] + "\nD. " + q.choices[3] + "\n") + ("Claimed correct: " + letter + " (index " + q.correct_index + ")\n") + ("Explanation: " + q.explanation);
                    }).join('\n\n');
                    _context13.n = 1;
                    return generate({
                      maxOutputTokens: 8192,
                      disableThinking: true,
                      systemInstruction: 'You are a meticulous MCAT question reviewer. For each question, evaluate whether the choice at correct_index ' + 'is genuinely and unambiguously the best answer. Consider whether the stem is clear, whether any distractor ' + 'could also be correct, and whether the explanation matches the indicated answer. ' + 'Return one result per question in the same order. NEVER suggest deletion — at worst suggest a different ' + 'correct_index, since every question must be preserved.',
                      contents: [{
                        role: 'user',
                        parts: [{
                          text: "Review these " + batch.length + " MC questions. For each, say whether the claimed correct answer is actually correct.\n\n" + listing
                        }]
                      }],
                      responseSchema: AUDIT_SCHEMA
                    });
                  case 1:
                    resp = _context13.v;
                    data = extractJson(resp);
                    (data.results || []).forEach(function (r, idx) {
                      all.push(_extends({}, r, {
                        index: i + idx
                      }));
                    });
                  case 2:
                    return _context13.a(2);
                }
              }, _loop2);
            });
            i = 0;
          case 1:
            if (!(i < questions.length)) {
              _context14.n = 3;
              break;
            }
            return _context14.d(_regeneratorValues(_loop2(i)), 2);
          case 2:
            i += BATCH;
            _context14.n = 1;
            break;
          case 3:
            return _context14.a(2, all);
        }
      }, _callee12);
    }));
    return _auditQuestions.apply(this, arguments);
  }
  var CARS_SCHEMA = {
    type: 'OBJECT',
    properties: {
      passage: {
        type: 'STRING'
      },
      discipline: {
        type: 'STRING'
      },
      title: {
        type: 'STRING'
      },
      source: {
        type: 'STRING'
      },
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING'
            },
            choices: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            },
            correct_index: {
              type: 'INTEGER'
            },
            category: {
              type: 'STRING'
            },
            subtype: {
              type: 'STRING'
            },
            explanation: {
              type: 'STRING'
            },
            choice_explanations: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            }
          },
          required: ['question', 'choices', 'correct_index', 'category', 'subtype', 'explanation', 'choice_explanations']
        }
      }
    },
    required: ['passage', 'discipline', 'title', 'questions']
  };
  function generateDailyCars(_x37) {
    return _generateDailyCars.apply(this, arguments);
  }
  function _generateDailyCars() {
    _generateDailyCars = _asyncToGenerator(_regenerator().m(function _callee13(discipline) {
      var resp, data;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            _context15.n = 1;
            return generate({
              maxOutputTokens: 32768,
              disableThinking: true,
              systemInstruction: 'You write original MCAT CARS (Critical Analysis and Reasoning Skills) practice sets — ' + 'one academic passage plus six multiple-choice questions — for a study app. The passages are ' + 'humanities or social-science prose, 500-600 words, built around a single arguable thesis with ' + 'real nuance (a concession, a fine distinction, a tonal shift). Never copy existing text; write ' + 'original prose. Questions test analysis of the passage only, never outside knowledge. Generate ' + 'exactly 6 questions covering all three AAMC categories (Foundations of Comprehension, Reasoning ' + 'Within the Text, Reasoning Beyond the Text), each with exactly 4 choices and a correct_index 0-3. ' + 'THESE MUST BE HARDER THAN THE REAL MCAT: distractors must be technically-true-but-unresponsive, ' + 'right-concept-wrong-scope, reversed relationships, too-extreme, or correct-for-the-wrong-paragraph ' + '— never obviously wrong. All four choices must match in length and register so the answer never ' + 'stands out. At least two questions must require combining two or more paragraphs. Include at ' + 'least one LEAST-supported / EXCEPT-style question. For every question give a 2-4 sentence ' + 'explanation and a one-line rationale for each of the four choices (choice_explanations, 4 entries).',
              contents: [{
                role: 'user',
                parts: [{
                  text: "Generate today's CARS set. Target discipline: " + discipline + ". Write the passage, then six " + "questions per the rules. Make it harder than a real MCAT CARS section \u2014 a strong student " + "should expect to miss one or two."
                }]
              }],
              responseSchema: CARS_SCHEMA
            });
          case 1:
            resp = _context15.v;
            data = extractJson(resp);
            data.questions = (data.questions || []).map(function (q, i) {
              return _extends({
                id: "cars_" + Date.now() + "_" + i,
                mode: 'mc'
              }, q);
            });
            return _context15.a(2, data);
        }
      }, _callee13);
    }));
    return _generateDailyCars.apply(this, arguments);
  }
  var CARS_QUESTIONS_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING'
            },
            choices: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            },
            correct_index: {
              type: 'INTEGER'
            },
            category: {
              type: 'STRING'
            },
            subtype: {
              type: 'STRING'
            },
            explanation: {
              type: 'STRING'
            },
            choice_explanations: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            }
          },
          required: ['question', 'choices', 'correct_index', 'category', 'subtype', 'explanation', 'choice_explanations']
        }
      }
    },
    required: ['questions']
  };
  function generateCarsQuestions(_x38, _x39) {
    return _generateCarsQuestions.apply(this, arguments);
  }
  function _generateCarsQuestions() {
    _generateCarsQuestions = _asyncToGenerator(_regenerator().m(function _callee14(passage, discipline) {
      var resp, data;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
          case 0:
            _context16.n = 1;
            return generate({
              maxOutputTokens: 32768,
              disableThinking: true,
              systemInstruction: 'You write MCAT CARS (Critical Analysis and Reasoning Skills) questions for a study app. ' + 'You are given a REAL public-domain passage of difficult humanities or social-science prose. ' + 'Do NOT rewrite, summarize, or replace the passage — write questions about it exactly as given. ' + 'Generate exactly 6 multiple-choice questions covering all three AAMC categories (Foundations of ' + 'Comprehension, Reasoning Within the Text, Reasoning Beyond the Text), each with exactly 4 choices ' + 'and a correct_index 0-3, testing analysis of THIS passage only — never outside knowledge. ' + 'THESE MUST BE HARDER THAN THE REAL MCAT: distractors must be technically-true-but-unresponsive, ' + 'right-concept-wrong-scope, reversed relationships, too-extreme, or correct-for-the-wrong-paragraph ' + '— never obviously wrong. All four choices must match in length and register so the answer never ' + 'stands out. At least two questions must require combining two or more paragraphs. Include at ' + 'least one LEAST-supported / EXCEPT-style question. For every question give a 2-4 sentence ' + 'explanation and a one-line rationale for each of the four choices (choice_explanations, 4 entries).',
              contents: [{
                role: 'user',
                parts: [{
                  text: "Discipline: " + discipline + "\n\n" + ("Passage (real public-domain text \u2014 do not alter it):\n" + passage + "\n\n") + "Write exactly 6 CARS questions on this passage, harder than a real MCAT CARS section \u2014 a strong " + "student should expect to miss one or two."
                }]
              }],
              responseSchema: CARS_QUESTIONS_SCHEMA
            });
          case 1:
            resp = _context16.v;
            data = extractJson(resp);
            return _context16.a(2, (data.questions || []).map(function (q, i) {
              return _extends({
                id: "cars_" + Date.now() + "_" + i,
                mode: 'mc'
              }, q);
            }));
        }
      }, _callee14);
    }));
    return _generateCarsQuestions.apply(this, arguments);
  }
  var CONNECTIONS_SCHEMA = {
    type: 'OBJECT',
    properties: {
      title: {
        type: 'STRING'
      },
      groups: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            category: {
              type: 'STRING'
            },
            difficulty: {
              type: 'STRING'
            },
            terms: {
              type: 'ARRAY',
              items: {
                type: 'STRING'
              }
            }
          },
          required: ['category', 'difficulty', 'terms']
        }
      }
    },
    required: ['title', 'groups']
  };
  function generateDailyConnections(_x40, _x41) {
    return _generateDailyConnections.apply(this, arguments);
  }
  function _generateDailyConnections() {
    _generateDailyConnections = _asyncToGenerator(_regenerator().m(function _callee15(termPool, dateStr) {
      var lines, resp;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            lines = termPool.map(function (t) {
              return "- " + t.term + (t.subject ? " [" + t.subject + "]" : '') + (t.definition ? ": " + t.definition.slice(0, 140) : '');
            });
            _context17.n = 1;
            return generate({
              maxOutputTokens: 8192,
              disableThinking: true,
              systemInstruction: 'You design daily "Connections" puzzles (NYT-style) for an MCAT study app. A puzzle is exactly 16 MCAT ' + 'terms drawn from the supplied pool, grouped into 4 categories of 4 terms each. Every category is a ' + 'genuine, defensible MCAT-relevant connection (a shared mechanism, anatomical system, hormone family, ' + 'cognitive bias family, amino-acid class, neurotransmitter system, lab technique, error type, etc.) — ' + 'not a superficial word-game connection. The four difficulty tiers form a deliberate ABSTRACTION RAMP: ' + 'the conceptual link binding the four terms must get progressively more abstract, indirect, and ' + 'non-obvious from green to purple. Abstraction must increase monotonically green < yellow < blue < ' + 'purple — never make yellow as easy as green, or blue as easy as yellow.\n' + '  • green  — easiest: a concrete, surface-level shared category a first-year student spots instantly ' + '(e.g. "steroid hormones", "bones of the forearm"). The link is literal and definitional.\n' + '  • yellow — harder: a clear single-discipline category that requires recalling each term\'s actual ' + 'definition, not just its name. More demanding than green but still concrete.\n' + '  • blue   — harder still: a subtle, usually cross-disciplinary link where the shared thread is a ' + 'mechanism, functional role, or shared consequence rather than a textbook heading. Solving it takes a ' + 'genuine conceptual leap, not just recall.\n' + '  • purple — hardest: a highly abstract, non-obvious link — the four terms share an underlying ' + 'principle, analogy, or second-order property that only clicks after real lateral thinking. The ' + 'connection should feel surprising yet defensible once seen. Deliberately include terms that LOOK like ' + 'they belong in the green/yellow/blue groups (red herrings). This is the heart of the puzzle.\n' + 'Hard constraints: each term must appear in exactly ONE group; the 16 chosen terms must all come from ' + 'the supplied pool (use the term name EXACTLY as given); never invent terms; never use the same term ' + 'twice. Category labels are short noun phrases (≤ 60 chars). Set `difficulty` to one of green/yellow/' + 'blue/purple. Pick a varied mix of subjects (not all bio, not all psych). Make at least one purple ' + 'category that genuinely requires lateral thinking — that is the heart of a good Connections puzzle.',
              contents: [{
                role: 'user',
                parts: [{
                  text: "Generate today's MCAT Connections puzzle (date: " + dateStr + "). Choose 16 terms from this pool of " + (termPool.length + " terms and group them into 4 categories of 4 with green/yellow/blue/purple ") + "difficulty. Return a short overall title for the puzzle.\n\n" + ("Term pool:\n" + lines.join('\n'))
                }]
              }],
              responseSchema: CONNECTIONS_SCHEMA
            });
          case 1:
            resp = _context17.v;
            return _context17.a(2, extractJson(resp));
        }
      }, _callee15);
    }));
    return _generateDailyConnections.apply(this, arguments);
  }
  function generateConnectionExplanation(_x42, _x43) {
    return _generateConnectionExplanation.apply(this, arguments);
  }
  function _generateConnectionExplanation() {
    _generateConnectionExplanation = _asyncToGenerator(_regenerator().m(function _callee16(category, terms) {
      var resp;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            _context18.n = 1;
            return generate({
              contents: [{
                role: 'user',
                parts: [{
                  text: "In two to four sentences, explain how these four MCAT terms are connected under the category \"" + category + "\":\n" + ("- " + terms.join('\n- ') + "\n\n") + "Write for a pre-med student studying for the MCAT. Focus on what binds them together conceptually. " + "No bullet points, no headers, no markdown \u2014 just plain prose."
                }]
              }],
              maxOutputTokens: 400
            });
          case 1:
            resp = _context18.v;
            return _context18.a(2, extractText(resp).trim());
        }
      }, _callee16);
    }));
    return _generateConnectionExplanation.apply(this, arguments);
  }
  function generateTermDefinition(_x44, _x45) {
    return _generateTermDefinition.apply(this, arguments);
  }
  function _generateTermDefinition() {
    _generateTermDefinition = _asyncToGenerator(_regenerator().m(function _callee17(term, context) {
      var resp;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            _context19.n = 1;
            return generate({
              contents: [{
                role: 'user',
                parts: [{
                  text: "Define the MCAT term \"" + term + "\"" + (context ? " (context: " + context + ")" : '') + " in one short, plain-prose sentence " + "aimed at a pre-med student. No markdown, no headers, no list formatting."
                }]
              }],
              maxOutputTokens: 220
            });
          case 1:
            resp = _context19.v;
            return _context19.a(2, extractText(resp).trim());
        }
      }, _callee17);
    }));
    return _generateTermDefinition.apply(this, arguments);
  }
  return {
    uploadFile,
    deleteFile,
    generate,
    ping,
    extractFromPdf,
    generateMCQuestions,
    generateShortAnswers,
    generateTermQuestions,
    generateTwoPartQuestions,
    fixFlaggedQuestion,
    auditQuestions,
    generateDailyCars,
    generateCarsQuestions,
    generateDailyExam,
    generateDailyConnections,
    generateConnectionExplanation,
    generateTermDefinition,
    gradeShortAnswer
  };
}
var ApiError = function (_Error2) {
  "use strict";

  function ApiError(status, message) {
    var _this4;
    _this4 = _Error2.call(this, message) || this;
    _this4.status = status;
    return _this4;
  }
  _inheritsLoose(ApiError, _Error2);
  return ApiError;
}(_wrapNativeSuper(Error));
function makeApiClient(getToken) {
  function call(_x46, _x47) {
    return _call.apply(this, arguments);
  }
  function _call() {
    _call = _asyncToGenerator(_regenerator().m(function _callee21(path, _temp2) {
      var _data;
      var _ref14, _ref14$method, method, body, _ref14$auth, auth, headers, t, res, data, _t2;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.p = _context23.n) {
          case 0:
            _ref14 = _temp2 === void 0 ? {} : _temp2, _ref14$method = _ref14.method, method = _ref14$method === void 0 ? 'GET' : _ref14$method, body = _ref14.body, _ref14$auth = _ref14.auth, auth = _ref14$auth === void 0 ? false : _ref14$auth;
            headers = {};
            if (body !== undefined) headers['Content-Type'] = 'application/json';
            if (!auth) {
              _context23.n = 2;
              break;
            }
            t = getToken();
            if (t) {
              _context23.n = 1;
              break;
            }
            throw new ApiError(401, 'not signed in');
          case 1:
            headers['Authorization'] = "Bearer " + t;
          case 2:
            _context23.n = 3;
            return fetch("" + API_BASE + path, {
              method,
              headers,
              body: body !== undefined ? JSON.stringify(body) : undefined
            });
          case 3:
            res = _context23.v;
            data = null;
            _context23.p = 4;
            _context23.n = 5;
            return res.json();
          case 5:
            data = _context23.v;
            _context23.n = 7;
            break;
          case 6:
            _context23.p = 6;
            _t2 = _context23.v;
          case 7:
            if (res.ok) {
              _context23.n = 8;
              break;
            }
            throw new ApiError(res.status, ((_data = data) == null ? void 0 : _data.error) || res.statusText || "HTTP " + res.status);
          case 8:
            return _context23.a(2, data);
        }
      }, _callee21, null, [[4, 6]]);
    }));
    return _call.apply(this, arguments);
  }
  return {
    signup: function signup(_ref8) {
      var username = _ref8.username,
        pin = _ref8.pin;
      return call('/signup', {
        method: 'POST',
        body: {
          username,
          pin
        }
      });
    },
    login: function login(_ref9) {
      var username = _ref9.username,
        pin = _ref9.pin;
      return call('/login', {
        method: 'POST',
        body: {
          username,
          pin
        }
      });
    },
    logout: function logout() {
      return call('/logout', {
        method: 'POST',
        auth: true
      });
    },
    me: function me() {
      return call('/me', {
        auth: true
      });
    },
    ping: function ping() {
      return call('/ping', {
        method: 'POST',
        auth: true
      });
    },
    postAttempts: function postAttempts(attempts) {
      return call('/attempts', {
        method: 'POST',
        body: {
          attempts
        },
        auth: true
      });
    },
    getAttempts: function getAttempts() {
      return call('/attempts', {
        auth: true
      });
    },
    deleteAttempts: function deleteAttempts(_temp3) {
      var _ref0 = _temp3 === void 0 ? {} : _temp3,
        file_id = _ref0.file_id,
        chapter = _ref0.chapter,
        subject = _ref0.subject,
        ts_gte = _ref0.ts_gte,
        ts_lt = _ref0.ts_lt,
        all = _ref0.all;
      return call('/attempts', {
        method: 'DELETE',
        body: {
          file_id,
          chapter,
          subject,
          ts_gte,
          ts_lt,
          all
        },
        auth: true
      });
    },
    meStats: function meStats() {
      return call('/me/stats', {
        auth: true
      });
    },
    leaderboard: function leaderboard() {
      return call('/leaderboard');
    },
    activity: function activity() {
      return call('/activity');
    },
    listCars: function listCars() {
      return call('/cars');
    },
    getCars: function getCars(date) {
      return carsSlotFor(date) > 1 ? Promise.reject(new ApiError(404, 'local CARS slot')) : call("/cars/" + encodeURIComponent(carsBaseDate(date)));
    },
    getCarsPassage: function getCarsPassage(date) {
      return carsSlotFor(date) > 1 ? Promise.reject(new ApiError(404, 'local CARS slot')) : call("/cars/passage?date=" + encodeURIComponent(carsBaseDate(date)));
    },
    postCars: function postCars(_ref1) {
      var date = _ref1.date,
        discipline = _ref1.discipline,
        title = _ref1.title,
        payload = _ref1.payload;
      return carsSlotFor(date) > 1 ? Promise.resolve({
        ok: true
      }) : call('/cars', {
        method: 'POST',
        body: {
          date: carsBaseDate(date),
          discipline,
          title,
          payload
        },
        auth: true
      });
    },
    listConnections: function listConnections() {
      return call('/connections');
    },
    getConnections: function getConnections(date) {
      return call("/connections/" + encodeURIComponent(date));
    },
    postConnections: function postConnections(_ref10) {
      var date = _ref10.date,
        title = _ref10.title,
        payload = _ref10.payload;
      return call('/connections', {
        method: 'POST',
        body: {
          date,
          title,
          payload
        },
        auth: true
      });
    },
    userProfile: function userProfile(username) {
      return call("/u/" + encodeURIComponent(username));
    },
    putBank: function () {
      var _putBank = _asyncToGenerator(_regenerator().m(function _callee18(bankJson) {
        var t, res, data;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.n) {
            case 0:
              t = getToken();
              if (t) {
                _context20.n = 1;
                break;
              }
              throw new ApiError(401, 'not signed in');
            case 1:
              _context20.n = 2;
              return fetch(API_BASE + "/bank", {
                method: 'PUT',
                headers: {
                  'Authorization': "Bearer " + t,
                  'Content-Type': 'application/json'
                },
                body: bankJson
              });
            case 2:
              res = _context20.v;
              _context20.n = 3;
              return res.json().catch(function () {
                return null;
              });
            case 3:
              data = _context20.v;
              if (res.ok) {
                _context20.n = 4;
                break;
              }
              throw new ApiError(res.status, (data == null ? void 0 : data.error) || "HTTP " + res.status);
            case 4:
              return _context20.a(2, data);
          }
        }, _callee18);
      }));
      function putBank(_x48) {
        return _putBank.apply(this, arguments);
      }
      return putBank;
    }(),
    getMyBank: function getMyBank() {
      return call('/bank', {
        auth: true
      });
    },
    getUserBank: function getUserBank(username) {
      return call("/bank/" + encodeURIComponent(username));
    },
    getState: function getState() {
      return call('/state', {
        auth: true
      });
    },
    putState: function putState(state) {
      return call('/state', {
        method: 'PUT',
        body: state,
        auth: true
      });
    },
    bankMeta: function bankMeta(username) {
      return call("/bank/" + encodeURIComponent(username) + "/meta");
    },
    deleteMyBank: function deleteMyBank() {
      return call('/bank', {
        method: 'DELETE',
        auth: true
      });
    },
    listBanks: function listBanks() {
      return call('/banks');
    },
    postExamBank: function postExamBank(questions) {
      return call('/exam-bank', {
        method: 'POST',
        body: {
          questions
        },
        auth: true
      });
    },
    examBankStats: function examBankStats() {
      return call('/exam-bank');
    },
    examBankQuestions: function examBankQuestions(_temp4) {
      var _ref11 = _temp4 === void 0 ? {} : _temp4,
        section = _ref11.section,
        subject = _ref11.subject,
        chapter = _ref11.chapter,
        limit = _ref11.limit;
      var p = new URLSearchParams();
      if (section) p.set('section', section);
      if (subject) p.set('subject', subject);
      if (chapter) p.set('chapter', chapter);
      if (limit) p.set('limit', String(limit));
      var qs = p.toString();
      return call("/exam-bank/questions" + (qs ? "?" + qs : ''));
    },
    listChapters: function listChapters() {
      return call('/chapters');
    },
    getChapter: function getChapter(id) {
      return call("/chapters/" + encodeURIComponent(id));
    },
    createChapter: function createChapter(_ref12) {
      var subject = _ref12.subject,
        title = _ref12.title,
        filename = _ref12.filename,
        size_bytes = _ref12.size_bytes;
      return call('/chapters', {
        method: 'POST',
        body: {
          subject,
          title,
          filename,
          size_bytes
        },
        auth: true
      });
    },
    deleteChapter: function deleteChapter(id) {
      return call("/chapters/" + encodeURIComponent(id), {
        method: 'DELETE',
        auth: true
      });
    },
    putChapterStage: function () {
      var _putChapterStage = _asyncToGenerator(_regenerator().m(function _callee19(id, stage, payload) {
        var t, body, res, data;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.n) {
            case 0:
              t = getToken();
              if (t) {
                _context21.n = 1;
                break;
              }
              throw new ApiError(401, 'not signed in');
            case 1:
              body = typeof payload === 'string' ? payload : JSON.stringify(payload);
              _context21.n = 2;
              return fetch(API_BASE + "/chapters/" + encodeURIComponent(id) + "/stage/" + encodeURIComponent(stage), {
                method: 'PUT',
                headers: {
                  'Authorization': "Bearer " + t,
                  'Content-Type': 'application/json'
                },
                body
              });
            case 2:
              res = _context21.v;
              _context21.n = 3;
              return res.json().catch(function () {
                return null;
              });
            case 3:
              data = _context21.v;
              if (res.ok) {
                _context21.n = 4;
                break;
              }
              throw new ApiError(res.status, (data == null ? void 0 : data.error) || "HTTP " + res.status);
            case 4:
              return _context21.a(2, data);
          }
        }, _callee19);
      }));
      function putChapterStage(_x49, _x50, _x51) {
        return _putChapterStage.apply(this, arguments);
      }
      return putChapterStage;
    }(),
    addChapterFlag: function addChapterFlag(id, _ref13) {
      var question_id = _ref13.question_id,
        description = _ref13.description;
      return call("/chapters/" + encodeURIComponent(id) + "/flags", {
        method: 'POST',
        body: {
          question_id,
          description
        },
        auth: true
      });
    },
    setChapterFlags: function () {
      var _setChapterFlags = _asyncToGenerator(_regenerator().m(function _callee20(id, flags) {
        var t, res, data;
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              t = getToken();
              if (t) {
                _context22.n = 1;
                break;
              }
              throw new ApiError(401, 'not signed in');
            case 1:
              _context22.n = 2;
              return fetch(API_BASE + "/chapters/" + encodeURIComponent(id) + "/flags", {
                method: 'PUT',
                headers: {
                  'Authorization': "Bearer " + t,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(flags)
              });
            case 2:
              res = _context22.v;
              _context22.n = 3;
              return res.json().catch(function () {
                return null;
              });
            case 3:
              data = _context22.v;
              if (res.ok) {
                _context22.n = 4;
                break;
              }
              throw new ApiError(res.status, (data == null ? void 0 : data.error) || "HTTP " + res.status);
            case 4:
              return _context22.a(2, data);
          }
        }, _callee20);
      }));
      function setChapterFlags(_x52, _x53) {
        return _setChapterFlags.apply(this, arguments);
      }
      return setChapterFlags;
    }()
  };
}
function forceUpdateApp() {
  return _forceUpdateApp.apply(this, arguments);
}
function _forceUpdateApp() {
  _forceUpdateApp = _asyncToGenerator(_regenerator().m(function _callee73() {
    var keys, regs, url, _t76;
    return _regenerator().w(function (_context81) {
      while (1) switch (_context81.p = _context81.n) {
        case 0:
          _context81.p = 0;
          if (!('caches' in window)) {
            _context81.n = 2;
            break;
          }
          _context81.n = 1;
          return caches.keys();
        case 1:
          keys = _context81.v;
          _context81.n = 2;
          return Promise.all(keys.map(function (k) {
            return caches.delete(k);
          }));
        case 2:
          if (!('serviceWorker' in navigator)) {
            _context81.n = 4;
            break;
          }
          _context81.n = 3;
          return navigator.serviceWorker.getRegistrations();
        case 3:
          regs = _context81.v;
          _context81.n = 4;
          return Promise.all(regs.map(function (r) {
            return r.unregister();
          }));
        case 4:
          _context81.n = 6;
          break;
        case 5:
          _context81.p = 5;
          _t76 = _context81.v;
        case 6:
          url = new URL(window.location.href);
          url.searchParams.set('_t', Date.now().toString());
          window.location.replace(url.toString());
        case 7:
          return _context81.a(2);
      }
    }, _callee73, null, [[0, 5]]);
  }));
  return _forceUpdateApp.apply(this, arguments);
}
var AppCtx = createContext(null);
var useApp = function useApp() {
  return useContext(AppCtx);
};
function AppProvider(_ref15) {
  var children = _ref15.children;
  var _useState = useState(function () {
      return storage.get(KEYS.apiKey, '');
    }),
    apiKey = _useState[0],
    setApiKeyState = _useState[1];
  var _useState2 = useState(function () {
      return storage.get(KEYS.files, []);
    }),
    files = _useState2[0],
    setFilesState = _useState2[1];
  var _useState3 = useState(function () {
      return storage.get(KEYS.extractions, {});
    }),
    extractions = _useState3[0],
    setExtractionsState = _useState3[1];
  var _useState4 = useState(function () {
      return storage.get(KEYS.questions, {});
    }),
    questions = _useState4[0],
    setQuestionsState = _useState4[1];
  var _useState5 = useState(function () {
      return storage.get(KEYS.attempts, []);
    }),
    attempts = _useState5[0],
    setAttemptsState = _useState5[1];
  var _useState6 = useState(null),
    staticBank = _useState6[0],
    setStaticBank = _useState6[1];
  var _useState7 = useState(false),
    readOnly = _useState7[0],
    setReadOnly = _useState7[1];
  var _useState8 = useState(function () {
      return parseStoredTheme();
    }),
    themePref = _useState8[0],
    setThemePref = _useState8[1];
  var palette = themePref.palette,
    mode = themePref.mode;
  var setPalette = useCallback(function (p) {
    if (!PALETTES.includes(p)) return;
    setThemePref(function (prev) {
      var next = _extends({}, prev, {
        palette: p
      });
      storage.set(KEYS.theme, next);
      return next;
    });
  }, []);
  var setMode = useCallback(function (m) {
    if (!MODES.includes(m)) return;
    setThemePref(function (prev) {
      var next = _extends({}, prev, {
        mode: m
      });
      storage.set(KEYS.theme, next);
      return next;
    });
  }, []);
  var _useState9 = useState(function () {
      return _extends({}, DEFAULT_GITHUB, storage.get(KEYS.github, {}) || {});
    }),
    github = _useState9[0],
    setGithubState = _useState9[1];
  var _useState0 = useState({
      state: 'idle',
      lastAt: null,
      error: null
    }),
    pushStatus = _useState0[0],
    setPushStatus = _useState0[1];
  var _useState1 = useState(function () {
      return !!storage.get(KEYS.reaudit, false);
    }),
    reauditEnabled = _useState1[0],
    setReauditEnabledState = _useState1[1];
  var setReauditEnabled = useCallback(function (v) {
    storage.set(KEYS.reaudit, !!v);
    setReauditEnabledState(!!v);
  }, []);
  var _useState10 = useState(function () {
      return !!storage.get(KEYS.autoDownload, false);
    }),
    autoDownloadChapters = _useState10[0],
    setAutoDownloadChaptersState = _useState10[1];
  var setAutoDownloadChapters = useCallback(function (v) {
    storage.set(KEYS.autoDownload, !!v);
    setAutoDownloadChaptersState(!!v);
  }, []);
  var _useState11 = useState(function () {
      return !!storage.get(KEYS.autoDownloadAll, false);
    }),
    autoDownloadAll = _useState11[0],
    setAutoDownloadAllState = _useState11[1];
  var setAutoDownloadAll = useCallback(function (v) {
    storage.set(KEYS.autoDownloadAll, !!v);
    setAutoDownloadAllState(!!v);
  }, []);
  var _useState12 = useState(function () {
      return !!storage.get(KEYS.contributorMode, false);
    }),
    contributorMode = _useState12[0],
    setContributorModeState = _useState12[1];
  var setContributorMode = useCallback(function (v) {
    storage.set(KEYS.contributorMode, !!v);
    setContributorModeState(!!v);
  }, []);
  var _useState13 = useState(function () {
      return !!storage.get(KEYS.tropicalBg, false);
    }),
    tropicalBg = _useState13[0],
    setTropicalBgState = _useState13[1];
  var setTropicalBg = useCallback(function (v) {
    storage.set(KEYS.tropicalBg, !!v);
    setTropicalBgState(!!v);
  }, []);
  var _useState14 = useState(function () {
      var v = storage.get(KEYS.bgBlur, 0);
      return typeof v === 'number' && v >= 0 && v <= 100 ? v : 0;
    }),
    bgBlur = _useState14[0],
    setBgBlurState = _useState14[1];
  var setBgBlur = useCallback(function (v) {
    var clamped = Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
    storage.set(KEYS.bgBlur, clamped);
    setBgBlurState(clamped);
  }, []);
  var _useState15 = useState(function () {
      return !!storage.get(KEYS.experimentalUI, false);
    }),
    experimentalUI = _useState15[0],
    setExperimentalUIState = _useState15[1];
  var setExperimentalUI = useCallback(function (v) {
    storage.set(KEYS.experimentalUI, !!v);
    setExperimentalUIState(!!v);
  }, []);
  var _useState16 = useState(function () {
      return !!storage.get(KEYS.glass, false);
    }),
    glass = _useState16[0],
    setGlassState = _useState16[1];
  var setGlass = useCallback(function (v) {
    storage.set(KEYS.glass, !!v);
    setGlassState(!!v);
  }, []);
  var _useState17 = useState(function () {
      var v = storage.get(KEYS.volume, 1);
      return typeof v === 'number' && v >= 0 && v <= 1 ? v : 1;
    }),
    volume = _useState17[0],
    setVolumeState = _useState17[1];
  var setVolume = useCallback(function (v) {
    var clamped = Math.min(1, Math.max(0, Number(v) || 0));
    storage.set(KEYS.volume, clamped);
    setVolumeState(clamped);
  }, []);
  var setGithub = useCallback(function (patch) {
    setGithubState(function (prev) {
      var next = typeof patch === 'function' ? patch(prev) : _extends({}, prev, patch);
      storage.set(KEYS.github, next);
      return next;
    });
  }, []);
  var pushBank = useCallback(_asyncToGenerator(_regenerator().m(function _callee22() {
    var cur, _t3;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.p = _context24.n) {
        case 0:
          setPushStatus({
            state: 'pushing',
            lastAt: null,
            error: null
          });
          _context24.p = 1;
          cur = {
            files: storage.get(KEYS.files, []),
            extractions: storage.get(KEYS.extractions, {}),
            questions: storage.get(KEYS.questions, {})
          };
          _context24.n = 2;
          return pushBankToGithub(github, cur);
        case 2:
          setPushStatus({
            state: 'idle',
            lastAt: Date.now(),
            error: null
          });
          return _context24.a(2, true);
        case 3:
          _context24.p = 3;
          _t3 = _context24.v;
          setPushStatus({
            state: 'error',
            lastAt: null,
            error: _t3.message
          });
          return _context24.a(2, false);
      }
    }, _callee22, null, [[1, 3]]);
  })), [github]);
  useEffect(function () {
    var apply = function apply() {
      var resolved = dataThemeFor(palette, mode);
      document.documentElement.setAttribute('data-theme', resolved);
      updateFavicon(resolved);
    };
    apply();
    if (mode === 'system') {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function onChange() {
        return apply();
      };
      if (mq.addEventListener) {
        mq.addEventListener('change', onChange);
        return function () {
          return mq.removeEventListener('change', onChange);
        };
      }
      mq.addListener(onChange);
      return function () {
        return mq.removeListener(onChange);
      };
    }
  }, [palette, mode]);
  useEffect(function () {
    var root = document.documentElement;
    if (experimentalUI) root.setAttribute('data-exp', 'on');else root.removeAttribute('data-exp');
    if (experimentalUI && glass) root.setAttribute('data-glass', 'on');else root.removeAttribute('data-glass');
  }, [experimentalUI, glass]);
  useEffect(function () {
    var isDark = dataThemeFor(palette, mode).startsWith('dark');
    if (tropicalBg) {
      applyDynamicBg(palette, isDark);
    } else {
      stopDynamicBg();
    }
    return stopDynamicBg;
  }, [tropicalBg, palette, mode]);
  useEffect(function () {
    var el = document.getElementById('mc-dyn-bg');
    if (!el) return;
    el.style.filter = bgBlur > 0 ? "blur(" + bgBlur / 100 * 32 + "px)" : '';
  }, [bgBlur, tropicalBg, palette, mode]);
  useEffect(function () {
    try {
      localStorage.removeItem('mcat:birdPos');
    } catch (_unused33) {}
  }, []);
  useEffect(function () {
    var cancelled = false;
    _asyncToGenerator(_regenerator().m(function _callee23() {
      var res, ct, data, _t4;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.p = _context25.n) {
          case 0:
            _context25.p = 0;
            _context25.n = 1;
            return fetch('./data.json', {
              cache: 'no-store'
            });
          case 1:
            res = _context25.v;
            if (res.ok) {
              _context25.n = 2;
              break;
            }
            return _context25.a(2);
          case 2:
            ct = res.headers.get('content-type') || '';
            if (ct.includes('json')) {
              _context25.n = 3;
              break;
            }
            return _context25.a(2);
          case 3:
            _context25.n = 4;
            return res.json();
          case 4:
            data = _context25.v;
            if (!cancelled) {
              _context25.n = 5;
              break;
            }
            return _context25.a(2);
          case 5:
            if (data != null && data.files && data != null && data.questions) {
              setStaticBank({
                files: data.files,
                extractions: data.extractions || {},
                questions: data.questions || {}
              });
            }
            _context25.n = 7;
            break;
          case 6:
            _context25.p = 6;
            _t4 = _context25.v;
          case 7:
            return _context25.a(2);
        }
      }, _callee23, null, [[0, 6]]);
    }))();
    return function () {
      cancelled = true;
    };
  }, []);
  var useStaticBank = useCallback(function () {
    if (!staticBank) return;
    setFilesState(staticBank.files);
    setExtractionsState(staticBank.extractions);
    setQuestionsState(staticBank.questions);
    storage.set(KEYS.files, staticBank.files);
    storage.set(KEYS.extractions, staticBank.extractions);
    storage.set(KEYS.questions, staticBank.questions);
    setReadOnly(true);
  }, [staticBank]);
  var setApiKey = useCallback(function (k) {
    if (k) storage.set(KEYS.apiKey, k);else storage.remove(KEYS.apiKey);
    setApiKeyState(k || '');
  }, []);
  var setFiles = useCallback(function (updater) {
    setFilesState(function (prev) {
      var next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set(KEYS.files, next);
      return next;
    });
  }, []);
  var setExtraction = useCallback(function (fileId, data) {
    setExtractionsState(function (prev) {
      var next = _extends({}, prev);
      if (data === undefined) delete next[fileId];else next[fileId] = data;
      storage.set(KEYS.extractions, next);
      return next;
    });
  }, []);
  var setQuestionsFor = useCallback(function (fileId, data) {
    setQuestionsState(function (prev) {
      var next = _extends({}, prev);
      if (data === undefined) delete next[fileId];else next[fileId] = data;
      storage.set(KEYS.questions, next);
      return next;
    });
  }, []);
  var addAttempt = useCallback(function (a) {
    var cid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2, 12);
    var stamped = _extends({}, a, {
      ts: Date.now(),
      client_id: a.client_id || cid
    });
    setAttemptsState(function (prev) {
      var next = [].concat(prev, [stamped]);
      storage.set(KEYS.attempts, next);
      return next;
    });
  }, []);
  var updateLastAttempt = useCallback(function (question_id, patch) {
    if (!question_id || !patch) return;
    setAttemptsState(function (prev) {
      var idx = -1;
      for (var i = prev.length - 1; i >= 0; i--) {
        if (prev[i].question_id === question_id) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return prev;
      var next = prev.slice();
      next[idx] = _extends({}, next[idx], patch, {
        synced: false
      });
      storage.set(KEYS.attempts, next);
      return next;
    });
  }, []);
  var clearAttempts = useCallback(function () {
    storage.set(KEYS.attempts, []);
    setAttemptsState([]);
  }, []);
  var client = useMemo(function () {
    return makeClient(function () {
      return storage.get(KEYS.apiKey, '');
    });
  }, []);
  var _useState18 = useState(function () {
      return storage.get(KEYS.session, null);
    }),
    session = _useState18[0],
    setSessionState = _useState18[1];
  var _useState19 = useState(false),
    syncBusy = _useState19[0],
    setSyncBusy = _useState19[1];
  var _useState20 = useState(''),
    syncError = _useState20[0],
    setSyncError = _useState20[1];
  var setSession = useCallback(function (s) {
    if (s) storage.set(KEYS.session, s);else storage.remove(KEYS.session);
    setSessionState(s);
  }, []);
  var api = useMemo(function () {
    return makeApiClient(function () {
      var _storage$get;
      return ((_storage$get = storage.get(KEYS.session, null)) == null ? void 0 : _storage$get.token) || '';
    });
  }, []);
  var pendingSync = useMemo(function () {
    return attempts.filter(function (a) {
      return !a.synced;
    });
  }, [attempts]);
  var syncLockRef = useRef(false);
  var flushSync = useCallback(_asyncToGenerator(_regenerator().m(function _callee24() {
    var s, queue, CHUNK, remaining, inserted, chunk, resp, idOf, queuedIds, _t5;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.p = _context26.n) {
        case 0:
          s = storage.get(KEYS.session, null);
          if (s != null && s.token) {
            _context26.n = 1;
            break;
          }
          return _context26.a(2, {
            ok: false,
            reason: 'not signed in'
          });
        case 1:
          if (!syncLockRef.current) {
            _context26.n = 2;
            break;
          }
          return _context26.a(2, {
            ok: false,
            reason: 'busy'
          });
        case 2:
          syncLockRef.current = true;
          setSyncBusy(true);
          setSyncError('');
          _context26.p = 3;
          queue = storage.get(KEYS.attempts, []).filter(function (a) {
            return !a.synced;
          });
          if (queue.length) {
            _context26.n = 4;
            break;
          }
          return _context26.a(2, {
            ok: true,
            inserted: 0
          });
        case 4:
          CHUNK = 200;
          remaining = queue.slice();
          inserted = 0;
        case 5:
          if (!remaining.length) {
            _context26.n = 7;
            break;
          }
          chunk = remaining.slice(0, CHUNK);
          _context26.n = 6;
          return api.postAttempts(chunk);
        case 6:
          resp = _context26.v;
          inserted += resp && typeof resp.inserted === 'number' ? resp.inserted : chunk.length;
          remaining = remaining.slice(CHUNK);
          _context26.n = 5;
          break;
        case 7:
          idOf = function idOf(a) {
            return a.client_id ? "c:" + a.client_id : "t:" + a.ts + ":" + a.question_id;
          };
          queuedIds = new Set(queue.map(idOf));
          setAttemptsState(function (prev) {
            var next = prev.map(function (a) {
              return queuedIds.has(idOf(a)) ? _extends({}, a, {
                synced: true
              }) : a;
            });
            storage.set(KEYS.attempts, next);
            return next;
          });
          return _context26.a(2, {
            ok: true,
            inserted,
            submitted: queue.length
          });
        case 8:
          _context26.p = 8;
          _t5 = _context26.v;
          setSyncError(_t5.message || 'sync failed');
          if (_t5.status === 401) {
            storage.remove(KEYS.session);
            setSessionState(null);
          }
          return _context26.a(2, {
            ok: false,
            reason: _t5.message
          });
        case 9:
          _context26.p = 9;
          syncLockRef.current = false;
          setSyncBusy(false);
          return _context26.f(9);
        case 10:
          return _context26.a(2);
      }
    }, _callee24, null, [[3, 8, 9, 10]]);
  })), [api]);
  var pullAttempts = useCallback(_asyncToGenerator(_regenerator().m(function _callee25() {
    var s, resp, remote, _t6;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.p = _context27.n) {
        case 0:
          s = storage.get(KEYS.session, null);
          if (s != null && s.token) {
            _context27.n = 1;
            break;
          }
          return _context27.a(2, {
            ok: false,
            reason: 'not signed in'
          });
        case 1:
          _context27.p = 1;
          _context27.n = 2;
          return api.getAttempts();
        case 2:
          resp = _context27.v;
          remote = Array.isArray(resp == null ? void 0 : resp.attempts) ? resp.attempts : [];
          if (remote.length) {
            _context27.n = 3;
            break;
          }
          return _context27.a(2, {
            ok: true,
            added: 0,
            total: 0
          });
        case 3:
          setAttemptsState(function (prev) {
            var haveCid = new Set();
            var haveLegacy = new Set();
            for (var _iterator29 = _createForOfIteratorHelperLoose(prev), _step29; !(_step29 = _iterator29()).done;) {
              var a = _step29.value;
              if (a.client_id) haveCid.add(a.client_id);else haveLegacy.add(a.ts + ":" + a.question_id);
            }
            var additions = [];
            for (var _iterator30 = _createForOfIteratorHelperLoose(remote), _step30; !(_step30 = _iterator30()).done;) {
              var r = _step30.value;
              if (r.client_id) {
                if (haveCid.has(r.client_id)) continue;
                haveCid.add(r.client_id);
              } else {
                var key = r.ts + ":" + r.question_id;
                if (haveLegacy.has(key)) continue;
                haveLegacy.add(key);
              }
              additions.push({
                question_id: r.question_id,
                mode: r.mode,
                file_id: r.file_id || undefined,
                chapter: r.chapter || undefined,
                subject: r.subject || undefined,
                correct: !!r.correct,
                ts: r.ts,
                client_id: r.client_id || undefined,
                synced: true
              });
            }
            if (!additions.length) return prev;
            var next = [].concat(prev, additions).sort(function (a, b) {
              return (a.ts || 0) - (b.ts || 0);
            });
            storage.set(KEYS.attempts, next);
            return next;
          });
          return _context27.a(2, {
            ok: true,
            fetched: remote.length
          });
        case 4:
          _context27.p = 4;
          _t6 = _context27.v;
          return _context27.a(2, {
            ok: false,
            reason: _t6.message
          });
      }
    }, _callee25, null, [[1, 4]]);
  })), [api]);
  var eraseStatsFor = useCallback(function () {
    var _ref20 = _asyncToGenerator(_regenerator().m(function _callee26(_temp5) {
      var _serverResult$deleted, _serverResult;
      var _ref21, file_id, chapter, subject, ts_gte, ts_lt, s, serverResult, _t7;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.p = _context28.n) {
          case 0:
            _ref21 = _temp5 === void 0 ? {} : _temp5, file_id = _ref21.file_id, chapter = _ref21.chapter, subject = _ref21.subject, ts_gte = _ref21.ts_gte, ts_lt = _ref21.ts_lt;
            s = storage.get(KEYS.session, null);
            serverResult = null;
            if (!(s != null && s.token)) {
              _context28.n = 4;
              break;
            }
            _context28.p = 1;
            _context28.n = 2;
            return api.deleteAttempts({
              file_id,
              chapter,
              subject,
              ts_gte,
              ts_lt
            });
          case 2:
            serverResult = _context28.v;
            _context28.n = 4;
            break;
          case 3:
            _context28.p = 3;
            _t7 = _context28.v;
            return _context28.a(2, {
              ok: false,
              reason: _t7.message
            });
          case 4:
            setAttemptsState(function (prev) {
              var next = prev.filter(function (a) {
                if (file_id && a.file_id === file_id) return false;
                if (chapter && a.chapter === chapter && (!subject || a.subject === subject)) return false;
                if (Number.isFinite(ts_gte) || Number.isFinite(ts_lt)) {
                  var t = a.ts || 0;
                  var okGte = !Number.isFinite(ts_gte) || t >= ts_gte;
                  var okLt = !Number.isFinite(ts_lt) || t < ts_lt;
                  if (okGte && okLt) return false;
                }
                return true;
              });
              storage.set(KEYS.attempts, next);
              return next;
            });
            return _context28.a(2, {
              ok: true,
              serverDeleted: (_serverResult$deleted = (_serverResult = serverResult) == null ? void 0 : _serverResult.deleted) != null ? _serverResult$deleted : 0
            });
        }
      }, _callee26, null, [[1, 3]]);
    }));
    return function (_x54) {
      return _ref20.apply(this, arguments);
    };
  }(), [api]);
  useEffect(function () {
    if (!(session != null && session.token)) return;
    _asyncToGenerator(_regenerator().m(function _callee27() {
      var _t8, _t9;
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.p = _context29.n) {
          case 0:
            _context29.p = 0;
            _context29.n = 1;
            return pullAttempts();
          case 1:
            _context29.n = 3;
            break;
          case 2:
            _context29.p = 2;
            _t8 = _context29.v;
          case 3:
            _context29.p = 3;
            _context29.n = 4;
            return flushSync();
          case 4:
            _context29.n = 6;
            break;
          case 5:
            _context29.p = 5;
            _t9 = _context29.v;
          case 6:
            return _context29.a(2);
        }
      }, _callee27, null, [[3, 5], [0, 2]]);
    }))();
  }, [session == null ? void 0 : session.token, pullAttempts, flushSync]);
  var _useState21 = useState(0),
    stateRev = _useState21[0],
    setStateRev = _useState21[1];
  var stateHydratedRef = useRef(false);
  var lastPushedStateRef = useRef(null);
  var statePushTimerRef = useRef(null);
  var pushState = useCallback(_asyncToGenerator(_regenerator().m(function _callee28() {
    var s, blob, _t0;
    return _regenerator().w(function (_context30) {
      while (1) switch (_context30.p = _context30.n) {
        case 0:
          s = storage.get(KEYS.session, null);
          if (!(!(s != null && s.token) || !stateHydratedRef.current)) {
            _context30.n = 1;
            break;
          }
          return _context30.a(2);
        case 1:
          blob = serializeSyncState(readSyncState());
          if (!(blob === lastPushedStateRef.current)) {
            _context30.n = 2;
            break;
          }
          return _context30.a(2);
        case 2:
          _context30.p = 2;
          _context30.n = 3;
          return api.putState(JSON.parse(blob));
        case 3:
          lastPushedStateRef.current = blob;
          storage.set(KEYS.stateUpdatedAt, Date.now());
          _context30.n = 5;
          break;
        case 4:
          _context30.p = 4;
          _t0 = _context30.v;
        case 5:
          return _context30.a(2);
      }
    }, _callee28, null, [[2, 4]]);
  })), [api]);
  var scheduleStatePush = useCallback(function () {
    if (!stateHydratedRef.current) return;
    if (statePushTimerRef.current) clearTimeout(statePushTimerRef.current);
    statePushTimerRef.current = setTimeout(function () {
      pushState();
    }, 1500);
  }, [pushState]);
  var pullState = useCallback(_asyncToGenerator(_regenerator().m(function _callee29() {
    var _resp2;
    var s, resp, cloud, cloudUpdatedAt, localUpdatedAt, cloudNewer, merged, _iterator31, _step31, k, th, mergedStr, _t1, _t10;
    return _regenerator().w(function (_context31) {
      while (1) switch (_context31.p = _context31.n) {
        case 0:
          s = storage.get(KEYS.session, null);
          if (s != null && s.token) {
            _context31.n = 1;
            break;
          }
          return _context31.a(2);
        case 1:
          _context31.p = 1;
          _context31.n = 2;
          return api.getState();
        case 2:
          resp = _context31.v;
          _context31.n = 4;
          break;
        case 3:
          _context31.p = 3;
          _t1 = _context31.v;
          stateHydratedRef.current = true;
          return _context31.a(2);
        case 4:
          cloud = resp && resp.state && typeof resp.state === 'object' ? resp.state : {};
          cloudUpdatedAt = ((_resp2 = resp) == null ? void 0 : _resp2.updated_at) || 0;
          localUpdatedAt = storage.get(KEYS.stateUpdatedAt, 0) || 0;
          cloudNewer = cloudUpdatedAt > localUpdatedAt;
          merged = mergeSyncState(readSyncState(), cloud, cloudNewer);
          for (_iterator31 = _createForOfIteratorHelperLoose(SYNC_STATE_KEYS); !(_step31 = _iterator31()).done;) {
            k = _step31.value;
            if (merged[k] !== undefined) storage.set(k, merged[k]);
          }
          try {
            th = merged['mcat:theme'];
            if (th && typeof th === 'object') {
              if (th.palette) setPalette(th.palette);
              if (th.mode) setMode(th.mode);
            }
            if (typeof merged['mcat:volume'] === 'number') setVolume(merged['mcat:volume']);
            if (typeof merged['mcat:tropicalBg'] === 'boolean') setTropicalBg(merged['mcat:tropicalBg']);
            if (typeof merged['mcat:bgBlur'] === 'number') setBgBlur(merged['mcat:bgBlur']);
            if (typeof merged['mcat:experimentalUI'] === 'boolean') setExperimentalUI(merged['mcat:experimentalUI']);
            if (typeof merged['mcat:glass'] === 'boolean') setGlass(merged['mcat:glass']);
            if (typeof merged['mcat:autoDownload'] === 'boolean') setAutoDownloadChapters(merged['mcat:autoDownload']);
            if (typeof merged['mcat:autoDownloadAll'] === 'boolean') setAutoDownloadAll(merged['mcat:autoDownloadAll']);
            if (typeof merged['mcat:contributorMode'] === 'boolean') setContributorMode(merged['mcat:contributorMode']);
            if (typeof merged['mcat:reaudit'] === 'boolean') setReauditEnabled(merged['mcat:reaudit']);
          } catch (_unused39) {}
          mergedStr = serializeSyncState(merged);
          lastPushedStateRef.current = mergedStr;
          stateHydratedRef.current = true;
          setStateRev(function (r) {
            return r + 1;
          });
          if (!(mergedStr !== serializeSyncState(cloud))) {
            _context31.n = 8;
            break;
          }
          _context31.p = 5;
          _context31.n = 6;
          return api.putState(merged);
        case 6:
          _context31.n = 8;
          break;
        case 7:
          _context31.p = 7;
          _t10 = _context31.v;
        case 8:
          storage.set(KEYS.stateUpdatedAt, Date.now());
        case 9:
          return _context31.a(2);
      }
    }, _callee29, null, [[5, 7], [1, 3]]);
  })), [api, setPalette, setMode, setVolume, setTropicalBg, setBgBlur, setExperimentalUI, setGlass, setAutoDownloadChapters, setAutoDownloadAll, setContributorMode, setReauditEnabled]);
  useEffect(function () {
    if (!(session != null && session.token)) {
      stateHydratedRef.current = false;
      lastPushedStateRef.current = null;
      return;
    }
    _asyncToGenerator(_regenerator().m(function _callee30() {
      var _t11;
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.p = _context32.n) {
          case 0:
            _context32.p = 0;
            _context32.n = 1;
            return pullState();
          case 1:
            _context32.n = 3;
            break;
          case 2:
            _context32.p = 2;
            _t11 = _context32.v;
          case 3:
            return _context32.a(2);
        }
      }, _callee30, null, [[0, 2]]);
    }))();
  }, [session == null ? void 0 : session.token, pullState]);
  useEffect(function () {
    scheduleStatePush();
  }, [palette, mode, volume, tropicalBg, bgBlur, experimentalUI, glass, autoDownloadChapters, autoDownloadAll, contributorMode, reauditEnabled, scheduleStatePush]);
  useEffect(function () {
    var onDirty = function onDirty() {
      return scheduleStatePush();
    };
    window.addEventListener('mcat:stateDirty', onDirty);
    return function () {
      return window.removeEventListener('mcat:stateDirty', onDirty);
    };
  }, [scheduleStatePush]);
  useEffect(function () {
    var onHide = function onHide() {
      if (document.visibilityState === 'hidden') pushState();
    };
    window.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', pushState);
    return function () {
      window.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', pushState);
    };
  }, [pushState]);
  useEffect(function () {
    if (!autoDownloadChapters) return;
    var localChapters = files.filter(function (f) {
      return f.chapter_id;
    });
    if (!localChapters.length) return;
    var cancelled = false;
    _asyncToGenerator(_regenerator().m(function _callee31() {
      var data, _loop3, _ret, _iterator32, _step32, _t13;
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.p = _context34.n) {
          case 0:
            _context34.p = 0;
            _context34.n = 1;
            return api.listChapters();
          case 1:
            data = _context34.v;
            if (!cancelled) {
              _context34.n = 2;
              break;
            }
            return _context34.a(2);
          case 2:
            _loop3 = _regenerator().m(function _loop3() {
              var ch, localFile, localTs, full, localFileId, fileRecord, _t12;
              return _regenerator().w(function (_context33) {
                while (1) switch (_context33.p = _context33.n) {
                  case 0:
                    ch = _step32.value;
                    if (!cancelled) {
                      _context33.n = 1;
                      break;
                    }
                    return _context33.a(2, {
                      v: void 0
                    });
                  case 1:
                    localFile = localChapters.find(function (f) {
                      return f.chapter_id === ch.id;
                    });
                    if (localFile) {
                      _context33.n = 2;
                      break;
                    }
                    return _context33.a(2, 0);
                  case 2:
                    localTs = localFile.chapter_updated_at || 0;
                    if (!(ch.updated_at <= localTs)) {
                      _context33.n = 3;
                      break;
                    }
                    return _context33.a(2, 0);
                  case 3:
                    _context33.p = 3;
                    _context33.n = 4;
                    return api.getChapter(ch.id);
                  case 4:
                    full = _context33.v;
                    if (!cancelled) {
                      _context33.n = 5;
                      break;
                    }
                    return _context33.a(2, {
                      v: void 0
                    });
                  case 5:
                    localFileId = "chap_" + full.id;
                    fileRecord = {
                      file_id: localFileId,
                      file_uri: 'cloud',
                      mime_type: 'application/pdf',
                      filename: full.filename,
                      size_bytes: full.size_bytes || 0,
                      subject: full.subject,
                      chapter: full.title,
                      uploaded_at: new Date(full.created_at).toISOString(),
                      chapter_id: full.id,
                      chapter_updated_at: full.updated_at
                    };
                    setFiles(function (prev) {
                      return [].concat(prev.filter(function (f) {
                        return f.file_id !== localFileId && f.chapter_id !== full.id;
                      }), [fileRecord]);
                    });
                    if (full.extraction) setExtraction(localFileId, full.extraction);
                    setQuestionsFor(localFileId, {
                      mc: full.mc || [],
                      twoPart: full.two_part || [],
                      short: full.short || [],
                      generated_at: new Date(full.updated_at).toISOString()
                    });
                    _context33.n = 7;
                    break;
                  case 6:
                    _context33.p = 6;
                    _t12 = _context33.v;
                  case 7:
                    return _context33.a(2);
                }
              }, _loop3, null, [[3, 6]]);
            });
            _iterator32 = _createForOfIteratorHelperLoose(data.chapters || []);
          case 3:
            if ((_step32 = _iterator32()).done) {
              _context34.n = 7;
              break;
            }
            return _context34.d(_regeneratorValues(_loop3()), 4);
          case 4:
            _ret = _context34.v;
            if (!(_ret === 0)) {
              _context34.n = 5;
              break;
            }
            return _context34.a(3, 6);
          case 5:
            if (!_ret) {
              _context34.n = 6;
              break;
            }
            return _context34.a(2, _ret.v);
          case 6:
            _context34.n = 3;
            break;
          case 7:
            _context34.n = 9;
            break;
          case 8:
            _context34.p = 8;
            _t13 = _context34.v;
          case 9:
            return _context34.a(2);
        }
      }, _callee31, null, [[0, 8]]);
    }))();
    return function () {
      cancelled = true;
    };
  }, [autoDownloadChapters]);
  useEffect(function () {
    if (!autoDownloadAll) return;
    var cancelled = false;
    _asyncToGenerator(_regenerator().m(function _callee32() {
      var data, localIds, _loop4, _ret2, _iterator33, _step33, _t15;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.p = _context36.n) {
          case 0:
            _context36.p = 0;
            _context36.n = 1;
            return api.listChapters();
          case 1:
            data = _context36.v;
            if (!cancelled) {
              _context36.n = 2;
              break;
            }
            return _context36.a(2);
          case 2:
            localIds = new Set(files.filter(function (f) {
              return f.chapter_id;
            }).map(function (f) {
              return f.chapter_id;
            }));
            _loop4 = _regenerator().m(function _loop4() {
              var _ch$stages;
              var ch, full, localFileId, fileRecord, _t14;
              return _regenerator().w(function (_context35) {
                while (1) switch (_context35.p = _context35.n) {
                  case 0:
                    ch = _step33.value;
                    if (!cancelled) {
                      _context35.n = 1;
                      break;
                    }
                    return _context35.a(2, {
                      v: void 0
                    });
                  case 1:
                    if (!localIds.has(ch.id)) {
                      _context35.n = 2;
                      break;
                    }
                    return _context35.a(2, 0);
                  case 2:
                    if ((_ch$stages = ch.stages) != null && (_ch$stages = _ch$stages.mc) != null && _ch$stages.done) {
                      _context35.n = 3;
                      break;
                    }
                    return _context35.a(2, 0);
                  case 3:
                    _context35.p = 3;
                    _context35.n = 4;
                    return api.getChapter(ch.id);
                  case 4:
                    full = _context35.v;
                    if (!cancelled) {
                      _context35.n = 5;
                      break;
                    }
                    return _context35.a(2, {
                      v: void 0
                    });
                  case 5:
                    localFileId = "chap_" + full.id;
                    fileRecord = {
                      file_id: localFileId,
                      file_uri: 'cloud',
                      mime_type: 'application/pdf',
                      filename: full.filename,
                      size_bytes: full.size_bytes || 0,
                      subject: full.subject,
                      chapter: full.title,
                      uploaded_at: new Date(full.created_at).toISOString(),
                      chapter_id: full.id,
                      chapter_updated_at: full.updated_at
                    };
                    setFiles(function (prev) {
                      return [].concat(prev.filter(function (f) {
                        return f.file_id !== localFileId && f.chapter_id !== full.id;
                      }), [fileRecord]);
                    });
                    if (full.extraction) setExtraction(localFileId, full.extraction);
                    setQuestionsFor(localFileId, {
                      mc: full.mc || [],
                      twoPart: full.two_part || [],
                      short: full.short || [],
                      generated_at: new Date(full.updated_at).toISOString()
                    });
                    _context35.n = 7;
                    break;
                  case 6:
                    _context35.p = 6;
                    _t14 = _context35.v;
                  case 7:
                    return _context35.a(2);
                }
              }, _loop4, null, [[3, 6]]);
            });
            _iterator33 = _createForOfIteratorHelperLoose(data.chapters || []);
          case 3:
            if ((_step33 = _iterator33()).done) {
              _context36.n = 7;
              break;
            }
            return _context36.d(_regeneratorValues(_loop4()), 4);
          case 4:
            _ret2 = _context36.v;
            if (!(_ret2 === 0)) {
              _context36.n = 5;
              break;
            }
            return _context36.a(3, 6);
          case 5:
            if (!_ret2) {
              _context36.n = 6;
              break;
            }
            return _context36.a(2, _ret2.v);
          case 6:
            _context36.n = 3;
            break;
          case 7:
            _context36.n = 9;
            break;
          case 8:
            _context36.p = 8;
            _t15 = _context36.v;
          case 9:
            return _context36.a(2);
        }
      }, _callee32, null, [[0, 8]]);
    }))();
    return function () {
      cancelled = true;
    };
  }, [autoDownloadAll]);
  var value = useMemo(function () {
    return {
      apiKey,
      setApiKey,
      files,
      setFiles,
      extractions,
      setExtraction,
      questions,
      setQuestionsFor,
      attempts,
      addAttempt,
      updateLastAttempt,
      clearAttempts,
      eraseStatsFor,
      pullAttempts,
      staticBank,
      useStaticBank,
      readOnly,
      setReadOnly,
      palette,
      mode,
      setPalette,
      setMode,
      github,
      setGithub,
      pushBank,
      pushStatus,
      session,
      setSession,
      api,
      pendingSync,
      flushSync,
      syncBusy,
      syncError,
      client,
      reauditEnabled,
      setReauditEnabled,
      volume,
      setVolume,
      autoDownloadChapters,
      setAutoDownloadChapters,
      autoDownloadAll,
      setAutoDownloadAll,
      contributorMode,
      setContributorMode,
      tropicalBg,
      setTropicalBg,
      bgBlur,
      setBgBlur,
      experimentalUI,
      setExperimentalUI,
      glass,
      setGlass,
      stateRev
    };
  }, [apiKey, setApiKey, files, setFiles, extractions, setExtraction, questions, setQuestionsFor, attempts, addAttempt, updateLastAttempt, clearAttempts, eraseStatsFor, pullAttempts, staticBank, useStaticBank, readOnly, palette, mode, setPalette, setMode, github, setGithub, pushBank, pushStatus, session, setSession, api, pendingSync, flushSync, syncBusy, syncError, client, reauditEnabled, setReauditEnabled, volume, setVolume, autoDownloadChapters, setAutoDownloadChapters, autoDownloadAll, setAutoDownloadAll, contributorMode, setContributorMode, tropicalBg, setTropicalBg, bgBlur, setBgBlur, experimentalUI, setExperimentalUI, glass, setGlass, stateRev]);
  return React.createElement(AppCtx.Provider, {
    value: value
  }, children);
}
function ApiKeyGate() {
  var _staticBank$files;
  var _useApp = useApp(),
    setApiKey = _useApp.setApiKey,
    client = _useApp.client,
    staticBank = _useApp.staticBank,
    useStaticBank = _useApp.useStaticBank,
    files = _useApp.files,
    extractions = _useApp.extractions,
    questions = _useApp.questions,
    setReadOnly = _useApp.setReadOnly;
  var hasLocalData = files.some(function (f) {
    var _questions$f$file_id, _questions$f$file_id2;
    return extractions[f.file_id] && ((_questions$f$file_id = questions[f.file_id]) == null ? void 0 : _questions$f$file_id.mc) && ((_questions$f$file_id2 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id2.short);
  });
  var localCount = files.filter(function (f) {
    var _questions$f$file_id3, _questions$f$file_id4;
    return extractions[f.file_id] && ((_questions$f$file_id3 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id3.mc) && ((_questions$f$file_id4 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id4.short);
  }).length;
  var _useState22 = useState(''),
    val = _useState22[0],
    setVal = _useState22[1];
  var _useState23 = useState(false),
    show = _useState23[0],
    setShow = _useState23[1];
  var _useState24 = useState(''),
    err = _useState24[0],
    setErr = _useState24[1];
  var _useState25 = useState(false),
    busy = _useState25[0],
    setBusy = _useState25[1];
  var _useState26 = useState(false),
    showAccount = _useState26[0],
    setShowAccount = _useState26[1];
  var save = function () {
    var _ref28 = _asyncToGenerator(_regenerator().m(function _callee33() {
      var trimmed, _t16;
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.p = _context37.n) {
          case 0:
            trimmed = val.trim();
            if (trimmed.startsWith('AIza')) {
              _context37.n = 1;
              break;
            }
            setErr('That does not look like a Google AI API key (should start with AIza).');
            return _context37.a(2);
          case 1:
            setBusy(true);
            setErr('');
            storage.set(KEYS.apiKey, trimmed);
            _context37.p = 2;
            _context37.n = 3;
            return client.ping();
          case 3:
            setApiKey(trimmed);
            _context37.n = 5;
            break;
          case 4:
            _context37.p = 4;
            _t16 = _context37.v;
            storage.remove(KEYS.apiKey);
            setErr("Key rejected: " + _t16.message);
          case 5:
            _context37.p = 5;
            setBusy(false);
            return _context37.f(5);
          case 6:
            return _context37.a(2);
        }
      }, _callee33, null, [[2, 4, 5, 6]]);
    }));
    return function save() {
      return _ref28.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "min-h-full flex items-center justify-center p-6"
  }, React.createElement("div", {
    className: "w-full max-w-md bg-[var(--bg-card-strong)] border border-[var(--border)] rounded-2xl p-6 shadow-xl"
  }, React.createElement("h1", {
    className: "text-2xl font-semibold mb-1"
  }, "MCAT Study"), React.createElement("p", {
    className: "text-[var(--text-muted)] text-sm mb-5"
  }, "Paste your Google AI (Gemini) API key to begin. Stored only in this browser's localStorage."), React.createElement("label", {
    className: "block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1"
  }, "API key"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("input", {
    type: show ? 'text' : 'password',
    value: val,
    onChange: function onChange(e) {
      setVal(e.target.value);
      setErr('');
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === 'Enter' && !busy && save();
    },
    placeholder: "AIza...",
    className: "flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]",
    autoFocus: true
  }), React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setShow(function (s) {
        return !s;
      });
    },
    className: "px-3 text-xs text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)]"
  }, show ? 'Hide' : 'Show')), err && React.createElement("p", {
    className: "text-[var(--danger-text)] text-xs mt-2"
  }, err), React.createElement("button", {
    onClick: save,
    disabled: !val.trim() || busy,
    className: "mt-4 w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2 text-sm font-medium"
  }, busy ? 'Verifying…' : 'Save & continue'), (staticBank || hasLocalData) && React.createElement("div", {
    className: "mt-4"
  }, React.createElement("div", {
    className: "text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-2 text-center"
  }, "or"), hasLocalData && React.createElement("button", {
    onClick: function onClick() {
      return setReadOnly(true);
    },
    className: "w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
  }, "Continue with existing data (", localCount, " chapter", localCount === 1 ? '' : 's', ")"), staticBank && !hasLocalData && React.createElement("button", {
    onClick: useStaticBank,
    className: "w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
  }, "Use shared bank (", ((_staticBank$files = staticBank.files) == null ? void 0 : _staticBank$files.length) || 0, " chapters)"), React.createElement("p", {
    className: "text-[11px] text-[var(--text-faint)] mt-2 text-center"
  }, "Quiz-only mode. Can't add new chapters without a key.")), React.createElement("div", {
    className: "mt-4"
  }, React.createElement("div", {
    className: "text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-2 text-center"
  }, "or"), React.createElement("button", {
    onClick: function onClick() {
      return setShowAccount(function (s) {
        return !s;
      });
    },
    className: "w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
  }, "Sign in / Sign up for cross-device stats"), showAccount && React.createElement("div", {
    className: "mt-3"
  }, React.createElement(AccountPanel, {
    onClose: function onClose() {
      return setShowAccount(false);
    }
  }))), React.createElement("div", {
    className: "mt-5 text-[11px] leading-relaxed text-[var(--text-faint)] space-y-1"
  }, React.createElement("p", null, "Get a free key at", ' ', React.createElement("a", {
    href: "https://aistudio.google.com/apikey",
    target: "_blank",
    rel: "noopener",
    className: "text-[var(--accent-text)] underline"
  }, "aistudio.google.com/apikey"), "."), React.createElement("p", null, React.createElement("span", {
    className: "text-[var(--warning-text-strong)]"
  }, "Heads up:"), " the app calls the Gemini API directly from your browser. Free-tier usage may be used for training; don't upload anything you wouldn't share."))));
}
function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}
function parseChapterFromFilename(name) {
  var stem = name.replace(/\.pdf$/i, '').trim();
  var m = stem.match(/^Chapter\s+(\d+)\s+(.+)$/i);
  if (m) return "Chapter " + m[1] + " \u2014 " + m[2];
  return stem;
}
function UploadPanel() {
  var _useApp2 = useApp(),
    client = _useApp2.client,
    files = _useApp2.files,
    setFiles = _useApp2.setFiles;
  var _useState27 = useState('Behavioral Science'),
    subject = _useState27[0],
    setSubject = _useState27[1];
  var _useState28 = useState([]),
    pending = _useState28[0],
    setPending = _useState28[1];
  var _useState29 = useState(false),
    dragOver = _useState29[0],
    setDragOver = _useState29[1];
  var inputRef = useRef(null);
  var knownSubjects = useMemo(function () {
    var s = new Set(files.map(function (f) {
      return f.subject;
    }));
    ['Behavioral Science', 'Biology', 'Chemistry', 'Physics', 'Biochemistry', 'Psychology', 'Sociology'].forEach(function (x) {
      return s.add(x);
    });
    return Array.from(s);
  }, [files]);
  var onPick = function onPick(fileList) {
    var arr = Array.from(fileList).filter(function (f) {
      return /\.pdf$/i.test(f.name);
    });
    if (!arr.length) return;
    setPending(arr.map(function (f) {
      return {
        file: f,
        name: f.name,
        size: f.size,
        chapter: parseChapterFromFilename(f.name),
        status: 'queued',
        error: null
      };
    }));
  };
  var startUploads = function () {
    var _ref29 = _asyncToGenerator(_regenerator().m(function _callee34() {
      var _loop5, i;
      return _regenerator().w(function (_context39) {
        while (1) switch (_context39.n) {
          case 0:
            _loop5 = _regenerator().m(function _loop5(i) {
              var meta, record, _t17;
              return _regenerator().w(function (_context38) {
                while (1) switch (_context38.p = _context38.n) {
                  case 0:
                    if (!(pending[i].status !== 'queued')) {
                      _context38.n = 1;
                      break;
                    }
                    return _context38.a(2, 1);
                  case 1:
                    setPending(function (p) {
                      return p.map(function (e, idx) {
                        return idx === i ? _extends({}, e, {
                          status: 'uploading'
                        }) : e;
                      });
                    });
                    _context38.p = 2;
                    _context38.n = 3;
                    return client.uploadFile(pending[i].file);
                  case 3:
                    meta = _context38.v;
                    record = {
                      file_id: meta.name,
                      file_uri: meta.uri,
                      mime_type: meta.mimeType || 'application/pdf',
                      filename: pending[i].name,
                      size_bytes: Number(meta.sizeBytes) || pending[i].size,
                      subject,
                      chapter: pending[i].chapter,
                      uploaded_at: new Date().toISOString()
                    };
                    setFiles(function (prev) {
                      return [].concat(prev.filter(function (f) {
                        return f.file_id !== meta.name;
                      }), [record]);
                    });
                    setPending(function (p) {
                      return p.map(function (e, idx) {
                        return idx === i ? _extends({}, e, {
                          status: 'done'
                        }) : e;
                      });
                    });
                    _context38.n = 5;
                    break;
                  case 4:
                    _context38.p = 4;
                    _t17 = _context38.v;
                    setPending(function (p) {
                      return p.map(function (entry, idx) {
                        return idx === i ? _extends({}, entry, {
                          status: 'error',
                          error: _t17.message
                        }) : entry;
                      });
                    });
                  case 5:
                    return _context38.a(2);
                }
              }, _loop5, null, [[2, 4]]);
            });
            i = 0;
          case 1:
            if (!(i < pending.length)) {
              _context39.n = 4;
              break;
            }
            return _context39.d(_regeneratorValues(_loop5(i)), 2);
          case 2:
            if (!_context39.v) {
              _context39.n = 3;
              break;
            }
            return _context39.a(3, 3);
          case 3:
            i++;
            _context39.n = 1;
            break;
          case 4:
            return _context39.a(2);
        }
      }, _callee34);
    }));
    return function startUploads() {
      return _ref29.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("h3", {
    className: "font-semibold"
  }, "Upload chapter PDFs"), React.createElement("div", {
    className: "flex items-center gap-2 text-xs"
  }, React.createElement("label", {
    className: "text-[var(--text-muted)]"
  }, "Subject"), React.createElement("input", {
    list: "subjects",
    value: subject,
    onChange: function onChange(e) {
      return setSubject(e.target.value);
    },
    className: "bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 w-48"
  }), React.createElement("datalist", {
    id: "subjects"
  }, knownSubjects.map(function (s) {
    return React.createElement("option", {
      key: s,
      value: s
    });
  })))), React.createElement("div", {
    onDragOver: function onDragOver(e) {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: function onDragLeave() {
      return setDragOver(false);
    },
    onDrop: function onDrop(e) {
      e.preventDefault();
      setDragOver(false);
      onPick(e.dataTransfer.files);
    },
    onClick: function onClick() {
      var _inputRef$current;
      return (_inputRef$current = inputRef.current) == null ? void 0 : _inputRef$current.click();
    },
    className: "cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors " + (dragOver ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]')
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, "Drag PDFs here, or click to select"), React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-1"
  }, "They'll be assigned to ", React.createElement("span", {
    className: "text-[var(--text)]"
  }, subject), ". Chapter parsed from filename \u2014 editable before upload."), React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: "application/pdf",
    multiple: true,
    className: "hidden",
    onChange: function onChange(e) {
      return onPick(e.target.files);
    }
  })), pending.length > 0 && React.createElement("div", {
    className: "mt-4 space-y-2"
  }, pending.map(function (e, i) {
    return React.createElement("div", {
      key: i,
      className: "flex items-center gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2"
    }, React.createElement("div", {
      className: "flex-1 min-w-0"
    }, React.createElement("div", {
      className: "text-sm truncate"
    }, e.name), React.createElement("input", {
      value: e.chapter,
      onChange: function onChange(ev) {
        return setPending(function (p) {
          return p.map(function (x, idx) {
            return idx === i ? _extends({}, x, {
              chapter: ev.target.value
            }) : x;
          });
        });
      },
      disabled: e.status !== 'queued',
      className: "mt-1 w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 text-xs disabled:opacity-60"
    })), React.createElement("div", {
      className: "text-xs text-[var(--text-muted)] w-20 text-right"
    }, fmtBytes(e.size)), React.createElement("div", {
      className: "text-xs w-32 text-right truncate " + (e.status === 'done' ? 'text-[var(--success-text)]' : e.status === 'error' ? 'text-[var(--danger-text)]' : e.status === 'uploading' ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]')
    }, e.status === 'error' ? e.error || 'error' : e.status));
  }), React.createElement("div", {
    className: "flex gap-2 justify-end pt-1"
  }, React.createElement("button", {
    onClick: function onClick() {
      return setPending([]);
    },
    className: "text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Clear"), React.createElement("button", {
    onClick: startUploads,
    disabled: pending.every(function (e) {
      return e.status !== 'queued';
    }),
    className: "text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, "Upload ", pending.filter(function (e) {
    return e.status === 'queued';
  }).length, " file(s)"))));
}
function ExtractionPreview(_ref30) {
  var _data$summary_sentenc, _data$context_example, _data$key_terms;
  var data = _ref30.data;
  var _useState30 = useState('summary'),
    tab = _useState30[0],
    setTab = _useState30[1];
  if (!data) return null;
  var counts = {
    summary: ((_data$summary_sentenc = data.summary_sentences) == null ? void 0 : _data$summary_sentenc.length) || 0,
    examples: ((_data$context_example = data.context_examples) == null ? void 0 : _data$context_example.length) || 0,
    terms: ((_data$key_terms = data.key_terms) == null ? void 0 : _data$key_terms.length) || 0
  };
  var tabs = [['summary', "Summary (" + counts.summary + ")"], ['examples', "Examples (" + counts.examples + ")"], ['terms', "Terms (" + counts.terms + ")"]];
  return React.createElement("div", {
    className: "mt-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg"
  }, React.createElement("div", {
    className: "flex border-b border-[var(--border-soft)]"
  }, tabs.map(function (_ref31) {
    var k = _ref31[0],
      label = _ref31[1];
    return React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return setTab(k);
      },
      className: "text-xs px-3 py-2 " + (tab === k ? 'text-[var(--accent-text)] border-b border-[var(--accent-border)]' : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]')
    }, label);
  })), React.createElement("div", {
    className: "p-3 max-h-72 overflow-y-auto text-xs space-y-1"
  }, tab === 'summary' && (data.summary_sentences || []).map(function (s, i) {
    return React.createElement("div", {
      key: i,
      className: "text-[var(--text)]"
    }, React.createElement("span", {
      className: "text-[var(--text-fainter)] mr-2"
    }, i + 1, "."), s);
  }), tab === 'examples' && (data.context_examples || []).map(function (e, i) {
    return React.createElement("div", {
      key: i,
      className: "text-[var(--text)]"
    }, React.createElement("span", {
      className: "text-[var(--accent-text)] font-medium"
    }, e.topic, ":"), " ", React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, e.example));
  }), tab === 'terms' && (data.key_terms || []).map(function (t, i) {
    return React.createElement("div", {
      key: i,
      className: "text-[var(--text)]"
    }, React.createElement("span", {
      className: "text-[var(--accent-2-text)] font-medium"
    }, t.term), " \u2014 ", React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, t.definition));
  })));
}
function PublishToBankButton(_ref32) {
  var file = _ref32.file,
    extraction = _ref32.extraction,
    qbank = _ref32.qbank;
  var _useApp3 = useApp(),
    api = _useApp3.api,
    session = _useApp3.session,
    setFiles = _useApp3.setFiles;
  var _useState31 = useState(false),
    busy = _useState31[0],
    setBusy = _useState31[1];
  var _useState32 = useState(null),
    status = _useState32[0],
    setStatus = _useState32[1];
  if (!session) return null;
  if (!extraction) return null;
  var publish = function () {
    var _ref33 = _asyncToGenerator(_regenerator().m(function _callee35() {
      var _qbank$mc, _qbank$twoPart, _qbank$short, chapterId, created, pushes, _i14, _pushes, _pushes$_i, stage, payload, _t18;
      return _regenerator().w(function (_context40) {
        while (1) switch (_context40.p = _context40.n) {
          case 0:
            if (!busy) {
              _context40.n = 1;
              break;
            }
            return _context40.a(2);
          case 1:
            setBusy(true);
            setStatus(null);
            _context40.p = 2;
            chapterId = file.chapter_id;
            if (chapterId) {
              _context40.n = 4;
              break;
            }
            _context40.n = 3;
            return api.createChapter({
              subject: file.subject,
              title: file.chapter,
              filename: file.filename,
              size_bytes: file.size_bytes
            });
          case 3:
            created = _context40.v;
            chapterId = created.id;
            setFiles(function (prev) {
              return prev.map(function (f) {
                return f.file_id === file.file_id ? _extends({}, f, {
                  chapter_id: chapterId
                }) : f;
              });
            });
          case 4:
            pushes = [];
            if (extraction) pushes.push(['extraction', extraction]);
            if (qbank != null && (_qbank$mc = qbank.mc) != null && _qbank$mc.length) pushes.push(['mc', qbank.mc]);
            if (qbank != null && (_qbank$twoPart = qbank.twoPart) != null && _qbank$twoPart.length) pushes.push(['two_part', qbank.twoPart]);
            if (qbank != null && (_qbank$short = qbank.short) != null && _qbank$short.length) pushes.push(['short', qbank.short]);
            _i14 = 0, _pushes = pushes;
          case 5:
            if (!(_i14 < _pushes.length)) {
              _context40.n = 7;
              break;
            }
            _pushes$_i = _pushes[_i14], stage = _pushes$_i[0], payload = _pushes$_i[1];
            _context40.n = 6;
            return api.putChapterStage(chapterId, stage, payload);
          case 6:
            _i14++;
            _context40.n = 5;
            break;
          case 7:
            setStatus({
              kind: 'ok',
              msg: "Published " + pushes.length + " stage" + (pushes.length === 1 ? '' : 's')
            });
            _context40.n = 9;
            break;
          case 8:
            _context40.p = 8;
            _t18 = _context40.v;
            setStatus({
              kind: 'err',
              msg: _t18.message
            });
          case 9:
            _context40.p = 9;
            setBusy(false);
            return _context40.f(9);
          case 10:
            return _context40.a(2);
        }
      }, _callee35, null, [[2, 8, 9, 10]]);
    }));
    return function publish() {
      return _ref33.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "flex items-center gap-2"
  }, status && React.createElement("span", {
    className: "text-[10px] " + (status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]')
  }, status.kind === 'ok' ? '✓' : '!', " ", status.msg), React.createElement("button", {
    onClick: publish,
    disabled: busy,
    title: file.chapter_id ? "Update chapter " + file.chapter_id : 'Publish this chapter to the shared Bank',
    className: "text-xs px-2 py-1 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded font-medium"
  }, busy ? 'Publishing…' : file.chapter_id ? 'Update bank' : 'Publish to bank'));
}
function FileRow(_ref34) {
  var _qbank$mc2, _qbank$short2, _qbank$twoPart2, _extraction$key_terms2;
  var file = _ref34.file,
    extraction = _ref34.extraction,
    qbank = _ref34.qbank,
    busyStage = _ref34.busyStage,
    onProcess = _ref34.onProcess,
    onRemove = _ref34.onRemove,
    readOnly = _ref34.readOnly,
    _ref34$flagCount = _ref34.flagCount,
    flagCount = _ref34$flagCount === void 0 ? 0 : _ref34$flagCount;
  var _useState33 = useState(false),
    open = _useState33[0],
    setOpen = _useState33[1];
  var mcCount = (qbank == null || (_qbank$mc2 = qbank.mc) == null ? void 0 : _qbank$mc2.length) || 0;
  var shortCount = (qbank == null || (_qbank$short2 = qbank.short) == null ? void 0 : _qbank$short2.length) || 0;
  var twoPartCount = (qbank == null || (_qbank$twoPart2 = qbank.twoPart) == null ? void 0 : _qbank$twoPart2.length) || 0;
  var termsCount = (extraction == null || (_extraction$key_terms2 = extraction.key_terms) == null ? void 0 : _extraction$key_terms2.length) || 0;
  var termCovered = qbank != null && qbank.mc ? new Set(qbank.mc.filter(function (q) {
    return q.from === 'term';
  }).map(function (q) {
    return q.term;
  })) : new Set();
  var termsNeeded = ((extraction == null ? void 0 : extraction.key_terms) || []).filter(function (t) {
    return !termCovered.has(t.term);
  }).length;
  var displaySize = useMemo(function () {
    if (file.size_bytes && file.size_bytes > 0) return file.size_bytes;
    try {
      var bytes = 0;
      if (extraction) bytes += JSON.stringify(extraction).length;
      if (qbank) bytes += JSON.stringify(qbank).length;
      return bytes;
    } catch (_unused46) {
      return 0;
    }
  }, [file.size_bytes, extraction, qbank]);
  var fullyProcessed = !!(extraction && mcCount > 0 && shortCount > 0 && twoPartCount > 0 && termsNeeded === 0);
  var badge;
  if (busyStage) {
    badge = {
      label: busyStage,
      cls: 'bg-[var(--accent-soft)] text-[var(--accent-text)] animate-pulse'
    };
  } else if (file.processError) {
    badge = {
      label: 'error',
      cls: 'bg-[var(--danger-bg)] text-[var(--danger-text)]'
    };
  } else if (fullyProcessed) {
    badge = {
      label: 'ready',
      cls: 'bg-[var(--success-bg)] text-[var(--success-text)]'
    };
  } else if (extraction) {
    badge = {
      label: 'partial',
      cls: 'bg-[var(--warning-bg)] text-[var(--warning-text)]'
    };
  } else {
    badge = {
      label: 'pending',
      cls: 'bg-[var(--bg-hover)] text-[var(--text-muted)]'
    };
  }
  return React.createElement("li", {
    className: "py-3 space-y-2"
  }, React.createElement("div", {
    className: "flex flex-wrap items-start gap-2"
  }, React.createElement("div", {
    className: "flex-1 min-w-0"
  }, React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, React.createElement("span", {
    className: "text-sm font-medium text-[var(--text)]"
  }, file.chapter), React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide px-2 py-0.5 rounded shrink-0 " + badge.cls
  }, badge.label), flagCount > 0 && React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide px-2 py-0.5 rounded shrink-0 bg-[var(--warning-bg)] text-[var(--warning-text-strong)] border border-[var(--warning-text-strong)]",
    title: flagCount + " flagged question" + (flagCount === 1 ? '' : 's') + " on this chapter awaiting review"
  }, "\uD83D\uDEA9 ", flagCount, " flagged")), React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-0.5 break-words"
  }, file.filename, " \xB7 ", fmtBytes(displaySize), (qbank == null ? void 0 : qbank.mc) && React.createElement("span", {
    className: "ml-2 text-[var(--text-muted)]"
  }, "\xB7 ", mcCount, " MC \xB7 ", shortCount, " short \xB7 ", twoPartCount, " two-part \xB7 ", termsCount, " terms", termsNeeded > 0 && React.createElement("span", {
    className: "text-[var(--warning-text-strong)]"
  }, " \xB7 ", termsNeeded, " terms need coverage"), twoPartCount === 0 && React.createElement("span", {
    className: "text-[var(--warning-text-strong)]"
  }, " \xB7 two-part missing"), shortCount === 0 && React.createElement("span", {
    className: "text-[var(--warning-text-strong)]"
  }, " \xB7 short missing"))), file.processError && React.createElement("div", {
    className: "text-xs text-[var(--danger-text)] mt-1 break-words",
    title: file.processError
  }, file.processError))), React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, !readOnly && !fullyProcessed && React.createElement("button", {
    onClick: onProcess,
    disabled: !!busyStage,
    className: "text-xs px-2.5 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, extraction ? 'Finish' : 'Process'), React.createElement(FileRowMenu, {
    hasExtraction: !!extraction,
    isOpen: open,
    toggleOpen: function toggleOpen() {
      return setOpen(function (o) {
        return !o;
      });
    },
    publishSlot: !readOnly ? React.createElement(PublishToBankButton, {
      file: file,
      extraction: extraction,
      qbank: qbank
    }) : null,
    onRemove: !readOnly ? onRemove : null
  })), open && extraction && React.createElement(ExtractionPreview, {
    data: extraction
  }));
}
function FileRowMenu(_ref35) {
  var hasExtraction = _ref35.hasExtraction,
    isOpen = _ref35.isOpen,
    toggleOpen = _ref35.toggleOpen,
    publishSlot = _ref35.publishSlot,
    onRemove = _ref35.onRemove;
  var _useState34 = useState(false),
    open = _useState34[0],
    setOpen = _useState34[1];
  var ref = useRef(null);
  useEffect(function () {
    if (!open) return;
    var onDoc = function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return function () {
      return document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);
  return React.createElement("div", {
    className: "relative ml-auto",
    ref: ref
  }, React.createElement("button", {
    onClick: function onClick() {
      return setOpen(function (o) {
        return !o;
      });
    },
    className: "text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)] rounded px-2 py-1.5",
    title: "More",
    "aria-label": "More"
  }, "\u22EF"), open && React.createElement("div", {
    className: "absolute right-0 top-full mt-1 z-10 min-w-[180px] bg-[var(--bg-card-strong)] border border-[var(--border)] rounded-lg shadow-lg py-1"
  }, hasExtraction && React.createElement("button", {
    onClick: function onClick() {
      toggleOpen();
      setOpen(false);
    },
    className: "w-full text-left text-xs px-3 py-2 hover:bg-[var(--bg-hover)]"
  }, isOpen ? 'Hide extraction' : 'View extraction'), publishSlot && React.createElement("div", {
    className: "px-2 py-1",
    onClick: function onClick() {
      return setOpen(false);
    }
  }, publishSlot), onRemove && React.createElement("button", {
    onClick: function onClick() {
      onRemove();
      setOpen(false);
    },
    className: "w-full text-left text-xs px-3 py-2 text-[var(--danger-text)] hover:bg-[var(--danger-bg)]"
  }, "Delete")));
}
function _readPendingFlagCountsByFile() {
  var q = storage.get(KEYS.flagQueue, []) || [];
  var map = {};
  for (var _iterator34 = _createForOfIteratorHelperLoose(q), _step34; !(_step34 = _iterator34()).done;) {
    var f = _step34.value;
    if (!f || f.status === 'done') continue;
    var fid = f.file_id;
    if (!fid) continue;
    map[fid] = (map[fid] || 0) + 1;
  }
  return map;
}
function FileList() {
  var _useApp4 = useApp(),
    files = _useApp4.files,
    setFiles = _useApp4.setFiles,
    client = _useApp4.client,
    extractions = _useApp4.extractions,
    setExtraction = _useApp4.setExtraction,
    questions = _useApp4.questions,
    setQuestionsFor = _useApp4.setQuestionsFor,
    readOnly = _useApp4.readOnly,
    github = _useApp4.github,
    pushBank = _useApp4.pushBank;
  var _useState35 = useState({}),
    busy = _useState35[0],
    setBusy = _useState35[1];
  var _useState36 = useState(_readPendingFlagCountsByFile),
    flagCounts = _useState36[0],
    setFlagCounts = _useState36[1];
  useEffect(function () {
    var sync = function sync() {
      return setFlagCounts(_readPendingFlagCountsByFile());
    };
    window.addEventListener('mcat:flagQueueChange', sync);
    window.addEventListener('storage', sync);
    return function () {
      window.removeEventListener('mcat:flagQueueChange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  var grouped = useMemo(function () {
    var g = {};
    for (var _iterator35 = _createForOfIteratorHelperLoose(files), _step35; !(_step35 = _iterator35()).done;) {
      var f = _step35.value;
      if (!g[f.subject]) g[f.subject] = [];
      g[f.subject].push(f);
    }
    for (var _i15 = 0, _Object$keys = Object.keys(g); _i15 < _Object$keys.length; _i15++) {
      var k = _Object$keys[_i15];
      g[k].sort(function (a, b) {
        var fa = flagCounts[a.file_id] || 0;
        var fb = flagCounts[b.file_id] || 0;
        if (fa !== fb) return fb - fa;
        return a.chapter.localeCompare(b.chapter, undefined, {
          numeric: true
        });
      });
    }
    return g;
  }, [files, flagCounts]);
  var markFile = useCallback(function (fileId, patch) {
    setFiles(function (prev) {
      return prev.map(function (f) {
        return f.file_id === fileId ? _extends({}, f, patch) : f;
      });
    });
  }, [setFiles]);
  var processOne = useCallback(function () {
    var _ref36 = _asyncToGenerator(_regenerator().m(function _callee36(file) {
      var existingQ, ext, mc, haveTermFor, allTerms, missingTerms, termExtraction, termQs, short, twoPart, _t19;
      return _regenerator().w(function (_context41) {
        while (1) switch (_context41.p = _context41.n) {
          case 0:
            if (!busy[file.file_id]) {
              _context41.n = 1;
              break;
            }
            return _context41.a(2);
          case 1:
            markFile(file.file_id, {
              processError: null
            });
            existingQ = questions[file.file_id] || {};
            _context41.p = 2;
            ext = extractions[file.file_id];
            if (ext) {
              _context41.n = 4;
              break;
            }
            setBusy(function (b) {
              return _extends({}, b, {
                [file.file_id]: 'extracting'
              });
            });
            _context41.n = 3;
            return client.extractFromPdf(file.file_uri, file.mime_type, file.subject + " \u2014 " + file.chapter);
          case 3:
            ext = _context41.v;
            setExtraction(file.file_id, ext);
          case 4:
            mc = existingQ.mc;
            if (!(!mc || !mc.length)) {
              _context41.n = 6;
              break;
            }
            setBusy(function (b) {
              return _extends({}, b, {
                [file.file_id]: 'generating MC'
              });
            });
            _context41.n = 5;
            return client.generateMCQuestions(file.file_uri, file.mime_type, ext, file.chapter);
          case 5:
            mc = _context41.v;
            if (!(!mc || !mc.length)) {
              _context41.n = 6;
              break;
            }
            throw new Error('MC generation returned no questions — try again');
          case 6:
            haveTermFor = new Set(mc.filter(function (q) {
              return q.from === 'term';
            }).map(function (q) {
              return q.term;
            }));
            allTerms = (ext.key_terms || []).map(function (t) {
              return t.term;
            });
            missingTerms = allTerms.filter(function (t) {
              return !haveTermFor.has(t);
            });
            if (!(missingTerms.length > 0)) {
              _context41.n = 8;
              break;
            }
            setBusy(function (b) {
              return _extends({}, b, {
                [file.file_id]: "term coverage (" + missingTerms.length + ")"
              });
            });
            termExtraction = _extends({}, ext, {
              key_terms: (ext.key_terms || []).filter(function (t) {
                return missingTerms.includes(t.term);
              })
            });
            _context41.n = 7;
            return client.generateTermQuestions(termExtraction, file.chapter);
          case 7:
            termQs = _context41.v;
            mc = [].concat(mc, termQs);
          case 8:
            short = existingQ.short;
            if (!(!short || !short.length)) {
              _context41.n = 10;
              break;
            }
            setBusy(function (b) {
              return _extends({}, b, {
                [file.file_id]: 'generating short'
              });
            });
            _context41.n = 9;
            return client.generateShortAnswers(file.file_uri, file.mime_type, ext, file.chapter);
          case 9:
            short = _context41.v;
            if (!(!short || !short.length)) {
              _context41.n = 10;
              break;
            }
            throw new Error('Short-answer generation returned no questions — try again');
          case 10:
            twoPart = existingQ.twoPart;
            if (!(!twoPart || !twoPart.length)) {
              _context41.n = 12;
              break;
            }
            setBusy(function (b) {
              return _extends({}, b, {
                [file.file_id]: 'generating two-part'
              });
            });
            _context41.n = 11;
            return client.generateTwoPartQuestions(ext, file.chapter);
          case 11:
            twoPart = _context41.v;
            if (!(!twoPart || !twoPart.length)) {
              _context41.n = 12;
              break;
            }
            throw new Error('Two-part generation returned no questions — try again');
          case 12:
            setQuestionsFor(file.file_id, {
              mc,
              short,
              twoPart,
              generated_at: new Date().toISOString()
            });
            markFile(file.file_id, {
              processError: null
            });
            if (github.autoPush && github.token) {
              setTimeout(function () {
                pushBank();
              }, 250);
            }
            _context41.n = 14;
            break;
          case 13:
            _context41.p = 13;
            _t19 = _context41.v;
            markFile(file.file_id, {
              processError: _t19.message
            });
          case 14:
            _context41.p = 14;
            setBusy(function (b) {
              var n = _extends({}, b);
              delete n[file.file_id];
              return n;
            });
            return _context41.f(14);
          case 15:
            return _context41.a(2);
        }
      }, _callee36, null, [[2, 13, 14, 15]]);
    }));
    return function (_x55) {
      return _ref36.apply(this, arguments);
    };
  }(), [busy, client, extractions, questions, markFile, setExtraction, setQuestionsFor, github, pushBank]);
  var processAll = useCallback(function () {
    var _ref37 = _asyncToGenerator(_regenerator().m(function _callee37(subject) {
      var list, _iterator36, _step36, f;
      return _regenerator().w(function (_context42) {
        while (1) switch (_context42.n) {
          case 0:
            list = grouped[subject].filter(function (f) {
              var q = questions[f.file_id];
              return !(extractions[f.file_id] && q != null && q.mc && q != null && q.short);
            });
            _iterator36 = _createForOfIteratorHelperLoose(list);
          case 1:
            if ((_step36 = _iterator36()).done) {
              _context42.n = 3;
              break;
            }
            f = _step36.value;
            _context42.n = 2;
            return processOne(f);
          case 2:
            _context42.n = 1;
            break;
          case 3:
            return _context42.a(2);
        }
      }, _callee37);
    }));
    return function (_x56) {
      return _ref37.apply(this, arguments);
    };
  }(), [grouped, extractions, questions, processOne]);
  var removeFile = function () {
    var _ref38 = _asyncToGenerator(_regenerator().m(function _callee38(record) {
      var _t20;
      return _regenerator().w(function (_context43) {
        while (1) switch (_context43.p = _context43.n) {
          case 0:
            if (confirm("Remove " + record.filename + "? Also deletes from Gemini's file store.")) {
              _context43.n = 1;
              break;
            }
            return _context43.a(2);
          case 1:
            _context43.p = 1;
            _context43.n = 2;
            return client.deleteFile(record.file_id);
          case 2:
            _context43.n = 4;
            break;
          case 3:
            _context43.p = 3;
            _t20 = _context43.v;
            console.warn('remote delete failed', _t20);
          case 4:
            setFiles(function (prev) {
              return prev.filter(function (f) {
                return f.file_id !== record.file_id;
              });
            });
            setExtraction(record.file_id, undefined);
            setQuestionsFor(record.file_id, undefined);
          case 5:
            return _context43.a(2);
        }
      }, _callee38, null, [[1, 3]]);
    }));
    return function removeFile(_x57) {
      return _ref38.apply(this, arguments);
    };
  }();
  if (!files.length) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
    }, "No uploads yet. Drop a PDF above to get started.");
  }
  return React.createElement("div", {
    className: "space-y-4"
  }, Object.entries(grouped).map(function (_ref39) {
    var subject = _ref39[0],
      items = _ref39[1];
    var unfinished = items.filter(function (f) {
      var q = questions[f.file_id];
      return !(extractions[f.file_id] && q != null && q.mc && q != null && q.short);
    }).length;
    return React.createElement("div", {
      key: subject,
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
    }, React.createElement("div", {
      className: "flex items-baseline justify-between mb-3"
    }, React.createElement("h3", {
      className: "font-semibold"
    }, subject), React.createElement("div", {
      className: "flex items-center gap-3"
    }, React.createElement("span", {
      className: "text-xs text-[var(--text-muted)]"
    }, items.length, " file", items.length === 1 ? '' : 's'), !readOnly && unfinished > 0 && React.createElement("button", {
      onClick: function onClick() {
        return processAll(subject);
      },
      disabled: Object.keys(busy).length > 0,
      className: "text-xs px-3 py-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
    }, "Process ", unfinished, " chapter", unfinished === 1 ? '' : 's'))), React.createElement("ul", {
      className: "divide-y divide-[var(--border-soft)]"
    }, items.map(function (f) {
      return React.createElement(FileRow, {
        key: f.file_id,
        file: f,
        extraction: extractions[f.file_id],
        qbank: questions[f.file_id],
        busyStage: busy[f.file_id],
        onProcess: function onProcess() {
          return processOne(f);
        },
        onRemove: function onRemove() {
          return removeFile(f);
        },
        readOnly: readOnly,
        flagCount: flagCounts[f.file_id] || 0
      });
    })));
  }));
}
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref40 = [a[j], a[i]];
    a[i] = _ref40[0];
    a[j] = _ref40[1];
  }
  return a;
}
function buildPool(_ref41, mode, scope) {
  var files = _ref41.files,
    questions = _ref41.questions,
    extractions = _ref41.extractions,
    attempts = _ref41.attempts;
  var readyFiles = files.filter(function (f) {
    var qb = questions[f.file_id];
    return extractions[f.file_id] && (qb == null ? void 0 : qb.mc) && (qb == null ? void 0 : qb.short);
  });
  var pool = [];
  for (var _iterator37 = _createForOfIteratorHelperLoose(readyFiles), _step37; !(_step37 = _iterator37()).done;) {
    var f = _step37.value;
    var meta = {
      file_id: f.file_id,
      chapter: f.chapter,
      subject: f.subject
    };
    if (mode === 'mc') {
      for (var _iterator39 = _createForOfIteratorHelperLoose(Array.isArray(questions[f.file_id].mc) ? questions[f.file_id].mc : []), _step39; !(_step39 = _iterator39()).done;) {
        var q = _step39.value;
        pool.push(_extends({
          id: q.id,
          mode: 'mc',
          q
        }, meta, {
          subject: q.subject || f.subject
        }));
      }
      for (var _iterator40 = _createForOfIteratorHelperLoose(Array.isArray(questions[f.file_id].twoPart) ? questions[f.file_id].twoPart : []), _step40; !(_step40 = _iterator40()).done;) {
        var _q = _step40.value;
        pool.push(_extends({
          id: _q.id,
          mode: 'two_part',
          q: _q
        }, meta, {
          subject: _q.subject || f.subject
        }));
      }
    } else if (mode === 'short') {
      for (var _iterator41 = _createForOfIteratorHelperLoose(Array.isArray(questions[f.file_id].short) ? questions[f.file_id].short : []), _step41; !(_step41 = _iterator41()).done;) {
        var _q2 = _step41.value;
        pool.push(_extends({
          id: _q2.id,
          mode,
          q: _q2
        }, meta, {
          subject: _q2.subject || f.subject
        }));
      }
    } else if (mode === 'match') {
      var terms = (extractions[f.file_id].key_terms || []).slice();
      var GROUP = 5;
      for (var i = 0; i < terms.length; i += GROUP) {
        var group = terms.slice(i, i + GROUP);
        if (group.length >= 2) {
          pool.push(_extends({
            id: "match_" + f.file_id + "_" + i,
            mode,
            q: {
              id: "match_" + f.file_id + "_" + i,
              terms: group
            }
          }, meta));
        }
      }
    }
  }
  if (scope != null && scope.misses) {
    var wrong = new Set();
    for (var _iterator38 = _createForOfIteratorHelperLoose(attempts), _step38; !(_step38 = _iterator38()).done;) {
      var a = _step38.value;
      if (!a.correct) wrong.add(a.question_id);
    }
    pool = pool.filter(function (x) {
      return wrong.has(x.id);
    });
  } else if ((scope == null ? void 0 : scope.fileIds) instanceof Set) {
    pool = pool.filter(function (x) {
      return scope.fileIds.has(x.file_id);
    });
  }
  if ((scope == null ? void 0 : scope.subjects) instanceof Set && scope.subjects.size && mode !== 'match') {
    pool = pool.filter(function (x) {
      return scope.subjects.has(x.subject);
    });
  }
  return pool;
}
function buildFlashcardPool(_ref42, fileIds) {
  var files = _ref42.files,
    extractions = _ref42.extractions;
  var out = [];
  for (var _iterator42 = _createForOfIteratorHelperLoose(files), _step42; !(_step42 = _iterator42()).done;) {
    var f = _step42.value;
    if (fileIds && fileIds.size > 0 && !fileIds.has(f.file_id)) continue;
    var ext = extractions[f.file_id];
    var terms = (ext == null ? void 0 : ext.key_terms) || [];
    for (var _iterator43 = _createForOfIteratorHelperLoose(terms), _step43; !(_step43 = _iterator43()).done;) {
      var t = _step43.value;
      if (!(t != null && t.term)) continue;
      out.push({
        term: t.term,
        definition: t.definition || '',
        file_id: f.file_id,
        chapter: f.chapter,
        subject: f.subject
      });
    }
  }
  return out;
}
function QuizLauncher(_ref43) {
  var onStart = _ref43.onStart,
    onStartFlashcards = _ref43.onStartFlashcards;
  var ctx = useApp();
  var files = ctx.files,
    questions = ctx.questions,
    extractions = ctx.extractions,
    attempts = ctx.attempts;
  var _useState37 = useState('mc'),
    mode = _useState37[0],
    setMode = _useState37[1];
  var _useState38 = useState(10),
    count = _useState38[0],
    setCount = _useState38[1];
  var _useState39 = useState(false),
    drillMisses = _useState39[0],
    setDrillMisses = _useState39[1];
  var readyChapters = useMemo(function () {
    return files.filter(function (f) {
      var _questions$f$file_id5, _questions$f$file_id6;
      return extractions[f.file_id] && ((_questions$f$file_id5 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id5.mc) && ((_questions$f$file_id6 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id6.short);
    });
  }, [files, extractions, questions]);
  var SEP = '';
  var selKey = function selKey(subject, fileId) {
    return "" + subject + SEP + fileId;
  };
  var fileSubjects = useCallback(function (f) {
    var qb = questions[f.file_id] || {};
    var subs = new Set();
    for (var _i16 = 0, _arr2 = [qb.mc, qb.twoPart, qb.short]; _i16 < _arr2.length; _i16++) {
      var arr = _arr2[_i16];
      if (Array.isArray(arr)) {
        for (var _iterator44 = _createForOfIteratorHelperLoose(arr), _step44; !(_step44 = _iterator44()).done;) {
          var q = _step44.value;
          subs.add(q.subject || f.subject);
        }
      }
    }
    if (!subs.size) subs.add(f.subject);
    return subs;
  }, [questions]);
  var grouped = useMemo(function () {
    var g = {};
    for (var _iterator45 = _createForOfIteratorHelperLoose(readyChapters), _step45; !(_step45 = _iterator45()).done;) {
      var f = _step45.value;
      for (var _iterator46 = _createForOfIteratorHelperLoose(fileSubjects(f)), _step46; !(_step46 = _iterator46()).done;) {
        var subj = _step46.value;
        (g[subj] = g[subj] || []).push(f);
      }
    }
    for (var _i17 = 0, _Object$keys2 = Object.keys(g); _i17 < _Object$keys2.length; _i17++) {
      var key = _Object$keys2[_i17];
      g[key].sort(function (a, b) {
        return a.chapter.localeCompare(b.chapter, undefined, {
          numeric: true
        });
      });
    }
    return g;
  }, [readyChapters, fileSubjects]);
  var allKeys = useMemo(function () {
    var s = new Set();
    for (var _iterator47 = _createForOfIteratorHelperLoose(readyChapters), _step47; !(_step47 = _iterator47()).done;) {
      var f = _step47.value;
      for (var _iterator48 = _createForOfIteratorHelperLoose(fileSubjects(f)), _step48; !(_step48 = _iterator48()).done;) {
        var subj = _step48.value;
        s.add(selKey(subj, f.file_id));
      }
    }
    return s;
  }, [readyChapters, fileSubjects]);
  var _useState40 = useState(function () {
      return new Set();
    }),
    selected = _useState40[0],
    setSelected = _useState40[1];
  var _useState41 = useState({}),
    openSubjects = _useState41[0],
    setOpenSubjects = _useState41[1];
  useEffect(function () {
    setSelected(function (prev) {
      var next = new Set();
      for (var _iterator49 = _createForOfIteratorHelperLoose(prev), _step49; !(_step49 = _iterator49()).done;) {
        var key = _step49.value;
        if (allKeys.has(key)) next.add(key);
      }
      return next.size ? next : new Set(allKeys);
    });
  }, [allKeys]);
  var wrongCount = useMemo(function () {
    var w = new Set();
    for (var _iterator50 = _createForOfIteratorHelperLoose(attempts), _step50; !(_step50 = _iterator50()).done;) {
      var a = _step50.value;
      if (!a.correct) w.add(a.question_id);
    }
    return w.size;
  }, [attempts]);
  var _useMemo = useMemo(function () {
      var fileSet = new Set(),
        subjSet = new Set();
      for (var _iterator51 = _createForOfIteratorHelperLoose(selected), _step51; !(_step51 = _iterator51()).done;) {
        var key = _step51.value;
        var i = key.indexOf(SEP);
        subjSet.add(key.slice(0, i));
        fileSet.add(key.slice(i + 1));
      }
      return {
        selFiles: fileSet,
        selSubjects: subjSet
      };
    }, [selected]),
    selFiles = _useMemo.selFiles,
    selSubjects = _useMemo.selSubjects;
  var scope = drillMisses ? {
    misses: true
  } : {
    fileIds: selFiles,
    subjects: selSubjects
  };
  var pool = useMemo(function () {
    return buildPool(ctx, mode, scope);
  }, [ctx, mode, drillMisses, selected]);
  var masteredKeys = useMemo(function () {
    var g = storage.get(KEYS.lessonGates, {}) || {};
    var out = new Set();
    for (var _iterator52 = _createForOfIteratorHelperLoose(readyChapters), _step52; !(_step52 = _iterator52()).done;) {
      var _g$f$chapter_id;
      var f = _step52.value;
      if (f.chapter_id && (_g$f$chapter_id = g[f.chapter_id]) != null && _g$f$chapter_id.mastered) {
        for (var _iterator53 = _createForOfIteratorHelperLoose(fileSubjects(f)), _step53; !(_step53 = _iterator53()).done;) {
          var subj = _step53.value;
          out.add(selKey(subj, f.file_id));
        }
      }
    }
    return out;
  }, [readyChapters, fileSubjects]);
  if (!readyChapters.length) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
    }, "No chapters processed yet. Upload PDFs in the Library tab and click ", React.createElement("span", {
      className: "text-[var(--text-strong)]"
    }, "Process"), ", or pull a published bank from the Cloud bank panel.");
  }
  var modes = [['mc', 'Multiple choice'], ['short', 'Short answer'], ['match', 'Matching']];
  var subjectKeys = function subjectKeys(subject) {
    return (grouped[subject] || []).map(function (f) {
      return selKey(subject, f.file_id);
    });
  };
  var isSubjectFully = function isSubjectFully(subject) {
    return subjectKeys(subject).every(function (key) {
      return selected.has(key);
    });
  };
  var isSubjectPartial = function isSubjectPartial(subject) {
    return !isSubjectFully(subject) && subjectKeys(subject).some(function (key) {
      return selected.has(key);
    });
  };
  var toggleChapter = function toggleChapter(subject, fileId) {
    setSelected(function (prev) {
      var next = new Set(prev);
      var key = selKey(subject, fileId);
      if (next.has(key)) next.delete(key);else next.add(key);
      return next;
    });
  };
  var toggleSubject = function toggleSubject(subject) {
    setSelected(function (prev) {
      var next = new Set(prev);
      var keys = subjectKeys(subject);
      var allOn = keys.every(function (key) {
        return next.has(key);
      });
      if (allOn) {
        for (var _iterator54 = _createForOfIteratorHelperLoose(keys), _step54; !(_step54 = _iterator54()).done;) {
          var key = _step54.value;
          next.delete(key);
        }
      } else {
        for (var _iterator55 = _createForOfIteratorHelperLoose(keys), _step55; !(_step55 = _iterator55()).done;) {
          var _key = _step55.value;
          next.add(_key);
        }
      }
      return next;
    });
  };
  var selectAll = function selectAll() {
    return setSelected(new Set(allKeys));
  };
  var selectNone = function selectNone() {
    return setSelected(new Set());
  };
  var selectMastered = function selectMastered() {
    return setSelected(new Set(masteredKeys));
  };
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-5"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold mb-3"
  }, "Start a quiz"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, modes.map(function (_ref44) {
    var k = _ref44[0],
      label = _ref44[1];
    return React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return setMode(k);
      },
      className: "text-sm py-2 rounded border " + (mode === k ? 'bg-[var(--accent)] text-white border-[var(--accent-border)] text-white' : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]')
    }, label);
  }))), React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, drillMisses ? 'Drilling missed questions' : 'Scope'), !drillMisses && React.createElement("div", {
    className: "flex gap-2 text-xs"
  }, React.createElement("button", {
    onClick: selectAll,
    className: "text-[var(--accent-text)] hover:underline"
  }, "All"), React.createElement("span", {
    className: "text-[var(--text-fainter)]"
  }, "\xB7"), React.createElement("button", {
    onClick: selectNone,
    className: "text-[var(--text-muted)] hover:underline"
  }, "None"), React.createElement("span", {
    className: "text-[var(--text-fainter)]"
  }, "\xB7"), masteredKeys.size > 0 ? React.createElement("button", {
    onClick: selectMastered,
    className: "text-[var(--accent-text)] hover:underline",
    title: "Select only chapters you've mastered (100% on the final exam)"
  }, "Mastered only") : React.createElement("span", {
    className: "text-[var(--text-fainter)] cursor-not-allowed",
    title: "No mastered chapters yet \u2014 pass a lesson's final exam (100%) to master it"
  }, "Mastered only"))), drillMisses ? React.createElement("div", {
    className: "text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3"
  }, "Pool draws only from your ", wrongCount, " previously-missed question", wrongCount === 1 ? '' : 's', ".") : React.createElement("div", {
    className: "border border-[var(--border-soft)] rounded-lg divide-y divide-[var(--border-soft)] max-h-96 overflow-y-auto"
  }, Object.entries(grouped).map(function (_ref45) {
    var subject = _ref45[0],
      items = _ref45[1];
    var open = !!openSubjects[subject];
    var subjectSelectedCount = items.filter(function (f) {
      return selected.has(selKey(subject, f.file_id));
    }).length;
    return React.createElement("div", {
      key: subject
    }, React.createElement("div", {
      className: "flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-hover-soft)]"
    }, React.createElement("input", {
      type: "checkbox",
      checked: isSubjectFully(subject),
      ref: function ref(el) {
        if (el) el.indeterminate = isSubjectPartial(subject);
      },
      onChange: function onChange() {
        return toggleSubject(subject);
      },
      onClick: function onClick(e) {
        return e.stopPropagation();
      },
      className: "w-4 h-4 accent-[var(--accent)] cursor-pointer"
    }), React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return setOpenSubjects(function (p) {
          return _extends({}, p, {
            [subject]: !p[subject]
          });
        });
      },
      className: "flex-1 flex items-center gap-2 text-left",
      "aria-expanded": open
    }, React.createElement("span", {
      "aria-hidden": "true",
      className: "text-[var(--text-muted)] transition-transform inline-block text-xs",
      style: {
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
      }
    }, "\u25B6"), React.createElement("span", {
      className: "font-medium text-[var(--text-strong)] flex-1"
    }, subject), React.createElement("span", {
      className: "text-xs text-[var(--text-faint)]"
    }, subjectSelectedCount, "/", items.length))), open && React.createElement("div", {
      className: "pl-9 pb-1"
    }, items.map(function (f) {
      return React.createElement("label", {
        key: f.file_id,
        className: "flex items-center gap-3 px-3 py-1.5 cursor-pointer hover:bg-[var(--bg-hover-soft)] rounded"
      }, React.createElement("input", {
        type: "checkbox",
        checked: selected.has(selKey(subject, f.file_id)),
        onChange: function onChange() {
          return toggleChapter(subject, f.file_id);
        },
        className: "w-4 h-4 accent-[var(--accent)]"
      }), React.createElement("span", {
        className: "text-sm text-[var(--text)] flex-1"
      }, f.chapter));
    })));
  })), React.createElement("label", {
    className: "flex items-center gap-2 mt-3 text-sm cursor-pointer"
  }, React.createElement("input", {
    type: "checkbox",
    checked: drillMisses,
    disabled: wrongCount === 0,
    onChange: function onChange(e) {
      return setDrillMisses(e.target.checked);
    },
    className: "w-4 h-4 accent-[var(--accent)]"
  }), React.createElement("span", {
    className: wrongCount === 0 ? 'text-[var(--text-faint)]' : 'text-[var(--text)]'
  }, "Drill my misses (", wrongCount, " question", wrongCount === 1 ? '' : 's', ")"))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Count"), React.createElement("div", {
    className: "flex gap-2 flex-wrap"
  }, [5, 10, 20, 50].map(function (n) {
    return React.createElement("button", {
      key: n,
      onClick: function onClick() {
        return setCount(n);
      },
      className: "text-sm px-3 py-1.5 rounded border " + (count === n ? 'bg-[var(--accent)] text-white border-[var(--accent-border)] text-white' : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]')
    }, n);
  }), React.createElement("span", {
    className: "ml-auto text-xs text-[var(--text-faint)] self-center"
  }, pool.length, " available"))), React.createElement("button", {
    onClick: function onClick() {
      var picked = shuffle(pool).slice(0, Math.min(count, pool.length));
      if (!picked.length) return;
      sfxQuizStart();
      onStart(picked);
    },
    disabled: pool.length === 0,
    className: "w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-3 sm:py-2.5 font-medium"
  }, "Start ", Math.min(count, pool.length), "-question quiz"), function () {
    var flashPool = drillMisses ? [] : buildFlashcardPool(ctx, selFiles);
    return React.createElement("button", {
      onClick: function onClick() {
        if (!flashPool.length) return;
        onStartFlashcards == null || onStartFlashcards(shuffle(flashPool));
      },
      disabled: flashPool.length === 0 || drillMisses,
      title: drillMisses ? 'Turn off Drill misses to review flashcards.' : flashPool.length === 0 ? 'No key terms in the selected chapters.' : '',
      className: "w-full border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded-lg py-2.5 sm:py-2 text-sm font-medium"
    }, "Review ", flashPool.length || 0, " flashcard", flashPool.length === 1 ? '' : 's');
  }());
}
function FlashcardReview(_ref46) {
  var cards = _ref46.cards,
    onExit = _ref46.onExit;
  var _useState42 = useState(0),
    idx = _useState42[0],
    setIdx = _useState42[1];
  var total = cards.length;
  var card = cards[idx];
  var prev = function prev() {
    return setIdx(function (i) {
      return Math.max(0, i - 1);
    });
  };
  var next = function next() {
    return setIdx(function (i) {
      return Math.min(total - 1, i + 1);
    });
  };
  useEffect(function () {
    var onKey = function onKey(e) {
      if (e.key === 'ArrowLeft') prev();else if (e.key === 'ArrowRight' || e.key === ' ') next();else if (e.key === 'Escape') onExit == null || onExit();
    };
    window.addEventListener('keydown', onKey);
    return function () {
      return window.removeEventListener('keydown', onKey);
    };
  });
  if (!card) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
    }, "No flashcards to review. ", React.createElement("button", {
      onClick: onExit,
      className: "text-[var(--accent-text)] hover:underline ml-1"
    }, "Back"));
  }
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, React.createElement("div", {
    className: "min-w-0 text-xs text-[var(--text-muted)]"
  }, React.createElement("span", {
    className: "text-[var(--text-strong)] truncate"
  }, card.subject, " \u2014 ", card.chapter), React.createElement("span", {
    className: "ml-2 shrink-0"
  }, "\xB7 ", idx + 1, "/", total)), React.createElement("button", {
    onClick: onExit,
    className: "shrink-0 text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1"
  }, "Exit")), React.createElement("div", {
    className: "h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden"
  }, React.createElement("div", {
    className: "h-full bg-[var(--accent)] transition-all",
    style: {
      width: (idx + 1) / total * 100 + "%"
    }
  })), React.createElement(Flashcard, {
    key: card.file_id + "-" + card.term + "-" + idx,
    term: card.term,
    definition: card.definition
  }), React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, React.createElement("button", {
    onClick: prev,
    disabled: idx === 0,
    className: "text-sm px-4 py-2 border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded-lg"
  }, "\u2190 Previous"), idx === total - 1 ? React.createElement("button", {
    onClick: onExit,
    className: "text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, "Done") : React.createElement("button", {
    onClick: next,
    className: "text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, "Next \u2192")));
}
var FLAG_PRESETS = [{
  label: 'Remove A./B./C./D. from answers',
  text: 'Remove the A./B./C./D. letter prefixes from the answer choices — the app adds labels itself.'
}, {
  label: 'Extra context after each term',
  text: 'Get rid of extra context / parenthetical definitions appended after each answer choice.'
}, {
  label: 'Wrong answer marked correct',
  text: 'The marked correct answer is wrong — please fix the correct_index.'
}, {
  label: 'Garbled / encoding error',
  text: 'Question text contains garbled characters or encoding errors (e.g. â€" instead of —, subscript numbers rendered as symbols).'
}];
function FlagQuestionModal(_ref47) {
  var item = _ref47.item,
    onClose = _ref47.onClose;
  var _useApp5 = useApp(),
    api = _useApp5.api,
    session = _useApp5.session,
    files = _useApp5.files,
    client = _useApp5.client,
    apiKey = _useApp5.apiKey,
    questions = _useApp5.questions,
    setQuestionsFor = _useApp5.setQuestionsFor;
  var _useState43 = useState(''),
    description = _useState43[0],
    setDescription = _useState43[1];
  var _useState44 = useState(false),
    busy = _useState44[0],
    setBusy = _useState44[1];
  var _useState45 = useState(null),
    status = _useState45[0],
    setStatus = _useState45[1];
  var localFile = files.find(function (f) {
    return f.file_id === item.file_id;
  });
  var chapterId = localFile == null ? void 0 : localFile.chapter_id;
  var applyPreset = function applyPreset(text) {
    setDescription(function (prev) {
      return prev ? prev + '\n' + text : text;
    });
  };
  var submit = function () {
    var _ref48 = _asyncToGenerator(_regenerator().m(function _callee39() {
      var queue, _t21, _t22;
      return _regenerator().w(function (_context44) {
        while (1) switch (_context44.p = _context44.n) {
          case 0:
            if (description.trim()) {
              _context44.n = 1;
              break;
            }
            setStatus({
              kind: 'err',
              msg: 'Describe the problem first.'
            });
            return _context44.a(2);
          case 1:
            setBusy(true);
            setStatus(null);
            _context44.p = 2;
            if (!(session && chapterId)) {
              _context44.n = 6;
              break;
            }
            _context44.p = 3;
            _context44.n = 4;
            return api.addChapterFlag(chapterId, {
              question_id: item.id,
              description: description.trim()
            });
          case 4:
            _context44.n = 6;
            break;
          case 5:
            _context44.p = 5;
            _t21 = _context44.v;
          case 6:
            queue = storage.get(KEYS.flagQueue, []);
            queue.push({
              id: 'flq_' + Date.now().toString(36),
              chapter_id: chapterId || null,
              file_id: item.file_id,
              chapter_label: item.chapter,
              question_id: item.id,
              mode: item.mode || 'mc',
              question_snapshot: item.q,
              description: description.trim(),
              ts: Date.now(),
              status: 'pending'
            });
            storage.set(KEYS.flagQueue, queue);
            try {
              window.dispatchEvent(new Event('mcat:flagQueueChange'));
            } catch (_unused48) {}
            setStatus({
              kind: 'ok',
              msg: 'Flagged. We\'ll fix it on the next pipeline run.'
            });
            setTimeout(onClose, 900);
            _context44.n = 8;
            break;
          case 7:
            _context44.p = 7;
            _t22 = _context44.v;
            setStatus({
              kind: 'err',
              msg: _t22.message
            });
          case 8:
            _context44.p = 8;
            setBusy(false);
            return _context44.f(8);
          case 9:
            return _context44.a(2);
        }
      }, _callee39, null, [[3, 5], [2, 7, 8, 9]]);
    }));
    return function submit() {
      return _ref48.apply(this, arguments);
    };
  }();
  var fixNow = function () {
    var _ref49 = _asyncToGenerator(_regenerator().m(function _callee40() {
      var fix, fileId, qbank, cleanParts, nextTp, nextMc, _t23, _t24, _t25;
      return _regenerator().w(function (_context45) {
        while (1) switch (_context45.p = _context45.n) {
          case 0:
            if (description.trim()) {
              _context45.n = 1;
              break;
            }
            setStatus({
              kind: 'err',
              msg: 'Describe the problem first.'
            });
            return _context45.a(2);
          case 1:
            if (apiKey) {
              _context45.n = 2;
              break;
            }
            setStatus({
              kind: 'err',
              msg: 'Add a Gemini API key in Settings to fix now.'
            });
            return _context45.a(2);
          case 2:
            setBusy(true);
            setStatus({
              kind: 'info',
              msg: 'Sending to Gemini…'
            });
            _context45.p = 3;
            _context45.n = 4;
            return client.fixFlaggedQuestion({
              question: item.q,
              flagDescription: description.trim(),
              chapterContext: item.chapter
            });
          case 4:
            fix = _context45.v;
            fileId = item.file_id;
            qbank = questions[fileId];
            if (!fix.two_part) {
              _context45.n = 9;
              break;
            }
            if (!(qbank != null && qbank.twoPart && fix.action === 'edit' && Array.isArray(fix.parts) && fix.parts.length === 2)) {
              _context45.n = 8;
              break;
            }
            cleanParts = fix.parts.map(function (p) {
              return {
                question: sanitizeText(p.question),
                choices: (p.choices || []).slice(0, 4).map(function (c, i) {
                  return stripChoiceLabel(c, i);
                }),
                correct_index: Number.isInteger(p.correct_index) ? p.correct_index : 0,
                explanation: sanitizeText(p.explanation)
              };
            });
            nextTp = qbank.twoPart.map(function (it) {
              return it.id === item.id ? _extends({}, it, {
                theme: sanitizeText(fix.theme) || it.theme,
                parts: cleanParts
              }) : it;
            });
            setQuestionsFor(fileId, _extends({}, qbank, {
              twoPart: nextTp
            }));
            if (!(chapterId && session)) {
              _context45.n = 8;
              break;
            }
            _context45.p = 5;
            _context45.n = 6;
            return api.putChapterStage(chapterId, 'two_part', nextTp);
          case 6:
            _context45.n = 8;
            break;
          case 7:
            _context45.p = 7;
            _t23 = _context45.v;
          case 8:
            _context45.n = 13;
            break;
          case 9:
            if (!(qbank != null && qbank.mc)) {
              _context45.n = 13;
              break;
            }
            if (!(fix.action === 'edit')) {
              _context45.n = 13;
              break;
            }
            nextMc = qbank.mc.map(function (q) {
              var _fix$choices;
              return q.id === item.id ? _extends({}, q, {
                question: sanitizeText(fix.question) || q.question,
                choices: (((_fix$choices = fix.choices) == null ? void 0 : _fix$choices.length) === 4 ? fix.choices : q.choices).map(function (c, i) {
                  return stripChoiceLabel(c, i);
                }),
                correct_index: Number.isInteger(fix.correct_index) ? fix.correct_index : q.correct_index,
                explanation: sanitizeText(fix.explanation) || q.explanation
              }) : q;
            });
            setQuestionsFor(fileId, _extends({}, qbank, {
              mc: nextMc
            }));
            if (!(chapterId && session)) {
              _context45.n = 13;
              break;
            }
            _context45.p = 10;
            _context45.n = 11;
            return api.putChapterStage(chapterId, 'mc', nextMc);
          case 11:
            _context45.n = 13;
            break;
          case 12:
            _context45.p = 12;
            _t24 = _context45.v;
          case 13:
            setStatus({
              kind: 'ok',
              msg: fix.action === 'skip' ? "Gemini skipped: " + (fix.rationale || 'no real problem found') : 'Fixed and saved!'
            });
            if (fix.action === 'edit') setTimeout(onClose, 1200);
            _context45.n = 15;
            break;
          case 14:
            _context45.p = 14;
            _t25 = _context45.v;
            setStatus({
              kind: 'err',
              msg: _t25.message
            });
          case 15:
            _context45.p = 15;
            setBusy(false);
            return _context45.f(15);
          case 16:
            return _context45.a(2);
        }
      }, _callee40, null, [[10, 12], [5, 7], [3, 14, 15, 16]]);
    }));
    return function fixNow() {
      return _ref49.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3",
    onClick: onClose
  }, React.createElement("div", {
    className: "w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 space-y-3",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Flag question"), React.createElement("p", {
    className: "text-xs text-[var(--text-muted)] line-clamp-2"
  }, item.q.question || item.q.prompt || (item.q.theme ? "Two-part: " + item.q.theme : '(no stem)')), React.createElement("div", null, React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mb-1.5"
  }, "Quick options \u2014 click to fill description:"), React.createElement("div", {
    className: "flex flex-wrap gap-1.5"
  }, FLAG_PRESETS.map(function (p) {
    return React.createElement("button", {
      key: p.label,
      onClick: function onClick() {
        return applyPreset(p.text);
      },
      className: "text-[11px] px-2 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
    }, p.label);
  }))), React.createElement("textarea", {
    value: description,
    onChange: function onChange(e) {
      return setDescription(e.target.value);
    },
    rows: 3,
    placeholder: "What's wrong? (e.g. wrong answer marked correct, two choices are the same, stem is unclear)",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm"
  }), status && React.createElement("div", {
    className: "text-xs rounded px-2 py-1.5 " + (status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' : 'bg-[var(--accent-soft)] text-[var(--accent-text)]')
  }, status.msg), React.createElement("div", {
    className: "flex justify-end gap-2"
  }, React.createElement("button", {
    onClick: onClose,
    className: "text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
  }, "Cancel"), React.createElement("button", {
    onClick: submit,
    disabled: busy,
    className: "text-xs px-3 py-1.5 bg-[var(--warning-text-strong)] text-white rounded hover:opacity-90 disabled:opacity-40"
  }, busy ? 'Working…' : 'Flag only'), apiKey && React.createElement("button", {
    onClick: fixNow,
    disabled: busy,
    className: "text-xs px-3 py-1.5 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)] disabled:opacity-40"
  }, "Fix with Gemini"))));
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function relatedTermsForItem(item, extractions) {
  if (!item || !item.q) return [];
  var ext = extractions == null ? void 0 : extractions[item.file_id];
  var terms = ext == null ? void 0 : ext.key_terms;
  if (!(terms != null && terms.length)) return [];
  var haystack = [item.q.question || ''].concat(item.q.choices || [], [item.q.explanation || '']).join(' ');
  var ranked = terms.slice().sort(function (a, b) {
    var _b$term, _a$term;
    return (((_b$term = b.term) == null ? void 0 : _b$term.length) || 0) - (((_a$term = a.term) == null ? void 0 : _a$term.length) || 0);
  });
  var matches = [];
  var seen = new Set();
  for (var _iterator56 = _createForOfIteratorHelperLoose(ranked), _step56; !(_step56 = _iterator56()).done;) {
    var kt = _step56.value;
    var term = (kt.term || '').trim();
    if (!term || seen.has(term.toLowerCase())) continue;
    var hit = void 0;
    try {
      hit = new RegExp("\\b" + escapeRegex(term) + "\\b", 'i').test(haystack);
    } catch (_unused51) {
      hit = haystack.toLowerCase().includes(term.toLowerCase());
    }
    if (hit) {
      matches.push(kt);
      seen.add(term.toLowerCase());
      if (matches.length >= 6) break;
    }
  }
  return matches;
}
var MOLECULES = [{
  name: 'water',
  variants: ['H2O']
}, {
  name: 'ammonia',
  variants: ['NH3']
}, {
  name: 'hydrogen peroxide',
  variants: ['H2O2']
}, {
  name: 'ozone'
}, {
  name: 'carbon dioxide',
  variants: ['CO2']
}, {
  name: 'carbon monoxide',
  variants: ['CO'],
  acronym: true
}, {
  name: 'nitric oxide',
  variants: ['NO'],
  acronym: true
}, {
  name: 'nitrous oxide',
  variants: ['N2O']
}, {
  name: 'sulfur dioxide',
  variants: ['SO2']
}, {
  name: 'hydrogen sulfide',
  variants: ['H2S']
}, {
  name: 'hydrochloric acid',
  variants: ['HCl']
}, {
  name: 'sulfuric acid',
  variants: ['H2SO4']
}, {
  name: 'nitric acid',
  variants: ['HNO3']
}, {
  name: 'phosphoric acid',
  variants: ['H3PO4']
}, {
  name: 'carbonic acid',
  variants: ['H2CO3']
}, {
  name: 'sodium hydroxide',
  variants: ['NaOH']
}, {
  name: 'potassium hydroxide',
  variants: ['KOH']
}, {
  name: 'sodium chloride',
  variants: ['NaCl']
}, {
  name: 'sodium bicarbonate',
  variants: ['NaHCO3']
}, {
  name: 'calcium carbonate',
  variants: ['CaCO3']
}, {
  name: 'methane'
}, {
  name: 'ethane'
}, {
  name: 'propane'
}, {
  name: 'butane'
}, {
  name: 'pentane'
}, {
  name: 'hexane'
}, {
  name: 'heptane'
}, {
  name: 'octane'
}, {
  name: 'nonane'
}, {
  name: 'decane'
}, {
  name: 'cyclopropane'
}, {
  name: 'cyclobutane'
}, {
  name: 'cyclopentane'
}, {
  name: 'cyclohexane'
}, {
  name: 'ethene',
  variants: ['ethylene']
}, {
  name: 'propene',
  variants: ['propylene']
}, {
  name: '1-butene'
}, {
  name: '2-butene'
}, {
  name: 'ethyne',
  variants: ['acetylene']
}, {
  name: 'propyne'
}, {
  name: 'butadiene'
}, {
  name: '1,3-butadiene'
}, {
  name: 'isoprene'
}, {
  name: 'benzene'
}, {
  name: 'toluene'
}, {
  name: 'xylene'
}, {
  name: 'phenol'
}, {
  name: 'aniline'
}, {
  name: 'styrene'
}, {
  name: 'naphthalene'
}, {
  name: 'anthracene'
}, {
  name: 'biphenyl'
}, {
  name: 'pyridine'
}, {
  name: 'pyrimidine'
}, {
  name: 'pyrrole'
}, {
  name: 'furan'
}, {
  name: 'thiophene'
}, {
  name: 'imidazole'
}, {
  name: 'indole'
}, {
  name: 'purine'
}, {
  name: 'quinoline'
}, {
  name: 'anisole'
}, {
  name: 'benzyl alcohol'
}, {
  name: 'methanol',
  variants: ['methyl alcohol']
}, {
  name: 'ethanol',
  variants: ['ethyl alcohol']
}, {
  name: '1-propanol'
}, {
  name: '2-propanol',
  variants: ['isopropanol', 'isopropyl alcohol']
}, {
  name: '1-butanol'
}, {
  name: '2-butanol'
}, {
  name: 'tert-butanol',
  variants: ['tert-butyl alcohol']
}, {
  name: 'ethylene glycol'
}, {
  name: 'glycerol',
  variants: ['glycerin', 'glycerine']
}, {
  name: 'phenol'
}, {
  name: 'dimethyl ether'
}, {
  name: 'diethyl ether',
  variants: ['ether']
}, {
  name: 'tetrahydrofuran',
  variants: ['THF']
}, {
  name: 'dioxane'
}, {
  name: 'formaldehyde',
  variants: ['methanal']
}, {
  name: 'acetaldehyde',
  variants: ['ethanal']
}, {
  name: 'propanal',
  variants: ['propionaldehyde']
}, {
  name: 'butanal',
  variants: ['butyraldehyde']
}, {
  name: 'benzaldehyde'
}, {
  name: 'acetone',
  variants: ['propanone', '2-propanone']
}, {
  name: 'butanone',
  variants: ['2-butanone', 'methyl ethyl ketone', 'MEK'],
  acronym: false
}, {
  name: 'cyclohexanone'
}, {
  name: 'formic acid',
  variants: ['methanoic acid']
}, {
  name: 'acetic acid',
  variants: ['ethanoic acid', 'vinegar']
}, {
  name: 'propanoic acid',
  variants: ['propionic acid']
}, {
  name: 'butyric acid',
  variants: ['butanoic acid']
}, {
  name: 'valeric acid',
  variants: ['pentanoic acid']
}, {
  name: 'oxalic acid'
}, {
  name: 'malonic acid'
}, {
  name: 'succinic acid'
}, {
  name: 'fumaric acid'
}, {
  name: 'maleic acid'
}, {
  name: 'citric acid'
}, {
  name: 'lactic acid'
}, {
  name: 'pyruvic acid'
}, {
  name: 'benzoic acid'
}, {
  name: 'salicylic acid'
}, {
  name: 'palmitic acid'
}, {
  name: 'stearic acid'
}, {
  name: 'oleic acid'
}, {
  name: 'linoleic acid'
}, {
  name: 'linolenic acid'
}, {
  name: 'arachidonic acid'
}, {
  name: 'tartaric acid'
}, {
  name: 'malic acid'
}, {
  name: 'methyl acetate'
}, {
  name: 'ethyl acetate'
}, {
  name: 'methyl benzoate'
}, {
  name: 'acetamide'
}, {
  name: 'formamide'
}, {
  name: 'urea'
}, {
  name: 'methylamine'
}, {
  name: 'ethylamine'
}, {
  name: 'dimethylamine'
}, {
  name: 'trimethylamine'
}, {
  name: 'aniline'
}, {
  name: 'ethanolamine'
}, {
  name: 'choline'
}, {
  name: 'glucose',
  variants: ['D-glucose', 'dextrose']
}, {
  name: 'fructose',
  variants: ['D-fructose', 'levulose']
}, {
  name: 'galactose',
  variants: ['D-galactose']
}, {
  name: 'mannose'
}, {
  name: 'ribose',
  variants: ['D-ribose']
}, {
  name: 'deoxyribose',
  variants: ['2-deoxyribose']
}, {
  name: 'sucrose'
}, {
  name: 'lactose'
}, {
  name: 'maltose'
}, {
  name: 'glycogen'
}, {
  name: 'starch'
}, {
  name: 'cellulose'
}, {
  name: 'amylose'
}, {
  name: 'amylopectin'
}, {
  name: 'glycine'
}, {
  name: 'alanine'
}, {
  name: 'valine'
}, {
  name: 'leucine'
}, {
  name: 'isoleucine'
}, {
  name: 'proline'
}, {
  name: 'phenylalanine'
}, {
  name: 'tryptophan'
}, {
  name: 'methionine'
}, {
  name: 'serine'
}, {
  name: 'threonine'
}, {
  name: 'cysteine'
}, {
  name: 'tyrosine'
}, {
  name: 'asparagine'
}, {
  name: 'glutamine'
}, {
  name: 'lysine'
}, {
  name: 'arginine'
}, {
  name: 'histidine'
}, {
  name: 'aspartic acid',
  variants: ['aspartate']
}, {
  name: 'glutamic acid',
  variants: ['glutamate']
}, {
  name: 'ATP',
  acronym: true
}, {
  name: 'ADP',
  acronym: true
}, {
  name: 'AMP',
  acronym: true
}, {
  name: 'GTP',
  acronym: true
}, {
  name: 'GDP',
  acronym: true
}, {
  name: 'GMP',
  acronym: true
}, {
  name: 'CTP',
  acronym: true
}, {
  name: 'UTP',
  acronym: true
}, {
  name: 'TTP',
  acronym: true
}, {
  name: 'cAMP',
  acronym: true
}, {
  name: 'cGMP',
  acronym: true
}, {
  name: 'NAD',
  acronym: true
}, {
  name: 'NADH',
  acronym: true
}, {
  name: 'NADP',
  acronym: true
}, {
  name: 'NADPH',
  acronym: true
}, {
  name: 'FAD',
  acronym: true
}, {
  name: 'FADH2',
  acronym: true
}, {
  name: 'CoA',
  variants: ['coenzyme A'],
  acronym: true
}, {
  name: 'acetyl-CoA'
}, {
  name: 'adenine'
}, {
  name: 'guanine'
}, {
  name: 'cytosine'
}, {
  name: 'thymine'
}, {
  name: 'uracil'
}, {
  name: 'hypoxanthine'
}, {
  name: 'xanthine'
}, {
  name: 'pyruvate',
  variants: ['pyruvic acid']
}, {
  name: 'oxaloacetate'
}, {
  name: 'citrate'
}, {
  name: 'isocitrate'
}, {
  name: 'alpha-ketoglutarate',
  variants: ['α-ketoglutarate', '2-oxoglutarate']
}, {
  name: 'succinyl-CoA'
}, {
  name: 'succinate'
}, {
  name: 'fumarate'
}, {
  name: 'malate'
}, {
  name: 'glucose-6-phosphate'
}, {
  name: 'fructose-6-phosphate'
}, {
  name: 'fructose-1,6-bisphosphate'
}, {
  name: 'glyceraldehyde-3-phosphate',
  variants: ['G3P']
}, {
  name: 'dihydroxyacetone phosphate',
  variants: ['DHAP']
}, {
  name: '1,3-bisphosphoglycerate'
}, {
  name: '3-phosphoglycerate'
}, {
  name: '2-phosphoglycerate'
}, {
  name: 'phosphoenolpyruvate',
  variants: ['PEP']
}, {
  name: 'acetoacetate'
}, {
  name: 'beta-hydroxybutyrate',
  variants: ['β-hydroxybutyrate']
}, {
  name: 'cholesterol'
}, {
  name: 'testosterone'
}, {
  name: 'estradiol'
}, {
  name: 'progesterone'
}, {
  name: 'cortisol'
}, {
  name: 'aldosterone'
}, {
  name: 'vitamin D'
}, {
  name: 'cholecalciferol'
}, {
  name: 'calcitriol'
}, {
  name: 'sphingosine'
}, {
  name: 'ceramide'
}, {
  name: 'phosphatidylcholine',
  variants: ['lecithin']
}, {
  name: 'phosphatidylserine'
}, {
  name: 'phosphatidylethanolamine'
}, {
  name: 'triglyceride',
  variants: ['triacylglycerol']
}, {
  name: 'ascorbic acid',
  variants: ['vitamin C']
}, {
  name: 'retinol',
  variants: ['vitamin A']
}, {
  name: 'thiamine',
  variants: ['vitamin B1', 'thiamin']
}, {
  name: 'riboflavin',
  variants: ['vitamin B2']
}, {
  name: 'niacin',
  variants: ['nicotinic acid', 'vitamin B3']
}, {
  name: 'pantothenic acid',
  variants: ['vitamin B5']
}, {
  name: 'pyridoxine',
  variants: ['vitamin B6']
}, {
  name: 'biotin',
  variants: ['vitamin B7']
}, {
  name: 'folic acid',
  variants: ['folate', 'vitamin B9']
}, {
  name: 'cobalamin',
  variants: ['vitamin B12']
}, {
  name: 'tocopherol',
  variants: ['vitamin E']
}, {
  name: 'phylloquinone',
  variants: ['vitamin K']
}, {
  name: 'heme'
}, {
  name: 'porphyrin'
}, {
  name: 'chlorophyll'
}, {
  name: 'dopamine'
}, {
  name: 'serotonin',
  variants: ['5-hydroxytryptamine', '5-HT']
}, {
  name: 'epinephrine',
  variants: ['adrenaline']
}, {
  name: 'norepinephrine',
  variants: ['noradrenaline']
}, {
  name: 'acetylcholine'
}, {
  name: 'GABA',
  acronym: true
}, {
  name: 'glycine'
}, {
  name: 'histamine'
}, {
  name: 'melatonin'
}, {
  name: 'glutamate'
}, {
  name: 'aspirin',
  variants: ['acetylsalicylic acid']
}, {
  name: 'ibuprofen'
}, {
  name: 'acetaminophen',
  variants: ['paracetamol', 'tylenol']
}, {
  name: 'caffeine'
}, {
  name: 'nicotine'
}, {
  name: 'morphine'
}, {
  name: 'penicillin'
}, {
  name: 'tetracycline'
}, {
  name: 'glutathione'
}, {
  name: 'creatine'
}, {
  name: 'creatinine'
}, {
  name: 'lactate'
}, {
  name: 'oxygen',
  variants: ['O2']
}, {
  name: 'nitrogen',
  variants: ['N2']
}, {
  name: 'hydrogen',
  variants: ['H2']
}, {
  name: 'chlorine',
  variants: ['Cl2']
}, {
  name: 'bromine',
  variants: ['Br2']
}, {
  name: 'iodine',
  variants: ['I2']
}, {
  name: 'fluorine',
  variants: ['F2']
}, {
  name: 'alcohol',
  variants: ['alcohols'],
  representative: 'ethanol'
}, {
  name: 'amine',
  variants: ['amines', 'primary amine'],
  representative: 'methylamine'
}, {
  name: 'amide',
  variants: ['amides'],
  representative: 'acetamide'
}, {
  name: 'aldehyde',
  variants: ['aldehydes'],
  representative: 'acetaldehyde'
}, {
  name: 'ketone',
  variants: ['ketones'],
  representative: 'acetone'
}, {
  name: 'carboxylic acid',
  variants: ['carboxylic acids'],
  representative: 'acetic acid'
}, {
  name: 'ester',
  variants: ['esters'],
  representative: 'methyl acetate'
}, {
  name: 'ether',
  variants: ['ethers'],
  representative: 'diethyl ether'
}, {
  name: 'thiol',
  variants: ['thiols'],
  representative: 'ethanethiol'
}, {
  name: 'sulfide',
  variants: ['sulfides', 'thioether'],
  representative: 'dimethyl sulfide'
}, {
  name: 'disulfide',
  variants: ['disulfides'],
  representative: 'dimethyl disulfide'
}, {
  name: 'nitrile',
  variants: ['nitriles'],
  representative: 'acetonitrile'
}, {
  name: 'imine',
  variants: ['imines', 'Schiff base'],
  representative: 'N-methylmethanimine'
}, {
  name: 'epoxide',
  variants: ['epoxides'],
  representative: 'ethylene oxide'
}, {
  name: 'enol',
  variants: ['enols'],
  representative: 'vinyl alcohol'
}, {
  name: 'enolate',
  variants: ['enolates'],
  representative: 'acetone'
}, {
  name: 'acetal',
  variants: ['acetals'],
  representative: '1,1-dimethoxyethane'
}, {
  name: 'hemiacetal',
  variants: ['hemiacetals'],
  representative: '1-methoxyethanol'
}, {
  name: 'carbonyl',
  variants: ['carbonyl group', 'carbonyls'],
  representative: 'acetone'
}, {
  name: 'hydroxyl',
  variants: ['hydroxyl group', 'hydroxy group'],
  representative: 'ethanol'
}, {
  name: 'methyl',
  variants: ['methyl group'],
  representative: 'methane'
}, {
  name: 'methylene',
  variants: ['methylene group'],
  representative: 'propane'
}, {
  name: 'ethyl',
  variants: ['ethyl group'],
  representative: 'ethane'
}, {
  name: 'isopropyl',
  variants: ['isopropyl group'],
  representative: '2-bromopropane'
}, {
  name: 'tert-butyl',
  variants: ['tert-butyl group', 't-butyl'],
  representative: 'tert-butyl alcohol'
}, {
  name: 'phenyl',
  variants: ['phenyl group'],
  representative: 'benzene'
}, {
  name: 'benzyl',
  variants: ['benzyl group'],
  representative: 'toluene'
}, {
  name: 'vinyl',
  variants: ['vinyl group'],
  representative: 'ethene'
}, {
  name: 'allyl',
  variants: ['allyl group'],
  representative: 'propene'
}, {
  name: 'phosphate',
  variants: ['phosphates', 'phosphate group'],
  representative: 'phosphoric acid'
}, {
  name: 'sulfate',
  variants: ['sulfates', 'sulfate group'],
  representative: 'sulfuric acid'
}, {
  name: 'sulfonate',
  variants: ['sulfonates', 'sulfonate group'],
  representative: 'methanesulfonic acid'
}, {
  name: 'sulfonyl',
  variants: ['sulfonyl group'],
  representative: 'methanesulfonic acid'
}, {
  name: 'nitro',
  variants: ['nitro group'],
  representative: 'nitromethane'
}, {
  name: 'nitroso',
  variants: ['nitroso group'],
  representative: 'nitrosobenzene'
}, {
  name: 'azide',
  variants: ['azides', 'azido group'],
  representative: 'methyl azide'
}, {
  name: 'cyano',
  variants: ['cyano group'],
  representative: 'acetonitrile'
}, {
  name: 'isocyanide',
  variants: ['isonitrile'],
  representative: 'methyl isocyanide'
}, {
  name: 'isocyanate',
  variants: ['isocyanates'],
  representative: 'methyl isocyanate'
}, {
  name: 'cyanate',
  variants: ['cyanate ion'],
  representative: 'methyl cyanate'
}, {
  name: 'thiocyanate',
  variants: ['thiocyanates'],
  representative: 'methyl thiocyanate'
}, {
  name: 'anhydride',
  variants: ['anhydrides', 'acid anhydride'],
  representative: 'acetic anhydride'
}, {
  name: 'acyl chloride',
  variants: ['acid chloride', 'acid chlorides'],
  representative: 'acetyl chloride'
}, {
  name: 'alkyl halide',
  variants: ['alkyl halides', 'haloalkane', 'haloalkanes'],
  representative: 'bromomethane'
}, {
  name: 'aryl halide',
  variants: ['aryl halides'],
  representative: 'chlorobenzene'
}, {
  name: 'amino group',
  representative: 'methylamine'
}, {
  name: 'carboxyl group',
  variants: ['COOH group'],
  representative: 'acetic acid'
}, {
  name: 'phosphodiester',
  variants: ['phosphodiester bond'],
  representative: 'dimethyl phosphate'
}, {
  name: 'peptide bond',
  variants: ['amide bond'],
  representative: 'N-methylacetamide'
}, {
  name: 'peroxide',
  variants: ['peroxides'],
  representative: 'hydrogen peroxide'
}];
var _ref50 = function () {
    var lookup = new Map();
    var acronymExact = new Set();
    var representatives = new Map();
    var allSurface = [];
    for (var _i18 = 0, _MOLECULES = MOLECULES; _i18 < _MOLECULES.length; _i18++) {
      var m = _MOLECULES[_i18];
      if (m.representative) representatives.set(m.name, m.representative);
      var allNames = [m.name].concat(m.variants || []);
      for (var _iterator57 = _createForOfIteratorHelperLoose(allNames), _step57; !(_step57 = _iterator57()).done;) {
        var surface = _step57.value;
        allSurface.push(surface);
        if (m.acronym) {
          acronymExact.add(surface);
          lookup.set(surface, m.name);
        } else {
          lookup.set(surface.toLowerCase(), m.name);
        }
      }
    }
    allSurface.sort(function (a, b) {
      return b.length - a.length;
    });
    var pattern = '\\b(?:' + allSurface.map(escapeRegex).join('|') + ')\\b';
    return {
      _molRegex: new RegExp(pattern, 'gi'),
      _molLookup: lookup,
      _molAcronymExact: acronymExact,
      _molRepresentative: representatives
    };
  }(),
  _molRegex = _ref50._molRegex,
  _molLookup = _ref50._molLookup,
  _molAcronymExact = _ref50._molAcronymExact,
  _molRepresentative = _ref50._molRepresentative;
var _IUPAC_STEM_RE = /(?:meth|eth|prop|but|pent|hex|hept|oct|non|dec|undec|dodec|cyclopropan|cyclobutan|cyclopentan|cyclohexan|cycloheptan|cyclopropen|cyclobuten|cyclopenten|cyclohexen|benz|phen|tolu|napht|pyrid|pyrimid|pyrrol|furan|thiophen|imidazol|indol|purin|pyran|oxiran)/i;
var _IUPAC_SUFFIX_RE = /(?:an[eo]?l?|ane|enol|enal|enone|enamine|enamide|enimine|enyl|en|yne|ol|al|one|amine|amide|amido|nitrile|imine|oate|oxide|oxazole|azide|adienol|adienal|adienone|adienoate|adiene|atriene|diol|triol|dione|trione|dial|dioic acid|oic acid|carboxylic acid|carbohydrate)$/i;
function _looksIUPAC(token) {
  if (!token) return false;
  var trimmed = token.trim();
  if (trimmed.length < 5) return false;
  if (!/^[a-z0-9,()\- ]+$/i.test(trimmed)) return false;
  if (!/[a-z]/i.test(trimmed)) return false;
  if (!/\d/.test(trimmed)) return false;
  if (!/-/.test(trimmed)) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;
  if (/^v?\d+(\.\d+){1,3}-/.test(trimmed)) return false;
  if (!_IUPAC_STEM_RE.test(trimmed)) return false;
  if (!_IUPAC_SUFFIX_RE.test(trimmed)) return false;
  return true;
}
function _findIUPACMatches(text) {
  var matches = [];
  var isCh = function isCh(c) {
    return /[a-z0-9,\-]/i.test(c);
  };
  var i = 0;
  while (i < text.length) {
    if (!isCh(text[i])) {
      i++;
      continue;
    }
    var j = i;
    while (j < text.length && isCh(text[j])) j++;
    var start = i;
    var end = j;
    while (start < end && /[,\-]/.test(text[start])) start++;
    while (end > start && /[,\-]/.test(text[end - 1])) end--;
    if (end > start) {
      var value = text.slice(start, end);
      var fullEnd = end;
      var tail = text.slice(end).match(/^\s+acid\b/i);
      if (tail) {
        value = text.slice(start, end + tail[0].length);
        fullEnd = end + tail[0].length;
      }
      if (_looksIUPAC(value)) {
        matches.push({
          start,
          end: fullEnd,
          value
        });
      }
    }
    i = j;
  }
  return matches;
}
function parseMoleculesInText(text) {
  if (typeof text !== 'string' || !text) return [{
    type: 'text',
    value: text || ''
  }];
  var explicit = [];
  _molRegex.lastIndex = 0;
  var mm;
  while ((mm = _molRegex.exec(text)) !== null) {
    var surface = mm[0];
    var idx = mm.index;
    var canonical = null;
    if (_molLookup.has(surface)) {
      canonical = _molLookup.get(surface);
    } else if (_molAcronymExact.has(surface)) {
      canonical = _molLookup.get(surface);
    } else {
      var lc = surface.toLowerCase();
      if (_molLookup.has(lc)) {
        var cand = _molLookup.get(lc);
        if (_molAcronymExact.has(cand) && cand !== surface) {
          canonical = null;
        } else {
          canonical = cand;
        }
      }
    }
    if (!canonical) continue;
    explicit.push({
      start: idx,
      end: idx + surface.length,
      value: surface,
      canonical
    });
  }
  var iupac = _findIUPACMatches(text).map(function (m) {
    return _extends({}, m, {
      canonical: m.value.toLowerCase()
    });
  }).filter(function (m) {
    return !explicit.some(function (e) {
      return m.start < e.end && e.start < m.end;
    });
  });
  var all = explicit.concat(iupac).sort(function (a, b) {
    return a.start - b.start;
  });
  var out = [];
  var last = 0;
  for (var _iterator58 = _createForOfIteratorHelperLoose(all), _step58; !(_step58 = _iterator58()).done;) {
    var m = _step58.value;
    if (m.start < last) continue;
    if (m.start > last) out.push({
      type: 'text',
      value: text.slice(last, m.start)
    });
    out.push({
      type: 'mol',
      value: m.value,
      canonical: m.canonical
    });
    last = m.end;
  }
  if (last < text.length) out.push({
    type: 'text',
    value: text.slice(last)
  });
  if (!out.length) out.push({
    type: 'text',
    value: text
  });
  return out;
}
var MoleculeViewerCtx = createContext({
  open: function open() {},
  close: function close() {}
});
function useMoleculeViewer() {
  return useContext(MoleculeViewerCtx);
}
function MoleculeProvider(_ref16) {
  var children = _ref16.children;
  var _useState46 = useState(null),
    target = _useState46[0],
    setTarget = _useState46[1];
  var ctx = useMemo(function () {
    return {
      open: function open(name) {
        return setTarget(name || null);
      },
      close: function close() {
        return setTarget(null);
      }
    };
  }, []);
  return React.createElement(MoleculeViewerCtx.Provider, {
    value: ctx
  }, children, target && React.createElement(MoleculeModal, {
    name: target,
    onClose: function onClose() {
      return setTarget(null);
    }
  }));
}
function MoleculeModal(_ref17) {
  var name = _ref17.name,
    onClose = _ref17.onClose;
  var _useState47 = useState(false),
    errored = _useState47[0],
    setErrored = _useState47[1];
  useEffect(function () {
    var prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = prev;
    };
  }, []);
  var pubchemName = _molRepresentative.get(name) || name;
  var isRepresentative = pubchemName !== name;
  var enc = encodeURIComponent(pubchemName);
  var imgUrl = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + enc + "/PNG?image_size=large";
  var pubchemPage = "https://pubchem.ncbi.nlm.nih.gov/#query=" + encodeURIComponent(name);
  return React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3",
    onClick: onClose
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 max-w-md w-full max-h-[85vh] overflow-y-auto",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mb-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
  }, isRepresentative ? 'Functional group' : 'Molecule'), React.createElement("div", {
    className: "text-base sm:text-lg font-semibold text-[var(--text-strong)] truncate",
    title: name
  }, name), isRepresentative && React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "Representative compound shown: ", React.createElement("span", {
    className: "text-[var(--text-muted)]"
  }, pubchemName))), React.createElement("button", {
    onClick: onClose,
    className: "shrink-0 text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]",
    "aria-label": "Close"
  }, "\xD7")), !errored ? React.createElement("div", {
    className: "bg-white rounded-lg p-3 flex items-center justify-center"
  }, React.createElement("img", {
    src: imgUrl,
    alt: "Structure of " + pubchemName,
    onError: function onError() {
      return setErrored(true);
    },
    className: "max-w-full h-auto",
    style: {
      maxHeight: '60vh'
    }
  })) : React.createElement("div", {
    className: "text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-4 text-center"
  }, "Couldn't load a structure image for \"", pubchemName, "\" from PubChem."), React.createElement("div", {
    className: "mt-3 flex items-center justify-between gap-3"
  }, React.createElement("a", {
    href: pubchemPage,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-xs text-[var(--accent-text)] hover:underline"
  }, "Open on PubChem \u2197"), React.createElement("button", {
    onClick: onClose,
    className: "text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Close"))));
}
function MoleculeText(_ref18) {
  var text = _ref18.text,
    className = _ref18.className;
  var _useMoleculeViewer = useMoleculeViewer(),
    open = _useMoleculeViewer.open;
  if (typeof text !== 'string' || !text) return text || null;
  var parts = parseMoleculesInText(text);
  if (parts.length === 1 && parts[0].type === 'text') {
    return className ? React.createElement("span", {
      className: className
    }, text) : React.createElement(React.Fragment, null, text);
  }
  return React.createElement("span", {
    className: className
  }, parts.map(function (p, i) {
    if (p.type === 'text') return React.createElement(React.Fragment, {
      key: i
    }, p.value);
    return React.createElement("span", {
      key: i,
      role: "button",
      tabIndex: 0,
      onPointerDown: function onPointerDown(e) {
        e.stopPropagation();
        e.preventDefault();
        open(p.canonical);
      },
      onClick: function onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        open(p.canonical);
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          e.preventDefault();
          open(p.canonical);
        }
      },
      className: "text-[var(--accent-text)] underline decoration-dotted decoration-[var(--accent-border)] underline-offset-2 cursor-pointer hover:bg-[var(--accent-soft)] rounded px-0.5",
      style: {
        pointerEvents: 'auto'
      },
      title: "View 2D structure of " + p.canonical
    }, p.value);
  }));
}
function looksLikeMolecule(text) {
  if (typeof text !== 'string' || !text) return null;
  var trimmed = text.trim();
  if (_molLookup.has(trimmed)) return _molLookup.get(trimmed);
  var lc = trimmed.toLowerCase();
  if (_molLookup.has(lc)) {
    var cand = _molLookup.get(lc);
    if (_molAcronymExact.has(cand) && cand !== trimmed) return null;
    return cand;
  }
  return null;
}
var FIGURES = [{
  label: 'heart',
  title: 'Heart'
}, {
  label: 'cardiac cycle',
  title: 'Cardiac cycle'
}, {
  label: 'cardiac muscle',
  title: 'Cardiac muscle',
  variants: ['myocardium']
}, {
  label: 'circulatory system',
  title: 'Circulatory system',
  variants: ['cardiovascular system']
}, {
  label: 'capillary',
  title: 'Capillary'
}, {
  label: 'respiratory system',
  title: 'Respiratory system'
}, {
  label: 'alveolus',
  title: 'Pulmonary alveolus',
  variants: ['alveoli']
}, {
  label: 'lung',
  title: 'Lung',
  variants: ['lungs']
}, {
  label: 'nephron',
  title: 'Nephron'
}, {
  label: 'kidney',
  title: 'Kidney'
}, {
  label: 'digestive system',
  title: 'Human digestive system'
}, {
  label: 'small intestine',
  title: 'Small intestine'
}, {
  label: 'liver',
  title: 'Liver'
}, {
  label: 'neuron',
  title: 'Neuron'
}, {
  label: 'action potential',
  title: 'Action potential'
}, {
  label: 'synapse',
  title: 'Chemical synapse',
  variants: ['chemical synapse']
}, {
  label: 'reflex arc',
  title: 'Reflex arc'
}, {
  label: 'brain',
  title: 'Human brain'
}, {
  label: 'sarcomere',
  title: 'Sarcomere'
}, {
  label: 'skeletal muscle',
  title: 'Skeletal muscle'
}, {
  label: 'eye',
  title: 'Human eye'
}, {
  label: 'ear',
  title: 'Ear'
}, {
  label: 'antibody',
  title: 'Antibody'
}, {
  label: 'lymphatic system',
  title: 'Lymphatic system'
}, {
  label: 'endocrine system',
  title: 'Endocrine system'
}, {
  label: 'cell membrane',
  title: 'Cell membrane',
  variants: ['plasma membrane']
}, {
  label: 'lipid bilayer',
  title: 'Lipid bilayer',
  variants: ['phospholipid bilayer']
}, {
  label: 'mitochondrion',
  title: 'Mitochondrion',
  variants: ['mitochondria']
}, {
  label: 'ribosome',
  title: 'Ribosome'
}, {
  label: 'nucleus',
  title: 'Cell nucleus'
}, {
  label: 'endoplasmic reticulum',
  title: 'Endoplasmic reticulum'
}, {
  label: 'Golgi apparatus',
  title: 'Golgi apparatus'
}, {
  label: 'cell cycle',
  title: 'Cell cycle'
}, {
  label: 'mitosis',
  title: 'Mitosis'
}, {
  label: 'meiosis',
  title: 'Meiosis'
}, {
  label: 'DNA',
  title: 'DNA',
  acronym: true
}, {
  label: 'DNA replication',
  title: 'DNA replication'
}, {
  label: 'transcription',
  title: 'Transcription (biology)'
}, {
  label: 'translation',
  title: 'Translation (biology)'
}, {
  label: 'nucleotide',
  title: 'Nucleotide'
}, {
  label: 'Krebs cycle',
  title: 'Citric acid cycle',
  variants: ['citric acid cycle', 'TCA cycle', 'tricarboxylic acid cycle']
}, {
  label: 'glycolysis',
  title: 'Glycolysis'
}, {
  label: 'gluconeogenesis',
  title: 'Gluconeogenesis'
}, {
  label: 'electron transport chain',
  title: 'Electron transport chain'
}, {
  label: 'oxidative phosphorylation',
  title: 'Oxidative phosphorylation'
}, {
  label: 'ATP synthase',
  title: 'ATP synthase'
}, {
  label: 'amino acid',
  title: 'Amino acid'
}, {
  label: 'alpha helix',
  title: 'Alpha helix'
}, {
  label: 'beta sheet',
  title: 'Beta sheet'
}, {
  label: 'enzyme',
  title: 'Enzyme'
}, {
  label: 'Michaelis-Menten kinetics',
  title: 'Michaelis–Menten kinetics',
  variants: ['Michaelis-Menten']
}, {
  label: 'Lineweaver-Burk plot',
  title: 'Lineweaver–Burk plot',
  variants: ['Lineweaver-Burk']
}];
var _ref19 = function () {
    var lookup = new Map();
    var acronymExact = new Set();
    var allSurface = [];
    for (var _i19 = 0, _FIGURES = FIGURES; _i19 < _FIGURES.length; _i19++) {
      var f = _FIGURES[_i19];
      var allNames = [f.label].concat(f.variants || []);
      for (var _iterator59 = _createForOfIteratorHelperLoose(allNames), _step59; !(_step59 = _iterator59()).done;) {
        var surface = _step59.value;
        allSurface.push(surface);
        var entry = {
          label: f.label,
          title: f.title
        };
        if (f.acronym) {
          acronymExact.add(surface);
          lookup.set(surface, entry);
        } else lookup.set(surface.toLowerCase(), entry);
      }
    }
    allSurface.sort(function (a, b) {
      return b.length - a.length;
    });
    var pattern = '\\b(?:' + allSurface.map(escapeRegex).join('|') + ')\\b';
    return {
      _figRegex: new RegExp(pattern, 'gi'),
      _figLookup: lookup,
      _figAcronymExact: acronymExact
    };
  }(),
  _figRegex = _ref19._figRegex,
  _figLookup = _ref19._figLookup,
  _figAcronymExact = _ref19._figAcronymExact;
function resolveFigure(str) {
  if (typeof str !== 'string' || !str.trim()) return null;
  var t = str.trim();
  if (_figLookup.has(t)) {
    var e = _figLookup.get(t);
    return {
      title: e.title,
      label: t
    };
  }
  var lc = t.toLowerCase();
  if (_figLookup.has(lc)) {
    var _e = _figLookup.get(lc);
    return {
      title: _e.title,
      label: t
    };
  }
  return {
    title: t,
    label: t
  };
}
function parseFiguresInText(text) {
  if (typeof text !== 'string' || !text) return [{
    type: 'text',
    value: text || ''
  }];
  var matches = [];
  _figRegex.lastIndex = 0;
  var mm;
  while ((mm = _figRegex.exec(text)) !== null) {
    var surface = mm[0];
    var idx = mm.index;
    var entry = null;
    if (_figLookup.has(surface)) entry = _figLookup.get(surface);else {
      var lc = surface.toLowerCase();
      if (_figLookup.has(lc)) {
        var cand = _figLookup.get(lc);
        if (!_figAcronymExact.has(cand.label) || cand.label === surface) entry = cand;
      }
    }
    if (entry) matches.push({
      start: idx,
      end: idx + surface.length,
      value: surface,
      entry
    });
  }
  var out = [];
  var last = 0;
  for (var _i20 = 0, _matches = matches; _i20 < _matches.length; _i20++) {
    var m = _matches[_i20];
    if (m.start < last) continue;
    if (m.start > last) out.push({
      type: 'text',
      value: text.slice(last, m.start)
    });
    out.push({
      type: 'fig',
      value: m.value,
      entry: m.entry
    });
    last = m.end;
  }
  if (last < text.length) out.push({
    type: 'text',
    value: text.slice(last)
  });
  if (!out.length) out.push({
    type: 'text',
    value: text
  });
  return out;
}
var FigureViewerCtx = createContext({
  open: function open() {},
  close: function close() {}
});
function useFigureViewer() {
  return useContext(FigureViewerCtx);
}
function FigureProvider(_ref22) {
  var children = _ref22.children;
  var _useState48 = useState(null),
    target = _useState48[0],
    setTarget = _useState48[1];
  var ctx = useMemo(function () {
    return {
      open: function open(title, label) {
        return setTarget(title ? {
          title,
          label: label || title
        } : null);
      },
      close: function close() {
        return setTarget(null);
      }
    };
  }, []);
  return React.createElement(FigureViewerCtx.Provider, {
    value: ctx
  }, children, target && React.createElement(FigureModal, {
    title: target.title,
    label: target.label,
    onClose: function onClose() {
      return setTarget(null);
    }
  }));
}
function FigureModal(_ref23) {
  var title = _ref23.title,
    label = _ref23.label,
    onClose = _ref23.onClose;
  var _useState49 = useState({
      loading: true
    }),
    state = _useState49[0],
    setState = _useState49[1];
  useEffect(function () {
    var prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(function () {
    var alive = true;
    setState({
      loading: true
    });
    var pageUrl = "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, '_'));
    var api = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, '_'));
    fetch(api).then(function (r) {
      return r.ok ? r.json() : Promise.reject(r.status);
    }).then(function (j) {
      if (!alive) return;
      var img = j.originalimage && j.originalimage.source || j.thumbnail && j.thumbnail.source || null;
      setState({
        loading: false,
        img,
        extract: j.extract,
        pageUrl: j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page || pageUrl
      });
    }).catch(function () {
      if (alive) setState({
        loading: false,
        errored: true,
        pageUrl
      });
    });
    return function () {
      alive = false;
    };
  }, [title]);
  return React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3",
    onClick: onClose
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 max-w-lg w-full max-h-[88vh] overflow-y-auto",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mb-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
  }, "Figure"), React.createElement("div", {
    className: "text-base sm:text-lg font-semibold text-[var(--text-strong)] truncate",
    title: label
  }, label), title !== label && React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "Wikipedia: ", title)), React.createElement("button", {
    onClick: onClose,
    className: "shrink-0 text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]",
    "aria-label": "Close"
  }, "\xD7")), state.loading ? React.createElement("div", {
    className: "text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-6 text-center"
  }, "Loading figure\u2026") : state.img ? React.createElement("div", {
    className: "bg-white rounded-lg p-3 flex items-center justify-center"
  }, React.createElement("img", {
    src: state.img,
    alt: label,
    className: "max-w-full h-auto",
    style: {
      maxHeight: '60vh'
    }
  })) : React.createElement("div", {
    className: "text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-4 text-center"
  }, "No figure image found for \"", title, "\"."), state.extract && React.createElement("p", {
    className: "text-xs text-[var(--text-muted)] leading-relaxed mt-3"
  }, state.extract), React.createElement("div", {
    className: "mt-3 flex items-center justify-between gap-3"
  }, React.createElement("span", {
    className: "text-[10px] text-[var(--text-faint)]"
  }, "Image via Wikipedia (CC BY-SA)"), React.createElement("a", {
    href: state.pageUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-xs text-[var(--accent-text)] hover:underline"
  }, "Open on Wikipedia \u2197"))));
}
function FigureText(_ref24) {
  var text = _ref24.text,
    className = _ref24.className;
  var _useFigureViewer = useFigureViewer(),
    open = _useFigureViewer.open;
  if (typeof text !== 'string' || !text) return text || null;
  var parts = parseFiguresInText(text);
  if (parts.length === 1 && parts[0].type === 'text') {
    return className ? React.createElement("span", {
      className: className
    }, text) : React.createElement(React.Fragment, null, text);
  }
  return React.createElement("span", {
    className: className
  }, parts.map(function (p, i) {
    if (p.type === 'text') return React.createElement(React.Fragment, {
      key: i
    }, p.value);
    return React.createElement("span", {
      key: i,
      role: "button",
      tabIndex: 0,
      onPointerDown: function onPointerDown(e) {
        e.stopPropagation();
        e.preventDefault();
        open(p.entry.title, p.entry.label);
      },
      onClick: function onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        open(p.entry.title, p.entry.label);
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation();
          e.preventDefault();
          open(p.entry.title, p.entry.label);
        }
      },
      className: "text-[var(--accent-text)] underline decoration-dotted decoration-[var(--accent-border)] underline-offset-2 cursor-pointer hover:bg-[var(--accent-soft)] rounded px-0.5",
      style: {
        pointerEvents: 'auto'
      },
      title: "View figure: " + p.entry.label
    }, p.value);
  }));
}
function _calcEvaluate(expr) {
  if (!expr || !expr.trim()) return '';
  var s = String(expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/(\d+(?:\.\d+)?)E([+-]?\d+(?:\.\d+)?)/g, '($1*Math.pow(10,$2))').replace(/π/g, '(Math.PI)').replace(/(^|[^A-Za-z])e(?![A-Za-z0-9])/g, '$1(Math.E)').replace(/√\s*\(/g, 'Math.sqrt(').replace(/√\s*(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)').replace(/(\d+(?:\.\d+)?|\))\s*\^\s*(\d+(?:\.\d+)?|\([^)]+\))/g, 'Math.pow($1,$2)').replace(/\blog\(/g, 'Math.log10(').replace(/\bln\(/g, 'Math.log(').replace(/\basin\(/g, 'Math.asin(').replace(/\bacos\(/g, 'Math.acos(').replace(/\batan\(/g, 'Math.atan(').replace(/\bsin\(/g, 'Math.sin(').replace(/\bcos\(/g, 'Math.cos(').replace(/\btan\(/g, 'Math.tan(').replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
  if (!/^[0-9+\-*/().,\s]|Math\.(PI|E|sqrt|pow|log|log10|asin|acos|atan|sin|cos|tan)/.test(s)) return NaN;
  var stripped = s.replace(/Math\.(PI|E|sqrt|pow|log10|log|asin|acos|atan|sin|cos|tan)/g, '');
  if (/[^0-9+\-*/().,\s]/.test(stripped)) return NaN;
  try {
    var v = new Function('return (' + s + ')')();
    if (typeof v !== 'number' || !Number.isFinite(v)) return NaN;
    return v;
  } catch (_unused31) {
    return NaN;
  }
}
function CalculatorModal(_ref25) {
  var expr = _ref25.expr,
    setExpr = _ref25.setExpr,
    onClose = _ref25.onClose,
    onMinimize = _ref25.onMinimize,
    minimized = _ref25.minimized;
  var result = useMemo(function () {
    if (!expr.trim()) return '';
    var v = _calcEvaluate(expr);
    if (Number.isNaN(v)) return '';
    if (Number.isInteger(v)) return String(v);
    var fixed = Number(v.toPrecision(10));
    return String(fixed);
  }, [expr]);
  useEffect(function () {
    if (minimized) return;
    var prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    var onKey = function onKey(e) {
      if (e.key === 'Escape') onMinimize();
    };
    window.addEventListener('keydown', onKey);
    return function () {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onMinimize, minimized]);
  var push = function push(s) {
    return setExpr(function (p) {
      return p + s;
    });
  };
  var back = function back() {
    return setExpr(function (p) {
      return p.slice(0, -1);
    });
  };
  var ac = function ac() {
    return setExpr('');
  };
  var equals = function equals() {
    if (result !== '') setExpr(result);
  };
  if (minimized) {
    return React.createElement("button", {
      onClick: onMinimize,
      title: "Restore calculator",
      className: "fixed bottom-4 right-4 z-[60] flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-soft)] shadow-lg rounded-full pl-3 pr-4 py-2 hover:bg-[var(--bg-hover)]"
    }, React.createElement("span", {
      className: "text-base"
    }, "\uD83E\uDDEE"), React.createElement("span", {
      className: "font-mono text-sm text-[var(--text-strong)] max-w-[10rem] truncate text-right"
    }, result || expr || '0'));
  }
  var sci = [['(', function () {
    return push('(');
  }], [')', function () {
    return push(')');
  }], ['π', function () {
    return push('π');
  }], ['e', function () {
    return push('e');
  }], ['EE', function () {
    return push('E');
  }], ['√', function () {
    return push('√(');
  }], ['x²', function () {
    return push('^2');
  }], ['xʸ', function () {
    return push('^');
  }], ['log', function () {
    return push('log(');
  }], ['ln', function () {
    return push('ln(');
  }], ['sin', function () {
    return push('sin(');
  }], ['cos', function () {
    return push('cos(');
  }], ['tan', function () {
    return push('tan(');
  }], ['%', function () {
    return push('%');
  }], ['sin⁻¹', function () {
    return push('asin(');
  }], ['cos⁻¹', function () {
    return push('acos(');
  }], ['tan⁻¹', function () {
    return push('atan(');
  }]];
  var grid = [['AC', ac, 'op'], ['⌫', back, 'op'], ['÷', function () {
    return push('÷');
  }, 'op'], ['×', function () {
    return push('×');
  }, 'op'], ['7', function () {
    return push('7');
  }], ['8', function () {
    return push('8');
  }], ['9', function () {
    return push('9');
  }], ['−', function () {
    return push('-');
  }, 'op'], ['4', function () {
    return push('4');
  }], ['5', function () {
    return push('5');
  }], ['6', function () {
    return push('6');
  }], ['+', function () {
    return push('+');
  }, 'op'], ['1', function () {
    return push('1');
  }], ['2', function () {
    return push('2');
  }], ['3', function () {
    return push('3');
  }], ['=', equals, 'eq'], ['0', function () {
    return push('0');
  }], ['.', function () {
    return push('.');
  }]];
  return React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4",
    onClick: onMinimize
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 w-full max-w-sm space-y-3",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
  }, "Calculator"), React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("button", {
    onClick: onMinimize,
    className: "text-xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]",
    title: "Minimize (keeps your work)",
    "aria-label": "Minimize"
  }, "\u2014"), React.createElement("button", {
    onClick: onClose,
    className: "text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]",
    "aria-label": "Close"
  }, "\xD7"))), React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-3"
  }, React.createElement("div", {
    className: "text-right text-sm text-[var(--text-faint)] font-mono break-all min-h-[1.25rem]"
  }, expr || ' '), React.createElement("div", {
    className: "text-right text-2xl font-semibold text-[var(--text-strong)] font-mono break-all min-h-[2rem]"
  }, result || (expr ? '…' : '0'))), React.createElement("div", {
    className: "grid grid-cols-5 gap-1.5"
  }, sci.map(function (_ref26) {
    var label = _ref26[0],
      fn = _ref26[1];
    return React.createElement("button", {
      key: label,
      onClick: fn,
      className: "text-xs px-1 py-2 border border-[var(--border)] rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
    }, label);
  })), React.createElement("div", {
    className: "grid grid-cols-4 gap-1.5"
  }, grid.map(function (_ref27, i) {
    var label = _ref27[0],
      fn = _ref27[1],
      kind = _ref27[2];
    var isOp = kind === 'op';
    var isEq = kind === 'eq';
    var wide = label === '0';
    return React.createElement("button", {
      key: i,
      onClick: fn,
      className: "text-base font-medium py-3 rounded transition-colors " + (wide ? 'col-span-2' : '') + " " + (isEq ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]' : isOp ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] hover:bg-[var(--bg-hover)]' : 'bg-[var(--bg-elev)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)]')
    }, label);
  }))));
}
var PERIODIC_TABLE = ('H,Hydrogen,1,1.008,1,1,nm|He,Helium,2,4.003,18,1,ng|' + 'Li,Lithium,3,6.94,1,2,am|Be,Beryllium,4,9.012,2,2,ae|B,Boron,5,10.81,13,2,ml|C,Carbon,6,12.01,14,2,nm|N,Nitrogen,7,14.01,15,2,nm|O,Oxygen,8,16.00,16,2,nm|F,Fluorine,9,19.00,17,2,ha|Ne,Neon,10,20.18,18,2,ng|' + 'Na,Sodium,11,22.99,1,3,am|Mg,Magnesium,12,24.31,2,3,ae|Al,Aluminum,13,26.98,13,3,pt|Si,Silicon,14,28.09,14,3,ml|P,Phosphorus,15,30.97,15,3,nm|S,Sulfur,16,32.06,16,3,nm|Cl,Chlorine,17,35.45,17,3,ha|Ar,Argon,18,39.95,18,3,ng|' + 'K,Potassium,19,39.10,1,4,am|Ca,Calcium,20,40.08,2,4,ae|Sc,Scandium,21,44.96,3,4,tm|Ti,Titanium,22,47.87,4,4,tm|V,Vanadium,23,50.94,5,4,tm|Cr,Chromium,24,52.00,6,4,tm|Mn,Manganese,25,54.94,7,4,tm|Fe,Iron,26,55.85,8,4,tm|Co,Cobalt,27,58.93,9,4,tm|Ni,Nickel,28,58.69,10,4,tm|Cu,Copper,29,63.55,11,4,tm|Zn,Zinc,30,65.38,12,4,tm|Ga,Gallium,31,69.72,13,4,pt|Ge,Germanium,32,72.63,14,4,ml|As,Arsenic,33,74.92,15,4,ml|Se,Selenium,34,78.97,16,4,nm|Br,Bromine,35,79.90,17,4,ha|Kr,Krypton,36,83.80,18,4,ng|' + 'Rb,Rubidium,37,85.47,1,5,am|Sr,Strontium,38,87.62,2,5,ae|Y,Yttrium,39,88.91,3,5,tm|Zr,Zirconium,40,91.22,4,5,tm|Nb,Niobium,41,92.91,5,5,tm|Mo,Molybdenum,42,95.95,6,5,tm|Tc,Technetium,43,98,7,5,tm|Ru,Ruthenium,44,101.1,8,5,tm|Rh,Rhodium,45,102.9,9,5,tm|Pd,Palladium,46,106.4,10,5,tm|Ag,Silver,47,107.9,11,5,tm|Cd,Cadmium,48,112.4,12,5,tm|In,Indium,49,114.8,13,5,pt|Sn,Tin,50,118.7,14,5,pt|Sb,Antimony,51,121.8,15,5,ml|Te,Tellurium,52,127.6,16,5,ml|I,Iodine,53,126.9,17,5,ha|Xe,Xenon,54,131.3,18,5,ng|' + 'Cs,Caesium,55,132.9,1,6,am|Ba,Barium,56,137.3,2,6,ae|La,Lanthanum,57,138.9,3,8,ln|Ce,Cerium,58,140.1,4,8,ln|Pr,Praseodymium,59,140.9,5,8,ln|Nd,Neodymium,60,144.2,6,8,ln|Pm,Promethium,61,145,7,8,ln|Sm,Samarium,62,150.4,8,8,ln|Eu,Europium,63,152.0,9,8,ln|Gd,Gadolinium,64,157.2,10,8,ln|Tb,Terbium,65,158.9,11,8,ln|Dy,Dysprosium,66,162.5,12,8,ln|Ho,Holmium,67,164.9,13,8,ln|Er,Erbium,68,167.3,14,8,ln|Tm,Thulium,69,168.9,15,8,ln|Yb,Ytterbium,70,173.0,16,8,ln|Lu,Lutetium,71,175.0,17,8,ln|Hf,Hafnium,72,178.5,4,6,tm|Ta,Tantalum,73,180.9,5,6,tm|W,Tungsten,74,183.8,6,6,tm|Re,Rhenium,75,186.2,7,6,tm|Os,Osmium,76,190.2,8,6,tm|Ir,Iridium,77,192.2,9,6,tm|Pt,Platinum,78,195.1,10,6,tm|Au,Gold,79,197.0,11,6,tm|Hg,Mercury,80,200.6,12,6,tm|Tl,Thallium,81,204.4,13,6,pt|Pb,Lead,82,207.2,14,6,pt|Bi,Bismuth,83,209.0,15,6,pt|Po,Polonium,84,209,16,6,ml|At,Astatine,85,210,17,6,ha|Rn,Radon,86,222,18,6,ng|' + 'Fr,Francium,87,223,1,7,am|Ra,Radium,88,226,2,7,ae|Ac,Actinium,89,227,3,9,ac|Th,Thorium,90,232.0,4,9,ac|Pa,Protactinium,91,231.0,5,9,ac|U,Uranium,92,238.0,6,9,ac|Np,Neptunium,93,237,7,9,ac|Pu,Plutonium,94,244,8,9,ac|Am,Americium,95,243,9,9,ac|Cm,Curium,96,247,10,9,ac|Bk,Berkelium,97,247,11,9,ac|Cf,Californium,98,251,12,9,ac|Es,Einsteinium,99,252,13,9,ac|Fm,Fermium,100,257,14,9,ac|Md,Mendelevium,101,258,15,9,ac|No,Nobelium,102,259,16,9,ac|Lr,Lawrencium,103,266,17,9,ac|Rf,Rutherfordium,104,267,4,7,tm|Db,Dubnium,105,268,5,7,tm|Sg,Seaborgium,106,269,6,7,tm|Bh,Bohrium,107,270,7,7,tm|Hs,Hassium,108,277,8,7,tm|Mt,Meitnerium,109,278,9,7,tm|Ds,Darmstadtium,110,281,10,7,tm|Rg,Roentgenium,111,282,11,7,tm|Cn,Copernicium,112,285,12,7,tm|Nh,Nihonium,113,286,13,7,pt|Fl,Flerovium,114,289,14,7,pt|Mc,Moscovium,115,290,15,7,pt|Lv,Livermorium,116,293,16,7,pt|Ts,Tennessine,117,294,17,7,ha|Og,Oganesson,118,294,18,7,ng').split('|').map(function (row) {
  var p = row.split(',');
  return {
    sym: p[0],
    name: p[1],
    num: +p[2],
    mass: +p[3],
    col: +p[4],
    row: +p[5],
    cat: p[6]
  };
});
var PERIODIC_CATEGORIES = {
  am: {
    label: 'Alkali metal',
    bg: '#f4c64a',
    fg: '#3a2a05'
  },
  ae: {
    label: 'Alkaline earth',
    bg: '#f6dd6e',
    fg: '#3a2e05'
  },
  tm: {
    label: 'Transition metal',
    bg: '#f0a888',
    fg: '#3a1a05'
  },
  pt: {
    label: 'Post-transition',
    bg: '#b8c5d4',
    fg: '#1a232c'
  },
  ml: {
    label: 'Metalloid',
    bg: '#b4dca2',
    fg: '#0e2a08'
  },
  nm: {
    label: 'Nonmetal',
    bg: '#7dd0c4',
    fg: '#062624'
  },
  ha: {
    label: 'Halogen',
    bg: '#9bb6f1',
    fg: '#0a1838'
  },
  ng: {
    label: 'Noble gas',
    bg: '#c89af0',
    fg: '#1f0838'
  },
  ln: {
    label: 'Lanthanide',
    bg: '#f0a6d1',
    fg: '#380a26'
  },
  ac: {
    label: 'Actinide',
    bg: '#f08a8a',
    fg: '#380a0a'
  }
};
function PeriodicTableModal(_ref51) {
  var _PERIODIC_CATEGORIES$;
  var onClose = _ref51.onClose;
  var _useState50 = useState(null),
    selected = _useState50[0],
    setSelected = _useState50[1];
  useEffect(function () {
    var prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    var onKey = function onKey(e) {
      if (e.key === 'Escape') {
        if (selected) setSelected(null);else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return function () {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, selected]);
  return React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3",
    onClick: onClose
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-3 sm:p-4 w-full max-w-5xl max-h-[92vh] flex flex-col",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mb-3 shrink-0"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
  }, "Periodic table"), React.createElement("div", {
    className: "text-sm font-semibold text-[var(--text-strong)]"
  }, selected ? selected.name + " (" + selected.sym + ")" : 'Tap an element for details')), React.createElement("button", {
    onClick: onClose,
    className: "text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]",
    "aria-label": "Close"
  }, "\xD7")), React.createElement("div", {
    className: "overflow-x-auto overflow-y-hidden shrink-0 -mx-1 px-1 pb-2"
  }, React.createElement("div", {
    className: "grid gap-[2px]",
    style: {
      gridTemplateColumns: 'repeat(18, minmax(34px, 1fr))',
      gridAutoRows: 'minmax(0, 1fr)',
      aspectRatio: '18 / 11',
      minWidth: '720px'
    }
  }, PERIODIC_TABLE.map(function (el) {
    var cat = PERIODIC_CATEGORIES[el.cat] || {
      bg: '#888',
      fg: '#fff'
    };
    return React.createElement("button", {
      key: el.num,
      onClick: function onClick() {
        return setSelected(el);
      },
      style: {
        gridColumnStart: el.col,
        gridRowStart: el.row,
        background: cat.bg,
        color: cat.fg
      },
      className: "flex flex-col items-stretch justify-between rounded-[3px] p-0.5 text-left leading-none hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]",
      title: el.name + " \xB7 #" + el.num + " \xB7 " + el.mass
    }, React.createElement("div", {
      className: "text-[8px] sm:text-[10px] opacity-80"
    }, el.num), React.createElement("div", {
      className: "text-[12px] sm:text-base font-bold text-center"
    }, el.sym), React.createElement("div", {
      className: "text-[7px] sm:text-[8px] opacity-70 text-center"
    }, el.mass));
  }))), React.createElement("div", {
    className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 overflow-y-auto"
  }, React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-xs"
  }, selected ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "text-[var(--text-faint)] uppercase tracking-wide text-[10px]"
  }, ((_PERIODIC_CATEGORIES$ = PERIODIC_CATEGORIES[selected.cat]) == null ? void 0 : _PERIODIC_CATEGORIES$.label) || ''), React.createElement("div", {
    className: "font-semibold text-base text-[var(--text-strong)] mt-0.5"
  }, selected.name, " \u2014 ", selected.sym), React.createElement("div", {
    className: "text-[var(--text-muted)] mt-1.5 space-y-0.5"
  }, React.createElement("div", null, "Atomic number: ", React.createElement("span", {
    className: "font-mono text-[var(--text)]"
  }, selected.num)), React.createElement("div", null, "Atomic mass: ", React.createElement("span", {
    className: "font-mono text-[var(--text)]"
  }, selected.mass)), React.createElement("div", null, "Position: period ", selected.row > 7 ? selected.cat === 'ln' ? 6 : 7 : selected.row, ", group ", selected.row > 7 ? '—' : selected.col))) : React.createElement("div", {
    className: "text-[var(--text-muted)]"
  }, "Tap any element to see its name, atomic number, and atomic mass.")), React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1.5"
  }, "Categories"), React.createElement("div", {
    className: "grid grid-cols-2 gap-x-2 gap-y-1"
  }, Object.entries(PERIODIC_CATEGORIES).map(function (_ref52) {
    var k = _ref52[0],
      c = _ref52[1];
    return React.createElement("div", {
      key: k,
      className: "flex items-center gap-2 text-[11px]"
    }, React.createElement("span", {
      className: "inline-block w-3 h-3 rounded shrink-0",
      style: {
        background: c.bg
      }
    }), React.createElement("span", {
      className: "text-[var(--text-muted)] truncate"
    }, c.label));
  }))))));
}
function Flashcard(_ref53) {
  var term = _ref53.term,
    definition = _ref53.definition;
  var _useState51 = useState(false),
    flipped = _useState51[0],
    setFlipped = _useState51[1];
  var _useMoleculeViewer2 = useMoleculeViewer(),
    openMol = _useMoleculeViewer2.open;
  var termMol = looksLikeMolecule(term);
  var flip = function flip() {
    return setFlipped(function (f) {
      return !f;
    });
  };
  return React.createElement("div", {
    onClick: flip,
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    },
    role: "button",
    tabIndex: 0,
    "data-no-haptic": true,
    className: "relative w-full text-left grid rounded-lg overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]",
    "aria-label": flipped ? "Definition of " + term : "Show definition of " + term
  }, React.createElement("div", {
    className: "bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg p-3 flex flex-col justify-center transition-opacity duration-200",
    style: {
      gridArea: '1 / 1',
      opacity: flipped ? 0 : 1,
      pointerEvents: flipped ? 'none' : 'auto'
    },
    "aria-hidden": flipped
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-faint)] flex items-center justify-between gap-2"
  }, React.createElement("span", null, "Term"), termMol && React.createElement("span", {
    role: "button",
    tabIndex: 0,
    onClick: function onClick(e) {
      e.stopPropagation();
      openMol(termMol);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation();
        e.preventDefault();
        openMol(termMol);
      }
    },
    className: "text-[10px] px-1.5 py-0.5 rounded border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] cursor-pointer normal-case tracking-normal",
    title: "View 2D structure of " + termMol
  }, "\uD83E\uDDEA Structure")), React.createElement("div", {
    className: "text-sm sm:text-base font-semibold text-[var(--text-strong)] leading-snug"
  }, term), React.createElement("div", {
    className: "text-[10px] text-[var(--text-fainter)] mt-1"
  }, "Tap to flip")), React.createElement("div", {
    className: "bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-lg p-3 transition-opacity duration-200",
    style: {
      gridArea: '1 / 1',
      opacity: flipped ? 1 : 0,
      pointerEvents: flipped ? 'auto' : 'none'
    },
    "aria-hidden": !flipped
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--accent-text)] flex items-center justify-between gap-2"
  }, React.createElement("span", {
    className: "truncate"
  }, term), termMol && React.createElement("span", {
    role: "button",
    tabIndex: 0,
    onClick: function onClick(e) {
      e.stopPropagation();
      openMol(termMol);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation();
        e.preventDefault();
        openMol(termMol);
      }
    },
    className: "shrink-0 text-[10px] px-1.5 py-0.5 rounded border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--bg-hover)] cursor-pointer normal-case tracking-normal",
    title: "View 2D structure of " + termMol
  }, "\uD83E\uDDEA")), React.createElement("div", {
    className: "text-xs sm:text-sm text-[var(--text)] leading-snug mt-0.5"
  }, React.createElement(MoleculeText, {
    text: definition
  }))));
}
function RelatedFlashcards(_ref54) {
  var item = _ref54.item;
  var _useApp6 = useApp(),
    extractions = _useApp6.extractions;
  var related = useMemo(function () {
    return relatedTermsForItem(item, extractions);
  }, [item, extractions]);
  if (related.length === 0) return null;
  return React.createElement("div", {
    className: "border-t border-[var(--border-soft)] pt-3 mt-3"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Related terms \xB7 ", related.length), React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, related.map(function (kt) {
    return React.createElement(Flashcard, {
      key: kt.term,
      term: kt.term,
      definition: kt.definition
    });
  })));
}
var AA_NAME_TO_CID = {
  glycine: 750,
  'l-alanine': 5950,
  'l-valine': 6287,
  'l-leucine': 6106,
  'l-isoleucine': 6306,
  'l-proline': 145742,
  'l-methionine': 6137,
  'l-phenylalanine': 6140,
  'l-tyrosine': 6057,
  'l-tryptophan': 6305,
  'l-serine': 5951,
  'l-threonine': 6288,
  'l-cysteine': 5862,
  'l-asparagine': 6267,
  'l-glutamine': 5961,
  'l-aspartic acid': 5960,
  'l-glutamic acid': 33032,
  'l-lysine': 5962,
  'l-arginine': 6322,
  'l-histidine': 6274
};
function localStructure(url) {
  if (typeof url !== 'string' || !url) return url;
  if (url.startsWith('assets/')) return url;
  var m = url.match(/[?&]cid=(\d+)/) || url.match(/\/cid\/(\d+)/);
  if (m) return "assets/aa/" + m[1] + ".png";
  m = url.match(/\/name\/([^/]+)\/PNG/i);
  if (m) {
    var cid = AA_NAME_TO_CID[decodeURIComponent(m[1]).toLowerCase()];
    if (cid) return "assets/aa/" + cid + ".png";
  }
  return url;
}
function isImagePath(s) {
  return typeof s === 'string' && (s.startsWith('assets/') || /pubchem\.ncbi/i.test(s) || /\.(png|jpe?g|svg|gif|webp)(\?|$)/i.test(s));
}
function MCQuestion(_ref55) {
  var item = _ref55.item,
    onAnswer = _ref55.onAnswer,
    nextSlot = _ref55.nextSlot,
    onFlag = _ref55.onFlag;
  var _useState52 = useState(null),
    picked = _useState52[0],
    setPicked = _useState52[1];
  var shuffled = useMemo(function () {
    var arr = (item.q.choices || []).map(function (text, origIdx) {
      return {
        text,
        origIdx
      };
    });
    return shuffle(arr);
  }, [item.id]);
  var promptImage = item.q.image;
  var choicesAreImages = (item.q.choices || []).some(isImagePath);
  var submit = function submit(entry) {
    if (picked !== null) return;
    setPicked(entry);
    var correct = entry.origIdx === item.q.correct_index;
    playSfx(correct ? 'correct' : 'wrong');
    if (correct) vibrateCorrect();else vibrateWrong();
    var labels = item.q.choice_labels;
    var ua = Array.isArray(labels) && labels[entry.origIdx] != null ? labels[entry.origIdx] : entry.text;
    onAnswer({
      correct,
      user_answer: ua
    });
  };
  return React.createElement("div", {
    className: "question-card space-y-4"
  }, promptImage && React.createElement("div", {
    className: "bg-white rounded-lg p-3 flex items-center justify-center"
  }, React.createElement("img", {
    src: localStructure(promptImage),
    alt: "Molecule structure",
    loading: "lazy",
    className: "max-w-full h-auto",
    style: {
      maxHeight: '220px'
    }
  })), React.createElement("p", {
    className: "text-base leading-relaxed"
  }, promptImage || choicesAreImages ? item.q.question : React.createElement(MoleculeText, {
    text: item.q.question
  })), React.createElement("div", {
    className: "space-y-2"
  }, shuffled.map(function (entry, i) {
    var isPicked = picked && entry.origIdx === picked.origIdx;
    var isCorrect = entry.origIdx === item.q.correct_index;
    var cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
    if (picked) {
      if (isCorrect) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';else if (isPicked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';else cls = 'border-[var(--border-soft)] opacity-60';
    }
    return React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return submit(entry);
      },
      disabled: picked !== null,
      "data-no-haptic": true,
      className: "w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors " + cls
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] mr-2 align-middle"
    }, String.fromCharCode(65 + i), "."), isImagePath(entry.text) ? React.createElement("span", {
      className: "bg-white rounded-md p-1 inline-flex align-middle"
    }, React.createElement("img", {
      src: localStructure(entry.text),
      alt: "Molecule structure",
      loading: "lazy",
      className: "h-auto",
      style: {
        maxHeight: '120px',
        maxWidth: '100%'
      }
    })) : React.createElement(MoleculeText, {
      text: entry.text
    }));
  })), picked && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mt-3"
  }, React.createElement("div", {
    className: picked.origIdx === item.q.correct_index ? 'text-[var(--success-text)] font-medium' : 'text-[var(--danger-text)] font-medium'
  }, picked.origIdx === item.q.correct_index ? 'Correct' : 'Incorrect'), React.createElement("div", {
    className: "flex items-center gap-2"
  }, onFlag && React.createElement("button", {
    onClick: onFlag,
    className: "text-xs text-[var(--text-muted)] hover:text-[var(--warning-text-strong)] border border-[var(--border)] rounded px-2 py-1",
    title: "Flag this question for review"
  }, "\u2691 Flag"), nextSlot)), React.createElement("div", {
    className: "answer-reveal bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]"
  }, React.createElement(MoleculeText, {
    text: item.q.explanation
  })), React.createElement(RelatedFlashcards, {
    item: item
  })));
}
function ShortAnswerQuestion(_ref56) {
  var _item$q$key_points;
  var item = _ref56.item,
    onAnswer = _ref56.onAnswer,
    onAnswerOverride = _ref56.onAnswerOverride,
    nextSlot = _ref56.nextSlot;
  var _useApp7 = useApp(),
    client = _useApp7.client,
    apiKey = _useApp7.apiKey;
  var _useState53 = useState(''),
    text = _useState53[0],
    setText = _useState53[1];
  var _useState54 = useState(false),
    revealed = _useState54[0],
    setRevealed = _useState54[1];
  var _useState55 = useState(false),
    graded = _useState55[0],
    setGraded = _useState55[1];
  var _useState56 = useState(null),
    auto = _useState56[0],
    setAuto = _useState56[1];
  var _useState57 = useState(false),
    autoBusy = _useState57[0],
    setAutoBusy = _useState57[1];
  var exact = !!item.q.exact;
  var norm = function norm(s) {
    return (s || '').trim().toLowerCase().replace(/\.+$/, '');
  };
  var accepted = exact ? [item.q.ideal_answer].concat(item.q.key_points || [], item.q.accept || []).map(norm).filter(Boolean) : null;
  var _useState58 = useState(null),
    exactCorrect = _useState58[0],
    setExactCorrect = _useState58[1];
  var skip = function skip() {
    setRevealed(true);
    if (exact) setExactCorrect(false);
    finalize(false);
  };
  var submit = function () {
    var _ref57 = _asyncToGenerator(_regenerator().m(function _callee41() {
      var ok, res, _t26;
      return _regenerator().w(function (_context46) {
        while (1) switch (_context46.p = _context46.n) {
          case 0:
            setRevealed(true);
            if (!exact) {
              _context46.n = 1;
              break;
            }
            ok = accepted.includes(norm(text));
            setExactCorrect(ok);
            finalize(ok);
            return _context46.a(2);
          case 1:
            if (!(!apiKey || !text.trim())) {
              _context46.n = 2;
              break;
            }
            return _context46.a(2);
          case 2:
            setAutoBusy(true);
            _context46.p = 3;
            _context46.n = 4;
            return client.gradeShortAnswer({
              prompt: item.q.prompt,
              ideal_answer: item.q.ideal_answer,
              key_points: item.q.key_points,
              user_answer: text,
              chapter: item.chapter
            });
          case 4:
            res = _context46.v;
            setAuto(res);
            _context46.n = 6;
            break;
          case 5:
            _context46.p = 5;
            _t26 = _context46.v;
            setAuto({
              error: (_t26 == null ? void 0 : _t26.message) || 'grading failed'
            });
          case 6:
            _context46.p = 6;
            setAutoBusy(false);
            return _context46.f(6);
          case 7:
            return _context46.a(2);
        }
      }, _callee41, null, [[3, 5, 6, 7]]);
    }));
    return function submit() {
      return _ref57.apply(this, arguments);
    };
  }();
  var finalize = function finalize(correct) {
    if (graded) return;
    setGraded(true);
    playSfx(correct ? 'correct' : 'wrong');
    if (correct) vibrateCorrect();else vibrateWrong();
    onAnswer({
      correct,
      user_answer: text
    });
  };
  useEffect(function () {
    if (auto && typeof auto.passes === 'boolean' && !graded) {
      finalize(!!auto.passes);
    }
  }, [auto]);
  var _useState59 = useState(false),
    manualOverride = _useState59[0],
    setManualOverride = _useState59[1];
  var verdictPasses = auto && typeof auto.passes === 'boolean' ? manualOverride ? !auto.passes : !!auto.passes : null;
  var flipVerdict = function flipVerdict() {
    if (!graded || !auto || typeof auto.passes !== 'boolean') return;
    var newOverride = !manualOverride;
    setManualOverride(newOverride);
    var newPasses = newOverride ? !auto.passes : !!auto.passes;
    onAnswerOverride == null || onAnswerOverride({
      correct: newPasses
    });
  };
  return React.createElement("div", {
    className: "question-card space-y-4"
  }, React.createElement("p", {
    className: "text-base leading-relaxed"
  }, React.createElement(MoleculeText, {
    text: item.q.prompt
  })), React.createElement("textarea", {
    value: text,
    onChange: function onChange(e) {
      return setText(e.target.value);
    },
    disabled: revealed,
    rows: 4,
    placeholder: "Write your answer\u2026",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm disabled:opacity-70"
  }), !revealed ? React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("button", {
    onClick: submit,
    disabled: !text.trim(),
    className: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg px-4 py-2 text-sm font-medium"
  }, apiKey || exact ? 'Submit answer' : 'Reveal answer'), React.createElement("button", {
    onClick: skip,
    className: "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)] rounded-lg px-4 py-2 text-sm font-medium"
  }, "Skip")) : React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-4 space-y-3"
  }, exact && React.createElement("div", {
    className: "text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded inline-block " + (exactCorrect ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : 'bg-[var(--danger-bg)] text-[var(--danger-text)]')
  }, exactCorrect ? '✓ Correct' : '✗ Incorrect'), apiKey && !exact && React.createElement("div", {
    className: "border-b border-[var(--border-soft)] pb-3 -mt-1"
  }, autoBusy ? React.createElement("div", {
    className: "flex items-center gap-2 text-sm text-[var(--accent-text)]"
  }, React.createElement("span", {
    className: "inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"
  }), React.createElement("span", null, "Grading your answer with Gemini\u2026")) : auto != null && auto.error ? React.createElement("div", {
    className: "text-xs text-[var(--danger-text)]"
  }, "Auto-grading failed: ", auto.error, ". Use the Got it / Missed it buttons below.") : auto && typeof auto.passes === 'boolean' ? React.createElement("div", {
    className: "space-y-1.5"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("span", {
    className: "text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded " + (verdictPasses ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : 'bg-[var(--danger-bg)] text-[var(--danger-text)]')
  }, verdictPasses ? '✓ Full credit' : '✗ Not enough'), typeof auto.score === 'number' && React.createElement("span", {
    className: "text-xs text-[var(--text-faint)] font-mono"
  }, "score ", auto.score, "/100"), React.createElement("button", {
    onClick: flipVerdict,
    className: "ml-auto text-[11px] px-2 py-0.5 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]",
    title: "Disagree with the auto-grade? Flip the verdict \u2014 your stats and account sync update too."
  }, "Override")), auto.feedback && React.createElement("div", {
    className: "text-xs text-[var(--text-muted)]"
  }, React.createElement(MoleculeText, {
    text: auto.feedback
  }))) : null), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--success-text)] mb-1"
  }, "Ideal answer"), React.createElement("div", {
    className: "text-sm text-[var(--text-strong)]"
  }, React.createElement(MoleculeText, {
    text: item.q.ideal_answer
  }))), !exact && ((_item$q$key_points = item.q.key_points) == null ? void 0 : _item$q$key_points.length) > 0 && React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--accent-text)] mb-1"
  }, "Key points"), React.createElement("ul", {
    className: "text-sm text-[var(--text)] list-disc pl-5 space-y-0.5"
  }, item.q.key_points.map(function (p, i) {
    var _auto$hit_points, _auto$missed_points;
    var idx = i + 1;
    var hit = auto == null || (_auto$hit_points = auto.hit_points) == null ? void 0 : _auto$hit_points.includes(idx);
    var missed = auto == null || (_auto$missed_points = auto.missed_points) == null ? void 0 : _auto$missed_points.includes(idx);
    return React.createElement("li", {
      key: i,
      className: hit ? 'text-[var(--success-text)]' : missed ? 'text-[var(--danger-text)]' : ''
    }, hit ? '✓ ' : missed ? '✗ ' : '', React.createElement(MoleculeText, {
      text: p
    }));
  }))), !graded ? React.createElement("div", {
    className: "flex gap-2 pt-2 border-t border-[var(--border-soft)]"
  }, React.createElement("span", {
    className: "text-xs text-[var(--text-muted)] self-center mr-2"
  }, "How did you do?"), React.createElement("button", {
    onClick: function onClick() {
      return finalize(false);
    },
    className: "text-sm px-3 py-1.5 border border-[var(--danger-border)] text-[var(--danger-text)] hover:bg-[var(--danger-bg)] rounded"
  }, "Missed it"), React.createElement("button", {
    onClick: function onClick() {
      return finalize(true);
    },
    className: "text-sm px-3 py-1.5 border border-[var(--success-border)] text-[var(--success-text)] hover:bg-[var(--success-bg)] rounded"
  }, "Got it")) : React.createElement("div", {
    className: "flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-soft)]"
  }, React.createElement("div", {
    className: "text-xs text-[var(--text-faint)]"
  }, exact || auto && typeof auto.passes === 'boolean' ? 'Auto-graded.' : 'Graded.'), nextSlot)));
}
function TwoPartQuestion(_ref58) {
  var item = _ref58.item,
    onAnswer = _ref58.onAnswer,
    nextSlot = _ref58.nextSlot,
    onFlag = _ref58.onFlag;
  var parts = item.q.parts || [];
  var _useState60 = useState(0),
    partIdx = _useState60[0],
    setPartIdx = _useState60[1];
  var _useState61 = useState([]),
    results = _useState61[0],
    setResults = _useState61[1];
  var _useState62 = useState(false),
    done = _useState62[0],
    setDone = _useState62[1];
  if (parts.length === 0) {
    return React.createElement("div", {
      className: "text-sm text-[var(--text-muted)]"
    }, "Malformed two-part question.");
  }
  var handlePartAnswer = function handlePartAnswer(res) {
    var nextResults = [].concat(results, [res]);
    setResults(nextResults);
    if (partIdx + 1 < parts.length) {
      onAnswer(_extends({}, res, {
        isInterim: true
      }));
      setPartIdx(function (i) {
        return i + 1;
      });
    } else {
      var scored = nextResults.filter(function (r) {
        return !r.noScore;
      });
      var allCorrect = scored.length ? scored.every(function (r) {
        return r.correct;
      }) : true;
      setDone(true);
      onAnswer({
        correct: allCorrect,
        user_answer: nextResults.map(function (r, i) {
          return "P" + (i + 1) + ": " + r.user_answer;
        }).join(' | ')
      });
    }
  };
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("span", {
    className: "block text-xs uppercase tracking-wide text-[var(--accent-text)]"
  }, "Two-part \xB7 ", item.q.theme), parts.slice(0, partIdx + 1).map(function (p, i) {
    return React.createElement("div", {
      key: i,
      className: "space-y-2"
    }, React.createElement("span", {
      className: "block text-xs text-[var(--text-faint)]"
    }, "Part ", i + 1, " of ", parts.length), p.draw ? React.createElement(DrawPart, {
      part: p,
      onAnswer: handlePartAnswer,
      nextSlot: done && i === parts.length - 1 ? nextSlot : null
    }) : React.createElement(SinglePart, {
      part: p,
      onAnswer: handlePartAnswer,
      nextSlot: done && i === parts.length - 1 ? nextSlot : null,
      continueLabel: i === parts.length - 1 ? null : 'Continue →'
    }));
  }), done && onFlag && React.createElement("div", {
    className: "flex justify-end"
  }, React.createElement("button", {
    onClick: onFlag,
    className: "text-xs text-[var(--text-muted)] hover:text-[var(--warning-text-strong)] border border-[var(--border)] rounded px-2 py-1",
    title: "Flag this two-part item for review"
  }, "\u2691 Flag")));
}
function SinglePart(_ref59) {
  var part = _ref59.part,
    onAnswer = _ref59.onAnswer,
    nextSlot = _ref59.nextSlot,
    continueLabel = _ref59.continueLabel;
  var _useState63 = useState(null),
    picked = _useState63[0],
    setPicked = _useState63[1];
  var _useState64 = useState(false),
    advanced = _useState64[0],
    setAdvanced = _useState64[1];
  var shuffled = useMemo(function () {
    var arr = (part.choices || []).map(function (text, origIdx) {
      return {
        text,
        origIdx
      };
    });
    return shuffle(arr);
  }, [part]);
  var submit = function submit(entry) {
    if (picked !== null) return;
    setPicked(entry);
    var correct = entry.origIdx === part.correct_index;
    playSfx(correct ? 'correct' : 'wrong');
    if (correct) vibrateCorrect();else vibrateWrong();
  };
  var onContinue = function onContinue() {
    if (picked === null || advanced) return;
    setAdvanced(true);
    var correct = picked.origIdx === part.correct_index;
    onAnswer({
      correct,
      user_answer: picked.text
    });
  };
  var hasImage = typeof part.image === 'string' && part.image;
  return React.createElement("div", {
    className: "question-card space-y-4"
  }, hasImage && React.createElement("div", {
    className: "bg-white rounded-lg p-3 flex items-center justify-center"
  }, React.createElement("img", {
    src: localStructure(part.image),
    alt: "Molecular structure",
    loading: "lazy",
    className: "max-w-full h-auto",
    style: {
      maxHeight: '240px'
    }
  })), React.createElement("p", {
    className: "text-base leading-relaxed"
  }, React.createElement(MoleculeText, {
    text: part.question
  })), React.createElement("div", {
    className: "space-y-2"
  }, shuffled.map(function (entry, i) {
    var isPicked = picked && entry.origIdx === picked.origIdx;
    var isCorrect = entry.origIdx === part.correct_index;
    var cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
    if (picked) {
      if (isCorrect) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';else if (isPicked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';else cls = 'border-[var(--border-soft)] opacity-60';
    }
    return React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return submit(entry);
      },
      disabled: picked !== null,
      "data-no-haptic": true,
      className: "w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors " + cls
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] mr-2"
    }, String.fromCharCode(65 + i), "."), hasImage ? entry.text : React.createElement(MoleculeText, {
      text: entry.text
    }));
  })), picked && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "flex items-center justify-between gap-3 mt-3"
  }, React.createElement("div", {
    className: picked.origIdx === part.correct_index ? 'text-[var(--success-text)] font-medium' : 'text-[var(--danger-text)] font-medium'
  }, picked.origIdx === part.correct_index ? 'Correct' : 'Incorrect'), !advanced && React.createElement("button", {
    onClick: onContinue,
    className: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium"
  }, continueLabel || 'Continue →'), advanced && nextSlot), React.createElement("div", {
    className: "answer-reveal bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]"
  }, React.createElement(MoleculeText, {
    text: part.explanation
  }))));
}
function DrawPart(_ref60) {
  var part = _ref60.part,
    onAnswer = _ref60.onAnswer,
    nextSlot = _ref60.nextSlot;
  var canvasRef = useRef(null);
  var drawing = useRef(false);
  var last = useRef(null);
  var _useState65 = useState(false),
    revealed = _useState65[0],
    setRevealed = _useState65[1];
  var _useState66 = useState(false),
    advanced = _useState66[0],
    setAdvanced = _useState66[1];
  useEffect(function () {
    var c = canvasRef.current;
    if (!c) return;
    var ratio = window.devicePixelRatio || 1;
    var w = c.clientWidth || 300;
    var h = 240;
    c.width = w * ratio;
    c.height = h * ratio;
    var ctx = c.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#111827';
  }, []);
  var posOf = function posOf(e) {
    var r = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    };
  };
  var down = function down(e) {
    e.preventDefault();
    e.currentTarget.setPointerCapture == null || e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = posOf(e);
  };
  var move = function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    var ctx = canvasRef.current.getContext('2d');
    var p = posOf(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  var up = function up() {
    drawing.current = false;
    last.current = null;
  };
  var clear = function clear() {
    var c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
  };
  var finish = function finish(userAnswer) {
    if (advanced) return;
    setAdvanced(true);
    onAnswer({
      correct: true,
      noScore: true,
      user_answer: userAnswer
    });
  };
  return React.createElement("div", {
    className: "question-card space-y-3"
  }, React.createElement("p", {
    className: "text-base leading-relaxed"
  }, part.question, " ", React.createElement("span", {
    className: "text-xs text-[var(--text-faint)] whitespace-nowrap"
  }, "(practice \u2014 not scored)")), React.createElement("div", {
    className: "rounded-lg overflow-hidden border border-[var(--border)] bg-white"
  }, React.createElement("canvas", {
    ref: canvasRef,
    className: "block w-full",
    style: {
      height: '240px',
      touchAction: 'none',
      cursor: 'crosshair'
    },
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: up,
    onPointerLeave: up,
    onPointerCancel: up
  })), !revealed && !advanced && React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, React.createElement("button", {
    onClick: clear,
    className: "text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
  }, "Clear"), React.createElement("button", {
    onClick: function onClick() {
      return finish('skipped drawing');
    },
    className: "ml-auto text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
  }, "Skip"), React.createElement("button", {
    onClick: function onClick() {
      return setRevealed(true);
    },
    className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
  }, "Reveal structure \u2192")), revealed && React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Actual structure"), part.image && React.createElement("div", {
    className: "bg-white rounded-lg p-3 flex items-center justify-center border border-[var(--border-soft)]"
  }, React.createElement("img", {
    src: localStructure(part.image),
    alt: "Correct structure",
    loading: "lazy",
    className: "max-w-full h-auto",
    style: {
      maxHeight: '220px'
    }
  })), part.explanation && React.createElement("div", {
    className: "answer-reveal bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]"
  }, React.createElement(MoleculeText, {
    text: part.explanation
  })), !advanced && React.createElement("div", {
    className: "flex justify-end"
  }, React.createElement("button", {
    onClick: function onClick() {
      return finish('drew it');
    },
    className: "text-sm px-4 py-2 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
  }, "Continue \u2192"))), advanced && nextSlot);
}
function MatchingQuestion(_ref61) {
  var item = _ref61.item,
    onAnswer = _ref61.onAnswer,
    nextSlot = _ref61.nextSlot;
  var pairs = item.q.terms;
  var termOrder = useMemo(function () {
    return pairs.map(function (_, i) {
      return i;
    });
  }, [item.id]);
  var defOrder = useMemo(function () {
    return shuffle(pairs.map(function (_, i) {
      return i;
    }));
  }, [item.id]);
  var _useState67 = useState({}),
    pairings = _useState67[0],
    setPairings = _useState67[1];
  var _useState68 = useState(null),
    selectedTerm = _useState68[0],
    setSelectedTerm = _useState68[1];
  var _useState69 = useState(false),
    submitted = _useState69[0],
    setSubmitted = _useState69[1];
  var usedDefs = new Set(Object.values(pairings));
  var allPaired = Object.keys(pairings).length === pairs.length;
  var onTermClick = function onTermClick(i) {
    if (submitted) return;
    if (pairings[i] !== undefined) {
      var next = _extends({}, pairings);
      delete next[i];
      setPairings(next);
      return;
    }
    setSelectedTerm(i);
  };
  var onDefClick = function onDefClick(j) {
    if (submitted) return;
    if (usedDefs.has(j)) {
      var _Object$entries$find;
      var termIdx = (_Object$entries$find = Object.entries(pairings).find(function (_ref62) {
        var v = _ref62[1];
        return v === j;
      })) == null ? void 0 : _Object$entries$find[0];
      if (termIdx !== undefined) {
        var next = _extends({}, pairings);
        delete next[termIdx];
        setPairings(next);
      }
      return;
    }
    if (selectedTerm === null) return;
    setPairings(function (p) {
      return _extends({}, p, {
        [selectedTerm]: j
      });
    });
    setSelectedTerm(null);
  };
  var submit = function submit() {
    if (submitted || !allPaired) return;
    setSubmitted(true);
    var correctCount = 0;
    for (var _i21 = 0, _Object$entries = Object.entries(pairings); _i21 < _Object$entries.length; _i21++) {
      var _Object$entries$_i = _Object$entries[_i21],
        termIdxStr = _Object$entries$_i[0],
        defIdx = _Object$entries$_i[1];
      var termIdx = Number(termIdxStr);
      if (termIdx === defIdx) correctCount++;
    }
    var allRight = correctCount === pairs.length;
    playSfx(allRight ? 'correct' : 'wrong');
    if (allRight) vibrateCorrect();else vibrateWrong();
    onAnswer({
      correct: allRight,
      user_answer: correctCount + "/" + pairs.length + " pairs correct"
    });
  };
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Match each term to its definition."), React.createElement("div", {
    className: "grid grid-cols-2 gap-4 items-start"
  }, React.createElement("div", {
    className: "space-y-2"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-faint)]"
  }, "Terms"), React.createElement("div", {
    className: "space-y-2 max-h-[55vh] overflow-y-auto pr-1"
  }, termOrder.map(function (i) {
    var paired = pairings[i] !== undefined;
    var correct = submitted && paired && pairings[i] === i;
    var wrong = submitted && paired && pairings[i] !== i;
    var cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
    if (selectedTerm === i) cls = 'border-[var(--accent-border)] bg-[var(--accent-soft)]';else if (correct) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';else if (wrong) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';else if (paired) cls = 'border-[var(--border-strong)] bg-[var(--bg-hover-soft)]';
    return React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return onTermClick(i);
      },
      disabled: submitted,
      className: "w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors " + cls
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] mr-2"
    }, i + 1, "."), React.createElement("span", {
      className: "font-medium"
    }, pairs[i].term), paired && React.createElement("span", {
      className: "text-xs text-[var(--text-muted)] ml-2"
    }, "\u2192 ", String.fromCharCode(65 + defOrder.indexOf(pairings[i]))));
  }))), React.createElement("div", {
    className: "space-y-2"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-faint)]"
  }, "Definitions"), React.createElement("div", {
    className: "space-y-2 max-h-[55vh] overflow-y-auto pr-1"
  }, defOrder.map(function (j, displayIdx) {
    var _Object$entries$find2;
    var used = usedDefs.has(j);
    var termIdx = (_Object$entries$find2 = Object.entries(pairings).find(function (_ref63) {
      var v = _ref63[1];
      return v === j;
    })) == null ? void 0 : _Object$entries$find2[0];
    var correct = submitted && termIdx !== undefined && Number(termIdx) === j;
    var wrong = submitted && termIdx !== undefined && Number(termIdx) !== j;
    var cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
    if (correct) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';else if (wrong) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';else if (used) cls = 'border-[var(--border-strong)] bg-[var(--bg-hover-soft)]';
    return React.createElement("button", {
      key: j,
      onClick: function onClick() {
        return onDefClick(j);
      },
      disabled: submitted || selectedTerm === null && !used,
      className: "w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-60 " + cls
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] mr-2"
    }, String.fromCharCode(65 + displayIdx), "."), pairs[j].definition);
  })))), !submitted ? React.createElement("button", {
    onClick: submit,
    disabled: !allPaired,
    className: "w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
  }, allPaired ? 'Submit' : "Pair all " + pairs.length + " terms to submit") : React.createElement("div", {
    className: "flex justify-end"
  }, nextSlot));
}
function useQuizTimer() {
  var _useState70 = useState(function () {
      return Date.now();
    }),
    startedAt = _useState70[0];
  var _useState71 = useState(null),
    pausedAt = _useState71[0],
    setPausedAt = _useState71[1];
  var _useState72 = useState(0),
    banked = _useState72[0],
    setBanked = _useState72[1];
  var _useState73 = useState('0:00'),
    display = _useState73[0],
    setDisplay = _useState73[1];
  var pause = useCallback(function () {
    if (!pausedAt) setPausedAt(Date.now());
  }, [pausedAt]);
  var resume = useCallback(function () {
    if (pausedAt) {
      setBanked(function (b) {
        return b + (Date.now() - pausedAt);
      });
      setPausedAt(null);
    }
  }, [pausedAt]);
  useEffect(function () {
    if (pausedAt) return;
    var tick = function tick() {
      var elapsed = Math.floor((Date.now() - startedAt - banked) / 1000);
      var m = Math.floor(elapsed / 60);
      var s = elapsed % 60;
      setDisplay(m + ":" + s.toString().padStart(2, '0'));
    };
    tick();
    var id = setInterval(tick, 1000);
    return function () {
      return clearInterval(id);
    };
  }, [startedAt, banked, pausedAt]);
  return {
    display,
    pause,
    resume,
    paused: !!pausedAt
  };
}
function QuizRunner(_ref64) {
  var items = _ref64.items,
    onExit = _ref64.onExit,
    onPause = _ref64.onPause;
  var _useApp8 = useApp(),
    addAttempt = _useApp8.addAttempt,
    updateLastAttempt = _useApp8.updateLastAttempt,
    flushSync = _useApp8.flushSync;
  var exitQuiz = function exitQuiz(r, time) {
    try {
      flushSync();
    } catch (_unused32) {}
    onExit(r, time);
  };
  var _useState74 = useState(0),
    index = _useState74[0],
    setIndex = _useState74[1];
  var _useState75 = useState([]),
    results = _useState75[0],
    setResults = _useState75[1];
  var resultsRef = useRef([]);
  var setQuizResults = function setQuizResults(updater) {
    setResults(function (prev) {
      var next = typeof updater === 'function' ? updater(prev) : updater;
      resultsRef.current = next;
      return next;
    });
  };
  var _useState76 = useState(false),
    answered = _useState76[0],
    setAnswered = _useState76[1];
  var timer = useQuizTimer();
  var timerRef = useRef(timer);
  timerRef.current = timer;
  useEffect(function () {
    if (onPause) onPause(timerRef);
  }, [onPause]);
  var _useState77 = useState(false),
    flagging = _useState77[0],
    setFlagging = _useState77[1];
  var _useState78 = useState(false),
    showCalc = _useState78[0],
    setShowCalc = _useState78[1];
  var _useState79 = useState(false),
    calcMin = _useState79[0],
    setCalcMin = _useState79[1];
  var _useState80 = useState(''),
    calcExpr = _useState80[0],
    setCalcExpr = _useState80[1];
  var _useState81 = useState(false),
    showTable = _useState81[0],
    setShowTable = _useState81[1];
  var item = items[index];
  var isLast = index === items.length - 1;
  var handleAnswer = function handleAnswer(_ref65) {
    var correct = _ref65.correct,
      user_answer = _ref65.user_answer,
      isInterim = _ref65.isInterim;
    if (isInterim) return;
    if (answered) return;
    setAnswered(true);
    if (!item.studyOnly) {
      addAttempt({
        question_id: item.id,
        mode: item.mode,
        file_id: item.file_id,
        chapter: item.chapter,
        subject: item.subject,
        correct,
        user_answer
      });
    }
    setQuizResults(function (r) {
      return [].concat(r, [{
        item,
        correct,
        user_answer
      }]);
    });
  };
  var handleAnswerOverride = function handleAnswerOverride(_ref66) {
    var correct = _ref66.correct;
    if (!answered) return;
    updateLastAttempt(item.id, {
      correct: !!correct
    });
    setQuizResults(function (prev) {
      var next = prev.slice();
      for (var i = next.length - 1; i >= 0; i--) {
        var _next$i$item;
        if (((_next$i$item = next[i].item) == null ? void 0 : _next$i$item.id) === item.id) {
          next[i] = _extends({}, next[i], {
            correct: !!correct
          });
          break;
        }
      }
      return next;
    });
  };
  var next = function next() {
    if (isLast) return;
    setIndex(index + 1);
    setAnswered(false);
  };
  if (!item) return null;
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] min-w-0"
  }, React.createElement("span", {
    className: "text-[var(--text-strong)]"
  }, item.chapter), React.createElement("span", {
    className: "ml-2"
  }, "\xB7 ", index + 1, "/", items.length)), React.createElement("div", {
    className: "flex items-center gap-1.5 shrink-0"
  }, React.createElement("button", {
    onClick: function onClick() {
      setShowCalc(true);
      setCalcMin(false);
    },
    title: "Open calculator",
    "aria-label": "Open calculator",
    className: "text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
  }, "\uD83E\uDDEE"), React.createElement("button", {
    onClick: function onClick() {
      return setShowTable(true);
    },
    title: "Open periodic table",
    "aria-label": "Open periodic table",
    className: "text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
  }, "\u269B\uFE0F"), React.createElement("span", {
    className: "text-xs font-mono text-[var(--text-muted)]"
  }, timer.display), React.createElement("button", {
    onClick: function onClick() {
      return exitQuiz(resultsRef.current, timer.display);
    },
    className: "text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1"
  }, "End quiz"))), React.createElement("div", {
    className: "h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden"
  }, React.createElement("div", {
    className: "h-full bg-[var(--accent-hover)] transition-all",
    style: {
      width: (index + (answered ? 1 : 0)) / items.length * 100 + "%"
    }
  })), React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, function () {
    var nextBtn = answered ? React.createElement("button", {
      onClick: isLast ? function () {
        return exitQuiz([].concat(resultsRef.current), timer.display);
      } : next,
      className: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium shrink-0"
    }, isLast ? 'See results' : 'Next →') : null;
    var onFlag = function onFlag() {
      return setFlagging(true);
    };
    var props = {
      key: item.id,
      item,
      onAnswer: handleAnswer,
      nextSlot: nextBtn,
      onFlag
    };
    if (item.mode === 'mc') return React.createElement(MCQuestion, props);
    if (item.mode === 'two_part') return React.createElement(TwoPartQuestion, props);
    if (item.mode === 'short') return React.createElement(ShortAnswerQuestion, _extends({}, props, {
      onAnswerOverride: handleAnswerOverride
    }));
    if (item.mode === 'match') return React.createElement(MatchingQuestion, props);
    return null;
  }()), flagging && React.createElement(FlagQuestionModal, {
    item: item,
    onClose: function onClose() {
      return setFlagging(false);
    }
  }), showCalc && React.createElement(CalculatorModal, {
    expr: calcExpr,
    setExpr: setCalcExpr,
    minimized: calcMin,
    onMinimize: function onMinimize() {
      return setCalcMin(function (m) {
        return !m;
      });
    },
    onClose: function onClose() {
      setShowCalc(false);
      setCalcMin(false);
      setCalcExpr('');
    }
  }), showTable && React.createElement(PeriodicTableModal, {
    onClose: function onClose() {
      return setShowTable(false);
    }
  }));
}
function QuizSummary(_ref67) {
  var results = _ref67.results,
    elapsedTime = _ref67.elapsedTime,
    onRestart = _ref67.onRestart,
    onDrillMisses = _ref67.onDrillMisses;
  var correct = results.filter(function (r) {
    return r.correct;
  }).length;
  var total = results.length;
  var pct = total ? Math.round(correct / total * 100) : 0;
  var misses = results.filter(function (r) {
    return !r.correct;
  });
  return React.createElement("div", {
    className: "space-y-5"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-center"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Quiz complete"), React.createElement("div", {
    className: "text-5xl font-bold mt-2"
  }, pct, "%"), React.createElement("div", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, correct, " of ", total, " correct"), elapsedTime && React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-1 font-mono"
  }, elapsedTime)), misses.length > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3"
  }, "Missed questions"), React.createElement("ul", {
    className: "space-y-2 text-sm"
  }, misses.map(function (m, i) {
    return React.createElement("li", {
      key: i,
      className: "text-[var(--text)]"
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] mr-2"
    }, i + 1, "."), m.item.mode === 'mc' && m.item.q.question, m.item.mode === 'two_part' && React.createElement("span", null, React.createElement("span", {
      className: "text-[var(--accent-text)]"
    }, "Two-part:"), " ", m.item.q.theme), m.item.mode === 'short' && m.item.q.prompt, m.item.mode === 'match' && React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, "Matching set \xB7 ", m.user_answer), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)] mt-0.5 ml-6"
    }, m.item.chapter));
  }))), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: onRestart,
    className: "flex-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm"
  }, "New quiz"), misses.length > 0 && React.createElement("button", {
    onClick: onDrillMisses,
    className: "flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-2 text-sm font-medium"
  }, "Drill ", misses.length, " miss", misses.length === 1 ? '' : 'es')));
}
var WEAK_SPOT_COUNTS = [5, 10, 20, 50];
function WeakSpotQuiz() {
  var ctx = useApp();
  var files = ctx.files,
    attempts = ctx.attempts,
    stateRev = ctx.stateRev;
  var _useState82 = useState(10),
    count = _useState82[0],
    setCount = _useState82[1];
  var weak = useMemo(function () {
    var gates = storage.get(KEYS.lessonGates, {}) || {};
    var fileById = {};
    for (var _iterator60 = _createForOfIteratorHelperLoose(files), _step60; !(_step60 = _iterator60()).done;) {
      var f = _step60.value;
      fileById[f.file_id] = f;
    }
    var stat = {};
    for (var _iterator61 = _createForOfIteratorHelperLoose(attempts), _step61; !(_step61 = _iterator61()).done;) {
      var _gates$_f$chapter_id;
      var a = _step61.value;
      var _f = fileById[a.file_id];
      if (!_f || !_f.chapter_id || !((_gates$_f$chapter_id = gates[_f.chapter_id]) != null && _gates$_f$chapter_id.mastered)) continue;
      var s = stat[a.file_id] || (stat[a.file_id] = {
        fid: a.file_id,
        correct: 0,
        total: 0,
        chapter: _f.chapter,
        subject: _f.subject
      });
      s.total++;
      if (a.correct) s.correct++;
    }
    return Object.values(stat).filter(function (s) {
      return s.total > 0;
    }).map(function (s) {
      return _extends({}, s, {
        acc: s.correct / s.total
      });
    }).sort(function (a, b) {
      return a.acc - b.acc;
    });
  }, [files, attempts, stateRev]);
  var weights = useMemo(function () {
    var w = {};
    for (var _iterator62 = _createForOfIteratorHelperLoose(weak), _step62; !(_step62 = _iterator62()).done;) {
      var c = _step62.value;
      w[c.fid] = Math.max(0.0001, 1 - c.acc);
    }
    return w;
  }, [weak]);
  var available = useMemo(function () {
    if (!weak.length) return 0;
    return buildPool(ctx, 'mc', {
      fileIds: new Set(weak.map(function (c) {
        return c.fid;
      }))
    }).length;
  }, [weak, ctx]);
  var start = function start() {
    var total = Math.min(count, available);
    if (total <= 0) return;
    var want = allocateCounts(weights, total);
    var chosen = [];
    var used = new Set();
    for (var _iterator63 = _createForOfIteratorHelperLoose(weak), _step63; !(_step63 = _iterator63()).done;) {
      var c = _step63.value;
      var n = want[c.fid] || 0;
      if (n <= 0) continue;
      var pool = buildPool(ctx, 'mc', {
        fileIds: new Set([c.fid])
      }).filter(function (x) {
        return !used.has(x.id);
      });
      for (var _iterator65 = _createForOfIteratorHelperLoose(shuffle(pool).slice(0, n)), _step65; !(_step65 = _iterator65()).done;) {
        var _p = _step65.value;
        chosen.push(_p);
        used.add(_p.id);
      }
    }
    if (chosen.length < total) {
      var rest = buildPool(ctx, 'mc', {
        fileIds: new Set(weak.map(function (c) {
          return c.fid;
        }))
      }).filter(function (x) {
        return !used.has(x.id);
      });
      var extra = weightedSample(rest, function (it) {
        return weights[it.file_id] || 0.0001;
      }, Math.min(total - chosen.length, rest.length));
      for (var _iterator64 = _createForOfIteratorHelperLoose(extra), _step64; !(_step64 = _iterator64()).done;) {
        var p = _step64.value;
        chosen.push(p);
        used.add(p.id);
      }
    }
    var items = shuffle(chosen).slice(0, total);
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
      detail: {
        items
      }
    }));
  };
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-4"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Target your weak spots"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "A quiz weighted toward your lowest-accuracy mastered chapters \u2014 the worse you score in a chapter, the more of its questions show up here.")), weak.length === 0 ? React.createElement("div", {
    className: "text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg p-3"
  }, "No eligible chapters yet. Master a chapter (in the Lessons tab) and answer some of its questions \u2014 your weakest mastered chapters will show up here.") : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "space-y-1.5"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Pulling mostly from"), weak.slice(0, 4).map(function (c) {
    return React.createElement("div", {
      key: c.fid,
      className: "flex items-center justify-between gap-3 text-sm"
    }, React.createElement("span", {
      className: "text-[var(--text)] truncate"
    }, c.chapter), React.createElement("span", {
      className: "shrink-0 font-medium " + (c.acc < 0.6 ? 'text-[var(--danger-text)]' : c.acc < 0.8 ? 'text-[var(--warning-text-strong)]' : 'text-[var(--text-muted)]')
    }, Math.round(c.acc * 100), "%"));
  }), weak.length > 4 && React.createElement("div", {
    className: "text-xs text-[var(--text-faint)]"
  }, "+", weak.length - 4, " more mastered chapter", weak.length - 4 === 1 ? '' : 's', " (fewer questions each)")), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Questions"), React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, WEAK_SPOT_COUNTS.map(function (n) {
    return React.createElement("button", {
      key: n,
      onClick: function onClick() {
        return setCount(n);
      },
      className: "text-sm py-2 rounded border " + (count === n ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]' : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]')
    }, n);
  }))), React.createElement("button", {
    onClick: start,
    disabled: available === 0,
    className: "w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2.5 text-sm font-medium"
  }, available === 0 ? 'No questions available' : "Start " + Math.min(count, available) + "-question weak-spot quiz")));
}
var FREE_PASSAGE_SECTIONS = [{
  key: 'cp',
  label: 'C/P',
  title: 'Chemical and Physical',
  url: 'https://www.khanacademy.org/test-prep/mcat/physical-sciences-practice',
  subjects: ['General Chemistry', 'Chemistry', 'Organic Chemistry', 'Physics', 'Physics and Math']
}, {
  key: 'bb',
  label: 'B/B',
  title: 'Biological and Biochemical',
  url: 'https://www.khanacademy.org/test-prep/mcat/biological-sciences-practice',
  subjects: ['Biology', 'Biochemistry']
}, {
  key: 'ps',
  label: 'P/S',
  title: 'Psychological and Social',
  url: 'https://www.khanacademy.org/test-prep/mcat/social-sciences-practice',
  subjects: ['Behavioral Science', 'Psychology', 'Sociology']
}, {
  key: 'cars',
  label: 'CARS',
  title: 'Critical Analysis and Reasoning',
  url: 'https://www.khanacademy.org/test-prep/mcat/critical-analysis-and-reasoning-skills-practice-questions',
  subjects: ['CARS']
}];
function FreePassagePractice() {
  var _useApp9 = useApp(),
    attempts = _useApp9.attempts;
  var _useState83 = useState(function () {
      return storage.get('mcat:freePassageSection', '');
    }),
    selectedKey = _useState83[0],
    setSelectedKey = _useState83[1];
  var sectionStats = useMemo(function () {
    return FREE_PASSAGE_SECTIONS.map(function (section) {
      var subjects = new Set(section.subjects);
      var scoped = attempts.filter(function (a) {
        return subjects.has(a.subject);
      });
      var correct = scoped.filter(function (a) {
        return a.correct;
      }).length;
      return _extends({}, section, {
        correct,
        total: scoped.length,
        acc: scoped.length ? correct / scoped.length : null
      });
    });
  }, [attempts]);
  var recommended = useMemo(function () {
    var withData = sectionStats.filter(function (s) {
      return s.total >= 5;
    });
    if (withData.length) return withData.slice().sort(function (a, b) {
      return a.acc - b.acc || b.total - a.total;
    })[0];
    var day = Math.floor(Date.now() / 86400000);
    return sectionStats[day % sectionStats.length] || sectionStats[0];
  }, [sectionStats]);
  var selected = sectionStats.find(function (s) {
    return s.key === selectedKey;
  }) || recommended || sectionStats[0];
  var pick = function pick(key) {
    setSelectedKey(key);
    storage.set('mcat:freePassageSection', key);
  };
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 flex-wrap"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Free passage practice"), React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-1"
  }, "Khan Academy blocks embedded frames, so launch the selected practice page directly.")), React.createElement("button", {
    onClick: function onClick() {
      return pick(recommended.key);
    },
    className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
  }, "Recommended: ", recommended.label)), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
  }, sectionStats.map(function (section) {
    return React.createElement("button", {
      key: section.key,
      onClick: function onClick() {
        return pick(section.key);
      },
      className: "text-left border rounded-lg px-3 py-2 " + (selected.key === section.key ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]' : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]')
    }, React.createElement("div", {
      className: "text-sm font-semibold"
    }, section.label), React.createElement("div", {
      className: "text-[11px] " + (selected.key === section.key ? 'text-white/80' : 'text-[var(--text-faint)]')
    }, section.acc == null ? 'No local stats yet' : section.correct + "/" + section.total + " correct"));
  })), React.createElement("div", {
    className: "flex items-center justify-between gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-elev-soft)] px-3 py-2"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-sm font-medium text-[var(--text-strong)] truncate"
  }, selected.label, ": ", selected.title), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] truncate"
  }, selected.url)), React.createElement("a", {
    href: selected.url,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
  }, "Open tab")));
}
function StudyView() {
  var _useState84 = useState('launcher'),
    phase = _useState84[0],
    setPhase = _useState84[1];
  var _useState85 = useState([]),
    items = _useState85[0],
    setItems = _useState85[1];
  var _useState86 = useState([]),
    flashItems = _useState86[0],
    setFlashItems = _useState86[1];
  var _useState87 = useState([]),
    results = _useState87[0],
    setResults = _useState87[1];
  var _useState88 = useState('0:00'),
    elapsedTime = _useState88[0],
    setElapsedTime = _useState88[1];
  var timerRefHolder = useRef(null);
  var start = function start(picked) {
    setItems(picked);
    setResults([]);
    setElapsedTime('0:00');
    setPhase('active');
  };
  var startFlashcards = function startFlashcards(cards) {
    setFlashItems(cards);
    setPhase('flashcards');
  };
  useEffect(function () {
    var onLaunch = function onLaunch(e) {
      var _e$detail;
      var picked = (_e$detail = e.detail) == null ? void 0 : _e$detail.items;
      if (Array.isArray(picked) && picked.length) start(picked);
    };
    window.addEventListener('mcat:startQuiz', onLaunch);
    return function () {
      return window.removeEventListener('mcat:startQuiz', onLaunch);
    };
  }, []);
  var end = function end(r, time) {
    setResults(r);
    setElapsedTime(time || '0:00');
    setPhase('summary');
  };
  var restart = function restart() {
    setItems([]);
    setResults([]);
    setPhase('launcher');
    timerRefHolder.current = null;
  };
  var drillMisses = function drillMisses() {
    var missedItems = results.filter(function (r) {
      return !r.correct;
    }).map(function (r) {
      return r.item;
    });
    setItems(shuffle(missedItems));
    setResults([]);
    setPhase('active');
    timerRefHolder.current = null;
  };
  useEffect(function () {
    var _document$getElementB;
    var wrapper = (_document$getElementB = document.getElementById('study-view-root')) == null ? void 0 : _document$getElementB.parentElement;
    if (!wrapper) return;
    var observer = new MutationObserver(function () {
      var _timerRefHolder$curre;
      if (!((_timerRefHolder$curre = timerRefHolder.current) != null && _timerRefHolder$curre.current)) return;
      var hidden = wrapper.style.display === 'none';
      if (hidden) timerRefHolder.current.current.pause();else timerRefHolder.current.current.resume();
    });
    observer.observe(wrapper, {
      attributes: true,
      attributeFilter: ['style']
    });
    return function () {
      return observer.disconnect();
    };
  }, [phase]);
  var handleTimerRef = useCallback(function (ref) {
    timerRefHolder.current = ref;
  }, []);
  if (phase === 'launcher') return React.createElement("div", {
    className: "space-y-5"
  }, React.createElement(MiniExamCard, null), React.createElement(FreePassagePractice, null), React.createElement(QuizLauncher, {
    onStart: start,
    onStartFlashcards: startFlashcards
  }), React.createElement(WeakSpotQuiz, null));
  if (phase === 'flashcards') {
    return React.createElement(FlashcardReview, {
      cards: flashItems,
      onExit: function onExit() {
        setFlashItems([]);
        setPhase('launcher');
      }
    });
  }
  if (phase === 'active') {
    var _items$;
    return React.createElement("div", {
      id: "study-view-root"
    }, React.createElement(ErrorBoundary, {
      key: (_items$ = items[0]) == null ? void 0 : _items$.id
    }, React.createElement(QuizRunner, {
      items: items,
      onExit: end,
      onPause: handleTimerRef
    })));
  }
  return React.createElement(QuizSummary, {
    results: results,
    elapsedTime: elapsedTime,
    onRestart: restart,
    onDrillMisses: drillMisses
  });
}
var BIRD_GAP = 5;
var BIRD_SHIFT = 4;
function BirdHero(_ref68) {
  var username = _ref68.username,
    quote = _ref68.quote;
  return React.createElement("div", {
    className: "relative bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl px-4 sm:px-6 pt-5 sm:pt-6 pb-0 overflow-hidden"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Welcome back"), React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-bold text-[var(--text-strong)] mb-3"
  }, "@", username), React.createElement("div", {
    className: "relative w-[78%] sm:w-[62%] max-w-md",
    style: {
      zIndex: 10
    }
  }, React.createElement("div", {
    className: "bg-[var(--bg-elev)] border border-[var(--border-soft)] rounded-2xl rounded-br-none px-4 py-3 sm:px-5 sm:py-4 text-[var(--text)] text-sm sm:text-base leading-relaxed"
  }, quote)), React.createElement("img", {
    src: "assets/bird.png",
    alt: "",
    draggable: "false",
    className: "block select-none pointer-events-none",
    style: {
      width: 'clamp(440px, 116vw, 680px)',
      maxWidth: 'none',
      marginTop: BIRD_GAP + "px",
      position: 'relative',
      right: BIRD_SHIFT + "px",
      zIndex: 0
    }
  }));
}
function HomeActivity() {
  var _useApp0 = useApp(),
    api = _useApp0.api,
    session = _useApp0.session;
  var _useState89 = useState(null),
    rows = _useState89[0],
    setRows = _useState89[1];
  var _useState90 = useState(''),
    err = _useState90[0],
    setErr = _useState90[1];
  var _useState91 = useState(0),
    tick = _useState91[0],
    setTick = _useState91[1];
  useEffect(function () {
    var cancelled = false;
    api.activity().then(function (d) {
      if (!cancelled) setRows(d.activity || []);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api, tick]);
  useEffect(function () {
    var t = setInterval(function () {
      return setTick(function (x) {
        return x + 1;
      });
    }, 45 * 1000);
    return function () {
      return clearInterval(t);
    };
  }, []);
  if (err) return null;
  if (!rows) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
    }, React.createElement("h2", {
      className: "font-semibold text-[var(--text-strong)] mb-1"
    }, "Who's in the app"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)]"
    }, "Loading\u2026"));
  }
  var ONLINE_WINDOW = 5 * 60 * 1000;
  var STUDYING_WINDOW = 5 * 60 * 1000;
  var others = rows.filter(function (r) {
    return !session || r.username !== session.username;
  }).slice(0, 8);
  if (!others.length) return null;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)] mb-2"
  }, "Who's in the app"), React.createElement("ul", {
    className: "divide-y divide-[var(--border-soft)]"
  }, others.map(function (r) {
    var online = r.ts && Date.now() - r.ts < ONLINE_WINDOW;
    var studyingNow = r.attempt_ts && Date.now() - r.attempt_ts < STUDYING_WINDOW;
    var status = studyingNow ? r.subject || 'studying' : online ? 'online' : r.subject ? "last: " + r.subject : 'offline';
    return React.createElement("li", {
      key: r.username,
      className: "py-2 flex items-center gap-3"
    }, React.createElement("div", {
      className: "w-2 h-2 rounded-full shrink-0",
      style: {
        background: online ? 'var(--success-border)' : 'var(--text-fainter)'
      },
      title: online ? 'online' : 'offline'
    }), React.createElement("div", {
      className: "min-w-0 flex-1"
    }, React.createElement("div", {
      className: "text-sm text-[var(--text)] truncate"
    }, React.createElement("span", {
      className: "font-medium"
    }, "@", r.username), React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, " \xB7 ", status)), studyingNow && r.chapter && React.createElement("div", {
      className: "text-xs text-[var(--text-faint)] truncate"
    }, r.chapter)), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)] shrink-0"
    }, relativeTime(r.ts)));
  })));
}
function CarsQuestion(_ref69) {
  var q = _ref69.q,
    index = _ref69.index,
    picked = _ref69.picked,
    onPick = _ref69.onPick,
    reveal = _ref69.reveal;
  var letters = ['A', 'B', 'C', 'D'];
  var noPick = picked == null;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3"
  }, React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, React.createElement("span", {
    className: "text-[var(--text-faint)] font-mono text-sm shrink-0"
  }, index + 1, "."), React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--accent-text)]"
  }, q.category, q.subtype ? " \xB7 " + q.subtype : ''), React.createElement("p", {
    className: "text-sm sm:text-base leading-relaxed text-[var(--text)] mt-0.5"
  }, q.question))), React.createElement("div", {
    className: "space-y-2"
  }, q.choices.map(function (c, i) {
    var cls;
    if (reveal) {
      if (i === q.correct_index) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';else if (i === picked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';else cls = 'border-[var(--border-soft)] opacity-60';
    } else {
      cls = i === picked ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
    }
    return React.createElement("button", {
      key: i,
      onClick: function onClick() {
        if (!reveal) onPick(i);
      },
      disabled: reveal,
      "data-no-haptic": true,
      className: "w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors " + cls
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] mr-2"
    }, letters[i], "."), c);
  })), reveal && React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 space-y-2"
  }, React.createElement("div", {
    className: noPick ? 'text-[var(--text-muted)] font-medium text-sm' : picked === q.correct_index ? 'text-[var(--success-text)] font-medium text-sm' : 'text-[var(--danger-text)] font-medium text-sm'
  }, noPick ? "Answer: " + letters[q.correct_index] : picked === q.correct_index ? 'Correct' : "Incorrect \u2014 answer is " + letters[q.correct_index] + ", you chose " + letters[picked]), React.createElement("div", {
    className: "text-sm text-[var(--text)]"
  }, q.explanation), Array.isArray(q.choice_explanations) && q.choice_explanations.length > 0 && React.createElement("ul", {
    className: "space-y-1 pt-1 border-t border-[var(--border-soft)]"
  }, q.choice_explanations.map(function (ce, i) {
    return React.createElement("li", {
      key: i,
      className: "text-xs text-[var(--text-muted)]"
    }, React.createElement("span", {
      className: "font-medium " + (i === q.correct_index ? 'text-[var(--success-text)]' : 'text-[var(--text-faint)]')
    }, letters[i], "."), " ", ce);
  }))));
}
function downloadCarsPdf(_ref70) {
  var date = _ref70.date,
    payload = _ref70.payload,
    questions = _ref70.questions,
    picks = _ref70.picks,
    score = _ref70.score,
    elapsedMs = _ref70.elapsedMs;
  var letters = ['A', 'B', 'C', 'D'];
  var esc = function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
      }[c];
    });
  };
  var total = questions.length;
  var timeStr = elapsedMs ? function () {
    var s = Math.floor(elapsedMs / 1000);
    return " \xB7 " + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, '0');
  }() : '';
  var passageHtml = String(payload.passage || '').split(/\n\s*\n/).map(function (p) {
    return "<p>" + esc(p.trim()) + "</p>";
  }).join('');
  var questionsHtml = questions.map(function (q, i) {
    var picked = picks[q.id];
    var correct = q.correct_index;
    var isCorrect = picked === correct;
    var choices = (q.choices || []).map(function (c, ci) {
      var tags = [];
      if (ci === correct) tags.push('correct answer');
      if (ci === picked) tags.push('your answer');
      var tag = tags.length ? " <span class=\"tag\">(" + tags.join(', ') + ")</span>" : '';
      var cls = ci === correct ? 'correct' : ci === picked ? 'wrong' : '';
      return "<li class=\"" + cls + "\"><strong>" + letters[ci] + ".</strong> " + esc(c) + tag + "</li>";
    }).join('');
    var verdict = picked == null ? "Not answered \u2014 correct answer is " + letters[correct] + "." : isCorrect ? "Correct (you chose " + letters[picked] + ")." : "Incorrect \u2014 you chose " + letters[picked] + "; correct answer is " + letters[correct] + ".";
    var choiceExpl = Array.isArray(q.choice_explanations) && q.choice_explanations.length ? "<ul class=\"cexpl\">" + q.choice_explanations.map(function (ce, ci) {
      return "<li><strong>" + letters[ci] + ".</strong> " + esc(ce) + "</li>";
    }).join('') + "</ul>" : '';
    return "<section class=\"q\">\n      <div class=\"qmeta\">Question " + (i + 1) + (q.category ? " \xB7 " + esc(q.category) : '') + (q.subtype ? " \xB7 " + esc(q.subtype) : '') + "</div>\n      <p class=\"qtext\">" + esc(q.question) + "</p>\n      <ul class=\"choices\">" + choices + "</ul>\n      <p class=\"verdict " + (isCorrect ? 'ok' : picked == null ? '' : 'bad') + "\">" + verdict + "</p>\n      " + (q.explanation ? "<p class=\"expl\"><strong>Explanation.</strong> " + esc(q.explanation) + "</p>" : '') + "\n      " + choiceExpl + "\n    </section>";
  }).join('');
  var heading = esc(payload.title || payload.discipline || 'CARS passage');
  var sub = "" + esc(date) + (payload.discipline ? " \xB7 " + esc(payload.discipline) : '') + (payload.source ? " \xB7 " + esc(payload.source) : '');
  var html = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">\n<title>MCAT CARS \u2014 " + esc(date) + "</title>\n<style>\n  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }\n  @page { margin: 18mm 16mm; }\n  body { font: 12pt/1.5 Georgia, 'Times New Roman', serif; color: #111; max-width: 720px; margin: 0 auto; padding: 24px; }\n  h1 { font-size: 19pt; margin: 0 0 2px; }\n  .sub { color: #555; font-size: 10pt; margin-bottom: 4px; }\n  .score { font-size: 12pt; font-weight: bold; margin: 8px 0 18px; }\n  h2 { font-size: 13pt; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 22px 0 10px; }\n  .passage p { margin: 0 0 10px; }\n  section.q { margin: 0 0 18px; padding: 12px 14px; border: 1px solid #ddd; border-radius: 6px; break-inside: avoid; }\n  .qmeta { font-size: 9pt; text-transform: uppercase; letter-spacing: .04em; color: #777; margin-bottom: 4px; }\n  .qtext { font-weight: bold; margin: 0 0 8px; }\n  ul.choices { list-style: none; padding: 0; margin: 0 0 8px; }\n  ul.choices li { padding: 4px 8px; margin: 2px 0; border-radius: 4px; }\n  ul.choices li.correct { background: #d7f4dd; }\n  ul.choices li.wrong { background: #fbdada; }\n  .tag { font-style: italic; color: #555; font-size: 10pt; }\n  .verdict { font-size: 10.5pt; font-weight: bold; margin: 6px 0; }\n  .verdict.ok { color: #1a7f37; }\n  .verdict.bad { color: #b42318; }\n  .expl { font-size: 11pt; margin: 6px 0; }\n  ul.cexpl { font-size: 10pt; color: #444; padding-left: 18px; margin: 6px 0 0; }\n  ul.cexpl li { margin: 2px 0; }\n  .foot { color: #999; font-size: 9pt; margin-top: 24px; text-align: center; }\n</style></head>\n<body>\n  <h1>" + heading + "</h1>\n  <div class=\"sub\">Daily CARS \xB7 " + sub + "</div>\n  <div class=\"score\">Score: " + score + "/" + total + timeStr + "</div>\n  <h2>Passage</h2>\n  <div class=\"passage\">" + passageHtml + "</div>\n  <h2>Questions &amp; Answers</h2>\n  " + questionsHtml + "\n  <div class=\"foot\">MCAT Study \u2014 exported " + esc(new Date().toLocaleString()) + "</div>\n</body></html>";
  var frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:0;border:0;';
  document.body.appendChild(frame);
  var doc = frame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  var win = frame.contentWindow;
  var fired = false;
  var go = function go() {
    if (fired) return;
    fired = true;
    try {
      win.focus();
      win.print();
    } catch (e) {}
    setTimeout(function () {
      return frame.remove();
    }, 2000);
  };
  if (doc.readyState === 'complete') setTimeout(go, 200);else {
    win.onload = function () {
      return setTimeout(go, 200);
    };
    setTimeout(go, 800);
  }
}
function CarsRunner(_ref71) {
  var date = _ref71.date,
    payload = _ref71.payload,
    onClose = _ref71.onClose,
    alreadyDone = _ref71.alreadyDone;
  var _useApp1 = useApp(),
    addAttempt = _useApp1.addAttempt,
    flushSync = _useApp1.flushSync;
  var questions = payload.questions || [];
  var savedResult = alreadyDone ? getCarsResults()[date] || null : null;
  var _useState92 = useState(function () {
      return savedResult && savedResult.picks || {};
    }),
    picks = _useState92[0],
    setPicks = _useState92[1];
  var _useState93 = useState(alreadyDone ? 'review' : 'attempt'),
    phase = _useState93[0],
    setPhase = _useState93[1];
  var finalizedRef = useRef(false);
  var scrollRef = useRef(null);
  var _useState94 = useState(0),
    elapsedMs = _useState94[0],
    setElapsedMs = _useState94[1];
  var startRef = useRef(null);
  useEffect(function () {
    if (phase !== 'attempt') {
      startRef.current = null;
      return;
    }
    if (startRef.current == null) startRef.current = Date.now() - elapsedMs;
    var id = setInterval(function () {
      setElapsedMs(Date.now() - startRef.current);
    }, 500);
    return function () {
      return clearInterval(id);
    };
  }, [phase]);
  var timerDisplay = function () {
    var s = Math.floor(elapsedMs / 1000);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + String(r).padStart(2, '0');
  }();
  var answeredCount = Object.keys(picks).length;
  var allAnswered = answeredCount === questions.length && questions.length > 0;
  var computedScore = questions.reduce(function (n, q) {
    return n + (picks[q.id] === q.correct_index ? 1 : 0);
  }, 0);
  var score = answeredCount === 0 && savedResult ? savedResult.score || 0 : computedScore;
  var missed = questions.length - score;
  var pick = function pick(q, i) {
    if (phase !== 'attempt') return;
    sfxTap();
    vibrateTap();
    setPicks(function (p) {
      return _extends({}, p, {
        [q.id]: i
      });
    });
  };
  var scrollTop = function scrollTop() {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };
  var submit = function submit() {
    if (!allAnswered) return;
    if (score === questions.length) {
      playSfx('correct');
      vibrateCorrect();
    } else {
      playSfx('wrong');
      vibrateWrong();
    }
    setPhase('graded');
    scrollTop();
    if (!finalizedRef.current && !alreadyDone) {
      finalizedRef.current = true;
      var firstScore = score;
      var firstPicks = _extends({}, picks);
      questions.forEach(function (q) {
        addAttempt({
          question_id: q.id,
          mode: 'mc',
          file_id: "cars_" + date,
          chapter: "Daily CARS \u2014 " + date,
          subject: 'CARS',
          correct: firstPicks[q.id] === q.correct_index,
          user_answer: ['A', 'B', 'C', 'D'][firstPicks[q.id]] || ''
        });
      });
      setCarsResult(date, {
        score: firstScore,
        total: questions.length,
        completed_at: Date.now(),
        picks: firstPicks
      });
      window.dispatchEvent(new Event('mcat:carsDone'));
      setTimeout(function () {
        try {
          flushSync();
        } catch (_unused34) {}
      }, 120);
    }
  };
  var retry = function retry() {
    setElapsedMs(0);
    startRef.current = null;
    setPhase('attempt');
    scrollTop();
  };
  var goReview = function goReview() {
    setPhase('review');
    scrollTop();
  };
  var exportPdf = function exportPdf() {
    return downloadCarsPdf({
      date,
      payload,
      questions,
      picks,
      score,
      elapsedMs
    });
  };
  useEffect(function () {
    var prevBodyOverflow = document.body.style.overflow;
    var prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);
  return React.createElement("div", {
    ref: scrollRef,
    className: "fixed inset-x-0 bottom-0 z-50 bg-[var(--bg)] overflow-y-auto",
    style: {
      top: 'var(--mcat-header-h, 56px)',
      marginTop: 0
    }
  }, React.createElement("div", {
    className: "sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border-soft)] px-3 sm:px-6 py-2"
  }, React.createElement("div", {
    className: "max-w-3xl mx-auto flex items-center justify-between gap-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Daily CARS \xB7 ", date), React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)] truncate"
  }, payload.title || payload.discipline || 'CARS passage')), React.createElement("div", {
    className: "flex items-center gap-2 shrink-0"
  }, phase === 'attempt' && React.createElement(React.Fragment, null, React.createElement("span", {
    className: "text-xs font-mono text-[var(--text-muted)] tabular-nums",
    title: "Time spent on this passage"
  }, "\u23F1 ", timerDisplay), React.createElement("span", {
    className: "text-xs font-mono text-[var(--text-muted)]"
  }, answeredCount, "/", questions.length)), phase === 'graded' && React.createElement("span", {
    className: "text-xs font-mono text-[var(--text-muted)] tabular-nums",
    title: "Time spent"
  }, "\u23F1 ", timerDisplay), phase === 'review' && React.createElement("span", {
    className: "text-xs font-mono text-[var(--text-muted)]"
  }, score, "/", questions.length), React.createElement("button", {
    onClick: onClose,
    className: "text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Close")))), React.createElement("div", {
    className: "max-w-3xl mx-auto p-3 sm:p-6 space-y-4"
  }, phase === 'graded' ? React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-center space-y-3"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Your score"), React.createElement("div", {
    className: "text-5xl font-bold text-[var(--text-strong)]"
  }, score, "/", questions.length), score === questions.length ? React.createElement(React.Fragment, null, React.createElement("p", {
    className: "text-sm text-[var(--success-text)]"
  }, "Perfect \u2014 every one. These are tuned harder than the real exam."), React.createElement("button", {
    onClick: goReview,
    className: "text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, "Review answers")) : React.createElement(React.Fragment, null, React.createElement("p", {
    className: "text-sm text-[var(--text-muted)]"
  }, missed, " wrong. Go back and fix what you can before the answers are revealed \u2014 or review now to see them."), React.createElement("div", {
    className: "flex gap-2 justify-center"
  }, React.createElement("button", {
    onClick: retry,
    className: "text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, "Retry"), React.createElement("button", {
    onClick: goReview,
    className: "text-sm px-4 py-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg"
  }, "Review answers"))), React.createElement("div", {
    className: "pt-1"
  }, React.createElement("button", {
    onClick: exportPdf,
    className: "text-xs px-3 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]"
  }, "Download PDF"))) : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-6"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-faint)] mb-2"
  }, payload.discipline, payload.source ? " \xB7 " + payload.source : ''), String(payload.passage || '').split(/\n\s*\n/).map(function (para, i) {
    return React.createElement("p", {
      key: i,
      className: "text-sm sm:text-base leading-relaxed text-[var(--text)] mb-3 last:mb-0"
    }, para.trim());
  })), phase === 'review' && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 text-center"
  }, React.createElement("span", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Score: "), React.createElement("span", {
    className: "text-lg font-bold text-[var(--text-strong)]"
  }, score, "/", questions.length)), questions.map(function (q, i) {
    return React.createElement(CarsQuestion, {
      key: q.id,
      q: q,
      index: i,
      picked: picks[q.id] != null ? picks[q.id] : null,
      onPick: function onPick(idx) {
        return pick(q, idx);
      },
      reveal: phase === 'review'
    });
  }), phase === 'attempt' && React.createElement("button", {
    onClick: submit,
    disabled: !allAnswered,
    className: "w-full text-sm py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg font-semibold"
  }, allAnswered ? 'Submit answers' : "Answer all " + questions.length + " to submit (" + answeredCount + "/" + questions.length + ")"), phase === 'review' && React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: exportPdf,
    className: "flex-1 text-sm py-3 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg font-medium"
  }, "Download PDF"), React.createElement("button", {
    onClick: onClose,
    className: "flex-1 text-sm py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, "Done")))));
}
function DailyCarsSlotCard(_ref72) {
  var _payload$questions;
  var date = _ref72.date,
    slot = _ref72.slot;
  var _useApp10 = useApp(),
    api = _useApp10.api,
    client = _useApp10.client,
    apiKey = _useApp10.apiKey,
    session = _useApp10.session;
  var slotLabel = carsSlotLabel(slot);
  var baseDate = carsBaseDate(date);
  var localOnly = carsSlotFor(date) > 1;
  var cached = getCarsCachePayload(date);
  var _useState95 = useState(cached ? 'ready' : 'loading'),
    state = _useState95[0],
    setState = _useState95[1];
  var _useState96 = useState(cached),
    payload = _useState96[0],
    setPayload = _useState96[1];
  var _useState97 = useState(''),
    err = _useState97[0],
    setErr = _useState97[1];
  var _useState98 = useState(false),
    running = _useState98[0],
    setRunning = _useState98[1];
  var _useState99 = useState(0),
    tick = _useState99[0],
    setTick = _useState99[1];
  var result = getCarsResults()[date];
  useEffect(function () {
    var cancelled = false;
    if (!getCarsCachePayload(date)) {
      setState('loading');
    }
    setErr('');
    (localOnly ? Promise.reject({
      status: 404
    }) : api.getCars(baseDate)).then(function (d) {
      if (!cancelled) {
        setCarsCachePayload(date, d.payload);
        setPayload(d.payload);
        setState('ready');
      }
    }).catch(function () {
      var _ref73 = _asyncToGenerator(_regenerator().m(function _callee42(e) {
        var fallback, _gen, gen, src, questions, discipline, d2, _t27, _t28, _t29;
        return _regenerator().w(function (_context47) {
          while (1) switch (_context47.p = _context47.n) {
            case 0:
              if (!cancelled) {
                _context47.n = 1;
                break;
              }
              return _context47.a(2);
            case 1:
              if (!(e.status !== 404)) {
                _context47.n = 3;
                break;
              }
              fallback = getCarsCachePayload(date);
              if (!fallback) {
                _context47.n = 2;
                break;
              }
              setPayload(fallback);
              setState('ready');
              return _context47.a(2);
            case 2:
              setErr(e.message);
              setState('error');
              return _context47.a(2);
            case 3:
              if (!(!apiKey || !session)) {
                _context47.n = 4;
                break;
              }
              setState('unavailable');
              return _context47.a(2);
            case 4:
              setState('generating');
              _context47.p = 5;
              gen = null;
              _context47.p = 6;
              _context47.n = 7;
              return localOnly ? Promise.reject({
                status: 404
              }) : api.getCarsPassage(baseDate);
            case 7:
              src = _context47.v;
              if (!(src != null && src.passage)) {
                _context47.n = 9;
                break;
              }
              _context47.n = 8;
              return client.generateCarsQuestions(src.passage, src.discipline);
            case 8:
              questions = _context47.v;
              if (questions != null && questions.length) {
                gen = {
                  passage: src.passage,
                  discipline: src.discipline,
                  title: src.title,
                  source: src.source,
                  questions
                };
              }
            case 9:
              _context47.n = 11;
              break;
            case 10:
              _context47.p = 10;
              _t27 = _context47.v;
            case 11:
              if (gen) {
                _context47.n = 13;
                break;
              }
              discipline = carsDisciplineFor(date, slot);
              _context47.n = 12;
              return client.generateDailyCars(discipline);
            case 12:
              gen = _context47.v;
            case 13:
              if ((_gen = gen) != null && (_gen = _gen.questions) != null && _gen.length) {
                _context47.n = 14;
                break;
              }
              throw new Error('Generation returned no questions.');
            case 14:
              _context47.n = 15;
              return api.postCars({
                date,
                discipline: gen.discipline || carsDisciplineFor(date, slot),
                title: gen.title || '',
                payload: gen
              });
            case 15:
              if (!cancelled) {
                setCarsCachePayload(date, gen);
                setPayload(gen);
                setState('ready');
              }
              _context47.n = 22;
              break;
            case 16:
              _context47.p = 16;
              _t28 = _context47.v;
              _context47.p = 17;
              _context47.n = 18;
              return localOnly ? Promise.reject({
                status: 404
              }) : api.getCars(baseDate);
            case 18:
              d2 = _context47.v;
              if (cancelled) {
                _context47.n = 19;
                break;
              }
              setCarsCachePayload(date, d2.payload);
              setPayload(d2.payload);
              setState('ready');
              return _context47.a(2);
            case 19:
              _context47.n = 21;
              break;
            case 20:
              _context47.p = 20;
              _t29 = _context47.v;
            case 21:
              if (!cancelled) {
                setErr(_t28.message);
                setState('error');
              }
            case 22:
              return _context47.a(2);
          }
        }, _callee42, null, [[17, 20], [6, 10], [5, 16]]);
      }));
      return function (_x58) {
        return _ref73.apply(this, arguments);
      };
    }());
    return function () {
      cancelled = true;
    };
  }, [api, date, slot, tick, apiKey, session]);
  var card = function card(inner) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
    }, inner);
  };
  if (state === 'loading') return card(React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Checking today's CARS\u2026"));
  if (state === 'generating') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily CARS \xB7 ", slotLabel), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Generating today's passage with Gemini \u2014 about 20 seconds\u2026")));
  if (state === 'unavailable') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily CARS \xB7 ", slotLabel), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Today's CARS hasn't been generated yet. It appears once someone signed in with a Gemini API key opens the app.")));
  if (state === 'error') return card(React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily CARS \xB7 ", slotLabel), React.createElement("button", {
    onClick: function onClick() {
      return setTick(function (t) {
        return t + 1;
      });
    },
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Retry")), React.createElement("p", {
    className: "text-sm text-[var(--danger-text)] mt-1 break-words whitespace-pre-wrap"
  }, err)));
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "bg-[var(--bg-card)] border rounded-2xl p-4 sm:p-5 " + (result ? 'border-[var(--border-soft)]' : 'border-[var(--accent-border)]')
  }, React.createElement("div", {
    className: "flex items-start justify-between gap-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's CARS \xB7 ", slotLabel), !result && React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-[var(--danger-border)]"
  })), React.createElement("div", {
    className: "text-sm text-[var(--text)] mt-0.5"
  }, payload == null ? void 0 : payload.title), React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] mt-0.5"
  }, payload == null ? void 0 : payload.discipline, " \xB7 ", (payload == null || (_payload$questions = payload.questions) == null ? void 0 : _payload$questions.length) || 0, " questions \xB7 tuned harder than the real exam", result && React.createElement("span", {
    className: "text-[var(--success-text)]"
  }, " \xB7 done ", result.score, "/", result.total))), React.createElement("button", {
    onClick: function onClick() {
      return setRunning(true);
    },
    className: "shrink-0 text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, result ? 'Review' : 'Start'))), running && payload && React.createElement(CarsRunner, {
    date: date,
    payload: payload,
    alreadyDone: !!result,
    onClose: function onClose() {
      setRunning(false);
      setTick(function (t) {
        return t + 1;
      });
    }
  }));
}
function DailyCarsCard() {
  var today = todayStr();
  return React.createElement("div", {
    className: "space-y-3"
  }, Array.from({
    length: CARS_DAILY_COUNT
  }).map(function (_, i) {
    return React.createElement(DailyCarsSlotCard, {
      key: i + 1,
      date: carsDateKey(today, i + 1),
      slot: i + 1
    });
  }));
}
function CarsArchive() {
  var _useApp11 = useApp(),
    api = _useApp11.api;
  var _useState100 = useState(null),
    days = _useState100[0],
    setDays = _useState100[1];
  var _useState101 = useState(''),
    err = _useState101[0],
    setErr = _useState101[1];
  var _useState102 = useState(null),
    open = _useState102[0],
    setOpen = _useState102[1];
  var _useState103 = useState(null),
    loadingDate = _useState103[0],
    setLoadingDate = _useState103[1];
  var _useState104 = useState(false),
    expanded = _useState104[0],
    setExpanded = _useState104[1];
  var today = todayStr();
  var results = getCarsResults();
  useEffect(function () {
    var cancelled = false;
    api.listCars().then(function (d) {
      if (!cancelled) setDays(d.days || []);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api]);
  var openDay = function () {
    var _ref74 = _asyncToGenerator(_regenerator().m(function _callee43(date) {
      var cachedPayload, d, _t30;
      return _regenerator().w(function (_context48) {
        while (1) switch (_context48.p = _context48.n) {
          case 0:
            cachedPayload = getCarsCachePayload(date);
            if (!cachedPayload) {
              _context48.n = 1;
              break;
            }
            setOpen({
              date,
              payload: cachedPayload
            });
            return _context48.a(2);
          case 1:
            setLoadingDate(date);
            _context48.p = 2;
            _context48.n = 3;
            return api.getCars(date);
          case 3:
            d = _context48.v;
            setCarsCachePayload(date, d.payload);
            setOpen({
              date,
              payload: d.payload
            });
            _context48.n = 5;
            break;
          case 4:
            _context48.p = 4;
            _t30 = _context48.v;
            setErr(_t30.message);
          case 5:
            _context48.p = 5;
            setLoadingDate(null);
            return _context48.f(5);
          case 6:
            return _context48.a(2);
        }
      }, _callee43, null, [[2, 4, 5, 6]]);
    }));
    return function openDay(_x59) {
      return _ref74.apply(this, arguments);
    };
  }();
  var visibleDays = days && (expanded ? days : days.slice(0, 3));
  var extraCount = days ? Math.max(0, days.length - 3) : 0;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between mb-1"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily CARS archive"), days && React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, days.length, " day", days.length === 1 ? '' : 's')), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mb-3"
  }, "Every day's CARS passage. Open any one to read it and do the questions."), err && React.createElement("div", {
    className: "text-sm text-[var(--danger-text)] mb-2"
  }, err), !days && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading\u2026"), days && days.length === 0 && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "No CARS days yet \u2014 the first appears once today's is generated."), days && days.length > 0 && React.createElement("ul", {
    className: "divide-y divide-[var(--border-soft)]"
  }, visibleDays.map(function (d) {
    var r = results[d.date];
    var baseDate = carsBaseDate(d.date);
    var slot = carsSlotFor(d.date);
    return React.createElement("li", {
      key: d.date,
      className: "py-2.5 flex items-center gap-3"
    }, React.createElement("div", {
      className: "min-w-0 flex-1"
    }, React.createElement("div", {
      className: "text-sm text-[var(--text)]"
    }, React.createElement("span", {
      className: "font-medium"
    }, baseDate, baseDate === today ? ' · today' : '', slot > 1 ? " \xB7 " + carsSlotLabel(slot) : ''), d.title && React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, " \u2014 ", d.title)), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)]"
    }, d.discipline, r && React.createElement("span", {
      className: "text-[var(--success-text)]"
    }, " \xB7 done ", r.score, "/", r.total))), React.createElement("button", {
      onClick: function onClick() {
        return openDay(d.date);
      },
      disabled: loadingDate === d.date,
      className: "shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
    }, loadingDate === d.date ? 'Loading…' : r ? 'Review' : 'Open'));
  })), days && extraCount > 0 && React.createElement("button", {
    onClick: function onClick() {
      return setExpanded(function (e) {
        return !e;
      });
    },
    className: "mt-3 text-xs text-[var(--accent-text)] hover:underline"
  }, expanded ? 'Show less' : "Show " + extraCount + " more day" + (extraCount === 1 ? '' : 's')), open && open.payload && React.createElement(CarsRunner, {
    date: open.date,
    payload: open.payload,
    alreadyDone: !!results[open.date],
    onClose: function onClose() {
      return setOpen(null);
    }
  }));
}
function getConnExplain(date, category) {
  var all = storage.get('mcat:connExplain', {}) || {};
  return all[date + "::" + category] || null;
}
function setConnExplain(date, category, text) {
  var all = storage.get('mcat:connExplain', {}) || {};
  all[date + "::" + category] = text;
  storage.set('mcat:connExplain', all);
}
function getTermDefCache(term) {
  var all = storage.get('mcat:termDefs', {}) || {};
  return all[term.toLowerCase()] || null;
}
function setTermDefCache(term, def) {
  var all = storage.get('mcat:termDefs', {}) || {};
  all[term.toLowerCase()] = def;
  storage.set('mcat:termDefs', all);
}
function lookupLocalDef(term, extractions) {
  var needle = term.toLowerCase().trim();
  for (var _i22 = 0, _Object$values = Object.values(extractions || {}); _i22 < _Object$values.length; _i22++) {
    var ext = _Object$values[_i22];
    var kts = (ext == null ? void 0 : ext.key_terms) || [];
    var hit = kts.find(function (kt) {
      return (kt.term || '').toLowerCase().trim() === needle;
    });
    if (hit != null && hit.definition) return hit.definition;
  }
  return null;
}
function SolvedConnectionGroup(_ref75) {
  var group = _ref75.group,
    date = _ref75.date;
  var _useApp12 = useApp(),
    client = _useApp12.client,
    apiKey = _useApp12.apiKey,
    extractions = _useApp12.extractions;
  var c = CONNECTIONS_COLORS[group.difficulty];
  var _useState105 = useState(false),
    open = _useState105[0],
    setOpen = _useState105[1];
  var _useState106 = useState(null),
    flippedTerm = _useState106[0],
    setFlippedTerm = _useState106[1];
  var _useState107 = useState(function () {
      return getConnExplain(date, group.category);
    }),
    explain = _useState107[0],
    setExplain = _useState107[1];
  var _useState108 = useState(false),
    explainBusy = _useState108[0],
    setExplainBusy = _useState108[1];
  var _useState109 = useState(''),
    explainErr = _useState109[0],
    setExplainErr = _useState109[1];
  var _useState110 = useState(function () {
      var seed = {};
      for (var _iterator66 = _createForOfIteratorHelperLoose(group.terms), _step66; !(_step66 = _iterator66()).done;) {
        var t = _step66.value;
        seed[t] = lookupLocalDef(t, extractions) || getTermDefCache(t) || null;
      }
      return seed;
    }),
    termDefs = _useState110[0],
    setTermDefs = _useState110[1];
  var _useState111 = useState({}),
    termBusy = _useState111[0],
    setTermBusy = _useState111[1];
  var fetchExplain = useCallback(_asyncToGenerator(_regenerator().m(function _callee44() {
    var text, _t31;
    return _regenerator().w(function (_context49) {
      while (1) switch (_context49.p = _context49.n) {
        case 0:
          if (!(explain || explainBusy)) {
            _context49.n = 1;
            break;
          }
          return _context49.a(2);
        case 1:
          if (apiKey) {
            _context49.n = 2;
            break;
          }
          setExplainErr('Add a Gemini API key in Settings to load explanations.');
          return _context49.a(2);
        case 2:
          setExplainBusy(true);
          setExplainErr('');
          _context49.p = 3;
          _context49.n = 4;
          return client.generateConnectionExplanation(group.category, group.terms);
        case 4:
          text = _context49.v;
          setExplain(text);
          setConnExplain(date, group.category, text);
          _context49.n = 6;
          break;
        case 5:
          _context49.p = 5;
          _t31 = _context49.v;
          setExplainErr(_t31.message || 'Could not load explanation.');
        case 6:
          _context49.p = 6;
          setExplainBusy(false);
          return _context49.f(6);
        case 7:
          return _context49.a(2);
      }
    }, _callee44, null, [[3, 5, 6, 7]]);
  })), [client, apiKey, group.category, group.terms, date, explain, explainBusy]);
  var fetchTermDef = useCallback(function () {
    var _ref77 = _asyncToGenerator(_regenerator().m(function _callee45(term) {
      var def, _t32;
      return _regenerator().w(function (_context50) {
        while (1) switch (_context50.p = _context50.n) {
          case 0:
            if (!(termDefs[term] || termBusy[term])) {
              _context50.n = 1;
              break;
            }
            return _context50.a(2);
          case 1:
            if (apiKey) {
              _context50.n = 2;
              break;
            }
            return _context50.a(2);
          case 2:
            setTermBusy(function (b) {
              return _extends({}, b, {
                [term]: true
              });
            });
            _context50.p = 3;
            _context50.n = 4;
            return client.generateTermDefinition(term, group.category);
          case 4:
            def = _context50.v;
            setTermDefs(function (d) {
              return _extends({}, d, {
                [term]: def
              });
            });
            setTermDefCache(term, def);
            _context50.n = 6;
            break;
          case 5:
            _context50.p = 5;
            _t32 = _context50.v;
          case 6:
            _context50.p = 6;
            setTermBusy(function (b) {
              return _extends({}, b, {
                [term]: false
              });
            });
            return _context50.f(6);
          case 7:
            return _context50.a(2);
        }
      }, _callee45, null, [[3, 5, 6, 7]]);
    }));
    return function (_x60) {
      return _ref77.apply(this, arguments);
    };
  }(), [client, apiKey, group.category, termDefs, termBusy]);
  useEffect(function () {
    if (!open) return;
    fetchExplain();
    for (var _iterator67 = _createForOfIteratorHelperLoose(group.terms), _step67; !(_step67 = _iterator67()).done;) {
      var t = _step67.value;
      if (!termDefs[t]) fetchTermDef(t);
    }
  }, [open]);
  return React.createElement("div", {
    className: "rounded-xl overflow-hidden",
    style: {
      background: c.bg,
      color: c.text
    }
  }, React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setOpen(function (o) {
        return !o;
      });
    },
    className: "w-full px-4 py-3 text-center",
    "aria-expanded": open
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide font-semibold opacity-80"
  }, group.difficulty), React.createElement("div", {
    className: "font-bold text-base sm:text-lg"
  }, group.category), React.createElement("div", {
    className: "text-sm mt-0.5"
  }, group.terms.join(' · ')), React.createElement("div", {
    className: "text-[10px] mt-1 opacity-70"
  }, open ? '▾ tap to collapse' : '▸ tap for explanation and flashcards')), open && React.createElement("div", {
    className: "bg-[var(--bg-card-soft)] border-t border-black/10 px-4 py-3 space-y-3",
    style: {
      color: 'var(--text)'
    }
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1"
  }, "How they connect"), explainBusy && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading\u2026"), explainErr && !explain && React.createElement("div", {
    className: "text-sm text-[var(--text-faint)]"
  }, explainErr), explain && React.createElement("p", {
    className: "text-sm text-[var(--text)] leading-snug"
  }, explain), !explain && !explainBusy && !explainErr && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "No explanation cached.")), React.createElement("div", null, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1"
  }, "Flashcards"), React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, group.terms.map(function (t) {
    var flipped = flippedTerm === t;
    var def = termDefs[t];
    var busy = termBusy[t];
    return React.createElement("button", {
      key: t,
      type: "button",
      onClick: function onClick() {
        return setFlippedTerm(flipped ? null : t);
      },
      className: "bg-[var(--bg-elev)] border border-[var(--border-soft)] hover:bg-[var(--bg-hover)] rounded-lg px-3 py-2 text-left min-h-[68px]",
      style: {
        color: 'var(--text)'
      }
    }, flipped ? React.createElement("div", {
      className: "text-xs leading-snug"
    }, def ? def : busy ? React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, "Loading\u2026") : React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, apiKey ? 'No definition cached.' : 'Add a Gemini API key in Settings.')) : React.createElement(React.Fragment, null, React.createElement("div", {
      className: "text-sm font-semibold"
    }, t), React.createElement("div", {
      className: "text-[10px] text-[var(--text-faint)] mt-0.5"
    }, "tap to flip")));
  })))));
}
var CONNECTIONS_DIFFICULTY_ORDER = ['green', 'yellow', 'blue', 'purple'];
var CONNECTIONS_COLORS = {
  green: {
    bg: '#a0c35a',
    text: '#1a2b07'
  },
  yellow: {
    bg: '#f9df6d',
    text: '#3a2c00'
  },
  blue: {
    bg: '#b0c4ef',
    text: '#0c1d4a'
  },
  purple: {
    bg: '#ba81c5',
    text: '#2e0a3a'
  }
};
function normalizeDifficulty(d) {
  var k = (d || '').toLowerCase();
  return CONNECTIONS_COLORS[k] ? k : 'green';
}
function seededShuffle(arr, seedStr) {
  var h = 1779033703 ^ seedStr.length;
  for (var i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  var a = h >>> 0;
  var rng = function rng() {
    a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  var out = arr.slice();
  for (var _i23 = out.length - 1; _i23 > 0; _i23--) {
    var j = Math.floor(rng() * (_i23 + 1));
    var _ref78 = [out[j], out[_i23]];
    out[_i23] = _ref78[0];
    out[j] = _ref78[1];
  }
  return out;
}
function ConnectionsRunner(_ref79) {
  var date = _ref79.date,
    payload = _ref79.payload,
    onClose = _ref79.onClose,
    alreadyDone = _ref79.alreadyDone;
  var _useApp13 = useApp(),
    addAttempt = _useApp13.addAttempt,
    flushSync = _useApp13.flushSync;
  var groups = useMemo(function () {
    var list = (payload.groups || []).map(function (g) {
      return _extends({}, g, {
        difficulty: normalizeDifficulty(g.difficulty)
      });
    });
    list.sort(function (a, b) {
      return CONNECTIONS_DIFFICULTY_ORDER.indexOf(a.difficulty) - CONNECTIONS_DIFFICULTY_ORDER.indexOf(b.difficulty);
    });
    return list;
  }, [payload]);
  var termToGroup = useMemo(function () {
    var m = new Map();
    groups.forEach(function (g) {
      return g.terms.forEach(function (t) {
        return m.set(t, g);
      });
    });
    return m;
  }, [groups]);
  var allTerms = useMemo(function () {
    return groups.flatMap(function (g) {
      return g.terms;
    });
  }, [groups]);
  var savedResult = alreadyDone ? getConnectionsResults()[date] || null : null;
  var startSolved = (savedResult == null ? void 0 : savedResult.solvedCategories) || [];
  var _useState112 = useState(function () {
      return startSolved;
    }),
    solved = _useState112[0],
    setSolved = _useState112[1];
  var _useState113 = useState(function () {
      var remaining = allTerms.filter(function (t) {
        return !startSolved.some(function (cat) {
          var _groups$find;
          return (_groups$find = groups.find(function (g) {
            return g.category === cat;
          })) == null ? void 0 : _groups$find.terms.includes(t);
        });
      });
      return seededShuffle(remaining, "connections:" + date);
    }),
    order = _useState113[0],
    setOrder = _useState113[1];
  var _useState114 = useState([]),
    selected = _useState114[0],
    setSelected = _useState114[1];
  var _useState115 = useState((savedResult == null ? void 0 : savedResult.mistakes) || 0),
    mistakes = _useState115[0],
    setMistakes = _useState115[1];
  var _useState116 = useState(function () {
      if (!savedResult) return 'play';
      return savedResult.won ? 'won' : 'lost';
    }),
    phase = _useState116[0],
    setPhase = _useState116[1];
  var _useState117 = useState(''),
    message = _useState117[0],
    setMessage = _useState117[1];
  var _useState118 = useState(false),
    shaking = _useState118[0],
    setShaking = _useState118[1];
  var finalizedRef = useRef(!!savedResult);
  var solvedGroups = solved.map(function (cat) {
    return groups.find(function (g) {
      return g.category === cat;
    });
  }).filter(Boolean);
  var unsolvedGroups = groups.filter(function (g) {
    return !solved.includes(g.category);
  });
  var toggle = function toggle(term) {
    if (phase !== 'play') return;
    if (solved.some(function (cat) {
      var _groups$find2;
      return (_groups$find2 = groups.find(function (g) {
        return g.category === cat;
      })) == null ? void 0 : _groups$find2.terms.includes(term);
    })) return;
    sfxTap();
    vibrateTap();
    setMessage('');
    setSelected(function (s) {
      if (s.includes(term)) return s.filter(function (x) {
        return x !== term;
      });
      if (s.length >= 4) return s;
      return [].concat(s, [term]);
    });
  };
  var shuffle = function shuffle() {
    if (phase !== 'play') return;
    sfxTap();
    vibrateTap();
    setMessage('');
    setOrder(function (o) {
      var out = o.slice();
      for (var i = out.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref80 = [out[j], out[i]];
        out[i] = _ref80[0];
        out[j] = _ref80[1];
      }
      return out;
    });
  };
  var deselect = function deselect() {
    if (phase !== 'play') return;
    sfxTap();
    setSelected([]);
    setMessage('');
  };
  var finalize = function finalize(won, finalSolved, finalMistakes) {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    var solvedSet = new Set(finalSolved);
    groups.forEach(function (g) {
      addAttempt({
        question_id: "connections_" + date + "_" + g.category.slice(0, 40),
        mode: 'connections',
        file_id: "connections_" + date,
        chapter: "Daily Connections \u2014 " + date,
        subject: 'Connections',
        correct: solvedSet.has(g.category),
        user_answer: g.category
      });
    });
    setConnectionsResult(date, {
      won,
      solvedCategories: finalSolved,
      mistakes: finalMistakes,
      total: 4,
      completed_at: Date.now()
    });
    window.dispatchEvent(new Event('mcat:connectionsDone'));
    setTimeout(function () {
      try {
        flushSync();
      } catch (_unused38) {}
    }, 120);
  };
  var submit = function submit() {
    if (phase !== 'play' || selected.length !== 4) return;
    var cats = selected.map(function (t) {
      var _termToGroup$get;
      return (_termToGroup$get = termToGroup.get(t)) == null ? void 0 : _termToGroup$get.category;
    });
    var allSame = cats.every(function (c) {
      return c && c === cats[0];
    });
    if (allSame) {
      playSfx('correct');
      vibrateCorrect();
      var newSolved = [].concat(solved, [cats[0]]);
      var remaining = order.filter(function (t) {
        return !selected.includes(t);
      });
      setSolved(newSolved);
      setOrder(remaining);
      setSelected([]);
      setMessage('');
      if (newSolved.length === 4) {
        setPhase('won');
        finalize(true, newSolved, mistakes);
      }
    } else {
      playSfx('wrong');
      vibrateWrong();
      var counts = {};
      cats.forEach(function (c) {
        if (c) counts[c] = (counts[c] || 0) + 1;
      });
      var oneAway = Object.values(counts).some(function (n) {
        return n === 3;
      });
      var newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShaking(true);
      setTimeout(function () {
        return setShaking(false);
      }, 500);
      setMessage(oneAway ? 'One away…' : 'Not quite');
      if (newMistakes >= 4) {
        var finalSolved = [].concat(solved, unsolvedGroups.map(function (g) {
          return g.category;
        }));
        setSolved(finalSolved);
        setOrder([]);
        setSelected([]);
        setPhase('lost');
        finalize(false, solved, newMistakes);
      }
    }
  };
  var dots = [0, 1, 2, 3];
  var mistakesLeft = 4 - mistakes;
  useEffect(function () {
    var prevBodyOverflow = document.body.style.overflow;
    var prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return function () {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);
  return React.createElement("div", {
    className: "fixed inset-x-0 bottom-0 z-50 bg-[var(--bg)] overflow-y-auto",
    style: {
      top: 'var(--mcat-header-h, 56px)',
      marginTop: 0
    }
  }, React.createElement("style", null, "\n        @keyframes conn-shake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(3px)} 30%,50%,70%{transform:translateX(-5px)} 40%,60%{transform:translateX(5px)} }\n        .conn-shake { animation: conn-shake 0.45s ease-in-out; }\n      "), React.createElement("div", {
    className: "sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border-soft)] px-3 sm:px-6 py-2"
  }, React.createElement("div", {
    className: "max-w-2xl mx-auto flex items-center justify-between gap-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Daily Connections \xB7 ", date), React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)] truncate"
  }, payload.title || 'MCAT Connections')), React.createElement("button", {
    onClick: onClose,
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Close"))), React.createElement("div", {
    className: "max-w-2xl mx-auto p-3 sm:p-6 space-y-4"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card-soft)] border border-[var(--border-soft)] rounded-xl p-3 text-sm text-[var(--text-muted)]"
  }, "Pick 4 terms that share a hidden MCAT connection. Solve all 4 groups \u2014 green is easiest, purple is hardest. 4 mistakes and it's over."), solvedGroups.length > 0 && React.createElement("div", {
    className: "space-y-2"
  }, solvedGroups.map(function (g) {
    return React.createElement(SolvedConnectionGroup, {
      key: g.category,
      group: g,
      date: date
    });
  })), order.length > 0 && React.createElement("div", {
    className: "grid grid-cols-4 gap-1.5 sm:gap-2 " + (shaking ? 'conn-shake' : '')
  }, order.map(function (term) {
    var isSel = selected.includes(term);
    return React.createElement("button", {
      key: term,
      onClick: function onClick() {
        return toggle(term);
      },
      disabled: phase !== 'play',
      "data-no-haptic": true,
      className: "aspect-square rounded-lg px-1 py-1 text-[10px] sm:text-xs font-semibold leading-tight " + "flex items-center justify-center text-center break-words transition-colors " + (isSel ? 'bg-[var(--text-strong)] text-[var(--bg)] ' : 'bg-[var(--bg-elev)] hover:bg-[var(--bg-hover)] text-[var(--text)] '),
      style: isSel ? {} : {
        border: '1px solid var(--border-soft)'
      }
    }, React.createElement("span", {
      className: "px-0.5"
    }, term));
  })), React.createElement("div", {
    className: "flex items-center justify-between gap-3 px-1"
  }, React.createElement("div", {
    className: "flex items-center gap-2 text-sm text-[var(--text-muted)]"
  }, React.createElement("span", null, "Mistakes remaining:"), React.createElement("div", {
    className: "flex gap-1.5"
  }, dots.map(function (i) {
    return React.createElement("span", {
      key: i,
      className: "inline-block w-2.5 h-2.5 rounded-full " + (i < mistakesLeft ? 'bg-[var(--text-strong)]' : 'bg-[var(--border)]')
    });
  }))), message && React.createElement("span", {
    className: "text-sm font-medium " + (phase === 'play' ? 'text-[var(--danger-text)]' : 'text-[var(--text-muted)]')
  }, message)), phase === 'won' && React.createElement("div", {
    className: "bg-[var(--success-bg-strong)] border border-[var(--success-border)] rounded-xl p-4 text-center"
  }, React.createElement("div", {
    className: "font-semibold text-[var(--success-text)]"
  }, "Solved \u2014 ", mistakes, " mistake", mistakes === 1 ? '' : 's'), React.createElement("div", {
    className: "text-sm text-[var(--text)] mt-1"
  }, "Come back tomorrow for a new puzzle.")), phase === 'lost' && React.createElement("div", {
    className: "bg-[var(--danger-bg-strong)] border border-[var(--danger-border)] rounded-xl p-4 text-center"
  }, React.createElement("div", {
    className: "font-semibold text-[var(--danger-text)]"
  }, "Out of mistakes"), React.createElement("div", {
    className: "text-sm text-[var(--text)] mt-1"
  }, "Answers revealed above. Try tomorrow's puzzle.")), phase === 'play' ? React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, React.createElement("button", {
    onClick: shuffle,
    className: "text-sm py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)]"
  }, "Shuffle"), React.createElement("button", {
    onClick: deselect,
    disabled: selected.length === 0,
    className: "text-sm py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-40"
  }, "Deselect"), React.createElement("button", {
    onClick: submit,
    disabled: selected.length !== 4,
    className: "text-sm py-2.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg font-semibold"
  }, "Submit")) : React.createElement("button", {
    onClick: onClose,
    className: "w-full text-sm py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, "Done")));
}
function DailyConnectionsCard() {
  var _result$solvedCategor;
  var _useApp14 = useApp(),
    api = _useApp14.api,
    client = _useApp14.client,
    apiKey = _useApp14.apiKey,
    session = _useApp14.session,
    extractions = _useApp14.extractions,
    files = _useApp14.files;
  var today = todayStr();
  var cached = getConnectionsCachePayload(today);
  var _useState119 = useState(cached ? 'ready' : 'loading'),
    state = _useState119[0],
    setState = _useState119[1];
  var _useState120 = useState(cached),
    payload = _useState120[0],
    setPayload = _useState120[1];
  var _useState121 = useState(''),
    err = _useState121[0],
    setErr = _useState121[1];
  var _useState122 = useState(false),
    running = _useState122[0],
    setRunning = _useState122[1];
  var _useState123 = useState(0),
    tick = _useState123[0],
    setTick = _useState123[1];
  var result = getConnectionsResults()[today];
  var termPool = useMemo(function () {
    var out = [];
    var seen = new Set();
    for (var _iterator68 = _createForOfIteratorHelperLoose(files), _step68; !(_step68 = _iterator68()).done;) {
      var f = _step68.value;
      var ext = extractions[f.file_id];
      if (!(ext != null && ext.key_terms)) continue;
      for (var _iterator69 = _createForOfIteratorHelperLoose(ext.key_terms), _step69; !(_step69 = _iterator69()).done;) {
        var kt = _step69.value;
        var key = (kt.term || '').trim();
        if (!key || seen.has(key.toLowerCase())) continue;
        seen.add(key.toLowerCase());
        out.push({
          term: key,
          definition: kt.definition || '',
          subject: f.subject || '',
          chapter: f.chapter || f.name || ''
        });
      }
    }
    return out;
  }, [files, extractions]);
  useEffect(function () {
    var cancelled = false;
    if (!getConnectionsCachePayload(today)) setState('loading');
    setErr('');
    api.getConnections(today).then(function (d) {
      if (cancelled) return;
      setConnectionsCachePayload(today, d.payload);
      setPayload(d.payload);
      setState('ready');
    }).catch(function () {
      var _ref81 = _asyncToGenerator(_regenerator().m(function _callee47(e) {
        var fallback, poolSet, norm, normMap, _iterator70, _step70, t, n, reconcile, buildValid, gen, lastErr, attempt, d2, _t33, _t34, _t35;
        return _regenerator().w(function (_context52) {
          while (1) switch (_context52.p = _context52.n) {
            case 0:
              if (!cancelled) {
                _context52.n = 1;
                break;
              }
              return _context52.a(2);
            case 1:
              if (!(e.status !== 404)) {
                _context52.n = 3;
                break;
              }
              fallback = getConnectionsCachePayload(today);
              if (!fallback) {
                _context52.n = 2;
                break;
              }
              setPayload(fallback);
              setState('ready');
              return _context52.a(2);
            case 2:
              setErr(e.message);
              setState('error');
              return _context52.a(2);
            case 3:
              if (!(!apiKey || !session)) {
                _context52.n = 4;
                break;
              }
              setState('unavailable');
              return _context52.a(2);
            case 4:
              if (!(termPool.length < 24)) {
                _context52.n = 5;
                break;
              }
              setState('needs-terms');
              return _context52.a(2);
            case 5:
              setState('generating');
              _context52.p = 6;
              poolSet = new Set(termPool.map(function (t) {
                return t.term;
              }));
              norm = function norm(s) {
                return (s || '').toLowerCase().replace(/[\s\-_/]+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();
              };
              normMap = new Map();
              for (_iterator70 = _createForOfIteratorHelperLoose(termPool); !(_step70 = _iterator70()).done;) {
                t = _step70.value;
                n = norm(t.term);
                if (n && !normMap.has(n)) normMap.set(n, t.term);
              }
              reconcile = function reconcile(term) {
                if (poolSet.has(term)) return term;
                var n = norm(term);
                if (!n) return null;
                if (normMap.has(n)) return normMap.get(n);
                for (var _iterator71 = _createForOfIteratorHelperLoose(normMap), _step71; !(_step71 = _iterator71()).done;) {
                  var _step71$value = _step71.value,
                    pn = _step71$value[0],
                    canon = _step71$value[1];
                  if (pn.includes(n) || n.includes(pn)) return canon;
                }
                return null;
              };
              buildValid = function () {
                var _ref82 = _asyncToGenerator(_regenerator().m(function _callee46() {
                  var _gen$groups;
                  var gen, usedTerms, _iterator72, _step72, g;
                  return _regenerator().w(function (_context51) {
                    while (1) switch (_context51.n) {
                      case 0:
                        _context51.n = 1;
                        return client.generateDailyConnections(termPool, today);
                      case 1:
                        gen = _context51.v;
                        if (gen != null && (_gen$groups = gen.groups) != null && _gen$groups.length) {
                          _context51.n = 2;
                          break;
                        }
                        throw new Error('Generation returned no groups.');
                      case 2:
                        if (!(gen.groups.length !== 4)) {
                          _context51.n = 3;
                          break;
                        }
                        throw new Error('Generation did not return 4 groups.');
                      case 3:
                        usedTerms = new Set();
                        _iterator72 = _createForOfIteratorHelperLoose(gen.groups);
                      case 4:
                        if ((_step72 = _iterator72()).done) {
                          _context51.n = 7;
                          break;
                        }
                        g = _step72.value;
                        if (!(!Array.isArray(g.terms) || g.terms.length !== 4)) {
                          _context51.n = 5;
                          break;
                        }
                        throw new Error('Each group must have 4 terms.');
                      case 5:
                        g.terms = g.terms.map(function (t) {
                          var canon = reconcile(t);
                          if (!canon) throw new Error("Generated term not in pool: " + t);
                          if (usedTerms.has(canon)) throw new Error("Term used in more than one group: " + canon);
                          usedTerms.add(canon);
                          return canon;
                        });
                      case 6:
                        _context51.n = 4;
                        break;
                      case 7:
                        return _context51.a(2, gen);
                    }
                  }, _callee46);
                }));
                return function buildValid() {
                  return _ref82.apply(this, arguments);
                };
              }();
              gen = null, lastErr = null;
              attempt = 0;
            case 7:
              if (!(attempt < 3 && !cancelled)) {
                _context52.n = 12;
                break;
              }
              _context52.p = 8;
              _context52.n = 9;
              return buildValid();
            case 9:
              gen = _context52.v;
              return _context52.a(3, 12);
            case 10:
              _context52.p = 10;
              _t33 = _context52.v;
              lastErr = _t33;
            case 11:
              attempt++;
              _context52.n = 7;
              break;
            case 12:
              if (gen) {
                _context52.n = 13;
                break;
              }
              throw lastErr || new Error('Could not generate a valid puzzle.');
            case 13:
              _context52.n = 14;
              return api.postConnections({
                date: today,
                title: gen.title || '',
                payload: gen
              });
            case 14:
              if (!cancelled) {
                setConnectionsCachePayload(today, gen);
                setPayload(gen);
                setState('ready');
              }
              _context52.n = 21;
              break;
            case 15:
              _context52.p = 15;
              _t34 = _context52.v;
              _context52.p = 16;
              _context52.n = 17;
              return api.getConnections(today);
            case 17:
              d2 = _context52.v;
              if (cancelled) {
                _context52.n = 18;
                break;
              }
              setConnectionsCachePayload(today, d2.payload);
              setPayload(d2.payload);
              setState('ready');
              return _context52.a(2);
            case 18:
              _context52.n = 20;
              break;
            case 19:
              _context52.p = 19;
              _t35 = _context52.v;
            case 20:
              if (!cancelled) {
                setErr(_t34.message);
                setState('error');
              }
            case 21:
              return _context52.a(2);
          }
        }, _callee47, null, [[16, 19], [8, 10], [6, 15]]);
      }));
      return function (_x61) {
        return _ref81.apply(this, arguments);
      };
    }());
    return function () {
      cancelled = true;
    };
  }, [api, today, tick, apiKey, session, termPool, client]);
  var card = function card(inner) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
    }, inner);
  };
  if (state === 'loading') return card(React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Checking today's Connections\u2026"));
  if (state === 'generating') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily Connections"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Generating today's puzzle with Gemini \u2014 about 15 seconds\u2026")));
  if (state === 'unavailable') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily Connections"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Today's puzzle hasn't been generated yet. It appears once someone signed in with a Gemini API key opens the app.")));
  if (state === 'needs-terms') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily Connections"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Not enough terms yet to build a puzzle \u2014 process a few more chapters in the Library tab and check back.")));
  if (state === 'error') return card(React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily Connections"), React.createElement("button", {
    onClick: function onClick() {
      return setTick(function (t) {
        return t + 1;
      });
    },
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Retry")), React.createElement("p", {
    className: "text-sm text-[var(--danger-text)] mt-1 break-words whitespace-pre-wrap"
  }, err)));
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "bg-[var(--bg-card)] border rounded-2xl p-4 sm:p-5 " + (result ? 'border-[var(--border-soft)]' : 'border-[var(--accent-border)]')
  }, React.createElement("div", {
    className: "flex items-start justify-between gap-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's Connections"), !result && React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-[var(--danger-border)]"
  })), (payload == null ? void 0 : payload.title) && React.createElement("div", {
    className: "text-sm text-[var(--text)] mt-0.5"
  }, payload.title), React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] mt-0.5"
  }, "4\xD74 grid \xB7 4 hidden categories \xB7 green \u2192 purple difficulty", (result == null ? void 0 : result.won) && React.createElement("span", {
    className: "text-[var(--success-text)]"
  }, " \xB7 solved with ", result.mistakes, " mistake", result.mistakes === 1 ? '' : 's'), result && !result.won && React.createElement("span", {
    className: "text-[var(--danger-text)]"
  }, " \xB7 gave up at ", ((_result$solvedCategor = result.solvedCategories) == null ? void 0 : _result$solvedCategor.length) || 0, "/4"))), React.createElement("button", {
    onClick: function onClick() {
      return setRunning(true);
    },
    className: "shrink-0 text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
  }, result ? 'Review' : 'Play'))), running && payload && React.createElement(ConnectionsRunner, {
    date: today,
    payload: payload,
    alreadyDone: !!result,
    onClose: function onClose() {
      setRunning(false);
      setTick(function (t) {
        return t + 1;
      });
    }
  }));
}
function ConnectionsArchive() {
  var _useApp15 = useApp(),
    api = _useApp15.api;
  var _useState124 = useState(null),
    days = _useState124[0],
    setDays = _useState124[1];
  var _useState125 = useState(''),
    err = _useState125[0],
    setErr = _useState125[1];
  var _useState126 = useState(null),
    open = _useState126[0],
    setOpen = _useState126[1];
  var _useState127 = useState(null),
    loadingDate = _useState127[0],
    setLoadingDate = _useState127[1];
  var _useState128 = useState(false),
    expanded = _useState128[0],
    setExpanded = _useState128[1];
  var today = todayStr();
  var results = getConnectionsResults();
  useEffect(function () {
    var cancelled = false;
    api.listConnections().then(function (d) {
      if (!cancelled) setDays(d.days || []);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api]);
  var openDay = function () {
    var _ref83 = _asyncToGenerator(_regenerator().m(function _callee48(date) {
      var cachedPayload, d, _t36;
      return _regenerator().w(function (_context53) {
        while (1) switch (_context53.p = _context53.n) {
          case 0:
            cachedPayload = getConnectionsCachePayload(date);
            if (!cachedPayload) {
              _context53.n = 1;
              break;
            }
            setOpen({
              date,
              payload: cachedPayload
            });
            return _context53.a(2);
          case 1:
            setLoadingDate(date);
            _context53.p = 2;
            _context53.n = 3;
            return api.getConnections(date);
          case 3:
            d = _context53.v;
            setConnectionsCachePayload(date, d.payload);
            setOpen({
              date,
              payload: d.payload
            });
            _context53.n = 5;
            break;
          case 4:
            _context53.p = 4;
            _t36 = _context53.v;
            setErr(_t36.message);
          case 5:
            _context53.p = 5;
            setLoadingDate(null);
            return _context53.f(5);
          case 6:
            return _context53.a(2);
        }
      }, _callee48, null, [[2, 4, 5, 6]]);
    }));
    return function openDay(_x62) {
      return _ref83.apply(this, arguments);
    };
  }();
  var visibleDays = days && (expanded ? days : days.slice(0, 3));
  var extraCount = days ? Math.max(0, days.length - 3) : 0;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between mb-1"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Daily Connections archive"), days && React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, days.length, " day", days.length === 1 ? '' : 's')), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mb-3"
  }, "Every day's Connections puzzle. Replay any one."), err && React.createElement("div", {
    className: "text-sm text-[var(--danger-text)] mb-2"
  }, err), !days && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading\u2026"), days && days.length === 0 && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "No Connections days yet \u2014 the first appears once today's is generated."), days && days.length > 0 && React.createElement("ul", {
    className: "divide-y divide-[var(--border-soft)]"
  }, visibleDays.map(function (d) {
    var _r$solvedCategories;
    var r = results[d.date];
    return React.createElement("li", {
      key: d.date,
      className: "py-2.5 flex items-center gap-3"
    }, React.createElement("div", {
      className: "min-w-0 flex-1"
    }, React.createElement("div", {
      className: "text-sm text-[var(--text)]"
    }, React.createElement("span", {
      className: "font-medium"
    }, d.date, d.date === today ? ' · today' : ''), d.title && React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, " \u2014 ", d.title)), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)]"
    }, "by @", d.created_by || 'unknown', (r == null ? void 0 : r.won) && React.createElement("span", {
      className: "text-[var(--success-text)]"
    }, " \xB7 solved (", r.mistakes, " mistake", r.mistakes === 1 ? '' : 's', ")"), r && !r.won && React.createElement("span", {
      className: "text-[var(--danger-text)]"
    }, " \xB7 ", ((_r$solvedCategories = r.solvedCategories) == null ? void 0 : _r$solvedCategories.length) || 0, "/4 before fail"))), React.createElement("button", {
      onClick: function onClick() {
        return openDay(d.date);
      },
      disabled: loadingDate === d.date,
      className: "shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
    }, loadingDate === d.date ? 'Loading…' : r ? 'Review' : 'Open'));
  })), days && extraCount > 0 && React.createElement("button", {
    onClick: function onClick() {
      return setExpanded(function (e) {
        return !e;
      });
    },
    className: "mt-3 text-xs text-[var(--accent-text)] hover:underline"
  }, expanded ? 'Show less' : "Show " + extraCount + " more day" + (extraCount === 1 ? '' : 's')), open && open.payload && React.createElement(ConnectionsRunner, {
    date: open.date,
    payload: open.payload,
    alreadyDone: !!results[open.date],
    onClose: function onClose() {
      return setOpen(null);
    }
  }));
}
function CarsCalendar() {
  var results = getCarsResults();
  var done = Object.entries(results).filter(function (_ref84) {
    var r = _ref84[1];
    return r && r.total;
  });
  var WEEKS = 13;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var total = (WEEKS - 1) * 7 + today.getDay() + 1;
  var days = [];
  for (var i = total - 1; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  var streak = 0;
  for (var _i24 = 0; _i24 < 400; _i24++) {
    var _d2 = new Date(today);
    _d2.setDate(today.getDate() - _i24);
    var r = results[todayStr(_d2)];
    if (r && r.total) streak++;else if (_i24 === 0) continue;else break;
  }
  var doneCount = done.length;
  var avgAcc = doneCount ? Math.round(done.reduce(function (s, _ref85) {
    var r = _ref85[1];
    return s + r.score / r.total;
  }, 0) / doneCount * 100) : 0;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between mb-1"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "CARS calendar"), React.createElement("span", {
    className: "text-xs text-[var(--text-muted)]"
  }, doneCount, " done \xB7 ", avgAcc, "% avg \xB7 ", streak, "-day streak")), React.createElement("p", {
    className: "text-[11px] text-[var(--text-faint)] mb-3"
  }, "Last 13 weeks. Greener = higher accuracy."), React.createElement("div", {
    className: "grid gap-1",
    style: {
      gridTemplateRows: 'repeat(7, 1fr)',
      gridAutoFlow: 'column'
    }
  }, days.map(function (d) {
    var key = todayStr(d);
    var r = results[key];
    var acc = r && r.total ? r.score / r.total : null;
    var style = acc != null ? {
      background: 'var(--success-border)',
      opacity: 0.3 + acc * 0.7
    } : {
      background: 'var(--bg-elev)'
    };
    return React.createElement("div", {
      key: key,
      title: r ? key + " \u2014 " + r.score + "/" + r.total + " (" + Math.round(acc * 100) + "%)" : key + " \u2014 not done",
      className: "rounded-sm",
      style: _extends({}, style, {
        aspectRatio: '1',
        minWidth: '9px'
      })
    });
  })), doneCount === 0 && React.createElement("p", {
    className: "text-xs text-[var(--text-faint)] mt-3"
  }, "Do a daily CARS passage and it lights up here."));
}
function HomeView(_ref86) {
  var onGoToStudy = _ref86.onGoToStudy;
  var _useApp16 = useApp(),
    session = _useApp16.session;
  var username = (session == null ? void 0 : session.username) || 'student';
  var quote = useMemo(function () {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }, []);
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement(BirdHero, {
    username: username,
    quote: quote
  }), React.createElement(DailyCarsCard, null), React.createElement(DailyConnectionsCard, null), React.createElement(HomeActivity, null), React.createElement(DailyExamCard, {
    onGoToStudy: onGoToStudy
  }));
}
var DAILY_EXAM_COUNT = 15;
function sectionForSubject(subject) {
  var s = (subject || '').toLowerCase();
  if (/cars|critical analysis/.test(s)) return 'CARS';
  if (/psych/.test(s)) return 'P/S';
  if (/soc/.test(s)) return 'P/S';
  if (/physics/.test(s)) return 'C/P';
  if (/organic|orgo/.test(s)) return 'C/P';
  if (/general chem|gen chem|inorganic/.test(s)) return 'C/P';
  if (/biochem/.test(s)) return 'B/B';
  if (/chemistry|chem\b/.test(s)) return 'C/P';
  if (/bio/.test(s)) return 'B/B';
  return null;
}
var KAPLAN_CHAPTER_ABUNDANCE = {
  'Behavioral Science': {
    1: 8,
    2: 6,
    3: 14,
    4: 7,
    5: 6,
    6: 7,
    7: 4,
    8: 9,
    9: 7,
    10: 10,
    11: 13,
    12: 9
  },
  'Biochemistry': {
    1: 20,
    2: 14,
    3: 4,
    4: 4,
    5: 3,
    6: 14,
    7: 9,
    8: 10,
    9: 5,
    10: 6,
    11: 2,
    12: 9
  },
  'Biology': {
    1: 18,
    2: 9,
    3: 5,
    4: 12,
    5: 9,
    6: 3,
    7: 6,
    8: 6,
    9: 4,
    10: 7,
    11: 8,
    12: 13
  },
  'General Chemistry': {
    1: 7,
    2: 10,
    3: 12,
    4: 7,
    5: 11,
    6: 4,
    7: 7,
    8: 9,
    9: 8,
    10: 15,
    11: 4,
    12: 6
  },
  'Organic Chemistry': {
    1: 4,
    2: 12,
    3: 3,
    4: 5,
    5: 13,
    6: 8,
    7: 6,
    8: 9,
    9: 11,
    10: 4,
    11: 8,
    12: 17
  },
  'Physics and Math': {
    1: 6,
    2: 11,
    3: 9,
    4: 10,
    5: 7,
    6: 16,
    7: 11,
    8: 14,
    9: 16
  }
};
var MINI_EXAM_BLUEPRINT = {
  'C/P': {
    'General Chemistry': 30,
    'Physics and Math': 25,
    'Biochemistry': 25,
    'Organic Chemistry': 15,
    'Biology': 5
  },
  'CARS': {},
  'B/B': {
    'Biology': 65,
    'Biochemistry': 25,
    'General Chemistry': 5,
    'Organic Chemistry': 5
  },
  'P/S': {
    'Behavioral Science': 95,
    'Biology': 5
  }
};
var MINI_EXAM_SECTIONS = ['C/P', 'CARS', 'B/B', 'P/S'];
var MINI_EXAM_PER_SECTION = 30;
function canonicalizeSubject(subject) {
  var s = (subject || '').toLowerCase();
  if (/behav|psych|soc/.test(s)) return 'Behavioral Science';
  if (/biochem/.test(s)) return 'Biochemistry';
  if (/organic|orgo/.test(s)) return 'Organic Chemistry';
  if (/general chem|gen chem|inorganic/.test(s)) return 'General Chemistry';
  if (/physics|math/.test(s)) return 'Physics and Math';
  if (/bio/.test(s)) return 'Biology';
  if (/chem/.test(s)) return 'General Chemistry';
  return null;
}
function chapterNum(chapter) {
  var m = String(chapter || '').match(/\d+/);
  return m ? Number(m[0]) : null;
}
function allocateCounts(weights, total) {
  var entries = Object.entries(weights);
  var sum = entries.reduce(function (a, _ref87) {
    var w = _ref87[1];
    return a + w;
  }, 0) || 1;
  var raw = entries.map(function (_ref88) {
    var k = _ref88[0],
      w = _ref88[1];
    return [k, w / sum * total];
  });
  var out = {};
  var used = 0;
  for (var _iterator73 = _createForOfIteratorHelperLoose(raw), _step73; !(_step73 = _iterator73()).done;) {
    var _step73$value = _step73.value,
      k = _step73$value[0],
      r = _step73$value[1];
    out[k] = Math.floor(r);
    used += out[k];
  }
  var rem = total - used;
  var fracs = raw.map(function (_ref89) {
    var k = _ref89[0],
      r = _ref89[1];
    return [k, r - Math.floor(r)];
  }).sort(function (a, b) {
    return b[1] - a[1];
  });
  for (var i = 0; i < fracs.length && rem > 0; i++, rem--) out[fracs[i][0]]++;
  return out;
}
function weightedSample(items, weightFn, k) {
  var pool = items.slice();
  var out = [];
  while (out.length < k && pool.length) {
    var total = 0;
    for (var _iterator74 = _createForOfIteratorHelperLoose(pool), _step74; !(_step74 = _iterator74()).done;) {
      var it = _step74.value;
      total += Math.max(0.0001, weightFn(it));
    }
    var r = Math.random() * total;
    var idx = pool.length - 1;
    for (var i = 0; i < pool.length; i++) {
      r -= Math.max(0.0001, weightFn(pool[i]));
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
function assembleSection(section, available, target) {
  if (target === void 0) {
    target = MINI_EXAM_PER_SECTION;
  }
  var weights = MINI_EXAM_BLUEPRINT[section] || {};
  var bySubject = {};
  for (var _iterator75 = _createForOfIteratorHelperLoose(available), _step75; !(_step75 = _iterator75()).done;) {
    var _it = _step75.value;
    var subj = canonicalizeSubject(_it.subject) || 'Other';
    (bySubject[subj] || (bySubject[subj] = [])).push(_it);
  }
  var desired = Object.keys(weights).length ? allocateCounts(weights, target) : {};
  var chosen = [];
  var used = new Set();
  var _loop6 = function _loop6() {
    var _Object$entries2$_i = _Object$entries2[_i25],
      subj = _Object$entries2$_i[0],
      want = _Object$entries2$_i[1];
    var items = (bySubject[subj] || []).filter(function (it) {
      return !used.has(it.id);
    });
    var ab = KAPLAN_CHAPTER_ABUNDANCE[subj] || {};
    var picked = weightedSample(items, function (it) {
      return ab[chapterNum(it.chapter)] || 1;
    }, Math.min(want, items.length));
    for (var _iterator76 = _createForOfIteratorHelperLoose(picked), _step76; !(_step76 = _iterator76()).done;) {
      var p = _step76.value;
      chosen.push(p);
      used.add(p.id);
    }
  };
  for (var _i25 = 0, _Object$entries2 = Object.entries(desired); _i25 < _Object$entries2.length; _i25++) {
    _loop6();
  }
  if (chosen.length < target) {
    for (var _iterator77 = _createForOfIteratorHelperLoose(shuffle(available.filter(function (it) {
        return !used.has(it.id);
      }))), _step77; !(_step77 = _iterator77()).done;) {
      var it = _step77.value;
      if (chosen.length >= target) break;
      chosen.push(it);
      used.add(it.id);
    }
  }
  return shuffle(chosen).slice(0, target);
}
function MiniExamCard() {
  var _useApp17 = useApp(),
    api = _useApp17.api;
  var _useState129 = useState(null),
    stats = _useState129[0],
    setStats = _useState129[1];
  var _useState130 = useState(false),
    loading = _useState130[0],
    setLoading = _useState130[1];
  var _useState131 = useState(''),
    err = _useState131[0],
    setErr = _useState131[1];
  useEffect(function () {
    var alive = true;
    api.examBankStats().then(function (s) {
      if (alive) setStats(s);
    }).catch(function () {});
    return function () {
      alive = false;
    };
  }, []);
  var sectionCounts = useMemo(function () {
    var m = {};
    for (var _iterator78 = _createForOfIteratorHelperLoose((stats == null ? void 0 : stats.by_section) || []), _step78; !(_step78 = _iterator78()).done;) {
      var row = _step78.value;
      if (row.section) m[row.section] = row.n;
    }
    return m;
  }, [stats]);
  var readyTotal = MINI_EXAM_SECTIONS.reduce(function (a, s) {
    return a + Math.min(MINI_EXAM_PER_SECTION, sectionCounts[s] || 0);
  }, 0);
  var target = MINI_EXAM_SECTIONS.length * MINI_EXAM_PER_SECTION;
  var start = function () {
    var _ref90 = _asyncToGenerator(_regenerator().m(function _callee49() {
      var items, _iterator79, _step79, section, res, picked, _iterator80, _step80, q, _t37;
      return _regenerator().w(function (_context54) {
        while (1) switch (_context54.p = _context54.n) {
          case 0:
            setLoading(true);
            setErr('');
            _context54.p = 1;
            items = [];
            _iterator79 = _createForOfIteratorHelperLoose(MINI_EXAM_SECTIONS);
          case 2:
            if ((_step79 = _iterator79()).done) {
              _context54.n = 5;
              break;
            }
            section = _step79.value;
            _context54.n = 3;
            return api.examBankQuestions({
              section,
              limit: 120
            }).catch(function () {
              return {
                questions: []
              };
            });
          case 3:
            res = _context54.v;
            picked = assembleSection(section, (res == null ? void 0 : res.questions) || [], MINI_EXAM_PER_SECTION);
            for (_iterator80 = _createForOfIteratorHelperLoose(picked); !(_step80 = _iterator80()).done;) {
              q = _step80.value;
              items.push({
                id: q.id,
                mode: 'mc',
                q: {
                  question: q.question,
                  choices: q.choices,
                  correct_index: q.correct_index,
                  explanation: q.explanation
                },
                chapter: q.chapter,
                subject: q.subject
              });
            }
          case 4:
            _context54.n = 2;
            break;
          case 5:
            if (items.length) {
              _context54.n = 6;
              break;
            }
            setErr('The shared exam bank is empty. Generate daily exams to seed it, then try again.');
            return _context54.a(2);
          case 6:
            sfxQuizStart();
            window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
              detail: {
                items
              }
            }));
            _context54.n = 8;
            break;
          case 7:
            _context54.p = 7;
            _t37 = _context54.v;
            setErr('Could not load the exam bank. Try again in a moment.');
          case 8:
            _context54.p = 8;
            setLoading(false);
            return _context54.f(8);
          case 9:
            return _context54.a(2);
        }
      }, _callee49, null, [[1, 7, 8, 9]]);
    }));
    return function start() {
      return _ref90.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3"
  }, React.createElement("div", {
    className: "flex items-start justify-between gap-3"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold"
  }, "Full Mini exam"), React.createElement("p", {
    className: "text-xs text-[var(--text-muted)] mt-0.5"
  }, "A four-section mini MCAT (", target, " questions, 30 per section) drawn from the shared community bank, weighted to match real subject and chapter abundance.")), React.createElement("span", {
    className: "shrink-0 text-xs text-[var(--text-faint)] self-center"
  }, readyTotal, "/", target, " ready")), React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, MINI_EXAM_SECTIONS.map(function (s) {
    var have = Math.min(MINI_EXAM_PER_SECTION, sectionCounts[s] || 0);
    var full = have >= MINI_EXAM_PER_SECTION;
    return React.createElement("span", {
      key: s,
      className: "text-xs px-2 py-1 rounded border " + (full ? 'border-[var(--accent-border)] text-[var(--accent-text)] bg-[var(--accent-soft)]' : 'border-[var(--border)] text-[var(--text-muted)]'),
      title: s === 'CARS' ? 'CARS questions are not yet seeded into the shared bank.' : ''
    }, s, " ", have, "/", MINI_EXAM_PER_SECTION);
  })), sectionCounts['CARS'] ? null : React.createElement("p", {
    className: "text-xs text-[var(--text-faint)]"
  }, "CARS isn't seeded into the shared bank yet, so the exam will be short that section."), err && React.createElement("p", {
    className: "text-xs text-red-400"
  }, err), React.createElement("button", {
    onClick: start,
    disabled: loading || readyTotal === 0,
    className: "w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-3 sm:py-2.5 font-medium"
  }, loading ? 'Assembling exam…' : readyTotal === 0 ? 'Bank empty — generate daily exams first' : "Start " + readyTotal + "-question mini exam"));
}
function DailyExamCard(_ref91) {
  var onGoToStudy = _ref91.onGoToStudy;
  var _useApp18 = useApp(),
    client = _useApp18.client,
    api = _useApp18.api,
    session = _useApp18.session,
    apiKey = _useApp18.apiKey,
    files = _useApp18.files,
    questions = _useApp18.questions,
    extractions = _useApp18.extractions,
    attempts = _useApp18.attempts;
  var today = todayStr();
  var cached = getDailyExamPayload(today);
  var _useState132 = useState(cached),
    payload = _useState132[0],
    setPayload = _useState132[1];
  var _useState133 = useState(cached ? 'ready' : 'idle'),
    state = _useState133[0],
    setState = _useState133[1];
  var _useState134 = useState(''),
    err = _useState134[0],
    setErr = _useState134[1];
  var mastered = useMemo(function () {
    var g = storage.get(KEYS.lessonGates, {}) || {};
    return files.filter(function (f) {
      var _g$f$chapter_id2;
      return f.chapter_id && ((_g$f$chapter_id2 = g[f.chapter_id]) == null ? void 0 : _g$f$chapter_id2.mastered) && extractions[f.file_id];
    }).map(function (f) {
      return {
        subject: f.subject,
        chapter: f.chapter,
        extraction: extractions[f.file_id]
      };
    });
  }, [files, extractions]);
  var items = useMemo(function () {
    var qs = (payload == null ? void 0 : payload.questions) || [];
    return qs.map(function (q) {
      return {
        id: q.id,
        mode: 'mc',
        q: {
          question: q.question,
          choices: q.choices,
          correct_index: q.correct_index,
          explanation: q.explanation
        },
        file_id: "daily_" + today,
        chapter: q.chapter || 'Daily exam',
        subject: q.subject || ''
      };
    });
  }, [payload, today]);
  var doneToday = useMemo(function () {
    if (!items.length) return 0;
    var ids = new Set(items.map(function (x) {
      return x.id;
    }));
    var seen = new Set();
    for (var _iterator81 = _createForOfIteratorHelperLoose(attempts), _step81; !(_step81 = _iterator81()).done;) {
      var a = _step81.value;
      if (ids.has(a.question_id) && a.ts && todayStr(new Date(a.ts)) === today) seen.add(a.question_id);
    }
    return seen.size;
  }, [items, attempts, today]);
  useEffect(function () {
    if (payload) {
      setState('ready');
      return;
    }
    if (state === 'generating') return;
    if (!apiKey) {
      setState('unavailable');
      return;
    }
    if (!mastered.length) {
      setState('idle');
      return;
    }
    setState('idle');
  }, [payload, apiKey, mastered.length]);
  var generate = function () {
    var _ref92 = _asyncToGenerator(_regenerator().m(function _callee50() {
      var questionsOut, p, contribution, _t38;
      return _regenerator().w(function (_context55) {
        while (1) switch (_context55.p = _context55.n) {
          case 0:
            if (!(!apiKey || !mastered.length)) {
              _context55.n = 1;
              break;
            }
            return _context55.a(2);
          case 1:
            setState('generating');
            setErr('');
            _context55.p = 2;
            _context55.n = 3;
            return client.generateDailyExam(mastered, DAILY_EXAM_COUNT);
          case 3:
            questionsOut = _context55.v;
            if (questionsOut != null && questionsOut.length) {
              _context55.n = 4;
              break;
            }
            throw new Error('Generation returned no questions.');
          case 4:
            p = {
              date: today,
              questions: questionsOut
            };
            setDailyExamPayload(today, p);
            setPayload(p);
            setState('ready');
            if (session) {
              contribution = questionsOut.map(function (q) {
                return {
                  section: sectionForSubject(q.subject),
                  subject: q.subject,
                  chapter: q.chapter,
                  content_category: q.content_category,
                  sirs_skill: q.sirs_skill,
                  question: q.question,
                  choices: q.choices,
                  correct_index: q.correct_index,
                  explanation: q.explanation
                };
              });
              api.postExamBank(contribution).catch(function () {});
            }
            _context55.n = 6;
            break;
          case 5:
            _context55.p = 5;
            _t38 = _context55.v;
            setErr(_t38.message || String(_t38));
            setState('error');
          case 6:
            return _context55.a(2);
        }
      }, _callee50, null, [[2, 5]]);
    }));
    return function generate() {
      return _ref92.apply(this, arguments);
    };
  }();
  var launch = function launch() {
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
      detail: {
        items
      }
    }));
    onGoToStudy == null || onGoToStudy();
  };
  var card = function card(inner, accent) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border rounded-2xl p-4 sm:p-5 space-y-3 " + (accent ? 'border-[var(--accent-border)]' : 'border-[var(--border-soft)]')
    }, inner);
  };
  if (state === 'generating') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's MCAT"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Writing today's ", DAILY_EXAM_COUNT, " questions with Gemini \u2014 about 20 seconds\u2026")));
  if (state === 'error') return card(React.createElement("div", null, React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's MCAT"), React.createElement("button", {
    onClick: generate,
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Retry")), React.createElement("p", {
    className: "text-sm text-[var(--danger-text)] mt-1 break-words whitespace-pre-wrap"
  }, err)));
  if (state === 'unavailable') return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's MCAT"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Add your Gemini API key in Settings to get a fresh ", DAILY_EXAM_COUNT, "-question MCAT-style exam each day, written from the chapters you've mastered.")));
  if (state === 'ready' && items.length) {
    var allDone = doneToday >= items.length;
    return card(React.createElement(React.Fragment, null, React.createElement("div", null, React.createElement("div", {
      className: "flex items-center gap-2"
    }, React.createElement("h2", {
      className: "font-semibold text-[var(--text-strong)]"
    }, "Today's MCAT"), !allDone && React.createElement("span", {
      className: "w-2 h-2 rounded-full bg-[var(--danger-border)]"
    })), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)]"
    }, items.length, " fresh MCAT-style questions from chapters you've mastered, written today by Gemini.", doneToday > 0 && !allDone && React.createElement("span", {
      className: "text-[var(--text)]"
    }, " \xB7 ", doneToday, "/", items.length, " done today"), allDone && React.createElement("span", {
      className: "text-[var(--success-text)]"
    }, " \xB7 completed today \u2713"))), React.createElement("button", {
      onClick: launch,
      className: "w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-3 text-sm font-semibold"
    }, allDone ? "Retake today's " + items.length + " \u2192" : "Start " + items.length + "-question exam \u2192")), !allDone);
  }
  if (!mastered.length) return card(React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's MCAT"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Master a lesson first \u2014 pass a chapter's final exam (100%) in the Lessons tab and your daily ", DAILY_EXAM_COUNT, "-question exam will draw from it. Master more and the pool grows.")));
  return card(React.createElement(React.Fragment, null, React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Today's MCAT"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)]"
  }, "A fresh ", DAILY_EXAM_COUNT, "-question MCAT-style exam, written by Gemini from your ", mastered.length, " mastered chapter", mastered.length === 1 ? '' : 's', ".")), React.createElement("button", {
    onClick: generate,
    className: "w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-3 text-sm font-semibold"
  }, "Generate today's exam \u2192")), true);
}
function lessonLatestCorrect(attempts) {
  var best = {};
  for (var _iterator82 = _createForOfIteratorHelperLoose(attempts), _step82; !(_step82 = _iterator82()).done;) {
    var a = _step82.value;
    var cur = best[a.question_id];
    if (!cur || a.ts > cur.ts) best[a.question_id] = {
      ts: a.ts,
      correct: !!a.correct
    };
  }
  var out = {};
  for (var k in best) out[k] = best[k].correct;
  return out;
}
function lessonSectionStatus(sec, latestCorrect) {
  var ids = Array.isArray(sec.check_ids) ? sec.check_ids : [];
  var correct = 0,
    attempted = 0;
  for (var _iterator83 = _createForOfIteratorHelperLoose(ids), _step83; !(_step83 = _iterator83()).done;) {
    var id = _step83.value;
    if (id in latestCorrect) {
      attempted++;
      if (latestCorrect[id]) correct++;
    }
  }
  var thr = typeof sec.mastery_threshold === 'number' ? sec.mastery_threshold : 1.0;
  var mastered = ids.length > 0 && correct / ids.length >= thr;
  return {
    mastered,
    correct,
    attempted,
    total: ids.length
  };
}
var NUCLEOTIDE_LESSON_ID = 'builtin_biochem_nucleotides';
var NUCLEOTIDE_FILE_ID = 'builtin:biochem:nucleotides';
var NUCLEOTIDE_META = {
  file_id: NUCLEOTIDE_FILE_ID,
  chapter: 'Nucleotides',
  subject: 'Biochemistry'
};
var NUCLEOTIDE_LESSON = {
  chapter_id: NUCLEOTIDE_LESSON_ID,
  subject: 'Biochemistry',
  title: 'Nucleotides',
  intro: 'A focused Biochemistry lesson for memorizing nucleotide parts, base identities, DNA versus RNA differences, and the purine/pyrimidine rules that show up on MCAT questions.',
  sections: [{
    id: 'nuc_sec_parts',
    order: 1,
    concept_id: 'nucleotide-parts',
    title: 'What a nucleotide is',
    teach: 'A nucleotide has three parts: a nitrogenous base, a pentose sugar, and one or more phosphate groups. The base is the information-bearing part. The sugar tells you whether the molecule belongs to DNA or RNA. The phosphate gives nucleic acids their negative charge and lets nucleotides link through phosphodiester bonds.\n\nA nucleoside is smaller than a nucleotide: it is only the base plus the sugar. Add phosphate to a nucleoside and it becomes a nucleotide. That distinction is a common MCAT wording trap.',
    worked_examples: [{
      prompt: 'Is adenosine triphosphate a nucleoside or a nucleotide?',
      solution: 'It is a nucleotide because it contains adenine, ribose, and three phosphate groups. Adenosine alone would be the nucleoside.'
    }],
    definition_drills: [{
      term: 'Nucleotide',
      definition: 'A nitrogenous base plus pentose sugar plus at least one phosphate group.'
    }, {
      term: 'Nucleoside',
      definition: 'A nitrogenous base plus pentose sugar, with no phosphate group.'
    }, {
      term: 'Phosphate group',
      definition: 'The negatively charged group that links nucleotides and forms the sugar-phosphate backbone.'
    }, {
      term: 'Pentose sugar',
      definition: 'A five-carbon sugar: ribose in RNA or deoxyribose in DNA.'
    }],
    figures: ['Nucleotide'],
    check_ids: ['nuc_mc_parts_1', 'nuc_mc_parts_2', 'nuc_mc_parts_3', 'nuc_mc_parts_4'],
    mastery_threshold: 1
  }, {
    id: 'nuc_sec_bases',
    order: 2,
    concept_id: 'bases-and-rings',
    title: 'Bases: purines and pyrimidines',
    teach: 'The five major bases are adenine, guanine, cytosine, thymine, and uracil. Adenine and guanine are purines, meaning they have two rings. Cytosine, thymine, and uracil are pyrimidines, meaning they have one ring.\n\nA useful memory hook is "Pure As Gold": purines are A and G. The remaining bases are pyrimidines. DNA uses A, G, C, and T. RNA uses A, G, C, and U, replacing thymine with uracil.',
    worked_examples: [{
      prompt: 'A base has two fused rings and pairs with cytosine. Which base is it?',
      solution: 'Guanine. It is a purine, and G pairs with C.'
    }],
    definition_drills: [{
      term: 'Purines',
      definition: 'Two-ring bases: adenine and guanine.'
    }, {
      term: 'Pyrimidines',
      definition: 'One-ring bases: cytosine, thymine, and uracil.'
    }, {
      term: 'Adenine',
      definition: 'A purine base found in DNA and RNA; pairs with T in DNA and U in RNA.'
    }, {
      term: 'Guanine',
      definition: 'A purine base found in DNA and RNA; pairs with cytosine.'
    }, {
      term: 'Uracil',
      definition: 'An RNA pyrimidine that replaces thymine and pairs with adenine.'
    }],
    figures: ['DNA'],
    check_ids: ['nuc_mc_bases_1', 'nuc_mc_bases_2', 'nuc_mc_bases_3', 'nuc_mc_bases_4'],
    mastery_threshold: 1
  }, {
    id: 'nuc_sec_pairing',
    order: 3,
    concept_id: 'base-pairing',
    title: 'Base pairing and hydrogen bonds',
    teach: 'Complementary base pairing keeps nucleic acid structure predictable. In DNA, adenine pairs with thymine, and guanine pairs with cytosine. In RNA, adenine pairs with uracil instead of thymine.\n\nA-T has two hydrogen bonds. G-C has three hydrogen bonds. More G-C content raises melting temperature because more hydrogen bonding and stronger stacking interactions make the double helix harder to separate.',
    worked_examples: [{
      prompt: 'Which DNA strand is complementary to 5-prime ACGT-3-prime?',
      solution: 'The antiparallel complement is 3-prime TGCA-5-prime. If written 5-prime to 3-prime, it is ACGT.'
    }],
    definition_drills: [{
      term: 'Complementary base pairing',
      definition: 'Specific pairing: A with T or U, and G with C.'
    }, {
      term: 'A-T pair',
      definition: 'A DNA base pair held by two hydrogen bonds.'
    }, {
      term: 'G-C pair',
      definition: 'A DNA or RNA base pair held by three hydrogen bonds.'
    }, {
      term: 'Melting temperature',
      definition: 'The temperature at which double-stranded nucleic acid separates; increased by high G-C content.'
    }],
    figures: ['DNA'],
    check_ids: ['nuc_mc_pairing_1', 'nuc_mc_pairing_2', 'nuc_mc_pairing_3', 'nuc_mc_pairing_4'],
    mastery_threshold: 1
  }, {
    id: 'nuc_sec_sugars',
    order: 4,
    concept_id: 'dna-vs-rna',
    title: 'DNA versus RNA nucleotides',
    teach: 'DNA and RNA differ in sugar, base usage, and usual strand structure. DNA contains deoxyribose, which lacks a 2-prime hydroxyl group. RNA contains ribose, which has a 2-prime hydroxyl group. That 2-prime OH makes RNA more chemically reactive and easier to hydrolyze.\n\nDNA usually uses thymine and is double-stranded. RNA uses uracil and is usually single-stranded. The bases A, G, and C are shared by both.',
    worked_examples: [{
      prompt: 'A nucleotide contains ribose and uracil. Is it more likely from DNA or RNA?',
      solution: 'RNA. RNA uses ribose and uracil; DNA uses deoxyribose and thymine.'
    }],
    definition_drills: [{
      term: 'Ribose',
      definition: 'The RNA sugar, containing a 2-prime hydroxyl group.'
    }, {
      term: 'Deoxyribose',
      definition: 'The DNA sugar, lacking the 2-prime hydroxyl group.'
    }, {
      term: 'Thymine',
      definition: 'A DNA pyrimidine that pairs with adenine.'
    }, {
      term: 'Uracil',
      definition: 'An RNA pyrimidine that pairs with adenine.'
    }],
    figures: ['RNA', 'DNA'],
    check_ids: ['nuc_mc_sugars_1', 'nuc_mc_sugars_2', 'nuc_mc_sugars_3', 'nuc_mc_sugars_4'],
    mastery_threshold: 1
  }, {
    id: 'nuc_sec_linkages',
    order: 5,
    concept_id: 'phosphodiester-bonds',
    title: 'Backbone and directionality',
    teach: 'Nucleotides polymerize through phosphodiester bonds. The phosphate links the 3-prime hydroxyl of one sugar to the 5-prime phosphate of the next sugar, creating a sugar-phosphate backbone.\n\nNucleic acid strands have direction. The 5-prime end has a phosphate, and the 3-prime end has a hydroxyl. Polymerases add new nucleotides to the 3-prime OH, so DNA and RNA synthesis proceeds 5-prime to 3-prime.',
    worked_examples: [{
      prompt: 'Why do polymerases need a free 3-prime OH?',
      solution: 'The incoming nucleotide is joined to the growing strand when the 3-prime OH attacks the incoming 5-prime phosphate, forming the next phosphodiester bond.'
    }],
    definition_drills: [{
      term: 'Phosphodiester bond',
      definition: 'The linkage joining nucleotides through the 3-prime OH and 5-prime phosphate.'
    }, {
      term: '5-prime end',
      definition: 'The end of a nucleic acid strand with a free phosphate.'
    }, {
      term: '3-prime end',
      definition: 'The end of a nucleic acid strand with a free hydroxyl group.'
    }, {
      term: '5-prime to 3-prime synthesis',
      definition: 'The direction of DNA and RNA synthesis as nucleotides are added to the 3-prime OH.'
    }],
    figures: ['DNA replication'],
    check_ids: ['nuc_mc_link_1', 'nuc_mc_link_2', 'nuc_mc_link_3', 'nuc_mc_link_4'],
    mastery_threshold: 1
  }]
};
var NUCLEOTIDE_MCQ = [{
  id: 'nuc_mc_parts_1',
  question: 'Which set lists the three parts of a nucleotide?',
  choices: ['Nitrogenous base, pentose sugar, phosphate group', 'Amino group, carboxyl group, R group', 'Fatty acid, glycerol, phosphate group', 'Base, amino acid, peptide bond'],
  correct_index: 0,
  explanation: 'A nucleotide consists of a nitrogenous base, a five-carbon sugar, and at least one phosphate group.'
}, {
  id: 'nuc_mc_parts_2',
  question: 'A nucleoside differs from a nucleotide because a nucleoside lacks:',
  choices: ['Phosphate', 'A nitrogenous base', 'A pentose sugar', 'A ring structure'],
  correct_index: 0,
  explanation: 'A nucleoside is base plus sugar. Adding phosphate makes it a nucleotide.'
}, {
  id: 'nuc_mc_parts_3',
  question: 'Which part of a nucleotide gives nucleic acids much of their negative charge?',
  choices: ['Phosphate group', 'Ribose ring oxygen', 'Nitrogenous base', 'Hydrogen bonds'],
  correct_index: 0,
  explanation: 'The phosphate groups in the backbone are negatively charged at physiological pH.'
}, {
  id: 'nuc_mc_parts_4',
  question: 'Adenosine triphosphate is best classified as a:',
  choices: ['Nucleotide', 'Nucleoside', 'Amino acid', 'Pyrimidine only'],
  correct_index: 0,
  explanation: 'ATP contains adenine, ribose, and three phosphates, so it is a nucleotide.'
}, {
  id: 'nuc_mc_bases_1',
  question: 'Which bases are purines?',
  choices: ['Adenine and guanine', 'Cytosine and thymine', 'Thymine and uracil', 'Cytosine and uracil'],
  correct_index: 0,
  explanation: 'Purines are adenine and guanine. They have two rings.'
}, {
  id: 'nuc_mc_bases_2',
  question: 'Which base is found in RNA instead of thymine?',
  choices: ['Uracil', 'Guanine', 'Cytosine', 'Adenine'],
  correct_index: 0,
  explanation: 'RNA uses uracil where DNA uses thymine.'
}, {
  id: 'nuc_mc_bases_3',
  question: 'Cytosine, thymine, and uracil are classified as:',
  choices: ['Pyrimidines', 'Purines', 'Nucleosides', 'Pentoses'],
  correct_index: 0,
  explanation: 'C, T, and U are one-ring pyrimidines.'
}, {
  id: 'nuc_mc_bases_4',
  question: 'The memory hook "Pure As Gold" identifies which bases?',
  choices: ['Adenine and guanine', 'Adenine and cytosine', 'Guanine and cytosine', 'Thymine and uracil'],
  correct_index: 0,
  explanation: 'Pure As Gold means purines are A and G.'
}, {
  id: 'nuc_mc_pairing_1',
  question: 'In DNA, adenine pairs with:',
  choices: ['Thymine', 'Uracil', 'Cytosine', 'Guanine'],
  correct_index: 0,
  explanation: 'DNA base pairing is A-T and G-C.'
}, {
  id: 'nuc_mc_pairing_2',
  question: 'Which base pair has three hydrogen bonds?',
  choices: ['G-C', 'A-T', 'A-U', 'T-U'],
  correct_index: 0,
  explanation: 'G-C has three hydrogen bonds; A-T and A-U have two.'
}, {
  id: 'nuc_mc_pairing_3',
  question: 'A DNA molecule with high G-C content generally has:',
  choices: ['Higher melting temperature', 'Lower melting temperature', 'No phosphodiester bonds', 'More uracil'],
  correct_index: 0,
  explanation: 'G-C pairs and stacking interactions stabilize the helix, raising melting temperature.'
}, {
  id: 'nuc_mc_pairing_4',
  question: 'In RNA, adenine usually pairs with:',
  choices: ['Uracil', 'Thymine', 'Guanine', 'Cytosine'],
  correct_index: 0,
  explanation: 'RNA uses uracil, so A pairs with U.'
}, {
  id: 'nuc_mc_sugars_1',
  question: 'The sugar in RNA is:',
  choices: ['Ribose', 'Deoxyribose', 'Glucose', 'Fructose'],
  correct_index: 0,
  explanation: 'RNA contains ribose.'
}, {
  id: 'nuc_mc_sugars_2',
  question: 'Compared with ribose, deoxyribose lacks a hydroxyl group at the:',
  choices: ['2-prime carbon', '1-prime carbon', '3-prime carbon', '5-prime carbon'],
  correct_index: 0,
  explanation: 'Deoxyribose lacks the 2-prime OH found in ribose.'
}, {
  id: 'nuc_mc_sugars_3',
  question: 'Which combination points most directly to RNA?',
  choices: ['Ribose and uracil', 'Deoxyribose and thymine', 'Ribose and thymine', 'Deoxyribose and uracil'],
  correct_index: 0,
  explanation: 'RNA uses ribose and uracil.'
}, {
  id: 'nuc_mc_sugars_4',
  question: 'Why is RNA generally more chemically reactive than DNA?',
  choices: ['RNA has a 2-prime hydroxyl group', 'RNA has thymine', 'RNA lacks phosphate', 'RNA is always double-stranded'],
  correct_index: 0,
  explanation: 'The 2-prime OH in ribose makes RNA more reactive and easier to hydrolyze.'
}, {
  id: 'nuc_mc_link_1',
  question: 'Nucleotides in DNA and RNA are joined by:',
  choices: ['Phosphodiester bonds', 'Peptide bonds', 'Glycosidic bonds between amino acids', 'Disulfide bonds'],
  correct_index: 0,
  explanation: 'The sugar-phosphate backbone is held together by phosphodiester bonds.'
}, {
  id: 'nuc_mc_link_2',
  question: 'A phosphodiester bond links which positions?',
  choices: ['3-prime OH to 5-prime phosphate', '2-prime OH to base nitrogen', '1-prime base to 3-prime base', '5-prime phosphate to 5-prime phosphate'],
  correct_index: 0,
  explanation: 'The backbone linkage joins the 3-prime OH of one sugar to the 5-prime phosphate of the next nucleotide.'
}, {
  id: 'nuc_mc_link_3',
  question: 'DNA and RNA polymerases extend a strand by adding nucleotides to the:',
  choices: ['3-prime hydroxyl', '5-prime phosphate', 'Nitrogenous base', '2-prime hydroxyl only'],
  correct_index: 0,
  explanation: 'New nucleotides are added to the free 3-prime OH, so synthesis proceeds 5-prime to 3-prime.'
}, {
  id: 'nuc_mc_link_4',
  question: 'The 5-prime end of a nucleic acid strand is defined by a free:',
  choices: ['Phosphate group', 'Hydroxyl group', 'Amino group', 'Carboxyl group'],
  correct_index: 0,
  explanation: 'The 5-prime end has a free phosphate; the 3-prime end has a free hydroxyl.'
}];
var NUCLEOTIDE_POOL = NUCLEOTIDE_MCQ.map(function (q) {
  return _extends({
    id: q.id,
    mode: 'mc',
    q
  }, NUCLEOTIDE_META);
});
function isBuiltInLessonId(chapterId) {
  return chapterId === NUCLEOTIDE_LESSON_ID;
}
function builtInLessonFor(chapterId) {
  return isBuiltInLessonId(chapterId) ? NUCLEOTIDE_LESSON : null;
}
function builtInLessonPoolFor(chapterId) {
  return isBuiltInLessonId(chapterId) ? NUCLEOTIDE_POOL : [];
}
function LessonDrillCard(_ref93) {
  var term = _ref93.term,
    definition = _ref93.definition;
  var _useState135 = useState(false),
    show = _useState135[0],
    setShow = _useState135[1];
  return React.createElement("button", {
    onClick: function onClick() {
      return setShow(function (s) {
        return !s;
      });
    },
    className: "text-left w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 hover:bg-[var(--bg-hover)]"
  }, React.createElement("div", {
    className: "text-sm font-medium text-[var(--text-strong)]"
  }, term), show ? React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] mt-1"
  }, definition) : React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-1"
  }, "Tap to reveal definition"));
}
function LessonSection(_ref94) {
  var sec = _ref94.sec,
    status = _ref94.status,
    onQuiz = _ref94.onQuiz,
    locked = _ref94.locked;
  var _useFigureViewer2 = useFigureViewer(),
    openFigure = _useFigureViewer2.open;
  var _useState136 = useState(false),
    open = _useState136[0],
    setOpen = _useState136[1];
  var paras = (sec.teach || '').split(/\n\n+/).map(function (p) {
    return p.trim();
  }).filter(Boolean);
  var drills = Array.isArray(sec.definition_drills) ? sec.definition_drills : [];
  var hasMatch = drills.filter(function (d) {
    return d && d.term && d.definition;
  }).length >= 2;
  var examples = Array.isArray(sec.worked_examples) ? sec.worked_examples : [];
  var figures = (Array.isArray(sec.figures) ? sec.figures : []).map(resolveFigure).filter(Boolean);
  var nChecks = Array.isArray(sec.check_ids) ? sec.check_ids.length : 0;
  if (locked) {
    return React.createElement("div", {
      className: "rounded-xl border border-dashed border-[var(--border-soft)] bg-[var(--bg-card-soft)] p-4 opacity-70"
    }, React.createElement("div", {
      className: "flex items-center justify-between gap-3"
    }, React.createElement("span", {
      className: "font-semibold text-[var(--text-faint)]"
    }, sec.order, ". ", sec.title), React.createElement("span", {
      className: "text-xs px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-faint)] font-medium"
    }, "\uD83D\uDD12 Locked")), React.createElement("p", {
      className: "text-xs text-[var(--text-faint)] mt-1"
    }, "Pass the checkpoint above to unlock this section."));
  }
  return React.createElement("div", {
    className: "rounded-xl border p-4 " + (status.mastered ? 'border-[var(--border-soft)] bg-[var(--bg-card-soft)]' : 'border-[var(--border)] bg-[var(--bg-card)]')
  }, React.createElement("button", {
    onClick: function onClick() {
      return setOpen(function (o) {
        return !o;
      });
    },
    className: "flex items-center justify-between gap-3 w-full text-left"
  }, React.createElement("span", {
    className: "font-semibold text-[var(--text-strong)]"
  }, sec.order, ". ", sec.title), React.createElement("span", {
    className: "flex items-center gap-2 shrink-0"
  }, status.mastered ? React.createElement("span", {
    className: "text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-medium"
  }, "Mastered \u2713") : status.attempted > 0 ? React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, status.correct, "/", status.total, " correct") : React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, "New"), React.createElement("span", {
    className: "text-[var(--text-faint)] text-xs"
  }, open ? '▲' : '▼'))), open && React.createElement("div", {
    className: "mt-3 space-y-3"
  }, paras.map(function (p, i) {
    return React.createElement("p", {
      key: i,
      className: "text-sm text-[var(--text-muted)] leading-relaxed"
    }, React.createElement(FigureText, {
      text: p
    }));
  }), figures.length > 0 && React.createElement("div", {
    className: "space-y-1.5"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-faint)]"
  }, "Figures"), React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, figures.map(function (fig, i) {
    return React.createElement("button", {
      key: i,
      onClick: function onClick() {
        return openFigure(fig.title, fig.label);
      },
      className: "text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)]",
      title: "View figure: " + fig.label
    }, "\uD83D\uDDBC ", fig.label);
  }))), examples.length > 0 && React.createElement("div", {
    className: "space-y-2"
  }, examples.map(function (ex, i) {
    return React.createElement("div", {
      key: i,
      className: "bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg p-3"
    }, React.createElement("div", {
      className: "text-xs uppercase tracking-wide text-[var(--text-faint)] mb-1"
    }, "Worked example"), React.createElement("div", {
      className: "text-sm text-[var(--text-strong)] whitespace-pre-wrap"
    }, ex.prompt), React.createElement("div", {
      className: "text-sm text-[var(--text-muted)] whitespace-pre-wrap mt-2"
    }, ex.solution));
  })), drills.length > 0 && React.createElement("div", {
    className: "space-y-1.5"
  }, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-faint)]"
  }, "Key terms"), React.createElement("div", {
    className: "grid gap-1.5 sm:grid-cols-2"
  }, drills.map(function (d, i) {
    return React.createElement(LessonDrillCard, {
      key: i,
      term: d.term,
      definition: d.definition
    });
  }))), nChecks > 0 && React.createElement("div", {
    className: "space-y-1"
  }, React.createElement("button", {
    onClick: onQuiz,
    className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
  }, status.mastered ? 'Quiz again' : 'Quiz this section', " (", nChecks, ") \u2192"), hasMatch && React.createElement("div", {
    className: "text-xs text-[var(--text-faint)]"
  }, "Ends with a quick term-matching review."))));
}
function LessonGateQuiz(_ref95) {
  var kind = _ref95.kind,
    pool = _ref95.pool,
    need = _ref95.need,
    onPass = _ref95.onPass,
    onCancel = _ref95.onCancel;
  var _useApp19 = useApp(),
    addAttempt = _useApp19.addAttempt,
    updateLastAttempt = _useApp19.updateLastAttempt;
  var _useState137 = useState(0),
    round = _useState137[0],
    setRound = _useState137[1];
  var items = useMemo(function () {
    return shuffle(pool).slice(0, need);
  }, [pool, need, round]);
  var _useState138 = useState(0),
    index = _useState138[0],
    setIndex = _useState138[1];
  var _useState139 = useState(false),
    answered = _useState139[0],
    setAnswered = _useState139[1];
  var _useState140 = useState(0),
    correctCount = _useState140[0],
    setCorrectCount = _useState140[1];
  var _useState141 = useState(0),
    scoredCount = _useState141[0],
    setScoredCount = _useState141[1];
  var _useState142 = useState({}),
    answers = _useState142[0],
    setAnswers = _useState142[1];
  var _useState143 = useState(false),
    done = _useState143[0],
    setDone = _useState143[1];
  var _useState144 = useState(false),
    showCalc = _useState144[0],
    setShowCalc = _useState144[1];
  var _useState145 = useState(false),
    calcMin = _useState145[0],
    setCalcMin = _useState145[1];
  var _useState146 = useState(''),
    calcExpr = _useState146[0],
    setCalcExpr = _useState146[1];
  var _useState147 = useState(false),
    showTable = _useState147[0],
    setShowTable = _useState147[1];
  var total = items.length;
  var scoreTotal = items.length;
  var item = items[index];
  var label = kind === 'final' ? 'Final exam' : 'Checkpoint quiz';
  var restart = function restart() {
    setRound(function (r) {
      return r + 1;
    });
    setIndex(0);
    setAnswered(false);
    setCorrectCount(0);
    setScoredCount(0);
    setAnswers({});
    setDone(false);
  };
  if (total === 0) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-3"
    }, React.createElement("h2", {
      className: "font-semibold text-[var(--text-strong)]"
    }, label), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)]"
    }, "No multiple-choice questions are available for this checkpoint yet."), React.createElement("button", {
      onClick: onCancel,
      className: "text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
    }, "\u2190 Back to lesson"));
  }
  if (done) {
    var passed = correctCount === scoreTotal;
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 space-y-4 text-center"
    }, React.createElement("div", {
      className: "text-4xl"
    }, passed ? '🎉' : '🔁'), React.createElement("h2", {
      className: "font-semibold text-[var(--text-strong)]"
    }, passed ? label + " passed!" : 'Not quite — 100% required'), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)]"
    }, "You scored ", correctCount, "/", scoreTotal, ".", passed ? '' : ' The quiz will reshuffle and restart from the top.'), React.createElement("div", {
      className: "flex items-center justify-center gap-2"
    }, passed ? React.createElement("button", {
      onClick: onPass,
      className: "px-4 py-2 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
    }, kind === 'final' ? 'Master chapter →' : 'Unlock next sections →') : React.createElement("button", {
      onClick: restart,
      className: "px-4 py-2 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
    }, "Restart quiz"), React.createElement("button", {
      onClick: onCancel,
      className: "px-4 py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
    }, "Back to lesson")));
  }
  var handleAnswer = function handleAnswer(_ref96) {
    var correct = _ref96.correct,
      user_answer = _ref96.user_answer,
      isInterim = _ref96.isInterim;
    if (isInterim || answered) return;
    setAnswered(true);
    setAnswers(function (prev) {
      return _extends({}, prev, {
        [item.id]: !!correct
      });
    });
    setScoredCount(function (c) {
      return c + 1;
    });
    if (correct) setCorrectCount(function (c) {
      return c + 1;
    });
    addAttempt({
      question_id: item.id,
      mode: item.mode,
      file_id: item.file_id,
      chapter: item.chapter,
      subject: item.subject,
      correct,
      user_answer
    });
  };
  var handleAnswerOverride = function handleAnswerOverride(_ref97) {
    var correct = _ref97.correct;
    if (!answered) return;
    var nextCorrect = !!correct;
    updateLastAttempt(item.id, {
      correct: nextCorrect
    });
    setAnswers(function (prev) {
      var previous = prev[item.id];
      if (previous === undefined || previous === nextCorrect) return prev;
      setCorrectCount(function (c) {
        return c + (nextCorrect ? 1 : -1);
      });
      return _extends({}, prev, {
        [item.id]: nextCorrect
      });
    });
  };
  var next = function next() {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex(function (i) {
      return i + 1;
    });
    setAnswered(false);
  };
  var nextBtn = answered ? React.createElement("button", {
    onClick: next,
    className: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium shrink-0"
  }, index + 1 >= total ? 'See score' : 'Next →') : null;
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] min-w-0"
  }, React.createElement("span", {
    className: "text-[var(--text-strong)]"
  }, label), React.createElement("span", {
    className: "ml-2"
  }, "\xB7 ", index + 1, "/", total, " \xB7 need 100%")), React.createElement("div", {
    className: "flex items-center gap-1.5 shrink-0"
  }, React.createElement("button", {
    onClick: function onClick() {
      setShowCalc(true);
      setCalcMin(false);
    },
    title: "Open calculator",
    "aria-label": "Open calculator",
    className: "text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
  }, "\uD83E\uDDEE"), React.createElement("button", {
    onClick: function onClick() {
      return setShowTable(true);
    },
    title: "Open periodic table",
    "aria-label": "Open periodic table",
    className: "text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
  }, "\u269B\uFE0F"), React.createElement("span", {
    className: "text-xs font-mono text-[var(--text-muted)]"
  }, correctCount, "/", scoredCount), React.createElement("button", {
    onClick: onCancel,
    className: "text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1"
  }, "Quit"))), React.createElement("div", {
    className: "h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden"
  }, React.createElement("div", {
    className: "h-full bg-[var(--accent-hover)] transition-all",
    style: {
      width: (index + (answered ? 1 : 0)) / total * 100 + "%"
    }
  })), React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, item.mode === 'two_part' ? React.createElement(TwoPartQuestion, {
    key: item.id,
    item: item,
    onAnswer: handleAnswer,
    nextSlot: nextBtn
  }) : item.mode === 'short' ? React.createElement(ShortAnswerQuestion, {
    key: item.id,
    item: item,
    onAnswer: handleAnswer,
    onAnswerOverride: handleAnswerOverride,
    nextSlot: nextBtn
  }) : React.createElement(MCQuestion, {
    key: item.id,
    item: item,
    onAnswer: handleAnswer,
    nextSlot: nextBtn
  })), showCalc && React.createElement(CalculatorModal, {
    expr: calcExpr,
    setExpr: setCalcExpr,
    minimized: calcMin,
    onMinimize: function onMinimize() {
      return setCalcMin(function (m) {
        return !m;
      });
    },
    onClose: function onClose() {
      setShowCalc(false);
      setCalcMin(false);
      setCalcExpr('');
    }
  }), showTable && React.createElement(PeriodicTableModal, {
    onClose: function onClose() {
      return setShowTable(false);
    }
  }));
}
function ForceMasterModal(_ref98) {
  var lessonTitle = _ref98.lessonTitle,
    username = _ref98.username,
    onVerifyPin = _ref98.onVerifyPin,
    onConfirmMaster = _ref98.onConfirmMaster,
    onClose = _ref98.onClose;
  var _useState148 = useState('confirm'),
    step = _useState148[0],
    setStep = _useState148[1];
  var _useState149 = useState(''),
    pin = _useState149[0],
    setPin = _useState149[1];
  var _useState150 = useState(''),
    err = _useState150[0],
    setErr = _useState150[1];
  var _useState151 = useState(false),
    busy = _useState151[0],
    setBusy = _useState151[1];
  var submitPin = function () {
    var _ref99 = _asyncToGenerator(_regenerator().m(function _callee51() {
      var _t39;
      return _regenerator().w(function (_context56) {
        while (1) switch (_context56.p = _context56.n) {
          case 0:
            if (!busy) {
              _context56.n = 1;
              break;
            }
            return _context56.a(2);
          case 1:
            if (/^\d{4}$/.test(pin)) {
              _context56.n = 2;
              break;
            }
            setErr('Enter your 4-digit PIN.');
            return _context56.a(2);
          case 2:
            setBusy(true);
            setErr('');
            _context56.p = 3;
            _context56.n = 4;
            return onVerifyPin(pin);
          case 4:
            onConfirmMaster();
            onClose();
            _context56.n = 6;
            break;
          case 5:
            _context56.p = 5;
            _t39 = _context56.v;
            setErr('Incorrect PIN. Try again.');
            setBusy(false);
          case 6:
            return _context56.a(2);
        }
      }, _callee51, null, [[3, 5]]);
    }));
    return function submitPin() {
      return _ref99.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3",
    onClick: onClose
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-sm w-full",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, step === 'confirm' ? React.createElement(React.Fragment, null, React.createElement("h3", {
    className: "text-base font-semibold text-[var(--text-strong)]"
  }, "Master without completing?"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed"
  }, "You haven't passed the checkpoints and final exam for ", React.createElement("span", {
    className: "text-[var(--text-strong)]"
  }, "\"", lessonTitle, "\""), ". Are you sure you want to mark it ", React.createElement("span", {
    className: "text-[var(--text-strong)] font-medium"
  }, "mastered"), " anyway?"), React.createElement("div", {
    className: "flex justify-end gap-2 mt-4"
  }, React.createElement("button", {
    onClick: onClose,
    className: "text-sm px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
  }, "Cancel"), React.createElement("button", {
    onClick: function onClick() {
      setErr('');
      setStep('password');
    },
    className: "text-sm px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
  }, "Yes, continue \u2192"))) : username ? React.createElement(React.Fragment, null, React.createElement("h3", {
    className: "text-base font-semibold text-[var(--text-strong)]"
  }, "Confirm with your PIN"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed"
  }, "Enter the account PIN for ", React.createElement("span", {
    className: "font-mono text-[var(--text-strong)]"
  }, "@", username), " to master this lesson."), React.createElement("input", {
    type: "password",
    inputMode: "numeric",
    maxLength: 4,
    value: pin,
    autoFocus: true,
    onChange: function onChange(e) {
      setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
      setErr('');
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === 'Enter' && submitPin();
    },
    placeholder: "\u2022\u2022\u2022\u2022",
    className: "mt-3 w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[var(--accent-border)]"
  }), err && React.createElement("p", {
    className: "text-[var(--danger-text)] text-xs mt-2"
  }, err), React.createElement("div", {
    className: "flex justify-end gap-2 mt-4"
  }, React.createElement("button", {
    onClick: onClose,
    className: "text-sm px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
  }, "Cancel"), React.createElement("button", {
    onClick: submitPin,
    disabled: busy || pin.length !== 4,
    className: "text-sm px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40"
  }, busy ? 'Checking…' : 'Master ✓'))) : React.createElement(React.Fragment, null, React.createElement("h3", {
    className: "text-base font-semibold text-[var(--text-strong)]"
  }, "Sign in required"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-2 leading-relaxed"
  }, "You need to be signed in to your account to master a lesson this way. Open the Account tab, log in, then try again."), React.createElement("div", {
    className: "flex justify-end mt-4"
  }, React.createElement("button", {
    onClick: onClose,
    className: "text-sm px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
  }, "Close")))));
}
function lessonGateQuizEligible(item) {
  var _item$q, _item$q2, _item$q3, _item$q4;
  if (!item) return false;
  if (item.mode === 'short' || ((_item$q = item.q) == null ? void 0 : _item$q.mode) === 'short') return true;
  if (item.mode === 'mc') return Array.isArray((_item$q2 = item.q) == null ? void 0 : _item$q2.choices) && Number.isInteger((_item$q3 = item.q) == null ? void 0 : _item$q3.correct_index);
  if (item.mode === 'two_part') return !(((_item$q4 = item.q) == null ? void 0 : _item$q4.parts) || []).some(function (p) {
    return p && p.draw;
  });
  return false;
}
function LessonReader(_ref100) {
  var lesson = _ref100.lesson,
    latestCorrect = _ref100.latestCorrect,
    completed = _ref100.completed,
    gate = _ref100.gate,
    quizPool = _ref100.quizPool,
    onBack = _ref100.onBack,
    onQuizSection = _ref100.onQuizSection,
    onMarkComplete = _ref100.onMarkComplete,
    onPassCheckpoint = _ref100.onPassCheckpoint,
    onMaster = _ref100.onMaster,
    username = _ref100.username,
    onVerifyPin = _ref100.onVerifyPin;
  var sections = [].concat(lesson.sections || []).sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  var statuses = sections.map(function (s) {
    return lessonSectionStatus(s, latestCorrect);
  });
  var masteredCount = statuses.filter(function (s) {
    return s.mastered;
  }).length;
  var total = sections.length;
  var G = LESSON_GROUP_SIZE;
  var groupCount = Math.ceil(total / G);
  var mastered = !!(gate != null && gate.mastered);
  var unlocked = mastered ? total : Math.min(total, Math.max(G, (gate == null ? void 0 : gate.unlocked) || G));
  var allUnlocked = unlocked >= total;
  var _useState152 = useState(null),
    quiz = _useState152[0],
    setQuiz = _useState152[1];
  var _useState153 = useState(false),
    forceMaster = _useState153[0],
    setForceMaster = _useState153[1];
  var poolThrough = function poolThrough(end) {
    var ids = new Set();
    for (var k = 0; k < end; k++) {
      for (var _iterator84 = _createForOfIteratorHelperLoose(sections[k].check_ids || []), _step84; !(_step84 = _iterator84()).done;) {
        var id = _step84.value;
        ids.add(id);
      }
    }
    return quizPool.filter(function (x) {
      return ids.has(x.id) && lessonGateQuizEligible(x);
    });
  };
  var startCheckpoint = function startCheckpoint(groupEndIndex) {
    var pool = poolThrough(groupEndIndex);
    setQuiz({
      kind: 'checkpoint',
      pool,
      need: Math.min(LESSON_CHECKPOINT_Q, pool.length),
      unlockTo: Math.min(total, groupEndIndex + G)
    });
  };
  var startFinal = function startFinal() {
    var pool = poolThrough(total);
    setQuiz({
      kind: 'final',
      pool,
      need: Math.min(LESSON_FINAL_Q, pool.length)
    });
  };
  if (quiz) {
    return React.createElement("div", {
      className: "space-y-3"
    }, React.createElement("button", {
      onClick: function onClick() {
        return setQuiz(null);
      },
      className: "text-xs text-[var(--text-muted)] hover:text-[var(--text-strong)]"
    }, "\u2190 ", lesson.title), React.createElement(LessonGateQuiz, {
      kind: quiz.kind,
      pool: quiz.pool,
      need: quiz.need,
      onCancel: function onCancel() {
        return setQuiz(null);
      },
      onPass: function onPass() {
        if (quiz.kind === 'final') onMaster();else onPassCheckpoint(quiz.unlockTo);
        setQuiz(null);
      }
    }));
  }
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("button", {
    onClick: onBack,
    className: "text-xs text-[var(--text-muted)] hover:text-[var(--text-strong)] mb-2"
  }, "\u2190 Back to lessons"), React.createElement("div", {
    className: "flex items-start justify-between gap-3"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, lesson.title), mastered && React.createElement("span", {
    className: "text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-medium shrink-0"
  }, "Mastered \u2713")), lesson.intro && React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1 leading-relaxed"
  }, lesson.intro), React.createElement("div", {
    className: "flex items-center justify-between gap-3 mt-3"
  }, React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, masteredCount, "/", total, " sections mastered \xB7 ", Math.min(unlocked, total), "/", total, " unlocked", completed ? ' · marked complete' : ''), !completed && React.createElement("button", {
    onClick: onMarkComplete,
    className: "text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-strong)]"
  }, mastered ? 'Mark complete' : 'Mark complete anyway'))), Array.from({
    length: groupCount
  }).map(function (_, g) {
    var startIdx = g * G;
    var endIdx = Math.min(startIdx + G, total);
    var isLastGroup = endIdx >= total;
    var groupUnlocked = unlocked >= endIdx;
    var checkpointPassed = unlocked > endIdx || mastered;
    return React.createElement(React.Fragment, {
      key: g
    }, sections.slice(startIdx, endIdx).map(function (sec, j) {
      var i = startIdx + j;
      var locked = !mastered && i >= unlocked;
      return React.createElement(LessonSection, {
        key: sec.id || i,
        sec: sec,
        status: statuses[i],
        onQuiz: function onQuiz() {
          return onQuizSection(sec);
        },
        locked: locked
      });
    }), !isLastGroup && React.createElement("div", {
      className: "rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4 flex items-center justify-between gap-3 flex-wrap"
    }, checkpointPassed ? React.createElement("span", {
      className: "text-sm text-green-500 font-medium"
    }, "\u2713 Checkpoint ", g + 1, " passed") : groupUnlocked ? React.createElement(React.Fragment, null, React.createElement("span", {
      className: "text-sm text-[var(--text-strong)]"
    }, "Checkpoint ", g + 1, " \u2014 ", LESSON_CHECKPOINT_Q, " cumulative questions, 100% to unlock the next sections."), React.createElement("button", {
      onClick: function onClick() {
        return startCheckpoint(endIdx);
      },
      className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0"
    }, "Take checkpoint \u2192")) : React.createElement("span", {
      className: "text-sm text-[var(--text-faint)]"
    }, "\uD83D\uDD12 Pass the previous checkpoint to reach this one.")));
  }), React.createElement("div", {
    className: "rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-3 flex-wrap"
  }, mastered ? React.createElement("span", {
    className: "text-sm text-green-500 font-medium"
  }, "\uD83C\uDFC6 Chapter mastered \u2014 you scored 100% on the final exam.") : React.createElement(React.Fragment, null, allUnlocked ? React.createElement(React.Fragment, null, React.createElement("span", {
    className: "text-sm text-[var(--text-strong)]"
  }, "Final exam \u2014 ", LESSON_FINAL_Q, " cumulative questions, 100% to master this chapter."), React.createElement("button", {
    onClick: startFinal,
    className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0"
  }, "Take final exam \u2192")) : React.createElement(React.Fragment, null, React.createElement("span", {
    className: "text-sm text-[var(--text-strong)]"
  }, "Final exam \u2014 available anytime, 100% to master this chapter."), React.createElement("button", {
    onClick: startFinal,
    className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0"
  }, "Take final exam early \u2192")), React.createElement("button", {
    onClick: function onClick() {
      return setForceMaster(true);
    },
    title: "Mark this lesson mastered without taking the exam (requires your account PIN)",
    className: "text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-strong)] shrink-0"
  }, "Master without the exam"))), forceMaster && React.createElement(ForceMasterModal, {
    lessonTitle: lesson.title,
    username: username,
    onVerifyPin: onVerifyPin,
    onConfirmMaster: onMaster,
    onClose: function onClose() {
      return setForceMaster(false);
    }
  }));
}
function LessonsView(_ref101) {
  var onGoToStudy = _ref101.onGoToStudy;
  var _useApp20 = useApp(),
    api = _useApp20.api,
    session = _useApp20.session,
    files = _useApp20.files,
    questions = _useApp20.questions,
    extractions = _useApp20.extractions,
    attempts = _useApp20.attempts,
    stateRev = _useApp20.stateRev;
  var _useState154 = useState(false),
    showAll = _useState154[0],
    setShowAll = _useState154[1];
  var _useState155 = useState('subject'),
    sortBy = _useState155[0],
    setSortBy = _useState155[1];
  var _useState156 = useState({}),
    openSubjects = _useState156[0],
    setOpenSubjects = _useState156[1];
  var toggleSubject = function toggleSubject(s) {
    return setOpenSubjects(function (m) {
      return _extends({}, m, {
        [s]: !m[s]
      });
    });
  };
  var _useState157 = useState(function () {
      return storage.get(KEYS.lessonsCache, {}) || {};
    }),
    lessonsCache = _useState157[0],
    setLessonsCache = _useState157[1];
  var _useState158 = useState(function () {
      return storage.get(KEYS.lessonProgress, {}) || {};
    }),
    progress = _useState158[0],
    setProgress = _useState158[1];
  var _useState159 = useState(function () {
      return storage.get(KEYS.lessonGates, {}) || {};
    }),
    gates = _useState159[0],
    setGates = _useState159[1];
  var _useState160 = useState({}),
    availMap = _useState160[0],
    setAvailMap = _useState160[1];
  var _useState161 = useState({}),
    busy = _useState161[0],
    setBusy = _useState161[1];
  var _useState162 = useState(null),
    openId = _useState162[0],
    setOpenId = _useState162[1];
  var _useState163 = useState(''),
    error = _useState163[0],
    setError = _useState163[1];
  var fileToChapter = useMemo(function () {
    var m = {};
    for (var _iterator85 = _createForOfIteratorHelperLoose(files), _step85; !(_step85 = _iterator85()).done;) {
      var f = _step85.value;
      if (f.chapter_id) m[f.file_id] = f.chapter_id;
    }
    return m;
  }, [files]);
  var chapterToFile = useMemo(function () {
    var m = {};
    for (var _iterator86 = _createForOfIteratorHelperLoose(files), _step86; !(_step86 = _iterator86()).done;) {
      var f = _step86.value;
      if (f.chapter_id) m[f.chapter_id] = f.file_id;
    }
    return m;
  }, [files]);
  useEffect(function () {
    var cancelled = false;
    _asyncToGenerator(_regenerator().m(function _callee52() {
      var data, m, _iterator87, _step87, _ch$stages2, ch, _t40;
      return _regenerator().w(function (_context57) {
        while (1) switch (_context57.p = _context57.n) {
          case 0:
            _context57.p = 0;
            _context57.n = 1;
            return api.listChapters();
          case 1:
            data = _context57.v;
            if (!cancelled) {
              _context57.n = 2;
              break;
            }
            return _context57.a(2);
          case 2:
            m = {};
            for (_iterator87 = _createForOfIteratorHelperLoose((data == null ? void 0 : data.chapters) || []); !(_step87 = _iterator87()).done;) {
              ch = _step87.value;
              m[ch.id] = !!((_ch$stages2 = ch.stages) != null && (_ch$stages2 = _ch$stages2.lesson) != null && _ch$stages2.done);
            }
            setAvailMap(m);
            _context57.n = 4;
            break;
          case 3:
            _context57.p = 3;
            _t40 = _context57.v;
          case 4:
            return _context57.a(2);
        }
      }, _callee52, null, [[0, 3]]);
    }))();
    return function () {
      cancelled = true;
    };
  }, [api]);
  var latestCorrect = useMemo(function () {
    return lessonLatestCorrect(attempts);
  }, [attempts]);
  var persistCache = function persistCache(next) {
    setLessonsCache(next);
    storage.set(KEYS.lessonsCache, next);
  };
  var persistProgress = function persistProgress(next) {
    setProgress(next);
    storage.set(KEYS.lessonProgress, next);
    markStateDirty();
  };
  var persistGates = function persistGates(next) {
    setGates(next);
    storage.set(KEYS.lessonGates, next);
    markStateDirty();
  };
  useEffect(function () {
    setProgress(storage.get(KEYS.lessonProgress, {}) || {});
    setGates(storage.get(KEYS.lessonGates, {}) || {});
  }, [stateRev]);
  var gateFor = function gateFor(chapterId) {
    return gates[chapterId] || {
      unlocked: LESSON_GROUP_SIZE,
      mastered: false
    };
  };
  var passCheckpoint = function passCheckpoint(chapterId, unlockTo) {
    var g = gateFor(chapterId);
    persistGates(_extends({}, gates, {
      [chapterId]: _extends({}, g, {
        unlocked: Math.max(g.unlocked || 0, unlockTo)
      })
    }));
  };
  var masterChapter = function masterChapter(chapterId) {
    var g = gateFor(chapterId);
    persistGates(_extends({}, gates, {
      [chapterId]: _extends({}, g, {
        mastered: true,
        mastered_at: Date.now()
      })
    }));
  };
  var verifyPin = function () {
    var _ref103 = _asyncToGenerator(_regenerator().m(function _callee53(pin) {
      return _regenerator().w(function (_context58) {
        while (1) switch (_context58.n) {
          case 0:
            if (session != null && session.username) {
              _context58.n = 1;
              break;
            }
            throw new Error('Not signed in');
          case 1:
            _context58.n = 2;
            return api.login({
              username: session.username,
              pin
            });
          case 2:
            return _context58.a(2);
        }
      }, _callee53);
    }));
    return function verifyPin(_x63) {
      return _ref103.apply(this, arguments);
    };
  }();
  var lessonQuizPoolFor = function lessonQuizPoolFor(chapterId) {
    if (isBuiltInLessonId(chapterId)) return builtInLessonPoolFor(chapterId);
    var fid = chapterToFile[chapterId];
    if (!fid) return [];
    var scope = {
      fileIds: new Set([fid])
    };
    var ctx = {
      files,
      questions,
      extractions,
      attempts
    };
    return [].concat(buildPool(ctx, 'mc', scope), buildPool(ctx, 'short', scope));
  };
  var downloadLesson = function () {
    var _ref104 = _asyncToGenerator(_regenerator().m(function _callee54(chapterId) {
      var builtIn, full, lesson, _t41;
      return _regenerator().w(function (_context59) {
        while (1) switch (_context59.p = _context59.n) {
          case 0:
            if (chapterId) {
              _context59.n = 1;
              break;
            }
            return _context59.a(2);
          case 1:
            builtIn = builtInLessonFor(chapterId);
            if (!builtIn) {
              _context59.n = 2;
              break;
            }
            persistCache(_extends({}, lessonsCache, {
              [chapterId]: builtIn
            }));
            setOpenId(chapterId);
            return _context59.a(2);
          case 2:
            setBusy(function (b) {
              return _extends({}, b, {
                [chapterId]: true
              });
            });
            setError('');
            _context59.p = 3;
            _context59.n = 4;
            return api.getChapter(chapterId);
          case 4:
            full = _context59.v;
            lesson = full == null ? void 0 : full.lesson;
            if (!(!lesson || !Array.isArray(lesson.sections))) {
              _context59.n = 5;
              break;
            }
            setError('No lesson is available for that chapter yet.');
            return _context59.a(2);
          case 5:
            persistCache(_extends({}, lessonsCache, {
              [chapterId]: lesson
            }));
            setOpenId(chapterId);
            _context59.n = 7;
            break;
          case 6:
            _context59.p = 6;
            _t41 = _context59.v;
            setError((_t41 == null ? void 0 : _t41.message) || 'Download failed.');
          case 7:
            _context59.p = 7;
            setBusy(function (b) {
              var n = _extends({}, b);
              delete n[chapterId];
              return n;
            });
            return _context59.f(7);
          case 8:
            return _context59.a(2);
        }
      }, _callee54, null, [[3, 6, 7, 8]]);
    }));
    return function downloadLesson(_x64) {
      return _ref104.apply(this, arguments);
    };
  }();
  var removeLesson = function removeLesson(chapterId) {
    var next = _extends({}, lessonsCache);
    delete next[chapterId];
    persistCache(next);
    if (openId === chapterId) setOpenId(null);
  };
  var markComplete = function markComplete(chapterId) {
    persistProgress(_extends({}, progress, {
      [chapterId]: {
        completed_at: Date.now()
      }
    }));
  };
  var quizSection = function quizSection(chapterId, sec) {
    if (isBuiltInLessonId(chapterId)) {
      var _want = new Set(sec.check_ids || []);
      var _checks = shuffle(builtInLessonPoolFor(chapterId).filter(function (x) {
        return _want.has(x.id);
      }));
      var _drills = (Array.isArray(sec.definition_drills) ? sec.definition_drills : []).filter(function (d) {
        return d && d.term && d.definition;
      });
      var _matchId = "lmatch_" + (sec.id || sec.concept_id);
      var _matchItem = _drills.length >= 2 ? _extends({
        id: _matchId,
        mode: 'match',
        studyOnly: true,
        q: {
          id: _matchId,
          terms: _drills
        }
      }, NUCLEOTIDE_META) : null;
      var _items = _matchItem ? [].concat(_checks, [_matchItem]) : _checks;
      if (!_items.length) return;
      sfxQuizStart();
      window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
        detail: {
          items: _items
        }
      }));
      onGoToStudy == null || onGoToStudy();
      return;
    }
    var fid = chapterToFile[chapterId];
    if (!fid) return;
    var ctx = {
      files,
      questions,
      extractions,
      attempts
    };
    var scope = {
      fileIds: new Set([fid])
    };
    var pool = [].concat(buildPool(ctx, 'mc', scope), buildPool(ctx, 'short', scope));
    var want = new Set(sec.check_ids || []);
    var checks = shuffle(pool.filter(function (x) {
      return want.has(x.id);
    }));
    var f = files.find(function (x) {
      return x.file_id === fid;
    });
    var meta = {
      file_id: fid,
      chapter: f == null ? void 0 : f.chapter,
      subject: f == null ? void 0 : f.subject
    };
    var drills = (Array.isArray(sec.definition_drills) ? sec.definition_drills : []).filter(function (d) {
      return d && d.term && d.definition;
    });
    var matchId = "lmatch_" + (sec.id || sec.concept_id);
    var matchItem = drills.length >= 2 ? _extends({
      id: matchId,
      mode: 'match',
      studyOnly: true,
      q: {
        id: matchId,
        terms: drills
      }
    }, meta) : null;
    var items = matchItem ? [].concat(checks, [matchItem]) : checks;
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
      detail: {
        items
      }
    }));
    onGoToStudy == null || onGoToStudy();
  };
  var rows = useMemo(function () {
    var chapterFileIds = new Set(files.map(function (f) {
      return f.file_id;
    }));
    var byChapter = {};
    for (var _iterator88 = _createForOfIteratorHelperLoose(files), _step88; !(_step88 = _iterator88()).done;) {
      var f = _step88.value;
      if (!f.file_id) continue;
      var q = questions[f.file_id];
      if (!q || !q.mc) continue;
      byChapter[f.file_id] = {
        correct: 0,
        total: 0,
        chapter: f.chapter,
        subject: f.subject
      };
    }
    for (var _iterator89 = _createForOfIteratorHelperLoose(attempts), _step89; !(_step89 = _iterator89()).done;) {
      var a = _step89.value;
      var key = a.file_id;
      if (!chapterFileIds.has(key)) continue;
      if (!byChapter[key]) byChapter[key] = {
        correct: 0,
        total: 0,
        chapter: a.chapter,
        subject: a.subject
      };
      byChapter[key].total++;
      if (a.correct) byChapter[key].correct++;
    }
    var wrongIds = new Set();
    var seenIds = new Set();
    for (var _iterator90 = _createForOfIteratorHelperLoose(attempts), _step90; !(_step90 = _iterator90()).done;) {
      var _a = _step90.value;
      seenIds.add(_a.question_id);
      if (!_a.correct) wrongIds.add(_a.question_id);
    }
    var out = Object.entries(byChapter).map(function (_ref105) {
      var fid = _ref105[0],
        s = _ref105[1];
      var pool = buildPool({
        files,
        questions,
        extractions,
        attempts
      }, 'mc', {
        fileIds: new Set([fid])
      });
      var need = pool.filter(function (x) {
        return wrongIds.has(x.id) || !seenIds.has(x.id);
      }).length;
      return {
        fid,
        chapterId: fileToChapter[fid] || null,
        acc: s.total ? s.correct / s.total : 1,
        correct: s.correct,
        total: s.total,
        chapter: s.chapter,
        subject: s.subject,
        need
      };
    });
    if (sortBy === 'subject') {
      var subjectRank = function subjectRank(s) {
        return /behavior/i.test(s || '') ? '0' : "1" + (s || '').toLowerCase();
      };
      out.sort(function (a, b) {
        return subjectRank(a.subject).localeCompare(subjectRank(b.subject)) || (a.chapter || '').localeCompare(b.chapter || '', undefined, {
          numeric: true
        });
      });
    } else {
      out.sort(function (a, b) {
        return a.acc - b.acc || b.total - a.total;
      });
    }
    return out;
  }, [files, questions, extractions, attempts, fileToChapter, sortBy]);
  var launchReview = function launchReview(fid) {
    if (fid === NUCLEOTIDE_FILE_ID) {
      var latest = lessonLatestCorrect(attempts);
      var _misses = NUCLEOTIDE_POOL.filter(function (x) {
        return latest[x.id] === false;
      });
      var _unseen = NUCLEOTIDE_POOL.filter(function (x) {
        return !(x.id in latest);
      });
      var _mastered = NUCLEOTIDE_POOL.filter(function (x) {
        return latest[x.id] === true;
      });
      var _items2 = [].concat(shuffle(_misses), shuffle(_unseen), shuffle(_mastered)).slice(0, 15);
      if (!_items2.length) return;
      sfxQuizStart();
      window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
        detail: {
          items: _items2
        }
      }));
      onGoToStudy == null || onGoToStudy();
      return;
    }
    var pool = buildPool({
      files,
      questions,
      extractions,
      attempts
    }, 'mc', {
      fileIds: new Set([fid])
    });
    if (!pool.length) return;
    var wrongIds = new Set();
    var seenIds = new Set();
    for (var _iterator91 = _createForOfIteratorHelperLoose(attempts), _step91; !(_step91 = _iterator91()).done;) {
      var a = _step91.value;
      seenIds.add(a.question_id);
      if (!a.correct) wrongIds.add(a.question_id);
    }
    var misses = pool.filter(function (x) {
      return wrongIds.has(x.id);
    });
    var unseen = pool.filter(function (x) {
      return !seenIds.has(x.id);
    });
    var mastered = pool.filter(function (x) {
      return seenIds.has(x.id) && !wrongIds.has(x.id);
    });
    var items = [].concat(shuffle(misses), shuffle(unseen));
    if (items.length < 15) items = [].concat(items, shuffle(mastered));
    items = items.slice(0, 15);
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', {
      detail: {
        items
      }
    }));
    onGoToStudy == null || onGoToStudy();
  };
  var builtInRows = useMemo(function () {
    var relevant = attempts.filter(function (a) {
      return a.file_id === NUCLEOTIDE_FILE_ID;
    });
    var correct = relevant.filter(function (a) {
      return a.correct;
    }).length;
    var seen = new Set(relevant.map(function (a) {
      return a.question_id;
    }));
    var wrong = new Set(relevant.filter(function (a) {
      return !a.correct;
    }).map(function (a) {
      return a.question_id;
    }));
    var need = NUCLEOTIDE_POOL.filter(function (x) {
      return wrong.has(x.id) || !seen.has(x.id);
    }).length;
    return [{
      fid: NUCLEOTIDE_FILE_ID,
      chapterId: NUCLEOTIDE_LESSON_ID,
      acc: relevant.length ? correct / relevant.length : 1,
      correct,
      total: relevant.length,
      chapter: NUCLEOTIDE_LESSON.title,
      subject: NUCLEOTIDE_LESSON.subject,
      need,
      builtIn: true
    }];
  }, [attempts]);
  var lessonRows = useMemo(function () {
    var byId = new Set(rows.map(function (r) {
      return r.chapterId;
    }));
    return [].concat(rows, builtInRows.filter(function (r) {
      return !byId.has(r.chapterId);
    }));
  }, [rows, builtInRows]);
  if (openId && lessonsCache[openId]) {
    return React.createElement(LessonReader, {
      lesson: lessonsCache[openId],
      latestCorrect: latestCorrect,
      completed: !!progress[openId],
      gate: gateFor(openId),
      quizPool: lessonQuizPoolFor(openId),
      onBack: function onBack() {
        return setOpenId(null);
      },
      onQuizSection: function onQuizSection(sec) {
        return quizSection(openId, sec);
      },
      onMarkComplete: function onMarkComplete() {
        return markComplete(openId);
      },
      onPassCheckpoint: function onPassCheckpoint(unlockTo) {
        return passCheckpoint(openId, unlockTo);
      },
      onMaster: function onMaster() {
        return masterChapter(openId);
      },
      username: session == null ? void 0 : session.username,
      onVerifyPin: verifyPin
    });
  }
  if (lessonRows.length === 0) {
    return React.createElement("div", {
      className: "space-y-4"
    }, React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
    }, React.createElement("h2", {
      className: "font-semibold text-[var(--text-strong)]"
    }, "Lessons"), React.createElement("p", {
      className: "text-sm text-[var(--text-muted)] mt-1"
    }, "Guided, chapter-by-chapter lessons that adapt to you \u2014 concepts you've already proven you know are skipped, and only resurface if you miss them later.")), React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-5 text-sm text-[var(--text-muted)]"
    }, "Answer some quiz questions first. Once you do, your most-struggled chapters show up here so you can drill them."));
  }
  var visible = showAll || sortBy === 'subject' ? lessonRows : lessonRows.slice(0, 3);
  var inProgress = Object.keys(lessonsCache).filter(function (cid) {
    var _gates$cid;
    return !((_gates$cid = gates[cid]) != null && _gates$cid.mastered) && !progress[cid];
  }).map(function (cid) {
    var _lessonsCache$cid;
    var builtIn = builtInLessonFor(cid);
    if (builtIn) return {
      chapterId: cid,
      fid: NUCLEOTIDE_FILE_ID,
      chapter: builtIn.title,
      subject: builtIn.subject
    };
    var f = files.find(function (x) {
      return x.chapter_id === cid;
    });
    return {
      chapterId: cid,
      fid: chapterToFile[cid] || cid,
      chapter: (f == null ? void 0 : f.chapter) || ((_lessonsCache$cid = lessonsCache[cid]) == null ? void 0 : _lessonsCache$cid.title) || 'Lesson',
      subject: (f == null ? void 0 : f.subject) || ''
    };
  });
  var lessonButton = function lessonButton(r) {
    if (!r.chapterId) return null;
    var cached = !!lessonsCache[r.chapterId];
    var avail = availMap[r.chapterId];
    var isBusy = !!busy[r.chapterId];
    var done = !!progress[r.chapterId];
    if (cached) {
      return React.createElement("div", {
        className: "flex items-center gap-2"
      }, done && React.createElement("span", {
        className: "text-xs text-green-500"
      }, "\u2713 complete"), React.createElement("button", {
        onClick: function onClick() {
          return setOpenId(r.chapterId);
        },
        className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
      }, "Open lesson"), React.createElement("button", {
        onClick: function onClick() {
          return removeLesson(r.chapterId);
        },
        title: "Remove the downloaded lesson body from this device",
        className: "text-xs px-2 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
      }, "Remove"));
    }
    if (r.builtIn) {
      return React.createElement("button", {
        onClick: function onClick() {
          return downloadLesson(r.chapterId);
        },
        className: "text-xs px-3 py-1.5 rounded font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
      }, "Open lesson");
    }
    if (avail === false) return React.createElement("span", {
      className: "text-xs text-[var(--text-faint)]"
    }, "No lesson yet");
    return React.createElement("button", {
      onClick: function onClick() {
        return downloadLesson(r.chapterId);
      },
      disabled: isBusy,
      className: "text-xs px-3 py-1.5 rounded font-medium disabled:opacity-50 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
    }, isBusy ? 'Downloading…' : 'Download lesson');
  };
  var renderRow = function renderRow(r) {
    var _gates$r$chapterId;
    var isMastered = !!((_gates$r$chapterId = gates[r.chapterId]) != null && _gates$r$chapterId.mastered);
    return React.createElement("div", {
      key: r.fid,
      className: "space-y-2"
    }, React.createElement(StatBar, {
      label: r.subject + " \u2014 " + r.chapter,
      correct: r.correct,
      total: r.total
    }), React.createElement("div", {
      className: "flex items-center justify-between gap-3 flex-wrap"
    }, React.createElement("span", {
      className: "text-xs text-[var(--text-faint)] flex items-center gap-2"
    }, isMastered && React.createElement("span", {
      className: "text-green-500 font-medium"
    }, "\uD83C\uDFC6 Mastered"), React.createElement("span", null, r.need > 0 ? r.need + " question" + (r.need === 1 ? '' : 's') + " to review" : 'All caught up — nice')), React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, lessonButton(r), React.createElement("button", {
      onClick: function onClick() {
        return launchReview(r.fid);
      },
      disabled: r.need === 0,
      className: "text-xs px-3 py-1.5 rounded font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
    }, "Quick review \u2192"))));
  };
  var subjectGroups = function () {
    var order = [];
    var map = {};
    for (var _iterator92 = _createForOfIteratorHelperLoose(lessonRows), _step92; !(_step92 = _iterator92()).done;) {
      var r = _step92.value;
      var s = r.subject || 'Other';
      if (!map[s]) {
        map[s] = [];
        order.push(s);
      }
      map[s].push(r);
    }
    return order.map(function (s) {
      return [s, map[s]];
    });
  }();
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Lessons"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mt-1"
  }, "Download a guided lesson and work through it in groups of ", LESSON_GROUP_SIZE, " sections. Each group is gated by a ", LESSON_CHECKPOINT_Q, "-question checkpoint (100% to advance), and a ", LESSON_FINAL_Q, "-question final exam masters the chapter.")), error && React.createElement("div", {
    className: "bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400"
  }, error), inProgress.length > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-3"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "In progress"), React.createElement("div", {
    className: "space-y-2"
  }, inProgress.map(function (r) {
    var g = gates[r.chapterId] || {};
    var lesson = lessonsCache[r.chapterId];
    var totalSecs = ((lesson == null ? void 0 : lesson.sections) || []).length;
    var unlocked = Math.min(totalSecs, Math.max(LESSON_GROUP_SIZE, g.unlocked || LESSON_GROUP_SIZE));
    return React.createElement("div", {
      key: r.fid,
      className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2 flex-wrap"
    }, React.createElement("div", {
      className: "min-w-0"
    }, React.createElement("div", {
      className: "text-sm font-medium text-[var(--text-strong)] truncate"
    }, r.chapter), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)]"
    }, r.subject, " \xB7 ", Math.min(unlocked, totalSecs), "/", totalSecs, " sections unlocked")), React.createElement("button", {
      onClick: function onClick() {
        return setOpenId(r.chapterId);
      },
      className: "text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0"
    }, "Resume \u2192"));
  }))), React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between gap-3 flex-wrap"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, sortBy === 'subject' ? 'All chapters by subject' : showAll ? 'All chapters' : 'Top 3 to work on'), React.createElement("div", {
    className: "flex items-center gap-1 text-xs"
  }, React.createElement("span", {
    className: "text-[var(--text-faint)] mr-1"
  }, "Sort:"), React.createElement("button", {
    onClick: function onClick() {
      return setSortBy('weakest');
    },
    className: "px-2 py-1 rounded border " + (sortBy === 'weakest' ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]')
  }, "% incorrect"), React.createElement("button", {
    onClick: function onClick() {
      return setSortBy('subject');
    },
    className: "px-2 py-1 rounded border " + (sortBy === 'subject' ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]')
  }, "Subject"))), sortBy === 'subject' ? React.createElement("div", {
    className: "space-y-2"
  }, subjectGroups.map(function (_ref106) {
    var subject = _ref106[0],
      items = _ref106[1];
    var open = !!openSubjects[subject];
    var need = items.reduce(function (n, r) {
      return n + r.need;
    }, 0);
    return React.createElement("div", {
      key: subject,
      className: "border border-[var(--border-soft)] rounded-xl overflow-hidden"
    }, React.createElement("button", {
      onClick: function onClick() {
        return toggleSubject(subject);
      },
      className: "w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-[var(--bg-elev-soft)] hover:bg-[var(--bg-hover)] text-left"
    }, React.createElement("span", {
      className: "flex items-center gap-2 min-w-0"
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] transition-transform",
      style: {
        transform: open ? 'rotate(90deg)' : 'none'
      }
    }, "\u25B6"), React.createElement("span", {
      className: "text-sm font-medium text-[var(--text-strong)] truncate"
    }, subject || 'Other'), React.createElement("span", {
      className: "text-xs text-[var(--text-faint)]"
    }, items.length, " chapter", items.length === 1 ? '' : 's')), need > 0 && React.createElement("span", {
      className: "text-xs text-[var(--text-faint)] shrink-0"
    }, need, " to review")), open && React.createElement("div", {
      className: "p-3 space-y-4"
    }, items.map(function (r) {
      return renderRow(r);
    })));
  })) : React.createElement("div", {
    className: "space-y-4"
  }, visible.map(function (r) {
    return renderRow(r);
  })), sortBy !== 'subject' && lessonRows.length > 3 && React.createElement("button", {
    onClick: function onClick() {
      return setShowAll(function (s) {
        return !s;
      });
    },
    className: "w-full text-sm py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-strong)]"
  }, showAll ? 'Show less' : "View more (" + (lessonRows.length - 3) + " more)")));
}
function relativeTime(ts) {
  if (!ts) return 'never';
  var diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return diff + "s ago";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}
function SyncPanel() {
  var _pushStatus$error;
  var _useApp21 = useApp(),
    github = _useApp21.github,
    setGithub = _useApp21.setGithub,
    pushBank = _useApp21.pushBank,
    pushStatus = _useApp21.pushStatus,
    files = _useApp21.files,
    extractions = _useApp21.extractions,
    questions = _useApp21.questions;
  var _useState164 = useState(false),
    showToken = _useState164[0],
    setShowToken = _useState164[1];
  var _useState165 = useState(false),
    expanded = _useState165[0],
    setExpanded = _useState165[1];
  var fullyProcessed = files.filter(function (f) {
    var _questions$f$file_id7, _questions$f$file_id8;
    return extractions[f.file_id] && ((_questions$f$file_id7 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id7.mc) && ((_questions$f$file_id8 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id8.short);
  }).length;
  var canPush = !!github.token && !!github.repo && !!github.path && fullyProcessed > 0;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "GitHub sync"), React.createElement("p", {
    className: "text-xs text-[var(--text-muted)] mt-1"
  }, "Push your question bank to ", React.createElement("span", {
    className: "font-mono"
  }, github.repo || '(no repo)', "/", github.path), " so your phone can load it.")), React.createElement("button", {
    onClick: function onClick() {
      return setExpanded(function (x) {
        return !x;
      });
    },
    className: "text-xs px-2 py-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
  }, expanded ? 'Hide' : 'Configure')), expanded && React.createElement("div", {
    className: "mt-4 space-y-3"
  }, React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, React.createElement("label", {
    className: "text-xs"
  }, React.createElement("span", {
    className: "block uppercase tracking-wide text-[var(--text-faint)] mb-1"
  }, "Repo (owner/name)"), React.createElement("input", {
    value: github.repo,
    onChange: function onChange(e) {
      return setGithub({
        repo: e.target.value
      });
    },
    placeholder: "user/repo",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
  })), React.createElement("label", {
    className: "text-xs"
  }, React.createElement("span", {
    className: "block uppercase tracking-wide text-[var(--text-faint)] mb-1"
  }, "Branch"), React.createElement("input", {
    value: github.branch,
    onChange: function onChange(e) {
      return setGithub({
        branch: e.target.value
      });
    },
    placeholder: "main",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
  }))), React.createElement("label", {
    className: "text-xs block"
  }, React.createElement("span", {
    className: "block uppercase tracking-wide text-[var(--text-faint)] mb-1"
  }, "File path"), React.createElement("input", {
    value: github.path,
    onChange: function onChange(e) {
      return setGithub({
        path: e.target.value
      });
    },
    placeholder: "data.json",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
  })), React.createElement("label", {
    className: "text-xs block"
  }, React.createElement("span", {
    className: "block uppercase tracking-wide text-[var(--text-faint)] mb-1"
  }, "Fine-grained PAT (Contents: Read and write)"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("input", {
    type: showToken ? 'text' : 'password',
    value: github.token,
    onChange: function onChange(e) {
      return setGithub({
        token: e.target.value
      });
    },
    placeholder: "github_pat_...",
    className: "flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
  }), React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setShowToken(function (s) {
        return !s;
      });
    },
    className: "text-xs px-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
  }, showToken ? 'Hide' : 'Show')), React.createElement("p", {
    className: "text-[11px] text-[var(--text-faint)] mt-1"
  }, "Create at", ' ', React.createElement("a", {
    href: "https://github.com/settings/personal-access-tokens/new",
    target: "_blank",
    rel: "noopener",
    className: "text-[var(--accent-text)] underline"
  }, "github.com/settings/personal-access-tokens"), ". Stored only in this browser.")), React.createElement("label", {
    className: "flex items-center gap-2 text-sm"
  }, React.createElement("input", {
    type: "checkbox",
    checked: github.autoPush,
    onChange: function onChange(e) {
      return setGithub({
        autoPush: e.target.checked
      });
    },
    className: "accent-[var(--accent)]"
  }), React.createElement("span", {
    className: "text-[var(--text)]"
  }, "Auto-push after each chapter finishes processing"))), React.createElement("div", {
    className: "mt-4 flex items-center gap-3"
  }, React.createElement("button", {
    onClick: pushBank,
    disabled: !canPush || pushStatus.state === 'pushing',
    className: "text-sm px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, pushStatus.state === 'pushing' ? 'Pushing…' : 'Push now'), React.createElement("span", {
    className: "text-xs text-[var(--text-muted)]"
  }, pushStatus.state === 'error' ? React.createElement("span", {
    className: "text-[var(--danger-text)]",
    title: pushStatus.error
  }, "Error: ", (_pushStatus$error = pushStatus.error) == null ? void 0 : _pushStatus$error.slice(0, 80)) : pushStatus.lastAt ? React.createElement(React.Fragment, null, "Last push: ", React.createElement("span", {
    className: "text-[var(--text-strong)]"
  }, relativeTime(pushStatus.lastAt))) : github.autoPush ? 'Auto-push armed. Will fire on next chapter processed.' : !github.token ? 'Not configured.' : 'Ready.')));
}
function StatBar(_ref107) {
  var correct = _ref107.correct,
    total = _ref107.total,
    label = _ref107.label;
  var pct = total ? Math.round(correct / total * 100) : 0;
  return React.createElement("div", null, React.createElement("div", {
    className: "flex items-baseline justify-between text-sm mb-1"
  }, React.createElement("span", {
    className: "text-[var(--text)]"
  }, label), React.createElement("span", {
    className: "text-[var(--text-muted)] text-xs"
  }, correct, "/", total, " ", React.createElement("span", {
    className: "text-[var(--text-strong)] font-medium ml-1"
  }, pct, "%"))), React.createElement("div", {
    className: "h-2 bg-[var(--bg-elev)] rounded-full overflow-hidden"
  }, React.createElement("div", {
    className: "h-full transition-all rounded-full",
    style: {
      width: pct + "%",
      background: pct >= 80 ? 'var(--success-border)' : pct >= 50 ? 'var(--accent)' : 'var(--danger-border)'
    }
  })));
}
var SECTION_MIN = 118,
  SECTION_MAX = 132,
  SECTION_RANGE = 14;
var MCAT_PRIOR_MEAN = 0.55;
var MCAT_PRIOR_STRENGTH = 8;
var MCAT_SECTIONS = [{
  key: 'cp',
  label: 'Chem/Phys',
  weights: {
    'Organic Chemistry': 0.15,
    'General Chemistry': 0.30,
    'Physics and Math': 0.25,
    Biology: 0.05,
    Biochemistry: 0.25
  }
}, {
  key: 'cars',
  label: 'CARS',
  weights: {
    CARS: 1.0
  }
}, {
  key: 'bb',
  label: 'Bio/Biochem',
  weights: {
    Biology: 0.65,
    Biochemistry: 0.25,
    'Organic Chemistry': 0.05,
    'General Chemistry': 0.05
  }
}, {
  key: 'ps',
  label: 'Psych/Soc',
  weights: {
    'Behavioral Science': 0.95,
    Biology: 0.05,
    Psychology: 0.65,
    Sociology: 0.30
  }
}];
function normalizeSubject(s) {
  if (s === 'Physics & Math') return 'Physics and Math';
  return s;
}
function subjectPosterior(list) {
  if (!list.length) return null;
  var last = list.slice(0, 200);
  var correct = last.reduce(function (s, a) {
    return s + (a.correct ? 1 : 0);
  }, 0);
  var n = last.length;
  var a = correct + MCAT_PRIOR_MEAN * MCAT_PRIOR_STRENGTH;
  var b = n - correct + (1 - MCAT_PRIOR_MEAN) * MCAT_PRIOR_STRENGTH;
  var mean = a / (a + b);
  var variance = a * b / (Math.pow(a + b, 2) * (a + b + 1));
  return {
    n,
    accuracy: correct / n,
    mean,
    variance
  };
}
function predictMcatScores(attempts) {
  var sorted = attempts.slice().sort(function (a, b) {
    return (b.ts || 0) - (a.ts || 0);
  });
  var bySubject = new Map();
  for (var _iterator93 = _createForOfIteratorHelperLoose(sorted), _step93; !(_step93 = _iterator93()).done;) {
    var a = _step93.value;
    if (!a.subject) continue;
    var subj = normalizeSubject(a.subject);
    if (!bySubject.has(subj)) bySubject.set(subj, []);
    bySubject.get(subj).push(a);
  }
  var posteriors = new Map();
  for (var _iterator94 = _createForOfIteratorHelperLoose(bySubject), _step94; !(_step94 = _iterator94()).done;) {
    var _step94$value = _step94.value,
      _subj = _step94$value[0],
      list = _step94$value[1];
    var p = subjectPosterior(list);
    if (p) posteriors.set(_subj, p);
  }
  var sections = MCAT_SECTIONS.map(function (sec) {
    var present = Object.entries(sec.weights).map(function (_ref108) {
      var subj = _ref108[0],
        weight = _ref108[1];
      var post = posteriors.get(subj);
      return post ? {
        subj,
        weight,
        post
      } : null;
    }).filter(Boolean);
    if (!present.length) return _extends({}, sec, {
      completed: false
    });
    var wSum = present.reduce(function (s, x) {
      return s + x.weight;
    }, 0);
    var mean = 0,
      variance = 0;
    for (var _iterator95 = _createForOfIteratorHelperLoose(present), _step95; !(_step95 = _iterator95()).done;) {
      var _step95$value = _step95.value,
        weight = _step95$value.weight,
        post = _step95$value.post;
      var w = weight / wSum;
      mean += w * post.mean;
      variance += w * w * post.variance;
    }
    var score = SECTION_MIN + SECTION_RANGE * mean;
    var stdev = SECTION_RANGE * Math.sqrt(variance);
    return _extends({}, sec, {
      completed: true,
      n: present.reduce(function (s, x) {
        return s + x.post.n;
      }, 0),
      subjects: present.map(function (_ref109) {
        var subj = _ref109.subj,
          weight = _ref109.weight,
          post = _ref109.post;
        return {
          subject: subj,
          weight: weight / wSum,
          rawWeight: weight,
          n: post.n,
          accuracy: post.accuracy
        };
      }),
      score: Math.max(SECTION_MIN, Math.min(SECTION_MAX, score)),
      stdev
    });
  });
  var done = sections.filter(function (s) {
    return s.completed;
  });
  if (done.length > 0 && done.length < sections.length) {
    var meanScore = done.reduce(function (s, x) {
      return s + x.score;
    }, 0) / done.length;
    var meanVar = done.reduce(function (s, x) {
      return s + Math.pow(x.stdev, 2);
    }, 0) / done.length;
    var imputedStdev = Math.max(Math.sqrt(meanVar) * 2, 2.5);
    for (var _iterator96 = _createForOfIteratorHelperLoose(sections), _step96; !(_step96 = _iterator96()).done;) {
      var s = _step96.value;
      if (s.completed) continue;
      s.imputed = true;
      s.score = meanScore;
      s.stdev = imputedStdev;
    }
  }
  var contributing = sections.filter(function (s) {
    return s.completed || s.imputed;
  });
  var total = done.length ? {
    score: contributing.reduce(function (acc, x) {
      return acc + x.score;
    }, 0),
    stdev: Math.sqrt(contributing.reduce(function (acc, x) {
      return acc + Math.pow(x.stdev, 2);
    }, 0)),
    sectionsCompleted: done.length,
    allFour: done.length === MCAT_SECTIONS.length
  } : null;
  return {
    sections,
    total
  };
}
function McatPredictionCard() {
  var _useApp22 = useApp(),
    attempts = _useApp22.attempts;
  var _useMemo2 = useMemo(function () {
      return predictMcatScores(attempts);
    }, [attempts]),
    sections = _useMemo2.sections,
    total = _useMemo2.total;
  var _useState166 = useState(false),
    expanded = _useState166[0],
    setExpanded = _useState166[1];
  var fmt = function fmt(n) {
    return n.toFixed(1).replace(/\.0$/, '');
  };
  if (!sections.some(function (s) {
    return s.completed;
  })) return null;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--accent-border)] rounded-2xl p-5 sm:p-6"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between gap-3 mb-3"
  }, React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "Predicted MCAT"), React.createElement("div", {
    className: "text-4xl sm:text-5xl font-bold text-[var(--text-strong)] mt-1"
  }, total ? Math.round(total.score) : '—', total && React.createElement("span", {
    className: "text-base sm:text-lg font-medium text-[var(--text-muted)] ml-2"
  }, "\xB1 ", fmt(total.stdev))), total && !total.allFour && React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-1"
  }, total.sectionsCompleted, "/4 sections attempted \xB7 others estimated from your average"))), React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
  }, sections.map(function (s) {
    return React.createElement("div", {
      key: s.key,
      className: 'border rounded-xl px-3 py-2.5 ' + (s.imputed ? 'bg-[var(--bg-card-soft)] border-dashed border-[var(--border)]' : 'bg-[var(--bg-elev-soft)] border-[var(--border-soft)]')
    }, React.createElement("div", {
      className: "text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
    }, s.label), s.completed ? React.createElement(React.Fragment, null, React.createElement("div", {
      className: "text-xl font-bold text-[var(--text-strong)] mt-0.5"
    }, Math.round(s.score), React.createElement("span", {
      className: "text-xs font-medium text-[var(--text-muted)] ml-1"
    }, "\xB1 ", fmt(s.stdev))), React.createElement("div", {
      className: "text-[10px] text-[var(--text-faint)] mt-0.5"
    }, "n=", s.n), function () {
      if (s.score >= SECTION_MAX) {
        return React.createElement("div", {
          className: "text-[10px] text-[var(--success-text)] mt-0.5"
        }, "max score");
      }
      var displayed = Math.round(s.score);
      var nextInt = displayed + 1;
      if (nextInt > SECTION_MAX) {
        return React.createElement("div", {
          className: "text-[10px] text-[var(--success-text)] mt-0.5"
        }, "max score");
      }
      var gapAccuracy = (nextInt - s.score) / SECTION_RANGE * 100;
      return React.createElement("div", {
        className: "text-[10px] text-[var(--accent-text)] mt-0.5"
      }, "+", gapAccuracy.toFixed(1), "% \u2192 ", nextInt);
    }()) : s.imputed ? React.createElement(React.Fragment, null, React.createElement("div", {
      className: "text-xl font-bold text-[var(--text-muted)] mt-0.5 italic"
    }, Math.round(s.score), React.createElement("span", {
      className: "text-xs font-medium text-[var(--text-fainter)] ml-1"
    }, "\xB1 ", fmt(s.stdev))), React.createElement("div", {
      className: "text-[10px] text-[var(--text-faint)] mt-0.5"
    }, "est.")) : React.createElement(React.Fragment, null, React.createElement("div", {
      className: "text-xl font-bold text-[var(--text-fainter)] mt-0.5"
    }, "\u2014"), React.createElement("div", {
      className: "text-[10px] text-[var(--text-faint)] mt-0.5"
    }, "no attempts")));
  })), expanded && React.createElement("div", {
    className: "mt-3 space-y-2 text-[11px]"
  }, sections.filter(function (s) {
    return s.completed;
  }).map(function (s) {
    return React.createElement("div", {
      key: s.key,
      className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-2.5"
    }, React.createElement("div", {
      className: "font-semibold text-[var(--text)] mb-1"
    }, s.label, " \u2014 ", Math.round(s.score), " \xB1 ", fmt(s.stdev)), React.createElement("div", {
      className: "space-y-0.5"
    }, s.subjects.map(function (sub) {
      return React.createElement("div", {
        key: sub.subject,
        className: "flex items-center justify-between gap-2 text-[var(--text-muted)]"
      }, React.createElement("span", null, sub.subject, " ", React.createElement("span", {
        className: "text-[var(--text-fainter)]"
      }, "(", Math.round(sub.weight * 100), "% of section)")), React.createElement("span", {
        className: "font-mono text-[var(--text-faint)]"
      }, "n=", sub.n, " \xB7 ", Math.round(sub.accuracy * 100), "%"));
    })));
  })), React.createElement("div", {
    className: "flex items-center justify-between gap-3 mt-3"
  }, React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] leading-snug flex-1"
  }, "Accuracy on your most recent 200 questions per subject, weighted into each MCAT section by the AAMC content ratios shown in the breakdown (renormalised to subjects you've actually attempted). Shrunk toward a 55% prior \u2014 treat as a floor, not a ceiling."), React.createElement("button", {
    onClick: function onClick() {
      return setExpanded(function (x) {
        return !x;
      });
    },
    className: "shrink-0 text-xs px-2.5 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, expanded ? 'Hide breakdown' : 'Breakdown')));
}
function StatsView() {
  var _useApp23 = useApp(),
    attempts = _useApp23.attempts,
    files = _useApp23.files,
    questions = _useApp23.questions,
    clearAttempts = _useApp23.clearAttempts;
  var stats = useMemo(function () {
    var overall = {
      correct: 0,
      total: 0
    };
    var byMode = {};
    var byChapter = {};
    var bySubject = {};
    var missByQid = {};
    var seenByQid = {};
    for (var _iterator97 = _createForOfIteratorHelperLoose(attempts), _step97; !(_step97 = _iterator97()).done;) {
      var _a$mode, _a$subject;
      var a = _step97.value;
      overall.total++;
      if (a.correct) overall.correct++;
      var m = byMode[_a$mode = a.mode] || (byMode[_a$mode] = {
        correct: 0,
        total: 0
      });
      m.total++;
      if (a.correct) m.correct++;
      var fkey = a.file_id;
      var c = byChapter[fkey] || (byChapter[fkey] = {
        correct: 0,
        total: 0,
        chapter: a.chapter,
        subject: a.subject
      });
      c.total++;
      if (a.correct) c.correct++;
      var s = bySubject[_a$subject = a.subject] || (bySubject[_a$subject] = {
        correct: 0,
        total: 0
      });
      s.total++;
      if (a.correct) s.correct++;
      seenByQid[a.question_id] = (seenByQid[a.question_id] || 0) + 1;
      if (!a.correct) missByQid[a.question_id] = (missByQid[a.question_id] || 0) + 1;
    }
    var qLookup = {};
    for (var _i26 = 0, _Object$keys3 = Object.keys(questions); _i26 < _Object$keys3.length; _i26++) {
      var fid = _Object$keys3[_i26];
      var qb = questions[fid] || {};
      for (var _iterator98 = _createForOfIteratorHelperLoose(qb.mc || []), _step98; !(_step98 = _iterator98()).done;) {
        var q = _step98.value;
        qLookup[q.id] = _extends({}, q, {
          mode: 'mc',
          file_id: fid
        });
      }
      for (var _iterator99 = _createForOfIteratorHelperLoose(qb.short || []), _step99; !(_step99 = _iterator99()).done;) {
        var _q3 = _step99.value;
        qLookup[_q3.id] = _extends({}, _q3, {
          mode: 'short',
          file_id: fid
        });
      }
    }
    var fileLookup = {};
    for (var _iterator100 = _createForOfIteratorHelperLoose(files), _step100; !(_step100 = _iterator100()).done;) {
      var f = _step100.value;
      fileLookup[f.file_id] = f;
    }
    var topMisses = Object.entries(missByQid).map(function (_ref110) {
      var qid = _ref110[0],
        misses = _ref110[1];
      var q = qLookup[qid];
      var text = q ? q.mode === 'mc' ? q.question : q.prompt : qid;
      var chapter = q && fileLookup[q.file_id] ? fileLookup[q.file_id].chapter : '—';
      var seen = seenByQid[qid] || misses;
      return {
        qid,
        misses,
        seen,
        text,
        chapter,
        mode: (q == null ? void 0 : q.mode) || 'matching'
      };
    }).sort(function (a, b) {
      return b.misses - a.misses;
    }).slice(0, 10);
    return {
      overall,
      byMode,
      byChapter,
      bySubject,
      topMisses
    };
  }, [attempts, files, questions]);
  if (attempts.length === 0) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
    }, "No quiz attempts yet. Run a quiz from the Study tab to see your stats.");
  }
  var modeLabels = {
    mc: 'Multiple choice',
    short: 'Short answer',
    match: 'Matching'
  };
  return React.createElement("div", {
    className: "space-y-5"
  }, Object.keys(stats.bySubject).length > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "By subject"), React.createElement("div", {
    className: "space-y-3"
  }, Object.entries(stats.bySubject).map(function (_ref111) {
    var subject = _ref111[0],
      s = _ref111[1];
    return React.createElement(StatBar, {
      key: subject,
      label: subject,
      correct: s.correct,
      total: s.total
    });
  }))), React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "By chapter"), React.createElement("div", {
    className: "space-y-3"
  }, Object.entries(stats.byChapter).sort(function (_ref112, _ref113) {
    var a = _ref112[1];
    var b = _ref113[1];
    return a.correct / a.total - b.correct / b.total;
  }).map(function (_ref114) {
    var fid = _ref114[0],
      s = _ref114[1];
    return React.createElement(StatBar, {
      key: fid,
      label: s.subject + " \u2014 " + s.chapter,
      correct: s.correct,
      total: s.total
    });
  }))), stats.topMisses.length > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "Most-missed questions"), React.createElement("ul", {
    className: "space-y-2 text-sm"
  }, stats.topMisses.map(function (m, i) {
    return React.createElement("li", {
      key: m.qid,
      className: "flex gap-3"
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] w-5 text-right shrink-0"
    }, i + 1, "."), React.createElement("div", {
      className: "flex-1 min-w-0"
    }, React.createElement("div", {
      className: "text-[var(--text)] truncate",
      title: m.text
    }, m.text), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)] mt-0.5"
    }, m.chapter, " \xB7 ", modeLabels[m.mode] || m.mode)), React.createElement("span", {
      className: "text-xs text-[var(--danger-text)] whitespace-nowrap self-start"
    }, m.misses, "/", m.seen, " missed"));
  }))), React.createElement("div", {
    className: "flex justify-end"
  }, React.createElement("button", {
    onClick: function onClick() {
      if (confirm('Clear all quiz attempts? This cannot be undone.')) clearAttempts();
    },
    className: "text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--danger-text)] hover:border-[var(--danger-border)] rounded"
  }, "Clear all attempts")));
}
function SettingsPanel(_ref115) {
  var onClose = _ref115.onClose;
  var _useApp24 = useApp(),
    palette = _useApp24.palette,
    mode = _useApp24.mode,
    setPalette = _useApp24.setPalette,
    setMode = _useApp24.setMode,
    apiKey = _useApp24.apiKey,
    setApiKey = _useApp24.setApiKey,
    client = _useApp24.client,
    session = _useApp24.session,
    pendingSync = _useApp24.pendingSync,
    syncBusy = _useApp24.syncBusy,
    syncError = _useApp24.syncError,
    flushSync = _useApp24.flushSync,
    volume = _useApp24.volume,
    setVolume = _useApp24.setVolume,
    autoDownloadChapters = _useApp24.autoDownloadChapters,
    setAutoDownloadChapters = _useApp24.setAutoDownloadChapters,
    autoDownloadAll = _useApp24.autoDownloadAll,
    setAutoDownloadAll = _useApp24.setAutoDownloadAll,
    contributorMode = _useApp24.contributorMode,
    setContributorMode = _useApp24.setContributorMode,
    tropicalBg = _useApp24.tropicalBg,
    setTropicalBg = _useApp24.setTropicalBg,
    bgBlur = _useApp24.bgBlur,
    setBgBlur = _useApp24.setBgBlur,
    experimentalUI = _useApp24.experimentalUI,
    setExperimentalUI = _useApp24.setExperimentalUI,
    glass = _useApp24.glass,
    setGlass = _useApp24.setGlass,
    files = _useApp24.files;
  var hasDownloadedChapters = files.some(function (f) {
    return f.chapter_id;
  });
  var _useState167 = useState(apiKey || ''),
    keyVal = _useState167[0],
    setKeyVal = _useState167[1];
  var _useState168 = useState(false),
    keyShow = _useState168[0],
    setKeyShow = _useState168[1];
  var _useState169 = useState(''),
    keyErr = _useState169[0],
    setKeyErr = _useState169[1];
  var _useState170 = useState(false),
    keyBusy = _useState170[0],
    setKeyBusy = _useState170[1];
  var saveKey = function () {
    var _ref116 = _asyncToGenerator(_regenerator().m(function _callee55() {
      var trimmed, _t42;
      return _regenerator().w(function (_context60) {
        while (1) switch (_context60.p = _context60.n) {
          case 0:
            trimmed = keyVal.trim();
            if (trimmed) {
              _context60.n = 1;
              break;
            }
            setApiKey('');
            return _context60.a(2);
          case 1:
            if (trimmed.startsWith('AIza')) {
              _context60.n = 2;
              break;
            }
            setKeyErr('Google AI keys start with AIza.');
            return _context60.a(2);
          case 2:
            setKeyBusy(true);
            setKeyErr('');
            storage.set(KEYS.apiKey, trimmed);
            _context60.p = 3;
            _context60.n = 4;
            return client.ping();
          case 4:
            setApiKey(trimmed);
            _context60.n = 6;
            break;
          case 5:
            _context60.p = 5;
            _t42 = _context60.v;
            storage.remove(KEYS.apiKey);
            setKeyErr("Key rejected: " + _t42.message);
          case 6:
            _context60.p = 6;
            setKeyBusy(false);
            return _context60.f(6);
          case 7:
            return _context60.a(2);
        }
      }, _callee55, null, [[3, 5, 6, 7]]);
    }));
    return function saveKey() {
      return _ref116.apply(this, arguments);
    };
  }();
  var paletteOpts = [['cold', '❄️', 'Cold'], ['warm', '🍂', 'Warm'], ['duo', '🗿', 'Rio'], ['tropical', '🌴', 'Tropical'], ['madison', '🏛️', 'Madison'], ['gambit', '🃏', 'Gambit']];
  var modeOpts = [['light', '☀️', 'Light'], ['dark', '🌙', 'Dark'], ['system', '🖥️', 'System']];
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-md mx-auto space-y-5"
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("h2", {
    className: "text-lg font-semibold text-[var(--text-strong)]"
  }, "Settings"), React.createElement("button", {
    onClick: onClose,
    className: "text-[var(--text-muted)] hover:text-[var(--text-strong)] text-2xl leading-none"
  }, "\xD7")), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Colour"), React.createElement("div", {
    className: "grid grid-cols-4 gap-2"
  }, paletteOpts.map(function (_ref117) {
    var k = _ref117[0],
      emoji = _ref117[1],
      label = _ref117[2];
    return React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return setPalette(k);
      },
      className: "flex flex-col items-center gap-1 py-3 rounded border " + (palette === k ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:bg-[var(--bg-hover)]')
    }, React.createElement("span", {
      className: "text-2xl"
    }, emoji), React.createElement("span", {
      className: "text-xs text-[var(--text)]"
    }, label));
  })), React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mt-4 mb-2"
  }, "Mode"), React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, modeOpts.map(function (_ref118) {
    var k = _ref118[0],
      emoji = _ref118[1],
      label = _ref118[2];
    return React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return setMode(k);
      },
      className: "flex flex-col items-center gap-1 py-3 rounded border " + (mode === k ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:bg-[var(--bg-hover)]')
    }, React.createElement("span", {
      className: "text-2xl"
    }, emoji), React.createElement("span", {
      className: "text-xs text-[var(--text)]"
    }, label));
  })), React.createElement("div", {
    className: "mt-3 space-y-2"
  }, React.createElement("label", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer"
  }, React.createElement("div", {
    className: "text-sm min-w-0"
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, palette === 'cold' ? '❄️' : palette === 'warm' ? '🍂' : palette === 'duo' ? '⛰️' : palette === 'madison' ? '🏛️' : palette === 'gambit' ? '🃏' : '🌴', " Dynamic background"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, palette === 'cold' ? 'Winter snow + mountain range background.' : palette === 'warm' ? 'Fall trees + mountain range background.' : palette === 'duo' ? 'Rio de Janeiro with Christ the Redeemer.' : palette === 'madison' ? 'Madison, WI skyline at night with the Capitol dome over Lake Monona — lit windows, occasional shooting stars, cars on Lakeshore Drive, and slow drifting clouds.' : palette === 'gambit' ? 'Charged playing cards, violet kinetic energy, and drifting neon sparks.' : 'Tropical beach with palm trees, breaking waves, and a crab that wanders past once in a while.', ' ', "Follows your light/dark mode.")), React.createElement("input", {
    type: "checkbox",
    checked: tropicalBg,
    onChange: function onChange(e) {
      return setTropicalBg(e.target.checked);
    },
    className: "w-4 h-4 shrink-0"
  })), tropicalBg && React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5"
  }, React.createElement("div", {
    className: "flex items-center justify-between text-sm"
  }, React.createElement("span", {
    className: "text-[var(--text)]"
  }, "Background blur"), React.createElement("span", {
    className: "text-[var(--text-muted)] tabular-nums"
  }, bgBlur, "%")), React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: bgBlur,
    onChange: function onChange(e) {
      return setBgBlur(parseFloat(e.target.value));
    },
    className: "w-full mt-2 accent-[var(--accent)]"
  }), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-1"
  }, "Softens the scene without dimming it. 0% sharp, 100% dreamy.")))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Experimental"), React.createElement("div", {
    className: "space-y-2"
  }, React.createElement("label", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer"
  }, React.createElement("div", {
    className: "text-sm min-w-0"
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, "\uD83E\uDDEA Experimental UI"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "A cleaner, redesigned look. If anything seems off, turn this back off to return to the normal app.")), React.createElement("input", {
    type: "checkbox",
    checked: experimentalUI,
    onChange: function onChange(e) {
      return setExperimentalUI(e.target.checked);
    },
    className: "w-4 h-4 shrink-0"
  })), experimentalUI && React.createElement("label", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer"
  }, React.createElement("div", {
    className: "text-sm min-w-0"
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, "\uD83E\uDEE7 Liquid glass"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "Frosted translucent cards. Heavier on older phones \u2014 turn off if scrolling feels sluggish.")), React.createElement("input", {
    type: "checkbox",
    checked: glass,
    onChange: function onChange(e) {
      return setGlass(e.target.checked);
    },
    className: "w-4 h-4 shrink-0"
  })))), session && React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Sync"), React.createElement("div", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5"
  }, React.createElement("div", {
    className: "text-sm min-w-0 flex-1"
  }, syncBusy ? React.createElement("span", {
    className: "text-[var(--accent-text)]"
  }, "Syncing\u2026") : syncError ? React.createElement("span", {
    className: "text-[var(--danger-text)] truncate",
    title: syncError
  }, syncError) : pendingSync.length > 0 ? React.createElement("span", {
    className: "text-[var(--warning-text-strong)]"
  }, pendingSync.length, " attempt", pendingSync.length === 1 ? '' : 's', " pending") : React.createElement("span", {
    className: "text-[var(--text-muted)]"
  }, "All synced")), React.createElement("button", {
    onClick: flushSync,
    disabled: syncBusy,
    className: "shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, "Force sync"))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "App"), React.createElement("div", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5"
  }, React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Fetch the latest version of the app"), React.createElement("button", {
    onClick: forceUpdateApp,
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded font-medium"
  }, "Force update"))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Gemini API key"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("input", {
    type: keyShow ? 'text' : 'password',
    value: keyVal,
    onChange: function onChange(e) {
      setKeyVal(e.target.value);
      setKeyErr('');
    },
    placeholder: apiKey ? "current: \u2026" + apiKey.slice(-6) : 'AIza...',
    className: "flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
  }), React.createElement("button", {
    onClick: function onClick() {
      return setKeyShow(function (s) {
        return !s;
      });
    },
    className: "px-3 text-xs border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, keyShow ? 'Hide' : 'Show')), keyErr && React.createElement("p", {
    className: "text-[var(--danger-text)] text-xs mt-2"
  }, keyErr), React.createElement("div", {
    className: "flex gap-2 mt-2"
  }, React.createElement("button", {
    onClick: saveKey,
    disabled: keyBusy || keyVal === apiKey,
    className: "flex-1 text-xs px-3 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, keyBusy ? 'Verifying…' : keyVal ? 'Save key' : 'No key set'), apiKey && React.createElement("button", {
    onClick: function onClick() {
      if (confirm('Forget the saved API key?')) {
        setApiKey('');
        setKeyVal('');
      }
    },
    className: "text-xs px-3 py-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] rounded"
  }, "Forget")), React.createElement("p", {
    className: "text-[11px] text-[var(--text-faint)] mt-2"
  }, "Get a free key at ", React.createElement("a", {
    href: "https://aistudio.google.com/apikey",
    target: "_blank",
    rel: "noopener",
    className: "text-[var(--accent-text)] underline"
  }, "aistudio.google.com/apikey"), ". Stored only in this browser.")), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Sound"), React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5"
  }, React.createElement("div", {
    className: "flex items-center justify-between text-sm"
  }, React.createElement("span", {
    className: "text-[var(--text)]"
  }, "Volume"), React.createElement("span", {
    className: "text-[var(--text-muted)] tabular-nums"
  }, Math.round(volume * 100), "%")), React.createElement("input", {
    type: "range",
    min: "0",
    max: "1",
    step: "0.05",
    value: volume,
    onChange: function onChange(e) {
      return setVolume(parseFloat(e.target.value));
    },
    className: "w-full mt-2 accent-[var(--accent)]"
  }), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-1"
  }, "Affects answer sounds, HUD ticks, and quiz-start chime."))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Chapters"), React.createElement("div", {
    className: "space-y-2"
  }, React.createElement("label", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer"
  }, React.createElement("div", {
    className: "text-sm min-w-0"
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, "Auto-download new chapters"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "When the app loads, silently download every cloud chapter that isn't in your local library yet.")), React.createElement("input", {
    type: "checkbox",
    checked: autoDownloadAll,
    onChange: function onChange(e) {
      return setAutoDownloadAll(e.target.checked);
    },
    className: "w-4 h-4 shrink-0"
  })), hasDownloadedChapters && React.createElement("label", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer"
  }, React.createElement("div", {
    className: "text-sm min-w-0"
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, "Auto-update downloaded chapters"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "When the app loads, silently re-download any chapter you already have whose server copy is newer.")), React.createElement("input", {
    type: "checkbox",
    checked: autoDownloadChapters,
    onChange: function onChange(e) {
      return setAutoDownloadChapters(e.target.checked);
    },
    className: "w-4 h-4 shrink-0"
  })))), React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Advanced"), React.createElement("label", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer"
  }, React.createElement("div", {
    className: "text-sm min-w-0"
  }, React.createElement("div", {
    className: "text-[var(--text)]"
  }, "Contributor mode"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-0.5"
  }, "Show the upload, publish-to-bank, export, and flag-fixes panels in the Library tab. Off for most users.")), React.createElement("input", {
    type: "checkbox",
    checked: contributorMode,
    onChange: function onChange(e) {
      return setContributorMode(e.target.checked);
    },
    className: "w-4 h-4 shrink-0"
  }))), React.createElement(StorageUsageSection, null), React.createElement(EraseQuizStatsSection, null));
}
function StorageUsageSection() {
  var _useState171 = useState(function () {
      return computeStorageSnapshot();
    }),
    snap = _useState171[0],
    setSnap = _useState171[1];
  var fmtBytes = function fmtBytes(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1024 / 1024).toFixed(2) + " MB";
  };
  var cap = 5 * 1024 * 1024;
  var pct = Math.min(100, Math.round(snap.total / cap * 100));
  var pctColor = pct >= 90 ? 'var(--danger-border)' : pct >= 70 ? 'var(--warning-text-strong)' : 'var(--accent)';
  var rows = [{
    key: 'chapters',
    label: 'Chapters (extractions + questions)'
  }, {
    key: 'attempts',
    label: 'Question attempts'
  }, {
    key: 'caches',
    label: 'CARS / Connections / Gemini caches'
  }, {
    key: 'crashlog',
    label: 'Crash log'
  }, {
    key: 'other',
    label: 'Settings, session, misc.'
  }];
  var clearCaches = function clearCaches() {
    if (!confirm('Clear the CARS / Connections / Gemini explainer caches and the crash log? Safe — they rebuild on demand.')) return;
    for (var _i27 = 0, _arr3 = ['mcat:carsCache', 'mcat:connectionsCache', 'mcat:connExplain', 'mcat:termDefs', 'mcat:crashlog']; _i27 < _arr3.length; _i27++) {
      var k = _arr3[_i27];
      try {
        localStorage.removeItem(k);
      } catch (_unused42) {}
    }
    setSnap(computeStorageSnapshot());
  };
  return React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Storage"), React.createElement("div", {
    className: "bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 space-y-2.5"
  }, React.createElement("div", null, React.createElement("div", {
    className: "flex items-baseline justify-between gap-2 text-sm"
  }, React.createElement("span", {
    className: "text-[var(--text)]"
  }, fmtBytes(snap.total), " used"), React.createElement("span", {
    className: "text-xs text-[var(--text-muted)]"
  }, "of ~", fmtBytes(cap), " (", pct, "%)")), React.createElement("div", {
    className: "h-1.5 bg-[var(--bg-elev)] rounded-full overflow-hidden mt-1"
  }, React.createElement("div", {
    className: "h-full rounded-full transition-all",
    style: {
      width: pct + "%",
      background: pctColor
    }
  })), snap.compressed > 0 && React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mt-1"
  }, snap.compressed, " entr", snap.compressed === 1 ? 'y' : 'ies', " compressed \xB7 raw size would be ~", fmtBytes(snap.rawEstimate))), React.createElement("div", {
    className: "border-t border-[var(--border-soft)] pt-2 space-y-1"
  }, rows.map(function (r) {
    return React.createElement("div", {
      key: r.key,
      className: "flex items-baseline justify-between gap-2 text-[11px]"
    }, React.createElement("span", {
      className: "text-[var(--text-muted)] truncate"
    }, r.label), React.createElement("span", {
      className: "font-mono text-[var(--text-faint)] shrink-0"
    }, fmtBytes(snap.byCategory[r.key] || 0)));
  })), React.createElement("div", {
    className: "flex flex-wrap gap-2 pt-1"
  }, React.createElement("button", {
    onClick: function onClick() {
      return setSnap(computeStorageSnapshot());
    },
    className: "text-[11px] px-2.5 py-1 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-strong)] rounded"
  }, "Refresh"), React.createElement("button", {
    onClick: clearCaches,
    className: "text-[11px] px-2.5 py-1 border border-[var(--warning-text-strong)] text-[var(--warning-text-strong)] hover:bg-[var(--warning-bg)] rounded"
  }, "Clear caches")), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] leading-snug pt-1"
  }, "Chapters and attempts persist across sessions. Caches rebuild on demand. The ~5 MB cap is enforced by your browser, not the app.")));
}
function computeStorageSnapshot() {
  var byCategory = {
    chapters: 0,
    attempts: 0,
    caches: 0,
    crashlog: 0,
    other: 0
  };
  var total = 0,
    compressed = 0,
    rawEstimate = 0;
  var CACHE_KEYS = new Set(['mcat:carsCache', 'mcat:connectionsCache', 'mcat:connExplain', 'mcat:termDefs', 'mcat:bankSeen', 'mcat:carsResults', 'mcat:connectionsResults']);
  var CHAPTER_KEYS = new Set(['mcat:files', 'mcat:extractions', 'mcat:questions']);
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k) continue;
      var v = localStorage.getItem(k) || '';
      var bytes = (k.length + v.length) * 2;
      total += bytes;
      if (v.startsWith('LZv1')) {
        compressed++;
        rawEstimate += (v.length - 4) * 4 * 2;
      } else {
        rawEstimate += bytes;
      }
      if (CHAPTER_KEYS.has(k)) byCategory.chapters += bytes;else if (k === 'mcat:attempts') byCategory.attempts += bytes;else if (k === 'mcat:crashlog') byCategory.crashlog += bytes;else if (CACHE_KEYS.has(k)) byCategory.caches += bytes;else byCategory.other += bytes;
    }
  } catch (_unused43) {}
  return {
    total,
    byCategory,
    compressed,
    rawEstimate
  };
}
function EraseQuizStatsSection() {
  var _useApp25 = useApp(),
    attempts = _useApp25.attempts,
    session = _useApp25.session,
    eraseStatsFor = _useApp25.eraseStatsFor;
  var _useState172 = useState(null),
    busy = _useState172[0],
    setBusy = _useState172[1];
  var _useState173 = useState(null),
    msg = _useState173[0],
    setMsg = _useState173[1];
  var _useState174 = useState(null),
    openDay = _useState174[0],
    setOpenDay = _useState174[1];
  var days = useMemo(function () {
    var dayMap = new Map();
    for (var _iterator101 = _createForOfIteratorHelperLoose(attempts), _step101; !(_step101 = _iterator101()).done;) {
      var a = _step101.value;
      var ts = a.ts || 0;
      var d = new Date(ts);
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      var key = y + "-" + m + "-" + day;
      var startOfDay = new Date(y, d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
      var endOfDay = startOfDay + 24 * 3600 * 1000;
      var bucket = dayMap.get(key);
      if (!bucket) {
        bucket = {
          key,
          startOfDay,
          endOfDay,
          total: 0,
          correct: 0,
          quizzes: new Map()
        };
        dayMap.set(key, bucket);
      }
      bucket.total++;
      if (a.correct) bucket.correct++;
      var chapter = a.chapter || '(unknown chapter)';
      var subject = a.subject || '(unknown subject)';
      var qkey = subject + "::" + chapter;
      var q = bucket.quizzes.get(qkey);
      if (!q) {
        q = {
          chapter,
          subject,
          total: 0,
          correct: 0
        };
        bucket.quizzes.set(qkey, q);
      }
      q.total++;
      if (a.correct) q.correct++;
    }
    return Array.from(dayMap.values()).map(function (b) {
      return _extends({}, b, {
        quizzes: Array.from(b.quizzes.values()).sort(function (a, b) {
          return b.total - a.total;
        })
      });
    }).sort(function (a, b) {
      return b.startOfDay - a.startOfDay;
    });
  }, [attempts]);
  var fmtDay = function fmtDay(key, ts) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var yest = new Date(today.getTime() - 24 * 3600 * 1000);
    var d = new Date(ts);
    var isToday = d.toDateString() === today.toDateString();
    var isYest = d.toDateString() === yest.toDateString();
    if (isToday) return "Today \xB7 " + key;
    if (isYest) return "Yesterday \xB7 " + key;
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }) + (" \xB7 " + key);
  };
  var eraseDay = function () {
    var _ref119 = _asyncToGenerator(_regenerator().m(function _callee56(b) {
      var label, res, _res$serverDeleted;
      return _regenerator().w(function (_context61) {
        while (1) switch (_context61.n) {
          case 0:
            label = fmtDay(b.key, b.startOfDay);
            if (confirm("Erase ALL " + b.total + " attempt" + (b.total === 1 ? '' : 's') + " from " + label + "?\n\nThis removes the question history for that day from this device AND from your account on the server. It can't be undone.")) {
              _context61.n = 1;
              break;
            }
            return _context61.a(2);
          case 1:
            setBusy(b.key);
            setMsg(null);
            _context61.n = 2;
            return eraseStatsFor({
              ts_gte: b.startOfDay,
              ts_lt: b.endOfDay
            });
          case 2:
            res = _context61.v;
            setBusy(null);
            if (res.ok) {
              setMsg({
                kind: 'ok',
                text: "Erased " + b.total + " local" + (session ? " and " + ((_res$serverDeleted = res.serverDeleted) != null ? _res$serverDeleted : 0) + " server" : '') + " attempt" + (b.total === 1 ? '' : 's') + " from " + label + "."
              });
            } else {
              setMsg({
                kind: 'err',
                text: "Couldn't erase: " + (res.reason || 'unknown error')
              });
            }
          case 3:
            return _context61.a(2);
        }
      }, _callee56);
    }));
    return function eraseDay(_x65) {
      return _ref119.apply(this, arguments);
    };
  }();
  return React.createElement("div", null, React.createElement("div", {
    className: "text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2"
  }, "Question history by day"), React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] mb-2"
  }, "Expand any day to see what you did. Erasing wipes both the local attempts and the matching rows on your account on the server. Use this if a sync glitch duplicated entries."), !session && React.createElement("div", {
    className: "text-[11px] text-[var(--warning-text-strong)] bg-[var(--warning-bg)] rounded px-2 py-1.5 mb-2"
  }, "Not signed in \u2014 only local attempts will be erased. Sign in to also clean up the duplicated rows on the server."), msg && React.createElement("div", {
    className: "text-[11px] rounded px-2 py-1.5 mb-2 " + (msg.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : 'bg-[var(--danger-bg)] text-[var(--danger-text)]')
  }, msg.text), days.length === 0 ? React.createElement("div", {
    className: "text-[11px] text-[var(--text-faint)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-3"
  }, "No quiz attempts yet.") : React.createElement("ul", {
    className: "max-h-72 overflow-y-auto divide-y divide-[var(--border-soft)] bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg"
  }, days.map(function (b) {
    var open = openDay === b.key;
    return React.createElement("li", {
      key: b.key,
      className: "px-3 py-2"
    }, React.createElement("div", {
      className: "flex items-center gap-2"
    }, React.createElement("button", {
      onClick: function onClick() {
        return setOpenDay(open ? null : b.key);
      },
      className: "min-w-0 flex-1 text-left",
      "aria-expanded": open
    }, React.createElement("div", {
      className: "text-sm text-[var(--text)] flex items-center gap-1.5"
    }, React.createElement("span", {
      "aria-hidden": "true",
      className: "text-[var(--text-muted)] transition-transform inline-block text-[10px]",
      style: {
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
      }
    }, "\u25B6"), React.createElement("span", {
      className: "truncate"
    }, fmtDay(b.key, b.startOfDay))), React.createElement("div", {
      className: "text-[11px] text-[var(--text-faint)] truncate pl-4"
    }, b.correct, "/", b.total, " correct \xB7 ", b.quizzes.length, " quiz", b.quizzes.length === 1 ? '' : 'zes')), React.createElement("button", {
      onClick: function onClick() {
        return eraseDay(b);
      },
      disabled: busy === b.key,
      className: "shrink-0 text-[11px] px-2.5 py-1 border border-[var(--danger-border)] text-[var(--danger-text)] hover:bg-[var(--danger-bg)] disabled:opacity-40 rounded"
    }, busy === b.key ? 'Erasing…' : 'Erase')), open && React.createElement("ul", {
      className: "mt-1.5 ml-4 space-y-1"
    }, b.quizzes.map(function (q) {
      return React.createElement("li", {
        key: q.subject + "::" + q.chapter,
        className: "text-[11px] flex items-center justify-between gap-2 text-[var(--text-muted)]"
      }, React.createElement("span", {
        className: "min-w-0 truncate",
        title: q.subject + " \u2014 " + q.chapter
      }, React.createElement("span", {
        className: "text-[var(--text)]"
      }, q.chapter), React.createElement("span", {
        className: "text-[var(--text-fainter)]"
      }, " \xB7 ", q.subject)), React.createElement("span", {
        className: "shrink-0 font-mono text-[var(--text-faint)]"
      }, q.correct, "/", q.total));
    })));
  })));
}
function PublishAllPanel() {
  var _useApp26 = useApp(),
    api = _useApp26.api,
    session = _useApp26.session,
    files = _useApp26.files,
    extractions = _useApp26.extractions,
    questions = _useApp26.questions,
    setFiles = _useApp26.setFiles;
  var _useState175 = useState(false),
    busy = _useState175[0],
    setBusy = _useState175[1];
  var _useState176 = useState(null),
    status = _useState176[0],
    setStatus = _useState176[1];
  var publishable = files.filter(function (f) {
    return extractions[f.file_id];
  });
  if (publishable.length === 0) return null;
  var allLinked = publishable.every(function (f) {
    return f.chapter_id;
  });
  var publishAll = function () {
    var _ref120 = _asyncToGenerator(_regenerator().m(function _callee57() {
      var okCount, errCount, lastErr, _loop7, _iterator102, _step102;
      return _regenerator().w(function (_context63) {
        while (1) switch (_context63.n) {
          case 0:
            if (!busy) {
              _context63.n = 1;
              break;
            }
            return _context63.a(2);
          case 1:
            setBusy(true);
            setStatus({
              kind: 'info',
              msg: "Publishing " + publishable.length + " chapter" + (publishable.length === 1 ? '' : 's') + "\u2026"
            });
            okCount = 0;
            errCount = 0;
            lastErr = {
              msg: ''
            };
            _loop7 = _regenerator().m(function _loop7() {
              var f, _qb$mc, _qb$twoPart, _qb$short, chapterId, created, ext, qb, pushes, _i28, _pushes2, _pushes2$_i, stage, payload, _t43;
              return _regenerator().w(function (_context62) {
                while (1) switch (_context62.p = _context62.n) {
                  case 0:
                    f = _step102.value;
                    _context62.p = 1;
                    chapterId = f.chapter_id;
                    if (chapterId) {
                      _context62.n = 3;
                      break;
                    }
                    _context62.n = 2;
                    return api.createChapter({
                      subject: f.subject,
                      title: f.chapter,
                      filename: f.filename,
                      size_bytes: f.size_bytes
                    });
                  case 2:
                    created = _context62.v;
                    chapterId = created.id;
                    setFiles(function (prev) {
                      return prev.map(function (x) {
                        return x.file_id === f.file_id ? _extends({}, x, {
                          chapter_id: chapterId
                        }) : x;
                      });
                    });
                  case 3:
                    ext = extractions[f.file_id];
                    qb = questions[f.file_id] || {};
                    pushes = [];
                    if (ext) pushes.push(['extraction', ext]);
                    if ((_qb$mc = qb.mc) != null && _qb$mc.length) pushes.push(['mc', qb.mc]);
                    if ((_qb$twoPart = qb.twoPart) != null && _qb$twoPart.length) pushes.push(['two_part', qb.twoPart]);
                    if ((_qb$short = qb.short) != null && _qb$short.length) pushes.push(['short', qb.short]);
                    _i28 = 0, _pushes2 = pushes;
                  case 4:
                    if (!(_i28 < _pushes2.length)) {
                      _context62.n = 6;
                      break;
                    }
                    _pushes2$_i = _pushes2[_i28], stage = _pushes2$_i[0], payload = _pushes2$_i[1];
                    _context62.n = 5;
                    return api.putChapterStage(chapterId, stage, payload);
                  case 5:
                    _i28++;
                    _context62.n = 4;
                    break;
                  case 6:
                    okCount++;
                    _context62.n = 8;
                    break;
                  case 7:
                    _context62.p = 7;
                    _t43 = _context62.v;
                    errCount++;
                    lastErr.msg = _t43.message;
                  case 8:
                    return _context62.a(2);
                }
              }, _loop7, null, [[1, 7]]);
            });
            _iterator102 = _createForOfIteratorHelperLoose(publishable);
          case 2:
            if ((_step102 = _iterator102()).done) {
              _context63.n = 4;
              break;
            }
            return _context63.d(_regeneratorValues(_loop7()), 3);
          case 3:
            _context63.n = 2;
            break;
          case 4:
            setBusy(false);
            if (errCount === 0) {
              setStatus({
                kind: 'ok',
                msg: "Published " + okCount + " chapter" + (okCount === 1 ? '' : 's') + " to the Bank."
              });
            } else {
              setStatus({
                kind: 'err',
                msg: okCount + " ok, " + errCount + " failed. Last error: " + lastErr.msg
              });
            }
          case 5:
            return _context63.a(2);
        }
      }, _callee57);
    }));
    return function publishAll() {
      return _ref120.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between gap-2"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Publish to Bank"), React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, publishable.length, " chapter", publishable.length === 1 ? '' : 's', " ready")), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)]"
  }, allLinked ? React.createElement(React.Fragment, null, "All your local chapters are already published. Click below to push any newer stages.") : React.createElement(React.Fragment, null, "Each local chapter becomes its own row in the shared Bank, with stage badges showing what's done. Friends signed in to the same Bank can quiz from or contribute to them.")), React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2"
  }, React.createElement("button", {
    onClick: publishAll,
    disabled: busy,
    className: "flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
  }, busy ? 'Publishing…' : allLinked ? 'Update all in Bank' : "Publish all " + publishable.length + " to Bank")), status && React.createElement("p", {
    className: "text-xs " + (status.kind === 'ok' ? 'text-[var(--success-text)]' : status.kind === 'err' ? 'text-[var(--danger-text)]' : 'text-[var(--text-muted)]')
  }, status.kind === 'ok' ? '✓ ' : '', status.msg));
}
function FlagFixesPanel() {
  var _useApp27 = useApp(),
    api = _useApp27.api,
    client = _useApp27.client,
    apiKey = _useApp27.apiKey,
    session = _useApp27.session,
    files = _useApp27.files,
    extractions = _useApp27.extractions,
    questions = _useApp27.questions,
    setQuestionsFor = _useApp27.setQuestionsFor;
  var _useState177 = useState(function () {
      return storage.get(KEYS.flagQueue, []);
    }),
    queue = _useState177[0],
    setQueue = _useState177[1];
  var _useState178 = useState(false),
    busy = _useState178[0],
    setBusy = _useState178[1];
  var _useState179 = useState(null),
    status = _useState179[0],
    setStatus = _useState179[1];
  var _useState180 = useState([]),
    processedLog = _useState180[0],
    setProcessedLog = _useState180[1];
  var pending = queue.filter(function (f) {
    return f.status === 'pending';
  });
  var done = queue.filter(function (f) {
    return f.status !== 'pending';
  });
  var refresh = function refresh() {
    return setQueue(storage.get(KEYS.flagQueue, []));
  };
  useEffect(function () {
    var onChange = function onChange() {
      return setQueue(storage.get(KEYS.flagQueue, []));
    };
    window.addEventListener('mcat:flagQueueChange', onChange);
    return function () {
      return window.removeEventListener('mcat:flagQueueChange', onChange);
    };
  }, []);
  var saveQueue = function saveQueue(next) {
    storage.set(KEYS.flagQueue, next);
    setQueue(next);
    try {
      window.dispatchEvent(new Event('mcat:flagQueueChange'));
    } catch (_unused44) {}
  };
  var removeFlag = function removeFlag(id) {
    saveQueue(queue.filter(function (f) {
      return f.id !== id;
    }));
  };
  var requeueFlag = function requeueFlag(id, newDescription) {
    saveQueue(queue.map(function (f) {
      return f.id === id ? _extends({}, f, {
        status: 'pending',
        description: (newDescription || '').trim() || f.description,
        rationale: undefined,
        error: undefined,
        fixed_question: undefined
      }) : f;
    }));
  };
  var isRateLimit = function isRateLimit(err) {
    return (err == null ? void 0 : err.status) === 429 || /quota|rate.?limit|exceeded/i.test((err == null ? void 0 : err.message) || '');
  };
  var runPipeline = function () {
    var _ref121 = _asyncToGenerator(_regenerator().m(function _callee58() {
      var current, processedCount, _loop8, _ret3, _iterator103, _step103;
      return _regenerator().w(function (_context65) {
        while (1) switch (_context65.n) {
          case 0:
            if (apiKey) {
              _context65.n = 1;
              break;
            }
            setStatus({
              kind: 'err',
              msg: 'Add a Gemini API key in Settings first.'
            });
            return _context65.a(2);
          case 1:
            if (pending.length) {
              _context65.n = 2;
              break;
            }
            return _context65.a(2);
          case 2:
            setBusy(true);
            setStatus({
              kind: 'info',
              msg: "Processing " + pending.length + " flag(s)\u2026"
            });
            setProcessedLog([]);
            current = [].concat(queue);
            processedCount = 0;
            _loop8 = _regenerator().m(function _loop8() {
              var flag, fix, fileId, qbank, cleanParts, nextTp, nextMc, updated, _fix$choices3, _updated, _t44, _t45, _t46;
              return _regenerator().w(function (_context64) {
                while (1) switch (_context64.p = _context64.n) {
                  case 0:
                    flag = _step103.value;
                    _context64.p = 1;
                    setStatus({
                      kind: 'info',
                      msg: "Fixing \"" + (flag.question_snapshot.question || flag.question_snapshot.prompt || flag.question_snapshot.theme || flag.question_id).slice(0, 60) + "\u2026\""
                    });
                    _context64.n = 2;
                    return client.fixFlaggedQuestion({
                      question: flag.question_snapshot,
                      flagDescription: flag.description,
                      chapterContext: flag.chapter_label
                    });
                  case 2:
                    fix = _context64.v;
                    fileId = flag.file_id;
                    qbank = questions[fileId];
                    if (!fix.two_part) {
                      _context64.n = 7;
                      break;
                    }
                    if (!(qbank != null && qbank.twoPart && fix.action === 'edit' && Array.isArray(fix.parts) && fix.parts.length === 2)) {
                      _context64.n = 6;
                      break;
                    }
                    cleanParts = fix.parts.map(function (p) {
                      return {
                        question: sanitizeText(p.question),
                        choices: (p.choices || []).slice(0, 4).map(function (c, i) {
                          return stripChoiceLabel(c, i);
                        }),
                        correct_index: Number.isInteger(p.correct_index) ? p.correct_index : 0,
                        explanation: sanitizeText(p.explanation)
                      };
                    });
                    nextTp = qbank.twoPart.map(function (it) {
                      return it.id === flag.question_id ? _extends({}, it, {
                        theme: sanitizeText(fix.theme) || it.theme,
                        parts: cleanParts
                      }) : it;
                    });
                    if (!(nextTp !== qbank.twoPart)) {
                      _context64.n = 6;
                      break;
                    }
                    setQuestionsFor(fileId, _extends({}, qbank, {
                      twoPart: nextTp
                    }));
                    if (!(flag.chapter_id && session)) {
                      _context64.n = 6;
                      break;
                    }
                    _context64.p = 3;
                    _context64.n = 4;
                    return api.putChapterStage(flag.chapter_id, 'two_part', nextTp);
                  case 4:
                    _context64.n = 6;
                    break;
                  case 5:
                    _context64.p = 5;
                    _t44 = _context64.v;
                  case 6:
                    _context64.n = 11;
                    break;
                  case 7:
                    if (!(qbank != null && qbank.mc)) {
                      _context64.n = 11;
                      break;
                    }
                    nextMc = qbank.mc;
                    if (fix.action === 'edit') {
                      nextMc = qbank.mc.map(function (q) {
                        var _fix$choices2;
                        return q.id === flag.question_id ? _extends({}, q, {
                          question: sanitizeText(fix.question) || q.question,
                          choices: (((_fix$choices2 = fix.choices) == null ? void 0 : _fix$choices2.length) === 4 ? fix.choices : q.choices).map(function (c, i) {
                            return stripChoiceLabel(c, i);
                          }),
                          correct_index: Number.isInteger(fix.correct_index) ? fix.correct_index : q.correct_index,
                          explanation: sanitizeText(fix.explanation) || q.explanation
                        }) : q;
                      });
                    }
                    if (!(nextMc !== qbank.mc)) {
                      _context64.n = 11;
                      break;
                    }
                    setQuestionsFor(fileId, _extends({}, qbank, {
                      mc: nextMc
                    }));
                    if (!(flag.chapter_id && session)) {
                      _context64.n = 11;
                      break;
                    }
                    _context64.p = 8;
                    _context64.n = 9;
                    return api.putChapterStage(flag.chapter_id, 'mc', nextMc);
                  case 9:
                    _context64.n = 11;
                    break;
                  case 10:
                    _context64.p = 10;
                    _t45 = _context64.v;
                  case 11:
                    updated = current.find(function (f) {
                      return f.id === flag.id;
                    });
                    if (updated) {
                      updated.status = fix.action === 'edit' ? 'edited' : 'skipped';
                      updated.rationale = fix.rationale;
                      updated.resolved_at = Date.now();
                      updated.error = undefined;
                      if (fix.action === 'edit' && !fix.two_part) {
                        updated.fixed_question = {
                          question: sanitizeText(fix.question) || flag.question_snapshot.question,
                          choices: (((_fix$choices3 = fix.choices) == null ? void 0 : _fix$choices3.length) === 4 ? fix.choices : flag.question_snapshot.choices || []).map(function (c, i) {
                            return stripChoiceLabel(c, i);
                          }),
                          correct_index: Number.isInteger(fix.correct_index) ? fix.correct_index : flag.question_snapshot.correct_index,
                          explanation: sanitizeText(fix.explanation) || flag.question_snapshot.explanation
                        };
                      }
                    }
                    setProcessedLog(function (log) {
                      return [].concat(log, [{
                        flag,
                        fix
                      }]);
                    });
                    processedCount++;
                    _context64.n = 14;
                    break;
                  case 12:
                    _context64.p = 12;
                    _t46 = _context64.v;
                    if (!isRateLimit(_t46)) {
                      _context64.n = 13;
                      break;
                    }
                    setStatus({
                      kind: 'warn',
                      msg: "Rate-limited after " + processedCount + " flag(s). The remaining " + (pending.length - processedCount) + " will stay queued for tomorrow."
                    });
                    saveQueue(current);
                    setBusy(false);
                    return _context64.a(2, {
                      v: void 0
                    });
                  case 13:
                    _updated = current.find(function (f) {
                      return f.id === flag.id;
                    });
                    if (_updated) {
                      _updated.status = 'error';
                      _updated.error = _t46.message;
                    }
                  case 14:
                    return _context64.a(2);
                }
              }, _loop8, null, [[8, 10], [3, 5], [1, 12]]);
            });
            _iterator103 = _createForOfIteratorHelperLoose(pending);
          case 3:
            if ((_step103 = _iterator103()).done) {
              _context65.n = 6;
              break;
            }
            return _context65.d(_regeneratorValues(_loop8()), 4);
          case 4:
            _ret3 = _context65.v;
            if (!_ret3) {
              _context65.n = 5;
              break;
            }
            return _context65.a(2, _ret3.v);
          case 5:
            _context65.n = 3;
            break;
          case 6:
            saveQueue(current);
            setStatus({
              kind: 'ok',
              msg: "Done \u2014 " + processedCount + " flag(s) processed."
            });
            setBusy(false);
          case 7:
            return _context65.a(2);
        }
      }, _callee58);
    }));
    return function runPipeline() {
      return _ref121.apply(this, arguments);
    };
  }();
  if (!queue.length) return null;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--warning-text)] rounded-2xl p-4 sm:p-5 space-y-3"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between"
  }, React.createElement("div", null, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "\u2691 Flagged questions"), React.createElement("p", {
    className: "text-xs text-[var(--text-muted)]"
  }, pending.length, " pending \xB7 ", done.length, " resolved. Pipeline runs locally with your Gemini key.")), React.createElement("button", {
    onClick: refresh,
    className: "text-xs text-[var(--text-muted)] underline"
  }, "refresh")), status && React.createElement("div", {
    className: "text-sm rounded px-3 py-2 " + (status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' : status.kind === 'warn' ? 'bg-[var(--warning-bg)] text-[var(--warning-text)]' : 'bg-[var(--accent-soft)] text-[var(--accent-text)]')
  }, status.msg), React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, React.createElement("button", {
    onClick: runPipeline,
    disabled: busy || !pending.length || !apiKey,
    className: "text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, busy ? 'Processing…' : "Run pipeline (" + pending.length + ")"), done.length > 0 && React.createElement("button", {
    onClick: function onClick() {
      return saveQueue(queue.filter(function (f) {
        return f.status === 'pending';
      }));
    },
    className: "text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded"
  }, "Clear resolved")), React.createElement("ul", {
    className: "space-y-2 text-sm"
  }, queue.slice().reverse().map(function (f) {
    return React.createElement(FlagRow, {
      key: f.id,
      flag: f,
      onRemove: function onRemove() {
        return removeFlag(f.id);
      },
      onRequeue: function onRequeue(d) {
        return requeueFlag(f.id, d);
      }
    });
  })));
}
function FlagRow(_ref122) {
  var _f$question_snapshot, _f$question_snapshot2, _f$question_snapshot3, _f$question_snapshot4;
  var f = _ref122.flag,
    onRemove = _ref122.onRemove,
    onRequeue = _ref122.onRequeue;
  var _useState181 = useState(false),
    amending = _useState181[0],
    setAmending = _useState181[1];
  var _useState182 = useState(''),
    amendText = _useState182[0],
    setAmendText = _useState182[1];
  var letters = ['A', 'B', 'C', 'D'];
  var fixed = f.fixed_question;
  return React.createElement("li", {
    className: "border border-[var(--border-soft)] rounded-lg p-2 bg-[var(--bg-elev-soft)]"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between gap-2"
  }, React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide text-[var(--text-faint)]"
  }, f.chapter_label), React.createElement("span", {
    className: "text-[10px] uppercase " + (f.status === 'pending' ? 'text-[var(--warning-text)]' : f.status === 'error' ? 'text-[var(--danger-text)]' : f.status === 'skipped' ? 'text-[var(--text-faint)]' : 'text-[var(--success-text)]')
  }, f.status)), React.createElement("div", {
    className: "text-xs mt-1 text-[var(--text)]"
  }, (_f$question_snapshot = f.question_snapshot) != null && _f$question_snapshot.theme ? "Two-part: " + f.question_snapshot.theme : null, (((_f$question_snapshot2 = f.question_snapshot) == null ? void 0 : _f$question_snapshot2.question) || ((_f$question_snapshot3 = f.question_snapshot) == null ? void 0 : _f$question_snapshot3.prompt) || ((_f$question_snapshot4 = f.question_snapshot) != null && _f$question_snapshot4.theme ? '' : f.question_id)).slice(0, 160)), React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] mt-1 italic"
  }, "\"", f.description, "\""), f.rationale && React.createElement("div", {
    className: "text-[11px] text-[var(--accent-text)] mt-1"
  }, "\u2192 ", f.rationale), f.error && React.createElement("div", {
    className: "text-[11px] text-[var(--danger-text)] mt-1"
  }, f.error), fixed && React.createElement("div", {
    className: "mt-2 border-t border-[var(--border-soft)] pt-2"
  }, React.createElement("div", {
    className: "text-[10px] uppercase tracking-wide text-[var(--success-text)] mb-1"
  }, "Corrected"), React.createElement("div", {
    className: "text-xs text-[var(--text)]"
  }, fixed.question), React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-0.5 mt-1"
  }, (fixed.choices || []).map(function (c, ci) {
    return React.createElement("div", {
      key: ci,
      className: "text-[11px] px-1.5 py-0.5 rounded " + (ci === fixed.correct_index ? 'bg-[var(--success-bg)] text-[var(--success-text)] font-medium' : 'text-[var(--text-muted)]')
    }, letters[ci], ". ", c);
  }))), amending && React.createElement("div", {
    className: "mt-2 space-y-1.5"
  }, React.createElement("textarea", {
    value: amendText,
    onChange: function onChange(e) {
      return setAmendText(e.target.value);
    },
    rows: 2,
    placeholder: "Optional: clarify what's still wrong before re-sending to Gemini\u2026",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 text-xs"
  }), React.createElement("div", {
    className: "flex gap-2 justify-end"
  }, React.createElement("button", {
    onClick: function onClick() {
      return setAmending(false);
    },
    className: "text-[10px] text-[var(--text-faint)] px-2 py-1"
  }, "cancel"), React.createElement("button", {
    onClick: function onClick() {
      onRequeue(amendText);
      setAmending(false);
      setAmendText('');
    },
    className: "text-[10px] px-2 py-1 bg-[var(--accent)] text-white rounded"
  }, "Re-queue"))), !amending && React.createElement("div", {
    className: "flex items-center justify-end gap-3 mt-1"
  }, f.status !== 'pending' && React.createElement("button", {
    onClick: function onClick() {
      return setAmending(true);
    },
    className: "text-[10px] text-[var(--accent-text)] hover:underline"
  }, "re-run with Gemini"), React.createElement("button", {
    onClick: onRemove,
    className: "text-[10px] text-[var(--text-faint)] hover:text-[var(--danger-text)]"
  }, "remove")));
}
function CloudBankPanel() {
  var _useApp28 = useApp(),
    session = _useApp28.session,
    api = _useApp28.api,
    files = _useApp28.files,
    extractions = _useApp28.extractions,
    questions = _useApp28.questions,
    setFiles = _useApp28.setFiles,
    setExtraction = _useApp28.setExtraction,
    setQuestionsFor = _useApp28.setQuestionsFor;
  var _useState183 = useState({
      state: 'idle',
      message: ''
    }),
    status = _useState183[0],
    setStatus = _useState183[1];
  var _useState184 = useState(null),
    remote = _useState184[0],
    setRemote = _useState184[1];
  var _useState185 = useState(false),
    busy = _useState185[0],
    setBusy = _useState185[1];
  useEffect(function () {
    if (!session) {
      setRemote(null);
      return;
    }
    var cancelled = false;
    api.bankMeta(session.username).then(function (m) {
      if (!cancelled) setRemote(m);
    }).catch(function () {
      if (!cancelled) setRemote(null);
    });
    return function () {
      cancelled = true;
    };
  }, [api, session == null ? void 0 : session.username]);
  if (!session) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl px-4 py-3 text-sm text-[var(--text-muted)]"
    }, "Sign in to publish your question bank to the cloud \u2014 then any device (including your phone) can pull it down.");
  }
  var hasLocal = files.length > 0 && files.some(function (f) {
    var _questions$f$file_id9;
    return extractions[f.file_id] && ((_questions$f$file_id9 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id9.mc);
  });
  var publish = function () {
    var _ref123 = _asyncToGenerator(_regenerator().m(function _callee59() {
      var bank, res, _t47;
      return _regenerator().w(function (_context66) {
        while (1) switch (_context66.p = _context66.n) {
          case 0:
            setBusy(true);
            setStatus({
              state: 'pushing',
              message: 'Uploading…'
            });
            _context66.p = 1;
            bank = JSON.stringify({
              version: 1,
              exported_at: new Date().toISOString(),
              model: MODEL,
              files,
              extractions,
              questions
            });
            _context66.n = 2;
            return api.putBank(bank);
          case 2:
            res = _context66.v;
            setRemote({
              size_bytes: res.size_bytes,
              updated_at: res.updated_at,
              username: session.username
            });
            setStatus({
              state: 'ok',
              message: "Published " + (res.size_bytes / 1024).toFixed(1) + " KB"
            });
            _context66.n = 4;
            break;
          case 3:
            _context66.p = 3;
            _t47 = _context66.v;
            setStatus({
              state: 'err',
              message: _t47.message
            });
          case 4:
            _context66.p = 4;
            setBusy(false);
            return _context66.f(4);
          case 5:
            return _context66.a(2);
        }
      }, _callee59, null, [[1, 3, 4, 5]]);
    }));
    return function publish() {
      return _ref123.apply(this, arguments);
    };
  }();
  var pull = function () {
    var _ref124 = _asyncToGenerator(_regenerator().m(function _callee60() {
      var bank, _i29, _Object$keys4, fid, _i30, _Object$keys5, _fid, n, _t48;
      return _regenerator().w(function (_context67) {
        while (1) switch (_context67.p = _context67.n) {
          case 0:
            if (confirm('Replace your local question bank with the cloud copy?')) {
              _context67.n = 1;
              break;
            }
            return _context67.a(2);
          case 1:
            setBusy(true);
            setStatus({
              state: 'pulling',
              message: 'Downloading…'
            });
            _context67.p = 2;
            _context67.n = 3;
            return api.getMyBank();
          case 3:
            bank = _context67.v;
            setFiles(bank.files || []);
            storage.set(KEYS.extractions, bank.extractions || {});
            storage.set(KEYS.questions, bank.questions || {});
            for (_i29 = 0, _Object$keys4 = Object.keys(bank.extractions || {}); _i29 < _Object$keys4.length; _i29++) {
              fid = _Object$keys4[_i29];
              setExtraction(fid, bank.extractions[fid]);
            }
            for (_i30 = 0, _Object$keys5 = Object.keys(bank.questions || {}); _i30 < _Object$keys5.length; _i30++) {
              _fid = _Object$keys5[_i30];
              setQuestionsFor(_fid, bank.questions[_fid]);
            }
            n = (bank.files || []).length;
            setStatus({
              state: 'ok',
              message: "Pulled " + n + " chapter" + (n === 1 ? '' : 's')
            });
            _context67.n = 5;
            break;
          case 4:
            _context67.p = 4;
            _t48 = _context67.v;
            setStatus({
              state: 'err',
              message: _t48.message
            });
          case 5:
            _context67.p = 5;
            setBusy(false);
            return _context67.f(5);
          case 6:
            return _context67.a(2);
        }
      }, _callee60, null, [[2, 4, 5, 6]]);
    }));
    return function pull() {
      return _ref124.apply(this, arguments);
    };
  }();
  var remoteAge = remote ? function () {
    var ago = Date.now() - remote.updated_at;
    var min = Math.round(ago / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return min + " min ago";
    var hr = Math.round(min / 60);
    if (hr < 24) return hr + " hr ago";
    return Math.round(hr / 24) + " d ago";
  }() : null;
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3"
  }, React.createElement("div", {
    className: "flex items-baseline justify-between gap-2"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Cloud bank"), remote && React.createElement("span", {
    className: "text-xs text-[var(--text-faint)]"
  }, (remote.size_bytes / 1024).toFixed(1), " KB \xB7 ", remoteAge)), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)]"
  }, remote ? React.createElement(React.Fragment, null, "Your bank is published. Other devices signed in as ", React.createElement("span", {
    className: "font-mono"
  }, "@", session.username), " can pull it down.") : React.createElement(React.Fragment, null, "Publish your processed chapters to the cloud so your phone (or any other device) can quiz from them without re-processing.")), React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2"
  }, React.createElement("button", {
    onClick: publish,
    disabled: busy || !hasLocal,
    className: "flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
  }, busy && status.state === 'pushing' ? 'Uploading…' : remote ? 'Update cloud bank' : 'Publish to cloud'), remote && React.createElement("button", {
    onClick: pull,
    disabled: busy,
    className: "flex-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
  }, busy && status.state === 'pulling' ? 'Downloading…' : 'Pull cloud bank to this device')), status.state === 'ok' && React.createElement("p", {
    className: "text-xs text-[var(--success-text)]"
  }, "\u2713 ", status.message), status.state === 'err' && React.createElement("p", {
    className: "text-xs text-[var(--danger-text)]"
  }, status.message), !hasLocal && React.createElement("p", {
    className: "text-xs text-[var(--text-faint)]"
  }, "No locally processed chapters \u2014 process some in the Library, or pull from cloud if you have one."));
}
function exportBank(_ref125) {
  var files = _ref125.files,
    extractions = _ref125.extractions,
    questions = _ref125.questions;
  var data = {
    version: 1,
    exported_at: new Date().toISOString(),
    model: MODEL,
    files,
    extractions,
    questions
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = "data.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function AccountPanel(_ref126) {
  var onClose = _ref126.onClose;
  var _useApp29 = useApp(),
    session = _useApp29.session,
    setSession = _useApp29.setSession,
    api = _useApp29.api;
  var _useState186 = useState('login'),
    mode = _useState186[0],
    setMode = _useState186[1];
  var _useState187 = useState(''),
    username = _useState187[0],
    setUsername = _useState187[1];
  var _useState188 = useState(''),
    pin = _useState188[0],
    setPin = _useState188[1];
  var _useState189 = useState(''),
    err = _useState189[0],
    setErr = _useState189[1];
  var _useState190 = useState(false),
    busy = _useState190[0],
    setBusy = _useState190[1];
  if (session) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
    }, React.createElement("div", {
      className: "flex items-center justify-between"
    }, React.createElement("div", null, React.createElement("div", {
      className: "text-xs text-[var(--text-muted)]"
    }, "Signed in as"), React.createElement("div", {
      className: "text-xl font-semibold"
    }, "@", session.username)), React.createElement("button", {
      onClick: _asyncToGenerator(_regenerator().m(function _callee61() {
        var _t49;
        return _regenerator().w(function (_context68) {
          while (1) switch (_context68.p = _context68.n) {
            case 0:
              _context68.p = 0;
              _context68.n = 1;
              return api.logout();
            case 1:
              _context68.n = 3;
              break;
            case 2:
              _context68.p = 2;
              _t49 = _context68.v;
            case 3:
              setSession(null);
            case 4:
              return _context68.a(2);
          }
        }, _callee61, null, [[0, 2]]);
      })),
      className: "text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
    }, "Log out")));
  }
  var submit = function () {
    var _ref128 = _asyncToGenerator(_regenerator().m(function _callee62() {
      var res, _t50, _t51;
      return _regenerator().w(function (_context69) {
        while (1) switch (_context69.p = _context69.n) {
          case 0:
            setErr('');
            if (/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
              _context69.n = 1;
              break;
            }
            setErr('Username must be 3-20 chars (letters, digits, underscore).');
            return _context69.a(2);
          case 1:
            if (/^\d{4}$/.test(pin)) {
              _context69.n = 2;
              break;
            }
            setErr('PIN must be exactly 4 digits.');
            return _context69.a(2);
          case 2:
            setBusy(true);
            _context69.p = 3;
            if (!(mode === 'signup')) {
              _context69.n = 5;
              break;
            }
            _context69.n = 4;
            return api.signup({
              username,
              pin
            });
          case 4:
            _t50 = _context69.v;
            _context69.n = 7;
            break;
          case 5:
            _context69.n = 6;
            return api.login({
              username,
              pin
            });
          case 6:
            _t50 = _context69.v;
          case 7:
            res = _t50;
            setSession({
              token: res.token,
              username: res.username
            });
            setPin('');
            onClose == null || onClose();
            _context69.n = 9;
            break;
          case 8:
            _context69.p = 8;
            _t51 = _context69.v;
            setErr(_t51.message);
          case 9:
            _context69.p = 9;
            setBusy(false);
            return _context69.f(9);
          case 10:
            return _context69.a(2);
        }
      }, _callee62, null, [[3, 8, 9, 10]]);
    }));
    return function submit() {
      return _ref128.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-sm mx-auto"
  }, React.createElement("div", {
    className: "flex gap-1 mb-4"
  }, [['login', 'Log in'], ['signup', 'Sign up']].map(function (_ref129) {
    var k = _ref129[0],
      label = _ref129[1];
    return React.createElement("button", {
      key: k,
      onClick: function onClick() {
        setMode(k);
        setErr('');
      },
      className: "text-sm px-3 py-1.5 rounded flex-1 " + (mode === k ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-strong)]')
    }, label);
  })), React.createElement("label", {
    className: "block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1"
  }, "Username"), React.createElement("input", {
    value: username,
    onChange: function onChange(e) {
      setUsername(e.target.value.toLowerCase());
      setErr('');
    },
    placeholder: "3-20 chars, a-z 0-9 _",
    autoComplete: "username",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
  }), React.createElement("label", {
    className: "block text-xs uppercase tracking-wide text-[var(--text-muted)] mt-3 mb-1"
  }, "4-digit PIN"), React.createElement("input", {
    type: "password",
    inputMode: "numeric",
    maxLength: 4,
    value: pin,
    onChange: function onChange(e) {
      setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
      setErr('');
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === 'Enter' && !busy && submit();
    },
    placeholder: "\u2022\u2022\u2022\u2022",
    autoComplete: mode === 'signup' ? 'new-password' : 'current-password',
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[var(--accent-border)]"
  }), err && React.createElement("p", {
    className: "text-[var(--danger-text)] text-xs mt-2"
  }, err), React.createElement("button", {
    onClick: submit,
    disabled: busy || !username || !pin,
    className: "mt-4 w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
  }, busy ? 'Working…' : mode === 'signup' ? 'Create account' : 'Log in'), React.createElement("p", {
    className: "text-[11px] text-[var(--text-faint)] mt-3 text-center"
  }, "Stats sync across devices and show up on the leaderboard. PIN is hashed server-side. Don't reuse a sensitive PIN."));
}
function pct(c, t) {
  return t ? Math.round(c / t * 100) : 0;
}
function Leaderboard(_ref130) {
  var onPickUser = _ref130.onPickUser;
  var _useApp30 = useApp(),
    api = _useApp30.api;
  var _useState191 = useState(null),
    data = _useState191[0],
    setData = _useState191[1];
  var _useState192 = useState(''),
    err = _useState192[0],
    setErr = _useState192[1];
  useEffect(function () {
    var cancelled = false;
    api.leaderboard().then(function (d) {
      if (!cancelled) setData(d);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api]);
  if (err) return React.createElement("div", {
    className: "text-sm text-[var(--danger-text)]"
  }, "Could not load leaderboard: ", err);
  if (!data) return React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading\u2026");
  if (!data.users.length) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
    }, "No one has recorded any attempts yet. Be the first.");
  }
  return React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "Leaderboard \u2014 accuracy on last ", data.window || 100, " attempts"), React.createElement("ol", {
    className: "divide-y divide-[var(--border-soft)]"
  }, data.users.map(function (u, i) {
    return React.createElement("li", {
      key: u.username,
      className: "py-2 flex items-center gap-3"
    }, React.createElement("span", {
      className: "text-[var(--text-faint)] w-6 text-right"
    }, i + 1, "."), React.createElement("button", {
      onClick: function onClick() {
        return onPickUser == null ? void 0 : onPickUser(u.username);
      },
      className: "flex-1 text-left text-[var(--text)] hover:text-[var(--accent-text)] font-medium truncate"
    }, "@", u.username), React.createElement("div", {
      className: "text-xs text-[var(--text-muted)] tabular-nums"
    }, u.correct, "/", u.total, React.createElement("span", {
      className: "ml-2 text-[var(--text-strong)] font-medium"
    }, pct(u.correct, u.total), "%")));
  })));
}
function ServerStatsPayload(_ref131) {
  var _data$bySubject, _data$byChapter, _data$byMode;
  var data = _ref131.data;
  if (!data) return null;
  var overall = data.overall || {
    total: 0,
    correct: 0
  };
  var weekly = data.weekly || {
    total: 0,
    correct: 0
  };
  var overallPct = pct(overall.correct, overall.total);
  var weeklyPct = pct(weekly.correct, weekly.total);
  var modeLabels = {
    mc: 'Multiple choice',
    short: 'Short answer',
    match: 'Matching'
  };
  var today = Math.floor(Date.now() / 86400000);
  var days = [];
  for (var i = 6; i >= 0; i--) days.push(today - i);
  var dailyByBucket = {};
  for (var _iterator104 = _createForOfIteratorHelperLoose(data.daily || []), _step104; !(_step104 = _iterator104()).done;) {
    var d = _step104.value;
    dailyByBucket[d.day_bucket] = d;
  }
  var dailySeries = days.map(function (b) {
    var r = dailyByBucket[b];
    return {
      day: b,
      total: (r == null ? void 0 : r.total) || 0,
      correct: (r == null ? void 0 : r.correct) || 0
    };
  });
  var maxTotal = Math.max.apply(Math, [1].concat(dailySeries.map(function (d) {
    return d.total;
  })));
  return React.createElement("div", {
    className: "space-y-5"
  }, React.createElement("div", {
    className: "grid grid-cols-2 gap-3 sm:gap-4"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 text-center"
  }, React.createElement("div", {
    className: "text-[10px] sm:text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "All-time"), React.createElement("div", {
    className: "text-3xl sm:text-4xl font-bold mt-1.5 text-[var(--text-strong)]"
  }, overallPct, "%"), React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] mt-1"
  }, overall.correct, " / ", overall.total)), React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 text-center"
  }, React.createElement("div", {
    className: "text-[10px] sm:text-xs uppercase tracking-wide text-[var(--text-muted)]"
  }, "This week"), React.createElement("div", {
    className: "text-3xl sm:text-4xl font-bold mt-1.5 text-[var(--text-strong)]"
  }, weeklyPct, "%"), React.createElement("div", {
    className: "text-xs text-[var(--text-muted)] mt-1"
  }, weekly.correct, " / ", weekly.total))), data.mostStudiedSubject && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 flex items-baseline justify-between"
  }, React.createElement("span", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Most-studied subject"), React.createElement("span", {
    className: "text-base font-medium text-[var(--text-strong)]"
  }, data.mostStudiedSubject)), React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "Last 7 days"), React.createElement("div", {
    className: "flex items-end gap-1.5 h-32"
  }, dailySeries.map(function (d) {
    var acc = pct(d.correct, d.total);
    var barH = d.total ? Math.max(6, d.total / maxTotal * 100) : 0;
    var fillH = d.total ? d.correct / d.total * 100 : 0;
    return React.createElement("div", {
      key: d.day,
      className: "flex-1 h-full flex flex-col justify-end",
      title: d.correct + "/" + d.total + " (" + acc + "%)"
    }, React.createElement("div", {
      className: "w-full bg-[var(--bg-elev)] rounded-t overflow-hidden flex flex-col justify-end",
      style: {
        height: barH + "%"
      }
    }, React.createElement("div", {
      className: "w-full bg-[var(--success-border)]",
      style: {
        height: fillH + "%"
      }
    })));
  })), React.createElement("div", {
    className: "flex gap-1.5 mt-1"
  }, dailySeries.map(function (d) {
    var dayLabel = new Date(d.day * 86400000 + 43200000).toLocaleDateString(undefined, {
      weekday: 'short'
    });
    return React.createElement("div", {
      key: d.day,
      className: "flex-1 text-center text-[10px] text-[var(--text-faint)]"
    }, dayLabel);
  })), React.createElement("p", {
    className: "text-[11px] text-[var(--text-faint)] mt-2"
  }, "Bar height = attempts that day. Green = % correct.")), ((_data$bySubject = data.bySubject) == null ? void 0 : _data$bySubject.length) > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "By subject"), React.createElement("div", {
    className: "space-y-3"
  }, data.bySubject.map(function (s) {
    return React.createElement(StatBar, {
      key: s.subject,
      label: s.subject,
      correct: s.correct,
      total: s.total
    });
  }))), ((_data$byChapter = data.byChapter) == null ? void 0 : _data$byChapter.length) > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "By chapter (weakest first)"), React.createElement("div", {
    className: "space-y-3"
  }, [].concat(data.byChapter).sort(function (a, b) {
    return a.correct / Math.max(1, a.total) - b.correct / Math.max(1, b.total);
  }).map(function (c) {
    return React.createElement(StatBar, {
      key: c.subject + "/" + c.chapter,
      label: c.subject + " \u2014 " + c.chapter,
      correct: c.correct,
      total: c.total
    });
  }))), ((_data$byMode = data.byMode) == null ? void 0 : _data$byMode.length) > 0 && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5"
  }, React.createElement("h3", {
    className: "font-semibold mb-3 text-[var(--text-strong)]"
  }, "By mode"), React.createElement("div", {
    className: "space-y-3"
  }, data.byMode.map(function (m) {
    return React.createElement(StatBar, {
      key: m.mode,
      label: modeLabels[m.mode] || m.mode,
      correct: m.correct,
      total: m.total
    });
  }))));
}
function AuditModal(_ref132) {
  var chapter = _ref132.chapter,
    onClose = _ref132.onClose;
  var _useApp31 = useApp(),
    api = _useApp31.api,
    client = _useApp31.client,
    apiKey = _useApp31.apiKey,
    files = _useApp31.files,
    setQuestionsFor = _useApp31.setQuestionsFor,
    questions = _useApp31.questions;
  var _useState193 = useState('loading'),
    phase = _useState193[0],
    setPhase = _useState193[1];
  var _useState194 = useState([]),
    mc = _useState194[0],
    setMc = _useState194[1];
  var _useState195 = useState([]),
    flags = _useState195[0],
    setFlags = _useState195[1];
  var _useState196 = useState(null),
    status = _useState196[0],
    setStatus = _useState196[1];
  var _useState197 = useState(new Set()),
    applied = _useState197[0],
    setApplied = _useState197[1];
  useEffect(function () {
    var cancelled = false;
    api.getChapter(chapter.id).then(function (full) {
      if (cancelled) return;
      setMc(Array.isArray(full.mc) ? full.mc : []);
      setPhase('ready');
    }).catch(function (e) {
      setStatus({
        kind: 'err',
        msg: e.message
      });
      setPhase('ready');
    });
    return function () {
      cancelled = true;
    };
  }, [chapter.id, api]);
  var localFile = files.find(function (f) {
    return f.chapter_id === chapter.id;
  });
  var runVerify = function () {
    var _ref133 = _asyncToGenerator(_regenerator().m(function _callee63() {
      var mcOnly, results, flagged, _t52, _t53;
      return _regenerator().w(function (_context70) {
        while (1) switch (_context70.p = _context70.n) {
          case 0:
            if (apiKey) {
              _context70.n = 1;
              break;
            }
            setStatus({
              kind: 'err',
              msg: 'Add a Gemini API key in Settings first.'
            });
            return _context70.a(2);
          case 1:
            setPhase('verifying');
            setFlags([]);
            setStatus({
              kind: 'info',
              msg: "Checking " + mc.length + " MC questions\u2026"
            });
            _context70.p = 2;
            mcOnly = mc.filter(function (q) {
              var _q$choices;
              return q.mode === 'mc' && ((_q$choices = q.choices) == null ? void 0 : _q$choices.length) === 4;
            });
            _context70.n = 3;
            return client.auditQuestions(mcOnly);
          case 3:
            results = _context70.v;
            flagged = results.filter(function (r) {
              return !r.correct;
            }).map(function (r) {
              return _extends({}, r, {
                q: mcOnly[r.index]
              });
            });
            setFlags(flagged);
            setPhase('done');
            _context70.p = 4;
            _context70.n = 5;
            return api.putChapterStage(chapter.id, 'audited', {
              ts: Date.now()
            });
          case 5:
            _context70.n = 7;
            break;
          case 6:
            _context70.p = 6;
            _t52 = _context70.v;
          case 7:
            if (!flagged.length) setStatus({
              kind: 'ok',
              msg: 'All questions verified — no issues found!'
            });else setStatus({
              kind: 'warn',
              msg: flagged.length + " question(s) may have wrong correct_index."
            });
            _context70.n = 9;
            break;
          case 8:
            _context70.p = 8;
            _t53 = _context70.v;
            setStatus({
              kind: 'err',
              msg: _t53.message
            });
            setPhase('ready');
          case 9:
            return _context70.a(2);
        }
      }, _callee63, null, [[4, 6], [2, 8]]);
    }));
    return function runVerify() {
      return _ref133.apply(this, arguments);
    };
  }();
  var acceptFix = function () {
    var _ref134 = _asyncToGenerator(_regenerator().m(function _callee64(flag) {
      var updated, qbank, localUpdated, _t54;
      return _regenerator().w(function (_context71) {
        while (1) switch (_context71.p = _context71.n) {
          case 0:
            updated = mc.map(function (q) {
              return q === flag.q ? _extends({}, q, {
                correct_index: flag.suggested_index
              }) : q;
            });
            setMc(updated);
            _context71.p = 1;
            _context71.n = 2;
            return api.putChapterStage(chapter.id, 'mc', updated);
          case 2:
            if (localFile) {
              qbank = questions[localFile.file_id];
              if (qbank != null && qbank.mc) {
                localUpdated = qbank.mc.map(function (q) {
                  return q.id === flag.q.id ? _extends({}, q, {
                    correct_index: flag.suggested_index
                  }) : q;
                });
                setQuestionsFor(localFile.file_id, _extends({}, qbank, {
                  mc: localUpdated
                }));
              }
            }
            setApplied(function (s) {
              return new Set(s).add(flag.q.id);
            });
            setStatus({
              kind: 'ok',
              msg: "Fixed correct_index for \"" + flag.q.question.slice(0, 50) + "\u2026\""
            });
            _context71.n = 4;
            break;
          case 3:
            _context71.p = 3;
            _t54 = _context71.v;
            setStatus({
              kind: 'err',
              msg: _t54.message
            });
          case 4:
            return _context71.a(2);
        }
      }, _callee64, null, [[1, 3]]);
    }));
    return function acceptFix(_x66) {
      return _ref134.apply(this, arguments);
    };
  }();
  return React.createElement("div", {
    className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-16 overflow-y-auto",
    onClick: onClose
  }, React.createElement("div", {
    className: "w-full max-w-2xl bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 space-y-4",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between"
  }, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Audit: ", chapter.title), React.createElement("button", {
    onClick: onClose,
    className: "text-xs px-2 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
  }, "Close")), status && React.createElement("div", {
    className: "text-sm rounded-lg px-3 py-2 " + (status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' : status.kind === 'warn' ? 'bg-[var(--warning-bg)] text-[var(--warning-text)]' : 'bg-[var(--accent-soft)] text-[var(--accent-text)]')
  }, status.msg), phase === 'loading' && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading chapter\u2026"), phase === 'ready' && React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-4"
  }, React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mb-2"
  }, "Send ", mc.filter(function (q) {
    var _q$choices2;
    return q.mode === 'mc' && ((_q$choices2 = q.choices) == null ? void 0 : _q$choices2.length) === 4;
  }).length, " MC questions to Gemini to verify that ", React.createElement("code", null, "correct_index"), " is right. Questions are never deleted \u2014 at worst the correct answer index is changed."), React.createElement("button", {
    onClick: runVerify,
    disabled: !apiKey,
    className: "text-xs rounded px-3 py-1.5 " + (apiKey ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]' : 'bg-[var(--bg-elev)] text-[var(--text-faint)] cursor-not-allowed')
  }, apiKey ? 'Run audit' : 'Needs API key')), phase === 'verifying' && React.createElement("div", {
    className: "text-sm text-[var(--accent-text)]"
  }, "\u2026 running audit, this may take a minute."), phase === 'done' && flags.length > 0 && React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("h3", {
    className: "text-sm font-semibold text-[var(--warning-text)]"
  }, flags.length, " flagged question(s)"), flags.map(function (flag, i) {
    var done = applied.has(flag.q.id);
    var letters = ['A', 'B', 'C', 'D'];
    return React.createElement("div", {
      key: i,
      className: "bg-[var(--bg-card)] border rounded-xl p-4 text-sm space-y-2 " + (done ? 'border-[var(--success-border)] opacity-60' : 'border-[var(--warning-text)]')
    }, React.createElement("p", {
      className: "font-medium"
    }, flag.q.question), React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs"
    }, flag.q.choices.map(function (c, ci) {
      return React.createElement("div", {
        key: ci,
        className: "px-2 py-1 rounded " + (ci === flag.q.correct_index ? 'bg-[var(--danger-bg)] line-through' : ci === flag.suggested_index ? 'bg-[var(--success-bg)] font-semibold' : 'bg-[var(--bg-elev)]')
      }, letters[ci], ". ", c);
    })), React.createElement("p", {
      className: "text-xs text-[var(--text-muted)]"
    }, React.createElement("span", {
      className: "text-[var(--danger-text)]"
    }, "Stored: ", letters[flag.q.correct_index]), ' → ', React.createElement("span", {
      className: "text-[var(--success-text)]"
    }, "Suggested: ", letters[flag.suggested_index]), ' · ', flag.reason), !done && React.createElement("div", {
      className: "flex gap-2"
    }, React.createElement("button", {
      onClick: function onClick() {
        return acceptFix(flag);
      },
      className: "text-xs bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] rounded px-2 py-1 hover:opacity-80"
    }, "Accept fix"), React.createElement("button", {
      onClick: function onClick() {
        return setApplied(function (s) {
          return new Set(s).add(flag.q.id);
        });
      },
      className: "text-xs text-[var(--text-muted)] border border-[var(--border)] rounded px-2 py-1 hover:bg-[var(--bg-hover)]"
    }, "Skip")));
  })), React.createElement("div", {
    className: "text-xs text-[var(--text-faint)]"
  }, mc.length, " MC question(s)")));
}
function StageDot(_ref135) {
  var stage = _ref135.stage,
    label = _ref135.label;
  var done = stage == null ? void 0 : stage.done;
  var partial = (stage == null ? void 0 : stage.terms_missing) > 0;
  var cls = done && !partial ? 'bg-[var(--success-bg-strong)] text-[var(--success-text)] border-[var(--success-border)]' : done && partial ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-text-strong)]' : 'bg-[var(--bg-elev)] text-[var(--text-faint)] border-[var(--border)]';
  var tooltip = label + ": " + (done ? 'done' : 'pending');
  if (stage != null && stage.by) tooltip += " \xB7 by @" + stage.by;
  if ((stage == null ? void 0 : stage.count) != null) tooltip += " \xB7 " + stage.count + " items";
  if (stage != null && stage.term_coverage) tooltip += " \xB7 term coverage: " + stage.term_coverage;
  return React.createElement("span", {
    title: tooltip,
    className: "text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border " + cls
  }, label, (stage == null ? void 0 : stage.count) != null ? " " + stage.count : '');
}
function ChapterRow(_ref136) {
  var _s$extraction, _chapter$stages, _chapter$stages2, _chapter$stages3, _chapter$stages4, _chapter$stages5;
  var chapter = _ref136.chapter,
    onDownload = _ref136.onDownload,
    onContribute = _ref136.onContribute,
    onAudit = _ref136.onAudit,
    busy = _ref136.busy,
    downloaded = _ref136.downloaded,
    canContribute = _ref136.canContribute,
    contributorMode = _ref136.contributorMode;
  var ago = function () {
    var ms = Date.now() - chapter.updated_at;
    var m = Math.round(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + "m ago";
    var h = Math.round(m / 60);
    if (h < 24) return h + "h ago";
    return Math.round(h / 24) + "d ago";
  }();
  var missing = [];
  var s = chapter.stages || {};
  if ((_s$extraction = s.extraction) != null && _s$extraction.done) {
    var _s$mc, _s$mc$terms_missing, _s$mc2, _s$mc3, _s$two_part, _s$short;
    if (!((_s$mc = s.mc) != null && _s$mc.done) || ((_s$mc$terms_missing = (_s$mc2 = s.mc) == null ? void 0 : _s$mc2.terms_missing) != null ? _s$mc$terms_missing : 0) > 0) missing.push({
      key: 'mc',
      label: (_s$mc3 = s.mc) != null && _s$mc3.done ? 'fill missing term coverage' : 'MC'
    });
    if (!((_s$two_part = s.two_part) != null && _s$two_part.done)) missing.push({
      key: 'two_part',
      label: 'two-part'
    });
    if (!((_s$short = s.short) != null && _s$short.done)) missing.push({
      key: 'short',
      label: 'short answer'
    });
  }
  return React.createElement("li", {
    className: "py-3 space-y-2"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("div", {
    className: "flex items-center gap-2 flex-wrap"
  }, React.createElement("span", {
    className: "text-[var(--text)] font-medium break-words"
  }, chapter.title), chapter.status === 'complete' && React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success-text)] shrink-0"
  }, "\u2713 complete"), chapter.status === 'partial' && React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--warning-bg)] text-[var(--warning-text)] shrink-0"
  }, "partial"), chapter.status === 'pending' && React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--bg-elev)] text-[var(--text-faint)] border border-[var(--border)] shrink-0"
  }, "needs extraction")), React.createElement("div", {
    className: "text-xs text-[var(--text-faint)] mt-0.5 break-words"
  }, chapter.filename, " \xB7 by @", chapter.uploader_username, " \xB7 ", ago), React.createElement("div", {
    className: "flex flex-wrap gap-1.5 mt-1.5"
  }, React.createElement(StageDot, {
    stage: (_chapter$stages = chapter.stages) == null ? void 0 : _chapter$stages.extraction,
    label: "extract"
  }), React.createElement(StageDot, {
    stage: (_chapter$stages2 = chapter.stages) == null ? void 0 : _chapter$stages2.mc,
    label: "mc"
  }), React.createElement(StageDot, {
    stage: (_chapter$stages3 = chapter.stages) == null ? void 0 : _chapter$stages3.two_part,
    label: "two-part"
  }), React.createElement(StageDot, {
    stage: (_chapter$stages4 = chapter.stages) == null ? void 0 : _chapter$stages4.short,
    label: "short"
  }))), React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, React.createElement("button", {
    onClick: onDownload,
    disabled: !!busy || chapter.status === 'pending',
    className: "text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium whitespace-nowrap"
  }, busy === 'downloading' ? 'Downloading…' : downloaded ? 'Re-download' : 'Download'), missing.length > 0 && (canContribute ? React.createElement("button", {
    onClick: function onClick() {
      return onContribute(missing.map(function (m) {
        return m.key;
      }));
    },
    disabled: !!busy,
    title: "Run your Gemini key to fill: " + missing.map(function (m) {
      return m.label;
    }).join(', '),
    className: "text-xs px-3 py-1.5 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded font-medium whitespace-nowrap"
  }, busy === 'contributing' ? 'Contributing…' : "Contribute (" + missing.length + ")") : React.createElement("span", {
    className: "text-[11px] text-[var(--text-faint)]",
    title: "Add a Gemini API key in Settings to contribute."
  }, missing.length, " stage", missing.length === 1 ? '' : 's', " need work")), ((_chapter$stages5 = chapter.stages) == null || (_chapter$stages5 = _chapter$stages5.mc) == null ? void 0 : _chapter$stages5.done) && canContribute && contributorMode && React.createElement("button", {
    onClick: onAudit,
    disabled: !!busy,
    title: chapter.audited_at ? "Already audited by @" + chapter.audited_by + ". Click to re-audit." : 'Check that correct_index is right for every MC question',
    className: "text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded whitespace-nowrap"
  }, chapter.audited_at ? 'Re-audit' : 'Audit'), chapter.audited_at && React.createElement("span", {
    className: "text-[10px] uppercase tracking-wide text-[var(--success-text)]",
    title: "Audited by @" + chapter.audited_by
  }, "\u2713 audited")));
}
function BankTab() {
  var _useApp32 = useApp(),
    api = _useApp32.api,
    session = _useApp32.session,
    apiKey = _useApp32.apiKey,
    client = _useApp32.client,
    setFiles = _useApp32.setFiles,
    setExtraction = _useApp32.setExtraction,
    setQuestionsFor = _useApp32.setQuestionsFor,
    files = _useApp32.files,
    contributorMode = _useApp32.contributorMode;
  var _useState198 = useState(null),
    data = _useState198[0],
    setData = _useState198[1];
  var _useState199 = useState(''),
    err = _useState199[0],
    setErr = _useState199[1];
  var _useState200 = useState(null),
    auditChapter = _useState200[0],
    setAuditChapter = _useState200[1];
  var _useState201 = useState(0),
    tick = _useState201[0],
    setTick = _useState201[1];
  var _useState202 = useState(null),
    busyId = _useState202[0],
    setBusyId = _useState202[1];
  var _useState203 = useState(null),
    busyKind = _useState203[0],
    setBusyKind = _useState203[1];
  var _useState204 = useState(null),
    status = _useState204[0],
    setStatus = _useState204[1];
  var _useState205 = useState(''),
    filter = _useState205[0],
    setFilter = _useState205[1];
  var _useState206 = useState(function () {
      return storage.get(KEYS.bankSeen, 0);
    }),
    seenAt = _useState206[0];
  var _useState207 = useState(false),
    summaryDismissed = _useState207[0],
    setSummaryDismissed = _useState207[1];
  var _useState208 = useState({}),
    openSubjects = _useState208[0],
    setOpenSubjects = _useState208[1];
  var toggleSubject = function toggleSubject(s) {
    return setOpenSubjects(function (p) {
      return _extends({}, p, {
        [s]: !p[s]
      });
    });
  };
  useEffect(function () {
    var cancelled = false;
    api.listChapters().then(function (d) {
      if (!cancelled) setData(d);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api, tick]);
  useEffect(function () {
    if (!data) return;
    var changed = seenAt > 0 ? data.chapters.filter(function (c) {
      return (c.updated_at || 0) > seenAt;
    }) : [];
    if (seenAt === 0 || changed.length === 0) {
      storage.set(KEYS.bankSeen, Date.now());
      window.dispatchEvent(new Event('mcat:bankSeen'));
    }
  }, [data, seenAt]);
  var downloadOne = function () {
    var _ref137 = _asyncToGenerator(_regenerator().m(function _callee65(chapter) {
      var full, localFileId, fileRecord;
      return _regenerator().w(function (_context72) {
        while (1) switch (_context72.n) {
          case 0:
            _context72.n = 1;
            return api.getChapter(chapter.id);
          case 1:
            full = _context72.v;
            localFileId = "chap_" + full.id;
            fileRecord = {
              file_id: localFileId,
              file_uri: 'cloud',
              mime_type: 'application/pdf',
              filename: full.filename,
              size_bytes: full.size_bytes || 0,
              subject: full.subject,
              chapter: full.title,
              uploaded_at: new Date(full.created_at).toISOString(),
              chapter_id: full.id,
              chapter_updated_at: full.updated_at
            };
            setFiles(function (prev) {
              return [].concat(prev.filter(function (f) {
                return f.file_id !== localFileId && f.chapter_id !== full.id;
              }), [fileRecord]);
            });
            if (full.extraction) setExtraction(localFileId, full.extraction);
            setQuestionsFor(localFileId, {
              mc: full.mc || [],
              twoPart: full.two_part || [],
              short: full.short || [],
              generated_at: new Date(full.updated_at).toISOString()
            });
            return _context72.a(2, full);
        }
      }, _callee65);
    }));
    return function downloadOne(_x67) {
      return _ref137.apply(this, arguments);
    };
  }();
  var downloadChapter = function () {
    var _ref138 = _asyncToGenerator(_regenerator().m(function _callee66(chapter) {
      var full, _t55;
      return _regenerator().w(function (_context73) {
        while (1) switch (_context73.p = _context73.n) {
          case 0:
            if (!busyId) {
              _context73.n = 1;
              break;
            }
            return _context73.a(2);
          case 1:
            setBusyId(chapter.id);
            setBusyKind('downloading');
            setStatus(null);
            _context73.p = 2;
            _context73.n = 3;
            return downloadOne(chapter);
          case 3:
            full = _context73.v;
            setStatus({
              kind: 'ok',
              msg: "Downloaded \"" + full.title + "\""
            });
            _context73.n = 5;
            break;
          case 4:
            _context73.p = 4;
            _t55 = _context73.v;
            setStatus({
              kind: 'err',
              msg: _t55.message
            });
          case 5:
            _context73.p = 5;
            setBusyId(null);
            setBusyKind(null);
            return _context73.f(5);
          case 6:
            return _context73.a(2);
        }
      }, _callee66, null, [[2, 4, 5, 6]]);
    }));
    return function downloadChapter(_x68) {
      return _ref138.apply(this, arguments);
    };
  }();
  var contributeChapter = function () {
    var _ref139 = _asyncToGenerator(_regenerator().m(function _callee67(chapter, stages) {
      var full, _loop9, _iterator105, _step105, localFile, refreshed, localFileId, fileRecord, _t56, _t57;
      return _regenerator().w(function (_context75) {
        while (1) switch (_context75.p = _context75.n) {
          case 0:
            if (!busyId) {
              _context75.n = 1;
              break;
            }
            return _context75.a(2);
          case 1:
            if (apiKey) {
              _context75.n = 2;
              break;
            }
            setStatus({
              kind: 'err',
              msg: 'Add a Gemini API key in Settings to contribute.'
            });
            return _context75.a(2);
          case 2:
            setBusyId(chapter.id);
            setBusyKind('contributing');
            setStatus({
              kind: 'info',
              msg: "Loading \"" + chapter.title + "\"\u2026"
            });
            _context75.p = 3;
            _context75.n = 4;
            return api.getChapter(chapter.id);
          case 4:
            full = _context75.v;
            if (full.extraction) {
              _context75.n = 5;
              break;
            }
            throw new Error('Chapter has no extraction yet — only the uploader can do that step.');
          case 5:
            _loop9 = _regenerator().m(function _loop9() {
              var stage, newMc, hasBaseline, baseline, termCovered, missingTerms, termExtraction, termQs, twoPart, short;
              return _regenerator().w(function (_context74) {
                while (1) switch (_context74.n) {
                  case 0:
                    stage = _step105.value;
                    if (!(stage === 'mc')) {
                      _context74.n = 6;
                      break;
                    }
                    setStatus({
                      kind: 'info',
                      msg: "Generating MC for \"" + chapter.title + "\"\u2026"
                    });
                    newMc = Array.isArray(full.mc) ? [].concat(full.mc) : [];
                    hasBaseline = newMc.some(function (q) {
                      return (q == null ? void 0 : q.from) !== 'term';
                    });
                    if (hasBaseline) {
                      _context74.n = 2;
                      break;
                    }
                    _context74.n = 1;
                    return client.generateMCQuestions(null, null, full.extraction, full.title);
                  case 1:
                    baseline = _context74.v;
                    newMc = newMc.concat(baseline);
                  case 2:
                    termCovered = new Set(newMc.filter(function (q) {
                      return (q == null ? void 0 : q.from) === 'term';
                    }).map(function (q) {
                      return q.term;
                    }));
                    missingTerms = (full.extraction.key_terms || []).filter(function (t) {
                      return !termCovered.has(t.term);
                    });
                    if (!(missingTerms.length > 0)) {
                      _context74.n = 4;
                      break;
                    }
                    setStatus({
                      kind: 'info',
                      msg: "Generating term coverage (" + missingTerms.length + " terms)\u2026"
                    });
                    termExtraction = _extends({}, full.extraction, {
                      key_terms: missingTerms
                    });
                    _context74.n = 3;
                    return client.generateTermQuestions(termExtraction, full.title);
                  case 3:
                    termQs = _context74.v;
                    newMc = newMc.concat(termQs);
                  case 4:
                    _context74.n = 5;
                    return api.putChapterStage(chapter.id, 'mc', newMc);
                  case 5:
                    _context74.n = 13;
                    break;
                  case 6:
                    if (!(stage === 'two_part')) {
                      _context74.n = 10;
                      break;
                    }
                    setStatus({
                      kind: 'info',
                      msg: "Generating two-part for \"" + chapter.title + "\"\u2026"
                    });
                    _context74.n = 7;
                    return client.generateTwoPartQuestions(full.extraction, full.title);
                  case 7:
                    twoPart = _context74.v;
                    if (twoPart != null && twoPart.length) {
                      _context74.n = 8;
                      break;
                    }
                    throw new Error('Two-part generation returned no items — try again.');
                  case 8:
                    _context74.n = 9;
                    return api.putChapterStage(chapter.id, 'two_part', twoPart);
                  case 9:
                    _context74.n = 13;
                    break;
                  case 10:
                    if (!(stage === 'short')) {
                      _context74.n = 13;
                      break;
                    }
                    setStatus({
                      kind: 'info',
                      msg: "Generating short answer for \"" + chapter.title + "\"\u2026"
                    });
                    _context74.n = 11;
                    return client.generateShortAnswers(null, null, full.extraction, full.title);
                  case 11:
                    short = _context74.v;
                    if (short != null && short.length) {
                      _context74.n = 12;
                      break;
                    }
                    throw new Error('Short-answer generation returned no items — try again.');
                  case 12:
                    _context74.n = 13;
                    return api.putChapterStage(chapter.id, 'short', short);
                  case 13:
                    return _context74.a(2);
                }
              }, _loop9);
            });
            _iterator105 = _createForOfIteratorHelperLoose(stages);
          case 6:
            if ((_step105 = _iterator105()).done) {
              _context75.n = 8;
              break;
            }
            return _context75.d(_regeneratorValues(_loop9()), 7);
          case 7:
            _context75.n = 6;
            break;
          case 8:
            localFile = files.find(function (f) {
              return f.chapter_id === chapter.id;
            });
            if (!localFile) {
              _context75.n = 12;
              break;
            }
            setStatus({
              kind: 'info',
              msg: "Refreshing local copy of \"" + chapter.title + "\"\u2026"
            });
            _context75.p = 9;
            _context75.n = 10;
            return api.getChapter(chapter.id);
          case 10:
            refreshed = _context75.v;
            localFileId = "chap_" + refreshed.id;
            fileRecord = {
              file_id: localFileId,
              file_uri: 'cloud',
              mime_type: 'application/pdf',
              filename: refreshed.filename,
              size_bytes: refreshed.size_bytes || 0,
              subject: refreshed.subject,
              chapter: refreshed.title,
              uploaded_at: new Date(refreshed.created_at).toISOString(),
              chapter_id: refreshed.id
            };
            setFiles(function (prev) {
              return [].concat(prev.filter(function (f) {
                return f.file_id !== localFileId && f.chapter_id !== refreshed.id;
              }), [fileRecord]);
            });
            if (refreshed.extraction) setExtraction(localFileId, refreshed.extraction);
            setQuestionsFor(localFileId, {
              mc: refreshed.mc || [],
              twoPart: refreshed.two_part || [],
              short: refreshed.short || [],
              generated_at: new Date(refreshed.updated_at).toISOString()
            });
            _context75.n = 12;
            break;
          case 11:
            _context75.p = 11;
            _t56 = _context75.v;
          case 12:
            setStatus({
              kind: 'ok',
              msg: "Contributed to \"" + chapter.title + "\"" + (localFile ? ' — local copy updated.' : ' — refreshing.')
            });
            setTick(function (t) {
              return t + 1;
            });
            _context75.n = 14;
            break;
          case 13:
            _context75.p = 13;
            _t57 = _context75.v;
            setStatus({
              kind: 'err',
              msg: _t57.message
            });
          case 14:
            _context75.p = 14;
            setBusyId(null);
            setBusyKind(null);
            return _context75.f(14);
          case 15:
            return _context75.a(2);
        }
      }, _callee67, null, [[9, 11], [3, 13, 14, 15]]);
    }));
    return function contributeChapter(_x69, _x70) {
      return _ref139.apply(this, arguments);
    };
  }();
  if (err) {
    return React.createElement("div", {
      className: "bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-2xl px-4 py-3 text-sm text-[var(--danger-text)] flex items-center justify-between"
    }, React.createElement("span", null, "Could not load bank: ", err), React.createElement("button", {
      onClick: function onClick() {
        return setTick(function (t) {
          return t + 1;
        });
      },
      className: "text-xs px-3 py-1 border border-[var(--danger-border)] rounded"
    }, "Retry"));
  }
  if (!data) return React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading bank\u2026");
  var parseChapterNum = function parseChapterNum(ch) {
    var t = ch.title || '';
    var f = ch.filename || '';
    var m = /chapter\s*(\d+)/i.exec(t);
    if (m) return parseInt(m[1], 10);
    m = /chapter\s*(\d+)/i.exec(f);
    if (m) return parseInt(m[1], 10);
    m = /\bch(\d+)/i.exec(f);
    if (m) return parseInt(m[1], 10);
    return 9999;
  };
  var bySubject = {};
  for (var _iterator106 = _createForOfIteratorHelperLoose(data.chapters), _step106; !(_step106 = _iterator106()).done;) {
    var ch = _step106.value;
    var subj = ch.subject || 'Other';
    if (!bySubject[subj]) bySubject[subj] = [];
    bySubject[subj].push(ch);
  }
  var localChapterIds = new Set(files.map(function (f) {
    return f.chapter_id;
  }).filter(Boolean));
  var subjectOrder = ['Biology', 'Biochemistry', 'General Chemistry', 'Organic Chemistry', 'Physics', 'Behavioral Science', 'Psychology', 'Sociology', 'CARS'];
  var subjects = Object.keys(bySubject).sort(function (a, b) {
    var ai = subjectOrder.indexOf(a),
      bi = subjectOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
  for (var _iterator107 = _createForOfIteratorHelperLoose(subjects), _step107; !(_step107 = _iterator107()).done;) {
    var s = _step107.value;
    bySubject[s].sort(function (a, b) {
      var an = parseChapterNum(a),
        bn = parseChapterNum(b);
      if (an !== bn) return an - bn;
      return (a.title || '').localeCompare(b.title || '');
    });
  }
  var filterLc = filter.toLowerCase();
  var filtered = function filtered(chs) {
    return filterLc ? chs.filter(function (c) {
      return c.title.toLowerCase().includes(filterLc) || c.subject.toLowerCase().includes(filterLc) || c.filename.toLowerCase().includes(filterLc) || (c.uploader_username || '').toLowerCase().includes(filterLc);
    }) : chs;
  };
  var changedChapters = seenAt > 0 ? data.chapters.filter(function (c) {
    return (c.updated_at || 0) > seenAt;
  }).sort(function (a, b) {
    return b.updated_at - a.updated_at;
  }) : [];
  var markBankSeen = function markBankSeen() {
    storage.set(KEYS.bankSeen, Date.now());
    setSummaryDismissed(true);
    window.dispatchEvent(new Event('mcat:bankSeen'));
  };
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3"
  }, React.createElement("div", null, React.createElement("h2", {
    className: "font-semibold text-[var(--text-strong)]"
  }, "Bank"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Every chapter anyone has published. Stage badges show what's been generated. Download any chapter into your local Library to quiz from it.")), React.createElement("input", {
    value: filter,
    onChange: function onChange(e) {
      return setFilter(e.target.value);
    },
    placeholder: "Search by subject, chapter, filename, or uploader\u2026",
    className: "w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-3 py-2 text-sm"
  }), status && React.createElement("div", {
    className: "text-sm rounded-lg px-3 py-2 " + (status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' : status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' : 'bg-[var(--accent-soft)] text-[var(--accent-text)]')
  }, status.kind === 'ok' ? '✓ ' : status.kind === 'info' ? '… ' : '', status.msg)), React.createElement(CarsArchive, null), changedChapters.length > 0 && !summaryDismissed && React.createElement("div", {
    className: "bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-2xl p-4 sm:p-5"
  }, React.createElement("div", {
    className: "flex items-start justify-between gap-3"
  }, React.createElement("div", {
    className: "min-w-0"
  }, React.createElement("h3", {
    className: "font-semibold text-[var(--accent-text)]"
  }, changedChapters.length, " chapter", changedChapters.length === 1 ? '' : 's', " updated since your last visit"), React.createElement("ul", {
    className: "mt-1 text-sm text-[var(--text)] space-y-0.5"
  }, changedChapters.slice(0, 6).map(function (c) {
    return React.createElement("li", {
      key: c.id,
      className: "truncate"
    }, React.createElement("span", {
      className: "font-medium"
    }, c.title), React.createElement("span", {
      className: "text-[var(--text-muted)]"
    }, " \xB7 ", c.subject, " \xB7 by @", c.uploader_username));
  }), changedChapters.length > 6 && React.createElement("li", {
    className: "text-[var(--text-muted)]"
  }, "\u2026and ", changedChapters.length - 6, " more"))), React.createElement("button", {
    onClick: markBankSeen,
    className: "shrink-0 text-xs px-3 py-1.5 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--bg-hover)] rounded font-medium"
  }, "Dismiss"))), data.chapters.length === 0 && React.createElement("div", {
    className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
  }, "No chapters published yet. Publish your local chapters from the Library tab."), subjects.map(function (subject) {
    var list = filtered(bySubject[subject]);
    if (!list.length) return null;
    var open = !!openSubjects[subject];
    var downloadedCount = list.filter(function (c) {
      return localChapterIds.has(c.id);
    }).length;
    return React.createElement("div", {
      key: subject,
      className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl"
    }, React.createElement("button", {
      onClick: function onClick() {
        return toggleSubject(subject);
      },
      className: "w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left",
      "aria-expanded": open
    }, React.createElement("div", {
      className: "flex items-center gap-2 min-w-0"
    }, React.createElement("span", {
      "aria-hidden": "true",
      className: "text-[var(--text-muted)] transition-transform inline-block",
      style: {
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)'
      }
    }, "\u25B6"), React.createElement("h3", {
      className: "font-semibold text-[var(--text-strong)] truncate"
    }, subject)), React.createElement("span", {
      className: "text-xs text-[var(--text-faint)] shrink-0"
    }, downloadedCount, "/", list.length, " downloaded")), open && React.createElement("ul", {
      className: "divide-y divide-[var(--border-soft)] border-t border-[var(--border-soft)] px-4 sm:px-5"
    }, list.map(function (ch) {
      return React.createElement(ChapterRow, {
        key: ch.id,
        chapter: ch,
        onDownload: function onDownload() {
          return downloadChapter(ch);
        },
        onContribute: function onContribute(stages) {
          return contributeChapter(ch, stages);
        },
        onAudit: function onAudit() {
          return setAuditChapter(ch);
        },
        busy: busyId === ch.id ? busyKind : null,
        downloaded: localChapterIds.has(ch.id),
        canContribute: !!session && !!apiKey,
        contributorMode: contributorMode
      });
    })));
  }), auditChapter && React.createElement(AuditModal, {
    chapter: auditChapter,
    onClose: function onClose() {
      setAuditChapter(null);
      setTick(function (t) {
        return t + 1;
      });
    }
  }), React.createElement(ConnectionsArchive, null));
}
function BanksBrowser() {
  var _useApp33 = useApp(),
    api = _useApp33.api,
    session = _useApp33.session,
    setFiles = _useApp33.setFiles,
    setExtraction = _useApp33.setExtraction,
    setQuestionsFor = _useApp33.setQuestionsFor,
    files = _useApp33.files;
  var _useState209 = useState(null),
    data = _useState209[0],
    setData = _useState209[1];
  var _useState210 = useState(''),
    err = _useState210[0],
    setErr = _useState210[1];
  var _useState211 = useState(0),
    tick = _useState211[0],
    setTick = _useState211[1];
  var _useState212 = useState(null),
    busy = _useState212[0],
    setBusy = _useState212[1];
  var _useState213 = useState(null),
    status = _useState213[0],
    setStatus = _useState213[1];
  useEffect(function () {
    var cancelled = false;
    setData(null);
    setErr('');
    api.listBanks().then(function (d) {
      if (!cancelled) setData(d);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api, tick]);
  var download = function () {
    var _ref140 = _asyncToGenerator(_regenerator().m(function _callee68(username) {
      var localCount, msg, bank, _i31, _Object$keys6, fid, _i32, _Object$keys7, _fid2, n, _t58;
      return _regenerator().w(function (_context76) {
        while (1) switch (_context76.p = _context76.n) {
          case 0:
            if (!busy) {
              _context76.n = 1;
              break;
            }
            return _context76.a(2);
          case 1:
            localCount = files.length;
            msg = localCount > 0 ? "Replace your local bank (" + localCount + " chapter" + (localCount === 1 ? '' : 's') + ") with @" + username + "'s bank? Your local data will be lost." : "Download @" + username + "'s bank to this device?";
            if (confirm(msg)) {
              _context76.n = 2;
              break;
            }
            return _context76.a(2);
          case 2:
            setBusy(username);
            setStatus(null);
            _context76.p = 3;
            _context76.n = 4;
            return api.getUserBank(username);
          case 4:
            bank = _context76.v;
            setFiles(bank.files || []);
            storage.set(KEYS.extractions, bank.extractions || {});
            storage.set(KEYS.questions, bank.questions || {});
            for (_i31 = 0, _Object$keys6 = Object.keys(bank.extractions || {}); _i31 < _Object$keys6.length; _i31++) {
              fid = _Object$keys6[_i31];
              setExtraction(fid, bank.extractions[fid]);
            }
            for (_i32 = 0, _Object$keys7 = Object.keys(bank.questions || {}); _i32 < _Object$keys7.length; _i32++) {
              _fid2 = _Object$keys7[_i32];
              setQuestionsFor(_fid2, bank.questions[_fid2]);
            }
            n = (bank.files || []).length;
            setStatus({
              username,
              msg: "Downloaded " + n + " chapter" + (n === 1 ? '' : 's') + " from @" + username,
              kind: 'ok'
            });
            _context76.n = 6;
            break;
          case 5:
            _context76.p = 5;
            _t58 = _context76.v;
            setStatus({
              username,
              msg: _t58.message,
              kind: 'err'
            });
          case 6:
            _context76.p = 6;
            setBusy(null);
            return _context76.f(6);
          case 7:
            return _context76.a(2);
        }
      }, _callee68, null, [[3, 5, 6, 7]]);
    }));
    return function download(_x71) {
      return _ref140.apply(this, arguments);
    };
  }();
  if (err) {
    return React.createElement("div", {
      className: "bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-2xl px-4 py-3 text-sm text-[var(--danger-text)] flex items-center justify-between"
    }, React.createElement("span", null, "Could not load banks: ", err), React.createElement("button", {
      onClick: function onClick() {
        return setTick(function (t) {
          return t + 1;
        });
      },
      className: "text-xs px-3 py-1 border border-[var(--danger-border)] rounded"
    }, "Retry"));
  }
  if (!data) return React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading banks\u2026");
  if (!data.banks.length) {
    return React.createElement("div", {
      className: "bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]"
    }, "No one has published a bank yet. Publish yours from the Library tab.");
  }
  var ago = function ago(ts) {
    var d = Date.now() - ts;
    var m = Math.round(d / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + " min ago";
    var h = Math.round(m / 60);
    if (h < 24) return h + " hr ago";
    return Math.round(h / 24) + " d ago";
  };
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5"
  }, React.createElement("h2", {
    className: "font-semibold mb-1 text-[var(--text-strong)]"
  }, "Published banks"), React.createElement("p", {
    className: "text-sm text-[var(--text-muted)] mb-4"
  }, "Download any user's question bank to study from their chapters. ", ' ', session ? 'Replaces your local bank.' : 'Sign in to download.'), React.createElement("ul", {
    className: "divide-y divide-[var(--border-soft)]"
  }, data.banks.map(function (b) {
    return React.createElement("li", {
      key: b.username,
      className: "py-3 flex items-center gap-3"
    }, React.createElement("div", {
      className: "flex-1 min-w-0"
    }, React.createElement("div", {
      className: "text-[var(--text)] font-medium"
    }, "@", b.username), React.createElement("div", {
      className: "text-xs text-[var(--text-faint)]"
    }, (b.size_bytes / 1024).toFixed(1), " KB \xB7 updated ", ago(b.updated_at)), (status == null ? void 0 : status.username) === b.username && React.createElement("div", {
      className: "text-xs mt-1 " + (status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]')
    }, status.kind === 'ok' ? '✓ ' : '', status.msg)), React.createElement("button", {
      onClick: function onClick() {
        return download(b.username);
      },
      disabled: !session || busy != null,
      className: "shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
    }, busy === b.username ? 'Downloading…' : session ? 'Download' : 'Sign in'));
  }))));
}
function UserProfile(_ref141) {
  var username = _ref141.username,
    onBack = _ref141.onBack;
  var _useApp34 = useApp(),
    api = _useApp34.api;
  var _useState214 = useState(null),
    data = _useState214[0],
    setData = _useState214[1];
  var _useState215 = useState(''),
    err = _useState215[0],
    setErr = _useState215[1];
  useEffect(function () {
    var cancelled = false;
    setData(null);
    setErr('');
    api.userProfile(username).then(function (d) {
      if (!cancelled) setData(d);
    }).catch(function (e) {
      if (!cancelled) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api, username]);
  return React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("button", {
    onClick: onBack,
    className: "text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
  }, "\u2190 Back"), React.createElement("h2", {
    className: "text-xl font-semibold"
  }, "@", username)), err && React.createElement("div", {
    className: "text-sm text-[var(--danger-text)]"
  }, err), !data && !err && React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading\u2026"), data && React.createElement(ServerStatsPayload, {
    data: data
  }));
}
function SyncBar() {
  var _useApp35 = useApp(),
    pendingSync = _useApp35.pendingSync,
    syncBusy = _useApp35.syncBusy,
    syncError = _useApp35.syncError,
    flushSync = _useApp35.flushSync,
    session = _useApp35.session;
  if (!session) return null;
  var count = pendingSync.length;
  return React.createElement("div", {
    className: "flex items-center justify-between gap-3 bg-[var(--bg-card-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-2.5 text-sm"
  }, React.createElement("div", {
    className: "flex items-center gap-2 min-w-0"
  }, syncBusy ? React.createElement("span", {
    className: "text-[var(--accent-text)]"
  }, "Syncing\u2026") : syncError ? React.createElement("span", {
    className: "text-[var(--danger-text)] truncate",
    title: syncError
  }, "Sync error: ", syncError) : count > 0 ? React.createElement("span", {
    className: "text-[var(--warning-text-strong)]"
  }, count, " attempt", count === 1 ? '' : 's', " not yet synced") : React.createElement("span", {
    className: "text-[var(--text-muted)]"
  }, "All attempts synced")), React.createElement("button", {
    onClick: flushSync,
    disabled: syncBusy,
    className: "shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
  }, syncBusy ? '...' : 'Sync now'));
}
function ServerStatsView() {
  var _useApp36 = useApp(),
    api = _useApp36.api,
    session = _useApp36.session,
    pendingSync = _useApp36.pendingSync,
    syncBusy = _useApp36.syncBusy;
  var _useState216 = useState(function () {
      return getStatsCache();
    }),
    data = _useState216[0],
    setData = _useState216[1];
  var _useState217 = useState(''),
    err = _useState217[0],
    setErr = _useState217[1];
  var _useState218 = useState(0),
    tick = _useState218[0],
    setTick = _useState218[1];
  useEffect(function () {
    if (!session) return;
    var cancelled = false;
    setErr('');
    api.meStats().then(function (d) {
      if (!cancelled) {
        setData(d);
        setStatsCache(d);
      }
    }).catch(function (e) {
      if (!cancelled && !getStatsCache()) setErr(e.message);
    });
    return function () {
      cancelled = true;
    };
  }, [api, session == null ? void 0 : session.username, pendingSync.length, syncBusy, tick]);
  if (!session) return null;
  return React.createElement("div", {
    className: "space-y-4"
  }, err ? React.createElement("div", {
    className: "flex items-center justify-between gap-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-xl px-4 py-2.5 text-sm"
  }, React.createElement("span", {
    className: "text-[var(--danger-text)]"
  }, "Could not load stats: ", err), React.createElement("button", {
    onClick: function onClick() {
      return setTick(function (t) {
        return t + 1;
      });
    },
    className: "text-xs px-3 py-1 border border-[var(--danger-border)] text-[var(--danger-text)] rounded hover:bg-[var(--danger-bg-strong)]"
  }, "Retry")) : !data ? React.createElement("div", {
    className: "text-sm text-[var(--text-muted)]"
  }, "Loading server stats\u2026") : React.createElement(ServerStatsPayload, {
    data: data
  }));
}
function StorageWarning() {
  var _useApp37 = useApp(),
    clearAttempts = _useApp37.clearAttempts;
  var _useState219 = useState(null),
    fail = _useState219[0],
    setFail = _useState219[1];
  var _useState220 = useState(0),
    usage = _useState220[0],
    setUsage = _useState220[1];
  useEffect(function () {
    var handler = function handler(e) {
      setFail(e.detail || {
        message: 'Unknown'
      });
      setUsage(storage.usageBytes());
    };
    window.addEventListener('mcat:storage-fail', handler);
    return function () {
      return window.removeEventListener('mcat:storage-fail', handler);
    };
  }, []);
  if (!fail) return null;
  var usedMB = (usage / 1024 / 1024).toFixed(1);
  return React.createElement("div", {
    className: "fixed inset-x-0 z-[55] px-3 py-2 bg-[var(--danger-bg)] border-b border-[var(--danger-border)] text-[var(--danger-text)] flex flex-wrap items-center gap-2 text-xs",
    style: {
      top: 'var(--mcat-header-h, 56px)'
    }
  }, React.createElement("strong", {
    className: "whitespace-nowrap"
  }, fail.quota ? "Storage full (" + usedMB + " MB used)" : 'Could not save to storage'), React.createElement("span", {
    className: "flex-1 min-w-0"
  }, "\u2014 your last chapter re-download didn't persist. After clearing, re-download from the Bank tab."), React.createElement("button", {
    onClick: function onClick() {
      if (confirm('Clear all quiz attempts? They are already synced to your account if you are signed in.')) {
        clearAttempts();
        setFail(null);
      }
    },
    className: "shrink-0 px-2 py-1 rounded border border-[var(--danger-border)] hover:bg-[var(--danger-bg-strong)]"
  }, "Clear attempts"), React.createElement("button", {
    onClick: function onClick() {
      if (!confirm('Drop the crash log + CARS/Connections payload caches? Safe — they are caches, not history.')) return;
      try {
        localStorage.removeItem('mcat:crashlog');
      } catch (_unused53) {}
      try {
        localStorage.removeItem('mcat:carsCache');
      } catch (_unused54) {}
      try {
        localStorage.removeItem('mcat:connectionsCache');
      } catch (_unused55) {}
      try {
        localStorage.removeItem('mcat:connExplain');
      } catch (_unused56) {}
      try {
        localStorage.removeItem('mcat:termDefs');
      } catch (_unused57) {}
      setFail(null);
    },
    className: "shrink-0 px-2 py-1 rounded border border-[var(--danger-border)] hover:bg-[var(--danger-bg-strong)]"
  }, "Clear caches"), React.createElement("button", {
    onClick: function onClick() {
      return setFail(null);
    },
    className: "shrink-0 px-2 py-1 rounded hover:bg-[var(--danger-bg-strong)]",
    "aria-label": "Dismiss"
  }, "\xD7"));
}
function Shell() {
  var _useApp38 = useApp(),
    apiKey = _useApp38.apiKey,
    setApiKey = _useApp38.setApiKey,
    attempts = _useApp38.attempts,
    readOnly = _useApp38.readOnly,
    files = _useApp38.files,
    extractions = _useApp38.extractions,
    questions = _useApp38.questions,
    session = _useApp38.session,
    setSession = _useApp38.setSession,
    pendingSync = _useApp38.pendingSync,
    syncBusy = _useApp38.syncBusy,
    api = _useApp38.api,
    palette = _useApp38.palette,
    mode = _useApp38.mode,
    contributorMode = _useApp38.contributorMode;
  var _useState221 = useState('home'),
    tab = _useState221[0],
    setTab = _useState221[1];
  var _useState222 = useState(false),
    showAccount = _useState222[0],
    setShowAccount = _useState222[1];
  var _useState223 = useState(false),
    showSettings = _useState223[0],
    setShowSettings = _useState223[1];
  var _useState224 = useState(null),
    profileUser = _useState224[0],
    setProfileUser = _useState224[1];
  var _useState225 = useState(false),
    bankHasUpdates = _useState225[0],
    setBankHasUpdates = _useState225[1];
  useEffect(function () {
    var cancelled = false;
    api.listChapters().then(function (d) {
      if (cancelled) return;
      var seen = storage.get(KEYS.bankSeen, 0);
      var newest = Math.max.apply(Math, [0].concat((d.chapters || []).map(function (c) {
        return c.updated_at || 0;
      })));
      setBankHasUpdates(newest > seen);
    }).catch(function () {});
    return function () {
      cancelled = true;
    };
  }, [api]);
  useEffect(function () {
    var onSeen = function onSeen() {
      return setBankHasUpdates(false);
    };
    window.addEventListener('mcat:bankSeen', onSeen);
    return function () {
      return window.removeEventListener('mcat:bankSeen', onSeen);
    };
  }, []);
  var _useState226 = useState(false),
    carsReady = _useState226[0],
    setCarsReady = _useState226[1];
  var recheckCars = useCallback(function () {
    var d = todayStr();
    var keys = Array.from({
      length: CARS_DAILY_COUNT
    }).map(function (_, i) {
      return carsDateKey(d, i + 1);
    });
    Promise.all(keys.map(function (key) {
      return api.getCars(key).then(function (res) {
        setCarsCachePayload(key, res.payload);
        return !getCarsResults()[key];
      }).catch(function () {
        return false;
      });
    })).then(function (ready) {
      return setCarsReady(ready.some(Boolean));
    });
  }, [api]);
  useEffect(function () {
    recheckCars();
  }, [recheckCars]);
  useEffect(function () {
    var onDone = function onDone() {
      return setCarsReady(false);
    };
    window.addEventListener('mcat:carsDone', onDone);
    return function () {
      return window.removeEventListener('mcat:carsDone', onDone);
    };
  }, []);
  useEffect(function () {
    if (!session) return;
    var cancelled = false;
    var beat = function beat() {
      if (cancelled || document.visibilityState !== 'visible') return;
      api.ping().catch(function () {});
    };
    beat();
    var onVis = function onVis() {
      if (document.visibilityState === 'visible') beat();
    };
    document.addEventListener('visibilitychange', onVis);
    var interval = setInterval(beat, 60 * 1000);
    return function () {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [api, session]);
  useEffect(function () {
    var onClick = function onClick(e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      if (btn.hasAttribute('data-no-haptic')) return;
      hudClick();
    };
    document.addEventListener('click', onClick, true);
    return function () {
      return document.removeEventListener('click', onClick, true);
    };
  }, []);
  var hasLibrary = apiKey || readOnly || session;
  var tabs = [['lessons', 'Lessons'], ['study', 'Study'], ['home', 'Home'], ['stats', 'Stats'], ['banks', 'Bank']];
  useEffect(function () {
    if (readOnly) setTab('home');else if (!hasLibrary) setTab('home');
  }, [readOnly, hasLibrary]);
  useEffect(function () {
    setProfileUser(null);
  }, [tab]);
  var tabRef = useRef(tab);
  useEffect(function () {
    tabRef.current = tab;
  }, [tab]);
  var tabKeys = tabs.map(function (_ref142) {
    var k = _ref142[0];
    return k;
  });
  var scrollMemoryRef = useRef({});
  var switchTab = useCallback(function (newTab) {
    if (newTab === tabRef.current) return;
    scrollMemoryRef.current[tabRef.current] = window.scrollY;
    setTab(newTab);
  }, []);
  useLayoutEffect(function () {
    var _scrollMemoryRef$curr;
    var target = (_scrollMemoryRef$curr = scrollMemoryRef.current[tab]) != null ? _scrollMemoryRef$curr : 0;
    window.scrollTo(0, target);
  }, [tab]);
  var tabWrap = function tabWrap(k, baseClass) {
    return {
      className: baseClass,
      style: tab === k ? undefined : {
        display: 'none'
      }
    };
  };
  var tabIs = function tabIs(k) {
    return tabKeys.includes(k);
  };
  var fullyProcessed = files.filter(function (f) {
    var _questions$f$file_id0, _questions$f$file_id1;
    return extractions[f.file_id] && ((_questions$f$file_id0 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id0.mc) && ((_questions$f$file_id1 = questions[f.file_id]) == null ? void 0 : _questions$f$file_id1.short);
  }).length;
  var headerRef = useRef(null);
  var _useState227 = useState(56),
    headerH = _useState227[0],
    setHeaderH = _useState227[1];
  useLayoutEffect(function () {
    var measure = function measure() {
      if (!headerRef.current) return;
      var h = headerRef.current.offsetHeight;
      setHeaderH(h);
      document.documentElement.style.setProperty('--mcat-header-h', h + "px");
    };
    measure();
    var ro = typeof ResizeObserver !== 'undefined' && headerRef.current ? new ResizeObserver(measure) : null;
    if (ro) ro.observe(headerRef.current);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return function () {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);
  return React.createElement("div", {
    className: "min-h-full flex flex-col"
  }, React.createElement(StorageWarning, null), React.createElement("header", {
    ref: headerRef,
    className: "fixed top-0 inset-x-0 z-40 border-b border-[var(--border-soft)] bg-[var(--bg)] px-3 sm:px-5 pb-2.5 sm:pb-3 flex flex-wrap items-center gap-y-2 gap-x-3",
    style: {
      paddingTop: 'max(0.625rem, calc(env(safe-area-inset-top) + 0.25rem))'
    }
  }, React.createElement("div", {
    className: "flex items-center gap-2 sm:gap-3 order-1 flex-1"
  }, React.createElement("div", {
    className: "w-7 h-7 rounded bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]"
  }), React.createElement("div", {
    className: "font-semibold text-sm sm:text-base"
  }, "MCAT Study"), readOnly ? React.createElement("span", {
    className: "text-[10px] sm:text-xs text-[var(--success-text)] bg-[var(--success-bg)] rounded px-1.5 sm:px-2 py-0.5"
  }, "read-only") : React.createElement("span", {
    className: "hidden sm:inline text-xs text-[var(--text-faint)] font-mono"
  }, MODEL)), React.createElement("nav", {
    className: "flex items-center justify-center gap-1 overflow-x-auto order-3 sm:order-2 w-full sm:w-auto"
  }, tabs.map(function (_ref143) {
    var k = _ref143[0],
      label = _ref143[1];
    return React.createElement("button", {
      key: k,
      onClick: function onClick() {
        return switchTab(k);
      },
      className: "relative text-sm px-3 py-2 sm:py-1.5 rounded whitespace-nowrap shrink-0 " + (tab === k ? 'bg-[var(--bg-hover)] text-[var(--text-strong)]' : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]')
    }, label, (k === 'banks' && bankHasUpdates || k === 'home' && carsReady) && React.createElement("span", {
      className: "absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--danger-border)]"
    }));
  })), React.createElement("div", {
    className: "flex items-center justify-end gap-2 sm:gap-3 text-xs text-[var(--text-muted)] order-2 sm:order-3 flex-1"
  }, session ? React.createElement("button", {
    onClick: function onClick() {
      return setShowAccount(function (s) {
        return !s;
      });
    },
    className: "px-2 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] flex items-center gap-1.5",
    title: pendingSync.length ? pendingSync.length + " attempts pending sync" : 'Signed in'
  }, React.createElement("span", {
    className: "text-[var(--text-strong)]"
  }, "@", session.username), (pendingSync.length > 0 || syncBusy) && React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-[var(--warning-text-strong)]"
  })) : React.createElement("button", {
    onClick: function onClick() {
      return setShowAccount(function (s) {
        return !s;
      });
    },
    className: "px-2 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-strong)]"
  }, "Sign in"), React.createElement("button", {
    onClick: function onClick() {
      return setShowSettings(true);
    },
    "aria-label": "Settings",
    title: "Settings",
    className: "w-9 h-9 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 flex items-center justify-center border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-strong)]"
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "w-4 h-4"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  }))))), React.createElement("div", {
    style: {
      height: headerH,
      flexShrink: 0
    }
  }), React.createElement("main", {
    className: "flex-1 px-3 pb-3 pt-[17px] sm:px-6 sm:pb-6 sm:pt-[29px] overflow-x-hidden"
  }, React.createElement("div", {
    className: "max-w-3xl mx-auto"
  }, tabIs('home') && React.createElement("div", tabWrap('home', ''), React.createElement(HomeView, {
    onGoToStudy: function onGoToStudy() {
      return switchTab('study');
    }
  })), tabIs('lessons') && React.createElement("div", tabWrap('lessons', 'space-y-4 sm:space-y-5'), React.createElement(LessonsView, {
    onGoToStudy: function onGoToStudy() {
      return switchTab('study');
    }
  })), tabIs('stats') && React.createElement("div", tabWrap('stats', 'space-y-4 sm:space-y-5'), profileUser ? React.createElement(UserProfile, {
    username: profileUser,
    onBack: function onBack() {
      return setProfileUser(null);
    }
  }) : React.createElement(React.Fragment, null, React.createElement(McatPredictionCard, null), session && React.createElement(ServerStatsView, null), React.createElement(StatsView, null))), tabIs('banks') && React.createElement("div", tabWrap('banks', 'space-y-4 sm:space-y-5'), contributorMode && !readOnly && apiKey && React.createElement(UploadPanel, null), contributorMode && session && React.createElement(PublishAllPanel, null), contributorMode && fullyProcessed > 0 && React.createElement("div", {
    className: "flex justify-end"
  }, React.createElement("button", {
    onClick: function onClick() {
      return exportBank({
        files,
        extractions,
        questions
      });
    },
    className: "text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] rounded"
  }, "Export data.json locally")), React.createElement(FlagFixesPanel, null), React.createElement(BankTab, null)), React.createElement("div", {
    style: tab === 'study' ? undefined : {
      display: 'none'
    }
  }, React.createElement(StudyView, null)))), showAccount && React.createElement("div", {
    className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-24",
    onClick: function onClick() {
      return setShowAccount(false);
    }
  }, React.createElement("div", {
    className: "w-full max-w-md",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement(AccountPanel, {
    onClose: function onClose() {
      return setShowAccount(false);
    }
  }))), showSettings && React.createElement("div", {
    className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20 overflow-y-auto",
    onClick: function onClick() {
      return setShowSettings(false);
    }
  }, React.createElement("div", {
    className: "w-full max-w-md",
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement(SettingsPanel, {
    onClose: function onClose() {
      return setShowSettings(false);
    }
  }))));
}
function Root() {
  var _useApp39 = useApp(),
    apiKey = _useApp39.apiKey,
    readOnly = _useApp39.readOnly,
    session = _useApp39.session;
  return apiKey || readOnly || session ? React.createElement(Shell, null) : React.createElement(ApiKeyGate, null);
}
try {
  storage.migrateCompressIfNeeded();
} catch (_unused58) {}
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(AppProvider, null, React.createElement(MoleculeProvider, null, React.createElement(FigureProvider, null, React.createElement(Root, null))))));
