import { useCallback, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import {
  flight,
  navigation,
  sections,
  stops,
  type SectionIndex,
} from "../store/navigationStore";
import { useMediaQuery } from "./useMediaQuery";

export function useWarpTransition(content: RefObject<HTMLElement | null>) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useEffect(
    () => () => {
      timeline.current?.kill();
      const active = navigation.get().active;
      Object.assign(flight, { z: stops[active], warp: 0, fov: 48 });
      navigation.set({ phase: "idle", target: active });
    },
    [],
  );
  return useCallback(
    (target: SectionIndex) => {
      const current = navigation.get();
      if (
        current.phase !== "idle" ||
        current.active === target ||
        !content.current
      )
        return;
      const element = content.current;
      timeline.current?.kill();
      navigation.set({ target, phase: "accelerating" });
      flight.direction = target > current.active ? 1 : -1;
      const arrive = () => {
        navigation.set({ active: target, phase: "arriving" });
        element.scrollTop = 0;
        window.history.replaceState(
          null,
          "",
          `#${sections[target].toLowerCase()}`,
        );
      };
      const complete = () => {
        navigation.set({ phase: "idle" });
        // Wait for React to remove `inert` before moving keyboard focus.
        requestAnimationFrame(() => {
          if (element.isConnected) {
            element
              .querySelector<HTMLElement>("h1, h2")
              ?.focus({ preventScroll: true });
          }
        });
      };
      const tl = gsap.timeline({ onComplete: complete });
      timeline.current = tl;
      tl.to(
        element,
        {
          opacity: 0,
          y: reducedMotion ? 0 : -8,
          duration: reducedMotion ? 0.12 : 0.2,
          ease: "power1.in",
        },
        0,
      );
      if (reducedMotion) {
        // Travel while faded: no optical flow, FOV change, or streaks.
        tl.set(
          flight,
          { z: stops[target] + flight.direction * 0.15, warp: 0, fov: 48 },
          0.13,
        );
        tl.call(arrive, [], 0.14);
        tl.to(
          flight,
          { z: stops[target], duration: 0.2, ease: "power1.out" },
          0.14,
        );
        tl.fromTo(
          element,
          { y: 0, opacity: 0 },
          { opacity: 1, duration: 0.2 },
          0.17,
        );
      } else {
        tl.to(
          flight,
          { z: stops[target], duration: 1.4, ease: "power3.inOut" },
          0.17,
        );
        tl.to(
          flight,
          { warp: 1, fov: 61, duration: 0.4, ease: "power2.in" },
          0.18,
        );
        tl.call(() => navigation.set({ phase: "warping" }), [], 0.53);
        tl.call(() => navigation.set({ phase: "decelerating" }), [], 1.04);
        tl.to(
          flight,
          { warp: 0, fov: 48, duration: 0.53, ease: "power2.out" },
          1.04,
        );
        tl.call(arrive, [], 1.57);
        tl.fromTo(
          element,
          { opacity: 0, y: 9 },
          { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" },
          1.59,
        );
      }
    },
    [content, reducedMotion],
  );
}
