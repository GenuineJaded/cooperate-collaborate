import { useLocation } from "wouter";

type Door = "writing" | "art" | "music";

const DOORS: Array<{
  id: Door;
  accent: string;
  glow: string;
  edge: string;
}> = [
  {
    id: "writing",
    accent: "oklch(0.72 0.10 286)",
    glow: "radial-gradient(circle at 20% 50%, oklch(0.22 0.07 286 / 0.55), transparent 62%)",
    edge: "linear-gradient(180deg, oklch(0.42 0.10 286 / 0.65), oklch(0.18 0.05 286 / 0.15))",
  },
  {
    id: "art",
    accent: "oklch(0.78 0.13 312)",
    glow: "radial-gradient(circle at 50% 50%, oklch(0.25 0.09 312 / 0.62), transparent 64%)",
    edge: "linear-gradient(180deg, oklch(0.52 0.14 312 / 0.72), oklch(0.20 0.06 312 / 0.18))",
  },
  {
    id: "music",
    accent: "oklch(0.71 0.11 268)",
    glow: "radial-gradient(circle at 80% 50%, oklch(0.21 0.08 268 / 0.58), transparent 62%)",
    edge: "linear-gradient(180deg, oklch(0.44 0.11 268 / 0.68), oklch(0.18 0.05 268 / 0.16))",
  },
];

export default function Doorway() {
  const [, navigate] = useLocation();

  return (
    <div
      className="flex min-h-screen w-full overflow-hidden"
      style={{ background: "oklch(0.04 0.01 280)" }}
    >
      {DOORS.map((door, index) => (
        <button
          key={door.id}
          onClick={() => navigate(`/field/${door.id}`)}
          className="group relative flex-1 overflow-hidden"
          style={{
            background: "none",
            border: "none",
            borderLeft: index === 0 ? "none" : "1px solid oklch(0.16 0.04 295 / 0.45)",
            borderRight: index === DOORS.length - 1 ? "none" : "1px solid oklch(0.16 0.04 295 / 0.45)",
            padding: 0,
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={{ background: door.glow, opacity: 0.9 }}
          />
          <div
            className="absolute inset-y-0 right-0 w-px opacity-70"
            style={{ background: door.edge }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(180deg, transparent, oklch(0.10 0.03 295 / 0.38))",
              opacity: 0.55,
            }}
          />
          <div className="relative flex h-full items-center justify-center px-6">
            <span
              className="transition-all duration-500 group-hover:tracking-[0.45em]"
              style={{
                color: door.accent,
                fontSize: "clamp(1.1rem, 1.4vw + 0.95rem, 1.7rem)",
                letterSpacing: "0.35em",
                textTransform: "lowercase",
                textShadow: `0 0 22px ${door.accent.replace(")", " / 0.18)")}`,
              }}
            >
              {door.id}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
