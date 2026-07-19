# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

## Project Overview

- **Purpose**: Beacon placement optimizer for the ECOVACS GOAT G1 robotic mower
- **Tech**: Single-file HTML app (HTML + CSS + vanilla JS, no build step)
- **File**: `index.html` — the entire app (~1063 lines)
- **Data**: `MEMORY.md` — memory index for project context
- **Config**: `.claude/settings.local.json` — Claude permissions

## Architecture

The app is a self-contained single-file tool with these major sections inside the `<script>` block:

| Section | Lines (approx) | Responsibility |
|---|---|---|
| Constants | 332–342 | Range (45m), max beacons (10), coverage targets (80%/10%), grid resolution |
| State | 343–364 | Canvas, zoom/pan, polygons, beacons, scale, grid, geom-rev cache flag |
| Helpers | 365–419 | Coordinate transforms, point-in-polygon, line-of-sight, obstacle distance |
| Tools & Input | 420–538 | Tool switching, file upload, resize (DPR-aware), pointer events, polygon drawing, keyboard shortcuts |
| Scale | 539–556 | Reference line → real-world scale conversion |
| Coverage Grid | 557–586 | Sample mowable cells, count beacon coverage per cell |
| Optimizer | 587–699 | Candidate generation (both inset normals), greedy marginal-score placement, local refine (capped), coverage curve |
| Validation | 700–810 | Check 5 specs: dual coverage, no-signal, link, obstacle gap, station |
| Justification | 811–860 | "How many beacons & why" cost / coverage-curve panel |
| Rendering | 861–950 | Canvas draw: heatmap, polygons, beacons, links, grid |
| UI Wires | 951–975 | Event listeners, zoom controls (centre-anchored), flash/banner |
| Save / Load | 976–1018 | JSON serialize (persists checkbox states), localStorage (quota fallback), file export/import |
| Report | 1019–1055 | Print-friendly placement report in a new window (popup-blocker safe) |

## Key Ecovacs GOAT G1 Specs

- Beacons communicate via UWB; max 45m apart with line of sight
- ≥80% of lawn must be covered by 2+ beacons simultaneously
- ≤10% of lawn may have zero beacon signal
- Beacons must be >5m from obstacles taller than 60cm
- Station needs 2m clear on sides and front, flat lawn, grass ≤6cm
- Ships with 2 beacons; max 10 per mower
- Moving a beacon after mapping requires full remap

## Modeling & Validation Notes

- The app uses the **45 m beacon spacing limit as the effective beacon coverage radius** — a modeling assumption (Ecovacs specifies spacing, not a separate robot-to-beacon range); heatmap is approximate near the 45 m fringe. Documented in the Help modal.
- Obstacles anywhere block line-of-sight, including those drawn outside the lawn boundary; users should draw the house/fences as obstacles even outside the mow area.
- **Out-of-bounds beacons and blocked in-range pairs are warnings, not failures.** `allOK` (the ✓ Meets spec status) requires dual-coverage, no-signal, link connectivity, obstacle gap, and station clearance — but a missing station passes (with a note) and an out-of-bounds/blocked beacon only adds a warning line.
- Optimizer places a **mandatory 2 beacons** minimum; the anti-cluster spacing floor is scaled to the lawn diagonal so small lawns still get 2.
- Beacon candidates are restricted to mowable lawn (candidates outside the boundary are flagged as warnings).

## Verification

- Open `index.html` in a browser
- Draw a boundary, set scale, place beacons, run optimizer
- Confirm the validation panel shows PASS for all 5 checks
- Test import/export round-trip

## Child DOX Index

| Child | Scope |
|---|---|
| `index.html` | Single-file beacon optimizer app (CSS + JS + canvas + optimizer algorithm) |
| `README.md` | Project overview, usage guide, specs reference |
