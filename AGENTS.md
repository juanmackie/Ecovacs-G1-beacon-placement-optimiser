# Ecovacs G1 beacon placement optimiser agent contract

## Operating Standard

- Apply the global AGENTS.md (`~/.pi/agent/AGENTS.md`, loaded automatically) as the operating standard.
- This file holds repository-specific facts. They override global defaults (commands, runners, paths, constraints) but cannot weaken a global approval, security, or secrets rule.
- Read this file, then `benchmarks/AGENTS.md` (when touching `benchmarks/`), before editing. The nearest applicable contract plus every parent above it governs the work.

## Scope and Ownership

- `index.html` — the entire app: a single self-contained HTML file (~1150 lines: CSS + vanilla JS + Canvas 2D). No build step, no server, no dependencies; opening the file in a browser is the whole runtime. It owns drawing tools, scale calibration, the coverage grid, the greedy optimizer, 5-spec validation, heatmap rendering, save/load, and the print report.
- `README.md` — user-facing overview, quick start, keyboard shortcuts, G1 spec table, optimizer explanation, modeling notes, and source links. Keep it in sync with user-visible behavior.
- `benchmarks/` — Node-based test harness (`harness.js`), extracted optimizer code (`core.js`), and synthetic scenarios (`scenarios/*.json`, `scenarios/edge/`). Owned by `benchmarks/AGENTS.md`.
- `MEMORY.md` — small project memory index.
- `.gitignore` — forbids plan.md, .env, *.local.md, rules documents, `.claude/settings.local.json`, and local/editor noise. Never commit those.
- `autoresearch/` — experiment-session artifacts; not part of the shipped app, do not edit casually.

## Constraints

- No build, no framework, no new dependencies: the app must stay a single editable `index.html` runnable by double-click. Do not introduce package managers, bundlers, or external assets that break offline use.
- The optimizer must remain deterministic: same input geometry produces the same placement. Verify determinism when touching candidate generation, greedy selection, or refinement (the coverage curve is cached per geometry revision — keep cache invalidation correct).
- Ecovacs GOAT G1 spec encoded in validation: beacons ≥45 m apart with line of sight; ≥80% of mowable area dual-covered (2+ beacons); ≤10% no-signal; beacons >5 m from obstacles taller than 60 cm; station needs 2 m clear on sides/front; ships with 2 beacons, max 10. Do not weaken these thresholds.
- The 45 m spacing limit is also used as the effective beacon coverage radius — a documented modeling assumption (Ecovacs specifies spacing, not robot-to-beacon range); heatmap is approximate near the 45 m fringe. Keep this documented in the Help modal and README.
- Obstacles anywhere block line of sight, including outside the lawn boundary; users draw house/fences as obstacles even outside the mow area. Preserve this behavior.
- Status semantics are deliberate: out-of-bounds beacons, in-range pairs blocked by obstacles, and a missing station are warnings, not failures. `allOK` (✓ Meets spec) requires dual-coverage, no-signal, link connectivity, obstacle gap, and station clearance only. Do not silently promote warnings to failures.
- Optimizer invariants: mandatory minimum of 2 beacons; anti-cluster spacing floor scaled to the lawn diagonal so small lawns still get 2; candidates restricted to mowable lawn (outside-boundary candidates flagged as warnings).
- Save/load: project files are JSON with embedded base64 background images; state auto-saves to localStorage with a quota fallback to geometry-only. Preserve import/export round-trip compatibility with existing saved files.
- No secrets, credentials, or real site data belong in the repo.

## Verification

- Automated (required before/after any optimizer change): `node benchmarks/harness.js` — all scenarios must report `links OK`, `minGap > 5.0`, and `spec PASS`. See `benchmarks/AGENTS.md` for scenario conventions; add an edge scenario when fixing a geometry edge case.
- There is no other automated harness (no package.json, no test runner, no linter). For UI work, hand-verify in a browser by exercising the real journey: open `index.html`, set scale via a reference line, draw a lawn boundary and obstacles, place the station, run Compute Optimal Placement, confirm the validation panel shows PASS on all 5 checks, and test JSON export/import round-trip. A file edit alone is not evidence of correctness.
- After any optimizer edit, also re-run determinism: same scenario twice, identical output.

## Documentation index

- `README.md` — usage, spec table, optimizer explanation; update when user-visible behavior changes.
- `MEMORY.md` — project memory index; keep as context, not as rules.
- `benchmarks/AGENTS.md` — read before any `benchmarks/` edit.
- Durable contracts live at the nearest owning boundary; update this file when app-wide invariants, scope, or verification change, and do not duplicate rules across files.

## Known gaps

- No screenshot or headless-browser check exists; visual/canvas rendering is verified only by hand.
- The benchmarks harness runs optimizer logic in a vm sandbox, not the DOM/canvas layers.

## Child contracts

- `benchmarks/AGENTS.md` — owns the harness, core extraction, and scenario conventions. It refines this file and cannot weaken the parent policy (`~/.pi/agent/AGENTS.md`).
