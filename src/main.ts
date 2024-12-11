import './style.css';
import { createThreeScene } from './simpleShape';
import { createScene } from './simpleImport';
import { createSceneComplex } from './complexMoves';
import { processingAnalyser } from './processingAnalyser';

const container = document.body;

// Create a dropdown for scene selection
const dropdown = document.createElement('select');
dropdown.style.position = 'fixed';
dropdown.style.top = '10px';
dropdown.style.left = '10px';
dropdown.style.zIndex = '1000';
dropdown.style.padding = '5px';
dropdown.style.backgroundColor = '#bbb';
document.body.appendChild(dropdown);

// Define scene options
const scenes = [
  { label: 'Scene 1 (Simple Objects)', callback: () => createThreeScene(container) },
  { label: 'Scene 2 (GLTF Model of Building)', callback: () => createScene(container, '/models/bldg.glb') },
  { label: 'Scene 3 (GLTF Model of Bedroom)', callback: () => createSceneComplex(container, '/models/bed.glb') },
  { label: 'Scene 4 (GLTF Model of Bedroom multiple copies)', callback: () => processingAnalyser(container, '/models/bed.glb') },
];

// Populate dropdown with options
scenes.forEach((scene, index) => {
  const option = document.createElement('option');
  option.value = index.toString();
  option.textContent = scene.label;
  dropdown.appendChild(option);
});

// Function to clear the container, excluding the dropdown
function clearContainer() {
  Array.from(container.children)
    .filter(child => child !== dropdown)
    .forEach(child => container.removeChild(child));
}

// Handle dropdown change
dropdown.addEventListener('change', () => {
  const selectedIndex = parseInt(dropdown.value, 10);
  clearContainer();
  scenes[selectedIndex].callback();
});

// Set the default scene
dropdown.value = '3'; // Default to the first scene
scenes[3].callback();