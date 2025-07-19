"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const circles: { x: number; y: number; size: number; alpha: number }[] = [];

    const onMove = (e: MouseEvent) => {
      circles.push({
        x: e.clientX,
        y: e.clientY,
        size: 30,
        alpha: 0.2,
      });
    };
    window.addEventListener("mousemove", onMove);

    function animate() {
      ctx.clearRect(0, 0, w, h);
      for (let i = circles.length - 1; i >= 0; i--) {
        const c = circles[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,255,${c.alpha})`;
        ctx.fill();

        c.size += 2;
        c.alpha -= 0.02;
        if (c.alpha <= 0) circles.splice(i, 1);
      }
      requestAnimationFrame(animate);
    }

    animate();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
