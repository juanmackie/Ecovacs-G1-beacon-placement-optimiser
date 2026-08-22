'use strict';
/*
 * Loads the optimizer core out of index.html without modifying it.
 * Extracts the single inline <script> block and evaluates it in a vm sandbox
 * with DOM/canvas stubs, then exports the geometry + optimizer functions via
 * an appended __CORE__ shim (the shim closes over the script's lexical scope).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function extractScript(html) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('No <script> block found in index.html');
  return m[1];
}

function makeEl(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    className: '',
    value: '10',
    style: {},
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {},
    removeEventListener() {},
    getBoundingClientRect() { return { left: 0, top: 0, width: 800, height: 600 }; },
    appendChild() {},
  };
}

function makeCtxStub() {
  // Canvas 2D context: any property readable -> no-op fn; any property writable.
  return new Proxy({}, {
    get(t, p) { if (p in t) return t[p]; return function () {}; },
    set(t, p, v) { t[p] = v; return true; },
  });
}

function buildSandbox() {
  const els = {};
  const canvas = makeEl('mapCanvas');
  canvas.getContext = () => makeCtxStub();
  const sandbox = {
    console,
    document: {
      getElementById(id) { if (id === 'mapCanvas') return canvas; return els[id] || (els[id] = makeEl(id)); },
      querySelectorAll() { return []; },
      addEventListener() {},
      createElement(tag) { return makeEl(tag); },
      body: makeEl('body'),
    },
    window: { addEventListener() {}, devicePixelRatio: 1, open() { return null; } },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout() { return 0; },
    clearTimeout() {},
    Image: function ImageStub() { this.onload = null; this.onerror = null; this.src = ''; },
    FileReader: function FileReaderStub() { this.readAsText = function () {}; this.readAsDataURL = function () {}; },
    requestAnimationFrame() {},
  };
  sandbox.window.document = sandbox.document;
  sandbox.globalThis = sandbox;
  return sandbox;
}

// Appended to the extracted script so it can export scope-local bindings.
const SHIM = `
;globalThis.__CORE__ = {
  constants: { BEACON_RANGE_M, MAX_BEACONS, INCLUDED_BEACONS, TALL_OBSTACLE_GAP_M,
               DUAL_TARGET, UNCOVERED_MAX, STATION_CLEAR_M, GRID_M, MAX_CELLS },
  fns: { dist, m, isInsidePoly, pointToSegment, distToObstacle, segIntersect, losClear,
         isMowable, insideAnyBoundary, insideAnyObstacle, buildGrid, generateCandidates,
         candidateCoverage, linked, optimizePlacement, computeCoverage, coverageStats,
         localRefine, coverageCurve, tally },
  getState: () => ({ scale, boundaries, obstacles, stations, beacons,
                     grid: grid.slice(), gridStepM }),
  setState: (s) => {
    if (typeof s.scale === 'number') scale = s.scale;
    if (s.boundaries) boundaries = s.boundaries;
    if (s.obstacles) obstacles = s.obstacles;
    if (s.stations) stations = s.stations;
    if (s.beacons) beacons = s.beacons;
    geomRev++; grid = []; coverageCounts = [];
  }
};`;

function loadCore() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const src = extractScript(html);
  const ctx = vm.createContext(buildSandbox());
  vm.runInContext(src + SHIM, ctx, { filename: 'index.html<script>' });
  return ctx.__CORE__;
}

module.exports = { loadCore };
