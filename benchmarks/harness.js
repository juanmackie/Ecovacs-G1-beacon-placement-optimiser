'use strict';
/*
 * Benchmark harness for the GOAT G1 beacon optimizer.
 * Runs every scenario in benchmarks/scenarios/ through the real optimizer
 * code extracted from index.html, then measures:
 *   - dual-coverage % (cells seen by 2+ beacons)
 *   - uncovered %    (cells seen by 0 beacons)
 *   - link validity  (beacon graph connected via <=45 m + clear LOS;
 *                     also counts in-range-but-blocked pairs and max pair dist)
 *   - obstacle gaps  (every beacon >5 m from every tall obstacle)
 *   - beacon count   (2..10)
 *   - optimizer runtime (ms, wall clock around optimizePlacement)
 *
 * Usage: node benchmarks/harness.js [--json]
 */
const fs = require('fs');
const path = require('path');
const { loadCore } = require('./core');

function loadScenarios() {
  const dir = path.join(__dirname, 'scenarios');
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => {
    const s = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    s.boundaries = s.boundaries.map(poly => poly.map(([x, y]) => ({ x, y })));
    s.obstacles = (s.obstacles || []).map(poly => poly.map(([x, y]) => ({ x, y })));
    s.stations = (s.stations || []).map(([x, y]) => ({ x, y }));
    return s;
  });
}

function linkMetrics(core, beacons, scale) {
  const n = beacons.length;
  const R = 45 * scale;
  let blockedPairs = 0, maxPair = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = core.fns.dist(beacons[i], beacons[j]);
      if (d > maxPair) maxPair = d;
      if (d <= R && !core.fns.losClear(beacons[i], beacons[j])) blockedPairs++;
    }
  }
  if (n < 2) return { valid: false, reachable: n, total: n, blockedPairs, maxPairDistM: maxPair };
  const seen = new Set([0]); const stack = [0];
  while (stack.length) {
    const i = stack.pop();
    for (let j = 0; j < n; j++) {
      if (!seen.has(j) && core.fns.linked(beacons[i], beacons[j])) { seen.add(j); stack.push(j); }
    }
  }
  return { valid: seen.size === n, reachable: seen.size, total: n, blockedPairs, maxPairDistM: maxPair };
}

function gapMetrics(core, beacons) {
  let minGap = Infinity;
  for (const b of beacons) {
    for (const poly of core.getState().obstacles) {
      const d = core.fns.m(core.fns.distToObstacle(b, poly));
      if (d < minGap) minGap = d;
    }
  }
  return { minGapM: beacons.length ? minGap : Infinity, ok: beacons.length ? minGap > 5 : true };
}

function runScenario(core, sc) {
  core.setState({ scale: sc.scale, boundaries: sc.boundaries, obstacles: sc.obstacles,
                  stations: sc.stations, beacons: [] });
  const t0 = process.hrtime.bigint();
  core.fns.optimizePlacement(sc.maxBeacons || 10);
  const runtimeMs = Number(process.hrtime.bigint() - t0) / 1e6;

  core.fns.buildGrid();
  core.fns.computeCoverage();
  const stats = core.fns.coverageStats();
  const beacons = core.getState().beacons;
  const links = linkMetrics(core, beacons, sc.scale);
  const gaps = gapMetrics(core, beacons);

  return {
    scenario: sc.name,
    dualPct: stats.dual * 100,
    uncoveredPct: stats.uncovered * 100,
    singlePct: stats.single * 100,
    cells: stats.n,
    beaconCount: beacons.length,
    countOk: beacons.length >= 2 && beacons.length <= 10,
    linksValid: links.valid,
    blockedPairs: links.blockedPairs,
    maxPairDistM: links.maxPairDistM,
    minObstacleGapM: gaps.minGapM === Infinity ? null : gaps.minGapM,
    gapOk: gaps.ok,
    runtimeMs,
    specMet: stats.dual * 100 >= 80 && stats.uncovered * 100 <= 10 && links.valid && gaps.ok &&
             beacons.length >= 2 && beacons.length <= 10,
  };
}

function main() {
  const core = loadCore();
  const scenarios = loadScenarios();
  const results = scenarios.map(sc => runScenario(core, sc));

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // human-readable table
  const cols = [
    ['scenario', 16], ['dual%', 7], ['uncov%', 8], ['beacons', 8],
    ['links', 6], ['blkPrs', 7], ['maxDst', 7], ['minGap', 7], ['ms', 8], ['spec', 5],
  ];
  console.log(cols.map(c => c[0].padEnd(c[1])).join(' '));
  for (const r of results) {
    const row = [
      r.scenario.padEnd(16),
      r.dualPct.toFixed(1).padEnd(7),
      r.uncoveredPct.toFixed(1).padEnd(8),
      String(r.beaconCount).padEnd(8),
      (r.linksValid ? 'OK' : 'FAIL').padEnd(6),
      String(r.blockedPairs).padEnd(7),
      r.maxPairDistM.toFixed(1).padEnd(7),
      r.minObstacleGapM == null ? 'n/a'.padEnd(7) : r.minObstacleGapM.toFixed(1).padEnd(7),
      r.runtimeMs.toFixed(0).padEnd(8),
      r.specMet ? 'PASS' : 'FAIL',
    ];
    console.log(row.join(' '));
  }
}

if (require.main === module) main();
module.exports = { loadScenarios, runScenario };
