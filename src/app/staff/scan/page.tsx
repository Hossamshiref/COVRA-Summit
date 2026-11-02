"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Camera,
  RefreshCw,
  StopCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

type ScanStatus = "VERIFIED" | "ALREADY_USED" | "INVALID" | "NOT_FOUND" | null;

interface ScanResult {
  success: boolean;
  status: ScanStatus;
  message: string;
  attendeeName?: string;
  ticketType?: string;
  usedAt?: string;
}

const STAFF_PASSWORD = "@Staff0110@";
const AUTH_KEY = "covra_staff_authenticated";

export default function StaffScanPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessing = useRef(false);

  // Check if already authenticated
  useEffect(() => {
    const saved = sessionStorage.getItem(AUTH_KEY);
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    setTimeout(() => {
      if (password === STAFF_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, "true");
        setIsAuthenticated(true);
      } else {
        setAuthError("Incorrect password. Please try again.");
      }
      setAuthLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setPassword("");
    stopScanner();
  };

  const startScanner = async () => {
    setError("");
    setResult(null);

    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setError("No camera found on this device");
        return;
      }

      const backCamera =
        devices.find(
          (d) =>
            d.label.toLowerCase().includes("back") ||
            d.label.toLowerCase().includes("rear") ||
            d.label.toLowerCase().includes("environment")
        ) || devices[devices.length - 1];

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        backCamera.id,
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (isProcessing.current) return;
          isProcessing.current = true;

          try {
            await scanner.pause(true);
          } catch {}

          await verifyTicket(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message?.includes("Permission")
          ? "Camera permission denied. Please allow camera access."
          : "Could not start camera. Please try again."
      );
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const verifyTicket = async (qrPayload: string) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ticket/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrPayload }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        status: "INVALID",
        message: "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  const resetAndRescan = async () => {
    setResult(null);
    setError("");
    isProcessing.current = false;

    if (scannerRef.current) {
      try {
        await scannerRef.current.resume();
      } catch {
        await stopScanner();
        setTimeout(startScanner, 300);
      }
    } else {
      startScanner();
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // ========== LOGIN SCREEN ==========
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#0f2744] text-white flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Access</h1>
              <p className="text-sm text-gray-500 mt-2">
                Enter the staff password to unlock the scanner
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Type password here..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 bg-white text-gray-900 text-base font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#0f2744] focus:ring-4 focus:ring-[#0f2744]/10 transition-all"
                    autoFocus
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {authError && (
                  <p className="text-sm text-red-600 mt-2 font-medium flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading || !password}
                className="w-full py-3.5 rounded-xl bg-[#0f2744] hover:bg-[#1a3a5c] active:scale-[0.98] text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Unlock Scanner
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              For authorized event staff only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== SCANNER SCREEN ==========
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-[#0f2744] text-white px-4 py-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium mb-1">
              <ShieldCheck className="w-3 h-3" />
              STAFF ONLY
            </div>
            <h1 className="text-lg font-bold">Ticket Scanner</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-blue-200 hover:text-white underline"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Camera Area */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-black relative min-h-[320px]">
          <div id="qr-reader" className="w-full" />

          {!scanning && !result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
              <Camera className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-sm text-gray-300 mb-6">
                Camera is ready. Tap the button below to start scanning.
              </p>
              <button
                onClick={startScanner}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0f2744] font-semibold text-sm flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Start Camera
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="p-6 rounded-2xl bg-white border border-gray-200 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f2744]" />
            <p className="text-sm text-gray-600">Verifying ticket...</p>
          </div>
        )}

        {/* Result Card */}
        {result && !loading && (
          <div
            className={`p-6 rounded-2xl border-2 text-center space-y-4 ${
              result.status === "VERIFIED"
                ? "bg-green-50 border-green-500"
                : result.status === "ALREADY_USED"
                ? "bg-amber-50 border-amber-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            {result.status === "VERIFIED" && (
              <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            )}
            {result.status === "ALREADY_USED" && (
              <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto">
                <AlertTriangle className="w-9 h-9" />
              </div>
            )}
            {(result.status === "INVALID" || result.status === "NOT_FOUND") && (
              <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto">
                <XCircle className="w-9 h-9" />
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {result.status === "VERIFIED" && "ENTRY APPROVED"}
                {result.status === "ALREADY_USED" && "ALREADY USED"}
                {result.status === "INVALID" && "INVALID TICKET"}
                {result.status === "NOT_FOUND" && "NOT FOUND"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
            </div>

            {result.attendeeName && (
              <div className="bg-white rounded-xl p-4 text-left text-sm space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-semibold text-gray-900">
                    {result.attendeeName}
                  </span>
                </div>
                {result.ticketType && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pass</span>
                    <span className="font-semibold uppercase text-[#0f2744]">
                      {result.ticketType}
                    </span>
                  </div>
                )}
                {result.usedAt && (
                  <div className="flex justify-between text-amber-700">
                    <span>First scan</span>
                    <span className="font-mono text-xs">
                      {new Date(result.usedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={resetAndRescan}
              className="w-full py-3 rounded-xl bg-[#0f2744] hover:bg-[#1a3a5c] text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Scan Next Ticket
            </button>
          </div>
        )}

        {/* Stop Camera Button */}
        {scanning && !result && !loading && (
          <button
            onClick={stopScanner}
            className="w-full py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm flex items-center justify-center gap-2"
          >
            <StopCircle className="w-4 h-4" />
            Stop Camera
          </button>
        )}

        {/* Instructions */}
        <div className="text-center text-xs text-gray-500 space-y-1 pt-2">
          <p>Hold the phone steady and point at the QR code.</p>
          <p>The ticket will be verified automatically.</p>
        </div>
      </div>
    </div>
  );
}