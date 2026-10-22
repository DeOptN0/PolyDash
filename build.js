<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PolyDash - Beta v0.1.0</title>
  <style>
    /* [[INJECT_CSS]] */
  </style>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js"></script>
</head>
<body>
  <div id="hud">
    <div class="title">POLYDASH <span style="color:#7dd3fc">BETA</span></div>
    <div class="speed-row">
      <span id="speed-display">0</span>
      <span class="unit">KM/H</span>
    </div>
    <div id="lap-display">Lap 1 • 0:00.0 • Best --:--.-</div>
    <div id="status-text">Ready</div>
    <div id="controls-hint">W / S drive · A / D steer · SPACE brake · R reset</div>
  </div>

  <div id="version-badge">v0.1.0-beta</div>
  <div id="canvas-container"></div>

  <script>
    /* [[INJECT_JS]] */
  </script>
</body>
</html>
