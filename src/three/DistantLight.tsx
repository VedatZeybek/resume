import { AdditiveBlending } from "three";
export function DistantLight() {
  return (
    <mesh position={[13, 5, -45]}>
      <planeGeometry args={[8, 8]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`varying vec2 vUv;void main(){vec2 p=vUv-.5;float d=length(p);float core=.001/(d*d+.0006);float halo=exp(-d*17.0)*.13;float rays=exp(-abs(p.x)*320.0-abs(p.y)*24.0)*.13+exp(-abs(p.y)*320.0-abs(p.x)*24.0)*.13;gl_FragColor=vec4(vec3(.66,.77,.96)*(core+halo+rays),(1.0-smoothstep(.12,.5,d)));}`}
      />
    </mesh>
  );
}
