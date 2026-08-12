import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAPCRE Agro Business | Do Campo à Colheita",
  description:
    "Tecnologia, soluções financeiras e assessoria inteligente: Agro Trading & Barter, locação de máquinas e consultoria agronômica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-ink antialiased">{children}</body>
    </html>
  );
}
