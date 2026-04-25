import { useState, useRef, useEffect } from "react";

interface ColorWheel {
  hue: number;
  saturation: number;
  lightness: number;
}

export default function MultiColorPanel() {
  const [collapsed, setCollapsed] = useState(true);
  const [wheel1, setWheel1] = useState<ColorWheel>({ hue: 295, saturation: 0.18, lightness: 0.45 });
  const [wheel2, setWheel2] = useState<ColorWheel>({ hue: 260, saturation: 0.12, lightness: 0.35 });

  const toOklch = (w: ColorWheel) =>
    `oklch(${w.lightness.toFixed(2)} ${w.saturation.toFixed(2)} ${w.hue})`;

  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        width: collapsed ? "2rem" : "180px",
        transition: "width 0.4s ease",
        borderRight: "1px solid oklch(0.15 0.04 295 / 0.3)",
        background: "oklch(0.06 0.01 280)",
        position: "relative",
        zIndex: 10,
        alignSelf: "stretch",
      }}
    >
      {/* Toggle — vertically centered */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ flex: 1, minHeight: 0 }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            color: "oklch(0.38 0.08 295)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            writingMode: "vertical-rl",
            transform: collapsed ? "rotate(180deg)" : "rotate(180deg)",
            transition: "color 0.3s ease",
            padding: "1rem 0.5rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "oklch(0.55 0.14 295)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "oklch(0.38 0.08 295)")
          }
        >
          Multi-Color-Displays
        </button>
      </div>

      {/* Expanded content — overlays to the right without pushing layout */}
      {!collapsed && (
        <div
          className="absolute top-0 left-full animate-fade-in-up"
          style={{
            background: "oklch(0.07 0.01 280)",
            border: "1px solid oklch(0.18 0.05 295 / 0.4)",
            borderLeft: "none",
            padding: "1.5rem 1rem",
            width: "160px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <p
            style={{
              color: "oklch(0.35 0.08 295)",
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              textAlign: "center",
            }}
          >
            perceptual only
          </p>

          <ColorWheelControl
            label="A"
            value={wheel1}
            onChange={setWheel1}
            color={toOklch(wheel1)}
          />
          <ColorWheelControl
            label="B"
            value={wheel2}
            onChange={setWheel2}
            color={toOklch(wheel2)}
          />

          {/* Preview swatches */}
          <div className="flex gap-2">
            <div
              style={{
                flex: 1,
                height: "8px",
                borderRadius: "1px",
                background: toOklch(wheel1),
                opacity: 0.75,
              }}
            />
            <div
              style={{
                flex: 1,
                height: "8px",
                borderRadius: "1px",
                background: toOklch(wheel2),
                opacity: 0.75,
              }}
            />
          </div>

          <p
            style={{
              color: "oklch(0.25 0.05 295)",
              fontSize: "0.5rem",
              letterSpacing: "0.1em",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            others see nothing
          </p>
        </div>
      )}
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 1;

    // Draw hue ring
    for (let angle = 0; angle < 360; angle += 2) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 55%, 42%)`;
      ctx.fill();
    }

    // Center fade to dark
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.55);
    gradient.addColorStop(0, "rgba(8,6,16,0.92)");
    gradient.addColorStop(1, "rgba(8,6,16,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;
    const dist = Math.sqrt(x * x + y * y) / (canvas.width / 2);
    if (dist < 0.3) return; // ignore center
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    const hue = Math.round(((angle + 360) % 360));
    const saturation = Math.min(0.22, 0.08 + dist * 0.16);
    onChange({ ...value, hue, saturation });
  };

  // Indicator position on wheel edge
  const indicatorAngle = (value.hue * Math.PI) / 180;
  const indicatorR = 30;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <p
        style={{
          color: "oklch(0.38 0.08 295)",
          fontSize: "0.58rem",
          letterSpacing: "0.18em",
        }}
      >
        {label}
      </p>

      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas
          ref={canvasRef}
          width={72}
          height={72}
          onClick={handleCanvasClick}
          style={{
            display: "block",
            borderRadius: "50%",
            cursor: "crosshair",
            opacity: 0.85,
          }}
        />
        {/* Hue indicator dot */}
        <div
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: color,
            border: "1px solid rgba(255,255,255,0.4)",
            pointerEvents: "none",
            top: `calc(50% + ${Math.sin(indicatorAngle) * indicatorR}px - 3px)`,
            left: `calc(50% + ${Math.cos(indicatorAngle) * indicatorR}px - 3px)`,
          }}
        />
      </div>

      {/* Lightness slider */}
      <input
        type="range"
        min="20"
        max="75"
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
  );
}
