import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Science of Chhau Dance · Arnav Ajana",
    template: "%s · The Science of Chhau Dance",
  },
  description:
    "Arnav Ajana learned Chhau for a performance, then returned to investigate how body, rhythm, masks, materials, history, and place shape its three regional traditions.",
  keywords: [
    "Chhau",
    "Chhau dance",
    "Purulia",
    "Seraikella",
    "Mayurbhanj",
    "eastern Indian dance",
    "movement science",
    "The Science of Chhau Dance",
    "Arnav Ajana",
  ],
  openGraph: {
    title: "The Science of Chhau Dance · Arnav Ajana",
    description:
      "An interactive journey from one performance to a deeper understanding of Mayurbhanj, Seraikella, and Purulia Chhau.",
    type: "website",
    siteName: "The Science of Chhau Dance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
