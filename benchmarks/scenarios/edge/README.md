# Edge-case fixtures (not auto-loaded by the harness)

The harness reads only `benchmarks/scenarios/*.json` (flat). These live in a
subfolder on purpose: they are regression fixtures for manual runs, not part of
the keep/revert metric set (the infeasible lawn would pin worst-case dual at 0%).

| Fixture | Expected |
|---|---|
| `tiny-infeasible-10x8` | 0 beacons — genuinely no point is >5 m from the central obstacle (corners are exactly 5.0 m); optimizer must exit cleanly, not hang or place spec-violating beacons |
| `tiny-slivers-12x10` | ≥2 beacons, links OK, gap >5 m — valid spots exist only in thin corner slivers |
| `heavy-obstacles-30x30` | ~91% dual, 5 beacons, links OK, min gap 5.7 m |
| `big-open-120x80` | 6 beacons, 100% dual, links OK via hops ≤45 m (max pair 80 m is fine) |

To run one manually, move it up one level (`scenarios/`) temporarily and run
`node benchmarks/harness.js`, or adapt `/tmp`-style snippet from the session log.
