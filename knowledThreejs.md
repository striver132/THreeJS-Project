1. Libraries and Setup
Three.js: Used for rendering 3D graphics.
Cannon.js: A physics engine for simulating realistic physics.
lil-gui: A GUI library for debugging and tweaking parameters.
OrbitControls: Allows camera interaction (e.g., rotation, zooming).
2. Scene Setup
A THREE.Scene is created to hold all objects.
A canvas element is selected for rendering the WebGL content.
3. Physics World
A CANNON.World is initialized with gravity set to -9.82 in the Y-axis.
4. Textures
A THREE.CubeTextureLoader loads an environment map for reflections and lighting effects.
5. Objects
Sphere: A test sphere with a THREE.SphereGeometry and a reflective material using the environment map.
Floor: A plane geometry with a material similar to the sphere, acting as the ground.
6. Lighting
Ambient Light: Provides uniform lighting across the scene.
Directional Light: Simulates sunlight, with shadows enabled for realism.
7. Camera
A THREE.PerspectiveCamera is set up with an initial position and added to the scene.
OrbitControls is used for interactive camera movement.
8. Renderer
A THREE.WebGLRenderer is configured with shadow mapping enabled for soft shadows.
The renderer adjusts its size and pixel ratio dynamically on window resize.
9. Animation Loop
A tick function uses requestAnimationFrame to create a continuous render loop.
The THREE.Clock tracks elapsed time for animations.
The controls.update() method ensures smooth camera interactions.
10. Event Listeners
A resize event listener updates the camera and renderer when the window size changes.
This setup creates a basic 3D scene with physics, lighting, and interactivity, suitable for further development or experimentation.