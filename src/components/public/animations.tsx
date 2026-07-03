import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

// Astro renders React components on the server, where useLayoutEffect would
// log a warning. Fall back to useEffect there; the hook only matters on the
// client anyway (we read DOM rects to suppress a hydration flash).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type FadeDirection = "up" | "down" | "left" | "right" | "none";

const directionStyles: Record<FadeDirection, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: FadeDirection;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [hidden, setHidden] = useState(false);

  // SSR renders the visible state (so non-JS users see content). On hydration
  // we only flip to the hidden state for elements that are actually below the
  // fold — otherwise above-fold content would flash invisible for one frame
  // before the IntersectionObserver async callback can restore it.
  // useLayoutEffect runs before paint, so the hidden state is committed
  // atomically with React's first reconciliation.
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;

    setHidden(true);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateIn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const baseTransform = directionStyles[direction];
  const stateClass =
    !hidden || animateIn
      ? "opacity-100 translate-x-0 translate-y-0"
      : `opacity-0 ${baseTransform}`;

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${stateClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
