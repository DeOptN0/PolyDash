# PolyDash Asset and Content Guide

Use these exact names for your PNG files. The game expects the asset paths in the JSON catalog.

Car file names:
- `assets/cars/starter-gt.png`
- `assets/cars/icebreaker-s.png`
- `assets/cars/solar-v8.png`
- `assets/cars/night-volt.png`

Track preview file names:
- `assets/tracks/harbor-loop.png`
- `assets/tracks/canyon-eclipse.png`
- `assets/tracks/skyline-circuit.png`
- `assets/tracks/wetlands-run.png`

How to use them:
1. Create a PNG for each file name.
2. Keep them in the matching folder.
3. Copy the same filename into the `asset` field in the config.

Example catalog format:
```json
{
  "id": "icebreaker",
  "name": "Icebreaker S",
  "color": "#60a5fa",
  "accent": "#e0f2fe",
  "asset": "cars/icebreaker-s.png",
  "unlockTrack": "canyon-eclipse",
  "unlockTime": 68
}
```

If you want a quick way to add cars, copy one of the entries from `assets/example-cars.json` and `assets/example-tracks.json`.
