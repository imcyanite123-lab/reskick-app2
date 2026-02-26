import { useState, useEffect } from "react";
import { Sparkles, BarChart3, History, StickyNote, Compass, BookOpen, Flame, LogIn, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";

type Tab = "summary" | "results" | "history" | "notes" | "suggestions";

interface AppSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summary", label: "Tóm tắt AI", icon: <Sparkles className="h-5 w-5" /> },
  { id: "results", label: "Kết quả", icon: <BarChart3 className="h-5 w-5" /> },
  { id: "history", label: "Lịch sử", icon: <History className="h-5 w-5" /> },
  { id: "notes", label: "Ghi chú", icon: <StickyNote className="h-5 w-5" /> },
  { id: "suggestions", label: "Gợi ý đọc", icon: <Compass className="h-5 w-5" /> },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [stats, setStats] = useState({ summaries: 0, notes: 0 });

  useEffect(() => {
    if (!user) { setStats({ summaries: 0, notes: 0 }); return; }
    const fetchStats = async () => {
      const [{ count: sCount }, { count: nCount }] = await Promise.all([
        supabase.from("summaries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setStats({ summaries: sCount || 0, notes: nCount || 0 });
    };
    fetchStats();
  }, [user]);

  const statItems = [
    { label: "Bài đã tóm tắt", value: String(stats.summaries), emoji: "📄" },
    { label: "Ghi chú", value: String(stats.notes), emoji: "✏️" },
    { label: "Ngày liên tiếp", value: "—", emoji: "🔥" },
  ];

  return (
    <>
      <aside className="w-full lg:w-72 shrink-0">
        <div className="glass-strong rounded-2xl p-6 space-y-6 hover-glow">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg gradient-text-lg">📚 ResKick</h1>
              <p className="text-[11px] text-muted-foreground">Research Kickstart</p>
            </div>
          </div>

          {/* User / Auth */}
          {user ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
              </div>
              <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-muted" title="Đăng xuất">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl glass hover:bg-muted/60 transition-colors text-sm font-medium text-foreground"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập / Đăng ký
            </button>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {statItems.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors group cursor-default"
              >
                <div className="text-sm mb-0.5">{s.emoji}</div>
                <div className="text-xl font-heading font-bold text-foreground group-hover:gradient-text transition-all">{s.value}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-1"
                }`}
              >
                {item.icon}
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Quick Guide */}
          <div className="rounded-xl glass-rainbow p-4 bg-muted/30">
            <h4 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-primary" />
              Hướng dẫn nhanh
            </h4>
            <ol className="text-[11px] text-muted-foreground space-y-2 list-none">
              {[
                "Dán bài viết tiếng Anh",
                "Chọn kiểu tóm tắt phù hợp",
                "Đọc tóm tắt tiếng Việt",
                "Quay lại đọc bài gốc!"
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full gradient-primary text-primary-foreground text-[10px] flex items-center justify-center shrink-0 font-bold mt-px">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
