"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Package,
  Building2,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/homepage", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Appointments", href: "/appointments", icon: Calendar },
  { label: "Prescriptions", href: "/prescriptions", icon: ClipboardList },
  { label: "Inventory", href: "/inventory", icon: Package, badge: true },
  { label: "Suppliers", href: "/suppliers", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 bg-cyan-50 border-r border-cyan-100 p-6 flex flex-col shadow-sm pointer-events-auto">
      <Link href="/homepage" className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">Ω</span>
        <div>
          <p className="text-sm font-bold text-gray-900">MediCore</p>
          <p className="text-xs text-gray-500">HEALTH SUITE</p>
        </div>
      </Link>

      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">WORKSPACE</h2>
      <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                pathname === item.href 
                  ? "bg-cyan-100 font-medium text-teal-700" 
                  : "text-gray-600 hover:bg-cyan-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  3
                </span>
              )}
            </Link>
          ))}
      </nav>

      <div className="rounded-xl bg-teal-500 p-4 text-white">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          <p className="font-semibold text-sm">Need Help?</p>
        </div>
        <p className="text-xs text-teal-50 mt-1">Check our docs and tutorials.</p>
        <button className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-semibold text-teal-600 hover:bg-gray-50 transition">
          View Guide
        </button>
      </div>
    </aside>
  );
}
