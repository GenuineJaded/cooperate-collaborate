import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { shadeClass, shadeColor, getSessionId } from "@/lib/shades";
import ArtifactCard from "@/components/ArtifactCard";
import NewArtifactForm from "@/components/NewArtifactForm";
import MultiColorPanel from "@/components/MultiColorPanel";

type Door = "writing" | "music" | "art";

export default function Forum() {
  const params = useParams<{ door?: string }>();
  const door = (params.door as Door) || "writing";
  const [activeDoor, setActiveDoor] = useState<Door>(door);
  const [showNewForm, setShowNewForm] = useState(false);
  const sessionId = getSessionId();

  const { data: artifacts, refetch } = trpc.artifact.list.useQuery({
    type: activeDoor,
  });

  // Refresh every 90 seconds to reflect decay changes
  useEffect(() => {
    const interval = setInterval(() => refetch(), 90000);
    return () => clearInterval(interval);
  }, [refetch]);

  const doors: Door[] = ["writing", "music", "art"];

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: "oklch(0.04 0.01 280)" }}
    >
      {/* Multi-Color-Displays — left panel */}
      <MultiColorPanel />

      {/* Main field */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Three doors — parallel, equal weight */}
        <nav
          className="flex items-center justify-center gap-12 py-8"
          style={{ borderBottom: "1px solid oklch(0.15 0.04 295 / 0.4)" }}
        >
          {doors.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDoor(d)}
              className="relative text-sm tracking-widest transition-all duration-400"
              style={{
                background: "none",
                border: "none",
                color:
                  activeDoor === d
                    ? "oklch(0.65 0.16 295)"
                    : "oklch(0.38 0.08 295)",
                fontWeight: activeDoor === d ? 400 : 300,
                letterSpacing: "0.25em",
                padding: "0.25rem 0",
              }}
            >
              {d}
              {activeDoor === d && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, oklch(0.55 0.16 295 / 0.7), transparent)",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Field */}
        <div className="flex-1 relative px-6 py-8">
          {/* Place artifact button — minimal, top right */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setShowNewForm(true)}
              className="text-xs tracking-widest transition-all duration-300"
              style={{
                background: "none",
                border: "1px solid oklch(0.22 0.06 295 / 0.5)",
                color: "oklch(0.45 0.12 295)",
                padding: "0.4rem 1rem",
                borderRadius: "2px",
                letterSpacing: "0.2em",
              }}
            >
              quip
            </button>
          </div>

          {/* Artifact field — presences, not list items */}
          {!artifacts || artifacts.length === 0 ? (
            <div
              className="flex items-center justify-center h-64"
              style={{ color: "oklch(0.28 0.06 295)", fontSize: "0.8rem", letterSpacing: "0.15em" }}
            >
              nothing is being held here
            </div>
          ) : (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {artifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  sessionId={sessionId}
                  onQuipped={refetch}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New artifact form modal */}
      {showNewForm && (
        <NewArtifactForm
          door={activeDoor}
          onClose={() => setShowNewForm(false)}
          onCreated={() => {
            setShowNewForm(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
