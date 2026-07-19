# ECOVACS GOAT G1 — Beacon Map Optimizer

Unofficial planning tool for UWB beacon placement on the ECOVACS GOAT G1 robotic mower. Draws your garden to scale, computes optimal beacon positions, and validates against Ecovacs' real spec — so you don't have to guess and remap.

## Why this exists

The GOAT G1 navigates by triangulating off UWB beacons. It needs to "see" **two beacons at once** across ≥80% of the lawn. Most DIY placements get this wrong by treating single-beacon coverage as sufficient. This tool enforces the actual spec from day one.

## The spec it enforces

| Rule | Value |
|---|---|
| Dual coverage (2+ beacons) | ≥ 80% of mowable area |
| No-signal zone | ≤ 10% of mowable area |
| Max beacon-to-beacon distance | 45 m with clear line of sight |
| Beacon-to-obstacle gap | > 5 m from obstacles > 60 cm tall |
| Station clearance | 2 m clear on sides and front, flat ground |
| Beacon count | Ships with 2, max 10 |

## Features

- **Scale calibration** — draw a reference line, enter real length, done
- **Canvas drawing** — trace lawn boundary, obstacles, station, and beacons as polygons and points
- **Auto-optimizer** — greedy marginal-score algorithm with local refinement, stops as soon as spec is met
- **Real-time validation** — live PASS/FAIL on all 5 specs as you edit
- **Coverage heatmap** — red (no signal), amber (1 beacon), green (2+)
- **Line-of-sight check** — obstacles between beacons or between beacon and lawn block signal
- **Beacon count & cost analysis** — shows whether your 2 included beacons are enough, or how many more to buy
- **Placement report** — print-friendly popup with coordinates, coverage table, and physical checklist
- **Save/load** — JSON export/import + auto-save to localStorage
- **Background image** — drop a site plan, satellite photo, or hand-drawn sketch underneath

## Quick start

1. Open `index.html` in any modern browser (no server needed)
2. *(Optional)* Upload a garden image
3. **Set scale** — pick Ref Line, click two ends of something you know the length of, enter metres, click Set Scale
4. **Draw the lawn** — click corners with the Lawn Boundary tool, double-click or Enter to close
5. **Add obstacles** — switch to Obstacle >60cm, draw polygons for trees, sheds, raised beds
6. **Place the station** — click where the charger sits
7. **Compute** — click Compute Optimal Placement

## Keyboard shortcuts

| Key | Action |
|---|---|
| `1`–`7` | Switch tools (Boundary, Obstacle, Station, Ref Line, Beacon, Move, Erase) |
| `Enter` / double-click | Finish polygon |
| `Backspace` | Undo last point |
| `Esc` | Cancel drawing |
| Scroll wheel | Zoom |
| Right / middle drag | Pan |
| `Alt` + left drag | Pan |

## Tools

| Tool | Click | Drag |
|---|---|---|
| Lawn Boundary | Add polygon corner | — |
| Obstacle >60cm | Add polygon corner | — |
| Station | Place charger point | — |
| Ref Line | Set first/second endpoint | — |
| Place Beacon | Drop beacon | — |
| Move / Edit | Pick up nearest element | Reposition |
| Erase | Delete nearest element | — |

## How the optimizer works

1. **Grid sampling** — mowable area is discretized into ~1 m cells (auto-scaled for large lawns)
2. **Candidate generation** — valid positions are every grid cell + boundary-inset points, filtered to be >5 m from obstacles
3. **Greedy placement** — each iteration picks the candidate that maximises marginal coverage gain, weighted to prioritise turning 1-beacon cells into 2-beacon cells
4. **Connectivity penalty** — candidates unreachable from existing beacons within 45 m + line of sight are down-weighted
5. **Early stop** — as soon as ≥80% dual coverage and ≤10% no-signal are met
6. **Local refinement** — two passes that nudge each beacon to a nearby candidate improving `dual×3 − uncovered×4`

## Coverage curve

The "How Many Beacons & Why" panel runs a separate greedy pass to plot how dual coverage grows with each additional beacon, so you can see whether 2 are enough or you need to buy more.

## Technical details

- Single self-contained HTML file (~1060 lines), no dependencies
- Pure vanilla JS + Canvas 2D, HiDPI-aware (devicePixelRatio scaling)
- State persisted to localStorage on every edit (auto-save falls back to geometry-only if the background image exceeds the storage quota)
- Project files are JSON with embedded base64 background images
- Optimizer caches the coverage curve per geometry revision, so editing beacons or typing a price doesn't re-run the full re-optimization

## Modeling notes

- The **45 m** beacon spacing limit is also used as the beacon's effective coverage radius — a planning assumption (Ecovacs specifies spacing, not a separate robot-to-beacon range), so coverage near the 45 m fringe is approximate.
- Draw the **house, fences and sheds as obstacles** even when they sit outside the mow area — obstacles block line-of-sight wherever they are.
- Beacons placed **outside the lawn boundary**, and in-range pairs **blocked by an obstacle**, show as **warnings**, not hard failures — they don't block the "✓ Meets Ecovacs spec" status but are flagged in the issue list. A missing station also passes (with a note).

## Sources

Rules verified from:
- [Ecovacs GOAT G1 FAQ](https://www.ecovacs.co.za/pages/goat-g1-faqs)
- [Official manual (ManualsLib)](https://www.manualslib.com/manual/3423177/Ecovacs-Goat-G1.html)
- [Techreviewer teardown](https://en.techreviewer.de/ecovacs-goat-g1-test/)

## Disclaimer

Unofficial planning aid. Always confirm beacon placement in the ECOVACS Home app during setup. Moving a beacon after mapping requires a full remap.
