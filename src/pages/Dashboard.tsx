import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { modules } from "@/data/curriculum";
import { CheckCircle2, XCircle, Lightbulb, Target } from "lucide-react";

const Dashboard = () => {
  const store = useGameStore();

  const totalCorrect = store.getCorrectCount();
  const totalWrong = store.getWrongCount();
  const totalAnswered = store.answers.length;
  const masteryScores = store.masteryScores;

  const conceptKeyByQuestionId: Record<string, string> = {
    m1_q5: "polygon_angle_sum",
    m2_q1: "parallelogram_adjacent_angles",
    m2_q2: "parallelogram_opposite_sides",
    m2_q4: "parallelogram_opposite_sides",
    m2_q5: "parallelogram_adjacent_angles",
    m5_q3: "hierarchical_classification_square_rectangle",
  };

  const getModuleMastery = (moduleId: string) => {
    const moduleData = modules.find((mod) => mod.id === moduleId);
    if (!moduleData) return 0;

    const conceptIds = moduleData.questions
      .map((q) => conceptKeyByQuestionId[q.id])
      .filter(Boolean);

    if (conceptIds.length === 0) {
      return masteryScores[moduleId] ?? 0;
    }

    const total = conceptIds.reduce((sum, id) => sum + (masteryScores[id] ?? 0), 0);
    const average = total / conceptIds.length;
    return average || (masteryScores[moduleId] ?? 0);
  };

  const unlockedModules = new Set<string>([modules[0]?.id].filter(Boolean));
  modules.forEach((mod, index) => {
    const avg = getModuleMastery(mod.id);
    if (avg >= 0.8 && modules[index + 1]) {
      unlockedModules.add(modules[index + 1].id);
    }
  });

  const firstTryAccuracy = store.totalQuestionsEncountered > 0
    ? Math.round((store.firstTryCorrects / store.totalQuestionsEncountered) * 100)
    : 0;

  const stats = [
    { label: "Solved", value: totalAnswered, icon: CheckCircle2, color: "hsl(var(--primary))" },
    { label: "Correct", value: totalCorrect, icon: Target, color: "hsl(var(--success))" },
    { label: "Wrong", value: totalWrong, icon: XCircle, color: "hsl(var(--destructive))" },
    { label: "Hints Used", value: store.getTotalHintsUsed(), icon: Lightbulb, color: "hsl(var(--warning))" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl gradient-text">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, <span className="font-bold text-foreground">{store.studentId}</span> 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 text-center"
          >
            <stat.icon className="w-7 h-7 mx-auto mb-2" style={{ color: stat.color }} />
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Accuracy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="font-bold text-lg text-foreground mb-3">Overall Accuracy</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${firstTryAccuracy}%`,
                background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))`,
              }}
            />
          </div>
          <span className="text-2xl font-bold gradient-text">{firstTryAccuracy}%</span>
        </div>
      </motion.div>

      {/* Mastery Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="font-bold text-lg text-foreground mb-5">🗺️ Mastery Map</h2>
        <div className="space-y-4">
          {modules.map((mod) => {
            const avgMastery = getModuleMastery(mod.id);
            const pct = Math.round(avgMastery * 100);
            const isUnlocked = unlockedModules.has(mod.id);

            return (
              <div key={mod.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className={`font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {mod.title}
                  </span>
                  <span className={isUnlocked ? "text-foreground" : "text-muted-foreground"}>
                    {pct}% {isUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: isUnlocked
                        ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))"
                        : "linear-gradient(90deg, hsl(var(--muted)), hsl(var(--muted-foreground)))",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
