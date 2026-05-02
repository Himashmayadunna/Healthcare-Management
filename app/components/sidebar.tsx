import Link from "next/link";

const navItems = [
  { label: "Home", href: "/homepage" },
  { label: "Patients", href: "#patients" },
  { label: "Appointments", href: "#appointments" },
  { label: "Inventory", href: "#inventory" },
  { label: "Reports", href: "#reports" },
];

export default function Sidebar() {
  return (
    <aside className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl" id="reports">
      <Link href="/homepage" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            +
          </span>
          <div>
            <p className="text-sm font-semibold leading-none text-slate-900">Evergreen Hospital</p>
            <p className="text-xs text-slate-500">Healthcare and Inventory</p>
          </div>
      </Link>

      <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Applications</h2>
      <nav className="mt-4 space-y-2 text-sm text-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-xl px-3 py-2 transition hover:bg-slate-50 ${
                item.label === "Home" ? "bg-emerald-50 font-medium text-emerald-700" : "text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">System Module</p>
        <p className="mt-2 text-sm text-emerald-900">Healthcare and inventory operations</p>
      </div>
    </aside>
  );
}
