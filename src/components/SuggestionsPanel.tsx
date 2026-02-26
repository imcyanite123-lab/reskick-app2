import { motion } from "framer-motion";
import { ExternalLink, Tag } from "lucide-react";

const suggestions = [
  {
    title: "How AI is Transforming Education in 2024",
    source: "MIT Technology Review",
    tags: ["AI", "Giáo dục"],
    difficulty: "Trung bình",
    url: "#",
  },
  {
    title: "The Science of Learning: What Research Tells Us",
    source: "Nature",
    tags: ["Tâm lý học", "Học tập"],
    difficulty: "Dễ",
    url: "#",
  },
  {
    title: "Climate Solutions: Technology and Innovation",
    source: "BBC Future",
    tags: ["Môi trường", "Công nghệ"],
    difficulty: "Dễ",
    url: "#",
  },
  {
    title: "Understanding Machine Learning for Beginners",
    source: "Google AI Blog",
    tags: ["AI", "Lập trình"],
    difficulty: "Trung bình",
    url: "#",
  },
];

export function SuggestionsPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">Gợi ý đọc</h3>
        <p className="text-sm text-muted-foreground">Dựa trên sở thích và lịch sử đọc của bạn</p>
      </div>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <motion.a
            key={i}
            href={s.url}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="block glass rounded-xl p-4 hover-lift group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.source}</p>
                <div className="flex items-center gap-2 mt-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      <Tag className="h-2.5 w-2.5" />{tag}
                    </span>
                  ))}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.difficulty}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
