import {
  Component,
  lazy,
  Suspense,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { StarField } from "./StarField";
import { WarpStars } from "./WarpStars";
import { SceneEnvironment } from "./SceneEnvironment";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useNavigation } from "../store/navigationStore";
const PostEffects = lazy(() => import("./PostEffects"));

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="space-fallback" />
    ) : (
      this.props.children
    );
  }
}

export default function SpaceScene() {
  const { active, phase } = useNavigation();
  const restingProjects = active === 1 && phase === "idle";
  const mobile = useMediaQuery("(max-width: 760px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [visible, setVisible] = useState(!document.hidden);
  const [lost, setLost] = useState(false);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <div className="space-scene" aria-hidden="true">
      <div className="space-fallback" />
      {!lost && (
        <SceneBoundary>
          <Canvas
            camera={{ position: [0, 0, 0], fov: 48, near: 0.1, far: 800 }}
            dpr={[1, 1.5]}
            frameloop={!visible ? "never" : restingProjects ? "demand" : "always"}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            fallback={<div className="space-fallback" />}
            onCreated={({ gl }) =>
              gl.domElement.addEventListener(
                "webglcontextlost",
                () => setLost(true),
                { once: true },
              )
            }
          >
            <CameraRig reducedMotion={reducedMotion} />
            <StarField mobile={mobile} reducedMotion={reducedMotion} />
            {!reducedMotion && <WarpStars mobile={mobile} />}
            <SceneEnvironment mobile={mobile} reducedMotion={reducedMotion} />
            {!mobile && !reducedMotion && (
              <Suspense fallback={null}>
                <PostEffects />
              </Suspense>
            )}
            <Preload all />
          </Canvas>
        </SceneBoundary>
      )}
      <div className="scene-shade" />
    </div>
  );
}
