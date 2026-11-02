"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Store,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

function MockPaymobInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount") || "450";

  const [paymentType, setPaymentType] = useState<"card" | "wallet" | "fawry">("card");
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSimulatePayment = async (success: boolean) => {
    if (!orderId) {
      setErrorMsg("Order ID not provided");
      return;
    }

    setProcessing(true);
    setStatusMessage(
      success
        ? "Simulating Paymob payment approval & HMAC signature verification..."
        : "Simulating rejected / cancelled payment..."
    );

    try {
      // Send mock webhook payload to /api/paymob/webhook
      const res = await fetch("/api/paymob/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          transactionId: `TXN-PAYMOB-${Date.now()}`,
          success,
          amount_cents: parseInt(amount, 10) * 100,
          currency: "EGP",
          is_voided: false,
          is_refunded: false,
          source_data: {
            type: paymentType === "card" ? "card" : paymentType === "wallet" ? "wallet" : "cash",
            sub_type: paymentType === "wallet" ? "vodafone_cash" : "visa",
            pan: "411111******1111",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process transaction in webhook");
      }

      if (!success) {
        setStatusMessage("Payment simulation marked as failed. Order remains pending/failed.");
        setProcessing(false);
        setTimeout(() => {
          router.push("/checkout");
        }, 2000);
        return;
      }

      // If tickets returned
      if (data.ticketIds && data.ticketIds.length > 0) {
        const firstTicketId = data.ticketIds[0];
        setStatusMessage("Payment Successful! Redirecting to your official digital pass...");
        setTimeout(() => {
          router.push(`/ticket/${firstTicketId}`);
        }, 1200);
      } else {
        setStatusMessage("Payment confirmed. Redirecting to home...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Error simulating payment webhook");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:px-6">
      {/* Paymob Sandbox Header */}
      <div className="rounded-2xl bg-[#161b22] border border-[#30363d] overflow-hidden shadow-2xl">
        <div className="bg-[#07090e] p-5 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#58a6ff] text-black font-extrabold flex items-center justify-center text-xs tracking-wider">
              PM
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-wider">PAYMOB GATEWAY</span>
              <span className="block text-[10px] text-[#39c5cf] font-mono">SANDBOX / TEST MODE</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#8b949e] block">Amount to Pay</span>
            <span className="text-xl font-black text-white">{amount} EGP</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-3 bg-[#58a6ff]/10 border border-[#58a6ff]/30 rounded-xl text-xs text-[#58a6ff] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Paymob Test Gateway simulation enabled. You can test card, mobile wallet, or fawry checkout flows without live credit card credentials.
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#f85149]/10 border border-[#f85149]/30 rounded-xl text-xs text-[#f85149]">
              {errorMsg}
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentType("card")}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentType === "card"
                    ? "bg-[#21262d] border-[#58a6ff] text-white"
                    : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#58a6ff]" />
                <span className="text-[11px] font-bold block">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("wallet")}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentType === "wallet"
                    ? "bg-[#21262d] border-[#8957e5] text-white"
                    : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-[#8957e5]" />
                <span className="text-[11px] font-bold block">Vodafone Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("fawry")}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentType === "fawry"
                    ? "bg-[#21262d] border-[#d29922] text-white"
                    : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                }`}
              >
                <Store className="w-5 h-5 mx-auto mb-1 text-[#d29922]" />
                <span className="text-[11px] font-bold block">Fawry Pay</span>
              </button>
            </div>
          </div>

          {/* Simulated Card / Details */}
          {paymentType === "card" && (
            <div className="space-y-3 p-4 bg-[#0d1117] rounded-xl border border-[#30363d] text-xs font-mono">
              <div className="flex justify-between text-[#8b949e]">
                <span>Card Number</span>
                <span className="text-white">4111 •••• •••• 1111 (Test Visa)</span>
              </div>
              <div className="flex justify-between text-[#8b949e]">
                <span>Expiry / CVV</span>
                <span className="text-white">12/28 • 123</span>
              </div>
              <div className="flex justify-between text-[#8b949e]">
                <span>Cardholder</span>
                <span className="text-white">COVRA ATTENDEE</span>
              </div>
            </div>
          )}

          {paymentType === "wallet" && (
            <div className="space-y-2 p-4 bg-[#0d1117] rounded-xl border border-[#30363d] text-xs">
              <p className="text-[#8b949e]">
                Simulating Vodafone Cash / Etisalat Cash / Orange Money prompt sent to your mobile device.
              </p>
              <div className="font-mono text-white text-xs bg-[#161b22] p-2 rounded border border-[#30363d]">
                USSD Prompt: Confirm payment of {amount} EGP with PIN ****
              </div>
            </div>
          )}

          {paymentType === "fawry" && (
            <div className="space-y-2 p-4 bg-[#0d1117] rounded-xl border border-[#30363d] text-xs">
              <p className="text-[#8b949e]">
                Simulating Fawry kiosk reference code:
              </p>
              <div className="font-mono text-[#d29922] text-sm font-bold bg-[#161b22] p-2 rounded border border-[#30363d] text-center">
                FAWRY REF # 982 441 209
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-[#21262d] rounded-xl text-center text-xs text-[#3fb950] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#58a6ff]" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulatePayment(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3fb950] to-[#2ea043] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Payment Successfully ({amount} EGP)</span>
            </button>

            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulatePayment(false)}
              className="w-full py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#f85149] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Simulate Failed / Cancelled Payment</span>
            </button>
          </div>
        </div>

        <div className="bg-[#07090e] p-3 text-center border-t border-[#30363d] text-[11px] text-[#8b949e] flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#3fb950]" />
          <span>Paymob 3D Secure 2.0 Integration Test Harness</span>
        </div>
      </div>
    </div>
  );
}


export default function MockPaymobPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#58a6ff]" />
        </div>
      }
    >
      <MockPaymobInner />
    </Suspense>
  );
}
