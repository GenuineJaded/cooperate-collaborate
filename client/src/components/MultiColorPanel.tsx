import { useState, useRef, useEffect } from "react";

const DEFAULT_WHEEL1 = { hue: 280, saturation: 0.01, lightness: 0.04 }; // near-black background
const DEFAULT_WHEEL2 = { hue: 295, saturation: 0.18, lightness: 0.55 }; // default purple text

interface ColorWheel {
  hue: number;
  saturation: number;
  lightness: number;
}

export interface FieldColors {
  bgColor: string;
  textColor: string;
  active: boolean;
}

interface PanelProps {
  onColorsChange?: (c: FieldColors) => void;
}

export default function MultiColorPanel({ onColorsChange }: PanelProps) {
  const [open, setOpen] = useState(false);
  const [wheel1, setWheel1] = useState<ColorWheel>(DEFAULT_WHEEL1); // background
  const [wheel2, setWheel2] = useState<ColorWheel>(DEFAULT_WHEEL2); // text
  const [applied, setApplied] = useState(false);

  const toOklch = (w: ColorWheel) =>
    `oklch(${w.lightness.toFixed(2)} ${w.saturation.toFixed(2)} ${w.hue})`;

  const emit = (w1: ColorWheel, w2: ColorWheel, active: boolean) => {
    onColorsChange?.({
      bgColor: toOklch(w1),
      textColor: toOklch(w2),
      active,
    });
  };

  const handleApply = () => {
    const next = !applied;
    setApplied(next);
    emit(wheel1, wheel2, next);
  };

  const resetToDefault = () => {
    setWheel1({ ...DEFAULT_WHEEL1 });
    setWheel2({ ...DEFAULT_WHEEL2 });
    setApplied(false);
    emit(DEFAULT_WHEEL1, DEFAULT_WHEEL2, false);
  };

  // tab label color: use selected text color when applied, else default muted purple
  const tabTextColor = applied ? toOklch(wheel2) : "oklch(0.42 0.09 295)";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {/* Expanded panel — hinges upward */}
      {open && (
        <div
          className="animate-fade-in-up"
          style={{
            background: "oklch(0.07 0.015 280)",
            border: "1px solid oklch(0.20 0.06 295 / 0.45)",
            borderBottom: "none",
            padding: "1.25rem 1rem 1rem",
            width: "172px",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <p
            style={{
              color: "oklch(0.38 0.08 295)",
              fontSize: "0.52rem",
              letterSpacing: "0.14em",
              textAlign: "center",
              marginBottom: "-0.25rem",
            }}
          >
            perceptual · viewer-local
          </p>

          <ColorWheelControl
            label="A — background"
            value={wheel1}
            onChange={(v) => setWheel1(v)}
            color={toOklch(wheel1)}
          />
          <ColorWheelControl
            label="B — text"
            value={wheel2}
            onChange={(v) => setWheel2(v)}
            color={toOklch(wheel2)}
          />

          {/* Apply toggle */}
          <button
            onClick={handleApply}
            style={{
              background: applied ? "oklch(0.18 0.06 295 / 0.5)" : "none",
              border: "1px solid oklch(0.28 0.08 295 / 0.5)",
              color: applied ? "oklch(0.70 0.14 295)" : "oklch(0.40 0.08 295)",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              padding: "0.3rem 0",
              borderRadius: "1px",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.25s ease",
            }}
          >
            {applied ? "applied" : "apply"}
          </button>

          {/* Preview swatches */}
          <div style={{ display: "flex", gap: "6px" }}>
            <div
              style={{
                flex: 1,
                height: "6px",
                borderRadius: "1px",
                background: toOklch(wheel1),
                border: "1px solid oklch(0.25 0.05 295 / 0.3)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                flex: 1,
                height: "6px",
                borderRadius: "1px",
                background: toOklch(wheel2),
                opacity: 0.9,
              }}
            />
          </div>

          {/* Reset */}
          <button
            onClick={resetToDefault}
            style={{
              background: "none",
              border: "1px solid oklch(0.22 0.06 295 / 0.4)",
              color: "oklch(0.40 0.08 295)",
              fontSize: "0.55rem",
              letterSpacing: "0.18em",
              padding: "0.3rem 0",
              borderRadius: "1px",
              cursor: "pointer",
              width: "100%",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.60 0.12 295)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.35 0.10 295 / 0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.40 0.08 295)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.22 0.06 295 / 0.4)";
            }}
          >
            return to default
          </button>
        </div>
      )}

      {/* Tab — always visible at bottom-left, purple border like Pātha */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: open ? "oklch(0.10 0.02 280)" : "oklch(0.07 0.015 280)",
          border: "1px solid oklch(0.55 0.18 295 / 0.55)",
          borderBottom: open ? "1px solid oklch(0.07 0.015 280)" : "1px solid oklch(0.55 0.18 295 / 0.55)",
          color: tabTextColor,
          fontSize: "0.55rem",
          letterSpacing: "0.14em",
          padding: "0.4rem 0.9rem",
          cursor: "pointer",
          transition: "color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
          whiteSpace: "nowrap",
          boxShadow: "0 0 8px oklch(0.55 0.18 295 / 0.10)",
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
        Multi-Color-Displays
      </button>
    </div>
  );
}

interface WheelProps {
  label: string;
  value: ColorWheel;
  onChange: (v: ColorWheel) => void;
  color: string;
}

function ColorWheelControl({ label, value, onChange, color }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const SIZE = 80;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const r = SIZE / 2 - 2;

    ctx.clearRect(0, 0, SIZE, SIZE);

    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 0.5) * Math.PI) / 180;
      const endAngle = ((angle + 0.5) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 60%, 44%)`;
      ctx.fill();
    }

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.52);
    grad.addColorStop(0, "rgba(7,5,14,0.96)");
    grad.addColorStop(1, "rgba(7,5,14,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    const indicatorAngle = (value.hue * Math.PI) / 180;
    const ir = r * 0.78;
    const ix = cx + Math.cos(indicatorAngle) * ir;
    const iy = cy + Math.sin(indicatorAngle) * ir;
    ctx.beginPath();
    ctx.arc(ix, iy, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }, [value.hue, color]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    const x = (e.clientX - rect.left) * scaleX - SIZE / 2;
    const y = (e.clientY - rect.top) * scaleY - SIZE / 2;
    const dist = Math.sqrt(x * x + y * y) / (SIZE / 2);
    if (dist < 0.28 || dist > 0.98) return;
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    const hue = Math.round(((angle + 360) % 360));
    const saturation = Math.min(0.30, 0.06 + dist * 0.26);
    onChange({ ...value, hue, saturation });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <p
        style={{
          color: "oklch(0.42 0.09 295)",
          fontSize: "0.52rem",
          letterSpacing: "0.14em",
          margin: 0,
          textAlign: "center",
        }}
      >
        {label}
      </p>

      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        onClick={handleCanvasClick}
        style={{
          display: "block",
          borderRadius: "50%",
          cursor: "crosshair",
          width: "72px",
          height: "72px",
        }}
      />

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "2px" }}>
        <p style={{ color: "oklch(0.32 0.06 295)", fontSize: "0.48rem", letterSpacing: "0.12em", margin: 0, textAlign: "center" }}>
          lightness
        </p>
        <input
          type="range"
          min="2"
          max="92"
          value={Math.round(value.lightness * 100)}
          onChange={(e) =>
            onChange({ ...value, lightness: parseInt(e.target.value) / 100 })
          }
          style={{
            width: "100%",
            accentColor: color,
            height: "2px",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
