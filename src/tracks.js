// --- MODULAR TRACK GENERATOR ---
function buildDefaultTrack(scene, world) {
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2330, roughness: 0.6 });
  const curbMaterial = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3 });

  function addTrackSegment(x, z, width, length, rotationY = 0) {
    // Visual
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, length), trackMaterial);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = rotationY;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Physics
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, 0.2, length / 2));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, 0, z);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationY);
    world.addBody(body);
  }

  // Build Start Straight & Loop
  addTrackSegment(0, 0, 10, 80);
  addTrackSegment(0, 60, 10, 80);
  addTrackSegment(25, 100, 60, 10, Math.PI / 4);
}
