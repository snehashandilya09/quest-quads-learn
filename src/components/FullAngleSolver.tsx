import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const FullAngleSolver = () => {
  const { passSafetyGate } = useGameStore();
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);

  const allDone = step1 && step2 && step3;

  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="rounded-xl border border-amber-200 bg-white p-4">
        <svg viewBox="0 0 320 200" className="h-40 w-full">
          <polygon
            points="70,40 250,40 220,150 40,150"
            fill="rgba(251, 191, 36, 0.08)"
            stroke="#92400e"
            strokeWidth={4}
            strokeLinejoin="round"
          />

          {(step1 || step2) && (
            <circle cx={70} cy={40} r={7} fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth={2} />
          )}
          {(step1 || step2) && (
            <circle cx={220} cy={150} r={7} fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth={2} />
          )}
          {step2 && (
            <circle cx={250} cy={40} r={7} fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth={2} />
          )}
          {step3 && (
            <circle cx={40} cy={150} r={7} fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth={2} />
          )}

          <text x={62} y={30} fill="#92400e" fontSize={12} fontWeight={700}>
            A = 50°
          </text>
          <text x={242} y={30} fill="#92400e" fontSize={12} fontWeight={700}>
            B = {step2 ? "130°" : "?"}
          </text>
          <text x={230} y={168} fill="#92400e" fontSize={12} fontWeight={700}>
            C = {step1 ? "50°" : "?"}
          </text>
          <text x={30} y={168} fill="#92400e" fontSize={12} fontWeight={700}>
            D = {step3 ? "130°" : "?"}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep1(true)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
        >
          Step 1: Find the Opposite
        </button>
        <button
          type="button"
          onClick={() => setStep2(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Step 2: Find the Neighbor
        </button>
        <button
          type="button"
          onClick={() => setStep3(true)}
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
        >
          Step 3: Find the Last Angle
        </button>
      </div>

      <div className="space-y-2 text-sm text-amber-900">
        {step1 && <div>Opposites are Equal!</div>}
        {step2 && <div>Neighbors (Adjacent) must add to 180°. (180 - 50 = 130)</div>}
        {step3 && <div>Now use the opposite rule again!</div>}
      </div>

      {allDone && (
        <div className="rounded-lg border border-amber-200 bg-amber-100/60 p-3 text-sm text-amber-900 space-y-2">
          <div>Result: 130°, 50°, 130°</div>
          <div>Total Check: Sum = 50 + 130 + 50 + 130 = 360°</div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={passSafetyGate}
              className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
            >
              Back to Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullAngleSolver;
