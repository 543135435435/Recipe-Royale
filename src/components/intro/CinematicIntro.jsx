import { useState, useEffect, useRef, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const SKIP_KEY = 'recipe_royale_intro_seen';

/* ─── Food markers ─────────────────────────────────────── */
const FOOD_MARKERS = [
  { name:'Pakistan', dish:'Biryani 🍚', lat:30.37, lng:69.35, flag:'🇵🇰', slug:'Pakistani' },
  { name:'India', dish:'Butter Chicken 🍛', lat:20.59, lng:78.96, flag:'🇮🇳', slug:'Indian' },
  { name:'Japan', dish:'Sushi 🍣', lat:36.20, lng:138.25, flag:'🇯🇵', slug:'Japanese' },
  { name:'Italy', dish:'Pizza 🍕', lat:41.87, lng:12.57, flag:'🇮🇹', slug:'Italian' },
  { name:'Mexico', dish:'Tacos 🌮', lat:23.63, lng:-102.55, flag:'🇲🇽', slug:'Mexican' },
  { name:'China', dish:'Dumplings 🥟', lat:35.86, lng:104.20, flag:'🇨🇳', slug:'Chinese' },
  { name:'Turkey', dish:'Kebab 🍢', lat:38.96, lng:35.24, flag:'🇹🇷', slug:'Turkish' },
  { name:'Thailand', dish:'Pad Thai 🍜', lat:15.87, lng:100.99, flag:'🇹🇭', slug:'Thai' },
  { name:'France', dish:'Croissant 🥐', lat:46.23, lng:2.21, flag:'🇫🇷', slug:'French' },
  { name:'USA', dish:'Burger 🍔', lat:37.09, lng:-95.71, flag:'🇺🇸', slug:'American' },
  { name:'Morocco', dish:'Tagine 🫕', lat:31.79, lng:-7.09, flag:'🇲🇦', slug:'Moroccan' },
  { name:'Ethiopia', dish:'Injera 🫓', lat:9.15, lng:40.49, flag:'🇪🇹', slug:'Ethiopian' },
  { name:'Brazil', dish:'Feijoada 🍲', lat:-14.24, lng:-51.93, flag:'🇧🇷', slug:'Brazilian' },
  { name:'Greece', dish:'Moussaka 🍆', lat:39.07, lng:21.82, flag:'🇬🇷', slug:'Greek' },
  { name:'Peru', dish:'Ceviche 🐟', lat:-9.19, lng:-75.02, flag:'🇵🇪', slug:'Peruvian' },
  { name:'South Korea', dish:'Bibimbap 🥘', lat:35.91, lng:127.77, flag:'🇰🇷', slug:'Korean' },
];

function latLngToVector3(lat, lng, radius = 2.03) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/* ─── Procedural Earth Texture ────────────────────────── */
function createEarthTexture(width = 2048, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Ocean gradient — deep navy to richer blue
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#0b1a30');
  oceanGrad.addColorStop(0.25, '#0d2240');
  oceanGrad.addColorStop(0.5, '#0f2848');
  oceanGrad.addColorStop(0.75, '#0d2240');
  oceanGrad.addColorStop(1, '#0b1a30');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Ocean subtle wave texture
  ctx.globalAlpha = 0.03;
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 8) {
      const v = Math.sin(x * 0.02 + y * 0.01) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(60,140,220,${v * 0.15})`;
      ctx.fillRect(x, y, 8, 4);
    }
  }
  ctx.globalAlpha = 1;

  // Simplified continent shapes (normalized 0-1 coordinates → pixel)
  const continents = [
    // North America
    { points: [[0.10,0.18],[0.14,0.12],[0.18,0.10],[0.24,0.12],[0.28,0.18],[0.30,0.25],[0.28,0.32],[0.26,0.38],[0.22,0.42],[0.18,0.44],[0.16,0.40],[0.13,0.36],[0.10,0.30],[0.08,0.24]], color:'#1a4a2a' },
    // South America
    { points: [[0.22,0.50],[0.26,0.48],[0.30,0.52],[0.32,0.58],[0.33,0.64],[0.32,0.70],[0.30,0.76],[0.27,0.82],[0.24,0.84],[0.22,0.80],[0.20,0.74],[0.19,0.68],[0.20,0.60],[0.20,0.54]], color:'#1e5530' },
    // Europe
    { points: [[0.44,0.14],[0.47,0.12],[0.52,0.13],[0.55,0.16],[0.56,0.20],[0.54,0.24],[0.52,0.26],[0.49,0.28],[0.46,0.26],[0.44,0.22],[0.43,0.18]], color:'#1c4832' },
    // Africa
    { points: [[0.44,0.30],[0.48,0.28],[0.54,0.30],[0.58,0.36],[0.60,0.42],[0.60,0.50],[0.58,0.58],[0.56,0.66],[0.53,0.72],[0.50,0.74],[0.47,0.70],[0.44,0.64],[0.42,0.56],[0.42,0.48],[0.42,0.40],[0.42,0.34]], color:'#2a5535' },
    // Asia
    { points: [[0.56,0.10],[0.62,0.08],[0.70,0.10],[0.78,0.14],[0.84,0.18],[0.88,0.22],[0.90,0.28],[0.88,0.34],[0.84,0.38],[0.78,0.40],[0.72,0.38],[0.66,0.36],[0.62,0.32],[0.58,0.28],[0.56,0.22],[0.55,0.16]], color:'#1c4a2e' },
    // India subcontinent
    { points: [[0.64,0.34],[0.66,0.32],[0.68,0.36],[0.68,0.42],[0.66,0.48],[0.64,0.46],[0.63,0.40]], color:'#2a5e38' },
    // Southeast Asia
    { points: [[0.74,0.38],[0.78,0.36],[0.82,0.40],[0.80,0.46],[0.76,0.48],[0.74,0.44]], color:'#1e5530' },
    // Australia
    { points: [[0.80,0.60],[0.84,0.58],[0.90,0.60],[0.92,0.64],[0.90,0.70],[0.86,0.72],[0.82,0.70],[0.78,0.66],[0.78,0.62]], color:'#3a5a30' },
    // Japan
    { points: [[0.88,0.22],[0.89,0.20],[0.90,0.24],[0.89,0.28],[0.88,0.26]], color:'#1c4a2e' },
    // UK/Ireland
    { points: [[0.43,0.14],[0.44,0.13],[0.45,0.15],[0.44,0.17],[0.43,0.16]], color:'#1c4832' },
    // Greenland
    { points: [[0.30,0.04],[0.34,0.03],[0.36,0.06],[0.34,0.10],[0.30,0.08]], color:'#2a4a3a' },
    // Indonesia
    { points: [[0.76,0.50],[0.80,0.48],[0.84,0.50],[0.86,0.52],[0.84,0.54],[0.80,0.52],[0.76,0.52]], color:'#1e5530' },
  ];

  continents.forEach(({ points, color }) => {
    // Draw each continent as a filled polygon
    const pxPoints = points.map(([x, y]) => [x * width, y * height]);

    // Main landmass
    ctx.beginPath();
    ctx.moveTo(pxPoints[0][0], pxPoints[0][1]);
    for (let i = 1; i < pxPoints.length; i++) {
      const prev = pxPoints[i - 1];
      const curr = pxPoints[i];
      const cpx = (prev[0] + curr[0]) / 2;
      const cpy = (prev[1] + curr[1]) / 2;
      ctx.quadraticCurveTo(prev[0], prev[1], cpx, cpy);
    }
    ctx.closePath();

    // Land gradient
    const cx = pxPoints.reduce((s, p) => s + p[0], 0) / pxPoints.length;
    const cy = pxPoints.reduce((s, p) => s + p[1], 0) / pxPoints.length;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
    grad.addColorStop(0, color);
    grad.addColorStop(0.6, color);
    grad.addColorStop(1, '#1a3a22');
    ctx.fillStyle = grad;
    ctx.fill();

    // Coastal highlight
    ctx.strokeStyle = 'rgba(80,160,100,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // City lights (subtle dots on land)
  ctx.globalAlpha = 0.4;
  const cities = [
    [0.22,0.26],[0.24,0.30],[0.20,0.22], // N. America
    [0.46,0.20],[0.50,0.18],[0.48,0.22],[0.52,0.20],[0.54,0.22], // Europe
    [0.48,0.42],[0.50,0.38],[0.52,0.44],[0.56,0.52], // Africa
    [0.64,0.38],[0.66,0.36],[0.70,0.24],[0.72,0.28],[0.68,0.32],[0.82,0.20], // Asia
    [0.26,0.52],[0.28,0.62],[0.30,0.56], // S. America
    [0.84,0.64],[0.86,0.66], // Australia
    [0.88,0.24],[0.90,0.22], // Japan
  ];
  cities.forEach(([x, y]) => {
    const px = x * width;
    const py = y * height;
    const r = Math.random() * 2 + 1;
    const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 3);
    glow.addColorStop(0, 'rgba(255,220,140,0.8)');
    glow.addColorStop(0.5, 'rgba(255,200,100,0.3)');
    glow.addColorStop(1, 'rgba(255,180,60,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(px - r * 3, py - r * 3, r * 6, r * 6);
  });
  ctx.globalAlpha = 1;

  return new THREE.CanvasTexture(canvas);
}

/* ─── Night lights texture ─────────────────────────────── */
function createNightTexture(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  const cityCoords = [
    [0.10,0.20],[0.12,0.22],[0.14,0.18],[0.16,0.24],[0.18,0.20],[0.20,0.26],[0.22,0.28],
    [0.24,0.30],[0.15,0.32],[0.28,0.22],[0.30,0.24],[0.32,0.20],
    [0.44,0.16],[0.46,0.18],[0.48,0.16],[0.50,0.18],[0.52,0.20],[0.54,0.18],[0.48,0.22],[0.50,0.24],
    [0.64,0.24],[0.66,0.22],[0.68,0.26],[0.70,0.22],[0.72,0.26],[0.74,0.24],
    [0.66,0.36],[0.68,0.38],[0.70,0.34],[0.72,0.36],[0.76,0.22],[0.78,0.24],
    [0.86,0.22],[0.88,0.20],[0.90,0.22],
    [0.82,0.62],[0.84,0.64],
    [0.24,0.54],[0.26,0.56],[0.28,0.58],[0.30,0.54],[0.32,0.60],
    [0.52,0.42],[0.54,0.44],[0.56,0.48],
  ];

  cityCoords.forEach(([x, y]) => {
    const px = x * width;
    const py = y * height;
    const r = Math.random() * 3 + 1;
    const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
    glow.addColorStop(0, 'rgba(255,210,120,1)');
    glow.addColorStop(0.3, 'rgba(255,180,80,0.6)');
    glow.addColorStop(0.6, 'rgba(255,160,60,0.2)');
    glow.addColorStop(1, 'rgba(255,140,40,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(px - r * 4, py - r * 4, r * 8, r * 8);
  });

  return new THREE.CanvasTexture(canvas);
}

/* ─── Custom Atmosphere Shader ────────────────────────── */
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - dot(viewDir, vNormal);
    fresnel = pow(fresnel, 3.0);
    vec3 atmosphereColor = mix(vec3(0.15, 0.4, 0.9), vec3(0.3, 0.6, 1.0), fresnel);
    gl_FragColor = vec4(atmosphereColor, fresnel * 0.7);
  }
`;

const glowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    gl_FragColor = vec4(0.2, 0.5, 1.0, intensity * 0.4);
  }
`;

/* ─── Earth Component ─────────────────────────────────── */
function Earth({ phase }) {
  const earthRef = useRef();
  const [earthTex, setEarthTex] = useState(null);
  const [nightTex, setNightTex] = useState(null);

  useEffect(() => {
    setEarthTex(createEarthTexture());
    setNightTex(createNightTexture());
  }, []);

  const earthMaterial = useMemo(() => {
    if (!earthTex) return null;
    return new THREE.MeshPhongMaterial({
      map: earthTex,
      emissiveMap: nightTex,
      emissive: new THREE.Color('#ff9944'),
      emissiveIntensity: 0.08,
      shininess: 25,
      specular: new THREE.Color('#223355'),
    });
  }, [earthTex, nightTex]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      {earthMaterial && (
        <Sphere ref={earthRef} args={[2, 64, 64]} material={earthMaterial} />
      )}

      {/* Atmospheric glow (Fresnel shader) */}
      <Sphere args={[2.015, 64, 64]}>
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          transparent
        />
      </Sphere>

      {/* Outer glow ring */}
      <Sphere args={[2.15, 64, 64]}>
        <shaderMaterial
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </Sphere>

      {/* Inner glow (soft blue) */}
      <Sphere args={[2.25, 32, 32]}>
        <meshBasicMaterial
          color="#1a4488"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Food markers */}
      {FOOD_MARKERS.map((marker, i) => {
        const pos = latLngToVector3(marker.lat, marker.lng);
        return <FoodMarker key={i} position={pos} marker={marker} index={i} />;
      })}
    </group>
  );
}

/* ─── Food Marker ─────────────────────────────────────── */
function FoodMarker({ position, marker, index }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const [visible, setVisible] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      const pulse = 1 + Math.sin(t * 2 + index * 0.8) * 0.2;
      meshRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      const t = state.clock.elapsedTime;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5 + index) * 0.15);
      ringRef.current.material.opacity = 0.15 + Math.sin(t * 2 + index * 0.5) * 0.08;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Glowing core dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.95} />
      </mesh>

      {/* Animated ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.055, 32]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.08} />
      </mesh>

      {/* Label */}
      <Html distanceFactor={5} center style={{ pointerEvents: 'none' }}>
        <div className="text-center whitespace-nowrap select-none" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }}>
          <span className="text-xl block leading-none">{marker.flag}</span>
          <span className="text-[9px] font-semibold text-amber-300 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded mt-0.5 block border border-amber-500/20">
            {marker.dish}
          </span>
        </div>
      </Html>
    </group>
  );
}

/* ─── Camera Animation ────────────────────────────────── */
function CameraAnimation({ phase }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    if (phase === 'earth' || phase === 'markers') {
      targetRef.current.set(0, 0.3, 5.5);
    } else if (phase === 'logo') {
      targetRef.current.set(0, 0.5, 5);
    } else if (phase === 'transition') {
      targetRef.current.set(0, 0, 2.5);
    }
    camera.position.lerp(targetRef.current, 0.012);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─── Star Field ──────────────────────────────────────── */
function StarField() {
  const count = 1500;
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Star colors: warm white to cool blue
      const temp = Math.random();
      if (temp > 0.8) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.6; // warm
      } else if (temp > 0.5) {
        col[i * 3] = 0.9; col[i * 3 + 1] = 0.92; col[i * 3 + 2] = 1.0; // cool
      } else {
        col[i * 3] = 0.8; col[i * 3 + 1] = 0.82; col[i * 3 + 2] = 0.88; // neutral
      }
      sz[i] = Math.random() * 0.06 + 0.01;
    }
    return [pos, col, sz];
  }, []);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/* ─── Floating Dust Particles ─────────────────────────── */
function DustParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0003;
      pointsRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#d4a056" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

/* ─── Lighting Rig ────────────────────────────────────── */
function Lighting() {
  return (
    <>
      {/* Main sun-like directional light */}
      <directionalLight position={[8, 3, 5]} intensity={2.2} color="#ffffff" />
      {/* Fill light from below-left */}
      <directionalLight position={[-5, -3, -2]} intensity={0.4} color="#8888cc" />
      {/* Rim / back light */}
      <pointLight position={[-4, 2, -8]} intensity={1.2} color="#4466aa" />
      {/* Warm accent from right */}
      <pointLight position={[6, 0, 3]} intensity={0.6} color="#ffcc88" />
      {/* Ambient base */}
      <ambientLight intensity={0.15} />
      {/* Soft blue bounce from below */}
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#2244aa" />
    </>
  );
}

/* ─── 3D Scene ────────────────────────────────────────── */
function Scene({ phase }) {
  return (
    <>
      <Lighting />
      <StarField />
      <DustParticles />
      <Earth phase={phase} />
      <CameraAnimation phase={phase} />
    </>
  );
}

/* ─── Main Intro Component ────────────────────────────── */
export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState('particles');
  const [exiting, setExiting] = useState(false);
  const navigate = useNavigate();

  // Skip if already seen
  useEffect(() => {
    if (sessionStorage.getItem(SKIP_KEY)) {
      onComplete();
    }
  }, [onComplete]);

  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('earth'), 600),
      setTimeout(() => setPhase('markers'), 2800),
      setTimeout(() => setPhase('logo'), 4200),
      setTimeout(() => setPhase('transition'), 7500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-complete
  useEffect(() => {
    if (phase === 'transition') {
      const timer = setTimeout(() => {
        sessionStorage.setItem(SKIP_KEY, 'true');
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleSkip = useCallback(() => {
    setExiting(true);
    sessionStorage.setItem(SKIP_KEY, 'true');
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  const phases = ['particles', 'earth', 'markers', 'logo'];
  const currentIdx = phases.indexOf(phase);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #080e1a 50%, #030608 100%)' }}
        >
          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 6], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <Scene phase={phase} />
              </Suspense>
            </Canvas>
          </div>

          {/* Radial glow behind Earth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 48%, rgba(30,80,160,0.12) 0%, rgba(10,30,60,0.06) 30%, transparent 60%)',
            }}
          />

          {/* Top vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(3,6,8,0.6) 0%, transparent 30%, transparent 80%, rgba(3,6,8,0.5) 100%)',
            }}
          />

          {/* Logo overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <AnimatePresence>
              {(phase === 'logo' || phase === 'transition') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  {/* Crown icon */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-5"
                  >
                    <span className="text-5xl" style={{ filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.4))' }}>
                      👑
                    </span>
                  </motion.div>

                  {/* Title */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-4">
                    <span className="text-white" style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}>
                      Recipe{' '}
                    </span>
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #f5a623 0%, #e67e22 50%, #d35400 100%)',
                        filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.3))',
                      }}
                    >
                      Royale
                    </span>
                  </h1>

                  {/* Tagline */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-base md:text-lg tracking-[0.3em] uppercase font-light"
                    style={{ color: 'rgba(180,190,210,0.7)' }}
                  >
                    Explore the World Through Food
                  </motion.p>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mx-auto mt-5 h-px w-32"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.5), transparent)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue / Explore button */}
          <AnimatePresence>
            {phase === 'transition' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
              >
                <button
                  onClick={handleSkip}
                  className="px-8 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(245,166,35,0.05))',
                    border: '1px solid rgba(245,166,35,0.3)',
                    color: '#f5a623',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 0 30px rgba(245,166,35,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(245,166,35,0.25), rgba(245,166,35,0.1))';
                    e.target.style.boxShadow = '0 0 40px rgba(245,166,35,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(245,166,35,0.05))';
                    e.target.style.boxShadow = '0 0 30px rgba(245,166,35,0.1)';
                  }}
                >
                  Explore Recipes →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 3 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-20 px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Skip Intro
          </motion.button>

          {/* Progress indicator */}
          <div className="absolute bottom-8 left-8 z-20 flex items-center gap-2">
            {phases.map((p, i) => (
              <div
                key={p}
                className="transition-all duration-500"
                style={{
                  width: currentIdx >= i ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: currentIdx >= i
                    ? 'linear-gradient(90deg, #f5a623, #e67e22)'
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: currentIdx >= i ? '0 0 8px rgba(245,166,35,0.4)' : 'none',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
