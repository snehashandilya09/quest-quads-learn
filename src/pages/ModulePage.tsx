import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, AnswerRecord } from "@/store/useGameStore";
import { Module } from "@/data/curriculum";
import { BookOpen, HelpCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Props {
  module: Module;
}

const ModulePage = ({ module }: Props) => {
  const { recordAnswer, getModuleAnswer } = useGameStore();
  const existingAnswer = getModuleAnswer(module.id);

  const [phase, setPhase] = useState<"learn" | "test">(existingAnswer ? "test" : "learn");
  const [selected, setSelected] = useState<string | null>(existingAnswer?.selectedAnswer ?? null);
  const [submitted, setSubmitted] = useState(!!existingAnswer);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showMisconception, setShowMisconception] = useState<string | null>(
    existingAnswer && !existingAnswer.correct
      ? module.question.options.find(o => o.label === existingAnswer.selectedAnswer)?.misconception ?? null
      : null
  );

  const q = module.question;
  const isCorrect = selected === q.correctAnswer;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);

    const correct = selected === q.correctAnswer;
    if (!correct) {
      const opt = q.options.find(o => o.label === selected);
      setShowMisconception(opt?.misconception ?? null);
    }

    const record: AnswerRecord = {
      moduleId: module.id,
      questionId: q.id,
      selectedAnswer: selected,
      correct,
      hintsUsed: hintsRevealed,
      timestamp: Date.now(),
    };
    recordAnswer(record);
  };

  const revealHint = () => {
    if (hintsRevealed < 3) setHintsRevealed(hintsRevealed + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gradient-text">{module.title}</h1>
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
            key="test"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-5"
          >
            {/* Question */}
            <div className="glass-card p-7">
              <h2 className="font-bold text-lg text-foreground mb-5">{q.text}</h2>
              <div className="space-y-3">
                {q.options.map((opt) => {
                  let optionStyle = "glass-card cursor-pointer hover:border-primary/50";
                  if (submitted) {
                    if (opt.label === q.correctAnswer) optionStyle = "border-2 rounded-lg cursor-default bg-success/10 border-success";
                    else if (opt.label === selected) optionStyle = "border-2 rounded-lg cursor-default bg-destructive/10 border-destructive";
                    else optionStyle = "glass-card opacity-50 cursor-default";
                  } else if (selected === opt.label) {
                    optionStyle = "border-2 rounded-lg cursor-pointer border-primary bg-primary/10";
                  }

                  return (
                    <motion.button
                      key={opt.label}
                      whileHover={!submitted ? { scale: 1.01 } : {}}
                      whileTap={!submitted ? { scale: 0.99 } : {}}
                      onClick={() => !submitted && setSelected(opt.label)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 ${optionStyle}`}
                    >
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: selected === opt.label && !submitted ? module.color : "hsl(var(--muted))",
                          color: selected === opt.label && !submitted ? "white" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {opt.label}
                      </span>
                      <span className="text-foreground font-medium">{opt.text}</span>
                      {submitted && opt.label === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-success ml-auto" />}
                      {submitted && opt.label === selected && opt.label !== q.correctAnswer && <XCircle className="w-5 h-5 text-destructive ml-auto" />}
                    </motion.button>
                  );
                })}
              </div>

              {!submitted && (
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

            {/* Feedback */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-5 border-l-4 ${isCorrect ? "border-l-success" : "border-l-destructive"}`}
                >
                  {isCorrect ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-7 h-7 text-success" />
                      <div>
                        <p className="font-bold text-foreground">Excellent! 🎉</p>
                        <p className="text-sm text-muted-foreground">You nailed it! The answer is {q.correctAnswer}.</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <XCircle className="w-7 h-7 text-destructive" />
                        <p className="font-bold text-foreground">Not quite!</p>
                      </div>
                      {showMisconception && (
                        <p className="text-sm text-foreground/80 ml-10 mb-2">
                          <span className="font-semibold text-destructive">Common mistake:</span> {showMisconception}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground ml-10">
                        The correct answer is <span className="font-bold text-success">{q.correctAnswer}</span>.
                      </p>
                      {(module.id === "rectangle" || module.id === "square-identity") && !isCorrect && (
                        <div className="mt-4 ml-10 p-4 rounded-xl bg-warning/10 border border-warning/30">
                          <p className="text-sm font-semibold text-warning mb-1">🔨 Carpenter's Workshop — Property Confusion</p>
                          <p className="text-sm text-foreground/80">
                            {module.id === "rectangle"
                              ? "Rectangles, squares, and rhombuses share many properties but each has unique rules. A rectangle's superpower is equal diagonals. Try comparing: what does a rhombus have that a rectangle doesn't?"
                              : "Shapes can belong to multiple families! A square follows ALL rules of both rhombuses (4 equal sides) and rectangles (4 right angles). It's like being in two clubs at once because you meet both sets of requirements."}
                          </p>
                        </div>
                      )}
                    </div>
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
