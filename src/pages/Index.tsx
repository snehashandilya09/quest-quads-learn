import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { modules } from "@/data/curriculum";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ModulePage from "./ModulePage";
import AppSidebar from "@/components/AppSidebar";

const Index = () => {
  const studentId = useGameStore((s) => s.studentId);
  const [currentView, setCurrentView] = useState("dashboard");

  if (!studentId) return <Login />;

  const activeModule = modules.find((m) => m.id === currentView);

  return (
    <div className="flex min-h-screen">
      <AppSidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 p-6 lg:p-10 max-w-4xl">
        {activeModule ? (
          <ModulePage key={activeModule.id} module={activeModule} onNavigate={setCurrentView} />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
};

export default Index;
