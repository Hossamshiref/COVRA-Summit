"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  Smartphone,
  Store,
  Lock,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const [attendeeInfo, setAttendeeInfo] = useState<{
    fullName: string;
    email: string;
    phone: string;
    jobTitle?: string;
    company?: string;
  } | null>(null);

  const [ticketSelection, setTicketSelection] = useState<{
    standardCount: number;
    premiumCount: number;
    totalAmount: number;
  } | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<"card" | "wallet" | "fawry">("card");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymobIframeUrl, setPaymobIframeUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const attendee = sessionStorage.getItem("covra_attendee_info");
      const tickets = sessionStorage.getItem("covra_ticket_selection");

      if (!attendee || !tickets) {
        router.push("/register");
        return;
      }

      setAttendeeInfo(JSON.parse(attendee));
      setTicketSelection(JSON.parse(tickets));
    } catch (e) {
      console.error(e);
      router.push("/register");
    }
  }, [router]);

  const handlePaymobInitiate = async () => {
    if (!attendeeInfo || !ticketSelection) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Call /api/create-order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: attendeeInfo.fullName,
          email: attendeeInfo.email,
          phone: attendeeInfo.phone,
          jobTitle: attendeeInfo.jobTitle,
          company: attendeeInfo.company,
          standardCount: ticketSelection.standardCount,
          premiumCount: ticketSelection.premiumCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setOrderId(data.orderId);

      // If iframe URL returned (Paymob integration or mock test mode)
      if (data.iframeUrl) {
        if (data.isMock) {
          // If in test sandbox/mock mode, redirect to interactive simulation
          router.push(data.iframeUrl);
          return;
        }
        // Direct to Paymob iframe or payment window
        window.location.href = data.iframeUrl;
      } else {
        throw new Error("No payment session could be initialized");
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Payment initialization failed.");
      setLoading(false);
    }
  };

  if (!attendeeInfo || !ticketSelection) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#8b949e]">
        <Loader2 className="w-8 h-8 animate-spin text-[#58a6ff]" />
      </div>
    );
  }

  const totalTickets = ticketSelection.standardCount + ticketSelection.premiumCount;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Progress Steps Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8b949e] mb-3">
          <Link href="/register" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#3fb950] text-black flex items-center justify-center text-[11px] font-bold">✓</span>
            Attendee Info
          </Link>
          <span className="w-12 h-0.5 bg-[#3fb950]" />
          <Link href="/tickets" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#3fb950] text-black flex items-center justify-center text-[11px] font-bold">✓</span>
            Select Tickets
          </Link>
          <span className="w-12 h-0.5 bg-[#58a6ff]" />
          <span className="text-[#58a6ff] flex items-center gap-1.5 font-bold">
            <span className="w-5 h-5 rounded-full bg-[#58a6ff] text-black flex items-center justify-center text-[11px]">3</span>
            Checkout
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Checkout & Payment</h1>
          <p className="text-sm text-[#8b949e]">
            Review your order and complete secure payment with Paymob.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 text-xs text-[#f85149] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Summary Box */}
        <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#21262d] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#58a6ff]" />
            <span>Order Summary</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d]">
              <span className="text-[#8b949e] uppercase tracking-wider text-[10px]">Attendee</span>
              <p className="text-sm font-bold text-white">{attendeeInfo.fullName}</p>
              <p className="text-[#8b949e]">{attendeeInfo.email}</p>
              <p className="text-[#8b949e]">{attendeeInfo.phone}</p>
            </div>

            <div className="space-y-1 bg-[#0d1117] p-3.5 rounded-xl border border-[#21262d]">
              <span className="text-[#8b949e] uppercase tracking-wider text-[10px]">Venue & Date</span>
              <p className="text-sm font-bold text-white">Creativa Giza</p>
              <p className="text-[#8b949e]">November 28, 2026 • 10:00 AM</p>
              <p className="text-[#58a6ff]">COVRA Launch Event</p>
            </div>
          </div>

          {/* Itemized list */}
          <div className="space-y-2 border-t border-[#21262d] pt-4">
            {ticketSelection.standardCount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-[#c9d1d9]">
                  {ticketSelection.standardCount} × Standard Pass
                </span>
                <span className="text-white font-mono">
                  {ticketSelection.standardCount * 450} EGP
                </span>
              </div>
            )}
            {ticketSelection.premiumCount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-[#c9d1d9]">
                  {ticketSelection.premiumCount} × Premium VIP Pass
                </span>
                <span className="text-white font-mono">
                  {ticketSelection.premiumCount * 750} EGP
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs text-[#8b949e]">
              <span>Admission Quantity</span>
              <span className="text-white font-mono">{totalTickets} ticket(s)</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white border-t border-[#21262d] pt-3">
              <span>Total Due</span>
              <span className="text-2xl font-black text-[#58a6ff]">
                {ticketSelection.totalAmount} <span className="text-xs font-normal text-white">EGP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Supported with Paymob */}
        <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center justify-between border-b border-[#21262d] pb-3">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#3fb950]" />
              <span>Select Payment Method (via Paymob)</span>
            </span>
            <span className="text-[10px] text-[#8b949e] font-mono">256-BIT ENCRYPTED</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cards */}
            <button
              type="button"
              onClick={() => setSelectedMethod("card")}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMethod === "card"
                  ? "bg-[#0d1117] border-[#58a6ff] ring-1 ring-[#58a6ff]"
                  : "bg-[#0d1117] border-[#21262d] hover:border-[#30363d]"
              }`}
            >
              <CreditCard className="w-5 h-5 text-[#58a6ff] mb-2" />
              <div className="font-semibold text-xs text-white">Credit / Debit Card</div>
              <div className="text-[10px] text-[#8b949e]">Visa, Mastercard, Meeza</div>
            </button>

            {/* Vodafone Cash & Wallets */}
            <button
              type="button"
              onClick={() => setSelectedMethod("wallet")}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMethod === "wallet"
                  ? "bg-[#0d1117] border-[#8957e5] ring-1 ring-[#8957e5]"
                  : "bg-[#0d1117] border-[#21262d] hover:border-[#30363d]"
              }`}
            >
              <Smartphone className="w-5 h-5 text-[#8957e5] mb-2" />
              <div className="font-semibold text-xs text-white">Mobile Wallets</div>
              <div className="text-[10px] text-[#8b949e]">Vodafone Cash, Orange, Etisalat</div>
            </button>

            {/* Fawry */}
            <button
              type="button"
              onClick={() => setSelectedMethod("fawry")}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMethod === "fawry"
                  ? "bg-[#0d1117] border-[#d29922] ring-1 ring-[#d29922]"
                  : "bg-[#0d1117] border-[#21262d] hover:border-[#30363d]"
              }`}
            >
              <Store className="w-5 h-5 text-[#d29922] mb-2" />
              <div className="font-semibold text-xs text-white">Fawry Pay</div>
              <div className="text-[10px] text-[#8b949e]">Pay with reference code at kiosk</div>
            </button>
          </div>

          <p className="text-[11px] text-[#8b949e] pt-1">
            Paymob will process your transaction safely. Upon payment completion, your official QR ticket pass will be generated instantly and emailed to {attendeeInfo.email}.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
          <Link
            href="/tickets"
            className="text-xs text-[#8b949e] hover:text-white transition-colors flex items-center gap-1.5 order-2 sm:order-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Ticket Selection</span>
          </Link>
          <button
            type="button"
            onClick={handlePaymobInitiate}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#58a6ff] to-[#8957e5] text-white font-bold text-sm shadow-glow-blue hover:brightness-110 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting to Paymob...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay with Paymob ({ticketSelection.totalAmount} EGP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
