import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, AnswerRecord } from "@/store/useGameStore";
import { Module } from "@/data/curriculum";
import { BookOpen, HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface Props {
  module: Module;
}

const ModulePage = ({ module }: Props) => {
  const { recordAnswer, getModuleAnswers } = useGameStore();
  const existingAnswers = getModuleAnswers(module.id);

  // Find the first unanswered (or first incorrectly answered) question index
  const getStartIndex = useCallback(() => {
    for (let i = 0; i < module.questions.length; i++) {
      const existing = existingAnswers.find(a => a.questionId === module.questions[i].id && a.correct);
      if (!existing) return i;
    }
    return module.questions.length - 1;
  }, [module, existingAnswers]);

  const [phase, setPhase] = useState<"learn" | "test">(existingAnswers.length > 0 ? "test" : "learn");
  const [currentQIndex, setCurrentQIndex] = useState(getStartIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const q = module.questions[currentQIndex];
  const existingCorrect = existingAnswers.find(a => a.questionId === q?.id && a.correct);

  const handleSubmit = () => {
    if (!selected || !q) return;

    const correct = selected === q.correctAnswer;

    if (correct) {
      setSolved(true);
      setWrongFeedback(null);
      const record: AnswerRecord = {
        moduleId: module.id,
        questionId: q.id,
        selectedAnswer: selected,
        correct: true,
        hintsUsed: hintsRevealed,
        retryCount,
        timestamp: Date.now(),
      };
      recordAnswer(record);
    } else {
      setRetryCount(prev => prev + 1);
      const opt = q.options.find(o => o.label === selected);
      setWrongFeedback(opt?.misconception ?? "That's not quite right. Try again!");
      setSelected(null);
      // Record wrong attempt
      const record: AnswerRecord = {
        moduleId: module.id,
        questionId: q.id,
        selectedAnswer: selected,
        correct: false,
        hintsUsed: hintsRevealed,
        retryCount: retryCount + 1,
        timestamp: Date.now(),
      };
      recordAnswer(record);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < module.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelected(null);
      setSolved(false);
      setHintsRevealed(0);
      setWrongFeedback(null);
      setRetryCount(0);
    }
  };

  const revealHint = () => {
    if (hintsRevealed < 3) setHintsRevealed(hintsRevealed + 1);
  };

  if (!q) return null;

  const allSolved = module.questions.every(
    mq => existingAnswers.find(a => a.questionId === mq.id && a.correct)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gradient-text">{module.title}</h1>
        {module.questions.length > 1 && (
          <p className="text-sm text-muted-foreground mt-1">
            Question {currentQIndex + 1} of {module.questions.length}
          </p>
        )}
      </div>

      {/* Phase toggle */}
      <div className="flex gap-2">
        {(["learn", "test"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={`px-5 py-2 rounded-2xl font-semibold text-sm transition-all ${
              phase === p
                ? "btn-primary-glass"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "learn" ? <><BookOpen className="w-4 h-4 inline mr-1.5" />Learn</> : <><ArrowRight className="w-4 h-4 inline mr-1.5" />Test</>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "learn" ? (
          <motion.div
            key="learn"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: module.color }}>
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground mb-3">The Story</h2>
                <p className="text-foreground/80 leading-relaxed text-[15px]">{module.story}</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setPhase("test")} className="btn-primary-glass text-sm">
                Ready to Test! <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`test-${q.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-5"
          >
            {/* Already solved badge */}
            {existingCorrect && !solved && (
              <div className="glass-card p-4 border-l-4 border-l-success flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <p className="text-sm text-foreground font-medium">You've already mastered this question! ✅</p>
              </div>
            )}

            {/* Question */}
            <div className="glass-card p-7">
              <h2 className="font-bold text-lg text-foreground mb-5">{q.text}</h2>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  let optionStyle = "glass-card cursor-pointer hover:border-primary/50";
                  if (solved || existingCorrect) {
                    if (opt.label === q.correctAnswer) optionStyle = "border-2 rounded-lg cursor-default bg-success/10 border-success";
                    else optionStyle = "glass-card opacity-50 cursor-default";
                  } else if (selected === opt.label) {
                    optionStyle = "border-2 rounded-lg cursor-pointer border-primary bg-primary/10";
                  }

                  return (
                    <motion.button
                      key={opt.label}
                      whileHover={!(solved || existingCorrect) ? { scale: 1.01 } : {}}
                      whileTap={!(solved || existingCorrect) ? { scale: 0.99 } : {}}
                      onClick={() => !(solved || existingCorrect) && setSelected(opt.label)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 ${optionStyle}`}
                    >
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: selected === opt.label && !(solved || existingCorrect) ? module.color : "hsl(var(--muted))",
                          color: selected === opt.label && !(solved || existingCorrect) ? "white" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {opt.label}
                      </span>
                      <span className="text-foreground font-medium">{opt.text}</span>
                      {(solved || existingCorrect) && opt.label === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-success ml-auto" />}
                    </motion.button>
                  );
                })}
              </div>

              {!(solved || existingCorrect) && (
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={handleSubmit} disabled={!selected} className="btn-primary-glass text-sm disabled:opacity-40">
                    Submit Answer
                  </button>
                  <button onClick={revealHint} disabled={hintsRevealed >= 3} className="glass-card px-4 py-2.5 text-sm font-semibold text-warning hover:text-foreground transition-colors disabled:opacity-40">
                    <HelpCircle className="w-4 h-4 inline mr-1" />
                    Need a Hint? ({3 - hintsRevealed} left)
                  </button>
                </div>
              )}
            </div>

            {/* Wrong attempt feedback — Growth Mindset */}
            <AnimatePresence>
              {wrongFeedback && !solved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card p-5 border-l-4 border-l-warning"
                >
                  <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">Not quite — but keep going! 💪</p>
                      <p className="text-sm text-foreground/80">{wrongFeedback}</p>
                      <p className="text-xs text-muted-foreground mt-2">Pick another option and try again.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hints */}
            <AnimatePresence>
              {hintsRevealed > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="glass-card p-5 space-y-3"
                >
                  <h3 className="font-bold text-sm text-warning flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Hints
                  </h3>
                  {q.hints.slice(0, hintsRevealed).map((hint, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 text-sm"
                    >
                      <span className="font-bold text-warning shrink-0">#{i + 1}</span>
                      <span className="text-foreground/80">{hint}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success feedback */}
            <AnimatePresence>
              {(solved || existingCorrect) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 border-l-4 border-l-success"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-success" />
                    <div>
                      <p className="font-bold text-foreground">Success! You mastered this concept! 🎉</p>
                      <p className="text-sm text-muted-foreground">
                        {retryCount > 0
                          ? `Great perseverance! You got it after ${retryCount + 1} attempts.`
                          : "Perfect — first try! 🌟"}
                      </p>
                    </div>
                  </div>

                  {/* Carpenter's Workshop for property confusion */}
                  {(module.id === "rectangle" || module.id === "square-identity") && retryCount > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-warning/10 border border-warning/30">
                      <p className="text-sm font-semibold text-warning mb-1">🔨 Carpenter's Workshop — Property Confusion</p>
                      <p className="text-sm text-foreground/80">
                        {module.id === "rectangle"
                          ? "Rectangles, squares, and rhombuses share many properties but each has unique rules. A rectangle's superpower is equal diagonals. Try comparing: what does a rhombus have that a rectangle doesn't?"
                          : "Shapes can belong to multiple families! A square follows ALL rules of both rhombuses (4 equal sides) and rectangles (4 right angles). It's like being in two clubs at once because you meet both sets of requirements."}
                      </p>
                    </div>
                  )}

                  {currentQIndex < module.questions.length - 1 && (
                    <button onClick={handleNextQuestion} className="btn-primary-glass text-sm mt-4">
                      Next Question <ArrowRight className="w-4 h-4 inline ml-1" />
                    </button>
                  )}

                  {allSolved && (
                    <p className="text-sm text-success font-semibold mt-3">🏆 All questions in this module mastered!</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModulePage;
