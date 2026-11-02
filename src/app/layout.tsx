import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
title: "COVRA Summit 2026 | AI Security Conference",
description: "The premier AI-powered security summit. Join us at Creativa Giza on 12 December 2026.",
  keywords: [
    "COVRA",
    "Security Scanner",
    "Creativa Giza",
    "Cybersecurity Conference",
    "AI Security",
    "DevSecOps Egypt",
    "Ticketing",
  ],
  openGraph: {
    title: "COVRA Summit",
    description: "AI-Powered Security Scanner for Developers — Creativa Giza",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="font-sans bg-[#0d1117] text-[#f0f6fc] min-h-screen flex flex-col selection:bg-[#58a6ff]/20 selection:text-[#58a6ff]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
