import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { shadeClass, shadeColor, getSessionId } from "@/lib/shades";
import ArtifactCard from "@/components/ArtifactCard";
import NewArtifactForm from "@/components/NewArtifactForm";
import MultiColorPanel, { FieldColors } from "@/components/MultiColorPanel";

type Door = "writing" | "music" | "art";

const DEFAULT_COLORS: FieldColors = {
  bgColor: "oklch(0.04 0.01 280)",
  textColor: "oklch(0.55 0.18 295)",
  active: false,
};

export default function Forum() {
  const params = useParams<{ door?: string }>();
  const door = (params.door as Door) || "writing";
  const [activeDoor, setActiveDoor] = useState<Door>(door);
  const [showNewForm, setShowNewForm] = useState(false);
  const sessionId = getSessionId();
  const [fieldColors, setFieldColors] = useState<FieldColors>(DEFAULT_COLORS);

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
      className="min-h-screen w-full"
      style={{
        background: fieldColors.active ? fieldColors.bgColor : "oklch(0.04 0.01 280)",
        color: fieldColors.active ? fieldColors.textColor : undefined,
        transition: "background 0.6s ease, color 0.6s ease",
      }}
    >
      {/* Multi-Color-Displays — fixed left panel, sits above everything */}
      <MultiColorPanel onColorsChange={(c) => setFieldColors(c)} />

      {/* Three doors — full viewport width, truly centered */}
      <nav
        className="flex items-center justify-center gap-8 py-8"
        style={{ borderBottom: "1px solid oklch(0.15 0.04 295 / 0.4)" }}
      >
        {doors.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDoor(d)}
            className="text-sm tracking-widest"
            style={{
              background: activeDoor === d ? "oklch(0.10 0.03 295 / 0.4)" : "none",
              border: activeDoor === d
                ? "1px solid oklch(0.72 0.22 295 / 0.80)"
                : "1px solid oklch(0.55 0.18 295 / 0.45)",
              color:
                activeDoor === d
                  ? "oklch(0.75 0.18 295)"
                  : "oklch(0.45 0.10 295)",
              fontWeight: activeDoor === d ? 400 : 300,
              letterSpacing: "0.25em",
              padding: "0.3rem 1rem",
              borderRadius: "2px",
              boxShadow: activeDoor === d ? "0 0 12px oklch(0.55 0.18 295 / 0.20)" : "none",
              transition: "all 0.25s ease",
            }}
          >
            {d}
          </button>
        ))}
      </nav>

      {/* Field — padded left to clear the fixed panel tab */}
      <div
        className="flex-1 flex flex-col"
        style={{ paddingLeft: "196px" /* 172px panel + 24px breathing room */ }}
      >
        {/* Draft Artifact — sits in its own row, left-aligned within the field, clear of the panel */}
        <div className="px-6 pt-8 pb-0">
          <button
            onClick={() => setShowNewForm(true)}
            className="text-xs tracking-widest"
            style={{
              background: "none",
              border: "1px solid oklch(0.55 0.18 295 / 0.55)",
              color: "oklch(0.55 0.18 295)",
              padding: "0.4rem 1.1rem",
              borderRadius: "2px",
              letterSpacing: "0.2em",
              boxShadow: "0 0 8px oklch(0.55 0.18 295 / 0.10)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px oklch(0.55 0.18 295 / 0.28)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.22 295 / 0.80)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 8px oklch(0.55 0.18 295 / 0.10)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.55 0.18 295 / 0.55)";
            }}
          >
            Draft Artifact
          </button>
        </div>

        {/* Artifact field — presences, not list items */}
        <div className="px-6 py-8">
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
