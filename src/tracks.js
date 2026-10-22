// --- VEHICLE FACTORY & PHYSICS ---
function createVehicle(scene, world) {
  const carMaterial = new CANNON.Material('carMaterial');
  const chassisShape = new CANNON.Box(new CANNON.Vec3(0.95, 0.4, 1.9));
  const chassisBody = new CANNON.Body({
    mass: 1200,
    material: carMaterial,
    allowSleep: false
  });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 2.2, -35);
  chassisBody.angularDamping = 0.35;
  chassisBody.linearDamping = 0.08;
  world.addBody(chassisBody);

  const carGroup = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.32,
    metalness: 0.7,
    emissive: 0x2b0a18
  });

  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 3.8), bodyMaterial);
  bodyMesh.position.y = 0.25;
  bodyMesh.castShadow = true;
  carGroup.add(bodyMesh);

  const hoodMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.2, 1.5),
    new THREE.MeshStandardMaterial({
      color: 0x171c2e,
      roughness: 0.6,
      metalness: 0.5
    })
  );
  hoodMesh.position.set(0, 0.55, 1.45);
  carGroup.add(hoodMesh);

  const cabinMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.6, 1.7),
    new THREE.MeshStandardMaterial({
      color: 0x9ddcff,
      roughness: 0.14,
      metalness: 0.85,
      transparent: true,
      opacity: 0.78,
      emissive: 0x0d2337
    })
  );
  cabinMesh.position.set(0, 0.72, -0.15);
  carGroup.add(cabinMesh);

  const spoilerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.08, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.75 })
  );
  spoilerMesh.position.set(0, 0.9, -1.8);
  carGroup.add(spoilerMesh);

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: 0xffd77a,
    roughness: 0.4,
    metalness: 0.1
  });

  const headlightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.7), headlightMaterial);
  const headlightRight = headlightLeft.clone();
  headlightLeft.position.set(-0.5, 0.56, 1.82);
  headlightRight.position.set(0.5, 0.56, 1.82);
  carGroup.add(headlightLeft, headlightRight);

  const wheelGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 18);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.82,
    metalness: 0.3
  });

  const wheelMeshes = [];
  const wheelPositions = [
    [0.96, -0.1, 1.2],
    [-0.96, -0.1, 1.2],
    [0.96, -0.1, -1.2],
    [-0.96, -0.1, -1.2]
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    wheelMeshes.push(mesh);
    carGroup.add(mesh);
  });

  scene.add(carGroup);

  const vehicle = new CANNON.RaycastVehicle({ chassisBody });

  const wheelOptions = {
    radius: 0.38,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 42,
    suspensionRestLength: 0.4,
    frictionSlip: 7.5,
    dampingRelaxation: 2.7,
    dampingCompression: 4.1,
    maxSuspensionForce: 70000,
    rollInfluence: 0.22,
    axleLocal: new CANNON.Vec3(1, 0, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
    maxSuspensionTravel: 0.33,
    customSlidingRotationalSpeed: -26,
    useCustomSlidingRotationalSpeed: true
  };

  const offsets = [
    [0.95, -0.08, 1.2],
    [-0.95, -0.08, 1.2],
    [0.95, -0.08, -1.2],
    [-0.95, -0.08, -1.2]
  ];

  offsets.forEach((pos) => {
    wheelOptions.chassisConnectionPointLocal.set(pos[0], pos[1], pos[2]);
    vehicle.addWheel(wheelOptions);
  });

  vehicle.addToWorld(world);

  return { chassisBody, carGroup, vehicle, wheelMeshes };
}
