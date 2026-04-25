import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { shadeClass, shadeColor } from "@/lib/shades";
import QuipModal from "./QuipModal";
import IntimateCollaborate from "./IntimateCollaborate";

type Artifact = {
  id: number;
  nama: string | null;
  body: string | null;
  fileUrl: string | null;
  type: "writing" | "music" | "art";
  purpleShade: number;
  createdAt: Date;
};

interface Props {
  artifact: Artifact;
  sessionId: string;
  onQuipped: () => void;
}

export default function ArtifactCard({ artifact, sessionId, onQuipped }: Props) {
  const [showQuip, setShowQuip] = useState(false);
  const [showIntimate, setShowIntimate] = useState(false);
  const [viewed, setViewed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const viewMutation = trpc.artifact.view.useMutation();

  // Record view when card enters viewport
  useEffect(() => {
    if (viewed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewed) {
          setViewed(true);
          viewMutation.mutate({ id: artifact.id });
        }
      },
      { threshold: 0.5 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [artifact.id, viewed]);

  const shade = artifact.purpleShade;
  const borderColor = shadeColor(shade);

  return (
    <>
      <div
        ref={cardRef}
        className={`relative border animate-fade-in-up ${shadeClass(shade)}`}
        style={{
          borderWidth: "1px",
          borderRadius: "2px",
          padding: "1.25rem",
          background: "oklch(0.07 0.01 280 / 0.85)",
          backdropFilter: "blur(4px)",
          transition: "border-color 2s ease, box-shadow 2s ease",
        }}
      >
        {/* Nama — top, quiet */}
        {artifact.nama && (
          <p
            className="text-xs mb-3 tracking-widest"
            style={{ color: "oklch(0.42 0.10 295)", letterSpacing: "0.2em" }}
          >
            {artifact.nama}
          </p>
        )}

        {/* Body */}
        {artifact.body && (
          <p
            className="text-sm leading-relaxed mb-4"
            style={{
              color: "oklch(0.78 0.04 295)",
              fontWeight: 300,
              whiteSpace: "pre-wrap",
            }}
          >
            {artifact.body}
          </p>
        )}

        {/* File — image or gif */}
        {artifact.fileUrl && (
          <div className="mb-4">
            <img
              src={artifact.fileUrl}
              alt=""
              className="max-w-full rounded-sm"
              style={{ maxHeight: "280px", objectFit: "contain" }}
            />
          </div>
        )}

        {/* Footer: quip + fractal heart */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setShowQuip(true)}
            className="text-xs tracking-widest transition-all duration-300"
            style={{
              background: "none",
              border: "none",
              color: "oklch(0.38 0.10 295)",
              padding: "0.2rem 0",
              letterSpacing: "0.2em",
            }}
          >
            quip
          </button>

          {/* Fractal heart — unlabeled, discovered */}
          <button
            onClick={() => setShowIntimate(true)}
            className="animate-pulse-fractal"
            style={{
              background: "none",
              border: "none",
              padding: "0.2rem",
              lineHeight: 1,
            }}
            aria-label=""
          >
            <FractalHeart shade={shade} />
          </button>
        </div>

        {/* Shade indicator — a barely visible dot */}
        <div
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
          style={{ background: borderColor, opacity: 0.5 }}
        />
      </div>

      {showQuip && (
        <QuipModal
          artifact={artifact}
          onClose={() => setShowQuip(false)}
          onQuipped={() => {
            setShowQuip(false);
            onQuipped();
          }}
        />
      )}

      {showIntimate && (
        <IntimateCollaborate
          artifactId={artifact.id}
          sessionId={sessionId}
          onClose={() => setShowIntimate(false)}
        />
      )}
    </>
  );
}

// Fractal heart — SVG, no label
function FractalHeart({ shade }: { shade: number }) {
  const color = shadeColor(shade);
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.55 }}
    >
      {/* Outer heart */}
      <path
        d="M8 13C8 13 1 8.5 1 4.5C1 2.567 2.567 1 4.5 1C5.7 1 6.8 1.6 7.5 2.5L8 3L8.5 2.5C9.2 1.6 10.3 1 11.5 1C13.433 1 15 2.567 15 4.5C15 8.5 8 13 8 13Z"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Inner fractal heart — smaller, offset */}
      <path
        d="M8 9.5C8 9.5 4.5 7.2 4.5 5.5C4.5 4.672 5.172 4 6 4C6.6 4 7.1 4.3 7.4 4.75L8 5.5L8.6 4.75C8.9 4.3 9.4 4 10 4C10.828 4 11.5 4.672 11.5 5.5C11.5 7.2 8 9.5 8 9.5Z"
        stroke={color}
        strokeWidth="0.6"
        fill={color}
        fillOpacity="0.15"
      />
    </svg>
  );
}
