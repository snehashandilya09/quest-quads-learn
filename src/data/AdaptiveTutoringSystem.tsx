import { useState } from "react";
import { modules } from "./curriculum";

type MasteryScores = Record<string, "Mastered">;

type Option = {
  label: string;
  text: string;
  misconception?: string;
};

const cardStyle: React.CSSProperties = {
  padding: 20,
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#f9fafb",
  cursor: "pointer",
  fontWeight: 600,
};

const AdaptiveTutoringSystem = () => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [masteryScores, setMasteryScores] = useState<MasteryScores>({});
  const [isModuleComplete, setIsModuleComplete] = useState(false);
  const [showRemedial, setShowRemedial] = useState(false);

  const module = modules[currentModuleIndex];
  const question = module.questions[currentQuestionIndex];

  const advanceToNextQuestion = () => {
    const isLastQuestion = currentQuestionIndex >= module.questions.length - 1;
    if (isLastQuestion) {
      setIsModuleComplete(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setErrorCount(0);
  };

  const handleCorrectAnswer = () => {
    setMasteryScores((prev) => ({
      ...prev,
      [question.id]: "Mastered",
    }));
    setErrorCount(0);
    setShowRemedial(false);
    advanceToNextQuestion();
  };

  const handleWrongAnswer = (selectedOption: Option) => {
    setErrorCount((prev) => {
      const nextCount = prev + 1;

      if (nextCount === 1) {
        alert(question.hints[0]);
      } else if (nextCount === 2) {
        alert(question.hints[1]);
      } else if (nextCount === 3) {
        alert(question.hints[2]);
        if (selectedOption.misconception) {
          console.log(selectedOption.misconception);
        }
      } else if (nextCount > 3) {
        setShowRemedial(true);
      }

      return nextCount;
    });
  };

  const handleRemedialContinue = () => {
    setErrorCount(0);
    setShowRemedial(false);
    advanceToNextQuestion();
  };

  const handleNextModule = () => {
    const nextIndex = Math.min(currentModuleIndex + 1, modules.length - 1);
    setCurrentModuleIndex(nextIndex);
    setCurrentQuestionIndex(0);
    setErrorCount(0);
    setIsModuleComplete(false);
    setShowRemedial(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      {showRemedial ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Let&apos;s take a step back
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 16 }}>
            We&apos;ll review the idea with a quick visual before moving on.
          </p>
          <div
            style={{
              height: 160,
              border: "1px dashed #d1d5db",
              borderRadius: 12,
              marginBottom: 16,
              background: "#f9fafb",
            }}
          />
          <button style={buttonStyle} onClick={handleRemedialContinue}>
            Continue
          </button>
        </div>
      ) : isModuleComplete ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Great work! Module complete.
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 16 }}>
            You&apos;ve mastered this set. Ready to level up?
          </p>
          <button style={buttonStyle} onClick={handleNextModule}>
            Next Module
          </button>
        </div>
      ) : (
        <div style={{ ...cardStyle, borderLeft: `6px solid ${module.color}` }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Module</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{module.title}</div>
          </div>
          <p style={{ color: "#374151", marginBottom: 18 }}>{module.story}</p>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
            {question.text}
          </h3>
          <div style={{ display: "grid", gap: 10 }}>
            {question.options.map((opt) => (
              <button
                key={opt.label}
                style={buttonStyle}
                onClick={() =>
                  opt.label === question.correctAnswer
                    ? handleCorrectAnswer()
                    : handleWrongAnswer(opt)
                }
              >
                <span style={{ marginRight: 8, fontWeight: 700 }}>{opt.label}.</span>
                {opt.text}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: "#9ca3af" }}>
            Debug: errorCount = {errorCount}
          </div>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: 12, color: "#9ca3af" }}>
        Mastery tracked: {Object.keys(masteryScores).length}
      </div>
    </div>
  );
};

export default AdaptiveTutoringSystem;
