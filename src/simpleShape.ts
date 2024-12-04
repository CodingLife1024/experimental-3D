import * as THREE from 'three';

export function createThreeScene(container: HTMLElement): void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Camera configuration
  const centerPoint = new THREE.Vector3(0, 0, 0);
  const initialRadius = 5;
  const minRadius = 2;
  const maxRadius = 10;

  // Spherical coordinates for camera positioning
  const cameraState = {
    radius: initialRadius,
    theta: 0, // Horizontal rotation
    phi: Math.PI / 3, // Vertical rotation
    rotationSpeed: 0.01, // Speed for auto-rotation
    verticalSpeed: 0.005, // Speed for auto vertical rotation
  };

  camera.position.set(
    cameraState.radius * Math.sin(cameraState.phi) * Math.cos(cameraState.theta),
    cameraState.radius * Math.sin(cameraState.phi) * Math.sin(cameraState.theta),
    cameraState.radius * Math.cos(cameraState.phi)
  );
  camera.lookAt(centerPoint);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.z = -1;
  scene.add(sphere);

  function updateCameraPosition() {
    camera.position.set(
      cameraState.radius * Math.sin(cameraState.phi) * Math.cos(cameraState.theta),
      cameraState.radius * Math.sin(cameraState.phi) * Math.sin(cameraState.theta),
      cameraState.radius * Math.cos(cameraState.phi)
    );
    camera.lookAt(centerPoint);
  }

  const keys: { [key: string]: boolean } = {};

  window.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
  });

  function handleCameraMovement() {
    const manualRotationSpeed = 0.05;

    // Zoom controls
    if (keys['q']) {
      cameraState.radius = Math.max(cameraState.radius - 0.1, minRadius);
    }
    if (keys['e']) {
      cameraState.radius = Math.min(cameraState.radius + 0.1, maxRadius);
    }

    // Manual horizontal rotation
    if (keys['arrowleft'] || keys['a']) {
      cameraState.theta += manualRotationSpeed;
    }
    if (keys['arrowright'] || keys['d']) {
      cameraState.theta -= manualRotationSpeed;
    }

    // Manual vertical rotation
    if (keys['arrowup'] || keys['w']) {
      cameraState.phi += manualRotationSpeed;
    }
    if (keys['arrowdown'] || keys['s']) {
      cameraState.phi -= manualRotationSpeed;
    }

    // Ensure theta and phi wrap around for continuous rotation
    cameraState.theta = (cameraState.theta + 2 * Math.PI) % (2 * Math.PI);
    cameraState.phi = (cameraState.phi + 2 * Math.PI) % (2 * Math.PI);
  }

  function autoRotateCamera() {
    // cameraState.theta += cameraState.rotationSpeed; // Auto horizontal rotation
    // cameraState.phi += cameraState.verticalSpeed; // Auto vertical rotation

    // Wrap around theta and phi
    cameraState.theta = (cameraState.theta + 2 * Math.PI) % (2 * Math.PI);
    cameraState.phi = (cameraState.phi + 2 * Math.PI) % (2 * Math.PI);
  }

  function animate(): void {
    handleCameraMovement();
    autoRotateCamera();
    updateCameraPosition();

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  function onResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);
}
