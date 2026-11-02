"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Ticket, QrCode } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Circular Icon Only */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo-icon.png"
              alt="COVRA"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
              priority
            />
            <span className="font-bold text-lg tracking-tight text-[#0f2744] group-hover:text-teal-600 transition-colors">
              COVRA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="text-sm font-medium text-gray-600 hover:text-[#0f2744] transition-colors">
              About
            </Link>
            <Link href="/#speakers" className="text-sm font-medium text-gray-600 hover:text-[#0f2744] transition-colors">
              Speakers
            </Link>
            <Link href="/#sponsors" className="text-sm font-medium text-gray-600 hover:text-[#0f2744] transition-colors">
              Partners
            </Link>
            <Link
              href="/staff/scan"
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              Staff
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f2744] hover:bg-[#1a3a5c] text-white text-sm font-semibold transition-all"
            >
              <Ticket className="w-4 h-4" />
              Get Tickets
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/register"
              className="px-3.5 py-1.5 rounded-lg bg-[#0f2744] text-white text-xs font-semibold"
            >
              Tickets
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-1">
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-gray-700">
            About
          </Link>
          <Link href="/#speakers" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-gray-700">
            Speakers
          </Link>
          <Link href="/#sponsors" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-gray-700">
            Partners
          </Link>
          <Link href="/staff/scan" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-gray-700">
            Staff Check-in
          </Link>
          <div className="pt-3">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 rounded-lg bg-[#0f2744] text-white font-semibold text-sm"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}