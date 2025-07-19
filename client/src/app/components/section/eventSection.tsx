"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  FileImage,
} from "lucide-react";
import { ScrollTimeline, TimelineEvent } from "@/components/ScrollTimeline";
import { Dialog, DialogContent } from "../ui/dialog";
import { useSwipeable } from "react-swipeable";

// ─── Type Definitions ─────────────────────────────────────────
type RawEvent = {
  id: number | string;
  date: string;
  title: string;
  location: string;
  image_urls?: string[];
};

const EventsTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/events");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: RawEvent[] = await res.json();

        const transformed: TimelineEvent[] = data.map((e) => {
          const eventDate = new Date(e.date);
          const mediaCount = e.image_urls?.length || 0;

          return {
            id: e.id.toString(),
            year: eventDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            title: e.title,
            subtitle: e.location,
            description:
              mediaCount > 0
                ? `${mediaCount} ${mediaCount === 1 ? "media item" : "media items"} • Click to view gallery`
                : "Click to view details",
            icon: (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>
                  {eventDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <MapPin className="h-4 w-4 text-cyan-400 ml-2" />
                <span>{e.location}</span>
              </div>
            ),
            onClick: () => {
              if (e.image_urls?.length) {
                setOpen(false);
                setTimeout(() => {
                  setMediaPreview(e.image_urls!);
                  setCurrentMediaIndex(0);
                  setOpen(true);
                }, 50);
              }
            },
          };
        });

        setEvents(transformed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const nextMedia = useCallback(() => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaPreview.length);
  }, [mediaPreview]);

  const prevMedia = useCallback(() => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaPreview.length) % mediaPreview.length);
  }, [mediaPreview]);

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextMedia,
    onSwipedRight: prevMedia,
    trackMouse: true,
  });

  if (loading) {
    return (
      <section className="w-full min-h-[600px] flex items-center justify-center pt-20">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full min-h-[600px] flex items-center justify-center pt-20">
        <div className="bg-red-900/10 border border-red-400/30 rounded-xl p-6 text-center">
          <X className="h-6 w-6 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 font-semibold">Failed to load events</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" />

      <ScrollTimeline
        events={events}
        title="Our Events"
        subtitle="Journey through the highlights of Nexus Club • Interactive media galleries"
        revealAnimation="glitch"
        cardAlignment="alternating"
        connectorStyle="circuit"
        cardEffect="cyber"
        className="min-h-[800px]"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-6xl p-0 bg-gray-900/95 backdrop-blur-lg border border-gray-800 overflow-hidden"
          aria-label="Media gallery modal"
          role="dialog"
        >
          <div className="relative">
            <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <h3 className="text-lg text-white font-semibold">Media Gallery</h3>
                <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  {currentMediaIndex + 1} / {mediaPreview.length}
                </span>
              </div>
            </div>

            <div
              {...swipeHandlers}
              className="relative bg-black min-h-[400px] flex items-center justify-center"
              role="dialog"
              aria-modal="true"
              aria-label={`Media preview dialog. Showing item ${currentMediaIndex + 1} of ${mediaPreview.length}`}
            >
              {mediaPreview.length === 0 ? (
                <div className="text-center p-8">
                  <FileImage className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No media available</p>
                </div>
              ) : isVideo(mediaPreview[currentMediaIndex]) ? (
                <div className="relative">
                  <video
                    key={currentMediaIndex}
                    controls
                    className="w-full max-h-[70vh] object-contain"
                    autoPlay
                  >
                    <source src={mediaPreview[currentMediaIndex]} type="video/mp4" />
                  </video>
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                    <Play className="h-4 w-4 text-white inline mr-1" />
                    <span className="text-white text-sm">Video</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={mediaPreview[currentMediaIndex]}
                    alt={`Preview ${currentMediaIndex + 1}`}
                    width={1200}
                    height={800}
                    className="w-full max-h-[70vh] object-contain"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                    <FileImage className="h-4 w-4 text-white inline mr-1" />
                    <span className="text-white text-sm">Image</span>
                  </div>
                </div>
              )}

              {mediaPreview.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    aria-label="Previous media"
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={nextMedia}
                    aria-label="Next media"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {mediaPreview.length > 1 && (
              <div className="p-4 bg-gray-800/30 border-t border-gray-700">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {mediaPreview.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMediaIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        idx === currentMediaIndex
                          ? "border-cyan-400 scale-105"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                      aria-label={`Select media ${idx + 1}`}
                    >
                      {isVideo(url) ? (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-400" />
                        </div>
                      ) : (
                        <Image
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          width={80}
                          height={80}
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/placeholder.png"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EventsTimeline;
