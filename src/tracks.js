function createVehicle(scene, carData = {}) {
  const carColor = carData.color ?? 0xf43f5e;
  const accentColor = carData.accent ?? 0x7dd3fc;

  const carGroup = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: carColor,
    roughness: 0.35,
    metalness: 0.7,
    emissive: 0x220915
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.6, 4.1), bodyMaterial);
  body.position.y = 0.45;
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);

  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.22, 1.5),
    new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.5,
      metalness: 0.5,
      emissive: 0x0a1728
    })
  );
  hood.position.set(0, 0.72, 1.2);
  carGroup.add(hood);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.55, 1.8),
    new THREE.MeshStandardMaterial({
      color: 0xc5f3ff,
      roughness: 0.08,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
      emissive: 0x102f42
    })
  );
  cabin.position.set(0, 0.9, -0.1);
  carGroup.add(cabin);

  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.08, 0.38),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7 })
  );
  spoiler.position.set(0, 0.96, -1.9);
  carGroup.add(spoiler);

  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0xffd36b,
    roughness: 0.35
  });

  const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.7), lightMat);
  const headlightR = headlightL.clone();
  headlightL.position.set(-0.6, 0.62, 2.04);
  headlightR.position.set(0.6, 0.62, 2.04);
  carGroup.add(headlightL, headlightR);

  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 20);
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.8,
    metalness: 0.3
  });

  const wheelPositions = [
    [0.98, 0.2, 1.3],
    [-0.98, 0.2, 1.3],
    [0.98, 0.2, -1.3],
    [-0.98, 0.2, -1.3]
  ];

  const wheels = [];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    wheels.push(wheel);
    carGroup.add(wheel);
  });

  carGroup.rotation.y = Math.PI;
  scene.add(carGroup);

  return {
    group: carGroup,
    body,
    wheels,
    radius: 2.3,
    state: {
      x: 0,
      z: -35,
      speed: 0,
      angle: 0,
      turn: 0
    }
  };
}
