// --- MODULAR TRACK GENERATOR ---
function buildDefaultTrack(scene, world) {
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b1220,
    roughness: 1,
    metalness: 0.05
  });

  const ground = new THREE.Mesh(new THREE.CircleGeometry(180, 80), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.55;
  scene.add(ground);

  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(new CANNON.Plane());
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.position.set(0, -0.55, 0);
  world.addBody(groundBody);

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.82,
    metalness: 0.12
  });
  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.5,
    emissive: 0x1e293b
  });
  const curbMaterial = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    roughness: 0.4,
    emissive: 0x0f172a
  });

  function addTrackSegment(x, z, width, length, rotationY = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, 0.42, length), trackMaterial);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = rotationY;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, 0.2, length / 2));
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x, 0, z);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotationY);
    world.addBody(body);

    const curbLeft = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.18, 0.8), curbMaterial);
    const curbRight = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.18, 0.8), curbMaterial);
    curbLeft.position.set(x, 0.2, z + length * 0.25);
    curbRight.position.set(x, 0.2, z - length * 0.25);
    curbLeft.rotation.y = rotationY;
    curbRight.rotation.y = rotationY;
    scene.add(curbLeft, curbRight);
  }

  function addLaneMark(x, z, width, length, rotationY = 0) {
    const mark = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, length), lineMaterial);
    mark.position.set(x, 0.15, z);
    mark.rotation.y = rotationY;
    scene.add(mark);
  }

  addTrackSegment(0, 0, 12, 130);
  addTrackSegment(0, 150, 12, 130);
  addTrackSegment(-85, 75, 12, 190, Math.PI / 2);
  addTrackSegment(85, 75, 12, 190, Math.PI / 2);

  addLaneMark(0, -44, 0.8, 12);
  addLaneMark(0, 44, 0.8, 12);
  addLaneMark(0, 106, 0.8, 12);
  addLaneMark(0, 194, 0.8, 12);

  const checkpointRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.18, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x064e3b, roughness: 0.4 })
  );
  checkpointRing.rotation.x = Math.PI / 2;
  checkpointRing.position.set(0, 0.2, 0);
  scene.add(checkpointRing);

  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2;
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 1.8, 10),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
    );
    ring.position.set(Math.cos(angle) * 120, 0.9, Math.sin(angle) * 120);
    ring.castShadow = true;
    scene.add(ring);
  }
}
