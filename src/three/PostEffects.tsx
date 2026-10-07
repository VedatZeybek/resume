import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function PostEffects() {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        intensity={0.16}
        luminanceThreshold={1.1}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
    </EffectComposer>
  );
}
