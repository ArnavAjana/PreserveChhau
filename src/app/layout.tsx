import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PreserveChhau — Arnav Ajana’s Interactive Chhau eBook",
    template: "%s · PreserveChhau",
  },
  description:
    "IB student Arnav Ajana’s Mayurbhanj-centred journey into the three Chhau traditions, told through a source-linked interactive eBook.",
  keywords: [
    "Chhau",
    "Chhau dance",
    "Purulia",
    "Seraikella",
    "Mayurbhanj",
    "eastern Indian dance",
    "intangible cultural heritage",
  ],
  openGraph: {
    title: "PreserveChhau — Arnav Ajana’s Interactive Chhau eBook",
    description:
      "How one student’s performance became a habit, a set of questions, and a Mayurbhanj-centred interactive eBook about Chhau.",
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
