import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Gauge, RotateCcw } from "lucide-react";

interface CarModelProps {
  color: string;
  carType: string;
}

// Stylized F1 Car Model
const F1Car = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]} scale={0.8}>
      {/* Main Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Nose Cone */}
      <mesh position={[0, 0.1, 1.5]} rotation={[Math.PI / 6, 0, 0]} castShadow>
        <coneGeometry args={[0.2, 0.8, 4]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.35, -0.2]} castShadow>
        <boxGeometry args={[0.4, 0.25, 0.8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Halo */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <torusGeometry args={[0.25, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#333" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Front Wing */}
      <mesh position={[0, 0.05, 1.6]} castShadow>
        <boxGeometry args={[1.8, 0.02, 0.3]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Rear Wing */}
      <group position={[0, 0.5, -1.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.02, 0.3]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, -0.15, 0]} castShadow>
          <boxGeometry args={[0.02, 0.3, 0.15]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.5, -0.15, 0]} castShadow>
          <boxGeometry args={[0.02, 0.3, 0.15]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Wheels */}
      {[
        [0.55, 0, 0.8],
        [-0.55, 0, 0.8],
        [0.55, 0, -0.8],
        [-0.55, 0, -0.8],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#111" metalness={0.3} roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.16, 16]} />
            <meshStandardMaterial color="#666" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* Side Pods */}
      <mesh position={[0.45, 0.1, 0]} castShadow>
        <boxGeometry args={[0.25, 0.15, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.45, 0.1, 0]} castShadow>
        <boxGeometry args={[0.25, 0.15, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Stylized Hypercar/Supercar Model
const SportsCar = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={[0, 0.3, 0]} scale={0.9}>
      {/* Main Body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.2, 0.35, 2.8]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Hood slope */}
      <mesh position={[0, 0.35, 0.9]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.1, 1]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.55, 0.1]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.02, 0.6]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.05} transparent opacity={0.8} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 0.6, -0.3]} castShadow>
        <boxGeometry args={[0.9, 0.15, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Rear slope */}
      <mesh position={[0, 0.45, -0.9]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.1, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Wheels */}
      {[
        [0.7, 0.15, 0.9],
        [-0.7, 0.15, 0.9],
        [0.7, 0.15, -0.9],
        [-0.7, 0.15, -0.9],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.18, 20]} />
            <meshStandardMaterial color="#111" metalness={0.3} roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.19, 8]} />
            <meshStandardMaterial color="#888" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>
      ))}
      
      {/* Headlights */}
      <mesh position={[0.4, 0.3, 1.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.4, 0.3, 1.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[0.45, 0.3, -1.4]} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.45, 0.3, -1.4]} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.02]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Spoiler */}
      <mesh position={[0, 0.55, -1.3]} castShadow>
        <boxGeometry args={[1, 0.02, 0.15]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Auto-rotating platform
const RotatingPlatform = ({ children, autoRotate }: { children: React.ReactNode; autoRotate: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
      {/* Platform */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2, 0.05, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      {/* Platform ring */}
      <mesh position={[0, -0.01, 0]}>
        <torusGeometry args={[2, 0.02, 8, 64]} />
        <meshStandardMaterial 
          color="#ef4444" 
          emissive="#ef4444" 
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

// Cockpit Interior View
const CockpitInterior = ({ color }: { color: string }) => {
  const steeringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (steeringRef.current) {
      steeringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dashboard */}
      <mesh position={[0, 0.2, -0.6]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Digital Display */}
      <mesh position={[0, 0.35, -0.55]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.6, 0.25]} />
        <meshStandardMaterial color="#001a1a" emissive="#00ffff" emissiveIntensity={0.3} />
      </mesh>
      
      {/* RPM Indicator Lights */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.28 + i * 0.08, 0.45, -0.52]} rotation={[-0.3, 0, 0]}>
          <circleGeometry args={[0.02, 16]} />
          <meshStandardMaterial 
            color={i < 5 ? "#00ff00" : i < 7 ? "#ffff00" : "#ff0000"} 
            emissive={i < 5 ? "#00ff00" : i < 7 ? "#ffff00" : "#ff0000"} 
            emissiveIntensity={0.8} 
          />
        </mesh>
      ))}
      
      {/* Steering Wheel */}
      <group ref={steeringRef} position={[0, 0.15, -0.3]} rotation={[-0.5, 0, 0]}>
        {/* Wheel rim */}
        <mesh>
          <torusGeometry args={[0.18, 0.025, 8, 32]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Wheel center */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Spokes */}
        {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 0.1, Math.sin(angle) * 0.1, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        {/* Buttons on wheel */}
        <mesh position={[-0.05, 0.05, 0.02]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.05, 0.05, 0.02]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.4} />
        </mesh>
      </group>
      
      {/* Side panels */}
      <mesh position={[-0.65, 0, -0.2]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.65, 0, -0.2]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Gear paddles */}
      <mesh position={[-0.22, 0.2, -0.25]} rotation={[-0.5, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.02]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.22, 0.2, -0.25]} rotation={[-0.5, -0.2, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.02]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* HALO frame visible at top */}
      <mesh position={[0, 0.55, -0.3]}>
        <torusGeometry args={[0.35, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Windscreen / view ahead (simulated track) */}
      <mesh position={[0, 0.3, -1.5]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial color="#0a1a0a" />
      </mesh>
      
      {/* Track lines */}
      <mesh position={[-0.3, 0.1, -1.5]}>
        <planeGeometry args={[0.03, 1.5]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.3, 0.1, -1.5]}>
        <planeGeometry args={[0.03, 1.5]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

// Cockpit Scene
const CockpitScene = ({ color }: { color: string }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.4, 0.3]} fov={75} />
      <ambientLight intensity={0.2} />
      <spotLight position={[0, 2, 0]} angle={0.5} intensity={0.5} />
      <pointLight position={[0, 0.5, -0.5]} intensity={0.3} color="#00ffff" />
      <CockpitInterior color={color} />
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </>
  );
};

