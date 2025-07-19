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

    const trail: { x: number; y: number; time: number }[] = [];
    const nodes: { x: number; y: number; alpha: number; size: number }[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Add to trail with time stamp
      trail.push({ x: mouseX, y: mouseY, time: Date.now() });
      if (trail.length > 25) trail.shift();

      // Add circuit nodes occasionally
      if (Math.random() < 0.3) {
        nodes.push({
          x: mouseX + (Math.random() - 0.5) * 40,
          y: mouseY + (Math.random() - 0.5) * 40,
          alpha: 0.8,
          size: Math.random() * 3 + 1
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    function animate() {
      time++;
      ctx.clearRect(0, 0, w, h);

      // Draw circuit-like connections
      if (trail.length > 1) {
        for (let i = 0; i < trail.length - 1; i++) {
          const current = trail[i];
          const next = trail[i + 1];
          const progress = i / (trail.length - 1);
          
          // Main neon line
          ctx.strokeStyle = `rgba(0, 255, 255, ${progress * 0.7})`;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          
          // Glow effect
          ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
          ctx.shadowBlur = 8;
          
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
          
          // Secondary pink accent line
          ctx.strokeStyle = `rgba(255, 0, 255, ${progress * 0.3})`;
          ctx.lineWidth = 1;
          ctx.shadowColor = "rgba(255, 0, 255, 0.3)";
          ctx.shadowBlur = 4;
          
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw main cursor with glitch effect
      if (mouseX && mouseY) {
        const glitchOffset = Math.sin(time * 0.5) * 2;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          mouseX, mouseY, 0,
          mouseX, mouseY, 20
        );
        gradient.addColorStop(0, "rgba(0, 255, 255, 0.6)");
        gradient.addColorStop(0.7, "rgba(0, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(0, 255, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Core dot with subtle glitch
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(mouseX + glitchOffset, mouseY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glitch accent
        ctx.fillStyle = "rgba(255, 0, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(mouseX - glitchOffset, mouseY, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update circuit nodes
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        
        // Node glow
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 3
        );
        nodeGradient.addColorStop(0, `rgba(0, 255, 255, ${node.alpha})`);
        nodeGradient.addColorStop(1, `rgba(0, 255, 255, 0)`);
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        ctx.fillStyle = `rgba(255, 255, 255, ${node.alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Fade out
        node.alpha -= 0.02;
        if (node.alpha <= 0) {
          nodes.splice(i, 1);
        }
      }

      // Connect nearby nodes with thin lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
          
          if (dist < 80) {
            const opacity = (1 - dist / 80) * Math.min(n1.alpha, n2.alpha) * 0.3;
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Subtle scan lines effect
      if (Math.random() < 0.05) {
        const scanY = Math.random() * h;
        ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();
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
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{
        mixBlendMode: "screen"
      }}
    />
  );
}