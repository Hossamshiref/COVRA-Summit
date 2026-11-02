import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Presentation,
  Award,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const SPEAKERS = [
  {
    name: "Dr. Tarek Mansour",
    role: "Head of AI Security Research, COVRA",
    bio: "Ex-Google Brain researcher specializing in neural vulnerability detection and LLM-assisted reverse engineering.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    badge: "Keynote",
  },
  {
    name: "Youssef Ibrahim",
    role: "Chief Technology Officer & Co-Founder",
    bio: "Pioneering autonomous security agent workflows and zero-day SAST/DAST developer automation.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    badge: "Product Reveal",
  },
  {
    name: "Salma El-Sayed",
    role: "VP of Cyber Defense, Securica MEA",
    bio: "Renowned red-teamer & speaker across Black Hat and DefCon. Leading cloud-native threat remediation.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    badge: "Technical Track",
  },
  {
    name: "Omar Farouk",
    role: "Staff DevSecOps Engineer, FinTech Cloud",
    bio: "Architecting high-throughput CI/CD security pipelines across banking and enterprise infrastructures.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    badge: "Technical Track",
  },
];

const SPONSORS = [
  { name: "Creativa Giza", tier: "Host Partner" },
  { name: "Paymob", tier: "Payment Partner" },
  { name: "TechNexus Cloud", tier: "Cloud Sponsor" },
  { name: "CyberVanguard ME", tier: "Security Partner" },
  { name: "NextWave Ventures", tier: "Ecosystem Partner" },
];

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero */}
      <section className="relative bg-[#0f2744] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-teal-300 mb-8">
              12 December 2026 · Creativa Giza
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              COVRA Summit
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 font-light mb-4">
              The Premier AI Security Summit in the Region
            </p>

            <p className="text-base text-blue-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 500+ security leaders, architects, and engineers for a full day of keynotes, 
              technical tracks, and hands-on workshops focused on the future of autonomous security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#0f2744] font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                Register Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tickets"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-base transition-all"
              >
                View Tickets from 450 EGP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="text-4xl font-bold text-[#0f2744] mb-1">+10</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Keynote Sessions</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="text-4xl font-bold text-[#0f2744] mb-1">2</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Technical Tracks</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
              <div className="text-4xl font-bold text-[#0f2744] mb-1">1</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Hands-on Workshop</div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 mb-4">
                <ShieldCheck className="w-4 h-4" />
                ABOUT THE SUMMIT
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Where AI meets real-world security engineering
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Traditional tools generate noise. COVRA introduces autonomous agents that understand 
                code context, validate exploitability, and generate production-ready fixes — 
                all inside the developer workflow.
              </p>
              <ul className="space-y-4">
                {[
                  "Contextual zero-day detection with minimal false positives",
                  "Sub-second IDE scanning with automated remediation",
                  "Enterprise-grade secrets protection and supply-chain analysis",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Details</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0f2744]/5 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#0f2744]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">12 December 2026</div>
                    <div className="text-sm text-gray-500">Saturday · Full day event</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0f2744]/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#0f2744]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Creativa Giza Hub</div>
                    <div className="text-sm text-gray-500">Giza, Egypt</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0f2744]/5 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#0f2744]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">10:00 AM – 6:00 PM</div>
                    <div className="text-sm text-gray-500">Eastern European Time</div>
                  </div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0f2744] hover:bg-[#1a3a5c] text-white font-semibold text-sm transition-colors"
              >
                Secure Your Seat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-teal-600 mb-3">SPEAKERS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Learn from the best in the field
            </h2>
            <p className="text-lg text-gray-600">
              Industry leaders and researchers shaping the future of AI-powered security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPEAKERS.map((speaker) => (
              <div
                key={speaker.name}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/95 text-xs font-semibold text-[#0f2744]">
                      {speaker.badge}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg">{speaker.name}</h3>
                  <p className="text-sm text-teal-600 font-medium mt-1">{speaker.role}</p>
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">{speaker.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-sm font-semibold text-teal-600 mb-3">TICKETS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose your pass
            </h2>
            <p className="text-lg text-gray-600">
              Both passes include full access to keynotes and technical tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Standard Pass</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#0f2744]">450</span>
                  <span className="text-gray-500">EGP</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 flex-1 mb-8">
                {[
                  "All Keynote Sessions",
                  "Both Technical Tracks",
                  "Networking & Coffee Breaks",
                  "Official Event Badge",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/tickets"
                className="w-full py-3 rounded-lg border border-gray-300 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Select Standard
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-2xl border-2 border-[#0f2744] bg-white p-8 flex flex-col relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-[#0f2744] text-white text-xs font-semibold">
                  Recommended
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Premium Pass</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#0f2744]">750</span>
                  <span className="text-gray-500">EGP</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 flex-1 mb-8">
                {[
                  "Everything in Standard",
                  "Exclusive Hands-on Workshop",
                  "Official COVRA Goodie Bag",
                  "Priority Seating & Lunch",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/tickets"
                className="w-full py-3 rounded-lg bg-[#0f2744] hover:bg-[#1a3a5c] text-center text-sm font-semibold text-white transition-colors"
              >
                Select Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="sponsors" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-teal-600 mb-2">PARTNERS</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Proudly supported by
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPONSORS.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:border-gray-300 transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm">{s.name}</div>
                <div className="text-xs text-gray-500 mt-1">{s.tier}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure your place at COVRA Summit
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Limited seats to ensure a high-quality experience for every attendee.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#0f2744] hover:bg-[#1a3a5c] text-white font-semibold transition-colors"
          >
            Start Registration
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}