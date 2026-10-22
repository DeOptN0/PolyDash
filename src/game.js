const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const params = new URLSearchParams(window.location.search);
const branch = params.get('branch') || 'improve-polydash';
const versionEl = document.getElementById('version');
versionEl.textContent = `branch: ${branch}`;

const speedEl = document.getElementById('speed');
const statusEl = document.getElementById('status');
const lapEl = document.getElementById('lap');
const boostEl = document.getElementById('boost');
const boostFill = document.getElementById('boost-fill');

const keys = {};

const state = {
  width: 0,
  height: 0,
  last: 0,
  lap: 1,
  maxLaps: 3,
  bestLap: null,
  lapStart: 0,
  finished: false,
  message: 'READY'
};

const player = {
  x: 0,
  y: -260,
  vx: 0,
  vy: 0,
  angle: -Math.PI / 2,
  radius: 18,
  speed: 0,
  maxSpeed: 420,
  accel: 320,
  turnSpeed: 2.8,
  drag: 0.985,
  boost: 100,
  boostActive: false,
  invuln: 0
};

const world = {
  trackRadius: 410,
  ringInset: 140,
  width: 2200,
  height: 1600
};

const checkpoints = [
  { x: 0, y: -430, angle: -Math.PI / 2 },
  { x: 360, y: -70, angle: 0 },
  { x: 0, y: 430, angle: Math.PI / 2 },
  { x: -360, y: -70, angle: Math.PI }
];

let checkpointIndex = 0;
const boostPads = [
  { x: 240, y: 190, r: 16, active: true },
  { x: -240, y: -210, r: 16, active: true },
  { x: 0, y: 280, r: 16, active: true }
];

