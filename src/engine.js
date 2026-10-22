// --- MODULAR TRACK GENERATOR ---
function buildDefaultTrack(scene, world) {
  const trackCheckpoints = [-10, 30, 82, 128];

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d2a39,
    roughness: 1,
    metalness: 0.06
  });

  const ground = new THREE.Mesh(new THREE.CircleGeometry(200, 96), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.6;
  scene.add(ground);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xb5d7ff,
      side: THREE.BackSide
    })
  );
  scene.add(sky);

  const groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(new CANNON.Plane());
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.position.set(0, -0.6, 0);
  world.addBody(groundBody);

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.8,
    metalness: 0.14
  });
  const laneMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.6,
    emissive: 0x1e293b
  });
  const curbMaterial = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    roughness: 0.45,
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

    const curbLeft = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 0.16, 0.8), curbMaterial);
    const curbRight = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 0.16, 0.8), curbMaterial);
    curbLeft.position.set(x, 0.2, z + length * 0.25);
    curbRight.position.set(x, 0.2, z - length * 0.25);
    curbLeft.rotation.y = rotationY;
    curbRight.rotation.y = rotationY;
    scene.add(curbLeft, curbRight);
  }

  function addLaneMark(x, z, width, length, rotationY = 0) {
    const mark = new THREE.Mesh(new THREE.BoxGeometry(width, 0.08, length), laneMaterial);
    mark.position.set(x, 0.17, z);
    mark.rotation.y = rotationY;
    scene.add(mark);
  }

  addTrackSegment(0, 0, 12, 130);
  addTrackSegment(0, 150, 12, 130);
  addTrackSegment(-85, 75, 12, 190, Math.PI / 2);
  addTrackSegment(85, 75, 12, 190, Math.PI / 2);

  addLaneMark(0, -40, 0.9, 15);
  addLaneMark(0, 44, 0.9, 15);
  addLaneMark(0, 110, 0.9, 15);
  addLaneMark(0, 194, 0.9, 15);

  const checkpointRingMaterial = new THREE.MeshStandardMaterial({
    color: 0x6ee7b7,
    emissive: 0x064e3b,
    roughness: 0.38,
    metalness: 0.22
  });

  trackCheckpoints.forEach((z, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.18, 20, 80), checkpointRingMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.25, z);
    ring.userData.checkpointIndex = index;
    scene.add(ring);
  });

  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 2, 12),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.82 })
    );
    pillar.position.set(Math.cos(angle) * 118, 0.9, Math.sin(angle) * 118);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    scene.add(pillar);
  }

  for (let i = 0; i < 40; i += 1) {
    const angle = (i / 40) * Math.PI * 2;
    const radius = 72 + (i % 3) * 8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (Math.abs(x) < 20 && Math.abs(z) < 20) continue;

    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x7c4f24, roughness: 0.9 })
    );
    trunk.position.y = 0.75;

    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 })
    );
    foliage.position.y = 1.9;

    tree.add(trunk, foliage);
    tree.position.set(x, 0, z);
    tree.castShadow = true;
    tree.receiveShadow = true;
    scene.add(tree);
  }

  return { checkpoints: trackCheckpoints };
}
