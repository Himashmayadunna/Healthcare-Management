import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";
import { ClipboardList, FilePlus2, Pill, ScanSearch } from "lucide-react";

const prescriptionStats = [
  { label: "Issued", value: "42", icon: ClipboardList },
  { label: "Drafts", value: "8", icon: FilePlus2 },
  { label: "Medicines", value: "120", icon: Pill },
  { label: "Checks", value: "15", icon: ScanSearch },
];

export default function PrescriptionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Sidebar />

      <main className="relative flex-1 pt-8 pl-64">
        <div className="space-y-6 px-8 py-8">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Prescriptions</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Prescriptions</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Manage prescriptions, medication lists, and refill history.</p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {prescriptionStats.map((item) => (
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
            <h2 className="text-lg font-semibold text-slate-950">Prescription Workspace</h2>
            <p className="mt-2 text-sm text-slate-500">Share the prescription design and I’ll match it precisely.</p>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
