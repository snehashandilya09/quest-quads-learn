import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Hexagon, Sparkles } from "lucide-react";
import { fetchLearnerProfile } from "@/lib/api";

const Login = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"neutral" | "success" | "celebrate" | "error">("neutral");
  const setStudentId = useGameStore((s) => s.setStudentId);
  const hydrateLearnerProfile = useGameStore((s) => s.hydrateLearnerProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = rollNumber.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setStatusTone("neutral");
    setStatusMessage("Accessing Learner Model...");

    const result = await fetchLearnerProfile(trimmed);
    if (!result) {
      setIsLoading(false);
      setStatusTone("error");
      setStatusMessage("Unable to load your profile. Please try again.");
      return;
    }

    const { profile, isNew } = result;
    const masteryScores = profile?.cognitive_profiling?.bkt_mastery_probabilities ?? {};
    const pedagogical = profile?.pedagogical_interaction_history ?? {};
    const consecutiveErrors = pedagogical?.consecutive_errors_current_node ?? 0;
    const totalQuestionsEncountered = pedagogical?.total_questions_encountered ?? 0;
    const firstTryCorrects = pedagogical?.first_try_corrects ?? 0;

    if (isNew) {
      setStatusTone("celebrate");
      setStatusMessage("New Learner Profile initialized! Welcome to Quests of Quads.");
    } else {
      setStatusTone("success");
      setStatusMessage("Profile found! Resuming your previous progress...");
    }

    setTimeout(() => {
      setStudentId(trimmed);
      hydrateLearnerProfile({
        masteryScores,
        consecutiveErrors,
        totalQuestionsEncountered,
        firstTryCorrects,
      });
      setIsLoading(false);
    }, 1600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-10 w-full max-w-md text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-3xl"
          style={{ background: "linear-gradient(135deg, hsl(243, 60%, 58%), hsl(174, 50%, 48%))" }}
        >
          <Hexagon className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="font-display text-3xl gradient-text mb-2">Quadrilateral Quest</h1>
        <p className="text-muted-foreground mb-8">Your geometry adventure awaits! 🚀</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Student Roll Number
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. 2024-VIII-042"
              className="w-full px-5 py-3.5 rounded-2xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-glass w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? "Accessing Learner Model..." : "Begin Quest"}
          </button>
        </form>

        {statusMessage && (
          <div
            className={
              statusTone === "success"
                ? "mt-4 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-semibold"
                : statusTone === "celebrate"
                  ? "mt-4 rounded-xl bg-purple-50 text-purple-700 px-4 py-3 text-sm font-semibold"
                  : statusTone === "error"
                    ? "mt-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold"
                    : "mt-4 rounded-xl bg-slate-50 text-slate-700 px-4 py-3 text-sm font-semibold"
            }
          >
            <div className="flex items-center gap-2">
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              <span>{statusMessage}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6">Class 8 · NCERT Mathematics</p>
      </motion.div>
    </div>
  );
};

export default Login;
