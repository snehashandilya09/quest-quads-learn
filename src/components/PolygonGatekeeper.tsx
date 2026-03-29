import { useState } from "react";

const PolygonGatekeeper = () => {
  const [hoverTarget, setHoverTarget] = useState<"triangle" | "circle" | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="rounded-xl border border-amber-200 bg-white p-4">
        <svg viewBox="0 0 320 200" className="h-40 w-full">
          <g onMouseEnter={() => setHoverTarget("triangle")} onMouseLeave={() => setHoverTarget(null)}>
            <polygon
              points="70,40 140,160 20,160"
              fill="rgba(245, 158, 11, 0.08)"
              stroke="#b45309"
              strokeWidth={4}
              strokeLinejoin="round"
            />
            {hoverTarget === "triangle" && (
              <text x={80} y={20} textAnchor="middle" fill="#15803d" fontSize={12} fontWeight={700}>
                Straight Edge ✅
              </text>
            )}
          </g>

          <g onMouseEnter={() => setHoverTarget("circle")} onMouseLeave={() => setHoverTarget(null)}>
            <circle cx={235} cy={110} r={55} fill="rgba(248, 113, 113, 0.08)" stroke="#b91c1c" strokeWidth={4} />
            {hoverTarget === "circle" && (
              <text x={235} y={40} textAnchor="middle" fill="#dc2626" fontSize={12} fontWeight={700}>
                Curve Detected ⚠️
              </text>
            )}
          </g>
        </svg>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-100/60 p-3 text-sm text-amber-900">
        A Polygon must be made of ONLY straight line segments. Since a circle is one continuous curve, it is NOT a polygon.
      </div>
    </div>
  );
};

export default PolygonGatekeeper;
