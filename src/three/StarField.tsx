import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, ShaderMaterial } from "three";
import { seededRandom } from "./random";
import { flight } from "../store/navigationStore";

export function StarField({
  mobile,
  reducedMotion,
}: {
  mobile: boolean;
  reducedMotion: boolean;
}) {
  const material = useRef<ShaderMaterial>(null);
  const count = mobile ? 500 : 1500;
  const { positions, sizes } = useMemo(() => {
    const random = seededRandom(42);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions.set(
        [(random() - 0.5) * 220, (random() - 0.5) * 140, 25 - random() * 640],
        i * 3,
      );
      sizes[i] = random() > 0.9 ? 2.8 + random() * 1.4 : 0.75 + random() * 1.1;
    }
    return { positions, sizes };
  }, [count]);
  useFrame(({ gl }, dt) => {
    if (!material.current) return;
    material.current.uniforms.uWarp.value = flight.warp;
    material.current.uniforms.uDpr.value = gl.getPixelRatio();
    if (!reducedMotion)
      material.current.uniforms.uTime.value += Math.min(dt, 0.05);
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={{
          uWarp: { value: 0 },
          uTime: { value: 0 },
          uDpr: { value: 1 },
        }}
        vertexShader={`uniform float uTime; uniform float uDpr; attribute float aSize; varying float vAlpha; varying vec3 vColor;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aSize * 145.0 / max(35.0, -mv.z), 1.0, 4.5) * uDpr;
          vColor = mix(vec3(.67,.79,1.0),vec3(1.0,.85,.67),step(3.6,aSize));
          vAlpha = (.88 + .12*sin(uTime*.6+position.x)) * (0.4 + aSize * 0.22) * (1.0 - smoothstep(30.0, 330.0, -mv.z));
        }`}
        fragmentShader={`uniform float uWarp; varying float vAlpha; varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - .5);
          float a = (1.0 - smoothstep(.05, .5, d)) * vAlpha * (1.0 - uWarp * .75);
          gl_FragColor = vec4(vColor, a);
        }`}
      />
    </points>
  );
}
