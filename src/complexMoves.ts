import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js'; // Use STLLoader for .stl and converted .fcstd files
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; // Use OBJLoader for .obj files

/**
 * Initializes and renders a Three.js scene with a 3D model.
 * @param container The HTML element where the scene will be rendered.
 * @param modelPath The path to the 3D model file (GLTF/GLB, STL, OBJ, or FCSTD format).
 */
export function createSceneComplex(container: HTMLElement, modelPath: string): void {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(30, 30, 30);
  camera.lookAt(0, 0, 0);

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

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

  // Model Loader (GLTF, STL, OBJ, and FCSTD support)
  const fileExtension = modelPath.split('.').pop()?.toLowerCase();

  if (fileExtension === 'gltf' || fileExtension === 'glb') {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(10, 10, 10);
        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading GLTF/GLB model:', error)
    );
  } else if (fileExtension === 'stl') {
    const stlLoader = new STLLoader();
    stlLoader.load(
      modelPath,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.scale.set(10, 10, 10);
        scene.add(mesh);
      },
      undefined,
      (error) => console.error('Error loading STL model:', error)
    );
  } else if (fileExtension === 'obj') {
    const objLoader = new OBJLoader();
    objLoader.load(
      modelPath,
      (object) => {
        object.position.set(0, 0, 0);
        object.scale.set(10, 10, 10);
        scene.add(object);
      },
      undefined,
      (error) => console.error('Error loading OBJ model:', error)
    );
  } else if (fileExtension === 'fcstd') {
    console.warn(
      'FCSTD format detected. Ensure the file is pre-converted to STL/OBJ before loading.'
    );
  } else {
    console.error('Unsupported file format:', fileExtension);
  }

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
