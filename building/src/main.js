// Import Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// Create a scene
const scene = new THREE.Scene();

// Create a camera (FOV, aspect ratio, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 2); // Position the camera closer

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Load a 3D model closer to the camera
const loader = new GLTFLoader();
loader.load(
    '/honey dukes.glb', // Replace with your model path
    (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -2, -1); // Bring model closer to camera
        scene.add(model);
    },
    undefined,
    (error) => {
        console.error('Error loading the model:', error);
    }
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

function animateCamera() {
    let cameraTarget = { progress: 0 };

    // Step 1: Full 360° orbit around the model (EXTERIOR)
    gsap.to(cameraTarget, {
        progress: 1, // Animate from 0 to 1
        duration: 10, // Time for full rotation
        ease: "power2.inOut",
        onUpdate: function () {
            let angle = cameraTarget.progress * Math.PI * 2; // Convert progress to radians (0° to 360°)
            let radius = 30; // Large orbit radius to stay OUTSIDE

            camera.position.x = radius * Math.cos(angle);
            camera.position.z = radius * Math.sin(angle);
            camera.position.y = 6; // Keep camera at a good height
            camera.lookAt(0, 8, 0); // Focus on the model
        },
        onComplete: function () {
            // Step 2: Move backward for a full exterior view
            gsap.to(camera.position, {
                z: 20, // Move farther for a wider view
                y: 15, // Adjust height for better framing
                duration: 3,
                ease: "power2.inOut",
                onUpdate: function () {
                    camera.lookAt(0, 5, 0); // Keep model in focus
                },
                onComplete: function () {
                    // Step 3: Move camera inside the ground floor of the model
                    gsap.to(camera.position, {
                        x: 0,
                        z: 0,
                        y: 2, // Lower height to enter the ground floor
                        duration: 5,
                        ease: "power2.inOut",
                        onUpdate: function () {
                            camera.lookAt(0, 2, 0);
                        },
                        onComplete: function () {
                            let interiorTarget = { progress: 0 };
                            let interiorRadius = 5; // Smaller radius for interior rotation

                            // Step 4: Full 360° orbit inside the ground floor
                            gsap.to(interiorTarget, {
                                progress: 1,
                                duration: 10,
                                ease: "power2.inOut",
                                onUpdate: function () {
                                    let angle = interiorTarget.progress * Math.PI * 2;
                                    camera.position.x = interiorRadius * Math.cos(angle);
                                    camera.position.z = interiorRadius * Math.sin(angle);
                                    camera.position.y = 2; // Keep at ground floor height
                                    camera.lookAt(0, 2, 0);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

animateCamera(); // Start the animation

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

