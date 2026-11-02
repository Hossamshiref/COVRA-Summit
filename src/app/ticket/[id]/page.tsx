"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Mail,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Printer,
  Sparkles,
  User,
  Ticket as TicketIcon,
} from "lucide-react";
import confetti from "canvas-confetti";

interface TicketData {
  ticket: {
    id: string;
    orderId: string;
    ticketType: "standard" | "premium";
    isUsed: boolean;
    usedAt?: string | null;
    createdAt: string;
    qrPayload: string;
    qrDataUrl: string;
  };
  order: {
    id: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    jobTitle?: string;
    company?: string;
    standardCount: number;
    premiumCount: number;
    totalAmount: number;
    paymentStatus: string;
  } | null;
  event: {
    name: string;
    tagline: string;
    venue: string;
    location: string;
    date: string;
    time: string;
  };
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    if (!ticketId) return;

    fetch(`/api/ticket/${ticketId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch ticket");
        }
        return res.json();
      })
      .then((ticketRes: TicketData) => {
        setData(ticketRes);
        setLoading(false);

        // Trigger celebratory confetti once on load
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#58a6ff", "#8957e5", "#39c5cf", "#3fb950"],
          });
        } catch {
          // ignore if canvas not supported
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(err.message || "Failed to load ticket");
        setLoading(false);
      });
  }, [ticketId]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!data) return;
    setEmailSending(true);
    setEmailStatus(null);

    try {
      const res = await fetch("/api/ticket/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: data.ticket.id }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to send email");
      }

      setEmailStatus("Ticket sent successfully to " + (data.order?.userEmail || "your email"));
    } catch (err: unknown) {
      console.error(err);
      setEmailStatus(err instanceof Error ? err.message : "Failed to send email.");
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#58a6ff]" />
        <p className="text-sm text-[#8b949e]">Retrieving your digital pass & verifying QR signature...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-[#161b22] border border-[#f85149]/40 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#f85149] mx-auto" />
        <h2 className="text-xl font-bold text-white">Ticket Not Found</h2>
        <p className="text-xs text-[#8b949e]">{errorMsg || "The requested ticket ID does not exist."}</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-lg bg-[#21262d] text-white text-xs font-semibold hover:bg-[#30363d]"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const { ticket, order, event } = data;
  const isPremium = ticket.ticketType === "premium";
  const totalCount = (order?.standardCount || 0) + (order?.premiumCount || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner (hidden in print) */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3fb950]/15 text-[#3fb950] text-xs font-bold border border-[#3fb950]/30 shadow-sm">
          <CheckCircle className="w-4 h-4" />
          <span>PAYMENT CONFIRMED • PASS ACTIVE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Official Event Ticket</h1>
        <p className="text-xs text-[#8b949e]">
          Present this unique QR code at the entrance of Creativa Giza on November 28, 2026.
        </p>
      </div>

      {/* Main Ticket Card (Designed for Screen & Print) */}
      <div className="rounded-3xl bg-[#161b22] border-2 border-[#30363d] overflow-hidden shadow-2xl ticket-print-container">
        {/* Pass Header */}
        <div className={`p-6 sm:p-8 ${isPremium ? "bg-gradient-to-r from-[#161b22] via-[#8957e5]/20 to-[#161b22] border-b-2 border-[#8957e5]" : "bg-gradient-to-r from-[#161b22] via-[#58a6ff]/20 to-[#161b22] border-b-2 border-[#58a6ff]"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#8b949e]">OFFICIAL DIGITAL PASS</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isPremium ? "bg-[#8957e5] text-white" : "bg-[#58a6ff] text-black"}`}>
                  {ticket.ticketType} PASS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{event.name}</h2>
              <p className="text-xs text-[#8b949e]">{event.tagline}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#8b949e] uppercase tracking-wider block">Admission Status</span>
              {ticket.isUsed ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f85149] bg-[#f85149]/10 px-2 py-0.5 rounded border border-[#f85149]/30">
                  USED / CHECKED-IN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3fb950] bg-[#3fb950]/10 px-2.5 py-0.5 rounded-full border border-[#3fb950]/30">
                  VALID & UNCLAIMED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-[#0d1117]">
          {/* QR Code Column */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-lg border-4 border-[#30363d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.qrDataUrl}
                alt="Ticket QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8b949e] uppercase block">
                Cryptographic HMAC SHA-256
              </span>
              <span className="text-[11px] font-mono text-white bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d] inline-block max-w-[200px] truncate">
                {ticket.id}
              </span>
            </div>
          </div>

          {/* Attendee Details Column */}
          <div className="md:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8b949e] uppercase tracking-wider text-[10px] block">Attendee Name</span>
                <span className="text-base font-bold text-white block mt-0.5">
                  {order?.userName || "Attendee"}
                </span>
                {order?.jobTitle && (
                  <span className="text-xs text-[#8957e5] block">{order.jobTitle}</span>
                )}
                {order?.company && (
                  <span className="text-xs text-[#8b949e] block">{order.company}</span>
                )}
              </div>

              <div>
                <span className="text-[#8b949e] uppercase tracking-wider text-[10px] block">Ticket Tier</span>
                <span className="text-base font-bold text-[#58a6ff] block mt-0.5 uppercase">
                  {ticket.ticketType} Pass
                </span>
                <span className="text-[11px] text-[#8b949e]">
                  Total Order: {totalCount} ticket(s)
                </span>
              </div>
            </div>

            <div className="border-t border-[#21262d] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#8b949e] uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Venue</span>
                </span>
                <span className="text-white font-medium block">{event.venue}</span>
                <span className="text-[#8b949e] text-[11px] block">{event.location}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8b949e] uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8957e5]" />
                  <span>Date & Time</span>
                </span>
                <span className="text-white font-medium block">{event.date}</span>
                <span className="text-[#8b949e] text-[11px] block">{event.time}</span>
              </div>
            </div>

            {/* Perks included */}
            <div className="p-3 bg-[#161b22] rounded-xl border border-[#30363d] space-y-1 text-xs">
              <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-wider">
                Pass Entitlements
              </span>
              <p className="text-[#c9d1d9] text-[11px]">
                {isPremium
                  ? "✓ Keynotes + Stages 1 & 2 + Hands-on Lab Workshops + Official Goodie Bag + VIP Lunch"
                  : "✓ Keynotes + Stage 1 (AST Analysis) + Stage 2 (DevSecOps) + Networking Breaks"}
              </p>
            </div>
          </div>
        </div>

        {/* Pass Footer */}
        <div className="p-4 bg-[#07090e] border-t border-[#30363d] flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#8b949e] gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#39c5cf]" />
            <span>Anti-Counterfeit Protection: Single-scan validation enforced at gate</span>
          </div>
          <span className="font-mono">Order Ref: {order?.id.substring(0, 8)}...</span>
        </div>
      </div>

      {/* Action Buttons (no-print) */}
      <div className="space-y-3 no-print">
        {emailStatus && (
          <div className="p-3 rounded-xl bg-[#21262d] border border-[#30363d] text-center text-xs text-[#3fb950]">
            {emailStatus}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white font-bold text-xs border border-[#30363d] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4 text-[#58a6ff]" />
            <span>Download PDF / Print Pass</span>
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            disabled={emailSending}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white font-bold text-xs border border-[#30363d] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {emailSending ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#8957e5]" />
            ) : (
              <Mail className="w-4 h-4 text-[#8957e5]" />
            )}
            <span>Send to Email</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#161b22] text-[#8b949e] hover:text-white font-medium text-xs border border-[#30363d] text-center transition-colors"
          >
            Return to Event Home
          </Link>
        </div>
      </div>
    </div>
  );
}
