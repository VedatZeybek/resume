import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, DoubleSide, Group, Vector3, PerspectiveCamera } from "three";
import { noiseGLSL } from "./shaders/noise";

const vertex = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorld;
void main() {
  vNormal = normalize(mat3(modelMatrix) * normal);
  vPosition = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

export function Planet({
  position,
  radius,
  color = "#9bbbe3",
  rings = false,
  lowDetail = false,
  reducedMotion = false,
  inhabited = false,
}: {
  position: [number, number, number];
  radius: number;
  color?: string;
  rings?: boolean;
  lowDetail?: boolean;
  reducedMotion?: boolean;
  inhabited?: boolean;
}) {
  const body = useRef<Group>(null);
  const worldPosition = useMemo(() => new Vector3(), []);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(color) },
      uInhabited: { value: inhabited ? 1 : 0 },
      uFootprint: { value: 0.003 },
    }),
    [color, inhabited],
  );
  useFrame(({ camera, size, gl }, dt) => {
    if (!body.current) return;
    if (!reducedMotion) body.current.rotation.y += Math.min(dt, 0.05) * 0.006;
    body.current.getWorldPosition(worldPosition);
    const distance = camera.position.distanceTo(worldPosition);
    // Filter surface frequencies against the actual projected pixel size.
    uniforms.uFootprint.value =
      (2 *
        distance *
        Math.tan(((camera as PerspectiveCamera).fov * Math.PI) / 360)) /
      (Math.max(1, size.height * gl.getPixelRatio()) * radius);
  });
  return (
    <group ref={body} position={position} rotation={[0.12, 0, -0.28]}>
      <mesh>
        <sphereGeometry
          args={[radius, lowDetail ? 80 : 128, lowDetail ? 48 : 80]}
        />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={`
        #define NOISE_OCTAVES ${lowDetail ? 4 : 5}
        uniform vec3 uColor;
        uniform float uInhabited;
        uniform float uFootprint;
        varying vec3 vNormal; varying vec3 vPosition; varying vec3 vWorld;
        ${noiseGLSL}
        float filteredFbm(vec3 p, float footprint) {
          float sum=0.0, amplitude=.5;
          for(int i=0;i<NOISE_OCTAVES;i++) {
            float detail=1.0-smoothstep(.25,.8,footprint);
            sum+=amplitude*mix(.5,noise(p),detail);
            p=octaveRotation*p*2.03+vec3(3.7,1.3,5.1);
            footprint*=2.03; amplitude*=.5;
          }
          return sum;
        }
        float craters(vec3 p) {
          float height = 0.0;
          for (int i = 0; i < ${lowDetail ? 12 : 22}; i++) {
            float id = float(i) + 1.0;
            vec3 center = normalize(vec3(sin(id * 12.7), cos(id * 7.3), sin(id * 4.1 + 2.0)));
            float radius = .035 + fract(id * .618) * .11;
            float d = length(p - center) / radius;
            float bowl = -.32 * (1.0 - smoothstep(.15, .94, d));
            float rim = exp(-pow((d - .99) * 9.0, 2.0)) * .15;
            float ejecta = exp(-pow((d - 1.12) * 3.0, 2.0)) * .035;
            height += (bowl + rim + ejecta) * (1.0 - smoothstep(.12,.65,uFootprint/radius));
          }
          return height;
        }
        vec3 surfaceNormal(vec3 n, float height) {
          vec3 dx = dFdx(vWorld), dy = dFdy(vWorld);
          vec3 r1 = cross(dy,n), r2 = cross(n,dx);
          float determinant = dot(dx,r1);
          vec3 gradient = sign(determinant) * (dFdx(height)*r1 + dFdy(height)*r2);
          return normalize(abs(determinant)*n - gradient*.05);
        }
        void main() {
          vec3 p = normalize(vPosition);
          vec3 q = p * 4.2;
          float continents = filteredFbm(q + filteredFbm(q*1.7,uFootprint*7.14)*1.5, uFootprint*6.0);
          float ridges = 1.0 - abs(2.0 * filteredFbm(p * 18.0, uFootprint * 18.0) - 1.0);
          float crater = craters(p);
          float height = continents * .6 + ridges * .12 + crater;
          vec3 n = surfaceNormal(normalize(vNormal), height);
          vec3 viewDir = normalize(cameraPosition - vWorld);
          vec3 lightDir = normalize(vec3(-.85,.45,.06));
          float sunlight = max(dot(n, lightDir), 0.0);
          float facing = max(dot(normalize(vNormal), viewDir), 0.0);
          float rim = pow(1.0 - facing, 4.5);
          float highland = smoothstep(.27,.67,continents + crater * .22);
          vec3 basalt = vec3(.035,.045,.064);
          vec3 mineral = mix(vec3(.13,.145,.16),uColor*.34,.55);
          vec3 albedo = mix(basalt,mineral,highland) * (.72 + ridges*.43);
          vec3 col = albedo * (.018 + pow(sunlight,1.65)*1.65);
          col += uColor * rim * pow(max(dot(normalize(vNormal),lightDir),0.0),.7) * .32;
          // Warm settlements follow terrain clusters rather than uniform speckles.
          float night = 1.0 - smoothstep(-.08,.22,dot(normalize(vNormal),lightDir));
          float clusters = smoothstep(.57,.7,filteredFbm(p*23.0,uFootprint*23.0));
          float lights = smoothstep(.74,.88,noise(p*145.0))*(1.0-smoothstep(.3,.9,uFootprint*145.0));
          col += vec3(1.0,.46,.13) * lights * clusters * night * uInhabited * .24;
          gl_FragColor = vec4(col,1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`}
        />
      </mesh>
      {rings && (
        <mesh rotation={[1.3, 0.2, 0.15]}>
          <ringGeometry args={[radius * 1.4, radius * 2.65, 192]} />
          <shaderMaterial
            side={DoubleSide}
            transparent
            depthWrite={false}
            uniforms={{ uRadius: { value: radius } }}
            vertexShader={`varying vec3 vPosition;void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
            fragmentShader={`uniform float uRadius;varying vec3 vPosition;
          void main(){
            float r=length(vPosition.xy)/uRadius;
            float pixel=max(fwidth(r),.006);
            // Broad bands, analytically softened edges: no subpixel sine stripes.
            float density=.56+.14*sin(r*9.0)+.06*cos(r*17.0);
            float edge=smoothstep(1.4-pixel,1.4+pixel,r)*(1.0-smoothstep(2.65-pixel,2.65+pixel,r));
            float gap=1.0-smoothstep(.022,.022+pixel,abs(r-2.08));
            vec3 color=mix(vec3(.32,.38,.47),vec3(.58,.56,.52),density);
            gl_FragColor=vec4(color,edge*density*(1.0-gap*.72)*.42);
          }`}
          />
        </mesh>
      )}
    </group>
  );
}
