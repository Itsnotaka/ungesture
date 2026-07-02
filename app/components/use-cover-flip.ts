"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

/* ---------------------------------------------------------------------------
   Drag physics for the magazine cover.
   The cover angle is written to a `--flip` custom property (0 closed,
   1 open) on the stage; CSS derives every transform and shadow from it.
   While dragging, the grabbed point on the cover tracks the pointer
   through the hinge geometry (x = r·cos θ), so pausing mid-drag holds
   the page still. Release hands the current velocity to a spring.
   --------------------------------------------------------------------------- */

const STIFFNESS = 170;
const DAMPING = 23;
/** Energy kept when the cover slaps against the stack. */
const BOUNCE = 0.16;
/** Flips per second beyond which a release follows the throw. */
const FLING = 0.9;
/** Pointer travel below this is a tap, not a drag. */
const TAP_SLOP = 8;

type Drag = {
  pointerId: number;
  /** Distance of the grabbed point from the spine, as a fraction of cover width. */
  grabR: number;
  startX: number;
  startY: number;
  startTime: number;
  lastTime: number;
  moved: boolean;
  /** Close-swipe started on the stage (small screens), mapped linearly. */
  linear: boolean;
  engaged: boolean;
  baseFlip: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function useCoverFlip({
  stageRef,
  onSettle,
  onDragChange,
}: {
  stageRef: RefObject<HTMLElement | null>;
  onSettle: (open: boolean) => void;
  onDragChange: (dragging: boolean) => void;
}) {
  const flip = useRef(0);
  const vel = useRef(0);
  const raf = useRef(0);
  const drag = useRef<Drag | null>(null);

  const setFlip = (value: number) => {
    flip.current = value;
    stageRef.current?.style.setProperty("--flip", value.toFixed(4));
  };

  const geometry = () => {
    const spread = stageRef.current?.querySelector<HTMLElement>(".spread");
    if (!spread) return null;
    const rect = spread.getBoundingClientRect();
    const wide = window.matchMedia("(min-width: 64rem)").matches;
    return {
      spineX: wide ? rect.left + rect.width / 2 : rect.left,
      coverWidth: wide ? rect.width / 2 : rect.width,
      wide,
    };
  };

  const springTo = (target: 0 | 1) => {
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      vel.current = 0;
      setFlip(target);
      onSettle(target === 1);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      vel.current += (STIFFNESS * (target - flip.current) - DAMPING * vel.current) * dt;
      let next = flip.current + vel.current * dt;
      if (next < 0) {
        next = 0;
        vel.current = -vel.current * BOUNCE;
      } else if (next > 1) {
        next = 1;
        vel.current = -vel.current * BOUNCE;
      }
      setFlip(next);
      if (Math.abs(target - next) < 0.002 && Math.abs(vel.current) < 0.03) {
        vel.current = 0;
        setFlip(target);
        onSettle(target === 1);
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const toggle = (open = flip.current < 0.5) => springTo(open ? 1 : 0);

  const settleFromRelease = (tap: boolean) => {
    if (tap) {
      springTo(flip.current < 0.5 ? 1 : 0);
    } else if (Math.abs(vel.current) > FLING) {
      springTo(vel.current > 0 ? 1 : 0);
    } else {
      springTo(flip.current > 0.5 ? 1 : 0);
    }
  };

  const trackVelocity = (next: number, now: number, lastTime: number) => {
    const dt = Math.max((now - lastTime) / 1000, 0.001);
    vel.current = vel.current * 0.4 + ((next - flip.current) / dt) * 0.6;
  };

  const onCoverPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || drag.current) return;
    // Links on the inside cover keep their native click behavior.
    if ((event.target as HTMLElement).closest("a")) return;
    const geo = geometry();
    if (!geo) return;
    cancelAnimationFrame(raf.current);
    const x = event.clientX - geo.spineX;
    const cos = Math.cos(flip.current * Math.PI);
    // Near 90° the hinge math degenerates; fall back to raw distance.
    const grabR =
      Math.abs(cos) < 0.2
        ? clamp(Math.abs(x) / geo.coverWidth, 0.25, 1.15)
        : clamp(x / (geo.coverWidth * cos), 0.25, 1.15);
    event.currentTarget.setPointerCapture(event.pointerId);
    const now = performance.now();
    drag.current = {
      pointerId: event.pointerId,
      grabR,
      startX: event.clientX,
      startY: event.clientY,
      startTime: now,
      lastTime: now,
      moved: false,
      linear: false,
      engaged: true,
      baseFlip: flip.current,
    };
    vel.current = 0;
    onDragChange(true);
  };

  const onCoverPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.linear || d.pointerId !== event.pointerId) return;
    if (Math.abs(event.clientX - d.startX) + Math.abs(event.clientY - d.startY) > TAP_SLOP) {
      d.moved = true;
    }
    if (!d.moved) return;
    const geo = geometry();
    if (!geo) return;
    const x = event.clientX - geo.spineX;
    const cos = clamp(x / (geo.coverWidth * d.grabR), -1, 1);
    const next = Math.acos(cos) / Math.PI;
    const now = performance.now();
    trackVelocity(next, now, d.lastTime);
    d.lastTime = now;
    setFlip(next);
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    drag.current = null;
    if (d.linear && !d.engaged) return;
    onDragChange(false);
    const now = performance.now();
    const tap = !cancelled && !d.moved && now - d.startTime < 350 && !d.linear;
    // A pointer that rested before lifting set the page down gently;
    // only a live throw carries its velocity into the release.
    if (now - d.lastTime > 90) vel.current = 0;
    settleFromRelease(tap);
  };

  /* Close-swipe anywhere on the stage while the magazine lies open on a
     small screen, where the flat cover leaves nothing to grab. */
  const onStagePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (!event.isPrimary || drag.current) return;
    const geo = geometry();
    if (!geo || geo.wide || flip.current < 0.9) return;
    if ((event.target as HTMLElement).closest("a, button, input, label, .cover")) return;
    const now = performance.now();
    drag.current = {
      pointerId: event.pointerId,
      grabR: 1,
      startX: event.clientX,
      startY: event.clientY,
      startTime: now,
      lastTime: now,
      moved: false,
      linear: true,
      engaged: false,
      baseFlip: flip.current,
    };
  };

  const onStagePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d?.linear || d.pointerId !== event.pointerId) return;
    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;
    if (!d.engaged) {
      // Only claim clear horizontal intent; vertical stays a scroll.
      if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      d.engaged = true;
      d.moved = true;
      d.startX = event.clientX;
      d.baseFlip = flip.current;
      cancelAnimationFrame(raf.current);
      event.currentTarget.setPointerCapture(event.pointerId);
      vel.current = 0;
      onDragChange(true);
      return;
    }
    const geo = geometry();
    if (!geo) return;
    const travel = (event.clientX - d.startX) / (geo.coverWidth * 1.4);
    const next = clamp(d.baseFlip - travel, 0, 1);
    const now = performance.now();
    trackVelocity(next, now, d.lastTime);
    d.lastTime = now;
    setFlip(next);
  };

  return {
    toggle,
    coverHandlers: {
      onPointerDown: onCoverPointerDown,
      onPointerMove: onCoverPointerMove,
      onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => endDrag(event, false),
      onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => endDrag(event, true),
    },
    stageHandlers: {
      onPointerDown: onStagePointerDown,
      onPointerMove: onStagePointerMove,
      onPointerUp: (event: ReactPointerEvent<HTMLElement>) => endDrag(event, false),
      onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => endDrag(event, true),
    },
  };
}
