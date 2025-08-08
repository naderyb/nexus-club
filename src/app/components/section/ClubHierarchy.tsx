"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, cubicBezier, useScroll, useTransform } from "framer-motion";
import { Tree, TreeNode } from "react-organizational-chart";

// Animation configs
const fadeInUp = (delay = 0, y = 30, duration = 0.8) => ({
  initial: { opacity: 0, y, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-30px" },
  transition: {
    duration,
    delay,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
});

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: {
    staggerChildren: 0.1,
    delayChildren: 0.05,
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.6,
    ease: cubicBezier(0.23, 1, 0.32, 1),
  },
};

// Hard-coded members
const CLUB_MEMBERS = [
  { role: "President" },
  { role: "Vice President" },
  { role: "General Secretary" },
  { role: "Master Financier" },
  { role: "Resp Com" },
  { role: "Membres Com" },
  { role: "Resp Rel-Ex" },
  { role: "Membres Rel-Ex" },
  { role: "Resp Marketing" },
  { role: "Membres Marketing" },
  { role: "Resp Logistics" },
  { role: "Membres Logistics" },
  { role: "Resp Dev" },
  { role: "Membres Dev" },
];

// Role card component
const RoleCard = memo(({ role, name }: { role?: string; name?: string }) => {
  const cardId = `${role?.replace(/\s+/g, "-").toLowerCase()}-${name?.replace(
    /\s+/g,
    "-"
  ).toLowerCase()}`;

  const getCardStyle = (role: string) => {
    if (role === "President") {
      return "bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 border-fuchsia-400/30 shadow-lg shadow-fuchsia-500/10";
    }
    if (role === "Vice President") {
      return "bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-400/30 shadow-lg shadow-blue-500/10";
    }
    if (role === "General Secretary") {
      return "bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400/30 shadow-lg shadow-emerald-500/10";
    }
    if (role === "Master Financier") {
      return "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-400/30 shadow-lg shadow-yellow-500/10";
    }
    if (role.toLowerCase().includes("resp")) {
      return "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-400/30 shadow-lg shadow-cyan-500/10";
    }
    return "bg-gradient-to-br from-gray-500/20 to-slate-600/20 border-gray-400/30 shadow-lg shadow-gray-500/10";
  };

  return (
    <motion.div
      className={`relative px-6 py-4 text-white rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer group border ${getCardStyle(
        role || ""
      )}`}
      data-tooltip-id={cardId}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 text-center">
        <div className="text-sm font-semibold tracking-wide">
          {role || "Unknown Role"}
        </div>
      </div>
    </motion.div>
  );
});

RoleCard.displayName = "RoleCard";

// Main component
function ClubHierarchy() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getMembersByRole = useCallback(
    (role: string) =>
      CLUB_MEMBERS.filter((m) => m.role.toLowerCase() === role.toLowerCase()),
    []
  );

  const getMembersStartingWith = useCallback(
    (prefix: string) =>
      CLUB_MEMBERS.filter((m) =>
        m.role.toLowerCase().startsWith(prefix.toLowerCase())
      ),
    []
  );

  const titleStyle = useMemo(
    () => ({
      background:
        "linear-gradient(135deg, #22d3ee 0%, #3b82f6 30%, #8b5cf6 70%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      filter: `drop-shadow(${mousePosition.x / 400}px ${
        mousePosition.y / 400
      }px 15px rgba(34, 211, 238, 0.3))`,
    }),
    [mousePosition]
  );

  const president = getMembersByRole("President")[0];
  const vicePresident = getMembersByRole("Vice President")[0];
  const generalSecretary = getMembersByRole("General Secretary")[0];
  const masterFinancier = getMembersByRole("Master Financier")[0];

  return (
    <section className="relative min-h-screen px-6 py-24 text-white overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-5" />
        <motion.div
          style={{ y: parallaxY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 360],
              opacity: [0.02, 0.05, 0.02],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-gradient-conic from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-full blur-3xl"
          />
        </motion.div>
      </div>

      {/* Section content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="text-center mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none"
            style={titleStyle}
          >
            Our Leadership
          </motion.h2>

          <motion.div variants={staggerItem} className="mb-6">
            <p className="text-lg md:text-xl font-light tracking-wide mb-3">
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                Organization
              </span>{" "}
              is the foundation of every{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent font-medium">
                success
              </span>
              .
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 mx-auto opacity-50" />
          </motion.div>

          <motion.p
            variants={staggerItem}
            className="max-w-3xl mx-auto text-gray-300 text-lg md:text-xl leading-relaxed font-light"
          >
            <span className="text-white font-medium">Our structure</span>{" "}
            reflects our commitment to{" "}
            <span className="text-cyan-400">excellence</span>,{" "}
            <span className="text-blue-400">collaboration</span>, and{" "}
            <span className="text-fuchsia-400">innovation</span>. Each{" "}
            <span className="text-white font-medium">role matters</span>,{" "}
            <span className="text-white font-medium">every voice counts</span>,
            and{" "}
            <span className="text-white font-medium">together we thrive</span>.
          </motion.p>
        </motion.div>

        {/* Org chart */}
        <motion.div {...fadeInUp(0.2)}>
          {isLoaded ? (
            <div className="overflow-auto backdrop-blur-sm rounded-2xl p-8 shadow-2xl ml-4 mr-4">
              {president ? (
                <Tree
                  label={<RoleCard role={president.role} />}
                  lineWidth="2px"
                  lineColor="rgba(148, 163, 184, 0.3)"
                  lineBorderRadius="4px"
                >
                  {vicePresident && (
                    <TreeNode label={<RoleCard role={vicePresident.role} />}>
                      {generalSecretary && (
                        <TreeNode
                          label={<RoleCard role={generalSecretary.role} />}
                        >
                          {masterFinancier && (
                            <TreeNode
                              label={
                                <RoleCard role={masterFinancier.role} />
                              }
                            />
                          )}

                          {/* Dynamic departments */}
                          {[
                            {
                              head: "Resp Com",
                              member: "Membres Com",
                            },
                            {
                              head: "Resp Rel-Ex",
                              member: "Membres Rel-Ex",
                            },
                            {
                              head: "Resp Marketing",
                              member: "Membres Marketing",
                            },
                            {
                              head: "Resp Logistics",
                              member: "Membres Logistics",
                            },
                            {
                              head: "Resp Dev",
                              member: "Membres Dev",
                            },
                          ].map((dept) => {
                            const head = getMembersByRole(dept.head)[0];
                            if (!head) return null;

                            const teamMembers = getMembersStartingWith(
                              dept.member
                            );

                            return (
                              <TreeNode
                                key={head.role}
                                label={<RoleCard role={head.role} />}
                              >
                                {teamMembers.map(
                                  (member: { role: string }, index: number) => (
                                    <TreeNode
                                      key={`${member.role}-${index}`}
                                      label={
                                        <RoleCard role={member.role} />
                                      }
                                    />
                                  )
                                )}
                              </TreeNode>
                            );
                          })}
                        </TreeNode>
                      )}
                    </TreeNode>
                  )}
                </Tree>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">
                    No organization data available
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-fuchsia-400 rounded-full animate-spin animation-delay-300" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes gradient-conic {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
}

export default memo(ClubHierarchy);