const traffic = [
  { x: 0, y: 260, angle: 0, speed: 90, radius: 12, color: '#fca5a5' },
  { x: -290, y: -210, angle: Math.PI / 2, speed: 100, radius: 12, color: '#fbbf24' },
  { x: 220, y: -360, angle: Math.PI, speed: 110, radius: 12, color: '#a78bfa' }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function resetPlayer() {
  player.x = 0;
  player.y = -260;
  player.vx = 0;
  player.vy = 0;
  player.angle = -Math.PI / 2;
  player.speed = 0;
  player.boost = 100;
  player.boostActive = false;
  player.invuln = 0.6;
  state.message = 'READY';
}

function resetLapTimer() {
  state.lapStart = performance.now();
}

function updateHud() {
  speedEl.textContent = String(Math.round(player.speed * 0.9));
  lapEl.textContent = `lap ${state.lap} / ${state.maxLaps}`;
  boostEl.textContent = `boost ${Math.round(player.boost)}%`;
  boostFill.style.width = `${player.boost}%`;
  statusEl.textContent = state.message;
}

function handleBoostPickup() {
  for (const pad of boostPads) {
    if (!pad.active) continue;
    if (distance(player.x, player.y, pad.x, pad.y) < pad.r + player.radius + 10) {
      pad.active = false;
      player.boost = clamp(player.boost + 35, 0, 100);
      state.message = 'BOOST!';
      setTimeout(() => {
        if (!state.finished) state.message = 'READY';
      }, 400);
    }
  }
}

function handleTraffic() {
  for (const bot of traffic) {
    if (distance(player.x, player.y, bot.x, bot.y) < player.radius + bot.radius + 8) {
      if (player.invuln <= 0) {
        player.speed *= 0.35;
        player.vx *= 0.4;
        player.vy *= 0.4;
        player.invuln = 1.2;
        state.message = 'CRASH';
        setTimeout(() => {
          if (!state.finished) state.message = 'READY';
        }, 500);
      }
    }

    bot.angle += Math.sin(performance.now() * 0.0007 + bot.x) * 0.02;
    const drift = Math.sin(performance.now() * 0.001 + bot.x * 0.01) * 0.7;
    bot.x += Math.cos(bot.angle + drift) * bot.speed * 0.016;
    bot.y += Math.sin(bot.angle + drift) * bot.speed * 0.016;

    if (Math.abs(bot.x) > world.width * 0.55 || Math.abs(bot.y) > world.height * 0.55) {
      bot.x *= -0.9;
      bot.y *= -0.9;
    }
  }
}

function handleCheckpoints() {
  const target = checkpoints[checkpointIndex];
  if (distance(player.x, player.y, target.x, target.y) < 32) {
    checkpointIndex += 1;

    if (checkpointIndex >= checkpoints.length) {
      checkpointIndex = 0;
      const lapTime = (performance.now() - state.lapStart) / 1000;
      if (state.bestLap === null || lapTime < state.bestLap) {
        state.bestLap = lapTime;
      }
      state.lap += 1;

      if (state.lap > state.maxLaps) {
        state.finished = true;
        state.message = 'RACE COMPLETE';
        state.lap = state.maxLaps;
      } else {
        state.message = 'LAP CLEAR';
        resetLapTimer();
      }
    } else {
      state.message = 'CHECKPOINT';
    }
  }
}

function update(dt) {
  if (state.finished) {
    player.vx *= 0.985;
    player.vy *= 0.985;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    updateHud();
    return;
  }

  const forward = (keys.w || keys.arrowup) ? 1 : 0;
  const reverse = (keys.s || keys.arrowdown) ? 1 : 0;
  const left = (keys.a || keys.arrowleft) ? 1 : 0;
  const right = (keys.d || keys.arrowright) ? 1 : 0;

  const throttle = forward - reverse;
  if (throttle !== 0) {
    const boostFactor = (keys.shift || keys[' ']) ? 1.8 : 1;
    player.speed += throttle * player.accel * boostFactor * dt;
  }

  if (left || right) {
    const steer = (right - left) * player.turnSpeed * dt * (0.5 + Math.abs(player.speed) / 220);
    player.angle += steer;
  }

  if (keys.shift && player.boost > 0) {
    player.boostActive = true;
    player.speed += 180 * dt;
    player.boost = Math.max(0, player.boost - 28 * dt);
  } else {
    player.boostActive = false;
    player.boost = Math.min(100, player.boost + 16 * dt);
  }

  if (Math.abs(player.speed) > 0.1) {
    player.vx = Math.cos(player.angle) * player.speed;
    player.vy = Math.sin(player.angle) * player.speed;
  }

  player.speed *= player.drag;
  player.speed = clamp(player.speed, -120, player.maxSpeed + 80);

  const trackDist = Math.hypot(player.x, player.y);
  if (trackDist > world.trackRadius + world.ringInset) {
    player.speed *= 0.97;
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;

  const border = 720;
  player.x = clamp(player.x, -border, border);
  player.y = clamp(player.y, -border, border);

  if (player.invuln > 0) player.invuln -= dt;

  handleBoostPickup();
  handleTraffic();
  handleCheckpoints();
  updateHud();
}

function resize() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawBackground() {
  const sky = ctx.createRadialGradient(0, 0, 80, 0, 0, 900);
  sky.addColorStop(0, '#132d47');
  sky.addColorStop(0.6, '#0b1728');
  sky.addColorStop(1, '#050b14');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, state.width, state.height);

  const cx = state.width / 2;
  const cy = state.height / 2;
  ctx.save();
  ctx.translate(cx, cy);

  const grid = 70;
  ctx.strokeStyle = 'rgba(125,211,252,0.06)';
  ctx.lineWidth = 1;
  for (let x = -800; x <= 800; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, -800);
    ctx.lineTo(x, 800);
    ctx.stroke();
  }
  for (let y = -800; y <= 800; y += grid) {
    ctx.beginPath();
    ctx.moveTo(-800, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }

  ctx.translate(-player.x * 0.8, -player.y * 0.8);

  ctx.fillStyle = '#101827';
  ctx.beginPath();
  ctx.arc(0, 0, 760, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 52;
  ctx.beginPath();
  ctx.arc(0, 0, 410, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 8;
  ctx.setLineDash([30, 26]);
  ctx.beginPath();
  ctx.arc(0, 0, 410, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 525, 0, Math.PI * 2);
  ctx.stroke();

  for (const pad of boostPads) {
    if (!pad.active) continue;
    ctx.save();
    ctx.translate(pad.x, pad.y);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(-14, -14, 28, 28);
    ctx.restore();
  }

  for (let i = 0; i < checkpoints.length; i++) {
    const cp = checkpoints[i];
    const active = i === checkpointIndex;
    ctx.save();
    ctx.translate(cp.x, cp.y);
    ctx.strokeStyle = active ? '#67e8f9' : '#f8fafc';
    ctx.lineWidth = active ? 4 : 2;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = active ? 'rgba(103,232,249,0.2)' : 'rgba(248,250,252,0.1)';
    ctx.fill();
    ctx.restore();
  }

  for (const bot of traffic) {
    ctx.save();
    ctx.translate(bot.x, bot.y);
    ctx.rotate(bot.angle);
    ctx.fillStyle = bot.color;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-14, 10);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, -10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawPlayer() {
  const cx = state.width / 2;
  const cy = state.height / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.translate(-player.x * 0.8, -player.y * 0.8);
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  if (player.invuln > 0) {
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#67e8f9';
  }

  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-12, -12);
  ctx.lineTo(-10, 0);
  ctx.lineTo(-12, 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#67e8f9';
  ctx.fillRect(-8, -4, 14, 8);

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, state.width, state.height);
  drawBackground();
  drawPlayer();
}

function animate(ts) {
  const dt = Math.min((ts - state.last) / 1000 || 0.016, 0.033);
  state.last = ts;
  update(dt);
  draw();
  requestAnimationFrame(animate);
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  keys[key] = true;

  if (key === 'r') {
    checkpointIndex = 0;
    state.lap = 1;
    state.finished = false;
    state.message = 'READY';
    resetPlayer();
    resetLapTimer();
  }
});

window.addEventListener('keyup', (event) => {
  keys[event.key.toLowerCase()] = false;
});

window.addEventListener('resize', resize);

resize();
resetPlayer();
resetLapTimer();
updateHud();
requestAnimationFrame(animate);
