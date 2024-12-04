import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Initializes and renders a Three.js scene with a 3D model.
 * @param container The HTML element where the scene will be rendered.
 * @param modelPath The path to the 3D model file (GLTF/GLB format).
 */
export function createSceneComplex(container: HTMLElement, modelPath: string): void {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(30, 30, 30);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 100);
  pointLight.position.set(50, 50, 50);
  scene.add(pointLight);

  const pointLight1 = new THREE.PointLight(0xffffff, 100);
  pointLight1.position.set(0, 10, 0);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 100);
  pointLight2.position.set(0, -10, 0);
  scene.add(pointLight2);

  // GLTF Loader
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(10, 10, 10);
      scene.add(model);
    },
    undefined,
    (error) => console.error('Error loading model:', error)
  );

  // OrbitControls for smooth camera movement
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Enables smooth movement
  controls.dampingFactor = 0.1; // Adjust damping intensity
  controls.autoRotate = false; // Set to true for auto-rotation

  // Update camera position and controls
  function updateCameraAndControls() {
    controls.update();
    renderer.render(scene, camera);
  }

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    updateCameraAndControls();
  }

  animate();
}
