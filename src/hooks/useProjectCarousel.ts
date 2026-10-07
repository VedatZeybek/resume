import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { navigation } from "../store/navigationStore";

const SWIPE_THRESHOLD = 48;
const SNAP_DURATION = 560;

export function useProjectCarousel(count: number, initialIndex = 0) {
  const [selection, setSelection] = useState(initialIndex);
  const activeIndex = Math.max(0, Math.min(selection, count - 1));
  const [isDragging, setIsDragging] = useState(false);
  const dragFrame = useRef(0);
  const pendingDrag = useRef(0);
  const [width, setWidth] = useState(900);
  const viewport = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    axis: "pending" | "x" | "y";
  } | null>(null);
  const suppressClickUntil = useRef(0);
  useEffect(() => () => cancelAnimationFrame(dragFrame.current), []);
  const select = useCallback(
    (index: number) => {
      if (navigation.get().phase !== "idle" || count < 1) return;
      setSelection(Math.max(0, Math.min(index, count - 1)));
    },
    [count],
  );
  const step = useCallback(
    (direction: number) => {
      if (navigation.get().phase !== "idle" || count < 2) return;
      setSelection((current) =>
        Math.max(
          0,
          Math.min(
            Math.max(0, Math.min(current, count - 1)) + direction,
            count - 1,
          ),
        ),
      );
    },
    [count],
  );

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let total = 0,
      lastWheel = 0,
      lastStep = -Infinity,
      consumed = false;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || navigation.get().phase !== "idle" || count < 2)
        return;
      // A wheel gesture belongs to either this viewport or section navigation, never both.
      event.preventDefault();
      event.stopPropagation();
      const now = performance.now();
      const delta =
        (Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY) *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? element.clientWidth
            : 1);
      if (now - lastWheel > 150) {
        total = 0;
        consumed = false;
      }
      lastWheel = now;
      if (consumed || now - lastStep < SNAP_DURATION) return;
      if (Math.sign(total) !== Math.sign(delta)) total = 0;
      total += delta;
      if (Math.abs(total) >= 45) {
        step(Math.sign(total));
        lastStep = now;
        total = 0;
        consumed = true;
      }
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [step, count]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        navigation.get().phase !== "idle" ||
        (event.target as HTMLElement).closest(
          'input,textarea,select,[contenteditable="true"]',
        )
      )
        return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        viewport.current?.focus({ preventScroll: true });
        step(event.key === "ArrowRight" ? 1 : -1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [step]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      navigation.get().phase !== "idle" ||
      (event.target as HTMLElement).closest(
        "a:not(.project-source-link),button:not(.carousel-select)",
      )
    )
      return;
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: "pending",
    };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y;
    if (start.axis === "pending" && Math.max(Math.abs(dx), Math.abs(dy)) > 10) {
      start.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      if (start.axis === "x") {
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (start.axis !== "x") return;
    event.preventDefault();
    const edge =
      (activeIndex === 0 && dx > 0) || (activeIndex === count - 1 && dx < 0);
    pendingDrag.current = Math.max(-120, Math.min(120, dx * (edge ? 0.16 : 0.65)));
    if (!dragFrame.current) {
      dragFrame.current = requestAnimationFrame(() => {
        viewport.current?.style.setProperty("--drag-x", `${pendingDrag.current}px`);
        dragFrame.current = 0;
      });
    }
  };
  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;
    viewport.current?.style.setProperty("--drag-x", "0px");
    setIsDragging(false);
    if (start.axis === "x") {
      suppressClickUntil.current = performance.now() + 300;
      const dx = event.clientX - start.x;
      if (!cancelled && Math.abs(dx) >= SWIPE_THRESHOLD) step(dx < 0 ? 1 : -1);
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return {
    activeIndex,
    isDragging,
    width,
    viewport,
    select,
    step,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<HTMLDivElement>) => finish(event),
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) =>
        finish(event, true),
      onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) => {
        // Touch starts with implicit capture on the child. Its loss bubbles when
        // capture transfers to this viewport; only our own loss cancels a drag.
        if (event.target === event.currentTarget) finish(event, true);
      },
      onClickCapture: (event: MouseEvent<HTMLDivElement>) => {
        if (performance.now() < suppressClickUntil.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
    },
  };
}
