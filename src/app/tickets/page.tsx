"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Ticket,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  CreditCard,
  Flame,
} from "lucide-react";

const STANDARD_PRICE = 450;
const PREMIUM_PRICE = 750;

export default function TicketsPage() {
  const router = useRouter();

  const [standardCount, setStandardCount] = useState<number>(1);
  const [premiumCount, setPremiumCount] = useState<number>(0);
  const [attendeeInfo, setAttendeeInfo] = useState<{
    fullName: string;
    email: string;
    phone: string;
    jobTitle?: string;
    company?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("covra_attendee_info");
      if (saved) {
        setAttendeeInfo(JSON.parse(saved));
      }
      const savedTickets = sessionStorage.getItem("covra_ticket_selection");
      if (savedTickets) {
        const parsed = JSON.parse(savedTickets);
        if (typeof parsed.standardCount === "number") setStandardCount(parsed.standardCount);
        if (typeof parsed.premiumCount === "number") setPremiumCount(parsed.premiumCount);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalTickets = standardCount + premiumCount;
  const standardTotal = standardCount * STANDARD_PRICE;
  const premiumTotal = premiumCount * PREMIUM_PRICE;
  const grandTotal = standardTotal + premiumTotal;

  const handleProceed = () => {
    if (totalTickets <= 0) {
      setErrorMsg("Please select at least 1 ticket to proceed.");
      return;
    }

    if (!attendeeInfo || !attendeeInfo.fullName || !attendeeInfo.email) {
      // Redirect to registration if attendee details are missing
      router.push("/register");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      sessionStorage.setItem(
        "covra_ticket_selection",
        JSON.stringify({
          standardCount,
          premiumCount,
          totalAmount: grandTotal,
        })
      );
      router.push("/checkout");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Progress Steps Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8b949e] mb-3">
          <Link href="/register" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#3fb950] text-black flex items-center justify-center text-[11px] font-bold">✓</span>
            Attendee Info
          </Link>
          <span className="w-12 h-0.5 bg-[#58a6ff]" />
          <span className="text-[#58a6ff] flex items-center gap-1.5 font-bold">
            <span className="w-5 h-5 rounded-full bg-[#58a6ff] text-black flex items-center justify-center text-[11px]">2</span>
            Select Tickets
          </span>
          <span className="w-12 h-0.5 bg-[#30363d]" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#21262d] text-[#8b949e] flex items-center justify-center text-[11px]">3</span>
            Checkout
          </span>
        </div>
      </div>

      {/* Attendee banner */}
      {attendeeInfo && (
        <div className="mb-6 p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{attendeeInfo.fullName}</p>
              <p className="text-[11px] text-[#8b949e]">{attendeeInfo.email} • {attendeeInfo.phone}</p>
            </div>
          </div>
          <Link
            href="/register"
            className="text-xs text-[#58a6ff] hover:underline font-medium"
          >
            Edit details
          </Link>
        </div>
      )}

      {/* Ticket Selection Area */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Choose Your Ticket Quantity</h1>
          <p className="text-sm text-[#8b949e]">
            Select single or multiple passes for you or your engineering team.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 text-xs text-[#f85149] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Ticket Card */}
          <div
            className={`rounded-2xl bg-[#161b22] p-6 border transition-all ${
              standardCount > 0 ? "border-[#58a6ff] shadow-glow-blue" : "border-[#30363d]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30">
                  Standard Pass
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Standard Access</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{STANDARD_PRICE} <span className="text-xs font-normal text-[#8b949e]">EGP</span></div>
                <div className="text-[10px] text-[#8b949e]">per ticket</div>
              </div>
            </div>

            <p className="text-xs text-[#8b949e] mb-4">
              Full access to the core launch event, main keynotes, and technical stages.
            </p>

            <div className="space-y-2 text-xs text-[#c9d1d9] mb-6 border-t border-[#21262d] pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Opening Keynote & COVRA 1.0 Launch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Stage 1 (Vulnerability Intelligence)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Stage 2 (CI/CD DevSecOps)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Networking & Coffee Breaks</span>
              </div>
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between pt-4 border-t border-[#21262d]">
              <span className="text-xs font-semibold text-[#8b949e]">Tickets Quantity</span>
              <div className="flex items-center space-x-3 bg-[#0d1117] px-3 py-1.5 rounded-xl border border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setStandardCount(Math.max(0, standardCount - 1))}
                  className="w-7 h-7 rounded-lg bg-[#21262d] text-white hover:bg-[#30363d] flex items-center justify-center transition-colors disabled:opacity-30"
                  disabled={standardCount === 0}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-bold text-white min-w-[20px] text-center font-mono">
                  {standardCount}
                </span>
                <button
                  type="button"
                  onClick={() => setStandardCount(standardCount + 1)}
                  className="w-7 h-7 rounded-lg bg-[#58a6ff] text-black hover:brightness-110 flex items-center justify-center transition-colors font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Ticket Card */}
          <div
            className={`rounded-2xl bg-[#161b22] p-6 border relative transition-all ${
              premiumCount > 0 ? "border-[#8957e5] shadow-glow-purple" : "border-[#30363d]"
            }`}
          >
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#8957e5] to-[#a371f7] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
              <Sparkles className="w-3 h-3" />
              <span>Recommended</span>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8957e5]/15 text-[#a371f7] border border-[#8957e5]/30">
                  Premium VIP Pass
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Premium Experience</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{PREMIUM_PRICE} <span className="text-xs font-normal text-[#8b949e]">EGP</span></div>
                <div className="text-[10px] text-[#8b949e]">per ticket</div>
              </div>
            </div>

            <p className="text-xs text-[#8b949e] mb-4">
              Includes everything in Standard + Hands-on Workshops and official COVRA Goodie bag.
            </p>

            <div className="space-y-2 text-xs text-[#c9d1d9] mb-6 border-t border-[#21262d] pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Opening Keynote & Launch Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>All Technical Stages (1 & 2)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8957e5] shrink-0" />
                <span className="text-white font-semibold">Hands-on Lab Security Workshops</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8957e5] shrink-0" />
                <span className="text-white font-semibold">Official Goodie Bag & Exclusive Swag</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950] shrink-0" />
                <span>Priority Seating & VIP Buffet Lunch</span>
              </div>
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between pt-4 border-t border-[#21262d]">
              <span className="text-xs font-semibold text-[#8b949e]">Tickets Quantity</span>
              <div className="flex items-center space-x-3 bg-[#0d1117] px-3 py-1.5 rounded-xl border border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setPremiumCount(Math.max(0, premiumCount - 1))}
                  className="w-7 h-7 rounded-lg bg-[#21262d] text-white hover:bg-[#30363d] flex items-center justify-center transition-colors disabled:opacity-30"
                  disabled={premiumCount === 0}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-bold text-white min-w-[20px] text-center font-mono">
                  {premiumCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPremiumCount(premiumCount + 1)}
                  className="w-7 h-7 rounded-lg bg-[#8957e5] text-white hover:brightness-110 flex items-center justify-center transition-colors font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation & Order Summary Card */}
        <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#21262d] pb-4">
            <div>
              <h4 className="text-base font-bold text-white">Live Order Summary</h4>
              <p className="text-xs text-[#8b949e]">
                {totalTickets === 0
                  ? "No tickets currently selected"
                  : `${totalTickets} ticket${totalTickets > 1 ? "s" : ""} selected`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8b949e] block">Total Amount</span>
              <span className="text-2xl sm:text-3xl font-black text-[#58a6ff]">
                {grandTotal} <span className="text-sm font-normal text-white">EGP</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#8b949e]">
            {standardCount > 0 && (
              <div className="flex justify-between">
                <span>{standardCount} × Standard Pass ({STANDARD_PRICE} EGP each)</span>
                <span className="text-white font-mono">{standardTotal} EGP</span>
              </div>
            )}
            {premiumCount > 0 && (
              <div className="flex justify-between">
                <span>{premiumCount} × Premium Pass ({PREMIUM_PRICE} EGP each)</span>
                <span className="text-white font-mono">{premiumTotal} EGP</span>
              </div>
            )}
            <div className="flex justify-between text-[#3fb950] pt-1 border-t border-[#21262d]">
              <span>Payment Processing Fee</span>
              <span>FREE</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <Link
              href="/register"
              className="text-xs text-[#8b949e] hover:text-white transition-colors flex items-center gap-1.5 order-2 sm:order-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Attendee Info</span>
            </Link>
            <button
              type="button"
              onClick={handleProceed}
              disabled={loading || totalTickets === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#58a6ff] to-[#8957e5] text-white font-bold text-sm shadow-glow-blue hover:brightness-110 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-40"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment ({grandTotal} EGP)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
