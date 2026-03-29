import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const PerimeterVisualizer = () => {
  const { passSafetyGate } = useGameStore();
  const [showMirror, setShowMirror] = useState(false);
  const [showPerimeter, setShowPerimeter] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
      <div className="rounded-xl border border-blue-200 bg-white p-4">
        <svg viewBox="0 0 320 200" className="h-40 w-full">
          <polygon
            points="70,40 240,40 210,150 40,150"
            fill="rgba(59, 130, 246, 0.08)"
            stroke="#1e40af"
            strokeWidth={4}
            strokeLinejoin="round"
          />

          <text x={155} y={28} textAnchor="middle" fill="#1e40af" fontSize={12} fontWeight={700}>
            12m
          </text>
          <text x={42} y={100} textAnchor="middle" fill="#1e40af" fontSize={12} fontWeight={700}>
            7m
          </text>

          {showMirror && (
            <>
              <line x1={70} y1={40} x2={240} y2={40} stroke="#93c5fd" strokeWidth={6} />
              <line x1={40} y1={150} x2={210} y2={150} stroke="#93c5fd" strokeWidth={6} />
              <text x={155} y={165} textAnchor="middle" fill="#1d4ed8" fontSize={12} fontWeight={700}>
                12m
              </text>

              <line x1={70} y1={40} x2={40} y2={150} stroke="#93c5fd" strokeWidth={6} />
              <line x1={240} y1={40} x2={210} y2={150} stroke="#93c5fd" strokeWidth={6} />
              <text x={220} y={105} textAnchor="middle" fill="#1d4ed8" fontSize={12} fontWeight={700}>
                7m
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowMirror(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Find Missing Sides
        </button>
        <button
          type="button"
          onClick={() => setShowPerimeter(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Calculate Perimeter
        </button>
      </div>

      {showMirror && (
        <div className="rounded-lg border border-blue-200 bg-blue-100/60 p-3 text-sm text-blue-900">
          Rule: Opposite sides are twins! If Top is 12m, Bottom is 12m.
        </div>
      )}

      {showPerimeter && (
        <div className="rounded-lg border border-blue-200 bg-blue-100/60 p-3 text-sm text-blue-900 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-blue-700">12m</span>
            <span className="text-blue-700">+</span>
            <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-blue-700">7m</span>
            <span className="text-blue-700">+</span>
            <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-blue-700">12m</span>
            <span className="text-blue-700">+</span>
            <span className="rounded bg-white px-2 py-1 text-xs font-semibold text-blue-700">7m</span>
          </div>
          <div className="font-semibold">Total Perimeter = 12 + 7 + 12 + 7 = 38m</div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={passSafetyGate}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
            >
              I&apos;m ready - Back to Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerimeterVisualizer;
