import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Color, ShaderMaterial } from "three";
import { noiseGLSL } from "./shaders/noise";

export function Nebula({
  position,
  color = "#718dce",
  opacity = 0.4,
  lowDetail = false,
  reducedMotion = false,
}: {
  position: [number, number, number];
  color?: string;
  opacity?: number;
  lowDetail?: boolean;
  reducedMotion?: boolean;
}) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
    }),
    [color, opacity],
  );
  useFrame((_, dt) => {
    if (material.current && !reducedMotion)
      material.current.uniforms.uTime.value += Math.min(dt, 0.05) * 0.012;
  });
  return (
    <mesh position={position} rotation={[0, 0, -0.64]}>
      <planeGeometry args={[76, 46]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`
        #define NOISE_OCTAVES ${lowDetail ? 3 : 5}
        varying vec2 vUv;uniform vec3 uColor;uniform float uOpacity;uniform float uTime;
        ${noiseGLSL}
        void main(){
          vec2 p=vUv-.5;
          vec3 q=vec3(p*vec2(5.0,8.0),.42);
          // Domain warping creates folds and dark dust lanes within the gas.
          vec3 warp=vec3(fbm(q+vec3(0,0,uTime)),fbm(q+4.7),fbm(q+9.3));
          float gas=fbm(q+warp*3.6);
          float filaments=fbm(q*3.3+warp*4.5);
          float spine=p.y+sin(p.x*6.0)*.09+(warp.x-.5)*.35;
          float band=exp(-spine*spine*16.0);
          float envelope=exp(-dot(p*vec2(1.5,2.15),p*vec2(1.5,2.15))*3.2);
          float edge=smoothstep(0.0,.15,vUv.x)*smoothstep(0.0,.15,vUv.y)*(1.0-smoothstep(.85,1.0,vUv.x))*(1.0-smoothstep(.85,1.0,vUv.y));
          float dust=smoothstep(.4,.62,filaments);
          float density=smoothstep(.22,.76,gas)*band*envelope*edge;
          vec3 cool=uColor*(.5+filaments*1.5);
          vec3 warm=vec3(.55,.24,.15);
          float warmPockets=smoothstep(.53,.72,gas)*smoothstep(-.05,.4,p.x);
          vec3 tint=mix(cool,warm,warmPockets*.72);
          float wisps=pow(max(filaments-.33,0.0),2.0)*1.8;
          gl_FragColor=vec4(tint,density*(.4+wisps)*(1.0-dust*.68)*uOpacity);
        }`}
      />
    </mesh>
  );
}
