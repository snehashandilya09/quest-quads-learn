import { useState } from "react";

const RegularityChecker = () => {
  const [checkAngles, setCheckAngles] = useState(false);
  const [checkSides, setCheckSides] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-white p-3">
          <div className="text-xs font-semibold text-emerald-700 mb-2">Rectangle</div>
          <svg viewBox="0 0 160 120" className="h-28 w-full">
            <rect x={25} y={25} width={110} height={60} fill="none" stroke="#1f2937" strokeWidth={4} />
            {checkAngles && (
              <rect x={20} y={20} width={120} height={70} fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" strokeWidth={2} />
            )}
            {checkSides && (
              <>
                <line x1={25} y1={25} x2={135} y2={25} stroke="#22c55e" strokeWidth={5} />
                <line x1={25} y1={85} x2={135} y2={85} stroke="#22c55e" strokeWidth={5} />
                <line x1={25} y1={25} x2={25} y2={85} stroke="#ef4444" strokeWidth={5} />
                <line x1={135} y1={25} x2={135} y2={85} stroke="#ef4444" strokeWidth={5} />
              </>
            )}
          </svg>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-white p-3">
          <div className="text-xs font-semibold text-emerald-700 mb-2">Square</div>
          <svg viewBox="0 0 160 120" className="h-28 w-full">
            <rect x={40} y={20} width={70} height={70} fill="none" stroke="#1f2937" strokeWidth={4} />
            {checkAngles && (
              <rect x={34} y={14} width={82} height={82} fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" strokeWidth={2} />
            )}
            {checkSides && (
              <rect x={40} y={20} width={70} height={70} fill="none" stroke="#22c55e" strokeWidth={5} />
            )}
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setCheckAngles(true)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
        >
          Check Angles
        </button>
        <button
          type="button"
          onClick={() => setCheckSides(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Check Side Lengths
        </button>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-100/60 p-3 text-sm text-emerald-900">
        A Regular shape must pass BOTH tests. Only the Square is perfectly balanced!
      </div>
    </div>
  );
};

export default RegularityChecker;
