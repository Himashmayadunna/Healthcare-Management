import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";
import { Boxes, PackageSearch, PillBottle, TriangleAlert } from "lucide-react";

const inventoryStats = [
  { label: "Items", value: "312", icon: Boxes },
  { label: "Low Stock", value: "7", icon: TriangleAlert },
  { label: "Medicines", value: "126", icon: PillBottle },
  { label: "Search", value: "1,024", icon: PackageSearch },
];

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Sidebar />

      <main className="relative flex-1 pt-8 pl-64">
        <div className="space-y-6 px-8 py-8">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Inventory</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Inventory</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Track medicines, stock movement, and replenishment alerts.</p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {inventoryStats.map((item) => (
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
            <h2 className="text-lg font-semibold text-slate-950">Inventory Control</h2>
            <p className="mt-2 text-sm text-slate-500">Inventory detail layout can be added once you send the design.</p>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
