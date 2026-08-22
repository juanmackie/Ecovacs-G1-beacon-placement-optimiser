# benchmarks — Optimizer test harness

## Purpose

Loads the optimizer core out of the single-file `index.html` without modifying it, and measures placement quality against synthetic garden scenarios. This is the verification framework for optimizer changes; run it before and after any edit to the optimizer section.

## Ownership

Owned by whoever changes the optimizer in `index.html`. Parent contract: root `AGENTS.md`.

## Local Contracts

- `index.html` is never edited to make testing easier. `core.js` extracts the inline `<script>` and evals it in a `vm` sandbox with DOM/canvas stubs, exporting internals via an appended `__CORE__` shim.
- The shim at the bottom of `core.js` must list every function/constant the harness needs. If `index.html` renames or moves one of these functions, update the shim in the same change.
- Scenarios are JSON in `scenarios/`: `scale` (px per metre; `1` means coordinates are metres), `boundaries`/`obstacles` as `[[x,y],...]` polygons, `stations`, `maxBeacons`.

## Work Guidance

- Metrics measured per scenario: dual-coverage %, uncovered %, link validity (beacon graph connected via ≤45 m + LOS), blocked in-range pairs, min obstacle gap (strict >5 m), beacon count (2–10), optimizer runtime (ms around `optimizePlacement`).
- Runtime on this machine is noisy (±15%); decide keep/revert on repeated runs or the micro-benchmark pattern (median of ≥11 runs of the hot function), not a single harness run.
- When adding scenarios, keep total grid cells under `MAX_CELLS` (2200) or grid step auto-coarsens and results shift.

## Verification

```
node benchmarks/harness.js        # human-readable table
node benchmarks/harness.js --json # machine-readable
```

All rows must show `links OK`, `minGap > 5.0`, beacon count 2–10, and `spec PASS` for a healthy tree.

## Child DOX Index

| Child | Scope |
|---|---|
| `scenarios/` | Synthetic garden inputs (JSON) |
