# 🏎️ PolyDash (Beta)

**PolyDash** is an open-source, web-based 3D low-poly arcade time-trial racing game heavily inspired by **PolyTrack** (by Kodub). 

Built using **Three.js** for WebGL rendering and **Cannon.js** for 3D physics, PolyDash delivers high-speed driving mechanics, responsive vehicle handling, and a modular architecture designed for easy customization and extension.

---

## ✨ Features

- **PolyTrack-Inspired Gameplay:** Arcade driving physics, sharp handling, suspension dynamics, and time-trial racing loops.
- **Low-Poly Art Style:** Clean, minimalist 3D graphics rendered with WebGL.
- **Modular Codebase:** Organized into clean JS modules for vehicles, tracks, UI, and physics.
- **Single-File Distribution Compiler:** Includes a Node.js build script (`build.js`) that automatically compiles all code, styles, and assets into a single, zero-dependency `PolyDash-Beta.html` file ready for sharing or GitHub Pages hosting.

---

## 🛠️ Project Structure

```text
polydash/
├── src/
│   ├── engine.js       # Main scene setup, animation loop, camera follow, and input
│   ├── vehicle.js      # Car model generation, wheels, and RaycastVehicle physics
│   ├── tracks.js       # Modular track piece logic and colliders
│   └── ui.css          # HUD styling, speedometer, and UI overlays
├── dist/               # Compiled standalone single-file builds
│   └── PolyDash-Beta.html
├── index.html          # Base HTML template shell
├── build.js            # Node.js bundle compiler
└── package.json        # Project metadata & build scripts
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/polydash.git
   cd polydash
   ```

2. Run or test the game locally:
   Open `dist/PolyDash-Beta.html` directly in any web browser, or serve it locally using a server extension like Live Server in VS Code.

---

## 📦 Building the Single-File Release

If you edit any files inside the `src/` directory, re-compile the single-file distribution by running:

```bash
npm run build
```

This updates `dist/PolyDash-Beta.html` with your latest changes.

---

## 🎮 Controls

| Action | Key / Input |
| :--- | :--- |
| **Accelerate** | `W` / `Up Arrow` |
| **Reverse** | `S` / `Down Arrow` |
| **Steer Left / Right** | `A` / `D` or `Left` / `Right Arrow` |
| **Brake / Drift** | `Spacebar` |

---

## 🗺️ Roadmap & Planned Features

- [ ] Interactive 3D Track Editor (grid-snapping piece builder).
- [ ] Track Import & Export via string code serialization (like PolyTrack).
- [ ] Sector checkpoints and lap timer UI.
- [ ] Vehicle customization (colors, wheels, and body kits).
- [ ] Global & Local Leaderboards.

---

## 📜 License & Credits

- **PolyDash** is an independent open-source project licensed under the [MIT License](LICENSE).
- Inspired by **PolyTrack** created by [Kodub](https://kodub.itch.io/).
- Built using [Three.js](https://threejs.org/) and [Cannon.js](https://github.com/schteppe/cannon.js).