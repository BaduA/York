import type { Metadata } from "next";
import Script from "next/script";
import React from "react";
import { DM_Sans, Playfair_Display, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CocktailLab — Bilkent York",
  description: "Craft your signature cocktail at Bilkent York Speakeasy & Lounge",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable} ${bebasNeue.variable}`}
    >
      <head>
        <Script
          src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
