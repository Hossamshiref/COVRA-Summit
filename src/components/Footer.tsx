import Link from "next/link";
import { ShieldCheck, MapPin, Calendar, Mail, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#07090e] border-t border-[#30363d] text-[#8b949e] py-12 px-4 sm:px-6 lg:px-8 no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#58a6ff] to-[#8957e5] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1117] rounded-[6px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#58a6ff]" />
              </div>
            </div>
            <span className="font-bold text-white tracking-wider text-base">
              COVRA Summit
            </span>
          </div>
          <p className="text-sm text-[#8b949e] max-w-md leading-relaxed">
            AI-Powered Security Scanner for Developers. Automate vulnerability detection, secret
            scanning, and remediate code threats with intelligent agentic analysis.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
            Event Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/#about" className="hover:text-[#58a6ff] transition-colors">
                Event Overview
              </Link>
            </li>
            <li>
              <Link href="/#speakers" className="hover:text-[#58a6ff] transition-colors">
                Speakers & Panels
              </Link>
            </li>
            <li>
              <Link href="/#agenda" className="hover:text-[#58a6ff] transition-colors">
                Timeline & Tracks
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#58a6ff] transition-colors">
                Get Tickets
              </Link>
            </li>
            <li>
              <Link href="/staff/scan" className="hover:text-[#58a6ff] transition-colors">
                Staff Check-in Scanner
              </Link>
            </li>
          </ul>
        </div>

        {/* Venue details */}
        <div>
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
            Venue & Time
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#58a6ff] shrink-0 mt-0.5" />
              <span>Creativa Giza Hub, Giza, Egypt</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8957e5] shrink-0" />
              <span>December 12, 2026 • 10:00 AM</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3fb950] shrink-0" />
              <span>support@covra.ai</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#21262d] flex flex-col sm:flex-row justify-between items-center text-xs text-[#484f58]">
        <p>© 2026 COVRA Security Inc. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Built with Next.js 14 • Supabase • Paymob • Resend</p>
      </div>
    </footer>
  );
}
