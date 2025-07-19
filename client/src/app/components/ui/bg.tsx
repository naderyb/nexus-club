// src/app/components/ui/Cursor.tsx
"use client";
import React from "react";
import AnimatedBubbleParticles from "../../../components/AnimatedBubbleParticles"; // or adjust import path

const Cursor = () => {
  return (
    <AnimatedBubbleParticles
      backgroundColor="black"
      particleColor="#14b8a6" // Tailwind's teal-500
      particleSize={25}
      spawnInterval={160}
      enableGooEffect={true}
      blurStrength={12}
      height="100vh"
      width="100vw"
      className="fixed inset-0 -z-10"
    />
  );
};

export default Cursor;
