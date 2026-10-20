// --- MAIN GAME ENGINE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e14);
scene.fog = new THREE.FogExp2(0x0e0e14, 0.008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight.position.set(40, 60, 40);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Initialize Car and Track
const car = createVehicle(scene, world);
buildDefaultTrack(scene, world);

// Input Handling
const keys = { w: false, a: false, s: false, d: false, ' ': false };
window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; });

// Game Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  // Controls & Steering
  const maxSteer = 0.45;
  const maxForce = 1000;
  const brakeForce = 40;

  car.vehicle.setSteeringValue(keys.a ? maxSteer : (keys.d ? -maxSteer : 0), 0);
  car.vehicle.setSteeringValue(keys.a ? maxSteer : (keys.d ? -maxSteer : 0), 1);

  const engineForce = keys.w ? -maxForce : (keys.s ? maxForce : 0);
  car.vehicle.applyEngineForce(engineForce, 2);
  car.vehicle.applyEngineForce(engineForce, 3);

  car.vehicle.setBrake(keys[' '] ? brakeForce : 0, 0);
  car.vehicle.setBrake(keys[' '] ? brakeForce : 0, 1);

  // Physics Step
  world.step(1 / 60, delta, 3);

  // Sync Visual Mesh
  car.carGroup.position.copy(car.chassisBody.position);
  car.carGroup.quaternion.copy(car.chassisBody.quaternion);

  // Third-Person Camera Follow
  const camOffset = new THREE.Vector3(0, 3.5, -7);
  camOffset.applyQuaternion(car.carGroup.quaternion);
  camera.position.copy(car.carGroup.position).add(camOffset);
  camera.lookAt(car.carGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));

  // Speed UI Update
  const kmh = Math.round(car.chassisBody.velocity.length() * 3.6);
  document.getElementById('speed-display').innerText = kmh;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
