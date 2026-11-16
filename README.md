# HELIANTHUS — 3D Solar Mobility Configurator

Interactive web prototype for the Helianthus deployable PV + BESS electric truck.

## Run in Codex or your local editor

```bash
npm install
npm run dev
```

Open the Vite URL (usually http://localhost:5173). Or use `python -m http.server 8000` and open http://localhost:8000. Three.js loads via a pinned CDN import map, so the browser requires internet access.

## Implemented controls

- Rotate/zoom the truck with mouse/touch (OrbitControls).
- Four 0° → 30° → 65° → 90° wing deployment presets.
- Continuous automatic deployment/retraction loop.
- Independent left/right panel sliders when synchronization is disabled.
- Roof, left, and right solar panels arranged 4 × 3 (12 modules total).
- Each side wing is hinged on its own upper trailer corner. A panel never detaches from the hinge.
- Mechanical-style telescoping struts are dynamically connected between fixed vehicle points and moving wings.
- Single-axis ±30° tracker for the complete 12-module surface; enabled only after both sides are fully deployed.
- Side-section kinematic diagram; side, rear, top and isometric camera presets.

## Tests / builds

```bash
npm test
npm run build
```

Pure rotation and timing calculations live in `src/kinematics.js`, with tests in `tests/kinematics.test.js`.

## Coordinate convention

Vehicle length = X, height = Y, width = Z. Each wing rotates around its top-longitudinal roof edge. At 0°, the wing extends vertically down along the container wall. At 90°, it extends horizontally outward in the same plane as the central roof strip.

## Codex follow-up work

Replace the illustrative truck with the user's Blender/Hi3D GLB; parameterize real panel dimensions, hinge mounting geometry and actuator strokes; test physical clearances, collision, wind-load limits and safe-stow controls; then add browser-level E2E tests.

The current prototype is conceptual visualization, **not** certified mechanical or electrical design.
