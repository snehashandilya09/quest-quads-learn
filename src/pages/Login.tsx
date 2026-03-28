import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Hexagon, Sparkles } from "lucide-react";

const Login = () => {
  const [rollNumber, setRollNumber] = useState("");
  const setStudentId = useGameStore((s) => s.setStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rollNumber.trim()) {
      setStudentId(rollNumber.trim());
    }
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
            />
          </div>

          <button type="submit" className="btn-primary-glass w-full flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Begin Quest
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-6">Class 8 · NCERT Mathematics</p>
      </motion.div>
    </div>
  );
};

export default Login;
