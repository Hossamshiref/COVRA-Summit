"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  X,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
}

const emptyForm = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: 10,
  max_uses: "",
  is_active: true,
  expires_at: "",
};

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCodes = async () => {
    try {
      const res = await fetch("/api/admin/promo-codes");
      const data = await res.json();
      if (res.ok) setCodes(data.codes || []);
    } catch {
      setError("Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase().trim(),
          discount_type: form.discount_type,
          discount_value: Number(form.discount_value),
          max_uses: form.max_uses ? Number(form.max_uses) : null,
          is_active: form.is_active,
          expires_at: form.expires_at || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");

      setShowForm(false);
      setForm(emptyForm);
      fetchCodes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !current }),
      });
      fetchCodes();
    } catch {
      alert("Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    try {
      await fetch(`/api/admin/promo-codes?id=${id}`, { method: "DELETE" });
      fetchCodes();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0f2744] text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-blue-200 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold">Promo Codes</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setError("");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#0f2744] text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Code
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f2744]" />
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No promo codes yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Discount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Usage</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">{c.code}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {c.discount_type === "percentage"
                        ? `${c.discount_value}%`
                        : `${c.discount_value} EGP`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.used_count}
                      {c.max_uses ? ` / ${c.max_uses}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c.id, c.is_active)}
                        className={`flex items-center gap-1 text-xs font-medium ${
                          c.is_active ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {c.is_active ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5" />
                        )}
                        {c.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold">New Promo Code</h2>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMIT20"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm font-mono focus:outline-none focus:border-[#0f2744]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discount_type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0f2744]"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed (EGP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.discount_value}
                    onChange={(e) =>
                      setForm({ ...form, discount_value: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0f2744]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses (optional)
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  placeholder="Unlimited"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0f2744]"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f2744] text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}