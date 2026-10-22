function buildTrack(scene, trackData) {
  const trackColor = 0x1e293b;
  const runColor = 0x0f172a;
  const lineColor = 0xf8fafc;

  const trackGroup = new THREE.Group();

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(120, 80),
    new THREE.MeshStandardMaterial({ color: 0x162534, roughness: 1, metalness: 0.05 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.4;
  trackGroup.add(ground);

  const centerRing = new THREE.Mesh(
    new THREE.TorusGeometry(44, 1.4, 12, 80),
    new THREE.MeshStandardMaterial({ color: trackColor, roughness: 0.8, metalness: 0.2 })
  );
  centerRing.rotation.x = Math.PI / 2;
  centerRing.position.y = 0.18;
  trackGroup.add(centerRing);

  const laneLine = new THREE.Mesh(
    new THREE.TorusGeometry(38, 0.18, 8, 80),
    new THREE.MeshStandardMaterial({ color: lineColor, emissive: 0x172033, roughness: 0.4 })
  );
  laneLine.rotation.x = Math.PI / 2;
  laneLine.position.y = 0.22;
  trackGroup.add(laneLine);

  const checkpoints = trackData.checkpoints || [
    { x: 0, z: -30 },
    { x: 38, z: 0 },
    { x: 0, z: 34 },
    { x: -35, z: 0 }
  ];

  checkpoints.forEach((cp, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.2, 12, 50),
      new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0x34d399 : 0x7dd3fc,
        emissive: index % 2 === 0 ? 0x052e2f : 0x082f49,
        roughness: 0.35,
        metalness: 0.15
      })
    );
    ring.position.set(cp.x, 0.4, cp.z);
    ring.rotation.x = Math.PI / 2;
    trackGroup.add(ring);
  });

  for (let i = 0; i < 36; i += 1) {
    const angle = (i / 36) * Math.PI * 2;
    const radius = 70 + (i % 3) * 8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    if (Math.abs(x) < 28 && Math.abs(z) < 28) continue;

    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x6b4b2b, roughness: 0.9 })
    );
    trunk.position.y = 0.75;

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 })
    );
    leaves.position.y = 1.8;

    tree.add(trunk, leaves);
    tree.position.set(x, 0, z);
    tree.castShadow = true;
    tree.receiveShadow = true;
    trackGroup.add(tree);
  }

  scene.add(trackGroup);

  return {
    trackGroup,
    checkpoints: checkpoints.map((cp) => ({ x: cp.x, z: cp.z })),
    center: { x: 0, z: 0 }
  };
}
