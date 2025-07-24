"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "../ui/dialog";
import { FileImage } from "lucide-react";
import { ScrollTimeline } from "../../../components/ScrollTimeline";
import { motion } from "framer-motion";
import axios from "axios";

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  images: string[];
  video?: string;
};

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // FIX: allow setting
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get<{ events: Event[] }>(
          "http://localhost:3001/api/events"
        );

        if (res.data && Array.isArray(res.data.events)) {
          setEvents(res.data.events);
        } else {
          console.error("Unexpected API response:", res.data);
          setEvents([]); // fallback to empty array
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  const noEvents = !loading && events.length === 0;

  return (
    <section className="relative w-full pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" />

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
        Our Events
      </motion.h2>

      {noEvents ? (
        <div className="text-center py-24 animate-fade-in">
          <FileImage className="w-10 h-10 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No events found.</p>
          <p className="text-sm text-gray-500">
            Check back later - we’ll keep you posted.
          </p>
        </div>
      ) : (
        <ScrollTimeline
          events={events}
          subtitle="Journey through the highlights of Nexus Club • Interactive media galleries"
          revealAnimation="glitch"
          cardAlignment="alternating"
          connectorStyle="circuit"
          cardEffect="cyber"
          className="min-h-[800px]"
          onCardClick={(timelineEvent) => {
            // Find the full Event object by id to ensure all properties are present
            const foundEvent = events.find((e) => e.id === timelineEvent.id);
            if (foundEvent) {
              setSelectedEvent(foundEvent);
              setOpen(true);
            }
          }}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg">
          {selectedEvent && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-400">
                {selectedEvent.date} • {selectedEvent.location}
              </p>

              {selectedEvent.video && (
                <video
                  controls
                  className="w-full rounded-md border border-gray-700"
                  src={selectedEvent.video}
                />
              )}

              {selectedEvent.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedEvent.images.map((img, i) => (
                    <Image
                      key={i}
                      src={`http://localhost:3001${img}`}
                      alt={`event-${i}`}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-md border border-gray-700"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
