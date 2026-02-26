import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Link2, Sparkles, Zap, BookOpen, Lightbulb, Loader2, Copy, Check, StickyNote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type SummaryStyle = "concise" | "detailed" | "easy";
type InputMode = "text" | "url";

const styles: { id: SummaryStyle; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "concise", label: "Ngắn gọn", desc: "2-3 câu tóm tắt", icon: <Zap className="h-4 w-4" /> },
  { id: "detailed", label: "Chi tiết", desc: "5-7 câu đầy đủ", icon: <BookOpen className="h-4 w-4" /> },
  { id: "easy", label: "Dễ hiểu", desc: "Giải thích đơn giản", icon: <Lightbulb className="h-4 w-4" /> },
];

interface SummaryToolProps {
  onNewSummary?: () => void;
}

export function SummaryTool({ onNewSummary }: SummaryToolProps) {
  const { user } = useAuth();
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [style, setStyle] = useState<SummaryStyle>("concise");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [currentSummaryId, setCurrentSummaryId] = useState<string | null>(null);

  const handleSummarize = async () => {
    let contentToSummarize = textInput;

    if (inputMode === "url") {
      setScraping(true);
      try {
        const { data, error } = await supabase.functions.invoke("scrape-url", {
          body: { url: urlInput },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        contentToSummarize = data.content;
        if (!contentToSummarize || contentToSummarize.trim().length < 50) {
          throw new Error("Không thể lấy nội dung từ URL này. Hãy thử dán trực tiếp văn bản.");
        }
      } catch (err: any) {
        toast({ title: "Lỗi lấy nội dung", description: err.message, variant: "destructive" });
        setScraping(false);
        return;
      }
      setScraping(false);
    }

    setLoading(true);
    setResult(null);
    setNoteSaved(false);
    setCurrentSummaryId(null);

    try {
      const { data, error } = await supabase.functions.invoke("summarize", {
        body: { text: contentToSummarize.slice(0, 10000), style },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data.summary);

      // Save to DB if logged in
      if (user) {
        const { data: insertData, error: insertError } = await supabase
          .from("summaries")
          .insert({
            user_id: user.id,
            input_text: inputMode === "text" ? textInput.slice(0, 5000) : null,
            input_url: inputMode === "url" ? urlInput : null,
            input_mode: inputMode,
            style,
            summary: data.summary,
          })
          .select("id")
          .single();
        
        if (!insertError && insertData) {
          setCurrentSummaryId(insertData.id);
          onNewSummary?.();
        }
      }
    } catch (err: any) {
      toast({ title: "Lỗi tóm tắt", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveNote = async () => {
    if (!note.trim()) return;
    if (!user) {
      toast({ title: "Hãy đăng nhập để lưu ghi chú", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      summary_id: currentSummaryId,
      content: note.trim(),
    });

    if (error) {
      toast({ title: "Lỗi lưu ghi chú", description: error.message, variant: "destructive" });
    } else {
      setNoteSaved(true);
      setNote("");
      onNewSummary?.();
      setTimeout(() => setNoteSaved(false), 2000);
    }
  };

  const hasInput = inputMode === "text" ? textInput.trim().length > 0 : urlInput.trim().length > 0;
  const isProcessing = loading || scraping;

  return (
    <div className="space-y-6">
      {/* Input Mode Tabs */}
      <div className="flex gap-2">
        {([
          { id: "text" as InputMode, label: "Nhập văn bản", icon: <FileText className="h-4 w-4" /> },
          { id: "url" as InputMode, label: "Dán link bài viết", icon: <Link2 className="h-4 w-4" /> },
        ]).map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setInputMode(tab.id); setResult(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              inputMode === tab.id
                ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/25 btn-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Input Area */}
      <div className="glass-rainbow rounded-2xl p-1">
        <div className="bg-card/90 rounded-[14px] p-4">
          {inputMode === "text" ? (
            <Textarea
              placeholder="Dán đoạn văn bản tiếng Anh vào đây..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[140px] bg-transparent border-none resize-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 leading-relaxed"
            />
          ) : (
            <Input
              type="url"
              placeholder="https://example.com/article..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/50 h-12"
            />
          )}
        </div>
      </div>

      {/* Summary Style */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">Chọn kiểu tóm tắt:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {styles.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStyle(s.id)}
              className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 ${
                style === s.id
                  ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "glass hover-lift text-foreground"
              }`}
            >
              <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                style === s.id ? "bg-primary-foreground/20" : "bg-primary/10"
              }`}>
                {s.icon}
              </div>
              <div>
                <div className="text-sm font-semibold">{s.label}</div>
                <div className={`text-xs ${style === s.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Summarize Button */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          onClick={handleSummarize}
          disabled={!hasInput || isProcessing}
          className="w-full gradient-primary text-primary-foreground h-14 rounded-xl text-base font-semibold btn-glow disabled:opacity-40 disabled:shadow-none border-0"
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-5 w-5 mr-2" />
          )}
          {scraping ? "Đang lấy nội dung..." : loading ? "Đang tóm tắt..." : "Tóm tắt ngay"}
          {!isProcessing && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
          >
            {/* Summary Card */}
            <div className="glass-rainbow rounded-2xl p-1">
              <div className="bg-card/90 rounded-[14px] p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </span>
                    Tóm tắt tiếng Việt
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </motion.button>
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
              </div>
            </div>

            {/* Next Step */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5 border-l-4 border-l-accent"
            >
              <h5 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                🎯 Bước tiếp theo
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Giờ bạn đã hiểu ý chính rồi! Hãy thử đọc lại bài gốc bằng tiếng Anh. 
                Ghi chú những từ mới hoặc ý bạn muốn tìm hiểu thêm nhé.
              </p>
            </motion.div>

            {/* Quick Note */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-5"
            >
              <h5 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary" />
                Ghi chú nhanh
              </h5>
              <div className="flex gap-2">
                <Input
                  placeholder="Ghi lại suy nghĩ của bạn..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-muted/50 border-none text-sm h-10"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSaveNote}
                    size="sm"
                    className="gradient-primary text-primary-foreground shrink-0 h-10 px-5 btn-glow border-0"
                  >
                    {noteSaved ? <Check className="h-4 w-4" /> : "Lưu"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
