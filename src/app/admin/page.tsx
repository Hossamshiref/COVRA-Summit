import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import Link from "next/link";
import { Users, Tag, ShoppingCart, Settings, LogOut } from "lucide-react";

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-[#0f2744] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">COVRA Admin</h1>
            <p className="text-xs text-blue-200">Summit Control Panel</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Speakers */}
          <Link
            href="/admin/speakers"
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-[#0f2744]/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0f2744] flex items-center justify-center mb-4 group-hover:bg-[#0f2744] group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Speakers</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add, edit, and manage event speakers and their photos
            </p>
          </Link>

          {/* Promo Codes */}
          <Link
            href="/admin/promo-codes"
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-[#0f2744]/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Promo Codes</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage discount codes for tickets
            </p>
          </Link>

          {/* Orders */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:border-[#0f2744]/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Orders</h3>
            <p className="text-sm text-gray-500 mt-1">
              View all ticket orders and payment status
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}