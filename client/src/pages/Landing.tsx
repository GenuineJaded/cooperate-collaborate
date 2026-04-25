import { useLocation } from "wouter";
import { useRef, useState } from "react";

export default function Landing() {
  const [, navigate] = useLocation();
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => navigate("/field"), 700);
  };

  const stripes = Array.from({ length: 14 }, (_, i) => ({
    left: `${-10 + i * 8}%`,
    delay: `${(i * 0.7) % 9}s`,
    width: `${3 + (i % 3)}%`,
  }));

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "oklch(0.04 0.01 280)" }}
    >
      {/* Background breathing layer */}
      <div
        className="absolute inset-0 animate-breathe-bg"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.12 0.06 295 / 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stripes.map((s, i) => (
          <div
            key={i}
            className="absolute top-[-20%] h-[140%] animate-breathe-stripe"
            style={{
              left: s.left,
              width: s.width,
              background:
                "linear-gradient(to bottom, transparent, oklch(0.88 0.03 295 / 0.07) 30%, oklch(0.88 0.03 295 / 0.07) 70%, transparent)",
              transform: "skewX(-18deg)",
              animationDelay: s.delay,
              animationDuration: `${8 + (i % 4)}s`,
              borderRadius: "40% 40% 40% 40% / 10% 10% 10% 10%",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center px-8 max-w-lg mx-auto animate-fade-in-up"
        style={{
          animationDelay: "0.3s",
          opacity: entered ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <p
          className="text-base leading-loose tracking-wide mb-2"
          style={{ color: "oklch(0.88 0.10 295)", fontWeight: 400 }}
        >
          You are here.
        </p>

        <p
          className="text-sm leading-loose tracking-widest mb-8"
          style={{ color: "oklch(0.80 0.09 295)", fontWeight: 300 }}
        >
          Nothing begins until you move.
        </p>

        <p
          className="text-sm leading-loose mb-2"
          style={{ color: "oklch(0.84 0.11 295)", fontWeight: 300 }}
        >
          Three doors.
          <br />
          <span style={{ color: "oklch(0.74 0.09 295)", fontSize: "0.8rem" }}>
            The labels are inherited. Insufficient. Used anyway.
          </span>
          <br />
          <span style={{ color: "oklch(0.74 0.09 295)", fontSize: "0.8rem" }}>
            Your choice of door is part of what you leave.
          </span>
        </p>

        <p
          className="text-sm tracking-widest mb-10"
          style={{ color: "oklch(0.82 0.11 295)", letterSpacing: "0.3em" }}
        >
          writing · music · art
        </p>

        <p
          className="text-xs leading-relaxed mb-12"
          style={{ color: "oklch(0.74 0.08 295)", fontWeight: 300 }}
        >
          Held while in contact. Released in absence.
          <br />
          Propping is permitted. The cost is visible.
          <br />
          What stays, stays because someone is still here with it.
        </p>

        {/* Pātha — the entry */}
        <button
          onClick={handleEnter}
          className="group"
          style={{
            background: "none",
            border: "1px solid oklch(0.55 0.18 295 / 0.55)",
            borderRadius: "2px",
            padding: "0.5rem 1.8rem",
            cursor: "pointer",
            transition: "border-color 0.4s ease, box-shadow 0.4s ease",
            boxShadow: "0 0 12px oklch(0.55 0.18 295 / 0.12)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.22 295 / 0.85)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 22px oklch(0.55 0.18 295 / 0.35)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.55 0.18 295 / 0.55)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px oklch(0.55 0.18 295 / 0.12)";
          }}
        >
          <span
            className="text-2xl tracking-[0.4em]"
            style={{
              color: "oklch(0.82 0.18 295)",
              fontWeight: 200,
              fontStyle: "italic",
              letterSpacing: "0.5em",
              textShadow: "0 0 24px oklch(0.55 0.18 295 / 0.5)",
            }}
          >
            Pātha
          </span>
        </button>
      </div>
    </div>
  );
}
