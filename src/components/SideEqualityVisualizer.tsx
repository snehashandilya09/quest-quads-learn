import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const SideEqualityVisualizer = () => {
  const { passSafetyGate } = useGameStore();
  const [hasSlid, setHasSlid] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
      <div className="rounded-xl border border-blue-200 bg-white p-4">
        <svg viewBox="0 0 320 200" className="h-40 w-full">
          <polygon
            points="70,40 250,40 220,150 40,150"
            fill="rgba(59, 130, 246, 0.06)"
            stroke="#1e40af"
            strokeWidth={4}
            strokeLinejoin="round"
          />

          <line x1={70} y1={40} x2={250} y2={40} stroke="#1e40af" strokeWidth={4} />
          <line x1={40} y1={150} x2={220} y2={150} stroke={hasSlid ? "#1e40af" : "#94a3b8"} strokeWidth={4} />

          <text x={160} y={28} textAnchor="middle" fill="#1e40af" fontSize={13} fontWeight={700}>
            15 cm
          </text>
          <text x={150} y={168} textAnchor="middle" fill={hasSlid ? "#1e40af" : "#94a3b8"} fontSize={13} fontWeight={700}>
            {hasSlid ? "15 cm" : "?"}
          </text>

          <text
            x={160}
            y={hasSlid ? 150 : 50}
            textAnchor="middle"
            fill="#60a5fa"
            fontSize={12}
            fontWeight={700}
            style={{ transition: "transform 500ms ease, opacity 500ms ease", transform: `translateY(${hasSlid ? 8 : 0}px)` }}
            opacity={hasSlid ? 0 : 1}
          >
            15 cm
          </text>
        </svg>
      </div>

      <button
        type="button"
        onClick={() => setHasSlid(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Slide the Measurement
      </button>

      {hasSlid && (
        <div className="rounded-lg border border-blue-200 bg-blue-100/60 p-3 text-sm text-blue-900">
          In a Parallelogram, the opposite sides are mirror images. They MUST be the same length!
        </div>
      )}

      {hasSlid && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={passSafetyGate}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            Back to Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default SideEqualityVisualizer;
