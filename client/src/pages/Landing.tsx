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

  const stripes = Array.from({ length: 8 }, (_, i) => ({
    left: `${-16 + i * 14}%`,
    delay: `${(i * 1.17) % 11}s`,
    width: `${3.8 + (i % 3) * 1.1}%`,
    drift: `${10 + (i % 4) * 2.4}s`,
    opacity: 0.11 + (i % 3) * 0.03,
  }));

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "oklch(0.02 0 0)" }}
    >
      <div
        className="absolute inset-0 animate-breathe-field"
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 48%, oklch(0.09 0.01 280 / 0.58) 0%, oklch(0.03 0 0 / 0.16) 46%, transparent 74%)",
        }}
      />

      {/* Background breathing layer */}
      <div
        className="absolute inset-0 animate-breathe-bg"
        style={{
          background:
            "radial-gradient(ellipse 92% 70% at 50% 50%, oklch(0.14 0.01 280 / 0.12) 0%, oklch(0.06 0 0 / 0.06) 42%, transparent 72%)",
        }}
      />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stripes.map((s, i) => (
          <div
            key={i}
            className="absolute top-[-24%] h-[150%] animate-stretch-stripe"
            style={{
              left: s.left,
              width: s.width,
              background:
                "linear-gradient(to bottom, transparent 0%, oklch(1 0 0 / 0.02) 10%, oklch(1 0 0 / 0.16) 34%, oklch(1 0 0 / 0.25) 50%, oklch(1 0 0 / 0.16) 66%, oklch(1 0 0 / 0.02) 90%, transparent 100%)",
              transform: "skewX(-19deg)",
              animationDelay: s.delay,
              animationDuration: s.drift,
              opacity: s.opacity,
              borderRadius: "999px",
              filter: "blur(0.6px)",
              mixBlendMode: "screen",
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
          className="group animate-patha-vibrate"
          style={{
            background: "none",
            border: "1px solid oklch(0.55 0.18 295 / 0.55)",
            borderRadius: "2px",
            padding: "0.5rem 1.8rem",
            cursor: "pointer",
            transition: "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
            boxShadow: "0 0 12px oklch(0.55 0.18 295 / 0.12)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.22 295 / 0.85)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 22px oklch(0.55 0.18 295 / 0.35)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.55 0.18 295 / 0.55)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px oklch(0.55 0.18 295 / 0.12)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
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
