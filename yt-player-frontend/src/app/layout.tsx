import "./globals.css";
import { PlayerProvider } from "@/components/providers/PlayerProvider";
import { theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={cn(theme.colors.bg, "text-white")}>
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}