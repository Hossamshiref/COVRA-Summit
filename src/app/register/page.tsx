"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Briefcase, Building2, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load any previously saved attendee info
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("covra_attendee_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.company) setCompany(parsed.company);
      }
    } catch (e) {
      console.error("Failed to load saved registration info", e);
    }
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name (minimum 2 characters)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      errs.phone = "Please enter a valid phone or WhatsApp number (e.g. 01012345678)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const data = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      jobTitle: jobTitle.trim() || null,
      company: company.trim() || null,
    };

    try {
      sessionStorage.setItem("covra_attendee_info", JSON.stringify(data));
      router.push("/tickets");
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Progress Steps Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8b949e] mb-3">
          <span className="text-[#58a6ff] flex items-center gap-1.5 font-bold">
            <span className="w-5 h-5 rounded-full bg-[#58a6ff] text-black flex items-center justify-center text-[11px]">1</span>
            Attendee Info
          </span>
          <span className="w-12 h-0.5 bg-[#30363d]" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#21262d] text-[#8b949e] flex items-center justify-center text-[11px]">2</span>
            Select Tickets
          </span>
          <span className="w-12 h-0.5 bg-[#30363d]" />
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#21262d] text-[#8b949e] flex items-center justify-center text-[11px]">3</span>
            Checkout
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-[#161b22] border border-[#30363d] p-6 sm:p-10 shadow-xl space-y-8">
        {/* Title */}
        <div className="space-y-2 border-b border-[#21262d] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>STEP 1 OF 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Attendee Registration</h1>
          <p className="text-sm text-[#8b949e]">
            Enter your personal and professional details for your badge at the COVRA Launch Event.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider">
              Full Name <span className="text-[#f85149]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
                placeholder="Ahmed Mahmoud"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d1117] border text-sm text-white placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50 transition-colors ${
                  errors.fullName ? "border-[#f85149]" : "border-[#30363d] focus:border-[#58a6ff]"
                }`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-[#f85149]">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider">
              Email Address <span className="text-[#f85149]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="ahmed@company.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d1117] border text-sm text-white placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50 transition-colors ${
                  errors.email ? "border-[#f85149]" : "border-[#30363d] focus:border-[#58a6ff]"
                }`}
              />
            </div>
            <p className="text-[11px] text-[#8b949e]">
              We will send your cryptographically signed QR ticket and invoice to this email.
            </p>
            {errors.email && <p className="text-xs text-[#f85149]">{errors.email}</p>}
          </div>

          {/* Phone / WhatsApp */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider">
              Phone / WhatsApp <span className="text-[#f85149]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="01012345678"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d1117] border text-sm text-white placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50 transition-colors ${
                  errors.phone ? "border-[#f85149]" : "border-[#30363d] focus:border-[#58a6ff]"
                }`}
              />
            </div>
            <p className="text-[11px] text-[#8b949e]">
              Used for event SMS reminders and Paymob mobile wallet verification.
            </p>
            {errors.phone && <p className="text-xs text-[#f85149]">{errors.phone}</p>}
          </div>

          {/* Job Title (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider">
              Job Title <span className="text-[#8b949e] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Security Engineer / Backend Developer"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-sm text-white placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50 focus:border-[#58a6ff] transition-colors"
              />
            </div>
          </div>

          {/* Company / University (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#c9d1d9] uppercase tracking-wider">
              Company / University <span className="text-[#8b949e] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Cairo University / Tech Co"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-sm text-white placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/50 focus:border-[#58a6ff] transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <Link
              href="/"
              className="text-xs text-[#8b949e] hover:text-white transition-colors order-2 sm:order-1"
            >
              ← Back to Event Details
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#58a6ff] to-[#8957e5] text-white font-bold text-sm shadow-glow-blue hover:brightness-110 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50"
            >
              <span>Continue to Tickets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
