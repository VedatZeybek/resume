import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Group, ShaderMaterial } from "three";
import { flight } from "../store/navigationStore";
import { seededRandom } from "./random";

export function WarpStars({ mobile }: { mobile: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const group = useRef<Group>(null);
  const count = mobile ? 250 : 850;
  const data = useMemo(() => {
    const random = seededRandom(127);
    const position = new Float32Array(count * 6),
      endpoint = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2,
        r = 3 + Math.pow(random(), 0.7) * 85;
      const star = [Math.cos(angle) * r, Math.sin(angle) * r, random() * 140];
      position.set(star, i * 6);
      position.set(star, i * 6 + 3);
      endpoint.set([0, 1], i * 2);
    }
    return { position, endpoint };
  }, [count]);
  useFrame(() => {
    if (!material.current || !group.current) return;
    group.current.position.z = flight.z;
    material.current.uniforms.uWarp.value = flight.warp;
    material.current.uniforms.uCameraZ.value = flight.z;
    material.current.uniforms.uDirection.value = flight.direction;
  });
  return (
    <group ref={group}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.position, 3]}
          />
          <bufferAttribute
            attach="attributes-aEndpoint"
            args={[data.endpoint, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          uniforms={{
            uWarp: { value: 0 },
            uCameraZ: { value: 0 },
            uDirection: { value: 1 },
          }}
          vertexShader={`uniform float uWarp; uniform float uCameraZ; uniform float uDirection;
        attribute float aEndpoint; varying float vAlpha;
        void main(){
          vec3 p=position; p.z=-mod(position.z+uCameraZ,140.0)-4.0; float headZ=p.z;
          // Physical length grows along the camera's travel axis.
          p.z-=aEndpoint*(.035+uWarp*uWarp*28.0)*uDirection; p.z=min(p.z,-1.5);
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
          vAlpha=mix(1.0,.12,aEndpoint)*(1.0-smoothstep(12.0,140.0,-headZ))*smoothstep(0.0,6.0,-headZ);
        }`}
          fragmentShader={`uniform float uWarp; varying float vAlpha;
        void main(){gl_FragColor=vec4(.65,.76,.94,vAlpha*(.06+uWarp*.76));}`}
        />
      </lineSegments>
    </group>
  );
}
