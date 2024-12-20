import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Initializes and renders a Three.js scene with a 3D model.
 * @param container The HTML element where the scene will be rendered.
 * @param modelPath The path to the 3D model file (GLTF/GLB format).
 */
export function processingAnalyser(container: HTMLElement, modelPath: string): void {
  // Create a wrapper div for both the input box and the canvas
  const wrapper = document.createElement('div');
  container.appendChild(wrapper);

  // Create the input box and style it
  const inputBox = document.createElement('input');
  inputBox.type = 'number'; // Use type number for number input
  inputBox.placeholder = 'Enter number of models';
  inputBox.style.position = 'absolute';
  inputBox.style.top = '10px';
  inputBox.style.right = '10px';
  inputBox.style.padding = '10px';
  inputBox.style.fontSize = '14px';
  inputBox.style.zIndex = '1000';
  inputBox.style.alignContent = 'right';
  wrapper.appendChild(inputBox);

  // Create a canvas and append it to the wrapper for Three.js rendering
  const canvasWrapper = document.createElement('div');
  wrapper.appendChild(canvasWrapper);
  const canvas = document.createElement('canvas');
  canvasWrapper.appendChild(canvas);

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(30, 30, 30);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvasWrapper.appendChild(renderer.domElement);

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
  let model: THREE.Object3D | null = null;
  const addedModels: THREE.Object3D[] = []; // Track added models

  loader.load(
    modelPath,
    (gltf) => {
      model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(10, 10, 10);
      scene.add(model);

      // Function to add multiple models
      function addMultipleModels(count: number) {
        const xOffset = 15; // Space between models
        for (let i = 0; i < count; i++) {
          const modelClone = model!.clone(); // Clone the loaded model
          modelClone.position.set(i * xOffset, 0, 0); // Adjust position of each model
          scene.add(modelClone);
          addedModels.push(modelClone); // Track added models
        }
      }

      // Function to clear only models
      function clearModels() {
        addedModels.forEach((obj) => scene.remove(obj));
        addedModels.length = 0; // Clear the reference array
      }

      // Add multiple models when input changes
      inputBox.addEventListener('input', () => {
        const count = parseInt(inputBox.value, 10);
        if (!isNaN(count) && model) {
          clearModels(); // Clear existing models
          addMultipleModels(count); // Add new models
        }
      });
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
