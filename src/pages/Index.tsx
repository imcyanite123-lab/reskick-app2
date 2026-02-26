import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StoryBox } from "@/components/StoryBox";
import { SummaryTool } from "@/components/SummaryTool";
import { DemoResults } from "@/components/DemoResults";
import { HistoryPanel } from "@/components/HistoryPanel";
import { NotesPanel } from "@/components/NotesPanel";
import { SuggestionsPanel } from "@/components/SuggestionsPanel";
import { AppSidebar } from "@/components/AppSidebar";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";

type Tab = "summary" | "results" | "history" | "notes" | "suggestions";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewSummary = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryTool onNewSummary={handleNewSummary} />;
      case "results":
        return <DemoResults />;
      case "history":
        return <HistoryPanel key={refreshKey} />;
      case "notes":
        return <NotesPanel key={refreshKey} />;
      case "suggestions":
        return <SuggestionsPanel />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 app-bg-light dark:bg-background -z-20" />
      <BackgroundOrbs />

      {/* Top Bar */}
      <header className="sticky top-0 z-30 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading font-bold text-2xl sm:text-3xl shimmer-text tracking-tight">
              📚 ResKick
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Cú hích nhỏ giúp bạn bắt đầu đọc dễ hơn
            </p>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-6">
            {activeTab === "summary" && <StoryBox />}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
