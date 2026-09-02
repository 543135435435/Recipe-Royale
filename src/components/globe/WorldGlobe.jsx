import { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Globe as GlobeIcon, ArrowRight, MapPin } from 'lucide-react';

/* ─── Country data (real recipe counts from DB) ───────── */
const COUNTRIES = [
  { name:'Pakistan', lat:30.37, lng:69.35, flag:'🇵🇰', recipes:48, popular:['Biryani','Nihari','Chicken Karahi'], cuisine:'Pakistani', color:'#10b981' },
  { name:'India', lat:20.59, lng:78.96, flag:'🇮🇳', recipes:55, popular:['Butter Chicken','Biryani','Dosa'], cuisine:'Indian', color:'#f59e0b' },
  { name:'Japan', lat:36.20, lng:138.25, flag:'🇯🇵', recipes:28, popular:['Sushi','Ramen','Tempura'], cuisine:'Japanese', color:'#ef4444' },
  { name:'China', lat:35.86, lng:104.20, flag:'🇨🇳', recipes:21, popular:['Dumplings','Kung Pao','Peking Duck'], cuisine:'Chinese', color:'#dc2626' },
  { name:'Italy', lat:41.87, lng:12.57, flag:'🇮🇹', recipes:10, popular:['Pizza','Carbonara','Risotto'], cuisine:'Italian', color:'#22c55e' },
  { name:'Mexico', lat:23.63, lng:-102.55, flag:'🇲🇽', recipes:10, popular:['Tacos al Pastor','Mole','Pozole'], cuisine:'Mexican', color:'#e11d48' },
  { name:'Turkey', lat:38.96, lng:35.24, flag:'🇹🇷', recipes:14, popular:['Kebab','Baklava','Lahmacun'], cuisine:'Turkish', color:'#ef4444' },
  { name:'Thailand', lat:15.87, lng:100.99, flag:'🇹🇭', recipes:18, popular:['Pad Thai','Green Curry','Tom Yum'], cuisine:'Thai', color:'#8b5cf6' },
  { name:'France', lat:46.23, lng:2.21, flag:'🇫🇷', recipes:6, popular:['Croissant','Bouillabaisse','Ratatouille'], cuisine:'French', color:'#3b82f6' },
  { name:'USA', lat:37.09, lng:-95.71, flag:'🇺🇸', recipes:5, popular:['Hamburger','BBQ Pulled Pork','Cornbread'], cuisine:'American', color:'#2563eb' },
  { name:'Morocco', lat:31.79, lng:-7.09, flag:'🇲🇦', recipes:4, popular:['Chicken Tagine','Couscous','Harira'], cuisine:'Moroccan', color:'#059669' },
  { name:'Ethiopia', lat:9.15, lng:40.49, flag:'🇪🇹', recipes:4, popular:['Injera','Doro Wat','Kitfo'], cuisine:'Ethiopian', color:'#16a34a' },
  { name:'Nigeria', lat:9.08, lng:8.68, flag:'🇳🇬', recipes:4, popular:['Jollof Rice','Suya','Egusi Soup'], cuisine:'Nigerian', color:'#15803d' },
  { name:'Brazil', lat:-14.24, lng:-51.93, flag:'🇧🇷', recipes:4, popular:['Feijoada','Churrasco','Pão de Queijo'], cuisine:'Brazilian', color:'#16a34a' },
  { name:'Peru', lat:-9.19, lng:-75.02, flag:'🇵🇪', recipes:4, popular:['Ceviche','Lomo Saltado','Aji de Gallina'], cuisine:'Peruvian', color:'#dc2626' },
  { name:'Greece', lat:39.07, lng:21.82, flag:'🇬🇷', recipes:6, popular:['Moussaka','Souvlaki','Spanakopita'], cuisine:'Greek', color:'#3b82f6' },
  { name:'South Korea', lat:35.91, lng:127.77, flag:'🇰🇷', recipes:12, popular:['Bibimbap','Kimchi','Bulgogi'], cuisine:'Korean', color:'#2563eb' },
  { name:'Vietnam', lat:14.06, lng:108.28, flag:'🇻🇳', recipes:11, popular:['Pho','Banh Mi','Bun Cha'], cuisine:'Vietnamese', color:'#dc2626' },
  { name:'Indonesia', lat:-0.79, lng:113.92, flag:'🇮🇩', recipes:7, popular:['Nasi Goreng','Rendang','Satay'], cuisine:'Indonesian', color:'#dc2626' },
  { name:'Lebanon', lat:33.85, lng:35.86, flag:'🇱🇧', recipes:11, popular:['Hummus','Falafel','Shawarma'], cuisine:'Lebanese', color:'#22c55e' },
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
function createEarthTexture(w = 2048, h = 1024) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');

  // Ocean
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0b1a30'); g.addColorStop(0.25, '#0d2240');
  g.addColorStop(0.5, '#0f2848'); g.addColorStop(0.75, '#0d2240');
  g.addColorStop(1, '#0b1a30');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

  // Ocean wave texture
  ctx.globalAlpha = 0.03;
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 8) {
      const v = Math.sin(x * 0.02 + y * 0.01) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(60,140,220,${v * 0.15})`;
      ctx.fillRect(x, y, 8, 4);
    }
  }
  ctx.globalAlpha = 1;

  // Continents (simplified polygon shapes)
  const continents = [
    { pts:[[.10,.18],[.14,.12],[.18,.10],[.24,.12],[.28,.18],[.30,.25],[.28,.32],[.26,.38],[.22,.42],[.18,.44],[.16,.40],[.13,.36],[.10,.30],[.08,.24]], c:'#1a4a2a' },
    { pts:[[.22,.50],[.26,.48],[.30,.52],[.32,.58],[.33,.64],[.32,.70],[.30,.76],[.27,.82],[.24,.84],[.22,.80],[.20,.74],[.19,.68],[.20,.60],[.20,.54]], c:'#1e5530' },
    { pts:[[.44,.14],[.47,.12],[.52,.13],[.55,.16],[.56,.20],[.54,.24],[.52,.26],[.49,.28],[.46,.26],[.44,.22],[.43,.18]], c:'#1c4832' },
    { pts:[[.44,.30],[.48,.28],[.54,.30],[.58,.36],[.60,.42],[.60,.50],[.58,.58],[.56,.66],[.53,.72],[.50,.74],[.47,.70],[.44,.64],[.42,.56],[.42,.48],[.42,.40],[.42,.34]], c:'#2a5535' },
    { pts:[[.56,.10],[.62,.08],[.70,.10],[.78,.14],[.84,.18],[.88,.22],[.90,.28],[.88,.34],[.84,.38],[.78,.40],[.72,.38],[.66,.36],[.62,.32],[.58,.28],[.56,.22],[.55,.16]], c:'#1c4a2e' },
    { pts:[[.64,.34],[.66,.32],[.68,.36],[.68,.42],[.66,.48],[.64,.46],[.63,.40]], c:'#2a5e38' },
    { pts:[[.74,.38],[.78,.36],[.82,.40],[.80,.46],[.76,.48],[.74,.44]], c:'#1e5530' },
    { pts:[[.80,.60],[.84,.58],[.90,.60],[.92,.64],[.90,.70],[.86,.72],[.82,.70],[.78,.66],[.78,.62]], c:'#3a5a30' },
    { pts:[[.88,.22],[.89,.20],[.90,.24],[.89,.28],[.88,.26]], c:'#1c4a2e' },
    { pts:[[.43,.14],[.44,.13],[.45,.15],[.44,.17],[.43,.16]], c:'#1c4832' },
    { pts:[[.30,.04],[.34,.03],[.36,.06],[.34,.10],[.30,.08]], c:'#2a4a3a' },
    { pts:[[.76,.50],[.80,.48],[.84,.50],[.86,.52],[.84,.54],[.80,.52],[.76,.52]], c:'#1e5530' },
  ];

  continents.forEach(({ pts, c: col }) => {
    const px = pts.map(([x,y]) => [x*w, y*h]);
    ctx.beginPath(); ctx.moveTo(px[0][0], px[0][1]);
    for (let i = 1; i < px.length; i++) {
      const p = px[i-1], cu = px[i];
      ctx.quadraticCurveTo(p[0], p[1], (p[0]+cu[0])/2, (p[1]+cu[1])/2);
    }
    ctx.closePath();
    const cx = px.reduce((s,p)=>s+p[0],0)/px.length;
    const cy = px.reduce((s,p)=>s+p[1],0)/px.length;
    const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,150);
    grd.addColorStop(0, col); grd.addColorStop(0.6, col); grd.addColorStop(1, '#1a3a22');
    ctx.fillStyle = grd; ctx.fill();
    ctx.strokeStyle = 'rgba(80,160,100,0.15)'; ctx.lineWidth = 2; ctx.stroke();
  });

  // City lights
  ctx.globalAlpha = 0.4;
  [[.22,.26],[.24,.30],[.20,.22],[.46,.20],[.50,.18],[.48,.22],[.52,.20],[.54,.22],[.48,.42],[.50,.38],[.52,.44],[.56,.52],[.64,.38],[.66,.36],[.70,.24],[.72,.28],[.68,.32],[.82,.20],[.26,.52],[.28,.62],[.30,.56],[.84,.64],[.86,.66],[.88,.24],[.90,.22]].forEach(([x,y]) => {
    const px=x*w, py=y*h, r=Math.random()*2+1;
    const gw=ctx.createRadialGradient(px,py,0,px,py,r*3);
    gw.addColorStop(0,'rgba(255,220,140,0.8)'); gw.addColorStop(0.5,'rgba(255,200,100,0.3)'); gw.addColorStop(1,'rgba(255,180,60,0)');
    ctx.fillStyle=gw; ctx.fillRect(px-r*3,py-r*3,r*6,r*6);
  });
  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(c);
}

function createNightTexture(w = 1024, h = 512) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
  [[.10,.20],[.12,.22],[.14,.18],[.16,.24],[.18,.20],[.20,.26],[.22,.28],[.24,.30],[.15,.32],[.28,.22],[.30,.24],[.32,.20],[.44,.16],[.46,.18],[.48,.16],[.50,.18],[.52,.20],[.54,.18],[.48,.22],[.50,.24],[.64,.24],[.66,.22],[.68,.26],[.70,.22],[.72,.26],[.74,.24],[.66,.36],[.68,.38],[.70,.34],[.72,.36],[.76,.22],[.78,.24],[.86,.22],[.88,.20],[.90,.22],[.82,.62],[.84,.64],[.24,.54],[.26,.56],[.28,.58],[.30,.54],[.32,.60],[.52,.42],[.54,.44],[.56,.48]].forEach(([x,y]) => {
    const px=x*w, py=y*h, r=Math.random()*3+1;
    const gw=ctx.createRadialGradient(px,py,0,px,py,r*4);
    gw.addColorStop(0,'rgba(255,210,120,1)'); gw.addColorStop(0.3,'rgba(255,180,80,0.6)'); gw.addColorStop(0.6,'rgba(255,160,60,0.2)'); gw.addColorStop(1,'rgba(255,140,40,0)');
    ctx.fillStyle=gw; ctx.fillRect(px-r*4,py-r*4,r*8,r*8);
  });
  return new THREE.CanvasTexture(c);
}

/* ─── Atmosphere shaders ──────────────────────────────── */
const ATMO_VS = `varying vec3 vNormal; varying vec3 vPos;
void main(){ vNormal=normalize(normalMatrix*normal); vPos=(modelViewMatrix*vec4(position,1.)).xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const ATMO_FS = `varying vec3 vNormal; varying vec3 vPos;
void main(){ vec3 vd=normalize(-vPos); float f=pow(1.-dot(vd,vNormal),3.); vec3 c=mix(vec3(.15,.4,.9),vec3(.3,.6,1.),f); gl_FragColor=vec4(c,f*.7);}`;
const GLOW_VS = `varying vec3 vNormal;
void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const GLOW_FS = `varying vec3 vNormal;
void main(){ float i=pow(.65-dot(vNormal,vec3(0,0,1)),4.); gl_FragColor=vec4(.2,.5,1.,i*.4);}`;

/* ─── Earth ───────────────────────────────────────────── */
function Earth() {
  const ref = useRef();
  const [et, setEt] = useState(null);
  const [nt, setNt] = useState(null);
  useEffect(() => { setEt(createEarthTexture()); setNt(createNightTexture()); }, []);
  const mat = useMemo(() => et ? new THREE.MeshPhongMaterial({ map:et, emissiveMap:nt, emissive:new THREE.Color('#ff9944'), emissiveIntensity:0.08, shininess:25, specular:new THREE.Color('#223355') }) : null, [et,nt]);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0008; });
  return (
    <group>
      {mat && <Sphere ref={ref} args={[2,64,64]} material={mat} />}
      <Sphere args={[2.015,64,64]}>
        <shaderMaterial vertexShader={ATMO_VS} fragmentShader={ATMO_FS} blending={THREE.AdditiveBlending} side={THREE.FrontSide} transparent />
      </Sphere>
      <Sphere args={[2.15,64,64]}>
        <shaderMaterial vertexShader={GLOW_VS} fragmentShader={GLOW_FS} blending={THREE.AdditiveBlending} side={THREE.BackSide} transparent />
      </Sphere>
      <Sphere args={[2.25,32,32]}>
        <meshBasicMaterial color="#1a4488" transparent opacity={0.03} side={THREE.BackSide} />
      </Sphere>
      {COUNTRIES.map((c,i) => <CountryDot key={c.name} pos={latLngToVector3(c.lat,c.lng)} country={c} idx={i} />)}
    </group>
  );
}

/* ─── Country dot on globe ────────────────────────────── */
function CountryDot({ pos, country, idx }) {
  const ref = useRef();
  const ringRef = useRef();
  const [hov, setHov] = useState(false);
  useFrame((st) => {
    if (ref.current) {
      const t = st.clock.elapsedTime;
      const base = hov ? 1.8 : 1;
      ref.current.scale.setScalar(base + Math.sin(t*3+idx*0.5)*0.15);
    }
    if (ringRef.current) {
      ringRef.current.material.opacity = hov ? 0.5 : 0.18;
    }
  });
  return (
    <group position={pos}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.032,16,16]} />
        <meshBasicMaterial color={country.color} transparent opacity={0.9} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI/2,0,0]}>
        <ringGeometry args={[0.04,0.06,32]} />
        <meshBasicMaterial color={country.color} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      {hov && <mesh><ringGeometry args={[0.07,0.09,32]} /><meshBasicMaterial color={country.color} transparent opacity={0.25} side={THREE.DoubleSide} /></mesh>}
      <Html distanceFactor={4.5} center style={{pointerEvents:'none',transform:'translateY(-22px)'}}>
        <div className="text-center whitespace-nowrap select-none" style={{filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.7))'}}>
          <span className="text-xl block leading-none">{country.flag}</span>
        </div>
      </Html>
    </group>
  );
}

/* ─── Star field ──────────────────────────────────────── */
function StarField() {
  const cnt = 1200;
  const [pos, col] = useMemo(() => {
    const p = new Float32Array(cnt*3), c = new Float32Array(cnt*3);
    for (let i = 0; i < cnt; i++) {
      const r = 25+Math.random()*60, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
      p[i*3]=r*Math.sin(ph)*Math.cos(th); p[i*3+1]=r*Math.sin(ph)*Math.sin(th); p[i*3+2]=r*Math.cos(ph);
      const t = Math.random();
      if (t>.8){c[i*3]=1;c[i*3+1]=.85;c[i*3+2]=.6;} else if(t>.5){c[i*3]=.9;c[i*3+1]=.92;c[i*3+2]=1;} else {c[i*3]=.8;c[i*3+1]=.82;c[i*3+2]=.88;}
    }
    return [p,c];
  }, []);
  const ref = useRef();
  useFrame(() => { if(ref.current) ref.current.rotation.y += 0.00004; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={cnt} array={pos} itemSize={3} /><bufferAttribute attach="attributes-color" count={cnt} array={col} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/* ─── Dust ────────────────────────────────────────────── */
function Dust() {
  const cnt = 60;
  const pos = useMemo(() => { const p = new Float32Array(cnt*3); for(let i=0;i<cnt;i++){p[i*3]=(Math.random()-.5)*10;p[i*3+1]=(Math.random()-.5)*10;p[i*3+2]=(Math.random()-.5)*10;} return p; }, []);
  const ref = useRef();
  useFrame(() => { if(ref.current){ref.current.rotation.y+=.0003;ref.current.rotation.z+=.0001;} });
  return (<points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={cnt} array={pos} itemSize={3} /></bufferGeometry><pointsMaterial size={0.012} color="#d4a056" transparent opacity={0.25} sizeAttenuation /></points>);
}

/* ─── Lighting ────────────────────────────────────────── */
function Lighting() {
  return (<>
    <directionalLight position={[8,3,5]} intensity={2.2} color="#fff" />
    <directionalLight position={[-5,-3,-2]} intensity={0.4} color="#8888cc" />
    <pointLight position={[-4,2,-8]} intensity={1.2} color="#4466aa" />
    <pointLight position={[6,0,3]} intensity={0.6} color="#ffcc88" />
    <ambientLight intensity={0.15} />
    <pointLight position={[0,-5,0]} intensity={0.3} color="#2244aa" />
  </>);
}

/* ─── 3D Scene ────────────────────────────────────────── */
function GlobeScene() {
  return (<>
    <Lighting /><StarField /><Dust /><Earth />
    <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.4} minPolarAngle={Math.PI*0.3} maxPolarAngle={Math.PI*0.7} />
  </>);
}

/* ─── Main WorldGlobe component ───────────────────────── */
export default function WorldGlobe() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-20 relative overflow-hidden" style={{background:'linear-gradient(180deg, #030608 0%, #0d1b2a 30%, #0d1b2a 70%, #030608 100%)'}}>
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 70% 50%, rgba(30,80,160,0.08) 0%, transparent 60%)'}} />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
          {/* Left: Text & Info Card */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{background:'rgba(245,166,35,0.08)',borderColor:'rgba(245,166,35,0.15)'}}>
              <GlobeIcon className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400 tracking-wide">World Cuisine</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold font-serif text-white mb-4 leading-tight">
              Explore the World <br />
              <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#f5a623,#e67e22,#d35400)'}}>Through Food</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{color:'rgba(180,190,210,0.7)'}}>
              Journey through continents and discover the culinary traditions that connect us all.
              Rotate the globe, hover over countries, and click to explore their cuisines.
            </p>

            {/* Country info card — glassmorphism */}
            <AnimatePresence mode="wait">
              {hovered ? (
                <motion.div
                  key={hovered.name}
                  initial={{ opacity:0, y:12 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-12 }}
                  transition={{ duration:0.3 }}
                  className="rounded-2xl p-5 border"
                  style={{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.08)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)'}}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{hovered.flag}</span>
                    <div>
                      <h3 className="text-white font-bold text-lg">{hovered.name}</h3>
                      <p className="text-sm" style={{color:'rgba(180,190,210,0.6)'}}>{hovered.cuisine} Cuisine • {hovered.recipes} Recipes</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {hovered.popular.map(d => (
                      <span key={d} className="px-2.5 py-1 rounded-full text-xs" style={{background:'rgba(255,255,255,0.08)',color:'rgba(200,210,220,0.8)'}}>{d}</span>
                    ))}
                  </div>
                  <Link to={`/recipes?cuisine=${hovered.cuisine}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                    Explore {hovered.cuisine} Recipes <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  className="rounded-2xl p-5 border"
                  style={{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.06)'}}
                >
                  <div className="flex items-center gap-3" style={{color:'rgba(150,160,175,0.6)'}}>
                    <GlobeIcon className="w-8 h-8" />
                    <p className="text-sm">Hover over a country on the globe to explore its cuisine</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { value:'22+', label:'Countries' },
                { value:'295+', label:'Recipes' },
                { value:'20+', label:'Cuisines' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-amber-400">{s.value}</p>
                  <p className="text-xs uppercase tracking-wider" style={{color:'rgba(150,160,175,0.5)'}}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Globe */}
          <div className="relative h-[450px] lg:h-[550px]">
            <Canvas
              camera={{ position:[0,0,5], fov:45 }}
              dpr={[1,1.5]}
              gl={{ antialias:true, alpha:true, powerPreference:'high-performance' }}
              style={{ background:'transparent' }}
            >
              <Suspense fallback={null}>
                <GlobeScene />
              </Suspense>
            </Canvas>
            {/* Edge fade */}
            <div className="absolute inset-0 pointer-events-none" style={{background:'linear-gradient(to right, #0d1b2a 0%, transparent 15%, transparent 85%, #0d1b2a 100%)'}} />
          </div>
        </div>
      </div>
    </section>
  );
}
