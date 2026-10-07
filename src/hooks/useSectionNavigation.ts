import { useEffect, type RefObject } from "react";
import { navigation, type SectionIndex } from "../store/navigationStore";

export function useSectionNavigation(
  navigate: (index: SectionIndex) => void,
  content: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let accumulated = 0,
      lastWheel = 0,
      lastInput = 0,
      startY = 0,
      startX = 0;
    let startAtTop = false,
      startAtBottom = false;
    const canLeave = (direction: number) => {
      const el = content.current;
      if (!el || el.scrollHeight <= el.clientHeight + 3) return true;
      return direction > 0
        ? el.scrollTop + el.clientHeight >= el.scrollHeight - 3
        : el.scrollTop <= 3;
    };
    const step = (direction: number) => {
      if (
        navigation.get().phase !== "idle" ||
        performance.now() - lastInput < 650
      )
        return;
      const next = navigation.get().active + direction;
      if (next < 0 || next > 3) return;
      lastInput = performance.now();
      navigate(next as SectionIndex);
    };
    const wheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      if (navigation.get().phase !== "idle") {
        accumulated = 0;
        lastInput = performance.now();
        event.preventDefault();
        return;
      }
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1);
      if (!canLeave(Math.sign(delta))) {
        accumulated = 0;
        return;
      }
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 220 || Math.sign(accumulated) !== Math.sign(delta))
        accumulated = 0;
      lastWheel = now;
      accumulated += delta;
      if (Math.abs(accumulated) >= 100) {
        step(Math.sign(accumulated));
        accumulated = 0;
      }
    };
    const key = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.target as HTMLElement).closest(
          'input,textarea,select,[contenteditable="true"],button,a',
        )
      )
        return;
      const direction = ["ArrowDown", "PageDown"].includes(event.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(event.key)
          ? -1
          : 0;
      if (direction && canLeave(direction)) {
        event.preventDefault();
        step(direction);
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        navigate(event.key === "Home" ? 0 : 3);
      }
    };
    const touchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      startY = event.touches[0].clientY;
      startX = event.touches[0].clientX;
      startAtTop = canLeave(-1);
      startAtBottom = canLeave(1);
    };
    const touchEnd = (event: TouchEvent) => {
      if (!event.changedTouches.length) return;
      const dy = startY - event.changedTouches[0].clientY,
        dx = startX - event.changedTouches[0].clientX;
      const wasAtEdge = dy > 0 ? startAtBottom : startAtTop;
      if (
        wasAtEdge &&
        Math.abs(dy) > 90 &&
        Math.abs(dy) > Math.abs(dx) * 1.5 &&
        canLeave(Math.sign(dy))
      )
        step(Math.sign(dy));
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchend", touchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [navigate, content]);
}
