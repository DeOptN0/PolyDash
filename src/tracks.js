// --- VEHICLE FACTORY & PHYSICS ---
function createVehicle(scene, world) {
  const carMaterial = new CANNON.Material("carMaterial");
  const chassisShape = new CANNON.Box(new CANNON.Vec3(0.95, 0.4, 1.9));
  const chassisBody = new CANNON.Body({
    mass: 1200,
    material: carMaterial,
    allowSleep: false
  });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 1.8, 0);
  chassisBody.angularDamping = 0.45;
  chassisBody.linearDamping = 0.08;
  world.addBody(chassisBody);

  const carGroup = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4d6d,
    roughness: 0.3,
    metalness: 0.68,
    emissive: 0x2a0f1a
  });

  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 3.7), bodyMaterial);
  bodyMesh.position.y = 0.25;
  bodyMesh.castShadow = true;
  carGroup.add(bodyMesh);

  const cabinMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.55, 1.7),
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.12,
      metalness: 0.9,
      emissive: 0x11314d
    })
  );
  cabinMesh.position.set(0, 0.7, -0.15);
  carGroup.add(cabinMesh);

  const spoilerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.08, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7 })
  );
  spoilerMesh.position.set(0, 0.9, -1.8);
  carGroup.add(spoilerMesh);

  const hoodLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.1, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: 0xffdd88, roughness: 0.4 })
  );
  hoodLight.position.set(0, 0.55, 1.7);
  carGroup.add(hoodLight);

  const wheelGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.25, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.8,
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
    suspensionStiffness: 38,
    suspensionRestLength: 0.38,
    frictionSlip: 6.5,
    dampingRelaxation: 2.6,
    dampingCompression: 4.2,
    maxSuspensionForce: 60000,
    rollInfluence: 0.2,
    axleLocal: new CANNON.Vec3(1, 0, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
    maxSuspensionTravel: 0.35,
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
