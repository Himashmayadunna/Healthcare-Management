import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";
import { Building2, Truck, UserCog, Warehouse } from "lucide-react";

const supplierStats = [
  { label: "Suppliers", value: "18", icon: Building2 },
  { label: "Active", value: "14", icon: Warehouse },
  { label: "Deliveries", value: "31", icon: Truck },
  { label: "Contacts", value: "9", icon: UserCog },
];

export default function SuppliersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Sidebar />

      <main className="relative flex-1 pt-8 pl-64">
        <div className="space-y-6 px-8 py-8">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Suppliers</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Suppliers</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Manage vendor relationships, deliveries, and contacts.</p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {supplierStats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-4xl font-bold text-slate-950">{item.value}</p>
                  </div>
                  <item.icon className="h-8 w-8 text-teal-500" />
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Supplier Directory</h2>
            <p className="mt-2 text-sm text-slate-500">This page is ready for the design you provide next.</p>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
