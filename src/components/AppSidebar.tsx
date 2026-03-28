import { useGameStore } from "@/store/useGameStore";
import { modules } from "@/data/curriculum";
import { LayoutDashboard, Download, LogOut, Hexagon, RotateCw, Square, Diamond, Triangle, Wind, RectangleHorizontal, Crown } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  hexagon: Hexagon,
  "rotate-cw": RotateCw,
  square: Square,
  diamond: Diamond,
  triangle: Triangle,
  wind: Wind,
  "rectangle-horizontal": RectangleHorizontal,
  crown: Crown,
};

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
}

const AppSidebar = ({ currentView, onNavigate }: Props) => {
  const store = useGameStore();

  const handleExport = () => {
    const payload = store.exportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quadrilateral-quest-${store.studentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-sidebar w-64 min-h-screen p-5 flex flex-col">
      <div className="mb-8">
        <h2 className="font-display text-xl gradient-text">Quad Quest</h2>
        <p className="text-xs text-muted-foreground mt-1">Class 8 · NCERT</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={currentView === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />

        <div className="pt-4 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Modules</span>
        </div>

        {modules.map((mod) => {
          const Icon = iconMap[mod.icon] || Hexagon;
          const moduleAnswers = store.getModuleAnswers(mod.id);
          const correctCount = moduleAnswers.filter(a => a.correct).length;
          const totalQ = mod.questions.length;
          const badge = moduleAnswers.length > 0 ? `${correctCount}/${totalQ}` : undefined;
          const allCorrect = correctCount === totalQ;
          return (
            <SidebarItem
              key={mod.id}
              icon={Icon}
              label={mod.title}
              active={currentView === mod.id}
              onClick={() => onNavigate(mod.id)}
              badge={badge}
              badgeColor={moduleAnswers.length > 0 ? (allCorrect ? "hsl(var(--success))" : "hsl(var(--warning))") : undefined}
            />
          );
        })}
      </nav>

      <div className="space-y-2 pt-4 border-t border-border/50">
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/10 transition-colors"
        >
          <Download className="w-4 h-4" />
          Finish & Submit
        </button>
        <button
          onClick={() => store.reset()}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
  badgeColor,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
}) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      active
        ? "bg-primary/15 text-primary"
        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="text-xs font-bold" style={{ color: badgeColor }}>
        {badge}
      </span>
    )}
  </motion.button>
);

export default AppSidebar;
