"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils"; // Ensure this utility exists or replace with your own
import Image from "next/image";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface TeamCarouselProps {
  members: TeamMember[];
  title?: string;
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  titleColor?: string;
  background?: string;
  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;
  showArrows?: boolean;
  showDots?: boolean;
  keyboardNavigation?: boolean;
  touchNavigation?: boolean;
  animationDuration?: number;
  autoPlay?: number;
  visibleCards?: number;
  sideCardScale?: number;
  sideCardOpacity?: number;
  grayscaleEffect?: boolean;
  className?: string;
  cardClassName?: string;
  titleClassName?: string;
  infoPosition?: "bottom" | "overlay" | "none";
  infoTextColor?: string;
  infoBackground?: string;
  onMemberChange?: (member: TeamMember, index: number) => void;
  onCardClick?: (member: TeamMember, index: number) => void;
  initialIndex?: number;
}

export const TeamCarousel: React.FC<TeamCarouselProps> = ({
  members,
  title = "OUR TEAM",
  titleSize = "2xl",
  titleColor = "rgb(8, 42, 123)",
  background = "#000",
  cardWidth = 280,
  cardHeight = 380,
  cardRadius = 20,
  showArrows = true,
  showDots = true,
  keyboardNavigation = true,
  touchNavigation = true,
  animationDuration = 800,
  autoPlay = 0,
  sideCardScale = 0.9,
  sideCardOpacity = 0.8,
  grayscaleEffect = true,
  className,
  cardClassName,
  titleClassName,
  infoPosition = "bottom",
  infoTextColor = "rgb(8, 42, 123)",
  infoBackground = "transparent",
  onMemberChange,
  onCardClick,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const updateCarousel = useCallback((newIndex: number) => {
    if (isAnimating || members.length === 0) return;
    setIsAnimating(true);
    const nextIndex = (newIndex + members.length) % members.length;
    setCurrentIndex(nextIndex);
    onMemberChange?.(members[nextIndex], nextIndex);
    setTimeout(() => setIsAnimating(false), animationDuration);
  }, [isAnimating, members, animationDuration, onMemberChange]);

  const getCardPosition = (index: number) => {
    const offset = (index - currentIndex + members.length) % members.length;
    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === 2) return "right-2";
    if (offset === members.length - 1) return "left-1";
    if (offset === members.length - 2) return "left-2";
    return "hidden";
  };

  const getCardStyles = (position: string) => {
    const base = "translateY(-50%)";
    switch (position) {
      case "center":
        return { transform: `${base} scale(1.1)`, zIndex: 10, opacity: 1 };
      case "left-1":
        return {
          transform: `${base} translateX(-${cardWidth * 0.7}px) scale(${sideCardScale})`,
          zIndex: 5,
          opacity: sideCardOpacity,
        };
      case "left-2":
        return {
          transform: `${base} translateX(-${cardWidth * 1.4}px) scale(${sideCardScale * 0.9})`,
          zIndex: 1,
          opacity: sideCardOpacity * 0.7,
        };
      case "right-1":
        return {
          transform: `${base} translateX(${cardWidth * 0.7}px) scale(${sideCardScale})`,
          zIndex: 5,
          opacity: sideCardOpacity,
        };
      case "right-2":
        return {
          transform: `${base} translateX(${cardWidth * 1.4}px) scale(${sideCardScale * 0.9})`,
          zIndex: 1,
          opacity: sideCardOpacity * 0.7,
        };
      default:
        return { transform: `${base} scale(0.8)`, opacity: 0, pointerEvents: "none" as React.CSSProperties["pointerEvents"] };
    }
  };

  useEffect(() => {
    if (autoPlay > 0) {
      const interval = setInterval(() => updateCarousel(currentIndex + 1), autoPlay);
      return () => clearInterval(interval);
    }
  }, [autoPlay, currentIndex, updateCarousel]);

  useEffect(() => {
    if (!keyboardNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
      if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [keyboardNavigation, currentIndex, updateCarousel]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!touchNavigation) return;
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchNavigation) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchNavigation) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      updateCarousel(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  };

  const titleSizeClasses = {
    sm: "text-4xl",
    md: "text-5xl",
    lg: "text-6xl",
    xl: "text-7xl",
    "2xl": "text-8xl",
  };

  return (
    <div
      className={cn("min-h-screen flex flex-col items-center justify-center overflow-hidden", className)}
      style={{ background }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {title && (
        <h1
          className={cn(
            "font-black uppercase tracking-tight absolute top-12 left-1/2 transform -translate-x-1/2 pointer-events-none whitespace-nowrap",
            titleSizeClasses[titleSize],
            titleClassName
          )}
          style={{
            color: "transparent",
            background: `linear-gradient(to bottom, ${titleColor}35 30%, transparent 76%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {title}
        </h1>
      )}

      <div
        className="w-full max-w-6xl relative mt-20"
        style={{ height: cardHeight + 100, perspective: "1000px" }}
      >
        {showArrows && (
          <>
            <button
              onClick={() => updateCarousel(currentIndex - 1)}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => updateCarousel(currentIndex + 1)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="w-full h-full flex justify-center items-center relative" style={{ transformStyle: "preserve-3d" }}>
          {members.map((member, index) => {
            const position = getCardPosition(index);
            const styles = getCardStyles(position);

            return (
              <div
                key={member.id}
                className={cn("absolute bg-white overflow-hidden shadow-2xl cursor-pointer transition-all", cardClassName)}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: cardRadius,
                  top: "90%",
                  left: "50%",
                  marginLeft: -cardWidth / 2,
                  marginTop: -cardHeight / 2,
                  transitionDuration: `${animationDuration}ms`,
                  transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  ...styles,
                }}
                onClick={() => {
                  updateCarousel(index);
                  onCardClick?.(member, index);
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={cardWidth}
                  height={cardHeight}
                  className="w-full h-full object-cover transition-all duration-800"
                  style={{ filter: position !== "center" && grayscaleEffect ? "grayscale(100%)" : "none" }}
                  priority={position === "center"}
                />

                {infoPosition === "overlay" && (
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 text-center"
                    style={{ background: infoBackground, color: infoTextColor }}
                  >
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm opacity-90">{member.role}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {infoPosition === "bottom" && members[currentIndex] && (
        <div className="text-center mt-10 transition-all duration-500">
          <h2 className="text-4xl font-bold mb-3" style={{ color: infoTextColor }}>
            {members[currentIndex].name}
          </h2>
          <p className="text-xl font-medium opacity-80 uppercase tracking-wider" style={{ color: infoTextColor }}>
            {members[currentIndex].role}
          </p>
          {members[currentIndex].bio && (
            <p className="text-base mt-4 max-w-lg mx-auto opacity-70">
              {members[currentIndex].bio}
            </p>
          )}
        </div>
      )}

      {showDots && (
        <div className="flex justify-center gap-3 mt-6">
          {members.map((_, index) => (
            <button
              key={index}
              onClick={() => updateCarousel(index)}
              className={cn("w-3 h-3 rounded-full transition-all duration-300", index === currentIndex ? "scale-125" : "hover:scale-110")}
              style={{ background: index === currentIndex ? infoTextColor : infoTextColor + "40" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCarousel;