import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Module, Option, modules } from "@/data/curriculum";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CarpentersChallenge from "@/components/CarpentersChallenge";
import VennDiagramTool from "@/components/VennDiagramTool";
import InteractiveTrapeziumProperties from "@/components/InteractiveTrapeziumProperties";
import PolygonTypeVisualizer from "@/components/PolygonTypeVisualizer";
import InteractiveParallelogram from "@/components/InteractiveParallelogram";
import PerimeterVisualizer from "@/components/PerimeterVisualizer";
import SideEqualityVisualizer from "@/components/SideEqualityVisualizer";
import FullAngleSolver from "@/components/FullAngleSolver";
import RegularityChecker from "@/components/RegularityChecker";
import ExteriorAngleVisualizer from "@/components/ExteriorAngleVisualizer";
import PolygonGatekeeper from "@/components/PolygonGatekeeper";

interface Props {
  module?: Module;
  onNavigate?: (target: string) => void;
}

const ModulePage = ({ module, onNavigate }: Props) => {
  const {
    errorCount,
    showRemedial,
    handleAnswer,
    resetQuestionState,
    passSafetyGate,
  } = useGameStore();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(() => {
    if (!module) return 0;
    const index = modules.findIndex((item) => item.id === module.id);
    return index >= 0 ? index : 0;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModuleMastered, setIsModuleMastered] = useState(false);
  const [phase, setPhase] = useState<"learn" | "test">("learn");
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [wrongMessage, setWrongMessage] = useState<string | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showBucketAnalysis, setShowBucketAnalysis] = useState(false);
  const [showNonIsosceles, setShowNonIsosceles] = useState(false);

  useEffect(() => {
    if (!module) return;
    const index = modules.findIndex((item) => item.id === module.id);
    if (index >= 0 && index !== currentModuleIndex) {
      setCurrentModuleIndex(index);
      setCurrentQuestionIndex(0);
      setIsModuleMastered(false);
      setPhase("learn");
      setSelectedOption(null);
      setWrongMessage(null);
      setHintsRevealed(0);
      setIsCorrect(false);
      setShowBucketAnalysis(false);
      setShowNonIsosceles(false);
      resetQuestionState();
    }
  }, [module, currentModuleIndex, resetQuestionState]);

  const moduleData = modules[currentModuleIndex];
  if (!moduleData) return null;

  const question = moduleData.questions[currentQuestionIndex];
  if (!question) return null;

  const resetQuestionUI = () => {
    setSelectedOption(null);
    setWrongMessage(null);
    setHintsRevealed(0);
    setIsCorrect(false);
    setShowBucketAnalysis(false);
    setShowNonIsosceles(false);
  };


  const revealNextHint = () => {
    setHintsRevealed((prev) => Math.min(3, prev + 1));
  };

  const handleCorrectAnswer = () => {
    const hintsUsed = errorCount;
    handleAnswer(true, hintsUsed, moduleData.id);
    resetQuestionState();
    setWrongMessage(null);
    setIsCorrect(true);
  };

  const handleWrongAnswer = (selectedOption: Option) => {
    const nextErrorCount = errorCount + 1;
    handleAnswer(false, 0, moduleData.id);

    if (nextErrorCount === 3 && selectedOption.misconceptionTag) {
      console.log(selectedOption.misconceptionTag);
    }

    setWrongMessage(selectedOption.misconceptionTag ?? "Not quite. Try another option.");
    setSelectedOption(null);
  };

  const handleRemedialContinue = () => {
    resetQuestionState();

    if (currentQuestionIndex >= moduleData.questions.length - 1) {
      setIsModuleMastered(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    resetQuestionUI();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= moduleData.questions.length - 1) {
      setIsModuleMastered(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    resetQuestionUI();
  };

  const handleNextModule = () => {
    const nextIndex = Math.min(currentModuleIndex + 1, modules.length - 1);
    setCurrentModuleIndex(nextIndex);
    setCurrentQuestionIndex(0);
    setIsModuleMastered(false);
    setPhase("learn");
    resetQuestionUI();
    resetQuestionState();

    if (onNavigate && modules[nextIndex]) {
      onNavigate(modules[nextIndex].id);
    }
  };

  const isModuleFive = moduleData.id === "module-5-trapezium-hierarchy";
  const showModuleFiveVenn = isModuleFive && (question.id === "m5_q3" || question.id === "m5_q4");
  const showModuleFiveBucket = isModuleFive && question.id === "m5_q1";
  const showModuleFiveIsosceles = isModuleFive && question.id === "m5_q2";
  const showModuleFiveProperties = isModuleFive && question.id === "m5_q5";
  const isModuleTwo = moduleData.id === "module-2-parallelograms";
  const showModuleTwoAngles = isModuleTwo && (question.id === "m2_q1" || question.id === "m2_q2");
  const showModuleTwoPerimeter = isModuleTwo && question.id === "m2_q3";
  const showModuleTwoSideEquality = isModuleTwo && question.id === "m2_q4";
  const showModuleTwoFullAngles = isModuleTwo && question.id === "m2_q5";
  const showModuleThreeCarpenter = moduleData.id === "module-3-diagonals";
  const showModuleOneConcave = moduleData.id === "module-1-polygons" && question.id === "m1_q1";
  const showModuleOneRegular = moduleData.id === "module-1-polygons" && question.id === "m1_q2";
  const showModuleOneExterior = moduleData.id === "module-1-polygons" && question.id === "m1_q3";
  const showModuleOnePolygonGate = moduleData.id === "module-1-polygons" && question.id === "m1_q4";

  if (isModuleMastered) {
    return (
      <div className="space-y-6">
        <Card className="border-success/40 bg-success/5">
          <CardHeader>
            <CardTitle>Module Mastered!</CardTitle>
            <CardDescription>
              Great work. You're ready to move to the next learning target.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleNextModule}>Next Module</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {phase === "learn" ? (
        <Card className="border-l-4">
          <CardHeader className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Module Story</div>
            <CardTitle className="text-2xl">{moduleData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div dangerouslySetInnerHTML={{ __html: moduleData.story }} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => setPhase("test")}>Start the Challenge</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-l-4">
          <CardHeader className="space-y-2">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Module</div>
            <CardTitle className="text-2xl">{moduleData.title}</CardTitle>
            <CardDescription>Question {currentQuestionIndex + 1} of {moduleData.questions.length}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg font-semibold text-foreground">{question.text}</div>
            <div className="grid gap-3">
              {question.options.map((opt) => (
                <Button
                  key={opt.label}
                  variant={selectedOption?.label === opt.label ? "secondary" : "outline"}
                  className="h-auto justify-start gap-3 rounded-xl px-4 py-3 text-left"
                  onClick={() => !isCorrect && setSelectedOption(opt)}
                  disabled={isCorrect}
                >
                  <span className="text-sm font-bold text-muted-foreground">{opt.label}.</span>
                  <span>{opt.text}</span>
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => selectedOption && selectedOption.label === question.correctAnswer
                  ? handleCorrectAnswer()
                  : selectedOption
                    ? handleWrongAnswer(selectedOption)
                    : null
                }
                disabled={!selectedOption || isCorrect}
              >
                Submit Answer
              </Button>
              <Button variant="outline" onClick={revealNextHint} disabled={hintsRevealed >= 3}>
                Show Hint ({3 - hintsRevealed} left)
              </Button>
            </div>
            {isCorrect && (
              <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-foreground">
                <div className="font-semibold text-success">Great job! 🎉</div>
                <div className="text-muted-foreground">You nailed it. Ready for the next one?</div>
                <div className="mt-3">
                  <Button onClick={handleNextQuestion}>Next Question</Button>
                </div>
              </div>
            )}
            {wrongMessage && (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-foreground">
                <div className="font-semibold text-warning">Not quite.</div>
                <div className="text-muted-foreground">{wrongMessage}</div>
              </div>
            )}
            {errorCount > 0 && errorCount <= 3 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium shadow-sm">
                <span className="font-semibold">💡 Hint:</span>{" "}
                {errorCount === 1 && question.hints[0]}
                {errorCount === 2 && question.hints[1]}
                {errorCount === 3 && question.hints[2]}
              </div>
            )}
            {hintsRevealed > 0 && (
              <div className="rounded-xl border border-muted bg-muted/30 p-3 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hints</div>
                {question.hints.slice(0, hintsRevealed).map((hint, index) => (
                  <div key={hint} className="text-sm text-foreground">
                    <span className="font-semibold text-muted-foreground">Hint {index + 1}:</span> {hint}
                  </div>
                ))}
              </div>
            )}
            {showRemedial && (
              <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/5 p-4 space-y-4">
                <div className="text-sm font-semibold text-foreground">Remediation Zone</div>
                {showModuleTwoSideEquality && (
                  <SideEqualityVisualizer />
                )}
                {showModuleTwoFullAngles && (
                  <FullAngleSolver />
                )}
                {showModuleTwoPerimeter && (
                  <PerimeterVisualizer />
                )}
                {showModuleTwoAngles && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-4">
                    <div className="text-sm font-semibold text-blue-900">
                      Goal: Drag the point to see how adjacent angles always sum to 180°.
                    </div>
                    <InteractiveParallelogram oppositeMode={question.id === "m2_q2"} />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={passSafetyGate}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                {showModuleFiveVenn && (
                  <VennDiagramTool goalText="Goal: Prove why a Square belongs to the Rectangle family." />
                )}
                {showModuleFiveBucket && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-4">
                    <div className="text-sm font-semibold text-amber-900">Visual Comparison</div>
                    <div className="rounded-lg border border-amber-200 bg-white p-4">
                      <svg viewBox="0 0 260 180" className="h-40 w-full">
                        <polygon
                          points="40,30 220,30 200,150 60,150"
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          strokeDasharray="6 6"
                        />
                        <line x1={40} y1={30} x2={220} y2={30} stroke="#22c55e" strokeWidth={6} />
                        <line x1={60} y1={150} x2={200} y2={150} stroke="#22c55e" strokeWidth={6} />
                        <line x1={40} y1={30} x2={60} y2={150} stroke="#f97316" strokeWidth={6} />
                        <line x1={220} y1={30} x2={200} y2={150} stroke="#f97316" strokeWidth={6} />

                        <line x1={80} y1={12} x2={180} y2={12} stroke="#22c55e" strokeWidth={2} />
                        <text x={130} y={10} textAnchor="middle" fill="#15803d" fontSize={10} fontWeight={600}>
                          Parallel Tracks (Top & Bottom)
                        </text>

                        <text x={44} y={105} fill="#dc2626" fontSize={12} fontWeight={700}>
                          X
                        </text>
                        <text x={214} y={105} fill="#dc2626" fontSize={12} fontWeight={700}>
                          X
                        </text>
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowBucketAnalysis(true)}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500"
                    >
                      Analyze the Bucket
                    </button>
                    {showBucketAnalysis && (
                      <div className="rounded-lg border border-amber-200 bg-amber-100/60 p-3 text-sm text-amber-900 space-y-1">
                        <div>1. Top and Bottom are parallel? YES.</div>
                        <div>2. Left and Right are parallel? NO (they lean in).</div>
                        <div>Conclusion: It has exactly ONE pair of parallel sides. It is a Trapezium!</div>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={passSafetyGate}
                            className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
                          >
                            I see it now - Back to Quiz
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {showModuleFiveIsosceles && (
                  <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 space-y-4">
                    <div className="text-sm font-semibold text-purple-900">Isosceles Trapezium</div>
                    <div className="rounded-lg border border-purple-200 bg-white p-4">
                      <svg viewBox="0 0 320 200" className="h-40 w-full">
                        {(() => {
                          const topLeft = { x: 100, y: 50 };
                          const topRight = { x: 200, y: 50 };
                          const bottomLeft = { x: 70, y: 150 };
                          const bottomRight = { x: showNonIsosceles ? 280 : 230, y: 150 };

                          const leftLabel = { x: (topLeft.x + bottomLeft.x) / 2 - 30, y: (topLeft.y + bottomLeft.y) / 2 };
                          const rightLabel = { x: (topRight.x + bottomRight.x) / 2 + 10, y: (topRight.y + bottomRight.y) / 2 };

                          return (
                            <>
                              <line
                                x1={135}
                                y1={30}
                                x2={135}
                                y2={170}
                                stroke="#94a3b8"
                                strokeDasharray="6 6"
                                strokeWidth={2}
                              />

                              <polygon
                                points={`${topLeft.x},${topLeft.y} ${topRight.x},${topRight.y} ${bottomRight.x},${bottomRight.y} ${bottomLeft.x},${bottomLeft.y}`}
                                fill="none"
                                stroke="#1e293b"
                                strokeWidth={4}
                                strokeLinejoin="round"
                              />

                              <path
                                d={`M ${topLeft.x} ${topLeft.y} L ${bottomLeft.x} ${bottomLeft.y}`}
                                stroke="#a855f7"
                                strokeWidth={6}
                                strokeLinecap="round"
                              />
                              <path
                                d={`M ${topRight.x} ${topRight.y} L ${bottomRight.x} ${bottomRight.y}`}
                                stroke="#a855f7"
                                strokeWidth={6}
                                strokeLinecap="round"
                              />

                              <text x={leftLabel.x} y={leftLabel.y} fill="#7e22ce" fontSize={10} fontWeight={700}>
                                ||
                              </text>
                              <text x={rightLabel.x} y={rightLabel.y} fill="#7e22ce" fontSize={10} fontWeight={700}>
                                ||
                              </text>

                              <text x={leftLabel.x - 10} y={leftLabel.y - 12} fill="#7e22ce" fontSize={10} fontWeight={600}>
                                Length: 5cm
                              </text>
                              <text x={rightLabel.x - 6} y={rightLabel.y - 12} fill="#7e22ce" fontSize={10} fontWeight={600}>
                                Length: {showNonIsosceles ? "7cm" : "5cm"}
                              </text>

                              <text x={155} y={32} textAnchor="middle" fill="#0f172a" fontSize={10} fontWeight={600}>
                                Still parallel, but different lengths
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNonIsosceles((prev) => !prev)}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                    >
                      {showNonIsosceles ? "Show Isosceles" : "Show Non-Isosceles"}
                    </button>
                    {showNonIsosceles && (
                      <div className="rounded-lg border border-purple-200 bg-purple-100/60 p-3 text-sm text-purple-900">
                        Notice the difference? In an ISOSCELES trapezium, the leaning sides must be a perfect mirror image of each other.
                      </div>
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={passSafetyGate}
                        className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600"
                      >
                        I understand the symmetry - Back to Quiz
                      </button>
                    </div>
                  </div>
                )}
                {showModuleFiveProperties && (
                  <InteractiveTrapeziumProperties />
                )}
                {showModuleOneConcave && (
                  <PolygonTypeVisualizer />
                )}
                {showModuleOneRegular && (
                  <RegularityChecker />
                )}
                {showModuleOneExterior && (
                  <ExteriorAngleVisualizer />
                )}
                {showModuleOnePolygonGate && (
                  <PolygonGatekeeper />
                )}
                {showModuleThreeCarpenter && (
                  <CarpentersChallenge triggerQuestionId={question.id} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModulePage;
