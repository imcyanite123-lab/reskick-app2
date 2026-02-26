import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, X, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Summary {
  id: string;
  input_text: string | null;
  input_url: string | null;
  input_mode: string;
  style: string;
  summary: string;
  created_at: string;
}

const styleLabels: Record<string, string> = {
  concise: "Ngắn gọn",
  detailed: "Chi tiết",
  easy: "Dễ hiểu",
};

export function HistoryPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState<Summary[]>([]);
  const [selected, setSelected] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setItems(data as Summary[]);
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("summaries").delete().eq("id", id);
    if (error) {
      toast({ title: "Lỗi xóa", description: error.message, variant: "destructive" });
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return `Hôm nay, ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diff < 172800000) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  if (!user) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Đăng nhập để xem lịch sử tóm tắt của bạn.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-bold text-foreground">Lịch sử tóm tắt</h3>

      {items.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Chưa có bản tóm tắt nào. Hãy thử tóm tắt bài viết đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-full glass rounded-xl p-4 text-left hover-lift flex items-center justify-between group cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <div className="flex items-start gap-3 min-w-0">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.input_url || item.input_text?.slice(0, 60) || "Bài tóm tắt"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {styleLabels[item.style] || item.style}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {styleLabels[selected.style]}
                </span>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              {selected.input_url && (
                <a href={selected.input_url} target="_blank" rel="noopener" className="text-xs text-primary hover:underline break-all">
                  {selected.input_url}
                </a>
              )}
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.summary}</p>
              <p className="text-xs text-muted-foreground">{formatDate(selected.created_at)}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
