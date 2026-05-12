export const theme = {
  colors: {
    // Fundo um pouco mais claro: tom grafite com leve nuance azulada
    bg: "bg-[#1A1A24]",
    
    // Painéis vidrados com mais presença, sem pesar
    panel: "bg-white/[0.07]",
    border: "border-white/[0.10]",
    
    // Texto e hierarquia
    text: "text-white",
    muted: "text-stone-300",   // tom suave, boa leitura
    
    // Cores mantidas
    primary: "text-violet-300",
    primaryBg: "bg-violet-500",
    
    accent: "text-amber-300",
    accentBg: "bg-amber-400",
    
    // Glow refinado
    glow: "bg-violet-500/20",
  },
  
  radius: {
    xl: "rounded-2xl",
  },
  
  effects: {
    glass: "backdrop-blur-xl",
    hover: "hover:scale-[1.02] transition-all duration-200",
  },
};