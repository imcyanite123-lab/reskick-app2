import { motion } from "framer-motion";
import { BookOpen, Heart } from "lucide-react";

export function StoryBox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-rainbow rounded-2xl p-6 relative overflow-hidden group hover-glow"
    >
      {/* Gradient accent top */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary rounded-t-2xl" />
      
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-[60px]"
        style={{ background: "hsl(270, 50%, 55%)" }} />

      <div className="relative flex gap-4">
        <div className="shrink-0 mt-1">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25"
          >
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </motion.div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground mb-2 flex items-center gap-2">
            Câu chuyện của chúng mình
            <Heart className="h-4 w-4 text-accent fill-accent/30" />
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            "Có lần mình mở một bài báo tiếng Anh… đọc chưa tới 1 phút đã đóng lại vì thấy quá khó. 
            Mình nghĩ: <em className="text-foreground font-medium">nếu có ai tóm tắt trước bằng tiếng Việt, biết đâu mình sẽ đủ tự tin để quay lại đọc?</em> 
            Đó là lý do ResKick ra đời — một cú hích nhỏ để bạn bắt đầu."
          </p>
        </div>
      </div>
    </motion.div>
  );
}
