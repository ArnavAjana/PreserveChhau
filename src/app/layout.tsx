import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "The Science of Chhau Dance · PreserveChhau",
    template: "%s · PreserveChhau",
  },
  description:
    "The Science of Chhau Dance is Arnav Ajana’s source-linked, Mayurbhanj-centred interactive study of the three regional Chhau traditions.",
  keywords: [
    "Chhau",
    "Chhau dance",
    "Purulia",
    "Seraikella",
    "Mayurbhanj",
    "eastern Indian dance",
    "intangible cultural heritage",
    "The Science of Chhau Dance",
  ],
  openGraph: {
    title: "The Science of Chhau Dance · PreserveChhau",
    description:
      "Arnav Ajana’s source-linked, Mayurbhanj-centred interactive study of Mayurbhanj, Seraikella, and Purulia Chhau.",
    type: "website",
    siteName: "PreserveChhau",
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
