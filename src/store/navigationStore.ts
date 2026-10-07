import { useSyncExternalStore } from "react";

export const sections = ["ME", "PROJECTS", "EXPERIENCE", "CONTACT"] as const;
export const stops = [0, -150, -300, -450] as const;
export type SectionIndex = 0 | 1 | 2 | 3;
export type TravelPhase =
  "idle" | "accelerating" | "warping" | "decelerating" | "arriving";
type NavigationState = {
  active: SectionIndex;
  target: SectionIndex;
  phase: TravelPhase;
};
const hashIndex = sections.findIndex(
  (section) => section.toLowerCase() === window.location.hash.slice(1),
);
const initial = (hashIndex < 0 ? 0 : hashIndex) as SectionIndex;
let state: NavigationState = {
  active: initial,
  target: initial,
  phase: "idle",
};
const listeners = new Set<() => void>();
export const navigation = {
  get: () => state,
  set: (patch: Partial<NavigationState>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
// Frame values stay outside React: no component renders at 60 fps.
export const flight = {
  z: stops[initial] as number,
  warp: 0,
  fov: 48,
  direction: 1,
};
export function useNavigation() {
  return useSyncExternalStore(
    navigation.subscribe,
    navigation.get,
    navigation.get,
  );
}
