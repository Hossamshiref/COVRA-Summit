import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import Link from "next/link";
import { LayoutDashboard, Users, Tag, ShoppingCart, LogOut } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Skip auth check on login page
  // (login page is under /admin/login, handled separately)

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}