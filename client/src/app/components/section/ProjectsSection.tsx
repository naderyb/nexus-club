"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

type Project = {
  id: number;
  name: string;
  description: string;
  site_url: string;
  image_url: string;
  start_date?: string;
  end_date?: string;
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");
        const data: unknown = res.data;

        if (Array.isArray(data)) {
          setProjects(data as Project[]);
        } else if (
          typeof data === "object" &&
          data !== null &&
          "projects" in data &&
          Array.isArray((data as { projects?: unknown }).projects)
        ) {
          setProjects((data as { projects: Project[] }).projects);
        } else {
          console.error("Invalid format:", data);
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="relative py-20  text-white">
      <div className="container mx-auto px-6">
        <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto mb-6 w-fit text-5xl md:text-6xl font-bold tracking-tight text-center leading-tight"
        style={{
          background: "linear-gradient(to right, #22d3ee, #c026d3)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: `
            ${mousePosition.x / 210}px ${
            mousePosition.y / 210
          }px 60px rgba(0, 255, 255, 0.5),
            ${mousePosition.x / 510}px ${
            mousePosition.y / 410
          }px 30px rgba(147, 51, 234, 0.3)
          `,
        }}
      >
        Our Projects
      </motion.h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-fuchsia-600 shadow-md hover:shadow-fuchsia-500/30 transition-all cursor-pointer"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={`http://localhost:3001${project.image_url}`}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111] p-6 rounded-xl max-w-2xl w-full relative border border-fuchsia-700/30 shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-4">
                {selectedProject.name}
              </h3>

              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={`http://localhost:3001${selectedProject.image_url}`}
                  alt={selectedProject.name}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="mb-4 text-gray-300">
                {selectedProject.description}
              </p>

              {selectedProject.start_date && selectedProject.end_date && (
                <p className="text-sm text-gray-500 mb-2">
                  {format(new Date(selectedProject.start_date), "PPP")} →{" "}
                  {format(new Date(selectedProject.end_date), "PPP")}
                </p>
              )}

              {selectedProject.site_url && (
                <a
                  href={selectedProject.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-5 py-2 rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 transition text-white font-semibold"
                >
                  🔗 View Live
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
