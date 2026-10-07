import { useFrame } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera } from "three";
import { flight } from "../store/navigationStore";

export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  useFrame(({ camera, pointer }, dt) => {
    const cam = camera as PerspectiveCamera;
    const damping = 1 - Math.exp(-Math.min(dt, 0.05) * 3);
    cam.position.x = MathUtils.lerp(
      cam.position.x,
      reducedMotion ? 0 : pointer.x * 0.2 * (1 - flight.warp),
      damping,
    );
    cam.position.y = MathUtils.lerp(
      cam.position.y,
      reducedMotion ? 0 : pointer.y * 0.12 * (1 - flight.warp),
      damping,
    );
    cam.position.z = flight.z;
    if (Math.abs(cam.fov - flight.fov) > 0.001) {
      cam.fov = flight.fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}