// Scene component
const CarScene = ({ color, carType, autoRotate }: CarModelProps & { autoRotate: boolean }) => {
  const getCarComponent = () => {
    switch (carType) {
      case "formula1":
        return <F1Car color={color} />;
      default:
        return <SportsCar color={color} />;
    }
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight 
        position={[5, 10, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight 
        position={[-5, 8, -5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={0.8} 
        color="#00d4ff"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ef4444" />
      
      {/* Car on rotating platform */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.2}>
        <RotatingPlatform autoRotate={autoRotate}>
          {getCarComponent()}
        </RotatingPlatform>
      </Float>
      
      {/* Ground shadow */}
      <ContactShadows 
        position={[0, -0.05, 0]} 
        opacity={0.6} 
        scale={10} 
        blur={2} 
        far={4}
      />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
      />
    </>
  );
};

// Loading component
const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Loading 3D Model...</p>
    </div>
  </div>
);

interface Car3DViewerProps {
  carType?: string;
  color?: string;
}

type ViewMode = "exterior" | "cockpit";

export const Car3DViewer = ({ 
  carType = "supercar", 
  color = "#ef4444" 
}: Car3DViewerProps) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("exterior");

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-b from-secondary to-background border border-border">
      {/* View mode toggle */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-center gap-2">
        <button
          onClick={() => setViewMode("exterior")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            viewMode === "exterior" 
              ? "bg-primary text-primary-foreground" 
              : "bg-background/80 backdrop-blur-sm border border-border text-foreground hover:border-primary/50"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Exterior
        </button>
        <button
          onClick={() => setViewMode("cockpit")}
          className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            viewMode === "cockpit" 
              ? "bg-primary text-primary-foreground" 
              : "bg-background/80 backdrop-blur-sm border border-border text-foreground hover:border-primary/50"
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          Cockpit
        </button>
      </div>

      {/* Canvas */}
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          camera={{ position: [4, 2, 4], fov: 45 }}
          style={{ background: "transparent" }}
        >
          {viewMode === "exterior" ? (
            <CarScene color={color} carType={carType} autoRotate={autoRotate} />
          ) : (
            <CockpitScene color={color} />
          )}
        </Canvas>
      </Suspense>

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        {viewMode === "exterior" ? (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
                  autoRotate 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary border border-border text-foreground hover:border-primary/50"
                }`}
              >
                {autoRotate ? "Auto-Rotating" : "Manual Mode"}
              </button>
            </div>
            
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider bg-background/80 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              Drag to rotate • Scroll to zoom
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <div className="font-mono text-xs text-racing-cyan uppercase tracking-wider bg-background/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-racing-cyan/30">
              <span className="animate-pulse">●</span> Driver View • Drag to look around
            </div>
          </div>
        )}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary" />
    </div>
  );
};

export default Car3DViewer;
