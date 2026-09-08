"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Free-floating signal/noise amplitude field for the hero background.
 * Default: chaotic static. Hover/focus: settles into a clear audible band.
 */
export function AmplitudeMeter({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef(0);
  const clarityRef = useRef(0);
  const targetClarityRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [clear, setClear] = useState(false);
  const [pressed, setPressed] = useState(false);
  const labelId = useId();

  const setTarget = useCallback((on: boolean) => {
    targetClarityRef.current = on ? 1 : 0;
    setClear(on);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedMotionRef.current = mq.matches;
      if (mq.matches) {
        clarityRef.current = 1;
        targetClarityRef.current = 1;
        setClear(true);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const barCount = 72;
    const cobalt = { r: 37, g: 80, b: 255 };
    const signal = { r: 200, g: 255, b: 61 };
    const white = { r: 255, g: 255, b: 255 };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const mix = (
      a: { r: number; g: number; b: number },
      b: { r: number; g: number; b: number },
      t: number
    ) => ({
      r: Math.round(lerp(a.r, b.r, t)),
      g: Math.round(lerp(a.g, b.g, t)),
      b: Math.round(lerp(a.b, b.b, t)),
    });

    const noiseAmp = (i: number, t: number) => {
      const n = Math.sin(i * 12.9898 + t * 17.3) * 43758.5453;
      const frac = n - Math.floor(n);
      const jagged =
        0.2 +
        0.8 *
          Math.abs(
            Math.sin(t * 14 + i * 0.9) *
              Math.cos(t * 9.2 + i * 1.7) *
              (0.4 + frac)
          );
      return Math.min(1, jagged * (0.7 + frac * 0.6));
    };

    const clearAmp = (i: number, t: number, mid: number) => {
      const x = i / (barCount - 1);
      const envelope = Math.exp(-Math.pow((x - mid) * 2.8, 2));
      const wave =
        0.35 +
        0.65 *
          Math.abs(
            Math.sin(t * 2.4 + x * Math.PI * 4) *
              (0.55 + 0.45 * Math.sin(t * 1.1 + x * 2))
          );
      return Math.min(1, envelope * wave * 0.95 + 0.06);
    };

    const draw = () => {
      const reduced = reducedMotionRef.current;
      const speed = reduced ? 0.008 : 0.035;
      clarityRef.current = lerp(
        clarityRef.current,
        reduced ? 1 : targetClarityRef.current,
        reduced ? 1 : 0.08
      );
      tRef.current += speed;
      const t = tRef.current;
      const c = clarityRef.current;

      ctx.clearRect(0, 0, width, height);

      const midY = height * 0.48;

      // Soft audible glow (no boxed guide)
      if (c > 0.04) {
        const glow = ctx.createRadialGradient(
          width * 0.5,
          midY,
          height * 0.05,
          width * 0.5,
          midY,
          height * 0.55
        );
        glow.addColorStop(0, `rgba(200,255,61,${0.18 * c})`);
        glow.addColorStop(0.45, `rgba(37,80,255,${0.1 * c})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Hairline baseline — fades into field, not a frame
      ctx.strokeStyle = `rgba(255,255,255,${0.08 + c * 0.12})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.02, midY);
      ctx.lineTo(width * 0.98, midY);
      ctx.stroke();

      const gap = 3;
      const totalGap = gap * (barCount - 1);
      const barW = Math.max(2, (width - totalGap) / barCount);
      const maxH = height * 0.88;

      for (let i = 0; i < barCount; i++) {
        const n = noiseAmp(i, t);
        const s = clearAmp(i, t, 0.5);
        const amp = lerp(n, s, c);
        const h = amp * maxH;
        const x = i * (barW + gap);
        const y = midY - h / 2;

        const inBand = Math.abs(i / (barCount - 1) - 0.5) < 0.2;
        const color = mix(
          mix(white, cobalt, 0.3 + (i % 3) * 0.12),
          inBand ? signal : cobalt,
          c
        );
        const alpha = lerp(0.28 + n * 0.4, 0.5 + amp * 0.45, c);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`;
        ctx.fillRect(x, y, barW, Math.max(2, h));

        if (c < 0.85 && Math.random() > 0.7 + c * 0.25) {
          ctx.fillStyle = `rgba(255,255,255,${0.22 * (1 - c)})`;
          ctx.fillRect(
            x,
            midY + (Math.random() - 0.5) * maxH * 0.95,
            barW,
            1 + Math.random() * 2
          );
        }
      }

      // Floating status — not boxed labels
      ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.letterSpacing = "0.12em";
      ctx.fillStyle = `rgba(255,255,255,${0.28 + c * 0.2})`;
      ctx.fillText(c > 0.55 ? "SIGNAL" : "NOISE", width * 0.06, height * 0.1);
      ctx.fillStyle = `rgba(200,255,61,${0.2 + c * 0.55})`;
      ctx.fillText(
        c > 0.55 ? "AUDIBLE RANGE" : "STATIC",
        width * 0.72,
        height * 0.1
      );

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  const active = clear || pressed;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] overflow-visible",
        className
      )}
    >
      {/* Visual field — soft mask, no pointer interception from mask edges */}
      <div
        aria-hidden
        className="absolute -right-[8%] top-[4%] h-[72%] w-[78%] -translate-y-2 md:top-[2%] md:h-[78%] md:w-[70%] lg:-right-[4%] lg:w-[62%]"
        style={{
          maskImage:
            "radial-gradient(ellipse 75% 70% at 55% 48%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at 55% 48%, #000 35%, transparent 78%)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full opacity-90"
        />
      </div>

      {/* Hit target sits above visuals but below hero copy (copy is z-10 + pointer-events-auto) */}
      <button
        type="button"
        aria-pressed={active}
        aria-labelledby={labelId}
        className="pointer-events-auto absolute -right-[8%] top-[4%] z-[2] h-[72%] w-[78%] -translate-y-2 cursor-default border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-signal)] focus-visible:ring-offset-0 md:top-[2%] md:h-[78%] md:w-[70%] lg:-right-[4%] lg:w-[62%]"
        onPointerEnter={() => setTarget(true)}
        onPointerLeave={() => {
          if (!pressed) setTarget(false);
        }}
        onFocus={() => setTarget(true)}
        onBlur={() => {
          if (!pressed) setTarget(false);
        }}
        onClick={() => {
          const next = !pressed;
          setPressed(next);
          setTarget(next);
        }}
      >
        <span className="sr-only" id={labelId}>
          Amplitude meter.{" "}
          {active
            ? "Showing a clear audible signal range."
            : "Showing noise and static. Hover, focus, or activate to reveal a clear signal."}
        </span>
      </button>
    </div>
  );
}
