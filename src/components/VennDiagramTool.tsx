import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const SquareSize = 36;

interface Props {
  goalText?: string;
}

const VennDiagramTool = ({ goalText }: Props) => {
  const { passSafetyGate } = useGameStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [squarePos, setSquarePos] = useState({ x: 300, y: 70 });
  const [isPlaced, setIsPlaced] = useState(false);
  const [showScaffold, setShowScaffold] = useState(false);
  const [step1Yes, setStep1Yes] = useState(false);
  const [step2Yes, setStep2Yes] = useState(false);

  const center = useMemo(() => ({ x: 190, y: 150 }), []);
  const rectangleRadius = 85;

  const resetScaffold = () => {
    setShowScaffold(false);
    setStep1Yes(false);
    setStep2Yes(false);
  };

  const moveSquareToCenter = () => {
    setSquarePos({ x: center.x - SquareSize / 2, y: center.y - SquareSize / 2 });
    setIsPlaced(true);
  };

  const handleDrop = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dropX = clientX - rect.left - SquareSize / 2;
    const dropY = clientY - rect.top - SquareSize / 2;
    setSquarePos({ x: dropX, y: dropY });

    const squareCenter = { x: dropX + SquareSize / 2, y: dropY + SquareSize / 2 };
    const distance = Math.hypot(squareCenter.x - center.x, squareCenter.y - center.y);

    if (distance <= rectangleRadius) {
      moveSquareToCenter();
      resetScaffold();
      return;
    }

    setIsPlaced(false);
    setShowScaffold(true);
  };

  useEffect(() => {
    if (step1Yes && step2Yes) {
      moveSquareToCenter();
      setShowScaffold(false);
    }
  }, [step1Yes, step2Yes]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Shape Families Venn</h3>
        <p className="text-sm text-slate-500">
          Drag the Square into the correct region.
        </p>
        {goalText && (
          <p className="mt-2 text-sm font-semibold text-slate-700">{goalText}</p>
        )}
      </div>

      <div ref={containerRef} className="relative h-[320px] w-full rounded-xl border border-slate-200 bg-slate-50">
        <svg viewBox="0 0 380 280" className="h-full w-full">
          <circle cx={190} cy={150} r={120} fill="#e0f2fe" stroke="#38bdf8" strokeWidth={2} />
          <circle cx={190} cy={150} r={85} fill="#dcfce7" stroke="#22c55e" strokeWidth={2} />
          <circle cx={190} cy={150} r={50} fill="#fee2e2" stroke="#ef4444" strokeWidth={2} />
          <text x={190} y={45} textAnchor="middle" fill="#0f172a" fontSize={12} fontWeight={600}>
            Parallelograms
          </text>
          <text x={190} y={90} textAnchor="middle" fill="#0f172a" fontSize={12} fontWeight={600}>
            Rectangles
          </text>
          <text x={190} y={135} textAnchor="middle" fill="#0f172a" fontSize={12} fontWeight={600}>
            Squares
          </text>
        </svg>

        <div
          role="button"
          draggable
          onDragEnd={(event) => handleDrop(event.clientX, event.clientY)}
          onDragStart={() => setIsPlaced(false)}
          className={`absolute flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-xs font-semibold text-white shadow-lg transition-all ${
            isPlaced ? "scale-110" : "cursor-grab"
          }`}
          style={{ left: squarePos.x, top: squarePos.y }}
        >
          Square
        </div>
      </div>

      {showScaffold && !isPlaced && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3 text-sm text-amber-900">
          <div className="font-semibold">Wait! Does a square have 4 right angles?</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep1Yes(true)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${step1Yes ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-300"}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setStep1Yes(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-white text-amber-700 border border-amber-300"
            >
              No
            </button>
          </div>
          {step1Yes && (
            <>
              <div className="font-semibold">Does it have equal opposite sides?</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep2Yes(true)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${step2Yes ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-300"}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setStep2Yes(false)}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-white text-amber-700 border border-amber-300"
                >
                  No
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {isPlaced && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={passSafetyGate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default VennDiagramTool;
