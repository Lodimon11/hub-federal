import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hub Federal | Courier Internacional — Importá desde USA, China y España",
  description:
    "Hub Federal conecta a toda Argentina con el mercado internacional. Importá productos desde Estados Unidos, China y España con régimen Courier Simplificado ARCA. Entrega puerta a puerta en 24 provincias. Cotizá tu envío online.",
  keywords: [
    "importar desde USA",
    "importar desde China",
    "importar desde España",
    "courier internacional Argentina",
    "Hub Federal",
    "courier simplificado ARCA",
    "envíos internacionales",
    "cotizar envío internacional",
  ],
  openGraph: {
    title: "Hub Federal | Courier Internacional",
    description:
      "Importá desde USA, China y España a todo el país. Régimen Courier Simplificado ARCA. Entrega puerta a puerta.",
    type: "website",
    locale: "es_AR",
    siteName: "Hub Federal",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
