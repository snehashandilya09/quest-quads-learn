import { useMemo, useState } from "react";

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const getArcPath = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = {
    x: cx + radius * Math.cos(degToRad(startAngle)),
    y: cy - radius * Math.sin(degToRad(startAngle)),
  };
  const end = {
    x: cx + radius * Math.cos(degToRad(endAngle)),
    y: cy - radius * Math.sin(degToRad(endAngle)),
  };

  const delta = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = delta > 180 ? 1 : 0;

  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
};

const getAnglePoint = (cx: number, cy: number, radius: number, angle: number) => ({
  x: cx + radius * Math.cos(degToRad(angle)),
  y: cy - radius * Math.sin(degToRad(angle)),
});

interface Props {
  oppositeMode?: boolean;
}

const InteractiveParallelogram = ({ oppositeMode = false }: Props) => {
  const [angleA, setAngleA] = useState(60);
  const angleB = 180 - angleA;

  const {
    points,
    labelA,
    labelB,
    arcA,
    arcB,
    arcC,
    arcALabel,
    arcBLabel,
    arcCLabel,
    vertexLabels,
    topLeft,
    bottomLeft,
    bottomRight,
    topRight,
  } = useMemo(() => {
    const baseLength = 220;
    const sideLength = 140;
    const originX = 90;
    const originY = 240;
    const arcRadius = 40;
    const labelRadius = 58;

    const radians = degToRad(angleA);
    const dx = Math.cos(radians) * sideLength;
    const dy = Math.sin(radians) * sideLength;

    const bottomLeftPoint = { x: originX, y: originY };
    const bottomRightPoint = { x: originX + baseLength, y: originY };
    const topLeftPoint = { x: originX + dx, y: originY - dy };
    const topRightPoint = { x: bottomRightPoint.x + dx, y: bottomRightPoint.y - dy };

    const arcAPath = getArcPath(bottomLeftPoint.x, bottomLeftPoint.y, arcRadius, 0, angleA);
    const arcBPath = getArcPath(bottomRightPoint.x, bottomRightPoint.y, arcRadius, angleA, 180);
    const arcCPath = getArcPath(topRightPoint.x, topRightPoint.y, arcRadius, 180, 180 + angleA);

    const labelAPoint = getAnglePoint(bottomLeftPoint.x, bottomLeftPoint.y, labelRadius, angleA / 2);
    const labelBPoint = getAnglePoint(bottomRightPoint.x, bottomRightPoint.y, labelRadius, (angleA + 180) / 2);

    const vertexLabelOffset = 14;
    const vertices = {
      A: { x: bottomLeftPoint.x - vertexLabelOffset, y: bottomLeftPoint.y + vertexLabelOffset },
      B: { x: bottomRightPoint.x + vertexLabelOffset, y: bottomRightPoint.y + vertexLabelOffset },
      C: { x: topRightPoint.x + vertexLabelOffset, y: topRightPoint.y - vertexLabelOffset },
      D: { x: topLeftPoint.x - vertexLabelOffset, y: topLeftPoint.y - vertexLabelOffset },
    };

    return {
      points: `${bottomLeftPoint.x},${bottomLeftPoint.y} ${bottomRightPoint.x},${bottomRightPoint.y} ${topRightPoint.x},${topRightPoint.y} ${topLeftPoint.x},${topLeftPoint.y}`,
      labelA: { x: labelAPoint.x, y: labelAPoint.y },
      labelB: { x: labelBPoint.x, y: labelBPoint.y },
      arcALabel: { x: labelAPoint.x + 10, y: labelAPoint.y - 6 },
      arcBLabel: { x: labelBPoint.x - 10, y: labelBPoint.y - 6 },
      arcCLabel: { x: topRightPoint.x + 12, y: topRightPoint.y + 18 },
      vertexLabels: vertices,
      arcA: arcAPath,
      arcB: arcBPath,
      arcC: arcCPath,
      bottomLeft: bottomLeftPoint,
      bottomRight: bottomRightPoint,
      topLeft: topLeftPoint,
      topRight: topRightPoint,
    };
  }, [angleA]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-inner">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <label className="text-sm font-semibold text-slate-700">
            Drag to change Angle A
          </label>
          <div className="text-sm text-slate-500">{angleA}°</div>
        </div>
        <input
          type="range"
          min={30}
          max={150}
          value={angleA}
          onChange={(event) => setAngleA(Number(event.target.value))}
          className="mt-3 w-full accent-blue-600"
        />
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm font-medium text-blue-700">
        {oppositeMode ? (
          <>
            Opposite Rule: Angles facing each other across the shape are ALWAYS exactly equal.<br />
            Angle A ({angleA}°) = Angle C ({angleA}°)
          </>
        ) : (
          <>Dynamic Rule Check: {angleA}° + {angleB}° = 180°</>
        )}
      </div>

      <div className="w-full rounded-xl border border-slate-200 bg-white p-4">
        <svg viewBox="0 0 480 320" className="w-full h-[280px]">
          <line
            x1={bottomLeft.x - 40}
            y1={bottomLeft.y}
            x2={bottomRight.x + 120}
            y2={bottomRight.y}
            stroke="#94a3b8"
            strokeDasharray="6 6"
            strokeWidth={2}
          />
          <line
            x1={topLeft.x - 40}
            y1={topLeft.y}
            x2={topRight.x + 120}
            y2={topRight.y}
            stroke="#94a3b8"
            strokeDasharray="6 6"
            strokeWidth={2}
          />

          <polygon
            points={points}
            fill="rgba(59, 130, 246, 0.08)"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <path d={arcA} fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth={2} className={oppositeMode ? "animate-pulse" : ""} />
          {!oppositeMode && (
            <path d={arcB} fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth={2} />
          )}
          {oppositeMode && (
            <path d={arcC} fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth={2} className="animate-pulse" />
          )}

          <circle cx={bottomLeft.x} cy={bottomLeft.y} r={4} fill="#2563eb" />
          <circle cx={bottomRight.x} cy={bottomRight.y} r={4} fill="#2563eb" />
          <circle cx={topLeft.x} cy={topLeft.y} r={4} fill="#2563eb" />
          <circle cx={topRight.x} cy={topRight.y} r={4} fill="#2563eb" />

          <line
            x1={vertexLabels.A.x}
            y1={vertexLabels.A.y}
            x2={labelA.x}
            y2={labelA.y}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          {oppositeMode && (
            <line
              x1={bottomLeft.x}
              y1={bottomLeft.y}
              x2={topRight.x}
              y2={topRight.y}
              stroke="#ef4444"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
          )}

          <text x={arcALabel.x} y={arcALabel.y} fill="#ef4444" fontSize={13} fontWeight={700} textAnchor="middle">
            Angle A: {angleA}°
          </text>
          {!oppositeMode && (
            <text x={arcBLabel.x} y={arcBLabel.y} fill="#15803d" fontSize={13} fontWeight={700} textAnchor="middle">
              Angle B: {angleB}°
            </text>
          )}
          {oppositeMode && (
            <text x={arcCLabel.x} y={arcCLabel.y} fill="#ef4444" fontSize={13} fontWeight={700} textAnchor="middle">
              Angle C: {angleA}°
            </text>
          )}

          <text x={vertexLabels.A.x} y={vertexLabels.A.y} fill="#1f2937" fontSize={12} fontWeight={700}>
            A
          </text>
          <text x={vertexLabels.B.x} y={vertexLabels.B.y} fill="#1f2937" fontSize={12} fontWeight={700}>
            B
          </text>
          <text x={vertexLabels.C.x} y={vertexLabels.C.y} fill="#1f2937" fontSize={12} fontWeight={700}>
            C
          </text>
          <text x={vertexLabels.D.x} y={vertexLabels.D.y} fill="#1f2937" fontSize={12} fontWeight={700}>
            D
          </text>
        </svg>
      </div>
    </div>
  );
};

export default InteractiveParallelogram;
