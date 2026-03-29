import { useMemo, useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const InteractiveTrapeziumProperties = () => {
  const { passSafetyGate } = useGameStore();
  const [showParallel, setShowParallel] = useState(false);
  const [showDiagonals, setShowDiagonals] = useState(false);
  const [showAngles, setShowAngles] = useState(false);

  const completedCount = useMemo(() => {
    return [showParallel, showDiagonals, showAngles].filter(Boolean).length;
  }, [showParallel, showDiagonals, showAngles]);

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowParallel(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
        >
          Check Parallel Sides
        </button>
        <button
          type="button"
          onClick={() => setShowDiagonals(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Check Diagonals
        </button>
        <button
          type="button"
          onClick={() => setShowAngles(true)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
        >
          Check Interior Angles
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-white p-4">
        <svg viewBox="0 0 320 220" className="h-48 w-full">
          <polygon
            points="60,40 260,40 230,180 90,180"
            fill="rgba(251, 191, 36, 0.08)"
            stroke="#1f2937"
            strokeWidth={4}
            strokeLinejoin="round"
          />

          {showParallel && (
            <>
              <line x1={60} y1={40} x2={260} y2={40} stroke="#22c55e" strokeWidth={6} />
              <line x1={90} y1={180} x2={230} y2={180} stroke="#22c55e" strokeWidth={6} />
              <text x={160} y={30} textAnchor="middle" fill="#16a34a" fontSize={12} fontWeight={700}>
                &gt;&gt;
              </text>
              <text x={160} y={200} textAnchor="middle" fill="#16a34a" fontSize={12} fontWeight={700}>
                &gt;&gt;
              </text>
            </>
          )}

          {showDiagonals && (
            <>
              <line x1={60} y1={40} x2={230} y2={180} stroke="#0f172a" strokeWidth={3} />
              <line x1={260} y1={40} x2={90} y2={180} stroke="#0f172a" strokeWidth={3} />
              <circle cx={155} cy={105} r={4} fill="#ef4444" />
              <line x1={155} y1={105} x2={230} y2={180} stroke="#ef4444" strokeWidth={2} />
              <line x1={155} y1={105} x2={90} y2={180} stroke="#ef4444" strokeWidth={5} />
            </>
          )}

          {showAngles && (
            <>
              <circle cx={60} cy={40} r={6} fill="#f59e0b" />
              <circle cx={260} cy={40} r={6} fill="#f59e0b" />
              <circle cx={230} cy={180} r={6} fill="#f59e0b" />
              <circle cx={90} cy={180} r={6} fill="#f59e0b" />
              <text x={160} y={110} textAnchor="middle" fill="#b45309" fontSize={14} fontWeight={700}>
                Sum = 360°
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="space-y-2 text-sm text-amber-900">
        {showParallel && (
          <div>Rule: A Trapezium has exactly ONE pair of parallel lines.</div>
        )}
        {showDiagonals && (
          <div>Look closely: The diagonals cross, but they do NOT bisect each other (unlike a Parallelogram).</div>
        )}
        {showAngles && (
          <div>Like all 4-sided shapes (quadrilaterals), the total sum is 360°, not 540°.</div>
        )}
      </div>

      {completedCount >= 2 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={passSafetyGate}
            className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
          >
            I&apos;m ready to finish the quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveTrapeziumProperties;
