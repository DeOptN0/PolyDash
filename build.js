const fs = require('fs');
const path = require('path');

console.log("⚡ Compiling PolyDash (Beta)...");

// Read HTML shell
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// Read modular CSS
const css = fs.readFileSync(path.join(__dirname, 'src/ui.css'), 'utf-8');

// Read modular JS components in dependency order
const vehicleJs = fs.readFileSync(path.join(__dirname, 'src/vehicle.js'), 'utf-8');
const tracksJs = fs.readFileSync(path.join(__dirname, 'src/tracks.js'), 'utf-8');
const engineJs = fs.readFileSync(path.join(__dirname, 'src/engine.js'), 'utf-8');

// Bundle all JS modules into one sequence
const bundledJs = `
// PolyDash Compiled Source - v0.1.0-beta
${vehicleJs}
${tracksJs}
${engineJs}
`;

// Inject into HTML shell
html = html.replace('/* [[INJECT_CSS]] */', css);
html = html.replace('/* [[INJECT_JS]] */', bundledJs);

// Create dist directory if missing
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Output single file distribution
const outputPath = path.join(distDir, 'PolyDash-Beta.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log(`✅ Compilation successful! Distribution built to: ${outputPath}`);
