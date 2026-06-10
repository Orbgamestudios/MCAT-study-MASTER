const { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef, createContext, useContext } = React;

// ---------- config ----------
const MODEL = 'gemini-2.5-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const UPLOAD_BASE = 'https://generativelanguage.googleapis.com/upload/v1beta';

// Cloudflare Worker backend (accounts, attempt sync, stats, leaderboard).
const API_BASE = 'https://mcat-api.solitary-sky-76c1.workers.dev';

// How many of each item to pre-generate per chapter. Tune freely.
const DEFAULT_MC_COUNT = 15;
const DEFAULT_SHORT_COUNT = 8;

// ---------- storage ----------
const KEYS = {
  apiKey: 'mcat:apiKey',
  files: 'mcat:files',
  questions: 'mcat:questions',
  attempts: 'mcat:attempts',
  extractions: 'mcat:extractions',
  theme: 'mcat:theme',
  github: 'mcat:github',
  session: 'mcat:session',
  pendingSync: 'mcat:pendingSync',
  flagQueue: 'mcat:flagQueue', // Flagged questions awaiting Gemini fix (rate-limit safe)
  reaudit: 'mcat:reaudit', // boolean — show Audit button on already-audited chapters
  volume: 'mcat:volume', // 0-1, global SFX volume multiplier (default 1)
  autoDownload: 'mcat:autoDownload', // boolean — re-download updated chapters on app load (auto-UPDATE)
  autoDownloadAll: 'mcat:autoDownloadAll', // boolean — download every cloud chapter that isn't local yet
  contributorMode: 'mcat:contributorMode', // boolean — show upload/publish/export panels in Library
  tropicalBg: 'mcat:tropicalBg',    // boolean — tropical island background
  bgBlur:     'mcat:bgBlur',        // 0-100 % — blur applied to the dynamic background canvas
  experimentalUI: 'mcat:experimentalUI', // boolean — opt-in redesigned UI (sets data-exp on <html>)
  glass:      'mcat:glass',         // boolean — liquid-glass skin; only applies when experimentalUI is on
  bankSeen: 'mcat:bankSeen', // timestamp — last time the user reviewed the Bank tab
  cars: 'mcat:cars', // { [date]: { score, total, completed_at } } — daily CARS results
  connectionsResults: 'mcat:connectionsResults', // { [date]: { solved, mistakes, completed_at } }
  lessonsCache: 'mcat:lessonsCache', // { [chapter_id]: lessonObject } — downloaded lesson bodies
  lessonProgress: 'mcat:lessonProgress', // { [chapter_id]: { completed_at } } — kept after body removed
  lessonGates: 'mcat:lessonGates', // { [chapter_id]: { unlocked, mastered, mastered_at } } — checkpoint gating
  stateUpdatedAt: 'mcat:stateUpdatedAt', // ms — local clock of the last per-user state push (sync bookkeeping)
};

// ---------- cross-device state sync ----------
// The per-user keys that follow the account between devices. Deliberately excludes
// secrets (apiKey), auth (session), the separately-synced bank/attempts, the heavy
// lesson-body cache (re-downloadable), and ephemeral queues.
const SYNC_STATE_KEYS = [
  'mcat:cars', 'mcat:connectionsResults', 'mcat:lessonProgress', 'mcat:lessonGates',
  'mcat:theme', 'mcat:volume', 'mcat:tropicalBg', 'mcat:bgBlur',
  'mcat:experimentalUI', 'mcat:glass',
  'mcat:autoDownload', 'mcat:autoDownloadAll', 'mcat:contributorMode', 'mcat:reaudit', 'mcat:bankSeen',
];
// Keys whose value is a { [id]: entry } map and must be merged per-entry (union,
// newest-entry-wins) rather than overwritten wholesale — so progress made on two
// devices for different days/chapters is never lost.
const MAP_STATE_KEYS = new Set([
  'mcat:cars', 'mcat:connectionsResults', 'mcat:lessonProgress', 'mcat:lessonGates',
]);

// How recently an entry was touched, used to pick a winner on a per-id conflict.
// Progress is monotonic forward (you don't un-complete a day or un-master a chapter),
// so the larger timestamp is always the one to keep.
function syncEntryRecency(entry) {
  if (!entry || typeof entry !== 'object') return 0;
  return Math.max(0, entry.completed_at || 0, entry.mastered_at || 0, entry.unlocked_at || 0, entry.ts || 0);
}

// Merge a local and a cloud state blob. Map keys union their entries; scalar
// settings take the value from whichever blob is newer (cloudNewer decides ties).
function mergeSyncState(local, cloud, cloudNewer) {
  local = local || {};
  cloud = cloud || {};
  const merged = {};
  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  for (const k of keys) {
    const lv = local[k];
    const cv = cloud[k];
    if (MAP_STATE_KEYS.has(k)) {
      const lm = (lv && typeof lv === 'object') ? lv : {};
      const cm = (cv && typeof cv === 'object') ? cv : {};
      const out = {};
      for (const id of new Set([...Object.keys(lm), ...Object.keys(cm)])) {
        if (!(id in lm)) out[id] = cm[id];
        else if (!(id in cm)) out[id] = lm[id];
        else out[id] = syncEntryRecency(cm[id]) > syncEntryRecency(lm[id]) ? cm[id] : lm[id];
      }
      merged[k] = out;
    } else {
      if (cv === undefined) merged[k] = lv;
      else if (lv === undefined) merged[k] = cv;
      else merged[k] = cloudNewer ? cv : lv;
    }
  }
  return merged;
}

// Snapshot the synced keys from localStorage into one object.
function readSyncState() {
  const out = {};
  for (const k of SYNC_STATE_KEYS) {
    const v = storage.get(k, undefined);
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out;
}

// Stable serialization (fixed top-level key order) for cheap change-detection.
function serializeSyncState(obj) {
  const out = {};
  for (const k of SYNC_STATE_KEYS) if (obj && obj[k] !== undefined) out[k] = obj[k];
  return JSON.stringify(out);
}

// Fired by the progress/result writers so the provider can debounce a push.
function markStateDirty() {
  try { window.dispatchEvent(new Event('mcat:stateDirty')); } catch {}
}

// Sections are studied in groups of this size; each group is gated by a
// cumulative checkpoint quiz that must be passed 100% to unlock the next group.
const LESSON_GROUP_SIZE = 3;
const LESSON_CHECKPOINT_Q = 15; // cumulative MC questions per checkpoint
const LESSON_FINAL_Q = 30;      // cumulative MC questions for the final exam

// Theme is a (palette, mode) pair. Palette picks the colour family; mode picks
// light/dark, or follows the OS when 'system'. The pair resolves to one of the
// six concrete data-theme values the CSS defines.
const PALETTES = ['cold', 'warm', 'duo', 'tropical', 'madison'];
const MODES = ['light', 'dark', 'system'];
function systemPrefersDark() {
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches; }
  catch { return true; }
}
function dataThemeFor(palette, mode) {
  const dark = mode === 'dark' || (mode === 'system' && systemPrefersDark());
  if (palette === 'warm') return dark ? 'darkwarm' : 'warm';
  if (palette === 'duo') return dark ? 'darkgreen' : 'green';
  if (palette === 'tropical') return dark ? 'darktropical' : 'tropical';
  if (palette === 'madison') return dark ? 'darkmadison' : 'madison';
  return dark ? 'dark' : 'light'; // cold
}
// ---------- dynamic background — Canvas 2D renderer ----------
// CSS gradients are inherently blurry. This renderer uses Canvas 2D to draw
// crisp sky gradients, sharp particles (snowflakes, leaves, motes, sparkles),
// and multi-layer animated effects (aurora bands, god rays, ocean waves).
// A fixed <canvas> sits behind #root (z-index:0); #root has z-index:1.
// html.background = edge colour covers iOS overscroll / pinch-zoom-out white.

let _dynBgCleanup = null;

function stopDynamicBg() {
  if (_dynBgCleanup) { _dynBgCleanup(); _dynBgCleanup = null; }
}

// ── helpers ──────────────────────────────────────────────────────────────────
function _rnd(a, b) { return a + Math.random() * (b - a); }
function _pi2() { return Math.random() * Math.PI * 2; }

// Lazy-init + ease a per-state wind vector. Particles add state.wind.current
// to their x each frame for a unified gust effect. Target retargets at
// randomized intervals so the wind direction and strength vary naturally.
//   minStrength, maxStrength: px/frame range for a new target
//   flipSecsRange: [minSec, maxSec] until the next retarget
function _stepWind(state, minStrength, maxStrength, flipSecsRange) {
  if (!state.wind) state.wind = {
    current: 0,
    target: _rnd(minStrength, maxStrength) * 0.4,
    flip: Math.floor(30 * _rnd(flipSecsRange[0], flipSecsRange[1])),
  };
  const w = state.wind;
  w.flip -= 1;
  if (w.flip <= 0) {
    w.target = _rnd(minStrength, maxStrength);
    w.flip = Math.floor(30 * _rnd(flipSecsRange[0], flipSecsRange[1]));
  }
  // Slow ease toward target — wind changes direction over many seconds, not
  // a fraction of a second.
  w.current += (w.target - w.current) * 0.0045;
}

// ── particle / state factories ────────────────────────────────────────────────
function _initCold(w, h, isDark) {
  const count = isDark ? 180 : 130;
  return {
    flakes: Array.from({ length: count }, () => ({
      x: _rnd(0, w), y: _rnd(0, h),
      r: _rnd(0.7, isDark ? 2.4 : 3.2),
      vy: _rnd(0.35, 1.5),
      drift: _rnd(0.2, 0.55),
      dp: _pi2(),
      op: _rnd(0.35, 0.88),
    })),
    // fixed star positions for night sky (seeded once)
    stars: isDark ? Array.from({ length: 80 }, () => ({
      x: _rnd(0, w), y: _rnd(0, h * 0.55),
      r: _rnd(0.4, 1.3),
      op: _rnd(0.3, 0.9),
      tp: _pi2(), // twinkle phase
    })) : [],
    // Distant snow-capped range. Two parallax layers — a hazy back ridge
    // and a sharper front ridge. Each gets a seeded phase so the silhouette
    // is consistent across redraws. Heights and base lines tuned for a
    // taller, more imposing alpine skyline.
    mountains: {
      back:  { seed: _rnd(0, 1000), baseRel: 0.74, maxH: 210 },
      front: { seed: _rnd(0, 1000), baseRel: 0.80, maxH: 150 },
    },
  };
}

function _initWarm(w, h) {
  const palette = ['#d4380a','#e8720c','#f0a818','#c83608','#8b2802','#f06010','#e04808','#b83206'];
  // Trees scattered along the ground, sorted back-to-front by scale.
  const trees = Array.from({ length: 14 }, () => {
    const scale = _rnd(0.9, 2.2);
    return {
      x: _rnd(-w * 0.05, w * 1.05),
      scale,
      // crown radius scaled per tree
      cr: 56 * scale,
      // trunk height
      th: 110 * scale,
      // foliage hue index (used for slight crown tint variation)
      hue: Math.floor(_rnd(0, palette.length)),
      sway: _pi2(),
    };
  }).sort((a, b) => a.scale - b.scale);
  return {
    trees,
    leaves: Array.from({ length: 58 }, () => ({
      x: _rnd(-30, w + 30), y: _rnd(-h * 0.3, h),
      sz: _rnd(5, 13),
      rot: _pi2(),
      rs: _rnd(-0.045, 0.045),
      vy: _rnd(0.45, 1.8),
      drift: _rnd(0.5, 1.3),
      dp: _pi2(),
      col: palette[Math.floor(Math.random() * palette.length)],
      type: Math.random() < 0.5 ? 0 : 1, // 0=oval 1=maple
    })),
    // Autumn-tinted mountain range behind the trees. Sharper, taller
    // peaks for a more rugged appalachian-fall silhouette.
    mountains: {
      back:  { seed: _rnd(0, 1000), baseRel: 0.78, maxH: 230 },
      front: { seed: _rnd(0, 1000), baseRel: 0.84, maxH: 160 },
    },
  };
}

function _initDuo(w, h) {
  // Rio de Janeiro skyline: two Sugarloaf-shaped granite domes flanking
  // Corcovado in the centre with Christ the Redeemer perched on top.
  // Layout proportions are relative to canvas size so it scales sensibly.
  //
  //  far hills  — hazy back ridge, sets the horizon
  //  domes      — three granite domes; the centre one carries the statue
  //  water      — Guanabara Bay at the bottom ~22% of the canvas
  //
  // The exact geometry is fixed at init (no procedural seed per frame) so
  // the skyline is consistent across redraws — only birds, water shimmer,
  // and rain animate.
  const horizonY = h * 0.62;
  const waterTop = h * 0.78;
  const domes = [
    // Smaller side dome, far left
    { cx: w * 0.18, baseY: waterTop, halfW: w * 0.13, peakY: h * 0.50 },
    // Corcovado — the tallest, centre, statue on top
    { cx: w * 0.52, baseY: waterTop, halfW: w * 0.18, peakY: h * 0.32, isCorcovado: true },
    // Sugarloaf — distinctive narrow tall dome, right
    { cx: w * 0.82, baseY: waterTop, halfW: w * 0.09, peakY: h * 0.46 },
  ];
  // Jungle foliage silhouettes lining Guanabara Bay between and around
  // the granite domes. Each clump is a small radial blob with a few darker
  // sub-blobs and a thin trunk, drawn just above the water line. Positions
  // are seeded at init so the foliage layout is stable across frames.
  const foliage = [];
  const FOLIAGE_COUNT = 28;
  for (let i = 0; i < FOLIAGE_COUNT; i++) {
    const fx = _rnd(0, w);
    // Skip clumps that fall on top of the central Corcovado peak so the
    // statue doesn't get buried in green.
    const onCorco = Math.abs(fx - w * 0.52) < w * 0.10;
    if (onCorco && Math.random() < 0.75) continue;
    foliage.push({
      x: fx,
      y: waterTop - _rnd(0, 14),
      scale: _rnd(0.7, 1.6),
      kind: Math.random() < 0.4 ? 'palm' : 'bush',
      sway: _pi2(),
      hueTilt: _rnd(-12, 12),
    });
  }
  return {
    horizonY,
    waterTop,
    domes,
    foliage,
    // Soft far hills behind the domes.
    farHills: { seed: _rnd(0, 1000), baseRel: 0.66, maxH: h * 0.08 },
    // Frigate birds gliding above the bay.
    birds: Array.from({ length: 5 }, () => ({
      x: _rnd(0, w),
      y: _rnd(h * 0.15, h * 0.50),
      sp: _rnd(0.2, 0.55),
      sz: _rnd(4, 9),
      ph: _pi2(),
      fp: _rnd(0.13, 0.22),
    })),
    // Faint sun rays — kept from the old jungle scene because they read
    // well over the bay water.
    rays: Array.from({ length: 5 }, () => ({
      x: _rnd(w * 0.08, w * 0.92),
      wid: _rnd(20, 70),
      alp: _rnd(0.04, 0.10),
      sp: _rnd(0.003, 0.008),
      ph: _pi2(),
    })),
    // Water shimmer rows — horizontal highlight lines on Guanabara Bay.
    shimmer: Array.from({ length: 10 }, () => ({
      yRel: _rnd(0, 1),
      sp: _rnd(0.004, 0.011),
      ph: _pi2(),
      len: _rnd(0.3, 0.7),
      alp: _rnd(0.06, 0.18),
    })),
    // Night-only star field over Rio — denser than the cold theme's
    // because the sky here covers more vertical real estate.
    stars: Array.from({ length: 110 }, () => ({
      x: _rnd(0, w),
      y: _rnd(0, h * 0.58),
      r: _rnd(0.5, 1.6),
      op: _rnd(0.3, 0.95),
      tp: _pi2(),
    })),
    // Rare shooting star slot. Same controller shape as the Madison
    // night-sky shooter for consistency.
    shooter: { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, nextSpawn: _rnd(120, 320) },
    // Rain — same controller as before.
    rain: (() => {
      const startRaining = Math.random() < 0.20;
      return {
        drops: Array.from({ length: 220 }, () => ({
          x: _rnd(-40, w + 40),
          y: _rnd(-h, h),
          len: _rnd(8, 18),
          vy: _rnd(8, 14),
          vx: _rnd(-2.4, -1.2),
          alp: _rnd(0.35, 0.7),
        })),
        intensity: startRaining ? 1 : 0,
        target: startRaining ? 1 : 0,
        nextFlip: startRaining
          ? Math.floor(30 * _rnd(240, 600))   // 4–10 min wet
          : Math.floor(30 * _rnd(360, 840)),  // 6–14 min dry
        stormPower: 0,
        stormTarget: startRaining ? (Math.random() < 0.4 ? _rnd(0.65, 1.0) : _rnd(0.15, 0.4)) : 0,
        flash: 0,
        flashCooldown: 0,
        bolt: null,
      };
    })(),
  };
}

function _initTropical(w, h, isDark) {
  // Beach scene layout (top to bottom):
  //   sky:   0           ..  horizon (~50%)
  //   water: horizon     ..  shoreline (~80%)
  //   sand:  shoreline   ..  h
  const horizon   = h * 0.50;
  const shoreline = h * 0.80;
  const sandH     = h - shoreline;

  // Wave bands sit between horizon and shoreline so the water area is
  // visibly bounded by sand on the bottom edge.
  const waves = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    const y0 = horizon + (shoreline - horizon) * (0.1 + 0.85 * t);
    return {
      ph: _pi2(),
      amp: 3 + i * 2.6,
      freq: 0.012 - i * 0.0010,
      sp: 0.014 + i * 0.005,
      y0,
      col: isDark
        ? [`rgba(10,52,92,0.55)`,`rgba(7,40,76,0.58)`,`rgba(5,28,58,0.62)`,`rgba(3,20,46,0.66)`,`rgba(2,14,36,0.70)`,`rgba(2,10,28,0.76)`][i]
        : [`rgba(40,140,160,0.55)`,`rgba(60,150,170,0.60)`,`rgba(90,170,185,0.62)`,`rgba(150,195,200,0.62)`,`rgba(210,200,165,0.55)`,`rgba(245,225,180,0.55)`][i],
    };
  });

  return {
    horizon, shoreline, sandH,
    waves,
    // Day-only seagull silhouettes drifting across the sunset sky.
    birds: isDark ? [] : Array.from({ length: 5 }, () => ({
      x: _rnd(0, w),
      y: _rnd(h * 0.10, horizon * 0.65),
      sp: _rnd(0.25, 0.55),
      sz: _rnd(5, 9),
      ph: _pi2(),
      fp: _rnd(0.12, 0.20),
    })),
    // Sun glints / moon ripples on the water surface.
    sparkles: Array.from({ length: isDark ? 26 : 32 }, () => ({
      x: _rnd(0, w),
      y: _rnd(horizon, shoreline - 6),
      ph: _pi2(),
      sp: _rnd(0.04, 0.12),
      sz: _rnd(0.8, 2.4),
    })),

    // Sand details: small shells scattered across the sand area.
    shells: Array.from({ length: 28 }, () => {
      const types = ['scallop', 'cone', 'spiral', 'oval'];
      return {
        x: _rnd(4, w - 4),
        // Distribute through the visible sand band, biased toward the top
        // (closer to the waterline) so shells aren't all in one row.
        y: _rnd(shoreline + 6, h - 8),
        size: _rnd(2.2, 4.2),
        rot: _rnd(-0.6, 0.6),
        type: types[Math.floor(Math.random() * types.length)],
        col: ['#f7e6cc', '#f0c9a5', '#e8b791', '#d99277', '#f4d6c2', '#fff1de'][Math.floor(Math.random() * 6)],
      };
    }),

    // A single crab that appears once in a while and walks across the sand.
    crab: {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      legPhase: 0,
      // Wait a stretch before the first crab.
      nextSpawn: Math.floor(30 * _rnd(20, 60)),
    },

    // Night sky inhabitants — denser star field and rare shooting stars.
    stars: isDark ? Array.from({ length: 140 }, () => ({
      x: _rnd(0, w), y: _rnd(0, horizon),
      r: _rnd(0.4, 1.4),
      op: _rnd(0.4, 0.95),
      tp: _pi2(),
    })) : [],
    shooter: isDark
      ? { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, nextSpawn: _rnd(120, 320) }
      : null,
    // A plane crosses the sky every minute or two at night.
    plane: isDark
      ? { active: false, x: 0, y: 0, vx: 0, nextSpawn: Math.floor(30 * _rnd(40, 150)) }
      : null,
    // A sailboat drifts past on the horizon during the day.
    sailboat: !isDark
      ? { active: false, x: 0, dir: 1, vx: 0, scale: 1, nextSpawn: Math.floor(30 * _rnd(20, 90)) }
      : null,
  };
}

function _initMadison(w, h, isDark) {
  // Skyline geometry. The Capitol sits dead center as the tallest building
  // with a dome on top; the rest are shorter and arranged on either side,
  // sorted by distance from center so the closest-to-center buildings draw
  // last (in front of further ones). A few buildings overlap slightly.
  const cx = w * 0.5;
  // Wide lake takes the bottom ~22% of the frame (reference photo proportion).
  const groundY = h * 0.78;

  // Capitol — central tower with hemisphere dome + cupola + spire. Reference
  // photo: the tower itself is short and stocky (much of the iconic height
  // comes from the dome stack), with two side wings.
  const capitol = {
    x: cx,
    width: Math.max(78, w * 0.14),
    // Tower (under-the-dome part) is now noticeably shorter. The dome stack
    // sits above this and still reaches well above the surrounding skyline.
    height: h * 0.20,
    domeRadius: Math.max(32, w * 0.072),
    isCapitol: true,
  };

  // Surrounding skyline. ~20 rectangular buildings, never as tall as the
  // Capitol dome. Closer to centre = slightly taller; flanks fall off.
  const buildings = [];
  const slotCount = 20;
  for (let i = 0; i < slotCount; i++) {
    const side = i < slotCount / 2 ? -1 : 1; // left or right of capitol
    const idxInSide = side === -1 ? i : (i - slotCount / 2);
    // Distance from capitol in slot units (1, 2, 3, ...).
    const slot = idxInSide + 1;
    const distFrac = slot / (slotCount / 2);
    const distFromCap = capitol.width * 0.7 + slot * (w * 0.048);
    const x = cx + side * distFromCap + _rnd(-6, 6);
    // Match the reference: neighbours roughly 55%-85% of capitol height,
    // outer ones taper down to ~30%. Slightly random for visual variety.
    const tallness = (1 - distFrac * 0.55) * (0.75 + Math.random() * 0.15);
    const height = capitol.height * tallness;
    const width = _rnd(34, 64);
    // Window grid — small and dense. Each cell tracks lit + next toggle
    // time. Lit fraction is intentionally low so the skyline reads as
    // "city at night", not "every light on".
    const cols = Math.max(3, Math.floor(width / 7));
    const rows = Math.max(5, Math.floor(height / 10));
    const windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          on: Math.random() < 0.22,
          // Toggles are rare — most windows stay put for a minute or more.
          flipAt: Math.floor(30 * _rnd(45, 240)),
        });
      }
    }
    buildings.push({ x, width, height, cols, rows, windows, isCapitol: false });
  }
  // Capitol's own windows.
  {
    const cols = Math.max(4, Math.floor(capitol.width / 8));
    const rows = Math.max(7, Math.floor(capitol.height / 11));
    const windows = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          on: Math.random() < 0.28,
          flipAt: Math.floor(30 * _rnd(60, 300)),
        });
      }
    }
    capitol.cols = cols; capitol.rows = rows; capitol.windows = windows;
  }
  // Draw furthest first so closer buildings (incl. capitol) sit in front.
  buildings.sort((a, b) => Math.abs(b.x - cx) - Math.abs(a.x - cx));

  return {
    cx, groundY,
    capitol,
    buildings,
    // Night sky: dense stars and a shooting-star slot.
    stars: isDark ? Array.from({ length: 130 }, () => ({
      x: _rnd(0, w), y: _rnd(0, h * 0.55),
      r: _rnd(0.4, 1.4),
      op: _rnd(0.4, 0.95),
      tp: _pi2(),
    })) : [],
    shooter: isDark ? { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, nextSpawn: _rnd(120, 320) } : null,
    // Day: rain pool (always allocated; used only when intensity > 0).
    rain: (() => {
      // 20% chance the Madison scene opens mid-storm; same distributions as
      // the runtime controller below for nextFlip.
      const startRaining = !isDark && Math.random() < 0.20;
      return {
        drops: Array.from({ length: 240 }, () => ({
          x: _rnd(-40, w + 40),
          y: _rnd(-h, h),
          len: _rnd(8, 18),
          vy: _rnd(8, 14),
          vx: _rnd(-2.4, -1.2),
          alp: _rnd(0.35, 0.7),
        })),
        intensity: startRaining ? 1 : 0,
        target: startRaining ? 1 : 0,
        nextFlip: startRaining
          ? Math.floor(30 * _rnd(240, 600))   // 4–10 min wet (mid-storm)
          : Math.floor(30 * _rnd(360, 840)),  // 6–14 min dry
        stormPower: 0,
        stormTarget: startRaining ? (Math.random() < 0.4 ? _rnd(0.65, 1.0) : _rnd(0.15, 0.4)) : 0,
        flash: 0,
        flashCooldown: 0,
        bolt: null,
      };
    })(),
    // Fluffy day clouds — drift in whatever direction the wind is blowing.
    clouds: Array.from({ length: 4 }, () => ({
      x: _rnd(-w * 0.3, w * 1.2),
      y: _rnd(h * 0.05, h * 0.30),
      scale: _rnd(0.85, 1.6),
      // Each cloud picks up wind but also has a small base drift so a calm
      // day still gets some movement.
      baseDrift: _rnd(0.05, 0.18),
      alpha: _rnd(0.55, 0.85),
    })),
    // Rare plane crossing the night sky with a blinking red light.
    plane: {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      // Wait a good while before the first one.
      nextSpawn: Math.floor(30 * _rnd(45, 180)),
    },
    // Spotlights at the base of the Capitol that sweep back and forth.
    // Each one has an origin point and an angular range it oscillates
    // through, with a slightly different speed so they don't lock-step.
    spotlights: [
      // Left-front, sweeps across the lower dome
      { ox: cx - capitol.width * 1.4, oy: groundY * 0.99,
        a0: -Math.PI * 0.40, a1: -Math.PI * 0.58, sp: 0.0045, ph: _pi2() },
      // Right-front, sweeps the upper drum
      { ox: cx + capitol.width * 1.3, oy: groundY * 0.99,
        a0: -Math.PI * 0.40, a1: -Math.PI * 0.58, sp: 0.0036, ph: _pi2() },
      // Centre-low, sweeps wide across the entire dome
      { ox: cx,                       oy: groundY * 1.01,
        a0: -Math.PI * 0.38, a1: -Math.PI * 0.62, sp: 0.0028, ph: _pi2() },
    ],
    // Monona Terrace — the long, white arched structure right at the
    // lakeshore in front of the Capitol. Spans most of the width so the
    // arches stretch across the foreground.
    terrace: {
      cx,
      width: Math.max(280, w * 0.62),
      height: Math.max(36, h * 0.08),
      numArches: 11,
    },
    // Tiny cars driving at the lakeshore. Sparse traffic — a handful of
    // cars on a single horizontal line right at the bottom of the city
    // (next to the water). Most of them sit off-screen waiting for a
    // long delay before they enter, so the road reads as mostly empty
    // with the occasional headlight passing through.
    cars: Array.from({ length: 5 }, () => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      return {
        x: dir === 1 ? -40 : w + 40, // start off-screen
        dir,
        sp: _rnd(0.4, 0.85),
        col: ['#1f2733', '#3b3b3b', '#6b5e3a', '#5a2c2c', '#2c4a5a'][Math.floor(Math.random() * 5)],
        len: _rnd(5, 8),
        // Stagger entrance so they don't all arrive at once.
        // (frames at 30 fps; 30-300 s gap before this car appears)
        delay: Math.floor(30 * _rnd(20, 240)),
      };
    }),
  };
}

// Sum-of-sines pseudo-noise — deterministic given (x, seed) so a ridge
// silhouette is stable across frames. Returns a 0..1 height factor.
function _ridgeHeight(x, seed) {
  return (
    0.50 * (0.5 + 0.5 * Math.sin(x * 0.0042 + seed)) +
    0.30 * (0.5 + 0.5 * Math.sin(x * 0.0119 + seed * 2.3)) +
    0.20 * (0.5 + 0.5 * Math.sin(x * 0.0271 + seed * 4.7))
  );
}

// Triangle-wave variant: linear up-then-down sawtooths instead of smooth
// sines, summed at three octaves. Produces sharp, angular peaks (no
// rounded domes) suitable for jagged alpine ridges.
function _ridgeHeightAngular(x, seed) {
  const tri = (p) => { const f = p - Math.floor(p); return 1 - Math.abs(2 * f - 1); };
  return (
    0.62 * tri(x * 0.0024 + seed * 0.11) +
    0.26 * tri(x * 0.0078 + seed * 0.31) +
    0.12 * tri(x * 0.0203 + seed * 0.71)
  );
}

// Draw a continuous mountain ridge across the full width. The polygon
// runs along the top profile, then closes down to a fill baseline so
// everything below the ridge is solid (mountains sit in front of sky and
// Storm effects shared by every scene with rain. Applies a darkness overlay
// proportional to stormPower (how heavy this storm is), then any active
// lightning bolt and the screen flash.
function _drawStormFX(ctx, rain, w, h) {
  if (!rain) return;
  if (rain.intensity > 0.01 && rain.stormPower > 0.01) {
    ctx.fillStyle = `rgba(0,0,0,${rain.stormPower * rain.intensity * 0.5})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (rain.bolt && rain.bolt.points && rain.bolt.points.length > 1) {
    const a = Math.min(1, rain.bolt.life / 6);
    ctx.save();
    ctx.strokeStyle = `rgba(245,255,255,${0.9 * a})`;
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(220,235,255,0.9)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(rain.bolt.points[0].x, rain.bolt.points[0].y);
    for (let i = 1; i < rain.bolt.points.length; i++) {
      ctx.lineTo(rain.bolt.points[i].x, rain.bolt.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
  if (rain.flash > 0.001) {
    ctx.fillStyle = `rgba(240,250,255,${rain.flash * 0.5})`;
    ctx.fillRect(0, 0, w, h);
  }
}

// Storm controller — call once per frame from any rain-bearing scene.
// Wet stretches now 4–10 min and dry 6–14 min. Eases stormPower toward
// a random target on each downpour, and rolls for lightning while raining.
function _stepStorm(rain, w, h) {
  rain.nextFlip -= 1;
  if (rain.nextFlip <= 0) {
    rain.target = rain.target === 0 ? 1 : 0;
    if (rain.target === 1) {
      // 40% of storms are heavy and dark; the rest stay mild.
      rain.stormTarget = Math.random() < 0.4 ? _rnd(0.65, 1.0) : _rnd(0.15, 0.4);
      rain.nextFlip = Math.floor(30 * _rnd(240, 600));   // 4–10 min wet
    } else {
      rain.stormTarget = 0;
      rain.nextFlip = Math.floor(30 * _rnd(360, 840));   // 6–14 min dry
    }
  }
  if (rain.intensity !== rain.target) {
    const step = rain.target > rain.intensity ? 1 / 90 : -1 / 120;
    rain.intensity = Math.max(0, Math.min(1, rain.intensity + step));
  }
  if (rain.stormPower == null) rain.stormPower = 0;
  if (rain.stormTarget == null) rain.stormTarget = 0;
  if (rain.stormPower !== rain.stormTarget) {
    const stepSP = rain.stormTarget > rain.stormPower ? 1 / 150 : -1 / 240; // ~5s in / ~8s out
    rain.stormPower = Math.max(0, Math.min(1, rain.stormPower + stepSP));
  }
  if (rain.flash > 0) rain.flash = Math.max(0, rain.flash - 0.08);
  if (rain.bolt) { rain.bolt.life -= 1; if (rain.bolt.life <= 0) rain.bolt = null; }
  if (rain.flashCooldown > 0) rain.flashCooldown -= 1;
  // Lightning only when raining hard and the storm is dark enough.
  if (rain.intensity > 0.55 && rain.stormPower > 0.35 && rain.flashCooldown <= 0
      && Math.random() < 1 / 180) {
    rain.flash = 1;
    rain.flashCooldown = Math.floor(30 * _rnd(5, 18)); // 5–18 s before the next
    if (Math.random() < 0.6) {
      const x0 = _rnd(w * 0.12, w * 0.88);
      const pts = [{ x: x0, y: 0 }];
      const segs = 8 + Math.floor(Math.random() * 4);
      const groundY = h * 0.7;
      let xCur = x0;
      for (let i = 1; i <= segs; i++) {
        xCur += (Math.random() - 0.5) * 36;
        pts.push({ x: xCur, y: (groundY * i) / segs });
      }
      rain.bolt = { points: pts, life: 6 };
    }
  }
}

// behind foreground props). `opts.style: 'angular'` flips the noise from
// rounded sines to triangle waves for sharp alpine peaks.
function _drawRidge(ctx, w, baseY, maxH, seed, fillStyle, opts = {}) {
  // Smaller step + angular noise = crisper peak corners.
  const step = opts.step || (opts.style === 'angular' ? 3 : 6);
  const py = opts.py || 0;
  const heightFn = opts.style === 'angular' ? _ridgeHeightAngular : _ridgeHeight;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(-4, baseY + py + 40);
  for (let x = -4; x <= w + 4; x += step) {
    const y = baseY + py - maxH * heightFn(x, seed);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w + 4, baseY + py + 40);
  ctx.closePath();
  ctx.fill();
  // Optional snow cap: stroke the ridge in white wherever it's above a
  // height threshold. Cheap, sells the "snowy peaks" silhouette.
  if (opts.snowAlpha && opts.snowAlpha > 0) {
    ctx.strokeStyle = `rgba(255,255,255,${opts.snowAlpha})`;
    ctx.lineWidth = opts.snowWidth || 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    let drawing = false;
    for (let x = -4; x <= w + 4; x += step) {
      const f = heightFn(x, seed);
      const y = baseY + py - maxH * f;
      if (f > (opts.snowThreshold || 0.55)) {
        if (!drawing) { ctx.moveTo(x, y); drawing = true; }
        else ctx.lineTo(x, y);
      } else if (drawing) {
        ctx.stroke();
        ctx.beginPath();
        drawing = false;
      }
    }
    if (drawing) ctx.stroke();
  }
}

// ── per-theme draw calls ──────────────────────────────────────────────────────
function _drawCold(ctx, isDark, state, t, py, w, h) {
  // ── sky gradient ──
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0,    '#010818'); sky.addColorStop(0.18, '#020d1e');
    sky.addColorStop(0.38, '#031430'); sky.addColorStop(0.58, '#04182e');
    sky.addColorStop(0.78, '#030c1e'); sky.addColorStop(1,    '#010610');
  } else {
    sky.addColorStop(0,    '#4890c8'); sky.addColorStop(0.11, '#72b8e8');
    sky.addColorStop(0.25, '#a4d4f5'); sky.addColorStop(0.42, '#ceeafc');
    sky.addColorStop(0.58, '#eaf5fe'); sky.addColorStop(0.70, '#f8fcff');
    sky.addColorStop(0.82, '#ffffff'); sky.addColorStop(1,    '#edf4fc');
  }
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  if (isDark) {
    // ── stars ──
    for (const s of state.stars) {
      const tw = 0.55 + 0.45 * Math.sin(t * 0.04 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.3, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.op * tw})`;
      ctx.fill();
    }
    // ── aurora bands ──
    const bands = [
      { r:0, g:255, b:110, yf:0.20, ht:52, sp:0.009 },
      { r:88, g:42, b:255, yf:0.30, ht:38, sp:0.007 },
      { r:0, g:228, b:198, yf:0.42, ht:30, sp:0.006 },
    ];
    for (const a of bands) {
      const phase = t * a.sp + a.yf * 8;
      const yBase = h * a.yf + py * 0.5;
      for (let pass = 0; pass < 2; pass++) {
        const ht = a.ht * (pass === 0 ? 1 : 1.7);
        const ag = ctx.createLinearGradient(0, yBase - ht, 0, yBase + ht);
        const alpTop = pass === 0 ? 0.58 : 0.18;
        ag.addColorStop(0,    `rgba(${a.r},${a.g},${a.b},0)`);
        ag.addColorStop(0.38, `rgba(${a.r},${a.g},${a.b},${alpTop})`);
        ag.addColorStop(0.62, `rgba(${a.r},${a.g},${a.b},${alpTop})`);
        ag.addColorStop(1,    `rgba(${a.r},${a.g},${a.b},0)`);
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.moveTo(-20, yBase + ht + 10);
        for (let x = -20; x <= w + 20; x += 4) {
          const y = yBase + Math.sin(x * 0.007 + phase) * a.ht * 0.62
                         + Math.sin(x * 0.019 + phase * 1.4) * a.ht * 0.22
                         + Math.sin(x * 0.003 + phase * 0.6) * a.ht * 0.35;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + 20, yBase + ht + 10);
        ctx.lineTo(-20, yBase + ht + 10);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else {
    // ── clouds ──
    const clouds = [
      { cx: w*0.15 + Math.sin(t*0.004)*14, cy: h*0.11 + py*0.4, r:44 },
      { cx: w*0.53 + Math.sin(t*0.003+1)*18, cy: h*0.07 + py*0.4, r:58 },
      { cx: w*0.83 + Math.sin(t*0.005+2)*11, cy: h*0.15 + py*0.4, r:36 },
    ];
    ctx.save(); ctx.globalAlpha = 0.48;
    for (const c of clouds) {
      for (const [ox, oy, rf] of [[0,0,1.5],[c.r*0.55,c.r*0.08,0.92],[-(c.r*0.48),c.r*0.12,0.82]]) {
        const cg = ctx.createRadialGradient(c.cx+ox,c.cy+oy,0,c.cx+ox,c.cy+oy,c.r*rf);
        cg.addColorStop(0,'rgba(255,255,255,0.95)');
        cg.addColorStop(0.45,'rgba(248,252,255,0.6)');
        cg.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(c.cx+ox,c.cy+oy,c.r*rf,0,Math.PI*2); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ── distant mountain range (between sky/clouds and the snow ground) ──
  if (state.mountains) {
    const py4 = py * 0.4;
    if (isDark) {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed,
        'rgba(18,28,52,0.85)', { py: py4, style: 'angular', snowAlpha: 0.32, snowThreshold: 0.55, snowWidth: 1.6 });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed,
        'rgba(8,16,32,0.95)', { py: py4 * 1.4, style: 'angular', snowAlpha: 0.45, snowThreshold: 0.5, snowWidth: 2 });
    } else {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed,
        'rgba(120,150,190,0.62)', { py: py4, style: 'angular', snowAlpha: 0.7, snowThreshold: 0.55, snowWidth: 2 });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed,
        'rgba(72,104,156,0.92)', { py: py4 * 1.4, style: 'angular', snowAlpha: 0.85, snowThreshold: 0.45, snowWidth: 2.4 });
    }
  }

  if (!isDark) {
    // ── snow ground blend (sits over the front mountain bases) ──
    const gnd = ctx.createLinearGradient(0, h*0.84, 0, h);
    gnd.addColorStop(0,'rgba(255,255,255,0)');
    gnd.addColorStop(0.22,'rgba(248,252,255,0.82)');
    gnd.addColorStop(1,'#ffffff');
    ctx.fillStyle = gnd; ctx.fillRect(0, 0, w, h);
  }

  // ── wind: smooth, random direction + strength, retargets every few seconds ──
  _stepWind(state, -3.2, 3.2, [20, 60]);

  // ── snowflakes ──
  for (const f of state.flakes) {
    f.y += f.vy;
    f.x += Math.sin(t * 0.013 + f.dp) * f.drift * 0.55 + state.wind.current;
    if (f.y > h + 8) { f.y = -8; f.x = Math.random() * w; }
    if (f.x < -8) f.x = w + 4; if (f.x > w + 8) f.x = -4;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${f.op})`;
    ctx.fill();
  }
}

function _drawWarm(ctx, isDark, state, t, py, w, h) {
  // ── sky ──
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0,'#1e0e04'); sky.addColorStop(0.18,'#280f04');
    sky.addColorStop(0.40,'#1e0a02'); sky.addColorStop(0.58,'#140800');
    sky.addColorStop(0.78,'#0a0500'); sky.addColorStop(1,'#060300');
  } else {
    sky.addColorStop(0,'#f0bc52'); sky.addColorStop(0.11,'#e88832');
    sky.addColorStop(0.28,'#d04a12'); sky.addColorStop(0.46,'#a02606');
    sky.addColorStop(0.64,'#681400'); sky.addColorStop(0.82,'#340900');
    sky.addColorStop(1,'#1a0500');
  }
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  // ── glow ──
  const glowX = isDark ? w*0.38 : w*0.67;
  const glowY = (isDark ? h*0.18 : h*0.05) + py*0.3;
  const glowR = isDark ? w*0.48 : w*0.46;
  const gcol  = isDark ? [208,78,12,0.32] : [255,218,85,0.58];
  const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
  glow.addColorStop(0, `rgba(${gcol[0]},${gcol[1]},${gcol[2]},${gcol[3]})`);
  glow.addColorStop(0.42, `rgba(${gcol[0]},${gcol[1]},${gcol[2]},${gcol[3]*0.3})`);
  glow.addColorStop(1,   `rgba(${gcol[0]},${gcol[1]},${gcol[2]},0)`);
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

  // ── autumn mountain range behind the trees ──
  if (state.mountains) {
    const py4 = py * 0.4;
    if (isDark) {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed,
        'rgba(46,18,8,0.78)', { py: py4, style: 'angular' });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed,
        'rgba(22,8,2,0.92)', { py: py4 * 1.4, style: 'angular' });
    } else {
      _drawRidge(ctx, w, h * state.mountains.back.baseRel, state.mountains.back.maxH, state.mountains.back.seed,
        'rgba(132,62,32,0.62)', { py: py4, style: 'angular' });
      _drawRidge(ctx, w, h * state.mountains.front.baseRel, state.mountains.front.maxH, state.mountains.front.seed,
        'rgba(84,32,12,0.92)', { py: py4 * 1.4, style: 'angular' });
    }
  }

  // ── fall trees ──
  const groundY = h * 0.93;
  for (const tr of state.trees) {
    const sway = Math.sin(t * 0.012 + tr.sway) * 1.6;
    const baseX = tr.x + sway * 0.4;
    const baseY = groundY + py * 0.45;
    const topY = baseY - tr.th;
    // trunk
    ctx.fillStyle = isDark ? '#180a02' : '#3a1d08';
    ctx.beginPath();
    ctx.moveTo(baseX - 3 * tr.scale, baseY);
    ctx.lineTo(baseX - 2.2 * tr.scale, topY + tr.cr * 0.4);
    ctx.lineTo(baseX + 2.2 * tr.scale, topY + tr.cr * 0.4);
    ctx.lineTo(baseX + 3 * tr.scale, baseY);
    ctx.closePath();
    ctx.fill();
    // crown — overlapping blobs in fall colours
    const crownColors = isDark
      ? ['rgba(82,30,8,0.78)','rgba(64,20,4,0.72)','rgba(54,16,2,0.68)']
      : ['rgba(232,114,12,0.88)','rgba(212,56,10,0.82)','rgba(240,168,24,0.78)'];
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 + tr.sway;
      const ox = Math.cos(ang) * tr.cr * 0.45;
      const oy = Math.sin(ang) * tr.cr * 0.35 - tr.cr * 0.1;
      ctx.fillStyle = crownColors[i % crownColors.length];
      ctx.beginPath();
      ctx.arc(baseX + ox + sway * 0.6, topY + oy, tr.cr * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
    // central crown blob
    ctx.fillStyle = crownColors[0];
    ctx.beginPath();
    ctx.arc(baseX + sway * 0.6, topY, tr.cr * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── wind ──
  _stepWind(state, -4, 4, [20, 55]);

  // ── falling leaves ──
  for (const lf of state.leaves) {
    lf.y += lf.vy;
    lf.x += Math.sin(t * 0.011 + lf.dp) * lf.drift * 0.5 + state.wind.current;
    lf.rot += lf.rs + state.wind.current * 0.004;
    if (lf.y > h + 20) { lf.y = -20; lf.x = Math.random() * w; }
    if (lf.x < -20) lf.x = w + 10; if (lf.x > w + 20) lf.x = -10;
    ctx.save();
    ctx.translate(lf.x, lf.y);
    ctx.rotate(lf.rot);
    ctx.globalAlpha = 0.72 + Math.sin(t*0.02 + lf.dp) * 0.16;
    ctx.fillStyle = lf.col;
    if (lf.type === 0) {
      // oval leaf
      ctx.beginPath();
      ctx.ellipse(0, 0, lf.sz * 0.48, lf.sz, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = lf.col; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(0, -lf.sz*0.85); ctx.lineTo(0, lf.sz*0.85); ctx.stroke();
    } else {
      // maple-ish star leaf
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        ctx.lineTo(Math.cos(a1)*lf.sz, Math.sin(a1)*lf.sz);
        ctx.lineTo(Math.cos(a2)*lf.sz*0.42, Math.sin(a2)*lf.sz*0.42);
      }
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
}

// One Sugarloaf-shaped granite dome: smooth elliptical-ish silhouette
// (steeper near the peak, flares wider toward the base) so it reads as the
// rounded gneiss outcrops that line Guanabara Bay. Filled with a vertical
// gradient that adds a bit of dimensional shading.
function _drawDome(ctx, dome, isDark, py) {
  const { cx, baseY, halfW, peakY } = dome;
  const baseShift = py * 0.45;
  const peakShift = py * 0.3;
  const yBase = baseY + baseShift;
  const yPeak = peakY + peakShift;
  const height = yBase - yPeak;
  // Build the silhouette as a series of points sweeping from left base,
  // up over the peak, and down to right base. Profile uses cos so the
  // silhouette is dome-shaped (steeper near top, flaring at base).
  const segs = 28;
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;        // 0 .. 1 along the silhouette
    const ang = t * Math.PI;   // 0 (left base) .. π (right base)
    const sx = cx + Math.cos(Math.PI - ang) * halfW;
    // Profile factor: 1 at peak, 0 at base; raise to 0.65 so the top
    // is broader (Sugarloaf-y) rather than a sharp point.
    const prof = Math.pow(Math.sin(ang), 0.65);
    const sy = yBase - prof * height;
    pts.push([sx, sy]);
  }
  // Fill with a top-to-bottom gradient.
  const g = ctx.createLinearGradient(cx, yPeak, cx, yBase);
  if (isDark) {
    g.addColorStop(0, '#1c2530'); g.addColorStop(0.55, '#10161e'); g.addColorStop(1, '#070a0e');
  } else {
    g.addColorStop(0, '#7c8898'); g.addColorStop(0.45, '#525e6e'); g.addColorStop(1, '#2e3744');
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
  // Subtle ridge highlight along the right side to suggest sunlight.
  if (!isDark) {
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = Math.floor(segs / 2); i < pts.length - 1; i++) {
      if (i === Math.floor(segs / 2)) ctx.moveTo(pts[i][0], pts[i][1]);
      else ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.stroke();
  }
  return { yPeak, yBase };
}

// Christ the Redeemer silhouette: pedestal, body, outstretched arms, head.
// Scaled relative to `s` (statue total height). Drawn in pale stone-white
// in day mode and a paler ghost shade at night so it still reads.
function _drawRedeemer(ctx, cx, peakY, s, isDark) {
  const w = s * 0.95;      // arm span
  const bodyW = s * 0.18;
  const bodyH = s * 0.62;
  const pedW = s * 0.34;
  const pedH = s * 0.14;
  const armH = s * 0.10;
  const headR = s * 0.075;
  const color = isDark ? 'rgba(232,228,218,0.78)' : '#efeae0';
  const shade = isDark ? 'rgba(180,176,168,0.55)' : 'rgba(168,158,140,0.7)';
  // Pedestal sits at the peak, statue stacks upward from there.
  const pedTop = peakY - pedH;
  const bodyTop = pedTop - bodyH;
  const armCenterY = bodyTop + bodyH * 0.18;
  const headCenterY = bodyTop - headR * 1.05;
  // Pedestal (stepped).
  ctx.fillStyle = shade;
  ctx.fillRect(cx - pedW / 2, peakY - pedH, pedW, pedH);
  ctx.fillStyle = color;
  ctx.fillRect(cx - pedW * 0.4, peakY - pedH - pedH * 0.35, pedW * 0.8, pedH * 0.35);
  // Body.
  ctx.fillStyle = color;
  ctx.fillRect(cx - bodyW / 2, bodyTop, bodyW, bodyH);
  // Arms (single horizontal bar — silhouette reads better than two limbs).
  ctx.fillRect(cx - w / 2, armCenterY - armH / 2, w, armH);
  // Head.
  ctx.beginPath();
  ctx.arc(cx, headCenterY, headR, 0, Math.PI * 2);
  ctx.fill();
  // Halo / soft glow in day mode to lift the statue off the sky.
  if (!isDark) {
    const gg = ctx.createRadialGradient(cx, headCenterY, 0, cx, headCenterY, s * 0.9);
    gg.addColorStop(0, 'rgba(255,255,255,0.18)');
    gg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(cx, headCenterY, s * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}

// One foliage clump (jungle blob or stylised palm) silhouetted against
// the dome / bay backdrop. Foliage sits just above the bay water line.
function _drawFoliage(ctx, f, isDark, py, t) {
  const sway = Math.sin(t * 0.012 + f.sway) * 1.4;
  const cx = f.x + sway * 0.35;
  const cy = f.y + py * 0.42;
  const s = f.scale;
  // Color: night = near-black with a hint of teal, day = mid-jungle green
  // shifted slightly per clump for variety.
  const tilt = f.hueTilt;
  const baseR = isDark ? 6  : Math.max(0, 28 + tilt * 0.4);
  const baseG = isDark ? 18 : Math.max(0, 88 + tilt * 0.8);
  const baseB = isDark ? 12 : Math.max(0, 36 + tilt * 0.3);
  const fill  = `rgba(${baseR | 0},${baseG | 0},${baseB | 0},0.92)`;
  const trunk = isDark ? 'rgba(8,16,8,0.9)' : 'rgba(36,22,8,0.9)';
  if (f.kind === 'palm') {
    // Curved trunk + a half-fan of fronds at the top.
    const trunkH = 26 * s;
    const topX = cx + sway * 0.6;
    const topY = cy - trunkH;
    ctx.strokeStyle = trunk;
    ctx.lineWidth = Math.max(1.2, 2 * s);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + sway * 0.6, cy - trunkH * 0.5, topX, topY);
    ctx.stroke();
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(1.4, 2.4 * s);
    const frondLen = 16 * s;
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI / 2 + (i - 2.5) * (Math.PI / 6) + sway * 0.05;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(
        topX + Math.cos(ang) * frondLen * 0.55,
        topY + Math.sin(ang) * frondLen * 0.35,
        topX + Math.cos(ang) * frondLen,
        topY + Math.sin(ang) * frondLen * 0.85
      );
      ctx.stroke();
    }
  } else {
    // Dense bush: a stack of overlapping circles.
    const blobs = [
      { dx: 0,           dy: -8 * s,  r: 12 * s },
      { dx: -8 * s,      dy: -4 * s,  r: 10 * s },
      { dx:  8 * s,      dy: -4 * s,  r: 10 * s },
      { dx: -3 * s,      dy: -14 * s, r: 8 * s  },
      { dx:  5 * s,      dy: -12 * s, r: 8 * s  },
    ];
    ctx.fillStyle = fill;
    for (const b of blobs) {
      ctx.beginPath();
      ctx.arc(cx + b.dx, cy + b.dy, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function _drawDuo(ctx, isDark, state, t, py, w, h) {
  // ── sky over Guanabara Bay ──
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0,    '#04102a'); sky.addColorStop(0.25, '#06183a');
    sky.addColorStop(0.55, '#0a2050'); sky.addColorStop(0.80, '#08184a');
    sky.addColorStop(1,    '#020a1c');
  } else {
    sky.addColorStop(0,    '#5fb8e8'); sky.addColorStop(0.18, '#7ec8f0');
    sky.addColorStop(0.45, '#c8e8f8'); sky.addColorStop(0.62, '#f4eed2');
    sky.addColorStop(0.78, '#88c2d4'); sky.addColorStop(1,    '#3b6c7e');
  }
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  // ── stars + shooting star (night only) ──
  if (isDark && state.stars) {
    for (const s of state.stars) {
      const tw = 0.55 + 0.45 * Math.sin(t * 0.045 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.18, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,242,255,${s.op * tw})`;
      ctx.fill();
    }
    const ss = state.shooter;
    if (ss) {
      if (!ss.active) {
        ss.nextSpawn -= 1;
        if (ss.nextSpawn <= 0) {
          ss.active = true;
          ss.x = _rnd(w * 0.08, w * 0.75);
          ss.y = _rnd(h * 0.04, h * 0.45);
          const ang = _rnd(Math.PI * 0.16, Math.PI * 0.34);
          const spd = _rnd(7, 11);
          ss.vx = Math.cos(ang) * spd;
          ss.vy = Math.sin(ang) * spd;
          ss.max = _rnd(28, 48);
          ss.life = 0;
        }
      } else {
        ss.x += ss.vx; ss.y += ss.vy; ss.life += 1;
        const fade = ss.life < 6 ? ss.life / 6 : Math.max(0, 1 - (ss.life - 6) / (ss.max - 6));
        const tg = ctx.createLinearGradient(ss.x - ss.vx * 8, ss.y - ss.vy * 8, ss.x, ss.y);
        tg.addColorStop(0, 'rgba(255,255,255,0)');
        tg.addColorStop(1, `rgba(255,255,255,${0.95 * fade})`);
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${fade})`;
        ctx.fill();
        if (ss.life >= ss.max || ss.x > w + 80 || ss.y > h * 0.7) {
          ss.active = false;
          ss.nextSpawn = _rnd(180, 420);
        }
      }
    }
  }

  // ── sun / moon ──
  const sx = w * 0.78, sy = h * 0.18 + py * 0.25;
  if (isDark) {
    ctx.fillStyle = 'rgba(248,244,232,0.92)';
    ctx.beginPath(); ctx.arc(sx, sy, 22, 0, Math.PI * 2); ctx.fill();
    const mg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.18);
    mg.addColorStop(0, 'rgba(248,244,232,0.32)');
    mg.addColorStop(1, 'rgba(248,244,232,0)');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(sx, sy, w * 0.18, 0, Math.PI * 2); ctx.fill();
  } else {
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.30);
    sg.addColorStop(0,    'rgba(255,245,210,0.95)');
    sg.addColorStop(0.18, 'rgba(255,228,150,0.55)');
    sg.addColorStop(0.55, 'rgba(255,205,110,0.18)');
    sg.addColorStop(1,    'rgba(255,180,80,0)');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
  }

  // ── soft far hills behind the domes ──
  const fh = state.farHills;
  _drawRidge(ctx, w, h * fh.baseRel, fh.maxH, fh.seed,
    isDark ? 'rgba(12,22,42,0.85)' : 'rgba(96,134,164,0.72)',
    { py: py * 0.25 });

  // ── domes (Sugarloaf + Corcovado + side dome) ──
  // Draw back-to-front by peak height (shorter peaks behind), so the
  // tallest (Corcovado) sits visually in front when overlapping.
  const domesSorted = state.domes.slice().sort((a, b) => b.peakY - a.peakY);
  let corcoMeta = null;
  for (const d of domesSorted) {
    const meta = _drawDome(ctx, d, isDark, py);
    if (d.isCorcovado) corcoMeta = { d, ...meta };
  }

  // ── Christ the Redeemer on Corcovado ──
  if (corcoMeta) {
    // Statue height as a fraction of the dome height. ~0.22 keeps it
    // visible without dominating the silhouette.
    const statueH = (corcoMeta.yBase - corcoMeta.yPeak) * 0.22;
    _drawRedeemer(ctx, corcoMeta.d.cx, corcoMeta.yPeak, statueH, isDark);
  }

  // ── jungle foliage along the bay shore ──
  if (state.foliage) {
    // Sort by x so overlapping clumps draw left-to-right consistently.
    for (const f of state.foliage) {
      _drawFoliage(ctx, f, isDark, py, t);
    }
  }

  // ── water: Guanabara Bay ──
  const wt = state.waterTop + py * 0.55;
  const wg = ctx.createLinearGradient(0, wt, 0, h);
  if (isDark) {
    wg.addColorStop(0, '#0a1a2e'); wg.addColorStop(0.45, '#08182c'); wg.addColorStop(1, '#020a18');
  } else {
    wg.addColorStop(0, '#3a7896'); wg.addColorStop(0.45, '#2c5e7c'); wg.addColorStop(1, '#0e3650');
  }
  ctx.fillStyle = wg;
  ctx.fillRect(0, wt, w, h - wt);

  // Water shimmer — horizontal highlights that ripple slowly.
  ctx.lineWidth = 1.2;
  for (const s of state.shimmer) {
    const baseY = wt + (h - wt) * s.yRel;
    const ph = t * s.sp + s.ph;
    const startX = w * (0.5 + 0.5 * Math.sin(ph));
    const length = w * s.len;
    const alp = s.alp * (0.6 + 0.4 * Math.sin(ph * 1.6));
    ctx.strokeStyle = isDark ? `rgba(120,160,200,${alp * 0.5})` : `rgba(255,255,255,${alp})`;
    ctx.beginPath();
    ctx.moveTo(startX - length / 2, baseY);
    ctx.lineTo(startX + length / 2, baseY);
    ctx.stroke();
  }

  // ── birds gliding above the bay ──
  ctx.strokeStyle = isDark ? 'rgba(220,220,225,0.55)' : 'rgba(20,30,40,0.55)';
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  for (const b of state.birds) {
    b.x += b.sp;
    if (b.x > w + 30) { b.x = -30; b.y = _rnd(h * 0.15, h * 0.50); }
    const flap = Math.sin(t * b.fp + b.ph);
    const wingDip = flap * b.sz * 0.42;
    const by = b.y + py * 0.18;
    ctx.beginPath();
    ctx.moveTo(b.x - b.sz, by + wingDip * 0.3);
    ctx.quadraticCurveTo(b.x - b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x, by);
    ctx.quadraticCurveTo(b.x + b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x + b.sz, by + wingDip * 0.3);
    ctx.stroke();
  }

  if (!isDark) {
    // ── soft sun rays over the water ──
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const ray of state.rays) {
      const alp = ray.alp * (0.75 + 0.25 * Math.sin(t * ray.sp + ray.ph));
      const rg = ctx.createLinearGradient(ray.x, 0, ray.x + ray.wid * 0.28, h * 0.78);
      rg.addColorStop(0,    `rgba(255,250,220,${alp})`);
      rg.addColorStop(0.55, `rgba(255,232,170,${alp * 0.45})`);
      rg.addColorStop(1,    'rgba(255,210,140,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(ray.x - ray.wid * 0.28, 0);
      ctx.lineTo(ray.x + ray.wid * 0.28, 0);
      ctx.lineTo(ray.x + ray.wid * 1.55, h * 0.78);
      ctx.lineTo(ray.x - ray.wid * 0.75, h * 0.78);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // ── wind ──
  _stepWind(state, -2.4, 2.4, [25, 70]);

  // ── rain (random downpours with smooth fade in/out) ──
  // Storms last 4–10 min, dry stretches 6–14 min. 40% of storms turn dark with
  // lightning. _stepStorm handles intensity, stormPower, flash, and bolts.
  const rain = state.rain;
  _stepStorm(rain, w, h);

  if (rain.intensity > 0.01) {
    // Cloud darkening — pull the upper sky toward grey as it rains harder.
    const cloudAlp = rain.intensity * (isDark ? 0.35 : 0.5);
    const cg = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    cg.addColorStop(0,   `rgba(20,28,32,${cloudAlp})`);
    cg.addColorStop(0.6, `rgba(20,28,32,${cloudAlp * 0.55})`);
    cg.addColorStop(1,   'rgba(20,28,32,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h);

    // Drops. Only render a fraction proportional to intensity for a soft onset.
    const visible = Math.floor(rain.drops.length * rain.intensity);
    ctx.strokeStyle = isDark
      ? `rgba(170,200,235,${0.55 * rain.intensity})`
      : `rgba(210,228,245,${0.65 * rain.intensity})`;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    const windPush = state.wind.current * 1.8;
    for (let i = 0; i < visible; i++) {
      const d = rain.drops[i];
      d.x += d.vx + windPush; d.y += d.vy;
      if (d.y > h + 20) { d.y = -20; d.x = _rnd(-40, w + 40); }
      if (d.x < -40)    { d.x = w + 20; }
      if (d.x > w + 60) { d.x = -20; }
      ctx.globalAlpha = d.alp;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + (d.vx + windPush) * 1.4, d.y + d.vy * 1.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Storm darkening + lightning sit on top of the scene.
  _drawStormFX(ctx, rain, w, h);
}

function _drawTropical(ctx, isDark, state, t, py, w, h) {
  const horizon = state.horizon;
  // Average shoreline + slow oscillation so the waves wash up and pull
  // back down the beach over ~5-second cycles. The whole foam edge moves
  // together with the wash.
  const washCycle = Math.sin(t * 0.018); // slow primary swell, period ~5 s
  const washWobble = Math.sin(t * 0.05) * 0.35; // secondary chop
  const washOffset = (washCycle + washWobble) * 14; // ±~18 px on average
  const shoreline = state.shoreline + washOffset;

  // ── sky ──
  const sky = ctx.createLinearGradient(0, 0, 0, horizon + 4);
  if (isDark) {
    sky.addColorStop(0,    '#01060e');
    sky.addColorStop(0.30, '#020c1c');
    sky.addColorStop(0.65, '#040f2a');
    sky.addColorStop(1,    '#08152e');
  } else {
    // Sunset: deep purple-blue at top → pink → orange → yellow at horizon.
    sky.addColorStop(0,    '#1c2a5a');
    sky.addColorStop(0.20, '#3a3a78');
    sky.addColorStop(0.42, '#a8497c');
    sky.addColorStop(0.62, '#e87749');
    sky.addColorStop(0.85, '#f9b75a');
    sky.addColorStop(1,    '#ffd58a');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon + 4);

  // ── sun (day) — sitting low on the horizon, large + warm ──
  if (!isDark) {
    const sx = w * 0.5;
    const sy = horizon - 2; // sun centre is exactly at horizon (half-set)
    const sunR = Math.max(36, w * 0.075);
    // Outer haze
    const haze = ctx.createRadialGradient(sx, sy, sunR * 0.4, sx, sy, sunR * 4.5);
    haze.addColorStop(0,   'rgba(255,200,120,0.45)');
    haze.addColorStop(0.4, 'rgba(255,170,80,0.18)');
    haze.addColorStop(1,   'rgba(255,150,60,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, w, horizon + sunR);
    // Sun disc (clipped to sky so it looks like it's sitting on the water)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, horizon);
    ctx.clip();
    const disc = ctx.createRadialGradient(sx, sy, 0, sx, sy, sunR);
    disc.addColorStop(0,    'rgba(255,238,180,1)');
    disc.addColorStop(0.55, 'rgba(255,200,110,0.95)');
    disc.addColorStop(1,    'rgba(255,150,80,0.85)');
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(sx, sy, sunR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Soft halo above the horizon line
    const halo = ctx.createRadialGradient(sx, sy, sunR * 0.6, sx, sy, sunR * 2.6);
    halo.addColorStop(0,   'rgba(255,210,130,0.0)');
    halo.addColorStop(0.4, 'rgba(255,200,120,0.20)');
    halo.addColorStop(1,   'rgba(255,170,80,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, horizon + 4);
  }

  // ── stars + shooting stars + plane (night) ──
  if (isDark) {
    for (const s of state.stars) {
      const tw = 0.55 + 0.45 * Math.sin(t * 0.045 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.18, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,242,255,${s.op * tw})`;
      ctx.fill();
    }
    // Moon — sits high so it doesn't conflict with the horizon.
    const mx = w * 0.74, my = h * 0.16 + py * 0.25;
    const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 52);
    mg.addColorStop(0,    'rgba(220,234,255,0.88)');
    mg.addColorStop(0.20, 'rgba(190,212,250,0.38)');
    mg.addColorStop(0.6,  'rgba(150,180,230,0.08)');
    mg.addColorStop(1,    'rgba(120,150,210,0)');
    ctx.fillStyle = mg; ctx.fillRect(0, 0, w, horizon + 10);

    // Shooting star
    const ss = state.shooter;
    if (ss) {
      if (!ss.active) {
        ss.nextSpawn -= 1;
        if (ss.nextSpawn <= 0) {
          ss.active = true;
          ss.x = _rnd(w * 0.1, w * 0.7);
          ss.y = _rnd(h * 0.04, horizon * 0.6);
          const ang = _rnd(Math.PI * 0.18, Math.PI * 0.32);
          const spd = _rnd(7, 11);
          ss.vx = Math.cos(ang) * spd;
          ss.vy = Math.sin(ang) * spd;
          ss.max = _rnd(28, 48);
          ss.life = 0;
        }
      } else {
        ss.x += ss.vx; ss.y += ss.vy; ss.life += 1;
        const fade = ss.life < 6 ? ss.life / 6 : Math.max(0, 1 - (ss.life - 6) / (ss.max - 6));
        const tg = ctx.createLinearGradient(ss.x - ss.vx * 8, ss.y - ss.vy * 8, ss.x, ss.y);
        tg.addColorStop(0, 'rgba(255,255,255,0)');
        tg.addColorStop(1, `rgba(255,255,255,${0.95 * fade})`);
        ctx.strokeStyle = tg;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${fade})`; ctx.fill();
        if (ss.life >= ss.max || ss.x > w + 80 || ss.y > horizon) {
          ss.active = false;
          ss.nextSpawn = _rnd(180, 420);
        }
      }
    }

    // Plane crossing the night sky
    const plane = state.plane;
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
          const blinkOn = Math.floor(t / 18) % 2 === 0;
          if (blinkOn) {
            const halo = ctx.createRadialGradient(plane.x + 5, plane.y, 0, plane.x + 5, plane.y, 9);
            halo.addColorStop(0,    'rgba(255,40,32,0.65)');
            halo.addColorStop(0.55, 'rgba(255,40,32,0.18)');
            halo.addColorStop(1,    'rgba(255,40,32,0)');
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
  }

  // ── day birds (silhouettes against the sunset sky) ──
  if (!isDark) {
    ctx.strokeStyle = 'rgba(20,18,30,0.62)';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (const b of state.birds) {
      b.x += b.sp;
      if (b.x > w + 30) { b.x = -30; b.y = _rnd(h * 0.10, horizon * 0.65); }
      const flap = Math.sin(t * b.fp + b.ph);
      const wingDip = flap * b.sz * 0.42;
      const by = b.y + py * 0.18;
      ctx.beginPath();
      ctx.moveTo(b.x - b.sz, by + wingDip * 0.3);
      ctx.quadraticCurveTo(b.x - b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x, by);
      ctx.quadraticCurveTo(b.x + b.sz * 0.5, by - b.sz * 0.55 - wingDip, b.x + b.sz, by + wingDip * 0.3);
      ctx.stroke();
    }
  }

  // ── water (waves bounded between horizon and shoreline) ──
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, horizon, w, shoreline - horizon);
  ctx.clip();
  // Base water fill
  const waterFill = ctx.createLinearGradient(0, horizon, 0, shoreline);
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
  // Wave bands
  for (const wv of state.waves) {
    wv.ph += wv.sp;
    const baseY = wv.y0 + py * 0.15;
    ctx.beginPath();
    ctx.moveTo(-10, shoreline + 10);
    ctx.lineTo(-10, baseY);
    for (let x = -10; x <= w + 10; x += 5) {
      const y = baseY
        + Math.sin(x * wv.freq + wv.ph) * wv.amp
        + Math.sin(x * wv.freq * 2.3 + wv.ph * 0.85) * wv.amp * 0.38;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w + 10, shoreline + 10);
    ctx.closePath();
    ctx.fillStyle = wv.col;
    ctx.fill();
  }
  // Water sparkles
  for (const sp of state.sparkles) {
    sp.ph += sp.sp;
    const alp = Math.max(0, Math.sin(sp.ph)) ** 2 * 0.88;
    if (alp < 0.02) continue;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y + py * 0.12, sp.sz * alp, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `rgba(175,215,255,${alp * 0.72})`
      : `rgba(255,236,170,${alp * 0.85})`;
    ctx.fill();
  }
  // Sun-pillar reflection (day) — column of warm light from the sun to
  // the shoreline.
  if (!isDark) {
    const sx = w * 0.5;
    const pillar = ctx.createLinearGradient(sx, horizon, sx, shoreline);
    pillar.addColorStop(0,   'rgba(255,220,150,0.55)');
    pillar.addColorStop(0.6, 'rgba(255,200,120,0.18)');
    pillar.addColorStop(1,   'rgba(255,180,80,0)');
    ctx.fillStyle = pillar;
    ctx.fillRect(sx - 40, horizon, 80, shoreline - horizon);
  }
  ctx.restore();

  // ── sailboat drifting across the horizon (day only) ──
  if (!isDark && state.sailboat) {
    const sb = state.sailboat;
    if (!sb.active) {
      sb.nextSpawn -= 1;
      if (sb.nextSpawn <= 0) {
        sb.active = true;
        sb.dir = Math.random() < 0.5 ? 1 : -1;
        sb.x = sb.dir === 1 ? -25 : w + 25;
        // Very slow — distant boats look like they're barely moving.
        sb.vx = sb.dir * _rnd(0.10, 0.20);
        sb.scale = _rnd(0.85, 1.20);
      }
    } else {
      sb.x += sb.vx;
      if ((sb.dir === 1 && sb.x > w + 25) || (sb.dir === -1 && sb.x < -25)) {
        sb.active = false;
        // Long idle between sightings (30 s to 3 min).
        sb.nextSpawn = Math.floor(30 * _rnd(30, 180));
      } else {
        const s = sb.scale;
        const bx = sb.x;
        // Hull sits just below the horizon line.
        const by = horizon + 2;
        const lean = -sb.dir;        // sail leans opposite to direction
        const mastH = 14 * s;
        // Hull (slim dark sliver)
        ctx.fillStyle = 'rgba(36,26,18,0.85)';
        ctx.fillRect(bx - 6 * s, by, 12 * s, 1.8 * s);
        // Mast
        ctx.fillStyle = 'rgba(60,46,30,0.85)';
        ctx.fillRect(bx - 0.4, by - mastH, 0.8, mastH);
        // Mainsail
        ctx.fillStyle = 'rgba(255,250,238,0.92)';
        ctx.beginPath();
        ctx.moveTo(bx, by - mastH);
        ctx.lineTo(bx + lean * 7 * s, by);
        ctx.lineTo(bx, by);
        ctx.closePath();
        ctx.fill();
        // Jib (smaller, in front of mast)
        ctx.fillStyle = 'rgba(245,238,220,0.85)';
        ctx.beginPath();
        ctx.moveTo(bx, by - mastH * 0.95);
        ctx.lineTo(bx - lean * 3.5 * s, by);
        ctx.lineTo(bx, by);
        ctx.closePath();
        ctx.fill();
        // Tiny wake under the hull
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fillRect(bx - 7 * s, by + 1.8 * s, 14 * s, 0.6);
      }
    }
  }

  // ── wet sand strip just below the wash edge (darker, glossy) ──
  // The wet band always extends down from the moving shoreline, so as
  // the wash recedes the sand it leaves behind reads as freshly wet.
  const wetBand = 16;
  const wetGrad = ctx.createLinearGradient(0, shoreline, 0, shoreline + wetBand);
  if (isDark) {
    wetGrad.addColorStop(0, '#1b1a16');
    wetGrad.addColorStop(1, '#2a261f');
  } else {
    wetGrad.addColorStop(0, '#8d7250');
    wetGrad.addColorStop(1, '#b89473');
  }
  ctx.fillStyle = wetGrad;
  ctx.fillRect(0, shoreline, w, wetBand);

  // ── foam edge — wavy white band right at the wash boundary ──
  // Two stacked passes (thicker translucent underlay, thinner bright
  // overlay) so the foam reads as soft and fluffy rather than a hard line.
  const foamColor = isDark ? 'rgba(220,230,245,' : 'rgba(255,255,255,';
  // Underlay
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, shoreline + 8);
  for (let x = 0; x <= w; x += 6) {
    const yWobble = Math.sin(x * 0.05 + t * 0.06) * 2.4
                  + Math.sin(x * 0.012 + t * 0.025) * 3.0;
    ctx.lineTo(x, shoreline - 1 + yWobble);
  }
  ctx.lineTo(w, shoreline + 8);
  ctx.closePath();
  ctx.fillStyle = `${foamColor}0.45)`;
  ctx.fill();
  ctx.restore();
  // Bright crest
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, shoreline + 2);
  for (let x = 0; x <= w; x += 4) {
    const yWobble = Math.sin(x * 0.07 + t * 0.08) * 1.4
                  + Math.sin(x * 0.018 + t * 0.04) * 1.8;
    ctx.lineTo(x, shoreline - 2 + yWobble);
  }
  ctx.lineTo(w, shoreline + 2);
  ctx.closePath();
  ctx.fillStyle = `${foamColor}0.85)`;
  ctx.fill();
  ctx.restore();
  // ── sand ──
  const sandGrad = ctx.createLinearGradient(0, shoreline + wetBand, 0, h);
  if (isDark) {
    sandGrad.addColorStop(0, '#2c2620');
    sandGrad.addColorStop(1, '#1a160f');
  } else {
    sandGrad.addColorStop(0, '#e7c9a0');
    sandGrad.addColorStop(1, '#cdab7e');
  }
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, shoreline + wetBand, w, h - shoreline - wetBand);
  // Sand grain dots — sparse texture
  ctx.fillStyle = isDark ? 'rgba(255,240,200,0.04)' : 'rgba(120,90,50,0.10)';
  for (let i = 0; i < 70; i++) {
    const gx = ((i * 73 + (t & 0)) * 17) % w;
    const gy = shoreline + wetBand + ((i * 137) % (h - shoreline - wetBand));
    ctx.fillRect(gx, gy, 1, 1);
  }

  // ── shells ──
  for (const sh of state.shells) {
    ctx.save();
    ctx.translate(sh.x, sh.y);
    ctx.rotate(sh.rot);
    ctx.fillStyle = sh.col;
    // Slight dim at night
    if (isDark) ctx.globalAlpha = 0.55;
    if (sh.type === 'scallop') {
      // fan shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, sh.size, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      // ridges
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(140,90,50,0.4)';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 4; i++) {
        const a = Math.PI + (Math.PI / 4) * i;
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
      // inner spiral hint
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(140,90,50,0.5)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(sh.size * 0.15, 0, sh.size * 0.45, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // oval pebble shell
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

  // ── crab — rare, walks sideways across the sand ──
  const crab = state.crab;
  if (!crab.active) {
    crab.nextSpawn -= 1;
    if (crab.nextSpawn <= 0) {
      crab.active = true;
      const dir = Math.random() < 0.5 ? 1 : -1;
      crab.vx = dir * _rnd(0.35, 0.6);
      crab.x = dir === 1 ? -16 : w + 16;
      crab.y = _rnd(shoreline + wetBand + 6, h - 12);
      crab.legPhase = 0;
    }
  } else {
    crab.x += crab.vx;
    crab.legPhase += 0.18;
    const cx = crab.x, cy = crab.y;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 8, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillStyle = isDark ? '#8a3c2c' : '#c64a32';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 6.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(cx - 2, cy - 4.5, 1.2, 1.2);
    ctx.fillRect(cx + 1, cy - 4.5, 1.2, 1.2);
    // Claws (extend slightly toward direction of travel)
    ctx.fillStyle = isDark ? '#8a3c2c' : '#c64a32';
    const clawDir = Math.sign(crab.vx) || 1;
    ctx.beginPath();
    ctx.ellipse(cx + 6 * clawDir, cy - 1.5, 2.8, 2.0, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - 5 * clawDir, cy - 1, 2.4, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Legs — six little lines that bob with legPhase
    ctx.strokeStyle = isDark ? '#742d22' : '#a13a26';
    ctx.lineWidth = 1.0;
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const off = (i - 1) * 2.4;
      const lift = Math.sin(crab.legPhase + i * 1.7) * 1.4;
      // left side
      ctx.beginPath();
      ctx.moveTo(cx - 3.5, cy + 0.6 + off * 0.2);
      ctx.lineTo(cx - 6.5, cy + 2.4 + off * 0.2 - lift);
      ctx.stroke();
      // right side
      ctx.beginPath();
      ctx.moveTo(cx + 3.5, cy + 0.6 + off * 0.2);
      ctx.lineTo(cx + 6.5, cy + 2.4 + off * 0.2 - lift);
      ctx.stroke();
    }
    // Despawn when off-screen.
    if ((crab.vx > 0 && cx > w + 16) || (crab.vx < 0 && cx < -16)) {
      crab.active = false;
      // Long idle before the next crab appears (45-150 s).
      crab.nextSpawn = Math.floor(30 * _rnd(45, 150));
    }
  }
}

function _drawMadison(ctx, isDark, state, t, py, w, h) {
  // ── sky ──
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (isDark) {
    sky.addColorStop(0,    '#02041a'); sky.addColorStop(0.20, '#040a26');
    sky.addColorStop(0.45, '#06112e'); sky.addColorStop(0.70, '#040a22');
    sky.addColorStop(0.90, '#020618'); sky.addColorStop(1,    '#01030d');
  } else {
    sky.addColorStop(0,    '#79c2ea'); sky.addColorStop(0.22, '#9ed3ee');
    sky.addColorStop(0.50, '#c6e5f4'); sky.addColorStop(0.75, '#e5f1f7');
    sky.addColorStop(1,    '#f4f8fa');
  }
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

  // ── wind: smooth, retargets every few seconds. drives rain tilt. ──
  _stepWind(state, -3.4, 3.4, [25, 65]);

  // Rain controller: 4–10 min wet, 6–14 min dry, with stormPower / lightning
  // via the shared _stepStorm helper. Night stays clear.
  const rain = state.rain;
  if (!isDark) {
    _stepStorm(rain, w, h);
  } else {
    rain.intensity = 0; // no rain at night
    rain.stormPower = 0;
    rain.flash = 0;
    rain.bolt = null;
  }

  // ── sun (day only, dimmed by rain intensity) ──
  if (!isDark) {
    const sx = w * 0.82, sy = h * 0.13 + py * 0.25;
    const sunAlp = 1 - rain.intensity * 0.85;
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.34);
    sg.addColorStop(0,    `rgba(255,244,180,${0.95 * sunAlp})`);
    sg.addColorStop(0.18, `rgba(255,228,130,${0.55 * sunAlp})`);
    sg.addColorStop(0.55, `rgba(255,200,90,${0.18 * sunAlp})`);
    sg.addColorStop(1,    'rgba(255,180,60,0)');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
  } else {
    // moon
    const mx = w * 0.18, my = h * 0.13 + py * 0.25;
    const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
    mg.addColorStop(0,    'rgba(220,234,255,0.90)');
    mg.addColorStop(0.20, 'rgba(190,212,250,0.42)');
    mg.addColorStop(0.55, 'rgba(150,180,230,0.10)');
    mg.addColorStop(1,    'rgba(120,150,210,0)');
    ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h);
  }

  // ── stars + shooting stars (night) ──
  if (isDark) {
    for (const s of state.stars) {
      const tw = 0.55 + 0.45 * Math.sin(t * 0.045 + s.tp);
      ctx.beginPath();
      ctx.arc(s.x, s.y + py * 0.18, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,242,255,${s.op * tw})`;
      ctx.fill();
    }
    const ss = state.shooter;
    if (ss) {
      if (!ss.active) {
        ss.nextSpawn -= 1;
        if (ss.nextSpawn <= 0) {
          ss.active = true;
          ss.x = _rnd(w * 0.1, w * 0.7);
          ss.y = _rnd(h * 0.04, h * 0.30);
          const ang = _rnd(Math.PI * 0.18, Math.PI * 0.32);
          const spd = _rnd(7, 11);
          ss.vx = Math.cos(ang) * spd; ss.vy = Math.sin(ang) * spd;
          ss.max = _rnd(28, 48); ss.life = 0;
        }
      } else {
        ss.x += ss.vx; ss.y += ss.vy; ss.life += 1;
        const fade = ss.life < 6 ? ss.life / 6 : Math.max(0, 1 - (ss.life - 6) / (ss.max - 6));
        const tg = ctx.createLinearGradient(ss.x - ss.vx * 8, ss.y - ss.vy * 8, ss.x, ss.y);
        tg.addColorStop(0, 'rgba(255,255,255,0)');
        tg.addColorStop(1, `rgba(255,255,255,${0.95 * fade})`);
        ctx.strokeStyle = tg; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ss.x - ss.vx * 8, ss.y - ss.vy * 8);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${fade})`; ctx.fill();
        if (ss.life >= ss.max || ss.x > w + 80 || ss.y > h * 0.55) {
          ss.active = false; ss.nextSpawn = _rnd(180, 420);
        }
      }
    }

    // ── rare night plane with blinking red light ──
    const plane = state.plane;
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
        // Long gap until the next plane — 1.5 to 6 minutes.
        plane.nextSpawn = Math.floor(30 * _rnd(90, 360));
      } else {
        // Fuselage as a tiny dim grey rectangle
        ctx.fillStyle = 'rgba(70,72,82,0.85)';
        ctx.fillRect(plane.x - 6, plane.y, 12, 1.6);
        // Wing
        ctx.fillRect(plane.x - 1, plane.y - 2, 2.4, 5);
        // Blinking red navigation light (~0.6 s cycle)
        const blinkOn = Math.floor(t / 18) % 2 === 0;
        if (blinkOn) {
          // Halo
          const halo = ctx.createRadialGradient(plane.x + 5, plane.y, 0, plane.x + 5, plane.y, 9);
          halo.addColorStop(0,   'rgba(255,40,32,0.65)');
          halo.addColorStop(0.55,'rgba(255,40,32,0.18)');
          halo.addColorStop(1,   'rgba(255,40,32,0)');
          ctx.fillStyle = halo;
          ctx.fillRect(plane.x - 4, plane.y - 9, 18, 18);
          // Core dot
          ctx.beginPath();
          ctx.arc(plane.x + 5, plane.y, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = '#ff2820';
          ctx.fill();
        }
      }
    }
  }

  // ── day clouds: drift with the wind ──
  if (!isDark) {
    for (const c of state.clouds) {
      // Clouds carry most of the wind plus a tiny base drift so a calm
      // moment still nudges them along.
      c.x += state.wind.current * 0.35 + c.baseDrift;
      if (c.x > w + 120) c.x = -180;
      if (c.x < -180)    c.x = w + 120;
      const baseR = 22 * c.scale;
      const cy = c.y + py * 0.3;
      // Storm fades clouds (everything turns one big grey sheet during rain).
      const alp = c.alpha * (1 - Math.min(1, rain.intensity * 1.4));
      if (alp < 0.03) continue;
      ctx.save();
      ctx.globalAlpha = alp;
      const lobes = [
        [0,            0,             1.55],
        [baseR * 0.62, baseR * 0.10,  1.10],
        [-baseR * 0.55,baseR * 0.16,  1.00],
        [baseR * 0.30, -baseR * 0.30, 0.85],
        [-baseR * 0.22,-baseR * 0.22, 0.78],
        [baseR * 1.00, baseR * 0.25,  0.70],
      ];
      for (const [ox, oy, rf] of lobes) {
        const cg = ctx.createRadialGradient(c.x + ox, cy + oy, 0, c.x + ox, cy + oy, baseR * rf);
        cg.addColorStop(0,   'rgba(255,255,255,0.95)');
        cg.addColorStop(0.5, 'rgba(248,252,255,0.55)');
        cg.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(c.x + ox, cy + oy, baseR * rf, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ── clouds during rain ──
  if (!isDark && rain.intensity > 0.01) {
    const cloudAlp = rain.intensity * 0.55;
    const cg = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    cg.addColorStop(0,   `rgba(30,38,46,${cloudAlp})`);
    cg.addColorStop(0.6, `rgba(30,38,46,${cloudAlp * 0.55})`);
    cg.addColorStop(1,   'rgba(30,38,46,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h);
  }

  // ── ground (city block ribbon) + large lake band ──
  // Lake takes the bottom 25 % of the frame and reflects the skyline.
  const groundY = state.groundY + py * 0.55;
  const lakeBottom = h;
  const lakeHeight = lakeBottom - groundY;
  // Lake base gradient
  const lakeGrad = ctx.createLinearGradient(0, groundY, 0, lakeBottom);
  if (isDark) {
    lakeGrad.addColorStop(0,   '#020414');
    lakeGrad.addColorStop(0.7, '#01030c');
    lakeGrad.addColorStop(1,   '#000206');
  } else {
    lakeGrad.addColorStop(0,   '#6a9bbf');
    lakeGrad.addColorStop(0.6, '#4f7c9c');
    lakeGrad.addColorStop(1,   '#3a5e7a');
  }
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, groundY, w, lakeHeight);
  // Thin water-line highlight where buildings meet the lake.
  ctx.fillStyle = isDark ? 'rgba(255,220,150,0.12)' : 'rgba(255,255,255,0.45)';
  ctx.fillRect(0, groundY, w, 1.5);

  // We collect every lit window (and the dome glow) so we can draw vertical
  // reflection streaks in the lake afterwards in one pass.
  const reflections = [];

  // ── helper to draw a single building ──
  const drawBuilding = (b) => {
    const baseY = groundY;
    const topY = baseY - b.height;
    const left = b.x - b.width / 2;
    // Body
    ctx.fillStyle = isDark
      ? (b.isCapitol ? '#1a1a26' : '#0c0d18')
      : (b.isCapitol ? '#e6ddc2' : '#576f7e');
    ctx.fillRect(left, topY, b.width, b.height);
    // Soft left-edge highlight for depth.
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)';
    ctx.fillRect(left, topY, 1.5, b.height);
    // Right-edge shadow.
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.18)';
    ctx.fillRect(left + b.width - 1.5, topY, 1.5, b.height);

    // Windows.
    const cols = b.cols, rows = b.rows;
    const padX = b.width * 0.10;
    const padY = b.height * 0.06;
    const cellW = (b.width - padX * 2) / cols;
    const cellH = (b.height - padY * 2) / rows;
    const wW = Math.min(cellW * 0.55, 10);
    const wH = Math.min(cellH * 0.55, 12);
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const win = b.windows[idx++];
        if (!win) continue;
        const wx = left + padX + c * cellW + (cellW - wW) / 2;
        const wy = topY + padY + r * cellH + (cellH - wH) / 2;
        if (isDark) {
          if (win.on) {
            const fl = 0.85 + 0.15 * Math.sin(t * 0.08 + (idx % 7));
            // Warm yellow with rare red/cool tints for variety.
            const tint = idx % 31 === 0 ? 'rgba(255,80,60,' : idx % 23 === 0 ? 'rgba(200,220,255,' : 'rgba(255,220,120,';
            ctx.fillStyle = `${tint}${fl})`;
            ctx.fillRect(wx, wy, wW, wH);
            // Only every ~6th lit window emits a reflection — keeps the
            // lake from looking like a barcode.
            if (idx % 6 === 0) {
              reflections.push({
                x: wx + wW / 2,
                color: tint,
                alpha: 0.30 * fl,
                width: wW * 2.4, // wide+soft = blurry
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

  // ── Capitol: drawn separately because its silhouette is much richer ──
  const drawCapitol = () => {
    const cap = state.capitol;
    const baseY = groundY;
    const mainTop = baseY - cap.height;
    const mainLeft = cap.x - cap.width / 2;

    // Two stepped side wings flanking the central tower.
    const wingW = cap.width * 0.55;
    const wingH = cap.height * 0.62;
    const wingTop = baseY - wingH;
    ctx.fillStyle = isDark ? '#15151f' : '#dccfb0';
    ctx.fillRect(mainLeft - wingW + 4, wingTop, wingW, wingH);
    ctx.fillRect(mainLeft + cap.width - 4, wingTop, wingW, wingH);
    // Highlight + shadow on wings
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)';
    ctx.fillRect(mainLeft - wingW + 4, wingTop, 1.2, wingH);
    ctx.fillRect(mainLeft + cap.width - 4, wingTop, 1.2, wingH);

    // Wing windows (sparser; use a simple grid).
    const drawWingWindows = (wLeft, wTop) => {
      const colsW = Math.max(3, Math.floor(wingW / 12));
      const rowsW = Math.max(2, Math.floor(wingH / 16));
      const padX = wingW * 0.10, padY = wingH * 0.08;
      const cellW = (wingW - padX * 2) / colsW;
      const cellH = (wingH - padY * 2) / rowsW;
      const wW = Math.min(cellW * 0.55, 8);
      const wH = Math.min(cellH * 0.5, 9);
      let n = 0;
      for (let r = 0; r < rowsW; r++) {
        for (let c = 0; c < colsW; c++) {
          n++;
          const wx = wLeft + padX + c * cellW + (cellW - wW) / 2;
          const wy = wTop + padY + r * cellH + (cellH - wH) / 2;
          if (isDark) {
            const on = (cap.windows[n % cap.windows.length] || {}).on;
            if (on) {
              const fl = 0.85 + 0.15 * Math.sin(t * 0.08 + n);
              ctx.fillStyle = `rgba(255,220,120,${fl})`;
              ctx.fillRect(wx, wy, wW, wH);
              if (n % 5 === 0) {
                reflections.push({ x: wx + wW/2, color: 'rgba(255,220,120,', alpha: 0.22 * fl, width: wW * 2.2 });
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

    // Central tower (the part the dome sits on).
    ctx.fillStyle = isDark ? '#1c1c2a' : '#ece1c5';
    ctx.fillRect(mainLeft, mainTop, cap.width, cap.height);
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.14)';
    ctx.fillRect(mainLeft, mainTop, 1.5, cap.height);

    // Central tower windows.
    {
      const cols = cap.cols, rows = cap.rows;
      const padX = cap.width * 0.10;
      const padY = cap.height * 0.05;
      const cellW = (cap.width - padX * 2) / cols;
      const cellH = (cap.height - padY * 2) / rows;
      const wW = Math.min(cellW * 0.55, 10);
      const wH = Math.min(cellH * 0.55, 12);
      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const win = cap.windows[idx++];
          if (!win) continue;
          const wx = mainLeft + padX + c * cellW + (cellW - wW) / 2;
          const wy = mainTop + padY + r * cellH + (cellH - wH) / 2;
          if (isDark) {
            if (win.on) {
              const fl = 0.85 + 0.15 * Math.sin(t * 0.08 + idx);
              ctx.fillStyle = `rgba(255,228,140,${fl})`;
              ctx.fillRect(wx, wy, wW, wH);
              if (idx % 7 === 0) {
                reflections.push({ x: wx + wW/2, color: 'rgba(255,228,140,', alpha: 0.28 * fl, width: wW * 2.2 });
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

    // ── Dome stack ──
    const domeR = cap.domeRadius;
    const drumW = domeR * 2.1;
    const drumH = domeR * 0.55;
    const drumTopY = mainTop - drumH;
    // Drum (cylindrical base)
    ctx.fillStyle = isDark ? '#22222e' : '#f1ead4';
    ctx.fillRect(cap.x - drumW / 2, drumTopY, drumW, drumH);
    // Drum column hints (vertical lines for columns)
    ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.35)' : 'rgba(80,70,40,0.35)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) {
      const cx = cap.x - drumW / 2 + (drumW / 8) * i;
      ctx.beginPath(); ctx.moveTo(cx, drumTopY + 2); ctx.lineTo(cx, drumTopY + drumH - 2); ctx.stroke();
    }
    // Dome — hemisphere
    ctx.beginPath();
    ctx.arc(cap.x, drumTopY, domeR, Math.PI, 0);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#2a2a3a' : '#f6efd7';
    ctx.fill();
    // Dome ribs
    ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.30)' : 'rgba(120,100,50,0.35)';
    ctx.lineWidth = 0.8;
    for (let i = 1; i < 5; i++) {
      const ang = Math.PI + (Math.PI / 5) * i;
      ctx.beginPath();
      ctx.moveTo(cap.x, drumTopY);
      ctx.lineTo(cap.x + Math.cos(ang) * domeR, drumTopY + Math.sin(ang) * domeR);
      ctx.stroke();
    }
    // Cupola — small drum on top
    const cupolaW = domeR * 0.55;
    const cupolaH = domeR * 0.45;
    const cupolaTopY = drumTopY - domeR - cupolaH;
    ctx.fillStyle = isDark ? '#2a2a3a' : '#f6efd7';
    ctx.fillRect(cap.x - cupolaW / 2, cupolaTopY, cupolaW, cupolaH);
    // Spire
    const spireH = domeR * 0.95;
    ctx.beginPath();
    ctx.moveTo(cap.x, cupolaTopY - spireH);
    ctx.lineTo(cap.x - cupolaW * 0.18, cupolaTopY);
    ctx.lineTo(cap.x + cupolaW * 0.18, cupolaTopY);
    ctx.closePath();
    ctx.fillStyle = isDark ? '#2a2a3a' : '#c8b870';
    ctx.fill();
    // Golden statue silhouette ("Wisconsin") at the very top.
    ctx.beginPath();
    ctx.arc(cap.x, cupolaTopY - spireH - 3, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#f5b400' : '#c69214';
    ctx.fill();
    // Statue arms
    ctx.beginPath();
    ctx.moveTo(cap.x - 4, cupolaTopY - spireH - 1);
    ctx.lineTo(cap.x + 4, cupolaTopY - spireH - 1);
    ctx.strokeStyle = isDark ? '#f5b400' : '#a07b1c';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Night halo + uplight beam — the Capitol is floodlit in real life.
    if (isDark) {
      // Diffuse halo around the whole dome
      const haloR = domeR * 3.4;
      const halo = ctx.createRadialGradient(cap.x, drumTopY - domeR * 0.3, 0, cap.x, drumTopY - domeR * 0.3, haloR);
      halo.addColorStop(0,    'rgba(255,228,148,0.42)');
      halo.addColorStop(0.45, 'rgba(255,205,100,0.16)');
      halo.addColorStop(1,    'rgba(255,205,100,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(cap.x - haloR, drumTopY - haloR, haloR * 2, haloR * 2);
      // (Removed the static rectangular up-beam — moving spotlights now
      // do the lit-capitol effect.)
      // Dome rim glow (front-lit)
      const rim = ctx.createRadialGradient(cap.x, drumTopY + 4, domeR * 0.6, cap.x, drumTopY + 4, domeR * 1.05);
      rim.addColorStop(0,   'rgba(255,228,148,0)');
      rim.addColorStop(0.9, 'rgba(255,228,148,0.32)');
      rim.addColorStop(1,   'rgba(255,228,148,0)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cap.x, drumTopY, domeR * 1.05, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      // Lit dome surface tint
      ctx.beginPath();
      ctx.arc(cap.x, drumTopY, domeR, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,238,180,0.20)';
      ctx.fill();
      // Capitol reflection streak — wide and soft.
      reflections.push({ x: cap.x, color: 'rgba(255,228,148,', alpha: 0.35, width: domeR * 2.0 });
    }
  };

  // Buildings (back to front), then Capitol on top.
  for (const b of state.buildings) drawBuilding(b);
  drawCapitol();

  // ── Sweeping spotlights aimed at the Capitol (night only) ──
  if (isDark && state.spotlights) {
    // additive blending so overlapping beams brighten naturally; clipped
    // to the area above the lake so the lamp halos never bleed into the
    // water.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, groundY);
    ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    const cap = state.capitol;
    const drumTopY = (groundY - cap.height) - cap.domeRadius * 0.55;
    for (const sl of state.spotlights) {
      // Cosine-driven angle inside [a0, a1] so the beam eases at the ends.
      const u = 0.5 + 0.5 * Math.sin(t * sl.sp + sl.ph);
      const ang = sl.a0 + (sl.a1 - sl.a0) * u;
      const beamLen = Math.hypot(cap.x - sl.ox, drumTopY - sl.oy) + cap.domeRadius * 1.5;
      // Two-sided spread cone — wider at the far end.
      const spread = 0.085; // radians half-angle at origin
      const ax = sl.ox + Math.cos(ang) * beamLen;
      const ay = sl.oy + Math.sin(ang) * beamLen;
      const px1 = ax + Math.cos(ang + Math.PI / 2) * beamLen * spread;
      const py1 = ay + Math.sin(ang + Math.PI / 2) * beamLen * spread;
      const px2 = ax + Math.cos(ang - Math.PI / 2) * beamLen * spread;
      const py2 = ay + Math.sin(ang - Math.PI / 2) * beamLen * spread;

      // Gradient along the beam length: bright at origin → fades to nothing.
      const grad = ctx.createLinearGradient(sl.ox, sl.oy, ax, ay);
      grad.addColorStop(0,   'rgba(255,236,180,0.55)');
      grad.addColorStop(0.5, 'rgba(255,228,148,0.20)');
      grad.addColorStop(1,   'rgba(255,228,148,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sl.ox, sl.oy);
      ctx.lineTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.closePath();
      ctx.fill();

      // Small bright source at the spotlight origin so it reads as a lamp.
      const lamp = ctx.createRadialGradient(sl.ox, sl.oy, 0, sl.ox, sl.oy, 7);
      lamp.addColorStop(0, 'rgba(255,236,180,0.85)');
      lamp.addColorStop(1, 'rgba(255,236,180,0)');
      ctx.fillStyle = lamp;
      ctx.fillRect(sl.ox - 7, sl.oy - 7, 14, 14);
    }
    ctx.restore();
  }

  // ── Monona Terrace — long white arched structure at the lakeshore ──
  {
    const tr = state.terrace;
    const baseY = groundY;             // bottom of the structure (meets water)
    const topY  = baseY - tr.height;   // top of the structure
    const left  = tr.cx - tr.width / 2;
    const archCount = tr.numArches;
    const archW = tr.width / archCount;
    const archH = tr.height * 0.85;
    // Dark roof strip across the top of the terrace.
    ctx.fillStyle = isDark ? '#0d0d14' : '#1a1d22';
    ctx.fillRect(left, topY, tr.width, tr.height * 0.16); // top roof strip
    // Inner arch field background (medium-dark, lit from inside by the arches)
    ctx.fillStyle = isDark ? '#1c1c24' : '#3a3a40';
    ctx.fillRect(left, topY + tr.height * 0.16, tr.width, tr.height - tr.height * 0.16);

    // Cut out each arch: draw a glowing "opening" with a thin column on the right.
    const archInsetTop = tr.height * 0.20;
    const archInnerH = tr.height - archInsetTop - 2; // leave a thin lip at the bottom
    const colW = Math.max(2, archW * 0.10);
    for (let i = 0; i < archCount; i++) {
      const ax = left + i * archW + colW / 2;
      const openW = archW - colW;
      const cxArch = ax + openW / 2;
      const arcTopY = topY + archInsetTop;
      const radius = openW / 2;

      // Lit opening at night (warm), dim sky-blue glow during day.
      const fillTop = isDark ? '#fff1bf' : '#a9c5d5';
      const fillMid = isDark ? '#ffd485' : '#c9d8e0';
      const grad = ctx.createLinearGradient(0, arcTopY, 0, baseY);
      grad.addColorStop(0,   fillTop);
      grad.addColorStop(0.6, fillMid);
      grad.addColorStop(1,   isDark ? '#a07a30' : '#8fa3ad');
      ctx.fillStyle = grad;
      ctx.beginPath();
      // Vertical sides + arched top
      ctx.moveTo(cxArch - radius, baseY);
      ctx.lineTo(cxArch - radius, arcTopY + radius);
      ctx.arc(cxArch, arcTopY + radius, radius, Math.PI, 0);
      ctx.lineTo(cxArch + radius, baseY);
      ctx.closePath();
      ctx.fill();

      // Soft inner glow at night so the openings look lit.
      if (isDark) {
        const glow = ctx.createRadialGradient(cxArch, arcTopY + radius * 1.4, 0, cxArch, arcTopY + radius * 1.4, radius * 1.6);
        glow.addColorStop(0,   'rgba(255,232,158,0.55)');
        glow.addColorStop(0.6, 'rgba(255,200,90,0.15)');
        glow.addColorStop(1,   'rgba(255,200,90,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(cxArch - radius * 1.8, arcTopY - radius * 0.4, radius * 3.6, archInnerH + radius * 1.2);

        // Each arch contributes one soft, wide reflection in the lake.
        reflections.push({
          x: cxArch,
          color: 'rgba(255,220,140,',
          alpha: 0.30,
          width: openW * 0.9,
        });
      }
    }
    // Thin top trim line (subtle dark accent under the roof)
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.35)';
    ctx.fillRect(left, topY + tr.height * 0.155, tr.width, 1);
    // Water-line shadow under the terrace
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)';
    ctx.fillRect(left, baseY - 1, tr.width, 1.5);
  }

  // ── Update car positions + collect their reflections ──
  // Actual car drawing happens AFTER the reflections + ripples so the
  // headlights and bodies sit on top of everything in the water region.
  const carY = groundY - 4;
  const visibleCars = [];
  for (const car of state.cars) {
    if (car.delay > 0) { car.delay -= 1; continue; }
    car.x += car.dir * car.sp;
    if (car.dir === 1 && car.x > w + 12) {
      car.x = -12;
      car.delay = Math.floor(30 * _rnd(30, 240));
      continue;
    }
    if (car.dir === -1 && car.x < -12) {
      car.x = w + 12;
      car.delay = Math.floor(30 * _rnd(30, 240));
      continue;
    }
    visibleCars.push(car);
    if (isDark) {
      reflections.push({
        x: car.x,
        color: 'rgba(255,232,140,',
        alpha: 0.22,
        width: 9,
      });
    }
  }

  // ── Lake reflections — subsampled, wide, blurred. ──
  // Drawn through a Gaussian blur filter so the streaks read as soft
  // mirror smudges rather than crisp vertical bars.
  ctx.save();
  if (typeof ctx.filter === 'string') ctx.filter = 'blur(3px)';
  for (const r of reflections) {
    const sway = Math.sin(t * 0.04 + r.x * 0.013) * 1.6;
    const rx = r.x + sway;
    const grad = ctx.createLinearGradient(rx, groundY, rx, lakeBottom);
    grad.addColorStop(0,    `${r.color}${r.alpha})`);
    grad.addColorStop(0.55, `${r.color}${r.alpha * 0.45})`);
    grad.addColorStop(1,    `${r.color}0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(rx - r.width / 2, groundY, r.width, lakeHeight);
  }
  ctx.restore();
  // Horizontal ripple lines breaking the reflections.
  if (isDark) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.20)';
  }
  for (let yy = groundY + 10; yy < lakeBottom; yy += 14) {
    const wob = Math.sin(t * 0.05 + yy * 0.07) * 2;
    ctx.fillRect(0, yy + wob, w, 1);
  }

  // ── Cars (drawn LAST so headlights sit on top of the lake) ──
  for (const car of visibleCars) {
    const cy = carY;
    const headX = car.dir === 1 ? car.x + car.len / 2 : car.x - car.len / 2;
    const tailX = car.dir === 1 ? car.x - car.len / 2 : car.x + car.len / 2;
    if (isDark) {
      // Dark body sliver
      ctx.fillStyle = '#0d0e16';
      ctx.fillRect(car.x - car.len / 2, cy, car.len, 2.2);
      // Bright headlight halo
      const hl = ctx.createRadialGradient(headX, cy + 1, 0, headX, cy + 1, 9);
      hl.addColorStop(0,   'rgba(255,244,180,0.95)');
      hl.addColorStop(0.5, 'rgba(255,232,140,0.32)');
      hl.addColorStop(1,   'rgba(255,232,140,0)');
      ctx.fillStyle = hl;
      ctx.fillRect(headX - 9, cy - 7, 18, 16);
      // Bright headlight core
      ctx.fillStyle = 'rgba(255,250,210,1)';
      ctx.fillRect(headX - 0.6, cy + 0.3, 1.6, 1.6);
      // Small red taillight
      ctx.fillStyle = 'rgba(255,60,40,0.95)';
      ctx.fillRect(tailX - 0.7, cy + 0.4, 1.4, 1.4);
    } else {
      // Day: solid little block in the car's colour
      ctx.fillStyle = car.col;
      ctx.fillRect(car.x - car.len / 2, cy, car.len, 2.2);
      // Tiny windshield highlight
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(car.x - 0.5, cy - 0.4, car.len * 0.35, 0.8);
    }
  }

  // ── window toggles (night only) — each window has its own countdown ──
  // Toggles are infrequent: most windows hold their state for 1-5 minutes.
  // The probability is also biased toward "stay off" so the lit fraction
  // doesn't drift up over time.
  if (isDark) {
    const tickAll = (b) => {
      for (const win of b.windows) {
        win.flipAt -= 1;
        if (win.flipAt <= 0) {
          win.on = Math.random() < (win.on ? 0.62 : 0.18);
          win.flipAt = Math.floor(30 * _rnd(60, 300));
        }
      }
    };
    for (const b of state.buildings) tickAll(b);
    tickAll(state.capitol);
  }

  // ── rain on top of everything ──
  if (rain.intensity > 0.01) {
    const visible = Math.floor(rain.drops.length * rain.intensity);
    ctx.strokeStyle = isDark
      ? `rgba(170,200,235,${0.55 * rain.intensity})`
      : `rgba(210,228,245,${0.65 * rain.intensity})`;
    ctx.lineWidth = 1; ctx.lineCap = 'round';
    const windPush = state.wind.current * 1.8;
    for (let i = 0; i < visible; i++) {
      const d = rain.drops[i];
      d.x += d.vx + windPush; d.y += d.vy;
      if (d.y > h + 20) { d.y = -20; d.x = _rnd(-40, w + 40); }
      if (d.x < -40)    { d.x = w + 20; }
      if (d.x > w + 60) { d.x = -20; }
      ctx.globalAlpha = d.alp;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + (d.vx + windPush) * 1.4, d.y + d.vy * 1.4);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Storm darkening + lightning go last so they overlay everything.
  if (!isDark) _drawStormFX(ctx, rain, w, h);
}

// ── main entry points ─────────────────────────────────────────────────────────
function applyDynamicBg(palette, isDark) {
  stopDynamicBg();

  // html background-color = edge colour. This covers:
  //   - iOS rubber-band overscroll above/below page
  //   - Pinch-zoom-out revealing area outside the page
  //   - Any gap between canvas and viewport edge
  const edgeColors = {
    cold:  { day:'#4890c8', night:'#010818' },
    warm:  { day:'#e07830', night:'#120800' },
    duo:   { day:'#3e9e20', night:'#010d01' },
    tropical: { day:'#34a2cc', night:'#020810' },
    madison: { day:'#9ec9e8', night:'#020414' },
  };
  const edge = (edgeColors[palette] || edgeColors.tropical)[isDark ? 'night' : 'day'];
  document.documentElement.style.background = edge;
  document.body.style.background = 'transparent';

  // Canvas: position fixed, always covers the viewport exactly
  const canvas = document.createElement('canvas');
  canvas.id = 'mc-dyn-bg';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;display:block';

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let t = 0, animId = null, lastTs = 0, scrollY = 0;
  const w = () => canvas.width, h = () => canvas.height;

  // Init particle state using current canvas size
  let state;
  const buildState = () => {
    if (palette === 'cold')     return _initCold(w(), h(), isDark);
    if (palette === 'warm')     return _initWarm(w(), h());
    if (palette === 'duo')      return _initDuo(w(), h());
    if (palette === 'madison')  return _initMadison(w(), h(), isDark);
    return _initTropical(w(), h(), isDark);
  };
  state = buildState();

  const draw = (now) => {
    animId = requestAnimationFrame(draw);
    if (now - lastTs < 33) return; // ~30 fps cap
    lastTs = now;
    t++;
    const cw = w(), ch = h();
    ctx.clearRect(0, 0, cw, ch);
    const py = -scrollY * 0.07; // parallax offset
    if (palette === 'cold')         _drawCold(ctx, isDark, state, t, py, cw, ch);
    else if (palette === 'warm')    _drawWarm(ctx, isDark, state, t, py, cw, ch);
    else if (palette === 'duo')     _drawDuo(ctx, isDark, state, t, py, cw, ch);
    else if (palette === 'madison') _drawMadison(ctx, isDark, state, t, py, cw, ch);
    else                            _drawTropical(ctx, isDark, state, t, py, cw, ch);
  };
  animId = requestAnimationFrame(draw);

  const onScroll = () => { scrollY = window.scrollY; };
  const onResize = () => { resize(); state = buildState(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  _dynBgCleanup = () => {
    if (animId) cancelAnimationFrame(animId);
    canvas.remove();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.documentElement.style.background = '';
    document.body.style.background = '';
  };
}

// Parse the stored theme, migrating the older single-string format.
function parseStoredTheme() {
  const raw = storage.get(KEYS.theme, null);
  if (raw && typeof raw === 'object' && raw.palette && raw.mode) {
    return {
      palette: PALETTES.includes(raw.palette) ? raw.palette : 'cold',
      mode: MODES.includes(raw.mode) ? raw.mode : 'system',
    };
  }
  const legacy = {
    dark: { palette: 'cold', mode: 'dark' },
    light: { palette: 'cold', mode: 'light' },
    system: { palette: 'cold', mode: 'system' },
    warm: { palette: 'warm', mode: 'light' },
    darkwarm: { palette: 'warm', mode: 'dark' },
    green: { palette: 'duo', mode: 'light' },
    darkgreen: { palette: 'duo', mode: 'dark' },
  };
  return legacy[raw] || { palette: 'cold', mode: 'system' };
}

// Random motivational quotes — one is picked when the Home tab mounts.
const QUOTES = [
  "The MCAT doesn't reward perfection — it rewards persistence. Show up again today.",
  "Every wrong answer today is a right answer locked in for test day.",
  "You're not behind. You're exactly where the studying happens.",
  "Small reps, every day. That's how 528s are built.",
  "The best students aren't the smartest — they're the ones who came back tomorrow.",
  "Confused is the feeling of learning. Lean into it.",
  "Future-you, the one in the white coat, is grateful you opened this app.",
  "One chapter at a time. One question at a time. That's the whole game.",
  "Discomfort is the price of growth. Pay it gladly.",
  "Mastery is just confusion that didn't quit.",
  "Test day will reward the work nobody saw you do.",
  "If it were easy, everyone would have an MD.",
  "You don't need motivation — you need a streak. Start one today.",
  "The brain that learns biochem is the same brain that built it. Trust it.",
  "Slow is smooth. Smooth is fast. Smooth is a great MCAT score.",
];

// ---------- daily CARS helpers ----------
const CARS_DISCIPLINES = [
  'Philosophy', 'History', 'Literature', 'Ethics', 'Political Science', 'Sociology',
  'Art', 'Anthropology', 'Music', 'Economics', 'Religion', 'Psychology',
  'Architecture', 'Linguistics', 'Popular Culture', 'Studies of Diverse Cultures',
  'Theater', 'Geography', 'Archaeology', 'Education',
];
function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
// Rotate discipline by day-of-year so consecutive days differ.
function carsDisciplineFor(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d - start) / 86400000);
  return CARS_DISCIPLINES[dayOfYear % CARS_DISCIPLINES.length];
}
function getCarsResults() { try { return JSON.parse(localStorage.getItem('mcat:cars')) || {}; } catch { return {}; } }
function setCarsResult(date, result) {
  const all = getCarsResults();
  all[date] = result;
  try { localStorage.setItem('mcat:cars', JSON.stringify(all)); } catch {}
  markStateDirty();
}
// ---------- text sanitization (defensive cleanup for AI-edited questions) ----------
// Replace literal escape sequences / entities that sometimes leak into model output,
// and collapse stray whitespace.
function sanitizeText(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/\\u2014/gi, '—').replace(/\\u2013/gi, '–')
    .replace(/\\u2019/gi, '’').replace(/\\u2018/gi, '‘')
    .replace(/\\u201c/gi, '“').replace(/\\u201d/gi, '”')
    .replace(/\\u2026/gi, '…').replace(/\\u00a0/gi, ' ')
    .replace(/&mdash;/gi, '—').replace(/&ndash;/gi, '–')
    .replace(/&#8212;?/g, '—').replace(/&#8211;?/g, '–')
    .replace(/&rsquo;/gi, '’').replace(/&lsquo;/gi, '‘')
    .replace(/&[lr]dquo;/gi, '"').replace(/&hellip;/gi, '…')
    .replace(/&amp;/gi, '&').replace(/\\n/g, ' ').replace(/\\t/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}
// Strip a leading position label ("A.", "B)", "(C)") from a choice — but only when the
// label matches the choice's own index, and not when it's actually a name initial
// (e.g. "B. F. Skinner").
function stripChoiceLabel(s, index) {
  if (typeof s !== 'string') return s;
  const expected = 'ABCD'[index];
  const cleaned = sanitizeText(s);
  if (!expected) return cleaned;
  const m = cleaned.match(/^\(?([A-Da-d])\)?[.):\-]\s+(.+)$/s);
  if (m && m[1].toUpperCase() === expected) {
    const rest = m[2].trim();
    if (/^[A-Z]\.\s/.test(rest)) return cleaned; // looks like a name initial — keep
    return rest;
  }
  return cleaned;
}

// Schema field names that sometimes leak into the `choices` array when the model
// mangles its JSON output (e.g. a 5th "choice" literally named "correct_index").
const MC_LEAKED_KEYS = new Set([
  'correct_index', 'explanation', 'question', 'subject', 'chapter',
  'content_category', 'sirs_skill', 'choices', 'answer', 'category', 'subtype',
]);

// Scan a generated MC question for formatting errors and repair or reject it.
// Returns a clean question ({ ...q, choices, correct_index }) or null if it can't
// be salvaged into a valid 4-choice single-answer item. Mutations are non-destructive.
function validateMCQuestion(q) {
  if (!q || typeof q !== 'object') return null;
  const question = sanitizeText(q.question);
  if (!question) return null;

  let choices = Array.isArray(q.choices) ? q.choices : [];
  // Track which originals survive so we can remap correct_index after filtering.
  const kept = [];
  choices.forEach((c, i) => {
    if (typeof c !== 'string') return;
    const t = sanitizeText(c);
    if (!t) return;                                   // drop empty/blank
    if (MC_LEAKED_KEYS.has(t.toLowerCase())) return;  // drop leaked field-name "choices"
    kept.push({ text: t, origIdx: i });
  });

  // Deduplicate exact-duplicate choices (another common malformed-output symptom).
  const seen = new Set();
  const deduped = kept.filter((k) => {
    const key = k.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length !== 4) return null; // not a well-formed 4-choice item

  // Remap correct_index through the surviving choices. If the keyed answer was one
  // of the dropped entries, the item is unsalvageable.
  let ci = Number(q.correct_index);
  if (!Number.isInteger(ci)) return null;
  const newCi = deduped.findIndex((k) => k.origIdx === ci);
  if (newCi < 0) return null;

  return {
    ...q,
    question,
    choices: deduped.map((k) => k.text),
    correct_index: newCi,
    explanation: sanitizeText(q.explanation) || '',
  };
}

// Run validateMCQuestion across an array; returns { questions, dropped }.
function validateMCQuestions(arr) {
  const questions = [];
  let dropped = 0;
  for (const q of (Array.isArray(arr) ? arr : [])) {
    const ok = validateMCQuestion(q);
    if (ok) questions.push(ok); else dropped++;
  }
  return { questions, dropped };
}

// Local cache of downloaded CARS payloads so a day opens instantly / offline.
function getCarsCache() { try { return JSON.parse(localStorage.getItem('mcat:carsCache')) || {}; } catch { return {}; } }
function getCarsCachePayload(date) { return getCarsCache()[date] || null; }
function setCarsCachePayload(date, payload) {
  if (!payload) return;
  const all = getCarsCache();
  all[date] = payload;
  // Keep the cache bounded — newest 60 days.
  const keys = Object.keys(all).sort();
  while (keys.length > 60) delete all[keys.shift()];
  try { localStorage.setItem('mcat:carsCache', JSON.stringify(all)); } catch {}
}

// Local cache of the Gemini-generated daily mini-exam, keyed by date. The set is
// personalized (drawn from the student's mastered chapters) so it lives only in
// localStorage — there's no shared backend like CARS has.
function getDailyExamCache() { try { return JSON.parse(localStorage.getItem('mcat:dailyExamCache')) || {}; } catch { return {}; } }
function getDailyExamPayload(date) { return getDailyExamCache()[date] || null; }
function setDailyExamPayload(date, payload) {
  if (!payload) return;
  const all = getDailyExamCache();
  all[date] = payload;
  const keys = Object.keys(all).sort();
  while (keys.length > 30) delete all[keys.shift()];
  try { localStorage.setItem('mcat:dailyExamCache', JSON.stringify(all)); } catch {}
}

// ---------- daily Connections helpers ----------
function getConnectionsCache() { try { return JSON.parse(localStorage.getItem('mcat:connectionsCache')) || {}; } catch { return {}; } }
function getConnectionsCachePayload(date) { return getConnectionsCache()[date] || null; }
function setConnectionsCachePayload(date, payload) {
  if (!payload) return;
  const all = getConnectionsCache();
  all[date] = payload;
  const keys = Object.keys(all).sort();
  while (keys.length > 60) delete all[keys.shift()];
  try { localStorage.setItem('mcat:connectionsCache', JSON.stringify(all)); } catch {}
}
function getConnectionsResults() { try { return JSON.parse(localStorage.getItem('mcat:connectionsResults')) || {}; } catch { return {}; } }
function setConnectionsResult(date, result) {
  const all = getConnectionsResults();
  all[date] = result;
  try { localStorage.setItem('mcat:connectionsResults', JSON.stringify(all)); } catch {}
  markStateDirty();
}

const DEFAULT_GITHUB = {
  token: '',
  repo: 'Orbgamestudios/MCAT-study-MASTER',
  branch: 'main',
  path: 'data.json',
  autoPush: false,
};

// ---------- github contents api ----------
function toBase64Utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

async function ghHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function ghGetSha({ token, repo, branch, path }) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: await ghHeaders(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  return j.sha;
}

async function ghPutFile({ token, repo, branch, path }, content, sha, message) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;
  const body = { message, content: toBase64Utf8(content), branch };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...(await ghHeaders(token)), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function pushBankToGithub(github, { files, extractions, questions }) {
  if (!github.token || !github.repo || !github.path) throw new Error('GitHub sync not configured.');
  const data = {
    version: 1,
    exported_at: new Date().toISOString(),
    model: MODEL,
    files, extractions, questions,
  };
  const content = JSON.stringify(data, null, 2);
  const sha = await ghGetSha(github);
  const msg = `Update bank: ${files.length} files (${new Date().toISOString().slice(0, 10)})`;
  return ghPutFile(github, content, sha, msg);
}

// ---------- sound effects ----------
// User-adjustable master volume (0..1), persisted in localStorage. Multiplies every sfx.
function _vol() {
  try {
    const raw = localStorage.getItem('mcat:volume');
    if (raw == null) return 1;
    const v = JSON.parse(raw);
    return typeof v === 'number' && v >= 0 && v <= 1 ? v : 1;
  } catch { return 1; }
}
// ---------- audio context ----------
// Browsers auto-suspend the AudioContext after inactivity / backgrounding. A sound
// scheduled against a suspended context is silently dropped — that's the "works
// sometimes" bug. _withCtx() resumes first and only schedules once the context is
// genuinely running.
let _audioCtx = null;
function _ctx() {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return _audioCtx;
  } catch { return null; }
}
function _withCtx(cb) {
  const ctx = _ctx();
  if (!ctx) return;
  if (ctx.state === 'running') { try { cb(ctx); } catch {} return; }
  // resume() must be kicked off inside a user gesture; cb runs once it actually resumes.
  ctx.resume().then(() => { try { cb(ctx); } catch {} }).catch(() => {});
}

// Answer SFX. WebAudio buffer (with a gain node) once decoded so the volume slider
// applies precisely; the Audio element is the fallback until then.
const _sfxBufferCache = {}; // name -> AudioBuffer | undefined
const _sfxAudioCache = {};
function _kickBufferLoad(name) {
  const ctx = _ctx();
  if (!ctx || _sfxBufferCache[name + ':loading'] || _sfxBufferCache[name]) return;
  _sfxBufferCache[name + ':loading'] = true;
  fetch(`assets/${name}.mp3`)
    .then((r) => r.arrayBuffer())
    .then((buf) => ctx.decodeAudioData(buf))
    .then((decoded) => { _sfxBufferCache[name] = decoded; })
    .catch(() => {})
    .finally(() => { _sfxBufferCache[name + ':loading'] = false; });
}
function _playSfxFallback(name) {
  try {
    if (!_sfxAudioCache[name]) {
      _sfxAudioCache[name] = new Audio(`assets/${name}.mp3`);
      _sfxAudioCache[name].preload = 'auto';
    }
    const a = _sfxAudioCache[name];
    a.currentTime = 0;
    a.volume = Math.max(0, Math.min(1, 0.4 * _vol()));
    a.play().catch(() => {});
  } catch {}
}
function playSfx(name) {
  const buf = _sfxBufferCache[name];
  if (buf) {
    _withCtx((ctx) => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = Math.max(0.0001, 0.4 * _vol());
      src.connect(gain).connect(ctx.destination);
      src.start();
    });
    return;
  }
  // Buffer not ready — load it for next time, play via Audio element now.
  _kickBufferLoad(name);
  _playSfxFallback(name);
}

// One-time audio unlock on the first user interaction: resumes the context (so the
// very first sound isn't dropped) and pre-decodes the answer SFX buffers.
(function () {
  let done = false;
  const unlock = () => {
    if (done) return;
    done = true;
    _withCtx((ctx) => {
      try {
        const b = ctx.createBuffer(1, 1, ctx.sampleRate);
        const s = ctx.createBufferSource();
        s.buffer = b; s.connect(ctx.destination); s.start();
      } catch {}
    });
    _kickBufferLoad('correct');
    _kickBufferLoad('wrong');
  };
  ['pointerdown', 'touchstart', 'keydown', 'click'].forEach((ev) =>
    document.addEventListener(ev, unlock, { capture: true, passive: true }));
})();

function _beep(freq, durMs, { vol = 0.08, type = 'sine', startAt = 0 } = {}) {
  _withCtx((ctx) => {
    const peak = Math.max(0.0001, vol * _vol());
    const t0 = ctx.currentTime + startAt;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
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

// Percussive "tick" for any HUD button tap — short band-pass-filtered noise burst.
function sfxTap() {
  _withCtx((ctx) => {
    const t0 = ctx.currentTime;
    const dur = 0.035;
    const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2800;
    filter.Q.value = 3;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.max(0.0001, 0.18 * _vol()), t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.01);
  });
}

// Each hit = mostly noise burst with only a faint tonal tail. Reads percussive,
// barely tuneful.
function _percHit(centerFreq, startAt, vol) {
  _withCtx((ctx) => {
    const peak = Math.max(0.0001, vol * _vol());
    const t0 = ctx.currentTime + startAt;

    const nDur = 0.045;
    const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * nDur)), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = centerFreq;
    filt.Q.value = 1.5;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(peak * 1.0, t0);
    nGain.gain.exponentialRampToValueAtTime(0.0001, t0 + nDur);
    src.connect(filt).connect(nGain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + nDur + 0.01);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
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
  _percHit(1100, 0,    0.13);
  _percHit(1600, 0.07, 0.13);
  _percHit(2200, 0.14, 0.16);
}

// ---------- vibration ----------
function vibrate(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch {}
}
function vibrateTap() { vibrate(12); }
function vibrateCorrect() { vibrate([30, 60, 30]); }
function vibrateWrong() { vibrate(220); }

// HUD click helper — pairs the tap sound with a subtle vibration.
function hudClick() { sfxTap(); vibrateTap(); }

// ---------- dynamic favicon (matches the in-app gradient logo per theme) ----------
const THEME_ICON_COLORS = {
  dark:      { accent: '#4f46e5', accent2: '#d946ef' },
  light:     { accent: '#4f46e5', accent2: '#a21caf' },
  warm:      { accent: '#c2410c', accent2: '#b45309' },
  darkwarm:  { accent: '#e8833a', accent2: '#d99a3a' },
  green:     { accent: '#58cc02', accent2: '#1cb0f6' },
  darkgreen: { accent: '#58cc02', accent2: '#1cb0f6' },
};
function updateFavicon(theme) {
  try {
    const pal = THEME_ICON_COLORS[theme] || THEME_ICON_COLORS.dark;
    const SIZE = 64;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE; canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    const r = 14;
    // Rounded-square gradient (mirrors the header logo)
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(SIZE, 0, SIZE, SIZE, r);
    ctx.arcTo(SIZE, SIZE, 0, SIZE, r);
    ctx.arcTo(0, SIZE, 0, 0, r);
    ctx.arcTo(0, 0, SIZE, 0, r);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    grad.addColorStop(0, pal.accent);
    grad.addColorStop(1, pal.accent2);
    ctx.fillStyle = grad;
    ctx.fill();
    // "M" inset for recognizability
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = 'bold 38px ui-sans-serif, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('M', SIZE / 2, SIZE / 2 + 2);
    const dataUrl = canvas.toDataURL('image/png');
    // Replace existing icon links with our generated one.
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((el) => el.parentNode.removeChild(el));
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = dataUrl;
    document.head.appendChild(link);
    const apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    apple.href = dataUrl;
    document.head.appendChild(apple);
  } catch {}
}

// LZ-string compressToUTF16 / decompressFromUTF16. Inlined from pieroxy's
// lz-string (MIT). Synchronous, no deps, packs the LZW dictionary into 15
// bits per char so the result still fits cleanly in a UTF-16 localStorage
// string. Typically 65–75% smaller than raw JSON for our chapter blobs,
// which is what gets us comfortably under the iOS Safari ~5 MB cap.
const lzString = (function () {
  const f = String.fromCharCode;
  function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return '';
    let i, value, ii;
    const context_dictionary = {}, context_dictionaryToCreate = {};
    let context_c = '', context_wc = '', context_w = '';
    let context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2;
    const context_data = [];
    let context_data_val = 0, context_data_position = 0;
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
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0;
              } else context_data_position++;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0;
              } else context_data_position++;
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0;
              } else context_data_position++;
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0;
              } else context_data_position++;
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0;
            } else context_data_position++;
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }
    if (context_w !== '') {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar - 1) { context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0; }
            else context_data_position++;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) { context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0; }
            else context_data_position++;
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar - 1) { context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0; }
            else context_data_position++;
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) { context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0; }
            else context_data_position++;
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position == bitsPerChar - 1) { context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0; }
          else context_data_position++;
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) { context_enlargeIn = Math.pow(2, context_numBits); context_numBits++; }
    }
    value = 2;
    for (i = 0; i < context_numBits; i++) {
      context_data_val = (context_data_val << 1) | (value & 1);
      if (context_data_position == bitsPerChar - 1) { context_data_position = 0; context_data.push(getCharFromInt(context_data_val)); context_data_val = 0; }
      else context_data_position++;
      value = value >> 1;
    }
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar - 1) { context_data.push(getCharFromInt(context_data_val)); break; }
      else context_data_position++;
    }
    return context_data.join('');
  }
  function _decompress(length, resetValue, getNextValue) {
    const dictionary = [];
    let enlargeIn = 4, dictSize = 4, numBits = 3, entry = '', result = [],
        i, w, bits, resb, maxpower, power, c;
    const data = { val: getNextValue(0), position: resetValue, index: 1 };
    for (i = 0; i < 3; i += 1) dictionary[i] = i;
    bits = 0; maxpower = Math.pow(2, 2); power = 1;
    while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
      bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
    }
    switch (bits) {
      case 0:
        bits = 0; maxpower = Math.pow(2, 8); power = 1;
        while (power != maxpower) {
          resb = data.val & data.position; data.position >>= 1;
          if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
          bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
        }
        c = f(bits); break;
      case 1:
        bits = 0; maxpower = Math.pow(2, 16); power = 1;
        while (power != maxpower) {
          resb = data.val & data.position; data.position >>= 1;
          if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
          bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
        }
        c = f(bits); break;
      case 2: return '';
    }
    dictionary[3] = c; w = c; result.push(c);
    while (true) {
      if (data.index > length) return '';
      bits = 0; maxpower = Math.pow(2, numBits); power = 1;
      while (power != maxpower) {
        resb = data.val & data.position; data.position >>= 1;
        if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
        bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
      }
      switch (c = bits) {
        case 0:
          bits = 0; maxpower = Math.pow(2, 8); power = 1;
          while (power != maxpower) {
            resb = data.val & data.position; data.position >>= 1;
            if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
            bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
          }
          dictionary[dictSize++] = f(bits); c = dictSize - 1; enlargeIn--; break;
        case 1:
          bits = 0; maxpower = Math.pow(2, 16); power = 1;
          while (power != maxpower) {
            resb = data.val & data.position; data.position >>= 1;
            if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); }
            bits |= (resb > 0 ? 1 : 0) * power; power <<= 1;
          }
          dictionary[dictSize++] = f(bits); c = dictSize - 1; enlargeIn--; break;
        case 2: return result.join('');
      }
      if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
      if (dictionary[c]) entry = dictionary[c];
      else { if (c === dictSize) entry = w + w.charAt(0); else return null; }
      result.push(entry);
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--; w = entry;
      if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
    }
  }
  return {
    compressToUTF16: function (input) {
      if (input == null) return '';
      return _compress(input, 15, function (a) { return f(a + 32); }) + ' ';
    },
    decompressFromUTF16: function (compressed) {
      if (compressed == null) return '';
      if (compressed == '') return null;
      return _decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
    },
  };
})();

// 4-char marker so we can tell compressed entries from legacy plain-JSON
// ones. Pre-compression entries written by older app versions still load
// correctly via the JSON.parse fallback in storage.get below.
const STORAGE_LZ_MARKER = 'LZv1';
// Only compress entries above this raw-JSON size. Below it, the marker +
// LZ overhead is bigger than the savings.
const STORAGE_LZ_MIN_BYTES = 1024;

const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      if (raw.startsWith(STORAGE_LZ_MARKER)) {
        const body = raw.slice(STORAGE_LZ_MARKER.length);
        const json = lzString.decompressFromUTF16(body);
        return json == null ? fallback : JSON.parse(json);
      }
      return JSON.parse(raw);
    } catch { return fallback; }
  },
  // Returns true on success, false on failure. Compresses large values
  // (>1 KB raw) before writing to localStorage so 36+ chapters fit
  // comfortably under the ~5 MB cap. Falls back to raw JSON on small
  // values where compression would cost more than it saves.
  set(key, value) {
    let json;
    try { json = JSON.stringify(value); } catch (e) {
      try {
        window.dispatchEvent(new CustomEvent('mcat:storage-fail', {
          detail: { key, quota: false, message: 'JSON.stringify failed: ' + (e?.message || e) },
        }));
      } catch {}
      return false;
    }
    const big = json.length >= STORAGE_LZ_MIN_BYTES;
    const payload = big ? (STORAGE_LZ_MARKER + lzString.compressToUTF16(json)) : json;
    try {
      localStorage.setItem(key, payload);
      return true;
    } catch (e) {
      // If we wrote raw and quota'd, try again compressed — the user may
      // have an older browser where small writes hit the cap.
      if (!big) {
        try {
          localStorage.setItem(key, STORAGE_LZ_MARKER + lzString.compressToUTF16(json));
          return true;
        } catch {}
      }
      try {
        const isQuota = e && (e.name === 'QuotaExceededError' || e.code === 22 || /quota/i.test(String(e.message)));
        window.dispatchEvent(new CustomEvent('mcat:storage-fail', {
          detail: { key, quota: !!isQuota, message: e?.message || String(e) },
        }));
      } catch {}
      return false;
    }
  },
  remove(key) { localStorage.removeItem(key); },
  // Walk every localStorage key once and re-write any uncompressed entry
  // through storage.set. Compresses existing chapter data in place — runs
  // once per app upgrade thanks to the version marker, so it doesn't
  // re-pay the cost on every load.
  migrateCompressIfNeeded() {
    const FLAG = 'mcat:_compressed_v1';
    try { if (localStorage.getItem(FLAG) === '1') return; } catch { return; }
    let migrated = 0, freed = 0;
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('mcat:')) keys.push(k);
      }
      for (const k of keys) {
        try {
          const raw = localStorage.getItem(k);
          if (raw == null) continue;
          if (raw.startsWith(STORAGE_LZ_MARKER)) continue; // already compressed
          if (raw.length < STORAGE_LZ_MIN_BYTES) continue; // not worth it
          const parsed = JSON.parse(raw);
          const before = raw.length;
          if (this.set(k, parsed)) {
            const after = (localStorage.getItem(k) || '').length;
            if (after < before) { migrated++; freed += (before - after) * 2; }
          }
        } catch {}
      }
      localStorage.setItem(FLAG, '1');
    } catch {}
    if (migrated > 0) {
      try { console.info(`[storage] compressed ${migrated} keys, freed ~${Math.round(freed / 1024)} KB`); } catch {}
    }
  },
  // Sum of all mcat:* keys in bytes. Used by the storage-full warning to
  // tell the user how full their localStorage actually is.
  usageBytes() {
    let total = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        const v = localStorage.getItem(k) || '';
        // Rough: 2 bytes per char (UTF-16) + the key itself.
        total += (k.length + v.length) * 2;
      }
    } catch {}
    return total;
  },
};

// ---------- error boundary ----------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { caught: null };
  }
  static getDerivedStateFromError(err) {
    return { caught: err };
  }
  componentDidCatch(err, info) {
    console.error('[ErrorBoundary]', err, info?.componentStack);
  }
  reset() { this.setState({ caught: null }); }
  clearAndReload() {
    try {
      ['mcat:questions', 'mcat:extractions', 'mcat:files'].forEach((k) => localStorage.removeItem(k));
    } catch {}
    location.reload();
  }
  render() {
    if (this.state.caught) {
      const msg = this.state.caught?.message || String(this.state.caught);
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#fff5f5', borderRadius: '12px', margin: '1rem', border: '1px solid #e74c3c' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#c0392b', marginBottom: '0.5rem' }}>Something went wrong</div>
          <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1.25rem', wordBreak: 'break-all', fontFamily: 'monospace' }}>{msg}</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => this.reset()}
              style={{ background: '#555', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Try again
            </button>
            <button
              onClick={() => this.clearAndReload()}
              style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Clear downloaded data and restart
            </button>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888' }}>
            If the app keeps crashing, click "Clear downloaded data and restart" — it removes cached chapter data and lets you re-download cleanly.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------- gemini client ----------
class GeminiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function makeClient(getKey) {
  const authHeader = () => ({ 'x-goog-api-key': getKey() });

  async function parseError(res) {
    let body = null;
    try { body = await res.json(); } catch {}
    const msg = body?.error?.message || res.statusText || `HTTP ${res.status}`;
    return new GeminiError(res.status, msg);
  }

  // Resumable upload — initiate + send bytes. PDFs persist on Google for ~48h.
  async function uploadFile(file) {
    const initRes = await fetch(`${UPLOAD_BASE}/files`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'x-goog-upload-protocol': 'resumable',
        'x-goog-upload-command': 'start',
        'x-goog-upload-header-content-length': String(file.size),
        'x-goog-upload-header-content-type': file.type || 'application/pdf',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ file: { display_name: file.name } }),
    });
    if (!initRes.ok) throw await parseError(initRes);
    const uploadUrl = initRes.headers.get('x-goog-upload-url')
      || initRes.headers.get('X-Goog-Upload-URL');
    if (!uploadUrl) throw new GeminiError(0, 'Upload URL missing from initiate response.');

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'content-length': String(file.size),
        'x-goog-upload-offset': '0',
        'x-goog-upload-command': 'upload, finalize',
      },
      body: file,
    });
    if (!uploadRes.ok) throw await parseError(uploadRes);
    const json = await uploadRes.json();
    return json.file; // { name: "files/...", uri, mimeType, sizeBytes, state, ... }
  }

  async function deleteFile(fileName) {
    // fileName is like "files/abc-123"
    const res = await fetch(`${GEMINI_BASE}/${fileName}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    if (!res.ok && res.status !== 404) throw await parseError(res);
    return true;
  }

  async function generate({ contents, systemInstruction, responseSchema, maxOutputTokens = 32768, disableThinking = false }) {
    const generationConfig = { maxOutputTokens };
    if (responseSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = responseSchema;
    }
    if (disableThinking) {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }
    const body = { contents, generationConfig };
    if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };

    const res = await fetch(`${GEMINI_BASE}/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { ...authHeader(), 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await parseError(res);
    return res.json();
  }

  function extractText(resp) {
    const parts = resp?.candidates?.[0]?.content?.parts || [];
    return parts.map((p) => p.text || '').join('');
  }

  function extractJson(resp) {
    const finishReason = resp?.candidates?.[0]?.finishReason;
    const text = extractText(resp);
    if (!text) {
      throw new GeminiError(0, `Empty model response (finishReason: ${finishReason || 'unknown'}).`);
    }
    try { return JSON.parse(text); }
    catch (e) {
      const hint = finishReason === 'MAX_TOKENS'
        ? ' — output was truncated (hit max tokens). Try a longer chapter limit or fewer items.'
        : '';
      throw new GeminiError(0, `JSON parse failed (finishReason: ${finishReason}).${hint} Start: ${text.slice(0, 160)}`);
    }
  }

  async function ping() {
    return generate({
      contents: [{ role: 'user', parts: [{ text: 'ping' }] }],
      maxOutputTokens: 8,
    });
  }

  // -------------------------------------------------------------------------
  //  PIPELINE PROMPTS — keep in lockstep with GEMINI_PROMPTS.md.
  //  Every browser running this app (yours, your phone's, a contributor's)
  //  sends THESE EXACT strings to whatever Gemini key it holds, so output
  //  shape and quality stay consistent across users. If you tweak a prompt
  //  below, mirror the change in GEMINI_PROMPTS.md and bump ?v=N on app.js
  //  in index.html so contributors pull the new version.
  // -------------------------------------------------------------------------

  // ---- extraction ----
  const EXTRACTION_SCHEMA = {
    type: 'OBJECT',
    properties: {
      summary_sentences: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
      context_examples: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            topic: { type: 'STRING' },
            example: { type: 'STRING' },
          },
          required: ['topic', 'example'],
        },
      },
      key_terms: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            term: { type: 'STRING' },
            definition: { type: 'STRING' },
          },
          required: ['term', 'definition'],
        },
      },
    },
    required: ['summary_sentences', 'context_examples', 'key_terms'],
  };

  async function extractFromPdf(fileUri, mimeType, chapterLabel) {
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You extract MCAT study material from a chapter PDF for a question-generation pipeline. ' +
        'Be exhaustive in summary_sentences — these are the testable claims and become the basis of the quiz, ' +
        'taken from the end-of-chapter recap, key-takeaway boxes, or "concept summary" sections. ' +
        'context_examples are concrete illustrative scenarios, experiments, case studies, or worked examples from the body of the chapter (not summaries) — these inform question wording and distractor plausibility. ' +
        'key_terms are named terms, theories, models, researchers, or syndromes with one-sentence definitions for matching-style questions. ' +
        'Do not invent content not in the PDF.',
      contents: [{
        role: 'user',
        parts: [
          { fileData: { mimeType, fileUri } },
          { text: `Extract study material for: ${chapterLabel}. Aim for 25-50 summary_sentences, 10-25 context_examples, 15-40 key_terms.` },
        ],
      }],
      responseSchema: EXTRACTION_SCHEMA,
    });
    return extractJson(resp);
  }

  // ---- multiple choice generation ----
  const MC_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            choices: { type: 'ARRAY', items: { type: 'STRING' } },
            correct_index: { type: 'INTEGER' },
            explanation: { type: 'STRING' },
          },
          required: ['question', 'choices', 'correct_index', 'explanation'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateMCQuestions(fileUri, mimeType, extraction, chapterLabel, n = DEFAULT_MC_COUNT) {
    // PDF is optional — contributors without the PDF generate from extraction text alone.
    const parts = [];
    if (fileUri && mimeType) parts.push({ fileData: { mimeType, fileUri } });
    parts.push({ text:
      `Chapter: ${chapterLabel}\n\n` +
      `Extracted summary sentences and key terms:\n${JSON.stringify(extraction, null, 2).slice(0, 60000)}\n\n` +
      `Generate exactly ${n} MCAT-style multiple-choice questions covering the chapter.`,
    });
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You write high-quality MCAT-style multiple-choice questions from a chapter PDF and structured extraction. ' +
        'Every question must have exactly 4 choices, with `correct_index` (0-3) pointing to the correct one. ' +
        'Distractors must be plausible — pull from common misconceptions, related-but-wrong concepts, or other key_terms in the same chapter. ' +
        'Cover the chapter broadly across summary_sentences. ' +
        'Explanations are 1-2 sentences and justify the correct answer (and ideally why the most tempting distractor is wrong). ' +
        'Do not duplicate questions. Do not include questions whose answer is not directly supported by the chapter.\n\n' +
        'CORRECTNESS CHECK: Before finalizing, verify that the choice at correct_index is genuinely and unambiguously ' +
        'the best answer. If two choices could plausibly be correct, rewrite the stem to disambiguate or pick a different ' +
        'topic. All four choices should look similar in length and style so the correct answer does not stand out.',
      contents: [{ role: 'user', parts }],
      responseSchema: MC_SCHEMA,
    });
    const data = extractJson(resp);
    // Scan for formatting errors before tagging (see validateMCQuestions).
    const { questions } = validateMCQuestions(data.questions);
    return questions.map((q, i) => ({
      id: `mc_${Date.now()}_${i}`,
      mode: 'mc',
      ...q,
    }));
  }

  // ---- daily mini-exam generation ----
  // A fresh 15-question MCAT-style set written each day from the chapters the
  // student has already mastered. Every question is tagged with the subject +
  // chapter it was drawn from (and best-effort AAMC content category / SIRS skill)
  // so completed items can seed the proportional question bank later.
  const DAILY_EXAM_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            choices: { type: 'ARRAY', items: { type: 'STRING' } },
            correct_index: { type: 'INTEGER' },
            explanation: { type: 'STRING' },
            source_chapter: { type: 'INTEGER' },
            content_category: { type: 'STRING' },
            sirs_skill: { type: 'INTEGER' },
          },
          required: ['question', 'choices', 'correct_index', 'explanation', 'source_chapter'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateDailyExam(materials, n = 15) {
    // materials: [{ subject, chapter, extraction }] from the student's mastered chapters.
    const blocks = (materials || []).map((m, i) =>
      `### Chapter ${i + 1}: ${m.chapter}${m.subject ? ` (${m.subject})` : ''}\n` +
      `${JSON.stringify(m.extraction, null, 2).slice(0, 14000)}`
    ).join('\n\n');
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You write a daily MCAT-style mini-exam from the chapters a student has ALREADY MASTERED. ' +
        `Generate exactly ${n} discrete (standalone) multiple-choice questions, spread as evenly as ` +
        'possible across the supplied chapters so the set reviews the full breadth of what the student knows. ' +
        'Every question has exactly 4 choices with `correct_index` (0-3) pointing to the single best answer. ' +
        'These are genuine MCAT-style items: test application and reasoning, not bare recall — favour ' +
        '"why/how/predict/which-best-explains" stems over "what is the definition of" stems. ' +
        'Distractors must be plausible and functional: common misconceptions, right-concept-wrong-scope, ' +
        'reversed relationships, too-extreme statements, or correct-for-a-different-condition — never obviously ' +
        'wrong. All four choices match in length and register so the answer never stands out. ' +
        'TAGGING: set `source_chapter` to the NUMBER of the chapter block the question is drawn from — i.e. the ' +
        'integer N in the "### Chapter N:" header above the material you used. This MUST be accurate: a question ' +
        'must only test content found in that exact chapter block. Best-effort set `content_category` (the AAMC ' +
        'content category, e.g. "1A", "5E") and `sirs_skill` (1-4) when confident. ' +
        'Explanations are 1-2 sentences and justify the correct answer (and ideally why the most tempting ' +
        'distractor is wrong). Do not duplicate questions. Never ask anything not directly supported by the ' +
        'supplied chapter material.\n\n' +
        'CORRECTNESS CHECK: before finalizing, verify the choice at correct_index is unambiguously the best ' +
        'answer; if two choices could both be defended, rewrite the stem to disambiguate.',
      contents: [{
        role: 'user',
        parts: [{ text:
          `Mastered chapters (${(materials || []).length}):\n\n${blocks}\n\n` +
          `Write today's ${n}-question MCAT-style mini-exam, drawing proportionally across these chapters and ` +
          `setting each question's source_chapter to the "### Chapter N:" number it came from.`,
        }],
      }],
      responseSchema: DAILY_EXAM_SCHEMA,
    });
    const data = extractJson(resp);
    // Scan for formatting errors (wrong choice count, leaked field names like a 5th
    // "correct_index" choice, out-of-range correct_index, dupes) and drop bad items.
    const { questions } = validateMCQuestions(data.questions);
    // Don't trust the model to echo subject/chapter text — it drifts. Instead it tells
    // us which numbered chapter block each question came from, and we apply the
    // authoritative subject/chapter from our own materials list. Drop any question whose
    // source_chapter doesn't map to a supplied chapter.
    return questions.reduce((acc, q) => {
      const idx = Number(q.source_chapter) - 1;
      const src = materials[idx];
      if (!src) return acc; // hallucinated / out-of-range chapter → drop
      const { source_chapter, ...rest } = q;
      acc.push({
        id: `daily_${Date.now()}_${acc.length}`,
        mode: 'mc',
        ...rest,
        subject: src.subject || '',
        chapter: src.chapter || '',
      });
      return acc;
    }, []);
  }

  // ---- short answer generation ----
  const SHORT_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            prompt: { type: 'STRING' },
            ideal_answer: { type: 'STRING' },
            key_points: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['prompt', 'ideal_answer', 'key_points'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateShortAnswers(fileUri, mimeType, extraction, chapterLabel, n = DEFAULT_SHORT_COUNT) {
    const resp = await generate({
      maxOutputTokens: 16384,
      disableThinking: true,
      systemInstruction:
        'You write open-ended short-answer study prompts from a chapter PDF and structured extraction. ' +
        'Each prompt asks the student to explain or apply a concept in 2-4 sentences. ' +
        'ideal_answer is a model answer (2-4 sentences) suitable for self-evaluation. ' +
        'key_points is 3-6 short phrases that MUST appear (or be paraphrased) in a complete answer. ' +
        'Cover a range of high-yield topics — do not duplicate.',
      contents: [{
        role: 'user',
        parts: (() => {
          const p = [];
          if (fileUri && mimeType) p.push({ fileData: { mimeType, fileUri } });
          p.push({ text:
            `Chapter: ${chapterLabel}\n\n` +
            `Extracted material:\n${JSON.stringify(extraction, null, 2).slice(0, 60000)}\n\n` +
            `Generate exactly ${n} short-answer study prompts.`,
          });
          return p;
        })(),
      }],
      responseSchema: SHORT_SCHEMA,
    });
    const data = extractJson(resp);
    return (data.questions || []).map((q, i) => ({
      id: `sa_${Date.now()}_${i}`,
      mode: 'short',
      ...q,
    }));
  }

  // ---- term coverage MC ----
  // Generates one MC question PER key_term so the quiz covers every term in the chapter,
  // even terms the chapter didn't directly quiz. Distractors should be deliberately tricky —
  // drawn from common student confusions, sibling concepts, and adjacent topics, NOT just
  // other terms' literal definitions.
  async function generateTermQuestions(extraction, chapterLabel) {
    const terms = extraction?.key_terms || [];
    if (!terms.length) return [];

    const BATCH = 12;
    const all = [];
    for (let i = 0; i < terms.length; i += BATCH) {
      const batch = terms.slice(i, i + BATCH);
      const resp = await generate({
        maxOutputTokens: 16384,
        disableThinking: true,
        systemInstruction:
          'You write tough MCAT-style multiple-choice questions, one per assigned term. ' +
          'For each term, write a question testing understanding — definition, application, ' +
          'mechanism, recognition in a clinical/behavioral scenario, or distinguishing the term from a sibling concept. ' +
          'Vary phrasing across items; do NOT default to "What is the X?" — mix in scenarios, vignettes, "best example of", "most similar to", "which of the following would NOT". ' +
          'Exactly 4 choices, correct_index 0-3.\n\n' +
          'DISTRACTORS MUST BE GENUINELY HARD:\n' +
          '- Pull from commonly confused sibling concepts (e.g. for "generalization" use accommodation, assimilation, classical-vs-operant cousins).\n' +
          '- Pull from adjacent material in the broader MCAT corpus, not just this chapter — Piaget vs Vygotsky, Type I vs Type II errors, sympathetic vs parasympathetic, etc.\n' +
          '- Include at least one distractor that is technically true but does NOT answer the question.\n' +
          '- Avoid "obviously wrong" distractors (unrelated facts, gibberish, definitions of trivial items). Every distractor should make a half-prepared student hesitate.\n' +
          '- Don\'t pad with "all/none of the above" filler.\n\n' +
          'Explanations are 1-2 sentences and should briefly call out why the most tempting distractor is wrong.\n\n' +
          'CORRECTNESS CHECK: Before finalizing, verify that the choice at correct_index is genuinely and unambiguously ' +
          'the best answer. All four choices should look similar in length and style.',
        contents: [{
          role: 'user',
          parts: [{
            text:
              `Chapter: ${chapterLabel}\n\n` +
              `Assigned terms (write ONE question for each, in this order):\n` +
              batch.map((t, idx) => `${idx + 1}. ${t.term} — ${t.definition}`).join('\n') +
              `\n\nOther terms in the same chapter (fair game as distractor inspiration):\n` +
              terms.filter((_, idx) => idx < i || idx >= i + BATCH)
                .slice(0, 30)
                .map((t) => `- ${t.term}: ${t.definition}`).join('\n') +
              `\n\nReturn exactly ${batch.length} questions, in the same order as the assigned terms above.`,
          }],
        }],
        responseSchema: MC_SCHEMA,
      });
      const data = extractJson(resp);
      const qs = (data.questions || []).slice(0, batch.length);
      qs.forEach((q, idx) => {
        all.push({
          id: `term_${Date.now()}_${i + idx}`,
          mode: 'mc',
          from: 'term',
          term: batch[idx].term,
          ...q,
        });
      });
    }
    return all;
  }

  // ---- two-part MC ----
  // Each item presents two sequential mini-MCs on related-but-distinct concepts that
  // students commonly confuse. Each part is scored independently.
  const TWO_PART_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            theme: { type: 'STRING' },
            parts: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  question: { type: 'STRING' },
                  choices: { type: 'ARRAY', items: { type: 'STRING' } },
                  correct_index: { type: 'INTEGER' },
                  explanation: { type: 'STRING' },
                },
                required: ['question', 'choices', 'correct_index', 'explanation'],
              },
            },
          },
          required: ['theme', 'parts'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateTwoPartQuestions(extraction, chapterLabel, n = 6) {
    if (!extraction?.key_terms?.length) return [];
    const resp = await generate({
      maxOutputTokens: 16384,
      disableThinking: true,
      systemInstruction:
        'You design "two-part" MCAT-style multiple choice items. Each item has exactly TWO MC parts on RELATED-BUT-DIFFERENT concepts that students commonly confuse. ' +
        'Example shape: Part 1 presents a brief scenario or stem and asks "this illustrates _____" (correct: generalization). ' +
        'Part 2 then asks a definitional or application question on a sibling concept (correct: accommodation to a schema). ' +
        'The two parts share a "theme" (the broader area the student must navigate) but probe DISTINCT concepts so a student who has them blurred together will miss one. ' +
        'Each part has exactly 4 choices, correct_index 0-3, and a 1-2 sentence explanation. ' +
        'Distractors should be tough — sibling concepts, near-misses, things the student would plausibly pick if they\'re half-prepared. ' +
        'Avoid trivial filler distractors. All four choices should be roughly the same length and style.\n\n' +
        'CORRECTNESS CHECK: verify correct_index points to the genuinely best answer before returning.',
      contents: [{
        role: 'user',
        parts: [{
          text:
            `Chapter: ${chapterLabel}\n\n` +
            `Key terms in this chapter (use as raw material for concept pairs that are commonly confused):\n` +
            (extraction.key_terms || []).slice(0, 40).map((t) => `- ${t.term}: ${t.definition}`).join('\n') +
            `\n\nGenerate exactly ${n} two-part items. Pick term pairs that students actually confuse (different theories explaining the same phenomenon, different stages of the same process, parallel mechanisms with subtle differences). ` +
            `Each "parts" array must have exactly 2 entries.`,
        }],
      }],
      responseSchema: TWO_PART_SCHEMA,
    });
    const data = extractJson(resp);
    return (data.questions || []).map((q, i) => ({
      id: `tp_${Date.now()}_${i}`,
      mode: 'two_part',
      ...q,
    }));
  }

  // ---- flag fix: take a user's flag description and produce an updated question ----
  // Shared formatting rule appended to every fix prompt.
  const FIX_FORMAT_RULES =
    'FORMATTING RULES: Each answer choice must contain ONLY the answer text — never prefix a ' +
    'choice with "A.", "B.", "C.", "D.", "(A)", or any letter label. Use proper typographic ' +
    'characters (a real em-dash —, real quotes); NEVER output literal escape sequences such as ' +
    '\\u2014, \\u2019, \\n, or HTML entities. Fix any such artifacts you see in the original.';

  const FIX_SCHEMA = {
    type: 'OBJECT',
    properties: {
      action: { type: 'STRING' }, // 'edit' | 'skip' (no delete — every question must stay)
      question: { type: 'STRING' },
      choices: { type: 'ARRAY', items: { type: 'STRING' } },
      correct_index: { type: 'INTEGER' },
      explanation: { type: 'STRING' },
      rationale: { type: 'STRING' },
    },
    required: ['action', 'rationale'],
  };

  const TWO_PART_FIX_SCHEMA = {
    type: 'OBJECT',
    properties: {
      action: { type: 'STRING' }, // 'edit' | 'skip'
      theme: { type: 'STRING' },
      parts: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            choices: { type: 'ARRAY', items: { type: 'STRING' } },
            correct_index: { type: 'INTEGER' },
            explanation: { type: 'STRING' },
          },
          required: ['question', 'choices', 'correct_index', 'explanation'],
        },
      },
      rationale: { type: 'STRING' },
    },
    required: ['action', 'rationale'],
  };

  // Grade a free-form short-answer response against the chapter's ideal
  // answer and key points. Returns { passes, score (0-100), feedback,
  // hit_points, missed_points }. Used by ShortAnswerQuestion to auto-grade
  // — the user can still override via the manual Got it / Missed it
  // buttons, since Gemini occasionally over- or under-credits.
  async function gradeShortAnswer({ prompt, ideal_answer, key_points, user_answer, chapter }) {
    const expected = (key_points || []).filter(Boolean);
    const expectedBlock = expected.length
      ? `Key points the answer should cover:\n${expected.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
      : '';
    const sys = (
      'You grade short-answer MCAT-style responses. Decide whether the user\'s answer is good enough to earn FULL credit.\n' +
      'Be moderately strict but charitable: accept paraphrased wording, partial reasoning that gets the key concepts right, and answers shorter than the ideal as long as the essential ideas are clearly present. Reject answers that miss a core concept, contradict the science, or are off-topic.\n' +
      'Return strict JSON conforming to the provided schema. Do not include any prose outside the JSON.'
    );
    const userText = [
      chapter ? `Chapter context: ${chapter}` : '',
      `Question: ${prompt || '(no prompt)'}`,
      `Ideal answer: ${ideal_answer || '(none provided)'}`,
      expectedBlock,
      `User's answer:\n${user_answer || '(blank)'}`,
      '',
      'Decide whether the user\'s answer should earn full credit.',
    ].filter(Boolean).join('\n\n');
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        passes:        { type: 'BOOLEAN' },
        score:         { type: 'INTEGER' }, // 0..100, rough confidence in pass
        feedback:      { type: 'STRING' },  // 1-2 sentences, what was right / wrong
        hit_points:    { type: 'ARRAY', items: { type: 'INTEGER' } }, // 1-based indices of key_points the user hit
        missed_points: { type: 'ARRAY', items: { type: 'INTEGER' } }, // 1-based indices of key_points the user missed
      },
      required: ['passes', 'score', 'feedback'],
    };
    const resp = await generate({
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      systemInstruction: sys,
      responseSchema,
      maxOutputTokens: 2048,
      disableThinking: true,
    });
    return extractJson(resp);
  }

  async function fixFlaggedQuestion({ question, flagDescription, chapterContext }) {
    const letters = ['A', 'B', 'C', 'D'];

    // ---- two-part item ----
    if (Array.isArray(question?.parts)) {
      const partsText = question.parts.map((p, pi) => (
        `Part ${pi + 1}:\n` +
        `  Stem: ${p.question || '(no stem)'}\n` +
        (p.choices || []).map((c, i) => `  ${letters[i]}. ${c}`).join('\n') +
        `\n  Current correct: ${letters[p.correct_index] || '?'} (index ${p.correct_index})\n` +
        `  Explanation: ${p.explanation || '(none)'}`
      )).join('\n\n');
      const resp = await generate({
        maxOutputTokens: 4096,
        disableThinking: true,
        systemInstruction:
          'You are a meticulous MCAT question editor. A user has flagged a TWO-PART multiple-choice ' +
          'item (a theme plus exactly 2 sub-questions, each with 4 choices). Apply the smallest fix that ' +
          'addresses their description. Set action to "edit" and return the theme plus both corrected ' +
          'parts (each: stem, 4 choices, correct_index 0-3, 1-2 sentence explanation). NEVER delete the ' +
          'item. If the flag describes no real problem, set action to "skip". Always give a short ' +
          'rationale. ' + FIX_FORMAT_RULES,
        contents: [{ role: 'user', parts: [{ text:
          `Chapter: ${chapterContext || '(unknown)'}\n\n` +
          `--- Flagged two-part item ---\nTheme: ${question.theme || '(none)'}\n\n${partsText}\n\n` +
          `--- User's flag ---\n${flagDescription}\n\n` +
          `Decide on action ("edit" or "skip" only) and return the corrected item if editing.`,
        }] }],
        responseSchema: TWO_PART_FIX_SCHEMA,
      });
      const out = extractJson(resp);
      out.two_part = true;
      return out;
    }

    // ---- single MC question ----
    const stem = question.question || '(no stem)';
    const choices = (question.choices || []).map((c, i) => `${letters[i]}. ${c}`).join('\n');
    const currentCorrect = letters[question.correct_index] || '?';
    const resp = await generate({
      maxOutputTokens: 4096,
      disableThinking: true,
      systemInstruction:
        'You are a meticulous MCAT question editor. A user has flagged an MC question as having a problem. ' +
        'Read their description carefully and apply the smallest fix that addresses it. ' +
        'Set action to "edit" and return the full corrected question (stem, all four choices, the corrected ' +
        'correct_index, and a 1-2 sentence explanation). ' +
        'NEVER delete questions — every question must be preserved (especially term-coverage questions). ' +
        'If the flag does not describe a real problem, set action to "skip". ' +
        'If a question seems irredeemable, still edit it into something usable rather than deleting. ' +
        'Always provide a short rationale. ' + FIX_FORMAT_RULES,
      contents: [{ role: 'user', parts: [{ text:
        `Chapter: ${chapterContext || '(unknown)'}\n\n` +
        `--- Flagged question ---\n` +
        `Stem: ${stem}\n${choices}\n` +
        `Current correct: ${currentCorrect} (index ${question.correct_index})\n` +
        `Current explanation: ${question.explanation || '(none)'}\n\n` +
        `--- User's flag ---\n${flagDescription}\n\n` +
        `Decide on action ("edit" or "skip" only — never delete) and return the full corrected question if editing.`,
      }] }],
      responseSchema: FIX_SCHEMA,
    });
    return extractJson(resp);
  }

  // ---- audit: batch correctness check via Gemini ----
  const AUDIT_SCHEMA = {
    type: 'OBJECT',
    properties: {
      results: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            index: { type: 'INTEGER' },
            correct: { type: 'BOOLEAN' },
            suggested_index: { type: 'INTEGER' },
            reason: { type: 'STRING' },
          },
          required: ['index', 'correct', 'suggested_index', 'reason'],
        },
      },
    },
    required: ['results'],
  };

  async function auditQuestions(questions) {
    const BATCH = 8;
    const all = [];
    for (let i = 0; i < questions.length; i += BATCH) {
      const batch = questions.slice(i, i + BATCH);
      const listing = batch.map((q, idx) => {
        const letter = ['A', 'B', 'C', 'D'][q.correct_index] || '?';
        return `--- Question ${i + idx + 1} ---\n` +
          `Stem: ${q.question}\n` +
          `A. ${q.choices[0]}\nB. ${q.choices[1]}\nC. ${q.choices[2]}\nD. ${q.choices[3]}\n` +
          `Claimed correct: ${letter} (index ${q.correct_index})\n` +
          `Explanation: ${q.explanation}`;
      }).join('\n\n');
      const resp = await generate({
        maxOutputTokens: 8192,
        disableThinking: true,
        systemInstruction:
          'You are a meticulous MCAT question reviewer. For each question, evaluate whether the choice at correct_index ' +
          'is genuinely and unambiguously the best answer. Consider whether the stem is clear, whether any distractor ' +
          'could also be correct, and whether the explanation matches the indicated answer. ' +
          'Return one result per question in the same order. NEVER suggest deletion — at worst suggest a different ' +
          'correct_index, since every question must be preserved.',
        contents: [{ role: 'user', parts: [{ text:
          `Review these ${batch.length} MC questions. For each, say whether the claimed correct answer is actually correct.\n\n${listing}`,
        }] }],
        responseSchema: AUDIT_SCHEMA,
      });
      const data = extractJson(resp);
      (data.results || []).forEach((r, idx) => {
        all.push({ ...r, index: i + idx });
      });
    }
    return all;
  }

  // ---- daily CARS generation ----
  // See CARS_GENERATION.md — single source of truth for these instructions.
  const CARS_SCHEMA = {
    type: 'OBJECT',
    properties: {
      passage: { type: 'STRING' },
      discipline: { type: 'STRING' },
      title: { type: 'STRING' },
      source: { type: 'STRING' },
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            choices: { type: 'ARRAY', items: { type: 'STRING' } },
            correct_index: { type: 'INTEGER' },
            category: { type: 'STRING' },
            subtype: { type: 'STRING' },
            explanation: { type: 'STRING' },
            choice_explanations: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['question', 'choices', 'correct_index', 'category', 'subtype', 'explanation', 'choice_explanations'],
        },
      },
    },
    required: ['passage', 'discipline', 'title', 'questions'],
  };

  async function generateDailyCars(discipline) {
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You write original MCAT CARS (Critical Analysis and Reasoning Skills) practice sets — ' +
        'one academic passage plus six multiple-choice questions — for a study app. The passages are ' +
        'humanities or social-science prose, 500-600 words, built around a single arguable thesis with ' +
        'real nuance (a concession, a fine distinction, a tonal shift). Never copy existing text; write ' +
        'original prose. Questions test analysis of the passage only, never outside knowledge. Generate ' +
        'exactly 6 questions covering all three AAMC categories (Foundations of Comprehension, Reasoning ' +
        'Within the Text, Reasoning Beyond the Text), each with exactly 4 choices and a correct_index 0-3. ' +
        'THESE MUST BE HARDER THAN THE REAL MCAT: distractors must be technically-true-but-unresponsive, ' +
        'right-concept-wrong-scope, reversed relationships, too-extreme, or correct-for-the-wrong-paragraph ' +
        '— never obviously wrong. All four choices must match in length and register so the answer never ' +
        'stands out. At least two questions must require combining two or more paragraphs. Include at ' +
        'least one LEAST-supported / EXCEPT-style question. For every question give a 2-4 sentence ' +
        'explanation and a one-line rationale for each of the four choices (choice_explanations, 4 entries).',
      contents: [{
        role: 'user',
        parts: [{ text:
          `Generate today's CARS set. Target discipline: ${discipline}. Write the passage, then six ` +
          `questions per the rules. Make it harder than a real MCAT CARS section — a strong student ` +
          `should expect to miss one or two.`,
        }],
      }],
      responseSchema: CARS_SCHEMA,
    });
    const data = extractJson(resp);
    // Tag questions with ids + a stable mode for the quiz runner.
    data.questions = (data.questions || []).map((q, i) => ({
      id: `cars_${Date.now()}_${i}`,
      mode: 'mc',
      ...q,
    }));
    return data;
  }

  // ---- CARS questions from a supplied (real, public-domain) passage ----
  const CARS_QUESTIONS_SCHEMA = {
    type: 'OBJECT',
    properties: {
      questions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            choices: { type: 'ARRAY', items: { type: 'STRING' } },
            correct_index: { type: 'INTEGER' },
            category: { type: 'STRING' },
            subtype: { type: 'STRING' },
            explanation: { type: 'STRING' },
            choice_explanations: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['question', 'choices', 'correct_index', 'category', 'subtype', 'explanation', 'choice_explanations'],
        },
      },
    },
    required: ['questions'],
  };

  async function generateCarsQuestions(passage, discipline) {
    const resp = await generate({
      maxOutputTokens: 32768,
      disableThinking: true,
      systemInstruction:
        'You write MCAT CARS (Critical Analysis and Reasoning Skills) questions for a study app. ' +
        'You are given a REAL public-domain passage of difficult humanities or social-science prose. ' +
        'Do NOT rewrite, summarize, or replace the passage — write questions about it exactly as given. ' +
        'Generate exactly 6 multiple-choice questions covering all three AAMC categories (Foundations of ' +
        'Comprehension, Reasoning Within the Text, Reasoning Beyond the Text), each with exactly 4 choices ' +
        'and a correct_index 0-3, testing analysis of THIS passage only — never outside knowledge. ' +
        'THESE MUST BE HARDER THAN THE REAL MCAT: distractors must be technically-true-but-unresponsive, ' +
        'right-concept-wrong-scope, reversed relationships, too-extreme, or correct-for-the-wrong-paragraph ' +
        '— never obviously wrong. All four choices must match in length and register so the answer never ' +
        'stands out. At least two questions must require combining two or more paragraphs. Include at ' +
        'least one LEAST-supported / EXCEPT-style question. For every question give a 2-4 sentence ' +
        'explanation and a one-line rationale for each of the four choices (choice_explanations, 4 entries).',
      contents: [{
        role: 'user',
        parts: [{ text:
          `Discipline: ${discipline}\n\n` +
          `Passage (real public-domain text — do not alter it):\n${passage}\n\n` +
          `Write exactly 6 CARS questions on this passage, harder than a real MCAT CARS section — a strong ` +
          `student should expect to miss one or two.`,
        }],
      }],
      responseSchema: CARS_QUESTIONS_SCHEMA,
    });
    const data = extractJson(resp);
    return (data.questions || []).map((q, i) => ({
      id: `cars_${Date.now()}_${i}`,
      mode: 'mc',
      ...q,
    }));
  }

  // ---- daily Connections generation ----
  // 16 MCAT terms grouped into 4 themed categories of 4. Difficulty is colour-coded
  // green (easiest), yellow, blue, purple (hardest) — matches NYT Connections.
  const CONNECTIONS_SCHEMA = {
    type: 'OBJECT',
    properties: {
      title: { type: 'STRING' },
      groups: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING' },
            difficulty: { type: 'STRING' }, // "green" | "yellow" | "blue" | "purple"
            terms: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['category', 'difficulty', 'terms'],
        },
      },
    },
    required: ['title', 'groups'],
  };

  async function generateDailyConnections(termPool, dateStr) {
    // termPool: [{ term, subject, chapter, definition }] across all chapters.
    // Send a compact representation to keep the prompt small.
    const lines = termPool.map((t) =>
      `- ${t.term}${t.subject ? ` [${t.subject}]` : ''}${t.definition ? `: ${t.definition.slice(0, 140)}` : ''}`
    );
    const resp = await generate({
      maxOutputTokens: 8192,
      disableThinking: true,
      systemInstruction:
        'You design daily "Connections" puzzles (NYT-style) for an MCAT study app. A puzzle is exactly 16 MCAT ' +
        'terms drawn from the supplied pool, grouped into 4 categories of 4 terms each. Every category is a ' +
        'genuine, defensible MCAT-relevant connection (a shared mechanism, anatomical system, hormone family, ' +
        'cognitive bias family, amino-acid class, neurotransmitter system, lab technique, error type, etc.) — ' +
        'not a superficial word-game connection. The four difficulty tiers form a deliberate ABSTRACTION RAMP: ' +
        'the conceptual link binding the four terms must get progressively more abstract, indirect, and ' +
        'non-obvious from green to purple. Abstraction must increase monotonically green < yellow < blue < ' +
        'purple — never make yellow as easy as green, or blue as easy as yellow.\n' +
        '  • green  — easiest: a concrete, surface-level shared category a first-year student spots instantly ' +
        '(e.g. "steroid hormones", "bones of the forearm"). The link is literal and definitional.\n' +
        '  • yellow — harder: a clear single-discipline category that requires recalling each term\'s actual ' +
        'definition, not just its name. More demanding than green but still concrete.\n' +
        '  • blue   — harder still: a subtle, usually cross-disciplinary link where the shared thread is a ' +
        'mechanism, functional role, or shared consequence rather than a textbook heading. Solving it takes a ' +
        'genuine conceptual leap, not just recall.\n' +
        '  • purple — hardest: a highly abstract, non-obvious link — the four terms share an underlying ' +
        'principle, analogy, or second-order property that only clicks after real lateral thinking. The ' +
        'connection should feel surprising yet defensible once seen. Deliberately include terms that LOOK like ' +
        'they belong in the green/yellow/blue groups (red herrings). This is the heart of the puzzle.\n' +
        'Hard constraints: each term must appear in exactly ONE group; the 16 chosen terms must all come from ' +
        'the supplied pool (use the term name EXACTLY as given); never invent terms; never use the same term ' +
        'twice. Category labels are short noun phrases (≤ 60 chars). Set `difficulty` to one of green/yellow/' +
        'blue/purple. Pick a varied mix of subjects (not all bio, not all psych). Make at least one purple ' +
        'category that genuinely requires lateral thinking — that is the heart of a good Connections puzzle.',
      contents: [{
        role: 'user',
        parts: [{ text:
          `Generate today's MCAT Connections puzzle (date: ${dateStr}). Choose 16 terms from this pool of ` +
          `${termPool.length} terms and group them into 4 categories of 4 with green/yellow/blue/purple ` +
          `difficulty. Return a short overall title for the puzzle.\n\n` +
          `Term pool:\n${lines.join('\n')}`,
        }],
      }],
      responseSchema: CONNECTIONS_SCHEMA,
    });
    return extractJson(resp);
  }

  async function generateConnectionExplanation(category, terms) {
    const resp = await generate({
      contents: [{
        role: 'user',
        parts: [{ text:
          `In two to four sentences, explain how these four MCAT terms are connected under the category "${category}":\n` +
          `- ${terms.join('\n- ')}\n\n` +
          `Write for a pre-med student studying for the MCAT. Focus on what binds them together conceptually. ` +
          `No bullet points, no headers, no markdown — just plain prose.`,
        }],
      }],
      maxOutputTokens: 400,
    });
    return extractText(resp).trim();
  }

  async function generateTermDefinition(term, context) {
    const resp = await generate({
      contents: [{
        role: 'user',
        parts: [{ text:
          `Define the MCAT term "${term}"${context ? ` (context: ${context})` : ''} in one short, plain-prose sentence ` +
          `aimed at a pre-med student. No markdown, no headers, no list formatting.`,
        }],
      }],
      maxOutputTokens: 220,
    });
    return extractText(resp).trim();
  }

  return {
    uploadFile, deleteFile, generate, ping,
    extractFromPdf, generateMCQuestions, generateShortAnswers, generateTermQuestions, generateTwoPartQuestions,
    fixFlaggedQuestion, auditQuestions, generateDailyCars, generateCarsQuestions, generateDailyExam,
    generateDailyConnections, generateConnectionExplanation, generateTermDefinition,
    gradeShortAnswer,
  };
}

// ---------- backend api client ----------
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function makeApiClient(getToken) {
  async function call(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (auth) {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      headers['Authorization'] = `Bearer ${t}`;
    }
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) throw new ApiError(res.status, data?.error || res.statusText || `HTTP ${res.status}`);
    return data;
  }
  return {
    signup: ({ username, pin }) => call('/signup', { method: 'POST', body: { username, pin } }),
    login: ({ username, pin }) => call('/login', { method: 'POST', body: { username, pin } }),
    logout: () => call('/logout', { method: 'POST', auth: true }),
    me: () => call('/me', { auth: true }),
    ping: () => call('/ping', { method: 'POST', auth: true }),
    postAttempts: (attempts) => call('/attempts', { method: 'POST', body: { attempts }, auth: true }),
    getAttempts: () => call('/attempts', { auth: true }),
    deleteAttempts: ({ file_id, chapter, subject, ts_gte, ts_lt, all } = {}) =>
      call('/attempts', { method: 'DELETE', body: { file_id, chapter, subject, ts_gte, ts_lt, all }, auth: true }),
    meStats: () => call('/me/stats', { auth: true }),
    leaderboard: () => call('/leaderboard'),
    activity: () => call('/activity'),

    // ---- daily CARS ----
    listCars: () => call('/cars'),
    getCars: (date) => call(`/cars/${encodeURIComponent(date)}`),
    getCarsPassage: (date) => call(`/cars/passage?date=${encodeURIComponent(date)}`),
    postCars: ({ date, discipline, title, payload }) =>
      call('/cars', { method: 'POST', body: { date, discipline, title, payload }, auth: true }),

    // ---- daily Connections ----
    listConnections: () => call('/connections'),
    getConnections: (date) => call(`/connections/${encodeURIComponent(date)}`),
    postConnections: ({ date, title, payload }) =>
      call('/connections', { method: 'POST', body: { date, title, payload }, auth: true }),

    userProfile: (username) => call(`/u/${encodeURIComponent(username)}`),

    // Bank publish + pull. body for putBank is the raw JSON string of the bank.
    putBank: async (bankJson) => {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      const res = await fetch(`${API_BASE}/bank`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: bankJson,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiError(res.status, data?.error || `HTTP ${res.status}`);
      return data;
    },
    getMyBank: () => call('/bank', { auth: true }),
    getUserBank: (username) => call(`/bank/${encodeURIComponent(username)}`),

    // ---- per-user synced state (progress + settings) ----
    getState: () => call('/state', { auth: true }),
    putState: (state) => call('/state', { method: 'PUT', body: state, auth: true }),
    bankMeta: (username) => call(`/bank/${encodeURIComponent(username)}/meta`),
    deleteMyBank: () => call('/bank', { method: 'DELETE', auth: true }),
    listBanks: () => call('/banks'),

    // ---- shared exam bank (keyed by section/subject/chapter) ----
    postExamBank: (questions) => call('/exam-bank', { method: 'POST', body: { questions }, auth: true }),
    examBankStats: () => call('/exam-bank'),
    examBankQuestions: ({ section, subject, chapter, limit } = {}) => {
      const p = new URLSearchParams();
      if (section) p.set('section', section);
      if (subject) p.set('subject', subject);
      if (chapter) p.set('chapter', chapter);
      if (limit) p.set('limit', String(limit));
      const qs = p.toString();
      return call(`/exam-bank/questions${qs ? `?${qs}` : ''}`);
    },

    // ---- collaborative chapters ----
    listChapters: () => call('/chapters'),
    getChapter: (id) => call(`/chapters/${encodeURIComponent(id)}`),
    createChapter: ({ subject, title, filename, size_bytes }) =>
      call('/chapters', { method: 'POST', body: { subject, title, filename, size_bytes }, auth: true }),
    deleteChapter: (id) => call(`/chapters/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
    putChapterStage: async (id, stage, payload) => {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const res = await fetch(`${API_BASE}/chapters/${encodeURIComponent(id)}/stage/${encodeURIComponent(stage)}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiError(res.status, data?.error || `HTTP ${res.status}`);
      return data;
    },
    addChapterFlag: (id, { question_id, description }) =>
      call(`/chapters/${encodeURIComponent(id)}/flags`, { method: 'POST', body: { question_id, description }, auth: true }),
    setChapterFlags: async (id, flags) => {
      const t = getToken();
      if (!t) throw new ApiError(401, 'not signed in');
      const res = await fetch(`${API_BASE}/chapters/${encodeURIComponent(id)}/flags`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(flags),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new ApiError(res.status, data?.error || `HTTP ${res.status}`);
      return data;
    },
  };
}

// Hard-reload that defeats browser cache by adding a fresh query param
// and clearing any registered Cache Storage entries (PWA service workers).
async function forceUpdateApp() {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set('_t', Date.now().toString());
  window.location.replace(url.toString());
}

// ---------- app context ----------
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function AppProvider({ children }) {
  const [apiKey, setApiKeyState] = useState(() => storage.get(KEYS.apiKey, ''));
  const [files, setFilesState] = useState(() => storage.get(KEYS.files, []));
  const [extractions, setExtractionsState] = useState(() => storage.get(KEYS.extractions, {}));
  const [questions, setQuestionsState] = useState(() => storage.get(KEYS.questions, {}));
  const [attempts, setAttemptsState] = useState(() => storage.get(KEYS.attempts, []));
  const [staticBank, setStaticBank] = useState(null); // { files, extractions, questions } or null
  const [readOnly, setReadOnly] = useState(false);
  const [themePref, setThemePref] = useState(() => parseStoredTheme());
  const { palette, mode } = themePref;
  const setPalette = useCallback((p) => {
    if (!PALETTES.includes(p)) return;
    setThemePref((prev) => {
      const next = { ...prev, palette: p };
      storage.set(KEYS.theme, next);
      return next;
    });
  }, []);
  const setMode = useCallback((m) => {
    if (!MODES.includes(m)) return;
    setThemePref((prev) => {
      const next = { ...prev, mode: m };
      storage.set(KEYS.theme, next);
      return next;
    });
  }, []);
  const [github, setGithubState] = useState(() => ({ ...DEFAULT_GITHUB, ...(storage.get(KEYS.github, {}) || {}) }));
  const [pushStatus, setPushStatus] = useState({ state: 'idle', lastAt: null, error: null });
  const [reauditEnabled, setReauditEnabledState] = useState(() => !!storage.get(KEYS.reaudit, false));
  const setReauditEnabled = useCallback((v) => {
    storage.set(KEYS.reaudit, !!v);
    setReauditEnabledState(!!v);
  }, []);
  const [autoDownloadChapters, setAutoDownloadChaptersState] = useState(() => !!storage.get(KEYS.autoDownload, false));
  const setAutoDownloadChapters = useCallback((v) => {
    storage.set(KEYS.autoDownload, !!v);
    setAutoDownloadChaptersState(!!v);
  }, []);
  const [autoDownloadAll, setAutoDownloadAllState] = useState(() => !!storage.get(KEYS.autoDownloadAll, false));
  const setAutoDownloadAll = useCallback((v) => {
    storage.set(KEYS.autoDownloadAll, !!v);
    setAutoDownloadAllState(!!v);
  }, []);
  const [contributorMode, setContributorModeState] = useState(() => !!storage.get(KEYS.contributorMode, false));
  const setContributorMode = useCallback((v) => {
    storage.set(KEYS.contributorMode, !!v);
    setContributorModeState(!!v);
  }, []);
  const [tropicalBg, setTropicalBgState] = useState(() => !!storage.get(KEYS.tropicalBg, false));
  const setTropicalBg = useCallback((v) => {
    storage.set(KEYS.tropicalBg, !!v);
    setTropicalBgState(!!v);
  }, []);
  // 0..100 % blur over the dynamic background canvas. 100% maps to a 32px blur.
  const [bgBlur, setBgBlurState] = useState(() => {
    const v = storage.get(KEYS.bgBlur, 0);
    return typeof v === 'number' && v >= 0 && v <= 100 ? v : 0;
  });
  const setBgBlur = useCallback((v) => {
    const clamped = Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
    storage.set(KEYS.bgBlur, clamped);
    setBgBlurState(clamped);
  }, []);
  // Master switch for the redesigned UI. Off = the app renders exactly as before.
  const [experimentalUI, setExperimentalUIState] = useState(() => !!storage.get(KEYS.experimentalUI, false));
  const setExperimentalUI = useCallback((v) => {
    storage.set(KEYS.experimentalUI, !!v);
    setExperimentalUIState(!!v);
  }, []);
  // Liquid-glass skin. Only has any effect while experimentalUI is on.
  const [glass, setGlassState] = useState(() => !!storage.get(KEYS.glass, false));
  const setGlass = useCallback((v) => {
    storage.set(KEYS.glass, !!v);
    setGlassState(!!v);
  }, []);
  const [volume, setVolumeState] = useState(() => {
    const v = storage.get(KEYS.volume, 1);
    return typeof v === 'number' && v >= 0 && v <= 1 ? v : 1;
  });
  const setVolume = useCallback((v) => {
    const clamped = Math.min(1, Math.max(0, Number(v) || 0));
    storage.set(KEYS.volume, clamped);
    setVolumeState(clamped);
  }, []);

  const setGithub = useCallback((patch) => {
    setGithubState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      storage.set(KEYS.github, next);
      return next;
    });
  }, []);

  const pushBank = useCallback(async () => {
    setPushStatus({ state: 'pushing', lastAt: null, error: null });
    try {
      const cur = {
        files: storage.get(KEYS.files, []),
        extractions: storage.get(KEYS.extractions, {}),
        questions: storage.get(KEYS.questions, {}),
      };
      await pushBankToGithub(github, cur);
      setPushStatus({ state: 'idle', lastAt: Date.now(), error: null });
      return true;
    } catch (e) {
      setPushStatus({ state: 'error', lastAt: null, error: e.message });
      return false;
    }
  }, [github]);

  useEffect(() => {
    const apply = () => {
      const resolved = dataThemeFor(palette, mode);
      document.documentElement.setAttribute('data-theme', resolved);
      updateFavicon(resolved);
    };
    apply();
    // When following the OS, re-apply if the user flips their system light/dark.
    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => apply();
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, [palette, mode]);

  // Experimental UI: gate all redesigned visuals behind data-exp / data-glass on <html>.
  // When off, the attributes are absent so none of the experimental CSS can match.
  useEffect(() => {
    const root = document.documentElement;
    if (experimentalUI) root.setAttribute('data-exp', 'on');
    else root.removeAttribute('data-exp');
    if (experimentalUI && glass) root.setAttribute('data-glass', 'on');
    else root.removeAttribute('data-glass');
  }, [experimentalUI, glass]);

  // Dynamic background: animated fixed DOM layer behind #root.
  // Re-runs whenever the toggle, palette, or mode changes so the gradient
  // updates live. The cleanup fn tears down the DOM node + scroll listener.
  useEffect(() => {
    const isDark = dataThemeFor(palette, mode).startsWith('dark');
    if (tropicalBg) {
      applyDynamicBg(palette, isDark);
    } else {
      stopDynamicBg();
    }
    return stopDynamicBg;
  }, [tropicalBg, palette, mode]);

  // Live-apply the blur slider to whichever canvas is currently mounted.
  useEffect(() => {
    const el = document.getElementById('mc-dyn-bg');
    if (!el) return;
    el.style.filter = bgBlur > 0 ? `blur(${(bgBlur / 100) * 32}px)` : '';
  }, [bgBlur, tropicalBg, palette, mode]);

  // One-time cleanup: drop the temporary drag-position key now that the bird
  // is anchored to the speech bubble's bottom.
  useEffect(() => { try { localStorage.removeItem('mcat:birdPos'); } catch {} }, []);

  // On boot: try to fetch a static data.json next to index.html.
  // If present, expose it on context. The user can enter "shared bank" mode
  // from the key gate, or local state already wins if they've processed chapters.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('./data.json', { cache: 'no-store' });
        if (!res.ok) return;
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('json')) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.files && data?.questions) {
          setStaticBank({
            files: data.files,
            extractions: data.extractions || {},
            questions: data.questions || {},
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const useStaticBank = useCallback(() => {
    if (!staticBank) return;
    setFilesState(staticBank.files);
    setExtractionsState(staticBank.extractions);
    setQuestionsState(staticBank.questions);
    storage.set(KEYS.files, staticBank.files);
    storage.set(KEYS.extractions, staticBank.extractions);
    storage.set(KEYS.questions, staticBank.questions);
    setReadOnly(true);
  }, [staticBank]);

  const setApiKey = useCallback((k) => {
    if (k) storage.set(KEYS.apiKey, k); else storage.remove(KEYS.apiKey);
    setApiKeyState(k || '');
  }, []);

  const setFiles = useCallback((updater) => {
    setFilesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      storage.set(KEYS.files, next);
      return next;
    });
  }, []);

  const setExtraction = useCallback((fileId, data) => {
    setExtractionsState((prev) => {
      const next = { ...prev };
      if (data === undefined) delete next[fileId]; else next[fileId] = data;
      storage.set(KEYS.extractions, next);
      return next;
    });
  }, []);

  const setQuestionsFor = useCallback((fileId, data) => {
    setQuestionsState((prev) => {
      const next = { ...prev };
      if (data === undefined) delete next[fileId]; else next[fileId] = data;
      storage.set(KEYS.questions, next);
      return next;
    });
  }, []);

  const addAttempt = useCallback((a) => {
    // client_id is a stable, client-generated UUID per attempt. The server
    // INSERTs OR REPLACEs on (user_id, client_id), so a retried sync after
    // a network blip can't double-count, and an explicit re-send of the
    // same client_id with a corrected `correct` flag overwrites the prior
    // row (used by the short-answer Override button).
    const cid =
      (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    const stamped = { ...a, ts: Date.now(), client_id: a.client_id || cid };
    setAttemptsState((prev) => {
      const next = [...prev, stamped];
      storage.set(KEYS.attempts, next);
      return next;
    });
  }, []);

  // Patch the most recent attempt for a given question_id. Used by the
  // short-answer Override flow when the user disagrees with the Gemini
  // grade. Marks the row un-synced so it re-flushes to the server, which
  // will UPSERT on (user_id, client_id) and overwrite the prior `correct`.
  const updateLastAttempt = useCallback((question_id, patch) => {
    if (!question_id || !patch) return;
    setAttemptsState((prev) => {
      let idx = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].question_id === question_id) { idx = i; break; }
      }
      if (idx === -1) return prev;
      const next = prev.slice();
      next[idx] = { ...next[idx], ...patch, synced: false };
      storage.set(KEYS.attempts, next);
      return next;
    });
  }, []);

  const clearAttempts = useCallback(() => {
    storage.set(KEYS.attempts, []);
    setAttemptsState([]);
  }, []);

  const client = useMemo(() => makeClient(() => storage.get(KEYS.apiKey, '')), []);

  // ---- backend session ----
  const [session, setSessionState] = useState(() => storage.get(KEYS.session, null)); // { token, username } | null
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncError, setSyncError] = useState('');

  const setSession = useCallback((s) => {
    if (s) storage.set(KEYS.session, s); else storage.remove(KEYS.session);
    setSessionState(s);
  }, []);

  const api = useMemo(() => makeApiClient(() => storage.get(KEYS.session, null)?.token || ''), []);

  // Unsynced = any attempt without `synced: true`. The single source of truth
  // is mcat:attempts; the old mcat:pendingSync key is unused now.
  const pendingSync = useMemo(
    () => attempts.filter((a) => !a.synced),
    [attempts]
  );

  // Ref-based lock instead of relying on the React state `syncBusy`, which
  // doesn't update synchronously — two close-together flushSync calls (e.g.
  // login useEffect firing the same tick as a quiz-submit setTimeout) would
  // both observe `syncBusy === false` and both POST the same queue. That's
  // what caused duplicate final-score rows in your account.
  const syncLockRef = useRef(false);

  const flushSync = useCallback(async () => {
    const s = storage.get(KEYS.session, null);
    if (!s?.token) return { ok: false, reason: 'not signed in' };
    if (syncLockRef.current) return { ok: false, reason: 'busy' };
    syncLockRef.current = true;
    setSyncBusy(true);
    setSyncError('');
    try {
      const queue = storage.get(KEYS.attempts, []).filter((a) => !a.synced);
      if (!queue.length) return { ok: true, inserted: 0 };
      // Chunk to stay well under the worker's 500-row cap.
      const CHUNK = 200;
      let remaining = queue.slice();
      let inserted = 0;
      while (remaining.length) {
        const chunk = remaining.slice(0, CHUNK);
        const resp = await api.postAttempts(chunk);
        inserted += (resp && typeof resp.inserted === 'number') ? resp.inserted : chunk.length;
        remaining = remaining.slice(CHUNK);
      }
      // Identify queued rows by client_id when present, falling back to
      // ts:question_id for legacy attempts that predate client_id.
      const idOf = (a) => a.client_id ? `c:${a.client_id}` : `t:${a.ts}:${a.question_id}`;
      const queuedIds = new Set(queue.map(idOf));
      setAttemptsState((prev) => {
        const next = prev.map((a) => queuedIds.has(idOf(a)) ? { ...a, synced: true } : a);
        storage.set(KEYS.attempts, next);
        return next;
      });
      return { ok: true, inserted, submitted: queue.length };
    } catch (e) {
      setSyncError(e.message || 'sync failed');
      if (e.status === 401) {
        storage.remove(KEYS.session);
        setSessionState(null);
      }
      return { ok: false, reason: e.message };
    } finally {
      syncLockRef.current = false;
      setSyncBusy(false);
    }
  }, [api]);

  // Pull every attempt from the server and merge into local. Used on sign-in so
  // a fresh device rehydrates your full history. Dedupes by client_id;
  // attempts without a client_id (legacy server rows) fall back to ts +
  // question_id identity to avoid double-counting when the same attempt
  // exists locally and remotely.
  const pullAttempts = useCallback(async () => {
    const s = storage.get(KEYS.session, null);
    if (!s?.token) return { ok: false, reason: 'not signed in' };
    try {
      const resp = await api.getAttempts();
      const remote = Array.isArray(resp?.attempts) ? resp.attempts : [];
      if (!remote.length) return { ok: true, added: 0, total: 0 };
      setAttemptsState((prev) => {
        const haveCid = new Set();
        const haveLegacy = new Set();
        for (const a of prev) {
          if (a.client_id) haveCid.add(a.client_id);
          else haveLegacy.add(`${a.ts}:${a.question_id}`);
        }
        const additions = [];
        for (const r of remote) {
          if (r.client_id) {
            if (haveCid.has(r.client_id)) continue;
            haveCid.add(r.client_id);
          } else {
            const key = `${r.ts}:${r.question_id}`;
            if (haveLegacy.has(key)) continue;
            haveLegacy.add(key);
          }
          // Server rows are already synced — mark as such so flushSync won't
          // try to re-POST them.
          additions.push({
            question_id: r.question_id,
            mode: r.mode,
            file_id: r.file_id || undefined,
            chapter: r.chapter || undefined,
            subject: r.subject || undefined,
            correct: !!r.correct,
            ts: r.ts,
            client_id: r.client_id || undefined,
            synced: true,
          });
        }
        if (!additions.length) return prev;
        const next = [...prev, ...additions].sort((a, b) => (a.ts || 0) - (b.ts || 0));
        storage.set(KEYS.attempts, next);
        return next;
      });
      return { ok: true, fetched: remote.length };
    } catch (e) {
      return { ok: false, reason: e.message };
    }
  }, [api]);

  // Delete every local + remote attempt matching a scope: by file_id, by
  // chapter (+ optional subject), or by a [ts_gte, ts_lt) time window. The
  // Settings "erase attempts from this day" UI passes local-midnight bounds.
  const eraseStatsFor = useCallback(async ({ file_id, chapter, subject, ts_gte, ts_lt } = {}) => {
    const s = storage.get(KEYS.session, null);
    let serverResult = null;
    if (s?.token) {
      try { serverResult = await api.deleteAttempts({ file_id, chapter, subject, ts_gte, ts_lt }); }
      catch (e) { return { ok: false, reason: e.message }; }
    }
    setAttemptsState((prev) => {
      const next = prev.filter((a) => {
        if (file_id && a.file_id === file_id) return false;
        if (chapter && a.chapter === chapter && (!subject || a.subject === subject)) return false;
        if ((Number.isFinite(ts_gte) || Number.isFinite(ts_lt))) {
          const t = a.ts || 0;
          const okGte = !Number.isFinite(ts_gte) || t >= ts_gte;
          const okLt  = !Number.isFinite(ts_lt)  || t <  ts_lt;
          if (okGte && okLt) return false;
        }
        return true;
      });
      storage.set(KEYS.attempts, next);
      return next;
    });
    return { ok: true, serverDeleted: serverResult?.deleted ?? 0 };
  }, [api]);

  // On login or app load with an active session: pull remote attempts, then
  // flush any unsynced local ones. Pull first so a new device sees existing
  // history immediately; the subsequent flush only pushes what's truly new.
  useEffect(() => {
    if (!session?.token) return;
    (async () => {
      try { await pullAttempts(); } catch {}
      try { await flushSync(); } catch {}
    })();
  }, [session?.token, pullAttempts, flushSync]);

  // ---- cross-device state sync (progress + settings) ----
  // Same shape as the attempts sync: pull-and-merge when a session becomes active,
  // then push local changes (debounced). The merge is per-entry for result maps, so
  // a passage done on the phone and one done on the laptop both survive; scalar
  // settings follow whichever device's blob is newer.
  const [stateRev, setStateRev] = useState(0);
  const stateHydratedRef = useRef(false);
  const lastPushedStateRef = useRef(null);
  const statePushTimerRef = useRef(null);

  const pushState = useCallback(async () => {
    const s = storage.get(KEYS.session, null);
    if (!s?.token || !stateHydratedRef.current) return;
    const blob = serializeSyncState(readSyncState());
    if (blob === lastPushedStateRef.current) return; // nothing changed since last push
    try {
      await api.putState(JSON.parse(blob));
      lastPushedStateRef.current = blob;
      storage.set(KEYS.stateUpdatedAt, Date.now());
    } catch {}
  }, [api]);

  const scheduleStatePush = useCallback(() => {
    if (!stateHydratedRef.current) return;
    if (statePushTimerRef.current) clearTimeout(statePushTimerRef.current);
    statePushTimerRef.current = setTimeout(() => { pushState(); }, 1500);
  }, [pushState]);

  const pullState = useCallback(async () => {
    const s = storage.get(KEYS.session, null);
    if (!s?.token) return;
    let resp;
    try { resp = await api.getState(); }
    catch { stateHydratedRef.current = true; return; }
    const cloud = (resp && resp.state && typeof resp.state === 'object') ? resp.state : {};
    const cloudUpdatedAt = resp?.updated_at || 0;
    const localUpdatedAt = storage.get(KEYS.stateUpdatedAt, 0) || 0;
    const cloudNewer = cloudUpdatedAt > localUpdatedAt;
    const merged = mergeSyncState(readSyncState(), cloud, cloudNewer);
    // Persist the merged result locally...
    for (const k of SYNC_STATE_KEYS) {
      if (merged[k] !== undefined) storage.set(k, merged[k]);
    }
    // ...and reflect merged settings in React state so the UI updates without a reload.
    try {
      const th = merged['mcat:theme'];
      if (th && typeof th === 'object') { if (th.palette) setPalette(th.palette); if (th.mode) setMode(th.mode); }
      if (typeof merged['mcat:volume'] === 'number') setVolume(merged['mcat:volume']);
      if (typeof merged['mcat:tropicalBg'] === 'boolean') setTropicalBg(merged['mcat:tropicalBg']);
      if (typeof merged['mcat:bgBlur'] === 'number') setBgBlur(merged['mcat:bgBlur']);
      if (typeof merged['mcat:experimentalUI'] === 'boolean') setExperimentalUI(merged['mcat:experimentalUI']);
      if (typeof merged['mcat:glass'] === 'boolean') setGlass(merged['mcat:glass']);
      if (typeof merged['mcat:autoDownload'] === 'boolean') setAutoDownloadChapters(merged['mcat:autoDownload']);
      if (typeof merged['mcat:autoDownloadAll'] === 'boolean') setAutoDownloadAll(merged['mcat:autoDownloadAll']);
      if (typeof merged['mcat:contributorMode'] === 'boolean') setContributorMode(merged['mcat:contributorMode']);
      if (typeof merged['mcat:reaudit'] === 'boolean') setReauditEnabled(merged['mcat:reaudit']);
    } catch {}
    const mergedStr = serializeSyncState(merged);
    lastPushedStateRef.current = mergedStr;
    stateHydratedRef.current = true;
    setStateRev((r) => r + 1); // nudge consumers that read progress inline from storage
    // If our merge produced anything the cloud lacked, push the union back up.
    if (mergedStr !== serializeSyncState(cloud)) {
      try { await api.putState(merged); } catch {}
    }
    storage.set(KEYS.stateUpdatedAt, Date.now());
  }, [api, setPalette, setMode, setVolume, setTropicalBg, setBgBlur, setExperimentalUI, setGlass, setAutoDownloadChapters, setAutoDownloadAll, setContributorMode, setReauditEnabled]);

  // Pull + reconcile whenever a session becomes active (sign-in or app open).
  useEffect(() => {
    if (!session?.token) { stateHydratedRef.current = false; lastPushedStateRef.current = null; return; }
    (async () => { try { await pullState(); } catch {} })();
  }, [session?.token, pullState]);

  // Settings changes (these live in React state) → debounced push.
  useEffect(() => {
    scheduleStatePush();
  }, [palette, mode, volume, tropicalBg, bgBlur, experimentalUI, glass, autoDownloadChapters, autoDownloadAll, contributorMode, reauditEnabled, scheduleStatePush]);

  // Progress/result writers dispatch mcat:stateDirty → debounced push.
  useEffect(() => {
    const onDirty = () => scheduleStatePush();
    window.addEventListener('mcat:stateDirty', onDirty);
    return () => window.removeEventListener('mcat:stateDirty', onDirty);
  }, [scheduleStatePush]);

  // Flush promptly when the tab is hidden or the app is being closed, so a quick
  // close right after finishing a passage still makes it to the cloud.
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') pushState(); };
    window.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', pushState);
    return () => {
      window.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', pushState);
    };
  }, [pushState]);

  // Auto-update: when enabled, silently refresh any locally-downloaded chapters
  // whose server updated_at is newer than what we last fetched.
  useEffect(() => {
    if (!autoDownloadChapters) return;
    const localChapters = files.filter((f) => f.chapter_id);
    if (!localChapters.length) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listChapters();
        if (cancelled) return;
        for (const ch of data.chapters || []) {
          if (cancelled) return;
          const localFile = localChapters.find((f) => f.chapter_id === ch.id);
          if (!localFile) continue;
          const localTs = localFile.chapter_updated_at || 0;
          if (ch.updated_at <= localTs) continue;
          // Fetch and store the full chapter silently.
          try {
            const full = await api.getChapter(ch.id);
            if (cancelled) return;
            const localFileId = `chap_${full.id}`;
            const fileRecord = {
              file_id: localFileId,
              file_uri: 'cloud',
              mime_type: 'application/pdf',
              filename: full.filename,
              size_bytes: full.size_bytes || 0,
              subject: full.subject,
              chapter: full.title,
              uploaded_at: new Date(full.created_at).toISOString(),
              chapter_id: full.id,
              chapter_updated_at: full.updated_at,
            };
            setFiles((prev) => [...prev.filter((f) => f.file_id !== localFileId && f.chapter_id !== full.id), fileRecord]);
            if (full.extraction) setExtraction(localFileId, full.extraction);
            setQuestionsFor(localFileId, {
              mc: full.mc || [],
              twoPart: full.two_part || [],
              short: full.short || [],
              generated_at: new Date(full.updated_at).toISOString(),
            });
          } catch {}
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [autoDownloadChapters]); // eslint-disable-line

  // Auto-download-all: when enabled, silently download any cloud chapter that
  // is not in the local library yet. Skips chapters without a finished MC stage.
  useEffect(() => {
    if (!autoDownloadAll) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listChapters();
        if (cancelled) return;
        const localIds = new Set(files.filter((f) => f.chapter_id).map((f) => f.chapter_id));
        for (const ch of data.chapters || []) {
          if (cancelled) return;
          if (localIds.has(ch.id)) continue;
          if (!ch.stages?.mc?.done) continue; // skip chapters that aren't usable yet
          try {
            const full = await api.getChapter(ch.id);
            if (cancelled) return;
            const localFileId = `chap_${full.id}`;
            const fileRecord = {
              file_id: localFileId,
              file_uri: 'cloud',
              mime_type: 'application/pdf',
              filename: full.filename,
              size_bytes: full.size_bytes || 0,
              subject: full.subject,
              chapter: full.title,
              uploaded_at: new Date(full.created_at).toISOString(),
              chapter_id: full.id,
              chapter_updated_at: full.updated_at,
            };
            setFiles((prev) => [...prev.filter((f) => f.file_id !== localFileId && f.chapter_id !== full.id), fileRecord]);
            if (full.extraction) setExtraction(localFileId, full.extraction);
            setQuestionsFor(localFileId, {
              mc: full.mc || [],
              twoPart: full.two_part || [],
              short: full.short || [],
              generated_at: new Date(full.updated_at).toISOString(),
            });
          } catch {}
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [autoDownloadAll]); // eslint-disable-line

  const value = useMemo(
    () => ({
      apiKey, setApiKey,
      files, setFiles,
      extractions, setExtraction,
      questions, setQuestionsFor,
      attempts, addAttempt, updateLastAttempt, clearAttempts, eraseStatsFor, pullAttempts,
      staticBank, useStaticBank,
      readOnly, setReadOnly,
      palette, mode, setPalette, setMode,
      github, setGithub, pushBank, pushStatus,
      session, setSession, api, pendingSync, flushSync, syncBusy, syncError,
      client,
      reauditEnabled, setReauditEnabled,
      volume, setVolume,
      autoDownloadChapters, setAutoDownloadChapters,
      autoDownloadAll, setAutoDownloadAll,
      contributorMode, setContributorMode,
      tropicalBg, setTropicalBg,
      bgBlur, setBgBlur,
      experimentalUI, setExperimentalUI,
      glass, setGlass,
      stateRev,
    }),
    [apiKey, setApiKey, files, setFiles, extractions, setExtraction, questions, setQuestionsFor,
     attempts, addAttempt, updateLastAttempt, clearAttempts, eraseStatsFor, pullAttempts, staticBank, useStaticBank, readOnly,
     palette, mode, setPalette, setMode,
     github, setGithub, pushBank, pushStatus,
     session, setSession, api, pendingSync, flushSync, syncBusy, syncError, client,
     reauditEnabled, setReauditEnabled, volume, setVolume,
     autoDownloadChapters, setAutoDownloadChapters,
     autoDownloadAll, setAutoDownloadAll,
     contributorMode, setContributorMode,
     tropicalBg, setTropicalBg,
     bgBlur, setBgBlur,
     experimentalUI, setExperimentalUI, glass, setGlass, stateRev]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// ---------- key gate ----------
function ApiKeyGate() {
  const { setApiKey, client, staticBank, useStaticBank, files, extractions, questions, setReadOnly } = useApp();
  const hasLocalData = files.some((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short);
  const localCount = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const save = async () => {
    const trimmed = val.trim();
    if (!trimmed.startsWith('AIza')) {
      setErr('That does not look like a Google AI API key (should start with AIza).');
      return;
    }
    setBusy(true); setErr('');
    storage.set(KEYS.apiKey, trimmed);
    try {
      await client.ping();
      setApiKey(trimmed);
    } catch (e) {
      storage.remove(KEYS.apiKey);
      setErr(`Key rejected: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[var(--bg-card-strong)] border border-[var(--border)] rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-1">MCAT Study</h1>
        <p className="text-[var(--text-muted)] text-sm mb-5">
          Paste your Google AI (Gemini) API key to begin. Stored only in this browser's localStorage.
        </p>

        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1">API key</label>
        <div className="flex gap-2">
          <input
            type={show ? 'text' : 'password'}
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(''); }}
            onKeyDown={(e) => e.key === 'Enter' && !busy && save()}
            placeholder="AIza..."
            className="flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="px-3 text-xs text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)]"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {err && <p className="text-[var(--danger-text)] text-xs mt-2">{err}</p>}

        <button
          onClick={save}
          disabled={!val.trim() || busy}
          className="mt-4 w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-2 text-sm font-medium"
        >
          {busy ? 'Verifying…' : 'Save & continue'}
        </button>

        {(staticBank || hasLocalData) && (
          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-2 text-center">or</div>
            {hasLocalData && (
              <button
                onClick={() => setReadOnly(true)}
                className="w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
              >
                Continue with existing data ({localCount} chapter{localCount === 1 ? '' : 's'})
              </button>
            )}
            {staticBank && !hasLocalData && (
              <button
                onClick={useStaticBank}
                className="w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
              >
                Use shared bank ({staticBank.files?.length || 0} chapters)
              </button>
            )}
            <p className="text-[11px] text-[var(--text-faint)] mt-2 text-center">
              Quiz-only mode. Can't add new chapters without a key.
            </p>
          </div>
        )}

        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-2 text-center">or</div>
          <button
            onClick={() => setShowAccount((s) => !s)}
            className="w-full border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm font-medium text-[var(--text-strong)]"
          >
            Sign in / Sign up for cross-device stats
          </button>
          {showAccount && (
            <div className="mt-3">
              <AccountPanel onClose={() => setShowAccount(false)} />
            </div>
          )}
        </div>

        <div className="mt-5 text-[11px] leading-relaxed text-[var(--text-faint)] space-y-1">
          <p>
            Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-[var(--accent-text)] underline">
              aistudio.google.com/apikey
            </a>.
          </p>
          <p>
            <span className="text-[var(--warning-text-strong)]">Heads up:</span> the app calls the Gemini API directly from your browser.
            Free-tier usage may be used for training; don't upload anything you wouldn't share.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- helpers ----------
function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}

function parseChapterFromFilename(name) {
  const stem = name.replace(/\.pdf$/i, '').trim();
  const m = stem.match(/^Chapter\s+(\d+)\s+(.+)$/i);
  if (m) return `Chapter ${m[1]} — ${m[2]}`;
  return stem;
}

// ---------- upload panel ----------
function UploadPanel() {
  const { client, files, setFiles } = useApp();
  const [subject, setSubject] = useState('Behavioral Science');
  const [pending, setPending] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const knownSubjects = useMemo(() => {
    const s = new Set(files.map((f) => f.subject));
    ['Behavioral Science', 'Biology', 'Chemistry', 'Physics', 'Biochemistry',
     'Psychology', 'Sociology'].forEach((x) => s.add(x));
    return Array.from(s);
  }, [files]);

  const onPick = (fileList) => {
    const arr = Array.from(fileList).filter((f) => /\.pdf$/i.test(f.name));
    if (!arr.length) return;
    setPending(arr.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      chapter: parseChapterFromFilename(f.name),
      status: 'queued',
      error: null,
    })));
  };

  const startUploads = async () => {
    for (let i = 0; i < pending.length; i++) {
      if (pending[i].status !== 'queued') continue;
      setPending((p) => p.map((e, idx) => idx === i ? { ...e, status: 'uploading' } : e));
      try {
        const meta = await client.uploadFile(pending[i].file);
        const record = {
          file_id: meta.name, // e.g. "files/abc-123"
          file_uri: meta.uri,
          mime_type: meta.mimeType || 'application/pdf',
          filename: pending[i].name,
          size_bytes: Number(meta.sizeBytes) || pending[i].size,
          subject,
          chapter: pending[i].chapter,
          uploaded_at: new Date().toISOString(),
        };
        setFiles((prev) => [...prev.filter((f) => f.file_id !== meta.name), record]);
        setPending((p) => p.map((e, idx) => idx === i ? { ...e, status: 'done' } : e));
      } catch (e) {
        setPending((p) => p.map((entry, idx) => idx === i ? { ...entry, status: 'error', error: e.message } : entry));
      }
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Upload chapter PDFs</h3>
        <div className="flex items-center gap-2 text-xs">
          <label className="text-[var(--text-muted)]">Subject</label>
          <input
            list="subjects"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 w-48"
          />
          <datalist id="subjects">
            {knownSubjects.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          onPick(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
        }`}
      >
        <div className="text-[var(--text)]">Drag PDFs here, or click to select</div>
        <div className="text-xs text-[var(--text-faint)] mt-1">
          They'll be assigned to <span className="text-[var(--text)]">{subject}</span>. Chapter parsed
          from filename — editable before upload.
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <div className="mt-4 space-y-2">
          {pending.map((e, i) => (
            <div key={i} className="flex items-center gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{e.name}</div>
                <input
                  value={e.chapter}
                  onChange={(ev) => setPending((p) => p.map((x, idx) => idx === i ? { ...x, chapter: ev.target.value } : x))}
                  disabled={e.status !== 'queued'}
                  className="mt-1 w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 text-xs disabled:opacity-60"
                />
              </div>
              <div className="text-xs text-[var(--text-muted)] w-20 text-right">{fmtBytes(e.size)}</div>
              <div className={`text-xs w-32 text-right truncate ${
                e.status === 'done' ? 'text-[var(--success-text)]' :
                e.status === 'error' ? 'text-[var(--danger-text)]' :
                e.status === 'uploading' ? 'text-[var(--accent-text)]' : 'text-[var(--text-muted)]'
              }`}>
                {e.status === 'error' ? (e.error || 'error') : e.status}
              </div>
            </div>
          ))}
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => setPending([])}
              className="text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
            >
              Clear
            </button>
            <button
              onClick={startUploads}
              disabled={pending.every((e) => e.status !== 'queued')}
              className="text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
            >
              Upload {pending.filter((e) => e.status === 'queued').length} file(s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- extraction preview ----------
function ExtractionPreview({ data }) {
  const [tab, setTab] = useState('summary');
  if (!data) return null;
  const counts = {
    summary: data.summary_sentences?.length || 0,
    examples: data.context_examples?.length || 0,
    terms: data.key_terms?.length || 0,
  };
  const tabs = [
    ['summary', `Summary (${counts.summary})`],
    ['examples', `Examples (${counts.examples})`],
    ['terms', `Terms (${counts.terms})`],
  ];
  return (
    <div className="mt-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg">
      <div className="flex border-b border-[var(--border-soft)]">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`text-xs px-3 py-2 ${tab === k ? 'text-[var(--accent-text)] border-b border-[var(--accent-border)]' : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="p-3 max-h-72 overflow-y-auto text-xs space-y-1">
        {tab === 'summary' && (data.summary_sentences || []).map((s, i) => (
          <div key={i} className="text-[var(--text)]"><span className="text-[var(--text-fainter)] mr-2">{i + 1}.</span>{s}</div>
        ))}
        {tab === 'examples' && (data.context_examples || []).map((e, i) => (
          <div key={i} className="text-[var(--text)]">
            <span className="text-[var(--accent-text)] font-medium">{e.topic}:</span> <span className="text-[var(--text-muted)]">{e.example}</span>
          </div>
        ))}
        {tab === 'terms' && (data.key_terms || []).map((t, i) => (
          <div key={i} className="text-[var(--text)]">
            <span className="text-[var(--accent-2-text)] font-medium">{t.term}</span> — <span className="text-[var(--text-muted)]">{t.definition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- file row ----------
function PublishToBankButton({ file, extraction, qbank }) {
  const { api, session, setFiles } = useApp();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  if (!session) return null;
  // Need at least an extraction to publish anything meaningful.
  if (!extraction) return null;

  const publish = async () => {
    if (busy) return;
    setBusy(true);
    setStatus(null);
    try {
      // 1. Ensure chapter exists (POST is idempotent by uploader+subject+title).
      let chapterId = file.chapter_id;
      if (!chapterId) {
        const created = await api.createChapter({
          subject: file.subject,
          title: file.chapter,
          filename: file.filename,
          size_bytes: file.size_bytes,
        });
        chapterId = created.id;
        // Persist the link on the file record.
        setFiles((prev) => prev.map((f) => f.file_id === file.file_id ? { ...f, chapter_id: chapterId } : f));
      }
      // 2. Push each stage we have locally.
      const pushes = [];
      if (extraction) pushes.push(['extraction', extraction]);
      if (qbank?.mc?.length) pushes.push(['mc', qbank.mc]);
      if (qbank?.twoPart?.length) pushes.push(['two_part', qbank.twoPart]);
      if (qbank?.short?.length) pushes.push(['short', qbank.short]);
      for (const [stage, payload] of pushes) {
        await api.putChapterStage(chapterId, stage, payload);
      }
      setStatus({ kind: 'ok', msg: `Published ${pushes.length} stage${pushes.length === 1 ? '' : 's'}` });
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status && (
        <span className={`text-[10px] ${status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
          {status.kind === 'ok' ? '✓' : '!'} {status.msg}
        </span>
      )}
      <button
        onClick={publish}
        disabled={busy}
        title={file.chapter_id ? `Update chapter ${file.chapter_id}` : 'Publish this chapter to the shared Bank'}
        className="text-xs px-2 py-1 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded font-medium"
      >
        {busy ? 'Publishing…' : file.chapter_id ? 'Update bank' : 'Publish to bank'}
      </button>
    </div>
  );
}

function FileRow({ file, extraction, qbank, busyStage, onProcess, onRemove, readOnly, flagCount = 0 }) {
  const [open, setOpen] = useState(false);
  const mcCount = qbank?.mc?.length || 0;
  const shortCount = qbank?.short?.length || 0;
  const twoPartCount = qbank?.twoPart?.length || 0;
  const termsCount = extraction?.key_terms?.length || 0;
  const termCovered = qbank?.mc ? new Set(qbank.mc.filter((q) => q.from === 'term').map((q) => q.term)) : new Set();
  const termsNeeded = (extraction?.key_terms || []).filter((t) => !termCovered.has(t.term)).length;

  // Size to display in the row. Bank-pushed chapters were created with
  // size_bytes=0 (the chapter shell POST didn't include the original PDF
  // size), so falling back to the size of the actual stored data — the
  // extraction + question JSON — gives a meaningful number for every
  // chapter regardless of source.
  const displaySize = useMemo(() => {
    if (file.size_bytes && file.size_bytes > 0) return file.size_bytes;
    try {
      let bytes = 0;
      if (extraction) bytes += JSON.stringify(extraction).length;
      if (qbank) bytes += JSON.stringify(qbank).length;
      return bytes;
    } catch { return 0; }
  }, [file.size_bytes, extraction, qbank]);
  // Require non-empty arrays — an empty twoPart/mc/short means generation silently returned
  // nothing (rate limit, malformed response), and the chapter still needs that stage.
  const fullyProcessed = !!(extraction && mcCount > 0 && shortCount > 0 && twoPartCount > 0 && termsNeeded === 0);

  let badge;
  if (busyStage) {
    badge = { label: busyStage, cls: 'bg-[var(--accent-soft)] text-[var(--accent-text)] animate-pulse' };
  } else if (file.processError) {
    badge = { label: 'error', cls: 'bg-[var(--danger-bg)] text-[var(--danger-text)]' };
  } else if (fullyProcessed) {
    badge = { label: 'ready', cls: 'bg-[var(--success-bg)] text-[var(--success-text)]' };
  } else if (extraction) {
    badge = { label: 'partial', cls: 'bg-[var(--warning-bg)] text-[var(--warning-text)]' };
  } else {
    badge = { label: 'pending', cls: 'bg-[var(--bg-hover)] text-[var(--text-muted)]' };
  }

  return (
    <li className="py-3 space-y-2">
      <div className="flex flex-wrap items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[var(--text)]">{file.chapter}</span>
            <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded shrink-0 ${badge.cls}`}>
              {badge.label}
            </span>
            {flagCount > 0 && (
              <span
                className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded shrink-0 bg-[var(--warning-bg)] text-[var(--warning-text-strong)] border border-[var(--warning-text-strong)]"
                title={`${flagCount} flagged question${flagCount === 1 ? '' : 's'} on this chapter awaiting review`}
              >
                🚩 {flagCount} flagged
              </span>
            )}
          </div>
          <div className="text-xs text-[var(--text-faint)] mt-0.5 break-words">
            {file.filename} · {fmtBytes(displaySize)}
            {qbank?.mc && (
              <span className="ml-2 text-[var(--text-muted)]">
                · {mcCount} MC · {shortCount} short · {twoPartCount} two-part · {termsCount} terms
                {termsNeeded > 0 && (
                  <span className="text-[var(--warning-text-strong)]"> · {termsNeeded} terms need coverage</span>
                )}
                {twoPartCount === 0 && (
                  <span className="text-[var(--warning-text-strong)]"> · two-part missing</span>
                )}
                {shortCount === 0 && (
                  <span className="text-[var(--warning-text-strong)]"> · short missing</span>
                )}
              </span>
            )}
          </div>
          {file.processError && (
            <div className="text-xs text-[var(--danger-text)] mt-1 break-words" title={file.processError}>
              {file.processError}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {!readOnly && !fullyProcessed && (
          <button
            onClick={onProcess}
            disabled={!!busyStage}
            className="text-xs px-2.5 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
          >
            {extraction ? 'Finish' : 'Process'}
          </button>
        )}
        <FileRowMenu
          hasExtraction={!!extraction}
          isOpen={open}
          toggleOpen={() => setOpen((o) => !o)}
          publishSlot={!readOnly ? <PublishToBankButton file={file} extraction={extraction} qbank={qbank} /> : null}
          onRemove={!readOnly ? onRemove : null}
        />
      </div>
      {open && extraction && <ExtractionPreview data={extraction} />}
    </li>
  );
}

function FileRowMenu({ hasExtraction, isOpen, toggleOpen, publishSlot, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="relative ml-auto" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)] rounded px-2 py-1.5"
        title="More"
        aria-label="More"
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 min-w-[180px] bg-[var(--bg-card-strong)] border border-[var(--border)] rounded-lg shadow-lg py-1">
          {hasExtraction && (
            <button
              onClick={() => { toggleOpen(); setOpen(false); }}
              className="w-full text-left text-xs px-3 py-2 hover:bg-[var(--bg-hover)]"
            >
              {isOpen ? 'Hide extraction' : 'View extraction'}
            </button>
          )}
          {publishSlot && (
            <div className="px-2 py-1" onClick={() => setOpen(false)}>{publishSlot}</div>
          )}
          {onRemove && (
            <button
              onClick={() => { onRemove(); setOpen(false); }}
              className="w-full text-left text-xs px-3 py-2 text-[var(--danger-text)] hover:bg-[var(--danger-bg)]"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- file list ----------
// Read the flag queue and count pending flags per file_id. Used by the
// Library to surface a 🚩 badge on chapters that still have unresolved
// flagged questions.
function _readPendingFlagCountsByFile() {
  const q = storage.get(KEYS.flagQueue, []) || [];
  const map = {};
  for (const f of q) {
    if (!f || f.status === 'done') continue;
    const fid = f.file_id;
    if (!fid) continue;
    map[fid] = (map[fid] || 0) + 1;
  }
  return map;
}

function FileList() {
  const {
    files, setFiles, client,
    extractions, setExtraction,
    questions, setQuestionsFor,
    readOnly, github, pushBank,
  } = useApp();
  const [busy, setBusy] = useState({}); // { [file_id]: 'extracting' | 'generating MC' | 'generating short' }

  // Live-tracked pending-flag count keyed by file_id. Refreshed whenever
  // the flag queue changes (after a flag is submitted from a quiz, after
  // FlagFixesPanel runs the pipeline, etc.) so the Library badges update
  // without a reload.
  const [flagCounts, setFlagCounts] = useState(_readPendingFlagCountsByFile);
  useEffect(() => {
    const sync = () => setFlagCounts(_readPendingFlagCountsByFile());
    window.addEventListener('mcat:flagQueueChange', sync);
    window.addEventListener('storage', sync); // cross-tab safety
    return () => {
      window.removeEventListener('mcat:flagQueueChange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const grouped = useMemo(() => {
    const g = {};
    for (const f of files) {
      if (!g[f.subject]) g[f.subject] = [];
      g[f.subject].push(f);
    }
    for (const k of Object.keys(g)) {
      // Flagged chapters bubble to the top of each subject (most flags
      // first), then everything else falls back to natural chapter-number
      // ordering. This makes recently-flagged chapters trivial to find.
      g[k].sort((a, b) => {
        const fa = flagCounts[a.file_id] || 0;
        const fb = flagCounts[b.file_id] || 0;
        if (fa !== fb) return fb - fa;
        return a.chapter.localeCompare(b.chapter, undefined, { numeric: true });
      });
    }
    return g;
  }, [files, flagCounts]);

  const markFile = useCallback((fileId, patch) => {
    setFiles((prev) => prev.map((f) => f.file_id === fileId ? { ...f, ...patch } : f));
  }, [setFiles]);

  const processOne = useCallback(async (file) => {
    if (busy[file.file_id]) return;
    markFile(file.file_id, { processError: null });
    const existingQ = questions[file.file_id] || {};
    try {
      // Step 1: extraction (skip if already cached)
      let ext = extractions[file.file_id];
      if (!ext) {
        setBusy((b) => ({ ...b, [file.file_id]: 'extracting' }));
        ext = await client.extractFromPdf(file.file_uri, file.mime_type, `${file.subject} — ${file.chapter}`);
        setExtraction(file.file_id, ext);
      }
      // Step 2: MC bank (skip if already cached and non-empty)
      let mc = existingQ.mc;
      if (!mc || !mc.length) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating MC' }));
        mc = await client.generateMCQuestions(file.file_uri, file.mime_type, ext, file.chapter);
        if (!mc || !mc.length) throw new Error('MC generation returned no questions — try again');
      }
      // Step 3: term-coverage MC (one question per key_term). Skip if we've already
      // covered all current terms, or if a term run was already merged in mc.
      const haveTermFor = new Set(mc.filter((q) => q.from === 'term').map((q) => q.term));
      const allTerms = (ext.key_terms || []).map((t) => t.term);
      const missingTerms = allTerms.filter((t) => !haveTermFor.has(t));
      if (missingTerms.length > 0) {
        setBusy((b) => ({ ...b, [file.file_id]: `term coverage (${missingTerms.length})` }));
        const termExtraction = {
          ...ext,
          key_terms: (ext.key_terms || []).filter((t) => missingTerms.includes(t.term)),
        };
        const termQs = await client.generateTermQuestions(termExtraction, file.chapter);
        mc = [...mc, ...termQs];
      }
      // Step 4: short answer bank
      let short = existingQ.short;
      if (!short || !short.length) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating short' }));
        short = await client.generateShortAnswers(file.file_uri, file.mime_type, ext, file.chapter);
        if (!short || !short.length) throw new Error('Short-answer generation returned no questions — try again');
      }
      // Step 5: two-part bank (regenerate if missing OR empty — earlier runs sometimes
      // returned [] silently due to Gemini rate limits or malformed responses).
      let twoPart = existingQ.twoPart;
      if (!twoPart || !twoPart.length) {
        setBusy((b) => ({ ...b, [file.file_id]: 'generating two-part' }));
        twoPart = await client.generateTwoPartQuestions(ext, file.chapter);
        if (!twoPart || !twoPart.length) throw new Error('Two-part generation returned no questions — try again');
      }
      setQuestionsFor(file.file_id, { mc, short, twoPart, generated_at: new Date().toISOString() });
      markFile(file.file_id, { processError: null });
      // Fire-and-forget auto-push. Don't block the UI on it.
      if (github.autoPush && github.token) {
        // Small delay so the most recent setQuestionsFor write lands in storage
        // before pushBank reads from it.
        setTimeout(() => { pushBank(); }, 250);
      }
    } catch (e) {
      markFile(file.file_id, { processError: e.message });
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[file.file_id]; return n; });
    }
  }, [busy, client, extractions, questions, markFile, setExtraction, setQuestionsFor, github, pushBank]);

  const processAll = useCallback(async (subject) => {
    const list = grouped[subject].filter((f) => {
      const q = questions[f.file_id];
      return !(extractions[f.file_id] && q?.mc && q?.short);
    });
    for (const f of list) {
      // sequential — Gemini Pro free tier is ~few RPM, so don't parallelize
      // eslint-disable-next-line no-await-in-loop
      await processOne(f);
    }
  }, [grouped, extractions, questions, processOne]);

  const removeFile = async (record) => {
    if (!confirm(`Remove ${record.filename}? Also deletes from Gemini's file store.`)) return;
    try { await client.deleteFile(record.file_id); } catch (e) { console.warn('remote delete failed', e); }
    setFiles((prev) => prev.filter((f) => f.file_id !== record.file_id));
    setExtraction(record.file_id, undefined);
    setQuestionsFor(record.file_id, undefined);
  };

  if (!files.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No uploads yet. Drop a PDF above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([subject, items]) => {
        const unfinished = items.filter((f) => {
          const q = questions[f.file_id];
          return !(extractions[f.file_id] && q?.mc && q?.short);
        }).length;
        return (
          <div key={subject} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold">{subject}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">{items.length} file{items.length === 1 ? '' : 's'}</span>
                {!readOnly && unfinished > 0 && (
                  <button
                    onClick={() => processAll(subject)}
                    disabled={Object.keys(busy).length > 0}
                    className="text-xs px-3 py-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
                  >
                    Process {unfinished} chapter{unfinished === 1 ? '' : 's'}
                  </button>
                )}
              </div>
            </div>
            <ul className="divide-y divide-[var(--border-soft)]">
              {items.map((f) => (
                <FileRow
                  key={f.file_id}
                  file={f}
                  extraction={extractions[f.file_id]}
                  qbank={questions[f.file_id]}
                  busyStage={busy[f.file_id]}
                  onProcess={() => processOne(f)}
                  onRemove={() => removeFile(f)}
                  readOnly={readOnly}
                  flagCount={flagCounts[f.file_id] || 0}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ---------- quiz: pool building ----------
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// item shape: { id, mode, file_id, chapter, subject, q }
function buildPool({ files, questions, extractions, attempts }, mode, scope) {
  const readyFiles = files.filter((f) => {
    const qb = questions[f.file_id];
    return extractions[f.file_id] && qb?.mc && qb?.short;
  });
  let pool = [];
  for (const f of readyFiles) {
    const meta = { file_id: f.file_id, chapter: f.chapter, subject: f.subject };
    if (mode === 'mc') {
      // Regular MC + two-part items share the same pool — two-part items keep their
      // own mode so the runner dispatches them to TwoPartQuestion. A question may
      // carry its own `subject` (e.g. a physics equation living in the cross-subject
      // "Lab Techniques and Equations" chapter credits Physics); fall back to the
      // chapter's subject. This per-item subject is what attempts are recorded under.
      for (const q of (Array.isArray(questions[f.file_id].mc) ? questions[f.file_id].mc : [])) pool.push({ id: q.id, mode: 'mc', q, ...meta, subject: q.subject || f.subject });
      for (const q of (Array.isArray(questions[f.file_id].twoPart) ? questions[f.file_id].twoPart : [])) pool.push({ id: q.id, mode: 'two_part', q, ...meta, subject: q.subject || f.subject });
    } else if (mode === 'short') {
      for (const q of (Array.isArray(questions[f.file_id].short) ? questions[f.file_id].short : [])) pool.push({ id: q.id, mode, q, ...meta, subject: q.subject || f.subject });
    } else if (mode === 'match') {
      const terms = (extractions[f.file_id].key_terms || []).slice();
      const GROUP = 5;
      for (let i = 0; i < terms.length; i += GROUP) {
        const group = terms.slice(i, i + GROUP);
        if (group.length >= 2) {
          pool.push({
            id: `match_${f.file_id}_${i}`,
            mode,
            q: { id: `match_${f.file_id}_${i}`, terms: group },
            ...meta,
          });
        }
      }
    }
  }
  if (scope?.misses) {
    const wrong = new Set();
    for (const a of attempts) if (!a.correct) wrong.add(a.question_id);
    pool = pool.filter((x) => wrong.has(x.id));
  } else if (scope?.fileIds instanceof Set) {
    pool = pool.filter((x) => scope.fileIds.has(x.file_id));
  }
  // Optional per-question subject filter: lets "study Physics" pull only the
  // physics-credited items out of a mixed-subject chapter. Match items are
  // term-matching (no per-question subject), so they bypass this filter.
  if (scope?.subjects instanceof Set && scope.subjects.size && mode !== 'match') {
    pool = pool.filter((x) => scope.subjects.has(x.subject));
  }
  return pool;
}

// ---------- quiz: launcher ----------
// Build a list of flashcards (term + definition pairs) from every selected
// chapter's key_terms extraction. Used by the "Review flashcards" launcher
// path. Returns [{ term, definition, file_id, chapter, subject }].
function buildFlashcardPool({ files, extractions }, fileIds) {
  const out = [];
  for (const f of files) {
    if (fileIds && fileIds.size > 0 && !fileIds.has(f.file_id)) continue;
    const ext = extractions[f.file_id];
    const terms = ext?.key_terms || [];
    for (const t of terms) {
      if (!t?.term) continue;
      out.push({
        term: t.term,
        definition: t.definition || '',
        file_id: f.file_id,
        chapter: f.chapter,
        subject: f.subject,
      });
    }
  }
  return out;
}

function QuizLauncher({ onStart, onStartFlashcards }) {
  const ctx = useApp();
  const { files, questions, extractions, attempts } = ctx;
  const [mode, setMode] = useState('mc');
  const [count, setCount] = useState(10);
  const [drillMisses, setDrillMisses] = useState(false);

  const readyChapters = useMemo(
    () => files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short),
    [files, extractions, questions]
  );

  // A chapter credits one or more subjects: a normal chapter credits only its own
  // f.subject, but a cross-subject chapter (e.g. "Lab Techniques and Equations")
  // credits the per-question subjects of its items. We list the chapter under each
  // credited subject so "study Physics" surfaces its physics-credited questions.
  const SEP = '';
  const selKey = (subject, fileId) => `${subject}${SEP}${fileId}`;
  const fileSubjects = useCallback((f) => {
    const qb = questions[f.file_id] || {};
    const subs = new Set();
    for (const arr of [qb.mc, qb.twoPart, qb.short]) {
      if (Array.isArray(arr)) for (const q of arr) subs.add(q.subject || f.subject);
    }
    if (!subs.size) subs.add(f.subject);
    return subs;
  }, [questions]);

  // Tree: { [creditSubject]: [file, ...] }
  const grouped = useMemo(() => {
    const g = {};
    for (const f of readyChapters) {
      for (const subj of fileSubjects(f)) (g[subj] = g[subj] || []).push(f);
    }
    for (const key of Object.keys(g)) {
      g[key].sort((a, b) => a.chapter.localeCompare(b.chapter, undefined, { numeric: true }));
    }
    return g;
  }, [readyChapters, fileSubjects]);

  // Every valid (subject, file) selection key for the current ready chapters.
  const allKeys = useMemo(() => {
    const s = new Set();
    for (const f of readyChapters) for (const subj of fileSubjects(f)) s.add(selKey(subj, f.file_id));
    return s;
  }, [readyChapters, fileSubjects]);

  // Selected (subject, file) pairs. Default (empty) is filled to "all" by the
  // re-sync effect below.
  const [selected, setSelected] = useState(() => new Set());
  // Subjects collapsed by default — open to drill down into individual chapters.
  const [openSubjects, setOpenSubjects] = useState({});
  // Re-sync selection when the ready set changes: drop stale keys, and default to
  // everything when nothing valid remains (first load / new bank pulled).
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set();
      for (const key of prev) if (allKeys.has(key)) next.add(key);
      return next.size ? next : new Set(allKeys);
    });
  }, [allKeys]);

  const wrongCount = useMemo(() => {
    const w = new Set();
    for (const a of attempts) if (!a.correct) w.add(a.question_id);
    return w.size;
  }, [attempts]);

  // Split the selected (subject, file) pairs into the file and subject filter sets
  // that buildPool consumes (file ∈ fileIds AND credited-subject ∈ subjects).
  const { selFiles, selSubjects } = useMemo(() => {
    const fileSet = new Set(), subjSet = new Set();
    for (const key of selected) {
      const i = key.indexOf(SEP);
      subjSet.add(key.slice(0, i));
      fileSet.add(key.slice(i + 1));
    }
    return { selFiles: fileSet, selSubjects: subjSet };
  }, [selected]);

  const scope = drillMisses ? { misses: true } : { fileIds: selFiles, subjects: selSubjects };
  const pool = useMemo(() => buildPool(ctx, mode, scope), [ctx, mode, drillMisses, selected]);

  if (!readyChapters.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No chapters processed yet. Upload PDFs in the Library tab and click <span className="text-[var(--text-strong)]">Process</span>, or pull a published bank from the Cloud bank panel.
      </div>
    );
  }

  const modes = [
    ['mc', 'Multiple choice'],
    ['short', 'Short answer'],
    ['match', 'Matching'],
  ];

  const subjectKeys = (subject) => (grouped[subject] || []).map((f) => selKey(subject, f.file_id));
  const isSubjectFully = (subject) => subjectKeys(subject).every((key) => selected.has(key));
  const isSubjectPartial = (subject) => !isSubjectFully(subject) && subjectKeys(subject).some((key) => selected.has(key));
  const toggleChapter = (subject, fileId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const key = selKey(subject, fileId);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const toggleSubject = (subject) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const keys = subjectKeys(subject);
      const allOn = keys.every((key) => next.has(key));
      if (allOn) for (const key of keys) next.delete(key);
      else for (const key of keys) next.add(key);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(allKeys));
  const selectNone = () => setSelected(new Set());
  // Chapters whose lesson final exam was passed 100% (mastered), from the lesson
  // gating store. Lets the student drill only material they've mastered. Keyed by
  // (subject, file) so a cross-subject chapter is selectable per credited subject.
  const masteredKeys = useMemo(() => {
    const g = storage.get(KEYS.lessonGates, {}) || {};
    const out = new Set();
    for (const f of readyChapters) if (f.chapter_id && g[f.chapter_id]?.mastered) for (const subj of fileSubjects(f)) out.add(selKey(subj, f.file_id));
    return out;
  }, [readyChapters, fileSubjects]);
  const selectMastered = () => setSelected(new Set(masteredKeys));

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-5">
      <div>
        <h2 className="font-semibold mb-3">Start a quiz</h2>
        <div className="grid grid-cols-3 gap-2">
          {modes.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`text-sm py-2 rounded border ${mode === k
                ? 'bg-[var(--accent)] text-white border-[var(--accent-border)] text-white'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            {drillMisses ? 'Drilling missed questions' : 'Scope'}
          </div>
          {!drillMisses && (
            <div className="flex gap-2 text-xs">
              <button onClick={selectAll} className="text-[var(--accent-text)] hover:underline">All</button>
              <span className="text-[var(--text-fainter)]">·</span>
              <button onClick={selectNone} className="text-[var(--text-muted)] hover:underline">None</button>
              <span className="text-[var(--text-fainter)]">·</span>
              {masteredKeys.size > 0 ? (
                <button onClick={selectMastered} className="text-[var(--accent-text)] hover:underline" title="Select only chapters you've mastered (100% on the final exam)">Mastered only</button>
              ) : (
                <span className="text-[var(--text-fainter)] cursor-not-allowed" title="No mastered chapters yet — pass a lesson's final exam (100%) to master it">Mastered only</span>
              )}
            </div>
          )}
        </div>

        {drillMisses ? (
          <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3">
            Pool draws only from your {wrongCount} previously-missed question{wrongCount === 1 ? '' : 's'}.
          </div>
        ) : (
          <div className="border border-[var(--border-soft)] rounded-lg divide-y divide-[var(--border-soft)] max-h-96 overflow-y-auto">
            {Object.entries(grouped).map(([subject, items]) => {
              const open = !!openSubjects[subject];
              const subjectSelectedCount = items.filter((f) => selected.has(selKey(subject, f.file_id))).length;
              return (
                <div key={subject}>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-hover-soft)]">
                    <input
                      type="checkbox"
                      checked={isSubjectFully(subject)}
                      ref={(el) => { if (el) el.indeterminate = isSubjectPartial(subject); }}
                      onChange={() => toggleSubject(subject)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setOpenSubjects((p) => ({ ...p, [subject]: !p[subject] }))}
                      className="flex-1 flex items-center gap-2 text-left"
                      aria-expanded={open}
                    >
                      <span
                        aria-hidden="true"
                        className="text-[var(--text-muted)] transition-transform inline-block text-xs"
                        style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      >
                        ▶
                      </span>
                      <span className="font-medium text-[var(--text-strong)] flex-1">{subject}</span>
                      <span className="text-xs text-[var(--text-faint)]">{subjectSelectedCount}/{items.length}</span>
                    </button>
                  </div>
                  {open && (
                    <div className="pl-9 pb-1">
                      {items.map((f) => (
                        <label key={f.file_id} className="flex items-center gap-3 px-3 py-1.5 cursor-pointer hover:bg-[var(--bg-hover-soft)] rounded">
                          <input
                            type="checkbox"
                            checked={selected.has(selKey(subject, f.file_id))}
                            onChange={() => toggleChapter(subject, f.file_id)}
                            className="w-4 h-4 accent-[var(--accent)]"
                          />
                          <span className="text-sm text-[var(--text)] flex-1">{f.chapter}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={drillMisses}
            disabled={wrongCount === 0}
            onChange={(e) => setDrillMisses(e.target.checked)}
            className="w-4 h-4 accent-[var(--accent)]"
          />
          <span className={wrongCount === 0 ? 'text-[var(--text-faint)]' : 'text-[var(--text)]'}>
            Drill my misses ({wrongCount} question{wrongCount === 1 ? '' : 's'})
          </span>
        </label>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Count</div>
        <div className="flex gap-2 flex-wrap">
          {[5, 10, 20, 50].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`text-sm px-3 py-1.5 rounded border ${count === n
                ? 'bg-[var(--accent)] text-white border-[var(--accent-border)] text-white'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]'}`}
            >
              {n}
            </button>
          ))}
          <span className="ml-auto text-xs text-[var(--text-faint)] self-center">
            {pool.length} available
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
          if (!picked.length) return;
          sfxQuizStart();
          onStart(picked);
        }}
        disabled={pool.length === 0}
        className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-3 sm:py-2.5 font-medium"
      >
        Start {Math.min(count, pool.length)}-question quiz
      </button>

      {/* Flashcard review — flips through every key_term in the selected
          chapters. Doesn't score anything; just spaced flipping for recall
          practice. Disabled when no selected chapter has key_terms (or
          while drillMisses is on — flashcards don't have a "missed" set). */}
      {(() => {
        const flashPool = drillMisses ? [] : buildFlashcardPool(ctx, selFiles);
        return (
          <button
            onClick={() => {
              if (!flashPool.length) return;
              onStartFlashcards?.(shuffle(flashPool));
            }}
            disabled={flashPool.length === 0 || drillMisses}
            title={drillMisses
              ? 'Turn off Drill misses to review flashcards.'
              : (flashPool.length === 0 ? 'No key terms in the selected chapters.' : '')}
            className="w-full border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded-lg py-2.5 sm:py-2 text-sm font-medium"
          >
            Review {flashPool.length || 0} flashcard{flashPool.length === 1 ? '' : 's'}
          </button>
        );
      })()}
    </div>
  );
}

// Full-screen-ish flashcard reviewer. Cycles through cards one at a time
// with prev/next, an exit button, and a progress counter. Reuses the
// existing Flashcard component so the flip behaviour stays consistent
// with the related-terms strip shown after each MC answer.
function FlashcardReview({ cards, onExit }) {
  const [idx, setIdx] = useState(0);
  const total = cards.length;
  const card = cards[idx];
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(total - 1, i + 1));
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight' || e.key === ' ') next();
      else if (e.key === 'Escape') onExit?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  if (!card) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No flashcards to review. <button onClick={onExit} className="text-[var(--accent-text)] hover:underline ml-1">Back</button>
      </div>
    );
  }
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 text-xs text-[var(--text-muted)]">
          <span className="text-[var(--text-strong)] truncate">{card.subject} — {card.chapter}</span>
          <span className="ml-2 shrink-0">· {idx + 1}/{total}</span>
        </div>
        <button
          onClick={onExit}
          className="shrink-0 text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1"
        >
          Exit
        </button>
      </div>

      <div className="h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>

      <Flashcard key={`${card.file_id}-${card.term}-${idx}`} term={card.term} definition={card.definition} />

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="text-sm px-4 py-2 border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded-lg"
        >
          ← Previous
        </button>
        {idx === total - 1 ? (
          <button
            onClick={onExit}
            className="text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
          >
            Done
          </button>
        ) : (
          <button
            onClick={next}
            className="text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- quiz: flag a question ----------
const FLAG_PRESETS = [
  { label: 'Remove A./B./C./D. from answers', text: 'Remove the A./B./C./D. letter prefixes from the answer choices — the app adds labels itself.' },
  { label: 'Extra context after each term', text: 'Get rid of extra context / parenthetical definitions appended after each answer choice.' },
  { label: 'Wrong answer marked correct', text: 'The marked correct answer is wrong — please fix the correct_index.' },
  { label: 'Garbled / encoding error', text: 'Question text contains garbled characters or encoding errors (e.g. â€" instead of —, subscript numbers rendered as symbols).' },
];

function FlagQuestionModal({ item, onClose }) {
  const { api, session, files, client, apiKey, questions, setQuestionsFor } = useApp();
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const localFile = files.find((f) => f.file_id === item.file_id);
  const chapterId = localFile?.chapter_id;

  const applyPreset = (text) => {
    setDescription((prev) => prev ? prev + '\n' + text : text);
  };

  const submit = async () => {
    if (!description.trim()) { setStatus({ kind: 'err', msg: 'Describe the problem first.' }); return; }
    setBusy(true); setStatus(null);
    try {
      if (session && chapterId) {
        try { await api.addChapterFlag(chapterId, { question_id: item.id, description: description.trim() }); } catch {}
      }
      const queue = storage.get(KEYS.flagQueue, []);
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
        status: 'pending',
      });
      storage.set(KEYS.flagQueue, queue);
      // Notify the Library tab so a 🚩 badge can appear on the chapter
      // immediately, without a reload. Same event the FlagFixesPanel
      // dispatches after a queue mutation.
      try { window.dispatchEvent(new Event('mcat:flagQueueChange')); } catch {}
      setStatus({ kind: 'ok', msg: 'Flagged. We\'ll fix it on the next pipeline run.' });
      setTimeout(onClose, 900);
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally { setBusy(false); }
  };

  const fixNow = async () => {
    if (!description.trim()) { setStatus({ kind: 'err', msg: 'Describe the problem first.' }); return; }
    if (!apiKey) { setStatus({ kind: 'err', msg: 'Add a Gemini API key in Settings to fix now.' }); return; }
    setBusy(true); setStatus({ kind: 'info', msg: 'Sending to Gemini…' });
    try {
      const fix = await client.fixFlaggedQuestion({
        question: item.q,
        flagDescription: description.trim(),
        chapterContext: item.chapter,
      });
      const fileId = item.file_id;
      const qbank = questions[fileId];
      if (fix.two_part) {
        if (qbank?.twoPart && fix.action === 'edit' && Array.isArray(fix.parts) && fix.parts.length === 2) {
          const cleanParts = fix.parts.map((p) => ({
            question: sanitizeText(p.question),
            choices: (p.choices || []).slice(0, 4).map((c, i) => stripChoiceLabel(c, i)),
            correct_index: Number.isInteger(p.correct_index) ? p.correct_index : 0,
            explanation: sanitizeText(p.explanation),
          }));
          const nextTp = qbank.twoPart.map((it) => it.id === item.id ? {
            ...it, theme: sanitizeText(fix.theme) || it.theme, parts: cleanParts,
          } : it);
          setQuestionsFor(fileId, { ...qbank, twoPart: nextTp });
          if (chapterId && session) {
            try { await api.putChapterStage(chapterId, 'two_part', nextTp); } catch {}
          }
        }
      } else if (qbank?.mc) {
        if (fix.action === 'edit') {
          const nextMc = qbank.mc.map((q) => q.id === item.id ? {
            ...q,
            question: sanitizeText(fix.question) || q.question,
            choices: (fix.choices?.length === 4 ? fix.choices : q.choices).map((c, i) => stripChoiceLabel(c, i)),
            correct_index: Number.isInteger(fix.correct_index) ? fix.correct_index : q.correct_index,
            explanation: sanitizeText(fix.explanation) || q.explanation,
          } : q);
          setQuestionsFor(fileId, { ...qbank, mc: nextMc });
          if (chapterId && session) {
            try { await api.putChapterStage(chapterId, 'mc', nextMc); } catch {}
          }
        }
      }
      setStatus({ kind: 'ok', msg: fix.action === 'skip' ? `Gemini skipped: ${fix.rationale || 'no real problem found'}` : 'Fixed and saved!' });
      if (fix.action === 'edit') setTimeout(onClose, 1200);
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3" onClick={onClose}>
      <div className="w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-[var(--text-strong)]">Flag question</h3>
        <p className="text-xs text-[var(--text-muted)] line-clamp-2">
          {item.q.question || item.q.prompt
            || (item.q.theme ? `Two-part: ${item.q.theme}` : '(no stem)')}
        </p>
        <div>
          <div className="text-[11px] text-[var(--text-faint)] mb-1.5">Quick options — click to fill description:</div>
          <div className="flex flex-wrap gap-1.5">
            {FLAG_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.text)}
                className="text-[11px] px-2 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What's wrong? (e.g. wrong answer marked correct, two choices are the same, stem is unclear)"
          className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm"
        />
        {status && (
          <div className={`text-xs rounded px-2 py-1.5 ${
            status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' :
            status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' :
            'bg-[var(--accent-soft)] text-[var(--accent-text)]'
          }`}>{status.msg}</div>
        )}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded">Cancel</button>
          <button onClick={submit} disabled={busy} className="text-xs px-3 py-1.5 bg-[var(--warning-text-strong)] text-white rounded hover:opacity-90 disabled:opacity-40">
            {busy ? 'Working…' : 'Flag only'}
          </button>
          {apiKey && (
            <button onClick={fixNow} disabled={busy} className="text-xs px-3 py-1.5 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)] disabled:opacity-40">
              Fix with Gemini
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- quiz: MC ----------
// Escape a string for use inside a RegExp literal.
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Pick key_terms from this question's chapter that actually appear in the
// question, choices, or explanation. Whole-word match (case-insensitive) so
// "ion" doesn't latch onto "action". Capped at 6 so the post-answer card stays
// short. Returns [] for non-MC items or chapters with no extracted terms.
function relatedTermsForItem(item, extractions) {
  if (!item || !item.q) return [];
  const ext = extractions?.[item.file_id];
  const terms = ext?.key_terms;
  if (!terms?.length) return [];
  const haystack = [
    item.q.question || '',
    ...(item.q.choices || []),
    item.q.explanation || '',
  ].join(' ');
  // Prefer longer terms first — they're more specific and avoid partial overlap
  // (e.g. "G protein" picked over "protein" when both appear).
  const ranked = terms.slice().sort((a, b) => (b.term?.length || 0) - (a.term?.length || 0));
  const matches = [];
  const seen = new Set();
  for (const kt of ranked) {
    const term = (kt.term || '').trim();
    if (!term || seen.has(term.toLowerCase())) continue;
    let hit;
    try { hit = new RegExp(`\\b${escapeRegex(term)}\\b`, 'i').test(haystack); }
    catch { hit = haystack.toLowerCase().includes(term.toLowerCase()); }
    if (hit) {
      matches.push(kt);
      seen.add(term.toLowerCase());
      if (matches.length >= 6) break;
    }
  }
  return matches;
}

// ---------- molecule viewer (PubChem-backed) ----------
// Curated dictionary of common MCAT-relevant compounds. Each entry's `name`
// is the canonical string passed to PubChem (https://pubchem.ncbi.nlm.nih.gov
// /rest/pug/compound/name/<name>/PNG). `variants` are alternate spellings or
// trivial/IUPAC pairs that should all open the same PubChem image.
// `acronym: true` forces case-sensitive uppercase matching so we don't link
// "atp" inside random words; otherwise matching is case-insensitive.
const MOLECULES = [
  // Inorganic / small molecules
  { name: 'water', variants: ['H2O'] },
  { name: 'ammonia', variants: ['NH3'] },
  { name: 'hydrogen peroxide', variants: ['H2O2'] },
  { name: 'ozone' },
  { name: 'carbon dioxide', variants: ['CO2'] },
  { name: 'carbon monoxide', variants: ['CO'], acronym: true },
  { name: 'nitric oxide', variants: ['NO'], acronym: true },
  { name: 'nitrous oxide', variants: ['N2O'] },
  { name: 'sulfur dioxide', variants: ['SO2'] },
  { name: 'hydrogen sulfide', variants: ['H2S'] },
  { name: 'hydrochloric acid', variants: ['HCl'] },
  { name: 'sulfuric acid', variants: ['H2SO4'] },
  { name: 'nitric acid', variants: ['HNO3'] },
  { name: 'phosphoric acid', variants: ['H3PO4'] },
  { name: 'carbonic acid', variants: ['H2CO3'] },
  { name: 'sodium hydroxide', variants: ['NaOH'] },
  { name: 'potassium hydroxide', variants: ['KOH'] },
  { name: 'sodium chloride', variants: ['NaCl'] },
  { name: 'sodium bicarbonate', variants: ['NaHCO3'] },
  { name: 'calcium carbonate', variants: ['CaCO3'] },

  // Alkanes
  { name: 'methane' }, { name: 'ethane' }, { name: 'propane' },
  { name: 'butane' }, { name: 'pentane' }, { name: 'hexane' },
  { name: 'heptane' }, { name: 'octane' }, { name: 'nonane' }, { name: 'decane' },
  { name: 'cyclopropane' }, { name: 'cyclobutane' }, { name: 'cyclopentane' }, { name: 'cyclohexane' },

  // Alkenes / alkynes
  { name: 'ethene', variants: ['ethylene'] },
  { name: 'propene', variants: ['propylene'] },
  { name: '1-butene' }, { name: '2-butene' },
  { name: 'ethyne', variants: ['acetylene'] },
  { name: 'propyne' }, { name: 'butadiene' }, { name: '1,3-butadiene' },
  { name: 'isoprene' },

  // Aromatics
  { name: 'benzene' }, { name: 'toluene' }, { name: 'xylene' },
  { name: 'phenol' }, { name: 'aniline' }, { name: 'styrene' },
  { name: 'naphthalene' }, { name: 'anthracene' }, { name: 'biphenyl' },
  { name: 'pyridine' }, { name: 'pyrimidine' }, { name: 'pyrrole' },
  { name: 'furan' }, { name: 'thiophene' }, { name: 'imidazole' },
  { name: 'indole' }, { name: 'purine' }, { name: 'quinoline' },
  { name: 'anisole' }, { name: 'benzyl alcohol' },

  // Alcohols
  { name: 'methanol', variants: ['methyl alcohol'] },
  { name: 'ethanol', variants: ['ethyl alcohol'] },
  { name: '1-propanol' }, { name: '2-propanol', variants: ['isopropanol', 'isopropyl alcohol'] },
  { name: '1-butanol' }, { name: '2-butanol' }, { name: 'tert-butanol', variants: ['tert-butyl alcohol'] },
  { name: 'ethylene glycol' }, { name: 'glycerol', variants: ['glycerin', 'glycerine'] },
  { name: 'phenol' },

  // Ethers
  { name: 'dimethyl ether' }, { name: 'diethyl ether', variants: ['ether'] },
  { name: 'tetrahydrofuran', variants: ['THF'] },
  { name: 'dioxane' },

  // Aldehydes / ketones
  { name: 'formaldehyde', variants: ['methanal'] },
  { name: 'acetaldehyde', variants: ['ethanal'] },
  { name: 'propanal', variants: ['propionaldehyde'] },
  { name: 'butanal', variants: ['butyraldehyde'] },
  { name: 'benzaldehyde' },
  { name: 'acetone', variants: ['propanone', '2-propanone'] },
  { name: 'butanone', variants: ['2-butanone', 'methyl ethyl ketone', 'MEK'], acronym: false },
  { name: 'cyclohexanone' },

  // Carboxylic acids
  { name: 'formic acid', variants: ['methanoic acid'] },
  { name: 'acetic acid', variants: ['ethanoic acid', 'vinegar'] },
  { name: 'propanoic acid', variants: ['propionic acid'] },
  { name: 'butyric acid', variants: ['butanoic acid'] },
  { name: 'valeric acid', variants: ['pentanoic acid'] },
  { name: 'oxalic acid' }, { name: 'malonic acid' }, { name: 'succinic acid' },
  { name: 'fumaric acid' }, { name: 'maleic acid' },
  { name: 'citric acid' }, { name: 'lactic acid' }, { name: 'pyruvic acid' },
  { name: 'benzoic acid' }, { name: 'salicylic acid' },
  { name: 'palmitic acid' }, { name: 'stearic acid' }, { name: 'oleic acid' },
  { name: 'linoleic acid' }, { name: 'linolenic acid' }, { name: 'arachidonic acid' },
  { name: 'tartaric acid' }, { name: 'malic acid' },

  // Esters / amides
  { name: 'methyl acetate' }, { name: 'ethyl acetate' }, { name: 'methyl benzoate' },
  { name: 'acetamide' }, { name: 'formamide' }, { name: 'urea' },

  // Amines
  { name: 'methylamine' }, { name: 'ethylamine' }, { name: 'dimethylamine' },
  { name: 'trimethylamine' }, { name: 'aniline' },
  { name: 'ethanolamine' }, { name: 'choline' },

  // Carbohydrates
  { name: 'glucose', variants: ['D-glucose', 'dextrose'] },
  { name: 'fructose', variants: ['D-fructose', 'levulose'] },
  { name: 'galactose', variants: ['D-galactose'] },
  { name: 'mannose' }, { name: 'ribose', variants: ['D-ribose'] },
  { name: 'deoxyribose', variants: ['2-deoxyribose'] },
  { name: 'sucrose' }, { name: 'lactose' }, { name: 'maltose' },
  { name: 'glycogen' }, { name: 'starch' }, { name: 'cellulose' },
  { name: 'amylose' }, { name: 'amylopectin' },

  // Amino acids
  { name: 'glycine' }, { name: 'alanine' }, { name: 'valine' },
  { name: 'leucine' }, { name: 'isoleucine' }, { name: 'proline' },
  { name: 'phenylalanine' }, { name: 'tryptophan' }, { name: 'methionine' },
  { name: 'serine' }, { name: 'threonine' }, { name: 'cysteine' },
  { name: 'tyrosine' }, { name: 'asparagine' }, { name: 'glutamine' },
  { name: 'lysine' }, { name: 'arginine' }, { name: 'histidine' },
  { name: 'aspartic acid', variants: ['aspartate'] },
  { name: 'glutamic acid', variants: ['glutamate'] },

  // Nucleotides / bases (acronyms — case-sensitive)
  { name: 'ATP', acronym: true }, { name: 'ADP', acronym: true }, { name: 'AMP', acronym: true },
  { name: 'GTP', acronym: true }, { name: 'GDP', acronym: true }, { name: 'GMP', acronym: true },
  { name: 'CTP', acronym: true }, { name: 'UTP', acronym: true }, { name: 'TTP', acronym: true },
  { name: 'cAMP', acronym: true }, { name: 'cGMP', acronym: true },
  { name: 'NAD', acronym: true }, { name: 'NADH', acronym: true },
  { name: 'NADP', acronym: true }, { name: 'NADPH', acronym: true },
  { name: 'FAD', acronym: true }, { name: 'FADH2', acronym: true },
  { name: 'CoA', variants: ['coenzyme A'], acronym: true },
  { name: 'acetyl-CoA' },
  { name: 'adenine' }, { name: 'guanine' }, { name: 'cytosine' },
  { name: 'thymine' }, { name: 'uracil' }, { name: 'hypoxanthine' }, { name: 'xanthine' },

  // Biochem intermediates / metabolism
  { name: 'pyruvate', variants: ['pyruvic acid'] },
  { name: 'oxaloacetate' }, { name: 'citrate' }, { name: 'isocitrate' },
  { name: 'alpha-ketoglutarate', variants: ['α-ketoglutarate', '2-oxoglutarate'] },
  { name: 'succinyl-CoA' }, { name: 'succinate' }, { name: 'fumarate' }, { name: 'malate' },
  { name: 'glucose-6-phosphate' }, { name: 'fructose-6-phosphate' },
  { name: 'fructose-1,6-bisphosphate' }, { name: 'glyceraldehyde-3-phosphate', variants: ['G3P'] },
  { name: 'dihydroxyacetone phosphate', variants: ['DHAP'] },
  { name: '1,3-bisphosphoglycerate' }, { name: '3-phosphoglycerate' }, { name: '2-phosphoglycerate' },
  { name: 'phosphoenolpyruvate', variants: ['PEP'] },
  { name: 'acetoacetate' }, { name: 'beta-hydroxybutyrate', variants: ['β-hydroxybutyrate'] },

  // Lipids / steroids
  { name: 'cholesterol' }, { name: 'testosterone' }, { name: 'estradiol' },
  { name: 'progesterone' }, { name: 'cortisol' }, { name: 'aldosterone' },
  { name: 'vitamin D' }, { name: 'cholecalciferol' }, { name: 'calcitriol' },
  { name: 'sphingosine' }, { name: 'ceramide' }, { name: 'phosphatidylcholine', variants: ['lecithin'] },
  { name: 'phosphatidylserine' }, { name: 'phosphatidylethanolamine' },
  { name: 'triglyceride', variants: ['triacylglycerol'] },

  // Vitamins / cofactors
  { name: 'ascorbic acid', variants: ['vitamin C'] },
  { name: 'retinol', variants: ['vitamin A'] },
  { name: 'thiamine', variants: ['vitamin B1', 'thiamin'] },
  { name: 'riboflavin', variants: ['vitamin B2'] },
  { name: 'niacin', variants: ['nicotinic acid', 'vitamin B3'] },
  { name: 'pantothenic acid', variants: ['vitamin B5'] },
  { name: 'pyridoxine', variants: ['vitamin B6'] },
  { name: 'biotin', variants: ['vitamin B7'] },
  { name: 'folic acid', variants: ['folate', 'vitamin B9'] },
  { name: 'cobalamin', variants: ['vitamin B12'] },
  { name: 'tocopherol', variants: ['vitamin E'] },
  { name: 'phylloquinone', variants: ['vitamin K'] },
  { name: 'heme' }, { name: 'porphyrin' }, { name: 'chlorophyll' },

  // Neurotransmitters / signaling
  { name: 'dopamine' }, { name: 'serotonin', variants: ['5-hydroxytryptamine', '5-HT'] },
  { name: 'epinephrine', variants: ['adrenaline'] },
  { name: 'norepinephrine', variants: ['noradrenaline'] },
  { name: 'acetylcholine' }, { name: 'GABA', acronym: true },
  { name: 'glycine' }, { name: 'histamine' }, { name: 'melatonin' },
  { name: 'glutamate' },

  // Common drugs / misc
  { name: 'aspirin', variants: ['acetylsalicylic acid'] },
  { name: 'ibuprofen' }, { name: 'acetaminophen', variants: ['paracetamol', 'tylenol'] },
  { name: 'caffeine' }, { name: 'nicotine' }, { name: 'morphine' },
  { name: 'penicillin' }, { name: 'tetracycline' },
  { name: 'glutathione' }, { name: 'creatine' }, { name: 'creatinine' },
  { name: 'lactate' },

  // Gases / diatomic
  { name: 'oxygen', variants: ['O2'] },
  { name: 'nitrogen', variants: ['N2'] },
  { name: 'hydrogen', variants: ['H2'] },
  { name: 'chlorine', variants: ['Cl2'] },
  { name: 'bromine', variants: ['Br2'] },
  { name: 'iodine', variants: ['I2'] },
  { name: 'fluorine', variants: ['F2'] },

  // Functional groups. Every entry now has an explicit representative
  // compound — the small, recognisable molecule that best illustrates the
  // group. Without these, PubChem often returns whatever obscure entry
  // happens to match the bare name (e.g. "phosphate" returns the lone PO4
  // ion, "methyl" returns the methyl radical, "alcohol" returns "ethyl
  // alcohol" as an alcoholic-beverage entry). The modal shows
  // "Representative: <compound>" so the user knows it's an illustrative
  // structure, not a single specific molecule.
  { name: 'alcohol',            variants: ['alcohols'],                            representative: 'ethanol' },
  { name: 'amine',              variants: ['amines', 'primary amine'],             representative: 'methylamine' },
  { name: 'amide',              variants: ['amides'],                              representative: 'acetamide' },
  { name: 'aldehyde',           variants: ['aldehydes'],                           representative: 'acetaldehyde' },
  { name: 'ketone',             variants: ['ketones'],                             representative: 'acetone' },
  { name: 'carboxylic acid',    variants: ['carboxylic acids'],                    representative: 'acetic acid' },
  { name: 'ester',              variants: ['esters'],                              representative: 'methyl acetate' },
  { name: 'ether',              variants: ['ethers'],                              representative: 'diethyl ether' },
  { name: 'thiol',              variants: ['thiols'],                              representative: 'ethanethiol' },
  { name: 'sulfide',            variants: ['sulfides', 'thioether'],               representative: 'dimethyl sulfide' },
  { name: 'disulfide',          variants: ['disulfides'],                          representative: 'dimethyl disulfide' },
  { name: 'nitrile',            variants: ['nitriles'],                            representative: 'acetonitrile' },
  { name: 'imine',              variants: ['imines', 'Schiff base'],               representative: 'N-methylmethanimine' },
  { name: 'epoxide',            variants: ['epoxides'],                            representative: 'ethylene oxide' },
  { name: 'enol',               variants: ['enols'],                               representative: 'vinyl alcohol' },
  { name: 'enolate',            variants: ['enolates'],                            representative: 'acetone' },
  { name: 'acetal',             variants: ['acetals'],                             representative: '1,1-dimethoxyethane' },
  { name: 'hemiacetal',         variants: ['hemiacetals'],                         representative: '1-methoxyethanol' },
  { name: 'carbonyl',           variants: ['carbonyl group', 'carbonyls'],         representative: 'acetone' },
  { name: 'hydroxyl',           variants: ['hydroxyl group', 'hydroxy group'],     representative: 'ethanol' },
  { name: 'methyl',             variants: ['methyl group'],                        representative: 'methane' },
  { name: 'methylene',          variants: ['methylene group'],                     representative: 'propane' },
  { name: 'ethyl',              variants: ['ethyl group'],                         representative: 'ethane' },
  { name: 'isopropyl',          variants: ['isopropyl group'],                     representative: '2-bromopropane' },
  { name: 'tert-butyl',         variants: ['tert-butyl group', 't-butyl'],         representative: 'tert-butyl alcohol' },
  { name: 'phenyl',             variants: ['phenyl group'],                        representative: 'benzene' },
  { name: 'benzyl',             variants: ['benzyl group'],                        representative: 'toluene' },
  { name: 'vinyl',              variants: ['vinyl group'],                         representative: 'ethene' },
  { name: 'allyl',              variants: ['allyl group'],                         representative: 'propene' },
  { name: 'phosphate',          variants: ['phosphates', 'phosphate group'],       representative: 'phosphoric acid' },
  { name: 'sulfate',            variants: ['sulfates', 'sulfate group'],           representative: 'sulfuric acid' },
  { name: 'sulfonate',          variants: ['sulfonates', 'sulfonate group'],       representative: 'methanesulfonic acid' },
  { name: 'sulfonyl',           variants: ['sulfonyl group'],                      representative: 'methanesulfonic acid' },
  { name: 'nitro',              variants: ['nitro group'],                         representative: 'nitromethane' },
  { name: 'nitroso',            variants: ['nitroso group'],                       representative: 'nitrosobenzene' },
  { name: 'azide',              variants: ['azides', 'azido group'],               representative: 'methyl azide' },
  { name: 'cyano',              variants: ['cyano group'],                         representative: 'acetonitrile' },
  { name: 'isocyanide',         variants: ['isonitrile'],                          representative: 'methyl isocyanide' },
  { name: 'isocyanate',         variants: ['isocyanates'],                         representative: 'methyl isocyanate' },
  { name: 'cyanate',            variants: ['cyanate ion'],                         representative: 'methyl cyanate' },
  { name: 'thiocyanate',        variants: ['thiocyanates'],                        representative: 'methyl thiocyanate' },
  { name: 'anhydride',          variants: ['anhydrides', 'acid anhydride'],        representative: 'acetic anhydride' },
  { name: 'acyl chloride',      variants: ['acid chloride', 'acid chlorides'],     representative: 'acetyl chloride' },
  { name: 'alkyl halide',       variants: ['alkyl halides', 'haloalkane', 'haloalkanes'], representative: 'bromomethane' },
  { name: 'aryl halide',        variants: ['aryl halides'],                        representative: 'chlorobenzene' },
  { name: 'amino group',                                                           representative: 'methylamine' },
  { name: 'carboxyl group',     variants: ['COOH group'],                          representative: 'acetic acid' },
  { name: 'phosphodiester',     variants: ['phosphodiester bond'],                 representative: 'dimethyl phosphate' },
  { name: 'peptide bond',       variants: ['amide bond'],                          representative: 'N-methylacetamide' },
  { name: 'peroxide',           variants: ['peroxides'],                           representative: 'hydrogen peroxide' },
];

// Build the lookup table + matcher pattern once at module load.
const { _molRegex, _molLookup, _molAcronymExact, _molRepresentative } = (() => {
  const lookup = new Map();          // normalized key → canonical PubChem name
  const acronymExact = new Set();    // case-sensitive surface form for acronyms
  const representatives = new Map(); // canonical name → representative compound for PubChem
  const allSurface = [];
  for (const m of MOLECULES) {
    if (m.representative) representatives.set(m.name, m.representative);
    const allNames = [m.name, ...(m.variants || [])];
    for (const surface of allNames) {
      allSurface.push(surface);
      if (m.acronym) {
        acronymExact.add(surface);
        lookup.set(surface, m.name); // exact key for acronyms
      } else {
        lookup.set(surface.toLowerCase(), m.name);
      }
    }
  }
  // Longest first so multi-word phrases win over their substrings.
  allSurface.sort((a, b) => b.length - a.length);
  const pattern = '\\b(?:' + allSurface.map(escapeRegex).join('|') + ')\\b';
  // 'g' for repeated matches, 'i' for case-insensitive — acronyms are
  // post-filtered to their exact form below.
  return {
    _molRegex: new RegExp(pattern, 'gi'),
    _molLookup: lookup,
    _molAcronymExact: acronymExact,
    _molRepresentative: representatives,
  };
})();

// Cheap IUPAC-shape detector — returns true when the surface text looks
// enough like a systematic chemical name (parent-stem + locants + suffix)
// that PubChem is likely to resolve it. Catches names like "but-2-enal",
// "1,3-butanediol", "2,2-dimethylpropane", "4-methylpent-3-en-2-one"
// without requiring us to enumerate every compound. Rejects ISO dates,
// version strings, and tokens that don't contain a recognisable alkyl
// stem.
const _IUPAC_STEM_RE = /(?:meth|eth|prop|but|pent|hex|hept|oct|non|dec|undec|dodec|cyclopropan|cyclobutan|cyclopentan|cyclohexan|cycloheptan|cyclopropen|cyclobuten|cyclopenten|cyclohexen|benz|phen|tolu|napht|pyrid|pyrimid|pyrrol|furan|thiophen|imidazol|indol|purin|pyran|oxiran)/i;
const _IUPAC_SUFFIX_RE = /(?:an[eo]?l?|ane|enol|enal|enone|enamine|enamide|enimine|enyl|en|yne|ol|al|one|amine|amide|amido|nitrile|imine|oate|oxide|oxazole|azide|adienol|adienal|adienone|adienoate|adiene|atriene|diol|triol|dione|trione|dial|dioic acid|oic acid|carboxylic acid|carbohydrate)$/i;

function _looksIUPAC(token) {
  if (!token) return false;
  const trimmed = token.trim();
  if (trimmed.length < 5) return false;
  if (!/^[a-z0-9,()\- ]+$/i.test(trimmed)) return false;
  if (!/[a-z]/i.test(trimmed)) return false;
  if (!/\d/.test(trimmed)) return false;            // require at least one locant
  if (!/-/.test(trimmed)) return false;             // require at least one hyphen
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;     // ISO date
  if (/^v?\d+(\.\d+){1,3}-/.test(trimmed)) return false;     // version-prefixed
  if (!_IUPAC_STEM_RE.test(trimmed)) return false;           // needs an alkyl/aryl/het stem
  if (!_IUPAC_SUFFIX_RE.test(trimmed)) return false;         // needs a chemistry suffix
  return true;
}

// Scan free-form text for IUPAC-shaped tokens. Returns
// [{ start, end, value }] sorted by start position. Handles "...oic acid"
// and "...carboxylic acid" multi-word forms by attaching the trailing
// " acid" to the token before validation.
function _findIUPACMatches(text) {
  const matches = [];
  const isCh = (c) => /[a-z0-9,\-]/i.test(c);
  let i = 0;
  while (i < text.length) {
    if (!isCh(text[i])) { i++; continue; }
    let j = i;
    while (j < text.length && isCh(text[j])) j++;
    let start = i;
    let end = j;
    // Strip leading/trailing punctuation runs.
    while (start < end && /[,\-]/.test(text[start])) start++;
    while (end > start && /[,\-]/.test(text[end - 1])) end--;
    if (end > start) {
      let value = text.slice(start, end);
      let fullEnd = end;
      const tail = text.slice(end).match(/^\s+acid\b/i);
      if (tail) {
        value = text.slice(start, end + tail[0].length);
        fullEnd = end + tail[0].length;
      }
      if (_looksIUPAC(value)) {
        matches.push({ start, end: fullEnd, value });
      }
    }
    i = j;
  }
  return matches;
}

// Find every molecule mention in `text`. Returns an array of segments where
// {type:'text'} segments are plain strings and {type:'mol'} segments carry
// both the displayed surface form (case preserved) and the canonical PubChem
// lookup name. Adjacent non-match text is glued back together. Two passes:
//   1. Explicit dictionary (common names, acronyms, functional groups).
//   2. IUPAC-shape detection — sends the matched token straight to PubChem.
// On overlap the explicit match wins (e.g. "ethanol" stays linked as the
// canonical entry rather than re-parsed as an IUPAC name).
function parseMoleculesInText(text) {
  if (typeof text !== 'string' || !text) return [{ type: 'text', value: text || '' }];

  // ---- Pass 1: explicit dictionary matches ----
  const explicit = [];
  _molRegex.lastIndex = 0;
  let mm;
  while ((mm = _molRegex.exec(text)) !== null) {
    const surface = mm[0];
    const idx = mm.index;
    let canonical = null;
    if (_molLookup.has(surface)) {
      canonical = _molLookup.get(surface);
    } else if (_molAcronymExact.has(surface)) {
      canonical = _molLookup.get(surface);
    } else {
      const lc = surface.toLowerCase();
      if (_molLookup.has(lc)) {
        const cand = _molLookup.get(lc);
        if (_molAcronymExact.has(cand) && cand !== surface) {
          canonical = null;
        } else {
          canonical = cand;
        }
      }
    }
    if (!canonical) continue;
    explicit.push({ start: idx, end: idx + surface.length, value: surface, canonical });
  }

  // ---- Pass 2: IUPAC-shape matches (deferred to PubChem) ----
  const iupac = _findIUPACMatches(text)
    .map((m) => ({ ...m, canonical: m.value.toLowerCase() }))
    // Drop IUPAC matches whose span overlaps an explicit match (explicit wins).
    .filter((m) => !explicit.some((e) => m.start < e.end && e.start < m.end));

  // ---- Merge + emit segments ----
  const all = explicit.concat(iupac).sort((a, b) => a.start - b.start);
  const out = [];
  let last = 0;
  for (const m of all) {
    if (m.start < last) continue; // skip overlapping (shouldn't happen after the filter, defensive)
    if (m.start > last) out.push({ type: 'text', value: text.slice(last, m.start) });
    out.push({ type: 'mol', value: m.value, canonical: m.canonical });
    last = m.end;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  if (!out.length) out.push({ type: 'text', value: text });
  return out;
}

// ---------- molecule viewer context + modal ----------
const MoleculeViewerCtx = createContext({ open: () => {}, close: () => {} });
function useMoleculeViewer() { return useContext(MoleculeViewerCtx); }

function MoleculeProvider({ children }) {
  const [target, setTarget] = useState(null); // canonical molecule name or null
  const ctx = useMemo(() => ({
    open: (name) => setTarget(name || null),
    close: () => setTarget(null),
  }), []);
  return (
    <MoleculeViewerCtx.Provider value={ctx}>
      {children}
      {target && <MoleculeModal name={target} onClose={() => setTarget(null)} />}
    </MoleculeViewerCtx.Provider>
  );
}

function MoleculeModal({ name, onClose }) {
  const [errored, setErrored] = useState(false);
  // Lock background scroll like CARS / Connections runners do.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  // Functional groups like "carboxylic acid" and "ketone" don't resolve
  // to a single PubChem compound — we substitute a representative molecule
  // (formic acid, acetone, etc.) for the structure image and surface the
  // swap in a subtitle so the user knows it's an illustrative example.
  const pubchemName = _molRepresentative.get(name) || name;
  const isRepresentative = pubchemName !== name;
  const enc = encodeURIComponent(pubchemName);
  const imgUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${enc}/PNG?image_size=large`;
  const pubchemPage = `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(name)}`;
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 max-w-md w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              {isRepresentative ? 'Functional group' : 'Molecule'}
            </div>
            <div className="text-base sm:text-lg font-semibold text-[var(--text-strong)] truncate" title={name}>{name}</div>
            {isRepresentative && (
              <div className="text-[11px] text-[var(--text-faint)] mt-0.5">
                Representative compound shown: <span className="text-[var(--text-muted)]">{pubchemName}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]"
            aria-label="Close"
          >×</button>
        </div>
        {!errored ? (
          <div className="bg-white rounded-lg p-3 flex items-center justify-center">
            <img
              src={imgUrl}
              alt={`Structure of ${pubchemName}`}
              onError={() => setErrored(true)}
              className="max-w-full h-auto"
              style={{ maxHeight: '60vh' }}
            />
          </div>
        ) : (
          <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-4 text-center">
            Couldn't load a structure image for "{pubchemName}" from PubChem.
          </div>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <a
            href={pubchemPage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--accent-text)] hover:underline"
          >
            Open on PubChem ↗
          </a>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline renderer: drops a plain string in, returns it with known molecule
// names wrapped in clickable spans that open the viewer modal. Safe to nest
// inside <p>, <li>, etc. — yields a single <span>. Use this anywhere a quiz
// or flashcard shows free-form text.
function MoleculeText({ text, className }) {
  const { open } = useMoleculeViewer();
  if (typeof text !== 'string' || !text) return text || null;
  const parts = parseMoleculesInText(text);
  if (parts.length === 1 && parts[0].type === 'text') {
    return className ? <span className={className}>{text}</span> : <>{text}</>;
  }
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === 'text') return <React.Fragment key={i}>{p.value}</React.Fragment>;
        return (
          <span
            key={i}
            role="button"
            tabIndex={0}
            // onPointerDown opens the popup before the parent button's
            // click can fire — iOS Safari swallows click events on children
            // of <button disabled>, but the pointerdown still arrives. We
            // also keep onClick for non-touch devices.
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); open(p.canonical); }}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); open(p.canonical); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); open(p.canonical); } }}
            className="text-[var(--accent-text)] underline decoration-dotted decoration-[var(--accent-border)] underline-offset-2 cursor-pointer hover:bg-[var(--accent-soft)] rounded px-0.5"
            style={{ pointerEvents: 'auto' }}
            title={`View 2D structure of ${p.canonical}`}
          >
            {p.value}
          </span>
        );
      })}
    </span>
  );
}

// Whether a string looks like (entirely is) a molecule name. Used by
// Flashcard to decide whether to show a "view structure" affordance instead
// of inline-linking, since the card is itself a button (no nested buttons).
function looksLikeMolecule(text) {
  if (typeof text !== 'string' || !text) return null;
  const trimmed = text.trim();
  if (_molLookup.has(trimmed)) return _molLookup.get(trimmed);
  const lc = trimmed.toLowerCase();
  if (_molLookup.has(lc)) {
    const cand = _molLookup.get(lc);
    if (_molAcronymExact.has(cand) && cand !== trimmed) return null;
    return cand;
  }
  return null;
}

// ---------- figure viewer (Wikipedia-backed) ----------
// Same idea as the molecule viewer, but for biology/biochem diagrams. Each
// entry's `title` is a Wikipedia article whose lead image is the figure (the
// REST summary endpoint returns thumbnail/originalimage by article title, just
// like PubChem returns a structure PNG by compound name). `label` is the
// surface form shown/linked in text; `variants` are alternate phrasings that
// resolve to the same article. `acronym: true` forces case-sensitive matching
// (e.g. "DNA") so we don't link the letters inside ordinary words.
const FIGURES = [
  // Cardiovascular / respiratory
  { label: 'heart', title: 'Heart' },
  { label: 'cardiac cycle', title: 'Cardiac cycle' },
  { label: 'cardiac muscle', title: 'Cardiac muscle', variants: ['myocardium'] },
  { label: 'circulatory system', title: 'Circulatory system', variants: ['cardiovascular system'] },
  { label: 'capillary', title: 'Capillary' },
  { label: 'respiratory system', title: 'Respiratory system' },
  { label: 'alveolus', title: 'Pulmonary alveolus', variants: ['alveoli'] },
  { label: 'lung', title: 'Lung', variants: ['lungs'] },
  // Renal / digestive
  { label: 'nephron', title: 'Nephron' },
  { label: 'kidney', title: 'Kidney' },
  { label: 'digestive system', title: 'Human digestive system' },
  { label: 'small intestine', title: 'Small intestine' },
  { label: 'liver', title: 'Liver' },
  // Nervous / muscle / sensory
  { label: 'neuron', title: 'Neuron' },
  { label: 'action potential', title: 'Action potential' },
  { label: 'synapse', title: 'Chemical synapse', variants: ['chemical synapse'] },
  { label: 'reflex arc', title: 'Reflex arc' },
  { label: 'brain', title: 'Human brain' },
  { label: 'sarcomere', title: 'Sarcomere' },
  { label: 'skeletal muscle', title: 'Skeletal muscle' },
  { label: 'eye', title: 'Human eye' },
  { label: 'ear', title: 'Ear' },
  // Immune / endocrine
  { label: 'antibody', title: 'Antibody' },
  { label: 'lymphatic system', title: 'Lymphatic system' },
  { label: 'endocrine system', title: 'Endocrine system' },
  // Cell / molecular
  { label: 'cell membrane', title: 'Cell membrane', variants: ['plasma membrane'] },
  { label: 'lipid bilayer', title: 'Lipid bilayer', variants: ['phospholipid bilayer'] },
  { label: 'mitochondrion', title: 'Mitochondrion', variants: ['mitochondria'] },
  { label: 'ribosome', title: 'Ribosome' },
  { label: 'nucleus', title: 'Cell nucleus' },
  { label: 'endoplasmic reticulum', title: 'Endoplasmic reticulum' },
  { label: 'Golgi apparatus', title: 'Golgi apparatus' },
  { label: 'cell cycle', title: 'Cell cycle' },
  { label: 'mitosis', title: 'Mitosis' },
  { label: 'meiosis', title: 'Meiosis' },
  { label: 'DNA', title: 'DNA', acronym: true },
  { label: 'DNA replication', title: 'DNA replication' },
  { label: 'transcription', title: 'Transcription (biology)' },
  { label: 'translation', title: 'Translation (biology)' },
  { label: 'nucleotide', title: 'Nucleotide' },
  // Biochem pathways / structure
  { label: 'Krebs cycle', title: 'Citric acid cycle', variants: ['citric acid cycle', 'TCA cycle', 'tricarboxylic acid cycle'] },
  { label: 'glycolysis', title: 'Glycolysis' },
  { label: 'gluconeogenesis', title: 'Gluconeogenesis' },
  { label: 'electron transport chain', title: 'Electron transport chain' },
  { label: 'oxidative phosphorylation', title: 'Oxidative phosphorylation' },
  { label: 'ATP synthase', title: 'ATP synthase' },
  { label: 'amino acid', title: 'Amino acid' },
  { label: 'alpha helix', title: 'Alpha helix' },
  { label: 'beta sheet', title: 'Beta sheet' },
  { label: 'enzyme', title: 'Enzyme' },
  { label: 'Michaelis-Menten kinetics', title: 'Michaelis–Menten kinetics', variants: ['Michaelis-Menten'] },
  { label: 'Lineweaver-Burk plot', title: 'Lineweaver–Burk plot', variants: ['Lineweaver-Burk'] },
];

// Build the figure lookup + matcher pattern once at module load (mirrors the
// molecule table builder).
const { _figRegex, _figLookup, _figAcronymExact } = (() => {
  const lookup = new Map();       // normalized surface → { label, title }
  const acronymExact = new Set(); // case-sensitive surface form for acronyms
  const allSurface = [];
  for (const f of FIGURES) {
    const allNames = [f.label, ...(f.variants || [])];
    for (const surface of allNames) {
      allSurface.push(surface);
      const entry = { label: f.label, title: f.title };
      if (f.acronym) { acronymExact.add(surface); lookup.set(surface, entry); }
      else lookup.set(surface.toLowerCase(), entry);
    }
  }
  allSurface.sort((a, b) => b.length - a.length); // longest first
  const pattern = '\\b(?:' + allSurface.map(escapeRegex).join('|') + ')\\b';
  return {
    _figRegex: new RegExp(pattern, 'gi'),
    _figLookup: lookup,
    _figAcronymExact: acronymExact,
  };
})();

// Resolve a free-form figure string (from a lesson's `figures` array) to a
// { title, label }. Known dictionary terms map to their curated article;
// anything else is treated as a literal Wikipedia article title so the
// generator can reference any figure by title.
function resolveFigure(str) {
  if (typeof str !== 'string' || !str.trim()) return null;
  const t = str.trim();
  if (_figLookup.has(t)) { const e = _figLookup.get(t); return { title: e.title, label: t }; }
  const lc = t.toLowerCase();
  if (_figLookup.has(lc)) { const e = _figLookup.get(lc); return { title: e.title, label: t }; }
  return { title: t, label: t };
}

// Segment text into plain + figure spans (explicit-dictionary pass only).
function parseFiguresInText(text) {
  if (typeof text !== 'string' || !text) return [{ type: 'text', value: text || '' }];
  const matches = [];
  _figRegex.lastIndex = 0;
  let mm;
  while ((mm = _figRegex.exec(text)) !== null) {
    const surface = mm[0];
    const idx = mm.index;
    let entry = null;
    if (_figLookup.has(surface)) entry = _figLookup.get(surface);
    else {
      const lc = surface.toLowerCase();
      if (_figLookup.has(lc)) {
        const cand = _figLookup.get(lc);
        // Acronym entries (DNA) only match their exact uppercase surface.
        if (!_figAcronymExact.has(cand.label) || cand.label === surface) entry = cand;
      }
    }
    if (entry) matches.push({ start: idx, end: idx + surface.length, value: surface, entry });
  }
  const out = [];
  let last = 0;
  for (const m of matches) {
    if (m.start < last) continue;
    if (m.start > last) out.push({ type: 'text', value: text.slice(last, m.start) });
    out.push({ type: 'fig', value: m.value, entry: m.entry });
    last = m.end;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  if (!out.length) out.push({ type: 'text', value: text });
  return out;
}

const FigureViewerCtx = createContext({ open: () => {}, close: () => {} });
function useFigureViewer() { return useContext(FigureViewerCtx); }

function FigureProvider({ children }) {
  const [target, setTarget] = useState(null); // { title, label } or null
  const ctx = useMemo(() => ({
    open: (title, label) => setTarget(title ? { title, label: label || title } : null),
    close: () => setTarget(null),
  }), []);
  return (
    <FigureViewerCtx.Provider value={ctx}>
      {children}
      {target && <FigureModal title={target.title} label={target.label} onClose={() => setTarget(null)} />}
    </FigureViewerCtx.Provider>
  );
}

function FigureModal({ title, label, onClose }) {
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    let alive = true;
    setState({ loading: true });
    const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
    const api = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
    fetch(api)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        if (!alive) return;
        const img = (j.originalimage && j.originalimage.source) || (j.thumbnail && j.thumbnail.source) || null;
        setState({ loading: false, img, extract: j.extract, pageUrl: (j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page) || pageUrl });
      })
      .catch(() => { if (alive) setState({ loading: false, errored: true, pageUrl }); });
    return () => { alive = false; };
  }, [title]);
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 max-w-lg w-full max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Figure</div>
            <div className="text-base sm:text-lg font-semibold text-[var(--text-strong)] truncate" title={label}>{label}</div>
            {title !== label && <div className="text-[11px] text-[var(--text-faint)] mt-0.5">Wikipedia: {title}</div>}
          </div>
          <button onClick={onClose} className="shrink-0 text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]" aria-label="Close">×</button>
        </div>
        {state.loading ? (
          <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-6 text-center">Loading figure…</div>
        ) : state.img ? (
          <div className="bg-white rounded-lg p-3 flex items-center justify-center">
            <img src={state.img} alt={label} className="max-w-full h-auto" style={{ maxHeight: '60vh' }} />
          </div>
        ) : (
          <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-4 text-center">
            No figure image found for "{title}".
          </div>
        )}
        {state.extract && (
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-3">{state.extract}</p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[10px] text-[var(--text-faint)]">Image via Wikipedia (CC BY-SA)</span>
          <a href={state.pageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent-text)] hover:underline">Open on Wikipedia ↗</a>
        </div>
      </div>
    </div>
  );
}

// Inline renderer: wraps known figure terms in clickable spans that open the
// figure modal. Mirrors MoleculeText. Yields a single <span>; safe in <p>/<li>.
function FigureText({ text, className }) {
  const { open } = useFigureViewer();
  if (typeof text !== 'string' || !text) return text || null;
  const parts = parseFiguresInText(text);
  if (parts.length === 1 && parts[0].type === 'text') {
    return className ? <span className={className}>{text}</span> : <>{text}</>;
  }
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === 'text') return <React.Fragment key={i}>{p.value}</React.Fragment>;
        return (
          <span
            key={i}
            role="button"
            tabIndex={0}
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); open(p.entry.title, p.entry.label); }}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); open(p.entry.title, p.entry.label); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); open(p.entry.title, p.entry.label); } }}
            className="text-[var(--accent-text)] underline decoration-dotted decoration-[var(--accent-border)] underline-offset-2 cursor-pointer hover:bg-[var(--accent-soft)] rounded px-0.5"
            style={{ pointerEvents: 'auto' }}
            title={`View figure: ${p.entry.label}`}
          >
            {p.value}
          </span>
        );
      })}
    </span>
  );
}

// ---------- quiz helpers: calculator + periodic table ----------

// Safe-ish expression evaluator. Input is allowed to contain digits, the
// four arithmetic ops, parentheses, decimal points, and the symbols below
// (rewritten to JS Math equivalents). Anything else returns NaN.
function _calcEvaluate(expr) {
  if (!expr || !expr.trim()) return '';
  let s = String(expr)
    .replace(/×/g, '*').replace(/÷/g, '/')
    .replace(/−/g, '-') // unicode minus
    // Scientific notation: 3E8 or 1.6E-19 -> (3*Math.pow(10,8)). Must run
    // before the lowercase-e -> Math.E rewrite (capital E is distinct).
    .replace(/(\d+(?:\.\d+)?)E([+-]?\d+(?:\.\d+)?)/g, '($1*Math.pow(10,$2))')
    .replace(/π/g, '(Math.PI)')
    .replace(/(?<![A-Za-z])e(?![A-Za-z0-9])/g, '(Math.E)')
    .replace(/√\s*\(/g, 'Math.sqrt(')
    .replace(/√\s*(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)')
    .replace(/(\d+(?:\.\d+)?|\))\s*\^\s*(\d+(?:\.\d+)?|\([^)]+\))/g, 'Math.pow($1,$2)')
    .replace(/\blog\(/g, 'Math.log10(')
    .replace(/\bln\(/g, 'Math.log(')
    // Inverse trig before forward trig so "asin(" isn't half-rewritten.
    .replace(/\basin\(/g, 'Math.asin(')
    .replace(/\bacos\(/g, 'Math.acos(')
    .replace(/\batan\(/g, 'Math.atan(')
    .replace(/\bsin\(/g, 'Math.sin(')
    .replace(/\bcos\(/g, 'Math.cos(')
    .replace(/\btan\(/g, 'Math.tan(')
    .replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
  // Whitelist: digits, dot, ops, parens, comma (for Math.pow args), spaces,
  // and the identifiers Math.PI/E/sqrt/pow/log/log10/sin/cos/tan/asin/acos/atan.
  if (!/^[0-9+\-*/().,\s]|Math\.(PI|E|sqrt|pow|log|log10|asin|acos|atan|sin|cos|tan)/.test(s)) return NaN;
  const stripped = s.replace(/Math\.(PI|E|sqrt|pow|log10|log|asin|acos|atan|sin|cos|tan)/g, '');
  if (/[^0-9+\-*/().,\s]/.test(stripped)) return NaN;
  try {
    // eslint-disable-next-line no-new-func
    const v = new Function('return (' + s + ')')();
    if (typeof v !== 'number' || !Number.isFinite(v)) return NaN;
    return v;
  } catch { return NaN; }
}

function CalculatorModal({ expr, setExpr, onClose, onMinimize, minimized }) {
  const result = useMemo(() => {
    if (!expr.trim()) return '';
    const v = _calcEvaluate(expr);
    if (Number.isNaN(v)) return '';
    // Trim long floats — show up to 10 significant digits.
    if (Number.isInteger(v)) return String(v);
    const fixed = Number(v.toPrecision(10));
    return String(fixed);
  }, [expr]);
  useEffect(() => {
    if (minimized) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onMinimize(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onMinimize, minimized]);
  const push = (s) => setExpr((p) => p + s);
  const back = () => setExpr((p) => p.slice(0, -1));
  const ac   = () => setExpr('');
  const equals = () => { if (result !== '') setExpr(result); };

  // Minimized: a small floating pill that keeps the running expression/result
  // so you can peek at the problem again, then tap to restore the keypad.
  if (minimized) {
    return (
      <button
        onClick={onMinimize}
        title="Restore calculator"
        className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-soft)] shadow-lg rounded-full pl-3 pr-4 py-2 hover:bg-[var(--bg-hover)]"
      >
        <span className="text-base">🧮</span>
        <span className="font-mono text-sm text-[var(--text-strong)] max-w-[10rem] truncate text-right">
          {result || expr || '0'}
        </span>
      </button>
    );
  }

  // Scientific ops incl. trig + inverse trig and an EE (×10ⁿ) key.
  const sci = [
    ['(', () => push('(')], [')', () => push(')')],
    ['π', () => push('π')], ['e', () => push('e')], ['EE', () => push('E')],
    ['√', () => push('√(')], ['x²', () => push('^2')], ['xʸ', () => push('^')],
    ['log', () => push('log(')], ['ln', () => push('ln(')],
    ['sin', () => push('sin(')], ['cos', () => push('cos(')], ['tan', () => push('tan(')], ['%', () => push('%')],
    ['sin⁻¹', () => push('asin(')], ['cos⁻¹', () => push('acos(')], ['tan⁻¹', () => push('atan(')],
  ];
  const grid = [
    ['AC', ac, 'op'], ['⌫', back, 'op'], ['÷', () => push('÷'), 'op'], ['×', () => push('×'), 'op'],
    ['7', () => push('7')], ['8', () => push('8')], ['9', () => push('9')], ['−', () => push('-'), 'op'],
    ['4', () => push('4')], ['5', () => push('5')], ['6', () => push('6')], ['+', () => push('+'), 'op'],
    ['1', () => push('1')], ['2', () => push('2')], ['3', () => push('3')], ['=', equals, 'eq'],
    ['0', () => push('0')], ['.', () => push('.')],
  ];
  return (
    <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4" onClick={onMinimize}>
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 w-full max-w-sm space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Calculator</div>
          <div className="flex items-center gap-2">
            <button onClick={onMinimize} className="text-xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]" title="Minimize (keeps your work)" aria-label="Minimize">—</button>
            <button onClick={onClose} className="text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]" aria-label="Close">×</button>
          </div>
        </div>
        <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-3">
          <div className="text-right text-sm text-[var(--text-faint)] font-mono break-all min-h-[1.25rem]">{expr || ' '}</div>
          <div className="text-right text-2xl font-semibold text-[var(--text-strong)] font-mono break-all min-h-[2rem]">{result || (expr ? '…' : '0')}</div>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {sci.map(([label, fn]) => (
            <button
              key={label}
              onClick={fn}
              className="text-xs px-1 py-2 border border-[var(--border)] rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
            >{label}</button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {grid.map(([label, fn, kind], i) => {
            const isOp = kind === 'op';
            const isEq = kind === 'eq';
            const wide = label === '0';
            return (
              <button
                key={i}
                onClick={fn}
                className={`text-base font-medium py-3 rounded transition-colors ${wide ? 'col-span-2' : ''} ${
                  isEq ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                  : isOp ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] hover:bg-[var(--bg-hover)]'
                  : 'bg-[var(--bg-elev)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)]'
                }`}
              >{label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// All 118 elements with their (col, row) position in the standard
// extended periodic-table layout. Lanthanides go in row 8 (cols 3-17),
// actinides in row 9. Category codes: am alkali metal, ae alkaline
// earth, tm transition, pt post-transition, ml metalloid, nm nonmetal,
// ha halogen, ng noble gas, ln lanthanide, ac actinide.
const PERIODIC_TABLE = (
  // sym, name, atomicNumber, atomicMass, col, row, category
  'H,Hydrogen,1,1.008,1,1,nm|He,Helium,2,4.003,18,1,ng|' +
  'Li,Lithium,3,6.94,1,2,am|Be,Beryllium,4,9.012,2,2,ae|B,Boron,5,10.81,13,2,ml|C,Carbon,6,12.01,14,2,nm|N,Nitrogen,7,14.01,15,2,nm|O,Oxygen,8,16.00,16,2,nm|F,Fluorine,9,19.00,17,2,ha|Ne,Neon,10,20.18,18,2,ng|' +
  'Na,Sodium,11,22.99,1,3,am|Mg,Magnesium,12,24.31,2,3,ae|Al,Aluminum,13,26.98,13,3,pt|Si,Silicon,14,28.09,14,3,ml|P,Phosphorus,15,30.97,15,3,nm|S,Sulfur,16,32.06,16,3,nm|Cl,Chlorine,17,35.45,17,3,ha|Ar,Argon,18,39.95,18,3,ng|' +
  'K,Potassium,19,39.10,1,4,am|Ca,Calcium,20,40.08,2,4,ae|Sc,Scandium,21,44.96,3,4,tm|Ti,Titanium,22,47.87,4,4,tm|V,Vanadium,23,50.94,5,4,tm|Cr,Chromium,24,52.00,6,4,tm|Mn,Manganese,25,54.94,7,4,tm|Fe,Iron,26,55.85,8,4,tm|Co,Cobalt,27,58.93,9,4,tm|Ni,Nickel,28,58.69,10,4,tm|Cu,Copper,29,63.55,11,4,tm|Zn,Zinc,30,65.38,12,4,tm|Ga,Gallium,31,69.72,13,4,pt|Ge,Germanium,32,72.63,14,4,ml|As,Arsenic,33,74.92,15,4,ml|Se,Selenium,34,78.97,16,4,nm|Br,Bromine,35,79.90,17,4,ha|Kr,Krypton,36,83.80,18,4,ng|' +
  'Rb,Rubidium,37,85.47,1,5,am|Sr,Strontium,38,87.62,2,5,ae|Y,Yttrium,39,88.91,3,5,tm|Zr,Zirconium,40,91.22,4,5,tm|Nb,Niobium,41,92.91,5,5,tm|Mo,Molybdenum,42,95.95,6,5,tm|Tc,Technetium,43,98,7,5,tm|Ru,Ruthenium,44,101.1,8,5,tm|Rh,Rhodium,45,102.9,9,5,tm|Pd,Palladium,46,106.4,10,5,tm|Ag,Silver,47,107.9,11,5,tm|Cd,Cadmium,48,112.4,12,5,tm|In,Indium,49,114.8,13,5,pt|Sn,Tin,50,118.7,14,5,pt|Sb,Antimony,51,121.8,15,5,ml|Te,Tellurium,52,127.6,16,5,ml|I,Iodine,53,126.9,17,5,ha|Xe,Xenon,54,131.3,18,5,ng|' +
  'Cs,Caesium,55,132.9,1,6,am|Ba,Barium,56,137.3,2,6,ae|La,Lanthanum,57,138.9,3,8,ln|Ce,Cerium,58,140.1,4,8,ln|Pr,Praseodymium,59,140.9,5,8,ln|Nd,Neodymium,60,144.2,6,8,ln|Pm,Promethium,61,145,7,8,ln|Sm,Samarium,62,150.4,8,8,ln|Eu,Europium,63,152.0,9,8,ln|Gd,Gadolinium,64,157.2,10,8,ln|Tb,Terbium,65,158.9,11,8,ln|Dy,Dysprosium,66,162.5,12,8,ln|Ho,Holmium,67,164.9,13,8,ln|Er,Erbium,68,167.3,14,8,ln|Tm,Thulium,69,168.9,15,8,ln|Yb,Ytterbium,70,173.0,16,8,ln|Lu,Lutetium,71,175.0,17,8,ln|Hf,Hafnium,72,178.5,4,6,tm|Ta,Tantalum,73,180.9,5,6,tm|W,Tungsten,74,183.8,6,6,tm|Re,Rhenium,75,186.2,7,6,tm|Os,Osmium,76,190.2,8,6,tm|Ir,Iridium,77,192.2,9,6,tm|Pt,Platinum,78,195.1,10,6,tm|Au,Gold,79,197.0,11,6,tm|Hg,Mercury,80,200.6,12,6,tm|Tl,Thallium,81,204.4,13,6,pt|Pb,Lead,82,207.2,14,6,pt|Bi,Bismuth,83,209.0,15,6,pt|Po,Polonium,84,209,16,6,ml|At,Astatine,85,210,17,6,ha|Rn,Radon,86,222,18,6,ng|' +
  'Fr,Francium,87,223,1,7,am|Ra,Radium,88,226,2,7,ae|Ac,Actinium,89,227,3,9,ac|Th,Thorium,90,232.0,4,9,ac|Pa,Protactinium,91,231.0,5,9,ac|U,Uranium,92,238.0,6,9,ac|Np,Neptunium,93,237,7,9,ac|Pu,Plutonium,94,244,8,9,ac|Am,Americium,95,243,9,9,ac|Cm,Curium,96,247,10,9,ac|Bk,Berkelium,97,247,11,9,ac|Cf,Californium,98,251,12,9,ac|Es,Einsteinium,99,252,13,9,ac|Fm,Fermium,100,257,14,9,ac|Md,Mendelevium,101,258,15,9,ac|No,Nobelium,102,259,16,9,ac|Lr,Lawrencium,103,266,17,9,ac|Rf,Rutherfordium,104,267,4,7,tm|Db,Dubnium,105,268,5,7,tm|Sg,Seaborgium,106,269,6,7,tm|Bh,Bohrium,107,270,7,7,tm|Hs,Hassium,108,277,8,7,tm|Mt,Meitnerium,109,278,9,7,tm|Ds,Darmstadtium,110,281,10,7,tm|Rg,Roentgenium,111,282,11,7,tm|Cn,Copernicium,112,285,12,7,tm|Nh,Nihonium,113,286,13,7,pt|Fl,Flerovium,114,289,14,7,pt|Mc,Moscovium,115,290,15,7,pt|Lv,Livermorium,116,293,16,7,pt|Ts,Tennessine,117,294,17,7,ha|Og,Oganesson,118,294,18,7,ng'
).split('|').map((row) => {
  const p = row.split(',');
  return { sym: p[0], name: p[1], num: +p[2], mass: +p[3], col: +p[4], row: +p[5], cat: p[6] };
});

const PERIODIC_CATEGORIES = {
  am: { label: 'Alkali metal',       bg: '#f4c64a', fg: '#3a2a05' },
  ae: { label: 'Alkaline earth',     bg: '#f6dd6e', fg: '#3a2e05' },
  tm: { label: 'Transition metal',   bg: '#f0a888', fg: '#3a1a05' },
  pt: { label: 'Post-transition',    bg: '#b8c5d4', fg: '#1a232c' },
  ml: { label: 'Metalloid',          bg: '#b4dca2', fg: '#0e2a08' },
  nm: { label: 'Nonmetal',           bg: '#7dd0c4', fg: '#062624' },
  ha: { label: 'Halogen',            bg: '#9bb6f1', fg: '#0a1838' },
  ng: { label: 'Noble gas',          bg: '#c89af0', fg: '#1f0838' },
  ln: { label: 'Lanthanide',         bg: '#f0a6d1', fg: '#380a26' },
  ac: { label: 'Actinide',           bg: '#f08a8a', fg: '#380a0a' },
};

function PeriodicTableModal({ onClose }) {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') { if (selected) setSelected(null); else onClose(); } };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose, selected]);
  return (
    <div className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3" onClick={onClose}>
      <div
        // Flex column with a fixed max height. Header + details + legend
        // stay pinned; only the periodic-table grid in the middle scrolls
        // horizontally — so on phones you can swipe left/right across the
        // full 18-column table without the selected-element panel
        // disappearing off-screen.
        className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-3 sm:p-4 w-full max-w-5xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Periodic table</div>
            <div className="text-sm font-semibold text-[var(--text-strong)]">{selected ? `${selected.name} (${selected.sym})` : 'Tap an element for details'}</div>
          </div>
          <button onClick={onClose} className="text-2xl leading-none text-[var(--text-muted)] hover:text-[var(--text-strong)]" aria-label="Close">×</button>
        </div>

        {/* Scrollable element grid. The grid has a comfortable min width so
            each cell stays legible; on narrow viewports the user swipes the
            inner container horizontally. The wrapping div is overflow-x:auto
            and shrinks vertically to the grid's natural height. */}
        <div className="overflow-x-auto overflow-y-hidden shrink-0 -mx-1 px-1 pb-2">
          <div
            className="grid gap-[2px]"
            style={{
              gridTemplateColumns: 'repeat(18, minmax(34px, 1fr))',
              gridAutoRows: 'minmax(0, 1fr)',
              aspectRatio: '18 / 11',
              minWidth: '720px',
            }}
          >
            {PERIODIC_TABLE.map((el) => {
              const cat = PERIODIC_CATEGORIES[el.cat] || { bg: '#888', fg: '#fff' };
              return (
                <button
                  key={el.num}
                  onClick={() => setSelected(el)}
                  style={{
                    gridColumnStart: el.col,
                    gridRowStart: el.row,
                    background: cat.bg,
                    color: cat.fg,
                  }}
                  className="flex flex-col items-stretch justify-between rounded-[3px] p-0.5 text-left leading-none hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]"
                  title={`${el.name} · #${el.num} · ${el.mass}`}
                >
                  <div className="text-[8px] sm:text-[10px] opacity-80">{el.num}</div>
                  <div className="text-[12px] sm:text-base font-bold text-center">{el.sym}</div>
                  <div className="text-[7px] sm:text-[8px] opacity-70 text-center">{el.mass}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fixed bottom panel: selected-element details + category legend.
            Sits below the scrollable grid and stays put as the user pans. */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 overflow-y-auto">
          <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-xs">
            {selected ? (
              <>
                <div className="text-[var(--text-faint)] uppercase tracking-wide text-[10px]">{PERIODIC_CATEGORIES[selected.cat]?.label || ''}</div>
                <div className="font-semibold text-base text-[var(--text-strong)] mt-0.5">{selected.name} — {selected.sym}</div>
                <div className="text-[var(--text-muted)] mt-1.5 space-y-0.5">
                  <div>Atomic number: <span className="font-mono text-[var(--text)]">{selected.num}</span></div>
                  <div>Atomic mass: <span className="font-mono text-[var(--text)]">{selected.mass}</span></div>
                  <div>Position: period {selected.row > 7 ? (selected.cat === 'ln' ? 6 : 7) : selected.row}, group {selected.row > 7 ? '—' : selected.col}</div>
                </div>
              </>
            ) : (
              <div className="text-[var(--text-muted)]">Tap any element to see its name, atomic number, and atomic mass.</div>
            )}
          </div>
          <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1.5">Categories</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {Object.entries(PERIODIC_CATEGORIES).map(([k, c]) => (
                <div key={k} className="flex items-center gap-2 text-[11px]">
                  <span className="inline-block w-3 h-3 rounded shrink-0" style={{ background: c.bg }} />
                  <span className="text-[var(--text-muted)] truncate">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Click-to-flip flashcard. Front = term, back = definition. Both faces are
// stacked in the same grid cell so the card auto-sizes to whichever face is
// taller — no internal scrollbar, no clipped definitions.
//
// Container is a <div role="button"> rather than an actual <button> so the
// inline molecule-link spans (which are also role="button") nest in valid
// HTML — buttons can't contain buttons. Clicks bubble up to toggle flip;
// MoleculeText spans stopPropagation so they don't accidentally flip.
function Flashcard({ term, definition }) {
  const [flipped, setFlipped] = useState(false);
  const { open: openMol } = useMoleculeViewer();
  const termMol = looksLikeMolecule(term);
  const flip = () => setFlipped((f) => !f);
  return (
    <div
      onClick={flip}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } }}
      role="button"
      tabIndex={0}
      data-no-haptic
      className="relative w-full text-left grid rounded-lg overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]"
      aria-label={flipped ? `Definition of ${term}` : `Show definition of ${term}`}
    >
      <div
        className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg p-3 flex flex-col justify-center transition-opacity duration-200"
        style={{ gridArea: '1 / 1', opacity: flipped ? 0 : 1, pointerEvents: flipped ? 'none' : 'auto' }}
        aria-hidden={flipped}
      >
        <div className="text-[10px] uppercase tracking-wide text-[var(--text-faint)] flex items-center justify-between gap-2">
          <span>Term</span>
          {termMol && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); openMol(termMol); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); openMol(termMol); } }}
              className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] cursor-pointer normal-case tracking-normal"
              title={`View 2D structure of ${termMol}`}
            >
              🧪 Structure
            </span>
          )}
        </div>
        <div className="text-sm sm:text-base font-semibold text-[var(--text-strong)] leading-snug">{term}</div>
        <div className="text-[10px] text-[var(--text-fainter)] mt-1">Tap to flip</div>
      </div>
      <div
        className="bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-lg p-3 transition-opacity duration-200"
        style={{ gridArea: '1 / 1', opacity: flipped ? 1 : 0, pointerEvents: flipped ? 'auto' : 'none' }}
        aria-hidden={!flipped}
      >
        <div className="text-[10px] uppercase tracking-wide text-[var(--accent-text)] flex items-center justify-between gap-2">
          <span className="truncate">{term}</span>
          {termMol && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); openMol(termMol); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); openMol(termMol); } }}
              className="shrink-0 text-[10px] px-1.5 py-0.5 rounded border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--bg-hover)] cursor-pointer normal-case tracking-normal"
              title={`View 2D structure of ${termMol}`}
            >
              🧪
            </span>
          )}
        </div>
        <div className="text-xs sm:text-sm text-[var(--text)] leading-snug mt-0.5"><MoleculeText text={definition} /></div>
      </div>
    </div>
  );
}

function RelatedFlashcards({ item }) {
  const { extractions } = useApp();
  const related = useMemo(() => relatedTermsForItem(item, extractions), [item, extractions]);
  if (related.length === 0) return null;
  return (
    <div className="border-t border-[var(--border-soft)] pt-3 mt-3">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
        Related terms · {related.length}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {related.map((kt) => (
          <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
        ))}
      </div>
    </div>
  );
}

// Amino-acid structures are served from same-origin PNGs under assets/aa/<cid>.png
// (committed in this repo) so they always load. This maps any structure URL a
// question might carry -- the new relative path, or a PubChem URL baked into an
// already-downloaded chapter bank -- to that local file, so cached question banks
// keep working without a re-download. Unknown URLs are returned unchanged.
const AA_NAME_TO_CID = {
  glycine: 750, 'l-alanine': 5950, 'l-valine': 6287, 'l-leucine': 6106,
  'l-isoleucine': 6306, 'l-proline': 145742, 'l-methionine': 6137,
  'l-phenylalanine': 6140, 'l-tyrosine': 6057, 'l-tryptophan': 6305,
  'l-serine': 5951, 'l-threonine': 6288, 'l-cysteine': 5862,
  'l-asparagine': 6267, 'l-glutamine': 5961, 'l-aspartic acid': 5960,
  'l-glutamic acid': 33032, 'l-lysine': 5962, 'l-arginine': 6322,
  'l-histidine': 6274,
};
function localStructure(url) {
  if (typeof url !== 'string' || !url) return url;
  if (url.startsWith('assets/')) return url; // already local
  let m = url.match(/[?&]cid=(\d+)/) || url.match(/\/cid\/(\d+)/);
  if (m) return `assets/aa/${m[1]}.png`;
  m = url.match(/\/name\/([^/]+)\/PNG/i);
  if (m) {
    const cid = AA_NAME_TO_CID[decodeURIComponent(m[1]).toLowerCase()];
    if (cid) return `assets/aa/${cid}.png`;
  }
  return url;
}
// True when an MC choice's value is an image (a structure) rather than text.
function isImagePath(s) {
  return typeof s === 'string' &&
    (s.startsWith('assets/') || /pubchem\.ncbi/i.test(s) || /\.(png|jpe?g|svg|gif|webp)(\?|$)/i.test(s));
}

function MCQuestion({ item, onAnswer, nextSlot, onFlag }) {
  const [picked, setPicked] = useState(null);
  const shuffled = useMemo(() => {
    const arr = (item.q.choices || []).map((text, origIdx) => ({ text, origIdx }));
    return shuffle(arr);
  }, [item.id]);

  // Like a regular MC question, but any choice whose value is an image path
  // (assets/aa/<cid>.png) renders as a molecule image instead of text.
  const promptImage = item.q.image; // optional structure shown above the prompt
  const choicesAreImages = (item.q.choices || []).some(isImagePath);

  const submit = (entry) => {
    if (picked !== null) return;
    setPicked(entry);
    const correct = entry.origIdx === item.q.correct_index;
    playSfx(correct ? 'correct' : 'wrong');
    if (correct) vibrateCorrect(); else vibrateWrong();
    const labels = item.q.choice_labels;
    const ua = Array.isArray(labels) && labels[entry.origIdx] != null ? labels[entry.origIdx] : entry.text;
    onAnswer({ correct, user_answer: ua });
  };

  return (
    <div className="question-card space-y-4">
      {/* Optional structure shown above the prompt. PNGs are dark-on-transparent,
          so they sit on white to stay visible in dark themes. */}
      {promptImage && (
        <div className="bg-white rounded-lg p-3 flex items-center justify-center">
          <img src={localStructure(promptImage)} alt="Molecule structure" loading="lazy" className="max-w-full h-auto" style={{ maxHeight: '220px' }} />
        </div>
      )}
      {/* Plain prompt when the answers are structures, so the molecule named in
          the prompt can't be tapped to reveal the answer. */}
      <p className="text-base leading-relaxed">{promptImage || choicesAreImages ? item.q.question : <MoleculeText text={item.q.question} />}</p>
      <div className="space-y-2">
        {shuffled.map((entry, i) => {
          const isPicked = picked && entry.origIdx === picked.origIdx;
          const isCorrect = entry.origIdx === item.q.correct_index;
          let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
          if (picked) {
            if (isCorrect) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (isPicked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else cls = 'border-[var(--border-soft)] opacity-60';
          }
          // A regular MC choice button: an image when the choice is a structure,
          // otherwise text (molecule names stay tappable to open the viewer).
          return (
            <button
              key={i}
              onClick={() => submit(entry)}
              disabled={picked !== null}
              data-no-haptic
              className={`w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors ${cls}`}
            >
              <span className="text-[var(--text-faint)] mr-2 align-middle">{String.fromCharCode(65 + i)}.</span>
              {isImagePath(entry.text)
                ? <span className="bg-white rounded-md p-1 inline-flex align-middle"><img src={localStructure(entry.text)} alt="Molecule structure" loading="lazy" className="h-auto" style={{ maxHeight: '120px', maxWidth: '100%' }} /></span>
                : <MoleculeText text={entry.text} />}
            </button>
          );
        })}
      </div>
      {picked && (
        <>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className={picked.origIdx === item.q.correct_index ? 'text-[var(--success-text)] font-medium' : 'text-[var(--danger-text)] font-medium'}>
              {picked.origIdx === item.q.correct_index ? 'Correct' : 'Incorrect'}
            </div>
            <div className="flex items-center gap-2">
              {onFlag && (
                <button onClick={onFlag} className="text-xs text-[var(--text-muted)] hover:text-[var(--warning-text-strong)] border border-[var(--border)] rounded px-2 py-1" title="Flag this question for review">
                  ⚑ Flag
                </button>
              )}
              {nextSlot}
            </div>
          </div>
          <div className="answer-reveal bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]">
            <MoleculeText text={item.q.explanation} />
          </div>
          <RelatedFlashcards item={item} />
        </>
      )}
    </div>
  );
}

// ---------- quiz: short answer ----------
function ShortAnswerQuestion({ item, onAnswer, onAnswerOverride, nextSlot }) {
  const { client, apiKey } = useApp();
  const [text, setText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(false);
  // Auto-grade state from Gemini 2.5 Flash. null until reveal; { passes,
  // score, feedback, hit_points, missed_points } after a successful grade;
  // { error } if the grading call fails.
  const [auto, setAuto] = useState(null);
  const [autoBusy, setAutoBusy] = useState(false);

  // Exact-match questions (e.g. amino-acid abbreviations) grade deterministically
  // with no Gemini key, since the answer is one short string. Accept the ideal
  // answer plus any key_points / explicit accept list, case-insensitively.
  const exact = !!item.q.exact;
  const norm = (s) => (s || '').trim().toLowerCase().replace(/\.+$/, '');
  const accepted = exact
    ? [item.q.ideal_answer, ...(item.q.key_points || []), ...(item.q.accept || [])].map(norm).filter(Boolean)
    : null;
  const [exactCorrect, setExactCorrect] = useState(null);

  const submit = async () => {
    setRevealed(true);
    // Exact match: grade locally and finalize immediately (no Gemini).
    if (exact) {
      const ok = accepted.includes(norm(text));
      setExactCorrect(ok);
      finalize(ok);
      return;
    }
    // Otherwise auto-grade only when a Gemini key is configured; else fall back
    // to manual Got it / Missed it.
    if (!apiKey || !text.trim()) return;
    setAutoBusy(true);
    try {
      const res = await client.gradeShortAnswer({
        prompt: item.q.prompt,
        ideal_answer: item.q.ideal_answer,
        key_points: item.q.key_points,
        user_answer: text,
        chapter: item.chapter,
      });
      setAuto(res);
    } catch (e) {
      setAuto({ error: e?.message || 'grading failed' });
    } finally {
      setAutoBusy(false);
    }
  };
  const finalize = (correct) => {
    if (graded) return;
    setGraded(true);
    playSfx(correct ? 'correct' : 'wrong');
    if (correct) vibrateCorrect(); else vibrateWrong();
    onAnswer({ correct, user_answer: text });
  };
  // Once auto-grade arrives, auto-finalize the attempt with its verdict.
  // The user can still tap "Override" below to flip it before continuing.
  useEffect(() => {
    if (auto && typeof auto.passes === 'boolean' && !graded) {
      finalize(!!auto.passes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const [manualOverride, setManualOverride] = useState(false);
  const verdictPasses = auto && typeof auto.passes === 'boolean'
    ? (manualOverride ? !auto.passes : !!auto.passes)
    : null;

  const flipVerdict = () => {
    if (!graded || !auto || typeof auto.passes !== 'boolean') return;
    // Flip the displayed verdict AND patch the recorded attempt so stats
    // and server-side sync reflect the override. The parent's update
    // hook re-marks the row un-synced; the server upserts on
    // (user_id, client_id) and overwrites the prior `correct` value.
    const newOverride = !manualOverride;
    setManualOverride(newOverride);
    const newPasses = newOverride ? !auto.passes : !!auto.passes;
    onAnswerOverride?.({ correct: newPasses });
  };

  return (
    <div className="question-card space-y-4">
      <p className="text-base leading-relaxed"><MoleculeText text={item.q.prompt} /></p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={revealed}
        rows={4}
        placeholder="Write your answer…"
        className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm disabled:opacity-70"
      />
      {!revealed ? (
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg px-4 py-2 text-sm font-medium"
        >
          {apiKey || exact ? 'Submit answer' : 'Reveal answer'}
        </button>
      ) : (
        <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-4 space-y-3">
          {/* Exact-match verdict (deterministic, no Gemini). */}
          {exact && (
            <div className={`text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded inline-block ${exactCorrect
              ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
              : 'bg-[var(--danger-bg)] text-[var(--danger-text)]'}`}>
              {exactCorrect ? '✓ Correct' : '✗ Incorrect'}
            </div>
          )}
          {/* Auto-grade panel (only when an API key is configured) */}
          {apiKey && !exact && (
            <div className="border-b border-[var(--border-soft)] pb-3 -mt-1">
              {autoBusy ? (
                <div className="flex items-center gap-2 text-sm text-[var(--accent-text)]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span>Grading your answer with Gemini…</span>
                </div>
              ) : auto?.error ? (
                <div className="text-xs text-[var(--danger-text)]">Auto-grading failed: {auto.error}. Use the Got it / Missed it buttons below.</div>
              ) : auto && typeof auto.passes === 'boolean' ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded ${verdictPasses
                      ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
                      : 'bg-[var(--danger-bg)] text-[var(--danger-text)]'}`}>
                      {verdictPasses ? '✓ Full credit' : '✗ Not enough'}
                    </span>
                    {typeof auto.score === 'number' && (
                      <span className="text-xs text-[var(--text-faint)] font-mono">score {auto.score}/100</span>
                    )}
                    <button
                      onClick={flipVerdict}
                      className="ml-auto text-[11px] px-2 py-0.5 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
                      title="Disagree with the auto-grade? Flip the verdict — your stats and account sync update too."
                    >
                      Override
                    </button>
                  </div>
                  {auto.feedback && (
                    <div className="text-xs text-[var(--text-muted)]">
                      <MoleculeText text={auto.feedback} />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--success-text)] mb-1">Ideal answer</div>
            <div className="text-sm text-[var(--text-strong)]"><MoleculeText text={item.q.ideal_answer} /></div>
          </div>
          {!exact && item.q.key_points?.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent-text)] mb-1">Key points</div>
              <ul className="text-sm text-[var(--text)] list-disc pl-5 space-y-0.5">
                {item.q.key_points.map((p, i) => {
                  // Mark hit / missed when auto-grader returned indices.
                  const idx = i + 1;
                  const hit = auto?.hit_points?.includes(idx);
                  const missed = auto?.missed_points?.includes(idx);
                  return (
                    <li key={i} className={hit ? 'text-[var(--success-text)]' : missed ? 'text-[var(--danger-text)]' : ''}>
                      {hit ? '✓ ' : missed ? '✗ ' : ''}<MoleculeText text={p} />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* If no API key (or auto failed) fall back to manual grading. */}
          {!graded ? (
            <div className="flex gap-2 pt-2 border-t border-[var(--border-soft)]">
              <span className="text-xs text-[var(--text-muted)] self-center mr-2">How did you do?</span>
              <button onClick={() => finalize(false)} className="text-sm px-3 py-1.5 border border-[var(--danger-border)] text-[var(--danger-text)] hover:bg-[var(--danger-bg)] rounded">
                Missed it
              </button>
              <button onClick={() => finalize(true)} className="text-sm px-3 py-1.5 border border-[var(--success-border)] text-[var(--success-text)] hover:bg-[var(--success-bg)] rounded">
                Got it
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-soft)]">
              <div className="text-xs text-[var(--text-faint)]">
                {exact || (auto && typeof auto.passes === 'boolean') ? 'Auto-graded.' : 'Graded.'}
              </div>
              {nextSlot}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- quiz: matching ----------
// ---------- quiz: two-part ----------
function TwoPartQuestion({ item, onAnswer, nextSlot, onFlag }) {
  const parts = item.q.parts || [];
  const [partIdx, setPartIdx] = useState(0);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  if (parts.length === 0) {
    return <div className="text-sm text-[var(--text-muted)]">Malformed two-part question.</div>;
  }

  const handlePartAnswer = (res) => {
    const nextResults = [...results, res];
    setResults(nextResults);
    if (partIdx + 1 < parts.length) {
      onAnswer({ ...res, isInterim: true });
      setPartIdx((i) => i + 1);
    } else {
      // Parts flagged noScore (e.g. the practice drawing) don't count toward the
      // combined result, so skipping or attempting them can't change your score.
      const scored = nextResults.filter((r) => !r.noScore);
      const allCorrect = scored.length ? scored.every((r) => r.correct) : true;
      setDone(true);
      onAnswer({
        correct: allCorrect,
        user_answer: nextResults.map((r, i) => `P${i + 1}: ${r.user_answer}`).join(' | '),
      });
    }
  };

  // Render every part reached so far, stacked, so an answered part (with its
  // pick, correct answer, and explanation) stays visible while the next part
  // is in progress. Each SinglePart keeps a stable key so it is never
  // remounted — that's what preserves the earlier part's revealed state.
  return (
    <div className="space-y-4">
      <span className="block text-xs uppercase tracking-wide text-[var(--accent-text)]">
        Two-part · {item.q.theme}
      </span>
      {parts.slice(0, partIdx + 1).map((p, i) => (
        <div key={i} className="space-y-2">
          <span className="block text-xs text-[var(--text-faint)]">Part {i + 1} of {parts.length}</span>
          {p.draw ? (
            <DrawPart
              part={p}
              onAnswer={handlePartAnswer}
              nextSlot={done && i === parts.length - 1 ? nextSlot : null}
            />
          ) : (
            <SinglePart
              part={p}
              onAnswer={handlePartAnswer}
              nextSlot={done && i === parts.length - 1 ? nextSlot : null}
              continueLabel={i === parts.length - 1 ? null : 'Continue →'}
            />
          )}
        </div>
      ))}
      {done && onFlag && (
        <div className="flex justify-end">
          <button
            onClick={onFlag}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--warning-text-strong)] border border-[var(--border)] rounded px-2 py-1"
            title="Flag this two-part item for review"
          >
            ⚑ Flag
          </button>
        </div>
      )}
    </div>
  );
}

function SinglePart({ part, onAnswer, nextSlot, continueLabel }) {
  const [picked, setPicked] = useState(null);
  const [advanced, setAdvanced] = useState(false);
  const shuffled = useMemo(() => {
    const arr = (part.choices || []).map((text, origIdx) => ({ text, origIdx }));
    return shuffle(arr);
  }, [part]);

  const submit = (entry) => {
    if (picked !== null) return;
    setPicked(entry);
    const correct = entry.origIdx === part.correct_index;
    playSfx(correct ? 'correct' : 'wrong');
    if (correct) vibrateCorrect(); else vibrateWrong();
  };

  const onContinue = () => {
    if (picked === null || advanced) return;
    setAdvanced(true);
    const correct = picked.origIdx === part.correct_index;
    onAnswer({ correct, user_answer: picked.text });
  };

  // A structure-identification part shows a 2D structure (e.g. a PubChem PNG
  // by name) with the answer hidden. PubChem renders black-on-transparent, so
  // the image must sit on white to stay visible in dark themes. When an image
  // is present we also render the choices as PLAIN text rather than linked
  // MoleculeText — otherwise tapping a choice would open that molecule's
  // structure and turn a recall question into visual matching.
  const hasImage = typeof part.image === 'string' && part.image;
  return (
    <div className="question-card space-y-4">
      {hasImage && (
        <div className="bg-white rounded-lg p-3 flex items-center justify-center">
          <img
            src={localStructure(part.image)}
            alt="Molecular structure"
            loading="lazy"
            className="max-w-full h-auto"
            style={{ maxHeight: '240px' }}
          />
        </div>
      )}
      <p className="text-base leading-relaxed"><MoleculeText text={part.question} /></p>
      <div className="space-y-2">
        {shuffled.map((entry, i) => {
          const isPicked = picked && entry.origIdx === picked.origIdx;
          const isCorrect = entry.origIdx === part.correct_index;
          let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
          if (picked) {
            if (isCorrect) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (isPicked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else cls = 'border-[var(--border-soft)] opacity-60';
          }
          // Same molecule-always-linked pattern as MCQuestion — molecule
          // span clicks stop propagation, rest of the button still picks.
          // (Suppressed for structure-ID parts so the answer can't be peeked.)
          return (
            <button
              key={i}
              onClick={() => submit(entry)}
              disabled={picked !== null}
              data-no-haptic
              className={`w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors ${cls}`}
            >
              <span className="text-[var(--text-faint)] mr-2">{String.fromCharCode(65 + i)}.</span>
              {hasImage ? entry.text : <MoleculeText text={entry.text} />}
            </button>
          );
        })}
      </div>
      {picked && (
        <>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className={picked.origIdx === part.correct_index ? 'text-[var(--success-text)] font-medium' : 'text-[var(--danger-text)] font-medium'}>
              {picked.origIdx === part.correct_index ? 'Correct' : 'Incorrect'}
            </div>
            {!advanced && (
              <button
                onClick={onContinue}
                className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium"
              >
                {continueLabel || 'Continue →'}
              </button>
            )}
            {advanced && nextSlot}
          </div>
          <div className="answer-reveal bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]">
            <MoleculeText text={part.explanation} />
          </div>
        </>
      )}
    </div>
  );
}

// A "draw it" part for a two-part question: the prompt names an amino acid, the
// user sketches it on a canvas, then reveals the real structure and self-grades.
// Mirrors SinglePart's contract (onAnswer + nextSlot) so TwoPartQuestion can mix
// draw parts and multiple-choice parts in the same question.
function DrawPart({ part, onAnswer, nextSlot }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [advanced, setAdvanced] = useState(false); // true once skipped or continued

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const w = c.clientWidth || 300;
    const h = 240;
    c.width = w * ratio;
    c.height = h * ratio;
    const ctx = c.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#111827'; // dark ink on the white pad, theme-independent
  }, []);

  const posOf = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); drawing.current = true; last.current = posOf(e); };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = posOf(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const up = () => { drawing.current = false; last.current = null; };
  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); };

  // The drawing is practice only — it is never scored. `noScore` tells
  // TwoPartQuestion to leave this part out of the combined correct/incorrect,
  // so skipping (or attempting) the sketch can't help or hurt your score.
  const finish = (userAnswer) => {
    if (advanced) return;
    setAdvanced(true);
    onAnswer({ correct: true, noScore: true, user_answer: userAnswer });
  };

  return (
    <div className="question-card space-y-3">
      <p className="text-base leading-relaxed">
        {part.question} <span className="text-xs text-[var(--text-faint)] whitespace-nowrap">(practice — not scored)</span>
      </p>
      <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-white">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ height: '240px', touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          onPointerCancel={up}
        />
      </div>
      {!revealed && !advanced && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={clear} className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Clear</button>
          <button onClick={() => finish('skipped drawing')} className="ml-auto text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Skip</button>
          <button onClick={() => setRevealed(true)} className="text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">Reveal structure →</button>
        </div>
      )}
      {revealed && (
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Actual structure</div>
          {part.image && (
            <div className="bg-white rounded-lg p-3 flex items-center justify-center border border-[var(--border-soft)]">
              <img src={localStructure(part.image)} alt="Correct structure" loading="lazy" className="max-w-full h-auto" style={{ maxHeight: '220px' }} />
            </div>
          )}
          {part.explanation && (
            <div className="answer-reveal bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 text-sm text-[var(--text)]"><MoleculeText text={part.explanation} /></div>
          )}
          {!advanced && (
            <div className="flex justify-end">
              <button onClick={() => finish('drew it')} className="text-sm px-4 py-2 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">Continue →</button>
            </div>
          )}
        </div>
      )}
      {advanced && nextSlot}
    </div>
  );
}

function MatchingQuestion({ item, onAnswer, nextSlot }) {
  const pairs = item.q.terms; // [{term, definition}, ...]
  const termOrder = useMemo(() => pairs.map((_, i) => i), [item.id]);
  const defOrder = useMemo(() => shuffle(pairs.map((_, i) => i)), [item.id]);

  // pairings: { [termIdx]: defIdx }
  const [pairings, setPairings] = useState({});
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const usedDefs = new Set(Object.values(pairings));
  const allPaired = Object.keys(pairings).length === pairs.length;

  const onTermClick = (i) => {
    if (submitted) return;
    if (pairings[i] !== undefined) {
      // unpair
      const next = { ...pairings };
      delete next[i];
      setPairings(next);
      return;
    }
    setSelectedTerm(i);
  };

  const onDefClick = (j) => {
    if (submitted) return;
    if (usedDefs.has(j)) {
      // unpair: find the term linked to this def
      const termIdx = Object.entries(pairings).find(([, v]) => v === j)?.[0];
      if (termIdx !== undefined) {
        const next = { ...pairings };
        delete next[termIdx];
        setPairings(next);
      }
      return;
    }
    if (selectedTerm === null) return;
    setPairings((p) => ({ ...p, [selectedTerm]: j }));
    setSelectedTerm(null);
  };

  const submit = () => {
    if (submitted || !allPaired) return;
    setSubmitted(true);
    let correctCount = 0;
    for (const [termIdxStr, defIdx] of Object.entries(pairings)) {
      const termIdx = Number(termIdxStr);
      if (termIdx === defIdx) correctCount++;
    }
    const allRight = correctCount === pairs.length;
    playSfx(allRight ? 'correct' : 'wrong');
    if (allRight) vibrateCorrect(); else vibrateWrong();
    // Report a single attempt per matching question — correct iff all pairs right.
    // (More granular per-pair tracking would require unique question_ids per term.)
    onAnswer({
      correct: allRight,
      user_answer: `${correctCount}/${pairs.length} pairs correct`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-[var(--text-muted)]">Match each term to its definition.</div>
      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Terms</div>
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {termOrder.map((i) => {
            const paired = pairings[i] !== undefined;
            const correct = submitted && paired && pairings[i] === i;
            const wrong = submitted && paired && pairings[i] !== i;
            let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
            if (selectedTerm === i) cls = 'border-[var(--accent-border)] bg-[var(--accent-soft)]';
            else if (correct) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (wrong) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else if (paired) cls = 'border-[var(--border-strong)] bg-[var(--bg-hover-soft)]';
            return (
              <button
                key={i}
                onClick={() => onTermClick(i)}
                disabled={submitted}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors ${cls}`}
              >
                <span className="text-[var(--text-faint)] mr-2">{i + 1}.</span>
                <span className="font-medium">{pairs[i].term}</span>
                {paired && (
                  <span className="text-xs text-[var(--text-muted)] ml-2">
                    → {String.fromCharCode(65 + defOrder.indexOf(pairings[i]))}
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Definitions</div>
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {defOrder.map((j, displayIdx) => {
            const used = usedDefs.has(j);
            const termIdx = Object.entries(pairings).find(([, v]) => v === j)?.[0];
            const correct = submitted && termIdx !== undefined && Number(termIdx) === j;
            const wrong = submitted && termIdx !== undefined && Number(termIdx) !== j;
            let cls = 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
            if (correct) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (wrong) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else if (used) cls = 'border-[var(--border-strong)] bg-[var(--bg-hover-soft)]';
            return (
              <button
                key={j}
                onClick={() => onDefClick(j)}
                disabled={submitted || (selectedTerm === null && !used)}
                className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-60 ${cls}`}
              >
                <span className="text-[var(--text-faint)] mr-2">{String.fromCharCode(65 + displayIdx)}.</span>
                {pairs[j].definition}
              </button>
            );
          })}
          </div>
        </div>
      </div>
      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allPaired}
          className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {allPaired ? 'Submit' : `Pair all ${pairs.length} terms to submit`}
        </button>
      ) : (
        <div className="flex justify-end">{nextSlot}</div>
      )}
    </div>
  );
}

// ---------- quiz: timer hook ----------
function useQuizTimer() {
  const [startedAt] = useState(() => Date.now());
  const [pausedAt, setPausedAt] = useState(null);
  const [banked, setBanked] = useState(0);
  const [display, setDisplay] = useState('0:00');

  const pause = useCallback(() => {
    if (!pausedAt) setPausedAt(Date.now());
  }, [pausedAt]);

  const resume = useCallback(() => {
    if (pausedAt) {
      setBanked((b) => b + (Date.now() - pausedAt));
      setPausedAt(null);
    }
  }, [pausedAt]);

  useEffect(() => {
    if (pausedAt) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt - banked) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      setDisplay(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, banked, pausedAt]);

  return { display, pause, resume, paused: !!pausedAt };
}

// ---------- quiz: runner ----------
function QuizRunner({ items, onExit, onPause }) {
  const { addAttempt, updateLastAttempt, flushSync } = useApp();
  // Force-sync win/loss data to the server whenever a quiz ends.
  const exitQuiz = (r, time) => { try { flushSync(); } catch {} onExit(r, time); };
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]); // [{item, correct, user_answer}]
  const [answered, setAnswered] = useState(false);
  const timer = useQuizTimer();

  // Expose pause/resume so parent can call them when tab visibility changes
  const timerRef = useRef(timer);
  timerRef.current = timer;
  useEffect(() => {
    if (onPause) onPause(timerRef);
  }, [onPause]);

  const [flagging, setFlagging] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [calcMin, setCalcMin] = useState(false);
  const [calcExpr, setCalcExpr] = useState('');
  const [showTable, setShowTable] = useState(false);

  const item = items[index];
  const isLast = index === items.length - 1;

  const handleAnswer = ({ correct, user_answer, isInterim }) => {
    if (isInterim) return; // two-part items emit interim results between parts; only score the final
    if (answered) return;
    setAnswered(true);
    // Study-only items (e.g. in-lesson term matching) are part of the quiz flow
    // but record no attempt, so they never affect mastery or chapter stats.
    if (!item.studyOnly) {
      addAttempt({
        question_id: item.id,
        mode: item.mode,
        file_id: item.file_id,
        chapter: item.chapter,
        subject: item.subject,
        correct,
        user_answer,
      });
    }
    setResults((r) => [...r, { item, correct, user_answer }]);
  };

  // Short-answer Override pathway. Patches the most recent attempt for
  // this question_id so account-side stats reflect the corrected verdict,
  // and updates the in-memory results array so this quiz's summary screen
  // matches. The server upserts on (user_id, client_id).
  const handleAnswerOverride = ({ correct }) => {
    if (!answered) return;
    updateLastAttempt(item.id, { correct: !!correct });
    setResults((prev) => {
      const next = prev.slice();
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].item?.id === item.id) {
          next[i] = { ...next[i], correct: !!correct };
          break;
        }
      }
      return next;
    });
  };

  const next = () => {
    if (isLast) return;
    setIndex(index + 1);
    setAnswered(false);
  };

  if (!item) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-[var(--text-muted)] min-w-0">
          <span className="text-[var(--text-strong)]">{item.chapter}</span>
          <span className="ml-2">· {index + 1}/{items.length}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => { setShowCalc(true); setCalcMin(false); }}
            title="Open calculator"
            aria-label="Open calculator"
            className="text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
          >🧮</button>
          <button
            onClick={() => setShowTable(true)}
            title="Open periodic table"
            aria-label="Open periodic table"
            className="text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
          >⚛️</button>
          <span className="text-xs font-mono text-[var(--text-muted)]">{timer.display}</span>
          <button
            onClick={() => exitQuiz(results, timer.display)}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1"
          >
            End quiz
          </button>
        </div>
      </div>

      <div className="h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-hover)] transition-all"
          style={{ width: `${((index + (answered ? 1 : 0)) / items.length) * 100}%` }}
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        {(() => {
          const nextBtn = answered ? (
            <button
              onClick={isLast ? () => exitQuiz([...results], timer.display) : next}
              className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium shrink-0"
            >
              {isLast ? 'See results' : 'Next →'}
            </button>
          ) : null;
          const onFlag = () => setFlagging(true);
          const props = { key: item.id, item, onAnswer: handleAnswer, nextSlot: nextBtn, onFlag };
          if (item.mode === 'mc') return <MCQuestion {...props} />;
          if (item.mode === 'two_part') return <TwoPartQuestion {...props} />;
          if (item.mode === 'short') return <ShortAnswerQuestion {...props} onAnswerOverride={handleAnswerOverride} />;
          if (item.mode === 'match') return <MatchingQuestion {...props} />;
          return null;
        })()}
      </div>
      {flagging && <FlagQuestionModal item={item} onClose={() => setFlagging(false)} />}
      {showCalc && (
        <CalculatorModal
          expr={calcExpr}
          setExpr={setCalcExpr}
          minimized={calcMin}
          onMinimize={() => setCalcMin((m) => !m)}
          onClose={() => { setShowCalc(false); setCalcMin(false); setCalcExpr(''); }}
        />
      )}
      {showTable && <PeriodicTableModal onClose={() => setShowTable(false)} />}
    </div>
  );
}

// ---------- quiz: summary ----------
function QuizSummary({ results, elapsedTime, onRestart, onDrillMisses }) {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const misses = results.filter((r) => !r.correct);

  return (
    <div className="space-y-5">
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Quiz complete</div>
        <div className="text-5xl font-bold mt-2">{pct}%</div>
        <div className="text-sm text-[var(--text-muted)] mt-1">{correct} of {total} correct</div>
        {elapsedTime && <div className="text-xs text-[var(--text-faint)] mt-1 font-mono">{elapsedTime}</div>}
      </div>

      {misses.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3">Missed questions</h3>
          <ul className="space-y-2 text-sm">
            {misses.map((m, i) => (
              <li key={i} className="text-[var(--text)]">
                <span className="text-[var(--text-faint)] mr-2">{i + 1}.</span>
                {m.item.mode === 'mc' && m.item.q.question}
                {m.item.mode === 'two_part' && <span><span className="text-[var(--accent-text)]">Two-part:</span> {m.item.q.theme}</span>}
                {m.item.mode === 'short' && m.item.q.prompt}
                {m.item.mode === 'match' && <span className="text-[var(--text-muted)]">Matching set · {m.user_answer}</span>}
                <div className="text-xs text-[var(--text-faint)] mt-0.5 ml-6">{m.item.chapter}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg py-2 text-sm"
        >
          New quiz
        </button>
        {misses.length > 0 && (
          <button
            onClick={onDrillMisses}
            className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-2 text-sm font-medium"
          >
            Drill {misses.length} miss{misses.length === 1 ? '' : 'es'}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- quiz: top-level view ----------
// ---------- study: weak-spot quiz (mastered chapters only) ----------
// Builds a quiz weighted toward the LOWEST-accuracy chapters you've mastered:
// the worse you score in a chapter, the more of its questions appear. Only
// mastered chapters (lessonGates) that have recorded attempts are eligible.
const WEAK_SPOT_COUNTS = [5, 10, 20, 50];

function WeakSpotQuiz() {
  const ctx = useApp();
  const { files, attempts, stateRev } = ctx;
  const [count, setCount] = useState(10);

  // Mastered chapters that have attempts, ranked worst-accuracy first.
  const weak = useMemo(() => {
    const gates = storage.get(KEYS.lessonGates, {}) || {};
    const fileById = {};
    for (const f of files) fileById[f.file_id] = f;
    const stat = {};
    for (const a of attempts) {
      const f = fileById[a.file_id];
      if (!f || !f.chapter_id || !gates[f.chapter_id]?.mastered) continue;
      const s = stat[a.file_id] || (stat[a.file_id] = { fid: a.file_id, correct: 0, total: 0, chapter: f.chapter, subject: f.subject });
      s.total++; if (a.correct) s.correct++;
    }
    return Object.values(stat)
      .filter((s) => s.total > 0)
      .map((s) => ({ ...s, acc: s.correct / s.total }))
      .sort((a, b) => a.acc - b.acc);
  }, [files, attempts, stateRev]);

  // Weight a chapter by how far its accuracy sits below perfect, so a lower
  // score pulls proportionally more questions (50% acc weighs 2x a 75% chapter).
  const weights = useMemo(() => {
    const w = {};
    for (const c of weak) w[c.fid] = Math.max(0.0001, 1 - c.acc);
    return w;
  }, [weak]);

  const available = useMemo(() => {
    if (!weak.length) return 0;
    return buildPool(ctx, 'mc', { fileIds: new Set(weak.map((c) => c.fid)) }).length;
  }, [weak, ctx]);

  const start = () => {
    const total = Math.min(count, available);
    if (total <= 0) return;
    const want = allocateCounts(weights, total);
    const chosen = [];
    const used = new Set();
    for (const c of weak) {
      const n = want[c.fid] || 0;
      if (n <= 0) continue;
      const pool = buildPool(ctx, 'mc', { fileIds: new Set([c.fid]) }).filter((x) => !used.has(x.id));
      for (const p of shuffle(pool).slice(0, n)) { chosen.push(p); used.add(p.id); }
    }
    // A chapter may run out of questions before filling its slots; backfill the
    // shortfall from the remaining pool, still weighted toward weaker chapters.
    if (chosen.length < total) {
      const rest = buildPool(ctx, 'mc', { fileIds: new Set(weak.map((c) => c.fid)) }).filter((x) => !used.has(x.id));
      const extra = weightedSample(rest, (it) => weights[it.file_id] || 0.0001, Math.min(total - chosen.length, rest.length));
      for (const p of extra) { chosen.push(p); used.add(p.id); }
    }
    const items = shuffle(chosen).slice(0, total);
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', { detail: { items } }));
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-4">
      <div>
        <h2 className="font-semibold text-[var(--text-strong)]">Target your weak spots</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          A quiz weighted toward your lowest-accuracy mastered chapters — the worse you score in a chapter, the more of its questions show up here.
        </p>
      </div>

      {weak.length === 0 ? (
        <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg p-3">
          No eligible chapters yet. Master a chapter (in the Lessons tab) and answer some of its questions — your weakest mastered chapters will show up here.
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Pulling mostly from</div>
            {weak.slice(0, 4).map((c) => (
              <div key={c.fid} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--text)] truncate">{c.chapter}</span>
                <span className={`shrink-0 font-medium ${c.acc < 0.6 ? 'text-[var(--danger-text)]' : c.acc < 0.8 ? 'text-[var(--warning-text-strong)]' : 'text-[var(--text-muted)]'}`}>
                  {Math.round(c.acc * 100)}%
                </span>
              </div>
            ))}
            {weak.length > 4 && (
              <div className="text-xs text-[var(--text-faint)]">+{weak.length - 4} more mastered chapter{weak.length - 4 === 1 ? '' : 's'} (fewer questions each)</div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Questions</div>
            <div className="grid grid-cols-4 gap-2">
              {WEAK_SPOT_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`text-sm py-2 rounded border ${count === n
                    ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]'
                    : 'border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text)]'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={start}
            disabled={available === 0}
            className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2.5 text-sm font-medium"
          >
            {available === 0 ? 'No questions available' : `Start ${Math.min(count, available)}-question weak-spot quiz`}
          </button>
        </>
      )}
    </div>
  );
}

function StudyView() {
  // 'launcher' | 'active' | 'summary' | 'flashcards'
  const [phase, setPhase] = useState('launcher');
  const [items, setItems] = useState([]);
  const [flashItems, setFlashItems] = useState([]);
  const [results, setResults] = useState([]);
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const timerRefHolder = useRef(null);

  const start = (picked) => { setItems(picked); setResults([]); setElapsedTime('0:00'); setPhase('active'); };
  const startFlashcards = (cards) => { setFlashItems(cards); setPhase('flashcards'); };

  // Allow HomeView (or any other view) to launch a quiz inside this StudyView via event.
  useEffect(() => {
    const onLaunch = (e) => {
      const picked = e.detail?.items;
      if (Array.isArray(picked) && picked.length) start(picked);
    };
    window.addEventListener('mcat:startQuiz', onLaunch);
    return () => window.removeEventListener('mcat:startQuiz', onLaunch);
  }, []);
  const end = (r, time) => { setResults(r); setElapsedTime(time || '0:00'); setPhase('summary'); };
  const restart = () => { setItems([]); setResults([]); setPhase('launcher'); timerRefHolder.current = null; };
  const drillMisses = () => {
    const missedItems = results.filter((r) => !r.correct).map((r) => r.item);
    setItems(shuffle(missedItems));
    setResults([]);
    setPhase('active');
    timerRefHolder.current = null;
  };

  // Pause/resume the quiz timer when this view becomes hidden/visible.
  // The parent keeps us mounted via display:none so state is preserved.
  useEffect(() => {
    const wrapper = document.getElementById('study-view-root')?.parentElement;
    if (!wrapper) return;
    const observer = new MutationObserver(() => {
      if (!timerRefHolder.current?.current) return;
      const hidden = wrapper.style.display === 'none';
      if (hidden) timerRefHolder.current.current.pause();
      else timerRefHolder.current.current.resume();
    });
    observer.observe(wrapper, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, [phase]);

  const handleTimerRef = useCallback((ref) => { timerRefHolder.current = ref; }, []);

  if (phase === 'launcher') return (
    <div className="space-y-5">
      <MiniExamCard />
      <QuizLauncher onStart={start} onStartFlashcards={startFlashcards} />
      <WeakSpotQuiz />
    </div>
  );
  if (phase === 'flashcards') {
    return <FlashcardReview cards={flashItems} onExit={() => { setFlashItems([]); setPhase('launcher'); }} />;
  }
  if (phase === 'active') {
    return (
      <div id="study-view-root">
        <ErrorBoundary key={items[0]?.id}>
          <QuizRunner items={items} onExit={end} onPause={handleTimerRef} />
        </ErrorBoundary>
      </div>
    );
  }
  return <QuizSummary results={results} elapsedTime={elapsedTime} onRestart={restart} onDrillMisses={drillMisses} />;
}

// ---------- home: bird hero ----------
// The bird sits in normal document flow directly below the speech bubble, so the
// card grows to fully contain it and the gap to the bubble is constant for any
// quote length. Offsets locked to the user-calibrated values.
const BIRD_GAP = 5;    // px below the speech bubble
const BIRD_SHIFT = 4;  // px horizontal nudge (negative = rightward)

function BirdHero({ username, quote }) {
  return (
    <div className="relative bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl px-4 sm:px-6 pt-5 sm:pt-6 pb-0 overflow-hidden">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Welcome back</div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-strong)] mb-3">@{username}</h1>

      {/* Speech bubble */}
      <div className="relative w-[78%] sm:w-[62%] max-w-md" style={{ zIndex: 10 }}>
        <div className="bg-[var(--bg-elev)] border border-[var(--border-soft)] rounded-2xl rounded-br-none px-4 py-3 sm:px-5 sm:py-4 text-[var(--text)] text-sm sm:text-base leading-relaxed">
          {quote}
        </div>
      </div>

      {/* Bird — in flow, so the card grows to contain it and the gap above stays constant. */}
      <img
        src="assets/bird.png"
        alt=""
        draggable="false"
        className="block select-none pointer-events-none"
        style={{
          width: 'clamp(440px, 116vw, 680px)',
          maxWidth: 'none',
          marginTop: `${BIRD_GAP}px`,
          position: 'relative',
          right: `${BIRD_SHIFT}px`,
          zIndex: 0,
        }}
      />
    </div>
  );
}

// ---------- home: recent activity feed ----------
function HomeActivity() {
  const { api, session } = useApp();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);

  // Refetch on a slow interval so the green-dot status stays accurate.
  useEffect(() => {
    let cancelled = false;
    api.activity()
      .then((d) => { if (!cancelled) setRows(d.activity || []); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, tick]);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 45 * 1000);
    return () => clearInterval(t);
  }, []);

  if (err) return null; // silent — Home is a happy place
  if (!rows) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
        <h2 className="font-semibold text-[var(--text-strong)] mb-1">Who's in the app</h2>
        <p className="text-sm text-[var(--text-muted)]">Loading…</p>
      </div>
    );
  }
  const ONLINE_WINDOW = 5 * 60 * 1000;        // green dot
  const STUDYING_WINDOW = 5 * 60 * 1000;      // attempt within 5 min → "studying X"
  const others = rows.filter((r) => !session || r.username !== session.username).slice(0, 8);
  if (!others.length) return null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
      <h2 className="font-semibold text-[var(--text-strong)] mb-2">Who's in the app</h2>
      <ul className="divide-y divide-[var(--border-soft)]">
        {others.map((r) => {
          const online = r.ts && (Date.now() - r.ts < ONLINE_WINDOW);
          const studyingNow = r.attempt_ts && (Date.now() - r.attempt_ts < STUDYING_WINDOW);
          // What to show on the second line:
          //   - studying right now → subject (current chapter)
          //   - online but idle    → "online"
          //   - offline            → last subject seen + when
          const status = studyingNow
            ? (r.subject || 'studying')
            : (online ? 'online' : (r.subject ? `last: ${r.subject}` : 'offline'));
          return (
            <li key={r.username} className="py-2 flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: online ? 'var(--success-border)' : 'var(--text-fainter)' }}
                title={online ? 'online' : 'offline'}
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm text-[var(--text)] truncate">
                  <span className="font-medium">@{r.username}</span>
                  <span className="text-[var(--text-muted)]"> · {status}</span>
                </div>
                {studyingNow && r.chapter && <div className="text-xs text-[var(--text-faint)] truncate">{r.chapter}</div>}
              </div>
              <div className="text-xs text-[var(--text-faint)] shrink-0">{relativeTime(r.ts)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- daily CARS ----------
// reveal=false: attempt mode — selectable, no correct/incorrect shown.
// reveal=true:  review mode — locked, answers + explanations shown.
function CarsQuestion({ q, index, picked, onPick, reveal }) {
  const letters = ['A', 'B', 'C', 'D'];
  const noPick = picked == null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-[var(--text-faint)] font-mono text-sm shrink-0">{index + 1}.</span>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-[var(--accent-text)]">{q.category}{q.subtype ? ` · ${q.subtype}` : ''}</div>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--text)] mt-0.5">{q.question}</p>
        </div>
      </div>
      <div className="space-y-2">
        {q.choices.map((c, i) => {
          let cls;
          if (reveal) {
            if (i === q.correct_index) cls = 'border-[var(--success-border)] bg-[var(--success-bg-strong)]';
            else if (i === picked) cls = 'border-[var(--danger-border)] bg-[var(--danger-bg-strong)]';
            else cls = 'border-[var(--border-soft)] opacity-60';
          } else {
            cls = i === picked
              ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]'
              : 'border-[var(--border)] hover:bg-[var(--bg-hover)]';
          }
          return (
            <button
              key={i}
              onClick={() => { if (!reveal) onPick(i); }}
              disabled={reveal}
              data-no-haptic
              className={`w-full text-left border rounded-lg px-3 py-2.5 text-sm transition-colors ${cls}`}
            >
              <span className="text-[var(--text-faint)] mr-2">{letters[i]}.</span>
              {c}
            </button>
          );
        })}
      </div>
      {reveal && (
        <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 space-y-2">
          <div className={
            noPick ? 'text-[var(--text-muted)] font-medium text-sm'
              : picked === q.correct_index ? 'text-[var(--success-text)] font-medium text-sm'
              : 'text-[var(--danger-text)] font-medium text-sm'
          }>
            {noPick ? `Answer: ${letters[q.correct_index]}`
              : picked === q.correct_index ? 'Correct'
              : `Incorrect — answer is ${letters[q.correct_index]}, you chose ${letters[picked]}`}
          </div>
          <div className="text-sm text-[var(--text)]">{q.explanation}</div>
          {Array.isArray(q.choice_explanations) && q.choice_explanations.length > 0 && (
            <ul className="space-y-1 pt-1 border-t border-[var(--border-soft)]">
              {q.choice_explanations.map((ce, i) => (
                <li key={i} className="text-xs text-[var(--text-muted)]">
                  <span className={`font-medium ${i === q.correct_index ? 'text-[var(--success-text)]' : 'text-[var(--text-faint)]'}`}>{letters[i]}.</span> {ce}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Build a standalone, print-ready HTML document of a finished CARS set and hand it to
// the browser's print dialog (where "Save as PDF" is a destination). Zero deps — keeps
// the no-build, CDN-only setup intact and yields a text-selectable PDF. Bundles the
// passage, every question with the user's pick vs. the correct answer, and all
// explanations, so it can be dropped straight into a chat with Claude to analyse misses.
function downloadCarsPdf({ date, payload, questions, picks, score, elapsedMs }) {
  const letters = ['A', 'B', 'C', 'D'];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const total = questions.length;
  const timeStr = elapsedMs ? (() => {
    const s = Math.floor(elapsedMs / 1000);
    return ` · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  })() : '';

  const passageHtml = String(payload.passage || '')
    .split(/\n\s*\n/)
    .map((p) => `<p>${esc(p.trim())}</p>`)
    .join('');

  const questionsHtml = questions.map((q, i) => {
    const picked = picks[q.id];
    const correct = q.correct_index;
    const isCorrect = picked === correct;
    const choices = (q.choices || []).map((c, ci) => {
      const tags = [];
      if (ci === correct) tags.push('correct answer');
      if (ci === picked) tags.push('your answer');
      const tag = tags.length ? ` <span class="tag">(${tags.join(', ')})</span>` : '';
      const cls = ci === correct ? 'correct' : (ci === picked ? 'wrong' : '');
      return `<li class="${cls}"><strong>${letters[ci]}.</strong> ${esc(c)}${tag}</li>`;
    }).join('');
    const verdict = picked == null
      ? `Not answered — correct answer is ${letters[correct]}.`
      : isCorrect
        ? `Correct (you chose ${letters[picked]}).`
        : `Incorrect — you chose ${letters[picked]}; correct answer is ${letters[correct]}.`;
    const choiceExpl = (Array.isArray(q.choice_explanations) && q.choice_explanations.length)
      ? `<ul class="cexpl">${q.choice_explanations.map((ce, ci) => `<li><strong>${letters[ci]}.</strong> ${esc(ce)}</li>`).join('')}</ul>`
      : '';
    return `<section class="q">
      <div class="qmeta">Question ${i + 1}${q.category ? ` · ${esc(q.category)}` : ''}${q.subtype ? ` · ${esc(q.subtype)}` : ''}</div>
      <p class="qtext">${esc(q.question)}</p>
      <ul class="choices">${choices}</ul>
      <p class="verdict ${isCorrect ? 'ok' : (picked == null ? '' : 'bad')}">${verdict}</p>
      ${q.explanation ? `<p class="expl"><strong>Explanation.</strong> ${esc(q.explanation)}</p>` : ''}
      ${choiceExpl}
    </section>`;
  }).join('');

  const heading = esc(payload.title || payload.discipline || 'CARS passage');
  const sub = `${esc(date)}${payload.discipline ? ` · ${esc(payload.discipline)}` : ''}${payload.source ? ` · ${esc(payload.source)}` : ''}`;

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>MCAT CARS — ${esc(date)}</title>
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { margin: 18mm 16mm; }
  body { font: 12pt/1.5 Georgia, 'Times New Roman', serif; color: #111; max-width: 720px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 19pt; margin: 0 0 2px; }
  .sub { color: #555; font-size: 10pt; margin-bottom: 4px; }
  .score { font-size: 12pt; font-weight: bold; margin: 8px 0 18px; }
  h2 { font-size: 13pt; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 22px 0 10px; }
  .passage p { margin: 0 0 10px; }
  section.q { margin: 0 0 18px; padding: 12px 14px; border: 1px solid #ddd; border-radius: 6px; break-inside: avoid; }
  .qmeta { font-size: 9pt; text-transform: uppercase; letter-spacing: .04em; color: #777; margin-bottom: 4px; }
  .qtext { font-weight: bold; margin: 0 0 8px; }
  ul.choices { list-style: none; padding: 0; margin: 0 0 8px; }
  ul.choices li { padding: 4px 8px; margin: 2px 0; border-radius: 4px; }
  ul.choices li.correct { background: #d7f4dd; }
  ul.choices li.wrong { background: #fbdada; }
  .tag { font-style: italic; color: #555; font-size: 10pt; }
  .verdict { font-size: 10.5pt; font-weight: bold; margin: 6px 0; }
  .verdict.ok { color: #1a7f37; }
  .verdict.bad { color: #b42318; }
  .expl { font-size: 11pt; margin: 6px 0; }
  ul.cexpl { font-size: 10pt; color: #444; padding-left: 18px; margin: 6px 0 0; }
  ul.cexpl li { margin: 2px 0; }
  .foot { color: #999; font-size: 9pt; margin-top: 24px; text-align: center; }
</style></head>
<body>
  <h1>${heading}</h1>
  <div class="sub">Daily CARS · ${sub}</div>
  <div class="score">Score: ${score}/${total}${timeStr}</div>
  <h2>Passage</h2>
  <div class="passage">${passageHtml}</div>
  <h2>Questions &amp; Answers</h2>
  ${questionsHtml}
  <div class="foot">MCAT Study — exported ${esc(new Date().toLocaleString())}</div>
</body></html>`;

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:0;border:0;';
  document.body.appendChild(frame);
  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  const win = frame.contentWindow;
  let fired = false;
  const go = () => {
    if (fired) return;
    fired = true;
    try { win.focus(); win.print(); } catch (e) {}
    setTimeout(() => frame.remove(), 2000);
  };
  // Give the iframe a tick to lay out before printing; fall back if onload never fires.
  if (doc.readyState === 'complete') setTimeout(go, 200);
  else { win.onload = () => setTimeout(go, 200); setTimeout(go, 800); }
}

function CarsRunner({ date, payload, onClose, alreadyDone }) {
  const { addAttempt, flushSync } = useApp();
  const questions = payload.questions || [];
  const savedResult = alreadyDone ? (getCarsResults()[date] || null) : null;
  const [picks, setPicks] = useState(() => (savedResult && savedResult.picks) || {});
  // attempt → graded → review. Never reveals answers before 'review'.
  const [phase, setPhase] = useState(alreadyDone ? 'review' : 'attempt');
  const finalizedRef = useRef(false);
  const scrollRef = useRef(null);
  // Elapsed-time timer. Ticks only during the 'attempt' phase, freezes
  // the moment the user submits, and resets back to 0 if they retry.
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    if (phase !== 'attempt') { startRef.current = null; return; }
    if (startRef.current == null) startRef.current = Date.now() - elapsedMs;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 500);
    return () => clearInterval(id);
  }, [phase]); // eslint-disable-line
  const timerDisplay = (() => {
    const s = Math.floor(elapsedMs / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  })();

  const answeredCount = Object.keys(picks).length;
  const allAnswered = answeredCount === questions.length && questions.length > 0;
  const computedScore = questions.reduce((n, q) => n + (picks[q.id] === q.correct_index ? 1 : 0), 0);
  // Fall back to a stored score for old results saved before per-question picks were kept.
  const score = (answeredCount === 0 && savedResult) ? (savedResult.score || 0) : computedScore;
  const missed = questions.length - score;

  const pick = (q, i) => {
    if (phase !== 'attempt') return;
    sfxTap(); vibrateTap();
    setPicks((p) => ({ ...p, [q.id]: i }));
  };

  const scrollTop = () => { if (scrollRef.current) scrollRef.current.scrollTop = 0; };

  const submit = () => {
    if (!allAnswered) return;
    if (score === questions.length) { playSfx('correct'); vibrateCorrect(); }
    else { playSfx('wrong'); vibrateWrong(); }
    setPhase('graded');
    scrollTop();
    // Lock the first-attempt score the moment the user submits. Retrying or
    // reviewing after this point never re-uploads — stats reflect the genuine
    // first try, not whatever they cleaned up on a do-over.
    if (!finalizedRef.current && !alreadyDone) {
      finalizedRef.current = true;
      const firstScore = score;
      const firstPicks = { ...picks };
      questions.forEach((q) => {
        addAttempt({
          question_id: q.id, mode: 'mc', file_id: `cars_${date}`,
          chapter: `Daily CARS — ${date}`, subject: 'CARS',
          correct: firstPicks[q.id] === q.correct_index,
          user_answer: ['A', 'B', 'C', 'D'][firstPicks[q.id]] || '',
        });
      });
      setCarsResult(date, { score: firstScore, total: questions.length, completed_at: Date.now(), picks: firstPicks });
      window.dispatchEvent(new Event('mcat:carsDone'));
      // Force-sync the freshly logged win/loss attempts. Deferred so the batched
      // addAttempt state updates have flushed to localStorage before flushSync reads it.
      setTimeout(() => { try { flushSync(); } catch {} }, 120);
    }
  };

  const retry = () => {
    // Reset the elapsed timer so the second attempt starts fresh.
    setElapsedMs(0);
    startRef.current = null;
    setPhase('attempt');
    scrollTop();
  };

  const goReview = () => { setPhase('review'); scrollTop(); };

  const exportPdf = () => downloadCarsPdf({ date, payload, questions, picks, score, elapsedMs });

  // While the runner is open, lock the underlying page scroll so flick-scrolling
  // doesn't drift the BankTab content behind it (iOS Safari is especially loose
  // about this with nested scroll containers).
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return (
    <div ref={scrollRef} className="fixed inset-x-0 bottom-0 z-50 bg-[var(--bg)] overflow-y-auto" style={{ top: 'var(--mcat-header-h, 56px)', marginTop: 0 }}>
      {/* Banner is the FIRST child of the scroll container, with no padding
          above it, so it sits flush against the tabs bar and the sticky
          behavior keeps it there as the passage scrolls.
          marginTop:0 defeats an inherited Tailwind `space-y` margin when this
          fixed overlay is launched as a sibling inside a space-y container
          (the Home tab) — without it the banner sits a row's gap too low. */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border-soft)] px-3 sm:px-6 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Daily CARS · {date}</div>
            <h2 className="font-semibold text-[var(--text-strong)] truncate">{payload.title || payload.discipline || 'CARS passage'}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {phase === 'attempt' && (
              <>
                <span
                  className="text-xs font-mono text-[var(--text-muted)] tabular-nums"
                  title="Time spent on this passage"
                >⏱ {timerDisplay}</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">{answeredCount}/{questions.length}</span>
              </>
            )}
            {phase === 'graded' && (
              <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums" title="Time spent">⏱ {timerDisplay}</span>
            )}
            {phase === 'review' && <span className="text-xs font-mono text-[var(--text-muted)]">{score}/{questions.length}</span>}
            <button onClick={onClose} className="text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">Close</button>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-4">
        {/* Graded screen — score only, no answers revealed */}
        {phase === 'graded' ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 text-center space-y-3">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Your score</div>
            <div className="text-5xl font-bold text-[var(--text-strong)]">{score}/{questions.length}</div>
            {score === questions.length ? (
              <>
                <p className="text-sm text-[var(--success-text)]">Perfect — every one. These are tuned harder than the real exam.</p>
                <button onClick={goReview} className="text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium">
                  Review answers
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-[var(--text-muted)]">
                  {missed} wrong. Go back and fix what you can before the answers are revealed — or review now to see them.
                </p>
                <div className="flex gap-2 justify-center">
                  <button onClick={retry} className="text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium">
                    Retry
                  </button>
                  <button onClick={goReview} className="text-sm px-4 py-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg">
                    Review answers
                  </button>
                </div>
              </>
            )}
            <div className="pt-1">
              <button onClick={exportPdf} className="text-xs px-3 py-1.5 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)]">
                Download PDF
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Passage */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-6">
              <div className="text-[10px] uppercase tracking-wide text-[var(--text-faint)] mb-2">
                {payload.discipline}{payload.source ? ` · ${payload.source}` : ''}
              </div>
              {String(payload.passage || '').split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="text-sm sm:text-base leading-relaxed text-[var(--text)] mb-3 last:mb-0">{para.trim()}</p>
              ))}
            </div>

            {phase === 'review' && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 text-center">
                <span className="text-sm text-[var(--text-muted)]">Score: </span>
                <span className="text-lg font-bold text-[var(--text-strong)]">{score}/{questions.length}</span>
              </div>
            )}

            {questions.map((q, i) => (
              <CarsQuestion
                key={q.id}
                q={q}
                index={i}
                picked={picks[q.id] != null ? picks[q.id] : null}
                onPick={(idx) => pick(q, idx)}
                reveal={phase === 'review'}
              />
            ))}

            {phase === 'attempt' && (
              <button
                onClick={submit}
                disabled={!allAnswered}
                className="w-full text-sm py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg font-semibold"
              >
                {allAnswered ? 'Submit answers' : `Answer all ${questions.length} to submit (${answeredCount}/${questions.length})`}
              </button>
            )}
            {phase === 'review' && (
              <div className="flex gap-2">
                <button onClick={exportPdf} className="flex-1 text-sm py-3 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded-lg font-medium">
                  Download PDF
                </button>
                <button onClick={onClose} className="flex-1 text-sm py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium">
                  Done
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Home card — today's CARS. Generates the set if nobody has yet (and the user has a key).
function DailyCarsCard() {
  const { api, client, apiKey, session } = useApp();
  const today = todayStr();
  // Seed from the local cache so the card shows instantly if today was already downloaded.
  const cached = getCarsCachePayload(today);
  const [state, setState] = useState(cached ? 'ready' : 'loading'); // loading | ready | generating | unavailable | error
  const [payload, setPayload] = useState(cached);
  const [err, setErr] = useState('');
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const result = getCarsResults()[today];

  useEffect(() => {
    let cancelled = false;
    if (!getCarsCachePayload(today)) { setState('loading'); }
    setErr('');
    api.getCars(today)
      .then((d) => { if (!cancelled) { setCarsCachePayload(today, d.payload); setPayload(d.payload); setState('ready'); } })
      .catch(async (e) => {
        if (cancelled) return;
        if (e.status !== 404) { setErr(e.message); setState('error'); return; }
        // Not generated yet. Generate if signed in with a key; else wait.
        if (!apiKey || !session) { setState('unavailable'); return; }
        setState('generating');
        try {
          // Preferred path: pull a real public-domain passage from Project Gutenberg,
          // then have Gemini write only the (hard) questions about it.
          let gen = null;
          try {
            const src = await api.getCarsPassage(today);
            if (src?.passage) {
              const questions = await client.generateCarsQuestions(src.passage, src.discipline);
              if (questions?.length) {
                gen = {
                  passage: src.passage,
                  discipline: src.discipline,
                  title: src.title,
                  source: src.source,
                  questions,
                };
              }
            }
          } catch { /* fall through to full generation */ }
          // Fallback: Gemini writes the passage too (if Gutenberg fetch failed).
          if (!gen) {
            const discipline = carsDisciplineFor(today);
            gen = await client.generateDailyCars(discipline);
          }
          if (!gen?.questions?.length) throw new Error('Generation returned no questions.');
          await api.postCars({ date: today, discipline: gen.discipline || carsDisciplineFor(today), title: gen.title || '', payload: gen });
          if (!cancelled) { setCarsCachePayload(today, gen); setPayload(gen); setState('ready'); }
        } catch (ge) {
          // Someone else may have generated it in the meantime — try one more fetch.
          try {
            const d2 = await api.getCars(today);
            if (!cancelled) { setCarsCachePayload(today, d2.payload); setPayload(d2.payload); setState('ready'); return; }
          } catch {}
          if (!cancelled) { setErr(ge.message); setState('error'); }
        }
      });
    return () => { cancelled = true; };
  }, [api, today, tick, apiKey, session]);

  const card = (inner) => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">{inner}</div>
  );

  if (state === 'loading') return card(<div className="text-sm text-[var(--text-muted)]">Checking today's CARS…</div>);
  if (state === 'generating') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Daily CARS</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">Generating today's passage with Gemini — about 20 seconds…</p>
    </div>
  );
  if (state === 'unavailable') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Daily CARS</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">
        Today's CARS hasn't been generated yet. It appears once someone signed in with a Gemini API key opens the app.
      </p>
    </div>
  );
  if (state === 'error') return card(
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-[var(--text-strong)]">Daily CARS</h2>
        <button onClick={() => setTick((t) => t + 1)} className="shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">Retry</button>
      </div>
      <p className="text-sm text-[var(--danger-text)] mt-1 break-words whitespace-pre-wrap">{err}</p>
    </div>
  );

  // ready — accent border while undone, regular border once completed
  return (
    <>
      <div className={`bg-[var(--bg-card)] border rounded-2xl p-4 sm:p-5 ${result ? 'border-[var(--border-soft)]' : 'border-[var(--accent-border)]'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[var(--text-strong)]">Today's CARS</h2>
              {!result && <span className="w-2 h-2 rounded-full bg-[var(--danger-border)]" />}
            </div>
            <div className="text-sm text-[var(--text)] mt-0.5">{payload?.title}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              {payload?.discipline} · {payload?.questions?.length || 0} questions · tuned harder than the real exam
              {result && <span className="text-[var(--success-text)]"> · done {result.score}/{result.total}</span>}
            </div>
          </div>
          <button
            onClick={() => setRunning(true)}
            className="shrink-0 text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
          >
            {result ? 'Review' : 'Start'}
          </button>
        </div>
      </div>
      {running && payload && (
        <CarsRunner
          date={today}
          payload={payload}
          alreadyDone={!!result}
          onClose={() => { setRunning(false); setTick((t) => t + 1); }}
        />
      )}
    </>
  );
}

// CARS archive — every past day, openable from the Bank tab.
function CarsArchive() {
  const { api } = useApp();
  const [days, setDays] = useState(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(null); // { date, payload }
  const [loadingDate, setLoadingDate] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const today = todayStr();
  const results = getCarsResults();

  useEffect(() => {
    let cancelled = false;
    api.listCars()
      .then((d) => { if (!cancelled) setDays(d.days || []); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api]);

  const openDay = async (date) => {
    // Instant if already downloaded; otherwise fetch and cache it.
    const cachedPayload = getCarsCachePayload(date);
    if (cachedPayload) { setOpen({ date, payload: cachedPayload }); return; }
    setLoadingDate(date);
    try {
      const d = await api.getCars(date);
      setCarsCachePayload(date, d.payload);
      setOpen({ date, payload: d.payload });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoadingDate(null);
    }
  };

  // Days come from the API sorted newest-first. Show the 3 most recent
  // inline; the rest unlock when the user expands.
  const visibleDays = days && (expanded ? days : days.slice(0, 3));
  const extraCount = days ? Math.max(0, days.length - 3) : 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-semibold text-[var(--text-strong)]">Daily CARS archive</h3>
        {days && <span className="text-xs text-[var(--text-faint)]">{days.length} day{days.length === 1 ? '' : 's'}</span>}
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-3">Every day's CARS passage. Open any one to read it and do the questions.</p>
      {err && <div className="text-sm text-[var(--danger-text)] mb-2">{err}</div>}
      {!days && <div className="text-sm text-[var(--text-muted)]">Loading…</div>}
      {days && days.length === 0 && (
        <div className="text-sm text-[var(--text-muted)]">No CARS days yet — the first appears once today's is generated.</div>
      )}
      {days && days.length > 0 && (
        <ul className="divide-y divide-[var(--border-soft)]">
          {visibleDays.map((d) => {
            const r = results[d.date];
            return (
              <li key={d.date} className="py-2.5 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-[var(--text)]">
                    <span className="font-medium">{d.date}{d.date === today ? ' · today' : ''}</span>
                    {d.title && <span className="text-[var(--text-muted)]"> — {d.title}</span>}
                  </div>
                  <div className="text-xs text-[var(--text-faint)]">
                    {d.discipline}
                    {r && <span className="text-[var(--success-text)]"> · done {r.score}/{r.total}</span>}
                  </div>
                </div>
                <button
                  onClick={() => openDay(d.date)}
                  disabled={loadingDate === d.date}
                  className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
                >
                  {loadingDate === d.date ? 'Loading…' : (r ? 'Review' : 'Open')}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {days && extraCount > 0 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 text-xs text-[var(--accent-text)] hover:underline"
        >
          {expanded ? 'Show less' : `Show ${extraCount} more day${extraCount === 1 ? '' : 's'}`}
        </button>
      )}
      {open && open.payload && (
        <CarsRunner
          date={open.date}
          payload={open.payload}
          alreadyDone={!!results[open.date]}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

// Locally-cached Gemini outputs for solved Connections groups. Keyed by
// `${date}::${category}` for explanations and `${term}` for definitions.
function getConnExplain(date, category) {
  const all = storage.get('mcat:connExplain', {}) || {};
  return all[`${date}::${category}`] || null;
}
function setConnExplain(date, category, text) {
  const all = storage.get('mcat:connExplain', {}) || {};
  all[`${date}::${category}`] = text;
  storage.set('mcat:connExplain', all);
}
function getTermDefCache(term) {
  const all = storage.get('mcat:termDefs', {}) || {};
  return all[term.toLowerCase()] || null;
}
function setTermDefCache(term, def) {
  const all = storage.get('mcat:termDefs', {}) || {};
  all[term.toLowerCase()] = def;
  storage.set('mcat:termDefs', all);
}

// Looks up a term's definition first in the user's local extractions
// (key_terms across every downloaded chapter), then falls back to the
// term-def cache (filled on demand by Gemini).
function lookupLocalDef(term, extractions) {
  const needle = term.toLowerCase().trim();
  for (const ext of Object.values(extractions || {})) {
    const kts = ext?.key_terms || [];
    const hit = kts.find((kt) => (kt.term || '').toLowerCase().trim() === needle);
    if (hit?.definition) return hit.definition;
  }
  return null;
}

function SolvedConnectionGroup({ group, date }) {
  const { client, apiKey, extractions } = useApp();
  const c = CONNECTIONS_COLORS[group.difficulty];
  const [open, setOpen] = useState(false);
  const [flippedTerm, setFlippedTerm] = useState(null);
  const [explain, setExplain] = useState(() => getConnExplain(date, group.category));
  const [explainBusy, setExplainBusy] = useState(false);
  const [explainErr, setExplainErr] = useState('');
  const [termDefs, setTermDefs] = useState(() => {
    const seed = {};
    for (const t of group.terms) {
      seed[t] = lookupLocalDef(t, extractions) || getTermDefCache(t) || null;
    }
    return seed;
  });
  const [termBusy, setTermBusy] = useState({});

  const fetchExplain = useCallback(async () => {
    if (explain || explainBusy) return;
    if (!apiKey) { setExplainErr('Add a Gemini API key in Settings to load explanations.'); return; }
    setExplainBusy(true); setExplainErr('');
    try {
      const text = await client.generateConnectionExplanation(group.category, group.terms);
      setExplain(text);
      setConnExplain(date, group.category, text);
    } catch (e) {
      setExplainErr(e.message || 'Could not load explanation.');
    } finally {
      setExplainBusy(false);
    }
  }, [client, apiKey, group.category, group.terms, date, explain, explainBusy]);

  const fetchTermDef = useCallback(async (term) => {
    if (termDefs[term] || termBusy[term]) return;
    if (!apiKey) return;
    setTermBusy((b) => ({ ...b, [term]: true }));
    try {
      const def = await client.generateTermDefinition(term, group.category);
      setTermDefs((d) => ({ ...d, [term]: def }));
      setTermDefCache(term, def);
    } catch {}
    finally {
      setTermBusy((b) => ({ ...b, [term]: false }));
    }
  }, [client, apiKey, group.category, termDefs, termBusy]);

  // When the user opens the group, kick off any explanations/definitions
  // we don't already have cached.
  useEffect(() => {
    if (!open) return;
    fetchExplain();
    for (const t of group.terms) if (!termDefs[t]) fetchTermDef(t);
  // eslint-disable-next-line
  }, [open]);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: c.bg, color: c.text }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 text-center"
        aria-expanded={open}
      >
        <div className="text-xs uppercase tracking-wide font-semibold opacity-80">{group.difficulty}</div>
        <div className="font-bold text-base sm:text-lg">{group.category}</div>
        <div className="text-sm mt-0.5">{group.terms.join(' · ')}</div>
        <div className="text-[10px] mt-1 opacity-70">{open ? '▾ tap to collapse' : '▸ tap for explanation and flashcards'}</div>
      </button>
      {open && (
        <div className="bg-[var(--bg-card-soft)] border-t border-black/10 px-4 py-3 space-y-3" style={{ color: 'var(--text)' }}>
          {/* How they connect */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1">How they connect</div>
            {explainBusy && <div className="text-sm text-[var(--text-muted)]">Loading…</div>}
            {explainErr && !explain && <div className="text-sm text-[var(--text-faint)]">{explainErr}</div>}
            {explain && <p className="text-sm text-[var(--text)] leading-snug">{explain}</p>}
            {!explain && !explainBusy && !explainErr && (
              <div className="text-sm text-[var(--text-muted)]">No explanation cached.</div>
            )}
          </div>
          {/* Term flashcards */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] mb-1">Flashcards</div>
            <div className="grid grid-cols-2 gap-2">
              {group.terms.map((t) => {
                const flipped = flippedTerm === t;
                const def = termDefs[t];
                const busy = termBusy[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFlippedTerm(flipped ? null : t)}
                    className="bg-[var(--bg-elev)] border border-[var(--border-soft)] hover:bg-[var(--bg-hover)] rounded-lg px-3 py-2 text-left min-h-[68px]"
                    style={{ color: 'var(--text)' }}
                  >
                    {flipped ? (
                      <div className="text-xs leading-snug">
                        {def
                          ? def
                          : busy
                            ? <span className="text-[var(--text-muted)]">Loading…</span>
                            : <span className="text-[var(--text-muted)]">{apiKey ? 'No definition cached.' : 'Add a Gemini API key in Settings.'}</span>}
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-semibold">{t}</div>
                        <div className="text-[10px] text-[var(--text-faint)] mt-0.5">tap to flip</div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- daily Connections ----------
// NYT-style fixed palette so the puzzle reads the same in every theme.
const CONNECTIONS_DIFFICULTY_ORDER = ['green', 'yellow', 'blue', 'purple'];
const CONNECTIONS_COLORS = {
  green:  { bg: '#a0c35a', text: '#1a2b07' },
  yellow: { bg: '#f9df6d', text: '#3a2c00' },
  blue:   { bg: '#b0c4ef', text: '#0c1d4a' },
  purple: { bg: '#ba81c5', text: '#2e0a3a' },
};
function normalizeDifficulty(d) {
  const k = (d || '').toLowerCase();
  return CONNECTIONS_COLORS[k] ? k : 'green';
}
// Stable shuffle for initial render so the same day's puzzle has the same starting
// layout for every user (date-seeded), but the in-game Shuffle button is free-form.
function seededShuffle(arr, seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  const rng = () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function ConnectionsRunner({ date, payload, onClose, alreadyDone }) {
  const { addAttempt, flushSync } = useApp();
  const groups = useMemo(() => {
    // Sort by canonical difficulty order so the reveal-on-solve sequence reads green → purple.
    const list = (payload.groups || []).map((g) => ({ ...g, difficulty: normalizeDifficulty(g.difficulty) }));
    list.sort((a, b) => CONNECTIONS_DIFFICULTY_ORDER.indexOf(a.difficulty) - CONNECTIONS_DIFFICULTY_ORDER.indexOf(b.difficulty));
    return list;
  }, [payload]);
  const termToGroup = useMemo(() => {
    const m = new Map();
    groups.forEach((g) => g.terms.forEach((t) => m.set(t, g)));
    return m;
  }, [groups]);
  const allTerms = useMemo(() => groups.flatMap((g) => g.terms), [groups]);

  const savedResult = alreadyDone ? (getConnectionsResults()[date] || null) : null;
  const startSolved = savedResult?.solvedCategories || [];
  const [solved, setSolved] = useState(() => startSolved); // [categoryName...] in solve order
  const [order, setOrder] = useState(() => {
    const remaining = allTerms.filter((t) => !startSolved.some((cat) => groups.find((g) => g.category === cat)?.terms.includes(t)));
    return seededShuffle(remaining, `connections:${date}`);
  });
  const [selected, setSelected] = useState([]);
  const [mistakes, setMistakes] = useState(savedResult?.mistakes || 0);
  const [phase, setPhase] = useState(() => {
    if (!savedResult) return 'play';
    return savedResult.won ? 'won' : 'lost';
  });
  const [message, setMessage] = useState('');
  const [shaking, setShaking] = useState(false);
  const finalizedRef = useRef(!!savedResult);

  const solvedGroups = solved.map((cat) => groups.find((g) => g.category === cat)).filter(Boolean);
  const unsolvedGroups = groups.filter((g) => !solved.includes(g.category));

  const toggle = (term) => {
    if (phase !== 'play') return;
    if (solved.some((cat) => groups.find((g) => g.category === cat)?.terms.includes(term))) return;
    sfxTap(); vibrateTap();
    setMessage('');
    setSelected((s) => {
      if (s.includes(term)) return s.filter((x) => x !== term);
      if (s.length >= 4) return s;
      return [...s, term];
    });
  };

  const shuffle = () => {
    if (phase !== 'play') return;
    sfxTap(); vibrateTap();
    setMessage('');
    setOrder((o) => {
      // Fisher-Yates with a new seed each click.
      const out = o.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    });
  };

  const deselect = () => {
    if (phase !== 'play') return;
    sfxTap();
    setSelected([]);
    setMessage('');
  };

  const finalize = (won, finalSolved, finalMistakes) => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    // Log one attempt per group: correct if that group was solved (i.e. user identified it).
    const solvedSet = new Set(finalSolved);
    groups.forEach((g) => {
      addAttempt({
        question_id: `connections_${date}_${g.category.slice(0, 40)}`,
        mode: 'connections',
        file_id: `connections_${date}`,
        chapter: `Daily Connections — ${date}`,
        subject: 'Connections',
        correct: solvedSet.has(g.category),
        user_answer: g.category,
      });
    });
    setConnectionsResult(date, {
      won,
      solvedCategories: finalSolved,
      mistakes: finalMistakes,
      total: 4,
      completed_at: Date.now(),
    });
    window.dispatchEvent(new Event('mcat:connectionsDone'));
    setTimeout(() => { try { flushSync(); } catch {} }, 120);
  };

  const submit = () => {
    if (phase !== 'play' || selected.length !== 4) return;
    const cats = selected.map((t) => termToGroup.get(t)?.category);
    const allSame = cats.every((c) => c && c === cats[0]);
    if (allSame) {
      playSfx('correct'); vibrateCorrect();
      const newSolved = [...solved, cats[0]];
      const remaining = order.filter((t) => !selected.includes(t));
      setSolved(newSolved);
      setOrder(remaining);
      setSelected([]);
      setMessage('');
      if (newSolved.length === 4) {
        setPhase('won');
        finalize(true, newSolved, mistakes);
      }
    } else {
      playSfx('wrong'); vibrateWrong();
      // One-away check: 3 of 4 in some category.
      const counts = {};
      cats.forEach((c) => { if (c) counts[c] = (counts[c] || 0) + 1; });
      const oneAway = Object.values(counts).some((n) => n === 3);
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setMessage(oneAway ? 'One away…' : 'Not quite');
      if (newMistakes >= 4) {
        // Reveal remaining groups in difficulty order and end as a loss.
        const finalSolved = [...solved, ...unsolvedGroups.map((g) => g.category)];
        setSolved(finalSolved);
        setOrder([]);
        setSelected([]);
        setPhase('lost');
        finalize(false, solved, newMistakes); // user actually solved only `solved`
      }
    }
  };

  const dots = [0, 1, 2, 3];
  const mistakesLeft = 4 - mistakes;

  // Lock background page scroll while the runner is open — see CarsRunner.
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[var(--bg)] overflow-y-auto" style={{ top: 'var(--mcat-header-h, 56px)', marginTop: 0 }}>
      <style>{`
        @keyframes conn-shake { 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(3px)} 30%,50%,70%{transform:translateX(-5px)} 40%,60%{transform:translateX(5px)} }
        .conn-shake { animation: conn-shake 0.45s ease-in-out; }
      `}</style>
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border-soft)] px-3 sm:px-6 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Daily Connections · {date}</div>
            <h2 className="font-semibold text-[var(--text-strong)] truncate">{payload.title || 'MCAT Connections'}</h2>
          </div>
          <button onClick={onClose} className="shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">Close</button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-3 sm:p-6 space-y-4">

        <div className="bg-[var(--bg-card-soft)] border border-[var(--border-soft)] rounded-xl p-3 text-sm text-[var(--text-muted)]">
          Pick 4 terms that share a hidden MCAT connection. Solve all 4 groups — green is easiest, purple is hardest. 4 mistakes and it's over.
        </div>

        {/* Solved groups */}
        {solvedGroups.length > 0 && (
          <div className="space-y-2">
            {solvedGroups.map((g) => (
              <SolvedConnectionGroup key={g.category} group={g} date={date} />
            ))}
          </div>
        )}

        {/* Unsolved grid */}
        {order.length > 0 && (
          <div className={`grid grid-cols-4 gap-1.5 sm:gap-2 ${shaking ? 'conn-shake' : ''}`}>
            {order.map((term) => {
              const isSel = selected.includes(term);
              return (
                <button
                  key={term}
                  onClick={() => toggle(term)}
                  disabled={phase !== 'play'}
                  data-no-haptic
                  className={
                    `aspect-square rounded-lg px-1 py-1 text-[10px] sm:text-xs font-semibold leading-tight ` +
                    `flex items-center justify-center text-center break-words transition-colors ` +
                    (isSel
                      ? 'bg-[var(--text-strong)] text-[var(--bg)] '
                      : 'bg-[var(--bg-elev)] hover:bg-[var(--bg-hover)] text-[var(--text)] ')
                  }
                  style={isSel ? {} : { border: '1px solid var(--border-soft)' }}
                >
                  <span className="px-0.5">{term}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Mistakes + status */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span>Mistakes remaining:</span>
            <div className="flex gap-1.5">
              {dots.map((i) => (
                <span
                  key={i}
                  className={`inline-block w-2.5 h-2.5 rounded-full ${i < mistakesLeft ? 'bg-[var(--text-strong)]' : 'bg-[var(--border)]'}`}
                />
              ))}
            </div>
          </div>
          {message && (
            <span className={`text-sm font-medium ${phase === 'play' ? 'text-[var(--danger-text)]' : 'text-[var(--text-muted)]'}`}>
              {message}
            </span>
          )}
        </div>

        {/* Win / Loss banner */}
        {phase === 'won' && (
          <div className="bg-[var(--success-bg-strong)] border border-[var(--success-border)] rounded-xl p-4 text-center">
            <div className="font-semibold text-[var(--success-text)]">Solved — {mistakes} mistake{mistakes === 1 ? '' : 's'}</div>
            <div className="text-sm text-[var(--text)] mt-1">Come back tomorrow for a new puzzle.</div>
          </div>
        )}
        {phase === 'lost' && (
          <div className="bg-[var(--danger-bg-strong)] border border-[var(--danger-border)] rounded-xl p-4 text-center">
            <div className="font-semibold text-[var(--danger-text)]">Out of mistakes</div>
            <div className="text-sm text-[var(--text)] mt-1">Answers revealed above. Try tomorrow's puzzle.</div>
          </div>
        )}

        {/* Controls */}
        {phase === 'play' ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={shuffle}
              className="text-sm py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)]"
            >
              Shuffle
            </button>
            <button
              onClick={deselect}
              disabled={selected.length === 0}
              className="text-sm py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-40"
            >
              Deselect
            </button>
            <button
              onClick={submit}
              disabled={selected.length !== 4}
              className="text-sm py-2.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg font-semibold"
            >
              Submit
            </button>
          </div>
        ) : (
          <button onClick={onClose} className="w-full text-sm py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium">
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// Home card — today's Connections puzzle. Generates if nobody has yet (and the user has a key).
function DailyConnectionsCard() {
  const { api, client, apiKey, session, extractions, files } = useApp();
  const today = todayStr();
  const cached = getConnectionsCachePayload(today);
  const [state, setState] = useState(cached ? 'ready' : 'loading'); // loading | ready | generating | unavailable | needs-terms | error
  const [payload, setPayload] = useState(cached);
  const [err, setErr] = useState('');
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const result = getConnectionsResults()[today];

  // Build the term pool from every chapter's extracted key_terms.
  const termPool = useMemo(() => {
    const out = [];
    const seen = new Set();
    for (const f of files) {
      const ext = extractions[f.file_id];
      if (!ext?.key_terms) continue;
      for (const kt of ext.key_terms) {
        const key = (kt.term || '').trim();
        if (!key || seen.has(key.toLowerCase())) continue;
        seen.add(key.toLowerCase());
        out.push({
          term: key,
          definition: kt.definition || '',
          subject: f.subject || '',
          chapter: f.chapter || f.name || '',
        });
      }
    }
    return out;
  }, [files, extractions]);

  useEffect(() => {
    let cancelled = false;
    if (!getConnectionsCachePayload(today)) setState('loading');
    setErr('');
    api.getConnections(today)
      .then((d) => {
        if (cancelled) return;
        setConnectionsCachePayload(today, d.payload);
        setPayload(d.payload);
        setState('ready');
      })
      .catch(async (e) => {
        if (cancelled) return;
        if (e.status !== 404) { setErr(e.message); setState('error'); return; }
        if (!apiKey || !session) { setState('unavailable'); return; }
        if (termPool.length < 24) { setState('needs-terms'); return; }
        setState('generating');
        try {
          // The model occasionally returns a term whose casing / spacing / punctuation
          // differs slightly from the pool (e.g. "Reticular formation" vs "reticular
          // formation"). Reconcile to the canonical pool spelling instead of failing, and
          // retry the whole generation a few times before giving up.
          const poolSet = new Set(termPool.map((t) => t.term));
          const norm = (s) => (s || '').toLowerCase().replace(/[\s\-_/]+/g, ' ').replace(/[^a-z0-9 ]/g, '').trim();
          const normMap = new Map();
          for (const t of termPool) { const n = norm(t.term); if (n && !normMap.has(n)) normMap.set(n, t.term); }
          const reconcile = (term) => {
            if (poolSet.has(term)) return term;
            const n = norm(term);
            if (!n) return null;
            if (normMap.has(n)) return normMap.get(n);
            for (const [pn, canon] of normMap) { if (pn.includes(n) || n.includes(pn)) return canon; }
            return null;
          };
          const buildValid = async () => {
            const gen = await client.generateDailyConnections(termPool, today);
            if (!gen?.groups?.length) throw new Error('Generation returned no groups.');
            if (gen.groups.length !== 4) throw new Error('Generation did not return 4 groups.');
            const usedTerms = new Set();
            for (const g of gen.groups) {
              if (!Array.isArray(g.terms) || g.terms.length !== 4) throw new Error('Each group must have 4 terms.');
              g.terms = g.terms.map((t) => {
                const canon = reconcile(t);
                if (!canon) throw new Error(`Generated term not in pool: ${t}`);
                if (usedTerms.has(canon)) throw new Error(`Term used in more than one group: ${canon}`);
                usedTerms.add(canon);
                return canon;
              });
            }
            return gen;
          };

          let gen = null, lastErr = null;
          for (let attempt = 0; attempt < 3 && !cancelled; attempt++) {
            try { gen = await buildValid(); break; } catch (e) { lastErr = e; }
          }
          if (!gen) throw lastErr || new Error('Could not generate a valid puzzle.');
          await api.postConnections({ date: today, title: gen.title || '', payload: gen });
          if (!cancelled) { setConnectionsCachePayload(today, gen); setPayload(gen); setState('ready'); }
        } catch (ge) {
          // Someone else may have generated it in the meantime — try one more fetch.
          try {
            const d2 = await api.getConnections(today);
            if (!cancelled) { setConnectionsCachePayload(today, d2.payload); setPayload(d2.payload); setState('ready'); return; }
          } catch {}
          if (!cancelled) { setErr(ge.message); setState('error'); }
        }
      });
    return () => { cancelled = true; };
  }, [api, today, tick, apiKey, session, termPool, client]);

  const card = (inner) => (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">{inner}</div>
  );

  if (state === 'loading') return card(<div className="text-sm text-[var(--text-muted)]">Checking today's Connections…</div>);
  if (state === 'generating') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Daily Connections</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">Generating today's puzzle with Gemini — about 15 seconds…</p>
    </div>
  );
  if (state === 'unavailable') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Daily Connections</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">
        Today's puzzle hasn't been generated yet. It appears once someone signed in with a Gemini API key opens the app.
      </p>
    </div>
  );
  if (state === 'needs-terms') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Daily Connections</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">
        Not enough terms yet to build a puzzle — process a few more chapters in the Library tab and check back.
      </p>
    </div>
  );
  if (state === 'error') return card(
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-[var(--text-strong)]">Daily Connections</h2>
        <button onClick={() => setTick((t) => t + 1)} className="shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">Retry</button>
      </div>
      <p className="text-sm text-[var(--danger-text)] mt-1 break-words whitespace-pre-wrap">{err}</p>
    </div>
  );

  return (
    <>
      <div className={`bg-[var(--bg-card)] border rounded-2xl p-4 sm:p-5 ${result ? 'border-[var(--border-soft)]' : 'border-[var(--accent-border)]'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-[var(--text-strong)]">Today's Connections</h2>
              {!result && <span className="w-2 h-2 rounded-full bg-[var(--danger-border)]" />}
            </div>
            {payload?.title && <div className="text-sm text-[var(--text)] mt-0.5">{payload.title}</div>}
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              4×4 grid · 4 hidden categories · green → purple difficulty
              {result?.won && <span className="text-[var(--success-text)]"> · solved with {result.mistakes} mistake{result.mistakes === 1 ? '' : 's'}</span>}
              {result && !result.won && <span className="text-[var(--danger-text)]"> · gave up at {result.solvedCategories?.length || 0}/4</span>}
            </div>
          </div>
          <button
            onClick={() => setRunning(true)}
            className="shrink-0 text-sm px-4 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg font-medium"
          >
            {result ? 'Review' : 'Play'}
          </button>
        </div>
      </div>
      {running && payload && (
        <ConnectionsRunner
          date={today}
          payload={payload}
          alreadyDone={!!result}
          onClose={() => { setRunning(false); setTick((t) => t + 1); }}
        />
      )}
    </>
  );
}

// Connections archive — every past day, openable from the Bank tab (bottom).
function ConnectionsArchive() {
  const { api } = useApp();
  const [days, setDays] = useState(null);
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(null); // { date, payload }
  const [loadingDate, setLoadingDate] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const today = todayStr();
  const results = getConnectionsResults();

  useEffect(() => {
    let cancelled = false;
    api.listConnections()
      .then((d) => { if (!cancelled) setDays(d.days || []); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api]);

  const openDay = async (date) => {
    const cachedPayload = getConnectionsCachePayload(date);
    if (cachedPayload) { setOpen({ date, payload: cachedPayload }); return; }
    setLoadingDate(date);
    try {
      const d = await api.getConnections(date);
      setConnectionsCachePayload(date, d.payload);
      setOpen({ date, payload: d.payload });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoadingDate(null);
    }
  };

  const visibleDays = days && (expanded ? days : days.slice(0, 3));
  const extraCount = days ? Math.max(0, days.length - 3) : 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-semibold text-[var(--text-strong)]">Daily Connections archive</h3>
        {days && <span className="text-xs text-[var(--text-faint)]">{days.length} day{days.length === 1 ? '' : 's'}</span>}
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-3">Every day's Connections puzzle. Replay any one.</p>
      {err && <div className="text-sm text-[var(--danger-text)] mb-2">{err}</div>}
      {!days && <div className="text-sm text-[var(--text-muted)]">Loading…</div>}
      {days && days.length === 0 && (
        <div className="text-sm text-[var(--text-muted)]">No Connections days yet — the first appears once today's is generated.</div>
      )}
      {days && days.length > 0 && (
        <ul className="divide-y divide-[var(--border-soft)]">
          {visibleDays.map((d) => {
            const r = results[d.date];
            return (
              <li key={d.date} className="py-2.5 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-[var(--text)]">
                    <span className="font-medium">{d.date}{d.date === today ? ' · today' : ''}</span>
                    {d.title && <span className="text-[var(--text-muted)]"> — {d.title}</span>}
                  </div>
                  <div className="text-xs text-[var(--text-faint)]">
                    by @{d.created_by || 'unknown'}
                    {r?.won && <span className="text-[var(--success-text)]"> · solved ({r.mistakes} mistake{r.mistakes === 1 ? '' : 's'})</span>}
                    {r && !r.won && <span className="text-[var(--danger-text)]"> · {r.solvedCategories?.length || 0}/4 before fail</span>}
                  </div>
                </div>
                <button
                  onClick={() => openDay(d.date)}
                  disabled={loadingDate === d.date}
                  className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
                >
                  {loadingDate === d.date ? 'Loading…' : (r ? 'Review' : 'Open')}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {days && extraCount > 0 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 text-xs text-[var(--accent-text)] hover:underline"
        >
          {expanded ? 'Show less' : `Show ${extraCount} more day${extraCount === 1 ? '' : 's'}`}
        </button>
      )}
      {open && open.payload && (
        <ConnectionsRunner
          date={open.date}
          payload={open.payload}
          alreadyDone={!!results[open.date]}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

// CARS calendar — GitHub-style grid of daily CARS activity + accuracy.
function CarsCalendar() {
  const results = getCarsResults();
  const done = Object.entries(results).filter(([, r]) => r && r.total);
  const WEEKS = 13;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const total = (WEEKS - 1) * 7 + today.getDay() + 1;
  const days = [];
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  // Streak: consecutive days up to today with a result (today not-yet-done doesn't break it).
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const r = results[todayStr(d)];
    if (r && r.total) streak++;
    else if (i === 0) continue;
    else break;
  }
  const doneCount = done.length;
  const avgAcc = doneCount
    ? Math.round((done.reduce((s, [, r]) => s + r.score / r.total, 0) / doneCount) * 100)
    : 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-semibold text-[var(--text-strong)]">CARS calendar</h3>
        <span className="text-xs text-[var(--text-muted)]">
          {doneCount} done · {avgAcc}% avg · {streak}-day streak
        </span>
      </div>
      <p className="text-[11px] text-[var(--text-faint)] mb-3">Last 13 weeks. Greener = higher accuracy.</p>
      <div className="grid gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)', gridAutoFlow: 'column' }}>
        {days.map((d) => {
          const key = todayStr(d);
          const r = results[key];
          const acc = r && r.total ? r.score / r.total : null;
          const style = acc != null
            ? { background: 'var(--success-border)', opacity: 0.3 + acc * 0.7 }
            : { background: 'var(--bg-elev)' };
          return (
            <div
              key={key}
              title={r ? `${key} — ${r.score}/${r.total} (${Math.round(acc * 100)}%)` : `${key} — not done`}
              className="rounded-sm"
              style={{ ...style, aspectRatio: '1', minWidth: '9px' }}
            />
          );
        })}
      </div>
      {doneCount === 0 && (
        <p className="text-xs text-[var(--text-faint)] mt-3">Do a daily CARS passage and it lights up here.</p>
      )}
    </div>
  );
}

// ---------- home view ----------
function HomeView({ onGoToStudy }) {
  const { session } = useApp();
  const username = session?.username || 'student';

  // Quote rotates once per page load. useMemo on [] freezes it for the session.
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="space-y-4">
      <BirdHero username={username} quote={quote} />

      <DailyCarsCard />

      <DailyConnectionsCard />

      <HomeActivity />

      <DailyExamCard onGoToStudy={onGoToStudy} />
    </div>
  );
}

// Daily 15-question MCAT-style mini-exam, generated fresh each day by Gemini from
// the chapters the student has already mastered (the "Mode A / Daily Exam" idea).
// Generated once per calendar day and cached locally; launched through the normal
// QuizRunner so attempts record against each question's source chapter — which also
// seeds the proportional question bank over time.
const DAILY_EXAM_COUNT = 15;

// Best-effort map from a chapter's subject to its MCAT section, used to key the
// shared exam bank. Biochemistry spans B/B and C/P on the real exam; we file it
// under B/B by default. Returns null for unrecognized subjects.
function sectionForSubject(subject) {
  const s = (subject || '').toLowerCase();
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

// ---------- full mini exam (4-section, bank-drawn, proportional) ----------
// Kaplan per-subject chapter abundance (within-subject %, sums to 100). Used to
// weight chapter selection so the mini exam mirrors the real distribution of
// content within each subject. Physics & Math only has chapters 1-9.
const KAPLAN_CHAPTER_ABUNDANCE = {
  'Behavioral Science': { 1: 8, 2: 6, 3: 14, 4: 7, 5: 6, 6: 7, 7: 4, 8: 9, 9: 7, 10: 10, 11: 13, 12: 9 },
  'Biochemistry':       { 1: 20, 2: 14, 3: 4, 4: 4, 5: 3, 6: 14, 7: 9, 8: 10, 9: 5, 10: 6, 11: 2, 12: 9 },
  'Biology':            { 1: 18, 2: 9, 3: 5, 4: 12, 5: 9, 6: 3, 7: 6, 8: 6, 9: 4, 10: 7, 11: 8, 12: 13 },
  'General Chemistry':  { 1: 7, 2: 10, 3: 12, 4: 7, 5: 11, 6: 4, 7: 7, 8: 9, 9: 8, 10: 15, 11: 4, 12: 6 },
  'Organic Chemistry':  { 1: 4, 2: 12, 3: 3, 4: 5, 5: 13, 6: 8, 7: 6, 8: 9, 9: 11, 10: 4, 11: 8, 12: 17 },
  'Physics and Math':   { 1: 6, 2: 11, 3: 9, 4: 10, 5: 7, 6: 16, 7: 11, 8: 14, 9: 16 },
};

// AAMC section → discipline weights (within-section %, aligned to the Kaplan
// subject names above so chapter abundance can be applied). CARS has no chapter
// content. P/S folds psychology + sociology into Kaplan's "Behavioral Science".
const MINI_EXAM_BLUEPRINT = {
  'C/P':  { 'General Chemistry': 30, 'Physics and Math': 25, 'Biochemistry': 25, 'Organic Chemistry': 15, 'Biology': 5 },
  'CARS': {},
  'B/B':  { 'Biology': 65, 'Biochemistry': 25, 'General Chemistry': 5, 'Organic Chemistry': 5 },
  'P/S':  { 'Behavioral Science': 95, 'Biology': 5 },
};
const MINI_EXAM_SECTIONS = ['C/P', 'CARS', 'B/B', 'P/S'];
const MINI_EXAM_PER_SECTION = 30;

// Map a free-text bank subject to a canonical Kaplan subject key. Order matters
// (biochem before bio, organic/general chem before generic chem).
function canonicalizeSubject(subject) {
  const s = (subject || '').toLowerCase();
  if (/behav|psych|soc/.test(s)) return 'Behavioral Science';
  if (/biochem/.test(s)) return 'Biochemistry';
  if (/organic|orgo/.test(s)) return 'Organic Chemistry';
  if (/general chem|gen chem|inorganic/.test(s)) return 'General Chemistry';
  if (/physics|math/.test(s)) return 'Physics and Math';
  if (/bio/.test(s)) return 'Biology';
  if (/chem/.test(s)) return 'General Chemistry';
  return null;
}

// Pull the leading chapter number out of a free-text chapter label.
function chapterNum(chapter) {
  const m = String(chapter || '').match(/\d+/);
  return m ? Number(m[0]) : null;
}

// Largest-remainder allocation of `total` slots across weighted keys.
function allocateCounts(weights, total) {
  const entries = Object.entries(weights);
  const sum = entries.reduce((a, [, w]) => a + w, 0) || 1;
  const raw = entries.map(([k, w]) => [k, (w / sum) * total]);
  const out = {};
  let used = 0;
  for (const [k, r] of raw) { out[k] = Math.floor(r); used += out[k]; }
  let rem = total - used;
  const fracs = raw.map(([k, r]) => [k, r - Math.floor(r)]).sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < fracs.length && rem > 0; i++, rem--) out[fracs[i][0]]++;
  return out;
}

// Weighted sampling without replacement.
function weightedSample(items, weightFn, k) {
  const pool = items.slice();
  const out = [];
  while (out.length < k && pool.length) {
    let total = 0;
    for (const it of pool) total += Math.max(0.0001, weightFn(it));
    let r = Math.random() * total;
    let idx = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= Math.max(0.0001, weightFn(pool[i]));
      if (r <= 0) { idx = i; break; }
    }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

// Assemble up to `target` questions for one section from its available bank pool,
// proportional to discipline weights and (within subject) Kaplan chapter abundance.
// Backfills any shortfall from leftover questions in the same section.
function assembleSection(section, available, target = MINI_EXAM_PER_SECTION) {
  const weights = MINI_EXAM_BLUEPRINT[section] || {};
  const bySubject = {};
  for (const it of available) {
    const subj = canonicalizeSubject(it.subject) || 'Other';
    (bySubject[subj] || (bySubject[subj] = [])).push(it);
  }
  const desired = Object.keys(weights).length ? allocateCounts(weights, target) : {};
  const chosen = [];
  const used = new Set();
  for (const [subj, want] of Object.entries(desired)) {
    const items = (bySubject[subj] || []).filter((it) => !used.has(it.id));
    const ab = KAPLAN_CHAPTER_ABUNDANCE[subj] || {};
    const picked = weightedSample(items, (it) => ab[chapterNum(it.chapter)] || 1, Math.min(want, items.length));
    for (const p of picked) { chosen.push(p); used.add(p.id); }
  }
  if (chosen.length < target) {
    for (const it of shuffle(available.filter((it) => !used.has(it.id)))) {
      if (chosen.length >= target) break;
      chosen.push(it); used.add(it.id);
    }
  }
  return shuffle(chosen).slice(0, target);
}

// Card for launching the proportional, bank-drawn 4-section mini exam. Lives
// above "Start a quiz" in the study page. Pulls from the shared exam bank, so it
// works without any locally-processed chapters; shows per-section readiness.
function MiniExamCard() {
  const { api } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    api.examBankStats().then((s) => { if (alive) setStats(s); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const sectionCounts = useMemo(() => {
    const m = {};
    for (const row of (stats?.by_section || [])) if (row.section) m[row.section] = row.n;
    return m;
  }, [stats]);

  const readyTotal = MINI_EXAM_SECTIONS.reduce(
    (a, s) => a + Math.min(MINI_EXAM_PER_SECTION, sectionCounts[s] || 0), 0
  );
  const target = MINI_EXAM_SECTIONS.length * MINI_EXAM_PER_SECTION;

  const start = async () => {
    setLoading(true); setErr('');
    try {
      const items = [];
      for (const section of MINI_EXAM_SECTIONS) {
        const res = await api.examBankQuestions({ section, limit: 120 }).catch(() => ({ questions: [] }));
        const picked = assembleSection(section, res?.questions || [], MINI_EXAM_PER_SECTION);
        for (const q of picked) {
          items.push({
            id: q.id,
            mode: 'mc',
            q: { question: q.question, choices: q.choices, correct_index: q.correct_index, explanation: q.explanation },
            chapter: q.chapter,
            subject: q.subject,
          });
        }
      }
      if (!items.length) {
        setErr('The shared exam bank is empty. Generate daily exams to seed it, then try again.');
        return;
      }
      sfxQuizStart();
      window.dispatchEvent(new CustomEvent('mcat:startQuiz', { detail: { items } }));
    } catch (e) {
      setErr('Could not load the exam bank. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Full Mini exam</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            A four-section mini MCAT ({target} questions, 30 per section) drawn from the shared
            community bank, weighted to match real subject and chapter abundance.
          </p>
        </div>
        <span className="shrink-0 text-xs text-[var(--text-faint)] self-center">{readyTotal}/{target} ready</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {MINI_EXAM_SECTIONS.map((s) => {
          const have = Math.min(MINI_EXAM_PER_SECTION, sectionCounts[s] || 0);
          const full = have >= MINI_EXAM_PER_SECTION;
          return (
            <span
              key={s}
              className={`text-xs px-2 py-1 rounded border ${full
                ? 'border-[var(--accent-border)] text-[var(--accent-text)] bg-[var(--accent-soft)]'
                : 'border-[var(--border)] text-[var(--text-muted)]'}`}
              title={s === 'CARS' ? 'CARS questions are not yet seeded into the shared bank.' : ''}
            >
              {s} {have}/{MINI_EXAM_PER_SECTION}
            </span>
          );
        })}
      </div>

      {sectionCounts['CARS'] ? null : (
        <p className="text-xs text-[var(--text-faint)]">
          CARS isn't seeded into the shared bank yet, so the exam will be short that section.
        </p>
      )}

      {err && <p className="text-xs text-red-400">{err}</p>}

      <button
        onClick={start}
        disabled={loading || readyTotal === 0}
        className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-3 sm:py-2.5 font-medium"
      >
        {loading ? 'Assembling exam…' : readyTotal === 0 ? 'Bank empty — generate daily exams first' : `Start ${readyTotal}-question mini exam`}
      </button>
    </div>
  );
}

function DailyExamCard({ onGoToStudy }) {
  const { client, api, session, apiKey, files, questions, extractions, attempts } = useApp();
  const today = todayStr();
  const cached = getDailyExamPayload(today);
  const [payload, setPayload] = useState(cached);
  const [state, setState] = useState(cached ? 'ready' : 'idle'); // idle | generating | ready | unavailable | error
  const [err, setErr] = useState('');

  // Chapters the student has mastered in the Lessons tab — i.e. passed the lesson's
  // final exam 100% (the lessonGates store). The daily exam can only draw from these;
  // master more lessons and the pool grows. A chapter also needs extraction material
  // to generate from.
  const mastered = useMemo(() => {
    const g = storage.get(KEYS.lessonGates, {}) || {};
    return files
      .filter((f) => f.chapter_id && g[f.chapter_id]?.mastered && extractions[f.file_id])
      .map((f) => ({ subject: f.subject, chapter: f.chapter, extraction: extractions[f.file_id] }));
  }, [files, extractions]);

  // Items the runner can consume, wrapped to the {id, mode, q, file_id, chapter, subject} shape.
  const items = useMemo(() => {
    const qs = payload?.questions || [];
    return qs.map((q) => ({
      id: q.id,
      mode: 'mc',
      q: { question: q.question, choices: q.choices, correct_index: q.correct_index, explanation: q.explanation },
      file_id: `daily_${today}`,
      chapter: q.chapter || 'Daily exam',
      subject: q.subject || '',
    }));
  }, [payload, today]);

  // How many of today's items the student has already answered today.
  const doneToday = useMemo(() => {
    if (!items.length) return 0;
    const ids = new Set(items.map((x) => x.id));
    const seen = new Set();
    for (const a of attempts) {
      if (ids.has(a.question_id) && a.ts && todayStr(new Date(a.ts)) === today) seen.add(a.question_id);
    }
    return seen.size;
  }, [items, attempts, today]);

  // Decide the resting state once we know whether today's set exists / can be made.
  useEffect(() => {
    if (payload) { setState('ready'); return; }
    if (state === 'generating') return;
    if (!apiKey) { setState('unavailable'); return; }
    if (!mastered.length) { setState('idle'); return; }
    setState('idle');
  }, [payload, apiKey, mastered.length]);

  const generate = async () => {
    if (!apiKey || !mastered.length) return;
    setState('generating');
    setErr('');
    try {
      const questionsOut = await client.generateDailyExam(mastered, DAILY_EXAM_COUNT);
      if (!questionsOut?.length) throw new Error('Generation returned no questions.');
      const p = { date: today, questions: questionsOut };
      setDailyExamPayload(today, p);
      setPayload(p);
      setState('ready');
      // Contribute to the shared bank, keyed by section/subject/chapter. Fire-and-forget:
      // the bank growing must never block the student starting their exam. Server dedupes.
      if (session) {
        const contribution = questionsOut.map((q) => ({
          section: sectionForSubject(q.subject),
          subject: q.subject,
          chapter: q.chapter,
          content_category: q.content_category,
          sirs_skill: q.sirs_skill,
          question: q.question,
          choices: q.choices,
          correct_index: q.correct_index,
          explanation: q.explanation,
        }));
        api.postExamBank(contribution).catch(() => {});
      }
    } catch (e) {
      setErr(e.message || String(e));
      setState('error');
    }
  };

  const launch = () => {
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', { detail: { items } }));
    onGoToStudy?.();
  };

  const card = (inner, accent) => (
    <div className={`bg-[var(--bg-card)] border rounded-2xl p-4 sm:p-5 space-y-3 ${accent ? 'border-[var(--accent-border)]' : 'border-[var(--border-soft)]'}`}>{inner}</div>
  );

  if (state === 'generating') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Today's MCAT</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">Writing today's {DAILY_EXAM_COUNT} questions with Gemini — about 20 seconds…</p>
    </div>
  );

  if (state === 'error') return card(
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-[var(--text-strong)]">Today's MCAT</h2>
        <button onClick={generate} className="shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">Retry</button>
      </div>
      <p className="text-sm text-[var(--danger-text)] mt-1 break-words whitespace-pre-wrap">{err}</p>
    </div>
  );

  if (state === 'unavailable') return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Today's MCAT</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">
        Add your Gemini API key in Settings to get a fresh {DAILY_EXAM_COUNT}-question MCAT-style exam each day, written from the chapters you've mastered.
      </p>
    </div>
  );

  if (state === 'ready' && items.length) {
    const allDone = doneToday >= items.length;
    return card((
      <>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[var(--text-strong)]">Today's MCAT</h2>
            {!allDone && <span className="w-2 h-2 rounded-full bg-[var(--danger-border)]" />}
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {items.length} fresh MCAT-style questions from chapters you've mastered, written today by Gemini.
            {doneToday > 0 && !allDone && <span className="text-[var(--text)]"> · {doneToday}/{items.length} done today</span>}
            {allDone && <span className="text-[var(--success-text)]"> · completed today ✓</span>}
          </p>
        </div>
        <button
          onClick={launch}
          className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-3 text-sm font-semibold"
        >
          {allDone ? `Retake today's ${items.length} →` : `Start ${items.length}-question exam →`}
        </button>
      </>
    ), !allDone);
  }

  // idle — has a key but no set generated yet (or no mastered chapters).
  if (!mastered.length) return card(
    <div>
      <h2 className="font-semibold text-[var(--text-strong)]">Today's MCAT</h2>
      <p className="text-sm text-[var(--text-muted)] mt-1">
        Master a lesson first — pass a chapter's final exam (100%) in the Lessons tab and your daily {DAILY_EXAM_COUNT}-question exam will draw from it. Master more and the pool grows.
      </p>
    </div>
  );

  return card((
    <>
      <div>
        <h2 className="font-semibold text-[var(--text-strong)]">Today's MCAT</h2>
        <p className="text-sm text-[var(--text-muted)]">
          A fresh {DAILY_EXAM_COUNT}-question MCAT-style exam, written by Gemini from your {mastered.length} mastered chapter{mastered.length === 1 ? '' : 's'}.
        </p>
      </div>
      <button
        onClick={generate}
        className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-lg py-3 text-sm font-semibold"
      >
        Generate today's exam →
      </button>
    </>
  ), true);
}

// ---------- lessons ----------
// Guided, chapter-by-chapter lessons. The lesson CONTENT (sections, teaching
// text, embedded checks) is generated per chapter by the opus pipeline described
// in Website/LESSON_GENERATION_PROMPT.md and will slot in here once published.
// Until then this tab surfaces the student's most-struggled chapters and lets
// them launch an adaptive review — the same adaptive principle the full lessons
// use: questions already answered correctly drop out and only resurface if missed
// again later.
// Latest-attempt correctness per question_id. A section's check_id counts as
// "known" only if the student's MOST RECENT answer to it was correct — so a
// later wrong answer automatically un-masters (resurfaces) the section.
function lessonLatestCorrect(attempts) {
  const best = {};
  for (const a of attempts) {
    const cur = best[a.question_id];
    if (!cur || a.ts > cur.ts) best[a.question_id] = { ts: a.ts, correct: !!a.correct };
  }
  const out = {};
  for (const k in best) out[k] = best[k].correct;
  return out;
}

// Mastery for one section given latest-attempt correctness.
function lessonSectionStatus(sec, latestCorrect) {
  const ids = Array.isArray(sec.check_ids) ? sec.check_ids : [];
  let correct = 0, attempted = 0;
  for (const id of ids) {
    if (id in latestCorrect) { attempted++; if (latestCorrect[id]) correct++; }
  }
  const thr = typeof sec.mastery_threshold === 'number' ? sec.mastery_threshold : 1.0;
  const mastered = ids.length > 0 && correct / ids.length >= thr;
  return { mastered, correct, attempted, total: ids.length };
}

// Click-to-reveal flashcard for a definition drill.
function LessonDrillCard({ term, definition }) {
  const [show, setShow] = useState(false);
  return (
    <button
      onClick={() => setShow((s) => !s)}
      className="text-left w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 hover:bg-[var(--bg-hover)]"
    >
      <div className="text-sm font-medium text-[var(--text-strong)]">{term}</div>
      {show
        ? <div className="text-xs text-[var(--text-muted)] mt-1">{definition}</div>
        : <div className="text-xs text-[var(--text-faint)] mt-1">Tap to reveal definition</div>}
    </button>
  );
}

// One lesson section. Always starts collapsed; click the header to expand.
// When `locked`, the section is gated behind an earlier checkpoint and cannot
// be opened until that checkpoint is passed.
function LessonSection({ sec, status, onQuiz, locked }) {
  const { open: openFigure } = useFigureViewer();
  const [open, setOpen] = useState(false);
  const paras = (sec.teach || '').split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const drills = Array.isArray(sec.definition_drills) ? sec.definition_drills : [];
  // Term matching runs as the final step of this section's quiz (study-only, no
  // attempt recorded) rather than as a separate widget here. It needs >=2 drills
  // with both term and definition.
  const hasMatch = drills.filter((d) => d && d.term && d.definition).length >= 2;
  const examples = Array.isArray(sec.worked_examples) ? sec.worked_examples : [];
  const figures = (Array.isArray(sec.figures) ? sec.figures : []).map(resolveFigure).filter(Boolean);
  const nChecks = Array.isArray(sec.check_ids) ? sec.check_ids.length : 0;

  if (locked) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border-soft)] bg-[var(--bg-card-soft)] p-4 opacity-70">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-[var(--text-faint)]">{sec.order}. {sec.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-faint)] font-medium">🔒 Locked</span>
        </div>
        <p className="text-xs text-[var(--text-faint)] mt-1">Pass the checkpoint above to unlock this section.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${status.mastered ? 'border-[var(--border-soft)] bg-[var(--bg-card-soft)]' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between gap-3 w-full text-left">
        <span className="font-semibold text-[var(--text-strong)]">{sec.order}. {sec.title}</span>
        <span className="flex items-center gap-2 shrink-0">
          {status.mastered
            ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-medium">Mastered ✓</span>
            : status.attempted > 0
              ? <span className="text-xs text-[var(--text-faint)]">{status.correct}/{status.total} correct</span>
              : <span className="text-xs text-[var(--text-faint)]">New</span>}
          <span className="text-[var(--text-faint)] text-xs">{open ? '▲' : '▼'}</span>
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {paras.map((p, i) => (
            <p key={i} className="text-sm text-[var(--text-muted)] leading-relaxed"><FigureText text={p} /></p>
          ))}

          {figures.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Figures</div>
              <div className="flex flex-wrap gap-2">
                {figures.map((fig, i) => (
                  <button
                    key={i}
                    onClick={() => openFigure(fig.title, fig.label)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-hover)]"
                    title={`View figure: ${fig.label}`}
                  >
                    🖼 {fig.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {examples.length > 0 && (
            <div className="space-y-2">
              {examples.map((ex, i) => (
                <div key={i} className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg p-3">
                  <div className="text-xs uppercase tracking-wide text-[var(--text-faint)] mb-1">Worked example</div>
                  <div className="text-sm text-[var(--text-strong)] whitespace-pre-wrap">{ex.prompt}</div>
                  <div className="text-sm text-[var(--text-muted)] whitespace-pre-wrap mt-2">{ex.solution}</div>
                </div>
              ))}
            </div>
          )}

          {drills.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-wide text-[var(--text-faint)]">Key terms</div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {drills.map((d, i) => <LessonDrillCard key={i} term={d.term} definition={d.definition} />)}
              </div>
            </div>
          )}

          {nChecks > 0 && (
            <div className="space-y-1">
              <button
                onClick={onQuiz}
                className="text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
              >
                {status.mastered ? 'Quiz again' : 'Quiz this section'} ({nChecks}) →
              </button>
              {hasMatch && (
                <div className="text-xs text-[var(--text-faint)]">Ends with a quick term-matching review.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Inline cumulative MC quiz that gates lesson progress. Requires a perfect
// score (100%) to pass; any miss means the whole quiz restarts with a fresh
// shuffle. Used for both per-group checkpoints (15 Q) and the final exam (30 Q).
function LessonGateQuiz({ kind, pool, need, onPass, onCancel }) {
  const { addAttempt } = useApp();
  const [round, setRound] = useState(0);
  const items = useMemo(() => shuffle(pool).slice(0, need), [pool, need, round]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [calcMin, setCalcMin] = useState(false);
  const [calcExpr, setCalcExpr] = useState('');
  const [showTable, setShowTable] = useState(false);

  const total = items.length;
  const item = items[index];
  const label = kind === 'final' ? 'Final exam' : 'Checkpoint quiz';

  const restart = () => { setRound((r) => r + 1); setIndex(0); setAnswered(false); setCorrectCount(0); setDone(false); };

  if (total === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-[var(--text-strong)]">{label}</h2>
        <p className="text-sm text-[var(--text-muted)]">No multiple-choice questions are available for this checkpoint yet.</p>
        <button onClick={onCancel} className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">← Back to lesson</button>
      </div>
    );
  }

  if (done) {
    const passed = correctCount === total;
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6 space-y-4 text-center">
        <div className="text-4xl">{passed ? '🎉' : '🔁'}</div>
        <h2 className="font-semibold text-[var(--text-strong)]">{passed ? `${label} passed!` : 'Not quite — 100% required'}</h2>
        <p className="text-sm text-[var(--text-muted)]">You scored {correctCount}/{total}.{passed ? '' : ' The quiz will reshuffle and restart from the top.'}</p>
        <div className="flex items-center justify-center gap-2">
          {passed ? (
            <button onClick={onPass} className="px-4 py-2 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">
              {kind === 'final' ? 'Master chapter →' : 'Unlock next sections →'}
            </button>
          ) : (
            <button onClick={restart} className="px-4 py-2 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">Restart quiz</button>
          )}
          <button onClick={onCancel} className="px-4 py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Back to lesson</button>
        </div>
      </div>
    );
  }

  const handleAnswer = ({ correct, isInterim }) => {
    if (isInterim || answered) return;
    setAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    addAttempt({ question_id: item.id, mode: item.mode, file_id: item.file_id, chapter: item.chapter, subject: item.subject, correct });
  };
  const next = () => {
    if (index + 1 >= total) { setDone(true); return; }
    setIndex((i) => i + 1);
    setAnswered(false);
  };
  const nextBtn = answered ? (
    <button onClick={next} className="bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded px-4 py-2 text-sm font-medium shrink-0">
      {index + 1 >= total ? 'See score' : 'Next →'}
    </button>
  ) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-[var(--text-muted)] min-w-0">
          <span className="text-[var(--text-strong)]">{label}</span>
          <span className="ml-2">· {index + 1}/{total} · need 100%</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => { setShowCalc(true); setCalcMin(false); }}
            title="Open calculator"
            aria-label="Open calculator"
            className="text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
          >🧮</button>
          <button
            onClick={() => setShowTable(true)}
            title="Open periodic table"
            aria-label="Open periodic table"
            className="text-sm px-2 py-1 border border-[var(--border)] rounded text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--bg-hover)]"
          >⚛️</button>
          <span className="text-xs font-mono text-[var(--text-muted)]">{correctCount}/{index + (answered ? 1 : 0)}</span>
          <button onClick={onCancel} className="text-xs text-[var(--text-muted)] hover:text-[var(--danger-text)] border border-[var(--border)] rounded px-2 py-1">Quit</button>
        </div>
      </div>
      <div className="h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--accent-hover)] transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        {/* Render by mode — a two-part item rendered as plain MC shows a blank card. */}
        {item.mode === 'two_part'
          ? <TwoPartQuestion key={item.id} item={item} onAnswer={handleAnswer} nextSlot={nextBtn} />
          : item.mode === 'short'
            ? <ShortAnswerQuestion key={item.id} item={item} onAnswer={handleAnswer} nextSlot={nextBtn} />
            : <MCQuestion key={item.id} item={item} onAnswer={handleAnswer} nextSlot={nextBtn} />}
      </div>
      {showCalc && (
        <CalculatorModal
          expr={calcExpr}
          setExpr={setCalcExpr}
          minimized={calcMin}
          onMinimize={() => setCalcMin((m) => !m)}
          onClose={() => { setShowCalc(false); setCalcMin(false); setCalcExpr(''); }}
        />
      )}
      {showTable && <PeriodicTableModal onClose={() => setShowTable(false)} />}
    </div>
  );
}

// Full-screen lesson reader. Sections are studied in groups of LESSON_GROUP_SIZE;
// each group is gated behind a cumulative checkpoint quiz (100% to pass) and the
// whole chapter ends with a 30-question final exam that confers "mastered".
// Override path to "master" a lesson without passing its checkpoints/final exam.
// Two gates on purpose: a confirm step ("are you sure?") then re-entry of the
// account PIN (verified server-side via /login) so it can't be a stray tap.
function ForceMasterModal({ lessonTitle, username, onVerifyPin, onConfirmMaster, onClose }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'password'
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submitPin = async () => {
    if (busy) return;
    if (!/^\d{4}$/.test(pin)) { setErr('Enter your 4-digit PIN.'); return; }
    setBusy(true); setErr('');
    try {
      await onVerifyPin(pin);
      onConfirmMaster();
      onClose();
    } catch (e) {
      setErr('Incorrect PIN. Try again.');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        {step === 'confirm' ? (
          <>
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Master without completing?</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              You haven't passed the checkpoints and final exam for <span className="text-[var(--text-strong)]">"{lessonTitle}"</span>. Are you sure you want to mark it <span className="text-[var(--text-strong)] font-medium">mastered</span> anyway?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="text-sm px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Cancel</button>
              <button onClick={() => { setErr(''); setStep('password'); }} className="text-sm px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">Yes, continue →</button>
            </div>
          </>
        ) : username ? (
          <>
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Confirm with your PIN</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              Enter the account PIN for <span className="font-mono text-[var(--text-strong)]">@{username}</span> to master this lesson.
            </p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              autoFocus
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setErr(''); }}
              onKeyDown={(e) => e.key === 'Enter' && submitPin()}
              placeholder="••••"
              className="mt-3 w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[var(--accent-border)]"
            />
            {err && <p className="text-[var(--danger-text)] text-xs mt-2">{err}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="text-sm px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Cancel</button>
              <button onClick={submitPin} disabled={busy || pin.length !== 4} className="text-sm px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40">{busy ? 'Checking…' : 'Master ✓'}</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Sign in required</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              You need to be signed in to your account to master a lesson this way. Open the Account tab, log in, then try again.
            </p>
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="text-sm px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LessonReader({ lesson, latestCorrect, completed, gate, quizPool, onBack, onQuizSection, onMarkComplete, onPassCheckpoint, onMaster, username, onVerifyPin }) {
  const sections = [...(lesson.sections || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const statuses = sections.map((s) => lessonSectionStatus(s, latestCorrect));
  const masteredCount = statuses.filter((s) => s.mastered).length;
  const total = sections.length;
  const G = LESSON_GROUP_SIZE;
  const groupCount = Math.ceil(total / G);
  const mastered = !!gate?.mastered;
  // Number of sections currently accessible. Mastered chapters are fully open.
  const unlocked = mastered ? total : Math.min(total, Math.max(G, gate?.unlocked || G));
  const allUnlocked = unlocked >= total;

  const [quiz, setQuiz] = useState(null); // { kind, pool, need, unlockTo }
  const [forceMaster, setForceMaster] = useState(false); // PIN-gated "master anyway" modal

  const poolThrough = (end) => {
    const ids = new Set();
    for (let k = 0; k < end; k++) for (const id of (sections[k].check_ids || [])) ids.add(id);
    // Draw-it-yourself items are self-graded, so they don't belong in the
    // auto-graded, 100%-to-pass checkpoint and final pools (they stay available
    // in per-section study quizzes).
    return quizPool.filter((x) => ids.has(x.id) && !(x.mode === 'two_part' && (x.q?.parts || []).some((p) => p && p.draw)));
  };
  const startCheckpoint = (groupEndIndex) => {
    const pool = poolThrough(groupEndIndex);
    setQuiz({ kind: 'checkpoint', pool, need: Math.min(LESSON_CHECKPOINT_Q, pool.length), unlockTo: Math.min(total, groupEndIndex + G) });
  };
  const startFinal = () => {
    const pool = poolThrough(total);
    setQuiz({ kind: 'final', pool, need: Math.min(LESSON_FINAL_Q, pool.length) });
  };

  if (quiz) {
    return (
      <div className="space-y-3">
        <button onClick={() => setQuiz(null)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-strong)]">← {lesson.title}</button>
        <LessonGateQuiz
          kind={quiz.kind}
          pool={quiz.pool}
          need={quiz.need}
          onCancel={() => setQuiz(null)}
          onPass={() => {
            if (quiz.kind === 'final') onMaster();
            else onPassCheckpoint(quiz.unlockTo);
            setQuiz(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <button onClick={onBack} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-strong)] mb-2">← Back to lessons</button>
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-[var(--text-strong)]">{lesson.title}</h2>
          {mastered && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-medium shrink-0">Mastered ✓</span>}
        </div>
        {lesson.intro && <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{lesson.intro}</p>}
        <div className="flex items-center justify-between gap-3 mt-3">
          <span className="text-xs text-[var(--text-faint)]">
            {masteredCount}/{total} sections mastered · {Math.min(unlocked, total)}/{total} unlocked{completed ? ' · marked complete' : ''}
          </span>
          {!completed && (
            <button
              onClick={onMarkComplete}
              className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-strong)]"
            >
              {mastered ? 'Mark complete' : 'Mark complete anyway'}
            </button>
          )}
        </div>
      </div>

      {Array.from({ length: groupCount }).map((_, g) => {
        const startIdx = g * G;
        const endIdx = Math.min(startIdx + G, total);
        const isLastGroup = endIdx >= total;
        const groupUnlocked = unlocked >= endIdx; // every section in this group is accessible
        const checkpointPassed = unlocked > endIdx || mastered; // next group already open
        return (
          <React.Fragment key={g}>
            {sections.slice(startIdx, endIdx).map((sec, j) => {
              const i = startIdx + j;
              const locked = !mastered && i >= unlocked;
              return <LessonSection key={sec.id || i} sec={sec} status={statuses[i]} onQuiz={() => onQuizSection(sec)} locked={locked} />;
            })}
            {!isLastGroup && (
              <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] p-4 flex items-center justify-between gap-3 flex-wrap">
                {checkpointPassed ? (
                  <span className="text-sm text-green-500 font-medium">✓ Checkpoint {g + 1} passed</span>
                ) : groupUnlocked ? (
                  <>
                    <span className="text-sm text-[var(--text-strong)]">Checkpoint {g + 1} — {LESSON_CHECKPOINT_Q} cumulative questions, 100% to unlock the next sections.</span>
                    <button onClick={() => startCheckpoint(endIdx)} className="text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0">Take checkpoint →</button>
                  </>
                ) : (
                  <span className="text-sm text-[var(--text-faint)]">🔒 Pass the previous checkpoint to reach this one.</span>
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-3 flex-wrap">
        {mastered ? (
          <span className="text-sm text-green-500 font-medium">🏆 Chapter mastered — you scored 100% on the final exam.</span>
        ) : (
          <>
            {allUnlocked ? (
              <>
                <span className="text-sm text-[var(--text-strong)]">Final exam — {LESSON_FINAL_Q} cumulative questions, 100% to master this chapter.</span>
                <button onClick={startFinal} className="text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0">Take final exam →</button>
              </>
            ) : (
              <span className="text-sm text-[var(--text-faint)]">🔒 Unlock all sections to take the final exam.</span>
            )}
            <button
              onClick={() => setForceMaster(true)}
              title="Mark this lesson mastered without taking the exam (requires your account PIN)"
              className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-strong)] shrink-0"
            >
              Master without the exam
            </button>
          </>
        )}
      </div>

      {forceMaster && (
        <ForceMasterModal
          lessonTitle={lesson.title}
          username={username}
          onVerifyPin={onVerifyPin}
          onConfirmMaster={onMaster}
          onClose={() => setForceMaster(false)}
        />
      )}
    </div>
  );
}

function LessonsView({ onGoToStudy }) {
  const { api, session, files, questions, extractions, attempts, stateRev } = useApp();
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('subject'); // 'weakest' | 'subject'
  const [openSubjects, setOpenSubjects] = useState({}); // subject -> expanded (collapsed by default)
  const toggleSubject = (s) => setOpenSubjects((m) => ({ ...m, [s]: !m[s] }));
  const [lessonsCache, setLessonsCache] = useState(() => storage.get(KEYS.lessonsCache, {}) || {});
  const [progress, setProgress] = useState(() => storage.get(KEYS.lessonProgress, {}) || {});
  const [gates, setGates] = useState(() => storage.get(KEYS.lessonGates, {}) || {});
  const [availMap, setAvailMap] = useState({}); // chapter_id -> lesson exists on server
  const [busy, setBusy] = useState({}); // chapter_id -> true while downloading
  const [openId, setOpenId] = useState(null); // chapter_id whose reader is open
  const [error, setError] = useState('');

  const fileToChapter = useMemo(() => {
    const m = {};
    for (const f of files) if (f.chapter_id) m[f.file_id] = f.chapter_id;
    return m;
  }, [files]);
  const chapterToFile = useMemo(() => {
    const m = {};
    for (const f of files) if (f.chapter_id) m[f.chapter_id] = f.file_id;
    return m;
  }, [files]);

  // Cheap availability probe — lesson_at is included in the chapter list, the
  // heavy lesson body is not (it only comes from GET /chapters/<id>).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listChapters();
        if (cancelled) return;
        const m = {};
        for (const ch of (data?.chapters || [])) m[ch.id] = !!ch.stages?.lesson?.done;
        setAvailMap(m);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [api]);

  const latestCorrect = useMemo(() => lessonLatestCorrect(attempts), [attempts]);

  const persistCache = (next) => { setLessonsCache(next); storage.set(KEYS.lessonsCache, next); };
  const persistProgress = (next) => { setProgress(next); storage.set(KEYS.lessonProgress, next); markStateDirty(); };
  const persistGates = (next) => { setGates(next); storage.set(KEYS.lessonGates, next); markStateDirty(); };

  // Re-read progress + gates from storage after a cross-device sync merges new data
  // in (stateRev bumps), since this component caches them in local state.
  useEffect(() => {
    setProgress(storage.get(KEYS.lessonProgress, {}) || {});
    setGates(storage.get(KEYS.lessonGates, {}) || {});
  }, [stateRev]);

  const gateFor = (chapterId) => gates[chapterId] || { unlocked: LESSON_GROUP_SIZE, mastered: false };
  const passCheckpoint = (chapterId, unlockTo) => {
    const g = gateFor(chapterId);
    persistGates({ ...gates, [chapterId]: { ...g, unlocked: Math.max(g.unlocked || 0, unlockTo) } });
  };
  const masterChapter = (chapterId) => {
    const g = gateFor(chapterId);
    persistGates({ ...gates, [chapterId]: { ...g, mastered: true, mastered_at: Date.now() } });
  };
  // Re-verify the signed-in account's PIN against the server. Rejects on a wrong
  // PIN (api.login throws on 401), which gates the "master without the exam" flow.
  const verifyPin = async (pin) => {
    if (!session?.username) throw new Error('Not signed in');
    await api.login({ username: session.username, pin });
  };

  // Quiz pool for one chapter's lessons: MC plus two-part items (the gate quiz
  // now renders each by mode). Short answer isn't auto-gradeable for a 100%
  // checkpoint, so it stays excluded (buildPool 'mc' already omits it).
  // The lesson quiz pool feeds the checkpoint and final-exam gates. It mixes the
  // chapter's MC/two-part items with its short-answer items so sections whose
  // checks are short-answer (e.g. the abbreviation drills) are gated too, and so
  // short questions get randomly pulled into checkpoints and the final exam.
  const lessonQuizPoolFor = (chapterId) => {
    const fid = chapterToFile[chapterId];
    if (!fid) return [];
    const scope = { fileIds: new Set([fid]) };
    const ctx = { files, questions, extractions, attempts };
    return [...buildPool(ctx, 'mc', scope), ...buildPool(ctx, 'short', scope)];
  };

  const downloadLesson = async (chapterId) => {
    if (!chapterId) return;
    setBusy((b) => ({ ...b, [chapterId]: true }));
    setError('');
    try {
      const full = await api.getChapter(chapterId);
      const lesson = full?.lesson;
      if (!lesson || !Array.isArray(lesson.sections)) {
        setError('No lesson is available for that chapter yet.');
        return;
      }
      persistCache({ ...lessonsCache, [chapterId]: lesson });
      setOpenId(chapterId);
    } catch (e) {
      setError(e?.message || 'Download failed.');
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[chapterId]; return n; });
    }
  };

  const removeLesson = (chapterId) => {
    const next = { ...lessonsCache };
    delete next[chapterId];
    persistCache(next);
    if (openId === chapterId) setOpenId(null);
  };

  const markComplete = (chapterId) => {
    persistProgress({ ...progress, [chapterId]: { completed_at: Date.now() } });
  };

  // Start a quiz seeded with exactly this section's check_ids (mc + two_part + short).
  // The quiz leads with this section's term-matching practice (study-only, no
  // attempt recorded) so matching is part of the section quiz rather than a
  // separate widget in the reader.
  const quizSection = (chapterId, sec) => {
    const fid = chapterToFile[chapterId];
    if (!fid) return;
    const ctx = { files, questions, extractions, attempts };
    // MC/two-part plus short-answer items, so a section whose checks are
    // short-answer questions (the abbreviation drills) can be quizzed too.
    const scope = { fileIds: new Set([fid]) };
    const pool = [...buildPool(ctx, 'mc', scope), ...buildPool(ctx, 'short', scope)];
    const want = new Set(sec.check_ids || []);
    const checks = shuffle(pool.filter((x) => want.has(x.id)));

    const f = files.find((x) => x.file_id === fid);
    const meta = { file_id: fid, chapter: f?.chapter, subject: f?.subject };
    const drills = (Array.isArray(sec.definition_drills) ? sec.definition_drills : [])
      .filter((d) => d && d.term && d.definition);
    const matchId = `lmatch_${sec.id || sec.concept_id}`;
    const matchItem = drills.length >= 2
      ? { id: matchId, mode: 'match', studyOnly: true, q: { id: matchId, terms: drills }, ...meta }
      : null;

    const items = matchItem ? [...checks, matchItem] : checks;
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', { detail: { items } }));
    onGoToStudy?.();
  };

  const rows = useMemo(() => {
    // Only real processed chapters belong here — exclude daily activities like
    // CARS and Connections, which record attempts under synthetic file_ids.
    const chapterFileIds = new Set(files.map((f) => f.file_id));
    const byChapter = {};
    // Seed every processed chapter so ones you haven't answered questions for
    // yet still show up (with 0/0 stats) rather than only appearing after a
    // first attempt is recorded.
    for (const f of files) {
      if (!f.file_id) continue;
      const q = questions[f.file_id];
      if (!q || !q.mc) continue; // only fully processed chapters
      byChapter[f.file_id] = { correct: 0, total: 0, chapter: f.chapter, subject: f.subject };
    }
    for (const a of attempts) {
      const key = a.file_id;
      if (!chapterFileIds.has(key)) continue;
      if (!byChapter[key]) byChapter[key] = { correct: 0, total: 0, chapter: a.chapter, subject: a.subject };
      byChapter[key].total++;
      if (a.correct) byChapter[key].correct++;
    }
    const wrongIds = new Set();
    const seenIds = new Set();
    for (const a of attempts) { seenIds.add(a.question_id); if (!a.correct) wrongIds.add(a.question_id); }

    const out = Object.entries(byChapter).map(([fid, s]) => {
      const pool = buildPool({ files, questions, extractions, attempts }, 'mc', { fileIds: new Set([fid]) });
      // "Needs review" = questions missed OR never seen. Mastered (answered
      // correctly, not since missed) questions are intentionally excluded.
      const need = pool.filter((x) => wrongIds.has(x.id) || !seenIds.has(x.id)).length;
      return { fid, chapterId: fileToChapter[fid] || null, acc: s.total ? s.correct / s.total : 1, correct: s.correct, total: s.total, chapter: s.chapter, subject: s.subject, need };
    });
    if (sortBy === 'subject') {
      // Behavioral Sciences first, then alphabetical by subject, then by chapter
      // number within each subject (Chapter 1, 2, 3 …).
      const subjectRank = (s) => /behavior/i.test(s || '') ? '0' : `1${(s || '').toLowerCase()}`;
      out.sort((a, b) =>
        subjectRank(a.subject).localeCompare(subjectRank(b.subject)) ||
        (a.chapter || '').localeCompare(b.chapter || '', undefined, { numeric: true })
      );
    } else {
      out.sort((a, b) => a.acc - b.acc || b.total - a.total);
    }
    return out;
  }, [files, questions, extractions, attempts, fileToChapter, sortBy]);

  const launchReview = (fid) => {
    const pool = buildPool({ files, questions, extractions, attempts }, 'mc', { fileIds: new Set([fid]) });
    if (!pool.length) return;
    const wrongIds = new Set();
    const seenIds = new Set();
    for (const a of attempts) { seenIds.add(a.question_id); if (!a.correct) wrongIds.add(a.question_id); }
    const misses = pool.filter((x) => wrongIds.has(x.id));
    const unseen = pool.filter((x) => !seenIds.has(x.id));
    const mastered = pool.filter((x) => seenIds.has(x.id) && !wrongIds.has(x.id));
    // Adaptive order: things you got wrong first, then things you've never seen,
    // and only fall back to mastered questions if there aren't enough of the rest.
    let items = [...shuffle(misses), ...shuffle(unseen)];
    if (items.length < 15) items = [...items, ...shuffle(mastered)];
    items = items.slice(0, 15);
    if (!items.length) return;
    sfxQuizStart();
    window.dispatchEvent(new CustomEvent('mcat:startQuiz', { detail: { items } }));
    onGoToStudy?.();
  };

  // Reader takes over the tab when a lesson is open and still cached.
  if (openId && lessonsCache[openId]) {
    return (
      <LessonReader
        lesson={lessonsCache[openId]}
        latestCorrect={latestCorrect}
        completed={!!progress[openId]}
        gate={gateFor(openId)}
        quizPool={lessonQuizPoolFor(openId)}
        onBack={() => setOpenId(null)}
        onQuizSection={(sec) => quizSection(openId, sec)}
        onMarkComplete={() => markComplete(openId)}
        onPassCheckpoint={(unlockTo) => passCheckpoint(openId, unlockTo)}
        onMaster={() => masterChapter(openId)}
        username={session?.username}
        onVerifyPin={verifyPin}
      />
    );
  }

  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h2 className="font-semibold text-[var(--text-strong)]">Lessons</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Guided, chapter-by-chapter lessons that adapt to you — concepts you've already proven you know are skipped, and only resurface if you miss them later.
          </p>
        </div>
        <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-5 text-sm text-[var(--text-muted)]">
          Answer some quiz questions first. Once you do, your most-struggled chapters show up here so you can drill them.
        </div>
      </div>
    );
  }

  const visible = (showAll || sortBy === 'subject') ? rows : rows.slice(0, 3);

  // In-progress = lesson downloaded to this device, not yet mastered and not
  // marked complete. Surfaced at the top so you can pick up where you left off.
  // Built from the cache (not the attempt-derived rows) so a freshly downloaded
  // lesson with no attempts yet still appears.
  const inProgress = Object.keys(lessonsCache)
    .filter((cid) => !gates[cid]?.mastered && !progress[cid])
    .map((cid) => {
      const f = files.find((x) => x.chapter_id === cid);
      return { chapterId: cid, fid: chapterToFile[cid] || cid, chapter: f?.chapter || lessonsCache[cid]?.title || 'Lesson', subject: f?.subject || '' };
    });

  const lessonButton = (r) => {
    if (!r.chapterId) return null;
    const cached = !!lessonsCache[r.chapterId];
    const avail = availMap[r.chapterId];
    const isBusy = !!busy[r.chapterId];
    const done = !!progress[r.chapterId];
    if (cached) {
      return (
        <div className="flex items-center gap-2">
          {done && <span className="text-xs text-green-500">✓ complete</span>}
          <button onClick={() => setOpenId(r.chapterId)} className="text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]">Open lesson</button>
          <button onClick={() => removeLesson(r.chapterId)} title="Remove the downloaded lesson body from this device" className="text-xs px-2 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Remove</button>
        </div>
      );
    }
    // Not cached. Only offer a download when the server says a lesson exists
    // (availMap unknown === undefined → still allow, getChapter will tell us).
    if (avail === false) return <span className="text-xs text-[var(--text-faint)]">No lesson yet</span>;
    return (
      <button onClick={() => downloadLesson(r.chapterId)} disabled={isBusy} className="text-xs px-3 py-1.5 rounded font-medium disabled:opacity-50 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white">
        {isBusy ? 'Downloading…' : 'Download lesson'}
      </button>
    );
  };

  const renderRow = (r) => {
    // Mastery lives in the synced `lessonGates` store keyed by chapter_id, so it
    // survives removing the (re-downloadable) lesson body. Show the badge here
    // from the gate rather than only inside the reader.
    const isMastered = !!gates[r.chapterId]?.mastered;
    return (
    <div key={r.fid} className="space-y-2">
      <StatBar label={`${r.subject} — ${r.chapter}`} correct={r.correct} total={r.total} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-[var(--text-faint)] flex items-center gap-2">
          {isMastered && <span className="text-green-500 font-medium">🏆 Mastered</span>}
          <span>{r.need > 0 ? `${r.need} question${r.need === 1 ? '' : 's'} to review` : 'All caught up — nice'}</span>
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {lessonButton(r)}
          <button
            onClick={() => launchReview(r.fid)}
            disabled={r.need === 0}
            className="text-xs px-3 py-1.5 rounded font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
          >
            Quick review →
          </button>
        </div>
      </div>
    </div>
    );
  };

  // Group rows by subject (preserving the subject-sorted order in `rows`).
  const subjectGroups = (() => {
    const order = [];
    const map = {};
    for (const r of rows) {
      const s = r.subject || 'Other';
      if (!map[s]) { map[s] = []; order.push(s); }
      map[s].push(r);
    }
    return order.map((s) => [s, map[s]]);
  })();

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <h2 className="font-semibold text-[var(--text-strong)]">Lessons</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Download a guided lesson and work through it in groups of {LESSON_GROUP_SIZE} sections. Each group is gated by a {LESSON_CHECKPOINT_Q}-question checkpoint (100% to advance), and a {LESSON_FINAL_Q}-question final exam masters the chapter.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400">{error}</div>
      )}

      {inProgress.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-[var(--text-strong)]">In progress</h3>
          <div className="space-y-2">
            {inProgress.map((r) => {
              const g = gates[r.chapterId] || {};
              const lesson = lessonsCache[r.chapterId];
              const totalSecs = (lesson?.sections || []).length;
              const unlocked = Math.min(totalSecs, Math.max(LESSON_GROUP_SIZE, g.unlocked || LESSON_GROUP_SIZE));
              return (
                <div key={r.fid} className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2 flex-wrap">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--text-strong)] truncate">{r.chapter}</div>
                    <div className="text-xs text-[var(--text-faint)]">{r.subject} · {Math.min(unlocked, totalSecs)}/{totalSecs} sections unlocked</div>
                  </div>
                  <button onClick={() => setOpenId(r.chapterId)} className="text-xs px-3 py-1.5 rounded font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shrink-0">Resume →</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-semibold text-[var(--text-strong)]">
            {sortBy === 'subject' ? 'All chapters by subject' : (showAll ? 'All chapters' : 'Top 3 to work on')}
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[var(--text-faint)] mr-1">Sort:</span>
            <button
              onClick={() => setSortBy('weakest')}
              className={`px-2 py-1 rounded border ${sortBy === 'weakest' ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}
            >% incorrect</button>
            <button
              onClick={() => setSortBy('subject')}
              className={`px-2 py-1 rounded border ${sortBy === 'subject' ? 'bg-[var(--accent)] text-white border-[var(--accent-border)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'}`}
            >Subject</button>
          </div>
        </div>
        {sortBy === 'subject' ? (
          <div className="space-y-2">
            {subjectGroups.map(([subject, items]) => {
              const open = !!openSubjects[subject];
              const need = items.reduce((n, r) => n + r.need, 0);
              return (
                <div key={subject} className="border border-[var(--border-soft)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSubject(subject)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 bg-[var(--bg-elev-soft)] hover:bg-[var(--bg-hover)] text-left"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[var(--text-faint)] transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'none' }}>▶</span>
                      <span className="text-sm font-medium text-[var(--text-strong)] truncate">{subject || 'Other'}</span>
                      <span className="text-xs text-[var(--text-faint)]">{items.length} chapter{items.length === 1 ? '' : 's'}</span>
                    </span>
                    {need > 0 && <span className="text-xs text-[var(--text-faint)] shrink-0">{need} to review</span>}
                  </button>
                  {open && (
                    <div className="p-3 space-y-4">
                      {items.map((r) => renderRow(r))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((r) => renderRow(r))}
          </div>
        )}
        {sortBy !== 'subject' && rows.length > 3 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="w-full text-sm py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-strong)]"
          >
            {showAll ? 'Show less' : `View more (${rows.length - 3} more)`}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- github sync panel ----------
function relativeTime(ts) {
  if (!ts) return 'never';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SyncPanel() {
  const { github, setGithub, pushBank, pushStatus, files, extractions, questions } = useApp();
  const [showToken, setShowToken] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fullyProcessed = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;
  const canPush = !!github.token && !!github.repo && !!github.path && fullyProcessed > 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[var(--text-strong)]">GitHub sync</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Push your question bank to <span className="font-mono">{github.repo || '(no repo)'}/{github.path}</span> so your phone can load it.
          </p>
        </div>
        <button
          onClick={() => setExpanded((x) => !x)}
          className="text-xs px-2 py-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
        >
          {expanded ? 'Hide' : 'Configure'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs">
              <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">Repo (owner/name)</span>
              <input
                value={github.repo}
                onChange={(e) => setGithub({ repo: e.target.value })}
                placeholder="user/repo"
                className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
              />
            </label>
            <label className="text-xs">
              <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">Branch</span>
              <input
                value={github.branch}
                onChange={(e) => setGithub({ branch: e.target.value })}
                placeholder="main"
                className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
              />
            </label>
          </div>
          <label className="text-xs block">
            <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">File path</span>
            <input
              value={github.path}
              onChange={(e) => setGithub({ path: e.target.value })}
              placeholder="data.json"
              className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
            />
          </label>
          <label className="text-xs block">
            <span className="block uppercase tracking-wide text-[var(--text-faint)] mb-1">
              Fine-grained PAT (Contents: Read and write)
            </span>
            <div className="flex gap-2">
              <input
                type={showToken ? 'text' : 'password'}
                value={github.token}
                onChange={(e) => setGithub({ token: e.target.value })}
                placeholder="github_pat_..."
                className="flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1.5 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowToken((s) => !s)}
                className="text-xs px-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-faint)] mt-1">
              Create at{' '}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank" rel="noopener"
                className="text-[var(--accent-text)] underline"
              >
                github.com/settings/personal-access-tokens
              </a>
              . Stored only in this browser.
            </p>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={github.autoPush}
              onChange={(e) => setGithub({ autoPush: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            <span className="text-[var(--text)]">
              Auto-push after each chapter finishes processing
            </span>
          </label>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={pushBank}
          disabled={!canPush || pushStatus.state === 'pushing'}
          className="text-sm px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
        >
          {pushStatus.state === 'pushing' ? 'Pushing…' : 'Push now'}
        </button>
        <span className="text-xs text-[var(--text-muted)]">
          {pushStatus.state === 'error' ? (
            <span className="text-[var(--danger-text)]" title={pushStatus.error}>
              Error: {pushStatus.error?.slice(0, 80)}
            </span>
          ) : pushStatus.lastAt ? (
            <>Last push: <span className="text-[var(--text-strong)]">{relativeTime(pushStatus.lastAt)}</span></>
          ) : github.autoPush ? (
            'Auto-push armed. Will fire on next chapter processed.'
          ) : (
            !github.token ? 'Not configured.' : 'Ready.'
          )}
        </span>
      </div>
    </div>
  );
}

// ---------- stats ----------
function StatBar({ correct, total, label }) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm mb-1">
        <span className="text-[var(--text)]">{label}</span>
        <span className="text-[var(--text-muted)] text-xs">
          {correct}/{total} <span className="text-[var(--text-strong)] font-medium ml-1">{pct}%</span>
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-elev)] rounded-full overflow-hidden">
        <div
          className="h-full transition-all rounded-full"
          style={{
            width: `${pct}%`,
            background: pct >= 80
              ? 'var(--success-border)'
              : pct >= 50
              ? 'var(--accent)'
              : 'var(--danger-border)',
          }}
        />
      </div>
    </div>
  );
}

// ---------- predictive MCAT score (accuracy-based, Bayesian) ----------
// Uses the last ≤200 quiz attempts per subject, shrunk toward a 55% prior.
// Subject names match exactly what the app stores in attempt.subject.
// Weights are renormalised within each section to only use subjects the user
// has attempted — so Organic Chemistry alone fully drives C/P rather than
// looking like 15% of a section that's otherwise empty.
const SECTION_MIN = 118, SECTION_MAX = 132, SECTION_RANGE = 14;
const MCAT_PRIOR_MEAN = 0.55;
const MCAT_PRIOR_STRENGTH = 8;

const MCAT_SECTIONS = [
  {
    key: 'cp', label: 'Chem/Phys',
    weights: {
      'Organic Chemistry': 0.15,
      'General Chemistry': 0.30,
      'Physics and Math': 0.25,
      Biology: 0.05,
      Biochemistry: 0.25,
    },
  },
  { key: 'cars', label: 'CARS', weights: { CARS: 1.0 } },
  {
    key: 'bb', label: 'Bio/Biochem',
    weights: {
      Biology: 0.65,
      Biochemistry: 0.25,
      'Organic Chemistry': 0.05,
      'General Chemistry': 0.05,
    },
  },
  {
    key: 'ps', label: 'Psych/Soc',
    weights: {
      'Behavioral Science': 0.95,
      Biology: 0.05,
      Psychology: 0.65,
      Sociology: 0.30,
    },
  },
];

// Normalise subject name variants (e.g. "Physics & Math" → "Physics and Math").
function normalizeSubject(s) {
  if (s === 'Physics & Math') return 'Physics and Math';
  return s;
}

function subjectPosterior(list) {
  if (!list.length) return null;
  const last = list.slice(0, 200);
  const correct = last.reduce((s, a) => s + (a.correct ? 1 : 0), 0);
  const n = last.length;
  const a = correct + MCAT_PRIOR_MEAN * MCAT_PRIOR_STRENGTH;
  const b = (n - correct) + (1 - MCAT_PRIOR_MEAN) * MCAT_PRIOR_STRENGTH;
  const mean = a / (a + b);
  const variance = (a * b) / (((a + b) ** 2) * (a + b + 1));
  return { n, accuracy: correct / n, mean, variance };
}

function predictMcatScores(attempts) {
  const sorted = attempts.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const bySubject = new Map();
  for (const a of sorted) {
    if (!a.subject) continue;
    const subj = normalizeSubject(a.subject);
    if (!bySubject.has(subj)) bySubject.set(subj, []);
    bySubject.get(subj).push(a);
  }
  const posteriors = new Map();
  for (const [subj, list] of bySubject) {
    const p = subjectPosterior(list);
    if (p) posteriors.set(subj, p);
  }

  const sections = MCAT_SECTIONS.map((sec) => {
    const present = Object.entries(sec.weights)
      .map(([subj, weight]) => {
        const post = posteriors.get(subj);
        return post ? { subj, weight, post } : null;
      })
      .filter(Boolean);
    if (!present.length) return { ...sec, completed: false };

    // Renormalise weights to only the subjects with data.
    const wSum = present.reduce((s, x) => s + x.weight, 0);
    let mean = 0, variance = 0;
    for (const { weight, post } of present) {
      const w = weight / wSum;
      mean += w * post.mean;
      variance += w * w * post.variance;
    }
    const score = SECTION_MIN + SECTION_RANGE * mean;
    const stdev = SECTION_RANGE * Math.sqrt(variance);
    return {
      ...sec,
      completed: true,
      n: present.reduce((s, x) => s + x.post.n, 0),
      subjects: present.map(({ subj, weight, post }) => ({
        subject: subj,
        weight: weight / wSum,
        rawWeight: weight,
        n: post.n,
        accuracy: post.accuracy,
      })),
      score: Math.max(SECTION_MIN, Math.min(SECTION_MAX, score)),
      stdev,
    };
  });

  const done = sections.filter((s) => s.completed);
  if (done.length > 0 && done.length < sections.length) {
    const meanScore = done.reduce((s, x) => s + x.score, 0) / done.length;
    const meanVar = done.reduce((s, x) => s + x.stdev ** 2, 0) / done.length;
    const imputedStdev = Math.max(Math.sqrt(meanVar) * 2, 2.5);
    for (const s of sections) {
      if (s.completed) continue;
      s.imputed = true; s.score = meanScore; s.stdev = imputedStdev;
    }
  }

  const contributing = sections.filter((s) => s.completed || s.imputed);
  const total = done.length ? {
    score: contributing.reduce((acc, x) => acc + x.score, 0),
    stdev: Math.sqrt(contributing.reduce((acc, x) => acc + x.stdev ** 2, 0)),
    sectionsCompleted: done.length,
    allFour: done.length === MCAT_SECTIONS.length,
  } : null;
  return { sections, total };
}

function McatPredictionCard() {
  const { attempts } = useApp();
  const { sections, total } = useMemo(() => predictMcatScores(attempts), [attempts]);
  const [expanded, setExpanded] = useState(false);
  const fmt = (n) => n.toFixed(1).replace(/\.0$/, '');
  if (!sections.some((s) => s.completed)) return null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--accent-border)] rounded-2xl p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">Predicted MCAT</div>
          <div className="text-4xl sm:text-5xl font-bold text-[var(--text-strong)] mt-1">
            {total ? Math.round(total.score) : '—'}
            {total && (
              <span className="text-base sm:text-lg font-medium text-[var(--text-muted)] ml-2">± {fmt(total.stdev)}</span>
            )}
          </div>
          {total && !total.allFour && (
            <div className="text-xs text-[var(--text-faint)] mt-1">
              {total.sectionsCompleted}/4 sections attempted · others estimated from your average
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sections.map((s) => (
          <div
            key={s.key}
            className={
              'border rounded-xl px-3 py-2.5 ' +
              (s.imputed
                ? 'bg-[var(--bg-card-soft)] border-dashed border-[var(--border)]'
                : 'bg-[var(--bg-elev-soft)] border-[var(--border-soft)]')
            }
          >
            <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{s.label}</div>
            {s.completed ? (
              <>
                <div className="text-xl font-bold text-[var(--text-strong)] mt-0.5">
                  {Math.round(s.score)}
                  <span className="text-xs font-medium text-[var(--text-muted)] ml-1">± {fmt(s.stdev)}</span>
                </div>
                <div className="text-[10px] text-[var(--text-faint)] mt-0.5">n={s.n}</div>
                {(() => {
                  // How much more accuracy (in this section's weighted mix)
                  // do you need to bump the displayed integer score by one?
                  // SECTION_RANGE points map onto [0, 100%] accuracy, so each
                  // point costs 1/14 = ~7.1% of accuracy.
                  if (s.score >= SECTION_MAX) {
                    return <div className="text-[10px] text-[var(--success-text)] mt-0.5">max score</div>;
                  }
                  const displayed = Math.round(s.score);
                  const nextInt = displayed + 1;
                  if (nextInt > SECTION_MAX) {
                    return <div className="text-[10px] text-[var(--success-text)] mt-0.5">max score</div>;
                  }
                  // Gap from the *exact* posterior score to the next integer.
                  // The displayed value is rounded, so "next" can be just
                  // 0.001 away — that's fine, it tells you you're a hair
                  // from rounding up.
                  const gapAccuracy = (nextInt - s.score) / SECTION_RANGE * 100;
                  return (
                    <div className="text-[10px] text-[var(--accent-text)] mt-0.5">
                      +{gapAccuracy.toFixed(1)}% → {nextInt}
                    </div>
                  );
                })()}
              </>
            ) : s.imputed ? (
              <>
                <div className="text-xl font-bold text-[var(--text-muted)] mt-0.5 italic">
                  {Math.round(s.score)}
                  <span className="text-xs font-medium text-[var(--text-fainter)] ml-1">± {fmt(s.stdev)}</span>
                </div>
                <div className="text-[10px] text-[var(--text-faint)] mt-0.5">est.</div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-[var(--text-fainter)] mt-0.5">—</div>
                <div className="text-[10px] text-[var(--text-faint)] mt-0.5">no attempts</div>
              </>
            )}
          </div>
        ))}
      </div>
      {expanded && (
        <div className="mt-3 space-y-2 text-[11px]">
          {sections.filter((s) => s.completed).map((s) => (
            <div key={s.key} className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-2.5">
              <div className="font-semibold text-[var(--text)] mb-1">{s.label} — {Math.round(s.score)} ± {fmt(s.stdev)}</div>
              <div className="space-y-0.5">
                {s.subjects.map((sub) => (
                  <div key={sub.subject} className="flex items-center justify-between gap-2 text-[var(--text-muted)]">
                    <span>{sub.subject} <span className="text-[var(--text-fainter)]">({Math.round(sub.weight * 100)}% of section)</span></span>
                    <span className="font-mono text-[var(--text-faint)]">n={sub.n} · {Math.round(sub.accuracy * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="text-[11px] text-[var(--text-faint)] leading-snug flex-1">
          Accuracy on your most recent 200 questions per subject, weighted into each MCAT section by the AAMC content ratios shown in the breakdown (renormalised to subjects you've actually attempted). Shrunk toward a 55% prior — treat as a floor, not a ceiling.
        </div>
        <button
          onClick={() => setExpanded((x) => !x)}
          className="shrink-0 text-xs px-2.5 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
        >
          {expanded ? 'Hide breakdown' : 'Breakdown'}
        </button>
      </div>
    </div>
  );
}


function StatsView() {
  const { attempts, files, questions, clearAttempts } = useApp();

  const stats = useMemo(() => {
    const overall = { correct: 0, total: 0 };
    const byMode = {};
    const byChapter = {};
    const bySubject = {};
    const missByQid = {};
    const seenByQid = {};

    for (const a of attempts) {
      overall.total++;
      if (a.correct) overall.correct++;

      const m = byMode[a.mode] ||= { correct: 0, total: 0 };
      m.total++; if (a.correct) m.correct++;

      const fkey = a.file_id;
      const c = byChapter[fkey] ||= { correct: 0, total: 0, chapter: a.chapter, subject: a.subject };
      c.total++; if (a.correct) c.correct++;

      const s = bySubject[a.subject] ||= { correct: 0, total: 0 };
      s.total++; if (a.correct) s.correct++;

      seenByQid[a.question_id] = (seenByQid[a.question_id] || 0) + 1;
      if (!a.correct) missByQid[a.question_id] = (missByQid[a.question_id] || 0) + 1;
    }

    // Build a question lookup so missed questions can show their text.
    const qLookup = {};
    for (const fid of Object.keys(questions)) {
      const qb = questions[fid] || {};
      for (const q of (qb.mc || [])) qLookup[q.id] = { ...q, mode: 'mc', file_id: fid };
      for (const q of (qb.short || [])) qLookup[q.id] = { ...q, mode: 'short', file_id: fid };
    }
    const fileLookup = {};
    for (const f of files) fileLookup[f.file_id] = f;

    const topMisses = Object.entries(missByQid)
      .map(([qid, misses]) => {
        const q = qLookup[qid];
        const text = q ? (q.mode === 'mc' ? q.question : q.prompt) : qid;
        const chapter = q && fileLookup[q.file_id] ? fileLookup[q.file_id].chapter : '—';
        const seen = seenByQid[qid] || misses;
        return { qid, misses, seen, text, chapter, mode: q?.mode || 'matching' };
      })
      .sort((a, b) => b.misses - a.misses)
      .slice(0, 10);

    return { overall, byMode, byChapter, bySubject, topMisses };
  }, [attempts, files, questions]);

  if (attempts.length === 0) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No quiz attempts yet. Run a quiz from the Study tab to see your stats.
      </div>
    );
  }

  const modeLabels = { mc: 'Multiple choice', short: 'Short answer', match: 'Matching' };

  return (
    <div className="space-y-5">
      {/* By subject */}
      {Object.keys(stats.bySubject).length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By subject</h3>
          <div className="space-y-3">
            {Object.entries(stats.bySubject).map(([subject, s]) => (
              <StatBar key={subject} label={subject} correct={s.correct} total={s.total} />
            ))}
          </div>
        </div>
      )}

      {/* By chapter */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By chapter</h3>
        <div className="space-y-3">
          {Object.entries(stats.byChapter)
            .sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))
            .map(([fid, s]) => (
              <StatBar key={fid} label={`${s.subject} — ${s.chapter}`} correct={s.correct} total={s.total} />
            ))}
        </div>
      </div>

      {/* Top misses */}
      {stats.topMisses.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">Most-missed questions</h3>
          <ul className="space-y-2 text-sm">
            {stats.topMisses.map((m, i) => (
              <li key={m.qid} className="flex gap-3">
                <span className="text-[var(--text-faint)] w-5 text-right shrink-0">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--text)] truncate" title={m.text}>{m.text}</div>
                  <div className="text-xs text-[var(--text-faint)] mt-0.5">
                    {m.chapter} · {modeLabels[m.mode] || m.mode}
                  </div>
                </div>
                <span className="text-xs text-[var(--danger-text)] whitespace-nowrap self-start">
                  {m.misses}/{m.seen} missed
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => { if (confirm('Clear all quiz attempts? This cannot be undone.')) clearAttempts(); }}
          className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--danger-text)] hover:border-[var(--danger-border)] rounded"
        >
          Clear all attempts
        </button>
      </div>
    </div>
  );
}


// ---------- settings ----------
function SettingsPanel({ onClose }) {
  const { palette, mode, setPalette, setMode, apiKey, setApiKey, client, session, pendingSync, syncBusy, syncError, flushSync, volume, setVolume, autoDownloadChapters, setAutoDownloadChapters, autoDownloadAll, setAutoDownloadAll, contributorMode, setContributorMode, tropicalBg, setTropicalBg, bgBlur, setBgBlur, experimentalUI, setExperimentalUI, glass, setGlass, files } = useApp();
  const hasDownloadedChapters = files.some((f) => f.chapter_id);
  const [keyVal, setKeyVal] = useState(apiKey || '');
  const [keyShow, setKeyShow] = useState(false);
  const [keyErr, setKeyErr] = useState('');
  const [keyBusy, setKeyBusy] = useState(false);

  const saveKey = async () => {
    const trimmed = keyVal.trim();
    if (!trimmed) { setApiKey(''); return; }
    if (!trimmed.startsWith('AIza')) {
      setKeyErr('Google AI keys start with AIza.');
      return;
    }
    setKeyBusy(true); setKeyErr('');
    storage.set(KEYS.apiKey, trimmed);
    try {
      await client.ping();
      setApiKey(trimmed);
    } catch (e) {
      storage.remove(KEYS.apiKey);
      setKeyErr(`Key rejected: ${e.message}`);
    } finally {
      setKeyBusy(false);
    }
  };

  const paletteOpts = [
    ['cold', '❄️', 'Cold'],
    ['warm', '🍂', 'Warm'],
    ['duo', '🗿', 'Rio'],
    ['tropical', '🌴', 'Tropical'],
    ['madison', '🏛️', 'Madison'],
  ];
  const modeOpts = [
    ['light', '☀️', 'Light'],
    ['dark', '🌙', 'Dark'],
    ['system', '🖥️', 'System'],
  ];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-md mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-strong)]">Settings</h2>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-strong)] text-2xl leading-none">×</button>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Colour</div>
        <div className="grid grid-cols-4 gap-2">
          {paletteOpts.map(([k, emoji, label]) => (
            <button
              key={k}
              onClick={() => setPalette(k)}
              className={`flex flex-col items-center gap-1 py-3 rounded border ${palette === k
                ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)]'}`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-[var(--text)]">{label}</span>
            </button>
          ))}
        </div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mt-4 mb-2">Mode</div>
        <div className="grid grid-cols-3 gap-2">
          {modeOpts.map(([k, emoji, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`flex flex-col items-center gap-1 py-3 rounded border ${mode === k
                ? 'border-[var(--accent-border)] bg-[var(--accent-soft)]'
                : 'border-[var(--border)] hover:bg-[var(--bg-hover)]'}`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-[var(--text)]">{label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          <label className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer">
            <div className="text-sm min-w-0">
              <div className="text-[var(--text)]">
                {palette === 'cold' ? '❄️' : palette === 'warm' ? '🍂' : palette === 'duo' ? '⛰️' : palette === 'madison' ? '🏛️' : '🌴'} Dynamic background
              </div>
              <div className="text-[11px] text-[var(--text-faint)] mt-0.5">
                {palette === 'cold' ? 'Winter snow + mountain range background.'
                  : palette === 'warm' ? 'Fall trees + mountain range background.'
                  : palette === 'duo' ? 'Rio de Janeiro with Christ the Redeemer.'
                  : palette === 'madison' ? 'Madison, WI skyline at night with the Capitol dome over Lake Monona — lit windows, occasional shooting stars, cars on Lakeshore Drive, and slow drifting clouds.'
                  : 'Tropical beach with palm trees, breaking waves, and a crab that wanders past once in a while.'}{' '}
                Follows your light/dark mode.
              </div>
            </div>
            <input type="checkbox" checked={tropicalBg} onChange={(e) => setTropicalBg(e.target.checked)} className="w-4 h-4 shrink-0" />
          </label>
          {tropicalBg && (
            <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text)]">Background blur</span>
                <span className="text-[var(--text-muted)] tabular-nums">{bgBlur}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={bgBlur}
                onChange={(e) => setBgBlur(parseFloat(e.target.value))}
                className="w-full mt-2 accent-[var(--accent)]"
              />
              <div className="text-[11px] text-[var(--text-faint)] mt-1">Softens the scene without dimming it. 0% sharp, 100% dreamy.</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Experimental</div>
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer">
            <div className="text-sm min-w-0">
              <div className="text-[var(--text)]">🧪 Experimental UI</div>
              <div className="text-[11px] text-[var(--text-faint)] mt-0.5">
                A cleaner, redesigned look. If anything seems off, turn this back off to return to the normal app.
              </div>
            </div>
            <input type="checkbox" checked={experimentalUI} onChange={(e) => setExperimentalUI(e.target.checked)} className="w-4 h-4 shrink-0" />
          </label>
          {experimentalUI && (
            <label className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer">
              <div className="text-sm min-w-0">
                <div className="text-[var(--text)]">🫧 Liquid glass</div>
                <div className="text-[11px] text-[var(--text-faint)] mt-0.5">
                  Frosted translucent cards. Heavier on older phones — turn off if scrolling feels sluggish.
                </div>
              </div>
              <input type="checkbox" checked={glass} onChange={(e) => setGlass(e.target.checked)} className="w-4 h-4 shrink-0" />
            </label>
          )}
        </div>
      </div>

      {session && (
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Sync</div>
          <div className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5">
            <div className="text-sm min-w-0 flex-1">
              {syncBusy ? (
                <span className="text-[var(--accent-text)]">Syncing…</span>
              ) : syncError ? (
                <span className="text-[var(--danger-text)] truncate" title={syncError}>{syncError}</span>
              ) : pendingSync.length > 0 ? (
                <span className="text-[var(--warning-text-strong)]">{pendingSync.length} attempt{pendingSync.length === 1 ? '' : 's'} pending</span>
              ) : (
                <span className="text-[var(--text-muted)]">All synced</span>
              )}
            </div>
            <button
              onClick={flushSync}
              disabled={syncBusy}
              className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
            >
              Force sync
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">App</div>
        <div className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5">
          <div className="text-sm text-[var(--text-muted)]">Fetch the latest version of the app</div>
          <button
            onClick={forceUpdateApp}
            className="shrink-0 text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded font-medium"
          >
            Force update
          </button>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Gemini API key</div>
        <div className="flex gap-2">
          <input
            type={keyShow ? 'text' : 'password'}
            value={keyVal}
            onChange={(e) => { setKeyVal(e.target.value); setKeyErr(''); }}
            placeholder={apiKey ? `current: …${apiKey.slice(-6)}` : 'AIza...'}
            className="flex-1 bg-[var(--bg-elev)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
          />
          <button onClick={() => setKeyShow((s) => !s)} className="px-3 text-xs border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">
            {keyShow ? 'Hide' : 'Show'}
          </button>
        </div>
        {keyErr && <p className="text-[var(--danger-text)] text-xs mt-2">{keyErr}</p>}
        <div className="flex gap-2 mt-2">
          <button
            onClick={saveKey}
            disabled={keyBusy || keyVal === apiKey}
            className="flex-1 text-xs px-3 py-2 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
          >
            {keyBusy ? 'Verifying…' : keyVal ? 'Save key' : 'No key set'}
          </button>
          {apiKey && (
            <button
              onClick={() => { if (confirm('Forget the saved API key?')) { setApiKey(''); setKeyVal(''); } }}
              className="text-xs px-3 py-2 border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] rounded"
            >
              Forget
            </button>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-faint)] mt-2">
          Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" className="text-[var(--accent-text)] underline">aistudio.google.com/apikey</a>. Stored only in this browser.
        </p>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Sound</div>
        <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text)]">Volume</span>
            <span className="text-[var(--text-muted)] tabular-nums">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full mt-2 accent-[var(--accent)]"
          />
          <div className="text-[11px] text-[var(--text-faint)] mt-1">Affects answer sounds, HUD ticks, and quiz-start chime.</div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Chapters</div>
        <div className="space-y-2">
          <label className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer">
            <div className="text-sm min-w-0">
              <div className="text-[var(--text)]">Auto-download new chapters</div>
              <div className="text-[11px] text-[var(--text-faint)] mt-0.5">When the app loads, silently download every cloud chapter that isn't in your local library yet.</div>
            </div>
            <input
              type="checkbox"
              checked={autoDownloadAll}
              onChange={(e) => setAutoDownloadAll(e.target.checked)}
              className="w-4 h-4 shrink-0"
            />
          </label>
          {hasDownloadedChapters && (
            <label className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer">
              <div className="text-sm min-w-0">
                <div className="text-[var(--text)]">Auto-update downloaded chapters</div>
                <div className="text-[11px] text-[var(--text-faint)] mt-0.5">When the app loads, silently re-download any chapter you already have whose server copy is newer.</div>
              </div>
              <input
                type="checkbox"
                checked={autoDownloadChapters}
                onChange={(e) => setAutoDownloadChapters(e.target.checked)}
                className="w-4 h-4 shrink-0"
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Advanced</div>
        <label className="flex items-center justify-between gap-3 bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg px-3 py-2.5 cursor-pointer">
          <div className="text-sm min-w-0">
            <div className="text-[var(--text)]">Contributor mode</div>
            <div className="text-[11px] text-[var(--text-faint)] mt-0.5">Show the upload, publish-to-bank, export, and flag-fixes panels in the Library tab. Off for most users.</div>
          </div>
          <input
            type="checkbox"
            checked={contributorMode}
            onChange={(e) => setContributorMode(e.target.checked)}
            className="w-4 h-4 shrink-0"
          />
        </label>
      </div>

      <StorageUsageSection />

      <EraseQuizStatsSection />

    </div>
  );
}

// Compact storage-usage report. Shows total localStorage bytes used by the
// app, a per-category breakdown (chapters / attempts / caches / other), and
// a "refresh" button that recomputes after the user clears something. The
// LZ-compression we ship typically lands the chapter blob at ~25% of the
// original JSON; this is also where the user can verify the migration ran.
function StorageUsageSection() {
  const [snap, setSnap] = useState(() => computeStorageSnapshot());

  const fmtBytes = (n) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  };

  // iOS Safari and most desktop browsers expose ~5 MB per origin.
  const cap = 5 * 1024 * 1024;
  const pct = Math.min(100, Math.round((snap.total / cap) * 100));
  const pctColor = pct >= 90
    ? 'var(--danger-border)'
    : pct >= 70
    ? 'var(--warning-text-strong)'
    : 'var(--accent)';

  const rows = [
    { key: 'chapters', label: 'Chapters (extractions + questions)' },
    { key: 'attempts', label: 'Question attempts' },
    { key: 'caches', label: 'CARS / Connections / Gemini caches' },
    { key: 'crashlog', label: 'Crash log' },
    { key: 'other', label: 'Settings, session, misc.' },
  ];

  const clearCaches = () => {
    if (!confirm('Clear the CARS / Connections / Gemini explainer caches and the crash log? Safe — they rebuild on demand.')) return;
    for (const k of ['mcat:carsCache', 'mcat:connectionsCache', 'mcat:connExplain', 'mcat:termDefs', 'mcat:crashlog']) {
      try { localStorage.removeItem(k); } catch {}
    }
    setSnap(computeStorageSnapshot());
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Storage</div>
      <div className="bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg p-3 space-y-2.5">
        <div>
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-[var(--text)]">{fmtBytes(snap.total)} used</span>
            <span className="text-xs text-[var(--text-muted)]">of ~{fmtBytes(cap)} ({pct}%)</span>
          </div>
          <div className="h-1.5 bg-[var(--bg-elev)] rounded-full overflow-hidden mt-1">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pctColor }} />
          </div>
          {snap.compressed > 0 && (
            <div className="text-[11px] text-[var(--text-faint)] mt-1">
              {snap.compressed} entr{snap.compressed === 1 ? 'y' : 'ies'} compressed · raw size would be ~{fmtBytes(snap.rawEstimate)}
            </div>
          )}
        </div>
        <div className="border-t border-[var(--border-soft)] pt-2 space-y-1">
          {rows.map((r) => (
            <div key={r.key} className="flex items-baseline justify-between gap-2 text-[11px]">
              <span className="text-[var(--text-muted)] truncate">{r.label}</span>
              <span className="font-mono text-[var(--text-faint)] shrink-0">{fmtBytes(snap.byCategory[r.key] || 0)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSnap(computeStorageSnapshot())}
            className="text-[11px] px-2.5 py-1 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-strong)] rounded"
          >
            Refresh
          </button>
          <button
            onClick={clearCaches}
            className="text-[11px] px-2.5 py-1 border border-[var(--warning-text-strong)] text-[var(--warning-text-strong)] hover:bg-[var(--warning-bg)] rounded"
          >
            Clear caches
          </button>
        </div>
        <div className="text-[11px] text-[var(--text-faint)] leading-snug pt-1">
          Chapters and attempts persist across sessions. Caches rebuild on demand. The ~5 MB cap is enforced by your browser, not the app.
        </div>
      </div>
    </div>
  );
}

// Walk localStorage once and total up byte usage per category. Bytes are
// approximated as 2 × (key.length + value.length) since localStorage is
// UTF-16 internally. Compressed entries are counted at their stored size,
// not their decompressed size — that's the number that actually counts
// against the quota.
function computeStorageSnapshot() {
  const byCategory = { chapters: 0, attempts: 0, caches: 0, crashlog: 0, other: 0 };
  let total = 0, compressed = 0, rawEstimate = 0;
  const CACHE_KEYS = new Set(['mcat:carsCache', 'mcat:connectionsCache', 'mcat:connExplain', 'mcat:termDefs', 'mcat:bankSeen', 'mcat:carsResults', 'mcat:connectionsResults']);
  const CHAPTER_KEYS = new Set(['mcat:files', 'mcat:extractions', 'mcat:questions']);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const v = localStorage.getItem(k) || '';
      const bytes = (k.length + v.length) * 2;
      total += bytes;
      // Approximate raw (pre-compression) size by detecting the marker.
      if (v.startsWith('LZv1')) {
        compressed++;
        // LZ-string compressToUTF16 packs 15 bits per UTF-16 char. The
        // compressed payload (minus the 4-char marker + trailing space)
        // has roughly 4× expansion to JSON characters in our tests.
        rawEstimate += (v.length - 4) * 4 * 2;
      } else {
        rawEstimate += bytes;
      }
      if (CHAPTER_KEYS.has(k))      byCategory.chapters += bytes;
      else if (k === 'mcat:attempts') byCategory.attempts += bytes;
      else if (k === 'mcat:crashlog') byCategory.crashlog += bytes;
      else if (CACHE_KEYS.has(k))   byCategory.caches += bytes;
      else                           byCategory.other += bytes;
    }
  } catch {}
  return { total, byCategory, compressed, rawEstimate };
}

// Lets a signed-in user erase the question history tied to their account one
// day at a time. Each day expands to show the per-quiz breakdown (chapter +
// subject + accuracy). One click on the day's Erase button wipes BOTH the
// local attempts and the server-side rows in that local-midnight window.
function EraseQuizStatsSection() {
  const { attempts, session, eraseStatsFor } = useApp();
  const [busy, setBusy] = useState(null); // day key currently being erased
  const [msg, setMsg] = useState(null);
  const [openDay, setOpenDay] = useState(null);

  // Group by local calendar day. Each day's bucket also keeps a per-quiz
  // (chapter+subject) breakdown so the user can see what they actually did
  // before confirming a delete.
  const days = useMemo(() => {
    const dayMap = new Map();
    for (const a of attempts) {
      const ts = a.ts || 0;
      const d = new Date(ts);
      // Local-day key: YYYY-MM-DD in the user's tz.
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      const startOfDay = new Date(y, d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
      const endOfDay = startOfDay + 24 * 3600 * 1000;
      let bucket = dayMap.get(key);
      if (!bucket) {
        bucket = { key, startOfDay, endOfDay, total: 0, correct: 0, quizzes: new Map() };
        dayMap.set(key, bucket);
      }
      bucket.total++;
      if (a.correct) bucket.correct++;
      const chapter = a.chapter || '(unknown chapter)';
      const subject = a.subject || '(unknown subject)';
      const qkey = `${subject}::${chapter}`;
      let q = bucket.quizzes.get(qkey);
      if (!q) { q = { chapter, subject, total: 0, correct: 0 }; bucket.quizzes.set(qkey, q); }
      q.total++;
      if (a.correct) q.correct++;
    }
    return Array.from(dayMap.values())
      .map((b) => ({ ...b, quizzes: Array.from(b.quizzes.values()).sort((a, b) => b.total - a.total) }))
      .sort((a, b) => b.startOfDay - a.startOfDay); // most recent first
  }, [attempts]);

  const fmtDay = (key, ts) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yest = new Date(today.getTime() - 24 * 3600 * 1000);
    const d = new Date(ts);
    const isToday = d.toDateString() === today.toDateString();
    const isYest = d.toDateString() === yest.toDateString();
    if (isToday) return `Today · ${key}`;
    if (isYest) return `Yesterday · ${key}`;
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ` · ${key}`;
  };

  const eraseDay = async (b) => {
    const label = fmtDay(b.key, b.startOfDay);
    if (!confirm(`Erase ALL ${b.total} attempt${b.total === 1 ? '' : 's'} from ${label}?\n\nThis removes the question history for that day from this device AND from your account on the server. It can't be undone.`)) return;
    setBusy(b.key); setMsg(null);
    const res = await eraseStatsFor({ ts_gte: b.startOfDay, ts_lt: b.endOfDay });
    setBusy(null);
    if (res.ok) {
      setMsg({ kind: 'ok', text: `Erased ${b.total} local${session ? ` and ${res.serverDeleted ?? 0} server` : ''} attempt${b.total === 1 ? '' : 's'} from ${label}.` });
    } else {
      setMsg({ kind: 'err', text: `Couldn't erase: ${res.reason || 'unknown error'}` });
    }
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">Question history by day</div>
      <div className="text-[11px] text-[var(--text-faint)] mb-2">
        Expand any day to see what you did. Erasing wipes both the local attempts and the matching rows on your account on the server. Use this if a sync glitch duplicated entries.
      </div>
      {!session && (
        <div className="text-[11px] text-[var(--warning-text-strong)] bg-[var(--warning-bg)] rounded px-2 py-1.5 mb-2">
          Not signed in — only local attempts will be erased. Sign in to also clean up the duplicated rows on the server.
        </div>
      )}
      {msg && (
        <div className={`text-[11px] rounded px-2 py-1.5 mb-2 ${msg.kind === 'ok'
          ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
          : 'bg-[var(--danger-bg)] text-[var(--danger-text)]'}`}>
          {msg.text}
        </div>
      )}
      {days.length === 0 ? (
        <div className="text-[11px] text-[var(--text-faint)] bg-[var(--bg-elev-soft)] border border-dashed border-[var(--border-soft)] rounded-lg px-3 py-3">
          No quiz attempts yet.
        </div>
      ) : (
        <ul className="max-h-72 overflow-y-auto divide-y divide-[var(--border-soft)] bg-[var(--bg-elev-soft)] border border-[var(--border-soft)] rounded-lg">
          {days.map((b) => {
            const open = openDay === b.key;
            return (
              <li key={b.key} className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenDay(open ? null : b.key)}
                    className="min-w-0 flex-1 text-left"
                    aria-expanded={open}
                  >
                    <div className="text-sm text-[var(--text)] flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="text-[var(--text-muted)] transition-transform inline-block text-[10px]"
                        style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      >▶</span>
                      <span className="truncate">{fmtDay(b.key, b.startOfDay)}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)] truncate pl-4">
                      {b.correct}/{b.total} correct · {b.quizzes.length} quiz{b.quizzes.length === 1 ? '' : 'zes'}
                    </div>
                  </button>
                  <button
                    onClick={() => eraseDay(b)}
                    disabled={busy === b.key}
                    className="shrink-0 text-[11px] px-2.5 py-1 border border-[var(--danger-border)] text-[var(--danger-text)] hover:bg-[var(--danger-bg)] disabled:opacity-40 rounded"
                  >
                    {busy === b.key ? 'Erasing…' : 'Erase'}
                  </button>
                </div>
                {open && (
                  <ul className="mt-1.5 ml-4 space-y-1">
                    {b.quizzes.map((q) => (
                      <li key={`${q.subject}::${q.chapter}`} className="text-[11px] flex items-center justify-between gap-2 text-[var(--text-muted)]">
                        <span className="min-w-0 truncate" title={`${q.subject} — ${q.chapter}`}>
                          <span className="text-[var(--text)]">{q.chapter}</span>
                          <span className="text-[var(--text-fainter)]"> · {q.subject}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[var(--text-faint)]">{q.correct}/{q.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------- bulk publish to chapter bank ----------
function PublishAllPanel() {
  const { api, session, files, extractions, questions, setFiles } = useApp();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);

  const publishable = files.filter((f) => extractions[f.file_id]);
  if (publishable.length === 0) return null;

  const allLinked = publishable.every((f) => f.chapter_id);

  const publishAll = async () => {
    if (busy) return;
    setBusy(true);
    setStatus({ kind: 'info', msg: `Publishing ${publishable.length} chapter${publishable.length === 1 ? '' : 's'}…` });
    let okCount = 0;
    let errCount = 0;
    const lastErr = { msg: '' };
    for (const f of publishable) {
      try {
        let chapterId = f.chapter_id;
        if (!chapterId) {
          const created = await api.createChapter({
            subject: f.subject,
            title: f.chapter,
            filename: f.filename,
            size_bytes: f.size_bytes,
          });
          chapterId = created.id;
          // eslint-disable-next-line no-loop-func
          setFiles((prev) => prev.map((x) => x.file_id === f.file_id ? { ...x, chapter_id: chapterId } : x));
        }
        const ext = extractions[f.file_id];
        const qb = questions[f.file_id] || {};
        const pushes = [];
        if (ext) pushes.push(['extraction', ext]);
        if (qb.mc?.length) pushes.push(['mc', qb.mc]);
        if (qb.twoPart?.length) pushes.push(['two_part', qb.twoPart]);
        if (qb.short?.length) pushes.push(['short', qb.short]);
        for (const [stage, payload] of pushes) {
          // eslint-disable-next-line no-await-in-loop
          await api.putChapterStage(chapterId, stage, payload);
        }
        okCount++;
      } catch (e) {
        errCount++;
        lastErr.msg = e.message;
      }
    }
    setBusy(false);
    if (errCount === 0) {
      setStatus({ kind: 'ok', msg: `Published ${okCount} chapter${okCount === 1 ? '' : 's'} to the Bank.` });
    } else {
      setStatus({ kind: 'err', msg: `${okCount} ok, ${errCount} failed. Last error: ${lastErr.msg}` });
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-[var(--text-strong)]">Publish to Bank</h3>
        <span className="text-xs text-[var(--text-faint)]">
          {publishable.length} chapter{publishable.length === 1 ? '' : 's'} ready
        </span>
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        {allLinked
          ? <>All your local chapters are already published. Click below to push any newer stages.</>
          : <>Each local chapter becomes its own row in the shared Bank, with stage badges showing what's done. Friends signed in to the same Bank can quiz from or contribute to them.</>}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={publishAll}
          disabled={busy}
          className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {busy ? 'Publishing…' : allLinked ? 'Update all in Bank' : `Publish all ${publishable.length} to Bank`}
        </button>
      </div>
      {status && (
        <p className={`text-xs ${
          status.kind === 'ok' ? 'text-[var(--success-text)]' :
          status.kind === 'err' ? 'text-[var(--danger-text)]' :
          'text-[var(--text-muted)]'
        }`}>
          {status.kind === 'ok' ? '✓ ' : ''}{status.msg}
        </p>
      )}
    </div>
  );
}

// ---------- flag fixes: process queued flagged questions via Gemini ----------
// Token-limit aware: if Gemini rate-limits or errors, remaining flags stay in
// localStorage queue for next session.
function FlagFixesPanel() {
  const { api, client, apiKey, session, files, extractions, questions, setQuestionsFor } = useApp();
  const [queue, setQueue] = useState(() => storage.get(KEYS.flagQueue, []));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [processedLog, setProcessedLog] = useState([]);

  const pending = queue.filter((f) => f.status === 'pending');
  const done = queue.filter((f) => f.status !== 'pending');

  const refresh = () => setQueue(storage.get(KEYS.flagQueue, []));

  // Pick up flags added elsewhere (e.g. the quiz flag modal) the moment they
  // land, so a freshly flagged question shows up here without a reload.
  useEffect(() => {
    const onChange = () => setQueue(storage.get(KEYS.flagQueue, []));
    window.addEventListener('mcat:flagQueueChange', onChange);
    return () => window.removeEventListener('mcat:flagQueueChange', onChange);
  }, []);

  const saveQueue = (next) => {
    storage.set(KEYS.flagQueue, next);
    setQueue(next);
    // Library subscribes to this — when a flag is resolved or re-queued,
    // the 🚩 badge count on the affected chapter should update live.
    try { window.dispatchEvent(new Event('mcat:flagQueueChange')); } catch {}
  };

  const removeFlag = (id) => {
    saveQueue(queue.filter((f) => f.id !== id));
  };

  // Re-queue a resolved flag so the next pipeline run sends it back to Gemini.
  // An optional amended description lets the user clarify what's still wrong.
  const requeueFlag = (id, newDescription) => {
    saveQueue(queue.map((f) => f.id === id ? {
      ...f,
      status: 'pending',
      description: (newDescription || '').trim() || f.description,
      rationale: undefined,
      error: undefined,
      fixed_question: undefined,
    } : f));
  };

  const isRateLimit = (err) =>
    err?.status === 429 || /quota|rate.?limit|exceeded/i.test(err?.message || '');

  const runPipeline = async () => {
    if (!apiKey) { setStatus({ kind: 'err', msg: 'Add a Gemini API key in Settings first.' }); return; }
    if (!pending.length) return;
    setBusy(true); setStatus({ kind: 'info', msg: `Processing ${pending.length} flag(s)…` });
    setProcessedLog([]);
    const current = [...queue];
    let processedCount = 0;
    for (const flag of pending) {
      try {
        setStatus({ kind: 'info', msg: `Fixing "${(flag.question_snapshot.question || flag.question_snapshot.prompt || flag.question_snapshot.theme || flag.question_id).slice(0, 60)}…"` });
        const fix = await client.fixFlaggedQuestion({
          question: flag.question_snapshot,
          flagDescription: flag.description,
          chapterContext: flag.chapter_label,
        });

        // Apply the fix locally and to the server (if logged in + chapter exists on bank).
        const fileId = flag.file_id;
        const qbank = questions[fileId];

        if (fix.two_part) {
          // ---- two-part item fix: update qbank.twoPart ----
          if (qbank?.twoPart && fix.action === 'edit' && Array.isArray(fix.parts) && fix.parts.length === 2) {
            const cleanParts = fix.parts.map((p) => ({
              question: sanitizeText(p.question),
              choices: (p.choices || []).slice(0, 4).map((c, i) => stripChoiceLabel(c, i)),
              correct_index: Number.isInteger(p.correct_index) ? p.correct_index : 0,
              explanation: sanitizeText(p.explanation),
            }));
            const nextTp = qbank.twoPart.map((it) => it.id === flag.question_id ? {
              ...it, theme: sanitizeText(fix.theme) || it.theme, parts: cleanParts,
            } : it);
            if (nextTp !== qbank.twoPart) {
              setQuestionsFor(fileId, { ...qbank, twoPart: nextTp });
              if (flag.chapter_id && session) {
                try { await api.putChapterStage(flag.chapter_id, 'two_part', nextTp); } catch {}
              }
            }
          }
        } else if (qbank?.mc) {
          // ---- single MC question fix: update qbank.mc ----
          let nextMc = qbank.mc;
          if (fix.action === 'edit') {
            nextMc = qbank.mc.map((q) => q.id === flag.question_id ? {
              ...q,
              question: sanitizeText(fix.question) || q.question,
              // Strip any "A./B./C./D." labels and escape-code artifacts from the choices.
              choices: (fix.choices?.length === 4 ? fix.choices : q.choices).map((c, i) => stripChoiceLabel(c, i)),
              correct_index: Number.isInteger(fix.correct_index) ? fix.correct_index : q.correct_index,
              explanation: sanitizeText(fix.explanation) || q.explanation,
            } : q);
          }
          // No delete branch — every question (especially term-coverage) must be preserved.
          if (nextMc !== qbank.mc) {
            setQuestionsFor(fileId, { ...qbank, mc: nextMc });
            if (flag.chapter_id && session) {
              try { await api.putChapterStage(flag.chapter_id, 'mc', nextMc); } catch {}
            }
          }
        }

        const updated = current.find((f) => f.id === flag.id);
        if (updated) {
          updated.status = fix.action === 'edit' ? 'edited' : 'skipped';
          updated.rationale = fix.rationale;
          updated.resolved_at = Date.now();
          updated.error = undefined;
          // Keep the corrected question so it can be reviewed later (MC only).
          if (fix.action === 'edit' && !fix.two_part) {
            updated.fixed_question = {
              question: sanitizeText(fix.question) || flag.question_snapshot.question,
              choices: (fix.choices?.length === 4 ? fix.choices : flag.question_snapshot.choices || []).map((c, i) => stripChoiceLabel(c, i)),
              correct_index: Number.isInteger(fix.correct_index) ? fix.correct_index : flag.question_snapshot.correct_index,
              explanation: sanitizeText(fix.explanation) || flag.question_snapshot.explanation,
            };
          }
        }
        setProcessedLog((log) => [...log, { flag, fix }]);
        processedCount++;
      } catch (e) {
        if (isRateLimit(e)) {
          setStatus({ kind: 'warn', msg: `Rate-limited after ${processedCount} flag(s). The remaining ${pending.length - processedCount} will stay queued for tomorrow.` });
          saveQueue(current);
          setBusy(false);
          return;
        }
        const updated = current.find((f) => f.id === flag.id);
        if (updated) { updated.status = 'error'; updated.error = e.message; }
      }
    }
    saveQueue(current);
    setStatus({ kind: 'ok', msg: `Done — ${processedCount} flag(s) processed.` });
    setBusy(false);
  };

  if (!queue.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--warning-text)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-semibold text-[var(--text-strong)]">⚑ Flagged questions</h3>
          <p className="text-xs text-[var(--text-muted)]">
            {pending.length} pending · {done.length} resolved. Pipeline runs locally with your Gemini key.
          </p>
        </div>
        <button onClick={refresh} className="text-xs text-[var(--text-muted)] underline">refresh</button>
      </div>

      {status && (
        <div className={`text-sm rounded px-3 py-2 ${
          status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' :
          status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' :
          status.kind === 'warn' ? 'bg-[var(--warning-bg)] text-[var(--warning-text)]' :
          'bg-[var(--accent-soft)] text-[var(--accent-text)]'
        }`}>{status.msg}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={runPipeline}
          disabled={busy || !pending.length || !apiKey}
          className="text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
        >
          {busy ? 'Processing…' : `Run pipeline (${pending.length})`}
        </button>
        {done.length > 0 && (
          <button
            onClick={() => saveQueue(queue.filter((f) => f.status === 'pending'))}
            className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded"
          >
            Clear resolved
          </button>
        )}
      </div>

      <ul className="space-y-2 text-sm">
        {queue.slice().reverse().map((f) => (
          <FlagRow key={f.id} flag={f} onRemove={() => removeFlag(f.id)} onRequeue={(d) => requeueFlag(f.id, d)} />
        ))}
      </ul>
    </div>
  );
}

function FlagRow({ flag: f, onRemove, onRequeue }) {
  const [amending, setAmending] = useState(false);
  const [amendText, setAmendText] = useState('');
  const letters = ['A', 'B', 'C', 'D'];
  const fixed = f.fixed_question;

  return (
    <li className="border border-[var(--border-soft)] rounded-lg p-2 bg-[var(--bg-elev-soft)]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">{f.chapter_label}</span>
        <span className={`text-[10px] uppercase ${
          f.status === 'pending' ? 'text-[var(--warning-text)]' :
          f.status === 'error' ? 'text-[var(--danger-text)]' :
          f.status === 'skipped' ? 'text-[var(--text-faint)]' :
          'text-[var(--success-text)]'
        }`}>{f.status}</span>
      </div>
      <div className="text-xs mt-1 text-[var(--text)]">
        {f.question_snapshot?.theme ? `Two-part: ${f.question_snapshot.theme}` : null}
        {(f.question_snapshot?.question || f.question_snapshot?.prompt || (f.question_snapshot?.theme ? '' : f.question_id)).slice(0, 160)}
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-1 italic">"{f.description}"</div>
      {f.rationale && <div className="text-[11px] text-[var(--accent-text)] mt-1">→ {f.rationale}</div>}
      {f.error && <div className="text-[11px] text-[var(--danger-text)] mt-1">{f.error}</div>}

      {/* Corrected question preview (edited flags only) */}
      {fixed && (
        <div className="mt-2 border-t border-[var(--border-soft)] pt-2">
          <div className="text-[10px] uppercase tracking-wide text-[var(--success-text)] mb-1">Corrected</div>
          <div className="text-xs text-[var(--text)]">{fixed.question}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 mt-1">
            {(fixed.choices || []).map((c, ci) => (
              <div key={ci} className={`text-[11px] px-1.5 py-0.5 rounded ${ci === fixed.correct_index ? 'bg-[var(--success-bg)] text-[var(--success-text)] font-medium' : 'text-[var(--text-muted)]'}`}>
                {letters[ci]}. {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {amending && (
        <div className="mt-2 space-y-1.5">
          <textarea
            value={amendText}
            onChange={(e) => setAmendText(e.target.value)}
            rows={2}
            placeholder="Optional: clarify what's still wrong before re-sending to Gemini…"
            className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-2 py-1 text-xs"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setAmending(false)} className="text-[10px] text-[var(--text-faint)] px-2 py-1">cancel</button>
            <button
              onClick={() => { onRequeue(amendText); setAmending(false); setAmendText(''); }}
              className="text-[10px] px-2 py-1 bg-[var(--accent)] text-white rounded"
            >
              Re-queue
            </button>
          </div>
        </div>
      )}

      {!amending && (
        <div className="flex items-center justify-end gap-3 mt-1">
          {f.status !== 'pending' && (
            <button onClick={() => setAmending(true)} className="text-[10px] text-[var(--accent-text)] hover:underline">
              re-run with Gemini
            </button>
          )}
          <button onClick={onRemove} className="text-[10px] text-[var(--text-faint)] hover:text-[var(--danger-text)]">remove</button>
        </div>
      )}
    </li>
  );
}

// ---------- shell ----------
function CloudBankPanel() {
  const { session, api, files, extractions, questions, setFiles, setExtraction, setQuestionsFor } = useApp();
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [remote, setRemote] = useState(null); // { size_bytes, updated_at } | null
  const [busy, setBusy] = useState(false);

  // On mount / login: probe whether the user has a published bank already.
  useEffect(() => {
    if (!session) { setRemote(null); return; }
    let cancelled = false;
    api.bankMeta(session.username)
      .then((m) => { if (!cancelled) setRemote(m); })
      .catch(() => { if (!cancelled) setRemote(null); });
    return () => { cancelled = true; };
  }, [api, session?.username]);

  if (!session) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl px-4 py-3 text-sm text-[var(--text-muted)]">
        Sign in to publish your question bank to the cloud — then any device (including your phone) can pull it down.
      </div>
    );
  }

  const hasLocal = files.length > 0 && files.some((f) => extractions[f.file_id] && questions[f.file_id]?.mc);

  const publish = async () => {
    setBusy(true);
    setStatus({ state: 'pushing', message: 'Uploading…' });
    try {
      const bank = JSON.stringify({
        version: 1,
        exported_at: new Date().toISOString(),
        model: MODEL,
        files,
        extractions,
        questions,
      });
      const res = await api.putBank(bank);
      setRemote({ size_bytes: res.size_bytes, updated_at: res.updated_at, username: session.username });
      setStatus({ state: 'ok', message: `Published ${(res.size_bytes / 1024).toFixed(1)} KB` });
    } catch (e) {
      setStatus({ state: 'err', message: e.message });
    } finally {
      setBusy(false);
    }
  };

  const pull = async () => {
    if (!confirm('Replace your local question bank with the cloud copy?')) return;
    setBusy(true);
    setStatus({ state: 'pulling', message: 'Downloading…' });
    try {
      const bank = await api.getMyBank();
      setFiles(bank.files || []);
      // setExtraction / setQuestionsFor write per-key; bulk-replace via direct storage.
      storage.set(KEYS.extractions, bank.extractions || {});
      storage.set(KEYS.questions, bank.questions || {});
      // Force a state refresh by setting each one (cheap).
      for (const fid of Object.keys(bank.extractions || {})) setExtraction(fid, bank.extractions[fid]);
      for (const fid of Object.keys(bank.questions || {})) setQuestionsFor(fid, bank.questions[fid]);
      const n = (bank.files || []).length;
      setStatus({ state: 'ok', message: `Pulled ${n} chapter${n === 1 ? '' : 's'}` });
    } catch (e) {
      setStatus({ state: 'err', message: e.message });
    } finally {
      setBusy(false);
    }
  };

  const remoteAge = remote
    ? (() => {
        const ago = Date.now() - remote.updated_at;
        const min = Math.round(ago / 60000);
        if (min < 1) return 'just now';
        if (min < 60) return `${min} min ago`;
        const hr = Math.round(min / 60);
        if (hr < 24) return `${hr} hr ago`;
        return `${Math.round(hr / 24)} d ago`;
      })()
    : null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-[var(--text-strong)]">Cloud bank</h3>
        {remote && (
          <span className="text-xs text-[var(--text-faint)]">
            {(remote.size_bytes / 1024).toFixed(1)} KB · {remoteAge}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-muted)]">
        {remote
          ? <>Your bank is published. Other devices signed in as <span className="font-mono">@{session.username}</span> can pull it down.</>
          : <>Publish your processed chapters to the cloud so your phone (or any other device) can quiz from them without re-processing.</>
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={publish}
          disabled={busy || !hasLocal}
          className="flex-1 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
        >
          {busy && status.state === 'pushing' ? 'Uploading…' : remote ? 'Update cloud bank' : 'Publish to cloud'}
        </button>
        {remote && (
          <button
            onClick={pull}
            disabled={busy}
            className="flex-1 border border-[var(--border)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
          >
            {busy && status.state === 'pulling' ? 'Downloading…' : 'Pull cloud bank to this device'}
          </button>
        )}
      </div>
      {status.state === 'ok' && (
        <p className="text-xs text-[var(--success-text)]">✓ {status.message}</p>
      )}
      {status.state === 'err' && (
        <p className="text-xs text-[var(--danger-text)]">{status.message}</p>
      )}
      {!hasLocal && (
        <p className="text-xs text-[var(--text-faint)]">No locally processed chapters — process some in the Library, or pull from cloud if you have one.</p>
      )}
    </div>
  );
}

function exportBank({ files, extractions, questions }) {
  const data = {
    version: 1,
    exported_at: new Date().toISOString(),
    model: MODEL,
    files,
    extractions,
    questions,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `data.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- account ----------
function AccountPanel({ onClose }) {
  const { session, setSession, api } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (session) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Signed in as</div>
            <div className="text-xl font-semibold">@{session.username}</div>
          </div>
          <button
            onClick={async () => {
              try { await api.logout(); } catch {}
              setSession(null);
            }}
            className="text-xs px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  const submit = async () => {
    setErr('');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setErr('Username must be 3-20 chars (letters, digits, underscore).');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setErr('PIN must be exactly 4 digits.');
      return;
    }
    setBusy(true);
    try {
      const res = mode === 'signup'
        ? await api.signup({ username, pin })
        : await api.login({ username, pin });
      setSession({ token: res.token, username: res.username });
      setPin('');
      onClose?.();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 max-w-sm mx-auto">
      <div className="flex gap-1 mb-4">
        {[['login', 'Log in'], ['signup', 'Sign up']].map(([k, label]) => (
          <button
            key={k}
            onClick={() => { setMode(k); setErr(''); }}
            className={`text-sm px-3 py-1.5 rounded flex-1 ${mode === k
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-strong)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1">Username</label>
      <input
        value={username}
        onChange={(e) => { setUsername(e.target.value.toLowerCase()); setErr(''); }}
        placeholder="3-20 chars, a-z 0-9 _"
        autoComplete="username"
        className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--accent-border)]"
      />

      <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mt-3 mb-1">4-digit PIN</label>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setErr(''); }}
        onKeyDown={(e) => e.key === 'Enter' && !busy && submit()}
        placeholder="••••"
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded-lg px-3 py-2 text-lg font-mono tracking-widest text-center focus:outline-none focus:border-[var(--accent-border)]"
      />

      {err && <p className="text-[var(--danger-text)] text-xs mt-2">{err}</p>}

      <button
        onClick={submit}
        disabled={busy || !username || !pin}
        className="mt-4 w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded-lg py-2 text-sm font-medium"
      >
        {busy ? 'Working…' : mode === 'signup' ? 'Create account' : 'Log in'}
      </button>

      <p className="text-[11px] text-[var(--text-faint)] mt-3 text-center">
        Stats sync across devices and show up on the leaderboard. PIN is hashed server-side. Don't reuse a sensitive PIN.
      </p>
    </div>
  );
}

// ---------- leaderboard + profiles ----------
function pct(c, t) { return t ? Math.round((c / t) * 100) : 0; }

function Leaderboard({ onPickUser }) {
  const { api } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.leaderboard()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api]);

  if (err) return <div className="text-sm text-[var(--danger-text)]">Could not load leaderboard: {err}</div>;
  if (!data) return <div className="text-sm text-[var(--text-muted)]">Loading…</div>;

  if (!data.users.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No one has recorded any attempts yet. Be the first.
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <h3 className="font-semibold mb-3 text-[var(--text-strong)]">Leaderboard — accuracy on last {data.window || 100} attempts</h3>
      <ol className="divide-y divide-[var(--border-soft)]">
        {data.users.map((u, i) => (
          <li key={u.username} className="py-2 flex items-center gap-3">
            <span className="text-[var(--text-faint)] w-6 text-right">{i + 1}.</span>
            <button
              onClick={() => onPickUser?.(u.username)}
              className="flex-1 text-left text-[var(--text)] hover:text-[var(--accent-text)] font-medium truncate"
            >
              @{u.username}
            </button>
            <div className="text-xs text-[var(--text-muted)] tabular-nums">
              {u.correct}/{u.total}
              <span className="ml-2 text-[var(--text-strong)] font-medium">{pct(u.correct, u.total)}%</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ServerStatsPayload({ data }) {
  if (!data) return null;
  const overall = data.overall || { total: 0, correct: 0 };
  const weekly = data.weekly || { total: 0, correct: 0 };
  const overallPct = pct(overall.correct, overall.total);
  const weeklyPct = pct(weekly.correct, weekly.total);

  const modeLabels = { mc: 'Multiple choice', short: 'Short answer', match: 'Matching' };

  // Build last-7-days bar series from data.daily (sparse — fill missing days with zero).
  const today = Math.floor(Date.now() / 86400000);
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(today - i);
  const dailyByBucket = {};
  for (const d of (data.daily || [])) dailyByBucket[d.day_bucket] = d;
  const dailySeries = days.map((b) => {
    const r = dailyByBucket[b];
    return { day: b, total: r?.total || 0, correct: r?.correct || 0 };
  });
  const maxTotal = Math.max(1, ...dailySeries.map((d) => d.total));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[var(--text-muted)]">All-time</div>
          <div className="text-3xl sm:text-4xl font-bold mt-1.5 text-[var(--text-strong)]">{overallPct}%</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">{overall.correct} / {overall.total}</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 text-center">
          <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[var(--text-muted)]">This week</div>
          <div className="text-3xl sm:text-4xl font-bold mt-1.5 text-[var(--text-strong)]">{weeklyPct}%</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">{weekly.correct} / {weekly.total}</div>
        </div>
      </div>

      {data.mostStudiedSubject && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 flex items-baseline justify-between">
          <span className="text-sm text-[var(--text-muted)]">Most-studied subject</span>
          <span className="text-base font-medium text-[var(--text-strong)]">{data.mostStudiedSubject}</span>
        </div>
      )}

      {/* Daily bar chart (last 7 days) */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
        <h3 className="font-semibold mb-3 text-[var(--text-strong)]">Last 7 days</h3>
        <div className="flex items-end gap-1.5 h-32">
          {dailySeries.map((d) => {
            const acc = pct(d.correct, d.total);
            // Bar height = total relative to the busiest day; fill = % correct of that bar.
            const barH = d.total ? Math.max(6, (d.total / maxTotal) * 100) : 0;
            const fillH = d.total ? (d.correct / d.total) * 100 : 0;
            return (
              <div key={d.day} className="flex-1 h-full flex flex-col justify-end" title={`${d.correct}/${d.total} (${acc}%)`}>
                <div
                  className="w-full bg-[var(--bg-elev)] rounded-t overflow-hidden flex flex-col justify-end"
                  style={{ height: `${barH}%` }}
                >
                  <div className="w-full bg-[var(--success-border)]" style={{ height: `${fillH}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-1">
          {dailySeries.map((d) => {
            const dayLabel = new Date(d.day * 86400000 + 43200000).toLocaleDateString(undefined, { weekday: 'short' });
            return <div key={d.day} className="flex-1 text-center text-[10px] text-[var(--text-faint)]">{dayLabel}</div>;
          })}
        </div>
        <p className="text-[11px] text-[var(--text-faint)] mt-2">Bar height = attempts that day. Green = % correct.</p>
      </div>

      {data.bySubject?.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By subject</h3>
          <div className="space-y-3">
            {data.bySubject.map((s) => (
              <StatBar key={s.subject} label={s.subject} correct={s.correct} total={s.total} />
            ))}
          </div>
        </div>
      )}

      {data.byChapter?.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By chapter (weakest first)</h3>
          <div className="space-y-3">
            {[...data.byChapter]
              .sort((a, b) => (a.correct / Math.max(1, a.total)) - (b.correct / Math.max(1, b.total)))
              .map((c) => (
                <StatBar key={`${c.subject}/${c.chapter}`} label={`${c.subject} — ${c.chapter}`} correct={c.correct} total={c.total} />
              ))}
          </div>
        </div>
      )}

      {data.byMode?.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="font-semibold mb-3 text-[var(--text-strong)]">By mode</h3>
          <div className="space-y-3">
            {data.byMode.map((m) => (
              <StatBar key={m.mode} label={modeLabels[m.mode] || m.mode} correct={m.correct} total={m.total} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ---------- audit modal: Gemini correctness check (no deletion) ----------
function AuditModal({ chapter, onClose }) {
  const { api, client, apiKey, files, setQuestionsFor, questions } = useApp();
  const [phase, setPhase] = useState('loading'); // loading | ready | verifying | done
  const [mc, setMc] = useState([]);
  const [flags, setFlags] = useState([]); // [{index, suggested_index, reason, q}]
  const [status, setStatus] = useState(null);
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    api.getChapter(chapter.id).then((full) => {
      if (cancelled) return;
      setMc(Array.isArray(full.mc) ? full.mc : []);
      setPhase('ready');
    }).catch((e) => {
      setStatus({ kind: 'err', msg: e.message });
      setPhase('ready');
    });
    return () => { cancelled = true; };
  }, [chapter.id, api]);

  const localFile = files.find((f) => f.chapter_id === chapter.id);

  const runVerify = async () => {
    if (!apiKey) { setStatus({ kind: 'err', msg: 'Add a Gemini API key in Settings first.' }); return; }
    setPhase('verifying'); setFlags([]); setStatus({ kind: 'info', msg: `Checking ${mc.length} MC questions…` });
    try {
      const mcOnly = mc.filter((q) => q.mode === 'mc' && q.choices?.length === 4);
      const results = await client.auditQuestions(mcOnly);
      const flagged = results.filter((r) => !r.correct).map((r) => ({ ...r, q: mcOnly[r.index] }));
      setFlags(flagged);
      setPhase('done');
      // Mark the chapter as audited even if no issues found.
      try { await api.putChapterStage(chapter.id, 'audited', { ts: Date.now() }); } catch {}
      if (!flagged.length) setStatus({ kind: 'ok', msg: 'All questions verified — no issues found!' });
      else setStatus({ kind: 'warn', msg: `${flagged.length} question(s) may have wrong correct_index.` });
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
      setPhase('ready');
    }
  };

  const acceptFix = async (flag) => {
    const updated = mc.map((q) => q === flag.q ? { ...q, correct_index: flag.suggested_index } : q);
    setMc(updated);
    try {
      await api.putChapterStage(chapter.id, 'mc', updated);
      // Also patch the local library copy if the user has this chapter downloaded.
      if (localFile) {
        const qbank = questions[localFile.file_id];
        if (qbank?.mc) {
          const localUpdated = qbank.mc.map((q) =>
            q.id === flag.q.id ? { ...q, correct_index: flag.suggested_index } : q
          );
          setQuestionsFor(localFile.file_id, { ...qbank, mc: localUpdated });
        }
      }
      setApplied((s) => new Set(s).add(flag.q.id));
      setStatus({ kind: 'ok', msg: `Fixed correct_index for "${flag.q.question.slice(0, 50)}…"` });
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-16 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-strong)]">Audit: {chapter.title}</h2>
          <button onClick={onClose} className="text-xs px-2 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)]">Close</button>
        </div>

        {status && (
          <div className={`text-sm rounded-lg px-3 py-2 ${
            status.kind === 'ok' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' :
            status.kind === 'err' ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]' :
            status.kind === 'warn' ? 'bg-[var(--warning-bg)] text-[var(--warning-text)]' :
            'bg-[var(--accent-soft)] text-[var(--accent-text)]'
          }`}>{status.msg}</div>
        )}

        {phase === 'loading' && <div className="text-sm text-[var(--text-muted)]">Loading chapter…</div>}

        {phase === 'ready' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-muted)] mb-2">
              Send {mc.filter((q) => q.mode === 'mc' && q.choices?.length === 4).length} MC questions to Gemini to verify that <code>correct_index</code> is right. Questions are never deleted — at worst the correct answer index is changed.
            </p>
            <button
              onClick={runVerify}
              disabled={!apiKey}
              className={`text-xs rounded px-3 py-1.5 ${apiKey
                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                : 'bg-[var(--bg-elev)] text-[var(--text-faint)] cursor-not-allowed'}`}
            >
              {apiKey ? 'Run audit' : 'Needs API key'}
            </button>
          </div>
        )}

        {phase === 'verifying' && <div className="text-sm text-[var(--accent-text)]">… running audit, this may take a minute.</div>}

        {phase === 'done' && flags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--warning-text)]">{flags.length} flagged question(s)</h3>
            {flags.map((flag, i) => {
              const done = applied.has(flag.q.id);
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <div key={i} className={`bg-[var(--bg-card)] border rounded-xl p-4 text-sm space-y-2 ${done ? 'border-[var(--success-border)] opacity-60' : 'border-[var(--warning-text)]'}`}>
                  <p className="font-medium">{flag.q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    {flag.q.choices.map((c, ci) => (
                      <div key={ci} className={`px-2 py-1 rounded ${
                        ci === flag.q.correct_index ? 'bg-[var(--danger-bg)] line-through' :
                        ci === flag.suggested_index ? 'bg-[var(--success-bg)] font-semibold' : 'bg-[var(--bg-elev)]'
                      }`}>
                        {letters[ci]}. {c}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    <span className="text-[var(--danger-text)]">Stored: {letters[flag.q.correct_index]}</span>
                    {' → '}
                    <span className="text-[var(--success-text)]">Suggested: {letters[flag.suggested_index]}</span>
                    {' · '}{flag.reason}
                  </p>
                  {!done && (
                    <div className="flex gap-2">
                      <button onClick={() => acceptFix(flag)} className="text-xs bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)] rounded px-2 py-1 hover:opacity-80">Accept fix</button>
                      <button onClick={() => setApplied((s) => new Set(s).add(flag.q.id))} className="text-xs text-[var(--text-muted)] border border-[var(--border)] rounded px-2 py-1 hover:bg-[var(--bg-hover)]">Skip</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-xs text-[var(--text-faint)]">{mc.length} MC question(s)</div>
      </div>
    </div>
  );
}

// ---------- collaborative bank (chapters) ----------
function StageDot({ stage, label }) {
  const done = stage?.done;
  const partial = stage?.terms_missing > 0;
  const cls = done && !partial
    ? 'bg-[var(--success-bg-strong)] text-[var(--success-text)] border-[var(--success-border)]'
    : done && partial
    ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-text-strong)]'
    : 'bg-[var(--bg-elev)] text-[var(--text-faint)] border-[var(--border)]';
  let tooltip = `${label}: ${done ? 'done' : 'pending'}`;
  if (stage?.by) tooltip += ` · by @${stage.by}`;
  if (stage?.count != null) tooltip += ` · ${stage.count} items`;
  if (stage?.term_coverage) tooltip += ` · term coverage: ${stage.term_coverage}`;
  return (
    <span
      title={tooltip}
      className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${cls}`}
    >
      {label}{stage?.count != null ? ` ${stage.count}` : ''}
    </span>
  );
}

function ChapterRow({ chapter, onDownload, onContribute, onAudit, busy, downloaded, canContribute, contributorMode }) {
  const ago = (() => {
    const ms = Date.now() - chapter.updated_at;
    const m = Math.round(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.round(h / 24)}d ago`;
  })();

  // What can a contributor (someone with a Gemini key but not the PDF) actually fill in?
  // Anything except extraction. Once extraction exists, everything else is up for grabs.
  const missing = [];
  const s = chapter.stages || {};
  if (s.extraction?.done) {
    if (!s.mc?.done || (s.mc?.terms_missing ?? 0) > 0) missing.push({ key: 'mc', label: s.mc?.done ? 'fill missing term coverage' : 'MC' });
    if (!s.two_part?.done) missing.push({ key: 'two_part', label: 'two-part' });
    if (!s.short?.done) missing.push({ key: 'short', label: 'short answer' });
  }

  return (
    <li className="py-3 space-y-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[var(--text)] font-medium break-words">{chapter.title}</span>
          {chapter.status === 'complete' && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success-text)] shrink-0">
              ✓ complete
            </span>
          )}
          {chapter.status === 'partial' && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--warning-bg)] text-[var(--warning-text)] shrink-0">
              partial
            </span>
          )}
          {chapter.status === 'pending' && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--bg-elev)] text-[var(--text-faint)] border border-[var(--border)] shrink-0">
              needs extraction
            </span>
          )}
        </div>
        <div className="text-xs text-[var(--text-faint)] mt-0.5 break-words">
          {chapter.filename} · by @{chapter.uploader_username} · {ago}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <StageDot stage={chapter.stages?.extraction} label="extract" />
          <StageDot stage={chapter.stages?.mc} label="mc" />
          <StageDot stage={chapter.stages?.two_part} label="two-part" />
          <StageDot stage={chapter.stages?.short} label="short" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onDownload}
          disabled={!!busy || chapter.status === 'pending'}
          className="text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium whitespace-nowrap"
        >
          {busy === 'downloading' ? 'Downloading…' : downloaded ? 'Re-download' : 'Download'}
        </button>
        {missing.length > 0 && (
          canContribute ? (
            <button
              onClick={() => onContribute(missing.map((m) => m.key))}
              disabled={!!busy}
              title={`Run your Gemini key to fill: ${missing.map((m) => m.label).join(', ')}`}
              className="text-xs px-3 py-1.5 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--accent-soft)] disabled:opacity-40 rounded font-medium whitespace-nowrap"
            >
              {busy === 'contributing' ? 'Contributing…' : `Contribute (${missing.length})`}
            </button>
          ) : (
            <span className="text-[11px] text-[var(--text-faint)]" title="Add a Gemini API key in Settings to contribute.">
              {missing.length} stage{missing.length === 1 ? '' : 's'} need work
            </span>
          )
        )}
        {/* Audit is a contributor-only action — it re-checks correct_index
            against the explanation with Gemini, which costs the contributor's
            API key. Re-auditing is always allowed for contributors; the old
            "Allow re-auditing" Settings toggle was redundant. */}
        {chapter.stages?.mc?.done && canContribute && contributorMode && (
          <button
            onClick={onAudit}
            disabled={!!busy}
            title={chapter.audited_at
              ? `Already audited by @${chapter.audited_by}. Click to re-audit.`
              : 'Check that correct_index is right for every MC question'}
            className="text-xs px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] disabled:opacity-40 rounded whitespace-nowrap"
          >
            {chapter.audited_at ? 'Re-audit' : 'Audit'}
          </button>
        )}
        {chapter.audited_at && (
          <span className="text-[10px] uppercase tracking-wide text-[var(--success-text)]" title={`Audited by @${chapter.audited_by}`}>
            ✓ audited
          </span>
        )}
      </div>
    </li>
  );
}

function BankTab() {
  const { api, session, apiKey, client, setFiles, setExtraction, setQuestionsFor, files, contributorMode } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [auditChapter, setAuditChapter] = useState(null);
  const [tick, setTick] = useState(0);
  const [busyId, setBusyId] = useState(null); // chapter id currently working
  const [busyKind, setBusyKind] = useState(null); // 'downloading' | 'contributing'
  const [status, setStatus] = useState(null);
  const [filter, setFilter] = useState('');
  // Captured once at mount — the timestamp of the user's previous Bank visit.
  const [seenAt] = useState(() => storage.get(KEYS.bankSeen, 0));
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  // Subjects collapse by default; user opens what they need.
  const [openSubjects, setOpenSubjects] = useState({});
  const toggleSubject = (s) => setOpenSubjects((p) => ({ ...p, [s]: !p[s] }));

  useEffect(() => {
    let cancelled = false;
    api.listChapters()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, tick]);

  // When the Bank loads with nothing to summarize (first-ever visit, or no chapters
  // changed since last time), silently advance the seen marker so the tab dot clears.
  useEffect(() => {
    if (!data) return;
    const changed = seenAt > 0 ? data.chapters.filter((c) => (c.updated_at || 0) > seenAt) : [];
    if (seenAt === 0 || changed.length === 0) {
      storage.set(KEYS.bankSeen, Date.now());
      window.dispatchEvent(new Event('mcat:bankSeen'));
    }
  }, [data, seenAt]);

  const downloadOne = async (chapter) => {
    const full = await api.getChapter(chapter.id);
    const localFileId = `chap_${full.id}`;
    const fileRecord = {
      file_id: localFileId,
      file_uri: 'cloud',
      mime_type: 'application/pdf',
      filename: full.filename,
      size_bytes: full.size_bytes || 0,
      subject: full.subject,
      chapter: full.title,
      uploaded_at: new Date(full.created_at).toISOString(),
      chapter_id: full.id,
      chapter_updated_at: full.updated_at,
    };
    setFiles((prev) => [...prev.filter((f) => f.file_id !== localFileId && f.chapter_id !== full.id), fileRecord]);
    if (full.extraction) setExtraction(localFileId, full.extraction);
    setQuestionsFor(localFileId, {
      mc: full.mc || [],
      twoPart: full.two_part || [],
      short: full.short || [],
      generated_at: new Date(full.updated_at).toISOString(),
    });
    return full;
  };

  const downloadChapter = async (chapter) => {
    if (busyId) return;
    setBusyId(chapter.id); setBusyKind('downloading'); setStatus(null);
    try {
      const full = await downloadOne(chapter);
      setStatus({ kind: 'ok', msg: `Downloaded "${full.title}"` });
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally {
      setBusyId(null); setBusyKind(null);
    }
  };

  // Run the contributor's Gemini key against the chapter's published extraction
  // to fill in missing stages. PDF is not required for mc/two_part/short, so anyone
  // signed in with a key can advance a chapter.
  const contributeChapter = async (chapter, stages) => {
    if (busyId) return;
    if (!apiKey) {
      setStatus({ kind: 'err', msg: 'Add a Gemini API key in Settings to contribute.' });
      return;
    }
    setBusyId(chapter.id); setBusyKind('contributing'); setStatus({ kind: 'info', msg: `Loading "${chapter.title}"…` });
    try {
      const full = await api.getChapter(chapter.id);
      if (!full.extraction) throw new Error('Chapter has no extraction yet — only the uploader can do that step.');

      for (const stage of stages) {
        if (stage === 'mc') {
          setStatus({ kind: 'info', msg: `Generating MC for "${chapter.title}"…` });
          let newMc = Array.isArray(full.mc) ? [...full.mc] : [];
          // If no baseline mc, generate the general bank first.
          const hasBaseline = newMc.some((q) => q?.from !== 'term');
          if (!hasBaseline) {
            const baseline = await client.generateMCQuestions(null, null, full.extraction, full.title);
            newMc = newMc.concat(baseline);
          }
          // Fill in term-coverage for any uncovered terms.
          const termCovered = new Set(newMc.filter((q) => q?.from === 'term').map((q) => q.term));
          const missingTerms = (full.extraction.key_terms || []).filter((t) => !termCovered.has(t.term));
          if (missingTerms.length > 0) {
            setStatus({ kind: 'info', msg: `Generating term coverage (${missingTerms.length} terms)…` });
            const termExtraction = { ...full.extraction, key_terms: missingTerms };
            const termQs = await client.generateTermQuestions(termExtraction, full.title);
            newMc = newMc.concat(termQs);
          }
          await api.putChapterStage(chapter.id, 'mc', newMc);
        } else if (stage === 'two_part') {
          setStatus({ kind: 'info', msg: `Generating two-part for "${chapter.title}"…` });
          const twoPart = await client.generateTwoPartQuestions(full.extraction, full.title);
          if (!twoPart?.length) throw new Error('Two-part generation returned no items — try again.');
          await api.putChapterStage(chapter.id, 'two_part', twoPart);
        } else if (stage === 'short') {
          setStatus({ kind: 'info', msg: `Generating short answer for "${chapter.title}"…` });
          const short = await client.generateShortAnswers(null, null, full.extraction, full.title);
          if (!short?.length) throw new Error('Short-answer generation returned no items — try again.');
          await api.putChapterStage(chapter.id, 'short', short);
        }
      }
      // If the user already has this chapter in their local library, refresh it
      // so they get the newly contributed stages without a manual re-download.
      const localFile = files.find((f) => f.chapter_id === chapter.id);
      if (localFile) {
        setStatus({ kind: 'info', msg: `Refreshing local copy of "${chapter.title}"…` });
        try {
          const refreshed = await api.getChapter(chapter.id);
          const localFileId = `chap_${refreshed.id}`;
          const fileRecord = {
            file_id: localFileId, file_uri: 'cloud', mime_type: 'application/pdf',
            filename: refreshed.filename, size_bytes: refreshed.size_bytes || 0,
            subject: refreshed.subject, chapter: refreshed.title,
            uploaded_at: new Date(refreshed.created_at).toISOString(), chapter_id: refreshed.id,
          };
          setFiles((prev) => [...prev.filter((f) => f.file_id !== localFileId && f.chapter_id !== refreshed.id), fileRecord]);
          if (refreshed.extraction) setExtraction(localFileId, refreshed.extraction);
          setQuestionsFor(localFileId, {
            mc: refreshed.mc || [], twoPart: refreshed.two_part || [],
            short: refreshed.short || [], generated_at: new Date(refreshed.updated_at).toISOString(),
          });
        } catch {}
      }
      setStatus({ kind: 'ok', msg: `Contributed to "${chapter.title}"${localFile ? ' — local copy updated.' : ' — refreshing.'}` });
      setTick((t) => t + 1);
    } catch (e) {
      setStatus({ kind: 'err', msg: e.message });
    } finally {
      setBusyId(null); setBusyKind(null);
    }
  };

  if (err) {
    return (
      <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-2xl px-4 py-3 text-sm text-[var(--danger-text)] flex items-center justify-between">
        <span>Could not load bank: {err}</span>
        <button onClick={() => setTick((t) => t + 1)} className="text-xs px-3 py-1 border border-[var(--danger-border)] rounded">Retry</button>
      </div>
    );
  }
  if (!data) return <div className="text-sm text-[var(--text-muted)]">Loading bank…</div>;

  // Parse a chapter number from the title (e.g. "Chapter 12 - …") or the
  // filename (e.g. "chapter_ch12" or "Organic Chemistry Chapter 12 …"). Falls
  // back to a sentinel so unparseable chapters sort to the end.
  const parseChapterNum = (ch) => {
    const t = ch.title || '';
    const f = ch.filename || '';
    let m = /chapter\s*(\d+)/i.exec(t);
    if (m) return parseInt(m[1], 10);
    m = /chapter\s*(\d+)/i.exec(f);
    if (m) return parseInt(m[1], 10);
    m = /\bch(\d+)/i.exec(f);
    if (m) return parseInt(m[1], 10);
    return 9999;
  };

  // Group by subject, then sort each group by chapter number.
  const bySubject = {};
  for (const ch of data.chapters) {
    const subj = ch.subject || 'Other';
    if (!bySubject[subj]) bySubject[subj] = [];
    bySubject[subj].push(ch);
  }
  const localChapterIds = new Set(files.map((f) => f.chapter_id).filter(Boolean));
  // Canonical MCAT subject order; anything outside this list falls back to
  // alphabetical.
  const subjectOrder = ['Biology', 'Biochemistry', 'General Chemistry', 'Organic Chemistry', 'Physics', 'Behavioral Science', 'Psychology', 'Sociology', 'CARS'];
  const subjects = Object.keys(bySubject).sort((a, b) => {
    const ai = subjectOrder.indexOf(a), bi = subjectOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
  for (const s of subjects) {
    bySubject[s].sort((a, b) => {
      const an = parseChapterNum(a), bn = parseChapterNum(b);
      if (an !== bn) return an - bn;
      return (a.title || '').localeCompare(b.title || '');
    });
  }

  const filterLc = filter.toLowerCase();
  const filtered = (chs) =>
    filterLc ? chs.filter((c) =>
      c.title.toLowerCase().includes(filterLc) ||
      c.subject.toLowerCase().includes(filterLc) ||
      c.filename.toLowerCase().includes(filterLc) ||
      (c.uploader_username || '').toLowerCase().includes(filterLc)
    ) : chs;

  // Chapters touched since the user's last Bank visit. Skipped on the very first
  // visit (seenAt 0) so we don't flag the whole bank as "new".
  const changedChapters = seenAt > 0
    ? data.chapters.filter((c) => (c.updated_at || 0) > seenAt).sort((a, b) => b.updated_at - a.updated_at)
    : [];
  const markBankSeen = () => {
    storage.set(KEYS.bankSeen, Date.now());
    setSummaryDismissed(true);
    window.dispatchEvent(new Event('mcat:bankSeen'));
  };

  return (
    <div className="space-y-4">
      {/* Bank box at the very top: title, description, search, status — so
          the user can filter before scrolling past archives and banners. */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5 space-y-3">
        <div>
          <h2 className="font-semibold text-[var(--text-strong)]">Bank</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Every chapter anyone has published. Stage badges show what's been generated. Download any chapter into your local Library to quiz from it.
          </p>
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by subject, chapter, filename, or uploader…"
          className="w-full bg-[var(--bg-elev)] border border-[var(--border)] rounded px-3 py-2 text-sm"
        />
        {status && (
          <div className={`text-sm rounded-lg px-3 py-2 ${
            status.kind === 'ok'
              ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
              : status.kind === 'err'
              ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]'
              : 'bg-[var(--accent-soft)] text-[var(--accent-text)]'
          }`}>
            {status.kind === 'ok' ? '✓ ' : status.kind === 'info' ? '… ' : ''}{status.msg}
          </div>
        )}
      </div>

      <CarsArchive />
      {changedChapters.length > 0 && !summaryDismissed && (
        <div className="bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-2xl p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--accent-text)]">
                {changedChapters.length} chapter{changedChapters.length === 1 ? '' : 's'} updated since your last visit
              </h3>
              <ul className="mt-1 text-sm text-[var(--text)] space-y-0.5">
                {changedChapters.slice(0, 6).map((c) => (
                  <li key={c.id} className="truncate">
                    <span className="font-medium">{c.title}</span>
                    <span className="text-[var(--text-muted)]"> · {c.subject} · by @{c.uploader_username}</span>
                  </li>
                ))}
                {changedChapters.length > 6 && (
                  <li className="text-[var(--text-muted)]">…and {changedChapters.length - 6} more</li>
                )}
              </ul>
            </div>
            <button
              onClick={markBankSeen}
              className="shrink-0 text-xs px-3 py-1.5 border border-[var(--accent-border)] text-[var(--accent-text)] hover:bg-[var(--bg-hover)] rounded font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {data.chapters.length === 0 && (
        <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
          No chapters published yet. Publish your local chapters from the Library tab.
        </div>
      )}

      {subjects.map((subject) => {
        const list = filtered(bySubject[subject]);
        if (!list.length) return null;
        const open = !!openSubjects[subject];
        const downloadedCount = list.filter((c) => localChapterIds.has(c.id)).length;
        return (
          <div key={subject} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl">
            <button
              onClick={() => toggleSubject(subject)}
              className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left"
              aria-expanded={open}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  aria-hidden="true"
                  className="text-[var(--text-muted)] transition-transform inline-block"
                  style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  ▶
                </span>
                <h3 className="font-semibold text-[var(--text-strong)] truncate">{subject}</h3>
              </div>
              <span className="text-xs text-[var(--text-faint)] shrink-0">
                {downloadedCount}/{list.length} downloaded
              </span>
            </button>
            {open && (
              <ul className="divide-y divide-[var(--border-soft)] border-t border-[var(--border-soft)] px-4 sm:px-5">
                {list.map((ch) => (
                  <ChapterRow
                    key={ch.id}
                    chapter={ch}
                    onDownload={() => downloadChapter(ch)}
                    onContribute={(stages) => contributeChapter(ch, stages)}
                    onAudit={() => setAuditChapter(ch)}
                    busy={busyId === ch.id ? busyKind : null}
                    downloaded={localChapterIds.has(ch.id)}
                    canContribute={!!session && !!apiKey}
                    contributorMode={contributorMode}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {auditChapter && (
        <AuditModal chapter={auditChapter} onClose={() => { setAuditChapter(null); setTick((t) => t + 1); }} />
      )}

      <ConnectionsArchive />
    </div>
  );
}

function BanksBrowser() {
  const { api, session, setFiles, setExtraction, setQuestionsFor, files } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(null); // username currently downloading
  const [status, setStatus] = useState(null); // { username, msg, kind }

  useEffect(() => {
    let cancelled = false;
    setData(null); setErr('');
    api.listBanks()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, tick]);

  const download = async (username) => {
    if (busy) return;
    const localCount = files.length;
    const msg = localCount > 0
      ? `Replace your local bank (${localCount} chapter${localCount === 1 ? '' : 's'}) with @${username}'s bank? Your local data will be lost.`
      : `Download @${username}'s bank to this device?`;
    if (!confirm(msg)) return;
    setBusy(username);
    setStatus(null);
    try {
      const bank = await api.getUserBank(username);
      setFiles(bank.files || []);
      storage.set(KEYS.extractions, bank.extractions || {});
      storage.set(KEYS.questions, bank.questions || {});
      for (const fid of Object.keys(bank.extractions || {})) setExtraction(fid, bank.extractions[fid]);
      for (const fid of Object.keys(bank.questions || {})) setQuestionsFor(fid, bank.questions[fid]);
      const n = (bank.files || []).length;
      setStatus({ username, msg: `Downloaded ${n} chapter${n === 1 ? '' : 's'} from @${username}`, kind: 'ok' });
    } catch (e) {
      setStatus({ username, msg: e.message, kind: 'err' });
    } finally {
      setBusy(null);
    }
  };

  if (err) {
    return (
      <div className="bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-2xl px-4 py-3 text-sm text-[var(--danger-text)] flex items-center justify-between">
        <span>Could not load banks: {err}</span>
        <button onClick={() => setTick((t) => t + 1)} className="text-xs px-3 py-1 border border-[var(--danger-border)] rounded">Retry</button>
      </div>
    );
  }
  if (!data) return <div className="text-sm text-[var(--text-muted)]">Loading banks…</div>;
  if (!data.banks.length) {
    return (
      <div className="bg-[var(--bg-card-soft)] border border-dashed border-[var(--border-soft)] rounded-2xl p-6 text-sm text-[var(--text-muted)]">
        No one has published a bank yet. Publish yours from the Library tab.
      </div>
    );
  }

  const ago = (ts) => {
    const d = Date.now() - ts;
    const m = Math.round(d / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} hr ago`;
    return `${Math.round(h / 24)} d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5">
        <h2 className="font-semibold mb-1 text-[var(--text-strong)]">Published banks</h2>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Download any user's question bank to study from their chapters. {' '}
          {session ? 'Replaces your local bank.' : 'Sign in to download.'}
        </p>
        <ul className="divide-y divide-[var(--border-soft)]">
          {data.banks.map((b) => (
            <li key={b.username} className="py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[var(--text)] font-medium">@{b.username}</div>
                <div className="text-xs text-[var(--text-faint)]">
                  {(b.size_bytes / 1024).toFixed(1)} KB · updated {ago(b.updated_at)}
                </div>
                {status?.username === b.username && (
                  <div className={`text-xs mt-1 ${status.kind === 'ok' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
                    {status.kind === 'ok' ? '✓ ' : ''}{status.msg}
                  </div>
                )}
              </div>
              <button
                onClick={() => download(b.username)}
                disabled={!session || busy != null}
                className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
              >
                {busy === b.username ? 'Downloading…' : session ? 'Download' : 'Sign in'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UserProfile({ username, onBack }) {
  const { api } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    setData(null); setErr('');
    api.userProfile(username)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
  }, [api, username]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] rounded">
          ← Back
        </button>
        <h2 className="text-xl font-semibold">@{username}</h2>
      </div>
      {err && <div className="text-sm text-[var(--danger-text)]">{err}</div>}
      {!data && !err && <div className="text-sm text-[var(--text-muted)]">Loading…</div>}
      {data && <ServerStatsPayload data={data} />}
    </div>
  );
}

function SyncBar() {
  const { pendingSync, syncBusy, syncError, flushSync, session } = useApp();
  if (!session) return null;
  const count = pendingSync.length;
  return (
    <div className="flex items-center justify-between gap-3 bg-[var(--bg-card-soft)] border border-[var(--border-soft)] rounded-xl px-4 py-2.5 text-sm">
      <div className="flex items-center gap-2 min-w-0">
        {syncBusy ? (
          <span className="text-[var(--accent-text)]">Syncing…</span>
        ) : syncError ? (
          <span className="text-[var(--danger-text)] truncate" title={syncError}>Sync error: {syncError}</span>
        ) : count > 0 ? (
          <span className="text-[var(--warning-text-strong)]">{count} attempt{count === 1 ? '' : 's'} not yet synced</span>
        ) : (
          <span className="text-[var(--text-muted)]">All attempts synced</span>
        )}
      </div>
      <button
        onClick={flushSync}
        disabled={syncBusy}
        className="shrink-0 text-xs px-3 py-1.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-40 rounded font-medium"
      >
        {syncBusy ? '...' : 'Sync now'}
      </button>
    </div>
  );
}

function ServerStatsView() {
  const { api, session, pendingSync, syncBusy } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    setErr('');
    api.meStats()
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); });
    return () => { cancelled = true; };
    // refetch when sync queue drains or user manually re-triggers
  }, [api, session?.username, pendingSync.length, syncBusy, tick]);

  if (!session) return null;

  return (
    <div className="space-y-4">
      {err ? (
        <div className="flex items-center justify-between gap-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-xl px-4 py-2.5 text-sm">
          <span className="text-[var(--danger-text)]">Could not load stats: {err}</span>
          <button onClick={() => setTick((t) => t + 1)} className="text-xs px-3 py-1 border border-[var(--danger-border)] text-[var(--danger-text)] rounded hover:bg-[var(--danger-bg-strong)]">
            Retry
          </button>
        </div>
      ) : !data ? (
        <div className="text-sm text-[var(--text-muted)]">Loading server stats…</div>
      ) : (
        <ServerStatsPayload data={data} />
      )}
    </div>
  );
}

// Persistent banner that pops up the moment storage.set fails (almost always
// QuotaExceededError on iOS Safari, where the localStorage limit is ~5 MB).
// Until the user clears something, every later write keeps failing silently,
// which is what caused chapters to "go back to partial" after a force-update
// — the re-download wrote new data to in-memory React state but the
// localStorage write failed, so reloading reverted to the old snapshot.
function StorageWarning() {
  const { clearAttempts } = useApp();
  const [fail, setFail] = useState(null); // { key, quota, message } | null
  const [usage, setUsage] = useState(0);
  useEffect(() => {
    const handler = (e) => {
      setFail(e.detail || { message: 'Unknown' });
      setUsage(storage.usageBytes());
    };
    window.addEventListener('mcat:storage-fail', handler);
    return () => window.removeEventListener('mcat:storage-fail', handler);
  }, []);
  if (!fail) return null;
  const usedMB = (usage / 1024 / 1024).toFixed(1);
  return (
    <div
      className="fixed inset-x-0 z-[55] px-3 py-2 bg-[var(--danger-bg)] border-b border-[var(--danger-border)] text-[var(--danger-text)] flex flex-wrap items-center gap-2 text-xs"
      style={{ top: 'var(--mcat-header-h, 56px)' }}
    >
      <strong className="whitespace-nowrap">
        {fail.quota ? `Storage full (${usedMB} MB used)` : 'Could not save to storage'}
      </strong>
      <span className="flex-1 min-w-0">
        — your last chapter re-download didn't persist. After clearing, re-download from the Bank tab.
      </span>
      <button
        onClick={() => { if (confirm('Clear all quiz attempts? They are already synced to your account if you are signed in.')) { clearAttempts(); setFail(null); } }}
        className="shrink-0 px-2 py-1 rounded border border-[var(--danger-border)] hover:bg-[var(--danger-bg-strong)]"
      >
        Clear attempts
      </button>
      <button
        onClick={() => {
          if (!confirm('Drop the crash log + CARS/Connections payload caches? Safe — they are caches, not history.')) return;
          try { localStorage.removeItem('mcat:crashlog'); } catch {}
          try { localStorage.removeItem('mcat:carsCache'); } catch {}
          try { localStorage.removeItem('mcat:connectionsCache'); } catch {}
          try { localStorage.removeItem('mcat:connExplain'); } catch {}
          try { localStorage.removeItem('mcat:termDefs'); } catch {}
          setFail(null);
        }}
        className="shrink-0 px-2 py-1 rounded border border-[var(--danger-border)] hover:bg-[var(--danger-bg-strong)]"
      >
        Clear caches
      </button>
      <button
        onClick={() => setFail(null)}
        className="shrink-0 px-2 py-1 rounded hover:bg-[var(--danger-bg-strong)]"
        aria-label="Dismiss"
      >×</button>
    </div>
  );
}

function Shell() {
  const { apiKey, setApiKey, attempts, readOnly, files, extractions, questions, session, setSession, pendingSync, syncBusy, api, palette, mode, contributorMode } = useApp();
  const [tab, setTab] = useState('home');
  const [showAccount, setShowAccount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [bankHasUpdates, setBankHasUpdates] = useState(false);

  // Bank update indicator: compare the newest chapter's updated_at against the
  // last time the user reviewed the Bank tab.
  useEffect(() => {
    let cancelled = false;
    api.listChapters()
      .then((d) => {
        if (cancelled) return;
        const seen = storage.get(KEYS.bankSeen, 0);
        const newest = Math.max(0, ...(d.chapters || []).map((c) => c.updated_at || 0));
        setBankHasUpdates(newest > seen);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [api]);

  // BankTab dispatches this once the user has reviewed the change summary.
  useEffect(() => {
    const onSeen = () => setBankHasUpdates(false);
    window.addEventListener('mcat:bankSeen', onSeen);
    return () => window.removeEventListener('mcat:bankSeen', onSeen);
  }, []);

  // Home dot: today's CARS is ready but the user hasn't done it yet.
  // Also downloads (caches) today's set on app entry so it opens instantly / offline.
  const [carsReady, setCarsReady] = useState(false);
  const recheckCars = useCallback(() => {
    const d = todayStr();
    api.getCars(d)
      .then((res) => { setCarsCachePayload(d, res.payload); setCarsReady(!getCarsResults()[d]); })
      .catch(() => { setCarsReady(false); });
  }, [api]);
  useEffect(() => { recheckCars(); }, [recheckCars]);
  useEffect(() => {
    const onDone = () => setCarsReady(false);
    window.addEventListener('mcat:carsDone', onDone);
    return () => window.removeEventListener('mcat:carsDone', onDone);
  }, []);

  // Online-status heartbeat: ping on mount, when the tab becomes visible, and on a
  // slow interval while open. Each authenticated hit bumps users.last_seen on the
  // server, which drives the "who's online" indicator. Skipped when no session.
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    const beat = () => {
      if (cancelled || document.visibilityState !== 'visible') return;
      api.ping().catch(() => {});
    };
    beat();
    const onVis = () => { if (document.visibilityState === 'visible') beat(); };
    document.addEventListener('visibilitychange', onVis);
    const interval = setInterval(beat, 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); document.removeEventListener('visibilitychange', onVis); };
  }, [api, session]);

  // Global HUD click feedback: tap sound + short vibration on any non-content button.
  // Quiz answer buttons (MC/SinglePart) carry data-no-haptic so they don't double up
  // with the correct/wrong sound that already fires on submit.
  useEffect(() => {
    const onClick = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.hasAttribute('data-no-haptic')) return;
      hudClick();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  const hasLibrary = apiKey || readOnly || session;
  const tabs = [['lessons', 'Lessons'], ['study', 'Study'], ['home', 'Home'], ['stats', 'Stats'], ['banks', 'Bank']];
  useEffect(() => { if (readOnly) setTab('home'); else if (!hasLibrary) setTab('home'); }, [readOnly, hasLibrary]);
  useEffect(() => { setProfileUser(null); }, [tab]);

  const tabRef = useRef(tab);
  useEffect(() => { tabRef.current = tab; }, [tab]);

  const tabKeys = tabs.map(([k]) => k);

  // Per-tab scroll memory — ref, not state, so it never persists across
  // reloads. Switching saves the leaving tab's scrollY and restores the
  // entering tab's saved value (or 0 on first visit).
  const scrollMemoryRef = useRef({});

  const switchTab = useCallback((newTab) => {
    if (newTab === tabRef.current) return;
    scrollMemoryRef.current[tabRef.current] = window.scrollY;
    setTab(newTab);
  }, []);

  useLayoutEffect(() => {
    const target = scrollMemoryRef.current[tab] ?? 0;
    window.scrollTo(0, target);
  }, [tab]);

  const tabWrap = (k, baseClass) => ({
    className: baseClass,
    style: tab === k ? undefined : { display: 'none' },
  });
  const tabIs = (k) => tabKeys.includes(k);

  const fullyProcessed = files.filter((f) => extractions[f.file_id] && questions[f.file_id]?.mc && questions[f.file_id]?.short).length;

  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(56);
  useLayoutEffect(() => {
    const measure = () => {
      if (!headerRef.current) return;
      const h = headerRef.current.offsetHeight;
      setHeaderH(h);
      // Exposed for full-screen overlays (CARS / Connections) so their
      // top edge sits below the persistent tabs bar.
      document.documentElement.style.setProperty('--mcat-header-h', `${h}px`);
    };
    measure();
    // Track changes from tab wrapping, font load, orientation, etc. — not
    // just window resize.
    const ro = typeof ResizeObserver !== 'undefined' && headerRef.current
      ? new ResizeObserver(measure)
      : null;
    if (ro) ro.observe(headerRef.current);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <StorageWarning />
      <header
        ref={headerRef}
        className="fixed top-0 inset-x-0 z-40 border-b border-[var(--border-soft)] bg-[var(--bg)] px-3 sm:px-5 pb-2.5 sm:pb-3 flex flex-wrap items-center gap-y-2 gap-x-3"
        style={{
          // Push everything below the iPhone Dynamic Island / notch on
          // devices that report a non-zero safe area inset. Falls back to
          // the original py-2.5 / sm:py-3 padding on devices that don't
          // report one (most desktops + older iOS).
          paddingTop: 'max(0.625rem, calc(env(safe-area-inset-top) + 0.25rem))',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 order-1 flex-1">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
          <div className="font-semibold text-sm sm:text-base">MCAT Study</div>
          {readOnly
            ? <span className="text-[10px] sm:text-xs text-[var(--success-text)] bg-[var(--success-bg)] rounded px-1.5 sm:px-2 py-0.5">read-only</span>
            : <span className="hidden sm:inline text-xs text-[var(--text-faint)] font-mono">{MODEL}</span>}
        </div>
        <nav className="flex items-center justify-center gap-1 overflow-x-auto order-3 sm:order-2 w-full sm:w-auto">
          {tabs.map(([k, label]) => (
            <button
              key={k}
              onClick={() => switchTab(k)}
              className={`relative text-sm px-3 py-2 sm:py-1.5 rounded whitespace-nowrap shrink-0 ${tab === k
                ? 'bg-[var(--bg-hover)] text-[var(--text-strong)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-strong)]'}`}
            >
              {label}
              {((k === 'banks' && bankHasUpdates) || (k === 'home' && carsReady)) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--danger-border)]" />
              )}
            </button>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2 sm:gap-3 text-xs text-[var(--text-muted)] order-2 sm:order-3 flex-1">
          {session ? (
            <button
              onClick={() => setShowAccount((s) => !s)}
              className="px-2 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] flex items-center gap-1.5"
              title={pendingSync.length ? `${pendingSync.length} attempts pending sync` : 'Signed in'}
            >
              <span className="text-[var(--text-strong)]">@{session.username}</span>
              {(pendingSync.length > 0 || syncBusy) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning-text-strong)]" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowAccount((s) => !s)}
              className="px-2 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-strong)]"
            >
              Sign in
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
            title="Settings"
            className="w-9 h-9 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1.5 flex items-center justify-center border border-[var(--border)] rounded hover:bg-[var(--bg-hover)] text-[var(--text-strong)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>
      {/* Spacer pushes content below the fixed header */}
      <div style={{ height: headerH, flexShrink: 0 }} />

      <main className="flex-1 px-3 pb-3 pt-[17px] sm:px-6 sm:pb-6 sm:pt-[29px] overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          {tabIs('home') && (
            <div {...tabWrap('home', '')}>
              <HomeView onGoToStudy={() => switchTab('study')} />
            </div>
          )}
          {tabIs('lessons') && (
            <div {...tabWrap('lessons', 'space-y-4 sm:space-y-5')}>
              <LessonsView onGoToStudy={() => switchTab('study')} />
            </div>
          )}
          {tabIs('stats') && (
            <div {...tabWrap('stats', 'space-y-4 sm:space-y-5')}>
              {profileUser
                ? <UserProfile username={profileUser} onBack={() => setProfileUser(null)} />
                : (
                  <>
                    <McatPredictionCard />
                    {session && <ServerStatsView />}
                    <StatsView />
                  </>
                )}
            </div>
          )}
          {tabIs('banks') && (
            <div {...tabWrap('banks', 'space-y-4 sm:space-y-5')}>
              {/* Former Library controls, now at the top of the Bank tab. */}
              {contributorMode && !readOnly && apiKey && <UploadPanel />}
              {contributorMode && session && <PublishAllPanel />}
              {contributorMode && fullyProcessed > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => exportBank({ files, extractions, questions })}
                    className="text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] rounded"
                  >
                    Export data.json locally
                  </button>
                </div>
              )}
              {/* FlagFixesPanel is always visible so any user who flags a
                  question can run the fix pipeline on their own queue. */}
              <FlagFixesPanel />
              <BankTab />
            </div>
          )}
          {/* StudyView is always mounted (preserves quiz state). Hidden when
              not the active tab. */}
          <div style={tab === 'study' ? undefined : { display: 'none' }}>
            <StudyView />
          </div>
        </div>
      </main>

      {showAccount && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-24"
          onClick={() => setShowAccount(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <AccountPanel onClose={() => setShowAccount(false)} />
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20 overflow-y-auto"
          onClick={() => setShowSettings(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Root() {
  const { apiKey, readOnly, session } = useApp();
  return (apiKey || readOnly || session) ? <Shell /> : <ApiKeyGate />;
}

// Crash diagnostics now live in index.html as a plain <script> so they install
// BEFORE Babel parses this file. That way iOS Safari (no devtools) still sees a
// visible error banner even if app.js fails to parse or React fails to mount.

// One-time compress every existing uncompressed mcat:* key. Frees ~60–70%
// of localStorage for the 36+ chapter snapshots that older app versions
// stored uncompressed.
try { storage.migrateCompressIfNeeded(); } catch {}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AppProvider>
      <MoleculeProvider>
        <FigureProvider>
          <Root />
        </FigureProvider>
      </MoleculeProvider>
    </AppProvider>
  </ErrorBoundary>
);
