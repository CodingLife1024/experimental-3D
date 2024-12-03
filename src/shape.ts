import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Initializes and renders a Three.js scene with a 3D model.
 * @param container The HTML element where the scene will be rendered.
 * @param modelPath The path to the 3D model file (GLTF/GLB format).
 */
export function createScene(container: HTMLElement, modelPath: string): void {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  // Camera configuration
  const centerPoint = new THREE.Vector3(0, 0, 0);
  const initialRadius = 30;
  const minRadius = 10;
  const maxRadius = 50;

  // Spherical coordinates for camera positioning
  const cameraState = {
    radius: initialRadius,
    theta: 0, // Horizontal rotation
    phi: Math.PI / 2, // Vertical rotation (looking at center)
  };

  // Initial camera position
  camera.position.set(
    cameraState.radius * Math.sin(cameraState.phi) * Math.cos(cameraState.theta),
    cameraState.radius * Math.cos(cameraState.phi),
    cameraState.radius * Math.sin(cameraState.phi) * Math.sin(cameraState.theta)
  );
  camera.lookAt(centerPoint);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 100);
  pointLight.position.set(7, 7, 7);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xffffff, 100);
  pointLight2.position.set(-7, -7, -7);
  scene.add(pointLight2);

  // GLTF Loader
  const loader = new GLTFLoader();
  let aircon: THREE.Object3D | undefined;

  loader.load(
    modelPath,
    (gltf) => {
      aircon = gltf.scene;
      aircon.position.set(0, 0, 0);
      aircon.scale.set(1, 1, 1);
      scene.add(aircon);
    },
    undefined,
    (error) => {
      console.error('An error occurred while loading the model:', error);
    }
  );

  // Update camera position based on spherical coordinates
  function updateCameraPosition() {
    camera.position.set(
      cameraState.radius * Math.sin(cameraState.phi) * Math.cos(cameraState.theta),
      cameraState.radius * Math.cos(cameraState.phi),
      cameraState.radius * Math.sin(cameraState.phi) * Math.sin(cameraState.theta)
    );
    camera.lookAt(centerPoint);
  }

  // Keyboard controls
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
      cameraState.radius = Math.max(cameraState.radius - 0.5, minRadius);
    }
    if (keys['e']) {
      cameraState.radius = Math.min(cameraState.radius + 0.5, maxRadius);
    }

    // Manual horizontal rotation
    if (keys['arrowleft'] || keys['a']) {
      cameraState.theta -= manualRotationSpeed;
    }
    if (keys['arrowright'] || keys['d']) {
      cameraState.theta += manualRotationSpeed;
    }

    // Manual vertical rotation
    if (keys['arrowup'] || keys['w']) {
      cameraState.phi = Math.min(Math.PI - 0.01, cameraState.phi + manualRotationSpeed);
    }
    if (keys['arrowdown'] || keys['s']) {
      cameraState.phi = Math.max(0.01, cameraState.phi - manualRotationSpeed);
    }

    // No wrapping for `phi` as it controls the vertical movement (bounded).
    // `theta` naturally wraps for full horizontal rotation.
  }

  // Animation loop
  function animate() {
    handleCameraMovement();
    updateCameraPosition();

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
