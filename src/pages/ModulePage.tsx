import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Module, Option, modules } from "@/data/curriculum";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CarpentersChallenge from "@/components/CarpentersChallenge";
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
    submitAnswerAndUpdateProfile,
    recordAnswer,
    recordQuestionAttempt,
    resetQuestionState,
    passSafetyGate,
    studentId,
  } = useGameStore();

  const [currentModuleIndex, setCurrentModuleIndex] = useState(() => {
    if (!module) return 0;
    const index = modules.findIndex((item) => item.id === module.id);
    return index >= 0 ? index : 0;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModuleMastered, setIsModuleMastered] = useState(false);
  const [firstTryCorrects, setFirstTryCorrects] = useState(0);
  const [isFirstTry, setIsFirstTry] = useState(true);
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
      setFirstTryCorrects(0);
      setIsFirstTry(true);
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
    setIsFirstTry(true);
    setShowBucketAnalysis(false);
    setShowNonIsosceles(false);
  };


  const revealNextHint = () => {
    setHintsRevealed((prev) => Math.min(3, prev + 1));
  };

  const conceptKeyByQuestionId: Record<string, string> = {
    m1_q5: "polygon_angle_sum",
    m2_q1: "parallelogram_adjacent_angles",
    m2_q2: "parallelogram_opposite_sides",
    m2_q4: "parallelogram_opposite_sides",
    m2_q5: "parallelogram_adjacent_angles",
    m5_q3: "hierarchical_classification_square_rectangle",
  };

  const conceptId = conceptKeyByQuestionId[question.id] ?? moduleData.id;

  const handleCorrectAnswer = () => {
    const nextFirstTryCorrects = isFirstTry ? firstTryCorrects + 1 : firstTryCorrects;
    const hintsUsedNow = Math.max(hintsRevealed, errorCount);
    submitAnswerAndUpdateProfile(
      studentId ?? "anonymous",
      conceptId,
      true,
      null
    );
    recordAnswer({
      moduleId: moduleData.id,
      questionId: question.id,
      selectedAnswer: selectedOption?.label ?? "",
      correct: true,
      hintsUsed: hintsUsedNow,
      retryCount: errorCount,
      timestamp: Date.now(),
    });
    recordQuestionAttempt(isFirstTry);
    resetQuestionState();
    setWrongMessage(null);
    setIsCorrect(true);
    setIsFirstTry(false);
    setFirstTryCorrects(nextFirstTryCorrects);

    if (nextFirstTryCorrects >= 3) {
      setIsModuleMastered(true);
    }
  };

  const handleWrongAnswer = (selectedOption: Option) => {
    const nextErrorCount = errorCount + 1;
    const hintsUsedNow = Math.max(hintsRevealed, nextErrorCount);
    submitAnswerAndUpdateProfile(
      studentId ?? "anonymous",
      conceptId,
      false,
      selectedOption.misconceptionTag ?? null
    );
    recordAnswer({
      moduleId: moduleData.id,
      questionId: question.id,
      selectedAnswer: selectedOption.label,
      correct: false,
      hintsUsed: hintsUsedNow,
      retryCount: nextErrorCount,
      timestamp: Date.now(),
    });
    recordQuestionAttempt(false);
    setIsFirstTry(false);

    if (nextErrorCount === 3 && selectedOption.misconceptionTag) {
      console.log(selectedOption.misconceptionTag);
    }

    setWrongMessage(selectedOption.misconceptionTag ?? "Not quite. Try another option.");
    setSelectedOption(null);
  };

  const handleRemedialContinue = () => {
    resetQuestionState();
    setIsFirstTry(true);

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
    setFirstTryCorrects(0);
    setIsFirstTry(true);
    setPhase("learn");
    resetQuestionUI();
    resetQuestionState();

    if (onNavigate && modules[nextIndex]) {
      onNavigate(modules[nextIndex].id);
    }
  };

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
  const hasRemediationContent =
    showModuleTwoSideEquality ||
    showModuleTwoFullAngles ||
    showModuleTwoPerimeter ||
    showModuleTwoAngles ||
    showModuleOneConcave ||
    showModuleOneRegular ||
    showModuleOneExterior ||
    showModuleOnePolygonGate ||
    showModuleThreeCarpenter;

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
            {showRemedial && hasRemediationContent && (
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
