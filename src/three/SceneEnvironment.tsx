import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Planet } from "./Planet";
import { Nebula } from "./Nebula";
import { AsteroidField } from "./AsteroidField";
import { DistantLight } from "./DistantLight";

function Region({ z, children }: { z: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (ref.current)
      ref.current.visible = Math.abs(camera.position.z - z) < 105;
  });
  return (
    <group ref={ref} position={[0, 0, z]}>
      {children}
    </group>
  );
}
export function SceneEnvironment({
  mobile,
  reducedMotion,
}: {
  mobile: boolean;
  reducedMotion: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[-10, 15, 8]} intensity={1.3} />
      <Region z={0}>
        <Planet
          lowDetail={mobile}
          reducedMotion={reducedMotion}
          position={mobile ? [5, 4, -20] : [8.8, 4, -22]}
          radius={6.5}
          inhabited
        />
        <Planet
          lowDetail={mobile}
          reducedMotion={reducedMotion}
          position={[1.4, 5.8, -32]}
          radius={0.85}
          rings
        />
        <Nebula
          position={[16, -4, -48]}
          opacity={0.78}
          lowDetail={mobile}
          reducedMotion={reducedMotion}
        />
      </Region>
      <Region z={-150}>
        <Planet
          lowDetail={mobile}
          reducedMotion={reducedMotion}
          position={[-12, 10, -31]}
          radius={7.8}
          color="#8496b5"
        />
        <Nebula
          position={[14, 6, -57]}
          color="#9a839f"
          opacity={0.6}
          lowDetail={mobile}
          reducedMotion={reducedMotion}
        />
      </Region>
      <Region z={-300}>
        <Planet
          lowDetail={mobile}
          reducedMotion={reducedMotion}
          position={[12, 7, -40]}
          radius={1.8}
          color="#aaa9bd"
        />
        <Nebula
          position={[9, 3, -64]}
          color="#8276a9"
          opacity={0.4}
          lowDetail={mobile}
          reducedMotion={reducedMotion}
        />
      </Region>
      <Region z={-450}>
        <Nebula
          position={[13, 5, -64]}
          color="#627891"
          opacity={0.2}
          lowDetail={mobile}
          reducedMotion={reducedMotion}
        />
        <DistantLight />
      </Region>
      <AsteroidField mobile={mobile} />
    </>
  );
}
