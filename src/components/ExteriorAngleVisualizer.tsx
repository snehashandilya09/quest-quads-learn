import { useMemo, useState } from "react";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const ExteriorAngleVisualizer = () => {
  const [shrink, setShrink] = useState(1);

  const { points, center } = useMemo(() => {
    const base = [
      { x: 160, y: 40 },
      { x: 60, y: 190 },
      { x: 260, y: 190 },
    ];
    const cx = 160;
    const cy = 140;
    const scaled = base.map((pt) => ({
      x: cx + (pt.x - cx) * shrink,
      y: cy + (pt.y - cy) * shrink,
    }));
    return { points: scaled, center: { x: cx, y: cy } };
  }, [shrink]);

  const angleRays = useMemo(() => {
    const rayLength = 46;
    return points.map((pt, index) => {
      const next = points[(index + 1) % points.length];
      const prev = points[(index + points.length - 1) % points.length];

      const vec1 = { x: prev.x - pt.x, y: prev.y - pt.y };
      const vec2 = { x: next.x - pt.x, y: next.y - pt.y };

      const len1 = Math.hypot(vec1.x, vec1.y) || 1;
      const len2 = Math.hypot(vec2.x, vec2.y) || 1;
      const dir1 = { x: vec1.x / len1, y: vec1.y / len1 };
      const dir2 = { x: vec2.x / len2, y: vec2.y / len2 };

      return {
        a: { x: pt.x + dir1.x * rayLength, y: pt.y + dir1.y * rayLength },
        b: { x: pt.x + dir2.x * rayLength, y: pt.y + dir2.y * rayLength },
      };
    });
  }, [points]);

  const isFullyShrunk = shrink <= 0.25;

  return (
    <div className="space-y-4 rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
      <div className="rounded-xl border border-sky-200 bg-white p-4">
        <svg viewBox="0 0 320 220" className="h-44 w-full">
          <polygon
            points={points.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="rgba(14, 165, 233, 0.08)"
            stroke="#0284c7"
            strokeWidth={3}
            strokeLinejoin="round"
          />

          {angleRays.map((ray, index) => (
            <g key={`ray-${index}`}>
              <line x1={points[index].x} y1={points[index].y} x2={ray.a.x} y2={ray.a.y} stroke="#0ea5e9" strokeWidth={3} />
              <line x1={points[index].x} y1={points[index].y} x2={ray.b.x} y2={ray.b.y} stroke="#0ea5e9" strokeWidth={3} />
            </g>
          ))}

          {isFullyShrunk && (
            <circle cx={center.x} cy={center.y} r={42} fill="none" stroke="#0ea5e9" strokeWidth={4} />
          )}
        </svg>
      </div>

      <div className="rounded-xl border border-sky-200 bg-white p-3">
        <label className="text-sm font-semibold text-sky-900">Shrink Shape</label>
        <input
          type="range"
          min={0.25}
          max={1}
          step={0.01}
          value={shrink}
          onChange={(event) => setShrink(Number(event.target.value))}
          className="mt-2 w-full accent-sky-600"
        />
      </div>

      {isFullyShrunk && (
        <div className="rounded-lg border border-sky-200 bg-sky-100/60 p-3 text-sm text-sky-900">
          No matter how many sides a polygon has, turning all the way around always equals 360°.
        </div>
      )}
    </div>
  );
};

export default ExteriorAngleVisualizer;
