import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useLayoutEffect, useMemo, useRef } from "react";
import { InstancedMesh, Object3D, IcosahedronGeometry } from "three";
import { seededRandom } from "./random";

export function AsteroidField({ mobile }: { mobile: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const count = mobile ? 5 : 18;
  const transforms = useMemo(() => {
    const random = seededRandom(521);
    const scattered = Array.from({ length: count }, () => ({
      x: (random() > 0.5 ? 1 : -1) * (9 + random() * 19),
      y: (random() - 0.5) * 22,
      z: -25 - random() * 445,
      size: 0.09 + random() * 0.32,
      rotation: random() * 6,
    }));
    // A few near-field silhouettes add depth without covering the left-hand text.
    const foreground = [
      { x: 10.2, y: -5.9, z: -20, size: 0.5, rotation: 2.1 },
      { x: 16.5, y: -2.1, z: -28, size: 0.35, rotation: 0.7 },
      { x: 7.4, y: 6.4, z: -27, size: 0.22, rotation: 3.5 },
    ];
    foreground.slice(0, mobile ? 1 : 3).forEach((item, i) => {
      scattered[i] = item;
    });
    return scattered;
  }, [count, mobile]);
  const geometry = useMemo(() => {
    const shape = new IcosahedronGeometry(1, mobile ? 2 : 3);
    const vertices = shape.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i),
        y = vertices.getY(i),
        z = vertices.getZ(i);
      const relief =
        1 +
        0.13 * Math.sin(x * 11 + y * 4) * Math.cos(z * 9 - x * 3) +
        0.06 * Math.sin(y * 23 + z * 17);
      vertices.setXYZ(i, x * relief, y * relief, z * relief);
    }
    shape.deleteAttribute("normal");
    shape.deleteAttribute("uv");
    const smoothed = mergeVertices(shape);
    shape.dispose();
    smoothed.computeVertexNormals();
    return smoothed;
  }, [mobile]);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new Object3D();
    transforms.forEach((t, i) => {
      dummy.position.set(t.x, t.y, t.z);
      dummy.scale.set(t.size, t.size * 0.72, t.size * 1.2);
      dummy.rotation.set(t.rotation, t.rotation * 0.7, 0);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      frustumCulled={false}
      geometry={geometry}
    >
      <meshStandardMaterial color="#747983" roughness={1} />
    </instancedMesh>
  );
}
