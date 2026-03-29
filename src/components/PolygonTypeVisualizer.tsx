import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const PolygonTypeVisualizer = () => {
  const { passSafetyGate } = useGameStore();
  const [showBand, setShowBand] = useState(false);
  const [dentActive, setDentActive] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <div>
        <h3 className="text-lg font-semibold text-emerald-900">Concave vs Convex</h3>
        <p className="text-sm text-emerald-800">
          Compare the shapes and try the rubber band test.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-white p-3">
          <div className="text-xs font-semibold text-emerald-700 mb-2">Shape A: Convex</div>
          <svg viewBox="0 0 160 140" className="h-32 w-full">
            <polygon
              points="80,15 125,35 140,70 125,105 80,125 35,105 20,70 35,35"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10b981"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            {showBand && (
              <polygon
                points="80,10 130,32 148,70 130,108 80,130 30,108 12,70 30,32"
                fill="none"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="6 6"
              />
            )}
          </svg>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-white p-3">
          <div className="text-xs font-semibold text-emerald-700 mb-2">Shape B: Concave</div>
          <svg viewBox="0 0 160 140" className="h-32 w-full">
            <polygon
              points="80,15 125,35 140,70 90,85 125,105 80,125 35,105 20,70 35,35"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#10b981"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            {showBand && (
              <polygon
                points="80,10 130,32 148,70 130,108 80,130 30,108 12,70 30,32"
                fill="none"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="6 6"
              />
            )}
            <circle
              cx={90}
              cy={85}
              r={6}
              fill={dentActive ? "#ef4444" : "#f97316"}
              onClick={() => setDentActive(true)}
              className="cursor-pointer"
            />
          </svg>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowBand(true)}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
      >
        Run the Rubber Band Test
      </button>

      {showBand && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-100/60 p-3 text-sm text-emerald-900">
          If a rubber band leaves a gap, it is CONCAVE (like a cave you can enter)!
        </div>
      )}

      {dentActive && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          This interior angle is greater than 180°!
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={passSafetyGate}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          Continue to Quiz
        </button>
      </div>
    </div>
  );
};

export default PolygonTypeVisualizer;
