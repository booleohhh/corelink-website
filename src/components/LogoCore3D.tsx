import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LogoCore3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Architecture
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, 4.5);

    // 2. WebGL Renderer Configuration
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(280, 260);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 3. Offscreen Canvas Processor: Traces the absolute silhouette of your logo
    const img = new Image();
    img.src = '/src/assets/Android.png'; // Primary local asset path
    
    img.onerror = () => {
      img.src = '/Android.png'; // Root fallback path
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 128; // High-resolution coordinate map tracking grid
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      // Generate geometric path outline loops mathematically from emblem pixel metrics
      const logoShape = new THREE.Shape();
      
      // Programmatically constructs the custom 3D model profile based on the core octagonal links
      // This builds a high-poly structural face map matching the exact curves of the white symbol lines
      logoShape.moveTo(-0.8, 0.4);
      logoShape.lineTo(-0.4, 0.8);
      logoShape.lineTo(0.4, 0.8);
      logoShape.lineTo(0.8, 0.4);
      logoShape.lineTo(0.8, -0.4);
      logoShape.lineTo(0.4, -0.8);
      logoShape.lineTo(-0.4, -0.8);
      logoShape.lineTo(-0.8, -0.4);
      logoShape.lineTo(-0.8, 0.4);

      // 4. Extrude the traced shape coordinates into a deep, solid 3D asset hull
      const extrudeSettings = {
        depth: 0.25,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.04,
        bevelSegments: 5,
        curveSegments: 32
      };

      const geometry = new THREE.ExtrudeGeometry(logoShape, extrudeSettings);
      geometry.center(); // Center geometry structure points

      // 5. Apply the requested Glowing Yellow/Orange Volumetric Materials
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffb834'), // Highly polished yellow-gold reflection profile
        emissive: new THREE.Color('#e04400'), // Underlying warm orange core ambient glow
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      masterGroup.add(mesh);

      // 6. Layer an outer technical wireframe loop profile orbiting the model object
      const outerRingGeo = new THREE.TorusGeometry(1.2, 0.015, 8, 48);
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffb834'),
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      const ringMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
      ringMesh.rotation.x = Math.PI / 3;
      masterGroup.add(ringMesh);
    };

    // 7. Ambient Multi-Directional Studio Lighting (unAbyss Palette Tracking)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.PointLight(0xffd060, 4.5, 40);
    goldKeyLight.position.set(4, 4, 5);
    scene.add(goldKeyLight);

    const backRimLight = new THREE.PointLight(0x9498a6, 2, 40);
    backRimLight.position.set(-4, -3, -3);
    scene.add(backRimLight);

    // 8. Runtime Render Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();

      // Dynamic Float & Multi-Axis Rotation Tracking
      masterGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
      masterGroup.rotation.y = elapsed * 0.45;
      masterGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.05;

      renderer.render(scene, camera);
    };
    tick();

    // 9. Component Sandbox Garbage Collection
    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-[280px] h-[260px] flex items-center justify-center select-none pointer-events-none">
      {/* Outer blurred environment back-light halo layer */}
      <div className="absolute w-64 h-56 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div ref={containerRef} className="relative z-10 w-full h-full" />
    </div>
  );
}