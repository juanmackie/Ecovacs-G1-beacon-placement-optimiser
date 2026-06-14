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
- **File**: `ecovacs_goat_g1_beacon_optimizer.html` — the entire app (~1005 lines)
- **Data**: `MEMORY.md` — memory index for project context
- **Config**: `.claude/settings.local.json` — Claude permissions

## Architecture

The app is a self-contained single-file tool with these major sections inside the `<script>` block:

| Section | Lines (approx) | Responsibility |
|---|---|---|
| Constants | 332–340 | Range (45m), max beacons (10), coverage targets (80%/10%), grid resolution |
| State | 343–360 | Canvas, zoom/pan, polygons, beacons, scale, grid |
| Helpers | 363–415 | Coordinate transforms, point-in-polygon, line-of-sight, obstacle distance |
| Tools & Input | 417–508 | Tool switching, pointer events, polygon drawing, keyboard shortcuts |
| Scale | 527–542 | Reference line to real-world scale conversion |
| Coverage Grid | 544–572 | Sample mowable cells, count beacon coverage per cell |
| Optimizer | 574–671 | Candidate generation, greedy marginal-score placement, local refine |
| Validation | 673–755 | Check 5 specs: dual coverage, no-signal, link, obstacle gap, station |
| Rendering | 824–912 | Canvas draw: heatmap, polygons, beacons, links, grid |
| Save/Load | 934–960 | JSON serialize, localStorage, file export/import |
| Report | 962–996 | Print-friendly placement report in a new window |

## Key Ecovacs GOAT G1 Specs

- Beacons communicate via UWB; max 45m apart with line of sight
- ≥80% of lawn must be covered by 2+ beacons simultaneously
- ≤10% of lawn may have zero beacon signal
- Beacons must be >5m from obstacles taller than 60cm
- Station needs 2m clear on sides and front, flat lawn, grass ≤6cm
- Ships with 2 beacons; max 10 per mower
- Moving a beacon after mapping requires full remap

## Verification

- Open `ecovacs_goat_g1_beacon_optimizer.html` in a browser
- Draw a boundary, set scale, place beacons, run optimizer
- Confirm the validation panel shows PASS for all 5 checks
- Test import/export round-trip

## Child DOX Index

| Child | Scope |
|---|---|
| `ecovacs_goat_g1_beacon_optimizer.html` | Single-file beacon optimizer app (CSS + JS + canvas + optimizer algorithm) |
| `README.md` | Project overview, usage guide, specs reference |
