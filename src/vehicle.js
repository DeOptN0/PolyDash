// --- VEHICLE FACTORY & PHYSICS ---
function createVehicle(scene, world) {
  // 1. Physics Chassis
  const carMat = new CANNON.Material("carMaterial");
  const chassisShape = new CANNON.Box(new CANNON.Vec3(0.9, 0.35, 1.8));
  const chassisBody = new CANNON.Body({ mass: 180, material: carMat });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 2, 0);
  world.addBody(chassisBody);

  // 2. Visual Car Mesh (Low-Poly Cyber Roadster)
  const carGroup = new THREE.Group();

  // Body
  const bodyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.6, 3.6),
    new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.2, metalness: 0.5 })
  );
  bodyMesh.position.y = 0.2;
  bodyMesh.castShadow = true;
  carGroup.add(bodyMesh);

  // Cabin / Glass
  const cabinMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.5, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.9 })
  );
  cabinMesh.position.set(0, 0.6, -0.2);
  carGroup.add(cabinMesh);

  scene.add(carGroup);

  // 3. Raycast Vehicle Controller
  const vehicle = new CANNON.RaycastVehicle({ chassisBody: chassisBody });

  const wheelOptions = {
    radius: 0.35,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 35,
    suspensionRestLength: 0.35,
    frictionSlip: 3.5,
    dampingRelaxation: 2.8,
    dampingCompression: 4.5,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(1, 0, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),
    maxSuspensionTravel: 0.25,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true
  };

  // 4 Wheels positioning
  const offsets = [
    [0.95, -0.1, 1.1],   // Front Right
    [-0.95, -0.1, 1.1],  // Front Left
    [0.95, -0.1, -1.1],  // Rear Right
    [-0.95, -0.1, -1.1]  // Rear Left
  ];

  offsets.forEach(pos => {
    wheelOptions.chassisConnectionPointLocal.set(pos[0], pos[1], pos[2]);
    vehicle.addWheel(wheelOptions);
  });

  vehicle.addToWorld(world);

  return { chassisBody, carGroup, vehicle };
}
