// Shared value noise. Rotating each octave prevents axis-aligned cloud patterns.
export const noiseGLSL = `
float hash(vec3 p) {
  p = fract(p * .3183099 + vec3(.13, .27, .41));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
const mat3 octaveRotation = mat3(.00,.80,.60, -.80,.36,-.48, -.60,-.48,.64);
float fbm(vec3 p) {
  float sum = 0.0, amplitude = .5;
  for (int i = 0; i < NOISE_OCTAVES; i++) {
    sum += amplitude * noise(p);
    p = octaveRotation * p * 2.03 + vec3(3.7, 1.3, 5.1);
    amplitude *= .5;
  }
  return sum;
}
`;
