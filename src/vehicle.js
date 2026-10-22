const CAR_CATALOG = [
  {
    id: 'starter',
    name: 'Starter GT',
    color: 0xf43f5e,
    accent: 0x7dd3fc,
    asset: 'cars/starter-gt.png',
    unlockTrack: 'harbor-loop',
    unlockTime: 72,
    description: 'Default road racer.'
  },
  {
    id: 'icebreaker',
    name: 'Icebreaker S',
    color: 0x60a5fa,
    accent: 0xe0f2fe,
    asset: 'cars/icebreaker-s.png',
    unlockTrack: 'canyon-eclipse',
    unlockTime: 68,
    description: 'Faster, lighter, better grip.'
  },
  {
    id: 'solar-v8',
    name: 'Solar V8',
    color: 0xf59e0b,
    accent: 0xfef3c7,
    asset: 'cars/solar-v8.png',
    unlockTrack: 'skyline-circuit',
    unlockTime: 60,
    description: 'High-speed machine for long straights.'
  },
  {
    id: 'night-volt',
    name: 'Night Volt',
    color: 0x8b5cf6,
    accent: 0xc4b5fd,
    asset: 'cars/night-volt.png',
    unlockTrack: 'wetlands-run',
    unlockTime: 58,
    description: 'Premium unlock, best in tight corners.'
  }
];

const TRACK_CATALOG = [
  {
    id: 'harbor-loop',
    name: 'Harbor Loop',
    asset: 'tracks/harbor-loop.png',
    description: 'Coastal city circuit with wide turns and quick exits.',
    startPosition: { x: 0, y: 0.85, z: -36 },
    checkpoints: [{ x: 0, z: -30 }, { x: 38, z: 0 }, { x: 0, z: 34 }, { x: -36, z: 0 }],
    targetTime: 72,
    unlocks: 'icebreaker'
  },
  {
    id: 'canyon-eclipse',
    name: 'Canyon Eclipse',
    asset: 'tracks/canyon-eclipse.png',
    description: 'Twisting canyon roads with rising speed zones.',
    startPosition: { x: 0, y: 0.85, z: -38 },
    checkpoints: [{ x: 0, z: -30 }, { x: 44, z: 0 }, { x: 0, z: 38 }, { x: -42, z: 0 }],
    targetTime: 68,
    unlocks: 'solar-v8'
  },
  {
    id: 'skyline-circuit',
    name: 'Skyline Circuit',
    asset: 'tracks/skyline-circuit.png',
    description: 'Fast downtown track with narrow Apex sections.',
    startPosition: { x: 0, y: 0.85, z: -34 },
    checkpoints: [{ x: 0, z: -28 }, { x: 34, z: 0 }, { x: 0, z: 32 }, { x: -32, z: 0 }],
    targetTime: 60,
    unlocks: 'night-volt'
  },
  {
    id: 'wetlands-run',
    name: 'Wetlands Run',
    asset: 'tracks/wetlands-run.png',
    description: 'Undulating swamp track with off-camber corners.',
    startPosition: { x: 0, y: 0.85, z: -40 },
    checkpoints: [{ x: 0, z: -32 }, { x: 40, z: 0 }, { x: 0, z: 36 }, { x: -38, z: 0 }],
    targetTime: 58,
    unlocks: null
  }
];

function getCarById(id) {
  return CAR_CATALOG.find((car) => car.id === id) || CAR_CATALOG[0];
}

function getTrackById(id) {
  return TRACK_CATALOG.find((track) => track.id === id) || TRACK_CATALOG[0];
}

function getUnlockedCars(unlockedIds = ['starter']) {
  return CAR_CATALOG.filter((car) => unlockedIds.includes(car.id));
}
