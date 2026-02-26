import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StickyNote, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  created_at: string;
}

export function NotesPanel() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("notes")
      .select("id, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setNotes(data as Note[]);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } else {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return "Hôm nay";
    if (diff < 172800000) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  if (!user) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Đăng nhập để xem ghi chú của bạn.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-4 animate-pulse h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-bold text-foreground">Ghi chú của bạn</h3>
      {notes.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Chưa có ghi chú nào. Hãy tóm tắt bài viết và thêm ghi chú!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 group"
            >
              <div className="flex items-start gap-3">
                <StickyNote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(note.created_at)}</p>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
