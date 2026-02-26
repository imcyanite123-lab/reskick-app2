export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Orb 1 - Top left, blue */}
      <div
        className="orb-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, hsl(234, 85%, 66%) 0%, transparent 70%)" }}
      />
      {/* Orb 2 - Bottom right, purple */}
      <div
        className="orb-2 absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 dark:opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(270, 50%, 55%) 0%, transparent 70%)" }}
      />
      {/* Orb 3 - Center, pink accent */}
      <div
        className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, hsl(320, 60%, 55%) 0%, transparent 70%)" }}
      />
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(234, 85%, 66%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(234, 85%, 66%) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
}
