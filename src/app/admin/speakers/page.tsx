"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  X,
  Check,
} from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  role: "",
  bio: "",
  badge: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminSpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchSpeakers = async () => {
    try {
      const res = await fetch("/api/admin/speakers");
      const data = await res.json();
      if (res.ok) setSpeakers(data.speakers || []);
    } catch {
      setError("Failed to load speakers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
    setError("");
  };

  const openEdit = (s: Speaker) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      role: s.role,
      bio: s.bio || "",
      badge: s.badge || "",
      sort_order: s.sort_order,
      is_active: s.is_active,
    });
    setImageFile(null);
    setImagePreview(s.image_url);
    setShowForm(true);
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("bio", form.bio);
      formData.append("badge", form.badge);
      formData.append("sort_order", String(form.sort_order));
      formData.append("is_active", String(form.is_active));
      if (imageFile) formData.append("image", imageFile);
      if (editingId) formData.append("id", editingId);

      const res = await fetch("/api/admin/speakers", {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setShowForm(false);
      fetchSpeakers();
    } catch (err: any) {
      setError(err.message || "Error saving speaker");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this speaker?")) return;
    try {
      const res = await fetch(`/api/admin/speakers?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchSpeakers();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0f2744] text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-blue-200 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold">Manage Speakers</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#0f2744] text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Speaker
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f2744]" />
          </div>
        ) : speakers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No speakers yet.</p>
            <button onClick={openCreate} className="mt-4 text-[#0f2744] font-medium underline">
              Add the first speaker
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {speakers.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                  {s.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-xs font-semibold text-[#0f2744]">
                      {s.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-xs text-teal-600 mt-0.5">{s.role}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{s.bio}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEdit(s)}
                      className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="py-1.5 px-3 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Speaker" : "Add Speaker"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}
                  <label className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
                    Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0f2744]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title *</label>
                <input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0f2744]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#0f2744]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge (e.g. Keynote)</label>
                <input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}