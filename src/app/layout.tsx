import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Fraunces,
  Inter,
  Proza_Libre,
} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600", "700"],
});

const prozaLibre = Proza_Libre({
  subsets: ["latin"],
  variable: "--font-proza-libre",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PreserveChhau — The Living Tradition of Chhau Dance",
    template: "%s · PreserveChhau",
  },
  description:
    "An interactive digital experience celebrating Chhau, the masked martial dance of eastern India — its history, styles, music, and mask-making craft.",
  keywords: [
    "Chhau",
    "Chhau dance",
    "Purulia",
    "Seraikella",
    "Mayurbhanj",
    "Indian classical dance",
    "intangible cultural heritage",
  ],
  openGraph: {
    title: "PreserveChhau — The Living Tradition of Chhau Dance",
    description:
      "Explore the history, masks, music, and stories of Chhau through an interactive eBook and 3D experiences.",
    type: "website",
    siteName: "PreserveChhau",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${cormorantGaramond.variable} ${prozaLibre.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded focus:bg-laterite-700 focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
