import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, ThumbsUp, Quote, Star } from "lucide-react";

const metrics = [
  {
    label: "Giảm rào cản khởi đầu",
    value: "-1.2",
    unit: "điểm SRI",
    icon: <TrendingDown className="h-6 w-6" />,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
  },
  {
    label: "Tần suất bắt đầu đọc",
    value: "+60",
    unit: "%",
    icon: <TrendingUp className="h-6 w-6" />,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
  {
    label: "Tự tin hơn",
    value: "85",
    unit: "%",
    icon: <ThumbsUp className="h-6 w-6" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
];

const sriData = [
  { label: "SRI trước thí nghiệm", control: "3.4", experimental: "3.5" },
  { label: "SRI sau thí nghiệm", control: "3.3", experimental: "2.3" },
  { label: "Thay đổi", control: "-0.1", experimental: "-1.2", highlight: true },
];

const testimonials = [
  { text: "Lần đầu mình đọc hết một bài báo tiếng Anh mà không bỏ giữa chừng.", author: "Bạn N.H", emoji: "🎉" },
  { text: "Đọc tóm tắt xong thấy bài không đáng sợ như mình tưởng.", author: "Bạn T.A", emoji: "💪" },
  { text: "Có nhóm chat thấy mọi người cũng đọc, mình không muốn bị bỏ lại phía sau.", author: "Bạn M.K", emoji: "🤝" },
  { text: "Mình không nghĩ một thứ nhỏ như bản tóm tắt lại có thể giúp ích đến vậy.", author: "Bạn P.L", emoji: "✨" },
];

export function DemoResults() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h3 className="font-heading text-2xl font-bold text-foreground mb-1">Kết quả thí nghiệm</h3>
        <p className="text-sm text-muted-foreground">Thử nghiệm 4 tuần với 12 học sinh cấp 3</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hover-lift cursor-default"
          >
            <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${m.gradient} overflow-hidden group`}>
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
              
              <div className="relative text-white">
                <div className="mb-3 p-2 bg-white/15 rounded-lg w-fit backdrop-blur-sm">
                  {m.icon}
                </div>
                <div className="text-4xl font-heading font-bold mb-1 tracking-tight">
                  {m.value}<span className="text-lg font-medium ml-1 opacity-90">{m.unit}</span>
                </div>
                <div className="text-sm opacity-90 font-medium">{m.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SRI Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-rainbow rounded-2xl overflow-hidden"
      >
        <div className="bg-card/90 rounded-[14px]">
          <div className="p-5 border-b border-border/30">
            <h4 className="font-heading font-bold text-foreground">So sánh điểm SRI</h4>
            <p className="text-xs text-muted-foreground mt-1">Starting Reading Inhibition (Chỉ số ngại bắt đầu đọc)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 font-medium text-muted-foreground"></th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Nhóm đối chứng</th>
                  <th className="text-center p-4 font-semibold gradient-text">Nhóm thí nghiệm ✨</th>
                </tr>
              </thead>
              <tbody>
                {sriData.map((row, i) => (
                  <tr key={i} className={`${i < sriData.length - 1 ? "border-b border-border/20" : ""} ${row.highlight ? "bg-primary/5" : ""}`}>
                    <td className="p-4 text-foreground font-medium">{row.label}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.control}</td>
                    <td className={`p-4 text-center font-bold ${row.highlight ? "gradient-text text-lg" : "text-primary"}`}>{row.experimental}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Testimonials */}
      <div>
        <h4 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-accent fill-accent/30" />
          Cảm nhận của các bạn
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
              className="glass-rainbow rounded-2xl overflow-hidden hover-lift group"
            >
              <div className="bg-card/80 p-5 h-full">
                <div className="text-2xl mb-3">{t.emoji}</div>
                <p className="text-sm text-foreground/90 leading-relaxed italic mb-4">"{t.text}"</p>
                <p className="text-xs font-bold gradient-text">— {t.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
