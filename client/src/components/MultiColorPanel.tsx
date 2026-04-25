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
        width: collapsed ? "2rem" : "160px",
        transition: "width 0.4s ease",
        borderRight: "1px solid oklch(0.15 0.04 295 / 0.3)",
        background: "oklch(0.06 0.01 280)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-center py-4"
        style={{
          background: "none",
          border: "none",
          color: "oklch(0.35 0.08 295)",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          writingMode: collapsed ? "vertical-rl" : "horizontal-tb",
          transform: collapsed ? "rotate(180deg)" : "none",
          transition: "all 0.4s ease",
          minHeight: "80px",
        }}
      >
        Multi-Color-Displays
      </button>

      {/* Wheels — only visible when expanded */}
      {!collapsed && (
        <div className="flex flex-col gap-6 px-3 pb-6 animate-fade-in-up">
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

          {/* Preview swatch */}
          <div className="flex gap-2 mt-2">
            <div
              className="flex-1 h-6 rounded-sm"
              style={{ background: toOklch(wheel1), opacity: 0.7 }}
            />
            <div
              className="flex-1 h-6 rounded-sm"
              style={{ background: toOklch(wheel2), opacity: 0.7 }}
            />
          </div>

          <p
            className="text-xs"
            style={{
              color: "oklch(0.28 0.06 295)",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              lineHeight: 1.6,
            }}
          >
            perceptual only.
            <br />
            others see nothing.
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
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    drawWheel();
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 2;

    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 60%, 45%)`;
      ctx.fill();
    }

    // Center circle — lightness control area
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.5);
    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    const hue = ((angle + 360) % 360);
    const dist = Math.sqrt(x * x + y * y) / (canvas.width / 2);
    const saturation = Math.min(0.25, dist * 0.25);
    const lightness = Math.max(0.2, Math.min(0.7, 0.45 + (0.5 - dist) * 0.3));
    onChange({ hue: Math.round(hue), saturation, lightness });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p
        className="text-xs"
        style={{ color: "oklch(0.35 0.08 295)", fontSize: "0.6rem", letterSpacing: "0.15em" }}
      >
        {label}
      </p>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={80}
          height={80}
          onClick={handleCanvasClick}
          className="rounded-full cursor-crosshair"
          style={{ display: "block", opacity: 0.8 }}
        />
        {/* Indicator dot */}
        <div
          className="absolute w-2 h-2 rounded-full border border-white/50 pointer-events-none"
          style={{
            background: color,
            top: "50%",
            left: "50%",
            transform: `translate(
              calc(-50% + ${Math.cos((value.hue * Math.PI) / 180) * 28}px),
              calc(-50% + ${Math.sin((value.hue * Math.PI) / 180) * 28}px)
            )`,
          }}
        />
      </div>

      {/* Lightness slider */}
      <input
        type="range"
        min="20"
        max="80"
        value={Math.round(value.lightness * 100)}
        onChange={(e) =>
          onChange({ ...value, lightness: parseInt(e.target.value) / 100 })
        }
        className="w-full"
        style={{ accentColor: color, height: "2px" }}
      />
    </div>
  );
}
