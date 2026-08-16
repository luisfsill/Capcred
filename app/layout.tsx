import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAPCRED Agro Business | Do Campo à Colheita",
  description:
    "Tecnologia, soluções financeiras e assessoria inteligente: Agro Trading & Barter, locação de máquinas e consultoria agronômica.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1E13",
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
