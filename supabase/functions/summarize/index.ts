import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, style } = await req.json();

    if (!text || !style) {
      return new Response(JSON.stringify({ error: "text and style are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const stylePrompts: Record<string, string> = {
      concise: "Tóm tắt ngắn gọn trong 2-3 câu bằng tiếng Việt. Chỉ nêu ý chính nhất.",
      detailed: "Tóm tắt chi tiết trong 5-7 câu bằng tiếng Việt. Bao gồm các luận điểm chính, ví dụ quan trọng và kết luận.",
      easy: "Giải thích nội dung bằng tiếng Việt một cách đơn giản, dễ hiểu như đang nói chuyện với học sinh cấp 3. Dùng ngôn ngữ thân thiện, có thể dùng ví dụ gần gũi.",
    };

    const systemPrompt = `Bạn là trợ lý AI giúp học sinh Việt Nam hiểu các bài viết tiếng Anh. 
Nhiệm vụ: ${stylePrompts[style] || stylePrompts.concise}
Chỉ trả lời bằng tiếng Việt. Không thêm tiêu đề hay ghi chú. Chỉ trả lại nội dung tóm tắt.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Hãy tóm tắt bài viết tiếng Anh sau:\n\n${text}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Hết lượt sử dụng AI, vui lòng nạp thêm credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Lỗi AI, vui lòng thử lại." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("summarize error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
