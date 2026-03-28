import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { modules } from "@/data/curriculum";
import { CheckCircle2, XCircle, Lightbulb, Target } from "lucide-react";

const Dashboard = () => {
  const store = useGameStore();
  const completion = store.getTopicCompletion();

  const stats = [
    { label: "Solved", value: store.answers.length, icon: CheckCircle2, color: "hsl(var(--primary))" },
    { label: "Correct", value: store.getCorrectCount(), icon: Target, color: "hsl(var(--success))" },
    { label: "Wrong", value: store.getWrongCount(), icon: XCircle, color: "hsl(var(--destructive))" },
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
                width: `${store.getAccuracy()}%`,
                background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))`,
              }}
            />
          </div>
          <span className="text-2xl font-bold gradient-text">{store.getAccuracy()}%</span>
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
          {modules.map((mod) => (
            <div key={mod.id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-foreground">{mod.title}</span>
                <span className="text-muted-foreground">{completion[mod.id] || 0}%</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${completion[mod.id] || 0}%`,
                    background: mod.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
