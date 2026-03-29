import { useMemo, useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const brownStroke = "#8b5e34";

interface Props {
  triggerQuestionId?: string;
}

const CarpentersChallenge = ({ triggerQuestionId }: Props) => {
  const { passSafetyGate } = useGameStore();
  const [strip2Length, setStrip2Length] = useState("10cm");
  const [intersection, setIntersection] = useState("Off-center");
  const [angle, setAngle] = useState("60° (Slanted)");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackColor, setFeedbackColor] = useState("text-gray-700");
  const [isGoalMet, setIsGoalMet] = useState(false);

  const goalText = useMemo(() => {
    if (triggerQuestionId === "m3_q1") {
      return "Goal: Show how two beams must be nailed at their exact centers to bisect each other.";
    }
    if (triggerQuestionId === "m3_q2") {
      return "Goal: Build a Rectangle. Hint: Diagonals must be equal in length (8cm).";
    }
    if (triggerQuestionId === "m3_q3") {
      return "Goal: Build a Rhombus. Hint: Diagonals must cross at exactly 90°.";
    }
    if (triggerQuestionId === "m3_q4") {
      return "Goal: Visualize Bisection. If a full beam is 20cm, how far is the center? (Hint: Set Intersection to Exact Center).";
    }
    if (triggerQuestionId === "m3_q5") {
      return "Goal: Build a Square. Hint: Diagonals must be Equal AND 90° AND Bisecting.";
    }
    return "Goal: Test the diagonal rules for rectangles and squares.";
  }, [triggerQuestionId]);

  const checkFrame = () => {
    if (triggerQuestionId === "m3_q1" || triggerQuestionId === "m3_q4") {
      if (intersection === "Exact Center (Bisect)") {
        setIsGoalMet(true);
        setFeedbackMessage(
          "Correct! In all parallelograms, the nail must go through the exact middle of both beams. This is Bisection.",
        );
        setFeedbackColor("text-green-600");
        return;
      }
    }

    if (triggerQuestionId === "m3_q2") {
      if (strip2Length === "8cm" && intersection === "Exact Center (Bisect)") {
        setIsGoalMet(true);
        setFeedbackMessage("Great! Equal diagonals that bisect each other always form a Rectangle.");
        setFeedbackColor("text-green-600");
        return;
      }
    }

    if (triggerQuestionId === "m3_q3") {
      if (angle === "90° (Perpendicular)" && intersection === "Exact Center (Bisect)") {
        setIsGoalMet(true);
        setFeedbackMessage("Perfect! When diagonals cross at 90°, they form a Rhombus with 4 equal sides.");
        setFeedbackColor("text-green-600");
        return;
      }
    }

    if (triggerQuestionId === "m3_q5") {
      if (strip2Length === "8cm" && intersection === "Exact Center (Bisect)" && angle === "90° (Perpendicular)") {
        setIsGoalMet(true);
        setFeedbackMessage(
          "Brilliant! You've built a Square—the only shape where diagonals are Equal, Bisecting, AND Perpendicular!",
        );
        setFeedbackColor("text-blue-600");
        return;
      }
    }

    if (strip2Length !== "8cm") {
      setIsGoalMet(false);
      setFeedbackMessage(
        "Error: Violated: Constraint_Rectangle_Diagonal_Equality. One diagonal is longer than the other. A rectangle's diagonals must be identical.",
      );
      setFeedbackColor("text-red-600");
      return;
    }

    if (intersection !== "Exact Center (Bisect)") {
      setIsGoalMet(false);
      setFeedbackMessage(
        "Error: Violated: Constraint_Rectangle_Diagonal_Bisection. The strips don't cross in the middle. Diagonals must bisect each other to form a rectangle.",
      );
      setFeedbackColor("text-red-600");
      return;
    }

    if (angle !== "90° (Perpendicular)") {
      setIsGoalMet(false);
      setFeedbackMessage("Success: You have built a Rectangle! Notice that the opposite sides are equal and parallel.");
      setFeedbackColor("text-green-600");
      return;
    }

    setIsGoalMet(true);
    setFeedbackMessage(
      "Mastery: Excellent! By crossing equal, bisecting diagonals at 90°, you created a Square! All four sides are now equal.",
    );
    setFeedbackColor("text-blue-600");
  };

  const { line1, line2, boxPoints, label1, label2, rightAngleArc } = useMemo(() => {
    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;

    const offsetMap: Record<string, { x: number; y: number }> = {
      "Near Top": { x: 10, y: -55 },
      "Off-center": { x: 35, y: -14 },
      "Exact Center (Bisect)": { x: 0, y: 0 },
    };
    const pivotOffset = offsetMap[intersection] ?? { x: 0, y: 0 };
    const pivotX = centerX + pivotOffset.x;
    const pivotY = centerY + pivotOffset.y;

    const diag1Length = 240;
    const lengthScale: Record<string, number> = {
      "6cm": 0.7,
      "8cm": 1,
      "10cm": 1.2,
      "12cm": 1.45,
    };
    const diag2Length = diag1Length * (lengthScale[strip2Length] ?? 1);

    if (angle === "90° (Perpendicular)") {
      const half1 = diag1Length / 2;
      const half2 = diag2Length / 2;

      const line1Coords = {
        x1: pivotX,
        y1: pivotY - half1,
        x2: pivotX,
        y2: pivotY + half1,
      };

      const line2Coords = {
        x1: pivotX - half2,
        y1: pivotY,
        x2: pivotX + half2,
        y2: pivotY,
      };

      const box = [
        { x: pivotX, y: pivotY - half1 },
        { x: pivotX + half2, y: pivotY },
        { x: pivotX, y: pivotY + half1 },
        { x: pivotX - half2, y: pivotY },
      ];

      return {
        line1: line1Coords,
        line2: line2Coords,
        boxPoints: box,
        label1: { x: pivotX - 16, y: pivotY - half1 - 12 },
        label2: { x: pivotX + half2 + 8, y: pivotY - 10 },
        rightAngleArc: {
          x: pivotX + 6,
          y: pivotY - 6,
        },
      };
    }

    const slopeAngleMap: Record<string, number> = {
      "30° (Sharp)": Math.PI / 6,
      "60° (Slanted)": Math.PI / 3,
      "90° (Perpendicular)": Math.PI / 2,
    };
    const slopeAngle = slopeAngleMap[angle] ?? Math.PI / 3;
    const dx1 = Math.cos(slopeAngle) * (diag1Length / 2);
    const dy1 = Math.sin(slopeAngle) * (diag1Length / 2);

    const dx2 = Math.cos(slopeAngle) * (diag2Length / 2);
    const dy2 = Math.sin(slopeAngle) * (diag2Length / 2);

    const line1Coords = {
      x1: pivotX - dx1,
      y1: pivotY - dy1,
      x2: pivotX + dx1,
      y2: pivotY + dy1,
    };

    const line2Coords = {
      x1: pivotX + dx2,
      y1: pivotY - dy2,
      x2: pivotX - dx2,
      y2: pivotY + dy2,
    };

    let box = [
      { x: line1Coords.x1, y: line2Coords.y1 },
      { x: line2Coords.x1, y: line1Coords.y1 },
      { x: line1Coords.x2, y: line2Coords.y2 },
      { x: line2Coords.x2, y: line1Coords.y2 },
    ];

    if (strip2Length === "8cm" && angle === "60° (Slanted)") {
      const rectHalfWidth = Math.cos(slopeAngle) * (diag1Length / 2) * 1.35;
      const rectHalfHeight = Math.sin(slopeAngle) * (diag1Length / 2) * 0.9;
      box = [
        { x: pivotX - rectHalfWidth, y: pivotY - rectHalfHeight },
        { x: pivotX + rectHalfWidth, y: pivotY - rectHalfHeight },
        { x: pivotX + rectHalfWidth, y: pivotY + rectHalfHeight },
        { x: pivotX - rectHalfWidth, y: pivotY + rectHalfHeight },
      ];
    } else if (strip2Length === "8cm") {
      const rectHalfWidth = Math.cos(slopeAngle) * (diag1Length / 2);
      const rectHalfHeight = Math.sin(slopeAngle) * (diag1Length / 2);
      box = [
        { x: pivotX - rectHalfWidth, y: pivotY - rectHalfHeight },
        { x: pivotX + rectHalfWidth, y: pivotY - rectHalfHeight },
        { x: pivotX + rectHalfWidth, y: pivotY + rectHalfHeight },
        { x: pivotX - rectHalfWidth, y: pivotY + rectHalfHeight },
      ];
    }

    return {
      line1: line1Coords,
      line2: line2Coords,
      boxPoints: box,
      label1: { x: line1Coords.x1 - 18, y: line1Coords.y1 - 14 },
      label2: { x: line2Coords.x1 + 8, y: line2Coords.y1 - 14 },
      rightAngleArc: null,
    };
  }, [strip2Length, intersection, angle]);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Carpenter&apos;s Challenge</h2>
        <p className="text-sm text-slate-500">
          Adjust the wooden strips to see if you can build a perfect rectangle.
        </p>
        <p className="text-xs font-semibold text-slate-500 mt-2">Strip 1 Length: 8cm (Fixed)</p>
        <p className="text-sm font-semibold text-slate-700 mt-2">{goalText}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Strip 2 Length</label>
          <select
            value={strip2Length}
            onChange={(event) => setStrip2Length(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            <option value="6cm">6cm</option>
            <option value="8cm">8cm</option>
            <option value="10cm">10cm</option>
            <option value="12cm">12cm</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Intersection</label>
          <select
            value={intersection}
            onChange={(event) => setIntersection(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            <option value="Near Top">Near Top</option>
            <option value="Off-center">Off-center</option>
            <option value="Exact Center (Bisect)">Exact Center (Bisect)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Angle</label>
          <select
            value={angle}
            onChange={(event) => setAngle(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            <option value="30° (Sharp)">30° (Sharp)</option>
            <option value="60° (Slanted)">60° (Slanted)</option>
            <option value="90° (Perpendicular)">90° (Perpendicular)</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <svg viewBox="0 0 400 300" className="h-[300px] w-full">
          <polygon
            points={boxPoints.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={2}
            strokeDasharray="6 6"
          />
          <line
            x1={line1.x1}
            y1={line1.y1}
            x2={line1.x2}
            y2={line1.y2}
            stroke={brownStroke}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <line
            x1={line2.x1}
            y1={line2.y1}
            x2={line2.x2}
            y2={line2.y2}
            stroke={brownStroke}
            strokeWidth={10}
            strokeLinecap="round"
          />
          <text x={label1.x} y={label1.y} fill="#1f2937" fontSize={12} fontWeight={600}>
            Strip 1
          </text>
          <text x={label2.x} y={label2.y} fill="#1f2937" fontSize={12} fontWeight={600}>
            Strip 2
          </text>
          {rightAngleArc && (
            <path
              d={`M ${rightAngleArc.x} ${rightAngleArc.y} h 16 v 16`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={3}
            />
          )}
          <circle cx={line1.x1} cy={line1.y1} r={5} fill="#334155" />
          <circle cx={line1.x2} cy={line1.y2} r={5} fill="#334155" />
          <circle cx={line2.x1} cy={line2.y1} r={5} fill="#334155" />
          <circle cx={line2.x2} cy={line2.y2} r={5} fill="#334155" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <button
          type="button"
          onClick={checkFrame}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Test Frame
        </button>
        <div className={`text-sm font-semibold ${feedbackColor}`}>
          {feedbackMessage ?? "Adjust the settings, then test your frame."}
        </div>
      </div>

      {isGoalMet && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={passSafetyGate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Back to Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default CarpentersChallenge;
